---
title: "自訂 LLMs 在 LlamaIndex Abstractions 中的設定"
---

您可以將這些 LLM abstraction 整合到 LlamaIndex（indexes、retrievers、query engines、agents）的其他模組中，讓您能夠在您的資料上建構先進的 workflows。

預設情況下，我們使用 OpenAI 的 `gpt-3.5-turbo` 模型。但您可以選擇自訂所使用的底層 LLM。

## 範例：更改底層 LLM

以下是自訂所使用的 LLM 的範例程式碼片段。

在這個範例中，我們使用 `gpt-4o-mini` 而非 `gpt-3.5-turbo`。可用的模型包括 `gpt-4o-mini`、`gpt-4o`、`o3-mini` 等。

```
from llama_index.core import Settings, VectorStoreIndex, SimpleDirectoryReader
from llama_index.llms.openai import OpenAI


# define LLM
llm = OpenAI(temperature=0.1, model="gpt-4o-mini")


# change the global default LLM
Settings.llm = llm


documents = SimpleDirectoryReader("data").load_data()


# build index
index = VectorStoreIndex.from_documents(documents)


# locally override the LLM
query_engine = index.as_query_engine(llm=llm)
response = query_engine.query(
    "What did the author do after his time at Y Combinator?"
)
```

## 範例：使用自訂 LLM 模型 - 進階

要使用自訂的 LLM 模型，您只需實作 `LLM` 類別（或 `CustomLLM` 以獲得更簡單的介面）。您需要負責將文本傳遞給模型並回傳新生成的 tokens。

此實作可以是某個本地模型，甚至是您自己的 API 的包裝器。

請注意，為了獲得完全私人的體驗，也請設定一個 [本地 embeddings 模型](/python/framework/module_guides/models/embeddings/)。

以下是一個小的範例程式碼：

```
from typing import Optional, List, Mapping, Any


from llama_index.core import SimpleDirectoryReader, SummaryIndex
from llama_index.core.callbacks import CallbackManager
from llama_index.core.llms import (
    CustomLLM,
    CompletionResponse,
    CompletionResponseGen,
    LLMMetadata,
)
from llama_index.core.llms.callbacks import llm_completion_callback
from llama_index.core import Settings




class OurLLM(CustomLLM):
    context_window: int = 3900
    num_output: int = 256
    model_name: str = "custom"
    dummy_response: str = "My response"


    @property
    def metadata(self) -> LLMMetadata:
        """Get LLM metadata."""
        return LLMMetadata(
            context_window=self.context_window,
            num_output=self.num_output,
            model_name=self.model_name,
        )


    @llm_completion_callback()
    def complete(self, prompt: str, **kwargs: Any) -> CompletionResponse:
        return CompletionResponse(text=self.dummy_response)


    @llm_completion_callback()
    def stream_complete(
        self, prompt: str, **kwargs: Any
    ) -> CompletionResponseGen:
        response = ""
        for token in self.dummy_response:
            response += token
            yield CompletionResponse(text=response, delta=token)




# define our LLM
Settings.llm = OurLLM()


# define embed model
Settings.embed_model = "local:BAAI/bge-base-en-v1.5"




# Load the your data
documents = SimpleDirectoryReader("./data").load_data()
index = SummaryIndex.from_documents(documents)


# Query and print response
query_engine = index.as_query_engine()
response = query_engine.query("<query_text>")
print(response)
```

使用此方法，您可以使用任何 LLM。也許您在本地運行一個，或者在您自己的伺服器上運行。只要類別被實作並且回傳了生成的 tokens，它就應該可以運作。請注意，我們需要使用 prompt helper 來自訂 prompt 的大小，因為每個模型都有略有不同的 context length。

decorator 是可選的，但它透過在 LLM 呼叫上提供可觀察性（observability）回調。

請注意，您可能需要調整內部 prompt 以獲得良好的效能。即使如此，您也應該使用足夠大的 LLM，以確保它有能力處理 LlamaIndex 內部使用的複雜查詢，因此您的表現可能會有所不同。

所有預設內部 prompt 的列表可以在 [這裡](https://github.com/run-llama/llama_index/blob/main/llama-index-core/llama_index/core/prompts/default_prompts.py) 找到，聊天特定的 prompt 則列在 [這裡](https://github.com/run-llama/llama_index/blob/main/llama_index/prompts/chat_prompts.py)。您也可以實作 [您自訂的 prompts](/python/framework/module_guides/models/prompts/)。