---
title: "使用 LLMs"
---

## 概念

在建立任何基於您的資料的 LLM 應用程式時，選擇適當的 Large Language Model (LLM) 是您需要考慮的第一步。

LLMs 是 LlamaIndex 的核心組成部分。它們可以作為獨立的 module 使用，或插入到其他核心 LlamaIndex module 中（indices、retrievers、query engines）。它們總是在回應合成步驟中被使用（例如，在檢索之後）。根據使用的 index 的類型，LLMs 也可能在 index 建構、插入和 query traversal 期間被使用。

LlamaIndex 為定義 LLM module 提供了一個統一的介面，無論是來自 OpenAI、Hugging Face 還是 LangChain，這樣您就不必自己編寫定義 LLM interface 的樣板程式碼。此介面包含以下內容（更多詳情見下）：

- 支援 **text completion** 和 **chat** endpoint（詳情見下）
- 支援 **streaming** 和 **non-streaming** endpoint
- 支援 **synchronous** 和 **asynchronous** endpoint

## 使用模式

以下程式碼片段展示了如何開始使用 LLMs。

如果您還沒有安裝，請安裝您的 LLM：

```
pip install llama-index-llms-openai
```

然後：

```
from llama_index.core import Settings
from llama_index.llms.openai import OpenAI


# changing the global default
Settings.llm = OpenAI()


# local usage
resp = OpenAI().complete("Paul Graham is ")
print(resp)


# per-query/chat engine
query_engine = index.as_query_engine(..., llm=llm)
chat_engine = index.as_chat_engine(..., llm=llm)
```

在 [standalone usage](/python/framework/module_guides/models/llms/usage_standalone/) 或 [自訂用法](/python/framework/module_guides/models/llms/usage_custom/) 了解更多詳情。

## 關於 Tokenization 的說明

預設情況下，LlamaIndex 對所有 token 統計使用一個全局 tokenizer。這預設為來自 tiktoken 的 `cl100k`，它是與預設的 LLM `gpt-3.5-turbo` 相匹配的 tokenizer。

如果您更改了 LLM，您可能需要更新此 tokenizer 以確保準確的 token 統計、chunking 和 prompting。

tokenizer 的唯一要求是它是一個可呼叫的 function，它接受一個 string 並回傳一個 list。

您可以像這樣設定一個全局 tokenizer：

```
from llama_index.core import Settings


# tiktoken
import tiktoken


Settings.tokenizer = tiktoken.encoding_for_model("gpt-3.5-turbo").encode


# huggingface
from transformers import AutoTokenizer


Settings.tokenizer = AutoTokenizer.from_pretrained(
    "HuggingFaceH4/zephyr-7b-beta"
)
```


## Modules

我們支援與 OpenAI、HuggingFace、Anthropic 等的整合。

請參閱完整的 [list of modules](/python/framework/module_guides/models/llms/modules/)。

## 進一步閱讀

- [Embeddings](/python/framework/module_guides/models/embeddings/)
- [Prompts](/python/framework/module_guides/models/prompts/)
- [Local LLMs](/python/framework/module_guides/models/llms/local/)
- [Running Llama2 Locally](https://replicate.com/blog/run-llama-locally)