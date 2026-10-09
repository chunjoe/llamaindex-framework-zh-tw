---
title: "Qdrant 混合搜尋"
---

Qdrant 支援透過結合來自 `sparse` 和 `dense` 向量的搜尋結果來進行混合搜尋。

`dense` 向量是您可能已經使用過的——來自 OpenAI、BGE、SentenceTransformers 等的 embedding models 通常是 `dense` embedding models。它們會為一段文字建立一個數值表示，以一長串數字的形式呈現。這些 `dense` 向量可以捕捉整個文本的豐富語義。

`sparse` 向量則有所不同。它們使用專門的方法或模型（TF-IDF、BM25、SPLADE 等）來生成向量。這些向量通常大部分是零，因此它們是 `sparse` 向量。這些 `sparse` 向量擅長捕捉特定的關鍵字和相似的細節。

本筆筆記將帶您設定和自訂使用 Huggingface 中的 Qdrant 和 `"prithvida/Splade_PP_en_v1"` 變體進行混合搜尋。

## 設定

首先，我們設定環境並載入資料。

```
%pip install -U llama-index llama-index-vector-stores-qdrant fastembed
```

```
import os


os.environ["OPENAI_API_KEY"] = "sk-..."
```

```
!mkdir -p 'data/'
!wget --user-agent "Mozilla" "https://arxiv.org/pdf/2307.09288.pdf" -O "data/llama2.pdf"
```

```
from llama_index.core import SimpleDirectoryReader


documents = SimpleDirectoryReader("./data/").load_data()
```


## 資料索引

現在，我們可以對資料進行索引。

必須從一開始就啟用使用 Qdrant 的混合搜尋——我們只需設定 `enable_hybrid=True` 即可。

這將使用 fastembed 透過 `"prithvida/Splade_PP_en_v1"` 進行本地稀疏向量生成，同時生成帶有 OpenAI 的密集向量。

```
from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.core import Settings
from llama_index.vector_stores.qdrant import QdrantVectorStore
from qdrant_client import QdrantClient, AsyncQdrantClient


# creates a persistant index to disk
client = QdrantClient(host="localhost", port=6333)
aclient = AsyncQdrantClient(host="localhost", port=6333)


# create our vector store with hybrid indexing enabled
# batch_size controls how many nodes are encoded with sparse vectors at once
vector_store = QdrantVectorStore(
    "llama2_paper",
    client=client,
    aclient=aclient,
    enable_hybrid=True,
    fastembed_sparse_model="Qdrant/bm25",
    batch_size=20,
)


storage_context = StorageContext.from_defaults(vector_store=vector_store)
Settings.chunk_size = 512


index = VectorStoreIndex.from_documents(
    documents,
    storage_context=storage_context,
)
```


## 混合查詢

在混合模式下查詢時，我們可以分別設定 `similarity_top_k` 和 `sparse_top_k`。

`sparse_top_k` 表示從每個密集和稀疏查詢中將檢索多少個 nodes。例如，如果設定了 `sparse_top_k=5`，這意味著我將使用稀疏向量檢索 5 個 nodes，並使用密集向量檢索 5 個 nodes。

