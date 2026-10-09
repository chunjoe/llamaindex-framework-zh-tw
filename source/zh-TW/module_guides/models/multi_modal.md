---
title: "多模態模型"
---

## 概念

大型語言模型 (LLMs) 是文字輸入、文字輸出。大型多模態模型 (LMMs) 將此擴展到超越文字的模態。例如，像 GPT-4V 這樣的模型允許您同時輸入圖像和文字，並輸出文字。

我們包含了一個基礎的 `MultiModalLLM` 抽象層，以允許文字+圖像模型。**注意**：此命名可能會更改！

## 使用模式

1. 以下程式碼片段展示了如何開始使用 LMMs，例如使用 GPT-4V。

```
from llama_index.multi_modal_llms.openai import OpenAIMultiModal
from llama_index.core.multi_modal_llms.generic_utils import load_image_urls
from llama_index.core import SimpleDirectoryReader


# load image documents from urls
image_documents = load_image_urls(image_urls)


# load image documents from local directory
image_documents = SimpleDirectoryReader(local_directory).load_data()


# non-streaming
openai_mm_llm = OpenAIMultiModal(
    model="gpt-4-vision-preview", api_key=OPENAI_API_KEY, max_new_tokens=300
)
response = openai_mm_llm.complete(
    prompt="what is in the image?", image_documents=image_documents
)
```

2. 以下程式碼片段展示了如何建立 MultiModal Vector Stores/Index。

```
from llama_index.core.indices import MultiModalVectorStoreIndex
from llama_index.vector_stores.qdrant import QdrantVectorStore
from llama_index.core import SimpleDirectoryReader, StorageContext


import qdrant_client
from llama_index.core import SimpleDirectoryReader


# Create a local Qdrant vector store
client = qdrant_client.QdrantClient(path="qdrant_mm_db")


# if you only need image_store for image retrieval,
# you can remove text_store
text_store = QdrantVectorStore(
    client=client, collection_name="text_collection"
)
image_store = QdrantVectorStore(
    client=client, collection_name="image_collection"
)


storage_context = StorageContext.from_defaults(
    vector_store=text_store, image_store=image_store
)


# Load text and image documents from local folder
documents = SimpleDirectoryReader("./data_folder/").load_data()
# Create the MultiModal index
index = MultiModalVectorStoreIndex.from_documents(
    documents,
    storage_context=storage_context,
)
```

3. 以下程式碼片段展示了如何使用 MultiModal Retriever 和 Query Engine。

```
from llama_index.multi_modal_llms.openai import OpenAIMultiModal
from llama_index.core import PromptTemplate
from llama_index.core.query_engine import SimpleMultiModalQueryEngine


retriever_engine = index.as_retriever(
    similarity_top_k=3, image_similarity_top_k=3
)


# retrieve more information from the GPT4V response
retrieval_results = retriever_engine.retrieve(response)


# if you only need image retrieval without text retrieval
# you can use `text_to_image_retrieve`
# retrieval_results = retriever_engine.text_to_image_retrieve(response)


qa_tmpl_str = (
    "Context information is below.\n"
    "---------------------\n"
    "{context_str}\n"
    "---------------------\n"
    "Given the context information and not prior knowledge, "
    "answer the query.\n"
    "Query: {query_str}\n"
    "Answer: "
)
qa_tmpl = PromptTemplate(qa_tmpl_str)


query_engine = index.as_query_engine(
    multi_modal_llm=openai_mm_llm, text_qa_template=qa_tmpl
)


query_str = "Tell me more about the Porsche"
response = query_engine.query(query_str)
```

**圖例**

- ✅ = 應能正常運作
- ⚠️ = 有時不可靠，可能需要更多調整才能改進
- 🛑 = 目前不可用。

### 端到端多模態工作流程

