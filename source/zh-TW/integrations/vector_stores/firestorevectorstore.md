---
title: "Firestore Vector Store"
---

# Google Firestore (Native Mode)

> [Firestore](https://cloud.google.com/firestore) 是一個無伺服器、以 document 為導向的資料庫，可擴展以滿足任何需求。擴展您的資料庫應用程式，利用 Firestore 的 Langchain 整合來建構 AI 驅動的體驗。

本筆筆記將介紹如何使用 [Firestore](https://cloud.google.com/firestore) 來儲存向量並使用 `FirestoreVectorStore` 類別進行查詢。

## 開始之前

要執行本筆記，您需要完成以下操作：

- [建立一個 Google Cloud Project](https://developers.google.com/workspace/guides/create-project)
- [啟用 Firestore API](https://console.cloud.google.com/flows/enableapi?apiid=firestore.googleapis.com)
- [建立一個 Firestore 資料庫](https://cloud.google.com/firestore/docs/manage-databases)

在確認本筆記運行環境中的資料庫存取後，填寫以下數值並運行儲存腳本，然後再運行範例腳本。

## 函式庫安裝

如果您在 Colab 上開啟本筆記，您可能需要安裝 LlamaIndex 🦙。對於本筆記，我們還將安裝 `langchain-google-genai` 以使用 Google Generative AI embeddings。

```
%pip install --quiet llama-index
%pip install --quiet llama-index-vector-stores-firestore llama-index-embeddings-huggingface
```

### ☁ 設定您的 Google Cloud Project

設定您的 Google Cloud project，以便在本筆記中使用 Google Cloud 資源。

如果您不知道您的 project ID，請嘗試以下操作：

- 運行 `gcloud config list`。
- 運行 `gcloud projects list`。
- 查看支援頁面：[Locate the project ID](https://support.google.com/googleapi/answer/7014113)。

```
# @markdown Please fill in the value below with your Google Cloud project ID and then run the cell.


PROJECT_ID = "YOUR_PROJECT_ID"  # @param {type:"string"}


# Set the project id
!gcloud config set project {PROJECT_ID}
```

### 🔐 驗證

以登入本筆記的 IAM 使用者身份驗證 Google Cloud，以便存取您的 Google Cloud Project。

- 如果您使用 Colab 運行本筆記，請使用下面的儲存格並繼續。
- 如果您使用 Vertex AI Workbench，請查看設定說明 [這裡](https://github.com/GoogleCloudPlatform/generative-ai/tree/main/setup-env)。

```
from google.colab import auth


auth.authenticate_user()
```

# 基本用法

### 初始化 FirestoreVectorStore

`FirestoreVectroStore` 讓您可以將資料載入 Firestore 並進行查詢。

```
# @markdown Please specify a source for demo purpose.
COLLECTION_NAME = "test_collection"
```

```
from llama_index.core import SimpleDirectoryReader


# Load documents and build index
documents = SimpleDirectoryReader(
    "../../examples/data/paul_graham"
).load_data()
```

```
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core import Settings


# Set the embedding model, this is a local model
embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")
```

```
from llama_index.core import VectorStoreIndex
from llama_index.core import StorageContext, ServiceContext


from llama_index.vector_stores.firestore import FirestoreVectorStore


# Create a Firestore vector store
store = FirestoreVectorStore(collection_name=COLLECTION_NAME)


storage_context = StorageContext.from_defaults(vector_store=store)
service_context = ServiceContext.from_defaults(
    llm=None, embed_model=embed_model
)


index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context, service_context=service_context
)
```

```
/var/folders/mh/cqn7wzgs3j79rbg243_gfcx80000gn/T/ipykernel_29666/1668628626.py:10: DeprecationWarning: Call to deprecated class method from_defaults. (ServiceContext is deprecated, please use `llama_index.settings.Settings` instead.) -- Deprecated since version 0.10.0.
  service_context = ServiceContext.from_defaults(llm=None, embed_model=embed_model)




LLM is explicitly disabled. Using MockLLM.
```

### 執行搜尋

您可以使用 `FirestoreVectorStore` 對已儲存的向量執行相似度搜尋。這對於尋找相似的 documents 或文字非常有用。

```
query_engine = index.as_query_engine()
res = query_engine.query("What did the author do growing up?")
print(str(res.source_nodes[0].text))
```

```
None
What I Worked On


February 2021


Before college the two main things I worked on, outside of school, were writing and programming. I didn't write essays. I wrote what beginning writers were supposed to write then, and probably still are: short stories. My stories were awful. They had hardly any plot, just characters with strong feelings, which I imagined made them deep.


The first programs I tried writing were on the IBM 1401 that our school district used for what was then called "data processing." This was in 9th grade, so I was 13 or 14. The school district's 1401 happened to be in the basement of our junior high school, and my friend Rich Draves and I got permission to use it. It was like a mini Bond villain's lair down there, with all these alien-looking machines — CPU, disk drives, printer, card reader — sitting up on a raised floor under bright fluorescent lights.


The language we used was an early version of Fortran. You had to type programs on punch cards, then stack them in the card reader and press a button to load the program into memory and run it. The result would ordinarily be to print something on the spectacularly loud printer.


I was puzzled by the 1401. I couldn't figure out what to do with it. And in retrospect there's not much I could have done with it. The only form of input to programs was data stored on punched cards, and I didn't have any data stored on punched cards. The only other option was to do things that didn't rely on any input, like calculate approximations of pi, but I didn't know enough math to do anything interesting of that type. So I'm not surprised I can't remember any programs I wrote, because they can't have done much. My clearest memory is of the moment I learned it was possible for programs not to terminate, when one of mine didn't. On a machine without time-sharing, this was a social as well as a technical error, as the data center manager's expression made clear.


With microcomputers, everything changed. Now you could have a computer sitting right in front of you, on a desk, that could respond to your keystrokes as it was running instead of just churning through a stack of punch cards and then stopping. [1]


The first of my friends to get a microcomputer built it himself. It was sold as a kit by Heathkit. I remember vividly how impressed and envious I felt watching him sitting in front of it, typing programs right into the computer.


Computers were expensive in those days and it took me years of nagging before I convinced my father to buy one, a TRS-80, in about 1980. The gold standard then was the Apple II, but a TRS-80 was good enough. This was when I really started programming. I wrote simple games, a program to predict how high my model rockets would fly, and a word processor that my father used to write at least one book. There was only room in memory for about 2 pages of text, so he'd write 2 pages at a time and then print them out, but it was a lot better than a typewriter.


Though I liked programming, I didn't plan to study it in college. In college I was going to study philosophy, which sounded much more powerful. It seemed, to my naive high school self, to be the study of the ultimate truths, compared to which the things studied in other fields would be mere domain knowledge. What I discovered when I got to college was that the other fields took up so much of the space of ideas that there wasn't much left for these supposed ultimate truths. All that seemed left for philosophy were edge cases that people in other fields felt could safely be ignored.


I couldn't have put this into words when I was 18. All I knew at the time was that I kept taking philosophy courses and they kept being boring. So I decided to switch to AI.


AI was in the air in the mid 1980s, but there were two things especially that made me want to work on it: a novel by Heinlein called The Moon is a Harsh Mistress, which featured an intelligent computer called Mike, and a PBS documentary that showed Terry Winograd using SHRDLU. I haven't tried rereading The Moon is a Harsh Mistress, so I don't know how well it has aged, but when I read it I was drawn entirely into its world.
```

您可以透過指定一個 `filters` 參數來對搜尋結果進行預過濾。

```
from llama_index.core.vector_stores.types import (
    MetadataFilters,
    ExactMatchFilter,
    MetadataFilter,
)


filters = MetadataFilters(
    filters=[MetadataFilter(key="author", value="Paul Graham")]
)
query_engine = index.as_query_engine(filters=filters)
res = query_engine.query("What did the author do growing up?")
print(str(res.source_nodes[0].text))
```
