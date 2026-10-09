---
title: "查詢"
---

資料載入、索引建立並儲存完成後，就可以進入 LLM 應用程式最重要的環節：查詢。

最簡單的查詢，就是把 prompt 傳給 LLM：你可以提出問題取得答案、要求摘要，或提供更複雜的指令。

較複雜的查詢可能會重複或串接多次 prompt 與 LLM 呼叫，也可能讓多個元件形成反覆推理的流程。

## 開始使用

所有查詢流程都以 `QueryEngine` 為基礎。最簡單的做法是讓索引替你建立 QueryEngine：

```
query_engine = index.as_query_engine()
response = query_engine.query(
    "Write an email to the user given their background information."
)
print(response)
```

## 查詢的階段

不過，查詢流程比表面上更豐富，通常可分為三個階段：

- **檢索**是從 `Index` 中找出並回傳與查詢最相關的文件。就像前面在[索引](/python/framework/module_guides/indexing/)一節提到的，最常見的方式是「top-k」語意檢索，但還有許多其他檢索策略。
- **後處理**是視需要將檢索到的 `Node` 重新排序、轉換或篩選，例如只保留附有特定中繼資料（如關鍵字）的節點。
- **回應合成**是將查詢、最相關的資料與 prompt 組合後傳給 LLM，以產生回應。

提示

你可以參閱如何為[文件](/python/framework/module_guides/loading/documents_and_nodes/usage_documents/)與[節點](/python/framework/module_guides/loading/documents_and_nodes/usage_nodes/)加上中繼資料。

## 自訂查詢各階段

LlamaIndex 提供低階組合 API，讓你能細緻控制查詢流程。

此範例會調整 retriever 的 `top_k` 數量，並加入後處理步驟，只有相似度達到最低門檻的節點才會保留。如此一來，符合條件時最多可取得多筆結果；若沒有內容達到門檻，就不會回傳資料。

```
from llama_index.core import VectorStoreIndex, get_response_synthesizer
from llama_index.core.retrievers import VectorIndexRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.postprocessor import SimilarityPostprocessor


# build index
index = VectorStoreIndex.from_documents(documents)


# configure retriever
retriever = VectorIndexRetriever(
    index=index,
    similarity_top_k=10,
)


# configure response synthesizer
response_synthesizer = get_response_synthesizer()


# assemble query engine
query_engine = RetrieverQueryEngine(
    retriever=retriever,
    response_synthesizer=response_synthesizer,
    node_postprocessors=[SimilarityPostprocessor(similarity_cutoff=0.7)],
)


# query
response = query_engine.query("What did the author do growing up?")
print(response)
```

你也可以實作對應的介面，自行定義檢索、回應合成與整體查詢邏輯。

如需查看已實作的元件與支援的設定方式，請參閱[參考文件](https://developers.llamaindex.ai/python/framework/api_reference/)。

以下進一步說明如何自訂各個階段：

### 設定檢索器

```
retriever = VectorIndexRetriever(
    index=index,
    similarity_top_k=10,
)
```

我們的[檢索器模組指南](/python/framework/module_guides/querying/retriever/)介紹了各種檢索器。

### 設定節點後處理器

LlamaIndex 支援進階的 `Node` 篩選與擴充功能，能提升檢索到的 `Node` 物件與查詢的相關性。這有助於減少執行時間、LLM 呼叫次數或成本，也能提升回應品質。

例如：

- `KeywordNodePostprocessor`：依據 `required_keywords` 和 `exclude_keywords` 篩選節點。
- `SimilarityPostprocessor`：依相似度分數門檻篩選節點（因此僅適用於以 embedding 為基礎的檢索器）。
- `PrevNextNodePostprocessor`：依據 `Node` 之間的關係，為檢索到的 `Node` 物件補上相關脈絡。

節點後處理器的完整清單請參閱 [Node Postprocessor Reference](https://developers.llamaindex.ai/python/framework/api_reference/postprocessor/)。

若要設定所需的節點後處理器，請使用：

```
node_postprocessors = [
    KeywordNodePostprocessor(
        required_keywords=["Combinator"], exclude_keywords=["Italy"]
    )
]
query_engine = RetrieverQueryEngine.from_args(
    retriever, node_postprocessors=node_postprocessors
)
response = query_engine.query("What did the author do growing up?")
```

### 設定回應合成

檢索器取得相關節點後，`BaseSynthesizer` 會整合資訊並產生最終回應。

設定方式如下：

```
query_engine = RetrieverQueryEngine.from_args(
    retriever, response_mode=response_mode
)
```

目前支援以下選項：

- `default`：使用「建立並精煉」方式，依序處理每個檢索到的 `Node`，並為每個節點分別呼叫一次 LLM；適合需要較詳細答案的情境。
- `compact`：每次呼叫 LLM 時，盡可能將多個 `Node` 文字片段放入同一個 prompt，且不超過 prompt 長度上限。若片段太多、無法一次放入，就會分成多個 prompt，逐步「建立並精煉」答案。
- `tree_summarize`：根據一組 `Node` 和查詢遞迴建立樹狀結構，並將根節點作為回應；適合用於摘要。
- `no_text`：只執行檢索器，取得原本會傳給 LLM 的節點，但不實際傳送。你可以檢查 `response.source_nodes` 查看結果；回應物件會在第 5 節進一步說明。
- `accumulate`：給定一組 `Node` 物件與查詢，逐一將查詢套用至每個 `Node` 的文字片段，並把回應累積成陣列，最後串接為一個字串；適合同一個查詢需要分別處理每個文字片段的情境。

## 結構化輸出

若希望輸出符合特定結構，請參閱 [Query Engines + Pydantic Outputs](/python/framework/module_guides/querying/structured_outputs/query_engine/)，了解如何從查詢引擎類別取得 Pydantic 物件。

也歡迎參閱完整的[結構化輸出指南](/python/framework/module_guides/querying/structured_outputs/)。

## 建立自訂查詢工作流程

若要設計複雜的查詢流程，可以組合不同模組，從 prompt、LLM、輸出剖析器、檢索器與回應合成器，到自訂元件都能納入其中。

詳情請參閱[工作流程指南](https://developers.llamaindex.ai/python/framework/module_guides/workflow/)。
