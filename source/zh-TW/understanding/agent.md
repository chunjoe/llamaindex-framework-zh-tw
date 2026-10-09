---
title: "建立 agent"
---

在 LlamaIndex 中，一個 agent 是一個半自主軟體，由 LLM 驅動，它會被賦予一個任務並執行一系列步驟來解決該任務。它會被給予一組工具，這些工具可以是任意函數，直到完整的 LlamaIndex query engines，並且它會選擇最適合的可用工具來完成每一步。當每一步完成後，agent 會判斷任務是否已完成，如果是，它會將結果回傳給使用者，否則它需要採取下一步，這時會回到開始。

在 LlamaIndex 中，你可以從頭開始 [建構你自己的 agentic workflows](https://developers.llamaindex.ai/python/llamaagents/workflows/)，內容涵蓋在「Building Workflows」部分，或者你可以使用我們預先建置的 agentic workflows，例如 `FunctionAgent`（一個簡單的 function/tool calling agent）或 `AgentWorkflow`（一個能夠管理多個 agents 的 agent）。本教學涵蓋如何使用 `FunctionAgent` 建構一個 function calling agent。

要了解建構多個 agent 系統的各種方法，請前往 [“Multi-agent systems”](/python/framework/understanding/agent/multi_agent/)。

![agent flow](/assets/29767c2c0b47.png)

## 開始使用

你可以在 [agents 教學儲存庫](https://github.com/run-llama/python-agents-tutorial) 中找到所有這些程式碼。

為了避免衝突並保持環境乾淨，我們將建立一個新的 Python 虛擬環境。你可以使用任何虛擬環境管理器，但我們在這裡使用 `poetry`：

終端機視窗

```
poetry init
poetry shell
```

然後我們將安裝 LlamaIndex 函式庫以及一些有用的其他依賴項：

終端機視窗

```
pip install llama-index-core llama-index-llms-openai python-dotenv
```

如果這些操作有任何問題，請查看我們的詳細 [安裝指南](/python/framework/getting_started/installation/)。

## OpenAI Key

我們的 agent 將由 OpenAI 的 `gpt-4o-mini` LLM 驅動，因此你需要一個 [API key](https://platform.openai.com/)。取得金鑰後，你可以將其放入專案根目錄中的一個 `.env` 檔案中：

終端機視窗

```
OPENAI_API_KEY=sk-proj-xxxx
```

如果你不想使用 OpenAI，你可以使用 [任何其他 LLM](/python/framework/understanding/using_llms/)，包括本地模型。Agents 需要具備能力的模型，因此較小的模型可能不太可靠。

## 引入依賴項

我們將從匯入 LlamaIndex 所需的組件開始，同時從我們的 `.env` 檔案中載入環境變數：

```
from dotenv import load_dotenv


load_dotenv()


from llama_index.llms.openai import OpenAI
from llama_index.core.agent.workflow import FunctionAgent
```


## 建立基本工具

對於這個簡單的範例，我們將建立兩個工具：一個知道如何將數字相乘，另一個知道如何將數字相加。

```
def multiply(a: float, b: float) -> float:
    """Multiply two numbers and returns the product"""
    return a * b




def add(a: float, b: float) -> float:
    """Add two numbers and returns the sum"""
    return a + b
```


如你所見，這些是普通的 Python 函數。在決定使用哪個工具時，你的 agent 會使用工具的名稱、參數和 docstring 來判斷該工具的作用以及它是否適合當前的任務。因此，確保 docstring 具有描述性和實用性非常重要。它也會使用 type hints 來判斷預期的參數和回傳類型。

## 初始化 LLM

`gpt-4o-mini` 將負責今天的運作：

```
llm = OpenAI(model="gpt-4o-mini")
```

你也可以選擇透過 API 存取的另一個流行模型，例如來自 [Mistral](https://developers.llamaindex.ai/python/examples/llm/mistralai/index.md)、[Claude from Anthropic](https://developers.llamaindex.ai/python/examples/llm/anthropic/index.md) 或 [Gemini from Google](https://developers.llamaindex.ai/python/examples/llm/google_genai/index.md)。

## 初始化 agent

現在我們建立我們的 agent。它需要一個工具陣列、一個 LLM，以及一個 system prompt 來告訴它應該成為什麼樣的 agent。你的 system prompt 通常會比這個更詳細！

```
workflow = FunctionAgent(
    tools=[multiply, add],
    llm=llm,
    system_prompt="You are an agent that can perform basic mathematical operations using tools.",
)
```

GPT-4o-mini 實際上足夠聰明，不需要工具來完成如此簡單的數學運算，這就是為什麼我們在 prompt 中指定它應該使用工具。

除了 `FunctionAgent` 之外，在 LlamaIndex 中還有其他 agents 可用，例如 [`ReActAgent`](https://developers.llamaindex.ai/python/examples/agent/react_agent/index.md) 和 [`CodeActAgent`](https://developers.llamaindex.ai/python/examples/agent/code_act_agent/index.md)，它們使用不同的 prompting 策略來執行工具。

## 提問現在我們可以要求 agent 進行一些數學運算：

```
response = await workflow.run(user_msg="What is 20+(2*4)?")
print(response)
```

請注意，這是異步程式碼。它可以在 notebook 環境中運行，但如果你想在一般的 Python 中運行它，你需要將它包裝成一個異步函式，如下所示：

```
async def main():
    response = await workflow.run(user_msg="What is 20+(2*4)?")
    print(response)




if __name__ == "__main__":
    import asyncio


    asyncio.run(main())
```

這應該會給你類似以下的輸出：

```
The result of (20 + (2 times 4)) is 28.
```

提示

有些模型可能不支援串流 LLM 輸出。雖然預設開啟串流，但如果你遇到錯誤，你可以隨時設定 `FunctionAgent(..., streaming=False)` 來禁用串流。

請查看 [repo](https://github.com/run-llama/python-agents-tutorial/blob/main/1_basic_agent.py) 以查看最終程式碼應該是什麼樣子。

恭喜！你已經建構了最基本的 agent。接下來我們來學習如何使用 [pre-built tools](/python/framework/understanding/agent/tools/)。