import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { clusterCandidates } from './cluster.mjs';
import { deterministicTriage, PERSONAS, buildReviewPrompt } from './review.mjs';
import { buildEdition } from './gate.mjs';
import { publishEdition, lastKnownGood } from './publish.mjs';
import { decisions, getState, migrate } from '../ops-db.mjs';

const root = new URL('../../', import.meta.url);
const dataUrl = name => new URL(`data/${name}`, root);
const lockUrl = dataUrl('.briefing.lock');
const rawArgs = process.argv.slice(2);
const args = new Set(rawArgs);
const runIndex = rawArgs.indexOf('--run-id');
const requestedRun = runIndex >= 0 ? rawArgs[runIndex + 1] : undefined;
const runId = requestedRun || new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 12);
const editionNumber = Number(process.env.EDITION_NUMBER || 0);
const dryRun = args.has('--dry-run');
const skipFetch = args.has('--skip-fetch');

async function exists(url) { try { await access(url); return true; } catch { return false; } }
async function log(stage, status, extra = {}) { console.log(JSON.stringify({ run_id: runId, stage, status, ...extra })); }
async function fetchCandidates() {
  if (skipFetch) return;
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [fileURLToPath(new URL('../../scripts/daily-briefing.mjs', import.meta.url))], { stdio: 'inherit', env: process.env });
    child.on('error', reject); child.on('exit', code => code === 0 ? resolve() : reject(new Error(`fetch stage exited ${code}`)));
  });
}
async function acquireLock() {
  try { await writeFile(lockUrl, JSON.stringify({ run_id: runId, started_at: new Date().toISOString() }), { flag: 'wx' }); }
  catch { throw new Error('Another briefing run owns the lock; refusing to overlap.'); }
}
async function reviewQueue(clusters) {
  const queue = { schema_version: 1, run_id: runId, status: 'awaiting_review', created_at: new Date().toISOString(), review_queue: clusters.map(cluster => ({ cluster_id: cluster.id, triage: deterministicTriage(cluster), prompts: PERSONAS.map(persona => buildReviewPrompt(cluster, persona)) })) };
  await writeFile(dataUrl(`review-queue-${runId}.json`), JSON.stringify(queue, null, 2) + '\n');
  return queue;
}
async function runReviewAdapter() {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [fileURLToPath(new URL('./reviewer-runner.mjs', import.meta.url)), '--run-id', runId], { stdio: 'inherit', env: process.env });
    child.on('error', reject); child.on('exit', code => code === 0 ? resolve() : reject(new Error(`review adapter exited ${code}`)));
  });
}
async function readReviews() {
  const url = dataUrl(`reviews-${runId}.json`);
  if (!await exists(url)) return null;
  const data = JSON.parse(await readFile(url, 'utf8'));
  if (data.run_id !== runId || data.status !== 'validated' || !Array.isArray(data.reviews)) throw new Error('reviews artifact is not a validated matching run');
  return data.reviews;
}

async function main() {
  await acquireLock();
  try {
    await log('lock', 'acquired');
    await fetchCandidates();
    const candidates = JSON.parse(await readFile(dataUrl('candidates.json'), 'utf8'));
    const clusters = clusterCandidates(candidates.stories || []);
    await log('cluster', 'complete', { candidates: candidates.stories?.length || 0, clusters: clusters.length });
    if (clusters.length === 0) {
      await log('review', 'blocked', { reason: 'no fresh clusters; preserving last-known-good edition' });
      return 2;
    }
    await reviewQueue(clusters);
    let reviews = await readReviews();
    if (!reviews) {
      await runReviewAdapter();
      reviews = await readReviews();
    }
    if (!reviews) {
      await log('review', 'blocked', { reason: 'no validated reviews artifact', queue: `data/review-queue-${runId}.json` });
      return 2;
    }
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required before publication; JSON operator-state fallback is disabled');
    const operatorState = (await migrate(), await getState());
    if (operatorState.kill_switch) { await log('publish', 'blocked', { reason: 'operator kill switch is active' }); return 2; }
    const reviewsByCluster = new Map(reviews.map(item => [item.cluster_id, item.reviewers]));
    const operatorDecisions = (await decisions(runId)).map(item => ({ ...item, state: item.decision }));
    const edition = buildEdition({ runId, editionNumber, clusters, reviewsByCluster, operatorDecisions });
    if (dryRun) { await log('publish', 'dry-run', { approved: edition.stories.length }); return 0; }
    await publishEdition(edition);
    await log('publish', 'complete', { approved: edition.stories.length });
    return 0;
  } catch (error) {
    await log('run', 'failed', { error: error.message });
    try { await log('rollback', 'preserved', { edition: (await lastKnownGood()).edition }); } catch { /* first run may have no edition */ }
    return 1;
  } finally { await rm(lockUrl, { force: true }); }
}
const code = await main();
process.exitCode = code;
