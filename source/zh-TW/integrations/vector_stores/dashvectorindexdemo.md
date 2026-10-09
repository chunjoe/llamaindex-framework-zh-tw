---
title: "DashVector Vector Store"
---

如果您在 colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-vector-stores-dashvector
```

```
!pip install llama-index
```

```
import logging
import sys
import os


logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))
```

#### 建立 DashVector Collection

```
import dashvector
```

```
api_key = os.environ["DASHVECTOR_API_KEY"]
client = dashvector.Client(api_key=api_key)
```

```
# dimensions are for text-embedding-ada-002
client.create("llama-demo", dimension=1536)
```

```
{"code": 0, "message": "", "requests_id": "82b969d2-2568-4e18-b0dc-aa159b503c84"}
```

```
dashvector_collection = client.get("quickstart")
```

#### 下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

#### 載入 documents，建立 DashVectorStore 和 VectorStoreIndex

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.vector_stores.dashvector import DashVectorStore
from IPython.display import Markdown, display
```

```
INFO:numexpr.utils:Note: NumExpr detected 12 cores but "NUMEXPR_MAX_THREADS" not set, so enforcing safe limit of 8.
Note: NumExpr detected 12 cores but "NUMEXPR_MAX_THREADS" not set, so enforcing safe limit of 8.
INFO:numexpr.utils:NumExpr defaulting to 8 threads.
NumExpr defaulting to 8 threads.
```

```
# load documents
documents = SimpleDirectoryReader("./data/paul_graham").load_data()
```

```
# initialize without metadata filter
from llama_index.core import StorageContext


vector_store = DashVectorStore(dashvector_collection)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

#### 查詢 Index

```
# set Logging to DEBUG for more detailed outputs
query_engine = index.as_query_engine()
response = query_engine.query("What did the author do growing up?")
```

```
display(Markdown(f"<b>{response}</b>"))
```

**作者在校外進行寫作和編程。他們寫短篇故事，並嘗試在 IBM 1401 電腦上編寫程式。他們也建置了一台微型電腦並開始在上面編程，寫了簡單的遊戲和文字處理器。**