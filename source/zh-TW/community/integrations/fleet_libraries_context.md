---
title: "Fleet Context Embeddings - 為 Llamaindex 函式庫建構混合搜尋引擎"
---

在本指南中，我們將使用 Fleet Context 來下載 LlamaIndex 文件中的 embeddings，並在它之上建立一個混合的 dense/sparse vector retrieval engine。

## 先決條件

```
!pip install llama-index
!pip install --upgrade fleet-context
```

```
import os
import openai


os.environ["OPENAI_API_KEY"] = "sk-..." # add your API key here!
openai.api_key = os.environ["OPENAI_API_KEY"]
```


## 從 Fleet Context 下載 Embeddings

我們將使用 Fleet Context 來下載 LlamaIndex 全部文檔的 embeddings（約 12k chunks，約 100mb 的內容）。您可以透過指定 library 名稱作為參數，下載任何前 1220 個 library 的內容。您可以在頁面底部查看支援的完整 library 清單 [此處](https://fleet.so/context)。

我們這樣做是因為 Fleet 建立了一個 embeddings pipeline，它保留了許多重要的資訊，這將使檢索和生成更佳，包括頁面位置（用於 re-ranking）、chunk type（class/function/attribute/etc）、父級區段等。您可以在他們的 [Github page](https://github.com/fleet-ai/context/tree/main) 上閱讀更多相關資訊。

```
from context import download_embeddings


df = download_embeddings("llamaindex")
```

**輸出**:

終端機視窗

```
    100%|██████████| 83.7M/83.7M [00:03<00:00, 27.4MiB/s]
                                         id  \
    0  e268e2a1-9193-4e7b-bb9b-7a4cb88fc735
    1  e495514b-1378-4696-aaf9-44af948de1a1
    2  e804f616-7db0-4455-9a06-49dd275f3139
    3  eb85c854-78f1-4116-ae08-53b2a2a9fa41
    4  edfc116e-cf58-4118-bad4-c4bc0ca1495e
```

```
# Show some examples of the metadata
df["metadata"][0]
display(Markdown(f"{df['metadata'][8000]['text']}"))
```

**輸出**:

終端機視窗

```
classmethod from_dict(data: Dict[str, Any], kwargs: Any) → Self classmethod from_json(data_str: str, kwargs: Any) → Self classmethod from_orm(obj: Any) → Model json(, include: Optional[Union[AbstractSetIntStr, MappingIntStrAny]] = None, exclude: Optional[Union[AbstractSetIntStr, MappingIntStrAny]] = None, by_alias: bool = False, skip_defaults: Optional[bool] = None, exclude_unset: bool = False, exclude_defaults: bool = False, exclude_none: bool = False, encoder: Optional[Callable[[Any], Any]] = None, models_as_dict: bool = True*, dumps_kwargs: Any) → unicode Generate a JSON representation of the model, include and exclude arguments as per dict().
```


## 為 LlamaIndex 的混合搜尋建立 Pinecone Index

我們將建立一個 Pinecone index，並將我們的 vectors 存入其中，以便我們能夠使用 sparse vectors 和 dense vectors 進行混合檢索。在繼續之前，請確保您擁有一個 [Pinecone account](https://pinecone.io/)。

```
import logging
import sys


logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logging.getLogger().handlers = []
logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))
```

```
import pinecone


api_key = "..."  # Add your Pinecone API key here
pinecone.init(
    api_key=api_key, environment="us-east-1-aws"
)  # Add your db region here
```

```
# Fleet Context uses the text-embedding-ada-002 model from OpenAI with 1536 dimensions.


# NOTE: Pinecone requires dotproduct similarity for hybrid search
pinecone.create_index(
    "quickstart-fleet-context",
    dimension=1536,
    metric="dotproduct",
    pod_type="p1",
)


pinecone.describe_index(
    "quickstart-fleet-context"
)  # Make sure you create an index in pinecone
```


```
from llama_index.vector_stores.pinecone import PineconeVectorStore


pinecone_index = pinecone.Index("quickstart-fleet-context")
vector_store = PineconeVectorStore(pinecone_index, add_sparse_vector=True)
```


## 將 vectors 分批 upsert 到 Pinecone

Pinecone 建議一次 upsert 100 個 vectors。我們將在修改資料格式後執行此操作。

```
import random
import itertools




def chunks(iterable, batch_size=100):
    """A helper function to break an iterable into chunks of size batch_size."""
    it = iter(iterable)
    chunk = tuple(itertools.islice(it, batch_size))
    while chunk:
        yield chunk
        chunk = tuple(itertools.islice(it, batch_size))




# generator that generates many (id, vector, metadata, sparse_values) pairs
data_generator = map(
    lambda row: {
        "id": row[1]["id"],
        "values": row[1]["values"],
        "metadata": row[1]["metadata"],
        "sparse_values": row[1]["sparse_values"],
    },
    df.iterrows(),
)


# Upsert data with 1000 vectors per upsert request
for ids_vectors_chunk in chunks(data_generator, batch_size=100):
    print(f"Upserting {len(ids_vectors_chunk)} vectors...")
    pinecone_index.upsert(vectors=ids_vectors_chunk)
```


## 在 LlamaIndex 中建立 Pinecone Vector Store

最後，我們將透過 LlamaIndex 建立 Pinecone vector store，並查詢它以獲取結果。

```
from llama_index.core import VectorStoreIndex
from IPython.display import Markdown, display
```

```
index = VectorStoreIndex.from_vector_store(vector_store=vector_store)
```


## 查詢您的 Index！

```
query_engine = index.as_query_engine(
    vector_store_query_mode="hybrid", similarity_top_k=8
)
response = query_engine.query("How do I use llama_index SimpleDirectoryReader")
```

```
display(Markdown(f"<b>{response}</b>"))
```

**輸出**:

終端機視窗

```
<b>To use the SimpleDirectoryReader in llama_index, you need to import it from the llama_index library. Once imported, you can create an instance of the SimpleDirectoryReader class by providing the directory path as an argument. Then, you can use the `load_data()` method on the SimpleDirectoryReader instance to load the documents from the specified directory.</b>
```
