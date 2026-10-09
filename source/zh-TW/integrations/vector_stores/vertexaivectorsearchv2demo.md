---
title: "Google Vertex AI 向量 搜尋 v2.0"
---

本 Notebook 示範如何在 LlamaIndex 中使用 **Vertex AI Vector Search v2.0**。

> [Vertex AI 向量 搜尋 v2.0](https://cloud.google.com/vertex-ai/docs/vector-search/overview) 採用簡化的 **Collection 架構**，不必另外建立索引或部署端點。

## v2.0 與 v1.0 比較

| 功能 | v1.0 | v2.0 |
| ------------- | --------------------------------- | ----------------- |
| 架構 | 索引 + 端點 | Collection |
| 設定步驟 | 建立索引 → 部署至端點 | 建立 Collection |
| GCS 儲存桶 | 批次更新必須使用 | 不需要 |
| 混合搜尋 | 不支援 | 支援 |

**注意：** 如需使用 v1.0，請參閱 [VertexAIVectorSearchDemo.ipynb](https://developers.llamaindex.ai/python/framework/integrations/vector_stores/vertexaivectorsearchv2demo/VertexAIVectorSearchDemo.ipynb/)。

## 安裝相依套件

安裝支援 v2 的 LlamaIndex：

> **注意：** v2 支援需要使用支援 Vertex AI Vector Search v2.0 API 的 `llama-index-vector-stores-vertexaivectorsearch` 版本。

```
# Install with v2 support (the [v2] extra installs google-cloud-vectorsearch)
# !pip install 'llama-index-vector-stores-vertexaivectorsearch[v2]' llama-index-embeddings-vertex llama-index-llms-vertex
```

### 驗證（使用 Colab 時）：

```
# Colab authentication.
import sys


if "google.colab" in sys.modules:
    from google.colab import auth


    auth.authenticate_user()
    print("Authenticated")
```

## 設定

設定 Google Cloud 專案資訊：

```
# Google Cloud Configuration
PROJECT_ID = "your-project-id"  # @param {type:"string"}
REGION = "us-central1"  # @param {type:"string"}
COLLECTION_ID = "llamaindex-demo-collection"  # @param {type:"string"}


# Embedding dimensions (768 for text-embedding-004)
EMBEDDING_DIMENSION = 768
```

## 建立 v2 Collection

v1.0 必須先建立索引並部署至端點；v2.0 則只需要建立 Collection。

**混合搜尋注意事項：** 下方的 Collection schema 已設定好，可支援所有混合搜尋功能：

- **文字搜尋**：字串欄位（`text`、`category`、`color`）可供關鍵字搜尋
- **語意搜尋**：`vertex_embedding_config` 可啟用 auto-embeddings，供 `SEMANTIC_HYBRID` 模式使用
- **篩選**：數值欄位（`price`）與字串欄位都支援中繼資料篩選

```
from google.cloud import vectorsearch_v1beta


# Initialize the client
client = vectorsearch_v1beta.VectorSearchServiceClient()


# Check if collection already exists
parent = f"projects/{PROJECT_ID}/locations/{REGION}"
collection_name = f"{parent}/collections/{COLLECTION_ID}"


# Collection schema that supports:
# - Dense vector search (embedding field)
# - Text search on text, category, color fields (for HYBRID mode)
# - Semantic search with auto-embeddings (for SEMANTIC_HYBRID mode)
# - Filtering on price, category, color fields
collection_config = {
    "data_schema": {
        "type": "object",
        "properties": {
            "text": {"type": "string"},  # Main text content (searchable)
            "ref_doc_id": {"type": "string"},  # Document reference
            "price": {"type": "number"},  # Filterable numeric field
            "color": {"type": "string"},  # Filterable/searchable string
            "category": {"type": "string"},  # Filterable/searchable string
        },
    },
    "vector_schema": {
        "embedding": {
            "dense_vector": {
                "dimensions": EMBEDDING_DIMENSION,
                # Auto-embedding config enables SEMANTIC_HYBRID mode
                # Vertex AI will auto-generate embeddings for semantic search
                "vertex_embedding_config": {
                    "model_id": "text-embedding-004",
                    "text_template": "{text}",
                    "task_type": "RETRIEVAL_DOCUMENT",
                },
            }
        },
    },
}


try:
    request = vectorsearch_v1beta.GetCollectionRequest(name=collection_name)
    collection = client.get_collection(request=request)
    print(f"Collection already exists: {collection.name}")
    print(
        "Note: If you need hybrid search features, delete and recreate with the schema above."
    )
except Exception as e:
    if "404" in str(e) or "NotFound" in str(e):
        print(f"Creating collection: {COLLECTION_ID}")
        print(
            "Schema includes: text search fields, auto-embedding config for semantic search"
        )


        request = vectorsearch_v1beta.CreateCollectionRequest(
            parent=parent,
            collection_id=COLLECTION_ID,
            collection=collection_config,
        )
        operation = client.create_collection(request=request)
        collection = operation.result()
        print(f"Collection created: {collection.name}")
    else:
        raise e
```

## 設定 LlamaIndex 元件

```
# Imports
from llama_index.core import Settings, StorageContext, VectorStoreIndex
from llama_index.core.schema import TextNode
from llama_index.core.vector_stores.types import (
    MetadataFilters,
    MetadataFilter,
    FilterOperator,
)
from llama_index.embeddings.vertex import VertexTextEmbedding
from llama_index.llms.vertex import Vertex
from llama_index.vector_stores.vertexaivectorsearch import VertexAIVectorStore


# Authentication - get default credentials
import google.auth


credentials, project = google.auth.default()
print(f"Authenticated with project: {project}")
```

```
# Configure embedding model
embed_model = VertexTextEmbedding(
    model_name="text-embedding-004",
    project=PROJECT_ID,
    location=REGION,
    credentials=credentials,
)


# Configure LLM
llm = Vertex(
    model="gemini-2.0-flash",
    project=PROJECT_ID,
    location=REGION,
    credentials=credentials,
)


# Set as defaults
Settings.embed_model = embed_model
Settings.llm = llm


print("Embedding model and LLM configured successfully!")
```

## 建立 v2 向量儲存庫

建立 v2 向量儲存庫很簡單，只要指定 `api_version="v2"` 和 `collection_id`：

```
# Create v2 vector store
vector_store = VertexAIVectorStore(
    api_version="v2",  # Use v2 API
    project_id=PROJECT_ID,
    region=REGION,
    collection_id=COLLECTION_ID,
    # No index_id, endpoint_id, or gcs_bucket_name needed!
)


print(f"Vector store created with api_version={vector_store.api_version}")
```

## 新增文件

### 簡單文字節點

```
# Create some sample text nodes
texts = [
    "LlamaIndex is a data framework for LLM applications.",
    "Vertex AI Vector Search provides scalable vector similarity search.",
    "RAG combines retrieval with generation for better AI responses.",
    "Embeddings convert text into numerical vectors for similarity matching.",
]


# Create nodes with embeddings
nodes = [
    TextNode(text=text, embedding=embed_model.get_text_embedding(text))
    for text in texts
]


# Add to vector store
ids = vector_store.add(nodes)
print(f"Added {len(ids)} nodes to vector store")
```

### 含中繼資料的節點

加入含中繼資料的節點，以便進行篩選與混合搜尋：

```
# Sample product data with metadata
products = [
    {
        "text": "Comfortable blue cotton t-shirt, perfect for casual wear",
        "color": "blue",
        "category": "tops",
        "price": 29.99,
    },
    {
        "text": "Professional black dress pants for office meetings",
        "color": "black",
        "category": "bottoms",
        "price": 79.99,
    },
    {
        "text": "Warm green wool sweater for cold winter days",
        "color": "green",
        "category": "tops",
        "price": 59.99,
    },
    {
        "text": "Lightweight blue running shorts with pockets",
        "color": "blue",
        "category": "bottoms",
        "price": 34.99,
    },
    {
        "text": "Elegant red silk blouse for formal occasions",
        "color": "red",
        "category": "tops",
        "price": 89.99,
    },
]


# Create nodes with metadata
# Note: Include "text" in metadata for TEXT_SEARCH to work on the text field
product_nodes = [
    TextNode(
        text=p["text"],
        embedding=embed_model.get_text_embedding(p["text"]),
        metadata={
            "text": p["text"],
            "color": p["color"],
            "category": p["category"],
            "price": p["price"],
        },
    )
    for p in products
]


# Add to vector store
product_ids = vector_store.add(product_nodes)
print(f"Added {len(product_ids)} product nodes with metadata")
```

## 查詢向量儲存庫

### 簡單相似度搜尋

```
# Create index from vector store
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_vector_store(
    vector_store=vector_store, embed_model=embed_model
)


# Create retriever
retriever = index.as_retriever(similarity_top_k=3)


# Query
results = retriever.retrieve("comfortable clothing for everyday wear")


print("Search Results:")
print("-" * 60)
for result in results:
    print(f"Score: {result.get_score():.3f}")
    print(f"Text: {result.get_text()[:100]}...")
    print(f"Metadata: {result.metadata}")
    print("-" * 60)
```

### 使用中繼資料篩選條件搜尋

```
# Filter by color
filters = MetadataFilters(filters=[MetadataFilter(key="color", value="blue")])


retriever = index.as_retriever(filters=filters, similarity_top_k=3)
results = retriever.retrieve("casual clothing")


print("Blue items only:")
print("-" * 60)
for result in results:
    print(
        f"Score: {result.get_score():.3f} | Color: {result.metadata.get('color')}"
    )
    print(f"Text: {result.get_text()[:80]}...")
    print("-" * 60)
```

```
# Filter by price range
filters = MetadataFilters(
    filters=[
        MetadataFilter(key="price", operator=FilterOperator.LT, value=50.0),
    ]
)


retriever = index.as_retriever(filters=filters, similarity_top_k=3)
results = retriever.retrieve("clothing")


print("Items under $50:")
print("-" * 60)
for result in results:
    print(
        f"Score: {result.get_score():.3f} | Price: ${result.metadata.get('price')}"
    )
    print(f"Text: {result.get_text()[:80]}...")
    print("-" * 60)
```

## 使用 LLM 進行 RAG 查詢

你可以搭配 LLM 使用向量儲存庫，進行檢索增強生成（RAG）：

```
# Create query engine
query_engine = index.as_query_engine(similarity_top_k=3)


# Ask a question
response = query_engine.query(
    "What blue clothing items do you have and what are their prices?"
)


print(
    "Question: What blue clothing items do you have and what are their prices?"
)
print("-" * 60)
print(f"Answer: {response.response}")
print("-" * 60)
print("Sources:")
for node in response.source_nodes:
    print(f"  - {node.text[:60]}... (score: {node.score:.3f})")
```

## v2 專屬功能

### 刪除指定節點

```
# Delete specific nodes by ID
# vector_store.delete_nodes(node_ids=["node_id_1", "node_id_2"])
print("delete_nodes() - Delete specific nodes by their IDs")
```

### 清除所有資料（僅限 v2）

v2 支援清除 Collection 中的所有資料；v1 不支援此功能：

```
# Clear all data from the collection
# WARNING: This deletes ALL data in the collection!
# vector_store.clear()
print("clear() - Clears all data from collection (v2 only!)")
```

## 混合搜尋（僅限 v2）

v2 支援**混合搜尋**，可結合向量相似度搜尋與文字搜尋，提升檢索品質。當你需要同時運用語意理解（向量）與精確關鍵字比對（文字搜尋）時，這項功能特別實用。

### 支援的查詢模式

| 模式 | 說明 | 使用情境 |
| ----------------- | ------------------------------ | ------------------------------ |
| `DEFAULT` | 密集向量相似度搜尋 | 一般語意搜尋 |
| `TEXT_SEARCH` | 全文關鍵字搜尋 | 精確比對關鍵字 |
| `HYBRID` | 向量與文字搜尋，並以 RRF 融合結果 | 兼得兩種搜尋方式的優點 |
| `SEMANTIC_HYBRID` | 向量與語意搜尋 | 使用 auto-embedding 的語意搜尋 |

### 排序器選項

| 排序器 | 說明 |
| --------------- | ------------------------------------------- |
| `rrf`（預設） | 以 alpha 權重調整的 Reciprocal Rank Fusion |
| `vertex` | 透過 Vertex AI 進行 AI 語意排序 |

### 建立支援混合搜尋的向量儲存庫

若要啟用混合搜尋，請設定 `enable_hybrid=True`，並指定要用於文字搜尋的欄位：

```
# Create hybrid-enabled vector store
hybrid_vector_store = VertexAIVectorStore(
    api_version="v2",
    project_id=PROJECT_ID,
    region=REGION,
    collection_id=COLLECTION_ID,
    enable_hybrid=True,
    text_search_fields=["text", "category", "color"],  # Fields for text search
    default_hybrid_alpha=0.5,  # Balance between vector and text (0=text only, 1=vector only)
)


print(
    f"Hybrid vector store created with enable_hybrid={hybrid_vector_store.enable_hybrid}"
)
```

### TEXT\_SEARCH 模式：關鍵字搜尋

使用 `TEXT_SEARCH` 模式進行全文關鍵字比對。若要精確比對關鍵字，而非依語意相似度搜尋，這個模式就很實用：

```
from llama_index.core.vector_stores.types import (
    VectorStoreQuery,
    VectorStoreQueryMode,
)


# TEXT_SEARCH: Full-text keyword search only
text_query = VectorStoreQuery(
    query_str="blue cotton",  # Keywords to search for
    mode=VectorStoreQueryMode.TEXT_SEARCH,
    similarity_top_k=3,
)


results = hybrid_vector_store.query(text_query)


print("TEXT_SEARCH Results (keyword matching):")
print("-" * 60)
for i, node in enumerate(results.nodes):
    print(f"{i+1}. {node.text[:80]}...")
    print(f"   Metadata: {node.metadata}")
    print()
```

### HYBRID 模式：向量 + 文字搜尋

使用 `HYBRID` 模式結合向量相似度搜尋與文字搜尋。`alpha` 參數用來調整兩者的比重：

- `alpha=1.0` — 只進行向量搜尋
- `alpha=0.5` — 向量與文字搜尋各半
- `alpha=0.0` — 只進行文字搜尋

```
# Compare different alpha values
print("Comparing alpha values:")
print("=" * 60)


for alpha in [1.0, 0.5, 0.0]:
    query = VectorStoreQuery(
        query_embedding=embed_model.get_query_embedding(
            "warm winter clothing"
        ),
        query_str="sweater green",  # Keywords favor green sweater
        mode=VectorStoreQueryMode.HYBRID,
        alpha=alpha,
        similarity_top_k=2,
    )
    results = hybrid_vector_store.query(query)


    label = (
        "vector only"
        if alpha == 1.0
        else "text only"
        if alpha == 0.0
        else "balanced"
    )
    print(f"\nalpha={alpha} ({label}):")
    for node in results.nodes:
        print(f"  - {node.text[:60]}... | color={node.metadata.get('color')}")
```

### SEMANTIC\_HYBRID 模式

`SEMANTIC_HYBRID` 會結合密集向量搜尋與 Vertex AI 內建的語意搜尋。若要使用 auto-embeddings，Collection 必須先設定 `vertex_embedding_config`。

```
# SEMANTIC_HYBRID: Vector + Vertex AI's semantic search
# Note: Requires collection with vertex_embedding_config


semantic_query = VectorStoreQuery(
    query_embedding=embed_model.get_query_embedding(
        "professional work attire"
    ),
    query_str="formal office clothing",  # Semantic search text
    mode=VectorStoreQueryMode.SEMANTIC_HYBRID,
    similarity_top_k=3,
)


try:
    results = hybrid_vector_store.query(semantic_query)
    print("SEMANTIC_HYBRID Results:")
    print("-" * 60)
    for i, node in enumerate(results.nodes):
        print(f"{i+1}. {node.text[:80]}...")
except Exception as e:
    print(
        f"SEMANTIC_HYBRID requires collection with vertex_embedding_config: {e}"
    )
```

### 使用 VertexRanker

你可以使用 Vertex AI 語意排序器進行 AI 輔助的結果排序，以取代 RRF：

```
# Create vector store with VertexRanker
vertex_ranker_store = VertexAIVectorStore(
    api_version="v2",
    project_id=PROJECT_ID,
    region=REGION,
    collection_id=COLLECTION_ID,
    enable_hybrid=True,
    text_search_fields=["text", "category"],
    hybrid_ranker="vertex",  # Use Vertex AI's semantic ranker
    vertex_ranker_model="semantic-ranker-default@latest",
    vertex_ranker_title_field="category",  # Field to use as title
    vertex_ranker_content_field="text",  # Field to use as content
)


# Query with VertexRanker
query = VectorStoreQuery(
    query_embedding=embed_model.get_query_embedding("casual everyday wear"),
    query_str="comfortable shirt",
    mode=VectorStoreQueryMode.HYBRID,
    similarity_top_k=3,
)


results = vertex_ranker_store.query(query)


print("HYBRID with VertexRanker Results:")
print("-" * 60)
for i, node in enumerate(results.nodes):
    print(f"{i+1}. {node.text[:80]}...")
    print(f"   Category: {node.metadata.get('category')}")
    print()
```

### 搭配 Query Engine 進行混合搜尋（RAG）

你也可以在 RAG 應用中使用標準 LlamaIndex Query Engine 搭配混合搜尋：

```
# Create index with hybrid-enabled vector store
hybrid_storage_context = StorageContext.from_defaults(
    vector_store=hybrid_vector_store
)
hybrid_index = VectorStoreIndex.from_vector_store(
    vector_store=hybrid_vector_store,
    embed_model=embed_model,
)


# Create query engine with hybrid mode
hybrid_query_engine = hybrid_index.as_query_engine(
    vector_store_query_mode=VectorStoreQueryMode.HYBRID,
    similarity_top_k=3,
    alpha=0.7,  # Favor vector search slightly
)


# Ask a question using RAG with hybrid retrieval
response = hybrid_query_engine.query(
    "What comfortable blue clothing options are available?"
)


print("Question: What comfortable blue clothing options are available?")
print("-" * 60)
print(f"Answer: {response.response}")
print("-" * 60)
print("Sources:")
for node in response.source_nodes:
    print(f"  - {node.text[:60]}... (score: {node.score:.3f})")
```

### 混合搜尋參數參考

| 參數 | 型別 | 預設值 | 說明 |
| :--- | :--- | :--- | :--- |
| `enable_hybrid` | `bool` | `False` | 啟用混合搜尋模式 |
| `text_search_fields` | `List[str]` | `None` | 用於文字搜尋的欄位 |
| `embedding_field` | `str` | `"embedding"` | 向量欄位名稱 |
| `default_hybrid_alpha` | `float` | `0.5` | 預設的 RRF 權重（0=文字，1=向量） |
| `hybrid_ranker` | `str` | `"rrf"` | 排序器："rrf" 或 "vertex" |
| `semantic_task_type` | `str` | `"RETRIEVAL_QUERY"` | 語意搜尋的任務類型 |
| `vertex_ranker_model` | `str` | `"semantic-ranker-default@latest"` | VertexRanker 模型 |
| `vertex_ranker_title_field` | `str` | `None` | VertexRanker 的標題欄位 |
| `vertex_ranker_content_field` | `str` | `None` | VertexRanker 的內容欄位 |

## 清理

完成後請刪除 Collection，以免產生費用：

```
CLEANUP = False  # Set to True to delete the collection


if CLEANUP:
    from google.cloud import vectorsearch_v1beta


    client = vectorsearch_v1beta.VectorSearchServiceClient()
    collection_name = (
        f"projects/{PROJECT_ID}/locations/{REGION}/collections/{COLLECTION_ID}"
    )


    print(f"Deleting collection: {collection_name}")
    client.delete_collection(name=collection_name)
    print("Collection deleted.")
```

## 摘要

本 Notebook 示範了以下內容：

1. **簡化設定**：v2 只需一個 Collection，不必另外建立索引或部署端點。

2. **輕鬆整合**：新增 `api_version="v2"` 即可使用新版 API。

3. **介面一致**：LlamaIndex 的操作（add、query、delete）維持相同。

4. **新增功能**：v2 加入了 v1 沒有的 `clear()` 方法。

5. **混合搜尋**：結合向量與文字搜尋，提升檢索效果：

   - `TEXT_SEARCH` — 全文關鍵字搜尋
   - `HYBRID` — 透過 RRF 結合向量與文字搜尋
   - `SEMANTIC_HYBRID` — 結合向量與語意搜尋
   - VertexRanker — AI 輔助排序

### 從 v1 遷移

```
# v1 (old)
vector_store = VertexAIVectorStore(
    project_id="...",
    region="...",
    index_id="projects/.../indexes/123",
    endpoint_id="projects/.../indexEndpoints/456",
    gcs_bucket_name="my-bucket"
)


# v2 (new)
vector_store = VertexAIVectorStore(
    api_version="v2",
    project_id="...",
    region="...",
    collection_id="my-collection"
)


# v2 with hybrid search
vector_store = VertexAIVectorStore(
    api_version="v2",
    project_id="...",
    region="...",
    collection_id="my-collection",
    enable_hybrid=True,
    text_search_fields=["text", "title"],
)
```

如需詳細的遷移說明，請參閱 [V2\_MIGRATION.md](https://github.com/run-llama/llama_index/blob/main/llama-index-integrations/vector_stores/llama-index-vector-stores-vertexaivectorsearch/V2_MIGRATION.md)