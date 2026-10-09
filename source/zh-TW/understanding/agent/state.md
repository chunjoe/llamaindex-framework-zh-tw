---
title: "維持狀態"
---

預設情況下，`AgentWorkflow` 在不同運行之間是無狀態的。這意味著 agent 不會記住先前的運行。

為了維持狀態，我們需要追蹤先前的狀態。在 LlamaIndex 中，Workflows 有一個 `Context` 類別，可用於在運行內部和運行之間維持狀態。由於 AgentWorkflow 只是預先建置的 Workflow，我們現在也可以使用它。

```
from llama_index.core.workflow import Context
```

為了在運行之間維持狀態，我們將建立一個名為 ctx 的新 Context。我們將我們的 workflow 傳入，以便為將使用它的 workflow 正確配置此 Context 物件。

```
ctx = Context(workflow)
```

使用我們配置好的 Context，我們可以將其傳遞給我們的第一次運行。

```
response = await workflow.run(user_msg="Hi, my name is Laurie!", ctx=ctx)
print(response)
```

這會給我們：

```
Hello Laurie! How can I assist you today?
```

現在，如果我們再次運行 workflow 來詢問後續問題，它就會記住該資訊：

```
response2 = await workflow.run(user_msg="What's my name?", ctx=ctx)
print(response2)
```

這會給我們：

```
Your name is Laurie!
```

## 在較長時間內維持狀態

Context 是可序列化的，因此可以儲存到資料庫、檔案等，並稍後載入回來。

JsonSerializer 是一個簡單的序列化器，它使用 `json.dumps` 和 `json.loads` 來序列化和反序列化 context。

JsonPickleSerializer 是一個使用 pickle 來序列化和反序列化 context 的序列化器。如果您在 context 中有不可序列化的物件，您可以使用此序列化器。

我們像其他任何匯入一樣引入我們的序列化器：

```
from llama_index.core.workflow import JsonPickleSerializer, JsonSerializer
```

然後我們可以將我們的 context 序列化為字典並儲存到檔案中：

```
ctx_dict = ctx.to_dict(serializer=JsonSerializer())
```

我們可以將其反序列化回 Context 物件，並像以前一樣提問：

```
restored_ctx = Context.from_dict(
    workflow, ctx_dict, serializer=JsonSerializer()
)


response3 = await workflow.run(user_msg="What's my name?", ctx=restored_ctx)
```

您可以在 [此範例的完整程式碼](https://github.com/run-llama/python-agents-tutorial/blob/main/3_state.py) 中查看。

## 工具和狀態

也可以定義具有存取 workflow context 的工具。這意味著您可以設定和檢索 context 中的變數並在工具中使用它們，或在工具之間傳遞資訊。

`AgentWorkflow` 使用一個名為 `state` 的 context 變數，該變數對每個 agent 都可用。您可以依賴 `state` 中的資訊是可用的，而無需明確傳遞。

要存取 Context，Context 參數應是工具的第一個參數，就像我們在這裡做的那樣，在一個僅為狀態添加名稱的工具中：

```
async def set_name(ctx: Context, name: str) -> str:
    async with ctx.store.edit_state() as ctx_state:
        ctx_state["state"]["name"] = name


    return f"Name set to {name}"
```

我們現在可以建立一個使用此工具的 agent。您可以選擇性地提供 agent 的初始狀態，我們在這裡這樣做：

```
workflow = AgentWorkflow.from_tools_or_functions(
    [set_name],
    llm=llm,
    system_prompt="You are a helpful assistant that can set a name.",
    initial_state={"name": "unset"},
)
```

現在我們可以建立一個 Context 並詢問 agent 關於狀態：

```
ctx = Context(workflow)


# check if it knows a name before setting it
response = await workflow.run(user_msg="What's my name?", ctx=ctx)
print(str(response))
```

這會給我們：

```
Your name has been set to "unset."
```

然後我們可以在 agent 的新運行中明確設定名稱：

```
response2 = await workflow.run(user_msg="My name is Laurie", ctx=ctx)
print(str(response2))
```

```
Your name has been updated to "Laurie."
```

我們現在可以再次詢問 agent 名稱，或者我們可以直接存取狀態的值：

```
state = await ctx.store.get("state")
print("Name as stored in state: ", state["name"])
```

這會給我們：

```
Name as stored in state: Laurie
```

您可以在 [此範例的完整程式碼](https://github.com/run-llama/python-agents-tutorial/blob/main/3a_tools_and_state.py) 中查看。

接下來我們將學習 [streaming output and events](/python/framework/understanding/agent/streaming/)。