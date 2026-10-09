---
title: "LM Format Enforcer"
---

[LM Format Enforcer](https://github.com/noamgat/lm-format-enforcer) 是一個強制執行語言模型輸出格式（JSON Schema、Regex 等）的函式庫。它不只是向 LLM「建議」所需的輸出結構，而是能實際「強制」LLM 的輸出遵循指定的 schema。

![image](/assets/28db83789594.webp)

LM Format Enforcer 與本地的 LLMs（目前支援 `LlamaCPP` 和 `HuggingfaceLLM` backends）配合使用，僅透過處理 LLM 的輸出 logits 來運作。這使其能夠支援 beam search 和 batching 等進階生成方法，不同於其他修改生成迴圈本身的解決方案。請參閱 [LM Format Enforcer page](https://github.com/noamgat/lm-format-enforcer) 中的比較表以了解更多詳情。

## JSON Schema 輸出

在 LlamaIndex 中，我們提供與 LM Format Enforcer 的初始整合，讓生成結構化輸出（更具體地說是 pydantic 物件）變得非常簡單。

例如，如果我們想生成一張歌曲專輯，並使用以下 schema：

```
class Song(BaseModel):
    title: str
    length_seconds: int




class Album(BaseModel):
    name: str
    artist: str
    songs: List[Song]
```

只需建立一個 `LMFormatEnforcerPydanticProgram`，指定我們想要的 pydantic class `Album`，並提供一個合適的 prompt template。

> 注意：`LMFormatEnforcerPydanticProgram` 會自動填入 pydantic class 在 prompt template 的選用 `{json_schema}` 參數中的 json schema。這有助於 LLM 自然地生成正確的 JSON 並降低 format enforcer 的干擾，從而提高輸出品質。

```
program = LMFormatEnforcerPydanticProgram(
    output_cls=Album,
    prompt_template_str="Generate an example album, with an artist and a list of songs. Using the movie {movie_name} as inspiration. You must answer according to the following schema: \n{json_schema}\n",
    llm=LlamaCPP(),
    verbose=True,
)
```

現在我們可以透過呼叫並提供額外的使用者輸入來運行程式。這裡我們來做一些神秘的事情，並創作一張受《驚魂記》啟發的專輯。

```
output = program(movie_name="The Shining")
```

我們有我們的 pydantic 物件：

```
Album(
    name="The Shining: A Musical Journey Through the Haunted Halls of the Overlook Hotel",
    artist="The Shining Choir",
    songs=[
        Song(title="Redrum", length_seconds=300),
        Song(
            title="All Work and No Play Makes Jack a Dull Boy",
            length_seconds=240,
        ),
        Song(title="Heeeeere's Johnny!", length_seconds=180),
    ],
)
```

您可以參閱 [此 notebook](https://developers.llamaindex.ai/python/examples/output_parsing/lmformatenforcer_pydantic_program/index.md) 以獲取更多詳情。

## 正則表達式輸出

LM Format Enforcer 也支援 regex 輸出。由於 LlamaIndex 中尚無現有的 regular expressions 抽象層，我們將直接使用 LLM，在其中注入 LM Format Generator。

```
regex = r'"Hello, my name is (?P<name>[a-zA-Z]*)\. I was born in (?P<hometown>[a-zA-Z]*). Nice to meet you!"'
prompt = "Here is a way to present myself, if my name was John and I born in Boston: "


llm = LlamaCPP()
regex_parser = lmformatenforcer.RegexParser(regex)
lm_format_enforcer_fn = build_lm_format_enforcer_function(llm, regex_parser)
with activate_lm_format_enforcer(llm, lm_format_enforcer_fn):
    output = llm.complete(prompt)
```

這將會導致 LLM 以我們指定的 regular expression 格式生成輸出。我們也可以解析輸出以獲取命名組：

```
print(output)
# "Hello, my name is John. I was born in Boston, Nice to meet you!"
print(re.match(regex, output.text).groupdict())
# {'name': 'John', 'hometown': 'Boston'}
```

請參閱 [此 notebook](https://developers.llamaindex.ai/python/examples/output_parsing/lmformatenforcer_regular_expressions/index.md) 以獲取更多詳情。