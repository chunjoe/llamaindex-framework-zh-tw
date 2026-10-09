---
title: "ChatGPT 插件整合"
---

**注意**：這是一個正在進行中的專案，請持續關注我們在這一方面的更多精彩更新！

## ChatGPT Retrieval Plugin 整合

[OpenAI ChatGPT Retrieval Plugin](https://github.com/openai/chatgpt-retrieval-plugin) 為任何 document 儲存系統提供了一個集中式的 API 規範，以便與 ChatGPT 互動。由於這可以部署在任何服務上，這意味著越來越多的 document 檢索服務將實作此規範；這讓它們不僅可以與 ChatGPT 互動，還可以與任何可能使用檢索服務的 LLM toolkit 互動。

LlamaIndex 為 ChatGPT Retrieval Plugin 提供多種整合方式。

### 將資料從 LlamaHub 載入到 ChatGPT Retrieval Plugin

ChatGPT Retrieval Plugin 定義了一個 `/upsert` endpoint，供使用者載入 documents。這為與 LlamaHub 進行自然整合提供了一個點，LlamaHub 提供來自各種 API 和 document 格式的超過 65 個資料載入器 (data loaders)。

以下是顯示如何將 document 從 LlamaHub 載入到 JSON 格式（`/upsert` 所期望的格式）的範例程式碼片段：

```
from llama_index.core import download_loader, Document
from typing import Dict, List
import json


# download loader, load documents
from llama_index.readers.web import SimpleWebPageReader


loader = SimpleWebPageReader(html_to_text=True)
url = "http://www.paulgraham.com/worked.html"
documents = loader.load_data(urls=[url])




# Convert LlamaIndex Documents to JSON format
def dump_docs_to_json(documents: List[Document], out_path: str) -> Dict:
    """Convert LlamaIndex Documents to JSON format and save it."""
    result_json = []
    for doc in documents:
        cur_dict = {
            "text": doc.get_text(),
            "id": doc.get_doc_id(),
            # NOTE: feel free to customize the other fields as you wish
            # fields taken from https://github.com/openai/chatgpt-retrieval-plugin/tree/main/scripts/process_json#usage
            # "source": ...,
            # "source_id": ...,
            # "url": url,
            # "created_at": ...,
            # "author": "Paul Graham",
        }
        result_json.append(cur_dict)


    json.dump(result_json, open(out_path, "w"))
```

如需更多詳情，請查看 [完整範例 notebook](https://github.com/jerryjliu/llama_index/blob/main/examples/chatgpt_plugin/ChatGPT_Retrieval_Plugin_Upload.ipynb)。

### ChatGPT Retrieval Plugin 資料載入器

ChatGPT Retrieval Plugin 的資料載入器 [可以在 LlamaHub 上存取](https://llamahub.ai/l/chatgpt_plugin)。

它讓您可以輕鬆地將任何實作了插件 API 的 docstore 中的資料載入到 LlamaIndex data structure 中。

範例程式碼：

```
from llama_index.readers.chatgpt_plugin import ChatGPTRetrievalPluginReader
import os


# load documents
bearer_token = os.getenv("BEARER_TOKEN")
reader = ChatGPTRetrievalPluginReader(
    endpoint_url="http://localhost:8000", bearer_token=bearer_token
)
documents = reader.load_data("What did the author do growing up?")


# build and query index
from llama_index.core import SummaryIndex


index = SummaryIndex.from_documents(documents)
# set Logging to DEBUG for more detailed outputs
query_engine = vector_index.as_query_engine(response_mode="compact")
response = query_engine.query(
    "Summarize the retrieved content and describe what the author did growing up",
)
```

如需更多詳情，請查看 [完整範例 notebook](https://github.com/jerryjliu/llama_index/blob/main/examples/chatgpt_plugin/ChatGPTRetrievalPluginReaderDemo.ipynb)。

### ChatGPT Retrieval Plugin Index

ChatGPT Retrieval Plugin Index 讓您可以輕鬆地建立一個向量索引 (vector index) 覆蓋任何 documents，其儲存由實作 ChatGPT endpoint 的 document store 支援。

注意：此索引是一個向量索引，允許 top-k 檢索。

範例程式碼：

```
from llama_index.core.indices.vector_store import ChatGPTRetrievalPluginIndex
from llama_index.core import SimpleDirectoryReader
import os


# load documents
documents = SimpleDirectoryReader("../paul_graham_essay/data").load_data()


# build index
bearer_token = os.getenv("BEARER_TOKEN")
# initialize without metadata filter
index = ChatGPTRetrievalPluginIndex(
    documents,
    endpoint_url="http://localhost:8000",
    bearer_token=bearer_token,
)


# query index
query_engine = vector_index.as_query_engine(
    similarity_top_k=3,
    response_mode="compact",
)
response = query_engine.query("What did the author do growing up?")
```

如需更多詳情，請查看 [完整範例 notebook](https://github.com/jerryjliu/llama_index/blob/main/examples/chatgpt_plugin/ChatGPTRetrievalPluginIndexDemo.ipynb)。