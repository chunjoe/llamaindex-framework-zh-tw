---
title: "指南"
---

[Guidance](https://github.com/microsoft/guidance) 是一種用於控制微軟開發的大型語言模型的指導語言。

Guidance 程式允許您將生成、提示和邏輯控制交織在一個連續的流程中，這與語言模型實際處理文本的方式相符。

## 結構化輸出 (Structured Output)

Guidance 一個特別令人興奮的方面是能夠輸出結構化物件（例如遵循特定 schema 的 JSON，或一個 pydantic 物件）。Guidance 不僅僅是「建議」給 LLM 期望的輸出結構，而是能「強制」LLM 的輸出遵循所需的 schema。這使得 LLM 可以專注於內容而非語法，並完全消除輸出解析問題的可能性。

這對於較弱的 LLMs（參數數量較少，且未在足夠的原始碼資料上訓練，無法可靠地產生格式良好、分層的結構化輸出）尤其有效。

### 建立一個指導程式來產生 pydantic 物件

在 LlamaIndex 中，我們提供了與 guidance 的初始整合，讓生成結構化輸出（更具體地說是 pydantic 物件）變得非常簡單。

例如，如果我們想生成一組歌曲，具有以下 schema：

```
class Song(BaseModel):
    title: str
    length_seconds: int




class Album(BaseModel):
    name: str
    artist: str
    songs: List[Song]
```

只需建立一個 `GuidancePydanticProgram`，指定我們想要的 pydantic 類別 `Album`，並提供一個合適的 prompt template。

> 注意：guidance 使用 handlebars-style 模板，它使用雙大括號進行變數替換，使用單大括號進行字面括號。這是與 Python 格式字串的相反慣例。

從 from llama_index.core.prompts.guidance_utils import convert_to_handlebars 轉換 Python 格式字串樣式模板到 guidance handlebars-style 模板。

```
program = GuidancePydanticProgram(
    output_cls=Album,
    prompt_template_str="Generate an example album, with an artist and a list of songs. Using the movie {{movie_name}} as inspiration",
    guidance_llm=OpenAI("text-davinci-003"),
    verbose=True,
)
```

現在我們可以透過呼叫它並提供額外的使用者輸入來運行該程式。這裡我們來做一些令人毛骨悚然的事情，並創建一個受《輝夜記》啟發的專輯。

```
output = program(movie_name="The Shining")
```

我們有我們的 pydantic 物件：

```
Album(
    name="The Shining",
    artist="Jack Torrance",
    songs=[
        Song(title="All Work and No Play", length_seconds=180),
        Song(title="The Overlook Hotel", length_seconds=240),
        Song(title="The Shining", length_seconds=210),
    ],
)
```

您可以參閱 [這個 notebook](https://developers.llamaindex.ai/python/examples/output_parsing/guidance_pydantic_program/index.md) 以獲取更多詳細資訊。

### 使用 guidance 提高我們子問題查詢引擎的穩健性。

LlamaIndex 提供了一套進階查詢引擎工具，用於處理不同的使用案例。其中一些依賴中間步驟中的結構化輸出。我們可以利用 guidance 來提高這些查詢引擎的穩健性，確保中間回應具有預期的結構（以便它們可以正確解析為結構化物件）。

例如，我們實作了一個 `GuidanceQuestionGenerator`，可以插入到 `SubQuestionQueryEngine` 中，使其比使用預設設定更穩健。

```
from llama_index.question_gen.guidance import GuidanceQuestionGenerator
from guidance.llms import OpenAI as GuidanceOpenAI


# define guidance based question generator
question_gen = GuidanceQuestionGenerator.from_defaults(
    guidance_llm=GuidanceOpenAI("text-davinci-003"), verbose=False
)


# define query engine tools
query_engine_tools = ...


# construct sub-question query engine
s_engine = SubQuestionQueryEngine.from_defaults(
    question_gen=question_gen,  # use guidance based question_gen defined above
    query_engine_tools=query_engine_tools,
)
```

請參閱 [這個 notebook](https://developers.llamaindex.ai/python/examples/output_parsing/guidance_sub_question/index.md) 以獲取更多詳細資訊。