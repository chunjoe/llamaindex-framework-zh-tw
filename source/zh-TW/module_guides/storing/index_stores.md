---
title: "索引儲存"
---

Index stores 包含輕量級的 index metadata（即在建置 index 時所建立的額外狀態資訊）。

請參閱 [API Reference](https://developers.llamaindex.ai/python/framework-api-reference/storage/index_store/index.md) 以獲取更多詳情。

### 簡單 Index Store

預設情況下，LlamaIndex 使用一個由 in-memory key-value store 支援的簡單 index store。它們可以透過呼叫 `index_store.persist()`（和 `SimpleIndexStore.from_persist_path(...)` 分別）存取到磁碟上（以及從中載入）。

### MongoDB Index Store

您也可以使用 MongoDB 作為 index store 的儲存後端。在開始之前，請執行以下指令安裝整合套件：

終端機視窗

```
pip install llama-index-storage-index-store-mongodb
```

然後，使用以下程式碼建立一個 `MongoIndexStore`，連接到您的 MongoDB deployment，並建置或載入一個 `VectorStoreIndex`：

```
from llama_index.storage.index_store.mongodb import MongoIndexStore
from llama_index.core import (
    VectorStoreIndex,
    StorageContext,
    load_index_from_storage,
)


# create (or load) index store
index_store = MongoIndexStore.from_uri(uri="<mongodb+srv://...>")


# create storage context
storage_context = StorageContext.from_defaults(index_store=index_store)


# build index from your parsed nodes
index = VectorStoreIndex(nodes, storage_context=storage_context)


# or alternatively, load an existing index
index = load_index_from_storage(storage_context)
```

`MongoIndexStore` 連接到一個 MongoDB database 並初始化您的 index metadata 的新 collection（或載入現有的 collection）。

您可以使用自管理的 MongoDB deployment 或 MongoDB Atlas cluster。如欲了解如何取得 connection string，請參閱 MongoDB 文件中的 [Connection Strings](https://www.mongodb.com/docs/manual/reference/connection-string/)。

> 注意：您可以在實例化 `MongoIndexStore` 時配置 `db_name`、`namespace` 和 `collection_suffix`。否則，它們預設為 `db_name="db_docstore"`、`namespace="index_store"` 和 `collection_suffix="/data"`，而 `MongoIndexStore` 會將資料寫入 `db_docstore` database 中的 collection `index_store/data`。

當使用 `MongoIndexStore` 時，您不需要呼叫 `storage_context.persist()`（或 `index_store.persist()`），因為資料預設會被持久化。

若要重新連接到您的 collection 並重新載入 index，請使用相同的 `db_name`、`namespace` 和 `collection_suffix` 值重新初始化一個 `MongoIndexStore`。

如需更完整的範例，請參閱 [MongoDB docstore demo](https://developers.llamaindex.ai/python/examples/docstore/mongodocstoredemo/index.md)。

### Redis Index Store

我們支援 Redis 作為 document 的替代 store backend，它在 ingestion `Node` objects 時持久化資料。

```
from llama_index.storage.index_store.redis import RedisIndexStore
from llama_index.core import VectorStoreIndex


# create (or load) docstore and add nodes
index_store = RedisIndexStore.from_host_and_port(
    host="127.0.0.1", port="6379", namespace="llama_index"
)


# create storage context
storage_context = StorageContext.from_defaults(index_store=index_store)


# build index
index = VectorStoreIndex(nodes, storage_context=storage_context)


# or alternatively, load index
from llama_index.core import load_index_from_storage


index = load_index_from_storage(storage_context)
```

在底層，`RedisIndexStore` 連接到一個 redis database，並將您的 nodes 添加到儲存在 `{namespace}/index` 下的 namespace 中。

> 注意：您可以在實例化 `RedisIndexStore` 時配置 `namespace`，否則它預設為 `namespace="index_store"`。

您可以透過重新初始化一個 `RedisIndexStore`，使用現有的 `host`、`port` 和 `namespace`，輕鬆重新連接到您的 Redis client 並重新載入 index。

更完整的範例可以在 [這裡](https://developers.llamaindex.ai/python/examples/docstore/redisdocstoreindexstoredemo/index.md) 找到。

### Couchbase Index Store

Couchbase 可以用作 index store 的儲存後端。

```
from llama_index.storage.index_store.couchbase import CouchbaseIndexStore
from llama_index.core import VectorStoreIndex


from couchbase.cluster import Cluster
from couchbase.auth import PasswordAuthenticator
from couchbase.options import ClusterOptions
from datetime import timedelta


# create couchbase client
auth = PasswordAuthenticator("DB_USERNAME", "DB_PASSWORD")
options = ClusterOptions(authenticator=auth)


cluster = Cluster("couchbase://localhost", options)


# Wait until the cluster is ready for use.
cluster.wait_until_ready(timedelta(seconds=5))


# create (or load) docstore and add nodes
index_store = CouchbaseIndexStore.from_couchbase_client(
    client=cluster,
    bucket_name="llama-index",
    scope_name="_default",
    namespace="default",
)


# create storage context
storage_context = StorageContext.from_defaults(index_store=index_store)


# build index
index = VectorStoreIndex(nodes, storage_context=storage_context)


# or alternatively, load index
from llama_index.core import load_index_from_storage


index = load_index_from_storage(storage_context)
```

在底層，`CouchbaseIndexStore` 連接到一個 Couchbase operational database，並將您的 nodes 添加到指定 `{bucket_name}` 和 `{scope_name}` 中的名為 `{namespace}_index` 的 collection 中。

> 注意：您可以在實例化 `CouchbaseIndexStore` 時配置 `namespace`、`bucket` 和 `scope`。預設使用的 collection 是 `index_store_data`。除了字母數字字元外，`-`、`_` 和 `%` 只允許作為 collection 名的一部分。store 會自動將其他特殊字元轉換為 `_`。

您可以透過重新初始化一個 `CouchbaseIndexStore`，使用現有的 `client`、`bucket_name`、`scope_name` 和 `namespace`，輕鬆重新連接到您的 Couchbase client 並重新載入 index。

### Tablestore Index Store

與 document stores 類似，我們也可以使用 `Tablestore` 作為 index store 的儲存後端。

```
from llama_index.storage.index_store.tablestore import TablestoreIndexStore
from llama_index.core import StorageContext, VectorStoreIndex


# create (or load) index store
index_store = TablestoreIndexStore.from_config(
    endpoint="<tablestore_end_point>",
    instance_name="<tablestore_instance_name>",
    access_key_id="<tablestore_access_key_id>",
    access_key_secret="<tablestore_access_key_secret>",
)


# create storage context
storage_context = StorageContext.from_defaults(index_store=index_store)


# build index
index = VectorStoreIndex(nodes, storage_context=storage_context)


# or alternatively, load index
from llama_index.core import load_index_from_storage


index = load_index_from_storage(storage_context)
```

在底層，`TablestoreIndexStore` 連接到一個 Tablestore database，並將您的 nodes 添加到名為 `{namespace}_data` 的 table 中。

> 注意：您可以在實例化 `TablestoreIndexStore` 時配置 `namespace`。您可以透過重新初始化一個 `TablestoreIndexStore`，並使用現有的 `endpoint`、`instance_name`、`access_key_id` 和 `access_key_secret` 來輕鬆重新連線到您的 Tablestore 資料庫並重新載入索引。

更多完整的範例請參閱 [此處](https://developers.llamaindex.ai/python/examples/docstore/tablestoredocstoredemo/index.md)

### Google AlloyDB Index Store

與 document stores 類似，我們也可以使用 [`AlloyDB`](https://cloud.google.com/products/alloydb) 作為 index store 的儲存後端。本教學演示同步介面。所有同步方法都有對應的異步方法。

終端機視窗

```
pip install llama-index
pip install llama-index-alloydb-pg
pip install llama-index-llms-vertex
```

```
from llama_index_alloydb_pg import AlloyDBEngine, AlloyDBIndexStore
from llama_index.core import StorageContext, VectorStoreIndex


# create an AlloyDB Engine for connection pool
engine = AlloyDBEngine.from_instance(
    project_id=PROJECT_ID,
    region=REGION,
    cluster=CLUSTER,
    instance=INSTANCE,
    database=DATABASE,
    user=USER,
    password=PASSWORD,
)


# initialize a new table in AlloyDB
engine.init_index_store_table(
    table_name=TABLE_NAME,
)


index_store = AlloyDBIndexStore.create_sync(
    engine=engine,
    table_name=TABLE_NAME,
)


# create storage context
storage_context = StorageContext.from_defaults(index_store=index_store)


# build index
index = VectorStoreIndex(nodes, storage_context=storage_context)


# or alternatively, load index
from llama_index.core import load_index_from_storage


index = load_index_from_storage(storage_context)
```

> 注意：在初始化新資料表並實例化 `AlloyDBIndexStore` 時，您可以同時設定 `schema_name` 和 `table_name`。預設情況下，`schema_name` 是 `public`。

在底層，`AlloyDBIndexStore` 連線到 Google Cloud 中的 alloydb 資料庫，並將您的 nodes 添加到 `schema_name` 下的資料表中。

您可以透過重新初始化一個 `AlloyDBIndexStore` 並使用一個 `AlloyDBEngine` 來輕鬆重新連線到您的 AlloyDB 資料庫並重新載入索引，而無需初始化新資料表。

更詳細的指南請參閱 [此處](https://developers.llamaindex.ai/python/examples/docstore/alloydbdocstoredemo/index.md)

### Google Cloud SQL for PostgreSQL Index Store

與 document stores 類似，我們也可以使用 [`Cloud SQL for PostgreSQL`](https://cloud.google.com/sql) 作為 index store 的儲存後端。本教學演示同步介面。所有同步方法都有對應的異步方法。

終端機視窗

```
pip install llama-index
pip install llama-index-cloud-sql-pg
```

```
from llama_index_cloud_sql_pg import PostgresEngine, PostgresIndexStore
from llama_index.core import StorageContext, VectorStoreIndex


# create an Postgres Engine for connection pool
engine = PostgresEngine.from_instance(
    project_id=PROJECT_ID,
    region=REGION,
    instance=INSTANCE,
    database=DATABASE,
    user=USER,
    password=PASSWORD,
)


# initialize a new table in cloud sql postgres
engine.init_index_store_table(
    table_name=TABLE_NAME,
)


index_store = PostgresIndexStore.create_sync(
    engine=engine,
    table_name=TABLE_NAME,
)


# create storage context
storage_context = StorageContext.from_defaults(index_store=index_store)


# build index
index = VectorStoreIndex(nodes, storage_context=storage_context)


# or alternatively, load index
from llama_index.core import load_index_from_storage


index = load_index_from_storage(storage_context)
```

> 注意：在初始化新資料表並實例化 `PostgresIndexStore` 時，您可以同時設定 `schema_name` 和 `table_name`。預設情況下，`schema_name` 是 `public`。

在底層，`PostgresIndexStore` 連線到 Google Cloud 中的 sql postgres 資料庫，並將您的 nodes 添加到 `schema_name` 下的資料表中。

您可以透過重新初始化一個 `PostgresIndexStore` 並使用一個 `PostgresEngine` 來輕鬆重新連線到您的 cloud sql postgres 資料庫並重新載入索引，而無需初始化新資料表。

更詳細的指南請參閱 [此處](https://developers.llamaindex.ai/python/examples/docstore/cloudsqlpgdocstoredemo/index.md)