---
title: "Anthropic 提示快取"
---

在本 Notebook 中，我們將演示如何使用 [Anthropic Prompt Caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) 與 LlamaIndex abstraction 進行使用。

透過在 messages request 中標記 `cache_control` 來啟用 Prompt Caching。

## Prompt Caching 的運作方式

當您啟用 Prompt Caching 發送請求時：

1. 系統會檢查提示前綴是否已從最近的查詢中快取。
2. 如果找到，則使用快取版本，減少處理時間和成本。
3. 否則，系統會處理完整的提示並將前綴快取以供未來使用。

**注意：**

A. Prompt caching 可與 `Claude 4 Opus`、`Claude 4 Sonnet`、`Claude 3.7 Sonnet`、`Claude 3.5 Sonnet`、`Claude 3.5 Haiku`、`Claude 3 Haiku` 和 `Claude 3 Opus` 模型一起使用。

B. 最短可快取的提示長度為：

```
1. 2048 tokens for Claude 3.5 Haiku and Claude 3 Haiku
2. 1024 for all the other models.
```

C. 即使標記了 `cache_control`，較短的提示也無法被快取。

### 設定 API Keys

```
import os


os.environ[
    "ANTHROPIC_API_KEY"
] = "sk-ant-..."  # replace with your Anthropic API key
```

### 設定 LLM

```
from llama_index.llms.anthropic import Anthropic


llm = Anthropic(model="claude-3-5-sonnet-20240620")
```

### 下載資料

在本次演示中，我們將使用 `Paul Graham Essay` 中的文字。我們將對該文字進行快取並基於它執行一些查詢。

```
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O './paul_graham_essay.txt'
```

```
--2024-12-14 18:39:03--  https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt
Resolving raw.githubusercontent.com (raw.githubusercontent.com)... 185.199.110.133, 185.199.111.133, 185.199.109.133, ...
Connecting to raw.githubusercontent.com (raw.githubusercontent.com)|185.199.110.133|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 75042 (73K) [text/plain]
Saving to: ‘./paul_graham_essay.txt’


./paul_graham_essay 100%[===================>]  73.28K  --.-KB/s    in 0.04s


2024-12-14 18:39:03 (1.62 MB/s) - ‘./paul_graham_essay.txt’ saved [75042/75042]
```

### 載入資料

```
from llama_index.core import SimpleDirectoryReader


documents = SimpleDirectoryReader(
    input_files=["./paul_graham_essay.txt"],
).load_data()


document_text = documents[0].text
```

### 提示詞 快取

要啟用 prompt caching，您只需在 LlamaIndex 中使用 `CachePoint` 區塊：該區塊之前的內容都將被快取。

我們可以透過檢查以下參數來驗證文字是否已快取：

`cache_creation_input_tokens:` 建立新條目時寫入快取的 token 數量。

`cache_read_input_tokens:` 針對本次請求從快取中檢索的 token 數量。

`input_tokens:` 未從快取中讀取或用於建立快取的輸入 token 數量。

```
from llama_index.core.llms import (
    ChatMessage,
    TextBlock,
    CachePoint,
    CacheControl,
)


messages = [
    ChatMessage(role="system", content="You are helpful AI Assitant."),
    ChatMessage(
        role="user",
        content=[
            TextBlock(
                text=f"{document_text}",
                type="text",
            ),
            TextBlock(
                text="\n\nWhy did Paul Graham start YC?",
                type="text",
            ),
            CachePoint(cache_control=CacheControl(type="ephemeral")),
        ],
    ),
]


resp = llm.chat(messages)
```

讓我們檢視原始回應。

```
resp.raw
```

