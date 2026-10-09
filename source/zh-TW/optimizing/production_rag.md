---
title: "建構適用於正式環境的高效能 RAG 應用程式"
---

開發 RAG 應用程式的原型很簡單，但要使其高效、強健且能擴展至大型知識庫則相當困難。

本指南包含多項技巧，旨在提升您的 RAG workflow 效能。我們首先概述一些通用技術，並大致按照從簡單到複雜的順序排列。接著，我們將深入探討每項技術、其解決的應用場景，以及如何使用 LlamaIndex 實作！

最終目標是優化您的檢索與生成效能，以便在更複雜的資料集上更準確地回答更多查詢，且不產生幻覺。

## 建構生產級 RAG 的通用技術

以下是建構生產級 RAG 的一些核心考量：

- 將用於檢索的 chunks 與用於合成的 chunks 解耦
- 針對較大型 Document 集的結構化檢索
- 根據任務動態檢索 chunks
- 對檢索到的 nodes 進行 Reranking 以提升精準度
- 優化 context embeddings

我們在 [Production RAG Webinar](https://www.youtube.com/watch?v=Zj5RCweUHIk) 中討論了這些內容及更多細節。請參閱 [此 Tweet 執行緒](https://twitter.com/jerryjliu0/status/1692931028963221929?s=20) 以獲取更多彙整資訊。

## 將用於檢索的 chunks 與用於合成的 chunks 解耦

提升檢索品質的一項關鍵技術，是將用於檢索的 chunks 與用於合成的 chunks 進行解耦。

![](/assets/dce40d878e1f.png)

#### 動機

用於檢索的最佳 chunk 表示方式，可能與用於合成的最佳考量不同。例如，原始文字 chunk 可能包含 LLM 在針對查詢合成詳細答案時所需的細節；然而，它可能包含填充詞或資訊，進而影響 embedding 的表示，或者因為缺乏全域上下文，導致在收到相關查詢時完全無法被檢索到。

#### 關鍵技術

利用此概念主要有兩種方式：

**1. 對 document 摘要進行 Embedding，並將其連結至與該 document 相關的 chunks。**

這有助於在檢索 chunks 之前，先在高層級檢索相關的 documents，而非直接檢索 chunks（後者可能會落在不相關的 documents 中）。

資源：

- [Table Recursive Retrieval](https://developers.llamaindex.ai/python/examples/query_engine/pdf_tables/recursive_retriever/index.md)
- [Document Summary Index](https://developers.llamaindex.ai/python/examples/index_structs/doc_summary/docsummary/index.md)

**2. 對句子進行 Embedding，然後將其連結至該句子周圍的視窗（window）。**

這允許對相關上下文進行更細粒度的檢索（Embedding 過大的 chunks 會導致「lost in the middle」問題），同時也能確保 LLM 合成時有足夠的上下文。

資源：

- [Metadata Replacement Postprocessor](https://developers.llamaindex.ai/python/examples/node_postprocessor/metadatareplacementdemo/index.md)

## 針對較大型 Document 集的結構化檢索

![](/assets/0f45ed69cdca.png)

#### 動機

標準 RAG 堆疊（top-k 檢索 + 基礎文字分割）的一個大問題是，當 documents 的數量增加時（例如您有 100 份不同的 PDF），效能會下降。在這種情況下，針對特定查詢，您可能希望利用結構化資訊來協助更精準的檢索；例如，如果您提出的問題僅與兩份 PDF 相關，可以使用結構化資訊來確保這兩份 PDF 被回傳，而非僅依賴 chunks 的原始 embedding 相似度。

#### 關鍵技術

針對生產級 RAG 系統，有幾種執行結構化標記/檢索的方法，每種方法各有優缺點。

**1. Metadata Filters + Auto Retrieval** 為每個 document 加上 metadata 並儲存在向量資料庫中。在推論時，利用 LLM 推論出正確的 metadata filters，除了語義查詢字串外，同步對向量資料庫進行查詢。

- 優點 ✅：主流向量資料庫均支援。可透過多個維度過濾 document。
- 缺點 🚫：定義正確的標記可能較困難。標記可能不包含足夠的相關資訊以實現更精準的檢索。此外，標記代表的是 document 層級的關鍵字搜尋，不支援語義查找。Resources: **2. Store Document Hierarchies (summaries -> raw chunks) + Recursive Retrieval** Embed document summaries and map to chunks per document。先在 document 層級進行 Fetch，接著再進入 chunk 層級。

- Pros ✅: 允許在 document 層級進行 semantic lookups。
- Cons 🚫: 不支援透過 structured tags 進行 keyword lookups（這比 semantic search 更精確）。此外，自動產生 summaries 的成本可能較高。

**Resources**

- [Chroma Auto-Retrieval](https://developers.llamaindex.ai/python/examples/vector_stores/chroma_auto_retriever/index.md)
- [Document Summary Index](https://developers.llamaindex.ai/python/examples/index_structs/doc_summary/docsummary/index.md)
- [Auto-Retriever vs. Recursive Retriever](https://developers.llamaindex.ai/python/examples/retrievers/auto_vs_recursive_retriever/index.md)

## Dynamically Retrieve Chunks Depending 於您的 Task

![](/assets/ffb6bef424f3.png)

#### Motivation

RAG 不僅僅是針對特定事實進行問答（這是 top-k similarity 所優化的方向）。使用者可能會提出各種不同的查詢。由簡單的 RAG stack 處理的查詢包括詢問特定事實，例如「告訴我這家公司 2023 年的 D\&I 計劃」或「敘述者在 Google 工作期間做了什麼」。但查詢也可能包含摘要，例如「你能給我這個 document 的高階概觀嗎」，或是比較，「你能比較/對比 X 和 Y 嗎」。所有這些使用情境可能需要不同的 retrieval 技術。

#### 關鍵技術

LlamaIndex 提供了一些核心抽象概念來協助您進行特定任務的 retrieval。這包括我們的 [router](/python/framework/module_guides/querying/router/) 模組以及 [data agent](/python/framework/module_guides/deploying/agents/) 模組。此外還包括一些進階的 query engine 模組，以及其他將 structured 與 unstructured 資料結合的模組。

您可以使用這些模組來同時進行問答與摘要，甚至將 structured queries 與 unstructured queries 結合使用。

**Core Module Resources**

- [Query engine](/python/framework/module_guides/deploying/query_engine/)
- [Agents](/python/framework/module_guides/deploying/agents/)
- [Router](/python/framework/module_guides/querying/router/)

**Detailed Guide Resources**

- [Sub-Question Query Engine](https://developers.llamaindex.ai/python/examples/query_engine/sub_question_query_engine/index.md)
- [Joint QA-Summary](https://developers.llamaindex.ai/python/examples/query_engine/jointqasummary/index.md)
- [Router Query Engine](https://developers.llamaindex.ai/python/examples/query_engine/routerqueryengine/index.md)
- [OpenAI Agent Cookbook](https://developers.llamaindex.ai/python/examples/agent/openai_agent_query_cookbook/index.md)

## Reranking Retrieved Nodes for Precision

#### Motivation

Dense retrievers 和 hybrid retrievers 是為了 recall 而調校的；它們會回傳在語義上與查詢接近的候選結果，但 top-1 不一定是最相關的。在生產環境中，這會表現為「retrieval 看起來沒錯，但模型回答的問題仍然錯誤」。Reranker 透過對 top-`k` 候選結果執行更強大但較慢的模型，並在將其傳送到 LLM 之前重新排序，來解決這個問題。

#### 關鍵技術

Retrieve 一組較寬的候選集（例如 `similarity_top_k=10-20`），然後 rerank 到較小的 `top_n` (3–5)。選項依成本排序如下：

1. 透過 [`SentenceTransformerRerank`](/python/framework/module_guides/querying/node_postprocessors/node_postprocessors/#sentencetransformerrerank) 使用 Local cross-encoder，這是建議的預設選項。不需要 API key，且運行在與 embeddings 相同的基礎設施上。為了速度可使用 `cross-encoder/ms-marco-MiniLM-L6-v2`，若需要更強的多國語言品質則使用 `Qwen/Qwen3-Reranker-0.6B`。
2. Hosted reranker APIs：`CohereRerank`, `JinaRerank`, `VoyageAIRerank`, `MixedbreadAIRerank`。配置簡單，無需管理基礎設施，但會增加單次查詢的延遲與成本。
3. LLM-as-reranker：`LLMRerank`, `RankGPTRerank`, `RankLLMRerank`。品質最強，成本最高。僅限於準確度優先於成本的生產流程。

請參閱 [rerankers overview](/python/framework/module_guides/models/rerankers/) 查看決策樹，以及 [node postprocessors guide](/python/framework/module_guides/querying/node_postprocessors/node_postprocessors/) 查看完整的整合清單。

## Optimize Context Embeddings

#### Motivation

這與上述「將用於 retrieval 與 synthesis 的 chunks 解耦」的動機相關。我們希望確保 embeddings 已針對您的特定資料集進行優化，以實現更好的 retrieval。預訓練模型可能無法捕捉到與您的使用情境相關的關鍵資料特性。

### Key Techniques除了上述部分技巧外，我們也可以嘗試對 embedding model 進行微調。事實上，我們可以使用無標記的方式，在非結構化文本語料庫上完成此操作。

請參閱我們的指南：

- [Embedding 微調指南](https://developers.llamaindex.ai/python/examples/finetuning/embeddings/finetune_embedding/index.md)