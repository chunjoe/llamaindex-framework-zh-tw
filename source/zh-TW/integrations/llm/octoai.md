---
title: "OctoAI"
---

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-llms-octoai
%pip install llama-index
%pip install octoai-sdk
```

請在下方包含您的 OctoAI API 金鑰。您可以在 [OctoAI](https://octo.ai/) 取得您的金鑰。

[這裡](https://octo.ai/docs/getting-started/how-to-create-an-octoai-access-token) 是一些說明，以防您需要更多指導。

```
OCTOAI_API_KEY = ""
```

#### 使用預設模型初始化整合

```
from llama_index.llms.octoai import OctoAI


octoai = OctoAI(token=OCTOAI_API_KEY)
```

#### 使用提示 (prompt) 呼叫 `complete`

```
response = octoai.complete("Paul Graham is ")
print(response)
```

#### 使用訊息列表呼叫 `chat`

```
from llama_index.core.llms import ChatMessage


messages = [
    ChatMessage(
        role="system",
        content="Below is an instruction that describes a task. Write a response that appropriately completes the request.",
    ),
    ChatMessage(role="user", content="Write a blog about Seattle"),
]
response = octoai.chat(messages)
print(response)
```

## 串流 (Streaming)

使用 `stream_complete` endpoint

```
response = octoai.stream_complete("Paul Graham is ")
for r in response:
    print(r.delta, end="")
```

使用 `stream_chat` 搭配訊息列表

```
from llama_index.core.llms import ChatMessage


messages = [
    ChatMessage(
        role="system",
        content="Below is an instruction that describes a task. Write a response that appropriately completes the request.",
    ),
    ChatMessage(role="user", content="Write a blog about Seattle"),
]
response = octoai.stream_chat(messages)
for r in response:
    print(r.delta, end="")
```

## 設定模型

```
# To customize your API token, do this
# otherwise it will lookup OCTOAI_TOKEN from your env variable
octoai = OctoAI(
    model="mistral-7b-instruct", max_tokens=128, token=OCTOAI_API_KEY
)


response = octoai.complete("Paul Graham is ")
print(response)
```
