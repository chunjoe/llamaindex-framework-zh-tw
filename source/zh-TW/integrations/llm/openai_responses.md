---
title: "OpenAI 回應 API"
---

此筆記示範如何使用 OpenAI Responses LLM。

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index llama-index-llms-openai
```

## 基本用法

```
import os


os.environ["OPENAI_API_KEY"] = "..."
```

```
from llama_index.llms.openai import OpenAIResponses


llm = OpenAIResponses(
    model="gpt-4o-mini",
    # api_key="some key",  # uses OPENAI_API_KEY env var by default
)
```

#### 使用 prompt 呼叫 `complete`

```
from llama_index.llms.openai import OpenAI


resp = llm.complete("Paul Graham is ")
```

```
print(resp)
```

```
Paul Graham is a prominent computer scientist, entrepreneur, and venture capitalist, best known for co-founding the startup accelerator Y Combinator. He is also recognized for his essays on technology, startups, and programming, which have influenced many in the tech community. Graham has a background in programming languages and artificial intelligence, having earned a Ph.D. from Harvard University. His work has significantly shaped the startup ecosystem, particularly in Silicon Valley. Would you like to know more about a specific aspect of his work or ideas?
```

#### 使用訊息列表呼叫 `chat`

```
from llama_index.core.llms import ChatMessage


messages = [
    ChatMessage(
        role="system", content="You are a pirate with a colorful personality"
    ),
    ChatMessage(role="user", content="What is your name"),
]
resp = llm.chat(messages)
```

```
print(resp)
```

```
assistant: Ahoy, matey! Ye can call me Captain Jollybeard, the most colorful pirate to sail the seven seas! What brings ye to me ship today? Arrr!
```

## Streaming

使用 `stream_complete` endpoint

```
resp = llm.stream_complete("Paul Graham is ")
```

```
for r in resp:
    print(r.delta, end="")
```

```
Paul Graham is a prominent computer scientist, entrepreneur, and venture capitalist, best known for co-founding the startup accelerator Y Combinator. He is also recognized for his essays on technology, startups, and programming, which have influenced many in the tech community. Graham has a background in programming languages and artificial intelligence and has authored several influential works, including "Hackers and Painters." His insights on entrepreneurship and innovation have made him a respected figure in Silicon Valley.
```

使用 `stream_chat` endpoint

```
from llama_index.core.llms import ChatMessage


messages = [
    ChatMessage(
        role="system", content="You are a pirate with a colorful personality"
    ),
    ChatMessage(role="user", content="What is your name"),
]
resp = llm.stream_chat(messages)
```

```
for r in resp:
    print(r.delta, end="")
```

```
Ahoy there! Ye can call me Captain Jollybeard, the most colorful pirate to sail the seven seas! What brings ye to me ship today?
```

## 設定參數

Respones API 支援多種選項：

- 設定 model name
- 生成參數，如 temperature, top\_p, max\_output\_tokens
- 開啟內建的 tool calling
- 設定 O-series model 的 reasoning effort
- 追蹤先前的 responses 以自動建立對話歷史
- 等等！

### 基本參數

```
from llama_index.llms.openai import OpenAIResponses


llm = OpenAIResponses(
    model="gpt-4o-mini",
    temperature=0.5,  # default is 0.1
    max_output_tokens=100,  # default is None
    top_p=0.95,  # default is 1.0
)
```

### 內建 Tool Calling

responses API 支援內建的 tool calling，您可以在 [此處](https://platform.openai.com/docs/guides/tools?api-mode=responses) 閱讀更多資訊。

設定此功能意味著 LLM 將會自動呼叫 tool 並使用它來增強 response。

Tools 被定義為一個字典列表，每個字典包含一個用於 tool 的 settings。

以下是使用內建的 web search tool 的範例。

```
from llama_index.llms.openai import OpenAIResponses
from llama_index.core.llms import ChatMessage


llm = OpenAIResponses(
    model="gpt-4o-mini",
    built_in_tools=[{"type": "web_search_preview"}],
)


