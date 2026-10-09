---
title: "CohereAI Embeddings"
---

Cohere Embed 是第一個原生支援 float、int8、binary 和 ubinary embeddings 的 embedding model。

1. v3 models 支援所有 embedding type，而 v2 models 只支援 `float` embedding type。
2. 預設的 `embedding_type` 是 `float` 加上 `LlamaIndex`。您可以使用參數 `embedding_type` 為 v3 models 進行自訂。

在本筆 Notebook 中，我們將使用不同的 `Cohere Embeddings`、`models`、`input_types` 和 `embedding_types` 來示範。

請參閱他們的 [main blog post](https://txt.cohere.com/int8-binary-embeddings/) 以獲取關於 Cohere int8 & binary Embeddings 的更多詳細資訊。

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-llms-cohere
%pip install llama-index-embeddings-cohere
```

```
!pip install llama-index
```

```
# Initilise with your api key
import os


cohere_api_key = "YOUR COHERE API KEY"
os.environ["COHERE_API_KEY"] = cohere_api_key
```

#### 使用最新的 `embed-english-v3.0` embeddings。

- input\_type=“search\_document”：用於您想儲存在 vector database 中的文字 (documents)
- input\_type=“search\_query”：用於搜尋查詢，以在您的 vector database 中找到最相關的 documents

預設的 `embedding_type` 是 `float`。

```
from llama_index.embeddings.cohere import CohereEmbedding


# with input_typ='search_query'
embed_model = CohereEmbedding(
    api_key=cohere_api_key,
    model_name="embed-english-v3.0",
    input_type="search_query",
)


embeddings = embed_model.get_text_embedding("Hello CohereAI!")


print(len(embeddings))
print(embeddings[:5])
```

```
1024
[-0.041931152, -0.022384644, -0.07067871, -0.011886597, -0.019210815]
```

```
# with input_type = 'search_document'
embed_model = CohereEmbedding(
    api_key=cohere_api_key,
    model_name="embed-english-v3.0",
    input_type="search_document",
)


embeddings = embed_model.get_text_embedding("Hello CohereAI!")


print(len(embeddings))
print(embeddings[:5])
```

```
1024
[-0.03074646, -0.0029201508, -0.058044434, -0.015457153, -0.02331543]
```

##### 讓我們檢查 使用 `int8` embedding\_type

```
embed_model = CohereEmbedding(
    api_key=cohere_api_key,
    model_name="embed-english-v3.0",
    input_type="search_query",
    embedding_type="int8",
)


embeddings = embed_model.get_text_embedding("Hello CohereAI!")


print(len(embeddings))
print(embeddings[:5])
```

```
1024
[-54, -29, -90, -16, -25]
```

##### 使用 `binary` embedding\_type

```
embed_model = CohereEmbedding(
    api_key=cohere_api_key,
    model_name="embed-english-v3.0",
    input_type="search_query",
    embedding_type="binary",
)


embeddings = embed_model.get_text_embedding("Hello CohereAI!")


print(len(embeddings))
print(embeddings[:5])
```

```
128
[-127, -38, 66, 83, 89]
```

#### 使用舊的 `embed-english-v2.0` embeddings。

v2 models 預設支援 `float` embedding\_type。

```
embed_model = CohereEmbedding(
    api_key=cohere_api_key, model_name="embed-english-v2.0"
)


embeddings = embed_model.get_text_embedding("Hello CohereAI!")


print(len(embeddings))
print(embeddings[:5])
```

```
4096
[0.65771484, 0.7998047, 2.3769531, -2.3105469, -1.6044922]
```

#### 現在使用最新的 `embed-english-v3.0` embeddings，

讓我們使用

1. input\_type=`search_document` 來建立 index
2. input\_type=`search_query` 來檢索相關的 context。

我們將實驗 `int8` embedding\_type。

```
import logging
import sys


logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))


from llama_index.core import VectorStoreIndex, SimpleDirectoryReader


from llama_index.llms.cohere import Cohere
from llama_index.core.response.notebook_utils import display_source_node


from IPython.display import Markdown, display
```

```
INFO:matplotlib.font_manager:generated new fontManager
generated new fontManager
```

#### 下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

```
--2024-03-27 13:02:13--  https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt
Resolving raw.githubusercontent.com (raw.githubusercontent.com)... 185.199.110.133, 185.199.111.133, 185.199.109.133, ...
Connecting to raw.githubusercontent.com (raw.githubusercontent.com)|185.199.110.133|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 75042 (73K) [text/plain]
Saving to: ‘data/paul_graham/paul_graham_essay.txt’


