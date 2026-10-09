---
title: "簡單的 Vector Store"
---


如果您在 Colab 開啟這份 Notebook，可能需要先安裝 LlamaIndex 🦙。

```
!pip install llama-index
```

```
import os
import openai


os.environ["OPENAI_API_KEY"] = "sk-..."
openai.api_key = os.environ["OPENAI_API_KEY"]
```

#### 載入文件並建立 VectorStoreIndex

```
import nltk


nltk.download("stopwords")
```

```
[nltk_data] Downloading package stopwords to
[nltk_data]     /Users/jerryliu/nltk_data...
[nltk_data]   Package stopwords is already up-to-date!










True
```

```
import llama_index.core
```

```
[nltk_data] Downloading package stopwords to /Users/jerryliu/Programmi
[nltk_data]     ng/gpt_index/.venv/lib/python3.10/site-
[nltk_data]     packages/llama_index/core/_static/nltk_cache...
[nltk_data]   Unzipping corpora/stopwords.zip.
[nltk_data] Downloading package punkt to /Users/jerryliu/Programming/g
[nltk_data]     pt_index/.venv/lib/python3.10/site-
[nltk_data]     packages/llama_index/core/_static/nltk_cache...
[nltk_data]   Unzipping tokenizers/punkt.zip.
```

```
import logging
import sys


logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))


from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    load_index_from_storage,
    StorageContext,
)
from IPython.display import Markdown, display
```

下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

```
--2024-02-12 13:21:13--  https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt
Resolving raw.githubusercontent.com (raw.githubusercontent.com)... 185.199.110.133, 185.199.111.133, 185.199.108.133, ...
Connecting to raw.githubusercontent.com (raw.githubusercontent.com)|185.199.110.133|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 75042 (73K) [text/plain]
Saving to: ‘data/paul_graham/paul_graham_essay.txt’


data/paul_graham/pa 100%[===================>]  73.28K  --.-KB/s    in 0.02s


2024-02-12 13:21:13 (4.76 MB/s) - ‘data/paul_graham/paul_graham_essay.txt’ saved [75042/75042]
```

```
# load documents
documents = SimpleDirectoryReader("./data/paul_graham/").load_data()
```

```
index = VectorStoreIndex.from_documents(documents)
```

```
INFO:httpx:HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
```

```
# save index to disk
index.set_index_id("vector_index")
index.storage_context.persist("./storage")
```

```
# rebuild storage context
storage_context = StorageContext.from_defaults(persist_dir="storage")
# load index
index = load_index_from_storage(storage_context, index_id="vector_index")
```

```
INFO:llama_index.core.indices.loading:Loading indices with ids: ['vector_index']
Loading indices with ids: ['vector_index']
```

#### 查詢索引

```
# set Logging to DEBUG for more detailed outputs
query_engine = index.as_query_engine(response_mode="tree_summarize")
response = query_engine.query("What did the author do growing up?")
```

```
INFO:httpx:HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
INFO:httpx:HTTP Request: POST https://api.openai.com/v1/chat/completions "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/chat/completions "HTTP/1.1 200 OK"
```

```
display(Markdown(f"<b>{response}</b>"))
```

**作者撰寫短篇小說，同時也從事程式設計，特別是在九年級時使用 IBM 1401 電腦。他們後來轉向使用微電腦，從組裝套件的微電腦開始，最終購入了一台 TRS-80。他們撰寫了簡單的遊戲、一個預測火箭高度的程式，甚至還開發了一個文字處理器。Although作者最初計劃在大學學習哲學，但最終轉而學習 AI。**

**使用 SVM／線性迴歸查詢索引**

