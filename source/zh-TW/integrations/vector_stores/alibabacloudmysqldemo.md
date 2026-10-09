---
title: "Alibaba Cloud MySQL"
---

> Alibaba Cloud MySQL，也稱為 [ApsaraDB RDS，用於 MySQL](https://www.alibabacloud.com/help/en/rds/apsaradb-rds-for-mysql/overview-3)。ApsaraDB RDS 用於 MySQL 是一款基於 MySQL 原始碼分支且提供高效能的線上資料庫服務。ApsaraDB RDS 用於 MySQL 是一個成熟的解決方案，曾在 Double 11 期間處理過大量的併發流量。ApsaraDB RDS 用於 MySQL 提供了基本功能，例如白名單配置、備份與還原、Transparent Data Encryption  (TDE)、資料遷移，以及實例、帳號和資料庫的管理。如需更多資訊，請參閱 [RDS MySQL Feature Overview](https://www.alibabacloud.com/help/en/rds/apsaradb-rds-for-mysql/features)。

若要執行此 notebook，您需要一個在雲端運行的 ApsaraDB RDS MySQL 執行個體，請建立帳戶並建立所需的資料庫。您可以參考 [this link](https://www.alibabacloud.com/help/en/rds/apsaradb-rds-for-mysql/step-1-create-an-apsaradb-rds-for-mysql-instance-and-configure-databases)。

在這個 notebook 中，我們需要建立名為 `llama_index_test` 以及 `llama_index_meta_test` 在您的 ApsaraDB RDS MySQL 實例

## Setup

如果您在 colab 上開啟此 Notebook，您可能需要確保已安裝 `llama-index`：

```
!pip install llama-index
```

```
%pip install llama-index-vector-stores-alibabacloud-mysql
```

```
# choose dashscope as embedding and llm model, your can also use default openai or other model to test
%pip install llama-index-embeddings-dashscope
%pip install llama-index-llms-dashscope
```

設定 dashscope embedding 與 llm model，您也可以使用預設的 openai 或其他 model 進行測試。如果您選擇使用 dashscope model，可以獲取您的 api key [此處](https://modelstudio.console.aliyun.com/?tab=dashboard#/api-key)，並在以下程式碼中設定：

```
!export DASHSCOPE_API_KEY="your_api_key"
```

## Download 範例資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

## RAG Demo using Alibaba Cloud MySQL

### 簡單查詢

#### Load Data 用於簡單查詢

```
import os


DASHSCOPE_API_KEY = os.environ.get("DASHSCOPE_API_KEY")


from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
)
from llama_index.vector_stores.alibabacloud_mysql.base import (
    AlibabaCloudMySQLVectorStore,
)


# set Embbeding model
from llama_index.core import Settings
from llama_index.embeddings.dashscope import DashScopeEmbedding


Settings.embed_model = DashScopeEmbedding(api_key=DASHSCOPE_API_KEY)


# config llm model
from llama_index.llms.dashscope import DashScope, DashScopeGenerationModels


dashscope_llm = DashScope(
    model_name=DashScopeGenerationModels.QWEN_MAX, api_key=DASHSCOPE_API_KEY
)


documents = SimpleDirectoryReader("data/paul_graham/").load_data()
print(f"Total documents: {len(documents)}")
print(f"First document, id: {documents[0].doc_id}")
print(f"First document, hash: {documents[0].hash}")
print(
    "First document, text"
    f" ({len(documents[0].text)} characters):\n{'='*20}\n{documents[0].text[:360]} ..."
)


print(
    """
#################
# simple generate vector
#################"""
)
client = AlibabaCloudMySQLVectorStore.from_params(
    host="rm-***.mysql.***.rds.aliyuncs.com",
    port=3306,
    user="user",
    password="password",
    database="llama_index_test",
    distance_method="COSINE",
)
storage_context = StorageContext.from_defaults(vector_store=client)
VectorStoreIndex.from_documents(
    documents, storage_context=storage_context, show_progress=True
)
```

#### 使用以下方式查詢 AlibabaCloudMySQL 搭配 Search 測試

```
import os


DASHSCOPE_API_KEY = os.environ.get("DASHSCOPE_API_KEY")


from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.alibabacloud_mysql.base import (
    AlibabaCloudMySQLVectorStore,
)


# set Embbeding model
from llama_index.core import Settings
from llama_index.embeddings.dashscope import DashScopeEmbedding


embed_model = DashScopeEmbedding(api_key=DASHSCOPE_API_KEY)
# Global Settings
Settings.embed_model = embed_model


# config llm model
from llama_index.llms.dashscope import DashScope, DashScopeGenerationModels


dashscope_llm = DashScope(
    model_name=DashScopeGenerationModels.QWEN_MAX, api_key=DASHSCOPE_API_KEY
)


print(
    """
#################
# Basic Querying including Search Test
#################
"""
)
client = AlibabaCloudMySQLVectorStore.from_params(
    host="rm-***.mysql.eu-west-1.rds.***.com",
    port=3306,
    user="user",
    password="password",
    database="llama_index_test",
    distance_method="COSINE",
)
index = VectorStoreIndex.from_vector_store(
    vector_store=client, embed_model=embed_model
)


QUESTION = "What did the author do growing up?"
# Set Retriever
vector_retriever = index.as_retriever()
# search
source_nodes = vector_retriever.retrieve(QUESTION)
# check source_nodes
print(f"Question: {QUESTION}")
for node in source_nodes:
    print(f"---------------------------------------------")
    print("Search Test")
    print(f"---------------------------------------------")
    print(f"Score: {node.score:.3f}")
    print(node.get_content())
    print(f"---------------------------------------------")


# run query
query_engine = index.as_query_engine(llm=dashscope_llm)
res = query_engine.query(QUESTION)
print(f"Answer: {res.response}")
print(f"---------------------------------------------\n\n")
```

### Metadata Filtering

#### Load Data for Metadata Filtering

```
import os


DASHSCOPE_API_KEY = os.environ.get("DASHSCOPE_API_KEY")


from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
)
from llama_index.vector_stores.alibabacloud_mysql.base import (
    AlibabaCloudMySQLVectorStore,
)


# set Embbeding model
from llama_index.core import Settings
from llama_index.embeddings.dashscope import DashScopeEmbedding


Settings.embed_model = DashScopeEmbedding(api_key=DASHSCOPE_API_KEY)


# config llm model
from llama_index.llms.dashscope import DashScope, DashScopeGenerationModels


dashscope_llm = DashScope(
    model_name=DashScopeGenerationModels.QWEN_MAX, api_key=DASHSCOPE_API_KEY
)


documents = SimpleDirectoryReader("data/paul_graham/").load_data()
print(f"Total documents: {len(documents)}")
print(f"First document, id: {documents[0].doc_id}")
print(f"First document, hash: {documents[0].hash}")
print(
    "First document, text"
    f" ({len(documents[0].text)} characters):\n{'='*20}\n{documents[0].text[:360]} ..."
)


print(
    """
#################
# generate vector with some metadata for Metadata Filtering
#################"""
)
client = AlibabaCloudMySQLVectorStore.from_params(
    host="rm-***.mysql.***.rds.aliyuncs.com",
    port=3306,
    user="user",
    password="password",
    database="llama_index_meta_test",
    distance_method="COSINE",
)
storage_context = StorageContext.from_defaults(vector_store=client)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context, show_progress=True
)


from llama_index.core import Document
import regex as re


# Split the text into paragraphs.
text_chunks = documents[0].text.split("\n\n")


# Create a document for each footnote
footnotes = [
    Document(
        text=chunk,
        id=documents[0].doc_id,
        metadata={
            "is_footnote": bool(re.search(r"^\s*\[\d+\]\s*", chunk)),
            "mark_id": i,
        },
    )
    for i, chunk in enumerate(text_chunks)
    if bool(re.search(r"^\s*\[\d+\]\s*", chunk))
]


# Insert the footnotes into the index
for f in footnotes:
    index.insert(f)
```

#### 使用以下方式查詢 AlibabaCloudMySQL 搭配 Search 測試

```
import os


DASHSCOPE_API_KEY = os.environ.get("DASHSCOPE_API_KEY")


from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.alibabacloud_mysql.base import (
    AlibabaCloudMySQLVectorStore,
)


# set Embbeding model
from llama_index.core import Settings
from llama_index.embeddings.dashscope import DashScopeEmbedding


embed_model = DashScopeEmbedding(api_key=DASHSCOPE_API_KEY)
# Global Settings
Settings.embed_model = embed_model


# config llm model
from llama_index.llms.dashscope import DashScope, DashScopeGenerationModels


dashscope_llm = DashScope(
    model_name=DashScopeGenerationModels.QWEN_MAX, api_key=DASHSCOPE_API_KEY
)


print(
    """
#################
# Querying with Metadata Filtering including Search Test
#################
"""
)
client = AlibabaCloudMySQLVectorStore.from_params(
    host="rm-***.mysql.***.rds.aliyuncs.com",
    port=3306,
    user="user",
    password="password",
    database="llama_index_meta_test",
    distance_method="COSINE",
)
index = VectorStoreIndex.from_vector_store(
    vector_store=client, embed_model=embed_model
)


from llama_index.core.vector_stores import (
    MetadataFilters,
    MetadataFilter,
    FilterOperator,
    FilterCondition,
)


QUESTION = "What did the author about space aliens and lisp?"
print(f"---------------------------------------------")
print(f"Question: {QUESTION}")
filters = MetadataFilters(
    filters=[
        MetadataFilter(
            key="is_footnote", value="true", operator=FilterOperator.EQ
        ),
        MetadataFilter(key="mark_id", value=0, operator=FilterOperator.GTE),
    ],
    condition=FilterCondition.AND,
)
print(f"---------------------------------------------")
for i in range(len(filters.filters)):
    print(f"Filter[{i}]: {filters.filters[i]}")
print(f"Filter Condition: {filters.condition}")
print(f"---------------------------------------------")
retriever = index.as_retriever(
    filters=filters,
)
result = retriever.retrieve(QUESTION)
for node in result:
    print("Search Test")
    print(f"---------------------------------------------")
    print(f"Score: {node.score:.3f}")
    print(node.get_content())
    print(f"---------------------------------------------")


# Create a query engine that only searches certain footnotes.
footnote_query_engine = index.as_query_engine(
    filters=filters,
    llm=dashscope_llm,
)


res = footnote_query_engine.query(QUESTION)
print(f"Answer: {res.response}")
print(f"---------------------------------------------\n\n")
```
