---
title: "Response Synthesizer"
---

## 概念

`Response Synthesizer` 是使用用戶查詢和給定的文本區塊，從 LLM 生成回應的。回應合成器的輸出是一個 `Response` 物件。

執行此操作的方法有許多形式，從簡單地迭代文本區塊，到複雜地建立一個樹狀結構。這裡的主要想法是簡化使用 LLM 在您的資料上生成回應的過程。

在查詢引擎中使用時，回應合成器在從 retriever 檢索到 nodes 之後，以及在執行任何 node-postprocessors 之後使用。

提示

不確定回應合成器在 RAG workflow 中的位置？請閱讀 [高層次概念](/python/framework/getting_started/concepts/)

## 使用模式

單獨使用回應合成器：

```
from llama_index.core.data_structs import Node
from llama_index.core.response_synthesizers import ResponseMode
from llama_index.core import get_response_synthesizer


response_synthesizer = get_response_synthesizer(
    response_mode=ResponseMode.COMPACT
)


response = response_synthesizer.synthesize(
    "query text", nodes=[Node(text="text"), ...]
)
```

或在建立索引後在查詢引擎中使用：

```
query_engine = index.as_query_engine(response_synthesizer=response_synthesizer)
response = query_engine.query("query_text")
```

您可以在下方找到所有可用的回應合成器、模式以及如何建立您自己的詳細資訊。

## 使用模式

## 開始使用

使用 `response_mode` 為查詢引擎配置回應合成器：

```
from llama_index.core.data_structs import Node
from llama_index.core.schema import NodeWithScore
from llama_index.core import get_response_synthesizer


response_synthesizer = get_response_synthesizer(response_mode="compact")


response = response_synthesizer.synthesize(
    "query text", nodes=[NodeWithScore(node=Node(text="text"), score=1.0), ...]
)
```

或者，更常見的是，在建立索引後在查詢引擎中使用：

```
query_engine = index.as_query_engine(response_synthesizer=response_synthesizer)
response = query_engine.query("query_text")
```

提示

要了解如何建立索引，請參閱 [索引](/python/framework/module_guides/indexing/)

## 配置回應模式

回應合成器通常透過一個 `response_mode` kwarg 設定來指定。

LlamaIndex 中已經實作了幾種回應合成器：

- `refine`：透過依序遍歷每個檢索到的文本區塊來***建立並完善***一個答案。這會為每個 Node/檢索到的區塊執行一個單獨的 LLM 呼叫。

  **詳細資訊**：第一個區塊使用 `text_qa_template` prompt 進行查詢。然後答案和下一個區塊（以及原始問題）使用 `refine_template` prompt 進行另一個查詢。以此類推，直到所有區塊都被解析。

  如果一個區塊太大無法在視窗內容納（考慮 prompt 大小），則使用 `TokenTextSplitter` 進行分割（允許區塊之間有部分文本重疊），並且（新的）額外的區塊被視為原始區塊集合的區塊（因此也使用 `refine_template` 進行查詢）。

  適合更詳細的答案。

- `compact` (預設值)：類似於 `refine` 但***壓縮***（連接）區塊，從而減少 LLM 呼叫次數。

  **詳細資訊**：將盡可能多的文本（從檢索到的區塊中連接/打包）放入上下文視窗內（考慮 `text_qa_template` 和 `refine_template` 之間的最大 prompt 大小）。如果文本太長無法放入一個 prompt，則按需要分割成多個部分（使用 `TokenTextSplitter`，從而允許文本區塊之間有部分重疊）。

  每個文本部分都被視為一個 “chunk”，並發送給 `refine` synthesizer。

  簡而言之，它就像 `refine`，但 LLM 呼叫次數更少。

- `tree_summarize`：重複查詢 LLM，使用 `summary_template` prompt，直到所有連接的區塊都被查詢，從而產生許多答案，這些答案本身會被遞迴用作 `tree_summarize` LLM 呼叫中的區塊，依此類推，直到只剩一個區塊，因此只有一個最終答案。

  **詳細資訊**：盡可能多地將區塊連接以適應上下文視窗，使用 `summary_template` prompt，如果需要則分割（再次使用 `TokenTextSplitter` 並允許部分文本重疊）。然後，對每個結果的區塊/分割進行查詢，對 `summary_template`（沒有***refine*** 查詢！）進行查詢，以獲得最多的答案。

  如果只有一個答案（因為只有一個區塊），那就是最終答案。

  如果有多個答案，這些答案本身也被視為區塊，並遞迴發送到 `tree_summarize` 流程（連接/分割以適應/查詢）。

  適合摘要目的。- `simple_summarize`：將所有文本區塊截斷以適應單一 LLM prompt。適合快速摘要，但由於截斷可能丟失細節。

