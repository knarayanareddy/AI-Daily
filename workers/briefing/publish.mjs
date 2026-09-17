import { readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateEdition } from './schema.mjs';

const currentUrl = new URL('../../data/news.json', import.meta.url);
export async function publishEdition(edition) {
  validateEdition(edition);
  const tempUrl = new URL(`../../data/.news.${edition.run_id}.tmp.json`, import.meta.url);
  await writeFile(tempUrl, JSON.stringify(edition, null, 2) + '\n', { flag: 'wx' });
  await rename(tempUrl, currentUrl);
  return edition;
}
export async function lastKnownGood() { return JSON.parse(await readFile(currentUrl, 'utf8')); }
