---
title: "Q&A 模式"
---

## 語義搜尋 (Semantic Search)

LlamaIndex 最基本的用法是透過語義搜尋。我們提供一個簡單的記憶體向量儲存 (in-memory vector store) 讓您開始使用，但您也可以選擇使用我們的 [vector store integrations](/python/framework/community/integrations/vector_stores/)：

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader


documents = SimpleDirectoryReader("data").load_data()
index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine()
response = query_engine.query("What did the author do growing up?")
print(response)
```

**教學 (Tutorials)**

- [Starter Tutorial](/python/framework/getting_started/starter_example/)
- [Basic Usage Pattern](/python/framework/module_guides/querying/)

**指南 (Guides)**

- [範例 Notebook](https://developers.llamaindex.ai/python/examples/vector_stores/simpleindexdemo/index.md)

## 摘要 (Summarization)

摘要查詢需要 LLM 迭代處理許多，甚至大多數 documents，才能合成答案。例如，摘要查詢可能如下所示：

- 「這份文本的摘要是什麼？」
- 「請給我關於人 X 與該公司的經歷摘要。」

一般來說，摘要索引適合這種用例。摘要索引預設會遍歷所有資料。

實證上，設定 `response_mode="tree_summarize"` 也會帶來更好的摘要結果。

```
index = SummaryIndex.from_documents(documents)


query_engine = index.as_query_engine(response_mode="tree_summarize")
response = query_engine.query("<summarization_query>")
```

## 對結構化資料的查詢 (Queries over Structured Data)

LlamaIndex 支援對結構化資料的查詢，無論是 Pandas DataFrame 還是 SQL Database。

以下是一些相關資源：

**教學 (Tutorials)**

- [Guide 關於 Text-to-SQL](/python/framework/understanding/putting_it_all_together/structured_data/)

**指南 (Guides)**

- [SQL Guide (Core)](https://developers.llamaindex.ai/python/examples/index_structs/struct_indices/sqlindexdemo/index.md) ([Notebook](https://github.com/jerryjliu/llama_index/blob/main/examples/index_structs/struct_indices/SQLIndexDemo.ipynb))
- [Pandas Demo](https://developers.llamaindex.ai/python/examples/query_engine/pandas_query_engine/index.md) ([Notebook](https://github.com/jerryjliu/llama_index/blob/main/examples/query_engine/pandas_query_engine.ipynb))

## 異質資料的路由 (Routing over Heterogeneous Data)

LlamaIndex 也支援使用 `RouterQueryEngine` 對異質資料來源進行路由——例如，如果您想將查詢「路由」到底層的 Document 或子索引。

要做到這一點，首先在不同的資料來源上建立子索引。然後建構相應的 query engines，並為每個 query engine 提供一個描述以獲取一個 `QueryEngineTool`。

```
from llama_index.core import TreeIndex, VectorStoreIndex
from llama_index.core.tools import QueryEngineTool


...


# define sub-indices
index1 = VectorStoreIndex.from_documents(notion_docs)
index2 = VectorStoreIndex.from_documents(slack_docs)


# define query engines and tools
tool1 = QueryEngineTool.from_defaults(
    query_engine=index1.as_query_engine(),
    description="Use this query engine to do...",
)
tool2 = QueryEngineTool.from_defaults(
    query_engine=index2.as_query_engine(),
    description="Use this query engine for something else...",
)
```

然後，我們對它們定義一個 `RouterQueryEngine`。預設情況下，這會使用一個 `LLMSingleSelector` 作為 router，它會使用 LLM 來根據描述選擇最佳的子索引來路由查詢。

```
from llama_index.core.query_engine import RouterQueryEngine


query_engine = RouterQueryEngine.from_defaults(
    query_engine_tools=[tool1, tool2]
)


response = query_engine.query(
    "In Notion, give me a summary of the product roadmap."
)
```

**指南 (Guides)**

- [Router Query Engine Guide](https://developers.llamaindex.ai/python/examples/query_engine/retrieverrouterqueryengine/index.md)

## 比較/對比查詢 (Compare/Contrast Queries)

您可以在 ComposableGraph 中使用 **query transformation** 模組明確地執行比較/對比查詢。

```
from llama_index.core.query.query_transform.base import DecomposeQueryTransform


