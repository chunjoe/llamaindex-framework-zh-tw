---
title: "自訂嵌入"
---

LlamaIndex 支援來自 OpenAI、Azure 和 Langchain 的 embeddings。但如果這樣不夠，您也可以實作任何 embeddings model！

下面的範例使用 Instructor Embeddings ([install/setup details here](https://huggingface.co/hkunlp/instructor-large))，並實作一個自訂的 embeddings class。Instructor embeddings 的運作方式是提供文本，以及關於該文本領域的「指示」（instructions）。這在對非常特定和專業的主題的文本進行 embedding 時非常有用。

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
!pip install llama-index
```

```
# Install dependencies
# !pip install InstructorEmbedding torch transformers sentence-transformers
```

```
import openai
import os


os.environ["OPENAI_API_KEY"] = "YOUR_API_KEY"
openai.api_key = os.environ["OPENAI_API_KEY"]
```

## 自訂 Embeddings 實作

```
from typing import Any, List
from InstructorEmbedding import INSTRUCTOR


from llama_index.core.bridge.pydantic import PrivateAttr
from llama_index.core.embeddings import BaseEmbedding




class InstructorEmbeddings(BaseEmbedding):
    _model: INSTRUCTOR = PrivateAttr()
    _instruction: str = PrivateAttr()


    def __init__(
        self,
        instructor_model_name: str = "hkunlp/instructor-large",
        instruction: str = "Represent a document for semantic search:",
        **kwargs: Any,
    ) -> None:
        super().__init__(**kwargs)
        self._model = INSTRUCTOR(instructor_model_name)
        self._instruction = instruction


    @classmethod
    def class_name(cls) -> str:
        return "instructor"


    async def _aget_query_embedding(self, query: str) -> List[float]:
        return self._get_query_embedding(query)


    async def _aget_text_embedding(self, text: str) -> List[float]:
        return self._get_text_embedding(text)


    def _get_query_embedding(self, query: str) -> List[float]:
        embeddings = self._model.encode([[self._instruction, query]])
        return embeddings[0]


    def _get_text_embedding(self, text: str) -> List[float]:
        embeddings = self._model.encode([[self._instruction, text]])
        return embeddings[0]


    def _get_text_embeddings(self, texts: List[str]) -> List[List[float]]:
        embeddings = self._model.encode(
            [[self._instruction, text] for text in texts]
        )
        return embeddings
```

## 使用範例

```
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
from llama_index.core import Settings
```

#### 下載資料

```
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

#### 載入 Documents

```
documents = SimpleDirectoryReader("./data/paul_graham/").load_data()
```

```
embed_model = InstructorEmbeddings(embed_batch_size=2)


Settings.embed_model = embed_model
Settings.chunk_size = 512


# if running for the first time, will download model weights first!
index = VectorStoreIndex.from_documents(documents)
```

```
load INSTRUCTOR_Transformer
max_seq_length  512
```

```
response = index.as_query_engine().query("What did the author do growing up?")
print(response)
```

```
The author wrote short stories and also worked on programming, specifically on an IBM 1401 computer in 9th grade. They used an early version of Fortran and had to type programs on punch cards. Later on, they got a microcomputer, a TRS-80, and started programming more extensively, writing simple games and a word processor. They initially planned to study philosophy in college but eventually switched to AI.
```