resp = llm.chat(
    [ChatMessage(role="user", content="What is the weather in San Francisco?")]
)
print(resp)
print("========" * 2)
print(resp.additional_kwargs)
```

```
assistant: As of 12:18 AM on Friday, March 28, 2025, in San Francisco, the current weather is partly sunny with a temperature of 61°F (16°C).


## Weather for San Francisco, CA:
Current Conditions: Partly sunny, 61°F (16°C)


Daily Forecast:
* Thursday, March 27: Low: 52°F (11°C), High: 61°F (16°C), Description: Periods of rain and drizzle beginning in the late morning; breezy this afternoon
* Friday, March 28: Low: 47°F (8°C), High: 61°F (16°C), Description: A shower in the area in the morning; otherwise, clouds giving way to some sun
* Saturday, March 29: Low: 50°F (10°C), High: 60°F (15°C), Description: Mostly sunny
* Sunday, March 30: Low: 51°F (11°C), High: 59°F (15°C), Description: Cloudy; periods of rain in the morning followed by a shower in spots in the afternoon
* Monday, March 31: Low: 49°F (10°C), High: 58°F (14°C), Description: Cloudy and cool; a couple of showers in the afternoon
* Tuesday, April 01: Low: 53°F (12°C), High: 58°F (14°C), Description: Some sunshine giving way to clouds, breezy and cool; occasional rain in the afternoon
* Wednesday, April 02: Low: 52°F (11°C), High: 56°F (13°C), Description: A couple of showers in the morning; otherwise, cloudy and remaining cool




