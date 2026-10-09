---
title: "使用 TruLens 進行評估與追蹤"
---

此頁介紹如何使用 [TruLens](https://trulens.org/) 來評估和追蹤建於 Llama-Index 的 LLM 應用程式。

## 什麼是 TruLens？

TruLens 是一個 [opensource](https://github.com/truera/trulens) 套件，為基於大型語言模型 (LLM) 的應用程式提供儀表和評估工具。這包括相關性、情感等的回饋函式評估，以及包含成本和延遲的深入追蹤。

![TruLens 架構](/assets/c20bd108459b.png)

當您迭代您的 LLM 應用程式的新版本時，您可以比較它們在所有設定的各類品質指標上的表現。您還可以在記錄層級查看評估結果，並探索每個記錄的應用程式 metadata。

### 安裝與設定

新增 TruLens 非常簡單，只需從 pypi 安裝即可！

終端機視窗

```
pip install trulens-eval
```

```
from trulens_eval import TruLlama
```

## 試用它！

[llama\_索引\_quickstart.ipynb](https://github.com/truera/trulens/blob/trulens-eval-0.20.3/trulens_eval/examples/quickstart/llama_index_quickstart.ipynb)

[![Open In Colab](/assets/e79852128a5f.svg)](https://colab.research.google.com/github/truera/trulens/blob/main/trulens_eval/examples/quickstart/llama_index_quickstart.ipynb)

## 閱讀更多

- [使用 LlamaIndex 和 TruLens 建置與評估 LLM 應用程式](https://medium.com/llamaindex-blog/build-and-evaluate-llm-apps-with-llamaindex-and-trulens-6749e030d83c)
- [更多範例](https://github.com/truera/trulens/tree/main/trulens_eval/examples/expositional/frameworks/llama_index)
- [trulens.org](https://www.trulens.org/)