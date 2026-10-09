---
title: "端到端評估"
---

End-to-End 評估應該是開發 RAG 應用程式的導向指標 —— 給定資料來源與一組查詢後，我的 workflow 是否能產生正確的回應？

雖然在初期個別檢查查詢與回應很有幫助，但隨著處理的失敗案例與邊緣案例增加，逐一檢查每個查詢將變得不再可行。相反地，定義一組摘要指標或自動化評估會更有幫助，讓你能直覺地掌握這些指標傳達的訊息，以及哪些部分需要深入分析。

## 設定評估集

建議先從一組規模小但多樣化的查詢開始，並在發現有問題的查詢或互動時，逐步增加更多範例。

我們開發了一些工具，可以根據一組要查詢的 documents 自動為您產生資料集（請參閱下方範例）。

- [Question Generation](https://developers.llamaindex.ai/python/examples/evaluation/questiongeneration/index.md)

未來，我們也將能針對工具自動建立資料集。

## 評估選項的光譜

當評估的應用程式有正確答案時，定量評估（Quantitative eval）會更有用 —— 例如：驗證在給定計畫的情況下，工具的選擇及其輸入是否正確，或檢索特定的資訊片段，或嘗試產生符合特定 schema 的中間輸出（例如 JSON 欄位）。

當產生旨在「有幫助」但未必需要完全精確的長篇回應時，定性評估（Qualitative eval）則較為適用。

評估選項存在一個光譜，範圍涵蓋指標、較便宜的模型、較昂貴的模型 (GPT4) 以及人工評估。

以下是 [evaluation modules](/python/framework/optimizing/evaluation/evaluation/) 的一些使用範例：

- [Batch Eval Runner](https://developers.llamaindex.ai/python/examples/evaluation/batch_eval/index.md)
- [Correctness Eval](https://developers.llamaindex.ai/python/examples/evaluation/correctness_eval/index.md)
- [Faithfulness Eval](https://developers.llamaindex.ai/python/examples/evaluation/faithfulness_eval/index.md)
- [Guideline Eval](https://developers.llamaindex.ai/python/examples/evaluation/guideline_eval/index.md)
- [Pairwise Eval](https://developers.llamaindex.ai/python/examples/evaluation/pairwise_eval/index.md)
- [Relevancy Eval](https://developers.llamaindex.ai/python/examples/evaluation/relevancy_eval/index.md)
- [Semantic Similarity Eval](https://developers.llamaindex.ai/python/examples/evaluation/semantic_similarity_eval/index.md)

## 探索 - 敏感度測試

在複雜的 workflow 中，可能很難釐清流程中的哪些部分影響了結果。

敏感度測試（Sensitivity testing）是一個很好的切入點，可用於決定哪些元件需要單獨測試或更深入地調整，或者資料集中的哪些部分（例如查詢）可能產生了有問題的結果。

關於如何使用敏感度測試等方法自動發現問題的更多詳細資訊將於近期推出。

在傳統 ML 領域中，這類工具的範例包括 [Giskard](https://docs.giskard.ai/en/latest/getting-started/quickstart.html)。

## 指標集成 (Metrics Ensembling)

隨著開發集規模擴大，使用 GPT-4 進行評估的成本可能會很高。

指標集成使用一組較弱的訊號（exact match, F1, ROUGE, BLEU, BERT-NLI 和 BERT-similarity）來預測更昂貴且更接近金標籤（人工標記/GPT-4）的評估方法之輸出。

其目的有二：

1. 在開發階段，能快速且低成本地在大型資料集上評估變更。
2. 在生產監控階段，標記出離群值以進行進一步評估（GPT-4 / 人工告警）。

我們也希望指標集成具有可解釋性 —— 相關性與權重分數應能指示哪些指標最能捕捉評估標準。

我們將在未來的更新中詳細討論相關方法論。