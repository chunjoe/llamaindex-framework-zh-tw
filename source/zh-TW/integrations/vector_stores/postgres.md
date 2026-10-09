---
title: "Postgres Vector Store"
---

在這個 Notebook 中，我們將展示如何使用 [Postgresql](https://www.postgresql.org/) 和 [pgvector](https://github.com/pgvector/pgvector) 在 LlamaIndex 中執行向量搜尋。

如果您在 Colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-vector-stores-postgres
```

```
!pip install llama-index
```

執行以下儲存格將在 Colab 中安裝帶有 PGVector 的 Postgres。

```
!sudo apt update
!echo | sudo apt install -y postgresql-common
!echo | sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh
!echo | sudo apt install postgresql-15-pgvector
!sudo service postgresql start
!sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'password';"
!sudo -u postgres psql -c "CREATE DATABASE vector_db;"
```

```
# import logging
# import sys


# Uncomment to see debug logs
# logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)
# logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))


from llama_index.core import SimpleDirectoryReader, StorageContext
from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.postgres import PGVectorStore
import textwrap
```

### 設定 OpenAI

第一步是設定 openai 金鑰。它將用於為載入到索引中的 documents 建立 embeddings。

```
import os


os.environ["OPENAI_API_KEY"] = "sk-..."
```

下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

### 載入 documents

使用 SimpleDirectoryReader 從 `data/paul_graham/` 載入儲存的 documents。

```
documents = SimpleDirectoryReader("./data/paul_graham").load_data()
print("Document ID:", documents[0].doc_id)
```

```
Document ID: 56e70c8c-0fb7-4250-99be-b953d0185a01
```

### 建立資料庫

使用在 localhost 上運行的現有 postgres，建立我們將使用的資料庫。

```
import psycopg2


connection_string = "postgresql://postgres:password@localhost:5432"
db_name = "vector_db"
conn = psycopg2.connect(connection_string)
conn.autocommit = True


with conn.cursor() as c:
    c.execute(f"DROP DATABASE IF EXISTS {db_name}")
    c.execute(f"CREATE DATABASE {db_name}")
```

### 建立索引

在這裡，我們使用先前載入的 documents 建立一個由 Postgres 支援的索引。PGVectorStore 接受幾個參數。以下範例建立了一個具有 HNSW 索引（m = 16, ef\_construction = 64, ef\_search = 40）並使用 `vector_cosine_ops` 方法的 PGVectorStore。

```
from sqlalchemy import make_url


url = make_url(connection_string)
vector_store = PGVectorStore.from_params(
    database=db_name,
    host=url.host,
    password=url.password,
    port=url.port,
    user=url.username,
    table_name="paul_graham_essay",
    embed_dim=1536,  # openai embedding dimension
    hnsw_kwargs={
        "hnsw_m": 16,
        "hnsw_ef_construction": 64,
        "hnsw_ef_search": 40,
        "hnsw_dist_method": "vector_cosine_ops",
    },
)


storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context, show_progress=True
)
query_engine = index.as_query_engine()
```

```
Parsing nodes:   0%|          | 0/1 [00:00<?, ?it/s]






Generating embeddings:   0%|          | 0/22 [00:00<?, ?it/s]




2025-09-11 16:47:21,725 - INFO - HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
```

### 查詢索引

現在我們可以使用我們的索引來提問。

```
response = query_engine.query("What did the author do?")
```

```
2025-09-11 16:47:30,412 - INFO - HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
2025-09-11 16:47:31,665 - INFO - HTTP Request: POST https://api.openai.com/v1/chat/completions "HTTP/1.1 200 OK"
```

```
print(textwrap.fill(str(response), 100))
```

```
The author worked on writing essays, programming, building microcomputers, predicting rocket
heights, developing a word processor, and giving talks on starting a startup.
```

```
response = query_engine.query("What happened in the mid 1980s?")
```

```
2025-09-11 16:47:37,531 - INFO - HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
2025-09-11 16:47:38,352 - INFO - HTTP Request: POST https://api.openai.com/v1/chat/completions "HTTP/1.1 200 OK"
```

```
print(textwrap.fill(str(response), 100))
```

```
AI was in the air in the mid 1980s, and two things that influenced the desire to work on it were a
novel by Heinlein called The Moon is a Harsh Mistress, which featured an intelligent computer called
Mike, and a PBS documentary that showed Terry Winograd using SHRDLU.
```

### 查詢現有索引

```
vector_store = PGVectorStore.from_params(
    database="vector_db",
    host="localhost",
    password="password",
    port=5432,
    user="postgres",
    table_name="paul_graham_essay",
    embed_dim=1536,  # openai embedding dimension
    hnsw_kwargs={
        "hnsw_m": 16,
        "hnsw_ef_construction": 64,
        "hnsw_ef_search": 40,
        "hnsw_dist_method": "vector_cosine_ops",
    },
)


