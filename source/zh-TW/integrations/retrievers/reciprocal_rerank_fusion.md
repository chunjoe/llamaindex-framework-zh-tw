---
title: "互惠重排序融合 Retriever"
---

本範例會示範如何合併多個查詢與多個索引的檢索結果。

檢索到的 Nodes 會依照[這篇論文](https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf)所示的 `Reciprocal Rerank Fusion` 演算法重新排序。這種方法能有效地重新排序檢索結果，不需要大量計算，也不依賴外部模型。

感謝 GitHub 上的 @Raduaschl 提供[範例實作](https://github.com/Raudaschl/rag-fusion)。

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

如果你在 Colab 開啟這份 Notebook，可能需要安裝 LlamaIndex 🦙。

下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

```
--2024-02-12 17:59:58--  https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt
Resolving raw.githubusercontent.com (raw.githubusercontent.com)... 2606:50c0:8003::154, 2606:50c0:8001::154, 2606:50c0:8002::154, ...
Connecting to raw.githubusercontent.com (raw.githubusercontent.com)|2606:50c0:8003::154|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 75042 (73K) [text/plain]
Saving to: ‘data/paul_graham/paul_graham_essay.txt’


data/paul_graham/pa 100%[===================>]  73.28K   327KB/s    in 0.2s


2024-02-12 17:59:59 (327 KB/s) - ‘data/paul_graham/paul_graham_essay.txt’ saved [75042/75042]
```

```
from llama_index.core import SimpleDirectoryReader


documents = SimpleDirectoryReader("./data/paul_graham/").load_data()
```

接著，我們會在這些文件上建立向量索引。

```
from llama_index.core import VectorStoreIndex
from llama_index.core.node_parser import SentenceSplitter


splitter = SentenceSplitter(chunk_size=256)


index = VectorStoreIndex.from_documents(documents, transformations=[splitter])
```

## 建立混合式融合檢索器

這個步驟會將索引與以 BM25 為基礎的檢索器融合，讓查詢同時涵蓋語意關聯與關鍵字。

由於這兩種檢索器都會計算分數，我們可以使用 Reciprocal Rerank 演算法重新排列 Nodes，不需額外模型或大量計算。

此設定也會執行 4 次查詢：先使用原始查詢，再產生另外 3 個查詢。

預設會使用以下提示詞產生額外查詢：

```
QUERY_GEN_PROMPT = (
    "You are a helpful assistant that generates multiple search queries based on a "
    "single input query. Generate {num_queries} search queries, one on each line, "
    "related to the following input query:\n"
    "Query: {query}\n"
    "Queries:\n"
)
```

首先建立檢索器；每個檢索器都會取回最相似的前 2 個 Nodes：

```
from llama_index.retrievers.bm25 import BM25Retriever


vector_retriever = index.as_retriever(similarity_top_k=2)


bm25_retriever = BM25Retriever.from_defaults(
    docstore=index.docstore, similarity_top_k=2
)
```

接著建立融合檢索器，從各檢索器回傳的 4 個 Nodes 中，挑出最相似的前 2 個：

```
from llama_index.core.retrievers import QueryFusionRetriever


retriever = QueryFusionRetriever(
    [vector_retriever, bm25_retriever],
    similarity_top_k=2,
    num_queries=4,  # set this to 1 to disable query generation
    mode="reciprocal_rerank",
    use_async=True,
    verbose=True,
    # query_gen_prompt="...",  # we could override the query generation prompt here
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
Generated queries:
1. What were the major events or milestones in the history of Interleafe and Viaweb?
2. Can you provide a timeline of the key developments and achievements of Interleafe and Viaweb?
3. What were the successes and failures of Interleafe and Viaweb as companies?
```

```
for node in nodes_with_scores:
    print(f"Score: {node.score:.2f} - {node.text}...\n-----\n")
```

```
Score: 0.03 - The UI was horrible, but it proved you could build a whole store through the browser, without any client software or typing anything into the command line on the server.


Now we felt like we were really onto something. I had visions of a whole new generation of software working this way. You wouldn't need versions, or ports, or any of that crap. At Interleaf there had been a whole group called Release Engineering that seemed to be at least as big as the group that actually wrote the software. Now you could just update the software right on the server.


We started a new company we called Viaweb, after the fact that our software worked via the web, and we got $10,000 in seed funding from Idelle's husband Julian. In return for that and doing the initial legal work and giving us business advice, we gave him 10% of the company. Ten years later this deal became the model for Y Combinator's. We knew founders needed something like this, because we'd needed it ourselves....
-----


Score: 0.03 - Now we felt like we were really onto something. I had visions of a whole new generation of software working this way. You wouldn't need versions, or ports, or any of that crap. At Interleaf there had been a whole group called Release Engineering that seemed to be at least as big as the group that actually wrote the software. Now you could just update the software right on the server.


We started a new company we called Viaweb, after the fact that our software worked via the web, and we got $10,000 in seed funding from Idelle's husband Julian. In return for that and doing the initial legal work and giving us business advice, we gave him 10% of the company. Ten years later this deal became the model for Y Combinator's. We knew founders needed something like this, because we'd needed it ourselves.


At this stage I had a negative net worth, because the thousand dollars or so I had in the bank was more than counterbalanced by what I owed the government in taxes. (Had I diligently set aside the proper proportion of the money I'd made consulting for Interleaf?...
-----
```

如結果所示，回傳的兩個 Nodes 都正確提到了 Viaweb 和 Interleaf！

## 在 Query Engine 中使用！

現在可以將檢索器接到 Query Engine，產生自然語言回應。

```
from llama_index.core.query_engine import RetrieverQueryEngine


query_engine = RetrieverQueryEngine.from_args(retriever)
```

```
response = query_engine.query("What happened at Interleafe and Viaweb?")
```

```
Generated queries:
1. What were the major events or milestones in the history of Interleafe and Viaweb?
2. Can you provide a timeline of the key developments and achievements of Interleafe and Viaweb?
3. What were the outcomes or impacts of Interleafe and Viaweb on the respective industries they operated in?
```

```
from llama_index.core.response.notebook_utils import display_response


display_response(response)
```

**`Final Response:`** 在 Interleaf，有一個名為 Release Engineering 的團隊，其規模與實際編寫軟體的團隊一樣大。這顯示當時對於管理軟體的版本和 port 投入了極大的關注。However，在 Viaweb，創辦人們意識到他們可以直接在伺服器上更新軟體，從而消除對版本和 port 的需求。他們創立了 Viaweb，一家開發透過網頁運作之軟體的公司。他們獲得了 10,000 美元的種子資金，並將公司 10% 的股份給予提供資金與商業建議的 Julian。這筆交易後來成為 Y Combinator 的模式。
