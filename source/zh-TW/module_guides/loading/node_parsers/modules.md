---
title: "Node 解析器模組"
---

## 基於檔案的 Node 解析器

有幾種基於檔案的 node 解析器，會根據正在解析的內容類型（JSON、Markdown 等）來建立 nodes。

最簡單的流程是將 `FlatFileReader` 與 `SimpleFileNodeParser` 組合，以便為每種內容自動使用最適合的 node 解析器。然後，您可能希望將基於檔案的 node 解析器與基於文字的 node 解析器串接起來，以考慮文本的實際長度。

### SimpleFileNodeParser

```
from llama_index.core.node_parser import SimpleFileNodeParser
from llama_index.readers.file import FlatReader
from pathlib import Path


md_docs = FlatReader().load_data(Path("./test.md"))


parser = SimpleFileNodeParser()
md_nodes = parser.get_nodes_from_documents(md_docs)
```

### HTMLNodeParser

此 node 解析器使用 `beautifulsoup` 來解析原始 HTML。

預設情況下，它會解析一部分 HTML 標籤，但您可以覆蓋此設定。

預設標籤是： `["p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "b", "i", "u", "section"]`

```
from llama_index.core.node_parser import HTMLNodeParser


parser = HTMLNodeParser(tags=["p", "h1"])  # optional list of tags
nodes = parser.get_nodes_from_documents(html_docs)
```

### JSONNodeParser

`JSONNodeParser` 解析原始 JSON。

```
from llama_index.core.node_parser import JSONNodeParser


parser = JSONNodeParser()


nodes = parser.get_nodes_from_documents(json_docs)
```

### MarkdownNodeParser

`MarkdownNodeParser` 解析原始 markdown 文本。

```
from llama_index.core.node_parser import MarkdownNodeParser


parser = MarkdownNodeParser()


nodes = parser.get_nodes_from_documents(markdown_docs)
```

## 文字分割器

### CodeSplitter

根據程式語言將原始程式碼文本進行分割。

請查看 [支援的語言列表](https://github.com/grantjenks/py-tree-sitter-languages#license)。

```
from llama_index.core.node_parser import CodeSplitter


splitter = CodeSplitter(
    language="python",
    chunk_lines=40,  # lines per chunk
    chunk_lines_overlap=15,  # lines overlap between chunks
    max_chars=1500,  # max chars per chunk
)
nodes = splitter.get_nodes_from_documents(documents)
```

### LangchainNodeParser

您也可以使用 node 解析器將 langchain 中的任何現有文本分割器包裝起來。

```
from langchain.text_splitter import RecursiveCharacterTextSplitter
from llama_index.core.node_parser import LangchainNodeParser


parser = LangchainNodeParser(RecursiveCharacterTextSplitter())
nodes = parser.get_nodes_from_documents(documents)
```

### Chunker

`Chunker` 是一個多用途的 node 解析器，它包裝了 [chonkie](https://docs.chonkie.ai/) chunkers。您可以使用任何支援的 chonkie 分塊策略的別名來初始化您的解析器，完整的有效別名列表可透過 `Chunker.valid_chunker_types` 屬性存取。

```
from llama_index.node_parser.chonkie import Chunker


parser = Chunker("recursive", chunk_size=2048)
nodes = parser.get_nodes_from_documents(documents)
```

您也可以直接傳入一個 chonkie chunker 實例來初始化解析器。

```
from chonkie import RecursiveChunker
from llama_index.node_parser.chonkie import Chunker


chonkie_chunker = RecursiveChunker()
parser = Chunker(chonkie_chunker)
nodes = parser.get_nodes_from_documents(documents)
```

### SentenceSplitter

`SentenceSplitter` 嘗試在尊重句子邊界的情況下分割文本。

```
from llama_index.core.node_parser import SentenceSplitter


splitter = SentenceSplitter(
    chunk_size=1024,
    chunk_overlap=20,
)
nodes = splitter.get_nodes_from_documents(documents)
```

### SentenceWindowNodeParser

`SentenceWindowNodeParser` 與其他 node 解析器相似，但它會將所有 documents 分割成單個句子。產生的 nodes 也在元數據中包含每個 node 周圍的句子“視窗”。請注意，此元數據不會對 LLM 或 embedding model 可見。

這對於生成具有非常特定範圍的 embedding 非常有用。然後，與 `MetadataReplacementNodePostProcessor` 結合，您可以將句子替換為其周圍的上下文，然後將 node 發送到 LLM。

設定解析器使用預設 settings 的範例如下。在實務上，您通常只需要調整句子的視窗大小。

```
from llama_index.core.node_parser import SentenceWindowNodeParser


node_parser = SentenceWindowNodeParser.from_defaults(
    # how many sentences on either side to capture
    window_size=3,
    # the metadata key that holds the window of surrounding sentences
    window_metadata_key="window",
    # the metadata key that holds the original sentence
    original_text_metadata_key="original_sentence",
)
```

完整的範例可以在 [這裡與 `MetadataReplacementNodePostProcessor` 結合](https://developers.llamaindex.ai/python/examples/node_postprocessor/metadatareplacementdemo/index.md) 找到。

### SemanticSplitterNodeParser

“Semantic chunking” 是 Greg Kamradt 在關於 5 層 embedding chunking 的影片教學中提出的新概念：<https://youtu.be/8OJC21T2SL4?t=1933>。

與使用**固定**的 chunk size 來分割文本不同，semantic splitter 透過 embedding 相似度自適應地選擇句子之間的斷點。這確保了“chunk”包含彼此在語義上相關的句子。

我們將其改編為一個 LlamaIndex 模組。

請查看我們的筆記！

注意事項：

- 正則表達式主要適用於英文句子
- 您可能需要調整斷點百分比閾值。

```
from llama_index.core.node_parser import SemanticSplitterNodeParser
from llama_index.embeddings.openai import OpenAIEmbedding


embed_model = OpenAIEmbedding()
splitter = SemanticSplitterNodeParser(
    buffer_size=1, breakpoint_percentile_threshold=95, embed_model=embed_model
)
```

完整的範例可以在我們的 [使用 `SemanticSplitterNodeParser` 的指南](https://developers.llamaindex.ai/python/examples/node_parsers/semantic_chunking/index.md) 中找到。

### TokenTextSplitter

`TokenTextSplitter` 嘗試根據原始 token 數量分割成一致的 chunk size。

```
from llama_index.core.node_parser import TokenTextSplitter


splitter = TokenTextSplitter(
    chunk_size=1024,
    chunk_overlap=20,
    separator=" ",
)
nodes = splitter.get_nodes_from_documents(documents)
```

## 基於關係的 Node 解析器

### HierarchicalNodeParser

此 node 解析器會將 nodes 分塊成分層的 nodes。這意味著單一輸入將被分割成多種大小的層級塊，每個 node 都包含對其父級 node 的引用。當與 `AutoMergingRetriever` 組合時，這使我們在檢索到大多數子物件時，能夠自動用其父物件來替換檢索到的 nodes。此過程為 LLM 提供了更完整的上下文以進行回應合成。

```
from llama_index.core.node_parser import HierarchicalNodeParser


node_parser = HierarchicalNodeParser.from_defaults(
    chunk_sizes=[2048, 512, 128]
)
```

完整的範例請參閱 [這裡，與 `AutoMergingRetriever` 組合](https://developers.llamaindex.ai/python/examples/retrievers/auto_merging_retriever/index.md)。