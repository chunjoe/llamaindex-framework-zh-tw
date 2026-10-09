---
title: "ObjectBox VectorStore 範例"
---

此筆筆記將展示如何使用 [ObjectBox](https://objectbox.io/) 作為一個高效的裝置端 vector-store，搭配 LlamaIndex。我們將考慮一個簡單的 RAG 用例，即給定一個 document，使用者可以透過自然語言向 LLM 提問並獲得相關答案。RAG pipeline 將沿著以下垂直方向進行配置：

- 從 LlamaIndex 的內建 [`SimpleDirectoryReader` reader](https://docs.llamaindex.ai/en/stable/examples/data_connectors/simple_directory_reader/)
- 從 LlamaIndex 的內建 [`SentenceSplitter` node-parser](https://docs.llamaindex.ai/en/stable/api_reference/node_parsers/sentence_splitter/)
- 從 [HuggingFace as embedding providers](https://docs.llamaindex.ai/en/stable/examples/embeddings/huggingface/) 的模型
- 將 [ObjectBox](https://objectbox.io/) 作為 NoSQL 和 vector datastore
- 將 Google 的 [Gemini](https://docs.llamaindex.ai/en/stable/examples/llm/gemini/) 作為遠端 LLM service

## 1) 安裝依賴項

我們安裝 HuggingFace 和 Gemini 的整合，以便與 LlamaIndex 一同使用。

```
!pip install llama_index_vector_stores_objectbox --quiet
!pip install llama-index --quiet
!pip install llama-index-embeddings-huggingface --quiet
!pip install llama-index-llms-gemini --quiet
```

```
[?25l   [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m0.0/1.6 MB[0m [31m?[0m eta [36m-:--:--[0m
```

\[2K \[91m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\[0m\[90m╺\[0m\[90m━━\[0m \[32m1.5/1.6 MB\[0m \[31m40.2 MB/s\[0m eta \[36m0:00:01\[0m \[2K \[90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\[0m \[32m1.6/1.6 MB\[0m \[31m25.4 MB/s\[0m eta \[36m0:00:00\[0m \[2K \[90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\[0m \[32m4.0/4.0 MB\[0m \[31m44.0 MB/s\[0m eta \[36m0:00:00\[0m \[2K \[90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\[0m \[32m1.5/1.5 MB\[0m \[31m38.9 MB/s\[0m eta \[36m0:00:00\[0m \[2K \[90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\[0m \[32m1.1/1.1 MB\[0m \[31m37.5 MB/s\[0m eta \[36m0:00:00\[0m \[2K \[90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\[0m \[32m76.4/76.4 kB\[0m \[31m5.2 MB/s\[0m eta \[36m0:00:00\[0m \[2K \[90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\[0m \[32m77.9/77.9 kB\[0m \[31m4.9 MB/s\[0m eta \[36m0:00:00\[0m \[2K \[90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\[0m \[32m49.3/49.3 kB\[0m \[31m3.1 MB/s\[0m eta \[36m0:00:00\[0m \[2K \[90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\[0m \[32m58.3/58.3 kB\[0m \[31m3.4 MB/s\[0m eta \[36m0:00:00\[0m \[?25h

## 2) 下載 documents

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```


## 3) 設定 LLM 以用於 RAG (Gemini)

我們使用 Google Gemini 的雲端式 API 作為 LLM。您可以在 [console](https://aistudio.google.com/app/apikey) 中取得一個 API-key。

```
from llama_index.llms.gemini import Gemini
import getpass


gemini_key_api = getpass.getpass("Gemini API Key: ")
gemini_llm = Gemini(api_key=gemini_key_api)
```


## 4) 設定用於 RAG 的嵌入模型 (HuggingFace `bge-small-en-v1.5`)

HuggingFace 託管多種嵌入模型，可以從 [MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard) 觀察到。

```
from llama_index.embeddings.huggingface import HuggingFaceEmbedding


hf_embedding = HuggingFaceEmbedding(model_name="BAAI/bge-base-en-v1.5")
embedding_dim = 384
```


## 5) 準備 documents 和 nodes

在 RAG pipeline 中，第一步是讀取給定的 documents。我們使用 `SimpleDirectoryReader` 來選擇最佳檔案讀取器，透過檢查目錄中的檔案副檔名來判斷。

接下來，我們從 `SimpleDirectoryReader` 讀取到的 documents 的內容中產生區塊 (text subsequences)。`SentenceSplitter` 是一個文本分割器，它在分割文本為大小為 `chunk_size` 的區塊時，會保留句子邊界。

```
from llama_index.core import SimpleDirectoryReader
from llama_index.core.node_parser import SentenceSplitter


reader = SimpleDirectoryReader("./data/paul_graham")
documents = reader.load_data()


node_parser = SentenceSplitter(chunk_size=512, chunk_overlap=20)
nodes = node_parser.get_nodes_from_documents(documents)
```


## 6) 配置 `ObjectBoxVectorStore`

`ObjectBoxVectorStore` 可以使用以下選項進行初始化：

- `embedding_dim` (required)：vector DB 將儲存的嵌入的維度
- `distance_type`：從 `COSINE`、`DOT_PRODUCT`、`DOT_PRODUCT_NON_NORMALIZED` 和 `EUCLIDEAN` 中選擇
- `db_directory`：`.mdb` ObjectBox 資料庫檔案應建立的目錄路徑
- `clear_db`：如果存在於 `db_directory` 上，則刪除現有的資料庫檔案
- `do_log`：啟用來自 ObjectBox 整合的日誌記錄

```
from llama_index.vector_stores.objectbox import ObjectBoxVectorStore
from llama_index.core import StorageContext, VectorStoreIndex, Settings
from objectbox import VectorDistanceType


vector_store = ObjectBoxVectorStore(
    embedding_dim,
    distance_type=VectorDistanceType.COSINE,
    db_directory="obx_data",
    clear_db=False,
    do_log=True,
)


storage_context = StorageContext.from_defaults(vector_store=vector_store)


Settings.llm = gemini_llm
Settings.embed_model = hf_embedding


index = VectorStoreIndex(nodes=nodes, storage_context=storage_context)
```


## 7) 與 document 聊天

```
query_engine = index.as_query_engine()
response = query_engine.query("Who is Paul Graham?")
print(response)
```


## 選項：將 `ObjectBoxVectorStore` 配置為 retriever

一個 LlamaIndex [retriever](https://docs.llamaindex.ai/en/stable/module_guides/querying/retriever/) 負責根據查詢從 vector DB 中獲取相似的區塊。

```
retriever = index.as_retriever()
response = retriever.retrieve("What did the author do growing up?")


for node in response:
    print("Retrieved chunk text:\n", node.node.get_text())
    print("Retrieved chunk metadata:\n", node.node.get_metadata_str())
    print("\n\n\n")
```


## 選項：使用 `delete_nodes` 移除與單一查詢相關的區塊可以使用 `ObjectBoxVectorStore.delete_nodes` 方法，傳入包含 node ID 的清單作為參數，從 vector DB 中移除 chunks (nodes)。

```
response = retriever.retrieve("What did the author do growing up?")


node_ids = []
for node in response:
    node_ids.append(node.node_id)
print(f"Nodes to be removed: {node_ids}")


print(f"No. of vectors before deletion: {vector_store.count()}")
vector_store.delete_nodes(node_ids)
print(f"No. of vectors after deletion: {vector_store.count()}")
```

## 選項：從 vector DB 中移除單個 document

可以使用 `ObjectBoxVectorStore.delete` 方法，傳入 `id_` 作為參數，來移除與單個 document 相關的 chunks (nodes)。

```
document = documents[0]
print(f"Document to be deleted {document.id_}")


print(f"No. of vectors before deletion: {vector_store.count()}")
vector_store.delete(document.id_)
print(f"No. of vectors after document deletion: {vector_store.count()}")
```
