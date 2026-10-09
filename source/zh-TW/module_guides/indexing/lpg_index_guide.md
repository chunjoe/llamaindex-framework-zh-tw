---
title: "使用 Property Graph Index"
---

物件圖是帶有標籤的 nodes（即實體類別、文字標籤等）的知識集合，透過關係連結成結構化的路徑，這些物件具有屬性（即 metadata）。

在 LlamaIndex 中，`PropertyGraphIndex` 提供了關於以下事項的關鍵協調：

- 建構圖 (constructing a graph)
- 查詢圖 (querying a graph)

## 使用方法

基本使用方法可以透過直接匯入類別並使用它來找到：

```
from llama_index.core import PropertyGraphIndex


# create
index = PropertyGraphIndex.from_documents(
    documents,
)


# use
retriever = index.as_retriever(
    include_text=True,  # include source chunk with matching paths
    similarity_top_k=2,  # top k for vector kg node retrieval
)
nodes = retriever.retrieve("Test")


query_engine = index.as_query_engine(
    include_text=True,  # include source chunk with matching paths
    similarity_top_k=2,  # top k for vector kg node retrieval
)
response = query_engine.query("Test")


# save and load
index.storage_context.persist(persist_dir="./storage")


from llama_index.core import StorageContext, load_index_from_storage


index = load_index_from_storage(
    StorageContext.from_defaults(persist_dir="./storage")
)


# loading from existing graph store (and optional vector store)
# load from existing graph/vector store
index = PropertyGraphIndex.from_existing(
    property_graph_store=graph_store, vector_store=vector_store, ...
)
```

### 建構 (Construction)

在 LlamaIndex 中，物件圖的建構透過對每個 chunk 執行一系列 `kg_extractors`，並將實體和關係作為 metadata 附加到每個 llama-index node 上來完成。您可以在這裡使用任意數，它們都會被套用。

如果您已經使用過 [ingestion pipeline](/python/framework/module_guides/loading/ingestion_pipeline/) 中的轉換器或 metadata 提取器，那麼這會非常熟悉（而且這些 `kg_extractors` 與 ingestion pipeline 相容）！

提取器是使用適當的 kwarg 設定的：

```
index = PropertyGraphIndex.from_documents(
    documents,
    kg_extractors=[extractor1, extractor2, ...],
)


# insert additional documents / nodes
index.insert(document)
index.insert_nodes(nodes)
```

如果未提供，預設值是 `SimpleLLMPathExtractor` 和 `ImplicitPathExtractor`。

所有 `kg_extractors` 詳見下文。

#### (default) `SimpleLLMPathExtractor`

使用 LLM 來提示和解析單跳路徑，格式為 (`entity1`, `relation`, `entity2`) 的簡短陳述。

```
from llama_index.core.indices.property_graph import SimpleLLMPathExtractor


kg_extractor = SimpleLLMPathExtractor(
    llm=llm,
    max_paths_per_chunk=10,
    num_workers=4,
    show_progress=False,
)
```

如果您需要，也可以自訂提示和用於解析路徑的函式。

這裡是一個簡單的（但天真的）範例：

```
prompt = (
    "Some text is provided below. Given the text, extract up to "
    "{max_paths_per_chunk} "
    "knowledge triples in the form of `subject,predicate,object` on each line. Avoid stopwords.\n"
)




def parse_fn(response_str: str) -> List[Tuple[str, str, str]]:
    lines = response_str.split("\n")
    triples = [line.split(",") for line in lines]
    return triples




kg_extractor = SimpleLLMPathExtractor(
    llm=llm,
    extract_prompt=prompt,
    parse_fn=parse_fn,
)
```

#### (default) `ImplicitPathExtractor`

使用 `node.relationships` 屬性對每個 llama-index node 物件提取路徑。

此提取器不需要 LLM 或 embedding model 就能運行，因為它僅僅是解析已存在於 llama-index node 物件上的屬性。

```
from llama_index.core.indices.property_graph import ImplicitPathExtractor


kg_extractor = ImplicitPathExtractor()
```

#### `DynamicLLMPathExtractor`

根據可選的允許實體類型和關係類別列表，提取路徑（包括實體類型！）。如果未提供任何，則 LLM 會自行分配類型。如果提供了，它將幫助引導 LLM，但不會強制要求確切的類型。

