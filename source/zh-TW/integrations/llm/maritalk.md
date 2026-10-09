---
title: "Maritalk"
---

## 簡介

MariTalk 是一款由巴西公司 [Maritaca AI](https://www.maritaca.ai/) 開發的助理。MariTalk 基於經過特別訓練以良好理解葡萄牙語的語言模型。

本筆 Notebook 透過兩個範例，演示如何使用 MariTalk 與 Llama Index 進行操作：

1. 使用聊天方式獲取寵物名字建議；
2. 使用少樣本範例（few-shot examples）並提供完整方法，對電影評論進行負面或正面分類。

## 安裝

如果您在 Colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex。

```
!pip install llama-index
!pip install llama-index-llms-maritalk
!pip install asyncio
```

## API Key

您需要一個可從 chat.maritaca.ai（「Chaves da API」部分）獲取的 API 金鑰。

### 範例 1 - 使用聊天進行寵物名字建議

```
from llama_index.core.llms import ChatMessage
from llama_index.llms.maritalk import Maritalk


import asyncio


# To customize your API key, do this
# otherwise it will lookup MARITALK_API_KEY from your env variable
llm = Maritalk(api_key="<your_maritalk_api_key>", model="sabia-2-medium")


# Call chat with a list of messages
messages = [
    ChatMessage(
        role="system",
        content="You are an assistant specialized in suggesting pet names. Given the animal, you must suggest 4 names.",
    ),
    ChatMessage(role="user", content="I have a dog."),
]


# Sync chat
response = llm.chat(messages)
print(response)




# Async chat
async def get_dog_name(llm, messages):
    response = await llm.achat(messages)
    print(response)




asyncio.run(get_dog_name(llm, messages))
```

#### 串流生成 (Stream Generation)

對於涉及生成長文本的任務，例如創建一篇詳盡的文章或翻譯一個大型 document，接收文本的片段，隨著文本生成，會比等待完整文本更有優勢。這使應用程式更具反應性和效率，尤其是在生成文本很長時。我們提供兩種方法來滿足這種需求：同步（synchronous）和非同步（asynchronous）。

```
# Sync streaming chat
response = llm.stream_chat(messages)
for chunk in response:
    print(chunk.delta, end="", flush=True)




# Async streaming chat
async def get_dog_name_streaming(llm, messages):
    async for chunk in await llm.astream_chat(messages):
        print(chunk.delta, end="", flush=True)




asyncio.run(get_dog_name_streaming(llm, messages))
```

### 範例 2 - 使用完整方法進行少樣本範例 (Few-shot Examples)

當使用模型並搭配少樣本範例時，我們建議使用 `llm.complete()` 方法。

```
prompt = """Classifique a resenha de filme como "positiva" ou "negativa".


Resenha: Gostei muito do filme, é o melhor do ano!
Classe: positiva


Resenha: O filme deixa muito a desejar.
Classe: negativa


Resenha: Apesar de longo, valeu o ingresso..
Classe:"""


# Sync complete
response = llm.complete(prompt)
print(response)




# Async complete
async def classify_review(llm, prompt):
    response = await llm.acomplete(prompt)
    print(response)




asyncio.run(classify_review(llm, prompt))
```

```
# Sync streaming complete
response = llm.stream_complete(prompt)
for chunk in response:
    print(chunk.delta, end="", flush=True)




# Async streaming complete
async def classify_review_streaming(llm, prompt):
    async for chunk in await llm.astream_complete(prompt):
        print(chunk.delta, end="", flush=True)




asyncio.run(classify_review_streaming(llm, prompt))
```
