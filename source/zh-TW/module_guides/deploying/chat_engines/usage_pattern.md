---
title: "使用模式"
---

## 開始使用

從 index 建構一個聊天引擎：

```
chat_engine = index.as_chat_engine()
```

提示

要了解如何建構 index，請參閱 [索引](/python/framework/module_guides/indexing/index_guide/)

與您的資料進行對話：

```
response = chat_engine.chat("Tell me a joke.")
```

重置聊天記錄以開始新的對話：

```
chat_engine.reset()
```

進入互動式聊天 REPL：

```
chat_engine.chat_repl()
```

## 設定聊天引擎

設定聊天引擎與設定 query engine 非常相似。

### 高階 (High-Level) API

您只需一行程式碼即可直接從 index 建構和設定聊天引擎：

```
chat_engine = index.as_chat_engine(chat_mode="condense_question", verbose=True)
```

> 注意：您可以透過指定 `chat_mode` 作為 kwarg 來存取不同的聊天引擎。`condense_question` 對應於 `CondenseQuestionChatEngine`，`react` 對應於 `ReActChatEngine`，`context` 對應於 `ContextChatEngine`。

> 注意：雖然高階 API 旨在優化易用性，但它*不會*暴露完整的配置範圍。

#### 可用的聊天模式 (Available Chat Modes)

- `best` - 將 query engine 轉變為一個 tool，用於與 `ReAct` 資料 agent 或 `OpenAI` 資料 agent 配合使用，取決於您的 LLM 支援的內容。`OpenAI` 資料 agents 需要 `gpt-3.5-turbo` 或 `gpt-4`，因為它們使用 API 的 function calling 功能來自 OpenAI。
- `condense_question` - 查看聊天記錄並將使用者訊息重寫為 index 的 query。在讀取 query engine 的回應後返回回應。
- `context` - 使用每一個使用者訊息從 index 中檢索 nodes。檢索到的文字會插入到 system prompt 中，以便聊天引擎可以自然回應或使用 query engine 的上下文。
- `condense_plus_context` - `condense_question` 和 `context` 的組合。查看聊天記錄並將使用者訊息重寫為 index 的 retrieval query。檢索到的文字會插入到 system prompt 中，以便聊天引擎可以自然回應或使用 query engine 的上下文。
- `simple` - 直接與 LLM 進行簡單的聊天，不涉及 query engine。
- `react` - 與 `best` 相同，但強制使用 `ReAct` 資料 agent。
- `openai` - 與 `best` 相同，但強制使用 `OpenAI` 資料 agent。

### 低階組合 (Low-Level Composition) API

如果您需要更細緻的控制，可以使用低階組合 API。具體來說，您會明確建構 `ChatEngine` 物件，而不是呼叫 `index.as_chat_engine(...)`。

> 注意：您可能需要查看 API 的參考或範例 notebook。

以下是一個配置的範例：

- 設定 condense question prompt，
- 使用現有的歷史記錄初始化對話，
- 列印詳細的 debug 訊息。

```
from llama_index.core import PromptTemplate
from llama_index.core.llms import ChatMessage, MessageRole
from llama_index.core.chat_engine import CondenseQuestionChatEngine


custom_prompt = PromptTemplate(
    """\
Given a conversation (between Human and Assistant) and a follow up message from Human, \
rewrite the message to be a standalone question that captures all relevant context \
from the conversation.


<Chat History>
{chat_history}


<Follow Up Message>
{question}


<Standalone question>
"""
)


# list of `ChatMessage` objects
custom_chat_history = [
    ChatMessage(
        role=MessageRole.USER,
        content="Hello assistant, we are having a insightful discussion about Paul Graham today.",
    ),
    ChatMessage(role=MessageRole.ASSISTANT, content="Okay, sounds good."),
]


query_engine = index.as_query_engine()
chat_engine = CondenseQuestionChatEngine.from_defaults(
    query_engine=query_engine,
    condense_question_prompt=custom_prompt,
    chat_history=custom_chat_history,
    verbose=True,
)
```

### 串流 (Streaming)

要啟用串流，您只需呼叫 `stream_chat` endpoint，而不是 `chat` endpoint。

!!! warning 這與 query engine (您傳入 `streaming=True` flag 的地方) 有點不一致。我們正在努力使行為更一致！

**同步 (Synchronous) (`stream_chat`):**

```
chat_engine = index.as_chat_engine()
streaming_response = chat_engine.stream_chat("Tell me a joke.")


for token in streaming_response.response_gen:
    print(token, end="")
```

**非同步 (Asynchronous) (`astream_chat`):**

在使用 async framework (如 FastAPI) 時，請使用 astream\_chat。請注意，您必須等待呼叫並迭代提供的 async streaming interface (例如 async\_response\_gen() 或 achat\_stream)。

```
chat_engine = index.as_chat_engine()
streaming_response = await chat_engine.astream_chat("Tell me a joke.")


async for token in streaming_response.async_response_gen():
    print(token, end="")
```

參閱 [端到端教學](https://developers.llamaindex.ai/python/examples/customization/streaming/chat_engine_condense_question_stream_response/index.md)