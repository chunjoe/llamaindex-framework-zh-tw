---
title: "從 LlamaParse 載入"
---

[LlamaParse](https://developers.llamaindex.ai/llamaparse/index.md)，由 LlamaIndex 團隊（先前稱為 LlamaCloud）提供的託管型 document 平台，可以在完全託管的環境中解析、建立索引和查詢您的資料。其 Index product 連接您的資料來源，保持索引同步並提供檢索，而 framework 透過 `LlamaCloudIndex` 與其第一版本進行通訊。

此整合針對 Index 的較舊版本

`LlamaCloudIndex` 包含在 `llama-cloud-services` 中，該套件已棄用且不再更新，它與 Index 的第一版本進行通訊。安裝它會鎖定 `llama-cloud` 的舊版本，因此它無法與當前的 `llama-cloud` SDK 共享環境。對於新專案，請透過 `llama-cloud` SDK 使用 [Index v2](https://developers.llamaindex.ai/llamaparse/cloud-index-v2/getting_started/index.md)。

## 使用 LlamaParse from LlamaIndex

您可以使用 Index 連接到您的資料儲存，並自動建立索引。一旦建立索引，您只需幾行程式碼即可使用它：

終端機視窗

```
pip install llama-index llama-cloud-services
```

```
import os
from llama_cloud_services import LlamaCloudIndex


os.environ["LLAMA_CLOUD_API_KEY"] = "llx-..."


index = LlamaCloudIndex("my_first_index", project_name="Default")
query_engine = index.as_query_engine()
answer = query_engine.query("Example query")
```


也可以透過程式方式將 documents 載入到索引中；請參閱 [該版本 Index 的文件](https://developers.llamaindex.ai/llamaparse/deprecated/cloud-index/getting_started/index.md) 和 [`LlamaCloudIndex` 指南](/python/framework/module_guides/indexing/llama_cloud_index/) 以獲取詳細資訊。