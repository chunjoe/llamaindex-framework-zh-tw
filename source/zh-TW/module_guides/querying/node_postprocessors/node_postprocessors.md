---
title: "Node 後處理模組"
---

Node postprocessors 在檢索和回應合成之間執行：它們會對 nodes 由 retriever 返回的結果進行轉換、過濾或重新排序，然後 LLM 才會看到它們。最常見的類型是 **reranker**，詳見下文。

## 選擇 reranker

- 無 API key，本地，推薦預設值：[`SentenceTransformerRerank`](/python/framework/module_guides/querying/node_postprocessors/node_postprocessors/#sentencetransformerrerank)，一個透過 `sentence-transformers` 的 cross-encoder。使用 `cross-encoder/ms-marco-MiniLM-L6-v2` 追求速度，使用 `Qwen/Qwen3-Reranker-0.6B` 追求更強的多語言品質。
- 託管 API，最小設置：[`CohereRerank`](/python/framework/module_guides/querying/node_postprocessors/node_postprocessors/#coherererank)，[`JinaRerank`](/python/framework/module_guides/querying/node_postprocessors/node_postprocessors/#jinarerank)，[`VoyageAIRerank`](https://developers.llamaindex.ai/python/examples/node_postprocessor/voyageairerank/index.md)，[`MixedbreadAIRerank`](https://developers.llamaindex.ai/python/examples/node_postprocessor/mixedbreadairerank/index.md)，[`NVIDIARerank`](https://developers.llamaindex.ai/python/examples/node_postprocessor/nvidiarerank/index.md)。
- 最高品質，容忍延遲：[`LLMRerank`](/python/framework/module_guides/querying/node_postprocessors/node_postprocessors/#llm-rerank)，[`RankGPTRerank`](/python/framework/module_guides/querying/node_postprocessors/node_postprocessors/#beta-rankgpt)，[`RankLLMRerank`](/python/framework/module_guides/querying/node_postprocessors/node_postprocessors/#rankllm)。這些模型使用 LLM 本身來判斷相關性。
- Token 級延遲互動：[`ColbertRerank`](/python/framework/module_guides/querying/node_postprocessors/node_postprocessors/#colbert-reranker)，適用於狹窄的技術術語。
- 多模態（documents 作為圖片）：[`ColPaliRerank`](https://developers.llamaindex.ai/python/examples/node_postprocessor/colpalirerank/index.md)。

請參閱 [rerankers 概觀頁面](/python/framework/module_guides/models/rerankers/) 以獲得更廣泛的說明。

## SimilarityPostprocessor

用於移除相似度分數低於某個閾值的 nodes。

```
from llama_index.core.postprocessor import SimilarityPostprocessor


postprocessor = SimilarityPostprocessor(similarity_cutoff=0.7)


postprocessor.postprocess_nodes(nodes)
```

## KeywordNodePostprocessor

用於確保某些關鍵字被排除或包含。

```
from llama_index.core.postprocessor import KeywordNodePostprocessor


postprocessor = KeywordNodePostprocessor(
    required_keywords=["word1", "word2"], exclude_keywords=["word3", "word4"]
)


postprocessor.postprocess_nodes(nodes)
```

## MetadataReplacementPostProcessor

用於將 node 的內容替換為 node 的 metadata 中的欄位。如果 metadata 中沒有該欄位，則 node 的文本保持不變。最常與 `SentenceWindowNodeParser` 組合使用。

```
from llama_index.core.postprocessor import MetadataReplacementPostProcessor


postprocessor = MetadataReplacementPostProcessor(
    target_metadata_key="window",
)


postprocessor.postprocess_nodes(nodes)
```

## LongContextReorder

模型在擴展上下文的中心部分難以存取重要細節。一項研究 [A study](https://arxiv.org/abs/2307.03172) 觀察到，最佳的表現通常發生在關鍵資料位於輸入上下文的開頭或結尾時。此外，隨著輸入上下文的加長，即使是設計用於長上下文的模型，表現也會顯著下降。

此模組會重新排序檢索到的 nodes，這在需要大型 top-k 的情況下會很有幫助。

```
from llama_index.core.postprocessor import LongContextReorder


postprocessor = LongContextReorder()


postprocessor.postprocess_nodes(nodes)
```

## SentenceEmbeddingOptimizer

此 postprocessor 通過移除與查詢無關的句子（使用 embeddings 進行此操作）來優化 token 的使用。

百分位數截止點是衡量使用相關句子前百分比的指標。

也可以指定 threshold cutoff，這會使用原始的相似度截止點來選擇要保留的句子。

```
from llama_index.core.postprocessor import SentenceEmbeddingOptimizer


postprocessor = SentenceEmbeddingOptimizer(
    embed_model=service_context.embed_model,
    percentile_cutoff=0.5,
    # threshold_cutoff=0.7
)


postprocessor.postprocess_nodes(nodes)
```

完整的筆記本指南可在此找到 [此處](https://developers.llamaindex.ai/python/examples/node_postprocessor/optimizerdemo/index.md)。

## CohereRerank

使用 “Cohere ReRank” 功能來重新排序 nodes，並返回前 N 個 nodes。

```
from llama_index.postprocessor.cohere_rerank import CohereRerank


postprocessor = CohereRerank(
    top_n=2, model="rerank-v3.5", api_key="YOUR COHERE API KEY"
)


postprocessor.postprocess_nodes(nodes)
```

完整的筆記本指南可在此獲得 [此處](https://developers.llamaindex.ai/python/examples/node_postprocessor/coherererank/index.md)。

## SentenceTransformerRerank

使用 `sentence-transformer` 套件中的 cross-encoders 來重新排序 nodes，並返回前 N 個 nodes。

```
from llama_index.core.postprocessor import SentenceTransformerRerank


# We choose a model with relatively high speed and decent accuracy.
postprocessor = SentenceTransformerRerank(
    model="cross-encoder/ms-marco-MiniLM-L2-v2", top_n=3
)


postprocessor.postprocess_nodes(nodes)
```

完整的筆記本指南可在此獲得 [此處](https://developers.llamaindex.ai/python/examples/node_postprocessor/sentencetransformerrerank/index.md)。

也請參閱 [`sentence-transformers` docs](https://sbert.net/docs/cross_encoder/pretrained_models.html) 以獲取更多關於速度/準確度權衡的 cross-encoder 模型列表。構造函數的 `model` 參數預設為 `cross-encoder/stsb-distilroberta-base`，它經過訓練用於語義文本相似性，而不是段落重新排序。對於檢索工作負載，我們強烈建議傳遞一個經過 MS MARCO 訓練的模型，例如 `cross-encoder/ms-marco-MiniLM-L6-v2`（上面顯示的是較小的 `L2` 版本）或現代選項如 `Qwen/Qwen3-Reranker-0.6B`（見下文）。

對於多語言內容更強的準確性，請替換為最近的 cross-encoder，例如 [`Qwen/Qwen3-Reranker-0.6B`](https://huggingface.co/Qwen/Qwen3-Reranker-0.6B)：

```
from llama_index.core.postprocessor import SentenceTransformerRerank


postprocessor = SentenceTransformerRerank(
    model="Qwen/Qwen3-Reranker-0.6B", top_n=3
)


postprocessor.postprocess_nodes(nodes)
```

這仍然在本地運行，沒有 API key，與 MiniLM 基線相比，每個查詢的計算量會增加。

## LLM RerankUses a LLM 重新排序 nodes 透過詢問 the LLM 以回傳相關的 documents 以及它們相關程度的分數。 Returns 前 N 名排名最高者 nodes.

```
from llama_index.core.postprocessor import LLMRerank


postprocessor = LLMRerank(top_n=2, service_context=service_context)


postprocessor.postprocess_nodes(nodes)
```

完整的 notebook 指南已提供 [her 對於 Gatsby](https://developers.llamaindex.ai/python/examples/node_postprocessor/llmreranker-gatsby/index.md) 以及 [here 對於 Lyft 10K documents](https://developers.llamaindex.ai/python/examples/node_postprocessor/llmreranker-lyft-10k/index.md).

## JinaRerank

使用 “Jina ReRank” 功能來重新排序 nodes，並回傳前 N 個 nodes。

```
from llama_index.postprocessor.jinaai_rerank import JinaRerank


postprocessor = JinaRerank(
    top_n=2,
    model="jina-reranker-v2-base-multilingual",
    api_key="YOUR JINA API KEY",
)


postprocessor.postprocess_nodes(nodes)
```

完整的 notebook 指南請參閱 [此處](https://developers.llamaindex.ai/python/examples/node_postprocessor/jinarerank/index.md).

## FixedRecencyPostprocessor

此 postprocessor 會回傳前 K 個 nodes 依日期排序。 這假設存在一個 `date` 要在每個 metadata 中解析的欄位 node.

```
from llama_index.core.postprocessor import FixedRecencyPostprocessor


postprocessor = FixedRecencyPostprocessor(
    tok_k=1, date_key="date"  # the key in the metadata to find the date
)


postprocessor.postprocess_nodes(nodes)
```

![](/assets/b1cde8f29346.png)

完整的 notebook 指南請參閱 [此處](https://developers.llamaindex.ai/python/examples/node_postprocessor/recencypostprocessordemo/index.md).

## EmbeddingRecencyPostprocessor

此 postprocessor 會回傳前 K 個 nodes 在依日期排序並移除較舊的項目之後 nodes 在測量 embedding 相似度後過於相似的內容。

```
from llama_index.core.postprocessor import EmbeddingRecencyPostprocessor


postprocessor = EmbeddingRecencyPostprocessor(
    service_context=service_context, date_key="date", similarity_cutoff=0.7
)


postprocessor.postprocess_nodes(nodes)
```

完整的 notebook 指南請參閱 [此處](https://developers.llamaindex.ai/python/examples/node_postprocessor/recencypostprocessordemo/index.md).

## TimeWeightedPostprocessor

此 postprocessor 會回傳前 K 個 nodes 對每個項目套用時間加權的 rerank node. 每次一個 node 當節點被擷取時，系統會記錄其擷取時間。 這會使搜尋產生偏差，以優先考慮在查詢中尚未回傳的資訊。

```
from llama_index.core.postprocessor import TimeWeightedPostprocessor


postprocessor = TimeWeightedPostprocessor(time_decay=0.99, top_k=1)


postprocessor.postprocess_nodes(nodes)
```

完整的 notebook 指南請參閱 [此處](https://developers.llamaindex.ai/python/examples/node_postprocessor/timeweightedpostprocessordemo/index.md).

## (Beta) PIINodePostprocessor

PII (Personal Identifiable Information) postprocessor 會移除可能造成安全性風險的資訊。其運作方式是使用 NER （可搭配專用的 NER 模型或本地的 LLM 模型）。

### LLM Version

```
from llama_index.core.postprocessor import PIINodePostprocessor


postprocessor = PIINodePostprocessor(
    service_context=service_context  # this should be setup with an LLM you trust
)


postprocessor.postprocess_nodes(nodes)
```

### NER Version

此版本使用 Hugging Face 的預設本地模型，該模型會在您執行 `pipeline("ner")` 時載入。

```
from llama_index.core.postprocessor import NERPIINodePostprocessor


postprocessor = NERPIINodePostprocessor()


postprocessor.postprocess_nodes(nodes)
```

這兩者的完整 notebook 指南請參閱 [此處](https://developers.llamaindex.ai/python/examples/node_postprocessor/pii/index.md).

## (Beta) PrevNextNodePostprocessor

使用預定義的 settings 來讀取 `Node` 關係，並擷取所有在前、在後或兩者皆有的 nodes。

這在您知道關係指向重要內容時非常有用 data （在之前、之後或兩者皆是）應傳送到 LLM 如果該 node 被擷取。

```
from llama_index.core.postprocessor import PrevNextNodePostprocessor


postprocessor = PrevNextNodePostprocessor(
    docstore=index.docstore,
    num_nodes=1,  # number of nodes to fetch when looking forwards or backwards
    mode="next",  # can be either 'next', 'previous', or 'both'
)


postprocessor.postprocess_nodes(nodes)
```

![](/assets/b7e7b1dc91da.png)

## (Beta) AutoPrevNextNodePostprocessor

與...相同 PrevNextNodePostprocessor，但讓 the LLM 決定 mode （下一個、上一個，或兩者皆是）。

```
from llama_index.core.postprocessor import AutoPrevNextNodePostprocessor


postprocessor = AutoPrevNextNodePostprocessor(
    docstore=index.docstore,
    service_context=service_context,
    num_nodes=1,  # number of nodes to fetch when looking forwards or backwards)
)
postprocessor.postprocess_nodes(nodes)
```

完整的範例 notebook 請參閱 [此處](https://developers.llamaindex.ai/python/examples/node_postprocessor/prevnextpostprocessordemo/index.md).

## (Beta) RankGPT

使用 RankGPT agent 根據相關性對 documents 進行 rerank。Returns 前 N 個排名的 nodes。

```
from llama_index.postprocessor.rankgpt_rerank import RankGPTRerank


postprocessor = RankGPTRerank(top_n=3, llm=OpenAI(model="gpt-4o-mini"))


postprocessor.postprocess_nodes(nodes)
```

完整的 notebook 指南請參閱 [此處](https://developers.llamaindex.ai/python/examples/node_postprocessor/rankgpt/index.md).

## Colbert Reranker

使用 Colbert V2 模型作為 reranker，根據 query tokens 與 passage tokens 之間的細粒度相似度對 documents 進行重新排序。回傳前 N 個排名最高的 nodes。

```
from llama_index.postprocessor.colbert_rerank import ColbertRerank


colbert_reranker = ColbertRerank(
    top_n=5,
    model="colbert-ir/colbertv2.0",
    tokenizer="colbert-ir/colbertv2.0",
    keep_retrieval_score=True,
)


query_engine = index.as_query_engine(
    similarity_top_k=10,
    node_postprocessors=[colbert_reranker],
)
response = query_engine.query(
    query_str,
)
```

完整的 notebook 指南請參閱 [此處](https://developers.llamaindex.ai/python/examples/node_postprocessor/colbertrerank/index.md).

## rankLLM

使用 [rankLLM](https://github.com/castorini/rank_llm) 的模型來對 documents 進行 rerank。Returns 前 N 個排名的 nodes。

```
from llama_index.postprocessor.rankllm_rerank import RankLLMRerank


# RankZephyr reranker, return top 5 candidates
reranker = RankLLMRerank(model="rank_zephyr", top_n=5)
reranker.postprocess_nodes(nodes)
```

完整的 [notebook 範例為 available](https://developers.llamaindex.ai/python/examples/node_postprocessor/rankllm/index.md)。

## 所有 notebook

本地 / 自行託管的 rerankers:

- [SentenceTransformer Rerank](https://developers.llamaindex.ai/python/examples/node_postprocessor/sentencetransformerrerank/index.md)：透過 `sentence-transformers`  的 cross-encoders（本地 reranking 的建議預設值）。
- [FlagEmbedding Reranker](https://developers.llamaindex.ai/python/examples/node_postprocessor/flagembeddingreranker/index.md)：`BAAI/bge-reranker-*` 系列。
- [Colbert Rerank](https://developers.llamaindex.ai/python/examples/node_postprocessor/colbertrerank/index.md)：透過 ColBERT v2 進行 token-level late interaction。
- [OpenVINO Rerank](https://developers.llamaindex.ai/python/examples/node_postprocessor/openvino_rerank/index.md)：Intel 優化的 cross-encoder 推論。
- [RankLLM](https://developers.llamaindex.ai/python/examples/node_postprocessor/rankllm/index.md)：經過 instruction-tuned 的 listwise LLM rerankers  (RankZephyr, RankVicuna)。

Hosted API rerankers:

- [Cohere Rerank](https://developers.llamaindex.ai/python/examples/node_postprocessor/coherererank/index.md)
- [JinaAI Rerank](https://developers.llamaindex.ai/python/examples/node_postprocessor/jinarerank/index.md)
- [Mixedbread AI Rerank](https://developers.llamaindex.ai/python/examples/node_postprocessor/mixedbreadairerank/index.md)
- [VoyageAI Rerank](https://developers.llamaindex.ai/python/examples/node_postprocessor/voyageairerank/index.md)
- [NVIDIA Rerank (NIM)](https://developers.llamaindex.ai/python/examples/node_postprocessor/nvidiarerank/index.md)
- [AIMon Rerank](https://developers.llamaindex.ai/python/examples/node_postprocessor/aimonrerank/index.md)
- [IBM watsonx.ai](https://developers.llamaindex.ai/python/examples/node_postprocessor/ibm_watsonx/index.md)

LLM 作為 reranker:

- [LLM Reranker Gatsby](https://developers.llamaindex.ai/python/examples/node_postprocessor/llmreranker-gatsby/index.md)
- [LLM Reranker Lyft 10k](https://developers.llamaindex.ai/python/examples/node_postprocessor/llmreranker-lyft-10k/index.md)
- [Structured LLM Reranker Lyft 10k](https://developers.llamaindex.ai/python/examples/node_postprocessor/structured-llmreranker-lyft-10k/index.md)
- [RankGPT](https://developers.llamaindex.ai/python/examples/node_postprocessor/rankgpt/index.md)

多模態 rerankers:

- [ColPali Rerank](https://developers.llamaindex.ai/python/examples/node_postprocessor/colpalirerank/index.md)：針對 document 影像的 vision-language reranking。

其他 node postprocessors：

- [Sentence Optimizer](https://developers.llamaindex.ai/python/examples/node_postprocessor/optimizerdemo/index.md)
- [Recency](https://developers.llamaindex.ai/python/examples/node_postprocessor/recencypostprocessordemo/index.md)
- [Time Weighted](https://developers.llamaindex.ai/python/examples/node_postprocessor/timeweightedpostprocessordemo/index.md)
- [PII](https://developers.llamaindex.ai/python/examples/node_postprocessor/pii/index.md)
- [PrevNext](https://developers.llamaindex.ai/python/examples/node_postprocessor/prevnextpostprocessordemo/index.md)
- [Metadata Replacement](https://developers.llamaindex.ai/python/examples/node_postprocessor/metadatareplacementdemo/index.md)
- [Long Context Reorder](https://developers.llamaindex.ai/python/examples/node_postprocessor/longcontextreorder/index.md)