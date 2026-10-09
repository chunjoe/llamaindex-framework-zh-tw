---
title: "Jaguar Vector Store"
---

此 document 示範 llama\_index 如何與 Jaguar vector store 協作。

- 它是一個可以儲存大量向量的分布式 vector database。
- ZeroMove 功能可實現即時水平擴展。
- 它支援 embeddings、text、images、videos、PDFs、audio、time series 和 spatial data。
- all-master 架構允許並行讀取和寫入。
- 它的 anomaly detection 能力可以區分資料集中的異常值。
- RAG 支援可以結合 LLMs 和 proprietary 及 real-time data。
- 在多個 vector index 之間共享 metadata 提升了資料一致性。
- 距離度量包括 Euclidean、Cosine、InnerProduct、Manhatten、Chebyshev、Hamming、Jeccard 和 Minkowski。
- 相似度搜尋可以帶有時間截止（time cutoff）和時間衰減（time decay）效果。

## 先決條件

執行此檔案中的範例需要兩個要求。

您必須安裝並設定 JaguarDB server 及其 HTTP gateway server。請參考 [Jaguar Setup](http://www.jaguardb.com/docsetup.html) 中的說明。

您必須安裝 packages llama-index 和 jaguardb-http-client。

**方法一：Docker**

```
docker pull jaguardb/jaguardb
docker run -d -p 8888:8888 -p 8080:8080 --name jaguardb jaguardb/jaguardb
pip install -U llama-index
pip install -U jaguardb-http-client
```

**方法二：快速設定 (Linux)**

```
curl -fsSL http://jaguardb.com/install.sh | sh\n
pip install -U llama-index
pip install -U jaguardb-http-client
```

```
%pip install llama-index-vector-stores-jaguar
```

```
!pip install -U jaguardb-http-client
```

```
Collecting jaguardb-http-client
  Using cached jaguardb_http_client-3.4.1-py2.py3-none-any.whl (15 kB)
Installing collected packages: jaguardb-http-client
Successfully installed jaguardb-http-client-3.4.1
```

## 匯入

應匯入以下 packages。我們以 OpenAIEmbedding 作為範例。您可以選擇應用程式中的其他 embedding models。

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core import StorageContext
from llama_index.vector_stores.jaguar import JaguarVectorStore
from jaguardb_http_client.JaguarHttpClient import JaguarHttpClient
```

## Client Object

我們現在建立一個 jaguar vector store client object。url 是 gateway server 的 http endpoint。url 應替換為您的環境 settings。pod 是 Pod（或 database）的名稱。store 是 vector store 的名稱。一個 pod 可能有多個 store。vector\_index 是 store 中 vector index 的名稱。一個 store 可能有多個 vector indexes。然而，store client object 只綁定到一個 vector index。vector\_type 指定 vector index 的屬性。在字串 “cosine\_fraction\_short” 中，cosine 表示兩個向量之間的距離是使用 cosine distance 計算的。Fraction 表示向量的組成部分是分數數。Short 表示向量組成部分的儲存格式是有符號 16 位元整數的 short integer。儲存格式可以是 32 位元浮點數的 float。它也可以是 8 位元有符號整數的 byte。vector\_dimension 是由提供的 embedding model 生成的向量的維度。

```
url = "http://127.0.0.1:8080/fwww/"
pod = "vdb"
store = "llamaindex_jaguar_store"
vector_index = "v"
vector_type = "cosine_fraction_float"
# vector_type = "cosine_fraction_short"  # half of memory usage compared to float
# vector_type = "cosine_fraction_byte" # quarter of memory usage compared to float
vector_dimension = 1536  # per OpenAIEmbedding model
jaguarstore = JaguarVectorStore(
    pod,
    store,
    vector_index,
    vector_type,
    vector_dimension,
    url,
)
```

## Authentication

為了系統安全和使用者驗證，client 必須登入或連接到 back-end jaguar server。環境變數 JAGUAR\_API\_KEY 或檔案 $HOME/.jagrc 必須包含由您的系統管理員發行的 jaguar api。login() 方法回傳 True 或 False。如果回傳 False，則可能表示您的 jaguar api key 無效，或 http gateway server 未運行，或 jaguar server 沒有正常運行。

```
true_or_false = jaguarstore.login()
print(f"login result is {true_or_false}")
```

```
login result is True
```

## Create Vector Store

我們現在建立一個 vector store，具有一個大小為 1024 bytes 的 ‘v:text’ 欄位來儲存文字，以及兩個額外的 metadata 欄位 ‘author’ 和 ‘category’。

```
metadata_str = "author char(32), category char(16)"
text_size = 1024
jaguarstore.create(metadata_str, text_size)
```

## Load Documents

以下程式碼開啟範例 Paul Gram documents 並將其讀入記憶體中。

```
documents = SimpleDirectoryReader("../data/paul_graham/").load_data()
print(f"loading {len(documents)} doument(s)")
```

```
loading 1 doument(s)
```

## 建立索引

準備 storage context、service context 並建立一個 index object。呼叫 from\_documents() 後，vector store 中將儲存 22 個 vectors。

```
### make a storage context using our vector store
storage_context = StorageContext.from_defaults(vector_store=jaguarstore)


### clear all vectors in the vector store
jaguarstore.clear()


### make an index with the documents,storage context
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)


