---
title: "記憶體"
---

## 概念

記憶體是 Agent 系統的核心元件，可儲存並取回過去的資訊。

在 LlamaIndex 中，你通常可以使用現有的 `BaseMemory` 類別自訂記憶體，或自行建立自訂實作。

Agent 執行期間會呼叫 `memory.put()` 儲存資訊，並呼叫 `memory.get()` 取回資訊。

**注意：** `ChatMemoryBuffer` 已棄用。未來版本會以 `Memory` 類別取代預設實作；這個類別更具彈性，也支援更複雜的記憶體設定。本節範例都會使用 `Memory` 類別。目前整個 framework 預設仍使用 `ChatMemoryBuffer`，建立基本的對話紀錄緩衝區，讓 Agent 取得符合 token 上限的最近 X 則訊息。`Memory` 類別的運作方式相近，但更具彈性，也能支援更複雜的記憶體設定。

## 使用方式

使用 `Memory` 類別可以建立同時包含短期記憶（也就是 FIFO 訊息佇列）與可選長期記憶（也就是隨時間擷取資訊）的記憶體。

### 為 Agent 設定 Memory

將記憶體傳入 `run()` 方法，即可為 Agent 設定記憶體：

```
from llama_index.core.agent.workflow import FunctionAgent
from llama_index.core.memory import Memory


memory = Memory.from_defaults(session_id="my_session", token_limit=40000)


agent = FunctionAgent(llm=llm, tools=tools)


response = await agent.run("<question that invokes tool>", memory=memory)
```

### 手動管理 Memory

你也可以直接呼叫 `memory.put_messages()` 和 `memory.get()`，並傳入對話紀錄，手動管理記憶體。

```
from llama_index.core.agent.workflow import FunctionAgent
from llama_index.core.llms import ChatMessage
from llama_index.core.memory import Memory




memory = Memory.from_defaults(session_id="my_session", token_limit=40000)
memory.put_messages(
    [
        ChatMessage(role="user", content="Hello, world!"),
        ChatMessage(role="assistant", content="Hello, world to you too!"),
    ]
)
chat_history = memory.get()


agent = FunctionAgent(llm=llm, tools=tools)


# passing in the chat history overrides any existing memory
response = await agent.run(
    "<question that invokes tool>", chat_history=chat_history
)
```

### 從 Agent 取得最新記憶

你可以從 Agent 的 context 取得最新記憶：

```
from llama_index.core.workflow import Context


ctx = Context(agent)


response = await ctx.run("<question that invokes tool>", ctx=ctx)


# get the memory
memory = await ctx.store.get("memory")
chat_history = memory.get()
```

## 自訂 Memory

### 短期記憶

`Memory` 類別預設會在 token 上限內保留最近的 X 則訊息。你可以透過 `token_limit` 和 `chat_history_token_ratio` 引數傳給 `Memory` 類別，自訂其設定。

- `token_limit`（預設值：30000）：短期與長期記憶可儲存的 token 數上限。
- `chat_history_token_ratio`（預設值：0.7）：短期對話紀錄所占的 token 比例上限。如果對話紀錄超過這個比例，且已啟用長期記憶，最舊的訊息就會移入長期記憶。
- `token_flush_size`（預設值：3000）：對話紀錄超過 token 上限時，要移入長期記憶的 token 數。

```
memory = Memory.from_defaults(
    session_id="my_session",
    token_limit=40000,
    chat_history_token_ratio=0.7,
    token_flush_size=3000,
)
```

### 長期記憶

長期記憶以 `Memory Block` 物件表示。這些物件會接收從短期記憶移出的訊息，也可以處理訊息以擷取資訊。取回記憶時，系統會合併短期與長期記憶。

目前預先定義了三種記憶區塊：

- `StaticMemoryBlock`：儲存固定資訊的記憶區塊。
- `FactExtractionMemoryBlock`：從對話紀錄擷取事實的記憶區塊。
- `VectorMemoryBlock`：透過向量資料庫儲存及取回多批對話訊息的記憶區塊。

預設會根據 `insert_method` 引數，將記憶區塊插入 system message 或最新的 user message。

這聽起來有點複雜，其實很簡單。來看一個範例：

```
from llama_index.core.memory import (
    StaticMemoryBlock,
    FactExtractionMemoryBlock,
    VectorMemoryBlock,
)


blocks = [
    StaticMemoryBlock(
        name="core_info",
        static_content="My name is Logan, and I live in Saskatoon. I work at LlamaIndex.",
        priority=0,
    ),
    FactExtractionMemoryBlock(
        name="extracted_info",
        llm=llm,
        max_facts=50,
        priority=1,
    ),
    VectorMemoryBlock(
        name="vector_memory",
        # required: pass in a vector store like qdrant, chroma, weaviate, milvus, etc.
        vector_store=vector_store,
        priority=2,
        embed_model=embed_model,
        # The top-k message batches to retrieve
        # similarity_top_k=2,
        # optional: How many previous messages to include in the retrieval query
        # retrieval_context_window=5
        # optional: pass optional node-postprocessors for things like similarity threshold, etc.
        # node_postprocessors=[...],
    ),
]
```

