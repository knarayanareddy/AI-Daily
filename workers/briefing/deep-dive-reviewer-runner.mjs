import { readFile, writeFile } from 'node:fs/promises';
import { completeJson, ProviderConfigurationError } from './provider.mjs';
import { DEEP_DIVE_PERSONAS, buildDeepDivePrompt, validateDeepDiveReview, deepDiveConsensus } from './deep-dive-review.mjs';

const root = new URL('../../', import.meta.url);
const args = process.argv.slice(2);
const queueArg = args.indexOf('--queue');
const outputArg = args.indexOf('--output');
const queuePath = queueArg >= 0 ? args[queueArg + 1] : 'data/deep-dive-queue.json';
const outputPath = outputArg >= 0 ? args[outputArg + 1] : 'data/deep-dive-reviews.json';
const readUrl = path => new URL(path, root);
const queue = JSON.parse(await readFile(readUrl(queuePath), 'utf8'));
const candidate = queue.deep_dive || queue;
const results = [];

try {
  const reviewed = await Promise.all(DEEP_DIVE_PERSONAS.map(async persona => {
    const prompt = buildDeepDivePrompt(candidate, persona);
    const raw = await completeJson({ messages: [
      { role: 'system', content: 'You are an independent AI Daily deep-dive council reviewer. Return one JSON object only. Do not invent evidence, quotes, experts, or consensus.' },
      { role: 'user', content: JSON.stringify(prompt) },
    ], schemaName: 'ai-daily-deep-dive-review-v1' });
    return { ...validateDeepDiveReview(raw), persona: persona.id, role: persona.role, prompt_version: 'deep-dive-v1', model: process.env.AI_PROVIDER_MODEL || 'mock', reviewed_at: new Date().toISOString() };
  }));
  results.push(...reviewed);
  const consensus = deepDiveConsensus(results);
  await writeFile(readUrl(outputPath), JSON.stringify({ schema_version: 1, status: 'validated', candidate_id: candidate.story_event_id, reviews: results, consensus }, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({ stage: 'deep-dive-review', status: 'validated', personas: results.length, consensus }));
} catch (error) {
  if (error instanceof ProviderConfigurationError) console.error(`Deep-dive review blocked: ${error.message}`);
  else console.error(`Deep-dive review failed: ${error.message}`);
  process.exitCode = 2;
}
