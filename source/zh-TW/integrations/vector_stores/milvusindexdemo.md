---
title: "Milvus 向量儲存"
---

本指南演示如何使用 LlamaIndex 和 Milvus 建構一個 Retrieval-Augmented Generation (RAG) 系統。

RAG 系統結合了檢索系統與生成模型，根據給定的 prompt 生成新的文字。該系統首先使用像 Milvus 這樣的向量相似度搜尋引擎從資料庫中檢索相關的 documents，然後使用生成模型根據檢索到的 documents 生成新的文字。

[Milvus](https://milvus.io/) 是世界上最先進的開源向量資料庫，旨在為 embedding similarity search 和 AI 應用提供支援。

在本次筆記中，我們將快速演示如何使用 MilvusVectorStore。

## 開始之前

### 安裝依賴項

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-vector-stores-milvus
```

```
%pip install llama-index
```

此 Notebook 將使用 [Milvus Lite](https://milvus.io/docs/milvus_lite.md)，需要較新的 pymilvus 版本：

```
%pip install pymilvus>=2.4.2
```

> 如果您使用 Google Colab，要啟用剛安裝的依賴項，您可能需要**重新啟動執行階段**（點擊螢幕頂部的「Runtime」選單，然後從下拉選單中選擇「Restart session」）。

### 設定 OpenAI

首先，讓我們加入 openai api 金鑰。這將允許我們存取 chatgpt。

```
import openai


openai.api_key = "sk-***********"
```


### 準備資料

您可以使用以下指令下載範例資料：

```
! mkdir -p "data/"
! wget "https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt" -O "data/paul_graham_essay.txt"
! wget "https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/10k/uber_2021.pdf" -O "data/uber_2021.pdf"
```


## 開始使用

### 生成我們的資料

作為第一個範例，讓我們從檔案 `paul_graham_essay.txt` 生成一個 document。這是 Paul Graham 標題為 `What I Worked On` 的一篇單篇論文。為了生成 documents，我們將使用 SimpleDirectoryReader。

```
from llama_index.core import SimpleDirectoryReader


# load documents
documents = SimpleDirectoryReader(
    input_files=["./data/paul_graham_essay.txt"]
).load_data()


print("Document ID:", documents[0].doc_id)
```

```
Document ID: 95f25e4d-f270-4650-87ce-006d69d82033
```


### 建立跨資料的索引

現在我們有了 document，我們可以建立一個索引並插入 document。對於索引，我們將使用 MilvusVectorStore。MilvusVectorStore 接受幾個參數：

**基本參數**

- `uri (str, optional)`：連接的 URI，格式為 <https://address:port> 以供 Milvus 或 Zilliz Cloud 服務，或用於 lite 本地 Milvus 的 “path/to/local/milvus.db”。預設值為 ”./milvus\_llamaindex.db”。
- `token (str, optional)`：登入的 token。如果未使用 rbac 則為空，如果使用 rbac 則很可能是 “username:password”。
- `collection_name (str, optional)`：資料將儲存的集合名稱。預設值為 “llamalection”。
- `overwrite (bool, optional)`：是否覆蓋同名現有集合。預設值為 False。

**包含 doc id 和 text 的標量欄位**

- `doc_id_field (str, optional)`：集合中 doc\_id 的名稱。預設值為 DEFAULT\_DOC\_ID\_KEY。
- `text_key (str, optional)`：傳入集合中儲存的 key text。用於自帶集合。預設值為 DEFAULT\_TEXT\_KEY。
- `scalar_field_names (list, optional)`：將包含在集合 schema 中的額外標量欄位的名稱。
- `scalar_field_types (list, optional)`：額外標量欄位的類型。

**密集欄位 (dense field)**

- `enable_dense (bool)`：啟用或禁用密集 embedding 的布林標誌。預設值為 True。
- `dim (int, optional)`：集合中 embedding vector 的維度。在設定 enable\_sparse 為 False 時，需要此參數。
- `embedding_field (str, optional)`：集合中密集 embedding 的欄位名稱，預設值為 DEFAULT\_EMBEDDING\_KEY。
- `index_config (dict, optional)`：用於建立密集 embedding 索引的設定。預設值為 None。
- `search_config (dict, optional)`：用於搜尋 Milvus 密集索引的設定。請注意，這必須與 `index_config` 指定的索引類型相容。預設值為 None。
- `similarity_metric (str, optional)`：用於密集 embedding 的相似度度量。目前支援 IP、COSINE 和 L2。

**稀疏欄位 (sparse field)**

- `enable_sparse (bool)`：啟用或禁用稀疏 embedding 的布林標誌。預設值為 False。
- `sparse_embedding_field (str)`：稀疏 embedding 的欄位名稱，預設值為 DEFAULT\_SPARSE\_EMBEDDING\_KEY。- `sparse_embedding_function (Union[BaseSparseEmbeddingFunction, BaseMilvusBuiltInFunction], optional)`：如果 enable\_sparse 為 True，此物件應提供以將文字轉換為稀疏嵌入。如果為 None，將使用預設的稀疏嵌入函式 (BM25BuiltInFunction)。
- `sparse_index_config (dict, optional)`：用於建構稀疏嵌入索引的設定。預設為 None。

**hybrid ranker**

- `hybrid_ranker (str)`：指定在 hybrid search 查詢中使用哪種 ranker。目前僅支援 \[“RRFRanker”, “WeightedRanker”]。預設為 “RRFRanker”。

- `hybrid_ranker_params (dict, optional)`：hybrid ranker 的設定參數。此字典的結構取決於使用的特定 ranker：

  - 對於 “RRFRanker”，應包含：
    - “k” (int)：Reciprocal Rank Fusion (RRF) 中使用的參數。此值用於計算 rank scores，作為 RRF 演算法的一部分，將多種排序策略合併為單一分數以提高搜尋相關性。

  - 對於 “WeightedRanker”，它期望：

    - “weights” (list of float)：一個包含兩個權重的列表：

      1. 密集嵌入組件的權重。
      2. 稀疏嵌入組件的權重。這些權重用於調整混合檢索過程中密集和稀疏嵌入組件的重要性。預設為一個空字典，表示 ranker 將使用其預定義的 default settings 運作。

**others**

- `collection_properties (dict, optional)`：集合屬性，如 TTL (Time-To-Live) 和 MMAP (memory mapping)。預設為 None。它可能包含：

  - “collection.ttl.seconds” (int)：設定此屬性後，當前集合中的資料將在指定的時間後過期。集合中過期的資料將會被清理，並且不會參與搜尋或查詢。
  - “mmap.enabled” (bool)：是否在集合層級啟用 memory-mapped storage。

- `index_management (IndexManagement)`：指定要使用的索引管理策略。預設為 “create\_if\_not\_exists”。

- `batch_size (int)`：配置在將資料插入 Milvus 時，每個批次中要處理的 documents 數量。預設為 DEFAULT\_BATCH\_SIZE。

- `consistency_level (str, optional)`：用於新建立集合的一致性級別。預設為 “Session”。
```
# Create an index over the documents
from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.vector_stores.milvus import MilvusVectorStore




vector_store = MilvusVectorStore(
    uri="./milvus_demo.db", dim=1536, overwrite=True
)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

> 對於 `MilvusVectorStore` 的參數：
>
> - 將 `uri` 設定為本地檔案，例如 `./milvus.db`，是最方便的方法，因為它會自動利用 [Milvus Lite](https://milvus.io/docs/milvus_lite.md) 將所有資料儲存到此檔案中。
> - 如果您有大量資料，可以設定一個在 [docker 或 kubernetes](https://milvus.io/docs/quickstart.md) 上更高效的 Milvus 伺服器。在此設定中，請將伺服器 URI，例如 `http://localhost:19530`，作為您的 `uri`。
> - 如果您想使用 [Zilliz Cloud](https://zilliz.com/cloud)，用於 Milvus 的全託管雲端服務，請調整 `uri` 和 `token`，它們對應於 Zilliz Cloud 中的 [Public Endpoint 和 Api key](https://docs.zilliz.com/docs/on-zilliz-cloud-console#free-cluster-details)。

### 查詢資料

現在我們在索引中儲存了我們的 document，我們可以對索引提出問題。索引將使用儲存在自身的資料作為 chatgpt 的知識庫。

```
query_engine = index.as_query_engine()
res = query_engine.query("What did the author learn?")
print(res)
```

```
The author learned that philosophy courses in college were boring to him, leading him to switch his focus to studying AI.
```

```
res = query_engine.query(
    "What challenges did the disease pose for the author?"
)
print(res)
```

```
The disease posed challenges for the author as it affected his mother's health, leading to a stroke caused by colon cancer. This resulted in her losing her balance and needing to be placed in a nursing home. The author and his sister were determined to help their mother get out of the nursing home and back to her house.
```

下一個測試顯示覆蓋會移除先前的資料。

```
from llama_index.core import Document




vector_store = MilvusVectorStore(
    uri="./milvus_demo.db", dim=1536, overwrite=True
)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    [Document(text="The number that is being searched for is ten.")],
    storage_context,
)
query_engine = index.as_query_engine()
res = query_engine.query("Who is the author?")
print(res)
```

```
The author is the individual who created the context information.
```

下一個測試顯示向現有索引中新增額外資料。

```
del index, vector_store, storage_context, query_engine


vector_store = MilvusVectorStore(uri="./milvus_demo.db", overwrite=False)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
query_engine = index.as_query_engine()
res = query_engine.query("What is the number?")
print(res)
```

```
The number is ten.
```

```
res = query_engine.query("Who is the author?")
print(res)
```

```
Paul Graham
```

## Metadata filtering

我們可以透過過濾特定來源來產生結果。以下範例說明如何從目錄載入所有 documents，然後根據 metadata 進行過濾。

```
from llama_index.core.vector_stores import ExactMatchFilter, MetadataFilters


# Load all the two documents loaded before
documents_all = SimpleDirectoryReader("./data/").load_data()


vector_store = MilvusVectorStore(
    uri="./milvus_demo.db", dim=1536, overwrite=True
)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(documents_all, storage_context)
```

我們只想從檔案 `uber_2021.pdf` 中檢索 documents。

```
filters = MetadataFilters(
    filters=[ExactMatchFilter(key="file_name", value="uber_2021.pdf")]
)
query_engine = index.as_query_engine(filters=filters)
res = query_engine.query(
    "What challenges did the disease pose for the author?"
)


print(res)
```

```
The disease posed challenges related to the adverse impact on the business and operations, including reduced demand for Mobility offerings globally, affecting travel behavior and demand. Additionally, the pandemic led to driver supply constraints, impacted by concerns regarding COVID-19, with uncertainties about when supply levels would return to normal. The rise of the Omicron variant further affected travel, resulting in advisories and restrictions that could adversely impact both driver supply and consumer demand for Mobility offerings.
```

當從檔案 `paul_graham_essay.txt` 檢索時，我們得到不同的結果。

```
filters = MetadataFilters(
    filters=[ExactMatchFilter(key="file_name", value="paul_graham_essay.txt")]
)
query_engine = index.as_query_engine(filters=filters)
res = query_engine.query(
    "What challenges did the disease pose for the author?"
)


print(res)
```

```
The disease posed challenges for the author as it affected his mother's health, leading to a stroke caused by colon cancer. This resulted in his mother losing her balance and needing to be placed in a nursing home. The author and his sister were determined to help their mother get out of the nursing home and back to her house.
```
