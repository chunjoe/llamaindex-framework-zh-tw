---
title: "IBM watsonx.ai"
---

WatsonxEmbeddings 是 IBM [watsonx.ai](https://www.ibm.com/products/watsonx-ai) embedding model 的封裝器。

此範例展示如何使用 `LlamaIndex` Embeddings API 來與 `watsonx.ai` embedding model 進行通訊。

## 設定

安裝 `llama-index-embeddings-ibm` 套件：

```
!pip install -qU llama-index-embeddings-ibm
```

以下程式碼定義了與 watsonx Embeddings 協作所需的憑證。

**操作：** 提供 IBM Cloud user API key。詳情請參閱 [Managing user API keys](https://cloud.ibm.com/docs/account?topic=account-userapikey\&interface=ui)。

```
import os
from getpass import getpass


watsonx_api_key = getpass()
os.environ["WATSONX_APIKEY"] = watsonx_api_key
```

此外，您也可以將額外的 secrets 作為 environment variable 傳遞：

```
import os


os.environ["WATSONX_URL"] = "your service instance url"
os.environ["WATSONX_TOKEN"] = "your token for accessing the CPD cluster"
os.environ["WATSONX_PASSWORD"] = "your password for accessing the CPD cluster"
os.environ["WATSONX_USERNAME"] = "your username for accessing the CPD cluster"
os.environ[
    "WATSONX_INSTANCE_ID"
] = "your instance_id for accessing the CPD cluster"
```


## 載入模型

您可能需要調整 embedding parameters 以適應不同的任務：

```
truncate_input_tokens = 3
```

使用先前設定的參數初始化 `WatsonxEmbeddings` class。

**注意：**

- 為 API 呼叫提供上下文，您必須傳遞 `project_id` 或 `space_id`。若要取得您的 project 或 space ID，請開啟您的 project 或 space，前往 **Manage** 標籤，然後點擊 **General**。更多資訊請參閱：[Project documentation](https://www.ibm.com/docs/en/watsonx-as-a-service?topic=projects) 或 [Deployment space documentation](https://www.ibm.com/docs/en/watsonx/saas?topic=spaces-creating-deployment)。
- 根據您所使用的服務實例的區域，請使用 [watsonx.ai API Authentication](https://ibm.github.io/watsonx-ai-python-sdk/setup_cloud.html#authentication) 中列出的其中一個 URL。

在此範例中，我們將使用 `project_id` 和 Dallas URL。

您需要指定用於 inferencing 的 `model_id`。您可以在 [Supported foundation models](https://ibm.github.io/watsonx-ai-python-sdk/fm_model.html#ibm_watsonx_ai.foundation_models.utils.enums.ModelTypes) 中找到所有可用模型的列表。

```
from llama_index.embeddings.ibm import WatsonxEmbeddings


watsonx_embedding = WatsonxEmbeddings(
    model_id="ibm/slate-125m-english-rtrvr",
    url="https://us-south.ml.cloud.ibm.com",
    project_id="PASTE YOUR PROJECT_ID HERE",
    truncate_input_tokens=truncate_input_tokens,
)
```

或者，您可以使用 Cloud Pak for Data 憑證。詳情請參閱 [watsonx.ai software setup](https://ibm.github.io/watsonx-ai-python-sdk/setup_cpd.html)。

```
watsonx_embedding = WatsonxEmbeddings(
    model_id="ibm/slate-125m-english-rtrvr",
    url="PASTE YOUR URL HERE",
    username="PASTE YOUR USERNAME HERE",
    password="PASTE YOUR PASSWORD HERE",
    instance_id="openshift",
    version="4.8",
    project_id="PASTE YOUR PROJECT_ID HERE",
    truncate_input_tokens=truncate_input_tokens,
)
```


## 使用方法

### Embed query

```
query = "Example query."


query_result = watsonx_embedding.get_query_embedding(query)
print(query_result[:5])
```

```
[-0.05538924, 0.05161056, 0.01207759, 0.0017501727, -0.017691258]
```

### Embed 文本列表

```
texts = ["This is a content of one document", "This is another document"]


doc_result = watsonx_embedding.get_text_embedding_batch(texts)
print(doc_result[0][:5])
```

```
[0.009447167, -0.024981938, -0.02601326, -0.04048393, -0.05780444]
```
