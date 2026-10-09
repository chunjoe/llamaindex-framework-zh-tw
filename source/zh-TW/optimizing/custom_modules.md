---
title: "撰寫自訂模組"
---

LlamaIndex 的核心設計原則是**幾乎所有核心模組都可以透過 subclassing 進行自定義**。

這讓您能將 LlamaIndex 應用於任何進階的 LLM 使用情境，突破預設模組的功能限制。您可以針對特定模組編寫任意 amount 的自定義程式碼，同時仍能利用底層的 abstraction 並將該模組與其他元件整合。

我們提供了便捷且有引導的 subclassing 方式，讓您在撰寫自定義邏輯時，不必擔心定義所有 boilerplate（例如 [callbacks](/python/framework/module_guides/observability/callbacks/)）。

本指南彙整了在 LlamaIndex 中編寫自定義模組的所有資源，請參閱下方內容 👇

## Custom LLMs

- [Custom LLMs](/python/framework/module_guides/models/llms/usage_custom/)

## 自訂 Embeddings

- [Custom Embedding Model](/python/framework/module_guides/models/embeddings/#custom-embedding-model)

## 自訂輸出解析器

- [Custom Output Parsers](https://developers.llamaindex.ai/python/examples/output_parsing/llm_program/index.md)

## 自訂轉換

- [Custom Transformations](/python/framework/module_guides/loading/ingestion_pipeline/transformations/#custom-transformations)
- [Custom Property Graph Extractors](/python/framework/module_guides/indexing/lpg_index_guide/#sub-classing-extractors)

## 自訂 Retriever

- [Custom Retrievers](https://developers.llamaindex.ai/python/examples/query_engine/customretrievers/index.md)
- [Custom Property Graph Retrievers](/python/framework/module_guides/indexing/lpg_index_guide/#sub-classing-retrievers)

## 自訂後處理器/Rerankers

- [Custom Node Postprocessor](/python/framework/optimizing/custom_modules/#custom-postprocessorsrerankers)

## Custom Query Engines

- [Custom Query Engine](https://developers.llamaindex.ai/python/examples/query_engine/custom_query_engine/index.md)

## Custom Agents

- [Custom Function Calling Agent](https://developers.llamaindex.ai/python/examples/workflow/function_calling_agent/index.md)
- [Custom ReAct Agent](https://developers.llamaindex.ai/python/examples/workflow/react_agent/index.md)

## 其他 Customization 方式 

部分模組可以在 workflows 中進行深度自定義，但並非透過 subclassing（而是透過我們提供的參數或 function）。相關說明請參閱以下指南：

- [Customizing Documents](/python/framework/module_guides/loading/documents_and_nodes/usage_documents/)
- [Customizing Nodes](/python/framework/module_guides/loading/documents_and_nodes/usage_nodes/)
- [Customizing Prompts within Higher-Level Modules](https://developers.llamaindex.ai/python/examples/prompts/prompt_mixin/index.md)