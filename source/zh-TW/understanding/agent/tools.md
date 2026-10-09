---
title: "使用現有工具"
---

現在您已經建置了強大的 agent，我們希望您對它所能做的一切感到興奮。擴展 agent 功能的核心是可用的工具，我們有好消息：LlamaIndex 擁有數百個整合，包括 [數十個現有的 agent 工具](https://github.com/run-llama/llama_index/tree/main/llama-index-integrations/tools)，您可以立即使用它們。我們將向您示範如何使用現有的工具，以及如何建立和貢獻您自己的工具。

## 使用現有工具

以我們的範例，我們將使用 [Yahoo Finance tool](https://github.com/run-llama/llama_index/tree/main/llama-index-integrations/tools/llama-index-tools-yahoo-finance)。它提供了一套六個 agent 工具，用於查詢股票代號的各種資訊。

首先，我們需要安裝該工具：

終端機視窗

```
pip install llama-index-tools-yahoo-finance
```

我們的依賴項與先前的範例相同，我們只需要新增 Yahoo Finance 工具：

```
from llama_index.tools.yahoo_finance import YahooFinanceToolSpec
```

為了示範如何將自訂工具與預建工具組合，我們將保留 `add` 和 `multiply` 函式，儘管在這裡我們不需要它們。我們將引入我們的工具：

```
finance_tools = YahooFinanceToolSpec().to_tool_list()
```

工具列表只是一個 array，因此我們可以利用 Python 的 `extend` 方法將我們自己的工具加入其中：

```
finance_tools.extend([multiply, add])
```

我們將提出一個不同於上次的問題，這需要使用新的工具：

```
workflow = FunctionAgent(
    name="Agent",
    description="Useful for performing financial operations.",
    llm=OpenAI(model="gpt-4o-mini"),
    tools=finance_tools,
    system_prompt="You are a helpful assistant.",
)




async def main():
    response = await workflow.run(
        user_msg="What's the current stock price of NVIDIA?"
    )
    print(response)
```

我們得到這個回應：

```
The current stock price of NVIDIA Corporation (NVDA) is $128.41.
```

（這有點作弊，因為我們的模型已經知道 NVIDIA 的代號。如果它是一家較不知名的公司，您需要新增一個搜尋工具，例如 [Tavily](https://github.com/run-llama/llama_index/tree/main/llama-index-integrations/tools/llama-index-tools-tavily-research)，來找到代號。）

就是這樣！您現在可以在您的 agents 中使用任何預建的工具整合。

一如既往，您可以查看 [the repo](https://github.com/run-llama/python-agents-tutorial/blob/main/2_tools.py) 以在一個地方看到這段程式碼。

## 建置和貢獻您自己的工具

我們很喜歡新的工具的開源貢獻！您可以查看 [Yahoo finance tool 的程式碼看起來像什麼](https://github.com/run-llama/llama_index/blob/main/llama-index-integrations/tools/llama-index-tools-yahoo-finance/llama_index/tools/yahoo_finance/base.py)：

- 一個擴展 `BaseToolSpec` 的 class
- 一組任意的 Python functions
- 一個映射了函式到工具 API 的 `spec_functions` list

一旦您成功建立了一個工具，請遵循我們的 [contributing guide](https://github.com/run-llama/llama_index/blob/main/CONTRIBUTING.md#steps-to-contribute) 以獲取關於正確設定 metadata 和提交 pull request 的說明。

接下來我們將探討 [如何在您的 agents 中維護 state](/python/framework/understanding/agent/state/)。