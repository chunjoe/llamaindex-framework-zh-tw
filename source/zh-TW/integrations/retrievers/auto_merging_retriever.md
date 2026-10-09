---
title: "自動合併 Retriever"
---

在本筆記中，我們展示 `AutoMergingRetriever`，它會檢視一組 leaf nodes，並遞迴地「合併」那些引用了超出特定閾值的父級 node 的 nodes 的子集。這使我們能夠將可能不同的較小上下文整合到一個更大的上下文，有助於合成。

您可以自行在 documents 的集合上定義此層級，或者可以使用我們全新的文字解析器：HierarchicalNodeParser，它接收一個候選的 documents 集合，並輸出一個完整的 nodes 層級，從「粗到細」（coarse-to-fine）。

```
%pip install llama-index-llms-openai
%pip install llama-index-readers-file pymupdf
```

```
%load_ext autoreload
%autoreload 2
```

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
!pip install llama-index
```

## 載入資料

我們先載入 Llama 2 paper：<https://arxiv.org/pdf/2307.09288.pdf>。這將是我們的測試資料。

```
!mkdir -p 'data/'
!wget --user-agent "Mozilla" "https://arxiv.org/pdf/2307.09288.pdf" -O "data/llama2.pdf"
```

```
from pathlib import Path


from llama_index.readers.file import PDFReader
from llama_index.readers.file import PyMuPDFReader
```

```
loader = PyMuPDFReader()
# docs0 = loader.load_data(file=Path("./data/llama2.pdf"))
docs0 = loader.load(file_path=Path("./data/llama2.pdf"))
```

預設情況下，PDF 讀取器會為每個頁面建立一個單獨的 doc。為了本筆記的目的，我們將這些 doc 串接成一個 doc。這將幫助我們更好地凸顯稍後將區塊「串接」起來的自動合併能力。

```
from llama_index.core import Document


doc_text = "\n\n".join([d.get_content() for d in docs0])
docs = [Document(text=doc_text)]
```

## 從文字中解析區塊層級，載入儲存

在本節中，我們使用 `HierarchicalNodeParser`。這將輸出一個 nodes 的層級，從具有較大區塊大小的頂層 nodes 到具有較小區塊大小的子級 nodes，其中每個子級 node 都有一個具有較大區塊大小的父級 node。

預設的層級如下：

- 第 1 級：區塊大小 2048
- 第 2 級：區塊大小 512
- 第 3 級：區塊大小 128

然後我們將這些 nodes 載入儲存。leaf nodes 會透過 vector store 進行索引和檢索——這些是將首先透過相似度搜尋直接檢索的 nodes。其他 nodes 將從 docstore 中檢索。

```
from llama_index.core.node_parser import (
    HierarchicalNodeParser,
    SentenceSplitter,
)
```

```
node_parser = HierarchicalNodeParser.from_defaults()
```

```
nodes = node_parser.get_nodes_from_documents(docs)
```

```
len(nodes)
```

```
1029
```

在這裡，我們導入一個簡單的輔助函數，用於在 node 列表中獲取「leaf」nodes。這些是沒有自己子級的 nodes。

```
from llama_index.core.node_parser import get_leaf_nodes, get_root_nodes
```

```
leaf_nodes = get_leaf_nodes(nodes)
```

```
len(leaf_nodes)
```

```
795
```

```
root_nodes = get_root_nodes(nodes)
```

### 載入儲存

我們定義一個 docstore，將所有 nodes 載入其中。

然後我們定義一個 `VectorStoreIndex`，只包含 leaf 級的 nodes。

```
# define storage context
from llama_index.core.storage.docstore import SimpleDocumentStore
from llama_index.core import StorageContext
from llama_index.llms.openai import OpenAI


docstore = SimpleDocumentStore()


# insert nodes into docstore
docstore.add_documents(nodes)


# define storage context (will include vector store by default too)
storage_context = StorageContext.from_defaults(docstore=docstore)


llm = OpenAI(model="gpt-3.5-turbo")
```

```
## Load index into vector index
from llama_index.core import VectorStoreIndex


base_index = VectorStoreIndex(
    leaf_nodes,
    storage_context=storage_context,
)
```

## 定義 Retriever

```
from llama_index.core.retrievers import AutoMergingRetriever
```

```
base_retriever = base_index.as_retriever(similarity_top_k=6)
retriever = AutoMergingRetriever(base_retriever, storage_context, verbose=True)
```

```
# query_str = "What were some lessons learned from red-teaming?"
# query_str = "Can you tell me about the key concepts for safety finetuning"
query_str = (
    "What could be the potential outcomes of adjusting the amount of safety"
    " data used in the RLHF stage?"
)


