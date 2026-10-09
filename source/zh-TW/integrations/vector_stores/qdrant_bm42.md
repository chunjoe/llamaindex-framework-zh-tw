---
title: "混合搜尋 with Qdrant BM42"
---

Qdrant 最近發布了用於稀疏嵌入的輕量級方法，[BM42](https://qdrant.tech/articles/bm42/)。

在本文中，我們將介紹如何使用 llama-index 搭配 BM42 進行高效的混合搜尋。

## 設定

首先，我們需要安裝一些套件

- `llama-index`
- `llama-index-vector-stores-qdrant`
- `fastembed` 或 `fastembed-gpu`

如果安裝了提供的函式庫，`llama-index` 將會自動在 GPU 上運行 fastembed 模型。請參閱他們的 [完整安裝指南](https://qdrant.github.io/fastembed/examples/FastEmbed_GPU/)。

```
%pip install llama-index llama-index-vector-stores-qdrant fastembed
```

## (可選) 測試 fastembed 套件

為了確認安裝是否成功（以及確認是否使用了 GPU），我們可以運行以下程式碼。

這會先將模型下載（並快取），然後進行嵌入。

```
from fastembed import SparseTextEmbedding


model = SparseTextEmbedding(
    model_name="Qdrant/bm42-all-minilm-l6-v2-attentions",
    # if using fastembed-gpu with cuda+onnx installed
    # providers=["CudaExecutionProvider"],
)


embeddings = model.embed(["hello world", "goodbye world"])


indices, values = zip(
    *[
        (embedding.indices.tolist(), embedding.values.tolist())
        for embedding in embeddings
    ]
)


print(indices[0], values[0])
```

```
Fetching 6 files:   0%|          | 0/6 [00:00<?, ?it/s]




[613153351, 74040069] [0.3703993395381275, 0.3338314745830077]
```

## 建構我們的混合索引

在 llama-index 中，我們只需幾行程式碼就能建構一個混合索引。

如果您過去使用 splade 進行混合搜尋，您會注意到這快得多！

### 載入資料

在這裡，我們使用 `llama-parse` 讀取 Llama2 論文！使用 JSON 的 result mode，我們可以取得關於每個頁面的詳細資料，包括版面和圖片。目前，我們將使用頁碼和文字。

您可以透過造訪 <https://cloud.llamaindex.ai> 獲取一個免費的 api 金鑰用於 `llama-parse`。

```
!mkdir -p 'data/'
!wget --user-agent "Mozilla" "https://arxiv.org/pdf/2307.09288.pdf" -O "data/llama2.pdf"
```

```
import nest_asyncio


nest_asyncio.apply()
```

```
from llama_parse import LlamaParse
from llama_index.core import Document


parser = LlamaParse(result_type="text", api_key="llx-...")


# get per-page results, along with detailed layout info and metadata
json_data = parser.get_json_result("data/llama2.pdf")


documents = []
for document_json in json_data:
    for page in document_json["pages"]:
        documents.append(
            Document(text=page["text"], metadata={"page_number": page["page"]})
        )
```

```
Started parsing the file under job_id cac11eca-4058-4a89-a94a-5603dea3d851
```

### 建構索引 /w Qdrant

使用我們的 nodes，我們可以利用 Qdrant 和 BM42 來建構我們的索引！

在此情況下，Qdrant 託管在一個 docker container 中。

您可以拉取最新版本：

```
docker pull qdrant/qdrant
```

然後啟動：

```
docker run -p 6333:6333 -p 6334:6334 \
    -v $(pwd)/qdrant_storage:/qdrant/storage:z \
    qdrant/qdrant
```

```
import qdrant_client
from llama_index.vector_stores.qdrant import QdrantVectorStore


client = qdrant_client.QdrantClient("http://localhost:6333")
aclient = qdrant_client.AsyncQdrantClient("http://localhost:6333")


# delete collection if it exists
if client.collection_exists("llama2_bm42"):
    client.delete_collection("llama2_bm42")


vector_store = QdrantVectorStore(
    collection_name="llama2_bm42",
    client=client,
    aclient=aclient,
    fastembed_sparse_model="Qdrant/bm42-all-minilm-l6-v2-attentions",
)
```

```
Both client and aclient are provided. If using `:memory:` mode, the data between clients is not synced.
```

```
from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.embeddings.openai import OpenAIEmbedding


storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents,
    # our dense embedding model
    embed_model=OpenAIEmbedding(
        model_name="text-embedding-3-small", api_key="sk-proj-..."
    ),
    storage_context=storage_context,
)
```

如我們所見，密集嵌入和稀疏嵌入都生成得非常快！

儘管稀疏模型在 CPU 上本地運行，但它非常小且快速。

## 測試索引

利用稀疏嵌入的強大功能，我們可以查詢非常特定的事實，並取得正確的資料。

```
from llama_index.llms.openai import OpenAI


chat_engine = index.as_chat_engine(
    chat_mode="condense_plus_context",
    llm=OpenAI(model="gpt-4o", api_key="sk-proj-..."),
)
```

```
response = chat_engine.chat("What training hardware was used for Llama2?")
print(str(response))
```

```
The training hardware for Llama 2 included Meta’s Research Super Cluster (RSC) and internal production clusters. Both clusters utilized NVIDIA A100 GPUs. There were two key differences between these clusters:


1. **Interconnect Type**:
   - RSC used NVIDIA Quantum InfiniBand.
   - The internal production cluster used a RoCE (RDMA over Converged Ethernet) solution based on commodity Ethernet switches.


2. **Per-GPU Power Consumption Cap**:
   - RSC had a power consumption cap of 400W per GPU.
   - The internal production cluster had a power consumption cap of 350W per GPU.


This setup allowed for a comparison of the suitability of these different types of interconnects for large-scale training.
```

```
response = chat_engine.chat("What is the main idea of Llama2?")
print(str(response))
```

```
The main idea of Llama 2 is to provide an updated and improved version of the original Llama model, designed to be more efficient, scalable, and safe for various applications, including research and commercial use. Here are the key aspects of Llama 2:


1. **Enhanced Pretraining**: Llama 2 is trained on a new mix of publicly available data, with a 40% increase in the size of the pretraining corpus compared to Llama 1. This aims to improve the model's performance and knowledge base.


2. **Improved Architecture**: The model incorporates several architectural enhancements, such as increased context length and grouped-query attention (GQA), to improve inference scalability and overall performance.


3. **Safety and Responsiveness**: Llama 2-Chat, a fine-tuned version of Llama 2, is optimized for dialogue use cases. It undergoes supervised fine-tuning and iterative refinement using Reinforcement Learning with Human Feedback (RLHF) to ensure safer and more helpful interactions.


4. **Open Release**: Meta is releasing Llama 2 models with 7B, 13B, and 70B parameters to the general public for research and commercial use, promoting transparency and collaboration in the AI community.


5. **Responsible Use**: The release includes guidelines and code examples to facilitate the safe deployment of Llama 2 and Llama 2-Chat, emphasizing the importance of safety testing and tuning tailored to specific applications.


Overall, Llama 2 aims to be a more robust, scalable, and safer large language model that can be widely used and further developed by the AI community.
```

```
response = chat_engine.chat("What was Llama2 evaluated and compared against?")
print(str(response))
```

```
Llama 2 was evaluated and compared against several other models, both open-source and closed-source, across a variety of benchmarks. Here are the key comparisons:


### Open-Source Models:
1. **Llama 1**: Llama 2 models were compared to their predecessors, Llama 1 models. For example, Llama 2 70B showed improvements of approximately 5 points on MMLU and 8 points on BBH compared to Llama 1 65B.
2. **MPT Models**: Llama 2 7B and 30B models outperformed MPT models of corresponding sizes in all categories except code benchmarks.
3. **Falcon Models**: Llama 2 7B and 34B models outperformed Falcon 7B and 40B models across all benchmark categories.


### Closed-Source Models:
1. **GPT-3.5**: Llama 2 70B was compared to GPT-3.5, showing close performance on MMLU and GSM8K but a significant gap on coding benchmarks.
2. **PaLM (540B)**: Llama 2 70B performed on par or better than PaLM (540B) on almost all benchmarks.
3. **GPT-4 and PaLM-2-L**: There remains a large performance gap between Llama 2 70B and these more advanced models.


### Benchmarks:
Llama 2 was evaluated on a variety of benchmarks, including:
1. **MMLU (Massive Multitask Language Understanding)**: Evaluated in a 5-shot setting.
2. **BBH (Big Bench Hard)**: Evaluated in a 3-shot setting.
3. **AGI Eval**: Evaluated in 3-5 shot settings, focusing on English tasks.
4. **GSM8K**: For math problem-solving.
5. **Human-Eval and MBPP**: For code generation.
6. **NaturalQuestions and TriviaQA**: For world knowledge.
7. **SQUAD and QUAC**: For reading comprehension.
8. **BoolQ, PIQA, SIQA, Hella-Swag, ARC-e, ARC-c, NQ, TQA**: Various other benchmarks for different aspects of language understanding and reasoning.


These evaluations demonstrate that Llama 2 models generally outperform their predecessors and other open-source models, while also being competitive with some of the leading closed-source models.
```

## 從現有儲存中載入

有了您建立的 vector index，我們可以輕鬆地連接回去！

```
import qdrant_client
from llama_index.core import VectorStoreIndex
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.vector_stores.qdrant import QdrantVectorStore


client = qdrant_client.QdrantClient("http://localhost:6333")
aclient = qdrant_client.AsyncQdrantClient("http://localhost:6333")


# delete collection if it exists
if client.collection_exists("llama2_bm42"):
    client.delete_collection("llama2_bm42")


vector_store = QdrantVectorStore(
    collection_name="llama2_bm42",
    client=client,
    aclient=aclient,
    fastembed_sparse_model="Qdrant/bm42-all-minilm-l6-v2-attentions",
)


loaded_index = VectorStoreIndex.from_vector_store(
    vector_store,
    embed_model=OpenAIEmbedding(
        model="text-embedding-3-small", api_key="sk-proj-..."
    ),
)
```
