---
title: "變更紀錄"
---

## \[2026-08-19]

### llama-index-core \[0.14.24]

- fix: 關閉 HotpotQA evaluator 的檔案控制代碼 ([#22113](https://github.com/run-llama/llama_index/pull/22113))
- fix(core): 在 CodeSplitter 中保留過大的 leaf nodes ([#22119](https://github.com/run-llama/llama_index/pull/22119))
- fix: 保留多區塊的聊天紀錄寫入 ([#22124](https://github.com/run-llama/llama_index/pull/22124))
- fix(core): 在 HTMLNodeParser 中跳過空的 nodes ([#22125](https://github.com/run-llama/llama_index/pull/22125))
- fix(core): 在 MMR embedding 搜尋中遵循 mmr\_threshold=0 ([#22126](https://github.com/run-llama/llama_index/pull/22126))
- fix: 在 IngestionPipeline upserts 中，為每個 document 保留所有 nodes (重新提交 #22046，非 #21456 的重複項) ([#22133](https://github.com/run-llama/llama_index/pull/22133))
- fix: 不要將 \*args/\*\*kwargs 標記為必要的 tool 參數 ([#22135](https://github.com/run-llama/llama_index/pull/22135))
- fix(core): 當 MetadataFilters 為 None 時，將 condition 預設為 AND ([#22155](https://github.com/run-llama/llama_index/pull/22155))
- fix: 在 AgentWorkflow 內部遵循 agent structured\_output\_fn/output\_cls ([#22162](https://github.com/run-llama/llama_index/pull/22162))
- fix(core): 在 SemanticDoubleMergingSplitterNodeParser 中使用 word tokenization 來移除 stopword ([#22167](https://github.com/run-llama/llama_index/pull/22167))
- fix(core): 將 prompt helper 的 fallback 還原為提供的 LLM metadata ([#22177](https://github.com/run-llama/llama_index/pull/22177))
- 在寫入記憶體時，為 streaming chat response 填充 response text ([#22179](https://github.com/run-llama/llama_index/pull/22179))
- feat(property\_graph): 為 LLM path extractors 新增 raise\_on\_error ([#22195](https://github.com/run-llama/llama_index/pull/22195))
- 明確 FactExtractionMemoryBlock 的 condense prompt 以回傳完整快照 ([#22213](https://github.com/run-llama/llama_index/pull/22213))
- 修正部分拼字錯誤 ([#22512](https://github.com/run-llama/llama_index/pull/22512))
- fix(core): 為每個 CitationQueryEngine citation node 分配獨立的 id 與 offsets ([#22537](https://github.com/run-llama/llama_index/pull/22537))
- fix(core): 持久化 SimpleChatStore 時不對 non-ascii 進行轉義 ([#22538](https://github.com/run-llama/llama_index/pull/22538))
- feat(core): 允許 Memory 接收任何 AsyncDBChatStore ([#22541](https://github.com/run-llama/llama_index/pull/22541))
- test(node\_parser): 為 sentence\_window 測試啟用 pytest discovery ([#22545](https://github.com/run-llama/llama_index/pull/22545))
- 為 LLMRerank 實作 async ([#22597](https://github.com/run-llama/llama_index/pull/22597))

### llama-index-embeddings-bedrock \[0.8.3]

- fix: 在 llama-index-embeddings-bedrock 中將 aioboto3 設為選用 ([#21915](https://github.com/run-llama/llama_index/pull/21915))
- fix(embeddings): 在 AWS 呼叫前驗證 Bedrock embedding payload 不為空 ([#22527](https://github.com/run-llama/llama_index/pull/22527))

### llama-index-embeddings-voyageai \[0.6.1]

- fix: 為 contextualizedembeddings 設定 chunk\_size=32000 並修正輸入格式 ([#22144](https://github.com/run-llama/llama_index/pull/22144))

### llama-index-graph-stores-falkordb \[0.6.0]

- fix(falkordb): 修正 property graph store 中的 schema、vector ranking、filters 與 batching ([#22522](https://github.com/run-llama/llama_index/pull/22522))

### llama-index-indices-managed-dashscope \[0.5.1]

- fix(dashscope): 在 retriever payload 中傳送 query\_history ([#22212](https://github.com/run-llama/llama_index/pull/22212))

### llama-index-indices-managed-lancedb \[0.3.2]

- fix(lancedb): 修復 image ingestion 崩潰、embedding\_model 拼字錯誤等問題 ([#22544](https://github.com/run-llama/llama_index/pull/22544))
- lint ([#22572](https://github.com/run-llama/llama_index/pull/22572))

### llama-index-llms-anthropic \[0.11.10]

- feat(anthropic): 新增對 Claude Sonnet 5 的支援 ([#22202](https://github.com/run-llama/llama_index/pull/22202))
- Fix/sonnet 5 function calling ([#22217](https://github.com/run-llama/llama_index/pull/22217))
- feat(anthropic, bedrock-converse): 將 Claude Opus 5 加入模型允許清單 ([#22451](https://github.com/run-llama/llama_index/pull/22451))
- fix(anthropic): 將 Opus 4.6 的 context window 修正為 1M ([#22555](https://github.com/run-llama/llama_index/pull/22555))

### llama-index-llms-bedrock-converse \[0.14.18]

- fix: 在 llama-index-llms-bedrock-converse 中將 aioboto3 設為選用 ([#21916](https://github.com/run-llama/llama_index/pull/21916))
- feat(bedrock-converse): 新增對 Claude Sonnet 5 的支援 ([#22201](https://github.com/run-llama/llama_index/pull/22201))
- feat(anthropic, bedrock-converse): 將 Claude Opus 5 加入模型允許清單 ([#22451](https://github.com/run-llama/llama_index/pull/22451))
- feat(bedrock-converse): 支援 thinking 類型 ‘disabled’ ([#22534](https://github.com/run-llama/llama_index/pull/22534))

### llama-index-llms-google-genai \[0.10.0]

- fix: 不要覆寫 thought signatures ([#21562](https://github.com/run-llama/llama_index/pull/21562))
- fix(google-genai): 在 gemini genconfig 中不要傳送預設參數 ([#22270](https://github.com/run-llama/llama_index/pull/22270))- feat(google-genai): 在 lib 和 docs 中預設使用 gemini 3.7 Flash ([#22734](https://github.com/run-llama/llama_index/pull/22734))

### llama-index-llms-llama-cpp \[0.6.1]

- fix(llama-cpp): 回報模型的有效 context window ([#22539](https://github.com/run-llama/llama_index/pull/22539))

### llama-index-llms-openai \[0.7.10]

- 將 GPT-5.6 模型新增至支援的 OpenAI 模型中 ([#22385](https://github.com/run-llama/llama_index/pull/22385))

### llama-index-node-parser-slide \[0.3.0]

- 修正部分打字錯誤 ([#22512](https://github.com/run-llama/llama_index/pull/22512))

### llama-index-observability-otel \[0.6.4]

- chore: 將 otel 整合中的 instrumentation 版本最低要求提升至 0.5.0 ([#22151](https://github.com/run-llama/llama_index/pull/22151))
- fix: 改善 otel span ID 的處理方式 ([#22485](https://github.com/run-llama/llama_index/pull/22485))

### llama-index-protocols-ag-ui \[0.4.0]

- fix(ag-ui): 改為拋出 ValueError 而非偽造 tool\_call\_id ([#22103](https://github.com/run-llama/llama_index/pull/22103))
- fix: 持久化 AG-UI 前端工具訊息 ([#22109](https://github.com/run-llama/llama_index/pull/22109))
- 隔離 AG-UI 初始狀態的複本 ([#22189](https://github.com/run-llama/llama_index/pull/22189))
- feat(ag-ui): 支援多模態使用者輸入 (圖片、音訊、影片、documents) ([#22678](https://github.com/run-llama/llama_index/pull/22678))

### llama-index-readers-alibabacloud-aisearch \[0.4.1]

- fix: 在 reader 整合中關閉檔案控制代碼與 http 連線 ([#22529](https://github.com/run-llama/llama_index/pull/22529))

### llama-index-readers-couchbase \[0.5.1]

- 新增 telemetry ([#22473](https://github.com/run-llama/llama_index/pull/22473))

### llama-index-readers-file \[0.6.0]

- fix: 限制 HWP 區段解壓縮 ([#22106](https://github.com/run-llama/llama_index/pull/22106))

### llama-index-readers-gcs \[0.6.1]

- 文件: 修正 GCS reader README 的 import 路徑 ([#22139](https://github.com/run-llama/llama_index/pull/22139))

### llama-index-readers-github \[0.11.2]

- fix(github-reader): 新增 asyncio\_mode=auto 以解除 CI 中 async 測試的阻塞 ([#21937](https://github.com/run-llama/llama_index/pull/21937))

### llama-index-readers-google \[0.7.3]

- fix: 當錯誤被忽略時，GoogleDriveReader 會回傳 None 而非 list ([#22556](https://github.com/run-llama/llama_index/pull/22556))

### llama-index-readers-huggingface-fs \[0.5.1]

- fix: 在 reader 整合中關閉檔案控制代碼與 http 連線 ([#22529](https://github.com/run-llama/llama_index/pull/22529))

### llama-index-readers-hwp \[0.5.0]

- fix: 限制 HWP 區段解壓縮 ([#22106](https://github.com/run-llama/llama_index/pull/22106))

### llama-index-readers-memos \[0.5.1]

- 修正 MemosReader 的預設 endpoint 與 metadata ([#22199](https://github.com/run-llama/llama_index/pull/22199))

### llama-index-readers-minio \[0.5.1]

- fix: 在 BotoMinioReader 中不要將 S3 TLS 的 verify=False 硬編碼 ([#22530](https://github.com/run-llama/llama_index/pull/22530))

### llama-index-readers-sec-filings \[0.5.1]

- fix: 在 reader 整合中關閉檔案控制代碼與 http 連線 ([#22529](https://github.com/run-llama/llama_index/pull/22529))

### llama-index-readers-stripe-docs \[0.5.1]

- fix: 在 reader 整合中關閉檔案控制代碼與 http 連線 ([#22529](https://github.com/run-llama/llama_index/pull/22529))

### llama-index-retrievers-galaxia \[0.2.2]

- fix: 在 reader 整合中關閉檔案控制代碼與 http 連線 ([#22529](https://github.com/run-llama/llama_index/pull/22529))

### llama-index-retrievers-pathway \[0.5.0]

- 修正部分打字錯誤 ([#22512](https://github.com/run-llama/llama_index/pull/22512))

### llama-index-storage-docstore-couchbase \[0.4.1]

- 新增 telemetry ([#22473](https://github.com/run-llama/llama_index/pull/22473))

### llama-index-storage-index-store-couchbase \[0.4.1]

- 新增 telemetry ([#22473](https://github.com/run-llama/llama_index/pull/22473))

### llama-index-storage-kvstore-couchbase \[0.4.1]

- 新增 telemetry ([#22473](https://github.com/run-llama/llama_index/pull/22473))

### llama-index-tools-desearch \[0.1.1]

- docs: 移除 desearch 工具 README 中殘留的生成文字 ([#22149](https://github.com/run-llama/llama_index/pull/22149))

### llama-index-tools-mcp \[0.5.0]

- feat: 將 llama-index-tools-mcp 遷移至 mcp 2.x ([#22557](https://github.com/run-llama/llama_index/pull/22557))

### llama-index-tools-typecast \[0.1.0]

- Document Typecast 無法合成文字的錯誤 ([#22514](https://github.com/run-llama/llama_index/pull/22514))

### llama-index-tools-vectara-query \[0.5.0]

- 修正部分打字錯誤 ([#22512](https://github.com/run-llama/llama_index/pull/22512))

### llama-index-vector-stores-azureaisearch \[0.5.1]

- fix(azureaisearch): 在索引 nodes 時保留 falsy 的 metadata 值 ([#22154](https://github.com/run-llama/llama_index/pull/22154))

### llama-index-vector-stores-couchbase \[0.7.1]

- 新增 telemetry ([#22473](https://github.com/run-llama/llama_index/pull/22473))

### llama-index-vector-stores-pinecone \[0.8.1]

- fix(pinecone): 支援 pinecone client v8 與 v9 ([#22511](https://github.com/run-llama/llama_index/pull/22511))

### llama-index-vector-stores-qdrant \[0.10.3]

- fix(qdrant): 修正 aquery() 會捨棄 falsy 的 shard\_identifier 值（例如 0）([#22169](https://github.com/run-llama/llama_index/pull/22169))
- fix(qdrant): 恢復與 qdrant-client 1.19.0 的相容性 ([#22630](https://github.com/run-llama/llama_index/pull/22630))

### llama-index-vector-stores-vertexaivectorsearch \[0.5.0]

- feat(vector-stores/vertexai): 擴展 `VertexAIVectorStore` 對 V2 API 的支援 ([#22085](https://github.com/run-llama/llama_index/pull/22085))

### llama-index-vector-stores-weaviate \[1.6.2]

- fix(weaviate): 對於既有 collection，將 real properties 作為 node metadata 回傳 ([#22540](https://github.com/run-llama/llama_index/pull/22540))

## \[2026-06-24]

### llama-index-callbacks-argilla \[0.5.0]

- chore(deps): 更新 32 個目錄中的 uv group，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 更新 29 個目錄中的 uv group，共 3 項更新 ([#21665](https://github.com/run-llama/llama_index/pull/21665))
- chore(deps): 更新 31 個目錄中的 uv group，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 更新 35 個目錄中的 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 更新 32 個目錄中的 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))
- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 21 個目錄中的 uv group，共 3 項更新 ([#21725](https://github.com/run-llama/llama_index/pull/21725))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))
- chore(deps): 更新 17 個目錄中的 uv group，共 3 項更新 ([#21727](https://github.com/run-llama/llama_index/pull/21727))
- chore(deps): 更新 18 個目錄中的 uv group，共 4 項更新 ([#21733](https://github.com/run-llama/llama_index/pull/21733))
- chore(deps): 更新 7 個目錄中的 uv group，共 6 項更新 ([#21736](https://github.com/run-llama/llama_index/pull/21736))

### llama-index-core \[0.14.23]

- feat(core): 多模態合成（Multimodal synthesis）第二部分 ([#21561](https://github.com/run-llama/llama_index/pull/21561))
- fix(core): 在 FunctionTool.\_parse\_tool\_output 中加入 DocumentBlock 與 VideoBlock ([#21678](https://github.com/run-llama/llama_index/pull/21678))
- fix(prompt\_helper): 防止空輸入序列導致 ZeroDivisionError ([#21707](https://github.com/run-llama/llama_index/pull/21707))
- 保留基於 URL 的 video 與 document memory blocks ([#21728](https://github.com/run-llama/llama_index/pull/21728))
- fix: 為 llama-index-core 的文字模式檔案 I/O 加入明確的 encoding=‘utf-8’ ([#21729](https://github.com/run-llama/llama_index/pull/21729))
- 加入 tool calling mock LLM ([#21732](https://github.com/run-llama/llama_index/pull/21732))
- 修正測試使其恢復通過 ([#21737](https://github.com/run-llama/llama_index/pull/21737))
- 修正 refresh\_ref\_docs 的 kwargs 重用問題 ([#21752](https://github.com/run-llama/llama_index/pull/21752))
- perf: 在 Ingestion… 的 batch 內重複資料刪除中使用 set 代替 list ([#21755](https://github.com/run-llama/llama_index/pull/21755))
- fix: 在 ingestion pipeline 中使用 running loop ([#21765](https://github.com/run-llama/llama_index/pull/21765))
- fix(core): 在 model dump 期間保留 IndexNode 物件 ([#21776](https://github.com/run-llama/llama_index/pull/21776))
- fix(workflow): 對 initial\_state 進行深拷貝，以防止在多次執行間產生 mutation leaks ([#21780](https://github.com/run-llama/llama_index/pull/21780))
- 多模態查詢引擎（Multimodal query engines） ([#21784](https://github.com/run-llama/llama_index/pull/21784))
- fix(core): 修正 NE 與 NIN 篩選器缺失 metadata 的比對問題 ([#21785](https://github.com/run-llama/llama_index/pull/21785))
- fix: 保留 TreeSelectLeafRetriever 的來源 nodes ([#21787](https://github.com/run-llama/llama_index/pull/21787))
- 修正 TokenTextSplitter 與 SentenceSplitter 在處理大於 chunk\_size 的單位時產生的 RecursionError ([#21900](https://github.com/run-llama/llama_index/pull/21900))
- 簡化傳送到 instrumentation 的序列化 payload ([#22130](https://github.com/run-llama/llama_index/pull/22130))

### llama-index-embeddings-adapter \[0.5.0]

- fix: adapter 設定檔使用 utf-8 編碼 ([#21773](https://github.com/run-llama/llama_index/pull/21773))

### llama-index-embeddings-autoembeddings \[0.3.0]

- chore(deps): 更新 7 個目錄中的 uv group，共 6 項更新 ([#21736](https://github.com/run-llama/llama_index/pull/21736))

### llama-index-embeddings-cohere \[0.8.0]

- chore(deps): 更新 35 個目錄中的 pip 群組，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 更新 12 個目錄中的 pip 群組，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip 群組，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))
- fix: 保留 TreeSelectLeafRetriever 來源 nodes ([#21787](https://github.com/run-llama/llama_index/pull/21787))

### llama-index-embeddings-gaudi \[0.4.0]

- chore(deps): 更新 18 個目錄中的 uv 群組，共 4 項更新 ([#21733](https://github.com/run-llama/llama_index/pull/21733))

### llama-index-embeddings-google-genai \[0.5.1]

- chore: 允許使用 `google-genai` 2.0+ SDKs ([#21710](https://github.com/run-llama/llama_index/pull/21710))

### llama-index-embeddings-heroku \[0.2.0]

- chore(deps): 更新 35 個目錄中的 pip 群組，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 更新 12 個目錄中的 pip 群組，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip 群組，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))
- fix: 保留 TreeSelectLeafRetriever 來源 nodes ([#21787](https://github.com/run-llama/llama_index/pull/21787))

### llama-index-embeddings-huggingface-optimum \[0.4.1]

- 恢復測試通過 ([#21737](https://github.com/run-llama/llama_index/pull/21737))

### llama-index-embeddings-ibm \[0.6.0.post1]

- chore(deps): 更新 35 個目錄中的 pip 群組，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 更新 12 個目錄中的 pip 群組，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip 群組，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))
- fix: 保留 TreeSelectLeafRetriever 來源 nodes ([#21787](https://github.com/run-llama/llama_index/pull/21787))

### llama-index-embeddings-jinaai \[0.6.0]

- chore(deps): 更新 32 個目錄中的 uv 群組，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 更新 29 個目錄中的 uv 群組，共 3 項更新 ([#21665](https://github.com/run-llama/llama_index/pull/21665))
- chore(deps): 更新 31 個目錄中的 uv 群組，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 更新 35 個目錄中的 pip 群組，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 更新 32 個目錄中的 uv 群組，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 更新 31 個目錄中的 uv 群組，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))
- chore(deps): 更新 31 個目錄中的 uv 群組，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))
- chore(deps): 更新 30 個目錄中的 uv 群組，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))
- chore(deps): 更新 30 個目錄中的 uv 群組，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))
- chore(deps): 更新 12 個目錄中的 pip 群組，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 21 個目錄中的 uv 群組，共 3 項更新 ([#21725](https://github.com/run-llama/llama_index/pull/21725))
- chore(deps): 更新 11 個目錄中的 pip 群組，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))
- chore(deps): 更新 17 個目錄中的 uv 群組，共 3 項更新 ([#21727](https://github.com/run-llama/llama_index/pull/21727))
- chore(deps): 更新 18 個目錄中的 uv 群組，共 4 項更新 ([#21733](https://github.com/run-llama/llama_index/pull/21733))
- chore(deps): 更新 7 個目錄中的 uv 群組，共 6 項更新 ([#21736](https://github.com/run-llama/llama_index/pull/21736))

### llama-index-embeddings-litellm \[0.5.0]

- chore(deps): 更新 7 個目錄中的 uv 群組，共 6 項更新 ([#21736](https://github.com/run-llama/llama_index/pull/21736))

### llama-index-embeddings-modelscope \[0.6.0]

- chore(deps): 更新 32 個目錄中的 uv 群組，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 更新 29 個目錄中的 uv 群組，共 3 項更新 ([#21665](https://github.com/run-llama/llama_index/pull/21665))
- chore(deps): 更新 31 個目錄中的 uv 群組，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 更新 35 個目錄中的 pip 群組，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 更新 32 個目錄中的 uv 群組，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 更新 31 個目錄中的 uv 群組，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))
- chore(deps): 更新 31 個目錄中的 uv 群組，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))
- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 21 個目錄中的 uv group，共 3 項更新 ([#21725](https://github.com/run-llama/llama_index/pull/21725))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))
- chore(deps): 更新 17 個目錄中的 uv group，共 3 項更新 ([#21727](https://github.com/run-llama/llama_index/pull/21727))
- chore(deps): 更新 18 個目錄中的 uv group，共 4 項更新 ([#21733](https://github.com/run-llama/llama_index/pull/21733))
- chore(deps): 更新 7 個目錄中的 uv group，共 6 項更新 ([#21736](https://github.com/run-llama/llama_index/pull/21736))

### llama-index-embeddings-nvidia \[0.5.1]

- chore(deps): 更新 35 個目錄中的 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))
- fix: 保留 TreeSelectLeafRetriever 來源 nodes ([#21787](https://github.com/run-llama/llama_index/pull/21787))

### llama-index-embeddings-premai \[0.5.0]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 21 個目錄中的 uv group，共 3 項更新 ([#21725](https://github.com/run-llama/llama_index/pull/21725))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))
- chore(deps): 更新 17 個目錄中的 uv group，共 3 項更新 ([#21727](https://github.com/run-llama/llama_index/pull/21727))
- chore(deps): 更新 18 個目錄中的 uv group，共 4 項更新 ([#21733](https://github.com/run-llama/llama_index/pull/21733))

### llama-index-embeddings-upstage \[0.6.1]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))
- fix: 保留 TreeSelectLeafRetriever 來源 nodes ([#21787](https://github.com/run-llama/llama_index/pull/21787))

### llama-index-embeddings-vllm \[0.1.1]

- chore(deps): 更新 7 個目錄中的 uv group，共 6 項更新 ([#21736](https://github.com/run-llama/llama_index/pull/21736))

### llama-index-embeddings-voyageai \[0.6.0]

- 恢復測試通過 ([#21737](https://github.com/run-llama/llama_index/pull/21737))

### llama-index-embeddings-zhipuai \[0.4.0]

- 恢復測試通過 ([#21737](https://github.com/run-llama/llama_index/pull/21737))

### llama-index-graph-rag-cognee \[0.3.1]

- 恢復測試通過 ([#21737](https://github.com/run-llama/llama_index/pull/21737))

### llama-index-llms-ai21 \[0.7.0]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))
- fix: 保留 TreeSelectLeafRetriever 來源 nodes ([#21787](https://github.com/run-llama/llama_index/pull/21787))

### llama-index-llms-anthropic \[0.11.6]

- feat(bedrock-converse, anthropic): 新增 Claude Opus 4.8 ([#21802](https://github.com/run-llama/llama_index/pull/21802))
- feat(anthropic): 新增對 Claude Fable 5 的支援 ([#21919](https://github.com/run-llama/llama_index/pull/21919))

### llama-index-llms-bedrock-converse \[0.14.14]

- fix(bedrock-converse): 將 streaming tool\_kwargs 的解析從 string 改為 dict ([#21580](https://github.com/run-llama/llama_index/pull/21580))
- fix(bedrock-converse): 序列化 tool results 中的 rich content blocks ([#21677](https://github.com/run-llama/llama_index/pull/21677))
- feat(bedrock-converse, anthropic): 新增 Claude Opus 4.8 ([#21802](https://github.com/run-llama/llama_index/pull/21802))
- feat(bedrock-converse): 將 Claude Fable 5 加入模型允許清單 ([#22033](https://github.com/run-llama/llama_index/pull/22033))

### llama-index-llms-cerebras \[0.4.1]

- fix(cerebras): 將 llama-index-llms-openai-like 版本提升至 >=0.6.0,<0.9 ([#21914](https://github.com/run-llama/llama_index/pull/21914))

### llama-index-llms-gaudi \[0.4.0]

- chore(deps): 更新 18 個目錄中的 uv group，共 4 項更新 ([#21733](https://github.com/run-llama/llama_index/pull/21733))

### llama-index-llms-google-genai \[0.9.5]

- chore: 允許使用 `google-genai` 2.0+ SDKs ([#21710](https://github.com/run-llama/llama_index/pull/21710))- 將版本從 0.9.4 提升至 0.9.5 ([#21712](https://github.com/run-llama/llama_index/pull/21712))

### llama-index-llms-heroku \[0.2.0]

- chore(deps): 在 12 個目錄中更新 pip 群組，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 在 11 個目錄中更新 pip 群組，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))
- fix: 保留 TreeSelectLeafRetriever 來源 nodes ([#21787](https://github.com/run-llama/llama_index/pull/21787))

### llama-index-llms-maritalk \[0.6.0]

- chore(deps): 在 32 個目錄中更新 uv 群組，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 在 29 個目錄中更新 uv 群組，共 3 項更新 ([#21665](https://github.com/run-llama/llama_index/pull/21665))
- chore(deps): 在 12 個目錄中更新 pip 群組，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 在 21 個目錄中更新 uv 群組，共 3 項更新 ([#21725](https://github.com/run-llama/llama_index/pull/21725))
- chore(deps): 在 11 個目錄中更新 pip 群組，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))
- chore(deps): 在 17 個目錄中更新 uv 群組，共 3 項更新 ([#21727](https://github.com/run-llama/llama_index/pull/21727))
- chore(deps): 在 18 個目錄中更新 uv 群組，共 4 項更新 ([#21733](https://github.com/run-llama/llama_index/pull/21733))

### llama-index-llms-nvidia \[0.5.1]

- fix: 放寬 NVIDIA LLM openai-like 依賴限制 ([#21911](https://github.com/run-llama/llama_index/pull/21911))

### llama-index-llms-oci-data-science \[1.1.0]

- chore(deps): 在 12 個目錄中更新 pip 群組，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 在 21 個目錄中更新 uv 群組，共 3 項更新 ([#21725](https://github.com/run-llama/llama_index/pull/21725))
- chore(deps): 在 11 個目錄中更新 pip 群組，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-llms-openai \[0.7.9]

- chore(deps): 在 11 個目錄中更新 pip 群組，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))
- 在 OpenAI 訊息中支援 vLLM reasoning 欄位 ([#21753](https://github.com/run-llama/llama_index/pull/21753))

### llama-index-llms-openai-like \[0.7.2]

- chore(deps): 在 12 個目錄中更新 pip 群組，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 在 11 個目錄中更新 pip 群組，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-llms-openrouter \[0.5.1]

- fix(openrouter): 支援 llama-index-llms-openai-like 0.7 ([#21891](https://github.com/run-llama/llama_index/pull/21891))

### llama-index-llms-openvino-genai \[0.3.1]

- chore(deps): 在 12 個目錄中更新 pip 群組，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 在 11 個目錄中更新 pip 群組，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-llms-ovhcloud \[0.2.1]

- chore(deps): 在 12 個目錄中更新 pip 群組，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 在 11 個目錄中更新 pip 群組，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-llms-perplexity \[0.5.1]

- chore(deps): 在 12 個目錄中更新 pip 群組，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 在 11 個目錄中更新 pip 群組，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-llms-portkey \[0.5.1]

- chore(deps): 在 12 個目錄中更新 pip 群組，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 在 11 個目錄中更新 pip 群組，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-llms-upstage \[0.8.1]

- chore(deps): 在 12 個目錄中更新 pip 群組，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 在 11 個目錄中更新 pip 群組，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-llms-yi \[0.5.1]

- chore(deps): 在 12 個目錄中更新 pip 群組，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 在 11 個目錄中更新 pip 群組，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-llms-you \[0.5.0]

- fix: 修正 You.com 與 YugabyteDB 文件的拼字錯誤 ([#21709](https://github.com/run-llama/llama_index/pull/21709))

### llama-index-llms-zhipuai \[0.5.0]

- 恢復測試通過 ([#21737](https://github.com/run-llama/llama_index/pull/21737))

### llama-index-memory-bedrock-agentcore \[0.1.2]

- chore(deps): 更新 30 個目錄中的 uv 群組，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))
- chore(deps): 更新 12 個目錄中的 pip 群組，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 21 個目錄中的 uv 群組，共 3 項更新 ([#21725](https://github.com/run-llama/llama_index/pull/21725))
- chore(deps): 更新 11 個目錄中的 pip 群組，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-memory-mem0 \[2.0.0]

- 將 mem0 升級至 2.x (llama-index-memory-mem0) ([#21711](https://github.com/run-llama/llama_index/pull/21711))
- chore(deps): 更新 31 個目錄中的 uv 群組，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))
- chore(deps): 更新 30 個目錄中的 uv 群組，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))
- chore(deps): 更新 30 個目錄中的 uv 群組，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))
- chore(deps): 更新 12 個目錄中的 pip 群組，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 21 個目錄中的 uv 群組，共 3 項更新 ([#21725](https://github.com/run-llama/llama_index/pull/21725))
- chore(deps): 更新 11 個目錄中的 pip 群組，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-node-parser-chonkie \[0.1.2]

- 修復測試使其重新通過 ([#21737](https://github.com/run-llama/llama_index/pull/21737))

### llama-index-observability-otel \[0.6.2]

- chore(deps): 更新 12 個目錄中的 pip 群組，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 21 個目錄中的 uv 群組，共 3 項更新 ([#21725](https://github.com/run-llama/llama_index/pull/21725))
- chore(deps): 更新 11 個目錄中的 pip 群組，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-postprocessor-alibabacloud-aisearch-rerank \[0.4.0]

- chore(deps): 更新 23 個目錄中的 uv 群組，共 3 項更新 ([#21656](https://github.com/run-llama/llama_index/pull/21656))

### llama-index-postprocessor-bedrock-rerank \[0.6.0]

- chore(deps): 更新 23 個目錄中的 uv 群組，共 3 項更新 ([#21656](https://github.com/run-llama/llama_index/pull/21656))

### llama-index-postprocessor-cohere-rerank \[0.9.0]

- chore(deps): 更新 12 個目錄中的 pip 群組，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip 群組，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))
- 修復測試使其重新通過 ([#21737](https://github.com/run-llama/llama_index/pull/21737))

### llama-index-postprocessor-colbert-rerank \[0.5.0]

- chore(deps): 更新 23 個目錄中的 uv 群組，共 3 項更新 ([#21656](https://github.com/run-llama/llama_index/pull/21656))

### llama-index-postprocessor-colpali-rerank \[0.4.0]

- chore(deps): 更新 23 個目錄中的 uv 群組，共 3 項更新 ([#21656](https://github.com/run-llama/llama_index/pull/21656))

### llama-index-postprocessor-contextual-rerank \[0.3.0]

- chore(deps): 更新 23 個目錄中的 uv 群組，共 3 項更新 ([#21656](https://github.com/run-llama/llama_index/pull/21656))

### llama-index-postprocessor-dashscope-rerank \[0.5.0]

- chore(deps): 更新 23 個目錄中的 uv 群組，共 3 項更新 ([#21656](https://github.com/run-llama/llama_index/pull/21656))

### llama-index-postprocessor-flag-embedding-reranker \[0.5.0]

- chore(deps): 更新 23 個目錄中的 uv 群組，共 3 項更新 ([#21656](https://github.com/run-llama/llama_index/pull/21656))

### llama-index-postprocessor-flashrank-rerank \[0.2.1]

- chore(deps): 更新 23 個目錄中的 uv 群組，共 3 項更新 ([#21656](https://github.com/run-llama/llama_index/pull/21656))

### llama-index-postprocessor-google-rerank \[0.1.0]

- chore(deps): 更新 12 個目錄中的 pip 群組，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip 群組，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-postprocessor-jinaai-rerank \[0.5.0]

- chore(deps): 更新 23 個目錄中的 uv 群組，共 3 項更新 ([#21656](https://github.com/run-llama/llama_index/pull/21656))

### llama-index-postprocessor-longllmlingua \[0.6.0]

- chore(deps): 更新 23 個目錄中的 uv 群組，共 3 項更新 ([#21656](https://github.com/run-llama/llama_index/pull/21656))

### llama-index-postprocessor-mixedbreadai-rerank \[0.6.0]

- chore(deps): 更新 23 個目錄中的 uv 群組，共 3 項更新 ([#21656](https://github.com/run-llama/llama_index/pull/21656))

### llama-index-postprocessor-nvidia-rerank \[0.6.0]

- chore(deps): 更新 12 個目錄中的 pip 群組，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-postprocessor-openvino-rerank \[0.6.0]

- chore(deps): 更新 23 個目錄中的 uv group，共 3 項更新 ([#21656](https://github.com/run-llama/llama_index/pull/21656))

### llama-index-postprocessor-pinecone-native-rerank \[0.3.0]

- chore(deps): 更新 23 個目錄中的 uv group，共 3 項更新 ([#21656](https://github.com/run-llama/llama_index/pull/21656))

### llama-index-postprocessor-presidio \[0.6.0]

- chore(deps): 更新 23 個目錄中的 uv group，共 3 項更新 ([#21656](https://github.com/run-llama/llama_index/pull/21656))

### llama-index-postprocessor-rankgpt-rerank \[0.5.0]

- chore(deps): 更新 23 個目錄中的 uv group，共 3 項更新 ([#21656](https://github.com/run-llama/llama_index/pull/21656))

### llama-index-postprocessor-rankllm-rerank \[0.6.2]

- chore(deps): 更新 23 個目錄中的 uv group，共 3 項更新 ([#21656](https://github.com/run-llama/llama_index/pull/21656))
- 恢復測試通過 ([#21737](https://github.com/run-llama/llama_index/pull/21737))
- 修正 RankLLM PromptMode import 相容性 ([#21789](https://github.com/run-llama/llama_index/pull/21789))

### llama-index-postprocessor-sbert-rerank \[0.5.0]

- chore(deps): 更新 23 個目錄中的 uv group，共 3 項更新 ([#21656](https://github.com/run-llama/llama_index/pull/21656))

### llama-index-postprocessor-siliconflow-rerank \[0.4.0]

- chore(deps): 更新 23 個目錄中的 uv group，共 3 項更新 ([#21656](https://github.com/run-llama/llama_index/pull/21656))

### llama-index-postprocessor-tei-rerank \[0.5.0]

- chore(deps): 更新 23 個目錄中的 uv group，共 3 項更新 ([#21656](https://github.com/run-llama/llama_index/pull/21656))

### llama-index-postprocessor-voyageai-rerank \[0.5.0]

- chore(deps): 更新 23 個目錄中的 uv group，共 3 項更新 ([#21656](https://github.com/run-llama/llama_index/pull/21656))

### llama-index-postprocessor-xinference-rerank \[0.4.0]

- chore(deps): 更新 23 個目錄中的 uv group，共 3 項更新 ([#21656](https://github.com/run-llama/llama_index/pull/21656))

### llama-index-program-evaporate \[0.6.0]

- chore(deps): 更新 23 個目錄中的 uv group，共 3 項更新 ([#21656](https://github.com/run-llama/llama_index/pull/21656))

### llama-index-program-guidance \[0.5.0]

- chore(deps): 更新 23 個目錄中的 uv group，共 3 項更新 ([#21656](https://github.com/run-llama/llama_index/pull/21656))

### llama-index-readers-airbyte-zendesk-support \[0.5.0]

- chore(deps): 將 /llama-index-integrations/readers/llama-index-readers-airbyte-zendesk-support 中的 langsmith 從 0.1.147 更新至 0.8.0 ([#21655](https://github.com/run-llama/llama_index/pull/21655))

### llama-index-readers-astra-db \[0.5.0]

- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))

### llama-index-readers-athena \[0.5.0]

- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))

### llama-index-readers-awadb \[0.5.0]

- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))

### llama-index-readers-azcognitive-search \[0.5.0]

- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))

### llama-index-readers-azstorage-blob \[0.5.0]

- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))

### llama-index-readers-bagel \[0.4.1]

- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))

### llama-index-readers-bilibili \[0.5.0]

- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))

### llama-index-readers-bitbucket \[0.5.0]

- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))- chore(deps): 在 32 個目錄中更新 uv group，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))

### llama-index-readers-boarddocs \[0.5.0]

- chore(deps-dev): 在 33 個目錄中更新 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 在 33 個目錄中更新 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))
- chore(deps): 在 32 個目錄中更新 uv group，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 在 31 個目錄中更新 uv group，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))

### llama-index-readers-box \[0.5.0]

- chore(deps-dev): 在 33 個目錄中更新 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 在 33 個目錄中更新 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))
- chore(deps): 在 32 個目錄中更新 uv group，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 在 31 個目錄中更新 uv group，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 在 35 個目錄中更新 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 在 32 個目錄中更新 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))

### llama-index-readers-chatgpt-plugin \[0.5.0]

- chore(deps-dev): 在 33 個目錄中更新 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 在 33 個目錄中更新 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))
- chore(deps): 在 32 個目錄中更新 uv group，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 在 29 個目錄中更新 uv group，共 3 項更新 ([#21665](https://github.com/run-llama/llama_index/pull/21665))
- chore(deps): 在 31 個目錄中更新 uv group，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 在 35 個目錄中更新 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 在 32 個目錄中更新 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 在 31 個目錄中更新 uv group，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))

### llama-index-readers-chroma \[0.4.1]

- chore(deps-dev): 在 33 個目錄中更新 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 在 33 個目錄中更新 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))
- chore(deps): 在 32 個目錄中更新 uv group，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 在 29 個目錄中更新 uv group，共 3 項更新 ([#21665](https://github.com/run-llama/llama_index/pull/21665))
- chore(deps): 在 31 個目錄中更新 uv group，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 在 35 個目錄中更新 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 在 32 個目錄中更新 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 在 31 個目錄中更新 uv group，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))
- chore(deps): 在 31 個目錄中更新 uv group，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))

### llama-index-readers-confluence \[0.7.0]

- chore(deps-dev): 在 33 個目錄中更新 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 在 33 個目錄中更新 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))
- chore(deps): 在 32 個目錄中更新 uv group，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 在 29 個目錄中更新 uv group，共 3 項更新 ([#21665](https://github.com/run-llama/llama_index/pull/21665))
- chore(deps): 在 31 個目錄中更新 uv group，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 在 35 個目錄中更新 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 在 32 個目錄中更新 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 在 31 個目錄中更新 uv group，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))
- chore(deps): 在 31 個目錄中更新 uv group，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))
- chore(deps): 在 30 個目錄中更新 uv group，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))

### llama-index-readers-couchbase \[0.5.0]

- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))
- chore(deps): 更新 32 個目錄中的 uv group，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 更新 29 個目錄中的 uv group，共 3 項更新 ([#21665](https://github.com/run-llama/llama_index/pull/21665))
- chore(deps): 更新 31 個目錄中的 uv group，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 更新 35 個目錄中的 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 更新 32 個目錄中的 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))

### llama-index-readers-couchdb \[0.5.0]

- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))
- chore(deps): 更新 32 個目錄中的 uv group，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 更新 29 個目錄中的 uv group，共 3 項更新 ([#21665](https://github.com/run-llama/llama_index/pull/21665))
- chore(deps): 更新 31 個目錄中的 uv group，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 更新 35 個目錄中的 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 更新 32 個目錄中的 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))

### llama-index-readers-dad-jokes \[0.5.0]

- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))
- chore(deps): 更新 32 個目錄中的 uv group，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 更新 29 個目錄中的 uv group，共 3 項更新 ([#21665](https://github.com/run-llama/llama_index/pull/21665))
- chore(deps): 更新 31 個目錄中的 uv group，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 更新 35 個目錄中的 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 更新 32 個目錄中的 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))

### llama-index-readers-dashscope \[0.5.0]

- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))
- chore(deps): 更新 32 個目錄中的 uv group，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 更新 29 個目錄中的 uv group，共 3 項更新 ([#21665](https://github.com/run-llama/llama_index/pull/21665))
- chore(deps): 更新 31 個目錄中的 uv group，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 更新 35 個目錄中的 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 更新 32 個目錄中的 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))

### llama-index-readers-dashvector \[0.6.0]

- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))
- chore(deps): 更新 32 個目錄中的 uv group，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 更新 29 個目錄中的 uv group，共 3 項更新 ([#21665](https://github.com/run-llama/llama_index/pull/21665))
- chore(deps): 更新 31 個目錄中的 uv group，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 更新 35 個目錄中的 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 更新 32 個目錄中的 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))

### llama-index-readers-database \[0.6.0]

- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))
- chore(deps): 更新 32 個目錄中的 uv group，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 更新 29 個目錄中的 uv group，共 3 項更新 ([#21665](https://github.com/run-llama/llama_index/pull/21665))
- chore(deps): 更新 31 個目錄中的 uv group，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 更新 35 個目錄中的 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 更新 32 個目錄中的 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))
- 修正測試使其重新通過 ([#21737](https://github.com/run-llama/llama_index/pull/21737))

### llama-index-readers-datasets \[0.2.0]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-readers-deeplake \[0.5.0]

- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))
- chore(deps): 更新 32 個目錄中的 uv group，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 更新 29 個目錄中的 uv group，共 3 項更新 ([#21665](https://github.com/run-llama/llama_index/pull/21665))
- chore(deps): 更新 31 個目錄中的 uv group，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 更新 35 個目錄中的 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 更新 32 個目錄中的 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))

### llama-index-readers-discord \[0.5.0]

- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))
- chore(deps): 更新 32 個目錄中的 uv group，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 更新 29 個目錄中的 uv group，共 3 項更新 ([#21665](https://github.com/run-llama/llama_index/pull/21665))
- chore(deps): 更新 31 個目錄中的 uv group，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 更新 35 個目錄中的 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 更新 32 個目錄中的 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))

### llama-index-readers-docling \[0.4.2]

- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))
- chore(deps): 更新 32 個目錄中的 uv group，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 更新 29 個目錄中的 uv group，共 3 項更新 ([#21665](https://github.com/run-llama/llama_index/pull/21665))
- chore(deps): 更新 31 個目錄中的 uv group，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 更新 35 個目錄中的 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 更新 32 個目錄中的 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))

### llama-index-readers-docstring-walker \[0.5.0]

- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))
- chore(deps): 更新 32 個目錄中的 uv group，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 更新 29 個目錄中的 uv group，共 3 項更新 ([#21665](https://github.com/run-llama/llama_index/pull/21665))
- chore(deps): 更新 31 個目錄中的 uv group，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 更新 35 個目錄中的 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 更新 32 個目錄中的 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))

### llama-index-readers-docugami \[0.5.0]

- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))
- chore(deps): 更新 32 個目錄中的 uv group，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 更新 29 個目錄中的 uv group，共 3 項更新 ([#21665](https://github.com/run-llama/llama_index/pull/21665))
- chore(deps): 更新 31 個目錄中的 uv group，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 更新 35 個目錄中的 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))- chore(deps): 在 32 個目錄中更新 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 在 31 個目錄中更新 uv group，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))
- chore(deps): 在 31 個目錄中更新 uv group，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))
- chore(deps): 在 30 個目錄中更新 uv group，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))
- chore(deps): 在 30 個目錄中更新 uv group，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))

### llama-index-readers-document360 \[0.4.0]

- chore(deps-dev): 在 33 個目錄中更新 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 在 33 個目錄中更新 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))
- chore(deps): 在 32 個目錄中更新 uv group，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 在 29 個目錄中更新 uv group，共 3 項更新 ([#21665](https://github.com/run-llama/llama_index/pull/21665))
- chore(deps): 在 31 個目錄中更新 uv group，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 在 35 個目錄中更新 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 在 32 個目錄中更新 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 在 31 個目錄中更新 uv group，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))
- chore(deps): 在 31 個目錄中更新 uv group，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))
- chore(deps): 在 30 個目錄中更新 uv group，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))
- chore(deps): 在 30 個目錄中更新 uv group，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))

### llama-index-readers-earnings-call-transcript \[0.5.0]

- chore(deps-dev): 在 33 個目錄中更新 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 在 33 個目錄中更新 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))
- chore(deps): 在 32 個目錄中更新 uv group，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 在 29 個目錄中更新 uv group，共 3 項更新 ([#21665](https://github.com/run-llama/llama_index/pull/21665))
- chore(deps): 在 31 個目錄中更新 uv group，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 在 35 個目錄中更新 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 在 32 個目錄中更新 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 在 31 個目錄中更新 uv group，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))
- chore(deps): 在 31 個目錄中更新 uv group，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))
- chore(deps): 在 30 個目錄中更新 uv group，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))
- chore(deps): 在 30 個目錄中更新 uv group，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))

### llama-index-readers-elasticsearch \[0.5.0]

- chore(deps-dev): 在 33 個目錄中更新 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 在 33 個目錄中更新 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))
- chore(deps): 在 32 個目錄中更新 uv group，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 在 29 個目錄中更新 uv group，共 3 項更新 ([#21665](https://github.com/run-llama/llama_index/pull/21665))
- chore(deps): 在 31 個目錄中更新 uv group，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 在 35 個目錄中更新 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 在 32 個目錄中更新 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 在 31 個目錄中更新 uv group，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))
- chore(deps): 在 31 個目錄中更新 uv group，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))
- chore(deps): 在 30 個目錄中更新 uv group，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))
- chore(deps): 在 30 個目錄中更新 uv group，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))

### llama-index-readers-faiss \[0.5.0]

- chore(deps-dev): 在 33 個目錄中更新 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))- chore(deps-dev): 在 33 個目錄中更新 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))
- chore(deps): 在 32 個目錄中更新 uv group，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 在 29 個目錄中更新 uv group，共 3 項更新 ([#21665](https://github.com/run-llama/llama_index/pull/21665))
- chore(deps): 在 31 個目錄中更新 uv group，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 在 35 個目錄中更新 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 在 32 個目錄中更新 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 在 31 個目錄中更新 uv group，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))
- chore(deps): 在 31 個目錄中更新 uv group，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))
- chore(deps): 在 30 個目錄中更新 uv group，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))
- chore(deps): 在 30 個目錄中更新 uv group，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))

### llama-index-readers-feedly-rss \[0.5.0]

- chore(deps-dev): 在 33 個目錄中更新 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 在 33 個目錄中更新 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))
- chore(deps): 在 32 個目錄中更新 uv group，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 在 29 個目錄中更新 uv group，共 3 項更新 ([#21665](https://github.com/run-llama/llama_index/pull/21665))
- chore(deps): 在 31 個目錄中更新 uv group，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 在 35 個目錄中更新 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 在 32 個目錄中更新 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 在 31 個目錄中更新 uv group，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))
- chore(deps): 在 31 個目錄中更新 uv group，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))
- chore(deps): 在 30 個目錄中更新 uv group，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))
- chore(deps): 在 30 個目錄中更新 uv group，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))
- chore(deps): 在 12 個目錄中更新 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 在 21 個目錄中更新 uv group，共 3 項更新 ([#21725](https://github.com/run-llama/llama_index/pull/21725))
- chore(deps): 在 17 個目錄中更新 uv group，共 3 項更新 ([#21727](https://github.com/run-llama/llama_index/pull/21727))

### llama-index-readers-feishu-docs \[0.5.0]

- chore(deps-dev): 在 33 個目錄中更新 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 在 33 個目錄中更新 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))
- chore(deps): 在 32 個目錄中更新 uv group，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 在 29 個目錄中更新 uv group，共 3 項更新 ([#21665](https://github.com/run-llama/llama_index/pull/21665))
- chore(deps): 在 31 個目錄中更新 uv group，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 在 35 個目錄中更新 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 在 32 個目錄中更新 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 在 31 個目錄中更新 uv group，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))
- chore(deps): 在 31 個目錄中更新 uv group，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))
- chore(deps): 在 30 個目錄中更新 uv group，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))
- chore(deps): 在 30 個目錄中更新 uv group，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))
- chore(deps): 在 12 個目錄中更新 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 在 21 個目錄中更新 uv group，共 3 項更新 ([#21725](https://github.com/run-llama/llama_index/pull/21725))
- chore(deps): 在 11 個目錄中更新 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))
- chore(deps): 在 17 個目錄中更新 uv group，共 3 項更新 ([#21727](https://github.com/run-llama/llama_index/pull/21727))
- chore(deps): 在 18 個目錄中更新 uv group，共 4 項更新 ([#21733](https://github.com/run-llama/llama_index/pull/21733))

### llama-index-readers-file \[0.6.0]

- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))
- chore(deps): 更新 32 個目錄中的 uv group，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 更新 29 個目錄中的 uv group，共 3 項更新 ([#21665](https://github.com/run-llama/llama_index/pull/21665))
- chore(deps): 更新 31 個目錄中的 uv group，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 更新 35 個目錄中的 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 更新 32 個目錄中的 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))
- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 21 個目錄中的 uv group，共 3 項更新 ([#21725](https://github.com/run-llama/llama_index/pull/21725))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))
- chore(deps): 更新 17 個目錄中的 uv group，共 3 項更新 ([#21727](https://github.com/run-llama/llama_index/pull/21727))
- chore(deps): 更新 18 個目錄中的 uv group，共 4 項更新 ([#21733](https://github.com/run-llama/llama_index/pull/21733))

### llama-index-readers-firebase-realtimedb \[0.5.0]

- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))
- chore(deps): 更新 32 個目錄中的 uv group，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 更新 29 個目錄中的 uv group，共 3 項更新 ([#21665](https://github.com/run-llama/llama_index/pull/21665))
- chore(deps): 更新 31 個目錄中的 uv group，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 更新 35 個目錄中的 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 更新 32 個目錄中的 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))
- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 21 個目錄中的 uv group，共 3 項更新 ([#21725](https://github.com/run-llama/llama_index/pull/21725))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))
- chore(deps): 更新 17 個目錄中的 uv group，共 3 項更新 ([#21727](https://github.com/run-llama/llama_index/pull/21727))
- chore(deps): 更新 18 個目錄中的 uv group，共 4 項更新 ([#21733](https://github.com/run-llama/llama_index/pull/21733))

### llama-index-readers-firestore \[0.5.0]

- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21657](https://github.com/run-llama/llama_index/pull/21657))
- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))
- chore(deps): 更新 32 個目錄中的 uv group，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 更新 29 個目錄中的 uv group，共 3 項更新 ([#21665](https://github.com/run-llama/llama_index/pull/21665))
- chore(deps): 更新 31 個目錄中的 uv group，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 更新 35 個目錄中的 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 更新 32 個目錄中的 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))
- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 21 個目錄中的 uv group，共 3 項更新 ([#21725](https://github.com/run-llama/llama_index/pull/21725))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))
- chore(deps): 更新 17 個目錄中的 uv group，共 3 項更新 ([#21727](https://github.com/run-llama/llama_index/pull/21727))
- chore(deps): 更新 18 個目錄中的 uv group，共 4 項更新 ([#21733](https://github.com/run-llama/llama_index/pull/21733))

### llama-index-readers-gcs \[0.6.1]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-readers-genius \[0.5.0]

- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))
- chore(deps): 更新 32 個目錄中的 uv group，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 更新 29 個目錄中的 uv group，共 3 項更新 ([#21665](https://github.com/run-llama/llama_index/pull/21665))
- chore(deps): 更新 31 個目錄中的 uv group，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 更新 35 個目錄中的 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 更新 32 個目錄中的 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))
- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 21 個目錄中的 uv group，共 3 項更新 ([#21725](https://github.com/run-llama/llama_index/pull/21725))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))
- chore(deps): 更新 17 個目錄中的 uv group，共 3 項更新 ([#21727](https://github.com/run-llama/llama_index/pull/21727))
- chore(deps): 更新 18 個目錄中的 uv group，共 4 項更新 ([#21733](https://github.com/run-llama/llama_index/pull/21733))

### llama-index-readers-gitbook \[0.5.0]

- chore(deps-dev): 更新 33 個目錄中的 uv group，共 2 項更新 ([#21663](https://github.com/run-llama/llama_index/pull/21663))
- chore(deps): 更新 32 個目錄中的 uv group，共 3 項更新 ([#21664](https://github.com/run-llama/llama_index/pull/21664))
- chore(deps): 更新 29 個目錄中的 uv group，共 3 項更新 ([#21665](https://github.com/run-llama/llama_index/pull/21665))
- chore(deps): 更新 31 個目錄中的 uv group，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 更新 35 個目錄中的 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 更新 32 個目錄中的 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))
- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 21 個目錄中的 uv group，共 3 項更新 ([#21725](https://github.com/run-llama/llama_index/pull/21725))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))
- chore(deps): 更新 17 個目錄中的 uv group，共 3 項更新 ([#21727](https://github.com/run-llama/llama_index/pull/21727))
- chore(deps): 更新 18 個目錄中的 uv group，共 4 項更新 ([#21733](https://github.com/run-llama/llama_index/pull/21733))

### llama-index-readers-github \[0.11.2]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))
- 恢復測試通過 ([#21737](https://github.com/run-llama/llama_index/pull/21737))

### llama-index-readers-joplin \[0.6.1]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-readers-mbox \[0.6.1]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-readers-microsoft-sharepoint \[0.9.1]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-readers-obsidian \[0.7.1]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-readers-pandas-ai \[0.6.1]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-readers-patentsview \[1.1.0]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-readers-pebblo \[0.6.1]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-readers-s3 \[0.6.1]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-readers-service-now \[0.3.0]

- chore(deps): 更新 32 個目錄中的 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))
- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 21 個目錄中的 uv group，共 3 項更新 ([#21725](https://github.com/run-llama/llama_index/pull/21725))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))
- chore(deps): 更新 17 個目錄中的 uv group，共 3 項更新 ([#21727](https://github.com/run-llama/llama_index/pull/21727))
- chore(deps): 更新 18 個目錄中的 uv group，共 4 項更新 ([#21733](https://github.com/run-llama/llama_index/pull/21733))
- chore(deps): 更新 1 個目錄中的 pip group，共 1 項更新 ([#21735](https://github.com/run-llama/llama_index/pull/21735))

### llama-index-readers-whatsapp \[0.5.0]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-retrievers-you \[1.1.0]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-storage-chat-store-opensearch \[0.2.0]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 21 個目錄中的 uv group，共 3 項更新 ([#21725](https://github.com/run-llama/llama_index/pull/21725))- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))
- chore(deps): 更新 17 個目錄中的 uv group，共 3 項更新 ([#21727](https://github.com/run-llama/llama_index/pull/21727))
- chore(deps): 更新 18 個目錄中的 uv group，共 4 項更新 ([#21733](https://github.com/run-llama/llama_index/pull/21733))

### llama-index-storage-chat-store-redis \[0.7.0]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-tools-airweave \[0.3.0]

- 修正測試使其重新通過 ([#21737](https://github.com/run-llama/llama_index/pull/21737))

### llama-index-tools-aws-bedrock-agentcore \[0.3.1]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-tools-exa \[0.5.2]

- exa tool: 更新至目前的 API 規範 ([#21705](https://github.com/run-llama/llama_index/pull/21705))

### llama-index-tools-google \[0.7.1]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-tools-mcp-discovery \[0.2.0]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-tools-playwright \[0.4.0]

- 修正測試使其重新通過 ([#21737](https://github.com/run-llama/llama_index/pull/21737))

### llama-index-tools-seltz \[0.4.0]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))
- 修正測試使其重新通過 ([#21737](https://github.com/run-llama/llama_index/pull/21737))

### llama-index-tools-typecast \[0.1.0]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-utils-huggingface \[0.5.0]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-utils-oracleai \[0.4.0]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-utils-qianfan \[0.5.0]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-vector-stores-couchbase \[0.7.1]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))
- 修正測試使其重新通過 ([#21737](https://github.com/run-llama/llama_index/pull/21737))

### llama-index-vector-stores-milvus \[1.1.1]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))
- fix(milvus): 解決 string\_expr 與 filter 優先順序的問題… ([#21779](https://github.com/run-llama/llama_index/pull/21779))

### llama-index-vector-stores-mongodb \[0.10.1]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-vector-stores-oceanbase \[0.4.0]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-vector-stores-opensearch \[1.2.0]

- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-vector-stores-qdrant \[0.10.1]

- chore(deps): 更新 31 個目錄中的 uv group，共 3 項更新 ([#21668](https://github.com/run-llama/llama_index/pull/21668))
- chore(deps): 更新 35 個目錄中的 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 更新 32 個目錄中的 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))
- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 21 個目錄中的 uv group，共 3 項更新 ([#21725](https://github.com/run-llama/llama_index/pull/21725))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))
- chore(deps): 更新 17 個目錄中的 uv group，共 3 項更新 ([#21727](https://github.com/run-llama/llama_index/pull/21727))
- chore(deps): 更新 18 個目錄中的 uv group，共 4 項更新 ([#21733](https://github.com/run-llama/llama_index/pull/21733))
- 恢復測試通過 ([#21737](https://github.com/run-llama/llama_index/pull/21737))

### llama-index-vector-stores-vearch \[0.5.0]

- 更新 Vearch demo notebook 的 import ([#21887](https://github.com/run-llama/llama_index/pull/21887))

### llama-index-vector-stores-weaviate \[1.6.1]

- fix: 支援較新版本的 Weaviate batch context managers ([#21507](https://github.com/run-llama/llama_index/pull/21507))

### llama-index-vector-stores-yugabytedb \[0.6.0]

- fix: 修正 You.com 與 YugabyteDB 文件的拼字錯誤 ([#21709](https://github.com/run-llama/llama_index/pull/21709))
- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))

### llama-index-voice-agents-gemini-live \[0.4.1]

- chore: 允許使用 `google-genai` 2.0+ SDKs ([#21710](https://github.com/run-llama/llama_index/pull/21710))
- chore(deps): 更新 35 個目錄中的 pip group，共 4 項更新 ([#21714](https://github.com/run-llama/llama_index/pull/21714))
- chore(deps): 更新 32 個目錄中的 uv group，共 5 項更新 ([#21717](https://github.com/run-llama/llama_index/pull/21717))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21719](https://github.com/run-llama/llama_index/pull/21719))
- chore(deps): 更新 31 個目錄中的 uv group，共 5 項更新 ([#21720](https://github.com/run-llama/llama_index/pull/21720))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21721](https://github.com/run-llama/llama_index/pull/21721))
- chore(deps): 更新 30 個目錄中的 uv group，共 5 項更新 ([#21722](https://github.com/run-llama/llama_index/pull/21722))
- chore(deps): 更新 12 個目錄中的 pip group，共 4 項更新 ([#21724](https://github.com/run-llama/llama_index/pull/21724))
- chore(deps): 更新 21 個目錄中的 uv group，共 3 項更新 ([#21725](https://github.com/run-llama/llama_index/pull/21725))
- chore(deps): 更新 11 個目錄中的 pip group，共 4 項更新 ([#21726](https://github.com/run-llama/llama_index/pull/21726))
- chore(deps): 更新 17 個目錄中的 uv group，共 3 項更新 ([#21727](https://github.com/run-llama/llama_index/pull/21727))
- chore(deps): 更新 18 個目錄中的 uv group，共 4 項更新 ([#21733](https://github.com/run-llama/llama_index/pull/21733))
- 恢復測試通過 ([#21737](https://github.com/run-llama/llama_index/pull/21737))

## \[2026-05-14]

### llama-index-agent-agentmesh \[0.2.0]

- 批次執行 uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-callbacks-agentops \[0.5.0]

- chore(deps): 更新 55 個目錄中的 pip group，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- 批次執行 uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-callbacks-aim \[0.4.1]

- 批次執行 uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-callbacks-argilla \[0.5.0]

- chore(deps): 更新 55 個目錄中的 pip group，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))

### llama-index-callbacks-arize-phoenix \[0.7.0]

- chore(deps): 更新 55 個目錄中的 pip group，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-callbacks-honeyhive \[0.5.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-callbacks-langfuse \[0.5.0]

- chore(deps): 在 55 個目錄中更新 pip group，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-callbacks-literalai \[1.4.0]

- chore(deps): 在 55 個目錄中更新 pip group，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-callbacks-openinference \[0.5.0]

- chore(deps): 在 55 個目錄中更新 pip group，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-callbacks-opik \[1.3.0]

- chore(deps): 在 55 個目錄中更新 pip group，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-callbacks-promptlayer \[0.5.0]

- chore(deps): 在 55 個目錄中更新 pip group，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-callbacks-uptrain \[0.6.0]

- chore(deps): 在 55 個目錄中更新 pip group，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-callbacks-wandb \[0.5.0]

- chore(deps): 在 55 個目錄中更新 pip group，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-core \[0.14.22]

- fix(instrumentation): 讓 SparseEmbeddingStartEvent 繼承 EmbeddingStartEvent ([#21119](https://github.com/run-llama/llama_index/pull/21119))
- fix: 從公用 **all** 列表中移除過時的 exports ([#21133](https://github.com/run-llama/llama_index/pull/21133))
- 在 IngestionPipeline 中保留來自 multiprocessing workers 的快取寫入 ([#21301](https://github.com/run-llama/llama_index/pull/21301))
- feat(core): 多模態合成 ([#21374](https://github.com/run-llama/llama_index/pull/21374))
- fix: 避免在 LLM event model\_dump 方法中變更 response.raw ([#21424](https://github.com/run-llama/llama_index/pull/21424))
- fix(memory): 在 Memory.\_estimate\_token\_count 中處理 DocumentBlock ([#21529](https://github.com/run-llama/llama_index/pull/21529))
- fix: 在 FunctionTool 的 sync\_to\_async 中傳遞 contextvars ([#21558](https://github.com/run-llama/llama_index/pull/21558))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-adapter \[0.5.0]

- chore(deps): 在 55 個目錄中更新 pip group，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-alephalpha \[0.5.0]

- chore(deps): 在 55 個目錄中更新 pip group，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-alibabacloud-aisearch \[0.4.0]

- chore(deps): 在 55 個目錄中更新 pip group，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-anyscale \[0.5.1]

- chore(deps): 在 55 個目錄中更新 pip group，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-autoembeddings \[0.3.0]

- chore(deps): 在 55 個目錄中更新 pip group，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-azure-inference \[0.5.0]

- chore(deps): 在 55 個目錄中更新 pip group，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-azure-openai \[0.5.2]

- chore(deps): 在 55 個目錄中更新 pip group，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-baseten \[0.2.1]

- chore(deps): 在 55 個目錄中更新 pip group，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-bedrock \[0.8.0]

- chore(deps): 在 55 個目錄中更新 pip group，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-clarifai \[0.5.0]

- chore(deps): 更新 55 個目錄中的 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-clip \[0.6.0]

- chore(deps): 更新 55 個目錄中的 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-cloudflare-workersai \[0.5.0]

- chore(deps): 更新 55 個目錄中的 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-cohere \[0.8.0]

- chore(deps): 更新 55 個目錄中的 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))

### llama-index-embeddings-dashscope \[0.5.0]

- chore(deps): 更新 55 個目錄中的 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-databricks \[0.5.1]

- chore(deps): 更新 55 個目錄中的 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-deepinfra \[0.5.0]

- chore(deps): 更新 55 個目錄中的 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-elasticsearch \[0.5.0]

- chore(deps): 更新 55 個目錄中的 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-fastembed \[0.6.0]

- chore(deps): 更新 55 個目錄中的 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-fireworks \[0.5.2]

- chore(deps): 更新 55 個目錄中的 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-gaudi \[0.4.0]

- chore(deps): 更新 55 個目錄中的 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- chore(deps): 更新 2 個目錄中的 pip 群組，共 2 項更新 ([#21436](https://github.com/run-llama/llama_index/pull/21436))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-gigachat \[0.5.0]

- chore(deps): 更新 55 個目錄中的 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-google-genai \[0.5.0]

- chore(deps): 更新 55 個目錄中的 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-heroku \[0.2.0]

- chore(deps): 更新 55 個目錄中的 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))

### llama-index-embeddings-huggingface \[0.7.0]

- chore(deps): 更新 55 個目錄中的 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-huggingface-api \[0.5.0]

- chore(deps): 更新 55 個目錄中的 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-huggingface-openvino \[0.7.0]

- chore(deps): 更新 55 個目錄中的 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-huggingface-optimum \[0.4.1]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-huggingface-optimum-intel \[0.5.0]

- chore(deps): 更新 55 個目錄中的 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-ibm \[0.6.0.post1]

- chore(deps): 更新 55 個目錄中的 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))

### llama-index-embeddings-instructor \[0.5.0]

- chore(deps): 更新 55 個目錄中的 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-isaacus \[0.2.0]

- chore(deps): 在 55 個目錄中更新 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-jinaai \[0.6.0]

- chore(deps): 在 55 個目錄中更新 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))

### llama-index-embeddings-langchain \[0.5.0]

- chore(deps): 在 55 個目錄中更新 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-litellm \[0.5.0]

- chore(deps): 在 55 個目錄中更新 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-llamafile \[0.5.0]

- chore(deps): 在 55 個目錄中更新 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-llm-rails \[0.5.0]

- chore(deps): 在 55 個目錄中更新 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-mistralai \[0.5.1]

- “fix: 將 mistralai>=2.0.0 的 Mistral 替換為 MistralClient” ([#21126](https://github.com/run-llama/llama_index/pull/21126))
- chore(deps): 在 55 個目錄中更新 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-mixedbreadai \[0.6.0]

- chore(deps): 在 55 個目錄中更新 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-modelscope \[0.6.0]

- chore(deps): 在 55 個目錄中更新 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))

### llama-index-embeddings-nebius \[0.5.1]

- chore(deps): 在 55 個目錄中更新 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-netmind \[0.3.0]

- chore(deps): 在 55 個目錄中更新 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-nomic \[0.8.0]

- chore(deps): 在 55 個目錄中更新 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-nvidia \[0.5.1]

- chore(deps): 在 55 個目錄中更新 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))

### llama-index-embeddings-oci-data-science \[0.3.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-oci-genai \[0.5.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-ollama \[0.9.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-opea \[0.3.1]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-openai \[0.6.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-openai-like \[0.3.1]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-openvino-genai \[0.7.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-oracleai \[0.4.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-premai \[0.5.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-sagemaker-endpoint \[0.5.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-siliconflow \[0.4.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-text-embeddings-inference \[0.5.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-textembed \[0.4.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-together \[0.5.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-vertex \[0.5.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-vertex-endpoint \[0.4.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-vllm \[0.1.1]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-voyageai \[0.6.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-xinference \[0.4.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-yandexgpt \[0.5.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-embeddings-zhipuai \[0.4.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-evaluation-tonic-validate \[0.6.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-extractors-entity \[0.5.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-extractors-marvin \[0.5.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-extractors-relik \[0.4.1]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-graph-rag-cognee \[0.3.1]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-graph-stores-ApertureDB \[0.3.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-graph-stores-falkordb \[0.5.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-graph-stores-memgraph \[0.5.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-graph-stores-nebula \[0.6.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-graph-stores-neo4j \[0.7.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-graph-stores-neptune \[0.5.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-graph-stores-tidb \[0.5.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-indices-managed-bge-m3 \[0.7.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-indices-managed-colbert \[0.6.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-indices-managed-dashscope \[0.5.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-indices-managed-google \[0.5.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-indices-managed-lancedb \[0.3.1]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-indices-managed-llama-cloud \[0.11.1]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-indices-managed-postgresml \[0.6.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-indices-managed-vectara \[0.6.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-indices-managed-vertexai \[0.4.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-ingestion-ray \[0.2.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-instrumentation \[0.5.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-llms-aibadgr \[0.2.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-llms-alephalpha \[0.5.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-llms-alibabacloud-aisearch \[0.4.0]

- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-llms-anthropic \[0.11.4]

- anthropic: 在 streaming additional\_kwargs 中傳遞 thinking\_delta ([#21423](https://github.com/run-llama/llama_index/pull/21423))
- bedrock opus + anthropic opus 4.7 支援 ([#21438](https://github.com/run-llama/llama_index/pull/21438))
- mass uv lock —upgrade ([#21638](https://github.com/run-llama/llama_index/pull/21638))

### llama-index-llms-azure-openai \[0.5.5]

- fix(llms-azure-openai): 將 pytest-asyncio 新增至 dev dependencies ([#21500](https://github.com/run-llama/llama_index/pull/21500))
- fix(azure-openai): 在 AzureOpenAIResponses structured predict 中使用 deployment name ([#21530](https://github.com/run-llama/llama_index/pull/21530))

### llama-index-llms-bedrock-converse \[0.14.10]

- feat(bedrock-converse): 新增對 Claude Opus 4.7 的支援 ([#21405](https://github.com/run-llama/llama_index/pull/21405))
- bedrock opus + anthropic opus 4.7 支援 ([#21438](https://github.com/run-llama/llama_index/pull/21438))
- 不要將 temperature 傳遞至 bedrock retry ([#21439](https://github.com/run-llama/llama_index/pull/21439))
- feat(bedrock-converse): 新增 async\_client 參數以重複使用共用的 aioboto3 client ([#21556](https://github.com/run-llama/llama_index/pull/21556))

### llama-index-llms-google-genai \[0.9.4]

- 修復 google genai 在 streaming 時的 thought 輸出 ([#21502](https://github.com/run-llama/llama_index/pull/21502))
- fix(google-genai): 將 DocumentBlock.title 作為 display\_name 傳遞至 File API ([#21641](https://github.com/run-llama/llama_index/pull/21641))
- Google LLMs: 使用 vertexai client 時，若檔案過大則提前報錯 ([#21642](https://github.com/run-llama/llama_index/pull/21642))
- vbump google genai ([#21649](https://github.com/run-llama/llama_index/pull/21649))

### llama-index-llms-mistralai \[0.10.2]

- “fix: 在 mistralai>=2.0.0 中將 Mistral 替換為 MistralClient” ([#21126](https://github.com/run-llama/llama_index/pull/21126))
- 版本更新 ([#21547](https://github.com/run-llama/llama_index/pull/21547))

### llama-index-llms-openai \[0.7.8]

- fix: 在 to\_openai\_message\_dict 中 JSON-serialize ToolCallBlock.tool\_kwargs ([#21389](https://github.com/run-llama/llama_index/pull/21389))
- feat(llms-openai): 新增 gpt-5.5 與 gpt-5.5-2026-04-23 模型支援 ([#21499](https://github.com/run-llama/llama_index/pull/21499))
- fix(azure-openai): 在 AzureOpenAIResponses structured predict 中使用 deployment name ([#21530](https://github.com/run-llama/llama_index/pull/21530))

### llama-index-llms-openai-like \[0.7.2]

- feat(openai-like): 為 Responses API 新增 OpenAILikeResponses 類別 ([#21246](https://github.com/run-llama/llama_index/pull/21246))

### llama-index-observability-otel \[0.6.2]

- \[bugfix] otel spans 應附加至 context ([#21533](https://github.com/run-llama/llama_index/pull/21533))
- 修復 OTel context detach 雜訊 ([#21587](https://github.com/run-llama/llama_index/pull/21587))

### llama-index-utils-azure \[0.5.0]

- chore(deps): 更新 55 個目錄中的 pip 群組，共 3 項更新 ([#21435](https://github.com/run-llama/llama_index/pull/21435))

### llama-index-vector-stores-qdrant \[0.10.1]

- fix(qdrant): 修復使用 AsyncQdrantClient 建立 async collection 的問題 ([#21419](https://github.com/run-llama/llama_index/pull/21419))

## \[2026-04-21]

### llama-index-callbacks-honeyhive \[0.5.0]

- chore(deps): 更新 87 個目錄中的 pip 群組，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip 群組，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-core \[0.14.21]

- fix(core): 當提供無效的 node ID 時，防止在 `DocumentSummaryIndex.delete_nodes` 中發生 `KeyError` ([#21067](https://github.com/run-llama/llama_index/pull/21067))
- fix(core): 處理來自 structured output 失敗的 `ValueError` 與 `TypeError` ([#21090](https://github.com/run-llama/llama_index/pull/21090))
- fix: 在 persistence layer 的 fs.open() 呼叫中加入明確的 UTF-8 編碼 ([#21111](https://github.com/run-llama/llama_index/pull/21111))
- 修復 Message Block Buffer Resolution 中的重大變更 ([#21339](https://github.com/run-llama/llama_index/pull/21339))
- chore(deps): 更新 87 個目錄中的 pip 群組，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip 群組，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-embeddings-huggingface-optimum \[0.4.1]

- chore(deps): 更新 96 個目錄中的 pip 群組，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))

### llama-index-embeddings-nvidia \[0.5.1]

- feat(embeddings-nvidia): 新增 http client 支援 ([#21046](https://github.com/run-llama/llama_index/pull/21046))

### llama-index-embeddings-oracleai \[0.4.0]

- chore(deps): 更新 96 個目錄中的 pip 群組，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))

### llama-index-embeddings-premai \[0.5.0]

- chore(deps): 更新 96 個目錄中的 pip 群組，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip 群組，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip 群組，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-embeddings-text-embeddings-inference \[0.5.0]

- chore(deps): 更新 96 個目錄中的 pip 群組，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))

### llama-index-embeddings-textembed \[0.4.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))

### llama-index-embeddings-together \[0.5.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))

### llama-index-embeddings-upstage \[0.6.1]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-embeddings-vertex \[0.5.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))

### llama-index-embeddings-vertex-endpoint \[0.4.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))

### llama-index-embeddings-vllm \[0.1.1]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))

### llama-index-embeddings-voyageai \[0.6.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))

### llama-index-embeddings-xinference \[0.4.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))

### llama-index-embeddings-yandexgpt \[0.5.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))

### llama-index-embeddings-zhipuai \[0.4.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))

### llama-index-evaluation-tonic-validate \[0.6.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))

### llama-index-extractors-entity \[0.5.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))

### llama-index-extractors-marvin \[0.5.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))

### llama-index-extractors-relik \[0.4.1]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))

### llama-index-graph-stores-ApertureDB \[0.3.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))

### llama-index-graph-stores-falkordb \[0.5.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))

### llama-index-graph-stores-memgraph \[0.5.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))

### llama-index-graph-stores-nebula \[0.6.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))

### llama-index-graph-stores-neo4j \[0.7.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))

### llama-index-graph-stores-neptune \[0.5.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))

### llama-index-graph-stores-tidb \[0.5.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))

### llama-index-indices-managed-bge-m3 \[0.7.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))

### llama-index-indices-managed-colbert \[0.6.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))

### llama-index-indices-managed-dashscope \[0.5.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))

### llama-index-indices-managed-google \[0.5.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))

### llama-index-indices-managed-lancedb \[0.3.1]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))

### llama-index-indices-managed-llama-cloud \[0.11.1]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))

### llama-index-indices-managed-postgresml \[0.6.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))

### llama-index-indices-managed-vectara \[0.6.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))

### llama-index-indices-managed-vertexai \[0.4.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))

### llama-index-ingestion-ray \[0.2.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))

### llama-index-llms-ai21 \[0.7.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))

### llama-index-llms-aibadgr \[0.2.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))

### llama-index-llms-alephalpha \[0.5.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))

### llama-index-llms-alibabacloud-aisearch \[0.4.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))

### llama-index-llms-anyscale \[0.5.1]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))

### llama-index-llms-asi \[0.3.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-azure-inference \[0.7.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))

### llama-index-llms-azure-openai \[0.5.3]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))

### llama-index-llms-baseten \[0.2.1]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))

### llama-index-llms-bedrock \[0.5.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))- chore(deps): 在 87 個目錄中更新 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))

### llama-index-llms-bedrock-converse \[0.14.6]

- 新增 Google Gemma 模型並將版本更新至 0.14.6 ([#21380](https://github.com/run-llama/llama_index/pull/21380))
- chore(deps): 在 87 個目錄中更新 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 在 68 個目錄中更新 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-cerebras \[0.4.0]

- chore(deps): 在 96 個目錄中更新 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 在 87 個目錄中更新 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))

### llama-index-llms-clarifai \[0.5.0]

- chore(deps): 在 96 個目錄中更新 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 在 87 個目錄中更新 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))

### llama-index-llms-cleanlab \[0.7.0]

- chore(deps): 在 96 個目錄中更新 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 在 87 個目錄中更新 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 在 68 個目錄中更新 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-cloudflare-ai-gateway \[0.2.1]

- chore(deps): 在 96 個目錄中更新 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 在 87 個目錄中更新 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))

### llama-index-llms-cometapi \[0.2.0]

- chore(deps): 在 96 個目錄中更新 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 在 87 個目錄中更新 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 在 68 個目錄中更新 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-dashscope \[0.6.1]

- fix(dashscope): 將 num\_output 與 context\_window 分離以修正 prompt… ([#21051](https://github.com/run-llama/llama_index/pull/21051))

### llama-index-llms-databricks \[0.5.0]

- chore(deps): 在 96 個目錄中更新 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 在 87 個目錄中更新 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 在 68 個目錄中更新 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-deepinfra \[0.6.1]

- chore(deps): 在 96 個目錄中更新 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))

### llama-index-llms-deepseek \[0.3.0]

- chore(deps): 在 96 個目錄中更新 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 在 87 個目錄中更新 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 在 68 個目錄中更新 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-everlyai \[0.5.1]

- chore(deps): 在 96 個目錄中更新 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))

### llama-index-llms-featherlessai \[0.3.0]

- chore(deps): 在 96 個目錄中更新 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 在 87 個目錄中更新 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 在 68 個目錄中更新 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-fireworks \[0.5.1]

- chore(deps): 在 96 個目錄中更新 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))

### llama-index-llms-friendli \[0.5.0]

- chore(deps): 在 96 個目錄中更新 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 在 87 個目錄中更新 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 在 68 個目錄中更新 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-gaudi \[0.4.0]

- chore(deps): 在 96 個目錄中更新 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))- chore(deps): 更新 87 個目錄中的 pip group，包含 2 個更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，包含 2 個更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-gigachat \[0.5.0]

- chore(deps): 更新 96 個目錄中的 pip group，包含 2 個更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，包含 2 個更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，包含 2 個更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-groq \[0.5.0]

- chore(deps): 更新 96 個目錄中的 pip group，包含 2 個更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，包含 2 個更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，包含 2 個更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-helicone \[0.2.0]

- chore(deps): 更新 96 個目錄中的 pip group，包含 2 個更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，包含 2 個更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，包含 2 個更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-heroku \[0.2.0]

- chore(deps): 更新 96 個目錄中的 pip group，包含 2 個更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，包含 2 個更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，包含 2 個更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-huggingface \[0.7.0]

- chore(deps): 更新 96 個目錄中的 pip group，包含 2 個更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，包含 2 個更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，包含 2 個更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-huggingface-api \[0.7.0]

- chore(deps): 更新 96 個目錄中的 pip group，包含 2 個更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，包含 2 個更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，包含 2 個更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-keywordsai \[1.2.1]

- chore(deps): 更新 96 個目錄中的 pip group，包含 2 個更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))

### llama-index-llms-konko \[0.5.0]

- chore(deps): 更新 96 個目錄中的 pip group，包含 2 個更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，包含 2 個更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，包含 2 個更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-langchain \[0.8.0]

- chore(deps): 更新 96 個目錄中的 pip group，包含 2 個更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，包含 2 個更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，包含 2 個更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-litellm \[0.7.1]

- chore(deps): 更新 68 個目錄中的 pip group，包含 2 個更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-llama-api \[0.6.0]

- chore(deps): 更新 96 個目錄中的 pip group，包含 2 個更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，包含 2 個更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，包含 2 個更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-llama-cpp \[0.6.0]

- chore(deps): 更新 96 個目錄中的 pip group，包含 2 個更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，包含 2 個更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，包含 2 個更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-llamafile \[0.5.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 個更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 個更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 個更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-lmstudio \[0.5.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 個更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 個更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 個更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-localai \[0.6.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 個更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 個更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 個更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-maritalk \[0.6.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 個更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 個更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 個更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-meta \[0.3.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 個更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 個更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 個更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-mistralai \[0.10.1]

- fix: 不使用 regex 解析 MistralAI 結構化 ThinkChunk/TextChunk ([#20916](https://github.com/run-llama/llama_index/pull/20916))

### llama-index-llms-monsterapi \[0.5.1]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 個更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 個更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 個更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-openai \[0.7.5]

- chore(deps): 更新 87 個目錄中的 pip group，共 2 個更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 個更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-openai-like \[0.7.1]

- chore(deps): 更新 87 個目錄中的 pip group，共 2 個更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 個更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-openvino-genai \[0.3.1]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 個更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 個更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 個更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-ovhcloud \[0.2.1]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 個更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 個更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-perplexity \[0.5.1]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 個更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 個更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 個更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-portkey \[0.5.1]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 個更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 個更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 個更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-upstage \[0.8.1]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-llms-yi \[0.5.1]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-postprocessor-cohere-rerank \[0.8.0]

- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-postprocessor-google-rerank \[0.1.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-postprocessor-nvidia-rerank \[0.6.0]

- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-readers-datasets \[0.2.0]

- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-readers-gcs \[0.6.1]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-readers-github \[0.11.2]

- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-readers-joplin \[0.6.1]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-readers-mbox \[0.6.1]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-readers-microsoft-sharepoint \[0.9.1]

- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-readers-obsidian \[0.7.1]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-readers-paddle-ocr \[0.2.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-readers-pandas-ai \[0.6.1]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))- chore(deps): 更新 68 個目錄中的 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-readers-patentsview \[1.1.0]

- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-readers-pebblo \[0.6.1]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-readers-s3 \[0.6.1]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-readers-service-now \[0.3.0]

- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-readers-whatsapp \[0.5.0]

- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-storage-chat-store-redis \[0.7.0]

- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-tools-aws-bedrock-agentcore \[0.3.1]

- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-tools-google \[0.7.1]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-tools-mcp-discovery \[0.2.0]

- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-tools-seltz \[0.3.0]

- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-tools-typecast \[0.1.0]

- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-utils-huggingface \[0.5.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-utils-oracleai \[0.4.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，共 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-utils-qianfan \[0.5.0]

- chore(deps): 更新 96 個目錄中的 pip group，共 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，共 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))- chore(deps): 更新 68 個目錄中的 pip group，包含 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-vector-stores-couchbase \[0.7.1]

- chore(deps): 更新 96 個目錄中的 pip group，包含 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，包含 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，包含 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-vector-stores-databricks \[0.6.1]

- fix: 使 DatabricksVectorSearch 的 primary key 欄位可配置 ([#20966](https://github.com/run-llama/llama_index/pull/20966))

### llama-index-vector-stores-milvus \[1.1.0]

- chore(deps): 更新 87 個目錄中的 pip group，包含 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，包含 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-vector-stores-mongodb \[0.10.1]

- chore(deps): 更新 96 個目錄中的 pip group，包含 2 項更新 ([#21381](https://github.com/run-llama/llama_index/pull/21381))
- chore(deps): 更新 87 個目錄中的 pip group，包含 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，包含 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-vector-stores-oceanbase \[0.4.0]

- chore(deps): 更新 87 個目錄中的 pip group，包含 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，包含 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-vector-stores-opensearch \[1.2.0]

- chore(deps): 更新 87 個目錄中的 pip group，包含 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，包含 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

### llama-index-vector-stores-yugabytedb \[0.6.0]

- chore(deps): 更新 87 個目錄中的 pip group，包含 2 項更新 ([#21382](https://github.com/run-llama/llama_index/pull/21382))
- chore(deps): 更新 68 個目錄中的 pip group，包含 2 項更新 ([#21394](https://github.com/run-llama/llama_index/pull/21394))

## \[2026-04-03]

### llama-index-agent-agentmesh \[0.2.0]

- fix: 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-callbacks-agentops \[0.5.0]

- chore(deps): 更新 50 個目錄中的 uv group，包含 2 項更新 ([#21164](https://github.com/run-llama/llama_index/pull/21164))
- chore(deps): 更新 24 個目錄中的 uv group，包含 1 項更新 ([#21219](https://github.com/run-llama/llama_index/pull/21219))
- chore(deps): 更新 21 個目錄中的 uv group，包含 2 項更新 ([#21221](https://github.com/run-llama/llama_index/pull/21221))
- fix: 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-callbacks-aim \[0.4.1]

- fix: 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-callbacks-argilla \[0.5.0]

- chore(deps): 更新 58 個目錄中的 uv group，包含 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 更新 24 個目錄中的 uv group，包含 1 項更新 ([#21219](https://github.com/run-llama/llama_index/pull/21219))
- chore(deps): 更新 21 個目錄中的 uv group，包含 2 項更新 ([#21221](https://github.com/run-llama/llama_index/pull/21221))
- fix: 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-callbacks-arize-phoenix \[0.7.0]

- chore(deps): 更新 58 個目錄中的 uv group，包含 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 更新 24 個目錄中的 uv group，包含 1 項更新 ([#21219](https://github.com/run-llama/llama_index/pull/21219))
- chore(deps): 更新 21 個目錄中的 uv group，包含 2 項更新 ([#21221](https://github.com/run-llama/llama_index/pull/21221))
- fix: 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-callbacks-honeyhive \[0.5.0]

- chore(deps): 更新 58 個目錄中的 uv group，包含 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 更新 24 個目錄中的 uv group，包含 1 項更新 ([#21219](https://github.com/run-llama/llama_index/pull/21219))
- chore(deps): 更新 21 個目錄中的 uv group，包含 2 項更新 ([#21221](https://github.com/run-llama/llama_index/pull/21221))
- fix: 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-callbacks-langfuse \[0.5.0]

- chore(deps): 更新 58 個目錄中的 uv group，包含 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 更新 24 個目錄中的 uv group，包含 1 項更新 ([#21219](https://github.com/run-llama/llama_index/pull/21219))
- chore(deps): 更新 21 個目錄中的 uv group，包含 2 項更新 ([#21221](https://github.com/run-llama/llama_index/pull/21221))- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-callbacks-literalai \[1.4.0]

- chore(deps): 在 58 個目錄中更新 uv group，共 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 24 個目錄中更新 uv group，共 1 項更新 ([#21219](https://github.com/run-llama/llama_index/pull/21219))
- chore(deps): 在 21 個目錄中更新 uv group，共 2 項更新 ([#21221](https://github.com/run-llama/llama_index/pull/21221))
- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-callbacks-openinference \[0.5.0]

- chore(deps): 在 58 個目錄中更新 uv group，共 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 24 個目錄中更新 uv group，共 1 項更新 ([#21219](https://github.com/run-llama/llama_index/pull/21219))
- chore(deps): 在 21 個目錄中更新 uv group，共 2 項更新 ([#21221](https://github.com/run-llama/llama_index/pull/21221))
- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-callbacks-opik \[1.3.0]

- chore(deps): 在 58 個目錄中更新 uv group，共 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 24 個目錄中更新 uv group，共 1 項更新 ([#21219](https://github.com/run-llama/llama_index/pull/21219))
- chore(deps): 在 21 個目錄中更新 uv group，共 2 項更新 ([#21221](https://github.com/run-llama/llama_index/pull/21221))
- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-callbacks-promptlayer \[0.5.0]

- chore(deps): 在 58 個目錄中更新 uv group，共 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 24 個目錄中更新 uv group，共 1 項更新 ([#21219](https://github.com/run-llama/llama_index/pull/21219))
- chore(deps): 在 21 個目錄中更新 uv group，共 2 項更新 ([#21221](https://github.com/run-llama/llama_index/pull/21221))
- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-callbacks-uptrain \[0.6.0]

- chore(deps): 在 58 個目錄中更新 uv group，共 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 24 個目錄中更新 uv group，共 1 項更新 ([#21219](https://github.com/run-llama/llama_index/pull/21219))
- chore(deps): 在 21 個目錄中更新 uv group，共 2 項更新 ([#21221](https://github.com/run-llama/llama_index/pull/21221))
- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-callbacks-wandb \[0.5.0]

- chore(deps): 在 58 個目錄中更新 uv group，共 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 24 個目錄中更新 uv group，共 1 項更新 ([#21219](https://github.com/run-llama/llama_index/pull/21219))
- chore(deps): 在 21 個目錄中更新 uv group，共 2 項更新 ([#21221](https://github.com/run-llama/llama_index/pull/21221))
- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-core \[0.14.20]

- chore(deps): 在 46 個目錄中更新 uv group，共 2 項更新 ([#21153](https://github.com/run-llama/llama_index/pull/21153))
- fix(core): 在 `QueryFusionRetriever._aretrieve` 中使用 async query generation ([#21160](https://github.com/run-llama/llama_index/pull/21160))
- chore(deps): 在 50 個目錄中更新 uv group，共 2 項更新 ([#21164](https://github.com/run-llama/llama_index/pull/21164))
- docs: 修復錯字、文法及格式不一致的問題 ([#21218](https://github.com/run-llama/llama_index/pull/21218))
- fix: 修復 data\_sources 中的多餘括號以及 data\_sinks 中的錯字 ([#21251](https://github.com/run-llama/llama_index/pull/21251))
- chore(deps): 在 47 個目錄中更新 uv group，共 1 項更新 ([#21254](https://github.com/run-llama/llama_index/pull/21254))
- chore(deps): 在 53 個目錄中更新 uv group，共 1 項更新 ([#21255](https://github.com/run-llama/llama_index/pull/21255))
- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))
- 將 llama-index-workflows 依賴版本更新至 >=2.14.0 ([#21277](https://github.com/run-llama/llama_index/pull/21277))
- 刪除舊資料夾 ([#21286](https://github.com/run-llama/llama_index/pull/21286))

### llama-index-embeddings-adapter \[0.5.0]

- chore(deps): 在 58 個目錄中更新 uv group，共 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 24 個目錄中更新 uv group，共 1 項更新 ([#21219](https://github.com/run-llama/llama_index/pull/21219))
- chore(deps): 在 21 個目錄中更新 uv group，共 2 項更新 ([#21221](https://github.com/run-llama/llama_index/pull/21221))
- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-alephalpha \[0.5.0]

- chore(deps): 在 58 個目錄中更新 uv group，共 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 24 個目錄中更新 uv group，共 1 項更新 ([#21219](https://github.com/run-llama/llama_index/pull/21219))
- chore(deps): 在 21 個目錄中更新 uv group，共 2 項更新 ([#21221](https://github.com/run-llama/llama_index/pull/21221))- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-alibabacloud-aisearch \[0.4.0]

- chore(deps): 在 58 個目錄中更新 uv group，共 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 24 個目錄中更新 uv group，共 1 項更新 ([#21219](https://github.com/run-llama/llama_index/pull/21219))
- chore(deps): 在 21 個目錄中更新 uv group，共 2 項更新 ([#21221](https://github.com/run-llama/llama_index/pull/21221))
- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-anyscale \[0.5.1]

- chore(deps): 在 58 個目錄中更新 uv group，共 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 24 個目錄中更新 uv group，共 1 項更新 ([#21219](https://github.com/run-llama/llama_index/pull/21219))
- chore(deps): 在 21 個目錄中更新 uv group，共 2 項更新 ([#21221](https://github.com/run-llama/llama_index/pull/21221))
- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-autoembeddings \[0.3.0]

- chore(deps): 在 58 個目錄中更新 uv group，共 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 24 個目錄中更新 uv group，共 1 項更新 ([#21219](https://github.com/run-llama/llama_index/pull/21219))
- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-azure-inference \[0.5.0]

- chore(deps): 在 58 個目錄中更新 uv group，共 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 24 個目錄中更新 uv group，共 1 項更新 ([#21219](https://github.com/run-llama/llama_index/pull/21219))
- chore(deps): 在 21 個目錄中更新 uv group，共 2 項更新 ([#21221](https://github.com/run-llama/llama_index/pull/21221))
- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-azure-openai \[0.5.2]

- chore(deps): 在 58 個目錄中更新 uv group，共 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- azure vbump ([#21168](https://github.com/run-llama/llama_index/pull/21168))
- fix: Azure OpenAI embeddings 的相依性 ([#21170](https://github.com/run-llama/llama_index/pull/21170))
- chore(deps): 在 24 個目錄中更新 uv group，共 1 項更新 ([#21219](https://github.com/run-llama/llama_index/pull/21219))
- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-baseten \[0.2.1]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-bedrock \[0.8.0]

- chore(deps): 在 58 個目錄中更新 uv group，共 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 67 個目錄中更新 uv group，共 1 項更新 ([#21205](https://github.com/run-llama/llama_index/pull/21205))
- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-clarifai \[0.5.0]

- chore(deps): 在 58 個目錄中更新 uv group，共 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 24 個目錄中更新 uv group，共 1 項更新 ([#21219](https://github.com/run-llama/llama_index/pull/21219))
- chore(deps): 在 21 個目錄中更新 uv group，共 2 項更新 ([#21221](https://github.com/run-llama/llama_index/pull/21221))
- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-clip \[0.6.0]

- chore(deps): 在 58 個目錄中更新 uv group，共 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-cloudflare-workersai \[0.5.0]

- chore(deps): 在 58 個目錄中更新 uv group，共 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 24 個目錄中更新 uv group，共 1 項更新 ([#21219](https://github.com/run-llama/llama_index/pull/21219))
- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-cohere \[0.8.0]

- chore(deps): 在 58 個目錄中更新 uv group，共 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 67 個目錄中更新 uv group，共 1 項更新 ([#21205](https://github.com/run-llama/llama_index/pull/21205))
- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-dashscope \[0.5.0]

- chore(deps): 在 58 個目錄中更新 uv group，共 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-databricks \[0.5.1]

- chore(deps): 在 58 個目錄中更新 uv group，共 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-deepinfra \[0.5.0]

- chore(deps): 更新 58 個目錄中的 uv group，包含 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- 修正 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-elasticsearch \[0.5.0]

- chore(deps): 更新 58 個目錄中的 uv group，包含 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- 修正 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-fastembed \[0.6.0]

- 修正 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-fireworks \[0.5.2]

- chore(deps): 更新 58 個目錄中的 uv group，包含 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- 修正 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-gaudi \[0.4.0]

- chore(deps): 更新 58 個目錄中的 uv group，包含 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- 修正 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-gigachat \[0.5.0]

- chore(deps): 更新 58 個目錄中的 uv group，包含 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- 修正 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-google-genai \[0.5.0]

- chore(deps): 更新 58 個目錄中的 uv group，包含 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- 修正 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-heroku \[0.2.0]

- 修正 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-huggingface \[0.7.0]

- chore(deps): 更新 58 個目錄中的 uv group，包含 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- 修正 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-huggingface-api \[0.5.0]

- chore(deps): 更新 58 個目錄中的 uv group，包含 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- 修正 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-huggingface-openvino \[0.7.0]

- chore(deps): 更新 2 個目錄中的 uv group，包含 1 項更新 ([#21240](https://github.com/run-llama/llama_index/pull/21240))
- 修正 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-huggingface-optimum \[0.4.1]

- 修正 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-huggingface-optimum-intel \[0.5.0]

- chore(deps): 更新 58 個目錄中的 uv group，包含 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 更新 2 個目錄中的 uv group，包含 1 項更新 ([#21240](https://github.com/run-llama/llama_index/pull/21240))
- 修正 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-ibm \[0.6.0.post1]

- chore(deps): 更新 50 個目錄中的 uv group，包含 2 項更新 ([#21164](https://github.com/run-llama/llama_index/pull/21164))
- chore(deps): 更新 58 個目錄中的 uv group，包含 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 更新 67 個目錄中的 uv group，包含 1 項更新 ([#21205](https://github.com/run-llama/llama_index/pull/21205))
- 修正 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-instructor \[0.5.0]

- chore(deps): 更新 58 個目錄中的 uv group，包含 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- 修正 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-isaacus \[0.2.0]

- 修正 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-jinaai \[0.6.0]

- 修正 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-langchain \[0.5.0]

- chore(deps): 更新 58 個目錄中的 uv group，包含 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- 修正 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-litellm \[0.5.0]

- 修正 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-llamafile \[0.5.0]

- 修正 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-llm-rails \[0.5.0]

- 修正 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-mistralai \[0.5.0]

- 修正 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-mixedbreadai \[0.6.0]

- 修正 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-modelscope \[0.6.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-nebius \[0.5.1]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-netmind \[0.3.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-nomic \[0.8.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-nvidia \[0.5.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-oci-data-science \[0.3.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-oci-genai \[0.5.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-ollama \[0.9.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-opea \[0.3.1]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-openai \[0.6.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-openai-like \[0.3.1]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-openvino-genai \[0.7.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-oracleai \[0.4.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-premai \[0.5.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-sagemaker-endpoint \[0.5.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-siliconflow \[0.4.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-text-embeddings-inference \[0.5.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-textembed \[0.4.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-together \[0.5.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-upstage \[0.6.1]

- chore(deps): bump the uv group across 50 directories with 2 updates ([#21164](https://github.com/run-llama/llama_index/pull/21164))
- chore(deps): bump the uv group across 58 directories with 1 update ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): bump the uv group across 24 directories with 1 update ([#21219](https://github.com/run-llama/llama_index/pull/21219))
- chore(deps): bump the uv group across 21 directories with 2 updates ([#21221](https://github.com/run-llama/llama_index/pull/21221))
- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-vertex \[0.5.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-vertex-endpoint \[0.4.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-vllm \[0.1.1]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-voyageai \[0.6.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-xinference \[0.4.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-yandexgpt \[0.5.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-embeddings-zhipuai \[0.4.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-evaluation-tonic-validate \[0.6.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-extractors-entity \[0.5.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-extractors-marvin \[0.5.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-extractors-relik \[0.4.1]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-graph-rag-cognee \[0.3.1]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-graph-stores-ApertureDB \[0.3.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-graph-stores-falkordb \[0.5.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-graph-stores-memgraph \[0.5.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-graph-stores-nebula \[0.6.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-graph-stores-neo4j \[0.7.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-graph-stores-neptune \[0.5.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-graph-stores-tidb \[0.5.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-indices-managed-bge-m3 \[0.7.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-indices-managed-colbert \[0.6.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-indices-managed-dashscope \[0.5.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-instrumentation \[0.5.0]

- 修復 nltk 的安全性漏洞 ([#21275](https://github.com/run-llama/llama_index/pull/21275))

### llama-index-llms-anthropic \[0.11.2]

- feat(llms/anthropic): 將 claude-sonnet-4-6 與 claude-opus-4-6 新增至 structured output 列表 ([#21113](https://github.com/run-llama/llama_index/pull/21113))

### llama-index-llms-bedrock-converse \[0.14.5]

- feat: 在 bedrock converse 中新增對 deepseek v3 模型的支援 ([#21212](https://github.com/run-llama/llama_index/pull/21212))
- feat (llama-index-llms-bedrock-converse): 在 Bedrock Converse 的 LLM 模型名稱擷取中新增區域前綴 ([#21227](https://github.com/run-llama/llama_index/pull/21227))

### llama-index-llms-cohere \[0.8.0]

- chore(deps): 更新 58 個目錄中的 uv group (1 個更新) ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 更新 67 個目錄中的 uv group (1 個更新) ([#21205](https://github.com/run-llama/llama_index/pull/21205))
- chore(deps): 更新 53 個目錄中的 uv group (1 個更新) ([#21255](https://github.com/run-llama/llama_index/pull/21255))

### llama-index-llms-dashscope \[0.6.0]

- chore(deps): 更新 58 個目錄中的 uv group (1 個更新) ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 更新 67 個目錄中的 uv group (1 個更新) ([#21205](https://github.com/run-llama/llama_index/pull/21205))
- chore(deps): 更新 53 個目錄中的 uv group (1 個更新) ([#21255](https://github.com/run-llama/llama_index/pull/21255))

### llama-index-llms-google-genai \[0.9.1]

- chore(deps): 更新 58 個目錄中的 uv group (1 個更新) ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 更新 24 個目錄中的 uv group (1 個更新) ([#21219](https://github.com/run-llama/llama_index/pull/21219))
- chore(deps): 更新 21 個目錄中的 uv group (2 個更新) ([#21221](https://github.com/run-llama/llama_index/pull/21221))

### llama-index-llms-ibm \[0.7.0.post1]

- chore(deps): 更新 50 個目錄中的 uv group (2 個更新) ([#21164](https://github.com/run-llama/llama_index/pull/21164))
- chore(deps): 更新 58 個目錄中的 uv group (1 個更新) ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 更新 67 個目錄中的 uv group (1 個更新) ([#21205](https://github.com/run-llama/llama_index/pull/21205))

### llama-index-llms-oci-data-science \[1.1.0]

- chore(deps): 更新 58 個目錄中的 uv group (1 個更新) ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 更新 67 個目錄中的 uv group (1 個更新) ([#21205](https://github.com/run-llama/llama_index/pull/21205))

### llama-index-llms-openai \[0.7.5]

- chore(deps): 更新 58 個目錄中的 uv group (1 個更新) ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- 修復 Responses API 訊息字典中的 input\_file 序列化問題 ([#21172](https://github.com/run-llama/llama_index/pull/21172))
- vbump openai ([#21176](https://github.com/run-llama/llama_index/pull/21176))
- fix(openai): 在 tool calls 旁保留 assistant 文本，並將 tool kwargs 序列化為 JSON ([#21180](https://github.com/run-llama/llama_index/pull/21180))
- feat(llama-index-integrations): 在 openai 模型對照表中新增對 gpt-5.3 模型系列的支援 ([#21190](https://github.com/run-llama/llama_index/pull/21190))
- feat(llama-index-integrations): 在 openai 模型註冊表中新增 gpt-5.4-2026-03-05 快照模型 ([#21191](https://github.com/run-llama/llama_index/pull/21191))
- chore(deps): 更新 24 個目錄中的 uv group (1 個更新) ([#21219](https://github.com/run-llama/llama_index/pull/21219))
- chore(deps): 更新 21 個目錄中的 uv group (2 個更新) ([#21221](https://github.com/run-llama/llama_index/pull/21221))

### llama-index-llms-openai-like \[0.7.1]

- chore(deps): 在 58 個目錄中更新 uv group，包含 1 個更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 67 個目錄中更新 uv group，包含 1 個更新 ([#21205](https://github.com/run-llama/llama_index/pull/21205))

### llama-index-llms-openvino-genai \[0.3.1]

- fix: 修復使用 ov genai 執行 stream llm 請求時會回報 std::runtime\_error 的問題 (ISSUE 20802) ([#20803](https://github.com/run-llama/llama_index/pull/20803))

### llama-index-memory-mem0 \[1.0.0]

- chore(deps): 在 67 個目錄中更新 uv group，包含 1 個更新 ([#21205](https://github.com/run-llama/llama_index/pull/21205))
- chore(deps): 在 53 個目錄中更新 uv group，包含 1 個更新 ([#21255](https://github.com/run-llama/llama_index/pull/21255))

### llama-index-observability-otel \[0.6.0]

- chore(deps): 在 58 個目錄中更新 uv group，包含 1 個更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 24 個目錄中更新 uv group，包含 1 個更新 ([#21219](https://github.com/run-llama/llama_index/pull/21219))
- chore(deps): 在 21 個目錄中更新 uv group，包含 2 個更新 ([#21221](https://github.com/run-llama/llama_index/pull/21221))

### llama-index-postprocessor-cohere-rerank \[0.8.0]

- chore(deps): 在 58 個目錄中更新 uv group，包含 1 個更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 67 個目錄中更新 uv group，包含 1 個更新 ([#21205](https://github.com/run-llama/llama_index/pull/21205))

### llama-index-postprocessor-nvidia-rerank \[0.6.0]

- chore(deps): 在 58 個目錄中更新 uv group，包含 1 個更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 67 個目錄中更新 uv group，包含 1 個更新 ([#21205](https://github.com/run-llama/llama_index/pull/21205))

### llama-index-protocols-ag-ui \[0.3.1]

- feat: 新增從外部導入動態 tools 的功能 (ag-ui) ([#21149](https://github.com/run-llama/llama_index/pull/21149))

### llama-index-readers-datasets \[0.2.0]

- chore(deps): 在 58 個目錄中更新 uv group，包含 1 個更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 67 個目錄中更新 uv group，包含 1 個更新 ([#21205](https://github.com/run-llama/llama_index/pull/21205))

### llama-index-readers-github \[0.11.2]

- chore(deps): 在 58 個目錄中更新 uv group，包含 1 個更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 67 個目錄中更新 uv group，包含 1 個更新 ([#21205](https://github.com/run-llama/llama_index/pull/21205))

### llama-index-readers-microsoft-sharepoint \[0.9.1]

- chore(deps): 在 58 個目錄中更新 uv group，包含 1 個更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 67 個目錄中更新 uv group，包含 1 個更新 ([#21205](https://github.com/run-llama/llama_index/pull/21205))

### llama-index-readers-patentsview \[1.1.0]

- chore(deps): 在 58 個目錄中更新 uv group，包含 1 個更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 67 個目錄中更新 uv group，包含 1 個更新 ([#21205](https://github.com/run-llama/llama_index/pull/21205))
- chore(deps): 在 53 個目錄中更新 uv group，包含 1 個更新 ([#21255](https://github.com/run-llama/llama_index/pull/21255))

### llama-index-readers-service-now \[0.3.0]

- chore(deps): 在 /llama-index-integrations/readers/llama-index-readers-service-now 的 pip group 中，將 aiohttp 從 3.13.3 更新至 3.13.4，影響 1 個目錄 ([#21253](https://github.com/run-llama/llama_index/pull/21253))

### llama-index-readers-whatsapp \[0.5.0]

- chore(deps): 在 58 個目錄中更新 uv group，包含 1 個更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 67 個目錄中更新 uv group，包含 1 個更新 ([#21205](https://github.com/run-llama/llama_index/pull/21205))

### llama-index-retrievers-you \[1.1.0]

- chore(deps): 在 58 個目錄中更新 uv group，包含 1 個更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 67 個目錄中更新 uv group，包含 1 個更新 ([#21205](https://github.com/run-llama/llama_index/pull/21205))
- chore(deps): 在 53 個目錄中更新 uv group，包含 1 個更新 ([#21255](https://github.com/run-llama/llama_index/pull/21255))

### llama-index-storage-chat-store-redis \[0.7.0]

- chore(deps): 在 58 個目錄中更新 uv group，包含 1 個更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 67 個目錄中更新 uv group，包含 1 個更新 ([#21205](https://github.com/run-llama/llama_index/pull/21205))

### llama-index-vector-stores-milvus \[1.1.0]

- chore(deps): 在 58 個目錄中更新 uv group，包含 1 個更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 67 個目錄中更新 uv group，包含 1 個更新 ([#21205](https://github.com/run-llama/llama_index/pull/21205))

### llama-index-vector-stores-oceanbase \[0.4.0]

- chore(deps): 在 58 個目錄中更新 uv group，包含 1 個更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))- chore(deps): 在 67 個目錄中更新 uv group，共 1 項更新 ([#21205](https://github.com/run-llama/llama_index/pull/21205))
- chore(deps): 在 53 個目錄中更新 uv group，共 1 項更新 ([#21255](https://github.com/run-llama/llama_index/pull/21255))

### llama-index-vector-stores-opensearch \[1.2.0]

- chore(deps): 在 58 個目錄中更新 uv group，共 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 67 個目錄中更新 uv group，共 1 項更新 ([#21205](https://github.com/run-llama/llama_index/pull/21205))

### llama-index-vector-stores-yugabytedb \[0.6.0]

- chore(deps): 在 58 個目錄中更新 uv group，共 1 項更新 ([#21166](https://github.com/run-llama/llama_index/pull/21166))
- chore(deps): 在 67 個目錄中更新 uv group，共 1 項更新 ([#21205](https://github.com/run-llama/llama_index/pull/21205))

## \[2026-03-25]

### llama-index-agent-agentmesh \[0.2.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))

### llama-index-callbacks-argilla \[0.5.0]

- chore(deps): 在 3 個目錄中更新 uv group，共 1 項更新 ([#21069](https://github.com/run-llama/llama_index/pull/21069))

### llama-index-core \[0.14.19]

- fix: 在 `BaseIndex.delete_ref_doc` 中傳遞 `delete_from_docstore` 參數 ([#20990](https://github.com/run-llama/llama_index/pull/20990))
- fix(core): 在 SQLDatabase.run\_sql 的 schema prefixing 過程中保留 CTE 名稱 ([#21028](https://github.com/run-llama/llama_index/pull/21028))
- fix(core): 將同步檢索的 dedup key 與非同步對齊 (hash + ref\_doc\_id) ([#21034](https://github.com/run-llama/llama_index/pull/21034))
- fix(core): structured\_predict 改為拋出 ValueError 而非回傳字串 ([#21036](https://github.com/run-llama/llama_index/pull/21036))
- fix(core): 移除 index helpers 中錯誤的 per-node 刪除呼叫 ([#21050](https://github.com/run-llama/llama_index/pull/21050))
- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))
- 啟用 llama-cloud>1.0 安裝 ([#21140](https://github.com/run-llama/llama_index/pull/21140))

### llama-index-embeddings-fireworks \[0.5.2]

- test(embeddings-fireworks): 新增測試套件並修正文件 ([#20977](https://github.com/run-llama/llama_index/pull/20977))

### llama-index-embeddings-upstage \[0.6.1]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))

### llama-index-indices-managed-llama-cloud \[0.11.1]

- fix: llama-cloud managed index 並移除 llamaparse reader ([#21043](https://github.com/run-llama/llama_index/pull/21043))
- 啟用 llama-cloud>1.0 安裝 ([#21140](https://github.com/run-llama/llama_index/pull/21140))

### llama-index-llms-azure-openai \[0.5.3]

- 支援 azure openai 回應 ([#21088](https://github.com/run-llama/llama_index/pull/21088))
- 修正 azure openai 回應 ([#21099](https://github.com/run-llama/llama_index/pull/21099))

### llama-index-llms-bedrock-converse \[0.14.3]

- 在 bedrock converse 中使用正確的 tool choice 格式 ([#21098](https://github.com/run-llama/llama_index/pull/21098))

### llama-index-llms-cohere \[0.8.0]

- docs(cohere): 將第一個基礎用法範例更新為 chat API ([#21108](https://github.com/run-llama/llama_index/pull/21108))

### llama-index-llms-google-genai \[0.9.1]

- feat: gemini 3 預設值與 temperature ([#21060](https://github.com/run-llama/llama_index/pull/21060))
- fix(google-genai): 避免在 prepare\_chat\_params 中修改 messages 列表 ([#21141](https://github.com/run-llama/llama_index/pull/21141))

### llama-index-llms-litellm \[0.7.1]

- 在 model kwargs 中新增對自定義 LLM provider 的支援 ([#21095](https://github.com/run-llama/llama_index/pull/21095))

### llama-index-llms-minimax \[0.1.0]

- feat: 新增 MiniMax LLM provider 整合，預設為 M2.7 ([#20955](https://github.com/run-llama/llama_index/pull/20955))

### llama-index-llms-ollama \[0.10.1]

- fix(ollama): 將自定義 header 傳遞至自動建立的 client ([#21091](https://github.com/run-llama/llama_index/pull/21091))

### llama-index-llms-openai \[0.7.3]

- feat(llms/openai): 新增對 GPT 5.4 Mini 與 Nano 版本的支援 ([#21065](https://github.com/run-llama/llama_index/pull/21065))

### llama-index-llms-ovhcloud \[0.2.1]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))

### llama-index-packs-agent-search-retriever \[0.5.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-amazon-product-extraction \[0.5.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-arize-phoenix-query-engine \[0.5.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-auto-merging-retriever \[0.6.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-code-hierarchy \[0.7.1]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-cohere-citation-chat \[0.6.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-deeplake-deepmemory-retriever \[0.5.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-deeplake-multimodal-retrieval \[0.4.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-dense-x-retrieval \[0.6.1]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-diff-private-simple-dataset \[0.5.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-evaluator-benchmarker \[0.5.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-fusion-retriever \[0.6.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-fuzzy-citation \[0.5.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-gmail-openai-agent \[0.5.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-koda-retriever \[0.5.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-llama-dataset-metadata \[0.5.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-llama-guard-moderator \[0.5.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-llava-completion \[0.5.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-longrag \[0.6.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-mixture-of-agents \[0.5.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-multi-tenancy-rag \[0.6.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-multidoc-autoretrieval \[0.5.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-nebulagraph-query-engine \[0.6.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-neo4j-query-engine \[0.5.1]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-node-parser-semantic-chunking \[0.5.1]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-ollama-query-engine \[0.6.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-panel-chatbot \[0.5.0]

- chore(deps): 在 3 個目錄中更新 uv group，共 1 項更新 ([#21069](https://github.com/run-llama/llama_index/pull/21069))
- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-raft-dataset \[0.5.1]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-ragatouille-retriever \[0.6.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-raptor \[0.4.1]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-recursive-retriever \[0.8.1]

- chore(deps): 在 3 個目錄中更新 uv group，共 1 項更新 ([#21069](https://github.com/run-llama/llama_index/pull/21069))
- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-searchain \[0.3.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-self-discover \[0.5.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-self-rag \[0.5.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-sentence-window-retriever \[0.6.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-snowflake-query-engine \[0.6.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-stock-market-data-query-engine \[0.6.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-streamlit-chatbot \[0.5.2]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-sub-question-weaviate \[0.5.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-packs-timescale-vector-autoretrieval \[0.5.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))
- chore(deps): 在 44 個目錄中更新 uv group，共 1 項更新 ([#21097](https://github.com/run-llama/llama_index/pull/21097))

### llama-index-postprocessor-google-rerank \[0.1.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))

### llama-index-readers-llama-parse \[0.6.1]

- 啟用 llama-cloud>1.0 安裝 ([#21140](https://github.com/run-llama/llama_index/pull/21140))

### llama-index-readers-service-now \[0.3.0]

- chore(deps): 在 /llama-index-integrations/readers/llama-index-readers-service-now 的 uv group 中，將 nltk 從 3.9.1 更新至 3.9.3，涉及 1 個目錄 ([#21080](https://github.com/run-llama/llama_index/pull/21080))

### llama-index-storage-chat-store-opensearch \[0.2.0]

- chore(deps): 在 49 個目錄中更新 uv group，共 1 項更新 ([#21083](https://github.com/run-llama/llama_index/pull/21083))

### llama-index-tools-aws-bedrock-agentcore \[0.3.1]

- feat(tools/agentcore): 新增 AgentCoreRuntime adapter ([#21008](https://github.com/run-llama/llama_index/pull/21008))
- 修正 bedrock 測試 ([#21129](https://github.com/run-llama/llama_index/pull/21129))

### llama-index-tools-exa \[0.5.1]

- 更新 exa tool 描述與預設 search type ([#21096](https://github.com/run-llama/llama_index/pull/21096))

### llama-index-vector-stores-redis \[0.8.0]

- feat(redis): 實作 safe get\_nodes 與 delete\_nodes 支援 ([#20972](https://github.com/run-llama/llama_index/pull/20972))

### llama-index-voice-agents-gemini-live \[0.4.0]

- feat: 預設使用最新 gemini 模型 ([#21061](https://github.com/run-llama/llama_index/pull/21061))

## \[2026-03-16]

### llama-index-agent-agentmesh \[0.2.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-agent-azure \[0.3.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-callbacks-agentops \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-callbacks-argilla \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-callbacks-arize-phoenix \[0.7.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-callbacks-honeyhive \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))

### llama-index-callbacks-langfuse \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-callbacks-literalai \[1.4.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-callbacks-openinference \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-callbacks-opik \[1.3.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-callbacks-promptlayer \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-callbacks-uptrain \[0.6.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-callbacks-wandb \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-core \[0.14.18]

- feat: 統一 core 與 vector backends 的 text match filters ([#20883](https://github.com/run-llama/llama_index/pull/20883))
- fix(chat\_engine): 修正 stream 消耗不完全時仍能保留 chat history ([#20897](https://github.com/run-llama/llama_index/pull/20897))
- fix: 防止 LlamaDebugHandler.\_get\_time\_stats\_from\_event\_pairs 出現 ZeroDivisionError ([#20937](https://github.com/run-llama/llama_index/pull/20937))
- fix: 在 warnings.warn() 中加入 stacklevel=2 以準確回報呼叫者 ([#20939](https://github.com/run-llama/llama_index/pull/20939))
- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))
- Release 0.14.17 ([#20957](https://github.com/run-llama/llama_index/pull/20957))
- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- fix: 在 async retrieval paths 中使用 `apostprocess_nodes()` ([#20974](https://github.com/run-llama/llama_index/pull/20974))
- fix (test) : 使用 >= 1 以避免 `stream_chat` memory assertion 的 race condition ([#20980](https://github.com/run-llama/llama_index/pull/20980))
- fix(core): 在 `async _aretrieve_from_object` 中保留 response metadata ([#20995](https://github.com/run-llama/llama_index/pull/20995))
- fix: 在 `PydanticOutputParser` 中保留 non-ASCII schema descriptions ([#21016](https://github.com/run-llama/llama_index/pull/21016))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))
- fix(core): structured\_predict() 在單一欄位模型中回傳預設值 ([#21025](https://github.com/run-llama/llama_index/pull/21025))
- fix openai mimetype 判定 ([#21030](https://github.com/run-llama/llama_index/pull/21030))

### llama-index-embeddings-adapter \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-alephalpha \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-alibabacloud-aisearch \[0.4.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-anyscale \[0.5.1]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))
- vbump all the things ([#20978](https://github.com/run-llama/llama_index/pull/20978))

### llama-index-embeddings-autoembeddings \[0.3.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-azure-inference \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-azure-openai \[0.5.1]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))
- vbump all the things ([#20978](https://github.com/run-llama/llama_index/pull/20978))

### llama-index-embeddings-baseten \[0.2.1]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))
- vbump all the things ([#20978](https://github.com/run-llama/llama_index/pull/20978))

### llama-index-embeddings-bedrock \[0.8.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-clarifai \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-clip \[0.6.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-cloudflare-workersai \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-cohere \[0.8.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-dashscope \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-databricks \[0.5.1]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))
- vbump all the things ([#20978](https://github.com/run-llama/llama_index/pull/20978))

### llama-index-embeddings-deepinfra \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-elasticsearch \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-fastembed \[0.6.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-fireworks \[0.5.1]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))
- vbump all the things ([#20978](https://github.com/run-llama/llama_index/pull/20978))

### llama-index-embeddings-gaudi \[0.4.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-gigachat \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-google-genai \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-heroku \[0.2.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-huggingface \[0.7.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-huggingface-api \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-huggingface-openvino \[0.7.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-huggingface-optimum-intel \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-instructor \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-isaacus \[0.2.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-jinaai \[0.6.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-langchain \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-litellm \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-llamafile \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-llm-rails \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-mistralai \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-modelscope \[0.6.0]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))

### llama-index-embeddings-nebius \[0.5.1]

- 將所有 things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
版本更新
### llama-index-embeddings-opea \[0.3.1]

- 將所有 things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
版本更新
### llama-index-embeddings-openai-like \[0.3.1]

- 將所有 things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
版本更新
### llama-index-embeddings-upstage \[0.6.1]

- 將所有 things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
版本更新
### llama-index-indices-managed-lancedb \[0.3.1]

- 移除 **init** 中的 mutable default ([#20998](https://github.com/run-llama/llama_index/pull/20998))

### llama-index-instrumentation \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-llms-anthropic \[0.11.1]

- Bugfix: 修正 AnthropicCompletionResponse 中的 Pydantic 驗證錯誤 ([#21027](https://github.com/run-llama/llama_index/pull/21027))

### llama-index-llms-anyscale \[0.5.1]

- 將所有 things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
版本更新
### llama-index-llms-azure-openai \[0.5.1]

- 將所有 things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
版本更新
### llama-index-llms-baseten \[0.2.1]

- 將所有 things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
版本更新
### llama-index-llms-bedrock-converse \[0.14.2]

- vbump all the things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
- feat(bedrock-converse): 將 Opus 4.6 與 Sonnet 4.6 的 context window 大小設定為 1M ([#20982](https://github.com/run-llama/llama_index/pull/20982))

### llama-index-llms-deepinfra \[0.6.1]

- 將所有 things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
版本更新
### llama-index-llms-everlyai \[0.5.1]

- 將所有 things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
版本更新
### llama-index-llms-fireworks \[0.5.1]

- 將所有 things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
版本更新
### llama-index-llms-keywordsai \[1.2.1]

- 將所有 things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
版本更新
### llama-index-llms-monsterapi \[0.5.1]

- 將所有 things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
版本更新
### llama-index-llms-openai \[0.7.2]

- fix openai document 區塊格式 ([#20975](https://github.com/run-llama/llama_index/pull/20975))
- feat(openai): 新增對 GPT-5.4 與 GPT-5.4-pro 模型的支援 ([#20976](https://github.com/run-llama/llama_index/pull/20976))

### llama-index-llms-openai-like \[0.7.1]

- 將所有 things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
版本更新
### llama-index-llms-ovhcloud \[0.2.1]

- 將所有 things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
版本更新
### llama-index-llms-perplexity \[0.5.1]

- 將所有 things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
版本更新
### llama-index-llms-portkey \[0.5.1]

- 將所有 things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
版本更新
### llama-index-llms-upstage \[0.8.1]

- 將所有 things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
版本更新
### llama-index-llms-yi \[0.5.1]

- 將所有 things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
版本更新
### llama-index-packs-agent-search-retriever \[0.5.0]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-amazon-product-extraction \[0.5.0]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-arize-phoenix-query-engine \[0.5.0]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-auto-merging-retriever \[0.6.0]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-code-hierarchy \[0.7.1]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- vbump all the things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-cohere-citation-chat \[0.6.0]

- chore(deps): 更新 51 個目錄中的 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 更新 43 個目錄中的 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 更新 42 個目錄中的 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-deeplake-deepmemory-retriever \[0.5.0]

- chore(deps): 更新 51 個目錄中的 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 更新 43 個目錄中的 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 更新 42 個目錄中的 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-deeplake-multimodal-retrieval \[0.4.0]

- chore(deps): 更新 51 個目錄中的 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 更新 43 個目錄中的 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))

### llama-index-packs-dense-x-retrieval \[0.6.1]

- chore(deps): 更新 51 個目錄中的 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- vbump all the things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
- chore(deps): 更新 43 個目錄中的 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 更新 42 個目錄中的 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-diff-private-simple-dataset \[0.5.0]

- chore(deps): 更新 51 個目錄中的 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 更新 43 個目錄中的 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 更新 42 個目錄中的 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-evaluator-benchmarker \[0.5.0]

- chore(deps): 更新 51 個目錄中的 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 更新 43 個目錄中的 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 更新 42 個目錄中的 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-fusion-retriever \[0.6.0]

- chore(deps): 更新 51 個目錄中的 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 更新 43 個目錄中的 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 更新 42 個目錄中的 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-fuzzy-citation \[0.5.0]

- chore(deps): 更新 51 個目錄中的 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 更新 43 個目錄中的 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 更新 42 個目錄中的 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-gmail-openai-agent \[0.5.0]

- chore(deps): 更新 51 個目錄中的 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 更新 43 個目錄中的 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 更新 42 個目錄中的 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-koda-retriever \[0.5.0]

- chore(deps): 更新 51 個目錄中的 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 更新 43 個目錄中的 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 更新 42 個目錄中的 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-llama-dataset-metadata \[0.5.0]

- chore(deps): 更新 51 個目錄中的 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 更新 43 個目錄中的 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 更新 42 個目錄中的 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-llama-guard-moderator \[0.5.0]

- chore(deps): 更新 51 個目錄中的 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 更新 43 個目錄中的 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-llava-completion \[0.5.0]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-longrag \[0.6.0]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-mixture-of-agents \[0.5.0]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-multi-tenancy-rag \[0.6.0]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-multidoc-autoretrieval \[0.5.0]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-nebulagraph-query-engine \[0.6.0]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-neo4j-query-engine \[0.5.1]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-node-parser-semantic-chunking \[0.5.1]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- vbump all the things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-ollama-query-engine \[0.6.0]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-panel-chatbot \[0.5.0]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-raft-dataset \[0.5.1]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- vbump all the things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-rag-evaluator \[0.5.1]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- vbump all the things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-ragatouille-retriever \[0.6.0]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-raptor \[0.4.1]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))

### llama-index-packs-recursive-retriever \[0.8.1]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- vbump all the things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-resume-screener \[0.10.1]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- vbump all the things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-retry-engine-weaviate \[0.6.0]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-searchain \[0.3.0]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-self-discover \[0.5.0]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-self-rag \[0.5.0]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-sentence-window-retriever \[0.6.0]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-snowflake-query-engine \[0.6.0]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-stock-market-data-query-engine \[0.6.0]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-streamlit-chatbot \[0.5.2]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))

### llama-index-packs-sub-question-weaviate \[0.5.0]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-timescale-vector-autoretrieval \[0.5.0]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))
- chore(deps): 在 42 個目錄中更新 uv group，共 2 項更新 ([#21020](https://github.com/run-llama/llama_index/pull/21020))

### llama-index-packs-trulens-eval-packs \[0.4.1]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))
- chore(deps): 在 /llama-index-packs/llama-index-packs-trulens-eval-packs 中將 langchain-community 從 0.0.38 更新至 0.3.27 ([#20983](https://github.com/run-llama/llama_index/pull/20983))
- chore(deps): 在 43 個目錄中更新 uv group，共 5 項更新 ([#20988](https://github.com/run-llama/llama_index/pull/20988))

### llama-index-postprocessor-google-rerank \[0.1.0]

- feat(postprocessor): 新增 Google Discovery Engine rerank 整合 ([#20893](https://github.com/run-llama/llama_index/pull/20893))

### llama-index-readers-gcs \[0.6.1]

- vbump all the things ([#20978](https://github.com/run-llama/llama_index/pull/20978))

### llama-index-readers-github \[0.11.2]

- fix(github-reader): 將 run\_until\_complete 替換為 asyncio\_run 以提升 async 相容性 ([#20963](https://github.com/run-llama/llama_index/pull/20963))
- vbump all the things ([#20978](https://github.com/run-llama/llama_index/pull/20978))

### llama-index-readers-joplin \[0.6.1]

- vbump all the things ([#20978](https://github.com/run-llama/llama_index/pull/20978))

### llama-index-readers-mbox \[0.6.1]

- vbump all the things ([#20978](https://github.com/run-llama/llama_index/pull/20978))

### llama-index-readers-microsoft-sharepoint \[0.9.1]

- 將所有 things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
版本更新
### llama-index-readers-obsidian \[0.7.1]

- vbump all the things ([#20978](https://github.com/run-llama/llama_index/pull/20978))

### llama-index-readers-pandas-ai \[0.6.1]

- 將所有 things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
版本更新
### llama-index-readers-pebblo \[0.6.1]

- 將所有 things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
版本更新
### llama-index-readers-s3 \[0.6.1]

- 將所有 things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
版本更新
### llama-index-readers-service-now \[0.3.0]

- chore(deps): 在 51 個目錄中更新 uv group，共 3 項更新 ([#20962](https://github.com/run-llama/llama_index/pull/20962))

### llama-index-retrievers-bm25 \[0.7.1]

- fix: 處理 BM25Retriever 在 metadata 篩選後出現空 corpus 的情況 ([#20926](https://github.com/run-llama/llama_index/pull/20926))

### llama-index-storage-docstore-postgres \[0.5.0]

- 釋出 Postgres KVStore engine settings 以處理 timeout (修正 #15888) ([#20951](https://github.com/run-llama/llama_index/pull/20951))

### llama-index-storage-kvstore-postgres \[0.5.0]

- 釋出 Postgres KVStore engine settings 以處理 timeout (修正 #15888) ([#20951](https://github.com/run-llama/llama_index/pull/20951))

### llama-index-tools-google \[0.7.1]

- feat(google-tools): Calendar 與 Gmail 新增支援 service account 與 cloud auth ([#20879](https://github.com/run-llama/llama_index/pull/20879))

### llama-index-vector-stores-couchbase \[0.7.1]

- 將所有 things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
版本更新
### llama-index-vector-stores-mongodb \[0.10.1]

- 將所有 things ([#20978](https://github.com/run-llama/llama_index/pull/20978))
版本更新
### llama-index-vector-stores-opensearch \[1.2.0]

- feat: 統一 core 與 vector backend 的 text match 篩選機制 ([#20883](https://github.com/run-llama/llama_index/pull/20883))

### llama-index-vector-stores-postgres \[0.8.1]

- feat(postgres): 新增 MMR (Maximal Marginal Relevance) 查詢支援 ([#20860](https://github.com/run-llama/llama_index/pull/20860))

### llama-index-vector-stores-qdrant \[0.10.0]

- feat: 統一 core 與 vector backend 的 text match 篩選機制 ([#20883](https://github.com/run-llama/llama_index/pull/20883))

### llama-index-vector-stores-solr \[0.2.0]

- feat: 統一 core 與 vector backend 的 text match 篩選機制 ([#20883](https://github.com/run-llama/llama_index/pull/20883))
- fix: 修正 Solr client 中的拼字錯誤 ‘compatability’ 為 ‘compatibility’ ([#21029](https://github.com/run-llama/llama_index/pull/21029))

## \[2026-03-12]

### llama-index-agent-agentmesh \[0.2.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-agent-azure \[0.3.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-callbacks-agentops \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-callbacks-argilla \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-callbacks-arize-phoenix \[0.7.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-callbacks-honeyhive \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-callbacks-langfuse \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-callbacks-literalai \[1.4.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-callbacks-openinference \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-callbacks-opik \[1.3.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-callbacks-promptlayer \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-callbacks-uptrain \[0.6.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-callbacks-wandb \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-core \[0.14.17]

- feat: 統一 core 與 vector backends 的文字比對篩選器 ([#20883](https://github.com/run-llama/llama_index/pull/20883))
- fix(chat\_engine): 在 stream 消耗不完全時保留對話紀錄 ([#20897](https://github.com/run-llama/llama_index/pull/20897))
- fix: 防止 LlamaDebugHandler.\_get\_time\_stats\_from\_event\_pairs 出現 ZeroDivisionError ([#20937](https://github.com/run-llama/llama_index/pull/20937))
- fix: 為 warnings.warn() 新增 stacklevel=2 以準確回報呼叫者 ([#20939](https://github.com/run-llama/llama_index/pull/20939))
- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-adapter \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-alephalpha \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-alibabacloud-aisearch \[0.4.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-anyscale \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-autoembeddings \[0.3.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-azure-inference \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-azure-openai \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-baseten \[0.2.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-bedrock \[0.8.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-clarifai \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-clip \[0.6.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-cloudflare-workersai \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-cohere \[0.8.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-dashscope \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-databricks \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-deepinfra \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-elasticsearch \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-fastembed \[0.6.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-fireworks \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-gaudi \[0.4.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-gigachat \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-google-genai \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-heroku \[0.2.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-huggingface \[0.7.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-huggingface-api \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-huggingface-openvino \[0.7.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-huggingface-optimum-intel \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-instructor \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-isaacus \[0.2.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-jinaai \[0.6.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-langchain \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-litellm \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-llamafile \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-llm-rails \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-embeddings-mistralai \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-instrumentation \[0.5.0]

- chore: 正式棄用 python 3.9 ([#20956](https://github.com/run-llama/llama_index/pull/20956))

### llama-index-vector-stores-opensearch \[1.2.0]

- feat: 統一 core 與 vector backend 的 text match filters ([#20883](https://github.com/run-llama/llama_index/pull/20883))

### llama-index-vector-stores-qdrant \[0.10.0]

- feat: 統一 core 與 vector backend 的 text match filters ([#20883](https://github.com/run-llama/llama_index/pull/20883))

### llama-index-vector-stores-solr \[0.2.0]

- feat: 統一 core 與 vector backend 的 text match filters ([#20883](https://github.com/run-llama/llama_index/pull/20883))

## \[2026-03-10]

### llama-index-core \[0.14.16]

- 為 LLM 與 embedding API 呼叫新增 token-bucket rate limiter ([#20712](https://github.com/run-llama/llama_index/pull/20712))
- Fix/20706 chonkie init doc ([#20713](https://github.com/run-llama/llama_index/pull/20713))
- fix: 將 tool\_choice 傳遞至 FunctionCallingProgram ([#20740](https://github.com/run-llama/llama_index/pull/20740))
- feat: Multimodal LLMReranker ([#20743](https://github.com/run-llama/llama_index/pull/20743))
- feat: 為 SemanticDoubleMergingSplitterNodeParser 新增選用的 embed\_model ([#20748](https://github.com/run-llama/llama_index/pull/20748))
- fix(core): 在 legacy\_json\_to\_doc 中保留 doc\_id ([#20750](https://github.com/run-llama/llama_index/pull/20750))- fix: 修正 async retry backoff 以避免阻塞 event loop ([#20764](https://github.com/run-llama/llama_index/pull/20764))
- Fix 自動生成的 KG schema models 中的 additionalProperties ([#20768](https://github.com/run-llama/llama_index/pull/20768))
- fix: 當提供自定義 async\_engine 時，應遵循 db\_schema ([#20779](https://github.com/run-llama/llama_index/pull/20779))
- fix(core): 將阻塞的 `run_async_tasks` 替換為 `asyncio.gather` ([#20795](https://github.com/run-llama/llama_index/pull/20795))
- feat(rate\_limiter): 新增 SlidingWindowRateLimiter 以實現嚴格的每分鐘上限 ([#20799](https://github.com/run-llama/llama_index/pull/20799))
- fix(core): 在未連接 vector store 時，跨 pipeline run 保留 `docstore_strategy` ([#20824](https://github.com/run-llama/llama_index/pull/20824))
- Fix FunctionTool 未遵循 pydantic Field 預設值 ([#20839](https://github.com/run-llama/llama_index/pull/20839))
- Fix MarkdownElementNodeParser 以能提取 code blocks ([#20840](https://github.com/run-llama/llama_index/pull/20840))
- security: 為 SimpleObjectNodeMapping 新增 RestrictedUnpickler (CWE-502) ([#20857](https://github.com/run-llama/llama_index/pull/20857))
- feat: 擴展 vector store metadata filters ([#20861](https://github.com/run-llama/llama_index/pull/20861))
- fix(react): 將 system\_prompt 傳遞至 ReActChatFormatter 模板 ([#20873](https://github.com/run-llama/llama_index/pull/20873))
- refactor: 棄用 asyncio\_module，改用 get\_asyncio\_module ([#20902](https://github.com/run-llama/llama_index/pull/20902))
- fix(core): SubQuestionQueryEngine 的部分失敗處理 ([#20905](https://github.com/run-llama/llama_index/pull/20905))
- fix: 為 ChatMemoryBuffer.get() 新增邊界檢查以防止無限迴圈 ([#20914](https://github.com/run-llama/llama_index/pull/20914))
- fix: 確保 CondenseQuestionChatEngine 在發生 exception 時會重設 streaming flag ([#20915](https://github.com/run-llama/llama_index/pull/20915))
- fix: 正確傳遞 run id ([#20928](https://github.com/run-llama/llama_index/pull/20928))

### llama-index-embeddings-bedrock \[0.7.4]

- fix: 當 BedrockEmbedding 傳入 ‘model’ 而非 ‘model\_name’ 時，拋出 ValueError ([#20836](https://github.com/run-llama/llama_index/pull/20836))

### llama-index-embeddings-openai \[0.5.2]

- 在 OpenAI retry decorator 中遵循 Retry-After header ([#20813](https://github.com/run-llama/llama_index/pull/20813))

### llama-index-embeddings-upstage \[0.5.1]

- chore(deps): 在 47 個目錄中更新 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-graph-stores-neo4j \[0.6.0]

- 新增 Neo4j 使用者 agent ([#20827](https://github.com/run-llama/llama_index/pull/20827))
- feat(neo4j): 新增 apoc\_sample 參數用於大型資料庫 schema introspection ([#20859](https://github.com/run-llama/llama_index/pull/20859))

### llama-index-instrumentation \[0.4.3]

- otel instrumentation 增強 ([#20816](https://github.com/run-llama/llama_index/pull/20816))

### llama-index-llms-anthropic \[0.10.11]

- 為 Anthropic API 呼叫新增 User-Agent header ([#20771](https://github.com/run-llama/llama_index/pull/20771))
- fix: 僅對最後一個 block 應用 cache\_control 以遵循 Anthropic 的 4-block 限制 ([#20875](https://github.com/run-llama/llama_index/pull/20875))

### llama-index-llms-azure-inference \[0.6.0]

- fix(azure-inference): 正確管理 async client 生命週期以防止 session 未關閉 ([#20885](https://github.com/run-llama/llama_index/pull/20885))

### llama-index-llms-bedrock-converse \[0.13.0]

- fix(bedrock-converse): 改善 Converse 與 ConverStream 請求回應中 reasoningContent 的處理 ([#20853](https://github.com/run-llama/llama_index/pull/20853))

### llama-index-llms-langchain \[0.7.2]

- fix: 提升版本以觸發 llama-index-llms-langchain 整合版本發佈 ([#20751](https://github.com/run-llama/llama_index/pull/20751))

### llama-index-llms-mistralai \[0.10.0.post2]

- Fix mistralai 套件版本提升 ([#20776](https://github.com/run-llama/llama_index/pull/20776))
- fix: 更新 Mistral 套件 Python 需求 ([#20777](https://github.com/run-llama/llama_index/pull/20777))

### llama-index-llms-modelslab \[0.1.0]

- feat: 新增 ModelsLab LLM 整合 (llama-index-llms-modelslab) ([#20731](https://github.com/run-llama/llama_index/pull/20731))

### llama-index-llms-openai \[0.6.26]

- fix-openai-toolcall-after-thinking #20333 ([#20725](https://github.com/run-llama/llama_index/pull/20725))
- fix: 為 OpenAI chat completions 轉發 allow\_parallel\_tool\_calls ([#20744](https://github.com/run-llama/llama_index/pull/20744))
- feat: 支援 gpt-5-chat ([#20774](https://github.com/run-llama/llama_index/pull/20774))
- feat: 在 OpenAI Chat Completions 中支援 reasoning\_content ([#20786](https://github.com/run-llama/llama_index/pull/20786))
- nit: 新增 openai 模型名稱 ([#20800](https://github.com/run-llama/llama_index/pull/20800))- fix: 為 OpenAIResponses structured\_predict 使用 constrained decoding ([#20808](https://github.com/run-llama/llama_index/pull/20808))
- 在 OpenAI retry decorator 中遵循 Retry-After header ([#20813](https://github.com/run-llama/llama_index/pull/20813))
- fix openai tool calls ([#20831](https://github.com/run-llama/llama_index/pull/20831))
- fix: 為 reasoning models 移除 parallel\_tool\_calls ([#20866](https://github.com/run-llama/llama_index/pull/20866))

### llama-index-node-parser-chonkie \[0.1.2]

- Fix/20706 chonkie init doc ([#20713](https://github.com/run-llama/llama_index/pull/20713))

### llama-index-observability-otel \[0.5.1]

- feat: 新增可於 otel tracer 內註冊的額外 span processors ([#20747](https://github.com/run-llama/llama_index/pull/20747))
- feat: 傳遞自定義 tracer provider ([#20765](https://github.com/run-llama/llama_index/pull/20765))
- feat: 為 external context 新增繼承 ([#20788](https://github.com/run-llama/llama_index/pull/20788))
- otel instrumentation 增強 ([#20816](https://github.com/run-llama/llama_index/pull/20816))

### llama-index-packs-agent-search-retriever \[0.4.1]

- chore(deps): 更新 47 個目錄中的 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-amazon-product-extraction \[0.4.1]

- chore(deps): 更新 47 個目錄中的 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-arize-phoenix-query-engine \[0.4.1]

- chore(deps): 更新 47 個目錄中的 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))
- chore(deps): 更新 6 個目錄中的 uv group，共 2 項更新 ([#20856](https://github.com/run-llama/llama_index/pull/20856))

### llama-index-packs-auto-merging-retriever \[0.5.1]

- chore(deps): 更新 47 個目錄中的 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-code-hierarchy \[0.6.1]

- chore(deps): 更新 8 個目錄中的 uv group，共 2 項更新 ([#20758](https://github.com/run-llama/llama_index/pull/20758))
- chore(deps): 更新 47 個目錄中的 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))
- 更新 9 個目錄中的 uv group，共 2 項更新 ([#20798](https://github.com/run-llama/llama_index/pull/20798))
- chore(deps): 更新 6 個目錄中的 uv group，共 2 項更新 ([#20856](https://github.com/run-llama/llama_index/pull/20856))

### llama-index-packs-cohere-citation-chat \[0.5.1]

- chore(deps): 更新 47 個目錄中的 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-deeplake-deepmemory-retriever \[0.4.1]

- chore(deps): 更新 47 個目錄中的 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-deeplake-multimodal-retrieval \[0.3.1]

- chore(deps): 更新 47 個目錄中的 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-dense-x-retrieval \[0.5.1]

- chore(deps): 更新 47 個目錄中的 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-diff-private-simple-dataset \[0.4.1]

- chore(deps): 更新 47 個目錄中的 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-evaluator-benchmarker \[0.4.1]

- chore(deps): 更新 47 個目錄中的 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-fusion-retriever \[0.5.1]

- chore(deps): 更新 47 個目錄中的 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-fuzzy-citation \[0.4.1]

- chore(deps): 更新 47 個目錄中的 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-gmail-openai-agent \[0.4.1]

- chore(deps): 更新 47 個目錄中的 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-koda-retriever \[0.4.1]

- chore(deps): 更新 47 個目錄中的 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-llama-dataset-metadata \[0.4.1]

- chore(deps): 更新 47 個目錄中的 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-llama-guard-moderator \[0.4.1]

- chore(deps): 更新 47 個目錄中的 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-llava-completion \[0.4.1]

- chore(deps): 更新 47 個目錄中的 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-longrag \[0.5.1]

- chore(deps): 在 47 個目錄中更新 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-mixture-of-agents \[0.4.1]

- chore(deps): 在 47 個目錄中更新 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-multi-tenancy-rag \[0.5.1]

- chore(deps): 在 47 個目錄中更新 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-multidoc-autoretrieval \[0.4.1]

- chore(deps): 在 47 個目錄中更新 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-nebulagraph-query-engine \[0.5.1]

- chore(deps): 在 47 個目錄中更新 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-neo4j-query-engine \[0.5.1]

- chore(deps): 在 47 個目錄中更新 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))
- feat(neo4j): 為大型資料庫 schema introspection 新增 apoc\_sample 參數 ([#20859](https://github.com/run-llama/llama_index/pull/20859))

### llama-index-packs-node-parser-semantic-chunking \[0.4.1]

- chore(deps): 在 47 個目錄中更新 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-ollama-query-engine \[0.5.1]

- chore(deps): 在 47 個目錄中更新 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-panel-chatbot \[0.4.1]

- chore(deps): 在 8 個目錄中更新 uv group，共 2 項更新 ([#20758](https://github.com/run-llama/llama_index/pull/20758))
- chore(deps): 在 47 個目錄中更新 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))
- 在 9 個目錄中更新 uv group，共 2 項更新 ([#20798](https://github.com/run-llama/llama_index/pull/20798))
- chore(deps): 在 6 個目錄中更新 uv group，共 2 項更新 ([#20856](https://github.com/run-llama/llama_index/pull/20856))

### llama-index-packs-raft-dataset \[0.4.1]

- chore(deps): 在 47 個目錄中更新 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-rag-evaluator \[0.4.1]

- chore(deps): 在 47 個目錄中更新 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-ragatouille-retriever \[0.5.1]

- chore(deps): 在 47 個目錄中更新 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-raptor \[0.4.1]

- chore(deps): 在 8 個目錄中更新 uv group，共 2 項更新 ([#20758](https://github.com/run-llama/llama_index/pull/20758))
- chore(deps): 在 47 個目錄中更新 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))
- 在 9 個目錄中更新 uv group，共 2 項更新 ([#20798](https://github.com/run-llama/llama_index/pull/20798))

### llama-index-packs-recursive-retriever \[0.7.1]

- chore(deps): 在 8 個目錄中更新 uv group，共 2 項更新 ([#20758](https://github.com/run-llama/llama_index/pull/20758))
- chore(deps): 在 47 個目錄中更新 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))
- 在 9 個目錄中更新 uv group，共 2 項更新 ([#20798](https://github.com/run-llama/llama_index/pull/20798))
- chore(deps): 在 6 個目錄中更新 uv group，共 2 項更新 ([#20856](https://github.com/run-llama/llama_index/pull/20856))

### llama-index-packs-resume-screener \[0.9.3]

- chore(deps): 在 8 個目錄中更新 uv group，共 2 項更新 ([#20758](https://github.com/run-llama/llama_index/pull/20758))
- chore(deps): 在 47 個目錄中更新 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))
- 在 9 個目錄中更新 uv group，共 2 項更新 ([#20798](https://github.com/run-llama/llama_index/pull/20798))
- chore(deps): 在 6 個目錄中更新 uv group，共 2 項更新 ([#20856](https://github.com/run-llama/llama_index/pull/20856))

### llama-index-packs-retry-engine-weaviate \[0.5.1]

- chore(deps): 在 47 個目錄中更新 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-searchain \[0.2.1]

- chore(deps): 在 47 個目錄中更新 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-self-discover \[0.4.1]

- chore(deps): 在 47 個目錄中更新 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-self-rag \[0.4.1]

- chore(deps): 在 47 個目錄中更新 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-sentence-window-retriever \[0.5.1]

- chore(deps): 在 47 個目錄中更新 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-snowflake-query-engine \[0.5.1]

- chore(deps): 在 47 個目錄中更新 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-stock-market-data-query-engine \[0.5.1]

- chore(deps): 在 47 個目錄中更新 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-streamlit-chatbot \[0.5.2]

- chore(deps): 在 47 個目錄中更新 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-sub-question-weaviate \[0.4.1]

- chore(deps): 在 47 個目錄中更新 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-timescale-vector-autoretrieval \[0.4.1]

- chore(deps): 在 47 個目錄中更新 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-packs-trulens-eval-packs \[0.4.1]

- chore(deps): 在 47 個目錄中更新 uv group，共 3 項更新 ([#20793](https://github.com/run-llama/llama_index/pull/20793))

### llama-index-postprocessor-cohere-rerank \[0.7.0]

- 將 CohereRerank 更新至 ClientV2 以支援 V4 rerankers ([#20778](https://github.com/run-llama/llama_index/pull/20778))

### llama-index-readers-github \[0.10.0]

- 在 9 個目錄中更新 uv group，共 2 項更新 ([#20798](https://github.com/run-llama/llama_index/pull/20798))

### llama-index-readers-igpt-email \[0.1.0]

- feat: 新增 iGPT Email Intelligence 工具與 reader 整合 ([#20727](https://github.com/run-llama/llama_index/pull/20727))

### llama-index-readers-microsoft-sharepoint \[0.8.1]

- fix: 在 SharePointReader.\_get\_drive\_id 提前 return 前設定 \_drive\_id\_endpoint ([#20837](https://github.com/run-llama/llama_index/pull/20837))

### llama-index-readers-preprocess \[0.5.0]

- 廢棄 Preprocess reader：服務已停止 ([#20759](https://github.com/run-llama/llama_index/pull/20759))

### llama-index-readers-screenpipe \[0.1.0]

- feat: 新增 Screenpipe reader 整合，支援螢幕 OCR 與音訊轉錄 ([#20789](https://github.com/run-llama/llama_index/pull/20789))

### llama-index-storage-chat-store-opensearch \[0.1.0]

- feat: 新增 OpenSearch chat store 整合 ([#20796](https://github.com/run-llama/llama_index/pull/20796))

### llama-index-storage-chat-store-redis \[0.6.0]

- perf(redis-chat-store): 直接使用 Pydantic 進行 ChatMessage 的序列化與反序列化 ([#20931](https://github.com/run-llama/llama_index/pull/20931))

### llama-index-tools-aws-bedrock-agentcore \[0.2.0]

- feat(tools): 在 AWS Bedrock AgentCore 中新增瀏覽器管理與 code interpreter 生命週期 ([#20811](https://github.com/run-llama/llama_index/pull/20811))

### llama-index-tools-igpt-email \[0.1.0]

- feat: 新增 iGPT Email Intelligence 工具與 reader 整合 ([#20727](https://github.com/run-llama/llama_index/pull/20727))

### llama-index-tools-mcp \[0.4.8]

- fix: 在 \_resolve\_union\_option 中處理 Literal unions 的 enum 類型 ([#20780](https://github.com/run-llama/llama_index/pull/20780))

### llama-index-tools-moss \[0.2.0]

- fix: 修復 Moss 與 QueryOptions 的整合 bug ([#20815](https://github.com/run-llama/llama_index/pull/20815))

### llama-index-tools-seltz \[0.2.0]

- feat(seltz): 將 Seltz 整合更新至 SDK 0.2.0 ([#20906](https://github.com/run-llama/llama_index/pull/20906))

### llama-index-vector-stores-azureaisearch \[0.4.5]

- fix(azureaisearch): 針對不支援的 query modes 拋出錯誤 ([#20846](https://github.com/run-llama/llama_index/pull/20846))

### llama-index-vector-stores-lancedb \[0.4.5]

- fix(lancedb): 為 table 存在檢查新增分頁 ([#20841](https://github.com/run-llama/llama_index/pull/20841))

### llama-index-vector-stores-lantern \[0.4.2]

- fix(lantern,yugabytedb): 從 close() 中移除已廢棄的 sessionmaker.close\_all() ([#20884](https://github.com/run-llama/llama_index/pull/20884))

### llama-index-vector-stores-neo4jvector \[0.5.3]

- 新增 Neo4j 使用者 agent ([#20827](https://github.com/run-llama/llama_index/pull/20827))

### llama-index-vector-stores-opensearch \[1.1.1]

- fix(opensearch): 將 OpensearchVectorClient 的 index 建立延遲至首次使用 ([#20849](https://github.com/run-llama/llama_index/pull/20849))
- fix(opensearch): 追蹤 client 所有權並清理未關閉的 session ([#20903](https://github.com/run-llama/llama_index/pull/20903))

### llama-index-vector-stores-qdrant \[0.9.2]

- fix(qdrant): 防止 alpha=0.0 被錯誤地回退至 0.5 ([#20880](https://github.com/run-llama/llama_index/pull/20880))

### llama-index-vector-stores-weaviate \[1.5.0]

- fix: 強制將 Weaviate MetadataFilter 值轉換為符合 collection schema 的型別 ([#20730](https://github.com/run-llama/llama_index/pull/20730))

### llama-index-vector-stores-yugabytedb \[0.5.5]

- fix(lantern,yugabytedb): 從 close() 中移除已棄用的 sessionmaker.close\_all() ([#20884](https://github.com/run-llama/llama_index/pull/20884))

## \[2026-02-18]

### llama-index-agent-agentmesh \[0.1.0]

- \[Integration] AgentMesh: 為 LlamaIndex Agents 提供 Trust Layer ([#20644](https://github.com/run-llama/llama_index/pull/20644))

### llama-index-core \[0.14.15]

- 支援 multimodal 型別的基本操作 ([#20640](https://github.com/run-llama/llama_index/pull/20640))
- 支援遞迴 llm 型別 ([#20642](https://github.com/run-llama/llama_index/pull/20642))
- fix: 從 TextNode 移除多餘的 metadata\_seperator 欄位 ([#20649](https://github.com/run-llama/llama_index/pull/20649))
- fix(tests): 更新 mock\_prompts.py 中的 mock prompt 型別 ([#20661](https://github.com/run-llama/llama_index/pull/20661))
- 支援 multimodal 模板變數格式化 ([#20682](https://github.com/run-llama/llama_index/pull/20682))
- 支援 multimodal prompt 模板 ([#20683](https://github.com/run-llama/llama_index/pull/20683))
- 支援 multimodal chat prompt 輔助工具 ([#20684](https://github.com/run-llama/llama_index/pull/20684))
- 為 BaseExtractor 加入重試與錯誤處理機制 ([#20693](https://github.com/run-llama/llama_index/pull/20693))
- 確保舊版 memory 至少回傳一個 message/content 區塊 ([#20729](https://github.com/run-llama/llama_index/pull/20729))

### llama-index-embeddings-ibm \[0.6.0.post1]

- chore: 移除 persistent\_connection 參數支援並更新 ([#20714](https://github.com/run-llama/llama_index/pull/20714))
- docs: 更新 IBM 文件 ([#20718](https://github.com/run-llama/llama_index/pull/20718))

### llama-index-llms-anthropic \[0.10.9]

- 新增 Sonnet 4-6 支援 ([#20723](https://github.com/run-llama/llama_index/pull/20723))

### llama-index-llms-bedrock-converse \[0.12.10]

- fix(bedrock-converse): 確保 thinking\_delta 在所有聊天模式中皆有值 ([#20664](https://github.com/run-llama/llama_index/pull/20664))
- feat(bedrock-converse): 新增對 Claude Sonnet 4.6 的支援 ([#20726](https://github.com/run-llama/llama_index/pull/20726))

### llama-index-llms-ibm \[0.7.0.post1]

- chore: 移除 persistent\_connection 參數支援並更新 ([#20714](https://github.com/run-llama/llama_index/pull/20714))
- docs: 更新 IBM 文件 ([#20718](https://github.com/run-llama/llama_index/pull/20718))

### llama-index-llms-mistralai \[0.10.0]

- Rrubini/mistral azure sdk ([#20668](https://github.com/run-llama/llama_index/pull/20668))

### llama-index-llms-oci-data-science \[1.0.0]

- 新增對 OCI DataScience 新 endpoint /predictWithStream 的支援，以適用於 streaming 案例 ([#20545](https://github.com/run-llama/llama_index/pull/20545))

### llama-index-observability-otel \[0.3.0]

- 透過扁平化 dicts 來改善 otel 資料序列化 ([#20719](https://github.com/run-llama/llama_index/pull/20719))
- feat: 支援自定義 span processor；refactor: 使用 llama-index-instrumentation 取代 llama-index-core ([#20732](https://github.com/run-llama/llama_index/pull/20732))

### llama-index-program-evaporate \[0.5.2]

- 在 EvaporateExtractor 中將 LLM 產生的程式碼執行放入 Sandbox ([#20676](https://github.com/run-llama/llama_index/pull/20676))

### llama-index-readers-bitbucket \[0.4.2]

- fix: 替換 load\_all\_file\_paths 中可變的預設參數 ([#20698](https://github.com/run-llama/llama_index/pull/20698))

### llama-index-readers-github \[0.10.0]

- feat: 強化 GitHubRepoReader，支援選擇性檔案擷取與去重複 (Issue #20471) ([#20550](https://github.com/run-llama/llama_index/pull/20550))

### llama-index-readers-layoutir \[0.1.1]

- feat: 新增 LayoutIR reader 整合 ([#20708](https://github.com/run-llama/llama_index/pull/20708))
- fix(layoutir): 修復 output\_dir 崩潰與 Block 擷取的 hotfix (#20708 後續追蹤) ([#20715](https://github.com/run-llama/llama_index/pull/20715))
- fix(layoutir): 將 requires-python 限制為 >=3.12 以符合 layoutir 依賴 ([#20733](https://github.com/run-llama/llama_index/pull/20733))

### llama-index-readers-microsoft-sharepoint \[0.8.0]

- 為 SharePoint reader 中的 Microsoft Graph API 呼叫新增分頁支援 ([#20704](https://github.com/run-llama/llama_index/pull/20704))

### llama-index-readers-whatsapp \[0.4.2]

- fix: 更新 WhatsAppChatLoader 以 pandas 格式擷取 DataFrame ([#20722](https://github.com/run-llama/llama_index/pull/20722))

### llama-index-tools-mcp \[0.4.7]

- feat: 將 partial\_params 傳遞至 get\_tools\_from\_mcp 工具函數 ([#20669](https://github.com/run-llama/llama_index/pull/20669))

### llama-index-vector-stores-faiss \[0.5.3]

- 在 FaissMapVectorStore 持久化中將 eval() 替換為 json.loads ([#20675](https://github.com/run-llama/llama_index/pull/20675))

### llama-index-vector-stores-milvus \[1.0.0]

- 修復：移除 Milvus 向量儲存中 ORM Collection 與 MilvusClient 的混用 ([#20687](https://github.com/run-llama/llama_index/pull/20687))

## \[2026-02-18]

### llama-index-agent-agentmesh \[0.1.0]

- \[整合] AgentMesh: Trust Layer for LlamaIndex Agents ([#20644](https://github.com/run-llama/llama_index/pull/20644))

### llama-index-core \[0.14.15]

- 支援 multimodal 類型的基本操作 ([#20640](https://github.com/run-llama/llama_index/pull/20640))
- 新增 recursive llm 類型支援 ([#20642](https://github.com/run-llama/llama_index/pull/20642))
- 修復：從 TextNode 移除多餘的 metadata\_seperator 欄位 ([#20649](https://github.com/run-llama/llama_index/pull/20649))
- 修復(tests)：更新 mock\_prompts.py 中的 mock prompt 類型 ([#20661](https://github.com/run-llama/llama_index/pull/20661))
- 新增 multimodal 模板變數格式化 ([#20682](https://github.com/run-llama/llama_index/pull/20682))
- 新增 multimodal prompt 模板 ([#20683](https://github.com/run-llama/llama_index/pull/20683))
- 新增 multimodal chat prompt 輔助工具 ([#20684](https://github.com/run-llama/llama_index/pull/20684))
- 為 BaseExtractor 新增重試與錯誤處理 ([#20693](https://github.com/run-llama/llama_index/pull/20693))
- 確保舊版 memory 至少回傳一個 message/content 區塊 ([#20729](https://github.com/run-llama/llama_index/pull/20729))

### llama-index-embeddings-ibm \[0.6.0.post1]

- chore: 移除 persistent\_connection 參數支援並更新 ([#20714](https://github.com/run-llama/llama_index/pull/20714))
- docs: 更新 IBM 文件 ([#20718](https://github.com/run-llama/llama_index/pull/20718))

### llama-index-llms-anthropic \[0.10.9]

- 新增 Sonnet 4-6 ([#20723](https://github.com/run-llama/llama_index/pull/20723))

### llama-index-llms-bedrock-converse \[0.12.10]

- 修復(bedrock-converse)：確保 thinking\_delta 在所有聊天模式中皆有填入 ([#20664](https://github.com/run-llama/llama_index/pull/20664))
- 新增(bedrock-converse)：新增對 Claude Sonnet 4.6 的支援 ([#20726](https://github.com/run-llama/llama_index/pull/20726))

### llama-index-llms-ibm \[0.7.0.post1]

- chore: 移除 persistent\_connection 參數支援並更新 ([#20714](https://github.com/run-llama/llama_index/pull/20714))
- docs: 更新 IBM 文件 ([#20718](https://github.com/run-llama/llama_index/pull/20718))

### llama-index-llms-mistralai \[0.10.0]

- Rrubini/mistral azure sdk ([#20668](https://github.com/run-llama/llama_index/pull/20668))

### llama-index-llms-oci-data-science \[1.0.0]

- 新增對新 OCI DataScience endpoint /predictWithStream 的支援，以適用於 streaming 案例 ([#20545](https://github.com/run-llama/llama_index/pull/20545))

### llama-index-observability-otel \[0.3.0]

- 透過扁平化 dicts 來改善 otel 資料序列化 ([#20719](https://github.com/run-llama/llama_index/pull/20719))
- 新增：支援自定義 span processor；重構：使用 llama-index-instrumentation 取代 llama-index-core ([#20732](https://github.com/run-llama/llama_index/pull/20732))

### llama-index-program-evaporate \[0.5.2]

- 在 EvaporateExtractor 中對 LLM 產生的程式碼執行進行 Sandbox 隔離 ([#20676](https://github.com/run-llama/llama_index/pull/20676))

### llama-index-readers-bitbucket \[0.4.2]

- 修復：替換 load\_all\_file\_paths 中的可變預設參數 ([#20698](https://github.com/run-llama/llama_index/pull/20698))

### llama-index-readers-github \[0.10.0]

- 新增：增強 GitHubRepoReader，支援選擇性檔案擷取與去重 (Issue #20471) ([#20550](https://github.com/run-llama/llama_index/pull/20550))

### llama-index-readers-layoutir \[0.1.1]

- 新增：新增 LayoutIR reader 整合 ([#20708](https://github.com/run-llama/llama_index/pull/20708))
- 修復(layoutir)：針對 output\_dir 崩潰與 Block 擷取的 hotfix (#20708 後續追蹤) ([#20715](https://github.com/run-llama/llama_index/pull/20715))
- 修復(layoutir)：將 requires-python 限制為 >=3.12 以符合 layoutir 依賴 ([#20733](https://github.com/run-llama/llama_index/pull/20733))

### llama-index-readers-microsoft-sharepoint \[0.8.0]

- 為 SharePoint reader 中的 Microsoft Graph API 呼叫新增分頁支援 ([#20704](https://github.com/run-llama/llama_index/pull/20704))

### llama-index-readers-whatsapp \[0.4.2]

- 修復：更新 WhatsAppChatLoader 以 pandas 格式擷取 DataFrame ([#20722](https://github.com/run-llama/llama_index/pull/20722))

### llama-index-tools-mcp \[0.4.7]

- 新增：將 partial\_params 傳遞至 get\_tools\_from\_mcp 工具函數 ([#20669](https://github.com/run-llama/llama_index/pull/20669))

### llama-index-vector-stores-faiss \[0.5.3]

- 在 FaissMapVectorStore 持久化中將 eval() 替換為 json.loads ([#20675](https://github.com/run-llama/llama_index/pull/20675))

### llama-index-vector-stores-milvus \[1.0.0]

- 修復：移除 Milvus 向量儲存中 ORM Collection 與 MilvusClient 的混用 ([#20687](https://github.com/run-llama/llama_index/pull/20687))

## \[2026-02-10]

### llama-index-callbacks-wandb \[0.4.2]

- 修復核心元件中潛在的崩潰問題並改善安全性預設值 ([#20610](https://github.com/run-llama/llama_index/pull/20610))

### llama-index-core \[0.14.14]

- fix: 在 VectorStoreQueryOutputParser 中捕捉 pydantic ValidationError ([#20450](https://github.com/run-llama/llama_index/pull/20450))
- fix: 在 MediaResource.hash 中區分空字串與 None ([#20451](https://github.com/run-llama/llama_index/pull/20451))
- 支援 Langchain1.x ([#20472](https://github.com/run-llama/llama_index/pull/20472))
- 修復 DeprecationWarning: ‘asyncio.iscoroutinefunction’ 已棄用 ([#20517](https://github.com/run-llama/llama_index/pull/20517))
- fix(core): 若環境變數缺失，則回退至內建的 nltk 快取 ([#20528](https://github.com/run-llama/llama_index/pull/20528))
- feat(callbacks): 新增 TokenBudgetHandler 用於成本管理 ([#20546](https://github.com/run-llama/llama_index/pull/20546))
- fix(core): 處理 truncate\_text 函式的邊緣案例 ([#20551](https://github.com/run-llama/llama_index/pull/20551))
- fix(core): 修復 types Thread 在 target 為 None 時傳遞 None 而非 copy\_context().run 的問題 ([#20553](https://github.com/run-llama/llama_index/pull/20553))
- chore: 更新 llama-index lockfile 並微調測試 ([#20556](https://github.com/run-llama/llama_index/pull/20556))
- 針對 workflows context 變更的相容性處理 ([#20557](https://github.com/run-llama/llama_index/pull/20557))
- test(core): 修復快取目錄路徑測試以相容 Windows ([#20566](https://github.com/run-llama/llama_index/pull/20566))
- fix(tests): 在 json reader 測試中強制使用 utf-8 編碼以相容 Windows ([#20576](https://github.com/run-llama/llama_index/pull/20576))
- 修復升級工具中的 BM25Retriever 映射 ([#20582](https://github.com/run-llama/llama_index/pull/20582))
- fix(agent): 使用重試邏輯處理空的 LLM 回應並新增測試案例 ([#20596](https://github.com/run-llama/llama_index/pull/20596))
- fix: 為 run\_transformations 新增 show\_progress 參數，以防止非預期的 keyword argument 錯誤 ([#20608](https://github.com/run-llama/llama_index/pull/20608))
- 修復核心元件中潛在的崩潰問題並改善安全性預設值 ([#20610](https://github.com/run-llama/llama_index/pull/20610))
- 新增 core 3.14 測試 ([#20619](https://github.com/run-llama/llama_index/pull/20619))

### llama-index-embeddings-cohere \[0.7.0]

- fix(embeddings-cohere): 使用 tenacity 新增重試邏輯 ([#20592](https://github.com/run-llama/llama_index/pull/20592))

### llama-index-embeddings-google-genai \[0.3.2]

- 為 Gemini API 請求新增 client headers ([#20519](https://github.com/run-llama/llama_index/pull/20519))

### llama-index-embeddings-siliconflow \[0.3.2]

- 修復 DeprecationWarning: ‘asyncio.iscoroutinefunction’ 已棄用 ([#20517](https://github.com/run-llama/llama_index/pull/20517))

### llama-index-embeddings-upstage \[0.5.1]

- chore(deps): 在 4 個目錄中更新 uv group，共 4 項更新 ([#20531](https://github.com/run-llama/llama_index/pull/20531))

### llama-index-graph-stores-falkordb \[0.4.2]

- fix(falkordb): 修復使用 triplet\_source\_id 建立 MENTIONS 關係的問題 ([#20650](https://github.com/run-llama/llama_index/pull/20650))

### llama-index-llms-anthropic \[0.10.8]

- chore: 更新可快取的 Anthropic 模型 ([#20581](https://github.com/run-llama/llama_index/pull/20581))
- chore: 新增對 opus 4.6 的支援 ([#20635](https://github.com/run-llama/llama_index/pull/20635))

### llama-index-llms-bedrock-converse \[0.12.8]

- 修復 bedrock converse 空工具配置問題 ([#20571](https://github.com/run-llama/llama_index/pull/20571))
- fix(llms-bedrock-converse): 改善 bedrock converse 的重試處理 ([#20590](https://github.com/run-llama/llama_index/pull/20590))
- feat(bedrock-converse): 新增對 Claude Opus 4.6 的支援 ([#20637](https://github.com/run-llama/llama_index/pull/20637))
- 在 Bedrock 中新增對 adaptive thinking 的支援 ([#20659](https://github.com/run-llama/llama_index/pull/20659))
- chore(deps): 在 2 個目錄中更新 pip group，共 7 項更新 ([#20662](https://github.com/run-llama/llama_index/pull/20662))

### llama-index-llms-cohere \[0.7.1]

- Feat: 為 Cohere LLM 新增自定義 base\_url 支援 ([#20534](https://github.com/run-llama/llama_index/pull/20534))
- fix(llms-cohere): 在重試邏輯中處理額外的錯誤類型 ([#20591](https://github.com/run-llama/llama_index/pull/20591))

### llama-index-llms-dashscope \[0.5.2]

- fix(dashscope): 從 assistant 訊息中移除空的 tool\_calls ([#20535](https://github.com/run-llama/llama_index/pull/20535))

### llama-index-llms-google-genai \[0.8.7]

- 為 Gemini API 請求新增 client headers ([#20519](https://github.com/run-llama/llama_index/pull/20519))
- fix(decorator): 為 async 方法在 llm\_retry\_decorator 中新增邏輯 ([#20588](https://github.com/run-llama/llama_index/pull/20588))
- 修復/google genai 清理 ([#20607](https://github.com/run-llama/llama_index/pull/20607))- fix(google-genai)：在不需要時跳過 model meta 擷取 ([#20639](https://github.com/run-llama/llama_index/pull/20639))

### llama-index-llms-huggingface-api \[0.6.2]

- 更新 huggingface inference api 的建議預設 provider ([#20589](https://github.com/run-llama/llama_index/pull/20589))

### llama-index-llms-langchain \[0.7.1]

- 支援 Langchain1.x ([#20472](https://github.com/run-llama/llama_index/pull/20472))

### llama-index-llms-openai \[0.6.18]

- OpenAI 回應修正 ([#20538](https://github.com/run-llama/llama_index/pull/20538))
- feat：新增對 gpt-5.2-chat 模型的支援 ([#20549](https://github.com/run-llama/llama_index/pull/20549))
- fix(openai)：將 message dict 中的 image\_url detail 設為選填 ([#20609](https://github.com/run-llama/llama_index/pull/20609))
- 新增新的 reasoning 類型 ([#20612](https://github.com/run-llama/llama_index/pull/20612))
- fix(openai)：為所有 reasoning 模型排除不支援的參數 ([#20627](https://github.com/run-llama/llama_index/pull/20627))

### llama-index-llms-openai-like \[0.6.0]

- 將 transformers 設為 openai-like 的選用相依項目 ([#20580](https://github.com/run-llama/llama_index/pull/20580))

### llama-index-llms-openrouter \[0.4.4]

- 將 transformers 設為 openai-like 的選用相依項目 ([#20580](https://github.com/run-llama/llama_index/pull/20580))

### llama-index-llms-siliconflow \[0.4.3]

- 修正 DeprecationWarning：‘asyncio.iscoroutinefunction’ 已棄用 ([#20517](https://github.com/run-llama/llama_index/pull/20517))

### llama-index-llms-upstage \[0.7.0]

- 新增 upstage 模型 (solar-pro3) ([#20544](https://github.com/run-llama/llama_index/pull/20544))

### llama-index-llms-vllm \[0.6.2]

- feat：為 VllmServer 新增 openai-like 伺服器模式 ([#20537](https://github.com/run-llama/llama_index/pull/20537))

### llama-index-memory-bedrock-agentcore \[0.1.2]

- 在 bedrock-agentcorememory 中新增 event 與 memory record 的刪除方法 ([#20428](https://github.com/run-llama/llama_index/pull/20428))
- chore(deps)：更新 llama-index-core 相依性 lock 以包含 0.14.x ([#20483](https://github.com/run-llama/llama_index/pull/20483))

### llama-index-memory-mem0 \[1.0.0]

- fix：mem0 整合清理與重構 ([#20532](https://github.com/run-llama/llama_index/pull/20532))

### llama-index-node-parser-chonkie \[0.1.1]

- feat：新增 chonkie 整合 ([#20622](https://github.com/run-llama/llama_index/pull/20622))
- 更新 readme ([#20656](https://github.com/run-llama/llama_index/pull/20656))

### llama-index-node-parser-docling \[0.4.2]

- fix：在 VectorStoreQueryOutputParser 中捕捉 pydantic ValidationError ([#20450](https://github.com/run-llama/llama_index/pull/20450))

### llama-index-packs-code-hierarchy \[0.6.1]

- chore(deps)：在 12 個目錄中更新 uv group，共 14 項更新 ([#20578](https://github.com/run-llama/llama_index/pull/20578))

### llama-index-packs-gmail-openai-agent \[0.4.1]

- chore(deps)：在 12 個目錄中更新 uv group，共 14 項更新 ([#20578](https://github.com/run-llama/llama_index/pull/20578))

### llama-index-packs-multidoc-autoretrieval \[0.4.1]

- chore(deps)：在 12 個目錄中更新 uv group，共 14 項更新 ([#20578](https://github.com/run-llama/llama_index/pull/20578))

### llama-index-packs-panel-chatbot \[0.4.1]

- chore(deps)：在 12 個目錄中更新 uv group，共 14 項更新 ([#20578](https://github.com/run-llama/llama_index/pull/20578))

### llama-index-packs-recursive-retriever \[0.7.1]

- chore(deps)：在 12 個目錄中更新 uv group，共 14 項更新 ([#20578](https://github.com/run-llama/llama_index/pull/20578))
- chore(deps)：在 2 個目錄中更新 pip group，共 7 項更新 ([#20662](https://github.com/run-llama/llama_index/pull/20662))

### llama-index-packs-resume-screener \[0.9.3]

- chore(deps)：在 12 個目錄中更新 uv group，共 14 項更新 ([#20578](https://github.com/run-llama/llama_index/pull/20578))

### llama-index-packs-retry-engine-weaviate \[0.5.1]

- chore(deps)：在 12 個目錄中更新 uv group，共 14 項更新 ([#20578](https://github.com/run-llama/llama_index/pull/20578))

### llama-index-packs-streamlit-chatbot \[0.5.2]

- chore(deps)：在 12 個目錄中更新 uv group，共 14 項更新 ([#20578](https://github.com/run-llama/llama_index/pull/20578))

### llama-index-packs-sub-question-weaviate \[0.4.1]

- chore(deps)：在 12 個目錄中更新 uv group，共 14 項更新 ([#20578](https://github.com/run-llama/llama_index/pull/20578))

### llama-index-packs-timescale-vector-autoretrieval \[0.4.1]

- chore(deps)：在 12 個目錄中更新 uv group，共 14 項更新 ([#20578](https://github.com/run-llama/llama_index/pull/20578))

### llama-index-postprocessor-cohere-rerank \[0.6.0]

- fix(cohere-rerank): 為 cohere rerank 新增重試邏輯與 tenacity 依賴 ([#20593](https://github.com/run-llama/llama_index/pull/20593))

### llama-index-postprocessor-nvidia-rerank \[0.5.4]

- fix(nvidia-rerank): 修復 on-prem auth 的初始化邏輯 ([#20560](https://github.com/run-llama/llama_index/pull/20560))
- fix(nvidia-rerank): 修正私有屬性引用 ([#20570](https://github.com/run-llama/llama_index/pull/20570))
- fix(nvidia-rerank): 修復本地部署 NIM rerankers 的 POST 請求 URL ([#20579](https://github.com/run-llama/llama_index/pull/20579))

### llama-index-postprocessor-tei-rerank \[0.4.2]

- fix(tei-rerank): 使用 API 回應中的 index 欄位以取得正確的分數 … ([#20599](https://github.com/run-llama/llama_index/pull/20599))
- test(tei-rerank): 新增 rerank 重試的測試覆蓋率 ([#20600](https://github.com/run-llama/llama_index/pull/20600))

### llama-index-protocols-ag-ui \[0.2.4]

- fix: 避免多區塊 ChatMessages 在 ag-ui 訊息轉換時發生 ValueError ([#20648](https://github.com/run-llama/llama_index/pull/20648))

### llama-index-readers-datasets \[0.1.0]

- chore(deps): 更新 4 個目錄中的 uv group，共 4 項更新 ([#20531](https://github.com/run-llama/llama_index/pull/20531))

### llama-index-readers-microsoft-sharepoint \[0.7.0]

- Sharepoint 頁面支援 events ([#20572](https://github.com/run-llama/llama_index/pull/20572))

### llama-index-readers-obsidian \[0.6.1]

- 支援 Langchain1.x ([#20472](https://github.com/run-llama/llama_index/pull/20472))

### llama-index-readers-service-now \[0.2.2]

- chore(deps): 更新 2 個目錄中的 pip group，共 7 項更新 ([#20662](https://github.com/run-llama/llama_index/pull/20662))

### llama-index-tools-mcp \[0.4.6]

- feat: 在 McpToolSpec 中實作 partial\_params 支援 ([#20554](https://github.com/run-llama/llama_index/pull/20554))

### llama-index-tools-mcp-discovery \[0.1.0]

- 新增 llama-index-tools-mcp-discovery 整合 ([#20502](https://github.com/run-llama/llama_index/pull/20502))

### llama-index-tools-moss \[0.1.0]

- feat(tools): 新增 Moss 搜尋引擎整合 ([#20615](https://github.com/run-llama/llama_index/pull/20615))

### llama-index-tools-seltz \[0.1.0]

- feat(tools): 新增 Seltz 網路知識工具整合 ([#20626](https://github.com/run-llama/llama_index/pull/20626))

### llama-index-tools-typecast \[0.1.0]

- 將 Typecast 工具遷移至 V2 API 以支援 voices endpoints ([#20548](https://github.com/run-llama/llama_index/pull/20548))

### llama-index-tools-wolfram-alpha \[0.5.0]

- feat(wolfram-alpha): 切換至使用 bearer auth 的 LLM API ([#20586](https://github.com/run-llama/llama_index/pull/20586))

### llama-index-vector-stores-clickhouse \[0.6.2]

- fix(clickhouse): 新增 drop\_existing\_table 參數以防止資料遺失 ([#20651](https://github.com/run-llama/llama_index/pull/20651))

### llama-index-vector-stores-milvus \[0.9.6]

- chore(deps): 更新 4 個目錄中的 uv group，共 4 項更新 ([#20531](https://github.com/run-llama/llama_index/pull/20531))

### llama-index-vector-stores-mongodb \[0.9.1]

- 更新 MongoDB 向量儲存測試以使用較新模型 ([#20515](https://github.com/run-llama/llama_index/pull/20515))

### llama-index-vector-stores-oceanbase \[0.4.0]

- feat(oceanbase): 新增 sparse/fulltext/hybrid 搜尋 ([#20524](https://github.com/run-llama/llama_index/pull/20524))

### llama-index-vector-stores-opensearch \[1.0.0]

- 將 OpenSearch 引擎預設值從已棄用的 `nmslib` 更改為 `faiss` ([#20507](https://github.com/run-llama/llama_index/pull/20507))
- chore(deps): 更新 4 個目錄中的 uv group，共 4 項更新 ([#20531](https://github.com/run-llama/llama_index/pull/20531))

### llama-index-vector-stores-postgres \[0.7.3]

- fix(postgres): 停用向量查詢的 bitmap scan ([#20514](https://github.com/run-llama/llama_index/pull/20514))

### llama-index-vector-stores-yugabytedb \[0.5.4]

- 新增 YugabyteDB 作為 Vector Store ([#20559](https://github.com/run-llama/llama_index/pull/20559))
- chore(deps): 更新 2 個目錄中的 pip group，共 7 項更新 ([#20662](https://github.com/run-llama/llama_index/pull/20662))

### llama-index-voice-agents-gemini-live \[0.2.2]

- 為 Gemini API 請求新增 client headers ([#20519](https://github.com/run-llama/llama_index/pull/20519))

## \[2026-01-21]

### llama-index-core \[0.14.13]

- feat: 為 agent workflows 新增 early\_stopping\_method 參數 ([#20389](https://github.com/run-llama/llama_index/pull/20389))
- feat: 為 CodeSplitter 新增基於 token 的程式碼分割支援 ([#20438](https://github.com/run-llama/llama_index/pull/20438))
- 新增 RayIngestionPipeline 整合以支援分散式資料導入 ([#20443](https://github.com/run-llama/llama_index/pull/20443))
- 新增 Condensed Conversation & Context 的多模態版本… ([#20446](https://github.com/run-llama/llama_index/pull/20446))
- 以 Memory 取代 ChatMemoryBuffer ([#20458](https://github.com/run-llama/llama_index/pull/20458))- fix(bug)：當 mean\_agg 的輸入為空列表時，改為拋出 value error 而非回傳 float ([#20466](https://github.com/run-llama/llama_index/pull/20466))
- fix：ReActChatFormatter 的 classmethod 應使用 cls 而非類別名稱 ([#20475](https://github.com/run-llama/llama_index/pull/20475))
- feat：為 synthesizers 新增可配置的空回應訊息 ([#20503](https://github.com/run-llama/llama_index/pull/20503))

### llama-index-embeddings-bedrock \[0.7.3]

- 讓 Bedrock Embedding Models 支援使用 ARN ([#20435](https://github.com/run-llama/llama_index/pull/20435))

### llama-index-embeddings-ollama \[0.8.6]

- 改進 Ollama batch embedding ([#20447](https://github.com/run-llama/llama_index/pull/20447))

### llama-index-embeddings-voyageai \[0.5.3]

- 新增 voyage-4 模型 ([#20497](https://github.com/run-llama/llama_index/pull/20497))

### llama-index-ingestion-ray \[0.1.0]

- 新增 RayIngestionPipeline 整合以支援分散式資料 ingestion ([#20443](https://github.com/run-llama/llama_index/pull/20443))

### llama-index-llms-anthropic \[0.10.6]

- feat：強化 anthropic 的 structured predict 方法 ([#20440](https://github.com/run-llama/llama_index/pull/20440))
- fix：在 Anthropic stream\_chat 回應中保留 input\_tokens ([#20512](https://github.com/run-llama/llama_index/pull/20512))

### llama-index-llms-apertis \[0.1.0]

- 新增 Apertis LLM 整合及範例 notebook ([#20436](https://github.com/run-llama/llama_index/pull/20436))

### llama-index-llms-bedrock-converse \[0.12.4]

- chore(bedrock-converse)：移除 ChatMessage 中多餘的 thinking\_delta kwarg ([#20455](https://github.com/run-llama/llama_index/pull/20455))

### llama-index-llms-gemini \[0.6.2]

- chore：棄用 llama-index-llms-gemini ([#20511](https://github.com/run-llama/llama_index/pull/20511))

### llama-index-llms-openai \[0.6.13]

- 為通用 Pydantic 模型清理 OpenAI structured output JSON schema 名稱 ([#20452](https://github.com/run-llama/llama_index/pull/20452))
- chore：vbump openai ([#20482](https://github.com/run-llama/llama_index/pull/20482))

### llama-index-llms-openrouter \[0.4.3]

- Feature/openrouter provider routing 支援 ([#20431](https://github.com/run-llama/llama_index/pull/20431))

### llama-index-packs-recursive-retriever \[0.7.1]

- security：從 notebook 輸出中移除外洩的 OpenAI API 金鑰 ([#20474](https://github.com/run-llama/llama_index/pull/20474))

### llama-index-packs-sentence-window-retriever \[0.5.1]

- security：從 notebook 輸出中移除外洩的 OpenAI API 金鑰 ([#20474](https://github.com/run-llama/llama_index/pull/20474))

### llama-index-readers-datasets \[0.1.0]

- 新增 HuggingFace datasets reader 整合 ([#20468](https://github.com/run-llama/llama_index/pull/20468))

### llama-index-readers-patentsview \[1.0.0]

- Patentsview reader api 變更 ([#20481](https://github.com/run-llama/llama_index/pull/20481))

### llama-index-retrievers-you \[1.0.0]

- 重構 YouRetriever 整合 ([#20493](https://github.com/run-llama/llama_index/pull/20493))

### llama-index-tools-parallel-web-systems \[0.1.0]

- feat：新增 Parallel Web System tools ([#20442](https://github.com/run-llama/llama_index/pull/20442))

### llama-index-vector-stores-alibabacloud-mysql \[0.1.0]

- Feature/alibaba mysql vector 整合 ([#20396](https://github.com/run-llama/llama_index/pull/20396))

### llama-index-vector-stores-milvus \[0.9.6]

- Feat milvus partition 名稱 ([#20445](https://github.com/run-llama/llama_index/pull/20445))
- improve(llama-index-vector-stores-milvus)：將 add/delete 中的 partition 參數更改為 `milvus_partition_name` ([#20460](https://github.com/run-llama/llama_index/pull/20460))

### llama-index-vector-stores-mongodb \[0.9.1]

- INTPYTHON-863 修復 mongodb async 整合 ([#20444](https://github.com/run-llama/llama_index/pull/20444))

### llama-index-vector-stores-neo4jvector \[0.5.2]

- 處理 neo4j vector store 缺失 metadata 的情況 ([#20491](https://github.com/run-llama/llama_index/pull/20491))

### llama-index-vector-stores-opensearch \[0.6.3]

- fix (opensearch)：為 vector client 新增 close 與 aclose 方法 ([#20463](https://github.com/run-llama/llama_index/pull/20463))

### llama-index-vector-stores-qdrant \[0.9.1]

- Qdrant search params ([#20476](https://github.com/run-llama/llama_index/pull/20476))

### llama-index-vector-stores-vertexaivectorsearch \[0.3.4]

- feat(vertexaivectorsearch)：新增 hybrid search 支援 ([#20487](https://github.com/run-llama/llama_index/pull/20487))

### llama-index-vector-stores-volcenginemysql \[0.2.0]

- feat：Volcengine MySQL vector store 整合 ([#20404](https://github.com/run-llama/llama_index/pull/20404))

## \[2025-12-30]

### llama-index-callbacks-agentops \[0.4.1]

- 新功能/支援 async tool spec ([#20338](https://github.com/run-llama/llama_index/pull/20338))

### llama-index-core \[0.14.12]

- 新功能/支援 async tool spec ([#20338](https://github.com/run-llama/llama_index/pull/20338))
- 改善 `MockFunctionCallingLLM` ([#20356](https://github.com/run-llama/llama_index/pull/20356))
- fix(openai): 清理 generic Pydantic model schema 名稱 ([#20371](https://github.com/run-llama/llama_index/pull/20371))
- Element node parser ([#20399](https://github.com/run-llama/llama_index/pull/20399))
- 改善 llama dev logging ([#20411](https://github.com/run-llama/llama_index/pull/20411))
- test(node\_parser): 為 Java CodeSplitter 新增單元測試 ([#20423](https://github.com/run-llama/llama_index/pull/20423))
- fix: 修復當 result.ids 為 None 時 log\_vector\_store\_query\_result 會崩潰的問題 ([#20427](https://github.com/run-llama/llama_index/pull/20427))

### llama-index-embeddings-litellm \[0.4.1]

- 為 LiteLLM embedding 類別新增 docstring ([#20336](https://github.com/run-llama/llama_index/pull/20336))

### llama-index-embeddings-ollama \[0.8.5]

- feat(llama-index-embeddings-ollama): 新增 keep\_alive 參數 ([#20395](https://github.com/run-llama/llama_index/pull/20395))
- docs: 以詳盡的說明文件改善 Ollama embeddings README ([#20414](https://github.com/run-llama/llama_index/pull/20414))

### llama-index-embeddings-voyageai \[0.5.2]

- Voyage multimodal 35 ([#20398](https://github.com/run-llama/llama_index/pull/20398))

### llama-index-graph-stores-nebula \[0.5.1]

- feat(nebula): 為 property graph store 新增 MENTIONS 邊 ([#20401](https://github.com/run-llama/llama_index/pull/20401))

### llama-index-llms-aibadgr \[0.1.0]

- feat(llama-index-llms-aibadgr): 新增相容於 OpenAI 的 AI Badgr LLM 整合 ([#20365](https://github.com/run-llama/llama_index/pull/20365))

### llama-index-llms-anthropic \[0.10.4]

- 恢復對 haiku-3 的支援 ([#20408](https://github.com/run-llama/llama_index/pull/20408))

### llama-index-llms-bedrock-converse \[0.12.3]

- fix: 修復 bedrock converse thinking block 問題 ([#20355](https://github.com/run-llama/llama_index/pull/20355))

### llama-index-llms-google-genai \[0.8.3]

- 將 use\_file\_api 切換為 Flexible file\_mode；改善檔案上傳處理並將 google-genai 升級至 v1.52.0 ([#20347](https://github.com/run-llama/llama_index/pull/20347))
- 修復 Google-GenAI 遺失 role 的問題 ([#20357](https://github.com/run-llama/llama_index/pull/20357))
- 新增 signature index 修復 ([#20362](https://github.com/run-llama/llama_index/pull/20362))
- 為 thoughts 新增 positional thought signature ([#20418](https://github.com/run-llama/llama_index/pull/20418))

### llama-index-llms-ollama \[0.9.1]

- feature: 當傳入 ‘low’、‘medium’、‘h… 時，pydantic 不再報錯 ([#20394](https://github.com/run-llama/llama_index/pull/20394))

### llama-index-llms-openai \[0.6.12]

- fix: 在 OpenAIResponses.\_get\_model\_kwargs 中處理 tools=None 的情況 ([#20358](https://github.com/run-llama/llama_index/pull/20358))
- feat: 新增對 gpt-5.2 和 5.2 pro 的支援 ([#20361](https://github.com/run-llama/llama_index/pull/20361))

### llama-index-readers-confluence \[0.6.1]

- fix(confluence): 支援 Python 3.14 ([#20370](https://github.com/run-llama/llama_index/pull/20370))

### llama-index-readers-file \[0.5.6]

- 放寬對 `pandas` 版本的限制 ([#20387](https://github.com/run-llama/llama_index/pull/20387))

### llama-index-readers-service-now \[0.2.2]

- chore(deps): 在 /llama-index-integrations/readers/llama-index-readers-service-now 的 pip 群組中將 urllib3 從 2.5.0 升級至 2.6.0 ([#20341](https://github.com/run-llama/llama_index/pull/20341))

### llama-index-tools-mcp \[0.4.5]

- fix: 在 BasicMCPClient 中將 timeout 參數傳遞給 transport clients ([#20340](https://github.com/run-llama/llama_index/pull/20340))
- feature: 允許在建立 BasicMcpClient 時傳遞自定義的 httpx.AsyncClient ([#20368](https://github.com/run-llama/llama_index/pull/20368))

### llama-index-tools-typecast \[0.1.0]

- feat: 新增 Typecast 工具整合及其文字轉語音功能 ([#20343](https://github.com/run-llama/llama_index/pull/20343))

### llama-index-vector-stores-azurepostgresql \[0.2.0]

- 新功能/支援 async tool spec ([#20338](https://github.com/run-llama/llama_index/pull/20338))

### llama-index-vector-stores-chroma \[0.5.5]

- 修復 chroma 巢狀 metadata 篩選 ([#20424](https://github.com/run-llama/llama_index/pull/20424))
- fix(chroma): 支援 multimodal 結果 ([#20426](https://github.com/run-llama/llama_index/pull/20426))

### llama-index-vector-stores-couchbase \[0.6.0]

- 更新 Couchbase vector-store 的 FTS 與 GSI 參考文件 ([#20346](https://github.com/run-llama/llama_index/pull/20346))

### llama-index-vector-stores-faiss \[0.5.2]

- fix(faiss): 將 numpy array 而非 int 傳遞給 add\_with\_ids ([#20384](https://github.com/run-llama/llama_index/pull/20384))

### llama-index-vector-stores-lancedb \[0.4.4]

- Feat/async tool spec 支援 ([#20338](https://github.com/run-llama/llama_index/pull/20338))
- fix(vector\_stores/lancedb)：新增缺失的 ’<’ filter 運算子 ([#20364](https://github.com/run-llama/llama_index/pull/20364))
- fix(lancedb)：修正 metadata filtering 邏輯與 list value SQL 生成 ([#20374](https://github.com/run-llama/llama_index/pull/20374))

### llama-index-vector-stores-mongodb \[0.9.0]

- 更新 mongo vector store，使其可在沒有 list 權限的情況下初始化 ([#20354](https://github.com/run-llama/llama_index/pull/20354))
- 新增 mongodb delete index ([#20429](https://github.com/run-llama/llama_index/pull/20429))
- async mongodb atlas 支援 ([#20430](https://github.com/run-llama/llama_index/pull/20430))

### llama-index-vector-stores-redis \[0.6.2]

- Redis metadata filter 修正 ([#20359](https://github.com/run-llama/llama_index/pull/20359))

### llama-index-vector-stores-vertexaivectorsearch \[0.3.3]

- feat(vertex-vector-search)：新增 Google Vertex AI Vector Search v2.0 支援 ([#20351](https://github.com/run-llama/llama_index/pull/20351))

## \[2025-12-04]

### llama-index-core \[0.14.10]

- feat：新增 mock function calling llm ([#20331](https://github.com/run-llama/llama_index/pull/20331))

### llama-index-llms-qianfan \[0.4.1]

- test：修正變數名稱中的拼字錯誤 ‘reponse’ 為 ‘response’ ([#20329](https://github.com/run-llama/llama_index/pull/20329))

### llama-index-tools-airweave \[0.1.0]

- feat：新增 Airweave tool 整合及進階搜尋功能 ([#20111](https://github.com/run-llama/llama_index/pull/20111))

### llama-index-utils-qianfan \[0.4.1]

- test：修正變數名稱中的拼字錯誤 ‘reponse’ 為 ‘response’ ([#20329](https://github.com/run-llama/llama_index/pull/20329))

## \[2025-12-02]

### llama-index-agent-azure \[0.2.1]

- fix：固定 azure-ai-projects 版本以防止 breaking changes ([#20255](https://github.com/run-llama/llama_index/pull/20255))

### llama-index-core \[0.14.9]

- MultiModalVectorStoreIndex 現在會回傳一個 multi-modal ContextChatEngine ([#20265](https://github.com/run-llama/llama_index/pull/20265))
- 匯入 vector store 時，現在會確保 \_node-content 是可讀取的 ([#20266](https://github.com/run-llama/llama_index/pull/20266))
- fix：確保使用 async utils run\_async 時會複製 context ([#20286](https://github.com/run-llama/llama_index/pull/20286))
- fix(memory)：確保 flush 後 queue 中的第一則訊息始終是 user message ([#20310](https://github.com/run-llama/llama_index/pull/20310))

### llama-index-embeddings-bedrock \[0.7.2]

- feat(embeddings-bedrock)：新增對 Amazon Bedrock Application Inference Profiles 的支援 ([#20267](https://github.com/run-llama/llama_index/pull/20267))
- fix:(embeddings-bedrock) 修正從 model\_name 提取 provider 的邏輯 ([#20295](https://github.com/run-llama/llama_index/pull/20295))
- 提升 bedrock-embedding 版本 ([#20304](https://github.com/run-llama/llama_index/pull/20304))

### llama-index-embeddings-voyageai \[0.5.1]

- VoyageAI 修正與文件更新 ([#20251](https://github.com/run-llama/llama_index/pull/20251))

### llama-index-llms-anthropic \[0.10.3]

- feat：新增 anthropic opus 4.5 ([#20306](https://github.com/run-llama/llama_index/pull/20306))

### llama-index-llms-bedrock-converse \[0.12.2]

- fix(bedrock-converse)：僅在 streaming 函式中使用 guardrail\_stream\_processing\_mode ([#20289](https://github.com/run-llama/llama_index/pull/20289))
- feat：新增 anthropic opus 4.5 ([#20306](https://github.com/run-llama/llama_index/pull/20306))
- feat(bedrock-converse)：額外支援 Claude Opus 4.5 ([#20317](https://github.com/run-llama/llama_index/pull/20317))

### llama-index-llms-google-genai \[0.7.4]

- 修正 gemini-3 支援與 gemini function call 支援 ([#20315](https://github.com/run-llama/llama_index/pull/20315))

### llama-index-llms-helicone \[0.1.1]

- 更新 helicone 文件與範例 ([#20208](https://github.com/run-llama/llama_index/pull/20208))

### llama-index-llms-openai \[0.6.10]

- 微小修正 ([#20252](https://github.com/run-llama/llama_index/pull/20252))
- Feat：新增 gpt-5.1-chat 模型支援 ([#20311](https://github.com/run-llama/llama_index/pull/20311))

### llama-index-llms-ovhcloud \[0.1.0]

- 新增 OVHcloud AI Endpoints provider ([#20288](https://github.com/run-llama/llama_index/pull/20288))

### llama-index-llms-siliconflow \[0.4.2]

- \[Bugfix] 針對 siliconflow LLM 中 delta 的 content 進行 None 檢查 ([#20327](https://github.com/run-llama/llama_index/pull/20327))

### llama-index-node-parser-docling \[0.4.2]

- 放寬 docling Python 限制 ([#20322](https://github.com/run-llama/llama_index/pull/20322))

### llama-index-packs-resume-screener \[0.9.3]

- feat：將 pypdf 更新至最新版本 ([#20285](https://github.com/run-llama/llama_index/pull/20285))

### llama-index-postprocessor-voyageai-rerank \[0.4.1]

- VoyageAI 修正與文件更新 ([#20251](https://github.com/run-llama/llama_index/pull/20251))

### llama-index-protocols-ag-ui \[0.2.3]

- fix: 修正 ag-ui 事件順序以避免事件衝突 ([#20296](https://github.com/run-llama/llama_index/pull/20296))

### llama-index-readers-confluence \[0.6.0]

- 重構 Confluence 整合：將授權更新為 MIT、移除 requirements.txt，並實作 HtmlTextParser 以進行 HTML 轉 Markdown 轉換。相應更新相依項目與測試。 ([#20262](https://github.com/run-llama/llama_index/pull/20262))

### llama-index-readers-docling \[0.4.2]

- 放寬 docling Python 限制 ([#20322](https://github.com/run-llama/llama_index/pull/20322))

### llama-index-readers-file \[0.5.5]

- feat: 將 pypdf 更新至最新版本 ([#20285](https://github.com/run-llama/llama_index/pull/20285))

### llama-index-readers-reddit \[0.4.1]

- 修正 Reddit 整合之 README.md 中的錯字 ([#20283](https://github.com/run-llama/llama_index/pull/20283))

### llama-index-storage-chat-store-postgres \[0.3.2]

- \[FIX] Postgres ChatStore 自動在資料表名稱前加上 “data\_” 前綴 ([#20241](https://github.com/run-llama/llama_index/pull/20241))

### llama-index-vector-stores-azureaisearch \[0.4.4]

- `vector-azureaisearch`：在將使用者 agent 新增至 azure client 之前，先檢查其是否已存在於 policy 中 ([#20243](https://github.com/run-llama/llama_index/pull/20243))
- fix(azureaisearch)：新增 close/aclose 方法以修正未關閉 client session 的警告 ([#20309](https://github.com/run-llama/llama_index/pull/20309))

### llama-index-vector-stores-milvus \[0.9.4]

- 修正 milvus 的 consistency level 參數 ([#20268](https://github.com/run-llama/llama_index/pull/20268))

### llama-index-vector-stores-postgres \[0.7.2]

- 修正 postgresql dispose ([#20312](https://github.com/run-llama/llama_index/pull/20312))

### llama-index-vector-stores-qdrant \[0.9.0]

- fix: 更新 qdrant-client 版本限制 ([#20280](https://github.com/run-llama/llama_index/pull/20280))
- Feat: 將 Qdrant client 更新至 1.16.0 ([#20287](https://github.com/run-llama/llama_index/pull/20287))

### llama-index-vector-stores-vertexaivectorsearch \[0.3.2]

- fix: 更新 batch\_update\_index 中的 blob 路徑 ([#20281](https://github.com/run-llama/llama_index/pull/20281))

### llama-index-voice-agents-openai \[0.2.2]

- 微小修正 ([#20252](https://github.com/run-llama/llama_index/pull/20252))

## \[2025-11-10]

### llama-index-core \[0.14.8]

- 修正當 “Answer:” 包含 “Action:” 時，ReActOutputParser 會卡住的問題 ([#20098](https://github.com/run-llama/llama_index/pull/20098))
- 為 image、audio、video 及 document 區塊新增 buffer ([#20153](https://github.com/run-llama/llama_index/pull/20153))
- fix(agent)：在 ReActAgent 中處理多區塊 ChatMessage ([#20196](https://github.com/run-llama/llama_index/pull/20196))
- 修正/20209 ([#20214](https://github.com/run-llama/llama_index/pull/20214))
- 在 ToolOutput 中保留 Exception ([#20231](https://github.com/run-llama/llama_index/pull/20231))
- 修正異常的 pydantic 警告 ([#20235](https://github.com/run-llama/llama_index/pull/20235))

### llama-index-embeddings-nvidia \[0.4.2]

- docs: 編輯校對並更新範例模型 ([#20198](https://github.com/run-llama/llama_index/pull/20198))

### llama-index-embeddings-ollama \[0.8.4]

- 新增測試案例（無程式碼變更），用於透過實際連接至 Ollama 伺服器（在確認 ollama 伺服器存在後）來檢查 embedding ([#20230](https://github.com/run-llama/llama_index/pull/20230))

### llama-index-llms-anthropic \[0.10.2]

- feat(llms/anthropic)：在 streaming 中新增對 RawMessageDeltaEvent 的支援 ([#20206](https://github.com/run-llama/llama_index/pull/20206))
- chore: 移除不支援的模型 ([#20211](https://github.com/run-llama/llama_index/pull/20211))

### llama-index-llms-bedrock-converse \[0.11.1]

- feat: 將 bedrock converse 與 tool call 區塊整合 ([#20099](https://github.com/run-llama/llama_index/pull/20099))
- feat: 更新模型名稱提取邏輯，以包含 ‘jp’ 區域前綴及其他內容 ([#20233](https://github.com/run-llama/llama_index/pull/20233))

### llama-index-llms-google-genai \[0.7.3]

- feat: google genai 與 tool 區塊整合 ([#20096](https://github.com/run-llama/llama_index/pull/20096))
- fix: 非 streaming 的 gemini tool calling ([#20207](https://github.com/run-llama/llama_index/pull/20207))
- 在 GoogleGenAI chat 的 additional\_kwargs 中新增 token 使用量資訊 ([#20219](https://github.com/run-llama/llama_index/pull/20219))
- 修正 google genai stream\_complete 的 bug ([#20220](https://github.com/run-llama/llama_index/pull/20220))

### llama-index-llms-nvidia \[0.4.4]

- docs: 編輯校對並更新程式碼範例 ([#20200](https://github.com/run-llama/llama_index/pull/20200))

### llama-index-llms-openai \[0.6.8]

- FixV2：將 OpenAI 的 DocumentBlock 類型從 ‘input\_file’ 修正為 ‘file’ ([#20203](https://github.com/run-llama/llama_index/pull/20203))
- OpenAI v2 sdk 支援 ([#20234](https://github.com/run-llama/llama_index/pull/20234))

### llama-index-llms-upstage \[0.6.5]

- 支援 OpenAI v2 sdk ([#20234](https://github.com/run-llama/llama_index/pull/20234))

### llama-index-packs-streamlit-chatbot \[0.5.2]

- 支援 OpenAI v2 sdk ([#20234](https://github.com/run-llama/llama_index/pull/20234))

### llama-index-packs-voyage-query-engine \[0.5.2]

- 支援 OpenAI v2 sdk ([#20234](https://github.com/run-llama/llama_index/pull/20234))

### llama-index-postprocessor-nvidia-rerank \[0.5.1]

- docs: 編輯 pass ([#20199](https://github.com/run-llama/llama_index/pull/20199))

### llama-index-readers-web \[0.5.6]

- feat: 新增 ScrapyWebReader 整合 ([#20212](https://github.com/run-llama/llama_index/pull/20212))
- 將 Scrapy 依賴版本更新至 2.13.3 ([#20228](https://github.com/run-llama/llama_index/pull/20228))

### llama-index-readers-whisper \[0.3.0]

- 支援 OpenAI v2 sdk ([#20234](https://github.com/run-llama/llama_index/pull/20234))

### llama-index-storage-kvstore-postgres \[0.4.3]

- fix: 確保僅在 schema 不存在時才進行建立 ([#20225](https://github.com/run-llama/llama_index/pull/20225))

### llama-index-tools-brightdata \[0.2.1]

- docs: 新增 api 金鑰申請說明 ([#20204](https://github.com/run-llama/llama_index/pull/20204))

### llama-index-tools-mcp \[0.4.3]

- 為 issue 19211 新增測試案例。無程式碼變更 ([#20201](https://github.com/run-llama/llama_index/pull/20201))

### llama-index-utils-oracleai \[0.3.1]

- 將 llama-index-core 依賴版本更新至 0.12.45 ([#20227](https://github.com/run-llama/llama_index/pull/20227))

### llama-index-vector-stores-lancedb \[0.4.2]

- fix: 修復每次 LanceDB 查詢都會重新建立 FTS index 的 bug ([#20213](https://github.com/run-llama/llama_index/pull/20213))

## \[2025-10-30]

### llama-index-core \[0.14.7]

- Feat/serpex tool 整合 ([#20141](https://github.com/run-llama/llama_index/pull/20141))
- 修復關於設定 LLM 的過時錯誤訊息 ([#20157](https://github.com/run-llama/llama_index/pull/20157))
- 修復部分近期失敗的測試 ([#20165](https://github.com/run-llama/llama_index/pull/20165))
- fix: 將 lock 更新至最新 workflow 並修復相關問題 ([#20173](https://github.com/run-llama/llama_index/pull/20173))
- fix: 確保 FunctionTool 使用完整的 docstring ([#20175](https://github.com/run-llama/llama_index/pull/20175))
- fix api 文件建置 ([#20180](https://github.com/run-llama/llama_index/pull/20180))

### llama-index-embeddings-voyageai \[0.5.0]

- 更新 VoyageAI 整合 ([#20073](https://github.com/run-llama/llama_index/pull/20073))

### llama-index-llms-anthropic \[0.10.0]

- feat: 將 anthropic 與 tool call block 整合 ([#20100](https://github.com/run-llama/llama_index/pull/20100))

### llama-index-llms-bedrock-converse \[0.10.7]

- feat: 新增對 Bedrock Guardrails streamProcessingMode 的支援 ([#20150](https://github.com/run-llama/llama_index/pull/20150))
- bedrock 結構化輸出可選 force ([#20158](https://github.com/run-llama/llama_index/pull/20158))

### llama-index-llms-fireworks \[0.4.5]

- 更新 FireworksAI 模型 ([#20169](https://github.com/run-llama/llama_index/pull/20169))

### llama-index-llms-mistralai \[0.9.0]

- feat: mistralai 與 tool call block 整合 ([#20103](https://github.com/run-llama/llama_index/pull/20103))

### llama-index-llms-ollama \[0.9.0]

- feat: 將 ollama 與 tool call block 整合 ([#20097](https://github.com/run-llama/llama_index/pull/20097))

### llama-index-llms-openai \[0.6.6]

- 允許設定 gpt-5-chat 的 temp ([#20156](https://github.com/run-llama/llama_index/pull/20156))

### llama-index-readers-confluence \[0.5.0]

- feat(confluence): 將 SVG 處理設為可選，以修復 pycairo 安裝問題… ([#20115](https://github.com/run-llama/llama_index/pull/20115))

### llama-index-readers-github \[0.9.0]

- 新增 GitHub App 驗證支援 ([#20106](https://github.com/run-llama/llama_index/pull/20106))

### llama-index-retrievers-bedrock \[0.5.1]

- 修復部分近期失敗的測試 ([#20165](https://github.com/run-llama/llama_index/pull/20165))

### llama-index-tools-serpex \[0.1.0]

- Feat/serpex tool 整合 ([#20141](https://github.com/run-llama/llama_index/pull/20141))
- 新增缺失的 toml 資訊 ([#20186](https://github.com/run-llama/llama_index/pull/20186))

### llama-index-vector-stores-couchbase \[0.6.0]

- 為 Couchbase vector-store 新增 Hyperscale 與 Composite Vector Indexes 支援 ([#20170](https://github.com/run-llama/llama_index/pull/20170))

## \[2025-10-26]

### llama-index-core \[0.14.6]

- 為非串流模式新增 allow\_parallel\_tool\_calls ([#20117](https://github.com/run-llama/llama_index/pull/20117))
- 修復欄位特定 metadata 的錯誤使用 ([#20122](https://github.com/run-llama/llama_index/pull/20122))
- 更新 SemanticSplitterNodeParser 的文件 ([#20125](https://github.com/run-llama/llama_index/pull/20125))
- 修復句子分割大於 chunk size 的罕見情況 ([#20147](https://github.com/run-llama/llama_index/pull/20147))

### llama-index-embeddings-bedrock \[0.7.0]

- 修復 BedrockEmbedding 以支援 Cohere v4 回應格式 ([#20094](https://github.com/run-llama/llama_index/pull/20094))

### llama-index-embeddings-isaacus \[0.1.0]

- feat: Isaacus embeddings 整合 ([#20124](https://github.com/run-llama/llama_index/pull/20124))

### llama-index-embeddings-oci-genai \[0.4.2]

- 更新 OCI GenAI cohere 模型 ([#20146](https://github.com/run-llama/llama_index/pull/20146))

### llama-index-llms-anthropic \[0.9.7]

- 修復 anthropic llm 中的重複 token stream 問題 ([#20108](https://github.com/run-llama/llama_index/pull/20108))
- 確保 anthropic content delta 僅包含面向使用者的回應 ([#20113](https://github.com/run-llama/llama_index/pull/20113))

### llama-index-llms-baseten \[0.1.7]

- 新增 GLM ([#20121](https://github.com/run-llama/llama_index/pull/20121))

### llama-index-llms-helicone \[0.1.0]

- 將 helicone 整合至 llama-index ([#20131](https://github.com/run-llama/llama_index/pull/20131))

### llama-index-llms-oci-genai \[0.6.4]

- 更新 OCI GenAI cohere 模型 ([#20146](https://github.com/run-llama/llama_index/pull/20146))

### llama-index-llms-openai \[0.6.5]

- chore: openai 版本更新 ([#20095](https://github.com/run-llama/llama_index/pull/20095))

### llama-index-readers-imdb-review \[0.4.2]

- chore: 更新 imdb-review reader 中的 selenium 依賴 ([#20105](https://github.com/run-llama/llama_index/pull/20105))

### llama-index-retrievers-bedrock \[0.5.0]

- feat(bedrock): 為 AmazonKnowledgeBasesRetriever 新增 async 支援 ([#20114](https://github.com/run-llama/llama_index/pull/20114))

### llama-index-retrievers-superlinked \[0.1.3]

- 更新 README.md ([#19829](https://github.com/run-llama/llama_index/pull/19829))

### llama-index-storage-kvstore-postgres \[0.4.2]

- fix: 在 PostgresKVStore 中將原始 SQL 字串插值替換為正確的 SQLAlchemy 參數化 API ([#20104](https://github.com/run-llama/llama_index/pull/20104))

### llama-index-tools-mcp \[0.4.3]

- 修復 BasicMCPClient resource signatures ([#20118](https://github.com/run-llama/llama_index/pull/20118))

### llama-index-vector-stores-postgres \[0.7.1]

- 在 PostgreSQL 向量儲存中為文字陣列 metadata 新增 GIN index 支援 ([#20130](https://github.com/run-llama/llama_index/pull/20130))

## \[2025-10-15]

### llama-index-core \[0.14.5]

- 移除 debug print ([#20000](https://github.com/run-llama/llama_index/pull/20000))
- 在 Docstore 中安全地初始化 RefDocInfo ([#20031](https://github.com/run-llama/llama_index/pull/20031))
- 為多處理程序載入新增進度條 ([#20048](https://github.com/run-llama/llama_index/pull/20048))
- 修復當相同文字在 document 中多次出現時，node 位置重複的問題 ([#20050](https://github.com/run-llama/llama_index/pull/20050))
- chore: tool call block - 第一部分 ([#20074](https://github.com/run-llama/llama_index/pull/20074))

### llama-index-instrumentation \[0.4.2]

- 更新 instrumentation 套件元數據 ([#20079](https://github.com/run-llama/llama_index/pull/20079))

### llama-index-llms-anthropic \[0.9.5]

- ✨ feat(anthropic): 新增 prompt caching 模型驗證工具 ([#20069](https://github.com/run-llama/llama_index/pull/20069))
- 修復使用 anthropic 進行 streaming thinking/tool calling 的問題 ([#20077](https://github.com/run-llama/llama_index/pull/20077))
- 新增 haiku 4.5 支援 ([#20092](https://github.com/run-llama/llama_index/pull/20092))

### llama-index-llms-baseten \[0.1.6]

- Baseten provider Kimi K2 0711, Llama 4 Maverick 與 Llama 4 Scout Model API 棄用 ([#20042](https://github.com/run-llama/llama_index/pull/20042))

### llama-index-llms-bedrock-converse \[0.10.5]

- feat: 將 Claude Sonnet 4.5 列為 reasoning 模型 ([#20022](https://github.com/run-llama/llama_index/pull/20022))
- feat: 支援全域跨區域推論設定檔前綴 ([#20064](https://github.com/run-llama/llama_index/pull/20064))
- 為 opus 4.1 更新 utils.py ([#20076](https://github.com/run-llama/llama_index/pull/20076))
- 修復 4.1 opus bedrockconverse 在 functioncalling 模型中缺失的問題 ([#20084](https://github.com/run-llama/llama_index/pull/20084))
- 新增 haiku 4.5 支援 ([#20092](https://github.com/run-llama/llama_index/pull/20092))

### llama-index-llms-fireworks \[0.4.4]

- 在 Fireworks LLM 中新增對自定義模型的支援 ([#20023](https://github.com/run-llama/llama_index/pull/20023))
- fix(llms/fireworks): 修復無法使用 Fireworks Deepseek V3.1-20006 的問題 ([#20028](https://github.com/run-llama/llama_index/pull/20028))

### llama-index-llms-oci-genai \[0.6.3]

- 在 OCI GenAI 中新增對 xAI 模型的支援 ([#20089](https://github.com/run-llama/llama_index/pull/20089))

### llama-index-llms-openai \[0.6.4]

- 新增 Gpt 5 pro ([#20029](https://github.com/run-llama/llama_index/pull/20029))
- 修復使用 openai responses streaming 收集最終回應的問題 ([#20037](https://github.com/run-llama/llama_index/pull/20037))
- 在 utils.py (JSON\_SCHEMA\_MODELS) 中新增對 GPT-5 模型的支援 ([#20045](https://github.com/run-llama/llama_index/pull/20045))- chore: tool call block - part 1 ([#20074](https://github.com/run-llama/llama_index/pull/20074))

### llama-index-llms-sglang \[0.1.0]

- 新增 Sglang llm 整合 ([#20020](https://github.com/run-llama/llama_index/pull/20020))

### llama-index-readers-gitlab \[0.5.1]

- feat(gitlab): 為 repository tree 與 issues 新增分頁參數 ([#20052](https://github.com/run-llama/llama_index/pull/20052))

### llama-index-readers-json \[0.4.2]

- 更新 JSON reader ([#20039](https://github.com/run-llama/llama_index/pull/20039))

### llama-index-readers-web \[0.5.5]

- fix: 修復 ScrapflyReader Pydantic 驗證錯誤 ([#19999](https://github.com/run-llama/llama_index/pull/19999))

### llama-index-storage-chat-store-dynamodb \[0.4.2]

- 更新 dynamodb chat store 依賴項目 ([#20078](https://github.com/run-llama/llama_index/pull/20078))

### llama-index-tools-mcp \[0.4.2]

- 🐛 fix(tools/mcp): 修復 dict 類型處理與參考解析 ([#20082](https://github.com/run-llama/llama_index/pull/20082))

### llama-index-tools-signnow \[0.1.0]

- feat(signnow): 整合 SignNow mcp 工具 ([#20057](https://github.com/run-llama/llama_index/pull/20057))

### llama-index-tools-tavily-research \[0.4.2]

- feat: 新增 Tavily extract 函式以進行 URL 內容擷取 ([#20038](https://github.com/run-llama/llama_index/pull/20038))

### llama-index-vector-stores-azurepostgresql \[0.2.0]

- 為 Azure PostgreSQL 整合新增混合搜尋 ([#20027](https://github.com/run-llama/llama_index/pull/20027))

### llama-index-vector-stores-milvus \[0.9.3]

- fix: Milvus get\_field\_kwargs() ([#20086](https://github.com/run-llama/llama_index/pull/20086))

### llama-index-vector-stores-opensearch \[0.6.2]

- fix(opensearch): 修正高效能篩選的版本檢查 ([#20067](https://github.com/run-llama/llama_index/pull/20067))

### llama-index-vector-stores-qdrant \[0.8.6]

- fix(qdrant): 允許在混合搜尋中使用僅限非同步的初始化 ([#20005](https://github.com/run-llama/llama_index/pull/20005))

## \[2025-10-03]

### llama-index-core \[0.14.4]

- 修復 pre-release 安裝問題 ([#20010](https://github.com/run-llama/llama_index/pull/20010))

### llama-index-embeddings-anyscale \[0.4.2]

- 修復 openai 的 llm 依賴項目 ([#19944](https://github.com/run-llama/llama_index/pull/19944))

### llama-index-embeddings-baseten \[0.1.2]

- 修復 openai 的 llm 依賴項目 ([#19944](https://github.com/run-llama/llama_index/pull/19944))

### llama-index-embeddings-fireworks \[0.4.2]

- 修復 openai 的 llm 依賴項目 ([#19944](https://github.com/run-llama/llama_index/pull/19944))

### llama-index-embeddings-opea \[0.2.2]

- 修復 openai 的 llm 依賴項目 ([#19944](https://github.com/run-llama/llama_index/pull/19944))

### llama-index-embeddings-text-embeddings-inference \[0.4.2]

- 修復 text embeddings inference 中的 authorization header 設定邏輯 ([#19979](https://github.com/run-llama/llama_index/pull/19979))

### llama-index-llms-anthropic \[0.9.3]

- feat: 新增 anthropic sonnet 4.5 ([#19977](https://github.com/run-llama/llama_index/pull/19977))

### llama-index-llms-anyscale \[0.4.2]

- 修復 openai 的 llm 依賴項目 ([#19944](https://github.com/run-llama/llama_index/pull/19944))

### llama-index-llms-azure-openai \[0.4.2]

- 修復 openai 的 llm 依賴項目 ([#19944](https://github.com/run-llama/llama_index/pull/19944))

### llama-index-llms-baseten \[0.1.5]

- 修復 openai 的 llm 依賴項目 ([#19944](https://github.com/run-llama/llama_index/pull/19944))

### llama-index-llms-bedrock-converse \[0.9.5]

- feat: 增加對 Claude Sonnet 4.5 的支援 ([#19980](https://github.com/run-llama/llama_index/pull/19980))

### llama-index-llms-deepinfra \[0.5.2]

- 修復 openai 的 llm 依賴項目 ([#19944](https://github.com/run-llama/llama_index/pull/19944))

### llama-index-llms-everlyai \[0.4.2]

- 修復 openai 的 llm 依賴項目 ([#19944](https://github.com/run-llama/llama_index/pull/19944))

### llama-index-llms-fireworks \[0.4.2]

- 修復 openai 的 llm 依賴項目 ([#19944](https://github.com/run-llama/llama_index/pull/19944))

### llama-index-llms-google-genai \[0.6.2]

- 修復 ValueError: ChatMessage contains multiple blocks, use ‘ChatMe… ([#19954](https://github.com/run-llama/llama_index/pull/19954))

### llama-index-llms-keywordsai \[1.1.2]

- 修復 openai 的 llm 依賴項目 ([#19944](https://github.com/run-llama/llama_index/pull/19944))

### llama-index-llms-localai \[0.5.2]

- 修復 openai 的 llm 依賴項目 ([#19944](https://github.com/run-llama/llama_index/pull/19944))

### llama-index-llms-mistralai \[0.8.2]

- 更新 MistralAI LLMs 列表 ([#19981](https://github.com/run-llama/llama_index/pull/19981))

### llama-index-llms-monsterapi \[0.4.2]

- 修正 openai 的 llm 依賴 ([#19944](https://github.com/run-llama/llama_index/pull/19944))

### llama-index-llms-nvidia \[0.4.4]

- 修正 openai 的 llm 依賴 ([#19944](https://github.com/run-llama/llama_index/pull/19944))

### llama-index-llms-ollama \[0.7.4]

- 修正 Ollama 中使用 tools 的 stream chat `TypeError: unhashable type: 'dict'` ([#19938](https://github.com/run-llama/llama_index/pull/19938))

### llama-index-llms-openai \[0.6.1]

- feat(OpenAILike): 支援 structured outputs ([#19967](https://github.com/run-llama/llama_index/pull/19967))

### llama-index-llms-openai-like \[0.5.3]

- feat(OpenAILike): 支援 structured outputs ([#19967](https://github.com/run-llama/llama_index/pull/19967))

### llama-index-llms-openrouter \[0.4.2]

- chore(openrouter,anthropic): 新增 py.typed ([#19966](https://github.com/run-llama/llama_index/pull/19966))

### llama-index-llms-perplexity \[0.4.2]

- 修正 openai 的 llm 依賴 ([#19944](https://github.com/run-llama/llama_index/pull/19944))

### llama-index-llms-portkey \[0.4.2]

- 修正 openai 的 llm 依賴 ([#19944](https://github.com/run-llama/llama_index/pull/19944))

### llama-index-llms-sarvam \[0.2.1]

- 修正 Sarvam 整合與拼字錯誤 (Fixes #19931) ([#19932](https://github.com/run-llama/llama_index/pull/19932))

### llama-index-llms-upstage \[0.6.4]

- 修正 openai 的 llm 依賴 ([#19944](https://github.com/run-llama/llama_index/pull/19944))

### llama-index-llms-yi \[0.4.2]

- 修正 openai 的 llm 依賴 ([#19944](https://github.com/run-llama/llama_index/pull/19944))

### llama-index-memory-bedrock-agentcore \[0.1.0]

- feat: Bedrock AgentCore Memory 整合 ([#19953](https://github.com/run-llama/llama_index/pull/19953))

### llama-index-multi-modal-llms-openai \[0.6.2]

- 修正 openai 的 llm 依賴 ([#19944](https://github.com/run-llama/llama_index/pull/19944))

### llama-index-readers-confluence \[0.4.4]

- Fix: 在 ConfluenceR… 擷取子頁面時遵循 cloud 參數 ([#19983](https://github.com/run-llama/llama_index/pull/19983))

### llama-index-readers-service-now \[0.2.2]

- Bug Fix: 無法擷取最新內容為空或 null 的頁面 ([#19916](https://github.com/run-llama/llama_index/pull/19916))

### llama-index-selectors-notdiamond \[0.4.0]

- 修正 openai 的 llm 依賴 ([#19944](https://github.com/run-llama/llama_index/pull/19944))

### llama-index-tools-agentql \[1.2.0]

- 修正 openai 的 llm 依賴 ([#19944](https://github.com/run-llama/llama_index/pull/19944))

### llama-index-tools-playwright \[0.3.1]

- chore: 修正 playwright 測試 ([#19946](https://github.com/run-llama/llama_index/pull/19946))

### llama-index-tools-scrapegraph \[0.2.2]

- feat: 更新 scrapegraphai ([#19974](https://github.com/run-llama/llama_index/pull/19974))

### llama-index-vector-stores-chroma \[0.5.3]

- docs: 修正 ChromaVectorStore 中的 query method docstring Fixes #19969 ([#19973](https://github.com/run-llama/llama_index/pull/19973))

### llama-index-vector-stores-mongodb \[0.8.1]

- 修正 openai 的 llm 依賴 ([#19944](https://github.com/run-llama/llama_index/pull/19944))

### llama-index-vector-stores-postgres \[0.7.0]

- 修正 postgres vector store 的 index 建立 ([#19955](https://github.com/run-llama/llama_index/pull/19955))

### llama-index-vector-stores-solr \[0.1.0]

- 新增 ApacheSolrVectorStore 整合 ([#19933](https://github.com/run-llama/llama_index/pull/19933))

## \[2025-09-24]

### llama-index-core \[0.14.3]

- 修正 Gemini thought signature 序列化 ([#19891](https://github.com/run-llama/llama_index/pull/19891))
- 在 content blocks 中新增 ThinkingBlock ([#19919](https://github.com/run-llama/llama_index/pull/19919))

### llama-index-llms-anthropic \[0.9.0]

- 在 content blocks 中新增 ThinkingBlock ([#19919](https://github.com/run-llama/llama_index/pull/19919))

### llama-index-llms-baseten \[0.1.4]

- 新增 kimik2 0905 並重新排列驗證列表 ([#19892](https://github.com/run-llama/llama_index/pull/19892))
- Baseten Dynamic Model APIs 驗證 ([#19893](https://github.com/run-llama/llama_index/pull/19893))

### llama-index-llms-google-genai \[0.6.0]

- 為 documents 新增缺失的 FileAPI 支援 ([#19897](https://github.com/run-llama/llama_index/pull/19897))
- 在 content blocks 中新增 ThinkingBlock ([#19919](https://github.com/run-llama/llama_index/pull/19919))

### llama-index-llms-mistralai \[0.8.0]

- 在 content blocks 中新增 ThinkingBlock ([#19919](https://github.com/run-llama/llama_index/pull/19919))

### llama-index-llms-openai \[0.6.0]

- 在內容區塊中新增 ThinkingBlock ([#19919](https://github.com/run-llama/llama_index/pull/19919))

### llama-index-protocols-ag-ui \[0.2.2]

- 改善 AG-UI 的 state snapshotting 運作方式 ([#19934](https://github.com/run-llama/llama_index/pull/19934))

### llama-index-readers-mongodb \[0.5.0]

- 使用 PyMongo Asynchronous API 取代 Motor ([#19875](https://github.com/run-llama/llama_index/pull/19875))

### llama-index-readers-paddle-ocr \[0.1.0]

- \[新套件] 新增 PaddleOCR Reader 以從 PDF 影像中提取文字 ([#19827](https://github.com/run-llama/llama_index/pull/19827))

### llama-index-readers-web \[0.5.4]

- feat(readers/web-firecrawl): 遷移至 Firecrawl v2 SDK ([#19773](https://github.com/run-llama/llama_index/pull/19773))

### llama-index-storage-chat-store-mongo \[0.3.0]

- 使用 PyMongo Asynchronous API 取代 Motor ([#19875](https://github.com/run-llama/llama_index/pull/19875))

### llama-index-storage-kvstore-mongodb \[0.5.0]

- 使用 PyMongo Asynchronous API 取代 Motor ([#19875](https://github.com/run-llama/llama_index/pull/19875))

### llama-index-tools-valyu \[0.5.0]

- 新增 Valyu Extractor 與 Fast 模式 ([#19915](https://github.com/run-llama/llama_index/pull/19915))

### llama-index-vector-stores-azureaisearch \[0.4.2]

- 修復 llama index vector stores azureaisearch 相關問題 ([#19800](https://github.com/run-llama/llama_index/pull/19800))

### llama-index-vector-stores-azurepostgresql \[0.1.0]

- 新增對 Azure PostgreSQL 的支援 ([#19709](https://github.com/run-llama/llama_index/pull/19709))

### llama-index-vector-stores-qdrant \[0.8.5]

- 為舊版 sparse vectors 新增適當的相容性 ([#19882](https://github.com/run-llama/llama_index/pull/19882))

### llama-index-vector-stores-singlestoredb \[0.4.2]

- 修復 SingleStore Db 的 SQLi 漏洞 ([#19914](https://github.com/run-llama/llama_index/pull/19914))

## \[2025-09-15]

### `llama-index-core` \[0.14.2]

- fix: 處理 ImageBlock 中的 data urls (#19856)
- fix: 將 IngestionPipeline docstore document 的寫入移至 transformations 之後 (#19849)
- fix: 更新 IngestionPipeline async document 的寫入方式 (#19868)
- chore: 從程式碼中移除 workflows 的 stepwise 用法 (#19877)

### `llama-index-embeddings-fastembed` \[0.5.0]

- feat: 使 fastembed 的 cpu 或 gpu 選項變為可選 (#19878)

### `llama-index-llms-deepseek` \[0.2.2]

- feat: 在 deepseek llm 中將 context\_window 傳遞給 super (#19876)

### `llama-index-llms-google-genai` \[0.5.0]

- feat: 為大檔案新增 GoogleGenAI FileAPI 支援 (#19853)

### `llama-index-readers-solr` \[0.1.0]

- feat: 新增 Solr reader 整合 (#19843)

### `llama-index-retrievers-alletra-x10000-retriever` \[0.1.0]

- feat: 新增 AlletraX10000Retriever 整合 (#19798)

### `llama-index-vector-stores-oracledb` \[0.3.2]

- feat: OraLlamaVS Connection Pool 支援 + Filtering (#19412)

### `llama-index-vector-stores-postgres` \[0.6.8]

- feat: 為 PGVectorStore 新增 `customize_query_fn` (#19847)

## \[2025-09-14]

### `llama-index-core` \[0.14.1]

- feat: 為 RetrieverQueryEngine 新增 verbose 選項以提供詳細輸出 (#19807)
- feat: 為 `aget_text_embedding_batch` 方法新增對額外 kwargs 的支援 (#19808)
- feat: 為 AgentStream 事件新增 `thinking_delta` 欄位以揭露 llm 推理過程 (#19785)
- fix: 修復 agent streaming thinking delta pydantic 驗證的 Bug (#19828)
- fix: 在 tool calling 中同時處理 positional args 與 kwargs (#19822)

### `llama-index-instrumentation` \[0.4.1]

- feat: 新增 sync event/handler 支援 (#19825)

### `llama-index-llms-google-genai` \[0.4.0]

- feat: 新增 VideoBlock 與 GoogleGenAI 影片輸入支援 (#19823)

### `llama-index-llms-ollama` \[0.7.3]

- fix: 修復使用 Ollama 搭配 Agents 且最終訊息中 tool\_calls 為 None 時的 Bug (#19844)

### `llama-index-llms-vertex` \[0.6.1]

- fix: 統一 complete/acomplete 的回應格式 (#19806)

### `llama-index-readers-confluence` \[0.4.3]

- chore: 提升 atlassian-python-api 的版本限制以包含 4.x (#19824)

### `llama-index-readers-github` \[0.6.2]

- fix: 使 url 變為可選 (#19851)

### `llama-index-readers-web` \[0.5.3]

- feat: 新增 OlostepWebReader 整合 (#19821)

### `llama-index-tools-google` \[0.6.2]

- feat: 為 GoogleCalendarToolSpec 新增可選的 creds 參數 (#19826)

### `llama-index-vector-stores-vectorx` \[0.1.0]

- feat: 新增 vectorx vectorstore (#19758)

## \[2025-09-08]

**注意：** 所有套件均已更新以相容最新的 llama-index-core 版本。

### `llama-index-core` \[0.14.0]

- breaking: 將 `llama-index-workflows` 依賴版本提升至 2.0- 避免將錯誤封裝在 WorkflowRuntimeError 中，以提升 stacktraces 的清晰度
- 移除已棄用的 checkpointer 功能
- 移除已棄用的 sub-workflows 功能
- 從 Workflow 類別中移除已棄用的 `send_event` 方法（該方法仍存在於 Context 類別中）
- 從 Workflow 類別中移除已棄用的 `stream_events()` 方法（該方法仍存在於 Context 類別中）
- 移除對 stepwise execution 的棄用支援

### `llama-index-llms-openai` \[0.5.6]

- feat: 在 openai chat completions 中新增對 document blocks 的支援 (#19809)

## \[2025-09-06]

### `llama-index-core` \[0.13.6]

- chore: 從 core utils 函式中移除 openai selector (#19803)

### `llama-index-llms-cometapi` \[0.1.0]

- feat: 新增 CometAPI LLM 整合 (#19793)

## \[2025-09-04]

### `llama-index-core` \[0.13.5]

- feat: 在 AgentStream events 中新增 thinking delta 欄位，以公開 LLM 回應 (#19785)
- fix: 修正 SimpleDirectoryReader 中的路徑處理以及 PDFReader 路徑修正 (#19794)

### `llama-index-llms-bedrock-converse` \[0.9.0]

- feat: 為 BedrockConverse 新增 system prompt 和 tool caching 設定的 kwargs (#19737)

### `llama-index-llms-litellm` \[0.6.2]

- fix: 使用 UUID fallback 處理缺失的 tool call ID (#19789)
- fix: 修正關鍵的 context window 計算 (#19787)

### `llama-index-readers-file` \[0.5.3]

- fix: 修正 SimpleDirectoryReader 中的路徑處理以及 PDFReader 路徑修正 (#19794)

### `llama-index-storage-chat-store-yugabytedb` \[0.1.0]

- feat: 新增 Yugabytedb chat store (#19768)

### `llama-index-vector-stores-milvus` \[0.9.1]

- fix: 若未設定 ‘\_node\_content’ 則建立 TextNode (#19772)

### `llama-index-vector-stores-postgres` \[0.6.5]

- fix: 使 postgres regex 標點符號處理與 plainto\_tsquery 一致 (#19781)

## \[2025-09-01]

### `llama-index-core` \[0.13.4]

- feat: 為 Memory 和 SQLAlchemyChatStore 新增 PostgreSQL schema 支援 (#19741)
- feat: 在 memory 中新增缺失的 put\_messages 同步封裝 (#19746)
- feat: 為 FunctionAgent 新增初始 tool choice 選項 (#19738)
- fix: 修正使用 QueryBundle（而非字串）呼叫 ContextChatEngine 的問題 (#19714)

### `llama-index-embeddings-baseten` \[0.1.0]

- feat: baseten 整合 (#19710)

### `llama-index-embeddings-ibm` \[0.5.0]

- feat: 支援額外/外部 URL，將 instance\_id 設為棄用 (#19749)

### `llama-index-llms-baseten` \[0.1.0]

- feat: baseten 整合 (#19710)

### `llama-index-llms-bedrock-converse` \[0.8.3]

- feat: 將 `amazon.nova-premier-v1:0` 新增至 BEDROCK\_MODELS (#19728)

### `llama-index-llms-ibm` \[0.6.0]

- feat: 支援額外/外部 URL，將 instance\_id 設為棄用 (#19749)

### `llama-index-postprocessor-ibm` \[0.3.0]

- feat: 支援額外/外部 URL，將 instance\_id 設為棄用 (#19749)

### `llama-index-postprocessor-sbert-rerank` \[0.4.1]

- fix: 修正 SentenceTransformerRerank init device (#19756)

### `llama-index-readers-google` \[0.7.1]

- feat: 拋出 google drive 錯誤 (#19752)

### `llama-index-readers-web` \[0.5.1]

- feat: 新增 ZenRows web reader (#19699)

### `llama-index-vector-stores-chroma` \[0.5.2]

- feat: 為 chroma 新增 mmr search (#19731)

### `llama-index-vector-stores-postgres` \[0.6.4]

- fix: 刪除時使用索引化的 metadata 欄位 ‘ref\_doc\_id’ 而非 ‘doc\_id’ (#19759)

### `llama-index-vector-stores-qdrant` \[0.8.2]

feat: 為 QdrantVectorStore 新增 Payload indexes 支援 (#19743)

## \[2025-08-22]

### `llama-index-core` \[0.13.3]

- fix: 為 image `.get()` 請求新增 timeout (#19723)
- fix: 修正 StreamingAgentChatResponse 遺失訊息的 bug (#19674)
- fix: 修正從空的 vector store index 檢索時崩潰的問題 (#19706)
- fix: 修正使用 QueryBundle（而非字串）呼叫 ContextChatEngine 的問題 (#19714)
- fix: 修正未提供圖片時 faithfulness evaluate 崩潰的問題 (#19686)

### `llama-index-embeddings-heroku` \[0.1.0]

- feat: 新增對 HerokuEmbeddings 的支援 (#19685)

### `llama-index-embeddings-ollama` \[0.8.2]

- feat: 強化 OllamaEmbedding 的 instruction 支援 (#19721)

### `llama-index-llms-anthropic` \[0.8.5]

- fix: 修正使用 CachePoint 的 prompt caching (#19711)

### `llama-index-llms-openai` \[0.5.4]

- feat: 新增 gpt-5-chat-latest 模型支援 (#19687)

### `llama-index-llms-sagemaker-endpoint` \[0.4.1]

- fix: 修正建構函式的 region 讀取，使其在 region\_name 從 kwargs 中 pop 出來之前不會被讀取，並修正對 super 的賦值 (#19705)

### `llama-index-llms-upstage` \[0.6.2]

- chore: 移除已棄用的 model (solar-pro) (#19704)

### `llama-index-readers-confluence` \[0.4.1]

- fix: 支援多個 ConfluenceReader 實例的併發使用 (#19698)

### `llama-index-vector-stores-chroma` \[0.5.1]

- fix: 修復 `get_nodes()` 在 node ids 為空時的問題 (#19711)

### `llama-index-vector-stores-qdrant` \[0.8.1]

- feat: 支援 qdrant sharding (#19652)

### `llama-index-vector-stores-tencentvectordb` \[0.4.1]

- fix: 解決 CollectionParams.filter\_fields 存取時的 AttributeError (#19695)

## \[2025-08-14]

### `llama-index-core` \[0.13.2]

- feat: 允許在 agents 中停用 streaming (#19668)
- fix: 若存在 NLTK\_DATA 環境變數，則遵循其設定值 (#19664)
- fix: 修復 `a/get_text_embedding_batch()` 中批次非快取 embeddings 的順序保留與擷取 (#19536)

### `llama-index-embeddings-ollama` \[0.8.1]

- fix: 存取 embedding 輸出 (#19635)
- fix: 使用 normalized embeddings (#19622)

### `llama-index-graph-rag-cognee` \[0.3.0]

- fix: 更新並修復 cognee 整合 (#19650)

### `llama-index-llms-anthropic` \[0.8.4]

- fix: 修復 Anthropic 在使用 tool 時 extended thinking 的錯誤 (#19642)
- chore: 將 claude 4 sonnet 的 context window 增加至 1 mln tokens (#19649)

### `llama-index-llms-bedrock-converse` \[0.8.2]

- feat: 在 BedrockConverse 中新增 openai-oss models (#19653)

### `llama-index-llms-ollama` \[0.7.1]

- fix: 修復 ollama 的 role response 偵測 (#19671)

### `llama-index-llms-openai` \[0.5.3]

- fix: AzureOpenAI streaming 的 token 使用量 (#19633)

### `llama-index-readers-file` \[0.5.1]

- feat: 強化 PowerPoint reader 的內容擷取能力 (#19478)

### `llama-index-retrievers-bm25` \[0.6.3]

- fix: 修復 bm25 的 persist+load (#19657)

### `llama-index-retrievers-superlinked` \[0.1.0]

- feat: 新增 Superlinked retriever 整合 (#19636)

### `llama-index-tools-mcp` \[0.4.0]

- feat: 在 tools 中為自定義類型與 pydantic models 提供 Handlers (#19601)

### `llama-index-vector-stores-clickhouse` \[0.6.0]

- chore: 根據 ClickHouse 新的向量搜尋功能更新 ClickHouse 整合 (#19647)

### `llama-index-vector-stores-postgres` \[0.6.3]

- fix: 在 `ts_query` 正規化中新增其他特殊字元 (#19637)

## \[2025-08-08]

### `llama-index-core` \[0.13.1]

- fix: 提高 messages 中 token 計數的安全性 (#19599)
- fix: 修復 `FunctionTool._parse_tool_output` 中的 Document 截斷問題 (#19585)
- feat: 為 ReAct agent 啟用部分格式化的 system prompt (#19598)

### `llama-index-embeddings-ollama` \[0.8.0]

- fix: ollama 使用 /embed 取代 /embeddings (#19622)

### `llama-index-embeddings-voyageai` \[0.4.1]

- feat: 新增對 voyage context embeddings 的支援 (#19590)

### `llama-index-graph-stores-kuzu` \[0.9.0]

- feat: 將 Kuzu graph store 整合更新至最新 SDK (#19603)

### `llama-index-indices-managed-llama-cloud` \[0.9.1]

- chore: 棄用 llama-index-indices-managed-llama-cloud，改用 llama-cloud-services (#19608)

### `llama-index-llms-anthropic` \[0.8.2]

- feat: 將 anthropic citation 更新為正式支援 (non-beta) (#19624)
- feat: 新增對 opus 4.1 的支援 (#19593)

### `llama-index-llms-heroku` \[0.1.0]

- feat: heroku llm 整合 (#19576)

### `llama-index-llms-nvidia` \[0.4.1]

- feat: 新增對 gpt-oss NIM 的支援 (#19618)

### `llama-index-llms-oci-genai` \[0.6.1]

- chore: 更新 OCI 整合所支援的 LLMs 列表 (#19604)

### `llama-index-llms-openai` \[0.5.2]

- fix: 修復 openai 中的 isinstance 檢查 (#19617)
- feat: 新增 gpt-5 (#19613)

### `llama-index-llms-upstage` \[0.6.1]

- fix: 修復 reasoning\_effort 參數失效的問題，並新增自定義參數 (#19619)

### `llama-index-postprocessor-presidio` \[0.5.0]

- feat: 支援 presidio entities (#19584)

### `llama-index-retrievers-bm25` \[0.6.2]

- fix: BM25 Retriever 允許 `top_k` 值大於已新增的 nodes 數量 (#19577)
- feat: 為 BM25 Retriever 新增 metadata 篩選支援並更新文件 (#19586)

### `llama-index-tools-aws-bedrock-agentcore` \[0.1.0]

- feat: Bedrock AgentCore 瀏覽器與程式碼解釋器 toolspecs (#19559)

### `llama-index-vector-stores-baiduvectordb` \[0.6.0]

- fix: 修復篩選運算子並新增 stores\_text 支援 (#19591)
- feat: 為關鍵操作新增等待邏輯 (#19587)

### `llama-index-vector-stores-postgres` \[0.6.2]

- fix: 修復 PGVectorStore 查詢中的特殊字元 bug (#19621)
- fix: 更改 ts\_query 定義以避免重複 stemming (#19581)

## \[2025-07-30]

**注意：** 所有套件已更新以支援最新版本的 llama-index-core。

### `llama-index-core` \[0.13.0]

- breaking: 移除已棄用的 agent 類別，包括 `FunctionCallingAgent`、舊版的 `ReActAgent` 實作、`AgentRunner`、所有 step workers、`StructuredAgentPlanner`、`OpenAIAgent` 等。所有使用者應遷移至新的基於 workflow 的 agents：`FunctionAgent`、`CodeActAgent`、`ReActAgent` 以及 `AgentWorkflow` (#19529)
- breaking: 移除已棄用的 `QueryPipeline` 類別及所有相關程式碼 (#19554)
- breaking: 更改預設的 `index.as_chat_engine()` 以回傳 `CondensePlusContextChatEngine`。基於 Agent 的 chat engines 已被移除（先前為預設值）。如果您需要 agent，請使用上述的 agent 類別。 (#19529)
- fix: 更新 BaseDocumentStore 以避免在結果中回傳 None (#19513)
- fix: 修復 FunctionTool 參數文件解析與 signature 變更；更新測試 (#19532)
- fix: 處理 MockLLM.stream\_complete 中的空 prompt (#19521)

### `llama-index-embeddings-mixedbreadai` \[0.5.0]

- feat: 為最新版本的 sdk 更新 mixedbread embeddings 與 rerank (#19519)

### `llama-index-instrumentation` \[0.4.0]

- fix: 讓 wrapped exceptions 向上拋出 (#19566)

### `llama-index-llms-google-genai` \[0.3.0]

- feat: 為 Gemini 新增 Thought Summaries 與 signatures (#19505)

### `llama-index-llms-nvidia` \[0.4.0]

- feat: 新增對 kimi-k2-instruct 的支援 (#19525)

### `llama-index-llms-upstage` \[0.6.0]

- feat: 新增 upstage 模型 (solar-pro2) (#19526)

### `llama-index-postprocessor-mixedbreadai-rerank` \[0.5.0]

- feat: 為最新版本的 sdk 更新 mixedbread embeddings 與 rerank (#19519)

### `llama-index-readers-github` \[0.8.0]

- feat: 強化 Github Reader 的檔案篩選與自定義處理功能 (#19543)

### `llama-index-readers-s3` \[0.5.0]

- feat: 在 S3Reader 中透過 `client_kwargs` 新增對 region\_name 的支援 (#19546)

### `llama-index-tools-valyu` \[0.4.0]

- feat: 將 Valyu sdk 更新至最新版本 (#19538)

### `llama-index-voice-agents-gemini-live` \[0.2.0]

- feat(beta): 新增 gemini live 的初步實作 (#19489)

### `llama-index-vector-stores-astradb` \[0.5.0]

- feat: astradb 新增 get nodes 與 delete nodes 支援 (#19544)

### `llama-index-vector-stores-milvus` \[0.9.0]

- feat: 在 Milvus 搜尋設定中新增指定 partition\_names 的支援 (#19555)

### `llama-index-vector-stores-s3` \[0.2.0]

- fix: 減少 S3VectorStore 的部分 metadata keys 以節省空間 (#19550)

### `llama-index-vector-stores-postgres` \[0.6.0]

- feat: 新增對 ANY/ALL postgres operators 的支援 (#19553)

## \[2025-07-22]

### `llama-index-core` \[0.12.52.post1]

- fix: 在 agents 中不要將 system prompt 寫入記憶體 (#19512)

### `llama-index-core` \[0.12.52]

- fix: 修復 async MultiModalLLMProgram 呼叫中缺失 prompt 的問題 (#19504)
- fix: 正確拋出來自 docstore 的錯誤，修復 `stores_text=True/False` 的 Vector Index Retrieval (#19501)

### `llama-index-indices-managed-bge-m3` \[0.5.0]

- feat: 優化 BGEM3Index 持久化的記憶體使用量 (#19496)

### `llama-index-readers-web` \[0.4.5]

- feat: 為 webpage readers 新增 timeout，預設為 60 秒 (#19503)

### `llama-index-tools-jira-issue` \[0.1.0]

- feat: 新增 jira issue tool spec (#19457)

### `llama-index-vector-stores-azureaisearch` \[0.3.10]

- chore: 在 AzureAISearchVectorStore 的 super init 中加入 `**kwargs` (#19500)

### `llama-index-vector-stores-neo4jvector` \[0.4.1]

- fix: 修復 Neo4jVector Call 版本 (#19498)

## \[2025-07-21]

### `llama-index-core` \[0.12.51]

- feat: 強化 FunctionTool，在 function 使用 pydantic 欄位時，針對 date 等基本 Python 類型提供自動型別轉換 (#19479)
- fix: 修復使用 FAISS 及其他不儲存文字的 vector stores 時發生的 retriever KeyError (#19476)
- fix: 將 system prompt 加入記憶體，並將其用於 structured generation (#19490)

### `llama-index-readers-azstorage-blob` \[0.3.2]

- fix: 修復 AzStorageBlobReader 的 metadata 序列化問題 (#19491)

## \[2025-07-19]

### `llama-index-core` \[0.12.50]

- feat: MarkdownElementNodeParser 支援 html 表格提取 (#19449)
- fix/slightly breaking: 透過更改預設位置，提高 `get_cache_dir()` 函式的安全性 (#19415)- fix: 使用精確的時間戳記解決 SQLAlchemyChatStore 中的 race condition (#19432)
- fix: 更新 DocumentContextExtractor 中的 document store import 以使用 BaseDocumentStore (#19466)
- fix: 改善向量索引 retriever 中的空值檢索檢查 (#19471)
- fix: 透過為 workflow agents 新增 start event 處理，修正將 workflow agents 作為 MCP 伺服器執行時的問題 (#19470)
- fix: 處理多個 retriever 中的 ID 類型不匹配問題 (#19448)
- fix: 為 multi agent 新增 structured output，包含來自 secondary constructor 的部分及測試 (#19435)
- fix: 修正 VectorMemoryBlock 中重複的 `session_id` metadata\_filter (#19427)
- fix: 確保在 function tool 直接回傳時停止 agent (#19413)
- fix: 使用私有資料夾儲存 NTLK 快取 (#19444)
- fix: 更新 ReAct agent 的解析錯誤訊息 (#19431)

### `llama-index-instrumentation` \[0.3.0]

- feat: 改善 instrumentation span 名稱 (#19454)

### `llama-index-llms-bedrock-converse` \[0.7.6]

- chore: 在 Bedrock Converse 中新增 llama 4 模型，並從 function calling 模型中移除 llama 3.2 1b 與 3b (#19434)

### `llama-index-llms-cloudflare-ai-gateway` \[0.1.0]

- feat: 導入 cloudflare ai gateway (#19395)

### `llama-index-llms-google-genai` \[0.2.5]

- feat: 為 GoogleGenAI LLM 整合新增 `google_search` Tool 支援 (#19406)

### `llama-index-readers-confluence` \[0.3.2]

- refactor: 各項 Confluence reader 增強 (logging、錯誤處理) (#19424)

### `llama-index-readers-service-now` \[0.1.0]

- feat: 新增 service-now reader (#19429)

### `llama-index-protocols-ag-ui` \[0.1.4]

- chore: 移除 AGUI 中部分殘留的 debug print (#19469)

### `llama-index-tools-wikipedia` \[0.3.1]

- fix: 從 `WikipediaToolSpec.load_data` tool 中移除 load\_kwargs (#19464)

### `llama-index-vector-stores-baiduvectordb` \[0.3.1]

- fix: 在 BaiduVectorDB 中將 `**kwargs` 傳遞至 `super().__init__` (#19436)

### `llama-index-vector-stores-moorcheh` \[0.1.1]

- fix: 更新 Moorcheh Vector Store 的 namespace 解析 (#19461)

### `llama-index-vector-stores-s3` \[0.1.0]

- feat: 支援 s3 vectors (#19456)

## \[2025-07-14]

### `llama-index-core` \[0.12.49]

- fix: 在 CI 上跳過測試 (#19416)
- fix: 修正 structured output (#19414)
- Fix: 防止 SimpleGraphStore.upsert\_triplet 中出現重複的 triplets (#19404)
- 為 workflow agents 新增重試能力 (#19393)
- chore: 使用更嚴格的規則修改 raptors 依賴項以避免測試失敗 (#19394)
- feat: 在 agents 中實作首個 structured output (#19337)
- 為 Vector Store node serdes 新增測試並修正問題 (#19388)
- 重構向量索引檢索 (#19382)
- Retriever Query Engine 應使用 async node postprocessors (#19380)

### `llama-index-llms-bedrock-converse` \[0.7.5]

- 透過處理 messageStop 修正 BedrockConverse streaming 的 token 計數 (#19369)

### `llama-index-llms-nvidia` \[0.3.5]

- nvidia-llm : 新增支援在預設清單之外使用 llm 模型 (#19366)

### `llama-index-llms-oci-genai` \[0.5.2]

- 修正 OCI generative AI Llama 模型的 tool calling bug (#19376)

### `llama-index-postprocessor-flashrank-rerank` \[0.1.0]

- 修正 OCI generative AI Llama 模型的 tool calling bug (#19376)

### `llama-index-readers-web` \[0.4.4]

- fix: 避免 SimpleWebPageReader 等元件將 url 用作 Document id (#19398)

### `llama-index-storage-docstore-duckdb` \[0.1.0]

- 新增 DuckDB KV, Document 與 Index Store (#19282)

### `llama-index-storage-index-store-duckdb` \[0.1.0]

- 新增 DuckDB KV, Document 與 Index Store (#19282)

### `llama-index-storage-kvstore-duckdb` \[0.1.3]

- DuckDB: 解決 Deadlocks 問題 (#19401)
- 改善 DuckDB 的 thread safety 與 embed dimension 處理 (#19391)
- 新增 DuckDB KV, Document 與 Index Store (#19282)

### `llama-index-vector-stores-duckdb` \[0.4.6]

- DuckDB: 解決 Deadlocks 問題 (#19401)
- 改善 DuckDB 的 thread safety 與 embed dimension 處理 (#19391)
- DuckDB Async 與更快的 Cosine Similarity (#19383)
- DuckDB 小幅清理並在回傳的 nodes 中新增 embeddings (#19377)

### `llama-index-vector-stores-moorcheh` \[0.1.0]

- feat: 新增 Moorcheh vector store 整合 (#19349)

## \[2025-07-09]

### `llama-index-core` \[0.12.48]

- fix: 在 AgentWorkflowStartEvent 中將 dict 類型的 chat\_history 轉換為 ChatMessage 物件 (#19371)- fix: 在 Context 中將 ctx.get/set 替換為 ctx.store.get/set (#19350)
- 在 6 個目錄中更新 pip group 的 1 個項目 (#19357)
- 減少 Document Hash Checks 期間對 KV store 的存取次數 (#19362)
- 不在 metadata 中儲存 document 的副本，並正確回傳 Nodes (#19343)
- 在 pip group 的 /docs 目錄中將 llama-index-core 從 0.12.8 升級至 0.12.41 (#19345)
- fix: 確保 CallbackManager 應用於預設的 embed\_model (#19335)
- fix 發佈子套件 workflow (#19338)

### `llama-index-embeddings-huggingface-optimum-intel` \[0.3.1]

- 修復 IntelEmbedding base.py (#19351)

### `llama-index-indices-managed-lancedb` \[0.1.0]

- 修復損壞的 lancedb 測試 (#19352)

### `llama-index-indices-managed-llamacloud` \[0.7.10]

- 升級 llama-cloud (#19355)
- 修復 page figure nodes 的非同步擷取 (#19334)

### `llama-index-llms-google-genai` \[0.2.4]

- 為 GoogleGenAI LLM 整合新增 Cached Content 支援 (#19361)

### `llama-index-llms-oci-genai` \[0.5.1]

- 為 OCI generative AI Llama 模型新增 Image prompt 支援 (#19306)

### `llama-index-readers-file` \[0.4.11]

- 將 xml 替換為 defusedxml (#19342)

### `llama-index-storage-chat-stores-postgres` \[0.2.2]

- 更新 asyncpg (#19365)

## \[2025-07-06]

### `llama-index-core` \[0.12.47]

- feat: 為 agents 的 `.run()` 新增預設 `max_iterations` 參數，值為 20 (#19035)

- feat: 在支援的情況下，將 `FunctionCallingProgram` 與結構化 LLMs 的 `tool_required` 設定為 `True` (#19326)

- fix: 修復 agent workflow 事件中缺失 raw 的問題 (#19325)

- fix: 修復解析 json 輸出時對空清單的解析問題 (#19318)

- chore: 將 Multi Modal LLMs 標記為棄用 (#19115)

  - 所有現有的 multi-modal llms 現在均為其對應之基礎 `LLM` 的擴充
  - 基礎 `LLM` 類別在 `llama-index-core` 中支援 multi-modal 功能
  - 基礎 `LLM` 類別內部使用 `ImageBlock` 以支援 multi-modal 功能

### `llama-index-cli` \[0.4.4]

- fix: 防止 RAG CLI —clear 旗標中的指令注入漏洞 (#19322)

### `llama-index-indices-managed-lancedb` \[0.1.0]

- feat: 新增 LanceDB MultiModal AI LakeHouse 整合 (#19232)

### `llama-index-llms-anthropic` \[0.7.6]

- feat: 支援 anthropic 引用 (#19316)

### `llama-index-llms-oci-genai` \[0.5.1]

- feat: 為 OCI generative AI Llama 模型新增 Image prompt 支援 (#19306)

### `llama-index-readers-web` \[0.4.3]

- chore: 新增 firecrawl 整合來源 (#19203)

## \[2025-07-02]

### `llama-index-core` \[0.12.46]

- feat: 為向量儲存索引新增非同步刪除與插入 (#19281)
- fix: 修復 ChatMessage 轉 str 時對空輸入的處理 (#19302)
- fix: 修復使用 typed context 時的 function tool context 偵測 (#19309)
- fix: 修復不一致的 ref node 處理 (#19286)
- chore: 簡化 citation block schema (#19308)

### `llama-index-embeddings-google-genai` \[0.2.1]

- chore: 提升 google-genai 最低版本 (#19304)

### `llama-index-embeddings-nvidia` \[0.3.4]

- fix: 修復使用自定義 endpoint 的 embedding model 出現 404 錯誤的問題 (#19295)

### `llama-index-llms-google-genai` \[0.2.3]

- chore: 提升 google-genai 最低版本 (#19304)

### `llama-index-tools-mcp` \[0.2.6]

- fix: 正確設定來自 mcp 伺服器的資源 (#19307)

### `llama-index-voice-agents-elevenlabs` \[0.3.0-beta]

- fix: 遷移 Elevenlabs 以符合框架標準 (#19273)

## \[2025-06-30]

### `llama-index-core` \[0.12.45]

- feat: 允許 tools 輸出 content blocks (#19265)
- feat: 在 core 套件中新增 chat UI 事件與模型 (#19242)
- fix: 支援從 ingestion cache 載入 `Node` (#19279)
- fix: 修復 SemanticDoubleMergingSplitterNodeParser 未遵守 max\_chunk\_size 的問題 (#19235)
- fix: 在基礎索引中將 `get_doc_id()` 替換為 `id_` (#19266)
- chore: 移除對已棄用的 Context get/set API 的使用與引用 (#19275)
- chore: 將較舊的 agent 套件標記為棄用 (#19249)

### `llama-index-llms-anthropic` \[0.7.5]

- feat: 新增 Bedrock 上可用的新 AWS Claude 模型 (#19233)

### `llama-index-embeddings-azure-openai` \[0.3.9]

- feat: 為 AzureOpenAIEmbedding 新增 dimensions 參數 (#19239)

### `llama-index-embeddings-bedrock` \[0.5.2]

- feat: 更新 aioboto3 依賴 (#19237)

### `llama-index-llms-bedrock-converse` \[0.7.4]

- feat: 更新 aioboto3 依賴 (#19237)

### `llama-index-llms-dashscope` \[0.4.1]

- fix: 修復 dashscope qwen assistant api Error 回應問題，將 `tool_calls` 資訊從 ChatMessage kwargs 提取至頂層 (#19224)

### `llama-index-memory-mem0` \[0.3.2]

- feat: 使 Mem0 適配新的 framework memory 標準 (#19234)

### `llama-index-tools-google` \[0.5.0]

- feat: 在 tool spec 中加入正確的 async google search (#19250)
- fix: 清理 GoogleSearchToolSpec 中的結果 (#19246)

### `llama-index-vector-stores-postgres` \[0.5.4]

- fix: 修復 pg vector store 的 sparse query (#19241)

## \[2025-06-25]

### `llama-index-core` \[0.12.44]

- feat: 加入用於快取聊天訊息的 `CachePoint` 內容區塊 (#19193)
- fix: 修復 workflow agent 中的 react system header 格式 (#19158)
- fix: 修復當 LLM 未產生 「Thought:」 前綴時的 ReActOutputParser (#19190)
- fix: 修復 react output parser 中的字串 striping (#19192)
- fix: 正確處理 CodeAct agent 的 system prompt (#19191)
- fix: 在 AgentStream 事件中排除 raw 欄位以修復潛在的序列化問題 (#19150)
- chore: 將 core 中較舊的 agent 架構標記為 deprecated (#19205)
- chore: 在程式碼中將 query pipelines 標記為 deprecated (#19206)

### `llama-index-embeddings-fastembed` \[0.3.5]

- feat: 為 FastEmbed 加入 Batch 支援 (#19147)

### `llama-index-embeddings-huggingface` \[0.5.5]

- feat: 使用 `asyncio.to_thread` 為 huggingface 加入 async batching (#19207)

### `llama-index-llms-anthropic` \[0.7.4]

- fix: 更新 anthropic bedrock 的 kwargs (#19169)

### `llama-index-llms-google-genai` \[0.2.2]

- fix: 為 google genai client 正確設定 System instruction (#19196)

### `llama-index-llms-mistralai` \[0.6.1]

- fix: 修復 Mistral AI 的 image url 處理 (#19139)

### `llama-index-llms-perplexity` \[0.3.7]

- fix: 在 perplexity llm 整合中使 api\_key 使用 `PPLX_API_KEY` (#19217)

### `llama-index-postprocessor-bedrock-rerank` \[0.4.0]

- fix: 避免在 runtime 更改 ‘top\_n’ self 屬性 (#19221)

### `llama-index-postprocessor-sbert-rerank` \[0.3.2]

- feat: 加入用於進階配置的 `cross_encoder_kwargs` 參數 (#19148)

### `llama-index-utils-workflow` \[0.3.5]

- feat: 為單一/多個 agent workflows 加入視覺化功能 (#19101)

### `llama-index-vector-stores-azureaisearch` \[0.3.8]

- feat: 在 AzureAISearchVectorStore 中啟用任意 Azure Search SDK 參數的轉發以進行 document 檢索 (#19173)

### `llama-index-vector-stores-db2` \[0.1.0]

- feat: 加入 IBM Db2 vector store (#19195)

### `llama-index-vector-stores-duckdb` \[0.4.0]

- feat: 重構 DuckDB VectorStore (#19106)

### `llama-index-vector-stores-pinecone` \[0.6.0]

- feat: 支援 pinecone v7 (#19163)
- fix: 為 `llama-index-vector-stores-pinecone` 支援 python 版本 `>=3.9,<4.0` (#19186)

### `llama-index-vector-stores-qdrant` \[0.6.1]

- fix: 修復 qdrant 中使用 IN/NIN 篩選器的型別 (#19159)

### `llama-index-voice-agents-openai` \[0.1.1-beta]

- feat: 加入 beta 版 OpenAI Realtime Conversation 整合 (#19010)

## \[2025-06-18]

### `llama-index-core` \[0.12.43]

- feat: 使 BaseWorkflowAgent 本身成為一個 workflow (#19052)
- fix: 統一 title extractor 的進度條 (#19131)
- fix: 在 SimpleDirectoryReader 中使用 `get_tqdm_iterable` (#18722)
- chore: 將 Workflows 程式碼移至 `llama-index-workflows` 並保持向下相容性 (#19043)
- chore: 將 instrumentation 程式碼移至獨立套件 `llama-index-instrumentation` (#19062)

### `llama-index-llms-bedrock-converse` \[0.7.2]

- fix: 改善 bedrock converse 中空 tool call 的處理 (#19084)

### `llama-index-llms-openai` \[0.4.7]

- fix: 修復建構 openai responses dicts 的問題 (#19089, #19094)

### `llama-index-llms-perplexity` \[0.3.6]

- feat: 提升 perplexity llm 整合的效能與穩健性 (#19022)

### `llama-index-postprocessor-sbert-rerank` \[0.3.1]

- feat: 為 Sentence Transformers post processor 加入 cache dir (#19097)

### `llama-index-protocols-ag-ui` \[0.1.2]

- feat: 加入 `ag-ui` 協定支援 (#19104, #19103, #19102, #18898)

### `llama-index-readers-google` \[0.6.2]

- fix: 修復 google drive reader 獲取 metadata 檔案 ID 時的錯誤 (#19118)

### `llama-index-readers-hive` \[0.3.1]

- chore: 將 hive reader 標記為 deprecated 並移除 (#18990)

### `llama-index-readers-mongodb` \[0.3.2]

- feat: 為 mongodb reader 新增 `alazy_load_data` 的 Async driver (#19038)

### `llama-index-storage-chat-store-sqlite` \[0.1.1]

- fix: 修正 sqlite chat store 與 sqlalchemy 1.4 的相容性 (#19067)

### `llama-index-tools-hive` \[0.1.0]

- feat: 新增 Hive Intelligence 搜尋工具 (#19029)

### `llama-index-utils-workflow` \[0.3.4]

- feat: 支援繪製 workflows 的 mermaid 圖表 (#19083)

### `llama-index-vector-stores-lancedb` \[0.3.3]

- fix: 修正使用預定義 schema 建立資料表的問題 (#19064)

### `llama-index-vector-stores-milvus` \[0.8.5]

- fix: 修正 `Connections.connect()` 的參數 `alias` 收到多個值之問題 (#19119)

### `llama-index-vector-stores-opengauss` \[0.1.0]

- feat: 新增 openGauss 整合 (#19024)

## \[2025-06-11]

### `llama-index-core` \[0.12.42]

- fix: 將 input message 傳遞至 memory get (#19054)
- fix: 在 async 函數中使用 async memory 操作 (#19032)
- fix: 在 SQLTableNodeMapping 中使用 uuid 代替 hashing 以提高相容性 (#19011)

### `llama-index-embeddings-bedrock` \[0.5.1]

- feat: 更新 aioboto3 依賴項目 (#19015)

### `llama-index-indices-managed-llama-cloud` \[0.7.7]

- feat: 整合 figure retrieval SDK (#19017)
- fix: 當 `page_figure_nodes_to_node_with_score` 中的參數 `raw_figure_nodes` 為 None 類型時，回傳空列表 (#19053)

### `llama-index-llms-mistralai` \[0.6.0]

- feat: 為 mistralai LLM + magistral 新增 reasoning 支援 (#19048)

### `llama-index-llms-openai` \[0.4.5]

- feat: Day 0 支援 O3 pro (#19030)
- fix: 在 openai 回應 api 中跳過工具描述長度檢查 (#18956)

### `llama-index-llms-perplexity` \[0.3.5]

- fix: 修正 perplexity llm 整合 bug (#19007)

### `llama-index-multi-modal-llms-openai-like` \[0.1.0]

- feat: 新增類似 multi-modal LLM 的 openai (#18997)

### `llama-index-postprocessor-bedrock-rerank` \[0.3.3]

- feat: 優先使用 ‘BedrockRerank’ 而非 ‘AWSBedrockRerank’ (#19016)

### `llama-index-readers-papers` \[0.3.1]

- fix: 提高檔名 hashing 的強健性 (#18318)

### `llama-index-tools-artifact-editor` \[0.1.0]

- feat: 建立 ArtifactEditorToolSpec 用於編輯 pydantic 物件 (#18989)

### `llama-index-utils-workflow` \[0.3.3]

- feat: 為 workflow 視覺化新增標籤截斷功能 (#19027)

### `llama-index-vector-stores-opensearch` \[0.5.6]

- feat: 新增從查詢回應中排除來源欄位的功能 (#19018)

### `llama-index-voice-agents-elevenlabs` \[0.2.0-beta]

- fix: 修正文件內容並整合 ElevenLabs 整合工具 (#19014)

## \[2025-06-07]

### `llama-index-core` \[0.12.41]

- feat: 新增 MutableMappingKVStore 以簡化快取操作 (#18893)
- fix: 修正 tool specs 中的 async 函數 (#19000)
- fix: 正確將檔案限制套用於 SimpleDirectoryReader (#18983)
- fix: 修正 Settings 覆寫 LLM callback manager 的問題 (#18951)
- fix: 在 JsonPickleSerializer 的 docstring 中新增警告，提醒使用者僅反序列化安全內容，並將其重新命名為 PickleSerializer (#18943)
- fix: 檢查 ImageDocument 的路徑與 URL，以確保輸入確實為圖片 (#18947)
- chore: 從 core 中移除部分未使用的 utils (#18985)

### `llama-index-embeddings-azure-openai` \[0.3.8]

- fix: 修正 Azure api-key 與 azure-endpoint 的解析問題 (#18975)
- fix: 修正 api\_base 與 azure\_endpoint 的解析問題 (#19002)

### `llama-index-graph-stores-ApertureDB` \[0.1.0]

- feat: Aperturedb propertygraph (#18749)

### `llama-index-indices-managed-llama-cloud` \[0.7.4]

- fix: 解析 retriever llamacloud 索引 (#18949)
- chore: 在 composite retrieval 中新增 ReRankConfig (#18973)

### `llama-index-llms-azure-openai` \[0.3.4]

- fix: 修正 api\_base 與 azure\_endpoint 的解析問題 (#19002)

### `llama-index-llms-bedrock-converse` \[0.7.1]

- fix: 處理空的訊息內容以防止 ValidationError (#18914)

### `llama-index-llms-litellm` \[0.5.1]

- feat: 為 LiteLLM 整合新增 DocumentBlock 支援 (#18955)

### `llama-index-llms-ollama` \[0.6.2]

- feat: 新增對 ollama 中新 think 功能的支援 (#18993)

### `llama-index-llms-openai` \[0.4.4]

- feat: 新增 OpenAI JSON Schema 結構化輸出支援 (#18897)
- fix: 在 openai 回應 api 中跳過工具描述長度檢查 (#18956)

### `llama-index-packs-searchain` \[0.1.0]

- feat: 新增 searchain 套件 (#18929)

### `llama-index-readers-docugami` \[0.3.1]

- fix: 修正 XML 解析中的 hash collision 問題 (#18986)

### `llama-index-readers-file` \[0.4.9]

- fix: 目前將 llama-index-readers-file 的 pandas 版本固定 (#18976)

### `llama-index-readers-gcs` \[0.4.1]

- feat: 允許使用較新版本的 gcsfs (#18987)

### `llama-index-readers-obsidian` \[0.5.2]

- fix: Obsidian reader 會檢查並跳過 hardlinks (#18950)

### `llama-index-readers-web` \[0.4.2]

- fix: llama-index-readers-web 改用 httpx 取代 urllib (#18945)

### `llama-index-storage-kvstore-postgres` \[0.3.5]

- fix: 從 llama-index-storage-kvstore-postgres 依賴項中移除不必要的 psycopg2 (#18964)

### `llama-index-tools-mcp` \[0.2.5]

- fix: 正確將 workflow args 格式化為 start event 實例 (#19001)
- feat: 新增對 MCP tool calls 期間記錄 log 的支援 (#18927)

### `llama-index-vector-stores-chroma` \[0.4.2]

- fix: 更新 ChromaVectorStore 的 port 欄位與參數型別 (#18977)

### `llama-index-vector-stores-milvus` \[0.8.4]

- feat: Milvus 支援 Upsert Entities (#18962)

### `llama-index-vector-stores-redis` \[0.5.2]

- fix: 修正 Redis 的 URL/Client 處理 (#18982)

### `llama-index-voice-agents-elevenlabs` \[0.1.0-beta]

- feat: ElevenLabs beta 整合 (#18967)

## \[2025-06-02]

### `llama-index-core` \[0.12.40]

- feat: 新增 StopEvent 步驟驗證，使僅有一個 workflow 步驟能處理 StopEvent (#18932)
- fix: 在將 `tool_required` 提供給 LLM args 之前新增相容性檢查 (#18922)

### `llama-index-embeddings-cohere` \[0.5.1]

- fix: 為 Cohere API 新增 batch size 驗證，上限為 96 (#18915)

### `llama-index-llms-anthropic` \[0.7.2]

- feat: 支援將靜態 AWS 憑證傳遞至 Anthropic Bedrock (#18935)
- fix: 處理 anthropic tool config 中未經測試的 no tools 情境 (#18923)

### `llama-index-llms-google-genai` \[0.2.1]

- fix: 為 google-genai function calling 使用正確的 auto mode (#18933)

### `llama-index-llms-openai` \[0.4.2]

- fix: 修正 OpenAI LLM API 的部分欄位型別問題 (#18918)
- fix: 在 OpenAIResponses 類別中將損壞的 `reasoning_effort` kwarg 遷移至 `reasoning_options` dict (#18920)

### `llama-index-tools-measurespace` \[0.1.0]

- feat: 新增來自 Measure Space 的天氣、氣候、空氣品質與 geocoding 工具 (#18909)

### `llama-index-tools-mcp` \[0.2.3]

- feat: 為 BasicMCPClient 新增 headers 處理 (#18919)

## \[2025-05-30]

### `llama-index-core` \[0.12.39]

- feat: 在 Workflows 中新增 Resource 以執行 dependency injection (文件即將推出！) (#18884)
- feat: 為 function calling LLMs 新增 `require_tool` 參數 (#18654)
- fix: 使 hitl events 的 prefix 與 response 變為非必填 (#18896)
- fix: 修正當 LLM 未選擇任何選項時的 SelectionOutputParser 問題 (#18886)

### `llama-index-indices-managed-llama-cloud` \[0.7.2]

- feat: 新增非持久化的 composite retrieval (#18908)

### `llama-index-llms-bedrock-converse` \[0.7.0]

- feat: 更新 aioboto3 依賴項以允許最新版本 (#18889)

### `llama-index-llms-ollama` \[0.6.1]

- 支援 ollama 0.5.0 SDK，並更新 ollama 文件 (#18904)

### `llama-index-vector-stores-milvus` \[0.8.3]

- feat: Milvus 支援多語言分析器 (#18901)

## \[2025-05-28]

### `llama-index-core` \[0.12.38]

- feat: 新增 embeddings cache 的簡易實作 (#18864)
- feat: 在 NLSQLRetriever 中新增 `cols_retrievers` (#18843)
- feat: 在 NLSQLTableQueryEngine 中將 row, col 與 table retrievers 作為參數新增 (#18874)
- feat: 為 FunctionAgent 新增可配置的 allow\_parallel\_tool\_calls (#18829)
- feat: 允許 BaseToolSpec 函數中使用 ctx，以及其他關於 ctx 與 tool calling 的重大重構 (#18783)
- feat: 優化 get\_biggest\_prompt 的可讀性與效率 (#18808)
- fix: 防止 JSONReader 中的 DoS 攻擊 (#18877)
- fix: 修正當 LLM 未選擇任何選項時的 SelectionOutputParser 問題 (#18886)
- fix: 修正 hitl 期間從 ctx 恢復 AgentWorkflow 的問題 (#18844)
- fix: 修正 AgentWorkflow 執行期間的 context 序列化問題 (#18866)
- fix: 若 content block resolve 方法產出空位元組則拋出錯誤 (#18819)
- fix: 減少解析 ReActAgent completions 中的 “Thought/Action/Action Input” 時出現的問題 (#18818)
- fix: 從 QueryFusionRetriever llm 回應中移除程式碼區塊的反引號 (#18825)- fix: 修復當 schema 沒有 “title” 鍵時 function\_program.py 中的 `get_function_tool` (#18796)

### `llama-index-agent-azure-foundry` \[0.1.0]

- feat: 新增 foundry agent 整合的 azure (#18772)

### `llama-index-agent-llm-compiler` \[0.3.1]

- feat: llm-compiler 支援 `stream_step`/`astream_step` (#18809)

### `llama-index-embeddings-google-genai` \[0.2.0]

- feat: 新增 gemini embeddings 測試與 retry 設定 (#18846)

### `llama-index-embeddings-openai-like` \[0.1.1]

- fix: 為 OpenAILikeEmbedding 將 `http_client` 與 `async_http_client` 傳遞至 parent (#18881)

### `llama-index-embeddings-voyageai` \[0.3.6]

- feat: 推出 voyage-3.5 模型 (#18793)

### `llama-index-indices-managed-llama-cloud` \[0.7.1]

- feat: 新增對 `search_filters_inference_schema` 的 client 支援 (#18867)
- feat: 新增 async 方法與空白 index 建立 (#18859)

### `llama-index-llms-anthropic` \[0.6.19]

- feat: 更新 Anthropic LLM 以支援 claude 4 (#18817)
- fix: 修復 anthropic 中的 thinking + tool calls (#18834)
- fix: 在 anthropic 訊息中檢查 thinking 是否為 non-null (#18838)
- fix: 更新/修復 claude-4 支援 (#18820)

### `llama-index-llms-bedrock-converse` \[0.6.0]

- feat: 新增 claude4 模型支援 (#18827)
- fix: 修復 Bedrock Converse 中的 DocumentBlock 使用方式 (#18791)
- fix: 修復使用空參數呼叫 tools 的問題 (#18786)

### `llama-index-llms-cleanlab` \[0.5.0]

- feat: 更新套件名稱與模型 (#18483)

### `llama-index-llms-featherlessai` \[0.1.0]

- feat: featherless-llm 整合 (#18778)

### `llama-index-llms-google-genai` \[0.1.14]

- fix: 修復 Google GenAI token 計算行為，新增基礎 retry 機制 (#18876)

### `llama-index-llms-ollama` \[0.5.6]

- feat: 嘗試在 ollama 中自動設定 context window (#18822)
- feat: 在 ollama 模型中使用預設 temp (#18815)

### `llama-index-llms-openai` \[0.3.44]

- feat: 新增 OpenAI 回應功能（圖片生成、mcp 呼叫、code interpreter） (#18810)
- fix: 更新 OpenAI 回應類型的 import 以相容於最新版 openai 函式庫 (#18824)
- fix: 在 OpenAI agent 中跳過 tool 描述長度檢查 (#18790)

### `llama-index-llms-servam` \[0.1.1]

- feat: 新增 Servam AI LLM 整合，並提供類 OpenAI 介面 (#18841)

### `llama-index-observability-otel` \[0.1.0]

- feat: 整合 OpenTelemetry 以提升可觀測性 (#18744)

### `llama-index-packs-raptor` \[0.3.2]

- 在 Raptor clustering 中使用全域 `llama_index` tokenizer (#18802)

### `llama-index-postprocessor-rankllm-rerank` \[0.5.0]

- feat: 使用最新版 rank-llm sdk (#18831)

### `llama-index-readers-azstorage-blob` \[0.3.1]

- fix: 修復 azstorageblobreader 中的 Metadata 與檔名 (#18816)

### `llama-index-readers-file` \[0.4.8]

- fix: 修復從遠端 fs 讀取 pptx 檔案的問題 (#18862)

### `llama-index-storage-kvstore-postgres` \[0.3.1]

- feat: 可從現有的 SQLAlchemy Engine 建立 PostgresKVStore (#18798)

### `llama-index-tools-brightdata` \[0.1.0]

- feat: brightdata 整合 (#18690)

### `llama-index-tools-google` \[0.3.1]

- fix: 修復 `GmailToolSpec.load_data()` 在缺少參數時呼叫 search 的問題 (#18832)

### `llama-index-tools-mcp` \[0.2.2]

- feat: 強化 SSE endpoint 偵測以提升相容性 (#18868)
- feat: 重構 `BasicMCPClient` 以支援所有 MCP 功能 (#18833)
- fix: 當 allowed\_tools 列表為空時，McpToolSpec 會擷取所有 tools (#18879)
- fix: 新增缺失的 `BasicMCPClient.with_oauth()` kwargs (#18845)

### `llama-index-tools-valyu` \[0.2.0]

- feat: 更新至 valyu 2.0.0 (#18861)

### `llama-index-vector-stores-azurecosmosmongo` \[0.6.0]

- feat: 為 Azure Cosmos DB Mongo vector store 新增 Vector Index Compression 支援 (#18850)

### `llama-index-vector-stores-opensearch` \[0.5.5]

- feat: 新增 filter 支援，可用於檢查 metadata 鍵是否不存在 (#18851)
- fix: 在 vector store nodes 中不要同時傳遞 `extra_info` 與 `metadata` (#18805)

## \[2025-05-19]

### `llama-index-core` \[0.12.37]

- 確保 `Memory` 至少回傳一則訊息 (#18763)
- 在存取 `message.content` 時，使用換行符號分隔文字區塊 (#18763)
- 在多個 agent workflows 中重設 `next_agent` (#18782)
- 在 chat store 中支援 sqlalchemy v1 (#18780)
- fix: 修復失效的 hotpotqa 資料集 URL (#18764)
- 在 SimpleDirectoryReader 中使用 `get_tqdm_iterable` (#18722)- 將 agent workflow kwargs 傳遞至 start event (#18747)
- fix(chunking)：確保 AST node chunking 期間能正確處理多位元組字元 (#18702)

### `llama-index-llms-anthropic` \[0.6.14]

- 修復 OpenAI 與 Anthropic 中的 DocumentBlock 處理 (#18769)

### `llama-index-llms-bedrock-converse` \[0.5.4]

- 修復 bedrock converse 的 tool call 解析 (#18781)
- feat：為 bedrock 增加缺失的 client params (#18768)
- 修復 bedrock converse 中合併多個 tool call 的問題 (#18761)

### `llama-index-llms-openai` \[0.3.42]

- 修復 OpenAI 與 Anthropic 中的 DocumentBlock 處理 (#18769)
- 移除 openai 中的 tool-length 檢查 (#18784)
- 增加對空 tool call delta 的檢查，並提升版本 (#18745)

### `llama-index-llms-openai-like` \[0.3.5]

- 移除 openai 中的 tool-length 檢查 (#18784)

### `llama-index-retrievers-vectorize` \[0.1.0]

- 增加 Vectorize retriever (#18685)

### `llama-index-tools-desearch` \[0.1.0]

- Feature/desearch 整合 (#18738)

## \[2025-05-14]

### `llama-index-core` \[0.12.36]

- 在向量記憶體區塊中增加對自動 session\_id 過濾的支援 (#18730)
- 增加功能：在聊天訊息中支援 DocumentBlock (#18719)
- 為 BaseIndex 增加初始的 Async 方法 (#18711)
- 使用 fs 檢查 ingestion pipeline 路徑 (#18680)
- 在 StreamingAgentChatResponse 中增加邊緣案例處理 (#18679)

### `llama-index-embeddings-azure-openai` \[0.3.5]

- 在 Azure embeddings 中尋找 azure openai 金鑰環境變數 (#18703)
- 僅在非 `use_azure_ad` 時獲取 `api_key` (#18708)
- 修復 get `api_key` if not `use_azure_ad` if 分支的打字錯誤 (#18720)

### `llama-index-embeddings-cohere` \[0.5.0]

- 支援 Cohere V4 embeddings 與 V2 client (#18464)

### `llama-index-embeddings-fastembed` \[0.3.2]

- Bugfix：FastEmbedEmbedding 缺少將額外參數傳遞至 api 的程式碼 (#18695)

### `llama-index-graph-stores-neptune` \[0.3.3]

- fix：處理獲取 Neptune node 屬性時可能發生的 OverflowError (#18687)

### `llama-index-readers-legacy-office` \[0.1.1]

- feat：`legacy_office`，基於 Apache Tika 的 `.doc` reader (#18649)
- chore：修復 legacy office reader 冗長的 metadata (#18696)

### `llama-index-retrievers-vectorize` \[0.1.0]

- 增加 Vectorize retriever (#18685)

### `llama-index-tools-brightdata` \[0.1.0]

- Feature/brightdata 整合 (#18690)

### `llama-index-tools-mcp` \[0.1.3]

- 為 workflow servers 與 function tools 提供 MCP one-liners (#18729)

### `llama-index-tools-openapi` \[0.4.0]

- feat：提升 OpenAPI 與 Requests tool 的功能與可靠性 (#18681)

### `llama-index-tools-requests` \[0.4.0]

- feat：提升 OpenAPI 與 Requests tool 的功能與可靠性 (#18681)

### `llama-index-vector-stores-milvus` \[0.8.2]

- fix(MilvusVectorStore)：根據名稱而非 'id' 使用來自 milvus 的 primary key (#18714)

### `llama-index-vector-stores-postgres` \[0.5.3]

- 為 PGVectorStore 增加 `IS_EMPTY` 支援 (#18667)

### `llama-index-vector-stores-redis` \[0.5.1]

- 增加 Async Redis Vector Store 支援 (#18675)

## \[2025-05-08]

### `llama-index-core` \[0.12.35]

- 增加在 `FunctionTool` 上預填部分 tool kwargs 的支援 (#18658)
- Fix/react agent max iterations 跳過問題 (#18634)
- 處理預建 workflows（如 `AgentWorkflow`）中的邊緣案例序列化 (#18628)
- 使用新基類重構 memory (#18594)
- 增加預建記憶體區塊 (#18607)

### `llama-index-embeddings-autoembeddings` \[0.1.0]

- 支援來自 chonkie 的 AutoEmbeddings 整合 (#18578)

### `llama-index-embeddings-huggingface-api` \[0.3.1]

- 修復 huggingface-hub 的相依版本 (#18662)

### `llama-index-indices-managed-vectara` \[0.4.5]

- 修復 Vectara 中使用 chain reranker 搭配 cutoff 參數的 Bug (#18610)

### `llama-index-llms-anthropic` \[0.6.12]

- anthropic 引用與 tool calls (#18657)

### `llama-index-llms-cortex` \[0.3.0]

- Cortex 認證功能增強 2 (#18588)

### `llama-index-llms-dashscope` \[0.3.3]

- 修復 dashscope tool call 解析 (#18608)

### `llama-index-llms-google-genai` \[0.1.12]

- 修復 google-genai llm 中修改物件參照的問題 (#18616)
- feat(llama-index-llms-google-genai)：2.5-flash-preview 測試 (#18575)
- 修復 last\_msg 索引 (#18611)

### `llama-index-llms-huggingface-api` \[0.4.3]

- Huggingface API 修復 task 與 deps (#18662)

### `llama-index-llms-litellm` \[0.4.2]

- 修復 streaming tool calls 的解析問題 (#18653)

### `llama-index-llms-meta` \[0.1.1]

- 支援 Meta Llama-api 作為 LLM provider (#18585)

### `llama-index-node-parser-docling` \[0.3.2]

- 修復/docling node parser 的 metadata (#186390)

### `llama-index-node-parser-slide` \[0.1.0]

- 新增 SlideNodeParser 整合 (#18620)

### `llama-index-readers-github` \[0.6.1]

- 修復：在 GitHubIssuesClient 中新增 follow\_redirects=True (#18630)

### `llama-index-readers-markitdown` \[0.1.1]

- 修復 MarkItDown Reader 的 bug (#18613)

### `llama-index-readers-oxylabs` \[0.1.2]

- 新增 Oxylabs readers (#18555)

### `llama-index-readers-web` \[0.4.1]

- 修復 Firecrawl library 調用不正確的問題 (#18646)
- 新增 Oxylabs readers (#18555)

### `llama-index-storage-chat-store-gel` \[0.1.0]

- 新增 Gel 整合 (#18503)

### `llama-index-storage-docstore-gel` \[0.1.0]

- 新增 Gel 整合 (#18503)

### `llama-index-storage-kvstore-gel` \[0.1.0]

- 新增 Gel 整合 (#18503)

### `llama-index-storage-index-store-gel` \[0.1.0]

- 新增 Gel 整合 (#18503)

### `llama-index-utils-workflow` \[0.3.2]

- 修復 draw\_all\_possible\_flows 的 event 顏色 (#18660)

### `llama-index-vector-stores-faiss` \[0.4.0]

- 新增 Faiss Map Vector store 並修復缺失的 index\_struct 刪除 (#18638)

### `llama-index-vector-stores-gel` \[0.1.0]

- 新增 Gel 整合 (#18503)

### `llama-index-vector-stores-postgres` \[0.5.2]

- 新增 indexed metadata 欄位 (#18595)

## \[2025-04-30]

- 將 repo 從 poetry 遷移至 uv (#18524)

### `llama-index-core` \[0.12.34]

- 修復：當 showprogress 為 False 時，`aextract_table_summaries` 會導致不必要的輸出 (#18528)

### `llama-index-embeddings-cohere` \[0.4.1]

- 修復使用 Custom Endpoint 的 Cohere Embedding Multiprocessing (#18551)

### `llama-index-embeddings-openvino-genai` \[0.5.0]

- 新增 openvino genai embedding (#18569)

### `llama-index-llms-bedrock-converse` \[0.5.0]

- 新增對 AWS Bedrock Application Inference Profiles 的支援 (#18549)

### `llama-index-llms-google-genai` \[0.1.10]

- 2.5-flash-preview 測試 + structured predict 的變更與修復 (#18575)
- 解除 google genai llm 中 pillow 的 dep 限制 (#18533)
- 正確合併 tool messages (#18527)

### `llama-index-llms-huggingface-api` \[0.4.2]

- 為 HuggingFaceInferenceAPI 新增 provider 支援 (#18574)

### `llama-index-llms-vllm` \[0.5.1]

- feat: 新增 is\_chat\_model 選項 (#18552)

### `llama-index-packs-code-hierarchy` \[0.5.1]

- 修復 Code Hierarchy Agent Pack 在處理空檔案或不同編碼檔案時的問題 (#18538)

### `llama-index-postprocessor-cohere-rerank` \[0.4.0]

- 將 CohereRerank 的預設 model 版本更新為 v3.0 (#18579)

### `llama-index-readers-database` \[0.4.0]

- 透過新功能與改進的文件來強化 DatabaseReader (#18537)

### `llama-index-tools-mcp` \[0.1.2]

- 防止 MCP Connections 發生 Hang (#18512)

### `llama-index-vector-stores-opensearch` \[0.5.3]

- 為 OpensearchVectorClient 新增針對 AOSS 的 index 存在條件檢查 (#18560)

### `llama-index-vector-stores-postgres` \[0.5.1]

- 在 PGVectorStore 中實作 aget\_nodes 與 adelete (#18515)
- 允許 PGVectorStore 傳入 engines (#18507)

## \[2025-04-23]

### `llama-index-core` \[0.12.33 / 0.12.33.post1]

- 封裝較新版本的 tiktoken encodings，提升 tiktoken 的最低版本要求 (#18509)

### `llama-index-vector-stores-milvus` \[0.8.1]

- Milvus Vector Store：更新 metadata filtering demo (#18502)

## \[2025-04-21]

### `llama-index-core` \[0.12.32]

- 修復 media resource 的 serialization (#18496)
- 修復 react agent prompt 的更新 (#18494)

### `llama-index-indices-managed-vectara` \[0.4.4]

- 在 GC 時關閉 VectaraIndex 的 「session」 (#18484)

### `llama-index-llms-openai` \[0.3.38]

- 允許在 openai assistant messages 中使用 content blocks (#18495)

### `llama-index-llms-openvino-genai` \[0.1.1]

- 修復 openvino llm 的初始化問題 (#18481)

### `llama-index-vector-stores-milvus` \[0.8.0]

- MilvusVectorStore：將 BM25 設為預設的 sparse embedding function (#18460)

## \[2025-04-16]

### `llama-index-core` \[0.12.31]

- 修復/memory multimodal content 的 serialization (#18447)
- 在 memory 與 postprocessor 基礎類別中新增 async (#18438)

### `llama-index-callbacks-arize-pheonix` \[0.5.1]

- llama index callbacks arize phoenix python 版本提升 (#18466)

### `llama-index-graph-stores-nebula` \[0.4.2]

- 修復 nebula index ddl (#18461)

### `llama-index-indices-managed-vectara` \[0.4.3]

- 為 Vectara 新增 `llm_name` 參數 (#18472)

### `llama-index-llms-cohere` \[0.4.1]

- 擴展 cohere 模型支援 (#18440)

### `llama-index-llms-llama-api` \[0.4.0]

- 透過封裝 OpenAI 修正 LlamaAPI 整合 (#18437)

### `llama-index-llms-perplexity` \[0.3.3]

- 為新模型更新 Perplexity 實作 (#18442)

### `llama-index-llms-openai` \[0.3.37]

- 新增 OpenAI 4.1 支援的模型名稱 (#18456)
- 支援 o3 與 o4-mini (#18473)
- 使用 Azure 的 async 方法時，不再建立 sync openai client (#18471)

### `llama-index-storage-chat-store-sqlite` \[0.1.0]

- 新功能：新增 sqlite chat store (#18432)

### `llama-index-vector-stores-ApertureDB` \[0.0.1]

- 新增 ApertureDB vector store (#18428)

### `llama-index-vector-stores-elasticsearch` \[0.4.3]

- 實作缺失的 BasePydanticVectorStore 方法 (#18454)

## \[2025-04-10]

### `llama-index-core` \[0.12.30]

- 修正 multi-agent 狀態格式 (#18417)
- async reader 方法預設使用 to\_thread (#18418)

### `llama-index-callbacks-arize-pheonix` \[0.5.0]

- 連接新的 phoenix tracing 選項以分離 context (#18415)

### `llama-index-graph-stores-nebula` \[0.4.1]

- 修正 nebula properties get (#18423)

### `llama-index-llms-openai` \[0.3.33]

- 徹底修正 OpenAIResponses 中的 pass-by-reference 錯誤 (#18420)

## \[2024-04-08]

### `llama-index-core` \[0.12.29]

- 在 AgentWorkflow 中更嚴格地執行 agent handoffs (#18399)
- 重構 waiting for events 以處理多個 `wait_for_event` 呼叫 (#18226)
- 修正：🐛 將失效且停止維護的 `tree_sitter_languages` 替換為 `tree_sitter_language_pack` (#18387)
- 修正 SentenceSplitter 在解析大量文本時，pop(0) 導致的高成本問題 (#18359)

### `llama-index-embeddings-huggingface` \[0.5.3]

- 在 HuggingFaceEmbedding 中新增切換進度條的選項 (#18404)

### `llama-index-embeddings-openai-like` \[0.1.0]

- 新增 OpenAILikeEmbedding 並更新文件 (#18364)

### `llama-index-llms-bedrock-converse` \[0.4.15]

- 新功能：為 bedrock converse 新增多模態支援 (#18373)
- 支援 bedrock converse deepseek r1 (#18371)

### `llama-index-llms-ibm` \[0.3.4]

- 快取 watsonx context window (#18350)

### `llama-index-llms-openai` \[0.3.31]

- 修正 openai json 解碼錯誤 (#18352)
- 啟用 openai responses override (#18402)

### `llama-index-llms-vertex` \[0.4.6]

- 為 Gemini 模型新增 ImageBlock 與 TextBlock 支援 (#18344)

### `llama-index-graph-stores-kuzu` \[0.7.0]

- 更新至 Kuzu 0.9.0 (#18382)

### `llama-index-indices-managed-llama-cloud` \[0.6.11]

- 移除 org id kwarg (#18355)

### `llama-index-readers-microsoft-sharepoint` \[0.5.1]

- 修正 Sharepoint 資料夾路徑編碼問題 (#18357)

### `llama-index-readers-papers` \[0.3.2]

- 修正：使用 defusexml 替代 xml.etree (#18362)

### `llama-index-readers-stripe-docs` \[0.3.1]

- 修正：使用 defusexml 替代 xml.etree (#18362)

### `llama-index-readers-uniprot` \[0.1.0]

- 新增 uniprot reader (#18356)

### `llama-index-readers-web` \[0.3.9]

- 修正：使用 defusexml 替代 xml.etree (#18362)

### `llama-index-retrievers-galaxia` \[0.1.0]

- 新增 GalaxiaRetriever (#18317)

### `llama-index-vector-stores-azureaisearch` \[0.3.7]

- 常規維護：在 semantic config 中新增 title 與 keywords (#18354)

### `llama-index-vector-stores-lancedb` \[0.3.2]

- 修正 LanceDB 中的 overwrite 與 append 邏輯 (#18405)

### `llama-index-utils-workflow` \[0.3.1]

- 修正自定義 StopEvents 的 `draw_all_possible_flows` (#18347)

## \[2025-04-01]

### `llama-index-core` \[0.12.28]

- 新增 code act agent + 文件 + 從零開始指南 (#18329)
- 修正 `RichPromptTemplate` 的 template var mapping 並新增文件 (#18309)
- 在 `AgentWorkflow` / `ReActAgent` / `FunctionAgent` / `CodeActAgent` 中支援多模態 agents (#18330)
- 修正新 node 類別在計算 hash 時包含 Node metadata 的問題 (#18303)
- 修正從 `Context.from_dict` 載入時的 `Context._events_queue` (#18304)
- 文件：新增 Langfuse instrumentation (#18321)

### `llama-index-embeddings-fastembed` \[0.3.1]

- 新增 providers kwarg (#18310)

### `llama-index-graph-stores-memgraph` \[0.3.1]

- 將 Memgraph 整合更新至最新語法 (#18319)

### `llama-index-indices-managed-llama-cloud` \[0.6.10]

- 修正建立 client 時的雜項問題 (#18323)

### `llama-index-llms-asi` \[0.1.0]

- 新增 asi llm 整合 (#18292)

### `llama-index-llms-dashscope` \[0.3.2]

- 更新 DashScope 整合，包含新的 tool 處理與依賴版本提升 (#18311)

### `llama-index-llms-ipex-llm` \[0.3.1]

- 修正 IpexLLM 建構子錯誤 (#18200)

### `llama-index-llms-litellm` \[0.4.1]

- LiteLLM：改善 tools streaming 支援，並支援 multimodal inputs (#18314)

### `llama-index-readers-obsidian` \[0.5.1]

- fix：防止透過 symlinks 進行 path traversal (#18320)

### `llama-index-readers-papers` \[0.3.1]

- fix：提升 filename hashing 的穩健性 (#18318)

### `llama-index-tools-mcp` \[0.1.1]

- 修復 `json_type` 為 list（多種可能類型）時的情況 (#18306)

### `llama-index-vector-stores-clickhouse` \[0.4.1]

- fix：修補多個 sql-injection 漏洞 (#18316)

### `llama-index-vector-stores-couchbase` \[0.3.1]

- fix：修補多個 sql-injection 漏洞 (#18316)

### `llama-index-vector-stores-deeplake` \[0.3.3]

- fix：修補多個 sql-injection 漏洞 (#18316)

### `llama-index-vector-stores-jaguar` \[0.3.1]

- fix：修補多個 sql-injection 漏洞 (#18316)

### `llama-index-vector-stores-lantern` \[0.3.1]

- fix：修補多個 sql-injection 漏洞 (#18316)

### `llama-index-vector-stores-nile` \[0.2.2]

- fix：修補多個 sql-injection 漏洞 (#18316)

### `llama-index-vector-stores-milvus` \[0.7.2]

- \[bugfix] Milvus 在 index 已存在時仍嘗試建立 (#18315)
- 為 milvus vector store 增加更多 unit tests (#18331)

### `llama-index-vector-stores-oracledb` \[0.2.1]

- fix：修補多個 sql-injection 漏洞 (#18316)

### `llama-index-vector-stores-singlestoredb` \[0.3.1]

- fix：修補多個 sql-injection 漏洞 (#18316)

## \[2025-03-28]

### `llama-index-core` \[0.12.27]

- 透過延遲匯入（lazy importing）與載入 nltk data 來優化初始 imports (#18289)
- 在 workflow step signatures 中支援 postponed type hints (#18225)

### `llama-index-llms-litellm` \[0.3.1]

- feat：為 LiteLLM 增加 tool calling 支援 (#18235)

### `llama-index-llms-openai` \[0.3.29]

- 增加 `OpenAIResponses` 類別以支援 OpenAI 的 responses API (#18300)
- 在 overridden methods 中實現 type safe 的 structured predict (#18290)

### `llama-index-tools-dappier` \[0.1.0]

- 增加 Dappier Real Time Search 與 AI Recommendations Tools (#18211)

### `llama-index-vector-stores-milvus` \[0.7.1]

- Milvus Vector Store：支援 BM25 全文檢索 (#18281)
- 修復 Milvus vector store 以處理 text field retrieval

## \[2025-03-26]

### `llama-index-core` \[0.12.26]

- 簡化單一 agent workflows 的 FunctionAgent/ReActAgent 用法 (#18227)
- 引入 RichPromptTemplate 以提供類 jinja 的 templating (#18178)
- 增加 structured llm reranker 的實作 (#18216)

### `llama-index-embeddings-azure-openai` \[0.3.2]

- 修復 `api_base` 與 `azure_deployment` 在 `AzureOpenAIEmbedding` 類別中互斥的問題 (#18219)
- 修復 `AzureOpenAIEmbedding` 類別中的 `api_base` 參數 (#18191)

### `llama-index-finetuning` \[0.3.1]

- 更新 SentenceTransformersFinetuneEngine 以公開 transformer checkpoint 相關參數 (#18194)

### `llama-index-llms-dashscope` \[0.3.1]

- 為 dashscope llm 增加 `astream_chat` 與 `astream_complete` (#18196)

### `llama-index-llms-bedrock` \[0.3.8]

- 棄用舊版 google 與 bedrock 套件 (#18210)
- 增加 Bedrock application inference profile 支援 (#18213)
- 修復 foundation-model ARNs 的 provider-resolution (#18283)

### `llama-index-llms-bedrock-converse` \[0.4.12]

- 在 bedrock converse 中不再將 None 附加至 chat history (#18206)
- 增加新的 apac bedrock llms (#18045)
- 在帶有 tools 的 converse chat 中將 chat message 視為 user msg 處理 (#18187)

### `llama-index-llms-gemini` \[0.4.13]

- 確保 `stream_complete` 會累加文字並設定 delta (#18246)

### `llama-index-llms-google-genai` \[0.1.6]

- 棄用舊版 google 與 bedrock 套件 (#18210)
- 修復 google genai tool description (#18242)
- fix：在 google-genai 中支援 anyof, optional 與 union (#18231)

### `llama-index-llms-openai` \[0.3.27]

- 增加 o1-pro 支援 (#18207)
- 提升 openai llm 的預設影像品質 (#18258)

### `llama-index-llms-text-generation-inference` \[0.3.2]

- 修復 TextGenerationInference 中的 `model_name` 驗證錯誤，該錯誤並非由 TGI endpoint 要求而導致 exception (#18234)

### `llama-index-llms-vertx` \[0.4.4]

- 棄用舊版 google 與 bedrock 套件 (#18210)
- Vertex LLM 不處理 FunctionCall tools (#18201)

### `llama-index-readers-file` \[0.4.7]

- feat: 為 pandas excel reader 新增包含欄位的 headers 以改善資料檢索 (#18233)

### `llama-index-storage-chat-store-dynomodb` \[0.3.1]

- feat: 為 DynamoDB chat store 新增 TTL 支援 (#18084)

### `llama-index-storage-chat-store-redis` \[0.4.1]

- 修復 Redis chat store 中 Coroutine 未被 await 的 Runtime Warning (#18274)

### `llama-index-vector-stores-milvus` \[0.6.1]

- 在 milvus filters 中對單引號進行轉義 (#18244)
- 提升 Milvus async\_add 的速度 (#18243)

### `llama-index-vector-stores-qdrant` \[0.6.0]

- 更新 qdrant 以始終優先使用 named vectors (#18192)
- 提升 qdrant 版本 python deps (#18273)

## \[2025-03-18]

### `llama-index-core` \[0.12.25]

- 確保 splitters 的 CHUNKING\_REGEX 中保留原始文字 (#18054)
- 在不使用 llama-index-readers-file 套件的情況下使用 SimpleDirectoryReader (#18173)
- 改進 utils.py 與 exec\_utils.py 中的 Annotations 與錯誤處理 (#18153)
- 為 SemanticDoubleMergingSplitterNodeParser 新增 `build_semantic_nodes_from_nodes` (#18114)
- fix: 優化 Context 物件的記憶體管理 (#18170)
- fix: 允許在 workflows 結束後從 context 串流 events (#18174)
- feat: 為 Context 類別新增 clear 方法 (#18136)

### `llama-index-embeddins-clip` \[0.4.0]

- 取消 ClipEmbedding deps 的版本固定 (#18165)

### `llama-index-embeddings-netmind` \[0.1.0]

- 新增 netmind 整合 (#18078)

### `llama-index-indices-managed-llama-cloud` \[0.6.9]

- 修復 LlamaCloudCompositeRetriever 的 kwargs (#18141)

### `llama-index-llms-bedrock-converse` \[0.4.10]

- Bug fix: 修復呼叫不含參數之 tools 的問題 (#18143)
- 為 BedrockConverse 的 chat 與 achat 方法新增 token 計數 (#18148)

### `llama-index-llms-contextual` \[0.0.1]

- 修復 contextual glm 的問題 (#18145)

### `llama-index-llms-google-genai` \[0.1.4]

- genai 圖片輸出 (#18138)

### `llama-index-llms-langchain` \[0.6.1]

- 在 llama-index-llms-langchain 中將已棄用的 predict 替換為 invoke (#18169)

### `llama-index-llms-netmind` \[0.1.0]

- 新增 netmind 整合 (#18078)

### `llama-index-llms-novita` \[0.1.0]

- 新增 NovitaAI llm 類別 (#18134)

### `llama-index-postprocessor-aimon-rerank` \[0.1.0]

- 將 AIMon reranker 整合至 LlamaIndex node postprocessors (#18087)

### `llama-index-readers-mongodb` \[0.3.1]

- feat(mongo reader): field\_extractors (#18063)

### `llama-index-tools-vectara-query` \[0.3.1]

- 更新 Vectara Tool 以支援 VectaraIndex 的 Metadata 變更 (#18126)

### `llama-index-vector-stores-azurecosmosnosql` \[1.3.2]

- Fix: AzureCosmosNoSQL vector\_store；根據 `ref_doc_id` 進行刪除 (#18120)

### `llama-index-vector-stores-pinecone` \[0.4.5]

- 提升相容的 pinecone 版本 (#18113)

## \[2025-03-13]

### `llama-index-core` \[0.12.24]

- 修復 get content node metadata 模板重複的問題 (#18110)
- 在 multimodal vector store/query engine 中移除 multimodal llms 的 assert (#18112)
- fix: 使 run\_step 回傳該步驟產生的所有 events (#18082)
- fix(multimodal nodes): 在開啟前檢查圖片路徑是否為檔案 (#18043)

### `llama-index-embeddings-google-genai` \[0.1.0]

- Google genai embeddings (#18079)

### `llama-index-graph-stores-neptune` \[0.3.2]

- 修復 Neptune 的 upsert\_triplet 方法中的 TypeError (#18051)

### `llama-index-indices-managed-vectara` \[0.4.2]

- 更新 Vectara Index 以同時回傳 document 層級與頁面層級的 metadata (#17976)

### `llama-index-llms-contextual` \[0.1.0]

- Contextual Generate 模型 (#17913)

### `llama-index-llms-google-genai` \[0.1.3]

- 為 google 使用 GenAI 套件 (#17939)
- 修復 gemini roles (#18108)
- 修復 null model meta 參照 (#18109)
- \[BUG FIX] Google genai vertexai 錯誤 (#18070)

### `llama-index-memory-mem0` \[0.3.0]

- Mem0Memory 整合問題：針對 Mem0 API 參數變更進行更新 (#18066)

### `llama-index-postprocessor-contextual-rerank` \[0.1.0]

- Contextual reranker (#18075)

### `llama-index-readers-elasticsearch` \[0.3.1]

- 修復 ElasticsearchReader 的冗餘問題 (#18106)

### `llama-index-readers-google` \[0.6.1]

- 將 redirect URI port 使用 int 類型 (#18097)

## \[2025-03-07]

### `llama-index-core` \[0.12.23]

- 新增 `merging_separator` 參數，允許在 semantic splitter 中指定 chunk 合併分隔符號 (#18027)
- 在 BaseWorkflowAgent 類別中新增對執行單一 agent workflows 的支援 (#18038)- 修復在沒有明確 system message 的情況下建立 ReactAgent 時產生的錯誤 (#18041)
- 在 TokenTextSplitter 中新增 keep\_whitespaces 欄位 (#17998)
- 在 AgentWorkflow 中不再將 raw tool output 轉換為字串 (#18006)

### `llama-index-embeddings-ollama` \[0.6.0]

- feat: 在 OllamaEmbedding 類別中新增 client\_kwargs 參數 (#18012)

### `llama-index-llms-anthropic` \[0.6.10]

- anthropic 快取與思考功能更新 (#18039)
- 允許快取 tool results (#18028)
- 支援快取 anthropic system prompt (#18008)
- 確保恢復 workflow 能正常運作 (#18023)
- \[MarkdownNodeParser] 新增可自定義的 header path 分隔符號 (#17964)
- feat: 當 stop event 為自定義時，run() 將回傳 event 實例 (#18001)

### `llama-index-llms-azure-openai` \[0.3.2]

- AzureOpenAI: api\_base 與 azure\_endpoint 互斥 (#18037)
- 在 AzureOpenAI 中新增 base\_url (#17996)

### `llama-index-llms-bedrock-converse` \[0.4.8]

- boto3 model 要求必須提供 message text (#17989)

### `llama-index-llms-ollama` \[0.5.3]

- 將 Ollama LLM 中的 request\_timeout 設為選填 (#18007)

### `llama-index-llms-mistralai` \[0.4.0]

- MistralAI 支援 multimodal content blocks (#17997)

### `llama-index-readers-file` \[0.4.6]

- Bugfix: 當安裝 PyTorch 時，ImageVisionLLMReader 的 inference 使用 `torch.no grad()` (#17970)

### `llama-index-storage-chat-store-mongo` \[0.1.0]

- Feat/mongo chat store (#17979)

### `llama-index-core` \[0.12.23]

- 新增 `merging_separator` 參數，允許在 semantic splitter 中指定 chunk merge 分隔符號 (#18027)
- 在 BaseWorkflowAgent 類別中新增對執行單一 agent workflows 的支援 (#18038)
- 修復在沒有明確 system message 的情況下建立 ReactAgent 時產生的錯誤 (#18041)
- 在 TokenTextSplitter 中新增 keep\_whitespaces 欄位 (#17998)

## \[2025-02-28]

### `llama-index-core` \[0.12.22]

- 修復 agentworkflow 在最終回應時的 tool call 追蹤問題 (#17968)

### `llama-index-readers-github` \[0.6.0]

- 確保 Github reader 使用 timeout 與 retries 參數 (#17959)

### `llama-index-readers-web` \[0.3.7]

- chore: 更新 FireCrawlWebReader 整合以支援 extract (#17957)

## \[2025-02-27]

### `llama-index-core` \[0.12.21]

- fix: 移除 workflow 測試中的警告 (#17943)
- fix: 以 step-wise 方式執行 workflow 時，將 step workers 納入考量 (#17942)
- feat: 在 workflow 類別中自動偵測自定義的 start 與 stop events (#17865)
- Feature/移除 retriever tool template override (#17909)
- 僅在實際偵測到「Answer:」時才修改 delta (#17901)
- 修復 CitationQueryEngine 中 response\_synthesizer 的 init 函式 (#17897)
- 修復 ChatSummaryMemoryBuffer.\_summarize\_oldest\_chat\_history (#17845)
- fix: 全面提升 base64 偵測的穩健性 (#17930)
- fix: 當 steps 執行非同步工作時，stepwise 執行會中斷 (#17914)
- 更安全的 workflow 取消操作 + 修復恢復 context 的 bug (#17938)

### `llama-index-cli` \[0.4.1]

- fix: 在執行 shell 指令前對使用者輸入進行 escape 處理 (#17953)
- llamaindex-cli 正確處理 glob patterns (#17904)

### `llama-index-embeddings-gaudi` \[0.2.1]

- fix: 移除 cache\_dir Pydantic 欄位驗證 (#17947)

### `llama-index-indices-managed-vectara` \[0.4.1]

- 支援自定義 vectara\_base\_url (#17934)

### `llama-index-llms-anthropic` \[0.6.7]

- fix: 呼叫 Anthropic Messages API 時，tools 參數不能為 Null (#17928)

### `llama-index-llms-bedrock` \[0.3.4]

- feat(bedrock): 新增 Claude 3.7 Sonnet 模型支援 (#17950)

### `llama-index-llms-bedrock-converse` \[0.4.7]

- feat(bedrock converse): 新增 Meta Llama 3.3 70B instruct 模型支援 (#17915)

### `llama-index-llms-gemini` \[0.4.11]

- feat: 將 Gemini 允許的最大模型 temperature 更改為 2.0 (#17886)

### `llama-index-llms-ibm` \[0.3.3]

- 更新 WatsonxLLM.metadata 屬性，以避免在 model\_limits 欄位不存在時產生驗證錯誤 (#17839)

### `llama-index-llms-openai` \[0.3.24]

- 新增 gpt-4.5-preview (#17954)
- fix: 透過 vLLM 進行 openai-like openai agent streaming (#17927)
- 修復在 assistant messages 為空時產生的「Invalid value for ‘content’: expected a string, got null.」openai 錯誤 (#17921)

### `llama-index-multi-modal-llms-azure-openai` \[0.4.0]

- 重構為一般 AzureOpenAI llm 的輕量封裝（同樣支援使用 content blocks 的圖片），以避免重複程式碼 (#17951)

### `llama-index-multi-modal-llms-huggingface` \[0.4.2]

- LlamaMultiModal 類別現在支援僅限文字的 prompt (#17855)

### `llama-index-multi-modal-llms-openai` \[0.5.0]

- 重構為一般 OpenAI llm 的輕量封裝（同樣支援使用 content blocks 的圖片），以避免重複程式碼 (#17951)

### `llama-index-postprocessor-ibm` \[0.1.0]

- feat: 新增 ibm-watsonx-ai rerank 整合 (#17900)

### `llama-index-readers-web` \[0.3.6]

- fix: KnowledgeBaseWebReader 現在會遵循 max\_depth 設定 (#17949)

### `llama-index-retrievers-tldw` \[0.0.1]

- 為 Retrievers 新增 tl;dw AI 整合 (#17872)

### `llama-index-tools-valyu` \[0.1.0]

- feat: 新增 Valyu 整合 (#17892)

### `llama-index-vector-stores-azureaisearch` \[0.3.6]

- azureaisearch: 建立 index 時，將預設名稱設為 mySemanticConfig (#17908)

### `llama-index-vector-stores-databricks` \[0.4.0]

- build: llama-index-vector-stores-databricks 現在支援 python3=3.9,<4.0 (#17937)

### `llama-index-vector-stores-duckdb` \[0.3.1]

- fix: 在 DuckDB vector store 的 SQL 查詢中對 params 進行 escape 處理 (#17952)

### `llama-index-vector-stores-elasticsearch` \[0.4.2]

- fix: 修正 adelete 方法並在 elasticsearch vector store 中新增 delete\_nodes (#17890)

## \[2025-02-25]

### `llama-index-core` \[0.12.20]

- feat: 為檢索到的圖片 node 附加更多 metadata (#17868)
- fix: 當 LLM 回應不包含任何 chat messages 時，FunctionAgent 與 ReActAgent 會報錯 (#17884)
- fix: 將 Embedding Functions 轉換為 Async (#17888)

### `llama-index-networks` \[0.6.0]

- fix: 提升 python-jose 版本 (#17866)

### `llama-index-vector-stores-redis` \[0.5.0]

- fix: 更新以支援 redisvl 0.4.0 (#17902)

### `llama-index-llms-anthropic` \[0.6.6]

- fix: 新增對 Claude 3.7 系列模型的支援 (#17905)

### `llama-index-readers-microsoft-outlook-emails` \[0.1.1]

- fix: 修正 microsoft\_outlook\_emails 整合的 import 路徑錯誤 (#17867)

### `llama-index-llms-vertex` \[0.4.3]

- fix: 修正包含 tool calls 的 chat messages 錯誤對應到 Vertex message 的問題 (#17893)

### `llama-index-llms-bedrock-converse` \[0.4.6]

- feat: 新增對 Claude 3.7 Sonnet 模型的支援 (#17911)

## \[2025-02-17]

### `llama-index-core` \[0.12.19]

- 新增 sync/async Function tool callback (#16637)
- 微調 template vars 的 regex

### `llama-index-experimental` \[0.5.4]

- 使用 duck db 的實驗性自然語言 retrievers (#15642)

### `llama-index-graph-stores-memgraph` \[0.3.0]

- 修正 memgraph 的版本 (#17842)

### `llama-index-indices-managed-llama-cloud` \[0.6.7]

- 圖片 Metadata 測試與 Sync 實作 (#17844)

### `llama-index-postprocessor-nvidia-rerank` \[0.4.2]

- NVIDIARerank 新增 http\_client 參數以傳遞自定義 client (#17832)

### `llama-index-llms-mistralai` \[0.3.3]

- 支援 mistral saba (#17847)

## \[2025-02-16]

### `llama-index-core` \[0.12.18]

- 改善 prompt helper 的 multimodal 支援 (#17831)
- 保留來自 `@dispatcher.span` 的 return type (#17817)
- 靜音 nltk downloader (#17816)
- 在 `astream_chat()` 中保留 asyncio tasks 的引用 (#17812)

### `llama-index-indices-managed-llama-cloud` \[0.6.6]

- 從 llamacloud retriever 回傳圖片 node 時，包含檔案與頁面 metadata (#17823)
- 改善 llamacloud indices 的錯誤記錄 (#17827)

### `llama-index-indices-managed-vertexai` \[0.2.1]

- 新增 textnode metadata (#17814)

### `llama-index-llms-anthropic` \[0.6.5]

- feat: ✨ 新增對 anthropic claude-3-5-haiku-latest 模型名稱的支援 (#17818)

### `llama-index-llms-openai` \[0.3.20]

- 修正舊版 o1 模型的 openai developer message (#17833)

### `llama-index-readers-microsoft-outlook-emails` \[0.1.0]

- feat: 新增 Microsoft Outlook Email Reader 整合 (#17829)

### `llama-index-tools-mcp` \[0.1.0]

- feat: 新增 mcp tool spec (#17795)

### `llama-index-tools-playwright` \[0.1.1]

- Fix: 將 Playwright browser tool 從 sync 改為 async (#17808)

### `llama-index-vector-stores-azureaisearch` \[0.3.5]

- 擴充 AzureAISearchVectorStore 的 filter 選項 (#17811)
- azureaisearch: 在 hybrid search 中優先使用 hybrid\_top\_k 而非 similarity\_top\_k (#17612)
- azureaisearch: 將 semantic configuration name 的預設值設為 None (#17807)

### `llama-index-vector-stores-mariadb` \[0.3.1]

- MariaDB Vector Store 整合：新增調校參數與工具函式 (#17791)

## \[2025-02-11]

### `llama-index-core` \[0.12.17]

- 在聊天訊息中新增對 AudioBlocks 的支援（目前僅限 OpenAI）(#17780)
- 修復：SimpleDirectoryReader 元資料處理時區不一致的問題 (#17724)

### `llama-index-agent-openai` \[0.4.4]

- 在 openai assistant agent 中新增額外參數 (#17729)
- 避免 `aput_messages` 中的 async race conditions (#17754)

### `llama-index-embeddings-siliconflow` \[0.2.1]

- 為 siliconflow llm 與 embeddings 新增重試邏輯 (#17771)

### `llama-index-graph-rag-cognee` \[0.1.3]

- Cognee 整合版本更新 (#17769)

### `llama-index-graph-stores-neptune` \[0.3.1]

- 修復：更新 neptune 整合中的 upsert\_triplet 方法 (#17727)

### `llama-index-llms-gemini` \[0.4.9]

- 修復 gemini tool choice (#17747)
- 修復 gemini 多輪 tool calling (#17764)
- chore：為最新的 gemini structured gen 新增測試 (#17762)

### `llama-index-llms-ibm` \[0.3.2]

- 修復：更新 `WatsonxLLM.stream_chat()` 以適應即將推出的 `ibm-watsonx-ai 1.2.7` 並避免錯誤 (#17772)

### `llama-index-llms-langchain` \[0.6.0]

- 將 llama-index-llms-langchain 更新至最新的 langchain API，以移除棄用警告 (#17770)

### `llama-index-llms-ollama` \[0.5.2]

- Ollama 透過 ImageBlocks 支援 Native Multimodal (#17759)

### `llama-index-llms-openai` \[0.3.19]

- 為 openai 新增音訊支援 (#17780)

### `llama-index-llms-openvino-genai` \[0.1.0]

- 新增 llama-index-llms-openvino-genai 套件 (#17714)

### `llama-index-llms-siliconflow` \[0.2.1]

- 為 siliconflow llm 與 embeddings 新增重試邏輯 (#17771)

### `llama-index-readers-whisper` \[0.1.0]

- 新增 OpenAI Whisper Reader (#17778)

### `llama-index-retrievers-bm25` \[0.5.2]

- BM25Retriever：改善 UnicodeError 處理與編碼靈活性 (#17643)

### `llama-index-retrievers-kendra` \[0.1.0]

- 新增 kendra retriever (#17760)

### `llama-index-tools-jira` \[0.1.0]

- Jira tools 整合 (#17763)

### `llama-index-tools-playwright` \[0.1.0]

- feat: playwright 瀏覽器工具 (#17706)

### `llama-index-vector-stores-elasticsearch` \[0.4.1]

- 修復 delete 查詢遺漏關鍵字後綴的問題 (#17750)

## \[2025-01-05]

### `llama-index-core` \[0.12.16]

- 在執行 ReAct 時，對某些模型產生的前導空格採取較寬鬆的處理 (#17701)
- 修復 `user_msg` 與 `chat_history` AgentWorkflow 的輸入問題 (#17690)

### `llama-index-embeddings-oci-data-science` \[0.1.0]

- 新增 OCI Data Science Model Deployment Embedding 整合 (#17243)

### `llama-index-embeddings-vllm` \[0.1.0]

- 為 embedding 新增 vLLM 離線推論支援 (#17675)

### `llama-index-embeddings-voyageai` \[0.3.5]

- 小幅修復 voyageai 的 async 問題 (#17698)

### `llama-index-llms-gemini` \[0.4.7]

- 支援 gemini 2.0 (#17720)
- feat: 為 gemini (google-generativeai) 支援基礎 function call (#17696)

### `llama-index-llms-oci-data-science` \[0.1.0]

- 新增 OCI Data Science Model Deployment LLM 整合 (#17241)

### `llama-index-llms-oci-genai` \[0.3.1]

- 提供傳遞 auth\_file\_location 的選項，以覆蓋預設的設定檔路徑（例如 \~/.oci/config）(#17695)

### `llama-index-llms-ollama` \[0.5.1]

- 修復：避免在 streaming 時遺漏 tool calls

### `llama-index-llms-openai` \[0.3.17]

- 修復：O1 中的 max\_tokens (#17703)
- 支援 o3 mini (#17689)
- 修復 max\_tokens，並為 openai 推理模型新增 reasoning\_effort (#17694)

### `llama-index-readers-obsidian` \[0.5.0]

- 改進 Obsidian Reader (#17699)

### `llama-index-tools-scrapegraph` \[0.1.1]

- feat: 新增 scrapegraph endpoint (#17709)

## \[2025-01-31]

### `llama-index-core` \[0.12.15]

- 為 FunctionCallingLLM.predict\_and\_call 新增 error\_on\_tool\_error 參數 (#17663)
- 從 pydantic 欄位獲取 tool 描述 (#17679)
- 修復：使 ctx.\_events\_buffer 可進行 json 序列化 (#17676)
- feat: 允許 simple directory reader 排除空檔案 (#17656)
- 改進 markdown llm 的輸出解析 (#17577)
- 修復預設 plan refine prompt 中的小錯字 (#17644)

### `llama-index-agent-openai` \[0.4.3]

- 修復執行平行 tool calling 時來源重複的問題 (#17645)

### `llama-index-embeddings-text-embeddings-inference` \[0.3.2]

- 為 TextEmbeddingsInference 新增 endpoint 參數 (#17598)

### `llama-index-llms-bedrock-converse` \[0.4.5]

- 修復 bedrock function calling (#17658)

### `llama-index-llms-cortex` \[0.1.0]

- 新增 Snowflake Cortex 整合 (#17585)

### `llama-index-llms-fireworks` \[0.3.2]

- fireworks 現在支援 Deepseek-r1 (#17657)
- fireworks 現在支援 Deepseek-v3 (#17518)

### `llama-index-llms-gemini` \[0.4.5]

- 為 async 呼叫新增 chat decorators (#17678)

### `llama-index-llms-llama-cpp` \[0.4.0]

- 更新 llama-cpp 整合與文件 (#17647)

### `llama-index-vector-stores-azureaisearch` \[0.3.3]

- 功能/修正：解決因硬編碼參數導致 Azure AI Search Hybrid Semantic Search 無法使用的問題 (#17683)

### `llama-index-vector-stores-pinecone` \[0.4.4]

- `get_nodes()` 現在接受 include\_values 參數以回傳 embeddings (#17635)

## \[2025-01-25]

### `llama-index-core` \[0.12.14]

- 修正非 openai llms 的 agentworkflow handoffs (#17631)
- 修正 multi-agent workflow demo notebook 的小問題 (#17628)

### `llama-index-embeddings-bedrock` \[0.5.0]

- 實作 async bedrock embeddings (#17610)

### `llama-index-llms-bedrock-converse` \[0.4.4]

- 修正 bedrock converse 中的 prompt stacking (#17613)

### `llama-index-llms-deepseek` \[0.1.0]

- DeepSeek 官方 API LLM (#17625)

### `llama-index-readers-google` \[0.6.0]

- GoogleDriveReader 支援檔案副檔名 (#17620)

## \[2025-01-23]

### `llama-index-core` \[0.12.13]

- 修正 MarkdownNodeParser 中關於 markdown 層級與 stack depth 的 header\_path bug (#17602)
- 進階 text 轉 sql 樣本列，為 few-shot prompts 新增列檢索 (#17479)
- 使 ReAct observation 的 message role 可配置 (#17521)
- 修正 AgentWorkflow 中重建 tool 的問題 (#17596)
- chat templates 支援 content blocks (#17603)
- 透過新的 `DocumentContextExtractor` 新增 contextual retrieval 支援 (#17367)

### `llama-index-graph-stores-memgraph` \[0.2.1]

- Memgraph 整合支援 Vector index (#17570)

### `llama-index-graph-stores-neo4j` \[0.4.6]

- 改善 neo4j 物件的連線並新增部分測試 (#17562)

### `llama-index-indices-managed-llama-cloud` \[0.6.4]

- 為 composite retrieval 新增 framework 整合 (#17536)

### `llama-index-llms-langchain` \[0.5.1]

- streaming 時獲取有效的字串 (#17566)

### `llama-index-llms-mistralai` \[0.3.2]

- 更新 mistral 中的 function calling 模型 (#17604)

### `llama-index-llms-openai` \[0.3.14]

- 修正 tool calls 的 openai.BadRequestError: Invalid value for ‘content’: expected a string, got null (#17556)

### `llama-index-readers-file` \[0.4.3]

- 重構 markdown\_to\_tups 方法以更佳地處理多級標題 (#17508)

### `llama-index-readers-web` \[0.3.5]

- 功能：Agentql Web Loader (#17575)

### `llama-index-tools-linkup-research` \[0.3.0]

- 新增 linkup tool (#17541)

### `llama-index-tools-notion` \[0.3.1]

- 修正：更正 NotionPageReader 中 “load\_data” 的輸入參數 (#17529)

### `llama-index-vector-stores-pinecone` \[0.4.3]

- 建置：🆙 將 pinecone-client 替換為 pinecone 套件 (#17587)

### `llama-index-vector-stores-postgres` \[0.4.2]

- 新增對 halfvec 向量類型的支援 (#17534)

## \[2025-01-20]

### `llama-index-core` \[0.12.12]

- 功能：新增 AgentWorkflow 系統以支援單一與多 agent workflows (#17237)
- 修正 ImageNode 中的 image-path 驗證 (#17558)

### `llama-index-indices-managed-vectara` \[0.4.0]

- (重大變更) API 遷移 (#17545)

### `llama-index-llms-anthropic` \[0.6.4]

- 功能：為 Anthropic 支援直接的 PDF 處理 (#17506)

### `llama-index-llms-fireworks` \[0.3.1]

- fireworks 現在支援 Deepseek-v3 (#17518)

### `llama-index-llms-stepfun` \[1.0.0]

- 功能：新增 stepfun 整合 (#17514)

### `llama-index-multi-modal-llms-gemini` \[0.5.0]

- 重構：將 GeminiMultiModal 設為 Gemini 的輕量封裝 (#17501)

### `llama-index-postprocessor-longllmlingua` \[0.4.0]

- 新增 longllmlingua2 整合 (#17531)

### `llama-index-readers-web` \[0.3.4]

- 功能：Hyperbrowser Web Reader (#17489)

## \[2025-01-15]

### `llama-index-core` \[0.12.11]

- 修正：MediaResource validator 中的 bug (#17509)
- 在 MarkdownElementNodeParser 的 md to df 中處理 pandas 錯誤 (#17511)
- Bugfix：重複的引用 nodes (#17440)
- 透過更新 MarkdownReader 中的 markdown 格式修正問題 #17397 (#17429)
- 功能：支援透過 additional\_kwargs 將圖片新增至 ChatMessage (#17477)- feat: async semantic splitter noder parser (#17449)
- 在 schema llm extractor 中增加更多例外處理 (#17432)

### `llama-index-agent-openai` \[0.4.2]

- 為 OpenAIAgentWorker 實作 Async 記憶體管理 (#17375)

### `llama-index-embeddings-huggingface` \[0.5.0]

- 支援 multimodal huggingface embeddings (#17463)

### `llama-index-embeddings-gemini` \[0.3.1]

- 為 gemini 增加 request options (#17452)

### `llama-index-embeddings-opea` \[0.1.0]

- 在 Llama-Index 中增加對 OPEA LLMs 的支援 (#16666)

### `llama-index-embeddings-upstage` \[0.4.1]

- bugfix: 修正 upstage embedding 的可用模型對照表 (#17460)

### `llama-index-graph-stores-neo4j` \[0.4.5]

- 修正 neo4j schema bug (#17448)

### `llama-index-llms-gemini` \[0.4.3]

- 為 gemini 增加 request options (#17452)

### `llama-index-llms-opea` \[0.1.0]

- 在 Llama-Index 中增加對 OPEA LLMs 的支援 (#16666)

### `llama-index-llms-openai` \[0.3.13]

- 調整 openai 模型 temperature 以接受 0 到 2 之間的值 (#17453)

### `llama-index-multi-modal-llms-bedrock` \[0.1.0]

- 增加 Multi Modal Bedrock 整合 (#17451)

### `llama-index-postprocessor-bedrock-rerank` \[0.3.1]

- 當輸入的 nodes 數量較少時，變更 `top_n` (#17374)

### `llama-index-readers-slack` \[0.3.1]

- 增加僅允許公開 slack 頻道之支援 (#17399)

### `llama-index-storage-chat-store-tablestore` \[0.1.0]

- Tablestore 支援 ChatStore/KvStore/DocStore/IndexStore (#17473)

### `llama-index-storage-docstore-tablestore` \[0.1.0]

- Tablestore 支援 ChatStore/KvStore/DocStore/IndexStore (#17473)

### `llama-index-storage-index-store-tablestore` \[0.1.0]

- Tablestore 支援 ChatStore/KvStore/DocStore/IndexStore (#17473)

### `llama-index-storage-kvstore-tablestore` \[0.1.0]

- Tablestore 支援 ChatStore/KvStore/DocStore/IndexStore (#17473)

### `llama-index-vector-stores-mariadb` \[0.3.0]

- 在 MariaDB vector store 整合中支援 MariaDB 11.7 (#17497)

### `llama-index-vector-stores-neptune` \[0.3.1]

- 增加測試，修正缺失的方法 (#17485)

### `llama-index-vector-stores-qdrant` \[0.4.3]

- 為 Qdrant Vector store 增加新 operator (#17490)

## \[2024-12-31]

### `llama-index-core` \[0.12.10]

- 從 schema llm extractor 中移除 asserts (#17425)
- feat: 在 FunctionTools 中支援使用 typing.Annotated 來增加參數描述 (#17411)
- 為 ImageNode 增加 image\_mimetype 推測功能 (#17422)

### `llama-index-embeddings-nvidia` \[0.3.1]

- NVIDIA 支援 v2 Embedding & Reranking NIMs #(17410)

### `llama-index-embeddings-openvino` \[0.5.1]

- 更新 OpenVINO 套件的相依項目 (#17419)

### `llama-index-multi-modal-llms-openai` \[0.4.2]

- 為 multi modal llms 增加對 gpt-4o-2024-08-06 的支援 (#17405)

### `llama-index-packs-raptor` \[0.3.1]

- 修正 llama\_index.packs.raptor 的 tree\_traversal 檢索問題 (#17406)

### `llama-index-postprocessor-openvino-rerank` \[0.4.1]

- 更新 OpenVINO 套件的相依項目 (#17419)

### `llama-index-readers-file` \[0.4.2]

- 從 SimpleDirectoryReader 的預設 loader 中移除 MarkdownReader (#17412)

### `llama-index-core` \[0.12.9]

- 清理 schema extractor 中的 type hints (#17394)
- 修正 LLM Reranking 在處理格式錯誤的 LLM 回應時產生的 IndexError (#17353)

### `llama-index-llms-bedrock-converse` \[0.4.3]

- 修正 Bedrock Converse 使用 Tools 時的 Regression 問題 (#17364)

### `llama-index-llms-sagemaker-endpoint` \[0.3.1]

- 在 SageMakerLLM 中將 `aws_region_name` 傳遞至 `get_aws_service_client()` (#12000)

### `llama-index-postprocessor-voyageai-rerank` \[0.3.2]

- 修正 VoyageAIRerank 建構子在截斷時的問題 (#17343)

### `llama-index-readers-gitlab` \[0.3.1]

- Fix: 正確地從 Gitlab Repo 增加 blob documents (#17392)

### `llama-index-readers-rss` \[0.3.2]

- 修正 rss 中的微小問題 (#17351)

### `llama-index-readers-web` \[0.3.3]

- fix: 防止 `get_article_urls` 發生無限遞迴 (#17360)

### `llama-index-vector-stores-azureaisearch` \[0.3.2]

- azureaisearch: 為 async 查詢增加 semantic search 模式支援 (#17335)

### `llama-index-vector-stores-azurecosmosnosql` \[1.3.1]

- 修正 storeindex cosmosnosql 查詢問題 - (BadRequest) (#17385)

### `llama-index-vector-stores-milvus` \[0.5.0]

- feat: milvus async (#17378)

### `llama-index-vector-stores-opensearch` \[0.5.2]

- 修正 property 名稱拼字錯誤 (#17365)
- 修正使用 async aoss vector store 初始化時的 bug (#17340)

### `llama-index-vector-stores-tablestore` \[0.2.2]

- TablestoreVectorStore: 支援 hybrid query，並修改部分 documents (#17366)
- TablestoreVectorStore 在將 embedding 寫入 store 時會檢查 Dimension (#17321)

### `llama-index-vector-stores-qdrant` \[0.4.2]

- 修復 qdrant filter，解決 `query_str` 為 None 的問題 (#17377)

### `llama-index-vector-stores-weaviate` \[1.3.1]

- 為 weaviate 實作 `client_kwargs["custom_batch"]` (#17347)

## \[2024-12-20]

### `llama-index-core` \[0.12.8]

- 修復 document serialization 中的 exclude text 問題 (#17341)
- 修復 awrite\_response\_to\_history 中遺漏 aput 的問題 (#17338)

### `llama-index-graph-rag-cognee` \[0.1.0]

- Cognee 整合 (#17314)

### `llama-index-llms-openai` \[0.3.12]

- 微調 o1 function calling 要求 (#17328)

## \[2024-12-18]

### `llama-index-core` \[0.12.7]

- fix: 為 langchain callback handler 新增 timeout (#17296)
- fix: 提高 Document serialization event 的向下相容性 (#17312)

### `llama-index-embeddings-voyageai` \[0.3.4]

- 為 VoyageAI 的 embedding model 開放更多 keyword arguments (#17315)

### `llama-index-llms-keywordsai` \[0.1.0]

- 新增 KeywordsAI LLM (#16860)

### `llama-index-llms-oci-genai` \[0.4.0]

- 新增 OCI Generative AI tool calling 支援 (#16888)

### `llama-index-llms-openai` \[0.3.11]

- 支援新版 o1 models (#17307)

### `llama-index-postprocessor-voyageai-rerank` \[0.3.1]

- VoyageAI Reranker 可選的 API Key (#17310)

### `llama-index-vector-stores-azureaisearch` \[0.3.1]

- 改善 async search client 處理 (#17319)

### `llama-index-vector-stores-azurecosmosmongo` \[0.4.0]

- CosmosDB 寫入時間戳記 bugfix (#17290)

### `llama-index-vector-stores-azurecosmosnosql` \[1.3.0]

- CosmosDB 寫入時間戳記 bugfix (#17290)

## \[2024-12-17]

### `llama-index-core` \[0.12.6]

- \[bug fix] 確保 Workflow 執行後，StopEvent 會從 Context.\_in\_progress\[“\_done”] 中清除 (#17300)
- fix: 為 langchain callback handler 新增 timeout (#17296)
- 微調 react prompts 中的 User 與 tool (#17273)
- refact: 重構 Document 以原生支援 multimodal (#17204)
- fix: 使 ImageDocument 繼承自 Document 以保持向下相容 (#17259)
- fix: ImageBlock 支援已 base64 編碼的資料 (#17244)
- fix(metrics): 修復 NDCG 計算並更新先前測試 (#17236)
- fix: 移除 llama-index-core 中的 llama-index-legacy 依賴 (#17231)
- 優化 function tools 的預設文件生成 (#17208)

### `llama-index-embeddings-voyageai` \[0.3.3]

- 新增對 voyageai >=0.3.0 的支援 (#17120)
- 引入 VoyageAI 新的 multimodal embeddings model (#17261)
- VoyageAI multimodal embedding 修正 (#17284)

### `llama-index-experimental` \[0.5.2]

- 修復 experimental JSONalyzeQueryEngine 的 import 錯誤 (#17228)

### `llama-index-grapg-stores-neo4j` \[0.4.4]

- 新增 cypher corrector 並允許 graph schema 過濾 (#17223)
- 為 neo4j graph 新增 timeout 設定 (#17267)
- 為 neo4j enhanced schema 新增 text 與 embedding 類型 (#17289)

### `llama-index-llms-anthropic` \[0.6.3]

- 為 anthropic 新增 content blocks (#17274)
- 不向 anthropic 發送空白內容 (#17278)
- 為 v0.41.0 版本更新 anthropic 類型 import (#17299)
- 修復 Anthropic tokenizer protocol (由 Devin 修復) (#17201)

### `llama-index-llms-bedrock` \[0.3.3]

- 新增 Amazon bedrock guardrails (#17281)

### `llama-index-llms-bedrock-converse` \[0.4.2]

- 新增 Amazon bedrock guardrails (#17281)

### `llama-index-llms-gemini` \[0.4.1]

- 支援 Gemini 2.0 (#17249)

### `llama-index-llms-mistralai` \[0.3.1]

- 為 mistral chat messages 新增 tool call id/name (#17280)

### `llama-index-llms-nvidia` \[0.3.1]

- 將 llama 3.3-70b 標記為支援 function-calling (#17253)

### `llama-index-llms-openai` \[0.3.10]

- 修復 tool calls 的 openai message dicts (#17254)

### `llama-index-llms-text-generation-inference` \[0.3.1]

- Fix: TGI context window (#17252)

### `llama-index-multi-modal-llms-anthropic` \[0.3.1]

- 在 anthropic multi modal llms 中處理更多回應類型 (#17302)

### `llama-index-readers-confluence` \[0.3.1]

- 支援 Confluence cookies (#17276)

### `llama-index-vector-stores-milvus` \[0.4.0]

- 從 “vector\_store\_kwargs” 中解析出 “milvus\_search\_config” (#17221)
- 重構並優化 milvus 程式碼 (#17229)

### `llama-index-vector-stores-pinecone` \[0.4.2]

- 處理檢索到的 Pinecone index 值為空的情況 (#17242)

### `llama-index-vector-stores-qdrant` \[0.4.1]

- feat: 為 MetadataFilter 與 QdrantVectorStore 新增 NOT 過濾條件 (#17270)

### `llama-index-vector-stores-weaviate` \[1.3.0]

- 為 weaviate vector store 整合新增 async 支援 (#17220)

## \[2024-12-09]

### `llama-index-core` \[0.12.5]

- 優化 function tools 的預設描述生成 (#17208)

### `llama-index-multi-modal-llms-azure-openai` \[0.3.2]

- fix: 放寬 openai llm 依賴項的版本限制 (#17210)

### `llama-index-postprocessor-pinecone-native-rerank` \[0.1.0]

- feat: 整合 pinecone hosted rerankers (#17192)

### `llama-index-tools-scrapegraph` \[0.1.0]

- 新增 Scrapegraph tool 整合 (#17238)

### `llama-index-vector-stores-postgres` \[0.3.3]

- 將 pgvector 依賴項更新至 0.3.6 版本 (#17195)

## \[2024-12-08]

### `llama-index-core` \[0.12.4]

- 修復 sync 與 async 的 structured streaming (#17194)
- 取消 pydantic 的版本限制以支援 2.8 或更高版本 (#17193)
- 更新 core structured predict streaming，新增 ollama structured predict (#17188)
- 提升 llama-index-core 中的 tenacity 依賴項版本 (#17178)

### `llama-index-indices-managed-vectara` \[0.3.1]

- 為 Vectara `as_query_engine` 新增 Verbose 選項 (#17176)

### `llama-index-llms-ollama` \[0.5.0]

- 更新 core structured predict streaming，新增 ollama structured predict (#17188)

### `llama-index-llms-perplexity` \[0.3.2]

- 修復 perplexity 的訊息格式 (#17182)

### `llama-index-readers-web` \[0.3.1]

- 在 WholeSiteReader 中新增可使用 URI 作為 doc id 的功能 (#17187)

### `llama-index-vector-stores-chroma` \[0.4.1]

- BUG FIX: 使 llama-index-vectorstore-chromadb 能與 chromadb v0.5.17 相容 (#17184)

## \[2024-12-06]

### `llama-index-core` \[0.12.3]

- 為 SimpleDirectoryReader 增加單元測試覆蓋 (#17156)
- docs: 在不使用 multimodal LLM 的情況下，重寫 openai 影像推理範例 (#17148)
- fix(metrics): 修復 NDCG 計算並增加完整的測試案例 (#17126)
- feat: 改進 ImageBlock (#17111)
- 移除 ChatMemoryBuffer 中遺留的 print (#17114)
- \[FIX] 將 JSONalyzeQueryEngine 移至 experimental (#17110)

### `llama-index-embeddings-clip` \[0.3.1]

- 解除 clip models 的使用限制 (#17162)

### `llama-index-embeddings-openai` \[0.3.1]

- fix/openai-embbeding-retry (#17072)

### `llama-index-embeddings-text-embeddings-inference` \[0.3.1]

- 在 TEI 中使用正確的 auth token (#17158)

### `llama-index-indices-managed-llama-cloud` \[0.6.3]

- chore: 修復 LlamaCloudRetriever 中的 httpx\_client 拼字錯誤 (#17101)
- fix: 修復 LlamaCloudRetriever 中錯誤的 project id 變數 (#17086)

### `llama-index-llms-bedrock-converse` \[0.4.1]

- 將 AWS Nova models 新增至 Bedrock Converse (#17139)

### `llama-index-llms-ollama` \[0.4.2]

- Ollama LLM: 在 `_get_response_token_counts` 中新增 TypeError 異常 (#17150)

### `llama-index-llms-sambanovasystems` \[0.4.3]

- 修改 url 中的 openai 識別方式 (#17161)

### `llama-index-memory-mem0` \[0.2.1]

- 修復 mem0 版本檢查 (#17159)

### `llama-index-multi-modal-llms-openai` \[0.4.0]

- fix: 使 OpenAIMultiModal 能與新版 ChatMessage 相容 (#17138)

### `llama-index-postprocessor-bedrock-rerank` \[0.3.0]

- 新增 AWS Bedrock Reranker (#17134)

### `llama-index-readers-file` \[0.4.1]

- 更新 unstructured reader 的 doc id (#17160)

### `llama-index-retrievers-duckdb-retriever` \[0.4.0]

- fix: 在 DuckDBRetriever 中使用 prepared statement (#17092)

### `llama-index-vector-stores-postgres` \[0.3.2]

- 無論 schema 狀態為何，均為 pgvector 建立資料表 (#17100)

### `llama-index-vector-stores-weaviate` \[1.2.4]

- 使 weaviate 中的 alpha 不為 none (#17163)
- 使 Weaviate Vector Store 整合支援複雜屬性 (#17129)
- 為 Weaviate Vector Store 整合新增 `IS_EMPTY` metadata filters 支援 (#17128)
- 使 Weaviate Vector Store 整合支援巢狀 metadata 過濾 (#17107)

## \[2024-11-26]

### `llama-index-core` \[0.12.2]

- 改進 workflows 的 traceback 日誌記錄 (#17040)
- Workflows checkpointing 的初始版本 (#17006)
- 修復 base component 測試 (#17062)
- 將 code splitter 測試標記為選用 (#17060)
- 更新貢獻指南與開發依賴項 (#17051)
- 修復 WorkflowDone 異常的處理方式 (#17047)

### `llama-index-embeddings-vertex` \[0.3.1]

- 從 vertex 依賴項中移除 pyarrow (#16997)

### `llama-index-llms-ibm` \[0.3.1]

- IBM watsonx.ai acomplete 與 achat 整合 (#17034)

### `llama-index-llms-openai` \[0.3.2]

- 修復 openai 在特定情境下的 tool\_choice (#17058)

### `llama-index-llms-perplexity` \[0.3.1]

- Fix: 更新 perplexity models，新增單元測試與微幅修復 (#17045)

### `llama-index-llms-vertex` \[0.4.1]

- 從 vertex 依賴項中移除 pyarrow (#16997)

### `llama-index-multi-modal-llms-huggingface` \[0.2.1]

- 新增 stream\_chat 並根據條件將 AutoModelClass 設定為 MllamaForConditionalGeneration (#17031)

### `llama-index-readers-box` \[0.3.1]

- 修復 box api - mypy 錯誤 (#17061)

### `llama-index-vector-stores-deeplake` \[0.3.2]

- deeplake v3 向後相容性 (#17057)

### `llama-index-vector-stores-mongodb` \[0.6.0]

- MongoDB Atlas：新增 search index 指令以及 metadata filters 的測試/範例 (#15265)

### `llama-index-vector-stores-postgres` \[0.3.1]

- 在建立 pgvector 資料表進行其餘初始化之前，先檢查 schema 是否存在 (#17063)

## \[2024-11-20]

### `llama-index-core` \[0.12.1]

- 暫時將 pydantic 固定在 `<2.10` 版本
- feat\[react-multimodal]：在 MultimodalReActAgentWorker 中新增對圖片的 gemini 支援 (#16992)

### `llama-index-indices-managed-llama-cloud` \[0.6.2]

- 修復 llama-cloud-index 中的 api\_key 拼字錯誤 (#17001)

### `llama-index-llms-openai` \[0.3.1]

- 新增對最新 gpt-4o 模型的支援 (#17015)

### `llama-index-llms-zhipuai` \[0.2.1]

- zhipuai 在 api 中新增 stop 參數 (#16996)

### `llama-index-multi-modal-llms-mistralai` \[0.3.1]

- 新增對 mistral 最新模型的支援 (#16991)

### `llama-index-multi-modal-llms-replicate` \[0.3.1]

- 修復：修正 replicate multi modal 套件中的拼字錯誤 (#16998)

### `llama-index-vector-stores-pinecone` \[0.4.1]

- 在 pinecone 中新增 get\_nodes (#17007)

## \[2024-11-17]

**注意：** 更新至 v0.12.0 將需要同步提升所有其他 `llama-index-*` 套件的版本！每個套件都已更新版本。僅列出較重要的變更如下。

### `llama-index-core` \[0.12.0]

- 停止支援 python3.8，取消 numpy 的版本固定 (#16973)
- Kg/dynamic pg triplet 檢索限制 (#16928)

### `llama-index-indices-managed-llama-cloud` \[0.6.1]

- 為 LlamaCloudIndex 新增 ID 支援並更新 from\_documents 邏輯，現代化 API (#16927)
- 上傳檔案時允許跳過等待 ingestion (#16934)
- 新增對 files endpoints 的支援 (#16933)

### `llama-index-indices-managed-vectara` \[0.3.0]

- 新增 Custom Prompt 參數 (#16976)

### `llama-index-llms-bedrock` \[0.3.0]

- 修正 messages/completion 轉 prompt 的微小問題 (#15729)

### `llama-index-llms-bedrock-converse` \[0.4.0]

- 修復使用 bedrock converse 的 async streaming 問題 (#16942)

### `llama-index-multi-modal-llms-nvidia` \[0.2.0]

- 新增 vlm 支援 (#16751)

### `llama-index-readers-confluence` \[0.3.0]

- 允許將參數傳遞至 Confluence client (#16961)

### `llama-index-readers-github` \[0.5.0]

- 在 GithubRepositoryReader 中新增 base URL 提取方法 (#16926)

### `llama-index-vector-stores-weaviate` \[1.2.0]

- 允許傳遞 Weaviate vector store 的 kwargs (#16954)

## \[2024-11-11]

### `llama-index-core` \[0.11.23]

- 修復 streaming 發生 exception 時的 workflow timeout 問題 (#16852)
- 為 core.multi\_modal\_llms.generic\_utils 新增函式 (#16896)
- 為 core.multimodal 新增 docstrings 與單元測試 (#16872)
- 在 ingestion pipeline 中確實將 num\_workers 設定為 num\_cpus (#16803)

### `llama-index-embeddings-nvidia` \[0.2.5]

- 對 nvdev embedding 模型跳過模型驗證 (#16883)

### `llama-index-embeddings-modelscope` \[0.3.0]

- 新增 ModelScope embedding 支援 (#16873)

### `llama-index-graph-stores-kuzu` \[0.4.0]

- BREAKING：更新 relationship table label 的命名規範，現有的 graph 需要重新建立 (#16886)

### `llama-index-llms-anthropic` \[0.4.0]

- 使用新的 anthropic token counting api (#16909)

### `llama-index-llms-bedrock-converse` \[0.3.8]

- 為 Bedrock Converse 新增 inference profile 支援，並新增 Llama 3.1/3.2 (#16827)

### `llama-index-llms-nvidia` \[0.2.7]

- 對 nvdev llm 模型跳過模型驗證 (#16882)

### `llama-index-llms-modelscope` \[0.3.0]

- 修復 modelscope ‘pipeline’ 在賦值前被引用 (#16864)

### `llama-index-llms-ollama` \[0.3.6]

- 修復在 messages 的 additional kwargs 中忽略 tool calls 的問題 (#16764)

### `llama-index-llms-siliconflow` \[0.1.0]

- 新增 siliconflow llm 類別 (#16861)

### `llama-index-postprocessor-tei-rerank` \[0.2.1]

- 修復 TEI reranker 中的 top-n 參數 (#16884)

### `llama-index-readers-gitbook` \[0.2.0]

- 新增 gitbook reader (#16862)

### `llama-index-readers-google` \[0.4.3]

- feat：為 google drive 新增相對檔案路徑 (#16907)

### `llama-index-readers-file` \[0.3.0]

- 提升版本並將 pypdf 依賴更新至 5.1.0 (#16905)

### `llama-index-vector-stores-azureaisearch` \[0.2.9]

- 為 azure search 新增 UserAgent header “llamaindex-python” (#16895)

### `llama-index-vector-stores-clickhouse` \[0.3.2]

- 修正 vector store 中的 clickhouse init (#16903)

## \[2024-11-05]

### `llama-index-core` \[0.11.22]

- 恢復 context chat engines 對 prompt templates 的支援 (#16821)
- 修正 JSON 生成子問題的格式（雙大括號） (#16820)
- markdown splitter 改進 metadata (#16789)
- 修正 empty index + generation synthesizer (#16785)

### `llama-index-embeddings-azure-inference` \[0.2.4]

- 支援 api\_version 與 Azure AI 模型推論服務 (#16802)

### `llama-index-embeddings-gemini` \[0.2.2]

- 修正 await-async-embeddings (#16790)

### `llama-index-embeddings-siliconflow` \[0.1.0]

- 新增 siliconflow embedding 類別 (#16753)

### `llama-index-indices-managed-vectara` \[0.2.4]

- Hotfix：Chain Query 設定 (#16818)

### `llama-index-llms-anthropic` \[0.3.9]

- 將 Anthropic Claude Haiku 3.5 新增至支援的 Claude 模型清單 (#16823)

### `llama-index-llms-azure-inference` \[0.2.4]

- 支援 api\_version 與 Azure AI 模型推論服務 (#16802)

### `llama-index-llms-bedrock` \[0.2.6]

- 將 Anthropic Claude Haiku 3.5 新增至 bedrock 與 bedrock-converse 整合的支援 Claude 模型清單 (#16825)

### `llama-index-llms-bedrock-converse` \[0.3.7]

- 將 Anthropic Claude Haiku 3.5 新增至 bedrock 與 bedrock-converse 整合的支援 Claude 模型清單 (#16825)

### `llama-index-llms-dashscope` \[0.2.5]

- 放寬 LLMMetadata 資訊的定義 (#16830)
- 修正 abstract method 簽名錯誤 (#16809)

### `llama-index-llms-vllm` \[0.3.0]

- 為最新版本的 vllm 移除 beam search 參數 (#16817)

### `llama-index-postprocessor-colpali-rerank` \[0.1.0]

- 新增 ColPali 作為 reranker (#16829)

### `llama-index-postprocessor-siliconflow-rerank` \[0.1.0]

- 新增 siliconflow rerank 類別 (#16737)

### `llama-index-readers-microsoft-onedrive` \[0.2.2]

- 修正：為 one drive reader 新增 required\_exts (#16822)

### `llama-index-vector-stores-chroma` \[0.3.0]

- 支援最新 chroma 中 filter 語法的不相容變更 (#16806)

### `llama-index-vector-stores-pinecone` \[0.3.0]

- 支援 sparse embedding 模型，修正 pinecone serverless 的刪除功能 (#16819)

## \[2024-10-31]

### `llama-index-core` \[0.11.21]

- 修正 workflow `ctx.get()` 預設值被設為 None 的問題 (#16756)
- 修正 react agent streaming 的多項問題 (#16755)
- 為 query pipeline 新增單元測試 (#16749)
- 修正 \_merge\_ref\_doc\_kv\_pairs 重複的 for-loop (#16739)
- bugfix：在建立 index 時判斷 nodes 是否為 none (#16703)
- 修正 LLMRerank default\_parse\_choice\_select\_answer\_fn 的解析問題 (#16736)
- 修正 workflows 的回傳類型檢查 (#16724)
- 修正 verbose 問題並讓 sql 錯誤訊息更具資訊量 (#16686)

### `llama-index-embeddings-siliconflow` \[0.1.0]

- 新增 siliconflow embedding 類別 (#16753)

### `llama-index-graph-stores-falkordb` \[0.2.4]

- Multi-Graph-Supported-FalkorDB (#16482)

### `llama-index-llms-anthropic` \[0.3.8]

- 為 vertex AI 新增額外的 claude 模型名稱 (#16692)

### `llama-index-llms-bedrock-converse` \[0.3.6]

- 在 bedrock 中新增 mistral large2 模型 ID (#16742)
- 改進 Bedrock Tool Calling (#16723)
- 在 function calling bedrock converse 模型中新增 sonnet3.5 (#16702)
- 更新 bedrock 模型 (#16698)

### `llama-index-llms-bedrock` \[0.2.5]

- 在 bedrock 中新增 mistral large2 模型 ID (#16742)
- 在 function calling bedrock converse 模型中新增 sonnet3.5 (#16702)
- 更新 bedrock 模型 (#16698)

### `llama-index-llms-cohere` \[0.3.2]

- 新增對 Cohere 新 Aya-Expanse 模型的支援 (#16733)

### `llama-index-llms-dashscope` \[0.2.3]

- DashScope llm 支援 async (#16711)

### `llama-index-llms-nvidia` \[0.3.4]

- 將 nvidia/llama-3.2-nv-embedqa-1b-v1 新增至支援的模型集 (#16694)

### `llama-index-llms-pipeshift` \[0.1.0]

- Pipeshift llama index 整合 (#16610)

### `llama-index-memory-mem0` \[0.1.0]

- 新增 Mem0 作為 memory (#16708)

### `llama-index-multi-modal-llms-anthropic` \[0.2.4]

- 修正 anthropic multimodal 依賴衝突，更新模型 (#16699)

### `llama-index-node-parser-docling` \[0.2.0]

- feat: 將 Docling reader 與 node parser 更新至 Docling v2 (#16677)

### `llama-index-postprocessor-nvidia-rerank` \[0.3.3]

- 將 nvidia/llama-3.2-nv-rerankqa-1b-v1 加入支援的模型清單 (#16695)

### `llama-index-postprocessor-siliconflow-rerank` \[0.1.0]

- 新增 siliconflow rerank 類別 (#16737)

### `llama-index-readers-docling` \[0.2.0]

- feat: 將 Docling reader 與 node parser 更新至 Docling v2 (#16677)

### `llama-index-readers-microsoft-onedrive` \[0.2.1]

- feat: 為 one drive metadata 新增權限設定 (#16646)

### `llama-index-storage-chat-store-azure` \[0.2.4]

- 為 Azure 儲存元件新增 Managed Identity 驗證支援 (#16710)
- 修復 azure chat store 中遺漏的 await (#16645)

### `llama-index-storage-docstore-azure` \[0.2.1]

- 為 Azure 儲存元件新增 Managed Identity 驗證支援 (#16710)

### `llama-index-storage-index-store-azure` \[0.3.1]

- 為 Azure 儲存元件新增 Managed Identity 驗證支援 (#16710)

### `llama-index-storage-kvstore-azure` \[0.2.1]

- 為 Azure 儲存元件新增 Managed Identity 驗證支援 (#16710)

### `llama-index-tools-openai-image-generation` \[0.3.0]

- 提高工具與選項的相容性，以利未來擴充 (#16676)

### `llama-index-tools-vectara-query` \[0.1.0]

- 新增 Vectara Query Tool (#16722)

### `llama-index-vector-stores-azureaisearch` \[0.2.6]

- 允許在 Azure Vector Store 中定義可檢索欄位 (#16766)
- feat: 為 azureai search 新增 get\_nodes (#16761)
- 在 AISearch vector store 中新增 get\_nodes() 函式 (#16653)
- 修復 AzureAISearchVectorStore 的 ID 查詢問題 (修復透過 node\_ids 進行 delete\_nodes 的問題) (#16769)

### `llama-index-vector-stores-hnswlib` \[0.2.0]

- 修復 persistence 問題，並重新調整及新增 HnswlibVectorStore 建構選項 (#16673)

### `llama-index-vector-stores-opensearch` \[0.4.1]

- 使用 `os_async_client` 初始化 OpensearchVectorClient (#16767)

### `llama-index-vector-stores-qdrant` \[0.3.3]

- chore: 在 qdrant get\_nodes 回傳值中新增 embeddings (#16760)

### `llama-index-vector-stores-weaviate` \[1.1.3]

- 若未提供 node ID，則新增預設 ID (#16671)

## \[2024-10-24]

### `llama-index-core` \[0.11.20]

- \[實際上沒有更新內容！\]

### `llama-index-embeddings-cohere` \[0.3.0]

- 新增對 cohere multi-modal embeddings 的支援 (#16667)

### `llama-index-embeddings-litellm` \[0.2.2]

- 在 litellmembedding 中支援 timeout 參數 (#16532)

### `llama-index-graph-stores-neo4j` \[0.3.5]

- 使 neo4j schema refresh 可配置 (#16651)
- fix: 修復 neo4j 查詢中接收來自 dbms 伺服器警告的問題 (#16598)

### `llama-index-indices-managed-vectara` \[0.2.3]

- 為 vectara 新增 chain postprocessing (#16627)

### `llama-index-llms-anthropic` \[0.3.7]

- 更新 anthropic 模型名稱 (#16643)

### `llama-index-llms-openai` \[0.2.16]

- fix: 當 choice.delta 為 None 時跳過處理 (#16636)

### `llama-index-llms-reka` \[0.1.0]

- Reka llamaindex 整合 (llm 與 multi-modal-llm) (#15753)

### `llama-index-multi-modal-llms-reka` \[0.1.0]

- Reka llamaindex 整合 (llm 與 multi-modal-llm) (#15753)

### `llama-index-postprocessor-dashscope-rerank` \[0.2.1]

- 修復呼叫 DashScopeRerank 時未設定 api\_key 參數的 BUG (#16665)

### `llama-index-readers-microsoft-sharepoint` \[0.3.4]

- 在 access token 過期的情況下，為 requests 新增重試邏輯 (#16662)

### `llama-index-storage-docstore-mongodb` \[0.2.1]

- 修復 mongodb docstore 遺漏相依項的錯誤 (#16654)

### `llama-index-storage-docstore-couchbase` \[0.1.0]

- 為 DocStore 與 IndexStore 新增 Couchbase 支援 (#16509)

### `llama-index-storage-kvstore-couchbase` \[0.1.0]

- 為 DocStore 與 IndexStore 新增 Couchbase 支援 (#16509)

### `llama-index-storage-index-store-couchbase` \[0.1.0]

- 為 IndexStore 新增 Couchbase 支援 (#16509)

### `llama-index-storage-kvstore-mongodb` \[0.2.1]

- 為 mongodb kvstore 新增遺漏的相依項 (#16632)

### `llama-index-utils-workflow` \[0.2.2]

- 修復 HITL 的繪圖問題 (#16624)

## \[2024-10-18]

### `llama-index-core` \[0.11.19]

- 在處理 asyncio futures 時，正確地在 instrumentation 中拋出錯誤 (#16603)
- fix: 在 PGRetriever 中正確地將參數傳遞給 VectorStoreQuery (#16586)
- 修復 structured predict 的 type hints (#16585)
- 新增 retry\_on\_exceptions\_with\_backoff 工具的 async 版本 (#16374)
- 優化 CONTRIBUTING.md 文件 (#16548)

### `llama-index-embeddings-gaudi` \[0.1.0]

- 在 llama-index-embeddings-gaudi 中新增與 Intel Gaudi 的 embedding 整合 (#16521)

### `llama-index-embeddings-openvino` \[0.4.1]

- 透過 OpenVINO embedding 新增 OpenClip 支援 (#16554)

### `llama-index-graph-stores-neo4j` \[0.3.4]

- fix: 移除 neo4j 查詢中 dbms server 的警告 (#16598)

### `llama-index-llms-ibm` \[0.2.2]

- IBM watsonx.ai Chat 整合 + function calling 支援 (#16589)

### `llama-index-llms-mistralai` \[0.2.7]

- 新增對 mistral 最新模型的支援 (#16571)

### `llama-index-llms-openai` \[0.2.15]

- 在 function\_calling 方法中新增對 fine-tuned 模型的檢查 (#16568)
- 允許直接傳入 openai clients (#16560)

### `llama-index-llms-replicate` \[0.3.0]

- 使用 Replicate streaming API (#16597)

### `llama-index-multi-modal-llms-openvino` \[0.1.0]

- 新增 OpenVINO multimodal 支援 (#16567)

### `llama-index-multi-modal-llms-zhipuai` \[0.1.0]

- 新增 zhipuai multi modal llm 類別 (#16551)

### `llama-index-readers-google` \[0.4.2]

- 在 GoogleDocsReader 中使用 credential 檔案裡的 redirect uri port 以執行 local server (#16327)

### `llama-index-storage-chat-store-postgres` \[0.1.0]

- feat: postgres chat store 整合 (#16557)

### `llama-index-storage-chat-store-upstash` \[0.1.2]

- 修復 upstash chat store 中的 pydantic 錯誤 (#16559)

### `llama-index-vector-stores-azurecosmosmongo` \[0.2.2]

- 為 Azure Cosmos DB Mongo vector store 新增 DiskANN (#16581)

### `llama-index-vector-stores-hnswlib` \[0.1.0]

- Hnswlib Vector Store 整合 (#16443)

### `llama-index-vector-stores-oceanbase` \[0.1.0]

- 新增 OceanBase 的 vector store 整合 (#16550)

### `llama-index-vector-stores-qdrant` \[0.3.2]

- 在 Qdrant vector database 中新增可選的 text field 名稱 (#16576)

## \[2024-10-14]

### `llama-index-core` \[0.11.18]

- 在 PG Retrieval 新增文字時處理 Empty Nodes List (#16447)
- 改進 text2sql 解析 (#16445)

### `llama-index-embeddings-litellm` \[0.2.2]

- 在 litellmembedding 中支援 timeout 參數 (#16532)

### `llama-index-embeddings-zhipuai` \[0.1.0]

- 新增 zhipuai embedding 類別 (#16505)

### `llama-index-graph-stores-memgraph` \[0.1.0]

- 新增 Memgraph Graph Store 整合 (#16345)

### `llama-index-llms-anthropic` \[0.3.6]

- 新增 anthropic bedrock 支援 (#16478)

### `llama-index-llms-databricks` \[0.2.1]

- 修復 Databricks structured\_predict (#16527)

### `llama-index-multi-modal-llms-anthropic` \[0.2.3]

- 在 AnthropicMultiModal 中傳遞 default\_headers (#16496)

### `llama-index-readers-document360` \[0.1.0]

- 新增 Document360Reader。由 PLACE 團隊貢獻 (#16305)

### `llama-index-readers-zyte-serp` \[0.1.0]

- 新增 Zyte serp 整合 (#16417)

### `llama-index-readers-upstage` \[0.2.1]

- 新增 UpstageDocumentParseReader (#16099)

### `llama-index-storage-chat-store-azure` \[0.2.2]

- 修復 azure chat store 中的 async 方法 (#16531)

### `llama-index-tools-weather` \[0.1.0]

- 修復 format temp 函式 (#16487)

### `llama-index-vector-stores-elasticsearch` \[0.3.3]

- 在 Elasticsearch 整合中新增對自定義 Metadata Keyword Suffix 的支援 (#16519)

### `llama-index-vector-stores-nile` \[0.1.0]

- 新增 Nile (multi-tenant postgres) 的 vector store 整合 (#16437)

### `llama-index-vector-stores-opensearch` \[0.4.0]

- 使用高效的 kNN 過濾，修復輸入值為字串陣列時的過濾問題 (#16393)

### `llama-index-vector-stores-oracledb` \[0.1.4]

- Oracle vector store 整合的多項修復 (#16536)

### `llama-index-vector-stores-qdrant` \[0.3.1]

- 更新 Qdrant utils.py 中的模型名稱拼字錯誤 (#16494)

### `llama-index-vector-stores-timescalevector` \[0.2.2]

- 修復 timescale vector store 類別 (#16539)

### `llama-index-vector-stores-weaviate` \[1.1.2]

- 修復來自 Weaviate 的 similarity score 問題 (#16489)

## \[2024-10-08]

### `llama-index-core` \[0.11.17]

- 修復包含不穩定 openai 類型的 ChatMessage 序列化問題 (#16410)

### `llama-index-embeddings-gemini` \[0.2.1]

- 修復 gemini embedding 的 async 方法 (#16369)

### `llama-index-llms-gaudi` \[0.1.0]

- 在 llama-index-llms-gaudi 中新增與 Intel Gaudi 的 llm 整合 (#16308)

### `llama-index-llms-openai` \[0.2.12]

- 若無 tool calls 則不包含在內 (#16408)

### `llama-index-multi-modal-llms-huggingface` \[0.1.1]

- LlamaMultiModal 類別 bug 修復 (#16413)
- MultiModal.HuggingFaceMultiModal：修復錯誤與 README，新增 stream\_complete (#16376)

### `llama-index-node-parser-docling` \[0.1.0]

- feat: 新增 Docling reader 與 node parser (#16406)

### `llama-index-readers-docling` \[0.1.0]

- feat: 新增 Docling reader 與 node parser (#16406)

### `llama-index-readers-zyte-serp` \[0.1.0]

- 新增 Zyte serp 整合 (#16417)

### `llama-index-vector-stores-azureaisearch` \[0.2.2]

- fix(bug)：修正確保 metadata\_mapping 值的 bug (#16431)

### `llama-index-vector-stores-objectbox` \[0.1.0]

- 新增 ObjectBox Vector Store 整合 (#16314)

## \[2024-10-03]

### `llama-index-core` \[0.11.16]

- 將非 dict 類型的 tool JSON 函式參數視為空值（而非拋出 unexpected 異常） (#16316)
- 修正 workflows 的 instrumentation (#16290)
- (暫行方案) 抑制 workflow tracing 期間的 token detaching 異常 (#16364)
- 當 nodes 沒有內容時，發出 warning 而非 error (#16354)
- 修正 BasePGRetriever 中的打字錯誤，以解決 graph context 未被加入的問題 (#16357)

### `llama-index-embeddings-vertex-endpoint` \[0.1.0]

- 新增 vertex endpoint embedding (#16351)

### `llama-index-llms-fireworks` \[0.2.1]

- FireworksAI 新增對 Meta 3.2 模型的支援：1b-instruct; 3b-instruct; 11b-vision; 90b-vision (#16349)

### `llama-index-multi-modal-llms-openai` \[0.2.1]

- 重構 OpenAI `update_tool_calls` (#16309)

### `llama-index-vector-stores-milvus` \[0.2.7]

- 新增對巢狀 MetadataFilters 與 FilterOperator.IS\_EMPTY 的支援 (#16329)

## \[2024-10-02]

### `llama-index-core` \[0.11.15]

- 新增 `to_dict()`、`from_dict()` 以及 workflow context 的 serializers (#16250)
- 可使用 `handler.cancel_run()` 取消 workflow 執行 (#16320)
- (重大變更) 重構 `WorkflowHandler.run_step()`，讓使用者手動發出 Event 以啟動 workflow 的下一步 (#16277)

### `llama-index-embeddings-oracleai` \[0.1.0]

- Oraclevs 整合 (#16161)

### `llama-index-experimental` \[0.4.0]

- nudge-ft 套件並新增擴充資料集的範例 (#16269)

### `llama-index-llms-anthropic` \[0.3.3]

- 為 Anthropic LLM 新增 prompt caching 支援 (#16270)

### `llama-index-llms-gemini` \[0.3.6]

- 在 Google Gemini LLMs 的 raw data 中輸出 token 使用量 (#16313)

### `llama-index-llms-openai` \[0.2.10]

- 將 4o mini 加入 azure openai 模型 (#16335)

### `llama-index-llms-vertex` \[0.3.7]

- 從 Vertex AI 模型的 generation config 中移除 safety settings (#16337)

### `llama-index-multi-modal-llms-huggingface` \[0.1.0]

- LlamaIndex Multi\_Modal\_Llms 整合：Huggingface (#16133)

### `llama-index-readers-minio` \[0.2.1]

- 移除多餘的 print 敘述並替換 create tmpfile 函式 (#16291)

### `llama-index-readers-oracleai` \[0.1.0]

- Oraclevs 整合 (#16161)

### `llama-index-readers-web` \[0.2.3]

- 新增 Zyte Web Reader (#16197)

### `llama-index-retrievers-bm25` \[0.4.0]

- 提升 deps 至最新 bm25s 版本 (#16339)
- 更新 BM25 retriever 以使用 metadata (#16267)

### `llama-index-storage-chat-store-redis` \[0.3.2]

- 修正 redis chat store 中對 async client 的檢查 (#16321)

### `llama-index-storage-chat-store-upstash` \[0.1.0]

- Upstash Storage Chat Store 整合 (#16237)

### `llama-index-vector-stores-milvus` \[0.2.6]

- milvus：一律設定 self.\_collection (#16306)
- 修正使用 index\_config 建立 milvus collection 的問題 (#16165)

### `llama-index-vector-stores-oracledb` \[0.1.0]

- Oracledb 整合 (#16161)

## `llama-index-vector-stores-postgres` \[0.2.6]

- Postgres Vector Store 支援 TEXT\_MATCH FilterOperator (#16304)

## \[2024-09-26]

### `llama-index-core` \[0.11.14]

- 強化 BaseIndex 的 insert 方法以支援自定義轉換 (#16206)
- 確保 ChatMemoryBuffer 的聊天紀錄絕不會以 TOOL 訊息開頭 (#16214)
- safe prompt helper 字串格式化 (#16219)
- \[功能請求] 支援最大併發 workflow\_instance.run() 執行數 (#16215)
- Workflows + Human In The Loop 專屬支援 (#16220)

### `llama-index-graph-stores-neptune` \[0.2.2]

- 修正傳入 provided client 時的 NoneType 物件錯誤 (#16174)

### `llama-index-llms-ollama` \[0.3.3]

- 修正 ollama chat 缺少 `keep_alive` 的問題 (#16182)

### `llama-index-llms-vertex` \[0.3.6]

- 修正 vertex init 函式 (#16216)

### `llama-index-multi-modal-llms-mistral` \[0.1.0]

- 新增對 Mistral Multi modal LLM 的支援 (#16191)

### `llama-index-readers-jira` \[0.3.0]

- 為 Jira Reader 新增分頁支援 (#16226)

### `llama-index-vector-stores-azurecosmosmongo` \[0.2.1]

- Azure Cosmos DB Filtered Vector Search (#16175)

### `llama-index-vector-stores-azurecosmosnosql` \[1.1.0]

- Azure Cosmos DB Filtered Vector Search (#16175)

### `llama-index-vector-stores-deeplake` \[0.2.1]

- 新增缺失的 JWT 依賴 (#16236)

## \[2024-09-24]

### `llama-index-core` \[0.11.13]

- 在 property graphs 檢索時，為 string node 表示法增加選項 (#16100)
- 提升 markdown element node 解析器與結構化預測的可靠性 (#16172)

### `llama-index-graph-stores-neptune` \[0.2.1]

- 修復 Neptune 會增加額外標籤的問題 (#16137)

### `llama-index-llms-vertext` \[0.3.5]

- 將 safety\_settings 傳遞至 send\_message 方法，以修復 settings 未傳送到 API 的問題 (#16153)

### `llama-index-readers-box` \[0.2.3]

- 將 box sdk 升級至 >= 1.5.0 #16169

### `llama-index-storage-chat-store-dynamodb` \[0.2.0]

- 為 dynamodb 增加 Async 支援 (#16139)

### `llama-index-storage-chat-store-redis` \[0.3.1]

- 為 redis 增加 Async 支援 (#16139)

### `llama-index-vector-stores-astra-db` \[0.3.0]

- AstraDBVectorStore 改為依賴 AstraPy 1.5 及以上版本 (#16164)

## \[2024-09-22]

### `llama-index-core` \[0.11.12]

- 修正 llm 基礎類別發出的 Pydantic 警告 (#16141)
- 使用 JSON 全域安全地格式化字串中的 prompt 變數 (#15734)
- 在 prompt helper 與 response synthesizers 中將 tools 納入考量 (#16157)

### `llama-index-readers-google` \[0.4.1]

- feat: 在 google drive reader 元資料中增加 drive 連結 (#16156)

### `llama-index-readers-microsoft-sharepoint` \[0.3.2]

- 為 SharePoint reader 增加 required\_exts 選項 (#16152)

### `llama-index-vector-stores-milvus` \[0.2.4]

- 在 MilvusVectorStore 中支援使用者定義的 schema (#16151)

## \[2024-09-20]

### `llama-index-core` \[0.11.11]

- 在 context chat engines 中使用 response synthesizer (#16017)
- Async chat memory 操作 (#16127)
- Sql 查詢增加 markdown 回應選項 (#16103)
- 為 SimpleDirectoryReader 增加對 Path 的支援 (#16108)
- 為多模態更新 chat message 類別 (#15969)
- fix: `handler.stream_events()` 不會產生 StopEvent (#16115)
- 在 vector retriever 中傳遞 `hybrid_top_k` (#16105)

### `llama-index-embeddings-elasticsearch` \[0.2.1]

- 修復 elasticsearch embedding async 函式 (#16083)

### `llama-index-embeddings-jinaai` \[0.3.1]

- feat: 為 v3 版本更新 JinaEmbedding (#15971)

### `llama-index-experimental` \[0.3.3]

- 強化 Pandas Query Engine Output Processor (#16052)

### `llama-index-indices-managed-vertexai` \[0.1.1]

- 修復 VertexAIIndex client 中的錯誤參數 (#16080)

### `llama-index-node-parser-topic` \[0.1.0]

- 根據 MedGraphRAG 論文增加 TopicNodeParser (#16131)

### `llama-index-multi-modal-llms-ollama` \[0.3.2]

- 為多模態 ollama 實作 async (#16091)

### `llama-index-postprocessor-cohere-rerank` \[0.2.1]

- feat: 在 rerank 中增加可配置的 base\_url 欄位 (#16050)

### `llama-index-readers-file` \[0.2.2]

- 修復 bytesio 遺漏 import 的 bug (#16096)

### `llama-index-readers-wordpress` \[0.2.2]

- Wordpress: 允許控制是否檢索 Pages 和/或 Posts (#16128)
- 修復 Issue 16071: wordpress 需要 username 與 password (#16072)

### `llama-index-vector-stores-lancedb` \[0.2.1]

- 使用最新 lancedb client 修復 hybrid search (#16057)

### `llama-index-vector-stores-mongodb` \[0.3.0]

- 修復 mongodb hybrid search 的 top-k 規格 (#16105)

## \[2024-09-16]

### `llama-index-core` \[0.11.10]

- 為 workflows 重構 context/result (#16036)
- 增加 sparse embedding 抽象層 (#16018)
- 修復 Pydantic 模型的數值驗證 (#16008)
- Human in loop workflow 範例 (#16011)

### `llama-index-callbacks-opik` \[0.1.0]

- opik 整合 (#16007)

### `llama-index-indices-managed-llama-cloud` \[0.3.1]

- 使用 image nodes 更新 llamacloud index (#15996)

### `llama-index-indices-managed-vectara` \[0.2.2]

- Hotfix: 修復 Citations Text (#16015)

### `llama-index-llms-huggingface` \[0.3.4]

- Fix: 修復當 tokenizer 作為參數提供時，HuggingFace LLM 出現不必要的警告問題 (#16037)

### `llama-index-readers-dashvector` \[0.3.0]

- fix: 為 DashVector 適配新的 Data Connector (#16028)

### `llama-index-readers-quip` \[0.1.0]

- 增加 quip reader (#16000)

### `llama-index-sparse-embeddings-fastembed` \[0.1.0]

- 增加 fastembed sparse embeddings (#16018)

### `llama-index-vector-stores-elasticsearch` \[0.2.1]

- Fix: 從 Elasticsearch KVStore 獲取所有 documents (#16006)

### `llama-index-vector-stores-lancedb` \[0.2.3]

- 暫時限制 lancedb 版本 (#16045)

### `llama-index-vector-stores-postgres` \[0.2.5]

- 在 PGVectorStore 上實作 `get_nodes()` (#16026)

## \[2024-09-12]

### `llama-index-core` \[0.11.9]

- 從 args 中將 callback manager 新增至 retriever query engine (#15990)
- 不要將 system prompt 從 fn calling runner 傳遞至 fn calling worker (#15986)
- fix: 當 tool name 包含非英文字元時，解析 react output 會發生錯誤 (#15956)

### `llama-index-embeddings-alibabacloud-aisearch` \[0.1.0]

- 新增四項 alibabacloud-aisearch llama-index 整合：rerank, node\_parser, readers, embeddings (#15934)

### `llama-index-experimental` \[0.3.1]

- 新增 NUDGE Finetuning (#15954)

### `llama-index-graph-stores-falkordb` \[0.2.2]

- 更新 falkordb client (#15940)

### `llama-index-llms-openai` \[0.2.5]

- 新增對 o1 openai 模型之支援 (#15979)
- 將 o1 的 temp 強制設定為 1.0 (#15983)

### `llama-index-node-parser-alibabacloud-aisearch` \[0.1.0]

- 新增四項 alibabacloud-aisearch llama-index 整合：rerank, node\_parser, readers, embeddings (#15934)

### `llama-index-postprocessor-alibabacloud-aisearch-rerank` \[0.1.0]

- 新增四項 alibabacloud-aisearch llama-index 整合：rerank, node\_parser, readers, embeddings (#15934)

### `llama-index-readers-alibabacloud-aisearch` \[0.1.0]

- 新增四項 alibabacloud-aisearch llama-index 整合：rerank, node\_parser, readers, embeddings (#15934)

### `llama-index-vector-stores-opensearch` \[0.3.0]

- 在 OpenSearchVectorClient 中區分 sync 與 async 呼叫 (#15945)

### `llama-index-vector-stores-postgres` \[0.2.4]

- fix PGVectorStore 中的 attribute error (#15961)
- 新增對 engine parameters 之支援 (#15951)

### `llama-index-vector-stores-wordlift` \[0.4.5]

- 捕捉 nest\_asyncio 錯誤 (#15975)

## \[2024-09-09]

### `llama-index-core` \[0.11.8]

- feat: 為 workflow steps 新增 retry policy 設定 (#15757)
- 為 Langchain 格式轉換新增 doc id (#15928)

### `llama-index-chat-store-dynamodb` \[0.1.0]

- 新增 DynamoDBChatStore (#15917)

### `llama-index-cli` \[0.3.1]

- 修復 RagCLI pydantic 錯誤 (#15931)

### `llama-index-llms-alibabacloud-aisearch` \[0.1.0]

- 新增 llama-index llms alibabacloud\_aisearch 整合 (#15850)

### `llama-index-llms-mistralai` \[0.2.3]

- 使預設 mistral 模型透過 `large-latest` 支援 function calling (#15906)

### `llama-index-llms-vertex` \[0.3.4]

- 在 retry decorator 中新增 InternalServerError (#15921)

### `llama-index-postprocessor-rankllm-rerank` \[0.3.0]

- 使用新的 rerankers 更新 RankLLM (#15892)

### `llama-index-vector-stores-azurecosmosnosql` \[1.0.0]

- 為 Azure Cosmos DB NoSql 新增 vector store (#14158)

### `llama-index-readers-microsoft-sharepoint` \[0.3.1]

- 修復 sharepoint reader 的錯誤處理，以及下載檔案時的錯誤 (#15868)

### `llama-index-vector-stores-wordlift` \[0.4.4]

- 為 WordLift Vector Store 新增對 MetadataFilters 之支援 (#15905)

### `llama-index-vector-stores-opensearch` \[0.2.2]

- Opensearch Serverless 支援使用 knn\_score script 的 filtered query (#15899)

## \[2024-09-06]

### `llama-index-core` \[0.11.7]

- 將 SentenceSplitter 的 secondary\_chunking\_regex 設為選填 (#15882)
- 強制執行 openai structured output (#15706)
- fix assert 錯誤，並為 streaming agents 新增 type ignore (#15887)
- 修復 image document 反序列化問題 (#15857)

### `llama-index-graph-stores-kuzu` \[0.3.2]

- KuzuPropertyGraphStore 的 Bug 修復：即使在 chunks 缺失時也允許 upserting relations (#15889)

### `llama-index-llms-bedrock-converse` \[0.3.0]

- 從 Bedrock Converse 中移除未使用的 llama-index-llms-anthropic 依賴 (#15869)

### `llama-index-vector-stores-postgres` \[0.2.2]

- 使用最新版 pydantic 修復 PGVectorStore，並更新 pydantic import (#15886)

### `llama-index-vector-stores-tablestore` \[0.1.0]

- 新增 TablestoreVectorStore (#15657)

## \[2024-09-05]

### `llama-index-core` \[0.11.6]

- 將 llama-deploy 文件新增至 docs builds (#15794)
- 新增 oreilly 課程 cookbooks (#15845)

### `llama-index-readers-box` \[0.2.1]

- 各項 Bug 修復 (#15836)

### `llama-index-readers-file` \[0.2.1]

- 更新 ImageReader 檔案載入邏輯 (#15848)

### `llama-index-tools-box` \[0.2.1]

- 各項 Bug 修復 (#15836)

### `llama-index-vector-stores-opensearch` \[0.2.1]

- 在刪除操作後重新整理 Opensearch index (#15854)

## \[2024-09-04]

### `llama-index-core` \[0.11.5]

- 移除 property graph retriever 中不必要的 assert (#15832)
- 使簡單的 property graphs 能再次進行序列化 (#15833)
- 修復核心元件中 fastapi 回傳類型的 json schema (#15816)

### `llama-index-llms-nvidia` \[0.2.2]

- NVIDIA llm: 為 starcoder 模型新增 Completion (#15802)

### `llama-index-llms-ollama` \[0.3.1]

- 新增 ollama response usage (#15773)

### `llama-index-readers-dashscope` \[0.2.1]

- 修復 pydantic v2 驗證錯誤 (#15800)

### `llama-index-readers-discord` \[0.2.1]

- fix: 在 DiscordReader 中將 Document id 從 int 轉換為 string (#15806)

### `llama-index-vector-stores-mariadb` \[0.1.0]

- 新增 MariaDB vector store 整合套件 (#15564)

## \[2024-09-02]

### `llama-index-core` \[0.11.4]

- 在 core 中新增 mypy (#14883)
- 修復不正確的 instrumentation 欄位/型別 (#15752)
- FunctionCallingAgent 來源 bug + 用於建立 agent 的輕量 wrapper (#15783)
- 在 sql 進階 workflow nb 中新增文字 (#15775)
- fix: 在 streaming workflow 後移除 context 以重新啟用 streaming (#15776)
- 修復 chat memory 持久化與載入方法，以使用正確的 JSON 格式 (#15545)
- 修復 `_example_type` class var 在 Pydantic V2 中被讀取為 private attr 的問題 (#15758)

### `llama-index-embeddings-litellm` \[0.2.1]

- 為 LiteLLMEmbedding 新增 dimensions 參數，並修復無法從 env 讀取變數的 bug (#15770)

### `llama-index-embeddings-upstage` \[0.2.1]

- 修復初始化 UpstageEmbedding class 時的 upstage embedding bug (#15767)

### `llama-index-embeddings-sagemaker-endpoint` \[0.2.2]

- 修復 Sagemaker Field required 問題 (#15778)

### `llama-index-graph-stores-falkordb` \[0.2.1]

- 修復包含特殊字元的 relations upsert (#15769)

### `llama-index-graph-stores-neo4j` \[0.3.1]

- 為 neo4j lpg 新增原生 vector index 支援並修復 vector filters (#15759)

### `llama-index-llms-azure-inference` \[0.2.2]

- fix: GitHub Models 元資料擷取 (#15747)

### `llama-index-llms-bedrock` \[0.2.1]

- 更新 `base.py` 以修復 `self` 問題 (#15729)

### `llama-index-llms-ollama` \[0.3.1]

- 新增 ollama response usage (#15773)

### `llama-index-llms-sagemaker-endpoint` \[0.2.2]

- 修復 Sagemaker Field required 問題 (#15778)

### `llama-index-multi-modal-llms-anthropic` \[0.2.1]

- 支援在不知道檔案名稱的情況下進行影像型別偵測 (#15763)

### `llama-index-vector-stores-milvus` \[0.2.2]

- feat: 為 MilvusVectorStore 實作 get\_nodes (#15696)

### `llama-index-vector-stores-tencentvectordb` \[0.2.1]

- fix: tencentvectordb 屬性名稱不一致 (#15733)

## \[2024-08-29]

### `llama-index-core` \[0.11.3]

- refact: 合併 Context 與 Session 以簡化 workflows api (#15709)
- chore: 在 workflows 文件中停止使用已棄用的 `ctx.data` (#15716)
- fix: 當 step 發生錯誤時停止 streaming workflow 事件 (#15714)
- 修復多模態 llms 的 llm\_chat\_callback (#15700)
- chore: 提高 workflow 套件的單元測試覆蓋率 (#15691)
- 修復 SimpleVectorStore.from\_persist\_dir() 的行為 (#15534)

### `llama-index-embeddings-azure-openai` \[0.2.5]

- 修復 azure embeddings 的 json 序列化 (#15724)

### `llama-index-graph-stores-kuzu` \[0.3.0]

- 新增 KuzuPropertyGraphStore (#15678)

### `llama-index-indices-managed-vectara` \[0.2.1]

- 新增新的 User Defined Function reranker (#15546)

### `llama-index-llms-mistralai` \[0.2.2]

- 修復 mistral llm 中的 `random_seed` 型別 (#15701)

### `llama-index-llms-nvidia` \[0.2.1]

- 為 nvidia llm 新增 function/tool calling 支援 (#15359)

### `llama-index-multi-modal-llms-ollama` \[0.3.0]

- 提升多模態 llm 的 ollama client 依賴版本 (#15702)

### `llama-index-readers-web` \[0.2.1]

- Fix: Firecrawl scraping url 回應 (#15720)

### `llama-index-selectors-notdiamond` \[0.1.0]

- 將 Not Diamond 新增至 llama\_index (#15703)

### `llama-index-vector-stores-milvus` \[0.2.3]

- 在 Milvus vector stores 中支援 MMR (#15634)
- feat: 為 MilvusVectorStore 實作 get\_nodes (#15696)

## \[2024-08-27]

### `llama-index-core` \[0.11.2]

- 修復 pydantic v2 的 tool schemas 生成以處理巢狀模型 (#15679)
- feat: 支援巢狀 workflows 的預設值 (#15660)
- feat: 允許 FunctionTool 僅使用 async fn (#15638)
- feat: 允許從 steps streaming 事件 (#15488)
- 修復 auto-retriever pydantic 縮排錯誤 (#15648)
- 使用 workflows 實作 Router Query Engine 範例 (#15635)
- 使用 workflows 新增 multi step query engine 範例 (#15438)
- 為 llm 層級的操作啟動 traces (#15542)- 在 CodeSplitter from\_defaults 的 init 中傳遞 callback\_manager (#15585)

### `llama-index-embeddings-xinference` \[0.1.0]

- 新增 Xinference Embedding 類別 (#15579)

### `llama-index-llms-ai21` \[0.3.3]

- Integrations：支援 AI21 function calling (#15622)

### `llama-index-llms-anthropic` \[0.3.0]

- 新增透過 GCP Vertex AI 支援 anthropic 模型 (#15661)

### `llama-index-llms-cerebras` \[0.1.0]

- 實作 Cerebras Integration (#15665)

### `llama-index-postprocessor-nvidia-rerank` \[0.3.1]

- 修正下載的 nim endpoint 路徑 (#15645)
- 修正 llama-index-postprocessor-nvidia-rerank 測試 (#15643)

### `llama-index-postprocessor-xinference-rerank` \[0.1.0]

- 新增 xinference rerank 類別 (#15639)

### `llama-index-vector-stores-alibabacloud-opensearch` \[0.2.1]

- 修正 AlibabaCloudOpenSearchConfig 中的 set output fields (#15562)

### `llama-index-vector-stores-azureaisearch` \[0.2.1]

- 將 azure-search-documents 升級至 2024-07-01 GA API，並在 Index Creation 中新增對 Scalar 與 Binary Quantization 的支援 (#15650)

### `llama-index-vector-stores-neo4j` \[0.2.1]

- Neo4j Vector Store：將 Embedding Dimension Check 設為選用 (#15628)

### `llama-inde-vector-stores-milvus` \[0.2.1]

- 變更 Milvus 的預設 consistency level (#15577)

### `llama-index-vector-stores-elasticsearch` \[0.3.2]

- 修正 ElasticsearchStore 的 key error (#15631)

## \[2024-08-23]

### `llama-index-core` \[0.11.1]

- 將用戶端文件搜尋替換為 algolia (#15574)
- 新增關於擴充 workflows 的文件 (#15573)
- 將 nested workflows 的方法重新命名為 add\_workflows (#15596)
- chore：修正核心程式碼中的 @step 用法 (#15588)
- 修改 ReflectionWorkflow 範例 notebook 中的 validate 函式，改用 pydantic 的 model\_validate\_json 方法 (#15567)
- feature：允許同一個 workflow 實例併行執行 (#15568)
- docs：從文件與範例中移除多餘的 pass\_context=True (#15571)

### `llama-index-embeddings-openai` \[0.2.3]

- 修正 openai embeddings 與 pydantic v2 的相容性 (#15576)

### `llama-index-embeddings-voyageai` \[0.2.1]

- 提升 voyage ai embedding client 依賴版本 (#15595)

### `llama-index-llms-vertex` \[0.3.3]

- Vertex LLM：正確將 function calling 部分加入 prompt (#15569)
- Vertex LLM：移除手動將 message content 設定為 Function Calling 的操作 (#15586)

## \[2024-08-22]

### `llama-index-core` \[0.11.0]

- 移除已棄用的 `ServiceContext` — 現在使用此項將會印出錯誤以及遷移指南連結
- 移除已棄用的 `LLMPredictor` — 現在使用此項將會印出錯誤，任何現有的 LLM 均可直接替換
- 將 `pandas` 設為選用依賴

### `Everything Else`

- 提升所有套件的次要版本，以適應新版本的 `llama-index-core`

## \[2024-08-21]

### `llama-index-core` \[0.10.68]

- 移除 base element node parser 中的巢狀進度條 (#15550)
- 為 workflows 新增詳盡文件 (#15556)
- 新增具備 reflection notebook 範例的多策略 workflow (#15445)
- 從核心移除 openai 依賴 (#15527)
- 改進 token counter 以處理更多回應類型 (#15501)
- feat：允許使用不帶括號的 step decorator (#15540)
- feat：workflow 服務（即巢狀 workflows） (#15325)
- 在 TextToCypher retriever 中使用 “cypher\_validator” 時，不再要求指定 “allowed\_query\_fields” 參數 (#15506)

### `llama-index-embeddings-mistralai` \[0.1.6]

- 修正 mistral embeddings 用法 (#15508)

### `llama-index-embeddings-ollama` \[0.2.0]

- embeddings 使用 ollama client (#15478)

### `llama-index-embeddings-openvino` \[0.2.1]

- openvino embedding 與 reranker 支援 static input shape (#15521)

### `llama-index-graph-stores-neptune` \[0.1.8]

- 新增程式碼以公開 Neptune 的 structured schema (#15507)

### `llama-index-llms-ai21` \[0.3.2]

- Integration：支援 AI21 Tools (#15518)

### `llama-index-llms-bedrock` \[0.1.13]

- 支援 llama-index 與 bedrock 整合的 token counting (#15491)

### `llama-index-llms-cohere` \[0.2.2]

- feat：為 achat cohere 新增 tool calling 支援 (#15539)

### `llama-index-llms-gigachat` \[0.1.0]

- 新增 gigachat LLM 支援 (#15313)

### `llama-index-llms-openai` \[0.1.31]

- 修正 OpenAI token 使用量報告中的錯誤類型 (#15524)- 允許 openai 的 streaming token counts (#15548)

### `llama-index-postprocessor-nvidia-rerank` \[0.2.1]

- 新增 truncate 支援 (#15490)
- 更新至 0.2.0 並移除舊程式碼 (#15533)
- 將預設模型更新為 nvidia/nv-rerankqa-mistral-4b-v3 (#15543)

### `llama-index-readers-bitbucket` \[0.1.4]

- 修復從 bitbucket 載入檔案路徑的問題 (#15311)

### `llama-index-readers-google` \[0.3.1]

- 強化 google drive reader 的功能與易用性 (#15512)

### `llama-index-readers-remote` \[0.1.6]

- 檢查並清理 remote reader urls (#15494)

### `llama-index-vector-stores-qdrant` \[0.2.17]

- fix: 為 sparse vectors 在 QdrantVectorStore 中設定 IDF modifier (#15538)

## \[2024-08-18]

### `llama-index-core` \[0.10.67]

- 避免使用 nltk 3.9 因為其有缺陷 (#15473)
- docs: openllmetry 現在使用 instrumentation (#15443)
- 修復 LangChainDeprecationWarning (#15397)
- 在 Context 中新增 get/set API 並使其支援 coroutine-safe (#15152)
- docs: Cleanlab 的 cookbook (#15352)
- 在 vector stores 的 `async_add()` 中傳遞 kwargs (#15333)
- 在 structured llm 中對 json 進行 escape 處理 (#15404)
- docs: 新增使用 workflows cookbook 的 JSONAlyze Query Engine (#15408)

### `llama-index-embeddings-gigachat` \[0.1.0]

- 新增 GigaChat embedding (#15278)

### `llama-index-finetuning` \[0.1.12]

- feat: 整合 Azure OpenAI Finetuning (#15297)

### `llama-index-graph-stores-neptune` \[0.1.7]

- 公開 NeptuneQueryException 並新增除錯資訊 (#15448)
- 修復問題 #15414 並為 Neptune Analytics 新增 partial match 功能 (#15415)
- 使用反引號對 label 進行 escape 處理 (#15324)

### `llama-index-llms-cohere` \[0.2.1]

- feat: 為 cohere 新增 tool calling (#15144)

### `llama-index-packs-corrective-rag` \[0.1.2]

- 將 LongRAGPack、Corrective RAG Pack 與 Self-Discover Pack 移植至 Workflows (#15160)

### `llama-index-packs-longrag` \[0.1.1]

- 將 LongRAGPack、Corrective RAG Pack 與 Self-Discover Pack 移植至 Workflows (#15160)

### `llama-index-packs-self-discover` \[0.1.2]

- 將 LongRAGPack、Corrective RAG Pack 與 Self-Discover Pack 移植至 Workflows (#15160)

### `llama-index-readers-preprocess` \[0.1.4]

- 強化 PreprocessReader (#15302)

## \[2024-08-15]

### `llama-index-core` \[0.10.66]

- 由於最新版本從 pypi 移除，暫時還原 nltk 依賴
- 新增帶有 workflows 範例的 citation query engine (#15372)
- bug: Semantic double merging splitter 產生的 chunk 大於 chunk size (#15188)
- feat: 使 workflows 中的 `send_event()` 指定目標步驟 (#15259)
- 使所有 workflow 事件可像 mappings 一樣被存取 (#15310)

### `llama-index-indices-managed-bge-m3` \[0.1.0]

- 新增 BGEM3Index (#15197)

### `llama-index-llms-huggingface` \[0.2.7]

- 更新 HF 的 completion\_to\_prompt (#15354)

### `llama-index-llms-sambanova` \[0.1.0]

- 為 Llama-index 提供 SambaNova (Sambaverse 與 SambaStudio) 的 Wrapper (#15220)

### `llama-index-packs-code-hierarchy` \[0.1.7]

- 更新 code\_hierarchy.py 以新增 php 支援 (#15145)

### `llama-index-postprocessor-dashscope-rerank` \[0.1.4]

- 修復呼叫 llama-index-postprocessor-dashscope-rerank 時的 bug (#15358)

### `llama-index-readers-box` \[0.1.2]

- Box 重構：Box File 至 Llama-Index Document adaptor (#15314)

### `llama-index-readers-gcs` \[0.1.8]

- GCSReader: 實作 ResourcesReaderMixin 與 FileSystemReaderMixin (#15365)

### `llama-index-tools-box` \[0.1.1]

- Box 重構：Box File 至 Llama-Index Document adaptor (#15314)
- Box tools for AI Agents (#15236)

### `llama-index-vector-stores-postgres` \[0.1.14]

- 檢查 hnsw index 是否存在 (#15287)

## \[2024-08-12]

### `llama-index-core` \[0.10.65]

- chore: 提升 nltk 版本 (#15277)

### `llama-index-tools-box` \[0.1.0]

- Box tools for AI Agents (#15236)

### `llama-index-multi-modal-llms-gemini` \[0.1.8]

- feat: 為 Gemini multi-model 新增 default\_headers (#15296)

### `llama-index-vector-stores-clickhouse` \[0.2.0]

- chore: 在 clickhouse 整合中停止使用 ServiceContext (#15300)

### `llama-index-experimental` \[0.2.0]

- chore: 從 experimental package 中移除 ServiceContext 的使用 (#15301)

### `llama-index-extractors-marvin` \[0.1.4]

- fix: 修復 MarvinMetadataExtractor 功能並套用 async 支援 (#15247)

### `llama-index-utils-workflow` \[0.1.1]

- chore: 提升 black 版本 (#15288)- chore: 提升 nltk 版本 (#15277)

### `llama-index-readers-microsoft-onedrive` \[0.1.9]

- chore: 提升 nltk 版本 (#15277)

### `llama-index-embeddings-upstage` \[0.1.3]

- chore: 提升 nltk 版本 (#15277)

### `llama-index-embeddings-nvidia` \[0.1.5]

- chore: 提升 nltk 版本 (#15277)

### `llama-index-embeddings-litellm` \[0.1.1]

- chore: 提升 nltk 版本 (#15277)

### `llama-index-legacy` \[0.9.48post1]

- chore: 提升 nltk 版本 (#15277)

### `llama-index-packs-streamlit-chatbot` \[0.1.5]

- chore: 提升 nltk 版本 (#15277)

### `llama-index-embeddings-huggingface` \[0.2.3]

- Feature: 為建立 hf embeddings 新增 multiprocessing 支持 (#15260)

## \[2024-08-09]

### `llama-index-core` \[0.10.64]

- fix: 修正 children nodes 未從 source nodes 攜帶 metadata 的問題 (#15254)
- Workflows: 修正 decorator 中的驗證錯誤 (#15252)
- fix: 在 SQL Retriever 中去除 '''sql (Markdown SQL 程式碼片段) (#15235)

### `llama-index-indices-managed-colbert` \[0.2.0]

- 在 Colbert 整合中移除 ServiceContext 的使用 (#15249)

### `llama-index-vector-stores-milvus` \[0.1.23]

- feat: 支援 Milvus collection 屬性 (#15241)

### `llama-index-llms-cleanlab` \[0.1.2]

- 更新 Cleanlab TLM 支援的模型 (#15240)

### `llama-index-llms-huggingface` \[0.2.6]

- 在 HF chat template 中新增 generation prompt (#15239)

### `llama-index-llms-openvino` \[0.2.1]

- 在 HF chat template 中新增 generation prompt (#15239)

### `llama-index-graph-stores-neo4j` \[0.2.14]

- Neo4jPropertyGraphStore.get() 檢查 id 屬性 (#15228)

### `llama-index-readers-file` \[0.1.33]

- 修正 fs.open 路徑類型 (#15226)

## \[2024-08-08]

### `llama-index-core` \[0.10.63]

- 在 workflow decorator 中新增 num\_workers 以解決 step 並行問題 (#15210)
- 將 Sub Question Query Engine 作為 workflow notebook 範例 (#15209)
- 在 workflow notebooks 中新增 Llamatrace (#15186)
- 在 fusion retriever 中使用 node hash 代替 node text 以匹配 nodes (#15172)

### `llama-index-embeddings-mistralai` \[0.1.5]

- 處理 mistral v1.0 client (#15229)

### `llama-index-extractors-relik` \[0.1.1]

- 修正 relik extractor 跳過錯誤 (#15225)

### `llama-index-finetuning` \[0.1.11]

- 處理 mistral v1.0 client (#15229)

### `llama-index-graph-stores-neo4j` \[0.2.14]

- 新增 neo4j 通用 node 標籤 (#15191)

### `llama-index-llms-anthropic` \[0.1.17]

- 允許 Anthropic 訊息中包含圖片 (#15227)

### `llama-index-llms-mistralai` \[0.1.20]

- 處理 mistral v1.0 client (#15229)

### `llama-index-packs-mixture-of-agents` \[0.1.2]

- 使用 workflows 更新 Mixture Of Agents llamapack (#15232)

### `llama-index-tools-slack` \[0.1.4]

- 修正 ToolSpec 中的 slack client 引用 (#15202)

## \[2024-08-06]

### `llama-index-core` \[0.10.62]

- feat: 允許使用 IS\_EMPTY 運算子進行 None metadata 過濾 (#15167)
- fix: 在 node 解析期間，盡可能使用 parent source node 來建立 node 關係 (#15182)
- 在 fusion retriever 中使用 node hash 代替 node text 以匹配 nodes (#15172)

### `llama-index-graph-stores-neo4j` \[0.2.13]

- Neo4j property graph 用戶端批次處理 (#15179)

### `llama-index-graph-stores-neptune` \[0.1.4]

- PropertyGraphStore 支援 Amazon Neptune (#15126)

### `llama-index-llms-gemini` \[0.2.0]

- feat: 為 Gemini model 新增 default\_headers (#15141)

### `llama-index-llms-openai` \[0.1.28]

- OpenAI: 在 tool param 中支援新的 strict 功能 (#15177)

### `llama-index-vector-stores-opensearch` \[0.1.14]

- 在 Opensearch 中新增對完整 MetadataFilters 的支援 (#15176)

### `llama-index-vector-stores-qdrant` \[0.2.15]

- feat: 允許使用 IS\_EMPTY 運算子進行 None metadata 過濾 (#15167)

### `llama-index-vector-stores-wordlift` \[0.3.0]

- 新增對 fields projection 的支援並更新範例 Notebook (#15140)

## \[2024-08-05]

### `llama-index-core` \[0.10.61]

- 微調 workflow 文件 (document `.send_event()`，擴充範例) (#15154)
- 建立 context manager 以對 event 和 span tags 進行 instrument (#15116)
- 更新 keyval index store 以接受自定義 collection 後綴 (#15134)
- 使 workflow context 能夠收集多個相同的 event (#15153)
- 修正 AsyncStreamingResponse 的 `__str__` 方法 (#15131)

### `llama-index-callbacks-literalai` \[1.0.0]

- feat(integration): 為 Literal AI 新增全域處理常式 (#15064)

### `llama-index-extractors-relik` \[0.1.0]

- 新增 relik kg 建構子 (#15123)

### `llama-index-graph-stores-neo4j` \[0.1.12]

- fix neo4j 在查詢時的 property graph 關係屬性 (#15068)

### `llama-index-llms-fireworks` \[0.1.9]

- feat: 為 Fireworks llm 新增 default\_headers (#15150)

### `llama-index-llms-gemini` \[0.1.12]

- Fix: Gemini 1.0 Pro Vision 已正式棄用，將預設模型切換至 gemini-1.5-flash (#15000)

### `llama-index-llms-paieas` \[0.1.0]

- 為 AlibabaCloud PaiEas 新增 LLM (#14983)

### `llama-index-llms-predibase` \[0.1.7]

- 修復 HuggingFace 託管之 fine-tuned adapters 的 Predibase Integration (#15130)

## \[2024-02-02]

### `llama-index-core` \[0.10.60]

- 更新 `StartEvent` 用法以支援 dot notation 屬性存取 (#15124)
- 新增 GraphRAGV2 notebook (#15119)
- 修復 DynamicLLMPathExtractor 的微小 bug 以及預設 output parsers 無法運作的問題 (#15085)
- 更新 workflow timeouts 的 typing (#15102)
- fix(sql\_wrapper): 當不存在外鍵時不要提及 (#14998)

### `llama-index-graph-stores-neo4j` \[0.2.11]

- fix neo4j 擷取關係屬性的問題 (#15111) (#15108)

### `llama-index-llms-vllm` \[0.1.9]

- 更新 base.py 以使用 @atexit 進行清理 (#15047)

### `llama-index-vector-stores-pinecone` \[0.1.9]

- 提升 pinecone client 版本依賴 (#15121)

### `llama-index-vector-stores-redis` \[0.2.1]

- 處理 Redis 向量資料庫的巢狀 MetadataFilters (#15093)

### `llama-index-vector-stores-wordlift` \[0.2.0]

- 更新 WordLift Vector Store 以使用新的 client 套件 (#15045)

## \[2024-07-31]

### `llama-index-core` \[0.10.59]

- 引入用於事件驅動編排的 `Workflow`s (#15067)
- 為 context chat engine 新增功能，允許將先前的 chunks 插入目前的 context window (#14889)
- 在文件中新增 MLflow Integration (#14977)
- docs(literalai): 在文件中新增 Literal AI integration (#15023)
- 擴展 query pipeline 的 span 覆蓋範圍 (#14997)
- 使重新拋出錯誤在 `asyncio_run()` 期間跳過建構子 (#14970)

### `llama-index-embeddings-ollama` \[0.1.3]

- 新增正確的 async embedding 支援

### `llama-index-embeddings-textembed` \[0.0.1]

- 新增對 textembed embedding 的支援 (#14968)

### `llama-index-graph-stores-falkordb` \[0.1.5]

- 初步實作 FalkorDBPropertyGraphStore (#14936)

### `llama-index-llms-azure-inference` \[0.1.1]

- Fix: Azure AI 推論整合對 tools 的支援 (#15044)

### `llama-index-llms-fireworks` \[0.1.7]

- 更新預設模型以支援 function calling (#15046)

### `llama-index-llms-ollama` \[0.2.2]

- 為 ollama function calling 新增切換開關 (#14972)
- 為 Ollama 新增 function calling (#14948)

### `llama-index-llms-openllm` \[0.2.0]

- 更新至 OpenLLM 0.6 (#14935)

### `llama-index-packs-longrag` \[0.1.0]

- 新增實作 LongRAG 的 LlamaPack (#14916)

### `llama-index-postprocessor-tei-rerank` \[0.1.0]

- 透過 Text Embedding Interface 支援 Re-Ranker (#15063)

### `llama-index-readers-confluence` \[0.1.7]

- 調整 confluence reader 認證參數的優先順序 (#14905)

### `llama-index-readers-file` \[0.1.31]

- UnstructuredReader 使用檔名作為 ID (#14946)

### `llama-index-readers-gitlab` \[0.1.0]

- 新增 GitLab reader integration (#15030)

### `llama-index-readers-google` \[0.2.11]

- 修復平均評分在 float 與 int 之間的問題 (#15070)

### `llama-index-retrievers-bm25` \[0.2.2]

- 在 bm25 tokenize 中使用正確的 stemmer (#14965)

### `llama-index-vector-stores-azureaisearch` \[0.1.13]

- 修復刪除不存在索引的問題 (#14949)

### `llama-index-vector-stores-elasticsearch` \[0.2.5]

- 停用 sparse strategy 的 embeddings (#15032)

### `llama-index-vector-stores-kdbai` \[0.2.0]

- 更新 Hybrid search 的預設 sparse encoder (#15019)

### `llama-index-vector-stores-milvus` \[0.1.22]

- 強化 MilvusVectorStore，提供更靈活的索引管理以進行覆寫 (#15058)

### `llama-index-vector-stores-postgres` \[0.1.13]

- 新增使用 HNSW 索引建構 PGVectorStore 的選項 (#15024)

## \[2024-07-24]

### `llama-index-core` \[0.10.58]

- Fix: Token counter 預期 response.raw 為 dict，但收到 ChatCompletionChunk (#14937)
- 根據 agent 步驟回傳正確的 tool 輸出，而非全部回傳 (#14885)
- 修復 async structured streaming 的微小 bug (#14925)

### `llama-index-llms-fireworks` \[0.1.6]

- fireworks ai llama3.1 支援 (#14914)

### `llama-index-multi-modal-llms-anthropic` \[0.1.6]

- 將 claude 3.5 sonnet 新增至 multi modal llms (#14932)

### `llama-index-retrievers-bm25` \[0.2.1]

- 🐞 fix(integrations): 修復 BM25Retriever persist 缺少參數 similarity\_top\_k (#14933)

### `llama-index-retrievers-vertexai-search` \[0.1.0]

- Vertex AI Search 的 Llamaindex retriever (#14913)

### `llama-index-vector-stores-deeplake` \[0.1.5]

- 提升 `deeplake.get_nodes()` 效能 (#14920)

### `llama-index-vector-stores-elasticsearch` \[0.2.3]

- Bugfix：使用 sparse strategy 時，不要將空的 embeddings 列表傳遞給 elasticsearch store (#14918)

### `llama-index-vector-stores-lindorm` \[0.1.0]

- 新增 lindorm 的 vector store 整合 (#14623)

### `llama-index-vector-stores-qdrant` \[0.2.14]

- feat：允許限制檢索的元素數量 (qdrant) (#14904)

## \[2024-07-22]

### `llama-index-core` \[0.10.57]

- 為 VectorContextRetrieve… 新增選用參數 similarity\_score (#14831)
- 為 KGs 新增屬性提取 (使用屬性名稱與選用描述) (#14707)
- 可將 output classes 附加至 LLMs (#14747)
- 為 tool calling / structured extraction 新增 streaming 支援 (#14759)
- 修復在複製/pickling 時移除私有變數的問題 (#14860)
- 修復 ingestion pipeline 中將空陣列傳送到 vector store 的問題 (#14859)
- 優化 ingestion pipeline 的去重複 (deduping) 處理 (#14858)
- 為 VectorContextRetriever 新增選用參數 similarity\_score (#14831)

### `llama-index-llms-azure-openai` \[0.1.10]

- Bugfix：AzureOpenAI 使用自定義 azure\_ad\_token\_provider 時可能會失敗 (#14869)

### `llama-index-llms-bedrock-converse` \[0.1.5]

- feat: ✨ 在 BedrockConverse 中實作 async 功能 (#14326)

### `llama-index-llms-langchain` \[0.3.0]

- 將部分相依項目設為選用
- 提升整合中的 langchain 版本 (#14879)

### `llama-index-llms-ollama` \[0.1.6]

- Bugfix：ollama streaming 回應 (#14830)

### `llama-index-multi-modal-llms-anthropic` \[0.1.5]

- 對齊相依項目 (#14850)

### `llama-index-readers-notion` \[0.1.10]

- 更新 notion reader 以處理重複頁面、資料庫+頁面 ID (#14861)

### `llama-index-vector-stores-milvus` \[0.1.21]

- 為 Weviate, Opensearch, Milvus, Postgres, 以及 Pinecone Vector Stores 實作 delete\_nodes() 與 clear() (#14800)

### `llama-index-vector-stores-mongodb` \[0.1.8]

- MongoDB Atlas Vector Search：增強 Metadata Filtering (#14856)

### `llama-index-vector-stores-opensearch` \[0.1.13]

- 為 Weviate, Opensearch, Milvus, Postgres, 以及 Pinecone Vector Stores 實作 delete\_nodes() 與 clear() (#14800)

### `llama-index-vector-stores-pinecone` \[0.1.8]

- 為 Weviate, Opensearch, Milvus, Postgres, 以及 Pinecone Vector Stores 實作 delete\_nodes() 與 clear() (#14800)

### `llama-index-vector-stores-postgres` \[0.1.12]

- 為 Weviate, Opensearch, Milvus, Postgres, 以及 Pinecone Vector Stores 實作 delete\_nodes() 與 clear() (#14800)

### `llama-index-vector-stores-weaviate` \[1.0.2]

- 為 Weviate, Opensearch, Milvus, Postgres, 以及 Pinecone Vector Stores 實作 delete\_nodes() 與 clear() (#14800)

## \[2024-07-19]

### `llama-index-core` \[0.10.56]

- 修復 \_apply\_node\_postprocessors 函式需要 QueryBundle 的問題 (#14839)
- 新增 Context-Only Response Synthesizer (#14439)
- 修復 AgentRunner AgentRunStepStartEvent 的 dispatch 問題 (#14828)
- 改善 ReAct agent 的輸出格式 system prompt (#14814)
- 從 output parser utils 中移除雙大括號替換 (#14735)
- 更新 simple\_summarize.py (#14714)

### `llama-index-tools-azure-code-interpreter` \[0.2.0]

- chore: 從環境變數讀取 AZURE\_POOL\_MANAGEMENT\_ENDPOINT (#14732)

### `llama-index-llms-azure-inference` \[0.1.0]

- Azure AI Inference 整合 (#14672)

### `llama-index-embeddings-azure-inference` \[0.1.0]

- Azure AI Inference 整合 (#14672)

### `llama-index-llms-bedrock-converse` \[0.1.5]

- feat: ✨ 在 BedrockConverse 中實作 async 功能 (#14326)

### `llama-index-embeddings-yandexgpt` \[0.1.5]

- 新增 YandexGPT Embedding Model 的整合 (#14313)

### `llama-index-tools-google` \[0.1.6]

- 更新 gmailtoolspec 的 search\_messages 工具 docstring (#14840)

### `llama-index-postprocessor-nvidia-rerank` \[0.1.5]

- 新增對 nvidia/nv-rerankqa-mistral-4b-v3 的支援 (#14844)

### `llama-index-embeddings-openai` \[0.1.11]

- 修復 OpenAI Embedding async client bug (#14835)

### `llama-index-embeddings-azure-openai` \[0.1.11]

- 修復 Azure OpenAI LLM 以及 Embedding async client bug (#14833)

### `llama-index-llms-azure-openai` \[0.1.9]

- 修復 Azure OpenAI LLM 以及 Embedding async client bug (#14833)

### `llama-index-multi-modal-llms-openai` \[0.1.8]

- 新增對 gpt-4o-mini 的支援 (#14820)

### `llama-index-llms-openai` \[0.1.26]

- 新增對 gpt-4o-mini 的支援 (#14820)

### `llama-index-llms-mistralai` \[0.1.18]

- 新增對 mistralai nemo model 的支援 (#14819)

### `llama-index-graph-stores-neo4j` \[0.2.8]

- 修復在 neo4j property graph 中使用 sanitize 時的 bug (#14812)
- 在 neo4j 的 get\_triples 中新增 filter (#14811)

### `llama-index-vector-stores-azureaisearch` \[0.1.12]

- feat: 為 azureaisearch 新增 nested filters (#14795)

### `llama-index-vector-stores-qdrant` \[0.2.13]

- feat: 為 Qdrant vector store 新增 NOT IN filter (#14791)

### `llama-index-vector-stores-azureaisearch` \[0.1.11]

- feat: 新增 azureaisearch 支援的 conditions (#14787)
- feat: azureaisearch 支援 collection string (#14712)

### `llama-index-tools-weather` \[0.1.4]

- 修復 OpenWeatherMapToolSpec.forecast\_tommorrow\_at\_location (#14745)

### `llama-index-readers-microsoft-sharepoint` \[0.2.6]

- 追蹤 odata.nextLink (#14708)

### `llama-index-vector-stores-qdrant` \[0.2.12]

- 為 QdrantVectorStore 新增 Quantization 選項 (#14740)

### `llama-index-vector-stores-azureaisearch` \[0.1.10]

- feat: 改善 azureai search 的刪除功能 (#14693)

### `llama-index-agent-openai` \[0.2.9]

- fix: openai api 的 attachments 需要 tools (#14609)

### `llama-index-readers-box` \[0.1.0]

- 新的整合

### `llama-index-embeddings-fastembed` \[0.1.6]

- 修復 fastembed python 版本 (#14710)

## \[2024-07-11]

### `llama-index-core` \[0.10.55]

- 各項文件更新

### `llama-index-llms-cleanlab` \[0.1.1]

- 為 Cleanlab LLM 整合新增使用者設定 (#14676)

### `llama-index-readers-file` \[0.1.30]

- 修復多個 concurrent pptx readers 在單一暫存檔名上的 race condition (#14686)

### `llama-index-tools-exa` \[0.1.4]

- 修改 Exa search tool 的入門指南與範例 notebook (#14690)

## \[2024-07-10]

### `llama-index-core` \[0.10.54]

- fix: 更新 simple vector store filter 的 operator 邏輯 (#14674)
- 新增 AgentOps 整合 (#13935)

### `llama-index-embeddings-fastembed` \[0.1.5]

- chore: 更新 Qdrant fastembed 套件中要求的 python 版本 (#14677)

### `llama-index-embeddings-huggingface-optimum-intel` \[0.1.6]

- 提升 llama-index-embeddings-huggingface-optimum-intel 版本 (#14670)

### `llama-index-vector-stores-elasticsearch` \[0.2.2]

- 新增對自定義 index settings 的支援 (#14655)

### `llama-index-callbacks-agentops` \[0.1.0]

- 初始版本發佈

### `llama-index-indices-managed-vertexai` \[0.0.2]

- 修復 #14637 Llamaindex managed Vertex AI index 需要更新 (#14641)

### `llama-index-readers-file` \[0.1.29]

- 修復 simple file reader 中的 unstructured import (#14642)

## \[2024-07-08]

### `llama-index-core` \[0.10.53]

- 修復 llama-agents 在 `llm.predict_and_call` 中處理 react 使用方式的問題 (#14556)
- 在 `ReActAgent` 呼叫 `super().__init__` 時新增缺失的 verbose 參數 (#14565)
- 修復使用 IngestionPipeline parallel 時的 `llama-index-core\llama_index\core\node_parser\text\utils.py` 錯誤 (#14560)
- 將 `KnowledgeGraphIndex` 標記為棄用，並調整文件 (#14575)
- 修復 `ChatSummaryMemoryBuffer` 無法摘要包含 tool callings 的對話紀錄問題 (#14563)
- 新增 `DynamicLLMPathExtractor`，用於由 LLMs 即時推斷 Schema 的 Entity Detection (#14566)
- 新增 cloud document 轉換器 (#14608)
- 修復 KnowledgeGraphIndex 參數 ‘kg\_triple\_extract\_template’ 的拼字錯誤 (#14619)
- Fix: 因 unstructured 變更而更新 `UnstructuredElementNodeParser` (#14606)
- 更新 ReAct Step 以解決生成不完整的問題 (#14587)

### `llama-index-callbacks-promptlayer` \[0.1.3]

- 請求成功時將 Conditions 記錄至 promptlayer (#14632)

### `llama-index-embeddings-databricks` \[0.1.0]

- 新增 embeddings databricks 整合 (#14590)

### `llama-index-llms-ai21` \[0.3.1]

- 修復 AI21 Package 中 MessageRole 從錯誤套件 import 的問題 (#14596)

### `llama-index-llms-bedrock` \[0.1.12]

- 處理 Bedrock AnthropicProvider 中的空回應 (#14479)
- 為 Bedrock InvokeAPI 新增 claude 3.5 sonnet 支援 (#14594)

### `llama-index-llms-bedrock-converse` \[0.1.4]

- 修復 Bedrock Converse 在有多個連續 function call 時的 tool use 區塊問題 (#14386)

### `llama-index-llms-optimum-intel` \[0.1.0]

- 在 llama-index-integration 中新增使用 ipex backend 的 optimum intel (#14553)

### `llama-index-llms-qianfan` \[0.1.0]

- 新增 baidu-qianfan llm (#14414)

### `llama-index-llms-text-generation-inference` \[0.1.4]

- 修復：model name 查詢時 LLMMetadata 崩潰的問題 (#14569)
- 從 text-embeddings-inference 中移除 hf embeddings 依賴 (#14592)

### `llama-index-llms-yi` \[0.1.1]

- 更新 yi llm context\_window (#14578)

### `llama-index-readers-file` \[0.1.28]

- 為 PandasExcelReader.load\_data 新增 fs 參數 (#14554)
- UnstructuredReader 功能增強 (#14390)

### `llama-index-readers-web` \[0.1.22]

- nit：修復 firecrawl 建立 documents 的問題 (#14579)

### `llama-index-retrievers-bm25` \[0.2.0]

- 更新 BM25Retriever 以使用較新（且較快）的 bm25s library #(14581)

### `llama-index-vector-stores-qdrant` \[0.2.11]

- 重構：不再忽略來自 Qdrant collection\_exists 的 exception (#14564)
- 新增對 qdrant bm42 的支援，可設定 sparse + dense 配置 (#14577)

## \[2024-07-03]

### `llama-index-core` \[0.10.52]

- 修復 Windows 上的 file reader 路徑 bug (#14537)
- 由於父類別變更，跟進 colbert index 中的 kwargs 傳遞問題 (#14522)
- 將 query pipeline agent 標記為棄用，建議改用 FnAgentWorker (#14525O)

### `llama-index-callbacks-arize-phoenix` \[0.1.6]

- 支援最新版本的 arize #14526

### `llama-index-embeddings-litellm` \[0.1.0]

- 新增對 LiteLLM Proxy Server embeddings 的支援 (#14523)

### `llama-index-finetuning` \[0.1.10]

- 新增來自 sentence\_transformers 的 device 選擇 (#14546)

### `llama-index-graph-stores-neo4` \[0.2.7]

- 修復向量查詢時回傳的 nodes 排序問題 (#14461)

### `llama-index-llms-bedrock` \[0.1.10]

- 處理 Bedrock AnthropicProvider 中的空回應 (#14479)

### `llama-index-llms-bedrock-converse` \[0.1.4]

- 修復新增 string kwarg 時 Bedrock Converse 的 join\_two\_dicts 函式 (#14548)

### `llama-index-llms-upstage` \[0.1.4]

- 新增 upstage tokenizer 及 token 計數方法 (#14502)

### `llama-index-readers-azstorage-blob` \[0.1.7]

- 修復獲取 blob 物件名稱的 bug (#14547)

### `llama-index-readers-file` \[0.1.26]

- 修復 Pandas excel reader 載入資料時附加 documents 的問題 (#14501)

### `llama-index-readers-iceberg` \[0.1.0]

- 在 LLamaIndex 中新增 Iceberg Reader 整合 (#14477)

### `llama-index-readers-notion` \[0.1.8]

- 新增重試機制 (#14488)
- 新增 `list_databases` 方法 (#14488)

### `llama-index-readers-slack` \[0.1.5]

- 增強 SlackReader，可從 Channel Names/Patterns 獲取 Channel IDs (#14429)

### `llama-index-readers-web` \[0.1.21]

- 為 firecrawl reader 新增 API url (#14452)

### `llama-index-retrievers-bm25` \[0.1.5]

- 修復 BM25 retriever 回傳的 nodes 分數 (#14495)

### `llama-index-vector-stores-azureaisearch` \[0.1.9]

- 為 azure ai search 新增 async 方法 (#14496)

### `llama-index-vector-stores-kdbai` \[0.1.8]

- Kdbai rest 相容性更新 (#14511)

### `llama-index-vector-stores-mongodb` \[0.1.6]

- 為 MongoDBAtlasVectorSearch 新增 Hybrid 與 Full-Text Search (#14490)

## \[2024-06-28]

### `llama-index-core` \[0.10.51]

- 修復 function calling llms 與空 tool calls 的問題 (#14453)
- 修復 query pipeline 中 ChatMessage 未被視為可轉換為字串的問題 (#14378)
- 更新 schema llm path extractor，使其也能接收有效的 triples 列表 (#14357)
- 在 `build_index_from_nodes` 時傳遞 kwargs (#14341)

### `llama-index-agent-dashscope` \[0.1.0]

- 新增 Alibaba Cloud dashscope agent (#14318)

### `llama-index-graph-stores-neo4j` \[0.2.6]

- 為 neo4j\_property\_graph 新增 MetadataFilters (#14362)

### `llama-index-llms-nvidia` \[0.1.4]

- 為託管模型新增已知的 context lengths (#14436)

### `llama-index-llms-perplexity` \[0.1.4]

- 更新可用模型 (#14409)

### `llama-index-llms-predibase` \[0.1.6]

- 改進無效 API token 的錯誤處理 (#14440)

### `llama-index-llms-yi` \[0.1.0]

- 整合 Yi 模型 (#14353)

### `llama-index-readers-google` \[0.2.9]

- 為 Google Chat 建立 Data Loader (#14397)

### `llama-index-readers-s3` \[0.1.10]

- 在 S3Reader 中使 s3fs 快取失效 (#14441)

### `llama-index-readers-structured-data` \[0.1.0]

- 為 xlsx, csv, json 與 jsonl 新增 StructuredDataReader 支援 (#14369)

### `llama-index-tools-jina` \[0.1.0]

- 整合名為 jina search 的新工具 (#14317)

### `llama-index-vector-stores-astradb` \[0.1.8]

- 更新 Astra DB vector store 以使用現代的 astrapy library (#14407)

### `llama-index-vector-stores-chromadb` \[0.1.10]

- 修復 chroma get 的 ids 索引存取問題 (#14434)

### `llama-index-vector-stores-deeplake` \[0.1.4]

- 在 deeplake vector store 中實作 delete\_nodes() 與 clear() (#14457)
- 在 deeplake vector store 中實作 get\_nodes() (#14388)

### `llama-index-vector-stores-elasticsearch` \[0.2.1]

- 在 Elasticsearch 索引建立中增加對動態 metadata 欄位的支援 (#14431)

### `llama-index-vector-stores-kdbai` \[0.1.7]

- Kdbai 版本相容性更新 (#14402)

## \[2024-06-24]

### `llama-index-core` \[0.10.50]

- 為自定義 agents 增加極簡的 `FnAgentWorker` (#14329)
- 在 build\_index\_from\_nodes 時傳遞 kwargs (#14341)
- 提升 async utils 對於巢狀 async 的穩定性 (#14356)

### `llama-index-llms-upstage` \[0.1.3]

- 每個 llm 均為 chat model (#14334)

### `llama-index-packs-rag-evaluator` \[0.1.5]

- 在 RAG 評估套件中增加執行本地 embedding model 的可能性 (#14352)

## \[2024-06-23]

### `llama-index-core` \[0.10.49]

- 改進 `llama-cloud` 與 client 依賴關係 (#14254)

### `llama-index-indices-managed-llama-cloud` \[0.2.1]

- 改進 `LlamaCloudIndex` 中的介面與 client 互動 (#14254)

### `llama-index-llms-bedrock-converse` \[0.1.3]

- 在 bedrock converse 中增加 claude sonnet 3.5 (#14306)

### `llama-index-llms-upstage` \[0.1.2]

- 設定預設 context size (#14293)
- 在 upstage llm 與 embeddings 中增加 api\_key 別名 (#14233)

### `llama-index-storage-kvstore-azure` \[0.1.2]

- 優化 inserts (#14321)

### `llama-index-utils-azure` \[0.1.1]

- 修復 azure\_table\_storage 參數 bug (#14182)

### `llama-index-vector-stores-neo4jvector` \[0.1.6]

- 增加 neo4j client 方法 (#14314)

## \[2024-06-21]

### `llama-index-core` \[0.10.48]

- 提升 average precision 的效率 (#14260)
- 增加 crewai + llamaindex cookbook (#14266)
- 在 TextNode 中增加 mimetype 欄位 (#14279)
- 改進 IBM watsonx.ai 文件 (#14271)
- 更新文件首頁，增加 agents 指南等內容 (#14089)

### `llama-index-llms-anthropic` \[0.1.14]

- 增加對 claude 3.5 的支援 (#14277)

### `llama-index-llms-bedrock-converse` \[0.1.4]

- 為 function calling 實作 Bedrock Converse API (#14055)

## \[2024-06-19]

### `llama-index-core` \[0.10.47]

- 增加 average precision 作為檢索指標 (#14189)
- 在 jupyter notebooks 中增加可視化預設 simple graph\_store 的 `.show_jupyter_graph()` 方法 (#14104)
- 修正 nltk 檔案查找的行為 (#14040)
- 為 generate\_qa\_pairs 增加輔助參數 (#14054)
- 增加新的 semantic chunking 方法：double-pass merging (#13629)
- 啟用 query pipelines 的逐步執行 (#14117)
- 將 tenacity 上限替換為僅拒絕 8.4.0 (#14218)
- 在 `llm.predict_and_call()` 中傳遞 error\_on\_no\_tool\_call kwarg (#14253)
- 在 query pipeline 中，避免將 nodes 轉型為字串，改用 `get_content()` (#14242)
- 修復 NLSQLTableQueryEngine 的 response metadata (#14169)
- 在預設 simple property graph 中不再覆寫 relations (#14244)

### `llama-index-embeddings-ipex-llm` \[0.1.5]

- 為 ipex embedding 整合啟用 Intel GPU 選項 (#14214)

### `llama-index-embeddings-mixedbreadai` \[0.1.0]

- 增加 mixedbread ai 整合 (#14161)

### `llama-index-graph-stores-neo4j` \[0.2.5]

- 為 neo4j upsert relations 增加預設 node 屬性 (#14095)

### `llama-index-indices-managed-postgresml` \[0.3.0]

- 在 PostgresML Managed Index 中增加 re-ranking (#14134)

### `llama-index-llms-ai21` \[0.3.0]

- 為 async 方法使用 async AI21 client (#14193)

### `llama-index-llms-bedrock-converse` \[0.1.2]

- 增加 (fake) async 呼叫以避免錯誤 (#14241)

### `llama-index-llms-deepinfra` \[0.1.3]

- 為 deep infra llm 增加 function calling (#14127)

### `llama-index-llms-ipex-llm` \[0.1.8]

- 為 ipex embedding 整合啟用 Intel GPU 選項 (#14214)

### `llama-index-llms-oci-genai` \[0.1.1]

- 為 oci genai 增加 command r 支援 (#14080)

### `llama-index-llms-premai` \[0.1.7]

- Prem AI Templates 支援 Llama Index (#14105)

### `llama-index-llms-you` \[0.1.0]

- 整合 You.com conversational APIs (#14207)

### `llama-index-readers-mongodb` \[0.1.8]

- 為 SimpleMongoReader 新增 metadata 欄位 “collection\_name” (#14245)

### `llama-index-readers-pdf-marker` \[0.1.0]

- 新增 marker-pdf reader (#14099)

### `llama-index-readers-upstage` \[0.1.0]

- 新增 upstage 作為 reader (#13415)

### `llama-index-postprocessor-mixedbreadai-rerank` \[0.1.0]

- 新增 mixedbread ai 整合 (#14161)

### `llama-index-vector-stores-lancedb` \[0.1.6]

- LanceDB：程式碼清理與微小更新 (#14077)

### `llama-index-vector-stores-opensearch` \[0.1.12]

- 新增自訂預設 OpenSearch Client 與 Engine 的選項 (#14249)

## \[2024-06-17]

### `llama-index-core`\[0.10.46]

- 在 core 中固定 tenacity 與 numpy 版本 (#14203)
- 新增 precision 與 recall 指標 (#14170)
- 為 Vertex AI 開啟 Function calling 與 agent runner (#14088)
- 修復 batch\_gather (#14162)

### `llama-index-utils-huggingface` \[0.1.1]

- 從 HuggingFace utils 套件中移除 sentence-transformers 依賴 (#14204)

### `llama-index-finetuning` \[0.1.8]

- 新增 MistralAI Finetuning API 支援 (#14101)

### `llama-index-llms-mistralai` \[0.1.16]

- 更新 MistralAI (#14199)

### `llama-index-llms-bedrock-converse` \[0.1.0]

- fix: 🐛 修復 PyPI 發行版本的 Bedrock Converse’ pyproject.toml (#14197)

### `llama-index-utils-azure` \[0.1.1]

- 使用典型的 include llama\_index/ (#14196)
- Feature/azure\_table\_storage (#14182)

### `llama-index-embeddings-nvidia` \[0.1.4]

- 新增對 nvidia/nv-embed-v1 (<https://huggingface.co/nvidia/NV-Embed-v1>) 的支援 (#14194)

### `llama-index-retrievers-you` \[0.1.3]

- 新增 news retriever (#13934)

### `llama-index-storage-kvstore-azure` \[0.1.1]

- 修復遺漏 await 的 bug (#14177)

### `llama-index-embeddings-nomic` \[0.4.0post1]

- 還原 Nomic Embed einops 依賴 (#14176)

### `llama-index-retrievers-bm25` \[0.1.4]

- 將 BM25Retriever \_retrieve 改為使用 numpy 方法 (#14015)

### `llama-index-llms-gemini` \[0.1.11]

- 為 Gemini.stream\_chat 新增遺漏的 @llm\_chat\_callback() (#14166)

### `llama-index-llms-vertex` \[0.2.0]

- 為 Vertex AI 開啟 Function calling 與 agent runner (#14088)

### `llama-index-vector-stores-opensearch` \[0.1.11]

- feat: 在 OpenSearch VectorStore 上支援 VectorStoreQueryMode.TEXT\_SEARCH (#14153)

## \[2024-06-14]

### `llama-index-core` \[0.10.45]

- 修復 sql query.py 的解析 (#14109)
- 實作 NDCG 指標 (#14100)
- 修復 Structured Generation 的 System Prompts (#14026)
- 將 HuggingFace embeddings 分離至 HuggingFace API 與 TextGenerationInference 套件 (#14013)
- 新增 PandasExcelReader 類別以解析 excel 檔案 (#13991)
- feat: 在 ingestion pipeline 中新增 spans (#14062)

### `llama-index-vector-stores-qdrant` \[0.2.10]

- 修復 Qdrant nodes (#14149)

### `llama-index-readers-mongodb` \[0.1.7]

- 修復 TypeError: sequence item : expected str instance, int found

### `llama-index-indices-managed-vertexai` \[0.0.1]

- feat: 為 Vertex AI 上的 RAG 新增 LlamaIndex Managed Index (#13626)

### `llama-index-llms-oci-genai` \[0.1.1]

- Feature/新增 oci genai 的 command r 支援 (#14080)

### `llama-index-vector-stores-milvus` \[0.1.20]

- MilvusVectorStore：在 output\_fields 中始終包含 text\_key (#14076)

### `llama-index-packs-mixture-of-agents` \[0.1.0]

- 新增 Mixture Of Agents 論文實作 (#14112)

### `llama-index-llms-text-generation-inference` \[0.1.0]

- 將 HuggingFace embeddings 分離至 HuggingFace API 與 TextGenerationInference 套件 (#14013)

### `llama-index-llms-huggingface-api` \[0.1.0]

- 將 HuggingFace embeddings 分離至 HuggingFace API 與 TextGenerationInference 套件 (#14013)

### `llama-index-embeddings-huggingface-api` \[0.1.0]

- 將 HuggingFace embeddings 分離至 HuggingFace API 與 TextGenerationInference 套件 (#14013)

### `llama-index-utils-huggingface` \[0.1.0]

- 將 HuggingFace embeddings 分離至 HuggingFace API 與 TextGenerationInference 套件 (#14013)

### `llama-index-llms-watsonx` \[0.1.8]

- Feat: IBM watsonx.ai llm 與 embeddings 整合 (#13600)

### `llama-index-llms-ibm` \[0.1.0]

- Feat: IBM watsonx.ai llm 與 embeddings 整合 (#13600)

### `llama-index-embeddings-ibm` \[0.1.0]

- Feat: IBM watsonx.ai llm 與 embeddings 整合 (#13600)

### `llama-index-vector-stores-milvus` \[0.1.19]

- 修復 milvus filter enum 解析 (#14111)

### `llama-index-llms-anthropic` \[0.1.13]

- 修復 anthropic llm 呼叫 (#14108)

### `llama-index-storage-index-store-postgres` \[0.1.4]

- 修正將 Postgres 誤用為 mongo 名稱的問題 (#14107)

### `llama-index-embeddings-bedrock` \[0.2.1]

- 移除 Bedrock embedding 中不必要的 excluded from 欄位 (#14085)

### `llama-index-finetuning` \[0.1.7]

- 新功能：新增 trust remote code (#14102)

### `llama-index-readers-file` \[0.1.25]

- nit：修正 pandas excel reader (#14086)

### `llama-index-llms-anthropic` \[0.1.12]

- 將 anthropic 依賴版本更新至最低 0.26.2 (#14091)

### `llama-index-llms-llama-cpp` \[0.1.4]

- 新增對 Llama 3 Instruct prompt 格式的支援 (#14072)

### `llama-index-llms-bedrock-converse` \[0.1.8]

- 實作用於 function calling 的 Bedrock Converse API (#14055)

### `llama-index-vector-stores-postgres` \[0.1.11]

- fix/postgres-metadata-in-filter-single-elem (#14035)

### `llama-index-readers-file` \[0.1.24]

- 新增 PandasExcelReader 類別以解析 excel 檔案 (#13991)

### `llama-index-embeddings-ipex-llm` \[0.1.4]

- 更新 llama-index-embeddings-ipex-llm 的依賴項目

### `llama-index-embeddings-gemini` \[0.1.8]

- 在 Gemini Embedding 中新增 api key 作為欄位 (#14061)

### `llama-index-vector-stores-milvus` \[0.1.18]

- 擴充 milvus 向量儲存 (vector store) 的篩選選項 (#13961)

## \[2024-06-10]

### `llama-index-core` \[0.10.44]

- 將 WEBP 和 GIF 新增至 SimpleDirectoryReader 支援的圖片類型 (#14038)
- refactor：透過 mixin 為 abstractmethods 新增 spans (#14003)
- 為 SQLAutoVectorQueryEngine 新增 streaming 支援 (#13947)
- 為 NLSQLTableQueryEngine 新增指定 embed\_model 的選項 (#14006)
- 為 multimodal LLMs 新增 spans (#13966)
- 將 auto prev next 變更為 compact 模式 (#13940)
- feat：為 streaming 錯誤新增 exception events (#13917)
- feat：為 tools 新增 spans (#13916)

### `llama-index-embeddings-azure-openai` \[0.1.10]

- 修正使用 azure\_ad 但未設定 API key 時的錯誤 (#13970)

### `llama-index-embeddings-jinaai` \[0.2.0]

- 新增 Jina Embeddings MultiModal (#13861)

### `llama-index-embeddings-nomic` \[0.3.0]

- 新增 Nomic multi modal embeddings (#13920)

### `llama-index-graph-stores-neo4j` \[0.2.3]

- 確保 cypher 在迭代前回傳 list (#13938)

### `llama-index-llms-ai21` \[0.2.0]

- 新增對 AI21 Labs Jamba-Instruct 的支援 (#14030)

### `llama-index-llms-deepinfra` \[0.1.2]

- fix(deepinfrallm)：修正預設 max\_tokens (#13998)

### `llama-index-llms-vllm` \[0.1.8]

- 修正 `__del__()` Vllm (#14053)

### `llama-index-packs-zenguard` \[0.1.0]

- 新增 ZenGuard llamapack (#13959)

### `llama-index-readers-google` \[0.2.7]

- 修正 google drive reader 中類別屬性 (class attributes) 的設定方式 (#14022)
- 新增 Google Maps Text Search Reader (#13884)

### `llama-index-readers-jira` \[0.1.4]

- 支援 hosted instances 的 Jira 個人存取權杖 (personal access token) (#13890)

### `llama-index-readers-mongodb` \[0.1.6]

- 在載入時設定 document ids (#14000)

### `llama-index-retrievers-duckdb-retriever` \[0.1.0]

- 新增 DuckDBRetriever (#13929)

### `llama-index-vector-stores-chroma` \[0.1.9]

- 為 chromadb 新增 inclusion filter (#14010)

### `llama-index-vector-stores-lancedb` \[0.1.5]

- 修正 LanceDBVectorStore `add()` 邏輯 (#13993)

### `llama-index-vector-stores-milvus` \[0.1.17]

- 為 Milvus 向量儲存支援所有篩選運算子 (#13745)

### `llama-index-vector-stores-postgres` \[0.1.10]

- 將 llama-index-vector-stores-postgres 的 SQLAlchemy 支援範圍擴大至 1.4+ (#13936)

### `llama-index-vector-stores-qdrant` \[0.2.9]

- Qdrant：為 `doc_id` 建立 payload index (#14001)

## \[2024-06-02]

### `llama-index-core` \[0.10.43]

- 屬性圖索引 (property graph index) 向量儲存盡可能使用預設 UUIDs (#13886)
- 避免在屬性圖索引中進行空白或重複的插入 (#13891)
- 修正 simple property graph store 中 `get_rel_map` 的 cur depth (#13888)
- (暫時方案) 停用來自 logging generators 的 instrumentation (#13901)
- 為 Dispatcher.get\_dispatch\_event() 方法新增向下相容性 (#13895)
- 修正：StructuredPlannerAgent 中 acreate\_plan 的命名錯誤 (#13879)

### `llama-index-graph-stores-neo4j` \[0.2.2]

- 處理 type 缺失的情況 (neo4j 屬性圖) (#13875)
- 將 `Neo4jPGStore` 重新命名為 `Neo4jPropertyGraphStore` (含向下相容) (#13891)

### `llama-index-llms-openai` \[0.1.22]

- 改善 OpenAI 的重試機制 (#13878)

### `llama-index-readers-web` \[0.1.18]

- AsyncWebPageReader：將其修正為真正的非同步 (async)；先前存在阻塞行為 (#13897)

### `llama-index-vector-stores-opensearch` \[0.1.10]

- 修復 OpenSearch filter 邏輯 (#13804)

## \[2024-05-31]

### `llama-index-core` \[0.10.42]

- 允許在 property graph index 中正確設定 vector store (#13816)
- 修復 langchain bridge 的 import (#13871)

### `llama-index-graph-stores-nebula` \[0.2.0]

- PropertyGraphStore 新增對 NebulaGraph 的支援 (#13816)

### `llama-index-llms-langchain` \[0.1.5]

- 修復 langchain llm 中的 fireworks import (#13871)

### `llama-index-llms-openllm` \[0.1.5]

- feat(openllm): 0.5 sdk 整合更新 (#13848)

### `llama-index-llms-premai` \[0.1.5]

- 更新 SDK 相容性 (#13836)

### `llama-index-readers-google` \[0.2.6]

- 修復 GoogleDriveReader 中 token 導致無限迴圈的 bug (#13863)

## \[2024-05-30]

### `llama-index-core` \[0.10.41]

- 將 embeddings 從 index 傳遞至 property graph retriever (#13843)
- 防止 instrumentation event/span handler 互相干擾 (#13823)
- 為 completion streaming 補上缺失的 events (#13824)
- 修復發生 exception 時缺失 callback\_manager.on\_event\_end 的問題 (#13825)

### `llama-index-llms-gemini` \[0.1.10]

- 為 gemini 使用 `model` kwarg 作為 model name (#13791)

### `llama-index-llms-mistralai` \[0.1.15]

- 新增 mistral code model (#13807)
- 更新 mistral codestral 以支援 fill in middle endpoint (#13810)

### `llama-index-llms-openllm` \[0.1.5]

- 0.5 整合更新 (#13848)

### `llama-index-llms-vertex` \[0.1.8]

- 為 Vertex Integration 的 Pydantic Error 新增安全設定 (#13817)

### `llama-index-readers-smart-pdf-loader` \[0.1.5]

- 在 smart pdf reader 中處理 path 物件 (#13847)

## \[2024-05-28]

### `llama-index-core` \[0.10.40]

- 新增 `PropertyGraphIndex` 及其他支援性抽象層。詳情請參閱 [完整指南](https://docs.llamaindex.ai/en/latest/module_guides/indexing/lpg_index_guide/) (#13747)
- 更新 `AutoPrevNextNodePostprocessor` 以允許傳遞 response mode 與 LLM (#13771)
- 修復 return direct 的型別處理 (#13776)
- 將 retrieval evaluator 中的 method 名稱修正為 `_aget_retrieved_ids_and_texts` (#13765)
- fix: QueryTransformComponent 呼叫 `self._query_transform` 錯誤 (#13756)
- 為 `SimpleVectorStoreIndex` 實作更多 filters (#13365)

### `llama-index-embeddings-bedrock` \[0.2.0]

- 新增對 Bedrock Titan Embeddings v2 的支援 (#13580)

### `llama-index-embeddings-oci-genai` \[0.1.0]

- 新增 Oracle Cloud Infrastructure (OCI) Generative AI (#13631)

### `llama-index-embeddings-huggingface` \[0.2.1]

- 從 AutoModel 釋出 “safe\_serialization” 參數 (#11939)

### `llama-index-graph-stores-neo4j` \[0.2.0]

- 新增 `Neo4jPGStore` 以支援 property graph (#13747)

### `llama-index-indices-managed-dashscope` \[0.1.1]

- 新增 dashscope managed index (#13378)

### `llama-index-llms-oci-genai` \[0.1.0]

- 新增 Oracle Cloud Infrastructure (OCI) Generative AI (#13631)

### `llama-index-readers-feishu-wiki` \[0.1.1]

- 修復未定義變數 (#13768)

### `llama-index-packs-secgpt` \[0.1.0]

- SecGPT - LlamaIndex 整合 #13127

### `llama-index-vector-stores-hologres` \[0.1.0]

- 新增 Hologres 向量資料庫 (#13619)

### `llama-index-vector-stores-milvus` \[0.1.16]

- 移除 FlagEmbedding 作為 Milvus 的依賴 (#13767)；統一 collection 建構方式，不再受 enable\_sparse 數值影響 (#13773)

### `llama-index-vector-stores-opensearch` \[0.1.9]

- 重構將 helper methods 放入 class 定義中 (#13749)

## \[2024-05-24]

### `llama-index-core` \[0.10.39]

- 新增 VectorMemory 與 SimpleComposableMemory (#13352)
- 改進 MarkdownReader 以忽略程式碼區塊中的標題 (#13694)
- 正確處理 async element node parsers (#13698)
- 在 function calling worker 中僅回傳 message 內容 (#13677)
- nit: 修復 multimodal query engine 以使用 metadata (#13712)
- 新增 notebook 以提供針對冗長 tool descriptions 與 QueryPlanTool 的暫行解決方案 (#13701)

### `llama-index-embeddings-ipex-llm` \[0.1.2]

- 改進裝置選擇 (#13644)

### `llama-index-indices-managed-postgresml` \[0.1.3]

- 新增 PostgresML Managed Index (#13623)

### `llama-index-indices-managed-vectara` \[0.1.4]

- 新增 chat engine、streaming、factual consistency score 等功能 (#13639)

### `llama-index-llms-deepinfra` \[0.0.1]

- 新增 DeepInfra LLM Models 整合 (#13652)

### `llama-index-llm-ipex-llm` \[0.1.3]

- 為 llama-index-llm-ipex-llm 新增 GPU 支援 (#13691)

### `llama-index-llms-lmstudio` \[0.1.0]

- lmstudio 整合 (#13557)

### `llama-index-llms-ollama` \[0.1.5]

- 使用 aiter\_lines 函式來迭代 ollama 整合中的行 (#13699)

### `llama-index-llms-vertex` \[0.1.6]

- 為 gemini 新增 safety\_settings 參數 (#13568)

### `llama-index-postprocessor-voyageai-rerank` \[0.1.3]

- 修復 VoyageAI reranking bug (#13622)

### `llama-index-retrievers-mongodb-atlas-bm25-retriever` \[0.1.4]

- 補上缺失的 return (#13720)

### `llama-index-readers-web` \[0.1.17]

- 新增 Scrapfly Web Loader (#13654)

### `llama-index-vector-stores-postgres` \[0.1.9]

- 修復 delete 與特殊字元的 bug (#13651)

### `llama-index-vector-stores-supabase` \[0.1.5]

- 針對 .\_client 屬性不存在的情況加入 try-catch (#13681)

## \[2024-05-21]

### `llama-index-core` \[0.10.38]

- 在 BaseSQLTableQueryEngine 中啟用 streaming (#13599)
- 修復 relational node parsers 中的 nonetype 錯誤 (#13615)
- feat(instrumentation): 為 ALL llms 新增 spans (#13565)
- 正確限制產生的問題數量 (#13596)
- 在 element Node Parsers 中傳遞 ‘exclude\_llm\_metadata\_keys’ 與 ‘exclude\_embed\_metadata\_keys’ (#13567)
- 為 QueryPipeline 新增 batch mode (#13203)
- 改進 SentenceEmbeddingOptimizer 以遵循 Settings.embed\_model (#13514)
- 提升 ReAct output parser 的強健性 (#13459)
- 修復 pydantic tool calling 僅使用單一參數的問題 (#13522)
- 避免 stream chat 未產生結果時出現非預期錯誤 (#13422)

### `llama-index-embeddings-nomic` \[0.2.0]

- 透過 inference\_mode 參數實作 local Nomic Embed (#13607)

### `llama-index-embeddings-nvidia` \[0.1.3]

- 將 `mode()` 棄用並改用 `__init__(base_url=...)` (#13572)
- 新增 snowflake/arctic-embed-l 支援 (#13555)

### `llama-index-embeddings-openai` \[0.1.10]

- 更新 openai 的重試觸發方式 (#13608)

### `llama-index-embeddings-upstage` \[0.1.0]

- Integrations: upstage LLM 與 Embeddings (#13193)

### `llama-index-llms-gemini` \[0.1.8]

- feat: 為 multimodal LLM 與 regular 新增 gemini 新模型 (#13539)

### `llama-index-llms-groq` \[0.1.4]

- fix: 啟用 tool use (#13566)

### `llama-index-llms-lmstudio` \[0.1.0]

- 新增 lmstudio 整合支援 (#13557)

### `llama-index-llms-nvidia` \[0.1.3]

- 將 `mode()` 棄用並改用 `__init__(base_url=...)` (#13572)

### `llama-index-llms-openai` \[0.1.20]

- 更新 openai 的重試觸發方式 (#13608)

### `llama-index-llms-unify` \[0.1.0]

- 新增 Unify LLM 支援 (#12921)

### `llama-index-llms-upstage` \[0.1.0]

- Integrations: upstage LLM 與 Embeddings (#13193)

### `llama-index-llms-vertex` \[0.1.6]

- 新增 MedLM 模型支援 (#11911)

### `llama_index.postprocessor.dashscope_rerank` \[0.1.0]

- 為 postprocessor 新增 dashscope rerank (#13353)

### `llama-index-postprocessor-nvidia-rerank` \[0.1.2]

- 將 `mode()` 棄用並改用 `__init__(base_url=...)` (#13572)

### `llama-index-readers-mongodb` \[0.1.5]

- SimpleMongoReader 應允許 metadata 中包含選填欄位 (#13575)

### `llama-index-readers-papers` \[0.1.5]

- fix: (ArxivReader) 從隱藏目錄讀取資料時將 exclude\_hidden 設為 False (#13578)

### `llama-index-readers-sec-filings` \[0.1.5]

- fix: 向 sec.gov 發送請求時的 sec\_filings header (#13548)

### `llama-index-readers-web` \[0.1.16]

- 新增 firecrawl search mode (#13560)
- 更新 Browserbase web reader (#13535)

### `llama-index-tools-cassandra` \[0.1.0]

- 為 agents 新增 Cassandra 資料庫 tool spec (#13423)

### `llama-index-vector-stores-azureaisearch` \[0.1.7]

- 允許在沒有 non-null metadata 欄位的情況下查詢 AzureAISearch (#13531)

### `llama-index-vector-stores-elasticsearch` \[0.2.0]

- 從 Elasticsearch client 整合 VectorStore (#13291)

### `llama-index-vector-stores-milvus` \[0.1.14]

- 修復 Milvus 向量儲存空間的 filter expression 建構問題 (#13591)

### `llama-index-vector-stores-supabase` \[0.1.4]

- 刪除時中斷連線 (#13611)

### `llama-index-vector-stores-wordlift` \[0.1.0]

- 新增 WordLift 向量儲存空間 (#13028)

## \[2024-05-14]

### `llama-index-core` \[0.10.37]

- 在呼叫時為 `MultiModalLLMCompletionProgram` 新增 image\_documents (#13467)
- 將 threading 切換為 asyncio 以修復 RuntimeError (#13486)
- 新增對 prompt kwarg 的支援 (#13405)
- VectorStore -> BasePydanticVectorStore (#13439)
- fix: 修復 user\_message 不存在的 bug (#13432)
- 匯入缺失的 response type (#13382)
- 將 `CallbackManager` 新增至 `MultiModalLLM` (#13400)

### `llama-index-llms-bedrock` \[0.1.8]

- 從 Bedrock Cohere invoke model request 中移除 “Truncate” 參數 (#13442)

### `llama-index-readers-web` \[0.1.14]

- 為 trafilatura web reader 新增 Trafilatura kwargs 與進度條 (#13454)

### `llama-index-vector-stores-postgres` \[0.1.8]

- 修復 #9522 - 使用 hybrid search 時的 SQLAlchemy 警告 (#13476)

### `llama-index-vector-stores-lantern` \[0.1.4]

- 修復 #9522 - 使用 hybrid search 時的 SQLAlchemy 警告 (#13476)

### `llama-index-callbacks-uptrain` \[0.2.0]

- 更新 UpTrain Callback Handler 以支援新的 Upgratin eval schema (#13479)

### `llama-index-vector-stores-zep` \[0.1.3]

- VectorStore -> BasePydanticVectorStore (#13439)

### `llama-index-vector-stores-vearch` \[0.1.1]

- VectorStore -> BasePydanticVectorStore (#13439)

### `llama-index-vector-stores-upstash` \[0.1.4]

- VectorStore -> BasePydanticVectorStore (#13439)

### `llama-index-vector-stores-typesense` \[0.1.3]

- VectorStore -> BasePydanticVectorStore (#13439)

### `llama-index-vector-stores-timescalerevector` \[0.1.3]

- VectorStore -> BasePydanticVectorStore (#13439)

### `llama-index-vector-stores-tencentvectordb` \[0.1.4]

- VectorStore -> BasePydanticVectorStore (#13439)

### `llama-index-vector-stores-tair` \[0.1.3]

- VectorStore -> BasePydanticVectorStore (#13439)

### `llama-index-vector-stores-singlestoredb` \[0.1.3]

- VectorStore -> BasePydanticVectorStore (#13439)

### `llama-index-vector-stores-rocksetdb` \[0.1.3]

- VectorStore -> BasePydanticVectorStore (#13439)

### `llama-index-vector-stores-neptune` \[0.1.1]

- VectorStore -> BasePydanticVectorStore (#13439)

### `llama-index-vector-stores-neo4jvector` \[0.1.5]

- VectorStore -> BasePydanticVectorStore (#13439)

### `llama-index-vector-stores-myscale` \[0.1.3]

- VectorStore -> BasePydanticVectorStore (#13439)

### `llama-index-vector-stores-metal` \[0.1.3]

- VectorStore -> BasePydanticVectorStore (#13439)

### `llama-index-vector-stores-jaguar` \[0.1.3]

- VectorStore -> BasePydanticVectorStore (#13439)

### `llama-index-vector-stores-epsilla` \[0.1.3]

- VectorStore -> BasePydanticVectorStore (#13439)

### `llama-index-vector-stores-dynamodb` \[0.1.3]

- VectorStore -> BasePydanticVectorStore (#13439)

### `llama-index-vector-stores-dashvector` \[0.1.3]

- VectorStore -> BasePydanticVectorStore (#13439)

### `llama-index-vector-stores-chatgpt-plugin` \[0.1.3]

- VectorStore -> BasePydanticVectorStore (#13439)

### `llama-index-vector-stores-baiduvectordb` \[0.1.1]

- VectorStore -> BasePydanticVectorStore (#13439)

### `llama-index-vector-stores-bagel` \[0.1.3]

- VectorStore -> BasePydanticVectorStore (#13439)

### `llama-index-vector-stores-awsdocdb` \[0.1.5]

- VectorStore -> BasePydanticVectorStore (#13439)

### `llama-index-vector-stores-awadb` \[0.1.3]

- VectorStore -> BasePydanticVectorStore (#13439)

### `llama-index-vector-stores-alibabacloud-opensearch` \[0.1.1]

- VectorStore -> BasePydanticVectorStore (#13439)

### `llama-index-readers-wordlift` \[0.1.4]

- VectorStore -> BasePydanticVectorStore (#13439)

### `llama-index-readers-guru` \[0.1.4]

- VectorStore -> BasePydanticVectorStore (#13439)

### `llama-index-readers-pebblo` \[0.1.1]

- VectorStore -> BasePydanticVectorStore (#13439)

### `llama-index-postprocessor-voyageai-rerank` \[0.1.2]

- 提升 rerank 版本 (#13465)

### `llama-index-postprocessor-sbert-rerank` \[0.1.4]

- 提升 rerank 版本 (#13465)

### `llama-index-postprocessor-rankllm-rerank` \[0.1.3]

- 提升 rerank 版本 (#13465)

### `llama-index-postprocessor-rankgpt-rerank` \[0.1.4]

- 提升 rerank 版本 (#13465)

### `llama-index-postprocessor-openvino-rerank` \[0.1.3]

- 提升 rerank 版本 (#13465)

### `llama-index-postprocessor-nvidia-rerank` \[0.1.1]

- 提升 rerank 版本 (#13465)

### `llama-index-postprocessor-jinaai-rerank` \[0.1.3]

- 提升 rerank 版本 (#13465)

### `llama-index-postprocessor-flag-embedding-rerank` \[0.1.3]

- 提升 rerank 版本 (#13465)

### `llama-index-postprocessor-colbert-rerank` \[0.1.2]

- 提升 rerank 版本 (#13465)

### `llama-index-postprocessor-cohere-rerank` \[0.1.6]

- 提升 rerank 版本 (#13465)

### `llama-index-multi-modal-llms-openai` \[0.1.6]

- 支援 gpt-4o (#13463)

### `llama-index-llms-openai` \[0.1.19]

- 支援 gpt-4o (#13463)

### `llama-index-packs-rag-fusion-query-pipeline` \[0.1.4]

- 修復 RAG fusion pipeline (#13413)

### `llama-index-agent-openai` \[0.2.5]

- 修復：更新 OpenAIAssistantAgent 以使用 attachments (#13341)

### `llama-index-embeddings-deepinfra` \[0.1.0]

- 新的 embeddings 整合 (#13323)

### `llama-index-llms-mlx` \[0.1.0]

- 新的 llm 整合 (#13231)

### `llama-index-vector-stores-milvus` \[0.1.12]

- 修復：修正 connections.connect() 中的連線參數 (#13448)

### `llama-index-vector-stores-azureaisearch` \[0.1.6]

- 修復 AzureAiSearchVectorStore metadata 的 f-string (#13435)

### `llama-index-vector-stores-mongodb` \[0.1.5]

- 為 MongoDBAtlasVectorSearch 新增 Unit 與 Integration 測試 (#12854)

### `llama-index-llms-huggingface` \[0.2.0]

- 更新 llama-index-llms-huggingface 依賴項目 (#13420)

### `llama-index-vector-store-relyt` \[0.1.0]

- 新增 vector store 整合

### `llama-index-storage-kvstore-redis` \[0.1.5]

- 在 RedisKVStore 中實作 async 方法 (#12943)

### `llama-index-packs-cohere-citation-chat` \[0.1.5]

- 固定 llama-index-llms-cohere 依賴項目版本 (#13417)

### `llama-index-llms-cohere` \[0.2.0]

- 固定 cohere 依賴項目版本 (#13417)

### `llama-index-tools-azure-code-interpreter` \[0.1.1]

- 修復 indexing 問題與 runtime 錯誤訊息 (#13414)

### `llama-index-postprocessor-cohere-rerank` \[0.1.5]

- 修復 Cohere Rerank bug (#13410)

### `llama-index-indices-managed-llama-cloud` \[0.1.7]

- 修復 retriever 整合 (#13409)

### `llama-index-tools-azure-code-interpreter` \[0.1.0]

- 新增 tool

### `llama-index-readers-google` \[0.2.5]

- 修復 GoogleDriveReader 缺少 authorized\_user\_info 檢查的問題 (#13394)

### `llama-index-storage-kvstore-firestore` \[0.2.1]

- await Firestore 的 AsyncDocumentReference (#13386)

### `llama-index-llms-nvidia` \[0.1.2]

- 新增動態 model 列表支援 (#13398)

## \[2024-05-09]

### `llama-index-core` \[0.10.36]

- 在 MarkdownElementParser 中新增 start\_char\_idx 與 end\_char\_idx (#13377)
- 使用來自全域預設值的 handlers (#13368)

### `llama-index-readers-pebblo` \[0.1.0]

- 初始版本發佈 (#13128)

### `llama-index-llms-cohere` \[0.1.7]

- 使用 documents 參數呼叫 Cohere RAG 推論 (#13196)

### `llama-index-vector-scores-kdbai` \[0.1.6]

- 更新 add 方法以解碼 utf-8 (#13194)

### `llama-index-vector-stores-alibabacloud-opensearch` \[0.1.0]

- 初始版本發佈 (#13286)

### `llama-index-tools-multion` \[0.2.0]

- 更新 tool 以使用更新後的 api/sdk (#13373)

### `llama-index-vector-sores-weaviate` \[1.0.0]

- 更新至 weaviate client v4 (#13229)

### `llama-index-readers-file` \[0.1.22]

- 修復 PDFReader 忽略 extra\_info 的 bug (#13369)

### `llama-index-llms-azure-openai` \[0.1.8]

- 新增 sync httpx client 支援 (#13370)

### `llama-index-llms-openai` \[0.1.18]

- 新增 sync httpx client 支援 (#13370)
- 新增缺失的 openai model token context (#13337)

### `llama-index-readers-github` \[0.1.9]

- 新增 fail\_on\_http\_error (#13366)

### `llama-index-vector-stores-pinecone` \[0.1.7]

- 為 pinecone 新增 attribution tag (#13329)

### `llama-index-llms-nvidia` \[0.1.1]

- 將預設 max\_tokens 設為 1024 (#13371)

### `llama-index-readers-papers` \[0.1.5]

- 修復 arxiv reader 的隱藏暫存目錄問題 (#13351)

### `llama-index-embeddings-nvidia` \[0.1.1]

- 修復 truncate 傳遞 aget\_query\_embedding 與 get\_text\_embedding 的問題 (#13367)

### `llama-index-llms-anyscare` \[0.1.4]

- 新增 llama-3 models (#13336)

## \[2024-05-07]

### `llama-index-agent-introspective` \[0.1.0]

- 新增 CRITIC 與 reflection agent 整合 (#13108)

### `llama-index-core` \[0.10.35]

- 修復 `from_defaults()` 抹除 summary memory buffer 歷史紀錄的問題 (#13325)
- 在 core 中使用現有的 async event loop 而非 `asyncio.run()` (#13309)
- 修復 condense question chat engine 中來自 query engine 的 async streaming 問題 (#13306)
- 在 element node parsers 的 extract\_table\_summaries 中處理 ValueError (#13318)
- 為 QASummaryQueryEngineBuilder 與 RouterQueryEngine 正確處理 llm (#13281)
- 擴展 instrumentation payloads (#13302)
- 修復 sql join 語句缺少 schema 的 Bug (#13277)

### `llama-index-embeddings-jinaai` \[0.1.5]

- 在 JinaEmbedding 類別中新增 encoding\_type 參數 (#13172)
- 修復 JinaEmbeddings 中的 encoding type 存取問題 (#13315)

### `llama-index-embeddings-nvidia` \[0.1.0]

- 新增 nvidia nim embeddings 支援 (#13177)

### `llama-index-llms-mistralai` \[0.1.12]

- 修復使用 Mistral AI 進行 streaming 時的 async 問題 (#13292)

### `llama-index-llms-nvidia` \[0.1.0]

- 新增 nvidia nim llm 支援 (#13176)

### `llama-index-postprocessor-nvidia-rerank` \[0.1.0]

- 新增 nvidia nim rerank 支援 (#13178)

### `llama-index-readers-file` \[0.1.21]

- 更新 MarkdownReader 以解析第一個標題之前的文字 (#13327)

### `llama-index-readers-web` \[0.1.13]

- feat: Spider Web Loader (#13200)

### `llama-index-vector-stores-vespa` \[0.1.0]

- 為 Vespa 新增 VectorStore 整合 (#13213)

### `llama-index-vector-stores-vertexaivectorsearch` \[0.1.0]

- 新增對 Vertex AI Vector Search 作為 Vector Store 的支援 (#13186)

## \[2024-05-02]

### `llama-index-core` \[0.10.34]

- 移除 chat engine streaming 期間的錯誤忽略機制 (#13160)- 新增 structured planning agent (#13149)
- 更新 planner 的 base class agent (#13228)
- 修復：使用 SimpleFileNodeParser 解析檔案時，若檔案副檔名不在 FILE\_NODE\_PARSERS 中會發生錯誤 (#13156)
- 為 node parsers 新增 matching `source_node.node_id` 驗證 (#13109)
- Retrieval Metrics：更新 Evaluation\@K 檢索的 HitRate 與 MRR documents，並新增 RR 作為獨立指標 (#12997)
- 新增 chat summary memory buffer (#13155)

### `llama-index-indices-managed-zilliz` \[0.1.3]

- ZillizCloudPipelineIndex 支援使用彈性參數來建立 pipelines (#10134, #10112)

### `llama-index-llms-huggingface` \[0.1.7]

- 透過 Hugging Face 的 text-generation-inference 整合，新增 tool usage 支援 (#12471)

### `llama-index-llms-maritalk` \[0.2.0]

- 為 maritalk 新增 streaming 支援 (#13207)

### `llama-index-llms-mistral-rs` \[0.1.0]

- 整合 mistral.rs LLM (#13105)

### `llama-index-llms-mymagic` \[0.1.7]

- mymagicai api 更新 (#13148)

### `llama-index-llms-nvidia-triton` \[0.1.5]

- 為 Nvidia Triton 整合新增 Streaming 支援 (#13135)

### `llama-index-llms-ollama` \[0.1.3]

- 為 ollama llms 新增 async 支援 (#13150)

### `llama-index-readers-microsoft-sharepoint` \[0.2.2]

- SharePoint Reader：從 LLMs 與 embeddings 中排除存取控制元數據鍵 (#13184)

### `llama-index-readers-web` \[0.1.11]

- feat: Browserbase Web Reader (#12877)

### `llama-index-readers-youtube-metadata` \[0.1.0]

- 新增 YouTube Metadata Reader (#12975)

### `llama-index-storage-kvstore-redis` \[0.1.4]

- 修復 redis kvstore key 為 bytes 的問題 (#13201)

### `llama-index-vector-stores-azureaisearch` \[0.1.5]

- Azure AI Search 遵循 filter 條件 (#13215)

### `llama-index-vector-stores-chroma` \[0.1.7]

- 針對新版 chroma client 進行微調 (#13158)

### `llama-index-vector-stores-firestore` \[0.1.0]

- 新增 Firestore Vector Store (#12048)

### `llama-index-vector-stores-kdbai` \[0.1.5]

- 修復 `add()` 後回傳 ID 的小問題 (#12515)

### `llama-index-vector-stores-milvus` \[0.1.11]

- 為 MilvusVectorStore 新增 hybrid retrieval 模式 (#13122)

### `llama-index-vector-stores-postgres` \[0.1.7]

- 在 pgvector store 中將 queries 參數化 (#13199)

## \[2024-04-27]

### `llama-index-core` \[0.10.33]

- 新增 agent\_worker.as\_agent() (#13061)

### `llama-index-embeddings-bedrock` \[0.1.5]

- 使用 Bedrock cohere 字元限制 (#13126)

### `llama-index-tools-google` \[0.1.5]

- 將 attendees 的預設值更改為空列表 (#13134)

### `llama-index-graph-stores-falkordb` \[0.1.4]

- 當 index 已存在時，跳過 index 建立錯誤 (#13085)

### `llama-index-tools-google` \[0.1.4]

- 修復 google calendar create\_event 的 datetime api (#13132)

### `llama-index-llms-anthropic` \[0.1.11]

- 將多個 prompts 合併為一個 (#13131)

### `llama-index-indices-managed-llama-cloud` \[0.1.6]

- 在 LlamaCloud Retriever 中使用 MetadataFilters (#13117)

### `llama-index-graph-stores-kuzu` \[0.1.3]

- 修復 kuzu 整合的 .execute() 呼叫 (#13100)

### `llama-index-vector-stores-lantern` \[0.1.3]

- 維護更新以同步 lantern builds (#13116)

## \[2024-04-25]

### `llama-index-core` \[0.10.32]

- 修正 `OutputKeys.from_keys()` 的錯誤輸出類型 (#13086)
- 為 aws base embedding 新增 run\_jobs (#13096)
- 允許使用者自訂 keyword extractor 的 prompt template (#13083)
- (CondenseQuestionChatEngine) 若無對話紀錄，則不壓縮問題 (#13069)
- QueryPlanTool：在查詢計畫的後續（相依）nodes 中執行 tool calls (#13047)
- 修復 fusion retriever 在進行 similarity search 前有時會回傳 Nonetype query(s) 的問題 (#13112)

### `llama-index-embeddings-ipex-llm` \[0.1.1]

- 為 Intel GPU 支援 llama-index-embeddings-ipex-llm (#13097)

### `llama-index-packs-raft-dataset` \[0.1.4]

- 修復 raft dataset generator 的 bug - 多個 system prompts (#12751)

### `llama-index-readers-microsoft-sharepoint` \[0.2.1]

- 為 SharePoint reader 新增存取控制相關元數據 (#13067)

### `llama-index-vector-stores-pinecone` \[0.1.6]

- 支援巢狀元數據篩選 (Nested metadata filter) (#13113)

### `llama-index-vector-stores-qdrant` \[0.2.8]

- 支援巢狀元數據篩選 (Nested metadata filter) (#13113)

## \[2024-04-23]

### `llama-index-core` \[0.10.31]

- 修復來自 query engine 的 async streaming response (#12953)
- 在 element node parsers 中強制執行 uuid (#12951)- 新增 function calling LLM program (#12980)
- 使 PydanticSingleSelector 支援 async api (#12964)
- 修復 query pipeline 的 arun\_with\_intermediates (#13002)

### `llama-index-agent-coa` \[0.1.0]

- 新增 COA Agent 整合 (#13043)

### `llama-index-agent-lats` \[0.1.0]

- 官方 LATs agent 整合 (#13031)

### `llama-index-agent-llm-compiler` \[0.1.0]

- 新增 LLMCompiler Agent 整合 (#13044)

### `llama-index-llms-anthropic` \[0.1.10]

- 新增可將自定義 header 傳遞至 Anthropic LLM 請求的功能 (#12819)

### `llama-index-llms-bedrock` \[0.1.7]

- 將 claude 3 opus 新增至 BedRock 整合 (#13033)

### `llama-index-llms-fireworks` \[0.1.5]

- 在 Llama Index for Fireworks 中新增 Llama 3 與 Mixtral 8x22b 模型 (#12970)

### `llama-index-llms-openai` \[0.1.16]

- 修復 AsyncOpenAI 在快速建立與銷毀實例時出現的 「RuntimeError: Event loop is closed」bug (#12946)
- 不再對所有 OpenAI APIStatusError 異常進行重試，僅針對 InternalServerError 重試 (#12947)

### `llama-index-llms-watsonx` \[0.1.7]

- 更新 IBM watsonx foundation models (#12973)

### `llama-index-packs-code-hierarchy` \[0.1.6]

- 若 query node 不存在，則回傳 parent node (#12983)
- 修復 function 被定義兩次時的 bug (#12941)

### `llama-index-program-openai` \[0.1.6]

- 在 OpenAIPydanticProgram 中新增對 streaming partial instances of Pydantic 輸出類別的支援 (#13021)

### `llama-index-readers-openapi` \[0.1.0]

- 新增 openapi 檔案的 reader (#12998)

### `llama-index-readers-slack` \[0.1.4]

- 避免在拋出未處理異常時進入無限迴圈 (#12963)

### `llama-index-readers-web` \[0.1.10]

- 改進 whole site reader 以移除重複連結 (#12977)

### `llama-index-retrievers-bedrock` \[0.1.1]

- 修復 Bedrock KB retriever 以使用 query bundle (#12910)

### `llama-index-vector-stores-awsdocdb` \[0.1.0]

- 將 AWS DocumentDB 整合為向量儲存方法 (#12217)

### `llama-index-vector-stores-databricks` \[0.1.2]

- 修復 databricks vector search 的 metadata (#12999)

### `llama-index-vector-stores-neo4j` \[0.1.4]

- 支援 Neo4j metadata 過濾 (#12923)

### `llama-index-vector-stores-pinecone` \[0.1.5]

- 修復使用 sparse query 模式查詢 PineconeVectorStore 時的錯誤 (#12967)

### `llama-index-vector-stores-qdrant` \[0.2.5]

- 多項關於 async 以及檢查 collection 是否存在的修復 (#12916)

### `llama-index-vector-stores-weaviate` \[0.1.5]

- 為 WeviateVectoreStore 新增索引刪除功能 (#12993)

## \[2024-04-17]

### `llama-index-core` \[0.10.30]

- 為 QueryPipeline 新增 intermediate outputs (#12683)
- 修復顯示進度導致結果順序錯誤的問題 (#12897)
- 為 simple vector store 新增 OR 過濾條件支援 (#12823)
- 改進自定義 agent init (#12824)
- 修復沒有 docstore 時的 pipeline load (#12808)
- 在 `_arun_step_stream` 中使用 async `_aprocess_actions` (#12846)
- 為 StreamChatErrorEvent 提供 exception (#12879)
- 修復 load 與 search tool spec 中的 bug (#12902)

### `llama-index-embeddings-azure-opena` \[0.1.7]

- 公開 azure\_ad\_token\_provider 參數以支援 token 過期 (#12818)

### `llama-index-embeddings-cohere` \[0.1.8]

- 新增 httpx\_async\_client 選項 (#12896)

### `llama-index-embeddings-ipex-llm` \[0.1.0]

- 新增 ipex-llm embedding 整合 (#12740)

### `llama-index-embeddings-octoai` \[0.1.0]

- 新增 octoai embeddings (#12857)

### `llama-index-llms-azure-openai` \[0.1.6]

- 公開 azure\_ad\_token\_provider 參數以支援 token 過期 (#12818)

### `llama-index-llms-ipex-llm` \[0.1.2]

- 為 IpexLLM 整合新增載入 「low-bit format」模型的支援 (#12785)

### `llama-index-llms-mistralai` \[0.1.11]

- 支援 `open-mixtral-8x22b` (#12894)

### `llama-index-packs-agents-lats` \[0.1.0]

- 新增 LATS agent pack (#12735)

### `llama-index-readers-smart-pdf-loader` \[0.1.4]

- 為 documents 使用傳入的 metadata (#12844)

### `llama-index-readers-web` \[0.1.9]

- 新增 Firecrawl Web Loader (#12825)

### `llama-index-vector-stores-milvus` \[0.1.10]

- 在 Milvus 向量儲存中使用批次插入 (#12837)

### `llama-index-vector-stores-vearch` \[0.1.0]

- 將 vearch 新增至向量儲存 (#10972)

## \[2024-04-13]

### `llama-index-core` \[0.10.29]

- **BREAKING** 將 `PandasQueryEngine` 與 `PandasInstruction` parser 移至 `llama-index-experimental` (#12419)- new install: `pip install -U llama-index-experimental`
  - new import: `from llama_index.experimental.query_engine import PandasQueryEngine`

- 修復部分核心相依套件以使 python3.12 能正常運作 (#12762)

- 更新 async utils `run_jobs()` 以包含 tqdm description (#12812)

- 重構 kvdocstore delete 方法 (#12681)

### `llama-index-llms-bedrock` \[0.1.6]

- 支援來自 Bedrock 的 Mistral Large (#12804)

### `llama-index-llms-openvino` \[0.1.0]

- 新增 OpenVino LLMs (#12639)

### `llama-index-llms-predibase` \[0.1.4]

- 將 LlamaIndex-Predibase Integration 更新至最新版本 API (#12736)
- 在 LlamaIndex-Predibase integration 中，允許選擇使用 Predibase-hosted 或 HuggingFace-hosted 的 fine-tuned adapters (#12789)

### `llama-index-output-parsers-guardrails` \[0.1.3]

- 現代化 GuardrailsOutputParser (#12676)

### `llama-index-packs-agents-coa` \[0.1.0]

- Chain-of-Abstraction Agent Pack (#12757)

### `llama-index-packs-code-hierarchy` \[0.1.3]

- 修復多位元組字元 chunking 的問題 (#12715)

### `llama-index-packs-raft-dataset` \[0.1.4]

- 修復 raft dataset generator 中多個 system prompts 的 bug (#12751)

### `llama-index-postprocessor-openvino-rerank` \[0.1.2]

- 新增 openvino rerank 支援 (#12688)

### `llama-index-readers-file` \[0.1.18]

- 若 docx reader 的輸入路徑為 str，則將其轉換為 Path (#12807)
- 使 pip check 支援選用的 pdf 套件 (#12758)

### `llama-index-readers-s3` \[0.1.7]

- 修復 S3Reader 使用預設 s3 endpoint 時 doc id 錯誤的問題 (#12803)

### `llama-index-retrievers-bedrock` \[0.1.0]

- 以 retriever 形式新增 Amazon Bedrock 知識庫整合 (#12737)

### `llama-index-retrievers-mongodb-atlas-bm25-retriever` \[0.1.3]

- 新增 mongodb atlas bm25 retriever (#12519)

### `llama-index-storage-chat-store-redis` \[0.1.3]

- 修復 redis chat store 的訊息序列化問題 (#12802)

### `llama-index-vector-stores-astra-db` \[0.1.6]

- 放寬相依版本限制以接受 astrapy `1.*` (#12792)

### `llama-index-vector-stores-couchbase` \[0.1.0]

- 新增對 Couchbase 作為 Vector Store 的支援 (#12680)

### `llama-index-vector-stores-elasticsearch` \[0.1.7]

- 修復 elasticsearch hybrid rrf window\_size (#12695)

### `llama-index-vector-stores-milvus` \[0.1.8]

- 新增從 milvus 擷取 metadata 欄位的支援 (#12626)

### `llama-index-vector-stores-redis` \[0.2.0]

- 現代化 redis vector store，改用 redisvl (#12386)

### `llama-index-vector-stores-qdrant` \[0.2.0]

- refactor: 切換預設的 Qdrant sparse encoder (#12512)

## \[2024-04-09]

### `llama-index-core` \[0.10.28]

- 在 markdown node parser 中支援縮排的程式碼區塊 fence (#12393)
- 將 output parser 傳遞至 guideline evaluator (#12646)
- 新增 query pipeline + memory 的範例 (#12654)
- 在 CondensePlusContextChatEngine 的 async 模式中新增缺失的 node postprocessor (#12663)
- 在 tools /tool metadata 中新增 `return_direct` 選項 (#12587)
- 為 batch eval runner 新增重試機制 (#12647)
- Thread-safe instrumentation (#12638)
- Coroutine-safe instrumentation Spans (#12589)
- 在 PDFReader 中為非預設檔案系統新增 in-memory loading (#12659)
- 移除 sentence splitter 中多餘的 tokenizer 呼叫 (#12655)
- 將 SynthesizeComponent import 新增至 shortcut imports (#12655)
- 改進 SimpleSummarize 的截斷處理 (#12655)
- 在 eval\_utils default\_parser 中新增錯誤處理以確保正確性 (#12624)
- 在 RankGPT Postprocessor Nodes 中新增 async\_postprocess\_nodes (#12620)
- 修復 MarkdownNodeParser 的 ref\_doc\_id (#12615)

### `llama-index-embeddings-openvino` \[0.1.5]

- 新增對 openvino embeddings 的初步支援 (#12643)

### `llama-index-llms-anthropic` \[0.1.9]

- 新增 anthropic tool calling (#12591)

### `llama-index-llms-ipex-llm` \[0.1.1]

- 新增 ipex-llm 整合 (#12322)
- 為 ipex-llm llm 整合新增更多資料類型支援 (#12635)

### `llama-index-llms-openllm` \[0.1.4]

- 在 OpenLLM 中正確使用 PrivateAttr (#12655)

### `llama-index-multi-modal-llms-anthropic` \[0.1.4]

- 提升 anthropic 相依版本 (#12655)

### `llama-index-multi-modal-llms-gemini` \[0.1.5]

- 提升 generativeai 相依版本 (#12645)

### `llama-index-packs-dense-x-retrieval` \[0.1.4]

- 為 DenseXRetrievalPack 新增 streaming 支援 (#12607)

### `llama-index-readers-mongodb` \[0.1.4]

- 提高 MongoDB reader 的效率 (#12664)

### `llama-index-readers-wikipedia` \[0.1.4]

- 為 Wikipedia reader 新增多國語言支援 (#12616)

### `llama-index-storage-index-store-elasticsearch` \[0.1.3]

- 從預設 collection 名稱中移除無效字元 (#12672)

### `llama-index-vector-stores-milvus` \[0.1.8]

- 新增從 milvus 擷取 metadata 欄位的支援 (#12626)
- Bug 修復 - MilvusVectorStore 的 Similarity metric 始終為 IP (#12611)

## \[2024-04-04]

### `llama-index-agent-openai` \[0.2.2]

- 更新 message thread typing 的 import (#12437)

### `llama-index-core` \[0.10.27]

- 修復 pydantic query engine 輸出為空白的問題 (#12469)
- 為 Events (instrumentation) 新增 span\_id 屬性 (#12417)
- 修復 RedisDocstore 從 docs 屬性進行 node 擷取的問題 (#12324)
- 為 retriever\_tool 新增 node-postprocessors (#12415)
- FLAREInstructQueryEngine：若 query engine 支援，則委派 retriever api (#12503)
- 提高 chat message 轉換為 dict 的安全性 (#12526)
- 修復 batch eval runner 中關於 multi-kwargs 的檢查 (#12563)
- 修復 agent\_react\_multimodal\_step.py 在處理 partial args 時的 bug (#12566)

### `llama-index-embeddings-clip` \[0.1.5]

- 新增從本地檔案路徑載入 clip model 的支援 (#12577)

### `llama-index-embeddings-cloudflar-workersai` \[0.1.0]

- text embedding 整合：Cloudflare Workers AI (#12446)

### `llama-index-embeddings-voyageai` \[0.1.4]

- 修復 class 定義中的 pydantic 問題 (#12469)

### `llama-index-finetuning` \[0.1.5]

- 修復 QA generation prompt 中的微小拼字錯誤 (#12470)

### `llama-index-graph-stores-falkordb` \[0.1.3]

- 將 redis driver 替換為 FalkorDB driver (#12434)

### `llama-index-llms-anthropic` \[0.1.8]

- 新增可向 Anthropic client 傳遞自定義 HTTP headers 的功能 (#12558)

### `llama-index-llms-cohere` \[0.1.6]

- 新增對 Cohere Command R+ model 的支援 (#12581)

### `llama-index-llms-databricks` \[0.1.0]

- 與 Databricks LLM API 整合 (#12432)

### `llama-index-llms-watsonx` \[0.1.6]

- 更新 Watsonx foundation models (#12493)
- 更新 watsonx 整合中的 base model 名稱 #12491

### `lama-index-postprocessor-rankllm-rerank` \[0.1.2]

- 在 RankLLM 中新增 RankGPT 支援 (#12475)

### `llama-index-readers-microsoft-sharepoint` \[0.1.7]

- SharePoint 預設使用 recursive strategy (#12557)

### `llama-index-readers-web` \[0.1.8]

- Readability web page reader 修復 playwright async api bug (#12520)

### `llama-index-vector-stores-kdbai` \[0.1.5]

- 微小的 `to_list` 修復 (#12515)

### `llama-index-vector-stores-neptune` \[0.1.0]

- 新增對 Neptune Analytics 作為 Vector Store 的支援 (#12423)

### `llama-index-vector-stores-postgres` \[0.1.5]

- fix(postgres)：numeric metadata filters (#12583)

## \[2024-03-31]

### `llama-index-core` \[0.10.26]

- 在 QueryFusionRetriever 中傳遞正確的 query bundle (#12387)
- 更新 llama\_parse\_json\_element.py 以修復 lists 的錯誤 (#12402)
- 為 retriever tool 新增 node postprocessors (#12415)
- 修復 element node parsers 的 fallback 邏輯中未遵循使用者指定 llm 的 bug (#12403)
- 為 async callback manager events 記錄正確的 LLM response key (#12421)
- 移除兩個內建 react system prompts 的重複項，並改為從 Markdown 檔案讀取 (#12307)
- 修復 BatchEvalRunner 中 multi-evaluator eval\_kwargs\_lists 的 bug (#12418)
- 為 vector store index insert\_nodes 新增 callback manager event (#12443)
- 修復將包含 pydantic API 物件的 chat messages 序列化至 chat stores 時的問題 (#12394)
- 修復 memory.get() 操作緩慢的問題（由多次呼叫 get\_all() 引起） (#12394)
- 修復 agent+tool 訊息對被從 memory 中截斷的問題 (#12394)
- 為 object index 新增 `FnNodeMapping` (#12391)
- 將 object index 的 object mapping 設為選用/隱藏 (#12391)
- 簡化從現有 vector db 建立 object index 的流程 (#12391)
- 當 LLM 未遵循 react response 範本時，將其告知 #12300

### `llama-index-embeddings-cohere` \[0.1.5]

- 將 cohere 版本提升至 5.1.1 (#12279)

### `llama-index-embeddings-itrex` \[0.1.0]

- 新增 Intel Extension for Transformers embedding model (#12410)

### `llama-index-graph-stores-neo4j` \[0.1.4]

- 使 neo4j query 不區分大小寫 (#12337)

### `llama-index-llms-cohere` \[0.1.5]

- 將 cohere 版本提升至 5.1.1 (#12279)

### `llama-index-llms-ipex-llm` \[0.1.0]

- 新增 ipex-llm 整合 (#12322)

### `llama-index-llms-litellm` \[0.1.4]

- 修正 litellm ChatMessage role 驗證錯誤 (#12449)

### `llama-index-llms-openai` \[0.1.14]

- 在 OpenAI 中使用 `FunctionCallingLLM` 基礎類別 (#12227)

### `llama-index-packs-self-rag` \[0.1.4]

- 修正 llama-index-core 依賴 (#12374)

### `llama-index-postprocessor-cohere-rerank` \[0.1.4]

- 將 cohere 版本提升至 5.1.1 (#12279)

### `llama-index-postprocessor-rankllm-rerank` \[0.1.1]

- 新增 RankLLM rerank (#12296)
- RankLLM 修正 (#12399)

### `llama-index-readers-papers` \[0.1.4]

- 修正路徑名稱的 bug (#12366)

### `llama-index-vector-stores-analyticdb` \[0.1.1]

- 新增 AnalyticDB VectorStore (#12230)

### `llama-index-vector-stores-kdbai` \[0.1.4]

- 修正 imports/readme 中的錯字 (#12370)

### `llama-index-vector-stores-qdrant` \[0.1.5]

- 為 qdrant 新增 `in` 篩選運算子 (#12376)

## \[2024-03-27]

### `llama-index-core` \[0.10.25]

- 在 KnowledgeGraphQueryEngine 的 NodeWithScore 中新增 score (#12326)
- Batch eval runner 修正 (#12302)

### `llama-index-embeddings-cohere` \[0.1.5]

- 新增對 binary / quantized embeddings 的支援 (#12321)

### `llama-index-llms-mistralai` \[0.1.10]

- 為 MistralAI 新增對自定義 endpoint 的支援 (#12328)

### `llama-index-storage-kvstore-redis` \[0.1.3]

- 修正 RedisDocstore 從 docs 屬性進行 node 檢索的問題 (#12324)

## \[2024-03-26]

### `llama-index-core` \[0.10.24]

- 在 `LlamaDebugHandler` 中實作 pretty prints (#12216)
- 對 pandas query engine 實施更嚴格的 interpreter 限制 (#12278)
- PandasQueryEngine 現在可以執行 ‘pd.\*’ 函式 (#12240)
- 在 docstore delete 函式中刪除正確的 metadata (#12276)
- 改進 openai agent 解析函式 hook (#12062)
- 為 SimpleDirectoryReader 新增 raise\_on\_error 旗標 (#12263)
- 移除 core 中未捕捉的 openai import (#12262)
- 修正 download\_llama\_dataset 與 download\_llama\_pack (#12273)
- 實作 EvalQueryEngineTool (#11679)
- 擴展 AgentRunner 的 instrumentation Span 覆蓋範圍 (#12249)
- 新增 function calling agent/llm 概念 (目前僅支援 mistral) (#12222, )

### `llama-index-embeddings-huggingface` \[0.2.0]

- 使用 `sentence-transformers` 作為後端 (#12277)

### `llama-index-postprocessor-voyageai-rerank` \[0.1.0]

- 新增 voyageai 作為 reranker (#12111)

### `llama-index-readers-gcs` \[0.1.0]

- 新增 google cloud storage reader (#12259)

### `llama-index-readers-google` \[0.2.1]

- 支援不同的磁碟機 (#12146)
- 從 Google Drive Reader 中移除不必要的 PyDrive 依賴 (#12257)

### `llama-index-readers-readme` \[0.1.0]

- 新增 readme.com reader (#12246)

### `llama-index-packs-raft` \[0.1.3]

- 為 RAFT 新增 pack (#12275)

## \[2024-03-23]

### `llama-index-core` \[0.10.23]

- 在基礎 LLM 類別中新增 `(a)predict_and_call()` 函式 + openai + mistralai (#12188)
- 修正 async agent streaming 中 `wait()` 的 bug (#12187)

### `llama-index-embeddings-alephalpha` \[0.1.0]

- 新增 alephalpha embeddings (#12149)

### `llama-index-llms-alephalpha` \[0.1.0]

- 新增 alephalpha LLM (#12149)

### `llama-index-llms-openai` \[0.1.7]

- 修正 async agent streaming 中 `wait()` 的 bug (#12187)

### `llama-index-readers-docugami` \[0.1.4]

- 修正 docugami reader 中的 import 錯誤 (#12154)

### `llama-index-readers-file` \[0.1.12]

- 修正遠端檔案系統的 PDFReader (#12186)

## \[2024-03-21]

### `llama-index-core` \[0.10.22]

- 將文件後端從 sphinx 更新為 mkdocs，新增所有 api 參考，進行輕微重組並優化搜尋 (#11301)
- 為 `BaseReader` 類別新增 async loading (目前為偽 async) (#12156)
- 修正 `SimpleDirectoryReader` 中非本地檔案系統的路徑實作 (#12141)
- 在 instrumentation 中為 spans 新增 args/kwargs，為 retrieval events 新增 payloads (#12147)
- \[react agent] 發生 exception 時明確告知，以便 Agent 能自行修正 (#12137)

### `llama-index-embeddings-together` \[0.1.3]

- 新增 rate limit 處理 (#12127)

### `llama-index-graph-stores-neptune` \[0.1.3]

- 新增 Amazon Neptune 作為 Graph Store 的支援 (#12097)

### `llama-index-llms-vllm` \[0.1.7]

- 修正 VllmServer 使其能在不需要 CUDA 的 vllm core 環境下運作 (#12003)

### `llama-index-readers-s3` \[0.1.4]

- 在 S3Reader 中使用 S3FS (#12061)

### `llama-index-storage-docstore-postgres` \[0.1.3]

- 新增正確的 kvstore 依賴 (#12157)

### `llama-index-storage-index-store-postgres` \[0.1.3]

- 新增正確的 kvstore 依賴 (#12157)

### `llama-index-vector-stores-elasticsearch` \[0.1.6]

- 修復 es add function 中未關閉 session 的問題 #12135

### `llama-index-vector-stores-kdbai` \[0.1.3]

- 新增對 `KDBAIVectorStore` 的支援 (#11967)

## \[2024-03-20]

### `llama-index-core` \[0.10.21]

- 為 async elements StreamingAgentChatResponse 實作 Lazy init (#12116)
- 修復由 SynthesisEndEvent 引起的 streaming generators get bug (#12092)
- CLIP embedding 支援更多模型 (#12063)

### `llama-index-packs-raptor` \[0.1.3]

- 在 summary 模組中新增 `num_workers` (#)

### `llama-index-readers-telegram` \[0.1.5]

- 修復 datetime 欄位 (#12112)
- 新增選擇貼文/訊息時間範圍的功能 (#12078)

### `llama-index-embeddings-openai` \[0.1.7]

- 為 open ai embedding 新增可選的 api 版本/基礎 api (#12091)

### `llama-index-networks` \[0.2.1]

- 為 network retriever 新增 node 後處理 (#12027)
- 新增 privacy-safe networks demo (#12027)

### `llama-index-callbacks-langfuse` \[0.1.3]

- Chore: 提升 langfuse 依賴項的最低版本 (#12077)

### `llama-index-embeddings-google` \[0.1.4]

- Chore: 提升 google-generativeai 依賴項版本 (#12085)

### `llama-index-embeddings-gemini` \[0.1.5]

- Chore: 提升 google-generativeai 依賴項版本 (#12085)

### `llama-index-llms-gemini` \[0.1.6]

- Chore: 提升 google-generativeai 依賴項版本 (#12085)

### `llama-index-llms-palm` \[0.1.4]

- Chore: 提升 google-generativeai 依賴項版本 (#12085)

### `llama-index-multi-modal-llms-google` \[0.1.4]

- Chore: 提升 google-generativeai 依賴項版本 (#12085)

### `llama-index-vector-stores-google` \[0.1.5]

- Chore: 提升 google-generativeai 依賴項版本 (#12085)

### `llama-index-storage-kvstore-elasticsearch` \[0.1.0]

- 新的整合 (#12068)

### `llama-index-readers-google` \[0.1.7]

- 修復 - Google Drive 無法載入同名檔案的問題 (#12022)

### `llama-index-vector-stores-upstash` \[0.1.3]

- 為 UpstashVectorStore 新增 Metadata Filtering 支援 (#12054)

### `llama-index-packs-raptor` \[0.1.2]

- 修復：防止 RaptorPack 發生無限遞迴 (#12008)

### `llama-index-embeddings-huggingface-optimum` \[0.1.4]

- Fix(OptimumEmbedding)：移除 token\_type\_ids 以解決 ONNX 驗證問題

### `llama-index-llms-anthropic` \[0.1.7]

- 修復：Anthropic LLM 合併角色相同的連續訊息 (#12013)

### `llama-index-packs-diff-private-simple-dataset` \[0.1.0]

- DiffPrivacy ICL Pack - OpenAI Completion LLMs (#11881)

### `llama-index-cli` \[0.1.11]

- 從 command 的 download\_llama\_dataset 中移除 llama\_hub\_url 關鍵字 (#12038)

## \[2024-03-14]

### `llama-index-core` \[0.10.20]

- 新增用於 observability 的 `instrumentation` 模組 (#11831)
- 允許為 `CitationQueryEngine` 傳入 LLM (#11914)
- 更新 keyval docstore，使其除了 namespace 之外也能更改 suffix (#11873)
- 為 query\_engine 新增（部分）async streaming 支援 #11949

### `llama-index-embeddings-dashscope` \[0.1.3]

- 修復查詢文本的 embedding 類型 (#11901)

### `llama-index-embeddings-premai` \[0.1.3]

- 支援 premai embeddings (#11954)

### `llama-index-networks` \[0.2.0]

- 新增對 network retrievers 的支援 (#11800)

### `llama-index-llms-anthropic` \[0.1.6]

- 新增對 haiku 的支援 (#11916)

### `llama-index-llms-mistralai` \[0.1.6]

- 修復 ChatMessage 的 import 錯誤 (#11902)

### `llama-index-llms-openai` \[0.1.11]

- 為 AZURE\_TURBO\_MODELS 新增 gpt-35-turbo-0125 (#11956)
- 修復 logprobs 中 nontype 的錯誤 (#11967)

### `llama-index-llms-premai` \[0.1.4]

- 支援 premai llm (#11954)

### `llama-index-llms-solar` \[0.1.3]

- 支援將 solar 作為 LLM 類別 (#11710)

### `llama-index-llms-vertex` \[0.1.5]

- 在 vertex 中新增對 medlm 的支援 (#11911)

### `llama-index-readers-goolge` \[0.1.6]

- 為 google drive reader 新增 README 檔案與 query string (#11724)

### `llama-index-readers-file` \[0.1.11]

- 更新 ImageReader，新增 `plain_text` 選項以觸發 pytesseract (#11913)

### `llama-index-readers-pathway` \[0.1.3]

- 使用純 requests 以減少依賴並簡化程式碼 (#11924)

### `llama-index-retrievers-pathway` \[0.1.3]

- 使用純 requests 以減少依賴並簡化程式碼 (#11924)

### `llama-index-storage-docstore-mongodb` \[0.1.3]

- 允許更改 mongodb docstore 的 suffix (#11873)

### `llama-index-vector-stores-databricks` \[0.1.1]

- 支援將 databricks vector search 作為 vector store (#10754)

### `llama-index-vector-stores-opensearch` \[0.1.8]

- （重新）實作正確的 delete (#11959)

### `llama-index-vector-stores-postgres` \[0.1.4]

- 修復 IN filters 與 OR text search 的問題 (#11872, #11927)

## \[2024-03-12]

### `llama-index-cli` \[0.1.9]

- 移除 chroma 作為 bundled dep，以減少 `llama-index` 依賴項

### `llama-index-core` \[0.10.19]

- 在 `OpenAI` llm class 中針對 rate limits 引入重試機制 (#11867)
- 在 `SQLDatabase` 的 SQL table schemas 中加入 table comments (#11774)
- 在 `ChatResponse` 物件中加入 `LogProb` 類型 (#11795)
- 引入 `LabelledSimpleDataset` (#11805)
- 修復 insert `IndexNode` 物件時包含不可序列化物件的問題 (#11836)
- 修復在 `CondenseQuestionChatEngine` 中將 response 寫入 history 時的 stream chat 類型錯誤 (#11856)
- 改善 json query engine 的後處理 (#11862)

### `llama-index-embeddings-cohere` \[0.1.4]

- 修復 async kwarg 錯誤 (#11822)

### `llama-index-embeddings-dashscope` \[0.1.2]

- 修復 pydantic import 問題 (#11765)

### `llama-index-graph-stores-neo4j` \[0.1.3]

- 在驗證連線後正確關閉連線 (#11821)

### `llama-index-llms-cohere` \[0.1.3]

- 新增對新 `command-r` 模型的支援 (#11852)

### `llama-index-llms-huggingface` \[0.1.4]

- 修復包含 special tokens 的 streaming decoding 問題 (#11807)

### `llama-index-llms-mistralai` \[0.1.5]

- 新增對最新模型與 open models 的支援 (#11792)

### `llama-index-tools-finance` \[0.1.1]

- 修復傳入 API 獲取 stock news 時的小 bug (#11772)

### `llama-index-vector-stores-chroma` \[0.1.6]

- 精簡 chroma 依賴項 (#11775)

### `llama-index-vector-stores-lancedb` \[0.1.3]

- 修復刪除相關問題 (#11825)

### `llama-index-vector-stores-postgres` \[0.1.3]

- 支援巢狀 metadata filters (#11778)

## \[2024-03-07]

### `llama-index-callbacks-deepeval` \[0.1.3]

- 更新 callback handler 的 import 路徑 (#11754)

### `llama-index-core` \[0.10.18]

- 確保 `LoadAndSearchToolSpec` 載入 document 物件 (#11733)
- 修復 `QueryFusionRetriever` 中缺少 nodes 的 bug (#11759)
- 允許在 `BatchEvalRunner` 中為不同的 evaluators 使用不同的 runtime kwargs (#11727)
- 修復 fsspec + `SimpleDirectoryReader` 的問題 (#11665)
- 從 guideline evaluator 中移除 `asyncio.run()` 必要條件 (#11719)

### `llama-index-embeddings-voyageai` \[0.1.3]

- 更新 voyage embeddings 以使用正確的 clients (#11721)

### `llama-index-indices-managed-vectara` \[0.1.3]

- 修復 vectara query engine 在非 summary 模式下的問題 (#11668)

### `llama-index-llms-mymagic` \[0.1.5]

- 為 json 輸出加入包含 query 與 response 的 `return_output` 選項 (#11761)

### `llama-index-packs-code-hierarchy` \[0.1.0]

- 新增對 `CodeHiearchyAgentPack` 的支援，允許以 agent 方式遍歷 codebase (#10671)

### `llama-index-packs-cohere-citation-chat` \[0.1.3]

- 新增一個用於 citations + 與 cohere 聊天的新 llama-pack (#11697)

### `llama-index-vector-stores-milvus` \[0.1.6]

- 防止在 document add 時強制執行 `flush()` (#11734)

### `llama-index-vector-stores-opensearch` \[0.1.7]

- 修復 metadata 欄位名稱的小錯字 (#11751)

### `llama-index-vector-stores-tidbvector` \[0.1.0]

- 初步支援 TiDB vector store (#11635)

### `llama-index-vector-stores-weaviate` \[0.1.4]

- 修復 metadata filters 中 `int` 欄位的小問題 (#11742)

## \[2024-03-06]

新格式！將嘗試按套件報告變更。

### `llama-index-cli` \[0.1.8]

- 更新 `upgrade` 指令的 mappings (#11699)

### `llama-index-core` \[0.10.17]

- 將 `relative_score` 與 `dist_based_score` 加入 `QueryFusionRetriever` (#11667)
- 在 async agent queue 中檢查 `none` (#11669)
- 允許 `BaseSQLTableQueryEngine` 使用 refine template (#11378)
- 更新 llama-packs 的 mappings (#11699)
- 修復 KG index 中提取 rel texts 的 index error (#11695)
- 當沒有 nodes 時，synthesizer 回傳正確的 response 類型 (#11701)
- 在 DocumentSummaryIndex 中將 metadata 繼承至 summaries (#11671)
- 在 sql query engines 中繼承 callback manager (#11662)
- 修復 agent streaming 未寫入 chat history 的 bug (#11675)
- 修復使用 agent streaming function call 時 `none` deltas 的小 bug (#11713)

### `llama-index-multi-modal-llms-anthropic` \[0.1.2]

- 新增對新多模態模型 `haiku` 與 `sonnet` 的支援 (#11656)

### `llama-index-packs-finchat` \[0.1.0]

- 新增一個用於 hierarchical agents + 金融聊天的 llama-pack (#11387)

### `llama-index-readers-file` \[0.1.8]

- 新增檢查 NLTK 檔案是否已下載的支援 (#11676)

### `llama-index-readers-json` \[0.1.4]

- 使用建立 documents 時傳入的 metadata (#11626)

### `llama-index-vector-stores-astra-db` \[0.1.4]

- 更新警告訊息的文字 (#11702)

### `llama-index-vector-stores-opensearch` \[0.1.7]

- 避免在程式碼中呼叫 `nest_asyncio.apply()`，以防止使用者遇到令人困惑的錯誤 (#11707)

### `llama-index-vector-stores-qdrant` \[0.1.4]

- 捕捉 RPC 錯誤 (#11657)

## \[0.10.16] - 2024-03-05

### New Features

- Anthropic 支援新模型 (#11623, #11612)
- 簡化 chat prompts 的建立流程 (#11583)
- 新增 raptor retriever llama-pack (#11527)
- 透過 bedrock 改善批次 cohere embeddings (#11572)
- 新增對 vertex AI embeddings 的支援 (#11561)

### Bug Fixes / Nits

- 確保非同步 embeddings 生成的順序 (#11562)
- 修復 csv reader 的 metadata 為空的問題 (#11563)
- 修復 composable retrievers 的可序列化問題 (#11617)
- 修復 milvus metadata filter 的支援 (#11566)
- 修復 clickhouse vector store 中的 pydantic import (#11631)
- 修復 gemini/vertext-gemini 的 system prompts (#11511)

## \[0.10.15] - 2024-03-01

### New Features

- 新增 FeishuWikiReader (#11491)
- 新增 videodb retriever 整合 (#11463)
- 為 opensearch vector store 新增非同步支援 (#11513)
- 新增 LangFuse 一鍵 callback handler (#11324)

### Bug Fixes / Nits

- 修復非同步 chat streaming 的 deadlock 問題 (#11548)
- 改善 SimpleDirectoryReader 中的隱藏檔案檢查 (#11496)
- 修復使用 SimpleDirectoryReader 時 document metadata 出現 null 值 (#11501)
- 修復 jsonalyze query engine 中的 sqlite utils (#11519)
- 為 ollama multimodal LLM 新增 base url 與 timeout (#11526)
- 更新 query fusion retriever 的重複處理機制 (#11542)
- 修復 kg indexx struct 更新的 bug (#11475)

## \[0.10.14] - 2024-02-28

### New Features

- 發佈 llama-index-networks (#11413)
- Jina reranker (#11291)
- 新增 DuckDuckGo agent 搜尋工具 (#11386)
- 為 chatml 提供 helper functions (#10272)
- 為 agents 新增 brave 搜尋工具 (#11468)
- 新增 Friendli LLM 整合 (#11384)
- 為 chromadb 新增僅限 metadata 的查詢 (#11328)

### Bug Fixes / Nits

- 修復 synthesizers 中繼承 llm callback 的問題 (#11404)
- 捕捉 milvus 中的刪除錯誤 (#11315)
- 修復 pinecone kwargs 問題 (#11422)
- 修復 Supabase metadata filtering (#11428)
- 修復 gemini embeddings 中的 api base (#11393)
- 修復 elasticsearch vector store 的 await (#11438)
- 修復 vllm server cuda 問題 (#11442)
- 修復將 LLM 傳遞至 context chat engine 的問題 (#11444)
- 設定 cohere embeddings 的輸入類型 (#11288)
- 設定 azure ad token 的預設值 (#10377)
- 為 react agent 重新加入 prompt mixin (#10610)
- 修復 gemini 的 system roles (#11481)
- 修復 mean agg pooling 回傳 numpy float 值的问题 (#11458)
- 改善 JSONQueryEngine 的 json 路徑解析 (#9097)

## \[0.10.13] - 2024-02-26

### 新增功能

- 為 KodaRetriever 新增 llama-pack，用於即時 alpha tuning (#11311)
- 新增對 `mistral-large` 的支援 (#11398)
- 為 SFR-Embedding-Mistral 等 huggingface embeddings 模型新增 last token pooling 模式 (#11373)
- 為 SimpleDirectoryReader 新增 fsspec 支援 (#11303)

### Bug Fixes / Nits

- 修復 context window 與 prompt helper 的問題 (#11379)
- 將 OpenSearch vector store 移至 BasePydanticVectorStore (#11400)
- 修復 fireworks LLM 的 function calling (#11363)
- 使 cohere embedding 類型更加自動化 (#11288)
- 改善 react agent 的 function calling (#11280)
- 修復 MockLLM imports (#11376)

## \[0.10.12] - 2024-02-22

### 新增功能

- 新增 `llama-index-postprocessor-colbert-rerank` 套件 (#11057)
- `MyMagicAI` LLM (#11263)
- `MariaTalk` LLM (#10925)
- 為 github reader 新增重試機制 (#10980)
- 新增 FireworksAI embedding 與 LLM 模組 (#10959)

### Bug Fixes / Nits

- 修復 weaviate 中的字串格式化 (#11294)
- 修復 semantic splitter 中的 off-by-one 錯誤 (#11295)- 修復多個檔案的 `download_llama_pack` (#11272)
- 從套件中移除 `BUILD` 檔案 (#11267)
- 放寬所有套件的 python 版本要求 (#11267)
- 修復 chromadb 的 args 問題 (#11104)

## \[0.10.11] - 2024-02-21

### Bug Fixes / Nits

- 修復 async acomplete 的多模態 LLM (#11064)
- 修復 llamaindex-cli import 問題 (#11068)

## \[0.10.10] - 2024-02-20

我對發佈流程還不太熟悉，深感抱歉。這次僅是提升版本號，以確保 0.10.9 原本應有的變更確實已發佈。(AF)

## \[0.10.9] - 2024-02-20

- 新增 llama-index-cli 依賴

## \[0.10.7] - 2024-02-19

### 新增功能

- 新增 Self-Discover llamapack (#10951)

### Bug Fixes / Nits

- 修復 CICD 中的 linting (#10945)
- 修復使用遠端 graph stores 的問題 (#10971)
- 在 NoText response synthesizer 中新增缺失的 LLM kwarg (#10971)
- 修復 rankgpt 中的 openai import (#10971)
- 修復 openai embeddings 中將 model name 解析為字串的問題 (#10971)
- 修復 sentence window node parser 的 off-by-one 錯誤 (#10971)

## \[0.10.6] - 2024-02-17

首先，對於前幾個版本遺漏了變更日誌深表歉意。目前正嘗試在 400 多個套件中找出最佳的處理流程。

未來每個套件將擁有專屬的變更日誌。

但目前請參考此「主」變更日誌。

### 新增功能

- 新增 `NomicHFEmbedding` (#10762)
- 新增 `MinioReader` (#10744)

### Bug Fixes / Nits

- 修復 clickhouse vector store 的多項問題 (#10799)
- 修復 neo4j vector store 的 index 名稱 (#10749)
- 修復 sagemaker embeddings (#10778)
- 修復分割 nodes 時的效能問題 (#10766)
- 修復 reranker + b25 中的非浮點數值問題 (#10930)
- OpenAI-agent 應為 openai 程式的依賴 (#10930)
- 為 query pipeline 元件新增缺失的 shortcut imports (#10930)
- 修復 NLTK 與 tiktoken 未能正確與 core 綑綁的問題 (#10930)
- 恢復 `llama_index.core.__version__` (#10930)

## \[0.10.3] - 2024-02-13

### Bug Fixes / Nits

- 修復將 LLM 傳遞至 `as_chat_engine` 的問題 (#10605)
- 修復 anthropic 的 system prompt 格式 (#10603)
- 修復 `__version__` 上 elasticsearch vector store 的錯誤 (#10656)
- 修復 openai pydantic 程式的 import (#10657)
- 將 client 恢復至 opensearch vector store 的 exports 中 (#10660)
- 修復 SimpleDirectoryReader 未正確使用 file loaders 的 bug (#10655)
- 為 RankGPT 新增 lazy LLM 初始化 (#10648)
- 修復 bedrock embedding `from_credentials` 傳遞 model name 的問題 (#10640)
- 恢復 TelegramReader 的近期變更 (#10625)

## \[0.10.0, 0.10.1] - 2024-02-12

### Breaking Changes

- 引入了多項變更。完整詳情請參閱 [完整部落格文章](https://blog.llamaindex.ai/llamaindex-v0-10-838e735948f8)。

## \[0.9.48] - 2024-02-12

### Bug Fixes / Nits

- 為 BedrockEmbdding 恢復已棄用的 API (#10581)

## \[0.9.47] - 2024-02-11

v0.10 前的最後一次補丁！

### 新增功能

- 為 query pipeline 新增條件連結 (#10520)
- 重構條件連結並新增至 cookbook (#10544)
- agent 與 query pipeline 清理 (#10563)

### Bug Fixes / Nits

- 新增 sleep 以修復 chat stream 的延遲 (#10339)
- OllamaMultiModal kwargs (#10541)
- 更新 Ingestion Pipeline 以處理空的 documents (#10543)
- 修復微小的拼字錯誤 (#10516)
- 修復 elasticsearch 的 async 檢查 (#10549)
- 文件/更新 slack demo colab (#10534)
- 為 PGVectorStore 新增使用 IN 運算子的可能性 (#10547)
- 修復 agent 重設問題 (#10562)
- 修復多個文件導致的 MD 重複 Node id (#10564)

## \[0.9.46] - 2024-02-08

### 新增功能

- 更新 embedding 模型的 pooling 策略 (#10536)
- 新增 Multimodal Video RAG 範例 (#10530)
- 新增 SECURITY.md (#10531)
- 將 agent 模組指南上移一級 (#10519)

### Bug Fixes / Nits

- Deeplake 修復 (#10529)
- 為 llamaindex 新增 Cohere 區段 (#10523)
- 修復 md element (#10510)

## \[0.9.45.post1] - 2024-02-07

### New Features- 將 deeplake 向量資料庫升級為使用 BasePydanticVectorStore (#10504)

### Bug Fixes / Nits

- 修復 MD parser 在處理不一致表格時的問題 (#10488)
- 修復 MetadataExtractionSEC.ipynb 中 pypdf 的 ImportError (#10491)

## \[0.9.45] - 2024-02-07

### 新增功能

- 重構：新增 AgentRunner.from\_llm 方法 (#10452)
- 支援非聊天 LLMS 的自定義 prompt 格式化 (#10466)
- 將 cryptography 從 41.0.7 提升至 42.0.0 (#10467)
- 為 Colbert Index 新增 persist 與 load 方法 (#10477)
- 允許自定義 agent 接收使用者輸入 (#10450)

### Bug Fixes / Nits

- 從 arize-phoenix 全域 callback handler 中移除 exporter (#10465)
- 修復 Dashscope qwen llm 的 bug (#10471)
- 修復：呼叫 AWS Bedrock 模型 (#10443)
- 將 Azure AI Search (原 Azure Cognitive Search) 向量資料庫整合更新至最新穩定版 client SDK 11.4.0，並更新 jupyter notebook 範例 (#10416)
- 修復部分 import 問題 (#10485)

## \[0.9.44] - 2024-02-05

### 新增功能

- ollama vision cookbook (#10438)
- 支援 Gemini 「transport」配置 (#10457)
- 新增 Upstash Vector (#10451)

## \[0.9.43] - 2024-02-03

### 新增功能

- 新增多模態 ollama (#10434)

### Bug Fixes / Nits

- 更新 astradb 的基底類別 (#10435)

## \[0.9.42.post1] - 2024-02-02

### 新增功能

- 為 Base nodes parser 新增 Async 支援 (#10418)

## \[0.9.42] - 2024-02-02

### 新增功能

- 新增對 `gpt-3.5-turbo-0125` 的支援 (#10412)
- 在 rag cli 中新增 `create-llama` 支援 (#10405)

### Bug Fixes / Nits

- 修復 lance-db 向量資料庫中的微小 bug (#10404)
- 修復 ollama 的 streaming bug (#10407)

## \[0.9.41] - 2024-02-01

### 新增功能

- Nomic Embedding (#10388)
- Dashvector 支援 sparse vector (#10386)
- 使用 MarkDownParser 進行 Table QA 及基準測試 (#10382)
- 簡單的網頁讀取器 (#10395)

### Bug Fixes / Nits

- 修復 KeywordExtractor 中的完整 node 內容 (#10398)

## \[0.9.40] - 2024-01-30

### 新增功能

- 改進並修復 MarkdownElementNodeParser 的 bug (#10340)
- 修復並改進對新模型的 Perplexity 支援 (#10319)
- 確保 system\_prompt 會傳遞給 Perplexity LLM (#10326)
- 擴展 BaseRetrievalEvaluator 以包含選用的 PostProcessor (#10321)

## \[0.9.39] - 2024-01-26

### 新增功能

- 支援新的 GPT Turbo 模型 (#10291)
- Sentence Transformer 微調支援多份文件 (#10297)

### Bug Fixes / Nits

- 修復 Marvin 的 import 問題 (#9864)

## \[0.9.38] - 2024-01-25

### 新增功能

- 支援新的 OpenAI v3 embedding 模型 (#10279)

### Bug Fixes / Nits

- 針對 qdrant 的 sparse embeddings 增加額外檢查 (#10275)

## \[0.9.37] - 2024-01-24

### 新增功能

- 新增 RAG CLI 工具 (#10193)
- 新增 textai 向量資料庫 (#10240)
- 新增基於 Postgresql 的 docstore 與 index store (#10233)
- 在 tool specs 中指定 tool spec (#10263)

### Bug Fixes / Nits

- 修復 ollama chat 的序列化錯誤 (#10230)
- 為 `SentenceTransformerRerank` 補上缺失的欄位 (#10225)
- 修復標題提取問題 (#10209, #10226)
- nit：讓 chainable output parser 在函式庫/文件中更易於被發現 (#10262)
- :bug: summary index 未能繼承排除的 metadata keys (#10259)

## \[0.9.36] - 2024-01-23

### 新增功能

- 新增對 `SageMakerEmbedding` 的支援 (#10207)

### Bug Fixes / Nits

- 修復 openai assistant 中重複的 `file_id` (#10223)
- 修復 programs 的循環依賴問題 (#10222)
- 在來自相同父級 document 的 nodes 群組上執行 `TitleExtractor` (#10209)
- 改進 vectara 自動檢索 (#10195)

## \[0.9.35] - 2024-01-22

### 新增功能

- 將 `beautifulsoup4` 依賴移至新的選用額外套件 `html` (#10156)
- 將 `BaseNode.hash` 設為 `@property` (#10163)
- Neutrino (#10150)
- feat: JSONalyze Query Engine (#10067)
- \[wip] 新增自定義 hybrid retriever notebook (#10164)
- 為 ChromaVectorStore 類別新增 from\_collection 方法 (#10167)
- CLI 實驗 v0: ask (#10168)- 讓 react agent prompts 更容易編輯 (#10154)
- 新增 agent query pipeline (#10180)

### Bug Fixes / Nits

- 更新 supabase vecs metadata filter 函式以支援多個欄位 (#10133)
- LanceDB 整合的 Bug 修復與程式碼優化 (#10144)
- `beautifulsoup4` 選用相依項目 (#10156)
- 修復 qdrant aquery hybrid search (#10159)
- 將 hash 改為 @property (#10163)
- 修復：poetry 安裝 llama-index\[postgres] 的 bug (#10171)
- \[doc] 更新 jaguar vector store 文件 (#10179)
- 移除對尚未發佈的 finish\_message 之使用 (#10188)
- 更新 Lantern vector stores 文件 (#10192)
- 修復 multi\_document\_agents.ipynb 中的錯字 (#10196)

## \[0.9.34] - 2024-01-19

### 新增功能

- 新增 SageMakerEndpointLLM (#10140)
- 新增對 Qdrant filters 的支援 (#10136)

### Bug Fixes / Nits

- 為 Claude 2:1 更新 bedrock utils (#10139)
- BugFix：修復使用 multiprocessing 時的 deadlock 問題 (#10125)

## \[0.9.33] - 2024-01-17

### 新增功能

- 新增 RankGPT 作為 postprocessor (#10054)
- 確保與新版 Pinecone client 版本分叉的向下相容性 (#9995)
- Recursive retriever all the things (#10019)

### Bug Fixes / Nits

- BugFix：修復在包含逗號的表格上使用 markdown element parser 的問題 (#9926)
- 擴充 auto-retrieval notebook (#10065)
- 更新 llm\_generators 中的 Attribute 名稱 (#10070)
- jaguar vector store 在 add() 的 add\_kwargs 中新增 text\_tag (#10057)

## \[0.9.32] - 2024-01-16

### 新增功能

- 新增 query-time row retrieval 並修復 structured data query pipeline 的細節問題 (#10061)
- ReActive Agents w/ Context 並更新失效連結 (#10058)

## \[0.9.31] - 2024-01-15

### 新增功能

- 在 query pipeline 中新增 selectors 與 routers (#9979)
- 在 qdrant vector store 中新增 sparse-only search (#10041)
- 新增 Tonic evaluators (#10000)
- 為 firestore docstore 新增 async 支援 (#9983)
- 實作 mongodb docstore `put_all` 方法 (#10014)

### Bug Fixes / Nits

- 根據 `max_string_length` 正確截斷 sql 結果 (#10015)
- 修復 base64 字串的 `node.resolve_image()` (#10026)
- 修復 cohere system prompt role (#10020)
- 移除 SentenceSplitter 中冗餘的 token 計算操作 (#10053)

## \[0.9.30] - 2024-01-11

### 新增功能

- 實作使用 embeddings 進行 Semantic Splitting 的 Node Parser (#9988)
- 新增 Anyscale Embedding 模型支援 (#9470)

### Bug Fixes / Nits

- nit：修復 pandas get prompt (#10001)
- Fix：Token 計算 bug (#9912)
- 將 jinja2 從 3.1.2 提升至 3.1.3 (#9997)
- 修復 qdrant hybrid search 的邊緣案例 (#9993)
- Bugfix：sphinx 生成錯誤 (#9944)
- Fix：`CodeSplitter` 中的 `language` 在賦值前被使用 (#9987)
- 修復「Use a Text Splitter…」章節中不一致的名稱 “text\_parser” (#9980)
- :bug: 修復 batch size (#9982)
- 為 query pipelines 新增 auto-async 執行 (#9967)
- :bug: 修復 init (#9977)
- 使用 SimpleDirectoryReader 進行 Parallel Loading (#9965)
- 在 milvus 中不要強制刪除 index (#9974)

## \[0.9.29] - 2024-01-10

### 新增功能

- 新增對 together.ai 模型的支援 (#9962)
- 新增對 batch redis/firestore kvstores 以及 async firestore kvstore 的支援 (#9827)
- 將 `IngestionPipeline.run()` 平行化 (#9920)
- 新增 query pipeline 元件：function, argpack, kwargpack (#9952)

### Bug Fixes / Nits

- 更新選用的 langchain import 以避免警告 (#9964)
- 若對空的 nodes 進行 embedding 則拋出錯誤 (#9953)

## \[0.9.28] - 2024-01-09

### 新增功能

- 新增對 Nvidia TenorRT LLM 的支援 (#9842)
- 允許在 agent 建構期間設定 `tool_choice` (#9924)
- 為 `QueryPipeline` 新增 streaming 支援 (#9919)

### Bug Fixes / Nits

- 為 llama-index readers 設定一致的 doc-ids (#9923, #9916)
- 移除 HuggingFaceEmbedding 不需要模型輸入 (#9922)
- 將 `tool_choice` 旗標傳遞至下游 API (#9901)
- 在 chat memory `from_defaults()` 中新增 `chat_store_key` (#9928)

## \[0.9.27] - 2024-01-08

### 新增功能

- 新增 query pipeline (#9908)- 功能：Azure Multi Modal (修正：#9471) (#9843)
- 新增 postgres docker (#9906)
- Vectara auto\_retriever (#9865)
- Redis Chat Store 支援 (#9880)
- 將更多類別移至 core (#9871)

### Bug Fixes / Nits / Smaller Features

- 將 `tool_choice` 旗標傳遞至下游 API (#9901)
- 從 faiss 查詢中過濾掉負數索引 (#9907)
- 為 qdrant payloads 新增 NE filter (#9897)
- 修正 MyScale 查詢結果中錯誤的 id 分配 (#9900)
- Qdrant Text Match Filter (#9895)
- 混合搜尋的 Fusion top k (#9894)
- 修正 (#9867) sync\_to\_async 以避免在非同步呼叫期間發生阻塞 (#9869)
- 傳入 compute\_scores 的單一 node 將以 float 回傳 (#9866)
- 移除多餘的 linting 步驟 (#9878)
- 新增 vectara 連結 (#9886)

## \[0.9.26] - 2024-01-05

### 新增功能

- 為專用聊天記憶體儲存新增 `BaseChatStore` 與 `SimpleChatStore` 抽象層 (#9863)
- 允許將自定義 `tree_sitter` parser 傳遞至 `CodeSplitter` (#9845)
- 建立 `BaseAutoRetriever` 基礎類別，讓其他 retriever 可擴展至自動模式 (#9846)
- 新增對 Nvidia Triton LLM 的支援 (#9488)
- 新增 `DeepEval` 一鍵可觀測性 (#9801)

### Bug Fixes / Nits

- 更新 guidance 整合以相容最新版本 (#9830)
- 將 doctores/ingestion pipeline 的文字儲存設為選用 (#9847)
- 為文件新增缺失的 `sphinx-automodapi` 依賴 (#9852)
- 在 weaviate 查詢結果中回傳實際的 node ids (#9854)
- 為 LangChainLLM 新增 prompt 格式化 (#9844)

## \[0.9.25] - 2024-01-03

### 新增功能

- 為資料集生成新增並行限制 (#9779)
- 新的 `deepeval` 一鍵可觀測性處理常式 (#9801)
- 新增 jaguar 向量儲存 (#9754)
- 新增 beta 多模態 ReAct agent (#9807)

### Bug Fixes / Nits

- 將 OpenAI embeddings 的預設 batch size 更改為 100 (#9805)
- 在 qdrant upserts 中正確使用 batch size (#9814)
- `_verify_source_safety` 使用 AST 而非正規表達式來進行正確的安全檢查 (#9789)
- 在 element node parsers 中使用提供的 LLM (#9776)
- 更新舊版 vectordb 載入函式以提高穩定性 (#9773)
- 在 AzureOpenAI 中使用提供的 http client (#9772)

## \[0.9.24] - 2023-12-30

### 新增功能

- 為 BEIR 評估新增 reranker (#9743)
- 新增 Pathway 整合 (#9719)
- 自定義 agents 實作 + notebook (#9746)

### Bug Fixes / Nits

- 修正 vllm 的 beam search：新增缺失的參數 (#9741)
- 修正混合搜尋的 alpha (#9742)
- 修正 token 計算器 (#9744)
- BM25 tokenizer 轉為小寫 (#9745)

## \[0.9.23] - 2023-12-28

### Bug Fixes / Nits

- 文件：修正 qdrant\_hybrid.ipynb 的錯字 (#9729)
- 使 llm completion 程式更通用 (#9731)
- 重構空集合的 MM Vector store 與 Index (#9717)
- 新增 IF 敘述以檢查使用「Select」的 Schema (#9712)
- 允許在 `download_module` 與 `download_llama_pack` 中跳過模組載入 (#9734)

## \[0.9.22] - 2023-12-26

### 新增功能

- 為 `SimpleDirectoryReader` 新增 `.iter_data()` 方法 (#9658)
- 為 `Ollama` LLM 新增非同步支援 (#9689)
- 擴展 `in` 與 `not in` 的 pinecone filter 支援 (#9683)

### Bug Fixes / Nits

- 提升 BM25Retriever 效能 (#9675)
- 改善 qdrant 混合搜尋的錯誤處理 (#9707)
- 修正 `ChromaVectorStore` 中的 `None` 處理 (#9697)
- 修正 postgres schema 不存在時的建立問題 (#9712)

## \[0.9.21] - 2023-12-23

### 新增功能

- 新增 zilliz cloud 作為託管索引 (#9605)

### Bug Fixes / Nits

- Bedrock client 與 LLM 修正 (#9671, #9646)

## \[0.9.20] - 2023-12-21

### 新增功能

- 新增 `insert_batch_size` 以限制建立索引時保留在記憶體中的 embedding 數量，預設為 2048 (#9630)
- 改善自動檢索 (#9647)
- 可配置的 Node ID 生成函式 (#9574)
- 引入 action input parser (#9575)
- qdrant 稀疏向量支援 (#9644)- 在 ingestion pipeline 中引入 upserts 與 delete (#9643)
- 新增 Zilliz Cloud Pipeline 作為 Managed Index (#9605)
- 透過 VertexAI 新增對 Google Gemini 模型的支援 (#9624)
- 支援在 autoretriever 上允許額外的 metadata filters (#9662)

### Bug Fixes / Nits

- 修正 LM Format Enforcer notebooks 中的 pip install 指令 (#9648)
- 修正更多連結與文件 (#9633)
- 一些 bedrock 的細節修正與修復 (#9646)

## \[0.9.19] - 2023-12-20

### 新增功能

- 新的 llama datasets `LabelledEvaluatorDataset` 與 `LabelledPairwiseEvaluatorDataset` (#9531)

## \[0.9.18] - 2023-12-20

### 新增功能

- 多文件 auto-retrieval 指南 (#9631)

### Bug Fixes / Nits

- fix(vllm): 使 Vllm 的 ‘complete’ 方法行為與其他 LLM 類別一致 (#9634)
- 修正 Doc 連結及其他文件問題 (#9632)

## \[0.9.17] - 2023-12-19

### 新增功能

- \[example] 新增使用者回饋 (#9601)
- FEATURE: 為 Retrieval Eval 新增 Cohere ReRank Relevancy Metric (#9495)

### Bug Fixes / Nits

- 修正 Gemini Chat Mode (#9599)
- 修正 `types-protobuf` 作為 primary dependency 的問題 (#9595)
- 為 TextEmbeddingInference 類別新增選用的 auth token (#9606)
- fix: 修正 get latest tool call 的 index 越界問題 (#9608)
- fix(azure\_openai.py): 在 subclass override 中新增缺失的 return (#9598)
- 修正 ollama api call 中 ‘formatted’ 與 ‘format’ 參數混淆的問題 (#9594)

## \[0.9.16] - 2023-12-18

### 新增功能

- agent 重構：step-wise execution (#9584)
- 新增 OpenRouter 及 Mixtral demo (#9464)
- 為 neo4j vector store 新增 hybrid search (#9530)
- 為 Google Semantic Retriever 新增對 auth service accounts 的支援 (#9545)

### Bug Fixes / Nits

- 修正 `LLM.system_prompt` 缺失的 `default=None` (#9504)
- 修正 #9580：正確整合 metadata (#9582)
- Integrations: Gradient\[Embeddings,LLM] - sdk-upgrade (#9528)
- 將 mixtral 8x7b 模型新增至 anyscale 可用模型清單 (#9573)
- Gemini 模型檢查 (#9563)
- 使用最新變更更新 OpenAI fine-tuning (#9564)
- fix/為 PgVectorStore 的 Sparse Query 重新引入 `WHERE` filter (#9529)
- 將 Ollama API 更新至 ollama v0.1.16 (#9558)
- ollama: 移除無效的 `formatted` 選項 (#9555)
- 在 optimum push 中新增 device #9541 (#9554)
- Gemini Embedding 的標題與內容差異 (#9547)
- 將 pydantic 欄位修正為 float (#9542)

## \[0.9.15] - 2023-12-13

### 新增功能

- 全面支援 Google Gemini text+vision 模型 (#9452)
- 新增 Google Semantic Retriever (#9440)
- 為 OpenAI assistants 新增 `from_existing()` 方法與 async 支援 (#9367)

### Bug Fixes / Nits

- 修正 huggingface LLM system prompt 與 messages to prompt (#9463)
- 修正 ollama additional kwargs 的使用方式 (#9455)

## \[0.9.14] - 2023-12-11

### 新增功能

- 新增 MistralAI LLM (#9444)
- 新增 MistralAI Embeddings (#9441)
- 新增 `Ollama` Embedding 類別 (#9341)
- 新增用於 reranking 的 `FlagEmbeddingReranker` (#9285)
- feat: PgVectorStore 支援進階 metadata filtering (#9377)
- 為 SQL query engines 新增 `sql_only` 參數以避免執行 SQL (#9422)

### Bug Fixes / Nits

- Feat/PgVector 支援自定義 hnsw\.ef\_search 與 ivfflat.probes (#9420)
- 修正 F1 score 定義，更新版權年份 (#9424)
- 將 Replicate Multi-modal 模型輸入多張圖片的錯誤改為警告 (#9360)
- 移除 GPT-Licensed `aiostream` 依賴 (#9403)
- 修正 BedrockEmbedding 使用 Cohere 模型時的結果 (#9396)
- 在 react agent 中僅擷取有效的 tool names (#9412)
- 修正 azure cosmos 中 `top_k` 被乘以 10 的問題 (#9438)
- 修正 OpenSearch 的 hybrid search (#9430)

### Breaking Changes

- 更新 base `LLM` 介面以符合 `LLMPredictor` (#9388)
- 棄用 `LLMPredictor` (#9388)

## \[0.9.13] - 2023-12-06

### 新增功能

- 為 `LabelledRagDataset` 新增 batch prediction 支援 (#9332)

### Bug Fixes / Nits

- 修正 faiss vector store 的儲存與載入功能 (#9330)

## \[0.9.12] - 2023-12-05

### 新增功能

- 在 openai/azure 中新增 `reuse_client` 選項以協助處理 async timeout。設定為 `False` 可獲得改善 (#9301)
- 新增對 `vLLM` llm 的支援 (#9257)
- 新增對 python 3.12 的支援 (#9304)
- 支援 `claude-2.1` 模型名稱 (#9275)

### Bug Fixes / Nits

- 修正 bedrock cohere embeddings 的 embedding 格式 (#9265)
- 在 weaviate vector store 中使用 `delete_kwargs` 進行 filtering (#9300)
- 修正自動 qdrant client 建構問題 (#9267)

## \[0.9.11] - 2023-12-03

### 新增功能

- 將 `reference_contexts` 在 `LabelledRagDataset` 中設為選填 (#9266)
- 重新整理 `download` 模組 (#9253)
- 在 ingestion pipeline 中新增 document 管理 (#9135)
- 新增 `LabelledRagDataset` 的文件 (#9228)
- 為 `LabelledRagDataset` 新增 submission template notebook 及其他文件更新 (#9273)

### Bug Fixes / Nits

- 為 `InstructorEmbedding` 將 numpy 轉換為 list (#9255)

## \[0.9.10] - 2023-11-30

### 新增功能

- 為 vector stores 提供進階 Metadata filter (#9216)
- Amazon Bedrock Embeddings 新模型 (#9222)
- 新增 PromptLayer callback 整合 (#9190)
- 為 `OpenAIAssistant` 重用 file ids (#9125)

### Breaking Changes / Deprecations

- 棄用 ExactMatchFilter (#9216)

## \[0.9.9] - 2023-11-29

### 新增功能

- 為 `LlamaDataset` 新增抽象層 (#9165)
- 為 `AstraDBVectorStore` 新增 metadata filtering 與 MMR 模式支援 (#9193)
- 允許使用最新版本的 `scikit-learn` (#9213)

### Breaking Changes / Deprecations

- 新增 `LocalAI` demo 並開始棄用週期 (#9151)
- 棄用 `evaluation` 模組中的 `QueryResponseDataset` 與 `DatasetGenerator` (#9165)

### Bug Fixes / Nits

- 修正 `download_utils.py` 指向錯誤 repo 的 bug (#9215)
- 在 `AzureOpenAILLM` 中使用 `azure_deployment` kwarg (#9174)
- 修正 `AstraDBVectorStore` Integration 的 similarity score 回傳值 (#9193)

## \[0.9.8] - 2023-11-26

### 新增功能

- 為支援的 `ObjectIndex` 新增 `persist` 與 `persist_from_dir` 方法 (#9064)
- 新增 async metadata extraction 與 pipeline 支援 (#9121)
- 在 nodes 中恢復對 start/end char idx 的支援 (#9143)

### Bug Fixes / Nits

- 修正 global service context 中部分 kwargs 未正確設定的問題 (#9137)
- 修正 `memory.get()` 在 system/prefix 訊息較大時的小問題 (#9149)
- global service context 的微幅修正 (#9137)

## \[0.9.7] - 2023-11-24

### 新增功能

- 新增對 `PGVectoRsStore` 的支援 (#9087)
- 出於安全性考量強制執行 `requests>=2.31`，同時取消 `urllib3` 的版本固定 (#9108)

### Bug Fixes / Nits

- 提高 context chat engine 的預設 memory token 限制 (#9123)
- 為 `CondensePlusContextChatEngine` 新增 system prompt，該 prompt 會被前置於 `context_prompt` (#9123)
- 修正 `CondensePlusContextChatEngine` 未正確使用 chat history 的 bug (#9129)

## \[0.9.6] - 2023-11-22

### 新增功能

- 為 openai LLMs 新增 `default_headers` 參數 (#9090)
- 新增對 `download_llama_pack()` 與 LlamaPack 的整合支援
- 新增對 `llamaindex-cli` 命令列工具的支援

### Bug Fixed / Nits

- 將 huggingface embedding 的 normalize 儲存為 bool (#9089)

## \[0.9.5] - 2023-11-21

### Bug Fixes / Nits

- 修正 AzureOpenAI 推論 stream chunk 是否為 tool call 的邏輯 bug (#9018)

### 新增功能

- `FastEmbed` embeddings provider (#9043)
- 更精確地測試 `OpenAILike` (#9026)
- 為每個 retriever 新增 callback manager (#8871)
- 可使用 `OpenAILike` 繞過 `max_tokens` 推論 (#9032)

### Bug Fixes / Nits

- 修正估算 chunk 大小時格式化 chat prompt templates 的 bug (#9025)
- 將 Pandas 執行沙箱化，修復 CVE-2023-39662 (#8890)
- 為 Python 3.8 恢復 `mypy` (#9031)
- 放寬 `dataclasses-json` 版本範圍，並移除 `pandas` 中不必要的 `jinja2` extra (#9042)

## \[0.9.4] - 2023-11-19

### New Features- 新增 `CondensePlusContextChatEngine` (#8949)

### 小型功能 / Bug 修復 / 微調

- 修復 `OpenAIAgent` 將錯誤插入對話紀錄的 bug (#9000)
- 修復 LiteLLM 與新 OpenAI client 的多項 bug (#9003)
- 為 perplexity llm 新增 context window 屬性 (#9012)
- 將 `node_parser` 屬性加回 service context (#9013)
- 重構 MM retriever 類別 (#8998)
- 修復 SupabaseVectorIndexDemo 中的 TextNode 實例化問題 (#8994)

## \[0.9.3] - 2023-11-17

### 新功能

- 新增 perplexity LLM 整合 (#8734)

### Bug 修復 / 微調

- 修復新 openai client 的 token 計算問題 (#8981)
- 修復 postgres vector db 中的小型 pydantic bug (#8962)
- 修復 `HierarchicalNodeParser` 中的 `chunk_overlap` 與 `doc_id` bug (#8983)

## \[0.9.2] - 2023-11-16

### 新功能

- 新增 Multi-Modal Rag Evaluation 的 notebook 指南 (#8945)
- 新增 `MultiModalRelevancyEvaluator` 與 `MultiModalFaithfulnessEvaluator` (#8945)

## \[0.9.1] - 2023-11-15

### 新功能

- 新增 Cohere Reranker 微調 (#8859)
- `AzureOpenAI` LLM 支援自定義 httpx client (#8920)

### Bug 修復 / 微調

- 修復 `set_global_service_context` 未傳遞 settings 的問題 (#8940)
- 修復使用 Google Palm embeddings 建立索引的問題 (#8936)
- 修復解析不含文字的 ImageDocuments/Nodes 時的小問題 (#8938)
- 修復 Astra DB 大量資料插入的問題 (#8937)
- 為 agents 優化 `QueryEngineTool` (#8933)

## \[0.9.0] - 2023-11-15

### 新功能 /重大變更 / 棄用

- 引入新 `IngestionPipeline` 概念用於資料導入與轉換
- 資料導入與轉換現在會自動快取
- 更新 node 解析/文字分割/元資料提取模組的介面
- 變更預設 tokenizer 以及 tokenizer 的自定義方式
- PyPi 封裝/安裝變更（減少冗餘、新增安裝選項）
- import 路徑更可預測且一致
- Beta 版：新增用於處理文字與影像的 MultiModal RAG 模組！
- 更多詳細資訊請參閱：`https://medium.com/@llama_index/719f03282945`

## \[0.8.69.post1] - 2023-11-13

### Bug 修復 / 微調

- 將 weaivate 最大刪除數量增加至 10,000 (#8887)
- 修復最後的 pickling 殘留問題 (#8902)

## \[0.8.69] - 2023-11-13

### Bug 修復 / 微調

- 修復載入 pickled 物件的 bug (#8880)
- 修復 `download_loader` 中的 `custom_path` 與 `custom_dir` 問題 (#8865)

## \[0.8.68] - 2023-11-11

### 新功能

- openai assistant agent + 進階檢索 cookbook (#8863)
- 新增檢索 API 基準測試 (#8850)
- 新增 JinaEmbedding 類別 (#8704)

### Bug 修復 / 微調

- 改進 OpenAI 的預設 timeout/retry 設定 (#8819)
- 為 OpenAI 加回金鑰驗證 (#8819)
- 停用自動下載 LLM/Embedding 模型，並提供詳細錯誤訊息 (#8819)
- 修復 openai assistant 工具建立 + 檢索 notebook (#8862)
- 快速修復 Replicate MultiModal 範例 (#8861)
- 修復：路徑被視為隱藏檔的問題 (#8860)
- 修復 Replicate multi-modal LLM + notebook (#8854)
- 功能/引用元資料 (#8722)
- 將 SimpleMultiModalQueryEngine 的 ImageNode 類型從 NodeWithScore 修復 (#8844)

## \[0.8.67] - 2023-11-10

### 新功能

- 進階 Multi Modal 檢索範例與文件 (#8822, #8823)

### Bug 修復 / 微調

- 修復 `CitationQueryEngine` 的 retriever node postprocessors (#8818)
- 修復大多數情境下的 `cannot pickle 'builtins.CoreBPE' object` (#8835)

## \[0.8.66] - 2023-11-09

### 新功能

- `OpenAIPydanticProgram` 中的新 OpenAI client 支援平行 function calling (#8793)

### Bug 修復 / 微調

- 修復使用新 OpenAI client 時 pydantic 程式的 bug (#8793)
- 修復無法列舉 fsspec 物件的 bug (#8795)

## \[0.8.65] - 2023-11-08

### 新功能

- `OpenAIAgent` 平行 function calling (#8738)

### 新功能

- 正確支援 Hugging Face 推薦模型 (#8784)

### Bug 修復 / 微調

- 修復 `embeddings.__all__` 缺失的 import (#8779)

### 重大變更 / 棄用- 在 `OpenAI(LLM)` 中，使用 `tool_choice` 取代 `function_call`，以及使用 `tool` 取代 `functions` (#8738)
- 將 `to_openai_function` 棄用，改用 `to_openai_tool` (#8738)

## \[0.8.64] - 2023-11-06

### 新增功能

- `OpenAIAgent` 平行 function calling (#8738)
- 新增 AI assistant agent (#8735)
- OpenAI GPT4v 抽象層 (#8719)
- 新增對 `Lantern` VectorStore 的支援 (#8714)

### Bug Fixes / Nits

- 修復 elastic search 向量資料庫回傳零個 nodes 的問題 (#8746)
- 為 `SimpleDirectoryReader` 迴圈新增 try/except，以避免因單一 document 而崩潰 (#8744)
- 修復 async embeddings 中的 `deployment_name` (#8748)

## \[0.8.63] - 2023-11-05

### 新增功能

- 為最新的 `openai` client 套件新增原生 sync 與 async client 支援 (#8712)
- 新增對 `AzureOpenAIEmbedding` 的支援 (#8712)

### Bug Fixes / Nits

- 修復使用 `download_loader` 時出現 “no host supplied” 的錯誤 (#8723)

### Breaking Changes

- `OpenAIEmbedding` 不再支援 azure，已移至 `AzureOpenAIEmbedding` 類別 (#8712)

## \[0.8.62.post1] - 2023-11-05

### Breaking Changes

- 新增 devday 模型 (#8713)
- 將 `SimpleMongoReader` 的 `max_docs` 參數從建構子移至 `lazy_load_data()` (#8686)

## \[0.8.61] - 2023-11-05

### 新增功能

- \[experimental] Hyperparameter tuner (#8687)

### Bug Fixes / Nits

- 修復 CohereAIModelName 類別中的拼字錯誤：cohere light 模型缺少 v3 (#8684)
- 更新 deeplake.py (#8683)

## \[0.8.60] - 2023-11-04

### 新增功能

- prompt 優化指南 (#8659)
- VoyageEmbedding (#8634)
- `YoutubeTranscriptReader` 的多國語言支援 (#8673)
- emotion prompt 指南 (#8674)

### Bug Fixes / Nits

- 在可用的 anyscale 模型中新增 mistral 7b instruct v0.1 (#8652)
- 將 pgvector 的設定（extension、schema 與資料表建立）設為選用 (#8656)
- 允許為 Pinecone 向量資料庫初始化 stores\_text 變數 (#8633)
- fix: azure ad 支援 (#8667)
- 修復多執行緒環境中的 nltk bug (#8668)
- 修復 cohereai notebook 中的 google colab 連結 (#8677)
- 將 max\_tokens 傳遞至 `Cohere` llm (#8672)

## \[0.8.59] - 2023-11-02

- Deepmemory 支援 (#8625)
- 新增 CohereAI embeddings (#8650)
- 新增 Azure AD (Microsoft Entra ID) 支援 (#8667)

## \[0.8.58] - 2023-11-02

### 新增功能

- 新增 `lm-format-enforcer` 整合以實現結構化輸出 (#8601)
- Google Vertex 支援 (#8626)

## \[0.8.57] - 2023-10-31

### 新增功能

- 新增 `VoyageAIEmbedding` 整合 (#8634)
- 新增 fine-tuning 評估器 notebook (#8596)
- 新增 `SingleStoreDB` 整合 (#7991)
- 新增對 ChromaDB PersistentClient 的支援 (#8582)
- 新增 DataStax Astra DB 支援 (#8609)

### Bug Fixes / Nits

- 更新 Weaviate 中的 dataType (#8608)
- 在使用 hybrid retriever\_mode 的 Knowledge Graph Index 中：
  - 當「找不到關係 (No Relationship found)」時，回傳由關鍵字搜尋找到的 nodes
- 修復 chat engines 中超過 context 長度的錯誤 (#8530)
- 從 KG 檢索所有三元組的實際內容 (#8579)
- 在 `KnowledgeGraphIndex` 的 hybrid retriever\_mode 中，當 embeddings 找不到關係時，回傳由關鍵字找到的 nodes (#8575)
- 優化 retriever 工具內容並修復微小 bug (#8588)

## \[0.8.56] - 2023-10-30

### 新增功能

- 新增 Amazon `BedrockEmbedding` (#8550)
- 將 `HuggingFaceEmbedding` 移至 `Pooling` enum 中心以進行 pooling (#8467)
- 新增 IBM WatsonX LLM 支援 (#8587)

### Bug Fixes / Nits

- \[Bug] 修補 Clarifai 類別 (#8529)
- 修復 bedrock llm 的重試機制 (#8528)
- Fix : VectorStore 的 QueryResult 總是將儲存的 Node 回傳為 TextNode (#8521)
- 為 SimpleDirectoryReader 新增預設 file\_metadata，以獲取許多 postprocessor 使用的基本元資料 (#8486)
- 處理 chromadb 中具有 None 值的元資料 (#8584)

## \[0.8.55] - 2023-10-29

### 新增功能

- 允許 prompt 透過 `function_mappings` 接收 function (#8548)
- 新增進階 prompt 以及「RAG 的 prompt engineering」notebook (#8555)- 利用 Replicate API 提供 LLaVa modal 服務 (#8539)

### Bug Fixes / Nits

- 更新 pull request 範本以包含 google colab 支援 (#8525)

## \[0.8.54] - 2023-10-28

### 新增功能

- 新增 notebook 示範如何在結構化輸出上 fine-tune llama2 (#8540)

  - 新增 GradientAIFineTuningHandler
  - 在 ServiceContext 中新增 pydantic\_program\_mode

- 使用 LlamaIndex 初始化 MultiModal Retrieval (#8507)

### Bug Fixes / Nits

- 在 `ChatEngine` 使用模式 `.md` 文件中新增缺失的 import (#8518)
- :bug: 修復 async add (#8531)
- fix: 在 usage\_pa… 中新增必要的 CondenseQuestionChatEngine import (#8518)
- 為 LongLLMLingua.ipynb 新增 import LongLLMLinguaPostprocessor (#8519)

## \[0.8.53] - 2023-10-27

### 新增功能

- 文件重構 (#8500) 全面調整文件組織。主要變更如下：

  - 新增大型的「understanding」章節
  - 新增大型的「optimizing」章節
  - 重構 Getting Started 內容
  - 將模組指南分類並移至單一章節

## \[0.8.52] - 2023-10-26

### 新增功能

- 新增 longllmlingua (#8485)
- 為 notebooks 新增 google colab 支援 (#7560)

### Bug Fixes / Nits

- 調整 Cassandra VectorStore 建構子透過 cassio.init 進行 DB 連線 (#8255)
- 允許在 managed index 中設定 service context 與 storage context (#8487)

## \[0.8.51.post1] - 2023-10-25

### 新增功能

- 為 Tesla 10k RAG 新增 Llava MultiModal QA 範例 (#8271)
- 修復 react chat agent streaming 未如預期運作的 bug (#8459)

### Bug Fixes / Nits

- patch: 為 router query engines 的 response metadata 新增 selected result 並修復 bug (#8483)
- 新增 Jina AI embeddings notebook 並修復 huggingface embedding (#8478)
- 在 replicate 中新增 `is_chat_model` (#8469)
- 將 `toml-sort` 恢復至 `pre-commit` (#8267)
- 為 local `test_s3_kvstore` 新增 `LocationConstraint` (#8263)

## \[0.8.50] - 2023-10-24

### 新增功能

- 在不同模組（query engines、synthesizers 等）中公開 prompts (#8275)

## \[0.8.49] - 2023-10-23

### 新增功能

- 新增 LLM 整合

  - 透過 `huggingface_hub[inference]` 支援 Hugging Face Inference API 的 `conversational`、`text_generation` 與 `feature_extraction` endpoints (#8098)
  - 新增 Amazon Bedrock LLMs (#8223)
  - 新增 AI21 Labs LLMs (#8233)
  - 為相容於 OpenAI 的 api 伺服器新增 OpenAILike LLM 類別 (#7973)

- 新增 / 更新向量資料庫整合

  - 新增 DashVector (#7772)
  - 新增 Tencent VectorDB (#8173)
  - 在 PGVectorStore 中新增自定義 Postgres schema 選項，不再僅限於 public schema (#8080)

- 新增 Gradient fine tuning engine (#8208)

- docs(FAQ)：新增常見問題 (#8249)

### Bug Fixes / Nits

- 修復與 `ReActAgent.stream_chat` 的不一致之處 (#8147)
- 將 GuardrailsOutputParser 的部分函式標記為棄用 (#8016)
- 簡化相依項目 (#8236)
- LiteLLM 的 bug 修復 (#7885)
- 更新 Predibase LLM (#8211)

## \[0.8.48] - 2023-10-20

### 新增功能

- 為 MyScale 向量資料庫新增 `DELETE` (#8159)
- 新增 SQL Retriever (#8197)
- 新增 semantic kernel document 格式 (#8226)
- 改進 MyScale Hybrid Search 並為 MyScale 向量資料庫新增 `DELETE` (#8159)

### Bug Fixes / Nits

- 修復 ReActAgent.from\_tools() 中的額外 kwargs (#8206)
- 修復 prompt templates 中缺失的空格 (#8190)
- 在發生 exception 時移除 llama2-13B 的自動下載 (#8225)

## \[0.8.47] - 2023-10-19

### 新增功能

- 為 text-to-SQL 新增 response synthesis (#8196)
- 新增對 `LLMRailsEmbedding` 的支援 (#8169)
- 使用 PyTorch 推斷 MPS device (#8195)
- 統一 query/text prepending 處理 (#8189)

## \[0.8.46] - 2023-10-18

### 新增功能

- 新增 fine-tuning router 支援與 embedding selector (#8174)
- 新增更多 document 轉換器 (#8156)

### Bug Fixes / Nits

- 為 huggingface embeddings 新增 normalization (#8145)
- 改進 MyScale Hybrid Search (#8159)
- 修復 prompt 中重複出現 `FORMAT_STR` 的問題 (#8171)- 新增：PandasQueryEngine 支援 output\_kwargs={‘max\_colwidth’: xx} (#8110)
- 修正 cohere llm 參數描述中的微小錯誤 (#8163)
- 修正 Firestore client 資訊 (#8166)

## \[0.8.45] - 2023-10-13

### 新增功能

- 新增對 fine-tuning cross encoders 的支援 (#7705)
- 新增 `QueryFusionRetriever` 用於合併多個 retrievers 與 query augmentation (#8100)
- 將 `nb-clean` 新增至 `pre-commit` 以減少 PR diffs (#8108)
- 支援 `TextEmbeddingInference` embeddings (#8122)

### Bug Fixes / Nits

- 改進 `BM25Retriever` 介面以接收 `BaseNode` 物件 (#8096)
- 修正 `BM25Retriever` tokenizer 未能如預期運作的 bug (#8096)
- 使 Python 3.8 通過 mypy 檢查 (#8107)
- `ReActAgent` 補上缺失的 `super().__init__` 呼叫 (#8125)

## \[0.8.44] - 2023-10-12

### 新增功能

- 新增 pgvector sql query engine (#8087)
- 新增 HoneyHive 一鍵式 observability (#7944)
- 新增對 SQLAlchemy V1 與 V2 的支援 (#8060)

## \[0.8.43.post1] - 2023-10-11

### 新增功能

- 將 `codespell` 移至 `pre-commit` (#8040)
- 新增 `prettier` 以支援 `.py` 以外的 autoformatting 擴充功能 (#8072)

### Bug Fixes / Nits

- 修正 `HuggingFaceLLM` 中遺漏的 f-str (#8075)
- 放寬 numpy/panadas 的版本要求

## \[0.8.43] - 2023-10-10

### 新增功能

- 新增對 `GradientEmbedding` embed models 的支援 (#8050)

### Bug Fixes / Nits

- 為 `HuggingFaceLLM` 新增 `messages_to_prompt` kwarg (#8054)
- 改進開源模型的 selection 與 sql 解析 (#8054)
- 修正 agents 為 tool 產生過多 kwargs 時的 bug (#8054)
- 改進 selection+question generation 的 prompts 與 debugging (#8056)

## \[0.8.42] - 2023-10-10

### 新增功能

- `LocalAI` 使模組層級的變數名稱更直觀 (#8028)
- 為 markdown 文件啟用 `codespell` (#7972)
- 新增 unstructured table element node 解析器 (#8036)
- 新增：Qdrant vector store 的 Async upserting (#7968)
- 新增 cohere llm (#8023)

### Bug Fixes / Nits

- 解析 react agent 回答中的多行輸出 (#8029)
- 在 keyword `as_retriever` 呼叫中加入正確命名的 kwargs (#8011)
- 更新 RAGAS LlamaIndex Integration 的參考資料 (#8035)
- Vectara bugfix (#8032)
- 修正：ChromaVectorStore 可能嘗試新增超過 chromadb batch 限制的內容 (#8019)
- 修正 Mbox reader 的 get\_content 方法 (#8012)
- 在 WeaviateVectorStore 中套用 kwarg filters (#8017)
- 避免 ZeroDivisionError (#8027)
- `LocalAI` 使模組層級的變數名稱更直觀 (#8028)
- zep/fix: imports & typing (#8030)
- refactor: 使用 `str.join` (#8020)
- 為 node 解析使用正確的 metadata 字串 (#7987)

## \[0.8.41] - 2023-10-07

### 新增功能

- You.com retriever (#8024)
- 使用 `metadata_names` 參數將 mongodb 的欄位提取至 metadata (#8001)
- 簡化 `LocalAI.__init__` 並保持相同行為 (#7982)

### Bug Fixes / Nits

- 對於 metadata aware text splitting 使用最長的 metadata 字串 (#7987)
- 在 mongodb reader 中處理字串列表 (#8002)
- 移除 `OpenAI.class_type` 因為它是死碼 (#7983)
- 修正 `HuggingFaceLLM.device_map` 的 type hint (#7989)

## \[0.8.40] - 2023-10-05

### 新增功能

- 新增對 `Clarifai` LLM 的支援 (#7967)
- 新增對 function fine-tuning 的支援 (#7971)

### Breaking Changes

- 更新 document summary index (#7815)

  - 將預設 retrieval mode 更改為 embedding
  - 索引時預設將 summaries 嵌入 vector store (而非即時計算 embedding)
  - 支援在 llm retriever 中配置 top k

## \[0.8.39] - 2023-10-03

### 新增功能

- 新增 query engines 支援 pydantic 物件輸出 (#7893)
- 新增 `ClarifaiEmbedding` 類別以支援 embedding (#7940)
- Markdown node 解析器、flat file reader 與 simple file node 解析器 (#7863)
- 新增對 mongdb atlas `$vectorSearch` 的支援 (#7866)

### Bug Fixes / Nits- 在 discord reader 中新增對使用 message metadata 的支援 (#7906)
- 修復在沒有 `max_tokens` 時 `LocalAI` 的 chat 能力 (#7942)
- 新增用於自動檢查的 `codespell` (#7941)
- `ruff` 現代化與自動修復 (#7889)
- 實作自定義的 SQLDatabase 類別 (#7929)
- 更新 LlamaCPP 的 context\_params 屬性 (#7945)
- 修復重複的 embedding (#7949)
- 新增 `codespell` 工具以強制執行正確拼字 (#7941)
- 支援透過 `venv` 進行 `mypy` 本地使用 (#7952)
- Vectara - 微小更新 (#7954)
- 避免在 CI 中重複安裝 `pydantic` (#7956)
- 將 tree\_sitter\_languages 移至 data\_requirements.txt (#7955)
- 在 `PGVectorStore` 中新增 `cache_okay` 參數以協助抑制 TSVector 警告 (#7950)

## \[0.8.38] - 2023-10-02

### 新增功能

- 更新 `KeywordNodePostprocessor` 以使用 spacy 來支援更多語言 (#7894)
- `LocalAI` 支援全域或單次查詢的 `/chat/completions` 與 `/completions` (#7921)
- 新增關於使用 REBEL + Wikipedia 篩選來建立知識圖譜的 notebook (#7919)
- 新增對 `ElasticsearchEmbedding` 的支援 (#7914)

## \[0.8.37] - 2023-09-30

### 新增功能

- 支援 `LocalAI` LLMs (#7913)
- 新增驗證機制以防止 chunk size 配置錯誤 (#7917)

### Bug Fixes / Nits

- 簡化 NL SQL 回應至 SQL 的解析，並擴充 NL SQL prompt (#7868)
- 提升 vectordb 整合的向量儲存檢索速度 (#7876)
- 新增對 {{ 和 }} 的替換，並修復 JSON 解析遞迴 (#7888)
- 優化 JSON 解碼錯誤訊息 (#7891)
- 優化 LLM 未提供 SQL 時的 SQL 錯誤訊息 (#7900)
- 優化 `HuggingFaceLLM` 的 `ImportError` (#7904)
- eval 修復：修復 dataset 回應生成，為 evaluators 新增分數 (#7915)

## \[0.8.36] - 2023-09-27

### 新增功能

- 新增「從零開始建構 RAG notebook」- OSS/local (#7864)

### Bug Fixes / Nits

- 修復 elasticsearch 混合評分 (#7852)
- 將 `get_color_mapping` 與 `print_text` 的 Langchain 依賴替換為內部實作 (#7845)
- 修復 azure 的 async streaming (#7856)
- 避免在子問題生成器中使用 `NotImplementedError()` (#7855)
- 修補 predibase 初始化 (#7859)
- 提高 langchain 最低版本並更改來自 langchain 的 prompt 匯入 (#7862)

## \[0.8.35] - 2023-09-27

### Bug Fixes / Nits

- 修復遞迴 retriever 中丟失 textnodes 的問題 (#7840)
- 當 callback\_manager 為 None 時，在 agent 及其 llm 之間共用 callback\_manager (#7844)
- 修復 pandas query engine (#7847)

## \[0.8.34] - 2023-09-26

### 新增功能

- 新增 `Konko` LLM 支援 (#7775)
- 新增前後文句子 (#7821)
- 透過 OpenAI 函式庫將 EverlyAI 與 LlamaIndex 整合 (#7820)
- 在全域處理程序中新增 Arize Phoenix tracer (#7835)

### Bug Fixes / Nits

- 正規化 ElasticSearch 向量儲存回傳的分數 (#7792)
- 修復 `refresh_ref_docs()` 的運算順序 bug (#7664)
- 將 `PGVectorStore` 的 postgresql 連線延遲至實際需要時才執行 (#7793)
- 修復 `SimpleVectorStore` delete 方法中與 metadata filters 相關的 KeyError (#7829)
- 修復 `SimpleVectorStore` delete 方法中與 metadata filters 相關的 KeyError (#7831)
- 解決 PyYAML 匯入錯誤 (#7784)
- ElasticsearchStore：更新 User-Agent 並新增 example docker compose (#7832)
- `StorageContext.persist` 支援 `Path` (#7783)
- 更新 ollama.py (#7839)
- 修復 self.\_session\_pool 的 bug (#7834)

## \[0.8.33] - 2023-09-25

### 新增功能

- 新增 pairwise evaluator 與 benchmark 自動合併 retriever (#7810)

### Bug Fixes / Nits

- embedding 類別的微小清理 (#7813)
- `OpenAIEmbedding` 的雜項更新 (#7811)

## \[0.8.32] - 2023-09-24

### 新增功能

- 新增對 `HuggingFaceEmbedding`、`InstructorEmbedding` 與 `OptimumEmbedding` 的原生支援 (#7795)
- 為 MyScale 向量儲存新增 metadata 篩選與混合搜尋 (#7780)- 允許為 Milvus 設定自定義文字欄位名稱 (#7790)
- 為 `VectorIndexAutoRetriever` 新增對 `vector_store_query_mode` 的支援 (#7797)

### Bug Fixes / Nits

- 更新 `LanceDBVectorStore` 以處理 score 與 distance (#7754)
- 在 `CondenseQuestionChatEngine` 中將 LLM 傳遞至 `memory_cls` (#7785)

## \[0.8.31] - 2023-09-22

### 新增功能

- 新增 pydantic metadata 提取器 (#7778)
- 允許使用者在 azure cognitive vector store 中設定 embedding 維度 (#7734)
- 新增 semantic similarity 評估器 (#7770)

### Bug Fixes / Nits

- 📝docs: 更新 Chatbot 教學與 Notebook (#7767)
- 修復 nodes 為空時的 response synthesizers 問題 (#7773)
- 修復 auto vector retriever 中的 `NotImplementedError` (#7764)
- 修復 “KnowledgeGraphQueryEngine” 中多個 kwargs 值的 bug (#7763)
- 允許設定 azure cognitive search 維度 (#7734)
- 為 dataset generator 將 service context 傳遞至 index (#7748)
- 修復 selector templates 的 output parsers (#7774)
- 更新 Chatbot\_SEC.ipynb (#7711)
- 針對 cassandra 測試進行 linter/typechecker 友善的改進 (#7771)
- 開放 `PgVectorStore` 的 debug 選項 (#7776)
- llms/openai: 透過考慮 `prompt_filter_results` 欄位來修復 Azure OpenAI (#7755)

## \[0.8.30] - 2023-09-21

### 新增功能

- 新增對 `gpt-3.5-turbo-instruct` 的支援 (#7729)
- 新增對 `TimescaleVectorStore` 的支援 (#7727)
- 新增 `LongContextReorder` 以解決 lost-in-the-middle 問題 (#7719)
- 新增 retrieval 評估 (#7738)

### Bug Fixes / Nits

- 為 async context chat engine 新增 node post-processors (#7731)
- 為 postgres tsv 欄位新增唯一的 index 名稱 (#7741)

## \[0.8.29.post1] - 2023-09-18

### Bug Fixes / Nits

- 修復 embeddings 的 langchain import 錯誤 (#7714)

## \[0.8.29] - 2023-09-18

### 新增功能

- 為基礎 simple vector store 新增 metadata 過濾 (#7564)
- 新增 low-level router 指南 (#7708)
- 新增 CustomQueryEngine 類別 (#7703)

### Bug Fixes / Nits

- 修復 lite-llm 中的 context window metadata (#7696)

## \[0.8.28] - 2023-09-16

### 新增功能

- 新增 CorrectnessEvaluator (#7661)
- 新增對 `Ollama` LLMs 的支援 (#7635)
- 新增 `HWPReader` (#7672)
- 簡化 portkey LLM 介面 (#7669)
- 為 `ElasticsearchStore` vector store 新增 async 操作支援 (#7613)
- 新增對 `LiteLLM` 的支援 (#7600)
- 新增 batch evaluation runner (#7692)

### Bug Fixes / Nits

- 避免在 async langchain embeddings 中使用 `NotImplementedError` (#7668)
- 提高 LLM selectors 的可靠性 (#7678)
- 修復 output parsers 與 completion models 的 `query_wrapper_prompt` 及 `system_prompt` (#7678)
- 修復 citation query engine 中的 node 屬性繼承 (#7675)

### Breaking Changes

- 重構並更新 `BaseEvaluator` 介面以保持一致性 (#7661)

  - 對於通用輸入使用 `evaluate` 函式
  - 對於來自 llama index query engine 的 `Response` 物件使用 `evaluate_response` 函式

- 更新現有評估器的命名使其更明確

  - `ResponseEvaluator` -> `FaithfulnessEvaluator`
  - `QueryResponseEvaluator` -> `RelevancyEvaluator`
  - 舊名稱保留為類別別名以維持向下相容性

## \[0.8.27] - 2023-09-14

### 新增功能

- 新增 low-level 教學章節 (#7673)

### Bug Fixes / Nits

- 預設 delta 應為 dict (#7665)
- 改進 LLMPredictor 上的 query wrapper 邏輯 (#7667)

## \[0.8.26] - 2023-09-12

### 新增功能

- 新增 non-linear embedding adapter (#7658)
- 在 knowledge fine-tuning notebook 中新增 “finetune + RAG” 評估 (#7643)

### Bug Fixes / Nits

- 修復 sentence splitter 的 chunk-overlap (#7590)

## \[0.8.25] - 2023-09-12

### 新增功能

- 新增 `AGENT_STEP` callback 事件類型 (#7652)

### Bug Fixes / Nits

- 允許 `simple` 模式與 `as_chat_engine()` 協作 (#7637)
- 修復 azure streaming 中的 index 錯誤 (#7646)
- 從 llama-cpp 中移除 `pdb` (#7651)

## \[0.8.24] - 2023-09-11

## 新增功能

- 指南：透過 fine-tuning 記憶知識 (#7626)
- 新增為 eval 模組自定義 prompt template 的能力 (#7626)

### Bug Fixes

- 正確偵測 `llama-cpp-python` 版本以載入預設的 GGML 或 GGUF `llama2-chat-13b` 模型 (#7616)
- 在 `RetrieverQueryEngine.from_args()` 中正確傳遞 `summary_template` (#7621)
- 修正 wandb callback 中的 span 類型 (#7631)

## \[0.8.23] - 2023-09-09

### Bug Fixes

- 確保 llama2 的首次對話 prompt 中包含 context 與 system prompt (#7597)
- 避免 refine 過程中出現 negative chunk size 錯誤 (#7607)
- 修正 hierarchical node parser 中小型 documents 的關係 (#7611)
- 更新 Anyscale Endpoints 整合，支援完整 streaming 與 async (#7602)
- 在 `OpenAI`、`AzureOpenAI` 與 `Anyscale` 中，更好地支援將憑證作為 LLM 建構子參數傳遞 (#7602)

### Breaking Changes

- 更新 milvus vector store 以支援 filters 與動態 schemas (#7286)
  - 使用方式請參閱 [更新後的 notebook](https://docs.llamaindex.ai/en/stable/examples/vector_stores/MilvusIndexDemo.html)
- 將 NLTK 加入核心依賴項以支援預設的 sentence splitter (#7606)

## \[0.8.22] - 2023-09-07

### 新增功能

- 新增對 ElasticSearch Vector Store 的支援 (#7543)

### Bug Fixes / Nits

- 修正 `ElasticSearchReader` 中的小型 `_index` bug (#7570)
- 修正全域 service contexts 中 prompt helper settings 的 bug (#7576)
- 再次移除 openai embeddings 中的換行符號 (#7588)
- 修正在 service context 中設定 `query_wrapper_prompt` 的小型 bug (#7585)

### Breaking/Deprecated API Changes

- 清理 vector store 介面，使用 `BaseNode` 取代 `NodeWithEmbedding`

  - 對大多數使用者而言，此變更不影響操作
  - 對於直接操作 `VectorStore` 抽象層並手動建構 `NodeWithEmbedding` 物件的使用者，這是一個輕微的 breaking change。請直接使用設定了 `embedding` 的 `TextNode`，而非 `NodeWithEmbedding`。

## \[0.8.21] - 2023-09-06

### 新增功能

- 新增 embedding adapter fine-tuning 引擎與指南 (#7565)
- 新增對 Azure Cognitive Search vector store 的支援 (#7469)
- 支援 supabase 的刪除操作 (#6951)
- 新增對 Espilla vector store 的支援 (#7539)
- 新增對 AnyScale LLM 的支援 (#7497)

### Bug Fixes / Nits

- 在 `VectorIndexAutoRetriever` 中將 top-k 預設為使用者可配置 (#7556)
- 捕捉 structured responses 的驗證錯誤 (#7523)
- 修正 streaming refine 模板 (#7561)

## \[0.8.20] - 2023-09-04

### 新增功能

- 新增 Portkey LLM 整合 (#7508)
- 支援 postgres/pgvector 混合搜尋 (#7501)
- 更新 recursive retriever node 參考 notebook (#7537)

## \[0.8.19] - 2023-09-03

### 新增功能

- 將 list index 替換為 summary index (#7478)
- 將 list index 重新命名為 summary index (第二部分) (#7531)

## \[0.8.18] - 2023-09-03

### 新增功能

- 新增 agent finetuning 指南 (#7526)

## \[0.8.17] - 2023-09-02

### 新增功能

- 使 (部分) loaders 可序列化 (#7498)
- 在 recursive retrieval 中新增 node 參考 (#7522)

### Bug Fixes / Nits

- 在 splitting 過程中若 metadata 過大，則拋出具資訊性的錯誤 (#7513)
- 在簡單的 node parser 中允許使用 langchain splitter (#7517)

## \[0.8.16] - 2023-09-01

### Bug Fixes / Nits

- 修正文件中的 Marvin notebook 連結 (#7504)
- 確保 `SimpleWebPageReader` 中的 metadata 不是 `None` (#7499)
- 修正 KGIndex 視覺化 (#7493)
- 改進 KG Index 的空回應處理 (#7493)

## \[0.8.15] - 2023-08-31

### 新增功能

- 新增對 `MarvinEntityExtractor` metadata extractor 的支援 (#7438)
- 為 SimpleWebPageReader 新增 url\_metadata callback (#7445)
- 擴展 callback logging 事件 (#7472)

### Bug Fixes / Nits

- 在 OpenAI 中，僅針對 text 001 embedding 模型將換行符號轉換為空格 (#7484)
- 修正非 nebula index 的 `KnowledgeGraphRagRetriever` (#7488)
- 在 `PGVectorStore` 中支援定義 embedding 維度 (#7491)
- 大幅提升基礎 vector store 的相似度計算速度 (#7494)

## \[0.8.14] - 2023-08-30

### 新增功能

- feat: Graph RAG 支援非 kg 的異質圖 (#7459)
- rag 指南 (#7480)

### Bug Fixes / Nits- 改善 openai fine-tuned 模型解析 (#7474)
- 進行部分程式碼去重複化 (#7468)
- 在 HF LLMs 中讓 query\_wrapper\_prompt 同時支援 str 與 templates (#7473)

## \[0.8.13] - 2023-08-29

### 新增功能

- 新增 embedding finetuning (#7452)
- 新增對 RunGPT LLM 的支援 (#7401)
- 提供與 DeepEval 的整合指南與 notebook (#7425)
- 新增 `VectorIndex` 與 `VectaraRetriever` 作為 managed index (#7440)
- 新增對 `to_tool_list` 的支援，以偵測並使用 async functions (#7282)

## \[0.8.12] - 2023-08-28

### 新增功能

- 新增 openai finetuning 類別 (#7442)
- Service Context 支援轉換至/自 dict (#7395)
- 新增 finetuning 指南 (#7429)

### Smaller Features / Nits / Bug Fixes

- 新增如何執行 FalkorDB docker 的範例 (#7441)
- 更新 root.md 以使用 get\_response\_synthesizer 的預期型別 (#7437)
- 修復 MonsterAPI Pydantic v2/v1 支援問題並更新文件 (#7432)

## \[0.8.11.post3] - 2023-08-27

### 新增功能

- AutoMergingRetriever (#7420)

## \[0.8.10.post1] - 2023-08-25

### 新增功能

- 新增對使用 MonsterAPI 之 `MonsterLLM` 的支援 (#7343)
- NebulaGraphStore 支援 comments 欄位與 int 型別 VID (#7402)
- 為 DynamoDB 新增可配置的 endpoint (#6777)
- 為 Refine response synthesizer 新增結構化答案篩選 (#7317)

### Bug Fixes / Nits

- 為 json 檔案讀取器使用 `utf-8` (#7390)
- 修復 entity extractor 初始化問題 (#7407)

## \[0.8.9] - 2023-08-24

### 新增功能

- 新增對 FalkorDB/RedisGraph graph store 的支援 (#7346)
- 新增 directed sub-graph RAG (#7378)
- 新增對 `BM25Retriever` 的支援 (#7342)

### Bug Fixes / Nits

- 將 `max_tokens` 新增至 `Xinference` LLM (#7372)
- 支援在多執行緒應用程式中建立 cache dir (#7365)
- 確保 openai 的 temperature 為 float (#7382)
- 移除知識圖譜 retriever 中的重複主體 (#7378)
- 同時支援 pydantic v1 與 v2，以利其他應用程式推進 (#7394)

### Breaking/Deprecated API Changes

- 重構 prompt template (#7319)

  - 使用 `BasePromptTemplate` 進行通用型別定義
  - 使用 `PromptTemplate`, `ChatPromptTemplate`, `SelectorPromptTemplate` 作為核心實作
  - 使用 `LangchainPromptTemplate` 以相容 Langchain prompt templates
  - 在程式碼庫中將特定的 prompt 類別（例如 `SummaryPrompt`）完全替換為通用的 `BasePromptTemplate` 型別。
  - 保留 `Prompt` 作為 `PromptTemplate` 的別名以維持向下相容性。
  - BREAKING CHANGE: 移除對 `Prompt.from_langchain_prompt` 的支援，請改用 `template=LangchainPromptTemplate(lc_template)`。

## \[0.8.8] - 2023-08-23

### 新增功能

- 使用 `OpenAIFineTuningHandler` 收集 LLM 的輸入/輸出，用於 OpenAI fine tuning (#7367)

### Bug Fixes / Nits

- 新增對 `claude-instant-1.2` 的支援 (#7369)

## \[0.8.7] - 2023-08-22

### 新增功能

- 支援 fine-tuned OpenAI 模型 (#7364)
- 新增對 Cassandra 向量儲存的支援 (#6784)
- 支援 tool functions 中的 pydantic 欄位 (#7348)

### Bug Fixes / Nits

- 修復 `OpenAIAgent` 中強制 function call 導致的無限迴圈問題 (#7363)

## \[0.8.6] - 2023-08-22

### 新增功能

- auto 與 recursive retriever notebook (#7353)
- 為 BagelDB 提供 Reader 與 Vector Store 及範例 notebook (#7311)

### Bug Fixes / Nits

- 在 retry source query engine 的中間索引中使用 service context (#7341)
- 針對 prompt helper + chat models 的暫時性修復 (#7350)
- 在套件未安裝時正確跳過單元測試 (#7351)

## \[0.8.5.post2] - 2023-08-20

### 新增功能

- 新增 FireStore docstore/index store 支援 (#7305)
- 新增 recursive agent notebook (#7330)

### Bug Fixes / Nits

- 修復 Azure pydantic 錯誤 (#7329)
- 修復 callback trace ids（將其設為 context var） (#7331)

## \[0.8.5.post1] - 2023-08-18

### 新增功能

- Awadb Vector Store (#7291)

### Bug Fixes / Nits

- 修復 OpenAI llm temperature 型別的 bug

## \[0.8.5] - 2023-08-18

### New Features- 在 service context 中為 open-source LLMs 提供 system prompt/query wrapper prompt (#6647)
- 更改 MyScale index 的預設格式為 `MSTG` (#7288)
- 為 chat engines 增加 tracing agents (#7304)
- 將 LLM 與 embeddings 移至 pydantic (#7289)

### Bug Fixes / Nits

- 修復 sentence splitter bug (#7303)
- 修復 sentence splitter 無限迴圈問題 (#7295)

## \[0.8.4] - 2023-08-17

### Bug Fixes / Nits

- 改善 SQL Query 解析 (#7283)
- 修復從全域 service context 載入 embed\_model 的問題 (#7284)
- 在遷移至 pydantic v2 前，限制 langchain 版本 (#7297)

## \[0.8.3] - 2023-08-16

### 新增功能

- 新增 Knowledge Graph RAG Retriever (#7204)

### Bug Fixes / Nits

- 在 OpenAI LLM class constructor 中接受 `api_key` kwarg (#7263)
- 修復為不同的 `StreamingAgentChatResponse` 實例建立獨立 queue 實例的問題 (#7264)

## \[0.8.2.post1] - 2023-08-14

### 新增功能

- 新增對 Rockset 作為 vector store 的支援 (#7111)

### Bug Fixes

- 修復 service context 定義中可能導致 LLM 失能的 bug (#7261)

## \[0.8.2] - 2023-08-14

### 新增功能

- 允許透過在 service context 中將 LLM 或 embedding model 設定為 `None` 來將其停用 (#7255)
- 使用 `embed_model="local:<model_name>"` 語法可解析幾乎任何 huggingface embedding model (#7255)
- 支援 Async tool-calling (#7239)

### Bug Fixes / Nits

- 更新 supabase 的 add 與 query kwargs (#7103)
- 微調預設 prompts 以支援更通用的查詢 (#7254)
- 將 `CustomLLM` 的 callback manager 設為選填並更新文件 (#7257)

## \[0.8.1] - 2023-08-13

### 新增功能

- feat: 為 ContextChatEngine 新增 node\_postprocessors (#7232)
- 新增 ensemble query engine 教學 (#7247)

### Smaller Features

- 允許 Fastchat/local OpenAI API endpoints 使用 EMPTY keys (#7224)

## \[0.8.0] - 2023-08-11

### 新增功能

- 新增 “LLAMA\_INDEX\_CACHE\_DIR” 以控制快取檔案 (#7233)
- 在可能的情況下，預設使用 pydantic selectors (#7154, #7223)
- 在 service context 的 `embed_model` 中不再需要 langchain wrappers (#7157)
- Metadata extractors 現在除了 `LLMPredictor` 之外，也接受 `LLM` 物件 (#7202)
- 新增 local mode 以及對 llama.cpp + llama2 的 fallback 支援 (#7200)
- 為 embeddings 新增 local fallback 至 `BAAI/bge-small-en` (#7200)
- 新增 `SentenceWindowNodeParser` + `MetadataReplacementPostProcessor` (#7211)

### Breaking Changes

- 將預設 LLM 從 text-davinci-003 更改為 gpt-3.5-turbo (#7223)
- 更改 compact/refine/tree\_summarize 的 prompts 以更好地配合 gpt-3.5-turbo (#7150, #7179, #7223)
- 將預設 LLM temperature 提高至 0.1 (#7180)

## \[0.7.24.post1] - 2023-08-11

### Other Changes

- 還原 #7223 對預設值的更改 (#7235)

## \[0.7.24] - 2023-08-10

### 新增功能

- 在可能的情況下，預設使用 pydantic selectors (#7154, #7223)
- 在 service context 的 `embed_model` 中不再需要 langchain wrappers (#7157)
- Metadata extractors 現在除了 `LLMPredictor` 之外，也接受 `LLM` 物件 (#7202)
- 新增 local mode 以及對 llama.cpp + llama2 的 fallback 支援 (#7200)
- 為 embeddings 新增 local fallback 至 `BAAI/bge-small-en` (#7200)
- 新增 `SentenceWindowNodeParser` + `MetadataReplacementPostProcessor` (#7211)

### Breaking Changes

- 將預設 LLM 從 text-davinci-003 更改為 gpt-3.5-turbo (#7223)
- 更改 compact/refine/tree\_summarize 的 prompts 以更好地配合 gpt-3.5-turbo (#7150, #7179, #7223)
- 將預設 LLM temperature 提高至 0.1 (#7180)

### Other Changes

- docs: 改善 Mendable Search (#7220)
- 重構 openai agent (#7077)

### Bug Fixes / Nits

- 為 pgvector/postgres vector db 使用 `1 - cosine_distance` (#7217)
- 修復 metadata 格式化與提取問題 (#7216)
- fix(readers): 修復 non-ASCII JSON Reader bug (#7086)
- Chore: 為求清晰，將 PgVectorStore 變數名稱從 `sim` 更改為 `distance` (#7226)

## \[0.7.23] - 2023-08-10

### Bug Fixes / Nits

- 修正使用自訂 template 與繼承時的 metadata 格式問題 (#7216)

## \[0.7.23] - 2023-08-10

### 新增功能

- 在文件中新增「one click observability」頁面 (#7183)
- 為本地部署新增 Xorbits inference (#7151)
- 新增 Zep vector store 整合 (#7203)
- feat/zep vectorstore (#7203)

### Bug Fixes / Nits

- 更新預設的 `EntityExtractor` 模型 (#7209)
- 使 `ChatMemoryBuffer` 可被 pickle (#7205)
- 重構 `BaseOpenAIAgent` (#7077)

## \[0.7.22] - 2023-08-08

### 新增功能

- 新增 ensemble retriever notebook (#7190)
- DOCS：新增本地 llama2 notebook (#7146)

### Bug Fixes / Nits

- 透過在 `BaseOpenAIAgent` 中呼叫 super constructor 來修正 `AttributeError: 'OpenAIAgent' object has no attribute 'callback_manager'` (#7192)
- 移除 nebula 查詢中的反引號 (#7192)

## \[0.7.21] - 2023-08-07

### 新增功能

- 新增用於 metadata 提取的 `EntityExtractor` (#7163)

## \[0.7.20] - 2023-08-06

### 新增功能

- 新增 router 模組文件 (#7171)
- 新增 retriever router (#7166)

### 新增功能

- 新增 `RouterRetriever` 以將查詢路由至特定的 retriever (#7166)

### Bug Fixes / Nits

- 修正 `OpenAIAgent` 同時產生多個 streamed responses 時，各個回應串流的 token 會交錯的問題 (#7164)
- 修正 llms callbacks 問題 (args\[0] 錯誤) (#7165)

## \[0.7.19] - 2023-08-04

### 新增功能

- 為 weaviate 新增 metadata 過濾功能 (#7130)
- 為 agents 與 streaming 新增 token 計數（以及所有 callbacks） (#7122)

## \[0.7.18] - 2023-08-03

### 新增功能

- 為 memory 物件新增 `to/from_string` 與 `to/from_dict` 方法 (#7128)
- 在 SQL 查詢的 table info 中包含資料庫資料表的欄位註解 (#7124)
- 新增 Neo4j 支援 (#7122)

### Bug Fixes / Nits

- 為 `AzureOpenAI` 類別新增 `Azure AD` 驗證支援 (#7127)
- 在列印 agent/chat engine 回應串流時新增 `flush=True` (#7129)
- 為 `AzureOpenAI` 類別新增 `Azure AD` 支援 (#7127)
- 更新 LLM 問題產生器 prompt 以提及 JSON markdown (#7105)
- 修正 chat engines 中的 `astream_chat` (#7139)

## \[0.7.17] - 2023-08-02

### 新增功能

- 更新 `ReActAgent` 以支援 memory 模組（由於 constructor 改為接收 `memory` 而非 `chat_history`，因此有輕微的 breaking change，但主要的 `from_tools` 方法仍保持向下相容） (#7116)
- 更新 `ReActAgent` 以支援 streaming (#7119)
- 新增 Neo4j graph store 與 query engine 整合 (#7122)
- 新增物件 streaming (#7117)

## \[0.7.16] - 2023-07-30

### 新增功能

- Chat source nodes (#7078)

## \[0.7.15] - 2023-07-29

### Bug Fixes / Nits

- anthropic api 鍵值自訂 (#7082)
- 修正 Contributor Docs 中指向 API 參考資料的失效連結 (#7080)
- 更新 vector store 文件 (#7076)
- 更新註解 (#7073)

## \[0.7.14] - 2023-07-28

### 新增功能

- 新增 HotpotQADistractor benchmark 評估器 (#7034)
- 為 LanceDB 新增 metadata 過濾與刪除支援 (#7048)
- 在 opensearch 中使用 MetadataFilters (#7005)
- 新增對 `KuzuGraphStore` 的支援 (#6970)
- 新增 `kg_triplet_extract_fn` 以自訂 KG 的建構方式 (#7068)

### Bug Fixes / Nits

- 修正 context chat engine 中的字串格式化 (#7050)
- 修正 async events 的 tracing (#7052)
- 放寬 KG 的 triplet 提取限制 (#7059)
- 為檢索的 KG 資料新增可配置的限制 (#7059)
- 改進 Nebula 連線 (#7059)
- 修正建構 agent 回應之 source nodes 的 bug (#7067)

## \[0.7.13] - 2023-07-26

### 新增功能

- 為 AzureOpenAI 支援 function calling api (#7041)

### Bug Fixes / Nits

- 調校 prompt 以消除 SubQ engine 中的 KeyError (#7039)
- 修正 Azure OpenAI 鍵值的驗證 (#7042)

## \[0.7.12] - 2023-07-25

### 新增功能

- 為底層 query engines 在 `ComposableGraph` 中新增 `kwargs` (#6990)
- 在 init 時驗證 openai 鍵值 (#6940)
- 新增 async embeddings 與 async RetrieverQueryEngine (#6587)- 在 PGVectorStore 中新增 async `aquery` 與 `async_add` (#7031)
- 在 chat engine 與 agent 回應中新增 `.source_nodes` 屬性 (#7029)
- 新增 `OpenInferenceCallback` 以 OpenInference 格式儲存生成資料 (#6998)

### Bug Fixes / Nits

- 修正 data agents 的 achat 記憶體初始化 (#7000)
- 在 agengt/chat engine 回應類別中新增 `print_response_stream()` (#7018)

### Bug Fixes / Nits

- 修正 data agents 的 achat 記憶體初始化 (#7000)
- 在 agengt/chat engine 回應類別中新增 `print_response_stream()` (#7018)

## \[v0.7.11.post1] - 2023-07-20

### 新增功能

- sub-question query engine 在可行時預設使用 pydantic 問題生成 (#6979)

### Bug Fixes / Nits

- 修正大型 chat memory 中訊息的回傳順序 (#6979)

## \[v0.7.11] - 2023-07-19

### 新增功能

- 新增 `SentenceTransformerRerank` node post-processor 以實現快速本地 re-ranking (#6934)
- 在 pandas query engine 中新增 numpy 支援以評估查詢 (#6935)
- 為 Postgres Vector Storage 整合新增 metadata 篩選支援 (#6968)
- 為 agents 與 query engines 提供正確的 llama2 支援 (#6969)

### Bug Fixes / Nits

- 在 LLMMetadata 中新增 `model_name` (#6911)
- 在 query engines 中回退至 retriever service context (#6911)
- 修正包含額外 kwargs 時的 `as_chat_engine()` ValueError (#6971)

## \[v0.7.10.post1] - 2023-07-18

### 新增功能

- 新增對 Replicate LLM 的支援 (vicuna & llama 2!)

### Bug Fixes / Nits

- 修正 condense chat engine 的 streaming (#6958)

## \[v0.7.10] - 2023-07-17

### 新增功能

- 新增對 chroma v0.4.0 的支援 (#6937)
- 將 embedding 向量記錄至 callback manager (#6962)

### Bug Fixes / Nits

- 增加更穩健的 embedding timeout 機制 (#6779)
- 改善 postgres vector store 的連線 session 管理 (#6843)

## \[v0.7.9] - 2023-07-15

### 新增功能

- 指定 `embed_model="local"` 以在 service context 中使用預設本地 embeddings (#6806)
- 在 `BasePydanticProgram` 中新增 async `acall` endpoint (預設為 sync 版本)。已為 `OpenAIPydanticProgram` 實作。

### Bug Fixes / Nits

- 修正搜尋現有 vector dbs 時 metadata 為 null 的問題 (#6912)
- 為 `SimpleDirectoryReader` 新增模組指南文件 (#6916)
- 確保即使未在底層 query engine 中明確設定 `streaming=True`，`CondenseQuestionChatEngine` streaming chat endpoints 仍能正常運作。

## \[v0.7.8] - 2023-07-13

### 新增功能

- 新增 embedding 速度基準測試 (#6876)
- 新增 BEIR retrieval 基準測試 (#6825)

### Bug Fixes / Nits

- 從 deprecated\_terms 中移除 toctrees (#6895)
- 放寬 typing 依賴 (#6879)
- docs: 修改 evaluation notebook (#6840)
- 若模型不支援 functions 則拋出錯誤 (#6896)
- fix(bench embeddings): 修正未考慮字串長度的 bug (#6899)x

## \[v0.7.7] - 2023-07-13

### 新增功能

- 改善 milvus 一致性支援與輸出欄位支援 (#6452)
- 新增對 cypyer+nebula 知識圖譜查詢的支援 (#6642)
- 新增 `Document.example()` 以建立 documents 用於快速原型開發 (#6739)
- 將 react chat engine 替換為使用原生 reactive agent (#6870)

### Bug Fixes / Nits

- chore: 在 makefile 中新增說明訊息 (#6861)

### Bug Fixes / Nits

- 修正使用 SQLTableSchema context\_str 屬性的支援 (#6891)

## \[v0.7.6] - 2023-07-12

### 新增功能

- 在 agent/chat engine 回應中新增 sources (#6854)
- 在 agents / chat engines 中新增基礎 chat buffer memory (#6857)
- 新增 load 與 search 工具 (#6871)
- 新增簡單的 agent 基準測試 (#6869)
- 新增 agent 文件 (#6866)
- 新增 react agent (#6865)

### Breaking/Deprecated API Changes

- 將 react chat engine 替換為原生 react agent (#6870)
- 將預設 chat mode 設定為 “best”：可行時使用 openai agent，否則使用 react agent (#6870)

### Bug Fixes / Nits

- 修正對舊版 vector store metadata 的支援 (#6867)
- 修正文件中的 chroma notebook (#6872)
- 更新 LC embeddings 文件 (#6868)

## \[v0.7.5] - 2023-07-11

### New Features- 新增 `Anthropic` LLM 實作 (#6855)

### Bug Fixes / Nits

- 修正 `SentenceEmbeddingOptimizer` 中的索引錯誤 (#6850)
- 修正 custom embedding model 的文件 (#6851)
- fix(silent error): 為 `SimpleDirectoryReader` 新增驗證 (#6819)
- 修正文件中的連結 (#6833)
- 修正 Azure gpt-35-turbo 模型無法辨識的問題 (#6828)
- 更新 Chatbot\_SEC.ipynb (#6808)
- 將殘留的原始名稱重新命名為 LlamaIndex (#6792)
- 修補相同類型的巢狀 traces (#6791)

## \[v0.7.4] - 2023-07-08

### 新增功能

- `MetadataExtractor` - 透過基於 LLM 的 feature extractors 進行文件元資料增強 (#6764)

### Bug Fixes / Nits

- 修正將 query bundle 傳遞至 node postprocessors 的問題 (#6780)
- 修正 callback manager 在處理巢狀 traces 時的錯誤 (#6791)

## \[v0.7.3] - 2023-07-07

### 新增功能

- Sub question query engine 在 callback manager 中會回傳子問題的來源 nodes (#6745)
- trulens 整合 (#6741)
- 為 subquestion engine 新增來源 (#6745)

### Bug Fixes / Nits

- 為 simple 和 condense chat engines 新增/修正 streaming 支援 (#6717)
- 修正 `response_mode="no_text"` response synthesizer (#6755)
- 修正在 service context 中設定 `num_output` 與 `context_window` 的錯誤 (#6766)
- 修正教學文件中遺漏 as\_query\_engine() 的問題 (#6747)
- 修正 notebook 中的變數 sql\_query\_engine (#6778)
- 修正必要的 function fields (#6761)
- 移除 Prompt 與 SQL gen 中 stop token 的使用 (#6782)

## \[v0.7.2] - 2023-07-06

### 新增功能

- 支援 Azure OpenAI (#6718)
- 在 chat engine 與 OpenAI agent 中支援前綴訊息（例如 system prompt） (#6723)
- 新增 `CBEventType.SUB_QUESTIONS` 事件類型以追蹤子問題的查詢與回應 (#6716)

### Bug Fixes / Nits

- 修正 HF LLM 輸出錯誤 (#6737)
- 為 langchain 訊息範本新增 system message 支援 (#6743)
- 修正 node-postprocessors 的套用問題 (#6749)
- 在 `llama_index.llms` 下新增遺漏的 `CustomLLM` import (#6752)
- fix(typo): `get_transformer_tokenizer_fn` (#6729)
- feat(formatting): `black[jupyter]` (#6732)
- fix(test): `test_optimizer_chinese` (#6730)

## \[v0.7.1] - 2023-07-05

### 新增功能

- 為 OpenAI agents 提供 streaming 支援 (#6694)
- 新增 recursive retriever 及 notebook 範例 (#6682)

## \[v0.7.0] - 2023-07-04

### 新增功能

- 索引建立進度條 (#6583)

### Bug Fixes/ Nits

- 改進 chat refine 範本 (#6645)

### Breaking/Deprecated API Changes

- 將 `BaseOpenAIAgent` 改為使用 `llama_index.llms.OpenAI`。調整 `chat_history` 以使用 `List[ChatMessage]]` 作為類型。

- 移除（先前已棄用）的 `llama_index.langchain_helpers.chain_wrapper` 模組。

- 移除（先前已棄用）的 `llama_index.token_counter.token_counter` 模組。詳情請參閱 [遷移指南](https://developers.llamaindex.ai/how_to/callbacks/token_counting_migration.html) 以了解新的基於 callback 的 token 計數方式。

- 移除 `ChatGPTLLMPredictor` 與 `HuggingFaceLLMPredictor`。詳情請參閱 [遷移指南](https://developers.llamaindex.ai/how_to/customization/llms_migration_guide.html) 以了解替代方案。

- 移除透過 `LLMPredictor` 建構子設定 `cache` 的支援。

- 更新 `BaseChatEngine` 介面：

  - 調整 `chat_history` 以使用 `List[ChatMessage]]` 作為類型
  - 將 `chat_history` 狀態公開為屬性
  - 支援在 `chat` 與 `achat` 端點中覆寫 `chat_history`

- 移除 `PromptHelper` 的棄用參數：`max_input_size`, `embedding_limit`, `max_chunk_overlap`

- 更新所有 notebook 以使用原生 openai 整合 (#6696)

## \[v0.6.38] - 2023-07-02

### 新增功能

- 在索引建立過程中新增可選的 tqdm 進度條 (#6583)
- 為 「compact」 與 「refine」 回應模式新增 async 支援 (#6590)
- \[feature] 為 optimizer 新增 transformer tokenize 功能 (中文) (#6659)
- 為向量資料庫新增簡單的 benchmark (#6670)
- 引入 `llama_index.llms` 模組，包含新的 `LLM` 介面，以及 `OpenAI`, `HuggingFaceLLM`, `LangChainLLM` 實作 (#6615)
- 移除 pydantic 程式 (#6666)

### Bug Fixes / Nits

- 改進 RedisVectorStore 的元資料/node 儲存與檢索 (#6678)- 修復 vector stores 中的 node 與 document 篩選問題 (#6677)
- 在文件中新增 context retrieval agent notebook 連結 (#6660)
- 允許 ImageNode 類別中的 ‘image’ property 為 null 值 (#6661)
- 修復文件中的失效連結 (#6669)
- 更新 milvus 以儲存 node 內容 (#6667)

## \[v0.6.37] - 2023-06-30

### 新增功能

- 新增 context augmented openai agent (#6655)

## \[v0.6.36] - 2023-06-29

### 新增功能

- Redis 支援 index stores 與 docstores (#6575)
- DuckDB + SQL query engine notebook (#6628)
- 新增展示 deplot data loader 的 notebook (#6638)

### Bug Fixes / Nits

- 強化從 LLM 解析 JSON 至 `SelectionOutputParser` 的穩定性 (#6610)
- 將 loaders 與 llama-hub 保持同步 (#6630)
- 在 notebooks 中移除 SQLStructStoreIndex 的使用 (#6585)
- MD reader：移除 html 標籤並保留換行 (#6618)
- 將最小 langchain 版本提升至最新版本 (#6632)
- 修復 postgres vector store 中的 metadata 欄位名稱 (#6622)
- Postgres metadata 修復 (#6626, #6634)
- 修復 contribution.md 中 dataloaders 的連結 (#6636)
- 修復：creating custom\_llm huggingface 範例文件中的打字錯誤 (#6639)
- 更新 SelectionOutputParser 以處理 JSON 物件與陣列 (#6610)
- 修復 docstring 參數的打字錯誤 (#6652)

## \[v0.6.35] - 2023-06-28

- 重構 structured output + pydantic programs (#6604)

### Bug Fixes / Nits

- 修復 OpenSearch vector stores 的序列化問題 (#6612)
- 修補文件中的 relationships (#6606)
- 修復解析 git repo 時忽略目錄的 Bug (#4196)
- 更新 Chroma notebook (#6572)
- 回溯舊版 node 名稱 (#6614)
- 新增更改 chroma 實作的能力 (#6601)

## \[v0.6.34] - 2023-06-26

### Patch Update (v0.6.34.post1)

- 修補 Document obj 的 import 以維持向下相容性 (#6597)

### 新增功能

- 基於 pydantic 新增 `TextNode`/`Document` 物件類別 (#6586)
- `TextNode`/`Document` 物件支援 metadata 自定義（metadata 模板、從 LLM 或 embeddings 中排除 metadata） (#6586)
- Nodes 不再要求 flat metadata dictionaries，除非您使用的 vector store 有此要求 (#6586)

### Bug Fixes / Nits

- 使用 `NLTK_DATA` 環境變數來控制 NLTK 下載路徑 (#6579)
- \[discord] 在 group\_conversations.py 中將作者儲存為 metadata (#6592)
- 將 requirements 中的 bs4 改為 beautifulsoup4 (#6582)
- 將 euclidean distance 取負值 (#6564)
- 在文件中新增 df output parser notebook 連結 (#6581)

### Breaking/Deprecated API Changes

- `Node` 已重新命名為 `TextNode` 並從 `llama_index.schema` import (#6586)
- `TextNode` 與 `Document` 必須使用 kwargs 進行實例化：`Document(text=text)` (#6586)
- `TextNode` (原 `Node`) 具有 `id_` 或 `node_id` property，而非 `doc_id` (#6586)
- `TextNode` 與 `Document` 具有 metadata property，取代了 extra\_info property (#6586)
- `TextNode` 不再具有 `node_info` property（start/end 索引直接透過 `start/end_char_idx` 屬性存取） (#6586)

## \[v0.6.33] - 2023-06-25

### 新增功能

- 新增 typesense vector store (#6561)
- 新增 df output parser (#6576)

### Bug Fixes / Nits

- 透過 bridge module 追蹤 langchain 依賴項 (#6573)

## \[v0.6.32] - 2023-06-23

### 新增功能

- 新增 object index (#6548)
- 新增 SQL Schema Node Mapping + SQLTableRetrieverQueryEngine + obj index 修復 (#6569)
- sql 重構 (NLSQLTableQueryEngine) (#6529)

### Bug Fixes / Nits

- 更新 vector\_stores.md (#6562)
- 微調 `BaseResponseBuilder` 介面 (#6557)
- 重構 TreeSummarize (#6550)

## \[v0.6.31] - 2023-06-22

### Bug Fixes / Nits

- 正確將 weaviate 距離轉換為分數 (#6545)
- 重構 tree summarize 並修復截斷 context 的 Bug (#6550)
- 修復 custom KG retrieval notebook 的細節問題 (#6551)

## \[v0.6.30] - 2023-06-21

### 新增功能

- 在 router query engine 中支援 multi-selector (#6518)
- 在 router query engine 中透過 OpenAI function calling API 支援 pydantic selector (#6518)
- 在 `CondenseQuestionChatEngine` 與 `SimpleChatEngine` 中支援串流回應 (#6524)
- 在 `QdrantVectorStore` 中支援 metadata 篩選 (#6476)
- 新增 `PGVectorStore`，支援搭配 pgvector 的 postgres (#6190)

### Bug Fixes / Nits

- 改善 mbox reader 的錯誤處理 (#6248)
- 修正使用 weaviate 時 similarity score 為空的問題 (#6512)
- 修正 `PrevNextNodePostprocessor` 中 nodes 的排序 (#6048)

### Breaking/Deprecated API Changes

- Refactor PandasQueryEngine to take in df directly, deprecate PandasIndex (#6527)

## \[v0.6.29] - 2023-06-20

### 新增功能

- 新增使用 OpenAI Function API 的 query planning tool (#6520)
- 文件：新增 kg+vector index 範例 (#6497)
- 設定 Cohere 與 AI21（J2 model）的 Context window 大小 (#6485)

### Bug Fixes / Nits

- 新增 Cohere 與 AI21 的預設輸入大小 (#6485)
- 文件：將 dict 物件中的逗號改為冒號 (#6439)
- 調整 prompt 中多餘的空格與錯誤訊息 (#6443)
- \[Issue 6417] 修正 prompt\_templates 文件頁面 (#6499)
- 移除 monkey patch，並更新 model 與 Context window 的對應關係 (#6490)

## \[v0.6.28] - 2023-06-19

### 新增功能

- New OpenAI Agent + Query Engine Cookbook (#6496)
- allow recursive data extraction (pydantic program) (#6503)

### Bug Fixes / Nits

- 更新 mongo 介面 (#6501)
- 補上之前遺漏的 openai pydantic program 修正 (#6503) (#6504)
- 修正 Airbyte notebook 中的 github 圖片 (#6493)

## \[v0.6.27] - 2023-06-16

### 新增功能

- 在 weaviate 中新增 node doc\_id 篩選 (#6467)
- 新增 `TokenCountingCallback`，可自訂並追蹤 embedding、prompt 與 completion 的 token 用量 (#6440)
- OpenAI Retrieval Function Agent (#6491)

### Breaking/Deprecated API Changes

- 棄用目前的 token 追蹤方式（llm predictor 與 embed model 未來將不再追蹤 tokens，請改用 `TokenCountingCallback` (#6440)
- 在 Simple Vector Store 中新增 maximal marginal relevance，可透過 query mode 啟用 (#6446)

### Bug Fixes / Nits

- `as_chat_engine` 正確繼承目前的 service context (#6470)
- 從 pinecone 刪除資料時使用 namespace (#6475)
- 修正 Windows 上使用 fsspec 時的路徑 (#3778)
- 修正 `SimpleDirectoryReader` 使用自訂 file readers 的問題 (#6477)
- 編修 MMR Notebook (#6486)
- FLARE 修正 (#6484)

## \[v0.6.26] - 2023-06-14

### 新增功能

- Add OpenAIAgent and tutorial notebook for “build your own agent” (#6461)
- Add OpenAIPydanticProgram (#6462)

### Bug Fixes / Nits

- Fix citation engine import (#6456)

## \[v0.6.25] - 2023-06-13

### 新增功能

- Added FLARE query engine (#6419).

## \[v0.6.24] - 2023-06-12

### 新增功能

- 改善 Pinecone 與 Weaviate 對已有資料之 vector store 的支援，例如允許設定 text key。 (#6393)
- 支援 Pineone 的批次 upsert (#6393)
- 新增初步的 [guidance](https://github.com/microsoft/guidance/) 整合。新增 `GuidancePydanticProgram` 以產生一般結構化輸出，並新增 `GuidanceQuestionGenerator`，在 `SubQuestionQueryEngine` 中產生子問題 (#6246)。

## \[v0.6.23] - 2023-06-11

### Bug Fixes / Nits

- Remove hardcoded chunk size for citation query engine (#6408)
- Mongo demo improvements (#6406)
- Fix notebook (#6418)
- Cleanup RetryQuery notebook (#6381)

## \[v0.6.22] - 2023-06-10

### 新增功能

- 新增 `SQLJoinQueryEngine`（`SQLAutoVectorQueryEngine` 的泛化版本）(#6265)
- 新增底層 graph stores 支援，並初步支援 Nebula KG。後續將提供更多文件！ (#2581)
- 新增 guideline evaluator，讓 llm 能依照使用者的 guidelines 提供回饋 (#4664)
- 新增 MongoDB Vector stores 支援，以使用 Atlas knnbeta search (#6379)
- 新增 CitationQueryEngine，在回應文字中提供來源的 inline citations (#6239)

### Bug Fixes

- 修復 `delete_ref_doc` 未能從 docstore 移除所有 metadata 的 bug (#6192)
- 修復載入現有 QDrantVectorStore 的 bug (#6230)

### Miscellaneous

- 正式將 changelog 新增至 github repo (#6191)

## \[v0.6.21] - 2023-06-06

### 新增功能

- SimpleDirectoryReader 新增 `filename_as_id` 旗標，可自動設定 doc\_id (對 `refresh_ref_docs()` 非常有用)
- 整合 DocArray vector store
- 整合 Tair vector store
- 新增 Weights and Biases callback handler，用於追蹤與版本控制 index
- 可直接從 vector store 初始化 index：`index = VectorStoreIndex.from_vector_store(vector_store=vector_store)`

### Bug Fixes

- 修復 multimodal notebook
- 更新並修復文件中的 SQL 教學

### Miscellaneous

- 微調文件更新
- 新增 github pull-request 範本
- 新增 github issue-forms

## \[v0.6.20] - 2023-06-04

### 新增功能

- 新增 JSONQueryEngine，使用 JSON schema 以提供更準確的 JSON 查詢答案
- redis vector-store 現在支援 metadata
- 整合 Supabase vector store

### Bug Fixes

- 修復 text-to-sql prompt 中的錯字

### Breaking/Deprecated API Changes

- 移除 index 的 GPT 前綴 (但仍支援舊有的 import 與名稱)

### Miscellaneous

- 大幅更新文件，將重要模組移至頂層

## \[v0.6.19] - 2023-06-02

### 新增功能

- 為 llama-hub data loaders 新增 agent tool 抽象層

### Miscellaneous

- 微調文件更新

## \[v0.6.18] - 2023-06-02

### Miscellaneous

- 在教學文件章節中新增 `Discover LlamaIndex` 影片系列
- 微調文件更新