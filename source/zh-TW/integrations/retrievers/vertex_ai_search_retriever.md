---
title: "Vertex AI Search Retriever"
---

本筆記將引導您如何設定一個可以從 Vertex AI search datastore 擷取的 Retriever。

### 先決條件

- 設定一個 Google Cloud project
- 設定一個 Vertex AI Search datastore
- 啟用 Vertex AI API

### 安裝函式庫

```
%pip install llama-index-retrievers-vertexai-search
```


### 重啟目前的 runtime

若要使用此 Jupyter runtime 中新安裝的套件，您必須重新啟動 runtime。您可以透過執行下方的儲存格來完成此操作，這將重新啟動目前的 kernel。

```
# Colab only
# Automatically restart kernel after installs so that your environment can access the new packages
import IPython


app = IPython.Application.instance()
app.kernel.do_shutdown(True)
```


### 驗證您的 notebook 環境（僅限 Colab）

如果您在 Google Colab 上執行此 notebook，則需要驗證您的環境。要完成此操作，請執行下方的新儲存格。如果您使用 [Vertex AI Workbench](https://cloud.google.com/vertex-ai-workbench)，則不需要此步驟。

```
# Colab only
import sys


if "google.colab" in sys.modules:
    from google.colab import auth


    auth.authenticate_user()
```

```
# If you're using JupyterLab instance, uncomment and run the below code.
#!gcloud auth login
```

```
from llama_index.retrievers.vertexai_search import VertexAISearchRetriever


# Please note it's underscore '_' in vertexai_search
```


### 設定 Google Cloud project 資訊並初始化 Vertex AI SDK

要開始使用 Vertex AI，您必須擁有一個現有的 Google Cloud project 並 [啟用 Vertex AI API](https://console.cloud.google.com/flows/enableapi?apiid=aiplatform.googleapis.com)。

瞭解更多關於 [設定專案和開發環境](https://cloud.google.com/vertex-ai/docs/start/cloud-environment)。

```
PROJECT_ID = "{your project id}"  # @param {type:"string"}
LOCATION = "us-central1"  # @param {type:"string"}
import vertexai


vertexai.init(project=PROJECT_ID, location=LOCATION)
```


### 測試 Structured datastore

```
DATA_STORE_ID = "{your id}"  # @param {type:"string"}
LOCATION_ID = "global"
```

```
struct_retriever = VertexAISearchRetriever(
    project_id=PROJECT_ID,
    data_store_id=DATA_STORE_ID,
    location_id=LOCATION_ID,
    engine_data_type=1,
)
```

```
query = "harry potter"
retrieved_results = struct_retriever.retrieve(query)
```

```
print(retrieved_results[0])
```


### 測試 Unstructured datastore

```
DATA_STORE_ID = "{your id}"
LOCATION_ID = "global"
```

```
unstruct_retriever = VertexAISearchRetriever(
    project_id=PROJECT_ID,
    data_store_id=DATA_STORE_ID,
    location_id=LOCATION_ID,
    engine_data_type=0,
)
```

```
query = "alphabet 2018 earning"
retrieved_results2 = unstruct_retriever.retrieve(query)
```

```
print(retrieved_results2[0])
```


### 測試 Website datastore

```
DATA_STORE_ID = "{your id}"
LOCATION_ID = "global"
website_retriever = VertexAISearchRetriever(
    project_id=PROJECT_ID,
    data_store_id=DATA_STORE_ID,
    location_id=LOCATION_ID,
    engine_data_type=2,
)
```

```
query = "what's diamaxol"
retrieved_results3 = website_retriever.retrieve(query)
```

```
print(retrieved_results3[0])
```


## 在 Query Engine 中使用

```
# import modules needed
from llama_index.core import Settings
from llama_index.llms.vertex import Vertex
from llama_index.embeddings.vertex import VertexTextEmbedding
```

```
vertex_gemini = Vertex(
    model="gemini-1.5-pro",
    temperature=0,
    context_window=100000,
    additional_kwargs={},
)
# setup the index/query llm
Settings.llm = vertex_gemini
```

```
from llama_index.core.query_engine import RetrieverQueryEngine


query_engine = RetrieverQueryEngine.from_args(struct_retriever)
```

```
response = query_engine.query("Tell me about harry potter")
print(str(response))
```
