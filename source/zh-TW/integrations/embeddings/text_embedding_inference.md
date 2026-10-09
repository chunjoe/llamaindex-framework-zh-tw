---
title: "文本嵌入推論"
---

本筆記演示如何設定 `TextEmbeddingInference` embeddings。

第一步是部署 embeddings server。欲了解詳細說明，請參閱 [的官方儲存庫 文字 Embeddings 推論](https://github.com/huggingface/text-embeddings-inference)。若您部署在 Habana Gaudi/Gaudi 2 上，請參閱 [tei-gaudi repository](https://github.com/huggingface/tei-gaudi)。

部署完成後，以下程式碼將連接並提交 embeddings 進行 inference。

如果您在 colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-embeddings-text-embeddings-inference
```

```
!pip install llama-index
```

```
from llama_index.embeddings.text_embeddings_inference import (
    TextEmbeddingsInference,
)




embed_model = TextEmbeddingsInference(
    model_name="BAAI/bge-large-en-v1.5",  # required for formatting inference text,
    timeout=60,  # timeout in seconds
    embed_batch_size=10,  # batch size for embedding
)
```

```
embeddings = embed_model.get_text_embedding("Hello World!")
print(len(embeddings))
print(embeddings[:5])
```

```
1024
[0.010597229, 0.05895996, 0.022445679, -0.012046814, -0.03164673]
```

```
embeddings = await embed_model.aget_text_embedding("Hello World!")
print(len(embeddings))
print(embeddings[:5])
```

```
1024
[0.010597229, 0.05895996, 0.022445679, -0.012046814, -0.03164673]
```
