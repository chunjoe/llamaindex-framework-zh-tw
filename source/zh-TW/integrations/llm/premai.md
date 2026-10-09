---
title: "PremAI LlamaIndex"
---

[PremAI](https://premai.io/) 是一站式平台，可簡化生成式 AI 應用程式的建置，協助您打造穩健、可投入正式環境的產品。PremAI 簡化開發流程，讓您專注改善使用者體驗並推動應用程式成長。您可以從[快速入門](https://docs.premai.io/quick-start)開始使用平台。

## 安裝與設定

先安裝 `llama-index` 和 `premai-sdk`。執行以下指令即可安裝：

終端機視窗

```
pip install premai llama-index
```

接下來，請先註冊 PremAI 帳戶並建立專案。若尚未完成，請參閱 PremAI 平台的[快速入門指南](https://docs.premai.io/introduction)，建立第一個專案並取得 API 金鑰。

```
%pip install llama-index-llms-premai
```

```
from llama_index.llms.premai import PremAI
from llama_index.core.llms import ChatMessage
```

## 使用 LlamaIndex 設定 PremAI 用戶端

匯入所需模組後，就可以設定用戶端。以下假設 `project_id` 為 `8`；請記得換成您自己的專案 ID，否則會發生錯誤。

使用 llama-index 串接 PremAI 時，不必在 chat client 指定模型名稱或其他參數。預設會沿用 [LaunchPad](https://docs.premai.io/get-started/launchpad) 中設定的模型與參數。

> 設定用戶端時，如果修改 `model` 或 `temperature`、`max_tokens` 等參數，就會覆寫 LaunchPad 中原有的預設設定。

```
import os
import getpass


if os.environ.get("PREMAI_API_KEY") is None:
    os.environ["PREMAI_API_KEY"] = getpass.getpass("PremAI API Key:")


prem_chat = PremAI(project_id=8)
```

## 聊天補全

環境已準備完成，現在可以開始與應用程式互動。先用 llama-index 建立簡單的聊天請求並取得回覆。

```
messages = [
    ChatMessage(role="user", content="What is your name"),
    ChatMessage(
        role="user", content="Write an essay about your school in 500 words"
    ),
]
```

請注意，您可以像這樣在 `ChatMessage` 中提供 system prompt：

```
messages = [
    ChatMessage(role="system", content="Act like a pirate"),
    ChatMessage(role="user", content="What is your name"),
    ChatMessage(role="user", content="Where do you live, write an essay in 500 words"),
]
```

您也可以在建立用戶端時提供 system prompt：

```
chat = PremAI(project_id=8, system_prompt="Act like nemo fish")
```

> 這兩種做法都會覆寫您在平台部署應用程式時設定的 system prompt。特別是，若建立 **PremAI** 類別的執行個體時覆寫了 system prompt，`ChatMessage` 中的 system message 就不會生效。

> 若要在實驗時覆寫 system prompt，請在建立用戶端時設定，或在 `ChatMessage` 中以 `system` 角色提供。

現在呼叫模型：

```
response = prem_chat.chat(messages)
print(response)
```

```
[ChatResponse(message=ChatMessage(role=<MessageRole.ASSISTANT: 'assistant'>, content="I'm here to assist you with any questions or tasks you have, but I'm not able to write essays. However, if you need help brainstorming ideas or organizing your thoughts for your essay about your school, I'd be happy to help with that. Just let me know how I can assist you further!", additional_kwargs={}), raw={'role': <RoleEnum.ASSISTANT: 'assistant'>, 'content': "I'm here to assist you with any questions or tasks you have, but I'm not able to write essays. However, if you need help brainstorming ideas or organizing your thoughts for your essay about your school, I'd be happy to help with that. Just let me know how I can assist you further!"}, delta=None, additional_kwargs={})]
```

您也可以將聊天函式改為 completion 函式，做法如下：

```
completion = prem_chat.complete("Paul Graham is ")
```

> 如果在此處提供 system prompt，就會覆寫您在平台部署應用程式時設定的 system prompt。

> 所有選用參數請參閱[這裡](https://docs.premai.io/get-started/sdk#optional-parameters)。呼叫模型前，不在[支援參數清單](https://docs.premai.io/get-started/sdk#optional-parameters)中的參數都會自動移除。

## 透過 Prem Repositories 原生支援 RAG

Prem Repositories 允許使用者上傳文件（例如 .txt、.pdf），並將這些 repository 連接到 LLM。您可以把 Prem repositories 視為原生 RAG；每個 repository 都可看成一個向量資料庫，而且可以連接多個 repository。更多資訊請參閱[文件](https://docs.premai.io/get-started/repositories)。

PremAI 的 LangChain 整合也支援 repositories，做法如下：

```
query = "what is the diameter of individual Galaxy"
repository_ids = [
    1991,
]
repositories = dict(ids=repository_ids, similarity_threshold=0.3, limit=3)
```

首先，使用一或多個 repository ID 定義 repository。請確認這些 ID 有效；取得 repository ID 的方式請參閱[這裡](https://docs.premai.io/get-started/repositories)。

> 請注意：和 `model_name` 一樣，呼叫時傳入 `repositories` 參數，也可能覆寫 LaunchPad 中已連接的 repositories。

接著將 repository 傳入 chat 物件，以使用 RAG 產生回覆。

```
messages = [
    ChatMessage(role="user", content=query),
]


response = prem_chat.chat(messages, repositories=repositories)
print(response)
```

因此，使用 Prem Platform 時不必自行建置 RAG pipeline。Prem 會使用自家的 RAG 技術，提供高品質的檢索增強生成結果。

> 通常不必在此處額外連接 Repository IDs，就能使用檢索增強生成。如果您已在 Prem Platform 連接 repositories，仍可取得相同結果。

## Prem Templates

撰寫提示詞範本可能相當繁瑣：範本往往很長、不易管理，而且需要持續調整，才能在整個應用程式中維持一致並改善效果。

使用 **Prem**，撰寫和管理 prompt 就容易得多。[launchpad](https://docs.premai.io/get-started/launchpad) 中的 ***Templates*** 分頁可讓您建立所需的 prompt templates，並透過 SDK 在應用程式中使用。更多資訊請參閱[Prompt Templates 文件](https://docs.premai.io/get-started/prem-templates)。

若要在 llama-index 中原生使用 Prem Templates，請傳入一個字典，以 `id` 為鍵、範本變數為值，並將這組鍵值放入 ChatMessage 的 `additional_kwargs`。

例如，假設您的 prompt template 如下：

```
Say hello to my name and say a feel-good quote
from my age. My name is: {name} and age is {age}
```

訊息可以這樣設定：

```
messages = [
    ChatMessage(
        role="user", content="Shawn", additional_kwargs={"id": "name"}
    ),
    ChatMessage(role="user", content="22", additional_kwargs={"id": "age"}),
]
```

將 `messages` 傳入 llama-index 的 PremAI 用戶端。請記得一併傳入 `template_id`，才能使用 Prem Templates 產生內容。如果不清楚 `template_id` 的用途，可參閱[相關文件](https://docs.premai.io/get-started/prem-templates)。範例如下：

```
template_id = "78069ce8-xxxxx-xxxxx-xxxx-xxx"
response = prem_chat.chat(messages, template_id=template_id)
```

Prem Templates 也支援串流。

## 串流

本節示範如何使用 llama-index 和 PremAI 串流 token，做法與前面的方式相似：

```
streamed_response = prem_chat.stream_chat(messages)


for response_delta in streamed_response:
    print(response_delta.delta, end="")
```

```
I'm here to assist you with writing tasks, but I don't have personal experiences or attend school. However, I can help you brainstorm ideas, outline your essay, or provide information on various school-related topics. Just let me know how I can assist you further!
```

token 會依序串流輸出。與 `complete` 方法類似，`stream_complete` 可用於串流輸出 completion 結果。

```
# This will stream tokens one by one


streamed_response = prem_chat.stream_complete("hello how are you")


for response_delta in streamed_response:
    print(response_delta.delta, end="")
```

```
Hello! I'm here and ready to assist you. How can I help you today?
```
