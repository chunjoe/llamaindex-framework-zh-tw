---
title: "指南：使用現有的 Weaviate Vector Store 進行 Vector Store Index"
---

如果您在 colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-vector-stores-weaviate
%pip install llama-index-embeddings-openai
```

```
!pip install llama-index
```

```
import weaviate
```

```
client = weaviate.Client("https://test-cluster-bbn8vqsn.weaviate.network")
```


## 準備範例「現有」Weaviate Vector Store

### 定義 schema

我們為 “Book” class 建立一個 schema，包含 4 個 property：title (str)、author (str)、content (str) 和 year (int)

```
try:
    client.schema.delete_class("Book")
except:
    pass
```

```
schema = {
    "classes": [
        {
            "class": "Book",
            "properties": [
                {"name": "title", "dataType": ["text"]},
                {"name": "author", "dataType": ["text"]},
                {"name": "content", "dataType": ["text"]},
                {"name": "year", "dataType": ["int"]},
            ],
        },
    ]
}


if not client.schema.contains(schema):
    client.schema.create(schema)
```


### 定義範例資料

我們建立 4 本範例書籍

```
books = [
    {
        "title": "To Kill a Mockingbird",
        "author": "Harper Lee",
        "content": (
            "To Kill a Mockingbird is a novel by Harper Lee published in"
            " 1960..."
        ),
        "year": 1960,
    },
    {
        "title": "1984",
        "author": "George Orwell",
        "content": (
            "1984 is a dystopian novel by George Orwell published in 1949..."
        ),
        "year": 1949,
    },
    {
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "content": (
            "The Great Gatsby is a novel by F. Scott Fitzgerald published in"
            " 1925..."
        ),
        "year": 1925,
    },
    {
        "title": "Pride and Prejudice",
        "author": "Jane Austen",
        "content": (
            "Pride and Prejudice is a novel by Jane Austen published in"
            " 1813..."
        ),
        "year": 1813,
    },
]
```


### 加入資料

我們將範例書籍加入我們的 Weaviate “Book” class（包含 content field 的 embedding）

```
from llama_index.embeddings.openai import OpenAIEmbedding


embed_model = OpenAIEmbedding()
```

```
with client.batch as batch:
    for book in books:
        vector = embed_model.get_text_embedding(book["content"])
        batch.add_data_object(
            data_object=book, class_name="Book", vector=vector
        )
```


## 對 “現有”Weaviate Vector Store 進行查詢

```
from llama_index.vector_stores.weaviate import WeaviateVectorStore
from llama_index.core import VectorStoreIndex
from llama_index.core.response.pprint_utils import pprint_source_node
```

您必須正確指定一個與所需 Weaviate class 相符的 “index\_name”，並選擇一個 class property 作為 “text” field。

```
vector_store = WeaviateVectorStore(
    weaviate_client=client, index_name="Book", text_key="content"
)
```

```
retriever = VectorStoreIndex.from_vector_store(vector_store).as_retriever(
    similarity_top_k=1
)
```

```
nodes = retriever.retrieve("What is that book about a bird again?")
```

讓我們檢查檢索到的 node。我們可以發現書籍資料被載入為 LlamaIndex `Node` 物件，其中 “content” field 是主要文本。

```
pprint_source_node(nodes[0])
```

```
Document ID: cf927ce7-0672-4696-8aae-7e77b33b9659
Similarity: None
Text: author: Harper Lee title: To Kill a Mockingbird year: 1960  To
Kill a Mockingbird is a novel by Harper Lee published in 1960......
```

剩餘的欄位應作為 metadata（在 `metadata` 中）

```
nodes[0].node.metadata
```

```
{'author': 'Harper Lee', 'title': 'To Kill a Mockingbird', 'year': 1960}
```
