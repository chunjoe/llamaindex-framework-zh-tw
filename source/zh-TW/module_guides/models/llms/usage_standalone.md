---
title: "使用 LLMs 作為獨立模組"
---

您可以使用我們的 LLM 模組單獨使用。

## 文字補全範例

```
from llama_index.llms.openai import OpenAI


# non-streaming
completion = OpenAI().complete("Paul Graham is ")
print(completion)


# using streaming endpoint
from llama_index.llms.openai import OpenAI


llm = OpenAI()
completions = llm.stream_complete("Paul Graham is ")
for completion in completions:
    print(completion.delta, end="")
```

## 聊天範例

```
from llama_index.core.llms import ChatMessage
from llama_index.llms.openai import OpenAI


messages = [
    ChatMessage(
        role="system", content="You are a pirate with a colorful personality"
    ),
    ChatMessage(role="user", content="What is your name"),
]
resp = OpenAI().chat(messages)
print(resp)
```

請查看我們的 [模組部分](/python/framework/module_guides/models/llms/modules/) 以獲取每個 LLM 的使用指南。