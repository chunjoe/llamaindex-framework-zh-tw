---
title: "ModelScope Embeddings"
---

在本筆筆記中，我們將展示如何使用 LlamaIndex 中的 ModelScope Embeddings。請查看 [ModelScope site](https://www.modelscope.cn/)。

如果您在 Colab 上開啟此 Notebook，您需要安裝 LlamaIndex 🦙 和 modelscope。

```
!pip install llama-index-embeddings-modelscope
```

## 基本用法

```
import sys
from llama_index.embeddings.modelscope.base import ModelScopeEmbedding


model = ModelScopeEmbedding(
    model_name="iic/nlp_gte_sentence-embedding_chinese-base",
    model_revision="master",
)


rsp = model.get_query_embedding("Hello, who are you?")
print(rsp)


rsp = model.get_text_embedding("Hello, who are you?")
print(rsp)
```

#### 生成批次 Embedding

```
from llama_index.embeddings.modelscope.base import ModelScopeEmbedding


model = ModelScopeEmbedding(
    model_name="iic/nlp_gte_sentence-embedding_chinese-base",
    model_revision="master",
)


rsp = model.get_text_embedding_batch(
    ["Hello, who are you?", "I am a student."]
)
print(rsp)
```
