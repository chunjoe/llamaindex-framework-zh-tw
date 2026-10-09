---
title: "串流"
---

LlamaIndex 支援即時串流生成的回應。這讓您在完整回應完成前，就能開始列印或處理回應的開頭部分。這可以大幅降低查詢的感知延遲。

### 設定

要啟用串流，您需要使用支援串流的 LLM。目前，`OpenAI`、`HuggingFaceLLM` 以及大多數 LangChain LLMs（透過 `LangChainLLM`）支援串流。

> 注意：如果 LLM 不支援串流，您選擇的 `NotImplementedError` 將會被提升。

若要設定查詢引擎使用高階的 API 進行串流，在建構查詢引擎時設定 `streaming=True`。

```
query_engine = index.as_query_engine(streaming=True, similarity_top_k=1)
```

如果您使用低階的 API 來組成查詢引擎，在建構 `Response Synthesizer` 時傳遞 `streaming=True`：

```
from llama_index.core import get_response_synthesizer


synth = get_response_synthesizer(streaming=True, ...)
query_engine = RetrieverQueryEngine(response_synthesizer=synth, ...)
```

### 串流回應

在正確設定 LLM 和查詢引擎後，呼叫 `query` 現在會回傳一個 `StreamingResponse` 物件。

```
streaming_response = query_engine.query(
    "What did the author do growing up?",
)
```

當 LLM 呼叫*開始*時，回應會立即回傳，無需等待完整完成。

> 注意：在查詢引擎進行多次 LLM 呼叫的情況下，只有最後一次 LLM 呼叫會被串流，回應在最後一次 LLM 呼叫開始時回傳。

您可以從串流回應中取得一個 `Generator`，並逐一迭代接收到的 tokens：

```
for text in streaming_response.response_gen:
    # do something with text as they arrive.
    pass
```

或者，如果您只是想列印即時到達的文字：

```
streaming_response.print_response_stream()
```

請參閱 [端到端範例](https://developers.llamaindex.ai/python/examples/customization/streaming/simpleindexdemo-streaming/index.md)