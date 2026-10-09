import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { ROOT } from './catalog.mjs';

const dist = path.join(ROOT, 'dist');
const html = await readFile(path.join(dist, 'index.html'), 'utf8');
const manifest = JSON.parse(await readFile(path.join(dist, 'content/manifest.json'), 'utf8'));
for (const page of manifest.pages) {
  const filename = path.resolve(dist, page.route.replace(/^\/+/, ''), 'index.html');
  if (!filename.startsWith(dist + path.sep)) throw Error(`Route outside static output: ${page.route}`);
  await mkdir(path.dirname(filename), { recursive: true });
  await writeFile(filename, html);
}
console.log(`Static route entry files: ${manifest.pages.length}`);
