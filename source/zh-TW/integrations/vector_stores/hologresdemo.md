---
title: "Hologres"
---

> [Hologres](https://www.alibabacloud.com/help/en/hologres/) 是一個一站式即時資料倉儲，可支援高效能 OLAP 分析和高 QPS 線上服務。

要執行此 notebook，您需要在雲端運行一個 Hologres 實例。您可透過 [此連結](https://www.alibabacloud.com/help/en/hologres/getting-started/purchase-a-hologres-instance#task-1918224) 取得一個。

建立實例後，您應能透過 [Hologres console](https://www.alibabacloud.com/help/en/hologres/user-guide/instance-list?spm=a2c63.p38356.0.0.79b34766nhwskN) 了解以下設定。

```
test_hologres_config = {
    "host": "<host>",
    "port": 80,
    "user": "<user>",
    "password": "<password>",
    "database": "<database>",
    "table_name": "<table_name>",
}
```

順帶一提，您需要確保已安裝 `llama-index`：

```
%pip install llama-index-vector-stores-hologres
```

```
!pip install llama-index
```

### 匯入所需的套件依賴：

```
from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
)
from llama_index.vector_stores.hologres import HologresVectorStore
```

### 載入一些範例資料：

```
!mkdir -p 'data/paul_graham/'
!curl 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -o 'data/paul_graham/paul_graham_essay.txt'
```

```
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 75042  100 75042    0     0  31985      0  0:00:02  0:00:02 --:--:-- 31987
```

### 讀取資料：

```
# load documents
documents = SimpleDirectoryReader("./data/paul_graham/").load_data()
print(f"Total documents: {len(documents)}")
print(f"First document, id: {documents[0].doc_id}")
print(f"First document, hash: {documents[0].hash}")
print(
    "First document, text"
    f" ({len(documents[0].text)} characters):\n{'='*20}\n{documents[0].text[:360]} ..."
)
```

```
Total documents: 1
First document, id: 824dafc0-0aa1-4c80-b99c-33895cfc606a
First document, hash: 8430b3bdb65ee0a7853463b71e7e1e20beee3a3ce15ef3ec714919f8653b2eb9
First document, text (75014 characters):
====================




What I Worked On


February 2021


Before college the two main things I worked on, outside of school, were writing and programming. I didn't write essays. I wrote what beginning writers were supposed to write then, and probably still are: short stories. My stories were awful. They had hardly any plot, just characters with strong feelings, which I imagined ma ...
```

### 建立 AnalyticDB Vector Store 物件：

```
hologres_store = HologresVectorStore.from_param(
    host=test_hologres_config["host"],
    port=test_hologres_config["port"],
    user=test_hologres_config["user"],
    password=test_hologres_config["password"],
    database=test_hologres_config["database"],
    table_name=test_hologres_config["table_name"],
    embedding_dimension=1536,
    pre_delete_table=True,
)
```

### 從 Documents 建構索引：

```
storage_context = StorageContext.from_defaults(vector_store=hologres_store)


index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

### 使用索引進行查詢：

```
query_engine = index.as_query_engine()
response = query_engine.query("Why did the author choose to work on AI?")


print(response.response)
```

```
The author was inspired to work on AI due to the influence of a science fiction novel, "The Moon is a Harsh Mistress," which featured an intelligent computer named Mike, and a PBS documentary showcasing Terry Winograd's use of the SHRDLU program. These experiences led the author to believe that creating intelligent machines was an imminent reality and sparked their interest in the field of AI.
```
