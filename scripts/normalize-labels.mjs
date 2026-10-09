import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import { ROOT, filesIn } from './catalog.mjs';

const labels = new Map(Object.entries({
  'GPT-3.5 Fine-tuning Notebook (Colab)': 'GPT-3.5 微調 Notebook（Colab）',
  'GPT-3.5 Fine-tuning Notebook (Notebook link)': 'GPT-3.5 微調 Notebook（Notebook 連結）',
  'GPT-3.5 Fine-tuning Notebook (in Repo)': 'GPT-3.5 微調 Notebook（Repo）',
  '[WIP] Function Calling Fine-tuning': '[WIP] Function Calling 微調',
  'OpenAI Function Calling Fine-tuning': 'OpenAI Function Calling 微調',
  'Llama 2 Text-to-SQL Fine-tuning (w/ Modal, Notebook)': 'Llama 2 Text-to-SQL 微調（Modal、Notebook）',
  'high level concepts': '高層次概念',
  'high-level concepts': '高層次概念',
  'Full Repo': '完整 Repo',
}));
const parser = unified().use(remarkParse).use(remarkGfm);
const textOf = (node) => node.value || (node.children || []).map(textOf).join('');
let changed = 0;
for (const file of await filesIn(path.join(ROOT, 'public/content/pages'), '.json')) {
  const page = JSON.parse(await readFile(file, 'utf8'));
  const edits = [];
  visit(parser.parse(page.markdown), 'link', (node) => {
    if (node.children.some((child) => child.type !== 'text')) return;
    const translated = labels.get(textOf(node));
    if (!translated) return;
    const raw = page.markdown.slice(node.position.start.offset, node.position.end.offset);
    const close = raw.indexOf('](');
    if (raw[0] !== '[' || close < 0) return;
    const escaped = translated.replace(/[\[\]]/g, '\\$&');
    edits.push({ start: node.position.start.offset + 1, end: node.position.start.offset + close, translated: escaped });
  });
  if (!edits.length) continue;
  let markdown = page.markdown;
  for (const edit of edits.reverse()) markdown = markdown.slice(0, edit.start) + edit.translated + markdown.slice(edit.end);
  await writeFile(file, JSON.stringify({ ...page, markdown }));
  changed++;
}
console.log(JSON.stringify({ labelRepairs: changed }));
