---
title: "Isaacus Embeddings"
---

`llama-index-embeddings-isaacus` 套件包含用於建構使用 Isaacus legal AI embedding model 的應用程式的 LlamaIndex 整合。此整合讓您可以輕鬆連接並使用 **Kanon 2 Embedder**——全球最準確的法律 embedding model，該模型可在 [Massive Legal Embedding Benchmark (MLEB)](https://isaacus.com/blog/introducing-mleb) 上進行測試。

Isaacus embeddings 支援針對特定任務的優化：

- `task="retrieval/query"`：為搜尋查詢優化 embeddings
- `task="retrieval/document"`：為 documents 進行索引優化

在本筆筆記中，我們將演示如何使用 Isaacus Embeddings 進行法律 document 檢索。

## 安裝

安裝必要的整合。

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-embeddings-isaacus
%pip install llama-index-llms-openai
```

```
%pip install llama-index
```

## 設定

### 取得您的 Isaacus API 金鑰

1. 在 [Isaacus Platform](https://platform.isaacus.com/accounts/signup/) 建立帳戶
2. 增加一個 [payment method](https://platform.isaacus.com/billing/) 以領取您的 [free credits](https://docs.isaacus.com/pricing/credits)
3. 建立一個 [API key](https://platform.isaacus.com/users/api-keys/)

```
import os


# Set your Isaacus API key
isaacus_api_key = "YOUR_ISAACUS_API_KEY"
os.environ["ISAACUS_API_KEY"] = isaacus_api_key
```

## 基本用法

### 取得單一 Embedding

```
from llama_index.embeddings.isaacus import IsaacusEmbedding


# Initialize the Isaacus Embedding model
embed_model = IsaacusEmbedding(
    api_key=isaacus_api_key,
    model="kanon-2-embedder",
)


# Get a single embedding
embedding = embed_model.get_text_embedding(
    "This agreement shall be governed by the laws of Delaware."
)


print(f"Embedding dimension: {len(embedding)}")
print(f"First 5 values: {embedding[:5]}")
```

### 取得批次 Embeddings

```
# Get embeddings for multiple legal texts
legal_texts = [
    "The parties agree to binding arbitration.",
    "Confidential information shall not be disclosed.",
    "This contract may be terminated with 30 days notice.",
]


embeddings = embed_model.get_text_embedding_batch(legal_texts)


print(f"Number of embeddings: {len(embeddings)}")
print(f"Each embedding has {len(embeddings[0])} dimensions")
```

## 針對特定任務的 Embeddings

Isaacus embeddings 支援不同的任務以達到最佳效能：

- **`retrieval/document`**：用於為 documents 進行索引
- **`retrieval/query`**：用於搜尋查詢

使用適當的任務可以提高檢索準確度。

```
# For documents (use when indexing)
doc_embed_model = IsaacusEmbedding(
    api_key=isaacus_api_key,
    task="retrieval/document",
)


doc_embedding = doc_embed_model.get_text_embedding(
    "The Company has the right to terminate this agreement."
)


print(f"Document embedding dimension: {len(doc_embedding)}")
```

```
# For queries (automatically used by get_query_embedding)
query_embedding = embed_model.get_query_embedding(
    "What are the termination conditions?"
)


print(f"Query embedding dimension: {len(query_embedding)}")
```

## 維度降低

您可以降低 embedding 的維度，以加快搜尋速度並降低儲存成本：

```
# Use reduced dimensions (default is 1792)
embed_model_512 = IsaacusEmbedding(
    api_key=isaacus_api_key,
    dimensions=512,
)


embedding_512 = embed_model_512.get_text_embedding("Legal text example")


print(f"Reduced embedding dimension: {len(embedding_512)}")
```

## 完整的 RAG 範例與法律 Documents

現在讓我們使用 Isaacus embeddings 和法律 document（Uber 的 10-K SEC 報告）建立一個完整的 RAG pipeline。

```
import logging
import sys


logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))


