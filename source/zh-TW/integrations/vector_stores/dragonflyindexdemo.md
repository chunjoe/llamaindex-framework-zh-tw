---
title: "蜻蜓與 Vector Store"
---

在本筆筆記中，我們將快速演示如何使用 Dragonfly 與 Vector Store 協作。

如果您在 Colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install -U llama-index llama-index-vector-stores-redis llama-index-embeddings-cohere llama-index-embeddings-openai
```

```
import os
import getpass
import sys
import logging
import textwrap
import warnings


warnings.filterwarnings("ignore")


logging.basicConfig(stream=sys.stdout, level=logging.INFO)


from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.vector_stores.redis import RedisVectorStore
```

### 開始 Dragonfly

開始 Dragonfly 最簡單的方法是使用 Dragonfly docker 映像檔，或快速註冊一個 [Dragonfly Cloud](https://www.dragonflydb.io/cloud) 示範實例。

要遵循本教學的每一步，請按以下方式啟動映像檔：

終端機視窗

```
docker run -d -p 6379:6379 --name dragonfly docker.dragonflydb.io/dragonflydb/dragonfly
```

### 設定 OpenAI

我們先從新增 openai api 金鑰開始。這將使我們能夠存取 openai 進行 embeddings，並使用 chatgpt。

```
oai_api_key = getpass.getpass("OpenAI API Key:")
os.environ["OPENAI_API_KEY"] = oai_api_key
```

下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

```
--2025-06-30 14:41:20--  https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt
Resolving raw.githubusercontent.com (raw.githubusercontent.com)... 185.199.111.133, 185.199.108.133, 185.199.110.133, ...
Connecting to raw.githubusercontent.com (raw.githubusercontent.com)|185.199.111.133|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 75042 (73K) [text/plain]
Saving to: ‘data/paul_graham/paul_graham_essay.txt’


data/paul_graham/pa 100%[===================>]  73.28K  --.-KB/s    in 0.04s


2025-06-30 14:41:20 (2.00 MB/s) - ‘data/paul_graham/paul_graham_essay.txt’ saved [75042/75042]
```

### 讀取資料集

在這裡，我們將使用一組 Paul Graham 的文章來提供需要轉換為 embeddings 的文本，將其儲存到 vector store 中，並查詢以為我們的 LLM QnA loop 尋找上下文。

```
# load documents
documents = SimpleDirectoryReader("./data/paul_graham").load_data()
print(
    "Document ID:",
    documents[0].id_,
    "Document Filename:",
    documents[0].metadata["file_name"],
)
```

```
Document ID: a5cae17c-27eb-411e-8967-fb6ef98bcdcf Document Filename: paul_graham_essay.txt
```

### 初始化預設 vector store

現在我們已經準備好我們的 documents，我們可以將 vector store 初始化為 **default** settings。這將允許我們在 Dragonfly 中儲存我們的 vectors 並建立一個用於即時搜尋的 index。

```
from llama_index.core import StorageContext
from redis import Redis


# create a client connection
redis_client = Redis.from_url("redis://localhost:6379")


# create the vector store wrapper
vector_store = RedisVectorStore(redis_client=redis_client, overwrite=True)


# load storage context
storage_context = StorageContext.from_defaults(vector_store=vector_store)


# build and load index from documents and storage context
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

```
14:41:29 llama_index.vector_stores.redis.base INFO   Using default RedisVectorStore schema.
14:41:31 httpx INFO   HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
14:41:31 llama_index.vector_stores.redis.base INFO   Added 22 documents to index llama_index
```

### 查詢預設 vector store

現在我們已經將資料儲存在 index 中，我們可以對 index 提出問題。

index 將使用資料作為 LLM 的知識庫。as\_query\_engine() 的預設設定使用 OpenAI embeddings 和 GPT 作為語言模型。因此，除非您選擇自訂或本地語言模型，否則需要一個 OpenAI 金鑰。

以下我們將測試對 index 的搜尋，然後使用 LLM 進行完整的 RAG。

```
query_engine = index.as_query_engine()
retriever = index.as_retriever()
```

```
result_nodes = retriever.retrieve("What did the author learn?")
for node in result_nodes:
    print(node)
```

