---
title: "Aleph Alpha Embeddings"
---

如果您在 colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-embeddings-alephalpha
```

```
!pip install llama-index
```

```
# Initialise with your AA token
import os


os.environ["AA_TOKEN"] = "your_token_here"
```

#### 使用 `luminous-base` embeddings。

- representation="Document"：用於您想儲存在 vector database 中的文字 (documents)
- representation="Query"：用於搜尋查詢，以在您的 vector database 中找到最相關的 documents
- representation="Symmetric"：用於聚類、分類、異常偵測或視覺化任務。

```
from llama_index.embeddings.alephalpha import AlephAlphaEmbedding


# To customize your token, do this
# otherwise it will lookup AA_TOKEN from your env variable
# embed_model = AlephAlpha(token="<aa_token>")


# with representation='query'
embed_model = AlephAlphaEmbedding(
    model="luminous-base",
    representation="Query",
)


embeddings = embed_model.get_text_embedding("Hello Aleph Alpha!")


print(len(embeddings))
print(embeddings[:5])
```

```
representation_enum: SemanticRepresentation.Query




5120
[0.14257812, 2.59375, 0.33203125, -0.33789062, -0.94140625]
```

```
# with representation='Document'
embed_model = AlephAlphaEmbedding(
    model="luminous-base",
    representation="Document",
)


embeddings = embed_model.get_text_embedding("Hello Aleph Alpha!")


print(len(embeddings))
print(embeddings[:5])
```

```
representation_enum: SemanticRepresentation.Document




5120
[0.14257812, 2.59375, 0.33203125, -0.33789062, -0.94140625]
```
