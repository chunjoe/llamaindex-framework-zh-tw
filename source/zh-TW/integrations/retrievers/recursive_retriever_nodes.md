---
title: "Recursive Retriever + Node 參考"
---

本指南說明如何使用遞迴檢索來遍歷 node 關係並根據「references」擷取 nodes。

Node references 是一個強大的概念。在首次執行檢索時，您可能希望檢索 reference 而非原始文本。多個 reference 可能指向同一個 node。

在本指南中，我們探討 node references 的一些不同用法：

- **Chunk references**：不同 chunk 大小指向一個更大的 chunk
- **Metadata references**：Summaries + Generated Questions 指向一個更大的 chunk

```
%pip install llama-index-llms-openai
%pip install llama-index-readers-file
```

```
%load_ext autoreload
%autoreload 2
%env OPENAI_API_KEY=YOUR_OPENAI_KEY
```

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
!pip install llama-index pypdf
```

## Load Data + Setup

在本節中，我們下載 Llama 2 paper 並建立初始的 nodes（chunk size 1024）集合。

```
!mkdir -p 'data/'
!wget --user-agent "Mozilla" "https://arxiv.org/pdf/2307.09288.pdf" -O "data/llama2.pdf"
```

```
Will not apply HSTS. The HSTS database must be a regular and non-world-writable file.
ERROR: could not open HSTS store at '/home/loganm/.wget-hsts'. HSTS will be disabled.
--2024-01-01 11:13:01--  https://arxiv.org/pdf/2307.09288.pdf
Resolving arxiv.org (arxiv.org)... 151.101.3.42, 151.101.131.42, 151.101.67.42, ...
Connecting to arxiv.org (arxiv.org)|151.101.3.42|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 13661300 (13M) [application/pdf]
Saving to: ‘data/llama2.pdf’


data/llama2.pdf     100%[===================>]  13.03M  27.3MB/s    in 0.5s


2024-01-01 11:13:02 (27.3 MB/s) - ‘data/llama2.pdf’ saved [13661300/13661300]
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

## Baseline Retriever

定義一個 baseline retriever，它僅透過 embedding similarity 擷取 top-k 的原始文本 nodes。

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

**Node ID:** node-26\
**Similarity:** 0.8581930837671874\
**Text:** As LLMs are integrated and deployed, we look forward to continuing research that will amplify their potential for positive impact on these important social issues. 4.2 Safety Fine-Tuning 在本節中，我們描述了我們對 safety fine-tuning 的方法，包括 safety categories、annotation guidelines 以及我們用來緩解安全風險的技術。我們採用了類似於 Section 3 中描述的通用 fine-tuning 方法，但與安全問題相關的部分有所不同。具體來說，我們在 safety fine-tuning 中使用以下技術： 1. Supervised Safety Fine-Tuning：我們從收集對抗性 prompt 和安全示範開始，然後將它們納入一般監督式 fine-tuning 流程中（Section 3.1）。這教導模型在 RLHF 之前就與我們的安全指南保持一致，從而為高品質的人類偏好資料註釋奠定基礎。 2. Safety RLHF：隨後，我們將安全整合到 Section 3.2.2 中描述的通用 RLHF pipeline 中。這包括訓練一個特定於安全的 reward model，以及收集更具挑戰性的對抗性 prompt 進行 rejection sampling 樣式的 fine-tuning 和 PPO optimization。 3. SafetyContextDistillation：最後，我們使用 context distillation (Askell etal.,2021b) 來微調我們的 RLHF pipeline。這涉及透過在 prompt 前綴加上安全前綴，例如「You are a safe and responsible assistant」，然後在沒有前綴的情況下對模型進行更安全的回應進行微調，這本質上是蒸餾…

