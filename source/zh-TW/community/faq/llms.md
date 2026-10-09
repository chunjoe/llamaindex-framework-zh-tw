---
title: "大型語言模型"
---

##### 常見問題 (FAQ)

1. [如何使用自訂/本地 embedding model？](/python/framework/community/faq/llms/#1-how-to-define-a-custom-llm)
2. [如何使用本地 hugging face embedding model？](/python/framework/community/faq/llms/#2-how-to-use-a-different-openai-model)
3. [我如何自訂我的 prompt？](/python/framework/community/faq/llms/#3-how-can-i-customize-my-prompt)
4. [是否需要微調我的 model？](/python/framework/community/faq/llms/#4-is-it-required-to-fine-tune-my-model)
5. [我希望 LLM 的回答是中文/義大利文/法文，但只用英文回答，該如何操作？](/python/framework/community/faq/llms/#5-i-want-to-the-llm-answer-in-chineseitalianfrench-but-only-answers-in-english-how-to-proceed)
6. [LlamaIndex 是否支援 GPU 加速？](/python/framework/community/faq/llms/#6-is-llamaindex-gpu-accelerated)

---

##### 1. 如何定義自訂的 LLM？

您可以前往 [自訂用法](/python/framework/module_guides/models/llms/usage_custom/#example-using-a-custom-llm-model-advanced) 來定義自訂的 LLM。

---

##### 2. 如何使用不同的 OpenAI model？

若要使用不同的 OpenAI model，您可以前往 [設定 Model](https://developers.llamaindex.ai/python/examples/llm/openai/index.md) 來設定您自己的自訂 model。

---

##### 3. 我如何自訂我的 prompt？

您可以前往 [Prompts](/python/framework/module_guides/models/prompts/) 來了解如何自訂您的 prompt。

---

##### 4. 是否需要微調我的 model？

不需要。有獨立的 modules 可能會提供更好的結果，但並非必要，您可以使用 llamaindex 而無需微調 model。

---

##### 5. 我希望 LLM 的回答是中文/義大利文/法文，但只用英文回答，該如何操作？

若要獲得 LLM 以其他語言回答更準確的結果，您可以更新 prompt 以強制輸出語言。

```
response = query_engine.query("Rest of your query... \nRespond in Italian")
```

或者：

```
from llama_index.core import Settings
from llama_index.llms.openai import OpenAI


llm = OpenAI(system_prompt="Always respond in Italian.")


# set a global llm
Settings.llm = llm


query_engine = load_index_from_storage(
    storage_context,
).as_query_engine()
```

---

##### 6. LlamaIndex 是否支援 GPU 加速？

是的，在本地運行時，您可以將語言模型 (LLM) 運行在 GPU 上。您可以在 [llama2 setup](https://developers.llamaindex.ai/python/examples/vector_stores/simpleindexdemollama-local/index.md) 文件中找到設定 LLMs 支援 GPU 的範例。