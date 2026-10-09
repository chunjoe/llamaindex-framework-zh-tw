---
title: "Milvus Vector Store 非同步 API"
---

本教學示範如何搭配 [LlamaIndex](https://www.llamaindex.ai/) 與 [Milvus](https://milvus.io/) 建立用於 RAG 的非同步文件處理流程。LlamaIndex 可協助處理文件，並將文件儲存在 Milvus 等向量資料庫中。透過 LlamaIndex 與 Milvus Python 用戶端程式庫的非同步 API，我們可以提高流程的吞吐量，有效率地處理並建立大量資料的索引。

本教學會先從高層次介紹如何使用 LlamaIndex 和 Milvus 的非同步方法建構 RAG，接著再介紹較低階的方法，並比較同步與非同步處理的效能。

## 開始之前

本頁的程式碼片段需要 pymilvus 和 llamaindex 相依套件。您可以使用以下指令安裝：

```
! pip install -U pymilvus llama-index-vector-stores-milvus llama-index nest-asyncio
```

> 如果您使用 Google Colab，為了啟用剛安裝的相依套件，可能需要**重新啟動執行階段**（點選畫面上方的「Runtime」選單，再從下拉式選單選擇「Restart session」）。

我們會使用 OpenAI 的模型。請先取得[API 金鑰](https://platform.openai.com/docs/quickstart)，並將 `OPENAI_API_KEY` 設為環境變數。

```
import os


os.environ["OPENAI_API_KEY"] = "sk-***********"
```

如果您使用 Jupyter Notebook，請在執行非同步程式碼前先執行這一行程式碼。

```
import nest_asyncio


nest_asyncio.apply()
```

### 準備資料

您可以使用以下指令下載範例資料：

```
! mkdir -p 'data/'
! wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham_essay.txt'
! wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/10k/uber_2021.pdf' -O 'data/uber_2021.pdf'
```

## 使用非同步處理建構 RAG

本節說明如何建構可非同步處理文件的 RAG 系統。

匯入必要的程式庫，並定義 Milvus URI 和嵌入向量的維度。

```
import asyncio
import random
import time


from llama_index.core.schema import TextNode, NodeRelationship, RelatedNodeInfo
from llama_index.core.vector_stores import VectorStoreQuery
from llama_index.vector_stores.milvus import MilvusVectorStore


URI = "http://localhost:19530"
DIM = 768
```

> - 如果資料量很大，您可以透過 [Docker 或 Kubernetes](https://milvus.io/docs/quickstart.md) 部署效能良好的 Milvus 伺服器。此設定請使用伺服器 URI（例如 `http://localhost:19530`）作為 `uri`。
> - 若要使用 [Zilliz Cloud](https://zilliz.com/cloud) 這項全代管的 Milvus 雲端服務，請調整 `uri` 和 `token`；它們對應至 Zilliz Cloud 中的[公開端點與 API 金鑰](https://docs.zilliz.com/docs/on-zilliz-cloud-console#free-cluster-details)。
> - 對於網路通訊等複雜系統，相較於同步處理，非同步處理能提升效能。因此，我們認為 Milvus-Lite 不適合使用非同步介面，因為它的使用情境並不適合。

定義一個初始化函式，之後可再次使用它來重建 Milvus 集合。

```
def init_vector_store():
    return MilvusVectorStore(
        uri=URI,
        # token=TOKEN,
        dim=DIM,
        collection_name="test_collection",
        embedding_field="embedding",
        id_field="id",
        similarity_metric="COSINE",
        consistency_level="Strong",
        overwrite=True,  # To overwrite the collection if it already exists
    )




vector_store = init_vector_store()
```

```
2025-01-24 20:04:39,414 [DEBUG][_create_connection]: Created new connection using: faa8be8753f74288bffc7e6d38942f8a (async_milvus_client.py:600)
```

使用 SimpleDirectoryReader，從 `paul_graham_essay.txt` 檔案建立 LlamaIndex 文件物件。

```
from llama_index.core import SimpleDirectoryReader


# load documents
documents = SimpleDirectoryReader(
    input_files=["./data/paul_graham_essay.txt"]
).load_data()


print("Document ID:", documents[0].doc_id)
```

```
Document ID: 41a6f99c-489f-49ff-9821-14e2561140eb
```

在本機初始化 Hugging Face 嵌入模型，可避免非同步插入資料時觸及 API 速率限制；並行 API 請求可能迅速累積，耗盡公開 API 的配額。不過，如果您的速率限制較高，也可以改用遠端模型服務。

```
from llama_index.embeddings.huggingface import HuggingFaceEmbedding




embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-base-en-v1.5")
```

建立索引並插入文件。

我們將 `use_async` 設為 `True`，以啟用非同步插入模式。

```
# Create an index over the documents
from llama_index.core import VectorStoreIndex, StorageContext


storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents,
    storage_context=storage_context,
    embed_model=embed_model,
    use_async=True,
)
```

初始化 LLM。

```
from llama_index.llms.openai import OpenAI


llm = OpenAI(model="gpt-3.5-turbo")
```

建立查詢引擎時，也可以將 `use_async` 參數設為 `True`，以啟用非同步搜尋。

```
query_engine = index.as_query_engine(use_async=True, llm=llm)
response = await query_engine.aquery("What did the author learn?")
```

```
print(response)
```

```
The author learned that the field of artificial intelligence, as practiced at the time, was not as promising as initially believed. The approach of using explicit data structures to represent concepts in AI was not effective in achieving true understanding of natural language. This realization led the author to shift his focus towards Lisp and eventually towards exploring the field of art.
```

## 探索非同步 API

本節將介紹較低階的 API 用法，並比較同步與非同步執行的效能。

### 非同步新增

重新初始化向量儲存庫。

```
vector_store = init_vector_store()
```

```
2025-01-24 20:07:38,727 [DEBUG][_create_connection]: Created new connection using: 5e0d130f3b644555ad7ea6b8df5f1fc2 (async_milvus_client.py:600)
```

接著定義一個產生 node 的函式，供索引產生大量測試 nodes。

```
def random_id():
    random_num_str = ""
    for _ in range(16):
        random_digit = str(random.randint(0, 9))
        random_num_str += random_digit
    return random_num_str




def produce_nodes(num_adding):
    node_list = []
    for i in range(num_adding):
        node = TextNode(
            id_=random_id(),
            text=f"n{i}_text",
            embedding=[0.5] * (DIM - 1) + [random.random()],
            relationships={
                NodeRelationship.SOURCE: RelatedNodeInfo(node_id=f"n{i+1}")
            },
        )
        node_list.append(node)
    return node_list
```

定義一個異步函式來將 documents 添加到 vector store 中。我們在 Milvus vector store instance 中使用 `async_add()` 函式。

```
async def async_add(num_adding):
    node_list = produce_nodes(num_adding)
    start_time = time.time()
    tasks = []
    for i in range(num_adding):
        sub_nodes = node_list[i]
        task = vector_store.async_add([sub_nodes])  # use async_add()
        tasks.append(task)
    results = await asyncio.gather(*tasks)
    end_time = time.time()
    return end_time - start_time
```

```
add_counts = [10, 100, 1000]
```

取得 event loop。

```
loop = asyncio.get_event_loop()
```

異步地將 documents 添加到 vector store。

```
for count in add_counts:


    async def measure_async_add():
        async_time = await async_add(count)
        print(f"Async add for {count} took {async_time:.2f} seconds")
        return async_time


    loop.run_until_complete(measure_async_add())
```

```
Async add for 10 took 0.19 seconds
Async add for 100 took 0.48 seconds
Async add for 1000 took 3.22 seconds
```

```
vector_store = init_vector_store()
```

```
2025-01-24 20:07:45,554 [DEBUG][_create_connection]: Created new connection using: b14dde8d6d24489bba26a907593f692d (async_milvus_client.py:600)
```

#### 與同步添加比較

定義一個 sync add 函式。然後在相同條件下測量執行時間。

```
def sync_add(num_adding):
    node_list = produce_nodes(num_adding)
    start_time = time.time()
    for node in node_list:
        result = vector_store.add([node])
    end_time = time.time()
    return end_time - start_time
```

```
for count in add_counts:
    sync_time = sync_add(count)
    print(f"Sync add for {count} took {sync_time:.2f} seconds")
```

```
Sync add for 10 took 0.56 seconds
Sync add for 100 took 5.85 seconds
Sync add for 1000 took 62.91 seconds
```

結果顯示同步添加過程比異步過程慢得多。

### 異步搜尋

在執行搜尋前，重新初始化 vector store 並添加一些 documents。

```
vector_store = init_vector_store()
node_list = produce_nodes(num_adding=1000)
inserted_ids = vector_store.add(node_list)
```

```
2025-01-24 20:08:57,982 [DEBUG][_create_connection]: Created new connection using: 351dc7ea4fb14d4386cfab02621ab7d1 (async_milvus_client.py:600)
```

定義一個 async search 函式。我們在 Milvus vector store instance 中使用 `aquery()` 函式。

```
async def async_search(num_queries):
    start_time = time.time()
    tasks = []
    for _ in range(num_queries):
        query = VectorStoreQuery(
            query_embedding=[0.5] * (DIM - 1) + [0.6], similarity_top_k=3
        )
        task = vector_store.aquery(query=query)  # use aquery()
        tasks.append(task)
    results = await asyncio.gather(*tasks)
    end_time = time.time()
    return end_time - start_time
```

```
query_counts = [10, 100, 1000]
```

從 Milvus store 異步搜尋。

```
for count in query_counts:


    async def measure_async_search():
        async_time = await async_search(count)
        print(
            f"Async search for {count} queries took {async_time:.2f} seconds"
        )
        return async_time


    loop.run_until_complete(measure_async_search())
```

```
Async search for 10 queries took 0.55 seconds
Async search for 100 queries took 1.39 seconds
Async search for 1000 queries took 8.81 seconds
```

#### 與同步搜尋比較

定義一個 sync search 函式。然後在相同條件下測量執行時間。

```
def sync_search(num_queries):
    start_time = time.time()
    for _ in range(num_queries):
        query = VectorStoreQuery(
            query_embedding=[0.5] * (DIM - 1) + [0.6], similarity_top_k=3
        )
        result = vector_store.query(query=query)
    end_time = time.time()
    return end_time - start_time
```

```
for count in query_counts:
    sync_time = sync_search(count)
    print(f"Sync search for {count} queries took {sync_time:.2f} seconds")
```

```
Sync search for 10 queries took 3.29 seconds
Sync search for 100 queries took 30.80 seconds
Sync search for 1000 queries took 308.80 seconds
```

結果顯示同步搜尋過程比異步過程慢得多。