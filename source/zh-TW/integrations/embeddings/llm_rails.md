---
title: "LLMRails Embeddings"
---

如果您在 colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-embeddings-llm-rails
```

```
!pip install llama-index
```

```
# imports


from llama_index.embeddings.llm_rails import LLMRailsEmbedding
```

```
# get credentials and create embeddings


import os


api_key = os.environ.get("API_KEY", "your-api-key")
model_id = os.environ.get("MODEL_ID", "your-model-id")




embed_model = LLMRailsEmbedding(model_id=model_id, api_key=api_key)


embeddings = embed_model.get_text_embedding(
    "It is raining cats and dogs here!"
)
```
