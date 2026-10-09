---
title: "使用 LLMs"
---

提示

欲查看我們支援的 LLMs 列表及其功能比較，請參閱我們的 [LLM module guide](/python/framework/module_guides/models/llms/)。

建立基於 LLM 的應用程式的初步步驟之一是選擇要使用的 LLM；它們具有不同的優勢和價格點，您可能需要使用多個。

LlamaIndex 提供了一個介面，可以對大量的不同 LLMs 進行操作。使用 LLM 可以像安裝適當的整合一樣簡單：

終端機視窗

```
pip install llama-index-llms-openai
```

然後以一行程式碼呼叫它：

```
from llama_index.llms.openai import OpenAI


response = OpenAI().complete("William Shakespeare is ")
print(response)
```

請注意，這需要一個名為 `OPENAI_API_KEY` 的 API 金鑰存在於您的環境中；請參閱 [入門教學](/python/framework/getting_started/starter_example/) 以獲取更多詳細資訊。

`complete` 也可用作異步方法，`acomplete`。

您也可以透過呼叫 `stream_complete` 來獲得串流回應，它會回傳一個生成器，按生成順序產生 tokens：

```
handle = OpenAI().stream_complete("William Shakespeare is ")


for token in handle:
    print(token.delta, end="", flush=True)
```

`stream_complete` 也可用作異步方法，`astream_complete`。

## 聊天介面

LLM 類別也實作了 `chat` 方法，讓您可以進行更複雜的互動：

```
messages = [
    ChatMessage(role="system", content="You are a helpful assistant."),
    ChatMessage(role="user", content="Tell me a joke."),
]
chat_response = llm.chat(messages)
```

對於串流回應（其中 tokens 是按生成順序產生的），`stream_chat` 和 `astream_chat` 可用。

**同步 (`stream_chat`)：**

在標準的 Python 腳本或筆記本中使用此方法，適用於允許阻塞操作的場景。它會直接回傳一個生成器。

```
stream_response = llm.stream_chat(messages)


for token in stream_response:
    print(token.delta, end="", flush=True)
```

**異步 (`astream_chat`)：**

在使用異步框架（如 FastAPI）時，請記得對方法呼叫進行 `await` 並迭代回傳的 async stream。

```
stream_response = await llm.astream_chat(messages)


async for token in stream_response:
    print(token.delta, end="", flush=True)
```


## 指定模型

許多 LLM 整合提供多個模型。您可以在呼叫 LLM 建構函式時，透過傳遞 `model` 參數來指定模型：

```
llm = OpenAI(model="gpt-4o-mini")
response = llm.complete("Who is Laurie Voss?")
print(response)
```


## 多模態 LLMs

某些 LLMs 支援多模態聊天訊息。這意味著您可以傳入文字和其他模態（圖片、音訊、影片等）的組合，LLM 將會處理。

目前，LlamaIndex 透過 content blocks 在 ChatMessages 中支援文字、圖片和音訊。

```
from llama_index.core.llms import ChatMessage, TextBlock, ImageBlock
from llama_index.llms.openai import OpenAI


llm = OpenAI(model="gpt-4o")


messages = [
    ChatMessage(
        role="user",
        blocks=[
            ImageBlock(path="image.png"),
            TextBlock(text="Describe the image in a few sentences."),
        ],
    )
]


resp = llm.chat(messages)
print(resp.message.content)
```


## 工具呼叫 (Tool Calling)

某些 LLMs（如 OpenAI、Anthropic、Gemini、Ollama 等）直接透過 API 呼叫支援工具呼叫——這意味著可以在沒有特定提示和解析機制的情況下呼叫工具和函式。

```
from llama_index.core.tools import FunctionTool
from llama_index.llms.openai import OpenAI




def generate_song(name: str, artist: str) -> Song:
    """Generates a song with provided name and artist."""
    return {"name": name, "artist": artist}




tool = FunctionTool.from_defaults(fn=generate_song)


llm = OpenAI(model="gpt-4o")
response = llm.predict_and_call(
    [tool],
    "Pick a random song for me",
)
print(str(response))
```

如需了解更進階的工具呼叫細節，請參閱使用 [OpenAI](https://developers.llamaindex.ai/python/examples/llm/openai/index.md) 的深入指南。對於任何支援工具/函式的 LLM（例如 Anthropic、Gemini、Ollama 等），相同的做法都適用。

您可以在 [tools 指南](/python/framework/understanding/agent/tools/) 中了解更多關於 tools 和 agents 的資訊。

## 可用的 LLMs

我們支援與 OpenAI、Anthropic、Mistral、DeepSeek、Hugging Face 以及數十種其他整合。請參閱我們的 [LLMs 模組指南](/python/framework/module_guides/models/llms/) 以獲取完整列表，包括如何運行本地模型。

提示

關於隱私和 LLM 使用的一般說明，請參閱 [privacy page](/python/framework/understanding/privacy/)。

### 使用本地 LLM

LlamaIndex 不僅支援託管的 LLM API；您也可以在本地運行如 Meta 的 Llama 3 等本地模型。例如，如果您已安裝並運行了 [Ollama](https://github.com/ollama/ollama)：

```
from llama_index.llms.ollama import Ollama


llm = Ollama(
    model="llama3.3",
    request_timeout=60.0,
    # Manually set the context window to limit memory usage
    context_window=8000,
)
```

請參閱 [custom LLM 的操作指南](/python/framework/module_guides/models/llms/usage_custom/) 以獲取關於使用和配置 LLM 模型的更多詳細資訊。