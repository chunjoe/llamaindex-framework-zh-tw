---
title: "指南：使用現有的 Pinecone Vector Store 進行 Vector Store Index"
---

如果您在 colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-embeddings-openai
%pip install llama-index-vector-stores-pinecone
```

```
!pip install llama-index
```

```
import os
import pinecone
```

```
api_key = os.environ["PINECONE_API_KEY"]
pinecone.init(api_key=api_key, environment="eu-west1-gcp")
```


## 準備範例「現有」Pinecone Vector Store

### 建立 index

```
indexes = pinecone.list_indexes()
print(indexes)
```

```
['quickstart-index']
```

```
if "quickstart-index" not in indexes:
    # dimensions are for text-embedding-ada-002
    pinecone.create_index(
        "quickstart-index", dimension=1536, metric="euclidean", pod_type="p1"
    )
```

```
pinecone_index = pinecone.Index("quickstart-index")
```

```
pinecone_index.delete(deleteAll="true")
```

```
{}
```


### 定義範例資料

我們建立 4 本範例書

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

我們將範例書加入我們的 Weaviate 「Book」 class（包含 content field 的 embedding）

```
import uuid
from llama_index.embeddings.openai import OpenAIEmbedding


embed_model = OpenAIEmbedding()
```

```
entries = []
for book in books:
    vector = embed_model.get_text_embedding(book["content"])
    entries.append(
        {"id": str(uuid.uuid4()), "values": vector, "metadata": book}
    )
pinecone_index.upsert(entries)
```

```
{'upserted_count': 4}
```


## 對「現有」Pinecone Vector Store 進行查詢

```
from llama_index.vector_stores.pinecone import PineconeVectorStore
from llama_index.core import VectorStoreIndex
from llama_index.core.response.pprint_utils import pprint_source_node
```

您必須正確選取一個 class property 作為「text」欄位。

```
vector_store = PineconeVectorStore(
    pinecone_index=pinecone_index, text_key="content"
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

讓我們檢查檢索到的 node。我們可以發現書籍資料被載入為 LlamaIndex `Node` 物件，其中「content」欄位是主要文本。

```
pprint_source_node(nodes[0])
```

```
Document ID: 07e47f1d-cb90-431b-89c7-35462afcda28
Similarity: 0.797243237
Text: author: Harper Lee title: To Kill a Mockingbird year: 1960.0  To
Kill a Mockingbird is a novel by Harper Lee published in 1960......
```

其餘的欄位應被載入為 metadata（在 `metadata` 中）

```
nodes[0].node.metadata
```

```
{'author': 'Harper Lee', 'title': 'To Kill a Mockingbird', 'year': 1960.0}
```
