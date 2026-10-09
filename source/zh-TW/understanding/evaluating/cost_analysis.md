---
title: "成本分析"
---

## 概念

每次呼叫 LLM 都會產生一定的費用——例如，OpenAI 的 gpt-3.5-turbo 費用為每 1k tokens $0.002。建立索引和查詢的費用取決於

- 使用的 LLM 的類型
- 使用的資料結構類型
- 建立時使用的參數
- 查詢時使用的參數

每個索引的建立和查詢費用請參閱參考文件中的 TODO。在此期間，我們提供以下資訊：

1. 索引的成本結構的高階概述。
2. 一個您可以直接在 LlamaIndex 中使用的 token 預測器。

### 成本結構概述

#### 沒有 LLM 呼叫的索引

以下索引在建立過程中不需要 LLM 呼叫（成本為 0）：

- `SummaryIndex`
- `SimpleKeywordTableIndex` - 使用 regex keyword extractor 從每個 document 中提取關鍵字
- `RAKEKeywordTableIndex` - 使用 RAKE keyword extractor 從每個 document 中提取關鍵字

#### 有 LLM 呼叫的索引

以下索引在建構期間需要 LLM 呼叫：

- `TreeIndex` - 使用 LLM 對文本進行層級摘要以建立樹狀結構
- `KeywordTableIndex` - 使用 LLM 從每個 document 中提取關鍵字

### 查詢時間

在查詢時間中，為了合成最終答案，總會有 $\ge 1$ 次 LLM 呼叫。有些索引在索引建立和查詢之間存在成本權衡。例如，`SummaryIndex` 可以免費建立，但對摘要索引（不進行過濾或 embedding 查找）進行查詢時，會呼叫 LLM {math}`N` 次。

以下是關於每個索引的一些備註：

- `SummaryIndex`：預設需要 {math}`N` LLM 呼叫，其中 N 是 nodes 的數量。
- `TreeIndex`：預設需要 {math}`\log (N)` LLM 呼叫，其中 N 是葉子 nodes 的數量。
  - 設定 `child_branch_factor=2` 會比預設的 `child_branch_factor=1`（多項式 vs 對數）更昂貴，因為對於每個父級 node，我們遍歷了 2 個子節點而不是僅 1 個。
- `KeywordTableIndex`：預設需要一個 LLM 呼叫來提取查詢關鍵字。
  - 可以使用 `index.as_retriever(retriever_mode="simple")` 或 `index.as_retriever(retriever_mode="rake")` 在您的查詢文本上使用 regex/RAKE keyword extractors。
- `VectorStoreIndex`：預設每個查詢需要一次 LLM 呼叫。如果您增加 `similarity_top_k` 或 `chunk_size`，或更改 `response_mode`，則此數字會增加。

## 使用模式

LlamaIndex 提供 token **predictors** 來預測 LLM 和 embedding 呼叫的 token 使用量。這讓您在進行 1) 索引建構和 2) 索引查詢之前，估計您的成本，在任何相應的 LLM 呼叫發生之前。

Token 是使用 `TokenCountingHandler` 回調來計算的。請參閱 [範例 notebook](https://developers.llamaindex.ai/python/examples/observability/tokencountinghandler/index.md) 以了解設置詳情。

### 使用 MockLLM

要預測 LLM 呼叫的 token 使用量，請匯入並實例化 MockLLM 如下所示。`max_tokens` 參數用作「最壞情況」預測，其中每個 LLM 回應將包含確切該數量的 tokens。如果未指定 `max_tokens`，它將僅預測提示詞。

```
from llama_index.core.llms import MockLLM
from llama_index.core import Settings


# use a mock llm globally
Settings.llm = MockLLM(max_tokens=256)
```

然後您可以在索引建構和查詢期間使用此預測器。

### 使用 MockEmbedding

您也可以使用 `MockEmbedding` 預測 embedding 呼叫的 token 使用量。

```
from llama_index.core import MockEmbedding
from llama_index.core import Settings


# use a mock embedding globally
Settings.embed_model = MockEmbedding(embed_dim=1536)
```

## 使用模式

閱讀 [完整使用模式](/python/framework/understanding/evaluating/cost_analysis/usage_pattern/) 以獲取更多詳情！