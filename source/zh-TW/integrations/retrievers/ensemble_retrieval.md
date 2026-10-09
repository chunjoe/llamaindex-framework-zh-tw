---
title: "Ensemble Retrieval 指南"
---

經常在建置 RAG 應用程式時，需要從許多檢索參數/策略中進行選擇（例如，從分塊大小到 vector vs. keyword vs. hybrid search）。

思考：如果我們能一次嘗試多種策略，並讓任何 AI/reranker/LLM 來篩選結果會怎麼樣？

這達成了兩個目的：

- 透過將多種策略的結果合併，獲得更好的（儘管成本更高）檢索結果，假設 reranker 表現良好
- 一種方法，用於比較不同檢索策略（相對於 reranker）的表現

本指南在 Llama 2 論文上展示了這一點。我們對不同的分塊大小和不同的 index 進行了集合檢索（ensemble retrieval）。

**注意**：一個密切相關的指南是我們的 [Ensemble Query Engine Guide](https://gpt-index.readthedocs.io/en/stable/examples/query_engine/ensemble_qury_engine.html) - 請務必查看！

```
%pip install llama-index-llms-openai
%pip install llama-index-postprocessor-cohere-rerank
%pip install llama-index-readers-file pymupdf
```

```
%load_ext autoreload
%autoreload 2
```

## 設定

我們在此定義必要的匯入。

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

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
)
from llama_index.core import SummaryIndex
from llama_index.core.response.notebook_utils import display_response
from llama_index.llms.openai import OpenAI
```

```
Note: NumExpr detected 12 cores but "NUMEXPR_MAX_THREADS" not set, so enforcing safe limit of 8.
NumExpr defaulting to 8 threads.
```

## 載入資料

在本節中，我們首先將 Llama 2 論文作為單一 document 載入。然後，我們根據不同的分塊大小對其進行多次分塊。我們為每種分塊大小建立一個單獨的 vector index。

```
!wget --user-agent "Mozilla" "https://arxiv.org/pdf/2307.09288.pdf" -O "data/llama2.pdf"
```

```
--2023-09-28 12:56:38--  https://arxiv.org/pdf/2307.09288.pdf
Resolving arxiv.org (arxiv.org)... 128.84.21.199
Connecting to arxiv.org (arxiv.org)|128.84.21.199|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 13661300 (13M) [application/pdf]
Saving to: ‘data/llama2.pdf’


data/llama2.pdf     100%[===================>]  13.03M   521KB/s    in 42s


2023-09-28 12:57:20 (320 KB/s) - ‘data/llama2.pdf’ saved [13661300/13661300]
```

```
from pathlib import Path
from llama_index.core import Document
from llama_index.readers.file import PyMuPDFReader
```

```
loader = PyMuPDFReader()
docs0 = loader.load(file_path=Path("./data/llama2.pdf"))
doc_text = "\n\n".join([d.get_content() for d in docs0])
docs = [Document(text=doc_text)]
```

我們嘗試了不同的分塊大小：128、256、512 和 1024。

```
# initialize modules
llm = OpenAI(model="gpt-4")
chunk_sizes = [128, 256, 512, 1024]
nodes_list = []
vector_indices = []
for chunk_size in chunk_sizes:
    print(f"Chunk Size: {chunk_size}")
    splitter = SentenceSplitter(chunk_size=chunk_size)
    nodes = splitter.get_nodes_from_documents(docs)


    # add chunk size to nodes to track later
    for node in nodes:
        node.metadata["chunk_size"] = chunk_size
        node.excluded_embed_metadata_keys = ["chunk_size"]
        node.excluded_llm_metadata_keys = ["chunk_size"]


    nodes_list.append(nodes)


    # build vector index
    vector_index = VectorStoreIndex(nodes)
    vector_indices.append(vector_index)
```

```
Chunk Size: 128
Chunk Size: 256
Chunk Size: 512
Chunk Size: 1024
```

## 定義 Ensemble Retriever

我們主要使用我們的遞迴檢索抽象來設定一個 “ensemble” retriever。它運作如下：

- 為每種分塊大小定義一個單獨的 `IndexNode`，對應於 vector retriever（例如，分塊大小 128 對應 retriever，分塊大小 256 對應 retriever，等等）
- 將所有 IndexNodes 放入單一 `SummaryIndex` 中 - 當呼叫對應的 retriever 時，*所有* nodes 都會被返回。
- 定義一個遞迴 Retriever，其根 node 是 summary index retriever。它會首先從 summary index retriever 獲取所有 nodes，然後對每種分塊大小遞迴呼叫 vector retriever。
- 對最終結果進行 rerank。

最終結果是當執行查詢時，所有 vector retrievers 都會被呼叫。

```
# try ensemble retrieval


