---
title: "Astra DB"
---

> [DataStax Astra DB](https://docs.datastax.com/en/astra/home/astra.html) 是一個基於 Apache Cassandra 建構的無伺服器向量能力資料庫，可透過易於使用的 JSON API 存取。

要執行此 notebook，您需要在雲端運行一個 DataStax Astra DB 實例（您可以在 [datastax.com](https://astra.datastax.com/) 免費取得一個）。

請確保已安裝 `llama-index` 和 `astrapy`：

```
%pip install llama-index-vector-stores-astra-db
%pip install llama-index-embeddings-openai
```

```
!pip install llama-index
!pip install "astrapy>=1.0"
```

### 請提供資料庫連線參數和密鑰：

```
import os
import getpass


api_endpoint = input(
    "\nPlease enter your Database Endpoint URL (e.g. 'https://4bc...datastax.com'):"
)


token = getpass.getpass(
    "\nPlease enter your 'Database Administrator' Token (e.g. 'AstraCS:...'):"
)


os.environ["OPENAI_API_KEY"] = getpass.getpass(
    "\nPlease enter your OpenAI API Key (e.g. 'sk-...'):"
)
```

### 匯入所需的套件依賴：

```
from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
)
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.vector_stores.astra_db import AstraDBVectorStore
```

### 載入一些範例資料：

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

### 讀取資料：

```
# load documents
documents = SimpleDirectoryReader("./data/paul_graham/").load_data()
print(f"Total documents: {len(documents)}")
print(f"First document, id: {documents[0].doc_id}")
print(f"First document, hash: {documents[0].hash}")
print(
    "First document, text"
    f" ({len(documents[0].text)} characters):\n{'='*20}\n{documents[0].text[:360]} ..."
)
```

### 建立 Astra DB Vector Store 物件：

```
astra_db_store = AstraDBVectorStore(
    token=token,
    api_endpoint=api_endpoint,
    collection_name="astra_v_table",
    embedding_dimension=1536,
)
```

### 從 Documents 建構索引：

```
embed_model = OpenAIEmbedding(model_name="text-embedding-3-small")


storage_context = StorageContext.from_defaults(vector_store=astra_db_store)


index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context, embed_model=embed_model
)
```

### 使用索引進行查詢：

```
query_engine = index.as_query_engine()
response = query_engine.query("Why did the author choose to work on AI?")


print(response.response)
```
