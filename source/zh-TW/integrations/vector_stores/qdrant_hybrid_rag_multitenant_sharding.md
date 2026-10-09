---
title: "Hybrid RAG 與 Qdrant：多租戶、自訂分片、分散式設定"
---

## 您將建立的內容

本 Notebook 實作了基於 LlamaIndex 的生產級 Hybrid RAG，使用 Qdrant，專為多租戶和透過自訂分片 (custom sharding) 進行擴展而設計。

- Hybrid search：使用 dense embeddings + sparse BM25 以獲得更高的召回率和精確度。
- 多租戶 (Multitenancy)：使用 payload filters 和 shard routing 來隔離租戶。
- 自訂分片 (Custom sharding)：為每個租戶保持本地化，以提高效能和成本效益。
- 分散式 Qdrant：設定多 node，並帶有複製 (replication) 以實現高可用性和吞吐量。

本 Notebook 將引導您完成一個端到端 (end to end) 的 Retrieval Augmented Generation workflow，該流程使用 Qdrant 作為分散式 hybrid search back-end，並使用 LlamaIndex 作為 orchestration layer。您將建立一個感知租戶的 RAG，它結合了 dense vectors 和 sparse signals，使用 filters 隔離每個租戶的資料，並使用自訂的 shard key 來路由資料和查詢以實現擴展。

## 安裝依賴項

### 關於依賴項

- llama-index：用於資料攝取 (ingestion)、索引 (indexing) 和檢索 (retrieval) 的 orchestration layer。
- llama-index-vector-stores-qdrant：與 hybrid 支援整合的 Qdrant。
- fastembed：輕量級、對 CPU 友善的 embedding/sparse 模型。

```
%pip install -U llama-index llama-index-vector-stores-qdrant fastembed
```

請確保您已啟動一個分散式 Qdrant cluster。以下是一個 `compose.yaml` 檔案：

```
services:
  qdrant_primary:
    image: "qdrant/qdrant:latest"
    ports:
      - "6333:6333"
    environment:
      QDRANT__CLUSTER__ENABLED: "true"
    command: ["./qdrant", "--uri", "http://qdrant_primary:6335"]
    restart: always
  qdrant_secondary:
    image: "qdrant/qdrant:latest"
    environment:
      QDRANT__CLUSTER__ENABLED: "true"
    command: ["./qdrant", "--bootstrap", "http://qdrant_primary:6335"]
    restart: always
```

## 匯入與全局 settings

### Settings 與連線

- Embeddings：`FastEmbedEmbedding('BAAI/bge-base-en-v1.5')` 是一個緊湊、高品質的基準模型。
- Connection：`QDRANT_URL` 預設指向 HTTP endpoint；設定 `QDRANT_API_KEY` 以用於安全/雲端設定。

```
import os


from qdrant_client import AsyncQdrantClient, QdrantClient
from qdrant_client import models


from llama_index.core import (
    Settings,
    VectorStoreIndex,
    Document,
    StorageContext,
)
from llama_index.vector_stores.qdrant import QdrantVectorStore
from llama_index.embeddings.fastembed import FastEmbedEmbedding


# Embeddings, small and fast
Settings.embed_model = FastEmbedEmbedding(model_name="BAAI/bge-base-en-v1.5")


# Qdrant connection, local by default, set QDRANT_URL and QDRANT_API_KEY for cloud
QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")


client: QdrantClient = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
aclient: AsyncQdrantClient = AsyncQdrantClient(
    url=QDRANT_URL, api_key=QDRANT_API_KEY
)
COLLECTION = "hybrid_rag_multitenant_sharding_demo"
```

## 建立可分散式集合 (collection)

### 設定雙向量 Schema (dense + sparse)

- 定義向量欄位名稱：`dense` 用於 embeddings，`sparse` 用於 BM25-style signals。

- Dense 設定：

  - 在執行時透過 probing `Settings.embed_model` 來確定 embedding 的維度（避免硬編碼）。
  - 使用 cosine distance 進行語義相似度計算。

- Sparse 設定：

  - 啟用 in-memory sparse index (`on_disk=False`) 以支援 hybrid scoring。

- 這些 settings 建立了集合的 dual-index layout，稍後由 QdrantVectorStore 用於 hybrid retrieval。

