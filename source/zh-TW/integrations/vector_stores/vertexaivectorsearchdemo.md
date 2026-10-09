---
title: "Google Vertex AI 向量搜尋"
---

此筆記示範如何使用與 `Google Cloud Vertex AI Vector Search` vector database 相關的功能。

> [Google Vertex AI 向量 搜尋](https://cloud.google.com/vertex-ai/docs/vector-search/overview)，以前稱為 Vertex AI Matching Engine，提供業界領先的高擴展性低延遲 vector database。這些 vector database 通常被稱為 vector similarity-matching 或 approximate nearest neighbor (ANN) service。

**注意**：LlamaIndex 需要 Vertex AI Vector Search endpoint，且已建立部署的 index。建立一個空的 index 可能需要長達一分鐘，將 index 部署到 endpoint 可能需要長達 30 分鐘。

> 要查看如何建立 index，請參閱 [建立 Index 並將其部署至 Endpoint](/python/framework/integrations/vector_stores/vertexaivectorsearchdemo/#create-index-and-deploy-it-to-an-endpoint) 部分。
> 如果您已經有部署的 index，請跳至 [Create VectorStore from texts](/python/framework/integrations/vector_stores/vertexaivectorsearchdemo/#create-vector-store-from-texts)。

## 安裝

如果您在 colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
! pip install llama-index llama-index-vector-stores-vertexaivectorsearch llama-index-llms-vertex
```


## 建立 Index 並部署到 Endpoint

- 此部分示範如何建立新的 index 並將其部署到 endpoint。

```
# TODO : Set values as per your requirements


# Project and Storage Constants
PROJECT_ID = "[your_project_id]"
REGION = "[your_region]"
GCS_BUCKET_NAME = "[your_gcs_bucket]"
GCS_BUCKET_URI = f"gs://{GCS_BUCKET_NAME}"


# The number of dimensions for the textembedding-gecko@003 is 768
# If other embedder is used, the dimensions would probably need to change.
VS_DIMENSIONS = 768


# Vertex AI Vector Search Index configuration
# parameter description here
# https://cloud.google.com/python/docs/reference/aiplatform/latest/google.cloud.aiplatform.MatchingEngineIndex#google_cloud_aiplatform_MatchingEngineIndex_create_tree_ah_index
VS_INDEX_NAME = "llamaindex-doc-index"  # @param {type:"string"}
VS_INDEX_ENDPOINT_NAME = "llamaindex-doc-endpoint"  # @param {type:"string"}
```

```
from google.cloud import aiplatform


aiplatform.init(project=PROJECT_ID, location=REGION)
```


### 建立 Cloud Storage bucket

```
# Create a bucket.
! gsutil mb -l $REGION -p $PROJECT_ID $GCS_BUCKET_URI
```


### 建立一個空的 Index

**注意：** 在建立 index 時，您應該指定一個 “index\_update\_method”——`BATCH_UPDATE` 或 `STREAM_UPDATE`。

> Batch index 用於當您想批次更新您的 index，包含在一段時間內儲存的資料，例如每週或每月處理的系統。
>
> Streaming index 是當您希望 index 資料隨著新資料添加到您的 datastore 而更新，例如，如果您有一家書店並希望盡快在網路上顯示新的庫存。
>
> 您選擇哪種類型很重要，因為設定和要求是不同的。

請參閱 [Official Documentation](https://cloud.google.com/vertex-ai/docs/vector-search/create-manage-index) 和 [API reference](https://cloud.google.com/python/docs/reference/aiplatform/latest/google.cloud.aiplatform.MatchingEngineIndex#google_cloud_aiplatform_MatchingEngineIndex_create_tree_ah_index) 以獲取有關配置 index 的更多詳細資訊。

```
# NOTE : This operation can take upto 30 seconds


# check if index exists
index_names = [
    index.resource_name
    for index in aiplatform.MatchingEngineIndex.list(
        filter=f"display_name={VS_INDEX_NAME}"
    )
]


if len(index_names) == 0:
    print(f"Creating Vector Search index {VS_INDEX_NAME} ...")
    vs_index = aiplatform.MatchingEngineIndex.create_tree_ah_index(
        display_name=VS_INDEX_NAME,
        dimensions=VS_DIMENSIONS,
        distance_measure_type="DOT_PRODUCT_DISTANCE",
        shard_size="SHARD_SIZE_SMALL",
        index_update_method="STREAM_UPDATE",  # allowed values BATCH_UPDATE , STREAM_UPDATE
    )
    print(
        f"Vector Search index {vs_index.display_name} created with resource name {vs_index.resource_name}"
    )
else:
    vs_index = aiplatform.MatchingEngineIndex(index_name=index_names[0])
    print(
        f"Vector Search index {vs_index.display_name} exists with resource name {vs_index.resource_name}"
    )
```


### 建立 Endpoint

要使用 index，您需要建立一個 index endpoint。它作為一個伺服器實例，接收您 index 的查詢請求。endpoint 可以是 [public endpoint](https://cloud.google.com/vertex-ai/docs/vector-search/deploy-index-public) 或 [private endpoint](https://cloud.google.com/vertex-ai/docs/vector-search/deploy-index-vpc)。

讓我們建立一個 public endpoint。

```
endpoint_names = [
    endpoint.resource_name
    for endpoint in aiplatform.MatchingEngineIndexEndpoint.list(
        filter=f"display_name={VS_INDEX_ENDPOINT_NAME}"
    )
]


if len(endpoint_names) == 0:
    print(
        f"Creating Vector Search index endpoint {VS_INDEX_ENDPOINT_NAME} ..."
    )
    vs_endpoint = aiplatform.MatchingEngineIndexEndpoint.create(
        display_name=VS_INDEX_ENDPOINT_NAME, public_endpoint_enabled=True
    )
    print(
        f"Vector Search index endpoint {vs_endpoint.display_name} created with resource name {vs_endpoint.resource_name}"
    )
else:
    vs_endpoint = aiplatform.MatchingEngineIndexEndpoint(
        index_endpoint_name=endpoint_names[0]
    )
    print(
        f"Vector Search index endpoint {vs_endpoint.display_name} exists with resource name {vs_endpoint.resource_name}"
    )
```


### 將 Index 部署到 Endpoint

使用 index endpoint，您可以透過指定一個唯一的 deployed index ID 來部署 index。

**注意：此操作可能需要長達 30 分鐘。**

```
# check if endpoint exists
index_endpoints = [
    (deployed_index.index_endpoint, deployed_index.deployed_index_id)
    for deployed_index in vs_index.deployed_indexes
]


if len(index_endpoints) == 0:
    print(
        f"Deploying Vector Search index {vs_index.display_name} at endpoint {vs_endpoint.display_name} ..."
    )
    vs_deployed_index = vs_endpoint.deploy_index(
        index=vs_index,
        deployed_index_id=VS_INDEX_NAME,
        display_name=VS_INDEX_NAME,
        machine_type="e2-standard-16",
        min_replica_count=1,
        max_replica_count=1,
    )
    print(
        f"Vector Search index {vs_index.display_name} is deployed at endpoint {vs_deployed_index.display_name}"
    )
else:
    vs_deployed_index = aiplatform.MatchingEngineIndexEndpoint(
        index_endpoint_name=index_endpoints[0][0]
    )
    print(
        f"Vector Search index {vs_index.display_name} is already deployed at endpoint {vs_deployed_index.display_name}"
    )
```


## 從文本建立 Vector Store

注意：如果您已經有現有的 Vertex AI Vector Search Index 和 Endpoints，您可以使用以下程式碼將它們指派：

```
# TODO : replace 1234567890123456789 with your actual index ID
vs_index = aiplatform.MatchingEngineIndex(index_name="1234567890123456789")


# TODO : replace 1234567890123456789 with your actual endpoint ID
vs_endpoint = aiplatform.MatchingEngineIndexEndpoint(
    index_endpoint_name="1234567890123456789"
)
```

```
# import modules needed
from llama_index.core import (
    StorageContext,
    Settings,
    VectorStoreIndex,
    SimpleDirectoryReader,
)
from llama_index.core.schema import TextNode
from llama_index.core.vector_stores.types import (
    MetadataFilters,
    MetadataFilter,
    FilterOperator,
)
from llama_index.llms.vertex import Vertex
from llama_index.embeddings.vertex import VertexTextEmbedding
from llama_index.vector_stores.vertexaivectorsearch import VertexAIVectorStore
```


### 從純文字建立一個簡單的 vector store，不帶 metadata 篩選器

```
# setup storage
vector_store = VertexAIVectorStore(
    project_id=PROJECT_ID,
    region=REGION,
    index_id=vs_index.resource_name,
    endpoint_id=vs_endpoint.resource_name,
    gcs_bucket_name=GCS_BUCKET_NAME,
)


# set storage context
storage_context = StorageContext.from_defaults(vector_store=vector_store)
```


### 使用 [Vertex AI Embeddings](https://github.com/run-llama/llama_index/tree/main/llama-index-integrations/embeddings/llama-index-embeddings-vertex) 作為 embeddings model

```
# configure embedding model
embed_model = VertexTextEmbedding(
    model_name="textembedding-gecko@003",
    project=PROJECT_ID,
    location=REGION,
)


# setup the index/query process, ie the embedding model (and completion if used)
Settings.embed_model = embed_model
```


### 向您的 vectore store 添加 vectors 和 mapped text chunks

```
# Input texts
texts = [
    "The cat sat on",
    "the mat.",
    "I like to",
    "eat pizza for",
    "dinner.",
    "The sun sets",
    "in the west.",
]
nodes = [
    TextNode(text=text, embedding=embed_model.get_text_embedding(text))
    for text in texts
]


vector_store.add(nodes)
```


### 執行相似度搜尋

```
# define index from vector store
index = VectorStoreIndex.from_vector_store(
    vector_store=vector_store, embed_model=embed_model
)
retriever = index.as_retriever()
```

```
response = retriever.retrieve("pizza")
for row in response:
    print(f"Score: {row.get_score():.3f} Text: {row.get_text()}")
```

```
Score: 0.703 Text: eat pizza for
Score: 0.626 Text: dinner.
```


## 添加 documents 及其 metadata 屬性並使用 filters

```
# Input text with metadata
records = [
    {
        "description": "A versatile pair of dark-wash denim jeans."
        "Made from durable cotton with a classic straight-leg cut, these jeans"
        " transition easily from casual days to dressier occasions.",
        "price": 65.00,
        "color": "blue",
        "season": ["fall", "winter", "spring"],
    },
    {
        "description": "A lightweight linen button-down shirt in a crisp white."
        " Perfect for keeping cool with breathable fabric and a relaxed fit.",
        "price": 34.99,
        "color": "white",
        "season": ["summer", "spring"],
    },
    {
        "description": "A soft, chunky knit sweater in a vibrant forest green. "
        "The oversized fit and cozy wool blend make this ideal for staying warm "
        "when the temperature drops.",
        "price": 89.99,
        "color": "green",
        "season": ["fall", "winter"],
    },
    {
        "description": "A classic crewneck t-shirt in a soft, heathered blue. "
        "Made from comfortable cotton jersey, this t-shirt is a wardrobe essential "
        "that works for every season.",
        "price": 19.99,
        "color": "blue",
        "season": ["fall", "winter", "summer", "spring"],
    },
    {
        "description": "A flowing midi-skirt in a delicate floral print. "
        "Lightweight and airy, this skirt adds a touch of feminine style "
        "to warmer days.",
        "price": 45.00,
        "color": "white",
        "season": ["spring", "summer"],
    },
]


nodes = []
for record in records:
    text = record.pop("description")
    embedding = embed_model.get_text_embedding(text)
    metadata = {**record}
    nodes.append(TextNode(text=text, embedding=embedding, metadata=metadata))


vector_store.add(nodes)
```


### 使用 filters 執行相似度搜尋

```
# define index from vector store
index = VectorStoreIndex.from_vector_store(
    vector_store=vector_store, embed_model=embed_model
)
```

```
# simple similarity search without filter
retriever = index.as_retriever()
response = retriever.retrieve("pants")


for row in response:
    print(f"Text: {row.get_text()}")
    print(f"   Score: {row.get_score():.3f}")
    print(f"   Metadata: {row.metadata}")
```

```
Text: A pair of well-tailored dress pants in a neutral grey. Made from a wrinkle-resistant blend, these pants look sharp and professional for workwear or formal occasions.
   Score: 0.669
   Metadata: {'price': 69.99, 'color': 'grey', 'season': ['fall', 'winter', 'summer', 'spring']}
Text: A pair of tailored black trousers in a comfortable stretch fabric. Perfect for work or dressier events, these trousers provide a sleek, polished look.
   Score: 0.642
   Metadata: {'price': 59.99, 'color': 'black', 'season': ['fall', 'winter', 'spring']}
```

```
# similarity search with text filter
filters = MetadataFilters(filters=[MetadataFilter(key="color", value="blue")])
retriever = index.as_retriever(filters=filters, similarity_top_k=3)
response = retriever.retrieve("denims")


for row in response:
    print(f"Text: {row.get_text()}")
    print(f"   Score: {row.get_score():.3f}")
    print(f"   Metadata: {row.metadata}")
```

```
Text: A versatile pair of dark-wash denim jeans.Made from durable cotton with a classic straight-leg cut, these jeans transition easily from casual days to dressier occasions.
   Score: 0.704
   Metadata: {'price': 65.0, 'color': 'blue', 'season': ['fall', 'winter', 'spring']}
Text: A denim jacket with a faded wash and distressed details. This wardrobe staple adds a touch of effortless cool to any outfit.
   Score: 0.667
   Metadata: {'price': 79.99, 'color': 'blue', 'season': ['fall', 'spring', 'summer']}
```

```
# similarity search with text and numeric filter
filters = MetadataFilters(
    filters=[
        MetadataFilter(key="color", value="blue"),
        MetadataFilter(key="price", operator=FilterOperator.GT, value=70.0),
    ]
)
retriever = index.as_retriever(filters=filters, similarity_top_k=3)
response = retriever.retrieve("denims")


for row in response:
    print(f"Text: {row.get_text()}")
    print(f"   Score: {row.get_score():.3f}")
    print(f"   Metadata: {row.metadata}")
```

```
Text: A denim jacket with a faded wash and distressed details. This wardrobe staple adds a touch of effortless cool to any outfit.
   Score: 0.667
   Metadata: {'price': 79.99, 'color': 'blue', 'season': ['fall', 'spring', 'summer']}
```


## 使用 Vertex AI Vector Search 和 Gemini Pro 解析、建立索引和查詢 PDF

```
! mkdir -p ./data/arxiv/
! wget 'https://arxiv.org/pdf/1706.03762.pdf' -O ./data/arxiv/test.pdf
```

```
E0501 00:56:50.842446801  266241 backup_poller.cc:127]                 Run client channel backup poller: UNKNOWN:pollset_work {created_time:"2024-05-01T00:56:50.841935606+00:00", children:[UNKNOWN:Bad file descriptor {created_time:"2024-05-01T00:56:50.841810434+00:00", errno:9, os_error:"Bad file descriptor", syscall:"epoll_wait"}]}
--2024-05-01 00:56:52--  https://arxiv.org/pdf/1706.03762.pdf
Resolving arxiv.org (arxiv.org)... 151.101.67.42, 151.101.195.42, 151.101.131.42, ...
Connecting to arxiv.org (arxiv.org)|151.101.67.42|:443... connected.
HTTP request sent, awaiting response... 301 Moved Permanently
Location: http://arxiv.org/pdf/1706.03762 [following]
--2024-05-01 00:56:52--  http://arxiv.org/pdf/1706.03762
Connecting to arxiv.org (arxiv.org)|151.101.67.42|:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 2215244 (2.1M) [application/pdf]
Saving to: ‘./data/arxiv/test.pdf’


./data/arxiv/test.p 100%[===================>]   2.11M  --.-KB/s    in 0.07s


2024-05-01 00:56:52 (31.5 MB/s) - ‘./data/arxiv/test.pdf’ saved [2215244/2215244]
```

```
# load documents
documents = SimpleDirectoryReader("./data/arxiv/").load_data()
print(f"# of documents = {len(documents)}")
```

```
# of documents = 15
```

```
# setup storage
vector_store = VertexAIVectorStore(
    project_id=PROJECT_ID,
    region=REGION,
    index_id=vs_index.resource_name,
    endpoint_id=vs_endpoint.resource_name,
    gcs_bucket_name=GCS_BUCKET_NAME,
)


# set storage context
storage_context = StorageContext.from_defaults(vector_store=vector_store)


# configure embedding model
embed_model = VertexTextEmbedding(
    model_name="textembedding-gecko@003",
    project=PROJECT_ID,
    location=REGION,
)


vertex_gemini = Vertex(
    model="gemini-pro",
    context_window=100000,
    temperature=0,
    additional_kwargs={},
)


# setup the index/query process, ie the embedding model (and completion if used)
Settings.llm = vertex_gemini
Settings.embed_model = embed_model
```

```
# define index from vector store
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

```
query_engine = index.as_query_engine()
```

```
response = query_engine.query(
    "who are the authors of paper Attention is All you need?"
)


print(f"Response:")
print("-" * 80)
print(response.response)
print("-" * 80)
print(f"Source Documents:")
print("-" * 80)
for source in response.source_nodes:
    print(f"Sample Text: {source.text[:50]}")
    print(f"Relevance score: {source.get_score():.3f}")
    print(f"File Name: {source.metadata.get('file_name')}")
    print(f"Page #: {source.metadata.get('page_label')}")
    print(f"File Path: {source.metadata.get('file_path')}")
    print("-" * 80)
```

```
Response:
--------------------------------------------------------------------------------
The authors of the paper "Attention Is All You Need" are:


* Ashish Vaswani
* Noam Shazeer
* Niki Parmar
* Jakob Uszkoreit
* Llion Jones
* Aidan N. Gomez
* Łukasz Kaiser
* Illia Polosukhin
--------------------------------------------------------------------------------
Source Documents:
--------------------------------------------------------------------------------
Sample Text: Provided proper attribution is provided, Google he
Relevance score: 0.720
File Name: test.pdf
Page #: 1
File Path: /home/jupyter/llama_index/docs/examples/vector_stores/data/arxiv/test.pdf
--------------------------------------------------------------------------------
Sample Text: length nis smaller than the representation dimensi
Relevance score: 0.678
File Name: test.pdf
Page #: 7
File Path: /home/jupyter/llama_index/docs/examples/vector_stores/data/arxiv/test.pdf
--------------------------------------------------------------------------------
```


---

## 清理

請在執行實驗後刪除 Vertex AI Vector Search Index 和 Index Endpoint，以避免產生額外費用。請注意，只要 endpoint 正在運行，您將會被收取費用。

**⚠️ 注意：啟用 \`CLEANUP\_RESOURCES\` 標誌會刪除 Vector Search Index、Index Endpoint 和 Cloud Storage bucket。請謹慎使用。**

```
CLEANUP_RESOURCES = False
```

- 停用 index 並刪除 index endpoint

```
if CLEANUP_RESOURCES:
    print(
        f"Undeploying all indexes and deleting the index endpoint {vs_endpoint.display_name}"
    )
    vs_endpoint.undeploy_all()
    vs_endpoint.delete()
```

- 刪除 index

```
if CLEANUP_RESOURCES:
    print(f"Deleting the index {vs_index.display_name}")
    vs_index.delete()
```

- 刪除 Cloud Storage bucket 中的內容

```
if CLEANUP_RESOURCES and "GCS_BUCKET_NAME" in globals():
    print(f"Deleting contents from the Cloud Storage bucket {GCS_BUCKET_NAME}")


    shell_output = ! gsutil du -ash gs://$GCS_BUCKET_NAME
    print(shell_output)
    print(
        f"Size of the bucket {GCS_BUCKET_NAME} before deleting = {' '.join(shell_output[0].split()[:2])}"
    )


    # uncomment below line to delete contents of the bucket
    # ! gsutil -m rm -r gs://$GCS_BUCKET_NAME
```
