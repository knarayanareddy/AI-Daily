export const REVIEW_STATES = new Set(['approved', 'rejected', 'pending', 'escalated']);

export function assert(condition, message) {
  if (!condition) throw new Error(`Schema validation failed: ${message}`);
}

export function validateCandidate(item) {
  assert(item && typeof item === 'object', 'candidate must be an object');
  assert(typeof item.title === 'string' && item.title.length >= 8 && item.title.length <= 240, 'candidate.title');
  assert(typeof item.url === 'string' && /^https:\/\//.test(item.url), 'candidate.url must use HTTPS');
  assert(typeof item.source === 'string' && item.source.length > 0, 'candidate.source');
  assert(Number.isInteger(item.tier) && item.tier >= 1 && item.tier <= 3, 'candidate.tier');
  assert(!Number.isNaN(Date.parse(item.published_at)), 'candidate.published_at');
  return item;
}

export function validateEdition(edition) {
  assert(edition && typeof edition === 'object', 'edition must be an object');
  assert(typeof edition.edition === 'number', 'edition.edition');
  assert(typeof edition.run_id === 'string' && edition.run_id.length > 0, 'edition.run_id');
  assert(Array.isArray(edition.stories), 'edition.stories');
  for (const story of edition.stories) {
    validateCandidate(story);
    assert(story.review && REVIEW_STATES.has(story.review.state), `story ${story.url} review state`);
    assert(story.review.state === 'approved', `story ${story.url} is not approved`);
    assert(Array.isArray(story.review.evidence_urls) && story.review.evidence_urls.length > 0, `story ${story.url} evidence`);
    assert(Array.isArray(story.claims) && story.claims.length > 0, `story ${story.url} claims`);
    for (const claim of story.claims) {
      assert(typeof claim.claim === 'string' && claim.claim.length >= 8, `story ${story.url} claim text`);
      assert(claim.supported === true, `story ${story.url} unsupported claim`);
      assert(Array.isArray(claim.evidence_urls) && claim.evidence_urls.length > 0, `story ${story.url} claim evidence`);
      assert(claim.evidence_urls.every(url => story.review.evidence_urls.includes(url) || url === story.url), `story ${story.url} claim provenance`);
    }
  }
  return edition;
}
