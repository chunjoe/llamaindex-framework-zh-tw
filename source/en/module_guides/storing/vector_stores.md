---
title: Vector Stores | Developer Documentation
---

Vector stores contain embedding vectors of ingested document chunks (and sometimes the document chunks as well).

## Simple Vector Store

By default, LlamaIndex uses a simple in-memory vector store that’s great for quick experimentation. They can be persisted to (and loaded from) disk by calling `vector_store.persist()` (and `SimpleVectorStore.from_persist_path(...)` respectively).

## Vector Store Options & Feature Support

LlamaIndex supports over 20 different vector store options. We are actively adding more integrations and improving feature coverage for each.

| Vector Store               | Type                    | Metadata Filtering | Hybrid Search | Delete | Store Documents | Async                          |
| -------------------------- | ----------------------- | ------------------ | ------------- | ------ | --------------- | ------------------------------ |
| Alibaba Cloud OpenSearch   | cloud                   | ✓                  |               | ✓      | ✓               | ✓                              |
| Apache Cassandra®          | self-hosted / cloud     | ✓                  |               | ✓      | ✓               |                                |
| Astra DB                   | cloud                   | ✓                  |               | ✓      | ✓               |                                |
| Azure AI Search            | cloud                   | ✓                  | ✓             | ✓      | ✓               |                                |
| Azure CosmosDB Mongo vCore | cloud                   |                    |               | ✓      | ✓               |                                |
| Azure CosmosDB NoSql       | cloud                   |                    |               | ✓      | ✓               |                                |
| BaiduVectorDB              | cloud                   | ✓                  | ✓             |        | ✓               |                                |
| ChatGPT Retrieval Plugin   | aggregator              |                    |               | ✓      | ✓               |                                |
| Chroma                     | self-hosted             | ✓                  |               | ✓      | ✓               |                                |
| Couchbase                  | self-hosted / cloud     | ✓                  | ✓             | ✓      | ✓               |                                |
| DashVector                 | cloud                   | ✓                  | ✓             | ✓      | ✓               |                                |
| Databricks                 | cloud                   | ✓                  |               | ✓      | ✓               |                                |
| Deeplake                   | self-hosted / cloud     | ✓                  |               | ✓      | ✓               |                                |
| DocArray                   | aggregator              | ✓                  |               | ✓      | ✓               |                                |
| DuckDB                     | in-memory / self-hosted | ✓                  |               | ✓      | ✓               |                                |
| DynamoDB                   | cloud                   |                    |               | ✓      |                 |                                |
| Elasticsearch              | self-hosted / cloud     | ✓                  | ✓             | ✓      | ✓               | ✓                              |
| FAISS                      | in-memory               |                    |               |        |                 |                                |
| Google AlloyDB             | cloud                   | ✓                  |               | ✓      | ✓               | ✓                              |
| Google Cloud SQL Postgres  | cloud                   | ✓                  |               | ✓      | ✓               | ✓                              |
| Hnswlib                    | in-memory               |                    |               |        |                 |                                |
| txtai                      | in-memory               |                    |               |        |                 |                                |
| Jaguar                     | self-hosted / cloud     | ✓                  | ✓             | ✓      | ✓               |                                |
| LanceDB                    | cloud                   | ✓                  |               | ✓      | ✓               |                                |
| Lantern                    | self-hosted / cloud     | ✓                  | ✓             | ✓      | ✓               | ✓                              |
| MongoDB Atlas              | self-hosted / cloud     | ✓                  | ✓             | ✓      | ✓               |                                |
| MyScale                    | cloud                   | ✓                  | ✓             | ✓      | ✓               |                                |
| Milvus / Zilliz            | self-hosted / cloud     | ✓                  | ✓             | ✓      | ✓               |                                |
| Neo4jVector                | self-hosted / cloud     | ✓                  |               | ✓      | ✓               |                                |
| OpenSearch                 | self-hosted / cloud     | ✓                  | ✓             | ✓      | ✓               | ✓                              |
| Pinecone                   | cloud                   | ✓                  | ✓             | ✓      | ✓               |                                |
| Postgres                   | self-hosted / cloud     | ✓                  | ✓             | ✓      | ✓               | ✓                              |
| pgvecto.rs                 | self-hosted / cloud     | ✓                  | ✓             | ✓      | ✓               |                                |
| Qdrant                     | self-hosted / cloud     | ✓                  | ✓             | ✓      | ✓               | ✓                              |
| Redis                      | self-hosted / cloud     | ✓                  |               | ✓      | ✓               |                                |
| S3                         | cloud                   | ✓                  |               | ✓      | ✓               | ✓\* (using asyncio.to\_thread) |
| Simple                     | in-memory               | ✓                  |               | ✓      |                 |                                |
| SingleStore                | self-hosted / cloud     | ✓                  |               | ✓      | ✓               |                                |
| Supabase                   | self-hosted / cloud     | ✓                  |               | ✓      | ✓               |                                |
| Tablestore                 | cloud                   | ✓                  | ✓             | ✓      | ✓               |                                |
| Tair                       | cloud                   | ✓                  |               | ✓      | ✓               |                                |
| TiDB                       | cloud                   | ✓                  |               | ✓      | ✓               |                                |
| TencentVectorDB            | cloud                   | ✓                  | ✓             | ✓      | ✓               |                                |
| Timescale                  |                         | ✓                  |               | ✓      | ✓               | ✓                              |
| Typesense                  | self-hosted / cloud     | ✓                  |               | ✓      | ✓               |                                |
| Upstash                    | cloud                   |                    |               |        | ✓               |                                |
| VectorX DB                 | cloud                   | ✓                  | ✓             | ✓      | ✓               | ✓                              |
| Vearch                     | self-hosted             | ✓                  |               | ✓      | ✓               |                                |
| Vespa                      | self-hosted / cloud     | ✓                  | ✓             | ✓      | ✓               |                                |
| Vertex AI Vector Search    | cloud                   | ✓                  |               | ✓      | ✓               |                                |
| Weaviate                   | self-hosted / cloud     | ✓                  | ✓             | ✓      | ✓               |                                |
| WordLift                   | cloud                   | ✓                  | ✓             | ✓      | ✓               | ✓                              |

