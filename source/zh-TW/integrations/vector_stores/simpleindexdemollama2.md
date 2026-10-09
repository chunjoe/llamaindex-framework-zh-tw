---
title: "Llama2 + VectorStoreIndex"
---

本筆記將介紹如何正確設定使用 llama-2 與 LlamaIndex。具體來說，我們將探討如何使用 vector store index。

## 設定

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-llms-replicate
```

```
!pip install llama-index
```

### Keys

```
import os


os.environ["OPENAI_API_KEY"] = "sk-..."
os.environ["REPLICATE_API_TOKEN"] = "YOUR_REPLICATE_TOKEN"
```

### Load documents，建立 VectorStoreIndex

```
# Optional logging
# import logging
# import sys


# logging.basicConfig(stream=sys.stdout, level=logging.INFO)
# logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))


from llama_index.core import VectorStoreIndex, SimpleDirectoryReader


from IPython.display import Markdown, display
```

```
from llama_index.llms.replicate import Replicate
from llama_index.core.llms.llama_utils import (
    messages_to_prompt,
    completion_to_prompt,
)


# The replicate endpoint
LLAMA_13B_V2_CHAT = "a16z-infra/llama13b-v2-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5"




# inject custom system prompt into llama-2
def custom_completion_to_prompt(completion: str) -> str:
    return completion_to_prompt(
        completion,
        system_prompt=(
            "You are a Q&A assistant. Your goal is to answer questions as "
            "accurately as possible is the instructions and context provided."
        ),
    )




llm = Replicate(
    model=LLAMA_13B_V2_CHAT,
    temperature=0.01,
    # override max tokens since it's interpreted
    # as context window instead of max tokens
    context_window=4096,
    # override completion representation for llama 2
    completion_to_prompt=custom_completion_to_prompt,
    # if using llama 2 for data agents, also override the message representation
    messages_to_prompt=messages_to_prompt,
)
```

```
from llama_index.core import Settings


Settings.llm = llm
```

下載資料

```
# load documents
documents = SimpleDirectoryReader("./data/paul_graham/").load_data()
```

```
index = VectorStoreIndex.from_documents(documents)
```

## 查詢

```
# set Logging to DEBUG for more detailed outputs
query_engine = index.as_query_engine()
```

```
response = query_engine.query("What did the author do growing up?")
display(Markdown(f"<b>{response}</b>"))
```

**根據提供的上下文資訊，作者的成長經歷包括：**

**1. 寫短篇故事，這些故事「很糟糕」且「幾乎沒有情節」。**
**2. 在九年級時，使用早期版本的 Fortran 語言，在 IBM 1401 電腦上進行程式設計。**
**3. 製作簡單的遊戲、一個預測模型火箭高度的程式，以及給父親的文字處理器。**
**4. 閱讀科幻小說，例如 Heinlein 的《The Moon is a Harsh Mistress》，這啟發了他從事 AI 的工作。**
**5. 居住在義大利佛羅倫斯，在城市街道上漫步前往 Accademia。**

**請注意，這些活動已在文本中提及，並非基於先前的知識或假設。**

### Streaming Support

```
query_engine = index.as_query_engine(streaming=True)
response = query_engine.query("What happened at interleaf?")
for token in response.response_gen:
    print(token, end="")
```

```
 Based on the context information provided, it appears that the author worked at Interleaf, a company that made software for creating and managing documents. The author mentions that Interleaf was "on the way down" and that the company's Release Engineering group was large compared to the group that actually wrote the software. It is inferred that Interleaf was experiencing financial difficulties and that the author was nervous about money. However, there is no explicit mention of what specifically happened at Interleaf.
```
