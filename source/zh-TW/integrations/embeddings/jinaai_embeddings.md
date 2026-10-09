---
title: "Jina 嵌入模型"
---

如果您在 colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-embeddings-jinaai
%pip install llama-index-llms-openai
```

```
!pip install llama-index
```

您可能還需要 llama-index 沒有直接提供的其他套件。

```
!pip install Pillow
```

對於此範例，您需要一個 API 金鑰，該金鑰可以從 <https://jina.ai/embeddings/> 取得。

```
# Initilise with your api key
import os


jinaai_api_key = "YOUR_JINAAI_API_KEY"
os.environ["JINAAI_API_KEY"] = jinaai_api_key
```

## 透過 JinaAI 嵌入模型對文本和查詢進行嵌入 API

您可以使用 JinaEmbedding class 來對您的文本和查詢進行編碼。Jina 提供一系列可適應不同用例的模型。

| 模型 | 維度 | 語言 | MRL（套娃式表示學習） | 上下文 |
| :------------------------: | :-------: | :-------------------------: | :--------------: | :-----: |
|     jina-embeddings-v3     |    1024   | Multilingual (89 languages) |        Yes       |   8192  |
| jina-embeddings-v2-base-en |    768    |           English           |        No        |   8192  |
| jina-embeddings-v2-base-de |    768    |       German & English      |        No        |   8192  |
| jina-embeddings-v2-base-es |    768    |      Spanish & English      |        No        |   8192  |
| jina-embeddings-v2-base-zh |    768    |      Chinese & English      |        No        |   8192  |

**推薦模型：jina-embeddings-v3 :**

我們推薦 `jina-embeddings-v3` 作為來自 Jina AI 的最新且表現最佳的嵌入模型。此模型具有 5 個針對特定任務訓練的 adapter，基於其 backbone 進行訓練，以優化各種嵌入用例。

預設情況下，`JinaEmbedding` class 使用 `jina-embeddings-v3`。在 backbone 上，`jina-embeddings-v3` 已經使用 5 個針對不同嵌入用例的特定任務 adapter 進行訓練。

**特定任務 adapter：**

在您的請求中包含 `task` 以優化下游應用程式：

- **retrieval.query**: 用於對檢索任務中的使用者查詢或問題進行編碼。
- **retrieval.passage**: 用於在索引時對大型 documents 進行編碼。
- **classification**: 用於對文本進行文本分類任務的編碼。
- **text-matching**: 用於對文本進行相似度匹配的編碼，例如衡量兩個句子之間的相似度。
- **separation**: 用於聚類或重新排序任務。

**Matryoshka Representation Learning：**

`jina-embeddings-v3` 支援 Matryoshka Representation Learning，允許使用者在最小的性能損失下控制嵌入維度。在您的請求中包含 `dimensions` 以選擇所需的維度。預設情況下，**dimensions** 設定為 1024，建議的數值在 256 到 1024 之間。您可以參考下表以了解維度與性能的關係：

|                 維度                   |   32  |   64  |  128  |  256  |  512  |  768 |  1024 |
| :--------------------------------------: | :---: | :---: | :---: | :---: | :---: | :--: | :---: |
| 平均檢索效能（nDCG\@10） | 52.54 | 58.54 | 61.64 | 62.72 | 63.16 | 63.3 | 63.35 |

**長上下文嵌入模型的延遲分塊 (Late Chunking)**

`jina-embeddings-v3` 支援 [Late Chunking](https://jina.ai/news/late-chunking-in-long-context-embedding-models/)，這是一種利用模型的長上下文能力來生成上下文分塊嵌入的技術。在您的請求中包含 `late_chunking=True` 以啟用上下文分塊表示。當設定為 true 時，Jina AI API 會將輸入欄位中的所有句子連接成一個字串並將其作為單一字串傳送給模型。在內部，模型會對這個長連接字串進行嵌入，然後執行 late chunking，返回一個與輸入列表大小相符的嵌入列表。

```
from llama_index.embeddings.jinaai import JinaEmbedding


