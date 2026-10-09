---
title: "Hnswlib"
---

Hnswlib 是一個快速的近似最近鄰搜尋索引。它是一個輕量級的、僅包含標頭檔的 C++ HNSW 實作，除了 C++11 之外沒有其他依賴項。Hnswlib 提供 python 綁定。

```
%pip install llama-index
%pip install llama-index-vector-stores-hnswlib
%pip install llama-index-embeddings-huggingface
%pip install hnswlib
```

### 匯入套件依賴項

```
from llama_index.vector_stores.hnswlib import HnswlibVectorStore
from llama_index.core import (
    VectorStoreIndex,
    StorageContext,
    SimpleDirectoryReader,
)
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
```

### 載入範例資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

### 讀取資料

```
documents = SimpleDirectoryReader("./data/paul_graham/").load_data()
print(f"Total documents: {len(documents)}")
print(f"First document, id: {documents[0].doc_id}")
print(f"First document, hash: {documents[0].hash}")
print(
    "First document, text"
    f" ({len(documents[0].text)} characters):\n{'='*20}\n{documents[0].text[:360]} ..."
)
```

### 載入嵌入模型

```
embed_model = HuggingFaceEmbedding(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    normalize=True,
)
```

### 從 Hnswlib.Index 參數建立 Hnswlib Vector Store 物件

```
hnswlib_vector_store = HnswlibVectorStore.from_params(
    space="ip",
    dimension=embed_model._model.get_sentence_embedding_dimension(),
    max_elements=1000,
)
```

或者，您可以自行建立一個 Hnswlib.Index 物件。

```
import hnswlib


index = hnswlib.Index(
    "ip", embed_model._model.get_sentence_embedding_dimension()
)
index.init_index(max_elements=1000)


hnswlib_vector_store = HnswlibVectorStore(index)
```

### 從 documents 建置索引

```
hnswlib_storage_context = StorageContext.from_defaults(
    vector_store=hnswlib_vector_store
)
hnswlib_index = VectorStoreIndex.from_documents(
    documents,
    storage_context=hnswlib_storage_context,
    embed_model=embed_model,
    show_progress=True,
)
```

### 查詢索引

```
k = 5
query = "Before college I wrote what begginers should write."
hnswlib_vector_retriever = hnswlib_index.as_retriever(similarity_top_k=k)
nodes_with_scores = nodes_with_scores = hnswlib_vector_retriever.retrieve(
    query
)
for node in nodes_with_scores:
    print(f"Node {node.id_} | Score: {node.score:.3f} - {node.text[:120]}...")
```
