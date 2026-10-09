---
title: "Bedrock 嵌入"
---

如果您在 colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-embeddings-bedrock
```

```
import os


from llama_index.embeddings.bedrock import BedrockEmbedding
```

```
embed_model = BedrockEmbedding(
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    aws_session_token=os.getenv("AWS_SESSION_TOKEN"),
    region_name="<aws-region>",
    profile_name="<aws-profile>",
)
```

```
embedding = embed_model.get_text_embedding("hello world")
```


## 支援的模型列表

若要查看 Amazon Bedrock 在 LlamaIndex 上的支援模型列表，請依照以下方式呼叫 `BedrockEmbedding.list_supported_models()`。

```
from llama_index.embeddings.bedrock import BedrockEmbedding
import json


supported_models = BedrockEmbedding.list_supported_models()
print(json.dumps(supported_models, indent=2))
```


## 提供者：Amazon

Amazon Bedrock Titan embeddings。

```
from llama_index.embeddings.bedrock import BedrockEmbedding


model = BedrockEmbedding(model_name="amazon.titan-embed-g1-text-02")
embeddings = model.get_text_embedding("hello world")
print(embeddings)
```


## 提供者：Cohere

### cohere.embed-english-v3

```
model = BedrockEmbedding(model_name="cohere.embed-english-v3")
coherePayload = ["This is a test document", "This is another test document"]


embed1 = model.get_text_embedding("This is a test document")
print(embed1)


embeddings = model.get_text_embedding_batch(coherePayload)
print(embeddings)
```


### Cohere 的多語言 Embeddings

```
model = BedrockEmbedding(model_name="cohere.embed-multilingual-v3")
coherePayload = [
    "This is a test document",
    "తెలుగు అనేది ద్రావిడ భాషల కుటుంబానికి చెందిన భాష.",
    "Esto es una prueba de documento multilingüe.",
    "攻殻機動隊",
    "Combien de temps ça va prendre ?",
    "Документ проверен",
]
embeddings = model.get_text_embedding_batch(coherePayload)
print(embeddings)
```
