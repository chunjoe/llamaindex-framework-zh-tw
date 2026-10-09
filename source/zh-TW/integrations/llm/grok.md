---
title: "Grok 4"
---

Grok from xAI 使用 OpenAI-compatible API，因此您可以使用 OpenAILike integration class。

```
!pip install llama-index-llms-openai-like
```

```
grok_api_key = "xai-xxxxxxxx"
```

```
from llama_index.llms.openai_like import OpenAILike


llm = OpenAILike(
    model="grok-4-0709",
    api_base="https://api.x.ai/v1",
    api_key=grok_api_key,
    context_window=128000,
    is_chat_model=True,
    is_function_calling_model=False,
)


response = llm.complete("Hello World!")
print(str(response))
```

```
Hello World! 🌍 That's the universal greeting for programmers everywhere. What adventure brings you here today? 😊
```
