---
title: "Pinecone 向量資料庫 - 混合搜尋"
---

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-vector-stores-pinecone "transformers[torch]"
```

#### 建立 Pinecone Index

```
from pinecone import Pinecone, ServerlessSpec
```

```
import os


os.environ["PINECONE_API_KEY"] = "..."
os.environ["OPENAI_API_KEY"] = "sk-..."


api_key = os.environ["PINECONE_API_KEY"]


pc = Pinecone(api_key=api_key)
```

```
# delete if needed
pc.delete_index("quickstart")
```

```
# dimensions are for text-embedding-ada-002
# NOTE: needs dotproduct for hybrid search


pc.create_index(
    name="quickstart",
    dimension=1536,
    metric="dotproduct",
    spec=ServerlessSpec(cloud="aws", region="us-east-1"),
)


# If you need to create a PodBased Pinecone index, you could alternatively do this:
#
# from pinecone import Pinecone, PodSpec
#
# pc = Pinecone(api_key='xxx')
#
# pc.create_index(
#    name='my-index',
#    dimension=1536,
#    metric='cosine',
#    spec=PodSpec(
#      environment='us-east1-gcp',
#      pod_type='p1.x1',
#      pods=1
#    )
# )
#
```

```
pinecone_index = pc.Index("quickstart")
```

下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

#### 載入 documents，建立 PineconeVectorStore

當 `add_sparse_vector=True` 時，`PineconeVectorStore` 將為每個 document 計算稀疏向量 (sparse vectors)。

預設情況下，它使用簡單的 token frequency 來計算稀疏向量。但您也可以指定自訂的 sparse embedding model。

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.vector_stores.pinecone import PineconeVectorStore
from IPython.display import Markdown, display
```

```
# load documents
documents = SimpleDirectoryReader("./data/paul_graham/").load_data()
```

```
# set add_sparse_vector=True to compute sparse vectors during upsert
from llama_index.core import StorageContext


if "OPENAI_API_KEY" not in os.environ:
    raise EnvironmentError(f"Environment variable OPENAI_API_KEY is not set")


vector_store = PineconeVectorStore(
    pinecone_index=pinecone_index,
    add_sparse_vector=True,
)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

```
huggingface/tokenizers: The current process just got forked, after parallelism has already been used. Disabling parallelism to avoid deadlocks...
To disable this warning, you can either:
  - Avoid using `tokenizers` before the fork if possible
  - Explicitly set the environment variable TOKENIZERS_PARALLELISM=(true | false)






Upserted vectors:   0%|          | 0/22 [00:00<?, ?it/s]
```

#### 查詢索引

可能需要等待一兩分鐘讓 index 準備好

```
# set Logging to DEBUG for more detailed outputs
query_engine = index.as_query_engine(vector_store_query_mode="hybrid")
response = query_engine.query("What happened at Viaweb?")
```

```
display(Markdown(f"<b>{response}</b>"))
```

**Paul Graham 因為需要資金而創立了 Viaweb。隨著公司成長，他意識到自己不想經營一家大公司，於是決定將願景的一部分作為 open source project 來建立。最終，Viaweb 在 1998 年夏天被 Yahoo 收購，這讓 Paul Graham 感到非常欣慰。**

## 更改稀疏嵌入模型

```
%pip install llama-index-sparse-embeddings-fastembed
```

```
# Clear the vector store
vector_store.clear()
```

```
from llama_index.sparse_embeddings.fastembed import FastEmbedSparseEmbedding


sparse_embedding_model = FastEmbedSparseEmbedding(
    model_name="prithivida/Splade_PP_en_v1"
)


vector_store = PineconeVectorStore(
    pinecone_index=pinecone_index,
    add_sparse_vector=True,
    sparse_embedding_model=sparse_embedding_model,
)
```

```
Fetching 5 files:   0%|          | 0/5 [00:00<?, ?it/s]
```

```
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

```
Upserted vectors:   0%|          | 0/22 [00:00<?, ?it/s]
```

等待幾分鐘讓檔案上傳...

```
response = query_engine.query("What happened at Viaweb?")
display(Markdown(f"<b>{response}</b>"))
```

**Paul Graham 因為需要資金而創立了 Viaweb。他招募了一支團隊來開發軟體和服務，重點是建立一個 application builder 和網路基礎設施。然而，在夏天中段，Paul 意識到自己不想經營一家大公司，於是決定將重點轉移到將專案的一部分作為 open source project 來建立。這促成了 Lisp 的一種新方言 Arc 的開發。最終，Viaweb 在 1998 年夏天被 Yahoo 收購，讓 Paul Graham 感到欣慰，並讓他得以進入人生的新階段。**