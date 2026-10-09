---
title: "從 ServiceContext 遷移到 Settings"
---

在 v0.10.0 中引入了新的 global `Settings` 物件，旨在取代舊的 `ServiceContext` 配置。

新的 `Settings` 物件是 global settings，其參數會被惰性初始化。像 LLM 或 embedding model 等屬性只會在底層模組實際需要時才會載入。

先前使用 service context 時，各種模組通常不會使用它，而且它會強制在執行時期將每個元件載入記憶體中（即使這些元件沒有被使用）。

配置 global settings 意味著您正在更改 LlamaIndex 中每個模組的預設值。這意味著如果您不使用 OpenAI，一個範例配置可能如下所示：

```
from llama_index.llms.ollama import Ollama
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core import Settings


Settings.llm = Ollama(model="llama2", request_timeout=120.0)
Settings.embed_model = HuggingFaceEmbedding(
    model_name="BAAI/bge-small-en-v1.5"
)
```

現在有了這個 settings，您可以確保 OpenAI 在框架中永遠不會被使用。

`Settings` 物件支援幾乎與舊的 `ServiceConext` 相同的屬性。完整的列表可以在 [文件頁面](/python/framework/module_guides/supporting_modules/settings/) 中找到。

### 完全遷移

以下是從 `ServiceContext` 完全遷移到 `Settings` 的範例：

**之前**

```
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core.node_parser import SentenceSplitter
from llama_index.llms.openai import OpenAI
from llama_index.core import ServiceContext, set_global_service_context


service_context = ServiceContext.from_defaults(
    llm=OpenAI(model="gpt-3.5-turbo"),
    embed_model=OpenAIEmbedding(model="text-embedding-3-small"),
    node_parser=SentenceSplitter(chunk_size=512, chunk_overlap=20),
    num_output=512,
    context_window=3900,
)
set_global_service_context(service_context)
```

**之後**

```
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core.node_parser import SentenceSplitter
from llama_index.llms.openai import OpenAI
from llama_index.core import Settings


Settings.llm = OpenAI(model="gpt-3.5-turbo")
Settings.embed_model = OpenAIEmbedding(model="text-embedding-3-small")
Settings.node_parser = SentenceSplitter(chunk_size=512, chunk_overlap=20)
Settings.num_output = 512
Settings.context_window = 3900
```

## 本地配置

以上內容涵蓋了 global configuration。若要按模組配置 settings，則所有模組介面都應更新為接受被使用物件的 kwargs。

如果您使用 IDE，kwargs 應會透過 intellisense 自動填入，但以下是一些範例：

```
# a vector store index only needs an embed model
index = VectorStoreIndex.from_documents(
    documents, embed_model=embed_model, transformations=transformations
)


# ... until you create a query engine
query_engine = index.as_query_engine(llm=llm)
```

```
# a document summary index needs both an llm and embed model
# for the constructor
index = DocumentSummaryIndex.from_documents(
    documents, embed_model=embed_model, llm=llm
)
```
