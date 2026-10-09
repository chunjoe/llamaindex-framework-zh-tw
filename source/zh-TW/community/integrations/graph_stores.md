---
title: "使用 Graph Stores"
---

## `Neo4jGraphStore`

`Neo4j` 可作為 graph store integration 支援。您可以使用 LlamaIndex 和 Neo4j 來儲存、視覺化和查詢 graphs。此外，現有的 Neo4j graphs 可以使用 `text2cypher` 和 `KnowledgeGraphQueryEngine` 直接支援。

如果您從未使用過 Neo4j，可以下載桌面客戶端 [這裡](https://neo4j.com/download/)。

開啟客戶端後，建立一個新的專案並安裝 `apoc` integration。完整說明 [這裡](https://neo4j.com/labs/apoc/4.1/installation/)。只需點擊您的專案，在左側選單中選擇 `Plugins`，安裝 APOC 並重新啟動您的伺服器。

查看使用 [Neo4j Graph Store](https://developers.llamaindex.ai/python/examples/index_structs/knowledge_graph/neo4jkgindexdemo/index.md) 的範例。

## `NebulaGraphStore`

我們支援 `NebulaGraphStore` integration，可直接在 Nebula 中儲存 graphs！此外，您可以使用 `KnowledgeGraphQueryEngine` 為您的 Nebula graphs 生成 cypher queries 並回傳自然語言回應。

請參閱以下相關指南：

- [Nebula Graph Store](https://developers.llamaindex.ai/python/examples/index_structs/knowledge_graph/nebulagraphkgindexdemo/index.md)
- [Knowledge Graph Query Engine](https://developers.llamaindex.ai/python/examples/query_engine/knowledge_graph_query_engine/index.md)

## `FalkorDBGraphStore`

我們支援 `FalkorDBGraphStore` integration，可直接在 FalkorDB 中儲存 graphs！此外，您可以使用 `KnowledgeGraphQueryEngine` 為您的 FalkorDB graphs 生成 cypher queries 並回傳自然語言回應。

請參閱以下相關指南：

- [FalkorDB Graph Store](https://developers.llamaindex.ai/python/examples/index_structs/knowledge_graph/falkordbgraphdemo/index.md)

## `Amazon Neptune Graph Stores`

我們支援 `Amazon Neptune` integrations，作為 graph store integration 支援 [Neptune Database](https://docs.aws.amazon.com/neptune/latest/userguide/feature-overview.html) 和 [Neptune Analytics](https://docs.aws.amazon.com/neptune-analytics/latest/userguide/what-is-neptune-analytics.html)。

請參閱以下相關指南：

- [Amazon Neptune Graph Store](https://developers.llamaindex.ai/python/examples/index_structs/knowledge_graph/neptunedatabasekgindexdemo/index.md)。

## `TiDB Graph Store`

我們支援 `TiDBGraphStore` integration，可直接在 [TiDB](https://docs.pingcap.com/tidb/stable/overview) 中儲存 graphs！

請參閱以下相關指南：

- [TiDB Graph Store](https://developers.llamaindex.ai/python/examples/index_structs/knowledge_graph/tidbkgindexdemo/index.md)