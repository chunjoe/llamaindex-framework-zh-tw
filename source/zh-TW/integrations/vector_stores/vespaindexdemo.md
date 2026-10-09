---
title: "Vespa Vector Store 示範"
---

如果您在 colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-vector-stores-vespa llama-index pyvespa
```

#### 設定 API key

```
import os
import openai


os.environ["OPENAI_API_KEY"] = "sk-..."
openai.api_key = os.environ["OPENAI_API_KEY"]
```

#### 載入 documents，建置 VectorStoreIndex

```
from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.vespa import VespaVectorStore
from IPython.display import Markdown, display
```

## 定義一些範例資料

讓我們插入一些 documents。

```
from llama_index.core.schema import TextNode


nodes = [
    TextNode(
        text="The Shawshank Redemption",
        metadata={
            "author": "Stephen King",
            "theme": "Friendship",
            "year": 1994,
        },
    ),
    TextNode(
        text="The Godfather",
        metadata={
            "director": "Francis Ford Coppola",
            "theme": "Mafia",
            "year": 1972,
        },
    ),
    TextNode(
        text="Inception",
        metadata={
            "director": "Christopher Nolan",
            "theme": "Fiction",
            "year": 2010,
        },
    ),
    TextNode(
        text="To Kill a Mockingbird",
        metadata={
            "author": "Harper Lee",
            "theme": "Mafia",
            "year": 1960,
        },
    ),
    TextNode(
        text="1984",
        metadata={
            "author": "George Orwell",
            "theme": "Totalitarianism",
            "year": 1949,
        },
    ),
    TextNode(
        text="The Great Gatsby",
        metadata={
            "author": "F. Scott Fitzgerald",
            "theme": "The American Dream",
            "year": 1925,
        },
    ),
    TextNode(
        text="Harry Potter and the Sorcerer's Stone",
        metadata={
            "author": "J.K. Rowling",
            "theme": "Fiction",
            "year": 1997,
        },
    ),
]
```

### 初始化 VespaVectorStore

為了讓您輕鬆開始，我們提供了一個 Vespa 應用程式範本，它將在初始化向量儲存時部署。

這是一個巨大的抽象層，有無限的機會根據您的需求來調整和自訂 Vespa 應用程式。但目前，讓我們保持簡單，使用預設範本進行初始化。

```
from llama_index.core import StorageContext


vector_store = VespaVectorStore()
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex(nodes, storage_context=storage_context)
```

### 刪除 documents

```
node_to_delete = nodes[0].node_id
node_to_delete
```

```
vector_store.delete(ref_doc_id=node_to_delete)
```

## 查詢

```
from llama_index.core.vector_stores.types import (
    VectorStoreQuery,
    VectorStoreQueryMode,
)
```

```
query = VectorStoreQuery(
    query_str="Great Gatsby",
    mode=VectorStoreQueryMode.TEXT_SEARCH,
    similarity_top_k=1,
)
result = vector_store.query(query)
```

```
result
```

## 作為 retriever

### 預設查詢模式（文字搜尋）

```
retriever = index.as_retriever(vector_store_query_mode="default")
results = retriever.retrieve("Who directed inception?")
display(Markdown(f"**Retrieved nodes:**\n {results}"))
```

```
retriever = index.as_retriever(vector_store_query_mode="semantic_hybrid")
results = retriever.retrieve("Who wrote Harry Potter?")
display(Markdown(f"**Retrieved nodes:**\n {results}"))
```

### 作為查詢引擎

```
query_engine = index.as_query_engine()
response = query_engine.query("Who directed inception?")
display(Markdown(f"**Response:** {response}"))
```

```
query_engine = index.as_query_engine(
    vector_store_query_mode="semantic_hybrid", verbose=True
)
response = query_engine.query(
    "When was the book about the wizard boy published and what was it called?"
)
display(Markdown(f"**Response:** {response}"))
display(Markdown(f"**Sources:** {response.source_nodes}"))
```

## 使用 metadata 篩選器

**注意**：此 metadata 篩選是透過 llama-index 執行的，不在 vespa 內部。對於原生且性能更好的篩選，您應該使用 Vespa 自己的篩選功能。

請參閱 [Vespa’s documentation](https://docs.vespa.ai/en/reference/query-language-reference.html) 了解更多資訊。

```
from llama_index.core.vector_stores import (
    FilterOperator,
    FilterCondition,
    MetadataFilter,
    MetadataFilters,
)


