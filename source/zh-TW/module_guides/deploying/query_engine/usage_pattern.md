---
title: "使用模式"
---

## 開始使用

從 index 建構查詢引擎：

```
query_engine = index.as_query_engine()
```

提示

要了解如何建構 index，請參閱 [索引](/python/framework/module_guides/indexing/)

對您的資料提問

```
response = query_engine.query("Who is Paul Graham?")
```

## 設定查詢引擎

### 高階 (High-Level) API

您只需一行程式碼即可直接從 index 建構和設定查詢引擎：

```
query_engine = index.as_query_engine(
    response_mode="tree_summarize",
    verbose=True,
)
```

> 注意：雖然高階 API 旨在優化易用性，但它*不會*暴露完整的可配置範圍。

請參閱 [**Response Modes**](/python/framework/module_guides/deploying/query_engine/response_modes/) 以查看完整的 response modes 及其功能。

### 低階組合 (Low-Level Composition) API

如果您需要更細緻的控制，可以使用低階組合 API。具體來說，您會明確地建構一個 `QueryEngine` 物件，而不是呼叫 `index.as_query_engine(...)`。

> 注意：您可能需要參考 API 參考資料或範例 notebook。

```
from llama_index.core import VectorStoreIndex, get_response_synthesizer
from llama_index.core.retrievers import VectorIndexRetriever
from llama_index.core.query_engine import RetrieverQueryEngine


# build index
index = VectorStoreIndex.from_documents(documents)


# configure retriever
retriever = VectorIndexRetriever(
    index=index,
    similarity_top_k=2,
)


# configure response synthesizer
response_synthesizer = get_response_synthesizer(
    response_mode="tree_summarize",
)


# assemble query engine
query_engine = RetrieverQueryEngine(
    retriever=retriever,
    response_synthesizer=response_synthesizer,
)


# query
response = query_engine.query("What did the author do growing up?")
print(response)
```

### 串流 (Streaming)

要啟用串流，您只需傳入一個 `streaming=True` flag。

```
query_engine = index.as_query_engine(
    streaming=True,
)
streaming_response = query_engine.query(
    "What did the author do growing up?",
)
streaming_response.print_response_stream()
```

- 閱讀完整的 [streaming guide](/python/framework/module_guides/deploying/query_engine/streaming/)
- 查看一個 [end-to-end example](https://developers.llamaindex.ai/python/examples/customization/streaming/simpleindexdemo-streaming/index.md)

## 定義自訂查詢引擎

您也可以定義自訂查詢引擎。只需繼承 `CustomQueryEngine` class，定義您想要的所有屬性（類似於定義一個 Pydantic class），並實作一個返回 `Response` object 或 string 的 `custom_query` function。

```
from llama_index.core.query_engine import CustomQueryEngine
from llama_index.core.retrievers import BaseRetriever
from llama_index.core import get_response_synthesizer
from llama_index.core.response_synthesizers import BaseSynthesizer




class RAGQueryEngine(CustomQueryEngine):
    """RAG Query Engine."""


    retriever: BaseRetriever
    response_synthesizer: BaseSynthesizer


    def custom_query(self, query_str: str):
        nodes = self.retriever.retrieve(query_str)
        response_obj = self.response_synthesizer.synthesize(query_str, nodes)
        return response_obj
```

請參閱 [自訂 Query Engine 指南](https://developers.llamaindex.ai/python/examples/query_engine/custom_query_engine/index.md) 以獲取更多詳細資訊。