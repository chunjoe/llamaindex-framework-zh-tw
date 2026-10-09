---
title: "OpenAI JSON 模式與 Function Calling 進行資料擷取"
---

OpenAI 剛發布了 [JSON Mode](https://platform.openai.com/docs/guides/text-generation/json-mode)：此新設定限制了 LLM 只會生成可以解析為有效 JSON 的字串（但無法保證對任何 schema 的驗證）。

在此之前，從文字中提取結構化資料的最佳方法是透過 [function calling](https://platform.openai.com/docs/guides/function-calling)。

在本筆筆記中，我們探討了最新的 [JSON Mode](https://platform.openai.com/docs/guides/text-generation/json-mode) 與 function calling 功能在結構化輸出與提取方面的權衡。

*更新*：OpenAI 已澄清，JSON 模式對於 function calling 始終啟用，它對於一般訊息 (<https://community.openai.com/t/json-mode-vs-function-calling/476994/4>) 則是選擇性啟用。

### 生成合成資料

我們將從生成用於資料提取任務的合成資料開始。讓我們向我們的 LLM 請求一個假設的銷售記錄。

```
%pip install llama-index-llms-openai
%pip install llama-index-program-openai
```

```
from llama_index.llms.openai import OpenAI


llm = OpenAI(model="gpt-3.5-turbo-1106")
response = llm.complete(
    "Generate a sales call transcript, use real names, talk about a product, discuss some action items"
)
```

```
transcript = response.text
print(transcript)
```

```
[Phone rings]


John: Hello, this is John.


Sarah: Hi John, this is Sarah from XYZ Company. I'm calling to discuss our new product, the XYZ Widget, and see if it might be a good fit for your business.


John: Hi Sarah, thanks for reaching out. I'm definitely interested in learning more about the XYZ Widget. Can you give me a quick overview of what it does?


Sarah: Of course! The XYZ Widget is a cutting-edge tool that helps businesses streamline their workflow and improve productivity. It's designed to automate repetitive tasks and provide real-time data analytics to help you make informed decisions.


John: That sounds really interesting. I can see how that could benefit our team. Do you have any case studies or success stories from other companies who have used the XYZ Widget?


Sarah: Absolutely, we have several case studies that I can share with you. I'll send those over along with some additional information about the product. I'd also love to schedule a demo for you and your team to see the XYZ Widget in action.


John: That would be great. I'll make sure to review the case studies and then we can set up a time for the demo. In the meantime, are there any specific action items or next steps we should take?


Sarah: Yes, I'll send over the information and then follow up with you to schedule the demo. In the meantime, feel free to reach out if you have any questions or need further information.


John: Sounds good, I appreciate your help Sarah. I'm looking forward to learning more about the XYZ Widget and seeing how it can benefit our business.


Sarah: Thank you, John. I'll be in touch soon. Have a great day!


John: You too, bye.
```


### 設定我們想要的 schema

讓我們指定我們想要的輸出「形狀」(shape)，作為一個 Pydantic Model。

```
from pydantic import BaseModel, Field
from typing import List




class CallSummary(BaseModel):
    """Data model for a call summary."""


    summary: str = Field(
        description="High-level summary of the call transcript. Should not exceed 3 sentences."
    )
    products: List[str] = Field(
        description="List of products discussed in the call"
    )
    rep_name: str = Field(description="Name of the sales rep")
    prospect_name: str = Field(description="Name of the prospect")
    action_items: List[str] = Field(description="List of action items")
```


### 透過 function calling 進行資料提取

我們可以在 LlamaIndex 的 `OpenAIPydanticProgram` 模組中輕鬆完成這項工作，只需定義一個 prompt template，並傳入我們定義的 LLM 和 pydantic model。

```
from llama_index.program.openai import OpenAIPydanticProgram
from llama_index.core import ChatPromptTemplate
from llama_index.core.llms import ChatMessage
```

```
prompt = ChatPromptTemplate(
    message_templates=[
        ChatMessage(
            role="system",
            content=(
                "You are an expert assitant for summarizing and extracting insights from sales call transcripts."
            ),
        ),
        ChatMessage(
            role="user",
            content=(
                "Here is the transcript: \n"
                "------\n"
                "{transcript}\n"
                "------"
            ),
        ),
    ]
)
program = OpenAIPydanticProgram.from_defaults(
    output_cls=CallSummary,
    llm=llm,
    prompt=prompt,
    verbose=True,
)
```

```
output = program(transcript=transcript)
```

```
Function call: CallSummary with args: {"summary":"Sarah from XYZ Company called to discuss the new product, the XYZ Widget, which John expressed interest in. Sarah offered to share case studies and schedule a demo. They agreed to review the case studies and set up a time for the demo. The next steps include Sarah sending over information and following up to schedule the demo.","products":["XYZ Widget"],"rep_name":"Sarah","prospect_name":"John","action_items":["Review case studies","Schedule demo"]}
```


我們現在有了想要的結構化資料，作為一個 Pydantic Model。快速檢查顯示結果如我們預期的那樣。

```
output.dict()
```

```
{'summary': 'Sarah from XYZ Company called to discuss the new product, the XYZ Widget, which John expressed interest in. Sarah offered to share case studies and schedule a demo. They agreed to review the case studies and set up a time for the demo. The next steps include Sarah sending over information and following up to schedule the demo.',
 'products': ['XYZ Widget'],
 'rep_name': 'Sarah',
 'prospect_name': 'John',
 'action_items': ['Review case studies', 'Schedule demo']}
```


### 透過 JSON 模式進行資料提取

讓我們嘗試使用 JSON 模式來做同樣的事情，而不是使用 function calling。

```
prompt = ChatPromptTemplate(
    message_templates=[
        ChatMessage(
            role="system",
            content=(
                "You are an expert assitant for summarizing and extracting insights from sales call transcripts.\n"
                "Generate a valid JSON following the given schema below:\n"
                "{json_schema}"
            ),
        ),
        ChatMessage(
            role="user",
            content=(
                "Here is the transcript: \n"
                "------\n"
                "{transcript}\n"
                "------"
            ),
        ),
    ]
)
```

```
messages = prompt.format_messages(
    json_schema=CallSummary.schema_json(), transcript=transcript
)
```

```
output = llm.chat(
    messages, response_format={"type": "json_object"}
).message.content
```


我們得到了一個有效的 JSON，但它只在重複我們指定的 schema，而沒有實際進行提取。

```
print(output)
```

```
{
  "title": "CallSummary",
  "description": "Data model for a call summary.",
  "type": "object",
  "properties": {
    "summary": {
      "title": "Summary",
      "description": "High-level summary of the call transcript. Should not exceed 3 sentences.",
      "type": "string"
    },
    "products": {
      "title": "Products",
      "description": "List of products discussed in the call",
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "rep_name": {
      "title": "Rep Name",
      "description": "Name of the sales rep",
      "type": "string"
    },
    "prospect_name": {
      "title": "Prospect Name",
      "description": "Name of the prospect",
      "type": "string"
    },
    "action_items": {
      "title": "Action Items",
      "description": "List of action items",
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": ["summary", "products", "rep_name", "prospect_name", "action_items"]
}
```


讓我們再試一次，只顯示我們想要的 JSON 格式，而不是指定 schema。

```
import json


prompt = ChatPromptTemplate(
    message_templates=[
        ChatMessage(
            role="system",
            content=(
                "You are an expert assitant for summarizing and extracting insights from sales call transcripts.\n"
                "Generate a valid JSON in the following format:\n"
                "{json_example}"
            ),
        ),
        ChatMessage(
            role="user",
            content=(
                "Here is the transcript: \n"
                "------\n"
                "{transcript}\n"
                "------"
            ),
        ),
    ]
)


dict_example = {
    "summary": "High-level summary of the call transcript. Should not exceed 3 sentences.",
    "products": ["product 1", "product 2"],
    "rep_name": "Name of the sales rep",
    "prospect_name": "Name of the prospect",
    "action_items": ["action item 1", "action item 2"],
}


json_example = json.dumps(dict_example)
```

```
messages = prompt.format_messages(
    json_example=json_example, transcript=transcript
)
```

```
output = llm.chat(
    messages, response_format={"type": "json_object"}
).message.content
```


現在我們能夠獲得如我們預期的結構化資料。

```
print(output)
```

```
{
  "summary": "Sarah from XYZ Company called John to discuss the new product, the XYZ Widget, which is designed to streamline workflow and improve productivity. They discussed case studies and scheduling a demo for John and his team. The next steps include Sarah sending over information and following up to schedule the demo.",
  "products": ["XYZ Widget"],
  "rep_name": "Sarah",
  "prospect_name": "John",
  "action_items": ["Review case studies", "Schedule demo"]
}
```


### 快速重點

- function calling 對於結構化資料提取仍然更容易使用（特別是如果你已經將你的 schema 指定為例如一個 pydantic model）。
- 雖然 JSON 模式強制執行輸出格式，但它無法幫助對比指定的 schema 進行驗證。直接傳入 schema 可能無法產生預期的 JSON，並可能需要額外的仔細格式化和 prompt。