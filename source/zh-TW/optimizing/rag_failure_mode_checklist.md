---
title: "RAG 故障模式檢查清單"
---

當您的 RAG pipeline 表現不如預期時，很難精確找出根本原因。本檢查清單涵蓋了最常見的失效模式、其症狀以及能讓您恢復正常運作的最小修復方案。

前九個章節側重於單次查詢的行為（檢索、chunking、embeddings、query formulation 以及 synthesis）。後續章節則強調在較大規模或長時間運行的部署中才會出現的系統級問題。

## 1. 檢索幻覺

**發生情況：** retriever 回傳的 chunks 看起來相關，但實際上並不包含答案。接著 LLM 會根據不相關的上下文「幻覺」出一個聽起來合理的回答。

**症狀：**

- 回答聽起來很有信心，但事實錯誤
- 檢索到的 chunks 與 query 共享關鍵字，但討論的是不同主題
- 不相關的段落具有高 similarity scores

**修復方案：**

- 加入 **reranker**（例如 `CohereRerank`, `SentenceTransformerRerank`）在初步檢索後過濾掉 false positives
- 增加 `similarity_top_k` 並讓 reranker 進行剪枝，而非僅依賴向量資料庫的小 top-k
- 使用 **hybrid search**（結合向量 + 關鍵字檢索）以減少語義上的誤匹配
- 透過 `node_postprocessors` 加入 relevance threshold 以捨棄低信心度的 chunks

## 2. 選到錯誤的文字區塊（分塊方式不佳）

**發生情況：** 您的 documents 切分方式將關鍵上下文分散在多個 chunks 中，導致沒有單一 chunk 擁有足夠資訊來回答 query。

**症狀：**

- 回答部分缺失或不完整
- 正確資訊存在於您的 corpus 中，但檢索到的 chunks 未能完整包含
- 當您手動提供正確文本時，回答品質大幅提升

**修復方案：**

- 嘗試調整 **chunk size and overlap**（例如使用 1024+ tokens 的較大 chunks 並搭配 10–20% 的 overlap）
- 使用 `SentenceSplitter` 取代單純的固定大小切分，以保留句子邊界
- 嘗試使用 `HierarchicalNodeParser` 進行 **hierarchical chunking**，以同時捕捉細粒度與廣泛的上下文
- 考慮使用 `SentenceWindowNodeParser` 檢索單一句子，但利用周圍上下文進行 synthesis

## 3. 索引碎片化

**發生情況：** 您的 index 包含重複、過時或衝突的 documents 版本，導致檢索結果不一致或相互矛盾。

**症狀：**

- 同一個問題在不同次執行時得到不同答案
- 檢索到的 chunks 中包含矛盾資訊
- 即使更新了來源 documents，仍會出現舊資料

**修復方案：**

- 實作一套搭配 `doc_id` 追蹤的 **document management** 策略，並使用 `index.refresh_ref_docs()` 更新變更過的 documents
- 使用 `IngestionPipeline` 搭配 `docstore` 在索引前對 documents 進行去重
- 定期從來源重新構建 index，而非僅僅是 append
- 加入 metadata（時間戳記、版本號），並在適用時根據 recency 進行過濾

## 4. 設定偏移（Embedding 不匹配）

**發生情況：** 查詢時使用的 embedding model 與索引時使用的不同，或者在索引與查詢之間變更了如 chunk size 等 settings。

**症狀：**

- 程式碼變更或 dependency 更新後，檢索品質突然下降
- 所有查詢的 similarity scores 異常低
- 先前可正常運作的查詢現在回傳不相關結果

**修復方案：**

- 將 embedding model 名稱與 index 一併儲存，並記錄在 metadata 或 config 中
- 固定 embedding model 版本（例如 `text-embedding-3-small` 或特定的 `sentence-transformers` model revision）
- 如果變更了 embedding model，必須重新構建整個 index，因為 embeddings 無法混用
- 在索引與查詢的程式路徑中一致地使用 `Settings.embed_model`

## 5. Embedding 模型不匹配（模型不適合使用領域）

**發生情況：** embedding model 無法理解您領域的術語，導致領域特定查詢的語義相似度表現不佳。

**症狀：**

- 通用知識問題結果良好，但領域特定問題結果不佳
- 您領域中的同義詞或 jargon 無法被有效匹配- 在您的資料集上，關鍵字搜尋的表現優於向量搜尋

**解決方案：**

- 嘗試使用 **domain-adapted embedding model**（例如針對法律、醫療或程式碼微調的模型）
- 將向量搜尋與 **關鍵字搜尋** 結合（混合模式），以捕捉精確的術語匹配
- 從您的語料庫生成合成 QA 對，並在部署前評估 embedding recall

## 6. 超出 Context window

**發生原因：** 檢索到的 chunk 過多，被塞入 LLM 的 prompt 中，導致超過 context window 或因雜訊過多而稀釋了有效訊號。

**症狀：**

- 回答被截斷或中斷
- 出現關於 token 限制的 API 錯誤
- 回答忽略了相關的檢索內容（尤其是位於 context 開頭或中間的內容）
- 隨著 `similarity_top_k` 增加，品質下降

