---
title: "定義與自訂 Documents"
---

## 定義 Documents

Documents 可以透過 data loaders 自動建立，也可以手動建構。

預設情況下，我們所有的 [data loaders](/python/framework/module_guides/loading/connector/) 透過 `load_data` 函式回傳 `Document` 物件。

```
from llama_index.core import SimpleDirectoryReader


documents = SimpleDirectoryReader("./data").load_data()
```

您也可以選擇手動建構 documents。LlamaIndex 暴露了 `Document` struct。

```
from llama_index.core import Document


text_list = [text1, text2, ...]
documents = [Document(text=t) for t in text_list]
```

為了加快原型設計和開發，您也可以使用一些預設文字快速建立 document：

```
document = Document.example()
```

## 自訂 Documents

本節涵蓋了自訂 `Document` 物件的各種方法。由於 `Document` 物件是我們 `TextNode` 物件的子類別，所有這些 settings 和細節也適用於 `TextNode` 物件類別。

### Metadata

Documents 也提供了包含有用 metadata 的機會。在每個 document 上使用 `metadata` dictionary，可以加入額外的資訊來幫助提示回應並追蹤查詢回應的來源。這些資訊可以是任何內容，例如檔名或類別。如果您正在與 vector database 整合，請注意，某些 vector database 要求鍵必須是字串，值必須是扁平的（即 `str`、`float` 或 `int`）。

每個 document 的 `metadata` dictionary 中設定的任何資訊都會顯示在從 document 建立的每個來源 node 的 `metadata` 中。此外，這些資訊會包含在 nodes 中，使索引能夠在查詢和回應中使用它。預設情況下，metadata 會注入到用於 embedding 和 LLM model 呼叫的文本中。

設定此 dictionary 有幾種方法：

1. 在 document constructor 中：

```
document = Document(
    text="text",
    metadata={"filename": "<doc_file_name>", "category": "<category>"},
)
```

2. 在 document 建立後：

```
document.metadata = {"filename": "<doc_file_name>"}
```

3. 使用 `SimpleDirectoryReader` 和 `file_metadata` hook 自動設定檔名。這會自動在每個 document 上執行 hook 以設定 `metadata` 欄位：

```
from llama_index.core import SimpleDirectoryReader


filename_fn = lambda filename: {"file_name": filename}


# automatically sets the metadata of each document according to filename_fn
documents = SimpleDirectoryReader(
    "./data", file_metadata=filename_fn
).load_data()
```

### 自訂 id

如 [Document Management](/python/framework/module_guides/indexing/document_management/) 節所述，`doc_id` 用於啟用索引中 documents 的有效刷新。在使用 `SimpleDirectoryReader` 時，您可以自動設定 doc `doc_id` 為每個 document 的完整路徑：

```
from llama_index.core import SimpleDirectoryReader


documents = SimpleDirectoryReader("./data", filename_as_id=True).load_data()
print([x.doc_id for x in documents])
```

您也可以直接設定任何 `Document` 的 `doc_id`！

```
document.doc_id = "My new document id!"
```

注意：ID 也可透過 Document 物件上的 `node_id` 或 `id_` property 設定，類似於 `TextNode` 物件。

### 進階 - Metadata 自訂

上面提到的關鍵細節是，預設情況下，您設定的任何 metadata 都會包含在 embedding 生成和 LLM 中。

#### 自訂 LLM Metadata Text

通常，一個 document 可能有許多 metadata key，但您可能不希望所有這些在回應合成期間對 LLM 可見。在上面的範例中，我們可能不希望 LLM 讀取我們 document 的 `file_name`。然而，`file_name` 可能包含有助於生成更好 embedding 的資訊。這樣做的主要優勢是可以在不改變 LLM 最終讀取內容的情況下，偏向檢索的 embedding。

我們可以像這樣排除它：

```
document.excluded_llm_metadata_keys = ["file_name"]
```

然後，我們可以透過指定 `MetadataMode.LLM` 來測試 LLM 實際會讀取什麼，使用 `get_content()` 函式：

```
from llama_index.core.schema import MetadataMode


print(document.get_content(metadata_mode=MetadataMode.LLM))
```

#### 自訂 Embedding Metadata Text

與自訂對 LLM 可見的 metadata 類似，我們也可以自訂對 embedding 可見的 metadata。在這種情況下，您可以明確排除對 embedding model 可見的 metadata，以防您不希望特定的文本偏向 embedding。

```
document.excluded_embed_metadata_keys = ["file_name"]
```
然後，我們可以透過 ``get_content()`` 函式來測試嵌入模型實際會讀取什麼，並指定 ``MetadataMode.EMBED``：

```
from llama_index.core.schema import MetadataMode


print(document.get_content(metadata_mode=MetadataMode.EMBED))
```

#### 自訂 Metadata 格式

如您所知，當將資料傳送給 LLM 或 embedding model 時，metadata 會被注入到每個 document/node 的實際文本中。預設情況下，此 metadata 的格式由三個屬性控制：

1. ``Document.metadata_seperator`` -> default = ``"\n"``

當您串接 metadata 的所有 key/value 欄位時，此欄位控制每個 key/value 對之間的分隔符。

2. ``Document.metadata_template`` -> default = ``"{key}: {value}"``

此屬性控制您 metadata 中每個 key/value 對的格式。需要兩個變數 ``key`` 和 ``value`` 作為字串 key。

3. ``Document.text_template`` -> default = ``{metadata_str}\n\n{content}``

一旦您使用 ``metadata_seperator`` 和 ``metadata_template`` 將 metadata 轉換為字串，此模板將控制當該 metadata 與您的 document/node 的文本內容結合時，其外觀。需要兩個字串 key ``metadata`` 和 ``content``。

### 摘要

了解了所有這些，讓我們用所有這些功能建立一個簡短的範例：

```
from llama_index.core import Document
from llama_index.core.schema import MetadataMode


document = Document(
    text="This is a super-customized document",
    metadata={
        "file_name": "super_secret_document.txt",
        "category": "finance",
        "author": "LlamaIndex",
    },
    excluded_llm_metadata_keys=["file_name"],
    metadata_seperator="::",
    metadata_template="{key}=>{value}",
    text_template="Metadata: {metadata_str}\n-----\nContent: {content}",
)


print(
    "The LLM sees this: \n",
    document.get_content(metadata_mode=MetadataMode.LLM),
)
print(
    "The Embedding model sees this: \n",
    document.get_content(metadata_mode=MetadataMode.EMBED),
)
```

### 進階 - 自動 Metadata 擷取

我們有 [初始範例](/python/framework/module_guides/loading/documents_and_nodes/usage_metadata_extractor/) 使用 LLMs 本身來執行 metadata 擷取。