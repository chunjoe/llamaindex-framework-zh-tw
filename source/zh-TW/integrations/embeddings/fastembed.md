---
title: "Qdrant FastEmbed Embeddings"
---

LlamaIndex 支援 [FastEmbed](https://qdrant.github.io/fastembed/) 進行 embedding 生成。

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-embeddings-fastembed
```

```
%pip install llama-index
```

要使用此 provider，需要安裝 `fastembed` package。

```
%pip install fastembed
```

支援的模型列表請參閱 [這裡](https://qdrant.github.io/fastembed/examples/Supported_Models/)。

```
from llama_index.embeddings.fastembed import FastEmbedEmbedding


embed_model = FastEmbedEmbedding(model_name="BAAI/bge-small-en-v1.5")
```

```
100%|██████████| 76.7M/76.7M [00:18<00:00, 4.23MiB/s]
```

```
embeddings = embed_model.get_text_embedding("Some text to embed.")
print(len(embeddings))
print(embeddings[:5])
```

```
384
[-0.04166769981384277, 0.0018720313673838973, 0.02632238157093525, -0.036030545830726624, -0.014812108129262924]
```
