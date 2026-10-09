---
title: "建立 LLM 應用程式"
---

歡迎來到 Understanding LlamaIndex。這是一系列關於構建 agentic LLM 應用程式的每個階段的簡短教學，旨在讓您熟悉如何使用 LlamaIndex，然後再深入探討更進階和細微的策略。如果您是經驗豐富的程式設計師但對 LlamaIndex 是新手，這裡就是您的起點。

## 構建 agentic LLM 應用程式的關鍵步驟

提示

如果這些術語不熟悉，您可能需要閱讀我們的 [高層次概念](/python/framework/getting_started/concepts/)。

本教學包含三個主要部分：**Building a RAG pipeline**、**Building an agent**，以及**Building Workflows**，並在前後有一些較小的部分。以下是您將會看到的内容：

- **[Using LLMs](/python/framework/understanding/using_llms/)**：立即上手，開始使用 LLMs。我們將向您展示如何使用我們提供的 [數十種支援的 LLMs](/python/framework/module_guides/models/llms/modules/)，無論是透過遠端 API 呼叫還是在您的機器上本地運行。

- **[Building agents](/python/framework/understanding/agent/)**：agents 是由 LLM 驅動的知識工作者，可以透過一組工具與世界互動。這些工具可以檢索資訊（例如 RAG，見下文）或執行動作。本教學包含：

  - **[Building a single agent](/python/framework/understanding/agent/)**：我們將向您展示如何建立一個簡單的 agent，它可以透過一組工具與世界互動。

  - **[使用現有工具](/python/framework/understanding/agent/tools/)**：LlamaIndex 提供 [數十種預建的 agent 工具](https://github.com/run-llama/llama_index/tree/main/llama-index-integrations/tools)，您可以將它們整合到您的 agents 中。

  - **[Maintaining state](/python/framework/understanding/agent/state/)**：agents 可以維持狀態，這對於構建更複雜的應用程式非常重要。

  - **[Streaming output and events](/python/framework/understanding/agent/streaming/)**：提供給使用者可見性和回饋非常重要，串流（streaming）讓您可以做到這一點。

  - **[Human in the loop](/python/framework/understanding/agent/human_in_the_loop/)**：獲得人類對您的 agent 的回饋至關重要。

  - **[Multi-agent systems with AgentWorkflow](/python/framework/understanding/agent/multi_agent/)**：結合多個 agents 進行協作是構建更複雜系統的強大技術；本節將向您展示如何做到這一點。

- **[Workflows](https://developers.llamaindex.ai/python/llamaagents/workflows/)**：Workflows 是用於構建 agentic 應用程式的較低層級、事件驅動的抽象。它是您構建任何進階 agentic application 時應該使用的基礎層。您可以使用您學到的預建抽象，或從頭開始構建 agents。本教學涵蓋：

  - **[建立簡單的 workflow](https://developers.llamaindex.ai/python/llamaagents/workflows/)**：一個簡單的 workflow，向您展示如何使用 `Workflow` 類別來建立基本的 agentic application。

  - **[Looping and branching](https://developers.llamaindex.ai/python/llamaagents/workflows/branches_and_loops/index.md)**：這些核心控制流程模式是更複雜的 workflows 的建構基礎。

  - **[Concurrent execution](https://developers.llamaindex.ai/python/llamaagents/workflows/concurrent_execution/index.md)**：您可以並行運行步驟，以有效分割工作。

  - **[Streaming events](https://developers.llamaindex.ai/python/llamaagents/workflows/stream/index.md)**：您的 agents 可以像您上面建立的 agents 一樣發出使用者可見的事件。

  - **[Stateful workflows](https://developers.llamaindex.ai/python/llamaagents/workflows/managing_state/index.md)**：workflows 可以維持狀態，這對於構建更複雜的應用程式非常重要。

  - **[Observability](https://developers.llamaindex.ai/python/llamaagents/workflows/observability/index.md)**：workflows 可以使用 Arize Phoenix、OpenTelemetry 等各種整合進行追蹤和除錯。

- **[Adding RAG to your agents](/python/framework/understanding/rag/)**：檢索增強生成 (Retrieval-Augmented Generation, RAG) 是獲取您的資料到 LLM 的關鍵技術，也是更複雜的 agentic 系統的一個組成部分。我們將向您展示如何透過一個功能齊全的 RAG pipeline 來增強您的 agents，使其能夠回答有關您資料的問題。這包括：- **[Loading & Ingestion](/python/framework/understanding/rag/loading/)**：從任何地方獲取您的資料，無論是非結構化文字、PDF、資料庫還是 API 到其他應用程式。LlamaIndex 擁有 [數百種連接器](https://github.com/run-llama/llama_index/tree/main/llama-index-integrations/readers) 到每一個資料來源。

- **[索引與 Embedding](/python/framework/understanding/rag/indexing/)**：一旦您取得資料，就有無限多種方式來結構化存取該資料，以確保您的應用程式始終使用最相關的資料。LlamaIndex 內建了大量的這些策略，可以幫助您選擇最佳的策略。

- **[儲存](/python/framework/understanding/rag/storing/)**：您可能會發現將資料以索引形式，或由 LLM 提供的預處理摘要儲存，通常在被稱為 `Vector Store` 的專業資料庫中會更有效率。您也可以儲存您的 indexes、metadata 等。

- **[查詢](/python/framework/understanding/rag/querying/)**：每種索引策略都有相應的查詢策略，還有許多方法可以提高您檢索的相關性、速度和準確性，以及 LLM 在將結果返回給您之前所執行的操作，包括將其轉換為結構化的回應，例如 API。

- **[Putting it all together](/python/framework/understanding/putting_it_all_together/)**：無論您是建構問答、聊天機器人、API 還是自主 agent，我們都向您展示如何將您的應用程式投入生產環境。

- **[Tracing and debugging](/python/framework/understanding/tracing_and_debugging/tracing_and_debugging/)**：也被稱為 **observability**，對於 LLM 應用程式來說，能夠查看內部運作情況非常重要，這有助於您除錯問題並找出改進的空間。

- **[Evaluating](/python/framework/understanding/evaluating/evaluating/)**：每種策略都有優缺點，建構、部署和演進您的應用程式的關鍵部分是評估您的變更是否在準確性、效能、清晰度、成本等方面改善了您的應用程式。可靠地評估您的變更是 LLM 應用程式開發的關鍵部分。

## 讓我們開始吧！

準備好深入了解了嗎？前往 [using LLMs](/python/framework/understanding/using_llms/)。