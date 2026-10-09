---
title: "Helicone AI Gateway"
---

Helicone 是一個支援 OpenAI 的 AI Gateway，它能透過提供可觀察性、控制和快取的功能，將請求路由到多個提供者。請在 [Helicone docs](https://docs.helicone.ai/) 了解更多資訊，並查看可用的 [models](https://www.helicone.ai/models)。

如果您在 Colab 中開啟此 Notebook，您可能需要安裝以下整合套件。

備註：

- 只需您的 Helicone API 金鑰 (`HELICONE_API_KEY`)；不需要提供者金鑰。
- 預設的 base URL 是 `https://ai-gateway.helicone.ai/v1`。使用 `api_base` 或 `HELICONE_API_BASE` 覆蓋。

```
%pip install llama-index-llms-helicone
```

```
!pip install llama-index
```

```
from llama_index.llms.helicone import Helicone
from llama_index.core.llms import ChatMessage
```

## 使用 ChatMessage List 呼叫 `chat`

您需要設定環境變數 `HELICONE_API_KEY` 或在 constructor 中傳入 `api_key`。

```
# import os
# os.environ["HELICONE_API_KEY"] = "<your-helicone-api-key>"


llm = Helicone(
    api_key="<your-helicone-api-key>",  # or set HELICONE_API_KEY
    model="gpt-4o-mini",  # routed via the Helicone AI Gateway
    max_tokens=256,
)
```

```
message = ChatMessage(role="user", content="Tell me a joke")
resp = llm.chat([message])
print(resp)
```

### Streaming

```
message = ChatMessage(role="user", content="Tell me a story in 200 words")
resp = llm.stream_chat([message])
for r in resp:
    print(r.delta, end="")
```

## API 支援（僅限 Chat；不支援舊版 Completions）

Helicone 支援支援 OpenAI 兼容的 Chat Completions 和較新的 Responses API。舊版的 Completions API 不受支援。

在 LlamaIndex 中，請使用 `llm.chat(...)` 和 `llm.stream_chat(...)`。

## 模型配置

```
# Choose any OpenAI-compatible model routed by Helicone.
# See https://www.helicone.ai/models for options.


# If HELICONE_API_KEY is set in your environment, you can omit api_key here.
llm = Helicone(model="gpt-4o-mini")
message = ChatMessage(
    role="user", content="Write one sentence about Rust dragons coding."
)
resp = llm.chat([message])
print(resp)
```
