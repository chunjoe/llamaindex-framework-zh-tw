---
title: "Documents / Nodes"
---

## 概念

Document 和 Node 物件是 LlamaIndex 中的核心抽象。

**Document** 是一個泛型的容器，用於任何資料來源——例如 PDF、API 的輸出，或從資料庫檢索的資料。它們可以手動建構，或透過我們的 data loaders 自動建立。預設情況下，Document 會儲存文字以及一些其他屬性。這些屬性列在下方：

- `metadata` - 一個可以附加到文字上的註釋字典。
- `relationships` - 一個包含與其他 Documents/Nodes 之間關係的字典。

*注意*：我們對允許 Documents 儲存圖片提供了 beta 支援，並正在積極改進其多模態能力。

**Node** 代表源 Document 的一個「chunk」，無論它是文字片段、圖片還是其他類型。與 Documents 類似，它們包含元資料以及與其他 nodes 之間的關係資訊。

Nodes 是 LlamaIndex 中的一等公民。您可以直接定義 Nodes 及其所有屬性。您也可以透過我們的 `NodeParser` 類別將源 Documents 解析成 Nodes。預設情況下，所有從 Document 衍生出的 Node 將繼承該 Document 的相同元資料（例如，Document 中的 "file\_name" 欄位會傳播到每個 Node）。

## 使用模式

以下是一些簡單的程式碼片段，用於開始使用 Documents 和 Nodes。

#### Documents

```
from llama_index.core import Document, VectorStoreIndex


text_list = [text1, text2, ...]
documents = [Document(text=t) for t in text_list]


# build index
index = VectorStoreIndex.from_documents(documents)
```

#### Nodes

```
from llama_index.core.node_parser import SentenceSplitter


# load documents
...


# parse nodes
parser = SentenceSplitter()
nodes = parser.get_nodes_from_documents(documents)


# build index
index = VectorStoreIndex(nodes)
```

### Document/Node 使用

請查看我們的深度指南，了解更多關於如何使用 Documents/Nodes 的詳細資訊。

- [Using Documents](/python/framework/module_guides/loading/documents_and_nodes/usage_documents/)
- [Using Nodes](/python/framework/module_guides/loading/documents_and_nodes/usage_nodes/)
- [Ingestion Pipeline](/python/framework/module_guides/loading/ingestion_pipeline/)