---
title: "使用結構化輸出"
---

大多數時候您需要從 agent 獲得特定格式的結果。Agents 的結果可以以兩種方式返回結構化的 json：

1. `output_cls` – 一個 Pydantic 模型用作輸出結構的 schema
2. `structured_output_fn` – 對於更進階的用例，提供一個自訂函式來驗證或重寫 agent 的對話，使其轉換成您想要的任何模型。

單個 agents，例如 `FunctionAgent` 和 `ReActAgent`，以及多個 agent `AgentWorkflow` workflows，都支援這些選項——讓我們探索可能性：

### 使用 `output_cls`

```
from llama_index.core.agent.workflow import FunctionAgent, AgentWorkflow
from llama_index.llms.openai import OpenAI
from pydantic import BaseModel, Field


llm = OpenAI(model="gpt-4.1")




## define structured output format  and tools
class MathResult(BaseModel):
    operation: str = Field(description="the performed operation")
    result: int = Field(description="the result of the operation")




def multiply(x: int, y: int):
    """Multiply two numbers"""
    return x * y




## define agent
agent = FunctionAgent(
    tools=[multiply],
    name="calculator",
    system_prompt="You are a calculator agent who can multiply two numbers using the `multiply` tool.",
    output_cls=MathResult,
    llm=llm,
)


response = await agent.run("What is 3415 * 43144?")
print(response.structured_response)
print(response.get_pydantic_model(MathResult))
```

這也適用於多個 agent workflows：

```
## define structured output format  and tools
class Weather(BaseModel):
    location: str = Field(description="The location")
    weather: str = Field(description="The weather")




def get_weather(location: str):
    """Get the weather for a given location"""
    return f"The weather in {location} is sunny"




## define single agents
agent = FunctionAgent(
    llm=llm,
    tools=[get_weather],
    system_prompt="You are a weather agent that can get the weather for a given location",
    name="WeatherAgent",
    description="The weather forecaster agent.",
)
main_agent = FunctionAgent(
    name="MainAgent",
    tools=[],
    description="The main agent",
    system_prompt="You are the main agent, your task is to dispatch tasks to secondary agents, specifically to WeatherAgent",
    can_handoff_to=["WeatherAgent"],
    llm=llm,
)


## define multi-agent workflow
workflow = AgentWorkflow(
    agents=[main_agent, agent],
    root_agent=main_agent.name,
    output_cls=Weather,
)


response = await workflow.run("What is the weather in Tokyo?")
print(response.structured_response)
print(response.get_pydantic_model(Weather))
```

### 使用 `structured_output_fn`

自訂函式應以 agent workflow 產生的 `ChatMessage` 物件序列作為輸入，並回傳一個字典（可以轉換成一個 `BaseModel` 子類別）：

```
import json
from llama_index.core.llms import ChatMessage
from typing import List, Dict, Any




class Flavor(BaseModel):
    flavor: str
    with_sugar: bool




async def structured_output_parsing(
    messages: List[ChatMessage],
) -> Dict[str, Any]:
    sllm = llm.as_structured_llm(Flavor)
    messages.append(
        ChatMessage(
            role="user",
            content="Given the previous message history, structure the output based on the provided format.",
        )
    )
    response = await sllm.achat(messages)
    return json.loads(response.message.content)




def get_flavor(ice_cream_shop: str):
    return "Strawberry with no extra sugar"




agent = FunctionAgent(
    tools=[get_flavor],
    name="ice_cream_shopper",
    system_prompt="You are an agent that knows the ice cream flavors in various shops.",
    structured_output_fn=structured_output_parsing,
    llm=llm,
)


response = await agent.run(
    "What strawberry flavor is available at Gelato Italia?"
)
print(response.structured_response)
print(response.get_pydantic_model(Flavor))
```

### 串流結構化輸出

在 workflow 運行時，您可以使用 `AgentStreamStructuredOutput` 事件來獲取結構化輸出：

```
from llama_index.core.agent.workflow import (
    AgentInput,
    AgentOutput,
    ToolCall,
    ToolCallResult,
    AgentStreamStructuredOutput,
)


handler = agent.run("What strawberry flavor is available at Gelato Italia?")


async for event in handler.stream_events():
    if isinstance(event, AgentInput):
        print(event)
    elif isinstance(event, AgentStreamStructuredOutput):
        print(event.output)
        print(event.get_pydantic_model(Weather))
    elif isinstance(event, ToolCallResult):
        print(event)
    elif isinstance(event, ToolCall):
        print(event)
    elif isinstance(event, AgentOutput):
        print(event)
    else:
        pass


response = await handler
```

您可以在 agent 的回應中解析結構化輸出，直接存取它作為一個 dictionary，或使用 `get_pydantic_model` 方法將其載入為一個 `BaseModel` 子類別：

```
print(response.structured_response)
print(response.get_pydantic_model(Flavor))
```
