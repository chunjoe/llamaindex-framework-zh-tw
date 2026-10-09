---
title: "Nebius LLMs"
---

這篇筆記示範如何透過 LlamaIndex 使用 [Nebius AI Studio](https://studio.nebius.ai/) 提供的 LLM。Nebius AI Studio 提供目前可供商用的各種先進 LLM。

先安裝 LlamaIndex 和 Nebius AI Studio 整合所需的相依套件。

```
%pip install llama-index-llms-nebius llama-index
```

以下範例會從環境變數讀取 Nebius AI Studio API 金鑰；你也可以直接填入金鑰。若要取得金鑰，請先在 [Nebius AI Studio](https://auth.eu.nebius.com/ui/login) 免費註冊，再前往 [API 金鑰](https://studio.nebius.ai/settings/api-keys) 建立金鑰。

```
import os


NEBIUS_API_KEY = os.getenv("NEBIUS_API_KEY")  # NEBIUS_API_KEY = ""
```

```
from llama_index.llms.nebius import NebiusLLM


llm = NebiusLLM(
    api_key=NEBIUS_API_KEY, model="meta-llama/Llama-3.3-70B-Instruct-fast"
)
```

```
None of PyTorch, TensorFlow >= 2.0, or Flax have been found. Models won't be available and only tokenizers, configuration and file/data utilities can be used.
```

#### 使用提示呼叫 `complete`

```
response = llm.complete("Amsterdam is the capital of ")
print(response)
```

```
The Netherlands! Amsterdam is indeed the capital and largest city of the Netherlands.
```

#### 使用訊息清單呼叫 `chat`

```
from llama_index.core.llms import ChatMessage


messages = [
    ChatMessage(role="system", content="You are a helpful AI assistant."),
    ChatMessage(
        role="user",
        content="Answer briefly: who is Wall-e?",
    ),
]
response = llm.chat(messages)
print(response)
```

```
assistant: WALL-E is a small waste-collecting robot and the main character in the 2008 Pixar animated film of the same name.
```

### 串流

#### 使用 `stream_complete` 端點

```
response = llm.stream_complete("Amsterdam is the capital of ")
for r in response:
    print(r.delta, end="")
```

```
The Netherlands! Amsterdam is indeed the capital and largest city of the Netherlands.
```

#### 使用 `stream_chat` 傳入訊息清單

```
from llama_index.core.llms import ChatMessage


messages = [
    ChatMessage(role="system", content="You are a helpful AI assistant."),
    ChatMessage(
        role="user",
        content="Answer briefly: who is Wall-e?",
    ),
]
response = llm.stream_chat(messages)
for r in response:
    print(r.delta, end="")
```

```
WALL-E is a small waste-collecting robot and the main character in the 2008 Pixar animated film of the same name.
```
