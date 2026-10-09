---
title: "Mixedbread AI Embeddings"
---

探索 MixedBread AI 的 embedding model 搭配自訂編碼格式（binary、int、float、base64 等）、embedding dimension（Matryoshka）和 context prompts 的能力。

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-embeddings-mixedbreadai
```

```
!pip install llama-index
```

```
import os
from llama_index.embeddings.mixedbreadai import MixedbreadAIEmbedding
```

```
# API Key and Embedding Initialization


# You can visit https://www.mixedbread.ai/api-reference#quick-start-guide
# to get an api key
mixedbread_api_key = os.environ.get("MXBAI_API_KEY", "your-api-key")


# Please check https://www.mixedbread.ai/docs/embeddings/models#whats-new-in-the-mixedbread-embed-model-family
# for our embedding models
model_name = "mixedbread-ai/mxbai-embed-large-v1"
```

```
oven = MixedbreadAIEmbedding(api_key=mixedbread_api_key, model_name=model_name)


embeddings = oven.get_query_embedding("Why bread is so tasty?")


print(len(embeddings))
print(embeddings[:5])
```

```
1024
[0.01128387451171875, 0.031097412109375, -0.00606536865234375, 0.0291748046875, -0.038604736328125]
```

### 使用 prompt 進行上下文 embedding

prompt 可以改善模型對 embedding 在後續任務中如何使用的理解，進而提高效能。我們的實驗顯示，使用特定領域的 prompt 可以提高效能。

```
prompt_for_retrieval = (
    "Represent this sentence for searching relevant passages:"
)


contextual_oven = MixedbreadAIEmbedding(
    api_key=mixedbread_api_key,
    model_name=model_name,
    prompt=prompt_for_retrieval,
)


contextual_embeddings = contextual_oven.get_query_embedding(
    "What bread is invented in Germany?"
)


print(len(contextual_embeddings))
print(contextual_embeddings[:5])
```

```
1024
[-0.0235443115234375, -0.0152435302734375, 0.008392333984375, 0.00336456298828125, -0.044647216796875]
```

## Quantization 和 Matryoshka 支援

Mixedbread AI embedding 支援 quantization 和 matryoshka，以減小 embedding 的大小以獲得更好的儲存，同時保留大部分效能。請參閱這些文章以獲取更多資訊：

- [Binary 以及 Scalar Embedding Quantization 對於 Significantly Faster & Cheaper Retrieval](https://huggingface.co/blog/embedding-quantization)
- [64 每個 embedding 的位元組數，yee-haw](https://www.mixedbread.ai/blog/binary-mrl)。

### 使用不同的編碼格式

預設的 `encoding_format` 是 `float`。我們也支援 `float16`、`binary`、`ubinary`、`int8`、`uint8`、`base64`。

```
# with `binary` embedding types
binary_oven = MixedbreadAIEmbedding(
    api_key=mixedbread_api_key,
    model_name=model_name,
    encoding_format="binary",
)


binary_embeddings = binary_oven.get_text_embedding(
    "The bread is tiny but still filling!"
)


print(len(binary_embeddings))
print(binary_embeddings[:5])
```

```
128
[-121.0, 96.0, -108.0, 111.0, 110.0]
```

### 使用不同的 embedding dimension

Mixedbread AI embedding model 支援 Matryoshka dimension truncation。預設 dimension 設定為模型的最大值。請留意我們的網站以查看哪些 model 支援 Matryoshka。

```
# with truncated dimension
half_oven = MixedbreadAIEmbedding(
    api_key=mixedbread_api_key,
    model_name=model_name,
    dimensions=512,  # 1024 is the maximum of `mxbai-embed-large-v1`
)


half_embeddings = half_oven.get_text_embedding(
    "I want the better half of my bread."
)


print(len(half_embeddings))
print(half_embeddings[:5])
```

```
512
[-0.014221191, -0.013671875, -0.03314209, 0.025909424, -0.035095215]
```
