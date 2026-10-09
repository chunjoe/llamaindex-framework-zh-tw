---
title: "基礎策略"
---

當您需要快速提升效能並優化 RAG workflow 時，有許多簡單的方法可以嘗試。

## 提示詞 工程設計

如果您遇到與 LLM 相關的失敗情況（例如幻覺或輸出格式不正確），這應該是您首先嘗試的優化方向。

以下列出了一些任務，由淺入深排列：

1. 嘗試檢查並自定義 RAG workflow 中使用的 prompt（例如問答 prompt）。

- [Customizing Prompts](https://developers.llamaindex.ai/python/examples/prompts/prompt_mixin/index.md)
- [Advanced Prompts](https://developers.llamaindex.ai/python/examples/prompts/advanced_prompts/index.md)

2. 嘗試加入 **prompt functions**，讓您能動態注入 few-shot 範例或處理注入的輸入內容。

- [Advanced Prompts](https://developers.llamaindex.ai/python/examples/prompts/advanced_prompts/index.md)

## Embeddings

選擇正確的 embedding 模型對整體效能有重大影響。

- 您是否想要比 OpenAI 的 `text-embedding-ada-002`（為了向下相容仍為 `OpenAIEmbedding` 預設值）更強大或更新的模型？
- 您是否想在本地執行模型，而非呼叫託管的 API？
- 您是否需要一個針對特定語言表現良好的 embedding 模型？

除了 OpenAI 之外，目前有許多 embedding API 選項，您也可以在本地執行自己的 embedding 模型或架設自己的伺服器。

[MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard) 是比較目前各種模型在大量資料集與任務表現的最佳地點。在撰寫本文時，熱門的開源選擇包括：

- 快速 / 小型基準 (\~22-33M params)：[`sentence-transformers/all-MiniLM-L6-v2`](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) 或 [`BAAI/bge-small-en-v1.5`](https://huggingface.co/BAAI/bge-small-en-v1.5)。體積小、速度快，且對許多工作負載而言依然穩健。
- 中型、近期架構 (\~150M params)：[`lightonai/DenseOn`](https://huggingface.co/lightonai/DenseOn)，於 2026 年 4 月發佈。尺寸介於小型基準與 Qwen3 系列之間，如果您想要最新的 state-of-the-art 檢索能力且不想使用 0.6B 以上的模型，值得嘗試。
- 強大全方位、多語言 (\~0.6-4B params)：[`Qwen/Qwen3-Embedding-0.6B`](https://huggingface.co/Qwen/Qwen3-Embedding-0.6B)（或追求更高準確度可選 `-4B`）。在 MTEB 上具有競爭力，且體積小到足以在單張 GPU 上提供服務。
- 方便的託管 API：`OpenAIEmbedding(model="text-embedding-3-small")`。

上述所有本地/開源選項皆可透過 [`HuggingFaceEmbedding`](/python/framework/module_guides/models/embeddings/#local-embedding-models) 使用，並可受益於 CPU 上的 ONNX / OpenVINO 加速；詳情請參閱 [embeddings 指南](/python/framework/module_guides/models/embeddings/)。

**注意：** 與 LLM（您可以隨時更改）不同，如果您更改了 embedding 模型，則必須重新為資料建立索引。此外，您應確保索引與查詢時使用相同的 embedding 模型。

我們提供了一份 [所有支援的 embedding 模型整合清單](/python/framework/module_guides/models/embeddings/)。

## Chunk Sizes

根據您索引的資料類型或檢索結果，您可能需要自定義 chunk size 或 chunk overlap。

當 documents 被匯入索引時，它們會被分割成具有一定重疊量的 chunks。預設的 chunk size 為 1024，而預設的 chunk overlap 為 20。

更改其中任何一個參數都會改變計算出的 embeddings。較小的 chunk size 意味著 embeddings 更為精確，而較大的 chunk size 則意味著 embeddings 可能較為概括，但可能會遺漏細節。

我們在此提供了關於 [chunk size 的初步評估](https://blog.llamaindex.ai/evaluating-the-ideal-chunk-size-for-a-rag-system-using-llamaindex-6207e5d3fec5)。

此外，當更改向量索引的 chunk size 時，您可能也需要增加 `similarity_top_k` 參數，以更適當地代表每次查詢要檢索的資料量。

以下是一個完整範例：

```
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
from llama_index.core import Settings


documents = SimpleDirectoryReader("./data").load_data()


Settings.chunk_size = 512
Settings.chunk_overlap = 50


index = VectorStoreIndex.from_documents(
    documents,
)


query_engine = index.as_query_engine(similarity_top_k=4)
```

由於我們將預設的 chunk size 減半，因此範例中將 `similarity_top_k` 從預設的 2 增加到 4。

## Hybrid Search

Hybrid search 是檢索領域的常用術語，指的是將 semantic search（即 embedding 相似度）與關鍵字搜尋的結果相結合。

Embeddings 並非完美，在檢索步驟中可能會無法回傳包含匹配關鍵字的文字 chunks。

解決此問題的方法通常是 hybrid search。在 LlamaIndex 中，有兩種主要方式可以實現：1. 使用具有 hybrid search 功能的向量資料庫（請參閱 [我們的完整支援向量儲存清單](/python/framework/module_guides/storing/vector_stores/)）。
2. 使用 BM25 建立本地的 hybrid search 機制。

以下是包含這兩種方法的相關指南：

- [BM25 Retriever](https://developers.llamaindex.ai/python/examples/retrievers/bm25_retriever/index.md)
- [Reciprocal Rerank Query Fusion](https://developers.llamaindex.ai/python/examples/retrievers/reciprocal_rerank_fusion/index.md)
- [Weaviate Hybrid Search](https://developers.llamaindex.ai/python/examples/vector_stores/weaviateindexdemo-hybrid/index.md)
- [Pinecone Hybrid Search](https://developers.llamaindex.ai/python/examples/vector_stores/pineconeindexdemo-hybrid/index.md)
- [Milvus Hybrid Search](https://developers.llamaindex.ai/python/examples/vector_stores/milvushybridindexdemo/index.md)

## Reranking

Reranking 是提升 RAG 品質最有效的手段之一。retriever 會回傳較多數量的候選結果（`similarity_top_k=10` 個或更多），接著由 reranker（效能更強但速度較慢的模型）重新排序，使最佳的 nodes 能進入 LLM。這通常是決定「檢索結果大致正確」與「檢索結果能真正回答問題」之間的關鍵。

最簡單的實作方式是透過 [`SentenceTransformerRerank`](/python/framework/module_guides/querying/node_postprocessors/node_postprocessors/#sentencetransformerrerank) 使用本地的 cross-encoder；無需 API key，且可隨處執行：

```
from llama_index.core.postprocessor import SentenceTransformerRerank


reranker = SentenceTransformerRerank(
    model="cross-encoder/ms-marco-MiniLM-L6-v2", top_n=3
)


query_engine = index.as_query_engine(
    similarity_top_k=10,
    node_postprocessors=[reranker],
)
```

若要提升多國語言內容的品質，請將模型更換為 `Qwen/Qwen3-Reranker-0.6B`。若需要設定簡單的 hosted-API 選項，請使用 `CohereRerank`、`JinaRerank` 或 `VoyageAIRerank`。在延遲要求不高且追求最高品質的情況下，基於 LLM 的 reranker（`LLMRerank`, `RankGPTRerank`）效能可能優於 cross-encoders，但代價是需要額外的 LLM 呼叫。

請參閱 [node postprocessors 指南](/python/framework/module_guides/querying/node_postprocessors/node_postprocessors/) 以獲取完整清單，以及 [rerankers 概覽](/python/framework/module_guides/models/rerankers/) 以查看決策樹。

## Metadata Filters

在將 documents 放入向量索引之前，為其附加 metadata 會非常有幫助。這些 metadata 後續可用於從 `response` 物件追蹤答案來源，也可以在查詢時用於執行 top-k 相似度搜尋前的資料篩選。

Metadata filters 可以手動設定，以便僅回傳具有匹配 metadata 的 nodes：

```
from llama_index.core import VectorStoreIndex, Document
from llama_index.core.vector_stores import MetadataFilters, ExactMatchFilter


documents = [
    Document(text="text", metadata={"author": "LlamaIndex"}),
    Document(text="text", metadata={"author": "John Doe"}),
]


filters = MetadataFilters(
    filters=[ExactMatchFilter(key="author", value="John Doe")]
)


index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine(filters=filters)
```

如果您使用 GPT-4 等進階 LLM，且您的 [向量資料庫支援篩選](/python/framework/module_guides/storing/vector_stores/)，您可以透過 `AutoVectorRetriever` 讓 LLM 在查詢時自動撰寫 filters。

- [Vector Store Guide](/python/framework/module_guides/indexing/vector_store_index/)

## Document/Node 使用方式

請參閱我們的詳細指南，了解如何使用 Documents/Nodes 的更多細節。

- [Documents Usage](/python/framework/module_guides/loading/documents_and_nodes/usage_documents/)
- [Nodes Usage](/python/framework/module_guides/loading/documents_and_nodes/usage_nodes/)
- [Metadata Extraction](/python/framework/module_guides/loading/documents_and_nodes/usage_metadata_extractor/)

## Multi-Tenancy RAG

RAG 系統中的 Multi-Tenancy 對於確保資料安全性至關重要。它能讓使用者僅存取其索引的 documents，從而防止未經授權的共享並保障資料隱私。搜尋操作僅限於使用者自己的資料，以保護敏感資訊。透過 Metadata Filters，可以使用 `VectorStoreIndex` 和 `VectorDB` provider 來實現。

請參閱以下指南以獲取更多詳細資訊。

- [Multi Tenancy RAG](https://developers.llamaindex.ai/python/examples/multi_tenancy/multi_tenancy_rag/index.md)

關於如何使用 LlamaIndex 和 Qdrant 實作 Multi-Tenancy RAG 的詳細指引，請參閱 Qdrant 發佈的 [部落格文章](https://qdrant.tech/documentation/tutorials/llama-index-multitenancy/)。