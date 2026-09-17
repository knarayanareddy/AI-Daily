import test from 'node:test';
import assert from 'node:assert/strict';
import { clusterCandidates } from '../workers/briefing/cluster.mjs';
import { approveReviews } from '../workers/briefing/gate.mjs';
import { validateEdition } from '../workers/briefing/schema.mjs';

const item = (title, url = `https://${title.replaceAll(' ', '-')}.example`) => ({ title, url, source: 'Test source', tier: 1, published_at: '2026-09-17T06:00:00Z', age_hours: 1 });

test('clusters repeated coverage of the same event conservatively', () => {
  const result = clusterCandidates([item('Open model launches new reasoning benchmark'), item('Open model launches new reasoning benchmark results'), item('Weather satellite spots storm')]);
  assert.equal(result.length, 2);
  assert.equal(result[0].items.length, 2);
});

test('gate refuses incomplete or vetoed review', () => {
  const cluster = { items: [item('A consequential model release')] };
  assert.equal(approveReviews(cluster, [{ state: 'approved' }, { state: 'approved' }]).state, 'pending');
  assert.equal(approveReviews(cluster, [{ state: 'approved' }, { state: 'approved' }, { state: 'approved' }, { state: 'escalated' }]).state, 'escalated');
});

test('gate accepts four clean evidence-backed reviews', () => {
  const cluster = { items: [item('A model release with evidence')] };
  const claim = { claim: 'A supported model release', supported: true, evidence_urls: [cluster.items[0].url] };
  const reviews = [1, 2, 3, 4].map(() => ({ state: 'approved', scores: { evidence: 4 }, claim_checks: [claim] }));
  assert.equal(approveReviews(cluster, reviews).state, 'approved');
});

test('public edition validation rejects pending stories', () => {
  const base = item('Validated public story');
  assert.throws(() => validateEdition({ edition: 1, run_id: 'x', stories: [{ ...base, claims: [{ claim: 'A validated claim', supported: true, evidence_urls: [base.url] }], review: { state: 'pending', evidence_urls: [base.url] } }] }));
});
