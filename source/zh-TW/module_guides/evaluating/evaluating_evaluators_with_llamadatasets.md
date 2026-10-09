---
title: "使用 `LabelledEvaluatorDataset` 評估 Evaluators"
---

llama-datasets 的目的是為建構者提供快速評估 LLM 系統或任務的工具。基於此精神，`LabelledEvaluatorDataset` 旨在以無縫且輕鬆的方式促進評估者（evaluators）的評估。

此資料集包含主要具有以下屬性的範例：`query`、`answer`、`ground_truth_answer`、`reference_score` 和 `reference_feedback`，以及一些其他補充屬性。使用此資料集產生評估的流程包括使用提供的 LLM 評估者對資料集進行預測，然後計算衡量評估好壞的指標，透過將其與對應的參考進行計算比較。

以下是使用 `EvaluatorBenchmarkerPack` 來方便處理上述流程的程式碼片段。

```
from llama_index.core.llama_dataset import download_llama_dataset
from llama_index.core.llama_pack import download_llama_pack
from llama_index.core.evaluation import CorrectnessEvaluator
from llama_index.llms.gemini import Gemini


# download dataset
evaluator_dataset, _ = download_llama_dataset(
    "MiniMtBenchSingleGradingDataset", "./mini_mt_bench_data"
)


# define evaluator
gemini_pro_llm = Gemini(model="models/gemini-pro", temperature=0)
evaluator = CorrectnessEvaluator(llm=gemini_pro_llm)


# download EvaluatorBenchmarkerPack and define the benchmarker
EvaluatorBenchmarkerPack = download_llama_pack(
    "EvaluatorBenchmarkerPack", "./pack"
)
evaluator_benchmarker = EvaluatorBenchmarkerPack(
    evaluator=evaluators["gpt-3.5"],
    eval_dataset=evaluator_dataset,
    show_progress=True,
)


# produce the benchmark result
benchmark_df = await evaluator_benchmarker.arun(
    batch_size=5, sleep_time_in_seconds=0.5
)
```

## 相關的 `LabelledPairwiseEvaluatorDataset`

一個相關的 llama-dataset 是 `LabelledPairwiseEvaluatorDataset`，它同樣旨在評估評估者，但這次評估者被任務到比較一對 LLM 回應與給定的查詢，並在它們之間決定哪個更好。上述描述的使用流程與 `LabelledEvaluatorDataset` 的流程完全相同，唯一的區別是 LLM 評估者必須具備執行成對評估任務的能力——即必須是 `PairwiseComparisonEvaluator`。

## 更多學習資料

要看到這些資料集的作用，請查看下方列出的筆記本，這些筆記本在略微修改的 MT-Bench 資料集上對 LLM 評估者進行了基準測試。

- [MTBench Single Grading](https://developers.llamaindex.ai/python/examples/evaluation/mt_bench_single_grading/index.md)
- [MTBench Human Judge](https://developers.llamaindex.ai/python/examples/evaluation/mt_bench_human_judgement/index.md)