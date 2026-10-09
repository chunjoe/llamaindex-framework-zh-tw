---
title: "向量資料庫"
---

Vector stores 包含已攝取的 document chunk 的 embedding vectors（有時也會包含 document chunks）。

## 簡單 Vector Store

預設情況下，LlamaIndex 使用一個簡單的 in-memory vector store，非常適合快速實驗。它們可以透過呼叫 `vector_store.persist()`（以及 `SimpleVectorStore.from_persist_path(...)`）來存取（以及從磁碟載入）。

## Vector Store 選項與功能支援

LlamaIndex 支援超過 20 種不同的 vector store 選項。我們正在積極增加更多整合並改進每個選項的功能覆蓋範圍。

| Vector Store | Type | Metadata Filtering | Hybrid Search | Delete | Store Documents | Async |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Alibaba Cloud OpenSearch | cloud | ✓ | | ✓ | ✓ | ✓ |
| Apache Cassandra® | self-hosted / cloud | ✓ | | ✓ | ✓ | |
| Astra DB | cloud | ✓ | | ✓ | ✓ | |
| Azure AI Search | cloud | ✓ | ✓ | ✓ | ✓ | |
| Azure CosmosDB Mongo vCore | cloud | | | ✓ | ✓ | |
| Azure CosmosDB NoSql | cloud | | | ✓ | ✓ | |
| BaiduVectorDB | cloud | ✓ | ✓ | | ✓ | |
| ChatGPT Retrieval Plugin | aggregator | | | ✓ | ✓ | |
| Chroma | self-hosted | ✓ | | ✓ | ✓ | |
| Couchbase | self-hosted / cloud | ✓ | ✓ | ✓ | ✓ | |
| DashVector | cloud | ✓ | ✓ | ✓ | ✓ | |
| Databricks | cloud | ✓ | | ✓ | ✓ | |
| Deeplake | self-hosted / cloud | ✓ | | ✓ | ✓ | |
| DocArray | aggregator | ✓ | | ✓ | ✓ | |
| DuckDB | in-memory / self-hosted | ✓ | | ✓ | ✓ | |
| DynamoDB | cloud | | | ✓ | | |
| Elasticsearch | self-hosted / cloud | ✓ | ✓ | ✓ | ✓ | ✓ |
| FAISS | in-memory | | | | | |
| Google AlloyDB | cloud | ✓ | | ✓ | ✓ | ✓ |
| Google Cloud SQL Postgres | cloud | ✓ | | ✓ | ✓ | ✓ || Hnswlib | in-memory | | | | | |
| txtai | in-memory | | | | | |
| Jaguar | self-hosted / cloud | ✓ | ✓ | ✓ | ✓ | |
| LanceDB | cloud | ✓ | | ✓ | ✓ | |
| Lantern | self-hosted / cloud | ✓ | ✓ | ✓ | ✓ | ✓ |
| MongoDB Atlas | self-hosted / cloud | ✓ | ✓ | ✓ | ✓ | |
| MyScale | cloud | ✓ | ✓ | ✓ | ✓ | |
| Milvus / Zilliz | self-hosted / cloud | ✓ | ✓ | ✓ | ✓ | |
| Neo4jVector | self-hosted / cloud | ✓ | | ✓ | ✓ | |
| OpenSearch | self-hosted / cloud | ✓ | ✓ | ✓ | ✓ | ✓ |
| Pinecone | cloud | ✓ | ✓ | ✓ | ✓ | |
| Postgres | self-hosted / cloud | ✓ | ✓ | ✓ | ✓ | ✓ |
| pgvecto.rs | self-hosted / cloud | ✓ | ✓ | ✓ | ✓ | |
| Qdrant | self-hosted / cloud | ✓ | ✓ | ✓ | ✓ | ✓ |
| Redis | self-hosted / cloud | ✓ | | ✓ | ✓ | |
| S3 | cloud | ✓ | | ✓ | ✓ | ✓\* (using asyncio.to\_thread) |
| Simple | in-memory | ✓ | | ✓ | | |
| SingleStore | self-hosted / cloud | ✓ | | ✓ | ✓ | |
| Supabase | self-hosted / cloud | ✓ | | ✓ | ✓ | |
| Tablestore | cloud | ✓ | ✓ | ✓ | ✓ | |
| Tair | cloud | ✓ | | ✓ | ✓ | |
| TiDB | cloud | ✓ | | ✓ | ✓ | |
| TencentVectorDB | cloud | ✓ | ✓ | ✓ | ✓ | |
| Timescale | | ✓ | | ✓ | ✓ | ✓ |
| Typesense | self-hosted / cloud | ✓ | | ✓ | ✓ | |
| Upstash | cloud | | | | ✓ | || VectorX DB | cloud | ✓ | ✓ | ✓ | ✓ | ✓ |
| Vearch | self-hosted | ✓ | | ✓ | ✓ | |
| Vespa | self-hosted / cloud | ✓ | ✓ | ✓ | ✓ | |
| Vertex AI Vector Search | cloud | ✓ | | ✓ | ✓ | |
| Weaviate | self-hosted / cloud | ✓ | ✓ | ✓ | ✓ | |
| WordLift | cloud | ✓ | ✓ | ✓ | ✓ | ✓ |
|

