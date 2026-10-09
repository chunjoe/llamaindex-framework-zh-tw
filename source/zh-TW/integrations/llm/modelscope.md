---
title: "ModelScope LLMS"
---

在本筆筆記中，我們將展示如何在使用 LlamaIndex 中使用 ModelScope LLM 模型。請參閱 [ModelScope site](https://www.modelscope.cn/)。

如果您在 Colab 中開啟此 Notebook，您需要安裝 LlamaIndex 🦙 和 modelscope。

```
!pip install llama-index-llms-modelscope
```

## 基本用法

```
import sys
from llama_index.llms.modelscope import ModelScopeLLM


llm = ModelScopeLLM(model_name="qwen/Qwen3-8B", model_revision="master")


rsp = llm.complete("Hello, who are you?")
print(rsp)
```

#### 使用 Message request

```
from llama_index.core.base.llms.types import MessageRole, ChatMessage


messages = [
    ChatMessage(
        role=MessageRole.SYSTEM, content="You are a helpful assistant."
    ),
    ChatMessage(role=MessageRole.USER, content="How to make cake?"),
]
resp = llm.chat(messages)
print(resp)
```