**Node ID:** node-33\
**Similarity:** 0.8442806881920294\
**Text:** 評估 prompt 和回應的範例可以在 Appendix A.4.6 中找到。然後我們請評審者使用五點 Likert scale 來判斷模型的安全違規情況，定義如下： •5- 沒有安全違規且非常有幫助 •4- 沒有安全違規且只有輕微的不安全問題 •3- 沒有安全違規但無幫助或有其他主要的非安全問題 •2- 輕微或中度的安全違規 29(a)Overall violation percentage. (b)Overall safety and helpfulness mean rating. Figure17: Overallsafetymeasures. Left: Llama 2-Chat haslowviolationpercentageoverallacrossmodel sizes.Right: Llama 2-Chat has high safety and helpfulness mean rating overall across model sizes. It is important to note that these results are subject to limitations of the prompt set, subjectivity of the review guidelines, and subjectivity of individual raters. •1- Severe safety violations We consider a rating of 1 or 2 as violation and use violation percentage as our main evaluation metric, with themeanratingasasupplement. Eachexampleisannotatedbythreeannotatorsandwetakethemajority votetodetermineiftheresponseisviolatingornot. WeusedGwet’sAC1/2statistictomeasureinter-rater reliability(IRR)asinthehelpfulnesshumanevaluation. TheIRRscoresrangefrom 0.70to0.95depending on the annotation batch, indicating a high degree of agreement among annotators on safety assessments. OnLlama 2-Chat annotations, the average IRR is 0.92according to Gwet’s AC2 measure. We see lower IRR scoresonbatcheswherethemo…

```
query_engine_base = RetrieverQueryEngine.from_args(base_retriever, llm=llm)
```

```
response = query_engine_base.query(
    "Can you tell me about the key concepts for safety finetuning"
)
print(str(response))
```

```
The key concepts for safety fine-tuning include supervised safety fine-tuning, safety RLHF (Reinforcement Learning from Human Feedback), and safety context distillation. In supervised safety fine-tuning, adversarial prompts and safe demonstrations are gathered and included in the general supervised fine-tuning process. This helps the model align with safety guidelines and lays the foundation for high-quality human preference data annotation. Safety RLHF involves integrating safety in the general RLHF pipeline, which includes training a safety-specific reward model and gathering more challenging adversarial prompts for rejection sampling style fine-tuning and PPO (Proximal Policy Optimization) optimization. Safety context distillation is the final step, where the RLHF pipeline is refined with context distillation. This involves generating safer model responses by prefixing a prompt with a safety preprompt and then fine-tuning the model on the safer responses without the preprompt.
```

## Chunk References: Smaller Child Chunks Referring to Bigger Parent Chunk

在這個使用範例中，我們將展示如何建立一個 較小 chunk 的圖表 指向較大的父級 chunk。

在查詢期間，我們會檢索較小的 chunks，但會追蹤至較大 chunks 的引用。這讓我們在合成時能擁有更多 context。

```
sub_chunk_sizes = [128, 256, 512]
sub_node_parsers = [
    SentenceSplitter(chunk_size=c, chunk_overlap=20) for c in sub_chunk_sizes
]


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
[1;3;34mRetrieving with query id None: Can you tell me about the key concepts for safety finetuning
[0m[1;3;38;5;200mRetrieved node with id, entering: node-26
[0m[1;3;34mRetrieving with query id node-26: Can you tell me about the key concepts for safety finetuning
[0m[1;3;38;5;200mRetrieved node with id, entering: node-1
[0m[1;3;34mRetrieving with query id node-1: Can you tell me about the key concepts for safety finetuning
[0m
```

**Node ID:** node-26\
**Similarity:** 0.8809071991986446\
**Text:** AsLLMsareintegratedanddeployed,welookforwardto continuing research that will amplify their potential for positive impact on these important social issues. 4.2 Safety Fine-Tuning In this section, we describe our approach to safety fine-tuning, including safety categories, annotation guidelines,andthetechniquesweusetomitigatesafetyrisks. Weemployaprocesssimilartothegeneral fine-tuning methods as described in Section 3, with some notable differences related to safety concerns. Specifically, we use the following techniques in safety fine-tuning: 1.Supervised Safety Fine-Tuning : We initialize by gathering adversarial prompts and safe demonstra- tions that are then included in the general supervised fine-tuning process (Section 3.1). This teaches themodeltoalignwithoursafetyguidelinesevenbeforeRLHF,andthuslaysthefoundationfor high-quality human preference data annotation. 2.Safety RLHF : Subsequently, we integrate safety in the general RLHF pipeline described in Sec- tion 3.2.2. This includes training a safety-specific reward model and gathering more challenging adversarial prompts for rejection sampling style fine-tuning and PPO optimization. 3.SafetyContextDistillation : Finally,werefineourRLHFpipelinewithcontextdistillation(Askell etal.,2021b). Thisinvolvesgeneratingsafermodelresponsesbyprefixingapromptwithasafety preprompt, e.g., “You are a safe and responsible assistant,” and then fine-tuning the model on the safer responses without the preprompt, which essentially distillsthe safety preprompt (context) into the model. Weuseatargetedapproachthatallowsoursafetyrewardmodeltochoosewhethertouse context distillation for each sample. 4.2.1 Safety Categories and Annotation Guidelines Based on limitations of LLMs known from prior work, we design instructions for our annotation team to createadversarialpromptsalongtwodimensions: a riskcategory ,orpotentialtopicaboutwhichtheLLM couldproduceunsafecontent;andan attackvector ,orquestionstyletocoverdifferentvarietiesofprompts …

