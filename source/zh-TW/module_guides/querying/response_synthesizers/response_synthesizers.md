---
title: "回應合成模組"
---

每個回應合成器的詳細輸入/輸出如下。

## API 範例

以下展示如何使用所有 kwargs 的設定。

- `response_mode` 指定要使用的回應合成器
- `service_context` 定義用於合成的 LLM 及相關的 settings
- `text_qa_template` 和 `refine_template` 是在不同階段使用的 prompts
- `use_async` 目前僅用於 `tree_summarize` 回應模式，用於非同步建構 summary tree
- `streaming` 設定是否回傳 streaming response object
- `structured_answer_filtering` 啟用對與特定問題無關的文本 chunk 的主動過濾

在 `synthesize`/`asyntheszie` 函式中，您可以選擇性地提供額外的 source nodes，它將會被加入到 `response.source_nodes` list 中。

```
from llama_index.core.data_structs import Node
from llama_index.core.schema import NodeWithScore
from llama_index.core import get_response_synthesizer


response_synthesizer = get_response_synthesizer(
    response_mode="refine",
    service_context=service_context,
    text_qa_template=text_qa_template,
    refine_template=refine_template,
    use_async=False,
    streaming=False,
)


# synchronous
response = response_synthesizer.synthesize(
    "query string",
    nodes=[NodeWithScore(node=Node(text="text"), score=1.0), ...],
    additional_source_nodes=[
        NodeWithScore(node=Node(text="text"), score=1.0),
        ...,
    ],
)


# asynchronous
response = await response_synthesizer.asynthesize(
    "query string",
    nodes=[NodeWithScore(node=Node(text="text"), score=1.0), ...],
    additional_source_nodes=[
        NodeWithScore(node=Node(text="text"), score=1.0),
        ...,
    ],
)
```

您也可以直接回傳一個 string，使用較底層的 `get_response` 和 `aget_response` 函式

```
response_str = response_synthesizer.get_response(
    "query string", text_chunks=["text1", "text2", ...]
)
```

## 範例 Notebooks

- [Refine](https://developers.llamaindex.ai/python/examples/response_synthesizers/refine/index.md)
- [Structured Refine](https://developers.llamaindex.ai/python/examples/response_synthesizers/structured_refine/index.md)
- [Tree Summarize](https://developers.llamaindex.ai/python/examples/response_synthesizers/tree_summarize/index.md)
- [Custom Prompting](https://developers.llamaindex.ai/python/examples/response_synthesizers/custom_prompt_synthesizer/index.md)