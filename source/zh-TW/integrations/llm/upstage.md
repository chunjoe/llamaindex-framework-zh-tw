---
title: "Upstage"
---

如果您在 colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-llms-upstage llama-index
```

## 基本用法

#### 使用 prompt 呼叫 `complete`

```
import os


os.environ["UPSTAGE_API_KEY"] = "YOUR_API_KEY"
```

```
from llama_index.llms.upstage import Upstage


llm = Upstage(
    model="solar-mini",
    # api_key="YOUR_API_KEY"  # uses UPSTAGE_API_KEY env var by default
)


resp = llm.complete("Paul Graham is ")
```

```
print(resp)
```

```
Paul Graham is a computer scientist, entrepreneur, and essayist. He is best known as the co-founder of the venture capital firm Y Combinator, which has funded and incubated many successful startups. He is also the author of several influential essays on entrepreneurship, startup culture, and technology.
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
assistant: I am Captain Redbeard, the fearless pirate!
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
Paul Graham is a computer scientist, entrepreneur, and essayist. He is best known for co-founding the startup accelerator Y Combinator, which has helped launch some of the most successful tech companies in the world, including Airbnb, Dropbox, and Stripe. He is also the author of several influential essays on startup culture and entrepreneurship, including "How to Start a Startup" and "Hackers & Painters."
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
I am Captain Redbeard, the fearless pirate!
```

## Function Calling

Upstage models 內建支援 function calling。這方便地整合了 LlamaIndex tool abstractions，讓您可以將任何任意的 Python function 插入到 LLM 中。

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

```
from llama_index.llms.upstage import Upstage


llm = Upstage()
response = llm.predict_and_call([tool], "Generate a song")
print(str(response))
```

```
name='My Song' artist='John Doe'
```

我們也可以進行多個 function calling。

```
llm = Upstage()
response = llm.predict_and_call(
    [tool],
    "Generate five songs from the Beatles",
    allow_parallel_tool_calls=True,
)
for s in response.sources:
    print(f"Name: {s.tool_name}, Input: {s.raw_input}, Output: {str(s)}")
```

```
Name: generate_song, Input: {'args': (), 'kwargs': {'name': 'Beatles', 'artist': 'Beatles'}}, Output: name='Beatles' artist='Beatles'
```

## Async

```
from llama_index.llms.upstage import Upstage


llm = Upstage()
```

```
resp = await llm.acomplete("Paul Graham is ")
```

```
print(resp)
```

```
Paul Graham is a computer scientist, entrepreneur, and essayist. He is best known as the co-founder of the startup accelerator Y Combinator, which has helped launch and fund many successful tech companies. He is also the author of several influential essays on startups, entrepreneurship, and technology, including "How to Start a Startup" and "Hackers & Painters."
```

```
resp = await llm.astream_complete("Paul Graham is ")
```

```
async for delta in resp:
    print(delta.delta, end="")
```

```
Paul Graham is a computer scientist, entrepreneur, and essayist. He is best known as the co-founder of the startup accelerator Y Combinator, which has helped launch some of the most successful tech companies in the world, including Airbnb, Dropbox, and Stripe. Graham is also a prolific writer, and his essays on topics such as startup advice, artificial intelligence, and the future of work have been widely read and influential in the tech industry.
```

也支援 Async function calling。

```
llm = Upstage()
response = await llm.apredict_and_call([tool], "Generate a song")
print(str(response))
```

```
name='My Song' artist='Me'
```
