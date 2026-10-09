---
title: "LlamaParse (原為 LlamaCloud)"
---

LlamaParse 是由 LlamaIndex 團隊提供的託管 document 平台：包含 Parse (agentic OCR)、Extract (依您的 schema 提取結構化資料)、Classify、Split 以及 Index (託管的 ingestion 與 retrieval)。它能為您的 LLM 應用程式提供生產等級的資料，並可作為 readers、indexes 和 retrievers 整合至此框架中。

該平台先前稱為 LlamaCloud。`llama-cloud` 套件、`LlamaCloud` client 以及 `LLAMA_CLOUD_API_KEY` 變數維持原名；較舊的 `llama-parse` 與 `llama-cloud-services` 套件已棄用，請改用 `llama-cloud` 2.x。

## Resources

- [LlamaParse documentation](https://developers.llamaindex.ai/llamaparse/index.md)
- [Sign up for LlamaParse](https://cloud.llamaindex.ai/) 以取得 API key
- [Parse](https://developers.llamaindex.ai/llamaparse/parse/index.md)、[Extract](https://developers.llamaindex.ai/llamaparse/extract/index.md)、[Classify](https://developers.llamaindex.ai/llamaparse/classify/index.md)、[Split](https://developers.llamaindex.ai/llamaparse/split/index.md) 與 [Index](https://developers.llamaindex.ai/llamaparse/cloud-index-v2/getting_started/index.md) 文件
- [Using LlamaParse from this framework](/python/framework/#when-the-documents-get-hard)
- [`LlamaCloudIndex`](/python/framework/module_guides/indexing/llama_cloud_index/)，適用於早期版本 Index 的整合方案