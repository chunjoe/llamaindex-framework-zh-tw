---
title: "Together AI LLM"
---

本筆記示範如何將 `Together AI` 用作 LLM。Together AI 提供對多種最先進的 LLM 模型存取權。請查看完整的模型列表 [此處](https://docs.together.ai/docs/inference-models)。

造訪 <https://together.ai> 並註冊以獲取 API 金鑰。

## 設定

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-llms-together
```

```
!pip install llama-index
```

```
from llama_index.llms.together import TogetherLLM
```

```
# set api key in env or in llm
# import os
# os.environ["TOGETHER_API_KEY"] = "your api key"


llm = TogetherLLM(
    model="mistralai/Mixtral-8x7B-Instruct-v0.1", api_key="your_api_key"
)
```

```
resp = llm.complete("Who is Paul Graham?")
```

```
print(resp)
```

```
Paul Graham is a British-born computer scientist, venture capitalist, and essayist. He is best known for co-founding the startup incubator and investment firm, Y Combinator, which has provided funding and support to numerous successful tech startups including Dropbox, Airbnb, and Reddit.


Before founding Y Combinator, Graham was a successful entrepreneur himself, having co-founded the company Viaweb in 1995, which was later acquired by Yahoo in 1998. Graham is also known for his essays on startups, technology, and programming, which have been widely read and influential in the tech industry.


In addition to his work in the tech industry, Graham has a background in artificial intelligence and computer science, having earned a Ph.D. in computer science from Harvard University. He is also a prolific essayist and has written several books, including "Hackers & Painters" and "The Hundred-Year Lie: How to Prevent Corporate Abuse and Save the World from Its Own Worst Appetites."
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
```

```
print(resp)
```

```
assistant: Arr matey, I be known as Captain Redbeard, the fiercest pirate to ever sail the seven seas! My ship, the Crimson Wave, strikes fear into the hearts of all who dare cross our path. With me hearty crew, we plunder and pillage, always seeking treasure and adventure. But don't be mistaken, I be a fair and honorable pirate, as long as ye show me respect and loyalty. Now, what be your name, landlubber?
```

### 串流

使用 `stream_complete` endpoint

```
response = llm.stream_complete("Who is Paul Graham?")
```

```
for r in response:
    print(r.delta, end="")
```

```
 Paul Graham is a British-born computer scientist, entrepreneur, venture capitalist, and essayist. He is best known for co-founding the startup incubator and investment firm, Y Combinator, which has provided funding and support to numerous successful startups including Dropbox, Airbnb, and Reddit.


Before founding Y Combinator, Graham was a successful entrepreneur himself, having co-founded the company Viaweb in 1995, which was later acquired by Yahoo in 1998. Graham is also known for his essays on startups, technology, and programming, which have been widely read and influential in the tech industry.


In addition to his work in the tech industry, Graham has a background in computer science and artificial intelligence, having earned a PhD in this field from Harvard University. He has also taught programming and entrepreneurship at several universities, including Harvard and Stanford.
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
 Arr matey, I be known as Captain Redbeard
the fearsome pirate who's known for his cunning and bravery on the high seas
of course, that's just what I tell people. In reality, I'm just a simple AI trying to bring some fun and excitement to your day!
```
