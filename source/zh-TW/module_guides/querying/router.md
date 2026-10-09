---
title: "路由器"
---

## 概念

Router 是接收使用者查詢和一組「選擇」（由 metadata 定義）的模組，並回傳一個或多個被選定的選擇。

它們可以單獨使用（作為「selector modules」），或用作 query engine 或 retriever（例如，在其他 query engine/retriever 之上）。

它們是簡單但強大的模組，使用 LLMs 進行決策能力。它們可用於以下使用案例及更多：

- 在多樣化的資料來源中選擇正確的資料來源
- 決定是否進行摘要（例如，使用 summary index query engine）或語義搜尋（例如，使用 vector index query engine）
- 決定是否一次嘗試一堆選擇並組合結果（使用 multi-routing capabilities）。

核心 router 模組存在以下形式：

- LLM selectors 將選擇作為文字匯入 prompt，並使用 LLM text completion endpoint 進行決策
- Pydantic selectors 將選擇作為 Pydantic schemas 傳遞給 function calling endpoint，並回傳 Pydantic objects

## 使用模式

以下提供一個使用我們的 router 模組作為 query engine 部分的簡單範例。

```
from llama_index.core.query_engine import RouterQueryEngine
from llama_index.core.selectors import PydanticSingleSelector
from llama_index.core.tools import QueryEngineTool




list_tool = QueryEngineTool.from_defaults(
    query_engine=list_query_engine,
    description="Useful for summarization questions related to the data source",
)
vector_tool = QueryEngineTool.from_defaults(
    query_engine=vector_query_engine,
    description="Useful for retrieving specific context related to the data source",
)


query_engine = RouterQueryEngine(
    selector=PydanticSingleSelector.from_defaults(),
    query_engine_tools=[
        list_tool,
        vector_tool,
    ],
)
query_engine.query("<query>")
```

## 使用模式

定義一個「selector」是定義 router 的核心。

您可以輕鬆地將我們的 router 用作 query engine 或 retriever。在這些情況下，router 將負責「選擇」要將使用者查詢導向的 query engine 或 retriever。

我們也強調了我們的 `ToolRetrieverRouterQueryEngine` 用於檢索增強路由（retrieval-augmented routing）- 這是選擇的集合本身可能非常大，可能需要被索引的情況。**注意**：這是一個 beta 功能。

我們也強調了將我們的 router 作為獨立模組使用。

## 定義 selector

以下提供了一些使用 LLM 和 Pydantic 基於單一/多重 selector 的範例：

```
from llama_index.core.selectors import LLMSingleSelector, LLMMultiSelector
from llama_index.core.selectors import (
    PydanticMultiSelector,
    PydanticSingleSelector,
)


# pydantic selectors feed in pydantic objects to a function calling API
# single selector (pydantic)
selector = PydanticSingleSelector.from_defaults()
# multi selector (pydantic)
selector = PydanticMultiSelector.from_defaults()


# LLM selectors use text completion endpoints
# single selector (LLM)
selector = LLMSingleSelector.from_defaults()
# multi selector (LLM)
selector = LLMMultiSelector.from_defaults()
```

## 作為 Query Engine 使用

`RouterQueryEngine` 在其他 query engine 之上作為 tools 組成。

```
from llama_index.core.query_engine import RouterQueryEngine
from llama_index.core.selectors import PydanticSingleSelector
from llama_index.core.selectors.pydantic_selectors import Pydantic
from llama_index.core.tools import QueryEngineTool
from llama_index.core import VectorStoreIndex, SummaryIndex


# define query engines
...


# initialize tools
list_tool = QueryEngineTool.from_defaults(
    query_engine=list_query_engine,
    description="Useful for summarization questions related to the data source",
)
vector_tool = QueryEngineTool.from_defaults(
    query_engine=vector_query_engine,
    description="Useful for retrieving specific context related to the data source",
)


# initialize router query engine (single selection, pydantic)
query_engine = RouterQueryEngine(
    selector=PydanticSingleSelector.from_defaults(),
    query_engine_tools=[
        list_tool,
        vector_tool,
    ],
)
query_engine.query("<query>")
```

## 作為 Retriever 使用

同樣地，`RouterRetriever` 在其他 retrievers 之上作為 tools 組成。以下提供一個範例：

```
from llama_index.core.retrievers import RouterRetriever
from llama_index.core.selectors import PydanticSingleSelector
from llama_index.core.tools import RetrieverTool


# define indices
...


# define retrievers
vector_retriever = vector_index.as_retriever()
keyword_retriever = keyword_index.as_retriever()


# initialize tools
vector_tool = RetrieverTool.from_defaults(
    retriever=vector_retriever,
    description="Useful for retrieving specific context from Paul Graham essay on What I Worked On.",
)
keyword_tool = RetrieverTool.from_defaults(
    retriever=keyword_retriever,
    description="Useful for retrieving specific context from Paul Graham essay on What I Worked On (using entities mentioned in query)",
)


# define retriever
retriever = RouterRetriever(
    selector=PydanticSingleSelector.from_defaults(llm=llm),
    retriever_tools=[
        list_tool,
        vector_tool,
    ],
)
```

## 作為獨立模組使用 selector

您可以將 selectors 用作獨立模組。將 choices 定義為 `ToolMetadata` 的列表或字串的列表。

```
from llama_index.core.tools import ToolMetadata
from llama_index.core.selectors import LLMSingleSelector




# choices as a list of tool metadata
choices = [
    ToolMetadata(description="description for choice 1", name="choice_1"),
    ToolMetadata(description="description for choice 2", name="choice_2"),
]


# choices as a list of strings
choices = [
    "choice 1 - description for choice 1",
    "choice 2: description for choice 2",
]


selector = LLMSingleSelector.from_defaults()
selector_result = selector.select(
    choices, query="What's revenue growth for IBM in 2007?"
)
print(selector_result.selections)
```

更多範例：

- [Router Query Engine](https://developers.llamaindex.ai/python/examples/query_engine/routerqueryengine/index.md)
- [Retriever Router Query Engine](https://developers.llamaindex.ai/python/examples/query_engine/retrieverrouterqueryengine/index.md)
- [SQL Router Query Engine](https://developers.llamaindex.ai/python/examples/query_engine/sqlrouterqueryengine/index.md)
- [Router Retriever](https://developers.llamaindex.ai/python/examples/retrievers/router_retriever/index.md)