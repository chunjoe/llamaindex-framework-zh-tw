---
title: "Retriever"
---

## Concept

Retriever 負責根據使用者 query (或聊天訊息)
 擷取最相關的 context。
它可以建構在 [indexes](/python/framework/module_guides/indexing/) 之上，也可以獨立定義。它被用作 [query engines](/python/framework/module_guides/deploying/query_engine/) （以及 [聊天引擎](/python/framework/module_guides/deploying/chat_engines/)）中用於檢索相關 context 的關鍵建構模組。

提示

不確定 retriever 在 RAG workflow 中的位置？請閱讀關於 [high 層級的 concepts](/python/framework/getting_started/concepts/)

## 使用模式

開始使用：

```
retriever = index.as_retriever()
nodes = retriever.retrieve("Who is Paul Graham?")
```

## 入門指南

取得一個 retriever 從 index：

```
retriever = index.as_retriever()
```

針對問題檢索相關的 context：

```
nodes = retriever.retrieve("Who is Paul Graham?")
```

> Note：若要了解如何建立 index，請參閱 [索引](/python/framework/module_guides/indexing/)

## High-Level API

### Selecting a Retriever

您可以選擇特定於 index 的 retriever 透過 class `retriever_mode`. 例如，使用一個 `SummaryIndex`:

```
retriever = summary_index.as_retriever(
    retriever_mode="llm",
)
```

這會建立一個 [SummaryIndexLLMRetriever](https://developers.llamaindex.ai/python/framework/api_reference/retrievers/summary/) 在...之上 摘要索引。

請參閱 [**Retriever Modes**](/python/framework/module_guides/querying/retriever/retriever_modes/) 以取得完整的 of (index-specific) retriever 模式及其對應的 retriever 類別清單。

### Configuring a Retriever

同樣地，您可以傳遞 kwargs 來配置所選的 retriever.

> Note: 請參閱該 API 所選項目的參考資料 retriever class 建構子參數的有效 kwargs 列表。

例如，如果我們選擇了「llm」retriever 模式，我們可能會執行以下操作：

```
retriever = summary_index.as_retriever(
    retriever_mode="llm",
    choice_batch_size=5,
)
```

## Low-Level Composition API

如果您需要更精細的控制，可以使用低階的 composition API。

若要達到與上述相同的結果，您可以直接 import 並建構所需的 retriever 類別：

```
from llama_index.core.retrievers import SummaryIndexLLMRetriever


retriever = SummaryIndexLLMRetriever(
    index=summary_index,
    choice_batch_size=5,
)
```

## 範例

請參閱 [retrievers guide](/python/framework/module_guides/querying/retriever/retrievers/).
 中的更多範例。