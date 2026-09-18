import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';

const severityRank = { warning: 1, critical: 2 };
const asUrl = value => value instanceof URL ? value : new URL(value);
async function atomicJson(url, payload) {
  const temp = new URL(`.${url.pathname.split('/').pop()}.${Date.now()}.tmp`, url);
  await writeFile(temp, JSON.stringify(payload, null, 2) + '\n', { flag: 'wx' });
  await rename(temp, url);
}

export function summarizeRun({ runId, startedAt, results, candidates }) {
  const succeeded = results.filter(result => result.status === 'ok' || result.status === 'not_modified').length;
  const failed = results.filter(result => result.status === 'error').length;
  const blocked = results.filter(result => result.status === 'policy_blocked').length;
  const drifted = results.filter(result => result.status === 'parse_drift').length;
  const alerts = [];
  if (failed > 0) alerts.push({ severity: failed === results.length ? 'critical' : 'warning', code: 'SOURCE_FAILURE', count: failed, sources: results.filter(result => result.status === 'error').map(result => result.source_id) });
  if (blocked > 0) alerts.push({ severity: 'warning', code: 'SOURCE_POLICY_BLOCK', count: blocked, sources: results.filter(result => result.status === 'policy_blocked').map(result => result.source_id) });
  if (drifted > 0) alerts.push({ severity: 'critical', code: 'PARSER_DRIFT', count: drifted, sources: results.filter(result => result.status === 'parse_drift').map(result => result.source_id) });
  if (succeeded === 0) alerts.push({ severity: 'critical', code: 'NO_SOURCE_SUCCESS' });
  if (candidates.length === 0) alerts.push({ severity: 'warning', code: 'ZERO_FRESH_CANDIDATES' });
  return { schema_version: 1, run_id: runId, started_at: startedAt, completed_at: new Date().toISOString(), status: alerts.some(alert => alert.severity === 'critical') ? 'critical' : alerts.length ? 'degraded' : 'healthy', sources: { total: results.length, succeeded, failed, policy_blocked: blocked, not_modified: results.filter(result => result.status === 'not_modified').length }, candidates: candidates.length, attempts: results.reduce((total, result) => total + result.attempts, 0), alerts, source_results: results.map(result => ({ source_id: result.source_id, status: result.status, candidates: result.candidates.length, attempts: result.attempts, error: result.error, robots: result.robots ? { status: result.robots.status, allowed: result.robots.allowed, warning: result.robots.warning } : undefined })) };
}

export async function writeRunReport(report, dataDir = new URL('../../data/health/', import.meta.url)) {
  dataDir = asUrl(dataDir);
  const historyDir = new URL('history/', dataDir);
  const sourceDir = new URL('sources/', dataDir);
  await Promise.all([mkdir(dataDir, { recursive: true }), mkdir(historyDir, { recursive: true }), mkdir(sourceDir, { recursive: true })]);
  const sourceIndexUrl = new URL('index.json', sourceDir);
  let index = {};
  try { index = JSON.parse(await readFile(sourceIndexUrl, 'utf8')); } catch { /* first run */ }
  const anomalyAlerts = [];
  for (const result of report.source_results) {
    const previousHistory = index[result.source_id]?.candidate_history || [];
    if (previousHistory.length >= 3) {
      const sorted = previousHistory.slice(-7).slice().sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];
      if (result.candidates > Math.max(10, median * 4)) anomalyAlerts.push({ severity: 'warning', code: 'CANDIDATE_SPIKE', sources: [result.source_id], count: result.candidates, baseline_median: median });
      if (result.candidates === 0 && median >= 2) anomalyAlerts.push({ severity: 'warning', code: 'CANDIDATE_DROP', sources: [result.source_id], count: 0, baseline_median: median });
    }
    const previous = index[result.source_id] || { runs: 0, successes: 0, failures: 0, policy_blocks: 0 };
    index[result.source_id] = {
      ...previous,
      last_seen_at: report.completed_at,
      last_status: result.status,
      last_error: result.error || null,
      last_candidates: result.candidates,
      last_attempts: result.attempts,
      runs: previous.runs + 1,
      successes: previous.successes + (result.status === 'ok' || result.status === 'not_modified' ? 1 : 0),
      failures: previous.failures + (result.status === 'error' ? 1 : 0),
      policy_blocks: previous.policy_blocks + (result.status === 'policy_blocked' ? 1 : 0),
      candidate_history: [...(previous.candidate_history || []), result.candidates].slice(-14),
    };
  }
  report.alerts.push(...anomalyAlerts);
  if (anomalyAlerts.length && report.status === 'healthy') report.status = 'degraded';
  await atomicJson(new URL('last-run.json', dataDir), report);
  await atomicJson(new URL(`${report.run_id}.json`, historyDir), report);
  await atomicJson(sourceIndexUrl, index);
  return report;
}

