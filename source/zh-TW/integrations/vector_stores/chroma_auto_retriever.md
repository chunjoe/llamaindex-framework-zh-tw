---
title: "從向量資料庫自動檢索"
---

本指南說明如何在 LlamaIndex 中執行 **auto-retrieval**。

許多流行的 vector dbs 除了查詢字串外，還支援一組 metadata filters 用於 semantic search。對於自然語言查詢，我們首先使用 LLM 推斷一組 metadata filters 以及應傳遞給 vector db 的正確查詢字串（此查詢字串也可以是空白的）。然後，這個整體查詢組合會對 vector db 執行。

這使得我們能夠實現超越 top-k semantic search 的更動態、更具表達性的檢索方式。給定查詢的相關上下文可能僅需要對 metadata tag 進行過濾，或者需要對過濾後的集合進行 filtering + semantic search 的組合，或者僅僅是原始的 semantic search。

我們以 Chroma 為例進行演示，但 auto-retrieval 也已實作於許多其他 vector dbs（例如 Pinecone、Weaviate 等）。

## 設定

我們首先定義 imports 並定義一個空的 Chroma collection。

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-vector-stores-chroma
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

```
import chromadb
```

```
chroma_client = chromadb.EphemeralClient()
chroma_collection = chroma_client.create_collection("quickstart")
```

```
INFO:chromadb.telemetry.posthog:Anonymized telemetry enabled. See https://docs.trychroma.com/telemetry for more information.
Anonymized telemetry enabled. See https://docs.trychroma.com/telemetry for more information.
```


## 定義一些範例資料

我們將一些包含文字區塊的範例 nodes 插入到 vector database 中。請注意，每個 `TextNode` 不僅包含文字，還包含 metadata，例如 `category` 和 `country`。這些 metadata 欄位將在底層 vector db 中被轉換/儲存為此格式。

```
from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.vector_stores.chroma import ChromaVectorStore
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


## 使用 Chroma Vector Store 建構 Vector Index

在這裡，我們將資料載入到 vector store 中。如上所述，每個 node 的文字和 metadata 都會被轉換成 Chroma 中的對應表示。現在我們可以在 Chroma 中對此資料執行 semantic 查詢和 metadata filtering。

```
vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
```

```
index = VectorStoreIndex(nodes, storage_context=storage_context)
```


## 定義 `VectorIndexAutoRetriever`

我們定義我們的核心 `VectorIndexAutoRetriever` 模組。該模組接收 `VectorStoreInfo`，其中包含 vector store collection 的結構化描述及其支援的 metadata filters。此資訊將用於 auto-retrieval prompt 中，其中 LLM 推斷 metadata filters。

```
from llama_index.core.retrievers import VectorIndexAutoRetriever
from llama_index.core.vector_stores.types import MetadataInfo, VectorStoreInfo




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


## 對一些範例資料進行運行

我們嘗試對一些範例資料進行運行。請注意 metadata filters 是如何被推斷的——這有助於更精確的檢索！

```
retriever.retrieve("Tell me about two celebrities from United States")
```

```
INFO:llama_index.indices.vector_store.retrievers.auto_retriever.auto_retriever:Using query str: celebrities
Using query str: celebrities
INFO:llama_index.indices.vector_store.retrievers.auto_retriever.auto_retriever:Using filters: {'country': 'United States'}
Using filters: {'country': 'United States'}
INFO:llama_index.indices.vector_store.retrievers.auto_retriever.auto_retriever:Using top_k: 2
Using top_k: 2










[NodeWithScore(node=TextNode(id_='b2ab3b1a-5731-41ec-b884-405016de5a34', embedding=None, metadata={'category': 'Entertainment', 'country': 'United States'}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={}, hash='28e1d0d600908a5e9f0c388f0d49b0cd58920dc13e4f2743becd135ac0f18799', text='Angelina Jolie is an American actress, filmmaker, and humanitarian. She has received numerous awards for her acting and is known for her philanthropic work.', start_char_idx=None, end_char_idx=None, text_template='{metadata_str}\n\n{content}', metadata_template='{key}: {value}', metadata_seperator='\n'), score=0.32621567877748514),
 NodeWithScore(node=TextNode(id_='e0104b6a-676a-4c83-95b7-b018cb8b39b2', embedding=None, metadata={'category': 'Sports', 'country': 'United States'}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={}, hash='7456e8d70b089c3830424e49b2a03c8d6d3f5cd0de42b0669a8ee518eca01012', text='Michael Jordan is a retired professional basketball player, widely regarded as one of the greatest basketball players of all time.', start_char_idx=None, end_char_idx=None, text_template='{metadata_str}\n\n{content}', metadata_template='{key}: {value}', metadata_seperator='\n'), score=0.3734030955060519)]
```

```
retriever.retrieve("Tell me about Sports celebrities from United States")
```
