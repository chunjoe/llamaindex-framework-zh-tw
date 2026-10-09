---
title: "NVIDIA NIMs"
---

`llama-index-llms-nvidia` 套件包含用於聊天模型和 embeddings 的 LlamaIndex 整合，這些模型由 [NVIDIA AI Foundation Models](https://www.nvidia.com/en-us/ai-data-science/foundation-models/) 提供支援，並託管在 [NVIDIA API Catalog](https://build.nvidia.com/) 上。NVIDIA AI Foundation models 是社群和 NVIDIA 建置的模型，經過優化，能在 NVIDIA 加速基礎設施上提供最佳效能。您可以使用 API 來查詢 NVIDIA API Catalog 上可用的即時 endpoint，從 DGX 託管的雲端運算環境中獲得快速結果，或者您可以透過 NVIDIA NIM 下載 NVIDIA 的 API catalog 中的模型，NIM 包含在 NVIDIA AI Enterprise 授權中。在本地運行模型的能力讓您的企業擁有對自訂內容的所有權，並對您的 IP 和 AI 應用擁有完全控制權。

使用 NVIDIA AI Enterprise 授權，NIM 可以從 NVIDIA 的 API catalog 匯出，並可在地或雲端運行，

NIM 依據模型進行打包成 container images，並透過 NVIDIA NGC Catalog 分發為 NGC container images。NIM 的核心是提供簡單、一致且熟悉的 API，用於在 AI 模型上執行 inference。

# NVIDIA 的 LLM connector

此範例將介紹如何使用 LlamaIndex 與使用公開可存取的 AI Foundation endpoints 互動並開發由 LLM 驅動的系統。

使用此 connector，您將能夠連接到並從可託管的 [NVIDIA NIMs](https://ai.nvidia.com/) 中可用的相容模型生成內容，例如：

- Google 的 [gemma-7b](https://build.nvidia.com/google/gemma-7b)
- Mistal AI 的 [mistral-7b-instruct-v0.2](https://build.nvidia.com/mistralai/mistral-7b-instruct-v2)
- 等等！

## 安裝

```
%pip install --upgrade --quiet llama-index-llms-nvidia llama-index-embeddings-nvidia llama-index-readers-file
```

## 設定

**開始使用：**

1. 使用 [NVIDIA](https://build.nvidia.com/) 建立免費帳戶，該平台託管 NVIDIA AI Foundation models。

2. 點選您選擇的模型。

3. 在 Input 下選擇 Python 標籤，然後點選 `Get API Key`。接著點選 `Generate Key`。

4. 複製並儲存生成的金鑰為 NVIDIA\_API\_KEY。從那裡您應該可以存取 endpoint。

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

```
from llama_index.llms.nvidia import NVIDIA
from llama_index.core.llms import ChatMessage, MessageRole


llm = NVIDIA()


messages = [
    ChatMessage(
        role=MessageRole.SYSTEM, content=("You are a helpful assistant.")
    ),
    ChatMessage(
        role=MessageRole.USER,
        content=("What are the most popular house pets in North America?"),
    ),
]


llm.chat(messages)
```

## 使用 NVIDIA NIMs

除了連接到託管的 [NVIDIA NIMs](https://ai.nvidia.com/) 之外，此 connector 也可以用於連接到本地 microservice 實例。這有助於在需要時將您的應用程式本地化。

有關如何設定本地 microservice 實例的說明，請參閱 <https://developer.nvidia.com/blog/nvidia-nim-offers-optimized-inference-microservices-for-deploying-ai-models-at-scale/>

```
from llama_index.llms.nvidia import NVIDIA


# connect to an chat NIM running at localhost:8080, spcecifying a specific model
llm = NVIDIA(
    base_url="http://localhost:8080/v1", model="meta/llama3-8b-instruct"
)
```

## 載入特定模型

現在我們可以透過傳入模型名稱（如文檔中所示，位於 [這裡](https://docs.api.nvidia.com/nim/reference/)）來載入我們的 `NVIDIA` LLM

> 注意：預設模型是 `meta/llama3-8b-instruct`。

```
# default model
llm = NVIDIA()
llm.model
```

我們可以觀察到我們的 `llm` 物件與 `.model` 屬性關聯的是哪個模型。

```
llm = NVIDIA(model="mistralai/mistral-7b-instruct-v0.2")
llm.model
```

## 基本功能

現在我們可以探索在 LlamaIndex 生態系統中使用 connector 的不同方法！

在開始之前，讓我們設定一個 `ChatMessage` 物件列表——這是某些方法的預期輸入。

我們對每個範例遵循相同的基本模式：

1. 我們將我們的 `NVIDIA` LLM 指向我們想要的模型
2. 我們將檢視如何使用 endpoint 來達成所需任務！

### 完整版：`.complete()`

我們可以使用 `.complete()`/`.acomplete()`（接受一個字串）來提示選定模型的回應。

讓我們為此任務使用我們的預設模型。

```
completion_llm = NVIDIA()
```

我們可以透過檢查 `.model` 屬性來驗證這是預期的預設值。

```
completion_llm.model
```

讓我們使用一個字串，在本例中為 `"Hello!"`，呼叫我們的模型 `.complete()`，並觀察回應。

```
completion_llm.complete("Hello!")
```

如 LlamaIndex 所預期的，我們在回應中獲得一個 `CompletionResponse`。

#### 異步完整版：`.acomplete()`

也有一個 async 實作，可以以相同的方式利用！

```
await completion_llm.acomplete("Hello!")
```

#### 聊天：`.chat()`現在我們可以使用 `.chat()` 方法來嘗試同樣的操作。此方法需要一個聊天訊息列表，所以我們將使用上面建立的列表。

我們將使用 `mistralai/mixtral-8x7b-instruct-v0.1` 模型作為範例。

```
chat_llm = NVIDIA(model="mistralai/mixtral-8x7b-instruct-v0.1")
```

我們現在只需要呼叫 `.chat()`，對我們的 `ChatMessages` 列表進行操作，並觀察我們的回應。

您也會注意到，我們可以傳入一些額外的關鍵字參數來影響生成——在此例中，我們使用了 `seed` 參數來影響我們的生成，並使用了 `stop` 參數來指示我們希望模型在達到特定 token 時停止生成！

> 注意：您可以參考所選模型的 API 文件，以了解模型端點支援哪些額外的 kwargs。Mixtral 的可以在 [這裡](https://docs.api.nvidia.com/nim/reference/mistralai-mixtral-8x7b-instruct-infer) 找到作為範例！

```
chat_llm.chat(messages, seed=4, stop=["cat", "cats", "Cat", "Cats"])
```

如預期，我們在回應中收到了一個 `ChatResponse`。

#### Async Chat: (`achat`)

我們還有 `.chat()` 方法的異步實作，可以以以下方式呼叫。

```
await chat_llm.achat(messages)
```

### Stream: `.stream_chat()`

我們也可以使用 `build.nvidia.com` 上找到的模型來進行 streaming 用例！

讓我們選擇另一個模型並觀察此行為。我們將使用 Google 的 `gemma-7b` 模型來執行此任務。

```
stream_llm = NVIDIA(model="google/gemma-7b")
```

讓我們使用 `.stream_chat()` 呼叫我們的模型，它同樣需要一個 `ChatMessage` 物件列表，並擷取回應。

```
streamed_response = stream_llm.stream_chat(messages)
```

```
streamed_response
```

如我們所見，回應是一個帶有串流回應的生成器。

讓我們看看生成完成後的最終回應。

```
last_element = None
for last_element in streamed_response:
    pass


print(last_element)
```

#### Async Stream: `.astream_chat()`

我們也有一個等效的異步串流方法，可以像同步實作一樣使用。

```
streamed_response = await stream_llm.astream_chat(messages)
```

```
streamed_response
```

```
last_element = None
async for last_element in streamed_response:
    pass


print(last_element)
```

## Streaming Query Engine Responses

讓我們使用一個稍微複雜一點的範例來使用 query engine！

我們將從載入一些資料開始（我們將使用 [Galaxy 入門指南](https://web.eecs.utk.edu/~hqi/deeplearning/project/hhgttg.txt)）。

### 載入資料

讓我們首先建立一個資料可以存放的目錄。

```
!mkdir -p 'data/hhgttg'
```

我們將從上述來源下載我們的資料。

```
!wget 'https://web.eecs.utk.edu/~hqi/deeplearning/project/hhgttg.txt' -O 'data/hhgttg/hhgttg.txt'
```

此步驟需要一個 embedding model！我們將使用 NVIDIA `NV-Embed-QA` 模型來實現此目的，並將其儲存到我們的 `Settings` 中。

```
from llama_index.embeddings.nvidia import NVIDIAEmbedding
from llama_index.core import Settings


embedder = NVIDIAEmbedding(model="NV-Embed-QA", truncate="END")
Settings.embed_model = embedder
```

現在我們可以載入我們的 document 並利用上述內容建立一個 index。

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader


documents = SimpleDirectoryReader("data/hhgttg").load_data()
index = VectorStoreIndex.from_documents(documents)
```

現在我們可以建立一個簡單的 query engine，並將我們的 `streaming` 參數設定為 `True`。

```
streaming_qe = index.as_query_engine(streaming=True)
```

讓我們向我們的 query engine 發送一個查詢，然後串流回應。

```
streaming_response = streaming_qe.query(
    "What is the significance of the number 42?",
)
```

```
streaming_response.print_response_stream()
```

### Tool calling

從 v0.2.1 開始，NVIDIA 支援 tool calling。

NVIDIA 提供與 build.nvidia.com 上各種模型以及本地 NIMs 的整合。並非所有這些模型都經過訓練用於 tool calling。請確保選擇一個為您的實驗和應用程式支援 tool calling 的模型。

您可以使用以下內容獲取已知支援 tool calling 的模型列表：

`NOTE:` 如需更多範例，請參閱：[nvidia\_agent.ipynb](https://developers.llamaindex.ai/python/framework/integrations/llm/agent/nvidia_agent.ipynb/)

```
tool_models = [
    model
    for model in NVIDIA().available_models
    if model.is_function_calling_model
]
```

對於具備 tool 的模型，

```
from llama_index.core.tools import FunctionTool




def multiply(a: int, b: int) -> int:
    """Multiple two integers and returns the result integer"""
    return a * b




multiply_tool = FunctionTool.from_defaults(fn=multiply)




def add(a: int, b: int) -> int:
    """Add two integers and returns the result integer"""
    return a + b




add_tool = FunctionTool.from_defaults(fn=add)


llm = NVIDIA("meta/llama-3.1-70b-instruct")
from llama_index.core.agent import FunctionAgent


agent_worker = FunctionAgent(
    tools=[multiply_tool, add_tool],
    llm=llm,
)


response = await agent.run("What is (121 * 3) + 42?")
print(str(response))
```