nodes = retriever.retrieve(query_str)
base_nodes = base_retriever.retrieve(query_str)
```

```
> Merging 4 nodes into parent node.
> Parent node id: caf5f81c-842f-46a4-b679-6be584bd6aff.
> Parent node text: We conduct RLHF by first collecting human preference data for safety similar to Section 3.2.2: an...
```

```
len(nodes)
```

```
3
```

```
len(base_nodes)
```

```
6
```

```
from llama_index.core.response.notebook_utils import display_source_node


for node in nodes:
    display_source_node(node, source_length=10000)
```

**Node ID:** d4d67180-71c8-4328-b3f1-1e98fa42ab69\
**Similarity:** 0.8694979150607424\
**Text:** 我們還列出了兩個定性範例，其中安全性和有用性獎勵模型之間存在分歧，見 Table 35。A.4.2 Qualitative Results on Safety Data Scaling In Section 4.2.3，我們以量化方式研究將更多安全資料添加到模型 RLHF 中的影響。在這裡，我們展示了一些樣本，以定性地檢視當我們擴展安全資料時模型行為的演變，見 Table 36、37 和 38。總體而言，我們觀察到，使用更多安全資料後，Llama 2-Chat 對於不安全的提示變得更安全。

**Node ID:** caf5f81c-842f-46a4-b679-6be584bd6aff\
**Similarity:** 0.86168727941324**Text:** 我們透過收集人類偏好資料來進行 RLHF，這與第 3.2.2 節中用於安全性的資料收集類似：註釋者撰寫他們認為可能引發不安全行為的提示，然後比較多個模型對這些提示的回應，根據一套指南選出最安全的應答。接著，我們使用人類偏好資料來訓練一個安全獎勵模型（見第 3.2.2 節），並還會重複使用對抗性提示來在 RLHF 階段從模型中採樣。

更好的長尾安全性，而不會損害有用性

安全性本質上是一個長尾問題，挑戰來自少數非常特定的案例。我們透過採取兩個中間的 Llama 2-Chat 檢查點——一個在 RLHF 階段沒有對抗性提示，另一個則有——並使用我們的安全性與有用性獎勵模型對測試集上的回應進行評分。在圖 14 中，我們繪製了安全獎勵模型在安全測試集上的分數分佈偏移（左側）以及有用性獎勵模型在有用性測試集上的分數分佈偏移（右側）。在圖的左側，我們觀察到在 RLHF 安全調整後，安全獎勵模型分數在安全集上的分佈會轉向更高的獎勵分數，並且分佈在零點附近的長尾會變細。在左上角出現一個清晰的群集，這暗示了模型安全性的提升。在右側，我們在圖 14 的右側沒有觀察到在 $y = x$ 線以下的聚集模式，這表示在 RLHF 安全調整後，有用性分數分佈得以保持。換句話說，在有足夠的有用性訓練資料的情況下，增加一個額外的安全緩解階段不會對模型在有用性方面的表現造成任何顯著的下降。表 12 顯示了一個定性範例。

安全資料規模的影響

在先前的研究中（Bai et al., 2022a），觀察到 LLMs 的有用性與安全之間存在張力。為了更好地了解安全訓練資料的增加如何影響一般模型表現，特別是有用性，我們透過調整 RLHF 階段使用的安全資料量來研究安全資料規模的趨勢。

Node ID: d9893bef-a5a7-4248-a0a1-d7c28800ae59
Similarity: 0.8546977459150967
Text: 0 0.2 0.4 0.6 0.8 1.0 Helpfulness RM Score before Safety RLHF 0.0 0.2 0.4 0.6 0.8 1.0 Helpfulness RM Score after Safety RLHF 0 1000 0 1000 Figure 14: Impact of safety RLHF measured by reward model score distributions. Left: safety reward model scores of generations on the Meta Safety test set. The clustering of samples in the top left corner suggests the improvements of model safety.

```
for node in base_nodes:
    display_source_node(node, source_length=10000)
