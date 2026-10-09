import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import { ROOT, filesIn, sourceBody } from './catalog.mjs';

const parser = unified().use(remarkParse).use(remarkGfm);
function headingsOf(text) {
  const headings = [];
  visit(parser.parse(text), 'heading', (node) => { headings.push(node); });
  return headings;
}
function textOf(node) { return node.value || (node.children || []).map(textOf).join(''); }
function slug(text) {
  return text.replace(/<[^>]+>/g, '').replace(/[`*_~]/g, '').replace(/&amp;/g, 'and').trim().toLowerCase().normalize('NFKD')
    .replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}
let changed = 0;
const failures = [];
for (const file of await filesIn(path.join(ROOT, 'public/content/pages'), '.json')) {
  const page = JSON.parse(await readFile(file, 'utf8'));
  const id = path.relative(path.join(ROOT, 'public/content/pages'), file).replace(/\.json$/, '.md');
  const source = headingsOf(sourceBody(await readFile(path.join(ROOT, 'source/en', id), 'utf8')));
  const translated = headingsOf(page.markdown);
  if (JSON.stringify(source.map((node) => node.depth)) !== JSON.stringify(translated.map((node) => node.depth))) {
    failures.push(page.route);
    continue;
  }
  const used = new Map();
  const headings = translated.map((node, index) => {
    const sourceText = textOf(source[index]);
    const explicit = sourceText.match(/\{#([^}]+)\}/)?.[1];
    const base = explicit || slug(sourceText.replace(/\s*\{#[^}]+\}\s*$/, '')) || `section-${index + 1}`;
    const count = used.get(base) || 0;
    used.set(base, count + 1);
    return { level: node.depth, id: count ? `${base}-${count}` : base, text: textOf(node).replace(/\s*\{#[^}]+\}\s*$/, '').trim() };
  });
  if (JSON.stringify(headings) !== JSON.stringify(page.headings)) {
    await writeFile(file, JSON.stringify({ ...page, headings }));
    changed += 1;
  }
}
console.log(JSON.stringify({ changedPages: changed, failures }));
if (failures.length) process.exitCode = 1;
