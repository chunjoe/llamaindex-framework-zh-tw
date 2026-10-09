---
title: "結構化資料擷取"
---

LLMs 能夠擷取大量非結構化資料並以結構化格式回傳，而 LlamaIndex 則會讓這變得容易。

使用 LlamaIndex，您可以取得一個 LLM 來讀取自然語言並識別語義上重要的細節，例如姓名、日期、地址和數字，並以一致的結構化格式回傳，無論來源格式為何。

這在您有聊天記錄和對話文字記錄等非結構化來源資料時尤其有用。

一旦您取得結構化資料，可以將其傳送給 database，或者在程式碼中解析結構化輸出以自動化 workflows。

## 完整教學

我們的 Learn 區有 [structured data extraction 的完整教學](/python/framework/understanding/extraction/)。我們建議從那裡開始。

還有一個 [範例 notebook](https://developers.llamaindex.ai/python/examples/structured_outputs/structured_outputs/index.md) 來說明教學中一些技術。

## 其他指南

如需更全面的了解使用 LlamaIndex 進行結構化資料擷取，包括較底層的 modules，請查看以下指南：

- [Structured Outputs](/python/framework/module_guides/querying/structured_outputs/)
- [Pydantic Programs](/python/framework/module_guides/querying/structured_outputs/pydantic_program/)
- [Output Parsing](/python/framework/module_guides/querying/structured_outputs/output_parser/)

我們也有多模態結構化資料擷取。 [查看](/python/framework/use_cases/multimodal/#simple-evaluation-of-multi-modal-rag)。

## 雜項範例

一些強調使用案例的額外範例：

- [從人物描述中擷取姓名和地點](https://developers.llamaindex.ai/python/examples/output_parsing/df_program/index.md)
- [從音樂評論中擷取專輯資料](https://developers.llamaindex.ai/python/examples/llm/llama_api/index.md)
- [從電子郵件中擷取資訊](https://developers.llamaindex.ai/python/examples/usecases/email_data_extraction/index.md)