```
from llama_index.core.indices.property_graph import DynamicLLMPathExtractor


kg_extractor = DynamicLLMPathExtractor(
    llm=llm,
    max_triplets_per_chunk=20,
    num_workers=4,
    allowed_entity_types=["POLITICIAN", "POLITICAL_PARTY"],
    allowed_relation_types=["PRESIDENT_OF", "MEMBER_OF"],
)
```

#### `SchemaLLMPathExtractor`

遵循允許的實體、關係以及哪些實體可以連接到哪些關係的嚴格模式來提取路徑。

使用 pydantic、LLMs 的結構化輸出，以及一些巧妙的驗證，我們可以動態指定模式並對每條路徑驗證提取結果。

```
from typing import Literal
from llama_index.core.indices.property_graph import SchemaLLMPathExtractor


# recommended uppercase, underscore separated
entities = Literal["PERSON", "PLACE", "THING"]
relations = Literal["PART_OF", "HAS", "IS_A"]
schema = {
    "PERSON": ["PART_OF", "HAS", "IS_A"],
    "PLACE": ["PART_OF", "HAS"],
    "THING": ["IS_A"],
}


kg_extractor = SchemaLLMPathExtractor(
    llm=llm,
    possible_entities=entities,
    possible_relations=relations,
    kg_validation_schema=schema,
    strict=True,  # if false, will allow triplets outside of the schema
    num_workers=4,
    max_triplets_per_chunk=10,
)
```

此提取器極度可自訂，並提供選項來自訂：

- 模式的各個方面（如上所示）
- `extract_prompt`
- `strict=False` 與 `strict=True`，以允許不在模式之外的三元組或不允許
- `raise_on_error=False` 與 `raise_on_error=True`，以控制是否吞噬並記錄 LLM API 錯誤（預設），或是否導致 pipeline 崩潰。
- 如果您是 pydantic 專業人士並想建立自訂驗證的 pydantic 類別，可以傳入您自己的 `kg_schema_cls`。

### 檢索與查詢 (Retrieval and Querying)

帶有標籤的物件圖可以透過多種方式進行查詢，以檢索 nodes 和路徑。在 LlamaIndex 中，我們可以一次組合多個 node 檢索方法！

```
# create a retriever
retriever = index.as_retriever(sub_retrievers=[retriever1, retriever2, ...])


# create a query engine
query_engine = index.as_query_engine(
    sub_retrievers=[retriever1, retriever2, ...]
)
```

如果未提供子檢索器，預設值是 `LLMSynonymRetriever` 和 `VectorContextRetriever`（如果啟用 embedding）。

所有檢索器目前都包含：

- `LLMSynonymRetriever` - 根據 LLM 生成的關鍵字/同義詞進行檢索
- `VectorContextRetriever` - 根據嵌入的圖 nodes 進行檢索
- `TextToCypherRetriever` - 要求 LLM 根據物件圖的模式生成 cypher
- `CypherTemplateRetriever` - 使用由 LLM 推斷的參數的 cypher template
- `CustomPGRetriever` - 易於子類和實作自訂檢索邏輯

通常，您會定義一個或多個這些子檢索器並將它們傳遞給 `PGRetriever`：

```
from llama_index.core.indices.property_graph import (
    PGRetriever,
    VectorContextRetriever,
    LLMSynonymRetriever,
)


sub_retrievers = [
    VectorContextRetriever(index.property_graph_store, ...),
    LLMSynonymRetriever(index.property_graph_store, ...),
]


retriever = PGRetriever(sub_retrievers=sub_retrievers)


nodes = retriever.retrieve("<query>")
```

請閱讀下文以了解所有檢索器的更多詳細資訊。

#### (default) `LLMSynonymRetriever` `LLMSynonymRetriever` 接收查詢，並嘗試生成關鍵字和同義詞以檢索 nodes（以及因此連接到該 nodes 的路徑）。

明確宣告 retriever 允許您自訂多個選項。以下是預設值：

```
from llama_index.core.indices.property_graph import LLMSynonymRetriever


prompt = (
    "Given some initial query, generate synonyms or related keywords up to {max_keywords} in total, "
    "considering possible cases of capitalization, pluralization, common expressions, etc.\n"
    "Provide all synonyms/keywords separated by '^' symbols: 'keyword1^keyword2^...'\n"
    "Note, result should be in one-line, separated by '^' symbols."
    "----\n"
    "QUERY: {query_str}\n"
    "----\n"
    "KEYWORDS: "
)




def parse_fn(self, output: str) -> list[str]:
    matches = output.strip().split("^")


    # capitalize to normalize with ingestion
    return [x.strip().capitalize() for x in matches if x.strip()]




synonym_retriever = LLMSynonymRetriever(
    index.property_graph_store,
    llm=llm,
    # include source chunk text with retrieved paths
    include_text=False,
    synonym_prompt=prompt,
    output_parsing_fn=parse_fn,
    max_keywords=10,
    # the depth of relations to follow after node retrieval
    path_depth=1,
)


retriever = index.as_retriever(sub_retrievers=[synonym_retriever])
```

