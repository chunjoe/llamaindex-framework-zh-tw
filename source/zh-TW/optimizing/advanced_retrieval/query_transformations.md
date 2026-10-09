---
title: "查詢轉換"
---

LlamaIndex 讓您能針對索引結構執行 *query transformations*。Query transformations 是將一個 query 轉換為另一個 query 的模組。它們可以是**單步驟 (single-step)**，即在針對索引執行 query 之前，轉換程序僅執行一次。

它們也可以是**多步驟 (multi-step)**，例如：

1. 轉換 query 並針對索引執行，
2. 取得回應。
3. 以循序方式轉換並執行後續的 query。

我們在下方詳細列出部分 query transformations。

#### 使用場景

Query transformations 有多種使用場景：

- 將初始 query 轉換為更容易進行 embedding 的形式（例如 HyDE）
- 將初始 query 轉換為更容易從資料中獲得答案的子問題（單步驟 query decomposition）
- 將初始 query 分解為多個可獨立回答的子問題（多步驟 query decomposition）

### HyDE (Hypothetical Document Embeddings)

[HyDE](http://boston.lti.cs.cmu.edu/luyug/HyDE/HyDE.pdf) 是一種技術，在給定自然語言 query 時，會先生成一個假設性的 document/答案。接著使用這個假設性的 document 進行 embedding 查找，而非直接使用原始 query。

若要使用 HyDE，請參考下方的程式碼範例。

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core.indices.query.query_transform.base import (
    HyDEQueryTransform,
)
from llama_index.core.query_engine import TransformQueryEngine


# load documents, build index
documents = SimpleDirectoryReader("../paul_graham_essay/data").load_data()
index = VectorStoreIndex(documents)


# run query with HyDE query transform
query_str = "what did paul graham do after going to RISD"
hyde = HyDEQueryTransform(include_original=True)
query_engine = index.as_query_engine()
query_engine = TransformQueryEngine(query_engine, query_transform=hyde)
response = query_engine.query(query_str)
print(response)
```

請參閱我們的 [範例 notebook](https://github.com/jerryjliu/llama_index/blob/main/docs/examples/query_transformations/HyDEQueryTransformDemo.ipynb) 以獲取完整指南。

### Multi-分步查詢轉換

Multi-step query transformations 是對現有單步驟 query transformation 方法的泛化。

針對一個初始的複雜 query，系統會將其轉換並針對索引執行，隨後取得回應。根據該回應（以及先前的回應）與 query，系統可能會針對索引提出後續問題。此技術允許針對單一知識源執行 query，直到該 query 滿足所有問題為止。

下方為範例圖片。

![](/assets/d0045278f187.png)

以下是對應的程式碼範例。

```
from llama_index.core.indices.query.query_transform.base import (
    StepDecomposeQueryTransform,
)


# gpt-4
step_decompose_transform = StepDecomposeQueryTransform(llm, verbose=True)


query_engine = index.as_query_engine()
query_engine = MultiStepQueryEngine(
    query_engine, query_transform=step_decompose_transform
)


response = query_engine.query(
    "Who was in the first batch of the accelerator program the author started?",
)
print(str(response))
```

請參閱我們的 [範例 notebook](https://github.com/jerryjliu/llama_index/blob/main/examples/vector_indices/SimpleIndexDemo-multistep.ipynb) 以獲取完整指南。

- [HyDE Query Transform](https://developers.llamaindex.ai/python/examples/query_transformations/hydequerytransformdemo/index.md)
- [Multistep Query](https://developers.llamaindex.ai/python/examples/query_transformations/simpleindexdemo-multistep/index.md)