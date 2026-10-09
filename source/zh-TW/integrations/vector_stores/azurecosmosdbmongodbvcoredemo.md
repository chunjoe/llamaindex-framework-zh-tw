---
title: "Azure CosmosDB MongoDB Vector Store"
---

在本筆 Notebook 中，我們將展示如何使用 Azure Cosmosdb Mongodb vCore 來在 LlamaIndex 中執行向量搜尋。我們將使用 Azure Open AI 來建立 embedding。

如果您在 Colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-embeddings-openai
%pip install llama-index-vector-stores-azurecosmosmongo
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
```

### 設定 Azure OpenAI

第一步是設定模型。它們將用於為載入到 db 中的 documents 建立 embedding，以及用於 llm completions。

```
import os


# Set up the AzureOpenAI instance
llm = AzureOpenAI(
    model_name=os.getenv("OPENAI_MODEL_COMPLETION"),
    deployment_name=os.getenv("OPENAI_MODEL_COMPLETION"),
    api_base=os.getenv("OPENAI_API_BASE"),
    api_key=os.getenv("OPENAI_API_KEY"),
    api_type=os.getenv("OPENAI_API_TYPE"),
    api_version=os.getenv("OPENAI_API_VERSION"),
    temperature=0,
)


# Set up the OpenAIEmbedding instance
embed_model = OpenAIEmbedding(
    model=os.getenv("OPENAI_MODEL_EMBEDDING"),
    deployment_name=os.getenv("OPENAI_DEPLOYMENT_EMBEDDING"),
    api_base=os.getenv("OPENAI_API_BASE"),
    api_key=os.getenv("OPENAI_API_KEY"),
    api_type=os.getenv("OPENAI_API_TYPE"),
    api_version=os.getenv("OPENAI_API_VERSION"),
)
```

```
from llama_index.core import Settings


Settings.llm = llm
Settings.embed_model = embed_model
```

下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

### 載入 documents

使用 SimpleDirectoryReader 將儲存在 `data/paul_graham/` 中的 documents 載入。

```
documents = SimpleDirectoryReader("./data/paul_graham/").load_data()


print("Document ID:", documents[0].doc_id)
```

```
Document ID: c432ff1c-61ea-4c91-bd89-62be29078e79
```

### 建立 index

在這裡，我們建立與 Azure Cosmosdb mongodb vCore cluster 的連線，並建立一個 vector search index。

```
import pymongo
from llama_index.vector_stores.azurecosmosmongo import (
    AzureCosmosDBMongoDBVectorSearch,
)
from llama_index.core import VectorStoreIndex
from llama_index.core import StorageContext
from llama_index.core import SimpleDirectoryReader


connection_string = os.environ.get("AZURE_COSMOSDB_MONGODB_URI")
mongodb_client = pymongo.MongoClient(connection_string)
store = AzureCosmosDBMongoDBVectorSearch(
    mongodb_client=mongodb_client,
    db_name="demo_vectordb",
    collection_name="paul_graham_essay",
)
storage_context = StorageContext.from_defaults(vector_store=store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

### 查詢 index

我們現在可以使用我們的 index 來提問。

```
query_engine = index.as_query_engine()
response = query_engine.query("What did the author love working on?")
```

```
import textwrap


print(textwrap.fill(str(response), 100))
```

```
The author loved working on multiple projects that were not their thesis while in grad school,
including Lisp hacking and writing On Lisp. They eventually wrote a dissertation on applications of
continuations in just 5 weeks to graduate. Afterward, they applied to art schools and were accepted
into the BFA program at RISD.
```

```
response = query_engine.query("What did he/she do in summer of 2016?")
```

```
print(textwrap.fill(str(response), 100))
```

```
The person moved to England with their family in the summer of 2016.
```
