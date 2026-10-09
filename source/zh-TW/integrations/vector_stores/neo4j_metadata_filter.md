---
title: "Neo4j 向量儲存庫 - 元數據過濾器"
---

如果您在 colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-vector-stores-neo4jvector
```

```
# !pip install llama-index>=0.9.31 neo4j
```

```
import logging
import sys
import os


logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))
```

建立一個 Neo4j vector Index 並連接到它

```
import os
from llama_index.vector_stores.neo4jvector import Neo4jVectorStore


os.environ["OPENAI_API_KEY"] = "sk-..."


username = "neo4j"
password = "password"
url = "bolt://localhost:7687"
embed_dim = 1536  # Dimensions are for text-embedding-ada-002


vector_store = Neo4jVectorStore(username, password, url, embed_dim)
```

```
INFO:numexpr.utils:Note: NumExpr detected 16 cores but "NUMEXPR_MAX_THREADS" not set, so enforcing safe limit of 8.
Note: NumExpr detected 16 cores but "NUMEXPR_MAX_THREADS" not set, so enforcing safe limit of 8.
INFO:numexpr.utils:NumExpr defaulting to 8 threads.
NumExpr defaulting to 8 threads.
```

建立 VectorStoreIndex

```
from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.core.schema import TextNode


nodes = [
    TextNode(
        text="The Shawshank Redemption",
        metadata={
            "author": "Stephen King",
            "theme": "Friendship",
            "year": 1994,
        },
    ),
    TextNode(
        text="The Godfather",
        metadata={
            "director": "Francis Ford Coppola",
            "theme": "Mafia",
            "year": 1972,
        },
    ),
    TextNode(
        text="Inception",
        metadata={
            "director": "Christopher Nolan",
            "theme": "Fiction",
            "year": 2010,
        },
    ),
    TextNode(
        text="To Kill a Mockingbird",
        metadata={
            "author": "Harper Lee",
            "theme": "Mafia",
            "year": 1960,
        },
    ),
    TextNode(
        text="1984",
        metadata={
            "author": "George Orwell",
            "theme": "Totalitarianism",
            "year": 1949,
        },
    ),
    TextNode(
        text="The Great Gatsby",
        metadata={
            "author": "F. Scott Fitzgerald",
            "theme": "The American Dream",
            "year": 1925,
        },
    ),
    TextNode(
        text="Harry Potter and the Sorcerer's Stone",
        metadata={
            "author": "J.K. Rowling",
            "theme": "Fiction",
            "year": 1997,
        },
    ),
]
```

```
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex(nodes, storage_context=storage_context)
```

```
INFO:httpx:HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
```

定義 metadata filters

```
from llama_index.core.vector_stores import (
    MetadataFilter,
    MetadataFilters,
    FilterOperator,
)


filters = MetadataFilters(
    filters=[
        MetadataFilter(
            key="theme", operator=FilterOperator.EQ, value="Fiction"
        ),
    ]
)
```

使用 filters 從 vector store 檢索

```
retriever = index.as_retriever(filters=filters)
retriever.retrieve("What is inception about?")
```

```
INFO:httpx:HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"










[NodeWithScore(node=TextNode(id_='814e5f2a-2150-4bae-8a59-fa728379e978', embedding=None, metadata={'director': 'Christopher Nolan', 'theme': 'Fiction', 'year': 2010}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={}, text='Inception', start_char_idx=None, end_char_idx=None, text_template='{metadata_str}\n\n{content}', metadata_template='{key}: {value}', metadata_seperator='\n'), score=0.9202238321304321),
 NodeWithScore(node=TextNode(id_='fc1df8cc-f1d3-4a7b-8c21-f83b18463758', embedding=None, metadata={'author': 'J.K. Rowling', 'theme': 'Fiction', 'year': 1997}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={}, text="Harry Potter and the Sorcerer's Stone", start_char_idx=None, end_char_idx=None, text_template='{metadata_str}\n\n{content}', metadata_template='{key}: {value}', metadata_seperator='\n'), score=0.8823964595794678)]
```

使用 `AND` condition 進行多個 Metadata Filters

```
from llama_index.core.vector_stores import FilterOperator, FilterCondition


filters = MetadataFilters(
    filters=[
        MetadataFilter(key="theme", value="Fiction"),
        MetadataFilter(key="year", value=1997, operator=FilterOperator.GT),
    ],
    condition=FilterCondition.AND,
)


retriever = index.as_retriever(filters=filters)
retriever.retrieve("Harry Potter?")
```

```
INFO:httpx:HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"










[NodeWithScore(node=TextNode(id_='814e5f2a-2150-4bae-8a59-fa728379e978', embedding=None, metadata={'director': 'Christopher Nolan', 'theme': 'Fiction', 'year': 2010}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={}, text='Inception', start_char_idx=None, end_char_idx=None, text_template='{metadata_str}\n\n{content}', metadata_template='{key}: {value}', metadata_seperator='\n'), score=0.8818434476852417)]
```

使用 `OR` condition 進行多個 Metadata Filters

```
from llama_index.core.vector_stores import FilterOperator, FilterCondition




filters = MetadataFilters(
    filters=[
        MetadataFilter(key="theme", value="Fiction"),
        MetadataFilter(key="year", value=1997, operator=FilterOperator.GT),
    ],
    condition=FilterCondition.OR,
)


retriever = index.as_retriever(filters=filters)
retriever.retrieve("Harry Potter?")
```

```
INFO:httpx:HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"










[NodeWithScore(node=TextNode(id_='fc1df8cc-f1d3-4a7b-8c21-f83b18463758', embedding=None, metadata={'author': 'J.K. Rowling', 'theme': 'Fiction', 'year': 1997}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={}, text="Harry Potter and the Sorcerer's Stone", start_char_idx=None, end_char_idx=None, text_template='{metadata_str}\n\n{content}', metadata_template='{key}: {value}', metadata_seperator='\n'), score=0.9242331385612488),
 NodeWithScore(node=TextNode(id_='814e5f2a-2150-4bae-8a59-fa728379e978', embedding=None, metadata={'director': 'Christopher Nolan', 'theme': 'Fiction', 'year': 2010}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={}, text='Inception', start_char_idx=None, end_char_idx=None, text_template='{metadata_str}\n\n{content}', metadata_template='{key}: {value}', metadata_seperator='\n'), score=0.8818434476852417)]
```
