import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseFeed, parseFeedDetailed, retrieveSource } from '../workers/briefing/retrieval.mjs';

const source = { id: 'fixture', name: 'Fixture', url: 'https://fixture.test/feed', tier: 1, category: 'research', license_policy: 'link-and-short-summary', max_age_hours: 36 };
const rss = `<rss><channel><item><title><![CDATA[Measured release]]></title><link>https://example.test/story?utm_source=x&amp;id=1</link><pubDate>Thu, 17 Sep 2026 06:00:00 GMT</pubDate></item></channel></rss>`;

test('parses RSS and canonicalizes tracking parameters', () => {
  const [item] = parseFeed(rss, source, new Date('2026-09-17T07:00:00Z'));
  assert.equal(item.title, 'Measured release');
  assert.equal(item.url, 'https://example.test/story?id=1');
  assert.equal(item.source_id, 'fixture');
  assert.equal(item.evidence_urls[0], item.url);
});

test('reports malformed entry counts for parser-drift detection', () => {
  const parsed = parseFeedDetailed('<rss><channel><item><title>Missing link</title></item><item><title>Missing date</title><link>https://example.test/two</link></item><item><title>Missing both</title></item></channel></rss>', source, new Date('2026-09-17T07:00:00Z'));
  assert.equal(parsed.entries_seen, 3);
  assert.equal(parsed.invalid_entries, 3);
  assert.equal(parsed.candidates.length, 0);
});

test('retries transient retrieval failures and writes conditional cache', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'ai-daily-'));
  let calls = 0;
  const fetchImpl = async (_url, options) => {
    calls++;
    if (calls === 1) throw new Error('temporary');
    return { ok: true, status: 200, headers: new Headers({ etag: 'v1', 'last-modified': 'today' }), arrayBuffer: async () => new TextEncoder().encode(rss).buffer };
  };
  const result = await retrieveSource(source, { cacheDir: new URL(`file://${dir}/`), fetchImpl, now: new Date('2026-09-17T07:00:00Z'), retries: 2 });
  assert.equal(result.status, 'ok');
  assert.equal(calls, 2);
  const cache = JSON.parse(await readFile(`${dir}/fixture.json`, 'utf8'));
  assert.equal(cache.etag, 'v1');
  await rm(dir, { recursive: true, force: true });
});
