---
title: "Pathway Retriever"
---

> [Pathway](https://pathway.com/) 是開放式資料處理框架，讓您能輕鬆建立資料轉換管線與機器學習應用程式，並連接即時資料來源與持續變動的資料。

這份筆記示範如何透過 `LlamaIndex` 使用即時資料索引管線。您可以在 LLM 應用程式中使用提供的 `PathwayRetriever` 查詢管線結果。Pathway 會在資料變更時於背景更新索引，讓回答隨時保持最新。

本筆記會使用[公開的文件處理示範管線](https://pathway.com/solutions/ai-pipelines#try-it-out)，這個管線會：

1. 監控多個雲端資料來源的變更。
2. 為資料建立向量索引。

若要使用自己的文件處理管線，請參閱[代管服務](https://pathway.com/solutions/ai-pipelines)，或依照本筆記[自行建置](https://pathway.com/developers/user-guide/llm-xpack/vectorstore_pipeline/)。

接著使用 `llama_index.retrievers.pathway.PathwayRetriever` 檢索器連接索引；它實作了 `retrieve` 介面。

本文件介紹的基本管線，能讓您輕鬆為雲端位置中的檔案建立簡易索引。Pathway 也提供建置即時資料管線與應用程式所需的完整功能，包括類似 SQL 的表格操作（例如 groupby-reductions）、合併不同資料來源、依時間分組與視窗化，以及多種連接器。

如需 Pathway 資料匯入管線與向量儲存區的詳細資訊，請參閱[向量儲存管線](https://pathway.com/developers/showcases/vectorstore_pipeline)。

## 前置需求

若要使用 `PathwayRetrievier`，必須先安裝 `llama-index-retrievers-pathway` 套件。

```
!pip install llama-index-retrievers-pathway
```

## 在 llama-index 中建立檢索器

若要建立並設定 `PathwayRetriever`，請提供文件索引管線的 `url`，或其 `host` 與 `port`。以下範例使用公開的[示範管線](https://pathway.com/solutions/ai-pipelines#try-it-out)，其 REST API 位於 `https://demo-document-indexing.pathway.stream`。此示範會從 [Google Drive](https://drive.google.com/drive/u/0/folders/1cULDv2OaViJBmOfG5WB0oWcgayNrGtVs) 和 [Sharepoint](https://navalgo.sharepoint.com/sites/ConnectorSandbox/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FConnectorSandbox%2FShared%20Documents%2FIndexerSandbox\&p=true\&ga=1) 匯入文件，並維護供檢索使用的索引。

```
from llama_index.retrievers.pathway import PathwayRetriever


retriever = PathwayRetriever(
    url="https://demo-document-indexing.pathway.stream"
)
retriever.retrieve(str_or_query_bundle="what is pathway")
```

**換您試試！** 您可以[取得自己的管線](https://pathway.com/solutions/ai-pipelines)，或將[新文件](https://chat-realtime-sharepoint-gdrive.demo.pathway.com/)上傳到示範管線，再重新執行查詢。

## 在 Query Engine 中使用

```
from llama_index.core.query_engine import RetrieverQueryEngine


query_engine = RetrieverQueryEngine.from_args(
    retriever,
)
```

```
response = query_engine.query("Tell me about Pathway")
print(str(response))
```

## 建置自己的資料處理管線

### 前置需求

安裝 `pathway` 套件，接著下載範例資料。

```
%pip install pathway
%pip install llama-index-embeddings-openai
```

```
!mkdir -p 'data/'
!wget 'https://gist.githubusercontent.com/janchorowski/dd22a293f3d99d1b726eedc7d46d2fc0/raw/pathway_readme.md' -O 'data/pathway_readme.md'
```

### 定義由 Pathway 追蹤的資料來源

Pathway 可以同時監聽多種資料來源的變更，例如本機檔案、S3 資料夾、雲端儲存空間，以及各種資料串流。

詳細資訊請參閱 [pathway-io](https://pathway.com/developers/api-docs/pathway-io)。

```
import pathway as pw


data_sources = []
data_sources.append(
    pw.io.fs.read(
        "./data",
        format="binary",
        mode="streaming",
        with_metadata=True,
    )  # This creates a `pathway` connector that tracks
    # all the files in the ./data directory
)


# This creates a connector that tracks files in Google drive.
# please follow the instructions at https://pathway.com/developers/tutorials/connectors/gdrive-connector/ to get credentials
# data_sources.append(
#     pw.io.gdrive.read(object_id="17H4YpBOAKQzEJ93xmC2z170l0bP2npMy", service_user_credentials_file="credentials.json", with_metadata=True))
```

### 建立文件索引管線

接著建立文件索引管線。`transformations` 應為一個 `TransformComponent` 清單，並以 `Embedding` 轉換結尾。

本例先使用 `TokenTextSplitter` 切分文字，再透過 `OpenAIEmbedding` 產生嵌入。

```
from pathway.xpacks.llm.vector_store import VectorStoreServer
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core.node_parser import TokenTextSplitter


embed_model = OpenAIEmbedding(embed_batch_size=10)


transformations_example = [
    TokenTextSplitter(
        chunk_size=150,
        chunk_overlap=10,
        separator=" ",
    ),
    embed_model,
]


processing_pipeline = VectorStoreServer.from_llamaindex_components(
    *data_sources,
    transformations=transformations_example,
)


# Define the Host and port that Pathway will be on
PATHWAY_HOST = "127.0.0.1"
PATHWAY_PORT = 8754


# `threaded` runs pathway in detached mode, we have to set it to False when running from terminal or container
# for more information on `with_cache` check out https://pathway.com/developers/api-docs/persistence-api
processing_pipeline.run_server(
    host=PATHWAY_HOST, port=PATHWAY_PORT, with_cache=False, threaded=True
)
```

### 將檢索器連接到自訂管線

```
from llama_index.retrievers.pathway import PathwayRetriever


retriever = PathwayRetriever(host=PATHWAY_HOST, port=PATHWAY_PORT)
retriever.retrieve(str_or_query_bundle="what is pathway")
```
