---
title: "從簡單到進階的自動檢索指南（搭配 Pinecone + Arize Phoenix）"
---

在本筆 Notebook 中，我們將展示如何對 Pinecone 執行 **auto-retrieval**，這讓您能夠執行超出標準 top-k semantic search 的廣泛半結構化查詢。

我們將展示如何設定基本的 auto-retrieval，以及如何擴展它（透過自訂 prompt 和動態 metadata 檢索）。

如果您在 Colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-vector-stores-pinecone
```

```
# !pip install llama-index>=0.9.31 scikit-learn==1.2.2 arize-phoenix==2.4.1 pinecone-client>=3.0.0
```

## 第一部分：設定 Auto-Retrieval

要設定 auto-retrieval，請執行以下步驟：

1. 我們將進行一些設定、載入資料，並建立一個 Pinecone vector index。
2. 我們將定義我們的 autoretriever 並執行一些範例查詢。
3. 我們將使用 Phoenix 觀察每個 trace 並視覺化 prompt 的輸入/輸出。
4. 我們將向您展示如何自訂 auto-retrieval prompt。

### 1.a 設定 Pinecone/Phoenix、載入資料並建立 Vector Index

在本節中，我們設定 pinecone 並導入一些關於書籍/電影的玩具資料（包含文字資料和 metadata）。

我們也設定 Phoenix，以便它能擷取下游的 traces。

```
# setup Phoenix
import phoenix as px
import llama_index.core


px.launch_app()
llama_index.core.set_global_handler("arize_phoenix")
```

```
🌍 To view the Phoenix app in your browser, visit http://127.0.0.1:6006/
📺 To view the Phoenix app in a notebook, run `px.active_session().view()`
📖 For more information on how to use Phoenix, check out https://docs.arize.com/phoenix
```

```
import os


os.environ[
    "PINECONE_API_KEY"
] = "<Your Pinecone API key, from app.pinecone.io>"
# os.environ["OPENAI_API_KEY"] = "sk-..."
```

```
from pinecone import Pinecone
from pinecone import ServerlessSpec


api_key = os.environ["PINECONE_API_KEY"]
pc = Pinecone(api_key=api_key)
```

```
# delete if needed
# pc.delete_index("quickstart-index")
```

```
# Dimensions are for text-embedding-ada-002
try:
    pc.create_index(
        "quickstart-index",
        dimension=1536,
        metric="euclidean",
        spec=ServerlessSpec(cloud="aws", region="us-west-2"),
    )
except Exception as e:
    # Most likely index already exists
    print(e)
    pass
```

```
pinecone_index = pc.Index("quickstart-index")
```

#### 載入 documents，建立 PineconeVectorStore 和 VectorStoreIndex

```
from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.vector_stores.pinecone import PineconeVectorStore
```

```
from llama_index.core.schema import TextNode


nodes = [
    TextNode(
        text="The Shawshank Redemption",
        metadata={
            "author": "Stephen King",
            "theme": "Friendship",
            "year": 1994,
        },
    ),
    TextNode(
        text="The Godfather",
        metadata={
            "director": "Francis Ford Coppola",
            "theme": "Mafia",
            "year": 1972,
        },
    ),
    TextNode(
        text="Inception",
        metadata={
            "director": "Christopher Nolan",
            "theme": "Fiction",
            "year": 2010,
        },
    ),
    TextNode(
        text="To Kill a Mockingbird",
        metadata={
            "author": "Harper Lee",
            "theme": "Fiction",
            "year": 1960,
        },
    ),
    TextNode(
        text="1984",
        metadata={
            "author": "George Orwell",
            "theme": "Totalitarianism",
            "year": 1949,
        },
    ),
    TextNode(
        text="The Great Gatsby",
        metadata={
            "author": "F. Scott Fitzgerald",
            "theme": "The American Dream",
            "year": 1925,
        },
    ),
    TextNode(
        text="Harry Potter and the Sorcerer's Stone",
        metadata={
            "author": "J.K. Rowling",
            "theme": "Fiction",
            "year": 1997,
        },
    ),
]
```

```
vector_store = PineconeVectorStore(
    pinecone_index=pinecone_index,
    namespace="test",
)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
```

```
index = VectorStoreIndex(nodes, storage_context=storage_context)
```

```
Upserted vectors:   0%|          | 0/7 [00:00<?, ?it/s]
```


### 1.b 定義 Autoretriever，執行一些範例查詢

#### 設定 `VectorIndexAutoRetriever`

其中一個輸入是 `schema`，用來描述 vector store collection 包含的內容。這類似於描述 SQL 資料庫中某個表的 table schema。此 schema 資訊隨後被注入到 prompt 中，傳遞給 LLM 以推斷完整的查詢應該是什麼（包括 metadata 篩選器）。

```
from llama_index.core.retrievers import VectorIndexAutoRetriever
from llama_index.core.vector_stores import MetadataInfo, VectorStoreInfo