data/paul_graham/pa 100%[===================>]  73.28K  --.-KB/s    in 0.02s


2024-03-27 13:02:14 (2.96 MB/s) - ‘data/paul_graham/paul_graham_essay.txt’ saved [75042/75042]
```

#### 載入資料

```
documents = SimpleDirectoryReader("./data/paul_graham/").load_data()
```

### 使用 `int8` embedding\_type

#### 使用 input\_type = ‘search\_document’ 建立 index

```
llm = Cohere(model="command-nightly", api_key=cohere_api_key)
embed_model = CohereEmbedding(
    api_key=cohere_api_key,
    model_name="embed-english-v3.0",
    input_type="search_document",
    embedding_type="int8",
)


index = VectorStoreIndex.from_documents(
    documents=documents, embed_model=embed_model
)
```

#### 使用 input\_type = ‘search\_query’ 建立 retriever

```
embed_model = CohereEmbedding(
    api_key=cohere_api_key,
    model_name="embed-english-v3.0",
    input_type="search_query",
    embedding_type="int8",
)


search_query_retriever = index.as_retriever()


search_query_retrieved_nodes = search_query_retriever.retrieve(
    "What happened in the summer of 1995?"
)
```

```
for n in search_query_retrieved_nodes:
    display_source_node(n, source_length=2000)
```

**Node ID:** 0f821a16-5242-4284-86ba-23b16069e071\
**Similarity:** 0.30740912992211505\
**Text:** 我們會使用我在劍橋的辦公室作為我們的總部。我們每週都會在那裡共進晚餐——週二，因為我已經為週四的晚餐準備菜了——晚餐後我們會請來創業領域的專家進行演講。

我們知道大學生當時正在決定暑期工作，所以在幾天內我們想出了一個叫做 Summer Founders Program 的計畫，並在我的網站上發布了公告，邀請大學生申請。我從未想像過寫論文會是獲得投資人所稱的「deal flow」的方式，但事實證明這是完美的來源。\[15] 我們收到了 225 份 Summer Founders Program 的申請，我們很驚訝地發現其中很多是已經畢業或即將畢業的人。這個 SFP 項目開始變得比我們預期的更嚴肅了。

我們邀請了 225 個群體中的約 20 個進行面談，從中選出了 8 個來資助。他們是一個令人印象深刻的團隊。第一批包括了 reddit、Justin Kan 和 Emmett Shear，他們後來創立了 Twitch；Aaron Swartz，他已經幫助撰寫了 RSS spec，幾年後成為了開放獲取權的殉道者；以及 Sam Altman，他後來成為 YC 的第二任總裁。我不認為第一批這麼好的結果完全是偶然。你必須非常大膽地申請像 Summer Founders Program 這樣奇怪的東西，而不是去微軟或高盛這樣正經的地方找暑期工作。

對於新創公司的交易是基於我們與 Julian 達成（10% 的 10,000 美元）的交易，以及 Robert 說麻省理工學院的學生暑期能獲得的（6,000 美元）的組合。我們每位創辦人投資 6,000 美元，在典型的兩位創辦人情況下是 12,000 美元，以換取 6%。這必須是公平的，因為它比我們自己獲得的交易好兩倍。此外，那個熱鬧的第一個夏天，Jessica 帶來了創辦人免費的空調。\[16]我很快就意識到我們遇到了……

**Node ID:** 15e1050d-38f1-4c7c-a169-ef9fe4ab1249\
**Similarity:** 0.3000104724138056\
**Text:** 一家只有少數員工的公司看起來會很業餘。所以我們直到 Yahoo 在 1998 年夏天收購我們時才達到收支平衡。這意味著在公司的整個生命週期中，我們都受制於投資人。而且我們和我們的投資人都是新創公司的新手，結果即使以新創公司的標準來看，也是一團糟。

Yahoo 收購我們時，這是一個巨大的解脫。原則上，我們的 Viaweb 股票是有價值的。它代表的是一家盈利且快速增長的業務的股份。但對我來說，這感覺並不特別有價值；我不知道如何評估一家公司，但我非常清楚我們每隔幾個月就會經歷的瀕臨死亡的體驗。而且自從我們開始以來，我的研究生生活也沒有有實質性的改變。所以當 Yahoo 收購我們時，感覺就像是從貧窮到富裕。因為我們要去加州，我買了一輛車，一輛 1998 年的 VW GTI 黃色車。我記得當時想著，光是它的皮革座椅就已經是我擁有的最奢華的東西了。

接下來的一年，從 1998 年夏天到 1999 年夏天，可能是我人生中最不富有成效的一年。當時我沒有意識到，但我已經精疲力盡於經營 Viaweb 所帶來的努力和壓力。在到達加州後有一段時間，我試圖繼續我平時的編程方式，直到凌晨三點，但疲勞加上 Yahoo 提前衰退的文化和聖克拉拉的嚴峻工廠，逐漸將我拖垮。幾個月後，感覺就像在 Interleaf 工作一樣令人不安。

Yahoo 收購我們時給了我們很多選擇。當時我認為 Yahoo 被高估了，他們永遠不會有任何價值，但令我驚訝的是，該股票在接下來的一年內上漲了 5 倍。我堅持到第一批期權歸屬後，然後在 1999 年夏天離開了。我已經很久沒有畫過任何東西了，幾乎忘了我為什麼要做這件事。我的腦子四年來完全充滿了軟體和男士襯衫。但我這麼做是為了致富……

### 使用 `float` embedding\_type

#### Build index with input\_type = ‘search\_document’

```
llm = Cohere(model="command-nightly", api_key=cohere_api_key)
embed_model = CohereEmbedding(
    api_key=cohere_api_key,
    model_name="embed-english-v3.0",
    input_type="search_document",
    embedding_type="float",
)


