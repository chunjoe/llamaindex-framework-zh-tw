---
title: "Agents"
---

在 LlamaIndex 中組合 agent 可以透過定義一組工具並將其提供給我們的 ReActAgent 或 FunctionAgent 實作來完成。我們在此使用 OpenAI，但它也可以用於任何足夠具備能力的 LLM。

一般來說，對於在 API 中內建函式呼叫/tools 的 LLMs，例如 Openai、Anthropic、Gemini 等，應優先使用 FunctionAgent。

```
from llama_index.core.tools import FunctionTool
from llama_index.llms.openai import OpenAI
from llama_index.core.agent.workflow import ReActAgent, FunctionAgent




# define sample Tool
def multiply(a: int, b: int) -> int:
    """Multiply two integers and returns the result integer"""
    return a * b




# initialize llm
llm = OpenAI(model="gpt-4o")


# initialize agent
agent = FunctionAgent(
    tools=[multiply],
    system_prompt="You are an agent that can invoke a tool for multiplication when assisting a user.",
)
```

這些工具可以作為 Python functions 顯示在上面，或者可以作為 LlamaIndex query engines：

```
from llama_index.core.tools import QueryEngineTool


query_engine_tools = [
    QueryEngineTool.from_defaults(
        query_engine=sql_agent,
        name="sql_agent",
        description="Agent that can execute SQL queries.",
    ),
]


agent = FunctionAgent(
    tools=query_engine_tools,
    system_prompt="You are an agent that can invoke an agent for text-to-SQL execution.",
)
```

您可以在我們的 [Agent Module Guide](/python/framework/module_guides/deploying/agents/) 或 [端到端 agent 教學](/python/framework/understanding/agent/) 中了解更多資訊。