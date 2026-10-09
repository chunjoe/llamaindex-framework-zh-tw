---
title: "載入 documents"
---

documents = SimpleDirectoryReader("./data/paul\_graham/").load\_data() print("Document ID:", len(documents), documents[0].doc\_id)

````
    Document ID: 1 8d84aefd-ca73-4c1e-b83d-141c1b1b3ba6






```python
from llama_index import ServiceContext
from llama_index.embeddings import HuggingFaceEmbedding
from llama_index.vector_stores import VearchVectorStore


"""
vearch cluster
"""
vector_store = VearchVectorStore(
    path_or_url="http://liama-index-router.vectorbase.svc.sq01.n.jd.local",
    table_name="liama_index_test2",
    db_name="liama_index",
    flag=1,
)


"""
vearch standalone
"""
# vector_store = VearchVectorStore(
#         path_or_url = '/data/zhx/zhx/liama_index/knowledge_base/liama_index_teststandalone',
#         # path_or_url = 'http://liama-index-router.vectorbase.svc.sq01.n.jd.local',
#         table_name = 'liama_index_teststandalone',
#         db_name = 'liama_index',
#         flag = 0)


embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")
service_context = ServiceContext.from_defaults(embed_model=embed_model)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context, service_context=service_context
)
````

```
Loading checkpoint shards:   0%|          | 0/7 [00:00<?, ?it/s]
```

```
query_engine = index.as_query_engine()
response = query_engine.query("What did the author do growing up?")
display(Markdown(f"<b>{response}</b>"))
```

**作者未提供任何關於其成長的資訊。**

```
query_engine = index.as_query_engine()
response = query_engine.query(
    "What did the author do after his time at Y Combinator?"
)
display(Markdown(f"<b>{response}</b>"))
```

**作者在繼續為 Y Combinator 工作期間，使用 Arc 撰寫了 Y Combinator 的所有內部軟體，但後來停止使用 Arc，轉而專注於撰寫文章和為 Y Combinator 工作。2012 年，作者的母親中風，作者意識到 Y Combinator 佔用了他們太多時間，並決定將其交給其他人。作者向 Robert Morris 提出此建議，Robert Morris 給予了作者無要求的建議，以確保 Y Combinator 不是作者所做的最後一件酷事。作者最終決定在 2013 年將 Y Combinator 的領導權交給 Sam Altman。**