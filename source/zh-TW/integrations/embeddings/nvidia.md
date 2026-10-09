---
title: "NVIDIA NIMs"
---

`llama-index-embeddings-nvidia` 套件包含 LlamaIndex 整合，用於使用 NVIDIA NIM 推理微服務上的模型來建構應用程式。NIM 支援來自社群以及 NVIDIA 的聊天、embedding 和 re-ranking 模型等各領域的模型。這些模型由 NVIDIA 進行優化，以在 NVIDIA 加速基礎設施上提供最佳效能，並以 NIM 的形式部署，這是一種易於使用、預先建置的容器，可使用單一指令在 NVIDIA 加速基礎設施上的任何地方部署。

NIM 的 NVIDIA 主機部署可於 [NVIDIA API catalog](https://build.nvidia.com/) 上進行測試。測試後，NIM 可以使用 NVIDIA AI Enterprise 授權從 NVIDIA 的 API catalog 中匯出，並在本地或雲端運行，讓企業擁有其 IP 和 AI 應用的所有權和完全控制權。

NIM 依據模型進行打包成容器映像，並透過 NVIDIA NGC Catalog 分發為 NGC container images。NIM 的核心是提供簡單、一致且熟悉的 API，用於在 AI 模型上執行推理。

## 安裝

```
%pip install --upgrade --quiet llama-index-embeddings-nvidia
```

## 設定

**開始使用：**

1. 在 [NVIDIA](https://build.nvidia.com/) 建立免費帳戶，該平台託管 NVIDIA AI Foundation 模型。

2. 選擇 `Retrieval` 標籤，然後選擇您選擇的模型。

3. 在 `Input` 下，選擇 `Python` 標籤，然後點擊 `Get API Key`。然後點擊 `Generate Key`。

4. 複製並儲存生成的金鑰為 `NVIDIA_API_KEY`。從那裡，您應該可以存取 endpoint。

```
import getpass
import os


# del os.environ['NVIDIA_API_KEY']  ## delete key and reset
if os.environ.get("NVIDIA_API_KEY", "").startswith("nvapi-"):
    print("Valid NVIDIA_API_KEY already in environment. Delete to reset")
else:
    nvapi_key = getpass.getpass("NVAPI Key (starts with nvapi-): ")
    assert nvapi_key.startswith(
        "nvapi-"
    ), f"{nvapi_key[:5]}... is not a valid key"
    os.environ["NVIDIA_API_KEY"] = nvapi_key
```

## 使用 NVIDIA API Catalog

在初始化 embedding 模型時，您可以透過傳遞模型名稱（例如 `NV-Embed-QA`）來選擇模型，或不傳遞任何參數來使用預設模型。

```
from llama_index.embeddings.nvidia import NVIDIAEmbedding


embedder = NVIDIAEmbedding(model="NV-Embed-QA")
```

此模型是一個經過微調的 E5-large 模型，支援預期的 [`Embeddings`](https://docs.llamaindex.ai/en/stable/api_reference/embeddings/) 方法，包括：

- `get_query_embedding`：為查詢樣本生成查詢 embedding。

- `get_text_embedding_batch`：為您想要搜尋的 documents 列表生成文本 embedding。

- 以及上述方法的非同步版本。

## 使用 NVIDIA NIMs

除了連接到託管的 [NVIDIA NIMs](https://ai.nvidia.com/) 之外，此連接器還可用於連接到本地 NIM 實例。這有助於在需要時將您的應用程式本地化。

有關如何設定本地 NIM 實例的說明，請參閱 [NVIDIA NIM](https://developer.nvidia.com/nim)。

```
from llama_index.embeddings.nvidia import NVIDIAEmbedding


# Connect to an embedding NIM running at localhost:8080
embedder = NVIDIAEmbedding(base_url="http://localhost:8080/v1")
embedder.available_models
```

```
/home/raspawar/Desktop/llama_index/llama-index-integrations/embeddings/llama-index-embeddings-nvidia/llama_index/embeddings/nvidia/base.py:161: UserWarning: Default model is set as: NV-Embed-QA.
Set model using model parameter.
To get available models use available_models property.
  warnings.warn(










[Model(id='NV-Embed-QA', base_model=None)]
```

### **相似度**

以下是這些資料點的相似度快速測試：

**查詢 (Queries)：**

- Komchatka 的天氣如何？

- 義大利以什麼食物聞名？

- 我的名字是什麼？我敢打賭你記不起來……

- 人生的意義到底是什麼？

- 人生的意義是為了享受樂趣 :D

**文本 (Texts)：**

- Komchatka 的天氣很冷，冬季漫長而嚴酷。

- 義大利以義大利麵、披薩、冰淇淋和濃縮咖啡聞名。

- 我無法記住個人姓名，只能提供資訊。

- 人生的目的各不相同，通常被視為個人實現。

- 享受人生的瞬間確實是一種很棒的方法。

### Embed queries

```
print("\nSequential Embedding: ")
q_embeddings = [
    embedder.get_query_embedding("What's the weather like in Komchatka?"),
    embedder.get_query_embedding("What kinds of food is Italy known for?"),
    embedder.get_query_embedding(
        "What's my name? I bet you don't remember..."
    ),
    embedder.get_query_embedding("What's the point of life anyways?"),
    embedder.get_query_embedding("The point of life is to have fun :D"),
]
print("Shape:", (len(q_embeddings), len(q_embeddings[0])))
```

### Embed documents

```
print("\nBatch Document Embedding: ")
d_embeddings = embedder.get_text_embedding_batch(
    [
        "Komchatka's weather is cold, with long, severe winters.",
        "Italy is famous for pasta, pizza, gelato, and espresso.",
        "I can't recall personal names, only provide information.",
        "Life's purpose varies, often seen as personal fulfillment.",
        "Enjoying life's moments is indeed a wonderful approach.",
    ]
)
print("Shape:", (len(d_embeddings), len(d_embeddings[0])))
```

現在我們已經生成了 embedding，我們可以對結果進行簡單的相似度檢查，看看哪個 documents 會在檢索任務中觸發出合理的答案：

```
%pip install --upgrade --quiet matplotlib scikit-learn
```

```
import matplotlib.pyplot as plt
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity


# Compute the similarity matrix between q_embeddings and d_embeddings
cross_similarity_matrix = cosine_similarity(
    np.array(q_embeddings),
    np.array(d_embeddings),
)


# Plotting the cross-similarity matrix
plt.figure(figsize=(8, 6))
plt.imshow(cross_similarity_matrix, cmap="Greens", interpolation="nearest")
plt.colorbar()
plt.title("Cross-Similarity Matrix")
plt.xlabel("Query Embeddings")
plt.ylabel("Document Embeddings")
plt.grid(True)
plt.show()
```

提醒一下，發送到我們系統的查詢和 documents 是：

**查詢 (Queries)：**

- Komchatka 的天氣如何？

- 義大利以什麼食物聞名？

- 我的名字是什麼？我敢打賭你記不起來……

- 人生的意義到底是什麼？

- 人生的意義是為了享受樂趣 :D

**文本 (Texts)：**

- Komchatka 的天氣很冷，冬季漫長而嚴酷。

- 義大利以義大利麵、披薩、冰淇淋和濃縮咖啡聞名。

- 我無法記住個人姓名，只能提供資訊。

- 人生的目的各不相同，通常被視為個人實現。

- 享受人生的瞬間確實是一種很棒的方法。

## 截斷 (Truncation)Embedding model 通常具有一個固定的 context window，決定了可以嵌入的最大輸入 token 數量。這個限制可能是硬性限制，等於模型的最大輸入 token 長度，或是有效限制，超過此限制後嵌入的準確度會下降。

由於模型是基於 token 運作，而應用程式通常處理文字，因此應用程式很難確保其輸入保持在模型的 token 限制內。預設情況下，如果輸入過大會拋出例外。

為協助此目的，NVIDIA NIMs 提供一個 `truncate` 參數，如果輸入過大，會在伺服器端進行截斷。

`truncate` 參數有三個選項：

- “NONE”：預設選項。如果輸入過大會拋出例外。
- “START”：伺服器從開頭（左側）截斷輸入，必要時丟棄 token。
- “END”：伺服器從結尾（右側）截斷輸入，必要時丟棄 token。

```
long_text = "AI is amazing, amazing is " * 100
```

```
strict_embedder = NVIDIAEmbedding()
try:
    strict_embedder.get_query_embedding(long_text)
except Exception as e:
    print("Error:", e)
```

```
truncating_embedder = NVIDIAEmbedding(truncate="END")
truncating_embedder.get_query_embedding(long_text)[:5]
```
