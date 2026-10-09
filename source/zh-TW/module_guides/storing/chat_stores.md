---
title: "聊天儲存區"
---

聊天儲存區提供集中式介面，用來保存聊天記錄。與其他儲存格式不同，聊天記錄中的訊息順序很重要，因為順序會影響整段對話的脈絡。

聊天儲存區可依鍵值（例如 `user_ids` 或其他可唯一識別的字串）整理聊天訊息序列，並支援 `delete`、`insert` 和 `get` 操作。

## SimpleChatStore

最基本的聊天儲存區是 `SimpleChatStore`，它會將訊息保存在記憶體中，也可以讀寫磁碟，或序列化後存放在其他位置。

通常會建立聊天儲存區並傳入記憶體模組。若未指定聊天儲存區，使用聊天儲存區的記憶體模組預設會採用 `SimpleChatStore`。

```
from llama_index.core.storage.chat_store import SimpleChatStore
from llama_index.core.memory import ChatMemoryBuffer


chat_store = SimpleChatStore()


chat_memory = ChatMemoryBuffer.from_defaults(
    token_limit=3000,
    chat_store=chat_store,
    chat_store_key="user1",
)
```

建立記憶體後，可以將它用於代理程式或聊天引擎：

```
agent = FunctionAgent(tools=tools, llm=llm)
await agent.run("...", memory=memory)
# OR
chat_engine = index.as_chat_engine(memory=memory)
```

若要稍後繼續使用聊天儲存區，可以將它存入磁碟並在之後載入。

```
chat_store.persist(persist_path="chat_store.json")
loaded_chat_store = SimpleChatStore.from_persist_path(
    persist_path="chat_store.json"
)
```

也可以將聊天儲存區轉換成字串，另行保存該字串，再從字串還原。

```
chat_store_string = chat_store.json()
loaded_chat_store = SimpleChatStore.parse_raw(chat_store_string)
```

## UpstashChatStore

使用 `UpstashChatStore`，可以透過 Upstash Redis 遠端保存聊天記錄。Upstash Redis 是無伺服器 Redis 服務，適合需要可擴充且有效率的聊天儲存應用程式。此聊天儲存區同時支援同步與非同步操作。

### 安裝

終端機視窗

```
pip install llama-index-storage-chat-store-upstash
```

### 使用方式

```
from llama_index.storage.chat_store.upstash import UpstashChatStore
from llama_index.core.memory import ChatMemoryBuffer


chat_store = UpstashChatStore(
    redis_url="YOUR_UPSTASH_REDIS_URL",
    redis_token="YOUR_UPSTASH_REDIS_TOKEN",
    ttl=300,  # Optional: Time to live in seconds
)


chat_memory = ChatMemoryBuffer.from_defaults(
    token_limit=3000,
    chat_store=chat_store,
    chat_store_key="user1",
)
```

UpstashChatStore 同時支援同步與非同步操作。以下是使用非同步方法的範例：

```
import asyncio
from llama_index.core.llms import ChatMessage




async def main():
    # Add messages
    messages = [
        ChatMessage(content="Hello", role="user"),
        ChatMessage(content="Hi there!", role="assistant"),
    ]
    await chat_store.async_set_messages("conversation1", messages)


    # Retrieve messages
    retrieved_messages = await chat_store.async_get_messages("conversation1")
    print(retrieved_messages)


    # Delete last message
    deleted_message = await chat_store.async_delete_last_message(
        "conversation1"
    )
    print(f"Deleted message: {deleted_message}")




asyncio.run(main())
```

## RedisChatStore

使用 `RedisChatStore` 可將聊天記錄遠端保存，無須手動持久化或載入聊天記錄。

```
from llama_index.storage.chat_store.redis import RedisChatStore
from llama_index.core.memory import ChatMemoryBuffer


chat_store = RedisChatStore(redis_url="redis://localhost:6379", ttl=300)


chat_memory = ChatMemoryBuffer.from_defaults(
    token_limit=3000,
    chat_store=chat_store,
    chat_store_key="user1",
)
```

## AzureChatStore

使用 `AzureChatStore` 可將聊天記錄遠端保存至 Azure Table Storage 或 CosmosDB，無須手動持久化或載入聊天記錄。

```
pip install llama-index
pip install llama-index-llms-azure-openai
pip install llama-index-storage-chat-store-azure
```

