---
title: "Baidu VectorDB"
---

> [Baidu VectorDB](https://cloud.baidu.com/product/vdb.html) 是一個強大的企業級分散式資料庫服務，由百度智能雲精心開發和完全管理。它以其在儲存、檢索和分析多維度 vector data 方面的卓越能力而脫穎而出。VectorDB 的核心是基於百度專有的 “Mochow” vector database kernel 運作，這確保了高性能、高可用性和安全性，同時具備卓越的可擴展性和使用者友好性。

> 此資料庫服務支援多種索引類型和相似度計算方法，以滿足各種使用場景的需求。VectorDB 的一個突出特點是其能夠管理高達 100 億的巨大 vector 規模，同時保持令人印象深刻的查詢效能，能夠以毫秒級的查詢延遲支援每秒數百萬次查詢 (QPS)。

**本筆筆記展示了 BaiduVectorDB 作為 Vector Store 的基本用法 LlamaIndex。**

要運行，您需要有一個 [Database instance.](https://cloud.baidu.com/doc/VDB/s/hlrsoazuf)

## 設定

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-vector-stores-baiduvectordb
```

```
!pip install llama-index
```

```
!pip install pymochow
```

```
from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
)
from llama_index.vector_stores.baiduvectordb import (
    BaiduVectorDB,
    TableParams,
    TableField,
)
import pymochow
```

### 請提供 OpenAI access key

為了使用 OpenAI 的 embeddings，您需要提供一個 OpenAI API Key：

```
import openai


OPENAI_API_KEY = getpass.getpass("OpenAI API Key:")
openai.api_key = OPENAI_API_KEY
```

## 下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

## 建立和填充 Vector Store

您將從本地檔案載入一些 Paul Graham 的文章並將它們儲存到 Baidu VectorDB 中。

```
# load documents
documents = SimpleDirectoryReader("./data/paul_graham").load_data()
print(f"Total documents: {len(documents)}")
print(f"First document, id: {documents[0].doc_id}")
print(f"First document, hash: {documents[0].hash}")
print(
    f"First document, text ({len(documents[0].text)} characters):\n{'='*20}\n{documents[0].text[:360]} ..."
)
```

### 初始化 Baidu VectorDB

建立 vector store 意味著如果尚不存在，則建立底層資料庫 collection：

```
vector_store = BaiduVectorDB(
    endpoint="http://192.168.X.X",
    api_key="*******",
    table_params=TableParams(dimension=1536, drop_exists=True),
)
```

現在將此 store 包裝成一個 `index` LlamaIndex abstraction 以便後續查詢：

```
storage_context = StorageContext.from_defaults(vector_store=vector_store)


index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

請注意，上述 `from_documents` 呼叫同時執行多項操作：它將輸入 documents 拆分成可管理的區塊 (“nodes”)，為每個 node 計算 embedding vectors，並將它們全部儲存在 Baidu VectorDB 中。

## 查詢 store

### 基本查詢

```
query_engine = index.as_query_engine()
response = query_engine.query("Why did the author choose to work on AI?")
print(response)
```

### 基於 MMR 的查詢

MMR (maximal marginal relevance) 方法旨在從 store 中檢索同時與查詢相關，但彼此之間差異最大的文本區塊，目的是為最終答案的建構提供更廣泛的上下文：

```
query_engine = index.as_query_engine(vector_store_query_mode="mmr")
response = query_engine.query("Why did the author choose to work on AI?")
print(response)
```

## 連接到現有的 store

由於此 store 由 Baidu VectorDB 支援，它在定義上是持久性的。因此，如果您想連接到先前建立和填充過的 store，請按照以下方式操作：

```
vector_store = BaiduVectorDB(
    endpoint="http://192.168.X.X",
    api_key="*******",
    table_params=TableParams(dimension=1536, drop_exists=False),
)


# Create index (from preexisting stored vectors)
new_index_instance = VectorStoreIndex.from_vector_store(
    vector_store=new_vector_store
)


# now you can do querying, etc:
query_engine = index.as_query_engine(similarity_top_k=5)
response = query_engine.query(
    "What did the author study prior to working on AI?"
)
print(response)
```

## Metadata 篩選

Baidu VectorDB vector store 支援在查詢時以精確匹配 `key=value` 對的形式進行 metadata 篩選。以下儲存格在一個全新的 collection 上運行，展示了此功能。

在此演示中，為了簡潔起見，載入單一來源 document（`../data/paul_graham/paul_graham_essay.txt` 文本檔案）。儘管如此，您可以在 document 上附加自訂 metadata，以說明如何根據附加到 documents 的 metadata 來限制查詢。

```
filter_fields = [
    TableField(name="source_type"),
]


md_storage_context = StorageContext.from_defaults(
    vector_store=BaiduVectorDB(
        endpoint="http://192.168.X.X",
        api_key="="*******",",
        table_params=TableParams(
            dimension=1536, drop_exists=True, filter_fields=filter_fields
        ),
    )
)




def my_file_metadata(file_name: str):
    """Depending on the input file name, associate a different metadata."""
    if "essay" in file_name:
        source_type = "essay"
    elif "dinosaur" in file_name:
        # this (unfortunately) will not happen in this demo
        source_type = "dinos"
    else:
        source_type = "other"
    return {"source_type": source_type}




# Load documents and build index
md_documents = SimpleDirectoryReader(
    "../data/paul_graham", file_metadata=my_file_metadata
).load_data()
md_index = VectorStoreIndex.from_documents(
    md_documents, storage_context=md_storage_context
)
```

```
from llama_index.core.vector_stores import MetadataFilter, MetadataFilters
```

```
md_query_engine = md_index.as_query_engine(
    filters=MetadataFilters(
        filters=[MetadataFilter(key="source_type", value="essay")]
    )
)
md_response = md_query_engine.query(
    "How long it took the author to write his thesis?"
)
print(md_response.response)
```