```
14:41:40 httpx INFO   HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
14:41:40 llama_index.vector_stores.redis.base INFO   Querying index llama_index with query *=>[KNN 2 @vector $vector AS vector_distance] RETURN 5 id doc_id text _node_content vector_distance SORTBY vector_distance ASC DIALECT 2 LIMIT 0 2
14:41:40 llama_index.vector_stores.redis.base INFO   Found 2 results for query with id ['llama_index/vector_f12d31cc-d154-4ae2-9511-81a1e0b2c185', 'llama_index/vector_a67c3af9-14cc-45fd-a2dd-142753a61d79']
Node ID: f12d31cc-d154-4ae2-9511-81a1e0b2c185
Text: What I Worked On  February 2021  Before college the two main
things I worked on, outside of school, were writing and programming. I
didn't write essays. I wrote what beginning writers were supposed to
write then, and probably still are: short stories. My stories were
awful. They had hardly any plot, just characters with strong feelings,
which I ...
Score:  0.819


Node ID: a67c3af9-14cc-45fd-a2dd-142753a61d79
Text: In the summer of 2016 we moved to England. We wanted our kids to
see what it was like living in another country, and since I was a
British citizen by birth, that seemed the obvious choice. We only
meant to stay for a year, but we liked it so much that we still live
there. So most of Bel was written in England.  In the fall of 2019,
Bel was final...
Score:  0.815
```

```
response = query_engine.query("What did the author learn?")
print(textwrap.fill(str(response), 100))
```

```
14:41:44 httpx INFO   HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
14:41:44 llama_index.vector_stores.redis.base INFO   Querying index llama_index with query *=>[KNN 2 @vector $vector AS vector_distance] RETURN 5 id doc_id text _node_content vector_distance SORTBY vector_distance ASC DIALECT 2 LIMIT 0 2
14:41:44 llama_index.vector_stores.redis.base INFO   Found 2 results for query with id ['llama_index/vector_f12d31cc-d154-4ae2-9511-81a1e0b2c185', 'llama_index/vector_a67c3af9-14cc-45fd-a2dd-142753a61d79']
14:41:45 httpx INFO   HTTP Request: POST https://api.openai.com/v1/chat/completions "HTTP/1.1 200 OK"
The author learned that philosophy courses in college were boring to him, leading him to switch his
focus to studying AI.
```

```
result_nodes = retriever.retrieve("What was a hard moment for the author?")
for node in result_nodes:
    print(node)
```

```
14:41:47 httpx INFO   HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
14:41:47 llama_index.vector_stores.redis.base INFO   Querying index llama_index with query *=>[KNN 2 @vector $vector AS vector_distance] RETURN 5 id doc_id text _node_content vector_distance SORTBY vector_distance ASC DIALECT 2 LIMIT 0 2
14:41:47 llama_index.vector_stores.redis.base INFO   Found 2 results for query with id ['llama_index/vector_8c02f420-3cfc-4da6-859b-97469872ef46', 'llama_index/vector_f12d31cc-d154-4ae2-9511-81a1e0b2c185']
Node ID: 8c02f420-3cfc-4da6-859b-97469872ef46
Text: HN was no doubt good for YC, but it was also by far the biggest
source of stress for me. If all I'd had to do was select and help
founders, life would have been so easy. And that implies that HN was a
mistake. Surely the biggest source of stress in one's work should at
least be something close to the core of the work. Whereas I was like
someone ...
Score:  0.804


Node ID: f12d31cc-d154-4ae2-9511-81a1e0b2c185
Text: What I Worked On  February 2021  Before college the two main
things I worked on, outside of school, were writing and programming. I
didn't write essays. I wrote what beginning writers were supposed to
write then, and probably still are: short stories. My stories were
awful. They had hardly any plot, just characters with strong feelings,
which I ...
Score:  0.802
```

```
response = query_engine.query("What was a hard moment for the author?")
print(textwrap.fill(str(response), 100))
```

```
14:41:51 httpx INFO   HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
14:41:51 llama_index.vector_stores.redis.base INFO   Querying index llama_index with query *=>[KNN 2 @vector $vector AS vector_distance] RETURN 5 id doc_id text _node_content vector_distance SORTBY vector_distance ASC DIALECT 2 LIMIT 0 2
14:41:51 llama_index.vector_stores.redis.base INFO   Found 2 results for query with id ['llama_index/vector_8c02f420-3cfc-4da6-859b-97469872ef46', 'llama_index/vector_f12d31cc-d154-4ae2-9511-81a1e0b2c185']
14:41:52 httpx INFO   HTTP Request: POST https://api.openai.com/v1/chat/completions "HTTP/1.1 200 OK"
Dealing with urgent problems related to Hacker News (HN) was a significant source of stress for the
author.
```