**解決方案：**

- 使用如 `TreeSummarize` 或 `Refine` 的 **response synthesizer** 代替 `CompactAndRefine` 以處理大量 context
- 減少 `similarity_top_k`，並依賴 reranking 僅呈現最相關的 chunk
- 設定明確的 `max_tokens` 限制，並使用 `callback_manager` 監控 token 數量
- 考慮使用 **summary index** 或 **recursive retrieval** 在 synthesis 前壓縮 context

## 7. 缺少 Metadata 篩選

**發生原因：** retriever 在所有 documents 中進行搜尋，但實際上應該將範圍限制在特定子集（例如特定的日期範圍、部門或 document 類型）。

**症狀：**

- 回答從錯誤的 documents 中提取（例如使用者詢問今年，卻抓到去年的報告）
- 不同 document 類別之間發生交叉污染
- 使用者回報「系統知道太多」或回傳不相關的內容

**解決方案：**

- 在 ingestion 期間加入結構化 **metadata**（日期、來源、類別、作者）
- 在查詢時使用 `MetadataFilters` 來限制檢索範圍
- 實作 **auto-retrieval**，由 LLM 從使用者查詢中提取篩選參數
- 為邏輯上不同的 document 集合使用獨立的 index 或 namespace

## 8. 未正確理解查詢

**發生原因：** 使用者的查詢含糊不清、太短，或其措辭與 documents 中儲存資訊的方式不同。

**症狀：**

- 僅僅對查詢進行簡單的改寫，結果就大幅改變
- 短查詢（一兩個單字）的回傳結果不佳
- 使用者必須「知道正確的關鍵字」才能獲得好的答案

**解決方案：**

- 加入 **query transformation** 步驟，並使用 `HyDEQueryTransform` 生成假設性答案來進行搜尋
- 使用 `SubQuestionQueryEngine` 將複雜查詢分解為較簡單的子查詢
- 使用 LLM 實作 **query rewriting** 以擴展或改寫查詢
- 加入包含範例查詢的 few-shot prompt 以引導使用者

## 9. LLM 回答合成失敗

**發生原因：** retriever 檢索到了正確的 chunk，但 LLM 無法從中合成出良好的答案。

**症狀：**

- 檢索到的 chunk 是正確的（經人工驗證），但答案仍然錯誤
- LLM 忽略提供的 context，而是根據其訓練資料回答
- 儘管有具體的 context 可用，答案卻過於籠統

**解決方案：**

- 使用更強大的 LLM 進行 synthesis（例如使用 GPT-4o 代替 GPT-4o-mini）或微調 temperature
- 自定義 **QA prompt template**，明確指示 LLM 僅使用提供的 context
- 使用 `Refine` 回應模式，依序處理每個 chunk 而非一次處理全部
- 加入 `system_prompt`，強調 LLM 應僅根據 context 回答

## 10. Embedding 相似度指標不匹配（Cosine score 不等於實際語意）

**發生原因：** 用於相似度計算的距離指標或正規化方式，與資料中意義的分布不一致。過長或過於籠統的 chunk 會主導相似度分數，而真正相關的片段在排名中較低。

**症狀：**

- Top-1 的結果明顯錯誤，但相關的 documents 出現在 top-k 列表的較後方- 相關與不相關 chunk 的 similarity scores 過於接近
- 在 documents 中加入通用的 boilerplate text 對 retrieval 行為產生的影響超出預期
- 手動檢查顯示 retrieval 品質對微小的 preprocessing 變更非常敏感

**修正方法：**

- 檢查完整的 top-k 列表，確認相關 chunk 是否有出現但排名過低
- 正規化或修剪過長的 chunk，避免少數巨大的 nodes 主導 similarity
- 考慮加入 reranking 階段，使用與基礎 vector store 不同的 scoring function
- 在部署前使用標記過的 query 評估 retrieval（在小型測試集上計算 precision / recall），並根據結果調整 `similarity_top_k` 與 thresholds

## 11. Session 與快取記憶中斷

**發生情況：** 使用者期望系統能記得之前的互動或設定，但底層的 indices、vector stores 或 caches 是 stateless 的，或是 key 設定錯誤。即便資料存在，不同 session 之間的 retrieval 結果仍顯得不穩定。

**症狀：**

- 在不同日期詢問相同問題，回傳的 documents 子集不同
- 在 redeploy 或清除 cache 後，先前穩定的 query 開始出現偏差
- 使用相同 query 手動請求 vector store 時，有時會回傳空結果或結果集大幅縮小

**修正方法：**

- 為 **session 與 user keys** 定義明確的策略，並確保它們一致地傳遞至應用程式、retrievers 與 stores 中
- 將長期知識與短期暫存空間分開，避免 cache eviction 刪除關鍵資料
- 針對有問題的請求記錄 index versions、cache keys 與 retrieval parameters，並跨 session 進行比較
- 加入 regression test，在每次 deploy 後重播一段短對話或 query 序列以驗證穩定性

