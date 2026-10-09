---
title: "Typesense 向量資料庫"
---

#### 下載資料

```
%pip install llama-index-embeddings-openai
%pip install llama-index-vector-stores-typesense
```

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

#### 加載 documents, 建構 VectorStoreIndex

```
# import logging
# import sys


# logging.basicConfig(stream=sys.stdout, level=logging.INFO)
# logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))


from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
)
from IPython.display import Markdown, display
```

```
# load documents
documents = SimpleDirectoryReader("./data/paul_graham/").load_data()
```

```
from llama_index.vector_stores.typesense import TypesenseVectorStore
from typesense import Client


typesense_client = Client(
    {
        "api_key": "xyz",
        "nodes": [{"host": "localhost", "port": "8108", "protocol": "http"}],
        "connection_timeout_seconds": 2,
    }
)
typesense_vector_store = TypesenseVectorStore(typesense_client)
storage_context = StorageContext.from_defaults(
    vector_store=typesense_vector_store
)


index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)
```

#### 查詢 Index

```
from llama_index.core import QueryBundle
from llama_index.embeddings.openai import OpenAIEmbedding


# By default, typesense vector store uses vector search. You need to provide the embedding yourself.
query_str = "What did the author do growing up?"
embed_model = OpenAIEmbedding()
# You can also get the settings from the Settings object
from llama_index.core import Settings


# embed_model = Settings.embed_model
query_embedding = embed_model.get_agg_embedding_from_queries(query_str)
query_bundle = QueryBundle(query_str, embedding=query_embedding)
response = index.as_query_engine().query(query_bundle)


display(Markdown(f"<b>{response}</b>"))
```

****

作者在跳過電腦演進的某個步驟中長大，學習義大利語，漫步佛羅倫斯，繪畫人物，與科技公司合作，在 RISD 尋求標誌性的風格，住在租金穩定的公寓裡，發布軟體，編輯程式碼（包括 Lisp 表達式），寫文章，將其發布在網路上，並收到憤怒讀者的回饋。他也經歷了 1990 年代商品處理器的指數級增長，這導致了高端、專用硬體和軟體公司的整合。他也學會了如何用幾個簡單動詞串聯抽象概念，讓一點點義大利語發揮很大作用。他也經歷了藝術界金錢與酷的緊密耦合，以及任何昂貴的東西都會被視為酷，任何被視為酷的東西很快都會變得同樣昂貴的事實。他也經歷了發布軟體的挑戰，因為他必須招募一組初始用戶，並確保他們有看起來不錯的商店，然後才能公開發布。他也經歷了現在已是熟悉的體驗的首次出現，當他閱讀評論並發現它們充滿了憤怒的人時。他也經歷了將某物上傳到網路上與將其正式發布之間的區別。最後，他寫了關於他積累的主題的文章，並為其他人寫了一份更詳細的版本。

```
from llama_index.core.vector_stores.types import VectorStoreQueryMode


# You can also use text search


query_bundle = QueryBundle(query_str=query_str)
response = index.as_query_engine(
    vector_store_query_mode=VectorStoreQueryMode.TEXT_SEARCH
).query(query_bundle)
display(Markdown(f"<b>{response}</b>"))
```

****

作者在網際網路泡沫時期長大，並經營一家新創公司。為了看起來更專業，他們不得不僱用比他們想要的更多的人，並在投資者的控制之下，直到 Yahoo 收購了他們。他們學到了很多關於零售和新創公司的知識，並必須做很多他們不一定擅長的事情，才能讓他們的業務成功。