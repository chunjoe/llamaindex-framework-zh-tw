---
title: "入門教學（使用 OpenAI）"
---

本教學將帶您開始使用 LlamaIndex 建置 agents。先從基本範例開始，再示範如何加入 RAG（Retrieval-Augmented Generation，檢索增強生成）功能。

提示

請先依照[安裝步驟](/python/framework/getting_started/installation/)完成安裝。

提示

想使用本機模型嗎？如果想只用本機模型完成入門教學，請[改看這份教學](/python/framework/getting_started/starter_example_local/)。

## 設定 OpenAI API 金鑰

LlamaIndex 預設使用 OpenAI 的 `gpt-3.5-turbo`，但本範例使用 `gpt-4o-mini` 作為 LLM。請將 API 金鑰設為環境變數，確保程式碼能讀取：

終端機視窗

```
# MacOS/Linux
export OPENAI_API_KEY=XXXXX


# Windows
set OPENAI_API_KEY=XXXXX
```

提示

若您使用與 OpenAI 相容的 API，可以改用 `OpenAILike` LLM 類別。更多資訊請參閱 [OpenAILike LLM](https://docs.llamaindex.ai/en/stable/api_reference/llms/openai_like/) 整合套件和 [OpenAILike Embeddings](https://docs.llamaindex.ai/en/stable/api_reference/embeddings/openai_like/) 整合套件。

## 基本 Agent 範例

先看一個簡單範例：agent 會呼叫工具來執行基本乘法。建立 `starter.py` 檔案：

```
import asyncio
from llama_index.core.agent.workflow import FunctionAgent
from llama_index.llms.openai import OpenAI




# Define a simple calculator tool
def multiply(a: float, b: float) -> float:
    """Useful for multiplying two numbers."""
    return a * b




# Create an agent workflow with our calculator tool
agent = FunctionAgent(
    tools=[multiply],
    llm=OpenAI(model="gpt-4o-mini"),
    system_prompt="You are a helpful assistant that can multiply two numbers.",
)




async def main():
    # Run the agent
    response = await agent.run("What is 1234 * 4567?")
    print(str(response))




# Run the agent
if __name__ == "__main__":
    asyncio.run(main())
```

執行後會得到類似結果：`The result of \( 1234 \times 4567 \) is \( 5,678,678 \).`

過程如下：

- agent 收到問題：`What is 1234 * 4567?`
- 在底層，這個問題連同工具的結構描述（名稱、docstring 和引數）一起傳給 LLM
- agent 選擇 `multiply` 工具，並填入工具所需的引數
- agent 收到工具傳回的結果，再將結果帶入最終回覆

提示

如您所見，這裡使用的是 `async` Python 函式。許多 LLM 和模型都支援非同步呼叫；使用非同步程式碼有助於提升應用程式效能。若想進一步了解 Python 的非同步程式碼，建議閱讀這段 [Python 非同步程式簡介](/python/framework/getting_started/async_python/)。

## 加入聊天記錄

`AgentWorkflow` 也能記住先前的訊息；這些訊息會保存在 `Context` 中，而這個物件屬於 `AgentWorkflow`。

若傳入 `Context`，agent 就會接續對話。

```
from llama_index.core.workflow import Context


# create context
ctx = Context(agent)


# run agent with context
response = await agent.run("My name is Logan", ctx=ctx)
response = await agent.run("What is my name?", ctx=ctx)
```


## 加入 RAG 功能

現在加入搜尋文件的能力，讓 agent 更完善。先在終端機下載範例資料：

終端機視窗

```
mkdir data
wget https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt -O data/paul_graham_essay.txt
```

您的目錄結構現在應該如下所示：

```
├── starter.py └── data    └── paul_graham_essay.txt
```

現在可使用 LlamaIndex 建立搜尋文件的工具。若未設定 `Settings.embed_model`，`VectorStoreIndex` 會改用 `OpenAIEmbedding`，預設使用 `text-embedding-ada-002` 模型。新專案建議明確傳入 `OpenAIEmbedding(model="text-embedding-3-small")`。

提示

想在本機產生嵌入向量，而且不需要 API 金鑰嗎？只要兩行程式碼，就能將託管的 embedding 模型換成本機 [Sentence Transformers](https://sbert.net/) 模型：

```
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core import Settings


Settings.embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")
```

請參閱[本機模型入門教學](/python/framework/getting_started/starter_example_local/)，了解如何建立完全在本機執行的 pipeline。

修改後的 `starter.py` 如下：

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core.agent.workflow import FunctionAgent
from llama_index.llms.openai import OpenAI
import asyncio
import os


# Create a RAG tool using LlamaIndex
documents = SimpleDirectoryReader("data").load_data()
index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine()




def multiply(a: float, b: float) -> float:
    """Useful for multiplying two numbers."""
    return a * b




async def search_documents(query: str) -> str:
    """Useful for answering natural language questions about an personal essay written by Paul Graham."""
    response = await query_engine.aquery(query)
    return str(response)




# Create an enhanced workflow with both tools
agent = FunctionAgent(
    tools=[multiply, search_documents],
    llm=OpenAI(model="gpt-4o-mini"),
    system_prompt="""You are a helpful assistant that can perform calculations
    and search through documents to answer questions.""",
)




# Now we can ask questions about the documents or do calculations
async def main():
    response = await agent.run(
        "What did the author do in college? Also, what's 7 * 8?"
    )
    print(response)




# Run the agent
if __name__ == "__main__":
    asyncio.run(main())
```

此時 agent 可以在使用計算器和搜尋文件之間靈活切換，並用來回答問題。

## 儲存 RAG 索引

為避免每次都重新處理文件，您可以將索引儲存到磁碟：

```
# Save the index
index.storage_context.persist("storage")


# Later, load the index
from llama_index.core import StorageContext, load_index_from_storage


storage_context = StorageContext.from_defaults(persist_dir="storage")
index = load_index_from_storage(storage_context)
query_engine = index.as_query_engine()
```

提示

若您使用的不是預設的[向量儲存庫整合](/python/framework/module_guides/storing/vector_stores/)，通常可以直接從 vector store 重新載入：

```
index = VectorStoreIndex.from_vector_store(vector_store)
```


## 接下來可以做什麼？

這只是 LlamaIndex agents 能做到的許多事情的起點！您可以：

- 為 agent 加入更多工具
- 使用不同的 LLM
- 透過 system prompt 自訂 agent 的行為
- 加入串流功能
- 實作 human-in-the-loop workflows
- 讓多個 agents 協作完成任務

以下是一些實用連結：

- 在 [Agent 文件](/python/framework/understanding/agent/)中查看更多進階範例
- 深入了解[高階概念](/python/framework/getting_started/concepts/)
- 探索如何[自訂設定](/python/framework/getting_started/faq/)
- 查看[元件指南](/python/framework/module_guides/)