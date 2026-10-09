---
title: "Milvus 向量資料庫與全文檢索"
---

**全文檢索** 使用精確的關鍵字匹配，通常利用像 BM25 這樣的演算法來根據相關性對 documents 進行排序。在 **Retrieval-Augmented Generation (RAG)** 系統中，此方法會檢索相關文本以增強 AI 生成的回應。

同時，**語義檢索 (semantic search)** 解釋上下文含義以提供更廣泛的結果。結合這兩種方法會創造一種 **hybrid search**，以改善資訊檢索——尤其是在單一方法力不從心時。

使用 [Milvus 2.5](https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md) 的 Sparse-BM25 方法，原始文本會自動轉換為 sparse vectors。這消除了手動生成 sparse embedding 的需求，並實現了混合檢索策略，在語義理解和關鍵字相關性之間取得平衡。

在本教學中，您將學習如何使用 LlamaIndex 和 Milvus 來使用全文檢索和混合檢索建立一個 RAG 系統。我們將從單獨實作全文檢索開始，然後透過整合語義檢索來增強它，以獲得更全面的結果。

> 在繼續本教學之前，請確保您熟悉 [全文檢索](https://milvus.io/docs/full-text-search.md#Full-Text-Search) 以及 [使用 Milvus 在 LlamaIndex 中的基本知識](https://milvus.io/docs/integrate_with_llamaindex.md)。

## 先決條件

**安裝依賴項**

在開始之前，請確保已安裝以下依賴項：

```
%pip install llama-index-vector-stores-milvus
%pip install llama-index-embeddings-openai
%pip install llama-index-llms-openai
```

> 如果您使用 Google Colab，您可能需要 **重新啟動執行階段**（導航到介面頂部的「Runtime」選單，從下拉選單中選擇「Restart session」）。

**設定帳戶**

本教學使用 OpenAI 進行文本嵌入和答案生成。您需要準備 [OpenAI API key](https://platform.openai.com/api-keys)。

```
import openai


openai.api_key = "sk-"
```

要使用 Milvus vector store，請指定您的 Milvus server `URI`（可選擇性地使用 `TOKEN`）。要啟動 Milvus server，您可以透過遵循 [Milvus 安裝指南](https://milvus.io/docs/install-overview.md) 來設定 Milvus server，或直接嘗試 [Zilliz Cloud](https://docs.zilliz.com/docs/register-with-zilliz-cloud) 進行免費試用。

> 目前，Full-text search 在 Milvus Standalone、Milvus Distributed 和 Zilliz Cloud 中支援，但在 Milvus Lite（計劃在未來實作）中尚未支援。如需更多資訊，請聯繫 <support@zilliz.com>。

```
URI = "http://localhost:19530"
# TOKEN = ""
```

**下載範例資料**

執行以下指令將範例 documents 下載到 “data/paul\_graham” 目錄中：

```
%mkdir -p 'data/paul_graham/'
%wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

```
--2025-03-27 07:49:01--  https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt
Resolving raw.githubusercontent.com (raw.githubusercontent.com)... 185.199.108.133, 185.199.109.133, 185.199.110.133, ...
Connecting to raw.githubusercontent.com (raw.githubusercontent.com)|185.199.108.133|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 75042 (73K) [text/plain]
Saving to: ‘data/paul_graham/paul_graham_essay.txt’


data/paul_graham/pa 100%[===================>]  73.28K  --.-KB/s    in 0.07s


2025-03-27 07:49:01 (1.01 MB/s) - ‘data/paul_graham/paul_graham_essay.txt’ saved [75042/75042]
```


## 使用全文檢索的 RAG

將全文檢索整合到 RAG 系統中，可以平衡語義檢索與精確且可預測的基於關鍵字的檢索。您也可以選擇僅使用全文檢索，儘管建議將全文檢索與語義檢索結合以獲得更好的檢索結果。為了示範目的，我們將展示單獨的全文檢索和混合檢索。

要開始，使用 `SimpleDirectoryReaderLoad` 載入 Paul Graham 的文章 “What I Worked On”：

```
from llama_index.core import SimpleDirectoryReader


documents = SimpleDirectoryReader("./data/paul_graham/").load_data()


# Let's take a look at the first document
print("Example document:\n", documents[0])
```

```
Example document:
 Doc ID: 16b7942f-bf1a-4197-85e1-f31d51ea25a9
Text: What I Worked On  February 2021  Before college the two main
things I worked on, outside of school, were writing and programming. I
didn't write essays. I wrote what beginning writers were supposed to
write then, and probably still are: short stories. My stories were
awful. They had hardly any plot, just characters with strong feelings,
which I ...
```


### 使用 BM25 的全文檢索

LlamaIndex 的 `MilvusVectorStore` 支援全文檢索，實現了高效的基於關鍵字的檢索。透過將內建函數作為 `sparse_embedding_function`，它對搜尋結果應用 BM25 評分來進行排序。

在本節中，我們將演示如何使用 BM25 實作一個使用 BM25 進行全文檢索的 RAG 系統。

```
from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.vector_stores.milvus import MilvusVectorStore
from llama_index.vector_stores.milvus.utils import BM25BuiltInFunction
from llama_index.core import Settings


# Skip dense embedding model
Settings.embed_model = None


# Build Milvus vector store creating a new collection
vector_store = MilvusVectorStore(
    uri=URI,
    # token=TOKEN,
    enable_dense=False,
    enable_sparse=True,  # Only enable sparse to demo full text search
    sparse_embedding_function=BM25BuiltInFunction(),
    overwrite=True,
)


# Store documents in Milvus
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

```
Embeddings have been explicitly disabled. Using MockEmbedding.
```


上述程式碼將範例 documents 插入到 Milvus 中，並建立一個索引以啟用全文檢索的 BM25 排序。它會禁用 dense embedding 並使用 `BM25BuiltInFunction` 及其預設參數。

您可以指定 `BM25BuiltInFunction` 參數中的輸入和輸出欄位：

- `input_field_names (str)`：輸入文本欄位（預設值: “text”）。它指示 BM25 演算法應用於哪個文本欄位。如果使用您自己的集合並使用不同的文本欄位名稱，請更改此設定。
- `output_field_names (str)`：儲存此 BM25 函數輸出的欄位（預設值: “sparse\_embedding”）。一旦向量資料庫設定完成，您可以使用 Milvus 搭配查詢模式 “sparse” 或 “text\_search” 執行全文檢索查詢：

```
import textwrap


query_engine = index.as_query_engine(
    vector_store_query_mode="sparse", similarity_top_k=5
)
answer = query_engine.query("What did the author learn at Viaweb?")
print(textwrap.fill(str(answer), 100))
```

```
The author learned several important lessons at Viaweb. They learned about the importance of growth
rate as the ultimate test of a startup, the value of building stores for users to understand retail
and software usability, and the significance of being the "entry level" option in a market.
Additionally, they discovered the accidental success of making Viaweb inexpensive, the challenges of
hiring too many people, and the relief felt when the company was acquired by Yahoo.
```

#### 自訂文本分析器

分析器在全文檢索中扮演重要角色，它將句子分解成 tokens 並執行詞彙處理，例如 stemming 和 stop-word removal。它們通常是特定於語言的。欲了解更多詳情，請參閱 [Milvus Analyzer Guide](https://milvus.io/docs/analyzer-overview.md#Analyzer-Overview)。

Milvus 支援兩種分析器：**Built-in Analyzers** 和 **Custom Analyzers**。預設情況下，`BM25BuiltInFunction` 使用標準的 built-in analyzer，它根據標點符號對文本進行 tokenization。

若要使用不同的分析器或自訂現有的分析器，您可以向 `analyzer_params` 參數傳遞值：

```
bm25_function = BM25BuiltInFunction(
    analyzer_params={
        "tokenizer": "standard",
        "filter": [
            "lowercase",  # Built-in filter
            {"type": "length", "max": 40},  # Custom cap size of a single token
            {"type": "stop", "stop_words": ["of", "to"]},  # Custom stopwords
        ],
    },
    enable_match=True,
)
```

### 結合 Reranker 的混合檢索

混合檢索系統結合了 semantic search 和 full-text search，在 RAG 系統中優化檢索效能。

以下範例使用 OpenAI embedding 進行 semantic search，並使用 BM25 進行 full-text search：

```
# Create index over the documnts
vector_store = MilvusVectorStore(
    uri=URI,
    # token=TOKEN,
    # enable_dense=True,  # enable_dense defaults to True
    dim=1536,
    enable_sparse=True,
    sparse_embedding_function=BM25BuiltInFunction(),
    overwrite=True,
    # hybrid_ranker="RRFRanker",  # hybrid_ranker defaults to "RRFRanker"
    # hybrid_ranker_params={},  # hybrid_ranker_params defaults to {}
)


storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents,
    storage_context=storage_context,
    embed_model="default",  # "default" will use OpenAI embedding
)
```

**運作方式**

此方法將 documents 儲存在一個 Milvus collection 中，包含兩個向量欄位：

- `embedding`：由 OpenAI embedding model 生成的用於 semantic search 的密集 embedding。
- `sparse_embedding`：使用 BM25BuiltInFunction 計算的用於全文檢索的稀疏 embedding。

此外，我們應用了使用 “RRFRanker” 及其預設參數的 reranking 策略。若要自訂 reranker，您可以依照 [Milvus Reranking Guide](https://milvus.io/docs/reranking.md) 配置 `hybrid_ranker` 和 `hybrid_ranker_params`。

現在，讓我們使用一個範例查詢來測試 RAG 系統：

```
# Query
query_engine = index.as_query_engine(
    vector_store_query_mode="hybrid", similarity_top_k=5
)
answer = query_engine.query("What did the author learn at Viaweb?")
print(textwrap.fill(str(answer), 100))
```

```
The author learned several important lessons at Viaweb. These included the importance of
understanding growth rate as the ultimate test of a startup, the impact of hiring too many people,
the challenges of being at the mercy of investors, and the relief experienced when Yahoo bought the
company. Additionally, the author learned about the significance of user feedback, the value of
building stores for users, and the realization that growth rate is crucial for the long-term success
of a startup.
```

這種混合方法透過利用 semantic 和 keyword-based retrieval，在 RAG 系統中確保更準確、更具上下文意識的回應。