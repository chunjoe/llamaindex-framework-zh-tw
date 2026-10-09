---
title: "Agentic 策略"
---

您可以在現有的 LlamaIndex RAG workflow 之上建構 agents，賦予其自動化決策能力。許多模組（如 routing、query transformations 等）在本質上已具備 agentic 特性，因為它們使用 LLMs 進行決策。

## 較簡單的 Agentic 策略

這包括 routing 與 query transformations。

- [Routing](/python/framework/module_guides/querying/router/)
- [Query Transformations](/python/framework/optimizing/advanced_retrieval/query_transformations/)
- [Sub Question Query Engine (Intro)](https://developers.llamaindex.ai/python/examples/query_engine/sub_question_query_engine/index.md)

## Data Agents

下方的指南將向您展示如何將完整的 agent 迴圈部署在現有的 RAG query engines 之上，將其作為工具以實現更進階的決策，並使其具備 chain-of-thought 與 query planning 能力。

請務必參閱我們的 [Data Agents 完整模組指南](/python/framework/module_guides/deploying/agents/)，其中詳細介紹了這些使用案例及更多內容。

我們的 [低階 agent API](/python/framework/module_guides/deploying/agents/#manual-agents) 則向您展示 agent 的內部運作方式（包含 step-wise execution）。

以下為範例指南（使用 LLM-provider-specific function calling）：

- [Basic Function Agent](https://developers.llamaindex.ai/python/examples/workflow/function_calling_agent/index.md)
- [Function Agent with Query Engine Tools](https://developers.llamaindex.ai/python/examples/agent/openai_agent_with_query_engine/index.md)
- [Function Agent Retrieval](https://developers.llamaindex.ai/python/examples/agent/openai_agent_retrieval/index.md)
- [Function Agent Query Cookbook](https://developers.llamaindex.ai/python/examples/agent/openai_agent_query_cookbook/index.md)
- [Function Agent w/ Context Retrieval](https://developers.llamaindex.ai/python/examples/agent/openai_agent_context_retrieval/index.md)