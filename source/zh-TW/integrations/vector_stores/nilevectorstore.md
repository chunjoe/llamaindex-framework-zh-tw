---
title: "Nile Vector Store (Multi-tenant PostgreSQL)"
---

此筆筆記展示如何使用基於 Postgres 的 vector store `NileVectorStore` 來儲存和查詢多租戶 RAG 應用程式的 vector embeddings。

## 什麼是 Nile？

Nile 是一個 Postgres 資料庫，它允許每個租戶進行所有資料庫操作，包括自動擴展 (auto-scaling)、分支 (branching) 和備份 (backups)，並提供完全的客戶隔離 (customer isolation)。

多租戶 RAG 應用程式越來越受歡迎，因為它們在利用大型語言模型 (large language models) 的同時提供了安全性和隱私性。

然而，管理底層的 Postgres 資料庫並非簡單。DB-per-tenant 成本高昂且難以管理，而共享 DB 則存在安全和隱私問題，同時也限制了 RAG 應用程式的擴展性和效能。Nile 重新設計了 Postgres，以提供所有世界的最佳體驗——DB-per-tenant 的隔離性，同時擁有共享 DB 的成本效益和開發者體驗。

在共享 DB 中儲存數百萬個 vector 可能會很慢，並需要大量的資源來索引和查詢。但如果你在 Nile 的虛擬租戶資料庫中儲存 1000 個租戶，每個租戶有 1000 個 vector，這可以相當可管理。特別是你可以將較大的租戶放在自己的計算資源上，而較小的租戶可以有效地共享計算資源並根據需要自動擴展。

## 開始使用 Nile

