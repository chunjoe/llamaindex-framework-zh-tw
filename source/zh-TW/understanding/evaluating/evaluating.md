---
title: "評估"
---

評估和基準測試是 LLM 開發中的關鍵概念。為了提升 LLM 應用程式（RAG, agents）的效能，您必須有方法來衡量它。

LlamaIndex 提供關鍵模組來衡量生成結果的品質。我們也提供關鍵模組來衡量檢索品質。您可以在我們的 [module guides](/python/framework/module_guides/evaluating/) 中了解 LlamaIndex 中評估是如何運作的。

## 回應評估

回應是否符合檢索的上下文？它是否也符合查詢？它是否符合參考答案或指南？以下是一個簡單的範例，用於評估單一回應的忠實度（Faithfulness），即回應是否與上下文一致，例如是否沒有產生幻覺：

```
from llama_index.core import VectorStoreIndex
from llama_index.llms.openai import OpenAI
from llama_index.core.evaluation import FaithfulnessEvaluator


# create llm
llm = OpenAI(model="gpt-4", temperature=0.0)


# build index
...
vector_index = VectorStoreIndex(...)


# define evaluator
evaluator = FaithfulnessEvaluator(llm=llm)


# query index
query_engine = vector_index.as_query_engine()
response = query_engine.query(
    "What battles took place in New York City in the American Revolution?"
)
eval_result = evaluator.evaluate_response(response=response)
print(str(eval_result.passing))
```

回應包含回應本身以及生成該回應的來源；評估器會比較它們並判斷回應是否忠於來源。

您可以在我們的模組指南中了解更多關於 [response evaluation](/python/framework/module_guides/evaluating/usage_pattern/) 的資訊。

## 檢索評估

檢索到的來源是否與查詢相關？這是一個評估單一檢索的簡單範例：

```
from llama_index.core.evaluation import RetrieverEvaluator


# define retriever somewhere (e.g. from index)
# retriever = index.as_retriever(similarity_top_k=2)
retriever = ...


retriever_evaluator = RetrieverEvaluator.from_metric_names(
    ["mrr", "hit_rate"], retriever=retriever
)


retriever_evaluator.evaluate(
    query="query", expected_ids=["node_id1", "node_id2"]
)
```

這會比較為查詢檢索到的內容與預期應檢索的一組 nodes。

在現實中，您會希望評估一整批檢索結果；您可以在關於 [retrieval evaluation](/python/framework/module_guides/evaluating/usage_pattern_retrieval/) 的模組指南中了解如何做到這一點。

## 相關概念

如果您正在呼叫託管的、遠端的 LLM，您可能會對 [分析您的應用程式成本](/python/framework/understanding/evaluating/cost_analysis/) 感興趣。