---
title: "DeepInfra"
---

## 安裝

首先，安裝必要的套件：

終端機視窗

```
%pip install llama-index-llms-deepinfra
```

```
%pip install llama-index-llms-deepinfra
```

## 初始化

使用您的 API key 和所需的參數設定 `DeepInfraLLM` class：

```
from llama_index.llms.deepinfra import DeepInfraLLM
import asyncio


llm = DeepInfraLLM(
    model="mistralai/Mixtral-8x22B-Instruct-v0.1",  # Default model name
    api_key="your-deepinfra-api-key",  # Replace with your DeepInfra API key
    temperature=0.5,
    max_tokens=50,
    additional_kwargs={"top_p": 0.9},
)
```

## 同步完成

使用 `complete` method 同步生成文字完成：

```
response = llm.complete("Hello World!")
print(response.text)
```

## 同步串流完成

使用 `stream_complete` method 同步生成串流文字完成：

```
content = ""
for completion in llm.stream_complete("Once upon a time"):
    content += completion.delta
    print(completion.delta, end="")
```

## 同步聊天

使用 `chat` method 同步生成聊天回應：

```
from llama_index.core.base.llms.types import ChatMessage


messages = [
    ChatMessage(role="user", content="Tell me a joke."),
]
chat_response = llm.chat(messages)
print(chat_response.message.content)
```

## 同步串流聊天

使用 `stream_chat` method 同步生成串流聊天回應：

```
messages = [
    ChatMessage(role="system", content="You are a helpful assistant."),
    ChatMessage(role="user", content="Tell me a story."),
]
content = ""
for chat_response in llm.stream_chat(messages):
    content += chat_response.message.delta
    print(chat_response.message.delta, end="")
```

## 異步完成

使用 `acomplete` method 異步生成文字完成：

```
async def async_complete():
    response = await llm.acomplete("Hello Async World!")
    print(response.text)




asyncio.run(async_complete())
```

## 異步串流完成

使用 `astream_complete` method 異步生成串流文字完成：

```
async def async_stream_complete():
    content = ""
    response = await llm.astream_complete("Once upon an async time")
    async for completion in response:
        content += completion.delta
        print(completion.delta, end="")




asyncio.run(async_stream_complete())
```

## 異步聊天

使用 `achat` method 異步生成聊天回應：

```
async def async_chat():
    messages = [
        ChatMessage(role="user", content="Tell me an async joke."),
    ]
    chat_response = await llm.achat(messages)
    print(chat_response.message.content)




asyncio.run(async_chat())
```

## 異步串流聊天

使用 `astream_chat` method 異步生成串流聊天回應：

```
async def async_stream_chat():
    messages = [
        ChatMessage(role="system", content="You are a helpful assistant."),
        ChatMessage(role="user", content="Tell me an async story."),
    ]
    content = ""
    response = await llm.astream_chat(messages)
    async for chat_response in response:
        content += chat_response.message.delta
        print(chat_response.message.delta, end="")




asyncio.run(async_stream_chat())
```

---

如有任何問題或建議，請聯繫 <feedback@deepinfra.com>。