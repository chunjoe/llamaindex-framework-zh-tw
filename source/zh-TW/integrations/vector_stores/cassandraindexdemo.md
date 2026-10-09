---
title: "Cassandra 向量儲存"
---

[Apache Cassandra](https://cassandra.apache.org/) 是一個 NoSQL、行式、高度可擴展且高可用性的資料庫。從 5.0 版本開始，該資料庫就具備了 [向量搜尋](https://cassandra.apache.org/doc/trunk/cassandra/vector-search/overview.html) 功能。

DataStax [Astra DB through CQL](https://docs.datastax.com/en/astra-serverless/docs/vector-search/quickstart.html) 是一個建於 Cassandra 的託管無伺服器資料庫，提供相同的介面和優勢。

**本筆筆記展示了在 LlamaIndex 中使用 Cassandra Vector Store 的基本用法。**

要執行完整的程式碼，您需要一個配備 Vector Search 功能的運行中的 Cassandra cluster 或一個 DataStax Astra DB 實例。

## 設定

```
%pip install llama-index-vector-stores-cassandra
```

```
!pip install --quiet "astrapy>=0.5.8"
```

```
import os
from getpass import getpass


from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    Document,
    StorageContext,
)
from llama_index.vector_stores.cassandra import CassandraVectorStore
```

下一步是使用全局 DB 連線初始化 CassIO：這是針對 Cassandra cluster 和 Astra DB 略有不同的步驟：

### 初始化 (Cassandra cluster)

此時，您需要先建立一個 `cassandra.cluster.Session` 物件，如 [Cassandra driver documentation](https://docs.datastax.com/en/developer/python-driver/latest/api/cassandra/cluster/#module-cassandra.cluster) 中所述。細節有所不同（例如網路 settings 和驗證），但可能類似於：

```
from cassandra.cluster import Cluster


cluster = Cluster(["127.0.0.1"])
session = cluster.connect()
```

```
import cassio


CASSANDRA_KEYSPACE = input("CASSANDRA_KEYSPACE = ")


cassio.init(session=session, keyspace=CASSANDRA_KEYSPACE)
```

### 初始化 (Astra DB through CQL)

此時，您使用以下連線參數初始化 CassIO：

- 資料庫 ID，例如 01234567-89ab-cdef-0123-456789abcdef
- Token，例如 AstraCS:6gBhNmsk135…（必須是「Database Administrator」token）
- 可選的 Keyspace 名稱（如果省略，將使用資料庫的預設值）

```
ASTRA_DB_ID = input("ASTRA_DB_ID = ")
ASTRA_DB_TOKEN = getpass("ASTRA_DB_TOKEN = ")


desired_keyspace = input("ASTRA_DB_KEYSPACE (optional, can be left empty) = ")
if desired_keyspace:
    ASTRA_DB_KEYSPACE = desired_keyspace
else:
    ASTRA_DB_KEYSPACE = None
```

```
ASTRA_DB_ID =  01234567-89ab-cdef-0123-456789abcdef
ASTRA_DB_TOKEN =  ········
ASTRA_DB_KEYSPACE (optional, can be left empty) =
```

```
import cassio


cassio.init(
    database_id=ASTRA_DB_ID,
    token=ASTRA_DB_TOKEN,
    keyspace=ASTRA_DB_KEYSPACE,
)
```

### OpenAI key

為了使用 OpenAI 的 embeddings，您需要提供一個 OpenAI API Key：

```
os.environ["OPENAI_API_KEY"] = getpass("OpenAI API Key:")
```

```
OpenAI API Key: ········
```

### 下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

```
--2023-11-10 01:44:05--  https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt
Resolving raw.githubusercontent.com (raw.githubusercontent.com)... 185.199.109.133, 185.199.110.133, 185.199.111.133, ...
Connecting to raw.githubusercontent.com (raw.githubusercontent.com)|185.199.109.133|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 75042 (73K) [text/plain]
Saving to: ‘data/paul_graham/paul_graham_essay.txt’


data/paul_graham/pa 100%[===================>]  73.28K  --.-KB/s    in 0.01s


2023-11-10 01:44:06 (4.80 MB/s) - ‘data/paul_graham/paul_graham_essay.txt’ saved [75042/75042]
```

## 建立和填充 Vector Store

您現在將從本地檔案載入 Paul Graham 的一些文章，並將它們儲存到 Cassandra Vector Store 中。

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
First document, id: 12bc6987-366a-49eb-8de0-7b52340e4958
First document, hash: abe31930a1775c78df5a5b1ece7108f78fedbf5fe4a9cf58d7a21808fccaef34
First document, text (75014 characters):
====================




What I Worked On


February 2021


Before college the two main things I worked on, outside of school, were writing and programming. I didn't write essays. I wrote what beginning writers were supposed to write then, and probably still are: short stories. My stories were awful. They had hardly any plot, just characters with strong feelings, which I imagined ma ...
```

### 初始化 Cassandra Vector Store

建立 vector store 涉及在尚不存在時建立底層資料庫表：

```
cassandra_store = CassandraVectorStore(
    table="cass_v_table", embedding_dimension=1536
)
```

然後將此 store 包裝成一個 `index` LlamaIndex 抽象，以便後續查詢：

```
storage_context = StorageContext.from_defaults(vector_store=cassandra_store)


index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

請注意，上述 `from_documents` 呼叫會同時執行多項操作：它將輸入 documents 分割成可管理的區塊（「nodes」），為每個 node 計算 embedding vectors，並將它們全部儲存在 Cassandra Vector Store 中。

## 查詢 store

### 基本查詢

```
query_engine = index.as_query_engine()
response = query_engine.query("Why did the author choose to work on AI?")
print(response.response)
```

```
The author chose to work on AI because they were inspired by a novel called The Moon is a Harsh Mistress, which featured an intelligent computer, and a PBS documentary that showed Terry Winograd using SHRDLU. These experiences sparked the author's interest in AI and motivated them to pursue it as a field of study and work.
```

### 基於 MMR 的查詢

MMR (maximal marginal relevance) 方法旨在從 store 中擷取同時與查詢相關，但彼此之間差異最大的文本區塊，目的是為最終答案的建構提供更廣泛的上下文：

```
query_engine = index.as_query_engine(vector_store_query_mode="mmr")
response = query_engine.query("Why did the author choose to work on AI?")
print(response.response)
```

```
The author chose to work on AI because they believed that teaching SHRDLU more words would eventually lead to the development of intelligent programs. They were fascinated by the potential of AI and saw it as an opportunity to expand their understanding of programming and push the limits of what could be achieved.
```

## 連接到現有的 store

由於此 store 由 Cassandra 支援，它在定義上是持久性的。因此，如果您想連接到先前建立和填充過的 store，請按以下方式操作：

```
new_store_instance = CassandraVectorStore(
    table="cass_v_table", embedding_dimension=1536
)


# Create index (from preexisting stored vectors)
new_index_instance = VectorStoreIndex.from_vector_store(
    vector_store=new_store_instance
)


# now you can do querying, etc:
query_engine = new_index_instance.as_query_engine(similarity_top_k=5)
response = query_engine.query(
    "What did the author study prior to working on AI?"
)
```

```
print(response.response)
```

```
The author studied philosophy prior to working on AI.
```

## 從索引中移除 documents

首先，從由索引生成的 `Retriever` 中取得 document 的明確清單，或「nodes」：

```
retriever = new_index_instance.as_retriever(
    vector_store_query_mode="mmr",
    similarity_top_k=3,
    vector_store_kwargs={"mmr_prefetch_factor": 4},
)
nodes_with_scores = retriever.retrieve(
    "What did the author study prior to working on AI?"
)
```

```
print(f"Found {len(nodes_with_scores)} nodes.")
for idx, node_with_score in enumerate(nodes_with_scores):
    print(f"    [{idx}] score = {node_with_score.score}")
    print(f"        id    = {node_with_score.node.node_id}")
    print(f"        text  = {node_with_score.node.text[:90]} ...")
```

```
Found 3 nodes.
    [0] score = 0.4251742327832831
        id    = 7e628668-58fa-4548-9c92-8c31d315dce0
        text  = What I Worked On


February 2021


Before college the two main things I worked on, outside o ...
    [1] score = -0.020323897262800816
        id    = aa279d09-717f-4d68-9151-594c5bfef7ce
        text  = This was now only weeks away. My nice landlady let me leave my stuff in her attic. I had s ...
    [2] score = 0.011198131320563909
        id    = 50b9170d-6618-4e8b-aaf8-36632e2801a6
        text  = It seemed only a matter of time before we'd have Mike, and when I saw Winograd using SHRDL ...
```

但請注意！在使用 vector store 時，您應該將 **document** 視為應刪除的合理單元，而不是屬於它的任何單個 node。在這個案例中，您只插入了一個單一的文字檔案，因此所有 nodes 都具有相同的 `ref_doc_id`：

```
print("Nodes' ref_doc_id:")
print("\n".join([nws.node.ref_doc_id for nws in nodes_with_scores]))
```

```
Nodes' ref_doc_id:
12bc6987-366a-49eb-8de0-7b52340e4958
12bc6987-366a-49eb-8de0-7b52340e4958
12bc6987-366a-49eb-8de0-7b52340e4958
```

現在假設您需要移除您上傳的文字檔案：

```
new_store_instance.delete(nodes_with_scores[0].node.ref_doc_id)
```

重複完全相同的查詢並檢查結果。您應該會看到*沒有結果*被找到：

```
nodes_with_scores = retriever.retrieve(
    "What did the author study prior to working on AI?"
)


print(f"Found {len(nodes_with_scores)} nodes.")
```

```
Found 0 nodes.
```

## Metadata 篩選Cassandra 向量資料庫支援在查詢時以精確匹配的 `key=value` 對的方式進行元資料過濾。以下儲存格將在一個全新的 Cassandra 表格上展示此功能。

在此示範中，為了簡潔起見，載入單一來源 document（`../data/paul_graham/paul_graham_essay.txt` 文字檔案）。儘管如此，您仍可以將自訂元資料附加到 document，以說明如何根據附加到 documents 的元資料來限制查詢。

```
md_storage_context = StorageContext.from_defaults(
    vector_store=CassandraVectorStore(
        table="cass_v_table_md", embedding_dimension=1536
    )
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
    "./data/paul_graham", file_metadata=my_file_metadata
).load_data()
md_index = VectorStoreIndex.from_documents(
    md_documents, storage_context=md_storage_context
)
```

就是這樣：您現在可以在查詢引擎中新增過濾條件：

```
from llama_index.core.vector_stores import ExactMatchFilter, MetadataFilters
```

```
md_query_engine = md_index.as_query_engine(
    filters=MetadataFilters(
        filters=[ExactMatchFilter(key="source_type", value="essay")]
    )
)
md_response = md_query_engine.query(
    "did the author appreciate Lisp and painting?"
)
print(md_response.response)
```

```
Yes, the author appreciated Lisp and painting. They mentioned spending a significant amount of time working on Lisp and even building a new dialect of Lisp called Arc. Additionally, the author mentioned spending most of 2014 painting and experimenting with different techniques.
```

為了測試過濾功能，嘗試將其更改為僅使用 `"dinos"` documents……這次將不會有答案 :)