```
dense_vector_name = "dense"
dense_config = models.VectorParams(
    size=len(Settings.embed_model.get_text_embedding("probe")),
    distance=models.Distance.COSINE,
)
sparse_vector_name = "sparse"
sparse_config = models.SparseVectorParams(
    index=models.SparseIndexParams(on_disk=False)
)
```

### 分片鍵 (Shard keys) 與選擇器合約 (selector contract)

- `shard_keys`：\[‘tenant\_a’, ‘tenant\_b’] — 使用自訂分片 (custom sharding) 的預定義分割，以保持每個租戶的本地化。
- `payload_indexes`：在 `tenant_id` 上建立 keyword index，以加速基於篩選器 (filter-based) 的查詢。
- `shard_key_selector_fn(tenant_id) -> tenant_id`：回傳用於寫入和讀取的 shard key。

```
shard_keys = ["tenant_a", "tenant_b"]
payload_indexes = [
    {
        "field_name": "tenant_id",
        "field_schema": models.PayloadSchemaType.KEYWORD,
    }
]




def shard_key_selector_fn(tenant_id: str) -> models.ShardKeySelector:
    return tenant_id
```

### 初始化帶有自訂分片的 hybrid Qdrant store

此步驟會建立或附加到 `COLLECTION` 中命名的集合，並設定一個 dual-vector hybrid store：

- Hybrid search：`enable_hybrid=True` 與 `dense_vector_name='dense'` 和 `sparse_vector_name='sparse'`。

- Dense 設定：`dense_config` 使用 cosine distance，並從 `Settings.embed_model` 推導大小。

- Sparse 設定：`sparse_config` 啟用 in-memory sparse index；`fastembed_sparse_model='Qdrant/bm25'` 提供 BM25-style signals。

- 分散式拓撲 (Distributed topology)：

  - `sharding_method=Custom` 與 `shard_keys=['tenant_a','tenant_b']`。
  - `shard_key_selector_fn(tenant_id) -> tenant_id` 路由寫入和讀取。
  - `shard_number=6`, `replication_factor=2` 用於擴展和高可用性 (High availability)。

- Payload index：`payload_indexes` 加速對 `tenant_id` 的篩選。

冪等行為 (Idempotent behavior)：如果集合不存在，vector store 將建立該集合，並在後續執行中重複使用它。

```
vector_store = QdrantVectorStore(
    collection_name=COLLECTION,
    client=client,
    aclient=aclient,
    dense_vector_name=dense_vector_name,
    sparse_vector_name=sparse_vector_name,
    enable_hybrid=True,
    dense_config=dense_config,
    sparse_config=sparse_config,
    fastembed_sparse_model="Qdrant/bm25",
    shard_number=6,
    sharding_method=models.ShardingMethod.CUSTOM,
    shard_key_selector_fn=shard_key_selector_fn,
    shard_keys=shard_keys,
    replication_factor=2,
    payload_indexes=payload_indexes,
)
```

## 準備多租戶資料集

我們建立兩個具有小型 document 集合的租戶。每個 Document 包含 tenant\_id、tags 和 doc\_id。

### 資料集設計與可擴展性

我們模擬兩個具有少量短 documents 的租戶。每個 `Document` 包含：

- `tenant_id` 用於隔離和分片路由 (shard routing)，
- `tags` 用於快速篩選和除錯 (debugging)，
- `text` 用於 dense/sparse indexing 的內容。

```
TENANT_DOCS: dict[str, list[Document]] = {
    "tenant_a": [
        Document(
            text="Solar panels reduce electricity bills and carbon footprint",
            metadata={"tenant_id": "tenant_a", "tags": ["energy", "solar"]},
        ),
        Document(
            text="Inverters convert DC power to AC for home appliances",
            metadata={"tenant_id": "tenant_a", "tags": ["energy", "hardware"]},
        ),
        Document(
            text="Net metering policies vary by region and utility provider",
            metadata={
                "tenant_id": "tenant_a",
                "tags": ["policy", "regulation"],
            },
        ),
    ],
    "tenant_b": [
        Document(
            text="Kubernetes orchestrates containers across a cluster",
            metadata={"tenant_id": "tenant_b", "tags": ["cloud", "k8s"]},
        ),
        Document(
            text="Service meshes add observability and traffic management",
            metadata={
                "tenant_id": "tenant_b",
                "tags": ["cloud", "networking"],
            },
        ),
        Document(
            text="Helm charts package and deploy Kubernetes applications",
            metadata={"tenant_id": "tenant_b", "tags": ["cloud", "devops"]},
        ),
    ],
}
```