decompose_transform = DecomposeQueryTransform(
    service_context.llm, verbose=True
)
```

這個模組將有助於將複雜的查詢分解為對您現有索引結構的更簡單的查詢。

**指南 (Guides)**

- [Query Transformations](/python/framework/optimizing/advanced_retrieval/query_transformations/)

您也可以依賴 LLM 來*推斷*是否要執行比較/對比查詢（請參閱下方的 Multi Document Queries）。

## 多重查詢 (Multi Document Queries)

除了上述描述的明確合成/路由流程外，LlamaIndex 也支援更通用的多 document 查詢。它能透過我們的 `SubQuestionQueryEngine` class 來做到這一點。給定一個查詢，這個 query engine 會在合成最終答案之前，生成一個包含針對子 documents 的子查詢的「query plan」。

要做到這一點，首先為每個 document/data source 定義一個索引，並用一個 `QueryEngineTool` 包裹它（類似於上面）：

```
from llama_index.core.tools import QueryEngineTool


query_engine_tools = [
    QueryEngineTool.from_defaults(
        query_engine=sept_engine,
        name="sept_22",
        description="Provides information about Uber quarterly financials ending September 2022",
    ),
    QueryEngineTool.from_defaults(
        query_engine=june_engine,
        name="june_22",
        description="Provides information about Uber quarterly financials ending June 2022",
    ),
    QueryEngineTool.from_defaults(
        query_engine=march_engine,
        name="march_22",
        description="Provides information about Uber quarterly financials ending March 2022",
    ),
]
```

然後，我們對這些工具定義一個 `SubQuestionQueryEngine`：

```
from llama_index.core.query_engine import SubQuestionQueryEngine


query_engine = SubQuestionQueryEngine.from_defaults(
    query_engine_tools=query_engine_tools
)
```

這個 query engine 可以執行任意數量的子查詢，針對任何 query engine tools 的任何子集，然後合成最終答案。這使其特別適合在 documents 之間進行比較/對比查詢，以及與特定 document 相關的查詢。

**指南 (Guides)**

- [Sub Question Query Engine (Intro)](https://developers.llamaindex.ai/python/examples/query_engine/sub_question_query_engine/index.md)
- [10Q Analysis (Uber)](https://developers.llamaindex.ai/python/examples/usecases/10k_sub_question/index.md)
- [10K Analysis (Uber and Lyft)](https://developers.llamaindex.ai/python/examples/usecases/10k_sub_question/index.md)

## 多步驟查詢 (Multi-Step Queries)

LlamaIndex 也支援迭代的多步驟查詢。給定一個複雜的查詢，將其分解為初始的子問題，然後根據回傳的答案依序生成子問題，直到返回最終答案為止。舉例來說，對於問題「作者開始的加速器計畫的第一批成員是誰？」，該模組會先將查詢分解為一個更簡單的初始問題「作者開始的加速器計畫是什麼？」，查詢 index，然後再提出後續問題。

**指南**

- [Query Transformations](/python/framework/optimizing/advanced_retrieval/query_transformations/)
- [Multi-Step Query Decomposition](https://developers.llamaindex.ai/python/examples/query_transformations/hydequerytransformdemo/index.md)

## 時間序列查詢 (Temporal Queries)

LlamaIndex 可以支援需要理解時間的查詢。它有兩種方式可以做到：

- 判斷查詢是否需要利用 nodes（prev/next relationships）之間的時間關係來檢索額外的資料以回答問題。
- 依據時間排序並過濾過時的資料。

**指南**

- [Postprocessing Guide](/python/framework/module_guides/querying/node_postprocessors/node_postprocessors/)
- [Prev/Next Postprocessing](https://developers.llamaindex.ai/python/examples/node_postprocessor/prevnextpostprocessordemo/index.md)
- [Recency Postprocessing](https://developers.llamaindex.ai/python/examples/node_postprocessor/recencypostprocessordemo/index.md)

## 額外資源

- [A Guide 至 擷取術語與 Definitions](/python/framework/understanding/putting_it_all_together/q_and_a/terms_definitions_tutorial/)
- [SEC 10k Analysis](https://medium.com/@jerryjliu98/how-unstructured-and-llamaindex-can-help-bring-the-power-of-llms-to-your-own-data-3657d063e30d)