---
title: "串流輸出與事件"
---

在實際應用中，agents 可能需要較長時間才能執行。回饋用戶關於 agent 進度的資訊非常重要，串流（streaming）可以實現這一點。

`AgentWorkflow` 提供了一組預先建置的事件，您可以使用它們將輸出串流給用戶。讓我們看看如何操作。

提示

某些模型可能不支援串流 LLM 的輸出。雖然串流預設是開啟的，但如果您遇到錯誤，您可以將 `FunctionAgent(..., streaming=False)` 設定為停用串流。

首先，我們將介紹一個需要一些時間才能執行的新工具。在此例中，我們將使用一個名為 [Tavily](https://github.com/run-llama/llama_index/tree/main/llama-index-integrations/tools/llama-index-tools-tavily-research) 的網路搜尋工具，它作為 `llama-index-tools-tavily-research` 套件提供。

終端機視窗

```
pip install llama-index-tools-tavily-research
```

它需要一個 API 金鑰，我們將在我們的 `.env` 檔案中設定為 `TAVILY_API_KEY` 並使用 `os.getenv` 方法來檢索它。讓我們引入我們的匯入：

```
from llama_index.tools.tavily_research import TavilyToolSpec
import os
```

並初始化工具：

```
tavily_tool = TavilyToolSpec(api_key=os.getenv("TAVILY_API_KEY"))
```

現在我們將使用該工具和我們先前初始化過的 LLM 來建立一個 agent。

```
workflow = FunctionAgent(
    tools=tavily_tool.to_tool_list(),
    llm=llm,
    system_prompt="You're a helpful assistant that can search the web for information.",
)
```

在先前的範例中，我們使用 `await` 在 `workflow.run` 方法上獲取來自 agent 的最終回應。然而，如果我們不等待回應，我們會得到一個異步迭代器（asynchronous iterator），我們可以遍歷它以獲取事件的即時傳入。這個迭代器會回傳各種事件。我們將從一個 `AgentStream` 事件開始，它包含輸出中最新的「delta」（最接近的變更）。我們需要匯入該事件類型：

```
from llama_index.core.agent.workflow import AgentStream
```

現在我們可以運行 workflow 並尋找該類型的事件來輸出：

```
handler = workflow.run(user_msg="What's the weather like in San Francisco?")


async for event in handler.stream_events():
    if isinstance(event, AgentStream):
        print(event.delta, end="", flush=True)
```

如果您自己運行，您會看到輸出以區塊的形式到達，隨著 agent 運行，回傳類似這樣：

```
The current weather in San Francisco is as follows:


- **Temperature**: 17.2°C (63°F)
- **Condition**: Sunny
- **Wind**: 6.3 mph (10.1 kph) from the NNW
- **Humidity**: 54%
- **Pressure**: 1021 mb (30.16 in)
- **Visibility**: 16 km (9 miles)


For more details, you can check the full report [here](https://www.weatherapi.com/).
```

`AgentStream` 只是 `AgentWorkflow` 在運行時發出的眾多事件之一。其他事件包括：

- `AgentInput`：開始 agent 執行的完整訊息物件
- `AgentOutput`：來自 agent 的回應
- `ToolCall`：被呼叫的工具及其參數
- `ToolCallResult`：工具呼叫的結果

您可以在 [此範例的完整程式碼](https://github.com/run-llama/python-agents-tutorial/blob/main/4_streaming.py) 中看到我們過濾更多這些事件。

接下來，您將了解如何讓 [human in the loop](/python/framework/understanding/agent/human_in_the_loop/) 提供回饋給您的 agents。