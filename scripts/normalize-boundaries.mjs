import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import { ROOT, filesIn, sourceBody } from './catalog.mjs';

const parser = unified().use(remarkParse).use(remarkGfm);
function nodes(text, type) {
  const result = [];
  visit(parser.parse(text), type, (node) => { result.push(node); });
  return result;
}
function code(text) { return nodes(text, 'code').map((node) => text.slice(node.position.start.offset, node.position.end.offset)); }
function inline(text) { return nodes(text, 'inlineCode').map((node) => node.value).sort(); }
const changes = [];
for (const file of await filesIn(path.join(ROOT, 'public/content/pages'), '.json')) {
  const page = JSON.parse(await readFile(file, 'utf8'));
  const id = path.relative(path.join(ROOT, 'public/content/pages'), file).replace(/\.json$/, '.md');
  const original = sourceBody(await readFile(path.join(ROOT, 'source/en', id), 'utf8'));
  const sourceHeadings = nodes(original, 'heading');
  let markdown = page.markdown;
  const targetHeadings = nodes(markdown, 'heading');
  if (sourceHeadings.length !== targetHeadings.length) {
    const protectedRanges = [...nodes(markdown, 'code'), ...nodes(markdown, 'inlineCode')].map((node) => [node.position.start.offset, node.position.end.offset]);
    const edits = [];
    for (const match of markdown.matchAll(/[^\n#](#{2,6}\s+)/g)) {
      const start = match.index + 1;
      if (protectedRanges.some(([from, to]) => start >= from && start < to)) continue;
      edits.push(start);
    }
    for (const start of edits.reverse()) markdown = markdown.slice(0, start) + '\n\n' + markdown.slice(start);
  }
  // At a chunk boundary, a release/package heading can run into the following list item.
  const technicalHeadings = sourceHeadings.map((node) => original.slice(node.position.start.offset, node.position.end.offset))
    .filter((raw) => /^#{2,3}\s+(?:`?llama-index-|\\?\[)/.test(raw)).sort((a, b) => b.length - a.length);
  const edits = [];
  for (const node of nodes(markdown, 'heading')) {
    const raw = markdown.slice(node.position.start.offset, node.position.end.offset);
    const prefix = technicalHeadings.find((heading) => raw.startsWith(heading) && raw.length > heading.length && /^[-*+]\s/.test(raw.slice(heading.length)));
    if (prefix) edits.push(node.position.start.offset + prefix.length);
  }
  for (const start of edits.reverse()) markdown = markdown.slice(0, start) + '\n\n' + markdown.slice(start);
  if (markdown === page.markdown) continue;
  const levels = (text) => nodes(text, 'heading').map((node) => node.depth);
  if (JSON.stringify(levels(original)) !== JSON.stringify(levels(markdown))) throw Error(`Unresolved heading structure: ${page.route}`);
  if (JSON.stringify(code(markdown)) !== JSON.stringify(code(page.markdown)) || JSON.stringify(inline(markdown)) !== JSON.stringify(inline(page.markdown)))
    throw Error(`Boundary repair changed protected code: ${page.route}`);
  await writeFile(file, JSON.stringify({ ...page, markdown }));
  changes.push(page.route);
}
console.log(JSON.stringify({ boundaryRepairs: changes }));
