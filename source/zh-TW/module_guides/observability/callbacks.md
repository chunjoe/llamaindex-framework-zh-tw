---
title: "回呼"
---

## 概念

LlamaIndex 提供回調（callbacks）以協助除錯、追蹤和追蹤函式庫的內部運作。使用 callback manager，可以新增所需的任意數回調。

除了記錄與事件相關的資料外，您還可以追蹤每個事件的持續時間和發生次數。

此外，也會記錄事件的追蹤地圖（trace map），回調可以根據需要使用這些資料。例如，`LlamaDebugHandler` 會在大多數操作後印出事件的追蹤資訊。

**回調事件類型** 雖然每個回調可能不會使用每種事件類型，但以下事件可以被追蹤：

- `CHUNKING` -> 記錄文字分割的前後。
- `NODE_PARSING` -> 記錄被解析為的 documents 和 nodes。
- `EMBEDDING` -> 記錄嵌入的文本數量。
- `LLM` -> 記錄 LLM 呼叫的 template 和 response。
- `QUERY` -> 追蹤每個查詢的開始和結束。
- `RETRIEVE` -> 記錄為查詢檢索的 nodes。
- `SYNTHESIZE` -> 記錄 synthesize 呼叫的結果。
- `TREE` -> 記錄生成的摘要及其層級。
- `SUB_QUESTION` -> 記錄生成的子問題和答案。

您可以實作自己的回調來追蹤和追蹤這些事件，或使用現有的回調。

## 模組

目前支援的回調如下：

- [TokenCountingHandler](https://developers.llamaindex.ai/python/examples/observability/tokencountinghandler/index.md) -> 為 prompt、completion 和 embedding token 使用提供彈性的 token 統計。請參閱 [the migration details](/python/framework/module_guides/observability/callbacks/token_counting_migration/)。
- [LlamaDebugHanlder](https://developers.llamaindex.ai/python/examples/observability/llamadebughandler/index.md) -> 對事件進行基本的追蹤和追蹤。範例用法可在下方的 notebook 中找到。
- [WandbCallbackHandler](https://developers.llamaindex.ai/python/examples/observability/wandbcallbackhandler/index.md) -> 使用 Wandb Prompts 前端追蹤事件和追蹤。更多詳情請參閱下方的 notebook 或 [Wandb](https://docs.wandb.ai/guides/prompts/quickstart)。
- [AimCallback](https://developers.llamaindex.ai/python/examples/observability/aimcallback/index.md) -> 追蹤 LLM 的輸入和輸出。範例用法可在下方的 notebook 中找到。
- [OpenInferenceCallbackHandler](https://developers.llamaindex.ai/python/examples/observability/openinferencecallback/index.md) -> 追蹤 AI 模型推論。範例用法可在下方的 notebook 中找到。
- [OpenAIFineTuningHandler](https://github.com/jerryjliu/llama_index/blob/main/experimental/openai_fine_tuning/openai_fine_tuning.ipynb) -> 記錄所有 LLM 的輸入和輸出。然後，提供一個 `save_finetuning_events()` 函式，以以適合與 OpenAI 進行微調的格式儲存輸入和輸出。