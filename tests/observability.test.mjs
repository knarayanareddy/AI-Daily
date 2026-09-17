import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { notifyAlerts, summarizeRun, writeRunReport } from '../workers/briefing/observability.mjs';

const result = (source_id, status = 'ok') => ({ source_id, status, candidates: [], attempts: 1 });

test('writes last run, immutable history, and source index', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'ai-daily-health-'));
  const report = summarizeRun({ runId: 'fixture-run', startedAt: '2026-09-17T06:00:00Z', results: [result('one'), result('two', 'error')], candidates: [] });
  await writeRunReport(report, new URL(`file://${dir}/`));
  assert.equal(JSON.parse(await readFile(`${dir}/last-run.json`, 'utf8')).run_id, 'fixture-run');
  assert.equal(JSON.parse(await readFile(`${dir}/history/fixture-run.json`, 'utf8')).status, 'degraded');
  assert.equal(JSON.parse(await readFile(`${dir}/sources/index.json`, 'utf8')).two.failures, 1);
  await rm(dir, { recursive: true, force: true });
});

test('escalates a persistent alert after repeated runs', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'ai-daily-escalation-'));
  const previous = process.env.ALERT_ESCALATE_AFTER;
  process.env.ALERT_ESCALATE_AFTER = '3';
  let payload;
  const report = { run_id: 'escalation-run', status: 'critical', alerts: [{ severity: 'critical', code: 'NO_SOURCE_SUCCESS' }] };
  const fetchImpl = async (_url, options) => { payload = JSON.parse(options.body); return { ok: true, status: 200 }; };
  for (let i = 0; i < 3; i++) await notifyAlerts({ ...report, run_id: `escalation-run-${i}` }, { stateDir: new URL(`file://${dir}/`), webhookUrl: 'https://hooks.test', fetchImpl, cooldownMs: 0 });
  assert.equal(payload.report.alerts[0].code, 'ESCALATED_NO_SOURCE_SUCCESS');
  if (previous === undefined) delete process.env.ALERT_ESCALATE_AFTER; else process.env.ALERT_ESCALATE_AFTER = previous;
  await rm(dir, { recursive: true, force: true });
});

test('delivers critical alerts to a generic webhook and suppresses repeats', async () => {
  let calls = 0;
  const dir = await mkdtemp(join(tmpdir(), 'ai-daily-alerts-'));
  const report = { run_id: 'alert-run', status: 'critical', alerts: [{ severity: 'critical', code: 'NO_SOURCE_SUCCESS' }] };
  const fetchImpl = async () => { calls++; return { ok: true, status: 200 }; };
  const first = await notifyAlerts(report, { stateDir: new URL(`file://${dir}/`), webhookUrl: 'https://hooks.test', fetchImpl });
  const second = await notifyAlerts({ ...report, run_id: 'alert-run-2' }, { stateDir: new URL(`file://${dir}/`), webhookUrl: 'https://hooks.test', fetchImpl });
  assert.equal(first.delivered, true);
  assert.equal(second.reason, 'alerts suppressed by cooldown');
  assert.equal(calls, 1);
  await rm(dir, { recursive: true, force: true });
});
