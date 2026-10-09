---
title: "Redis 向量儲存"
---


這份 Notebook 將快速示範如何使用 RedisVectorStore。

如果您在 Colab 開啟這份 Notebook，可能需要先安裝 LlamaIndex 🦙。

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


# Uncomment to see debug logs
logging.basicConfig(stream=sys.stdout, level=logging.INFO)


from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.vector_stores.redis import RedisVectorStore
```

### 啟動 Redis

啟動 Redis 最簡單的方式是使用 [Redis Stack](https://hub.docker.com/r/redis/redis-stack) Docker 映像，或快速註冊 [免費 Redis Cloud](https://redis.com/try-free) 執行個體。

若要依照本教學完成所有步驟，請使用以下指令啟動映像：

終端機視窗

```
docker run --name redis-vecdb -d -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
```

這也會在連接埠 8001 啟動 RedisInsight UI，您可以前往 <http://localhost:8001> 開啟。

### 設定 OpenAI

首先加入 OpenAI API 金鑰，之後即可使用 OpenAI 產生嵌入向量，並使用 ChatGPT。

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
--2024-04-10 19:35:33--  https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt
Resolving raw.githubusercontent.com (raw.githubusercontent.com)... 2606:50c0:8003::154, 2606:50c0:8000::154, 2606:50c0:8002::154, ...
Connecting to raw.githubusercontent.com (raw.githubusercontent.com)|2606:50c0:8003::154|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 75042 (73K) [text/plain]
Saving to: ‘data/paul_graham/paul_graham_essay.txt’


data/paul_graham/pa 100%[===================>]  73.28K  --.-KB/s    in 0.03s


2024-04-10 19:35:33 (2.15 MB/s) - ‘data/paul_graham/paul_graham_essay.txt’ saved [75042/75042]
```

### 載入資料集

這裡會使用一組 Paul Graham 的文章，將文字轉成嵌入向量並存入 `RedisVectorStore`，再透過查詢取得 LLM 問答流程所需的上下文。

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
Document ID: 7056f7ba-3513-4ef4-9792-2bd28040aaed Document Filename: paul_graham_essay.txt
```

### 初始化預設 Redis Vector Store

文件準備完成後，就可以使用 **default** 設定初始化 Redis Vector Store，將向量存入 Redis，並建立索引以進行即時搜尋。

```
from llama_index.core import StorageContext
from redis import Redis


# create a Redis client connection
redis_client = Redis.from_url("redis://localhost:6379")


# create the vector store wrapper
vector_store = RedisVectorStore(redis_client=redis_client, overwrite=True)


# load storage context
storage_context = StorageContext.from_defaults(vector_store=vector_store)


# build and load index from documents and storage context
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
# index = VectorStoreIndex.from_vector_store(vector_store=vector_store)
```

```
19:39:17 llama_index.vector_stores.redis.base INFO   Using default RedisVectorStore schema.
19:39:19 httpx INFO   HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
19:39:19 llama_index.vector_stores.redis.base INFO   Added 22 documents to index llama_index
```

### 查詢預設向量儲存

資料存入索引後，就可以針對索引提出問題。

索引會將這些資料作為 LLM 的知識庫。預設的 as\_query\_engine() 會使用 OpenAI 嵌入向量，並以 GPT 作為語言模型。因此，除非改用自訂或本機語言模型，否則必須提供 OpenAI 金鑰。

接下來會先測試索引搜尋，再使用 LLM 執行完整的 RAG 流程。

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
19:39:22 httpx INFO   HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
19:39:22 llama_index.vector_stores.redis.base INFO   Querying index llama_index with filters *
19:39:22 llama_index.vector_stores.redis.base INFO   Found 2 results for query with id ['llama_index/vector_adb6b7ce-49bb-4961-8506-37082c02a389', 'llama_index/vector_e39be1fe-32d0-456e-b211-4efabd191108']
Node ID: adb6b7ce-49bb-4961-8506-37082c02a389
Text: What I Worked On  February 2021  Before college the two main
things I worked on, outside of school, were writing and programming. I
didn't write essays. I wrote what beginning writers were supposed to
write then, and probably still are: short stories. My stories were
awful. They had hardly any plot, just characters with strong feelings,
which I ...
Score:  0.820


Node ID: e39be1fe-32d0-456e-b211-4efabd191108
Text: Except for a few officially anointed thinkers who went to the
right parties in New York, the only people allowed to publish essays
were specialists writing about their specialties. There were so many
essays that had never been written, because there had been no way to
publish them. Now they could be, and I was going to write them. [12]
I've wor...
Score:  0.819
```

