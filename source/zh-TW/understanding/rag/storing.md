---
title: "儲存"
---

一旦您有資料 [loaded](/python/framework/module_guides/loading/) 並 [indexed](/python/framework/module_guides/indexing/)，您可能希望將其儲存，以避免重新索引所花費的時間和成本。預設情況下，您的 indexed data 只儲存在記憶體中。

## 儲存到磁碟

儲存您的 indexed data 最簡單的方法是使用每個 Index 的內建 `.persist()` 方法，該方法會將所有資料寫入指定位置的磁碟。這適用於任何類型的 index。

```
index.storage_context.persist(persist_dir="<persist_dir>")
```

以下是一個 Composable Graph 的範例：

```
graph.root_index.storage_context.persist(persist_dir="<persist_dir>")
```

然後您可以像這樣載入持久化的 index，從而避免重新載入和重新索引您的資料：

```
from llama_index.core import StorageContext, load_index_from_storage


# rebuild storage context
storage_context = StorageContext.from_defaults(persist_dir="<persist_dir>")


# load index
index = load_index_from_storage(storage_context)
```

提示

重要：如果您使用自訂的 `transformations`、`embed_model` 等初始化您的 index，您需要在 `load_index_from_storage` 中傳入相同的選項，或將其設定為 [global settings](/python/framework/module_guides/supporting_modules/settings/)。

## 使用 Vector Stores

如在 [索引](/python/framework/module_guides/indexing/) 中所述，Index 最常見的類型之一是 VectorStoreIndex。API 用於在 VectorStoreIndex 中建立 [embeddings](/python/framework/module_guides/indexing/) 的呼叫，在時間和金錢上可能很昂貴，因此您希望將它們儲存起來，以避免不斷地重新索引。

LlamaIndex 支援 [大量的 vector stores](/python/framework/module_guides/storing/vector_stores/)，它們在架構、複雜度和成本上有所不同。在這個範例中，我們將使用 Chroma，一個 open-source vector store。

首先，您需要安裝 chroma：

```
pip install chromadb
```

要使用 Chroma 來儲存 VectorStoreIndex 的 embeddings，您需要：

- 初始化 Chroma client
- 建立一個 Collection 來在 Chroma 中儲存您的資料
- 將 Chroma 指定為 `vector_store` 在 `StorageContext` 中
- 使用該 StorageContext 初始化您的 VectorStoreIndex

以下是它的樣子，並附帶實際查詢資料的預覽：

```
import chromadb
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.core import StorageContext


# load some documents
documents = SimpleDirectoryReader("./data").load_data()


# initialize client, setting path to save data
db = chromadb.PersistentClient(path="./chroma_db")


# create collection
chroma_collection = db.get_or_create_collection("quickstart")


# assign chroma as the vector_store to the context
vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
storage_context = StorageContext.from_defaults(vector_store=vector_store)


# create your index
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)


# create a query engine and query
query_engine = index.as_query_engine()
response = query_engine.query("What is the meaning of life?")
print(response)
```

如果您已經建立並儲存了您的 embeddings，您希望直接載入它們，而無需載入您的 documents 或建立一個新的 VectorStoreIndex：

```
import chromadb
from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.core import StorageContext


# initialize client
db = chromadb.PersistentClient(path="./chroma_db")


# get collection
chroma_collection = db.get_or_create_collection("quickstart")


# assign chroma as the vector_store to the context
vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
storage_context = StorageContext.from_defaults(vector_store=vector_store)


# load your index from stored vectors
index = VectorStoreIndex.from_vector_store(
    vector_store, storage_context=storage_context
)


# create a query engine
query_engine = index.as_query_engine()
response = query_engine.query("What is llama2?")
print(response)
```

提示

如果您想深入了解這個 store，我們有 [更詳細的 Chroma](https://developers.llamaindex.ai/python/examples/vector_stores/chromaindexdemo/index.md) 使用範例。

### 您已準備好查詢！

現在您已經載入資料、索引了它並儲存了該 index，您已準備好 [查詢您的資料](/python/framework/module_guides/querying/)。

## 插入 Documents 或 Nodes

如果您已經建立了一個 index，可以使用 `insert` 方法將新的 documents 添加到您的 index 中。

```
from llama_index.core import VectorStoreIndex


index = VectorStoreIndex([])
for doc in documents:
    index.insert(doc)
```

請參閱 [document 管理指南](/python/framework/module_guides/indexing/document_management/) 以了解更多關於管理 documents 的詳細資訊和一個範例 notebook。