下表嘗試展示使用各種 LlamaIndex 功能來建立您自己的 Multi-Modal RAG（檢索增強生成）的**初始**步驟。您可以組合不同的模組/步驟來組成您自己的 Multi-Modal RAG 編排。

| 查詢類型 | MultiModal Vector Store/Index 的資料來源 | MultiModal Embedding | Retriever | Query Engine | Output Data Type |
| ---------- | ---------------------------------------------- | --------------------------------- | ------------------------------------------- | --------------------- | ------------------------------------ |
| Text ✅     | Text ✅                                         | Text ✅                            | Top-k retrieval ✅ Simple Fusion retrieval ✅ | Simple Query Engine ✅ | Retrieved Text ✅ Generated Text ✅    |
| Image ✅    | Image ✅                                        | Image ✅ Image to Text Embedding ✅ | Top-k retrieval ✅ Simple Fusion retrieval ✅ | Simple Query Engine ✅ | Retrieved Image ✅ Generated Image 🛑 |
| Audio 🛑   | Audio 🛑                                       | Audio 🛑                          | 🛑                                          | 🛑                    | Audio 🛑                             |
| Video 🛑   | Video 🛑                                       | Video 🛑                          | 🛑                                          | 🛑                    | Video 🛑                             |

### 多模態 LLM 模型

這些 Notebook 提供了如何利用和整合 Multi-Modal LLM 模型、Multi-Modal embeddings、Multi-Modal vector stores、Retriever、用於組成 Multi-Modal Retrieval Augmented Generation (RAG) 編排的 Query engine 的範例。