```
from llama_index.core.chat_engine import SimpleChatEngine
from llama_index.core.memory import ChatMemoryBuffer
from llama_index.storage.chat_store.azure import AzureChatStore


chat_store = AzureChatStore.from_account_and_key(
    account_name="",
    account_key="",
    chat_table_name="ChatUser",
)


memory = ChatMemoryBuffer.from_defaults(
    token_limit=3000,
    chat_store=chat_store,
    chat_store_key="conversation1",
)


chat_engine = SimpleChatEngine(
    memory=memory, llm=Settings.llm, prefix_messages=[]
)


response = chat_engine.chat("Hello.")
```

## DynamoDBChatStore

使用 `DynamoDBChatStore` 可將聊天記錄保存至 AWS DynamoDB。

### 安裝

終端機視窗

```
pip install llama-index-storage-chat-store-dynamodb
```

### 使用方式

請確認已建立符合需求結構的 DynamoDB 資料表。以下為預設範例：

```
import boto3


# Get the service resource.
dynamodb = boto3.resource("dynamodb")


# Create the DynamoDB table.
table = dynamodb.create_table(
    TableName="EXAMPLE_TABLE",
    KeySchema=[{"AttributeName": "SessionId", "KeyType": "HASH"}],
    AttributeDefinitions=[
        {"AttributeName": "SessionId", "AttributeType": "S"}
    ],
    BillingMode="PAY_PER_REQUEST",
)
```

接著可使用 `DynamoDBChatStore` 類別保存及擷取聊天記錄：

```
import os
from llama_index.core.llms import ChatMessage, MessageRole
from llama_index.storage.chat_store.dynamodb.base import DynamoDBChatStore


# Initialize DynamoDB chat store
chat_store = DynamoDBChatStore(
    table_name="EXAMPLE_TABLE", profile_name=os.getenv("AWS_PROFILE")
)


# A chat history, which doesn't exist yet, returns an empty array.
print(chat_store.get_messages("123"))
# >>> []


# Initializing a chat history with a key of "SessionID = 123"
messages = [
    ChatMessage(role=MessageRole.USER, content="Who are you?"),
    ChatMessage(
        role=MessageRole.ASSISTANT, content="I am your helpful AI assistant."
    ),
]
chat_store.set_messages(key="123", messages=messages)
print(chat_store.get_messages("123"))
# >>> [ChatMessage(role=<MessageRole.USER: 'user'>, content='Who are you?', additional_kwargs={}),
#      ChatMessage(role=<MessageRole.ASSISTANT: 'assistant'>, content='I am your helpful AI assistant.', additional_kwargs={})]]


# Appending a message to an existing chat history
message = ChatMessage(role=MessageRole.USER, content="What can you do?")
chat_store.add_message(key="123", message=message)
print(chat_store.get_messages("123"))
# >>> [ChatMessage(role=<MessageRole.USER: 'user'>, content='Who are you?', additional_kwargs={}),
#      ChatMessage(role=<MessageRole.ASSISTANT: 'assistant'>, content='I am your helpful AI assistant.', additional_kwargs={})],
#      ChatMessage(role=<MessageRole.USER: 'user'>, content='What can you do?', additional_kwargs={})]
```

## PostgresChatStore

使用 `PostgresChatStore` 可將聊天記錄遠端保存，無須手動持久化或載入聊天記錄。

```
from llama_index.storage.chat_store.postgres import PostgresChatStore
from llama_index.core.memory import ChatMemoryBuffer


chat_store = PostgresChatStore.from_uri(
    uri="postgresql+asyncpg://postgres:password@127.0.0.1:5432/database",
)


chat_memory = ChatMemoryBuffer.from_defaults(
    token_limit=3000,
    chat_store=chat_store,
    chat_store_key="user1",
)
```

## TablestoreChatStore

使用 `TablestoreChatStore` 可將聊天記錄遠端保存，無須手動持久化或載入聊天記錄。

#### 安裝

終端機視窗

```
pip install llama-index-storage-chat-store-tablestore
```

#### 使用方式

```
from llama_index.storage.chat_store.tablestore import TablestoreChatStore
from llama_index.core.memory import ChatMemoryBuffer


# 1. create tablestore vector store
chat_store = TablestoreChatStore(
    endpoint="<end_point>",
    instance_name="<instance_name>",
    access_key_id="<access_key_id>",
    access_key_secret="<access_key_secret>",
)
# You need to create a table for the first use
chat_store.create_table_if_not_exist()


chat_memory = ChatMemoryBuffer.from_defaults(
    token_limit=3000,
    chat_store=chat_store,
    chat_store_key="user1",
)
```

## Google AlloyDB ChatStore

使用 `AlloyDBChatStore` 可將聊天記錄保存至 AlloyDB，無須手動持久化或載入聊天記錄。

本教學示範同步介面；所有同步方法都有對應的非同步方法。

#### 安裝

終端機視窗