vector_store_info = VectorStoreInfo(
    content_info="famous books and movies",
    metadata_info=[
        MetadataInfo(
            name="director",
            type="str",
            description=("Name of the director"),
        ),
        MetadataInfo(
            name="theme",
            type="str",
            description=("Theme of the book/movie"),
        ),
        MetadataInfo(
            name="year",
            type="int",
            description=("Year of the book/movie"),
        ),
    ],
)
retriever = VectorIndexAutoRetriever(
    index,
    vector_store_info=vector_store_info,
    empty_query_top_k=10,
    # this is a hack to allow for blank queries in pinecone
    default_empty_query_vector=[0] * 1536,
    verbose=True,
)
```

#### 執行一些查詢

讓我們執行一些利用結構化資訊的範例查詢。

```
nodes = retriever.retrieve(
    "Tell me about some books/movies after the year 2000"
)
```

```
Using query str:
Using filters: [('year', '>', 2000)]
```

```
for node in nodes:
    print(node.text)
    print(node.metadata)
```

```
Inception
{'director': 'Christopher Nolan', 'theme': 'Fiction', 'year': 2010}
```

```
nodes = retriever.retrieve("Tell me about some books that are Fiction")
```

```
Using query str: Fiction
Using filters: [('theme', '==', 'Fiction')]
```

```
for node in nodes:
    print(node.text)
    print(node.metadata)
```

```
Inception
{'director': 'Christopher Nolan', 'theme': 'Fiction', 'year': 2010}
To Kill a Mockingbird
{'author': 'Harper Lee', 'theme': 'Fiction', 'year': 1960}
```

#### 傳入額外的 Metadata 篩選器

如果您有想要傳入但無法自動推斷的額外 metadata 篩選器，請執行以下操作。

```
from llama_index.core.vector_stores import MetadataFilters


filter_dicts = [{"key": "year", "operator": "==", "value": 1997}]
filters = MetadataFilters.from_dicts(filter_dicts)
retriever2 = VectorIndexAutoRetriever(
    index,
    vector_store_info=vector_store_info,
    empty_query_top_k=10,
    # this is a hack to allow for blank queries in pinecone
    default_empty_query_vector=[0] * 1536,
    extra_filters=filters,
)
```

```
nodes = retriever2.retrieve("Tell me about some books that are Fiction")
for node in nodes:
    print(node.text)
    print(node.metadata)
```

```
Harry Potter and the Sorcerer's Stone
{'author': 'J.K. Rowling', 'theme': 'Fiction', 'year': 1997}
```

#### 失敗查詢的範例

請注意，沒有結果被檢索！我們稍後會修復這個問題。

```
nodes = retriever.retrieve("Tell me about some books that are mafia-themed")
```

```
Using query str: books
Using filters: [('theme', '==', 'mafia')]
```

```
for node in nodes:
    print(node.text)
    print(node.metadata)
```


### 視覺化 Traces

讓我們開啟 Phoenix 來查看 traces！

![](/assets/41cac47f48b5.png)

讓我們看看 auto-retrieval prompt。我們可以看到 auto-retrieval prompt 使用了兩個 few-shot 範例。

## 第二部分：擴展 Auto-Retrieval（使用動態 Metadata 檢索）

我們現在透過自訂 prompt 來擴展 auto-retrieval。在第一部分，我們明確添加了一些規則。

在第二部分，我們實作 **dynamic metadata retrieval**，它會進行第一階段的檢索過程，從 vector db 中擷取相關 metadata，並將其作為 few-shot 範例插入到 auto-retrieval prompt 中。（當然，第二階段的檢索過程會從 vector db 中檢索實際的項目）。

### 2.a 改善 Auto-retrieval Prompt

我們的 auto-retrieval prompt 可以運作，但可以透過多種方式進行改進。一些範例包括它包含 2 個硬編碼的 few-shot 範例（如何包含您自己的？），以及 auto-retrieval 並不「總是」推斷出正確的 metadata 篩選器。

例如，所有 `theme` 的欄位都是大寫的。我們如何告訴 LLM，這樣它就不會錯誤地推斷出一個小寫的「theme」？

讓我們嘗試修改 prompt！

```
from llama_index.core.prompts import display_prompt_dict
from llama_index.core import PromptTemplate
```

```
prompts_dict = retriever.get_prompts()
```

```
display_prompt_dict(prompts_dict)
```

```
# look at required template variables.
prompts_dict["prompt"].template_vars
```

```
['schema_str', 'info_str', 'query_str']
```

#### 自訂 Prompt

讓我們稍微自訂一下 prompt。我們執行以下操作：

- 移除第一個 few-shot 範例以節省 tokens
- 添加一個訊息，如果推斷出「theme」，則總是將字母大寫。

請注意，prompt template 需要定義 `schema_str`、`info_str` 和 `query_str`。

````
# write prompt template, and modify it.


prompt_tmpl_str = """\
Your goal is to structure the user's query to match the request schema provided below.


<< Structured Request Schema >>
When responding use a markdown code snippet with a JSON object formatted in the following schema:


{schema_str}


The query string should contain only text that is expected to match the contents of documents. Any conditions in the filter should not be mentioned in the query as well.


Make sure that filters only refer to attributes that exist in the data source.
Make sure that filters take into account the descriptions of attributes.
Make sure that filters are only used as needed. If there are no filters that should be applied return [] for the filter value.
If the user's query explicitly mentions number of documents to retrieve, set top_k to that number, otherwise do not set top_k.
Do NOT EVER infer a null value for a filter. This will break the downstream program. Instead, don't include the filter.


<< Example 1. >>
Data Source:
```json
{{
    "metadata_info": [
        {{
            "name": "author",
            "type": "str",
            "description": "Author name"
        }},
        {{
            "name": "book_title",
            "type": "str",
            "description": "Book title"
        }},
        {{
            "name": "year",
            "type": "int",
            "description": "Year Published"
        }},
        {{
            "name": "pages",
            "type": "int",
            "description": "Number of pages"
        }},
        {{
            "name": "summary",
            "type": "str",
            "description": "A short summary of the book"
        }}
    ],
    "content_info": "Classic literature"
}}
````
使用者查詢：有哪些在 1813 年之後出版的珍·奧斯汀書籍探討婚姻與社會地位的主題？