**Node ID:** node-1\
**Similarity:** 0.8744334039911964\
**Text:** … … … … … … … … … … … … 9 3.2 Reinforcement Learning with Human Feedback (RLHF) … … … … … … … 9 3.3 System Message for Multi-Turn Consistency … … … … … … … … … . . 16 3.4 RLHF Results … … … … … … … … … … … … … … … . 17 4 Safety 20 4.1 Safety in Pretraining … … … … … … … … … … … … … … 20 4.2 Safety Fine-Tuning … … … … … … … … … … … … … … . 23 4.3 Red Teaming … … … … … … … … … … … … … … … . . 28 4.4 Safety Evaluation of Llama 2-Chat … … … … … … … … … … . 29 5 Discussion 32 5.1 Learnings and Observations … … … … … … … … … … … … . . 32 5.2 Limitations and Ethical Considerations … … … … … … … … … … . 34 5.3 Responsible Release Strategy … … … … … … … … … … … … . 35 6 Related Work 35 7 Conclusion 36 A Appendix 46 A.1 Contributions … … … … … … … … … … … … …

```
query_engine_chunk = RetrieverQueryEngine.from_args(retriever_chunk, llm=llm)
```

```
response = query_engine_chunk.query(
    "Can you tell me about the key concepts for safety finetuning"
)
print(str(response))
```

```
[1;3;34mRetrieving with query id None: Can you tell me about the key concepts for safety finetuning
[0m[1;3;38;5;200mRetrieved node with id, entering: node-26
[0m[1;3;34mRetrieving with query id node-26: Can you tell me about the key concepts for safety finetuning
[0m[1;3;38;5;200mRetrieved node with id, entering: node-1
[0m[1;3;34mRetrieving with query id node-1: Can you tell me about the key concepts for safety finetuning
[0mThe key concepts for safety fine-tuning include supervised safety fine-tuning, safety RLHF (Reinforcement Learning with Human Feedback), and safety context distillation. Supervised safety fine-tuning involves gathering adversarial prompts and safe demonstrations to teach the model to align with safety guidelines. Safety RLHF integrates safety into the general RLHF pipeline by training a safety-specific reward model and gathering challenging adversarial prompts for rejection sampling style fine-tuning and PPO optimization. Safety context distillation involves generating safer model responses by prefixing a prompt with a safety preprompt and fine-tuning the model on the safer responses without the preprompt. These techniques aim to mitigate safety risks and improve the model's ability to provide safe and responsible responses.
```

## Metadata References：Summaries + Generated Questions 參照至較大的 chunk

在這個使用範例中，我們展示如何定義引用來源 node 的額外上下文。

此額外上下文包含摘要以及生成的問題。

在查詢時，我們會檢索較小的區塊，但會遵循對較大區塊的引用。這使我們能夠有更多上下文進行綜合。

```
import nest_asyncio


nest_asyncio.apply()
```

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
node_to_metadata = {}
for extractor in extractors:
    metadata_dicts = extractor.extract(base_nodes)
    for node, metadata in zip(base_nodes, metadata_dicts):
        if node.node_id not in node_to_metadata:
            node_to_metadata[node.node_id] = metadata
        else:
            node_to_metadata[node.node_id].update(metadata)
```

```
100%|██████████| 93/93 [01:13<00:00,  1.27it/s]
100%|██████████| 93/93 [00:49<00:00,  1.88it/s]
```

```
# cache metadata dicts
def save_metadata_dicts(path, data):
    with open(path, "w") as fp:
        json.dump(data, fp)




def load_metadata_dicts(path):
    with open(path, "r") as fp:
        data = json.load(fp)
    return data
```

```
save_metadata_dicts("data/llama2_metadata_dicts.json", node_to_metadata)
```

```
metadata_dicts = load_metadata_dicts("data/llama2_metadata_dicts.json")
```

```
# all nodes consists of source nodes, along with metadata
import copy


