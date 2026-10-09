---
title: "Node 解析用法模式"
---

Node 解析器是一種簡單的抽象，它接收一個 documents 的列表，並將其切分成 `Node` 物件，使得每個 node 都是父級 document 的特定區塊。當一個 document 被分解成 nodes 時，它的所有屬性都會繼承給子 nodes（即 `metadata`、text 和 metadata templates 等）。您可以在 [這裡](/python/framework/module_guides/loading/documents_and_nodes/) 閱讀更多關於 `Node` 和 `Document` 屬性的資訊。

## 開始使用

### 單獨使用

Node 解析器可以單獨使用：

```
from llama_index.core import Document
from llama_index.core.node_parser import SentenceSplitter


node_parser = SentenceSplitter(chunk_size=1024, chunk_overlap=20)


nodes = node_parser.get_nodes_from_documents(
    [Document(text="long text")], show_progress=False
)
```


### 轉換使用

Node 解析器可以包含在任何具有 ingestion pipeline 的轉換集中。

```
from llama_index.core import SimpleDirectoryReader
from llama_index.core.ingestion import IngestionPipeline
from llama_index.core.node_parser import TokenTextSplitter


documents = SimpleDirectoryReader("./data").load_data()


pipeline = IngestionPipeline(transformations=[TokenTextSplitter(), ...])


nodes = pipeline.run(documents=documents)
```


### 索引使用

或者設定在 `transformations` 或全局 settings 中，以便在使用 `.from_documents()` 建構索引時自動使用：

```
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
from llama_index.core.node_parser import SentenceSplitter


documents = SimpleDirectoryReader("./data").load_data()


# global
from llama_index.core import Settings


Settings.text_splitter = SentenceSplitter(chunk_size=1024, chunk_overlap=20)


# per-index
index = VectorStoreIndex.from_documents(
    documents,
    transformations=[SentenceSplitter(chunk_size=1024, chunk_overlap=20)],
)
```


## 模組

請參閱完整的 [modules guide](/python/framework/module_guides/loading/node_parsers/modules/)。