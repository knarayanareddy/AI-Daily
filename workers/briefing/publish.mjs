import { createHash } from 'node:crypto';
import { readFile, rename, writeFile } from 'node:fs/promises';
import { validateEdition } from './schema.mjs';

const currentUrl = new URL('../../data/news.json', import.meta.url);
const manifestUrl = new URL('../../data/publication-manifest.json', import.meta.url);
const digest = value => createHash('sha256').update(value).digest('hex');

export async function publishEdition(edition) {
  validateEdition(edition);
  const payload = JSON.stringify(edition, null, 2) + '\n';
  const checksum = digest(payload);
  try {
    const existing = JSON.parse(await readFile(currentUrl, 'utf8'));
    if (existing.run_id === edition.run_id && existing.edition === edition.edition) return existing;
  } catch { /* first publication */ }
  const manifest = { schema_version: 1, edition: edition.edition, run_id: edition.run_id, checksum, published_at: edition.published_at, artifact: 'news.json' };
  const tempUrl = new URL(`../../data/.news.${edition.run_id}.tmp.json`, import.meta.url);
  const tempManifestUrl = new URL(`../../data/.publication-manifest.${edition.run_id}.tmp.json`, import.meta.url);
  await writeFile(tempUrl, payload, { flag: 'wx' });
  await writeFile(tempManifestUrl, JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
  await rename(tempUrl, currentUrl);
  await rename(tempManifestUrl, manifestUrl);
  return edition;
}
export async function lastKnownGood() { return JSON.parse(await readFile(currentUrl, 'utf8')); }
