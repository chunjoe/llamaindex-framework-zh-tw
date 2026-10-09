---
title: "載入資料（Ingestion）"
---

在您選定的 LLM 能使用資料之前，需要先處理並載入資料。這個流程類似 ML 領域的資料清理／特徵工程管線，也類似傳統資料處理中的 ETL 管線。

資料匯入流程通常分為三個主要階段：

1. 載入資料
2. 轉換資料
3. 建立索引並儲存資料

索引與儲存會在後續的[索引](/python/framework/understanding/rag/indexing/)與[儲存](/python/framework/understanding/rag/storing/)章節中介紹。本指南主要說明資料載入器與轉換流程。

## 資料載入器

在選定的 LLM 能使用資料之前，必須先載入資料。LlamaIndex 透過資料連接器完成這項工作；資料連接器也稱為 `Reader`。它們會從不同來源匯入資料，並將資料整理成 `Document` 物件。`Document` 是一組資料（目前支援文字，未來也會支援圖片和音訊），並包含描述這些資料的中繼資料。

### 使用 SimpleDirectoryReader 載入資料

最容易上手的資料載入器是 SimpleDirectoryReader，它會將指定目錄中的每個檔案轉成 Document 物件。這是 LlamaIndex 內建的讀取器，可讀取多種格式，包括 Markdown、PDF、Word 文件、PowerPoint 簡報、圖片、音訊和影片。

```
from llama_index.core import SimpleDirectoryReader


documents = SimpleDirectoryReader("./data").load_data()
```

### 使用 Reader 整合套件

資料來源種類繁多，不可能全部內建在 LlamaIndex 中；您可以按需安裝個別套件。請參閱[資料連接器](/python/framework/understanding/rag/loading/llamahub/)了解如何尋找合適的套件。

本例使用 [DatabaseReader](https://github.com/run-llama/llama_index/tree/main/llama-index-integrations/readers/llama-index-readers-database) 連接器（`pip install llama-index-readers-database`）。它會對 SQL 資料庫執行查詢，並將結果中的每一列回傳為一個 `Document`：

```
from llama_index.readers.database import DatabaseReader


reader = DatabaseReader(
    scheme=os.getenv("DB_SCHEME"),
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASS"),
    dbname=os.getenv("DB_NAME"),
)


query = "SELECT * FROM users"
documents = reader.load_data(query=query)
```

您可以從[數百種連接器](https://github.com/run-llama/llama_index/tree/main/llama-index-integrations/readers)中挑選！

### 直接建立 Document

除了使用資料載入器，也可以直接建立 Document。

```
from llama_index.core import Document


doc = Document(text="text")
```

## 資料轉換

載入資料後，還需要先進行處理與轉換，才能將資料存入儲存系統。轉換步驟包括切分資料、擷取中繼資料，以及為每個區塊產生嵌入向量。這些步驟能確保 LLM 可以有效檢索並運用資料。

資料轉換的輸入與輸出都是 `Node` 物件（`Document` 是 `Node` 的子類別）。轉換步驟也可以串接，並調整執行順序。

我們提供高階與低階 API，讓您轉換文件。

### 高階資料轉換 API

索引提供 `.from_documents()` 方法，可接收 Document 物件陣列，並自動解析及切分文件。不過，有時您可能需要更精確地控制文件的切分方式。

```
from llama_index.core import VectorStoreIndex


vector_index = VectorStoreIndex.from_documents(documents)
vector_index.as_query_engine()
```

在底層，這個方法會將 Document 切分成 Node 物件。Node 和 Document 類似，都包含文字與中繼資料；不同之處在於 Node 會保留與其上層 Document 的關聯。

若要自訂核心元件（例如文字切分器），可以透過此抽象層傳入自訂的 `transformations` 清單，或將設定套用至全域的 `Settings`：

```
from llama_index.core.node_parser import SentenceSplitter


text_splitter = SentenceSplitter(chunk_size=512, chunk_overlap=10)


# global
from llama_index.core import Settings


Settings.text_splitter = text_splitter


# per-index
index = VectorStoreIndex.from_documents(
    documents, transformations=[text_splitter]
)
```

### 低階資料轉換 API

您也可以明確定義各個步驟。

做法包括將轉換模組（例如文字切分器、中繼資料擷取器等）當作獨立元件使用，或在宣告式的[轉換管線介面](/python/framework/module_guides/loading/ingestion_pipeline/)中組合這些模組。

以下逐步說明各項操作。

#### 將文件切分為 Node

處理文件的重要步驟之一，是將文件切分成「區塊」（Node 物件）。核心概念是把資料整理成適當大小的片段，方便檢索或提供給 LLM 使用。

LlamaIndex 支援多種[文字切分器](/python/framework/module_guides/loading/node_parsers/modules/)，涵蓋依段落、句子或 token 切分的方式，也包含針對 HTML、JSON 等檔案格式的切分器。

這些切分器可以[單獨使用，也能納入資料匯入管線](/python/framework/module_guides/loading/node_parsers/)。

```
from llama_index.core import SimpleDirectoryReader
from llama_index.core.ingestion import IngestionPipeline
from llama_index.core.node_parser import TokenTextSplitter


documents = SimpleDirectoryReader("./data").load_data()


pipeline = IngestionPipeline(transformations=[TokenTextSplitter(), ...])


nodes = pipeline.run(documents=documents)
```

### 加入中繼資料

您也可以為文件和節點加入中繼資料，方式包括手動新增，或使用[自動中繼資料擷取器](/python/framework/module_guides/loading/documents_and_nodes/usage_metadata_extractor/)。

以下指南分別說明：1）[如何自訂 Document](/python/framework/module_guides/loading/documents_and_nodes/usage_documents/)，以及 2）[如何自訂 Node](/python/framework/module_guides/loading/documents_and_nodes/usage_nodes/)。

```
document = Document(
    text="text",
    metadata={"filename": "<doc_file_name>", "category": "<category>"},
)
```

### 加入嵌入向量

若要將節點加入向量索引，必須先為它產生嵌入向量。詳情請參閱[資料匯入管線](/python/framework/module_guides/loading/ingestion_pipeline/)或[嵌入向量指南](/python/framework/module_guides/models/embeddings/)。

### 直接建立並傳入 Node

您也可以直接建立 Node，並將 Node 清單傳給索引器：

```
from llama_index.core.schema import TextNode


node1 = TextNode(text="<text_chunk>", id_="<node_id>")
node2 = TextNode(text="<text_chunk>", id_="<node_id>")


index = VectorStoreIndex([node1, node2])
```
