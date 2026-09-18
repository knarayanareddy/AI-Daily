import { mkdir, readFile, writeFile } from 'node:fs/promises';

const AGENT = 'AI-Daily';
function parseRules(text) {
  const groups = [];
  let current = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, '').trim();
    if (!line) continue;
    const [key, ...rest] = line.split(':');
    const value = rest.join(':').trim();
    if (key.toLowerCase() === 'user-agent') { current = { agents: [value.toLowerCase()], allow: [], disallow: [] }; groups.push(current); }
    else if (current && key.toLowerCase() === 'allow') current.allow.push(value);
    else if (current && key.toLowerCase() === 'disallow') current.disallow.push(value);
  }
  return groups;
}
function matches(path, rule) { return rule && path.startsWith(rule.replaceAll('*', '')); }
export function robotsAllows(robotsText, targetUrl) {
  const groups = parseRules(robotsText);
  const selected = groups.filter(group => group.agents.includes('*') || group.agents.includes(AGENT.toLowerCase()));
  if (!selected.length) return { allowed: true, reason: 'no applicable robots group' };
  const path = new URL(targetUrl).pathname;
  const rules = selected.flatMap(group => [...group.disallow.map(pathRule => ({ allowed: false, path: pathRule })), ...group.allow.map(pathRule => ({ allowed: true, path: pathRule }))]).filter(rule => matches(path, rule.path)).sort((a, b) => b.path.length - a.path.length);
  return rules[0] ? { allowed: rules[0].allowed, reason: `robots ${rules[0].allowed ? 'allow' : 'disallow'} rule matched` } : { allowed: true, reason: 'no matching robots rule' };
}

export function validateSourcePolicy(source) {
  const errors = [];
  try { const url = new URL(source.url); if (url.protocol !== 'https:') errors.push('feed URL must use HTTPS'); if (!source.id || !/^[a-z0-9-]+$/.test(source.id)) errors.push('source id must be lowercase kebab-case'); } catch { errors.push('feed URL is invalid'); }
  if (![1, 2, 3].includes(source.tier)) errors.push('tier must be 1, 2, or 3');
  if (!source.license_policy) errors.push('license_policy is required');
  if (!Number.isFinite(source.max_age_hours) || source.max_age_hours <= 0 || source.max_age_hours > 168) errors.push('max_age_hours must be 0–168');
  return { allowed: errors.length === 0, errors };
}

export async function enforceRobots(source, { cacheDir, fetchImpl = fetch, now = new Date() } = {}) {
  const policy = source.robots_policy || 'best-effort';
  const robotsUrl = new URL('/robots.txt', source.url).toString();
  const cacheUrl = new URL(`${source.id}-robots.json`, cacheDir);
  let cache = null;
  try { cache = JSON.parse(await readFile(cacheUrl, 'utf8')); } catch { /* no cache */ }
  if (cache && Date.parse(cache.checked_at) > now.getTime() - 86400000) return { ...robotsAllows(cache.body, source.url), status: 'cached', robots_url: robotsUrl };
  try {
    const response = await fetchImpl(robotsUrl, { headers: { 'user-agent': `${AGENT}/1.0` }, signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const body = await response.text();
    await mkdir(cacheDir, { recursive: true });
    await writeFile(cacheUrl, JSON.stringify({ checked_at: now.toISOString(), body }, null, 2) + '\n');
    return { ...robotsAllows(body, source.url), status: 'fresh', robots_url: robotsUrl };
  } catch (error) {
    if (policy === 'required') return { allowed: false, status: 'unavailable', reason: `robots unavailable: ${error.message}`, robots_url: robotsUrl };
    return { allowed: true, status: 'unavailable', reason: `best-effort bypass: ${error.message}`, robots_url: robotsUrl, warning: true };
  }
}