`similarity_top_k` 控制最終返回的 nodes 數量。在上述設定中，我們最終得到 10 個 nodes。會應用一個融合演算法來對來自不同向量空間的 nodes 進行排序和排序（在此情況下是 [relative score fusion](https://weaviate.io/blog/hybrid-search-fusion-algorithms#relative-score-fusion)）。`similarity_top_k=2` 表示融合後返回前兩個 nodes。

```
query_engine = index.as_query_engine(
    similarity_top_k=2, sparse_top_k=12, vector_store_query_mode="hybrid"
)
```

```
from IPython.display import display, Markdown


response = query_engine.query(
    "How was Llama2 specifically trained differently from Llama1?"
)


display(Markdown(str(response)))
```


Llama 2 與 Llama 1 的訓練方式有所不同，透過進行更穩健的資料清理、更新資料組合、在多出 40% 的總 token 上進行訓練、將上下文長度加倍，以及使用 grouped-query attention (GQA) 來提高大型模型的推理可擴展性等修改。此外，Llama 2 採用了 Llama 1 大多預訓練的設定和模型架構，但加入了如增加上下文長度和 grouped-query attention 等架構增強。

```
print(len(response.source_nodes))
```

```
2
```

讓我們與完全不使用混合搜尋進行比較！

```
from IPython.display import display, Markdown


query_engine = index.as_query_engine(
    similarity_top_k=2,
    # sparse_top_k=10,
    # vector_store_query_mode="hybrid"
)


response = query_engine.query(
    "How was Llama2 specifically trained differently from Llama1?"
)
display(Markdown(str(response)))
```

Llama 2 與 Llama 1 的訓練方式有所不同，透過進行修改來提高性能，例如進行更穩健的資料清理、更新資料組合、在多出 40% 的總 token 上進行訓練、將上下文長度加倍，以及使用 grouped-query attention (GQA) 來提高大型模型的推理可擴展性。

### 異步支援

當然，異步查詢也受到支援（請注意，記憶體中的 Qdrant 資料不會在異步和同步客戶端之間共享！）。

```
import nest_asyncio


nest_asyncio.apply()
```

```
from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.core import Settings
from llama_index.vector_stores.qdrant import QdrantVectorStore




# create our vector store with hybrid indexing enabled
vector_store = QdrantVectorStore(
    collection_name="llama2_paper",
    client=client,
    aclient=aclient,
    enable_hybrid=True,
    fastembed_sparse_model="Qdrant/bm25",
    batch_size=20,
)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
Settings.chunk_size = 512


index = VectorStoreIndex.from_documents(
    documents,
    storage_context=storage_context,
    use_async=True,
)


query_engine = index.as_query_engine(similarity_top_k=2, sparse_top_k=10)


response = await query_engine.aquery(
    "What baseline models are measured against in the paper?"
)
```


## \[進階] 使用 Qdrant 自訂混合搜尋

在本節中，我們將介紹各種可用的 settings，可用於完全自訂混合搜尋體驗。

### 自訂稀疏向量生成

稀疏向量生成可以單獨使用一個模型，或者有時為查詢和 documents 使用不同的獨立模型。在這裡我們使用兩個——`"naver/efficient-splade-VI-BT-large-doc"` 和 `"naver/efficient-splade-VI-BT-large-query"`。

以下是生成稀疏向量的範例程式碼以及如何在 constructor 中設定功能的程式碼。您可以將此用於需要時進行自訂。

```
from typing import Any, List, Tuple
import torch
from transformers import AutoTokenizer, AutoModelForMaskedLM


doc_tokenizer = AutoTokenizer.from_pretrained(
    "naver/efficient-splade-VI-BT-large-doc"
)
doc_model = AutoModelForMaskedLM.from_pretrained(
    "naver/efficient-splade-VI-BT-large-doc"
)


query_tokenizer = AutoTokenizer.from_pretrained(
    "naver/efficient-splade-VI-BT-large-query"
)
query_model = AutoModelForMaskedLM.from_pretrained(
    "naver/efficient-splade-VI-BT-large-query"
)




def sparse_doc_vectors(
    texts: List[str],
) -> Tuple[List[List[int]], List[List[float]]]:
    """
    Computes vectors from logits and attention mask using ReLU, log, and max operations.
    """
    tokens = doc_tokenizer(
        texts, truncation=True, padding=True, return_tensors="pt"
    )
    if torch.cuda.is_available():
        tokens = tokens.to("cuda")


    output = doc_model(**tokens)
    logits, attention_mask = output.logits, tokens.attention_mask
    relu_log = torch.log(1 + torch.relu(logits))
    weighted_log = relu_log * attention_mask.unsqueeze(-1)
    tvecs, _ = torch.max(weighted_log, dim=1)


    # extract the vectors that are non-zero and their indices
    indices = []
    vecs = []
    for batch in tvecs:
        indices.append(batch.nonzero(as_tuple=True)[0].tolist())
        vecs.append(batch[indices[-1]].tolist())


    return indices, vecs




def sparse_query_vectors(
    texts: List[str],
) -> Tuple[List[List[int]], List[List[float]]]:
    """
    Computes vectors from logits and attention mask using ReLU, log, and max operations.
    """
    # TODO: compute sparse vectors in batches if max length is exceeded
    tokens = query_tokenizer(
        texts, truncation=True, padding=True, return_tensors="pt"
    )
    if torch.cuda.is_available():
        tokens = tokens.to("cuda")


    output = query_model(**tokens)
    logits, attention_mask = output.logits, tokens.attention_mask
    relu_log = torch.log(1 + torch.relu(logits))
    weighted_log = relu_log * attention_mask.unsqueeze(-1)
    tvecs, _ = torch.max(weighted_log, dim=1)


    # extract the vectors that are non-zero and their indices
    indices = []
    vecs = []
    for batch in tvecs:
        indices.append(batch.nonzero(as_tuple=True)[0].tolist())
        vecs.append(batch[indices[-1]].tolist())


    return indices, vecs
```

```
vector_store = QdrantVectorStore(
    "llama2_paper",
    client=client,
    enable_hybrid=True,
    sparse_doc_fn=sparse_doc_vectors,
    sparse_query_fn=sparse_query_vectors,
)
```


### 自訂 `hybrid_fusion_fn()`

預設情況下，當使用 Qdrant 運行 hbyrid 查詢時，會使用 Relative Score Fusion 來組合來自稀疏和密集查詢的 nodes。您可以自訂此函式為任何其他方法（例如 plain deduplication、Reciprocal Rank Fusion 等）。

以下是我們相對分數融合方法的預設程式碼以及如何將其傳遞給 constructor。

```
from llama_index.core.vector_stores import VectorStoreQueryResult




def relative_score_fusion(
    dense_result: VectorStoreQueryResult,
    sparse_result: VectorStoreQueryResult,
    alpha: float = 0.5,  # passed in from the query engine
    top_k: int = 2,  # passed in from the query engine i.e. similarity_top_k
) -> VectorStoreQueryResult:
    """
    Fuse dense and sparse results using relative score fusion.
    """
    # sanity check
    assert dense_result.nodes is not None
    assert dense_result.similarities is not None
    assert sparse_result.nodes is not None
    assert sparse_result.similarities is not None


    # deconstruct results
    sparse_result_tuples = list(
        zip(sparse_result.similarities, sparse_result.nodes)
    )
    sparse_result_tuples.sort(key=lambda x: x[0], reverse=True)


    dense_result_tuples = list(
        zip(dense_result.similarities, dense_result.nodes)
    )
    dense_result_tuples.sort(key=lambda x: x[0], reverse=True)


    # track nodes in both results
    all_nodes_dict = {x.node_id: x for x in dense_result.nodes}
    for node in sparse_result.nodes:
        if node.node_id not in all_nodes_dict:
            all_nodes_dict[node.node_id] = node


    # normalize sparse similarities from 0 to 1
    sparse_similarities = [x[0] for x in sparse_result_tuples]
    max_sparse_sim = max(sparse_similarities)
    min_sparse_sim = min(sparse_similarities)
    sparse_similarities = [
        (x - min_sparse_sim) / (max_sparse_sim - min_sparse_sim)
        for x in sparse_similarities
    ]
    sparse_per_node = {
        sparse_result_tuples[i][1].node_id: x
        for i, x in enumerate(sparse_similarities)
    }


    # normalize dense similarities from 0 to 1
    dense_similarities = [x[0] for x in dense_result_tuples]
    max_dense_sim = max(dense_similarities)
    min_dense_sim = min(dense_similarities)
    dense_similarities = [
        (x - min_dense_sim) / (max_dense_sim - min_dense_sim)
        for x in dense_similarities
    ]
    dense_per_node = {
        dense_result_tuples[i][1].node_id: x
        for i, x in enumerate(dense_similarities)
    }


    # fuse the scores
    fused_similarities = []
    for node_id in all_nodes_dict:
        sparse_sim = sparse_per_node.get(node_id, 0)
        dense_sim = dense_per_node.get(node_id, 0)
        fused_sim = alpha * (sparse_sim + dense_sim)
        fused_similarities.append((fused_sim, all_nodes_dict[node_id]))


    fused_similarities.sort(key=lambda x: x[0], reverse=True)
    fused_similarities = fused_similarities[:top_k]


    # create final response object
    return VectorStoreQueryResult(
        nodes=[x[1] for x in fused_similarities],
        similarities=[x[0] for x in fused_similarities],
        ids=[x[1].node_id for x in fused_similarities],
    )
```

```
vector_store = QdrantVectorStore(
    "llama2_paper",
    client=client,
    enable_hybrid=True,
    hybrid_fusion_fn=relative_score_fusion,
)
```

您可能注意到上述函式中的 alpha 參數。此參數可以直接在 `as_query_engine()` 呼叫中設定，它會設定在 vector index retriever 中。

```
index.as_query_engine(alpha=0.5, similarity_top_k=2)
```

### 自訂 Hybrid Qdrant Collections

您也可以預先設定您的 Qdrant hybrid collections，而不是讓 llama-index 處理。

**注意：** 如果建立 hybrid index，vector config 的名稱必須是 `text-dense` 和 `text-sparse`。

```
from qdrant_client import models


client.recreate_collection(
    collection_name="llama2_paper",
    vectors_config={
        "text-dense": models.VectorParams(
            size=1536,  # openai vector size
            distance=models.Distance.COSINE,
        )
    },
    sparse_vectors_config={
        "text-sparse": models.SparseVectorParams(
            index=models.SparseIndexParams()
        )
    },
)


# enable hybrid since we created a sparse collection
vector_store = QdrantVectorStore(
    collection_name="llama2_paper", client=client, enable_hybrid=True
)
```