#### (預設，若支援) `VectorContextRetriever`

`VectorContextRetriever` 根據向量相似度檢索 nodes，然後獲取連接到這些 nodes 的路徑。

如果您的 graph store 支援 vectors，則您只需為儲存管理該 graph store。否則，您需要提供一個 vector store，除了 graph store（預設使用 in-memory `SimpleVectorStore`）。

```
from llama_index.core.indices.property_graph import VectorContextRetriever


vector_retriever = VectorContextRetriever(
    index.property_graph_store,
    # only needed when the graph store doesn't support vector queries
    # vector_store=index.vector_store,
    embed_model=embed_model,
    # include source chunk text with retrieved paths
    include_text=False,
    # the number of nodes to fetch
    similarity_top_k=2,
    # the depth of relations to follow after node retrieval
    path_depth=1,
    # can provide any other kwargs for the VectorStoreQuery class
    ...,
)


retriever = index.as_retriever(sub_retrievers=[vector_retriever])
```

#### `TextToCypherRetriever`

`TextToCypherRetriever` 使用 graph store schema、您的 query 和一個 prompt template 進行 text-to-cypher，以生成並執行一個 cypher query。

**注意：** 由於 `SimplePropertyGraphStore` 並非實際的 graph database，它不支援 cypher queries。

您可以使用 `index.property_graph_store.get_schema_str()` 來檢查 schema。

```
from llama_index.core.indices.property_graph import TextToCypherRetriever


DEFAULT_RESPONSE_TEMPLATE = (
    "Generated Cypher query:\n{query}\n\n" "Cypher Response:\n{response}"
)
DEFAULT_ALLOWED_FIELDS = ["text", "label", "type"]


DEFAULT_TEXT_TO_CYPHER_TEMPLATE = (
    index.property_graph_store.text_to_cypher_template,
)




cypher_retriever = TextToCypherRetriever(
    index.property_graph_store,
    # customize the LLM, defaults to Settings.llm
    llm=llm,
    # customize the text-to-cypher template.
    # Requires `schema` and `question` template args
    text_to_cypher_template=DEFAULT_TEXT_TO_CYPHER_TEMPLATE,
    # customize how the cypher result is inserted into
    # a text node. Requires `query` and `response` template args
    response_template=DEFAULT_RESPONSE_TEMPLATE,
    # an optional callable that can clean/verify generated cypher
    cypher_validator=None,
    # allowed fields in the resulting
    allowed_output_field=DEFAULT_ALLOWED_FIELDS,
)
```

**注意：** 執行任意 cypher 存在風險。請確保您採取必要的措施（只讀角色、沙盒環境等），以確保在生產環境中的安全使用。

#### `CypherTemplateRetriever`

這是 `TextToCypherRetriever` 的一個更受限制的版本。與讓 LLM 自由生成任何 cypher statement 不同，我們可以提供一個 cypher template，讓 LLM 填補空白。

為了說明如何運作，這裡有一個小範例：

```
# NOTE: current v1 is needed
from pydantic import BaseModel, Field
from llama_index.core.indices.property_graph import CypherTemplateRetriever


# write a query with template params
cypher_query = """
MATCH (c:Chunk)-[:MENTIONS]->(o)
WHERE o.name IN $names
RETURN c.text, o.name, o.label;
"""




# create a pydantic class to represent the params for our query
# the class fields are directly used as params for running the cypher query
class TemplateParams(BaseModel):
    """Template params for a cypher query."""


    names: list[str] = Field(
        description="A list of entity names or keywords to use for lookup in a knowledge graph."
    )




template_retriever = CypherTemplateRetriever(
    index.property_graph_store, TemplateParams, cypher_query
)
```

## Storage

目前，支援 property graphs 的 graph stores 包括：

|                            | In-Memory | Native Embedding Support | Async | Server or disk based? |
| -------------------------- | --------- | ------------------------ | ----- | --------------------- |
| SimplePropertyGraphStore   | ✅         | ❌                        | ❌     | Disk                  |
| Neo4jPropertyGraphStore    | ❌         | ✅                        | ❌     | Server                |
| NebulaPropertyGraphStore   | ❌         | ❌                        | ❌     | Server                |
| TiDBPropertyGraphStore     | ❌         | ✅                        | ❌     | Server                |
| FalkorDBPropertyGraphStore | ❌         | ✅                        | ❌     | Server                |

