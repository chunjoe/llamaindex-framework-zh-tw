---
title: "評估"
---

## 概念

評估和基準測試是 LLM 開發中的關鍵概念。為了提升 LLM 應用程式（RAG, agents）的效能，您必須有方法來衡量它。

LlamaIndex 提供關鍵模組來衡量生成結果的品質。我們也提供關鍵模組來衡量檢索品質。

- **Response Evaluation**：回應是否符合檢索的上下文？是否也符合查詢？是否符合參考答案或指南？
- **Retrieval Evaluation**：檢索到的來源是否與查詢相關？

本章節描述了 LlamaIndex 中評估元件的工作方式。

### Response Evaluation

生成結果的評估可能很困難，因為與傳統機器學習不同，預測結果不是單一數字，對於這個問題很難定義量化的指標。

LlamaIndex 提供 **LLM-based** 評估模組來衡量結果的品質。這會使用一個「gold」LLM（例如 GPT-4）來以多種方式判斷預測的答案是否正確。

請注意，許多目前的評估模組*不需要*真實標籤（ground-truth labels）。評估可以透過查詢、上下文、回應的組合，並將這些與 LLM 呼叫結合來進行。

這些評估模組的形式如下：

- **Correctness**：生成答案是否與給定的查詢的參考答案相符（需要標籤）。
- **Semantic Similarity**：預測的答案是否與參考答案在語義上相似（需要標籤）。
- **Faithfulness**：評估答案是否忠於檢索到的上下文（換句話說，是否存在幻覺）。
- **Context Relevancy**：檢索到的上下文是否與查詢相關。
- **Answer Relevancy**：生成的答案是否與查詢相關。
- **Guideline Adherence**：預測的答案是否遵守特定的指南。

#### Question Generation

除了評估查詢外，LlamaIndex 也可以使用您的資料來生成用於評估的問題。這意味著您可以自動生成問題，然後運行一個評估流程來測試 LLM 是否能使用您的資料準確地回答問題。

### Retrieval 評估

我們也提供模組來幫助獨立評估檢索。

檢索評估的概念並非新事物；給定一個問題資料集和真實排序（ground-truth rankings），我們可以利用 mean-reciprocal rank (MRR)、hit-rate、precision 等排序指標來評估 retrievers。

核心的檢索評估步驟圍繞以下內容：

- **Dataset generation**：給定一個非結構化的文本語料庫，合成生成 (question, context) 對。
- **Retrieval Evaluation**：給定一個 retriever 和一組問題，使用排序指標來評估檢索到的結果。

## 整合

我們也整合了社群評估工具。

- [UpTrain](https://github.com/uptrain-ai/uptrain)
- [Tonic Validate](/python/framework/community/integrations/tonicvalidate/)（包含用於視覺化結果的 Web UI）
- [DeepEval](https://github.com/confident-ai/deepeval)
- [Ragas](https://github.com/explodinggradients/ragas/blob/main/docs/howtos/integrations/llamaindex.ipynb)
- [RAGChecker](https://github.com/amazon-science/RAGChecker)
- [Cleanlab](https://developers.llamaindex.ai/python/examples/evaluation/cleanlab/index.md)

## 使用模式

有關完整使用細節，請參閱下方的使用模式。

- [Query Eval Usage Pattern](/python/framework/module_guides/evaluating/usage_pattern/)
- [Retrieval Eval Usage Pattern](/python/framework/module_guides/evaluating/usage_pattern_retrieval/)

## 模組

使用這些元件的 Notebooks 可在 [module guides](/python/framework/module_guides/evaluating/modules/) 中找到。