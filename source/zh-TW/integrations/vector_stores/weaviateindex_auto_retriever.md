---
title: "從 Weaviate Vector Database 進行自動檢索"
---

本指南說明如何在 LlamaIndex 中使用 [Weaviate](https://weaviate.io/) 進行 **auto-retrieval**。

Weaviate vector database 除了用於語義搜尋的查詢字串外，還支援一組 [metadata filters](https://weaviate.io/developers/weaviate/search/filters)。對於自然語言查詢，我們會先使用大型語言模型 (LLM) 來推斷一組 metadata filters 以及應傳遞給 vector database 的正確查詢字串（此查詢字串也可以是空白的）。然後，這個整體查詢組合會對 vector database 執行。

這使得我們能夠進行比 top-k 語義搜尋更動態、更具表達性的檢索方式。給定查詢的相關上下文可能僅需要對 metadata tag 進行過濾，或者需要對過濾後的集合進行 filtering + semantic search 的組合，或者僅僅是原始的 semantic search。

## 設定

我們首先定義 imports 並定義一個空的 Weaviate collection。

如果您在 Colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-vector-stores-weaviate
```

```
!pip install llama-index weaviate-client
```

```
import logging
import sys


logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))
```

我們將使用 GPT-4 及其推理能力來推斷 metadata filters。根據您的使用情境，`"gpt-3.5-turbo"` 也可以使用。

```
# set up OpenAI
import os
import getpass
import openai


os.environ["OPENAI_API_KEY"] = getpass.getpass("OpenAI API Key:")
openai.api_key = os.environ["OPENAI_API_KEY"]
```

```
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAI
from llama_index.core.settings import Settings


Settings.llm = OpenAI(model="gpt-4")
Settings.embed_model = OpenAIEmbedding()
```

此 Notebook 在 [Embedded mode](https://weaviate.io/developers/weaviate/installation/embedded) 中使用 Weaviate，此模式支援 Linux 和 macOS。

如果您希望嘗試 Weaviate 的完全託管服務 [Weaviate Cloud Services (WCS)](https://weaviate.io/developers/weaviate/installation/weaviate-cloud-services)，您可以啟用註釋中的程式碼。

```
import weaviate
from weaviate.embedded import EmbeddedOptions


# Connect to Weaviate client in embedded mode
client = weaviate.connect_to_embedded()


# Enable this code if you want to use Weaviate Cloud Services instead of Embedded mode.
"""
import weaviate


# cloud
cluster_url = ""
api_key = ""


client = weaviate.connect_to_wcs(cluster_url=cluster_url,
    auth_credentials=weaviate.auth.AuthApiKey(api_key),
)


# local
# client = weaviate.connect_to_local()
"""
```

## 定義一些範例資料

我們將一些包含文字區塊的範例 nodes 插入到 vector database 中。請注意，每個 `TextNode` 不僅包含文字，還包含 metadata，例如 `category` 和 `country`。這些 metadata 欄位將在底層 vector db 中被轉換/儲存為此格式。

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

## 使用 Weaviate Vector Store 建構 Vector Index

在這裡，我們將資料載入到 vector store 中。如上所述，每個 node 的文字和 metadata 都會被轉換成 Weaviate 中的對應表示。現在我們可以在 Weaviate 的資料上執行 semantic 查詢和 metadata filtering。

```
from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.vector_stores.weaviate import WeaviateVectorStore


vector_store = WeaviateVectorStore(
    weaviate_client=client, index_name="LlamaIndex_filter"
)


storage_context = StorageContext.from_defaults(vector_store=vector_store)
```

```
index = VectorStoreIndex(nodes, storage_context=storage_context)
```

## 定義 `VectorIndexAutoRetriever`

我們定義核心的 `VectorIndexAutoRetriever` 模組。該模組接收 `VectorStoreInfo`，其中包含 vector store collection 的結構化描述及其支援的 metadata filters。此資訊將用於 auto-retrieval prompt 中，讓 LLM 推斷 metadata filters。

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
response = retriever.retrieve("Tell me about celebrities from United States")
```

```
print(response[0])
```

```
response = retriever.retrieve(
    "Tell me about Sports celebrities from United States"
)
```

```
print(response[0])
```