- `no_text`：僅執行 retriever 以獲取原本會傳送給 LLM 的 nodes，而不會實際傳送它們。然後可以透過檢查 `response.source_nodes` 來檢查。

- `context_only`：回傳所有文本區塊的合併字串。

- `accumulate`：給定一組文本區塊和查詢，將查詢應用於每個文本區塊，並將回應累積到一個 array 中。回傳所有回應的合併字串。適合當你需要對每個文本區塊分別執行相同的查詢時。

- `compact_accumulate`：與 accumulate 相同，但會像 `compact` 一樣「壓縮」每個 LLM prompt，並對每個文本區塊執行相同的查詢。

## 自訂回應合成器 (Custom Response Synthesizers)

每個回應合成器都繼承自 `llama_index.response_synthesizers.base.BaseSynthesizer`。基礎的 API 非常簡單，這使得創建您自己的回應合成器變得容易。

也許您想自訂在 `tree_summarize` 的每個步驟中使用的模板，或者也許有新的研究論文詳細說明了生成回應的新方法，您可以創建自己的回應合成器並將其插入任何查詢引擎中，或單獨使用它。

以下我們展示了 `__init__()` 函式，以及每個回應合成器必須實作的兩個抽象方法。基本要求是處理查詢和文本區塊，並回傳一個字串（或字串生成器）回應。

```
from llama_index.core import Settings




class BaseSynthesizer(ABC):
    """Response builder class."""


    def __init__(
        self,
        llm: Optional[LLM] = None,
        streaming: bool = False,
    ) -> None:
        """Init params."""
        self._llm = llm or Settings.llm
        self._callback_manager = Settings.callback_manager
        self._streaming = streaming


    @abstractmethod
    def get_response(
        self,
        query_str: str,
        text_chunks: Sequence[str],
        **response_kwargs: Any,
    ) -> RESPONSE_TEXT_TYPE:
        """Get response."""
        ...


    @abstractmethod
    async def aget_response(
        self,
        query_str: str,
        text_chunks: Sequence[str],
        **response_kwargs: Any,
    ) -> RESPONSE_TEXT_TYPE:
        """Get response."""
        ...
```

## 使用結構化答案過濾 (Using Structured Answer Filtering)

當使用 `"refine"` 或 `"compact"` 回應合成模組時，您可能會發現嘗試 `structured_answer_filtering` 選項是有益的。

```
from llama_index.core import get_response_synthesizer


response_synthesizer = get_response_synthesizer(structured_answer_filtering=True)
```

當將 `structured_answer_filtering` 設定為 `True` 時，我們的 refine 模組能夠過濾掉任何與所問問題無關的輸入 nodes。這對於涉及從外部 vector store 檢索特定使用者查詢的 RAG-based Q\&A 系統特別有用。

如果您正在使用支援 function calling 的 [OpenAI 模型](https://openai.com/blog/function-calling-and-other-api-updates)，此選項特別有用。其他沒有原生 function calling 支援的 LLM 提供者或模型，在產生此功能所依賴的結構化回應方面可能不太可靠。

## 使用自訂提示模板（帶有額外變數）(Using Custom Prompt Templates (with additional variables))

您可能想自訂回應合成器中使用的提示，並在查詢時添加額外的變數。

您可以在 `**kwargs` 中為 `get_response` 指定這些額外變數。

例如，

```
from llama_index.core import PromptTemplate
from llama_index.core.response_synthesizers import TreeSummarize


# NOTE: we add an extra tone_name variable here
qa_prompt_tmpl = (
    "Context information is below.\n"
    "---------------------\n"
    "{context_str}\n"
    "---------------------\n"
    "Given the context information and not prior knowledge, "
    "answer the query.\n"
    "Please also write the answer in the tone of {tone_name}.\n"
    "Query: {query_str}\n"
    "Answer: "
)
qa_prompt = PromptTemplate(qa_prompt_tmpl)


# initialize response synthesizer
summarizer = TreeSummarize(verbose=True, summary_template=qa_prompt)


# get response
response = summarizer.get_response(
    "who is Paul Graham?", [text], tone_name="a Shakespeare play"
)
```

## 模組 (Modules)

請參閱完整的 [module guide](/python/framework/module_guides/querying/response_synthesizers/response_synthesizers/) 以獲取更多詳細資訊。