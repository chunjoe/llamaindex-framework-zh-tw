---
title: "VoyageAI 嵌入模型"
---

VoyageAI 新一代嵌入模型原生支援 float、int8、binary 與 ubinary 格式。更多資訊請參閱 [`output_dtype` 說明](https://docs.voyageai.com/docs/embeddings)。

本 Notebook 將示範使用 `VoyageAI Embeddings`，並搭配不同的 `models`、`input_types` 與 `embedding_types`。

如果你在 Colab 開啟這份 Notebook，可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-llms-openai
%pip install llama-index-embeddings-voyageai
```

```
!pip install llama-index
```

#### 使用最新的 `voyage-3` 嵌入模型

預設的 `embedding_type` 為 `float`。

```
from llama_index.embeddings.voyageai import VoyageEmbedding


# with input_typ='search_query'
embed_model = VoyageEmbedding(
    voyage_api_key="<YOUR_VOYAGE_API_KEY>",
    model_name="voyage-3",
)


embeddings = embed_model.get_text_embedding("Hello VoyageAI!")


print(len(embeddings))
print(embeddings[:5])
```

```
1024
[-0.010165567509829998, -0.0588739775121212, 0.007418953347951174, 0.004723705351352692, 0.0029206324834376574]
```

##### 檢查 `int8` embedding\_type 搭配 `voyage-3-large` 模型的情況

```
embed_model = VoyageEmbedding(
    voyage_api_key="<YOUR_VOYAGE_API_KEY>",
    model_name="voyage-3-large",
    output_dtype="int8",
    truncation=False,
)


embeddings = embed_model.get_text_embedding("Hello VoyageAI!")


print(len(embeddings))
print(embeddings[:5])
```

```
1024
[-37, 41, 5, -1, 10]
```

#### 深入檢視 `voyage-3-large` 嵌入向量

接下來會使用 `int8` embedding\_type 進行測試。

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

#### 下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

```
--2024-12-21 19:28:14--  https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt
Resolving raw.githubusercontent.com (raw.githubusercontent.com)... 2606:50c0:8003::154, 2606:50c0:8000::154, 2606:50c0:8001::154, ...
connected. to raw.githubusercontent.com (raw.githubusercontent.com)|2606:50c0:8003::154|:443...
200 OKequest sent, awaiting response...
Length: 75042 (73K) [text/plain]
Saving to: ‘data/paul_graham/paul_graham_essay.txt’


data/paul_graham/pa 100%[===================>]  73.28K  --.-KB/s    in 0.02s


2024-12-21 19:28:14 (3.55 MB/s) - ‘data/paul_graham/paul_graham_essay.txt’ saved [75042/75042]
```

#### 載入資料

```
documents = SimpleDirectoryReader("./data/paul_graham/").load_data()
```

### 使用 `int8` embedding\_type

#### 建立索引

```
llm = OpenAI(
    model="command-nightly",
    api_key="<YOUR_OPENAI_API_KEY>",
)
embed_model = VoyageEmbedding(
    voyage_api_key="<YOUR_VOYAGE_API_KEY>",
    model_name="voyage-3-large",
    embedding_type="int8",
)


index = VectorStoreIndex.from_documents(
    documents=documents, embed_model=embed_model
)
```

#### 建立檢索器

```
search_query_retriever = index.as_retriever()


search_query_retrieved_nodes = search_query_retriever.retrieve(
    "What happened in the summer of 1995?"
)
```

```
for n in search_query_retrieved_nodes:
    display_source_node(n, source_length=2000)
```

**Node ID:** 1c052573-9fef-4f1b-9882-e69db8b7d62a\
**Similarity:** 0.23402080114051563\
**Text:** Users wouldn’t need anything more than a browser.

This kind of software, known as a web app, is common now, but at the time it wasn’t clear that it was even possible. To find out, we decided to try making a version of our store builder that you could control through the browser. A couple days later, on August 12, we had one that worked. The UI was horrible, but it proved you could build a whole store through the browser, without any client software or typing anything into the command line on the server.

現在我們覺得自己真的發現了某些關鍵。我想像著新一代的軟體將以這種方式運作。你不再需要版本、移植或任何那類廢話。在 Interleaf 曾有一個名為 Release Engineering 的整個團隊，其規模似乎與實際編寫軟體的團隊一樣大。而現在，你可以直接在伺服器上更新軟體。

我們創立了一家名為 Viaweb 的新公司，因為我們的軟體是透過網頁運作的，且我們從 Idelle 的丈夫 Julian 那裡獲得了 10,000 美元的種子資金。作為回報，以及他處理初步的法律工作並提供我們商業建議，我們給了他 10% 的公司股份。Ten 年後，這筆交易成為了 Y Combinator 的模式。我們知道創辦人需要這樣的事情，因為我們自己也曾經需要。

在這個階段我的淨資產是負數，因為我在銀行裡的一千多美元，遠不足以抵銷我欠政府的稅款。(Had 我有勤奮地撥出在 Interleaf 諮詢工作中賺到錢的適當比例嗎？不，我沒有。) 因此，儘管 Robert 有他的研究生津貼，但我仍需要那筆種子資金來維持生活。

我們原先希望在 September 上線，但在開發過程中，我們對這款軟體的目標變得更具野心。Eventually 我們成功打造了一個 WYSIWYG 網站建置工具，也就是在您建立頁面時，它們看起來與隨後產生的靜態頁面完全一致，除了le…

**Node ID:** 43747196-8c04-4b9a-86dc-94f15e310988\
**Similarity:** 0.22620195227632825\
**Text:** Not fast, but fast enough to test.

I had to ban myself from writing essays during most of this time, or I’d never have finished. In late 2015 I spent 3 months writing essays, and when I went back to working on Bel I could barely understand the code. Not so much because it was badly written as because the problem is so convoluted. When you’re working on an interpreter written in itself, it’s hard to keep track of what’s happening at what level, and errors can be practically encrypted by the time you get them.

So I said no more essays till Bel was done. But I told few people about Bel while I was working on it. So for years it must have seemed that I was doing nothing, when in fact I was working harder than I’d ever worked on anything. Occasionally after wrestling for hours with some gruesome bug I’d check Twitter or HN and see someone asking “Does Paul Graham still code?”

Working on Bel was hard but satisfying. I worked on it so intensively that at any given time I had a decent chunk of the code in my head and could write more there. I remember taking the boys to the coast on a sunny day in 2015 and figuring out how to deal with some problem involving continuations while I watched them play in the tide pools. It felt like I was doing life right. I remember that because I was slightly dismayed at how novel it felt. The good news is that I had more moments like this over the next few years.

In the summer of 2016 we moved to England. We wanted our kids to see what it was like living in another country, and since I was a British citizen by birth, that seemed the obvious choice. We only meant to stay for a year, but we liked it so much that we still live there. So most of Bel was written in England.

In the fall of 2019, Bel was finally finished. Like McCarthy’s original Lisp, it’s a spec rather than an implementation, although like McCarthy’s Lisp it’s a spec expressed as code.

既然我可以再次撰寫文章，我便針對積壓已久的一系列主題寫了很多內容。…

### 文字與圖像嵌入

[VoyageAI 現已支援多模態嵌入模型](https://docs.voyageai.com/docs/multimodal-embeddings)，可將文字和圖像嵌入相同的向量空間。

```
from PIL import Image
import matplotlib.pyplot as plt


img = Image.open("./data/images/prometheus_paper_card.png")
plt.imshow(img)
```

```
<matplotlib.image.AxesImage at 0x33e730550>
```

![png](/assets/42e44eb1b6cc.png)

```
embed_model = VoyageEmbedding(
    voyage_api_key="<YOUR_VOYAGE_API_KEY>",
    model_name="voyage-multimodal-3",
    truncation=False,
)
```

##### 圖像嵌入

```
embeddings = embed_model.get_image_embedding(
    "./data/images/prometheus_paper_card.png"
)


print(len(embeddings))
print(embeddings[:5])
```

```
1024
[0.06298828125, -0.0206298828125, 0.01055908203125, 0.0072021484375, 0.0269775390625]
```

##### 文字嵌入

```
embeddings = embed_model.get_text_embedding("prometheus evaluation model")


print(len(embeddings))
print(embeddings[:5])
```

```
1024
[0.12255859375, -0.0277099609375, 0.028076171875, 0.035888671875, 0.0262451171875]
```