## 使用分片鍵實現局部性 (locality) 進行攝取我們使用 active Settings.embed\_model 將文字嵌入，然後使用 payload 和 shard key 對每個點進行 upsert。這樣可以確保每個租戶都位於集群中的一個 shard group 內。

### Embedding 策略

- FastEmbed 保持此示範對 CPU 友好。對於生產環境，請考慮使用服務（例如 text-embedding-3-large 或自建模型）並快取 embeddings。
- 如果您更改了模型，請更新 `dense_config.size` 以匹配，並考慮重新索引。
- 避免在 notebook 中每次運行時都進行 embedding；持久化或快取以加快迭代速度。

```
def create_dense_embeddings(docs: list[Document]) -> list[Document]:
    for doc in docs:
        doc.embedding = Settings.embed_model.get_text_embedding(doc.text)
    return docs
```

### 擷取流程與局部性保證

- 我們使用配置的 embedding model（dense）嵌入每個 document，並依賴 vector store 來建立 sparse representation。
- 寫入使用 `shard_identifier=tenant_id`，確保 documents 位於預期的 shard group 上。

提示：對於大型批次，請優先使用 async ingestion APIs 並對 documents 進行分塊以控制背壓。

```
for tenant_id, docs in TENANT_DOCS.items():
    docs = create_dense_embeddings(docs)
    await vector_store.async_add(docs, shard_identifier=tenant_id)
```

### 索引包裝與重用性

`StorageContext.from_defaults(vector_store=vector_store)` 將 Qdrant collection 綁定到 LlamaIndex 的 `VectorStoreIndex`，而無需重新嵌入資料。

優點：

- 對多個 retriever 或查詢 pipeline 重用相同的物理 collection。
- 透過 retriever 配置切換檢索模式（dense-only、sparse-only、hybrid），而不是資料佈局。
- 將 ingestion 相關問題（sharding、replication）與應用程式查詢邏輯解耦。

```
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_vector_store(
    vector_store, storage_context=storage_context
)
```

## 多租戶檢索

使用一個租戶範圍的 hybrid retriever，並保持查詢在 shard 局部。如果您想在租戶資料內進行過濾，也可以使用 metadata filters。

### hybrid 模式的檢索提示

- 將 `vector_store_query_mode=HYBRID` 設定為組合 dense 和 sparse。調整 `similarity_top_k`、`sparse_top_k` 和 `hybrid_top_k`。
- 將 `vector_store_kwargs={"shard_identifier": tenant_id}` 傳遞以保持查詢在租戶的 shard 內。
- 添加 metadata filters（例如在 `tenant_id` 或 `tags` 上）在需要時進一步縮小候選者範圍。

```
from llama_index.core.retrievers import VectorIndexRetriever
from llama_index.core.vector_stores.types import VectorStoreQueryMode




def create_retriever_for_tenant(tenant_id: str) -> VectorIndexRetriever:
    if tenant_id not in shard_keys:
        raise ValueError(
            f"Unknown tenant_id: {tenant_id}. Expected one of {shard_keys}"
        )
    return VectorIndexRetriever(
        index=index,
        vector_store_query_mode=VectorStoreQueryMode.HYBRID,
        similarity_top_k=5,
        sparse_top_k=5,
        hybrid_top_k=5,
        vector_store_kwargs={"shard_identifier": tenant_id},
    )




tenant_id = "tenant_b"
retriever = create_retriever_for_tenant(tenant_id)


query = "manage microservices traffic and observability"
results = retriever.retrieve(query)


print(f"Tenant: {tenant_id} | Query: {query}")
for i, r in enumerate(results, 1):
    meta = r.node.metadata
    print(
        f"{i}. score={r.score:.4f} | tags={meta.get('tags')} | text={r.node.get_content()}"
    )
```

```
Tenant: tenant_b | Query: manage microservices traffic and observability
1. score=4.6271 | tags=['cloud', 'networking'] | text=Service meshes add observability and traffic management
2. score=0.1213 | tags=['cloud', 'k8s'] | text=Kubernetes orchestrates containers across a cluster
3. score=0.0000 | tags=['cloud', 'devops'] | text=Helm charts package and deploy Kubernetes applications
```

### 解釋結果

- 輸出會顯示 hybrid score、tags（metadata）和匹配文字的 snippet。
- 透過切換 `tenant_id` 並觀察結果僅來自該租戶的 documents，來驗證租戶隔離性。