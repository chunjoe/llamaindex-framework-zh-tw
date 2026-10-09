---
title: "聊天引擎"
---

##### 常見問題 (FAQ)

1. [如何讓 bot 在回答時保留上下文，可以用 LlamaIndex 嗎？](/python/framework/community/faq/chat_engines/#1-how-to-make-bot-retain-context-while-answering-can-i-do-that-with-llamaindex)
2. [如何使用 Data Agent 與 Chat engine 搭配使用？](/python/framework/community/faq/chat_engines/#2-how-to-use-data-agent-with-chat-engine)

---

##### 1. 如何讓 bot 在回答時保留上下文，可以用 LlamaIndex 嗎？

可以，Llamaindex 提供您可以使用來保留上下文並根據上下文回答的 chat engines。您可以在這裡找到更多資訊 [聊天引擎](/python/framework/module_guides/deploying/chat_engines/)。

---

##### 2. 如何使用 Data Agent 與 Chat engine 搭配使用？

要使用 Data Agents 與 Chat engine 搭配使用，您需要在初始化 chat engine 時設定 chat mode。請在此處尋找更多資訊 [Data Agents with Chat Engine](/python/framework/module_guides/deploying/chat_engines/usage_pattern/#available-chat-modes)