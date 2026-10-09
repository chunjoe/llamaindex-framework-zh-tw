---
title: "使用模式（回應評估）"
---

## 使用 `BaseEvaluator`

LlamaIndex 中的所有評估模組都實作了 `BaseEvaluator` 類別，具有兩種主要方法：

1. `evaluate` 方法接受 `query`、`contexts`、`response` 和額外的 keyword arguments。

```
    def evaluate(
        self,
        query: Optional[str] = None,
        contexts: Optional[Sequence[str]] = None,
        response: Optional[str] = None,
        **kwargs: Any,
    ) -> EvaluationResult:
```

2. `evaluate_response` 方法提供了一個替代介面，它接受一個 llamaindex `Response` 物件（其中包含 response string 和 source nodes），而不是單獨的 `contexts` 和 `response`。

```
def evaluate_response(
    self,
    query: Optional[str] = None,
    response: Optional[Response] = None,
    **kwargs: Any,
) -> EvaluationResult:
```

在功能上與 `evaluate` 相同，只是在直接操作 llamaindex 物件時更簡單。

## 使用 `EvaluationResult`

每個 evaluator 在執行時都會輸出一個 `EvaluationResult`：

```
eval_result = evaluator.evaluate(query=..., contexts=..., response=...)
eval_result.passing  # binary pass/fail
eval_result.score  # numerical score
eval_result.feedback  # string feedback
```

不同的 evaluator 可能會填入結果欄位的一個子集。

## 評估回應忠實度（即幻覺）

`FaithfulnessEvaluator` 評估答案是否忠於檢索到的 context（換句話說，是否存在 hallucination）。

```
from llama_index.core import VectorStoreIndex
from llama_index.llms.openai import OpenAI
from llama_index.core.evaluation import FaithfulnessEvaluator


# create llm
llm = OpenAI(model="gpt-4", temperature=0.0)


# build index
...


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

![](/assets/1e848096b9a3.png)

您也可以選擇單獨評估每個 source context：

```
from llama_index.core import VectorStoreIndex
from llama_index.llms.openai import OpenAI
from llama_index.core.evaluation import FaithfulnessEvaluator


# create llm
llm = OpenAI(model="gpt-4", temperature=0.0)


# build index
...


# define evaluator
evaluator = FaithfulnessEvaluator(llm=llm)


# query index
query_engine = vector_index.as_query_engine()
response = query_engine.query(
    "What battles took place in New York City in the American Revolution?"
)
response_str = response.response
for source_node in response.source_nodes:
    eval_result = evaluator.evaluate(
        response=response_str, contexts=[source_node.get_content()]
    )
    print(str(eval_result.passing))
```

您將會得到一個結果列表，對應於 `response.source_nodes` 中每個 source node。

## 評估查詢 + 回應相關性

`RelevancyEvaluator` 評估檢索到的 context 和答案對於給定的 query 是否相關且一致。

請注意，此 evaluator 除了 `Response` 物件外，還需要傳入 `query`。

```
from llama_index.core import VectorStoreIndex
from llama_index.llms.openai import OpenAI
from llama_index.core.evaluation import RelevancyEvaluator


# create llm
llm = OpenAI(model="gpt-4", temperature=0.0)


# build index
...


# define evaluator
evaluator = RelevancyEvaluator(llm=llm)


# query index
query_engine = vector_index.as_query_engine()
query = "What battles took place in New York City in the American Revolution?"
response = query_engine.query(query)
eval_result = evaluator.evaluate_response(query=query, response=response)
print(str(eval_result))
```

![](/assets/c5a75237e6ef.png)

同樣地，您也可以針對特定的 source node 進行評估。

```
from llama_index.core import VectorStoreIndex
from llama_index.llms.openai import OpenAI
from llama_index.core.evaluation import RelevancyEvaluator


# create llm
llm = OpenAI(model="gpt-4", temperature=0.0)


# build index
...


# define evaluator
evaluator = RelevancyEvaluator(llm=llm)


# query index
query_engine = vector_index.as_query_engine()
query = "What battles took place in New York City in the American Revolution?"
response = query_engine.query(query)
response_str = response.response
for source_node in response.source_nodes:
    eval_result = evaluator.evaluate(
        query=query,
        response=response_str,
        contexts=[source_node.get_content()],
    )
    print(str(eval_result.passing))
```

![](/assets/57122a9f6ff9.png)

## 問題生成

LlamaIndex 也可以生成用於回答問題的 question。將其與上述 evaluators 結合使用，您可以為您的資料建立一個完全自動化的評估流程。

```
from llama_index.core import SimpleDirectoryReader
from llama_index.llms.openai import OpenAI
from llama_index.core.llama_dataset.generator import RagDatasetGenerator


# create llm
llm = OpenAI(model="gpt-4", temperature=0.0)


# build documents
documents = SimpleDirectoryReader("./data").load_data()


# define generator, generate questions
dataset_generator = RagDatasetGenerator.from_documents(
    documents=documents,
    llm=llm,
    num_questions_per_chunk=10,  # set the number of questions per nodes
)


rag_dataset = dataset_generator.generate_questions_from_nodes()
questions = [e.query for e in rag_dataset.examples]
```


## 批次評估

我們也提供了一個 batch evaluation runner，用於對多個問題運行一組 evaluators。

```
from llama_index.core.evaluation import BatchEvalRunner


runner = BatchEvalRunner(
    {"faithfulness": faithfulness_evaluator, "relevancy": relevancy_evaluator},
    workers=8,
)


eval_results = await runner.aevaluate_queries(
    vector_index.as_query_engine(), queries=questions
)
```


## 整合

我們也與社群評估工具進行整合。

- [UpTrain](https://github.com/uptrain-ai/uptrain)
- [DeepEval](https://github.com/confident-ai/deepeval)
- [Ragas](https://github.com/explodinggradients/ragas/blob/main/docs/howtos/integrations/llamaindex.ipynb)

### DeepEval

[DeepEval](https://github.com/confident-ai/deepeval) 提供 6 個 evaluators（包括 3 個 RAG evaluators，用於 retriever 和 generator evaluation），並由其專有的 evaluation metrics 驅動。要安裝 `deepeval`：

```
pip install -U deepeval
```

然後您可以匯入並使用 `deepeval` 中的 evaluators。完整範例：

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from deepeval.integrations.llama_index import DeepEvalAnswerRelevancyEvaluator


documents = SimpleDirectoryReader("YOUR_DATA_DIRECTORY").load_data()
index = VectorStoreIndex.from_documents(documents)
rag_application = index.as_query_engine()


# An example input to your RAG application
user_input = "What is LlamaIndex?"


# LlamaIndex returns a response object that contains
# both the output string and retrieved nodes
response_object = rag_application.query(user_input)


evaluator = DeepEvalAnswerRelevancyEvaluator()
evaluation_result = evaluator.evaluate_response(
    query=user_input, response=response_object
)
print(evaluation_result)
```

以下是如何匯入 `deepeval` 中的所有 6 個 evaluators：

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

如需了解如何使用 `deepeval` 的 evaluation metrics 與 LlamaIndex 結合，並利用其完整的 LLM testing suite，請造訪 [docs.](https://docs.confident-ai.com/docs/integrations-llamaindex)