---
title: "尋找 Data Connectors"
---

資料連線器（也稱為 `Reader`s）將資料從外部來源載入到 LlamaIndex `Document` 物件中。除了內建的 `SimpleDirectoryReader` 之外，每個連線器都會作為自己的 package 發布，因此您只需安裝所需的部分。

## 尋找連線器

- 瀏覽 LlamaIndex repo 中的 [`readers` directory](https://github.com/run-llama/llama_index/tree/main/llama-index-integrations/readers)。每個 package 都有一個包含安裝和使用說明（README）的文件。
- 在 PyPI 上搜尋 `llama-index-readers-`。Package 名稱遵循 `llama-index-readers-<source>` 的模式，例如 `llama-index-readers-google` 或 `llama-index-readers-database`。
- 其他整合類型也遵循相同的結構：agent tools 位於 [`tools`](https://github.com/run-llama/llama_index/tree/main/llama-index-integrations/tools) 下，LLMs 位於 [`llms`](https://github.com/run-llama/llama_index/tree/main/llama-index-integrations/llms) 下，embeddings 位於 [`embeddings`](https://github.com/run-llama/llama_index/tree/main/llama-index-integrations/embeddings) 下，以此類推。請參閱 [整合概觀](/python/framework/community/integrations/) 以獲得完整概覽。

## 使用模式

安裝 package，然後從相應的 namespace 匯入 reader：

終端機視窗

```
pip install llama-index-readers-google
```

```
from llama_index.readers.google import GoogleDocsReader


loader = GoogleDocsReader()
documents = loader.load_data(document_ids=[...])
```

## 內建連線器：SimpleDirectoryReader

`SimpleDirectoryReader` 可以解析多種檔案類型，包括 `.md`、`.pdf`、`.jpg`、`.png`、`.docx`，以及音訊和視訊類型。它作為 LlamaIndex 的一部分直接提供：

```
from llama_index.core import SimpleDirectoryReader


documents = SimpleDirectoryReader("./data").load_data()
```

## 人氣連線器

有數百個可供選擇：

- [Notion](https://developers.notion.com/) (`NotionPageReader`, `llama-index-readers-notion`)
- [Google Docs](https://developers.google.com/docs/api) (`GoogleDocsReader`, `llama-index-readers-google`)
- [Slack](https://api.slack.com/) (`SlackReader`, `llama-index-readers-slack`)
- [Discord](https://discord.com/developers/docs/intro) (`DiscordReader`, `llama-index-readers-discord`)
- [Apify Actors](https://github.com/run-llama/llama_index/tree/main/llama-index-integrations/readers/llama-index-readers-apify) (`ApifyActor`, `llama-index-readers-apify`)。可以爬網頁、抓取網頁內容、提取文字內容、下載包含 `.pdf`、`.jpg`、`.png`、`.docx` 等檔案。

請參閱 [data connectors module guide](/python/framework/module_guides/loading/connector/) 以獲取更多詳細資訊。