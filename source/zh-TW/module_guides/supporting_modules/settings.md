---
title: "設定 Settings"
---

`Settings` 是一個在 LlamaIndex workflow/application 的索引和查詢階段常用資源的組合。

您可以使用它來設定全域配置。本地配置（transformations、LLMs、embedding models）可以直接傳遞給使用它們的介面。

`Settings` 是一個簡單的 singleton 物件，它在您的整個應用程式中都存在。每當特定的元件未提供時，`Settings` 物件會用它來提供作為全域預設值。

以下屬性可以設定在 `Settings` 物件上：

## LLM

LLM 用於回應提示和查詢，並負責撰寫自然語言回應。

```
from llama_index.llms.openai import OpenAI
from llama_index.core import Settings


Settings.llm = OpenAI(model="gpt-3.5-turbo", temperature=0.1)
```

## Embed Model

embedding model 用於將文字轉換為數值表示，用於計算相似度及 top-k retrieval。

```
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core import Settings


Settings.embed_model = OpenAIEmbedding(
    model="text-embedding-3-small", embed_batch_size=100
)
```

## Node Parser 文字 Splitter

node parser / text splitter 用於將 documents 解析成較小的區塊，稱為 nodes。

```
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core import Settings


Settings.text_splitter = SentenceSplitter(chunk_size=1024)
```

如果您只想更改 chunk size 或 chunk overlap 而不更改預設的 splitter，也可以這樣做：

```
Settings.chunk_size = 512
Settings.chunk_overlap = 20
```

## Transformations

Transformations 在資料攝取（ingestion）過程中應用於 `Document`。預設情況下使用 `node_parser`/`text_splitter`，但這可以被覆蓋並進一步自訂。

```
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core import Settings


Settings.transformations = [SentenceSplitter(chunk_size=1024)]
```

## Tokenizer

tokenizer 用於計算 tokens 的數量。這應該設定為與您使用的 LLM 相匹配的值。

```
from llama_index.core import Settings


# openai
import tiktoken


Settings.tokenizer = tiktoken.encoding_for_model("gpt-3.5-turbo").encode


# open-source
from transformers import AutoTokenizer


Settings.tokenzier = AutoTokenizer.from_pretrained(
    "mistralai/Mixtral-8x7B-Instruct-v0.1"
)
```

## Callbacks

您可以設定一個全域 callback manager，可用於觀察和消耗在 llama-index 程式碼中產生的事件。

```
from llama_index.core.callbacks import TokenCountingHandler, CallbackManager
from llama_index.core import Settings


token_counter = TokenCountingHandler()
Settings.callback_manager = CallbackManager([token_counter])
```

## 提示詞 輔助參數

在查詢過程中會使用一些特定的參數/值，以確保輸入給 LLM 的提示有足夠的空間來生成特定數量的 tokens。

通常這些會使用 LLM 的屬性自動配置，但在特殊情況下可以被覆蓋。

```
from llama_index.core import Settings


# maximum input size to the LLM
Settings.context_window = 4096


# number of tokens reserved for text generation.
Settings.num_output = 256
```

提示

瞭解如何設定特定模組：- [LLM](/python/framework/module_guides/models/llms/usage_custom/) - [Embedding Model](/python/framework/module_guides/models/embeddings/) - [Node Parser/Text Splitters](/python/framework/module_guides/loading/node_parsers/) - [Callbacks](/python/framework/module_guides/observability/callbacks/)

## 設定本地配置

使用 settings 特定部分的介面也可以接受本地覆蓋。

```
index = VectorStoreIndex.from_documents(
    documents, embed_model=embed_model, transformations=transformations
)


query_engine = index.as_query_engine(llm=llm)
```
