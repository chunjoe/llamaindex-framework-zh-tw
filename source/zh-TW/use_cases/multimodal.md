---
title: "多模態"
---

LlamaIndex 不僅能用來建構語言應用，也能建構結合語言與影像的**多模態**應用。

## 多模態使用案例類型

這個領域目前仍在積極探索，也陸續出現一些令人振奮的應用案例。

### RAG（檢索增強生成）

索引、檢索與合成等核心 RAG 概念，也能延伸至影像情境。

- 輸入可以是文字或影像。
- 儲存的知識庫可以包含文字或影像。
- 回應生成的輸入可以是文字或影像。
- 最終回應可以是文字或影像。

請參閱以下指南：

- [GPT-4V 多模態](https://developers.llamaindex.ai/python/examples/multi_modal/gpt4v_multi_modal_retrieval/index.md)
- [使用 CLIP 進行多模態檢索](https://developers.llamaindex.ai/python/examples/multi_modal/multi_modal_retrieval/index.md)
- [影像到影像檢索](https://developers.llamaindex.ai/python/examples/multi_modal/image_to_image_retrieval/index.md)
- [結構化影像檢索](https://developers.llamaindex.ai/python/examples/multi_modal/structured_image_retrieval/index.md)
- [Chroma 多模態](https://developers.llamaindex.ai/python/examples/multi_modal/chromamultimodaldemo/index.md)
- [Gemini 多模態](https://developers.llamaindex.ai/python/examples/multi_modal/gemini/index.md)

### 結構化輸出

透過 LlamaIndex，現在可以使用新的 OpenAI GPT4V 產生 `structured` 輸出。使用者只要指定 Pydantic 物件，即可定義輸出的結構。

請參閱以下指南：

- [多模態 Pydantic 程式](https://developers.llamaindex.ai/python/examples/multi_modal/multi_modal_pydantic/index.md)

### 檢索增強式影像描述

理解影像時，往往需要從知識庫查找相關資訊。檢索增強式影像描述的流程是：先使用多模態模型為影像產生描述，再從文字語料庫檢索資訊來完善描述。

請參閱以下指南：

- [Llava + Testla 10Q](https://developers.llamaindex.ai/python/examples/multi_modal/llava_multi_modal_tesla_10q/index.md)

### 代理程式

以下是展示 GPT-4V 代理能力的初期範例。

- [多模態代理程式](/python/framework/module_guides/deploying/agents/#multi-modal-agents)
- [GPT-4V 實驗](https://developers.llamaindex.ai/python/examples/multi_modal/gpt4v_experiments_cot/index.md)

## 評估與比較

以下各節比較不同多模態模型在各種使用情境中的表現。

### LLaVa-13、Fuyu-8B 與 MiniGPT-4 多模態 LLM 模型的影像推理比較

這些 Notebook 示範如何使用不同的多模態 LLM 模型理解或推理影像。這些模型的推論可透過 Replicate 或 OpenAI GPT4-V API 執行。我們比較了幾種常見的多模態 LLM：

- GPT4-V (OpenAI API)
- LLava-13B (Replicate)
- Fuyu-8B (Replicate)
- MiniGPT-4 (Replicate)
- CogVLM (Replicate)

請參閱以下指南：

- [Replicate 多模態](https://developers.llamaindex.ai/python/examples/multi_modal/replicate_multi_modal/index.md)
- [GPT4-V](https://developers.llamaindex.ai/python/examples/multi_modal/openai_multi_modal/index.md)

### 多模態 RAG 簡易評估

本 Notebook 指南將示範如何評估多模態 RAG 系統。和純文字情境一樣，我們會分別評估 Retriever 與 Generator。正如我們在多模態 RAG 評估相關部落格中提到的，這裡會採用調整後的常見技術，分別評估 Retriever 和 Generator（原本用於純文字情境）。這些調整版收錄於 llama-index 函式庫（也就是 evaluation 模組）；本 Notebook 會示範如何將它們用於你的評估情境。

- [多模態 RAG 評估](https://developers.llamaindex.ai/python/examples/evaluation/multi_modal/multi_modal_rag_evaluation/index.md)

## 模型指南

以下 Notebook 指南介紹如何與不同的多模態模型供應商互動。

- [OpenAI 多模態](https://developers.llamaindex.ai/python/examples/multi_modal/openai_multi_modal/index.md)
- [Replicate 多模態](https://developers.llamaindex.ai/python/examples/multi_modal/replicate_multi_modal/index.md)
