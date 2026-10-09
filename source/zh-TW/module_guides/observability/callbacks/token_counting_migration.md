---
title: "Token 統計 - 遷移指南"
---

現有的 token 統計實作已**棄用**。

我們知道 token 統計對許多使用者很重要，因此本指南旨在引導您完成（希望是無痛的）轉換。

先前，token 統計直接追蹤在 `llm_predictor` 和 `embed_model` 物件上，並可選擇印出到控制台。此實作使用靜態的 tokenizer 進行 token 統計（gpt-2），而 `last_token_usage` 和 `total_token_usage` 屬性並非總是正確追蹤。

今後，token 統計已移至 callback 中。使用 `TokenCountingHandler` callback，您現在有更多選項來控制 token 的計算方式、token 統計的生命週期，甚至為不同的 index 建立單獨的 token counter。

以下是使用新的 `TokenCountingHandler` 與 OpenAI model 的最小範例：

```
import tiktoken
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core.callbacks import CallbackManager, TokenCountingHandler
from llama_index.core import Settings


# you can set a tokenizer directly, or optionally let it default
# to the same tokenizer that was used previously for token counting
# NOTE: The tokenizer should be a function that takes in text and returns a list of tokens
token_counter = TokenCountingHandler(
    tokenizer=tiktoken.encoding_for_model("gpt-3.5-turbo").encode,
    verbose=False,  # set to true to see usage printed to the console
)


Settings.callback_manager = CallbackManager([token_counter])


document = SimpleDirectoryReader("./data").load_data()


# if verbose is turned on, you will see embedding token usage printed
index = VectorStoreIndex.from_documents(
    documents,
)


# otherwise, you can access the count directly
print(token_counter.total_embedding_token_count)


# reset the counts at your discretion!
token_counter.reset_counts()


# also track prompt, completion, and total LLM tokens, in addition to embeddings
response = index.as_query_engine().query("What did the author do growing up?")
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
)
```
