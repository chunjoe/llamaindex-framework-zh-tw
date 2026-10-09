---
title: "使用 Graphsignal 進行追蹤"
---

[Graphsignal](https://graphsignal.com/) 為由 AI agents 和 LLM 驅動的應用程式提供可觀察性。它幫助開發人員確保 AI 應用程式按預期運行，並讓使用者獲得最佳體驗。

Graphsignal **自動**追蹤和監控 LlamaIndex。Trace 和 metrics 提供查詢、檢索和 index 操作的執行細節。這些洞察包括 **prompts**、**completions**、**embedding statistics**、**retrieved nodes**、**parameters**、**latency** 和 **exceptions**。

當使用 OpenAI APIs 時，Graphsignal 提供額外的洞察，例如每個部署、模型或任何上下文的 **token counts** 和 **costs**。

### 安裝與設定

新增 [Graphsignal tracer](https://github.com/graphsignal/graphsignal-python) 很簡單，只需安裝並設定即可：

Terminal 視窗

```
pip install graphsignal
```

```
import graphsignal


# Provide an API key directly or via GRAPHSIGNAL_API_KEY environment variable
graphsignal.configure(
    api_key="my-api-key", deployment="my-llama-index-app-prod"
)
```

您可以在 [此處](https://app.graphsignal.com/) 取得一個 API key。

請參閱 [快速入門指南](https://graphsignal.com/docs/guides/quick-start/)、[整合指南](https://graphsignal.com/docs/integrations/llama-index/) 和 [example app](https://github.com/graphsignal/examples/blob/main/llama-index-app/main.py) 以獲取更多資訊。

### 追蹤其他功能

若要額外追蹤任何 function 或 code，您可以使用 decorator 或 context manager：

```
with graphsignal.start_trace("load-external-data"):
    reader.load_data()
```

請參閱 [Python API Reference](https://graphsignal.com/docs/reference/python-api/) 以獲取完整說明。

### 有用的連結

- [Tracing 與監控 LlamaIndex Applications](https://graphsignal.com/blog/tracing-and-monitoring-llama-index-applications/)
- [Monitor OpenAI API Latency，Tokens， 速率限制，以及 More](https://graphsignal.com/blog/monitor-open-ai-api-latency-tokens-rate-limits-and-more/)
- [OpenAI API Cost Tracking: 依據以下項目分析費用： 模型、部署與 Context](https://graphsignal.com/blog/open-ai-api-cost-tracking-analyzing-expenses-by-model-deployment-and-context/)