如需更多詳情，請參閱 [Vector Store Integrations](/python/framework/community/integrations/vector_stores/)。

## 範例 Notebooks

- [Alibaba Cloud OpenSearch](https://developers.llamaindex.ai/python/examples/vector_stores/alibabacloudopensearchindexdemo/index.md)
- [Astra DB](https://developers.llamaindex.ai/python/examples/vector_stores/astradbindexdemo/index.md)
- [Async Index Creation](https://developers.llamaindex.ai/python/examples/vector_stores/asyncindexcreationdemo/index.md)
- [Azure AI Search](https://developers.llamaindex.ai/python/examples/vector_stores/azureaisearchindexdemo/index.md)
- [Azure Cosmos DB Mongo vCore](https://developers.llamaindex.ai/python/examples/vector_stores/azurecosmosdbmongodbvcoredemo/index.md)
- [Azure Cosmos DB NoSql](https://developers.llamaindex.ai/python/examples/vector_stores/azurecosmosdbnosqldemo/index.md)
- [Baidu](https://developers.llamaindex.ai/python/examples/vector_stores/baiduvectordbindexdemo/index.md)
- [Caasandra](https://developers.llamaindex.ai/python/examples/vector_stores/cassandraindexdemo/index.md)
- [Chromadb](https://developers.llamaindex.ai/python/examples/vector_stores/chromaindexdemo/index.md)
- [Couchbase](https://developers.llamaindex.ai/python/examples/vector_stores/couchbasevectorstoredemo/index.md)
- [Dash](https://developers.llamaindex.ai/python/examples/vector_stores/dashvectorindexdemo/index.md)
- [Databricks](https://developers.llamaindex.ai/python/examples/vector_stores/databricksvectorsearchdemo/index.md)
- [Deeplake](https://developers.llamaindex.ai/python/examples/vector_stores/deeplakeindexdemo/index.md)
- [DocArray HNSW](https://developers.llamaindex.ai/python/examples/vector_stores/docarrayhnswindexdemo/index.md)
- [DocArray in-Memory](https://developers.llamaindex.ai/python/examples/vector_stores/docarrayinmemoryindexdemo/index.md)
- [DuckDB](https://developers.llamaindex.ai/python/examples/vector_stores/duckdbdemo/index.md)
- [Espilla](https://developers.llamaindex.ai/python/examples/vector_stores/epsillaindexdemo/index.md)
- [Google AlloyDB for PostgreSQL](https://developers.llamaindex.ai/python/examples/vector_stores/alloydbvectorstoredemo/index.md)
- [Google Cloud SQL for PostgreSQL](https://developers.llamaindex.ai/python/examples/vector_stores/cloudsqlpgvectorstoredemo/index.md)
- [Jaguar](https://developers.llamaindex.ai/python/examples/vector_stores/jaguarindexdemo/index.md)
- [LanceDB](https://developers.llamaindex.ai/python/examples/vector_stores/lancedbindexdemo/index.md)
- [Lantern](https://developers.llamaindex.ai/python/examples/vector_stores/lanternindexdemo/index.md)
- [Milvus](https://developers.llamaindex.ai/python/examples/vector_stores/milvusindexdemo/index.md)
- [Milvus Async API](https://developers.llamaindex.ai/python/examples/vector_stores/milvusasyncapidemo/index.md)
- [Milvus Full-Text Search](https://developers.llamaindex.ai/python/examples/vector_stores/milvusfulltextsearchdemo/index.md)
- [Milvus Hybrid Search](https://developers.llamaindex.ai/python/examples/vector_stores/milvushybridindexdemo/index.md)
- [MyScale](https://developers.llamaindex.ai/python/examples/vector_stores/myscaleindexdemo/index.md)
- [ElasticSearch](https://developers.llamaindex.ai/python/examples/vector_stores/elasticsearchindexdemo/index.md)
- [FAISS](https://developers.llamaindex.ai/python/examples/vector_stores/faissindexdemo/index.md)
- [Hnswlib](https://developers.llamaindex.ai/python/examples/vector_stores/hnswlibindexdemo/index.md)
- [MongoDB Atlas](https://developers.llamaindex.ai/python/examples/vector_stores/mongodbatlasvectorsearch/index.md)
- [Neo4j](https://developers.llamaindex.ai/python/examples/vector_stores/neo4jvectordemo/index.md)
- [OpenSearch](https://developers.llamaindex.ai/python/examples/vector_stores/opensearchdemo/index.md)
- [Pinecone](https://developers.llamaindex.ai/python/examples/vector_stores/pineconeindexdemo/index.md)
- [Pinecone Hybrid Search](https://developers.llamaindex.ai/python/examples/vector_stores/pineconeindexdemo-hybrid/index.md)
- [PGvectoRS](https://developers.llamaindex.ai/python/examples/vector_stores/pgvectorsdemo/index.md)
- [Postgres](https://developers.llamaindex.ai/python/examples/vector_stores/postgres/index.md)
- [Redis](https://developers.llamaindex.ai/python/examples/vector_stores/redisindexdemo/index.md)
- [Qdrant](https://developers.llamaindex.ai/python/examples/vector_stores/qdrantindexdemo/index.md)
- [Qdrant Hybrid Search](https://developers.llamaindex.ai/python/examples/vector_stores/qdrant_hybrid/index.md)
- [Rockset](https://developers.llamaindex.ai/python/examples/vector_stores/rocksetindexdemo/index.md)
- [S3](https://developers.llamaindex.ai/python/examples/vector_stores/s3vectorstore/index.md)
- [Simple](https://developers.llamaindex.ai/python/examples/vector_stores/simpleindexdemo/index.md)
- [Supabase](https://developers.llamaindex.ai/python/examples/vector_stores/supabasevectorindexdemo/index.md)
- [Tablestore](https://developers.llamaindex.ai/python/examples/vector_stores/tablestoredemo/index.md)
- [Tair](https://developers.llamaindex.ai/python/examples/vector_stores/tairindexdemo/index.md)
- [TiDB](https://developers.llamaindex.ai/python/examples/vector_stores/tidbvector/index.md)
- [Tencent](https://developers.llamaindex.ai/python/examples/vector_stores/tencentvectordbindexdemo/index.md)
- [Timesacle](https://developers.llamaindex.ai/python/examples/vector_stores/timescalevector/index.md)
- [Upstash](https://developers.llamaindex.ai/python/examples/vector_stores/upstashvectordemo/index.md)
- [VectorX DB](https://developers.llamaindex.ai/python/examples/vector_stores/vectorxdbdemo/index.md)
- [Vearch](https://developers.llamaindex.ai/python/examples/vector_stores/vearchdemo/index.md)
- [Vespa](https://developers.llamaindex.ai/python/examples/vector_stores/vespaindexdemo/index.md)
- [Vertex AI Vector Search](https://developers.llamaindex.ai/python/examples/vector_stores/vertexaivectorsearchdemo/index.md)
- [Weaviate](https://developers.llamaindex.ai/python/examples/vector_stores/weaviateindexdemo/index.md)
- [Weaviate Hybrid Search](https://developers.llamaindex.ai/python/examples/vector_stores/weaviateindexdemo-hybrid/index.md)
- [WordLift](https://developers.llamaindex.ai/python/examples/vector_stores/wordliftdemo/index.md)
- [Zep](https://developers.llamaindex.ai/python/examples/vector_stores/zepindexdemo/index.md)