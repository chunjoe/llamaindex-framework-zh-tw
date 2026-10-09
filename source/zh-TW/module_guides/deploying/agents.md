---
title: "Agents"
---

在 LlamaIndex 中，我們將「agent」定義為一種特定的系統，它使用 LLM、memory 和 tools 來處理來自外部使用者的輸入。這與「agentic」一詞形成對比，後者通常指的是 agents 的超類，即任何在過程中具有 LLM 決策能力的系統。

在 LlamaIndex 中建立一個 agent 只需幾行程式碼：

```
import asyncio
from llama_index.core.agent.workflow import FunctionAgent
from llama_index.llms.openai import OpenAI




# Define a simple calculator tool
def multiply(a: float, b: float) -> float:
    """Useful for multiplying two numbers."""
    return a * b




# Create an agent workflow with our calculator tool
agent = FunctionAgent(
    tools=[multiply],
    llm=OpenAI(model="gpt-4o-mini"),
    system_prompt="You are a helpful assistant that can multiply two numbers.",
)




async def main():
    # Run the agent
    response = await agent.run("What is 1234 * 4567?")
    print(str(response))




# Run the agent
if __name__ == "__main__":
    asyncio.run(main())
```

呼叫這個 agent 會啟動一組特定的動作迴圈：

- Agent 獲取最新的 message + chat history
- tool schemas 和 chat history 會傳送給 API
- Agent 會回覆直接回應，或一個 tool calls 的列表

  - 每個 tool call 都會被執行
  - tool call 的結果會被加入 chat history
  - Agent 會使用更新後的 history 再次被呼叫，並會直接回應或選擇更多呼叫

`FunctionAgent` 是一種 agent 的類型，它使用 LLM provider 的 function/tool calling 能力來執行 tools。其他類型的 agents，例如 [`ReActAgent`](https://developers.llamaindex.ai/python/examples/agent/react_agent/index.md) 和 [`CodeActAgent`](https://developers.llamaindex.ai/python/examples/agent/code_act_agent/index.md)，使用不同的 prompting 策略來執行 tools。

您可以造訪 [the agents guide](/python/framework/understanding/agent/) 了解更多關於 agents 及其能力。

提示

有些 model 可能不支援 streaming LLM output。雖然 streaming 預設是開啟的，但如果您遇到錯誤，您可以隨時將 `FunctionAgent(..., streaming=False)` 設定為禁用 streaming。

## 工具

Tools 可以簡單地定義為 python functions，或使用 `FunctionTool` 和 `QueryEngineTool` 等 class 進行進一步自訂。LlamaIndex 也使用名為 `Tool Specs` 的東西，為常見 API 提供預定義的 tools 集合。

您可以閱讀 [tools 指南](/python/framework/module_guides/deploying/agents/tools/) 以了解更多關於配置 tools 的資訊。

## Memory

Memory 是建構 agents 時的核心元件。預設情況下，所有 LlamaIndex agents 都使用 ChatMemoryBuffer 來處理 memory。

若要自訂，您可以將其宣告在 agent 外部並傳入：

```
from llama_index.core.memory import ChatMemoryBuffer


memory = ChatMemoryBuffer.from_defaults(token_limit=40000)


response = await agent.run(..., memory=memory)
```

您可以閱讀 [memory guide](/python/framework/module_guides/deploying/agents/memory/) 以了解更多關於配置 memory 的資訊。

## Multi-Modal Agents

某些 LLMs 將支援多種模態，例如圖片和文字。使用帶有 content blocks 的 chat messages，我們可以將圖片傳遞給 agent 進行推理。

例如，想像您有一張 [slide from this presentation](https://docs.google.com/presentation/d/1wy3nuO9ezGS4R99mzP3Q3yvrjAkZ26OGI2NjfqtwAaE/edit?usp=sharing) 的截圖。

您可以將此圖片傳遞給 agent 進行推理，並看到它會讀取圖片並相應地採取行動。

```
from llama_index.core.agent.workflow import FunctionAgent
from llama_index.core.llms import ChatMessage, ImageBlock, TextBlock
from llama_index.llms.openai import OpenAI


llm = OpenAI(model="gpt-4o-mini", api_key="sk-...")




def add(a: int, b: int) -> int:
    """Useful for adding two numbers together."""
    return a + b




workflow = FunctionAgent(
    tools=[add],
    llm=llm,
)


msg = ChatMessage(
    role="user",
    blocks=[
        TextBlock(text="Follow what the image says."),
        ImageBlock(path="./screenshot.png"),
    ],
)


response = await workflow.run(msg)
print(str(response))
```

## Multi-Agent Systems

您可以將 agents 組合為一個 multi-agent 系統，其中每個 agent 都能將控制權轉移給另一個 agent 來協調完成任務。

```
from llama_index.core.agent.workflow import AgentWorkflow


multi_agent = AgentWorkflow(agents=[FunctionAgent(...), FunctionAgent(...)])


resp = await agent.run("query")
```

這只是建立 multi-agent 系統的一種方法。請繼續閱讀以了解更多關於 [multi-agent systems](/python/framework/understanding/agent/multi_agent/)。

## Manual Agents

雖然像 `FunctionAgent`、`ReActAgent`、`CodeActAgent` 和 `AgentWorkflow` 這樣的 agent classes 抽象了許多細節，但有時建立自己的低階 agents 會更理想。

直接使用 `LLM` 物件，您可以快速實作一個基本的 agent 迴圈，同時對 tool calling 和 error handling 的運作擁有完全的控制權。

```
from llama_index.core.llms import ChatMessage
from llama_index.core.tools import FunctionTool
from llama_index.llms.openai import OpenAI




def select_song(song_name: str) -> str:
    """Useful for selecting a song."""
    return f"Song selected: {song_name}"




tools = [FunctionTool.from_defaults(select_song)]
tools_by_name = {t.metadata.name: t for t in [tool]}


# call llm with initial tools + chat history
chat_history = [ChatMessage(role="user", content="Pick a random song for me")]
resp = llm.chat_with_tools([tool], chat_history=chat_history)


# parse tool calls from response
tool_calls = llm.get_tool_calls_from_response(
    resp, error_on_no_tool_call=False
)


# loop while there are still more tools to call
while tool_calls:
    # add the LLM's response to the chat history
    chat_history.append(resp.message)


    # call every tool and add its result to chat_history
    for tool_call in tool_calls:
        tool_name = tool_call.tool_name
        tool_kwargs = tool_call.tool_kwargs


        print(f"Calling {tool_name} with {tool_kwargs}")
        tool_output = tool(**tool_kwargs)
        chat_history.append(
            ChatMessage(
                role="tool",
                content=str(tool_output),
                # most LLMs like OpenAI need to know the tool call id
                additional_kwargs={"tool_call_id": tool_call.tool_id},
            )
        )


        # check if the LLM can write a final response or calls more tools
        resp = llm.chat_with_tools([tool], chat_history=chat_history)
        tool_calls = llm.get_tool_calls_from_response(
            resp, error_on_no_tool_call=False
        )


# print the final response
print(resp.message.content)
```

## Examples / Module Guides

您可以在 [module guides page](/python/framework/module_guides/deploying/agents/modules/) 找到更完整的範例和 module guides 列表。