這裡設定了三個記憶區塊：

- `core_info`：靜態記憶區塊，用來保存使用者的基本資訊。靜態內容可以是字串，也可以是 `ContentBlock` 物件清單，例如 `TextBlock`、`ImageBlock` 等。這些資訊會一直保留在記憶體中。
- `extracted_info`：事實擷取記憶區塊，會從對話紀錄擷取資訊。這裡傳入 `llm`，用來從移出的對話訊息擷取事實，並將 `max_facts` 設為 50。若擷取的事實超過上限，系統會自動摘要並縮減 `max_facts`，為新資訊騰出空間。
- `vector_memory`：向量記憶區塊，會透過向量資料庫儲存及取回多批對話訊息。每一批都是一組已移出的對話訊息。這裡傳入 `vector_store` 和 `embed_model`，用來儲存及取回訊息。

你也會看到我們為每個區塊設定了 `priority`。當記憶區塊內容（也就是長期記憶）加上短期記憶超過 `Memory` 物件的 token 上限時，系統會依此決定如何處理。

記憶區塊過長時會自動「截斷」。預設做法是先從記憶體移除內容，直到騰出足夠空間。你也可以建立子類別並實作自己的截斷邏輯。

- `priority=0`：此區塊永遠保留在記憶體中。
- `priority=1, 2, 3, etc`：記憶體超過 token 上限時，這個值決定記憶區塊的截斷順序，讓短期與長期記憶的總內容不超過 `token_limit`。

現在把這些區塊傳入 `Memory`：

```
memory = Memory.from_defaults(
    session_id="my_session",
    token_limit=40000,
    memory_blocks=blocks,
    insert_method="system",
)
```

使用記憶體的過程中，短期記憶會逐漸填滿。超過 `chat_history_token_ratio` 後，系統會將符合 `token_flush_size` 的最舊訊息移出，交由各記憶區塊處理。

取回記憶時，短期與長期記憶會合併。`Memory` 物件會確保兩者的總內容不超過 `token_limit`；如果超過，就會呼叫記憶區塊的 `.truncate()` 方法，並依 `priority` 決定截斷順序。

提示

預設使用 tiktoken 計算 token 數。若要自訂計算方式，可以將 `tokenizer_fn` 設為自訂 callable；它會接收字串並回傳清單，再以清單長度計算 token 數。

記憶體累積足夠資訊後，可能會呈現如下內容：

```
# optionally pass in a list of messages to get, which will be forwarded to the memory blocks
chat_history = memory.get(messages=[...])


print(chat_history[0].content)
```

輸出內容會類似這樣：

```
<memory>
<static_memory>
My name is Logan, and I live in Saskatoon. I work at LlamaIndex.
</static_memory>
<fact_extraction_memory>
<fact>Fact 1</fact>
<fact>Fact 2</fact>
<fact>Fact 3</fact>
</fact_extraction_memory>
<retrieval_based_memory>
<message role='user'>Msg 1</message>
<message role='assistant'>Msg 2</message>
<message role='user'>Msg 3</message>
</retrieval_based_memory>
</memory>
```

此處將記憶插入 system message，並為每個記憶區塊提供專屬區段。

## 自訂記憶區塊

除了預先定義的記憶區塊，你也可以建立自己的自訂記憶區塊。

```
from typing import Optional, List, Any
from llama_index.core.llms import ChatMessage
from llama_index.core.memory.memory import BaseMemoryBlock




# use generics to define the output type of the memory block
# can be str or List[ContentBlock]
class MentionCounter(BaseMemoryBlock[str]):
    """
    A memory block that counts the number of times a user mentions a specific name.
    """


    mention_name: str = "Logan"
    mention_count: int = 0


    async def _aget(
        self, messages: Optional[List[ChatMessage]] = None, **block_kwargs: Any
    ) -> str:
        return f"Logan was mentioned {self.mention_count} times."


    async def _aput(self, messages: List[ChatMessage]) -> None:
        for message in messages:
            if self.mention_name in message.content:
                self.mention_count += 1


    async def atruncate(
        self, content: str, tokens_to_truncate: int
    ) -> Optional[str]:
        return ""
```

這裡定義了一個計算使用者提及特定名稱次數的記憶區塊。

它的 truncate 方法很簡單，只會回傳空字串。

### 遠端記憶體

`Memory` 預設使用記憶體內的 SQLite 資料庫。你可以變更 database URI，改用任何遠端資料庫。

