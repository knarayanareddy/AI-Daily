import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { validateEdition } from './schema.mjs';

const dataRoot = new URL('../../data/', import.meta.url);
const currentUrl = new URL('publications/current.json', dataRoot);
const legacyUrl = new URL('news.json', dataRoot);
const manifestUrl = new URL('publication-manifest.json', dataRoot);
const publicationsUrl = new URL('publications/', dataRoot);
const digest = value => createHash('sha256').update(value).digest('hex');

export async function publishEdition(edition) {
  validateEdition(edition);
  await mkdir(publicationsUrl, { recursive: true });
  const payload = JSON.stringify(edition, null, 2) + '\n';
  const checksum = digest(payload);
  try {
    const existing = JSON.parse(await readFile(currentUrl, 'utf8'));
    if (existing.run_id === edition.run_id && existing.edition === edition.edition) return existing;
  } catch { /* first publication or legacy installation */ }
  const artifactName = `${edition.edition}-${edition.run_id}.json`;
  const artifactUrl = new URL(artifactName, publicationsUrl);
  const tempArtifactUrl = new URL(`.${artifactName}.tmp`, publicationsUrl);
  const tempCurrentUrl = new URL('.current.json.tmp', publicationsUrl);
  const manifest = { schema_version: 2, edition: edition.edition, run_id: edition.run_id, checksum, published_at: edition.published_at, artifact: `publications/${artifactName}` };
  const pointerPayload = JSON.stringify({ ...edition, publication: manifest }, null, 2) + '\n';
  await writeFile(tempArtifactUrl, payload, { flag: 'wx' });
  await rename(tempArtifactUrl, artifactUrl);
  // The current pointer is the sole atomic read boundary. An interrupted run
  // can leave an unused immutable artifact, but cannot expose a half-written edition.
  await writeFile(tempCurrentUrl, pointerPayload, { flag: 'wx' });
  await rename(tempCurrentUrl, currentUrl);
  await writeFile(manifestUrl, JSON.stringify(manifest, null, 2) + '\n');
  await writeFile(legacyUrl, payload);
  return edition;
}
export async function lastKnownGood() { return JSON.parse(await readFile(currentUrl, 'utf8')); }
