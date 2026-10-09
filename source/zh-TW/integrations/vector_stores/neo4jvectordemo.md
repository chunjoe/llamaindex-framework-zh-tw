---
title: "Neo4j 向量儲存"
---

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-vector-stores-neo4jvector
```

```
!pip install llama-index
```

```
import os
import openai


os.environ["OPENAI_API_KEY"] = "OPENAI_API_KEY"
openai.api_key = os.environ["OPENAI_API_KEY"]
```

## 啟動 Neo4j vector wrapper

```
from llama_index.vector_stores.neo4jvector import Neo4jVectorStore


username = "neo4j"
password = "pleaseletmein"
url = "bolt://localhost:7687"
embed_dim = 1536


neo4j_vector = Neo4jVectorStore(username, password, url, embed_dim)
```

## 載入 documents，建構 VectorStoreIndex

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from IPython.display import Markdown, display
```

下載 Data

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

```
--2023-12-14 18:44:00--  https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt
Resolving raw.githubusercontent.com (raw.githubusercontent.com)... 185.199.111.133, 185.199.109.133, 185.199.110.133, ...
Connecting to raw.githubusercontent.com (raw.githubusercontent.com)|185.199.111.133|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 75042 (73K) [text/plain]
Saving to: ‘data/paul_graham/paul_graham_essay.txt’


data/paul_graham/pa 100%[===================>]  73,28K  --.-KB/s    in 0,03s


2023-12-14 18:44:00 (2,16 MB/s) - ‘data/paul_graham/paul_graham_essay.txt’ saved [75042/75042]
```

```
# load documents
documents = SimpleDirectoryReader("./data/paul_graham").load_data()
```

```
from llama_index.core import StorageContext


storage_context = StorageContext.from_defaults(vector_store=neo4j_vector)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

```
query_engine = index.as_query_engine()
response = query_engine.query("What happened at interleaf?")
display(Markdown(f"<b>{response}</b>"))
```

**在 Interleaf，他們新增了一種受 Emacs 啟發的腳本語言，並使其成為 Lisp 的一種方言。他們正在尋找一位 Lisp hacker 來在這個腳本語言中編寫程式碼。本文作者曾在 Interleaf 工作，提到他們的 Lisp 就像在巨大的 C 蛋糕上最薄的一層糖霜。作者也提到他不懂 C 並且不想學習它，因此他幾乎不理解 Interleaf 的大部分軟體。此外，作者承認自己是個糟糕的員工，花費了大量時間在一個名為 On Lisp 的獨立專案上工作。**

## Hybrid search

Hybrid search 結合了 keyword search 和 vector search。為了使用 hybrid search，您需要將 `hybrid_search` 設定為 `True`。

```
neo4j_vector_hybrid = Neo4jVectorStore(
    username, password, url, embed_dim, hybrid_search=True
)
```

```
storage_context = StorageContext.from_defaults(
    vector_store=neo4j_vector_hybrid
)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
query_engine = index.as_query_engine()
response = query_engine.query("What happened at interleaf?")
display(Markdown(f"<b>{response}</b>"))
```

**在 Interleaf，他們新增了一種受 Emacs 啟發的腳本語言，並使其成為 Lisp 的一種方言。他們正在尋找一位 Lisp hacker 來在這個腳本語言中編寫程式碼。本文作者曾在 Interleaf 工作，但他因為不懂 C 且不想學習它，所以不理解大部分軟體。他也提到他們的 Lisp 就像在巨大的 C 蛋糕上最薄的一層糖霜。作者承認自己是個糟糕的員工，花費了大量時間在一個合約上工作，以發表 On Lisp。**

## 載入現有的 vector index

為了連接到現有的 vector index，您需要定義 `index_name` 和 `text_node_property` 參數：

- index\_name: 現有 vector index 的名稱（預設為 `vector`）
- text\_node\_property: 包含文字值的屬性名稱（預設為 `text`）

```
index_name = "existing_index"
text_node_property = "text"
existing_vector = Neo4jVectorStore(
    username,
    password,
    url,
    embed_dim,
    index_name=index_name,
    text_node_property=text_node_property,
)


loaded_index = VectorStoreIndex.from_vector_store(existing_vector)
```

## 自訂回應

您可以使用 `retrieval_query` 參數自訂從 knowledge graph 中檢索到的資訊。

檢索查詢必須回傳以下四個欄位：

- text:str - 回傳的文本 document
- score:str - 相似度分數
- id:str - node id
- metadata: Dict - 包含額外 metadata 的字典（必須包含 `_node_type` 和 `_node_content` 鍵）

```
retrieval_query = (
    "RETURN 'Interleaf hired Tomaz' AS text, score, node.id AS id, "
    "{author: 'Tomaz', _node_type:node._node_type, _node_content:node._node_content} AS metadata"
)
neo4j_vector_retrieval = Neo4jVectorStore(
    username, password, url, embed_dim, retrieval_query=retrieval_query
)
```

```
loaded_index = VectorStoreIndex.from_vector_store(
    neo4j_vector_retrieval
).as_query_engine()
response = loaded_index.query("What happened at interleaf?")
display(Markdown(f"<b>{response}</b>"))
```

**Interleaf 聘請了 Tomaz。**