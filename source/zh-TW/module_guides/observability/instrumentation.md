---
title: "儀器"
---

**注意**：`instrumentation` 模組（在 llama-index v0.10.20 及更高版本中可用）旨在取代舊版的 `callbacks` 模組。在棄用期間，llama-index 函式庫同時支援這兩個模組，作為對您的 LLM 應用程式進行儀器化（instrumentation）的手段。然而，在所有現有整合都已遷移到新的 `instrumentation` 模組之後，我們將不再支援 `callbacks` 模組。

新的 `instrumentation` 模組允許對 `llama-index` 應用程式進行儀器化。特別是，可以同時使用自訂邏輯以及模組提供的功能來處理事件和追蹤 spans。使用者也可以定義自己的事件，並指定在程式碼邏輯的何處以及何時應發出這些事件。以下列出 `instrumentation` 模組的核心類別及其簡要描述：

- `Event` — 代表應用程式程式碼執行過程中某個特定時間點發生的單一事件。
- `EventHandler` — 監聽 `Event` 的事件，並在這些時間點執行程式碼邏輯。
- `Span` — 代表應用程式程式碼中特定部分的執行流程，因此包含 `Event`。
- `SpanHandler` — 負責處理 `Span` 的進入、退出和丟棄（即因錯誤而提前退出）。
- `Dispatcher` — 發出 `Event`，以及信號以進入/退出/丟棄 `Span` 到適當的處理器。

## 使用儀器化模組進行可觀察性（Observability）

儀器化的核心用途是可觀察性。我們與第三方合作夥伴的原生儀器化整合，讓您可以獲得整個呼叫堆疊的詳細追蹤。

請參閱我們的 [observability guide](/python/framework/module_guides/observability/) 以了解更多關於支援合作夥伴的詳細資訊。

## 使用方法

使用新的 `instrumentation` 模組涉及 3 個高階步驟。

1. 定義一個 `dispatcher`
2. (可選) 定義並將您的 `EventHandler` 附加到 `dispatcher`
3. (可選) 定義並將您的 `SpanHandler` 附加到 `dispatcher`

這樣做將使您能夠處理在 `llama-index` 函式庫和擴充套件中傳輸的所有事件和獲取 spans。

例如，如果我想追蹤函式庫中發出的每一個 LLM 呼叫：

```
from typing import Dict, List


from llama_index.core.instrumentation.events.llm import (
    LLMChatEndEvent,
    LLMChatStartEvent,
    LLMChatInProgressEvent,
)




class ExampleEventHandler(BaseEventHandler):
    events: List[BaseEvent] = []


    @classmethod
    def class_name(cls) -> str:
        """Class name."""
        return "ExampleEventHandler"


    def handle(self, event: BaseEvent) -> None:
        """Logic for handling event."""
        print("-----------------------")
        # all events have these attributes
        print(event.id_)
        print(event.timestamp)
        print(event.span_id)


        # event specific attributes
        if isinstance(event, LLMChatStartEvent):
            # initial
            print(event.messages)
            print(event.additional_kwargs)
            print(event.model_dict)
        elif isinstance(event, LLMChatInProgressEvent):
            # streaming
            print(event.response.delta)
        elif isinstance(event, LLMChatEndEvent):
            # final response
            print(event.response)


        self.events.append(event)
        print("-----------------------")
```

