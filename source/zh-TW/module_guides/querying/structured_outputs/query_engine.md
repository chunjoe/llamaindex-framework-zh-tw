---
title: "(已棄用) Query Engines + Pydantic Outputs"
---

提示

本指南參考了在 RAG workflow 中提取結構化輸出的棄用方法。請參閱我們的 [structured output starter guide](https://developers.llamaindex.ai/python/examples/structured_outputs/structured_outputs/index.md) 以獲取更多詳細資訊。

使用 `index.as_query_engine()` 及其底層的 `RetrieverQueryEngine`，我們可以支援在沒有額外 LLM 呼叫的情況下支援結構化 pydantic 輸出（與典型的輸出解析器相比）。

每個查詢引擎都支援在 `RetrieverQueryEngine` 中使用以下 `response_mode` 進行整合的結構化回應：

- `refine`
- `compact`
- `tree_summarize`
- `accumulate` (beta，需要額外解析才能轉換為 objects)
- `compact_accumulate` (beta，需要額外解析才能轉換為 objects)

在底層，這會根據您設定的 LLM 使用 `OpenAIPydanitcProgam` 或 `LLMTextCompletionProgram`。如果存在中間的 LLM 回應（即在 `refine` 或包含多個 LLM 呼叫的 `tree_summarize` 期間），則 pydantic 物件會作為一個 JSON 物件注入到下一個 LLM prompt 中。

## 使用模式

首先，您需要定義要提取的物件。

```
from typing import List
from pydantic import BaseModel




class Biography(BaseModel):
    """Data model for a biography."""


    name: str
    best_known_for: List[str]
    extra_info: str
```

然後，您建立您的查詢引擎。

```
query_engine = index.as_query_engine(
    response_mode="tree_summarize", output_cls=Biography
)
```

最後，您可以獲取回應並檢查輸出。

```
response = query_engine.query("Who is Paul Graham?")


print(response.name)
# > 'Paul Graham'
print(response.best_known_for)
# > ['working on Bel', 'co-founding Viaweb', 'creating the programming language Arc']
print(response.extra_info)
# > "Paul Graham is a computer scientist, entrepreneur, and writer. He is best known      for ..."
```

## 模組

詳細的使用方法請參閱下方的 notebook：

- [Structured Outputs 使用一個 Query Engine](https://developers.llamaindex.ai/python/examples/query_engine/pydantic_query_engine/index.md)
- [Structured Outputs 使用一個 Tree Summarize](https://developers.llamaindex.ai/python/examples/response_synthesizers/pydantic_tree_summarize/index.md)