---
title: "Optimum Intel LLMs 透過 IPEX backend 優化"
---

[Optimum Intel](https://github.com/rbrugaro/optimum-intel) 加速 Hugging Face pipelines 於 Intel 利用於 architectures 的 [Intel Extension for Pytorch, (IPEX)](https://github.com/intel/intel-extension-for-pytorch) 最佳化

Optimum Intel 模型可以透過以下方式在本地端執行 `OptimumIntelLLM` 由...封裝的實體 LlamaIndex :

在下方的程式碼行中，我們安裝此 Demo 所需的套件：

```
%pip install llama-index-llms-optimum-intel
```

現在我們已經設定完成，讓我們來試試看：

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙.

```
!pip install llama-index
```

```
from llama_index.llms.optimum_intel import OptimumIntelLLM
```

```
def messages_to_prompt(messages):
    prompt = ""
    for message in messages:
        if message.role == "system":
            prompt += f"<|system|>\n{message.content}</s>\n"
        elif message.role == "user":
            prompt += f"<|user|>\n{message.content}</s>\n"
        elif message.role == "assistant":
            prompt += f"<|assistant|>\n{message.content}</s>\n"


    # ensure we start with a system prompt, insert blank if needed
    if not prompt.startswith("<|system|>\n"):
        prompt = "<|system|>\n</s>\n" + prompt


    # add final assistant prompt
    prompt = prompt + "<|assistant|>\n"


    return prompt




def completion_to_prompt(completion):
    return f"<|system|>\n</s>\n<|user|>\n{completion}</s>\n<|assistant|>\n"
```

### 載入模型

可以使用 `OptimumIntelLLM` 方法指定模型參數來載入模型。

```
oi_llm = OptimumIntelLLM(
    model_name="Intel/neural-chat-7b-v3-3",
    tokenizer_name="Intel/neural-chat-7b-v3-3",
    context_window=3900,
    max_new_tokens=256,
    generate_kwargs={"temperature": 0.7, "top_k": 50, "top_p": 0.95},
    messages_to_prompt=messages_to_prompt,
    completion_to_prompt=completion_to_prompt,
    device_map="cpu",
)
```

```
response = oi_llm.complete("What is the meaning of life?")
print(str(response))
```

### Streaming

使用 `stream_complete` endpoint

```
response = oi_llm.stream_complete("Who is Mother Teresa?")
for r in response:
    print(r.delta, end="")
```

使用 `stream_chat` endpoint

```
from llama_index.core.llms import ChatMessage


messages = [
    ChatMessage(
        role="system",
        content="You are an American chef in a small restaurant in New Orleans",
    ),
    ChatMessage(role="user", content="What is your dish of the day?"),
]
resp = oi_llm.stream_chat(messages)


for r in resp:
    print(r.delta, end="")
```
