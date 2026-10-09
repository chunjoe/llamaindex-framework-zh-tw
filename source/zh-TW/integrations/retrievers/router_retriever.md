---
title: "Router Retriever"
---

在本指南中，我們定義一個自訂的 router retriever，它會選擇一個或多個候選的 retriever 來執行給定的 query。

router (`BaseSelector`) module 使用 LLM 來動態決定使用哪些底層 retrieval tools。這有助於從多樣化的資料來源中選擇一個。如果使用 multi-selector module，這也有助於跨多種資料來源聚合 retrieval 結果。

本 notebook 與 RouterQueryEngine notebook 非常相似。

### 設定

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-llms-openai
```

```
!pip install llama-index
```

```
# NOTE: This is ONLY necessary in jupyter notebook.
# Details: Jupyter runs an event-loop behind the scenes.
#          This results in nested event-loops when we start an event-loop to make async queries.
#          This is normally not allowed, we use nest_asyncio to allow it for convenience.
import nest_asyncio


nest_asyncio.apply()
```

```
import logging
import sys


logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logging.getLogger().handlers = []
logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))


from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
    SimpleKeywordTableIndex,
)
from llama_index.core import SummaryIndex
from llama_index.core.node_parser import SentenceSplitter
from llama_index.llms.openai import OpenAI
```

```
Note: NumExpr detected 12 cores but "NUMEXPR_MAX_THREADS" not set, so enforcing safe limit of 8.
NumExpr defaulting to 8 threads.
```


### 下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```


### 載入資料

我們首先展示如何將一個 Document 轉換為一組 Nodes，並插入到 DocumentStore 中。

```
# load documents
documents = SimpleDirectoryReader("./data/paul_graham/").load_data()
```

```
# initialize LLM + splitter
llm = OpenAI(model="gpt-4")
splitter = SentenceSplitter(chunk_size=1024)
nodes = splitter.get_nodes_from_documents(documents)
```

```
# initialize storage context (by default it's in-memory)
storage_context = StorageContext.from_defaults()
storage_context.docstore.add_documents(nodes)
```

```
# define
summary_index = SummaryIndex(nodes, storage_context=storage_context)
vector_index = VectorStoreIndex(nodes, storage_context=storage_context)
keyword_index = SimpleKeywordTableIndex(nodes, storage_context=storage_context)
```

```
list_retriever = summary_index.as_retriever()
vector_retriever = vector_index.as_retriever()
keyword_retriever = keyword_index.as_retriever()
```

```
from llama_index.core.tools import RetrieverTool


list_tool = RetrieverTool.from_defaults(
    retriever=list_retriever,
    description=(
        "Will retrieve all context from Paul Graham's essay on What I Worked"
        " On. Don't use if the question only requires more specific context."
    ),
)
vector_tool = RetrieverTool.from_defaults(
    retriever=vector_retriever,
    description=(
        "Useful for retrieving specific context from Paul Graham essay on What"
        " I Worked On."
    ),
)
keyword_tool = RetrieverTool.from_defaults(
    retriever=keyword_retriever,
    description=(
        "Useful for retrieving specific context from Paul Graham essay on What"
        " I Worked On (using entities mentioned in query)"
    ),
)
```


### 定義用於路由的 Selector Module

有幾個 selector 可用，每個都有一些不同的屬性。

LLM selectors 使用 LLM 來輸出一個被解析的 JSON，然後查詢相應的 indexes。

Pydantic selectors（目前僅由 `gpt-4-0613` 和 `gpt-3.5-turbo-0613` (預設值) 支援）使用 OpenAI Function Call API 來產生 pydantic selection objects，而不是解析原始的 JSON。

我們在此使用 PydanticSingleSelector/PydanticMultiSelector，但您也可以使用 LLM-equivalents。

