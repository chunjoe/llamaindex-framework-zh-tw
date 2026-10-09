---
title: "Azure Cosmos DB 不含 SQL Vector Store"
---

在這個 Notebook 中，我們將快速演示如何使用 AzureCosmosDBNoSqlVectorSearch 執行向量搜尋，在 LlamaIndex 中進行。

如果您在 Colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-embeddings-openai
%pip install llama-index-llms-azure-openai
```

```
!pip install llama-index
```

```
import os
import json
import openai
from llama_index.llms.azure_openai import AzureOpenAI
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.embeddings.azure_openai import AzureOpenAIEmbedding
```

# 設定 Azure OpenAI

第一步是設定 llm 和 embeddings model。這些模型將用於為資料庫中載入的 documents 建立 embeddings，以及用於 llm 的 completions。

```
llm = AzureOpenAI(
    model="AZURE_OPENAI_MODEL",
    deployment_name="AZURE_OPENAI_DEPLOYMENT_NAME",
    azure_endpoint="AZURE_OPENAI_BASE",
    api_key="AZURE_OPENAI_KEY",
    api_version="AZURE_OPENAI_VERSION",
)


embed_model = AzureOpenAIEmbedding(
    model="AZURE_OPENAI_EMBEDDING_MODEL",
    deployment_name="AZURE_OPENAI_EMBEDDING_MODEL_DEPLOYMENT_NAME",
    azure_endpoint="AZURE_OPENAI_BASE",
    api_key="AZURE_OPENAI_KEY",
    api_version="AZURE_OPENAI_VERSION",
)
```

```
from llama_index.core import Settings


Settings.llm = llm
Settings.embed_model = embed_model
```

# 載入 Documents

在這個範例中，我們將使用 paul\_graham essay，並由 SimpleDirectoryReader 進行處理。

```
from llama_index.core import SimpleDirectoryReader


documents = SimpleDirectoryReader(
    input_files=[r"\docs\examples\data\paul_graham\paul_graham_essay.txt"]
).load_data()


print("Document ID:", documents[0].doc_id)
```

# 建立 index

在這裡，我們建立與 cosmos db nosql 的連線並建立一個 vector store index。

```
from azure.cosmos import CosmosClient, PartitionKey
from llama_index.vector_stores.azurecosmosnosql import (
    AzureCosmosDBNoSqlVectorSearch,
)
from llama_index.core import StorageContext


# create cosmos client
URI = "AZURE_COSMOSDB_URI"
KEY = "AZURE_COSMOSDB_KEY"
client = CosmosClient(URI, credential=KEY)


# specify vector store properties
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
            "dimensions": 3072,
        }
    ]
}


partition_key = PartitionKey(path="/id")
cosmos_container_properties_test = {"partition_key": partition_key}
cosmos_database_properties_test = {}


# create vector store
store = AzureCosmosDBNoSqlVectorSearch(
    cosmos_client=client,
    vector_embedding_policy=vector_embedding_policy,
    indexing_policy=indexing_policy,
    cosmos_container_properties=cosmos_container_properties_test,
    cosmos_database_properties=cosmos_database_properties_test,
    create_container=True,
)


storage_context = StorageContext.from_defaults(vector_store=store)


index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

# 查詢 index

現在我們可以使用我們的 index 來提問。

```
query_engine = index.as_query_engine()
response = query_engine.query("What did the author love working on?")
```

```
import textwrap


print(textwrap.fill(str(response), 100))
```
