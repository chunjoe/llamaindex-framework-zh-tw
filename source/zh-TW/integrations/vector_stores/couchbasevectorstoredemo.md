---
title: "Couchbase Vector Store"
---

[Couchbase](https://couchbase.com/) 是一款屢獲殊榮的分散式 NoSQL cloud 資料庫，為您的所有 cloud、mobile、AI 和 edge computing 應用程式提供無與倫比的多功能性、效能、可擴展性及財務價值。Couchbase 透過為開發人員提供程式碼輔助 AI，並為應用程式提供 vector search。

Vector Search 是 Couchbase 中的 [全文 搜尋服務](https://docs.couchbase.com/server/current/learn/services-and-indexes/services/search-service.html)（Search Service）的一部分。

本教學說明如何在 Couchbase 中使用 Vector Search。您可以同時使用 [Couchbase Capella](https://www.couchbase.com/products/capella/) 和您自管理的 Couchbase Server。

## 安裝

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-vector-stores-couchbase llama-index
```

## 建立 Couchbase 連線

我們首先建立與 Couchbase cluster 的連線，然後將 cluster 物件傳遞給 Vector Store。

在這裡，我們使用使用者名稱和密碼進行連線。您也可以使用任何其他支援的方式連線到您的 cluster。

有關連線到 Couchbase cluster 的更多資訊，請查閱 [Python SDK 文件](https://docs.couchbase.com/python-sdk/current/hello-world/start-using-sdk.html#connect)。

```
COUCHBASE_CONNECTION_STRING = (
    "couchbase://localhost"  # or "couchbases://localhost" if using TLS
)
DB_USERNAME = "Administrator"
DB_PASSWORD = "P@ssword1!"
```

```
from datetime import timedelta


from couchbase.auth import PasswordAuthenticator
from couchbase.cluster import Cluster
from couchbase.options import ClusterOptions


auth = PasswordAuthenticator(DB_USERNAME, DB_PASSWORD)
options = ClusterOptions(auth)
cluster = Cluster(COUCHBASE_CONNECTION_STRING, options)


# Wait until the cluster is ready for use.
cluster.wait_until_ready(timedelta(seconds=5))
```

## 建立搜尋索引

目前，Search index 需要從 Couchbase Capella 或 Server UI 或使用 REST interface 建立。

讓我們在 `testing` bucket 上定義一個名為 `vector-index` 的 Search index。

對於此範例，我們在 UI 的 Search Service 上使用 Import Index 功能。

我們在測試 bucket 的 `_default` scope 上，對 `_default` collection 建立一個 index，將 vector field 設定為 `embedding`，維度為 1536，將 text field 設定為 text。我們還將所有欄位在 document 下的 metadata 中建立為 dynamic mapping，以應對不同的 document 結構。相似度指標設定為 `dot_product`。

#### 如何將索引匯入 Full Text Search service？

- [Couchbase Server](https://docs.couchbase.com/server/current/search/import-search-index.html)

  - 點擊 Search -> Add Index -> Import
  - 在 Import 畫面中複製以下 Index 定義
  - 點擊 Create Index 建立索引。

- [Couchbase Capella](https://docs.couchbase.com/cloud/search/import-search-index.html)

  - 將索引定義複製到新的檔案 `index.json`
  - 按照文件中的說明在 Capella 中匯入該檔案。
  - 點擊 Create Index 建立索引。

#### 索引定義

```
{
 "name": "vector-index",
 "type": "fulltext-index",
 "params": {
  "doc_config": {
   "docid_prefix_delim": "",
   "docid_regexp": "",
   "mode": "type_field",
   "type_field": "type"
  },
  "mapping": {
   "default_analyzer": "standard",
   "default_datetime_parser": "dateTimeOptional",
   "default_field": "_all",
   "default_mapping": {
    "dynamic": true,
    "enabled": true,
    "properties": {
     "metadata": {
      "dynamic": true,
      "enabled": true
     },
     "embedding": {
      "enabled": true,
      "dynamic": false,
      "fields": [
       {
        "dims": 1536,
        "index": true,
        "name": "embedding",
        "similarity": "dot_product",
        "type": "vector",
        "vector_index_optimized_for": "recall"
       }
      ]
     },
     "text": {
      "enabled": true,
      "dynamic": false,
      "fields": [
       {
        "index": true,
        "name": "text",
        "store": true,
        "type": "text"
       }
      ]
     }
    }
   },
   "default_type": "_default",
   "docvalues_dynamic": false,
   "index_dynamic": true,
   "store_dynamic": true,
   "type_field": "_type"
  },
  "store": {
   "indexType": "scorch",
   "segmentVersion": 16
  }
 },
 "sourceType": "gocbcore",
 "sourceName": "testing",
 "sourceParams": {},
 "planParams": {
  "maxPartitionsPerPIndex": 103,
  "indexPartitions": 10,
  "numReplicas": 0
 }
}
```

現在我們在 Couchbase cluster 中設定我們想要用於 Vector Search 的 bucket、scope 和 collection 名稱。

對於此範例，我們使用預設的 scope 和 collections。

```
BUCKET_NAME = "testing"
SCOPE_NAME = "_default"
COLLECTION_NAME = "_default"
SEARCH_INDEX_NAME = "vector-index"
```

```
# Import required packages
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core import StorageContext
from llama_index.core import Settings
from llama_index.vector_stores.couchbase import CouchbaseSearchVectorStore
```

對於本教學，我們將使用 OpenAI embeddings

```
import os
import getpass


os.environ["OPENAI_API_KEY"] = getpass.getpass("OpenAI API Key:")
```

```
OpenAI API Key: ········
```

```
import logging
import sys


logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))
```

#### 下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

```
--2024-04-09 23:31:46--  https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt
Resolving raw.githubusercontent.com (raw.githubusercontent.com)... 2606:50c0:8000::154, 2606:50c0:8001::154, 2606:50c0:8003::154, ...
Connecting to raw.githubusercontent.com (raw.githubusercontent.com)|2606:50c0:8000::154|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 75042 (73K) [text/plain]
Saving to: ‘data/paul_graham/paul_graham_essay.txt’


data/paul_graham/pa 100%[===================>]  73.28K  --.-KB/s    in 0.008s


2024-04-09 23:31:46 (8.97 MB/s) - ‘data/paul_graham/paul_graham_essay.txt’ saved [75042/75042]
```

### 載入 documents

```
# load documents
documents = SimpleDirectoryReader("./data/paul_graham/").load_data()
```

```
vector_store = CouchbaseSearchVectorStore(
    cluster=cluster,
    bucket_name=BUCKET_NAME,
    scope_name=SCOPE_NAME,
    collection_name=COLLECTION_NAME,
    index_name=SEARCH_INDEX_NAME,
)
```

```
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

```
INFO:httpx:HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
```

## 基本範例

我們向查詢引擎詢問關於我們剛才建立索引的文章的問題。

```
query_engine = index.as_query_engine()
response = query_engine.query("What were his investments in Y Combinator?")
print(response)
```

```
INFO:httpx:HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
INFO:httpx:HTTP Request: POST https://api.openai.com/v1/chat/completions "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/chat/completions "HTTP/1.1 200 OK"
His investments in Y Combinator were $6k per founder, totaling $12k in the typical two-founder case, in return for 6% equity.
```

## Metadata 篩選器

我們將建立一些帶有 metadata 的範例 documents，以便我們可以看到如何根據 metadata 篩選 documents。

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
vector_store.add(nodes)
```

```
['5abb42cf-7312-46eb-859e-60df4f92842a',
 'b90525f4-38bf-453c-a51a-5f0718bccc98',
 '22f732d0-da17-4bad-b3cd-b54e2102367a']
```

```
# Metadata filter
from llama_index.core.vector_stores import ExactMatchFilter, MetadataFilters


filters = MetadataFilters(
    filters=[ExactMatchFilter(key="theme", value="Mafia")]
)


retriever = index.as_retriever(filters=filters)


retriever.retrieve("What is inception about?")
```

```
INFO:httpx:HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"










[NodeWithScore(node=TextNode(id_='b90525f4-38bf-453c-a51a-5f0718bccc98', embedding=None, metadata={'director': 'Francis Ford Coppola', 'theme': 'Mafia'}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={}, text='The Godfather', start_char_idx=None, end_char_idx=None, text_template='{metadata_str}\n\n{content}', metadata_template='{key}: {value}', metadata_seperator='\n'), score=0.3068528194400547)]
```

## 自訂篩選器與覆蓋查詢

Couchbase 目前僅透過 LlamaIndex 支援 `ExactMatchFilters`。Couchbase 支援多種篩選器，包括 range filters、geospatial filters 等。要使用這些篩選器，您可以將它們作為一個字典列表傳遞給 `cb_search_options` parameter。關於 search\_options 的不同搜尋/查詢可能性，請參閱 [這裡](https://docs.couchbase.com/server/current/search/search-request-params.html#query-object)。

```
def custom_query(query, query_str):
    print("custom query", query)
    return query




query_engine = index.as_query_engine(
    vector_store_kwargs={
        "cb_search_options": {
            "query": {"match": "growing up", "field": "text"}
        },
        "custom_query": custom_query,
    }
)
response = query_engine.query("what were his investments in Y Combinator?")
print(response)
```

```
INFO:httpx:HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
INFO:httpx:HTTP Request: POST https://api.openai.com/v1/chat/completions "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/chat/completions "HTTP/1.1 200 OK"
His investments in Y Combinator were based on a combination of the deal he did with Julian ($10k for 10%) and what Robert said MIT grad students got for the summer ($6k). He invested $6k per founder, which in the typical two-founder case was $12k, in return for 6%.
```