```
from llama_index.core.selectors import LLMSingleSelector, LLMMultiSelector
from llama_index.core.selectors import (
    PydanticMultiSelector,
    PydanticSingleSelector,
)
from llama_index.core.retrievers import RouterRetriever
from llama_index.core.response.notebook_utils import display_source_node
```

#### PydanticSingleSelector

```
retriever = RouterRetriever(
    selector=PydanticSingleSelector.from_defaults(llm=llm),
    retriever_tools=[
        list_tool,
        vector_tool,
    ],
)
```

```
# will retrieve all context from the author's life
nodes = retriever.retrieve(
    "Can you give me all the context regarding the author's life?"
)
for node in nodes:
    display_source_node(node)
```

```
Selecting retriever 0: This choice is most relevant as it mentions retrieving all context from the essay, which could include information about the author's life..
```

**Node ID:** 7d07d325-489e-4157-a745-270e2066a643\
**Similarity:** None\
**Text:** What I Worked On

2021 年 2 月

在大學之前，除了學校之外，我主要做了兩件事…

**Node ID:** 01f0900b-db83-450b-a088-0473f16882d7\
**Similarity:** None\
**Text:** 顯示 Terry Winograd 使用 SHRDLU。我沒有試過重讀《The Moon is a Harsh Mistress》，所以我…

**Node ID:** b2549a68-5fef-4179-b027-620ebfa6e346\
**Similarity:** None\
**Text:** 科學是理論和系統之間一種不安的聯盟。那些證明了理論的人…

**Node ID:** 4f1e9f0d-9bc6-4169-b3b6-4f169bbfa391\
**Similarity:** None\
**Text:** 被探索過。但我只希望離開研究生院，我快速寫的論文…

**Node ID:** e20c99f9-5e80-4c92-8cc0-03d2a527131e\
**Similarity:** None\
**Text:** 就到這裡，當然，或者你只得到照片上的準確性，靜物畫…

**Node ID:** dbdf341a-f340-49f9-961f-16b9a51eea2d\
**Similarity:** None\
**Text:** 那些大而官僚的客戶是危險的資金來源，而且沒有太多…

**Node ID:** ed341d3a-9dda-49c1-8611-0ab40d04f08a\
**Similarity:** None\
**Text:** 關於金錢，因為我感覺 Interleaf 即將衰落了。自由的 Lisp 駭客工作…

**Node ID:** d69e02d3-2732-4567-a360-893c14ae157b\
**Similarity:** None\
**Text:** 建立一個網頁應用程式，現在很常見，但當時人們並不清楚這是否可行。要找出…

**Node ID:** df9e00a5-e795-40a1-9a6b-8184d1b1e7c0\
**Similarity:** None\
**Text:** 必須與 Robert 和 Trevor 的任何其他軟體整合，所以將…

**Node ID:** 38f2699b-0878-499b-90ee-821cb77e387b\
**Similarity:** None\
**Text:** 非常清楚地意識到我們每隔幾個月就會經歷的瀕死體驗。我也沒有…

**Node ID:** be04d6a9-1fc7-4209-9df2-9c17a453699a\
**Similarity:** None\
**Text:** 一瞬間的靜物畫，由相同的物體繪製而成（希望它們還沒有腐爛）。

意指…

**Node ID:** 42344911-8a7c-4e9b-81a8-0fcf40ab7690\
**Similarity:** None\
**Text:** 我在使用 Viaweb 之前幾年就創建了它，但從未用過它做任何事。一天內它有了 30…

**Node ID:** 9ec3df49-abf9-47f4-b0c2-16687882742a**相似度：** 無
**文字：** 我不知道但結果會很喜歡很多東西：一位名叫 Jessica Livingston 的女性。幾天後……

**Node ID:** d0cf6975-5261-4fb2-aae3-f3230090fb64\
**相似度：** 無
**文字：** 的讀者，但專業投資人會想：「哇，這意味著他們獲得了所有的回報。」B……

