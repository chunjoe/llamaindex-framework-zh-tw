---
title: "Azure AI 模型推理"
---

本筆記說明如何使用 `llama-index-llm-azure-inference` package 與部署了 Azure AI model inference API 的模型，在 Azure AI studio 或 Azure Machine Learning 中進行使用。此 package 也支援 GitHub Models (Preview) endpoints。

```
%pip install llama-index-llms-azure-inference
```

如果您在 Google Colab 上開啟本筆記，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index
```

## 先決條件

Azure AI model inference 是一個 API，它允許開發人員使用一致的 schema 存取託管在 Azure AI 上的多種模型。您可以使用 `llama-index-llms-azure-inference` integration package 與支援此 API 的模型進行整合，包括部署在 Azure AI serverless API endpoints 上的模型，以及來自 Managed Inference 的部分模型。如欲閱讀更多關於 API specification 和支援其的模型，請參閱 [Azure AI model inference API](https://aka.ms/azureai/modelinference)。

要執行本教學，您需要：

1. 建立一個 [Azure subscription](https://azure.microsoft.com/)。

2. 建立一個 Azure AI hub resource，詳見 [如何建立與管理 Azure AI Studio hub](https://learn.microsoft.com/en-us/azure/ai-studio/how-to/create-azure-ai-resource)。

3. 部署一個支援 [Azure AI model inference API](https://aka.ms/azureai/modelinference) 的模型。在此範例中，我們使用一個 `Mistral-Large` deployment。

   - 您可以參考 [Deploy models as serverless APIs](https://learn.microsoft.com/en-us/azure/ai-studio/how-to/deploy-models-serverless) 中的說明。

或者，您可以使用此整合與 GitHub Models endpoints，包括免費方案體驗。請閱讀更多關於 [GitHub models](https://github.com/marketplace/models)。

## 環境設定

請遵循以下步驟，從您想要使用的模型中獲取所需資訊：

1. 前往 [Azure AI Foundry (formerly Azure AI Studio)](https://ai.azure.com/) 或 [Azure Machine Learning studio](https://ml.azure.com/)，取決於您使用的產品。
2. 前往 deployments (在 Azure Machine Learning 中) 並選擇您已部署的模型，如先決條件所示。
3. 複製 endpoint URL 和 key。

> 如果您的模型是使用 Microsoft Entra ID 支援部署的，則不需要 key。

在此情況下，我們將 endpoint URL 和 key 都放在以下環境變數中：

```
import os


os.environ["AZURE_INFERENCE_ENDPOINT"] = "<your-endpoint>"
os.environ["AZURE_INFERENCE_CREDENTIAL"] = "<your-credential>"
```

## 連線到您的部署和 endpoint

若要在 Azure AI studio 或 Azure Machine Learning 中使用部署在 LLMs 中的模型，您需要 endpoint 和憑證來連線到它。對於像 Managed Online Endpoints 這樣僅服務單一模型的 endpoint，參數 `model_name` 是不需要的。

```
from llama_index.llms.azure_inference import AzureAICompletionsModel
```

```
llm = AzureAICompletionsModel(
    endpoint=os.environ["AZURE_INFERENCE_ENDPOINT"],
    credential=os.environ["AZURE_INFERENCE_CREDENTIAL"],
)
```

或者，如果您的 endpoint 支援 Microsoft Entra ID，您可以使用以下程式碼來建立 client：

```
from azure.identity import DefaultAzureCredential


llm = AzureAICompletionsModel(
    endpoint=os.environ["AZURE_INFERENCE_ENDPOINT"],
    credential=DefaultAzureCredential(),
)
```

> 注意：在使用 Microsoft Entra ID 時，請確保 endpoint 是使用該驗證方法部署的，並且您擁有呼叫它的所需權限。

如果您計劃使用非同步呼叫，最佳實踐是使用非同步版本來處理憑證：

```
from azure.identity.aio import (
    DefaultAzureCredential as DefaultAzureCredentialAsync,
)


llm = AzureAICompletionsModel(
    endpoint=os.environ["AZURE_INFERENCE_ENDPOINT"],
    credential=DefaultAzureCredentialAsync(),
)
```

如果您的 endpoint 服務多於一個模型，例如 [GitHub Models](https://github.com/marketplace/models) 或 Azure AI Services，則您必須指定參數 `model_name`：

```
llm = AzureAICompletionsModel(
    endpoint=os.environ["AZURE_INFERENCE_ENDPOINT"],
    credential=os.environ["AZURE_INFERENCE_CREDENTIAL"],
    model_name="mistral-large",  # change it to the model you want to use
)
```

## 使用模型

使用 `complete` endpoint 進行文字補全。`complete` method 仍然適用於 `chat-completions` 類型的模型。在這些情況下，您的輸入文字會被轉換為帶有 `role="user"` 的 message。

```
response = llm.complete("The sky is a beautiful blue and")
print(response)
```

```
response = llm.stream_complete("The sky is a beautiful blue and")
for r in response:
    print(r.delta, end="")
```

使用 `chat` endpoint 進行對話

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
response = llm.stream_chat(messages)
for r in response:
    print(r.delta, end="")
```

與在每次聊天或 completion 呼叫中添加相同的參數不同，您可以將它們設定在 client instance 上。

```
llm = AzureAICompletionsModel(
    endpoint=os.environ["AZURE_INFERENCE_ENDPOINT"],
    credential=os.environ["AZURE_INFERENCE_CREDENTIAL"],
    temperature=0.0,
    model_kwargs={"top_p": 1.0},
)
```

```
response = llm.complete("The sky is a beautiful blue and")
print(response)
```
對於 Azure AI model inference API 不支援但底層模型可用的額外參數，您可以使用 `model_extras` 參數。在以下範例中，傳入了僅適用於 Mistral model 的參數 `safe_prompt`。

```
llm = AzureAICompletionsModel(
    endpoint=os.environ["AZURE_INFERENCE_ENDPOINT"],
    credential=os.environ["AZURE_INFERENCE_CREDENTIAL"],
    temperature=0.0,
    model_kwargs={"model_extras": {"safe_prompt": True}},
)
```

```
response = llm.complete("The sky is a beautiful blue and")
print(response)
```

## 額外資源

如欲了解更多關於此整合的資訊，請造訪 [開始使用 LlamaIndex 與 Azure AI](https://aka.ms/azureai/llamaindex)。