# Let's define a filter that will only allow nodes that has the theme "Fiction" OR is published after 1997


filters = MetadataFilters(
    filters=[
        MetadataFilter(key="theme", value="Fiction"),
        MetadataFilter(key="year", value=1997, operator=FilterOperator.GT),
    ],
    condition=FilterCondition.OR,
)


retriever = index.as_retriever(filters=filters)
result = retriever.retrieve("Harry Potter")
display(Markdown(f"**Result:** {result}"))
```

## 此整合的抽象層級

為了讓您輕鬆開始，我們提供了一個 Vespa 應用程式範本，它將在初始化向量儲存時部署。這減少了首次設定 Vespa 的一些複雜性，但對於嚴肅的用例，我們強烈建議您閱讀 [Vespa documentation](https://developers.llamaindex.ai/python/framework/integrations/vector_stores/vespaindexdemo/docs.vespa.ai/) 並根據您的需求調整應用程式。

### 範本

提供的範本 Vespa 應用程式如下所示：

```
from vespa.package import (
    ApplicationPackage,
    Field,
    Schema,
    Document,
    HNSW,
    RankProfile,
    Component,
    Parameter,
    FieldSet,
    GlobalPhaseRanking,
    Function,
)


hybrid_template = ApplicationPackage(
    name="hybridsearch",
    schema=[
        Schema(
            name="doc",
            document=Document(
                fields=[
                    Field(name="id", type="string", indexing=["summary"]),
                    Field(name="metadata", type="string", indexing=["summary"]),
                    Field(
                        name="text",
                        type="string",
                        indexing=["index", "summary"],
                        index="enable-bm25",
                        bolding=True,
                    ),
                    Field(
                        name="embedding",
                        type="tensor<float>(x[384])",
                        indexing=[
                            "input text",
                            "embed",
                            "index",
                            "attribute",
                        ],
                        ann=HNSW(distance_metric="angular"),
                        is_document_field=False,
                    ),
                ]
            ),
            fieldsets=[FieldSet(name="default", fields=["text", "metadata"])],
            rank_profiles=[
                RankProfile(
                    name="bm25",
                    inputs=[("query(q)", "tensor<float>(x[384])")],
                    functions=[Function(name="bm25sum", expression="bm25(text)")],
                    first_phase="bm25sum",
                ),
                RankProfile(
                    name="semantic",
                    inputs=[("query(q)", "tensor<float>(x[384])")],
                    first_phase="closeness(field, embedding)",
                ),
                RankProfile(
                    name="fusion",
                    inherits="bm25",
                    inputs=[("query(q)", "tensor<float>(x[384])")],
                    first_phase="closeness(field, embedding)",
                    global_phase=GlobalPhaseRanking(
                        expression="reciprocal_rank_fusion(bm25sum, closeness(field, embedding))",
                        rerank_count=1000,
                    ),
                ),
            ],
        )
    ],
    components=[
        Component(
            id="e5",
            type="hugging-face-embedder",
            parameters=[
                Parameter(
                    "transformer-model",
                    {
                        "url": "https://github.com/vespa-engine/sample-apps/raw/master/simple-semantic-search/model/e5-small-v2-int8.onnx"
                    },
                ),
                Parameter(
                    "tokenizer-model",
                    {
                        "url": "https://raw.githubusercontent.com/vespa-engine/sample-apps/master/simple-semantic-search/model/tokenizer.json"
                    },
                ),
            ],
        )
    ],
)
```

請注意，欄位 `id`、`metadata`、`text` 和 `embedding` 是此整合運作所必需的。Schema name 也必須是 `doc`，且 rank profiles 的名稱必須是 `bm25`、`semantic` 和 `fusion`。

除此之外，您可以根據需要修改，例如切換 embedding models、新增欄位或更改 ranking expressions。

如需更多詳細資訊，請查看 [hybrid search](https://pyvespa.readthedocs.io/en/latest/getting-started-pyvespa.html) 上的此 Pyvespa 範例 notebook。