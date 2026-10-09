---
title: "Pinecone 向量儲存"
---

如果您在 colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index llama-index-vector-stores-pinecone
```

```
import logging
import sys
import os


logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))
```

#### 建立 Pinecone Index

```
from pinecone import Pinecone, ServerlessSpec
```

```
os.environ["PINECONE_API_KEY"] = "..."
os.environ["OPENAI_API_KEY"] = "sk-proj-..."


api_key = os.environ["PINECONE_API_KEY"]


pc = Pinecone(api_key=api_key)
```

```
# delete if needed
# pc.delete_index("quickstart")
```

```
# dimensions are for text-embedding-ada-002


pc.create_index(
    name="quickstart",
    dimension=1536,
    metric="euclidean",
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

#### 載入 documents，建立 PineconeVectorStore 和 VectorStoreIndex

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.vector_stores.pinecone import PineconeVectorStore
from IPython.display import Markdown, display
```

下載 Data

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

```
# load documents
documents = SimpleDirectoryReader("./data/paul_graham").load_data()
```

```
# initialize without metadata filter
from llama_index.core import StorageContext


if "OPENAI_API_KEY" not in os.environ:
    raise EnvironmentError(f"Environment variable OPENAI_API_KEY is not set")


vector_store = PineconeVectorStore(pinecone_index=pinecone_index)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

#### 查詢索引

Index 可能需要一分鐘左右才能準備好！

```
# set Logging to DEBUG for more detailed outputs
query_engine = index.as_query_engine()
response = query_engine.query("What did the author do growing up?")
```

```
INFO:httpx:HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
INFO:httpx:HTTP Request: POST https://api.openai.com/v1/chat/completions "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/chat/completions "HTTP/1.1 200 OK"
```

```
display(Markdown(f"<b>{response}</b>"))
```

**作者在成長過程中，從事寫作和程式設計。他們寫短篇故事，並嘗試在 IBM 1401 電腦上編寫程式。後來他們獲得了一台微型電腦，開始更廣泛地編程，寫簡單的遊戲和文字處理器。**

## Filtering

您也可以直接使用 filters 獲取 nodes 的列表。

```
from llama_index.core.vector_stores.types import (
    MetadataFilter,
    MetadataFilters,
    FilterOperator,
    FilterCondition,
)


filter = MetadataFilters(
    filters=[
        MetadataFilter(
            key="file_path",
            value="/Users/loganmarkewich/giant_change/llama_index/docs/examples/vector_stores/data/paul_graham/paul_graham_essay.txt",
            operator=FilterOperator.EQ,
        )
    ],
    condition=FilterCondition.AND,
)
```

您可以使用 filters 直接獲取 nodes。以下將返回所有符合該 filter 的 nodes。

```
nodes = vector_store.get_nodes(filters=filter, limit=100)
print(len(nodes))
```

```
22
```

您也可以使用 top-k 和 filters 進行獲取。

```
query_engine = index.as_query_engine(similarity_top_k=2, filters=filter)
response = query_engine.query("What did the author do growing up?")
print(len(response.source_nodes))
```

```
INFO:httpx:HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
INFO:httpx:HTTP Request: POST https://api.openai.com/v1/chat/completions "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/chat/completions "HTTP/1.1 200 OK"
2
```
