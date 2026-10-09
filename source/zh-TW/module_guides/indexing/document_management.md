---
title: "文件管理"
---

LlamaIndex 多數索引結構都支援**新增**、**刪除**、**更新**與**重新整理**操作。

## 新增

初次建立索引後，您仍可將新的 Document「插入」任何索引資料結構中。LlamaIndex 會將文件拆成多個節點，再匯入索引。

底層的插入機制取決於索引結構。例如，摘要索引會將新的 Document 作為額外節點加入清單；向量儲存庫索引則會將新的 Document 及其嵌入向量寫入底層的文件／嵌入儲存庫。

範例如下：

```
from llama_index.core import SummaryIndex, Document


index = SummaryIndex([])
text_chunks = ["text_chunk_1", "text_chunk_2", "text_chunk_3"]


doc_chunks = []
for i, text in enumerate(text_chunks):
    doc = Document(text=text, id_=f"doc_id_{i}")
    doc_chunks.append(doc)


# insert
for doc_chunk in doc_chunks:
    index.insert(doc_chunk)
```

## 刪除

指定 document\_id，即可從多數索引資料結構刪除 Document。（**注意**：目前樹狀索引（tree index）不支援刪除。）與該文件對應的所有節點都會一併刪除。

```
index.delete_ref_doc("doc_id_0", delete_from_docstore=True)
```

若您在多個索引間共用同一個 docstore，`delete_from_docstore` 預設為 `False`。即使設為 `False`，查詢時也不會使用這些節點，因為它們會從索引的 `index_struct` 中移除；該結構負責追蹤哪些節點可供查詢。

## 更新

若索引中已存在某個 Document，當文件內容變更時，可以使用相同的 doc `id_` 更新該 Document。

```
# NOTE: the document has a `doc_id` specified
doc_chunks[0].text = "Brand new document text"
index.update_ref_doc(doc_chunks[0])
```

## 重新整理

載入資料時，若為每份文件設定 doc `id_`，也可以自動重新整理索引。

`refresh()` 函式只會更新 doc `id_` 相同但文字內容不同的文件。索引中尚不存在的文件也會一併新增。

`refresh()` 還會回傳布林值清單，指出輸入的哪些文件已在索引中更新。

```
# modify first document, with the same doc_id
doc_chunks[0] = Document(text="Super new document text", id_="doc_id_0")


# add a new document
doc_chunks.append(
    Document(
        text="This isn't in the index yet, but it will be soon!",
        id_="doc_id_3",
    )
)


# refresh the index
refreshed_docs = index.refresh_ref_docs(doc_chunks)


# refreshed_docs[0] and refreshed_docs[-1] should be true
```

上例中，我們另外傳入了一些 kwargs，確保文件會從 docstore 刪除；這當然是選擇性的。

若您 `print()` `refresh()` 的輸出，就能看到哪些輸入文件已重新整理：

```
print(refreshed_docs)
# > [True, False, False, True]
```

當您讀取的目錄持續有新資料加入時，這項功能特別實用。

若要自動設定文件的 doc `id_`，請在 `SimpleDirectoryReader` 中啟用 `filename_as_id` 旗標。更多資訊請參閱[自訂 Document](/python/framework/module_guides/loading/documents_and_nodes/usage_documents/)。

## 文件追蹤

若索引使用 docstore（也就是多數向量儲存庫整合以外的所有索引），您也可以查看已加入 docstore 的文件。

```
print(index.ref_doc_info)
"""
> {'doc_id_1': RefDocInfo(node_ids=['071a66a8-3c47-49ad-84fa-7010c6277479'], metadata={}),
   'doc_id_2': RefDocInfo(node_ids=['9563e84b-f934-41c3-acfd-22e88492c869'], metadata={}),
   'doc_id_0': RefDocInfo(node_ids=['b53e6c2f-16f7-4024-af4c-42890e945f36'], metadata={}),
   'doc_id_3': RefDocInfo(node_ids=['6bedb29f-15db-4c7c-9885-7490e10aa33f'], metadata={})}
"""
```

輸出中的每筆資料都以匯入文件的 `id_` 作為索引鍵，並列出該文件切分出的節點所對應的 `node_ids`。

此外，系統也會追蹤每份輸入文件原有的 `metadata` 字典。`metadata` 屬性的詳細說明請參閱[自訂 Document](/python/framework/module_guides/loading/documents_and_nodes/usage_documents/)。