| Multi-Modal Vision Models                                                                 | Single Image Reasoning | Multiple Images Reasoning | Image Embeddings | Simple Query Engine | Pydantic Structured Output |
| ----------------------------------------------------------------------------------------- | ---------------------- | ------------------------- | ---------------- | ------------------- | -------------------------- |
| [GPT4V](https://developers.llamaindex.ai/python/examples/multi_modal/gpt4v_multi_modal_retrieval/index.md) (OpenAI API)   | ✅                      | ✅                         | 🛑               | ✅                   | ✅                          |
| [GPT4V-Azure](https://developers.llamaindex.ai/python/examples/multi_modal/azure_openai_multi_modal/index.md) (Azure API) | ✅                      | ✅                         | 🛑               | ✅                   | ✅                          |
| [Gemini](https://developers.llamaindex.ai/python/examples/multi_modal/gemini/index.md) (Google)                           | ✅                      | ✅                         | 🛑               | ✅                   | ✅                          |
| [CLIP](https://developers.llamaindex.ai/python/examples/multi_modal/image_to_image_retrieval/index.md) (Local host)       | 🛑                     | 🛑                        | ✅                | 🛑                  | 🛑                         |
| [LLaVa](https://developers.llamaindex.ai/python/examples/multi_modal/llava_multi_modal_tesla_10q/index.md) (replicate)    | ✅                      | 🛑                        | 🛑               | ✅                   | ⚠️                         || [Fuyu-8B](https://developers.llamaindex.ai/python/examples/multi_modal/replicate_multi_modal/index.md) (replicate)        | ✅                      | 🛑                        | 🛑               | ✅                   | ⚠️                         |
| [ImageBind ](https://imagebind.metademolab.com/)\[To integrate]                           | 🛑                     | 🛑                        | ✅                | 🛑                  | 🛑                         |
| [MiniGPT-4 ](https://developers.llamaindex.ai/python/examples/multi_modal/replicate_multi_modal/index.md)                 | ✅                      | 🛑                        | 🛑               | ✅                   | ⚠️                         |
| [CogVLM ](https://github.com/THUDM/CogVLM)                                                | ✅                      | 🛑                        | 🛑               | ✅                   | ⚠️                         |
| [Qwen-VL ](https://arxiv.org/abs/2308.12966)\[To integrate]                               | ✅                      | 🛑                        | 🛑               | ✅                   | ⚠️                         |

### Multi Modal Vector Stores

下表列出了一些 vector stores 支援 Multi-Modal 使用案例。 Our LlamaIndex 內建 `MultiModalVectorStoreIndex` 支援建立獨立的 vector stores 用於影像與文字 embedding vector stores. `MultiModalRetriever`，以及 `SimpleMultiModalQueryEngine` 支援文字對文字/圖片以及圖片對圖片的檢索與 簡單排序 用於 fusion 函數的 結合文字與影像檢索 結果。

| Multi-Modal Vector Stores                                                                                               | Single Vector Store | Multiple Vector Stores | Text Embedding                                      | Image Embedding                                    |
| ----------------------------------------------------------------------------------------------------------------------- | ------------------- | ---------------------- | --------------------------------------------------- | -------------------------------------------------- |
| [LLamaIndex self-built MultiModal Index](https://developers.llamaindex.ai/python/examples/multi_modal/gpt4v_multi_modal_retrieval/index.md)             | 🛑                  | ✅                      | Can be arbitrary text embedding (Default is GPT3.5) | Can be arbitrary Image embedding (Default is CLIP) |
| [Chroma](https://developers.llamaindex.ai/python/examples/multi_modal/chromamultimodaldemo/index.md)                                                    | ✅                   | 🛑                     | CLIP ✅                                              | CLIP ✅                                             |
| [Weaviate](https://weaviate.io/developers/weaviate/modules/retriever-vectorizer-modules/multi2vec-bind) \[To integrate] | ✅                   | 🛑                     | CLIP ✅ ImageBind ✅                                  | CLIP ✅ ImageBind ✅                                 |

## Multi-Modal LLM Modules

我們支援與 GPT4-V、Anthropic (Opus, Sonnet)、Gemini (Google)、CLIP (OpenAI)、BLIP (Salesforce) 以及 Replicate (LLaVA, Fuyu-8B, MiniGPT-4, CogVLM) 等更多模型的整合。

- [OpenAI](https://developers.llamaindex.ai/python/examples/multi_modal/openai_multi_modal/index.md)
- [Gemini](https://developers.llamaindex.ai/python/examples/multi_modal/gemini/index.md)
- [Anthropic](https://developers.llamaindex.ai/python/examples/multi_modal/anthropic_multi_modal/index.md)
- [Replicate](https://developers.llamaindex.ai/python/examples/multi_modal/replicate_multi_modal/index.md)
- [Pydantic Multi-Modal](https://developers.llamaindex.ai/python/examples/multi_modal/multi_modal_pydantic/index.md)
- [GPT-4v COT Experiments](https://developers.llamaindex.ai/python/examples/multi_modal/gpt4v_experiments_cot/index.md)
- [Llava Tesla 10q](https://developers.llamaindex.ai/python/examples/multi_modal/llava_multi_modal_tesla_10q/index.md)

## Multi-Modal Retrieval Augmented Generation

我們支援 Multi-Modal Retrieval Augmented Generation 具有不同的 Multi-Modal LLMs with Multi-Modal vector stores.

- [GPT-4v Retrieval](https://developers.llamaindex.ai/python/examples/multi_modal/gpt4v_multi_modal_retrieval/index.md)
- [Multi-Modal Retrieval](https://developers.llamaindex.ai/python/examples/multi_modal/multi_modal_retrieval/index.md)
- [Image-to-Image Retrieval](https://developers.llamaindex.ai/python/examples/multi_modal/image_to_image_retrieval/index.md)
- [Chroma Multi-Modal](https://developers.llamaindex.ai/python/examples/multi_modal/chromamultimodaldemo/index.md)

## Evaluation

我們支援針對以下項目的基礎評估： Multi-Modal LLM 以及 Retrieval 增強生成

- [Multi-Modal RAG Eval](https://developers.llamaindex.ai/python/examples/evaluation/multi_modal/multi_modal_rag_evaluation/index.md)
