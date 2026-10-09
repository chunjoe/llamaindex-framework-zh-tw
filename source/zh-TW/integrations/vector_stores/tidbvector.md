---
title: "TiDB Vector Store"
---

> [TiDB Cloud](https://www.pingcap.com/tidb-serverless/) 是一個全面的 Database-as-a-Service (DBaaS) 解決方案，提供專用和無伺服器選項。TiDB Serverless 現在將內建的 vector search 整合到 MySQL 領域。透過此增強功能，您無需建立新的資料庫或額外的技術堆疊，即可在 TiDB Serverless 上無縫開發 AI 應用程式。在 <https://pingcap.com/ai> 處建立一個免費的 TiDB Serverless cluster，並開始使用 vector search 功能。

本筆筆記提供關於在 LlamaIndex 中使用 tidb vector search 的詳細指南。

## 設定環境

```
%pip install llama-index-vector-stores-tidbvector
%pip install llama-index
```

```
import textwrap


from llama_index.core import SimpleDirectoryReader, StorageContext
from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.tidbvector import TiDBVectorStore
```

設定您的 OpenAI Key

```
import getpass
import os


os.environ["OPENAI_API_KEY"] = getpass.getpass("Input your OpenAI API key:")
```

設定您需要的 TiDB 連線設定。若要連線到您的 TiDB Cloud Cluster，請遵循以下步驟：

- 前往您的 TiDB Cloud cluster Console，導航至 `Connect` 頁面。
- 選擇使用 `SQLAlchemy` 和 `PyMySQL` 連線的選項，並複製提供的連線 URL（不含密碼）。
- 將連線 URL 貼到您的程式碼中，替換 `tidb_connection_string_template` 變數。
- 輸入您的密碼。

```
# replace with your tidb connect string from tidb cloud console
tidb_connection_string_template = "mysql+pymysql://<USER>:<PASSWORD>@<HOST>:4000/<DB>?ssl_ca=/etc/ssl/cert.pem&ssl_verify_cert=true&ssl_verify_identity=true"
# type your tidb password
tidb_password = getpass.getpass("Input your TiDB password:")
tidb_connection_url = tidb_connection_string_template.replace(
    "<PASSWORD>", tidb_password
)
```

準備用於展示的資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

```
documents = SimpleDirectoryReader("./data/paul_graham").load_data()
print("Document ID:", documents[0].doc_id)
for index, document in enumerate(documents):
    document.metadata = {"book": "paul_graham"}
```

```
Document ID: 86e12675-2e9a-4097-847c-8b981dd41806
```


## 建立 TiDB Vectore Store

以下程式碼片段在 TiDB 中建立一個名為 `VECTOR_TABLE_NAME` 的表格，專為 vector 搜尋而優化。成功執行此程式碼後，您將可以直接在您的 TiDB 資料庫環境中查看和存取 `VECTOR_TABLE_NAME` 表格。

```
VECTOR_TABLE_NAME = "paul_graham_test"
tidbvec = TiDBVectorStore(
    connection_string=tidb_connection_url,
    table_name=VECTOR_TABLE_NAME,
    distance_strategy="cosine",
    vector_dimension=1536,
    drop_existing_table=False,
)
```

建立基於 tidb vectore store 的 query engine

```
storage_context = StorageContext.from_defaults(vector_store=tidbvec)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context, show_progress=True
)
```

注意：如果在此過程中遇到由於 MySQL protocol 的 packet size 限制而發生的錯誤，例如嘗試插入大量向量（例如 2000 行），您可以透過將插入拆分成較小的批次來緩解此問題。例如，您可以將 `insert_batch_size` 參數設定為較小的值（例如 1000），以避免超過 packet size 限制，確保您的資料順利插入到 TiDB vector store 中：

```
storage_context = StorageContext.from_defaults(vector_store=tidbvec)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context, insert_batch_size=1000, show_progress=True
)
```


## 語義相似度搜尋

本節重點介紹 vector search 的基本概念以及如何使用 metadata 篩選器來精煉結果。請注意，tidb vector 只支援 Default VectorStoreQueryMode。

```
query_engine = index.as_query_engine()
response = query_engine.query("What did the author do?")
print(textwrap.fill(str(response), 100))
```

```
The author wrote a book.
```


### 使用 metadata 篩選器

使用 metadata 篩選器執行搜尋，以檢索符合所應用篩選器的特定數量最近鄰結果。

```
from llama_index.core.vector_stores.types import (
    MetadataFilter,
    MetadataFilters,
)


query_engine = index.as_query_engine(
    filters=MetadataFilters(
        filters=[
            MetadataFilter(key="book", value="paul_graham", operator="!="),
        ]
    ),
    similarity_top_k=2,
)
response = query_engine.query("What did the author learn?")
print(textwrap.fill(str(response), 100))
```

```
Empty Response
```

再次查詢

```
from llama_index.core.vector_stores.types import (
    MetadataFilter,
    MetadataFilters,
)


query_engine = index.as_query_engine(
    filters=MetadataFilters(
        filters=[
            MetadataFilter(key="book", value="paul_graham", operator="=="),
        ]
    ),
    similarity_top_k=2,
)
response = query_engine.query("What did the author learn?")
print(textwrap.fill(str(response), 100))
```

```
The author learned valuable lessons from his experiences.
```


## 刪除 documents

```
tidbvec.delete(documents[0].doc_id)
```

檢查 documents 是否已被刪除

```
query_engine = index.as_query_engine()
response = query_engine.query("What did the author learn?")
print(textwrap.fill(str(response), 100))
```

```
Empty Response
```
