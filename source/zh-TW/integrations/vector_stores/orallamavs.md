---
title: "Oracle AI Vector Search：向量儲存庫"
---

Oracle AI Vector Search 專為人工智慧（AI）工作負載打造，可依語意而非關鍵字查詢資料。它的一大優勢，是能在同一套系統中，結合非結構化資料的語意搜尋與商務資料的關聯式搜尋。這不只功能強大，也能避免額外導入專用向量資料庫，減少多個系統間資料分散所帶來的管理負擔。

此外，向量資料也能運用 Oracle Database 多項強大的功能，例如：

- [分區支援](https://www.oracle.com/database/technologies/partitioning.html)
- [Real Application Clusters 擴充性](https://www.oracle.com/database/real-application-clusters/)
- [Exadata 智慧掃描](https://www.oracle.com/database/technologies/exadata/software/smartscan/)
- [跨地理區域分散式資料庫的分片處理](https://www.oracle.com/database/distributed-database/)
- [交易處理](https://docs.oracle.com/en/database/oracle/oracle-database/23/cncpt/transactions.html)
- [平行 SQL](https://docs.oracle.com/en/database/oracle/oracle-database/21/vldbg/parallel-exec-intro.html#GUID-D28717E4-0F77-44F5-BB4E-234C31D4E4BA)
- [災難復原](https://www.oracle.com/database/data-guard/)
- [安全性](https://www.oracle.com/security/database-security/)
- [Oracle Machine Learning](https://www.oracle.com/artificial-intelligence/database-machine-learning/)
- [Oracle Graph Database](https://www.oracle.com/database/integrated-graph-database/)
- [Oracle Spatial and Graph](https://www.oracle.com/database/spatial/)
- [Oracle Blockchain](https://docs.oracle.com/en/database/oracle/oracle-database/23/arpls/dbms_blockchain_table.html#GUID-B469E277-978E-4378-A8C1-26D3FF96C9A6)
- [JSON](https://docs.oracle.com/en/database/oracle/oracle-database/23/adjsn/json-in-oracle-database.html)

本指南示範如何使用 Oracle AI Vector Search 的向量功能。

如果你剛開始使用 Oracle Database，可以先看看[免費版 Oracle Database 23ai](https://www.oracle.com/database/free/#resources)，了解如何設定資料庫環境。使用資料庫時，通常不建議預設使用 system 使用者；你可以建立自己的使用者，以提升安全性並依需求調整設定。如需建立使用者的詳細步驟，請參閱我們的[端對端指南](https://github.com/run-llama/llama_index/blob/main/docs/examples/cookbooks/oracleai_demo.ipynb)，其中也示範如何在 Oracle 中設定使用者。此外，了解使用者權限對有效管理資料庫安全性也很重要。你可以參閱 Oracle 官方的[使用者帳戶與安全性管理指南](https://docs.oracle.com/en/database/oracle/oracle-database/19/admqs/administering-user-accounts-and-security.html#GUID-36B21D72-1BBB-46C9-A0C9-F0D2A8591B8D)，深入了解相關內容。

### 先決條件

若要搭配 Oracle AI Vector Search 使用 LlamaIndex，請先安裝 Oracle Python Client 驅動程式。

```
%pip install llama-index-vector-stores-oracledb
```

### 連線至 Oracle AI Vector Search

以下範例程式碼示範如何連線至 Oracle Database。python-oracledb 預設會以 Thin 模式直接連線至 Oracle Database，無須安裝 Oracle Client 程式庫。不過，使用 Oracle Client 程式庫可支援部分額外功能；這種連線方式稱為 Thick 模式。兩種模式都完整支援 Python Database API v2.0 Specification。各模式支援的功能詳情請參閱這份[指南](https://python-oracledb.readthedocs.io/en/latest/user_guide/appendix_a.html#featuresummary)。如果 Thin 模式無法滿足需求，可以改用 Thick 模式。

```
import oracledb


# please update with your username, password, hostname and service_name
username = "<username>"
password = "<password>"
dsn = "<hostname>/<service_name>"


try:
    connection = oracledb.connect(user=username, password=password, dsn=dsn)
    print("Connection successful!")
except Exception as ex:
    print("Exception occurred while index creation", ex)
```

### 匯入 Oracle AI Vector Search 所需的相依套件

```
import sys
import os




from llama_index.core.schema import NodeRelationship, RelatedNodeInfo, TextNode
from llama_index.core.vector_stores.types import (
    ExactMatchFilter,
    MetadataFilters,
    VectorStoreQuery,
)


from llama_index.vector_stores.oracledb import base as orallamavs
from llama_index.vector_stores.oracledb import OraLlamaVS, DistanceStrategy
```

### 載入文件

```
# Define a list of documents (These dummy examples are 4 random documents )


text_json_list = [
    {
        "text": "If the answer to any preceding questions is yes, then the database stops the search and allocates space from the specified tablespace; otherwise, space is allocated from the database default shared temporary tablespace.",
        "id_": "cncpt_15.5.3.2.2_P4",
        "embedding": [1.0, 0.0],
        "relationships": "test-0",
        "metadata": {
            "weight": 1.0,
            "rank": "a",
            "url": "https://docs.oracle.com/en/database/oracle/oracle-database/23/cncpt/logical-storage-structures.html#GUID-5387D7B2-C0CA-4C1E-811B-C7EB9B636442",
        },
    },
    {
        "text": "A tablespace can be online (accessible) or offline (not accessible) whenever the database is open.\nA tablespace is usually online so that its data is available to users. The SYSTEM tablespace and temporary tablespaces cannot be taken offline.",
        "id_": "cncpt_15.5.5_P1",
        "embedding": [0.0, 1.0],
        "relationships": "test-1",
        "metadata": {
            "weight": 2.0,
            "rank": "c",
            "url": "https://docs.oracle.com/en/database/oracle/oracle-database/23/cncpt/logical-storage-structures.html#GUID-D02B2220-E6F5-40D9-AFB5-BC69BCEF6CD4",
        },
    },
    {
        "text": "The database stores LOBs differently from other data types. Creating a LOB column implicitly creates a LOB segment and a LOB index. The tablespace containing the LOB segment and LOB index, which are always stored together, may be different from the tablespace containing the table.\nSometimes the database can store small amounts of LOB data in the table itself rather than in a separate LOB segment.",
        "id_": "cncpt_22.3.4.3.1_P2",
        "embedding": [1.0, 1.0],
        "relationships": "test-2",
        "metadata": {
            "weight": 3.0,
            "rank": "d",
            "url": "https://docs.oracle.com/en/database/oracle/oracle-database/23/cncpt/concepts-for-database-developers.html#GUID-3C50EAB8-FC39-4BB3-B680-4EACCE49E866",
        },
    },
    {
        "text": "The LOB segment stores data in pieces called chunks. A chunk is a logically contiguous set of data blocks and is the smallest unit of allocation for a LOB. A row in the table stores a pointer called a LOB locator, which points to the LOB index. When the table is queried, the database uses the LOB index to quickly locate the LOB chunks.",
        "id_": "cncpt_22.3.4.3.1_P3",
        "embedding": [2.0, 1.0],
        "relationships": "test-3",
        "metadata": {
            "weight": 4.0,
            "rank": "e",
            "url": "https://docs.oracle.com/en/database/oracle/oracle-database/23/cncpt/concepts-for-database-developers.html#GUID-3C50EAB8-FC39-4BB3-B680-4EACCE49E866",
        },
    },
]
```

```
# Create Llama Text Nodes
text_nodes = []
for text_json in text_json_list:
    # Construct the relationships using RelatedNodeInfo
    relationships = {
        NodeRelationship.SOURCE: RelatedNodeInfo(
            node_id=text_json["relationships"]
        )
    }


    # Prepare the metadata dictionary; you might want to exclude certain metadata fields if necessary
    metadata = {
        "weight": text_json["metadata"]["weight"],
        "rank": text_json["metadata"]["rank"],
    }


    # Create a TextNode instance
    text_node = TextNode(
        text=text_json["text"],
        id_=text_json["id_"],
        embedding=text_json["embedding"],
        relationships=relationships,
        metadata=metadata,
    )


    text_nodes.append(text_node)
print(text_nodes)
```

### 使用 AI Vector Search 建立採用不同距離策略的多個 Vector Store

首先，我們會建立三個 Vector Store，分別使用不同的距離函式。目前尚未建立索引，因此這些 Vector Store 暫時只會建立資料表；稍後我們會用它們建立 HNSW 索引。

連線至 Oracle Database 後，可以看到三個資料表：Documents\_DOT、Documents\_COSINE 和 Documents\_EUCLIDEAN。

接著，我們會再建立三個資料表：Documents\_DOT\_IVF、Documents\_COSINE\_IVF 和 Documents\_EUCLIDEAN\_IVF，並在這些資料表上建立 IVF 索引，而不是 HNSW 索引。

如需了解 Oracle AI Vector Search 支援的索引類型，請參閱這份[指南](https://docs.oracle.com/en/database/oracle/oracle-database/23/vecse/manage-different-categories-vector-indexes.html)

```
# Ingest documents into Oracle Vector Store using different distance strategies


vector_store_dot = OraLlamaVS.from_documents(
    text_nodes,
    table_name="Documents_DOT",
    client=connection,
    distance_strategy=DistanceStrategy.DOT_PRODUCT,
)
vector_store_max = OraLlamaVS.from_documents(
    text_nodes,
    table_name="Documents_COSINE",
    client=connection,
    distance_strategy=DistanceStrategy.COSINE,
)
vector_store_euclidean = OraLlamaVS.from_documents(
    text_nodes,
    table_name="Documents_EUCLIDEAN",
    client=connection,
    distance_strategy=DistanceStrategy.EUCLIDEAN_DISTANCE,
)


# Ingest documents into Oracle Vector Store using different distance strategies
vector_store_dot_ivf = OraLlamaVS.from_documents(
    text_nodes,
    table_name="Documents_DOT_IVF",
    client=connection,
    distance_strategy=DistanceStrategy.DOT_PRODUCT,
)
vector_store_max_ivf = OraLlamaVS.from_documents(
    text_nodes,
    table_name="Documents_COSINE_IVF",
    client=connection,
    distance_strategy=DistanceStrategy.COSINE,
)
vector_store_euclidean_ivf = OraLlamaVS.from_documents(
    text_nodes,
    table_name="Documents_EUCLIDEAN_IVF",
    client=connection,
    distance_strategy=DistanceStrategy.EUCLIDEAN_DISTANCE,
)
```

### 示範如何新增、刪除文字，以及執行基本相似度搜尋

```
def manage_texts(vector_stores):
    """
    Adds texts to each vector store, demonstrates error handling for duplicate additions,
    and performs deletion of texts. Showcases similarity searches and index creation for each vector store.


    Args:
    - vector_stores (list): A list of OracleVS instances.
    """
    for i, vs in enumerate(vector_stores, start=1):
        # Deleting texts using the value of 'id'
        vs.delete("test-1")
        print(f"\n\n\nDelete texts complete for vector store {i}\n\n\n")


        # Similarity search
        query = VectorStoreQuery(
            query_embedding=[1.0, 1.0], similarity_top_k=3
        )
        results = vs.query(query=query)
        print(
            f"\n\n\nSimilarity search results for vector store {i}: {results}\n\n\n"
        )




vector_store_list = [
    vector_store_dot,
    vector_store_max,
    vector_store_euclidean,
    vector_store_dot_ivf,
    vector_store_max_ivf,
    vector_store_euclidean_ivf,
]
manage_texts(vector_store_list)
```

### 示範如何依不同距離策略設定參數並建立索引

```
def create_search_indices(connection):
    """
    Creates search indices for the vector stores, each with specific parameters tailored to their distance strategy.
    """
    # Index for DOT_PRODUCT strategy
    # Notice we are creating a HNSW index with default parameters
    # This will default to creating a HNSW index with 8 Parallel Workers and use the Default Accuracy used by Oracle AI Vector Search
    orallamavs.create_index(
        connection,
        vector_store_dot,
        params={"idx_name": "hnsw_idx1", "idx_type": "HNSW"},
    )


    # Index for COSINE strategy with specific parameters
    # Notice we are creating a HNSW index with parallel 16 and Target Accuracy Specification as 97 percent
    orallamavs.create_index(
        connection,
        vector_store_max,
        params={
            "idx_name": "hnsw_idx2",
            "idx_type": "HNSW",
            "accuracy": 97,
            "parallel": 16,
        },
    )


    # Index for EUCLIDEAN_DISTANCE strategy with specific parameters
    # Notice we are creating a HNSW index by specifying Power User Parameters which are neighbors = 64 and efConstruction = 100
    orallamavs.create_index(
        connection,
        vector_store_euclidean,
        params={
            "idx_name": "hnsw_idx3",
            "idx_type": "HNSW",
            "neighbors": 64,
            "efConstruction": 100,
        },
    )


    # Index for DOT_PRODUCT strategy with specific parameters
    # Notice we are creating an IVF index with default parameters
    # This will default to creating an IVF index with 8 Parallel Workers and use the Default Accuracy used by Oracle AI Vector Search
    orallamavs.create_index(
        connection,
        vector_store_dot_ivf,
        params={
            "idx_name": "ivf_idx1",
            "idx_type": "IVF",
        },
    )


    # Index for COSINE strategy with specific parameters
    # Notice we are creating an IVF index with parallel 32 and Target Accuracy Specification as 90 percent
    orallamavs.create_index(
        connection,
        vector_store_max_ivf,
        params={
            "idx_name": "ivf_idx2",
            "idx_type": "IVF",
            "accuracy": 90,
            "parallel": 32,
        },
    )


    # Index for EUCLIDEAN_DISTANCE strategy with specific parameters
    # Notice we are creating an IVF index by specifying Power User Parameters which is neighbor_part = 64
    orallamavs.create_index(
        connection,
        vector_store_euclidean_ivf,
        params={
            "idx_name": "ivf_idx3",
            "idx_type": "IVF",
            "neighbor_part": 64,
        },
    )


    print("Index creation complete.")




create_search_indices(connection)
```

### 接著，我們會在六個 Vector Store 上執行進階搜尋。以下三種搜尋都會分別示範有篩選條件和沒有篩選條件的情況；篩選條件只會選出 ID 為 101 的文件，並排除其他文件

```
# Conduct advanced searches after creating the indices
def conduct_advanced_searches(vector_stores):
    # Constructing a filter for direct comparison against document metadata
    # This filter aims to include documents whose metadata 'id' is exactly '2'


    for i, vs in enumerate(vector_stores, start=1):


        def query_without_filters_returns_all_rows_sorted_by_similarity():
            print(f"\n--- Vector Store {i} Advanced Searches ---")
            # Similarity search without a filter
            print("\nSimilarity search results without filter:")
            query = VectorStoreQuery(
                query_embedding=[1.0, 1.0], similarity_top_k=3
            )
            print(vs.query(query=query))


        query_without_filters_returns_all_rows_sorted_by_similarity()


        def query_with_filters_returns_multiple_matches():
            print(f"\n--- Vector Store {i} Advanced Searches ---")
            # Similarity search with filter
            print("\nSimilarity search results without filter:")
            filters = MetadataFilters(
                filters=[ExactMatchFilter(key="rank", value="c")]
            )
            query = VectorStoreQuery(
                query_embedding=[1.0, 1.0], filters=filters, similarity_top_k=1
            )
            result = vs.query(query)
            print(result.ids)


        query_with_filters_returns_multiple_matches()


        def query_with_filter_applies_top_k():
            print(f"\n--- Vector Store {i} Advanced Searches ---")
            # Similarity search with a filter
            print("\nSimilarity search results with filter:")
            filters = MetadataFilters(
                filters=[ExactMatchFilter(key="rank", value="c")]
            )
            query = VectorStoreQuery(
                query_embedding=[1.0, 1.0], filters=filters, similarity_top_k=1
            )
            result = vs.query(query)
            print(result.ids)


        query_with_filter_applies_top_k()


        def query_with_filter_applies_node_id_filter():
            print(f"\n--- Vector Store {i} Advanced Searches ---")
            # Similarity search with a filter
            print("\nSimilarity search results with filter:")
            filters = MetadataFilters(
                filters=[ExactMatchFilter(key="rank", value="c")]
            )
            query = VectorStoreQuery(
                query_embedding=[1.0, 1.0],
                filters=filters,
                similarity_top_k=3,
                node_ids=["452D24AB-F185-414C-A352-590B4B9EE51B"],
            )
            result = vs.query(query)
            print(result.ids)


        query_with_filter_applies_node_id_filter()


        def query_with_exact_filters_returns_single_match():
            print(f"\n--- Vector Store {i} Advanced Searches ---")
            # Similarity search with a filter
            print("\nSimilarity search results with filter:")
            filters = MetadataFilters(
                filters=[
                    ExactMatchFilter(key="rank", value="c"),
                    ExactMatchFilter(key="weight", value=2),
                ]
            )
            query = VectorStoreQuery(
                query_embedding=[1.0, 1.0], filters=filters
            )
            result = vs.query(query)
            print(result.ids)


        query_with_exact_filters_returns_single_match()


        def query_with_contradictive_filter_returns_no_matches():
            filters = MetadataFilters(
                filters=[
                    ExactMatchFilter(key="weight", value=2),
                    ExactMatchFilter(key="weight", value=3),
                ]
            )
            query = VectorStoreQuery(
                query_embedding=[1.0, 1.0], filters=filters
            )
            result = vs.query(query)
            print(result.ids)


        query_with_contradictive_filter_returns_no_matches()


        def query_with_filter_on_unknown_field_returns_no_matches():
            print(f"\n--- Vector Store {i} Advanced Searches ---")
            # Similarity search with a filter
            print("\nSimilarity search results with filter:")
            filters = MetadataFilters(
                filters=[ExactMatchFilter(key="unknown_field", value="c")]
            )
            query = VectorStoreQuery(
                query_embedding=[1.0, 1.0], filters=filters
            )
            result = vs.query(query)
            print(result.ids)


        query_with_filter_on_unknown_field_returns_no_matches()


        def delete_removes_document_from_query_results():
            vs.delete("test-1")
            query = VectorStoreQuery(
                query_embedding=[1.0, 1.0], similarity_top_k=2
            )
            result = vs.query(query)
            print(result.ids)


        delete_removes_document_from_query_results()




conduct_advanced_searches(vector_store_list)
```

### 端對端示範

如需使用 Oracle AI Vector Search 建立完整的 RAG pipeline，請參閱我們的[Oracle AI Vector Search 端對端示範指南](https://github.com/run-llama/llama_index/blob/main/docs/examples/cookbooks/oracleai_demo.ipynb)。