```
{'id': 'msg_01PAaZDTjEqcZksFiiqYH42t',
 'content': [TextBlock(text='Based on the essay, it seems Paul Graham started Y Combinator (YC) for a few key reasons:\n\n1. He had experience as a startup founder with Viaweb and wanted to help other founders avoid mistakes he had made.\n\n2. He had ideas about how venture capital could be improved, like making more smaller investments in younger technical founders.\n\n3. He was looking for something new to work on after selling Viaweb to Yahoo and trying painting for a while.\n\n4. He wanted to gain experience as an investor and thought funding a batch of startups at once would be a good way to do that.\n\n5. It started as a "Summer Founders Program" to give undergrads an alternative to summer internships, but quickly grew into something more serious.\n\n6. He saw an opportunity to scale startup funding by investing in batches of companies at once.\n\n7. He was excited by the potential to help create new startups and technologies.\n\n8. It allowed him to continue working with his friends/former colleagues Robert Morris and Trevor Blackwell.\n\n9. He had built an audience through his essays that provided deal flow for potential investments.\n\nSo in summary, it was a combination of wanting to help founders, improve venture capital, gain investing experience, work with friends, and leverage his existing audience/expertise in the startup world. The initial idea evolved quickly from a summer program into a new model for seed investing.', type='text')],
 'model': 'claude-3-5-sonnet-20240620',
 'role': 'assistant',
 'stop_reason': 'end_turn',
 'stop_sequence': None,
 'type': 'message',
 'usage': Usage(input_tokens=4, output_tokens=305, cache_creation_input_tokens=9, cache_read_input_tokens=17467)}
```

如您所見，由於我運行了幾次不同的次數，`cache_creation_input_tokens` 和 `cache_read_input_tokens` 的值都大於零，這表示文字已正確快取。

現在，讓我們對同一個 document 執行另一個查詢。它應該會從快取中檢索 document 的文字，這將反映在 `cache_read_input_tokens` 中。

```
messages = [
    ChatMessage(role="system", content="You are helpful AI Assitant."),
    ChatMessage(
        role="user",
        content=[
            TextBlock(
                text=f"{document_text}",
                type="text",
            ),
            TextBlock(
                text="\n\nWhat did Paul Graham do growing up?",
                type="text",
            ),
            CachePoint(cache_control=CacheControl(type="ephemeral")),
        ],
    ),
]


resp = llm.chat(messages)
```

```
resp.raw
```

```
{'id': 'msg_011TQgbpBuBkZAJeatVVcqtp',
 'content': [TextBlock(text='Based on the essay, here are some key things Paul Graham did growing up:\n\n1. As a teenager, he focused mainly on writing and programming outside of school. He tried writing short stories but says they were "awful".\n\n2. At age 13-14, he started programming on an IBM 1401 computer at his school district\'s data processing center. He used an early version of Fortran.\n\n3. In high school, he convinced his father to buy a TRS-80 microcomputer around 1980. He wrote simple games, a program to predict model rocket flight, and a word processor his father used.\n\n4. He went to college intending to study philosophy, but found it boring. He then decided to switch to studying artificial intelligence (AI).\n\n5. In college, he learned Lisp programming language, which expanded his concept of what programming could be. \n\n6. For his undergraduate thesis, he reverse-engineered SHRDLU, an early natural language processing program.\n\n7. He applied to grad schools for AI and ended up going to Harvard for graduate studies.\n\n8. In grad school, he realized AI as practiced then was not going to achieve true intelligence. He pivoted to focusing more on Lisp programming.\n\n9. He started writing a book about Lisp hacking while in grad school, which was eventually published in 1993 as "On Lisp".\n\nSo in summary, his early years were focused on writing, programming (especially Lisp), and studying AI, before he eventually moved on to other pursuits after grad school. The essay provides a detailed account of his intellectual development in these areas.', type='text')],
 'model': 'claude-3-5-sonnet-20240620',
 'role': 'assistant',
 'stop_reason': 'end_turn',
 'stop_sequence': None,
 'type': 'message',
 'usage': Usage(input_tokens=4, output_tokens=356, cache_creation_input_tokens=0, cache_read_input_tokens=17476)}
```

如您所見，回應是使用快取文字生成的，如 `cache_read_input_tokens` 所示。

使用 Anthropic，預設快取持續時間為 5 分鐘。您也可以設定更長的快取時間，例如 1 小時，只需在 `CachControl` 中的 `ttl` 參數中指定即可。

```
messages = [
    ChatMessage(role="system", content="You are helpful AI Assitant."),
    ChatMessage(
        role="user",
        content=[
            TextBlock(
                text=f"{document_text}",
                type="text",
            ),
            TextBlock(
                text="\n\nWhat did Paul Graham do growing up?",
                type="text",
            ),
            CachePoint(
                cache_control=CacheControl(type="ephemeral", ttl="1h"),
            ),
        ],
    ),
]


resp = llm.chat(messages)
```
