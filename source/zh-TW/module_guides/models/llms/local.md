---
title: "使用本地模型"
---

LlamaIndex 可以完全在本地模型上運行。當您不想將資料傳送給託管的 API、需要離線工作，或希望成本可預測時，這非常有用。典型的完全本地堆疊如下：

- LLM：llama.cpp、vLLM、Hugging Face Transformers 或 Ollama。
- Embeddings：[`HuggingFaceEmbedding`](/python/framework/module_guides/models/embeddings/#local-embedding-models)，它可以在本地運行任何 [Sentence Transformers](https://sbert.net/) 模型（可選在 CPU 上啟用 ONNX / OpenVINO 加速）。
- Reranker (可選)：[`SentenceTransformerRerank`](/python/framework/module_guides/models/rerankers/) 搭配像 `cross-encoder/ms-marco-MiniLM-L6-v2` 或 `Qwen/Qwen3-Reranker-0.6B` 這樣的 cross-encoder。
- Vector store：預設的 `SimpleVectorStore`（持久化到磁碟），或任何自託管整合（Chroma、Qdrant、Postgres/pgvector、Milvus 等）。

## 最快速路徑

遵循 [local 入門教學](/python/framework/getting_started/starter_example_local/)，該教學會引導您安裝 Ollama、`llama-index-llms-ollama` 和 `llama-index-embeddings-huggingface`，然後建立一個完整的本地 RAG pipeline。

如需一個由 Chroma 支援的持久化本地堆疊，請參閱 [fully-local RAG cookbook](https://developers.llamaindex.ai/python/examples/cookbooks/local_rag_with_chroma_and_ollama/index.md)。

## 可用的本地 LLM 整合

LlamaIndex 通過多個整合套件支援本地 LLMs：

- `llama-index-llms-llama-cpp`：直接的 llama.cpp bindings。
- `llama-index-llms-huggingface`：Hugging Face Transformers（來自 Hub 的任何 causal LM）。
- `llama-index-llms-vllm`：用於高吞吐量自託管服務的 vLLM。
- `llama-index-llms-openai-like`：任何暴露 OpenAI-compatible API 的伺服器（text-generation-webui、LM Studio、vLLM 等）。
- `llama-index-llms-ollama`：Ollama（llama3、mistral、qwen 等）。

瀏覽 [LLM 整合完整清單](/python/framework/module_guides/models/llms/modules/)。