### You could add more documents to the vector store:
# jaguarstore.add_documents(some_docs)
# jaguarstore.add_documents(more_docs, text_tag="tag to these documents")


### print number of documents in jaguar vector store
num = jaguarstore.count()
print(f"There are {num} vectors in jaguar vector store")
```

```
There are 22 vectors in jaguar vector store
```

## Ask Questions

我們取得一個 query engine 並向引擎提出一些問題。

```
query_engine = index.as_query_engine()
q = "What did the author do growing up?"
print(f"Question: {q}")
response = query_engine.query(q)
print(f"Answer: {str(response)}\n")


q = "What did the author do after his time at Viaweb?"
print(f"Question: {q}")
response = query_engine.query(q)
print(f"Answer: {str(response)}")
```

```
Question: What did the author do growing up?
Answer: The author mentioned that growing up, they worked on two main things outside of school: writing and programming. They wrote short stories and tried writing programs on an IBM 1401 computer.


Question: What did the author do after his time at Viaweb?
Answer: After his time at Viaweb, the author started a company to put art galleries online. However, this idea did not turn out to be successful as art galleries did not want to be online.
```

## Pass Query Options

我們可以向 query engine 傳遞額外的參數，以從 jaguar vector store 中選取數據的子集。這可以透過使用 `vector_store_kwargs` 參數來實現。參數 day\_cutoff 是文本將被忽略的天數。day\_decay\_rate 是相似度分數的每日衰減率。

```
qkwargs = {
    "args": "day_cutoff=365,day_decay_rate=0.01",
    "where": "category='startup' or category=''",
}
query_engine_filter = index.as_query_engine(vector_store_kwargs=qkwargs)
q = "What was the author's life style?"
print(f"Question: {q}")
response = query_engine_filter.query(q)
print(f"Answer: {str(response)}")
```

```
Question: What was the author's life style?
Answer: The author's lifestyle involved attending the Accademia as a student and painting still lives in their bedroom at night. They also wrote essays and had a messy life, which they thought would be interesting and encouraging to others.
```

## Cleanup and Logout所有向量和向量資料在 vector store 中都可以被刪除，並且可以完全移除 vector store 以完成測試。登出呼叫會確保客戶端使用的資源被釋放。

```
### remove all the data in the vector store if you want
jaguarstore.clear()


### delete the whole vector in the database if you want
jaguarstore.drop()


### disconnect from jaguar server and cleanup resources
jaguarstore.logout()
```
