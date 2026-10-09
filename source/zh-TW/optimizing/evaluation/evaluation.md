---
title: "評估"
---

## 準備工作

LlamaIndex 旨在將您的資料與 LLM 應用程式連結。

有時候，即使透過查看 trace 診斷並修正了 bug，仍需要更細粒度的評估來系統性地診斷問題。

LlamaIndex 旨在提供相關工具，讓識別問題與接收有用的診斷訊號變得簡單。

與評估密切相關的概念還包括實驗（experimentation）與實驗追蹤（experiment tracking）。

## 通用策略

在開發 LLM 應用程式時，建議先定義端到端（end-to-end）的評估 workflow；一旦您開始收集失敗案例或邊緣案例（corner cases），並對哪些部分運作良好或不良好產生直覺後，可以再深入評估並優化特定元件。

這可以類比為軟體測試中的整合測試（integration tests）與單元測試（unit tests）。當您開始調整個別元件時，應該開始撰寫單元測試。同樣地，判斷各部分是否協作良好的金標準則是整合測試。兩者同樣重要。

- [End-to-end Evaluation](/python/framework/optimizing/evaluation/e2e_evaluation/)
- [Component-Wise Evaluation](/python/framework/optimizing/evaluation/component_wise_evaluation/)

以下是現有評估模組的概覽。我們將隨時間增加更多模組與支援。

- [Evaluation Overview](/python/framework/module_guides/evaluating/)

### E2E 或 Component-Wise - 我該從哪個開始？

如果您想在迭代過程中掌握系統的整體表現，將核心開發迴圈圍繞在 e2e eval 展開是合理的，將其作為整體的 sanity check 或 vibe check。

如果您對開發方向已有明確想法，並希望逐步迭代每個元件、隨進度逐步建構，則可以從 component-wise eval 開始。然而，這可能會面臨過早最佳化（premature optimization）的風險——在未評估整體應用需求的情況下就進行模型選擇或參數設定。在建立最終應用程式時，您可能需要重新審視這些選擇。

## 深入探討評估

評估是一個具有爭議的話題，隨著 NLP 領域的演進，評估方法也隨之改變。

在強大的基礎模型執行標記（annotation）任務已優於人類標記者的時代，評估的最佳實踐不斷在變動。先前用於啟動與評估現今模型的評估方法（例如 BLEU 或 F1），已被證明與人類判斷的相關性較低，因此需謹慎使用。

通常，以生成為主、開放式的任務，以及需要判斷或觀點的任務，由於其主觀性質，比事實性問題更難自動評估。我們將致力於提供更多指南與案例研究，說明在特定情境下應採取哪些適當的方法。

### 標準指標

針對標記過的資料集（無論是您自己的資料或學術基準），有幾個建議了解的標準指標：

1. **Exact Match (EM)：** 回答完全正確的查詢百分比。
2. **Recall：** 回答正確的查詢百分比，不論回傳的答案數量。
3. **Precision：** 回答正確的查詢百分比，除以回傳的答案數量。
4. **F1：** F1 分數是 precision 與 recall 的調和平均數。因此，它能透過單一指標對稱地代表 precision 與 recall，並同時考慮偽陽性（false positives）與偽陰性（false negatives）。

這篇 [towardsdatascience 文章](https://towardsdatascience.com/ranking-evaluation-metrics-for-recommender-systems-263d0a66ef54) 更深入地介紹了 NDCG、MAP 和 MRR 等技術指標。

## 案例研究與資源

1. (課程) [Data-Centric AI (MIT), 2023](https://www.youtube.com/playlist?list=PLnSYPjg2dHQKdig0vVbN-ZnEU0yNJ1mo5)
2. [Scale’s Approach to LLM Testing and Evaluation](https://scale.com/llm-test-evaluation)
3. [LLM Patterns by Eugene Yan](https://eugeneyan.com/writing/llm-patterns/)

## 資源

- [Component-Wise Evaluation](/python/framework/optimizing/evaluation/component_wise_evaluation/)
- [End-to-end Evaluation](/python/framework/optimizing/evaluation/e2e_evaluation/)