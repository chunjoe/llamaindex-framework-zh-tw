---
title: "一個使用 LLamaIndex 建構全端 Web 應用程式的指南"
---

LlamaIndex 是一個 python 函式庫，這意味著將其整合到全端網頁應用程式中的方式會與您習慣的有所不同。

本指南旨在引導您完成建立一個使用 python 編寫的基本 API 服務的步驟，以及它如何與 TypeScript+React 前端互動。

這裡所有的程式碼範例都可以在 flask\_react 資料夾中的 [llama\_index\_starter\_pack](https://github.com/logan-markewich/llama_index_starter_pack/tree/main/flask_react) 取得。

本指南中使用的主要技術如下：

- python3.11
- llama\_index
- flask
- typescript
- react

## Flask 後端

在本指南中，我們的後端將使用一個 [Flask](https://flask.palletsprojects.com/en/2.2.x/) API 伺服器與前端程式碼進行通訊。如果您願意，您也可以輕鬆地將其轉換為一個 [FastAPI](https://fastapi.tiangolo.com/) 伺服器，或任何您選擇的其他 python 伺服器函式庫。

使用 Flask 設定伺服器非常簡單。您匯入套件，建立 app 物件，然後建立您的 endpoint。我們先建立伺服器的基本骨架：

```
from flask import Flask


app = Flask(__name__)




@app.route("/")
def home():
    return "Hello World!"




if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5601)
```

*flask\_demo.py*

如果您執行此檔案 (`python flask_demo.py`)，它將在 port 5601 上啟動一個伺服器。如果您造訪 `http://localhost:5601/`，您將在瀏覽器中看到「Hello World!」的文字。太棒了！

下一步是決定我們想在伺服器中包含哪些功能，並開始使用 LlamaIndex。

為了保持簡單，我們能提供的最基本的操作是查詢現有的 index。使用 LlamaIndex 中的 [paul graham essay](https://github.com/jerryjliu/llama_index/blob/main/examples/paul_graham_essay/data/paul_graham_essay.txt)，建立一個 documents 資料夾，並將 essay 的文字檔案下載並放入其中。

### 基本 Flask - 處理使用者 Index 查詢

現在，讓我們編寫一些程式碼來初始化我們的 index：

```
import os
from llama_index.core import (
    SimpleDirectoryReader,
    VectorStoreIndex,
    StorageContext,
    load_index_from_storage,
)


# NOTE: for local testing only, do NOT deploy with your key hardcoded
os.environ["OPENAI_API_KEY"] = "your key here"


index = None




def initialize_index():
    global index
    storage_context = StorageContext.from_defaults()
    index_dir = "./.index"
    if os.path.exists(index_dir):
        index = load_index_from_storage(storage_context)
    else:
        documents = SimpleDirectoryReader("./documents").load_data()
        index = VectorStoreIndex.from_documents(
            documents, storage_context=storage_context
        )
        storage_context.persist(index_dir)
```

此函式將初始化我們的 index。如果我們在 `main` 函式中啟動 flask 伺服器之前呼叫此函式，那麼我們的 index 就會準備好接收使用者查詢了！

我們的查詢 endpoint 將接受帶有查詢文字作為參數的 `GET` 請求。完整的 endpoint 函式看起來會像這樣：

```
from flask import request




@app.route("/query", methods=["GET"])
def query_index():
    global index
    query_text = request.args.get("text", None)
    if query_text is None:
        return (
            "No text found, please include a ?text=blah parameter in the URL",
            400,
        )
    query_engine = index.as_query_engine()
    response = query_engine.query(query_text)
    return str(response), 200
```


現在，我們為我們的伺服器引入了一些新的概念：

- 一個由函式裝飾器定義的新 `/query` endpoint
- 一個從 flask, `request` 導入的新物件，用於從請求中獲取參數
- 如果 `text` 參數遺失，則返回錯誤訊息和適當的 HTML 回應代碼
- 否則，我們查詢 index，並將回應作為字串返回

一個您可以在瀏覽器中測試的完整查詢範例可能看起來像這樣：`http://localhost:5601/query?text=what did the author do growing up` (按下 Enter 後，瀏覽器會將空格轉換為「%20」字元)。

情況看起來相當不錯！我們現在有了一個功能性的 API。使用您自己的 documents，您可以輕鬆地提供一個介面，讓任何應用程式都可以呼叫 flask API 並獲得查詢的答案。

### 進階 Flask - 處理使用者 Document 上傳

情況看起來很酷，但我們如何能再進一步呢？如果我們想允許使用者透過上傳自己的 documents 來建立自己的 index 呢？別害怕，Flask 可以處理所有事情 :muscle:。

為了讓使用者上傳 documents，我們必須採取一些額外的預防措施。與查詢現有的 index 不同，index 將會變得**可變的 (mutable)**。如果有多個使用者向同一個 index 添加資料，我們需要考慮如何處理併發性 (concurrency)。我們的 Flask 伺服器是多執行緒的 (threaded)，這意味著多個使用者可以同時向伺服器發送請求，這些請求將同時被處理。

一種方法可能是為每個使用者或群組建立一個 index，並從 S3 儲存和擷取資料。但對於這個範例，我們假設存在一個本地儲存的 index，使用者正在與之互動。為了處理並行上傳和確保索引的順序插入，我們可以利用 `BaseManager` python 套件，使用一個獨立的伺服器和鎖來提供對索引的順序存取。這聽起來很嚇人，但並不算太糟！我們只需將所有索引操作（初始化、查詢、插入）都移到 `BaseManager` 的 “index\_server” 中，並由我們的 Flask server 來呼叫它。

以下是我們移動程式碼後，`index_server.py` 的基本範例：

```
import os
from multiprocessing import Lock
from multiprocessing.managers import BaseManager
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex, Document


# NOTE: for local testing only, do NOT deploy with your key hardcoded
os.environ["OPENAI_API_KEY"] = "your key here"


index = None
lock = Lock()




def initialize_index():
    global index


    with lock:
        # same as before ...
        pass




def query_index(query_text):
    global index
    query_engine = index.as_query_engine()
    response = query_engine.query(query_text)
    return str(response)




if __name__ == "__main__":
    # init the global index
    print("initializing index...")
    initialize_index()


    # setup server
    # NOTE: you might want to handle the password in a less hardcoded way
    manager = BaseManager(("", 5602), b"password")
    manager.register("query_index", query_index)
    server = manager.get_server()


    print("starting server...")
    server.serve_forever()
```

*index\_server.py*

這樣，我們移動了函式，引入了 `Lock` 物件來確保對全局索引的順序存取，在伺服器中註冊了我們的單一函式，並在 port 5602 上使用密碼 `password` 啟動了伺服器。

然後，我們可以像這樣調整我們的 flask 程式碼：

```
from multiprocessing.managers import BaseManager
from flask import Flask, request


# initialize manager connection
# NOTE: you might want to handle the password in a less hardcoded way
manager = BaseManager(("", 5602), b"password")
manager.register("query_index")
manager.connect()




@app.route("/query", methods=["GET"])
def query_index():
    global index
    query_text = request.args.get("text", None)
    if query_text is None:
        return (
            "No text found, please include a ?text=blah parameter in the URL",
            400,
        )
    response = manager.query_index(query_text)._getvalue()
    return str(response), 200




@app.route("/")
def home():
    return "Hello World!"




if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5601)
```

*flask\_demo.py*

主要的兩項變更是連接到我們現有的 `BaseManager` 伺服器並註冊函式，以及透過 `/query` 端點中的 manager 來呼叫函式。

需要注意的一點是，`BaseManager` 伺服器不會像我們預期的那樣回傳物件。為了將回傳值轉換成原始物件，我們呼叫 `_getvalue()` 函式。

如果我們允許使用者上傳自己的 documents，我們可能應該從 documents 資料夾中移除 Paul Graham 的文章，所以我們先做這件事。然後，讓我們新增一個端點來上傳檔案！首先，讓我們定義我們的 Flask 端點函式：

```
...
manager.register("insert_into_index")
...




@app.route("/uploadFile", methods=["POST"])
def upload_file():
    global manager
    if "file" not in request.files:
        return "Please send a POST request with a file", 400


    filepath = None
    try:
        uploaded_file = request.files["file"]
        filename = secure_filename(uploaded_file.filename)
        filepath = os.path.join("documents", os.path.basename(filename))
        uploaded_file.save(filepath)


        if request.form.get("filename_as_doc_id", None) is not None:
            manager.insert_into_index(filepath, doc_id=filename)
        else:
            manager.insert_into_index(filepath)
    except Exception as e:
        # cleanup temp file
        if filepath is not None and os.path.exists(filepath):
            os.remove(filepath)
        return "Error: {}".format(str(e)), 500


    # cleanup temp file
    if filepath is not None and os.path.exists(filepath):
        os.remove(filepath)


    return "File inserted!", 200
```

不難！你會注意到我們將檔案寫入磁碟。如果我們只接受像 `txt` 檔案這類基本檔案格式，我們可以跳過這一步，但寫入磁碟後，我們可以利用 LlamaIndex 的 `SimpleDirectoryReader` 來處理更多複雜的檔案格式。可選地，我們還會使用第二個 `POST` 參數，要麼使用檔名作為 doc\_id，要麼讓 LlamaIndex 為我們生成一個。一旦我們實作前端，這就會更有意義。

對於這些更複雜的請求，我建議使用像 [Postman](https://www.postman.com/downloads/?utm_source=postman-home) 這樣的工具。使用 postman 測試我們端點的範例可以在 [此專案的 repository](https://github.com/logan-markewich/llama_index_starter_pack/tree/main/flask_react/postman_examples) 中找到。

最後，你會注意到我們在 manager 中新增了一個函式。讓我們在 `index_server.py` 中實作它：

```
def insert_into_index(doc_text, doc_id=None):
    global index
    document = SimpleDirectoryReader(input_files=[doc_text]).load_data()[0]
    if doc_id is not None:
        document.doc_id = doc_id


    with lock:
        index.insert(document)
        index.storage_context.persist()




...
manager.register("insert_into_index", insert_into_index)
...
```

簡單！如果我們啟動 `index_server.py` 和後續的 `flask_demo.py` python 檔案，我們就會有一個 Flask API 伺服器，它可以處理對 vector index 插入 documents 的多個請求並回應使用者查詢！

為了支援前端的一些功能，我調整了 Flask API 的某些回應方式，並新增了一些功能來追蹤哪些 documents 儲存在索引中（LlamaIndex 目前無法以使用者友好的方式支援此功能，但我們可以自己增加！）。最後，我必須使用 `Flask-cors` python 套件為伺服器新增 CORS 支援。

請查看 [repository](https://github.com/logan-markewich/llama_index_starter_pack/tree/main/flask_react) 中的完整 `flask_demo.py` 和 `index_server.py` 腳本，以獲取最終的微小變更、the`requirements.txt` 檔案以及一個範例 `Dockerfile` 以便部署。

## React 前端

通常，React 和 Typescript 是目前編寫網頁應用程式最受歡迎的函式庫和語言之一。本指南假設您熟悉這些工具的工作方式，否則本指南的篇幅會增加三倍 :smile:。

在 [repository](https://github.com/logan-markewich/llama_index_starter_pack/tree/main/flask_react) 中，前端程式碼組織在 `react_frontend` 資料夾內。

前端最相關的部分是 `src/apis` 資料夾。這是我們呼叫 Flask server 的地方，支援以下查詢：

- `/query` — 對現有索引進行查詢
- `/uploadFile` — 上傳檔案到 flask server 以插入索引
- `/getDocuments` — 列出當前的 document 標題及其部分文本使用這三個查詢，我們可以建立一個強大的前端，讓使用者可以上傳和追蹤他們的檔案、查詢索引，並查看查詢的結果以及用於形成回應的文本所使用的 nodes 資訊。

### fetchDocuments.tsx

此檔案包含用於獲取索引中當前 documents 列表的函式。程式碼如下：

```
export type Document = {
  id: string;
  text: string;
};


const fetchDocuments = async (): Promise<Document[]> => {
  const response = await fetch("http://localhost:5601/getDocuments", {
    mode: "cors",
  });


  if (!response.ok) {
    return [];
  }


  const documentList = (await response.json()) as Document[];
  return documentList;
};
```

如您所見，我們向 Flask server 進行查詢（這裡假設在 localhost 上運行）。請注意，由於我們正在進行外部請求，我們需要包含 `mode: 'cors'` 選項。

然後，我們檢查回應是否成功，如果成功，則獲取回應 json 並回傳。在這裡，回應 json 是一個包含在同一個檔案中定義的 `Document` 物件的列表。

### queryIndex.tsx

此檔案將使用者查詢發送到 flask server，並接收回傳的結果，以及關於哪個 nodes 在我們的索引中提供了回應的詳細資訊。

```
export type ResponseSources = {
  text: string;
  doc_id: string;
  start: number;
  end: number;
  similarity: number;
};


export type QueryResponse = {
  text: string;
  sources: ResponseSources[];
};


const queryIndex = async (query: string): Promise<QueryResponse> => {
  const queryURL = new URL("http://localhost:5601/query?text=1");
  queryURL.searchParams.append("text", query);


  const response = await fetch(queryURL, { mode: "cors" });
  if (!response.ok) {
    return { text: "Error in query", sources: [] };
  }


  const queryResponse = (await response.json()) as QueryResponse;


  return queryResponse;
};


export default queryIndex;
```

這與 `fetchDocuments.tsx` 檔案相似，主要區別在於我們將查詢文本作為 URL 中的參數包含在內。然後，我們檢查回應是否成功，並使用適當的 typescript 類型回傳它。

### insertDocument.tsx

可能是最複雜的 API 呼叫，即上傳一個 document。此函式接受一個 file object，並使用 `FormData` 建構一個使用 `POST` 的請求。

實際的回應文本並不會在應用程式中使用，但可用於提供使用者回饋，以判斷檔案是否上傳失敗。

```
const insertDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("filename_as_doc_id", "true");


  const response = await fetch("http://localhost:5601/uploadFile", {
    mode: "cors",
    method: "POST",
    body: formData,
  });


  const responseText = response.text();
  return responseText;
};


export default insertDocument;
```

### 所有其他前端功能

這幾乎總結了前端部分！剩餘的 react 前端程式碼是一些相當基本的 react component，是我讓它看起來至少有點不錯的最好嘗試 :smile:.

我鼓勵您閱讀 [codebase](https://github.com/logan-markewich/llama_index_starter_pack/tree/main/flask_react/react_frontend) 的剩餘部分，並提交任何改進的 PR！

## 結論

本指南涵蓋了大量資訊。我們從一個使用 python 編寫的基本「Hello World」Flask server，發展到一個功能完善的 LlamaIndex 後端，以及如何將其連接到前端應用程式。

如您所見，我們可以輕鬆地增強和包裝由 LlamaIndex 提供的服務（例如小的外部 document 追蹤器），以幫助在前端提供良好的使用者體驗。

您可以將此應用並新增許多功能（多索引/使用者支援、將物件儲存到 S3、新增一個 Pinecone vector server 等）。當您閱讀完此指南後建立應用程式時，請務必在 Discord 上分享最終結果！祝您好運！ :muscle: