---
title: "Milvus 向量資料庫 - 元數據過濾器"
---

本筆記示範如何將 Milvus 的 vector store 應用於 LlamaIndex，重點關注 metadata 過濾功能。您將學會如何使用 metadata 為 documents 建立索引，使用 LlamaIndex 的內建 metadata 篩選器執行 vector 搜尋，並將 Milvus 的原生篩選表達式應用於 vector store。

在本筆記結束時，您將了解如何利用 Milvus 的篩選功能，根據 document 的 metadata 來縮小搜尋結果。

## 先決條件

**安裝依賴項**

在開始之前，請確保已安裝以下依賴項：

```
! pip install llama-index-vector-stores-milvus llama-index
```

> 如果您使用 Google Colab，您可能需要**重新啟動 runtime**（導航至介面頂部的「Runtime」選單，並從下拉選單中選擇「Restart session」）。

**設定帳戶**

本教學使用 OpenAI 進行文字嵌入和答案生成。您需要準備 [OpenAI API key](https://platform.openai.com/api-keys)。

```
import openai


openai.api_key = "sk-"
```

要使用 Milvus vector store，請指定您的 Milvus server `URI`（可選地使用 `TOKEN`）。要啟動 Milvus server，您可以遵循 [Milvus 安裝指南](https://milvus.io/docs/install-overview.md) 設定 Milvus server，或直接嘗試 [Zilliz Cloud](https://docs.zilliz.com/docs/register-with-zilliz-cloud) 進行免費試用。

```
URI = "./milvus_filter_demo.db"  # Use Milvus-Lite for demo purpose
# TOKEN = ""
```

**準備資料**

在此範例中，我們將使用幾本書籍，它們的標題相似或相同，但 metadata 不同（作者、類型和出版年份）作為範例資料。這將幫助展示 Milvus 如何根據 vector 相似度和 metadata 屬性來篩選和檢索 documents。

```
from llama_index.core.schema import TextNode


nodes = [
    TextNode(
        text="Life: A User's Manual",
        metadata={
            "author": "Georges Perec",
            "genre": "Postmodern Fiction",
            "year": 1978,
        },
    ),
    TextNode(
        text="Life and Fate",
        metadata={
            "author": "Vasily Grossman",
            "genre": "Historical Fiction",
            "year": 1980,
        },
    ),
    TextNode(
        text="Life",
        metadata={
            "author": "Keith Richards",
            "genre": "Memoir",
            "year": 2010,
        },
    ),
    TextNode(
        text="The Life",
        metadata={
            "author": "Malcolm Knox",
            "genre": "Literary Fiction",
            "year": 2011,
        },
    ),
]
```


## 建置索引

在本節中，我們將使用預設的嵌入模型（OpenAI 的 `text-embedding-ada-002`）在 Milvus 中儲存範例資料。標題將轉換為 text embeddings 並儲存在 dense embedding field 中，而所有 metadata 將儲存在 scalar fields 中。

```
from llama_index.vector_stores.milvus import MilvusVectorStore
from llama_index.core import StorageContext, VectorStoreIndex




vector_store = MilvusVectorStore(
    uri=URI,
    # token=TOKEN,
    collection_name="test_filter_collection",  # Change collection name here
    dim=1536,  # Vector dimension depends on the embedding model
    overwrite=True,  # Drop collection if exists
)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex(nodes, storage_context=storage_context)
```

```
2025-04-22 08:31:09,871 [DEBUG][_create_connection]: Created new connection using: 19675caa8f894772b3db175b65d0063a (async_milvus_client.py:547)
```


## Metadata 篩選器

在本節中，我們將將 LlamaIndex 的內建 metadata 篩選器和條件應用於 Milvus 搜尋。

**定義 metadata 篩選器**

```
from llama_index.core.vector_stores import (
    MetadataFilter,
    MetadataFilters,
    FilterOperator,
)


filters = MetadataFilters(
    filters=[
        MetadataFilter(
            key="year", value=2000, operator=FilterOperator.GT
        )  # year > 2000
    ]
)
```


**使用篩選器從 vector store 檢索**

```
retriever = index.as_retriever(filters=filters, similarity_top_k=5)
result_nodes = retriever.retrieve("Books about life")
for node in result_nodes:
    print(node.text)
    print(node.metadata)
    print("\n")
```

```
The Life
{'author': 'Malcolm Knox', 'genre': 'Literary Fiction', 'year': 2011}




Life
{'author': 'Keith Richards', 'genre': 'Memoir', 'year': 2010}
```


### 多重 Metadata 篩選器

您也可以組合多個 metadata 篩選器來建立更複雜的查詢。LlamaIndex 支援 `AND` 和 `OR` 條件來組合篩選器。這使得能夠根據 metadata 屬性更精確、更靈活地檢索 documents。

**條件 `AND`**

嘗試一個篩選範例，用於篩選出版於 1979 年到 2010 年之間的書籍（具體來說，其中 1979 < year ≤ 2010）：

```
from llama_index.core.vector_stores import FilterCondition


filters = MetadataFilters(
    filters=[
        MetadataFilter(
            key="year", value=1979, operator=FilterOperator.GT
        ),  # year > 1979
        MetadataFilter(
            key="year", value=2010, operator=FilterOperator.LTE
        ),  # year <= 2010
    ],
    condition=FilterCondition.AND,
)


retriever = index.as_retriever(filters=filters, similarity_top_k=5)
result_nodes = retriever.retrieve("Books about life")
for node in result_nodes:
    print(node.text)
    print(node.metadata)
    print("\n")
```

```
Life and Fate
{'author': 'Vasily Grossman', 'genre': 'Historical Fiction', 'year': 1980}




Life
{'author': 'Keith Richards', 'genre': 'Memoir', 'year': 2010}
```


**條件 `OR`**

嘗試另一個範例，用於篩選由 Georges Perec 或 Keith Richards 撰寫的書籍：

```
filters = MetadataFilters(
    filters=[
        MetadataFilter(
            key="author", value="Georges Perec", operator=FilterOperator.EQ
        ),  # author is Georges Perec
        MetadataFilter(
            key="author", value="Keith Richards", operator=FilterOperator.EQ
        ),  # author is Keith Richards
    ],
    condition=FilterCondition.OR,
)


retriever = index.as_retriever(filters=filters, similarity_top_k=5)
result_nodes = retriever.retrieve("Books about life")
for node in result_nodes:
    print(node.text)
    print(node.metadata)
    print("\n")
```

```
Life
{'author': 'Keith Richards', 'genre': 'Memoir', 'year': 2010}




Life: A User's Manual
{'author': 'Georges Perec', 'genre': 'Postmodern Fiction', 'year': 1978}
```


## 使用 Milvus 的 Keyword Arguments

除了內建的篩選功能外，您還可以透過 `string_expr` keyword argument 使用 Milvus 的原生篩選表達式。這允許您在搜尋操作期間直接將特定的篩選表達式傳遞給 Milvus，超越標準的 metadata 篩選，以存取 Milvus 的進階篩選能力。

Milvus 提供強大且靈活的篩選選項，可用於精確查詢您的 vector data：

- 基本運算子：比較運算子、範圍篩選器、算術運算子和邏輯運算子
- 篩選表達式模板：常用篩選場景的預定義模式
- 專門運算子：針對 JSON 或 array fields 的資料類型特定運算子

有關 Milvus 篩選表達式的完整文件和範例，請參閱 [Milvus Filtering](https://milvus.io/docs/boolean.md) 的官方文件。

```
retriever = index.as_retriever(
    vector_store_kwargs={
        "string_expr": "genre like '%Fiction'",
    },
    similarity_top_k=5,
)
result_nodes = retriever.retrieve("Books about life")
for node in result_nodes:
    print(node.text)
    print(node.metadata)
    print("\n")
```

```
The Life
{'author': 'Malcolm Knox', 'genre': 'Literary Fiction', 'year': 2011}




Life and Fate
{'author': 'Vasily Grossman', 'genre': 'Historical Fiction', 'year': 1980}




Life: A User's Manual
{'author': 'Georges Perec', 'genre': 'Postmodern Fiction', 'year': 1978}
```
