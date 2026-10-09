---
title: "工具"
---

## 概念

完善的工具抽象是建構 [LlamaIndex 代理系統](/python/framework/module_guides/deploying/agents/)的核心。定義一組工具，與設計任何 API 介面相似；不同之處在於這些工具是供 agent 呼叫，而非供人直接使用。我們支援使用者定義 **Tool**，也能定義 **ToolSpec**，在底層封裝一系列函式。

使用支援 function calling 的 agent 或 LLM 時，選用哪個工具及為該工具填入哪些引數，很大程度取決於工具的**名稱**與**描述**，以及對用途和引數的說明。花時間調整這些資訊，可能會大幅影響 LLM 呼叫工具的方式。

Tool 只需實作簡單通用的介面：定義 `__call__`，並回傳基本中繼資料（名稱、描述、函式結構描述）。

我們提供幾種不同類型的工具：

- `FunctionTool`：讓您輕鬆將自訂函式包裝成工具。它也能自動推斷函式結構描述，或讓您自行調整各項設定。
- `QueryEngineTool`：包裝既有[查詢引擎](/python/framework/module_guides/deploying/query_engine/)的工具。由於我們的 agent 抽象類別繼承自 `BaseQueryEngine`，這類工具也能包裝其他 agents。
- 社群貢獻的 `ToolSpecs`：可為單一服務（例如 Gmail）定義一個或多個工具
- 實用工具：包裝其他工具，處理工具回傳的大量資料

## FunctionTool

函式工具是既有函式的簡易包裝器，同時支援同步與非同步函式！

```
from llama_index.core.agent.workflow import ReActAgent
from llama_index.core.tools import FunctionTool




def get_weather(location: str) -> str:
    """Usfeful for getting the weather for a given location."""
    ...




tool = FunctionTool.from_defaults(
    get_weather,
    # async_fn=aget_weather,  # optional!
)


agent = ReActAgent(llm=llm, tools=tools)
```

若要更完整地定義函式，也可以使用 `Annotated` 型別來指定引數說明。

```
from typing import Annotated




def get_weather(
    location: Annotated[
        str, "A city name and state, formatted like '<name>, <state>'"
    ],
) -> str:
    """Useful for getting the weather for a given location."""
    ...




tool = FunctionTool.from_defaults(get_weather)
```

預設會以函式名稱作為工具名稱，並以 docstring 作為工具描述；您也可以自行覆寫這些值。

```
tool = FunctionTool.from_defaults(get_weather, name="...", description="...")
```

## QueryEngineTool

使用 `QueryEngineTool`，即可將任何查詢引擎包裝成工具：

```
from llama_index.core.tools import QueryEngineTool


tool = QueryEngineTool.from_defaults(
    query_engine, name="...", description="..."
)
```

## Tool 規格

