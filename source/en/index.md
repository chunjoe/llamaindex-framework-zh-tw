---
title: LlamaIndex Framework, by the makers of LlamaParse | Developer Documentation
description: LlamaIndex is the company behind LlamaParse, the document parsing platform for AI agents. The LlamaIndex framework is our original open-source toolkit for RAG and agents.
---

# LlamaIndex Framework

LlamaIndex is the company behind LlamaParse, the document parsing platform for AI agents. The LlamaIndex framework is our original open-source toolkit for RAG and agents.

[Start the tutorial ](/python/framework/getting_started/starter_example/index.md)[Installation ](/python/framework/getting_started/installation/index.md)[ GitHub](https://github.com/run-llama/llama_index)

## Introduction

The LlamaIndex framework is a Python toolkit for building LLM-powered agents over your data. LLMs are trained on public data, not yours. Your data is behind APIs, in databases, or trapped in PDFs and slide decks. Context augmentation makes that data available to the model at the moment it answers, and its best-known form is [retrieval-augmented generation (RAG)](/python/framework/getting_started/concepts/index.md). The framework gives you the parts to build any context-augmentation use case, from prototype to production, and it is the shortest path from documents parsed by [LlamaParse](/llamaparse/index.md) to an agent that can use them.

- **[Agents](/python/framework/understanding/agent/index.md)** are LLM-powered assistants that use tools to complete tasks, from answering questions over your documents to taking actions in other systems. A RAG pipeline is one of many tools an agent can call.
- **[Workflows](/python/llamaagents/workflows/index.md)** are event-driven, multi-step processes that combine agents, data connectors and tools, with branching, retries and human-in-the-loop review, and can be deployed as services.

The framework is built from composable parts. The high-level API gets you from documents to answers in a few lines; the lower-level API lets you customize or replace any of them.

[ Data connectors ](/python/framework/module_guides/loading/index.md)[ Indexes and vector stores ](/python/framework/module_guides/indexing/index.md)[ Query and chat engines ](/python/framework/module_guides/querying/index.md)[ Agents and tools ](/python/framework/module_guides/deploying/agents/index.md)[ Workflows ](/python/llamaagents/workflows/index.md)[ Models, evaluation and observability](/python/framework/module_guides/models/index.md)

New here? The [starter tutorial](/python/framework/getting_started/starter_example/index.md) builds an agent with a tool over your documents, the [local-models tutorial](/python/framework/getting_started/starter_example_local/index.md) does the same without any hosted API, and [how to read these docs](/python/framework/getting_started/reading/index.md) points you to the right section for your experience level. The [Learn](/python/framework/understanding/index.md) section then walks through a complete application step by step.

## When the documents get hard

The framework’s built-in readers are fine for clean text. For scanned PDFs, forms, spreadsheets and slide decks, the quality of what goes into your index decides the quality of every answer. That is what [LlamaParse](/llamaparse/index.md) is for: [Parse](/llamaparse/parse/index.md) (agentic OCR for scans, tables and charts), [Extract](/llamaparse/extract/index.md) (JSON in your schema), [Classify](/llamaparse/classify/index.md), [Split](/llamaparse/split/index.md) and [Index](/llamaparse/cloud-index-v2/getting_started/index.md) (managed ingestion and retrieval). Parsed pages drop straight into a framework index:

Terminal window

```
pip install llama-index "llama-cloud>=2.8"
export LLAMA_CLOUD_API_KEY=llx-...
export OPENAI_API_KEY=sk-...
```

The OpenAI key is for the index, which embeds the pages with OpenAI by default. To embed locally instead, set `Settings.embed_model` as in the [local-models tutorial](/python/framework/getting_started/starter_example_local/index.md).

```
from llama_cloud import LlamaCloud
from llama_index.core import Document, VectorStoreIndex


client = LlamaCloud()  # reads LLAMA_CLOUD_API_KEY


file = client.files.create(file="data/report.pdf", purpose="parse")
result = client.parsing.parse(
    file_id=file.id, tier="agentic", version="latest", expand=["markdown"]
)
pages = result.markdown.pages
documents = [Document(text=p.markdown) for p in pages if p.success]


index = VectorStoreIndex.from_documents(documents)
```

From there the index is a tool like any other: the [starter tutorial](/python/framework/getting_started/starter_example/index.md) shows how to hand it to an agent.

For fully managed retrieval, [Index](/llamaparse/cloud-index-v2/getting_started/index.md) keeps an index in sync with your data sources and serves retrieval to your query engine or agent. For parsing on your own machine, [LiteParse](/liteparse/index.md) is the open-source, local option.

## Hard documents in, clean Markdown out

Agentic OCR and structured extraction as an API, with SDKs for Python, TypeScript, Go and Java. Free to start.

[Get an API key ](https://cloud.llamaindex.ai/?utm_source=developers\&utm_medium=docs\&utm_campaign=framework-landing\&utm_content=banner)[LlamaParse docs](/llamaparse/index.md)

LlamaCloud is now LlamaParse

The hosted platform formerly called LlamaCloud has been renamed LlamaParse. Its documentation lives at [developers.llamaindex.ai/llamaparse](/llamaparse/index.md).

## What you can build

[ Agents Assistants that call tools, keep state across turns and stream progress. ](/python/framework/use_cases/agents/index.md)[ Workflows Event-driven orchestration with branching, retries and human review. ](/python/llamaagents/workflows/index.md)[ Question answering Retrieve the right passages and answer with citations (RAG). ](/python/framework/use_cases/q_and_a/index.md)[ Chatbots Conversations over your data with memory and follow-ups. ](/python/framework/use_cases/chatbots/index.md)[ Structured extraction Typed fields from text with Pydantic, or from whole documents with Extract. ](/python/framework/use_cases/extraction/index.md)[ Multi-modal Text, images, tables and charts in retrieval and generation.](/python/framework/use_cases/multimodal/index.md)

More on the [use cases page](/python/framework/use_cases/index.md): text-to-SQL, querying CSVs, prompting techniques and fine-tuning.

## LlamaIndex open source

The framework is the oldest of our open-source projects, not the only one. The newer ones are smaller, focused on documents, and work with the framework or on their own.

[ LiteParse A fast, open-source document parser that runs on your machine. Layout, bounding boxes, Markdown, built-in OCR. No cloud, no key. ](/liteparse/index.md)[ ExtractBench A schema-guided extraction benchmark for enterprise documents, so you can compare structured extraction on real forms and contracts. ](https://extractbench.ai/)[ ParseBench An open benchmark for document parsing and OCR, so you can compare parsers on your kind of documents. ](https://parsebench.ai/)[ LlamaIndex Framework This toolkit: connectors, indexes, query engines, agents and workflows for Python.](/python/framework/getting_started/installation/index.md)

## Get help and contribute

LlamaIndex Framework is MIT-licensed and built with its community. The [contributing guide](https://github.com/run-llama/llama_index/blob/main/CONTRIBUTING.md) covers everything from a documentation fix to a new integration. The [FAQ](/python/framework/getting_started/faq/index.md) answers the questions everyone asks first.

[ Discord ](https://discord.gg/dGcwcsnxhU)[ GitHub issues ](https://github.com/run-llama/llama_index/issues)[ X ](https://twitter.com/llama_index)[ LinkedIn ](https://www.linkedin.com/company/llamaindex/)[ llama-index on PyPI ](https://pypi.org/project/llama-index/)[ Integrations](/python/framework/community/integrations/index.md)

More from LlamaIndex: [create-llama](https://www.npmjs.com/package/create-llama), [full-stack projects](/python/framework/community/full_stack_projects/index.md) and the [Discover LlamaIndex video series](/python/framework/getting_started/discover_llamaindex/index.md).
