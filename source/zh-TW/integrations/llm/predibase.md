---
title: "Predibase"
---

本筆記展示如何將 Predibase 託管的 LLM 在 Llamaindex 中使用。您可以將 [Predibase](https://predibase.com/) 加入您現有的 Llamaindex 工作流程，以：

1. 無需麻煩地部署和查詢預訓練或自訂的 open source LLM
2. 使端到端檢索增強生成 (Retrieval Augmented Generation) (RAG) 系統投入運作
3. 只需幾行程式碼即可微調您自己的 LLM

## 開始使用

1. 註冊一個免費的 Predibase 帳戶 [這裡](https://predibase.com/free-trial)
2. 建立帳戶
3. 前往 Settings > My profile 並生成一個新的 API Token。

```
%pip install llama-index-llms-predibase
```

```
!pip install llama-index --quiet
!pip install predibase --quiet
!pip install sentence-transformers --quiet
```

```
import os


os.environ["PREDIBASE_API_TOKEN"] = "{PREDIBASE_API_TOKEN}"
from llama_index.llms.predibase import PredibaseLLM
```

## 流程 1：直接查詢 Predibase LLM

```
# Predibase-hosted fine-tuned adapter example
llm = PredibaseLLM(
    model_name="mistral-7b",
    predibase_sdk_version=None,  # optional parameter (defaults to the latest Predibase SDK version if omitted)
    adapter_id="e2e_nlg",  # adapter_id is optional
    adapter_version=1,  # optional parameter (applies to Predibase only)
    api_token=None,  # optional parameter for accessing services hosting adapters (e.g., HuggingFace)
    max_new_tokens=512,
    temperature=0.3,
)
# The `model_name` parameter is the Predibase "serverless" base_model ID
# (see https://docs.predibase.com/user-guide/inference/models for the catalog).
# You can also optionally specify a fine-tuned adapter that's hosted on Predibase or HuggingFace
# In the case of Predibase-hosted adapters, you must also specify the adapter_version
```

```
# HuggingFace-hosted fine-tuned adapter example
llm = PredibaseLLM(
    model_name="mistral-7b",
    predibase_sdk_version=None,  # optional parameter (defaults to the latest Predibase SDK version if omitted)
    adapter_id="predibase/e2e_nlg",  # adapter_id is optional
    api_token=os.environ.get(
        "HUGGING_FACE_HUB_TOKEN"
    ),  # optional parameter for accessing services hosting adapters (e.g., HuggingFace)
    max_new_tokens=512,
    temperature=0.3,
)
# The `model_name` parameter is the Predibase "serverless" base_model ID
# (see https://docs.predibase.com/user-guide/inference/models for the catalog).
# You can also optionally specify a fine-tuned adapter that's hosted on Predibase or HuggingFace
# In the case of Predibase-hosted adapters, you can also specify the adapter_version (assumed latest if omitted)
```

```
result = llm.complete("Can you recommend me a nice dry white wine?")
print(result)
```

## 流程 2：使用 Predibase LLM 進行檢索增強生成 (RAG)

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core.embeddings import resolve_embed_model
from llama_index.core.node_parser import SentenceSplitter
```

#### 下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

### 載入 Documents

```
documents = SimpleDirectoryReader("./data/paul_graham/").load_data()
```

### 設定 Predibase LLM

```
# Predibase-hosted fine-tuned adapter
llm = PredibaseLLM(
    model_name="mistral-7b",
    predibase_sdk_version=None,  # optional parameter (defaults to the latest Predibase SDK version if omitted)
    adapter_id="e2e_nlg",  # adapter_id is optional
    api_token=None,  # optional parameter for accessing services hosting adapters (e.g., HuggingFace)
    temperature=0.3,
    context_window=1024,
)
```

```
# HuggingFace-hosted fine-tuned adapter
llm = PredibaseLLM(
    model_name="mistral-7b",
    predibase_sdk_version=None,  # optional parameter (defaults to the latest Predibase SDK version if omitted)
    adapter_id="predibase/e2e_nlg",  # adapter_id is optional
    api_token=os.environ.get(
        "HUGGING_FACE_HUB_TOKEN"
    ),  # optional parameter for accessing services hosting adapters (e.g., HuggingFace)
    temperature=0.3,
    context_window=1024,
)
```

```
embed_model = resolve_embed_model("local:BAAI/bge-small-en-v1.5")
splitter = SentenceSplitter(chunk_size=1024)
```

### 設定和查詢 Index

```
index = VectorStoreIndex.from_documents(
    documents, transformations=[splitter], embed_model=embed_model
)
query_engine = index.as_query_engine(llm=llm)
response = query_engine.query("What did the author do growing up?")
```

```
print(response)
```
