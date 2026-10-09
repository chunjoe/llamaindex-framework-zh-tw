---
title: "Gel Vector Store"
---

[Gel](https://www.geldata.com/) 是一個開源的 PostgreSQL 資料層，專為加速從開發到生產的週期而優化。它提供了一個高階的嚴格型別的圖形式資料模型、可組合的層級查詢語言、完整的 SQL 支援、遷移、Auth 和 AI 模組。

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
! pip install gel llama-index-vector-stores-gel
```

```
! pip install llama-index
```

```
# import logging
# import sys


# Uncomment to see debug logs
# logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)
# logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))


from llama_index.core import SimpleDirectoryReader, StorageContext
from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.gel import GelVectorStore
import textwrap
import openai
```

### 設定 OpenAI

第一步是設定 openai key。它將用於為載入到 index 中的 documents 建立 embeddings。

```
import os


os.environ["OPENAI_API_KEY"] = "<your key>"
openai.api_key = os.environ["OPENAI_API_KEY"]
```

下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

### 載入 documents

使用 SimpleDirectoryReader 載入儲存在 `data/paul_graham/` 中的 documents。

```
documents = SimpleDirectoryReader("./data/paul_graham").load_data()
print("Document ID:", documents[0].doc_id)
```

### 建立資料庫

為了將 Gel 作為您 vectorstore 的後端，您需要一個可運行的 Gel 實例。幸運的是，除非您需要！否則它不需要涉及 Docker containers 或任何複雜的設定。

要設定本地實例，執行：

```
! gel project init --non-interactive
```

如果您使用 [Gel Cloud](https://developers.llamaindex.ai/python/framework/integrations/vector_stores/gel/cloud.geldata.com/)（而且您應該使用！），請向該指令添加另一個參數：

終端機視窗

```
gel project init --server-instance <org-name>/<instance-name>
```

如需查看運行 Gel 的完整方法列表，請參閱參考文件中的 [Running Gel](https://docs.geldata.com/reference/running) 部分。

### 設定 schema

[Gel schema](https://docs.geldata.com/reference/datamodel) 是您應用程式資料模型的明確高階描述。除了讓您定義資料的佈局方式外，它還驅動了 Gel 的許多強大功能，例如 links、access policies、functions、triggers、constraints、indexes 等。

LlamaIndex 的 `GelVectorStore` 對 schema 要求以下佈局：

```
schema_content = """
using extension pgvector;


module default {
    scalar type EmbeddingVector extending ext::pgvector::vector<1536>;


    type Record {
        required collection: str;
        text: str;
        embedding: EmbeddingVector;
        external_id: str {
            constraint exclusive;
        };
        metadata: json;


        index ext::pgvector::hnsw_cosine(m := 16, ef_construction := 128)
            on (.embedding)
    }
}
""".strip()


with open("dbschema/default.gel", "w") as f:
    f.write(schema_content)
```

為了將 schema 變更套用到資料庫，請使用 Gel 的 [migration tool](https://docs.geldata.com/reference/datamodel/migrations) 執行遷移：

```
! gel migration create --non-interactive
! gel migrate
```

從此開始，`GelVectorStore` 可以用作 LlamaIndex 中任何其他可用的 vectorstore 的替換。

### 建立 index

```
vector_store = GelVectorStore()


storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context, show_progress=True
)
query_engine = index.as_query_engine()
```

### 查詢 index

我們現在可以使用我們的 index 來提問。

```
response = query_engine.query("What did the author do?")
```

```
print(textwrap.fill(str(response), 100))
```

```
response = query_engine.query("What happened in the mid 1980s?")
```

```
print(textwrap.fill(str(response), 100))
```

### Metadata filters

GelVectorStore 支援在 nodes 中儲存 metadata，並在檢索步驟中基於該 metadata 進行過濾。

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

#### 加上帶有自訂 metadata 的 nodes

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
vector_store = GelVectorStore()


index = VectorStoreIndex.from_vector_store(vector_store=vector_store)
index.insert_nodes(nodes)
```

```
print(index.as_query_engine().query("How did Lakshmi fix the segfault?"))
```

#### 套用 metadata filters

現在我們可以在檢索 nodes 時，根據 commit author 或日期進行過濾。

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

#### 套用 nested filters

在上述範例中，我們使用 AND 或 OR 組合了多個過濾條件。我們也可以組合多組過濾條件。

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

上述內容可以使用 IN 運算符來簡化。`GelVectorStore` 支援 `in`、`nin` 和 `contains` 用於將一個元素與列表進行比較。

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
