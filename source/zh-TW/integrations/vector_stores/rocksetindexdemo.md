---
title: "Rockset Vector Store"
---

Rockset 作為即時搜尋與分析資料庫，利用 indexing 來提供可擴展且高效的個人化、產品搜尋、semantic search、chatbot 應用程式等功能。由於 Rockset 專為即時設計，您可以基於不斷更新的串流資料建構這些響應式的應用程式。透過將 Rockset 與 LlamaIndex 整合，您可以輕鬆地在您自己的即時資料上使用 LLMs 來建立可投入生產的 vector search 應用程式。

我們將介紹如何將 Rockset 作為 vector store 在 LlamaIndex 中使用。

## 教學

在這個範例中，我們將使用 OpenAI 的 `text-embedding-ada-002` 模型來生成 embeddings，並使用 Rockset 作為 vector store 來儲存 embeddings。我們將從檔案中擷取文字並對內容提出問題。

### 設定環境

1. 在 Rockset console 中，使用 [Write API](https://rockset.com/docs/write-api/) 作為來源，從中建立一個 [collection](https://rockset.com/docs/collections)。將您的 collection 名稱為 `llamaindex_demo`。配置以下 [ingest transformation](https://rockset.com/docs/ingest-transformation) 並使用 [`VECTOR_ENFORCE`](https://rockset.com/docs/vector-functions) 來定義您的 embeddings field，以利用效能和儲存優化：

```
SELECT
    _input.* EXCEPT(_meta),
    VECTOR_ENFORCE(
        _input.embedding,
        1536,
        'float'
    ) as embedding
FROM _input
```

2. 在 Rockset console 中建立一個 [API key](https://rockset.com/docs/iam)，並設定 `ROCKSET_API_KEY` environment variable。找到您的 API server [這裡](http://rockset.com/docs/rest-api#introduction) 並設定 `ROCKSET_API_SERVER` environment variable。設定 `OPENAI_API_KEY` environment variable。

3. 安裝依賴項。

終端機視窗

```
pip3 install llama_index rockset
```

4. LlamaIndex 允許您從多種來源擷取資料。在此範例中，我們將讀取名為 `constitution.txt` 的文字檔案，該檔案是美國憲法的逐字稿，可從 [這裡](https://www.archives.gov/founding-docs/constitution-transcript) 找到。

### 資料擷取

使用 LlamaIndex 的 `SimpleDirectoryReader` class 將文字檔案轉換為 `Document` 物件的列表。

```
%pip install llama-index-llms-openai
%pip install llama-index-vector-stores-rocksetdb
```

```
from llama_index.core import SimpleDirectoryReader


docs = SimpleDirectoryReader(
    input_files=["{path to}/consitution.txt"]
).load_data()
```

建立 LLM 和 service context。

```
from llama_index.core import Settings
from llama_index.llms.openai import OpenAI


Settings.llm = OpenAI(temperature=0.8, model="gpt-3.5-turbo")
```

建立 vector store 和 storage context。

```
from llama_index.core import StorageContext
from llama_index.vector_stores.rocksetdb import RocksetVectorStore


vector_store = RocksetVectorStore(collection="llamaindex_demo")
storage_context = StorageContext.from_defaults(vector_store=vector_store)
```

將 documents 添加到 `llamaindex_demo` collection 中並建立一個 index。

```
from llama_index.core import VectorStoreIndex


index = VectorStoreIndex.from_documents(
    docs,
    storage_context=storage_context,
)
```

### 查詢

對您的 document 提出問題並生成回應。

```
response = index.as_query_engine().query("What is the duty of the president?")


print(str(response))
```

執行程式。

```
$ python3 main.py
The duty of the president is to faithfully execute the Office of President of the United States, preserve, protect and defend the Constitution of the United States, serve as the Commander in Chief of the Army and Navy, grant reprieves and pardons for offenses against the United States (except in cases of impeachment), make treaties and appoint ambassadors and other public ministers, take care that the laws be faithfully executed, and commission all the officers of the United States.
```

## Metadata Filtering

Metadata filtering 允許您檢索符合特定篩選條件的相關 documents。

1. 將 nodes 添加到您的 vector store 並建立一個 index。

```
from llama_index.vector_stores.rocksetdb import RocksetVectorStore
from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.core.vector_stores.types import NodeWithEmbedding
from llama_index.core.schema import TextNode


nodes = [
    NodeWithEmbedding(
        node=TextNode(
            text="Apples are blue",
            metadata={"type": "fruit"},
        ),
        embedding=[],
    )
]
index = VectorStoreIndex(
    nodes,
    storage_context=StorageContext.from_defaults(
        vector_store=RocksetVectorStore(collection="llamaindex_demo")
    ),
)
```

2. 定義 metadata filters。

```
from llama_index.core.vector_stores import ExactMatchFilter, MetadataFilters


filters = MetadataFilters(
    filters=[ExactMatchFilter(key="type", value="fruit")]
)
```

3. 檢索符合篩選條件的相關 documents。

```
retriever = index.as_retriever(filters=filters)
retriever.retrieve("What colors are apples?")
```

## 從現有 collection 建立 Index

您可以利用現有 collection 的資料建立 index。

```
from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.rocksetdb import RocksetVectorStore


vector_store = RocksetVectorStore(collection="llamaindex_demo")


index = VectorStoreIndex.from_vector_store(vector_store)
```

## 從新 collection 建立 Index

您也可以建立一個新的 Rockset collection 作為 vector store。

```
from llama_index.vector_stores.rocksetdb import RocksetVectorStore


vector_store = RocksetVectorStore.with_new_collection(
    collection="llamaindex_demo",  # name of new collection
    dimensions=1536,  # specifies length of vectors in ingest tranformation (optional)
    # other RocksetVectorStore args
)


index = VectorStoreIndex(
    nodes,
    storage_context=StorageContext.from_defaults(vector_store=vector_store),
)
```

## 設定

- **collection**: 要查詢的 collection 名稱（必填）。

```
RocksetVectorStore(collection="my_collection")
```

- **workspace**: 包含該 collection 的 workspace 名稱。預設為 `"commons"`。

```
RocksetVectorStore(worksapce="my_workspace")
```

- **api\_key**: 用於驗證 Rockset 請求的 API key。如果傳入 `client`，則忽略此項。預設為 `ROCKSET_API_KEY` environment variable。

```
RocksetVectorStore(api_key="<my key>")
```

- **api\_server**: 用於 Rockset 請求的 API server。如果傳入 `client`，則忽略此項。預設為 `ROCKSET_API_KEY` environment variable 或如果 `ROCKSET_API_SERVER` 未設定則為 `"https://api.use1a1.rockset.com"`。

```
from rockset import Regions
RocksetVectorStore(api_server=Regions.euc1a1)
```

- **client**: 用於執行 Rockset 請求的 Rockset client 物件。如果未指定，將使用 `api_key` 參數（或 `ROCKSET_API_SERVER` environment variable）和 `api_server` 參數（或 `ROCKSET_API_SERVER` environment variable）內部建構一個 client 物件。

```
from rockset import RocksetClient
RocksetVectorStore(client=RocksetClient(api_key="<my key>"))
```

- **embedding\_col**: 包含 embeddings 的資料庫欄位名稱。預設為 `"embedding"`。

```
RocksetVectorStore(embedding_col="my_embedding")
```
- **metadata\_col**: 包含 node 資料的資料庫欄位名稱。預設為 `"metadata"`。

```
RocksetVectorStore(metadata_col="node")
```

- **distance\_func**: 用於衡量向量關係的指標。預設為 cosine similarity。

```
RocksetVectorStore(distance_func=RocksetVectorStore.DistanceFunc.DOT_PRODUCT)
```
