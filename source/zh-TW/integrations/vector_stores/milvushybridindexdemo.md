---
title: "Milvus 向量資料庫與混合搜尋"
---

混合搜尋結合語意檢索與關鍵字比對的優點，能提供更準確且更符合上下文的結果。由於同時運用語意搜尋和關鍵字比對，混合搜尋特別適合複雜的資訊檢索工作。

這份筆記示範如何在 LlamaIndex RAG 管線中使用 Milvus 進行混合搜尋。我們會先介紹建議的預設混合搜尋方式（語意搜尋 + BM25），再探索其他稀疏嵌入方法，以及如何自訂混合重排器。

## 前置需求

**安裝相依套件**

開始前，請先安裝以下相依套件：

```
! pip install llama-index-vector-stores-milvus
! pip install llama-index-embeddings-openai
! pip install llama-index-llms-openai
```

> 如果您使用 Google Colab，可能需要**重新啟動執行階段**（開啟介面上方的「Runtime」選單，再從下拉選單選擇「Restart session」。）

**設定帳戶**

本教學使用 OpenAI 產生文字嵌入與回答。請先準備 [OpenAI API 金鑰](https://platform.openai.com/api-keys)。

```
import openai


openai.api_key = "sk-"
```

使用 Milvus 向量儲存區時，請指定 Milvus 伺服器的 `URI`，也可以選擇提供 `TOKEN`。若要啟動 Milvus 伺服器，請依照 [Milvus 安裝指南](https://milvus.io/docs/install-overview.md)設定，或免費試用 [Zilliz Cloud](https://docs.zilliz.com/docs/register-with-zilliz-cloud)。

> 目前 Milvus Standalone、Milvus Distributed 和 Zilliz Cloud 支援全文搜尋；Milvus Lite 尚未支援，預計未來才會實作。如需更多資訊，請聯絡 <support@zilliz.com>。

```
URI = "http://localhost:19530"
# TOKEN = ""
```

**載入範例資料**

執行以下指令，將範例文件下載到「data/paul\_graham」資料夾：

```
! mkdir -p 'data/paul_graham/'
! wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

接著使用 `SimpleDirectoryReaderLoad` 載入 Paul Graham 的文章〈What I Worked On〉：

```
from llama_index.core import SimpleDirectoryReader


documents = SimpleDirectoryReader("./data/paul_graham/").load_data()


# Let's take a look at the first document
print("Example document:\n", documents[0])
```

```
Example document:
 Doc ID: f9cece8c-9022-46d8-9d0e-f29d70e1dbbe
Text: What I Worked On  February 2021  Before college the two main
things I worked on, outside of school, were writing and programming. I
didn't write essays. I wrote what beginning writers were supposed to
write then, and probably still are: short stories. My stories were
awful. They had hardly any plot, just characters with strong feelings,
which I ...
```

## 使用 BM25 進行混合搜尋

本節示範如何使用 BM25 執行混合搜尋。首先初始化 `MilvusVectorStore`，並為範例文件建立索引。預設設定如下：

- 使用預設嵌入模型（OpenAI 的 `text-embedding-ada-002`）產生密集嵌入。
- 當 enable\_sparse 為 True 時，使用 BM25 執行全文搜尋。
- 啟用混合搜尋時，使用 k=60 的 RRFRanker 合併結果。

```
# Create an index over the documnts
from llama_index.vector_stores.milvus import MilvusVectorStore
from llama_index.core import StorageContext, VectorStoreIndex




vector_store = MilvusVectorStore(
    uri=URI,
    # token=TOKEN,
    dim=1536,  # vector dimension depends on the embedding model
    enable_sparse=True,  # enable the default full-text search using BM25
    overwrite=True,  # drop the collection if it already exists
)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

```
2025-04-17 03:38:16,645 [DEBUG][_create_connection]: Created new connection using: cf0f4df74b18418bb89ec512063c1244 (async_milvus_client.py:547)
Sparse embedding function is not provided, using default.
Default sparse embedding function: BM25BuiltInFunction(input_field_names='text', output_field_names='sparse_embedding').
```

以下說明 `MilvusVectorStore` 中用來設定密集與稀疏欄位的參數：

**密集向量欄位**

- `enable_dense (bool)`：用來啟用或停用密集嵌入的布林旗標，預設為 True。
- `dim (int, optional)`：此 collection 中嵌入向量的維度。
- `embedding_field (str, optional)`：collection 的密集嵌入欄位名稱，預設為 DEFAULT\_EMBEDDING\_KEY。
- `index_config (dict, optional)`：建立密集嵌入索引時使用的設定，預設為 None。
- `search_config (dict, optional)`：搜尋 Milvus 密集索引時使用的設定。此設定必須與 `index_config` 指定的索引類型相容，預設為 None。
- `similarity_metric (str, optional)`：密集嵌入使用的相似度度量，目前支援 IP、COSINE 和 L2。

**稀疏向量欄位**

- `enable_sparse (bool)`：用來啟用或停用稀疏嵌入的布林旗標，預設為 False。
- `sparse_embedding_field (str)`：稀疏嵌入欄位名稱，預設為 DEFAULT\_SPARSE\_EMBEDDING\_KEY。
- `sparse_embedding_function (Union[BaseSparseEmbeddingFunction, BaseMilvusBuiltInFunction], optional)`：當 enable\_sparse 為 True 時，請提供此物件，將文字轉換為稀疏嵌入。若為 None，預設會使用 BM25BuiltInFunction；若現有 collection 未使用內建函式，也可以使用 BGEM3SparseEmbedding。
- `sparse_index_config (dict, optional)`：建立稀疏嵌入索引時使用的設定，預設為 None。

若要在查詢時啟用混合搜尋，請將 `vector_store_query_mode` 設為 “hybrid”。系統會合併語意搜尋與全文搜尋的結果，再重新排序。以下用範例查詢測試：「What did the author learn at Viaweb?」

```
import textwrap


query_engine = index.as_query_engine(
    vector_store_query_mode="hybrid", similarity_top_k=5
)
response = query_engine.query("What did the author learn at Viaweb?")
print(textwrap.fill(str(response), 100))
```

```
The author learned about retail, the importance of user feedback, and the significance of growth
rate as the ultimate test of a startup at Viaweb.
```

### 自訂文字分析器

分析器在全文搜尋中負責將句子切分為 token，並執行詞幹提取、停用詞移除等詞彙處理；分析器通常依語言而異。詳情請參閱 [Milvus 分析器指南](https://milvus.io/docs/analyzer-overview.md#Analyzer-Overview)。

Milvus 支援兩種分析器：**內建分析器**與**自訂分析器**。預設情況下，若將 `enable_sparse` 設為 True，`MilvusVectorStore` 會使用預設設定的 `BM25BuiltInFunction`，並採用依標點符號切分文字的標準內建分析器。

若要使用其他分析器或自訂現有分析器，可在 `analyzer_params` 參數中指定值，設定 `BM25BuiltInFunction`。接著將此函式設為 `sparse_embedding_function`，並套用至 `MilvusVectorStore`。

```
from llama_index.vector_stores.milvus.utils import BM25BuiltInFunction


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


vector_store = MilvusVectorStore(
    uri=URI,
    # token=TOKEN,
    dim=1536,
    enable_sparse=True,
    sparse_embedding_function=bm25_function,  # BM25 with custom analyzer
    overwrite=True,
)
```

```
2025-04-17 03:38:48,085 [DEBUG][_create_connection]: Created new connection using: 61afd81600cb46ee89f887f16bcbfe55 (async_milvus_client.py:547)
```

## 使用其他稀疏嵌入進行混合搜尋

除了結合語意搜尋與 BM25，Milvus 也支援使用稀疏嵌入函式進行混合搜尋，例如 [BGE-M3](https://arxiv.org/abs/2402.03216)。以下範例使用內建的 `BGEM3SparseEmbeddingFunction` 產生稀疏嵌入。

首先安裝 `FlagEmbedding` 套件：

```
! pip install -q FlagEmbedding
```

接著建立向量儲存區與索引：密集嵌入使用預設的 OpenAI 模型，稀疏嵌入則使用內建的 BGE-M3：

```
from llama_index.vector_stores.milvus.utils import BGEM3SparseEmbeddingFunction


vector_store = MilvusVectorStore(
    uri=URI,
    # token=TOKEN,
    dim=1536,
    enable_sparse=True,
    sparse_embedding_function=BGEM3SparseEmbeddingFunction(),
    overwrite=True,
)


storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

```
Fetching 30 files: 100%|██████████| 30/30 [00:00<00:00, 68871.99it/s]
2025-04-17 03:39:02,074 [DEBUG][_create_connection]: Created new connection using: ff4886e2f8da44e08304b748d9ac9b51 (async_milvus_client.py:547)
Chunks: 100%|██████████| 1/1 [00:00<00:00,  1.07it/s]
```

接著使用範例問題執行混合搜尋：

```
query_engine = index.as_query_engine(
    vector_store_query_mode="hybrid", similarity_top_k=5
)
response = query_engine.query("What did the author learn at Viaweb??")
print(textwrap.fill(str(response), 100))
```

```
Chunks: 100%|██████████| 1/1 [00:00<00:00, 17.29it/s]




The author learned about retail, the importance of user feedback, the value of growth rate in a
startup, the significance of pricing strategy, the benefits of working on things that weren't
prestigious, and the challenges and rewards of running a startup.
```

### 自訂稀疏嵌入函式

只要繼承 `BaseSparseEmbeddingFunction`，您也可以自訂稀疏嵌入函式，並實作以下方法：

- `encode_queries`：將文字轉換為查詢用的稀疏嵌入清單。
- `encode_documents`：將文字轉換為文件用的稀疏嵌入清單。

每個方法的輸出都應符合稀疏嵌入格式，也就是由字典組成的清單。每個字典以整數作為維度的 key，並以浮點數作為該維度的嵌入權重值（例如 {1: 0.5, 2: 0.3}）。

以下示範如何使用 BGE-M3 實作自訂稀疏嵌入函式：

```
from FlagEmbedding import BGEM3FlagModel
from typing import List
from llama_index.vector_stores.milvus.utils import BaseSparseEmbeddingFunction




class ExampleEmbeddingFunction(BaseSparseEmbeddingFunction):
    def __init__(self):
        self.model = BGEM3FlagModel("BAAI/bge-m3", use_fp16=False)


    def encode_queries(self, queries: List[str]):
        outputs = self.model.encode(
            queries,
            return_dense=False,
            return_sparse=True,
            return_colbert_vecs=False,
        )["lexical_weights"]
        return [self._to_standard_dict(output) for output in outputs]


    def encode_documents(self, documents: List[str]):
        outputs = self.model.encode(
            documents,
            return_dense=False,
            return_sparse=True,
            return_colbert_vecs=False,
        )["lexical_weights"]
        return [self._to_standard_dict(output) for output in outputs]


    def _to_standard_dict(self, raw_output):
        result = {}
        for k in raw_output:
            result[int(k)] = raw_output[k]
        return result
```

## 自訂混合重排器

Milvus 支援兩種[重排策略](https://milvus.io/docs/reranking.md)：倒數排名融合（RRF）與加權評分。`MilvusVectorStore` 混合搜尋的預設排序器是 k=60 的 RRF。若要自訂混合排序器，請調整以下參數：

- `hybrid_ranker (str)`：指定混合搜尋查詢使用的排序器類型。目前僅支援 \[“RRFRanker”, “WeightedRanker”]，預設為 “RRFRanker”。

- `hybrid_ranker_params (dict, optional)`：混合排序器的設定參數。字典結構會依使用的排序器而異：

  - “RRFRanker” 需要包含：
    - “k” (int)：倒數排名融合（RRF）使用的參數。演算法會用此值計算排名分數，並合併多種排序策略的結果，以提高搜尋相關性。若未指定，預設值為 60。

  - “WeightedRanker” 需要包含：

    - “weights” (list of float)：包含且只包含兩個權重的清單：

      1. 密集嵌入部分的權重。
      2. 稀疏嵌入部分的權重。這兩個值用來調整混合檢索中密集與稀疏嵌入的比重。若未指定，預設權重為 \[1.0, 1.0]。

```
vector_store = MilvusVectorStore(
    uri=URI,
    # token=TOKEN,
    dim=1536,
    overwrite=False,  # Use the existing collection created in the previous example
    enable_sparse=True,
    hybrid_ranker="WeightedRanker",
    hybrid_ranker_params={"weights": [1.0, 0.5]},
)
index = VectorStoreIndex.from_vector_store(vector_store)
query_engine = index.as_query_engine(
    vector_store_query_mode="hybrid", similarity_top_k=5
)
response = query_engine.query("What did the author learn at Viaweb?")
print(textwrap.fill(str(response), 100))
```

```
2025-04-17 03:44:00,419 [DEBUG][_create_connection]: Created new connection using: 09c051fb18c04f97a80f07958856587b (async_milvus_client.py:547)
Sparse embedding function is not provided, using default.
No built-in function detected, using BGEM3SparseEmbeddingFunction().
Fetching 30 files: 100%|██████████| 30/30 [00:00<00:00, 136622.28it/s]
Chunks: 100%|██████████| 1/1 [00:00<00:00,  1.07it/s]




The author learned several valuable lessons at Viaweb, including the importance of understanding
growth rate as the ultimate test of a startup, the significance of user feedback in shaping the
software, and the realization that web applications were the future of software development.
Additionally, the experience at Viaweb taught the author about the challenges and rewards of running
a startup, the value of simplicity in software design, and the impact of pricing strategies on
attracting customers.
```
