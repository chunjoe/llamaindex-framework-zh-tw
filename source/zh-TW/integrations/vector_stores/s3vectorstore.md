---
title: "S3VectorStore 整合"
---

這是用於 LlamaIndex 的向量資料庫整合，它使用 S3Vectors。

[瞭解更多關於 S3Vectors](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-getting-started.html)。

本筆筆記假設您已經建立了一個 S3 vector bucket（可能也包含一個 index）。

## 安裝

```
%pip install llama-index-vector-stores-s3 llama-index-embeddings-openai
```

## 使用

### 建立 vector store 物件

您可以在現有的 S3 bucket 中建立新的 vector index。

如果您環境中尚未設定 S3 憑證，您可以提供帶有憑證的 boto3 session。

```
from llama_index.vector_stores.s3 import S3VectorStore
import boto3


vector_store = S3VectorStore.create_index_from_bucket(
    # S3 bucket name or ARN
    bucket_name_or_arn="test-bucket",
    # Name for the new index
    index_name="my-index",
    # Vector dimension (e.g., 1536 for OpenAI embeddings)
    dimension=1536,
    # Distance metric: "cosine", "euclidean", etc.
    distance_metric="cosine",
    # Data type for vectors
    data_type="float32",
    # Batch size for inserting vectors (max 500)
    insert_batch_size=500,
    # Metadata keys that won't be filterable
    non_filterable_metadata_keys=["custom_field"],
    # Optional: provide a boto3 session for custom AWS configuration
    # sync_session=boto3.Session(...)
)
```

或者，您可以使用現有的 S3 bucket 中的現有 vector index。

```
from llama_index.vector_stores.s3 import S3VectorStore
import boto3


vector_store = S3VectorStore(
    # Index name or ARN
    index_name_or_arn="my-index",
    # S3 bucket name or ARN
    bucket_name_or_arn="test-bucket",
    # Data type for vectors (must match index)
    data_type="float32",
    # Distance metric (must match index)
    distance_metric="cosine",
    # Batch size for inserting vectors (max 500)
    insert_batch_size=500,
    # Optional: specify metadata field containing text if you already have a populated index
    # text_field="content",
    # Optional: provide a boto3 session for custom AWS configuration
    # sync_session=boto3.Session(...),
)
```

### 使用帶有 index 的 vector store

一旦您有了 vector store，就可以用它搭配 index：

```
from llama_index.core import (
    VectorStoreIndex,
    StorageContext,
    SimpleDirectoryReader,
    Document,
)
from llama_index.embeddings.openai import OpenAIEmbedding


# Load some data
# documents = SimpleDirectoryReader("data").load_data()


# Or create new documents
documents = [
    Document(text="Hello, world!", metadata={"key": "1"}),
    Document(text="Hello, world! 2", metadata={"key": "2"}),
]


# Create a new index
index = VectorStoreIndex.from_documents(
    documents,
    storage_context=StorageContext.from_defaults(vector_store=vector_store),
    # optional: set the embed model
    embed_model=OpenAIEmbedding(model="text-embedding-3-small", api_key="..."),
)


# Or reload from an existing index
# index = VectorStoreIndex.from_vector_store(
#     vector_store=vector_store,
#     # optional: set the embed model
#     # embed_model=embed_model,
# )
```

```
nodes = index.as_retriever(similarity_top_k=1).retrieve("Hello, world!")
print(nodes[0].text)
```

```
Hello, world!
```

您也可以使用 filters 來幫助您檢索正確的 nodes！

```
from llama_index.core.vector_stores.types import (
    MetadataFilters,
    MetadataFilter,
    FilterOperator,
    FilterCondition,
)


nodes = index.as_retriever(
    similarity_top_k=2,
    filters=MetadataFilters(
        filters=[
            MetadataFilter(
                key="key",
                value="2",
                operator=FilterOperator.EQ,
            ),
        ],
        condition=FilterCondition.AND,
    ),
).retrieve("Hello, world!")


print(nodes[0].text)
```

```
Hello, world! 2
```

### 直接使用 vector store

您也可以直接使用 vector store：

```
from llama_index.core.schema import TextNode
from llama_index.core.vector_stores.types import VectorStoreQuery
from llama_index.embeddings.openai import OpenAIEmbedding


# embed nodes
nodes = [
    TextNode(text="Hello, world!"),
    TextNode(text="Hello, world! 2"),
]


embed_model = OpenAIEmbedding(model="text-embedding-3-small", api_key="...")
embeddings = embed_model.get_text_embedding_batch([n.text for n in nodes])
for node, embedding in zip(nodes, embeddings):
    node.embedding = embedding


# add nodes to the vector store
vector_store.add(nodes)


# query the vector store
query = VectorStoreQuery(
    query_embedding=embed_model.get_query_embedding("Hello, world!"),
    similarity_top_k=2,
)
results = vector_store.query(query)
print(results.nodes[0].text)
```

```
Hello, world!
```