額外指示：無

結構化請求：

```
{{"query": "Books related to theme of marriage for social standing", "filters": [{{"key": "year", "value": "1813", "operator": ">"}}, {{"key": "author", "value": "Jane Austen", "operator": "=="}}], "top_k": null}}
```

<< 範例 2. >> 資料來源：

```
{info_str}
```

使用者查詢：{query\_str}

額外指示：{additional\_instructions}

結構化請求： """

````
```python
prompt_tmpl = PromptTemplate(prompt_tmpl_str)
````

您會注意到我們新增了 `additional_instructions` 模板變數。這允許我們插入特定向量集合的指示。

我們將使用 `partial_format` 來添加指示。

```
add_instrs = """\
If one of the filters is 'theme', please make sure that the first letter of the inferred value is capitalized. Only words that are capitalized are valid values for "theme". \
"""
prompt_tmpl = prompt_tmpl.partial_format(additional_instructions=add_instrs)
```

```
retriever.update_prompts({"prompt": prompt_tmpl})
```

#### 重新執行一些查詢

現在讓我們嘗試重新執行一些查詢，看看值是自動推斷的。

```
nodes = retriever.retrieve(
    "Tell me about some books that are friendship-themed"
)
```

```
for node in nodes:
    print(node.text)
    print(node.metadata)
```

### 2.b 實作動態元數據檢索

除了在提示中硬編碼規則之外，另一種方法是檢索**相關的少樣本元數據範例**，以幫助 LLM 更好地推斷正確的 metadata 篩選器。

這將更好地防止 LLM 在推斷 “where” 子句時出錯，特別是在拼寫/值的正確格式等方面。

我們可以透過 vector retrieval 來做到這一點。現有的 vector db collection 儲存原始文字 + metadata；我們可以直接查詢此 collection，或者僅對 metadata 進行索引並從中檢索。在本節中，我們選擇前者，但在實務上您可能希望採用後者。

```
# define retriever that fetches the top 2 examples.
metadata_retriever = index.as_retriever(similarity_top_k=2)
```

我們使用前一節中定義的相同的 `prompt_tmpl_str`。

```
from typing import List, Any




def format_additional_instrs(**kwargs: Any) -> str:
    """Format examples into a string."""


    nodes = metadata_retriever.retrieve(kwargs["query_str"])
    context_str = (
        "Here is the metadata of relevant entries from the database collection. "
        "This should help you infer the right filters: \n"
    )
    for node in nodes:
        context_str += str(node.node.metadata) + "\n"
    return context_str




ext_prompt_tmpl = PromptTemplate(
    prompt_tmpl_str,
    function_mappings={"additional_instructions": format_additional_instrs},
)
```

```
retriever.update_prompts({"prompt": ext_prompt_tmpl})
```

#### 重新執行一些查詢

現在讓我們嘗試重新執行一些查詢，看看值是自動推斷的。

```
nodes = retriever.retrieve("Tell me about some books that are mafia-themed")
for node in nodes:
    print(node.text)
    print(node.metadata)
```

```
Using query str: books
Using filters: [('theme', '==', 'Mafia')]
The Godfather
{'director': 'Francis Ford Coppola', 'theme': 'Mafia', 'year': 1972}
```

```
nodes = retriever.retrieve("Tell me some books authored by HARPER LEE")
for node in nodes:
    print(node.text)
    print(node.metadata)
```

```
Using query str: Books authored by Harper Lee
Using filters: [('author', '==', 'Harper Lee')]
To Kill a Mockingbird
{'author': 'Harper Lee', 'theme': 'Fiction', 'year': 1960}
```