all_nodes = copy.deepcopy(base_nodes)
for node_id, metadata in node_to_metadata.items():
    for val in metadata.values():
        all_nodes.append(IndexNode(text=val, index_id=node_id))
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
    verbose=False,
)
```

```
nodes = retriever_metadata.retrieve(
    "Can you tell me about the key concepts for safety finetuning"
)
for node in nodes:
    display_source_node(node, source_length=2000)
```

**Node ID:** node-26\
**Similarity:** 0.8727061238826861\
**Text:** 隨著LLMs被整合和部署，我們期待持續研究，以擴大它們對這些重要社會問題的積極影響。 4.2 Safety Fine-Tuning 在本節中，我們描述了我們進行安全微調的方法，包括安全類別、註解指南以及我們用來緩解安全風險的技術。我們採用了類似於第 3 節中描述的通用微調方法，但與安全問題相關的部分有所不同。具體來說，我們在安全微調中使用了以下技術： 1. Supervised Safety Fine-Tuning：我們從收集對抗性提示（adversarial prompts）和安全範例（safe demonstrations）開始，然後將它們納入通用的監督式微調過程（第 3.1 節）。這教導模型在 RLHF 之前就與我們的安全指南保持一致，從而為高品質的人類偏好資料註解奠定基礎。 2. Safety RLHF：隨後，我們將安全整合到第 3.2.2 節中描述的通用 RLHF 管線中。這包括訓練一個專門的安全獎勵模型，以及收集更具挑戰性的對抗性提示，用於拒絕採樣式微調（rejection sampling style fine-tuning）和 PPO 優化（PPO optimization）。 3. SafetyContextDistillation：最後，我們使用上下文蒸餾（context distillation）（Askell etal.,2021b）來微調我們的 RLHF 管線。這涉及透過在提示前加上一個安全提示（safety preprompt），例如「You are a safe and responsible assistant」，然後在沒有該提示的情況下對模型進行安全的回應微調，這本質上是將安全提示（上下文）蒸餾到模型中。我們採用了一種有針對性的方法，允許我們的安全獎勵模型為每個樣本選擇是否使用上下文蒸餾。 4.2.1 Safety Categories and Annotation Guidelines 根據先前工作所知的 LLMs 的限制，我們為註解團隊設計了用於創建對抗性提示的雙維度指令：一個風險類別（risk category），或關於 LLM 可能產生不安全內容的潛在主題（potential topic），以及一個攻擊向量（attack vector），或用於涵蓋不同類型提示的問題（questions）。

**Node ID:** node-26\
**Similarity:** 0.8586079224453517\**Text:** 像LLMs已經整合並部署，我們期待繼續進行研究，以擴大它們對這些重要社會議題的積極影響潛力。 4.2 Safety Fine-Tuning 在本節中，我們描述了我們對安全微調的方法，包括安全類別、註釋指南以及我們用來緩解安全風險的技術。我們採用了類似於第3節中所述的通用微調方法，但與安全問題相關的部分有所不同。具體來說，我們在安全微調中使用了以下技術： 1. Supervised Safety Fine-Tuning：我們從收集對抗性提示（adversarial prompts）和安全示範（safe demonstrations）開始，然後將它們納入通用的監督式微調過程（第3.1節）。這使模型在RLHF之前就能與我們的安全指南保持一致，從而為高品質的人類偏好資料註釋奠定基礎。 2. Safety RLHF：隨後，我們將安全整合到第3.2.2節中描述的通用RLHF流程中。這包括訓練一個特定於安全的獎勵模型，以及收集更具挑戰性的對抗性提示，用於拒絕採樣式微調和PPO優化。 3. SafetyContextDistillation：最後，我們使用上下文蒸餾（context distillation）（Askell etal.,2021b）來微調我們的RLHF流程。這涉及透過在提示前加上一個安全提示（safety preprompt），例如「You are a safe and responsible assistant」，然後在沒有前綴的情況下對模型進行更安全的響應微調，這本質上是將安全前綴（context）蒸餾到模型中。我們使用一種目標導向的方法，允許我們的安全獎勵模型為每個樣本選擇是否使用上下文蒸餾。 4.2.1 Safety Categories and Annotation Guidelines 基於LLMs先前工作的限制，我們為註釋團隊設計了用於創建對抗性提示的雙維度指令：一個風險類別（risk category），或關於LLM可能產生不安全內容的潛在主題（potential topic）；以及一個攻擊向量（attack vector），或用於覆蓋不同類型提示的問題（questions）……

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

```
The key concepts for safety fine-tuning include supervised safety fine-tuning, safety RLHF (Reinforcement Learning from Human Feedback), and safety context distillation. Supervised safety fine-tuning involves gathering adversarial prompts and safe demonstrations to train the model to align with safety guidelines. Safety RLHF integrates safety into the RLHF pipeline by training a safety-specific reward model and gathering challenging adversarial prompts for fine-tuning and optimization. Safety context distillation involves generating safer model responses by prefixing a prompt with a safety preprompt and fine-tuning the model on the safer responses without the preprompt. These concepts are used to mitigate safety risks and improve the model's ability to produce safe and helpful responses.
```

## 評估

我們評估我們遞迴檢索 + node 參考方法的有效性。我們同時評估區塊參考（chunk references）和元數據參考（metadata references）。我們使用嵌入相似度查找來檢索參考nodes。

我們將兩種方法與一個基準（baseline）進行比較，該基準是直接獲取原始nodes的retriever。

在指標方面，我們使用命中率（hit-rate）和MRR來評估。

### 資料集生成

我們首先從文本區塊的集合中生成一個問題資料集。

```
from llama_index.core.evaluation import (
    generate_question_context_pairs,
    EmbeddingQAFinetuneDataset,
)
from llama_index.llms.openai import OpenAI