```
index.vector_store.delete_index()
```

```
14:41:55 llama_index.vector_stores.redis.base INFO   Deleting index llama_index
```

### 使用自訂 index schema

在大多數使用情境中，您需要能夠自訂底層的 index 配置和規格。例如，這對於定義您希望啟用特定 metadata 篩選器非常方便。

使用 Dragonfly，這只需定義一個 index schema object（來自檔案或 dict）並將其傳遞給 vector store client wrapper。

對於此範例，我們將：

1. 將 embedding model 切換為 [Cohere](https://cohere.com/)
2. 新增一個額外的 metadata 欄位用於 document `updated_at` timestamp
3. 對現有的 `file_name` metadata field 建立 index

```
from llama_index.core.settings import Settings
from llama_index.embeddings.cohere import CohereEmbedding


# set up Cohere Key
co_api_key = getpass.getpass("Cohere API Key:")


Settings.embed_model = CohereEmbedding(api_key=co_api_key)
```

```
from redisvl.schema import IndexSchema




custom_schema = IndexSchema.from_dict(
    {
        # customize basic index specs
        "index": {
            "name": "paul_graham",
            "prefix": "essay",
            "key_separator": ":",
        },
        # customize fields that are indexed
        "fields": [
            # required fields for llamaindex
            {"type": "tag", "name": "id"},
            {"type": "tag", "name": "doc_id"},
            {"type": "text", "name": "text"},
            # custom metadata fields
            {"type": "numeric", "name": "updated_at"},
            {"type": "tag", "name": "file_name"},
            # custom vector field definition for cohere embeddings
            {
                "type": "vector",
                "name": "vector",
                "attrs": {
                    "dims": 1024,
                    "algorithm": "hnsw",
                    "distance_metric": "cosine",
                },
            },
        ],
    }
)
```

```
custom_schema.index
```

```
IndexInfo(name='paul_graham', prefix='essay', key_separator=':', storage_type=<StorageType.HASH: 'hash'>)
```

```
custom_schema.fields
```

```
{'id': TagField(name='id', type=<FieldTypes.TAG: 'tag'>, path=None, attrs=TagFieldAttributes(sortable=False, separator=',', case_sensitive=False, withsuffixtrie=False)),
 'doc_id': TagField(name='doc_id', type=<FieldTypes.TAG: 'tag'>, path=None, attrs=TagFieldAttributes(sortable=False, separator=',', case_sensitive=False, withsuffixtrie=False)),
 'text': TextField(name='text', type=<FieldTypes.TEXT: 'text'>, path=None, attrs=TextFieldAttributes(sortable=False, weight=1, no_stem=False, withsuffixtrie=False, phonetic_matcher=None)),
 'updated_at': NumericField(name='updated_at', type=<FieldTypes.NUMERIC: 'numeric'>, path=None, attrs=NumericFieldAttributes(sortable=False)),
 'file_name': TagField(name='file_name', type=<FieldTypes.TAG: 'tag'>, path=None, attrs=TagFieldAttributes(sortable=False, separator=',', case_sensitive=False, withsuffixtrie=False)),
 'vector': HNSWVectorField(name='vector', type='vector', path=None, attrs=HNSWVectorFieldAttributes(dims=1024, algorithm=<VectorIndexAlgorithm.HNSW: 'HNSW'>, datatype=<VectorDataType.FLOAT32: 'FLOAT32'>, distance_metric=<VectorDistanceMetric.COSINE: 'COSINE'>, initial_cap=None, m=16, ef_construction=200, ef_runtime=10, epsilon=0.01))}
```

```
from datetime import datetime




def date_to_timestamp(date_string: str) -> int:
    date_format: str = "%Y-%m-%d"
    return int(datetime.strptime(date_string, date_format).timestamp())




# iterate through documents and add new field
for document in documents:
    document.metadata["updated_at"] = date_to_timestamp(
        document.metadata["last_modified_date"]
    )
```

```
vector_store = RedisVectorStore(
    schema=custom_schema,  # provide customized schema
    redis_client=redis_client,
    overwrite=True,
)


storage_context = StorageContext.from_defaults(vector_store=vector_store)


# build and load index from documents and storage context
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

```
14:42:26 httpx INFO   HTTP Request: POST https://api.cohere.com/v2/embed "HTTP/1.1 200 OK"
14:42:26 httpx INFO   HTTP Request: POST https://api.cohere.com/v2/embed "HTTP/1.1 200 OK"
14:42:27 httpx INFO   HTTP Request: POST https://api.cohere.com/v2/embed "HTTP/1.1 200 OK"
14:42:27 llama_index.vector_stores.redis.base INFO   Added 22 documents to index paul_graham
```

### 查詢 vector store 並篩選 metadata

現在我們在 Dragonfly 中新增了額外的 metadata，讓我們嘗試帶有篩選器的查詢。

```
from llama_index.core.vector_stores import (
    MetadataFilters,
    MetadataFilter,
    ExactMatchFilter,
)


retriever = index.as_retriever(
    similarity_top_k=3,
    filters=MetadataFilters(
        filters=[
            ExactMatchFilter(key="file_name", value="paul_graham_essay.txt"),
            MetadataFilter(
                key="updated_at",
                value=date_to_timestamp("2023-01-01"),
                operator=">=",
            ),
            MetadataFilter(
                key="text",
                value="learn",
                operator="text_match",
            ),
        ],
        condition="and",
    ),
)
```

```
result_nodes = retriever.retrieve("What did the author learn?")


for node in result_nodes:
    print(node)
```

```
14:42:37 httpx INFO   HTTP Request: POST https://api.cohere.com/v2/embed "HTTP/1.1 200 OK"
14:42:37 llama_index.vector_stores.redis.base INFO   Querying index paul_graham with query ((@file_name:{paul_graham_essay\.txt} @updated_at:[1672524000 +inf]) @text:(learn))=>[KNN 3 @vector $vector AS vector_distance] RETURN 5 id doc_id text _node_content vector_distance SORTBY vector_distance ASC DIALECT 2 LIMIT 0 3
14:42:37 llama_index.vector_stores.redis.base INFO   Found 3 results for query with id ['essay:30148f62-13c6-4edb-b09f-1cf3054c5c98', 'essay:054f9488-83c7-4bf6-a408-9ef17eea0446', 'essay:608adb71-a995-489d-81dc-0deab7bbe656']
Node ID: 30148f62-13c6-4edb-b09f-1cf3054c5c98
Text: If he even knew about the strange classes I was taking, he never
said anything.  So now I was in a PhD program in computer science, yet
planning to be an artist, yet also genuinely in love with Lisp hacking
and working away at On Lisp. In other words, like many a grad student,
I was working energetically on multiple projects that were not my
the...
Score:  0.404


Node ID: 054f9488-83c7-4bf6-a408-9ef17eea0446
Text: I wanted to go back to RISD, but I was now broke and RISD was
very expensive, so I decided to get a job for a year and then return
to RISD the next fall. I got one at a company called Interleaf, which
made software for creating documents. You mean like Microsoft Word?
Exactly. That was how I learned that low end software tends to eat
high end so...
Score:  0.396


Node ID: 608adb71-a995-489d-81dc-0deab7bbe656
Text: All that seemed left for philosophy were edge cases that people
in other fields felt could safely be ignored.  I couldn't have put
this into words when I was 18. All I knew at the time was that I kept
taking philosophy courses and they kept being boring. So I decided to
switch to AI.  AI was in the air in the mid 1980s, but there were two
things...
Score:  0.394
```

### 刪除 documents 或完全刪除 index

有時刪除 documents 或整個 index 可能是有用的。這可以使用 `delete` 和 `delete_index` 方法來完成。

```
document_id = documents[0].doc_id
document_id
```

```
print("Number of documents before deleting", redis_client.dbsize())
vector_store.delete(document_id)
print("Number of documents after deleting", redis_client.dbsize())
```

然而，index 仍然存在（沒有相關的 documents）。

```
vector_store.index_exists()
```

```
# now lets delete the index entirely
# this will delete all the documents and the index
vector_store.delete_index()
```

```
print("Number of documents after deleting", redis_client.dbsize())
```
