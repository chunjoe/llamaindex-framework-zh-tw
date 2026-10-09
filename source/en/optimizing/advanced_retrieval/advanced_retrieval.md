---
title: Advanced Retrieval Strategies | Developer Documentation
---

## Main Advanced Retrieval Strategies

There are a variety of more advanced retrieval strategies you may wish to try, each with different benefits:

- [Reranking](/python/framework/module_guides/models/rerankers/index.md)
- [Recursive retrieval](/python/examples/query_engine/pdf_tables/recursive_retriever/index.md)
- [Embedded tables](/python/examples/query_engine/sec_tables/tesla_10q_table/index.md)
- [Small-to-big retrieval](/python/examples/node_postprocessor/metadatareplacementdemo/index.md)

See our full [retrievers module guide](/python/framework/module_guides/querying/retriever/retrievers/index.md) for a comprehensive list of all retrieval strategies, broken down into different categories.

- Basic retrieval from each index
- Advanced retrieval and search
- Auto-Retrieval
- Knowledge Graph Retrievers
- Composed/Hierarchical Retrievers
- and more!

More resources are below.

## Query Transformations

A user query can be transformed before it enters a flow (query engine, agent, and more). See resources below on query transformations:

- [Query Transform Cookbook](/python/examples/query_transformations/query_transform_cookbook/index.md)
- [Query Transformations Docs](/python/framework/optimizing/advanced_retrieval/query_transformations/index.md)

## Composable Retrievers

Every retriever is capable of retrieving and running other objects, including

- other retrievers
- query engines
- query pipelines
- other nodes

For more details, check out the guide below.

- [Composable Retrievers](/python/examples/retrievers/composable_retrievers/index.md)

## Third-Party Resources

Here are some third-party resources on advanced retrieval strategies.

- [DeepMemory (Activeloop)](/python/examples/retrievers/deep_memory/index.md)
- [Weaviate Hybrid Search](/python/examples/vector_stores/weaviateindexdemo-hybrid/index.md)
- [Pinecone Hybrid Search](/python/examples/vector_stores/pineconeindexdemo-hybrid/index.md)
- [Milvus Hybrid Search](/python/examples/vector_stores/milvushybridindexdemo/index.md)
