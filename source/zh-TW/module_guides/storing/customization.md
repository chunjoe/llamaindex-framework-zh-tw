---
title: "自訂儲存"
---

預設情況下，LlamaIndex 隱藏了複雜性，讓您只需少於 5 行程式碼即可查詢資料：

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader


documents = SimpleDirectoryReader("data").load_data()
index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine()
response = query_engine.query("Summarize the documents.")
```

在底層，LlamaIndex 也支援可切換的 **storage layer**，讓您可以自訂 ingested documents（即 `Node` 物件）、embedding vectors 和 index metadata 的儲存位置。

![](/assets/e8fa86b4b6e7.png)

### 底層 API

為此，與高階的 API 不同，

```
index = VectorStoreIndex.from_documents(documents)
```

我們使用更底層的 API，它提供了更細緻的控制權：

```
from llama_index.core.storage.docstore import SimpleDocumentStore
from llama_index.core.storage.index_store import SimpleIndexStore
from llama_index.core.vector_stores import SimpleVectorStore
from llama_index.core.node_parser import SentenceSplitter


# create parser and parse document into nodes
parser = SentenceSplitter()
nodes = parser.get_nodes_from_documents(documents)


# create storage context using default stores
storage_context = StorageContext.from_defaults(
    docstore=SimpleDocumentStore(),
    vector_store=SimpleVectorStore(),
    index_store=SimpleIndexStore(),
)


# create (or load) docstore and add nodes
storage_context.docstore.add_documents(nodes)


# build index
index = VectorStoreIndex(nodes, storage_context=storage_context)


# save index
index.storage_context.persist(persist_dir="<persist_dir>")


# can also set index_id to save multiple indexes to the same folder
index.set_index_id("<index_id>")
index.storage_context.persist(persist_dir="<persist_dir>")


# to load index later, make sure you setup the storage context
# this will loaded the persisted stores from persist_dir
storage_context = StorageContext.from_defaults(persist_dir="<persist_dir>")


# then load the index object
from llama_index.core import load_index_from_storage


loaded_index = load_index_from_storage(storage_context)


# if loading an index from a persist_dir containing multiple indexes
loaded_index = load_index_from_storage(storage_context, index_id="<index_id>")


# if loading multiple indexes from a persist dir
loaded_indicies = load_index_from_storage(
    storage_context, index_ids=["<index_id>", ...]
)
```

您只需一行更改即可自訂底層儲存，以實例化不同的 document stores、index stores 和 vector stores。請參閱 [Document Stores](/python/framework/module_guides/storing/docstores/)、[Vector Stores](/python/framework/module_guides/storing/vector_stores/)、[索引儲存區](/python/framework/module_guides/storing/index_stores/) 指南以了解更多詳情。

### Vector Store 整合與儲存

我們大多數的 vector store 整合會將整個 index（vectors + text）儲存在 vector store 本身。這帶來了主要的優勢，即無需明確地將 index 持久化如上所示，因為 vector store 已經託管並將資料儲存在我們的 index 中。

支援此做法的 vector stores 如下：

- AzureAISearchVectorStore
- ChatGPTRetrievalPluginClient
- CassandraVectorStore
- ChromaVectorStore
- EpsillaVectorStore
- DocArrayHnswVectorStore
- DocArrayInMemoryVectorStore
- JaguarVectorStore
- LanceDBVectorStore
- MetalVectorStore
- MilvusVectorStore
- MyScaleVectorStore
- OpensearchVectorStore
- PineconeVectorStore
- QdrantVectorStore
- TablestoreVectorStore
- RedisVectorStore
- UpstashVectorStore
- WeaviateVectorStore

以下是一個使用 Pinecone 的小範例：

```
import pinecone
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
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


# create storage context
storage_context = StorageContext.from_defaults(vector_store=vector_store)


# load documents
documents = SimpleDirectoryReader("./data").load_data()


# create index, which will insert documents/vectors to pinecone
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

如果您有一個已載入資料的現有 vector store，您可以連接到它並直接像這樣建立一個 `VectorStoreIndex`：

```
index = pinecone.Index("quickstart")
vector_store = PineconeVectorStore(pinecone_index=index)
loaded_index = VectorStoreIndex.from_vector_store(vector_store=vector_store)
```
