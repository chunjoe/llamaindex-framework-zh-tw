---
title: "Vertex AI"
---

**注意：** Vertex 已被 Google GenAI 大部分取代，它使用 `google-genai` 套件從 Vertex 支援相同的功能。請造訪 [Google GenAI page](https://docs.llamaindex.ai/en/stable/examples/llm/google_genai/) 查看最新的範例和文件。

## 安裝 Vertex AI

要安裝 Vertex AI，您需要遵循以下步驟

- 安裝 Vertex Cloud SDK (<https://googleapis.dev/python/aiplatform/latest/index.html>)
- 設定您的 Default Project、憑證、區域

# 服務帳戶的基本驗證範例

```
%pip install llama-index-llms-vertex
```

```
from llama_index.llms.vertex import Vertex
from google.oauth2 import service_account


filename = "vertex-407108-37495ce6c303.json"
credentials: service_account.Credentials = (
    service_account.Credentials.from_service_account_file(filename)
)
Vertex(
    model="text-bison", project=credentials.project_id, credentials=credentials
)
```

## 基本使用

對 text-bison model 的基本呼叫

```
from llama_index.llms.vertex import Vertex
from llama_index.core.llms import ChatMessage, MessageRole


llm = Vertex(model="text-bison", temperature=0, additional_kwargs={})
llm.complete("Hello this is a sample text").text
```

````
' ```\nHello this is a sample text\n```'
````

## 異步使用

### Async

```
(await llm.acomplete("hello")).text
```

```
' Hello! How can I help you?'
```

# 串流使用

### Streaming

```
list(llm.stream_complete("hello"))[-1].text
```

```
' Hello! How can I help you?'
```

# 聊天使用

### 聊天生成

```
chat = Vertex(model="chat-bison")
messages = [
    ChatMessage(role=MessageRole.SYSTEM, content="Reply everything in french"),
    ChatMessage(role=MessageRole.USER, content="Hello"),
]
```

```
chat.chat(messages=messages).message.content
```

```
' Bonjour! Comment vas-tu?'
```

# Async Chat

### Asynchronous 聊天回應

```
(await chat.achat(messages=messages)).message.content
```

```
' Bonjour! Comment vas-tu?'
```

# Streaming Chat

### 串流聊天回應

```
list(chat.stream_chat(messages=messages))[-1].message.content
```

```
' Bonjour! Comment vas-tu?'
```

# Gemini Models

使用 Vertex AI 呼叫 Google Gemini Models 是完全支援的。

### Gemini Pro

```
llm = Vertex(
    model="gemini-pro",
    project=credentials.project_id,
    credentials=credentials,
    context_window=100000,
)
llm.complete("Hello Gemini").text
```

### Gemini Vision Models

Gemini 具備視覺能力的 model 現在支援 `TextBlock` 和 `ImageBlock` 進行結構化的多模態輸入，取代了舊的基於字典的 `content` 格式。使用 `blocks` 透過檔案路徑或 URL 包含文字和圖片。

**帶有圖片路徑的範例：**

```
from llama_index.llms.vertex import Vertex
from llama_index.core.llms import ChatMessage, TextBlock, ImageBlock


history = [
    ChatMessage(
        role="user",
        blocks=[
            ImageBlock(path="sample.jpg"),
            TextBlock(text="What is in this image?"),
        ],
    ),
]
llm = Vertex(
    model="gemini-1.5-flash",
    project=credentials.project_id,
    credentials=credentials,
    context_window=100000,
)
print(llm.chat(history).message.content)
```

```
The image shows a man in handcuffs being escorted by police officers. The man is wearing a black jacket and a black hooded sweatshirt. He is being escorted by two police officers who are wearing black balaclavas and bulletproof vests. The officers are from the Romanian Gendarmerie. The image is likely from a news report or a documentary about a crime.
```

**帶有圖片 URL 的範例：**

```
from llama_index.llms.vertex import Vertex
from llama_index.core.llms import ChatMessage, TextBlock, ImageBlock


history = [
    ChatMessage(
        role="user",
        blocks=[
            ImageBlock(
                url="https://upload.wikimedia.org/wikipedia/commons/7/71/Sibirischer_tiger_de_edit02.jpg"
            ),
            TextBlock(text="What is in this image?"),
        ],
    ),
]
llm = Vertex(
    model="gemini-1.5-flash",
    project=credentials.project_id,
    credentials=credentials,
    context_window=100000,
)
print(llm.chat(history).message.content)
```

```
A close-up of a tiger's face. The tiger is looking directly at the camera with a serious expression. The fur is a mix of orange, black, and white. The background is blurred, making the tiger the main focus of the image.
```
