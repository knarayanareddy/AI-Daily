import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { XMLParser } from 'fast-xml-parser';
import { enforceRobots, validateSourcePolicy } from './policy.mjs';

const MAX_BYTES = 2 * 1024 * 1024;
const USER_AGENT = 'AI-Daily/1.0 (+https://ai-daily.example; editorial feed reader)';
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_', trimValues: true, processEntities: false, isArray: name => ['item', 'entry', 'link'].includes(name) });

const asArray = value => value == null ? [] : Array.isArray(value) ? value : [value];
const value = item => typeof item === 'object' && item !== null ? (item['#text'] ?? '') : String(item ?? '');
function decodeEntities(input) { return String(input ?? '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'"); }
export function canonicalize(input) {
  try {
    const url = new URL(decodeEntities(input));
    url.hash = '';
    ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','fbclid'].forEach(key => url.searchParams.delete(key));
    return url.toString();
  } catch { return ''; }
}
function linkFrom(entry) {
  const links = asArray(entry.link);
  const alternate = links.find(link => typeof link === 'object' && (!link['@_rel'] || link['@_rel'] === 'alternate')) ?? links[0];
  return canonicalize(typeof alternate === 'object' ? (alternate['@_href'] || value(alternate)) : value(alternate));
}
function stripMarkup(input) { return String(input ?? '').replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(); }
export function parseFeedDetailed(xml, source, now = new Date()) {
  if (Buffer.byteLength(xml, 'utf8') > MAX_BYTES) throw new Error('feed exceeds maximum size');
  let document;
  try { document = parser.parse(xml); } catch { throw new Error('invalid XML feed'); }
  const channel = document.rss?.channel ?? document.feed ?? {};
  const entries = [...asArray(channel.item), ...asArray(document.feed?.entry)];
  const retrievedAt = now.toISOString();
  let invalidEntries = 0;
  const candidates = entries.map(entry => {
    const title = stripMarkup(value(entry.title));
    const url = linkFrom(entry);
    const publishedRaw = value(entry.pubDate) || value(entry.published) || value(entry.updated) || value(entry['dc:date']);
    const publishedAt = new Date(publishedRaw);
    if (!title || !url || Number.isNaN(publishedAt.getTime())) { invalidEntries++; return null; }
    const ageHours = Math.max(0, (now.getTime() - publishedAt.getTime()) / 36e5);
    if (ageHours > Number(source.max_age_hours ?? 36)) return null;
    const raw = `${source.id}|${url}|${publishedAt.toISOString()}`;
    return { id: createHash('sha256').update(raw).digest('hex').slice(0, 20), title: title.slice(0, 240), url, canonical_url: url, source: source.name, source_id: source.id, tier: source.tier, category: source.category, published_at: publishedAt.toISOString(), retrieved_at: retrievedAt, age_hours: Number(ageHours.toFixed(2)), raw_hash: createHash('sha256').update(xml).digest('hex'), license_policy: source.license_policy, evidence_urls: [url] };
  }).filter(Boolean);
  return { candidates, entries_seen: entries.length, invalid_entries: invalidEntries };
}
export function parseFeed(xml, source, now = new Date()) { return parseFeedDetailed(xml, source, now).candidates; }

async function responseText(response) {
  const length = Number(response.headers.get('content-length') || 0);
  if (length > MAX_BYTES) throw new Error(`response exceeds ${MAX_BYTES} bytes`);
  const buffer = await response.arrayBuffer();
  if (buffer.byteLength > MAX_BYTES) throw new Error(`response exceeds ${MAX_BYTES} bytes`);
  return Buffer.from(buffer).toString('utf8');
}
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export async function retrieveSource(source, { cacheDir = new URL('../../data/http-cache/', import.meta.url), now = new Date(), fetchImpl = fetch, retries = 2 } = {}) {
  const sourcePolicy = validateSourcePolicy(source);
  if (!sourcePolicy.allowed) return { source_id: source.id, status: 'policy_blocked', candidates: [], attempts: 0, error: sourcePolicy.errors.join('; ') };
  await mkdir(cacheDir, { recursive: true });
  const robots = await enforceRobots(source, { cacheDir, fetchImpl, now });
  if (!robots.allowed) return { source_id: source.id, status: 'policy_blocked', candidates: [], attempts: 0, error: robots.reason, robots };
  const cacheUrl = new URL(`${source.id}.json`, cacheDir);
  let cache = null;
  try { cache = JSON.parse(await readFile(cacheUrl, 'utf8')); } catch { /* cache miss */ }
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const headers = { accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9', 'user-agent': USER_AGENT };
      if (cache?.etag) headers['if-none-match'] = cache.etag;
      if (cache?.last_modified) headers['if-modified-since'] = cache.last_modified;
      const response = await fetchImpl(source.url, { headers, redirect: 'follow', signal: AbortSignal.timeout(source.timeout_ms ?? 15000) });
      if (response.status === 304 && cache?.body) {
        const parsed = parseFeedDetailed(cache.body, source, now);
        return { source_id: source.id, status: 'not_modified', candidates: parsed.candidates, attempts: attempt + 1, robots, parse: parsed };
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const body = await responseText(response);
      const parsed = parseFeedDetailed(body, source, now);
      const drift = parsed.entries_seen >= 3 && parsed.invalid_entries / parsed.entries_seen >= 0.8;
      await writeFile(cacheUrl, JSON.stringify({ etag: response.headers.get('etag'), last_modified: response.headers.get('last-modified'), fetched_at: now.toISOString(), parse: parsed, body }, null, 2) + '\n');
      return { source_id: source.id, status: drift ? 'parse_drift' : 'ok', candidates: parsed.candidates, attempts: attempt + 1, robots, parse: parsed, error: drift ? `${parsed.invalid_entries}/${parsed.entries_seen} entries failed required fields` : undefined };
    } catch (error) {
      lastError = error;
      if (attempt < retries) await sleep(250 * 2 ** attempt);
    }
  }
  return { source_id: source.id, status: 'error', candidates: [], attempts: retries + 1, error: lastError?.message || 'unknown retrieval error' };
}
