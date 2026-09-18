import { access, readdir, readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const required = ['index.html', 'archive.html', 'rss.xml', 'sitemap.xml', 'data/editions/2026-09-17.json', 'public/archive.html', 'public/rss.xml', 'public/sitemap.xml', 'public/_headers'];
for (const file of required) await access(new URL(file, root));
const index = await readFile(new URL('index.html', root), 'utf8');
if (!index.includes('<html lang="en">') || !index.includes('id="root"')) throw Error('index.html lacks the required document landmarks');
const rss = await readFile(new URL('rss.xml', root), 'utf8');
if (!rss.includes('<rss') || !rss.includes('<channel>')) throw Error('RSS document is malformed');
const sitemap = await readFile(new URL('sitemap.xml', root), 'utf8');
if (!sitemap.includes('<urlset') || !sitemap.includes('/archive.html')) throw Error('sitemap is missing the archive URL');
for (const file of ['archive.html', 'rss.xml', 'sitemap.xml']) await access(new URL(`dist/${file}`, root));
try {
  const assets = await readdir(new URL('dist/assets/', root));
  const js = assets.filter(file => file.endsWith('.js'));
  const initial = await Promise.all(js.filter(file => file.startsWith('index-')).map(file => readFile(new URL(`dist/assets/${file}`, root), 'utf8')));
  if (initial.some(content => content.includes('forceSimulation') || content.includes('d3-force') || content.includes('@react-three/fiber') || content.includes('WebGLRenderer'))) throw Error('visualization code leaked into the initial bundle');
  if (!assets.some(file => file.startsWith('SignalMapSvg-') && file.endsWith('.js'))) throw Error('2D visualization chunk is missing');
  if (!assets.some(file => file.startsWith('SignalField3d-') && file.endsWith('.js'))) throw Error('3D visualization chunk is missing');
} catch (error) {
  if (error.code === 'ENOENT') throw Error('run npm run build before the frontend release check');
  throw error;
}
console.log(JSON.stringify({ ok: true, checked: required.length, initial_bundle: 'visualization-free', archive: true, rss: true, sitemap: true }));
