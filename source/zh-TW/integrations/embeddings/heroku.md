---
title: "Heroku LLM 管理式推理 嵌入"
---

`llama-index-embeddings-heroku` 套件包含 LlamaIndex，用於在 Heroku 的 Managed Inference 平台上建置使用 embeddings models 的應用程式。此整合讓您可以輕鬆連接並使用部署在 Heroku 基礎設施上的 AI 模型。

## 安裝

```
%pip install llama-index-embeddings-heroku
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
heroku ai:models:create -a $APP_NAME cohere-embed-multilingual --as EMBEDDING
```

### 3. 匯出設定變數

匯出所需的設定變數：

終端機視窗

```
export EMBEDDING_KEY=$(heroku config:get EMBEDDING_KEY -a $APP_NAME)
export EMBEDDING_MODEL_ID=$(heroku config:get EMBEDDING_MODEL_ID -a $APP_NAME)
export EMBEDDING_URL=$(heroku config:get EMBEDDING_URL -a $APP_NAME)
```

## 使用方法

### 基本使用

```
# Initialize the Heroku LLM
from llama_index.embeddings.heroku import HerokuEmbedding


# Initialize the Heroku Embedding
embedding_model = HerokuEmbedding()


# Get a single embedding
embedding = embedding_model.get_text_embedding("Hello, world!")
print(f"Embedding dimension: {len(embedding)}")


# Get embeddings for multiple texts
texts = ["Hello", "world", "from", "Heroku"]
embeddings = embedding_model.get_text_embedding_batch(texts)
print(f"Number of embeddings: {len(embeddings)}")
```

### 使用環境變數

此整合會自動從環境變數中讀取資料：

```
import os


# Set environment variables
os.environ["EMBEDDING_KEY"] = "your-embedding-key"
os.environ["EMBEDDING_URL"] = "https://us.inference.heroku.com"
os.environ["EMBEDDING_MODEL_ID"] = "claude-3-5-haiku"


# Initialize without parameters
llm = HerokuEmbedding()
```

### 使用參數

您也可以直接傳遞參數：

```
import os
from llama_index.embeddings.heroku import HerokuEmbedding


embedding_model = HerokuEmbedding(
    model=os.getenv("EMBEDDING_MODEL_ID", "cohere-embed-multilingual"),
    api_key=os.getenv("EMBEDDING_KEY", "your-embedding-key"),
    base_url=os.getenv("EMBEDDING_URL", "https://us.inference.heroku.com"),
    timeout=60.0,
)


print(embedding_model.get_text_embedding("Hello Heroku!"))
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