## 12. 可觀測性缺口（黑箱除錯）

**發生情況：** 你知道答案錯誤，但無法得知 retriever 或 LLM 實際上做了什麼。缺乏基礎的 traces 會導致無法判斷問題出在 retrieval、synthesis 還是 deployment。

**症狀：**

- Bug 回報為「有時回答很奇怪」，但缺乏可重現的 traces
- 無法輕鬆檢查針對某個錯誤答案所 retrieval 的 nodes
- 未記錄 token counts、prompts 與 index metadata，導致無法重建 production 的執行過程

**修正方法：**

- 為 retrieval、query transforms、prompts 與 responses 開啟 tracing 與 logging（可透過 LlamaIndex callbacks 或自有的 logging stack）
- 針對每個錯誤答案，至少擷取：使用者 query、retrieved nodes、similarity scores、index 或 snapshot identifiers，以及最終的 LLM prompt
- 在應用程式中加入「debug mode」，將 retrieval 結果與決策印出或儲存以供手動檢查
- 在變更基礎設施前，嘗試僅利用 logs 與 traces 重現失敗；若無法重現，請先提升可觀測性

## 13. 索引生命週期與部署順序

**發生情況：** Pipeline 在本地測試正常，但 production 行為隨機，因為 indices 為空、僅部分建立，或與執行中的設定不一致。服務啟動順序錯誤，或指向錯誤的儲存空間。

**症狀：**

- 部署後立即發現部分 query 回傳明顯不完整或空的答案
- Logs 顯示 vector store 包含的 nodes 遠少於預期
- 變更環境變數或 secrets 時，悄悄切換了 query 時使用的 index 或 embedding settings
- 在沒有任何程式碼變更的情況下，rollback 或 redeploy 會再次改變答案

**修正方法：**

- 將 index 視為版本化的 artifact，並在 ingestion 與 serving 路徑中追蹤 **index version 或 snapshot id**
- 加入 health check，在 deploy 後執行一個已知正確的 query；若 index 為空、低於最小尺寸或使用錯誤的 embedding config 則判定失敗
- 確保 ingestion 或 refresh jobs 完成後，才將 production traffic 導向新 index
- 避免手動執行一次性的 ingestion 步驟；將其編寫成 scripts 或 pipelines 以防止意外遺漏

## 快速診斷流程圖

請參考此流程以縮小問題範圍：

1. **優先檢查 retrieval：** 印出檢索到的 nodes 並手動確認其是否包含答案。

   - 若 **檢索到的 nodes 錯誤** $\rightarrow$ 請重點檢查上述項目 1–5、7–8。
   - 若 **檢索到的 nodes 正確** $\rightarrow$ 請重點檢查上述項目 6、9。

2. **測試已知正確的 query：** 嘗試一個您明確知道答案位於哪個 document 的 query。

   - 若 **失敗** $\rightarrow$ 可能是 indexing 或 embedding 問題（項目 3–5、10、13）。
   - 若 **成功** $\rightarrow$ 問題與特定 query 有關（項目 1、7–8、11）。

3. **檢查 token 數量：** 記錄傳送到 LLM 的總 token 數。

   - 若 **接近上限** $\rightarrow$ Context window 溢位（項目 6）。
   - 若 **遠低於上限** $\rightarrow$ Synthesis 或 retrieval 品質問題（項目 1–5、8–10、12）。

4. **若問題僅出現在 production 或部署後：**

   - 請重點檢查系統層級問題（項目 11–13），並驗證 index 版本、快取與 trace。

## 延伸閱讀

- [Building Performant RAG Applications for Production](/python/framework/optimizing/production_rag/)
- [Building RAG from Scratch](/python/framework/optimizing/building_rag_from_scratch/)
- [Evaluation Guide](/python/framework/optimizing/evaluation/evaluation/)

## 本文提及的主要 LlamaIndex 類別

- [`SentenceSplitter`](https://developers.llamaindex.ai/python/framework-api-reference/node_parsers/sentence_splitter/)
- [`HierarchicalNodeParser`](https://developers.llamaindex.ai/python/framework-api-reference/node_parsers/hierarchical/)
- [`SentenceWindowNodeParser`](https://developers.llamaindex.ai/python/framework-api-reference/node_parsers/sentence_window/)
- [`CohereRerank`](https://developers.llamaindex.ai/python/framework-api-reference/postprocessor/cohere_rerank/)
- [`SentenceTransformerRerank`](https://developers.llamaindex.ai/python/framework-api-reference/postprocessor/sentence_transformer_rerank/)
- [`HyDEQueryTransform`](https://developers.llamaindex.ai/python/framework-api-reference/query/query_transform/hyde/)
- [`SubQuestionQueryEngine`](https://developers.llamaindex.ai/python/framework-api-reference/query/sub_question/)
- [`IngestionPipeline`](https://developers.llamaindex.ai/python/framework-api-reference/ingestion/pipeline/)
- [`MetadataFilters`](https://developers.llamaindex.ai/python/framework-api-reference/retrievers/vector_store/)