---
title: "Recursive Retriever + Node 參考 + Braintrust"
---

本指南將向您展示如何使用遞迴檢索來遍歷 node 關係並根據「references」擷取 nodes。

Node references 是一個強大的概念。在首次執行檢索時，您可能希望檢索 reference 而非原始文本。多個 references 可能指向同一個 node。

在本指南中，我們探討了 node references 的一些不同用法：

- **Chunk references**：不同大小的 chunk 指向一個更大的 chunk
- **Metadata references**：Summaries + Generated Questions 指向一個更大的 chunk

我們使用 [Braintrust](https://www.braintrustdata.com/) 評估我們的遞迴檢索 + node reference 方法的表現。Braintrust 是用於建構 AI 產品的企業級堆疊。從評估、prompt playground 到資料管理，我們消除了將 AI 整合到您的業務中的不確定性和繁瑣。

您可以在這裡查看以下方法的範例評估儀表板：

- [base retriever](https://www.braintrustdata.com/app/braintrustdata.com/p/llamaindex-recurisve-retrievers/baseRetriever)
- [recursive metadata retreiver](https://www.braintrustdata.com/app/braintrustdata.com/p/llamaindex-recurisve-retrievers/recursiveMetadataRetriever)
- [recursive chunk retriever](https://www.braintrustdata.com/app/braintrustdata.com/p/llamaindex-recurisve-retrievers/recursiveChunkRetriever)

```
%pip install llama-index-llms-openai
%pip install llama-index-readers-file
```

```
%load_ext autoreload
%autoreload 2
# NOTE: Replace YOUR_OPENAI_API_KEY with your OpenAI API Key and YOUR_BRAINTRUST_API_KEY with your BrainTrust API key. Do not put it in quotes.
# Signup for Braintrust at https://braintrustdata.com/ and get your API key at https://www.braintrustdata.com/app/braintrustdata.com/settings/api-keys
# NOTE: Replace YOUR_OPENAI_KEY with your OpenAI API Key and YOUR_BRAINTRUST_API_KEY with your BrainTrust API key. Do not put it in quotes.
%env OPENAI_API_KEY=
%env BRAINTRUST_API_KEY=
%env TOKENIZERS_PARALLELISM=true # This is needed to avoid a warning message from Chroma
```

```
%pip install -U llama_hub llama_index braintrust autoevals pypdf pillow transformers torch torchvision
```

## 載入資料 + 設定

在本節中，我們下載 Llama 2 論文並建立初始的 nodes（chunk size 1024）集合。

```
!mkdir data
!wget --user-agent "Mozilla" "https://arxiv.org/pdf/2307.09288.pdf" -O "data/llama2.pdf"
```

```
from pathlib import Path
from llama_index.readers.file import PDFReader
from llama_index.core.response.notebook_utils import display_source_node
from llama_index.core.retrievers import RecursiveRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core import VectorStoreIndex
from llama_index.llms.openai import OpenAI
import json
```

```
loader = PDFReader()
docs0 = loader.load_data(file=Path("./data/llama2.pdf"))
```

```
from llama_index.core import Document


doc_text = "\n\n".join([d.get_content() for d in docs0])
docs = [Document(text=doc_text)]
```

```
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.schema import IndexNode
```

```
node_parser = SentenceSplitter(chunk_size=1024)
```

```
base_nodes = node_parser.get_nodes_from_documents(docs)
# set node ids to be a constant
for idx, node in enumerate(base_nodes):
    node.id_ = f"node-{idx}"
```

```
from llama_index.core.embeddings import resolve_embed_model


embed_model = resolve_embed_model("local:BAAI/bge-small-en")
llm = OpenAI(model="gpt-3.5-turbo")
```

## 基線 Retriever

定義一個基線 retriever，它僅透過嵌入相似度來擷取排名前 k 的原始文本 nodes。

```
base_index = VectorStoreIndex(base_nodes, embed_model=embed_model)
base_retriever = base_index.as_retriever(similarity_top_k=2)
```

```
retrievals = base_retriever.retrieve(
    "Can you tell me about the key concepts for safety finetuning"
)
```

```
for n in retrievals:
    display_source_node(n, source_length=1500)
```

```
query_engine_base = RetrieverQueryEngine.from_args(base_retriever, llm=llm)
```

```
response = query_engine_base.query(
    "Can you tell me about the key concepts for safety finetuning"
)
print(str(response))
```

## Chunk References：較小的子 chunk 指向較大的父 chunk

在這個用法範例中，我們展示如何建立一個指向較大父 chunk 的較小 chunk 的圖。

在查詢時，我們會檢索較小的 chunk，但會跟隨 references 到較大的 chunk。這使我們有更多上下文進行綜合。

```
sub_chunk_sizes = [128, 256, 512]
sub_node_parsers = [SentenceSplitter(chunk_size=c) for c in sub_chunk_sizes]


all_nodes = []


for base_node in base_nodes:
    for n in sub_node_parsers:
        sub_nodes = n.get_nodes_from_documents([base_node])
        sub_inodes = [
            IndexNode.from_text_node(sn, base_node.node_id) for sn in sub_nodes
        ]
        all_nodes.extend(sub_inodes)


    # also add original node to node
    original_node = IndexNode.from_text_node(base_node, base_node.node_id)
    all_nodes.append(original_node)
```

```
all_nodes_dict = {n.node_id: n for n in all_nodes}
```

```
vector_index_chunk = VectorStoreIndex(all_nodes, embed_model=embed_model)
```

```
vector_retriever_chunk = vector_index_chunk.as_retriever(similarity_top_k=2)
```

```
retriever_chunk = RecursiveRetriever(
    "vector",
    retriever_dict={"vector": vector_retriever_chunk},
    node_dict=all_nodes_dict,
    verbose=True,
)
```

```
nodes = retriever_chunk.retrieve(
    "Can you tell me about the key concepts for safety finetuning"
)
for node in nodes:
    display_source_node(node, source_length=2000)
```

```
query_engine_chunk = RetrieverQueryEngine.from_args(retriever_chunk, llm=llm)
```

```
response = query_engine_chunk.query(
    "Can you tell me about the key concepts for safety finetuning"
)
print(str(response))
```

## Metadata References：Summaries + Generated Questions 指向一個更大的 chunk

在這個用法範例中，我們展示如何定義引用來源 node 的額外上下文。

此額外上下文包括 summaries 以及 generated questions。

在查詢時，我們會檢索較小的 chunk，但會跟隨 references 到較大的 chunk。這使我們有更多上下文進行綜合。

```
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.schema import IndexNode
from llama_index.core.extractors import (
    SummaryExtractor,
    QuestionsAnsweredExtractor,
)
```

```
extractors = [
    SummaryExtractor(summaries=["self"], show_progress=True),
    QuestionsAnsweredExtractor(questions=5, show_progress=True),
]
```

```
# run metadata extractor across base nodes, get back dictionaries
metadata_dicts = []
for extractor in extractors:
    metadata_dicts.extend(extractor.extract(base_nodes))
```

```
# cache metadata dicts
def save_metadata_dicts(path):
    with open(path, "w") as fp:
        for m in metadata_dicts:
            fp.write(json.dumps(m) + "\n")




def load_metadata_dicts(path):
    with open(path, "r") as fp:
        metadata_dicts = [json.loads(l) for l in fp.readlines()]
        return metadata_dicts
```

```
save_metadata_dicts("data/llama2_metadata_dicts.jsonl")
```

```
metadata_dicts = load_metadata_dicts("data/llama2_metadata_dicts.jsonl")
```

```
# all nodes consists of source nodes, along with metadata
import copy


all_nodes = copy.deepcopy(base_nodes)
for idx, d in enumerate(metadata_dicts):
    inode_q = IndexNode(
        text=d["questions_this_excerpt_can_answer"],
        index_id=base_nodes[idx].node_id,
    )
    inode_s = IndexNode(
        text=d["section_summary"], index_id=base_nodes[idx].node_id
    )
    all_nodes.extend([inode_q, inode_s])
```

```
all_nodes_dict = {n.node_id: n for n in all_nodes}
```

```
## Load index into vector index
from llama_index.core import VectorStoreIndex
from llama_index.llms.openai import OpenAI


llm = OpenAI(model="gpt-3.5-turbo")


vector_index_metadata = VectorStoreIndex(all_nodes)
```

```
vector_retriever_metadata = vector_index_metadata.as_retriever(
    similarity_top_k=2
)
```

```
retriever_metadata = RecursiveRetriever(
    "vector",
    retriever_dict={"vector": vector_retriever_metadata},
    node_dict=all_nodes_dict,
    verbose=True,
)
```

```
nodes = retriever_metadata.retrieve(
    "Can you tell me about the key concepts for safety finetuning"
)
for node in nodes:
    display_source_node(node, source_length=2000)
```

```
query_engine_metadata = RetrieverQueryEngine.from_args(
    retriever_metadata, llm=llm
)
```

```
response = query_engine_metadata.query(
    "Can you tell me about the key concepts for safety finetuning"
)
print(str(response))
```

## 評估

我們使用 [Braintrust](https://www.braintrustdata.com/) 評估我們的遞迴檢索 + node reference 方法的表現。Braintrust 是用於建構 AI 產品的企業級堆疊。從評估、prompt playground 到資料管理，我們消除了將 AI 整合到您的業務中的不確定性和繁瑣。

我們同時評估 chunk references 和 metadata references。我們使用 embedding similarity lookup 來檢索 reference nodes。我們將這兩種方法與一個基線 retriever 進行比較，該基線是直接檢索原始 nodes。在指標方面，我們使用 hit-rate 和 MRR 進行評估。

您可以在這裡查看以下方法的範例評估儀表板：

- [base retriever](https://www.braintrustdata.com/app/braintrustdata.com/p/llamaindex-recurisve-retrievers/baseRetriever)
- [recursive metadata retreiver](https://www.braintrustdata.com/app/braintrustdata.com/p/llamaindex-recurisve-retrievers/recursiveMetadataRetriever)
- [recursive chunk retriever](https://www.braintrustdata.com/app/braintrustdata.com/p/llamaindex-recurisve-retrievers/recursiveChunkRetriever)

### 資料集生成

我們首先從文本 chunk 集合中生成一個問題資料集。

```
from llama_index.core.evaluation import (
    generate_question_context_pairs,
    EmbeddingQAFinetuneDataset,
)
import nest_asyncio


nest_asyncio.apply()
```

```
eval_dataset = generate_question_context_pairs(base_nodes)
```

```
eval_dataset.save_json("data/llama2_eval_dataset.json")
```

```
# optional
eval_dataset = EmbeddingQAFinetuneDataset.from_json(
    "data/llama2_eval_dataset.json"
)
```

### 比較結果

我們對每個檢索器進行評估，以衡量 hit rate 和 MRR。

我們發現具有 node references（無論是 chunk 還是 metadata）的檢索器，其表現通常優於檢索原始 chunk。

```
import pandas as pd


# set vector retriever similarity top k to higher
top_k = 10




def display_results(names, results_arr):
    """Display results from evaluate."""


    hit_rates = []
    mrrs = []
    for name, eval_results in zip(names, results_arr):
        metric_dicts = []
        for eval_result in eval_results:
            metric_dict = eval_result.metric_vals_dict
            metric_dicts.append(metric_dict)
        results_df = pd.DataFrame(metric_dicts)


        hit_rate = results_df["hit_rate"].mean()
        mrr = results_df["mrr"].mean()
        hit_rates.append(hit_rate)
        mrrs.append(mrr)


    final_df = pd.DataFrame(
        {"retrievers": names, "hit_rate": hit_rates, "mrr": mrrs}
    )
    display(final_df)
```
讓我們定義一些評分函數並定義我們的資料集資料變數。

```
queries = eval_dataset.queries
relevant_docs = eval_dataset.relevant_docs
data = [
    ({"input": queries[query], "expected": relevant_docs[query]})
    for query in queries.keys()
]




def hitRateScorer(input, expected, output=None):
    is_hit = any([id in expected for id in output])
    return 1 if is_hit else 0




def mrrScorer(input, expected, output=None):
    for i, id in enumerate(output):
        if id in expected:
            return 1 / (i + 1)
    return 0
```

```
import braintrust


# Evaluate the chunk retriever
vector_retriever_chunk = vector_index_chunk.as_retriever(similarity_top_k=10)
retriever_chunk = RecursiveRetriever(
    "vector",
    retriever_dict={"vector": vector_retriever_chunk},
    node_dict=all_nodes_dict,
    verbose=False,
)




def runChunkRetriever(input, hooks):
    retrieved_nodes = retriever_chunk.retrieve(input)
    retrieved_ids = [node.node.node_id for node in retrieved_nodes]
    return retrieved_ids




chunkEval = await braintrust.Eval(
    name="llamaindex-recurisve-retrievers",
    data=data,
    task=runChunkRetriever,
    scores=[hitRateScorer, mrrScorer],
)
```

```
# Evaluate the metadata retriever


vector_retriever_metadata = vector_index_metadata.as_retriever(
    similarity_top_k=10
)
retriever_metadata = RecursiveRetriever(
    "vector",
    retriever_dict={"vector": vector_retriever_metadata},
    node_dict=all_nodes_dict,
    verbose=False,
)




def runMetaDataRetriever(input, hooks):
    retrieved_nodes = retriever_metadata.retrieve(input)
    retrieved_ids = [node.node.node_id for node in retrieved_nodes]
    return retrieved_ids




metadataEval = await braintrust.Eval(
    name="llamaindex-recurisve-retrievers",
    data=data,
    task=runMetaDataRetriever,
    scores=[hitRateScorer, mrrScorer],
)
```

```
# Evaluate the base retriever
base_retriever = base_index.as_retriever(similarity_top_k=10)




def runBaseRetriever(input, hooks):
    retrieved_nodes = base_retriever.retrieve(input)
    retrieved_ids = [node.node.node_id for node in retrieved_nodes]
    return retrieved_ids




baseEval = await braintrust.Eval(
    name="llamaindex-recurisve-retrievers",
    data=data,
    task=runBaseRetriever,
    scores=[hitRateScorer, mrrScorer],
)
```
