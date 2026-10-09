---
title: "OpenVINO GenAI LLMs"
---

[OpenVINO™](https://github.com/openvinotoolkit/openvino) 是一個用於優化和部署 AI 推理的開源工具包。OpenVINO™ Runtime 可以讓在不同硬體 [devices](https://github.com/openvinotoolkit/openvino?tab=readme-ov-file#supported-hardware-matrix) 上運行相同的模型。加速您在以下使用案例中的深度學習效能：語言 + LLMs、電腦視覺、自動語音識別等。

`OpenVINOGenAILLM` 是 [OpenVINO-GenAI API](https://github.com/openvinotoolkit/openvino.genai) 的一個包裝器。透過 LlamaIndex 包裝的此實體，可以在本地運行 OpenVINO 模型：

在下面的程式碼中，我們安裝了此示範所需的套件：

```
%pip install llama-index-llms-openvino-genai
```

```
%pip install optimum[openvino]
```

現在設定完成，讓我們開始試用：

如果您在 Colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
!pip install llama-index
```

```
from llama_index.llms.openvino_genai import OpenVINOGenAILLM
```

```
/home2/ethan/intel/llama_index/llama_test/lib/python3.10/site-packages/pydantic/_internal/_fields.py:132: UserWarning: Field "model_path" in OpenVINOGenAILLM has conflict with protected namespace "model_".


You may be able to resolve this warning by setting `model_config['protected_namespaces'] = ()`.
  warnings.warn(
```

### 模型匯出

可以透過 CLI 將您的模型 [export your model](https://github.com/huggingface/optimum-intel?tab=readme-ov-file#export) 為 OpenVINO IR 格式，並從本地資料夾載入模型。

```
!optimum-cli export openvino --model microsoft/Phi-3-mini-4k-instruct --task text-generation-with-past --weight-format int4 model_path
```

您可以從 Hugging Face 的 OpenVINO model hub 下載優化後的 IR 模型。

```
import huggingface_hub as hf_hub


model_id = "OpenVINO/Phi-3-mini-4k-instruct-int4-ov"
model_path = "Phi-3-mini-4k-instruct-int4-ov"


hf_hub.snapshot_download(model_id, local_dir=model_path)
```

```
Fetching 17 files:   0%|          | 0/17 [00:00<?, ?it/s]










'/home2/ethan/intel/llama_index/docs/examples/llm/Phi-3-mini-4k-instruct-int4-ov'
```

### 模型載入

可以透過 `OpenVINOGenAILLM` 方法指定模型參數來載入模型。

如果您有 Intel GPU，您可以指定 `device="gpu"` 在其上運行 inference。

```
ov_llm = OpenVINOGenAILLM(
    model_path=model_path,
    device="CPU",
)
```

您可以透過 `ov_llm.config` 傳遞 generation config 參數。支援的參數請參閱 [openvino\_genai.GenerationConfig](https://docs.openvino.ai/2024/api/genai_api/_autosummary/openvino_genai.GenerationConfig.html)。

```
ov_llm.config.max_new_tokens = 100
```

```
response = ov_llm.complete("What is the meaning of life?")
print(str(response))
```

```
# Answer
The meaning of life is a profound and complex question that has been debated by philosophers, theologians, scientists, and thinkers throughout history. Different cultures, religions, and individuals have their own interpretations and beliefs about what gives life purpose and significance.


From a philosophical standpoint, existentialists like Jean-Paul Sartre and Albert Camus have argued that life inherently has no meaning, and it is
```

### 串流

使用 `stream_complete` endpoint

```
response = ov_llm.stream_complete("Who is Paul Graham?")
for r in response:
    print(r.delta, end="")
```

```
Paul Graham is a computer scientist and entrepreneur who is best known for founding the startup accelerator program Y Combinator. He is also the founder of the web development company Viaweb, which was acquired by PayPal for $497 million in 1raneworks.


What is Y Combinator?


Y Combinator is a startup accelerator program that provides funding, mentorship, and resources to early-stage start
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

```
I'm Phi, Microsoft's AI assistant. How can I assist you today?
```

欲了解更多資訊，請參閱：

- [OpenVINO LLM guide](https://docs.openvino.ai/2024/learn-openvino/llm_inference_guide.html)。

- [OpenVINO Documentation](https://docs.openvino.ai/2024/home.html)。

- [OpenVINO 入門指南](https://www.intel.com/content/www/us/en/content-details/819067/openvino-get-started-guide.html)。

- [RAG 包含 LlamaIndex](https://github.com/openvinotoolkit/openvino_notebooks/tree/latest/notebooks/llm-rag-llamaindex) 的範例。