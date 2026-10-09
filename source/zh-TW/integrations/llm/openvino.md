---
title: "OpenVINO LLMs"
---

[OpenVINO™](https://github.com/openvinotoolkit/openvino) 是一個用於優化與部署 AI 推論的開源工具包。OpenVINO™ Runtime 可以讓同一模型在各種硬體 [devices](https://github.com/openvinotoolkit/openvino?tab=readme-ov-file#supported-hardware-matrix) 上經過優化後運行。Accelerate 提升您在語言 + LLMs、電腦視覺、自動語音辨識等使用情境中的深度學習效能。

OpenVINO 模型可以透過以下方式在本地端執行 `OpenVINOLLM` 由其封裝的實體 LlamaIndex :

在下方的程式碼行中，我們安裝此 demo 所需的套件：

```
%pip install llama-index-llms-openvino transformers huggingface_hub
```

現在我們已經設定完成，讓我們來試試看：

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙.

```
!pip install llama-index
```

```
from llama_index.llms.openvino import OpenVINOLLM
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

### 模型載入

可以使用 `OpenVINOLLM` 方法指定模型參數來載入模型。

如果您有 Intel GPU，可以指定 `device_map="gpu"` 在其上執行 inference。

```
ov_config = {
    "PERFORMANCE_HINT": "LATENCY",
    "NUM_STREAMS": "1",
    "CACHE_DIR": "",
}


ov_llm = OpenVINOLLM(
    model_id_or_path="HuggingFaceH4/zephyr-7b-beta",
    context_window=3900,
    max_new_tokens=256,
    model_kwargs={"ov_config": ov_config},
    generate_kwargs={"temperature": 0.7, "top_k": 50, "top_p": 0.95},
    messages_to_prompt=messages_to_prompt,
    completion_to_prompt=completion_to_prompt,
    device_map="cpu",
)
```

```
response = ov_llm.complete("What is the meaning of life?")
print(str(response))
```

### Inference 使用本地端 OpenVINO 模型

您可以 [export 您的 model](https://github.com/huggingface/optimum-intel?tab=readme-ov-file#export) 至 OpenVINO IR 使用 the 格式 CLI，並從本地資料夾載入模型。

```
!optimum-cli export openvino --model HuggingFaceH4/zephyr-7b-beta ov_model_dir
```

建議套用 8 或 4-bit 權重 量化至 使用以下方式降低推論延遲與模型佔用空間 `--weight-format`:

```
!optimum-cli export openvino --model HuggingFaceH4/zephyr-7b-beta --weight-format int8 ov_model_dir
```

```
!optimum-cli export openvino --model HuggingFaceH4/zephyr-7b-beta --weight-format int4 ov_model_dir
```

```
ov_llm = OpenVINOLLM(
    model_id_or_path="ov_model_dir",
    context_window=3900,
    max_new_tokens=256,
    model_kwargs={"ov_config": ov_config},
    generate_kwargs={"temperature": 0.7, "top_k": 50, "top_p": 0.95},
    messages_to_prompt=messages_to_prompt,
    completion_to_prompt=completion_to_prompt,
    device_map="gpu",
)
```

您可以透過以下方式進一步提升推論速度： Dynamic Quantization 啟動值的 KV-快取量化。 這些選項可以透過以下方式啟用： `ov_config` 如下所示：

```
ov_config = {
    "KV_CACHE_PRECISION": "u8",
    "DYNAMIC_QUANTIZATION_GROUP_SIZE": "32",
    "PERFORMANCE_HINT": "LATENCY",
    "NUM_STREAMS": "1",
    "CACHE_DIR": "",
}
```

### Streaming

使用 `stream_complete` endpoint

```
response = ov_llm.stream_complete("Who is Paul Graham?")
for r in response:
    print(r.delta, end="")
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
resp = ov_llm.stream_chat(messages)


for r in resp:
    print(r.delta, end="")
```

如需更多資訊，請參閱：

- [OpenVINO LLM guide](https://docs.openvino.ai/2024/learn-openvino/llm_inference_guide.html).

- [OpenVINO Documentation](https://docs.openvino.ai/2024/home.html).

- [OpenVINO 入門指南](https://www.intel.com/content/www/us/en/content-details/819067/openvino-get-started-guide.html).

- [RAG 使用 LlamaIndex](https://github.com/openvinotoolkit/openvino_notebooks/tree/latest/notebooks/llm-rag-llamaindex) 的範例。
