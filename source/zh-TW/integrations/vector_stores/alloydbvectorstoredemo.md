---
title: "Google AlloyDB for PostgreSQL - `AlloyDBVectorStore`"
---

> [AlloyDB](https://cloud.google.com/alloydb) 是一個完全託管的關聯式資料庫服務，提供高性能、無縫整合和令人印象深刻的可擴展性。 AlloyDB 與 PostgreSQL 完全相容。擴展您的資料庫應用程式，利用 AlloyDB 的 LlamaIndex 整合來建立 AI 驅動的體驗。

本筆筆記將介紹如何使用 `AlloyDB for PostgreSQL` 來使用 `AlloyDBVectorStore` 類別來儲存向量嵌入。

請在 [GitHub](https://github.com/googleapis/llama-index-alloydb-pg-python/) 上了解更多關於此套件的資訊。

[![Open In Colab](/assets/e79852128a5f.svg)](https://colab.research.google.com/github/googleapis/llama-index-alloydb-pg-python/blob/main/samples/llama_index_vector_store.ipynb)

## 開始之前

要執行本筆記，您需要執行以下操作：

- [建立一個 Google Cloud Project](https://developers.google.com/workspace/guides/create-project)
- [啟用 AlloyDB API](https://console.cloud.google.com/flows/enableapi?apiid=alloydb.googleapis.com)
- [建立一個 AlloyDB cluster 和 instance。](https://cloud.google.com/alloydb/docs/cluster-create)
- [建立一個 AlloyDB database。](https://cloud.google.com/alloydb/docs/quickstart/create-and-connect)
- [為資料庫新增一個 User。](https://cloud.google.com/alloydb/docs/database-users/about)

### 🦙 Library 安裝

安裝整合函式庫 `llama-index-alloydb-pg`，以及用於嵌入服務的函式庫 `llama-index-embeddings-vertex`。

```
%pip install --upgrade --quiet llama-index-alloydb-pg llama-index-embeddings-vertex llama-index-llms-vertex llama-index
```

**僅限 Colab：** 取消勾選以下儲存格以重新啟動核心，或使用按鈕重新啟動核心。對於 Vertex AI Workbench，您可以使用頂部的按鈕重新啟動終端機。

```
# # Automatically restart kernel after installs so that your environment can access the new packages
# import IPython


# app = IPython.Application.instance()
# app.kernel.do_shutdown(True)
```

### 🔐 驗證

以登入本筆記的 IAM 使用者身份驗證 Google Cloud，以便存取您的 Google Cloud Project。

- 如果您使用 Colab 執行本筆記，請使用下面的儲存格並繼續。
- 如果您使用 Vertex AI Workbench，請參閱設定說明 [這裡](https://github.com/GoogleCloudPlatform/generative-ai/tree/main/setup-env)。

```
from google.colab import auth


auth.authenticate_user()
```

### ☁ 設定您的 Google Cloud Project

設定您的 Google Cloud Project，以便在本筆記中利用 Google Cloud 資源。

如果您不知道您的專案 ID，請嘗試以下操作：

- 執行 `gcloud config list`。
- 執行 `gcloud projects list`。
- 查看支援頁面：[尋找專案 ID](https://support.google.com/googleapi/answer/7014113)。

```
# @markdown Please fill in the value below with your Google Cloud project ID and then run the cell.


PROJECT_ID = "my-project-id"  # @param {type:"string"}


# Set the project id
!gcloud config set project {PROJECT_ID}
```

## 基本用法

### 設定 AlloyDB 資料庫值

請在 [AlloyDB Instances page](https://console.cloud.google.com/alloydb/clusters) 中找到您的資料庫值。

```
# @title Set Your Values Here { display-mode: "form" }
REGION = "us-central1"  # @param {type: "string"}
CLUSTER = "my-cluster"  # @param {type: "string"}
INSTANCE = "my-primary"  # @param {type: "string"}
DATABASE = "my-database"  # @param {type: "string"}
TABLE_NAME = "vector_store"  # @param {type: "string"}
USER = "postgres"  # @param {type: "string"}
PASSWORD = "my-password"  # @param {type: "string"}
```

### AlloyDBEngine 連線池

建立 AlloyDB 作為向量儲存格的一個要求和參數是 `AlloyDBEngine` 物件。`AlloyDBEngine` 設定了一個連線池到您的 AlloyDB 資料庫，從而實現應用程式的成功連線並遵循產業最佳實踐。

要使用 `AlloyDBEngine.from_instance()` 建立一個 `AlloyDBEngine`，您只需要提供 5 件事：

1. `project_id`：AlloyDB instance 所在的 Google Cloud Project 的 Project ID。
2. `region`：AlloyDB instance 所在的區域。
3. `cluster`：AlloyDB cluster 的名稱。
4. `instance`：AlloyDB instance 的名稱。
5. `database`：在 AlloyDB instance 上要連線的資料庫的名稱。

預設情況下，[IAM database authentication](https://cloud.google.com/alloydb/docs/connect-iam) 將作為資料庫驗證的方法。此函式庫使用從環境中取得的 [Application Default Credentials (ADC)](https://cloud.google.com/docs/authentication/application-default-credentials) 所屬的 IAM 主體。

可選地，也可以使用使用使用者名稱和密碼的 [built-in database authentication](https://cloud.google.com/alloydb/docs/database-users/about) 來存取 AlloyDB 資料庫。只需向 `AlloyDBEngine.from_instance()` 提供可選的 `user` 和 `password` 參數：

- `user`：用於 built-in database authentication 和登入的資料庫使用者。
- `password`：用於 built-in database authentication 和登入的資料庫密碼。

**注意：** 本教學演示了 async 介面。所有 async 方法都有對應的 sync 方法。

```
from llama_index_alloydb_pg import AlloyDBEngine


engine = await AlloyDBEngine.afrom_instance(
    project_id=PROJECT_ID,
    region=REGION,
    cluster=CLUSTER,
    instance=INSTANCE,
    database=DATABASE,
    user=USER,
    password=PASSWORD,
)
```

### AlloyDBEngine for AlloyDB Omni

要為 AlloyDB Omni 建立一個 `AlloyDBEngine`，您需要一個連線 URL。`AlloyDBEngine.from_connection_string` 首先建立一個 async engine，然後將其轉換為一個 `AlloyDBEngine`。以下是使用 `asyncpg` driver 的範例連線：

```
# Replace with your own AlloyDB Omni info
OMNI_USER = "my-omni-user"
OMNI_PASSWORD = ""
OMNI_HOST = "127.0.0.1"
OMNI_PORT = "5432"
OMNI_DATABASE = "my-omni-db"


connstring = f"postgresql+asyncpg://{OMNI_USER}:{OMNI_PASSWORD}@{OMNI_HOST}:{OMNI_PORT}/{OMNI_DATABASE}"
engine = AlloyDBEngine.from_connection_string(connstring)
```

### 初始化一個 table`AlloyDBVectorStore` class 需要一個資料表。`AlloyDBEngine` engine 有一個 helper method `init_vector_store_table()`，可用於為您建立具有正確 schema 的資料表。

```
await engine.ainit_vector_store_table(
    table_name=TABLE_NAME,
    vector_size=768,  # Vector size for VertexAI model(textembedding-gecko@latest)
)
```

#### 可選提示：💡

您也可以透過在傳遞 `table_name` 的地方傳遞 `schema_name` 來指定 schema 名稱。

```
SCHEMA_NAME = "my_schema"


await engine.ainit_vector_store_table(
    table_name=TABLE_NAME,
    schema_name=SCHEMA_NAME,
    vector_size=768,
)
```

### 建立 embedding class 實例

您可以使用任何 [Llama 索引 embeddings 模型](https://docs.llamaindex.ai/en/stable/module_guides/models/embeddings/)。您可能需要啟用 Vertex AI API 才能使用 `VertexTextEmbeddings`。我們建議為生產環境設定 embedding model 的版本，瞭解更多關於 [文字向量嵌入模型](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/text-embeddings) 的資訊。

```
# enable Vertex AI API
!gcloud services enable aiplatform.googleapis.com
```

```
from llama_index.core import Settings
from llama_index.embeddings.vertex import VertexTextEmbedding
from llama_index.llms.vertex import Vertex
import google.auth


credentials, project_id = google.auth.default()
Settings.embed_model = VertexTextEmbedding(
    model_name="textembedding-gecko@003",
    project=PROJECT_ID,
    credentials=credentials,
)


Settings.llm = Vertex(model="gemini-1.5-flash-002", project=PROJECT_ID)
```

### 初始化預設的 AlloyDBVectorStore

```
from llama_index_alloydb_pg import AlloyDBVectorStore


vector_store = await AlloyDBVectorStore.create(
    engine=engine,
    table_name=TABLE_NAME,
    # schema_name=SCHEMA_NAME
)
```

### 下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

### 載入 documents

```
from llama_index.core import SimpleDirectoryReader


documents = SimpleDirectoryReader("./data/paul_graham").load_data()
print("Document ID:", documents[0].doc_id)
```

## 使用 VectorStoreIndex

使用 [`VectorStoreIndex`](https://docs.llamaindex.ai/en/stable/module_guides/indexing/vector_store_index/) 從 vector store 建立一個 index。

#### 使用 documents 初始化 Vector Store

使用 Vector Store 最簡單的方法是載入一組 documents 並使用 `from_documents` 從它們建立一個 index。

```
from llama_index.core import StorageContext, VectorStoreIndex


storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context, show_progress=True
)
```

### 查詢 index

```
query_engine = index.as_query_engine()
response = query_engine.query("What did the author do?")
print(response)
```

## 建立自訂 Vector Store

Vector Store 可以利用關聯資料來過濾相似度搜尋。

建立一個具有自訂 metadata 欄位的新的資料表。您也可以重用一個已經有自訂欄位用於 Document 的 id、content、embedding 和/或 metadata 的現有資料表。

```
from llama_index_alloydb_pg import Column


# Set table name
TABLE_NAME = "vectorstore_custom"
# SCHEMA_NAME = "my_schema"


await engine.ainit_vector_store_table(
    table_name=TABLE_NAME,
    # schema_name=SCHEMA_NAME,
    vector_size=768,  # VertexAI model: textembedding-gecko@003
    metadata_columns=[Column("len", "INTEGER")],
)




# Initialize AlloyDBVectorStore
custom_store = await AlloyDBVectorStore.create(
    engine=engine,
    table_name=TABLE_NAME,
    # schema_name=SCHEMA_NAME,
    metadata_columns=["len"],
)
```

### 加上帶有 metadata 的 documents

[Document `metadata`](https://docs.llamaindex.ai/en/stable/module_guides/loading/documents_and_nodes/usage_documents/) 可以為 LLM 和檢索過程提供更多資訊。瞭解更多關於 [extracting and adding metadata](https://docs.llamaindex.ai/en/stable/module_guides/loading/documents_and_nodes/usage_metadata_extractor/) 的不同方法。

```
from llama_index.core import Document


fruits = ["apple", "pear", "orange", "strawberry", "banana", "kiwi"]
documents = [
    Document(text=fruit, metadata={"len": len(fruit)}) for fruit in fruits
]


storage_context = StorageContext.from_defaults(vector_store=custom_store)
custom_doc_index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context, show_progress=True
)
```

### 搜尋帶有 metadata 過濾的 documents

您可以透過指定一個 `filters` 參數來對搜尋結果進行預過濾。

```
from llama_index.core.vector_stores.types import (
    MetadataFilter,
    MetadataFilters,
    FilterOperator,
)


filters = MetadataFilters(
    filters=[
        MetadataFilter(key="len", operator=FilterOperator.GT, value="5"),
    ],
)


query_engine = custom_doc_index.as_query_engine(filters=filters)
res = query_engine.query("List some fruits")
print(str(res.source_nodes[0].text))
```

## 加上 Index

透過應用 vector index 來加速 vector 搜尋查詢。瞭解更多關於 [向量索引](https://cloud.google.com/blog/products/databases/faster-similarity-search-performance-with-pgvector-indexes) 的資訊。

```
from llama_index_alloydb_pg.indexes import IVFFlatIndex


index = IVFFlatIndex()
await vector_store.aapply_vector_index(index)
```

`ScaNN` index 的建立（僅在 AlloyDB Omni 中可用）需要足夠的維護工作記憶體。在應用 index 之前，您需要呼叫 `set_maintenance_work_mem` 設定資料庫標誌 `maintenance_work_mem`。

```
from llama_index_alloydb_pg.indexes import ScaNNIndex


VECTOR_SIZE = 768  # Replace with the vector size of your embedding model
index = ScaNNIndex(name="my_scann_index")
await vector_store.aset_maintenance_work_mem(index.num_leaves, VECTOR_SIZE)
await vector_store.aapply_vector_index(index)
```

### 重新建立 index

```
await vector_store.areindex()  # Re-index using default index name
```

### 移除一個 index

```
await vector_store.adrop_vector_index()  # Delete index using default name
```
