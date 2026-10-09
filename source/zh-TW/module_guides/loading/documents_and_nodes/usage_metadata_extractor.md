---
title: "元數據擷取用法模式"
---

您可以使用 LLMs 來利用我們的 `Metadata Extractor` 模組來自動化 metadata 擷取。

我們的 metadata 擷取模組包含以下「feature extractors」：

- `SummaryExtractor` - 自動從一組 Nodes 中擷取摘要
- `QuestionsAnsweredExtractor` - 擷取一組每個 Node 都可以回答的問題
- `TitleExtractor` - 擷取每個 Node 的上下文中的標題
- `EntityExtractor` - 擷取在每個 Node 的內容中提到的實體（例如地點、人物、事物的名稱）

然後您可以將 `Metadata Extractor` 串接（chain）與我們的 node parser：

```
from llama_index.core.extractors import (
    TitleExtractor,
    QuestionsAnsweredExtractor,
)
from llama_index.core.node_parser import TokenTextSplitter


text_splitter = TokenTextSplitter(
    separator=" ", chunk_size=512, chunk_overlap=128
)
title_extractor = TitleExtractor(nodes=5)
qa_extractor = QuestionsAnsweredExtractor(questions=3)


# assume documents are defined -> extract nodes
from llama_index.core.ingestion import IngestionPipeline


pipeline = IngestionPipeline(
    transformations=[text_splitter, title_extractor, qa_extractor]
)


nodes = pipeline.run(
    documents=documents,
    in_place=True,
    show_progress=True,
)
```

或插入到一個 index 中：

```
from llama_index.core import VectorStoreIndex


index = VectorStoreIndex.from_documents(
    documents, transformations=[text_splitter, title_extractor, qa_extractor]
)
```

## 資源

- [SEC Documents Metadata Extraction](https://developers.llamaindex.ai/python/examples/metadata_extraction/metadataextractionsec/index.md)
- [LLM Survey Extraction](https://developers.llamaindex.ai/python/examples/metadata_extraction/metadataextraction_llmsurvey/index.md)
- [Entity Extraction](https://developers.llamaindex.ai/python/examples/metadata_extraction/entityextractionclimate/index.md)
- [Marvin Metadata Extraction](https://developers.llamaindex.ai/python/examples/metadata_extraction/marvinmetadataextractordemo/index.md)
- [Pydantic Metadata Extraction](https://developers.llamaindex.ai/python/examples/metadata_extraction/pydanticextractor/index.md)