採用 Karpathy 提出的 [SVM](https://twitter.com/karpathy/status/1647025230546886658?s=20) 方法：將查詢設為正例，其他所有資料點設為負例，再據此擬合超平面。

```
query_modes = [
    "svm",
    "linear_regression",
    "logistic_regression",
]
for query_mode in query_modes:
    # set Logging to DEBUG for more detailed outputs
    query_engine = index.as_query_engine(vector_store_query_mode=query_mode)
    response = query_engine.query("What did the author do growing up?")
    print(f"Query mode: {query_mode}")
    display(Markdown(f"<b>{response}</b>"))
```

```
INFO:httpx:HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"




/Users/jerryliu/Programming/gpt_index/.venv/lib/python3.10/site-packages/sklearn/svm/_classes.py:31: FutureWarning: The default value of `dual` will change from `True` to `'auto'` in 1.5. Set the value of `dual` explicitly to suppress the warning.
  warnings.warn(




INFO:httpx:HTTP Request: POST https://api.openai.com/v1/chat/completions "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/chat/completions "HTTP/1.1 200 OK"
Query mode: svm
```

**作者撰寫短篇小說，同時也從事程式設計，特別是在九年級時使用 IBM 1401 電腦。他們後來擁有了微電腦並開始在上面進行程式設計，撰寫簡單的遊戲和文字處理器。他們最初計劃在大學學習哲學，但最終轉而學習 AI。**

```
INFO:httpx:HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"




/Users/jerryliu/Programming/gpt_index/.venv/lib/python3.10/site-packages/sklearn/svm/_classes.py:31: FutureWarning: The default value of `dual` will change from `True` to `'auto'` in 1.5. Set the value of `dual` explicitly to suppress the warning.
  warnings.warn(




INFO:httpx:HTTP Request: POST https://api.openai.com/v1/chat/completions "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/chat/completions "HTTP/1.1 200 OK"
Query mode: linear_regression
```

**作者撰寫短篇小說，同時也從事程式設計，特別是在九年級時使用 IBM 1401 電腦。他們後來擁有了微電腦並開始在上面進行程式設計，撰寫簡單的遊戲和文字處理器。他們最初計劃在大學學習哲學，但最終轉而學習 AI。**

```
INFO:httpx:HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"




/Users/jerryliu/Programming/gpt_index/.venv/lib/python3.10/site-packages/sklearn/svm/_classes.py:31: FutureWarning: The default value of `dual` will change from `True` to `'auto'` in 1.5. Set the value of `dual` explicitly to suppress the warning.
  warnings.warn(




INFO:httpx:HTTP Request: POST https://api.openai.com/v1/chat/completions "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/chat/completions "HTTP/1.1 200 OK"
Query mode: logistic_regression
```

**作者撰寫短篇小說，同時也從事程式設計，特別是在九年級時使用 IBM 1401 電腦。他們後來擁有了微電腦並開始在上面進行程式設計，撰寫簡單的遊戲和文字處理器。他們最初計劃在大學學習哲學，但最終轉而學習 AI。**

```
display(Markdown(f"<b>{response}</b>"))
```

**作者撰寫短篇小說，同時也從事程式設計，特別是在九年級時使用 IBM 1401 電腦。他們後來擁有了微電腦並開始在上面進行程式設計，撰寫簡單的遊戲和文字處理器。他們最初計劃在大學學習哲學，但最終轉而學習 AI。**

```
print(response.source_nodes[0].text)
```

```
What I Worked On


February 2021


Before college the two main things I worked on, outside of school, were writing and programming. I didn't write essays. I wrote what beginning writers were supposed to write then, and probably still are: short stories. My stories were awful. They had hardly any plot, just characters with strong feelings, which I imagined made them deep.


The first programs I tried writing were on the IBM 1401 that our school district used for what was then called "data processing." This was in 9th grade, so I was 13 or 14. The school district's 1401 happened to be in the basement of our junior high school, and my friend Rich Draves and I got permission to use it. It was like a mini Bond villain's lair down there, with all these alien-looking machines — CPU, disk drives, printer, card reader — sitting up on a raised floor under bright fluorescent lights.


The language we used was an early version of Fortran. You had to type programs on punch cards, then stack them in the card reader and press a button to load the program into memory and run it. The result would ordinarily be to print something on the spectacularly loud printer.


I was puzzled by the 1401. I couldn't figure out what to do with it. And in retrospect there's not much I could have done with it. The only form of input to programs was data stored on punched cards, and I didn't have any data stored on punched cards. The only other option was to do things that didn't rely on any input, like calculate approximations of pi, but I didn't know enough math to do anything interesting of that type. So I'm not surprised I can't remember any programs I wrote, because they can't have done much. My clearest memory is of the moment I learned it was possible for programs not to terminate, when one of mine didn't. On a machine without time-sharing, this was a social as well as a technical error, as the data center manager's expression made clear.


With microcomputers, everything changed. Now you could have a computer sitting right in front of you, on a desk, that could respond to your keystrokes as it was running instead of just churning through a stack of punch cards and then stopping. [1]


The first of my friends to get a microcomputer built it himself. It was sold as a kit by Heathkit. I remember vividly how impressed and envious I felt watching him sitting in front of it, typing programs right into the computer.


Computers were expensive in those days and it took me years of nagging before I convinced my father to buy one, a TRS-80, in about 1980. The gold standard then was the Apple II, but a TRS-80 was good enough. This was when I really started programming. I wrote simple games, a program to predict how high my model rockets would fly, and a word processor that my father used to write at least one book. There was only room in memory for about 2 pages of text, so he'd write 2 pages at a time and then print them out, but it was a lot better than a typewriter.


Though I liked programming, I didn't plan to study it in college. In college I was going to study philosophy, which sounded much more powerful. It seemed, to my naive high school self, to be the study of the ultimate truths, compared to which the things studied in other fields would be mere domain knowledge. What I discovered when I got to college was that the other fields took up so much of the space of ideas that there wasn't much left for these supposed ultimate truths. All that seemed left for philosophy were edge cases that people in other fields felt could safely be ignored.


I couldn't have put this into words when I was 18. All I knew at the time was that I kept taking philosophy courses and they kept being boring. So I decided to switch to AI.


AI was in the air in the mid 1980s, but there were two things especially that made me want to work on it: a novel by Heinlein called The Moon is a Harsh Mistress, which featured an intelligent computer called Mike, and a PBS documentary that showed Terry Winograd using SHRDLU. I haven't tried rereading The Moon is a Harsh Mistress, so I don't know how well it has aged, but when I read it I was drawn entirely into its world. It seemed only a matter of time before we'd have Mike, and when I saw Winograd using SHRDLU, it seemed like that time would be a few years at most.
```

**使用自訂嵌入字串查詢索引**

```
from llama_index.core import QueryBundle
```

```
query_bundle = QueryBundle(
    query_str="What did the author do growing up?",
    custom_embedding_strs=["The author grew up painting."],
)
query_engine = index.as_query_engine()
response = query_engine.query(query_bundle)
```

```
INFO:httpx:HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
INFO:httpx:HTTP Request: POST https://api.openai.com/v1/chat/completions "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/chat/completions "HTTP/1.1 200 OK"
```

```
display(Markdown(f"<b>{response}</b>"))
```

**內容中未提供關於作者成長過程的資訊。**

**使用最大邊際相關性（Maximal Marginal Relevance，MMR）**

這種方法不只依相似度排列向量，也會根據 [MMR](https://www.cs.cmu.edu/~jgc/publication/The_Use_MMR_Diversity_Based_LTMIR_1998.pdf) 降低與已找到文件相似的文件排名，以增加結果多樣性。mmr\_treshold 值越低，多樣性越高。

```
query_engine = index.as_query_engine(
    vector_store_query_mode="mmr", vector_store_kwargs={"mmr_threshold": 0.2}
)
response = query_engine.query("What did the author do growing up?")
```

```
INFO:httpx:HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
INFO:httpx:HTTP Request: POST https://api.openai.com/v1/chat/completions "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/chat/completions "HTTP/1.1 200 OK"
```

#### 取得來源

```
print(response.get_formatted_sources())
```

```
> Source (Doc id: c4118521-8f55-4a4d-819a-2db546b6491e): What I Worked On


February 2021


Before college the two main things I worked on, outside of schoo...


> Source (Doc id: 74f77233-e4fe-4389-9820-76dd9f765af6): Which meant being easy to use and inexpensive. It was lucky for us that we were poor, because tha...
```

#### 使用篩選條件查詢索引

我們也可以使用 metadata 篩選查詢結果。

```
from llama_index.core import Document


doc = Document(text="target", metadata={"tag": "target"})


index.insert(doc)
```

```
INFO:httpx:HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
```

```
from llama_index.core.vector_stores import ExactMatchFilter, MetadataFilters


filters = MetadataFilters(
    filters=[ExactMatchFilter(key="tag", value="target")]
)


retriever = index.as_retriever(
    similarity_top_k=20,
    filters=filters,
)


source_nodes = retriever.retrieve("What did the author do growing up?")
```

```
INFO:httpx:HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
HTTP Request: POST https://api.openai.com/v1/embeddings "HTTP/1.1 200 OK"
```

```
# retrieves only our target node, even though we set the top k to 20
print(len(source_nodes))
```

```
1
```

```
print(source_nodes[0].text)
print(source_nodes[0].metadata)
```

```
target
{'tag': 'target'}
```
