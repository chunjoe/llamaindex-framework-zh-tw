---
title: "ApertureDB 作為 Vector Store，帶有 LlamaIndex。"
---

**注意：此範例假設可以存取 ApertureDB 實例，並且有可用的 APERTUREDB\_KEY。請註冊一個 [免費帳戶](https://cloud.aperturedata.io/)，或考慮[本地安裝](https://docs.aperturedata.io/Setup/server/Local)。**

本筆筆記包含使用 ApertureDB 作為 vector store 的範例，以及如何用它進行 semantic search，在 LlamaIndex framework 內。

### 使用 pip 安裝依賴項

```
%pip install llama-index llama-index-llms-openai llama-index-embeddings-openai llama-index-vector-stores-ApertureDB
```

### 下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

### 匯入依賴項

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core import StorageContext


from llama_index.core.vector_stores import MetadataFilters
from llama_index.core.graph_stores import SimpleGraphStore
from llama_index.vector_stores.ApertureDB import ApertureDBVectorStore
from llama_index.core import Document


import logging


logging.basicConfig(level=logging.ERROR)
```

### 建立 ApertureDBVectorStore

```
adb_vector_store = ApertureDBVectorStore(dimensions=1536)
```

### 將資料新增到 Vector Store。

這只需要執行一次，生成的 embeddings 和 metadata 可以重複查詢。

```
storage_context = StorageContext.from_defaults(
    vector_store=adb_vector_store, graph_store=SimpleGraphStore()
)


documents: Document = SimpleDirectoryReader("./data/paul_graham/").load_data()
index: VectorStoreIndex = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

### 使用純 Semantic search 查詢 Vector Store。

```
index = VectorStoreIndex.from_vector_store(vector_store=adb_vector_store)


query_engine = index.as_query_engine()




def run_queries(query_engine):
    query_str = [
        "What did the author do growing up?",
        "What did the author do after his time at Viaweb?",
    ]
    for qs in query_str:
        response = query_engine.query(qs)
        print(f"{qs=}")
        print(f"{response.response=}")
        print("===" * 20)




run_queries(query_engine)
```

```
qs='What did the author do growing up?'
response.response='The author worked on writing and programming before college.'
============================================================
qs='What did the author do after his time at Viaweb?'
response.response='After his time at Viaweb, the author started working on a new project related to web applications. He had the idea to build a web app for making web apps and decided to move to Cambridge to start this new venture. Initially planning to start a company called Aspra, he eventually shifted focus and decided to work on a subset of the project that could be done as an open source project. This led him to work on a new dialect of Lisp called Arc, which he and his colleague began working on in a house he bought in Cambridge.'
============================================================
```

## 帶有篩選器的搜尋

在某些情況下，可能需要根據 metadata 指定篩選器，因為這可以為 LLM 提供更精確的上下文。LlamaIndex 允許您將這些作為附加到自然語言基礎查詢中的條件來指定。

### 加上帶有自訂 metadata 的 documents

在這裡，我們插入 documents 及其一些重要的 metadata，這些 metadata 將在查詢時被使用。

```
# Create another instance of the vector store with a different descriptor set
adb_filterable_vector_store = ApertureDBVectorStore(
    dimensions=1536, descriptor_set="filterbale_embeddings"
)


# Create a new storage context with the filterable vector store
storage_context = StorageContext.from_defaults(
    vector_store=adb_filterable_vector_store, graph_store=SimpleGraphStore()
)


# We crereate a new index.
documents = [
    Document(
        text="The band Van Halen was formed in 1973. The band was named after the Van Halen brothers, Eddie Van Halen and Alex Van Halen. They also had"
        " a third member, David Lee Roth, who was the lead singer and Michael Anthony on the bass The band was known for their energetic performances and innovative guitar work.",
        metadata={"members_start_year": 1974, "members_end_year": 1985},
    ),
    Document(
        text="Roth left the band in 1985 to pursue a solo career. He was replaced by Sammy Hagar, who had previously been the lead singer of the band Montrose. Hagar's"
        " first album with Van Halen, 5150, was released in 1986 and was a commercial success. The band continued to release successful albums throughout the late 1980s and early 1990s.",
        metadata={"members_start_year": 1985, "members_end_year": 1996},
    ),
    Document(
        text="Former extreme vocalist Gary Cherone replaced Hagar in 1996. The band released the album Van Halen III in 1998, which was not as successful as their previous albums. Cherone left the band in 1999.",
        metadata={"members_start_year": 1996, "members_end_year": 1999},
    ),
]


index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

### 帶有篩選器的查詢引擎。

基於先前套用的 metadata，這裡的查詢會執行額外的篩選，這些篩選會被轉換為 Vector Store 中的對應 DB 查詢。

```
from llama_index.core.vector_stores.types import (
    MetadataFilter,
    FilterOperator,
    FilterCondition,
)


adb_filterable_vector_store = ApertureDBVectorStore(
    dimensions=1536, descriptor_set="filterbale_embeddings"
)


index = VectorStoreIndex.from_vector_store(
    vector_store=adb_filterable_vector_store
)


year_ranges = [(1974, 1985), (1985, 1996), (1996, 1999)]
for start_year, end_year in year_ranges:
    filters = MetadataFilters(
        filters=[
            MetadataFilter(
                key="members_start_year",
                value=end_year - 1,
                operator=FilterOperator.LT,
            )
        ],
        condition=FilterCondition.AND,
    )


    query_engine = index.as_query_engine(filters=filters, similarity_top_k=3)
    response = query_engine.query(
        "Who have been the members of Van Halen? Just list their names."
    )


    print(f"{response.response=}, {len(response.source_nodes)=}")
    for i, source_node in enumerate(response.source_nodes):
        print(f"{i=}, {source_node=}")
```

```
constraints: {'all': {'lm_members_start_year': ['<', 1984]}}
response.response='Eddie Van Halen, Alex Van Halen, David Lee Roth, Michael Anthony', len(response.source_nodes)=1
i=0, source_node=NodeWithScore(node=TextNode(id_='c8db04ed-c671-457b-a46f-8669f2965566', embedding=None, metadata={'members_start_year': 1974, 'members_end_year': 1985}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={<NodeRelationship.SOURCE: '1'>: RelatedNodeInfo(node_id='7f7c2ff7-81a3-4c56-9727-99e6dd651316', node_type='4', metadata={'members_start_year': 1974, 'members_end_year': 1985}, hash='42edbe1c3bfd0ab6a62b36433a35842d77a4d9c3529e71554903b90b9af752cf')}, metadata_template='{key}: {value}', metadata_separator='\n', text='The band Van Halen was formed in 1973. The band was named after the Van Halen brothers, Eddie Van Halen and Alex Van Halen. They also had a third member, David Lee Roth, who was the lead singer and Michael Anthony on the bass The band was known for their energetic performances and innovative guitar work.', mimetype='text/plain', start_char_idx=0, end_char_idx=305, metadata_seperator='\n', text_template='{metadata_str}\n\n{content}'), score=0.8595238924026489)
constraints: {'all': {'lm_members_start_year': ['<', 1995]}}
response.response='Eddie Van Halen, Alex Van Halen, David Lee Roth, Michael Anthony, Sammy Hagar', len(response.source_nodes)=2
i=0, source_node=NodeWithScore(node=TextNode(id_='c8db04ed-c671-457b-a46f-8669f2965566', embedding=None, metadata={'members_start_year': 1974, 'members_end_year': 1985}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={<NodeRelationship.SOURCE: '1'>: RelatedNodeInfo(node_id='7f7c2ff7-81a3-4c56-9727-99e6dd651316', node_type='4', metadata={'members_start_year': 1974, 'members_end_year': 1985}, hash='42edbe1c3bfd0ab6a62b36433a35842d77a4d9c3529e71554903b90b9af752cf')}, metadata_template='{key}: {value}', metadata_separator='\n', text='The band Van Halen was formed in 1973. The band was named after the Van Halen brothers, Eddie Van Halen and Alex Van Halen. They also had a third member, David Lee Roth, who was the lead singer and Michael Anthony on the bass The band was known for their energetic performances and innovative guitar work.', mimetype='text/plain', start_char_idx=0, end_char_idx=305, metadata_seperator='\n', text_template='{metadata_str}\n\n{content}'), score=0.8595238924026489)
i=1, source_node=NodeWithScore(node=TextNode(id_='ba5f62a9-ca24-40a0-9df9-4cdf2face112', embedding=None, metadata={'members_start_year': 1985, 'members_end_year': 1996}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={<NodeRelationship.SOURCE: '1'>: RelatedNodeInfo(node_id='e90ae355-d5cf-42c5-b806-ba16cca36533', node_type='4', metadata={'members_start_year': 1985, 'members_end_year': 1996}, hash='4227ea586ff12f5456020d263c53bc3aee3723b692a338437261338af3033a39')}, metadata_template='{key}: {value}', metadata_separator='\n', text="Roth left the band in 1985 to pursue a solo career. He was replaced by Sammy Hagar, who had previously been the lead singer of the band Montrose. Hagar's first album with Van Halen, 5150, was released in 1986 and was a commercial success. The band continued to release successful albums throughout the late 1980s and early 1990s.", mimetype='text/plain', start_char_idx=0, end_char_idx=329, metadata_seperator='\n', text_template='{metadata_str}\n\n{content}'), score=0.8247531056404114)
constraints: {'all': {'lm_members_start_year': ['<', 1998]}}
response.response='Eddie Van Halen, Alex Van Halen, David Lee Roth, Michael Anthony, Sammy Hagar, Gary Cherone', len(response.source_nodes)=3
i=0, source_node=NodeWithScore(node=TextNode(id_='c8db04ed-c671-457b-a46f-8669f2965566', embedding=None, metadata={'members_start_year': 1974, 'members_end_year': 1985}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={<NodeRelationship.SOURCE: '1'>: RelatedNodeInfo(node_id='7f7c2ff7-81a3-4c56-9727-99e6dd651316', node_type='4', metadata={'members_start_year': 1974, 'members_end_year': 1985}, hash='42edbe1c3bfd0ab6a62b36433a35842d77a4d9c3529e71554903b90b9af752cf')}, metadata_template='{key}: {value}', metadata_separator='\n', text='The band Van Halen was formed in 1973. The band was named after the Van Halen brothers, Eddie Van Halen and Alex Van Halen. They also had a third member, David Lee Roth, who was the lead singer and Michael Anthony on the bass The band was known for their energetic performances and innovative guitar work.', mimetype='text/plain', start_char_idx=0, end_char_idx=305, metadata_seperator='\n', text_template='{metadata_str}\n\n{content}'), score=0.8595238924026489)
i=1, source_node=NodeWithScore(node=TextNode(id_='ba5f62a9-ca24-40a0-9df9-4cdf2face112', embedding=None, metadata={'members_start_year': 1985, 'members_end_year': 1996}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={<NodeRelationship.SOURCE: '1'>: RelatedNodeInfo(node_id='e90ae355-d5cf-42c5-b806-ba16cca36533', node_type='4', metadata={'members_start_year': 1985, 'members_end_year': 1996}, hash='4227ea586ff12f5456020d263c53bc3aee3723b692a338437261338af3033a39')}, metadata_template='{key}: {value}', metadata_separator='\n', text="Roth left the band in 1985 to pursue a solo career. He was replaced by Sammy Hagar, who had previously been the lead singer of the band Montrose. Hagar's first album with Van Halen, 5150, was released in 1986 and was a commercial success. The band continued to release successful albums throughout the late 1980s and early 1990s.", mimetype='text/plain', start_char_idx=0, end_char_idx=329, metadata_seperator='\n', text_template='{metadata_str}\n\n{content}'), score=0.8247531056404114)
i=2, source_node=NodeWithScore(node=TextNode(id_='7afb9c0f-d85e-44cb-b04d-0e75f89dac39', embedding=None, metadata={'members_start_year': 1996, 'members_end_year': 1999}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={<NodeRelationship.SOURCE: '1'>: RelatedNodeInfo(node_id='b3382177-c9f7-4599-ba39-34ee662ff5ce', node_type='4', metadata={'members_start_year': 1996, 'members_end_year': 1999}, hash='94f9cf0ca6e2e7afc72c664d81a5acfe57f11142be1ad68c22371649ab9a2e45')}, metadata_template='{key}: {value}', metadata_separator='\n', text='Former extreme vocalist Gary Cherone replaced Hagar in 1996. The band released the album Van Halen III in 1998, which was not as successful as their previous albums. Cherone left the band in 1999.', mimetype='text/plain', start_char_idx=0, end_char_idx=196, metadata_seperator='\n', text_template='{metadata_str}\n\n{content}'), score=0.8231234550476074)
```