index = VectorStoreIndex.from_vector_store(vector_store=vector_store)
query_engine = index.as_query_engine()
```

```
response = query_engine.query("What did the author do?")
```

```
print(textwrap.fill(str(response), 100))
```

```
The author worked on writing essays, programming, creating microcomputers, developing software,
giving talks, and starting a startup.
```

### 混合搜尋 (Hybrid Search)

要啟用混合搜尋，您需要：

1. 在建構 `PGVectorStore` 時傳入 `hybrid_search=True`（並可選地使用 `text_search_config` 設定所需的語言）。
2. 在建構查詢引擎時傳入 `vector_store_query_mode="hybrid"`（此設定會在底層傳遞給 retriever）。您也可以可選地設定 `sparse_top_k` 以設定我們應從稀疏文本搜尋中獲得的結果數量（預設值使用與 `similarity_top_k` 相同的數值）。

```
from sqlalchemy import make_url


url = make_url(connection_string)
hybrid_vector_store = PGVectorStore.from_params(
    database=db_name,
    host=url.host,
    password=url.password,
    port=url.port,
    user=url.username,
    table_name="paul_graham_essay_hybrid_search",
    embed_dim=1536,  # openai embedding dimension
    hybrid_search=True,
    text_search_config="english",
    hnsw_kwargs={
        "hnsw_m": 16,
        "hnsw_ef_construction": 64,
        "hnsw_ef_search": 40,
        "hnsw_dist_method": "vector_cosine_ops",
    },
)


storage_context = StorageContext.from_defaults(
    vector_store=hybrid_vector_store
)
hybrid_index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

```
hybrid_query_engine = hybrid_index.as_query_engine(
    vector_store_query_mode="hybrid", sparse_top_k=2
)
hybrid_response = hybrid_query_engine.query(
    "Who does Paul Graham think of with the word schtick"
)
```

```
print(hybrid_response)
```

```
Roy Lichtenstein
```

#### 使用 QueryFusionRetriever 改善混合搜尋

由於文本搜尋和向量搜尋的得分計算方式不同，僅由文本搜尋找到的 nodes 將會獲得較低的得分。

您通常可以透過使用 `QueryFusionRetriever` 來改善混合搜尋的效能，它能更好地利用互信息來排序 nodes。

```
from llama_index.core.response_synthesizers import CompactAndRefine
from llama_index.core.retrievers import QueryFusionRetriever
from llama_index.core.query_engine import RetrieverQueryEngine


vector_retriever = hybrid_index.as_retriever(
    vector_store_query_mode="default",
    similarity_top_k=5,
)
text_retriever = hybrid_index.as_retriever(
    vector_store_query_mode="sparse",
    similarity_top_k=5,  # interchangeable with sparse_top_k in this context
)
retriever = QueryFusionRetriever(
    [vector_retriever, text_retriever],
    similarity_top_k=5,
    num_queries=1,  # set this to 1 to disable query generation
    mode="relative_score",
    use_async=False,
)


response_synthesizer = CompactAndRefine()
query_engine = RetrieverQueryEngine(
    retriever=retriever,
    response_synthesizer=response_synthesizer,
)
```

```
response = query_engine.query(
    "Who does Paul Graham think of with the word schtick, and why?"
)
print(response)
```

