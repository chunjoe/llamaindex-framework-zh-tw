---
title: "Weaviate 向量儲存"
---

如果您在 colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-vector-stores-weaviate
```

```
!pip install llama-index
```

#### 建立一個 Weaviate Client

```
import os
import openai


os.environ["OPENAI_API_KEY"] = ""
openai.api_key = os.environ["OPENAI_API_KEY"]
```

```
import logging
import sys


logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))
```

```
import weaviate
```

```
# cloud
cluster_url = ""
api_key = ""


client = weaviate.connect_to_wcs(
    cluster_url=cluster_url,
    auth_credentials=weaviate.auth.AuthApiKey(api_key),
)


# local
# client = connect_to_local()
```

#### 載入 documents，建置 VectorStoreIndex

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.vector_stores.weaviate import WeaviateVectorStore
from IPython.display import Markdown, display
```

下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

```
# load documents
documents = SimpleDirectoryReader("./data/paul_graham").load_data()
```

```
from llama_index.core import StorageContext


# If you want to load the index later, be sure to give it a name!
vector_store = WeaviateVectorStore(
    weaviate_client=client, index_name="LlamaIndex"
)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)


# NOTE: you may also choose to define a index_name manually.
# index_name = "test_prefix"
# vector_store = WeaviateVectorStore(weaviate_client=client, index_name=index_name)
```

#### 使用自訂批次設定

Llamaindex 預設使用 Weaviate 的動態批次（dynamic batching），適用於大多數常見場景。然而，在低延遲設定中，這可能會使伺服器超載或達到任何現有的 GRPC Message 限制。為了獲得更多控制和更好的資料擷取流程，請考慮使用 fixed size batch 來調整批次大小。

以下是如何微調 WeaviateVectorStore 並定義自訂批次：

```
from weaviate.classes.config import ConsistencyLevel


custom_batch = client.batch.fixed_size(
    batch_size=123,
    concurrent_requests=3,
    consistency_level=ConsistencyLevel.ALL,
)
vector_store_fixed = WeaviateVectorStore(
    weaviate_client=client,
    index_name="LlamaIndex",
    # we pass our custom batch as a client_kwargs
    client_kwargs={"custom_batch": custom_batch},
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

## 載入 index

在這裡，我們使用與建立初始 index 時相同的 index 名稱。這樣可以防止它被自動生成，並讓我們可以輕鬆地重新連接到它。

```
cluster_url = ""
api_key = ""


client = weaviate.connect_to_wcs(
    cluster_url=cluster_url,
    auth_credentials=weaviate.auth.AuthApiKey(api_key),
)


# local
# client = weaviate.connect_to_local()
```

```
vector_store = WeaviateVectorStore(
    weaviate_client=client, index_name="LlamaIndex"
)


loaded_index = VectorStoreIndex.from_vector_store(vector_store)
```

```
# set Logging to DEBUG for more detailed outputs
query_engine = loaded_index.as_query_engine()
response = query_engine.query("What happened at interleaf?")
display(Markdown(f"<b>{response}</b>"))
```

## Metadata Filtering

讓我們插入一個虛擬的 document，並嘗試過濾，以便只返回該 document。

```
from llama_index.core import Document


doc = Document.example()
print(doc.metadata)
print("-----")
print(doc.text[:100])
```

```
loaded_index.insert(doc)
```

```
from llama_index.core.vector_stores import ExactMatchFilter, MetadataFilters


filters = MetadataFilters(
    filters=[ExactMatchFilter(key="filename", value="README.md")]
)
query_engine = loaded_index.as_query_engine(filters=filters)
response = query_engine.query("What is the name of the file?")
display(Markdown(f"<b>{response}</b>"))
```

# 完全刪除 index

您可以使用 `delete_index` 函式來刪除由 vector store 建立的 index。

```
vector_store.delete_index()
```

```
vector_store.delete_index()  # calling the function again does nothing
```

# 終止連線

您必須確保您的 client 連線已關閉：

```
client.close()
```
