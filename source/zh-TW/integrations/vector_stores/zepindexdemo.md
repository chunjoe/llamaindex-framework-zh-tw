---
title: "Zep Vector Store"
---

## 專為 LLM 應用設計的長期記憶儲存

本筆筆記演示如何使用 Zep Vector Store 與 LlamaIndex 配合使用。

## 關於 Zep

Zep 讓開發人員能夠將相關的 documents、聊天記錄記憶 (chat history memory) 和豐富的使用者資料 (rich user data) 加入到他們的 LLM 應用程式的 prompts 中。

## 注意事項

Zep 可以自動嵌入您的 documents。Zep Vector Store 的 LlamaIndex 實作會利用 LlamaIndex 的 embedders 來完成此操作。

## 開始使用

**快速入門指南：** <https://docs.getzep.com/deployment/quickstart/> **GitHub：** <https://github.com/getzep/zep>

如果您在 colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-vector-stores-zep
```

```
!pip install llama-index
```

```
# !pip install zep-python
```

```
import logging
import sys
from uuid import uuid4


logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))


import os
import openai
from dotenv import load_dotenv


load_dotenv()


# os.environ["OPENAI_API_KEY"] = "sk-..."
openai.api_key = os.environ["OPENAI_API_KEY"]
```

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.vector_stores.zep import ZepVectorStore
```

```
INFO:numexpr.utils:NumExpr defaulting to 8 threads.
NumExpr defaulting to 8 threads.
```

下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

```
# load documents
documents = SimpleDirectoryReader("../data/paul_graham/").load_data()
```

## 建立 Zep Vector Store 和 Index

您可以使用現有的 Zep Collection，或建立一個新的。

```
from llama_index.core import StorageContext


zep_api_url = "http://localhost:8000"
collection_name = f"graham{uuid4().hex}"


vector_store = ZepVectorStore(
    api_url=zep_api_url,
    collection_name=collection_name,
    embedding_dimensions=1536,
)


storage_context = StorageContext.from_defaults(vector_store=vector_store)


index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

```
INFO:httpx:HTTP Request: GET http://localhost:8000/healthz "HTTP/1.1 200 OK"
HTTP Request: GET http://localhost:8000/healthz "HTTP/1.1 200 OK"
INFO:httpx:HTTP Request: GET http://localhost:8000/api/v1/collection/grahamfbf0c456a2ad46c2887a707ccc7bb5df "HTTP/1.1 404 Not Found"
HTTP Request: GET http://localhost:8000/api/v1/collection/grahamfbf0c456a2ad46c2887a707ccc7bb5df "HTTP/1.1 404 Not Found"
INFO:llama_index.vector_stores.zep:Collection grahamfbf0c456a2ad46c2887a707ccc7bb5df does not exist, will try creating one with dimensions=1536
Collection grahamfbf0c456a2ad46c2887a707ccc7bb5df does not exist, will try creating one with dimensions=1536
INFO:httpx:HTTP Request: POST http://localhost:8000/api/v1/collection/grahamfbf0c456a2ad46c2887a707ccc7bb5df "HTTP/1.1 200 OK"
HTTP Request: POST http://localhost:8000/api/v1/collection/grahamfbf0c456a2ad46c2887a707ccc7bb5df "HTTP/1.1 200 OK"
INFO:httpx:HTTP Request: GET http://localhost:8000/api/v1/collection/grahamfbf0c456a2ad46c2887a707ccc7bb5df "HTTP/1.1 200 OK"
HTTP Request: GET http://localhost:8000/api/v1/collection/grahamfbf0c456a2ad46c2887a707ccc7bb5df "HTTP/1.1 200 OK"
INFO:httpx:HTTP Request: POST http://localhost:8000/api/v1/collection/grahamfbf0c456a2ad46c2887a707ccc7bb5df/document "HTTP/1.1 200 OK"
HTTP Request: POST http://localhost:8000/api/v1/collection/grahamfbf0c456a2ad46c2887a707ccc7bb5df/document "HTTP/1.1 200 OK"
```

```
query_engine = index.as_query_engine()
response = query_engine.query("What did the author do growing up?")


