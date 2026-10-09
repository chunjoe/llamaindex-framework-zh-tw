---
title: "DeepInfra"
---

透過此整合，您可以利用 DeepInfra embeddings model 來為您的文字資料取得 embeddings。以下是 [embeddings 模型](https://deepinfra.com/models/embeddings) 的連結。

首先，您需要在 [DeepInfra website](https://deepinfra.com/) 註冊並取得 API token。您可以從 model cards 複製 `model_ids` 並開始在您的程式碼中使用它們。

### 安裝

```
!pip install llama-index llama-index-embeddings-deepinfra
```

### 初始化

```
from dotenv import load_dotenv, find_dotenv
from llama_index.embeddings.deepinfra import DeepInfraEmbeddingModel


_ = load_dotenv(find_dotenv())


model = DeepInfraEmbeddingModel(
    model_id="BAAI/bge-large-en-v1.5",  # Use custom model ID
    api_token="YOUR_API_TOKEN",  # Optionally provide token here
    normalize=True,  # Optional normalization
    text_prefix="text: ",  # Optional text prefix
    query_prefix="query: ",  # Optional query prefix
)
```

### 同步請求

#### 取得文字 Embedding

```
response = model.get_text_embedding("hello world")
print(response)
```

#### Batch Requests

```
texts = ["hello world", "goodbye world"]
response_batch = model.get_text_embedding_batch(texts)
print(response_batch)
```

#### 查詢請求

```
query_response = model.get_query_embedding("hello world")
print(query_response)
```

### 非同步請求

#### 取得文字 Embedding

```
async def main():
    text = "hello world"
    async_response = await model.aget_text_embedding(text)
    print(async_response)




if __name__ == "__main__":
    import asyncio


    asyncio.run(main())
```

---

如有任何問題或建議，請透過 <feedback@deepinfra.com> 與我們聯繫。