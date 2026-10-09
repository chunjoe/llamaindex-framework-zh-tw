---
title: "結構化資料擷取簡介"
---

LLM 擅長理解資料，因此其中一項重要用途，就是將一般人類語言（我們稱為**非結構化資料**）轉換為電腦程式可使用的特定、規則且符合預期的格式。我們將這個流程的輸出稱為**結構化資料**。由於轉換過程通常會忽略許多多餘資訊，因此我們稱這個過程為**擷取**。

LlamaIndex 結構化資料擷取的核心是 [Pydantic](https://docs.pydantic.dev/latest/) 類別：你可以在 Pydantic 中定義資料結構，再由 LlamaIndex 與 Pydantic 協作，將 LLM 的輸出轉換成該結構。

## 什麼是 Pydantic？

Pydantic 是廣泛使用的資料驗證與轉換函式庫，主要依賴 Python 型別宣告。Pydantic 專案文件提供[完整指南](https://docs.pydantic.dev/latest/concepts/models/)，這裡先介紹基本概念。

若要建立 Pydantic 類別，請繼承 Pydantic 的 `BaseModel` 類別：

```
from pydantic import BaseModel




class User(BaseModel):
    id: int
    name: str = "Jane Doe"
```

在此例中，你建立了一個 `User` 類別，其中包含 `id` 和 `name` 兩個欄位。`id` 定義為整數，`name` 則是字串，預設值為 `Jane Doe`。

你可以將這些模型巢狀組合，建立更複雜的結構：

```
from typing import List, Optional
from pydantic import BaseModel




class Foo(BaseModel):
    count: int
    size: Optional[float] = None




class Bar(BaseModel):
    apple: str = "x"
    banana: str = "y"




class Spam(BaseModel):
    foo: Foo
    bars: List[Bar]
```

現在 `Spam` 有 `foo` 和 `bars`；`Foo` 有 `count` 和可選的 `size`，而 `bars` 是一個 List，其中每個物件都有 `apple` 和 `banana` 屬性。

## 將 Pydantic 物件轉換為 JSON Schema

Pydantic 支援將 Pydantic 類別轉換成符合[常見標準](https://docs.pydantic.dev/latest/concepts/json_schema/)的 JSON 序列化 schema 物件。例如，上述 `User` 類別會序列化成：

```
{
  "properties": {
    "id": {
      "title": "Id",
      "type": "integer"
    },
    "name": {
      "default": "Jane Doe",
      "title": "Name",
      "type": "string"
    }
  },
  "required": ["id"],
  "title": "User",
  "type": "object"
}
```

這項特性相當關鍵：這些 JSON 格式的 schema 通常會傳給 LLM，而 LLM 會依照其中的指示回傳資料。

## 使用註解

如前所述，LLM 會將 Pydantic 提供的 JSON schema 當作回傳資料的指示。若要協助模型並提升輸出準確度，可以為物件和欄位加上自然語言描述，說明它們的用途。Pydantic 支援使用 [docstrings](https://www.geeksforgeeks.org/python-docstrings/) 和[欄位](https://docs.pydantic.dev/latest/concepts/fields/)來描述這些資訊。

接下來的範例都會使用以下 Pydantic 類別：

```
from datetime import datetime




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

這些定義會展開成更完整的 JSON schema：

```
{
  "$defs": {
    "LineItem": {
      "description": "A line item in an invoice.",
      "properties": {
        "item_name": {
          "description": "The name of this item",
          "title": "Item Name",
          "type": "string"
        },
        "price": {
          "description": "The price of this item",
          "title": "Price",
          "type": "number"
        }
      },
      "required": ["item_name", "price"],
      "title": "LineItem",
      "type": "object"
    }
  },
  "description": "A representation of information from an invoice.",
  "properties": {
    "invoice_id": {
      "description": "A unique identifier for this invoice, often a number",
      "title": "Invoice Id",
      "type": "string"
    },
    "date": {
      "description": "The date this invoice was created",
      "format": "date-time",
      "title": "Date",
      "type": "string"
    },
    "line_items": {
      "description": "A list of all the items in this invoice",
      "items": {
        "$ref": "#/$defs/LineItem"
      },
      "title": "Line Items",
      "type": "array"
    }
  },
  "required": ["invoice_id", "date", "line_items"],
  "title": "Invoice",
  "type": "object"
}
```

現在你已了解 Pydantic 及其產生的 schema 基本概念，可以接著在 LlamaIndex 中使用 Pydantic 類別進行結構化資料擷取，從[結構化 LLM](/python/framework/understanding/extraction/structured_llms/)開始。
