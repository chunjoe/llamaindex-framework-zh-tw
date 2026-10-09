---
title: "Metadata 擷取"
---

## 簡介

在許多情況下，特別是對於長篇的 documents，某個文本片段可能缺乏區分該片段與其他相似文本片段所需的上下文。

為了解決這個問題，我們使用 LLMs 來提取與 document 相關的特定上下文資訊，以更好地幫助檢索和語言模型區分看起來相似的段落。

我們在 [範例 notebook](https://github.com/jerryjliu/llama_index/blob/main/docs/examples/metadata_extraction/MetadataExtractionSEC.ipynb) 中展示了這一點，並證明了它在處理長篇 documents 方面的有效性。

## 使用方法

首先，我們定義一個 metadata extractor，它接收一個將依序處理的 feature extractors 的列表。

然後，我們將其傳遞給 node parser，它會為每個 node 添加額外的 metadata。

```
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.extractors import (
    SummaryExtractor,
    QuestionsAnsweredExtractor,
    TitleExtractor,
    KeywordExtractor,
)
from llama_index.extractors.entity import EntityExtractor


transformations = [
    SentenceSplitter(),
    TitleExtractor(nodes=5),
    QuestionsAnsweredExtractor(questions=3),
    SummaryExtractor(summaries=["prev", "self"]),
    KeywordExtractor(keywords=10),
    EntityExtractor(prediction_threshold=0.5),
]
```

然後，我們可以對輸入的 documents 或 nodes 執行我們的 transformation：

```
from llama_index.core.ingestion import IngestionPipeline


pipeline = IngestionPipeline(transformations=transformations)


nodes = pipeline.run(documents=documents)
```

這是提取的 metadata 範例：

```
{'page_label': '2',
 'file_name': '10k-132.pdf',
 'document_title': 'Uber Technologies, Inc. 2019 Annual Report: Revolutionizing Mobility and Logistics Across 69 Countries and 111 Million MAPCs with $65 Billion in Gross Bookings',
 'questions_this_excerpt_can_answer': '\n\n1. How many countries does Uber Technologies, Inc. operate in?\n2. What is the total number of MAPCs served by Uber Technologies, Inc.?\n3. How much gross bookings did Uber Technologies, Inc. generate in 2019?',
 'prev_section_summary': "\n\nThe 2019 Annual Report provides an overview of the key topics and entities that have been important to the organization over the past year. These include financial performance, operational highlights, customer satisfaction, employee engagement, and sustainability initiatives. It also provides an overview of the organization's strategic objectives and goals for the upcoming year.",
 'section_summary': '\nThis section discusses a global tech platform that serves multiple multi-trillion dollar markets with products leveraging core technology and infrastructure. It enables consumers and drivers to tap a button and get a ride or work. The platform has revolutionized personal mobility with ridesharing and is now leveraging its platform to redefine the massive meal delivery and logistics industries. The foundation of the platform is its massive network, leading technology, operational excellence, and product expertise.',
 'excerpt_keywords': '\nRidesharing, Mobility, Meal Delivery, Logistics, Network, Technology, Operational Excellence, Product Expertise, Point A, Point B'}
```

## 自訂提取器

如果提供的 extractors 不符合您的需求，您也可以像這樣定義一個自訂 extractor：

```
from llama_index.core.extractors import BaseExtractor




class CustomExtractor(BaseExtractor):
    async def aextract(self, nodes) -> List[Dict]:
        metadata_list = [
            {
                "custom": node.metadata["document_title"]
                + "\n"
                + node.metadata["excerpt_keywords"]
            }
            for node in nodes
        ]
        return metadata_list
```

`extractor.extract()` 會在內部自動呼叫 `aextract()`，以提供同步和異步的 entrypoints。

在更進階的範例中，它還可以利用 `llm` 從 node 的內容和現有的 metadata 中提取 features。請參閱 [source code of the provided metadata extractors](https://github.com/run-llama/llama_index/blob/main/llama-index-core/llama_index/core/extractors/metadata_extractors.py) 以獲取更多詳細資訊。

## 模組

下方有各種 metadata extractors 的指南和教學。

- [SEC Documents Metadata Extraction](https://developers.llamaindex.ai/python/examples/metadata_extraction/metadataextractionsec/index.md)
- [LLM Survey Extraction](https://developers.llamaindex.ai/python/examples/metadata_extraction/metadataextraction_llmsurvey/index.md)
- [Entity Extraction](https://developers.llamaindex.ai/python/examples/metadata_extraction/entityextractionclimate/index.md)
- [Marvin Metadata Extraction](https://developers.llamaindex.ai/python/examples/metadata_extraction/marvinmetadataextractordemo/index.md)
- [Pydantic Metadata Extraction](https://developers.llamaindex.ai/python/examples/metadata_extraction/pydanticextractor/index.md)