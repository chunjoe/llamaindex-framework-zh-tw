---
title: "從向量資料庫自動檢索"
---

本指南將介紹如何在 LlamaIndex 中執行 **auto-retrieval**。

許多流行的 vector dbs 除了查詢字串外，還支援一組 metadata 篩選器用於語義搜尋。對於自然語言查詢，我們首先使用 LLM 來推斷一組 metadata 篩選器以及應傳遞給 vector db 的正確查詢字串（此查詢字串也可以是空白的）。然後，這個總體查詢組合會對 vector db 執行。

這使得我們能夠實現超越 top-k semantic search 的更動態、更具表達力的檢索方式。給定一個查詢的相關上下文可能只需要對一個 metadata tag 進行篩選，或者需要在篩選後的集合內進行篩選與 semantic search 的組合，或者僅僅是原始的 semantic search。

我們以 Elasticsearch 為例進行演示，但 auto-retrieval 也已實作於許多其他 vector dbs（例如 Pinecone、Weaviate 等）。

## 設定

我們首先定義導入。

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-vector-stores-elasticsearch
```

```
!pip install llama-index
```

```
import logging
import sys


logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))
```

```
# set up OpenAI
import os
import getpass


os.environ["OPENAI_API_KEY"] = getpass.getpass("OpenAI API Key:")
import openai


openai.api_key = os.environ["OPENAI_API_KEY"]
```


## 定義一些範例資料

我們將一些包含文字區塊的範例 nodes 插入到 vector database 中。請注意，每個 `TextNode` 不僅包含文字，還包含 metadata，例如 `category` 和 `country`。這些 metadata 欄位將在底層 vector db 中被轉換/儲存為此形式。

```
from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.vector_stores.elasticsearch import ElasticsearchStore
```

```
from llama_index.core.schema import TextNode


nodes = [
    TextNode(
        text=(
            "A bunch of scientists bring back dinosaurs and mayhem breaks"
            " loose"
        ),
        metadata={"year": 1993, "rating": 7.7, "genre": "science fiction"},
    ),
    TextNode(
        text=(
            "Leo DiCaprio gets lost in a dream within a dream within a dream"
            " within a ..."
        ),
        metadata={
            "year": 2010,
            "director": "Christopher Nolan",
            "rating": 8.2,
        },
    ),
    TextNode(
        text=(
            "A psychologist / detective gets lost in a series of dreams within"
            " dreams within dreams and Inception reused the idea"
        ),
        metadata={"year": 2006, "director": "Satoshi Kon", "rating": 8.6},
    ),
    TextNode(
        text=(
            "A bunch of normal-sized women are supremely wholesome and some"
            " men pine after them"
        ),
        metadata={"year": 2019, "director": "Greta Gerwig", "rating": 8.3},
    ),
    TextNode(
        text="Toys come alive and have a blast doing so",
        metadata={"year": 1995, "genre": "animated"},
    ),
]
```


## 使用 Elasticsearch Vector Store 建構 Vector Index

在這裡，我們將資料載入到 vector store 中。如上所述，每個 node 的文字和 metadata 都會被轉換成 Elasticsearch 中的對應表示。現在我們可以在 Elasticsearch 中對此資料執行 semantic 查詢和 metadata 篩選。

```
vector_store = ElasticsearchStore(
    index_name="auto_retriever_movies", es_url="http://localhost:9200"
)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
```

```
index = VectorStoreIndex(nodes, storage_context=storage_context)
```


## 定義 `VectorIndexAutoRetriever`

我們定義核心的 `VectorIndexAutoRetriever` 模組。該模組接收 `VectorStoreInfo`，其中包含 vector store collection 的結構化描述及其支援的 metadata 篩選器。此資訊將用於 auto-retrieval prompt 中，其中 LLM 推斷 metadata 篩選器。

```
from llama_index.core.retrievers import VectorIndexAutoRetriever
from llama_index.core.vector_stores import MetadataInfo, VectorStoreInfo




vector_store_info = VectorStoreInfo(
    content_info="Brief summary of a movie",
    metadata_info=[
        MetadataInfo(
            name="genre",
            description="The genre of the movie",
            type="string or list[string]",
        ),
        MetadataInfo(
            name="year",
            description="The year the movie was released",
            type="integer",
        ),
        MetadataInfo(
            name="director",
            description="The name of the movie director",
            type="string",
        ),
        MetadataInfo(
            name="rating",
            description="A 1-10 rating for the movie",
            type="float",
        ),
    ],
)
retriever = VectorIndexAutoRetriever(
    index, vector_store_info=vector_store_info
)
```


## 對一些範例資料進行運行

我們嘗試對一些範例資料進行運行。請注意 metadata 篩選器是如何被推斷的——這有助於更精確的檢索！

```
retriever.retrieve(
    "What are 2 movies by Christopher Nolan were made before 2020?"
)
```

```
retriever.retrieve("Has Andrei Tarkovsky directed any science fiction movies")
```

```
INFO:llama_index.indices.vector_store.retrievers.auto_retriever.auto_retriever:Using query str: science fiction
Using query str: science fiction
INFO:llama_index.indices.vector_store.retrievers.auto_retriever.auto_retriever:Using filters: {'director': 'Andrei Tarkovsky'}
Using filters: {'director': 'Andrei Tarkovsky'}
INFO:llama_index.indices.vector_store.retrievers.auto_retriever.auto_retriever:Using top_k: 2
Using top_k: 2
INFO:elastic_transport.transport:POST http://localhost:9200/auto_retriever_movies/_search [status:200 duration:0.042s]
POST http://localhost:9200/auto_retriever_movies/_search [status:200 duration:0.042s]










[]
```