export async function notifyAlerts(report, { fetchImpl = fetch, webhookUrl = process.env.ALERT_WEBHOOK_URL, minSeverity = process.env.ALERT_MIN_SEVERITY || 'critical', stateDir = new URL('../../data/health/', import.meta.url), cooldownMs = Number(process.env.ALERT_COOLDOWN_MS || 21600000) } = {}) {
  const relevant = report.alerts.filter(alert => severityRank[alert.severity] >= (severityRank[minSeverity] || severityRank.critical));
  const stateUrl = new URL('alert-state.json', asUrl(stateDir));
  let state = {};
  try { state = JSON.parse(await readFile(stateUrl, 'utf8')); } catch { /* first alert */ }
  const now = Date.now();
  const escalationAfter = Number(process.env.ALERT_ESCALATE_AFTER || 3);
  const escalationWindowMs = Number(process.env.ALERT_ESCALATION_WINDOW_MS || 86400000);
  const fingerprint = alert => `${alert.code}:${(alert.sources || []).slice().sort().join(',') || 'global'}`;
  const active = new Set(relevant.map(fingerprint));
  const deliver = [];
  for (const alert of relevant) {
    const key = fingerprint(alert);
    const previous = state[key];
    const occurrences = previous && now - Date.parse(previous.first_seen_at || now) <= escalationWindowMs ? previous.occurrences + 1 : 1;
    const escalated = occurrences >= escalationAfter && !previous?.escalated;
    state[key] = { ...(previous || {}), active: true, first_seen_at: previous?.first_seen_at || new Date(now).toISOString(), last_seen_at: new Date(now).toISOString(), occurrences, escalated: previous?.escalated || escalated };
    if (escalated) deliver.push({ ...alert, severity: 'critical', code: `ESCALATED_${alert.code}`, fingerprint: key, kind: 'escalation' });
    else if (!previous || !previous.active || now - Date.parse(previous.last_notified_at || 0) >= cooldownMs) deliver.push({ ...alert, fingerprint: key, kind: previous?.active ? 'reminder' : 'firing' });
  }
  const recoveries = Object.entries(state).filter(([key, value]) => value.active && !active.has(key)).map(([fingerprint]) => ({ severity: 'info', code: 'RECOVERY', fingerprint }));
  if (!webhookUrl) {
    await mkdir(asUrl(stateDir), { recursive: true });
    await atomicJson(stateUrl, state);
    return { attempted: false, reason: 'ALERT_WEBHOOK_URL is not configured', alerts: deliver, recoveries };
  }
  if (!deliver.length && !recoveries.length) return { attempted: false, reason: 'alerts suppressed by cooldown' };
  const lines = [...deliver.map(alert => `${alert.severity.toUpperCase()} ${alert.code}${alert.count ? ` (${alert.count})` : ''}`), ...recoveries.map(alert => `RECOVERY ${alert.fingerprint}`)];
  const text = `AI Daily retrieval ${report.status} · run ${report.run_id}\n${lines.join('\n')}`;
  const payload = process.env.ALERT_WEBHOOK_KIND === 'slack' ? { text } : { event: 'ai_daily_health_alert', text, report: { run_id: report.run_id, status: report.status, alerts: deliver, recoveries } };
  try {
    const response = await fetchImpl(webhookUrl, { method: 'POST', headers: { 'content-type': 'application/json', 'user-agent': 'AI-Daily-observer/1.0' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(5000) });
    if (!response.ok) return { attempted: true, delivered: false, status: response.status, suppressed: false };
    for (const alert of deliver) state[alert.fingerprint] = { ...(state[alert.fingerprint] || {}), active: true, last_notified_at: new Date(now).toISOString(), notification_count: (state[alert.fingerprint]?.notification_count || 0) + 1 };
    for (const recovery of recoveries) delete state[recovery.fingerprint];
    await mkdir(asUrl(stateDir), { recursive: true });
    await atomicJson(stateUrl, state);
    return { attempted: true, delivered: true, sent: deliver.length, recoveries: recoveries.length };
  } catch (error) { return { attempted: true, delivered: false, error: error.message }; }
}
