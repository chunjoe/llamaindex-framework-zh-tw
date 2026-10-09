---
title: "百度智能云 Qianfan LLM 平台客戶"
---

Baidu Intelligent Cloud 的 Qianfan LLM Platform 為所有 Baidu LLMs，例如 ERNIE-3.5-8K 和 ERNIE-4.0-8K 提供 API 服務。它也提供少量開源 LLMs，例如 Llama-2-70b-chat。

在使用聊天客戶端之前，您需要在 Qianfan LLM Platform 控制台的 [online service](https://console.bce.baidu.com/qianfan/ais/console/onlineService) 頁面上啟用 LLM 服務。然後，在控制台的 [Security Authentication](https://console.bce.baidu.com/iam/#/iam/accesslist) 頁面中生成 Access Key 和 Secret Key。

## 安裝

安裝必要的套件：

```
%pip install llama-index-llms-qianfan
```


## 初始化

```
from llama_index.llms.qianfan import Qianfan
import asyncio


access_key = "XXX"
secret_key = "XXX"
model_name = "ERNIE-Speed-8K"
endpoint_url = "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_speed"
context_window = 8192
llm = Qianfan(access_key, secret_key, model_name, endpoint_url, context_window)
```


## 同步聊天

使用 `chat` 方法同步生成聊天回應：

```
from llama_index.core.base.llms.types import ChatMessage


messages = [
    ChatMessage(role="user", content="Tell me a joke."),
]
chat_response = llm.chat(messages)
print(chat_response.message.content)
```


## 同步串流聊天

使用 `stream_chat` 方法同步生成串流聊天回應：

```
messages = [
    ChatMessage(role="system", content="You are a helpful assistant."),
    ChatMessage(role="user", content="Tell me a story."),
]
content = ""
for chat_response in llm.stream_chat(messages):
    content += chat_response.delta
    print(chat_response.delta, end="")
```


## 異步聊天

使用 `achat` 方法異步生成聊天回應：

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

使用 `astream_chat` 方法異步生成串流聊天回應：

```
async def async_stream_chat():
    messages = [
        ChatMessage(role="system", content="You are a helpful assistant."),
        ChatMessage(role="user", content="Tell me an async story."),
    ]
    content = ""
    response = await llm.astream_chat(messages)
    async for chat_response in response:
        content += chat_response.delta
        print(chat_response.delta, end="")




asyncio.run(async_stream_chat())
```
