---
title: "使用模式（檢索）"
---

## 使用 `RetrieverEvaluator`

此功能在給定一個 retriever 的情況下，對單一查詢與 ground-truth document 集合進行評估。

標準做法是使用 `from_metrics` 指定一組有效的指標。

```
from llama_index.core.evaluation import RetrieverEvaluator


# define retriever somewhere (e.g. from index)
# retriever = index.as_retriever(similarity_top_k=2)
retriever = ...


retriever_evaluator = RetrieverEvaluator.from_metric_names(
    ["mrr", "hit_rate"], retriever=retriever
)


retriever_evaluator.evaluate(
    query="query", expected_ids=["node_id1", "node_id2"]
)
```

## 建置評估資料集

您可以手動整理一個包含問題與 node ID 的檢索評估資料集。我們也提供使用我們的 `generate_question_context_pairs` 函式對現有文本語料庫進行合成資料集生成：

```
from llama_index.core.evaluation import generate_question_context_pairs


qa_dataset = generate_question_context_pairs(
    nodes, llm=llm, num_questions_per_chunk=2
)
```

回傳結果是一個 `EmbeddingQAFinetuneDataset` 物件（包含 `queries`、`relevant_docs` 和 `corpus`）。

### 整合到 `RetrieverEvaluator`

我們提供一個便利的函式，可以以批次模式對資料集執行 `RetrieverEvaluator`。

```
eval_results = await retriever_evaluator.aevaluate_dataset(qa_dataset)
```

這樣會比您對每個查詢單獨呼叫 `.evaluate` 快得多。