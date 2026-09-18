import { readFile, writeFile } from 'node:fs/promises';
import { completeJson, ProviderConfigurationError } from './provider.mjs';
import { PERSONAS, buildReviewMessages, validateReview } from './review.mjs';

const root = new URL('../../', import.meta.url);
const dataUrl = name => new URL(`data/${name}`, root);
const args = process.argv.slice(2);
const runArg = args.indexOf('--run-id');
const runId = runArg >= 0 ? args[runArg + 1] : new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 12);
const queue = JSON.parse(await readFile(dataUrl(`review-queue-${runId}.json`), 'utf8'));
const results = [];

async function reviewOne(entry, persona) {
  const messages = buildReviewMessages(entry, persona);
  const raw = await completeJson({ messages, schemaName: 'ai-daily-review-v1' });
  const review = validateReview(raw, entry.prompts.find(prompt => prompt.persona === persona)?.cluster?.items || []);
  return { ...review, persona, prompt_version: 'review-v1', model: process.env.AI_PROVIDER_MODEL || 'mock', reviewed_at: new Date().toISOString() };
}

try {
  for (const entry of queue.review_queue) {
    const reviewers = await Promise.all(PERSONAS.map(persona => reviewOne(entry, persona)));
    results.push({ cluster_id: entry.cluster_id, reviewers });
  }
  await writeFile(dataUrl(`reviews-${runId}.json`), JSON.stringify({ schema_version: 1, run_id: runId, status: 'validated', reviews: results }, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({ run_id: runId, stage: 'review', status: 'validated', clusters: results.length, reviewers: results.length * PERSONAS.length }));
} catch (error) {
  if (error instanceof ProviderConfigurationError) console.error(`Review blocked: ${error.message}`);
  else console.error(`Review failed: ${error.message}`);
  process.exitCode = 2;
}