```
response = query_engine.query("What did the author learn?")
print(textwrap.fill(str(response), 100))
```

```
19:39:25 httpx INFO   HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
19:39:25 llama_index.vector_stores.redis.base INFO   Querying index llama_index with filters *
19:39:25 llama_index.vector_stores.redis.base INFO   Found 2 results for query with id ['llama_index/vector_adb6b7ce-49bb-4961-8506-37082c02a389', 'llama_index/vector_e39be1fe-32d0-456e-b211-4efabd191108']
19:39:27 httpx INFO   HTTP Request: POST https://api.openai.com/v1/chat/completions "HTTP/1.1 200 OK"
The author learned that working on things that weren't prestigious often led to valuable discoveries
and indicated the right kind of motives. Despite the lack of initial prestige, pursuing such work
could be a sign of genuine potential and appropriate motivations, steering clear of the common
pitfall of being driven solely by the desire to impress others.
```

```
result_nodes = retriever.retrieve("What was a hard moment for the author?")
for node in result_nodes:
    print(node)
```

```
19:39:27 httpx INFO   HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
19:39:27 llama_index.vector_stores.redis.base INFO   Querying index llama_index with filters *
19:39:27 llama_index.vector_stores.redis.base INFO   Found 2 results for query with id ['llama_index/vector_adb6b7ce-49bb-4961-8506-37082c02a389', 'llama_index/vector_e39be1fe-32d0-456e-b211-4efabd191108']
Node ID: adb6b7ce-49bb-4961-8506-37082c02a389
Text: What I Worked On  February 2021  Before college the two main
things I worked on, outside of school, were writing and programming. I
didn't write essays. I wrote what beginning writers were supposed to
write then, and probably still are: short stories. My stories were
awful. They had hardly any plot, just characters with strong feelings,
which I ...
Score:  0.802


Node ID: e39be1fe-32d0-456e-b211-4efabd191108
Text: Except for a few officially anointed thinkers who went to the
right parties in New York, the only people allowed to publish essays
were specialists writing about their specialties. There were so many
essays that had never been written, because there had been no way to
publish them. Now they could be, and I was going to write them. [12]
I've wor...
Score:  0.799
```

```
response = query_engine.query("What was a hard moment for the author?")
print(textwrap.fill(str(response), 100))
```

```
19:39:29 httpx INFO   HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
19:39:29 llama_index.vector_stores.redis.base INFO   Querying index llama_index with filters *
19:39:29 llama_index.vector_stores.redis.base INFO   Found 2 results for query with id ['llama_index/vector_adb6b7ce-49bb-4961-8506-37082c02a389', 'llama_index/vector_e39be1fe-32d0-456e-b211-4efabd191108']
19:39:31 httpx INFO   HTTP Request: POST https://api.openai.com/v1/chat/completions "HTTP/1.1 200 OK"
A hard moment for the author was when one of his programs on the IBM 1401 mainframe didn't
terminate, leading to a technical error and an uncomfortable situation with the data center manager.
```

```
index.vector_store.delete_index()
```

```
19:39:34 llama_index.vector_stores.redis.base INFO   Deleting index llama_index
```

### 使用自訂索引 Schema

多數情況下，您會需要自訂底層索引的設定與規格，例如指定要啟用的 metadata 篩選條件。

在 Redis 中，只要定義索引 schema 物件（可從檔案或 dict 建立），再將它傳入 vector store 用戶端包裝器即可。

本範例會進行以下調整：

