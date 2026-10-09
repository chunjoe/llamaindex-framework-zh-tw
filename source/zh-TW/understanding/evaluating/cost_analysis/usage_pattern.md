---
title: "使用模式"
---

## 估算 LLM 和 Embedding Token 數量

為了測量 LLM 和 Embedding token 數量，您需要

1. 設定 `MockLLM` 和 `MockEmbedding` 物件

```
from llama_index.core.llms import MockLLM
from llama_index.core import MockEmbedding


llm = MockLLM(max_tokens=256)
embed_model = MockEmbedding(embed_dim=1536)
```

2. 設定 `TokenCountingCallback` handler

```
import tiktoken
from llama_index.core.callbacks import CallbackManager, TokenCountingHandler


token_counter = TokenCountingHandler(
    tokenizer=tiktoken.encoding_for_model("gpt-3.5-turbo").encode
)


callback_manager = CallbackManager([token_counter])
```

3. 將它們加入到全局 `Settings`

```
from llama_index.core import Settings


Settings.llm = llm
Settings.embed_model = embed_model
Settings.callback_manager = callback_manager
```

4. 建構 Index

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader


documents = SimpleDirectoryReader(
    "./docs/examples/data/paul_graham"
).load_data()


index = VectorStoreIndex.from_documents(documents)
```

5. 測量數量！

```
print(
    "Embedding Tokens: ",
    token_counter.total_embedding_token_count,
    "\n",
    "LLM Prompt Tokens: ",
    token_counter.prompt_llm_token_count,
    "\n",
    "LLM Completion Tokens: ",
    token_counter.completion_llm_token_count,
    "\n",
    "Total LLM Token Count: ",
    token_counter.total_llm_token_count,
    "\n",
)


# reset counts
token_counter.reset_counts()
```

6. 執行查詢，再次測量

```
query_engine = index.as_query_engine()


response = query_engine.query("query")


print(
    "Embedding Tokens: ",
    token_counter.total_embedding_token_count,
    "\n",
    "LLM Prompt Tokens: ",
    token_counter.prompt_llm_token_count,
    "\n",
    "LLM Completion Tokens: ",
    token_counter.completion_llm_token_count,
    "\n",
    "Total LLM Token Count: ",
    token_counter.total_llm_token_count,
    "\n",
)
```