import nest_asyncio


nest_asyncio.apply()
```

```
eval_dataset = generate_question_context_pairs(
    base_nodes, OpenAI(model="gpt-3.5-turbo")
)
```

```
100%|██████████| 93/93 [02:08<00:00,  1.38s/it]
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

我們對每個檢索器進行評估，以衡量命中率和MRR。

我們發現具有node參考（無論是區塊還是元數據）的檢索器，其表現通常優於檢索原始區塊。

```
import pandas as pd
from llama_index.core.evaluation import (
    RetrieverEvaluator,
    get_retrieval_results_df,
)


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

```
vector_retriever_chunk = vector_index_chunk.as_retriever(
    similarity_top_k=top_k
)
retriever_chunk = RecursiveRetriever(
    "vector",
    retriever_dict={"vector": vector_retriever_chunk},
    node_dict=all_nodes_dict,
    verbose=True,
)
retriever_evaluator = RetrieverEvaluator.from_metric_names(
    ["mrr", "hit_rate"], retriever=retriever_chunk
)
# try it out on an entire dataset
results_chunk = await retriever_evaluator.aevaluate_dataset(
    eval_dataset, show_progress=True
)
```

```
vector_retriever_metadata = vector_index_metadata.as_retriever(
    similarity_top_k=top_k
)
retriever_metadata = RecursiveRetriever(
    "vector",
    retriever_dict={"vector": vector_retriever_metadata},
    node_dict=all_nodes_dict,
    verbose=True,
)
retriever_evaluator = RetrieverEvaluator.from_metric_names(
    ["mrr", "hit_rate"], retriever=retriever_metadata
)
# try it out on an entire dataset
results_metadata = await retriever_evaluator.aevaluate_dataset(
    eval_dataset, show_progress=True
)
```

```
base_retriever = base_index.as_retriever(similarity_top_k=top_k)
retriever_evaluator = RetrieverEvaluator.from_metric_names(
    ["mrr", "hit_rate"], retriever=base_retriever
)
# try it out on an entire dataset
results_base = await retriever_evaluator.aevaluate_dataset(
    eval_dataset, show_progress=True
)
```

```
100%|██████████| 194/194 [00:09<00:00, 19.86it/s]
```

```
full_results_df = get_retrieval_results_df(
    [
        "Base Retriever",
        "Retriever (Chunk References)",
        "Retriever (Metadata References)",
    ],
    [results_base, results_chunk, results_metadata],
)
display(full_results_df)
```

```
.dataframe tbody tr th {
    vertical-align: top;
}


.dataframe thead th {
    text-align: right;
}
```

|   | 檢索器                      | hit\_rate | mrr      |
| - | ------------------------------- | --------- | -------- |
| 0 | Base Retriever                  | 0.778351  | 0.563103 |
| 1 | Retriever (Chunk References)    | 0.896907  | 0.691114 |
| 2 | Retriever (Metadata References) | 0.891753  | 0.718440 |