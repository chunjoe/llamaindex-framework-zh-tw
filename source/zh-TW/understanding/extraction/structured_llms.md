---
title: "使用 Structured LLMs"
---

要以最高層級的方式從 LlamaIndex 中提取結構化資料，是實例化一個 Structured LLM。首先，我們像之前一樣實例化我們的 Pydantic 類別：

```
from datetime import datetime
from pydantic import BaseModel, Field




class LineItem(BaseModel):
    """A line item in an invoice."""


    item_name: str = Field(description="The name of this item")
    price: float = Field(description="The price of this item")




class Invoice(BaseModel):
    """A representation of information from an invoice."""


    invoice_id: str = Field(
        description="A unique identifier for this invoice, often a number"
    )
    date: datetime = Field(description="The date this invoice was created")
    line_items: list[LineItem] = Field(
        description="A list of all the items in this invoice"
    )
```

如果這是您第一次使用 LlamaIndex，讓我們獲取我們的依賴項：

- 使用 `pip install llama-index-core llama-index-llms-openai` 來獲取 LLM（我們將使用 OpenAI 以簡化，但您可以隨時使用另一個）
- 獲取一個 OpenAI API key 並將其設定為名為 `OPENAI_API_KEY` 的環境變數
- 使用 `pip install llama-index-readers-file` 來獲取 PDFReader
  - 注意：為了更好地解析 PDF，我們建議使用 [LlamaParse](https://developers.llamaindex.ai/llamaparse/parse/getting_started/index.md)

現在讓我們載入一份實際發票的文字：

```
from llama_index.readers.file import PDFReader
from pathlib import Path


pdf_reader = PDFReader()
documents = pdf_reader.load_data(file=Path("./uber_receipt.pdf"))
text = documents[0].text
```

然後讓我們實例化一個 LLM，給它我們的 Pydantic 類別，然後要求它使用發票的純文字來執行 `complete`：

```
from llama_index.llms.openai import OpenAI


llm = OpenAI(model="gpt-4o")
sllm = llm.as_structured_llm(Invoice)


response = sllm.complete(text)
```

`response` 是一個具有兩個屬性 `text` 和 `raw` 的 LlamaIndex `CompletionResponse`。`text` 包含 JSON-serialized 形式的 Pydantic-ingested 回應：

```
json_response = json.loads(response.text)
print(json.dumps(json_response, indent=2))
```

```
{
    "invoice_id": "Visa \u2022\u2022\u2022\u20224469",
    "date": "2024-10-10T19:49:00",
    "line_items": [
        {"item_name": "Trip fare", "price": 12.18},
        {"item_name": "Access for All Fee", "price": 0.1},
        {"item_name": "CA Driver Benefits", "price": 0.32},
        {"item_name": "Booking Fee", "price": 2.0},
        {"item_name": "San Francisco City Tax", "price": 0.21},
    ],
}
```

請注意，這張發票沒有 ID，所以 LLM 盡力使用了信用卡號。Pydantic 驗證並不能保證一切！

response 的 `raw` 屬性（有些令人困惑）包含了 Pydantic 物件本身：

```
from pprint import pprint


pprint(response.raw)
```

```
Invoice(
    invoice_id="Visa ••••4469",
    date=datetime.datetime(2024, 10, 10, 19, 49),
    line_items=[
        LineItem(item_name="Trip fare", price=12.18),
        LineItem(item_name="Access for All Fee", price=0.1),
        LineItem(item_name="CA Driver Benefits", price=0.32),
        LineItem(item_name="Booking Fee", price=2.0),
        LineItem(item_name="San Francisco City Tax", price=0.21),
    ],
)
```

請注意，Pydantic 建立的是一個完整的 `datetime` 物件，而不僅僅是翻譯一個字串。

一個 structured LLM 的運作方式與一個普通的 LLM 類別完全相同：您可以呼叫 `chat`、`stream`、`achat`、`astream` 等，在所有情況下它都會回傳 Pydantic 物件。您也可以將您的 Structured LLM 作為參數傳遞給 `VectorStoreIndex.as_query_engine(llm=sllm)`，它將自動以結構化物件回應您的 RAG 查詢。

Structured LLM 會為您處理所有的提示（prompt）。如果您想對提示有更多的控制權，請前往 [Structured Prediction](/python/framework/understanding/extraction/structured_prediction/)。