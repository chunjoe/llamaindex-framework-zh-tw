---
title: "Documents 和 Nodes"
---

##### 常見問題 (FAQ)

1. [Node 物件的預設 `chunk_size` 是什麼？](/python/framework/community/faq/documents_and_nodes/#1-what-is-the-default-chunksize-of-a-node-object)
2. [如何在 `Document` 物件中新增名稱、URL 等資訊？](/python/framework/community/faq/documents_and_nodes/#2-how-to-add-information-like-name-url-in-a-document-object)
3. [如何在 Index 中更新現有的 document？](/python/framework/community/faq/documents_and_nodes/#3-how-to-update-existing-document-in-an-index)

---

##### 1. Node 物件的預設 `chunk_size` 是什麼？

預設值是 1024。如果您想自訂 `chunk_size`，可以參考 [Customizing Node](/python/framework/module_guides/loading/node_parsers/)。

---

##### 2. 如何在 `Document` 物件中新增名稱、URL 等資訊？

您可以自訂 Document 物件並以 metadata 的形式新增額外資訊。欲了解更多資訊，請參閱 [Customize Document](/python/framework/module_guides/loading/documents_and_nodes/usage_documents/#customizing-documents)。

---

##### 3. 如何在 Index 中更新現有的 document？

您可以借助 `doc_id` 來更新/刪除 Index 中的現有 document。您也可以新增新的 document 到現有的 Index 中。欲了解更多資訊，請查閱 [Document Management](/python/framework/module_guides/indexing/document_management/)。