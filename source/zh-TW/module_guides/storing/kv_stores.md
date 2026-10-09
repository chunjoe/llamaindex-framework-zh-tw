---
title: "鍵值儲存"
---

Key-Value stores 是驅動我們的 [Document Stores](/python/framework/module_guides/storing/docstores/) 和 [索引儲存區](/python/framework/module_guides/storing/index_stores/) 的底層儲存抽象。

我們提供以下 key-value stores：

- **Simple Key-Value Store**：一個記憶體中的 KV store。使用者可以選擇呼叫 `persist` 在此 kv store 上將資料持久化到磁碟。
- **MongoDB Key-Value Store**：一個 MongoDB KV store。資料在寫入時即被持久化，因此使用者無需呼叫 `persist`，多個程序可以共用同一個 store。支援 async 操作。
- **Tablestore Key-Value Store**：一個 Tablestore KV store。

請參閱 [API Reference](https://developers.llamaindex.ai/python/framework-api-reference/storage/kvstore/index.md) 以獲取更多詳細資訊。

注意：目前，這些儲存抽象不對外開放。