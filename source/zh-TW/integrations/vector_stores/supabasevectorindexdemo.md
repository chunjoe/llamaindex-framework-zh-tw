---
title: "Supabase 向量資料庫"
---

在本筆 Notebook 中，我們將展示如何使用 [Vecs](https://supabase.github.io/vecs/) 在 LlamaIndex 中執行向量搜尋。
請參閱 [此指南](https://supabase.github.io/vecs/hosting/) 以獲取關於在 Supabase 上託管資料庫的說明。

如果您在 Colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-vector-stores-supabase
```

```
!pip install llama-index
```

```
import logging
import sys


# Uncomment to see debug logs
# logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)
# logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))


from llama_index.core import SimpleDirectoryReader, Document, StorageContext
from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.supabase import SupabaseVectorStore
import textwrap
```

### 設定 OpenAI

第一步是設定 OpenAI 金鑰。它將用於為載入到 index 中的 documents 建立 embeddings。

```
import os


os.environ["OPENAI_API_KEY"] = "[your_openai_api_key]"
```

下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

### 載入 documents

使用 SimpleDirectoryReader 載入儲存在 `./data/paul_graham/` 中的 documents。

```
documents = SimpleDirectoryReader("./data/paul_graham/").load_data()
print(
    "Document ID:",
    documents[0].doc_id,
    "Document Hash:",
    documents[0].doc_hash,
)
```

```
Document ID: fb056993-ee9e-4463-80b4-32cf9509d1d8 Document Hash: 77ae91ab542f3abb308c4d7c77c9bc4c9ad0ccd63144802b7cbe7e1bb3a4094e
```

### 建立一個由 Supabase vector store 支援的 index。

這將適用於所有支援 pgvector 的 Postgres provider。如果 collection 不存在，我們將嘗試建立一個新的 collection。

> 注意：如果未使用 OpenAI 的 text-embedding-ada-002，則需要傳入 embedding dimension，例如 `vector_store = SupabaseVectorStore(..., dimension=...)`。

```
vector_store = SupabaseVectorStore(
    postgres_connection_string=(
        "postgresql://<user>:<password>@<host>:<port>/<db_name>"
    ),
    collection_name="base_demo",
)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

### 查詢 index

我們現在可以使用我們的 index 來提問。

```
query_engine = index.as_query_engine()
response = query_engine.query("Who is the author?")
```

```
/Users/suo/miniconda3/envs/llama/lib/python3.9/site-packages/vecs/collection.py:182: UserWarning: Query does not have a covering index for cosine_distance. See Collection.create_index
  warnings.warn(
```

```
print(textwrap.fill(str(response), 100))
```

```
 The author of this text is Paul Graham.
```

```
response = query_engine.query("What did the author do growing up?")
```

```
print(textwrap.fill(str(response), 100))
```

```
 The author grew up writing essays, learning Italian, exploring Florence, painting people, working
with computers, attending RISD, living in a rent-stabilized apartment, building an online store
builder, editing Lisp expressions, publishing essays online, writing essays, painting still life,
working on spam filters, cooking for groups, and buying a building in Cambridge.
```

## 使用 metadata filters

```
from llama_index.core.schema import TextNode


nodes = [
    TextNode(
        **{
            "text": "The Shawshank Redemption",
            "metadata": {
                "author": "Stephen King",
                "theme": "Friendship",
            },
        }
    ),
    TextNode(
        **{
            "text": "The Godfather",
            "metadata": {
                "director": "Francis Ford Coppola",
                "theme": "Mafia",
            },
        }
    ),
    TextNode(
        **{
            "text": "Inception",
            "metadata": {
                "director": "Christopher Nolan",
            },
        }
    ),
]
```

```
vector_store = SupabaseVectorStore(
    postgres_connection_string=(
        "postgresql://<user>:<password>@<host>:<port>/<db_name>"
    ),
    collection_name="metadata_filters_demo",
)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex(nodes, storage_context=storage_context)
```

定義 metadata filters

```
from llama_index.core.vector_stores import ExactMatchFilter, MetadataFilters


filters = MetadataFilters(
    filters=[ExactMatchFilter(key="theme", value="Mafia")]
)
```

使用 filters 從 vector store 檢索

```
retriever = index.as_retriever(filters=filters)
retriever.retrieve("What is inception about?")
```

```
[NodeWithScore(node=Node(text='The Godfather', doc_id='f837ed85-aacb-4552-b88a-7c114a5be15d', embedding=None, doc_hash='f8ee912e238a39fe2e620fb232fa27ade1e7f7c819b6d5b9cb26f3dddc75b6c0', extra_info={'theme': 'Mafia', 'director': 'Francis Ford Coppola'}, node_info={'_node_type': '1'}, relationships={}), score=0.20671339734643313)]
```