請參閱 [完整指南](https://developers.llamaindex.ai/python/examples/instrumentation/instrumentation_observability_rundown/index.md) 了解所有記錄在 LlamaIndex 中的事件，或造訪 [api reference](https://developers.llamaindex.ai/python/framework-api-reference/instrumentation/index.md) 了解更多詳細資訊。

### 定義自訂的 `EventHandler`

使用者可以透過繼承 `BaseEventHandler` 並為抽象方法 `handle()` 提供邏輯，來建立自己的自訂處理器（handler）。

```
from llama_index.core.instrumentation.event_handlers.base import (
    BaseEventHandler,
)




class MyEventHandler(BaseEventHandler):
    """My custom EventHandler."""


    @classmethod
    def class_name(cls) -> str:
        """Class name."""
        return "MyEventHandler"


    def handle(self, event: BaseEvent, **kwargs) -> Any:
        """Logic for handling event."""
        print(event.class_name())




my_event_handler = MyEventHandler()
```

定義完您的處理器後，您可以將其附加到所需的 dispatcher：

```
import llama_index.core.instrumentation as instrument


dispatcher = instrument.get_dispatcher(__name__)
dispatcher.add_event_handler(my_event_handler)
```

### 定義自訂的 `Event`

使用者可以透過繼承 `BaseEvent` 來建立自己的自訂事件。`BaseEvent` 類別包含一個 `timestamp` 以及一個 `id_` 欄位。若要向此事件載荷中添加更多項目，只需將它們作為新的 `Fields` 添加即可（因為它們是 `pydantic.BaseModel` 的子類別）。

```
from llama_index.core.instrumentation.event.base import BaseEvent




class MyEvent(BaseEvent):
    """My custom Event."""


    new_field_1 = Field(...)
    new_field_2 = Field(...)
```

一旦您定義了自訂事件，您就使用 dispatcher 在應用程式程式碼的所需實例中觸發該事件。

```
import llama_index.core.instrumentation as instrument


dispatcher = instrument.get_dispatcher(__name__)
dispatcher.event(MyEvent(new_field_1=..., new_field_2=...))
```

### 定義自訂的 `Span`

`Span` 與 `Event` 類似，它們都是結構化資料類別（structured data classes）。與 `Event` 不同，`Span` 如其名稱所示，跨越程式執行流程中的一段時間。您可以定義一個自訂的 `Span` 來儲存您想要的所有資訊。

```
from typing import Any
from llama_index.core.bridge.pydantic import Field




class MyCustomSpan(BaseSpan):
    custom_field_1: Any = Field(...)
    custom_field_2: Any = Field(...)
```

為了處理您的新 Span 類型，您還需要透過繼承 `BaseSpanHandler` 類別來定義您的自訂 `SpanHandler`。當繼承此基礎類別時，需要定義三個抽象方法：`new_span()`、`prepare_to_exit_span()` 和 `prepare_to_drop_span()`。

```
import inspect
from typing import Any, Dict, Optional
from llama_index.core.instrumentation.span.base import BaseSpan
from llama_index.core.instrumentation.span_handlers import BaseSpanHandler




class MyCustomSpanHandler(BaseSpanHandler[MyCustomSpan]):
    @classmethod
    def class_name(cls) -> str:
        """Class name."""
        return "MyCustomSpanHandler"


    def new_span(
        self,
        id_: str,
        bound_args: inspect.BoundArguments,
        instance: Optional[Any] = None,
        parent_span_id: Optional[str] = None,
        tags: Optional[Dict[str, Any]] = None,
        **kwargs: Any,
    ) -> Optional[MyCustomSpan]:
        """Create a span."""
        # logic for creating a new MyCustomSpan
        pass


    def prepare_to_exit_span(
        self,
        id_: str,
        bound_args: inspect.BoundArguments,
        instance: Optional[Any] = None,
        result: Optional[Any] = None,
        **kwargs: Any,
    ) -> Any:
        """Logic for preparing to exit a span."""
        pass


    def prepare_to_drop_span(
        self,
        id_: str,
        bound_args: inspect.BoundArguments,
        instance: Optional[Any] = None,
        err: Optional[BaseException] = None,
        **kwargs: Any,
    ) -> Any:
        """Logic for preparing to drop a span."""
        pass
```

要使用您的新的 SpanHandler（及相關的 Span 類型），您只需將其添加到所需的 dispatcher 中即可。

```
import llama_index.core.instrumentation as instrument
from llama_index.core.instrumentation.span_handler import SimpleSpanHandler


dispatcher = (
    instrument.get_dispatcher()
)  # with no name argument, defaults to root


my_span_handler = MyCustomSpanHandler()
dispatcher.add_span_handler(my_span_handler)
```
### 進入/退出 `Span`

要向 `SpanHandler` 發送訊號，使其進入/退出 `Span`，我們分別使用 `span_enter()` 和 `span_exit()` 方法。此外，還有 `span_drop()` 方法可用於處理在受保護程式碼執行過程中，`Span` 被截斷於常態之外的情況。

```
import llama_index.core.instrumentation as instrument


dispatcher = instrument.get_dispatcher(__name__)




def func():
    dispatcher.span_enter(...)
    try:
        val = ...
    except:
        ...
        dispatcher.span_drop(...)
    else:
        dispatcher.span_exit(...)
        return val




# or, syntactic sugar via decorators




@dispatcher.span
def func():
    ...
```

### 使用 `dispatcher` 層級

與標準的 Python `logging` 函式庫及其 `Logger` class 類似，`dispatcher` 也存在類似的層級結構。具體來說，除了根級的 `dispatcher` 之外，所有 `dispatcher` 都有一個父物件，並且在處理 events 或 spans 時，它們也可以傳播給其父物件（這是預設行為）。這種處理 events 和 spans 的層級方法允許定義「global」event handlers 以及「local」的 handler。

考慮以下定義的專案結構。有 3 個 `dispatcher`：一個位於 `project` 的頂層，以及另外兩個位於個別子模組 `llama1` 和 `llama2`。在這種設定下，任何附加到專案根 `dispatcher` 的 `EventHandler` 都會訂閱在 `llama1` 和 `llama2` 程式碼執行中發生的所有 `Event`。另一方面，定義在各自 `llama<x>` 子模組中的 `EventHandler` 只會訂閱在其各自子模組執行範圍內發生的 `Event`。

終端視窗

```
project
├── __init__.py  # has a dispatcher=instrument.get_dispatcher(__name__)
├── llama1
│   ├── __init__.py  # has a dispatcher=instrument.get_dispatcher(__name__)
│   └── app_query_engine.py
└── llama2
    ├── __init__.py  # has a dispatcher=instrument.get_dispatcher(__name__)
    └── app_query_engine.py
```

## Notebook 指南：

- [基本用法](https://developers.llamaindex.ai/python/examples/instrumentation/basic_usage/index.md)
- [觀察 Model Calls](https://developers.llamaindex.ai/python/examples/instrumentation/observe_api_calls/index.md)
- [觀察所有 Events](https://developers.llamaindex.ai/python/examples/instrumentation/instrumentation_observability_rundown/index.md)

## API 參考

- [Instrumentation API Reference](https://developers.llamaindex.ai/python/framework-api-reference/instrumentation/index.md)