**Node ID:** 607d0480-7eee-4fb4-965d-3cb585fda62c\
**相似度：** 無
**文字：** 的「YC GDP」，但隨著 YC 成長，這越來越不像笑話了。現在很多新創公司會……

**Node ID:** 730a49c9-55f7-4416-ab91-1d0c96e704c8\
**相似度：** 無
**文字：** 所以這讓我開始思考。確實，在我的當前軌跡上，YC 將是最後一件事我……

**Node ID:** edbe8c67-e373-42bf-af98-276b559cc08b\
**相似度：** 無
**文字：** 需要的運算器嗎？John McCarthy 發明的 Lisp，或者更準確地說，發現的，是一種……

**Node ID:** 175a4375-35ec-45a0-a90c-15611505096b\
**相似度：** 無
**文字：** 像 McCarthy 最初的 Lisp 一樣，它是一個規格而非實作，儘管像 McCarthy……

**Node ID:** 0cb367f9-0aac-422b-9243-0eaa7be15090\
**相似度：** 無
**文字：** 必須告訴讀者他們還不知道的事情，有些人不喜歡被告知這些事情……

**Node ID:** 67afd4f1-9fa1-4e76-87ac-23b115823e6c\
**相似度：** 無
**文字：** 1960 年的論文。

但如果是這樣，就沒有理由假設這是語言的極限……

```
nodes = retriever.retrieve("What did Paul Graham do after RISD?")
for node in nodes:
    display_source_node(node)
```

```
Selecting retriever 1: The question asks for a specific detail from Paul Graham's essay on 'What I Worked On'. Therefore, the second choice, which is useful for retrieving specific context, is the most relevant..
```

**Node ID:** 22d20835-7de6-4cf7-92de-2bee339f3157\
**相似度：** 0.8017176790752668\
**文字：** 那那些龐大、官僚的客戶是危險的資金來源，而且沒有太多……

**Node ID:** bf818c58-5d5b-4458-acbc-d87cc67a36ca\
**相似度：** 0.7935885352785799\
**文字：** 所以這讓我開始思考。確實，在我的當前軌跡上，YC 將是最後一件事我……

#### PydanticMultiSelector

```
retriever = RouterRetriever(
    selector=PydanticMultiSelector.from_defaults(llm=llm),
    retriever_tools=[list_tool, vector_tool, keyword_tool],
)
```

```
nodes = retriever.retrieve(
    "What were noteable events from the authors time at Interleaf and YC?"
)
for node in nodes:
    display_source_node(node)
```

```
Selecting retriever 1: This choice is relevant as it allows for retrieving specific context from the essay, which is needed to answer the question about notable events at Interleaf and YC..
Selecting retriever 2: This choice is also relevant as it allows for retrieving specific context using entities mentioned in the query, which in this case are 'Interleaf' and 'YC'..
> Starting query: What were noteable events from the authors time at Interleaf and YC?
query keywords: ['interleaf', 'events', 'noteable', 'yc']
> Extracted keywords: ['interleaf', 'yc']
```

**Node ID:** fbdd25ed-1ecb-4528-88da-34f581c30782\
**相似度：** 無
**文字：** 所以這讓我開始思考。確實，在我的當前軌跡上，YC 將是最後一件事我……

**Node ID:** 4ce91b17-131f-4155-b7b5-8917cdc612b1\
**相似度：** 無
**文字：** 的「YC GDP」，但隨著 YC 成長，這越來越不像笑話了。現在很多新創公司會……

**Node ID:** 9fe6c152-28d4-4006-8a1a-43bb72655438\
**相似度：** 無
**文字：** 停止在那裡，當然，或者你只得到照片上的準確性，而什麼讓靜物畫變得……

**Node ID:** d11cd2e2-1dd2-4c3b-863f-246fe3856f49\
**相似度：** 無
**文字：** 的讀者，但專業投資人會想：「哇，這意味著他們獲得了所有的回報。」B……

