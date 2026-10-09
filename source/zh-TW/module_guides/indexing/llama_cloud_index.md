---
title: "LlamaCloudIndex + LlamaCloudRetriever"
---

`LlamaCloudIndex` 會將此框架連接至 Index 的第一版，也就是 [LlamaParse](https://developers.llamaindex.ai/llamaparse/index.md) 提供的代管式資料匯入與檢索服務。LlamaParse 是 LlamaIndex 團隊提供的託管文件平台，先前名為 LlamaCloud，因此下方的類別與套件名稱沿用舊名稱。

此整合套件適用於較早版本的 Index

`LlamaCloudIndex` 隨 `llama-cloud-services` 套件提供；該套件已棄用且不再更新，並連線至 Index 第一版。安裝此套件會固定使用舊版 `llama-cloud`，因此無法與目前的 `llama-cloud` SDK 共用同一個環境。新專案請透過 [Index v2](https://developers.llamaindex.ai/llamaparse/cloud-index-v2/getting_started/index.md)，並搭配 `llama-cloud` SDK 使用。

Index 提供以下功能：

- 代管式資料匯入：解析、切分、產生嵌入向量及管理文件，並與資料來源保持同步
- 代管式檢索：提供為 RAG 系統調校的檢索端點；此處會將它用作 LlamaIndex 檢索器或查詢引擎

關於服務本身，請參閱該版 Index 的[說明文件](https://developers.llamaindex.ai/llamaparse/deprecated/cloud-index/getting_started/index.md)。

## 取得存取權

請先[註冊 LlamaParse](https://cloud.llamaindex.ai/)以取得 API 金鑰，接著可在控制台建立索引，或執行下方程式碼建立索引。若您需要自行託管或指定專屬區域，請洽詢我們的[企業方案](https://www.llamaindex.ai/contact)。

## 設定

請先確認已安裝最新版 LlamaIndex。

```
pip uninstall llama-index  # run this if upgrading from v0.9.x or older
pip install -U llama-index --upgrade --no-cache-dir --force-reinstall
```

接著安裝整合套件；它不包含在 `llama-index` 中：

```
pip install -U llama-cloud-services
```

## 使用方式

執行以下程式碼，即可在 LlamaCloud 建立索引：

```
import os


os.environ[
    "LLAMA_CLOUD_API_KEY"
] = "llx-..."  # can provide API-key in env or in the constructor later on


from llama_index.core import SimpleDirectoryReader
from llama_cloud_services import LlamaCloudIndex


# create a new index
index = LlamaCloudIndex.from_documents(
    documents,
    "my_first_index",
    project_name="default",
    api_key="llx-...",
    verbose=True,
)


# connect to an existing index
index = LlamaCloudIndex("my_first_index", project_name="default")
```

您也可以設定檢索器，以使用代管式檢索：

```
# from the existing index
index.as_retriever()


# from scratch
from llama_cloud_services import LlamaCloudRetriever


retriever = LlamaCloudRetriever("my_first_index", project_name="default")
```

當然，您也可以使用其他索引捷徑，充分運用新建立的代管索引：

```
query_engine = index.as_query_engine(llm=llm)


chat_engine = index.as_chat_engine(llm=llm)
```

## 檢索器設定

以下列出所有 retriever 設定／kwargs：

- `dense_similarity_top_k`：Optional\[int] — 若大於 0，使用密集檢索擷取 `k` 個節點
- `sparse_similarity_top_k`：Optional\[int] — 若大於 0，使用稀疏檢索擷取 `k` 個節點
- `enable_reranking`：Optional\[bool] — 是否啟用重排；重排會犧牲部分速度以換取準確度
- `rerank_top_n`：Optional\[int] — 初步檢索結果重排後要回傳的節點數量
- `alpha` Optional\[float] — 密集與稀疏檢索的權重。1 表示完全採用密集檢索，0 表示完全採用稀疏檢索。

## 複合檢索的使用方式

設定多個索引以匯入不同類型的資料後，您可能會想建立一個應用程式，跨這些索引查詢資料。

這時可使用 `LlamaCloudCompositeRetriever` 類別。以下程式碼示範如何設定複合檢索器：

```
import os
from llama_cloud import CompositeRetrievalMode, RetrieverPipeline
from llama_cloud_services import (
    LlamaCloudIndex,
    LlamaCloudCompositeRetriever,
)


llama_cloud_api_key = os.environ["LLAMA_CLOUD_API_KEY"]
project_name = "Essays"


# Setup your indices
pg_documents = SimpleDirectoryReader("./examples/data/paul_graham").load_data()
pg_index = LlamaCloudIndex.from_documents(
    documents=pg_documents,
    name="PG Index",
    project_name=project_name,
    api_key=llama_cloud_api_key,
)


sama_documents = SimpleDirectoryReader(
    "./examples/data/sam_altman"
).load_data()
sama_index = LlamaCloudIndex.from_documents(
    documents=sama_documents,
    name="Sam Index",
    project_name=project_name,
    api_key=llama_cloud_api_key,
)


retriever = LlamaCloudCompositeRetriever(
    name="Essays Retriever",
    project_name=project_name,
    api_key=llama_cloud_api_key,
    # If a Retriever named "Essays Retriever" doesn't already exist, one will be created
    create_if_not_exists=True,
    # CompositeRetrievalMode.FULL will query each index individually and globally rerank results at the end
    mode=CompositeRetrievalMode.FULL,
    rerank_top_n=5,
)


# Add the above indices to the composite retriever
# Carefully craft the description as this is used internally to route a query to an attached sub-index when CompositeRetrievalMode.ROUTING is used
retriever.add_index(pg_index, description="A collection of Paul Graham essays")
retriever.add_index(
    sama_index, description="A collection of Sam Altman essays"
)


# Start retrieving context for your queries
# async .aretrieve() is also available
nodes = retriever.retrieve("What does YC do?")
```

### 複合檢索的相關參數

以下幾個參數可用來調整複合檢索的行為：

- `mode`：`Optional[CompositeRetrievalMode]` — 可設為 `CompositeRetrievalMode.FULL` 或 `CompositeRetrievalMode.ROUTING`

  - `full`：此模式會查詢所有已連結的子索引，並對各子索引回傳的所有節點進行重排。
  - `routing`：此模式會由 agent 根據您提供的子索引 `name` 與 `description` 判斷哪些子索引與查詢最相關，並只查詢相關索引。接著，系統會先對所選子索引中的節點進行重排，再將結果放入檢索回應。

- `rerank_top_n`：`Optional[int]` — 決定從所有索引檢索出的節點中，重排後要回傳的節點數量
