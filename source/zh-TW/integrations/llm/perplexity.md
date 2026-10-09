---
title: "Perplexity"
---

Perplexity 的 Sonar API 提供了一種結合即時、有依據的網路搜尋與進階推理及深度研究能力的解決方案。

使用時機：

- 當您的應用程式需要直接從網路上獲取及時、相關的資料時，例如動態內容更新或即時事件追蹤。
- 對於需要整合推理和深度研究來支援複雜使用者查詢的產品，例如數位助理或進階搜尋引擎。

在開始之前，請確保您已安裝 `llama_index`

```
%pip install llama-index-llms-perplexity
```

```
!pip install llama-index
```

## 初始化設定

截至 2025 年 4 月 12 日，在 LLaMa Index 中，以下模型支援 Perplexity LLM 類別：

| 模型 | 上下文長度 | 模型類型 |
| :--- | :--- | :--- |
| `sonar-deep-research` | 128k | Chat Completion |
| `sonar-reasoning-pro` | 128k | Chat Completion |
| `sonar-reasoning` | 128k | Chat Completion |
| `sonar-pro` | 200k | Chat Completion |
| `sonar` | 128k | Chat Completion |
| `r1-1776` | 128k | Chat Completion |

- `sonar-pro` 的最大輸出 token 限制為 8k。
- 推理模型會輸出 Chain of Thought 回應。
- `r1-1776` 是一個離線聊天模型，不使用 Perplexity 搜尋子系統。

您可以在 [這裡](https://docs.perplexity.ai/docs/model-cards) 找到最新的支援模型
速率限制可以在 [這裡](https://docs.perplexity.ai/docs/rate-limits) 找到
定價可以在 [這裡](https://docs.perplexity.ai/guides/pricing) 找到。

```
import getpass
import os


if "PPLX_API_KEY" not in os.environ:
    os.environ["PPLX_API_KEY"] = getpass.getpass(
        "Enter your Perplexity API key: "
    )
```

```
from llama_index.llms.perplexity import Perplexity


PPLX_API_KEY = __import__("os").environ.get("PPLX_API_KEY")


llm = Perplexity(api_key=PPLX_API_KEY, model="sonar-pro", temperature=0.2)
```

```
# Import the ChatMessage class from the llama_index library.
from llama_index.core.llms import ChatMessage


# Create a list of dictionaries where each dictionary represents a chat message.
# Each dictionary contains a 'role' key (e.g., system or user) and a 'content' key with the corresponding message.
messages_dict = [
    {"role": "system", "content": "Be precise and concise."},
    {
        "role": "user",
        "content": "Tell me the latest news about the US Stock Market.",
    },
]


# Convert each dictionary in the list to a ChatMessage object using unpacking (**msg) in a list comprehension.
messages = [ChatMessage(**msg) for msg in messages_dict]


# Print the list of ChatMessage objects to verify the conversion.
print(messages)
```

```
[ChatMessage(role=<MessageRole.SYSTEM: 'system'>, additional_kwargs={}, blocks=[TextBlock(block_type='text', text='Be precise and concise.')]), ChatMessage(role=<MessageRole.USER: 'user'>, additional_kwargs={}, blocks=[TextBlock(block_type='text', text='Tell me the latest news about the US Stock Market.')])]
```

## 聊天 (Chat)

```
response = llm.chat(messages)
print(response)
```

```
assistant: The latest update on the U.S. stock market indicates a strong performance recently. A significant 10% rally occurred on Wednesday, which contributed substantially to market gains. Additionally, the market closed strongly on Friday, with a 2% increase, ending near the intraday high. This reflects robust momentum, particularly in mega and large-cap growth stocks[1].
```

## 異步聊天 (Async Chat)

對於異步對話處理，請使用 `achat` 方法發送訊息並等待回應：

```
# Asynchronously send the list of chat messages to the LLM using the 'achat' method.
# This method returns a ChatResponse object containing the model's answer.
response = await llm.achat(messages)


print(response)
```

```
assistant: The U.S. stock market has recently experienced significant gains. A major rally on Wednesday resulted in a 10% surge, contributing substantially to the market's overall upside. Additionally, the market closed strongly on Friday, with a 2% increase, ending near the intraday high. This performance highlights robust momentum, particularly in mega-cap and large-cap growth stocks[1].
```

## 串流聊天 (Stream Chat)

在需要即時逐個 token 接收回應的情況下，請使用 `stream_chat` 方法：

```
# Call the stream_chat method on the LLM instance, which returns a generator or iterable
# for streaming the chat response one delta (token or chunk) at a time.
response = llm.stream_chat(messages)


# Iterate over each streaming response chunk.
for r in response:
    # Print the delta (the new chunk of generated text) without adding a newline.
    print(r.delta, end="")
```

```
The latest news about the U.S. stock market indicates a strong performance recently. The New York Stock Exchange (NYSE) experienced a significant rally, with a 10% surge on Wednesday, followed by a 2% gain on Friday. This upward momentum brought the market near its intraday high, driven by strength in mega-cap and large-cap growth stocks[1].
```

## 異步串流聊天 (Async Stream Chat)

同樣地，對於異步串流，`astream_chat` 方法提供了一種異步處理回應 delta 的方式：

```
# Asynchronously call the astream_chat method on the LLM instance,
# which returns an asynchronous generator that yields response chunks.
resp = await llm.astream_chat(messages)


# Asynchronously iterate over each response chunk from the generator.
# For each chunk (delta), print the chunk's text content.
async for delta in resp:
    print(delta.delta, end="")
```

```
The latest updates on the U.S. stock market indicate significant positive momentum. The New York Stock Exchange (NYSE) experienced a strong rally, with a notable 10% surge on Wednesday. This was followed by a 2% gain on Friday, closing near the intraday high. The market's performance has been driven by mega and large-cap growth stocks, contributing to the overall upside[1].
```

### 工具呼叫 (Tool calling)

Perplexity 模型可以輕鬆地包裝成一個 llamaindex tool，以便在您的資料處理或對話 workflows 中被呼叫。此工具使用由 Perplexity 驅動的即時生成式搜尋，並配置了更新的預設模型 (“sonar-pro”) 以及啟用 enable\_search\_classifier 參數。

以下是如何定義和註冊該工具的範例：

```
from llama_index.core.tools import FunctionTool
from llama_index.llms.perplexity import Perplexity
from llama_index.core.llms import ChatMessage




def query_perplexity(query: str) -> str:
    """
    Queries the Perplexity API via the LlamaIndex integration.


    This function instantiates a Perplexity LLM with updated default settings
    (using model "sonar-pro" and enabling search classifier so that the API can
    intelligently decide if a search is needed), wraps the query into a ChatMessage,
    and returns the generated response content.
    """
    pplx_api_key = (
        "your-perplexity-api-key"  # Replace with your actual API key
    )


    llm = Perplexity(
        api_key=pplx_api_key,
        model="sonar-pro",
        temperature=0.7,
        enable_search_classifier=True,  # This will determine if the search component is necessary in this particular context
    )


    messages = [ChatMessage(role="user", content=query)]
    response = llm.chat(messages)
    return response.message.content




# Create the tool from the query_perplexity function
query_perplexity_tool = FunctionTool.from_defaults(fn=query_perplexity)
```
