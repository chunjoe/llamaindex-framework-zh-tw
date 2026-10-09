---
title: "結構化輸入"
---

結構化資料的另一面，除了輸出之外，還有輸入：許多提示指南和最佳實踐確實包含一些技巧，例如使用 XML 標記輸入提示，以提升 LLM 對輸入的理解。

LlamaIndex 讓您有機會原生格式化輸入為 XML 片段，利用 [banks](https://masci.github.io/banks) 和 [Jinja](https://jinja.palletsprojects.com/en/stable/)（請確保已安裝 `llama-index>=0.12.34`）。

## 只使用結構化輸入

以下是如何使用結構化輸入與 Pydantic 模型的一個簡單範例：

````
from pydantic import BaseModel
from llama_index.core.prompts import RichPromptTemplate
from llama_index.llms.openai import OpenAI
from typing import Dict


template_str = "Please extract from the following XML code the contact details of the user:\n\n```xml\n{{ user | to_xml }}\n```\n\n"
prompt = RichPromptTemplate(template_str)




class User(BaseModel):
    name: str
    surname: str
    age: int
    email: str
    phone: str
    social_accounts: Dict[str, str]




user = User(
    name="John",
    surname="Doe",
    age=30,
    email="john.doe@example.com",
    phone="123-456-7890",
    social_accounts={"bluesky": "john.doe", "instagram": "johndoe1234"},
)


## check how the prompt would look like


prompt.format(user=user)


llm = OpenAI()


response = llm.chat(prompt.format_messages(user=user))


print(response.message.content)
````

如您所見，為了使用結構化輸出，我們需要使用一個 Jinja 表達式（由 `{{}}` 括住）搭配 `to_xml` 過濾器（過濾運算符是 `|`）。

## 結合結構化輸入與結構化輸出

結構化輸入與結構化輸出的結合可以真正提升 LLM 輸出的一致性（以及因此的可靠性）。

透過下面的程式碼片段，您可以看到如何串接這兩個資料結構化的步驟。

```
from pydantic import Field
from typing import Optional




class SocialAccounts(BaseModel):
    instagram: Optional[str] = Field(default=None)
    bluesky: Optional[str] = Field(default=None)
    x: Optional[str] = Field(default=None)
    mastodon: Optional[str] = Field(default=None)




class ContactDetails(BaseModel):
    email: str
    phone: str
    social_accounts: SocialAccounts




sllm = llm.as_structured_llm(ContactDetails)


structured_response = await sllm.achat(prompt.format_messages(user=user))


print(structured_response.raw.email)
print(structured_response.raw.phone)
print(structured_response.raw.social_accounts.instagram)
print(structured_response.raw.social_accounts.bluesky)
```

如果您想獲得更深入的結構化輸入指南，請查看這個 [範例 notebook](https://docs.llamaindex.ai/en/latest/examples/prompts/structured_input)。