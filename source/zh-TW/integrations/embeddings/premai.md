---
title: "PremAI 嵌入"
---

[PremAI](https://premai.io/) 是一個一站式平台，能簡化使用 Generative AI 建立強大、可投入生產的應用程式。透過簡化開發流程，PremAI 讓您能專注於提升使用者體驗和推動應用程式的整體成長。您可以立即前往 [這裡](https://docs.premai.io/quick-start) 開始使用我們的平台。

在本節中，我們將討論如何使用 `PremEmbeddings` 透過 llama-index 存取不同的 embedding model。

## 安裝與設定

我們首先安裝 `llama-index` 和 `premai-sdk`。您可以輸入以下指令進行安裝：

終端機視窗

```
pip install premai llama-index
```

在繼續之前，請確保您已在 PremAI 建立帳戶並已建立專案。如果尚未建立，請參閱 [快速入門](https://docs.premai.io/introduction) 指南開始使用 PremAI 平台。建立您的第一個專案並取得您的 API key。

```
%pip install llama-index-llms-premai
```

```
from llama_index.embeddings.premai import PremAIEmbeddings
```


## 在 LlamaIndex 中設定 PremAIEmbeddings instance

導入所需的模組後，讓我們設定我們的 client。目前我們假設我們的 `project_id` 是 `8`。但請務必使用您的 project-id，否則會出現錯誤。

為了使用 llama-index 與 PremAI 整合，您不需要在我們的 chat-client 中傳遞任何 model name 或設定任何參數。預設情況下，它會使用 [LaunchPad](https://docs.premai.io/get-started/launchpad) 中使用的 model name 和參數。

我們支援許多最先進的 embedding model。您可以點擊 [這裡](https://docs.premai.io/get-started/supported-models) 查看我們支援的 LLMs 和 embedding models 清單。目前我們以 `text-embedding-3-large` model 作為範例。

```
import os
import getpass


if os.environ.get("PREMAI_API_KEY") is None:
    os.environ["PREMAI_API_KEY"] = getpass.getpass("PremAI API Key:")


prem_embedding = PremAIEmbeddings(
    project_id=8, model_name="text-embedding-3-large"
)
```


## 呼叫 Embedding Model

現在您已設定完成。現在讓我們使用我們的 embedding model，透過單一查詢後接續多個查詢（這也稱為 document）。

```
query = "Hello, this is a test query"
query_result = prem_embedding.get_text_embedding(query)
```

```
print(f"Dimension of embeddings: {len(query_result)}")
```

```
Dimension of embeddings: 3072
```

```
query_result[:5]
```

```
[-0.02129288576543331,
 0.0008162345038726926,
 -0.004556538071483374,
 0.02918623760342598,
 -0.02547479420900345]
```
