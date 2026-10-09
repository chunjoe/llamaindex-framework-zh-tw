---
title: "Lantern Vector Store"
---

在本筆 Notebook 中，我們將展示如何使用 [Postgresql](https://www.postgresql.org/) 和 [Lantern](https://github.com/lanterndata/lantern) 在 LlamaIndex 中執行向量搜尋。

如果您在 Colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-vector-stores-lantern
%pip install llama-index-embeddings-openai
```

```
!pip install psycopg2-binary llama-index asyncpg
```

```
from llama_index.core import SimpleDirectoryReader, StorageContext
from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.lantern import LanternVectorStore
import textwrap
import openai
```

### 設定 OpenAI

第一步是設定 openai key。它將用於為載入到 index 中的 documents 建立 embeddings。

```
import os


os.environ["OPENAI_API_KEY"] = "<your_key>"
openai.api_key = "<your_key>"
```

下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

### 載入 documents

使用 SimpleDirectoryReader 載入儲存在 `data/paul_graham/` 中的 documents。

```
documents = SimpleDirectoryReader("./data/paul_graham").load_data()
print("Document ID:", documents[0].doc_id)
```

### 建立資料庫

使用在 localhost 上運行的現有 postgres，建立我們將使用的資料庫。

```
import psycopg2


connection_string = "postgresql://postgres:postgres@localhost:5432"
db_name = "postgres"
conn = psycopg2.connect(connection_string)
conn.autocommit = True


with conn.cursor() as c:
    c.execute(f"DROP DATABASE IF EXISTS {db_name}")
    c.execute(f"CREATE DATABASE {db_name}")
```

```
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core import Settings


# Setup global settings with embedding model
# So query strings will be transformed to embeddings and HNSW index will be used
Settings.embed_model = OpenAIEmbedding(model="text-embedding-3-small")
```

### 建立 index

在這裡，我們使用先前載入的 documents 建立一個由 Postgres 支援的 index。LanternVectorStore 接受幾個參數。

```
from sqlalchemy import make_url


url = make_url(connection_string)
vector_store = LanternVectorStore.from_params(
    database=db_name,
    host=url.host,
    password=url.password,
    port=url.port,
    user=url.username,
    table_name="paul_graham_essay",
    embed_dim=1536,  # openai embedding dimension
)


storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context, show_progress=True
)
query_engine = index.as_query_engine()
```

### 查詢 index

現在我們可以使用我們的 index 來提問。

```
response = query_engine.query("What did the author do?")
```

```
print(textwrap.fill(str(response), 100))
```

```
response = query_engine.query("What happened in the mid 1980s?")
```

```
print(textwrap.fill(str(response), 100))
```

### 查詢現有 index

```
vector_store = LanternVectorStore.from_params(
    database=db_name,
    host=url.host,
    password=url.password,
    port=url.port,
    user=url.username,
    table_name="paul_graham_essay",
    embed_dim=1536,  # openai embedding dimension
    m=16,  # HNSW M parameter
    ef_construction=128,  # HNSW ef construction parameter
    ef=64,  # HNSW ef search parameter
)


# Read more about HNSW parameters here: https://github.com/nmslib/hnswlib/blob/master/ALGO_PARAMS.md


index = VectorStoreIndex.from_vector_store(vector_store=vector_store)
query_engine = index.as_query_engine()
```

```
response = query_engine.query("What did the author do?")
```

```
print(textwrap.fill(str(response), 100))
```

### 混合搜尋

要啟用混合搜尋，您需要：

1. 在建構 `LanternVectorStore` 時傳入 `hybrid_search=True`（並可選地使用 `text_search_config` 設定所需的語言）。
2. 在建構 query engine 時傳入 `vector_store_query_mode="hybrid"`（此設定會在底層傳遞給 retriever）。您也可以可選地設定 `sparse_top_k` 以設定我們應從 sparse text search 取得多少結果（預設值使用與 `similarity_top_k` 相同的數值）。

```
from sqlalchemy import make_url


url = make_url(connection_string)
hybrid_vector_store = LanternVectorStore.from_params(
    database=db_name,
    host=url.host,
    password=url.password,
    port=url.port,
    user=url.username,
    table_name="paul_graham_essay_hybrid_search",
    embed_dim=1536,  # openai embedding dimension
    hybrid_search=True,
    text_search_config="english",
)


storage_context = StorageContext.from_defaults(
    vector_store=hybrid_vector_store
)
hybrid_index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

```
hybrid_query_engine = hybrid_index.as_query_engine(
    vector_store_query_mode="hybrid", sparse_top_k=2
)
hybrid_response = hybrid_query_engine.query(
    "Who does Paul Graham think of with the word schtick"
)
```

```
print(hybrid_response)
```