```
Paul Graham thinks of Roy Lichtenstein when using the word "schtick" because Lichtenstein's distinctive signature style in his paintings immediately identifies his work as his own.
```

### 元數據過濾器 (Metadata filters)

PGVectorStore 支援在 nodes 中儲存元數據，並在檢索步驟中根據該元數據進行過濾。

#### 下載 git commits dataset

```
!mkdir -p 'data/git_commits/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/csv/commit_history.csv' -O 'data/git_commits/commit_history.csv'
```

```
import csv


with open("data/git_commits/commit_history.csv", "r") as f:
    commits = list(csv.DictReader(f))


print(commits[0])
print(len(commits))
```

```
{'commit': '44e41c12ab25e36c202f58e068ced262eadc8d16', 'author': 'Lakshmi Narayanan Sreethar<lakshmi@timescale.com>', 'date': 'Tue Sep 5 21:03:21 2023 +0530', 'change summary': 'Fix segfault in set_integer_now_func', 'change details': 'When an invalid function oid is passed to set_integer_now_func, it finds out that the function oid is invalid but before throwing the error, it calls ReleaseSysCache on an invalid tuple causing a segfault. Fixed that by removing the invalid call to ReleaseSysCache.  Fixes #6037 '}
4167
```

#### 加上帶有自訂元數據的 nodes

```
# Create TextNode for each of the first 100 commits
from llama_index.core.schema import TextNode
from datetime import datetime
import re


nodes = []
dates = set()
authors = set()
for commit in commits[:100]:
    author_email = commit["author"].split("<")[1][:-1]
    commit_date = datetime.strptime(
        commit["date"], "%a %b %d %H:%M:%S %Y %z"
    ).strftime("%Y-%m-%d")
    commit_text = commit["change summary"]
    if commit["change details"]:
        commit_text += "\n\n" + commit["change details"]
    fixes = re.findall(r"#(\d+)", commit_text, re.IGNORECASE)
    nodes.append(
        TextNode(
            text=commit_text,
            metadata={
                "commit_date": commit_date,
                "author": author_email,
                "fixes": fixes,
            },
        )
    )
    dates.add(commit_date)
    authors.add(author_email)


print(nodes[0])
print(min(dates), "to", max(dates))
print(authors)
```

```
Node ID: 9c2c2f17-d763-4ce8-bb02-83cb176008e4
Text: Fix segfault in set_integer_now_func  When an invalid function
oid is passed to set_integer_now_func, it finds out that the function
oid is invalid but before throwing the error, it calls ReleaseSysCache
on an invalid tuple causing a segfault. Fixed that by removing the
invalid call to ReleaseSysCache.  Fixes #6037
2023-03-22 to 2023-09-05
{'konstantina@timescale.com', 'nikhil@timescale.com', 'satish.8483@gmail.com', 'mats@timescale.com', 'fabriziomello@gmail.com', 'erik@timescale.com', 'sven@timescale.com', 'lakshmi@timescale.com', 'dmitry@timescale.com', 'engel@sero-systems.de', 'rafia.sabih@gmail.com', '36882414+akuzm@users.noreply.github.com', 'jguthrie@timescale.com', 'jan@timescale.com', 'me@noctarius.com'}
```

```
vector_store = PGVectorStore.from_params(
    database=db_name,
    host=url.host,
    password=url.password,
    port=url.port,
    user=url.username,
    table_name="metadata_filter_demo3",
    embed_dim=1536,  # openai embedding dimension
    hnsw_kwargs={
        "hnsw_m": 16,
        "hnsw_ef_construction": 64,
        "hnsw_ef_search": 40,
        "hnsw_dist_method": "vector_cosine_ops",
    },
)


index = VectorStoreIndex.from_vector_store(vector_store=vector_store)
index.insert_nodes(nodes)
```

```
2025-09-11 16:48:11,383 - INFO - HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
```

```
print(index.as_query_engine().query("How did Lakshmi fix the segfault?"))
```

```
2025-09-11 16:48:15,149 - INFO - HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
2025-09-11 16:48:15,687 - INFO - HTTP Request: POST https://api.openai.com/v1/chat/completions "HTTP/1.1 200 OK"




Lakshmi fixed the segfault by removing the invalid call to ReleaseSysCache that was causing the issue.
```