For more details, see [Vector Store Integrations](/python/framework/community/integrations/vector_stores/index.md).

## Example Notebooks

- [Alibaba Cloud OpenSearch](/python/examples/vector_stores/alibabacloudopensearchindexdemo/index.md)
- [Astra DB](/python/examples/vector_stores/astradbindexdemo/index.md)
- [Async Index Creation](/python/examples/vector_stores/asyncindexcreationdemo/index.md)
- [Azure AI Search](/python/examples/vector_stores/azureaisearchindexdemo/index.md)
- [Azure Cosmos DB Mongo vCore](/python/examples/vector_stores/azurecosmosdbmongodbvcoredemo/index.md)
- [Azure Cosmos DB NoSql](/python/examples/vector_stores/azurecosmosdbnosqldemo/index.md)
- [Baidu](/python/examples/vector_stores/baiduvectordbindexdemo/index.md)
- [Caasandra](/python/examples/vector_stores/cassandraindexdemo/index.md)
- [Chromadb](/python/examples/vector_stores/chromaindexdemo/index.md)
- [Couchbase](/python/examples/vector_stores/couchbasevectorstoredemo/index.md)
- [Dash](/python/examples/vector_stores/dashvectorindexdemo/index.md)
- [Databricks](/python/examples/vector_stores/databricksvectorsearchdemo/index.md)
- [Deeplake](/python/examples/vector_stores/deeplakeindexdemo/index.md)
- [DocArray HNSW](/python/examples/vector_stores/docarrayhnswindexdemo/index.md)
- [DocArray in-Memory](/python/examples/vector_stores/docarrayinmemoryindexdemo/index.md)
- [DuckDB](/python/examples/vector_stores/duckdbdemo/index.md)
- [Espilla](/python/examples/vector_stores/epsillaindexdemo/index.md)
- [Google AlloyDB for PostgreSQL](/python/examples/vector_stores/alloydbvectorstoredemo/index.md)
- [Google Cloud SQL for PostgreSQL](/python/examples/vector_stores/cloudsqlpgvectorstoredemo/index.md)
- [Jaguar](/python/examples/vector_stores/jaguarindexdemo/index.md)
- [LanceDB](/python/examples/vector_stores/lancedbindexdemo/index.md)
- [Lantern](/python/examples/vector_stores/lanternindexdemo/index.md)
- [Milvus](/python/examples/vector_stores/milvusindexdemo/index.md)
- [Milvus Async API](/python/examples/vector_stores/milvusasyncapidemo/index.md)
- [Milvus Full-Text Search](/python/examples/vector_stores/milvusfulltextsearchdemo/index.md)
- [Milvus Hybrid Search](/python/examples/vector_stores/milvushybridindexdemo/index.md)
- [MyScale](/python/examples/vector_stores/myscaleindexdemo/index.md)
- [ElasticSearch](/python/examples/vector_stores/elasticsearchindexdemo/index.md)
- [FAISS](/python/examples/vector_stores/faissindexdemo/index.md)
- [Hnswlib](/python/examples/vector_stores/hnswlibindexdemo/index.md)
- [MongoDB Atlas](/python/examples/vector_stores/mongodbatlasvectorsearch/index.md)
- [Neo4j](/python/examples/vector_stores/neo4jvectordemo/index.md)
- [OpenSearch](/python/examples/vector_stores/opensearchdemo/index.md)
- [Pinecone](/python/examples/vector_stores/pineconeindexdemo/index.md)
- [Pinecone Hybrid Search](/python/examples/vector_stores/pineconeindexdemo-hybrid/index.md)
- [PGvectoRS](/python/examples/vector_stores/pgvectorsdemo/index.md)
- [Postgres](/python/examples/vector_stores/postgres/index.md)
- [Redis](/python/examples/vector_stores/redisindexdemo/index.md)
- [Qdrant](/python/examples/vector_stores/qdrantindexdemo/index.md)
- [Qdrant Hybrid Search](/python/examples/vector_stores/qdrant_hybrid/index.md)
- [Rockset](/python/examples/vector_stores/rocksetindexdemo/index.md)
- [S3](/python/examples/vector_stores/s3vectorstore/index.md)
- [Simple](/python/examples/vector_stores/simpleindexdemo/index.md)
- [Supabase](/python/examples/vector_stores/supabasevectorindexdemo/index.md)
- [Tablestore](/python/examples/vector_stores/tablestoredemo/index.md)
- [Tair](/python/examples/vector_stores/tairindexdemo/index.md)
- [TiDB](/python/examples/vector_stores/tidbvector/index.md)
- [Tencent](/python/examples/vector_stores/tencentvectordbindexdemo/index.md)
- [Timesacle](/python/examples/vector_stores/timescalevector/index.md)
- [Upstash](/python/examples/vector_stores/upstashvectordemo/index.md)
- [VectorX DB](/python/examples/vector_stores/vectorxdbdemo/index.md)
- [Vearch](/python/examples/vector_stores/vearchdemo/index.md)
- [Vespa](/python/examples/vector_stores/vespaindexdemo/index.md)
- [Vertex AI Vector Search](/python/examples/vector_stores/vertexaivectorsearchdemo/index.md)
- [Weaviate](/python/examples/vector_stores/weaviateindexdemo/index.md)
- [Weaviate Hybrid Search](/python/examples/vector_stores/weaviateindexdemo-hybrid/index.md)
- [WordLift](/python/examples/vector_stores/wordliftdemo/index.md)
- [Zep](/python/examples/vector_stores/zepindexdemo/index.md)
