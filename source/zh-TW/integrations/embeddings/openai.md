---
title: "OpenAI 嵌入"
---

如果您在 colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-embeddings-openai
```

```
!pip install llama-index
```

```
import os


os.environ["OPENAI_API_KEY"] = "sk-..."
```

```
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core import Settings


embed_model = OpenAIEmbedding(embed_batch_size=10)
Settings.embed_model = embed_model
```

## 使用 OpenAI `text-embedding-3-large` 和 `text-embedding-3-small`

注意，您可能需要更新您的 openai client：`pip install -U openai`

```
# get API key and create embeddings
from llama_index.embeddings.openai import OpenAIEmbedding


embed_model = OpenAIEmbedding(model="text-embedding-3-large")


embeddings = embed_model.get_text_embedding(
    "Open AI new Embeddings models is great."
)
```

```
print(embeddings[:5])
```

```
[-0.011500772088766098, 0.02457442320883274, -0.01760469563305378, -0.017763426527380943, 0.029841400682926178]
```

```
print(len(embeddings))
```

```
3072
```

```
# get API key and create embeddings
from llama_index.embeddings.openai import OpenAIEmbedding


embed_model = OpenAIEmbedding(
    model="text-embedding-3-small",
)


embeddings = embed_model.get_text_embedding(
    "Open AI new Embeddings models is awesome."
)
```

```
print(len(embeddings))
```

```
1536
```

## 更改 output embeddings 的 dimension

注意：請確保您使用的是最新的 OpenAI client

```
# get API key and create embeddings
from llama_index.embeddings.openai import OpenAIEmbedding




embed_model = OpenAIEmbedding(
    model="text-embedding-3-large",
    dimensions=512,
)


embeddings = embed_model.get_text_embedding(
    "Open AI new Embeddings models with different dimensions is awesome."
)
print(len(embeddings))
```

```
512
```