#### 應用元數據過濾器

現在我們可以在檢索 nodes 時，根據提交作者或日期進行過濾。

```
from llama_index.core.vector_stores.types import (
    MetadataFilter,
    MetadataFilters,
)


filters = MetadataFilters(
    filters=[
        MetadataFilter(key="author", value="mats@timescale.com"),
        MetadataFilter(key="author", value="sven@timescale.com"),
    ],
    condition="or",
)


retriever = index.as_retriever(
    similarity_top_k=10,
    filters=filters,
)


retrieved_nodes = retriever.retrieve("What is this software project about?")


for node in retrieved_nodes:
    print(node.node.metadata)
```

```
2025-09-11 16:48:31,673 - INFO - HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"




{'commit_date': '2023-08-07', 'author': 'mats@timescale.com', 'fixes': []}
{'commit_date': '2023-08-27', 'author': 'sven@timescale.com', 'fixes': []}
{'commit_date': '2023-07-13', 'author': 'mats@timescale.com', 'fixes': []}
{'commit_date': '2023-08-07', 'author': 'sven@timescale.com', 'fixes': []}
{'commit_date': '2023-08-30', 'author': 'sven@timescale.com', 'fixes': []}
{'commit_date': '2023-08-15', 'author': 'sven@timescale.com', 'fixes': []}
{'commit_date': '2023-08-23', 'author': 'sven@timescale.com', 'fixes': []}
{'commit_date': '2023-08-10', 'author': 'mats@timescale.com', 'fixes': []}
{'commit_date': '2023-07-25', 'author': 'mats@timescale.com', 'fixes': ['5892']}
{'commit_date': '2023-08-21', 'author': 'sven@timescale.com', 'fixes': []}
```

```
filters = MetadataFilters(
    filters=[
        MetadataFilter(key="commit_date", value="2023-08-15", operator=">="),
        MetadataFilter(key="commit_date", value="2023-08-25", operator="<="),
    ],
    condition="and",
)


retriever = index.as_retriever(
    similarity_top_k=10,
    filters=filters,
)


retrieved_nodes = retriever.retrieve("What is this software project about?")


for node in retrieved_nodes:
    print(node.node.metadata)
```

```
2025-09-11 16:48:40,347 - INFO - HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"




{'commit_date': '2023-08-23', 'author': 'erik@timescale.com', 'fixes': []}
{'commit_date': '2023-08-17', 'author': 'konstantina@timescale.com', 'fixes': []}
{'commit_date': '2023-08-15', 'author': '36882414+akuzm@users.noreply.github.com', 'fixes': []}
{'commit_date': '2023-08-15', 'author': '36882414+akuzm@users.noreply.github.com', 'fixes': []}
{'commit_date': '2023-08-24', 'author': 'lakshmi@timescale.com', 'fixes': []}
{'commit_date': '2023-08-15', 'author': 'sven@timescale.com', 'fixes': []}
{'commit_date': '2023-08-23', 'author': 'sven@timescale.com', 'fixes': []}
{'commit_date': '2023-08-21', 'author': 'sven@timescale.com', 'fixes': []}
{'commit_date': '2023-08-20', 'author': 'sven@timescale.com', 'fixes': []}
{'commit_date': '2023-08-21', 'author': 'sven@timescale.com', 'fixes': []}
```

#### 應用巢狀過濾器 (nested filters)

在上述範例中，我們使用 AND 或 OR 組合了多個過濾器。我們也可以組合多組過濾器。

例如在 SQL 中：

```
WHERE (commit_date >= '2023-08-01' AND commit_date <= '2023-08-15') AND (author = 'mats@timescale.com' OR author = 'sven@timescale.com')
```

