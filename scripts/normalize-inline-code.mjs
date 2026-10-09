import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import { ROOT, filesIn, sourceBody, rebuildCatalog } from './catalog.mjs';

const parser = unified().use(remarkParse).use(remarkGfm);
const write = process.argv.includes('--write');
function nodesOf(text) {
  const nodes = [];
  visit(parser.parse(text), 'inlineCode', (node) => { nodes.push(node); });
  return nodes;
}
const changes = [];
const unresolved = [];
for (const file of await filesIn(path.join(ROOT, 'public/content/pages'), '.json')) {
  const page = JSON.parse(await readFile(file, 'utf8'));
  const id = path.relative(path.join(ROOT, 'public/content/pages'), file).replace(/\.json$/, '.md');
  const source = sourceBody(await readFile(path.join(ROOT, 'source/en', id), 'utf8'));
  const expected = nodesOf(source).map((node) => node.value);
  const expectedCounts = new Map();
  for (const value of expected) expectedCounts.set(value, (expectedCounts.get(value) || 0) + 1);
  const edits = [];
  const used = new Map();
  for (const node of nodesOf(page.markdown)) {
    const start = node.position.start.offset;
    const end = node.position.end.offset;
    if (node.value.includes('``')) {
      const parts = node.value.split('``');
      if (parts.every((part) => expectedCounts.has(part))) {
        edits.push({ start, end, replacement: parts.map((part) => `\`${part}\``).join(' ') });
        parts.forEach((part) => used.set(part, (used.get(part) || 0) + 1));
        continue;
      }
    }
    const occurrences = (used.get(node.value) || 0) + 1;
    used.set(node.value, occurrences);
    if (occurrences > (expectedCounts.get(node.value) || 0)) {
      // Only unwrap formatting introduced by translation. Keep its text verbatim.
      edits.push({ start, end, replacement: node.value });
    }
  }
  if (!edits.length) continue;
  let markdown = page.markdown;
  for (const edit of edits.sort((a, b) => b.start - a.start)) markdown = markdown.slice(0, edit.start) + edit.replacement + markdown.slice(edit.end);
  if (JSON.stringify(nodesOf(markdown).map((node) => node.value).sort()) !== JSON.stringify([...expected].sort())) {
    unresolved.push(page.route);
    continue;
  }
  changes.push({ route: page.route, edits: edits.length });
  if (write) await writeFile(file, JSON.stringify({ ...page, markdown }));
}
if (write) await rebuildCatalog();
await writeFile(path.join(ROOT, 'inline-code-report.json'), JSON.stringify({ mode: write ? 'write' : 'dry-run', changes, unresolved }, null, 2));
console.log(JSON.stringify({ changedPages: changes.length, unresolved }));
