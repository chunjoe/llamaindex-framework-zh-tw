---
title: "各種索引的運作方式"
---

本指南搭配示意圖，說明各種索引的運作方式。

術語說明：

- **Node**：對應 Document 中的一個文字片段。LlamaIndex 接收 Document 物件後，會在內部解析並切分內容，建立 Node 物件。
- **Response Synthesis**：這個模組會根據檢索到的 Node 組合出回應。如何[指定不同的回應模式](/python/framework/module_guides/deploying/query_engine/response_modes/)請參閱該指南。

## 摘要索引（Summary Index，舊稱 List Index）

摘要索引會將 Nodes 依序串接儲存。

![](/assets/cccd4f7caee9.png)

### 查詢方式

查詢時若未指定其他參數，LlamaIndex 會將清單中的所有 Nodes 載入 Response Synthesis 模組。

![](/assets/ccdddc149ca2.png)

摘要索引支援多種查詢方式，例如以嵌入向量為基礎的查詢會擷取 top-k 鄰近項目，也可以加上關鍵字篩選條件，如下所示：

![](/assets/e1d34f8548c5.png)

## 向量儲存索引（Vector Store Index）

向量儲存索引會將每個 Node 及其對應的 embedding 儲存在[向量儲存區](/python/framework/community/integrations/vector_stores/#using-a-vector-store-as-an-index)。

![](/assets/80fd7eb161b0.png)

### 查詢方式

查詢向量儲存索引時，系統會擷取最相似的 top-k 個 Nodes，並將它們傳遞給 Response Synthesis 模組。

![](/assets/330738bc56a6.png)

## 樹狀索引（Tree Index）

樹狀索引會以一組 Nodes 建立階層式樹狀結構，這些 Nodes 會成為樹的葉節點。

![](/assets/b41d3b153295.png)

### 查詢方式

查詢樹狀索引時，系統會從根節點往下走訪至葉節點。預設值（`child_branch_factor=1`）時，每個父節點只會選取一個子節點；若設為 `child_branch_factor=2`，每一層則會選取兩個子節點。

![](/assets/f56d57d86e8b.png)

## 關鍵字表索引（Keyword Table Index）

關鍵字表索引會從每個 Node 擷取關鍵字，並建立關鍵字與對應 Nodes 之間的映射。

![](/assets/5b6f64cac2ed.png)

### 查詢方式

查詢時，系統會從查詢中擷取相關關鍵字，與先前擷取的 Node 關鍵字比對，找出對應的 Nodes，再將這些 Nodes 傳入 Response Synthesis 模組。

![](/assets/6fa2ca2fa9c0.png)

## 屬性圖索引（Property Graph Index）

屬性圖索引會先建立知識圖譜，其中包含已加上標籤的 Node 及其關係。圖譜的建構方式可高度自訂：你可以讓 LLM 擷取所需資訊、使用嚴格的 schema 進行擷取，或實作自己的擷取模組。

也可以選擇替 Node 建立 embedding，以供後續檢索。

你也可以略過建置步驟，透過 Neo4j 等整合方式連接到現有的知識圖譜。

### 查詢方式

屬性圖索引也支援彈性的查詢。檢索時會使用多個子檢索器（sub-retrievers）並合併結果。預設會使用關鍵字加同義詞擴展，並在圖譜已建立 embedding 時搭配向量檢索，找出相關三元組（triples）。

你也可以在檢索到的三元組（triples）中一併包含來源文字（若圖譜是在 LlamaIndex 之外建立，則無法使用此功能）。

完整說明請參閱[屬性圖指南](/python/framework/module_guides/indexing/lpg_index_guide/)。