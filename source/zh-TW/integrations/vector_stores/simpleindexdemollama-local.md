---
title: "Local Llama2 + VectorStoreIndex"
---

本筆筆記將介紹如何正確設定，以便在本地使用 llama-2 與 LlamaIndex。請注意，要運行本筆記，您需要一張不錯的 GPU，理想情況下是配備至少 40GB 記憶體的 A100。

具體來說，我們將探討如何使用 vector store index。

## 設定

```
%pip install llama-index-llms-huggingface
%pip install llama-index-embeddings-huggingface
```

```
!pip install llama-index ipywidgets
```

### 設定

**重要**：請使用 `huggingface-cli login` 在您的 console 中，使用擁有 llama2 模型存取權限的帳號登入 HF hub。更多詳情請參閱：<https://ai.meta.com/resources/models-and-libraries/llama-downloads/>。

```
import logging
import sys


logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))




from IPython.display import Markdown, display
```

```
import torch
from llama_index.llms.huggingface import HuggingFaceLLM
from llama_index.core import PromptTemplate


# Model names (make sure you have access on HF)
LLAMA2_7B = "meta-llama/Llama-2-7b-hf"
LLAMA2_7B_CHAT = "meta-llama/Llama-2-7b-chat-hf"
LLAMA2_13B = "meta-llama/Llama-2-13b-hf"
LLAMA2_13B_CHAT = "meta-llama/Llama-2-13b-chat-hf"
LLAMA2_70B = "meta-llama/Llama-2-70b-hf"
LLAMA2_70B_CHAT = "meta-llama/Llama-2-70b-chat-hf"


selected_model = LLAMA2_13B_CHAT


SYSTEM_PROMPT = """You are an AI assistant that answers questions in a friendly manner, based on the given source documents. Here are some rules you always follow:
- Generate human readable output, avoid creating output with gibberish text.
- Generate only the requested output, don't include any other language before or after the requested output.
- Never say thank you, that you are happy to help, that you are an AI agent, etc. Just answer directly.
- Generate professional language typically used in business documents in North America.
- Never generate offensive or foul language.
"""


query_wrapper_prompt = PromptTemplate(
    "[INST]<<SYS>>\n" + SYSTEM_PROMPT + "<</SYS>>\n\n{query_str}[/INST] "
)


llm = HuggingFaceLLM(
    context_window=4096,
    max_new_tokens=2048,
    generate_kwargs={"temperature": 0.0, "do_sample": False},
    query_wrapper_prompt=query_wrapper_prompt,
    tokenizer_name=selected_model,
    model_name=selected_model,
    device_map="auto",
    # change these settings below depending on your GPU
    model_kwargs={"torch_dtype": torch.float16, "load_in_8bit": True},
)
```

```
from llama_index.embeddings.huggingface import HuggingFaceEmbedding


embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")
```

```
from llama_index.core import Settings


Settings.llm = llm
Settings.embed_model = embed_model
```

下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

```
from llama_index.core import SimpleDirectoryReader


# load documents
documents = SimpleDirectoryReader("./data/paul_graham/").load_data()
```

```
from llama_index.core import VectorStoreIndex


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

**成長過程中，作者寫短篇故事，在 IBM 1401 上編程，最終說服父親買了一台 TRS-80 微電腦。他寫了簡單的遊戲、一個預測他的模型火箭飛得有多高、以及一個文字處理器。他在大學時學習哲學，但最終轉向 AI。他寫了論文並在網路上發表，並從事垃圾郵件過濾和繪畫。他每週四晚上都為一群朋友舉辦晚宴，並在劍橋買了一棟建築物。**

### Streaming Support

```
import time


query_engine = index.as_query_engine(streaming=True)
response = query_engine.query("What happened at interleaf?")


start_time = time.time()


token_count = 0
for token in response.response_gen:
    print(token, end="")
    token_count += 1


time_elapsed = time.time() - start_time
tokens_per_second = token_count / time_elapsed


print(f"\n\nStreamed output at {tokens_per_second} tokens/s")
```

```
At Interleaf, a group of people worked on projects for customers. One of the employees told the narrator about a new thing called HTML, which was a derivative of SGML. The narrator left Interleaf to pursue art school at RISD, but continued to do freelance work for the group. Eventually, the narrator and two of his friends, Robert and Trevor, started a new company called Viaweb to create a web app that allowed users to build stores through the browser. They opened for business in January 1996 with 6 stores. The software had three main parts: the editor, the shopping cart, and the manager.


Streamed output at 26.923490295496002 tokens/s
```