```
filters = MetadataFilters(
    filters=[
        MetadataFilters(
            filters=[
                MetadataFilter(
                    key="commit_date", value="2023-08-01", operator=">="
                ),
                MetadataFilter(
                    key="commit_date", value="2023-08-15", operator="<="
                ),
            ],
            condition="and",
        ),
        MetadataFilters(
            filters=[
                MetadataFilter(key="author", value="mats@timescale.com"),
                MetadataFilter(key="author", value="sven@timescale.com"),
            ],
            condition="or",
        ),
    ],
    condition="and",
)


retriever = index.as_retriever(
    similarity_top_k=10,
    filters=filters,
)


retrieved_nodes = retriever.retrieve("What is this software project about?")


for node in retrieved_nodes:
    print(node.node.metadata)
```

```
2025-09-11 16:48:45,021 - INFO - HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"




{'commit_date': '2023-08-07', 'author': 'mats@timescale.com', 'fixes': []}
{'commit_date': '2023-08-07', 'author': 'sven@timescale.com', 'fixes': []}
{'commit_date': '2023-08-15', 'author': 'sven@timescale.com', 'fixes': []}
{'commit_date': '2023-08-10', 'author': 'mats@timescale.com', 'fixes': []}
```

上述內容可以使用 IN 運算符來簡化。`PGVectorStore` 支援 `in`、`nin` 和 `contains` 用於比較一個元素與一個列表。

```
filters = MetadataFilters(
    filters=[
        MetadataFilter(key="commit_date", value="2023-08-01", operator=">="),
        MetadataFilter(key="commit_date", value="2023-08-15", operator="<="),
        MetadataFilter(
            key="author",
            value=["mats@timescale.com", "sven@timescale.com"],
            operator="in",
        ),
    ],
    condition="and",
)


retriever = index.as_retriever(
    similarity_top_k=10,
    filters=filters,
)


retrieved_nodes = retriever.retrieve("What is this software project about?")


for node in retrieved_nodes:
    print(node.node.metadata)
```

```
2025-09-11 16:48:49,129 - INFO - HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"




{'commit_date': '2023-08-07', 'author': 'mats@timescale.com', 'fixes': []}
{'commit_date': '2023-08-07', 'author': 'sven@timescale.com', 'fixes': []}
{'commit_date': '2023-08-15', 'author': 'sven@timescale.com', 'fixes': []}
{'commit_date': '2023-08-10', 'author': 'mats@timescale.com', 'fixes': []}
```

```
# Same thing, with NOT IN
filters = MetadataFilters(
    filters=[
        MetadataFilter(key="commit_date", value="2023-08-01", operator=">="),
        MetadataFilter(key="commit_date", value="2023-08-15", operator="<="),
        MetadataFilter(
            key="author",
            value=["mats@timescale.com", "sven@timescale.com"],
            operator="nin",
        ),
    ],
    condition="and",
)


retriever = index.as_retriever(
    similarity_top_k=10,
    filters=filters,
)


retrieved_nodes = retriever.retrieve("What is this software project about?")


for node in retrieved_nodes:
    print(node.node.metadata)
```

```
2025-09-11 16:48:51,587 - INFO - HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"




{'commit_date': '2023-08-09', 'author': 'me@noctarius.com', 'fixes': ['5805']}
{'commit_date': '2023-08-15', 'author': '36882414+akuzm@users.noreply.github.com', 'fixes': []}
{'commit_date': '2023-08-15', 'author': '36882414+akuzm@users.noreply.github.com', 'fixes': []}
{'commit_date': '2023-08-11', 'author': '36882414+akuzm@users.noreply.github.com', 'fixes': []}
{'commit_date': '2023-08-09', 'author': 'konstantina@timescale.com', 'fixes': ['5923', '5680', '5774', '5786', '5906', '5912']}
{'commit_date': '2023-08-03', 'author': 'dmitry@timescale.com', 'fixes': []}
{'commit_date': '2023-08-03', 'author': 'dmitry@timescale.com', 'fixes': ['5908']}
{'commit_date': '2023-08-01', 'author': 'nikhil@timescale.com', 'fixes': []}
{'commit_date': '2023-08-10', 'author': 'konstantina@timescale.com', 'fixes': []}
{'commit_date': '2023-08-10', 'author': '36882414+akuzm@users.noreply.github.com', 'fixes': []}
```

