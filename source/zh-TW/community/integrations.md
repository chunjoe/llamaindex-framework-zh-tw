---
title: "整合"
---

LlamaIndex 有許多社群整合，從 vector stores 到 prompt trackers、tracers 等！

## 資料載入器

Data loaders (readers) 位於 LlamaIndex repo 的 [`readers` 目錄](https://github.com/run-llama/llama_index/tree/main/llama-index-integrations/readers)，每個來源一個 package。請參閱 [data connectors guide](/python/framework/module_guides/loading/connector/) 了解如何使用它們。

## Agent Tools

Agent tools 和 tool specs 位於 LlamaIndex repo 的 [`tools` 目錄](https://github.com/run-llama/llama_index/tree/main/llama-index-integrations/tools)。請參閱 [工具指南](/python/framework/module_guides/deploying/agents/tools/) 了解如何使用它們。

- [MCP Toolbox](https://developers.llamaindex.ai/python/examples/tools/mcp_toolbox/index.md)

## LlamaPacks — Code Templates

LlamaPacks 已棄用。請參閱 [dedicated page](/python/framework/community/llama_packs/) 了解詳情。

## LLMs

我們支援 [大量的 LLMs](/python/framework/module_guides/models/llms/modules/)。

## Observability/Tracing/Evaluation

請查看我們的 [one-click observability](/python/framework/module_guides/observability/) 頁面以獲取完整的 tracing 整合。

## Experiment Tracking

- [Kiln](https://github.com/Kiln-AI/Kiln/tree/main/libs/core#taking-kiln-rag-to-production)
- [MLflow](https://developers.llamaindex.ai/python/examples/observability/mlflow/index.md)

## Structured Outputs

- [Guidance](/python/framework/community/integrations/guidance/)
- [LLM Format Enforcer](/python/framework/community/integrations/lmformatenforcer/)
- [Guardrails](https://developers.llamaindex.ai/python/examples/output_parsing/guardrailsdemo/index.md)
- [OpenAI Function Calling](https://developers.llamaindex.ai/python/examples/output_parsing/openai_pydantic_program/index.md)

## Storage 與 Managed Indexes

- [Vector Stores](/python/framework/community/integrations/vector_stores/)
- [Managed Indices](/python/framework/community/integrations/managed_indices/)

## 應用程式框架

- [Streamlit](https://blog.streamlit.io/build-a-chatbot-with-custom-data-sources-powered-by-llamaindex/)
- [Chainlit](https://docs.chainlit.io/integrations/llama-index)
- [CopilotKit](https://docs.copilotkit.ai/llamaindex/quickstart)

## Distributed Compute

- [LlamaIndex + Ray](https://www.anyscale.com/blog/build-and-scale-a-powerful-query-engine-with-llamaindex-ray)

## Other

- [ChatGPT Plugins](/python/framework/community/integrations/chatgpt_plugins/)
- [Poe](https://github.com/poe-platform/poe-protocol/tree/main/llama_poe)
- [Airbyte](https://airbyte.com/tutorials/airbyte-and-llamaindex-elt-and-chat-with-your-data-warehouse-without-writing-sql)
- [Fleet](/python/framework/community/integrations/fleet_libraries_context/)