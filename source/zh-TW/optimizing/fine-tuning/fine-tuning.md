---
title: "微調"
---

## 概觀

Finetuning 模型是指透過一組資料來更新模型本身，以在多方面提升模型表現。這包括提高輸出品質、減少 hallucination、更全面地記憶資料，以及降低延遲與成本。

我們工具集的核心圍繞在 in-context learning / retrieval augmentation，這涉及在 inference 模式下使用模型，而非訓練模型本身。

雖然 finetuning 也可以用來利用外部資料來「增強」模型，但 finetuning 能在多方面補足 retrieval augmentation：

#### Embedding Finetuning 的優勢

- Finetuning embedding 模型可以讓模型在特定的訓練資料分佈上產生更有意義的 embedding 表示 $\rightarrow$ 進而提升 retrieval 效能。

#### LLM Finetuning 的優勢

- 讓模型學習特定資料集的風格
- 讓模型學習在訓練資料中較少出現的 DSL（例如 SQL）
- 讓模型修正難以透過 prompt engineering 解決的 hallucination 或錯誤
- 將更強大的模型（例如 GPT-4）distill 到更簡單/便宜的模型中（例如 gpt-3.5, Llama 2）

## 與 LlamaIndex 的整合

這是一份持續更新的指南，目前有三個與 LlamaIndex 的關鍵整合。請參閱以下章節以了解更多詳情！

- Finetuning embeddings 以提升 retrieval 效能
- Finetuning Llama 2 以提升 text-to-SQL 表現
- Finetuning gpt-3.5-turbo 以 distill gpt-4

## Finetuning Embeddings

我們建立了完整的指南，向您展示如何以不同方式 finetune embeddings，無論是對非結構化文本語料庫 finetune 模型本身（在此案例中為 `bge`），或是針對任何 black-box embedding 使用 adapter。其步驟如下：

1. 使用 LlamaIndex 針對任何非結構化內容生成合成的問答資料集。
2. Finetuning 模型。
3. 評估模型。

Finetuning 可讓 retrieval 評估指標提升 5-10%。接著您可以透過 LlamaIndex 將此 fine-tuned 模型整合到您的 RAG 應用程式中。

