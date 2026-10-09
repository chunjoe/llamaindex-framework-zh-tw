---
title: "提示"
---

Prompting LLMs 是任何 LLM 應用程式的基本單元。您可以完全圍繞 prompting 建構一個應用程式，或與其他模組（例如 retrieval）協調，以建構 RAG、agents 等。

LlamaIndex 支援 LLM 抽象和從簡單到進階的 prompt 抽象，以使複雜的 prompt workflows 成為可能。

## LLM 整合

LlamaIndex 支援 40 多種 LLM 整合，從像 OpenAI、Anthropic 這樣的專有模型提供者，到 Mistral、Ollama、Replicate 等開源模型/模型提供者。它提供了所有工具，以標準化圍繞常見 LLM 使用模式的介面，包括但不限於 async、streaming、function calling。

請參閱 [LLMs 的完整模組指南](/python/framework/module_guides/models/llms/)。

## Prompts

LlamaIndex 具有強大的 prompt 抽象，可以捕捉與 LLMs 的所有常見互動模式。

請參閱 [prompt 的完整模組指南](/python/framework/module_guides/models/prompts/)。

### 基本要求 (Table Stakes)

- [Text Completion Prompts](https://developers.llamaindex.ai/python/examples/customization/prompts/completion_prompts/index.md)
- [Chat Prompts](https://developers.llamaindex.ai/python/examples/customization/prompts/chat_prompts/index.md)

### 進階 (Advanced)

- [Variable Mappings, Functions, Partials](https://developers.llamaindex.ai/python/examples/prompts/advanced_prompts/index.md)
- [RichPromptTemplate Features](https://developers.llamaindex.ai/python/examples/prompts/rich_prompt_template_features/index.md)

## Prompt Chains 和 Pipelines

LlamaIndex 具有強大的抽象，用於建立連續的 prompt chains，以及通用的 DAGs 來與任何其他組件協調 prompts。這讓您可以建構複雜的 workflows，包括具有多跳查詢理解層的 RAG，以及 agents。

這些 pipelines 與 [observability partners](/python/framework/module_guides/observability/) 原生整合。