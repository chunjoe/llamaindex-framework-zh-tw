---
title: "Together AI Embeddings"
---

本筆記示範如何使用 `Together AI` 進行 embeddings。Together AI 提供多種最先進的 embedding 模型。

請造訪 <https://together.ai> 並註冊以獲取 API key。

## 設定

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-embeddings-together
```

```
!pip install llama-index
```

```
# You can set the API key in the embeddings or env
# import os
# os.environ["TOEGETHER_API_KEY"] = "your-api-key"


from llama_index.embeddings.together import TogetherEmbedding


embed_model = TogetherEmbedding(
    model_name="togethercomputer/m2-bert-80M-8k-retrieval", api_key="..."
)
```

## 獲取 Embeddings

```
embeddings = embed_model.get_text_embedding("hello world")
```

```
print(len(embeddings))
```

```
768
```

```
print(embeddings[:5])
```

```
[-0.11657876, -0.012690996, 0.24342081, 0.32781482, 0.022501636]
```
