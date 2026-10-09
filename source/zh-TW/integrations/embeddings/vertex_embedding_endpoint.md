---
title: "與部署在 Vertex AI Endpoint 中的 Embeddings 互動 LlamaIndex"
---

Vertex AI endpoint 是一個受管理的資源，可用於部署機器學習模型，例如 embeddings，以對新資料進行預測。

本筆 Notebook 示範如何使用 `VertexEndpointEmbedding` class 與 embedding endpoint 互動，並利用 LlamaIndex。

## 設定

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-embeddings-vertex-endpoint
```

```
! pip install llama-index
```

您需要指定 endpoint 資訊（endpoint ID、project ID 和 region）以與部署在 Vertex AI 中的模型互動。

```
ENDPOINT_ID = "<-YOUR-ENDPOINT-ID->"
PROJECT_ID = "<-YOUR-PROJECT-ID->"
LOCATION = "<-YOUR-GCP-REGION->"
```

需要提供憑證以連接到 endpoint。您可以選擇：

- 使用服務帳號 JSON 檔案，並指定 `service_account_file` 參數。
- 透過 `service_account_info` 參數直接提供服務帳號資訊。

**使用服務帳號檔案的範例：**

```
from llama_index.embeddings.vertex_endpoint import VertexEndpointEmbedding


SERVICE_ACCOUNT_FILE = "<-YOUR-SERVICE-ACCOUNT-FILE-PATH->.json"


embed_model = VertexEndpointEmbedding(
    endpoint_id=ENDPOINT_ID,
    project_id=PROJECT_ID,
    location=LOCATION,
    service_account_file=SERVICE_ACCOUNT_FILE,
)
```

**使用直接服務帳號資訊的範例：**：

```
from llama_index.embeddings.vertex_endpoint import VertexEndpointEmbedding


SERVICE_ACCOUNT_INFO = {
    "private_key": "<-PRIVATE-KEY->",
    "client_email": "<-SERVICE-ACCOUNT-EMAIL->",
    "token_uri": "https://oauth2.googleapis.com/token",
}


embed_model = VertexEndpointEmbedding(
    endpoint_id=ENDPOINT_ID,
    project_id=PROJECT_ID,
    location=LOCATION,
    service_account_info=SERVICE_ACCOUNT_INFO,
)
```

## 基本用法

### 呼叫 `get_text_embedding`

```
embeddings = embed_model.get_text_embedding(
    "Vertex AI is a managed machine learning (ML) platform provided by Google Cloud. It allows data scientists and developers to build, deploy, and scale machine learning models efficiently, leveraging Google's ML infrastructure."
)
```

```
embeddings[:10]
```

```
[0.011612358,
 0.01030837,
 -0.04710829,
 -0.030719217,
 0.027658276,
 -0.031597693,
 0.012065322,
 -0.037609763,
 0.02321099,
 0.012868305]
```

### 呼叫 `get_text_embedding_batch`

```
embeddings = embed_model.get_text_embedding_batch(
    [
        "Vertex AI is a managed machine learning (ML) platform provided by Google Cloud. It allows data scientists and developers to build, deploy, and scale machine learning models efficiently, leveraging Google's ML infrastructure.",
        "Vertex is integrated with llamaIndex",
    ]
)
```

```
len(embeddings)
```

```
2
```
