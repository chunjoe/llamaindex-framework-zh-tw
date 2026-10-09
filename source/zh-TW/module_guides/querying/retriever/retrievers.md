---
title: "Retriever 模組"
---

我們正在積極新增更多客製化的檢索指南。在此期間，請參閱 [API References](https://developers.llamaindex.ai/python/framework-api-reference/retrievers/index.md)。

## 索引 Retrievers

請參閱 [the retriever modes](/python/framework/module_guides/querying/retriever/retriever_modes/) 以了解如何從任何給定的 index 中獲取一個 retriever。

如果您想直接匯入對應的 retrievers，請查看我們的 [API reference](https://developers.llamaindex.ai/python/framework-api-reference/retrievers/index.md)。

## 綜合 Retriever 指南

查看我們關於各種 retriever 模組的綜合指南，其中許多涵蓋進階概念（auto-retrieval、routing、ensembling 等）。

### 進階檢索與搜尋

這些指南包含進階的檢索技術。有些是常見的，如 keyword/hybrid search、reranking 等。有些是特定於 LLM + RAG workflows 的，例如 small-to-big 和 auto-merging retrieval。

- [Define Custom Retriever](https://developers.llamaindex.ai/python/examples/query_engine/customretrievers/index.md)
- [BM25 Hybrid Retriever](https://developers.llamaindex.ai/python/examples/retrievers/bm25_retriever/index.md)
- [Simple Query Fusion](https://developers.llamaindex.ai/python/examples/retrievers/simple_fusion/index.md)
- [Reciprocal Rerank Fusion](https://developers.llamaindex.ai/python/examples/retrievers/reciprocal_rerank_fusion/index.md)
- [Auto Merging Retriever](https://developers.llamaindex.ai/python/examples/retrievers/auto_merging_retriever/index.md)
- [Metadata Replacement](https://developers.llamaindex.ai/python/examples/node_postprocessor/metadatareplacementdemo/index.md)
- [Composable Retrievers](https://developers.llamaindex.ai/python/examples/retrievers/composable_retrievers/index.md)

### Auto-Retrieval

這些檢索技術執行**半結構化**查詢，結合 semantic search 與 structured filtering。

- [Auto-Retrieval (with Pinecone)](https://developers.llamaindex.ai/python/examples/vector_stores/pinecone_auto_retriever/index.md)
- [Auto-Retrieval (with Lantern)](https://developers.llamaindex.ai/python/examples/vector_stores/lanternautoretriever/index.md)
- [Auto-Retrieval (with Chroma)](https://developers.llamaindex.ai/python/examples/vector_stores/chroma_auto_retriever/index.md)
- [Auto-Retrieval (with BagelDB)](https://developers.llamaindex.ai/python/examples/vector_stores/bagelautoretriever/index.md)
- [Auto-Retrieval (with Vectara)](https://developers.llamaindex.ai/python/examples/retrievers/vectara_auto_retriever/index.md)
- [Multi-Doc Auto-Retrieval](https://developers.llamaindex.ai/python/examples/query_engine/multi_doc_auto_retrieval/multi_doc_auto_retrieval/index.md)

### Knowledge Graph Retrievers

- [Knowledge Graph RAG Retriever](https://developers.llamaindex.ai/python/examples/query_engine/knowledge_graph_rag_query_engine/index.md)

### Composed Retrievers

這些是建立在其他檢索技術之上的檢索技術，提供更高層級的能力，如 hierarchical retrieval 和 query decomposition。

- [Query Fusion](https://developers.llamaindex.ai/python/examples/retrievers/reciprocal_rerank_fusion/index.md)
- [Recursive Table Retrieval](https://developers.llamaindex.ai/python/examples/query_engine/pdf_tables/recursive_retriever/index.md)
- [Recursive Node Retrieval](https://developers.llamaindex.ai/python/examples/retrievers/recursive_retriever_nodes/index.md)
- [Braintrust](https://developers.llamaindex.ai/python/examples/retrievers/recurisve_retriever_nodes_braintrust/index.md)
- [Router Retriever](https://developers.llamaindex.ai/python/examples/retrievers/router_retriever/index.md)
- [Ensemble Retriever](https://developers.llamaindex.ai/python/examples/retrievers/ensemble_retrieval/index.md)
- [Multi-Doc Auto-Retrieval](https://developers.llamaindex.ai/python/examples/query_engine/multi_doc_auto_retrieval/multi_doc_auto_retrieval/index.md)

### Managed Retrievers

- [Google](https://developers.llamaindex.ai/python/examples/managed/googledemo/index.md)
- [Vectara](https://developers.llamaindex.ai/python/examples/managed/vectarademo/index.md)
- [VideoDB](https://developers.llamaindex.ai/python/examples/retrievers/videodb_retriever/index.md)
- [Amazon Bedrock](https://developers.llamaindex.ai/python/examples/retrievers/bedrock_retriever/index.md)

### 其他 Retrievers

這些指南不完全符合任何一個類別，但仍應予以強調。

- [Multi-Doc Hybrid](https://developers.llamaindex.ai/python/examples/retrievers/multi_doc_together_hybrid/index.md)
- [You Retriever](https://developers.llamaindex.ai/python/examples/retrievers/you_retriever/index.md)
- [Text-to-SQL](https://developers.llamaindex.ai/python/examples/index_structs/struct_indices/sqlindexdemo/index.md)
- [DeepMemory (Activeloop)](https://developers.llamaindex.ai/python/examples/retrievers/deep_memory/index.md)
- [Pathway](https://developers.llamaindex.ai/python/examples/retrievers/pathway_retriever/index.md)