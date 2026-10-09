---
title: "儲存"
---

## 概念

LlamaIndex 提供了一個高階介面，用於攝取、索引和查詢您的外部資料。

在底層，LlamaIndex 也支援可替換的 **storage components**，讓您可以自訂：

- **Document stores**：已攝取的 documents（即 `Node` 物件）儲存的位置，
- **Index stores**：索引元數據儲存的位置，
- **Vector stores**：嵌入向量儲存的位置，
- **Property Graph stores**：知識圖譜儲存的位置（即針對 `PropertyGraphIndex`）。
- **Chat Stores**：聊天訊息的儲存和組織方式。

Document/Index stores 依賴一個共同的 Key-Value store abstraction，詳見下文。

LlamaIndex 支援將資料持久化到 [fsspec](https://filesystem-spec.readthedocs.io/en/latest/index.html) 支援的任何 storage backend。我們確認支援以下 storage backends：

- 本地檔案系統
- AWS S3
- Cloudflare R2

![](/assets/e8fa86b4b6e7.png)

## 使用模式

許多 vector stores（除了 FAISS）會同時儲存資料和索引（embeddings）。這意味著您不需要使用單獨的 document store 或 index store。這也意味著您不需要明確地持久化這些資料——這是自動發生的。使用方式看起來像如下，用於建立新的索引/重新載入現有的索引。

```
## build a new index
from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.vector_stores.deeplake import DeepLakeVectorStore


# construct vector store and customize storage context
vector_store = DeepLakeVectorStore(dataset_path="<dataset_path>")
storage_context = StorageContext.from_defaults(vector_store=vector_store)
# Load documents and build index
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)




## reload an existing one
index = VectorStoreIndex.from_vector_store(vector_store=vector_store)
```

請參閱我們的 [Vector Store Module Guide](/python/framework/module_guides/storing/vector_stores/) 以獲取更多詳細資訊。

請注意，一般要使用 storage abstractions，您需要定義一個 `StorageContext` 物件：

```
from llama_index.core.storage.docstore import SimpleDocumentStore
from llama_index.core.storage.index_store import SimpleIndexStore
from llama_index.core.vector_stores import SimpleVectorStore
from llama_index.core import StorageContext


# create storage context using default stores
storage_context = StorageContext.from_defaults(
    docstore=SimpleDocumentStore(),
    vector_store=SimpleVectorStore(),
    index_store=SimpleIndexStore(),
)
```

關於自訂/持久化的更多詳細資訊請參閱下方的指南。

- [Customization](/python/framework/module_guides/storing/customization/)
- [Save/Load](/python/framework/module_guides/storing/save_load/)

## 模組

我們提供關於不同 storage components 的深入指南。

- [Vector Stores](/python/framework/module_guides/storing/vector_stores/)
- [Docstores](/python/framework/module_guides/storing/docstores/)
- [Index Stores](/python/framework/module_guides/storing/index_stores/)
- [Key-Val Stores](/python/framework/module_guides/storing/kv_stores/)
- [Property Graph Stores](/python/framework/module_guides/indexing/lpg_index_guide/#storage)
- [ChatStores](/python/framework/module_guides/storing/chat_stores/)