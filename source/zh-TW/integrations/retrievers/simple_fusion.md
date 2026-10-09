---
title: "簡單融合 Retriever"
---

在這個範例中，我們將介紹如何組合來自多個查詢和多個索引的檢索結果。

檢索到的 nodes 將作為所有查詢和索引的 top-k 返回，同時處理任何 nodes 的去重。

```
import os
import openai


os.environ["OPENAI_API_KEY"] = "sk-..."
openai.api_key = os.environ["OPENAI_API_KEY"]
```

## 設定

對於此 notebook，我們將使用兩個非常相似的文檔頁面，每個都儲存在一個獨立的 index 中。

```
from llama_index.core import SimpleDirectoryReader


documents_1 = SimpleDirectoryReader(
    input_files=["../../community/integrations/vector_stores.md"]
).load_data()
documents_2 = SimpleDirectoryReader(
    input_files=["../../module_guides/storing/vector_stores.md"]
).load_data()
```

```
from llama_index.core import VectorStoreIndex


index_1 = VectorStoreIndex.from_documents(documents_1)
index_2 = VectorStoreIndex.from_documents(documents_2)
```

## 融合索引！

在這一步驟中，我們將我們的索引融合到一個單一的 retriever 中。這個 retriever 還會透過生成與原始問題相關的額外查詢來增強我們的查詢，並彙總結果。

此設定將執行 4 次查詢，一次使用您的原始查詢，並生成 3 個額外的查詢。

預設情況下，它使用以下提示來生成額外查詢：

```
QUERY_GEN_PROMPT = (
    "You are a helpful assistant that generates multiple search queries based on a "
    "single input query. Generate {num_queries} search queries, one on each line, "
    "related to the following input query:\n"
    "Query: {query}\n"
    "Queries:\n"
)
```

```
from llama_index.core.retrievers import QueryFusionRetriever


retriever = QueryFusionRetriever(
    [index_1.as_retriever(), index_2.as_retriever()],
    similarity_top_k=2,
    num_queries=4,  # set this to 1 to disable query generation
    use_async=True,
    verbose=True,
    # query_gen_prompt="...",  # we could override the query generation prompt here
)
```

```
# apply nested async to run in a notebook
import nest_asyncio


nest_asyncio.apply()
```

```
nodes_with_scores = retriever.retrieve("How do I setup a chroma vector store?")
```

```
Generated queries:
1. What are the steps to set up a chroma vector store?
2. Best practices for configuring a chroma vector store
3. Troubleshooting common issues when setting up a chroma vector store
```

```
for node in nodes_with_scores:
    print(f"Score: {node.score:.2f} - {node.text[:100]}...")
```

```
Score: 0.78 - # Vector Stores


Vector stores contain embedding vectors of ingested document chunks
(and sometimes ...
Score: 0.78 - # Using Vector Stores


LlamaIndex offers multiple integration points with vector stores / vector dat...
```

## 在查詢引擎中使用！

現在，我們可以將我們的 retriever 插入查詢引擎中，以合成自然語言回應。

```
from llama_index.core.query_engine import RetrieverQueryEngine


query_engine = RetrieverQueryEngine.from_args(retriever)
```

```
response = query_engine.query(
    "How do I setup a chroma vector store? Can you give an example?"
)
```

```
Generated queries:
1. How to set up a chroma vector store?
2. Step-by-step guide for creating a chroma vector store.
3. Examples of chroma vector store setups and configurations.
```

```
from llama_index.core.response.notebook_utils import display_response


display_response(response)
```

**`Final Response:`** 要設定一個 Chroma vector store，您需要遵循以下步驟：

1. 匯入必要的函式庫：

```
import chromadb
from llama_index.vector_stores.chroma import ChromaVectorStore
```

2. 建立一個 Chroma client：

```
chroma_client = chromadb.EphemeralClient()
chroma_collection = chroma_client.create_collection("quickstart")
```

3. 建構 vector store：

```
vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
```

以下是如何使用上述步驟設定一個 Chroma vector store 的範例：

```
import chromadb
from llama_index.vector_stores.chroma import ChromaVectorStore


# Creating a Chroma client
# EphemeralClient operates purely in-memory, PersistentClient will also save to disk
chroma_client = chromadb.EphemeralClient()
chroma_collection = chroma_client.create_collection("quickstart")


# construct vector store
vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
```

此範例展示了如何建立一個 Chroma client，建立一個名為 “quickstart” 的 collection，然後使用該 collection 建構一個 Chroma vector store。