你可以自訂資料表名稱，也可以直接傳入 async engine。這對自行管理 connection pool 很有幫助。

```
from llama_index.core.memory import Memory


memory = Memory.from_defaults(
    session_id="my_session",
    token_limit=40000,
    async_database_uri="postgresql+asyncpg://postgres:mark90@localhost:5432/postgres",
    # Optional: specify a table name
    # table_name="memory_table",
    # Optional: pass in an async engine directly
    # this is useful for managing your own connection pool
    # async_engine=engine,
)
```


### 自訂 Chat Store

如果 SQLAlchemy 不符合你的基礎架構需求，可以實作 `AsyncDBChatStore` 介面，並將實作作為 `chat_store` 傳入。SQL 專用引數（`table_name`、`async_database_uri`、`async_engine`、`db_schema`）會在提供 `chat_store` 時忽略。

```
from llama_index.core.memory import Memory
from llama_index.core.storage.chat_store.base_db import (
    AsyncDBChatStore,
    MessageStatus,
)




class MyChatStore(AsyncDBChatStore):
    # implement get_messages, add_message(s), set_messages,
    # delete_message(s), delete_oldest_messages,
    # archive_oldest_messages, count_messages and get_keys
    ...




memory = Memory.from_defaults(
    session_id="my_session",
    token_limit=40000,
    chat_store=MyChatStore(),
)
```


## Memory 與 Workflow Context

閱讀到這裡，你可能已經遇過使用 Workflow，並將 `Context` 物件序列化以儲存及恢復特定 Workflow 狀態的情況。Workflow 的 `Context` 是複合物件，包含 Workflow 的執行階段資訊，以及供不同 Workflow 步驟共用的 key/value 配對。

相較之下，`Memory` 物件較為精簡，只保存 `ChatMessage` 物件，以及可選的 `MemoryBlock` 清單以提供長期記憶。

在多數實際情境中，兩者會一起使用。如果你沒有自訂記憶體，序列化 `Context` 物件就足以保存所需狀態。

```
from llama_index.core.workflow import Context


ctx = Context(workflow)


# serialize the context
ctx_dict = ctx.to_dict()


# deserialize the context
ctx = Context.from_dict(workflow, ctx_dict)
```
在其他情況下，例如使用 `FunctionAgent`、`AgentWorkflow` 或 `ReActAgent` 時，如果你自訂了記憶體，就需要將它做為獨立的 runtime argument 傳入（特別是使用超出預設設定的功能時，`Memory` 物件便無法序列化）。

```
response = await agent.run("Hello!", memory=memory)
```

最後，有些情況（例如[人在迴圈中的流程](/python/framework/understanding/agent/human_in_the_loop/)）需要同時提供 `Context`（用來恢復 Workflow）與 `Memory`（用來保存對話紀錄）。

```
response = await agent.run("Hello!", ctx=ctx, memory=memory)
```

## （已棄用）記憶體類型

在 `llama_index.core.memory` 中，我們提供幾種不同的記憶體類型：

- `ChatMemoryBuffer`：基本的記憶體緩衝區，會保存符合 token 上限的最近 X 則訊息。
- `ChatSummaryMemoryBuffer`：記憶體緩衝區，會保存符合 token 上限的最近 X 則訊息；對話變得太長時，也會定期摘要。
- `VectorMemory`：透過向量資料庫儲存及取回對話訊息。它不保證訊息順序，並會回傳與最新使用者訊息最相似的內容。
- `SimpleComposableMemory`：將多個記憶體組合在一起，通常用來搭配 `VectorMemory` 與 `ChatMemoryBuffer` 或 `ChatSummaryMemoryBuffer`。

## 範例

以下提供幾個記憶體的實際使用範例：

- [記憶體](https://developers.llamaindex.ai/python/examples/memory/memory/index.md)
- [執行期間操作記憶體](https://developers.llamaindex.ai/python/examples/memory/custom_memory/index.md)
- [使用自訂記憶體減少多輪對話混淆](https://developers.llamaindex.ai/python/examples/memory/custom_multi_turn_memory/index.md)

**注意：**以下範例已棄用：

- [Chat 記憶體緩衝區](https://developers.llamaindex.ai/python/examples/agent/memory/chat_memory_buffer/index.md)
- [Chat 摘要記憶體緩衝區](https://developers.llamaindex.ai/python/examples/agent/memory/summary_memory_buffer/index.md)
- [可組合記憶體](https://developers.llamaindex.ai/python/examples/agent/memory/composable_memory/index.md)
- [向量記憶體](https://developers.llamaindex.ai/python/examples/agent/memory/vector_memory/index.md)
- [Mem0 記憶體](https://developers.llamaindex.ai/python/examples/memory/mem0memory/index.md)