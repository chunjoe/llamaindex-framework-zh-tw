---
title: "NVIDIA NIMs"
---

`llama-index-llms-nvidia` 套件包含 LlamaIndex 整合，用於使用 NVIDIA NIM 推理微服務建立模型應用程式。NIM 支援來自社群以及 NVIDIA 的聊天、embedding 和 re-ranking 模型等各領域的模型。這些模型由 NVIDIA 進行優化，以在 NVIDIA 加速基礎設施上提供最佳效能，並以 NIM 的形式部署，這是一種易於使用、預建的容器，可使用單一指令在 NVIDIA 加速基礎設施上的任何地方部署。

NIM 的 NVIDIA 託管部署可於 [NVIDIA API catalog](https://build.nvidia.com/) 上進行測試。測試後，NIM 可以使用 NVIDIA AI Enterprise 授權從 NVIDIA 的 API catalog 中匯出，並在本地或雲端運行，讓企業擁有其 IP 和 AI 應用的所有權和完全控制權。

NIM 依模型進行打包成容器映像，並透過 NVIDIA NGC Catalog 分發為 NGC container images。NIM 的核心是提供簡單、一致且熟悉的 API，用於在 AI 模型上執行推理。

```
%pip install --upgrade --quiet llama-index-core llama-index-readers-file llama-index-llms-nvidia llama-index-embeddings-nvidia llama-index-postprocessor-nvidia-rerank
```

導入一個測試資料集，關於 2021 年舊金山房屋建築的 PDF。

```
!mkdir data
!wget "https://www.dropbox.com/scl/fi/p33j9112y0ysgwg77fdjz/2021_Housing_Inventory.pdf?rlkey=yyok6bb18s5o31snjd2dxkxz3&dl=0" -O "data/housing_data.pdf"
```

```
--2024-05-28 17:42:44--  https://www.dropbox.com/scl/fi/p33j9112y0ysgwg77fdjz/2021_Housing_Inventory.pdf?rlkey=yyok6bb18s5o31snjd2dxkxz3&dl=0
Resolving www.dropbox.com (www.dropbox.com)... 162.125.1.18, 2620:100:6016:18::a27d:112
Connecting to www.dropbox.com (www.dropbox.com)|162.125.1.18|:443... connected.
HTTP request sent, awaiting response... 302 Found
Location: https://ucc6b49e945b8d71944c85f4a76d.dl.dropboxusercontent.com/cd/0/inline/CTzJ0ZeHC3AFIV3iv1bv9v0oMNXW03OW2waLdeKJNs0X6Tto0MSewm9RZBHwSLhqk4jWFaCmbhMGVXeWa6xPO4mAR4hC3xflJfwgS9Z4lpPUyE4AtlDXpnfsltjEaNeFCSY/file# [following]
--2024-05-28 17:42:45--  https://ucc6b49e945b8d71944c85f4a76d.dl.dropboxusercontent.com/cd/0/inline/CTzJ0ZeHC3AFIV3iv1bv9v0oMNXW03OW2waLdeKJNs0X6Tto0MSewm9RZBHwSLhqk4jWFaCmbhMGVXeWa6xPO4mAR4hC3xflJfwgS9Z4lpPUyE4AtlDXpnfsltjEaNeFCSY/file
Resolving ucc6b49e945b8d71944c85f4a76d.dl.dropboxusercontent.com (ucc6b49e945b8d71944c85f4a76d.dl.dropboxusercontent.com)... 162.125.4.15, 2620:100:6016:15::a27d:10f
Connecting to ucc6b49e945b8d71944c85f4a76d.dl.dropboxusercontent.com (ucc6b49e945b8d71944c85f4a76d.dl.dropboxusercontent.com)|162.125.4.15|:443... connected.
HTTP request sent, awaiting response... 302 Found
Location: /cd/0/inline2/CTySzMwupnuXzKpccOeYJ-7RI0NK0f7XMKBkpicHxSBuuwqAvFly51Fm0oCOwFctgeTqmD3thJsTqfFNOFHNe2JSIkJerj3mMr4Du3C7x1BcSy8t5raSfHQ_qSXF1eHrhdFII8Ou59jbofYVLe0punOl-RIa9k_v722SwkxVbg0KL9MrRL48XjX7JbsYHKTHq-gZSdAmpXpIGqS22eJavcSTuYMIy_GSZtDIs3quHM3PGU4849rG34RjpvAa-XkYDBdE996CxWupZ1C2Red9jEc5Tc6miGgt8-4LbGoxKwKF5I_Q3EqHCbvkibVR8OuKSKPtQZcNJSjsvIImzDLJ2WB6BAp2CBxz8szFF3jF3Gp6Iw/file [following]
--2024-05-28 17:42:45--  https://ucc6b49e945b8d71944c85f4a76d.dl.dropboxusercontent.com/cd/0/inline2/CTySzMwupnuXzKpccOeYJ-7RI0NK0f7XMKBkpicHxSBuuwqAvFly51Fm0oCOwFctgeTqmD3thJsTqfFNOFHNe2JSIkJerj3mMr4Du3C7x1BcSy8t5raSfHQ_qSXF1eHrhdFII8Ou59jbofYVLe0punOl-RIa9k_v722SwkxVbg0KL9MrRL48XjX7JbsYHKTHq-gZSdAmpXpIGqS22eJavcSTuYMIy_GSZtDIs3quHM3PGU4849rG34RjpvAa-XkYDBdE996CxWupZ1C2Red9jEc5Tc6miGgt8-4LbGoxKwKF5I_Q3EqHCbvkibVR8OuKSKPtQZcNJSjsvIImzDLJ2WB6BAp2CBxz8szFF3jF3Gp6Iw/file
Reusing existing connection to ucc6b49e945b8d71944c85f4a76d.dl.dropboxusercontent.com:443.
HTTP request sent, awaiting response... 200 OK
Length: 4808625 (4.6M) [application/pdf]
Saving to: ‘data/housing_data.pdf’


data/housing_data.p 100%[===================>]   4.58M  8.26MB/s    in 0.6s


2024-05-28 17:42:47 (8.26 MB/s) - ‘data/housing_data.pdf’ saved [4808625/4808625]
```

## 設定

從 [NVIDIA API Catalog](https://build.nvidia.com/) 匯入依賴項，並設定您的 NVIDIA API 金鑰。

**開始使用：**

1. 使用 [NVIDIA](https://build.nvidia.com/) 建立免費帳戶，該平台託管 NVIDIA AI Foundation 模型。

2. 點擊您選擇的模型。

3. 在 **Input** 下，選擇 **Python** 標籤，然後點擊 **Get API Key**。接著點擊 **Generate Key**。

4. 複製並儲存生成的金鑰為 `NVIDIA_API_KEY`。從那裡您應該可以存取 endpoint。

```
from llama_index.core import SimpleDirectoryReader, Settings, VectorStoreIndex
from llama_index.embeddings.nvidia import NVIDIAEmbedding
from llama_index.llms.nvidia import NVIDIA
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core import Settings
from google.colab import userdata
import os


os.environ["NVIDIA_API_KEY"] = userdata.get("nvidia-api-key")
```

使用 NVIDIA 託管的 NIM 進行 embedding 模型。

NVIDIA 的預設 embedding 只會嵌入前 512 個 tokens，因此請將 chunk size 設定為 500，以最大化 embedding 的準確性。

```
Settings.text_splitter = SentenceSplitter(chunk_size=500)


documents = SimpleDirectoryReader("./data").load_data()
```

將 embedding 模型設定為 NVIDIA 的預設模型。如果一個 chunk 超過模型可以編碼的 token 數量，預設行為會拋出錯誤，因此請將 `truncate="END"` 設定為丟棄超過限制的 tokens。

```
Settings.embed_model = NVIDIAEmbedding(model="NV-Embed-QA", truncate="END")


index = VectorStoreIndex.from_documents(documents)
```

現在資料已嵌入並在記憶體中索引，請設定 LLM。可以透過遵循 [NIM 快速入門指南](https://docs.nvidia.com/nim/large-language-models/latest/getting-started.html) 在 5 分鐘內使用 Docker 在本地託管 NIM。

以下範例展示了如何：

- 使用 Meta 的 open-source `meta/llama-3.1-8b-instruct` 模型作為本地 NIM。
- 使用 NVIDIA API Catalog 中的 `meta/llama-3.1-70b-instruct` 作為 NIM。

如果您正在使用本地 NIM，請將 `base_url` 更改為您部署的 NIM URL。

範例會檢索最相關的 20 個 chunk 來回答問題。

```
# Self-hosted NIM: uncomment the line below and comment the API Catalog line
# Settings.llm = NVIDIA(model="meta/llama-3.1-8b-instruct", base_url="http://your-nim-host-address:8000/v1")


# API Catalog NIM: comment this line if using a self-hosted NIM
Settings.llm = NVIDIA(model="meta/llama-3.1-70b-instruct")


query_engine = index.as_query_engine(similarity_top_k=20)
```

提出一個在 document（第 18 頁）中單一位置就能回答的簡單問題。

```
response = query_engine.query(
    "How many new housing units were built in San Francisco in 2021?"
)
print(response)
```

```
There was a net addition of 4,649 units to the City’s housing stock in 2021.
```

現在提出一個需要閱讀表格的更複雜問題（請參閱 document 第 41 頁）：

```
response = query_engine.query(
    "What was the net gain in housing units in the Mission in 2021?"
)
print(response)
```

```
There is no specific information about the net gain in housing units in the Mission in 2021. The provided data is about the city's overall housing stock and production, but it does not provide a breakdown by neighborhood, including the Mission.
```

這不是正確的答案。嘗試使用更進階的 PDF 解析器，LlamaParse：

```
!pip install llama-parse
```

```
from llama_parse import LlamaParse


# in a notebook, LlamaParse requires this to work
import nest_asyncio


nest_asyncio.apply()


# you can get a key at cloud.llamaindex.ai
os.environ["LLAMA_CLOUD_API_KEY"] = userdata.get("llama-cloud-key")


# set up parser
parser = LlamaParse(
    result_type="markdown"  # "markdown" and "text" are available
)


# use SimpleDirectoryReader to parse our file
file_extractor = {".pdf": parser}
documents2 = SimpleDirectoryReader(
    "./data", file_extractor=file_extractor
).load_data()
```

```
Started parsing the file under job_id 84cb91f7-45ec-4b99-8281-0f4beef6a892
```

```
index2 = VectorStoreIndex.from_documents(documents2)
query_engine2 = index2.as_query_engine(similarity_top_k=20)
```

```
response = query_engine2.query(
    "What was the net gain in housing units in the Mission in 2021?"
)
print(response)
```

```
The net gain in housing units in the Mission in 2021 was 1,305 units.
```

使用更好的解析器，LLM 能夠正確回答問題。

現在嘗試一個更棘手的問題：

```
response = query_engine2.query(
    "How many affordable housing units were completed in 2021?"
)
print(response)
```

```
Repeat: 110
```

LLM 感到困惑；這似乎是房屋單元的百分比增加。

嘗試為 LLM 提供更多上下文（40 而不是 20），然後使用 reranker 對這些 chunk 進行排序。請使用 NVIDIA 的 reranker：

```
from llama_index.postprocessor.nvidia_rerank import NVIDIARerank


query_engine3 = index2.as_query_engine(
    similarity_top_k=40, node_postprocessors=[NVIDIARerank(top_n=10)]
)
```

```
response = query_engine3.query(
    "How many affordable housing units were completed in 2021?"
)
print(response)
```

```
1,495
```

太棒了！現在數字是正確的（如果您想知道，這在第 35 頁）。