index = VectorStoreIndex.from_documents(
    documents=documents, embed_model=embed_model
)
```

#### Build retriever with input\_type = ‘search\_query’

```
embed_model = CohereEmbedding(
    api_key=cohere_api_key,
    model_name="embed-english-v3.0",
    input_type="search_query",
    embedding_type="float",
)


search_query_retriever = index.as_retriever()


search_query_retrieved_nodes = search_query_retriever.retrieve(
    "What happened in the summer of 1995?"
)
```

```
for n in search_query_retrieved_nodes:
    display_source_node(n, source_length=2000)
```

**Node ID:** cff8a942-2e1a-4921-ac08-8355b49fde85\
**Similarity:** 0.3051793987443398\
**Text:** 我們將把在劍橋擁有的建築作為我們的總部。我們每週都在那裡共進晚餐——週二，因為我已經為週四的晚餐準備食物——晚餐後我們會請新創公司的專家來做演講。

我們知道大學生當時正在決定暑期工作，所以我們在幾天內想出了一個我們稱之為 Summer Founders Program 的計畫，並在我的網站上發布了公告，邀請大學生申請。我從未想像過寫論文會是獲得「deal flow」的方式，投資人所稱的，但事實證明這是完美的來源。[15] 我們收到了 225 份 Summer Founders Program 的申請，我們很驚訝地發現其中很多是已經畢業或即將畢業的人。這個 SFP 項目已經開始感覺比我們預期的要嚴肅。

我們邀請了 225 份申請中的約 20 個小組進行面談，從中選出了 8 個來資助。他們是一個令人印象深刻的團隊。第一批包括了 reddit、Justin Kan 和 Emmett Shear，他們後來創立了 Twitch；Aaron Swartz，他已經幫助撰寫了 RSS 規範，幾年後成為了開放獲取（open access）的殉道者；以及 Sam Altman，他後來成為 YC 的第二任總裁。我不認為第一批如此優秀完全是偶然。你必須非常大膽地註冊一個像 Summer Founders Program 這樣奇怪的東西，而不是去微軟或高盛那種正經的地方找暑期工作。創新的計畫是基於我們與 Julian 的交易（10% 換取 $10k）以及 Robert 說 MIT 研究生暑期能獲得的報酬（$6k）的組合。我們每位創辦人投資 $6k，在典型的雙創辦人情況下是 $12k，以換取 6%。這必須是公平的，因為它比我們自己獲得的交易好兩倍。此外，在那個非常熱的夏天，Jessica 讓創辦人免費提供空調。\[16]

我很快就意識到我們遇到了麻煩……

**Node ID:** 1810afad-3817-447c-a194-859601437923\
**Similarity:** 0.2959499578848539\
**Text:** 只有少數幾名員工的公司看起來會很業餘。所以我們直到 Yahoo 在 1998 年夏天收購我們時才達到收支平衡。這意味著在公司的整個生命週期中，我們都受制於投資人。而且我們和我們的投資人都是初學者，因此結果即使在創投標準下也是一團糟。

Yahoo 收購我們時，這是一個巨大的解脫。原則上，我們的 Viaweb 股票是有價值的。它代表的是一家盈利且快速增長的業務的股份。但對我來說，這感覺並不特別有價值；我不知道如何評估一家業務，但我非常清楚我們每隔幾個月就經歷的瀕臨死亡的體驗。而且自從我們開始以來，我對我的研究生生活也沒有有實質性的改變。所以當 Yahoo 收購我們時，感覺就像是從一無所有到富有。因為我們要去加州，我買了一輛車，一輛 1998 年的 VW GTI 黃色車。我記得當時想，光是它的皮革座椅就已經是我擁有的最奢華的東西了。

接下來的一年，從 1998 年夏天到 1999 年夏天，可能是我一生中最不富有成效的一年。當時我沒有意識到，但我已經精疲力盡於經營 Viaweb 所帶來的努力和壓力。在到達加州後有一段時間，我試圖繼續我平時的編程方式直到凌晨三點，但疲勞加上 Yahoo 過早衰退的文化和聖塔克拉拉的嚴峻工廠，逐漸將我拖垮。幾個月後，感覺就像在 Interleaf 工作一樣令人不安。

Yahoo 收購我們時給了我們很多選擇。當時我認為 Yahoo 的估值太高了，他們永遠不會有任何價值，但令我驚訝的是，該股票在接下來的一年內上漲了 5 倍。我堅持到第一批期權歸屬後，然後在 1999 年夏天我離開了。我已經很久沒有畫過東西了，幾乎忘了我為什麼要做這件事。我的大腦四年來完全充滿了軟體和男士襯衫。但我這麼做是為了致富……

### With `binary` embedding\_type.

#### Build index with input\_type = ‘search\_document’

```
embed_model = CohereEmbedding(
    api_key=cohere_api_key,
    model_name="embed-english-v3.0",
    input_type="search_document",
    embedding_type="binary",
)


