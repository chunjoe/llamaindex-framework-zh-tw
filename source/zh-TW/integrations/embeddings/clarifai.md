---
title: "使用 Clarifai 的 Embeddings"
---

LlamaIndex 支援 Clarifai embeddings models。

您需要一個 Clarifai 帳號和一個 Personal Access Token (PAT) 金鑰。請[點此](https://clarifai.com/settings/security)獲取或建立 PAT。

將 CLARIFAI\_PAT 設定為環境變數，或者您可以將 PAT 作為參數傳遞給 ClarifaiEmbedding class。

```
%pip install llama-index-embeddings-clarifai
```

```
!export CLARIFAI_PAT=YOUR_KEY
```

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
!pip install llama-index
```

模型可以透過完整 URL 或 model\_name、user ID 和 app ID 的組合來引用。

```
from llama_index.embeddings.clarifai import ClarifaiEmbedding


# Create a clarifai embedding class just with model_url, assuming that CLARIFAI_PAT is set as an environment variable
embed_model = ClarifaiEmbedding(
    model_url="https://clarifai.com/clarifai/main/models/BAAI-bge-base-en"
)


# Alternatively you can initialize the class with model_name, user_id, app_id and pat as well.
embed_model = ClarifaiEmbedding(
    model_name="BAAI-bge-base-en",
    user_id="clarifai",
    app_id="main",
    pat=CLARIFAI_PAT,
)
```

```
embeddings = embed_model.get_text_embedding("Hello World!")
print(len(embeddings))
print(embeddings[:5])
```

文本的 embedding 列表

```
text = "roses are red violets are blue."
text2 = "Make hay while the sun shines."
```

```
embeddings = embed_model._get_text_embeddings([text2, text])
print(len(embeddings))
print(embeddings[0][:5])
print(embeddings[1][:5])
```
