---
title: "如何建置聊天機器人"
---

LlamaIndex 充當您的資料與 Large Language Models (LLMs) 之間的橋樑，提供一套工具，讓您為各種任務，例如問答和摘要，在您的資料周圍建立一個查詢介面。

在本教學中，我們將引導您使用 [Data Agent](https://gpt-index.readthedocs.io/en/stable/core_modules/agent_modules/agents/root.html) 建構一個帶有上下文的聊天機器人。這個由 LLMs 驅動的 agent 能夠智慧地對您的資料執行任務。最終結果是一個配備了由 LlamaIndex 提供的強大資料介面工具的聊天機器人 agent，可以回答有關您資料的查詢。

**注意**：本教學建立在先前關於建立 SEC 10-K 檔案查詢介面的初步工作之上 - [請點這裡](https://medium.com/@jerryjliu98/how-unstructured-and-llamaindex-can-help-bring-the-power-of-llms-to-your-own-data-3657d063e30d)。

### 上下文

在本指南中，我們將建立一個使用 Dropbox 中原始 UBER 10-K HTML 檔案的「10-K Chatbot」。使用者可以與聊天機器人互動，提出與 10-K 檔案相關的問題。

### 準備工作

```
import os
import openai


os.environ["OPENAI_API_KEY"] = "sk-..."
openai.api_key = os.environ["OPENAI_API_KEY"]


import nest_asyncio


nest_asyncio.apply()
```

### 擷取資料 (Ingest Data)

我們先下載 2019 年至 2022 年的原始 10-k 檔案。

```
# NOTE: the code examples assume you're operating within a Jupyter notebook.
# download files
!mkdir data
!wget "https://www.dropbox.com/s/948jr9cfs7fgj99/UBER.zip?dl=1" -O data/UBER.zip
!unzip data/UBER.zip -d data
```

為了將 HTML 檔案解析成格式化的文字，我們使用 [Unstructured](https://github.com/Unstructured-IO/unstructured) 函式庫。由於 [`llama-index-readers-file` package](https://github.com/run-llama/llama_index/tree/main/llama-index-integrations/readers/llama-index-readers-file)，我們可以直接與 Unstructured 整合，允許將任何文字轉換成 Document 格式，供 LlamaIndex 擷取。

首先安裝必要的套件：

```
!pip install llama-index-readers-file unstructured
```

然後我們可以使用 `UnstructuredReader` 將 HTML 檔案解析成一個 `Document` 物件的列表。

```
from llama_index.readers.file import UnstructuredReader
from pathlib import Path


years = [2022, 2021, 2020, 2019]


loader = UnstructuredReader()
doc_set = {}
all_docs = []
for year in years:
    year_docs = loader.load_data(
        file=Path(f"./data/UBER/UBER_{year}.html"), split_documents=False
    )
    # insert year metadata into each year
    for d in year_docs:
        d.metadata = {"year": year}
    doc_set[year] = year_docs
    all_docs.extend(year_docs)
```

### 為每年設定 Vector Indices

我們首先為每一年設定一個 vector index。每個 vector index 都允許我們對特定年份的 10-K 檔案提出問題。

我們建立每個 index 並將其儲存到磁碟上。

```
# initialize simple vector indices
from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.core import Settings


Settings.chunk_size = 512
index_set = {}
for year in years:
    storage_context = StorageContext.from_defaults()
    cur_index = VectorStoreIndex.from_documents(
        doc_set[year],
        storage_context=storage_context,
    )
    index_set[year] = cur_index
    storage_context.persist(persist_dir=f"./storage/{year}")
```

要從磁碟載入一個 index，請執行以下操作

```
# Load indices from disk
from llama_index.core import load_index_from_storage


index_set = {}
for year in years:
    storage_context = StorageContext.from_defaults(
        persist_dir=f"./storage/{year}"
    )
    cur_index = load_index_from_storage(
        storage_context,
    )
    index_set[year] = cur_index
```

### 設定 Sub Question Query Engine 以在 10-K 檔案之間合成答案

由於我們有四年的 documents 存取權，我們不僅想詢問特定年份的 10-K document 的問題，還想詢問需要分析所有 10-K 檔案的問題。

為了解決這個問題，我們可以利用 [Sub Question Query Engine](https://gpt-index.readthedocs.io/en/stable/examples/query_engine/sub_question_query_engine.html)。它將一個查詢分解成子查詢，每個子查詢由一個單獨的 vector index 回答，並合成結果來回答整體查詢。

LlamaIndex 為 index（和 query engines）提供了一些包裝器，以便它們可以被 query engines 和 agents 使用。首先，我們為每個 vector index 定義一個 `QueryEngineTool`。每個 tool 都有一個名稱和一個描述；這些是 LLM agent 用來決定選擇哪個 tool 的依據。

```
from llama_index.core.tools import QueryEngineTool, ToolMetadata


individual_query_engine_tools = [
    QueryEngineTool(
        query_engine=index_set[year].as_query_engine(),
        metadata=ToolMetadata(
            name=f"vector_index_{year}",
            description=f"useful for when you want to answer queries about the {year} SEC 10-K for Uber",
        ),
    )
    for year in years
]
```

現在我們可以建立 Sub Question Query Engine，這將允許我們在 10-K 檔案之間合成答案。我們傳入我們上面定義的 `individual_query_engine_tools`，以及一個將用於執行子查詢的 `llm`。

```
from llama_index.llms.openai import OpenAI
from llama_index.core.query_engine import SubQuestionQueryEngine


query_engine = SubQuestionQueryEngine.from_defaults(
    query_engine_tools=individual_query_engine_tools,
    llm=OpenAI(model="gpt-3.5-turbo"),
)
```

### 設定 Chatbot Agent

我們使用一個 LlamaIndex Data Agent 來設定外部聊天機器人 agent，它可以存取一組 Tools。具體來說，我們將使用一個 `FunctionAgent`，它利用了 OpenAI API function calling 功能。我們想使用先前為每個 index（對應於特定年份）定義的獨立 Tools，以及我們上面定義的用於子查詢查詢引擎的一個 tool。

首先，我們為子查詢查詢引擎定義一個 `QueryEngineTool`：

```
query_engine_tool = QueryEngineTool(
    query_engine=query_engine,
    metadata=ToolMetadata(
        name="sub_question_query_engine",
        description="useful for when you want to answer queries that require analyzing multiple SEC 10-K documents for Uber",
    ),
)
```

然後，我們將上面定義的 Tools 組合為一個單一的工具列表供 agent 使用：

```
tools = individual_query_engine_tools + [query_engine_tool]
```

最後，我們呼叫 `FunctionAgent()` 來建立 agent，傳入我們上面定義的工具列表。

```
from llama_index.core.agent.workflow import FunctionAgent
from llama_index.llms.openai import OpenAI


agent = FunctionAgent(tools=tools, llm=OpenAI(model="gpt-4.1"))
```

### 測試 Agent

現在我們可以對 agent 進行各種查詢的測試。

如果我們用一個簡單的「hello」查詢來測試它，agent 不會使用任何 Tools。

```
response = await agent.run("hi, i am bob")
print(str(response))
```

```
Hello Bob! How can I assist you today?
```
若我們用一個關於某一年 10-k 的查詢來測試，agent 將會使用相關的 vector index Tool。

```
response = await agent.run(
    "What were some of the biggest risk factors in 2020 for Uber?"
)
print(str(response))
```

```
Some of the biggest risk factors for Uber in 2020 were:


1. The adverse impact of the COVID-19 pandemic and actions taken to mitigate it on the business.
2. The potential reclassification of drivers as employees, workers, or quasi-employees instead of independent contractors.
3. Intense competition in the mobility, delivery, and logistics industries, with low-cost alternatives and well-capitalized competitors.
4. The need to lower fares or service fees and offer driver incentives and consumer discounts to remain competitive.
5. Significant losses incurred and the uncertainty of achieving profitability.
6. The risk of not attracting or maintaining a critical mass of platform users.
7. Operational, compliance, and cultural challenges related to the workplace culture and forward-leaning approach.
8. The potential negative impact of international investments and the challenges of conducting business in foreign countries.
9. Risks associated with operational and compliance challenges, localization, laws and regulations, competition, social acceptance, technological compatibility, improper business practices, liability uncertainty, managing international operations, currency fluctuations, cash transactions, tax consequences, and payment fraud.


These risk factors highlight the challenges and uncertainties that Uber faced in 2020.
```

最後，如果我們用一個比較/對比不同年份風險因素的查詢來測試，agent 將會使用 Sub Question Query Engine Tool。

```
cross_query_str = "Compare/contrast the risk factors described in the Uber 10-K across years. Give answer in bullet points."


response = await agent.run(cross_query_str)
print(str(response))
```

```
Here is a comparison of the risk factors described in the Uber 10-K reports across years:


2022 Risk Factors:
- Potential adverse effect if drivers were classified as employees instead of independent contractors.
- Highly competitive nature of the mobility, delivery, and logistics industries.
- Need to lower fares or service fees to remain competitive.
- History of significant losses and expectation of increased operating expenses.
- Impact of future pandemics or disease outbreaks on the business and financial results.
- Potential harm to the business due to economic conditions and their effect on discretionary consumer spending.


2021 Risk Factors:
- Adverse impact of the COVID-19 pandemic and actions to mitigate it on the business.
- Potential reclassification of drivers as employees instead of independent contractors.
- Highly competitive nature of the mobility, delivery, and logistics industries.
- Need to lower fares or service fees and offer incentives to remain competitive.
- History of significant losses and uncertainty of achieving profitability.
- Importance of attracting and maintaining a critical mass of platform users.


2020 Risk Factors:
- Adverse impact of the COVID-19 pandemic on the business.
- Potential reclassification of drivers as employees.
- Highly competitive nature of the mobility, delivery, and logistics industries.
- Need to lower fares or service fees to remain competitive.
- History of significant losses and potential future expenses.
- Importance of attracting and maintaining a critical mass of platform users.
- Operational and cultural challenges faced by the company.


2019 Risk Factors:
- Competition with local companies.
- Differing levels of social acceptance.
- Technological compatibility issues.
- Exposure to improper business practices.
- Legal uncertainty.
- Difficulties in managing international operations.
- Fluctuations in currency exchange rates.
- Regulations governing local currencies.
- Tax consequences.
- Financial accounting burdens.
- Difficulties in implementing financial systems.
- Import and export restrictions.
- Political and economic instability.
- Public health concerns.
- Reduced protection for intellectual property rights.
- Limited influence over minority-owned affiliates.
- Regulatory complexities.


These comparisons highlight both common and unique risk factors that Uber faced in different years.
```

### 設定 Chatbot 迴圈

現在我們已經設定好 chatbot，只需要再進行幾個步驟，就能設定一個基本的互動迴圈來與我們的 SEC 增強型 chatbot 聊天！

```
agent = FunctionAgent(tools=tools, llm=OpenAI(model="gpt-4.1"))


while True:
    text_input = input("User: ")
    if text_input == "exit":
        break
    response = await agent.run(text_input)
    print(f"Agent: {response}")
```

以下是迴圈運作的範例：

```
User:  What were some of the legal proceedings against Uber in 2022?
Agent: In 2022, Uber faced several legal proceedings. Some of the notable ones include:


1. Petition against Proposition 22: A petition was filed in California alleging that Proposition 22, which classifies app-based drivers as independent contractors, is unconstitutional.


2. Lawsuit by Massachusetts Attorney General: The Massachusetts Attorney General filed a lawsuit against Uber, claiming that drivers should be classified as employees and entitled to protections under wage and labor laws.


3. Allegations by New York Attorney General: The New York Attorney General made allegations against Uber regarding the misclassification of drivers and related employment violations.


4. Swiss social security rulings: Swiss social security rulings classified Uber drivers as employees, which could have implications for Uber's operations in Switzerland.


5. Class action lawsuits in Australia: Uber faced class action lawsuits in Australia, with allegations that the company conspired to harm participants in the taxi, hire-car, and limousine industries.


It's important to note that the outcomes of these legal proceedings are uncertain and may vary.


User:
```

### Notebook

請查看我們的 [對應 notebook](https://developers.llamaindex.ai/python/examples/agent/chatbot_sec/index.md)。