---
title: "追蹤與除錯"
---

除錯和追蹤您的應用程式運作是理解和優化它的關鍵。LlamaIndex 提供多種方法來完成這項工作。

## 基本日誌記錄 (Basic logging)

查看您的應用程式正在做什麼的最簡單方法是開啟除錯日誌 (debug logging)。這可以在應用程式的任何地方這樣做：

```
import logging
import sys


logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)
logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))
```


## 回調處理器 (Callback handler)

LlamaIndex 提供回調 (callbacks) 來幫助除錯、追蹤和追蹤函式庫的內部運作。使用 callback manager，可以新增所需數量的回調。

除了記錄與事件相關的資料外，您還可以追蹤每個事件的持續時間和發生次數。

此外，也會記錄事件的追蹤圖 (trace map of events)，回調可以隨意使用這些資料。例如，`LlamaDebugHandler` 會在大多數操作之後列印事件的追蹤資訊。

您可以獲得如下的簡單回調處理器：

```
import llama_index.core


llama_index.core.set_global_handler("simple")
```


您也可以學習如何 [建立您自己的自訂回調處理器 (build you own custom callback handler)](/python/framework/module_guides/observability/callbacks/)。

## 可觀察性 (Observability)

LlamaIndex 提供**一鍵式可觀察性 (one-click observability)**，讓您在生產環境中建立有原則的 LLM 應用程式。

此功能讓您可以無縫地將 LlamaIndex 函式庫與我們合作夥伴提供的強大可觀察性/評估工具整合。設定一個變數，您就可以做到以下事情：

- 查看 LLM/prompt 輸入/輸出
- 確保任何元件 (LLMs, embeddings) 的輸出符合預期
- 查看索引 (indexing) 和查詢 (querying) 的呼叫追蹤 (call traces)

要了解更多資訊，請查看我們的 [可觀察性文件 (observability docs)](/python/framework/module_guides/observability/)。