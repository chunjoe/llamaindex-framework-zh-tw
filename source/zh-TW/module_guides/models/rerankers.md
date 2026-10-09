---
title: "重新排序器"
---

## 概念

Reranker 會對初始 retriever 返回的頂部 `k` nodes 進行重新排序，依據更強、通常較慢的查詢 document 相關性度量來重新排序。Reranking 是 RAG 管線中最高槓桿的調整項：初始檢索器針對大型資料集進行召回調校，而 reranker 讓您在 nodes 到達 LLM 之前恢復精確度。

在 LlamaIndex 中，reranker 被實作為運行在檢索和回應合成之間的 node 後處理器。

## 使用模式

```
from llama_index.core.postprocessor import SentenceTransformerRerank


reranker = SentenceTransformerRerank(
    model="cross-encoder/ms-marco-MiniLM-L6-v2", top_n=3
)


query_engine = index.as_query_engine(
    similarity_top_k=10,
    node_postprocessors=[reranker],
)
response = query_engine.query("What did the author do in college?")
```

retriever 擷取更廣泛的集合 (`similarity_top_k=10`)，而 reranker 會將其篩選至最佳 `top_n=3`，然後 LLM 看到它們。

## 選擇 reranker

- 無 API key，本地，高品質：[`SentenceTransformerRerank`](/python/framework/module_guides/querying/node_postprocessors/node_postprocessors/#sentencetransformerrerank) 是推薦的預設選項。與現代的 cross-encoder 搭配使用，例如 [`Qwen/Qwen3-Reranker-0.6B`](https://huggingface.co/Qwen/Qwen3-Reranker-0.6B)（更強、多語言）或 [`cross-encoder/ms-marco-MiniLM-L6-v2`](https://huggingface.co/cross-encoder/ms-marco-MiniLM-L6-v2)（較小、更快）。請瀏覽 [Sentence Transformers cross-encoder list](https://sbert.net/docs/cross_encoder/pretrained_models.html) 和 [MTEB leaderboard](https://huggingface.co/spaces/mteb/leaderboard) 上的更多模型。
- 託管 API，最小設置：`CohereRerank`、`JinaRerank`、`VoyageAIRerank`、`MixedbreadAIRerank`。當您不想自行運行 inference 時，這些是很好的選擇。
- 最高品質，延遲不是關鍵：`LLMRerank`、`RankGPTRerank`、`RankLLMRerank`。這些使用 LLM 本身來判斷相關性。
- 多模態延遲互動（documents 為圖片）：[`ColPaliRerank`](https://developers.llamaindex.ai/python/examples/node_postprocessor/colpalirerank/index.md)。
- 文字延遲互動：[`ColbertRerank`](https://developers.llamaindex.ai/python/examples/node_postprocessor/colbertrerank/index.md)。當查詢和 document 包含狹窄的技術術語時很有用。

如需包含所有整合和所有模型的完整參考，請參閱 [Node Postprocessors guide](/python/framework/module_guides/querying/node_postprocessors/node_postprocessors/)。Rerankers 是 node 後處理器的ㄧ類。

## 進一步閱讀

- [Node Postprocessors guide](/python/framework/module_guides/querying/node_postprocessors/node_postprocessors/)：包含程式碼範例的每個支援的 reranker。
- [Sentence Transformers cross-encoder documentation](https://sbert.net/docs/cross_encoder/pretrained_models.html)：開源模型的速度/準確度權衡。
- [Advanced retrieval](/python/framework/optimizing/advanced_retrieval/advanced_retrieval/)：reranking 如何融入更廣泛的檢索策略中。