text_embed_model = JinaEmbedding(
    api_key=jinaai_api_key,
    model="jina-embeddings-v3",
    # choose `retrieval.passage` to get passage embeddings
    task="retrieval.passage",
)


embeddings = text_embed_model.get_text_embedding("This is the text to embed")
print("Text dim:", len(embeddings))
print("Text embed:", embeddings[:5])


query_embed_model = JinaEmbedding(
    api_key=jinaai_api_key,
    model="jina-embeddings-v3",
    # choose `retrieval.query` to get query embeddings, or choose your desired task type
    task="retrieval.query",
    # `dimensions` allows users to control the embedding dimension with minimal performance loss. by default it is 1024.
    # A number between 256 and 1024 is recommended.
    dimensions=512,
)


embeddings = query_embed_model.get_query_embedding(
    "This is the query to embed"
)
print("Query dim:", len(embeddings))
print("Query embed:", embeddings[:5])
```

## 透過 JinaCLIP 嵌入圖像和查詢 API

您也可以使用 JinaEmbedding class 來對您的圖像和查詢進行編碼。

```
from llama_index.embeddings.jinaai import JinaEmbedding
from PIL import Image
import requests
from numpy import dot
from numpy.linalg import norm


embed_model = JinaEmbedding(
    api_key=jinaai_api_key,
    model="jina-clip-v1",
)


image_url = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStMP8S3VbNCqOQd7QQQcbvC_FLa1HlftCiJw&s"
im = Image.open(requests.get(image_url, stream=True).raw)
print("Image:")
display(im)


image_embeddings = embed_model.get_image_embedding(image_url)
print("Image dim:", len(image_embeddings))
print("Image embed:", image_embeddings[:5])


text_embeddings = embed_model.get_text_embedding(
    "Logo of a pink blue llama on dark background"
)
print("Text dim:", len(text_embeddings))
print("Text embed:", text_embeddings[:5])


cos_sim = dot(image_embeddings, text_embeddings) / (
    norm(image_embeddings) * norm(text_embeddings)
)
print("Cosine similarity:", cos_sim)
```

## 分批嵌入

您也可以分批嵌入文本，批次大小可以透過設定 `embed_batch_size` 參數來控制（如果未傳遞，預設值為 10，且不應大於 2048）。

```
embed_model = JinaEmbedding(
    api_key=jinaai_api_key,
    model="jina-embeddings-v3",
    embed_batch_size=16,
    task="retrieval.passage",
)


embeddings = embed_model.get_text_embedding_batch(
    ["This is the text to embed", "More text can be provided in a batch"]
)


print(len(embeddings))
print(embeddings[0][:5])
```

## 讓我們使用 Jina AI Embeddings 建構一個 RAG pipeline

#### 下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

#### 匯入

```
import logging
import sys


logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))


from llama_index.core import VectorStoreIndex, SimpleDirectoryReader


from llama_index.llms.openai import OpenAI
from llama_index.core.response.notebook_utils import display_source_node


from IPython.display import Markdown, display
```
#### 載入資料

```
documents = SimpleDirectoryReader("./data/paul_graham/").load_data()
```

#### 建置 index

```
your_openai_key = "YOUR_OPENAI_KEY"
llm = OpenAI(api_key=your_openai_key)
embed_model = JinaEmbedding(
    api_key=jinaai_api_key,
    model="jina-embeddings-v3",
    embed_batch_size=16,
    task="retrieval.passage",
)


index = VectorStoreIndex.from_documents(
    documents=documents, embed_model=embed_model
)
```

#### 建置 retriever

```
search_query_retriever = index.as_retriever()


search_query_retrieved_nodes = search_query_retriever.retrieve(
    "What happened after the thesis?"
)
```

```
for n in search_query_retrieved_nodes:
    display_source_node(n, source_length=2000)
```
