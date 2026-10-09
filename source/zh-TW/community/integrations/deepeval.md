---
title: "使用 DeepEval 進行 Unit Testing LLMs/RAG"
---

[DeepEval](https://github.com/confident-ai/deepeval) 為 AI agents 與由 LLM 驅動的應用程式提供單元測試。它為 LlamaIndex 使用者提供了一個非常簡單的介面來為 LLM 輸出編寫測試，並協助開發者在生產環境中捕捉破壞性變更。

DeepEval 提供了一個具有特定設計理念的框架來衡量回應，且完全開源。

### 安裝與設定

加入 [DeepEval](https://github.com/confident-ai/deepeval) 非常簡單且無需設定。安裝方式如下：

終端機視窗

```
pip install -U deepeval
# Optional step: Login to get a nice dashboard for your tests later!
deepeval login
```

安裝完成後，您可以建立 `test_rag.py` 並開始編寫測試。

test\_rag.py

```
import pytest
from deepeval import assert_test
from deepeval.metrics import AnswerRelevancyMetric
from deepeval.test_case import LLMTestCase




def test_case():
    answer_relevancy_metric = AnswerRelevancyMetric(threshold=0.5)
    test_case = LLMTestCase(
        input="What if these shoes don't fit?",
        # Replace this with the actual output from your LLM application
        actual_output="We offer a 30-day full refund at no extra costs.",
        retrieval_context=[
            "All customers are eligible for a 30 day full refund at no extra costs."
        ],
    )
    assert_test(test_case, [answer_relevancy_metric])
```

接著您可以這樣執行測試：

終端機視窗

```
deepeval test run test_rag.py
```

如果您已登入，將可以在 `deepeval` 的儀表板上分析評估結果：

![Sample dashboard](/assets/d4991a22c0d7.png)

## 指標類型

DeepEval 為 RAG 應用程式的單元測試提供了一套設計完善的框架。它將評估分解為測試案例，並提供一系列可針對每個測試案例自由評估的指標，包括：

- G-Eval
- Summarization
- Answer Relevancy
- Faithfulness
- Contextual Recall
- Contextual Precision
- Contextual Relevancy
- RAGAS
- Hallucination
- Bias
- Toxicity

[DeepEval](https://github.com/confident-ai/deepeval) 將最新的研究成果整合到其評估指標中。您可以在[這裡](https://docs.confident-ai.com/docs/metrics-introduction)了解完整的指標列表及其計算方式。

## 為您的 LlamaIndex 應用程式評估 RAG

DeepEval 與 LlamaIndex 的 `BaseEvaluator` 類別整合良好。以下是以 LlamaIndex 評估器形式使用 DeepEval 評估指標的範例。

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from deepeval.integrations.llama_index import DeepEvalAnswerRelevancyEvaluator


# Read LlamaIndex's quickstart on more details
documents = SimpleDirectoryReader("YOUR_DATA_DIRECTORY").load_data()
index = VectorStoreIndex.from_documents(documents)
rag_application = index.as_query_engine()


# An example input to your RAG application
user_input = "What is LlamaIndex?"


# LlamaIndex returns a response object that contains
# both the output string and retrieved nodes
response_object = rag_application.query(user_input)


evaluator = DeepEvalAnswerRelevancyEvaluator()
```

接著您可以這樣進行評估：

```
evaluation_result = evaluator.evaluate_response(
    query=user_input, response=response_object
)
print(evaluation_result)
```

### 完整評估器列表

以下是如何從 `deepeval` 匯入所有 6 個評估器：

```
from deepeval.integrations.llama_index import (
    DeepEvalAnswerRelevancyEvaluator,
    DeepEvalFaithfulnessEvaluator,
    DeepEvalContextualRelevancyEvaluator,
    DeepEvalSummarizationEvaluator,
    DeepEvalBiasEvaluator,
    DeepEvalToxicityEvaluator,
)
```

如需查看所有評估器的定義以及了解其如何與 DeepEval 測試套件整合，請[點擊這裡](https://docs.confident-ai.com/docs/integrations-llamaindex)。

### 實用連結

- [DeepEval Quickstart](https://docs.confident-ai.com/docs/getting-started)
- [關於 LLM 評估指標的所有必要資訊](https://www.confident-ai.com/blog/llm-evaluation-metrics-everything-you-need-for-llm-evaluation)