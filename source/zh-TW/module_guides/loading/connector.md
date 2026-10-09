---
title: "資料連接器"
---

## 概念

資料連接器（aka `Reader`）將來自不同資料來源和資料格式的資料，匯入為簡單的 `Document` 表示（文字和簡單的 metadata）。

提示

一旦您匯入資料，就可以在上面建立一個 [Index](/python/framework/module_guides/indexing/)，使用 [Query Engine](/python/framework/module_guides/deploying/query_engine/) 提問，並使用 [Chat Engine](/python/framework/module_guides/deploying/chat_engines/) 進行對話。

## 整合套件

每個資料連接器都會作為自己的套件發布，因此您只需安裝需要的套件。完整套件位於 LlamaIndex repo 的 [`readers` 目錄](https://github.com/run-llama/llama_index/tree/main/llama-index-integrations/readers)，每個套件在 PyPI 上都命名為 `llama-index-readers-<source>`。

## 使用模式

從以下開始：

```
from llama_index.readers.google import GoogleDocsReader


loader = GoogleDocsReader()
documents = loader.load_data(document_ids=[...])
```

查看完整的 [使用模式指南](/python/framework/module_guides/loading/connector/usage_pattern/) 以獲取更多詳細資訊。

## 模組

一些範例資料連接器：

- 本地檔案目錄 (`SimpleDirectoryReader`)。可以支援解析多種檔案類型：`.pdf`, `.jpg`, `.png`, `.docx` 等。
- [Notion](https://developers.notion.com/) (`NotionPageReader`)
- [Google Docs](https://developers.google.com/docs/api) (`GoogleDocsReader`)
- [Slack](https://api.slack.com/) (`SlackReader`)
- [Discord](https://discord.com/developers/docs/intro) (`DiscordReader`)
- [Apify Actors](https://github.com/run-llama/llama_index/tree/main/llama-index-integrations/readers/llama-index-readers-apify) (`ApifyActor`)。可以爬網頁、抓取網頁內容、提取文字內容、下載包含 `.pdf`, `.jpg`, `.png`, `.docx` 等的檔案。

請參閱 [modules guide](/python/framework/module_guides/loading/connector/modules/) 以獲取更多詳細資訊。