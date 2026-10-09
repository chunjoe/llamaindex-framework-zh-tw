---
title: Integrations | Developer Documentation
---

LlamaIndex has a number of community integrations, from vector stores, to prompt trackers, tracers, and more!

## Data Loaders

Data loaders (readers) live in the [`readers` directory](https://github.com/run-llama/llama_index/tree/main/llama-index-integrations/readers) of the LlamaIndex repo, one package per source. See the [data connectors guide](/python/framework/module_guides/loading/connector/index.md) for how to use them.

## Agent Tools

Agent tools and tool specs live in the [`tools` directory](https://github.com/run-llama/llama_index/tree/main/llama-index-integrations/tools) of the LlamaIndex repo. See the [tools guide](/python/framework/module_guides/deploying/agents/tools/index.md) for how to use them.

- [MCP Toolbox](/python/examples/tools/mcp_toolbox/index.md)

## LlamaPacks — Code Templates

LlamaPacks are deprecated. See the [dedicated page](/python/framework/community/llama_packs/index.md) for details.

## LLMs

We support [a huge number of LLMs](/python/framework/module_guides/models/llms/modules/index.md).

## Observability/Tracing/Evaluation

Check out our [one-click observability](/python/framework/module_guides/observability/index.md) page for full tracing integrations.

## Experiment Tracking

- [Kiln](https://github.com/Kiln-AI/Kiln/tree/main/libs/core#taking-kiln-rag-to-production)
- [MLflow](/python/examples/observability/mlflow/index.md)

## Structured Outputs

- [Guidance](/python/framework/community/integrations/guidance/index.md)
- [LLM Format Enforcer](/python/framework/community/integrations/lmformatenforcer/index.md)
- [Guardrails](/python/examples/output_parsing/guardrailsdemo/index.md)
- [OpenAI Function Calling](/python/examples/output_parsing/openai_pydantic_program/index.md)

## Storage and Managed Indexes

- [Vector Stores](/python/framework/community/integrations/vector_stores/index.md)
- [Managed Indices](/python/framework/community/integrations/managed_indices/index.md)

## Application Frameworks

- [Streamlit](https://blog.streamlit.io/build-a-chatbot-with-custom-data-sources-powered-by-llamaindex/)
- [Chainlit](https://docs.chainlit.io/integrations/llama-index)
- [CopilotKit](https://docs.copilotkit.ai/llamaindex/quickstart)

## Distributed Compute

- [LlamaIndex + Ray](https://www.anyscale.com/blog/build-and-scale-a-powerful-query-engine-with-llamaindex-ray)

## Other

- [ChatGPT Plugins](/python/framework/community/integrations/chatgpt_plugins/index.md)
- [Poe](https://github.com/poe-platform/poe-protocol/tree/main/llama_poe)
- [Airbyte](https://airbyte.com/tutorials/airbyte-and-llamaindex-elt-and-chat-with-your-data-warehouse-without-writing-sql)
- [Fleet](/python/framework/community/integrations/fleet_libraries_context/index.md)