**Node ID:** 2bfbab04-cb71-4641-9bd9-52c75b3a9250\
**相似度：** 無
**文字：** 必須告訴讀者他們還不知道的事情，有些人不喜歡被告知這些事情……

```
nodes = retriever.retrieve(
    "What were noteable events from the authors time at Interleaf and YC?"
)
for node in nodes:
    display_source_node(node)
```

```
Selecting retriever 1: This choice is relevant as it allows for retrieving specific context from the essay, which is needed to answer the question about notable events at Interleaf and YC..
Selecting retriever 2: This choice is also relevant as it allows for retrieving specific context using entities mentioned in the query, which in this case are 'Interleaf' and 'YC'..
> Starting query: What were noteable events from the authors time at Interleaf and YC?
query keywords: ['interleaf', 'yc', 'events', 'noteable']
> Extracted keywords: ['interleaf', 'yc']
```

**Node ID:** 49882a2c-bb95-4ff3-9df1-2a40ddaea408\
**相似度：** 無
**文字：** 所以這讓我開始思考。確實，在我的當前軌跡上，YC 將是最後一件事我……

**Node ID:** d11aced1-e630-4109-8ec8-194e975b9851\
**相似度：** 無
**文字：** 的「YC GDP」，但隨著 YC 成長，這越來越不像笑話了。現在很多新創公司會……

**Node ID:** 8aa6cc91-8e9c-4470-b6d5-4360ed13fefd\
**相似度：** 無
**文字：** 停止在那裡，當然，或者你只得到照片上的準確性，而什麼讓靜物畫變得……

**Node ID:** e37465de-c79a-4714-a402-fbd5f52800a2\
**相似度：** 無
**文字：** 必須告訴讀者他們還不知道的事情，有些人不喜歡被告知這些事情……

**Node ID:** e0ac7fb6-84fc-4763-bca6-b68f300ec7b7\
**相似度：** 無
**文字：** 的讀者，但專業投資人會想：「哇，這意味著他們獲得了所有的回報。」B……

```
nodes = await retriever.aretrieve(
    "What were noteable events from the authors time at Interleaf and YC?"
)
for node in nodes:
    display_source_node(node)
```

```
Selecting retriever 1: This choice is relevant as it allows for retrieving specific context from the essay, which is needed to answer the question about notable events at Interleaf and YC..
Selecting retriever 2: This choice is also relevant as it allows for retrieving specific context using entities mentioned in the query, which in this case are 'Interleaf' and 'YC'..
> Starting query: What were noteable events from the authors time at Interleaf and YC?
query keywords: ['events', 'interleaf', 'yc', 'noteable']
> Extracted keywords: ['interleaf', 'yc']
message='OpenAI API response' path=https://api.openai.com/v1/embeddings processing_ms=25 request_id=95c73e9360e6473daab85cde93ca4c42 response_code=200
```

**Node ID:** 76d76348-52fb-49e6-95b8-2f7a3900fa1a\
**相似度：** 無**Text:** 這讓我開始思考。確實，在我的當前軌跡上，YC 將是最後一件事……

**Node ID:** 61e1908a-79d2-426b-840e-926df469ac49\
**Similarity:** None\
**Text:** 對於「YC GDP」，但隨著 YC 的成長，這越來越不像個笑話了。現在很多新創公司都……

**Node ID:** cac03004-5c02-4145-8e92-c320b1803847\
**Similarity:** None\
**Text:** 停止在那裡，當然，不然你只得到照片上的準確度，而什麼讓靜物畫……

**Node ID:** f0d55e5e-5349-4243-ab01-d9dd7b12cd0a\
**Similarity:** None\
**Text:** 的讀者，但專業投資人會想：「哇，這意味著他們獲得了所有的回報。」B……

**Node ID:** 1516923c-0dee-4af2-b042-3e1f38de7e86\
**Similarity:** None\
**Text:** 必須告訴讀者他們還不知道的事情，有些人不喜歡被告知這些事情……