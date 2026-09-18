import { createHash } from 'node:crypto';

const stopWords = new Set('the a an and or of to in for on with from new how what why ai is are'.split(' '));
function tokens(title) { return new Set(title.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(word => word.length > 2 && !stopWords.has(word))); }
function similarity(a, b) { const intersection = [...a].filter(x => b.has(x)).length; return intersection / Math.max(1, Math.min(a.size, b.size)); }
export function eventId(title) { return createHash('sha256').update([...tokens(title)].sort().join('|')).digest('hex').slice(0, 16); }

// Conservative deterministic clustering. It deliberately avoids an LLM here:
// a false merge hides distinct events and is harder to recover than a duplicate.
export function clusterCandidates(candidates) {
  const clusters = [];
  for (const candidate of candidates) {
    const words = tokens(candidate.title);
    const match = clusters.find(cluster => similarity(words, cluster.words) >= 0.65);
    if (match) { match.items.push(candidate); match.sources.add(candidate.source); }
    else clusters.push({ id: eventId(candidate.title), words, items: [candidate], sources: new Set([candidate.source]) });
  }
  return clusters.map(cluster => ({
    id: cluster.id,
    title: cluster.items.sort((a, b) => a.tier - b.tier || a.age_hours - b.age_hours)[0].title,
    items: cluster.items,
    source_count: cluster.sources.size,
  }));
}
