---
title: "資料擷取管線"
---

`IngestionPipeline` 使用 `Transformations` 的概念應用於輸入資料。這些 `Transformations` 應用於您的輸入資料，產生的 nodes 要麼會被回傳，要麼會插入到 vector database 中（如果提供）。每個 node+transformation 組合都會被快取，這樣後續的執行（如果快取是持久化的）使用相同的 node+transformation 組合可以利用快取結果，節省時間。

## 使用模式

最簡單的使用方式是像這樣實例化 `IngestionPipeline`：

```
from llama_index.core import Document
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.extractors import TitleExtractor
from llama_index.core.ingestion import IngestionPipeline, IngestionCache


# create the pipeline with transformations
pipeline = IngestionPipeline(
    transformations=[
        SentenceSplitter(chunk_size=25, chunk_overlap=0),
        TitleExtractor(),
        OpenAIEmbedding(),
    ]
)


# run the pipeline
nodes = pipeline.run(documents=[Document.example()])
```

請注意，在實際場景中，您會從 Llama Hub 的 `SimpleDirectoryReader` 或其他讀取器獲取您的 documents。

## 連接 Vector Databases

在執行 ingestion pipeline 時，您也可以選擇自動將結果的 nodes 插入到遠端 vector store 中。

然後，您可以稍後從該 vector store 建構 index。

```
from llama_index.core import Document
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.extractors import TitleExtractor
from llama_index.core.ingestion import IngestionPipeline
from llama_index.vector_stores.qdrant import QdrantVectorStore


import qdrant_client


client = qdrant_client.QdrantClient(location=":memory:")
vector_store = QdrantVectorStore(client=client, collection_name="test_store")


pipeline = IngestionPipeline(
    transformations=[
        SentenceSplitter(chunk_size=25, chunk_overlap=0),
        TitleExtractor(),
        OpenAIEmbedding(),
    ],
    vector_store=vector_store,
)


# Ingest directly into a vector db
pipeline.run(documents=[Document.example()])


# Create your index
from llama_index.core import VectorStoreIndex


index = VectorStoreIndex.from_vector_store(vector_store)
```

## 在 pipeline 中計算 embeddings

請注意，在上述範例中，embeddings 是作為 pipeline 的一部分進行計算的。如果您將您的 pipeline 連接到 vector store，embeddings 必須是您的 pipeline 的一個階段，否則您後續對 index 的實例化將會失敗。

如果您不連接到 vector store，可以從您的 pipeline 中省略 embeddings，即只產生一個 nodes 的列表。

## 快取 (Caching)

在 `IngestionPipeline` 中，每個 node + transformation 組合都會被雜湊並快取。這可以節省使用相同資料的後續執行時間。

以下部分描述了與快取相關的一些基本用法。

### 本地快取管理 (Local Cache Management)

一旦您有了 pipeline，您可能想儲存和載入快取。

```
# save
pipeline.persist("./pipeline_storage")


# load and restore state
new_pipeline = IngestionPipeline(
    transformations=[
        SentenceSplitter(chunk_size=25, chunk_overlap=0),
        TitleExtractor(),
    ],
)
new_pipeline.load("./pipeline_storage")


# will run instantly due to the cache
nodes = pipeline.run(documents=[Document.example()])
```

如果快取變得太大，您可以清除它

```
# delete all context of the cache
cache.clear()
```


### 遠端快取管理 (Remote Cache Management)

我們支援多個遠端儲存後端用於快取。

- `RedisCache`
- `MongoDBCache`
- `FirestoreCache`

以下是使用 `RedisCache` 的範例：

```
from llama_index.core import Document
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.extractors import TitleExtractor
from llama_index.core.ingestion import IngestionPipeline, IngestionCache
from llama_index.storage.kvstore.redis import RedisKVStore as RedisCache




ingest_cache = IngestionCache(
    cache=RedisCache.from_host_and_port(host="127.0.0.1", port=6379),
    collection="my_test_cache",
)


pipeline = IngestionPipeline(
    transformations=[
        SentenceSplitter(chunk_size=25, chunk_overlap=0),
        TitleExtractor(),
        OpenAIEmbedding(),
    ],
    cache=ingest_cache,
)


# Ingest directly into a vector db
nodes = pipeline.run(documents=[Document.example()])
```

在這裡，不需要 persist 步驟，因為在指定的遠端 collection 中，所有內容都會隨著進行被快取。

## Async 支援

`IngestionPipeline` 也支援 async 操作。

```
nodes = await pipeline.arun(documents=documents)
```


## Document 管理

將 `docstore` 附加到 ingestion pipeline 將啟用 document 管理。

使用 `document.doc_id` 或 `node.ref_doc_id` 作為 grounding point，ingestion pipeline 會主動尋找重複的 documents。

它的運作方式如下：

- 儲存一個 `doc_id` -> `document_hash` 的 map

- 如果附加了 vector store：

  - 如果偵測到重複的 `doc_id`，且 hash 發生變化，則會重新處理並 upsert document
  - 如果偵測到重複的 `doc_id` 且 hash 不變，則跳過 node

- 如果沒有附加 vector store：

  - 檢查每個 node 的所有現有 hash
  - 如果找到重複項，則跳過 node
  - 否則，處理 node

**注意：** 如果我們沒有附加 vector store，我們只能檢查和移除重複的輸入。

```
from llama_index.core.ingestion import IngestionPipeline
from llama_index.core.storage.docstore import SimpleDocumentStore


pipeline = IngestionPipeline(
    transformations=[...], docstore=SimpleDocumentStore()
)
```

完整的操作流程請參閱我們的 [demo notebook](https://developers.llamaindex.ai/python/examples/ingestion/document_management_pipeline/index.md)。

也請查看使用 [Redis 作為我們的整個 ingestion stack](https://developers.llamaindex.ai/python/examples/ingestion/redis_ingestion_pipeline/index.md) 的另一個指南。

## 並行處理 (Parallel Processing)

`IngestionPipeline` 的 `run` 方法可以與並行處理過程一起執行。它透過利用 `multiprocessing.Pool` 將 nodes 的批次分散到各個 processor 來實現。

要以並行處理方式執行，請將 `num_workers` 設定為您希望使用的處理器數量：

```
from llama_index.core.ingestion import IngestionPipeline


pipeline = IngestionPipeline(
    transformations=[...],
)
pipeline.run(documents=[...], num_workers=4)
```


## 模組 (Modules)

- [Transformations Guide](/python/framework/module_guides/loading/ingestion_pipeline/transformations/)
- [Advanced Ingestion Pipeline](https://developers.llamaindex.ai/python/examples/ingestion/advanced_ingestion_pipeline/index.md)
- [Async Ingestion Pipeline](https://developers.llamaindex.ai/python/examples/ingestion/async_ingestion_pipeline/index.md)
- [Document Management Pipeline](https://developers.llamaindex.ai/python/examples/ingestion/document_management_pipeline/index.md)
- [Redis Ingestion Pipeline](https://developers.llamaindex.ai/python/examples/ingestion/redis_ingestion_pipeline/index.md)
- [Google Drive Ingestion Pipeline](https://developers.llamaindex.ai/python/examples/ingestion/ingestion_gdrive/index.md)
- [Parallel Execution Pipeline](https://developers.llamaindex.ai/python/examples/ingestion/parallel_execution_ingestion_pipeline/index.md)