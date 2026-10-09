---
title: "嵌入 (Embeddings)"
---

## 概念

Embeddings 在 LlamaIndex 中用於使用複雜的數值表示來代表您的 documents。Embedding 模型以文字為輸入，回傳一長串數字，用來捕捉文字的語義。這些 embedding 模型經過訓練，以這種方式來表示文字，有助於啟用許多應用程式，包括搜尋！

從高層次來看，如果使用者詢問關於狗的問題，則該問題的 embedding 將與談論狗的文字高度相似。

在計算 embedding 之間的相似度時，有許多方法可供選擇（點積、cosine similarity 等）。預設情況下，LlamaIndex 在比較 embedding 時使用 cosine similarity。

有許多 embedding 模型可供選擇。預設情況下，LlamaIndex 使用 `text-embedding-ada-002` from OpenAI。我們也支援 Langchain [此處](https://python.langchain.com/docs/modules/data_connection/text_embedding/) 提供的任何 embedding 模型，以及提供一個易於擴展的 base class 以實作您自己的 embedding。

## 使用模式

在 LlamaIndex 中，最常見的情況是將 embedding 模型指定在 `Settings` 物件中，然後在 vector index 中使用它。該 embedding 模型將用於索引建構期間使用的 documents，以及稍後使用 query engine 進行的任何查詢的 embedding。您也可以針對每個 index 指定 embedding 模型。

如果您尚未安裝您的 embedding：

終端機視窗

```
pip install llama-index-embeddings-openai
```

然後：

```
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core import VectorStoreIndex
from llama_index.core import Settings


# changing the global default
Settings.embed_model = OpenAIEmbedding()


# local usage
embedding = OpenAIEmbedding().get_text_embedding("hello world")
embeddings = OpenAIEmbedding().get_text_embeddings(
    ["hello world", "hello world"]
)


# per-index
index = VectorStoreIndex.from_documents(documents, embed_model=embed_model)
```

為了節省成本，您可能希望使用本地模型。

終端機視窗

```
pip install llama-index-embeddings-huggingface
```

```
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core import Settings


Settings.embed_model = HuggingFaceEmbedding(
    model_name="BAAI/bge-small-en-v1.5"
)
```

這將使用 [Hugging Face](https://huggingface.co/models?library=sentence-transformers) 的高效且快速的預設模型。

您可以在下方找到更多使用細節和可用的自訂選項。

## 開始使用

embedding 模型最常見的使用方式是將其設定在全局 `Settings` 物件中，然後用它來建構 index 和查詢。輸入的 documents 將被分解成 nodes，並且 embedding 模型將為每個 node 生成一個 embedding。

如果您沒有設定 `Settings.embed_model`，LlamaIndex 將回退到 `OpenAIEmbedding` 的預設值 `text-embedding-ada-002`。下面的範例展示了如何明確設定當前的 OpenAI 模型。我們建議在新專案中這樣做。

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core import Settings


# global default: select a current OpenAI model explicitly
Settings.embed_model = OpenAIEmbedding(model="text-embedding-3-small")


documents = SimpleDirectoryReader("./data").load_data()


index = VectorStoreIndex.from_documents(documents)
```

然後，在查詢時，embedding 模型將再次用於為查詢文字生成 embedding。

```
query_engine = index.as_query_engine()


response = query_engine.query("query string")
```

## 選擇 embedding 模型

有許多 embedding 模型可供選擇。在撰寫本文時，每個常見場景的一個合理起點是：

- 無縫託管 API：`OpenAIEmbedding(model="text-embedding-3-small")`。無需託管模型，良好的通用品質。
- 本地運行，小且快速（約 22-33M 參數）：`HuggingFaceEmbedding("BAAI/bge-small-en-v1.5")` 或 `HuggingFaceEmbedding("sentence-transformers/all-MiniLM-L6-v2")`。
- 本地運行，中等大小，最新架構（約 150M 參數）：`HuggingFaceEmbedding("lightonai/DenseOn")`（2026 年 4 月發布）。相較於小型基準模型，是一個自然的升級，而無需承諾使用 0.6B+ 的模型。
- 本地運行，更強的準確性，多語言（約 0.6-4B 參數）：`HuggingFaceEmbedding("Qwen/Qwen3-Embedding-0.6B")`（或如果您有 VRAM，則為 `-4B`）。
- CPU-only 部署，對吞吐量敏感：使用上述任何本地選項並搭配 `backend="openvino"`；請參閱 [ONNX / OpenVINO section](/python/framework/module_guides/models/embeddings/#onnx-or-openvino-optimizations) 了解基準測試。

[MTEB leaderboard](https://huggingface.co/spaces/mteb/leaderboard) 是比較當前模型在準確性、速度和多語言支援方面的標準參考。

重要：如果您在索引後更改了您的 embedding 模型，則必須重新索引。不同模型的 embedding 是不可互換的。

## 自訂

### Batch Size

預設情況下，embedding 請求以 10 的批次發送到 OpenAI。對於某些使用者，這可能會（很少見地）導致速率限制。對於嵌入大量 documents 的其他使用者，此批次大小可能太小。

```
# set the batch size to 42
embed_model = OpenAIEmbedding(embed_batch_size=42)
```

### 本地 embedding 模型

使用本地模型的最簡單方法是使用 `llama-index-embeddings-huggingface` 中的 [`HuggingFaceEmbedding`](https://docs.llamaindex.ai/en/stable/api_reference/embeddings/huggingface/#llama_index.embeddings.huggingface.HuggingFaceEmbedding)：

```
# pip install llama-index-embeddings-huggingface
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core import Settings


Settings.embed_model = HuggingFaceEmbedding(
    model_name="BAAI/bge-small-en-v1.5"
)
```
哪個載入小型快速（~33M params）[BAAI/bge-small-en-v1.5](https://huggingface.co/BAAI/bge-small-en-v1.5) embedding model。您可以使用 [任何 Sentence Transformers embedding model from Hugging Face](https://huggingface.co/models?library=sentence-transformers)。瀏覽 [MTEB leaderboard](https://huggingface.co/spaces/mteb/leaderboard) 以比較目前的選項。

作為中等規模的升級（~150M params），[`lightonai/DenseOn`](https://huggingface.co/lightonai/DenseOn) 是 2026 年 4 月的發布，當小型基準模型不夠準確但您不想服務 0.6B+ 的模型時是一個好選擇：

```
Settings.embed_model = HuggingFaceEmbedding(model_name="lightonai/DenseOn")
```

為了更強的準確性和多語言覆蓋，切換為更大的現代模型，例如 [`Qwen/Qwen3-Embedding-0.6B`](https://huggingface.co/Qwen/Qwen3-Embedding-0.6B)（或對於單個 GPU 獲得更高準確性的 `Qwen/Qwen3-Embedding-4B`）：

```
Settings.embed_model = HuggingFaceEmbedding(
    model_name="Qwen/Qwen3-Embedding-0.6B"
)
```

除了 [`HuggingFaceEmbedding`](https://docs.llamaindex.ai/en/stable/api_reference/embeddings/huggingface/#llama_index.embeddings.huggingface.HuggingFaceEmbedding) 建構器中可用的關鍵字參數外，額外的關鍵字參數會傳遞給底層的 [`SentenceTransformer` instance](https://sbert.net/docs/package_reference/sentence_transformer/SentenceTransformer.html)，例如 `backend`、`model_kwargs`、`truncate_dim`、`revision` 等。

### ONNX 或 OpenVINO 優化

LlamaIndex 也支援使用 ONNX 或 OpenVINO 來加速本地推論，依賴於 [Sentence Transformers](https://sbert.net/) 和 [Optimum](https://huggingface.co/docs/optimum/index)。

一些先決條件：

終端機視窗

```
pip install llama-index-embeddings-huggingface
# Plus any of the following:
pip install optimum[onnxruntime-gpu] # For ONNX on GPUs
pip install optimum[onnxruntime]     # For ONNX on CPUs
pip install optimum-intel[openvino]  # For OpenVINO
```

指定模型和輸出路徑進行建立：

```
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core import Settings


Settings.embed_model = HuggingFaceEmbedding(
    model_name="BAAI/bge-small-en-v1.5",
    backend="onnx",  # or "openvino"
)
```

如果模型儲存庫中尚未包含 ONNX 或 OpenVINO 模型，則會使用 Optimum 自動轉換。請參閱 [Sentence Transformers documentation](https://sbert.net/docs/sentence_transformer/usage/efficiency.html#benchmarks) 以查看各種選項的基準測試結果。

如果我想使用優化或量化模型檢查點呢？

嵌入模型通常會有多個 ONNX 和/或 OpenVINO 檢查點，例如 [sentence-transformers/all-mpnet-base-v2](https://huggingface.co/sentence-transformers/all-mpnet-base-v2/tree/main) 具有 [2 OpenVINO checkpoints](https://huggingface.co/sentence-transformers/all-mpnet-base-v2/tree/main/openvino) 和 [9 ONNX checkpoints](https://huggingface.co/sentence-transformers/all-mpnet-base-v2/tree/main/onnx)。請參閱 [Sentence Transformers documentation](https://sbert.net/docs/sentence_transformer/usage/efficiency.html) 以了解這些選項及其預期性能的更多詳細資訊。

您可以指定一個 `file_name` 在 `model_kwargs` 參數中以載入特定的檢查點。例如，要從 `sentence-transformers/all-mpnet-base-v2` 模型儲存庫載入 `openvino/openvino_model_qint8_quantized.xml` 檢查點：

```
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core import Settings


quantized_model = HuggingFaceEmbedding(
    model_name="sentence-transformers/all-mpnet-base-v2",
    backend="openvino",
    device="cpu",
    model_kwargs={"file_name": "openvino/openvino_model_qint8_quantized.xml"},
)
Settings.embed_model = quantized_model
```

在 CPU 上應該使用哪個選項？

如 Sentence Transformers 基準測試所示，量化到 int8 的 OpenVINO (`openvino_model_qint8_quantized.xml`) 具有極高的性能，對準確性只產生微小的代價。如果您想確保結果完全一致，那麼基本的 `backend=“openvino”` 或 `backend=“onnx”` 可能會是最強的選項。

![CPU Backend Benchmark](/assets/6cbe377e4c51.png)

根據此查詢和這些 documents，使用 int8 量化的 OpenVINO 與預設的 Hugging Face 模型相比，獲得了以下結果：

```
query = "Which planet is known as the Red Planet?"
documents = [
    "Venus is often called Earth's twin because of its similar size and proximity.",
    "Mars, known for its reddish appearance, is often referred to as the Red Planet.",
    "Jupiter, the largest planet in our solar system, has a prominent red spot.",
    "Saturn, famous for its rings, is sometimes mistaken for the Red Planet.",
]
```

```
HuggingFaceEmbedding(device='cpu'):
- Average throughput: 38.20 queries/sec (over 5 runs)
- Query-document similarities tensor([[0.7783, 0.4654, 0.6919, 0.7010]])


HuggingFaceEmbedding(backend='openvino', device='cpu', model_kwargs={'file_name': 'openvino_model_qint8_quantized.xml'}):
- Average throughput: 266.08 queries/sec (over 5 runs)
- Query-document similarities tensor([[0.7492, 0.4623, 0.6606, 0.6556]])
```

在保持相同的 document 排名下，速度提升了 6.97 倍。

點擊查看重現腳本

```
import time
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core import Settings


quantized_model = HuggingFaceEmbedding(
    model_name="sentence-transformers/all-mpnet-base-v2",
    backend="openvino",
    device="cpu",
    model_kwargs={"file_name": "openvino/openvino_model_qint8_quantized.xml"},
)
quantized_model_desc = "HuggingFaceEmbedding(backend='openvino', device='cpu', model_kwargs={'file_name': 'openvino_model_qint8_quantized.xml'})"
baseline_model = HuggingFaceEmbedding(
    model_name="sentence-transformers/all-mpnet-base-v2",
    device="cpu",
)
baseline_model_desc = "HuggingFaceEmbedding(device='cpu')"


query = "Which planet is known as the Red Planet?"




def bench(model, query, description):
    for _ in range(3):
        model.get_agg_embedding_from_queries([query] * 32)


    sentences_per_second = []
    for _ in range(5):
        queries = [query] * 512
        start_time = time.time()
        model.get_agg_embedding_from_queries(queries)
        sentences_per_second.append(len(queries) / (time.time() - start_time))


    print(
        f"{description:<120}: Avg throughput: {sum(sentences_per_second) / len(sentences_per_second):.2f} queries/sec (over 5 runs)"
    )




bench(baseline_model, query, baseline_model_desc)
bench(quantized_model, query, quantized_model_desc)


# Example documents for similarity comparison. The first is the correct one, and the rest are distractors.
docs = [
    "Mars, known for its reddish appearance, is often referred to as the Red Planet.",
    "Venus is often called Earth's twin because of its similar size and proximity.",
    "Jupiter, the largest planet in our solar system, has a prominent red spot.",
    "Saturn, famous for its rings, is sometimes mistaken for the Red Planet.",
]


baseline_query_embedding = baseline_model.get_query_embedding(query)
baseline_doc_embeddings = baseline_model.get_text_embedding_batch(docs)


quantized_query_embedding = quantized_model.get_query_embedding(query)
quantized_doc_embeddings = quantized_model.get_text_embedding_batch(docs)


baseline_similarity = baseline_model._model.similarity(
    baseline_query_embedding, baseline_doc_embeddings
)
print(
    f"{baseline_model_desc:<120}: Query-document similarities {baseline_similarity}"
)
quantized_similarity = quantized_model._model.similarity(
    quantized_query_embedding, quantized_doc_embeddings
)
print(
    f"{quantized_model_desc:<120}: Query-document similarities {quantized_similarity}"
)
```

在 GPU 上應該使用哪個選項？

在 GPU 上，OpenVINO 並不特別引人注目，並且 ONNX 不一定比在預設 `torch` back end 運行量化模型表現更好。

![GPU Backend Benchmark](/assets/3a68e23f21fa.png)

這意味著您不需要額外的依賴項就能在 GPU 上獲得強大的加速，您只需在載入模型時使用較低的精度即可：

```
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core import Settings


Settings.embed_model = HuggingFaceEmbedding(
    model_name="BAAI/bge-small-en-v1.5",
    device="cuda",
    model_kwargs={"torch_dtype": "float16"},
)
```

如果我想要的模型沒有我想要的 back end、優化或量化呢？

[backend-export](https://huggingface.co/spaces/sentence-transformers/backend-export) Hugging Face Space 可用於將任何 Sentence Transformers 模型轉換為帶有量化或優化的 ONNX 或 OpenVINO。這將向模型儲存庫創建一個包含轉換後模型檔案的 pull request。然後您可以使用此模型在 LlamaIndex 中，像這樣指定 `revision` 參數：

```
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core import Settings


Settings.embed_model = HuggingFaceEmbedding(
    model_name="BAAI/bge-small-en-v1.5",
    backend="openvino",
    revision="refs/pr/16",  # for pull request 16: https://huggingface.co/BAAI/bge-small-en-v1.5/discussions/16
    model_kwargs={"file_name": "openvino_model_qint8_quantized.xml"},
)
```

### LangChain 整合

我們也支援 Langchain [此處](https://python.langchain.com/docs/modules/data_connection/text_embedding/) 提供的任何 embedding。

下面的範例使用 Langchain 的 embedding class 從 Hugging Face 載入一個模型。

```
pip install llama-index-embeddings-langchain
```

```
from langchain.embeddings.huggingface import HuggingFaceBgeEmbeddings
from llama_index.core import Settings


Settings.embed_model = HuggingFaceBgeEmbeddings(model_name="BAAI/bge-base-en")
```

### 自訂 Embedding Model如果您想使用 LlamaIndex 或 Langchain 不提供的 embeddings，您也可以擴展我們的 base embeddings class 並實作您自己的！

下面的範例使用了 Instructor Embeddings ([install/setup details here](https://huggingface.co/hkunlp/instructor-large))，並實作了一個自訂的 embeddings class。Instructor embeddings 的運作方式是提供文本，以及關於該文本嵌入領域的「指示」(instructions)。這在對非常特定和專業的主題的文本進行嵌入時非常有用。

```
from typing import Any, List
from InstructorEmbedding import INSTRUCTOR
from llama_index.core.embeddings import BaseEmbedding




class InstructorEmbeddings(BaseEmbedding):
    def __init__(
        self,
        instructor_model_name: str = "hkunlp/instructor-large",
        instruction: str = "Represent the Computer Science documentation or question:",
        **kwargs: Any,
    ) -> None:
        super().__init__(**kwargs)
        self._model = INSTRUCTOR(instructor_model_name)
        self._instruction = instruction


    def _get_query_embedding(self, query: str) -> List[float]:
        embeddings = self._model.encode([[self._instruction, query]])
        return embeddings[0]


    def _get_text_embedding(self, text: str) -> List[float]:
        embeddings = self._model.encode([[self._instruction, text]])
        return embeddings[0]


    def _get_text_embeddings(self, texts: List[str]) -> List[List[float]]:
        embeddings = self._model.encode(
            [[self._instruction, text] for text in texts]
        )
        return embeddings


    async def _aget_query_embedding(self, query: str) -> List[float]:
        return self._get_query_embedding(query)


    async def _aget_text_embedding(self, text: str) -> List[float]:
        return self._get_text_embedding(text)
```

## 單獨使用 (Standalone Usage)

您也可以將 embeddings 作為一個獨立模組用於您的專案、現有應用程式或一般測試和探索。

```
embeddings = embed_model.get_text_embedding(
    "It is raining cats and dogs here!"
)
```

## 支援的 embeddings 列表

LlamaIndex 與多種 embedding provider 整合：託管 API、自託管伺服器和本地模型。您也可以使用通過 LangChain 提供的任何東西，透過 LangChain 整合。

- [Anyscale](https://developers.llamaindex.ai/python/examples/embeddings/anyscale/index.md)
- [Azure OpenAI](https://developers.llamaindex.ai/python/examples/customization/llms/azureopenai/index.md)
- [Baseten](https://developers.llamaindex.ai/python/examples/embeddings/baseten/index.md)
- [Clarifai](https://developers.llamaindex.ai/python/examples/embeddings/clarifai/index.md)
- [Cohere](https://developers.llamaindex.ai/python/examples/embeddings/cohereai/index.md)
- [Custom](https://developers.llamaindex.ai/python/examples/embeddings/custom_embeddings/index.md)
- [Dashscope](https://developers.llamaindex.ai/python/examples/embeddings/dashscope_embeddings/index.md)
- [ElasticSearch](https://developers.llamaindex.ai/python/examples/embeddings/elasticsearch/index.md)
- [FastEmbed](https://developers.llamaindex.ai/python/examples/embeddings/fastembed/index.md)
- [Fireworks AI](https://developers.llamaindex.ai/python/examples/embeddings/fireworks/index.md)
- [Google PaLM](https://developers.llamaindex.ai/python/examples/embeddings/google_palm/index.md)
- [Hugging Face (local, Sentence Transformers)](https://developers.llamaindex.ai/python/examples/embeddings/huggingface/index.md)
- [JinaAI](https://developers.llamaindex.ai/python/examples/embeddings/jinaai_embeddings/index.md)
- [LangChain](https://developers.llamaindex.ai/python/examples/embeddings/langchain/index.md)
- [LLM Rails](https://developers.llamaindex.ai/python/examples/embeddings/llm_rails/index.md)
- [MistralAI](https://developers.llamaindex.ai/python/examples/embeddings/mistralai/index.md)
- [Nomic](https://developers.llamaindex.ai/python/examples/embeddings/nomic/index.md)
- [OpenAI](https://developers.llamaindex.ai/python/examples/embeddings/openai/index.md)
- [Sagemaker](https://developers.llamaindex.ai/python/examples/embeddings/sagemaker_embedding_endpoint/index.md)
- [Text Embeddings Inference](https://developers.llamaindex.ai/python/examples/embeddings/text_embedding_inference/index.md)
- [TogetherAI](https://developers.llamaindex.ai/python/examples/embeddings/together/index.md)
- [Upstage](https://developers.llamaindex.ai/python/examples/embeddings/upstage/index.md)
- [VoyageAI](https://developers.llamaindex.ai/python/examples/embeddings/voyageai/index.md)