```

Node ID: 16328561-9ff7-4307-8d31-adf6bb74b71b
Similarity: 0.8770715326726375
Text: A qualitative example is shown in Table 12. Impact of Safety Data Scaling. A tension between helpfulness and safety of LLMs has been observed in previous studies (Bai et al., 2022a). To better understand how the addition of safety training data affects general model performance, especially helpfulness, we investigate the trends in safety data scaling by adjusting the amount of safety data used in the RLHF stage.

Node ID: e756d327-1a28-4228-ac38-f8a831b1bf77
Similarity: 0.8728111844788112
Text: A clear cluster appears on the top-left corner suggesting the improvements of model safety. On the right side, we do not observe any gathering pattern below the y = x line on the right hand side of Figure 14, which indicates that the helpfulness score distribution is preserved after safety tuning with RLHF. Put another way, given sufficient helpfulness training data, the addition of an additional stage of safety mitigation does not negatively impact model performance on helpfulness to any notable degradation. A qualitative example is shown in Table 12. Impact of Safety Data Scaling.

Node ID: d4d67180-71c8-4328-b3f1-1e98fa42ab69
Similarity: 0.8697379697028405**文本：** 我們也在表 35 中列出了兩個安全性和有用性獎勵模型不一致的定性範例。在第 4.2.3 節 A.4.2 定性結果關於安全資料縮放中，我們以量化方式研究將更多安全資料加入模型 RLHF 的影響。在這裡，我們展示了一些樣本，以定性地檢視當我們縮放安全資料時模型行為的演變，見表 36、37 和 38。總體而言，我們觀察到使用更多安全資料後，Llama 2-Chat 對於不安全的提示的反應變得更安全。

Node ID: d9893bef-a5a7-4248-a0a1-d7c28800ae59\
Similarity: 0.855087365309258\
Text: 0 0.2 0.4 0.6 0.8 1.0 Helpfulness RM Score before Safety RLHF 0.0 0.2 0.4 0.6 0.8 1.0 Helpfulness RM Score after Safety RLHF 0 1000 0 1000 Figure 14: Impact of safety RLHF measured by reward model score distributions. Left: safety reward model scores of generations on the Meta Safety test set. The clustering of samples in the top left corner suggests the improvements of model safety.

Node ID: d62ee107-9841-44b5-8b70-bc6487ad6315\
Similarity: 0.8492541852986794\
Text: Better Long-Tail Safety Robustness without Hurting Helpfulness Safety is inherently a long-tail problem, where the challenge comes from a small number of very specific cases. We investigate the impact of Safety RLHF by taking two intermediate Llama 2-Chat checkpoints—one without adversarial prompts in the RLHF stage and one with them—and score their responses on our test sets using our safety and helpfulness reward models.

Node ID: 312a63b3-5e28-4fbf-a3e1-4e8dc0c026ea\
Similarity: 0.8488371951811564\
Text: We conduct RLHF by first collecting human preference data for safety similar to Section 3.2.2: annotators write a prompt that they believe can elicit unsafe behavior, and then compare multiple model responses to the prompts, selecting the response that is safest according to a set of guidelines. We then use the human preference data to train a safety reward model (see Section 3.2.2), and also reuse the adversarial prompts to sample from the model during the RLHF stage.

## 插入查詢引擎

```
from llama_index.core.query_engine import RetrieverQueryEngine
```

```
query_engine = RetrieverQueryEngine.from_args(retriever)
base_query_engine = RetrieverQueryEngine.from_args(base_retriever)
```

```
response = query_engine.query(query_str)
```

```
> Merging 4 nodes into parent node.
> Parent node id: 3671b20d-ea5e-4afc-983e-02be6ee8302d.
> Parent node text: We conduct RLHF by first collecting human preference data for safety similar to Section 3.2.2: an...
```

```
print(str(response))
```

```
Adjusting the amount of safety data used in the RLHF stage could potentially have the following outcomes:
1. Improved model safety: Increasing the amount of safety data used in RLHF may lead to improvements in model safety. This means that the model becomes better at responding to unsafe prompts and avoids generating unsafe or harmful outputs.
2. Thinning out of the long tail of safety RM scores: Increasing the amount of safety data may result in a shift in the distribution of safety reward model (RM) scores towards higher reward scores. This means that the model becomes more consistent in generating safe responses and reduces the occurrence of low safety scores.
3. Preservation of helpfulness performance: Adjusting the amount of safety data used in RLHF is not expected to negatively impact model performance on helpfulness. This means that the model's ability to generate helpful responses is maintained even after incorporating additional safety training.
4. Gathering pattern in helpfulness RM scores: There is no observed gathering pattern below the y = x line in the distribution of helpfulness RM scores after safety tuning with RLHF. This suggests that the helpfulness score distribution is preserved, indicating that the model's helpfulness performance is not significantly degraded by the addition of safety mitigation measures.
Overall, adjusting the amount of safety data used in the RLHF stage aims to strike a balance between improving model safety without compromising its helpfulness performance.
```

```
base_response = base_query_engine.query(query_str)
```

```
print(str(base_response))
```

```
Adjusting the amount of safety data used in the RLHF stage could potentially lead to improvements in model safety. This can be observed by a clear cluster appearing on the top-left corner, suggesting enhanced model safety. Additionally, it is indicated that the helpfulness score distribution is preserved after safety tuning with RLHF, indicating that the addition of safety data does not negatively impact model performance on helpfulness.
```

## 評估

我們以更量化的方式評估分層的 retriever 與基準 retriever 的表現。

**警告**：這可能*昂貴*，特別是使用 GPT-4 時。請謹慎使用並調整樣本大小以符合您的預算。

```
from llama_index.core.evaluation import DatasetGenerator, QueryResponseDataset
from llama_index.llms.openai import OpenAI
import nest_asyncio


