---
title: "Alibaba Cloud OpenSearch Vector Store"
---

> [Alibaba Cloud OpenSearch Vector Search Edition](https://help.aliyun.com/zh/open-search/vector-search-edition/product-overview) 是一個由阿里巴巴集團開發的大規模分散式搜尋引擎。Alibaba Cloud OpenSearch Vector Search Edition 為整個阿里巴巴集團提供搜尋服務，包括 Taobao、Tmall、Cainiao、Youku 以及為中國大陸以外地區客戶提供的其他電子商務平台。 Alibaba Cloud OpenSearch Vector Search Edition 也是 Alibaba Cloud OpenSearch 的基礎引擎。經過多年的開發，Alibaba Cloud OpenSearch Vector Search Edition 已經滿足了高可用性、高時效性和成本效益的業務需求。Alibaba Cloud OpenSearch Vector Search Edition 也提供一個自動化的 O\&M 系統，您可以基於您的業務特性建立自訂的搜尋服務。

若要執行，您需要先有一個執行個體。

### 設定

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-vector-stores-alibabacloud-opensearch
```

```
%pip install llama-index
```

```
import logging
import sys


logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))
```

### 請提供 OpenAI 存取金鑰

若要使用 OpenAI 的嵌入功能，請提供 OpenAI API 金鑰：

```
import openai


OPENAI_API_KEY = getpass.getpass("OpenAI API Key:")
openai.api_key = OPENAI_API_KEY
```

#### 下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

#### 載入文件

```
from llama_index.core import SimpleDirectoryReader
from IPython.display import Markdown, display
```

```
# load documents
documents = SimpleDirectoryReader("./data/paul_graham").load_data()
print(f"Total documents: {len(documents)}")
```

```
Total documents: 1
```

### 建立 Alibaba Cloud OpenSearch Vector Store 物件：

進行下一步前，您需要先建立 Alibaba Cloud OpenSearch Vector Service 執行個體並設定資料表。

```
# if run fllowing cells raise async io exception, run this
import nest_asyncio


nest_asyncio.apply()
```

```
# initialize without metadata filter
from llama_index.core import StorageContext, VectorStoreIndex
from llama_index.vector_stores.alibabacloud_opensearch import (
    AlibabaCloudOpenSearchStore,
    AlibabaCloudOpenSearchConfig,
)


config = AlibabaCloudOpenSearchConfig(
    endpoint="*****",
    instance_id="*****",
    username="your_username",
    password="your_password",
    table_name="llama",
)


vector_store = AlibabaCloudOpenSearchStore(config)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
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

**在大學時期，作者從事寫作和編程。他在九年級使用早期版本的 Fortran 在 IBM 1401 上嘗試寫短篇故事和程式。**

### 連接至現有的向量儲存庫

由於此向量儲存庫由 Alibaba Cloud OpenSearch 支援，因此本身具有持久性。若要連接至先前建立並填入資料的向量儲存庫，請依照以下步驟操作：

```
from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.alibabacloud_opensearch import (
    AlibabaCloudOpenSearchStore,
    AlibabaCloudOpenSearchConfig,
)


config = AlibabaCloudOpenSearchConfig(
    endpoint="***",
    instance_id="***",
    username="your_username",
    password="your_password",
    table_name="llama",
)


vector_store = AlibabaCloudOpenSearchStore(config)


# Create index from existing stored vectors
index = VectorStoreIndex.from_vector_store(vector_store)
query_engine = index.as_query_engine()
response = query_engine.query(
    "What did the author study prior to working on AI?"
)


display(Markdown(f"<b>{response}</b>"))
```

### 中繼資料篩選

Alibaba Cloud OpenSearch 向量儲存庫支援在查詢時套用中繼資料篩選。以下範例會在全新的資料表上執行，以展示這項功能。

為求簡潔，這個示範只載入一份來源文件（`../data/paul_graham/paul_graham_essay.txt` 文字檔）。接著，我們會在文件上附加自訂中繼資料，展示如何依據文件的中繼資料篩選查詢。

```
from llama_index.core import StorageContext, VectorStoreIndex
from llama_index.vector_stores.alibabacloud_opensearch import (
    AlibabaCloudOpenSearchStore,
    AlibabaCloudOpenSearchConfig,
)


config = AlibabaCloudOpenSearchConfig(
    endpoint="****",
    instance_id="****",
    username="your_username",
    password="your_password",
    table_name="llama",
)


md_storage_context = StorageContext.from_defaults(
    vector_store=AlibabaCloudOpenSearchStore(config)
)




def my_file_metadata(file_name: str):
    """Depending on the input file name, associate a different metadata."""
    if "essay" in file_name:
        source_type = "essay"
    elif "dinosaur" in file_name:
        # this (unfortunately) will not happen in this demo
        source_type = "dinos"
    else:
        source_type = "other"
    return {"source_type": source_type}




# Load documents and build index
md_documents = SimpleDirectoryReader(
    "../data/paul_graham", file_metadata=my_file_metadata
).load_data()
md_index = VectorStoreIndex.from_documents(
    md_documents, storage_context=md_storage_context
)
```

為查詢引擎新增篩選器：

```
from llama_index.core.vector_stores import MetadataFilter, MetadataFilters


md_query_engine = md_index.as_query_engine(
    filters=MetadataFilters(
        filters=[MetadataFilter(key="source_type", value="essay")]
    )
)
md_response = md_query_engine.query(
    "How long it took the author to write his thesis?"
)


display(Markdown(f"<b>{md_response}</b>"))
```

要測試篩選器是否生效，嘗試將其更改為僅使用 `"dinos"` 文件……這次不會有任何結果 :)