---
title: "Tair Vector Store"
---

在這個 Notebook 中，我們將快速演示如何使用 TairVectorStore。

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-vector-stores-tair
```

```
!pip install llama-index
```

```
import os
import sys
import logging
import textwrap


import warnings


warnings.filterwarnings("ignore")


# stop huggingface warnings
os.environ["TOKENIZERS_PARALLELISM"] = "false"


# Uncomment to see debug logs
# logging.basicConfig(stream=sys.stdout, level=logging.INFO)
# logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))


from llama_index.core import (
    GPTVectorStoreIndex,
    SimpleDirectoryReader,
    Document,
)
from llama_index.vector_stores.tair import TairVectorStore
from IPython.display import Markdown, display
```

### 設定 OpenAI

我們先從新增 openai api key 開始。這將使我們能夠存取 openai 用於 embeddings，並使用 chatgpt。

```
import os


os.environ["OPENAI_API_KEY"] = "sk-<your key here>"
```

### 下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

### 讀取 dataset

```
# load documents
documents = SimpleDirectoryReader("./data/paul_graham").load_data()
print(
    "Document ID:",
    documents[0].doc_id,
    "Document Hash:",
    documents[0].doc_hash,
)
```

### 從 documents 建構 index

讓我們使用 `GPTVectorStoreIndex` 建構一個 vector index，並使用 `TairVectorStore` 作為其 backend。將 `tair_url` 替換為您的 Tair 實例的實際 url。

```
from llama_index.core import StorageContext


tair_url = "redis://{username}:{password}@r-bp****************.redis.rds.aliyuncs.com:{port}"


vector_store = TairVectorStore(
    tair_url=tair_url, index_name="pg_essays", overwrite=True
)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = GPTVectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

### 查詢資料

現在我們可以使用 index 作為 knowledge base 並向其提問。

```
query_engine = index.as_query_engine()
response = query_engine.query("What did the author learn?")
print(textwrap.fill(str(response), 100))
```

```
response = query_engine.query("What was a hard moment for the author?")
print(textwrap.fill(str(response), 100))
```

### 刪除 documents

要從 index 中刪除一個 document，請使用 `delete` method。

```
document_id = documents[0].doc_id
document_id
```

```
info = vector_store.client.tvs_get_index("pg_essays")
print("Number of documents", int(info["data_count"]))
```

```
vector_store.delete(document_id)
```

```
info = vector_store.client.tvs_get_index("pg_essays")
print("Number of documents", int(info["data_count"]))
```

### 刪除 index

使用 `delete_index` method 刪除整個 index。

```
vector_store.delete_index()
```

```
print("Check index existence:", vector_store.client._index_exists())
```
