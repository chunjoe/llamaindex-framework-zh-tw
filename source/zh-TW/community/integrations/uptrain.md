---
title: "對 LlamaIndex 使用 UpTrain 進行評估"
---

**概述**: 在此範例中，我們將展示如何使用 UpTrain 與 LlamaIndex 配合使用。UpTrain ([github](https://github.com/uptrain-ai/uptrain) || [website](https://github.com/uptrain-ai/uptrain/) || [docs](https://docs.uptrain.ai/)) 是一個用於評估和改進 GenAI 應用程式的開源平台。它為 20 多個預先設定的檢查項目（涵蓋語言、程式碼、嵌入使用案例）提供評分，對失敗案例進行根本原因分析，並提供解決問題的見解。有關 UpTrain 評估的更多詳情，請參閱 [here](https://github.com/uptrain-ai/uptrain?tab=readme-ov-file#pre-built-evaluations-we-offer-)。

**問題**: 隨著越來越多的公司將 LLM 原型機升級為可投入生產的應用程式，他們的 RAG pipeline 也變得越來越複雜。開發人員正在利用 QueryRewrite、Context ReRank 等模組來提高他們 RAG 系統的準確性。

複雜性的增加帶來了更多的故障點。

1. 需要進階的 Evals 來評估這些新模組的品質，並確定它們是否確實提高了系統的準確性。
2. 需要一個強健的實驗框架，以便系統性地測試不同的模組並做出數據驅動的決策。

**解決方案**: UpTrain 幫助解決了這兩方面問題：

1. UpTrain 提供一系列檢查項目，用於評估生成回應、檢索的上下文以及所有中間步驟的品質。相關的檢查項目包括 ContextRelevance、SubQueryCompleteness、ContextReranking、ContextConciseness、FactualAccuracy、ContextUtilization、ResponseCompleteness、ResponseConciseness 等。
2. UpTrain 也允許您實驗不同的 embedding models，並擁有一個 “evaluate\_experiments” 方法來比較不同的 RAG 配置。

# 如何操作？

您有兩種方法可以使用 UpTrain 與 LlamaIndex 配合使用：

1. **使用 UpTrain Callback Handler**: 此方法允許您無縫整合 UpTrain 與 LlamaIndex。您可以將 UpTrainCallbackHandler 添加到現有的 LlamaIndex pipeline 中，它將會評估您 RAG pipeline 的所有組件。這是推薦的方法，因為它最容易使用，並且只需最少的努力就能提供儀表板和洞察。

2. **使用 UpTrain’s EvalLlamaIndex**: 此方法允許您使用 UpTrain 對生成的回應進行評估。您可以使用 EvalLlamaIndex 物件來為查詢生成回應，然後對回應進行評估。您可以在下方找到關於如何操作的詳細教學。此方法提供了對評估更大的靈活性和控制權，但需要更多的努力來設定和使用。

# 1. 使用 UpTrain Callback Handler [![Open In Colab](/assets/e79852128a5f.svg)](https://colab.research.google.com/github/run-llama/llama_index/blob/main/docs/examples/callbacks/UpTrainCallback.ipynb)

以下三個示範解釋了如何使用 UpTrain Callback Handler 來評估您 RAG pipeline 的不同組件。

## 1. **RAG Query Engine Evaluations**:

RAG query engine 在檢索上下文和生成回應方面扮演著關鍵角色。為確保其效能和回應品質，我們進行以下評估：

- **[Context Relevance](https://docs.uptrain.ai/predefined-evaluations/context-awareness/context-relevance)**：判斷檢索到的上下文是否包含回答使用者查詢的足夠資訊。
- **[Factual Accuracy](https://docs.uptrain.ai/predefined-evaluations/context-awareness/factual-accuracy)**：評估 LLM 的回應是否可以透過檢索到的上下文進行驗證。
- **[Response Completeness](https://docs.uptrain.ai/predefined-evaluations/response-quality/response-completeness)**：檢查回應是否包含回答使用者查詢所需的所有資訊。

## 2. **Sub-Question Query Generation Evaluation**:

SubQuestionQueryGeneration operator 將問題分解為子問題，並使用 RAG query engine 為每個子問題生成回應。為了衡量其準確性，我們使用：

- **[Sub Query Completeness](https://docs.uptrain.ai/predefined-evaluations/query-quality/sub-query-completeness)**：確保子問題準確且全面地涵蓋了原始查詢。

## 3. **Re-Ranking Evaluations**:重新排序涉及根據與查詢的相關性重新排序 nodes，並選擇最佳的 nodes。根據重新排序後返回的 nodes 數量進行不同的評估。

a. Nodes 數量相同

- **[Context Reranking](https://docs.uptrain.ai/predefined-evaluations/context-awareness/context-reranking)**：檢查重新排序後的 nodes 順序是否比原始順序更貼合查詢。

b. Nodes 數量不同：

- **[Context Conciseness](https://docs.uptrain.ai/predefined-evaluations/context-awareness/context-conciseness)**：檢視減少後的 nodes 數量是否仍能提供所有所需資訊。

這些評估共同確保了 RAG 查詢引擎、SubQuestionQueryGeneration operator 以及 LlamaIndex pipeline 中的重新排序過程的穩健性和有效性。

#### **注意：**

- 我們使用基本的 RAG 查詢引擎進行了評估；也可以使用進階的 RAG 查詢引擎進行相同的評估。
- 重新排序評估也是如此，我們使用 SentenceTransformerRerank 進行了評估，也可以使用其他 re-rankers 進行相同的評估。

## 安裝依賴項和匯入函式庫

安裝 notebook 依賴項。

終端機視窗

```
%pip install llama-index-readers-web
%pip install llama-index-callbacks-uptrain
%pip install -q html2text llama-index pandas tqdm uptrain torch sentence-transformers
```

匯入函式庫。

```
from getpass import getpass


from llama_index.core import Settings, VectorStoreIndex
from llama_index.core.node_parser import SentenceSplitter
from llama_index.readers.web import SimpleWebPageReader
from llama_index.core.callbacks import CallbackManager
from llama_index.callbacks.uptrain.base import UpTrainCallbackHandler
from llama_index.core.query_engine import SubQuestionQueryEngine
from llama_index.core.tools import QueryEngineTool, ToolMetadata
from llama_index.core.postprocessor import SentenceTransformerRerank
from llama_index.llms.openai import OpenAI


import os
```

## 設定

UpTrain 提供以下服務：

1. 具備進階鑽取和篩選選項的儀表板
2. 失敗案例中的洞察和共同主題
3. 生產資料的可觀察性和即時監控
4. 透過與您的 CI/CD pipeline 無縫整合進行的迴歸測試

您可以選擇以下選項來使用 UpTrain 進行評估：

### 1. **UpTrain 的開源軟體 (OSS)**：

您可以使用開源評估服務來評估您的模型。在此情況下，您需要提供一個 OpenAI API 金鑰。您可以在 [這裡](https://platform.openai.com/account/api-keys) 取得您的金鑰。

為了在 UpTrain 儀表板中查看您的評估結果，您需要在終端機中執行以下指令進行設定：

終端機視窗

```
git clone https://github.com/uptrain-ai/uptrain
cd uptrain
bash run_uptrain.sh
```

這將在您的本地機器上啟動 UpTrain 儀表板。您可以在 `http://localhost:3000/dashboard` 存取它。

參數：

- key\_type=“openai”
- api\_key=“OPENAI\_API\_KEY”
- project\_name=“PROJECT\_NAME”

### 2. **UpTrain 的託管服務和儀表板**：

或者，您可以使用 UpTrain 的託管服務來評估您的模型。您可以 [這裡](https://uptrain.ai/) 建立一個免費的 UpTrain 帳戶並獲得免費試用點數。如果您想要更多的試用點數，請 [點擊這裡與 UpTrain 的維護者預約通話](https://calendly.com/uptrain-sourabh/30min)。

使用託管服務的好處包括：

1. 無需在本地機器上設定 UpTrain 儀表板。
2. 無需他們的 API 金鑰即可存取許多 LLMs。

完成評估後，您可以在 `https://dashboard.uptrain.ai/dashboard` 的 UpTrain 儀表板中查看結果。

參數：

- key\_type=“uptrain”
- api\_key=“UPTRAIN\_API\_KEY”
- project\_name=“PROJECT\_NAME”

**注意：** `project_name` 將是 UpTrain 儀表板中顯示所執行評估的專案名稱。

## 建立 UpTrain 回調處理器

```
os.environ["OPENAI_API_KEY"] = getpass()


callback_handler = UpTrainCallbackHandler(
    key_type="openai",
    api_key=os.environ["OPENAI_API_KEY"],
    project_name="uptrain_llamaindex",
)


Settings.callback_manager = CallbackManager([callback_handler])
```

## 載入和解析 Documents

從 Paul Graham 的文章 “What I Worked On” 中載入 documents。

```
documents = SimpleWebPageReader().load_data(
    [
        "https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt"
    ]
)
```

將 document 解析為 nodes。

```
parser = SentenceSplitter()
nodes = parser.get_nodes_from_documents(documents)
```

# 1. RAG 查詢引擎評估

UpTrain 回調處理器將自動擷取生成後的查詢、上下文和回應，並對回應執行以下三個評估 *(從 0 到 1 評分)*：

- **[Context Relevance](https://docs.uptrain.ai/predefined-evaluations/context-awareness/context-relevance)**：判斷檢索到的上下文是否包含回答使用者查詢的足夠資訊。
- **[Factual Accuracy](https://docs.uptrain.ai/predefined-evaluations/context-awareness/factual-accuracy)**：評估 LLM 的回應是否可以透過檢索到的上下文進行驗證。
- **[Response Completeness](https://docs.uptrain.ai/predefined-evaluations/response-quality/response-completeness)**：檢查回應是否包含回答使用者查詢所需的所有資訊。

```
index = VectorStoreIndex.from_documents(
    documents,
)
query_engine = index.as_query_engine()


max_characters_per_line = 80
queries = [
    "What did Paul Graham do growing up?",
    "When and how did Paul Graham's mother die?",
    "What, in Paul Graham's opinion, is the most distinctive thing about YC?",
    "When and how did Paul Graham meet Jessica Livingston?",
    "What is Bel, and when and where was it written?",
]
for query in queries:
    response = query_engine.query(query)
```

```
Question: What did Paul Graham do growing up?
Response: Paul Graham wrote short stories and started programming on the IBM 1401 in 9th grade using an early version of Fortran. Later, he convinced his father to buy a TRS-80, where he wrote simple games, a program to predict rocket heights, and a word processor.


Context Relevance Score: 0.0
Factual Accuracy Score: 1.0
Response Completeness Score: 1.0




Question: When and how did Paul Graham's mother die?
Response: Paul Graham's mother died when he was 18 years old, from a brain tumor.


Context Relevance Score: 0.0
Factual Accuracy Score: 0.0
Response Completeness Score: 1.0




Question: What, in Paul Graham's opinion, is the most distinctive thing about YC?
Response: The most distinctive thing about Y Combinator, according to Paul Graham, is that instead of deciding for himself what to work on, the problems come to him. Every 6 months, a new batch of startups brings their problems, which then become the focus of YC's work.


Context Relevance Score: 0.0
Factual Accuracy Score: 0.5
Response Completeness Score: 1.0




Question: When and how did Paul Graham meet Jessica Livingston?
Response: Paul Graham met Jessica Livingston at a big party at his house in October 2003.


Context Relevance Score: 1.0
Factual Accuracy Score: 0.5
Response Completeness Score: 1.0




Question: What is Bel, and when and where was it written?
Response: Bel is a new Lisp that was written in Arc. It was developed over a period of 4 years, from March 26, 2015 to October 12, 2019. Most of the work on Bel was done in England, where the author had moved to in the summer of 2016.


Context Relevance Score: 1.0
Factual Accuracy Score: 1.0
Response Completeness Score: 1.0
```
這裡有一個儀表板範例，展示如何過濾和深入探討失敗案例，並獲得關於失敗案例的見解：![image-2.png](/assets/3063174fd15a.png)

# 2. 子問題查詢引擎評估

**子問題查詢引擎**用於解決使用多個資料來源回答複雜查詢的問題。它會將複雜查詢分解成每個相關資料來源的子問題，然後收集所有中間回應並合成最終回應。

UpTrain callback handler 在生成後會自動擷取每個子問題及其回應，並對回應執行以下三個評估（評分範圍為 0 到 1）：

- **[Context Relevance](https://docs.uptrain.ai/predefined-evaluations/context-awareness/context-relevance)**：判斷檢索到的上下文是否包含回答使用者查詢的足夠資訊。
- **[Factual Accuracy](https://docs.uptrain.ai/predefined-evaluations/context-awareness/factual-accuracy)**：評估 LLM 的回應是否可以透過檢索到的上下文進行驗證。
- **[Response Completeness](https://docs.uptrain.ai/predefined-evaluations/response-quality/response-completeness)**：檢查回應是否包含回答使用者查詢所需的所有資訊。

除了上述評估外，callback handler 還會執行以下評估：

- **[Sub Query Completeness](https://docs.uptrain.ai/predefined-evaluations/query-quality/sub-query-completeness)**：確保子問題準確且全面地涵蓋了原始查詢。

```
# build index and query engine
vector_query_engine = VectorStoreIndex.from_documents(
    documents=documents,
    use_async=True,
).as_query_engine()


query_engine_tools = [
    QueryEngineTool(
        query_engine=vector_query_engine,
        metadata=ToolMetadata(
            name="documents",
            description="Paul Graham essay on What I Worked On",
        ),
    ),
]


query_engine = SubQuestionQueryEngine.from_defaults(
    query_engine_tools=query_engine_tools,
    use_async=True,
)


response = query_engine.query(
    "How was Paul Grahams life different before, during, and after YC?"
)
```

```
Generated 3 sub questions.
[1;3;38;2;237;90;200m[documents] Q: What did Paul Graham work on before Y Combinator?
[0m[1;3;38;2;90;149;237m[documents] Q: What did Paul Graham work on during Y Combinator?
[0m[1;3;38;2;11;159;203m[documents] Q: What did Paul Graham work on after Y Combinator?
[0m[1;3;38;2;11;159;203m[documents] A: Paul Graham worked on a project with Robert and Trevor after Y Combinator.
[0m[1;3;38;2;237;90;200m[documents] A: Paul Graham worked on projects with his colleagues Robert and Trevor before Y Combinator.
[0m[1;3;38;2;90;149;237m[documents] A: Paul Graham worked on writing essays and working on Y Combinator during his time at Y Combinator.
[0m




Question: What did Paul Graham work on after Y Combinator?
Response: Paul Graham worked on a project with Robert and Trevor after Y Combinator.


Context Relevance Score: 0.0
Factual Accuracy Score: 1.0
Response Completeness Score: 0.5




Question: What did Paul Graham work on before Y Combinator?
Response: Paul Graham worked on projects with his colleagues Robert and Trevor before Y Combinator.


Context Relevance Score: 0.0
Factual Accuracy Score: 1.0
Response Completeness Score: 0.5




Question: What did Paul Graham work on during Y Combinator?
Response: Paul Graham worked on writing essays and working on Y Combinator during his time at Y Combinator.


Context Relevance Score: 0.0
Factual Accuracy Score: 0.5
Response Completeness Score: 0.5




Question: How was Paul Grahams life different before, during, and after YC?
Sub Query Completeness Score: 1.0
```

這裡有一個儀表板範例，以條形圖形式視覺化子問題的得分：

![image.png](/assets/3dd5f1bce367.png)

# 3. 重新排序 (Re-ranking)

重新排序是根據與查詢的相關性重新排序 nodes 的過程。Llamaindex 提供多種重新排序演算法類別。我們在此範例中使用了 LLMRerank。

re-ranker 允許您輸入重新排序後要返回的前 n 個 nodes 的數量。如果此值與原始的 nodes 數量相同，re-ranker 只會重新排序 nodes，而不會改變 nodes 的數量。否則，它會重新排序 nodes 並返回前 n 個 nodes。

我們將根據重新排序後返回的 nodes 數量執行不同的評估。

## 3a. 重新排序（與相同數量的 nodes）

如果重新排序後返回的 nodes 數量與原始的 nodes 數量相同，則將執行以下評估：

- **[Context Reranking](https://docs.uptrain.ai/predefined-evaluations/context-awareness/context-reranking)**：檢查重新排序後的 nodes 的順序是否比原始順序更與查詢相關。

```
callback_handler = UpTrainCallbackHandler(
    key_type="openai",
    api_key=os.environ["OPENAI_API_KEY"],
    project_name_prefix="llama",
)
Settings.callback_manager = CallbackManager([callback_handler])


rerank_postprocessor = SentenceTransformerRerank(
    top_n=3,  # number of nodes after reranking
    keep_retrieval_score=True,
)


index = VectorStoreIndex.from_documents(
    documents=documents,
)


query_engine = index.as_query_engine(
    similarity_top_k=3,  # number of nodes before reranking
    node_postprocessors=[rerank_postprocessor],
)


response = query_engine.query(
    "What did Sam Altman do in this essay?",
)
```

```
Question: What did Sam Altman do in this essay?
Context Reranking Score: 0.0




Question: What did Sam Altman do in this essay?
Response: Sam Altman was asked to become the president of Y Combinator after the original founders decided to step back and reorganize the company for long-term sustainability.


Context Relevance Score: 1.0
Factual Accuracy Score: 1.0
Response Completeness Score: 0.5
```


# 3b. 重新排序（與不同數量的 nodes）

如果重新排序後返回的 nodes 數量小於原始的 nodes 數量，則將執行以下評估：

- **[Context Conciseness](https://docs.uptrain.ai/predefined-evaluations/context-awareness/context-conciseness)**：檢視減少後的 nodes 數量是否仍提供所有所需資訊。

```
callback_handler = UpTrainCallbackHandler(
    key_type="openai",
    api_key=os.environ["OPENAI_API_KEY"],
    project_name_prefix="llama",
)
Settings.callback_manager = CallbackManager([callback_handler])


rerank_postprocessor = SentenceTransformerRerank(
    top_n=2,  # Number of nodes after re-ranking
    keep_retrieval_score=True,
)


index = VectorStoreIndex.from_documents(
    documents=documents,
)
query_engine = index.as_query_engine(
    similarity_top_k=5,  # Number of nodes before re-ranking
    node_postprocessors=[rerank_postprocessor],
)


# Use your advanced RAG
response = query_engine.query(
    "What did Sam Altman do in this essay?",
)
```

```
Question: What did Sam Altman do in this essay?
Context Conciseness Score: 0.0




Question: What did Sam Altman do in this essay?
Response: Sam Altman offered unsolicited advice to the author during a visit to California for interviews.




Context Relevance Score: 1.0
Factual Accuracy Score: 1.0
Response Completeness Score: 0.5
```


# UpTrain 的管理服務儀表板與見解

要透過 UpTrain callback handler 使用 UpTrain 的管理服務，唯一需要做的就是設定 `key_type` 和 `api_key` 參數。程式碼的其餘部分保持不變。

```
callback_handler = UpTrainCallbackHandler(
    key_type="uptrain",
    api_key="up-******************************",
    project_name_prefix="llama",
)
```

這裡有一個簡短的 GIF，展示了您從 UpTrain 管理服務中可以獲得的儀表板和見解：

output.gif

# 2. 使用 UpTrain 的 EvalLlamaIndex [![Open In Colab](/assets/e79852128a5f.svg)](https://colab.research.google.com/github/run-llama/llama_index/blob/main/docs/examples/evaluation/UpTrain.ipynb)

## 安裝 UpTrain 和 LlamaIndex

終端機視窗

```
pip install uptrain llama_index
```


## 匯入所需函式庫

```
import httpx
import os
import openai
import pandas as pd


from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings
from uptrain import Evals, EvalLlamaIndex, Settings as UpTrainSettings
```


## 建立查詢引擎的資料夾

您可以使用任何您擁有的 documents 來完成此操作。對於本教學，我們將使用從 Wikipedia 提取的紐約市資料。我們只會將一個 document 添加到資料夾中，但您可以添加任意多個。

```
url = "https://uptrain-assets.s3.ap-south-1.amazonaws.com/data/nyc_text.txt"
if not os.path.exists("nyc_wikipedia"):
    os.makedirs("nyc_wikipedia")
dataset_path = os.path.join("./nyc_wikipedia", "nyc_text.txt")


if not os.path.exists(dataset_path):
    r = httpx.get(url)
    with open(dataset_path, "wb") as f:
        f.write(r.content)
```


## 建立查詢清單在我們生成回應之前，我們需要建立一個查詢清單。由於查詢引擎是根據紐約市訓練的，我們將建立與紐約市相關的查詢清單。

```
data = [
    {"question": "What is the population of New York City?"},
    {"question": "What is the area of New York City?"},
    {"question": "What is the largest borough in New York City?"},
    {"question": "What is the average temperature in New York City?"},
    {"question": "What is the main airport in New York City?"},
    {"question": "What is the famous landmark in New York City?"},
    {"question": "What is the official language of New York City?"},
    {"question": "What is the currency used in New York City?"},
    {"question": "What is the time zone of New York City?"},
    {"question": "What is the famous sports team in New York City?"},
]
```

**此 notebook 使用 OpenAI API 來為提示生成文字以及建立 Vector Store Index。因此，請將 openai.api\_key 設定為您的 OpenAI API key。**

```
openai.api_key = "sk-************************"  # your OpenAI API key
```

## 使用 LlamaIndex 建立查詢引擎

讓我們使用 LLamaIndex 建立一個 vector store index，然後將其用作查詢引擎，以檢索文件中的相關部分。

```
Settings.chunk_size = 512


documents = SimpleDirectoryReader("./nyc_wikipedia/").load_data()


vector_index = VectorStoreIndex.from_documents(
    documents,
)


query_engine = vector_index.as_query_engine()
```

## 設定

UpTrain 提供以下服務：

1. 具有進階鑽取和篩選選項的儀表板 (Dashboards)
2. 失敗案例中的洞察和常見主題
3. 生產資料的可觀察性 (Observability) 和即時監控
4. 透過與您的 CI/CD pipelines 無縫整合進行的迴歸測試 (Regression testing)

您可以從以下兩種替代方案中選擇來使用 UpTrain 進行評估：

# 替代方案 1：使用 UpTrain 的開源軟體 (OSS) 進行評估

您可以使用開源評估服務來評估您的模型。在此情況下，您需要提供一個 OpenAI API key。您可以在 [這裡](https://platform.openai.com/account/api-keys) 取得您的 key。

為了在 UpTrain 儀表板中查看您的評估結果，您需要透過在終端機中執行以下指令來設定：

終端機視窗

```
git clone https://github.com/uptrain-ai/uptrain
cd uptrain
bash run_uptrain.sh
```

這將在您的本地機器上啟動 UpTrain 儀表板。您可以在 `http://localhost:3000/dashboard` 存取它。

**注意：** `project_name` 將是 UpTrain 儀表板中顯示評估執行的專案名稱。

```
settings = UpTrainSettings(
    openai_api_key=openai.api_key,
)
```

## 建立 EvalLlamaIndex 物件

現在我們已經建立了一個查詢引擎，我們可以利用它來建立一個 EvalLlamaIndex 物件。此物件將用於為查詢生成回應。

```
llamaindex_object = EvalLlamaIndex(
    settings=settings, query_engine=query_engine
)
```

## 執行評估

現在我們有了查詢清單，我們可以利用 EvalLlamaIndex 物件為查詢生成回應，然後對回應進行評估。您可以在 [這裡](https://docs.uptrain.ai/key-components/evals) 找到 UpTrain 提供的詳盡評估清單。我們為本教學選擇了我們認為最相關的兩個：

1. **Context Relevance (上下文相關性)**：此評估檢查檢索到的上下文是否與查詢相關。這很重要，因為檢索到的上下文是用於生成回應的。如果檢索到的上下文與查詢不相關，那麼回應也將與查詢不相關。

2. **Response Conciseness (回應簡潔性)**：此評估檢查回應是否簡潔。這很重要，因為回應應該是簡潔的，不應包含任何不必要的資訊。

```
results = llamaindex_object.evaluate(
    project_name="uptrain-llama-index",
    evaluation_name="nyc_wikipedia",  # adding project and evaluation names allow you to track the results in the UpTrain dashboard
    data=data,
    checks=[Evals.CONTEXT_RELEVANCE, Evals.RESPONSE_CONCISENESS],
)
```

```
pd.DataFrame(results)
```

# 替代方案 2：使用 UpTrain 的託管服務和儀表板進行評估

或者，您可以使用 UpTrain 的託管服務來評估您的模型。您可以 [這裡](https://uptrain.ai/) 建立一個免費的 UpTrain 帳戶並獲得免費試用點數。如果您需要更多的試用點數，請 [在此處預約與 UpTrain 維護者的通話](https://calendly.com/uptrain-sourabh/30min)。

使用託管服務的好處包括：

1. 無需在您的本地機器上設定 UpTrain 儀表板。
2. 無需他們的 API key 即可存取許多 LLMs。

完成評估後，您可以在 `https://dashboard.uptrain.ai/dashboard` 的 UpTrain 儀表板中查看結果。

**注意：** `project_name` 將是 UpTrain 儀表板中顯示評估執行的專案名稱。

```
UPTRAIN_API_KEY = "up-**********************"  # your UpTrain API key


# We use `uptrain_access_token` parameter instead of 'openai_api_key' in settings in this case
settings = UpTrainSettings(
    uptrain_access_token=UPTRAIN_API_KEY,
)
```

## 建立 EvalLlamaIndex 物件

現在我們已經建立了一個查詢引擎，我們可以利用它來建立一個 EvalLlamaIndex 物件。此物件將用於為查詢生成回應。

```
llamaindex_object = EvalLlamaIndex(
    settings=settings, query_engine=query_engine
)
```

## 執行評估現在我們有了查詢列表，可以使用 EvalLlamaIndex 物件來為查詢生成回應，然後對回應進行評估。您可以在 UpTrain 提供的豐富評估列表找到 [此處](https://docs.uptrain.ai/key-components/evals)。我們為本教學選了兩個我們認為最相關的評估：

1. **Context Relevance**：此評估檢查檢索到的上下文是否與查詢相關。這很重要，因為檢索到的上下文是用來生成回應的。如果檢索到的上下文與查詢無關，那麼回應也就不會與查詢相關。

2. **Response Conciseness**：此評估檢查回應是否簡潔。這很重要，因為回應應該是簡潔的，不應包含任何不必要的資訊。

```
results = llamaindex_object.evaluate(
    project_name="uptrain-llama-index",
    evaluation_name="nyc_wikipedia",  # adding project and evaluation names allow you to track the results in the UpTrain dashboard
    data=data,
    checks=[Evals.CONTEXT_RELEVANCE, Evals.RESPONSE_CONCISENESS],
)
```

```
pd.DataFrame(results)
```

### 儀表板：

score 與案例數的直方圖

![nyc\_dashboard.png](/assets/4483642e1594.png)

您可以篩選失敗案例並在其中生成共同的主題。這有助於識別核心問題並幫助解決它

![nyc\_insights.png](/assets/e3b9ce25e271.png)

## 更多資訊

1. [Colab Notebook on UpTrainCallbackHandler](https://colab.research.google.com/github/run-llama/llama_index/blob/main/docs/examples/callbacks/UpTrainCallback.ipynb)
2. [Colab Notebook on UpTrain Integration with LlamaIndex](https://colab.research.google.com/github/run-llama/llama_index/blob/main/docs/examples/evaluation/UpTrain.ipynb)
3. [UpTrain Github Repository](https://github.com/uptrain-ai/uptrain)
4. [UpTrain Documentation](https://docs.uptrain.ai/)