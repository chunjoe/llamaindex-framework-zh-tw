---
title: "使用模式"
---

## 開始使用

每個 data loader 都包含一個「Usage」區塊，顯示如何使用該 loader。使用每個 loader 的核心是 `download_loader` 函式，它會將 loader 檔案下載到一個模組中，您可以在應用程式中使用該模組。

範例用法：

```
from llama_index.core import VectorStoreIndex, download_loader


from llama_index.readers.google import GoogleDocsReader


gdoc_ids = ["1wf-y2pd9C878Oh-FmLH7Q_BQkljdm6TQal-c1pUfrec"]
loader = GoogleDocsReader()
documents = loader.load_data(document_ids=gdoc_ids)
index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine()
query_engine.query("Where did the author go to school?")
```
