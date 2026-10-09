import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import { ROOT, filesIn, sourceBody, rebuildCatalog } from './catalog.mjs';

const parser = unified().use(remarkParse).use(remarkGfm);
const cache = new Map();
const failures = [];
async function download(raw, base) {
  const url = new URL(raw, base).href;
  if (cache.has(url)) return cache.get(url);
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
    if (!response.ok) throw Error(`HTTP ${response.status}`);
    const type = response.headers.get('content-type') || '';
    if (!type.startsWith('image/')) throw Error(`Non-image content: ${type}`);
    let extension = path.extname(new URL(url).pathname);
    if (!/^\.(svg|png|gif|jpe?g|webp|avif|bmp)$/i.test(extension)) extension = `.${type.split('/')[1].split(';')[0].replace('svg+xml', 'svg').replace('jpeg', 'jpg')}`;
    const filename = createHash('sha1').update(url).digest('hex').slice(0, 12) + extension;
    await writeFile(path.join(ROOT, 'public/assets', filename), Buffer.from(await response.arrayBuffer()));
    const local = `/assets/${filename}`;
    cache.set(url, local);
    return local;
  } catch (error) {
    failures.push({ url, error: error.message });
    cache.set(url, null);
    return null;
  }
}
let changed = 0;
for (const file of await filesIn(path.join(ROOT, 'public/content/pages'), '.json')) {
  const page = JSON.parse(await readFile(file, 'utf8'));
  const tree = parser.parse(page.markdown);
  const images = [];
  const html = [];
  const textNodes = [];
  visit(tree, 'image', (node) => { images.push(node); });
  visit(tree, 'html', (node) => { html.push(node); });
  visit(tree, 'text', (node) => { textNodes.push(node); });
  const edits = [];
  for (const node of images) {
    if (node.url.startsWith('/assets/') || node.url.startsWith('data:')) continue;
    const local = await download(node.url, page.sourceUrl);
    edits.push({ start: node.position.start.offset, end: node.position.end.offset,
      text: local ? `![${node.alt || ''}](${local}${node.title ? ` ${JSON.stringify(node.title)}` : ''})` : (node.alt || '圖片無法從原站取得') });
  }
  for (const node of html) {
    let value = node.value;
    for (const match of node.value.matchAll(/\bsrc=(['"])(.*?)\1/g)) {
      if (match[2].startsWith('/assets/') || match[2].startsWith('data:')) continue;
      const local = await download(match[2], page.sourceUrl);
      value = value.replace(match[0], local ? `src=${match[1]}${local}${match[1]}` : '');
    }
    if (value !== node.value) edits.push({ start: node.position.start.offset, end: node.position.end.offset, text: value });
  }
  // Recover images replaced by alt text during the initial export download.
  // remark decodes escaped URL characters, including GitBook's "\\&token".
  const id = path.relative(path.join(ROOT, 'public/content/pages'), file).replace(/\.json$/, '.md');
  const originalImages = [];
  visit(parser.parse(sourceBody(await readFile(path.join(ROOT, 'source/en', id), 'utf8'))), 'image', (node) => { originalImages.push(node); });
  const available = new Map();
  for (const image of images) available.set(image.alt, (available.get(image.alt) || 0) + 1);
  const consumed = new Set();
  for (const image of originalImages) {
    if (available.get(image.alt)) { available.set(image.alt, available.get(image.alt) - 1); continue; }
    if (!image.alt) continue;
    const candidate = textNodes.find((node) => !consumed.has(node) && (node.value === image.alt || node.value.startsWith(`${image.alt} `))
      && page.markdown.slice(node.position.start.offset, node.position.start.offset + image.alt.length) === image.alt);
    if (!candidate) continue;
    consumed.add(candidate);
    const local = await download(image.url, page.sourceUrl);
    if (local) edits.push({ start: candidate.position.start.offset, end: candidate.position.start.offset + image.alt.length,
      text: `![${image.alt}](${local})` });
  }
  if (!edits.length) continue;
  let markdown = page.markdown;
  for (const edit of edits.sort((a, b) => b.start - a.start)) markdown = markdown.slice(0, edit.start) + edit.text + markdown.slice(edit.end);
  await writeFile(file, JSON.stringify({ ...page, markdown }));
  changed += 1;
}
await rebuildCatalog();
await writeFile(path.join(ROOT, 'asset-report.json'), JSON.stringify({ changedPages: changed, assets: Object.fromEntries(cache), failures }, null, 2));
console.log(JSON.stringify({ changedPages: changed, downloadedAssets: [...cache.values()].filter(Boolean).length, failures }));