```
# CONTAINS
filters = MetadataFilters(
    filters=[
        MetadataFilter(key="fixes", value="5680", operator="contains"),
    ]
)


retriever = index.as_retriever(
    similarity_top_k=10,
    filters=filters,
)


retrieved_nodes = retriever.retrieve("How did these commits fix the issue?")
for node in retrieved_nodes:
    print(node.node.metadata)
```

```
2025-09-11 16:48:56,822 - INFO - HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"




{'commit_date': '2023-08-09', 'author': 'konstantina@timescale.com', 'fixes': ['5923', '5680', '5774', '5786', '5906', '5912']}
```

### 自訂查詢 (Customize queries)

可以建立更複雜的查詢，例如連接其他表格。這是透過將 `customize_query_fn` 參數設定為您的函式來完成的。首先，讓我們建立一個使用者表並填充它。

```
from sqlalchemy import (
    Table,
    MetaData,
    Column,
    String,
    Integer,
    create_engine,
    insert,
)


engine = create_engine(url=connection_string + "/" + db_name)


metadata = MetaData()


user_table = Table(
    "user",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("name", String, nullable=False),
    Column("email", String, nullable=False),
)


user_table.drop(engine, checkfirst=True)
user_table.create(engine)


with engine.begin() as conn:
    stmt = insert(user_table)
    conn.execute(
        stmt, [{"name": "Konstantina", "email": "konstantina@timescale.com"}]
    )
```

然後，我們可以建立一個查詢自訂函式，並使用 `PGVectorStore` 實例化 `customize_query_fn`。

```
from typing import Any
from sqlalchemy import Select




def customize_query(query: Select, table_class: Any, **kwargs: Any) -> Select:
    # Join the user table on the email addresses and add the name column to the select statement
    return query.add_columns(user_table.c.name).join(
        user_table,
        user_table.c.email == table_class.metadata_["author"].astext,
    )




vector_store = PGVectorStore.from_params(
    database=db_name,
    host=url.host,
    password=url.password,
    port=url.port,
    user=url.username,
    table_name="metadata_filter_demo3",
    embed_dim=1536,  # openai embedding dimension
    hnsw_kwargs={
        "hnsw_m": 16,
        "hnsw_ef_construction": 64,
        "hnsw_ef_search": 40,
        "hnsw_dist_method": "vector_cosine_ops",
    },
    customize_query_fn=customize_query,
)
index = VectorStoreIndex.from_vector_store(vector_store=vector_store)
```
接著，我們可以查詢 vector store，並從 node 的 metadata 中，檢索附加到 select statement 中的任何欄位，這些欄位位於名為 `custom_fields` 的 dictionary 中。

```
filters = MetadataFilters(
    filters=[
        MetadataFilter(key="fixes", value="5680", operator="contains"),
    ]
)


retriever = index.as_retriever(
    similarity_top_k=10,
    filters=filters,
)


retrieved_nodes = retriever.retrieve("How did these commits fix the issue?")
for node in retrieved_nodes:
    print(node.node.metadata)
```

```
2025-09-11 17:06:43,812 - INFO - HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"




{'commit_date': '2023-08-09', 'author': 'konstantina@timescale.com', 'fixes': ['5923', '5680', '5774', '5786', '5906', '5912'], 'custom_fields': {'name': 'Konstantina'}}
```

### PgVector 查詢選項

#### IVFFlat Probes

指定 [IVFFlat probes](https://github.com/pgvector/pgvector?tab=readme-ov-file#query-options) 的數量（預設為 1）

在從 index 檢索時，您可以指定適當的 IVFFlat probes 數量（召回率越高越好，速度越快越好）

```
retriever = index.as_retriever(
    vector_store_query_mode="hybrid",
    similarity_top_k=5,
    vector_store_kwargs={"ivfflat_probes": 10},
)
```

#### HNSW EF Search

指定搜尋的動態 [candidate list](https://github.com/pgvector/pgvector?tab=readme-ov-file#query-options-1) 的大小（預設為 40）

```
retriever = index.as_retriever(
    vector_store_query_mode="hybrid",
    similarity_top_k=5,
    vector_store_kwargs={"hnsw_ef_search": 300},
)
```
