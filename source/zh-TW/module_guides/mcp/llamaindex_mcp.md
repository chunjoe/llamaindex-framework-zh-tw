---
title: "使用 MCP Tools 與 LlamaIndex"
---

LlamaIndex 為透過 `llama-index-tools-mcp` 套件來消費 MCP 伺服器提供強大的支援。

## 安裝

終端機視窗

```
pip install llama-index-tools-mcp
```

## 基本用法

最常見的用法是將一個 MCP 伺服器轉換為 `llama-index` 工具定義的清單：

```
from llama_index.tools.mcp import BasicMCPClient, McpToolSpec


# Connect to MCP server
mcp_client = BasicMCPClient("http://127.0.0.1:8000/sse")
mcp_tool_spec = McpToolSpec(client=mcp_client)


# Get tools
tools = await mcp_tool_spec.to_tool_list_async()
```

## 與 Agents 一起使用

一旦您有了工具清單，就可以將其插入任何現有的 agent：

```
from llama_index.core.agent.workflow import FunctionAgent
from llama_index.llms.openai import OpenAI


agent = FunctionAgent(
    tools=tools,
    llm=OpenAI(model="gpt-5-mini"),
    system_prompt="You are a helpful assistant.",
)


response = await agent.run("Your query here")
```

您可以在 [Agents Guide](/python/framework/understanding/agent/) 中閱讀更多關於 agents 的資訊。

## 連線類型

`BasicMCPClient` 支援多種傳輸方法：

```
# Server-Sent Events
sse_client = BasicMCPClient("https://example.com/sse")


# Streamable HTTP
http_client = BasicMCPClient("https://example.com/mcp")


# Local process
local_client = BasicMCPClient("python", args=["server.py"])
```
