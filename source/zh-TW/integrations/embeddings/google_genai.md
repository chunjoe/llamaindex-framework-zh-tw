---
title: "Google GenAI Embeddings"
---

使用 Google 的 `google-genai` package，LlamaIndex 提供一個 `GoogleGenAIEmbedding` class，讓您可以使用 Google 的 GenAI models，透過 Gemini 和 Vertex AI APIs，使用最新的 `gemini-embedding-2-preview` model 來嵌入文字。

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-embeddings-google-genai
```

```
import os


os.environ["GOOGLE_API_KEY"] = "..."
```

## 設定

`GoogleGenAIEmbedding` 是 `google-genai` package 的一個 wrapper，這意味著它預設支援 Gemini 和 Vertex AI APIs。

您可以直接傳入 `api_key`，或傳入 `vertexai_config` 來使用 Vertex AI API。

其他選項包括 `embed_batch_size`、`model_name` 和 `embedding_config`。

```
from llama_index.embeddings.google_genai import GoogleGenAIEmbedding
from google.genai.types import EmbedContentConfig


embed_model = GoogleGenAIEmbedding(
    model_name="gemini-embedding-2-preview",
    embed_batch_size=100,
    # can pass in the api key directly
    # api_key="...",
    # or pass in a vertexai_config
    # vertexai_config={
    #     "project": "...",
    #     "location": "...",
    # }
    # can also pass in an embedding_config
    # embedding_config=EmbedContentConfig(...)
)
```

## 使用方法

### Sync

```
embeddings = embed_model.get_text_embedding("Google Gemini Embeddings.")
print(embeddings[:5])
print(f"Dimension of embeddings: {len(embeddings)}")
```

```
[0.031099992, 0.02192731, -0.06523498, 0.016788177, 0.0392835]
Dimension of embeddings: 768
```

```
embeddings = embed_model.get_query_embedding("Query Google Gemini Embeddings.")
print(embeddings[:5])
print(f"Dimension of embeddings: {len(embeddings)}")
```

```
[0.022199392, 0.03671178, -0.06874573, 0.02195774, 0.05475164]
Dimension of embeddings: 768
```

```
embeddings = embed_model.get_text_embedding_batch(
    [
        "Google Gemini Embeddings.",
        "Google is awesome.",
        "Llamaindex is awesome.",
    ]
)
print(f"Got {len(embeddings)} embeddings")
print(f"Dimension of embeddings: {len(embeddings[0])}")
```

```
Got 3 embeddings
Dimension of embeddings: 768
```

### Async

```
embeddings = await embed_model.aget_text_embedding("Google Gemini Embeddings.")
print(embeddings[:5])
print(f"Dimension of embeddings: {len(embeddings)}")
```

```
[0.031099992, 0.02192731, -0.06523498, 0.016788177, 0.0392835]
Dimension of embeddings: 768
```

```
embeddings = await embed_model.aget_query_embedding(
    "Query Google Gemini Embeddings."
)
print(embeddings[:5])
print(f"Dimension of embeddings: {len(embeddings)}")
```

```
[0.022199392, 0.03671178, -0.06874573, 0.02195774, 0.05475164]
Dimension of embeddings: 768
```

```
embeddings = await embed_model.aget_text_embedding_batch(
    [
        "Google Gemini Embeddings.",
        "Google is awesome.",
        "Llamaindex is awesome.",
    ]
)
print(f"Got {len(embeddings)} embeddings")
print(f"Dimension of embeddings: {len(embeddings[0])}")
```

```
Got 3 embeddings
Dimension of embeddings: 768
```
