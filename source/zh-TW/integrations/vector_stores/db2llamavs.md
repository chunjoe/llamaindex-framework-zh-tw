---
title: "IBM Db2 Vector Store 和 Vector Search"
---

LlamaIndex 的 Db2 整合 (llama-index-vector-stores-db2) 為使用 IBM 關聯式資料庫 Db2 版本 v12.1.2 及以上版本提供向量儲存和向量搜尋功能，並在 MIT 授權下發布。使用者可以將提供的實作直接使用，或為特定需求進行客製化。主要功能包括：

- 帶有 metadata 的向量儲存
- 向量相似度搜尋和過濾選項
- 對 EUCLIDEAN\_DISTANCE、DOT\_PRODUCT、COSINE、MANHATTAN\_DISTANCE、HAMMING\_DISTANCE 和 EUCLIDEAN\_SQUARED distance metrics 的支援
- 透過索引建立和 Approximate nearest neighbors search 進行效能優化。（將很快加入）

### 使用 LlamaIndex 與 Db2 Vector Store 和 Search 的先決條件

安裝 `llama-index-vector-stores-db2` 套件，它是 db2 LlamaIndex Vector Store 和 Search 的整合套件。

```
# pip install llama-index-vector-stores-db2
```

### 連線到 Db2 Vector Store

以下範例程式碼將展示如何連線到 Db2 Database。除了上述依賴項外，您還需要一個正在運行的 Db2 資料庫實例（版本 v12.1.2+，具備向量資料型態支援）。

```
import ibm_db
import ibm_db_dbi


database = ""
username = ""
password = ""


try:
    connection = ibm_db_dbi.connect(database, username, password)
    print("Connection successful!")
except Exception as e:
    print("Connection failed!", e)
```

### 匯入所需的依賴項

```
from llama_index.core.schema import NodeRelationship, RelatedNodeInfo, TextNode
from llama_index.core.vector_stores.types import (
    ExactMatchFilter,
    MetadataFilters,
    VectorStoreQuery,
)


from llama_index.vector_stores.db2 import base as db2llamavs
from llama_index.vector_stores.db2 import DB2LlamaVS, DistanceStrategy
```

### 載入 Documents

```
# Define a list of documents (These dummy examples are 4 random documents )
text_json_list = [
    {
        "text": "Db2 handles LOB data differently than other kinds of data. As a result, you sometimes need to take additional actions when you define LOB columns and insert the LOB data.",
        "id_": "doc_1_2_P4",
        "embedding": [1.0, 0.0],
        "relationships": "test-0",
        "metadata": {
            "weight": 1.0,
            "rank": "a",
            "url": "https://www.ibm.com/docs/en/db2-for-zos/12?topic=programs-storing-lob-data-in-tables",
        },
    },
    {
        "text": "Introduced in Db2 13, SQL Data Insights brought artificial intelligence (AI) functionality to the Db2 for z/OS engine. It provided the capability to run SQL AI query to find valuable insights hidden in your Db2 data and help you make better business decisions.",
        "id_": "doc_15.5.1_P1",
        "embedding": [0.0, 1.0],
        "relationships": "test-1",
        "metadata": {
            "weight": 2.0,
            "rank": "c",
            "url": "https://community.ibm.com/community/user/datamanagement/blogs/neena-cherian/2023/03/07/accelerating-db2-ai-queries-with-the-new-vector-pr",
        },
    },
    {
        "text": "Data structures are elements that are required to use DB2®. You can access and use these elements to organize your data. Examples of data structures include tables, table spaces, indexes, index spaces, keys, views, and databases.",
        "id_": "id_22.3.4.3.1_P2",
        "embedding": [1.0, 1.0],
        "relationships": "test-2",
        "metadata": {
            "weight": 3.0,
            "rank": "d",
            "url": "https://www.ibm.com/docs/en/zos-basic-skills?topic=concepts-db2-data-structures",
        },
    },
    {
        "text": "DB2® maintains a set of tables that contain information about the data that DB2 controls. These tables are collectively known as the catalog. The catalog tables contain information about DB2 objects such as tables, views, and indexes. When you create, alter, or drop an object, DB2 inserts, updates, or deletes rows of the catalog that describe the object.",
        "id_": "id_3.4.3.1_P3",
        "embedding": [2.0, 1.0],
        "relationships": "test-3",
        "metadata": {
            "weight": 4.0,
            "rank": "e",
            "url": "https://www.ibm.com/docs/en/zos-basic-skills?topic=objects-db2-catalog",
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

### 使用 AI Vector Search 建立具有不同距離策略的許多 Vector Stores

首先，我們將建立三個具有不同距離函式的向量儲存。

您可以手動連線到 Db2 Database，並看到三個表格 Documents\_DOT、Documents\_COSINE 和 Documents\_EUCLIDEAN。

```
# Ingest documents into Db2 Vector Store using different distance strategies
vector_store_dot = DB2LlamaVS.from_documents(
    text_nodes,
    table_name="Documents_DOT",
    client=connection,
    distance_strategy=DistanceStrategy.DOT_PRODUCT,
    embed_dim=2,
)
vector_store_max = DB2LlamaVS.from_documents(
    text_nodes,
    table_name="Documents_COSINE",
    client=connection,
    distance_strategy=DistanceStrategy.COSINE,
    embed_dim=2,
)
vector_store_euclidean = DB2LlamaVS.from_documents(
    text_nodes,
    table_name="Documents_EUCLIDEAN",
    client=connection,
    distance_strategy=DistanceStrategy.EUCLIDEAN_DISTANCE,
    embed_dim=2,
)
```

### 示範對文本的 add、delete 操作和基本相似度搜尋

```
def manage_texts(vector_stores):
    for i, vs in enumerate(vector_stores, start=1):
        # Adding texts
        try:
            vs.add_texts(text_nodes, metadata)
            print(f"\n\n\nAdd texts complete for vector store {i}\n\n\n")
        except Exception as ex:
            print(
                f"\n\n\nExpected error on duplicate add for vector store {i}\n\n\n"
            )


        # Deleting texts using the value of 'doc_id'
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
]
manage_texts(vector_store_list)
```

### 現在我們將對所有 3 個向量儲存進行一系列進階搜尋。

```
def conduct_advanced_searches(vector_stores):
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
            print("\nSimilarity search results with filter:")
            filters = MetadataFilters(
                filters=[ExactMatchFilter(key="rank", value="c")]
            )
            query = VectorStoreQuery(
                query_embedding=[1.0, 1.0], filters=filters, similarity_top_k=3
            )
            result = vs.query(query)
            print(result.ids)


        query_with_filters_returns_multiple_matches()


        def query_with_filter_applies_top_k():
            print(f"\n--- Vector Store {i} Advanced Searches ---")
            # Similarity search with a filter
            print("\nSimilarity search results with top k filter:")
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
            print("\nSimilarity search results with node_id filter:")
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

### 端到端示範