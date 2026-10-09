---
title: "載入資料"
---

資料攝取在 LlamaIndex 中的關鍵在於載入和轉換。一旦您載入了 Documents，就可以透過轉換來處理它們並輸出 Nodes。

在我們的 Understanding 部分[了解資料載入的基本知識](/python/framework/understanding/rag/loading/)後，您可以繼續了解更多關於以下內容：

### 載入 (Loading)

- [SimpleDirectoryReader](/python/framework/module_guides/loading/simpledirectoryreader/)，我們內建的載入器，可從本地目錄載入各種檔案類型
- [LlamaParse](/python/framework/module_guides/loading/connector/llama_parse/)，LlamaIndex 用於 PDF 解析的官方工具，可作為一個 managed API 提供
- [Data connectors](/python/framework/module_guides/loading/connector/)，數百種資料載入整合，可從任何來源攝取資料

### 轉換 (Transformations)

這包括文本分割等常用操作。

- [Node Parser Usage Pattern](/python/framework/module_guides/loading/node_parsers/)，展示如何使用我們的 node parsers
- [Node Parser Modules](/python/framework/module_guides/loading/node_parsers/modules/)，展示我們的文本分割器（sentence、token、HTML、JSON）和其他 parser modules

### 整合所有內容 (Putting it all Together)

- [The ingestion pipeline](/python/framework/module_guides/loading/ingestion_pipeline/)，讓您可以設定一個可重複、優化快取（cache-optimized）的資料載入流程。

### 抽象層 (Abstractions)

- [Document and Node objects](/python/framework/module_guides/loading/documents_and_nodes/) 以及如何自訂它們以用於更進階的用例