### Saving 寫入/讀取磁碟

預設的 property graph store，`SimplePropertyGraphStore`，將所有內容儲存在記憶體中，並從磁碟中持久化和載入。

以下是使用預設 graph store 儲存/載入 index 的範例：

```
from llama_index.core import StorageContext, load_index_from_storage
from llama_index.core.indices import PropertyGraphIndex


# create
index = PropertyGraphIndex.from_documents(documents)


# save
index.storage_context.persist("./storage")


# load
storage_context = StorageContext.from_defaults(persist_dir="./storage")
index = load_index_from_storage(storage_context)
```

### Saving 與使用 Integrations 載入

Integrations 通常會自動儲存。有些 graph stores 支援 vectors，有些則不支援。您也可以將 graph store 與外部 vector db 結合使用。

此範例展示了如何使用 Neo4j 和 Qdrant 來儲存/載入 property graph index。

**注意：** 如果沒有傳入 qdrant，neo4j 會自行儲存和使用 embeddings。此範例說明了超出此情況的靈活性。

`pip install llama-index-graph-stores-neo4j llama-index-vector-stores-qdrant`

```
from llama_index.core import StorageContext, load_index_from_storage
from llama_index.core.indices import PropertyGraphIndex
from llama_index.graph_stores.neo4j import Neo4jPropertyGraphStore
from llama_index.vector_stores.qdrant import QdrantVectorStore
from qdrant_client import QdrantClient, AsyncQdrantClient


vector_store = QdrantVectorStore(
    "graph_collection",
    client=QdrantClient(...),
    aclient=AsyncQdrantClient(...),
)


graph_store = Neo4jPropertyGraphStore(
    username="neo4j",
    password="<password>",
    url="bolt://localhost:7687",
)


# creates an index
index = PropertyGraphIndex.from_documents(
    documents,
    property_graph_store=graph_store,
    # optional, neo4j also supports vectors directly
    vector_store=vector_store,
    embed_kg_nodes=True,
)


# load from existing graph/vector store
index = PropertyGraphIndex.from_existing(
    property_graph_store=graph_store,
    # optional, neo4j also supports vectors directly
    vector_store=vector_store,
    embed_kg_nodes=True,
)
```

### 使用 Property Graph Store Directly

property graphs 的基礎儲存類別是 `PropertyGraphStore`。這些 property graph stores 是使用不同類型的 `LabeledNode` 物件構建的，並使用 `Relation` 物件連接。

我們可以自己建立這些，也可以插入我們自己！

```
from llama_index.core.graph_stores import (
    SimplePropertyGraphStore,
    EntityNode,
    Relation,
)
from llama_index.core.schema import TextNode


graph_store = SimplePropertyGraphStore()


entities = [
    EntityNode(name="llama", label="ANIMAL", properties={"key": "val"}),
    EntityNode(name="index", label="THING", properties={"key": "val"}),
]


relations = [
    Relation(
        label="HAS",
        source_id=entities[0].id,
        target_id=entities[1].id,
        properties={},
    )
]


graph_store.upsert_nodes(entities)
graph_store.upsert_relations(relations)


# optionally, we can also insert text chunks
source_chunk = TextNode(id_="source", text="My llama has an index.")


# create relation for each of our entities
source_relations = [
    Relation(
        label="HAS_SOURCE",
        source_id=entities[0].id,
        target_id="source",
    ),
    Relation(
        label="HAS_SOURCE",
        source_id=entities[1].id,
        target_id="source",
    ),
]
graph_store.upsert_llama_nodes([source_chunk])
graph_store.upsert_relations(source_relations)
```

graph store 上其他有用的方法包括：

- `graph_store.get(ids=[])` - 根據 ids 獲取 nodes
- `graph_store.get(properties={"key": "val"})` - 根據匹配的 properties 獲取 nodes
- `graph_store.get_rel_map([entity_node], depth=2)` - 獲取到特定深度的 triples
- `graph_store.get_llama_nodes(['id1'])` - 獲取原始的 text nodes
- `graph_store.delete(ids=['id1'])` - 根據 ids 刪除
- `graph_store.delete(properties={"key": "val"})` - 根據 properties 刪除
- `graph_store.structured_query("<cypher query>")` - 執行一個 cypher query（假設 graph store 支援）

