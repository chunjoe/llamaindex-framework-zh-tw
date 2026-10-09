---
title: "Epsilla Vector Store"
---

在本筆筆記中，我們將展示如何使用 [Epsilla](https://www.epsilla.com/) 在 LlamaIndex 中執行向量搜尋。

作為先決條件，您需要有一個正在運行的 Epsilla 向量資料庫（例如，透過我們的 docker 映像檔），並安裝 `pyepsilla` 套件。請參閱完整的文件 [文件](https://epsilla-inc.gitbook.io/epsilladb/quick-start)。

```
%pip install llama-index-vector-stores-epsilla
```

```
!pip/pip3 install pyepsilla
```

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
!pip install llama-index
```

```
import logging
import sys


# Uncomment to see debug logs
# logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)
# logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))


from llama_index.core import SimpleDirectoryReader, Document, StorageContext
from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.epsilla import EpsillaVectorStore
import textwrap
```

### 設定 OpenAI

我們先從新增 openai api key 開始。它將用於為載入到索引中的 documents 建立 embeddings。

```
import openai
import getpass


OPENAI_API_KEY = getpass.getpass("OpenAI API Key:")
openai.api_key = OPENAI_API_KEY
```

### 下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

### 載入 documents

使用 SimpleDirectoryReader 載入儲存在 `/data/paul_graham` 資料夾中的 documents。

```
# load documents
documents = SimpleDirectoryReader("./data/paul_graham/").load_data()
print(f"Total documents: {len(documents)}")
print(f"First document, id: {documents[0].doc_id}")
print(f"First document, hash: {documents[0].hash}")
```

```
Total documents: 1
First document, id: ac7f23f0-ce15-4d94-a0a2-5020fa87df61
First document, hash: 4c702b4df575421e1d1af4b1fd50511b226e0c9863dbfffeccb8b689b8448f35
```

### 建立索引

在這裡，我們使用先前載入的 documents 建立一個由 Epsilla 支援的索引。EpsillaVectorStore 接受幾個參數。

- client (Any): 用於連接的 Epsilla client。

- collection\_name (str, optional): 要使用的 collection。預設為 “llama\_collection”。

- db\_path (str, optional): 資料庫將被持久化的路徑。預設為 “/tmp/langchain-epsilla”。

- db\_name (str, optional): 為載入的資料庫命名。預設為 “langchain\_store”。

- dimension (int, optional): embeddings 的維度。如果未提供，集合建立將在首次插入時完成。預設為 None。

- overwrite (bool, optional): 是否用相同名稱的現有集合覆蓋。預設為 False。

Epsilla vectordb 使用預設主機 “localhost” 和連接埠 “8888” 運行。

```
# Create an index over the documnts
from pyepsilla import vectordb


client = vectordb.Client()
vector_store = EpsillaVectorStore(client=client, db_path="/tmp/llamastore")


storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

```
[INFO] Connected to localhost:8888 successfully.
```

### 查詢資料

現在我們在索引中有了我們的 document，我們可以對索引提出問題。

```
query_engine = index.as_query_engine()
response = query_engine.query("Who is the author?")
print(textwrap.fill(str(response), 100))
```

```
The author of the given context information is Paul Graham.
```

```
response = query_engine.query("How did the author learn about AI?")
print(textwrap.fill(str(response), 100))
```

```
The author learned about AI through various sources. One source was a novel called "The Moon is a
Harsh Mistress" by Heinlein, which featured an intelligent computer called Mike. Another source was
a PBS documentary that showed Terry Winograd using SHRDLU, a program that could understand natural
language. These experiences sparked the author's interest in AI and motivated them to start learning
about it, including teaching themselves Lisp, which was regarded as the language of AI at the time.
```

接下來，讓我們嘗試覆蓋先前的資料。

```
vector_store = EpsillaVectorStore(client=client, overwrite=True)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
single_doc = Document(text="Epsilla is the vector database we are using.")
index = VectorStoreIndex.from_documents(
    [single_doc],
    storage_context=storage_context,
)


query_engine = index.as_query_engine()
response = query_engine.query("Who is the author?")
print(textwrap.fill(str(response), 100))
```

```
There is no information provided about the author in the given context.
```

```
response = query_engine.query("What vector database is being used?")
print(textwrap.fill(str(response), 100))
```

```
Epsilla is the vector database being used.
```

接下來，讓我們向現有集合新增更多資料。

```
vector_store = EpsillaVectorStore(client=client, overwrite=False)
index = VectorStoreIndex.from_vector_store(vector_store=vector_store)
for doc in documents:
    index.insert(document=doc)


query_engine = index.as_query_engine()
response = query_engine.query("Who is the author?")
print(textwrap.fill(str(response), 100))
```

```
The author of the given context information is Paul Graham.
```

```
response = query_engine.query("What vector database is being used?")
print(textwrap.fill(str(response), 100))
```

```
Epsilla is the vector database being used.
```
