---
title: "一個使用 Delphic 建構全端 LlamaIndex Web App 的指南"
---

本指南旨在引導您使用 LlamaIndex 與一個名為 [Delphic](https://github.com/JSv4/Delphic) 的生產就緒 Web App 啟動範本。此處所有的程式碼範例皆可從 [Delphic](https://github.com/JSv4/Delphic) repo 取得。

## 我們正在建構什麼

以下是 Delphic 的即開箱功能快速演示：

<https://user-images.githubusercontent.com/5049984/233236432-aa4980b6-a510-42f3-887a-81485c9644e6.mp4>

## 架構概述

Delphic 利用 LlamaIndex python 函式庫，讓使用者可以建立自己的 document collections，並能在響應式的前端進行查詢。

我們選擇了一個技術堆疊，提供了一個響應式、穩健的技術組合，能夠 (1) 協調複雜的 python 處理任務，同時提供 (2) 一個現代、響應式的前端，以及 (3) 一個安全的後端，以便在此基礎上建構額外的功能。

核心函式庫包括：

1. [Django](https://www.djangoproject.com/)
2. [Django Channels](https://channels.readthedocs.io/en/stable/)
3. [Django Ninja](https://django-ninja.rest-framework.com/)
4. [Redis](https://redis.io/)
5. [Celery](https://docs.celeryq.dev/en/stable/getting-started/introduction.html)
6. [LlamaIndex](https://gpt-index.readthedocs.io/en/latest/)
7. [Langchain](https://python.langchain.com/en/latest/index.html)
8. [React](https://github.com/facebook/react)
9. Docker & Docker Compose

得益於建立在超穩定的 Django Web framework 之上的現代堆疊，啟動版的 Delphic 應用具備簡化的開發者體驗、內建的身份驗證和使用者管理、非同步的 vector store 處理，以及基於 Web-socket 的查詢連線以實現響應式 UI。此外，我們的前端是使用 TypeScript 建構的，並基於 MUI React，以提供響應式且現代的使用者介面。

## 系統要求

Celery 無法在 Windows 上運行。它可能可以部署在 Windows Subsystem for Linux 上，但配置該選項超出了本教學的範圍。因此，我們建議您僅在運行 Linux 或 OSX 時才遵循本教學。您需要安裝 Docker 和 Docker Compose 才能部署應用程式。本地開發需要 node version manager (nvm)。

## Django 後端

### 專案目錄概覽

Delphic 應用程式具有結構化的後端目錄組織，遵循常見的 Django 專案慣例。從 repo 根目錄開始，在 `./delphic` 子資料夾中，主要的資料夾如下：

1. `contrib`: 此目錄包含對 Django 內建 `contrib` 應用程式的自訂修改或新增內容。
2. `indexes`: 此目錄包含與 document 索引和 LLM 整合相關的核心功能。它包括：

- `admin.py`: 應用程式的 Django admin 設定
- `apps.py`: 應用程式設定
- `models.py`: 包含應用程式的資料庫模型 (database models)
- `migrations`: 包含應用程式資料庫結構遷移 (database schema migrations) 的目錄
- `signals.py`: 定義應用程式的任何訊號 (signals)
- `tests.py`: 應用程式的單元測試 (Unit tests)

3. `tasks`: 此目錄包含使用 Celery 進行非同步處理的任務。`index_tasks.py` 檔案包含用於建立 vector indexes 的任務。
4. `users`: 此目錄專門用於使用者管理，包括：
5. `utils`: 此目錄包含跨應用程式使用的工具模組和函式，例如自訂儲存後端 (custom storage backends)、路徑輔助器 (path helpers) 和與 collection 相關的工具。

### 資料庫模型

Delphic 應用程式有兩個核心模型：`Document` 和 `Collection`。這些模型代表應用程式在利用 LLMs 索引和查詢 documents 時所處理的中心實體。它們定義在 [`./delphic/indexes/models.py`](https://github.com/JSv4/Delphic/blob/main/delphic/indexes/models.py) 中。

1. `Collection`:

- `api_key`: 一個外鍵 (foreign key)，將一個 collection 與一個 API key 連結。這有助於將 job 與來源的 API key 關聯起來。
- `title`: 一個字元欄位 (character field)，提供 collection 的標題 (title)。
- `description`: 一個文字欄位 (text field)，提供 collection 的描述 (description)。
- `status`: 一個字元欄位，儲存 collection 的處理狀態 (processing status)，利用 `CollectionStatus` enumeration。- `created`：記錄集合建立時間的 datetime 欄位。
- `modified`：記錄集合最後修改時間的 datetime 欄位。
- `model`：儲存與集合相關聯的模型的文件欄位。
- `processing`：一個布林值欄位，表示集合目前是否正在處理中。

2. `Document`：

- `collection`：一個外鍵，將 document 與一個集合連結。這代表 documents 與集合之間的關係。
- `file`：一個文件欄位，儲存上傳的 document 文件。
- `description`：一個文字欄位，提供 document 的描述。
- `created`：記錄 document 建立時間的 datetime 欄位。
- `modified`：記錄 document 最後修改時間的 datetime 欄位。

這些模型為 documents 的集合及其使用 LlamaIndex 建立的索引奠定了堅實的基礎。

### Django Ninja API

Django Ninja 是一個使用 Django 和 Python 3.7+ type hints 建構 API 的網路框架。它提供了一種簡單、直觀且富有表現力的方式來定義 API 端點，利用 Python 的 type hints 自動生成輸入驗證、序列化和文件。

在 Delphic repo 中，[`./config/api/endpoints.py`](https://github.com/JSv4/Delphic/blob/main/config/api/endpoints.py) 文件包含 API 路由和 API 端點的邏輯。現在，我們簡要說明 `endpoints.py` 文件中每個端點的用途：

1. `/heartbeat`：一個簡單的 GET 端點，用於檢查 API 是否正在運行。如果 API 可存取，則回傳 `True`。這對於預期能夠查詢您的 container 以確保其正在運行的 Kubernetes 設定很有幫助。

2. `/collections/create`：一個 POST 端點，用於建立一個新的 `Collection`。接受如 `title`、`description` 和一個 `files` 列表等表單參數。為每個文件建立新的 `Collection` 和 `Document` 實例，並排程一個 Celery 任務來建立一個索引。

```
@collections_router.post("/create")
async def create_collection(
    request,
    title: str = Form(...),
    description: str = Form(...),
    files: list[UploadedFile] = File(...),
):
    key = None if getattr(request, "auth", None) is None else request.auth
    if key is not None:
        key = await key


    collection_instance = Collection(
        api_key=key,
        title=title,
        description=description,
        status=CollectionStatusEnum.QUEUED,
    )


    await sync_to_async(collection_instance.save)()


    for uploaded_file in files:
        doc_data = uploaded_file.file.read()
        doc_file = ContentFile(doc_data, uploaded_file.name)
        document = Document(collection=collection_instance, file=doc_file)
        await sync_to_async(document.save)()


    create_index.si(collection_instance.id).apply_async()


    return await sync_to_async(CollectionModelSchema)(...)
```

3. `/collections/query` — 一個 POST 端點，使用 LLM 查詢一個 document 集合。接受包含 `collection_id` 和 `query_str` 的 JSON payload，並回傳由查詢集合生成的響應。我們在聊天 GUI 中實際上不使用此端點（我們使用 websocket - 如下所示），但您可以建立一個應用程式來整合到此 REST endpoint 以查詢特定的集合。

```
@collections_router.post(
    "/query",
    response=CollectionQueryOutput,
    summary="Ask a question of a document collection",
)
def query_collection_view(
    request: HttpRequest, query_input: CollectionQueryInput
):
    collection_id = query_input.collection_id
    query_str = query_input.query_str
    response = query_collection(collection_id, query_str)
    return {"response": response}
```

4. `/collections/available`：一個 GET 端點，回傳所有使用用戶 API 鍵建立的集合列表。輸出使用 `CollectionModelSchema` 進行序列化。

```
@collections_router.get(
    "/available",
    response=list[CollectionModelSchema],
    summary="Get a list of all of the collections created with my api_key",
)
async def get_my_collections_view(request: HttpRequest):
    key = None if getattr(request, "auth", None) is None else request.auth
    if key is not None:
        key = await key


    collections = Collection.objects.filter(api_key=key)


    return [{...} async for collection in collections]
```

5. `/collections/{collection_id}/add_file`：一個 POST 端點，用於向現有集合中新增一個文件。接受 `collection_id` 路徑參數，以及如 `file` 和 `description` 等表單參數。將該文件作為與指定集合相關聯的 `Document` 實例新增。

```
@collections_router.post(
    "/{collection_id}/add_file", summary="Add a file to a collection"
)
async def add_file_to_collection(
    request,
    collection_id: int,
    file: UploadedFile = File(...),
    description: str = Form(...),
):
    collection = await sync_to_async(Collection.objects.get)(id=collection_id)
```

### Websockets 簡介

WebSockets 是一種通訊協定，它允許客戶端和伺服器在單一、長生命週的連線上進行雙向和全雙工通訊。WebSocket 協定設計用於在與 HTTP 和 HTTPS（分別是 80 和 443 埠）相同的埠上運行，並使用類似的握手過程來建立連線。一旦連線建立，數據可以作為「frame」在雙向傳輸，而無需每次都重新建立連線，不像傳統的 HTTP 請求。

使用 WebSockets 有幾個原因，特別是當處理需要較長時間載入到記憶體中但一旦載入後運行快速的程式碼時：

1. **效能 (Performance)**：WebSockets 消除了為每個請求開啟和關閉多個連線的開銷，降低了延遲。2. **Efficiency**: WebSockets allow for real-time communication without the need for polling, resulting in more efficient use of resources and better responsiveness.
3. **Scalability**: WebSockets can handle a large number of simultaneous connections, making it ideal for applications that require high concurrency.

在 Delphic 應用程式的情況下，使用 WebSockets 是合理的，因為將 LLMs 載入記憶體的成本可能很高。透過建立 WebSocket 連線，LLM 可以保持在記憶體中，讓後續的請求能快速處理，而不需要每次都重新載入 model。

ASGI 設定檔 [`./config/asgi.py`](https://github.com/JSv4/Delphic/blob/main/config/asgi.py) 定義了應用程式應如何處理傳入連線，並使用 Django Channels `ProtocolTypeRouter` 根據其協定類型來路由連線。在此案例中，我們有兩種協定類型：「http」與「websocket」。

「httpprotocol 類型 使用標準的 Django ASGI 用來處理的應用程式 HTTP requests，而「websocket」協定類型則使用自定義的 `TokenAuthMiddleware` 以進行身分驗證 WebSocket 連線 The `URLRouter` 在...之內 `TokenAuthMiddleware` 定義了一個 URL 用於該...的模式 `CollectionQueryConsumer`，負責處理 WebSocket 與查詢相關的 connections document collections。

```
application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": TokenAuthMiddleware(
            URLRouter(
                [
                    re_path(
                        r"ws/collections/(?P<collection_id>\w+)/query/$",
                        CollectionQueryConsumer.as_asgi(),
                    ),
                ]
            )
        ),
    }
)
```

此配置允許用戶端建立 WebSocket 與 the 的連線 Delphic 應用程式以高效地查詢 document 使用 the 的 collections LLMs，無需在每次請求時重新載入模型。

### Websocket Handler

The `CollectionQueryConsumer` 類別於 [`config/api/websockets/queries.py`](https://github.com/JSv4/Delphic/blob/main/config/api/websockets/queries.py) 負責處理 WebSocket 與查詢相關的 connections document collections。 它繼承自於 the `AsyncWebsocketConsumer` 由所提供的 class Django Channels.

`CollectionQueryConsumer` 類別有三個主要方法：

1. `connect`: Called 當一個 WebSocket 是連線過程的一部分之交握 (handshaking)。
2. `disconnect`: Called 當一個 WebSocket 因任何原因關閉。
3. `receive`: Called 當伺服器收到來自於 the WebSocket.

#### Websocket 連接監聽器

`connect` 方法負責建立連線、從連線路徑中提取 collection ID、載入 collection model 並接受連線。

```
async def connect(self):
    try:
        self.collection_id = extract_connection_id(self.scope["path"])
        self.index = await load_collection_model(self.collection_id)
        await self.accept()


    except ValueError as e:
        await self.accept()
        await self.close(code=4000)
    except Exception as e:
        pass
```

#### Websocket 中斷連線監聽器

在這種情況下，`disconnect` 方法是空的，因為當 WebSocket 關閉時不需要執行任何額外操作。

#### Websocket 接收監聽器

`receive` 方法負責處理來自 WebSocket 的傳入訊息。它會接收傳入訊息並將其解碼，接著使用提供的 query 查詢已載入的 collection model。最後將回應格式化為 markdown 字串，並透過 WebSocket 連線傳回給用戶端。

```
async def receive(self, text_data):
    text_data_json = json.loads(text_data)


    if self.index is not None:
        query_str = text_data_json["query"]
        modified_query_str = f"Please return a nicely formatted markdown string to this request:\n\n{query_str}"
        query_engine = self.index.as_query_engine()
        response = query_engine.query(modified_query_str)


        markdown_response = f"## Response\n\n{response}\n\n"
        if response.source_nodes:
            markdown_sources = (
                f"## Sources\n\n{response.get_formatted_sources()}"
            )
        else:
            markdown_sources = ""


        formatted_response = f"{markdown_response}{markdown_sources}"


        await self.send(json.dumps({"response": formatted_response}, indent=4))
    else:
        await self.send(
            json.dumps(
                {"error": "No index loaded for this connection."}, indent=4
            )
        )
```

若要載入 collection 模型，該 `load_collection_model` 使用了 function，可以在 [`delphic/utils/collections.py`](https://github.com/JSv4/Delphic/blob/main/delphic/utils/collections.py). 此函數會擷取具有指定 collection 的 collection 物件 ID，檢查是否為一個 JSON 若 collection model 的檔案不存在，則建立一個。 接著，它會設定該 `LLM` 以及 `Settings` 在載入 the `VectorStoreIndex` 使用快取檔案。

```
from llama_index.core import Settings




async def load_collection_model(collection_id: str | int) -> VectorStoreIndex:
    """
    Load the Collection model from cache or the database, and return the index.


    Args:
        collection_id (Union[str, int]): The ID of the Collection model instance.


    Returns:
        VectorStoreIndex: The loaded index.


    This function performs the following steps:
    1. Retrieve the Collection object with the given collection_id.
    2. Check if a JSON file with the name '/cache/model_{collection_id}.json' exists.
    3. If the JSON file doesn't exist, load the JSON from the Collection.model FileField and save it to
       '/cache/model_{collection_id}.json'.
    4. Call VectorStoreIndex.load_from_disk with the cache_file_path.
    """
    # Retrieve the Collection object
    collection = await Collection.objects.aget(id=collection_id)
    logger.info(f"load_collection_model() - loaded collection {collection_id}")


    # Make sure there's a model
    if collection.model.name:
        logger.info("load_collection_model() - Setup local json index file")


        # Check if the JSON file exists
        cache_dir = Path(settings.BASE_DIR) / "cache"
        cache_file_path = cache_dir / f"model_{collection_id}.json"
        if not cache_file_path.exists():
            cache_dir.mkdir(parents=True, exist_ok=True)
            with collection.model.open("rb") as model_file:
                with cache_file_path.open(
                    "w+", encoding="utf-8"
                ) as cache_file:
                    cache_file.write(model_file.read().decode("utf-8"))


        # define LLM
        logger.info(
            f"load_collection_model() - Setup Settings with tokens {settings.MAX_TOKENS} and "
            f"model {settings.MODEL_NAME}"
        )
        Settings.llm = OpenAI(
            temperature=0, model="gpt-3.5-turbo", max_tokens=512
        )


        # Call VectorStoreIndex.load_from_disk
        logger.info("load_collection_model() - Load llama index")
        index = VectorStoreIndex.load_from_disk(
            cache_file_path,
        )
        logger.info(
            "load_collection_model() - Llamaindex loaded and ready for query..."
        )


    else:
        logger.error(
            f"load_collection_model() - collection {collection_id} has no model!"
        )
        raise ValueError("No model exists for this collection!")


    return index
```

## React Frontend

### 概觀

我們選擇使用 TypeScript, React 以及 Material-UI (MUI) 用於 the Delphic 專案的前端，原因有幾個。 首先，作為最受歡迎的元件 library (MUI) 用於最受歡迎的前端 framework (React），這個選擇讓這個專案能被龐大的開發者社群所接納。 Second, React 目前是一個穩定且普遍受歡迎的 framework，透過其 virtual 形式提供有價值的 abstractions DOM 同時保持相對穩定，且我們認為相當容易學習，再次使其變得易於上手。

### Frontend Project Structure

前端可以在 repo 的 [`/frontend`](https://github.com/JSv4/Delphic/tree/main/frontend) 目錄中找到，React 相關的元件在 `/frontend/src`。你會注意到 `frontend` 目錄中有一個 DockerFile，以及幾個與配置前端 Web 伺服器 — [nginx](https://www.nginx.com/) 相關的資料夾和檔案。

`/frontend/src/App.tsx` 檔案作為應用程式的入口點。它定義了主要的元件，例如登入表單、抽屜佈局 (drawer layout) 和建立集合的 modal。主要的元件會根據使用者是否已登入以及是否擁有認證 token 而進行條件渲染。

DrawerLayout2 元件定義在 `DrawerLayour2.tsx` 檔案中。此元件管理應用程式的佈局，並提供導航和主要內容區域。

由於應用程式相對簡單，我們可以使用 React 的 useState hooks 而不必使用 Redux 等複雜的狀態管理解決方案。

### 從後端獲取集合

登入使用者可用的集合會被檢索並顯示在 DrawerLayout2 元件中。此過程可分解為以下步驟：

1. 初始化狀態變數：

```
const [collections, setCollections] = useState<CollectionModelSchema[]>([]);
const [loading, setLoading] = useState(true);
```

在這裡，我們初始化兩個狀態變數：`collections` 用於儲存集合列表，以及 `loading` 用於追蹤集合是否正在獲取中。

2. 使用 `fetchCollections()` 函式為登入使用者獲取集合：

```
const
fetchCollections = async () = > {
try {
const accessToken = localStorage.getItem("accessToken");
if (accessToken) {
const response = await getMyCollections(accessToken);
setCollections(response.data);
}
} catch (error) {
console.error(error);
} finally {
setLoading(false);
}
};
```

`fetchCollections` 函式透過呼叫 `getMyCollections` API 函式並傳入使用者的存取 token 來檢索登入使用者的集合。然後，它會用檢索到的資料更新 `collections` 狀態，並將 `loading` 狀態設定為 `false` 以表示獲取完成。

### 顯示集合

最新的集合會像這樣顯示在抽屜中：

```
< List >
{collections.map((collection) = > (
    < div key={collection.id} >
    < ListItem disablePadding >
    < ListItemButton
    disabled={
    collection.status != = CollectionStatus.COMPLETE | |
    !collection.has_model
    }
    onClick={() = > handleCollectionClick(collection)}
selected = {
    selectedCollection & &
    selectedCollection.id == = collection.id
}
>
< ListItemText
primary = {collection.title} / >
          {collection.status == = CollectionStatus.RUNNING ? (
    < CircularProgress
    size={24}
    style={{position: "absolute", right: 16}}
    / >
): null}
< / ListItemButton >
    < / ListItem >
        < / div >
))}
< / List >
```

你會注意到集合的 `disabled` 屬性在集合的 `ListItemButton` 中設定，取決於集合的狀態是否不是 `CollectionStatus.COMPLETE` 或集合是否沒有模型 (`!collection.has_model`)。如果這兩個條件中任何一個為真，按鈕將被禁用，防止使用者選擇不完整或沒有模型的集合。當 CollectionStatus 為 RUNNING 時，我們也會在按鈕上顯示一個載入輪。

在一個單獨的 `useEffect` hook 中，我們檢查 `collections` 狀態中的任何集合是否具有 `CollectionStatus.RUNNING` 或 `CollectionStatus.QUEUED` 的狀態。如果是，我們將設定一個間隔，每 15 秒 (15,000 毫秒) 反覆呼叫 `fetchCollections` 函式來更新集合狀態。這樣一來，應用程式會定期檢查已完成的集合，並且在處理完成時，UI 會相應更新。

```
useEffect(() = > {
    let
interval: NodeJS.Timeout;
if (
    collections.some(
        (collection) = >
collection.status == = CollectionStatus.RUNNING | |
collection.status == = CollectionStatus.QUEUED
)
) {
    interval = setInterval(() = > {
    fetchCollections();
}, 15000);
}
return () = > clearInterval(interval);
}, [collections]);
```

### 聊天視圖元件

`ChatView` 在 `frontend/src/chat/ChatView.tsx` 中的元件負責處理和顯示一個聊天介面，讓使用者與集合互動。此元件會建立一個 WebSocket 連線，以實時與伺服器通訊，發送和接收訊息。

`ChatView` 元件的關鍵功能包括：

1. 與伺服器建立和管理 WebSocket 連線。
2. 以聊天形式顯示來自使用者和伺服器的訊息。
3. 處理使用者輸入以將訊息發送給伺服器。
4. 根據從伺服器接收到的訊息來更新訊息狀態和 UI。
5. 顯示連線狀態和錯誤，例如載入訊息、連線到伺服器，或在載入集合時遇到錯誤。

所有這些共同使使用者能夠以非常流暢、低延遲的體驗與他們選擇的集合互動。

#### Chat Websocket Client

`ChatView` 元件中的 WebSocket 連線用於在客戶端和伺服器之間建立實時通訊。WebSocket 連線在 `ChatView` 元件中被設定和管理如下：

首先，我們需要初始化 WebSocket 參考：

const websocket = useRef\<WebSocket | null>(null);一個 `websocket` 參考是使用 `useRef` 建立的，它持有將用於通訊的 WebSocket object。`useRef` 是一個 React 中的 hook，允許您建立一個在渲染之間持續存在的可變參考物件。當您需要持有對可變物件（例如 WebSocket 連線）的參考，而不想引起不必要的重新渲染時，它特別有用。

在 `ChatView` component 中，WebSocket 連線需要在整個 component 的生命週期中建立並維持，並且在連線狀態改變時不應觸發重新渲染。透過使用 `useRef`，您可以確保 WebSocket 連線被視為一個參考，並且 component 只在發生實際的狀態變更時重新渲染，例如更新訊息或顯示錯誤。

`setupWebsocket` function 負責建立 WebSocket 連線並設定事件處理器來處理不同的 WebSocket 事件。

總體來說，setupWebsocket function 看起來如下：

```
const setupWebsocket = () => {
  setConnecting(true);
  // Here, a new WebSocket object is created using the specified URL, which includes the
  // selected collection's ID and the user's authentication token.


  websocket.current = new WebSocket(
    `ws://localhost:8000/ws/collections/${selectedCollection.id}/query/?token=${authToken}`,
  );


  websocket.current.onopen = (event) => {
    //...
  };


  websocket.current.onmessage = (event) => {
    //...
  };


  websocket.current.onclose = (event) => {
    //...
  };


  websocket.current.onerror = (event) => {
    //...
  };


  return () => {
    websocket.current?.close();
  };
};
```

在許多地方，我們根據來自 WebSocket client 的資訊觸發 GUI 的更新。

當 component 首次開啟並嘗試建立連線時，`onopen` listener 會被觸發。在 callback 中，component 會更新狀態以反映連線已建立，清除任何先前的錯誤，並且沒有訊息在等待回應：

```
websocket.current.onopen = (event) => {
  setError(false);
  setConnecting(false);
  setAwaitingMessage(false);


  console.log("WebSocket connected:", event);
};
```

當透過 WebSocket 連線從伺服器收到新訊息時，`onmessage` 會被觸發。在 callback 中，接收到的資料會被解析，並且 `messages` 狀態會用來自伺服器的新訊息更新：

```
websocket.current.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("WebSocket message received:", data);
  setAwaitingMessage(false);


  if (data.response) {
    // Update the messages state with the new message from the server
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender_id: "server",
        message: data.response,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }
};
```

當 WebSocket 連線關閉時，`onclose` 會被觸發。在 callback 中，component 會檢查特定的關閉代碼（`4000`）以顯示警告 toast 並相應地更新 component 狀態。它也會記錄關閉事件：

```
websocket.current.onclose = (event) => {
  if (event.code === 4000) {
    toast.warning(
      "Selected collection's model is unavailable. Was it created properly?",
    );
    setError(true);
    setConnecting(false);
    setAwaitingMessage(false);
  }
  console.log("WebSocket closed:", event);
};
```

最後，當 WebSocket 連線發生錯誤時，`onerror` 會被觸發。在 callback 中，component 會更新狀態以反映錯誤並記錄錯誤事件：

```
websocket.current.onerror = (event) => {
  setError(true);
  setConnecting(false);
  setAwaitingMessage(false);


  console.error("WebSocket error:", event);
};
```

#### 渲染我們的聊天訊息

在 `ChatView` component 中，佈局是使用 CSS styling 和 Material-UI components 來決定的。主要佈局由一個具有 `flex` display 和一個欄式 `flexDirection` 組成的 container 組成。這確保了 container 內部的內容是垂直排列的。

佈局中有三個主要部分：

1. 聊天訊息區域：此區域佔用大部分可用空間，並顯示用戶與伺服器之間交換的訊息列表。它設定了 overflow-y 為 ‘auto’，允許內容在超出可用空間時進行滾動。訊息使用 `ChatMessage` component 為每條訊息渲染，並使用 `ChatMessageLoading` component 來顯示在等待伺服器回應期間的載入狀態。
2. 分隔線：使用 Material-UI `Divider` component 將聊天訊息區域與輸入區域分開，在兩個部分之間建立清晰的視覺區分。
3. 輸入區域：此區域位於底部，允許用戶輸入和發送訊息。它包含一個來自 Material-UI 的 `TextField` component，設定為接受最多 2 行的多行輸入。輸入區域還包括一個 `Button` component 用於發送訊息。用戶可以點擊“Send”按鈕或在鍵盤上按下 “Enter”鍵來發送訊息。

在 `ChatView` component 中接受的用戶輸入是用戶在 `TextField` 中輸入的文字訊息。該 component 會處理這些文字輸入並透過 WebSocket 連線將其發送到伺服器。

## 部署

### 先決條件若要部署應用程式，您需要安裝 Docker 和 Docker Compose。如果您在 Ubuntu 或其他常見的 Linux 發行版上，DigitalOcean 有一個 [很棒的 Docker 教程](https://www.digitalocean.com/community/tutorial_collections/how-to-install-and-use-docker) 和另一個關於 [Docker Compose](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04) 的精彩教程供您參考。如果這些對您無效，請嘗試 [官方的 docker 文件](https://docs.docker.com/engine/install/)。

### 建置與部署

此專案基於 django-cookiecutter，非常容易在 VM 上部署，並設定為為特定網域提供 HTTPS 流量。然而，配置過程有些複雜——這並非因為這個專案，而是配置憑證、DNS 等等是一個相當複雜的主題。

就本指南而言，我們只需在本地運行即可。我們可能會發布一個關於生產環境部署的指南。在此期間，請查看 [Django Cookiecutter project docs](https://cookiecutter-django.readthedocs.io/en/latest/deployment-with-docker.html) 了解入門資訊。

本指南假設您的目標是讓應用程式可以運行使用。如果您想開發，很可能您不想使用帶有 — profiles fullstack 標誌啟動 compose stack，而是想使用 node 開發伺服器來啟動 react frontend。

要部署，請先複製倉庫：

```
git clone https://github.com/yourusername/delphic.git
```

切換到專案目錄：

```
cd delphic
```

複製範例環境文件：

```
mkdir -p ./.envs/.local/
cp -a ./docs/sample_envs/local/.frontend ./frontend
cp -a ./docs/sample_envs/local/.django ./.envs/.local
cp -a ./docs/sample_envs/local/.postgres ./.envs/.local
```

編輯 `.django` 和 `.postgres` 配置檔，以包含您的 OpenAI API 金鑰，並為您的資料庫使用者設定一個唯一的密碼。您也可以在 .django 文件中設定 response token limit，或切換您想使用的 OpenAI 模型。GPT4 受到支援，前提是您已獲得存取權。

使用 `--profiles fullstack` 標誌建置 docker compose stack：

```
sudo docker-compose --profiles fullstack -f local.yml build
```

fullstack 標誌指示 compose 從前端資料夾建置一個 docker container，並會與所有需要的後端 container 一同啟動。建置生產環境的 React container 需要很長時間，因此我們不建議您這樣開發。請遵循 [project readme.md 中的說明](https://github.com/JSv4/Delphic#development) 以獲取開發環境設定說明。

最後，啟動應用程式：

```
sudo docker-compose -f local.yml up
```

現在，在瀏覽器中訪問 `localhost:3000` 查看前端，並在本地使用 Delphic 應用程式。

## 使用應用程式

### 設定使用者

為了實際使用應用程式（目前我們打算讓未經身份驗證的使用者可以分享某些模型），您需要登入。您可以使用超級使用者或非超級使用者。無論哪種情況，有人需要先使用 console 建立一個超級使用者：

**為什麼要設定一個 Django superuser？** Django superuser 擁有應用程式中的所有權限，可以管理系統的所有方面，包括建立、修改和刪除使用者、集合和其他資料。設定超級使用者讓您可以完全控制和管理應用程式。

**如何建立一個 Django superuser：**

1 執行以下指令來建立一個超級使用者：

sudo docker-compose -f local.yml run django python manage.py createsuperuser

2 您將會被提示提供超級使用者的使用者名稱、電子郵件地址和密碼。輸入所需資訊。

**如何使用 Django admin 建立額外使用者：**

1 按照部署說明在本地啟動您的 Delphic 應用程式。
2 在瀏覽器中導航到 `http://localhost:8000/admin` 訪問 Django admin 介面。
3 使用您先前建立的超級使用者憑證登入。
4 點擊“Authentication and Authorization”部分下的 “Users”。
5 點擊右上角的 “Add user +” 按鈕。
6 輸入新使用者的所需資訊，例如使用者名稱和密碼。點擊 “Save” 以建立使用者。
7 若要授予新使用者額外權限或將其設為超級使用者，請在使用者列表中點擊其使用者名稱，向下滾動到 “Permissions” 部分，並相應地設定其權限。儲存您的變更。