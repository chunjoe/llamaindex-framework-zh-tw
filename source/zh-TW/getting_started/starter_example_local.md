---
title: "入門教學 (使用 Local LLMs)"
---

本教學將向您示範如何使用 LlamaIndex 來建立 agents。我們將從一個基本範例開始，然後示範如何新增 RAG (Retrieval-Augmented Generation) 功能。

我們將使用 [`BAAI/bge-base-en-v1.5`](https://huggingface.co/BAAI/bge-base-en-v1.5) 作為 embedding model，並透過 `llama3.1 8B` 透過 `Ollama` 進行服務。

提示

請確保您已先完成 [安裝](/python/framework/getting_started/installation/) 步驟。

## 設定

Ollama 是一個工具，可幫助您以最少的設定在本地設定 LLMs。

請參閱 [README](https://github.com/jmorganca/ollama) 以了解如何安裝它。

要下載 Llama3 model，只需執行 `ollama pull llama3.1`。

**注意**：您需要一台至少有 \~32GB RAM 的機器。

如我們的 [安裝指南](/python/framework/getting_started/installation/) 所解釋，`llama-index` 實際上是一組套件。要運行 Ollama 和 Huggingface，我們需要安裝這些整合：

終端機視窗

```
pip install llama-index-llms-ollama llama-index-embeddings-huggingface
```

套件名稱會顯示導入的內容，這對於記住如何導入或安裝它們非常有幫助！

```
from llama_index.llms.ollama import Ollama
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
```

更多整合資訊請參閱 [整合頁面](/python/framework/community/integrations/)。

## 基本 Agent 範例

讓我們從一個簡單的範例開始，使用一個可以透過呼叫 tool 執行基本乘法的 agent。建立一個名為 `starter.py` 的檔案：

```
import asyncio
from llama_index.core.agent.workflow import FunctionAgent
from llama_index.llms.ollama import Ollama




# Define a simple calculator tool
def multiply(a: float, b: float) -> float:
    """Useful for multiplying two numbers."""
    return a * b




# Create an agent workflow with our calculator tool
agent = FunctionAgent(
    tools=[multiply],
    llm=Ollama(
        model="llama3.1",
        request_timeout=360.0,
        # Manually set the context window to limit memory usage
        context_window=8000,
    ),
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

這會輸出類似於：`The answer to 1234 * 4567 is 5635678.`

發生的情況是：

- agent 接收了一個問題：`What is 1234 * 4567?`
- 在底層，這個問題以及工具的 schema (name, docstring, 和 arguments) 被傳遞給 LLM
- agent 選擇了 `multiply` 工具並為工具寫入了 arguments
- agent 接收到工具的結果並將其插值到最終的回應中

提示

如您所見，我們正在使用 `async` python 函數。許多 LLMs 和 model 都支援 async calls，建議使用 async code 來提升應用程式的效能。如需了解更多關於 async code 和 python 的資訊，我們推薦參閱這篇 [short section on async + python](/python/framework/getting_started/async_python/)。

## 新增聊天記錄

`AgentWorkflow` 也能夠記住先前的訊息。這包含在 `AgentWorkflow` 的 `Context` 內部。

如果傳入 `Context`，agent 將會使用它來繼續對話。

```
from llama_index.core.workflow import Context


# create context
ctx = Context(agent)


# run agent with context
response = await agent.run("My name is Logan", ctx=ctx)
response = await agent.run("What is my name?", ctx=ctx)
```


## 新增 RAG 功能

現在讓我們透過新增搜尋 documents 的能力來增強我們的 agent。首先，讓我們使用終端機獲取一些範例資料：

終端機視窗

```
mkdir data
wget https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt -O data/paul_graham_essay.txt
```

您的目錄結構現在應該如下所示：

```
├── starter.py └── data    └── paul_graham_essay.txt
```

現在我們可以使用 LlamaIndex 為搜尋 documents 建立一個 tool。與依賴任何 hosted-API default 不同，我們將配置 `Settings.embed_model` 到 `HuggingFaceEmbedding(model_name="BAAI/bge-base-en-v1.5")`，以便索引和檢索都使用一個本地的 [Sentence Transformers](https://sbert.net/) model，無需 API key。

我們修改後的 `starter.py` 應該如下所示：

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings
from llama_index.core.agent.workflow import AgentWorkflow
from llama_index.llms.ollama import Ollama
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
import asyncio
import os


# Settings control global defaults
Settings.embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-base-en-v1.5")
Settings.llm = Ollama(
    model="llama3.1",
    request_timeout=360.0,
    # Manually set the context window to limit memory usage
    context_window=8000,
)


# Create a RAG tool using LlamaIndex
documents = SimpleDirectoryReader("data").load_data()
index = VectorStoreIndex.from_documents(
    documents,
    # we can optionally override the embed_model here
    # embed_model=Settings.embed_model,
)
query_engine = index.as_query_engine(
    # we can optionally override the llm here
    # llm=Settings.llm,
)




def multiply(a: float, b: float) -> float:
    """Useful for multiplying two numbers."""
    return a * b




async def search_documents(query: str) -> str:
    """Useful for answering natural language questions about an personal essay written by Paul Graham."""
    response = await query_engine.aquery(query)
    return str(response)




# Create an enhanced workflow with both tools
agent = AgentWorkflow.from_tools_or_functions(
    [multiply, search_documents],
    llm=Settings.llm,
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

agent 現在可以無縫切換，在使用計算器和搜尋 documents 之間來回答問題。

## 儲存 RAG 索引

為避免每次都重新處理 documents，您可以將索引持久化到磁碟：

```
# Save the index
index.storage_context.persist("storage")


# Later, load the index
from llama_index.core import StorageContext, load_index_from_storage


storage_context = StorageContext.from_defaults(persist_dir="storage")
index = load_index_from_storage(
    storage_context,
    # we can optionally override the embed_model here
    # it's important to use the same embed_model as the one used to build the index
    # embed_model=Settings.embed_model,
)
query_engine = index.as_query_engine(
    # we can optionally override the llm here
    # llm=Settings.llm,
)
```


提示

如果您除了 default 之外使用了 [vector store integration](/python/framework/module_guides/storing/vector_stores/)，那麼您很可能可以直接從 vector store 重新載入：

```
index = VectorStoreIndex.from_vector_store(
    vector_store,
    # it's important to use the same embed_model as the one used to build the index
    # embed_model=Settings.embed_model,
)
```


## 下一步是什麼？

這只是您能用 LlamaIndex agents 做的事情的開始！您可以：

- 向您的 agent 添加更多 tools
- 使用不同的 LLMs
- 使用 system prompts 自訂 agent 的行為
- 新增 streaming capabilities
- 實作 human-in-the-loop workflows
- 使用多個 agents 協作完成任務

一些有幫助的後續連結：

- 在我們的 [Agent documentation](/python/framework/understanding/agent/) 中查看更多進階 agent 範例- 瞭解更多關於 [高層次概念](/python/framework/getting_started/concepts/)
- 探索如何 [customize things](/python/framework/getting_started/faq/)
- 查看 [component guides](/python/framework/module_guides/)