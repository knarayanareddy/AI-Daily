import { validateEdition } from './schema.mjs';

export function claimsFromReviews(reviews = []) { return [...new Map(reviews.flatMap(review => review.claim_checks || []).map(check => [check.claim, check])).values()]; }
const HARD_ESCALATE = /health|medical|safety|legal|lawsuit|election|weapon|regulat|breach/i;
export function approveReviews(cluster, reviews) {
  if (!Array.isArray(reviews) || reviews.length !== 4) return { state: 'pending', reason: 'all four reviewer results required' };
  if (HARD_ESCALATE.test(cluster.title)) return { state: 'escalated', reason: 'high-impact topic requires human review' };
  const approved = reviews.filter(review => review.state === 'approved');
  const weakEvidence = reviews.some(review => !review.scores || review.scores.evidence < 3);
  const vetoed = reviews.some(review => review.state === 'rejected' || review.state === 'escalated' || review.red_flag);
  const claims = claimsFromReviews(reviews);
  const unsupportedClaim = claims.length === 0 || claims.some(check => !check.supported || !check.evidence_urls?.length);
  if (vetoed || weakEvidence || unsupportedClaim || approved.length < 3) return { state: 'escalated', reason: vetoed ? 'reviewer veto or red flag' : weakEvidence ? 'evidence score below threshold' : unsupportedClaim ? 'claim lacks supporting evidence' : 'insufficient consensus' };
  if (!cluster.items.length || !cluster.items.some(item => item.url)) return { state: 'escalated', reason: 'no evidence URL' };
  return { state: 'approved', reason: '3 of 4 reviewers approved', evidence_urls: cluster.items.map(item => item.url).slice(0, 4), claims };
}

export function buildEdition({ runId, clusters, reviewsByCluster, operatorDecisions = [] }) {
  const decisions = new Map(operatorDecisions.filter(decision => decision.run_id === runId || !decision.run_id).map(decision => [decision.cluster_id, decision]));
  const stories = clusters.map(cluster => {
    const operatorDecision = decisions.get(cluster.id);
    const automaticReview = approveReviews(cluster, reviewsByCluster.get(cluster.id));
    const operatorClaims = automaticReview.claims || claimsFromReviews(reviewsByCluster.get(cluster.id));
    const review = operatorDecision?.state === 'approved' && operatorClaims.length
      ? { state: 'approved', reason: `operator approved: ${operatorDecision.reason || 'manual review'}`, evidence_urls: cluster.items.map(item => item.url).slice(0, 4), claims: operatorClaims, operator_decision: true }
      : operatorDecision?.state === 'rejected' || operatorDecision?.state === 'escalated'
        ? { state: operatorDecision.state, reason: `operator decision: ${operatorDecision.reason || 'manual review'}`, evidence_urls: cluster.items.map(item => item.url).slice(0, 4), claims: operatorClaims, operator_decision: true }
        : automaticReview;
    return { ...cluster.items[0], event_id: cluster.id, related_sources: cluster.items.map(item => item.url), claims: review.claims || [], review };
  }).filter(story => story.review.state === 'approved');
  const edition = { edition: 0, published_at: new Date().toISOString(), run_id: runId, stories, pipeline: { status: 'reviewed', clusters: clusters.length, approved: stories.length } };
  validateEdition(edition);
  return edition;
}
