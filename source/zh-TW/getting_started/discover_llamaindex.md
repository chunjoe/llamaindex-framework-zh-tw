---
title: "探索 LlamaIndex 影片系列"
---

如果你喜歡透過影片學習，不妨看看「Discover LlamaIndex」系列；如果你偏好閱讀，建議接著前往 [了解 LlamaIndex](/python/framework/understanding/) 教學。

## 由下而上建置（Llama Docs Bot）

這個子系列示範如何從頭打造文件聊天機器人。

我們會由下而上逐步示範：先將 LLM 與資料物件作為獨立模組使用，再逐步加入索引、進階檢索器／重排序器等更高階的抽象。

[完整程式碼儲存庫](https://github.com/run-llama/llama_docs_bot) [\[第 1 部分\] LLM 與提示](https://www.youtube.com/watch?v=p0jcvGiBKSA) [\[第 2 部分\] 文件與中繼資料](https://www.youtube.com/watch?v=nGNoacku0YY) [\[第 3 部分\] 評估](https://www.youtube.com/watch?v=LQy8iHOJE2A) [\[第 4 部分\] 嵌入](https://www.youtube.com/watch?v=2c64G-iDJKQ) [\[第 5 部分\] 檢索器與後處理器](https://www.youtube.com/watch?v=mIyZ_9gqakE)

## SubQuestionQueryEngine 與 10-K 文件分析

這部影片介紹 `SubQuestionQueryEngine`，並示範如何將它用於分析財務文件，將複雜查詢拆解為多個子問題。

[YouTube 影片](https://www.youtube.com/watch?v=GT_Lsj3xj1o)

[Notebook 範例](https://developers.llamaindex.ai/python/examples/usecases/10k_sub_question/index.md)

## Discord 文件管理

這部影片示範如何管理來自持續更新來源（例如 Discord）的文件，並避免重複處理文件，以節省嵌入模型的 token 用量。

[YouTube 影片](https://www.youtube.com/watch?v=j6dJcODLd_c)

[Notebook 與補充資料](https://github.com/jerryjliu/llama_index/tree/main/docs/examples/discover_llamaindex/document_management/)

[參考文件](/python/framework/module_guides/indexing/document_management/)

## 結合文字轉 SQL 與語意搜尋

這部影片介紹 LlamaIndex 中可將 SQL 與語意搜尋整合到單一查詢介面的工具。

[YouTube 影片](https://www.youtube.com/watch?v=ZIvcVJGtCrY)

[Notebook 範例](https://developers.llamaindex.ai/python/examples/query_engine/sqlautovectorqueryengine/index.md)