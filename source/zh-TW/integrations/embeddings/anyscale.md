---
title: "Anyscale Embeddings"
---

本指南將向您展示如何使用 Anyscale Embeddings，透過 [Anyscale Endpoints](https://docs.endpoints.anyscale.com/)。

如果您在 Colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-embeddings-anyscale
```

```
!pip install llama-index
```

```
from llama_index.embeddings.anyscale import AnyscaleEmbedding


embed_model = AnyscaleEmbedding(
    api_key=ANYSCALE_ENDPOINT_TOKEN, embed_batch_size=10
)
```

```
# Basic embedding example
embeddings = embed_model.get_text_embedding(
    "It is raining cats and dogs here!"
)
print(len(embeddings), embeddings[:10])
```
