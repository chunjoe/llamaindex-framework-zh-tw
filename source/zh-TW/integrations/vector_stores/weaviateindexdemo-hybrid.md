---
title: "Weaviate 向量資料庫 - 混合搜尋"
---

如果您在 colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-vector-stores-weaviate
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

## 建立一個 Weaviate Client

```
import os
import openai


os.environ["OPENAI_API_KEY"] = ""
openai.api_key = os.environ["OPENAI_API_KEY"]
```

```
import weaviate
```

```
# Connect to cloud instance
cluster_url = ""
api_key = ""


client = weaviate.connect_to_wcs(
    cluster_url=cluster_url,
    auth_credentials=weaviate.auth.AuthApiKey(api_key),
)


# Connect to local instance
# client = weaviate.connect_to_local()
```

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.vector_stores.weaviate import WeaviateVectorStore
from llama_index.core.response.notebook_utils import display_response
```

## 下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

## 載入 documents

```
# load documents
documents = SimpleDirectoryReader("./data/paul_graham/").load_data()
```

## 使用 WeaviateVectorStore 建構 VectorStoreIndex

```
from llama_index.core import StorageContext




vector_store = WeaviateVectorStore(weaviate_client=client)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)


# NOTE: you may also choose to define a index_name manually.
# index_name = "test_prefix"
# vector_store = WeaviateVectorStore(weaviate_client=client, index_name=index_name)
```

## 使用預設 Vector Search 查詢 Index

```
# set Logging to DEBUG for more detailed outputs
query_engine = index.as_query_engine(similarity_top_k=2)
response = query_engine.query("What did the author do growing up?")
```

```
display_response(response)
```

## 使用 Hybrid Search 查詢 Index

使用 bm25 和 vector 進行 hybrid search。
`alpha` parameter 決定權重 (alpha = 0 -> bm25, alpha=1 -> vector search)。

### 預設使用 `alpha=0.75` (與 vector search 非常相似)

```
# set Logging to DEBUG for more detailed outputs
query_engine = index.as_query_engine(
    vector_store_query_mode="hybrid", similarity_top_k=2
)
response = query_engine.query(
    "What did the author do growing up?",
)
```

```
display_response(response)
```

### 設定 `alpha=0.` 以偏向 bm25

```
# set Logging to DEBUG for more detailed outputs
query_engine = index.as_query_engine(
    vector_store_query_mode="hybrid", similarity_top_k=2, alpha=0.0
)
response = query_engine.query(
    "What did the author do growing up?",
)
```

```
display_response(response)
```
