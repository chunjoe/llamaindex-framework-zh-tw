---
title: "Vercel AI Gateway"
---

AI Gateway 是 Vercel 的一個代理服務，用於將模型請求路由到不同的 AI 提供者。它為多個提供者提供一個統一的 API，並讓您能夠設定預算、監控使用量、負載平衡請求以及管理備援。您可以在他們的 [文件](https://vercel.com/docs/ai-gateway) 處了解更多資訊。

如果您在 Colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-llms-vercel-ai-gateway
```

```
!pip install llama-index
```

```
from llama_index.llms.vercel_ai_gateway import VercelAIGateway
from llama_index.core.llms import ChatMessage


llm = VercelAIGateway(
    model="anthropic/claude-4-sonnet",
    max_tokens=64000,
    context_window=200000,
    api_key="your-api-key",
    default_headers={
        "http-referer": "https://myapp.com/",  # Optional: Your app URL
        "x-title": "My App",  # Optional: Your app name
    },
)


print(llm.model)
```

## 呼叫 `chat` 搭配 ChatMessage List

您需要設定環境變數 `VERCEL_AI_GATEWAY_API_KEY` 或 `VERCEL_OIDC_TOKEN`，或在 class constructor 中設定 api\_key。

```
# import os
# os.environ['VERCEL_AI_GATEWAY_API_KEY'] = '<your-api-key>'


llm = VercelAIGateway(
    api_key="pBiuCWfswZCDxt8D50DSoBfU",
    max_tokens=64000,
    context_window=200000,
    model="anthropic/claude-4-sonnet",
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

## 呼叫 `complete` 搭配 Prompt

```
resp = llm.complete("Tell me a joke")
print(resp)
```

```
resp = llm.stream_complete("Tell me a story in 250 words")
for r in resp:
    print(r.delta, end="")
```

## 模型配置

```
# This example uses Anthropic's Claude 4 Sonnet (models are specified as `provider/model`):
llm = VercelAIGateway(
    model="anthropic/claude-4-sonnet",
    api_key="pBiuCWfswZCDxt8D50DSoBfU",
)
```

```
resp = llm.complete("Write a story about a dragon who can code in Rust")
print(resp)
```