首先，請註冊 [Nile](https://console.thenile.dev/?utm_campaign=partnerlaunch\&utm_source=llamaindex\&utm_medium=docs)。註冊 Nile 後，您將被升級為建立第一個資料庫。請開始操作。您將被重新導向到新資料庫的「Query Editor」頁面。

從那裡，點擊「Home」（左側選單上的頂部圖示），點擊「generate credentials」並複製結果的 connection string。您稍後會需要它。

## 額外資源

- [Nile 的 LlamaIndex documentation](https://www.thenile.dev/docs/partners/llama)
- [Nile 的 generative AI 與向量 embeddings docs](https://www.thenile.dev/docs/ai-embeddings)
- [Nile 的 pgvector primer](https://www.thenile.dev/docs/ai-embeddings/pg_vector)
- [Few 中你不知道的事 pgvector](https://www.thenile.dev/blog/pgvector_myth_debunking)

## 開始之前

### 安裝依賴項

讓我們安裝並匯入依賴項。

如果你在 colab 上開啟此 Notebook，你可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-vector-stores-nile
%pip install /Users/gwen/workspaces/llama_index/llama-index-integrations/vector_stores/llama-index-vector-stores-nile/dist/llama_index_vector_stores_nile-0.1.1.tar.gz
```

```
!pip install llama-index
```

```
import logging


from llama_index.core import SimpleDirectoryReader, StorageContext
from llama_index.core import VectorStoreIndex
from llama_index.core.vector_stores import (
    MetadataFilter,
    MetadataFilters,
    FilterOperator,
)
from llama_index.vector_stores.nile import NileVectorStore, IndexType
```

### 設定與 Nile 資料庫的連線

假設您遵循了先前部分「Getting Started with Nile」中的說明，您現在應該有了一個連接到 Nile 資料庫的 connection string。

您可以將其設定在名為 `NILEDB_SERVICE_URL` 的環境變數中，或直接設定在 Python 中。

```
%env NILEDB_SERVICE_URL=postgresql://username:password@us-west-2.db.thenile.dev:5432/niledb
```

現在，我們將建立一個 `NileVectorStore`。請注意，除了 URL 和 dimensions 等常用參數外，我們還設定了 `tenant_aware=True`。

:fire: NileVectorStore 支援 tenant-aware vector stores，它為每個租戶隔離 documents，以及一個通常用於所有租戶可存取的共享資料的 regular store。下文將展示 tenant-aware vector store。

```
# Get the service url by reading local .env file with NILE_SERVICE_URL variable
import os


NILEDB_SERVICE_URL = os.environ["NILEDB_SERVICE_URL"]


# OR set it explicitly
# NILE_SERVICE_URL = "postgresql://nile:password@db.thenile.dev:5432/nile"


vector_store = NileVectorStore(
    service_url=NILEDB_SERVICE_URL,
    table_name="documents",
    tenant_aware=True,
    num_dimensions=1536,
)
```

### 設定 OpenAI

您可以將其設定在 .env 檔案中，或直接設定在 Python 中。

```
%env OPENAI_API_KEY=sk-...
```

```
# Uncomment and set it explicitly if you prefer not to use .env
# os.environ["OPENAI_API_KEY"] = "sk-..."
```


## 多租戶相似性搜尋

為了展示使用 LlamaIndex 和 Nile 進行多租戶相似性搜尋，我們將下載兩個 documents——每個都有一個來自不同公司的銷售通話記錄。Nexiv 提供 IT 服務，ModaMart 則在零售業。我們將為每個 document 添加租戶識別碼並將它們載入到 tenant-aware vector store 中。然後，我們將對每個租戶查詢該儲存。您會看到同一個問題會產生兩種不同的回應，因為它會為每個租戶檢索不同的 documents。

### 下載資料

```
!mkdir -p data
!wget "https://raw.githubusercontent.com/niledatabase/niledatabase/main/examples/ai/sales_insight/data/transcripts/nexiv-solutions__0_transcript.txt" -O "data/nexiv-solutions__0_transcript.txt"
!wget "https://raw.githubusercontent.com/niledatabase/niledatabase/main/examples/ai/sales_insight/data/transcripts/modamart__0_transcript.txt" -O "data/modamart__0_transcript.txt"
```

### 載入 documents

我們將使用 LlamaIndex 的 `SimpleDirectoryReader` 來載入 documents。因為我們想在載入後更新 documents 中的租戶元數據 (tenant metadata)，我們將為每個租戶使用一個單獨的 reader。

```
reader = SimpleDirectoryReader(
    input_files=["data/nexiv-solutions__0_transcript.txt"]
)
documents_nexiv = reader.load_data()


reader = SimpleDirectoryReader(input_files=["data/modamart__0_transcript.txt"])
documents_modamart = reader.load_data()
```

### 使用租戶元數據豐富 documents我們將建立兩個 Nile tenants，並將每個 tenant 的 ID 加入到 document metadata 中。我們還會新增一些額外的 metadata，例如自訂的 document ID 和 category。此 metadata 可用於在檢索過程中過濾 documents。當然，在您自己的應用程式中，您也可以為現有 tenant 載入 documents，並新增任何您認為有用的 metadata 資訊。

```
tenant_id_nexiv = str(vector_store.create_tenant("nexiv-solutions"))
tenant_id_modamart = str(vector_store.create_tenant("modamart"))


# Add the tenant id to the metadata
for i, doc in enumerate(documents_nexiv, start=1):
    doc.metadata["tenant_id"] = tenant_id_nexiv
    doc.metadata[
        "category"
    ] = "IT"  # We will use this to apply additional filters in a later example
    doc.id_ = f"nexiv_doc_id_{i}"  # We are also setting a custom id, this is optional but can be useful


for i, doc in enumerate(documents_modamart, start=1):
    doc.metadata["tenant_id"] = tenant_id_modamart
    doc.metadata["category"] = "Retail"
    doc.id_ = f"modamart_doc_id_{i}"
```

### 使用 NileVectorStore 建立 VectorStore index

我們將所有 documents 載入到同一個 `VectorStoreIndex` 中。由於我們在設定時建立了 tenant-aware 的 `NileVectorStore`，Nile 將會正確使用 metadata 中的 `tenant_id` 欄位來隔離它們。

在沒有 `tenant_id` 的情況下，在 tenant-aware store 中載入 documents 將會拋出一個 `ValueException`。

```
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents_nexiv + documents_modamart,
    storage_context=storage_context,
    show_progress=True,
)
```

```
/Users/gwen/.pyenv/versions/3.10.15/lib/python3.10/site-packages/tqdm/auto.py:21: TqdmWarning: IProgress not found. Please update jupyter and ipywidgets. See https://ipywidgets.readthedocs.io/en/stable/user_install.html
  from .autonotebook import tqdm as notebook_tqdm
Parsing nodes: 100%|██████████| 2/2 [00:00<00:00, 1129.32it/s]
Generating embeddings: 100%|██████████| 2/2 [00:00<00:00,  4.58it/s]
```

### 為每個 tenant 查詢 index

您可以在下方看到我們如何為每個查詢指定 tenant，因此我們得到與該 tenant 相關的結果，且僅限於該 tenant。

```
nexiv_query_engine = index.as_query_engine(
    similarity_top_k=3,
    vector_store_kwargs={
        "tenant_id": str(tenant_id_nexiv),
    },
)


print(nexiv_query_engine.query("What were the customer pain points?"))
```

```
The customer pain points were related to managing customer data using multiple platforms, leading to data discrepancies, time-consuming reconciliation efforts, and decreased productivity.
```

```
modamart_query_engine = index.as_query_engine(
    similarity_top_k=3,
    vector_store_kwargs={
        "tenant_id": str(tenant_id_modamart),
    },
)


print(modamart_query_engine.query("What were the customer pain points?"))
```

```
The customer's pain points were concerns about the quality and value of the winter jackets, skepticism towards reviews, worries about sizing and fit when ordering clothes online, and the desire for a warm but lightweight jacket.
```

### 查詢現有的 embeddings

在上面的範例中，我們透過載入和 embedding 新的 documents 來建立 index。但如果我們已經在 Nile 中生成並儲存了 embeddings 怎麼辦？在這種情況下，您仍然像上面一樣初始化 `NileVectorStore`，但您使用以下內容而不是 `VectorStoreIndex.from_documents(...)`：

```
index = VectorStoreIndex.from_vector_store(vector_store=vector_store)
query_engine = index.as_query_engine(
    vector_store_kwargs={
        "tenant_id": str(tenant_id_modamart),
    },
)
response = query_engine.query("What action items do we need to follow up on?")


print(response)
```

```
The action items to follow up on include sending the customer detailed testimonials about the lightweight and warm qualities of the jackets, providing the customer with a sizing guide, and emailing the customer a 10% discount on their first purchase.
```

## 使用 ANN indexes 進行近似最近鄰搜尋

Nile 支援 pgvector 支援的所有 index - IVFFlat 和 HNSW。IVFFlat 速度更快，資源消耗較少，且易於調整。HNSW 需要更多的資源來建立和使用，調整起來更具挑戰性，但具有出色的準確度/速度權衡。讓我們看看如何使用 index，儘管一個 2-document 的範例實際上不需要它們。

### IVFFlat Index

IVFFlat index 的運作方式是將向量空間劃分為稱為「lists」的區域，首先找到最近的 lists，然後在這些 lists 內部搜尋最近的鄰居。在 index 建立時，您會指定 lists 的數量（`nlists`），在查詢時，您可以指定搜尋中將使用多少個最近的 lists（`ivfflat_probes`）。

```
try:
    vector_store.create_index(index_type=IndexType.PGVECTOR_IVFFLAT, nlists=10)
except Exception as e:
    # This will throw an error if the index already exists, which may be expected
    print(e)


nexiv_query_engine = index.as_query_engine(
    similarity_top_k=3,
    vector_store_kwargs={
        "tenant_id": str(tenant_id_nexiv),
        "ivfflat_probes": 10,
    },
)


print(
    nexiv_query_engine.query("What action items do we need to follow up on?")
)


vector_store.drop_index()
```

```
Index documents_embedding_idx already exists
```

### HNSW Index

HNSW index 的運作方式是將向量空間劃分為一個多層圖，其中每一層都包含不同粒度點之間的連接。在搜尋過程中，它會從粗到細層進行導航，識別資料中的最近鄰居。在 index 建立期間，您會指定一層中的最大連接數（`m`）以及建構圖時考慮的候選向量數量（`ef_construction`）。在查詢時，您可以指定要搜尋的候選列表的大小（`hnsw_ef`）。

```
try:
    vector_store.create_index(
        index_type=IndexType.PGVECTOR_HNSW, m=16, ef_construction=64
    )
except Exception as e:
    # This will throw an error if the index already exists, which may be expected
    print(e)


nexiv_query_engine = index.as_query_engine(
    similarity_top_k=3,
    vector_store_kwargs={
        "tenant_id": str(tenant_id_nexiv),
        "hnsw_ef": 10,
    },
)


print(nexiv_query_engine.query("Did we mention any pricing?"))


vector_store.drop_index()
```

## 額外的 VectorStore 操作

### Metadata Filters

`NileVectorStore` 也支援基於 metadata 過濾 vectors。例如，當我們載入 documents 時，我們為每個 document 包含了 `category` metadata。現在我們可以使用這些資訊來過濾檢索到的 documents。請注意，此過濾是**除了** tenant 過濾之外的。在 tenant-aware vector store 中，tenant 過濾是強制性的，以防止意外的資料洩漏。

```
filters = MetadataFilters(
    filters=[
        MetadataFilter(
            key="category", operator=FilterOperator.EQ, value="Retail"
        ),
    ]
)


nexiv_query_engine_filtered = index.as_query_engine(
    similarity_top_k=3,
    filters=filters,
    vector_store_kwargs={"tenant_id": str(tenant_id_nexiv)},
)
print(
    "test query on nexiv with filter on category = Retail (should return empty): ",
    nexiv_query_engine_filtered.query("What were the customer pain points?"),
)
```

```
test query on nexiv with filter on category = Retail (should return empty):  Empty Response
```

### 刪除 Documents

刪除 documents 可能非常重要。特別是如果您的部分 tenant 位於需要 GDPR 的地區。

```
ref_doc_id = "nexiv_doc_id_1"
vector_store.delete(ref_doc_id, tenant_id=tenant_id_nexiv)


# Query the data again
print(
    "test query on nexiv after deletion (should return empty): ",
    nexiv_query_engine.query("What were the customer pain points?"),
)
```

```
test query on nexiv after deletion (should return empty):  Empty Response
```
