---
title: "Tonic Validate"
---

## 什麼是 Tonic Validate

Tonic Validate 是一套協助開發者評估檢索增強生成（RAG）系統效能的工具。您可以用它快速抽查 LlamaIndex 設定的表現，也可以將它整合進現有的 CI/CD 流程，例如 GitHub Actions。Tonic Validate 由兩個部分組成：

1. 開源 SDK
2. [網頁介面（Web UI）](https://validate.tonic.ai/)

您也可以只使用 SDK，不搭配 Web UI。SDK 已包含評估 RAG 系統所需的工具；Web UI 則提供視覺化介面，讓您更容易掌握系統表現，不必只看原始數字。

若要使用 Web UI，請前往 [這裡](https://validate.tonic.ai/) 註冊免費帳戶。

## 如何使用 Tonic Validate

### 設定 Tonic Validate

使用以下指令安裝 Tonic Validate：

```
pip install tonic-validate
```

使用 Tonic Validate 時需要提供 OpenAI API 金鑰，因為後端會呼叫 LLM 計算分數。將金鑰設為 `OPENAI_API_KEY` 環境變數即可。

```
import os


os.environ["OPENAI_API_KEY"] = "put-your-openai-api-key-here"
```

若要將結果上傳到 UI，請先設定建立帳戶時取得的 Tonic Validate API 金鑰，並確認已註冊 [Web UI](https://validate.tonic.ai/)。尚未註冊的話，請前往 [這裡](https://validate.tonic.ai/) 建立帳戶。取得 API 金鑰後，將它設為 `TONIC_VALIDATE_API_KEY` 環境變數即可。

```
import os


os.environ["TONIC_VALIDATE_API_KEY"] = "put-your-validate-api-key-here"
```

### 單一問題使用範例

以下範例有一個問題及其參考答案，但 LLM 的回答與參考答案不完全一致。檢索結果包含兩段上下文，其中一段提供了正確答案。

```
question = "What makes Sam Altman a good founder?"
reference_answer = "He is smart and has a great force of will."
llm_answer = "He is a good founder because he is smart."
retrieved_context_list = [
    "Sam Altman is a good founder. He is very smart.",
    "What makes Sam Altman such a good founder is his great force of will.",
]
```

答案相似度分數介於 0 到 5，用來衡量 LLM 的回答與參考答案有多相符。此例兩者並非完全一致，因此分數不會是滿分 5 分。

```
answer_similarity_evaluator = AnswerSimilarityEvaluator()
score = await answer_similarity_evaluator.aevaluate(
    question,
    llm_answer,
    retrieved_context_list,
    reference_response=reference_answer,
)
print(score)
# >> EvaluationResult(query='What makes Sam Altman a good founder?', contexts=['Sam Altman is a good founder. He is very smart.', 'What makes Sam Altman such a good founder is his great force of will.'], response='He is a good founder because he is smart.', passing=None, feedback=None, score=4.0, pairwise_source=None, invalid_result=False, invalid_reason=None)
```

答案一致性分數介於 0.0 到 1.0，用來衡量回答是否包含檢索上下文中沒有的資訊。此例的回答確實出現在檢索到的上下文中，因此分數為 1。

```
answer_consistency_evaluator = AnswerConsistencyEvaluator()




score = await answer_consistency_evaluator.aevaluate(
    question, llm_answer, retrieved_context_list
)
print(score)
# >> EvaluationResult(query='What makes Sam Altman a good founder?', contexts=['Sam Altman is a good founder. He is very smart.', 'What makes Sam Altman such a good founder is his great force of will.'], response='He is a good founder because he is smart.', passing=None, feedback=None, score=1.0, pairwise_source=None, invalid_result=False, invalid_reason=None)
```

增補準確率表示檢索到的上下文有多少比例出現在回答中。此例有一段檢索內容出現在回答裡，因此分數為 0.5。

```
augmentation_accuracy_evaluator = AugmentationAccuracyEvaluator()




score = await augmentation_accuracy_evaluator.aevaluate(
    question, llm_answer, retrieved_context_list
)
print(score)
# >> EvaluationResult(query='What makes Sam Altman a good founder?', contexts=['Sam Altman is a good founder. He is very smart.', 'What makes Sam Altman such a good founder is his great force of will.'], response='He is a good founder because he is smart.', passing=None, feedback=None, score=0.5, pairwise_source=None, invalid_result=False, invalid_reason=None)
```

增補精確率衡量與回答相關的檢索內容是否納入回答。此例的兩段內容都相關，但只有一段納入回答，因此分數為 0.5。

```
augmentation_precision_evaluator = AugmentationPrecisionEvaluator()




score = await augmentation_precision_evaluator.aevaluate(
    question, llm_answer, retrieved_context_list
)
print(score)
# >> EvaluationResult(query='What makes Sam Altman a good founder?', contexts=['Sam Altman is a good founder. He is very smart.', 'What makes Sam Altman such a good founder is his great force of will.'], response='He is a good founder because he is smart.', passing=None, feedback=None, score=0.5, pairwise_source=None, invalid_result=False, invalid_reason=None)
```

檢索精確率衡量檢索到的上下文中有多少與問題相關。此例兩段上下文都相關，因此分數為 1.0。

```
retrieval_precision_evaluator = RetrievalPrecisionEvaluator()




score = await retrieval_precision_evaluator.aevaluate(
    question, llm_answer, retrieved_context_list
)
print(score)
# >> EvaluationResult(query='What makes Sam Altman a good founder?', contexts=['Sam Altman is a good founder. He is very smart.', 'What makes Sam Altman such a good founder is his great force of will.'], response='He is a good founder because he is smart.', passing=None, feedback=None, score=1.0, pairwise_source=None, invalid_result=False, invalid_reason=None)
```

TonicValidateEvaluator 可以一次計算 Tonic Validate 的所有指標。

```
tonic_validate_evaluator = TonicValidateEvaluator()




scores = await tonic_validate_evaluator.aevaluate(
    question,
    llm_answer,
    retrieved_context_list,
    reference_response=reference_answer,
)
print(scores.score_dict)
# >> {
#     'answer_consistency': 1.0,
#     'answer_similarity': 4.0,
#     'augmentation_accuracy': 0.5,
#     'augmentation_precision': 0.5,
#     'retrieval_precision': 1.0
# }
```

### 一次評估多個問題

您也可以使用 TonicValidateEvaluator 一次評估多個查詢與回答，並取得可記錄到 [Tonic Validate UI](https://validate.tonic.ai/) 的 tonic\_validate Run 物件。

請將問題、LLM 回答、檢索到的上下文清單與參考答案分別放入清單，再呼叫 evaluate\_run。

```
questions = ["What is the capital of France?", "What is the capital of Spain?"]
reference_answers = ["Paris", "Madrid"]
llm_answer = ["Paris", "Madrid"]
retrieved_context_lists = [
    [
        "Paris is the capital and most populous city of France.",
        "Paris, France's capital, is a major European city and a global center for art, fashion, gastronomy and culture.",
    ],
    [
        "Madrid is the capital and largest city of Spain.",
        "Madrid, Spain's central capital, is a city of elegant boulevards and expansive, manicured parks such as the Buen Retiro.",
    ],
]




tonic_validate_evaluator = TonicValidateEvaluator()




scores = await tonic_validate_evaluator.aevaluate_run(
    [questions], [llm_answers], [retrieved_context_lists], [reference_answers]
)
print(scores.run_data[0].scores)
# >> {
#     'answer_consistency': 1.0,
#     'answer_similarity': 3.0,
#     'augmentation_accuracy': 0.5,
#     'augmentation_precision': 0.5,
#     'retrieval_precision': 1.0
# }
```

### 將結果上傳到 UI

若要將評分結果上傳到 UI，可以使用 Tonic Validate API。請先依照[設定 Tonic Validate](/python/framework/community/integrations/tonicvalidate/#setting-up-tonic-validate)一節的說明設定 `TONIC_VALIDATE_API_KEY`。您也需要先在 Tonic Validate UI 建立專案並複製專案 ID。API 金鑰與專案都準備好後，就能初始化 Validate API 並上傳結果。

```
validate_api = ValidateApi()
project_id = "your-project-id"
validate_api.upload_run(project_id, scores)
```

現在可以在 Tonic Validate UI 查看結果了！

![Tonic Validate 圖表](/assets/455e30fe086e.png)

### 端到端範例

接下來示範如何搭配 Llama Index 端到端使用 Tonic Validate。先用 Llama Index CLI 下載要處理的資料集：

終端機視窗

```
llamaindex-cli download-llamadataset EvaluatingLlmSurveyPaperDataset --download-dir ./data
```

現在建立一個名為 `llama.py` 的 Python 檔案，並加入以下程式碼。

```
from llama_index.core import SimpleDirectoryReader
from llama_index.core import VectorStoreIndex




documents = SimpleDirectoryReader(input_dir="./data/source_files").load_data()
index = VectorStoreIndex.from_documents(documents=documents)
query_engine = index.as_query_engine()
```

這段程式會載入資料集檔案，並初始化 Llama Index。

Llama Index CLI 也會下載範例資料集的問答清單，供您用來測試。若要使用這些問答，請執行以下程式碼。

```
from llama_index.core.llama_dataset import LabelledRagDataset


rag_dataset = LabelledRagDataset.from_json("./data/rag_dataset.json")




# We are only going to do 10 questions as running through the full data set takes too long
questions = [item.query for item in rag_dataset.examples][:10]
reference_answers = [item.reference_answer for item in rag_dataset.examples][
    :10
]
```

接著向 Llama Index 查詢回答：

```
llm_answers = []
retrieved_context_lists = []
for question in questions:
    response = query_engine.query(question)
    context_list = [x.text for x in response.source_nodes]
    retrieved_context_lists.append(context_list)
    llm_answers.append(response.response)
```

接著可以用以下方式計算分數：

```
from tonic_validate.metrics import AnswerSimilarityMetric
from llama_index.evaluation.tonic_validate import TonicValidateEvaluator




tonic_validate_evaluator = TonicValidateEvaluator(
    metrics=[AnswerSimilarityMetric()], model_evaluator="gpt-4-1106-preview"
)


scores = tonic_validate_evaluator.evaluate_run(
    questions, retrieved_context_lists, reference_answers, llm_answers
)
print(scores.overall_scores)
```

若要將評分結果上傳到 UI，可以使用 Tonic Validate API。請先依照[設定 Tonic Validate](/python/framework/community/integrations/tonicvalidate/#setting-up-tonic-validate)一節的說明設定 `TONIC_VALIDATE_API_KEY`。您也需要先在 Tonic Validate UI 建立專案並複製專案 ID。API 金鑰與專案都準備好後，就能初始化 Validate API 並上傳結果。

```
validate_api = ValidateApi()
project_id = "your-project-id"
validate_api.upload_run(project_id, run)
```

## 更多文件

除了這裡的文件，也可以參閱 [Tonic Validate 的 GitHub 專案頁面](https://github.com/TonicAI/tonic_validate)，了解如何使用 API 上傳結果。
