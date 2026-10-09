---
title: "使用 Opus 4.1 搭配 LlamaIndex"
---

在這個 notebook 中，我們將利用 [Claude Opus 4.1 by Anthropic](https://www.anthropic.com/news/claude-opus-4-1) 的進階編碼能力來建立一個可愛的網站，並在 LlamaIndex 內完成！

## 建構一個基於 Opus 4.1 的 LLM 助理

**1. 安裝所需的依賴項**

```
! pip install -q llama-index-llms-anthropic get-code-from-markdown
```

讓我們定義一個輔助函式來幫助我們從 Markdown 獲取程式碼：

```
from get_code_from_markdown import get_code_from_markdown




def fetch_code_from_markdown(markdown: str) -> str:
    return get_code_from_markdown(markdown, language="html")
```

現在讓我們初始化我們的 LLM：

```
import os
import getpass


os.environ["ANTHROPIC_API_KEY"] = getpass.getpass()
```

```
from llama_index.llms.anthropic import Anthropic


llm = Anthropic(model="claude-opus-4-1-20250805", max_tokens=12000)
```

```
res = llm.complete(
    "Can you build a llama-themed static HTML page, with cute little bouncing animations and blue/white/indigo as theme colors?"
)
```

現在讓我們獲取程式碼並寫入 HTML 檔案！

```
html_code = fetch_code_from_markdown(res.text)


with open("index.html", "w") as f:
    for block in html_code:
        f.write(block)
```

您現在可以下載 `index.html` 並查看結果 :)

![Llama Paradise HTML](/assets/02ac1a98f989.png)

## 使用 Opus 4.1 建構一個 agent

我們也可以使用 Claude Opus 4.1 建構一個簡單的計算器 agent

```
from llama_index.core.agent.workflow import FunctionAgent




def multiply(a: int, b: int) -> int:
    """Multiply two integers and return an integer"""
    return a * b




def add(a: int, b: int) -> int:
    """Sum two integers and return an integer"""
    return a + b




agent = FunctionAgent(
    name="CalculatorAgent",
    description="Useful to perform basic arithmetic operations",
    system_prompt="You are a calculator agent, you should perform arithmetic operations using the tools available to you.",
    tools=[multiply, add],
    llm=llm,
)
```

現在讓我們運行 agent 並獲取乘法的結果：

```
from llama_index.core.agent.workflow import ToolCall, ToolCallResult


handler = agent.run("What is 60 multiplied by 95?")


async for event in handler.stream_events():
    if isinstance(event, ToolCallResult):
        print(
            f"Result from calling tool {event.tool_name}:\n\n{event.tool_output}"
        )
    if isinstance(event, ToolCall):
        print(
            f"Calling tool {event.tool_name} with arguments:\n\n{event.tool_kwargs}"
        )


response = await handler


print("Final response")
print(response)
```

```
Calling tool multiply with arguments:


{'a': 60, 'b': 95}
Result from calling tool multiply:


5700
Final response
60 multiplied by 95 equals 5,700.
```

讓我們也用它來計算加法！

```
from llama_index.core.agent.workflow import ToolCall, ToolCallResult


handler = agent.run("What is 1234 plus 5678?")


async for event in handler.stream_events():
    if isinstance(event, ToolCallResult):
        print(
            f"Result from calling tool {event.tool_name}:\n\n{event.tool_output}"
        )
    if isinstance(event, ToolCall):
        print(
            f"Calling tool {event.tool_name} with arguments:\n\n{event.tool_kwargs}"
        )


response = await handler


print("Final response")
print(response)
```

```
Calling tool add with arguments:


{'a': 1234, 'b': 5678}
Result from calling tool add:


6912
Final response
1234 plus 5678 equals 6912.
```

如果您想了解更多關於 Anthropic 的內容，請查看我們的 [通用範例 notebook](https://developers.llamaindex.ai/python/framework/integrations/llm/opus_4_1/anthropic.ipynb/)