from llama_index.core.tools import RetrieverTool
from llama_index.core.schema import IndexNode


# retriever_tools = []
retriever_dict = {}
retriever_nodes = []
for chunk_size, vector_index in zip(chunk_sizes, vector_indices):
    node_id = f"chunk_{chunk_size}"
    node = IndexNode(
        text=(
            "Retrieves relevant context from the Llama 2 paper (chunk size"
            f" {chunk_size})"
        ),
        index_id=node_id,
    )
    retriever_nodes.append(node)
    retriever_dict[node_id] = vector_index.as_retriever()
```

定義遞迴 retriever。

```
from llama_index.core.selectors import PydanticMultiSelector


from llama_index.core.retrievers import RouterRetriever
from llama_index.core.retrievers import RecursiveRetriever
from llama_index.core import SummaryIndex


# the derived retriever will just retrieve all nodes
summary_index = SummaryIndex(retriever_nodes)


retriever = RecursiveRetriever(
    root_id="root",
    retriever_dict={"root": summary_index.as_retriever(), **retriever_dict},
)
```

讓我們在範例查詢上測試 retriever。

```
nodes = await retriever.aretrieve(
    "Tell me about the main aspects of safety fine-tuning"
)
```

```
print(f"Number of nodes: {len(nodes)}")
for node in nodes:
    print(node.node.metadata["chunk_size"])
    print(node.node.get_text())
```

定義 reranker 來處理最終檢索到的 nodes 集合。

```
# define reranker
from llama_index.core.postprocessor import LLMRerank, SentenceTransformerRerank
from llama_index.postprocessor.cohere_rerank import CohereRerank


# reranker = LLMRerank()
# reranker = SentenceTransformerRerank(top_n=10)
reranker = CohereRerank(top_n=10)
```

定義 retriever query engine，將遞迴的 retriever + reranker 結合在一起。

```
# define RetrieverQueryEngine
from llama_index.core.query_engine import RetrieverQueryEngine


query_engine = RetrieverQueryEngine(retriever, node_postprocessors=[reranker])
```

```
response = query_engine.query(
    "Tell me about the main aspects of safety fine-tuning"
)
```

```
display_response(
    response, show_source=True, source_length=500, show_source_metadata=True
)
```

### 分析每個分塊的相對重要性

集合式檢索的一個有趣特性是，透過 reranking，我們可以利用最終檢索集合中分塊的排序來確定每個分塊大小的重要性。例如，如果某些分塊大小總是排名在最前面，那麼它們可能與查詢的相關性更高。

```
# compute the average precision for each chunk size based on positioning in combined ranking
from collections import defaultdict
import pandas as pd




def mrr_all(metadata_values, metadata_key, source_nodes):
    # source nodes is a ranked list
    # go through each value, find out positioning in source_nodes
    value_to_mrr_dict = {}
    for metadata_value in metadata_values:
        mrr = 0
        for idx, source_node in enumerate(source_nodes):
            if source_node.node.metadata[metadata_key] == metadata_value:
                mrr = 1 / (idx + 1)
                break
            else:
                continue


        # normalize AP, set in dict
        value_to_mrr_dict[metadata_value] = mrr


    df = pd.DataFrame(value_to_mrr_dict, index=["MRR"])
    df.style.set_caption("Mean Reciprocal Rank")
    return df
```

```
# Compute the Mean Reciprocal Rank for each chunk size (higher is better)
# we can see that chunk size of 256 has the highest ranked results.
print("Mean Reciprocal Rank for each Chunk Size")
mrr_all(chunk_sizes, "chunk_size", response.source_nodes)
```

```
Mean Reciprocal Rank for each Chunk Size
```

```
.dataframe tbody tr th {
    vertical-align: top;
}


.dataframe thead th {
    text-align: right;
}
```

|     | 128      | 256 | 512 | 1024 |
| --- | -------- | --- | --- | ---- |
| MRR | 0.333333 | 1.0 | 0.5 | 0.25 |

## 評估

我們更嚴謹地評估集合式 retriever 與 “baseline” retriever 的表現。

我們定義/載入一個 eval benchmark dataset，然後在它上面運行不同的評估。

**警告**：這可能*非常昂貴*，特別是使用 GPT-4。請謹慎使用並調整樣本大小以符合您的預算。

```
from llama_index.core.evaluation import DatasetGenerator, QueryResponseDataset
from llama_index.llms.openai import OpenAI
import nest_asyncio


