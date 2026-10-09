---
title: "SambaNova Systems"
---

在本筆筆記中，您將了解如何安裝、設定和使用 [SambaNova Cloud](https://cloud.sambanova.ai/) 和 [SambaStudio](https://docs.sambanova.ai/sambastudio/latest/sambastudio-intro.html) 平台。請查看並親自試用！

# SambaNova Cloud

[SambaNova Cloud](https://cloud.sambanova.ai/) 是一個高效能的推論服務，能提供快速且精確的結果。客戶可以無縫利用 SambaNova 技術，透過將 FastAPI 推論 API 與其應用程式整合，來提升使用者體驗。此服務提供了一個易於使用的 REST interface，用於串流推論結果。使用者可以自訂推論參數並將 ML model 傳遞給服務。

## 設定

要存取 SambaNova Cloud model，您需要建立一個 [SambaNovaCloud](https://cloud.sambanova.ai/apis) 帳戶，取得一個 API Key，安裝 `llama-index-llms-sambanova` 整合套件，並安裝 `SSEClient` Package。

```
%pip install llama-index-llms-sambanovasystems
%pip install sseclient-py
```

### 憑證

從 [cloud.sambanova.ai](https://cloud.sambanova.ai/apis) 取得一個 API Key，並將其新增到您的環境變數中：

終端機視窗

```
export SAMBANOVA_API_KEY="your-api-key-here"
```

如果您的環境變數中沒有，您也可以在彈出視窗的輸入文字中新增。

```
import getpass
import os


if not os.getenv("SAMBANOVA_API_KEY"):
    os.environ["SAMBANOVA_API_KEY"] = getpass.getpass(
        "Enter your SambaNova Cloud API key: "
    )
```

## 實例化

現在我們可以實例化我們的 model object 並產生 chat completions：

```
from llama_index.llms.sambanovasystems import SambaNovaCloud


llm = SambaNovaCloud(
    model="Meta-Llama-3.1-70B-Instruct",
    context_window=100000,
    max_tokens=1024,
    temperature=0.7,
    top_k=1,
    top_p=0.01,
)
```

## 呼叫

給定以下 system 和 user messages，讓我們探索呼叫 SambaNova Cloud model 的不同方式。

```
from llama_index.core.base.llms.types import (
    ChatMessage,
    MessageRole,
)


system_msg = ChatMessage(
    role=MessageRole.SYSTEM,
    content="You are a helpful assistant that translates English to French. Translate the user sentence.",
)
user_msg = ChatMessage(role=MessageRole.USER, content="I love programming.")


messages = [
    system_msg,
    user_msg,
]
```

### Chat

```
ai_msg = llm.chat(messages)
ai_msg.message
```

```
print(ai_msg.message.content)
```

### Complete

```
ai_msg = llm.complete(user_msg.content)
ai_msg
```

```
print(ai_msg.text)
```

## Streaming

### Chat

```
ai_stream_msgs = []
for stream in llm.stream_chat(messages):
    ai_stream_msgs.append(stream)
ai_stream_msgs
```

```
print(ai_stream_msgs[-1])
```

### Complete

```
ai_stream_msgs = []
for stream in llm.stream_complete(user_msg.content):
    ai_stream_msgs.append(stream)
ai_stream_msgs
```

```
print(ai_stream_msgs[-1])
```

## Async

### Chat

```
ai_msg = await llm.achat(messages)
ai_msg
```

```
print(ai_msg.message.content)
```

### Complete

```
ai_msg = await llm.acomplete(user_msg.content)
ai_msg
```

```
print(ai_msg.text)
```

## Async Streaming

目前尚未支援。即將推出！

# SambaStudio

[SambaStudio](https://docs.sambanova.ai/sambastudio/latest/sambastudio-intro.html) 是一個功能豐富的 GUI 平台，提供訓練、部署和管理 model 的功能。

## 設定

要存取 SambaStudio model，您需要是 **SambaNova customer**，使用 GUI 或 CLI 部署 endpoint，並使用 URL 和 API Key 連接到 endpoint，詳見 [SambaStudio endpoint documentation](https://docs.sambanova.ai/sambastudio/latest/endpoints.html#_endpoint_api_keys)。然後，安裝 `llama-index-llms-sambanova` 整合套件，並安裝 `SSEClient` Package。

```
%pip install llama-index-llms-sambanova
%pip install sseclient-py
```

### 憑證

必須在 SambaStudio 中部署 endpoint 才能取得 URL 和 API Key。一旦取得，請將它們加入到您的環境變數中：

終端機視窗

```
export SAMBASTUDIO_URL="your-url-here"
export SAMBASTUDIO_API_KEY="your-api-key-here"
```

```
import getpass
import os


if not os.getenv("SAMBASTUDIO_URL"):
    os.environ["SAMBASTUDIO_URL"] = getpass.getpass(
        "Enter your SambaStudio endpoint's URL: "
    )


if not os.getenv("SAMBASTUDIO_API_KEY"):
    os.environ["SAMBASTUDIO_API_KEY"] = getpass.getpass(
        "Enter your SambaStudio endpoint's API key: "
    )
```

## 實例化

現在我們可以實例化我們的 model object 並產生 chat completions：

```
from llama_index.llms.sambanovasystems import SambaStudio


llm = SambaStudio(
    model="Meta-Llama-3-70B-Instruct-4096",
    context_window=100000,
    max_tokens=1024,
    temperature=0.7,
    top_k=1,
    top_p=0.01,
)
```

## 呼叫

給定以下 system 和 user messages，讓我們探索呼叫 SambaNova Cloud model 的不同方式。

```
from llama_index.core.base.llms.types import (
    ChatMessage,
    MessageRole,
)


system_msg = ChatMessage(
    role=MessageRole.SYSTEM,
    content="You are a helpful assistant that translates English to French. Translate the user sentence.",
)
user_msg = ChatMessage(role=MessageRole.USER, content="I love programming.")


messages = [
    system_msg,
    user_msg,
]
```

### Chat

```
ai_msg = llm.chat(messages)
ai_msg.message
```

```
print(ai_msg.message.content)
```

### Complete

```
ai_msg = llm.complete(user_msg.content)
ai_msg
```

```
print(ai_msg.text)
```

## Streaming

### Chat

```
ai_stream_msgs = []
for stream in llm.stream_chat(messages):
    ai_stream_msgs.append(stream)
ai_stream_msgs
```

```
print(ai_stream_msgs[-1])
```

### Complete

```
ai_stream_msgs = []
for stream in llm.stream_complete(user_msg.content):
    ai_stream_msgs.append(stream)
ai_stream_msgs
```

```
print(ai_stream_msgs[-1])
```

## Async

### Chat

```
ai_msg = await llm.achat(messages)
ai_msg
```

```
print(ai_msg.message.content)
```

### Complete

```
ai_msg = await llm.acomplete(user_msg.content)
ai_msg
```

```
print(ai_msg.text)
```

## Async Streaming

目前尚未支援。即將推出！