print(str(response))
```

```
INFO:httpx:HTTP Request: POST http://localhost:8000/api/v1/collection/grahamfbf0c456a2ad46c2887a707ccc7bb5df/search?limit=2 "HTTP/1.1 200 OK"
HTTP Request: POST http://localhost:8000/api/v1/collection/grahamfbf0c456a2ad46c2887a707ccc7bb5df/search?limit=2 "HTTP/1.1 200 OK"
The author worked on writing and programming outside of school before college. They wrote short stories and tried writing programs on an IBM 1401 computer using an early version of Fortran. They later got a microcomputer and started programming more extensively, writing simple games, a program to predict rocket heights, and a word processor. They initially planned to study philosophy in college but switched to AI. They also started publishing essays online and realized the potential of the web as a medium for publishing.
```

## 使用 Metadata 篩選進行查詢

```
from llama_index.core.schema import TextNode


nodes = [
    TextNode(
        text="The Shawshank Redemption",
        metadata={
            "author": "Stephen King",
            "theme": "Friendship",
        },
    ),
    TextNode(
        text="The Godfather",
        metadata={
            "director": "Francis Ford Coppola",
            "theme": "Mafia",
        },
    ),
    TextNode(
        text="Inception",
        metadata={
            "director": "Christopher Nolan",
        },
    ),
]
```

```
collection_name = f"movies{uuid4().hex}"


vector_store = ZepVectorStore(
    api_url=zep_api_url,
    collection_name=collection_name,
    embedding_dimensions=1536,
)


storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex(nodes, storage_context=storage_context)
```

```
INFO:httpx:HTTP Request: GET http://localhost:8000/healthz "HTTP/1.1 200 OK"
HTTP Request: GET http://localhost:8000/healthz "HTTP/1.1 200 OK"
INFO:httpx:HTTP Request: GET http://localhost:8000/api/v1/collection/movies40ffd4f8a68c4822ae1680bb752c07e1 "HTTP/1.1 404 Not Found"
HTTP Request: GET http://localhost:8000/api/v1/collection/movies40ffd4f8a68c4822ae1680bb752c07e1 "HTTP/1.1 404 Not Found"
INFO:llama_index.vector_stores.zep:Collection movies40ffd4f8a68c4822ae1680bb752c07e1 does not exist, will try creating one with dimensions=1536
Collection movies40ffd4f8a68c4822ae1680bb752c07e1 does not exist, will try creating one with dimensions=1536
INFO:httpx:HTTP Request: POST http://localhost:8000/api/v1/collection/movies40ffd4f8a68c4822ae1680bb752c07e1 "HTTP/1.1 200 OK"
HTTP Request: POST http://localhost:8000/api/v1/collection/movies40ffd4f8a68c4822ae1680bb752c07e1 "HTTP/1.1 200 OK"
INFO:httpx:HTTP Request: GET http://localhost:8000/api/v1/collection/movies40ffd4f8a68c4822ae1680bb752c07e1 "HTTP/1.1 200 OK"
HTTP Request: GET http://localhost:8000/api/v1/collection/movies40ffd4f8a68c4822ae1680bb752c07e1 "HTTP/1.1 200 OK"
INFO:httpx:HTTP Request: POST http://localhost:8000/api/v1/collection/movies40ffd4f8a68c4822ae1680bb752c07e1/document "HTTP/1.1 200 OK"
HTTP Request: POST http://localhost:8000/api/v1/collection/movies40ffd4f8a68c4822ae1680bb752c07e1/document "HTTP/1.1 200 OK"
```

```
from llama_index.core.vector_stores import ExactMatchFilter, MetadataFilters


filters = MetadataFilters(
    filters=[ExactMatchFilter(key="theme", value="Mafia")]
)
```

```
retriever = index.as_retriever(filters=filters)
result = retriever.retrieve("What is inception about?")


for r in result:
    print("\n", r.node)
    print("Score:", r.score)
```

```
INFO:httpx:HTTP Request: POST http://localhost:8000/api/v1/collection/movies40ffd4f8a68c4822ae1680bb752c07e1/search?limit=2 "HTTP/1.1 200 OK"
HTTP Request: POST http://localhost:8000/api/v1/collection/movies40ffd4f8a68c4822ae1680bb752c07e1/search?limit=2 "HTTP/1.1 200 OK"


 Node ID: 2b5ad50a-8ec0-40fa-b401-6e6b7ac3d304
Text: The Godfather
Score: 0.8841066656525941
```
