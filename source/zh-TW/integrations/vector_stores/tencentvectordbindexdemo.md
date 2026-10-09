---
title: "Tencent Cloud VectorDB"
---

> [Tencent Cloud VectorDB](https://cloud.tencent.com/document/product/1709) 是一個完全託管、自研的企業級分散式資料庫服務，專為儲存、檢索和分析多維度 vector data 而設計。該資料庫支援多種 index type 和相似度計算方法。單一 index 可以支援高達 10 億的 vector 規模，並可支援數百萬的 QPS 和毫秒級的查詢延遲。Tencent Cloud Vector Database 不僅能為大型模型提供外部知識庫以提高大型模型回應的準確性，還可廣泛應用於推薦系統、NLP services、computer vision 和智慧客戶服務等 AI 領域。

**本筆筆記展示了如何將 TencentVectorDB 作為 Vector Store 在 LlamaIndex 中使用。**

要運行，您需要有 [Database instance.](https://cloud.tencent.com/document/product/1709/95101)

## 設定

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-vector-stores-tencentvectordb
```

```
!pip install llama-index
```

```
!pip install tcvectordb
```

```
from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
)
from llama_index.vector_stores.tencentvectordb import TencentVectorDB
from llama_index.core.vector_stores.tencentvectordb import (
    CollectionParams,
    FilterField,
)
import tcvectordb


tcvectordb.debug.DebugEnable = False
```

### 請提供 OpenAI access key

為了使用 OpenAI 的 embeddings，您需要提供一個 OpenAI API Key：

```
import openai


OPENAI_API_KEY = getpass.getpass("OpenAI API Key:")
openai.api_key = OPENAI_API_KEY
```

```
OpenAI API Key: ········
```


## 下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```


## 建立和填充 Vector Store

您現在將從本地檔案載入 Paul Graham 的一些文章，並將它們儲存到 Tencent Cloud VectorDB 中。

```
# load documents
documents = SimpleDirectoryReader("./data/paul_graham").load_data()
print(f"Total documents: {len(documents)}")
print(f"First document, id: {documents[0].doc_id}")
print(f"First document, hash: {documents[0].hash}")
print(
    f"First document, text ({len(documents[0].text)} characters):\n{'='*20}\n{documents[0].text[:360]} ..."
)
```

```
Total documents: 1
First document, id: 5b7489b6-0cca-4088-8f30-6de32d540fdf
First document, hash: 4c702b4df575421e1d1af4b1fd50511b226e0c9863dbfffeccb8b689b8448f35
First document, text (75019 characters):
====================




What I Worked On


February 2021


Before college the two main things I worked on, outside of school, were writing and programming. I didn't write essays. I wrote what beginning writers were supposed to write then, and probably still are: short stories. My stories were awful. They had hardly any plot, just characters with strong feelings, which I imagined  ...
```

### 初始化 Tencent Cloud VectorDB

建立 vector store 會建立底層資料庫 collection（如果尚不存在）：

```
vector_store = TencentVectorDB(
    url="http://10.0.X.X",
    key="eC4bLRy2va******************************",
    collection_params=CollectionParams(dimension=1536, drop_exists=True),
)
```

現在將此 store 包裝成一個 `index` LlamaIndex abstraction，以便後續查詢：

```
storage_context = StorageContext.from_defaults(vector_store=vector_store)


index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

請注意，上述 `from_documents` 呼叫會同時執行多個操作：將輸入 documents 拆分成可管理的區塊（“nodes”），計算每個 node 的 embedding vectors，並將它們全部儲存在 Tencent Cloud VectorDB 中。

## 查詢 store

### 基本查詢

```
query_engine = index.as_query_engine()
response = query_engine.query("Why did the author choose to work on AI?")
print(response)
```

```
The author chose to work on AI because of his fascination with the novel The Moon is a Harsh Mistress, which featured an intelligent computer called Mike, and a PBS documentary that showed Terry Winograd using SHRDLU. He was also drawn to the idea that AI could be used to explore the ultimate truths that other fields could not.
```


### 基於 MMR 的查詢

MMR (maximal marginal relevance) 方法旨在從 store 中檢索同時與查詢相關，但彼此之間差異最大的文本區塊，以在構建最終答案時提供更廣泛的上下文：

```
query_engine = index.as_query_engine(vector_store_query_mode="mmr")
response = query_engine.query("Why did the author choose to work on AI?")
print(response)
```

```
The author chose to work on AI because he was impressed and envious of his friend who had built a computer kit and was able to type programs into it. He was also inspired by a novel by Heinlein called The Moon is a Harsh Mistress, which featured an intelligent computer called Mike, and a PBS documentary that showed Terry Winograd using SHRDLU. He was also disappointed with philosophy courses in college, which he found to be boring, and he wanted to work on something that seemed more powerful.
```


## 連接到現有的 store

由於此 store 由 Tencent Cloud VectorDB 支援，它在定義上是持久性的。因此，如果您想連接到先前建立和填充過的 store，請按以下方式操作：

```
new_vector_store = TencentVectorDB(
    url="http://10.0.X.X",
    key="eC4bLRy2va******************************",
    collection_params=CollectionParams(dimension=1536, drop_exists=False),
)


# Create index (from preexisting stored vectors)
new_index_instance = VectorStoreIndex.from_vector_store(
    vector_store=new_vector_store
)


# now you can do querying, etc:
query_engine = index.as_query_engine(similarity_top_k=5)
response = query_engine.query(
    "What did the author study prior to working on AI?"
)
```

```
print(response)
```

```
The author studied philosophy and painting, worked on spam filters, and wrote essays prior to working on AI.
```


## 從 index 中移除 documents

首先，從由 index 生成的 `Retriever` 中取得 document 的明確列表，或稱 “nodes”：

```
retriever = new_index_instance.as_retriever(
    vector_store_query_mode="mmr",
    similarity_top_k=3,
    vector_store_kwargs={"mmr_prefetch_factor": 4},
)
nodes_with_scores = retriever.retrieve(
    "What did the author study prior to working on AI?"
)
```

```
print(f"Found {len(nodes_with_scores)} nodes.")
for idx, node_with_score in enumerate(nodes_with_scores):
    print(f"    [{idx}] score = {node_with_score.score}")
    print(f"        id    = {node_with_score.node.node_id}")
    print(f"        text  = {node_with_score.node.text[:90]} ...")
```

```
Found 3 nodes.
    [0] score = 0.42589144520149874
        id    = 05f53f06-9905-461a-bc6d-fa4817e5a776
        text  = What I Worked On


February 2021


Before college the two main things I worked on, outside o ...
    [1] score = -0.0012061281453193962
        id    = 2f9f843e-6495-4646-a03d-4b844ff7c1ab
        text  = been explored. But all I wanted was to get out of grad school, and my rapidly written diss ...
    [2] score = 0.025454533089838027
        id    = 28ad32da-25f9-4aaa-8487-88390ec13348
        text  = showed Terry Winograd using SHRDLU. I haven't tried rereading The Moon is a Harsh Mistress ...
```


但請注意！在使用 vector store 時，您應該將 **document** 視為應刪除的合理單元，而不是屬於它的任何單個 node。在這個案例中，您只插入了一個單一的文字檔案，因此所有 nodes 都具有相同的 `ref_doc_id`：

```
print("Nodes' ref_doc_id:")
print("\n".join([nws.node.ref_doc_id for nws in nodes_with_scores]))
```

```
Nodes' ref_doc_id:
5b7489b6-0cca-4088-8f30-6de32d540fdf
5b7489b6-0cca-4088-8f30-6de32d540fdf
5b7489b6-0cca-4088-8f30-6de32d540fdf
```


現在假設您需要移除您上傳的文字檔案：

```
new_vector_store.delete(nodes_with_scores[0].node.ref_doc_id)
```

重複完全相同的查詢並檢查結果。您應該會看到*沒有結果*被找到：

```
nodes_with_scores = retriever.retrieve(
    "What did the author study prior to working on AI?"
)


print(f"Found {len(nodes_with_scores)} nodes.")
```

```
Found 0 nodes.
```


## Metadata 過濾

Tencent Cloud VectorDB vector store 支援在查詢時以精確匹配 `key=value` 對的形式進行 metadata 過濾。以下單元，它們在一個全新的 collection 上運行，展示了此功能。

在此演示中，為了簡潔起見，載入單一來源 document（即 `../data/paul_graham/paul_graham_essay.txt` 文字檔案）。儘管如此，您將為 document 附加一些自訂 metadata，以說明如何根據附加到 documents 的 metadata 來限制查詢條件。

```
filter_fields = [
    FilterField(name="source_type"),
]


md_storage_context = StorageContext.from_defaults(
    vector_store=TencentVectorDB(
        url="http://10.0.X.X",
        key="eC4bLRy2va******************************",
        collection_params=CollectionParams(
            dimension=1536, drop_exists=True, filter_fields=filter_fields
        ),
    )
)




def my_file_metadata(file_name: str):
    """Depending on the input file name, associate a different metadata."""
    if "essay" in file_name:
        source_type = "essay"
    elif "dinosaur" in file_name:
        # this (unfortunately) will not happen in this demo
        source_type = "dinos"
    else:
        source_type = "other"
    return {"source_type": source_type}




# Load documents and build index
md_documents = SimpleDirectoryReader(
    "../data/paul_graham", file_metadata=my_file_metadata
).load_data()
md_index = VectorStoreIndex.from_documents(
    md_documents, storage_context=md_storage_context
)
```

就是這樣：您現在可以為您的查詢引擎添加過濾條件：

```
from llama_index.core.vector_stores import ExactMatchFilter, MetadataFilters
```

```
md_query_engine = md_index.as_query_engine(
    filters=MetadataFilters(
        filters=[ExactMatchFilter(key="source_type", value="essay")]
    )
)
md_response = md_query_engine.query(
    "How long it took the author to write his thesis?"
)
print(md_response.response)
```

```
It took the author five weeks to write his thesis.
```
要測試過濾器是否生效，請嘗試將其更改為僅使用 `"dinos"` documents……這次將不會有回覆了 :)