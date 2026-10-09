---
title: "ClickHouse 向量儲存"
---

在本筆筆記中，我們將快速演示如何使用 ClickHouseVectorStore。

如果您在 Colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
!pip install llama-index
!pip install clickhouse_connect
```

#### 建立 ClickHouse Client

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
    host="localhost",
    port=8123,
    username="default",
    password="",
)
```

#### 使用 ClickHouseVectorStore 載入 documents，建立並儲存 VectorStoreIndex

我們將使用一組 Paul Graham 的文章來提供需要轉換成 embedding 的文本，將其儲存在 `ClickHouseVectorStore` 中，並查詢以為我們的 LLM QnA 迴圈提供上下文。

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.vector_stores.clickhouse import ClickHouseVectorStore
```

```
# load documents
documents = SimpleDirectoryReader("../data/paul_graham").load_data()
print("Document ID:", documents[0].doc_id)
print("Number of Documents: ", len(documents))
```

```
Document ID: d03ac7db-8dae-4199-bc38-445dec51a534
Number of Documents:  1
```

下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

```
--2024-02-13 10:08:31--  https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt
Resolving raw.githubusercontent.com (raw.githubusercontent.com)... 185.199.111.133, 185.199.109.133, 185.199.110.133, ...
Connecting to raw.githubusercontent.com (raw.githubusercontent.com)|185.199.111.133|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 75042 (73K) [text/plain]
Saving to: ‘data/paul_graham/paul_graham_essay.txt’


data/paul_graham/pa 100%[===================>]  73.28K  --.-KB/s    in 0.003s


2024-02-13 10:08:31 (23.9 MB/s) - ‘data/paul_graham/paul_graham_essay.txt’ saved [75042/75042]
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
data/paul_graham/paul_graham_essay.txt
```

```
# initialize with metadata filter and store indexes
from llama_index.core import StorageContext


for document in documents:
    document.metadata = {"user_id": "123", "favorite_color": "blue"}
vector_store = ClickHouseVectorStore(clickhouse_client=client)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

#### 查詢 Index

現在 ClickHouse vector store 支援 filter search 和 hybrid search。

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

```
The author learned several things during their time at Interleaf, including the importance of having
technology companies run by product people rather than sales people, the drawbacks of having too
many people edit code, the value of corridor conversations over planned meetings, the challenges of
dealing with big bureaucratic customers, and the importance of being the "entry level" option in a
market.
```

#### 清除所有 Index

```
for document in documents:
    index.delete_ref_doc(document.doc_id)
```
