---
title: "結構化資料"
---

# LlamaIndex + 結構化資料指南

許多現代資料系統都依賴結構化資料，例如 Postgres DB 或 Snowflake data warehouse。LlamaIndex 透過 LLM 的功能，提供許多進階功能，可以從非結構化資料中建立結構化資料，並透過增強的 text-to-SQL 能力來分析這些結構化資料。

**注意：** 任何 Text-to-SQL 應用程式都應注意，執行任意 SQL 查詢可能帶來安全風險。建議採取必要的預防措施，例如使用受限角色、唯讀資料庫、沙盒等。

本指南將引導您了解這些功能。具體來說，我們將涵蓋以下主題：

- **設定 (Setup)**：定義我們的範例 SQL Table。
- **建立我們的 Table Index**：如何從 sql database 轉換為 Table Schema Index。
- **使用自然語言 SQL 查詢**：如何使用自然語言查詢我們的 SQL database。

我們將透過一個包含城市/人口/國家資訊的範例表格來進行說明。此教學的筆記可以在 [這裡](https://developers.llamaindex.ai/python/examples/index_structs/struct_indices/sqlindexdemo/index.md) 找到。

## 設定 (Setup)

首先，我們使用 SQLAlchemy 來設定一個簡單的 sqlite db：

```
from sqlalchemy import (
    create_engine,
    MetaData,
    Table,
    Column,
    String,
    Integer,
    select,
    column,
)


engine = create_engine("sqlite:///:memory:")
metadata_obj = MetaData()
```

然後我們建立一個範例 `city_stats` table：

```
# create city SQL table
table_name = "city_stats"
city_stats_table = Table(
    table_name,
    metadata_obj,
    Column("city_name", String(16), primary_key=True),
    Column("population", Integer),
    Column("country", String(16), nullable=False),
)
metadata_obj.create_all(engine)
```

現在是插入資料點的時候了！

如果您想了解如何透過從非結構化資料中推斷結構化資料點來填入此表格，請參閱下一個部分。否則，您可以選擇直接填充此表格：

```
from sqlalchemy import insert


rows = [
    {"city_name": "Toronto", "population": 2731571, "country": "Canada"},
    {"city_name": "Tokyo", "population": 13929286, "country": "Japan"},
    {"city_name": "Berlin", "population": 600000, "country": "Germany"},
]
for row in rows:
    stmt = insert(city_stats_table).values(**row)
    with engine.begin() as connection:
        cursor = connection.execute(stmt)
```

最後，我們可以將 SQLAlchemy engine 包裝在我們的 SQLDatabase wrapper 中；這使得 db 可以在 LlamaIndex 中使用：

```
from llama_index.core import SQLDatabase


sql_database = SQLDatabase(engine, include_tables=["city_stats"])
```


## 自然語言 SQL

一旦我們建置了我們的 SQL database，我們就可以使用 NLSQLTableQueryEngine 來建構自然語言查詢，這些查詢會被合成為 SQL 查詢。

請注意，我們需要指定要使用的表格。如果我們沒有指定 query engine，它將會拉取所有 schema context，這可能會超出 LLM 的 context window。

```
from llama_index.core.query_engine import NLSQLTableQueryEngine


query_engine = NLSQLTableQueryEngine(
    sql_database=sql_database,
    tables=["city_stats"],
)
query_str = "Which city has the highest population?"
response = query_engine.query(query_str)
```

此 query engine 應在任何您事先可以指定要查詢的表格，或所有表格 schema 的總大小加上提示詞的剩餘部分適合您的 context window 的情況下使用。

## 建立我們的 Table Index

如果我們事先不知道想要使用哪個表格，且表格 schema 的總大小會超出您的 context window 大小，我們應該將表格 schema 儲存在一個 index 中，以便在查詢時我們可以檢索到正確的 schema。

我們可以這樣做，就是使用 SQLTableNodeMapping 物件，它接收一個 SQLDatabase 並為傳入 ObjectIndex 建構器中的每個 SQLTableSchema object 產生一個 Node object。

```
from llama_index.core.objects import (
    SQLTableNodeMapping,
    ObjectIndex,
    SQLTableSchema,
)


table_node_mapping = SQLTableNodeMapping(sql_database)
table_schema_objs = [
    (SQLTableSchema(table_name="city_stats")),
    ...,
]  # one SQLTableSchema for each table


obj_index = ObjectIndex.from_objects(
    table_schema_objs,
    table_node_mapping,
    VectorStoreIndex,
)
```

在這裡，您可以看到我們定義了 table\_node\_mapping，以及一個具有「city\_stats」表格名稱的單一 SQLTableSchema。我們將這些傳入 ObjectIndex 建構器，以及我們想要使用的 VectorStoreIndex 類別定義。這將為我們提供一個 VectorStoreIndex，其中每個 Node 都包含表格 schema 和其他上下文資訊。您也可以新增任何您想要的額外上下文資訊。

```
# manually set extra context text
city_stats_text = (
    "This table gives information regarding the population and country of a given city.\n"
    "The user will query with codewords, where 'foo' corresponds to population and 'bar'"
    "corresponds to city."
)


table_node_mapping = SQLTableNodeMapping(sql_database)
table_schema_objs = [
    (SQLTableSchema(table_name="city_stats", context_str=city_stats_text))
]
```


## 使用自然語言 SQL 查詢

一旦我們定義了我們的 table schema index obj\_index，我們就可以透過傳入我們的 SQLDatabase 和一個從我們的 object index 建構的 retriever 來建構一個 SQLTableRetrieverQueryEngine。

```
from llama_index.core.indices.struct_store import SQLTableRetrieverQueryEngine


query_engine = SQLTableRetrieverQueryEngine(
    sql_database, obj_index.as_retriever(similarity_top_k=1)
)
response = query_engine.query("Which city has the highest population?")
print(response)
```

現在當我們查詢 retriever query engine 時，它將會檢索相關的 table schema，並合成一個 SQL 查詢以及該查詢結果的回應。

## 總結

目前就到這裡！我們不斷尋求改進結構化資料支援的方法。如果您有任何問題，請在 [我們的 Discord](https://discord.gg/dGcwcsnxhU) 告訴我們。