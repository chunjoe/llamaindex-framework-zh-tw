---
title: Retriever Modules | Developer Documentation
---

We are actively adding more tailored retrieval guides. In the meanwhile, please take a look at the [API References](/python/framework-api-reference/retrievers/index.md).

## Index Retrievers

Please see [the retriever modes](/python/framework/module_guides/querying/retriever/retriever_modes/index.md) for more details on how to get a retriever from any given index.

If you want to import the corresponding retrievers directly, please check out our [API reference](/python/framework-api-reference/retrievers/index.md).

## Comprehensive Retriever Guides

Check out our comprehensive guides on various retriever modules, many of which cover advanced concepts (auto-retrieval, routing, ensembling, and more).

### Advanced Retrieval and Search

These guides contain advanced retrieval techniques. Some are common like keyword/hybrid search, reranking, and more. Some are specific to LLM + RAG workflows, like small-to-big and auto-merging retrieval.

- [Define Custom Retriever](/python/examples/query_engine/customretrievers/index.md)
- [BM25 Hybrid Retriever](/python/examples/retrievers/bm25_retriever/index.md)
- [Simple Query Fusion](/python/examples/retrievers/simple_fusion/index.md)
- [Reciprocal Rerank Fusion](/python/examples/retrievers/reciprocal_rerank_fusion/index.md)
- [Auto Merging Retriever](/python/examples/retrievers/auto_merging_retriever/index.md)
- [Metadata Replacement](/python/examples/node_postprocessor/metadatareplacementdemo/index.md)
- [Composable Retrievers](/python/examples/retrievers/composable_retrievers/index.md)

### Auto-Retrieval

These retrieval techniques perform **semi-structured** queries, combining semantic search with structured filtering.

- [Auto-Retrieval (with Pinecone)](/python/examples/vector_stores/pinecone_auto_retriever/index.md)
- [Auto-Retrieval (with Lantern)](/python/examples/vector_stores/lanternautoretriever/index.md)
- [Auto-Retrieval (with Chroma)](/python/examples/vector_stores/chroma_auto_retriever/index.md)
- [Auto-Retrieval (with BagelDB)](/python/examples/vector_stores/bagelautoretriever/index.md)
- [Auto-Retrieval (with Vectara)](/python/examples/retrievers/vectara_auto_retriever/index.md)
- [Multi-Doc Auto-Retrieval](/python/examples/query_engine/multi_doc_auto_retrieval/multi_doc_auto_retrieval/index.md)

### Knowledge Graph Retrievers

- [Knowledge Graph RAG Retriever](/python/examples/query_engine/knowledge_graph_rag_query_engine/index.md)

### Composed Retrievers

These are retrieval techniques that are composed on top of other retrieval techniques - providing higher-level capabilities like hierarchical retrieval and query decomposition.

- [Query Fusion](/python/examples/retrievers/reciprocal_rerank_fusion/index.md)
- [Recursive Table Retrieval](/python/examples/query_engine/pdf_tables/recursive_retriever/index.md)
- [Recursive Node Retrieval](/python/examples/retrievers/recursive_retriever_nodes/index.md)
- [Braintrust](/python/examples/retrievers/recurisve_retriever_nodes_braintrust/index.md)
- [Router Retriever](/python/examples/retrievers/router_retriever/index.md)
- [Ensemble Retriever](/python/examples/retrievers/ensemble_retrieval/index.md)
- [Multi-Doc Auto-Retrieval](/python/examples/query_engine/multi_doc_auto_retrieval/multi_doc_auto_retrieval/index.md)

### Managed Retrievers

- [Google](/python/examples/managed/googledemo/index.md)
- [Vectara](/python/examples/managed/vectarademo/index.md)
- [VideoDB](/python/examples/retrievers/videodb_retriever/index.md)
- [Amazon Bedrock](/python/examples/retrievers/bedrock_retriever/index.md)

### Other Retrievers

These are guides that don’t fit neatly into a category but should be highlighted regardless.

- [Multi-Doc Hybrid](/python/examples/retrievers/multi_doc_together_hybrid/index.md)
- [You Retriever](/python/examples/retrievers/you_retriever/index.md)
- [Text-to-SQL](/python/examples/index_structs/struct_indices/sqlindexdemo/index.md)
- [DeepMemory (Activeloop)](/python/examples/retrievers/deep_memory/index.md)
- [Pathway](/python/examples/retrievers/pathway_retriever/index.md)
