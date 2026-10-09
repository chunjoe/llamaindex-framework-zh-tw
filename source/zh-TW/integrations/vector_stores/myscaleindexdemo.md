---
title: "MyScale Vector Store"
---

在本筆筆記中，我們將快速演示如何使用 MyScaleVectorStore。

如果您在 Colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-vector-stores-myscale
```

```
!pip install llama-index
```

#### 建立 MyScale Client

```
import logging
import sys


logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))
```

```
from os import environ
import clickhouse_connect


environ["OPENAI_API_KEY"] = "sk-*"


# initialize client
client = clickhouse_connect.get_client(
    host="YOUR_CLUSTER_HOST",
    port=8443,
    username="YOUR_USERNAME",
    password="YOUR_CLUSTER_PASSWORD",
)
```

#### 使用 MyScaleVectorStore 載入 documents，建立並儲存 VectorStoreIndex

我們將使用一組 Paul Graham 的文章來提供需要轉換成 embeddings 的文本，將其儲存在 `MyScaleVectorStore` 中，並查詢以為我們的 LLM QnA loop 找到上下文。

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.vector_stores.myscale import MyScaleVectorStore
from IPython.display import Markdown, display
```

```
# load documents
documents = SimpleDirectoryReader("../data/paul_graham").load_data()
print("Document ID:", documents[0].doc_id)
print("Number of Documents: ", len(documents))
```

```
Document ID: a5f2737c-ed18-4e5d-ab9a-75955edb816d
Number of Documents:  1
```

下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

您可以使用 [SimpleDirectoryReader](https://developers.llamaindex.ai/examples/data_connectors/simple_directory_reader.ipynb) 分別處理您的檔案：

```
loader = SimpleDirectoryReader("./data/paul_graham/")
documents = loader.load_data()
for file in loader.input_files:
    print(file)
    # Here is where you would do any preprocessing
```

```
../data/paul_graham/paul_graham_essay.txt
```

```
# initialize with metadata filter and store indexes
from llama_index.core import StorageContext


for document in documents:
    document.metadata = {"user_id": "123", "favorite_color": "blue"}
vector_store = MyScaleVectorStore(myscale_client=client)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

#### 查詢 Index

現在 MyScale vector store 支援 filter search 和 hybrid search。

您可以進一步了解 [query\_engine](https://developers.llamaindex.ai/module_guides/deploying/query_engine/index.md) 和 [retriever](https://developers.llamaindex.ai/module_guides/querying/retriever/index.md)。

```
import textwrap


from llama_index.core.vector_stores import ExactMatchFilter, MetadataFilters


# set Logging to DEBUG for more detailed outputs
query_engine = index.as_query_engine(
    filters=MetadataFilters(
        filters=[
            ExactMatchFilter(key="user_id", value="123"),
        ]
    ),
    similarity_top_k=2,
    vector_store_query_mode="hybrid",
)
response = query_engine.query("What did the author learn?")
print(textwrap.fill(str(response), 100))
```

#### 清除所有 Index

```
for document in documents:
    index.delete_ref_doc(document.doc_id)
```
