---
title: "人機協作"
---

工具也可以定義能將人納入迴圈的工具。這對於需要人工輸入的任務很有用，例如確認工具呼叫或提供回饋。

如我們在 [Workflows tutorial](https://developers.llamaindex.ai/python/llamaagents/workflows/) 中看到的，Workflows 在 AgentWorkflow 的底層運作方式是執行會發出和接收事件的步驟。以下是構成 AgentWorkflow 的步驟（藍色）以及在它們之間傳遞資料的事件（綠色）的圖表。你會認出這些事件，它們是我們在早期輸出流中處理的那些事件。

![Workflows diagram](/assets/bbffd6680be0.jpg)

為了將人納入迴圈，我們會讓我們的工具發出一個未被 workflow 中任何其他步驟接收的事件。然後我們會告訴我們的工具等待接收一個特定的「reply」事件。

我們內建了 `InputRequiredEvent` 和 `HumanResponseEvent` 事件可用於此目的。如果你想捕捉不同形式的人工輸入，你可以繼承這些事件以符合你自己的偏好。讓我們匯入它們：

```
from llama_index.core.workflow import (
    InputRequiredEvent,
    HumanResponseEvent,
)
```

接下來，我們將建立一個執行假設危險任務的工具。這裡有幾件新事情發生：

- `wait_for_event` 用於等待 HumanResponseEvent。
- `waiter_event` 是寫入事件流的事件，讓呼叫者知道我們正在等待回應。
- `waiter_id` 是此特定等待呼叫的唯一識別碼。它有助於確保我們為每個 `waiter_id` 只發送一個 `waiter_event`。
- `requirements` 參數用於指定我們希望等待具有特定 `user_name` 的 HumanResponseEvent。

```
from llama_index.core.workflow import Context




async def dangerous_task(ctx: Context) -> str:
    """A dangerous task that requires human confirmation."""


    # emit a waiter event (InputRequiredEvent here)
    # and wait until we see a HumanResponseEvent
    question = "Are you sure you want to proceed? "
    response = await ctx.wait_for_event(
        HumanResponseEvent,
        waiter_id=question,
        waiter_event=InputRequiredEvent(
            prefix=question,
            user_name="Laurie",
        ),
        requirements={"user_name": "Laurie"},
    )


    # act on the input from the event
    if response.response.strip().lower() == "yes":
        return "Dangerous task completed successfully."
    else:
        return "Dangerous task aborted."
```

我們像往常一樣建立我們的 agent，將我們剛定義的工具傳遞給它：

```
workflow = FunctionAgent(
    tools=[dangerous_task],
    llm=llm,
    system_prompt="You are a helpful assistant that can perform dangerous tasks.",
)
```

現在我們可以執行 workflow，像處理任何其他串流事件一樣處理 `InputRequiredEvent`，並使用 `send_event` 方法回應一個傳入的 `HumanResponseEvent`：

```
handler = workflow.run(user_msg="I want to proceed with the dangerous task.")


async for event in handler.stream_events():
    if isinstance(event, InputRequiredEvent):
        # capture keyboard input
        response = input(event.prefix)
        # send our response back
        handler.ctx.send_event(
            HumanResponseEvent(
                response=response,
                user_name=event.user_name,
            )
        )


response = await handler
print(str(response))
```

像往常一樣，你可以看到 [this example 的完整程式碼](https://github.com/run-llama/python-agents-tutorial/blob/main/5_human_in_the_loop.py)。

你可以做任何你想捕捉的輸入；你可以使用 GUI、音訊輸入，甚至讓另一個獨立的 agent 參與其中。如果你的輸入需要花費時間，或發生在另一個程序中，你可能想 [serialize the context](/python/framework/understanding/agent/state/) 並將其儲存到資料庫或檔案，以便你稍後可以恢復 workflow。

說到讓其他 agents 參與其中，就引導我們進入下一節，詳細說明幾種建立 [multi-agent systems](/python/framework/understanding/agent/multi_agent/) 的方法。