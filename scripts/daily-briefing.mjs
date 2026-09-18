import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { retrieveSource } from '../workers/briefing/retrieval.mjs';
import { notifyAlerts, summarizeRun, writeRunReport } from '../workers/briefing/observability.mjs';
import { validateCandidate } from '../workers/briefing/schema.mjs';

const root = new URL('../', import.meta.url);
const sourceRegistry = JSON.parse(await readFile(new URL('data/sources.json', root), 'utf8')).filter(source => source.enabled !== false);
let operatorState = { paused_sources: [], kill_switch: false };
try { operatorState = JSON.parse(await readFile(new URL('../data/operator-state.json', import.meta.url), 'utf8')); } catch { /* no operator overrides */ }
const sources = sourceRegistry.filter(source => !operatorState.paused_sources?.includes(source.id));
const now = new Date();
const startedAt = now.toISOString();
const runId = now.toISOString().replace(/[-:TZ.]/g, '').slice(0, 12);
const results = await Promise.all(sources.map(source => retrieveSource(source)));
const seen = new Set();
const candidates = results.flatMap(result => result.candidates).filter(candidate => {
  if (seen.has(candidate.canonical_url)) return false;
  seen.add(candidate.canonical_url);
  try { validateCandidate(candidate); return true; } catch (error) { console.warn(`Dropped invalid candidate: ${error.message}`); return false; }
}).sort((a, b) => (a.tier - b.tier) || (a.age_hours - b.age_hours)).slice(0, 100);
const report = summarizeRun({ runId, startedAt, results, candidates });
await writeRunReport(report);
const notification = await notifyAlerts(report);
if (notification.attempted && !notification.delivered) console.warn(JSON.stringify({ run_id: runId, stage: 'observability', status: 'alert_delivery_failed', error: notification.error || `HTTP ${notification.status}` }));
if (report.sources.succeeded === 0) {
  console.error(JSON.stringify({ run_id: runId, stage: 'retrieve', status: 'failed', ...report }));
  throw new Error('All sources failed; refusing to replace candidate artifact');
}
const output = { schema_version: 2, edition: 0, collected_at: now.toISOString(), run_id: runId, stories: candidates, pipeline: { status: 'awaiting_review', health_status: report.status, sources_scanned: report.sources.total, sources_succeeded: report.sources.succeeded, sources_failed: report.sources.failed, candidates: report.candidates } };
const dataDir = new URL('../data/', import.meta.url);
await mkdir(dataDir, { recursive: true });
const temp = new URL(`.candidates.${runId}.tmp.json`, dataDir);
await writeFile(temp, JSON.stringify(output, null, 2) + '\n', { flag: 'wx' });
await rename(temp, new URL('candidates.json', dataDir));
console.log(JSON.stringify({ run_id: runId, stage: 'retrieve', status: 'complete', ...report }));
