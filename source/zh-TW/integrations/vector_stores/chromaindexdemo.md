---
title: "Chroma"
---

> [Chroma](https://docs.trychroma.com/getting-started) 是一個專注於開發者生產力和幸福感的 AI-native open-source vector database。Chroma 依 Apache 2.0 授權。

[![Discord](/assets/9dc9f3bd8655.svg) ](https://discord.gg/MMeYNTmh3x)   [![License](/assets/21cbf7edf359.svg) ](https://github.com/chroma-core/chroma/blob/master/LICENSE)   ![Integration Tests](/assets/b62ebff7b804.svg)

- [Website](https://www.trychroma.com/)
- [Documentation](https://docs.trychroma.com/)
- [Twitter](https://twitter.com/trychroma)
- [Discord](https://discord.gg/MMeYNTmh3x)

Chroma 是完全型別化 (fully-typed)、完全測試 (fully-tested) 和完全文件化 (fully-documented) 的。

使用以下方式安裝 Chroma：

終端機視窗

```
pip install chromadb
```

Chroma 以各種模式運行。請參閱下方 LlamaIndex 中每個整合的範例。

- `in-memory` - 在 python script 或 jupyter notebook 中
- `in-memory with persistence` - 在 script 或 notebook 中並將資料儲存/載入到 disk
- `in a docker container` - 作為一個伺服器運行您的本地機器或在雲端

像任何其他 database 一樣，您可以：

- `.add`
- `.get`
- `.update`
- `.upsert`
- `.delete`
- `.peek`
- 以及 `.query` 執行 similarity search。

在 [文件](https://docs.trychroma.com/reference) 查看完整文件。

## 基本範例

在這個基本範例中，我們取 Paul Graham 的文章，將其分割成 chunks，使用 open-source embedding model 進行 embedding，將其載入到 Chroma 中，然後進行查詢。

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-vector-stores-chroma
%pip install llama-index-embeddings-huggingface
```

```
!pip install llama-index
```

#### 建立一個 Chroma Index

```
# !pip install llama-index chromadb --quiet
# !pip install chromadb
# !pip install sentence-transformers
# !pip install pydantic==1.10.11
```

```
# import
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.core import StorageContext
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from IPython.display import Markdown, display
import chromadb
```

```
# set up OpenAI
import os
import getpass


os.environ["OPENAI_API_KEY"] = getpass.getpass("OpenAI API Key:")
import openai


openai.api_key = os.environ["OPENAI_API_KEY"]
```

下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

```
# create client and a new collection
chroma_client = chromadb.EphemeralClient()
chroma_collection = chroma_client.create_collection("quickstart")


# define embedding function
embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-base-en-v1.5")


# load documents
documents = SimpleDirectoryReader("./data/paul_graham/").load_data()


# set up ChromaVectorStore and load in data
vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context, embed_model=embed_model
)


# Query Data
query_engine = index.as_query_engine()
response = query_engine.query("What did the author do growing up?")
display(Markdown(f"<b>{response}</b>"))
```

```
/Users/loganmarkewich/llama_index/llama-index/lib/python3.9/site-packages/tqdm/auto.py:21: TqdmWarning: IProgress not found. Please update jupyter and ipywidgets. See https://ipywidgets.readthedocs.io/en/stable/user_install.html
  from .autonotebook import tqdm as notebook_tqdm
/Users/loganmarkewich/llama_index/llama-index/lib/python3.9/site-packages/bitsandbytes/cextension.py:34: UserWarning: The installed version of bitsandbytes was compiled without GPU support. 8-bit optimizers, 8-bit multiplication, and GPU quantization are unavailable.
  warn("The installed version of bitsandbytes was compiled without GPU support. "




'NoneType' object has no attribute 'cadam32bit_grad_fp32'
```

**作者在成長過程中就從事寫作和編程。他們寫短篇故事，並嘗試在 IBM 1401 電腦上編寫程式。後來，他們獲得了一台微型電腦，開始更廣泛地編程遊戲和文字處理器。**

## 基本範例（包含儲存到 disk）

擴展前一個範例，如果您想儲存到 disk，只需初始化 Chroma client 並傳遞您希望儲存資料的目錄。

`Caution`: Chroma 會盡力自動將資料儲存到 disk，然而多個記憶體中的 client 可能會互相干擾。作為最佳實踐，在任何給定時間點，每個路徑只應有一個 client 運行。

```
# save to disk


db = chromadb.PersistentClient(path="./chroma_db")
chroma_collection = db.get_or_create_collection("quickstart")
vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
storage_context = StorageContext.from_defaults(vector_store=vector_store)


index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context, embed_model=embed_model
)


# load from disk
db2 = chromadb.PersistentClient(path="./chroma_db")
chroma_collection = db2.get_or_create_collection("quickstart")
vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
index = VectorStoreIndex.from_vector_store(
    vector_store,
    embed_model=embed_model,
)


# Query Data from the persisted index
query_engine = index.as_query_engine()
response = query_engine.query("What did the author do growing up?")
display(Markdown(f"<b>{response}</b>"))
```

**作者在成長過程中就從事寫作和編程。他們寫短篇故事，並嘗試在 IBM 1401 電腦上編寫程式。後來，他們獲得了一台微型電腦，開始編程遊戲和文字處理器。**

## 基本範例（使用 Docker Container）

您也可以在一個 Docker container 中單獨運行 Chroma Server，建立一個 Client 連接到它，然後將其傳遞給 LlamaIndex。

以下是如何複製、建置和運行 Docker Image：

```
git clone git@github.com:chroma-core/chroma.git
docker-compose up -d --build
```

```
# create the chroma client and add our data
import chromadb


remote_db = chromadb.HttpClient()
chroma_collection = remote_db.get_or_create_collection("quickstart")
vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
storage_context = StorageContext.from_defaults(vector_store=vector_store)


index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context, embed_model=embed_model
)
```

```
# Query Data from the Chroma Docker index
query_engine = index.as_query_engine()
response = query_engine.query("What did the author do growing up?")
display(Markdown(f"<b>{response}</b>"))
```

**在成長過程中，作者寫了短篇故事，在 IBM 1401 上編程，並在 TRS-80 微型電腦上編寫程式。他還在哈佛上上了繪畫課程，並擔任畫家的事實上的工作室助理。他也試圖創立一家公司將藝術畫廊放到網路上，並編寫軟體來建立線上商店。**

## 更新和刪除

在建構實際應用程式的過程中，您希望超越新增資料，還希望更新和刪除資料。

Chroma 允許使用者提供 `ids` 來簡化此處的簿記。`ids` 可以是檔案名稱，或像 `filename_paragraphNumber` 這樣的組合，等等。

以下是一個基本範例，展示如何執行各種操作：

```
doc_to_update = chroma_collection.get(limit=1)
doc_to_update["metadatas"][0] = {
    **doc_to_update["metadatas"][0],
    **{"author": "Paul Graham"},
}
chroma_collection.update(
    ids=[doc_to_update["ids"][0]], metadatas=[doc_to_update["metadatas"][0]]
)
updated_doc = chroma_collection.get(limit=1)
print(updated_doc["metadatas"][0])


# delete the last document
print("count before", chroma_collection.count())
chroma_collection.delete(ids=[doc_to_update["ids"][0]])
print("count after", chroma_collection.count())
```

```
{'_node_content': '{"id_": "be08c8bc-f43e-4a71-ba64-e525921a8319", "embedding": null, "metadata": {}, "excluded_embed_metadata_keys": [], "excluded_llm_metadata_keys": [], "relationships": {"1": {"node_id": "2cbecdbb-0840-48b2-8151-00119da0995b", "node_type": null, "metadata": {}, "hash": "4c702b4df575421e1d1af4b1fd50511b226e0c9863dbfffeccb8b689b8448f35"}, "3": {"node_id": "6a75604a-fa76-4193-8f52-c72a7b18b154", "node_type": null, "metadata": {}, "hash": "d6c408ee1fbca650fb669214e6f32ffe363b658201d31c204e85a72edb71772f"}}, "hash": "b4d0b960aa09e693f9dc0d50ef46a3d0bf5a8fb3ac9f3e4bcf438e326d17e0d8", "text": "", "start_char_idx": 0, "end_char_idx": 4050, "text_template": "{metadata_str}\\n\\n{content}", "metadata_template": "{key}: {value}", "metadata_seperator": "\\n"}', 'author': 'Paul Graham', 'doc_id': '2cbecdbb-0840-48b2-8151-00119da0995b', 'document_id': '2cbecdbb-0840-48b2-8151-00119da0995b', 'ref_doc_id': '2cbecdbb-0840-48b2-8151-00119da0995b'}
count before 20
count after 19
```