我們也提供豐富的工具與工具規格（Tool Specs），作為[獨立的整合套件](https://github.com/run-llama/llama_index/tree/main/llama-index-integrations/tools)。

您可以把工具規格想成一組搭配使用的工具，通常會涵蓋同一介面或服務（例如 Gmail）中的實用功能。

若要搭配 agent 使用，請安裝對應的工具規格整合套件：

終端機視窗

```
pip install llama-index-tools-google
```

接著即可這樣使用：

```
from llama_index.core.agent.workflow import FunctionAgent
from llama_index.tools.google import GmailToolSpec


tool_spec = GmailToolSpec()
agent = FunctionAgent(llm=llm, tools=tool_spec.to_tool_list())
```

完整的社群貢獻工具規格清單請參閱 GitHub 上的[工具目錄](https://github.com/run-llama/llama_index/tree/main/llama-index-integrations/tools)。

## 實用工具

直接呼叫 API 往往會回傳大量資料，可能超出 LLM 的上下文視窗；即使沒有超出，也可能不必要地增加 token 用量。

為了解決這個問題，我們在工具整合套件中提供一組「實用工具」。這些工具不綁定特定服務（例如 Gmail 或 Notion），而是擴充既有工具的能力。此處的實用工具可協助處理常見模式，例如快取或建立索引，並查詢各種 API 呼叫所回傳的資料。

以下介紹兩種主要的實用工具。

### OnDemandLoaderTool

這個工具會將既有的 LlamaIndex 資料載入器（`BaseReader` 類別）包裝成 agent 可使用的工具。呼叫時，可傳入觸發資料載入器 `load_data` 所需的所有參數，以及自然語言查詢字串。執行時，工具會先載入資料，再建立索引（例如使用向量儲存庫），最後按需查詢；這三個步驟會在單次工具呼叫中完成。

相較於自行處理 API 資料的載入與索引，這種方式往往更方便。雖然自行處理或許有助於重複利用資料，但許多情況下，使用者只需要臨時建立索引，避免 API 回應受提示詞視窗限制。

使用範例如下：

終端機視窗

```
pip install llama-index-readers-wikipedia
```

```
from llama_index.readers.wikipedia import WikipediaReader
from llama_index.core.tools.ondemand_loader_tool import OnDemandLoaderTool


tool = OnDemandLoaderTool.from_defaults(
    reader,
    name="Wikipedia Tool",
    description="A tool for loading data and querying articles from Wikipedia",
)
```

### LoadAndSearchToolSpec

LoadAndSearchToolSpec 接收任何既有 Tool 作為輸入。作為工具規格，它實作 `to_tool_list`；呼叫此方法時，會回傳兩個工具：`load` 工具和 `search` 工具。

執行 `load` 工具時，會呼叫底層 Tool，並為輸出建立索引（預設使用向量索引）。執行 `search` 工具時，則會接收查詢字串，並呼叫底層索引進行搜尋。

這適用於預設會回傳大量資料的 API 端點。例如，WikipediaToolSpec 預設會回傳整篇 Wikipedia 頁面，很容易超出多數 LLM 的上下文視窗。

使用範例如下：

終端機視窗

```
pip install llama-index-tools-wikipedia
```

```
from llama_index.core.agent.workflow import FunctionAgent
from llama_index.core.tools.tool_spec.load_and_search import (
    LoadAndSearchToolSpec,
)
from llama_index.tools.wikipedia import WikipediaToolSpec




wiki_spec = WikipediaToolSpec()
# Get the search wikipedia tool
tool = wiki_spec.to_tool_list()[1]


# Create the Agent with load/search tools
agent = FunctionAgent(
    llm=llm, tools=LoadAndSearchToolSpec.from_defaults(tool).to_tool_list()
)
```

### 直接回傳

您會看到工具類別的建構子提供 `return_direct` 選項。若將它設為 `True`，agent 的回應就會直接回傳，不再由 agent 解讀或改寫。這有助於縮短執行時間，也適合用來設計會結束 agent 推理迴圈的工具。

例如，您可以這樣指定工具：

```
tool = QueryEngineTool.from_defaults(
    query_engine,
    name="<name>",
    description="<description>",
    return_direct=True,
)


agent = FunctionAgent(llm=llm, tools=[tool])


response = await agent.run("<question that invokes tool>")
```

在上例中，系統會呼叫查詢引擎工具，並將工具的回應直接作為最終結果回傳，然後結束執行迴圈。

若設為 `return_direct=False`，agent 會參考聊天記錄中的上下文改寫回應，甚至可能再次呼叫工具。

我們也提供了使用 `return_direct` 的[範例筆記本](https://developers.llamaindex.ai/python/examples/agent/return_direct_agent/index.md)。

## 偵錯工具

有時，了解實際傳送給 API 的工具定義內容，會很有幫助。

您可以呼叫底層函式取得目前的工具結構描述，查看詳細內容；OpenAI 和 Anthropic 等 API 也會使用這份結構描述。

```
schema = tool.metadata.get_parameters_dict()
print(schema)
```
