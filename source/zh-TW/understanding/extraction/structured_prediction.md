---
title: "結構化預測"
---

結構化預測讓您對應用程式呼叫 LLM 並使用 Pydantic 的方式擁有更細緻的控制。我們將使用與前一個範例相同的 `Invoice` 類別，載入 PDF，並像以前一樣使用 OpenAI。我們不會建立一個結構化的 LLM，而是會在 LLM 本身呼叫 `structured_predict`；這是每個 LLM 類別的方法。

Structured predict 接受一個 Pydantic 類別和一個 Prompt Template 作為參數，以及 Prompt Template 中任何變數的關鍵字參數。

```
from llama_index.core.prompts import PromptTemplate


prompt = PromptTemplate(
    "Extract an invoice from the following text. If you cannot find an invoice ID, use the company name '{company_name}' and the date as the invoice ID: {text}"
)


response = llm.structured_predict(
    Invoice, prompt, text=text, company_name="Uber"
)
```

如您所見，這使我們能夠包含額外的提示方向，以指導當 Pydantic 不足以正確解析資料時，LLM 應該做什麼。此情況下的 response object 就是 Pydantic 物件本身。如果我們需要，可以取得輸出作為 JSON：

```
json_output = response.model_dump_json()
print(json.dumps(json.loads(json_output), indent=2))
```

```
{
    "invoice_id": "Uber-2024-10-10",
    "date": "2024-10-10T19:49:00",
    "line_items": [
        {"item_name": "Trip fare", "price": 12.18},
        {"item_name": "Access for All Fee", "price": 0.1},
        ...,
    ],
}
```

`structured_predict` 有多種變體可供不同使用情境使用，包括 async (`astructured_predict`) 和 streaming (`stream_structured_predict`, `astream_structured_predict`)。

## 底層

根據您使用的 LLM，`structured_predict` 使用兩種不同的類別來處理呼叫 LLM 和解析輸出。

### FunctionCallingProgram

如果您使用的 LLM 具有呼叫 API 的功能，`FunctionCallingProgram` 將會：

- 將 Pydantic 物件轉換為一個 tool
- 提示 LLM 並強制它使用此 tool
- 返回生成的 Pydantic 物件

這通常是更可靠的方法，如果可用則會優先使用。然而，有些 LLMs 僅為純文字，它們將會使用另一種方法。

### LLMTextCompletionProgram

如果 LLM 是純文字的，`LLMTextCompletionProgram` 將會：

- 將 Pydantic schema 作為 JSON
- 將 schema 和資料傳送給 LLM，並提供提示指令，要求它以符合 schema 的形式回應
- 在 Pydantic 物件上呼叫 `model_validate_json()`，傳入來自 LLM 的原始文字

這明顯不如前一種方法可靠，但由所有基於文字的 LLMs 支援。

## 直接呼叫預測類別

在實務上，`structured_predict` 對於任何 LLM 都應該表現良好，但如果您需要較底層的控制，則可以直接呼叫 `FunctionCallingProgram` 和 `LLMTextCompletionProgram` 並進一步自訂發生的情況：

```
textCompletion = LLMTextCompletionProgram.from_defaults(
    output_cls=Invoice,
    llm=llm,
    prompt=PromptTemplate(
        "Extract an invoice from the following text. If you cannot find an invoice ID, use the company name '{company_name}' and the date as the invoice ID: {text}"
    ),
)


output = textCompletion(company_name="Uber", text=text)
```

上述操作與在沒有 function calling API 的情況下呼叫 `structured_predict` 在 LLM 上是相同的，並返回一個與 `structured_predict` 相同的 Pydantic 物件。然而，您可以透過子類別 `PydanticOutputParser` 來自訂輸出如何被解析：

```
from llama_index.core.output_parsers import PydanticOutputParser




class MyOutputParser(PydanticOutputParser):
    def get_pydantic_object(self, text: str):
        # do something more clever than this
        return self.output_parser.model_validate_json(text)




textCompletion = LLMTextCompletionProgram.from_defaults(
    llm=llm,
    prompt=PromptTemplate(
        "Extract an invoice from the following text. If you cannot find an invoice ID, use the company name '{company_name}' and the date as the invoice ID: {text}"
    ),
    output_parser=MyOutputParser(output_cls=Invoice),
)
```

如果您正在使用一個低功耗的 LLM，需要幫助進行解析，這會很有用。

在最後一個部分，我們將探討甚至 [更底層的結構化資料提取呼叫](/python/framework/understanding/extraction/lower_level/)，包括在同一個呼叫中提取多個結構。