nest_asyncio.apply()
```

```
# NOTE: run this if the dataset isn't already saved
# Note: we only generate from the first 20 nodes, since the rest are references
eval_llm = OpenAI(model="gpt-4")
dataset_generator = DatasetGenerator(
    root_nodes[:20],
    llm=eval_llm,
    show_progress=True,
    num_questions_per_chunk=3,
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

我們對每個檢索器進行了評估：正確性 (correctness)、語義相似度 (semantic similarity)、相關性 (relevancy) 和忠實度 (faithfulness)。

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




from collections import defaultdict
import pandas as pd


# NOTE: can uncomment other evaluators
evaluator_c = CorrectnessEvaluator(llm=eval_llm)
evaluator_s = SemanticSimilarityEvaluator(llm=eval_llm)
evaluator_r = RelevancyEvaluator(llm=eval_llm)
evaluator_f = FaithfulnessEvaluator(llm=eval_llm)
# pairwise_evaluator = PairwiseComparisonEvaluator(llm=eval_llm)
```

```
from llama_index.core.evaluation.eval_utils import (
    get_responses,
    get_results_df,
)
from llama_index.core.evaluation import BatchEvalRunner
```

```
eval_qs = eval_dataset.questions
qr_pairs = eval_dataset.qr_pairs
ref_response_strs = [r for (_, r) in qr_pairs]
```

```
pred_responses = get_responses(eval_qs, query_engine, show_progress=True)
```

```
base_pred_responses = get_responses(
    eval_qs, base_query_engine, show_progress=True
)
```

```
100%|█████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 60/60 [00:07<00:00,  8.17it/s]
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
    "relevancy": evaluator_r,
    "semantic_similarity": evaluator_s,
}
batch_runner = BatchEvalRunner(evaluator_dict, workers=2, show_progress=True)
```

```
eval_results = await batch_runner.aevaluate_responses(
    eval_qs, responses=pred_responses, reference=ref_response_strs
)
```

```
base_eval_results = await batch_runner.aevaluate_responses(
    eval_qs, responses=base_pred_responses, reference=ref_response_strs
)
```

```
results_df = get_results_df(
    [eval_results, base_eval_results],
    ["Auto Merging Retriever", "Base Retriever"],
    ["correctness", "relevancy", "faithfulness", "semantic_similarity"],
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

| | 名稱 | 正確性 | 相關性 | 忠實度 | 語義\_相似度 |
| - | ---------------------- | ----------- | --------- | ------------ | -------------------- |
| 0 | Auto Merging Retriever | 4.266667 | 0.916667 | 0.95 | 0.962196 |
| 1 | Base Retriever | 4.208333 | 0.916667 | 0.95 | 0.960602 |

**分析**：結果大致相同。

讓我們也嘗試使用我們的成對評估來查看 GPT-4 傾向於選擇哪個答案。

```
batch_runner = BatchEvalRunner(
    {"pairwise": pairwise_evaluator}, workers=10, show_progress=True
)
```

```
pairwise_eval_results = await batch_runner.aevaluate_response_strs(
    eval_qs,
    response_strs=pred_response_strs,
    reference=base_pred_response_strs,
)
pairwise_score = np.array(
    [r.score for r in pairwise_eval_results["pairwise"]]
).mean()
```

```
pairwise_score
```

```
0.525
```

**分析**：成對比較分數是衡量候選答案（使用 auto-merging retriever）相較於基準答案（使用 base retriever）被選中的百分比。在這裡，我們看到它們大致相等。