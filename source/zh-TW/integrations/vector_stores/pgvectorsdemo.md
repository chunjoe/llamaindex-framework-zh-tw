---
title: "pgvecto.rs"
---

[![Open In Colab](/assets/e79852128a5f.svg)](https://colab.research.google.com/github/run-llama/llama_index/blob/main/docs/examples/vector_stores/PGVectoRsDemo.ipynb)

首先，您可能需要安裝依賴項：

```
%pip install llama-index-vector-stores-pgvecto-rs
```

```
%pip install llama-index "pgvecto_rs[sdk]"
```

然後按照 [official document 建議](https://github.com/tensorchord/pgvecto.rs#installation) 啟動 pgvecto.rs 伺服器：

```
!docker run --name pgvecto-rs-demo -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d tensorchord/pgvecto-rs:latest
```

設定 logger。

```
import logging
import os
import sys


logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))
```

#### 建立 pgvecto\_rs client

```
from pgvecto_rs.sdk import PGVectoRs


URL = "postgresql+psycopg://{username}:{password}@{host}:{port}/{db_name}".format(
    port=os.getenv("DB_PORT", "5432"),
    host=os.getenv("DB_HOST", "localhost"),
    username=os.getenv("DB_USER", "postgres"),
    password=os.getenv("DB_PASS", "mysecretpassword"),
    db_name=os.getenv("DB_NAME", "postgres"),
)


client = PGVectoRs(
    db_url=URL,
    collection_name="example",
    dimension=1536,  # Using OpenAI’s text-embedding-ada-002
)
```

#### 設定 OpenAI

```
import os


os.environ["OPENAI_API_KEY"] = "sk-..."
```

#### 載入 documents，建置 PGVectoRsStore 和 VectorStoreIndex

```
from IPython.display import Markdown, display


from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
from llama_index.vector_stores.pgvecto_rs import PGVectoRsStore
```

下載 Data

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

```
# load documents
documents = SimpleDirectoryReader("./data/paul_graham").load_data()
```

```
# initialize without metadata filter
from llama_index.core import StorageContext


vector_store = PGVectoRsStore(client=client)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

#### 查詢 Index

```
# set Logging to DEBUG for more detailed outputs
query_engine = index.as_query_engine()
response = query_engine.query("What did the author do growing up?")
```

```
INFO:httpx:HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
INFO:httpx:HTTP Request: POST https://api.openai.com/v1/chat/completions "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/chat/completions "HTTP/1.1 200 OK"
```

```
display(Markdown(f"<b>{response}</b>"))
```

**作者在成長過程中從事寫作和編程。他們寫了短篇故事，也嘗試在 IBM 1401 電腦上編寫程式。後來獲得了一台微型電腦，開始更深入地編程，寫簡單的遊戲和文字處理器。**