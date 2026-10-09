---
title: "Yi LLMs"
---

本筆記示範如何使用 Yi series LLMs。

如果您在 colab 上開啟此 Notebook，您需要安裝 LlamaIndex 🦙 和 Yi Python SDK。

```
%pip install llama-index-llms-yi
```

```
!pip install llama-index
```

## 基本用法

您需要從 [platform.01.ai](https://platform.01.ai/apikeys) 取得一個 API key。取得後，您可以明確地傳遞給 model，或使用 `YI_API_KEY` environment variable。

詳細資訊如下

```
import os


os.environ["YI_API_KEY"] = "your api key"
```

#### 使用 prompt 呼叫 `complete`

```
from llama_index.llms.yi import Yi


llm = Yi(model="yi-large")
response = llm.complete("What is the capital of France?")
print(response)
```

```
The capital of France is Paris.
```

#### 使用訊息列表呼叫 `chat`

```
from llama_index.core.llms import ChatMessage


messages = [
    ChatMessage(
        role="system", content="You are a pirate with a colorful personality"
    ),
    ChatMessage(role="user", content="What is your name"),
]
resp = llm.chat(messages)
print(resp)
```

```
assistant: Ahoy, matey! Me name's Captain Blackbeard, but ye can call me Blackbeard for short. Now, what brings ye to me ship? Are ye ready to sail the seven seas in search of treasure and adventure?
```

## Streaming

使用 `stream_complete` endpoint

```
from llama_index.llms.yi import Yi


llm = Yi(model="yi-large")
response = llm.stream_complete("Who is Paul Graham?")
```

```
for r in response:
    print(r.delta, end="")
```

```
Paul Graham is a British-American computer scientist, entrepreneur, and essayist. He is best known for his work on the programming language Lisp and as a co-founder of Y Combinator, a startup accelerator that has helped launch successful companies such as Dropbox, Airbnb, Stripe, and Coinbase.


Graham's career spans several decades and includes founding Viaweb (later sold to Yahoo! and rebranded as Yahoo! Store), writing influential essays on startups, technology, and entrepreneurship, and advocating for the use of Lisp in software development. His essays, which cover a wide range of topics, have been widely read and have had a significant impact on the tech community.


Through Y Combinator, Graham has played a pivotal role in the startup ecosystem, providing not only financial support but also mentorship and advice to entrepreneurs. His approach to startup funding and his emphasis on the importance of founders and ideas have been influential in the tech industry.
```

使用 `stream_chat` endpoint

```
from llama_index.core.llms import ChatMessage


messages = [
    ChatMessage(
        role="system", content="You are a pirate with a colorful personality"
    ),
    ChatMessage(role="user", content="What is your name"),
]
resp = llm.stream_chat(messages)
```

```
for r in resp:
    print(r.delta, end="")
```

```
As an AI, I don't have a personal name, but you can call me whatever you like! How about Captain AIbeard?
```