- [Fine-tuning an Adapter](https://developers.llamaindex.ai/python/examples/finetuning/embeddings/finetune_embedding_adapter/index.md)
- [Embedding Fine-tuning Guide](https://developers.llamaindex.ai/python/examples/finetuning/embeddings/finetune_embedding/index.md)
- [Router Fine-tuning](https://developers.llamaindex.ai/python/examples/finetuning/router/router_finetune/index.md)

**舊版**

- [Embedding Fine-tuning Repo](https://github.com/run-llama/finetune-embedding)
- [Embedding Fine-tuning Blog](https://medium.com/llamaindex-blog/fine-tuning-embeddings-for-rag-with-synthetic-data-e534409a3971)

## Fine-tuning LLMs

### Fine-tuning GPT-3.5 以 distill GPT-4

我們提供多份指南，展示如何使用 OpenAI 的 finetuning endpoints 來 fine-tune gpt-3.5-turbo，使其針對 RAG/agents 輸出 GPT-4 等級的回應。

我們使用 GPT-4 從任何非結構化內容中自動生成問題，並使用 GPT-4 query engine flow 來生成「ground-truth」答案。我們的 `OpenAIFineTuningHandler` callback 會自動將問答記錄到資料集中。

接著我們啟動 finetuning 任務，並獲得一個 distilled model。我們可以使用 [Ragas](https://github.com/explodinggradients/ragas) 評估此模型，並與原生 GPT-3.5 workflow 進行基準測試。

- [GPT-3.5 微調 Notebook（Colab）](https://colab.research.google.com/drive/1NgyCJVyrC2xcZ5lxt2frTU862v6eJHlc?usp=sharing)
- [GPT-3.5 微調 Notebook（Notebook 連結）](https://developers.llamaindex.ai/python/examples/finetuning/openai_fine_tuning/index.md)
- [\[WIP\] Function Calling 微調](https://developers.llamaindex.ai/python/examples/finetuning/openai_fine_tuning_functions/index.md)

**舊版**

- [GPT-3.5 微調 Notebook（Colab）](https://colab.research.google.com/drive/1vWeJBXdFEObuihO7Z8ui2CAYkdHQORqo?usp=sharing)
- [GPT-3.5 微調 Notebook（Repo）](https://github.com/jerryjliu/llama_index/blob/main/experimental/openai_fine_tuning/openai_fine_tuning.ipynb)

### Fine-tuning 以提升結構化輸出品質

Fine-tuning 的另一個使用場景是讓模型更擅長輸出結構化資料。我們可以針對 OpenAI 和 Llama2 執行此操作。

- [OpenAI Function Calling 微調](https://developers.llamaindex.ai/python/examples/finetuning/openai_fine_tuning_functions/index.md)

### Fine-tuning Llama 2 以提升 Text-to-SQL 表現

在本教學中，我們將展示如何使用 text-to-SQL 資料集來 finetune Llama 2，然後利用 LlamaIndex 的抽象層，針對任何 SQL 資料庫進行結構化分析。

此技術棧包含：使用 `sql-create-context` 作為訓練資料集、OpenLLaMa 作為基礎模型、PEFT 進行 finetuning、Modal 提供雲端運算，以及 LlamaIndex 提供 inference 抽象層。- [Llama 2 文字轉-SQL Fine-tuning (w/ Modal，Repo)](https://github.com/run-llama/modal_finetune_sql)
- [Llama 2 Text-to-SQL 微調（Modal、Notebook）](https://github.com/run-llama/modal_finetune_sql/blob/main/tutorial.ipynb)

### Fine微調 Evaluator

在這些教學中，我們的目標是將 GPT-4 judge（或 evaluator）的知識蒸餾到 GPT-3.5 judge 中。近期研究觀察到 GPT-4 judges 與人類評估者的一致性很高（例如參閱 <https://arxiv.org/pdf/2306.05685.pdf>）。

因此，透過 fine-tuning GPT-3.5 judge，我們或許能以更低的成本達到 GPT-4 的水準（進而與人類評估結果達成一致）。

- [Finetune Correctness Judge](https://developers.llamaindex.ai/python/examples/finetuning/llm_judge/correctness/finetune_llm_judge_single_grading_correctness/index.md)
- [Finetune LLM Judge](https://developers.llamaindex.ai/python/examples/finetuning/llm_judge/pairwise/finetune_llm_judge/index.md)

## Fine-tuning Cross-Encoders 用於 Re-Ranking

透過 fine-tuning cross encoder，我們可以嘗試提升在私有資料上的 re-ranking 效能。

Re-ranking 是進階檢索的關鍵步驟，其流程是使用獨立的模型對從多個來源檢索到的 nodes 重新排序，使最相關的 nodes 排在最前面。

在本範例中，我們使用 `sentence-transformers` 套件來協助 fine-tune crossencoder 模型，並使用基於 `QASPER` 資料集產生的資料集。

- [Cross-Encoder Finetuning](https://developers.llamaindex.ai/python/examples/finetuning/cross_encoder_finetuning/cross_encoder_finetuning/index.md)
- [Finetuning Llama 2 用於 Text-to-SQL](https://medium.com/llamaindex-blog/easily-finetune-llama-2-for-your-text-to-sql-applications-ecd53640e10d)
- [Finetuning GPT-3.5 至 Distill GPT-4](https://colab.research.google.com/drive/1vWeJBXdFEObuihO7Z8ui2CAYkdHQORqo?usp=sharing)

## Cohere Custom Reranker

透過使用 CohereAI 訓練 custom reranker，我們可以嘗試提升在私有資料上的 re-ranking 效能。

Re-ranking 是進階檢索流程中的關鍵步驟。此步驟使用獨立的模型來重新整理從初步檢索階段取得的 nodes，目的是確保最相關的 nodes 優先排列在最前面。

在本範例中，我們使用 `cohere` custom reranker 訓練模組，針對您的領域或特定資料集建立 reranker，以提升檢索效能。

- [Cohere Custom Reranker](https://developers.llamaindex.ai/python/examples/finetuning/rerankers/cohere_custom_reranker/index.md)