---
title: "相對分數融合與基於分佈的分數融合"
---

在這個範例中，我們展示了如何使用 QueryFusionRetriever 搭配兩種方法來改進 Reciprocal Rank Fusion：

1. Relative Score Fusion ([Weaviate](https://weaviate.io/blog/hybrid-search-fusion-algorithms))
2. Distribution-Based Score Fusion ([Mazzeschi: blog post](https://medium.com/plain-simple-software/distribution-based-score-fusion-dbsf-a-new-approach-to-vector-search-ranking-f87c37488b18))

```
%pip install llama-index-llms-openai
%pip install llama-index-retrievers-bm25
```

```
import os
import openai


os.environ["OPENAI_API_KEY"] = "sk-..."
openai.api_key = os.environ["OPENAI_API_KEY"]
```

## 設定

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

```
from llama_index.core import SimpleDirectoryReader


documents = SimpleDirectoryReader("./data/paul_graham/").load_data()
```

接下來，我們將在文件上設定一個 vector index。

```
from llama_index.core import VectorStoreIndex
from llama_index.core.node_parser import SentenceSplitter


splitter = SentenceSplitter(chunk_size=256)


index = VectorStoreIndex.from_documents(
    documents, transformations=[splitter], show_progress=True
)
```

```
Parsing nodes: 100%|██████████| 1/1 [00:00<00:00,  7.55it/s]
Generating embeddings: 100%|██████████| 504/504 [00:03<00:00, 128.32it/s]
```

## 使用 Relative Score Fusion 建立混合 Fusion Retriever

在這一步驟中，我們將我們的 index 與基於 BM25 的 retriever 進行融合。這將使我們能夠同時捕捉輸入查詢中的語義關係和關鍵字。

由於這兩種檢索器都會計算分數，我們可以利用 `QueryFusionRetriever` 來重新排序我們的 nodes，而無需額外的模型或過度的計算。

以下範例使用了 Weaviate 中的 [Relative Score Fusion](https://weaviate.io/blog/hybrid-search-fusion-algorithms) 演算法，它對每個結果集應用 MinMax scaler，然後進行加權總和。在這裡，我們給予 vector retriever 比 BM25 稍高的權重（0.6 對比 0.4）。

首先，我們建立我們的 retrievers。每個 retrievers 都會檢索最相似的 top-10 nodes。

```
from llama_index.retrievers.bm25 import BM25Retriever


vector_retriever = index.as_retriever(similarity_top_k=5)


bm25_retriever = BM25Retriever.from_defaults(
    docstore=index.docstore, similarity_top_k=10
)
```

接下來，我們可以建立我們的 fusion retriever，它會從 retrievers 返回的 20 個 nodes 中，回傳最相似的 top-10 nodes。

請注意，vector 和 BM25 retrievers 可能返回完全相同的 nodes，只是順序不同；在這種情況下，它僅作為一個 re-ranker。

```
from llama_index.core.retrievers import QueryFusionRetriever


retriever = QueryFusionRetriever(
    [vector_retriever, bm25_retriever],
    retriever_weights=[0.6, 0.4],
    similarity_top_k=10,
    num_queries=1,  # set this to 1 to disable query generation
    mode="relative_score",
    use_async=True,
    verbose=True,
)
```

```
# apply nested async to run in a notebook
import nest_asyncio


nest_asyncio.apply()
```

```
nodes_with_scores = retriever.retrieve(
    "What happened at Interleafe and Viaweb?"
)
```

```
for node in nodes_with_scores:
    print(f"Score: {node.score:.2f} - {node.text[:100]}...\n-----")
```

```
Score: 0.60 - You wouldn't need versions, or ports, or any of that crap. At Interleaf there had been a whole group...
-----
Score: 0.59 - The UI was horrible, but it proved you could build a whole store through the browser, without any cl...
-----
Score: 0.40 - We were determined to be the Microsoft Word, not the Interleaf. Which meant being easy to use and in...
-----
Score: 0.36 - In its time, the editor was one of the best general-purpose site builders. I kept the code tight and...
-----
Score: 0.25 - I kept the code tight and didn't have to integrate with any other software except Robert's and Trevo...
-----
Score: 0.25 - If all I'd had to do was work on this software, the next 3 years would have been the easiest of my l...
-----
Score: 0.21 - To find out, we decided to try making a version of our store builder that you could control through ...
-----
Score: 0.11 - But the most important thing I learned, and which I used in both Viaweb and Y Combinator, is that th...
-----
Score: 0.11 - The next year, from the summer of 1998 to the summer of 1999, must have been the least productive of...
-----
Score: 0.07 - The point is that it was really cheap, less than half market price.


[8] Most software you can launc...
-----
```

### Distribution-Based Score Fusion

Relative Score Fusion 的一個變體，[Distribution-Based Score Fusion](https://medium.com/plain-simple-software/distribution-based-score-fusion-dbsf-a-new-approach-to-vector-search-ranking-f87c37488b18) 以略微不同的方式對分數進行縮放——基於每個結果集的得分的平均值和標準差。

```
from llama_index.core.retrievers import QueryFusionRetriever


retriever = QueryFusionRetriever(
    [vector_retriever, bm25_retriever],
    retriever_weights=[0.6, 0.4],
    similarity_top_k=10,
    num_queries=1,  # set this to 1 to disable query generation
    mode="dist_based_score",
    use_async=True,
    verbose=True,
)


nodes_with_scores = retriever.retrieve(
    "What happened at Interleafe and Viaweb?"
)


for node in nodes_with_scores:
    print(f"Score: {node.score:.2f} - {node.text[:100]}...\n-----")
```

```
Score: 0.42 - You wouldn't need versions, or ports, or any of that crap. At Interleaf there had been a whole group...
-----
Score: 0.41 - The UI was horrible, but it proved you could build a whole store through the browser, without any cl...
-----
Score: 0.32 - We were determined to be the Microsoft Word, not the Interleaf. Which meant being easy to use and in...
-----
Score: 0.30 - In its time, the editor was one of the best general-purpose site builders. I kept the code tight and...
-----
Score: 0.27 - To find out, we decided to try making a version of our store builder that you could control through ...
-----
Score: 0.24 - I kept the code tight and didn't have to integrate with any other software except Robert's and Trevo...
-----
Score: 0.24 - If all I'd had to do was work on this software, the next 3 years would have been the easiest of my l...
-----
Score: 0.20 - Now we felt like we were really onto something. I had visions of a whole new generation of software ...
-----
Score: 0.20 - Users wouldn't need anything more than a browser.


This kind of software, known as a web app, is com...
-----
Score: 0.18 - But the most important thing I learned, and which I used in both Viaweb and Y Combinator, is that th...
-----
```

## 在查詢引擎中使用！

現在，我們可以將我們的 retriever 插入到查詢引擎中，以合成自然語言回應。

```
from llama_index.core.query_engine import RetrieverQueryEngine


query_engine = RetrieverQueryEngine.from_args(retriever)
```

```
response = query_engine.query("What happened at Interleafe and Viaweb?")
```

```
from llama_index.core.response.notebook_utils import display_response


display_response(response)
```

**`Final Response:`** 在 Interleaf，有一個名為 Release Engineering 的團隊，其規模與編寫軟體的團隊一樣大。他們必須處理版本、埠號和其他複雜性。相比之下，在 Viaweb，軟體可以直接在伺服器上更新，簡化了流程。Viaweb 以 10,000 美元的種子資金創立，該軟體允許透過瀏覽器建立整個商店，而無需在伺服器上進行客戶端軟體或命令列輸入。該公司旨在易於使用且價格實惠，為其服務提供低月費。