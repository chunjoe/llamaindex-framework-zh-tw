---
title: "RunGPT"
---

RunGPT 是一個開源的雲原生大型多模態模型 (LMMs) 服務框架。它旨在簡化在分散式 GPU 叢集上部署和管理大型語言模型。RunGPT 旨在成為一個集中且易於存取的平台，用於收集優化大型多模態模型的技術，並讓所有人都能輕鬆使用。在 RunGPT 中，我們支援了多種 LLMs，例如 LLaMA、Pythia、StableLM、Vicuna、MOSS，以及 MiniGPT-4 和 OpenFlamingo 等大型多模態模型 (LMMs)。

# 設定

如果您在 Colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-llms-rungpt
```

```
!pip install llama-index
```

您需要在 python 環境中，使用 `pip install` 安裝 rungpt package。

```
!pip install rungpt
```

成功安裝後，RunGPT 支援的模型可以透過一行指令部署。此選項會從開源平台下載目標語言模型，並將其作為服務部署在 localhost 埠上，可由 http 或 grpc requests 存取。我猜您不會在 jupyter 書中執行此指令，而是在命令列中執行。

```
!rungpt serve decapoda-research/llama-7b-hf --precision fp16 --device_map balanced
```

## 基本用法

#### 使用 prompt 呼叫 `complete`

```
from llama_index.llms.rungpt import RunGptLLM


llm = RunGptLLM()
promot = "What public transportation might be available in a city?"
response = llm.complete(promot)
```

```
print(response)
```

```
I don't want to go to work, so what should I do?
I have a job interview on Monday. What can I wear that will make me look professional but not too stuffy or boring?
```

#### 使用訊息列表呼叫 `chat`

```
from llama_index.core.llms import ChatMessage, MessageRole
from llama_index.llms.rungpt import RunGptLLM


messages = [
    ChatMessage(
        role=MessageRole.USER,
        content="Now, I want you to do some math for me.",
    ),
    ChatMessage(
        role=MessageRole.ASSISTANT, content="Sure, I would like to help you."
    ),
    ChatMessage(
        role=MessageRole.USER,
        content="How many points determine a straight line?",
    ),
]
llm = RunGptLLM()
response = llm.chat(messages=messages, temperature=0.8, max_tokens=15)
```

```
print(response)
```

## 串流 (Streaming)

使用 `stream_complete` endpoint

```
promot = "What public transportation might be available in a city?"
response = RunGptLLM().stream_complete(promot)
for item in response:
    print(item.text)
```

使用 `stream_chat` endpoint

```
from llama_index.llms.rungpt import RunGptLLM


messages = [
    ChatMessage(
        role=MessageRole.USER,
        content="Now, I want you to do some math for me.",
    ),
    ChatMessage(
        role=MessageRole.ASSISTANT, content="Sure, I would like to help you."
    ),
    ChatMessage(
        role=MessageRole.USER,
        content="How many points determine a straight line?",
    ),
]
response = RunGptLLM().stream_chat(messages=messages)
```

```
for item in response:
    print(item.message)
```
