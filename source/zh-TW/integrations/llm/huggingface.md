---
title: "Hugging Face 大型語言模型"
---

您可以透過多種方式使用 [Hugging Face](https://huggingface.co/) 的 LLM，既可在本機執行，也可使用 Hugging Face 的 [Inference Providers](https://huggingface.co/docs/inference-providers)。Hugging Face 提供多個 Python 套件來連接這些服務，而 LlamaIndex 會將它們包裝成 `LLM` 實體：

- [`transformers`](https://github.com/huggingface/transformers) 套件：使用 `llama_index.llms.HuggingFaceLLM`
- [Hugging Face Inference Providers](https://huggingface.co/docs/inference-providers)，由 [`huggingface_hub[inference]`](https://github.com/huggingface/huggingface_hub) 包裝：使用 `llama_index.llms.HuggingFaceInferenceAPI`

上述兩種方式可以有許多組合，因此這份筆記只介紹幾種常見做法。以下以 Hugging Face 的 [Text Generation 任務](https://huggingface.co/tasks/text-generation) 為例。

先安裝這個示範所需的套件：

- `transformers[torch]` 是 `HuggingFaceLLM` 所需的套件。
- `huggingface_hub[inference]` 是 `HuggingFaceInferenceAPI` 所需的套件。
- 在 Z shell (`zsh`) 中執行時，需要為參數加上引號。

```
%pip install llama-index-llms-huggingface # for local inference
%pip install llama-index-llms-huggingface-api # for remote inference
```

```
!pip install "transformers[torch]" "huggingface_hub[inference]"
```

如果您在 Colab 開啟這份筆記，可能需要先安裝 LlamaIndex 🦙。

```
!pip install llama-index
```

環境準備完成後，就來試用看看：

# 設定 Hugging Face 帳戶

首先，請建立 Hugging Face 帳戶並取得 token。您可以[在此註冊](https://huggingface.co/join)，接著[在此建立 token](https://huggingface.co/settings/tokens)。

終端機視窗

```
export HUGGING_FACE_TOKEN=hf_your_token_here
```

```
import os
from typing import List, Optional


from llama_index.llms.huggingface import HuggingFaceLLM
from llama_index.llms.huggingface_api import HuggingFaceInferenceAPI


HF_TOKEN: Optional[str] = os.getenv("HUGGING_FACE_TOKEN")
# NOTE: None default will fall back on Hugging Face's token storage
# when this token gets used within HuggingFaceInferenceAPI
```

## 透過 Inference Providers 使用模型

使用開源模型最簡單的方式，是透過 Hugging Face 的 [Inference Providers](https://huggingface.co/docs/inference-providers)。以下以適合處理複雜任務的 DeepSeek R1 模型為例。

透過這些推論服務，您可以在無伺服器架構上執行模型，不必自行管理推論主機。

```
remotely_run = HuggingFaceInferenceAPI(
    model_name="deepseek-ai/DeepSeek-R1-0528",
    token=HF_TOKEN,
    provider="auto",  # this will use the best provider available
)
```

您也可以指定偏好的推論服務提供者；此處使用 [`together` provider](https://huggingface.co/togethercomputer)。

```
remotely_run = HuggingFaceInferenceAPI(
    model_name="Qwen/Qwen3-235B-A22B",
    token=HF_TOKEN,
    provider="together",  # this will use the best provider available
)
```

## 在本機使用開源模型

首先使用一個適合本機推論的開源模型。第一次呼叫時，模型會下載到本機的 Hugging Face 模型快取；之後便會使用您電腦上的硬體執行。

以下使用適合本機推論的 [Gemma 3N E4B](https://huggingface.co/google/gemma-3n-E4B-it) 模型。

```
locally_run = HuggingFaceLLM(model_name="google/gemma-3n-E4B-it")
```

## 使用專用的 Inference Endpoint

您也可以為模型啟用專用的 Inference Endpoint，並透過該端點執行模型。

```
endpoint_server = HuggingFaceInferenceAPI(
    model="https://(<your-endpoint>.eu-west-1.aws.endpoints.huggingface.cloud"
)
```

## 使用本機推論引擎（vLLM 或 TGI）

您也可以使用本機推論引擎執行模型，例如 [vLLM](https://github.com/vllm-project/vllm) 或 [TGI](https://github.com/huggingface/text-generation-inference)。

```
# You can also connect to a model being served by a local or remote
# Text Generation Inference server
tgi_server = HuggingFaceInferenceAPI(model="http://localhost:8080")
```

透過 `HuggingFaceInferenceAPI` 執行文字補全時，底層使用的是 Hugging Face 的 [Text Generation 任務](https://huggingface.co/tasks/text-generation)。

```
completion_response = remotely_run_recommended.complete("To infinity, and")
print(completion_response)
```

```
 beyond!
The Infinity Wall Clock is a unique and stylish way to keep track of time. The clock is made of a durable, high-quality plastic and features a bright LED display. The Infinity Wall Clock is powered by batteries and can be mounted on any wall. It is a great addition to any home or office.
```

## 設定分詞器

如果您修改了 LLM，也應同步調整全域分詞器（tokenizer）。

```
from llama_index.core import set_global_tokenizer
from transformers import AutoTokenizer


set_global_tokenizer(
    AutoTokenizer.from_pretrained("HuggingFaceH4/zephyr-7b-alpha").encode
)
```

Hugging Face Inference API 也包裝了其他任務，例如：

- `llama_index.llms.HuggingFaceInferenceAPI.chat`：[對話任務](https://huggingface.co/tasks/conversational)
- `llama_index.embeddings.HuggingFaceInferenceAPIEmbedding`：[特徵擷取任務](https://huggingface.co/tasks/feature-extraction)

此外，也支援透過以下套件使用 Hugging Face 嵌入模型：

- `transformers[torch]`：由 `HuggingFaceEmbedding` 包裝。
- `huggingface_hub[inference]`：由 `HuggingFaceInferenceAPIEmbedding` 包裝。

以上兩種方式都繼承自 `llama_index.embeddings.base.BaseEmbedding`。
