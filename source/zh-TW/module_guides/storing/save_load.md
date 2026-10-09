---
title: "持續與載入資料"
---

## 持久化資料

預設情況下，LlamaIndex 將資料儲存在記憶體中，如果需要，可以明確地將其持久化：

```
storage_context.persist(persist_dir="<persist_dir>")
```

這會將資料持久化到磁碟，使用指定的 `persist_dir`（或預設的 `./storage`）。

可以將多個索引持久化並從同一目錄載入，前提是您需追蹤 index ID 以進行載入。

使用者也可以設定替代的儲存後端（例如 `MongoDB`），使其預設會持久化資料。在此情況下，呼叫 `storage_context.persist()` 將不會有任何效果。

## 載入資料

要載入資料，使用者只需使用相同的配置重新建立儲存上下文（例如傳入相同的 `persist_dir` 或 vector store client）。

```
storage_context = StorageContext.from_defaults(
    docstore=SimpleDocumentStore.from_persist_dir(persist_dir="<persist_dir>"),
    vector_store=SimpleVectorStore.from_persist_dir(
        persist_dir="<persist_dir>"
    ),
    index_store=SimpleIndexStore.from_persist_dir(persist_dir="<persist_dir>"),
)
```

然後我們可以使用以下便利函式從 `StorageContext` 載入特定的索引。

```
from llama_index.core import (
    load_index_from_storage,
    load_indices_from_storage,
    load_graph_from_storage,
)


# load a single index
# need to specify index_id if multiple indexes are persisted to the same directory
index = load_index_from_storage(storage_context, index_id="<index_id>")


# don't need to specify index_id if there's only one index in storage context
index = load_index_from_storage(storage_context)


# load multiple indices
indices = load_indices_from_storage(storage_context)  # loads all indices
indices = load_indices_from_storage(
    storage_context, index_ids=[index_id1, ...]
)  # loads specific indices


# load composable graph
graph = load_graph_from_storage(
    storage_context, root_id="<root_id>"
)  # loads graph with the specified root_id
```

## 使用遠端後端

預設情況下，LlamaIndex 使用本地檔案系統來載入和儲存檔案。然而，您可以透過傳入一個 `fsspec.AbstractFileSystem` 物件來覆蓋此設定。

以下是一個簡單的範例，實例化一個 vector store：

```
import dotenv
import s3fs
import os


dotenv.load_dotenv("../../../.env")


# load documents
documents = SimpleDirectoryReader(
    "../../../examples/paul_graham_essay/data/"
).load_data()
print(len(documents))
index = VectorStoreIndex.from_documents(documents)
```

此時一切都相同了。現在——讓我們實例化一個 S3 filesystem 並從那裡儲存/載入。

```
# set up s3fs
AWS_KEY = os.environ["AWS_ACCESS_KEY_ID"]
AWS_SECRET = os.environ["AWS_SECRET_ACCESS_KEY"]
R2_ACCOUNT_ID = os.environ["R2_ACCOUNT_ID"]


assert AWS_KEY is not None and AWS_KEY != ""


s3 = s3fs.S3FileSystem(
    key=AWS_KEY,
    secret=AWS_SECRET,
    endpoint_url=f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
    s3_additional_kwargs={"ACL": "public-read"},
)


# If you're using 2+ indexes with the same StorageContext,
# run this to save the index to remote blob storage
index.set_index_id("vector_index")


# persist index to s3
s3_bucket_name = "llama-index/storage_demo"  # {bucket_name}/{index_name}
index.storage_context.persist(persist_dir=s3_bucket_name, fs=s3)


# load index from s3
index_from_s3 = load_index_from_storage(
    StorageContext.from_defaults(persist_dir=s3_bucket_name, fs=s3),
    index_id="vector_index",
)
```

預設情況下，如果您沒有傳入 filesystem，我們將假設是本地檔案系統。