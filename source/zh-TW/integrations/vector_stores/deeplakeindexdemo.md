---
title: "Deep Lake Vector Store 快速入門"
---

可以使用 pip 安裝 Deep Lake。

```
%pip install llama-index-vector-stores-deeplake
```

```
!pip install llama-index
!pip install deeplake
```

接下來，我們匯入所需的模組並設定必要的環境變數：

```
import os
import textwrap


from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Document
from llama_index.vector_stores.deeplake import DeepLakeVectorStore


os.environ["OPENAI_API_KEY"] = "sk-********************************"
os.environ["ACTIVELOOP_TOKEN"] = "********************************"
```

我們將將 Paul Graham 的一篇文章嵌入並儲存到本地的 Deep Lake Vector Store 中。首先，我們將資料下載到名為 `data/paul_graham` 的目錄中。

```
import urllib.request


urllib.request.urlretrieve(
    "https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt",
    "data/paul_graham/paul_graham_essay.txt",
)
```

現在我們可以從來源資料檔案中建立 documents。

```
# load documents
documents = SimpleDirectoryReader("./data/paul_graham/").load_data()
print(
    "Document ID:",
    documents[0].doc_id,
    "Document Hash:",
    documents[0].hash,
)
```

```
Document ID: a98b6686-e666-41a9-a0bc-b79f0d666bde Document Hash: beaa54b3e9cea641e91e6975d2207af4f4200f4b2d629725d688f272372ce5bb
```

最後，讓我們建立 Deep Lake Vector Store 並用資料填充它。我們使用預設的 tensor configuration，這會建立具有 `text (str)`、`metadata(json)`、`id (str, auto-populated)`、`embedding (float32)` 的 tensors。[在此瞭解 tensor 的客製化](https://docs.activeloop.ai/example-code/getting-started/vector-store/step-4-customizing-vector-stores)。

```
from llama_index.core import StorageContext


dataset_path = "./dataset/paul_graham"


# Create an index over the documents
vector_store = DeepLakeVectorStore(dataset_path=dataset_path, overwrite=True)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

```
Uploading data to deeplake dataset.




100%|██████████| 22/22 [00:00<00:00, 684.80it/s]


Dataset(path='./dataset/paul_graham', tensors=['text', 'metadata', 'embedding', 'id'])


  tensor      htype      shape      dtype  compression
  -------    -------    -------    -------  -------
   text       text      (22, 1)      str     None
 metadata     json      (22, 1)      str     None
 embedding  embedding  (22, 1536)  float32   None
    id        text      (22, 1)      str     None
```

## 執行 Vector Search

Deep Lake 提供高度靈活的 vector search 和 hybrid search 選項 [在此教程中詳細討論](https://docs.activeloop.ai/example-code/tutorials/vector-store/vector-search-options)。在此 Quickstart 中，我們使用預設選項展示一個簡單的範例。

```
query_engine = index.as_query_engine()
response = query_engine.query(
    "What did the author learn?",
)
```

```
print(textwrap.fill(str(response), 100))
```

```
  The author learned that working on things that are not prestigious can be a good thing, as it can
lead to discovering something real and avoiding the wrong track. The author also learned that
ignorance can be beneficial, as it can lead to discovering something new and unexpected. The author
also learned the importance of working hard, even at the parts of the job they don't like, in order
to set an example for others. The author also learned the value of unsolicited advice, as it can be
beneficial in unexpected ways, such as when Robert Morris suggested that the author should make sure
Y Combinator wasn't the last cool thing they did.
```

```
response = query_engine.query("What was a hard moment for the author?")
```

```
print(textwrap.fill(str(response), 100))
```

```
The author experienced a hard moment when one of his programs on the IBM 1401 computer did not
terminate. This was a social as well as a technical error, as the data center manager's expression
made clear.
```

```
query_engine = index.as_query_engine()
response = query_engine.query("What was a hard moment for the author?")
print(textwrap.fill(str(response), 100))
```

```
The author experienced a hard moment when one of his programs on the IBM 1401 computer did not
terminate. This was a social as well as a technical error, as the data center manager's expression
made clear.
```

## 從資料庫中刪除項目

要找到要刪除的 document 的 id，您可以直接查詢底層的 deeplake dataset。

```
import deeplake


ds = deeplake.load(dataset_path)


idx = ds.id[0].numpy().tolist()
idx
```

```
./dataset/paul_graham loaded successfully.














['42f8220e-673d-4c65-884d-5a48a1a15b03']
```

```
index.delete(idx[0])
```
