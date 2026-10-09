---
title: "RAG 介紹"
---

提示

如果您尚未完成，請先安裝 [LlamaIndex](/python/framework/getting_started/installation/) 並完成 [入門教學](/python/framework/getting_started/starter_example/)，然後再閱讀本文。這將幫助您將這些步驟融入您的經驗。

LLMs 是在龐大的資料庫上訓練的，但它們並非在訓練您的資料。檢索增強生成 (Retrieval-Augmented Generation) (RAG) 透過將您的資料加入 LLMs 已能存取的資料中來解決這個問題。您將在本文中經常看到 RAG 的引用。查詢引擎、聊天引擎和 agents 通常使用 RAG 來完成它們的任務。

在 RAG 中，您的資料會被載入並準備好用於查詢或「索引」。使用者查詢會作用於索引，將您的資料過濾到最相關的內容。此內容和您的查詢會連同一個 prompt 傳遞給 LLM，而 LLM 將提供回應。

即使您正在建立的是聊天機器人或 agent，您也需要了解 RAG 的技術，以便將資料導入您的應用程式。

![](/assets/526284ab4907.png)

### RAG 中的階段

RAG 中有五個關鍵階段，它們也是您建立的大多數應用程式的一部分。這些階段包括：

- **Loading (載入)**：這指的是將您的資料從其存在的地方——無論是文字檔案、PDF、另一個網站、資料庫，還是 API——載入到您的 workflow 中。LlamaIndex 提供 [數百個 connectors](https://github.com/run-llama/llama_index/tree/main/llama-index-integrations/readers) 供您選擇。

- **Indexing (索引)**：這意味著建立一個允許對資料進行查詢的資料結構。對於 LLMs 來說，這幾乎總是意味著建立 `vector embeddings`，即您資料意義的數值表示，以及許多其他元數據策略，以便輕鬆準確地找到上下文相關的資料。

- **Storing (儲存)**：一旦您的資料被索引，您幾乎總是希望儲存您的索引以及其他元數據，以避免需要重新索引。

- **Querying (查詢)**：對於任何給定的索引策略，您都可以利用 LLMs 和 LlamaIndex 資料結構來進行查詢，包括子查詢、多步驟查詢和混合策略。

- **Evaluation (評估)**：任何流程中的一個關鍵步驟是檢查它相對於其他策略的有效性，或者在您進行更改時。Evaluation 提供客觀的衡量標準，用以評估您對查詢的回應在準確性、忠實度和速度方面如何。

![](/assets/da339580341c.png)

### RAG 中的重要概念

您還會遇到一些指代這些階段中步驟的術語。

#### Loading 階段

[**Nodes 和 Documents**](/python/framework/module_guides/loading/documents_and_nodes/)：一個 `Document` 是圍繞任何資料來源的容器——例如，一個 PDF、一個 API 的輸出，或從資料庫中檢索資料。一個 `Node` 是 LlamaIndex 中資料的原子單元，代表一個 `Document` 來源的「chunk」。Nodes 具有與其所在 document 以及其他 nodes 相關的元數據。

[**Connectors (連接器)**](/python/framework/module_guides/loading/connector/)：資料連接器（通常稱為 `Reader`）將來自不同資料來源和資料格式的資料攝取到 `Documents` 和 `Nodes` 中。

#### Indexing 階段

[**Indexes (索引)**](/python/framework/module_guides/indexing/)：一旦您攝取了資料，LlamaIndex 將幫助您將資料索引到一個易於檢索的結構中。這通常涉及生成 `vector embeddings`，這些被儲存在名為 `vector store` 的專門資料庫中。索引也可以儲存有關您資料的多種元數據。

[**Embeddings (嵌入)**](/python/framework/module_guides/models/embeddings/)：LLMs 生成資料的數值表示，稱為 `embeddings`。在過濾您的資料以尋找相關性時，LlamaIndex 會將查詢轉換為 embeddings，而您的 vector store 將找到與查詢嵌入數值相似的資料。

#### Querying 階段[**Retrievers**](/python/framework/module_guides/querying/retriever/): retriever 定義了在給定 query 時，如何有效率地從 index 中檢索相關的 context。你的 retrieval 策略是決定檢索資料相關性以及執行效率的關鍵。

[**Routers**](/python/framework/module_guides/querying/router/): router 決定將使用哪個 retriever 來從 knowledge base 中檢索相關的 context。更具體地說，`RouterRetriever` class 負責選擇一個或多個 candidate retrievers 來執行 query。它們使用一個 selector，根據每個 candidate 的 metadata 和 query 來選擇最佳選項。

[**Node Postprocessors**](/python/framework/module_guides/querying/node_postprocessors/): node postprocessor 接收一組檢索到的 nodes，並對它們應用轉換、過濾或重新排序邏輯。

[**Response Synthesizers**](/python/framework/module_guides/querying/response_synthesizers/): response synthesizer 使用 user query 和給定的 retrieved text chunks，從 LLM 生成一個 response。