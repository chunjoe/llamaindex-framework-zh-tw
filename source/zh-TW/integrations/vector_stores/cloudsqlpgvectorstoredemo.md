---
title: "Google Cloud SQL for PostgreSQL - `PostgresVectorStore`"
---

> [Cloud SQL](https://cloud.google.com/sql) 是一個完全託管的關聯式資料庫服務，提供高性能、無縫整合和令人印象深刻的可擴展性。它提供 MySQL、PostgreSQL 和 SQL Server 資料庫引擎。擴展您的資料庫應用程式，利用 Cloud SQL 的 LlamaIndex 整合來建立 AI 驅動的體驗。

本筆筆記將介紹如何使用 `Cloud SQL for PostgreSQL` 來使用 `PostgresVectorStore` 類別來儲存 vector embeddings。

在 [GitHub](https://github.com/googleapis/llama-index-cloud-sql-pg-python/) 上了解更多關於此套件的資訊。

[![Open In Colab](/assets/e79852128a5f.svg)](https://colab.research.google.com/github/googleapis/llama-index-cloud-sql-pg-python/blob/main/samples/llama_index_vector_store.ipynb)

## 開始之前

要執行本筆記，您需要完成以下操作：

- [建立一個 Google Cloud Project](https://developers.google.com/workspace/guides/create-project)
- [啟用 Cloud SQL Admin API。](https://console.cloud.google.com/flows/enableapi?apiid=sqladmin.googleapis.com)
- [建立一個 Cloud SQL instance。](https://cloud.google.com/sql/docs/postgres/connect-instance-auth-proxy#create-instance)
- [建立一個 Cloud SQL database。](https://cloud.google.com/sql/docs/postgres/create-manage-databases)
- [向資料庫新增一個使用者。](https://cloud.google.com/sql/docs/postgres/create-manage-users)

### 🦙 函式庫安裝

安裝整合函式庫 `llama-index-cloud-sql-pg`，以及用於 embedding 服務的函式庫 `llama-index-embeddings-vertex`。

```
%pip install --upgrade --quiet llama-index-cloud-sql-pg llama-index-embeddings-vertex llama-index-llms-vertex llama-index
```

**僅限 Colab：** 取消註解以下儲存格以重新啟動核心，或使用按鈕重新啟動核心。對於 Vertex AI Workbench，您可以使用頂部的按鈕重新啟動終端機。

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

### 設定 Cloud SQL 資料庫值

請在 [Cloud SQL Instances 頁面](https://console.cloud.google.com/sql?_ga=2.223735448.2062268965.1707700487-2088871159.1707257687) 中找到您的資料庫值。

```
# @title Set Your Values Here { display-mode: "form" }
REGION = "us-central1"  # @param {type: "string"}
INSTANCE = "my-primary"  # @param {type: "string"}
DATABASE = "my-database"  # @param {type: "string"}
TABLE_NAME = "vector_store"  # @param {type: "string"}
USER = "postgres"  # @param {type: "string"}
PASSWORD = "my-password"  # @param {type: "string"}
```

### PostgresEngine Connection Pool

建立 Cloud SQL 作為 vector store 的要求和參數之一是 `PostgresEngine` 物件。`PostgresEngine` 會為您的 Cloud SQL 資料庫配置一個 connection pool，從而實現應用程式的成功連線並遵循產業最佳實踐。

要使用 `PostgresEngine.from_instance()` 建立一個 `PostgresEngine`，您只需要提供以下 4 件事：

1. `project_id`：Cloud SQL instance 所在的 Google Cloud Project 的 Project ID。
2. `region`：Cloud SQL instance 所在的區域 (Region)。
3. `instance`：Cloud SQL instance 的名稱。
4. `database`：在 Cloud SQL instance 上要連線的資料庫名稱。

預設情況下，[IAM database authentication](https://cloud.google.com/sql/docs/postgres/iam-authentication#iam-db-auth) 將作為資料庫驗證的方法。此函式庫使用從環境中取得的 [Application Default Credentials (ADC)](https://cloud.google.com/docs/authentication/application-default-credentials) 所屬的 IAM principal。

有關 IAM database authentication 的更多資訊，請參閱：

- [設定一個用於 IAM database authentication 的 instance](https://cloud.google.com/sql/docs/postgres/create-edit-iam-instances)
- [使用 IAM database authentication 管理使用者](https://cloud.google.com/sql/docs/postgres/add-manage-iam-users)

可選地，也可以使用使用使用者名稱和密碼的 [built-in database authentication](https://cloud.google.com/sql/docs/postgres/built-in-authentication) 來存取 Cloud SQL 資料庫。只需向 `PostgresEngine.from_instance()` 提供可選的 `user` 和 `password` 參數：

- `user`：用於 built-in database authentication 和登入的資料庫使用者。
- `password`：用於 built-in database authentication 和登入的資料庫密碼。

**注意：** 本教學演示了 async 介面。所有 async 方法都有對應的 sync 方法。

```
from llama_index_cloud_sql_pg import PostgresEngine


engine = await PostgresEngine.afrom_instance(
    project_id=PROJECT_ID,
    region=REGION,
    instance=INSTANCE,
    database=DATABASE,
    user=USER,
    password=PASSWORD,
)
```

### 初始化一個 table`PostgresVectorStore` 類別需要一個 database table。`PostgresEngine` engine 具有一個 helper method `init_vector_store_table()`，可用於為您建立具有正確 schema 的 table。

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

### 建立 embedding class instance

您可以使用任何 [Llama 索引 embeddings 模型](https://docs.llamaindex.ai/en/stable/module_guides/models/embeddings/)。您可能需要啟用 Vertex AI API 才能使用 `VertexTextEmbeddings`。我們建議為 production 設定 embedding model 的版本，瞭解更多關於 [文字向量嵌入模型](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/text-embeddings) 的資訊。

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

### 初始化 default PostgresVectorStore

```
from llama_index_cloud_sql_pg import PostgresVectorStore


vector_store = await PostgresVectorStore.create(
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

使用 [`VectorStoreIndex`](https://docs.llamaindex.ai/en/stable/module_guides/indexing/vector_store_index/) 從 vector store 建立 index。

#### 使用 documents 初始化 Vector Store

使用 Vector Store 最簡單的方法是載入一組 documents，並使用 `from_documents` 從它們建立 index。

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

建立一個具有自訂 metadata 欄位的新的 table。您也可以重用一個已經具有 Document 的 id、content、embedding 和/或 metadata 自訂欄位的現有 table。

```
from llama_index_cloud_sql_pg import Column


# Set table name
TABLE_NAME = "vectorstore_custom"
# SCHEMA_NAME = "my_schema"


await engine.ainit_vector_store_table(
    table_name=TABLE_NAME,
    # schema_name=SCHEMA_NAME,
    vector_size=768,  # VertexAI model: textembedding-gecko@003
    metadata_columns=[Column("len", "INTEGER")],
)




# Initialize PostgresVectorStore
custom_store = await PostgresVectorStore.create(
    engine=engine,
    table_name=TABLE_NAME,
    # schema_name=SCHEMA_NAME,
    metadata_columns=["len"],
)
```

### 加入帶有 metadata 的 documents

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

### 搜尋帶有 metadata 篩選器 的 documents

您可以透過指定一個 `filters` 參數來對搜尋結果進行預篩選。

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

## 加入 Index

透過應用 vector index 來加速 vector 搜尋查詢。瞭解更多關於 [向量索引](https://cloud.google.com/blog/products/databases/faster-similarity-search-performance-with-pgvector-indexes) 的資訊。

```
from llama_index_cloud_sql_pg.indexes import IVFFlatIndex


index = IVFFlatIndex()
await vector_store.aapply_vector_index(index)
```

### 重新建立 index

```
await vector_store.areindex()  # Re-index using default index name
```

### 移除 index

```
await vector_store.adrop_vector_index()  # Delete index using default name
```
