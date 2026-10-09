---
title: "vLLM"
---

有兩種使用 vLLM 的模式，即本地（local）和遠端（remote）。我們先從前者開始，它需要本地可用的 CUDA 環境。

### 安裝 vLLM

`pip install vllm`\
或者如果你想編譯，可以 [從原始碼編譯](https://docs.vllm.ai/en/latest/getting_started/installation.html)

### Orca-7b Completion 範例

```
%pip install llama-index-llms-vllm
```

```
import os


os.environ["HF_HOME"] = "model/"
```

```
from llama_index.llms.vllm import Vllm, VllmServer
```

```
llm = Vllm(
    model="microsoft/Orca-2-7b",
    tensor_parallel_size=4,
    max_new_tokens=100,
    vllm_kwargs={"swap_space": 1, "gpu_memory_utilization": 0.5},
)
```

```
llm.complete("[INST]You are a helpful assistant[/INST] What is a black hole ?")
```

### LLama-2-7b Completion 範例

```
llm = Vllm(
    model="codellama/CodeLlama-7b-hf",
    dtype="float16",
    tensor_parallel_size=4,
    temperature=0,
    max_new_tokens=100,
    vllm_kwargs={
        "swap_space": 1,
        "gpu_memory_utilization": 0.5,
        "max_model_len": 4096,
    },
)
```

```
llm.complete("import socket\n\ndef ping_exponential_backoff(host: str):")
```

### Mistral chat 7b Completion 範例

```
llm = Vllm(
    model="mistralai/Mistral-7B-Instruct-v0.1",
    dtype="float16",
    tensor_parallel_size=4,
    temperature=0,
    max_new_tokens=100,
    vllm_kwargs={
        "swap_space": 1,
        "gpu_memory_utilization": 0.5,
        "max_model_len": 4096,
    },
)
```

```
Vllm mock initialized
```

```
llm.complete(" What is a black hole ?")
```

# 透過 HTTP 呼叫 vLLM

在此模式下，不需要安裝 `vllm` 模型，也不需要本地有 CUDA。要設定 vLLM API，請參考 [這裡](https://docs.vllm.ai/en/latest/serving/distributed_serving.html) 的指南。注意：`llama-index-llms-vllm` 模組是 `vllm.entrypoints.api_server` 的客戶端，僅為 [一個示範](https://github.com/vllm-project/vllm/blob/abfc4f3387c436d46d6701e9ba916de8f9ed9329/vllm/entrypoints/api_server.py#L2)。
如果 vLLM server 使用 `vllm.entrypoints.openai.api_server` 作為 [OpenAI Compatible Server](https://docs.vllm.ai/en/latest/getting_started/quickstart.html#openai-compatible-server) 或透過 [Docker](https://docs.vllm.ai/en/latest/serving/deploying_with_docker.html) 啟動，則需要來自 `llama-index-llms-openai-like` [module](https://developers.llamaindex.ai/python/framework/integrations/llm/vllm/localai.ipynb/#llamaindex-interaction) 中的 `OpenAILike` class。

### Completion Response

```
from llama_index.core.llms import ChatMessage
```

```
llm = VllmServer(
    api_url="http://localhost:8000/generate", max_new_tokens=100, temperature=0
)
```

```
llm.complete("what is a black hole ?")
```

```
message = [ChatMessage(content="hello", role="user")]
llm.chat(message)
```

### Streaming Response

```
list(llm.stream_complete("what is a black hole"))[-1]
```

```
message = [ChatMessage(content="what is a black hole", role="user")]
[x for x in llm.stream_chat(message)][-1]
```

### Async Response

```
import asyncio


await llm.acomplete("What is a black hole")
```

```
await llm.achat(message)
```

```
[x async for x in await llm.astream_complete("what is a black hole")][-1]
```

```
[x async for x in await llm.astream_chat(message)][-1]
```