此外，對於所有這些功能都存在 `a` 版本以支援 async（即 `aget`, `adelete` 等）。

## Advanced Customization如同 LlamaIndex 中的所有元件，您可以子類模組並自訂使其完全符合您的需求，或嘗試新的想法並研究新的模組！

### 子類 Extractors

LlamaIndex 中的 Graph extractors 子類 `TransformComponent` class。如果您之前操作過 ingestion pipeline，這會很熟悉，因為它是同一個 class。

extractors 的要求是將 insert graph data 插入到 node 的 metadata 中，然後由 index 稍後處理。

以下是一個創建自訂 extractor 的子類範例：

```
from llama_index.core.graph_store.types import (
    EntityNode,
    Relation,
    KG_NODES_KEY,
    KG_RELATIONS_KEY,
)
from llama_index.core.schema import BaseNode, TransformComponent




class MyGraphExtractor(TransformComponent):
    # the init is optional
    # def __init__(self, ...):
    #     ...


    def __call__(
        self, llama_nodes: list[BaseNode], **kwargs
    ) -> list[BaseNode]:
        for llama_node in llama_nodes:
            # be sure to not overwrite existing entities/relations


            existing_nodes = llama_node.metadata.pop(KG_NODES_KEY, [])
            existing_relations = llama_node.metadata.pop(KG_RELATIONS_KEY, [])


            existing_nodes.append(
                EntityNode(
                    name="llama", label="ANIMAL", properties={"key": "val"}
                )
            )
            existing_nodes.append(
                EntityNode(
                    name="index", label="THING", properties={"key": "val"}
                )
            )


            existing_relations.append(
                Relation(
                    label="HAS",
                    source_id="llama",
                    target_id="index",
                    properties={},
                )
            )


            # add back to the metadata


            llama_node.metadata[KG_NODES_KEY] = existing_nodes
            llama_node.metadata[KG_RELATIONS_KEY] = existing_relations


        return llama_nodes


    # optional async method
    # async def acall(self, llama_nodes: list[BaseNode], **kwargs) -> list[BaseNode]:
    #    ...
```

### 子類 Retrievers

retriever 比 extractors 稍微複雜一些，它有自己的特殊 class 來幫助使子類變得更容易。

retrieval 的 return type 非常靈活，它可以是：

- 一個 string
- 一個 `TextNode`
- 一個 `NodeWithScore`
- 上述任何一種的列表 (list)

以下是一個創建自訂 retriever 的子類範例：

```
from llama_index.core.indices.property_graph import (
    CustomPGRetriever,
    CUSTOM_RETRIEVE_TYPE,
)




class MyCustomRetriever(CustomPGRetriever):
    def init(self, my_option_1: bool = False, **kwargs) -> None:
        """Uses any kwargs passed in from class constructor."""
        self.my_option_1 = my_option_1
        # optionally do something with self.graph_store


    def custom_retrieve(self, query_str: str) -> CUSTOM_RETRIEVE_TYPE:
        # some some operation with self.graph_store
        return "result"


    # optional async method
    # async def acustom_retrieve(self, query_str: str) -> str:
    #     ...




custom_retriever = MyCustomRetriever(graph_store, my_option_1=True)


retriever = index.as_retriever(sub_retrievers=[custom_retriever])
```

對於更複雜的自訂和使用案例，建議查看 source code 並直接子類 `BasePGRetriever`。

# 範例

在下方，您可以找到一些展示 `PropertyGraphIndex` 的範例 notebook：

- [Basic Usage](https://developers.llamaindex.ai/python/examples/property_graph/property_graph_basic/index.md)
- [Using Neo4j](https://developers.llamaindex.ai/python/examples/property_graph/property_graph_neo4j/index.md)
- [Using Nebula](https://developers.llamaindex.ai/python/examples/property_graph/property_graph_nebula/index.md)
- [Advanced Usage with Neo4j 以及本地 models](https://developers.llamaindex.ai/python/examples/property_graph/property_graph_advanced/index.md)
- [Using a Property Graph Store](https://developers.llamaindex.ai/python/examples/property_graph/graph_store/index.md)
- [Creating 自訂 Graph Retriever](https://developers.llamaindex.ai/python/examples/property_graph/property_graph_custom_retriever/index.md)
- [Comparing KG Extractors](https://developers.llamaindex.ai/python/examples/property_graph/dynamic_kg_extraction/index.md)