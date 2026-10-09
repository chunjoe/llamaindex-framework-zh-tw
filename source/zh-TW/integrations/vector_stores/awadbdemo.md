---
title: "Awadb Vector Store"
---

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-embeddings-huggingface
%pip install llama-index-vector-stores-awadb
```

```
!pip install llama-index
```

## 建立 Awadb index

```
import logging
import sys


logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))
```

#### 載入 documents，建置 VectorStoreIndex

```
from llama_index.core import (
    SimpleDirectoryReader,
    VectorStoreIndex,
    StorageContext,
)
from IPython.display import Markdown, display
import openai


openai.api_key = ""
```

```
INFO:numexpr.utils:Note: NumExpr detected 12 cores but "NUMEXPR_MAX_THREADS" not set, so enforcing safe limit of 8.
Note: NumExpr detected 12 cores but "NUMEXPR_MAX_THREADS" not set, so enforcing safe limit of 8.
INFO:numexpr.utils:NumExpr defaulting to 8 threads.
NumExpr defaulting to 8 threads.
```

#### 下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

#### 載入資料

```
# load documents
documents = SimpleDirectoryReader("./data/paul_graham/").load_data()
```

```
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.vector_stores.awadb import AwaDBVectorStore


embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")


vector_store = AwaDBVectorStore()
storage_context = StorageContext.from_defaults(vector_store=vector_store)


index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context, embed_model=embed_model
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

**成長過程中，作者寫短篇故事，在 IBM 1401 上進行程式設計實驗，催促父親購買 TRS-80 電腦，寫簡單的遊戲，一個預測他的模型火箭飛得有多高程式，以及一個文字處理器。他在大學期間也研究了哲學，轉向 AI，並參與了網際網路基礎設施的建置。他寫了文章並在網路上發表，每週四晚上與一群朋友共進晚餐，畫畫，並在劍橋買了一棟房子。**

```
# set Logging to DEBUG for more detailed outputs
query_engine = index.as_query_engine()
response = query_engine.query(
    "What did the author do after his time at Y Combinator?"
)
```

```
display(Markdown(f"<b>{response}</b>"))
```

**在 Y Combinator 的期間，作者寫了文章，研究了 Lisp，並畫畫。他也去俄勒岡探望母親，並幫助她離開了養老院。**