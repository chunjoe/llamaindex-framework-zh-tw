---
title: "Heroku LLM 管理式推理"
---

`llama-index-llms-heroku` 套件包含 LlamaIndex，用於在 Heroku 的 Managed Inference 平台上建置應用程式。此整合讓您可以輕鬆連接並使用部署在 Heroku 基礎架構上的 AI 模型。

## 安裝

```
%pip install llama-index-llms-heroku
```

## 設定

### 1. 建立 Heroku App

首先，在 Heroku 中建立一個應用程式：

終端機視窗

```
heroku create $APP_NAME
```

### 2. 建立並附加 AI 模型

在您的應用程式中建立並附加一個聊天模型：

終端機視窗

```
heroku ai:models:create -a $APP_NAME claude-3-5-haiku
```

### 3. 匯出設定變數

匯出所需的設定變數：

終端機視窗

```
export INFERENCE_KEY=$(heroku config:get INFERENCE_KEY -a $APP_NAME)
export INFERENCE_MODEL_ID=$(heroku config:get INFERENCE_MODEL_ID -a $APP_NAME)
export INFERENCE_URL=$(heroku config:get INFERENCE_URL -a $APP_NAME)
```

## 使用方法

### 基本使用

```
from llama_index.llms.heroku import Heroku
from llama_index.core.llms import ChatMessage, MessageRole


# Initialize the Heroku LLM
llm = Heroku()


# Create chat messages
messages = [
    ChatMessage(
        role=MessageRole.SYSTEM, content="You are a helpful assistant."
    ),
    ChatMessage(
        role=MessageRole.USER,
        content="What are the most popular house pets in North America?",
    ),
]


# Get response
response = llm.chat(messages)
print(response)
```

### 使用環境變數

此整合會自動從環境變數中讀取資料：

```
import os


# Set environment variables
os.environ["INFERENCE_KEY"] = "your-inference-key"
os.environ["INFERENCE_URL"] = "https://us.inference.heroku.com"
os.environ["INFERENCE_MODEL_ID"] = "claude-3-5-haiku"


# Initialize without parameters
llm = Heroku()
```

### 使用參數

您也可以直接傳遞參數：

```
import os


llm = Heroku(
    model=os.getenv("INFERENCE_MODEL_ID", "claude-3-5-haiku"),
    api_key=os.getenv("INFERENCE_KEY", "your-inference-key"),
    inference_url=os.getenv(
        "INFERENCE_URL", "https://us.inference.heroku.com"
    ),
    max_tokens=1024,
)
```

## 可用模型

如需完整的可用模型清單，請參閱 [Heroku Managed Inference documentation](https://devcenter.heroku.com/articles/heroku-inference#available-models)。

## 錯誤處理

此整合包含針對常見問題的適當錯誤處理：

- 缺少 API key
- 無效的 inference URL
- 缺少模型設定

## 額外資訊

如需有關 Heroku Managed Inference 的更多資訊，請造訪 [official documentation](https://devcenter.heroku.com/articles/heroku-inference)。