---
title: "索引"
---

載入您的資料後，您現在有了一系列 Document 物件（或 Nodes 物件）。現在是時候在這些物件上建立一個 `Index`，以便開始查詢它們。

## 什麼是 Index？

在 LlamaIndex 的術語中，`Index` 是一種由 `Document` 物件組成的資料結構，旨在透過 LLM 進行查詢。您的 Index 設計旨在與您的查詢策略相輔相成。

LlamaIndex 提供幾種不同的 Index 類型。我們將介紹其中最常見的兩種。

## Vector Store Index

`VectorStoreIndex` 是您最常遇到的 Index 類型。Vector Store Index 會將您的 Documents 分割成 Nodes。然後它會為每個 node 的文本建立 `vector embeddings`，使其準備好被 LLM 進行查詢。

### 什麼是 embedding？

`Vector embeddings` 對於 LLM 應用程式的運作方式至關重要。

`vector embedding`，通常簡稱為 embedding，是**您文本的語義或意義的數值表示**。具有相似意義的兩段文本，即使實際文本非常不同，也會具有數學上相似的 embedding。

這種數學關係使得**語義搜尋 (semantic search)** 成為可能，使用者提供查詢詞彙，LlamaIndex 可以找到與**查詢詞彙的意義**相關的文本，而不僅僅是簡單的關鍵字匹配。這是檢索增強生成 (Retrieval-Augmented Generation) 的重要部分，以及 LLMs 一般運作的方式。

有 [許多種 embedding](/python/framework/module_guides/models/embeddings/)，它們在效率、有效性和計算成本上有所不同。如果您沒有設定，`OpenAIEmbedding` 會退回到 `text-embedding-ada-002`。對於新專案，我們建議明確傳遞 `OpenAIEmbedding(model="text-embedding-3-small")`，或使用像 `HuggingFaceEmbedding("BAAI/bge-small-en-v1.5")` 這樣的本地模型（請參閱 [embeddings 指南](/python/framework/module_guides/models/embeddings/#choosing-an-embedding-model)）。如果您使用不同的 LLMs，您通常會希望使用不同的 embedding。

### Vector Store Index 嵌入您的 documents

Vector Store Index 使用您 LLM 中的 API 將所有文本轉換為 embedding；這就是我們說它「嵌入您的文本」的意思。如果您有大量文本，生成 embedding 可能需要很長時間，因為它涉及多次往返 API 呼叫。

當您想搜尋您的 embedding 時，您的查詢本身會被轉換成一個 vector embedding，然後 VectorStoreIndex 執行數學運算，根據這些 embedding 與您的查詢的語義相似度來對所有 embedding 進行排序。

### Top K 檢索

一旦排序完成，VectorStoreIndex 會將最相似的 embedding 作為對應的文本片段返回。它返回的 embedding 數量被稱為 `k`，控制返回多少 embedding 的參數被稱為 `top_k`。這整種搜尋方式通常被稱為「top-k semantic retrieval」，就是因為這個原因。

Top-k retrieval 是查詢 vector index 最簡單的形式；當您閱讀 [查詢](/python/framework/understanding/rag/querying/) 部分時，您會了解到更複雜和微妙的策略。

### 使用 Vector Store Index

要使用 Vector Store Index，請傳遞您在載入階段建立的 Documents 列表給它：

```
from llama_index.core import VectorStoreIndex


index = VectorStoreIndex.from_documents(documents)
```

提示

`from_documents` 也接受一個可選參數 `show_progress`。將其設定為 `True` 以在索引建構期間顯示進度條。

您也可以直接對 Node 物件列表建立索引：

```
from llama_index.core import VectorStoreIndex


index = VectorStoreIndex(nodes)
```

當您的文本被索引後，它在技術上已準備好進行 [查詢](/python/framework/understanding/rag/querying/)！然而，嵌入所有文本可能非常耗時，如果您使用的是託管的 LLM，它也可能很昂貴。為了節省時間和金錢，您需要先 [儲存您的 embeddings](/python/framework/understanding/rag/storing/)。

## Summary Index摘要索引是 Index 的一種簡化形式，最適合用於您在 Documents 中嘗試生成文本摘要的查詢。它僅儲存所有的 Documents 並將它們返回給您的查詢引擎。

## 進一步閱讀

如果您的資料是一組相互關聯的概念（在電腦科學術語中稱為「graph」），那麼您可能會對我們的 [knowledge graph index](https://developers.llamaindex.ai/python/examples/index_structs/knowledge_graph/knowledgegraphdemo/index.md) 感興趣。