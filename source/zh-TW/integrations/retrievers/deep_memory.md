---
title: "Activeloop Deep Memory"
---

**如何讓文件問答的 RAG hit\_rate 提升 15% 以上？**

檢索增強生成（RAG）近來受到廣泛關注。隨著進階 RAG 技術與代理陸續出現，RAG 能處理的應用也不斷擴大。不過，若要將 RAG 導入正式環境，仍有幾項挑戰需要考量；主要因素包括準確度（召回率）、成本與延遲。對於基本情境，將 OpenAI 的 Ada 模型搭配簡單的相似度搜尋，通常就能得到不錯的結果。若要提高搜尋的準確度或召回率，則可能需要採用進階檢索技術，例如調整資料區塊大小或多次改寫查詢，但這些做法也可能增加延遲與成本。[Activeloop](https://activeloop.ai/) 的 [Deep Memory](https://www.activeloop.ai/resources/use-deep-memory-to-boost-rag-apps-accuracy-by-up-to-22/) 是 Activeloop Deep Lake 使用者可使用的功能。它透過一個小型神經網路層，學習將使用者查詢與語料中的相關資料配對，以解決這些問題。這項功能在搜尋時只會增加極少延遲，卻能將檢索準確度提升最高 27%，同時維持低成本、易於使用，也不需要額外採用其他進階 RAG 技術。

```
%pip install llama-index-vector-stores-deeplake
%pip install llama-index-llms-openai
```

```
import nest_asyncio
import os
import getpass


nest_asyncio.apply()
```

```
!pip install deeplake beautifulsoup4 html2text tiktoken openai llama-index python-dotenv
```

本教學會解析 Deep Lake 文件，並建立一個能根據文件回答問題的 RAG 系統。

整個教學分為以下幾個部分：

1. [建立並上傳資料集](/python/framework/integrations/retrievers/deep_memory/#1-dataset-creation-and-ingestion)
2. [產生合成查詢並訓練 deep\_memory](/python/framework/integrations/retrievers/deep_memory/#2-training-deep-memory)
3. [評估 Deep Memory 效能](/python/framework/integrations/retrievers/deep_memory/#3-deepmemory-evaluation)
4. [Deep Memory 推論](/python/framework/integrations/retrievers/deep_memory/#4-deep-memory-inference)

[]()

## 1. 建立與匯入資料集

接著使用 BeautifulSoup 解析所有連結，並將內容轉換為 LlamaIndex 文件：

```
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin




def get_all_links(url):
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Failed to retrieve the page: {url}")
        return []


    soup = BeautifulSoup(response.content, "html.parser")


    # Finding all 'a' tags which typically contain href attribute for links
    links = [
        urljoin(url, a["href"])
        for a in soup.find_all("a", href=True)
        if a["href"]
    ]


    return links
```

```
from langchain.document_loaders import AsyncHtmlLoader
from langchain.document_transformers import Html2TextTransformer
from llama_index.core import Document




def load_documents(url):
    all_links = get_all_links(url)
    loader = AsyncHtmlLoader(all_links)
    docs = loader.load()


    html2text = Html2TextTransformer()
    docs_transformed = html2text.transform_documents(docs)
    docs = [Document.from_langchain_format(doc) for doc in docs_transformed]
    return docs




docs = load_documents("https://docs.deeplake.ai/en/latest/")
```

```
Fetching pages: 100%|##########| 120/120 [00:13<00:00,  8.70it/s]
```

```
len(docs)
```

```
120
```

```
from llama_index.core.evaluation import generate_question_context_pairs
from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
)
from llama_index.vector_stores.deeplake import DeepLakeVectorStore
from llama_index.core.node_parser import SimpleNodeParser
from llama_index.llms.openai import OpenAI




os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter your OpenAI API token: ")
# # activeloop token is needed if you are not signed in using CLI: `activeloop login -u <USERNAME> -p <PASSWORD>`
os.environ["ACTIVELOOP_TOKEN"] = getpass.getpass(
    "Enter your ActiveLoop API token: "
)  # Get your API token from https://app.activeloop.ai, click on your profile picture in the top right corner, and select "API Tokens"


token = os.getenv("ACTIVELOOP_TOKEN")


vector_store = DeepLakeVectorStore(
    dataset_path="hub://activeloop-test/deeplake_docs_deepmemory2",
    overwrite=False,  # set to True to overwrite the existing dataset
    runtime={"tensor_db": True},
    token=token,
)
```

```
Deep Lake Dataset in hub://activeloop-test/deeplake_docs_deepmemory2 already exists, loading from the storage
```

```
def create_modules(vector_store, docs=[], populate_vector_store=True):
    if populate_vector_store:
        node_parser = SimpleNodeParser.from_defaults(chunk_size=512)
        nodes = node_parser.get_nodes_from_documents(docs)
    else:
        nodes = []


    # by default, the node ids are set to random uuids. To ensure same id's per run, we manually set them.
    for idx, node in enumerate(nodes):
        node.id_ = f"node_{idx}"


    llm = OpenAI(model="gpt-4")
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    return storage_context, nodes, llm
```

```
(
    storage_context,
    nodes,
    llm,
) = create_modules(
    docs=docs,
    vector_store=vector_store,
    # populate_vector_store=False, # uncomment this line to skip populating the vector store
)
```

```
vector_index = VectorStoreIndex(nodes, storage_context=storage_context)
deep_memory_retriever = vector_index.as_retriever(
    similarity_top_k=4, deep_memory=True
)
```

[]()

## 2. 訓練 Deep Memory

![Deep Memory 架構示意圖](/assets/3ed6003f8c68.jpg)

上圖展示了 deep\_memory 的整體架構。訓練時需要相關性標註、查詢，以及作為查詢對象的語料資料。前一節已準備好語料；本節將產生問題與相關性標註。

1. `questions`：由字串組成，每個字串代表一個查詢。
2. `relevance`：記錄每個問題對應的標準答案（ground truth）。可能有多份文件包含問題的答案，因此 relevance 的型別是 List\[List\[tuple\[str, float]]]：外層清單對應查詢，內層清單列出相關文件。每個 tuple 由 str 和 float 組成；字串代表來源文件的 ID（對應資料集中的 id tensor），浮點數則表示該文件與問題的相關程度。

```
from llama_index.core.evaluation import (
    generate_question_context_pairs,
    EmbeddingQAFinetuneDataset,
)
import random




def create_train_test_datasets(
    number_of_samples=600, llm=None, nodes=None, save=False
):
    random_indices = random.sample(range(len(nodes)), number_of_samples)


    ratio = int(len(random_indices) * 0.8)


    train_indices = random_indices[:ratio]
    test_indices = random_indices[ratio:]


    train_nodes = [nodes[i] for i in train_indices]
    test_nodes = [nodes[i] for i in test_indices]


    train_qa_dataset = generate_question_context_pairs(
        train_nodes, llm=llm, num_questions_per_chunk=1
    )


    test_qa_dataset = generate_question_context_pairs(
        test_nodes, llm=llm, num_questions_per_chunk=1
    )


    # [optional] save
    if save:
        train_qa_dataset.save_json(
            f"deeplake_docs_{number_of_samples}_train.json"
        )
        test_qa_dataset.save_json(
            f"deeplake_docs_{number_of_samples}_test.json"
        )
    return train_qa_dataset, test_qa_dataset
```

```
train_qa_dataset, test_qa_dataset = create_train_test_datasets(
    number_of_samples=600, llm=llm, nodes=nodes, save=True
)
```

```
  4%|▍         | 19/480 [02:25<1:04:00,  8.33s/it]
```

```
train_qa_dataset = EmbeddingQAFinetuneDataset.from_json(
    "deeplake_docs_600_train.json"
)
test_qa_dataset = EmbeddingQAFinetuneDataset.from_json(
    "deeplake_docs_600_test.json"
)
```

```
def create_query_relevance(qa_dataset):
    """Function for converting llama-index dataset to correct format for deep memory training"""
    queries = [text for _, text in qa_dataset.queries.items()]
    relevant_docs = qa_dataset.relevant_docs
    relevance = []
    for doc in relevant_docs:
        relevance.append([(relevant_docs[doc][0], 1)])
    return queries, relevance
```

```
train_queries, train_relevance = create_query_relevance(train_qa_dataset)
test_queries, test_relevance = create_query_relevance(test_qa_dataset)
```

```
train_queries[:3]
```

```
['In the context of creating a bounding box tensor in a dataset, explain the significance of the "coords" argument and its keys "type" and "mode". What does the "type" key specify about the bounding box coordinates?',
 'Explain the process of creating an intrinsics tensor and appending intrinsics matrices in the context of computer vision. What are the dimensions of the intrinsics parameters and what do they represent? Also, describe the concept of a Segmentation Mask Htype and its role in image processing.',
 'In the context of querying for images in the MNIST Train Dataset using `ds.query`, what does the command "select * where labels == 0" signify and what is the expected output?']
```

```
train_relevance[:3]
```

```
[[('node_788', 1)], [('node_861', 1)], [('node_82', 1)]]
```

```
test_queries[:3]
```

```
['What are the steps to update the information of keypoints and connections in a tensor, and what types of data can be appended to keypoints?',
 'What is the command to create a mesh tensor in DeepLake and what are the supported compressions? Also, explain how to append a ply file containing mesh data to this tensor.',
 'What is a Sequence htype in the context of tensors and how does it function as a wrapper for other htypes? Provide examples.']
```

```
test_relevance[:3]
```

```
[[('node_933', 1)], [('node_671', 1)], [('node_471', 1)]]
```

```
from langchain.embeddings.openai import OpenAIEmbeddings


embeddings = OpenAIEmbeddings()




job_id = vector_store.vectorstore.deep_memory.train(
    queries=train_queries,
    relevance=train_relevance,
    embedding_function=embeddings.embed_documents,
)
```

```
Starting DeepMemory training job
Your Deep Lake dataset has been successfully created!








Preparing training data for deepmemory:




Creating 483 embeddings in 1 batches of size 483:: 100%|██████████| 1/1 [00:03<00:00,  3.67s/it]




DeepMemory training job started. Job ID: 65421a5003888c9ca36c72e8
```

```
vector_store.vectorstore.deep_memory.status(job_id)
```

```
This dataset can be visualized in Jupyter Notebook by ds.visualize() or at https://app.activeloop.ai/adilkhan/deeplake_docs_deepmemory2
--------------------------------------------------------------
|                  65421a5003888c9ca36c72e8                  |
--------------------------------------------------------------
| status                     | completed                     |
--------------------------------------------------------------
| progress                   | eta: 12.2 seconds             |
|                            | recall@10: 67.01% (+18.56%)   |
--------------------------------------------------------------
| results                    | recall@10: 67.01% (+18.56%)   |
--------------------------------------------------------------
```

[]()

## 3. DeepMemory 評估

訓練結果有顯著改善！接著在測試集上評估模型效能。

```
recalls = vector_store.vectorstore.deep_memory.evaluate(
    queries=test_queries,
    relevance=test_relevance,
    embedding_function=embeddings.embed_documents,
)
```

```
[37minfo [35mWed Nov  1 09:32:44 2023 GMT [0m        Added distance metric `deepmemory_distance`.
Embedding queries took 0.95 seconds
---- Evaluating without Deep Memory ----
Recall@1:    12.5%
Recall@3:    23.3%
Recall@5:    30.8%
Recall@10:    50.8%
Recall@50:    94.2%
Recall@100:    95.8%
---- Evaluating with Deep Memory ----
Recall@1:    11.7%
Recall@3:    27.5%
Recall@5:    40.8%
Recall@10:    65.0%
Recall@50:    96.7%
Recall@100:    98.3%
```

測試集上的召回率提升了 15%。接著使用 RetrieverEvaluator 檢視 MRR（平均倒數排名）與命中率。

```
import pandas as pd




def display_results(eval_results):
    """Display results from evaluate."""
    hit_rates = []
    mrrs = []
    names = []
    for name, eval_result in eval_results.items():
        metric_dicts = []
        for er in eval_result:
            metric_dict = er.metric_vals_dict
            metric_dicts.append(metric_dict)


        full_df = pd.DataFrame(metric_dicts)


        hit_rate = full_df["hit_rate"].mean()
        mrr = full_df["mrr"].mean()


        hit_rates.append(hit_rate)
        mrrs.append(mrr)
        names.append(name)


    metric_df = pd.DataFrame(
        [
            {"retrievers": names[i], "hit_rate": hit_rates[i], "mrr": mrrs[i]}
            for i in range(2)
        ],
    )


    return metric_df
```

評估使用 Deep Memory 時的檢索效能：

```
from llama_index.core.evaluation import RetrieverEvaluator


deep_memory_retriever = vector_index.as_retriever(
    similarity_top_k=10, vector_store_kwargs={"deep_memory": True}
)
dm_retriever_evaluator = RetrieverEvaluator.from_metric_names(
    ["mrr", "hit_rate"], retriever=deep_memory_retriever
)


dm_eval_results = await dm_retriever_evaluator.aevaluate_dataset(
    test_qa_dataset, retriever=dm_retriever_evaluator
)
```

```
from llama_index.core.evaluation import RetrieverEvaluator


naive_retriever = vector_index.as_retriever(similarity_top_k=10)
naive_retriever_evaluator = RetrieverEvaluator.from_metric_names(
    ["mrr", "hit_rate"], retriever=naive_retriever
)


naive_eval_results = await naive_retriever_evaluator.aevaluate_dataset(
    test_qa_dataset, retriever=naive_retriever
)
```

```
eval_results = {
    f"{mode} with Deep Memory top-10 eval": eval_result
    for mode, eval_result in zip(
        ["with", "without"], [dm_eval_results, naive_eval_results]
    )
}


display_results(eval_results)
```

```
.dataframe tbody tr th {
    vertical-align: top;
}


.dataframe thead th {
    text-align: right;
}
```

|   | retrievers                           | hit\_rate | mrr      |
| - | ------------------------------------ | --------- | -------- |
| 0 | with with Deep Memory top-10 eval    | 0.650000  | 0.244775 |
| 1 | 不使用 Deep Memory 進行 top-10 eval | 0.508333 | 0.215129 |

不僅 hit\_rate 增加，MRR 也增加了

[]()

## 4. Deep Memory 推論

```
query_engine = vector_index.as_query_engine(
    vector_store_kwargs={"deep_memory": True}, llm=llm
)
response = query_engine.query(
    "How can you connect your own storage to the deeplake?"
)
print(response)
```

```
[37minfo [35mWed Nov  1 11:37:33 2023 GMT [0m        Can't find any metric in the dataset.
You can connect your own storage to deeplake by using the `connect()` function in the deeplake API.
```

```
query_engine = vector_index.as_query_engine(
    vector_store_kwargs={"deep_memory": False}, llm=llm
)
response = query_engine.query(
    "How can you connect your own storage to the deeplake?"
)
print(response)
```

```
The context does not provide information on how to connect your own storage to Deep Lake.
```

根據觀察，若未使用 Deep Memory，模型可能因檢索到錯誤的上下文而產生不準確的回答。
