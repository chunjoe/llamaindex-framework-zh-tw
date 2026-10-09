---
title: "使用 Vector Stores"
---

LlamaIndex 提供多種與 vector stores / vector databases 的整合點：

1. LlamaIndex 可以將 vector store 本身作為 index。像任何其他 index 一樣，這個 index 可以儲存 documents 並用於回答查詢。
2. LlamaIndex 可以從 vector stores 載入資料，類似於任何其他 data connector。這些資料隨後可以在 LlamaIndex data structures 中使用。

## 使用 Vector Store 作為 Index

LlamaIndex 也支援不同的 vector stores 作為 `VectorStoreIndex` 的儲存後端。

- Alibaba Cloud OpenSearch (`AlibabaCloudOpenSearchStore`)。[QuickStart](https://help.aliyun.com/zh/open-search/vector-search-edition)。
- Amazon Neptune - Neptune Analytics (`NeptuneAnalyticsVectorStore`)。[Working with vector similarity in Neptune Analytics](https://docs.aws.amazon.com/neptune-analytics/latest/userguide/vector-similarity.html)。
- Apache Cassandra® 和 Astra DB 透過 CQL (`CassandraVectorStore`)。[Installation](https://cassandra.apache.org/doc/stable/cassandra/getting_started/installing.html) [Quickstart](https://docs.datastax.com/en/astra-serverless/docs/vector-search/overview.html)
- Astra DB (`AstraDBVectorStore`)。[Quickstart](https://docs.datastax.com/en/astra/home/astra.html)。
- AWS Document DB (`AWSDocDbVectorStore`)。[Quickstart](https://docs.aws.amazon.com/documentdb/latest/developerguide/get-started-guide.html)。
- Azure AI Search (`AzureAISearchVectorStore`)。[Quickstart](https://learn.microsoft.com/en-us/azure/search/search-get-started-vector)
- Azure Cosmos DB Mongo vCore(`AzureCosmosDBMongoDBVectorSearch`)。[Quickstart](https://learn.microsoft.com/en-us/azure/cosmos-db/mongodb/vcore/vector-search?tabs=diskann)
- Azure Cosmos DB NoSql (`AzureCosmosDBNoSqlVectorSearch`)。[Quickstart](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/vector-search)
- Chroma (`ChromaVectorStore`) [Installation](https://docs.trychroma.com/getting-started)
- ClickHouse (`ClickHouseVectorStore`) [Installation](https://clickhouse.com/docs/en/install)
- Couchbase (`CouchbaseSearchVectorStore`) [Installation](https://www.couchbase.com/products/capella/)
- DashVector (`DashVectorStore`)。[Installation](https://help.aliyun.com/document_detail/2510230.html)。
- DeepLake (`DeepLakeVectorStore`) [Installation](https://docs.deeplake.ai/en/latest/Installation.html)
- DocArray (`DocArrayHnswVectorStore`, `DocArrayInMemoryVectorStore`)。[Installation/Python Client](https://github.com/docarray/docarray#installation)。
- Elasticsearch (`ElasticsearchStore`) [Installation](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html)
- Epsilla (`EpsillaVectorStore`) [Installation/Quickstart](https://epsilla-inc.gitbook.io/epsilladb/quick-start)
- Faiss (`FaissVectorStore`)。[Installation](https://github.com/facebookresearch/faiss/blob/main/INSTALL.md)。
- Google AlloyDB for PostgreSQL (`AlloyDBVectorStore`)。[QuickStart](https://github.com/googleapis/llama-index-alloydb-pg-python/blob/main/samples/llama_index_vector_store.ipynb)。
- Google Cloud SQL for PostgreSQL (`PostgresVectorStore`)。[Quickstart](https://github.com/googleapis/llama-index-cloud-sql-pg-python/blob/main/samples/llama_index_vector_store.ipynb)
- Hnswlib (`HnswlibVectorStore`)。[Installation](https://github.com/nmslib/hnswlib?tab=readme-ov-file#bindings-installation)。
- txtai (`TxtaiVectorStore`)。[Installation](https://neuml.github.io/txtai/install/)。
- Jaguar (`JaguarVectorStore`)。[Installation](http://www.jaguardb.com/docsetup.html)。
- Lantern (`LanternVectorStore`)。[Quickstart](https://docs.lantern.dev/get-started/overview)。
- MariaDB (`MariaDBVectorStore`)。[MariaDB Vector Overview](https://mariadb.com/kb/en/vector-overview/)
- Milvus (`MilvusVectorStore`)。[Installation](https://milvus.io/docs)
- MongoDB Atlas (`MongoDBAtlasVectorSearch`)。[Installation/Quickstart](https://www.mongodb.com/atlas/database)。
- MyScale (`MyScaleVectorStore`)。[Quickstart](https://docs.myscale.com/en/quickstart/)。[Installation/Python Client](https://docs.myscale.com/en/python-client/)。
- Neo4j (`Neo4jVectorIndex`)。[Installation](https://neo4j.com/docs/operations-manual/current/installation/)。
- OceanBase (`OceanBaseVectorStore`)。[OceanBase Overview](https://github.com/oceanbase/oceanbase)。[Quickstart](https://developers.llamaindex.ai/python/examples/vector_stores/oceanbasevectorstore/index.md)。[Python Client](https://github.com/oceanbase/pyobvector)
- Opensearch (`OpensearchVectorStore`) [Opensearch as vector database](https://opensearch.org/platform/search/vector-database.html)。[QuickStart](https://opensearch.org/docs/latest/search-plugins/knn/index/)
- Pinecone (`PineconeVectorStore`)。[Installation/Quickstart](https://docs.pinecone.io/docs/quickstart)。
- Qdrant (`QdrantVectorStore`) [Installation](https://qdrant.tech/documentation/install/) [Python Client](https://qdrant.tech/documentation/install/#python-client)
- LanceDB (`LanceDBVectorStore`) [Installation/Quickstart](https://lancedb.github.io/lancedb/basic/)
- Redis (`RedisVectorStore`)。[Installation](https://redis.io/docs/latest/operate/oss_and_stack/install/install-stack/)。
- Relyt (`RelytVectorStore`)。[Quickstart](https://docs.relyt.cn/docs/vector-engine/)。
- Supabase (`SupabaseVectorStore`)。[Quickstart](https://supabase.github.io/vecs/api/)。
- Tablestore (`Tablestore`)。[Tablestore Overview](https://www.aliyun.com/product/ots)。[Quickstart](https://developers.llamaindex.ai/python/examples/vector_stores/tablestoredemo/index.md)。[Python Client](https://github.com/aliyun/aliyun-tablestore-python-sdk)。
- TiDB (`TiDBVectorStore`)。[Quickstart](https://developers.llamaindex.ai/python/examples/vector_stores/tidbvector/index.md)。[Installation](https://tidb.cloud/ai)。[Python Client](https://github.com/pingcap/tidb-vector-python)。
- TimeScale (`TimescaleVectorStore`)。[Installation](https://github.com/timescale/python-vector)。
- Upstash (`UpstashVectorStore`)。[Quickstart](https://upstash.com/docs/vector/overall/getstarted)
- VectorX DB (`VectorXVectorStore`)。[Quickstart](https://docs.vectorxdb.ai/quickstart)- Vertex AI Vector Search (`VertexAIVectorStore`). [Quickstart](https://cloud.google.com/vertex-ai/docs/vector-search/quickstart)
- Volcengine MySQL (VolcengineMySQLVectorStore). [Quickstart](https://www.volcengine.com/docs/6313/1978527?lang=en)
- Weaviate (`WeaviateVectorStore`). [Installation](https://weaviate.io/developers/weaviate/installation). [Python Client](https://weaviate.io/developers/weaviate/client-libraries/python).
- WordLift (`WordliftVectorStore`). [Quickstart](https://docs.wordlift.io/llm-connectors/wordlift-vector-store/). [Python Client](https://pypi.org/project/wordlift-client/).
- Zep (`ZepVectorStore`). [Installation](https://docs.getzep.com/deployment/quickstart/). [Python Client](https://docs.getzep.com/sdk/).
- Zilliz (`MilvusVectorStore`). [Quickstart](https://zilliz.com/doc/quick_start)

詳細的 API 參考請見 [這裡](https://developers.llamaindex.ai/python/framework-api-reference/storage/vector_store/index.md)。

與 LlamaIndex 中任何其他索引（tree、keyword table、list）類似，`VectorStoreIndex` 可以建立在任何 documents 的集合上。我們在索引中使用的 vector store 用於儲存輸入文本區塊的 embeddings。

建置完成後，該索引可用於查詢。

**預設 Vector Store 索引建置/查詢**

預設情況下，`VectorStoreIndex` 使用一個在記憶體中的 `SimpleVectorStore`，它作為預設儲存上下文的一部分初始化。

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader


# Load documents and build index
documents = SimpleDirectoryReader("../paul_graham_essay/data").load_data()
index = VectorStoreIndex.from_documents(documents)


# Query index
query_engine = index.as_query_engine()
response = query_engine.query("What did the author do growing up?")
```

**自訂 Vector Store 索引建置/查詢**

我們可以像這樣對自訂 vector store 進行查詢：

```
from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
)
from llama_index.vector_stores.deeplake import DeepLakeVectorStore


# construct vector store and customize storage context
storage_context = StorageContext.from_defaults(
    vector_store=DeepLakeVectorStore(dataset_path="<dataset_path>")
)


# Load documents and build index
documents = SimpleDirectoryReader("../paul_graham_essay/data").load_data()
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)


# Query index
query_engine = index.as_query_engine()
response = query_engine.query("What did the author do growing up?")
```

以下將展示更多我們支援的各種 vector store 的建置範例。

**Alibaba Cloud OpenSearch**

```
from llama_index.vector_stores.alibabacloud_opensearch import (
    AlibabaCloudOpenSearchStore,
    AlibabaCloudOpenSearchConfig,
)


config = AlibabaCloudOpenSearchConfig(
    endpoint="***",
    instance_id="***",
    username="your_username",
    password="your_password",
    table_name="llama",
)


vector_store = AlibabaCloudOpenSearchStore(config)
```

**Google AlloyDB for PostgreSQL**

終端機視窗

```
pip install llama-index
pip install llama-index-alloydb-pg
pip install llama-index-llms-vertex
gcloud services enable aiplatform.googleapis.com
```

```
from llama_index_alloydb_pg import AlloyDBEngine, AlloyDBVectorStore
from llama_index.core import Settings
from llama_index.embeddings.vertex import VertexTextEmbedding
from llama_index.llms.vertex import Vertex
import google.auth


# Replace with your own AlloyDB info
engine = AlloyDBEngine.from_instance(
    project_id=PROJECT_ID,
    region=REGION,
    cluster=CLUSTER,
    instance=INSTANCE,
    database=DATABASE,
    user=USER,
    password=PASSWORD,
)


engine.init_vector_store_table(
    table_name=TABLE_NAME,
    vector_size=768,  # Vector size for VertexAI model(textembedding-gecko@latest)
)


vector_store = AlloyDBVectorStore.create_sync(
    engine=engine,
    table_name=TABLE_NAME,
)
```

**Amazon Neptune - Neptune Analytics**

```
from llama_index.vector_stores.neptune import NeptuneAnalyticsVectorStore


graph_identifier = ""
embed_dim = 1536


neptune_vector_store = NeptuneAnalyticsVectorStore(
    graph_identifier=graph_identifier, embedding_dimension=1536
)
```

**Apache Cassandra®**

```
from llama_index.vector_stores.cassandra import CassandraVectorStore
import cassio


# To use an Astra DB cloud instance through CQL:
cassio.init(database_id="1234abcd-...", token="AstraCS:...")


# For a Cassandra cluster:
from cassandra.cluster import Cluster


cluster = Cluster(["127.0.0.1"])
cassio.init(session=cluster.connect(), keyspace="my_keyspace")


# After the above `cassio.init(...)`, create a vector store:
vector_store = CassandraVectorStore(
    table="cass_v_table", embedding_dimension=1536
)
```

**Astra DB**

```
from llama_index.vector_stores.astra_db import AstraDBVectorStore


astra_db_store = AstraDBVectorStore(
    token="AstraCS:xY3b...",  # Your Astra DB token
    api_endpoint="https://012...abc-us-east1.apps.astra.datastax.com",  # Your Astra DB API endpoint
    collection_name="astra_v_table",  # Table name of your choice
    embedding_dimension=1536,  # Embedding dimension of the embeddings model used
)
```

**Azure Cognitive Search**

```
from azure.core.credentials import AzureKeyCredential
from llama_index.vector_stores.azureaisearch import AzureAISearchVectorStore


search_service_api_key = "YOUR-AZURE-SEARCH-SERVICE-ADMIN-KEY"
search_service_endpoint = "YOUR-AZURE-SEARCH-SERVICE-ENDPOINT"
search_service_api_version = "2023-11-01"
credential = AzureKeyCredential(search_service_api_key)


# Index name to use
index_name = "llamaindex-vector-demo"


client = SearchIndexClient(
    endpoint=search_service_endpoint,
    credential=credential,
)


vector_store = AzureAISearchVectorStore(
    search_or_index_client=client,
    index_name=index_name,
    embedding_dimensionality=1536,
)
```

**Azure CosmosDB Mongo vCore**

```
import pymongo
import os
from llama_index.vector_stores.azurecosmosmongo import (
    AzureCosmosDBMongoDBVectorSearch,
)


# Set up the connection string with your Azure CosmosDB MongoDB URI
connection_string = os.getenv("YOUR_AZURE_COSMOSDB_MONGODB_URI")
mongodb_client = pymongo.MongoClient(connection_string)


# Create an instance of AzureCosmosDBMongoDBVectorSearch
vector_store = AzureCosmosDBMongoDBVectorSearch(
    mongodb_client=mongodb_client,
    db_name="demo_vectordb",
    collection_name="paul_graham_essay",
)
```

**Azure CosmosDB NoSql**

```
from azure.cosmos import CosmosClient, PartitionKey
import os
from llama_index.vector_stores.azurecosmosnosql import (
    AzureCosmosDBNoSqlVectorSearch,
)


URL = os.getenv("AZURE_COSMOSDB_URI")
KEY = os.getenv("AZURE_COSMOSDB_KEY")
database_name = "test_database"
container_name = "test_container"
test_client = CosmosClient(URL, credential=KEY)


indexing_policy = {
    "indexingMode": "consistent",
    "includedPaths": [{"path": "/*"}],
    "excludedPaths": [{"path": '/"_etag"/?'}],
    "vectorIndexes": [{"path": "/embedding", "type": "quantizedFlat"}],
}


vector_embedding_policy = {
    "vectorEmbeddings": [
        {
            "path": "/embedding",
            "dataType": "float32",
            "distanceFunction": "cosine",
            "dimensions": 1536,
        }
    ]
}


partition_key = PartitionKey(path="/id")
cosmos_container_properties_test = {"partition_key": partition_key}
cosmos_database_properties_test = {}


vector_store = AzureCosmosDBNoSqlVectorSearch(
    cosmos_client=test_client,
    vector_embedding_policy=vector_embedding_policy,
    indexing_policy=indexing_policy,
    database_name=database_name,
    container_name=container_name,
    cosmos_database_properties=cosmos_database_properties_test,
    cosmos_container_properties=cosmos_container_properties_test,
)
```

**Chroma**

```
import chromadb
from llama_index.vector_stores.chroma import ChromaVectorStore


# Creating a Chroma client
# EphemeralClient operates purely in-memory, PersistentClient will also save to disk
chroma_client = chromadb.EphemeralClient()
chroma_collection = chroma_client.create_collection("quickstart")


# construct vector store
vector_store = ChromaVectorStore(
    chroma_collection=chroma_collection,
)
```

**ClickHouse**

```
import clickhouse_connect
from llama_index.vector_stores import ClickHouseVectorStore


# Creating a ClickHouse client
client = clickhouse_connect.get_client(
    host="YOUR_CLUSTER_HOST",
    port=8123,
    username="YOUR_USERNAME",
    password="YOUR_CLUSTER_PASSWORD",
)


# construct vector store
vector_store = ClickHouseVectorStore(clickhouse_client=client)
```

**Couchbase**

```
from datetime import timedelta


from couchbase.auth import PasswordAuthenticator
from couchbase.cluster import Cluster
from couchbase.options import ClusterOptions


# Create a Couchbase Cluster object
auth = PasswordAuthenticator("DATABASE_USERNAME", "DATABASE_PASSWORD")
options = ClusterOptions(auth)
cluster = Cluster("CLUSTER_CONNECTION_STRING", options)


# Wait until the cluster is ready for use.
cluster.wait_until_ready(timedelta(seconds=5))


# Create the Vector Store
vector_store = CouchbaseSearchVectorStore(
    cluster=cluster,
    bucket_name="BUCKET_NAME",
    scope_name="SCOPE_NAME",
    collection_name="COLLECTION_NAME",
    index_name="SEARCH_INDEX_NAME",
)
```

**DashVector**

```
import dashvector
from llama_index.vector_stores.dashvector import DashVectorStore


# init dashvector client
client = dashvector.Client(
    api_key="your-dashvector-api-key",
    endpoint="your-dashvector-cluster-endpoint",
)


# creating a DashVector collection
client.create("quickstart", dimension=1536)
collection = client.get("quickstart")


# construct vector store
vector_store = DashVectorStore(collection)
```

**DeepLake**

```
import os
import getpath
from llama_index.vector_stores.deeplake import DeepLakeVectorStore


os.environ["OPENAI_API_KEY"] = getpath.getpath("OPENAI_API_KEY: ")
os.environ["ACTIVELOOP_TOKEN"] = getpath.getpath("ACTIVELOOP_TOKEN: ")
dataset_path = "hub://adilkhan/paul_graham_essay"


# construct vector store
vector_store = DeepLakeVectorStore(dataset_path=dataset_path, overwrite=True)
```

**DocArray**

```
from llama_index.vector_stores.docarray import (
    DocArrayHnswVectorStore,
    DocArrayInMemoryVectorStore,
)


# construct vector store
vector_store = DocArrayHnswVectorStore(work_dir="hnsw_index")


# alternatively, construct the in-memory vector store
vector_store = DocArrayInMemoryVectorStore()
```

**Elasticsearch**

首先，您可以在本地或 [Elastic cloud](https://cloud.elastic.co/registration?utm_source=llama-index\&utm_content=documentation) 上啟動 Elasticsearch。

要使用 docker 在本地啟動 Elasticsearch，請執行以下指令：

終端機視窗

```
docker run -p 9200:9200 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  -e "xpack.security.http.ssl.enabled=false" \
  -e "xpack.license.self_generated.type=trial" \
  docker.elastic.co/elasticsearch/elasticsearch:8.9.0
```

然後連接並使用 Elasticsearch 作為 vector database 與 LlamaIndex 配合。

```
from llama_index.vector_stores.elasticsearch import ElasticsearchStore


vector_store = ElasticsearchStore(
    index_name="llm-project",
    es_url="http://localhost:9200",
    # Cloud connection options:
    # es_cloud_id="<cloud_id>",
    # es_user="elastic",
    # es_password="<password>",
)
```

這可以與 `VectorStoreIndex` 配合使用，為檢索、查詢、刪除、儲存索引等提供查詢介面。

**Epsilla**

```
from pyepsilla import vectordb
from llama_index.vector_stores.epsilla import EpsillaVectorStore


# Creating an Epsilla client
epsilla_client = vectordb.Client()


# Construct vector store
vector_store = EpsillaVectorStore(client=epsilla_client)
```

**注意**：`EpsillaVectorStore` 依賴於 `pyepsilla` 函式庫和正在運行的 Epsilla vector database。如果尚未安裝，請使用 `pip/pip3 install pyepsilla`。可透過 docker image 找到正在運行的 Epsilla vector database。完整說明請參閱以下文件：<https://epsilla-inc.gitbook.io/epsilladb/quick-start>

**Faiss**

```
import faiss
from llama_index.vector_stores.faiss import FaissVectorStore


# create faiss index
d = 1536
faiss_index = faiss.IndexFlatL2(d)


# construct vector store
vector_store = FaissVectorStore(faiss_index)


# if update/delete functionality is needed you can leverage the FaissMapVectorStore


d = 1536
faiss_index = faiss.IndexFlatL2(d)
id_map_index = faiss.IndexIDMap2(faiss_index)
vector_store = FaissMapVectorStore(id_map_index)


...


# NOTE: since faiss index is in-memory, we need to explicitly call
#       vector_store.persist() or storage_context.persist() to save it to disk.
#       persist() takes in optional arg persist_path. If none give, will use default paths.
storage_context.persist()
```

**Google Cloud SQL for PostgreSQL**

終端機視窗

```
pip install llama-index
pip install llama-index-cloud-sql-pg
pip install llama-index-llms-vertex
gcloud services enable aiplatform.googleapis.com
```

```
from llama_index_cloud_sql_pg import PostgresEngine, PostgresVectorStore
from llama_index.core import Settings
from llama_index.embeddings.vertex import VertexTextEmbedding
from llama_index.llms.vertex import Vertex
import google.auth


# Replace with your own Cloud SQL info
engine = PostgresEngine.from_instance(
    project_id=PROJECT_ID,
    region=REGION,
    instance=INSTANCE,
    database=DATABASE,
    user=USER,
    password=PASSWORD,
)


engine.init_vector_store_table(
    table_name=TABLE_NAME,
    vector_size=768,  # Vector size for VertexAI model(textembedding-gecko@latest)
)


vector_store = PostgresVectorStore.create_sync(
    engine=engine,
    table_name=TABLE_NAME,
)
```

**txtai**

```
import txtai
from llama_index.vector_stores.txtai import TxtaiVectorStore


# create txtai index
txtai_index = txtai.ann.ANNFactory.create(
    {"backend": "numpy", "dimension": 512}
)


# construct vector store
vector_store = TxtaiVectorStore(txtai_index)
```

**Jaguar**

```
from llama_index.core.schema import TextNode
from llama_index.core.vector_stores import VectorStoreQuery
from jaguardb_http_client.JaguarHttpClient import JaguarHttpClient
from llama_index.vector_stores.jaguar import JaguarVectorStore




# construct vector store client
url = "http://127.0.0.1:8080/fwww/"
pod = "vdb"
store = "llamaindex_rag_store"
vector_index = "v"
vector_type = "cosine_fraction_float"
vector_dimension = 3


# require JAGUAR_API_KEY environment variable or file $HOME/.jagrc to hold the
# jaguar API key to connect to jaguar store server
vector_store = JaguarVectorStore(
    pod, store, vector_index, vector_type, vector_dimension, url
)


# login to jaguar server for security authentication
vector_store.login()


# create a vector store on the back-end server
metadata_fields = "author char(32), category char(16)"
text_size = 1024
vector_store.create(metadata_fields, text_size)


# store some text
node = TextNode(
    text="Return of King Lear",
    metadata={"author": "William", "category": "Tragedy"},
    embedding=[0.9, 0.1, 0.4],
)
vector_store.add(nodes=[node], use_node_metadata=True)


# make a query
qembedding = [0.4, 0.2, 0.8]
vsquery = VectorStoreQuery(query_embedding=qembedding, similarity_top_k=1)
query_result = vector_store.query(vsquery)


# make a query with metadata filter (where condition)
qembedding = [0.6, 0.1, 0.4]
vsquery = VectorStoreQuery(query_embedding=qembedding, similarity_top_k=3)
where = "author='Eve' or (author='Adam' and category='History')"
query_result = vector_store.query(vsquery, where=where)


# make a query ignoring old data (with time cutoff)
qembedding = [0.3, 0.3, 0.8]
vsquery = VectorStoreQuery(query_embedding=qembedding, similarity_top_k=3)
args = "day_cutoff=180"  # only search recent 180 days data
query_result = vector_store.query(vsquery, args=args)


# check if a vector is anomalous
text = ("Gone With The Wind",)
embed_of_text = [0.7, 0.1, 0.2]
node = TextNode(text=text, embedding=embed_of_text)
true_or_false = vector_store.is_anomalous(node)


# llama_index RAG application
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core import StorageContext
from llama_index.core import VectorStoreIndex


question = "What did the author do growing up?"


storage_context = StorageContext.from_defaults(vector_store=vector_store)
embed_model = OpenAIEmbedding()
embed_of_question = [0.7, 0.1, 0.2]


db_documents = vector_store.load_documents(embed_of_question, 10)
index = VectorStoreIndex.from_documents(
    db_documents,
    embed_model=embed_model,
    storage_context=storage_context,
)


query_engine = index.as_query_engine()
print(f"Question: {question}")
response = query_engine.query(question)
print(f"Answer: {str(response)}")


# logout to clean up resources
vector_store.logout()
```

**注意**：Client (需要 jaguardb-http-client) <—> Http Gateway <—> JaguarDB Server Client side 需要執行：“pip install -U jaguardb-http-client”

**MariaDB**

```
from llama_index.vector_stores.mariadb import MariaDBVectorStore


vector_store = MariaDBVectorStore.from_params(
    host="localhost",
    port=3306,
    user="llamaindex",
    password="password",
    database="vectordb",
    table_name="llama_index_vectorstore",
    embed_dim=1536,  # OpenAI embedding dimension
)
```

**Milvus**

- Milvus Index 提供了儲存 Documents 及其 embeddings 的能力。

```
import pymilvus
from llama_index.vector_stores.milvus import MilvusVectorStore


# construct vector store
vector_store = MilvusVectorStore(
    uri="https://localhost:19530", overwrite="True"
)
```

**注意**：`MilvusVectorStore` 依賴於 `pymilvus` 函式庫。如果尚未安裝，請使用 `pip install pymilvus`。如果在建置 `grpcio` wheel 時遇到困難，請檢查您是否正在使用 python 3.11（存在已知問題：<https://github.com/milvus-io/pymilvus/issues/1308>），並嘗試降級。

**MongoDBAtlas**

```
# Provide URI to constructor, or use environment variable
import pymongo
from llama_index.vector_stores.mongodb import MongoDBAtlasVectorSearch
from llama_index.core import VectorStoreIndex
from llama_index.core import StorageContext
from llama_index.core import SimpleDirectoryReader


# mongo_uri = os.environ["MONGO_URI"]
mongo_uri = (
    "mongodb+srv://<username>:<password>@<host>?retryWrites=true&w=majority"
)
mongodb_client = pymongo.MongoClient(mongo_uri)
async_mongodb_client = pymongo.AsyncMongoClient(mongo_uri)


# construct store
store = MongoDBAtlasVectorSearch(
    mongodb_client=mongodb_client, async_mongodb_client=async_mongodb_client
)
storage_context = StorageContext.from_defaults(vector_store=store)
uber_docs = SimpleDirectoryReader(
    input_files=["../data/10k/uber_2021.pdf"]
).load_data()


# construct index
index = VectorStoreIndex.from_documents(
    uber_docs, storage_context=storage_context
)
```

**MyScale**

```
import clickhouse_connect
from llama_index.vector_stores.myscale import MyScaleVectorStore


# Creating a MyScale client
client = clickhouse_connect.get_client(
    host="YOUR_CLUSTER_HOST",
    port=8443,
    username="YOUR_USERNAME",
    password="YOUR_CLUSTER_PASSWORD",
)




# construct vector store
vector_store = MyScaleVectorStore(myscale_client=client)
```

**Neo4j**

- Neo4j 儲存文本、metadata 和 embeddings，並可以自訂以以 metadata 的形式返回圖形資料。

```
from llama_index.vector_stores.neo4jvector import Neo4jVectorStore


# construct vector store
neo4j_vector = Neo4jVectorStore(
    username="neo4j",
    password="pleaseletmein",
    url="bolt://localhost:7687",
    embed_dim=1536,
)
```

**Pinecone**

```
import pinecone
from llama_index.vector_stores.pinecone import PineconeVectorStore


# Creating a Pinecone index
api_key = "api_key"
pinecone.init(api_key=api_key, environment="us-west1-gcp")
pinecone.create_index(
    "quickstart", dimension=1536, metric="euclidean", pod_type="p1"
)
index = pinecone.Index("quickstart")


# construct vector store
vector_store = PineconeVectorStore(pinecone_index=index)
```

**Qdrant**

```
import qdrant_client
from llama_index.vector_stores.qdrant import QdrantVectorStore


# Creating a Qdrant vector store
client = qdrant_client.QdrantClient(
    host="<qdrant-host>", api_key="<qdrant-api-key>", https=True
)
collection_name = "paul_graham"


# construct vector store
vector_store = QdrantVectorStore(
    client=client,
    collection_name=collection_name,
)
```

**Redis**

首先，啟動 Redis-Stack（或從 Redis provider 獲取 url）

終端機視窗

```
docker run --name redis-vecdb -d -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
```
然後連接並使用 Redis 作為向量資料庫與 LlamaIndex

```
from llama_index.vector_stores.redis import RedisVectorStore


vector_store = RedisVectorStore(
    index_name="llm-project",
    redis_url="redis://localhost:6379",
    overwrite=True,
)
```

這可以與 `VectorStoreIndex` 一起使用，為檢索、查詢、刪除、儲存索引等提供查詢介面。

**SingleStore**

```
from llama_index.vector_stores.singlestoredb import SingleStoreVectorStore
import os


# can set the singlestore db url in env
# or pass it in as an argument to the SingleStoreVectorStore constructor
os.environ["SINGLESTOREDB_URL"] = "PLACEHOLDER URL"
vector_store = SingleStoreVectorStore(
    table_name="embeddings",
    content_field="content",
    metadata_field="metadata",
    vector_field="vector",
    timeout=30,
)
```

**Tablestore**

```
import tablestore
from llama_index.vector_stores.tablestore import TablestoreVectorStore


# create a vector store that does not support filtering non-vector fields
simple_vector_store = TablestoreVectorStore(
    endpoint="<end_point>",
    instance_name="<instance_name>",
    access_key_id="<access_key_id>",
    access_key_secret="<access_key_secret>",
    vector_dimension=512,
)


# create a vector store that support filtering non-vector fields
vector_store_with_meta_data = TablestoreVectorStore(
    endpoint="<end_point>",
    instance_name="<instance_name>",
    access_key_id="<access_key_id>",
    access_key_secret="<access_key_secret>",
    vector_dimension=512,
    # optional: custom metadata mapping is used to filter non-vector fields.
    metadata_mappings=[
        tablestore.FieldSchema(
            "type",  # non-vector fields
            tablestore.FieldType.KEYWORD,
            index=True,
            enable_sort_and_agg=True,
        ),
        tablestore.FieldSchema(
            "time",  # non-vector fields
            tablestore.FieldType.LONG,
            index=True,
            enable_sort_and_agg=True,
        ),
    ],
)
```

**TiDB**

```
from llama_index.vector_stores.tidbvector import TiDBVectorStore


tidbvec = TiDBVectorStore(
    # connection url format
    # - mysql+pymysql://root@34.212.137.91:4000/test
    connection_string="PLACEHOLDER URL",
    table_name="llama_index_vectorstore",
    distance_strategy="cosine",
    vector_dimension=1536,
)
```

**Timescale**

```
from llama_index.vector_stores.timescalevector import TimescaleVectorStore


vector_store = TimescaleVectorStore.from_params(
    service_url="YOUR TIMESCALE SERVICE URL",
    table_name="paul_graham_essay",
)
```

**Upstash**

```
from llama_index.vector_stores.upstash import UpstashVectorStore


vector_store = UpstashVectorStore(url="YOUR_URL", token="YOUR_TOKEN")
```

**VectorX DB**

```
from vecx_llamaindex import VectorXVectorStore
from llama_index.core import StorageContext
import time


# Create a unique index name with timestamp to avoid conflicts
timestamp = int(time.time())
index_name = f"llamaindex_demo_{timestamp}"


# Set up the embedding model
embed_model = OpenAIEmbedding()


# Get the embedding dimension
dimension = 1536  # OpenAI's default embedding dimension


# Initialize the VectorX vector store
vector_store = VectorXVectorStore.from_params(
    api_token=vecx_api_token,
    encryption_key=encryption_key,
    index_name=index_name,
    dimension=dimension,
    space_type="cosine",  # Can be "cosine", "l2", or "ip"
)


storage_context = StorageContext.from_defaults(vector_store=vector_store)


index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context, embed_model=embed_model
)


query_engine = index.as_query_engine()


# Ask a question
response = query_engine.query("What is Python?")


# Create a filtered retriever to only search within AI-related documents
ai_filter = MetadataFilter(
    key="category", value="ai", operator=FilterOperator.EQ
)
ai_filters = MetadataFilters(filters=[ai_filter])


# Create a filtered query engine
filtered_query_engine = index.as_query_engine(filters=ai_filters)


# Ask a general question but only using AI documents
response = filtered_query_engine.query("What is learning from data?")
```

**Vertex AI Vector Search**

```
from llama_index.vector_stores.vertexaivectorsearch import VertexAIVectorStore


vector_store = VertexAIVectorStore(
    project_id="[your-google-cloud-project-id]",
    region="[your-google-cloud-region]",
    index_id="[your-index-resource-name]",
    endpoint_id="[your-index-endpoint-name]",
)
```

**Weaviate**

```
import weaviate
from llama_index.vector_stores.weaviate import WeaviateVectorStore


# creating a Weaviate client
resource_owner_config = weaviate.AuthClientPassword(
    username="<username>",
    password="<password>",
)
client = weaviate.Client(
    "https://<cluster-id>.semi.network/",
    auth_client_secret=resource_owner_config,
)


# construct vector store
vector_store = WeaviateVectorStore(weaviate_client=client)
```

**Zep**

Zep 儲存文字、metadata 和 embeddings。所有內容都會在搜尋結果中返回。

```
from llama_index.vector_stores.zep import ZepVectorStore


vector_store = ZepVectorStore(
    api_url="<api_url>",
    api_key="<api_key>",
    collection_name="<unique_collection_name>",  # Can either be an existing collection or a new one
    embedding_dimensions=1536,  # Optional, required if creating a new collection
)


storage_context = StorageContext.from_defaults(vector_store=vector_store)


index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)


# Query index using both a text query and metadata filters
filters = MetadataFilters(
    filters=[ExactMatchFilter(key="theme", value="Mafia")]
)
retriever = index.as_retriever(filters=filters)
result = retriever.retrieve("What is inception about?")
```

**Zilliz**

- Zilliz Cloud (Milvus 的託管版本) 使用 Milvus Index 並帶有額外的參數。

```
import pymilvus
from llama_index.vector_stores.milvus import MilvusVectorStore




# construct vector store
vector_store = MilvusVectorStore(
    uri="foo.vectordb.zillizcloud.com",
    token="your_token_here",
    overwrite="True",
)
```

[範例 notebook 可在此處找到](https://github.com/jerryjliu/llama_index/tree/main/docs/examples/vector_stores)。

## 使用 Data Connector 從向量儲存中載入資料

LlamaIndex 支援從大量的來源載入資料。請參閱 [Data Connectors](/python/framework/module_guides/loading/connector/modules/) 以獲取更多詳細資訊和 API 文件。

AlloyDB 儲存 document 和 vectors。本教學演示同步介面。所有同步方法都有對應的異步方法。這是一個使用 AlloyDB 的範例：

終端機視窗

```
pip install llama-index
pip install llama-index-alloydb-pg
```

```
from llama_index.core import SummaryIndex
from llama_index_alloydb_pg import AlloyDBEngine, AlloyDBReader


engine = AlloyDBEngine.from_instance(
    project_id=PROJECT_ID,
    region=REGION,
    cluster=CLUSTER,
    instance=INSTANCE,
    database=DATABASE,
    user=USER,
    password=PASSWORD,
)
reader = AlloyDBReader.create_sync(
    engine,
    table_name=TABLE_NAME,
)
documents = reader.load_data()


index = SummaryIndex.from_documents(documents)


query_engine = index.as_query_engine()
response = query_engine.query("<query_text>")
display(Markdown(f"<b>{response}</b>"))
```

Google Cloud SQL for PostgreSQL 儲存 document 和 vectors。本教學演示同步介面。所有同步方法都有對應的異步方法。這是一個使用 Cloud SQL for PostgreSQL 的範例：

終端機視窗

```
pip install llama-index
pip install llama-index-cloud-sql-pg
```

```
from llama_index.core import SummaryIndex
from llama_index_cloud_sql_pg import PostgresEngine, PostgresReader


engine = PostgresEngine.from_instance(
    project_id=PROJECT_ID,
    region=REGION,
    instance=INSTANCE,
    database=DATABASE,
    user=USER,
    password=PASSWORD,
)
reader = PostgresReader.create_sync(
    engine,
    table_name=TABLE_NAME,
)
documents = reader.load_data()


index = SummaryIndex.from_documents(documents)


query_engine = index.as_query_engine()
response = query_engine.query("<query_text>")
display(Markdown(f"<b>{response}</b>"))
```

Chroma 儲存 documents 和 vectors。這是一個使用 Chroma 的範例：

```
from llama_index.readers.chroma import ChromaReader
from llama_index.core import SummaryIndex


# The chroma reader loads data from a persisted Chroma collection.
# This requires a collection name and a persist directory.
reader = ChromaReader(
    collection_name="chroma_collection",
    persist_directory="examples/data_connectors/chroma_collection",
)


query_vector = [n1, n2, n3, ...]


documents = reader.load_data(
    collection_name="demo", query_vector=query_vector, limit=5
)
index = SummaryIndex.from_documents(documents)


query_engine = index.as_query_engine()
response = query_engine.query("<query_text>")
display(Markdown(f"<b>{response}</b>"))
```

Qdrant 也儲存 documents 和 vectors。這是一個使用 Qdrant 的範例：

```
from llama_index.readers.qdrant import QdrantReader


reader = QdrantReader(host="localhost")


# the query_vector is an embedding representation of your query_vector
# Example query_vector
# query_vector = [0.3, 0.3, 0.3, 0.3, ...]


query_vector = [n1, n2, n3, ...]


# NOTE: Required args are collection_name, query_vector.
# See the Python client: https;//github.com/qdrant/qdrant_client
# for more details


documents = reader.load_data(
    collection_name="demo", query_vector=query_vector, limit=5
)
```

注意：由於 Weaviate 可以儲存 document 和 vector 物件的混合，使用者可以選擇明確指定 `class_name` 和 `properties` 以查詢 documents，或者他們可以選擇指定原始的 GraphQL query。請參閱下方以了解用法。

```
# option 1: specify class_name and properties


# 1) load data using class_name and properties
documents = reader.load_data(
    class_name="<class_name>",
    properties=["property1", "property2", "..."],
    separate_documents=True,
)


# 2) example GraphQL query
query = """
{
    Get {
        <class_name> {
            <property1>
            <property2>
        }
    }
}
"""


documents = reader.load_data(graphql_query=query, separate_documents=True)
```

注意：Pinecone 和 Faiss data loader 都假設各自的資料來源只儲存 vectors；文字內容儲存在其他地方。因此，這兩種 data loader 都要求使用者在 load\_data 呼叫中指定一個 `id_to_text_map`。

例如，這是 Pinecone data loader `PineconeReader` 的範例用法：

```
from llama_index.readers.pinecone import PineconeReader


reader = PineconeReader(api_key=api_key, environment="us-west1-gcp")


id_to_text_map = {
    "id1": "text blob 1",
    "id2": "text blob 2",
}


query_vector = [n1, n2, n3, ...]


documents = reader.load_data(
    index_name="quickstart",
    id_to_text_map=id_to_text_map,
    top_k=3,
    vector=query_vector,
    separate_documents=True,
)
```

[範例 notebook 可在此處找到](https://github.com/jerryjliu/llama_index/tree/main/docs/examples/data_connectors)。

## 向量儲存範例

- [Alibaba Cloud OpenSearch](https://developers.llamaindex.ai/python/examples/vector_stores/alibabacloudopensearchindexdemo/index.md)
- [Amazon Neptune - Neptune Analytics](https://developers.llamaindex.ai/python/examples/vector_stores/amazonneptunevectordemo/index.md)
- [Astra DB](https://developers.llamaindex.ai/python/examples/vector_stores/astradbindexdemo/index.md)
- [Async Index Creation](https://developers.llamaindex.ai/python/examples/vector_stores/asyncindexcreationdemo/index.md)
- [Azure AI Search](https://developers.llamaindex.ai/python/examples/vector_stores/azureaisearchindexdemo/index.md)
- [Azure Cosmos DB](https://developers.llamaindex.ai/python/examples/vector_stores/azurecosmosdbmongodbvcoredemo/index.md)
- [Caasandra](https://developers.llamaindex.ai/python/examples/vector_stores/cassandraindexdemo/index.md)
- [Chromadb](https://developers.llamaindex.ai/python/examples/vector_stores/chromaindexdemo/index.md)
- [Couchbase](https://developers.llamaindex.ai/python/examples/vector_stores/couchbasevectorstoredemo/index.md)
- [Dash](https://developers.llamaindex.ai/python/examples/vector_stores/dashvectorindexdemo/index.md)
- [Deeplake](https://developers.llamaindex.ai/python/examples/vector_stores/deeplakeindexdemo/index.md)
- [DocArray HNSW](https://developers.llamaindex.ai/python/examples/vector_stores/docarrayhnswindexdemo/index.md)
- [DocArray in-Memory](https://developers.llamaindex.ai/python/examples/vector_stores/docarrayinmemoryindexdemo/index.md)
- [Espilla](https://developers.llamaindex.ai/python/examples/vector_stores/epsillaindexdemo/index.md)
- [Google AlloyDB for PostgreSQL](https://developers.llamaindex.ai/python/examples/vector_stores/alloydbvectorstoredemo/index.md)
- [Google Cloud SQL for PostgreSQL](https://developers.llamaindex.ai/python/examples/vector_stores/cloudsqlpgvectorstoredemo/index.md)
- [LanceDB](https://developers.llamaindex.ai/python/examples/vector_stores/lancedbindexdemo/index.md)
- [Lantern](https://developers.llamaindex.ai/python/examples/vector_stores/lanternindexdemo/index.md)
- [Milvus](https://developers.llamaindex.ai/python/examples/vector_stores/milvusindexdemo/index.md)
- [Milvus Async API](https://developers.llamaindex.ai/python/examples/vector_stores/milvusasyncapidemo/index.md)
- [Milvus Full-Text Search](https://developers.llamaindex.ai/python/examples/vector_stores/milvusfulltextsearchdemo/index.md)
- [Milvus Hybrid Search](https://developers.llamaindex.ai/python/examples/vector_stores/milvushybridindexdemo/index.md)
- [MyScale](https://developers.llamaindex.ai/python/examples/vector_stores/myscaleindexdemo/index.md)
- [ElsaticSearch](https://developers.llamaindex.ai/python/examples/vector_stores/elasticsearchindexdemo/index.md)
- [FAISS](https://developers.llamaindex.ai/python/examples/vector_stores/faissindexdemo/index.md)
- [MongoDB Atlas](https://developers.llamaindex.ai/python/examples/vector_stores/mongodbatlasvectorsearch/index.md)
- [Neo4j](https://developers.llamaindex.ai/python/examples/vector_stores/neo4jvectordemo/index.md)
- [OpenSearch](https://developers.llamaindex.ai/python/examples/vector_stores/opensearchdemo/index.md)
- [Pinecone](https://developers.llamaindex.ai/python/examples/vector_stores/pineconeindexdemo/index.md)
- [Pinecone Hybrid Search](https://developers.llamaindex.ai/python/examples/vector_stores/pineconeindexdemo-hybrid/index.md)
- [PGvectoRS](https://developers.llamaindex.ai/python/examples/vector_stores/pgvectorsdemo/index.md)
- [Postgres](https://developers.llamaindex.ai/python/examples/vector_stores/postgres/index.md)
- [Redis](https://developers.llamaindex.ai/python/examples/vector_stores/redisindexdemo/index.md)
- [Qdrant](https://developers.llamaindex.ai/python/examples/vector_stores/qdrantindexdemo/index.md)- [Qdrant Hybrid Search](https://developers.llamaindex.ai/python/examples/vector_stores/qdrant_hybrid/index.md)
- [Rockset](https://developers.llamaindex.ai/python/examples/vector_stores/rocksetindexdemo/index.md)
- [Simple](https://developers.llamaindex.ai/python/examples/vector_stores/simpleindexdemo/index.md)
- [Supabase](https://developers.llamaindex.ai/python/examples/vector_stores/supabasevectorindexdemo/index.md)
- [Tablestore](https://developers.llamaindex.ai/python/examples/vector_stores/tablestoredemo/index.md)
- [Tair](https://developers.llamaindex.ai/python/examples/vector_stores/tairindexdemo/index.md)
- [Tencent](https://developers.llamaindex.ai/python/examples/vector_stores/tencentvectordbindexdemo/index.md)
- [Timesacle](https://developers.llamaindex.ai/python/examples/vector_stores/timescalevector/index.md)
- [Upstash](https://developers.llamaindex.ai/python/examples/vector_stores/upstashvectordemo/index.md)
- [VectorX DB](https://developers.llamaindex.ai/python/examples/vector_stores/vectorxdbdemo/index.md)
- [Weaviate](https://developers.llamaindex.ai/python/examples/vector_stores/weaviateindexdemo/index.md)
- [Weaviate Hybrid Search](https://developers.llamaindex.ai/python/examples/vector_stores/weaviateindexdemo-hybrid/index.md)
- [WordLift](https://developers.llamaindex.ai/python/examples/vector_stores/wordliftdemo/index.md)
- [Zep](https://developers.llamaindex.ai/python/examples/vector_stores/zepindexdemo/index.md)