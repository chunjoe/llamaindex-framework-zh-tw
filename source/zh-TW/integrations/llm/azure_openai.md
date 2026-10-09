---
title: "Azure OpenAI"
---

如果您在 colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-llms-azure-openai
```

```
!pip install llama-index
```

## 先決條件

1. 設定 Azure 訂閱 - 您可以免費建立一個 [此處](https://azure.microsoft.com/en-us/free/cognitive-services/)
2. 申請存取 Azure OpenAI Service [此處](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUOFA5Qk1UWDRBMjg0WFhPMkIzTzhKQ1dWNyQlQCN0PWcu)
3. 在 Azure portal 中建立一個 resource [此處](https://portal.azure.com/?microsoft_azure_marketplace_ItemHideKey=microsoft_openai_tip#create/Microsoft.CognitiveServicesOpenAI)
4. 在 Azure OpenAI Studio 中部署一個 model [此處](https://oai.azure.com/)

您可以在 [本指南。](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/how-to/create-resource?pivots=web-portal) 中找到更多詳細資訊。

請記下 **“model name”** 和 **“deployment name”**，當您連接到您的 LLM 時將需要這些資訊。

## 環境設定

### 找到您的設定資訊 - API base, API key, deployment name (即 engine) 等

要找到必要的設定資訊，請執行以下設定：

1. 前往 Azure OpenAI Studio [此處](https://oai.azure.com/)
2. 前往聊天或 completions playground (取決於您設定的是哪個 LLM)
3. 點擊 “view code” (如下方圖片所示)

```
from IPython.display import Image


Image(filename="./azure_playground.png")
```

![png](/assets/18df4871ef45.png)

4. 記下 `api_type`, `api_base`, `api_version`, `engine` (這應該與先前的 “deployment name” 相同)，以及 `key`

```
from IPython.display import Image


Image(filename="./azure_env.png")
```

![png](/assets/0a374b496db9.png)

### 設定環境變數

使用 Azure 部署 OpenAI 模型與一般 OpenAI 非常相似。您只需要設定幾個額外的環境變數。

- `OPENAI_API_VERSION`: 設定為 `2023-07-01-preview` 這可能會在未來改變。
- `AZURE_OPENAI_ENDPOINT`: 您的 endpoint 應如下所示 <https://YOUR_RESOURCE_NAME.openai.azure.com/>
- `AZURE_OPENAI_API_KEY`: 您的 API key

```
import os


os.environ["AZURE_OPENAI_API_KEY"] = "<your-api-key>"
os.environ[
    "AZURE_OPENAI_ENDPOINT"
] = "https://<your-resource-name>.openai.azure.com/"
os.environ["OPENAI_API_VERSION"] = "2023-07-01-preview"
```

## 使用您的 LLM

```
from llama_index.llms.azure_openai import AzureOpenAI
```

與一般 `OpenAI` 不同，您需要在 `model` 之外傳遞一個 `engine` 參數。`engine` 是您在 Azure OpenAI Studio 中選擇的模型部署名稱。請參閱“find your setup information”的先前部分以獲取更多詳細資訊。

```
llm = AzureOpenAI(
    engine="simon-llm", model="gpt-35-turbo-16k", temperature=0.0
)
```

或者，您也可以省略設定環境變數，直接透過 constructor 傳遞參數。

```
llm = AzureOpenAI(
    engine="my-custom-llm",
    model="gpt-35-turbo-16k",
    temperature=0.0,
    azure_endpoint="https://<your-resource-name>.openai.azure.com/",
    api_key="<your-api-key>",
    api_version="2023-07-01-preview",
)
```

使用 `complete` endpoint 進行 text completion

```
response = llm.complete("The sky is a beautiful blue and")
print(response)
```

```
the sun is shining brightly. Fluffy white clouds float lazily across the sky, creating a picturesque scene. The vibrant blue color of the sky brings a sense of calm and tranquility. It is a perfect day to be outside, enjoying the warmth of the sun and the gentle breeze. The sky seems to stretch endlessly, reminding us of the vastness and beauty of the world around us. It is a reminder to appreciate the simple pleasures in life and to take a moment to admire the natural wonders that surround us.
```

```
response = llm.stream_complete("The sky is a beautiful blue and")
for r in response:
    print(r.delta, end="")
```

```
the sun is shining brightly. Fluffy white clouds float lazily across the sky, creating a picturesque scene. The vibrant blue color of the sky brings a sense of calm and tranquility. It is a perfect day to be outside, enjoying the warmth of the sun and the gentle breeze. The sky seems to stretch endlessly, reminding us of the vastness and beauty of the world around us. It is a reminder to appreciate the simple pleasures in life and to take a moment to pause and admire the natural wonders that surround us.
```

使用 `chat` endpoint 進行 conversation

```
from llama_index.core.llms import ChatMessage


messages = [
    ChatMessage(
        role="system", content="You are a pirate with colorful personality."
    ),
    ChatMessage(role="user", content="Hello"),
]


response = llm.chat(messages)
print(response)
```

```
assistant: Ahoy there, matey! How be ye on this fine day? I be Captain Jolly Roger, the most colorful pirate ye ever did lay eyes on! What brings ye to me ship?
```

```
response = llm.stream_chat(messages)
for r in response:
    print(r.delta, end="")
```

```
Ahoy there, matey! How be ye on this fine day? I be Captain Jolly Roger, the most colorful pirate ye ever did lay eyes on! What brings ye to me ship?
```

與在每次聊天或 completion 呼叫中添加相同參數不同，您可以使用 `additional_kwargs` 在每個實例層級設定它們。

```
llm = AzureOpenAI(
    engine="simon-llm",
    model="gpt-35-turbo-16k",
    temperature=0.0,
    additional_kwargs={"user": "your_user_id"},
)
```
