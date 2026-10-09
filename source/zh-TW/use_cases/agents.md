---
title: "Agents"
---

「agent」是一個自動化推理與決策引擎。它接收使用者輸入/查詢，並可以做出內部決策以執行該查詢，從而返回正確的結果。關鍵的 agent 組件可以包括但不限於：

- 將複雜問題分解成較小的問題
- 選擇一個外部 Tool 使用 + 為呼叫該 Tool 擬定參數
- 規劃一組任務
- 將先前完成的任務儲存在記憶體模組中

LlamaIndex 提供了一個全面的框架，用於建立具有不同複雜程度的 Agentic 系統：

- **如果您想快速建立 agents**：使用我們預建的 [agent](/python/framework/module_guides/deploying/agents/) 和 [tool](/python/framework/module_guides/deploying/agents/tools/) 架構，快速設定 Agentic 系統。
- **如果您想完全控制您的 Agentic 系統**：使用我們的 [Workflows](https://developers.llamaindex.ai/python/framework/module_guides/workflow/) 從零開始建構並部署自訂的 Agentic workflows。

## 用例

agents 的可能用例範圍非常廣泛且不斷擴展。話說回來，以下是一些可以立即帶來價值的實用用例。

- **Agentic RAG**：建立一個增強上下文的研究助理，基於您的資料，它不僅能回答簡單問題，還能處理複雜的研究任務。我們的 [入門指南](/python/framework/getting_started/starter_example/) 是很好的起點。

- **報告生成**：使用多個 agent 研究員 + 寫作者 workflow + LlamaParse 生成多模態報告。[Notebook](https://github.com/run-llama/llama_cloud_services/examples/parse/multimodal/multimodal_report_generation_agent.ipynb)。

- **客戶支援**：查看建立一個帶有 [workflows](https://github.com/run-llama/multi-agent-concierge/) 的多 agent 禮賓服務的入門範本。

其他：

- **生產力助理**：建立一個 agent，可以對常見的 workflow 工具（如電子郵件、日曆）進行操作。查看我們的 [GSuite agent tutorial](https://github.com/run-llama/llama_index/blob/main/llama-index-integrations/tools/llama-index-tools-google/examples/advanced_tools_usage.ipynb)。

- **編碼助理**：建立一個 agent，可以對程式碼進行操作。查看我們的 [code interpreter tutorial](https://github.com/run-llama/llama_index/blob/main/llama-index-integrations/tools/llama-index-tools-code-interpreter/examples/code_interpreter.ipynb)。

## 資源

**預建 Agents 和 Tools**

以下組件指南是開始使用 agents 的中心樞紐：

- [Agents](/python/framework/module_guides/deploying/agents/)
- [Tools](/python/framework/module_guides/deploying/agents/tools/)

**自訂 Agentic Workflows**

LlamaIndex Workflows 允許您透過核心事件驅動的協調基礎來建立非常自訂的 Agentic workflows。

- [Workflows Documentation](https://developers.llamaindex.ai/python/llamaagents/workflows/)
- [Building a ReAct agent workflow](https://developers.llamaindex.ai/python/examples/workflow/react_agent/index.md)
- [Deploying Workflows](https://developers.llamaindex.ai/python/llamaagents/llamactl/getting-started/index.md)

**使用 Agentic 組件建構**

如果您想在您的 workflow 中利用核心 Agentic 組件，LlamaIndex 為每個 agent 子組件提供了強大的抽象層。

- **查詢規劃**：[Routing](/python/framework/module_guides/querying/router/)、[Sub-Questions](https://developers.llamaindex.ai/python/examples/query_engine/sub_question_query_engine/index.md)、[Query Transformations](/python/framework/optimizing/advanced_retrieval/query_transformations/)。
- **Function Calling 和 Tool Use**：查看我們的 [OpenAI](https://developers.llamaindex.ai/python/examples/llm/openai/index.md)、[Mistral](https://developers.llamaindex.ai/python/examples/llm/mistralai/index.md) 指南作為範例。

## 生態系統

- **社群建構的 Agents**：我們提供一套 40 多個 agent 工具，可與您的 agent 在我們的 [tool integrations](https://github.com/run-llama/llama_index/tree/main/llama-index-integrations/tools) 中使用。