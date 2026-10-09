---
title: "查詢引擎"
---

## 概念

Query engine 是一個通用介面，讓您可以對您的資料提出問題。

Query engine 接收自然語言查詢，並回傳豐富的回應。它通常（但非總是）建立在一個或多個 [indexes](/python/framework/module_guides/indexing/) 上，透過 [retrievers](/python/framework/module_guides/querying/retriever/)。您可以組合多個 query engine 以實現更進階的能力。

提示

如果您想與您的資料進行對話（進行多次來回而不是單一問答），請查看 [Chat Engine](/python/framework/module_guides/deploying/chat_engines/)。

## 使用模式

從以下開始：

```
query_engine = index.as_query_engine()
response = query_engine.query("Who is Paul Graham.")
```

要串流回應：

```
query_engine = index.as_query_engine(streaming=True)
streaming_response = query_engine.query("Who is Paul Graham.")
streaming_response.print_response_stream()
```

請參閱完整的 [usage pattern](/python/framework/module_guides/deploying/query_engine/usage_pattern/) 以獲取更多詳細資訊。

## 模組

在 [modules guide](/python/framework/module_guides/deploying/query_engine/modules/) 中找到所有模組。

## 支援模組

還有 [supporting modules](/python/framework/module_guides/deploying/query_engine/supporting_modules/)。