nest_asyncio.apply()
```

```
# NOTE: run this if the dataset isn't already saved
eval_llm = OpenAI(model="gpt-4")
# generate questions from the largest chunks (1024)
dataset_generator = DatasetGenerator(
    nodes_list[-1],
    llm=eval_llm,
    show_progress=True,
    num_questions_per_chunk=2,
)
```

```
eval_dataset = await dataset_generator.agenerate_dataset_from_nodes(num=60)
```

```
eval_dataset.save_json("data/llama2_eval_qr_dataset.json")
```

```
# optional
eval_dataset = QueryResponseDataset.from_json(
    "data/llama2_eval_qr_dataset.json"
)
```

### 比較結果

```
import asyncio
import nest_asyncio


nest_asyncio.apply()
```

```
from llama_index.core.evaluation import (
    CorrectnessEvaluator,
    SemanticSimilarityEvaluator,
    RelevancyEvaluator,
    FaithfulnessEvaluator,
    PairwiseComparisonEvaluator,
)


# NOTE: can uncomment other evaluators
evaluator_c = CorrectnessEvaluator(llm=eval_llm)
evaluator_s = SemanticSimilarityEvaluator(llm=eval_llm)
evaluator_r = RelevancyEvaluator(llm=eval_llm)
evaluator_f = FaithfulnessEvaluator(llm=eval_llm)


pairwise_evaluator = PairwiseComparisonEvaluator(llm=eval_llm)
```

```
from llama_index.core.evaluation.eval_utils import (
    get_responses,
    get_results_df,
)
from llama_index.core.evaluation import BatchEvalRunner


max_samples = 60


eval_qs = eval_dataset.questions
qr_pairs = eval_dataset.qr_pairs
ref_response_strs = [r for (_, r) in qr_pairs]


# resetup base query engine and ensemble query engine
# base query engine
base_query_engine = vector_indices[-1].as_query_engine(similarity_top_k=2)
# ensemble query engine
reranker = CohereRerank(top_n=4)
query_engine = RetrieverQueryEngine(retriever, node_postprocessors=[reranker])
```

```
base_pred_responses = get_responses(
    eval_qs[:max_samples], base_query_engine, show_progress=True
)
```

```
pred_responses = get_responses(
    eval_qs[:max_samples], query_engine, show_progress=True
)
```

```
import numpy as np


pred_response_strs = [str(p) for p in pred_responses]
base_pred_response_strs = [str(p) for p in base_pred_responses]
```

```
evaluator_dict = {
    "correctness": evaluator_c,
    "faithfulness": evaluator_f,
    # "relevancy": evaluator_r,
    "semantic_similarity": evaluator_s,
}
batch_runner = BatchEvalRunner(evaluator_dict, workers=1, show_progress=True)
```

```
eval_results = await batch_runner.aevaluate_responses(
    queries=eval_qs[:max_samples],
    responses=pred_responses[:max_samples],
    reference=ref_response_strs[:max_samples],
)
```

```
base_eval_results = await batch_runner.aevaluate_responses(
    queries=eval_qs[:max_samples],
    responses=base_pred_responses[:max_samples],
    reference=ref_response_strs[:max_samples],
)
```

```
results_df = get_results_df(
    [eval_results, base_eval_results],
    ["Ensemble Retriever", "Base Retriever"],
    ["correctness", "faithfulness", "semantic_similarity"],
)
display(results_df)
```

```
.dataframe tbody tr th {
    vertical-align: top;
}


.dataframe thead th {
    text-align: right;
}
```

|   | names              | correctness | faithfulness | semantic\_similarity |
| - | ------------------ | ----------- | ------------ | -------------------- || 0 | Ensemble Retriever | 4.375000    | 0.983333     | 0.964546             |
| 1 | Base Retriever     | 4.066667    | 0.983333     | 0.956692             |

```
batch_runner = BatchEvalRunner(
    {"pairwise": pairwise_evaluator}, workers=3, show_progress=True
)


pairwise_eval_results = await batch_runner.aevaluate_response_strs(
    queries=eval_qs[:max_samples],
    response_strs=pred_response_strs[:max_samples],
    reference=base_pred_response_strs[:max_samples],
)
```

```
results_df = get_results_df(
    [eval_results, base_eval_results],
    ["Ensemble Retriever", "Base Retriever"],
    ["pairwise"],
)
display(results_df)
```

```
.dataframe tbody tr th {
    vertical-align: top;
}


.dataframe thead th {
    text-align: right;
}
```

|   | 名稱               | pairwise |
| - | ------------------- | -------- |
| 0 | Pairwise Comparison | 0.5      |