---
title: "Qdrant 向量儲存"
---

#### 建立 Qdrant 用戶端

```
%pip install llama-index-vector-stores-qdrant llama-index-readers-file llama-index-embeddings-fastembed llama-index-llms-openai
```

```
import logging
import sys
import os


import qdrant_client
from IPython.display import Markdown, display
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core import StorageContext
from llama_index.vector_stores.qdrant import QdrantVectorStore
from llama_index.embeddings.fastembed import FastEmbedEmbedding
from llama_index.core import Settings


Settings.embed_model = FastEmbedEmbedding(model_name="BAAI/bge-base-en-v1.5")
```

如果是第一次執行，請使用以下指令安裝 dependencies：

```
!pip install -U qdrant_client fastembed
```

設定您的 OpenAI 金鑰以驗證 LLM

請將 OpenAI API 金鑰設定至 OPENAI\_API\_KEY 環境變數 -

1. 使用終端機

```
export OPENAI_API_KEY=your_api_key_here
```

2. 在 Jupyter Notebook 中使用 IPython Magic Command 

```
%env OPENAI_API_KEY=<YOUR_OPENAI_API_KEY>
```

3. 使用 Python 腳本

```
import os


os.environ["OPENAI_API_KEY"] = "your_api_key_here"
```

注意：通常建議將 API keys 等敏感資訊設定為環境變數，而非將其直接寫死在指令碼中。

```
logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))
```

下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

#### Load the documents

```
# load documents
documents = SimpleDirectoryReader("./data/paul_graham/").load_data()
```

#### 建立 VectorStoreIndex

```
client = qdrant_client.QdrantClient(
    # you can use :memory: mode for fast and light-weight experiments,
    # it does not require to have Qdrant deployed anywhere
    # but requires qdrant-client >= 1.1.1
    # location=":memory:"
    # otherwise set Qdrant instance address with:
    # url="http://<host>:<port>"
    # otherwise set Qdrant instance with host and port:
    host="localhost",
    port=6333
    # set API KEY for Qdrant Cloud
    # api_key="<qdrant-api-key>",
)
```

```
vector_store = QdrantVectorStore(client=client, collection_name="paul_graham")
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents,
    storage_context=storage_context,
)
```

#### 查詢索引

```
# set Logging to DEBUG for more detailed outputs
query_engine = index.as_query_engine()
response = query_engine.query("What did the author do growing up?")
```

```
display(Markdown(f"<b>{response}</b>"))
```

**作者在進入大學前曾從事寫作與程式設計工作。**

```
# set Logging to DEBUG for more detailed outputs
query_engine = index.as_query_engine()
response = query_engine.query(
    "What did the author do after his time at Viaweb?"
)
```

```
display(Markdown(f"<b>{response}</b>"))
```

**作者在 Viaweb 之後，安排為一個為客戶執行專案的團體從事接案工作。**

#### 非同步建置 VectorStoreIndex

```
# To connect to the same event-loop,
# allows async events to run on notebook


import nest_asyncio


nest_asyncio.apply()
```

```
aclient = qdrant_client.AsyncQdrantClient(
    # you can use :memory: mode for fast and light-weight experiments,
    # it does not require to have Qdrant deployed anywhere
    # but requires qdrant-client >= 1.1.1
    location=":memory:"
    # otherwise set Qdrant instance address with:
    # uri="http://<host>:<port>"
    # set API KEY for Qdrant Cloud
    # api_key="<qdrant-api-key>",
)
```

```
vector_store = QdrantVectorStore(
    collection_name="paul_graham",
    client=client,
    aclient=aclient,
    prefer_grpc=True,
)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents,
    storage_context=storage_context,
    use_async=True,
)
```

#### Async Query Index

```
query_engine = index.as_query_engine(use_async=True)
response = await query_engine.aquery("What did the author do growing up?")
```

```
display(Markdown(f"<b>{response}</b>"))
```

**作者致力於撰寫短篇小說與程式設計，特別是在一個 IBM 九年級時使用早期版本的 1401 電腦 Fortran. Later，作者轉而開始研究微電腦，首先從一個 TRS-80 在 1980 年左右，他們在那裡編寫簡單的遊戲、程式和文字處理器。**

```
# set Logging to DEBUG for more detailed outputs
query_engine = index.as_query_engine(use_async=True)
response = await query_engine.aquery(
    "What did the author do after his time at Viaweb?"
)
```

```
display(Markdown(f"<b>{response}</b>"))
```

**作者隨後共同創立了 Y Combinator 在他於 Viaweb.**

## Hybrid Search

您可以在建立 qdrant 索引時啟用 hybrid search。Here，我們使用 Qdrant 的 BM25 功能來快速建立 sparse 和 dense 索引以進行 hybrid retrieval。

```
from qdrant_client import QdrantClient, AsyncQdrantClient
from llama_index.core import VectorStoreIndex
from llama_index.core import StorageContext
from llama_index.vector_stores.qdrant import QdrantVectorStore


client = QdrantClient(host="localhost", port=6333)
aclient = AsyncQdrantClient(host="localhost", port=6333)


vector_store = QdrantVectorStore(
    client=client,
    aclient=aclient,
    collection_name="paul_graham_hybrid",
    enable_hybrid=True,
    fastembed_sparse_model="Qdrant/bm25",
)


index = VectorStoreIndex.from_documents(
    documents,
    storage_context=StorageContext.from_defaults(vector_store=vector_store),
)


# retrieve 2 sparse, 2 dense, and filter down to 3 total hybrid results
query_engine = index.as_query_engine(
    vector_store_query_mode="hybrid",
    sparse_top_k=2,
    similarity_top_k=2,
    hybrid_top_k=3,
)


response = query_engine.query("What did the author do growing up?")
display(Markdown(f"<b>{response}</b>"))
```

## Saving 與 Loading

若要還原索引，在大多數情況下，您只需使用 vector store 物件本身即可進行還原。索引會由 Qdrant.
 自動儲存。
```
loaded_index = VectorStoreIndex.from_vector_store(
    vector_store,
    # Embedding model should match the original embedding model
    # embed_model=Settings.embed_model
)
```
