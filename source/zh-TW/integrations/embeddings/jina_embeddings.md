---
title: "Jina 8K 內容 視窗 向量嵌入"
---

這裡向您展示如何使用支援 8k context length 且與 `text-embedding-ada-002` 相當的 `jina-embeddings-v2`。

[![Open In Colab](/assets/e79852128a5f.svg)](https://colab.research.google.com/github/run-llama/llama_index/blob/main/docs/examples/embeddings/jina_embeddings.ipynb)

```
%pip install llama-index-embeddings-huggingface
%pip install llama-index-embeddings-huggingface-api
%pip install llama-index-embeddings-openai
```

```
import nest_asyncio


nest_asyncio.apply()
```

## 設定 Embedding Model

```
from llama_index.embeddings.huggingface import (
    HuggingFaceEmbedding,
)
from llama_index.embeddings.huggingface_api import (
    HuggingFaceInferenceAPIEmbedding,
)
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core import Settings
```

```
# base model
# model_name = "jinaai/jina-embeddings-v2-base-en"
# small model
model_name = "jinaai/jina-embeddings-v2-small-en"
```

```
# download model locally
# note: you need enough RAM+compute to run this
embed_model = HuggingFaceEmbedding(
    model_name=model_name, trust_remote_code=True
)




# use inference API on Hugging Face (though you might run into rate limit issues)
# embed_model = HuggingFaceInferenceAPIEmbedding(
#     model_name="jinaai/jina-embeddings-v2-base-en",
# )
```

```
# we set chunk size to 1024 for now, you can obviuosly set it to much bigger
Settings.embed_model = embed_model
Settings.chunk_size = 1024
```

### 設定 OpenAI 存在 embeddings 作為比較

```
embed_model_base = OpenAIEmbedding()
```

## 設定 Index 進行測試

我們將使用標準的 Paul Graham 範例。

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
```

```
reader = SimpleDirectoryReader("../data/paul_graham")
docs = reader.load_data()
```

```
index_jina = VectorStoreIndex.from_documents(docs, embed_model=embed_model)
```

```
index_base = VectorStoreIndex.from_documents(
    docs, embed_model=embed_model_base
)
```

## 查看結果

比較 Jina-8k 與 Replicate 的檢索結果

```
from llama_index.core.response.notebook_utils import display_source_node


retriever_jina = index_jina.as_retriever(similarity_top_k=1)
retriever_base = index_base.as_retriever(similarity_top_k=1)
```

```
retrieved_nodes = retriever_jina.retrieve(
    "What did the author do in art school?"
)
```

```
for n in retrieved_nodes:
    display_source_node(n, source_length=2000)
```

**Node ID:** 921cc179-312f-4ee2-a760-3cccd27470d9\
**Similarity:** 0.7612087686435924\
**Text:** That’s not always why artists have a signature style, but it’s usually why buyers pay a lot for such work. \[6]

也有很多認真的學生：高中時「會畫畫」的孩子們，現在來到這個被認為是全國最好的藝術學校，學習如何畫得更好。他們對 RISD 發現的東西感到困惑和沮喪，但他們繼續前進，因為繪畫就是他們所做的事。我不是高中時會畫畫的孩子之一，但在 RISD，我絕對比尋求標誌性風格的族群更接近他們的族群。

我在 RISD 的色彩課學到了很多，但除此之外，我基本上是在自學繪畫，而且我可以免費做到。所以我在 1993 年退學了。我在普羅維登斯待了一段時間，然後我的大學朋友 Nancy Parmet 幫了我一個大忙。一棟她母親擁有的紐約一棟租賃控制的公寓空了。我想要它嗎？它不比我現在的住處多太多，而且紐約本應是藝術家們的所在地。所以是的，我想要它！\[7]

Asterix 漫畫開始時，會縮小到羅馬高盧的一個小角落，結果發現那並非羅馬控制的。您可以在紐約市的地圖上做類似的事情：如果您放大上東區，會發現一個不富裕，或者至少在 1993 年並非如此的小角落。它被稱為 Yorkville，那是我的新家。現在我是一名紐約藝術家——從嚴格技術的意義上說，是繪畫並住在紐約。

我對金錢感到緊張，因為我能感覺到 Interleaf 即將衰落。自由的 Lisp 駭客工作非常罕見，我不想再用另一種語言編程，在那個年代，如果我運氣好，那意味著 C++。所以憑藉我對財務機會的敏銳嗅覺，我決定再寫一本書關於 Lisp。這會是一本暢銷書，那種可以作為教科書使用的書。我想像自己從版權收入中節儉生活，花費所有的……

```
retrieved_nodes = retriever_base.retrieve("What did the author do in school?")
```

```
for n in retrieved_nodes:
    display_source_node(n, source_length=2000)
```

**Node ID:** 0abf44f2-94bd-421f-9ebd-5b50f4de37f0\
**Similarity:** 0.8352482505756655\
**Text:** What I Worked On

2021 年 2 月

在大學之前，除了學校之外，我主要做兩件事：寫作和編程。我沒有寫論文。我寫的是當時的初級作家應該寫的東西，而且可能仍然是：短篇小說。我的故事很糟糕。它們幾乎沒有情節，只有充滿強烈情感的角色，我想像這讓它們變得深刻。

我嘗試編寫的第一批程式是在我們的學區用來進行所謂「資料處理」的 IBM 1401 上。這是在九年級，所以當時我 13 或 14 歲。學區的 1401 恰好在我們初中學校的地下室，我的朋友 Rich Draves 和我獲得了使用它的許可。那就像一個迷你邦德反派的藏身處，裡面有所有這些看起來像外星的機器——CPU、磁碟機、印表機、讀卡機——都立在抬高的地板上，在明亮的螢光燈下。

我們使用的語言是 Fortran 的早期版本。您必須在 punch cards 上輸入程式，然後將它們堆疊在讀卡機中，按下按鈕將程式載入記憶體並執行它。結果通常是讓在非常響亮的印表機上列印出某樣東西。我對 1401 感到困惑。我不知道該如何處理它。回想起來，我對它也沒能做太多事。程式的唯一輸入形式是儲存在打孔卡上的資料，而我沒有任何儲存在打孔卡上的資料。唯一的其他選擇是做不依賴任何輸入的事情，例如計算 $\pi$ 的近似值，但我沒有足夠的數學知識來做那種有意思的事情。所以我不奇怪我記不起任何我寫過的程式，因為它們做不到太多事情。我最清晰的記憶是關於我學到程式可以不終止的那個時刻，我的其中一個程式沒有終止。在沒有時間共享的機器上，這既是一種社會性的錯誤，也是一種技術性的錯誤，資料中心經理的表情說明了這一點。

隨著微電腦的出現，一切都改變了。現在你可以...