In March, San Francisco typically experiences daytime temperatures around 61°F (16°C) and nighttime temperatures around 47°F (8°C). The city usually receives about 3.5 inches (89 mm) of rainfall over approximately 11 days during the month. ([weather2visit.com](https://www.weather2visit.com/north-america/united-states/san-francisco-march.htm?utm_source=openai))
================
{'built_in_tool_calls': [ResponseFunctionWebSearch(id='ws_67e5eaecce088191ab2edce452ef25420a24041ef7e917b2', status='completed', type='web_search_call')], 'annotations': [AnnotationURLCitation(end_index=1561, start_index=1439, title='San Francisco Weather in March 2025 | United States Averages | Weather-2-Visit', type='url_citation', url='https://www.weather2visit.com/north-america/united-states/san-francisco-march.htm?utm_source=openai')], 'usage': ResponseUsage(input_tokens=327, output_tokens=462, output_tokens_details=OutputTokensDetails(reasoning_tokens=0), total_tokens=789, input_tokens_details={'cached_tokens': 0})}
```

## Reasoning Effort

對於 O-series model，您可以設定 reasoning effort 來控制模型花費在推理上的時間。

請參閱 [OpenAI API docs](https://platform.openai.com/docs/guides/reasoning?api-mode=responses) 了解更多資訊。

```
from llama_index.llms.openai import OpenAIResponses
from llama_index.core.llms import ChatMessage


llm = OpenAIResponses(
    model="o3-mini",
    reasoning_options={"effort": "high"},
)


resp = llm.chat(
    [ChatMessage(role="user", content="What is the meaning of life?")]
)
print(resp)
print("========" * 2)
print(resp.additional_kwargs)
```

```
assistant: The question “What is the meaning of life?” has been asked by philosophers, theologians, scientists, and countless individuals throughout history—and there isn’t one definitive answer that satisfies everyone. Here are a few perspectives that help illustrate why the answer is so open-ended:


1. Philosophical and Existential Views:
 • Some existentialist thinkers, such as Jean-Paul Sartre and Albert Camus, argue that life doesn’t come with a preordained meaning. Instead, they suggest that it’s up to each individual to create their own purpose through choices, relationships, and personal projects.
 • Other philosophies, like those in classical philosophy, have emphasized the pursuit of virtue, knowledge, or happiness as key to a meaningful life.


2. Religious and Spiritual Perspectives:
 • Many religious traditions offer meanings tied to their spiritual beliefs. In these views, life might be seen as a journey of growth, moral development, or fulfilling a divine plan—whether that means living according to God’s commandments, achieving enlightenment, or learning lessons through reincarnation.
 • Spiritual traditions often encourage adherents to find meaning in love, compassion, and service to others.


3. Scientific and Naturalistic Approaches:
 • From a biological standpoint, one might say that the purpose of life is simply to survive and reproduce—the basic mechanisms that drive natural selection and evolution.
 • Some argue that while biology defines life’s mechanics, human consciousness allows us to transcend mere survival and imbue our existence with personal and cultural meaning.


4. Personal and Cultural Interpretations:
 • For many, meaning is found in everyday connections: love, creativity, learning, and contributing to the community or society at large.
 • Different cultures and individuals may prioritize various values (such as achievement, compassion, or exploration), which means the “meaning” can vary widely based on one’s upbringing, experiences, and personal reflections.


5. A Humorous Take:
 • Popular culture, notably in Douglas Adams’ The Hitchhiker’s Guide to the Galaxy, famously suggests that the answer to the ultimate question of life is “42”—a playful reminder that the real significance often lies in the journey of questioning itself rather than arriving at a single answer.


In the end, the meaning of life might be considered less of an absolute truth and more of an invitation to explore, question, and define what matters most to you personally. Whether through relationships, creative pursuits, intellectual challenges, or spiritual practices, many believe we have the power to create our own meaning in a vast and complex universe.
================
{'built_in_tool_calls': [], 'reasoning': ResponseReasoningItem(id='rs_683e2dde0e308198a72c5e7f2e9bf52a0dd2faa5908183b8', summary=[], type='reasoning', encrypted_content=None, status=None), 'annotations': [], 'usage': ResponseUsage(input_tokens=13, input_tokens_details=InputTokensDetails(cached_tokens=0), output_tokens=841, output_tokens_details=OutputTokensDetails(reasoning_tokens=320), total_tokens=854)}
```

## Image Support

OpenAI 對多種模型的 chat message 輸入中的圖片提供支援。

使用 chat message 的 content blocks 功能，您可以輕鬆地在單一 LLM prompt 中組合文字和圖片。

```
!wget https://cdn.pixabay.com/photo/2016/07/07/16/46/dice-1502706_640.jpg -O image.png
```

```
from llama_index.core.llms import ChatMessage, TextBlock, ImageBlock
from llama_index.llms.openai import OpenAIResponses


llm = OpenAIResponses(model="gpt-4o")


messages = [
    ChatMessage(
        role="user",
        blocks=[
            ImageBlock(path="image.png"),
            TextBlock(text="Describe the image in a few sentences."),
        ],
    )
]


resp = llm.chat(messages)
print(resp.message.content)
```

```
The image shows three white dice with black dots, captured in mid-air above a checkered surface. The dice are in various orientations, displaying different numbers of dots. The background is dark, with a subtle light illuminating the dice, creating a dramatic effect. The checkered surface resembles a chess or checkerboard.
```

## 使用 Function/Tool Calling

OpenAI 模型原生支援 function calling。這方便地整合了 LlamaIndex tool abstractions，讓您可以將任何任意的 Python function 插入到 LLM 中。

在下面的範例中，我們定義了一個用於生成 Song object 的 function。

```
from pydantic import BaseModel
from llama_index.core.tools import FunctionTool




class Song(BaseModel):
    """A song with name and artist"""


    name: str
    artist: str




def generate_song(name: str, artist: str) -> Song:
    """Generates a song with provided name and artist."""
    return Song(name=name, artist=artist)




tool = FunctionTool.from_defaults(fn=generate_song)
```

`strict` 參數告訴 OpenAI 是否在生成 tool call/structured outputs 時使用 constrained sampling。這意味著生成的 tool call schema 將始終包含預期的欄位。

由於這似乎會增加延遲，所以預設為 false。

```
from llama_index.llms.openai import OpenAIResponses


llm = OpenAIResponses(model="gpt-4o-mini", strict=True)
response = llm.predict_and_call(
    [tool],
    "Write a random song for me",
    # strict=True  # can also be set at the function level to override the class
)
print(str(response))
```

```
name='Chasing Stars' artist='Luna Sky'
```

我們也可以進行多個 function calling。

```
llm = OpenAIResponses(model="gpt-4o-mini")
response = llm.predict_and_call(
    [tool],
    "Generate five songs from the Beatles",
    allow_parallel_tool_calls=True,
)
for s in response.sources:
    print(f"Name: {s.tool_name}, Input: {s.raw_input}, Output: {str(s)}")
```

```
Name: generate_song, Input: {'args': (), 'kwargs': {'name': 'Hey Jude', 'artist': 'The Beatles'}}, Output: name='Hey Jude' artist='The Beatles'
Name: generate_song, Input: {'args': (), 'kwargs': {'name': 'Let It Be', 'artist': 'The Beatles'}}, Output: name='Let It Be' artist='The Beatles'
Name: generate_song, Input: {'args': (), 'kwargs': {'name': 'Come Together', 'artist': 'The Beatles'}}, Output: name='Come Together' artist='The Beatles'
Name: generate_song, Input: {'args': (), 'kwargs': {'name': 'Yesterday', 'artist': 'The Beatles'}}, Output: name='Yesterday' artist='The Beatles'
Name: generate_song, Input: {'args': (), 'kwargs': {'name': 'Twist and Shout', 'artist': 'The Beatles'}}, Output: name='Twist and Shout' artist='The Beatles'
```

### 手動 Tool Calling

如果您想控制 tool 的呼叫方式，也可以將 tool calling 和 tool selection 分成獨立的步驟。

首先，讓我們選擇一個 tool。

```
from llama_index.core.llms import ChatMessage
from llama_index.llms.openai import OpenAIResponses


llm = OpenAIResponses(model="gpt-4o-mini")


chat_history = [ChatMessage(role="user", content="Write a random song for me")]


resp = llm.chat_with_tools([tool], chat_history=chat_history)
```

現在，讓我們呼叫 LLM 選擇的 tool（如果有）。

如果存在 tool call，我們應該將結果傳送給 LLM 以生成最終 response（或另一個 tool call！）。

```
tools_by_name = {t.metadata.name: t for t in [tool]}
tool_calls = llm.get_tool_calls_from_response(
    resp, error_on_no_tool_call=False
)


while tool_calls:
    # add the LLM's response to the chat history
    chat_history.append(resp.message)


    for tool_call in tool_calls:
        tool_name = tool_call.tool_name
        tool_kwargs = tool_call.tool_kwargs


        print(f"Calling {tool_name} with {tool_kwargs}")
        tool_output = tool(**tool_kwargs)
        chat_history.append(
            ChatMessage(
                role="tool",
                content=str(tool_output),
                # most LLMs like OpenAI need to know the tool call id
                additional_kwargs={"call_id": tool_call.tool_id},
            )
        )


        resp = llm.chat_with_tools([tool], chat_history=chat_history)
        tool_calls = llm.get_tool_calls_from_response(
            resp, error_on_no_tool_call=False
        )
```

```
Calling generate_song with {'name': 'Chasing Stars', 'artist': 'Luna Sky'}
```

現在，我們應該有最終 response！

```
print(resp.message.content)
```

```
Here's a song for you titled **"Chasing Stars"** by **Luna Sky**!


### Chasing Stars


**Verse 1**
In the midnight glow, we wander free,
With dreams like fireflies, lighting up the sea.
Whispers of the night, calling out our names,
Together we’ll ignite, this wild, untamed flame.


**Chorus**
We’re chasing stars, through the endless night,
With every heartbeat, we’ll take flight.
Hand in hand, we’ll break the dark,
In this cosmic dance, we’ll leave our mark.


**Verse 2**
Underneath the moon, secrets softly shared,
Every glance a promise, every touch a dare.
The universe is ours, let the journey start,
With every step we take, we’re painting art.


**Chorus**
We’re chasing stars, through the endless night,
With every heartbeat, we’ll take flight.
Hand in hand, we’ll break the dark,
In this cosmic dance, we’ll leave our mark.


**Bridge**
And when the dawn arrives, we’ll still be here,
With the echoes of our laughter, crystal clear.
No matter where we go, no matter how far,
Forever in our hearts, we’ll chase those stars.


**Chorus**
We’re chasing stars, through the endless night,
With every heartbeat, we’ll take flight.
Hand in hand, we’ll break the dark,
In this cosmic dance, we’ll leave our mark.


**Outro**
So let’s chase the stars, let’s light the way,
In this beautiful journey, we’ll never stray.
With dreams as our compass, love as our guide,
Together we’ll soar, side by side.


Feel free to let me know if you'd like any changes or another song!
```

## Structured Prediction

function calling 的一個重要應用場景是提取結構化物件。LlamaIndex 提供了一個直觀的介面，用於將任何 LLM 轉換為結構化的 LLM - 只需定義目標 Pydantic class（可以巢狀），並給定一個 prompt，我們就能提取出所需的物件。

```
from llama_index.llms.openai import OpenAIResponses
from llama_index.core.prompts import PromptTemplate
from pydantic import BaseModel
from typing import List




class MenuItem(BaseModel):
    """A menu item in a restaurant."""


    course_name: str
    is_vegetarian: bool




class Restaurant(BaseModel):
    """A restaurant with name, city, and cuisine."""


    name: str
    city: str
    cuisine: str
    menu_items: List[MenuItem]




llm = OpenAIResponses(model="gpt-4o-mini")
prompt_tmpl = PromptTemplate(
    "Generate a restaurant in a given city {city_name}"
)
# Option 1: Use `as_structured_llm`
restaurant_obj = (
    llm.as_structured_llm(Restaurant)
    .complete(prompt_tmpl.format(city_name="Dallas"))
    .raw
)
# Option 2: Use `structured_predict`
# restaurant_obj = llm.structured_predict(Restaurant, prompt_tmpl, city_name="Miami")
```

```
restaurant_obj
```

```
Restaurant(name='Tex-Mex Delight', city='Dallas', cuisine='Tex-Mex', menu_items=[MenuItem(course_name='Tacos', is_vegetarian=False), MenuItem(course_name='Vegetarian Enchiladas', is_vegetarian=True), MenuItem(course_name='Fajitas', is_vegetarian=False), MenuItem(course_name='Chips and Salsa', is_vegetarian=True), MenuItem(course_name='Queso Dip', is_vegetarian=True)])
```

## Async

```
from llama_index.llms.openai import OpenAIResponses


llm = OpenAIResponses(model="gpt-4o")
```

```
resp = await llm.acomplete("Paul Graham is ")
```

```
print(resp)
```

```
Paul Graham is a British-American entrepreneur, venture capitalist, and essayist. He is best known for co-founding Viaweb, one of the first web-based applications, which was later sold to Yahoo and became Yahoo Store. Graham is also a co-founder of Y Combinator, a highly influential startup accelerator that has funded and supported numerous successful startups, including Dropbox, Airbnb, and Reddit. In addition to his work in technology and startups, Graham is known for his insightful essays on topics such as programming, entrepreneurship, and the philosophy of work.
```

```
resp = await llm.astream_complete("Paul Graham is ")
```

```
async for delta in resp:
    print(delta.delta, end="")
```

```
Paul Graham is a British-American entrepreneur, venture capitalist, and essayist. He is best known for co-founding Viaweb, one of the first web-based applications, which was later sold to Yahoo and became Yahoo Store. Graham is also a co-founder of Y Combinator, a highly influential startup accelerator that has funded and supported numerous successful startups, including Dropbox, Airbnb, and Reddit. In addition to his work in technology and startups, Graham is known for his insightful essays on topics related to entrepreneurship, technology, and society.
```

async function calling 也受到支援。

```
llm = OpenAIResponses(model="gpt-4o-mini")
response = await llm.apredict_and_call([tool], "Generate a random song")
print(str(response))
```

```
name='Chasing Stars' artist='Luna Sky'
```

## Additional kwargs

如果 constructor 中沒有額外的 kwargs，您可以使用 `additional_kwargs` 在每個實例層級設定它們。

這些將會傳遞到對 LLM 的每一次呼叫中。

```
from llama_index.llms.openai import OpenAIResponses


llm = OpenAIResponses(
    model="gpt-4o-mini", additional_kwargs={"user": "your_user_id"}
)
resp = llm.complete("Paul Graham is ")
print(resp)
```

## Image generationYou can use [image generation](https://platform.openai.com/docs/guides/image-generation?image-generation-model=gpt-image-1#generate-images) by passing, as a built-in-tool, `{'type': 'image_generation'}` or, if you want to enable streaming, `{'type': 'image_generation', 'partial_images': 2}`:

```
import base64
from llama_index.llms.openai import OpenAIResponses
from llama_index.core.llms import ChatMessage, ImageBlock, TextBlock


# run without streaming
llm = OpenAIResponses(
    model="gpt-4.1-mini", built_in_tools=[{"type": "image_generation"}]
)
messages = [
    ChatMessage.from_str(
        content="A llama dancing with a cat in a meadow", role="user"
    )
]
response = llm.chat(
    messages
)  # response = await llm.achat(messages) for an async implementation
for block in response.message.blocks:
    if isinstance(block, ImageBlock):
        with open("llama_and_cat_dancing.png", "wb") as f:
            f.write(bas64.b64decode(block.image))
    elif isinstance(block, TextBlock):
        print(block.text)


# run with streaming
llm_stream = OpenAIResponses(
    model="gpt-4.1-mini",
    built_in_tools=[{"type": "image_generation", "partial_images": 2}],
)
response = llm_stream.stream_chat(
    messages
)  # response = await llm_stream.asteam_chat(messages) for an async implementation
for event in response:
    for block in event.message.blocks:
        if isinstance(block, ImageBlock):
            # block.detail contains the ID of the image
            with open(f"llama_and_cat_dancing_{block.detail}.png", "wb") as f:
                f.write(bas64.b64decode(block.image))
        elif isinstance(block, TextBlock):
            print(block.text)
```

## MCP Remote calls

您可以呼叫任何 [remote MCP](https://platform.openai.com/docs/guides/tools-remote-mcp) 透過 OpenAI Responses API 只需傳遞 the MCP 將特定內容作為內建工具提供給 LLM

```
from llama_index.llms.openai import OpenAIResponses
from llama_index.core.llms import ChatMessage


llm = OpenAIResponses(
    model="gpt-4.1",
    built_in_tools=[
        {
            "type": "mcp",
            "server_label": "deepwiki",
            "server_url": "https://mcp.deepwiki.com/mcp",
            "require_approval": "never",
        }
    ],
)
messages = [
    ChatMessage.from_str(
        content="What transport protocols are supported in the 2025-03-26 version of the MCP spec?",
        role="user",
    )
]
response = llm.chat(messages)
# see the textual output
print(response.message.content)
# see the MCP tool call
print(response.raw.output[0])
```

## Code interpreter

您可以使用 the [Code Interpreter](https://platform.openai.com/docs/guides/tools-code-interpreter) 只需將其設定為內建工具， `"type": "code_interpreter", "container": { "type": "auto" }`.

```
from llama_index.llms.openai import OpenAIResponses
from llama_index.core.llms import ChatMessage


llm = OpenAIResponses(
    model="gpt-4.1",
    built_in_tools=[
        {
            "type": "code_interpreter",
            "container": {"type": "auto"},
        }
    ],
)
messages = messages = [
    ChatMessage.from_str(
        content="I need to solve the equation 3x + 11 = 14. Can you help me?",
        role="user",
    )
]
response = llm.chat(messages)
# see the textual output
print(response.message.content)
# see the MCP tool call
print(response.raw.output[0])
```
