---
title: "IBM watsonx.ai"
---

WatsonxLLM 是 IBM [watsonx.ai](https://www.ibm.com/products/watsonx-ai) 基礎模型的封裝器。

這些範例的目的是展示如何使用 `watsonx.ai` 模型，透過 `LlamaIndex` LLMs API 與其進行通訊。

## 設定

安裝 `llama-index-llms-ibm` 套件：

```
!pip install -qU llama-index-llms-ibm
```

以下程式碼定義了與 watsonx Foundation Model 推理所需的憑證。

**動作：** 提供 IBM Cloud 使用者 API key。詳情請參閱 [Managing user API keys](https://cloud.ibm.com/docs/account?topic=account-userapikey\&interface=ui)。

```
import os
from getpass import getpass


watsonx_api_key = getpass()
os.environ["WATSONX_APIKEY"] = watsonx_api_key
```

此外，您也可以將額外的密鑰作為環境變數傳遞：

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

您可能需要調整模型 `parameters` 以適應不同的模型或任務。詳情請參閱 [Available MetaNames](https://ibm.github.io/watsonx-ai-python-sdk/fm_model.html#metanames.GenTextParamsMetaNames)。

```
temperature = 0.5
max_new_tokens = 50
additional_params = {
    "decoding_method": "sample",
    "min_new_tokens": 1,
    "top_k": 50,
    "top_p": 1,
}
```

使用先前設定的參數初始化 `WatsonxLLM` 類別。

**注意：**

- 為 API 呼叫提供上下文，您必須傳遞 `project_id` 或 `space_id`。要取得您的專案或空間 ID，請開啟您的專案或空間，前往 **Manage** 標籤，然後點擊 **General**。更多資訊請參閱：[Project documentation](https://www.ibm.com/docs/en/watsonx-as-a-service?topic=projects) 或 [Deployment space documentation](https://www.ibm.com/docs/en/watsonx/saas?topic=spaces-creating-deployment)。
- 根據您所提供的服務實例的區域，請使用 [watsonx.ai API Authentication](https://ibm.github.io/watsonx-ai-python-sdk/setup_cloud.html#authentication) 中列出的其中一個 URL。

在此範例中，我們將使用 `project_id` 和 Dallas URL。

您需要指定用於推理的 `model_id`。您可以在 [Supported foundation models](https://ibm.github.io/watsonx-ai-python-sdk/fm_model.html#ibm_watsonx_ai.foundation_models.utils.enums.ModelTypes) 中找到所有可用模型的列表。

```
from llama_index.llms.ibm import WatsonxLLM


watsonx_llm = WatsonxLLM(
    model_id="ibm/granite-13b-instruct-v2",
    url="https://us-south.ml.cloud.ibm.com",
    project_id="PASTE YOUR PROJECT_ID HERE",
    temperature=temperature,
    max_new_tokens=max_new_tokens,
    additional_params=additional_params,
)
```

或者，您可以使用 Cloud Pak for Data 憑證。詳情請參閱 [watsonx.ai software setup](https://ibm.github.io/watsonx-ai-python-sdk/setup_cpd.html)。

```
watsonx_llm = WatsonxLLM(
    model_id="ibm/granite-13b-instruct-v2",
    url="PASTE YOUR URL HERE",
    username="PASTE YOUR USERNAME HERE",
    password="PASTE YOUR PASSWORD HERE",
    instance_id="openshift",
    version="4.8",
    project_id="PASTE YOUR PROJECT_ID HERE",
    temperature=temperature,
    max_new_tokens=max_new_tokens,
    additional_params=additional_params,
)
```

您也可以傳遞先前調整的模型 `deployment_id` 而非 `model_id`。整個模型調整 workflow 詳述於 [Working with TuneExperiment and PromptTuner](https://ibm.github.io/watsonx-ai-python-sdk/pt_working_with_class_and_prompt_tuner.html)。

```
watsonx_llm = WatsonxLLM(
    deployment_id="PASTE YOUR DEPLOYMENT_ID HERE",
    url="https://us-south.ml.cloud.ibm.com",
    project_id="PASTE YOUR PROJECT_ID HERE",
    temperature=temperature,
    max_new_tokens=max_new_tokens,
    additional_params=additional_params,
)
```


## 建立完成結果

使用字串型提示直接呼叫模型：

```
response = watsonx_llm.complete("What is a Generative AI?")
print(response)
```

```
A generative AI is a computer program that can create new text, images, or other types of content. These programs are trained on large datasets of existing content, and they use that data to generate new content that is similar to the training data.
```

您也可以從 `CompletionResponse` 檢索服務回傳的原始回應：

```
print(response.raw)
```

```
{'model_id': 'ibm/granite-13b-instruct-v2', 'created_at': '2024-05-20T07:11:57.984Z', 'results': [{'generated_text': 'A generative AI is a computer program that can create new text, images, or other types of content. These programs are trained on large datasets of existing content, and they use that data to generate new content that is similar to the training data.', 'generated_token_count': 50, 'input_token_count': 7, 'stop_reason': 'max_tokens', 'seed': 494448017}]}
```

您也可以呼叫提供提示模板的模型：

```
from llama_index.core import PromptTemplate


template = "What is {object} and how does it work?"
prompt_template = PromptTemplate(template=template)


prompt = prompt_template.format(object="a loan")


response = watsonx_llm.complete(prompt)
print(response)
```

```
A loan is a sum of money that is borrowed to buy something, such as a house or a car. The borrower must repay the loan plus interest. The interest is a fee charged for using the money. The interest rate is the amount of
```


## 使用訊息列表呼叫 `chat`

透過提供一個訊息列表來建立 `chat` 完成結果：

```
from llama_index.core.llms import ChatMessage


messages = [
    ChatMessage(role="system", content="You are an AI assistant"),
    ChatMessage(role="user", content="Who are you?"),
]
response = watsonx_llm.chat(
    messages, max_new_tokens=20, decoding_method="greedy"
)
print(response)
```

```
assistant: I am an AI assistant.
```

請注意，我們將 `max_new_tokens` 參數更改為 `20`，並將 `decoding_method` 參數更改為 `greedy`。

## 串流模型輸出

串流模型的回應：

```
for chunk in watsonx_llm.stream_complete(
    "Describe your favorite city and why it is your favorite."
):
    print(chunk.delta, end="")
```

```
I like New York because it is the city of dreams. You can achieve anything you want here.
```

同樣地，要串流 `chat` 完成結果，請使用以下程式碼：

```
messages = [
    ChatMessage(role="system", content="You are an AI assistant"),
    ChatMessage(role="user", content="Who are you?"),
]


for chunk in watsonx_llm.stream_chat(messages):
    print(chunk.delta, end="")
```

```
I am an AI assistant.
```
