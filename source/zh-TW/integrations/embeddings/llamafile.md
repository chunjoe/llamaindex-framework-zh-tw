---
title: "Llamafile 嵌入"
---

使用 [llamafile](https://github.com/Mozilla-Ocho/llamafile) 是在本地運行 LLM 的最簡單方法。llamafile 將模型權重和一個 [specially-compiled](https://github.com/Mozilla-Ocho/llamafile?tab=readme-ov-file#technical-details) 的 [`llama.cpp`](https://github.com/ggerganov/llama.cpp) 打包成一個單一檔案，可以在大多數電腦上運行，無需額外的依賴項。它們還附帶一個嵌入式的 inference server，提供一個用於與您的模型互動的 [API](https://github.com/Mozilla-Ocho/llamafile/blob/main/llama.cpp/server/README.md#api-endpoints)。

## 設定

1. 從 [HuggingFace](https://huggingface.co/models?other=llamafile) 下載一個 llamafile
2. 使檔案可執行
3. 運行該檔案

以下是一個顯示所有 3 個設定步驟的簡單 bash 腳本：

Terminal 視窗

```
# Download a llamafile from HuggingFace
wget https://huggingface.co/jartine/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/TinyLlama-1.1B-Chat-v1.0.Q5_K_M.llamafile


# Make the file executable. On Windows, instead just rename the file to end in ".exe".
chmod +x TinyLlama-1.1B-Chat-v1.0.Q5_K_M.llamafile


# Start the model server. Listens at http://localhost:8080 by default.
./TinyLlama-1.1B-Chat-v1.0.Q5_K_M.llamafile --server --nobrowser --embedding
```

您的模型的 inference server 預設監聽在 localhost:8080。

```
%pip install llama-index-embeddings-llamafile
```

```
!pip install llama-index
```

```
from llama_index.embeddings.llamafile import LlamafileEmbedding


embedding = LlamafileEmbedding(
    base_url="http://localhost:8080",
)


pass_embedding = embedding.get_text_embedding_batch(
    ["This is a passage!", "This is another passage"], show_progress=True
)
print(len(pass_embedding), len(pass_embedding[0]))


query_embedding = embedding.get_query_embedding("Where is blue?")
print(len(query_embedding))
print(query_embedding[:10])
```
