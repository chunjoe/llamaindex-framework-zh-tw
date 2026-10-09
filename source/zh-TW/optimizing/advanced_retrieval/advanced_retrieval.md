---
title: "進階檢索策略"
---

## 主要進階檢索策略

您可以嘗試多種進階檢索策略，每種策略都有不同的優勢：

- [Reranking](/python/framework/module_guides/models/rerankers/)
- [Recursive retrieval](https://developers.llamaindex.ai/python/examples/query_engine/pdf_tables/recursive_retriever/index.md)
- [Embedded tables](https://developers.llamaindex.ai/python/examples/query_engine/sec_tables/tesla_10q_table/index.md)
- [Small-to-big retrieval](https://developers.llamaindex.ai/python/examples/node_postprocessor/metadatareplacementdemo/index.md)

請參閱完整的 [retrievers module guide](/python/framework/module_guides/querying/retriever/retrievers/)，查看所有檢索策略的詳細清單及其分類。

- 各索引的基本檢索
- 進階檢索與搜尋
- Auto-Retrieval
- Knowledge Graph Retrievers
- Composed/Hierarchical Retrievers
- 以及更多！

更多資源請見下方。

## 查詢轉換

使用者查詢在進入流程（如 query engine、agent 等）之前可以經過轉換。請參閱下方關於 query transformations 的資源：

- [Query Transform Cookbook](https://developers.llamaindex.ai/python/examples/query_transformations/query_transform_cookbook/index.md)
- [Query Transformations Docs](/python/framework/optimizing/advanced_retrieval/query_transformations/)

## Composable Retrievers

每個 retriever 都能檢索並執行其他物件，包括：

- 其他 retrievers
- query engines
- query pipelines
- 其他 nodes

如需更多詳細資訊，請參閱下方指南。

- [Composable Retrievers](https://developers.llamaindex.ai/python/examples/retrievers/composable_retrievers/index.md)

## 第三方資源

以下是關於進階檢索策略的一些第三方資源。

- [DeepMemory (Activeloop)](https://developers.llamaindex.ai/python/examples/retrievers/deep_memory/index.md)
- [Weaviate Hybrid Search](https://developers.llamaindex.ai/python/examples/vector_stores/weaviateindexdemo-hybrid/index.md)
- [Pinecone Hybrid Search](https://developers.llamaindex.ai/python/examples/vector_stores/pineconeindexdemo-hybrid/index.md)
- [Milvus Hybrid Search](https://developers.llamaindex.ai/python/examples/vector_stores/milvushybridindexdemo/index.md)