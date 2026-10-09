---
title: "Netmind AI Embeddings"
---

本筆記示範如何使用 `Netmind AI` 進行 embeddings。

請造訪 <https://www.netmind.ai/> 並註冊以獲取 API key。

## 設定

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-embeddings-netmind
```

```
!pip install llama-index
```

```
# You can set the API key in the embeddings or env
# import os
# os.environ["NETMIND_API_KEY"] = "your-api-key"


from llama_index.embeddings.netmind import NetmindEmbedding


embed_model = NetmindEmbedding(
    model_name="BAAI/bge-m3", api_key="your-api-key"
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
1024
```

```
print(embeddings[:5])
```

```
[-0.04039396345615387, 0.03703497350215912, -0.02897450141608715, 0.016117244958877563, -0.03569157049059868]
```