```
pip install llama-index
pip install llama-index-alloydb-pg
pip install llama-index-llms-vertex
```

#### 使用方式

```
from llama_index.core.chat_engine import SimpleChatEngine
from llama_index.core.memory import ChatMemoryBuffer
from llama_index_alloydb_pg import AlloyDBChatStore, AlloyDBEngine
from llama_index.llms.vertex import Vertex
import asyncio


# Replace with your own AlloyDB info
engine = AlloyDBEngine.from_instance(
    project_id=PROJECT_ID,
    region=REGION,
    cluster=CLUSTER,
    instance=INSTANCE,
    database=DATABASE,
    user=USER,
    password=PASSWORD,
)


engine.init_chat_store_table(table_name=TABLE_NAME)


chat_store = AlloyDBChatStore.create_sync(
    engine=engine,
    table_name=TABLE_NAME,
)


memory = ChatMemoryBuffer.from_defaults(
    token_limit=3000,
    chat_store=chat_store,
    chat_store_key="user1",
)


llm = Vertex(model="gemini-1.5-flash-002", project=PROJECT_ID)


chat_engine = SimpleChatEngine(memory=memory, llm=llm, prefix_messages=[])


response = chat_engine.chat("Hello.")


print(response)
```

## Google Cloud SQL for PostgreSQL ChatStore

使用 `PostgresChatStore` 可將聊天記錄保存至 Cloud SQL for PostgreSQL，無須手動持久化或載入聊天記錄。

本教學示範同步介面；所有同步方法都有對應的非同步方法。

#### 安裝

終端機視窗

```
pip install llama-index
pip install llama-index-cloud-sql-pg
pip install llama-index-llms-vertex
```

#### 使用方式

```
from llama_index.core.chat_engine import SimpleChatEngine
from llama_index.core.memory import ChatMemoryBuffer
from llama_index_cloud_sql_pg import PostgresChatStore, PostgresEngine
from llama_index.llms.vertex import Vertex
import asyncio


# Replace with your own Cloud SQL info
engine = PostgresEngine.from_instance(
    project_id=PROJECT_ID,
    region=REGION,
    instance=INSTANCE,
    database=DATABASE,
    user=USER,
    password=PASSWORD,
)


engine.init_chat_store_table(table_name=TABLE_NAME)


chat_store = PostgresChatStore.create_sync(
    engine=engine,
    table_name=TABLE_NAME,
)


memory = ChatMemoryBuffer.from_defaults(
    token_limit=3000,
    chat_store=chat_store,
    chat_store_key="user1",
)


llm = Vertex(model="gemini-1.5-flash-002", project=PROJECT_ID)


chat_engine = SimpleChatEngine(memory=memory, llm=llm, prefix_messages=[])


response = chat_engine.chat("Hello.")


print(response)
```

## YugabyteDBChatStore

使用 `YugabyteDBChatStore` 可將聊天記錄遠端保存，無須手動持久化或載入聊天記錄。

### 先決條件

使用此整合前，請先準備可正常運作的 YugabyteDB 執行個體。你可以依照 [YugaByteDB 快速入門指南](https://docs.yugabyte.com/preview/quick-start/macos/)設定本機執行個體。

### 安裝

終端機視窗

```
pip install llama-index-storage-chat-store-yugabytedb
```

### 使用方式

```
from llama_index.storage.chat_store.yugabytedb import YugabyteDBChatStore
from llama_index.core.memory import ChatMemoryBuffer


chat_store = YugabyteDBChatStore.from_uri(
    uri="yugabytedb+psycopg2://yugabyte:password@127.0.0.1:5433/yugabyte?load_balance=true",
)


chat_memory = ChatMemoryBuffer.from_defaults(
    token_limit=3000,
    chat_store=chat_store,
    chat_store_key="user1",
)
```

#### 連線字串參數

`YugabyteDBChatStore.from_uri()` 接受多種參數，可用來設定與 YugabyteDB 叢集的連線。完整的支援參數清單請參閱 [YugabyteDB psycopg2 驅動程式文件](https://docs.yugabyte.com/preview/drivers-orms/python/yugabyte-psycopg2/#step-2-set-up-the-database-connection)。

YugabyteDB 專用參數包括：

- `load_balance`：啟用或停用負載平衡（預設值：false）
- `topology_keys`：指定連線路由的偏好節點
- `yb_servers_refresh_interval`：重新整理可用伺服器清單的間隔（秒）
- `fallback_to_topology_keys_only`：是否只連線至 topology\_keys 指定的節點
- `failed_host_ttl_seconds`：再次嘗試連線至失敗節點前等待的秒數
