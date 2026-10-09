---
title: "使用 VectorStoreIndex"
---

向量儲存庫是檢索增強生成（RAG）的重要元件，因此在使用 LlamaIndex 建構的幾乎所有應用程式中，您都會直接或間接用到它。

向量儲存庫會接收 [`Node` 物件](/python/framework/module_guides/loading/documents_and_nodes/)清單，並據此建立索引。

## 載入資料至索引

### 基本用法

使用向量儲存庫最簡單的方式，是載入一批文件，再透過 `from_documents` 為這些文件建立索引：

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader


# Load documents and build index
documents = SimpleDirectoryReader(
    "../../examples/data/paul_graham"
).load_data()
index = VectorStoreIndex.from_documents(documents)
```

提示

若您在命令列中使用 `from_documents`，可以傳入 `show_progress=True`，在建立索引時顯示進度列。

使用 `from_documents` 時，系統會將您的 Documents 切分成區塊，再解析為 [`Node` 物件](/python/framework/module_guides/loading/documents_and_nodes/)。Node 是文字字串的輕量抽象，會保留中繼資料與關聯資訊。

若想進一步了解如何載入文件，請參閱[了解資料載入](/python/framework/module_guides/loading/)。

VectorStoreIndex 預設會將所有資料儲存在記憶體中。若要了解如何使用持久化的向量儲存庫，請參閱下方的[使用向量儲存庫](/python/framework/module_guides/indexing/vector_store_index/)。

提示

`VectorStoreIndex` 預設會以每批 2048 個節點的方式產生並寫入向量。若記憶體不足（或有餘裕），可傳入 `insert_batch_size=2048`（或改為您需要的批次大小）進行調整。

將資料寫入遠端代管的向量資料庫時，這項設定特別實用。

### 使用資料匯入管線建立節點

若要更精確地控制文件的索引方式，建議使用資料匯入管線。您可以藉此自訂節點的切分方式、中繼資料和嵌入向量。

```
from llama_index.core import Document
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.extractors import TitleExtractor
from llama_index.core.ingestion import IngestionPipeline, IngestionCache


# create the pipeline with transformations
pipeline = IngestionPipeline(
    transformations=[
        SentenceSplitter(chunk_size=25, chunk_overlap=0),
        TitleExtractor(),
        OpenAIEmbedding(),
    ]
)


# run the pipeline
nodes = pipeline.run(documents=[Document.example()])
```

提示

您可以在[資料匯入管線使用指南](/python/framework/module_guides/loading/ingestion_pipeline/)中了解更多資訊。

### 直接建立與管理節點

若要完全掌控索引，可[手動建立並定義節點](/python/framework/module_guides/loading/documents_and_nodes/usage_nodes/)，再直接傳給索引建構子：

```
from llama_index.core.schema import TextNode


node1 = TextNode(text="<text_chunk>", id_="<node_id>")
node2 = TextNode(text="<text_chunk>", id_="<node_id>")
nodes = [node1, node2]
index = VectorStoreIndex(nodes)
```

#### 處理 Document 更新

直接管理索引時，您需要處理會隨時間變動的資料來源。`Index` 類別提供**新增**、**刪除**、**更新**和**重新整理**操作，詳情請參閱：

- [中繼資料擷取](/python/framework/module_guides/indexing/metadata_extraction/)
- [文件管理](/python/framework/module_guides/indexing/document_management/)

## 儲存向量索引

LlamaIndex 支援[數十種向量儲存庫](/python/framework/module_guides/storing/vector_stores/)。傳入 `StorageContext` 即可指定要使用的向量儲存庫，並在其中設定 `vector_store` 引數。以下範例使用 Pinecone：

```
import pinecone
from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
)
from llama_index.vector_stores.pinecone import PineconeVectorStore


# init pinecone
pinecone.init(api_key="<api_key>", environment="<environment>")
pinecone.create_index(
    "quickstart", dimension=1536, metric="euclidean", pod_type="p1"
)


# construct vector store and customize storage context
storage_context = StorageContext.from_defaults(
    vector_store=PineconeVectorStore(pinecone.Index("quickstart"))
)


# Load documents and build index
documents = SimpleDirectoryReader(
    "../../examples/data/paul_graham"
).load_data()
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

更多 VectorStoreIndex 使用範例，請參閱[向量儲存庫索引範例筆記本](/python/framework/module_guides/indexing/vector_store_index/)。

若要查看 VectorStoreIndex 搭配特定向量儲存庫的使用範例，請前往「儲存」章節中的[向量儲存庫](/python/framework/module_guides/storing/vector_stores/)。

## 可組合式檢索

`VectorStoreIndex`（以及其他索引／檢索器）也能檢索一般物件，包括：

- 節點參照
- 查詢引擎
- 檢索器
- 查詢管線

檢索到這些物件時，系統會自動使用提供的查詢執行它們。

例如：

```
from llama_index.core.schema import IndexNode


query_engine = other_index.as_query_engine
obj = IndexNode(
    text="A query engine describing X, Y, and Z.",
    obj=query_engine,
    index_id="my_query_engine",
)


index = VectorStoreIndex(nodes=nodes, objects=[obj])
retriever = index.as_retriever(verbose=True)
```

若檢索到包含查詢引擎的索引節點，系統就會執行該查詢引擎，並將產生的回應以節點形式回傳。

詳細資訊請參閱[指南](https://developers.llamaindex.ai/python/examples/retrievers/composable_retrievers/index.md)。
