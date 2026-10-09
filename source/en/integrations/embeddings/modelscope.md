---
title: ModelScope Embeddings
 | Developer Documentation
---

In this notebook, we show how to use the ModelScope Embeddings in LlamaIndex. Check out the [ModelScope site](https://www.modelscope.cn/).

If you’re opening this Notebook on colab, you will need to install LlamaIndex 🦙 and the modelscope.

```
!pip install llama-index-embeddings-modelscope
```

## Basic Usage

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

#### Generate Batch Embedding

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
