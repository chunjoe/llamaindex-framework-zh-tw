---
title: "提示"
---

## 概念

Prompting 是賦予 LLMs 表達能力的基礎輸入。LlamaIndex 使用 prompts 來建構 index、執行 insertion、在 querying 期間執行 traversal，以及合成最終答案。

在建構 agentic workflows 時，建構和管理 prompts 是開發過程中的關鍵部分。LlamaIndex 提供了一種靈活且強大的方式來管理 prompts，並以各種方式使用它們。

- `RichPromptTemplate` - 用於建構具有變數和邏輯的 jinja-style prompts 的最新風格
- `PromptTemplate` - 用於使用單一 f-string 建構 prompts 的舊式簡單模板
- `ChatPromptTemplate` - 用於使用 messages 和 f-strings 建構 chat prompts 的舊式簡單模板

LlamaIndex 使用一組 [default prompt templates](https://github.com/run-llama/llama_index/blob/main/llama-index-core/llama_index/core/prompts/default_prompts.py)，這些模板開箱即用即可良好運作。

此外，還有一些專門為 chat models 編寫和使用的 prompts，例如 `gpt-3.5-turbo` [此處](https://github.com/run-llama/llama_index/blob/main/llama-index-core/llama_index/core/prompts/chat_prompts.py)。

使用者也可以提供自己的 prompt templates 來進一步自訂框架的行為。自訂的最佳方法是複製上方連結中的 default prompt，並將其作為任何修改的基礎。

## 使用模式

使用 prompts 非常簡單。以下是如何使用 `RichPromptTemplate` 來建構一個 jinja-style prompt template 的範例：

```
from llama_index.core.prompts import RichPromptTemplate


template_str = """We have provided context information below.
---------------------
{{ context_str }}
---------------------
Given this information, please answer the question: {{ query_str }}
"""
qa_template = RichPromptTemplate(template_str)


# you can create text prompt (for completion API)
prompt = qa_template.format(context_str=..., query_str=...)


# or easily convert to message prompts (for chat API)
messages = qa_template.format_messages(context_str=..., query_str=...)
```

請參閱我們的 [使用模式指南](/python/framework/module_guides/models/prompts/usage_pattern/) 以了解更多關於充分利用 `RichPromptTemplate` 以及其他 prompt templates 的詳細資訊。

## 範例指南

Prompt 工程指南

- [Advanced Prompts](https://developers.llamaindex.ai/python/examples/prompts/advanced_prompts/index.md)
- [RichPromptTemplate Features](https://developers.llamaindex.ai/python/examples/prompts/rich_prompt_template_features/index.md)

簡單自訂範例

- [Completion prompts](https://developers.llamaindex.ai/python/examples/customization/prompts/completion_prompts/index.md)
- [Chat prompts](https://developers.llamaindex.ai/python/examples/customization/prompts/chat_prompts/index.md)
- [Prompt Mixin](https://developers.llamaindex.ai/python/examples/prompts/prompt_mixin/index.md)

Experimental

- [Emotion Prompting](https://developers.llamaindex.ai/python/examples/prompts/emotion_prompt/index.md)