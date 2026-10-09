---
title: "模型上下文協議（MCP）"
---

模型上下文協議（MCP）是一種開放原始碼標準協定，讓大型語言模型（LLM）能透過結構化 API 呼叫與外部工具及資料來源互動。

MCP 為 AI 應用提供標準化的溝通層，讓應用能有效地連接工具、資料庫和預先定義的範本等外部服務。您可以把 MCP 想成 AI 應用的「USB-C 連接埠」：它提供一致的方式，讓各種工具、平台和資料來源連接至 AI 模型。

## 架構

MCP 採用用戶端－伺服器架構：

- **MCP 主機**：透過 MCP 存取資料的應用程式，例如 Claude Desktop、IDE 或 AI 工具
- **MCP 用戶端**：與 MCP 伺服器維持一對一連線的協定用戶端
- **MCP 伺服器**：透過標準協定提供各種功能（工具、資源和提示）的輕量服務

## 核心功能

MCP 支援三種主要功能：

1. **Tools**：可透過結構化輸入呼叫的函式
2. **Resources**：可讀取的資料來源，例如檔案、資料庫等
3. **Prompts**：可重複使用並帶有參數的提示範本

## 搭配 LlamaIndex 使用

您可以透過多種方式在 LlamaIndex 中使用 MCP 伺服器，為 agent 工作流程加入更多資源與功能：

- **在 LlamaIndex workflows 中使用現有 MCP 伺服器的工具**：從現有 MCP 伺服器提供的外部資源取得資料。
- **將 LlamaIndex workflows 作為 MCP 伺服器提供服務**：您可以將自訂的 LlamaIndex workflows 轉換成 MCP 伺服器。
- **在 LlamaIndex workflows 中使用 LlamaParse 服務**：執行我們以 Python 或 TypeScript 提供的 MCP 伺服器，在任何可與 MCP 伺服器通訊的應用程式中使用 LlamaParse（原名 LlamaCloud）的 Extract、Parse 等功能，包括 LlamaIndex workflows。

## 下一步

- [在 LlamaIndex 中使用 MCP 工具](/python/framework/module_guides/mcp/llamaindex_mcp/)
- [將 LlamaParse（原名 LlamaCloud）API 作為 MCP 工具／伺服器使用](/python/framework/module_guides/mcp/llamacloud_mcp/)
- [將既有的 LlamaIndex workflow／tool 作為 MCP 工具／伺服器使用](/python/framework/module_guides/mcp/convert_existing/)
