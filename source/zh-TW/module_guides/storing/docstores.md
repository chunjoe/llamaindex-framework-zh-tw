---
title: "Document 儲存"
---

Document stores 包含已擷取的 document chunks，我們稱之為 `Node` objects。

請參閱 [API Reference](https://developers.llamaindex.ai/python/framework-api-reference/storage/docstore/index.md) 以獲取更多詳細資料。

### 簡單的 Document Store

預設情況下，`SimpleDocumentStore` stores 將 `Node` objects 儲存在記憶體中。它們可以透過呼叫 `docstore.persist()`（和 `SimpleDocumentStore.from_persist_path(...)`）分別存取到磁碟上（儲存和載入）。

更完整的範例可見 [這裡](https://developers.llamaindex.ai/python/examples/docstore/docstoredemo/index.md)。

### MongoDB Document Store

我們支援 MongoDB 作為替代 document store backend，在擷取 `Node` objects 時持久化資料。

```
from llama_index.storage.docstore.mongodb import MongoDocumentStore
from llama_index.core.node_parser import SentenceSplitter


# create parser and parse document into nodes
parser = SentenceSplitter()
nodes = parser.get_nodes_from_documents(documents)


# create (or load) docstore and add nodes
docstore = MongoDocumentStore.from_uri(uri="<mongodb+srv://...>")
docstore.add_documents(nodes)


# create storage context
storage_context = StorageContext.from_defaults(docstore=docstore)


# build index
index = VectorStoreIndex(nodes, storage_context=storage_context)
```

在底層，`MongoDocumentStore` 連接到一個固定的 MongoDB database，並為您的 nodes 初始化新的 collection（或載入現有的 collection）。

> 注意：您可以在實例化 `MongoDocumentStore` 時配置 `db_name` 和 `namespace`，否則它們預設為 `db_name="db_docstore"` 和 `namespace="docstore"`。

請注意，在使用 `MongoDocumentStore` 時不需要呼叫 `storage_context.persist()`（或 `docstore.persist()`），因為資料預設會持久化。

您可以重新連線到您的 MongoDB collection，並透過重新初始化一個具有現有 `db_name` 和 `collection_name` 的 `MongoDocumentStore` 來重新初始化 index。

更完整的範例可見 [這裡](https://developers.llamaindex.ai/python/examples/docstore/mongodocstoredemo/index.md)。

### Redis Document Store

我們支援 Redis 作為替代 document store backend，在擷取 `Node` objects 時持久化資料。

```
from llama_index.storage.docstore.redis import RedisDocumentStore
from llama_index.core.node_parser import SentenceSplitter


# create parser and parse document into nodes
parser = SentenceSplitter()
nodes = parser.get_nodes_from_documents(documents)


# create (or load) docstore and add nodes
docstore = RedisDocumentStore.from_host_and_port(
    host="127.0.0.1", port="6379", namespace="llama_index"
)
docstore.add_documents(nodes)


# create storage context
storage_context = StorageContext.from_defaults(docstore=docstore)


# build index
index = VectorStoreIndex(nodes, storage_context=storage_context)
```

在底層，`RedisDocumentStore` 連接到一個 redis database，並將您的 nodes 添加到儲存在 `{namespace}/docs` 下的 namespace 中。

> 注意：您可以在實例化 `RedisDocumentStore` 時配置 `namespace`，否則它預設為 `namespace="docstore"`。

您可以輕鬆重新連線到您的 Redis client，並透過重新初始化一個具有現有 `host`、`port` 和 `namespace` 的 `RedisDocumentStore` 來重新初始化 index。

更完整的範例可見 [這裡](https://developers.llamaindex.ai/python/examples/docstore/redisdocstoreindexstoredemo/index.md)。

### Firestore Document Store

我們支援 Firestore 作為替代 document store backend，在擷取 `Node` objects 時持久化資料。

```
from llama_index.storage.docstore.firestore import FirestoreDocumentStore
from llama_index.core.node_parser import SentenceSplitter


# create parser and parse document into nodes
parser = SentenceSplitter()
nodes = parser.get_nodes_from_documents(documents)


# create (or load) docstore and add nodes
docstore = FirestoreDocumentStore.from_database(
    project="project-id",
    database="(default)",
)
docstore.add_documents(nodes)


# create storage context
storage_context = StorageContext.from_defaults(docstore=docstore)


# build index
index = VectorStoreIndex(nodes, storage_context=storage_context)
```

在底層，`FirestoreDocumentStore` 連接到 Google Cloud 中的 firestore database，並將您的 nodes 添加到儲存在 `{namespace}/docs` 下的 namespace 中。

> 注意：您可以在實例化 `FirestoreDocumentStore` 時配置 `namespace`，否則它預設為 `namespace="docstore"`。

您可以輕鬆重新連線到您的 Firestore database，並透過重新初始化一個具有現有 `project`、`database` 和 `namespace` 的 `FirestoreDocumentStore` 來重新初始化 index。

更完整的範例可見 [這裡](https://developers.llamaindex.ai/python/examples/docstore/firestoredemo/index.md)。

### Couchbase Document Store

我們支援 Couchbase 作為替代 document store backend，在擷取 `Node` objects 時持久化資料。

```
from llama_index.storage.docstore.couchbase import CouchbaseDocumentStore
from llama_index.core.node_parser import SentenceSplitter


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


# create parser and parse document into nodes
parser = SentenceSplitter()
nodes = parser.get_nodes_from_documents(documents)


# create (or load) docstore and add nodes
docstore = CouchbaseDocumentStore.from_couchbase_client(
    client=cluster,
    bucket_name="llama-index",
    scope_name="_default",
    namespace="default",
)
docstore.add_documents(nodes)


# create storage context
storage_context = StorageContext.from_defaults(docstore=docstore)


# build index
index = VectorStoreIndex(nodes, storage_context=storage_context)
```

在底層，`CouchbaseDocumentStore` 連接到一個 Couchbase operational database，並將您的 nodes 添加到在指定 `{bucket_name}` 和 `{scope_name}` 下的 collection 中，該 collection 名稱為 `{namespace}_data`。

> 注意：您可以在實例化 `CouchbaseIndexStore` 時配置 `namespace`、`bucket` 和 `scope`。預設使用的 collection 是 `docstore_data`。除了字母數字字元外，`-`、`_` 和 `%` 僅允許作為 collection 名的一部分。store 會自動將其他特殊字元轉換為 `_`。

您可以輕鬆重新連線到您的 Couchbase database，並透過重新初始化一個具有現有 `client`、`bucket_name`、`scope_name` 和 `namespace` 的 `CouchbaseDocumentStore` 來重新初始化 index。

### Tablestore Document Store

我們支援 Tablestore 作為替代 document store backend，在擷取 `Node` objects 時持久化資料。

```
from llama_index.core import Document
from llama_index.core import StorageContext, VectorStoreIndex
from llama_index.core.node_parser import SentenceSplitter


from llama_index.storage.docstore.tablestore import TablestoreDocumentStore


# create parser and parse document into nodes
parser = SentenceSplitter()
documents = [
    Document(text="I like cat.", id_="1", metadata={"key1": "value1"}),
    Document(text="Mike likes dog.", id_="2", metadata={"key2": "value2"}),
]
nodes = parser.get_nodes_from_documents(documents)


# create (or load) doc_store and add nodes
docs_tore = TablestoreDocumentStore.from_config(
    endpoint="<tablestore_end_point>",
    instance_name="<tablestore_instance_name>",
    access_key_id="<tablestore_access_key_id>",
    access_key_secret="<tablestore_access_key_secret>",
)
docs_tore.add_documents(nodes)


# create storage context
storage_context = StorageContext.from_defaults(docstore=docs_tore)


# build index
index = VectorStoreIndex(nodes, storage_context=storage_context)
```
Under the hood, `TablestoreDocumentStore` connects to a Tablestore database and adds your nodes to a table named under `{namespace}_data`.

> Note: 您可以設定該 `namespace` 在實例化時 `TablestoreDocumentStore`.

您可以輕鬆地重新連接到您的 Tablestore 資料庫，並透過重新初始化一個 `TablestoreDocumentStore` 使用現有的 `endpoint`, `instance_name`, `access_key_id` 以及 `access_key_secret`.

您可以參考更完整的範例 [此處](https://developers.llamaindex.ai/python/examples/docstore/tablestoredocstoredemo/index.md)

### Google AlloyDB Document Store

我們支援將 [AlloyDB](https://cloud.google.com/products/alloydb) 作為替代的 document store 後端，在匯入 `Node` 物件時將資料持久化。

本教學將示範同步介面。所有同步方法都有對應的非同步方法。

終端機視窗

```
pip install llama-index
pip install llama-index-alloydb-pg
pip install llama-index-llms-vertex
```

```
from llama_index.core import SummaryIndex
from llama_index_alloydb_pg import AlloyDBEngine, AlloyDBDocumentStore


# create parser and parse document into nodes
parser = SentenceSplitter()
nodes = parser.get_nodes_from_documents(documents)


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
engine.init_doc_store_table(
    table_name=TABLE_NAME,
)


doc_store = AlloyDBDocumentStore.create_sync(
    engine=engine,
    table_name=TABLE_NAME,
)


doc_store.add_documents(nodes)


# create storage context
storage_context = StorageContext.from_defaults(docstore=doc_store)


# build index
index = VectorStoreIndex(nodes, storage_context=storage_context)
```

> Note: 您可以設定該 `schema_name` 以及該 `table_name` 在初始化新資料表並實例化時 `AlloyDBDocumentStore`. 預設情況下，該 `schema_name` 是 `public`.

在底層，`AlloyDBDocumentStore` 會連接到 Google Cloud 中的 alloydb 資料庫，並將您的 nodes 新增至 `schema_name`.
 下的資料表中。
您可以輕鬆地重新連接到您的 AlloyDB 資料庫，並透過重新初始化一個 `AlloyDBDocumentStore` 使用一個 `AlloyDBEngine` 無需初始化新資料表。

詳細指南請參閱 [此處](https://developers.llamaindex.ai/python/examples/docstore/alloydbdocstoredemo/index.md)

### Google Cloud SQL for PostgreSQL Document Store

我們支援 [Cloud SQL 對於 PostgreSQL](https://cloud.google.com/sql) 作為另一種選擇 document 儲存後端 將資料持久化為 `Node` 物件已匯入。

本教學將示範同步介面。所有同步方法都有對應的非同步方法。

終端機視窗

```
pip install llama-index
pip install llama-index-cloud-sql-pg
```

```
from llama_index.core import SummaryIndex
from llama_index_cloud_sql_pg import PostgresEngine, PostgresDocumentStore


# create parser and parse document into nodes
parser = SentenceSplitter()
nodes = parser.get_nodes_from_documents(documents)


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
engine.init_doc_store_table(
    table_name=TABLE_NAME,
)


doc_store = PostgresDocumentStore.create_sync(
    engine=engine,
    table_name=TABLE_NAME,
)


doc_store.add_documents(nodes)


# create storage context
storage_context = StorageContext.from_defaults(docstore=doc_store)


# build index
index = VectorStoreIndex(nodes, storage_context=storage_context)
```

> Note: 您可以設定該 `schema_name` 以及該 `table_name` 在初始化新資料表並實例化時 `PostgresDocumentStore`. 預設情況下，該 `schema_name` 是 `public`.

在底層， `PostgresDocumentStore` 連接至雲端 sql 對於 pg 資料庫於 Google Cloud 並將您的 nodes 至位於以下路徑之資料表： `schema_name`.

您可以輕鬆地重新連接到您的 Postgres 資料庫，並透過重新初始化一個 `PostgresDocumentStore` 使用一個 `PostgresEngine` 無需初始化新資料表。

詳細指南請參閱 [此處](https://developers.llamaindex.ai/python/examples/docstore/cloudsqlpgdocstoredemo/index.md)
