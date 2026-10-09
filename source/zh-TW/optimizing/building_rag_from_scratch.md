---
title: "從零開始建構 RAG (底層)"
---

本文件是一個指南，旨在展示如何僅使用低階抽象（例如 LLMs、prompts、embedding models），而不使用更「封裝」的現成抽象，來建構基於 RAG 與 agent 的應用程式。

現成的抽象包括：

- 高階 ingestion 程式碼，例如 `VectorStoreIndex.from_documents`
- 高階 query 與 retriever 程式碼，例如 `VectorStoreIndex.as_retriever()` 與 `VectorStoreIndex.as_query_engine()`
- 高階 agent 抽象，例如 `FunctionAgent`、`ReActAgent`、`CodeActAgent`

本文件的目標並非使用這些功能，而是讓使用者了解底層的運作原理。透過向您展示建構 RAG 與 agent workflows 的底層演算法，您將能建立自定義的 LLM workflows（同時仍可在任何合理的粒度層級使用 LlamaIndex 抽象）。

我們將展示如何從零開始逐步建構應用程式的各個元件。為了集中討論，每個教學將展示如何從零建構特定元件，而其他元件則使用現成的抽象。**注意**：這是一個開發中的 document，我們目前正在完善內容！

## 從零建構 Ingestion

本教學將展示如何定義將資料導入向量資料庫的 ingestion pipeline。

- [從零開始的 Ingestion](https://developers.llamaindex.ai/python/examples/low_level/ingestion/index.md)

## 從零建構 Vector Retrieval

本教學將展示如何建構一個用於查詢向量資料庫的 retriever。

- [從零開始的 Vector Retrieval](https://developers.llamaindex.ai/python/examples/low_level/retrieval/index.md)

## 從零建構 Ingestion/Retrieval（開源/本地元件）

本教學將展示如何僅使用開源元件來建構 ingestion/retrieval pipeline。

- [開源 RAG](https://developers.llamaindex.ai/python/examples/low_level/oss_ingestion_retrieval/index.md)

## 從零建構（極簡）向量資料庫

如果您想深入了解向量資料庫的運作方式，本教學將展示如何建構一個支援 dense search 與 metadata filtering 的極簡向量資料庫。

顯然，這不能取代正式環境的資料庫。

- [從零開始的 Vector Store](https://developers.llamaindex.ai/python/examples/low_level/vector_store/index.md)

## 從零建構 Response Synthesis

本教學將展示如何使用 LLM，根據一組檢索到的 context 來合成結果。內容涵蓋 context overflow、async calls 以及來源引用！

- [從零開始的 Response Synthesis](https://developers.llamaindex.ai/python/examples/low_level/response_synthesis/index.md)

## 從零建構 Evaluation

學習如何使用 LLMs 與 prompt 模組來建構常見的基於 LLM 的 eval 模組（如 correctness、faithfulness）；這將幫助您定義自定義的 evals！

- [從零開始的 Evaluation](https://developers.llamaindex.ai/python/examples/low_level/evaluation/index.md)

## 從零建構進階 RAG

這些教學將展示如何建構超出基本 RAG workflow 的進階功能。對於有自定義 workflows 或正式環境需求的進階使用者尤其有用。

### 從零建構 Hybrid Search

Hybrid search 是許多向量資料庫支援的進階檢索功能。它允許您將 **dense** 檢索與匹配關鍵字的 **sparse** 檢索相結合。

- [從零建構 Hybrid Search](https://developers.llamaindex.ai/python/examples/vector_stores/qdrant_hybrid/index.md)

### 從零建構 Router

除了標準的 RAG workflow 之外，本教學將透過展示如何從零建構 router 模組，帶您向使用 LLMs 實現自動化決策邁進一步。

- [從零開始的 Router](https://developers.llamaindex.ai/python/examples/low_level/router/index.md)

### 從零建構 RAG Fusion Retriever

在此我們將展示如何建構一個支援 query-rewriting、ensembling 與動態檢索的進階 retriever。

- [從零開始的 Fusion Retrieval](https://developers.llamaindex.ai/python/examples/low_level/fusion_retriever/index.md)

## 從零建構結構化資料的 QA

RAG 作為一個框架，主要聚焦於非結構化資料。但 LlamaIndex 同樣也對結構化資料與半結構化資料提供現成支援。

請參閱以下指南，了解如何從零建構 text-to-SQL（使用我們的 Workflows 函式庫）。

- [從零開始的 Text-to-SQL](https://developers.llamaindex.ai/python/examples/workflow/advanced_text_to_sql/index.md)