from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.llms.openai import OpenAI
from llama_index.core.response.notebook_utils import display_source_node
from IPython.display import Markdown, display
```

### 下載法律 Document 資料

我們將使用 Uber 的 10-K SEC 報告，其中包含法律和監管資訊——非常適合展示 Kanon 2 的法律領域專業知識。

```
!mkdir -p 'data/10k/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/10k/uber_2021.pdf' -O 'data/10k/uber_2021.pdf'
```

### 載入法律 Document

```
documents = SimpleDirectoryReader("./data/10k/").load_data()
print(f"Loaded {len(documents)} document(s)")
```

### 使用 Document 任務建立索引

在建立索引時，我們在 `task="retrieval/document"` 中使用它來優化 embeddings 以便 document 儲存。

```
# Initialize embedding model for documents
embed_model = IsaacusEmbedding(
    api_key=isaacus_api_key,
    model="kanon-2-embedder",
    task="retrieval/document",
)


# Build the index
index = VectorStoreIndex.from_documents(
    documents=documents,
    embed_model=embed_model,
)
```

### 使用法律問題進行查詢

現在我們將使用法律特定的問題來查詢索引。請注意，`get_query_embedding` 會自動使用 `task="retrieval/query"` 以獲得最佳查詢效能。

```
# Create a retriever
retriever = index.as_retriever(similarity_top_k=3)


# Query about risk factors
retrieved_nodes = retriever.retrieve(
    "What are the main risk factors mentioned in the document?"
)


print(f"Retrieved {len(retrieved_nodes)} nodes\n")


for i, node in enumerate(retrieved_nodes):
    print(f"\n--- Node {i+1} (Score: {node.score:.4f}) ---")
    display_source_node(node, source_length=500)
```

### 查詢法律訴訟相關問題

```
# Query about legal proceedings
retrieved_nodes = retriever.retrieve(
    "What legal proceedings or litigation is the company involved in?"
)


print(f"Retrieved {len(retrieved_nodes)} nodes\n")


for i, node in enumerate(retrieved_nodes):
    print(f"\n--- Node {i+1} (Score: {node.score:.4f}) ---")
    display_source_node(node, source_length=500)
```

### 使用 LLM 建立查詢引擎

將 Isaacus embeddings 與 LLM 結合，以實現完整的問答：

```
import os


# Set your OpenAI API key
openai_api_key = "YOUR_OPENAI_API_KEY"
os.environ["OPENAI_API_KEY"] = openai_api_key
```

```
# Set up LLM
llm = OpenAI(model="gpt-4o-mini", temperature=0)


# Create query engine
query_engine = index.as_query_engine(
    llm=llm,
    similarity_top_k=5,
)


# Ask a legal question
response = query_engine.query(
    "What are the company's main regulatory and legal risks?"
)


display(Markdown(f"**Answer:** {response}"))
```

### 另一個法律查詢

```
response = query_engine.query(
    "What intellectual property does the company rely on?"
)


display(Markdown(f"**Answer:** {response}"))
```

## 異步用法

Isaacus embeddings 也支援異步操作，以在異步應用程式中獲得更好的效能：

```
import asyncio




async def get_embeddings_async():
    embed_model = IsaacusEmbedding(
        api_key=isaacus_api_key,
    )


    # Get async single embedding
    embedding = await embed_model.aget_text_embedding(
        "Async legal document text"
    )


    # Get async batch embeddings
    embeddings = await embed_model.aget_text_embedding_batch(
        ["Text 1", "Text 2", "Text 3"]
    )


    return embedding, embeddings




# Run async function
embedding, embeddings = await get_embeddings_async()


print(f"Async single embedding dimension: {len(embedding)}")
print(
    f"Async batch: {len(embeddings)} embeddings of {len(embeddings[0])} dimensions each"
)
```

## 總結

在本筆筆記中，我們演示了：

1. **基本用法** - 取得單一和批次 embeddings
2. **針對特定任務的優化** - 使用 `retrieval/document` 進行索引和 `retrieval/query` 進行搜尋
3. **維度降低** - 降低 embedding 大小以提高效率
4. **法律 RAG pipeline** - 使用法律 documents（Uber 10-K）建立完整的檢索系統
5. **異步操作** - 使用異步方法以獲得更好的效能

Kanon 2 Embedder 在法律 document 的理解和檢索方面表現出色，使其成為法律科技應用、合規工具、合約分析等的理想選擇。

## 額外資源

- [Isaacus Documentation](https://docs.isaacus.com/)
- [Kanon 2 Embedder Announcement](https://isaacus.com/blog/introducing-kanon-2-embedder)
- [Massive Legal Embedding Benchmark (MLEB)](https://isaacus.com/blog/introducing-mleb)
- [Isaacus Platform](https://platform.isaacus.com/)