import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import { ROOT, filesIn, sourceBody } from './catalog.mjs';

const parser = unified().use(remarkParse).use(remarkGfm);
const textOf = (node) => node.value || (node.children || []).map(textOf).join('');
function tables(markdown) {
  const result = [];
  visit(parser.parse(markdown), 'table', (node) => { result.push(node); });
  return result;
}
const header = (node) => node.children[0].children.map(textOf);
const restored = [];
const unmatched = [];
for (const file of await filesIn(path.join(ROOT, 'public/content/pages'), '.json')) {
  const page = JSON.parse(await readFile(file, 'utf8'));
  const id = path.relative(path.join(ROOT, 'public/content/pages'), file).replace(/\.json$/, '.md');
  const original = sourceBody(await readFile(path.join(ROOT, 'source/en', id), 'utf8'));
  const targets = tables(page.markdown);
  const edits = [];
  for (const source of tables(original)) {
    const columns = header(source);
    if (columns[0] || !columns.some((name) => /^(?:restaurant_id|DogsAllowed|awards|metacritic|fullplot)$/i.test(name))) continue;
    const target = targets.find((node) => JSON.stringify(header(node)) === JSON.stringify(columns));
    if (!target) { unmatched.push({ route: page.route, columns }); continue; }
    const from = page.markdown.slice(target.position.start.offset, target.position.end.offset);
    const to = original.slice(source.position.start.offset, source.position.end.offset);
    if (from !== to) edits.push({ start: target.position.start.offset, end: target.position.end.offset, to });
  }
  if (!edits.length) continue;
  let markdown = page.markdown;
  for (const edit of edits.sort((a, b) => b.start - a.start)) markdown = markdown.slice(0, edit.start) + edit.to + markdown.slice(edit.end);
  await writeFile(file, JSON.stringify({ ...page, markdown }));
  restored.push({ route: page.route, tables: edits.length });
}
await writeFile(path.join(ROOT, 'example-normalization-report.json'), JSON.stringify({ restored, unmatched }, null, 2));
console.log(JSON.stringify({ restored, unmatched }));
