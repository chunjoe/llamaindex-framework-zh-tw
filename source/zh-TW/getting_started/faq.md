---
title: "常見問題 (FAQ)"
---

提示

如果您尚未安裝，請安裝 [LlamaIndex](/python/framework/getting_started/installation/) 並完成 [入門教學](/python/framework/getting_started/starter_example/)。如果您遇到不認識的術語，請查看 [高層次概念](/python/framework/getting_started/concepts/)。

在本節中，我們從您為 [starter example](/python/framework/getting_started/starter_example/) 編寫的程式碼開始，並向您展示了您可以為您的使用情境自訂它的最常見方法：

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader


documents = SimpleDirectoryReader("data").load_data()
index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine()
response = query_engine.query("What did the author do growing up?")
print(response)
```

---

## **「我想將我的 documents 解析成更小的區塊」**

```
# Global settings
from llama_index.core import Settings


Settings.chunk_size = 512


# Local settings
from llama_index.core.node_parser import SentenceSplitter


index = VectorStoreIndex.from_documents(
    documents, transformations=[SentenceSplitter(chunk_size=512)]
)
```

---

## **「我想使用不同的 vector store」**

首先，您可以安裝您想使用的 vector store。例如，若要使用 Chroma 作為 vector store，您可以使用 pip 安裝它：

終端機視窗

```
pip install llama-index-vector-stores-chroma
```

要了解所有可用的整合，請查看 [整合頁面](/python/framework/community/integrations/)。

然後，您可以在程式碼中使用它：

```
import chromadb
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.core import StorageContext


chroma_client = chromadb.PersistentClient()
chroma_collection = chroma_client.create_collection("quickstart")
vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
```

`StorageContext` 定義了 documents、embeddings 和 indexes 的儲存後端。您可以了解更多關於 [storage](/python/framework/module_guides/storing/) 和 [如何自訂它](/python/framework/module_guides/storing/customization/)。

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader


documents = SimpleDirectoryReader("data").load_data()
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
query_engine = index.as_query_engine()
response = query_engine.query("What did the author do growing up?")
print(response)
```

---

## **「我想在查詢時檢索更多上下文」**

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader


documents = SimpleDirectoryReader("data").load_data()
index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine(similarity_top_k=5)
response = query_engine.query("What did the author do growing up?")
print(response)
```

`as_query_engine` 在 index 上建立預設的 `retriever` 和 `query engine`。您可以透過傳入 keyword arguments 來設定 retriever 和 query engine。在這裡，我們設定 retriever 返回最相似的 top 5 個 documents（而不是預設的 2 個）。您可以了解更多關於 [retrievers](/python/framework/module_guides/querying/retriever/retrievers/) 和 [query engines](/python/framework/module_guides/querying/retriever/)。

---

## **「我想使用不同的 LLM」**

```
# Global settings
from llama_index.core import Settings
from llama_index.llms.ollama import Ollama


Settings.llm = Ollama(
    model="mistral",
    request_timeout=60.0,
    # Manually set the context window to limit memory usage
    context_window=8000,
)


# Local settings
index.as_query_engine(
    llm=Ollama(
        model="mistral",
        request_timeout=60.0,
        # Manually set the context window to limit memory usage
        context_window=8000,
    )
)
```

您可以了解更多關於 [customizing LLMs](/python/framework/module_guides/models/llms/)。

---

## **「我想使用不同的 response mode」**

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader


documents = SimpleDirectoryReader("data").load_data()
index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine(response_mode="tree_summarize")
response = query_engine.query("What did the author do growing up?")
print(response)
```

您可以了解更多關於 [query engines](/python/framework/module_guides/querying/) 和 [response modes](/python/framework/module_guides/deploying/query_engine/response_modes/)。

---

## **「我想串流回傳回應」**

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader


documents = SimpleDirectoryReader("data").load_data()
index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine(streaming=True)
response = query_engine.query("What did the author do growing up?")
response.print_response_stream()
```

您可以了解更多關於 [streaming responses](/python/framework/module_guides/deploying/query_engine/streaming/)。

---

## **「我想使用 chatbot 而不是 Q\&A」**

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader


documents = SimpleDirectoryReader("data").load_data()
index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_chat_engine()
response = query_engine.chat("What did the author do growing up?")
print(response)


response = query_engine.chat("Oh interesting, tell me more.")
print(response)
```

了解更多關於 [chat engine](/python/framework/module_guides/deploying/chat_engines/usage_pattern/)。

---

## 後續步驟

- 想對您可以設定的（幾乎）所有內容進行全面了解？從 [Understanding LlamaIndex](/python/framework/understanding/) 開始。
- 想對特定模組有更深入的了解？查看 [component guides](/python/framework/module_guides/)。