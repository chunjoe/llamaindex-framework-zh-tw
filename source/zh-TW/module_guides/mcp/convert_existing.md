---
title: "將現有的 LlamaIndex Workflows 和 Tools 轉換為 MCP"
---

將您的 LlamaIndex 工具和 workflows 轉換為 MCP 伺服器，以獲得更廣泛的生態系統相容性。

## 轉換 Workflows

使用 `workflow_as_mcp` 將任何 LlamaIndex Workflow 轉換為 [FastMCP](https://github.com/jlowin/fastmcp) 伺服器：

```
from workflows import Context, Workflow, step
from workflows.events import StartEvent, StopEvent
from llama_index.tools.mcp.utils import workflow_as_mcp




class QueryEvent(StartEvent):
    query: str




class SimpleWorkflow(Workflow):
    @step
    def process_query(self, ctx: Context, ev: QueryEvent) -> StopEvent:
        result = f"Processed: {ev.query}"
        return StopEvent(result=result)




# Convert to MCP server
workflow = SimpleWorkflow()
mcp = workflow_as_mcp(workflow, start_event_model=QueryEvent)
```

如果您直接使用 [FastMCP](https://github.com/jlowin/fastmcp)，它看起來會像這樣：

```
from fastmcp import FastMCP


# Workflow definition
...


mcp = FastMCP("Demo 🚀")
workflow = SimpleWorkflow()




@mcp.tool
async def run_my_workflow(input_args: QueryEvent) -> str:
    """Add two numbers"""
    if isintance(input_args, dict):
        input_args = QueryEvent.model_validate(input_args)
    result = await workflow.run(start_event=input_args)
    return str(result)




if __name__ == "__main__":
    mcp.run()
```

## 轉換個別工具

我們也可以使用 FastMCP 直接將現有的函式和工具輸入 MCP 端點進行轉換：

```
from fastmcp import FastMCP
from llama_index.tools.notion import NotionToolSpec


# Get tools from ToolSpec
tool_spec = NotionToolSpec(integration_token="your_token")
tools = tool_spec.to_tool_list()


# Create MCP server
mcp_server = FastMCP("Tool Server")


# Register tools
for tool in tools:
    mcp_server.tool(
        name=tool.metadata.name, description=tool.metadata.description
    )(tool.real_fn)
```

## 執行 MCP 伺服器

您可以從 CLI (這也適合除錯！) 啟動您的伺服器：

終端機視窗

```
# Install MCP CLI
pip install "mcp[cli]"


# Run server
mcp run your-server.py
```
