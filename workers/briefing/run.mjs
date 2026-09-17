import { readFile, writeFile } from 'node:fs/promises';
import { clusterCandidates } from './cluster.mjs';
import { deterministicTriage, PERSONAS, buildReviewPrompt } from './review.mjs';

const candidatesUrl = new URL('../../data/candidates.json', import.meta.url);
const runId = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 12);
const candidates = JSON.parse(await readFile(candidatesUrl, 'utf8'));
const clusters = clusterCandidates(candidates.stories || []);
const reviewQueue = clusters.map(cluster => ({ cluster_id: cluster.id, prompts: PERSONAS.map(persona => buildReviewPrompt(cluster, persona)), triage: deterministicTriage(cluster) }));
await writeFile(new URL(`../../data/review-queue-${runId}.json`, import.meta.url), JSON.stringify({ run_id: runId, status: 'awaiting_review', review_queue: reviewQueue }, null, 2) + '\n');
console.log(`Prepared ${clusters.length} clusters and ${reviewQueue.length * PERSONAS.length} reviewer prompts. No stories published: provider adapter is not configured.`);
