import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('../src/app.css', import.meta.url), 'utf8');
const checks = [
  ['mobile breakpoint', /@media\(max-width:800px\)/],
  ['fluid map canvas', /\.map-canvas svg\{[^}]*width:100%/],
  ['single-column mobile list', /@media\(max-width:800px\).*?\.map-list\{grid-template-columns:1fr\}/s],
  ['reduced-motion override', /@media\(prefers-reduced-motion: reduce\)/],
  ['skip-link focus state', /\.skip-link:focus/],
];
const failed = checks.filter(([, pattern]) => !pattern.test(css)).map(([name]) => name);
if (failed.length) throw Error(`frontend device checks failed: ${failed.join(', ')}`);
console.log(JSON.stringify({ ok: true, checked: checks.map(([name]) => name), target: 'mobile-and-reduced-motion-layout-contract' }));
