---
title: "Apertis"
---

Apertis 提供一個統一的 API gateway，可透過 OpenAI 相容的介面存取多個 LLM 提供者，包括 OpenAI、Anthropic、Google 等。您可以在 [文件](https://docs.stima.tech/) 了解更多資訊。

**支援的 Endpoint：**

- `/v1/chat/completions` - OpenAI Chat Completions 格式（預設）
- `/v1/responses` - OpenAI Responses 格式相容
- `/v1/messages` - Anthropic 格式相容

如果您在 colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-llms-apertis
```

```
!pip install llama-index
```

```
from llama_index.llms.apertis import Apertis
from llama_index.core.llms import ChatMessage
```

## 呼叫 `chat` 傳入 ChatMessage List

您需要設定 env var `APERTIS_API_KEY` 或在 class constructor 中設定 api\_key。

```
# import os
# os.environ['APERTIS_API_KEY'] = '<your-api-key>'


llm = Apertis(
    api_key="<your-api-key>",
    max_tokens=256,
    context_window=4096,
    model="gpt-5.2",
)
```

```
message = ChatMessage(role="user", content="Tell me a joke")
resp = llm.chat([message])
print(resp)
```

### Streaming

```
message = ChatMessage(role="user", content="Tell me a story in 250 words")
resp = llm.stream_chat([message])
for r in resp:
    print(r.delta, end="")
```

## 呼叫 `complete` 傳入 Prompt

```
resp = llm.complete("Tell me a joke")
print(resp)
```

```
resp = llm.stream_complete("Tell me a story in 250 words")
for r in resp:
    print(r.delta, end="")
```

## 模型設定

Apertis 支援來自多個提供者的模型：

| Provider | 範例模型 |
| :--- | :--- |
| OpenAI | `gpt-5.2`, `gpt-5-mini-2025-08-07` |
| Anthropic | `claude-sonnet-4.5` |
| Google | `gemini-3-flash-preview` |

```
# Using Claude
llm = Apertis(model="claude-sonnet-4.5")
```

```
resp = llm.complete("Write a story about a dragon who can code in Rust")
print(resp)
```

```
# Using Gemini
llm = Apertis(model="gemini-3-flash-preview")
```

```
resp = llm.complete("Explain quantum computing in simple terms")
print(resp)
```