1. 將嵌入模型改為 [Cohere](https://developers.llamaindex.ai/python/framework/integrations/vector_stores/redisindexdemo/cohereai.com/)
2. 新增文件時間戳記 `updated_at` metadata 欄位
3. 將現有的 `file_name` metadata 欄位加入索引

```
from llama_index.core.settings import Settings
from llama_index.embeddings.cohere import CohereEmbedding


# set up Cohere Key
co_api_key = getpass.getpass("Cohere API Key:")
os.environ["CO_API_KEY"] = co_api_key


# set llamaindex to use Cohere embeddings
Settings.embed_model = CohereEmbedding()
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
{'id': TagField(name='id', type='tag', path=None, attrs=TagFieldAttributes(sortable=False, separator=',', case_sensitive=False, withsuffixtrie=False)),
 'doc_id': TagField(name='doc_id', type='tag', path=None, attrs=TagFieldAttributes(sortable=False, separator=',', case_sensitive=False, withsuffixtrie=False)),
 'text': TextField(name='text', type='text', path=None, attrs=TextFieldAttributes(sortable=False, weight=1, no_stem=False, withsuffixtrie=False, phonetic_matcher=None)),
 'updated_at': NumericField(name='updated_at', type='numeric', path=None, attrs=NumericFieldAttributes(sortable=False)),
 'file_name': TagField(name='file_name', type='tag', path=None, attrs=TagFieldAttributes(sortable=False, separator=',', case_sensitive=False, withsuffixtrie=False)),
 'vector': HNSWVectorField(name='vector', type='vector', path=None, attrs=HNSWVectorFieldAttributes(dims=1024, algorithm=<VectorIndexAlgorithm.HNSW: 'HNSW'>, datatype=<VectorDataType.FLOAT32: 'FLOAT32'>, distance_metric=<VectorDistanceMetric.COSINE: 'COSINE'>, initial_cap=None, m=16, ef_construction=200, ef_runtime=10, epsilon=0.01))}
```

進一步了解 [schema 與索引設計](https://redisvl.com/)（Redis）。

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
19:40:05 httpx INFO   HTTP Request: POST https://api.cohere.ai/v1/embed "HTTP/1.1 200 OK"
19:40:06 httpx INFO   HTTP Request: POST https://api.cohere.ai/v1/embed "HTTP/1.1 200 OK"
19:40:06 httpx INFO   HTTP Request: POST https://api.cohere.ai/v1/embed "HTTP/1.1 200 OK"
19:40:06 llama_index.vector_stores.redis.base INFO   Added 22 documents to index paul_graham
```

### 查詢向量儲存並依 Metadata 篩選

額外的 metadata 已加入 Redis 索引，現在來試試搭配篩選條件進行查詢。

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
19:40:22 httpx INFO   HTTP Request: POST https://api.cohere.ai/v1/embed "HTTP/1.1 200 OK"




19:40:22 llama_index.vector_stores.redis.base INFO   Querying index paul_graham with filters ((@file_name:{paul_graham_essay\.txt} @updated_at:[1672549200 +inf]) @text:(learn))
19:40:22 llama_index.vector_stores.redis.base INFO   Found 3 results for query with id ['essay:0df3b734-ecdb-438e-8c90-f21a8c80f552', 'essay:01108c0d-140b-4dcc-b581-c38b7df9251e', 'essay:ced36463-ac36-46b0-b2d7-935c1b38b781']
Node ID: 0df3b734-ecdb-438e-8c90-f21a8c80f552
Text: All that seemed left for philosophy were edge cases that people
in other fields felt could safely be ignored.  I couldn't have put
this into words when I was 18. All I knew at the time was that I kept
taking philosophy courses and they kept being boring. So I decided to
switch to AI.  AI was in the air in the mid 1980s, but there were two
things...
Score:  0.410


Node ID: 01108c0d-140b-4dcc-b581-c38b7df9251e
Text: It was not, in fact, simply a matter of teaching SHRDLU more
words. That whole way of doing AI, with explicit data structures
representing concepts, was not going to work. Its brokenness did, as
so often happens, generate a lot of opportunities to write papers
about various band-aids that could be applied to it, but it was never
going to get us ...
Score:  0.390


Node ID: ced36463-ac36-46b0-b2d7-935c1b38b781
Text: Grad students could take classes in any department, and my
advisor, Tom Cheatham, was very easy going. If he even knew about the
strange classes I was taking, he never said anything.  So now I was in
a PhD program in computer science, yet planning to be an artist, yet
also genuinely in love with Lisp hacking and working away at On Lisp.
In other...
Score:  0.389
```

### 從 Redis 的既有索引還原

從索引還原時，需要提供 Redis 連線用戶端（或 URL）、`overwrite=False`，並傳入先前使用的相同 schema 物件。您也可以使用 `.to_yaml()` 將設定存入 YAML 檔案，方便日後載入。

```
custom_schema.to_yaml("paul_graham.yaml")
```

```
vector_store = RedisVectorStore(
    schema=IndexSchema.from_yaml("paul_graham.yaml"),
    redis_client=redis_client,
)
index = VectorStoreIndex.from_vector_store(vector_store=vector_store)
```

```
19:40:28 redisvl.index.index INFO   Index already exists, not overwriting.
```

**未來版本** — 我們會提供便利方法，讓您只需指定索引名稱即可載入：

```
RedisVectorStore.from_existing_index(index_name="paul_graham", redis_client=redis_client)
```

### 刪除文件或整個索引

有時可能需要刪除文件或整個索引，可使用 `delete` 和 `delete_index` 方法完成。

```
document_id = documents[0].doc_id
document_id
```

```
'7056f7ba-3513-4ef4-9792-2bd28040aaed'
```

```
print("Number of documents before deleting", redis_client.dbsize())
vector_store.delete(document_id)
print("Number of documents after deleting", redis_client.dbsize())
```

```
Number of documents before deleting 22
19:40:32 llama_index.vector_stores.redis.base INFO   Deleted 22 documents from index paul_graham
Number of documents after deleting 0
```

不過，Redis 索引仍會保留（其中不含任何文件），以便後續持續執行 upsert。

```
vector_store.index_exists()
```

```
True
```

```
# now lets delete the index entirely
# this will delete all the documents and the index
vector_store.delete_index()
```

```
19:40:37 llama_index.vector_stores.redis.base INFO   Deleting index paul_graham
```

```
print("Number of documents after deleting", redis_client.dbsize())
```

```
Number of documents after deleting 0
```

### 疑難排解

如果您得到空查詢結果，請檢查以下幾點：

#### 索引 Schema

與其他 vector stores 不同，Redis 要求使用者明確定義索引的 schema。這是基於以下幾個原因：

1. Redis 用於多種用例，包括即時 vector search，但也用於標準的 document 儲存/檢索、caching、messaging、pub/sub、session mangement 等。記錄上的所有屬性不需要都進行索引。這部分是為了效率，部分是為了盡量減少使用者的負擔。
2. 使用 Redis & LlamaIndex 時，所有索引 schema 至少必須包含以下欄位 `id`、`doc_id`、`text` 和 `vector`。

使用預設 schema（假設 OpenAI embeddings），或使用自訂 schema（請參閱上方）來實例化您的 `RedisVectorStore`。

#### 前綴問題

Redis 要求所有記錄都具有一個 key prefix，用於將 keyspace 劃分為「partitions」，以適應可能不同的應用程式、用例和客戶端。

請確保所選的 `prefix`，作為索引 schema 的一部分，在您的程式碼中保持一致（與特定的索引綁定）。

要查看您的索引是用哪個 prefix 建立的，您可以在 Redis CLI 中運行 `FT.INFO <name of your index>`，並查看 `index_definition` => `prefixes` 下的內容。

#### 資料 vs 索引

Redis 將資料集中的記錄和索引視為不同的實體。這讓您在執行更新、upserts 和索引 schema migration 時擁有更大的靈活性。

如果您有一個現有的索引，並想確認它是否被刪除，您可以在 Redis CLI 中運行 `FT.DROPINDEX <name of your index>`。請注意，除非您傳遞 `DD`，否則這**不會**刪除您的實際資料。

#### 使用 metadata 時的空查詢

如果您在索引建立**之後**才向索引添加 metadata，然後嘗試對該 metadata 進行查詢，您的查詢將會回傳空結果。

Redis 僅在索引建立時對欄位進行索引（類似於它對 prefix 的索引方式，如上所述）。