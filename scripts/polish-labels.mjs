import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import { ROOT } from './catalog.mjs';

const parser = unified().use(remarkParse).use(remarkGfm);
const filename = path.join(ROOT, 'public/content/pages/optimizing/rag_failure_mode_checklist.json');
const page = JSON.parse(await readFile(filename, 'utf8'));
const titles = [
  '1. 檢索幻覺', '2. 選到錯誤的文字區塊（分塊方式不佳）', '3. 索引碎片化',
  '4. 設定偏移（Embedding 不匹配）', '5. Embedding 模型不匹配（模型不適合使用領域）',
  '6. 超出 Context window', '7. 缺少 Metadata 篩選', '8. 未正確理解查詢',
  '9. LLM 回答合成失敗', '10. Embedding 相似度指標不匹配（Cosine score 不等於實際語意）',
  '11. Session 與快取記憶中斷', '12. 可觀測性缺口（黑箱除錯）', '13. 索引生命週期與部署順序',
  '快速診斷流程圖', '延伸閱讀', '本文提及的主要 LlamaIndex 類別',
];
const edits = [];
let index = 0;
visit(parser.parse(page.markdown), 'heading', (node) => {
  if (node.depth !== 2) throw Error('Checklist heading structure changed.');
  edits.push({ start: node.position.start.offset, end: node.position.end.offset, text: '## ' + titles[index++] });
});
if (index !== titles.length) throw Error('Checklist heading count changed.');
visit(parser.parse(page.markdown), 'text', (node) => {
  const labels = { 'Symptoms:': '症狀：', 'Symptoms：': '症狀：', 'Fixes:': '修正方法：', 'Fixes：': '修正方法：' };
  if (labels[node.value]) edits.push({ start: node.position.start.offset, end: node.position.end.offset, text: labels[node.value] });
});
let markdown = page.markdown;
for (const edit of edits.sort((a, b) => b.start - a.start)) markdown = markdown.slice(0, edit.start) + edit.text + markdown.slice(edit.end);
await writeFile(filename, JSON.stringify({ ...page, markdown }));
const colbertFile = path.join(ROOT, 'public/content/pages/module_guides/querying/node_postprocessors/node_postprocessors.json');
const colbert = JSON.parse(await readFile(colbertFile, 'utf8'));
await writeFile(colbertFile, JSON.stringify({ ...colbert, markdown: colbert.markdown.replace('Returns 前 N 個排名最高的 nodes。', '回傳前 N 個排名最高的 nodes。') }));
const milvusFile = path.join(ROOT, 'public/content/pages/integrations/vector_stores/milvusasyncapidemo.json');
const milvus = JSON.parse(await readFile(milvusFile, 'utf8'));
await writeFile(milvusFile, JSON.stringify({ ...milvus, title: 'Milvus Vector Store 非同步 API' }));
console.log('Polished checklist headings, labels, and Milvus title.');
