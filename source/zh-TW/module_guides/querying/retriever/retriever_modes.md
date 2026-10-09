---
title: "Retriever 模式"
---

這裡展示了 `retriever_mode` 設定到所選的 retriever 類別的對應關係。

> 注意 `retriever_mode` 對於不同的索引類別可能代表不同的意義。

## 向量索引

指定 `retriever_mode` 沒有任何效果（會被靜默忽略）。`vector_index.as_retriever(...)` 總是回傳一個 VectorIndexRetriever。

## Summary Index

- `default`: SummaryIndexRetriever
- `embedding`: SummaryIndexEmbeddingRetriever
- `llm`: SummaryIndexLLMRetriever

## Tree Index

- `select_leaf`: TreeSelectLeafRetriever
- `select_leaf_embedding`: TreeSelectLeafEmbeddingRetriever
- `all_leaf`: TreeAllLeafRetriever
- `root`: TreeRootRetriever

## Keyword Table Index

- `default`: KeywordTableGPTRetriever
- `simple`: KeywordTableSimpleRetriever
- `rake`: KeywordTableRAKERetriever

## Knowledge Graph Index

- `keyword`: KGTableRetriever
- `embedding`: KGTableRetriever
- `hybrid`: KGTableRetriever

## Document Summary Index

- `llm`: DocumentSummaryIndexLLMRetriever
- `embedding`: DocumentSummaryIndexEmbeddingRetrievers