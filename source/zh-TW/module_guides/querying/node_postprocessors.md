---
title: "Node 後處理器"
---

## 概念

Node postprocessors 是一組模組，它接收一組 nodes，並在返回它們之前套用某種轉換或過濾。

在 LlamaIndex 中，node postprocessors 最常在查詢引擎中應用，在 node 檢索步驟之後、回應合成步驟之前。

LlamaIndex 提供多種 node postprocessors 供立即使用，同時也提供一個簡單的 API 用於新增您自己的自訂 postprocessors。

提示

不確定 node postprocessor 在 RAG workflow 中的位置？請閱讀 [高層次概念](/python/framework/getting_started/concepts/)。

## 使用模式

以下是使用 node postprocessors 的範例：

```
from llama_index.core.postprocessor import SimilarityPostprocessor
from llama_index.postprocessor.cohere_rerank import CohereRerank
from llama_index.core.data_structs import Node
from llama_index.core.schema import NodeWithScore


nodes = [
    NodeWithScore(node=Node(text="text1"), score=0.7),
    NodeWithScore(node=Node(text="text2"), score=0.8),
]


# similarity postprocessor: filter nodes below 0.75 similarity score
processor = SimilarityPostprocessor(similarity_cutoff=0.75)
filtered_nodes = processor.postprocess_nodes(nodes)


# cohere rerank: rerank nodes given query using trained model
reranker = CohereRerank(api_key="<COHERE_API_KEY>", top_n=2)
reranker.postprocess_nodes(nodes, query_str="<user_query>")
```

請注意，`postprocess_nodes` 可以接收 `query_str` 或 `query_bundle` (`QueryBundle`)，但不能同時接收兩者。

## 使用模式

最常見的情況是，node-postprocessors 將在查詢引擎中使用，它們會應用於從 retriever 返回的 nodes，並在回應合成步驟之前。

## 與查詢引擎一起使用

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core.postprocessor import TimeWeightedPostprocessor


documents = SimpleDirectoryReader("./data").load_data()


index = VectorStoreIndex.from_documents(documents)


query_engine = index.as_query_engine(
    node_postprocessors=[
        TimeWeightedPostprocessor(
            time_decay=0.5, time_access_refresh=False, top_k=1
        )
    ]
)


# all node post-processors will be applied during each query
response = query_engine.query("query string")
```

## 與檢索到的 Nodes 一起使用

或者可作為一個獨立的物件來過濾檢索到的 nodes：

```
from llama_index.core.postprocessor import SimilarityPostprocessor


nodes = index.as_retriever().retrieve("test query str")


# filter nodes below 0.75 similarity score
processor = SimilarityPostprocessor(similarity_cutoff=0.75)
filtered_nodes = processor.postprocess_nodes(nodes)
```

## 與您自己的 nodes 一起使用

如您所注意，postprocessors 以 `NodeWithScore` 物件作為輸入，這只是一個包含 `Node` 和一個 `score` 值的包裝類別。

```
from llama_index.core.postprocessor import SimilarityPostprocessor
from llama_index.core.data_structs import Node
from llama_index.core.schema import NodeWithScore


nodes = [
    NodeWithScore(node=Node(text="text"), score=0.7),
    NodeWithScore(node=Node(text="text"), score=0.8),
]


# filter nodes below 0.75 similarity score
processor = SimilarityPostprocessor(similarity_cutoff=0.75)
filtered_nodes = processor.postprocess_nodes(nodes)
```

(custom-node-postprocessor)=

## 自訂 Node PostProcessor

基礎類別是 `BaseNodePostprocessor`，而 API interface 非常簡單：

```
class BaseNodePostprocessor:
    """Node postprocessor."""


    @abstractmethod
    def _postprocess_nodes(
        self, nodes: List[NodeWithScore], query_bundle: Optional[QueryBundle]
    ) -> List[NodeWithScore]:
        """Postprocess nodes."""
```

一個虛擬的 node-postprocessor 只需幾行程式碼即可實作：

```
from llama_index.core import QueryBundle
from llama_index.core.postprocessor.types import BaseNodePostprocessor
from llama_index.core.schema import NodeWithScore




class DummyNodePostprocessor(BaseNodePostprocessor):
    def _postprocess_nodes(
        self, nodes: List[NodeWithScore], query_bundle: Optional[QueryBundle]
    ) -> List[NodeWithScore]:
        # subtracts 1 from the score
        for n in nodes:
            n.score -= 1


        return nodes
```

## 模組

請參閱完整的 [modules list](/python/framework/module_guides/querying/node_postprocessors/node_postprocessors/) 以獲取更多詳細資訊。