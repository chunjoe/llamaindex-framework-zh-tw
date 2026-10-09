---
title: "NVIDIA LLM 文字補全 API"
---

`llama-index-llms-nvidia` package 將 `NVIDIA` class 擴充，以支援用於程式碼完成模型的 `/completions` API，例如：

- `bigcode/starcoder2-7b`
- `bigcode/starcoder2-15b`

## 安裝

```
%pip install --upgrade --quiet llama-index-llms-nvidia
```

## 設定

**開始使用：**

1. 使用 [NVIDIA](https://build.nvidia.com/) 建立免費帳戶，該平台託管 NVIDIA AI Foundation 模型。

2. 點選您選擇的模型。

3. 在 Input 下選 Python 標籤，然後點選 `Get API Key`。接著點選 `Generate Key`。

4. 複製並儲存生成的 key 為 NVIDIA\_API\_KEY。從此您就可以存取 endpoints。

```
import getpass
import os


# del os.environ['NVIDIA_API_KEY']  ## delete key and reset
if os.environ.get("NVIDIA_API_KEY", "").startswith("nvapi-"):
    print("Valid NVIDIA_API_KEY already in environment. Delete to reset")
else:
    nvapi_key = getpass.getpass("NVAPI Key (starts with nvapi-): ")
    assert nvapi_key.startswith(
        "nvapi-"
    ), f"{nvapi_key[:5]}... is not a valid key"
    os.environ["NVIDIA_API_KEY"] = nvapi_key
```

```
# llama-parse is async-first, running the async code in a notebook requires the use of nest_asyncio
import nest_asyncio


nest_asyncio.apply()
```

## 使用 NVIDIA API Catalog

### `use_chat_completions` 參數的使用

設定 `None`（預設值）以決定在每次呼叫時是否使用帶有 query keyword arguments 的 `/chat/completions` 或 `/completions` endpoints。

- 設定 `False` 以使用 `/completions` endpoint。
- 設定 `True` 以使用 `/chat/completions` endpoint。

```
from llama_index.llms.nvidia import NVIDIA


llm = NVIDIA(model="bigcode/starcoder2-15b", use_chat_completions=False)
```

### 可用模型

使用 `is_chat_model` 來過濾可用的 text completion 模型：

```
print([model for model in llm.available_models if model.is_chat_model])
```

## 使用 NVIDIA NIMs

除了連接到託管的 [NVIDIA NIMs](https://ai.nvidia.com/) 之外，此 connector 也可以用於連接到本地 NIM 實例。這有助於在需要時將您的應用程式本地化。

有關如何設定本地 NIM 實例的說明，請參閱 [NVIDIA NIM](https://developer.nvidia.com/nim)。

```
from llama_index.llms.nvidia import NVIDIA


# Connect to a NIM running at localhost:8080
llm = NVIDIA(base_url="http://localhost:8080/v1")
```

### Complete: `.complete()`

我們可以利用 `.complete()`/`.acomplete()`（接受一個 string）來提示選定模型的回應。

讓我們使用我們的預設模型來執行此任務。

```
print(llm.complete("# Function that does quicksort:"))
```

如預期，LlamaIndex 會回傳一個 `CompletionResponse`。

#### Async Complete: `.acomplete()`

也有一個 async 實作，可以以相同的方式利用！

```
await llm.acomplete("# Function that does quicksort:")
```

#### Streaming

```
x = llm.stream_complete(prompt="# Reverse string in python:", max_tokens=512)
```

```
for t in x:
    print(t.delta, end="")
```

#### Async Streaming

```
x = await llm.astream_complete(
    prompt="# Reverse program in python:", max_tokens=512
)
```

```
async for t in x:
    print(t.delta, end="")
```
