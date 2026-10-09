---
title: "Lantern Vector Store (自動-retriever)"
---

本指南說明如何在 LlamaIndex 中執行 **auto-retrieval**。

許多流行的 vector DBs 除了查詢字串外，還支援一組 metadata 篩選器用於語義搜尋。對於自然語言查詢，我們首先使用 LLM 來推斷一組 metadata 篩選器以及應傳遞給 vector DB 的正確查詢字串（此查詢字串也可以是空白的）。然後，這個總體查詢組合會對 vector DB 執行。

這使得我們能夠進行超越 top-k semantic search 的更動態、更具表達力的檢索方式。給定查詢的相關上下文可能只需要對 metadata tag 進行篩選，或者需要在篩選後的集合內進行篩選 + semantic search 的組合，或者僅僅是原始的 semantic search。

我們以 Lantern 為例進行演示，但 auto-retrieval 也已實作於許多其他 vector DB 中（例如 Pinecone、Chroma、Weaviate 等）。

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-vector-stores-lantern
```

```
!pip install llama-index psycopg2-binary asyncpg
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


os.environ["OPENAI_API_KEY"] = "<your-api-key>"


import openai


openai.api_key = os.environ["OPENAI_API_KEY"]
```

```
import psycopg2
from sqlalchemy import make_url


connection_string = "postgresql://postgres:postgres@localhost:5432"


url = make_url(connection_string)


db_name = "postgres"
conn = psycopg2.connect(connection_string)
conn.autocommit = True
```

```
from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.vector_stores.lantern import LanternVectorStore
```

```
from llama_index.core.schema import TextNode


nodes = [
    TextNode(
        text=(
            "Michael Jordan is a retired professional basketball player,"
            " widely regarded as one of the greatest basketball players of all"
            " time."
        ),
        metadata={
            "category": "Sports",
            "country": "United States",
        },
    ),
    TextNode(
        text=(
            "Angelina Jolie is an American actress, filmmaker, and"
            " humanitarian. She has received numerous awards for her acting"
            " and is known for her philanthropic work."
        ),
        metadata={
            "category": "Entertainment",
            "country": "United States",
        },
    ),
    TextNode(
        text=(
            "Elon Musk is a business magnate, industrial designer, and"
            " engineer. He is the founder, CEO, and lead designer of SpaceX,"
            " Tesla, Inc., Neuralink, and The Boring Company."
        ),
        metadata={
            "category": "Business",
            "country": "United States",
        },
    ),
    TextNode(
        text=(
            "Rihanna is a Barbadian singer, actress, and businesswoman. She"
            " has achieved significant success in the music industry and is"
            " known for her versatile musical style."
        ),
        metadata={
            "category": "Music",
            "country": "Barbados",
        },
    ),
    TextNode(
        text=(
            "Cristiano Ronaldo is a Portuguese professional footballer who is"
            " considered one of the greatest football players of all time. He"
            " has won numerous awards and set multiple records during his"
            " career."
        ),
        metadata={
            "category": "Sports",
            "country": "Portugal",
        },
    ),
]
```

## 建置 搭配以下內容的向量索引： Lantern Vector Store

在這裡，我們將資料載入到 vector store 中。如上所述，每個 node 的文字和 metadata 都會轉換成 Lantern 中的對應表示。現在我們可以在 Lantern 的資料上執行 semantic 查詢和 metadata 篩選。

```
vector_store = LanternVectorStore.from_params(
    database=db_name,
    host=url.host,
    password=url.password,
    port=url.port,
    user=url.username,
    table_name="famous_people",
    embed_dim=1536,  # openai embedding dimension
    m=16,  # HNSW M parameter
    ef_construction=128,  # HNSW ef construction parameter
    ef=64,  # HNSW ef search parameter
)


storage_context = StorageContext.from_defaults(vector_store=vector_store)
```

```
index = VectorStoreIndex(nodes, storage_context=storage_context)
```

## Define `VectorIndexAutoRetriever`

我們定義核心的 `VectorIndexAutoRetriever` 模組。該模組接收 `VectorStoreInfo`，其中包含 vector store collection 的結構化描述及其支援的 metadata 篩選器。此資訊將用於 auto-retrieval prompt 中，其中 LLM 推斷 metadata 篩選器。

```
from llama_index.core.retrievers import VectorIndexAutoRetriever
from llama_index.core.vector_stores import MetadataInfo, VectorStoreInfo




vector_store_info = VectorStoreInfo(
    content_info="brief biography of celebrities",
    metadata_info=[
        MetadataInfo(
            name="category",
            type="str",
            description=(
                "Category of the celebrity, one of [Sports, Entertainment,"
                " Business, Music]"
            ),
        ),
        MetadataInfo(
            name="country",
            type="str",
            description=(
                "Country of the celebrity, one of [United States, Barbados,"
                " Portugal]"
            ),
        ),
    ],
)
retriever = VectorIndexAutoRetriever(
    index, vector_store_info=vector_store_info
)
```

## Running 處理一些範例資料

我們嘗試對一些範例資料進行運行。注意 metadata 篩選器是如何被推斷的——這有助於更精確的檢索！

```
retriever.retrieve("Tell me about two celebrities from United States")
```
