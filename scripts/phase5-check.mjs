import { gzipSync } from 'node:zlib';
import { readdir, readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const source = await readFile(new URL('src/components/SignalField3d.tsx', root), 'utf8');
const required = [
  ['demand rendering', 'frameloop="demand"'],
  ['low-power WebGL', "powerPreference: 'low-power'"],
  ['WebGL fallback', '3D is unavailable here'],
  ['accessible list', 'Accessible Signal Field story list'],
  ['reduced motion', 'prefers-reduced-motion'],
  ['Evidence Desk selection path', 'onSelect(story)'],
];
const missing = required.filter(([, needle]) => !source.includes(needle)).map(([name]) => name);
if (missing.length) throw Error(`3D contract checks failed: ${missing.join(', ')}`);
const assets = await readdir(new URL('dist/assets/', root));
const fieldAsset = assets.find(file => file.startsWith('SignalField3d-') && file.endsWith('.js'));
if (!fieldAsset) throw Error('Signal Field production chunk is missing');
const field = await readFile(new URL(`dist/assets/${fieldAsset}`, root));
const gzipBytes = gzipSync(field).byteLength;
if (gzipBytes > 270 * 1024) throw Error(`Signal Field chunk exceeds 270 KB gzip: ${gzipBytes}`);
const initial = await Promise.all(assets.filter(file => file.startsWith('index-') && file.endsWith('.js')).map(file => readFile(new URL(`dist/assets/${file}`, root), 'utf8')));
if (initial.some(content => content.includes('WebGLRenderer') || content.includes('three.module'))) throw Error('3D runtime code leaked into the initial bundle');
console.log(JSON.stringify({ ok: true, contract_checks: required.length, signal_field_gzip_bytes: gzipBytes, initial_bundle: '3d-free', fallback: true }));
