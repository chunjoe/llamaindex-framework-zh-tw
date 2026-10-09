import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { ROOT } from './catalog.mjs';

const audit = JSON.parse(await readFile(path.join(ROOT, 'translation-audit-report.json'), 'utf8'));
const translations = [
  '- 在 router query engine 中支援 multi-selector (#6518)\n- 在 router query engine 中透過 OpenAI function calling API 支援 pydantic selector (#6518)\n- 在 `CondenseQuestionChatEngine` 與 `SimpleChatEngine` 中支援串流回應 (#6524)\n- 在 `QdrantVectorStore` 中支援 metadata 篩選 (#6476)\n- 新增 `PGVectorStore`，支援搭配 pgvector 的 postgres (#6190)\n',
  '- 改善 mbox reader 的錯誤處理 (#6248)\n- 修正使用 weaviate 時 similarity score 為空的問題 (#6512)\n- 修正 `PrevNextNodePostprocessor` 中 nodes 的排序 (#6048)\n',
  '- 新增使用 OpenAI Function API 的 query planning tool (#6520)\n- 文件：新增 kg+vector index 範例 (#6497)\n- 設定 Cohere 與 AI21（J2 model）的 Context window 大小 (#6485)\n',
  '- 新增 Cohere 與 AI21 的預設輸入大小 (#6485)\n- 文件：將 dict 物件中的逗號改為冒號 (#6439)\n- 調整 prompt 中多餘的空格與錯誤訊息 (#6443)\n- \\[Issue 6417] 修正 prompt\\_templates 文件頁面 (#6499)\n- 移除 monkey patch，並更新 model 與 Context window 的對應關係 (#6490)\n',
  '- 更新 mongo 介面 (#6501)\n- 補上之前遺漏的 openai pydantic program 修正 (#6503) (#6504)\n- 修正 Airbyte notebook 中的 github 圖片 (#6493)\n',
  '- 在 weaviate 中新增 node doc\\_id 篩選 (#6467)\n- 新增 `TokenCountingCallback`，可自訂並追蹤 embedding、prompt 與 completion 的 token 用量 (#6440)\n- OpenAI Retrieval Function Agent (#6491)\n',
  '- 棄用目前的 token 追蹤方式（llm predictor 與 embed model 未來將不再追蹤 tokens，請改用 `TokenCountingCallback` (#6440)\n- 在 Simple Vector Store 中新增 maximal marginal relevance，可透過 query mode 啟用 (#6446)\n',
  '- `as_chat_engine` 正確繼承目前的 service context (#6470)\n- 從 pinecone 刪除資料時使用 namespace (#6475)\n- 修正 Windows 上使用 fsspec 時的路徑 (#3778)\n- 修正 `SimpleDirectoryReader` 使用自訂 file readers 的問題 (#6477)\n- 編修 MMR Notebook (#6486)\n- FLARE 修正 (#6484)\n',
  '- 改善 Pinecone 與 Weaviate 對已有資料之 vector store 的支援，例如允許設定 text key。 (#6393)\n- 支援 Pineone 的批次 upsert (#6393)\n- 新增初步的 [guidance](https://github.com/microsoft/guidance/) 整合。新增 `GuidancePydanticProgram` 以產生一般結構化輸出，並新增 `GuidanceQuestionGenerator`，在 `SubQuestionQueryEngine` 中產生子問題 (#6246)。\n',
  '- 新增 `SQLJoinQueryEngine`（`SQLAutoVectorQueryEngine` 的泛化版本）(#6265)\n- 新增底層 graph stores 支援，並初步支援 Nebula KG。後續將提供更多文件！ (#2581)\n- 新增 guideline evaluator，讓 llm 能依照使用者的 guidelines 提供回饋 (#4664)\n- 新增 MongoDB Vector stores 支援，以使用 Atlas knnbeta search (#6379)\n- 新增 CitationQueryEngine，在回應文字中提供來源的 inline citations (#6239)\n',
];
const file = path.join(ROOT, 'public/content/pages/changelog.json');
const page = JSON.parse(await readFile(file, 'utf8'));
let markdown = page.markdown;
if (audit.candidates.length && (audit.candidates.length !== translations.length || audit.candidates.some((item) => item.route !== '/python/framework/changelog/')))
  throw Error('Manual correction audit no longer matches the reviewed changelog snippets.');
const corrections = audit.candidates.map((item, index) => ({ route: item.route, from: item.text, to: translations[index] }));
for (const item of corrections) {
  if (!markdown.includes(item.from)) throw Error('Reviewed changelog snippet changed before correction.');
  markdown = markdown.replace(item.from, item.to);
}
await writeFile(file, JSON.stringify({ ...page, markdown }));
if (corrections.length) await writeFile(path.join(ROOT, 'source/manual-corrections.json'), JSON.stringify(corrections, null, 2));
console.log(JSON.stringify({ reviewedCorrections: corrections.length }));
