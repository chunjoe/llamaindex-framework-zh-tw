---
title: "轉換"
---

轉換是接收一個 nodes 的列表作為輸入，並回傳一個 nodes 的列表。實作 `Transformation` 基類的每個元件都同時具有同步的 `__call__()` 定義和異步的 `acall()` 定義。

目前，以下元件是 `Transformation` 物件：

- [`TextSplitter`](/python/framework/module_guides/loading/node_parsers/modules/#text-splitters)
- [`NodeParser`](/python/framework/module_guides/loading/node_parsers/modules/)
- [`MetadataExtractor`](/python/framework/module_guides/loading/documents_and_nodes/usage_metadata_extractor/)
- `Embeddings`model (請查閱我們的 [支援的 embeddings 列表](/python/framework/module_guides/models/embeddings/#list-of-supported-embeddings))

## 使用模式

雖然轉換最適合與 [`IngestionPipeline`](/python/framework/module_guides/loading/ingestion_pipeline/) 一同使用，但也可以直接使用。

```
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.extractors import TitleExtractor


node_parser = SentenceSplitter(chunk_size=512)
extractor = TitleExtractor()


# use transforms directly
nodes = node_parser(documents)


# or use a transformation in async
nodes = await extractor.acall(nodes)
```

## 與 Index 組合

轉換可以傳遞給一個 index 或整體全局的 settings，並在呼叫 index 上的 `from_documents()` 或 `insert()` 時使用。

```
from llama_index.core import VectorStoreIndex
from llama_index.core.extractors import (
    TitleExtractor,
    QuestionsAnsweredExtractor,
)
from llama_index.core.ingestion import IngestionPipeline
from llama_index.core.node_parser import TokenTextSplitter


transformations = [
    TokenTextSplitter(chunk_size=512, chunk_overlap=128),
    TitleExtractor(nodes=5),
    QuestionsAnsweredExtractor(questions=3),
]


# global
from llama_index.core import Settings


Settings.transformations = [text_splitter, title_extractor, qa_extractor]


# per-index
index = VectorStoreIndex.from_documents(
    documents, transformations=transformations
)
```

## 自訂轉換

您可以透過實作基類來自行實作任何轉換。

以下自訂轉換將移除文本中的任何特殊字元或標點符號。

```
import re
from llama_index.core import Document
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.ingestion import IngestionPipeline
from llama_index.core.schema import TransformComponent




class TextCleaner(TransformComponent):
    def __call__(self, nodes, **kwargs):
        for node in nodes:
            node.text = re.sub(r"[^0-9A-Za-z ]", "", node.text)
        return nodes
```

這些可以直接使用或在任何 `IngestionPipeline` 中使用。

```
# use in a pipeline
pipeline = IngestionPipeline(
    transformations=[
        SentenceSplitter(chunk_size=25, chunk_overlap=0),
        TextCleaner(),
        OpenAIEmbedding(),
    ],
)


nodes = pipeline.run(documents=[Document.example()])
```
