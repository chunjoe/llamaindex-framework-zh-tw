---
title: "元件指南"
---

歡迎來到 LlamaIndex 組件指南！本章節提供 LlamaIndex framework 所有核心模組和組件的詳細文件。

## 核心組件

### Models

- [Introduction to Models](/python/framework/module_guides/models/) - 模型組件概述
- [LLMs](/python/framework/module_guides/models/llms/) - 用於文字生成和推理的語言模型
- [Embeddings](/python/framework/module_guides/models/embeddings/) - 將文字轉換為向量表示
- [Multi Modal](/python/framework/module_guides/models/multi_modal/) - 處理圖像、音訊及其他非文字資料

### Prompts

- [Prompt 簡介](/python/framework/module_guides/models/prompts/) - Prompt engineering 概述
- [Usage Patterns](/python/framework/module_guides/models/prompts/usage_pattern/) - 學習如何有效使用 Prompts

### 載入

- [載入簡介](/python/framework/module_guides/loading/) - 資料載入能力概述
- [Documents and Nodes](/python/framework/module_guides/loading/documents_and_nodes/) - 核心資料結構
- [SimpleDirectoryReader](/python/framework/module_guides/loading/simpledirectoryreader/) - 輕鬆的 document 載入
- [Data Connectors](/python/framework/module_guides/loading/connector/) - 連接外部資料來源
- [Node Parsers / Text Splitters](/python/framework/module_guides/loading/node_parsers/) - 將 documents 分割成區塊
- [Ingestion Pipeline](/python/framework/module_guides/loading/ingestion_pipeline/) - 端到端 document 處理

### 索引

- [索引簡介](/python/framework/module_guides/indexing/) - 索引方法的概述
- [索引指南](/python/framework/module_guides/indexing/index_guide/) - 索引的全面指南
- [Vector Store Index](/python/framework/module_guides/indexing/vector_store_index/) - 使用向量進行語義搜尋
- [Property Graph Index](/python/framework/module_guides/indexing/lpg_index_guide/) - 基於圖的索引

### Storing

- [Storing 簡介](/python/framework/module_guides/storing/) - 儲存組件概述
- [Vector Stores](/python/framework/module_guides/storing/vector_stores/) - 儲存嵌入以供檢索
- [Document Stores](/python/framework/module_guides/storing/docstores/) - 持久化 document collections
- [索引儲存區](/python/framework/module_guides/storing/index_stores/) - 儲存索引的 metadata

### Querying

- [Introduction to Querying](/python/framework/module_guides/querying/) - 查詢組件概述
- [Query Engines](/python/framework/module_guides/deploying/query_engine/) - 處理和回答查詢
- [Chat Engines](/python/framework/module_guides/deploying/chat_engines/) - 建構對話介面
- [Retrieval](/python/framework/module_guides/querying/retriever/) - 檢索相關的 context
- [Response Synthesis](/python/framework/module_guides/querying/response_synthesizers/) - 生成連貫的回答

## 進階組件

### Agents

- [Agents 簡介](/python/framework/module_guides/deploying/agents/) - agent 能力概述
- [Memory](/python/framework/module_guides/deploying/agents/memory/) - 為 agents 添加對話記憶
- [工具](/python/framework/module_guides/deploying/agents/tools/) - 使用外部工具擴展能力

### Workflows

- [Workflows 簡介](https://developers.llamaindex.ai/python/framework/module_guides/workflow/) - 建構複雜的多步驟 AI workflows

### Evaluation

- [Introduction to Evaluation](/python/framework/module_guides/evaluating/) - 評估框架概述
- [Usage Patterns](/python/framework/module_guides/evaluating/usage_pattern/) - 測試和改進您的應用程式
- [LlamaDatasets](/python/framework/module_guides/evaluating/contributing_llamadatasets/) - 標準化的評估資料集

### Observability

- [Observability 簡介](/python/framework/module_guides/observability/) - 監控能力概述
- [Instrumentation](/python/framework/module_guides/observability/instrumentation/) - 監控和除錯您的應用程式

### Settings

- [Settings Configuration](/python/framework/module_guides/supporting_modules/settings/) - 設定全局 LlamaIndex settings