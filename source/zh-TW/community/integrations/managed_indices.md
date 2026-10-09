---
title: "使用 Managed Indices"
---

LlamaIndex 提供與 Managed Indices 的多個整合點。Managed index 是一種特殊的 index，它不像 LlamaIndex 那樣在本地管理，而是透過 API 來管理，例如 [Vectara](https://vectara.com/)。

## 使用 Managed Index

與 LlamaIndex 中的任何其他 index（tree、keyword table、list）類似，任何 `ManagedIndex` 都可以由一組 documents 建構。建構後，該 index 可用於查詢。

如果該 Index 已經使用 documents 進行過資料填充，它也可以直接用於查詢。

## Google Generative Language Semantic Retriever

Google 的 Semantic Retrieve 提供查詢和檢索功能。建立一個 managed index，插入 documents，並在 LlamaIndex 的任何地方使用 query engine 或 retriever！

```
from llama_index.core import SimpleDirectoryReader
from llama_index.indices.managed.google import GoogleIndex


# Create a corpus
index = GoogleIndex.create_corpus(display_name="My first corpus!")
print(f"Newly created corpus ID is {index.corpus_id}.")


# Ingestion
documents = SimpleDirectoryReader("data").load_data()
index.insert_documents(documents)


# Querying
query_engine = index.as_query_engine()
response = query_engine.query("What did the author do growing up?")


# Retrieving
retriever = index.as_retriever()
source_nodes = retriever.retrieve("What did the author do growing up?")
```

請參閱 [notebook 指南](https://developers.llamaindex.ai/python/examples/managed/googledemo/index.md) 以獲取完整詳情。

## Vectara

首先，[sign up](https://vectara.com/integrations/llama_index) 並使用 Vectara Console 建立一個 corpus（即 Index），並新增一個 API key 以進行存取。一旦您獲得了您的 API key，請將其匯出為 environment variable：

```
import os


os.environ["VECTARA_API_KEY"] = "<YOUR_VECTARA_API_KEY>"
os.environ["VECTARA_CORPUS_KEY"] = "<YOUR_VECTARA_CORPUS_KEY>"
```

然後建構 Vectara Index 並按如下方式查詢：

```
from llama_index.core import ManagedIndex, SimpleDirectoryReade
from llama_index.indices.managed.vectara import VectaraIndex


# Load documents and build index
vectara_corpus_key = os.environ.get("VECTARA_CORPUS_KEY")
vectara_api_key = os.environ.get("VECTARA_API_KEY")


documents = SimpleDirectoryReader("../paul_graham_essay/data").load_data()
index = VectaraIndex.from_documents(
    documents,
    vectara_corpus_key=vectara_corpus_key,
    vectara_api_key=vectara_api_key,
)
```

備註：

- 如果 environment variables `VECTARA_CORPUS_KEY` 和 `VECTARA_API_KEY` 已經存在於環境中，您無需在呼叫中明確指定它們，VectaraIndex class 將從環境中讀取它們。
- 若要連接到多個 Vectara corpora，您可以將 `VECTARA_CORPUS_KEY` 設定為逗號分隔的列表，例如：`12,51` 將連接到 corpus `12` 和 corpus `51`。

如果您已經在您的 corpus 中擁有 documents，您可以直接透過如下方式建構 `VectaraIndex` 來存取資料：

```
index = VectaraIndex()
```

VectaraIndex 將連接到現有的 corpus 而不載入任何新的 documents。

要查詢 index，只需按如下方式建構 query engine：

```
query_engine = index.as_query_engine(summary_enabled=True)
print(query_engine.query("What did the author do growing up?"))
```

或者您可以使用 chat 功能：

```
chat_engine = index.as_chat_engine()
print(chat_engine.chat("What did the author do growing up?").response)
```

Chat 的運作如預期，後續的 `chat` 呼叫會維持對話歷史。所有這些都在 Vectara platform 上完成，因此您無需添加任何額外的邏輯。

更多範例 - 請參閱以下內容：

- [Vectara Demo](https://developers.llamaindex.ai/python/examples/managed/vectarademo/index.md)
- [Vectara AutoRetriever](https://developers.llamaindex.ai/python/examples/retrievers/vectara_auto_retriever/index.md)

## Vertex AI RAG (LlamaIndex on Vertex AI)

[LlamaIndex on Vertex AI for RAG](https://cloud.google.com/vertex-ai/generative-ai/docs/llamaindex-on-vertexai) 是在 Google Cloud Vertex AI 上的 managed RAG index。

首先，[create a Google Cloud project and enable the Vertex AI API](https://cloud.google.com/vertex-ai/docs/start/cloud-environment)。然後執行以下程式碼來建立一個 managed index。

```
from llama_index.indices.managed.vertexai import VertexAIIndex


# TODO(developer): Replace these values with your project information
project_id = "YOUR_PROJECT_ID"
location = "us-central1"


# Optional: If using an existing corpus
corpus_id = "YOUR_CORPUS_ID"


# Optional: If creating a new corpus
corpus_display_name = "my-corpus"
corpus_description = "Vertex AI Corpus for LlamaIndex"


# Create a corpus or provide an existing corpus ID
index = VertexAIIndex(
    project_id,
    location,
    corpus_display_name=corpus_display_name,
    corpus_description=corpus_description,
)
print(f"Newly created corpus name is {index.corpus_name}.")


# Import files from Google Cloud Storage or Google Drive
index.import_files(
    uris=["https://drive.google.com/file/123", "gs://my_bucket/my_files_dir"],
    chunk_size=512,  # Optional
    chunk_overlap=100,  # Optional
)


# Upload local file
index.insert_file(
    file_path="my_file.txt",
    metadata={"display_name": "my_file.txt", "description": "My file"},
)


# Querying
query_engine = index.as_query_engine()
response = query_engine.query("What is RAG and why it is helpful?")


# Retrieving
retriever = index.as_retriever()
nodes = retriever.retrieve("What is RAG and why it is helpful?")
```

請參閱 [notebook 指南](https://developers.llamaindex.ai/python/examples/managed/vertexaidemo/index.md) 以獲取完整詳情。