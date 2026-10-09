---
title: "Oracle Cloud Infrastructure Generative AI"
---

Oracle Cloud Infrastructure (OCI) Generative AI 是一個完全託管的服務，提供一系列最先進、可自訂的大型語言模型 (LLMs)，涵蓋廣泛的用例，且可透過單一的 API 存取。使用 OCI Generative AI 服務，您可以存取現成的預訓練模型，或在專用的 AI cluster 上，根據您自己的資料建立和託管您自訂的微調模型。服務和 API 的詳細文件可於 **[這裡](https://docs.oracle.com/en-us/iaas/Content/generative-ai/home.htm)** 和 **[這裡](https://docs.oracle.com/en-us/iaas/api/#/en/generative-ai/20231130/)** 查閱。

本筆 Notebook 解釋了如何使用 OCI 的 Genrative AI embedding models 與 LlamaIndex 進行操作。

## 設定

如果您在 Colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-embeddings-oci-genai
```

```
!pip install llama-index
```

您還需要安裝 OCI sdk

```
!pip install -U oci
```

## 基本用法

```
from llama_index.embeddings.oci_genai import OCIGenAIEmbeddings


embedding = OCIGenAIEmbeddings(
    model_name="cohere.embed-english-light-v3.0",
    service_endpoint="https://inference.generativeai.us-chicago-1.oci.oraclecloud.com",
    compartment_id="MY_OCID",
)


e1 = embedding.get_text_embedding("This is a test document")
print(e1[-5:])


e2 = embedding.get_query_embedding("This is a test document")
print(e2[-5:])


docs = ["This is a test document", "This is another test document"]
e3 = embedding.get_text_embedding_batch(docs)
print(e3)
```
