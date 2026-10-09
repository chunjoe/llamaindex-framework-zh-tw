---
title: "Baseten Cookbook"
---

```
%pip install llama-index llama-index-llms-baseten
```

```
from llama_index.llms.baseten import Baseten
```

## Model APIs 與專屬部署

Baseten 提供兩種主要的推論方式。

1. Model APIs 是給熱門開源模型的公開 endpoint（如 GPT-OSS, Kimi K2, DeepSeek 等），您可以直接透過 slug 使用前沿模型，例如 `deepseek-ai/DeepSeek-V3-0324`，並且會依據 token 數量計費。您可以在此處找到支援的模型列表：<https://docs.baseten.co/development/model-apis/overview#supported-models>。

2. 專屬部署適用於服務自訂模型，您希望對生產工作負載進行自動擴展（autoscale）並擁有細緻的配置（fine-grain configuration）。您需要在 Baseten dashboard 中部署模型，並提供 8 個字元的模型 ID，例如 `abcd1234`。

預設情況下，我們將 `model_apis` 參數設定為 `True`。如果您想使用專屬部署，在實例化 Baseten 物件時，必須將 `model_apis` 參數設定為 `False`。

#### 實例化 (Instantiation)

```
# Model APIs, you can find the model_slug here: https://docs.baseten.co/development/model-apis/overview#supported-models
llm = Baseten(
    model_id="MODEL_SLUG",
    api_key="YOUR_API_KEY",
    model_apis=True,  # Default, so not strictly necessary
)


# Dedicated Deployments, you can find the model_id by in the Baseten dashboard here: https://app.baseten.co/overview
llm = Baseten(
    model_id="MODEL_ID",
    api_key="YOUR_API_KEY",
    model_apis=False,
)
```

#### 使用 prompt 呼叫 `complete`

```
llm_response = llm.complete("Paul Graham is")
print(llm_response.text)
```

```
Paul Graham is a British-American entrepreneur, essayist, and programmer, best known for co-founding the startup accelerator **Y Combinator (YC)** and for his influential essays on technology, startups, and philosophy. Here are some key highlights about him:


### **Background & Career**
- Born in 1964 in England, Graham studied at **Cornell University** and earned a PhD in **Computer Science** from **Harvard**.
- He created **Viaweb** (1995), the first web-based application, which was later acquired by Yahoo! in 1998 and became **Yahoo! Store**.
- Co-founded **Y Combinator (2005)** with Jessica Livingston, Robert Morris, and Trevor Blackwell. YC has funded companies like **Airbnb, Dropbox, Stripe, Reddit, and DoorDash**.


### **Writing & Influence**
- Known for his **essays** on startups, technology, and life philosophy (hosted on his website [paulgraham.com](http://www.paulgraham.com)).
- Popular essays include:
  - *"How to Start a Startup"*
  - *"Do Things That Don't Scale"*
  - *"The Hardest Lessons for Start
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
assistant: Arrr, matey! I be known as Captain Crimsonbeard—though me beard be more fiery red than crimson, truth be told! A pirate of legend, scourge of the seven memes, and connoisseur of questionable life choices. But ye can call me Cap’n if ye like, or "That Weird Pirate Who Won’t Stop Talking About Pineapples." Now, what mischief brings ye to me ship today? 🏴‍☠️🍍
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
Paul Graham is a British-American entrepreneur, essayist, and venture capitalist, best known as a co-founder of **Y Combinator**, a highly influential startup accelerator that has helped launch companies like Airbnb, Dropbox, Stripe, and Reddit.


### Key Facts About Paul Graham:
1. **Early Career**: Originally a programmer, he developed **Viaweb**, one of the first web-based applications, which was acquired by Yahoo! in 1998 and became Yahoo! Store.
2. **Y Combinator**: In 2005, he co-founded Y Combinator with Jessica Livingston, Robert Morris, and Trevor Blackwell. It pioneered the "seed accelerator" model, providing funding and mentorship to early-stage startups.
3. **Essays**: Graham is known for his insightful essays on startups, technology, and life philosophy, available on his website ([paulgraham.com](http://www.paulgraham.com)). Popular ones include *"How to Get Startup Ideas"* and *"Do Things That Don't Scale."*
4. **Investments**: Through YC, he has backed thousands of startups, shaping Silicon Valley’s tech landscape.
5. **Lisp Advocate**: A proponent of the Lisp programming language,
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
Arrr, me name be Captain Crimsonbeard! A fearsome and flamboyant pirate with a beard as red as the setting sun and a wardrobe brighter than a treasure chest full o’ jewels! I sail the seven seas in search of adventure, gold, and the finest rum—always with a dramatic flair and a twinkle in me eye.


What be yer name, matey? Or shall I just call ye "Lucky Crewmember" for now? *winks and adjusts my feathered hat*
```

# Async

Async 操作用於長時間運行的推論任務，這些任務可能會遇到請求超時（request timeouts）、批次推論工作（batch inference jobs），以及對特定請求的優先處理。

(1) 在整合中，`acomplete` async function 使用 aiohttp 函式庫，在 python 中的一個異步 HTTP client。該函式會呼叫適當的 Baseten model endpoint 上的 async\_predict，如果成功，使用者會收到帶有 request\_id 的回應。使用者可以透過回傳的 request\_id 檢查狀態或取消 async\_predict 請求。

(2) 一旦模型完成請求的執行，async 結果會發送到使用者提供的 webhook endpoint。使用者的 endpoint 負責驗證 webhook 簽名以確保安全性，然後處理並儲存輸出。

Baseten: 取得 request\_id → 結果發送到 webhook

##### 注意：Async 僅適用於專屬部署，不適用於 Model APIs。`achat` 不支援，因為聊天（chat）不適用於 async 操作。

```
async_llm = Baseten(
    model_id="YOUR_MODEL_ID",
    api_key="YOUR_API_KEY",
    webhook_endpoint="YOUR_WEBHOOK_ENDPOINT",
)
response = await async_llm.acomplete("Paul Graham is")
print(response)  # This is the request id
```

```
35643965636d4c3da6f54b5c3b354aa0
```

```
"""
This will return the status information of a request using an async_predict request's request_id and the model_id the async_predict request was made with.
"""


import requests
import os


model_id = "YOUR_MODEL_ID"
request_id = "YOUR_REQUEST_ID"
# Read secrets from environment variables
baseten_api_key = "YOUR_API_KEY"


resp = requests.get(
    f"https://model-{model_id}.api.baseten.co/async_request/{request_id}",
    headers={"Authorization": f"Api-Key {baseten_api_key}"},
)


print(resp.json())
```

```
{'request_id': '35643965636d4c3da6f54b5c3b354aa0', 'model_id': 'yqvr2lxw', 'deployment_id': '31kmg1w', 'status': 'SUCCEEDED', 'webhook_status': 'SUCCEEDED', 'created_at': '2025-03-27T00:17:51.578558Z', 'status_at': '2025-03-27T00:18:38.768572Z', 'errors': []}
```
