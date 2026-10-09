---
title: "隱私與安全性"
---

預設情況下，LlamaIndex 教程使用 OpenAI 的託管 API 進行 LLM 生成和嵌入，這意味著您的 documents 和查詢會離開您的機器。對於許多專案來說這是可以接受的：OpenAI、Anthropic、Cohere 及類似的供應商會發布資料處理政策，並提供具有更強數據保護條款的企業協議。對於數據不能離開您基礎設施的專案，LlamaIndex 可以在地運行完整的 RAG pipeline。

## 完全在地運行 LlamaIndex

完全在地化的堆疊看起來像這樣：

- LLM：如 llama.cpp、vLLM、Hugging Face Transformers 或 Ollama 等在地運行時。
- Embeddings：[`HuggingFaceEmbedding`](/python/framework/module_guides/models/embeddings/#local-embedding-models)，在您自己的硬體上運行任何 [Sentence Transformers](https://sbert.net/) 模型。
- Reranker (可選但推薦)：[`SentenceTransformerRerank`](/python/framework/module_guides/models/rerankers/)，一個在地運行的 cross-encoder，不需要 API key。
- Vector store：預設的 in-memory `SimpleVectorStore`（可選擇透過 `StorageContext.persist()` 持久化到磁碟）或像 Chroma、Qdrant、Postgres/pgvector 或 Milvus 這樣的自託管儲存。

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.ollama import Ollama
from llama_index.core.postprocessor import SentenceTransformerRerank


Settings.embed_model = HuggingFaceEmbedding(
    model_name="BAAI/bge-small-en-v1.5"
)
Settings.llm = Ollama(model="llama3.1", request_timeout=360.0)


documents = SimpleDirectoryReader("data").load_data()
index = VectorStoreIndex.from_documents(documents)


reranker = SentenceTransformerRerank(
    model="cross-encoder/ms-marco-MiniLM-L6-v2", top_n=3
)
query_engine = index.as_query_engine(
    similarity_top_k=10, node_postprocessors=[reranker]
)
```

沒有 API key，嵌入、重排序或檢索步驟沒有向外發送網路呼叫。

### 下一步

- [本地入門教學](/python/framework/getting_started/starter_example_local/)：使用 Ollama + Hugging Face embeddings 的逐步教學。
- [Fully-local RAG cookbook (Chroma + Ollama)](https://developers.llamaindex.ai/python/examples/cookbooks/local_rag_with_chroma_and_ollama/index.md)：帶有評估的持久化在地 pipeline。
- [使用本地 LLMs](/python/framework/module_guides/models/llms/local/)：在地 LLM 整合清單。
- [Embeddings：本地模型](/python/framework/module_guides/models/embeddings/#local-embedding-models)，包括針對僅 CPU 環境的 ONNX / OpenVINO 加速。

## 使用託管 API 的資料隱私

如果您使用託管的 LLM 或嵌入供應商，資料隱私受該供應商的條款約束。OpenAI、Anthropic、Cohere、Voyage 及類似的供應商都發布自己的政策並提供企業協議。LlamaIndex 本身不會儲存您的資料，但它會向您配置的任何供應商發送請求。

在完全在地化之外的常見緩解措施：

- 使用 Azure OpenAI、AWS Bedrock、Google Vertex AI 或類似的雲端服務，您已經有數據保護協議。
- 自託管嵌入和重排序步驟（它們很小），同時只將 LLM 呼叫託管。這通常是每單位努力最大的風險降低。
- 在透過 [`PIINodePostprocessor`](/python/framework/module_guides/querying/node_postprocessors/node_postprocessors/#beta-piinodepostprocessor) 索引之前，從 documents 中清除 PII。

## Vector store 隱私

LlamaIndex 與許多 vector store 整合，每個都有自己的資料處理政策。自託管選項（`SimpleVectorStore`、Chroma、Qdrant、Postgres/pgvector、Milvus、Weaviate 在在地運行時）將嵌入保留在您的基礎設施上。受管選項（Pinecone、託管的 Weaviate、Zilliz 等）將嵌入儲存在供應商的基礎設施上，並在該供應商的條款下。請參閱 [vector stores guide](/python/framework/module_guides/storing/vector_stores/) 以獲取完整清單。