index = VectorStoreIndex.from_documents(
    documents=documents, embed_model=embed_model
)
```

#### Build retriever with input\_type = ‘search\_query’

```
embed_model = CohereEmbedding(
    api_key=cohere_api_key,
    model_name="embed-english-v3.0",
    input_type="search_query",
    embedding_type="binary",
)


search_query_retriever = index.as_retriever()


search_query_retrieved_nodes = search_query_retriever.retrieve(
    "What happened in the summer of 1995?"
)
```

```
for n in search_query_retrieved_nodes:
    display_source_node(n, source_length=2000)
```

**Node ID:** fd8e185d-7c9e-40de-8d3e-09a76ae85e18\
**Similarity:** 0.3498979255746315\
**Text:** 在那個時代，編輯器是最好的通用網站建構工具之一。我保持程式碼簡潔，除了 Robert 和 Trevor 的程式碼之外，我不需要與任何其他軟體整合，所以很樂意工作。如果我只需要做這項軟體的工作，接下來的三年將是我一生中最輕鬆的三年。不幸的是，我必須做更多的事情，所有這些都比編程更不擅長，而接下來的三年卻是最有壓力的。

九十年代下半葉有很多創立電子商務軟體的公司。我們決心要成為 Microsoft Word，而不是 Interleaf。這意味著要易於使用且價格實惠。我們很幸運，因為我們很窮，這讓我們使 Viaweb 比我們意識到的更便宜。我們對小型商店收取每月 $100，對大型商店收取每月 $300。這個低價是一個很大的吸引力，也是競爭對手持續的痛點，但這並不是因為我們有什麼巧妙的見解才將價格定得低。我們不知道企業為東西付多少錢。每月 $300 對我們來說似乎是一筆大錢。我們在意外中做了很多事情。例如，我們做了現在被稱為「不具規模性地做事」的事情，儘管當時我們會描述為「太遜了，以至於我們不得不採取最絕望的措施來獲取使用者」。最常見的就是為他們建立商店。這看起來特別令人羞辱，因為我們軟體的全部存在意義是人們可以利用它來建立自己的商店。但為了獲取使用者，一切都值得。

我們學到了比我們想知道的更多關於零售的知識。例如，如果你只能看到一個男士襯衫的小圖（而且在當時的標準下，所有圖片都很小），那麼比起整件襯衫的圖片，看到領口的特寫會更好。我記得學到這個的原因是，這意味著我必須重新掃描大約 30 張男士襯衫的圖片。我第一批掃描的圖片也非常漂亮。

Thou…

**Node ID:** b013216a-1c23-46b6-ba78-aaeed21b2fe2\
**Similarity:** 0.3376224194936838\
**Text:** 但在夏天過半時，我意識到我真的不想經營一家公司——尤其不是一家大公司，因為看起來這必須是這樣。我最初開始 Viaweb 只因為我需要錢。現在我不再需要錢了，我為什麼還要這麼做呢？如果這個願景必須以公司形式實現，那就拋棄這個願景吧。我會建立一個可以作為開源專案完成的子集。

令我驚訝的是，我花在處理這些事情上的時間並未浪費。在我們開始 Y Combinator 之後，我經常會遇到正在處理這個新架構部分的新創公司，花這麼多時間思考它甚至試著編寫一些程式碼是非常有用的。

我作為開源專案建立的子集是新的 Lisp，我現在甚至不需要再隱藏它的括號了。許多 Lisp 黑客夢想著建立一個新的 Lisp，部分原因是因為這門語言的一個顯著特點是它有方言，部分原因，我想，是因為我們在腦海中對 Lisp 有一種柏拉圖式的形式，而現有的所有方言都未能達到。我確實如此。所以在夏天結束時，丹和我轉向研究這種新的 Lisp 方言，我稱之為 Arc，在我在劍橋買下的房子裡進行。

第二年春天，雷電擊中了。我被邀請在一個 Lisp 大會上做演講，所以我演講了我們如何在 Viaweb 中使用 Lisp。之後，我將這場演講的後記檔案上傳到 paulgraham.com，這是我在使用 Viaweb 之前幾年創建但從未用過的檔案。一天內它就有了 30,000 次頁面瀏覽。到底發生了什麼事？轉發的 URL 顯示有人在 Slashdot 上發布了它。[10]

哇，我心想，有受眾。如果我寫了什麼並把它放在網路上，任何人都可以閱讀。這現在可能顯得理所當然，但當時卻令人驚訝。在印刷時代，讀者有著狹窄的管道，受到被稱為編輯的兇猛怪物所看守。要讓你寫的東西獲得受眾的唯一方法是……

##### 檢索到的區塊與 `binary` 的 embedding type 與 `float` 和 `int8` 不同。對您的 RAG pipeline 使用 `float`/`int8`/`binary`/`ubinary` embeddings 進行 [retrieval evaluation](https://docs.llamaindex.ai/en/stable/module_guides/evaluating/usage_pattern_retrieval/) 會很有趣。

### Text-Image Embeddings

[Cohere 現在支援多模態 embedding model](https://cohere.com/blog/multimodal-embed-3)，其中文本和圖像都在相同的 embedding space 中。

```
from PIL import Image
import matplotlib.pyplot as plt


img = Image.open("../data/images/prometheus_paper_card.png")
plt.imshow(img)
```

```
<matplotlib.image.AxesImage at 0x2c7323af0>
```

![png](/assets/c970a920e232.png)

```
from llama_index.embeddings.cohere import CohereEmbedding


embed_model = CohereEmbedding(
    api_key=cohere_api_key,
    model_name="embed-english-v3.0",
)
```

##### Image Embeddings

```
embeddings = embed_model.get_image_embedding(
    "../data/images/prometheus_paper_card.png"
)


print(len(embeddings))
print(embeddings[:5])
```

```
1024
[0.01171875, -0.014503479, 0.014205933, -0.022949219, -0.040374756]
```

##### 文字向量嵌入

```
embeddings = embed_model.get_text_embedding("prometheus evaluation model")


print(len(embeddings))
print(embeddings[:5])
```

```
1024
[0.0044403076, 0.01737976, -0.023345947, 0.028182983, -0.036499023]
```
