---
title: "Nebius Embeddings"
---

本筆筆記演示如何使用 [Nebius AI Studio](https://studio.nebius.ai/) 中的 Embeddings 與 LlamaIndex。Nebius AI Studio 實作了所有最先進的、可供商業使用的 embeddings 模型。

首先，讓我們安裝 LlamaIndex 和 Nebius AI Studio 的依賴項。

```
%pip install llama-index-embeddings-nebius llama-index
```

從下方的系統變數中上傳您的 Nebius AI Studio 金鑰，或直接貼上。您可以透過在 [Nebius AI Studio](https://auth.eu.nebius.com/ui/login) 註冊免費並在 [API Keys 區段](https://studio.nebius.ai/settings/api-keys) 發行金鑰來取得。

```
import os


NEBIUS_API_KEY = os.getenv("NEBIUS_API_KEY")  # NEBIUS_API_KEY = ""
```

現在讓我們使用 Nebius AI Studio 取得 embeddings

```
from llama_index.embeddings.nebius import NebiusEmbedding


embed_model = NebiusEmbedding(api_key=NEBIUS_API_KEY)
```

### 基本用法

```
text = "Everyone loves justice at another person's expense"
embeddings = embed_model.get_text_embedding(text)
assert len(embeddings) == 4096
print(len(embeddings), embeddings[:5], sep="\n")
```

```
4096
[-0.0024051666259765625, 0.0083770751953125, -0.005413055419921875, 0.007396697998046875, -0.022247314453125]
```

### 異步用法

```
text = "Everyone loves justice at another person's expense"
embeddings = await embed_model.aget_text_embedding(text)
assert len(embeddings) == 4096
print(len(embeddings), embeddings[:5], sep="\n")
```

```
4096
[-0.0024051666259765625, 0.0083770751953125, -0.005413055419921875, 0.007396697998046875, -0.022247314453125]
```

### 分批用法

```
texts = [
    "As the hours pass",
    "I will let you know",
    "That I need to ask",
    "Before I'm alone",
]


embeddings = embed_model.get_text_embedding_batch(texts)
assert len(embeddings) == 4
assert len(embeddings[0]) == 4096
print(*[x[:3] for x in embeddings], sep="\n")
```

```
[-0.0003848075866699219, 0.0004799365997314453, 0.011199951171875]
[-0.0037078857421875, 0.0114288330078125, 0.00878143310546875]
[0.005924224853515625, 0.005153656005859375, 0.001438140869140625]
[-0.009490966796875, -0.004852294921875, 0.004779815673828125]
```

### 異步分批用法

```
texts = [
    "As the hours pass",
    "I will let you know",
    "That I need to ask",
    "Before I'm alone",
]


embeddings = await embed_model.aget_text_embedding_batch(texts)
assert len(embeddings) == 4
assert len(embeddings[0]) == 4096
print(*[x[:3] for x in embeddings], sep="\n")
```

```
[-0.0003848075866699219, 0.0004799365997314453, 0.011199951171875]
[-0.0037078857421875, 0.0114288330078125, 0.00878143310546875]
[0.005924224853515625, 0.005153656005859375, 0.001438140869140625]
[-0.009490966796875, -0.004852294921875, 0.004779815673828125]
```
