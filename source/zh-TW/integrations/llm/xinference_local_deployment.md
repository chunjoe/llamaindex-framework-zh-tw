---
title: "Xorbits 推論"
---

在這個示範 Notebook 中，我們將展示如何使用 Xorbits Inference (簡稱 Xinference) 在三個步驟中部署本地的 LLMs。

在範例中，我們將使用 GGML 格式的 Llama 2 chat model，但程式碼可以輕鬆轉移到 Xinference 支援的所有 LLM chat model。以下是一些範例：

| Name | Type | Language | Format | Size (in billions) | Quantization |
| :--- | :--- | :--- | :--- | :--- | :--- |
| llama-2-chat | RLHF Model | en | ggmlv3 | 7, 13, 70 | ’q2\_K’, ‘q3\_K\_L’, … , ‘q6\_K’, ‘q8\_0’ |
| chatglm | SFT Model | en, zh | ggmlv3 | 6 | ’q4\_0’, ‘q4\_1’, ‘q5\_0’, ‘q5\_1’, ‘q8\_0’ |
| chatglm2 | SFT Model | en, zh | ggmlv3 | 6 | ’q4\_0’, ‘q4\_1’, ‘q5\_0’, ‘q5\_1’, ‘q8\_0’ |
| wizardlm-v1.0 | SFT Model | en | ggmlv3 | 7, 13, 33 | ’q2\_K’, ‘q3\_K\_L’, … , ‘q6\_K’, ‘q8\_0’ |
| wizardlm-v1.1 | SFT Model | en | ggmlv3 | 13 | ’q2\_K’, ‘q3\_K\_L’, … , ‘q6\_K’, ‘q8\_0’ |
| vicuna-v1.3 | SFT Model | en | ggmlv3 | 7, 13 | ’q2\_K’, ‘q3\_K\_L’, … , ‘q6\_K’, ‘q8\_0’ |

最新的完整支援模型列表可以在 Xorbits Inference 的 [official GitHub page](https://github.com/xorbitsai/inference/blob/main/README.md) 找到。

## 🤖 安裝 Xinference

i. 在終端機視窗中執行 `pip install "xinference[all]"`。

ii. 安裝完成後，重新啟動此 jupyter notebook。

iii. 在一個新的終端機視窗中執行 `xinference`。

iv. 您應該會看到類似以下的輸出：

```
INFO:xinference:Xinference successfully started. Endpoint: http://127.0.0.1:9997
INFO:xinference.core.service:Worker 127.0.0.1:21561 has been added successfully
INFO:xinference.deploy.worker:Xinference worker successfully started.
```

v. 在 endpoint description 中，找到冒號後的路徑中的 endpoint port number。在上述案例中是 `9997`。

vi. 使用以下儲存格設定 port number：

```
%pip install llama-index-llms-xinference
```

```
port = 9997  # replace with your endpoint port number
```


## 🚀 啟動本地模型

在這一步驟中，我們從 `llama_index` 匯入相關的 library。

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
!pip install llama-index
```

```
# If Xinference can not be imported, you may need to restart jupyter notebook
from llama_index.core import SummaryIndex
from llama_index.core import (
    TreeIndex,
    VectorStoreIndex,
    KeywordTableIndex,
    KnowledgeGraphIndex,
    SimpleDirectoryReader,
)
from llama_index.llms.xinference import Xinference
from xinference.client import RESTfulClient
from IPython.display import Markdown, display
```


然後，我們啟動一個 model 並使用它。這使我們能夠在後續步驟中將 model 連接到 documents 和 queries。

請自由更改參數以獲得更好的效能！為了達到最佳結果，建議使用大於 13B 的模型尺寸。話雖如此，7B 的模型對於這個簡短的示範來說已經足夠了。

以下是 GGML 格式 Llama 2 chat model 的一些更多參數選項，按空間消耗量從最少到最為資源密集但效能最高的順序排列。

model\_大小\_在\_十億：

`7`, `13`, `70`

針對 7B 與 13B 模型的 quantization：

`q2_K`, `q3_K_L`, `q3_K_M`, `q3_K_S`, `q4_0`, `q4_1`, `q4_K_M`, `q4_K_S`, `q5_0`, `q5_1`, `q5_K_M`, `q5_K_S`, `q6_K`, `q8_0`

70B 模型的 quantizations：

`q4_0`

```
# Define a client to send commands to xinference
client = RESTfulClient(f"http://localhost:{port}")


# Download and Launch a model, this may take a while the first time
model_uid = client.launch_model(
    model_name="llama-2-chat",
    model_size_in_billions=7,
    model_format="ggmlv3",
    quantization="q2_K",
)


# Initiate Xinference object to use the LLM
llm = Xinference(
    endpoint=f"http://localhost:{port}",
    model_uid=model_uid,
    temperature=0.0,
    max_tokens=512,
)
```


## 🕺 建立索引… 並聊天！

在這一步驟中，我們將 model 和 data 組合起來，建立一個 query engine。然後，該 query engine 可用作聊天機器人，根據給定的 data 回答我們的查詢。

我們將使用 `VetorStoreIndex`，因為它相對快速。話雖如此，您可以自由更改索引以獲得不同的體驗。以下是從前一個步驟匯入的可用索引：

`ListIndex`, `TreeIndex`, `VetorStoreIndex`, `KeywordTableIndex`, `KnowledgeGraphIndex`

要更改索引，只需在後續程式碼中將 `VetorStoreIndex` 替換為另一個索引即可。

所有可用索引的最新完整列表可以在 Llama Index 的 [official Docs](https://gpt-index.readthedocs.io/en/latest/core_modules/data_modules/index/modules.html) 找到。

```
# create index from the data
documents = SimpleDirectoryReader("../data/paul_graham").load_data()


# change index name in the following line
index = VectorStoreIndex.from_documents(documents=documents)


# create the query engine
query_engine = index.as_query_engine(llm=llm)
```


您可以在提問之前，直接透過 `Xinference` 物件設定 temperature 和 max answer length (in tokens)。這使我們能夠在每次都重建 query engine 的情況下，為不同的問題更改參數。`temperature` 是一個介於 0 和 1 之間的數值，用來控制回應的隨機性。數值越高，創造力會增加，但可能會導致跑題的回覆。設定為零可保證每次都得到相同的回應。

`max_tokens` 是一個整數，設定回應的上限長度。如果答案看起來被截斷，請增加此值，但請注意，過長的回答可能會超出 context window 並導致錯誤。

```
# optionally, update the temperature and max answer length (in tokens)
llm.__dict__.update({"temperature": 0.0})
llm.__dict__.update({"max_tokens": 2048})


# ask a question and display the answer
question = "What did the author do after his time at Y Combinator?"


response = query_engine.query(question)
display(Markdown(f"<b>{response}</b>"))
```
