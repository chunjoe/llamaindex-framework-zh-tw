---
title: "聊天引擎"
---

## 概念

Chat engine 是一個與您的資料進行對話的高階介面（多輪來回對話，而非單一問答）。想像一下 ChatGPT，但加入了您的知識庫。

在概念上，它是一個 [Query Engine](/python/framework/module_guides/deploying/query_engine/) 的**有狀態**類比。透過追蹤對話歷史，它可以考慮到過去的上下文來回答問題。

提示

如果您想針對您的資料提出獨立問題（即不追蹤對話歷史），請改用 [Query Engine](/python/framework/module_guides/deploying/query_engine/)。

## 使用模式

從以下開始：

```
chat_engine = index.as_chat_engine()
response = chat_engine.chat("Tell me a joke.")
```

要串流回應：

```
chat_engine = index.as_chat_engine()
streaming_response = chat_engine.stream_chat("Tell me a joke.")
for token in streaming_response.response_gen:
    print(token, end="")
```

更多詳情請參閱完整的 [使用模式指南](/python/framework/module_guides/deploying/chat_engines/usage_pattern/)。

## 模組

在我們的 [modules section](/python/framework/module_guides/deploying/chat_engines/modules/) 中，您可以找到相應的教學，以查看可用的 chat engines 的實際運作。