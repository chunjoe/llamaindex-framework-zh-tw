---
title: "可觀察性"
---

LlamaIndex 提供 **一鍵式可觀察性** 🔭，協助你在正式環境中打造可靠、可掌握的 LLM 應用程式。

要以資料為基礎（例如 RAG 系統或代理程式）可靠地開發 LLM 應用程式，關鍵在於能夠觀察、偵錯並評估整個系統及其中的每個元件。

這項功能可讓你將 LlamaIndex 程式庫輕鬆整合至合作夥伴提供的強大可觀測性與評估工具。只要設定一次變數，就能使用下列功能：

- 查看 LLM／提示的輸入與輸出
- 確認各元件（例如 LLM、嵌入模型）的輸出是否符合預期
- 查看索引與查詢流程的呼叫追蹤

各家服務的功能各有相同與不同之處，請參閱下方各整合的完整指南。

**注意：**

自 v0.10.20 起，可觀測性功能改由 [`instrumentation` 模組](/python/framework/module_guides/observability/instrumentation/)負責。

本頁提到的許多工具與整合仍使用舊版 `CallbackManager`，或未使用 `set_global_handler`。我們已為這些整合加上標示。

## 使用方式

通常只要執行以下步驟即可啟用：

```
from llama_index.core import set_global_handler


# general usage
set_global_handler("<handler_name>", **kwargs)
```

所有 `kwargs` 都會傳給 `set_global_handler`，再由底層 callback handler 處理。

就這麼簡單！執行過程會自動傳送至下游服務，你便能查看應用程式的執行追蹤等資訊。

## 整合服務

### OpenTelemetry

[OpenTelemetry](https://opentelemetry.io/) 是廣泛使用的開放原始碼追蹤與可觀測性服務，並可整合多種後端，例如 Jaeger、Zipkin 和 Prometheus。

我們的 OpenTelemetry 整合會追蹤 LlamaIndex 程式碼所產生的所有事件，包括 LLM、代理程式、RAG 管線元件等。你可以將 LlamaIndex 原生儀表化功能所產生的所有資料匯出為 OpenTelemetry 格式。

請安裝此程式庫：

終端機視窗

```
pip install llama-index-observability-otel
```

以下範例示範如何使用預設設定，將它用於 RAG 管線：

```
from llama_index.observability.otel import LlamaIndexOpenTelemetry
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
from llama_index.llms.openai import OpenAI
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core import Settings


# initialize the instrumentation object
instrumentor = LlamaIndexOpenTelemetry()


if __name__ == "__main__":
    embed_model = OpenAIEmbedding(model_name="text-embedding-3-small")
    llm = OpenAI(model="gpt-4.1-mini")


    # start listening!
    instrumentor.start_registering()


    # register events
    documents = SimpleDirectoryReader(
        input_dir="./data/paul_graham/"
    ).load_data()


    index = VectorStoreIndex.from_documents(documents, embed_model=embed_model)
    query_engine = index.as_query_engine(llm=llm)


    query_result_one = query_engine.query("Who is Paul?")
    query_result_two = query_engine.query("What did Paul do?")
```

你也可以採用更複雜且經過客製化的設定，例如以下範例：

```
import json
from pydantic import BaseModel, Field
from typing import List


from llama_index.observability.otel import LlamaIndexOpenTelemetry
from opentelemetry.exporter.otlp.proto.http.trace_exporter import (
    OTLPSpanExporter,
)


# define a custom span exporter
span_exporter = OTLPSpanExporter("http://0.0.0.0:4318/v1/traces")


# initialize the instrumentation object
instrumentor = LlamaIndexOpenTelemetry(
    service_name_or_resource="my.test.service.1",
    span_exporter=span_exporter,
    debug=True,
)




if __name__ == "__main__":
    instrumentor.start_registering()
    # ... your code here
```

我們也提供一個[示範儲存庫](https://github.com/run-llama/agents-observability-demo)，示範如何追蹤代理式工作流程，並將記錄的追蹤資料傳送至 Postgres 資料庫。

### LlamaTrace（Arize Phoenix 代管版）

我們與 [Arize AI](https://arize.com/?utm_source=llamaindex-docs\&utm_medium=partner\&utm_campaign=partner-docs\&utm_content=observability-arize-phoenix) 合作推出 [LlamaTrace](https://llamatrace.com/)，這是一套代管式追蹤、可觀測性與評估平台，原生支援 LlamaIndex 開放原始碼使用者，也整合了 LlamaParse（原名 LlamaCloud）。

此平台以開放原始碼專案 [Arize Phoenix](https://arize.com/phoenix/) 為基礎。Phoenix 以筆記本為核心，提供下列功能來監控模型與 LLM 應用程式：

- LLM 追蹤：追蹤 LLM 應用程式的執行過程，了解內部運作方式，並排查檢索或工具執行等問題。
- LLM 評估：運用大型語言模型評估生成式模型或應用程式的相關性、毒性等品質。

若團隊需要用於正式環境 AI 系統的代管雲端服務或企業自架可觀測性與評估方案，[Arize AX](https://arize.com/products/ax/) 也能接收 LlamaIndex 的 OpenInference 追蹤資料。

#### 使用方式

請安裝整合套件：`pip install -U llama-index-callbacks-arize-phoenix`。

接著在 LlamaTrace 建立帳戶：<https://llamatrace.com/login>。建立 API 金鑰，並將它填入下方的 `PHOENIX_API_KEY` 變數。

然後執行以下程式碼：

```
# Phoenix can display in real time the traces automatically
# collected from your LlamaIndex application.
# Run all of your LlamaIndex applications as usual and traces
# will be collected and displayed in Phoenix.


# setup Arize Phoenix for logging/observability
import llama_index.core
import os


PHOENIX_API_KEY = "<PHOENIX_API_KEY>"
os.environ["OTEL_EXPORTER_OTLP_HEADERS"] = f"api_key={PHOENIX_API_KEY}"
llama_index.core.set_global_handler(
    "arize_phoenix", endpoint="https://llamatrace.com/v1/traces"
)


...
```

#### 指南

- [使用 Arize AX 追蹤 LlamaIndex](https://arize.com/docs/ax/integrations/python-agent-frameworks/llamaindex/llamaindex-tracing)
- [Arize 代理程式評估指南](https://arize.com/guides/ai-agent-handbook/agent-evaluation/)
- [Arize LLM 評估指南](https://arize.com/resources/llm-evaluation/)

![](/assets/0c92da03599d.png)

### SigNoz

[SigNoz](https://signoz.io/) 是開放原始碼的可觀測性框架，以 OpenTelemetry 為基礎，在同一個介面中提供追蹤、日誌與指標，也支援自架及雲端部署。將 SigNoz 與 LlamaIndex 搭配使用後，你可以查看所有 RAG 與代理程式工作流程的詳細追蹤，並監控 token 使用量、延遲、錯誤率、LLM 模型分布等重要指標。

#### 使用方式

安裝以下相依套件：

終端機視窗

```
pip install \
  opentelemetry-distro \
  opentelemetry-exporter-otlp \
  opentelemetry-instrumentation-httpx \
  opentelemetry-instrumentation-system-metrics \
  llama-index \
  openinference-instrumentation-llama-index
```

接著加入自動儀表化設定：

終端機視窗

```
opentelemetry-bootstrap --action=install
```

然後透過自動儀表化執行 LlamaIndex 應用程式：

終端機視窗

```
OTEL_RESOURCE_ATTRIBUTES="service.name=<service_name>" \
OTEL_EXPORTER_OTLP_ENDPOINT="https://ingest.<region>.signoz.cloud:443" \
OTEL_EXPORTER_OTLP_HEADERS="signoz-ingestion-key=<your_ingestion_key>" \
OTEL_EXPORTER_OTLP_PROTOCOL=grpc \
OTEL_TRACES_EXPORTER=otlp \
OTEL_METRICS_EXPORTER=otlp \
OTEL_LOGS_EXPORTER=otlp \
OTEL_PYTHON_LOG_CORRELATION=true \
OTEL_PYTHON_LOGGING_AUTO_INSTRUMENTATION_ENABLED=true \
opentelemetry-instrument <your_run_command>
```

- `<service_name>` 是你的服務名稱
- 將 `<region>` 設為符合你所用 SigNoz Cloud [區域](https://signoz.io/docs/ingestion/signoz-cloud/overview/#endpoint)的值
- 將 `<your_ingestion_key>` 換成你的 SigNoz [資料匯入金鑰](https://signoz.io/docs/ingestion/signoz-cloud/keys/)
- 將 `<your_run_command>` 換成實際用來執行應用程式的命令，例如：`python main.py`

> 📌 注意：如果使用自架 SigNoz，大多數步驟都相同。請依照[雲端版轉自架版指南](https://signoz.io/docs/ingestion/cloud-vs-self-hosted/#cloud-to-self-hosted)更新端點，並移除資料匯入金鑰標頭。

完成後，你就能在 SigNoz 中查看 LlamaIndex 應用程式自動或手動匯出的追蹤、日誌與指標。

![LlamaIndex 追蹤檢視畫面](/assets/6f9e43bb39a0.webp)

#### 範例指南

- [SigNoz LlamaIndex 整合文件](https://signoz.io/docs/llamaindex-observability/)
- [SigNoz LlamaIndex 問答 RAG 示範](https://github.com/SigNoz/llamaindex-rag-opentelemetry-demo)

### Weights and Biases（W\&B）Weave

[W\&B Weave](https://weave-docs.wandb.ai/) 是用於追蹤、實驗、評估、部署及改進 LLM 應用程式的框架。Weave 著重可擴充性與彈性，支援應用程式開發流程的各個階段。

#### 使用方式

此整合會使用 LlamaIndex 的 [`instrumentation` 模組](/python/framework/module_guides/observability/instrumentation/)將 spans／事件註冊為 Weave 呼叫。Weave 預設會自動修補並追蹤[常見 LLM 程式庫與框架](https://weave-docs.wandb.ai/guides/integrations/)中的呼叫。

安裝 `weave` 程式庫：

終端機視窗

```
pip install weave
```

取得 W\&B API 金鑰：

如果你還沒有 W\&B 帳戶，請前往 <https://wandb.ai> 建立帳戶，並從 <https://wandb.ai/authorize> 複製 API 金鑰。系統要求驗證時，請輸入該金鑰。

```
import weave
from llama_index.llms.openai import OpenAI


# Initialize Weave with your project name
weave.init("llamaindex-demo")


# All LlamaIndex operations are now automatically traced
llm = OpenAI(model="gpt-4o-mini")
response = llm.complete("William Shakespeare is ")
print(response)
```

![Weave 快速入門](/assets/6bb73aeada87.png)

追蹤資料包含執行時間、token 使用量、成本、輸入／輸出、錯誤、巢狀操作及串流資料。若不熟悉 Weave 追蹤，可參閱[導覽說明](https://weave-docs.wandb.ai/guides/tracking/trace-tree)。

如果自訂函式沒有被追蹤，請使用 [`@weave.op()`](https://weave-docs.wandb.ai/guides/tracking/ops) 裝飾它。

你也可以透過 `autopatch_settings` 參數控制 `weave.init` 的修補行為。例如，若不想追蹤某個程式庫或框架，可以像下方這樣停用：

```
weave.init(..., autopatch_settings={"openai": {"enabled": False}})
```

不需要額外設定 LlamaIndex；呼叫 `weave.init()` 後便會開始追蹤。

#### 指南

LlamaIndex 整合幾乎支援所有元件，包括串流／非同步、補全、聊天、工具呼叫、代理程式、工作流程及 RAG。詳情請參閱官方 [W\&B Weave × LlamaIndex](https://weave-docs.wandb.ai/guides/integrations/llamaindex) 文件。

### MLflow

[MLflow](https://mlflow.org/docs/latest/llms/tracing/index.html) 是開放原始碼的 MLOps／LLMOps 平台，涵蓋機器學習專案的完整生命週期，讓每個階段都能管理、追蹤並重現。**MLflow Tracing** 是以 OpenTelemetry 為基礎的追蹤功能，支援一鍵儀表化 LlamaIndex 應用程式。

#### 使用方式

MLflow 是開放原始碼專案，不必建立帳戶或設定 API 金鑰即可開始使用。安裝 MLflow 套件後，直接執行程式碼即可！

```
import mlflow


mlflow.llama_index.autolog()  # Enable mlflow tracing
```

![](/assets/6ee509e6bd93.gif)

#### 指南

MLflow 的 LlamaIndex 整合也提供實驗追蹤、評估、相依性管理等功能。詳情請參閱 [MLflow 文件](https://mlflow.org/docs/latest/llms/llama-index/index.html)。

#### 支援項目表

MLflow Tracing 支援 LlamaIndex 的所有主要功能。部分新功能（例如 [AgentWorkflow](https://www.llamaindex.ai/blog/introducing-agentworkflow-a-powerful-system-for-building-ai-agent-systems)）需要 MLflow 2.18.0 以上版本。

| 串流 | 非同步 | 引擎 | 代理程式 | 工作流程 | AgentWorkflow |
| --------- | ----- | ------ | ------ | ----------- | ------------- |
| ✅         | ✅     | ✅      | ✅      | ✅ (>= 2.18) | ✅ (>= 2.18)   |

### OpenLLMetry

[OpenLLMetry](https://github.com/traceloop/openllmetry) 是以 OpenTelemetry 為基礎的開放原始碼專案，可追蹤及監控 LLM 應用程式。它能連接[各大可觀測性平台](https://www.traceloop.com/docs/openllmetry/integrations/introduction)，並可在幾分鐘內完成安裝。

#### 使用方式

```
from traceloop.sdk import Traceloop


Traceloop.init()
```

#### 指南

- [OpenLLMetry](https://developers.llamaindex.ai/python/examples/observability/openllmetry/index.md)

![](/assets/1eb4712d8961.png)

### Arize Phoenix（本機）

你也可以透過開放原始碼專案，在本機執行 Phoenix。

使用本機版本時，不需要建立 LlamaTrace 帳戶，也不必為 Phoenix 設定 API 金鑰；Phoenix 伺服器會在本機啟動。

若要在開發期間使用開放原始碼工具檢視資料，請採用本機 Phoenix 工作流程。正式環境團隊若需要代管雲端或企業自架的可觀測性與評估服務，請參閱 [Arize AX](https://arize.com/products/ax/)。

#### 使用方式

請安裝整合套件：`pip install -U llama-index-callbacks-arize-phoenix`。

然後執行以下程式碼：

```
# Phoenix can display in real time the traces automatically
# collected from your LlamaIndex application.
# Run all of your LlamaIndex applications as usual and traces
# will be collected and displayed in Phoenix.


import phoenix as px


# Look for a URL in the output to open the App in a browser.
px.launch_app()
# The App is initially empty, but as you proceed with the steps below,
# traces will appear automatically as your LlamaIndex application runs.


import llama_index.core


llama_index.core.set_global_handler("arize_phoenix")
...
```

#### 範例指南

- [Pinecone 與 Arize Phoenix 自動檢索指南](https://docs.llamaindex.ai/en/latest/examples/vector_stores/pinecone_auto_retriever/?h=phoenix)
- [Arize Phoenix 追蹤教學](https://colab.research.google.com/github/Arize-ai/phoenix/blob/main/tutorials/tracing/llama_index_tracing_tutorial.ipynb)

### Langfuse 🪢

[Langfuse](https://langfuse.com/docs) 是開放原始碼的 LLM 工程平台，協助團隊共同偵錯、分析並反覆改進 LLM 應用程式。整合 Langfuse 後，你可以追蹤並監控 LlamaIndex 應用程式的效能、追蹤資料與指標。系統會詳細記錄脈絡增補和 LLM 查詢流程的[追蹤資料](https://langfuse.com/docs/tracing)，並可直接在 Langfuse 介面中檢視。

#### 使用方式

請確認已安裝 `llama-index` 和 `langfuse`。

終端機視窗

```
pip install llama-index langfuse openinference-instrumentation-llama-index
```

接著設定 Langfuse API 金鑰。你可以註冊免費的 [Langfuse Cloud](https://cloud.langfuse.com/) 帳戶，或[自行代管 Langfuse](https://langfuse.com/self-hosting)以取得金鑰。Langfuse 用戶端會使用這些環境變數進行驗證，並將資料傳送至你的 Langfuse 專案。

```
import os


# Get keys for your project from the project settings page: https://cloud.langfuse.com


os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..."
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..."
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com"  # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region
```

設定好環境變數後，就可以初始化 Langfuse 用戶端。`get_client()` 會使用環境變數中的憑證初始化用戶端。

```
from langfuse import get_client


langfuse = get_client()


# Verify connection
if langfuse.auth_check():
    print("Langfuse client is authenticated and ready!")
else:
    print("Authentication failed. Please check your credentials and host.")
```

接著初始化[OpenInference LlamaIndex 儀表化工具](https://docs.arize.com/phoenix/tracing/integrations-tracing/llamaindex)。這項第三方儀表化工具會自動擷取 LlamaIndex 操作，並將 OpenTelemetry（OTel）spans 匯出至 Langfuse。

```
from openinference.instrumentation.llama_index import LlamaIndexInstrumentor


# Initialize LlamaIndex instrumentation
LlamaIndexInstrumentor().instrument()
```

現在就能在 Langfuse 中查看 LlamaIndex 應用程式的日誌：

[LlamaIndex 範例追蹤](https://langfuse.com/images/cookbook/integration-llamaindex-workflows/llamaindex-trace.gif)

*[Langfuse 範例追蹤連結](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/6f554d6b-a2bc-4fba-904f-aa54de2897ca?display=preview)*

#### 範例指南

- [Langfuse 文件](https://langfuse.com/docs/integrations/llama-index/get-started)
- [追蹤 LlamaIndex 代理程式](https://langfuse.com/docs/integrations/llama-index/workflows)

### Literal AI

[Literal AI](https://literalai.com/) 是用於 LLM 評估與可觀測性的解決方案，協助工程與產品團隊更可靠、更快速且大規模地推出 LLM 應用程式。它透過協作開發流程提供提示工程、LLM 可觀測性、LLM 評估及監控功能。對話執行緒與代理程式執行記錄都能自動記錄到 Literal AI。

若要快速試用 Literal AI，請先在[雲端服務](https://cloud.getliteral.ai/)註冊。接著前往 **Settings** 取得 API 金鑰，就能開始記錄資料。

#### 使用方式

- 安裝 Literal AI Python SDK：`pip install literalai`
- 在 Literal AI 專案的 **Settings** 頁面取得 API 金鑰
- 若使用自行代管的 Literal AI，也請記下其基底 URL

接著在應用程式程式碼中加入以下內容：

```
from llama_index.core import set_global_handler


# You should provide your Literal AI API key and base url using the following environment variables:
# LITERAL_API_KEY, LITERAL_API_URL
set_global_handler("literalai")
```

#### 範例指南

- [Llama Index 與 Literal AI 整合](https://docs.getliteral.ai/integrations/llama-index)
- [使用 LlamaIndex 建立問答應用程式並透過 Literal AI 監控](https://github.com/Chainlit/literal-cookbook/blob/main/python/llamaindex-integration)

### Comet Opik

[Opik](https://www.comet.com/docs/opik/?utm_source=llama-index\&utm_medium=docs\&utm_campaign=opik\&utm_content=home_page) 是 Comet 推出的開放原始碼端對端 LLM 評估平台。

若要開始使用，請先在 [Comet](https://www.comet.com/signup?from=llm\&utm_medium=github\&utm_source=llama-index\&utm_campaign=opik) 註冊帳戶並取得 API 金鑰。

#### 使用方式

- 安裝 Opik Python SDK：`pip install opik`
- 在 Opik 的使用者選單中取得 API 金鑰。
- 若使用自行代管的 Opik，也請記下其基底 URL。

若使用[自行代管的 Opik](https://www.comet.com/docs/opik/self-host/self_hosting_opik)，可以透過環境變數 `OPIK_API_KEY`、`OPIK_WORKSPACE` 和 `OPIK_URL_OVERRIDE` 設定 Opik。請執行以下程式碼：

終端機視窗

```
export OPIK_API_KEY="<OPIK_API_KEY>"
export OPIK_WORKSPACE="<OPIK_WORKSPACE - Often the same as your API key>"


# Optional
#export OPIK_URL_OVERRIDE="<OPIK_URL_OVERRIDE>"
```

設定全域 handler 後，就能在 LlamaIndex 中使用 Opik 整合：

```
from llama_index.core import Document, VectorStoreIndex, set_global_handler


# You should provide your OPIK API key and Workspace using the following environment variables:
# OPIK_API_KEY, OPIK_WORKSPACE
set_global_handler(
    "opik",
)


# This example uses OpenAI by default so don't forget to set an OPENAI_API_KEY
index = VectorStoreIndex.from_documents([Document.example()])
query_engine = index.as_query_engine()


questions = [
    "Tell me about LLMs",
    "How do you fine-tune a neural network ?",
    "What is RAG ?",
]


for question in questions:
    print(f"> \033[92m{question}\033[0m")
    response = query_engine.query(question)
    print(response)
```

你會在 Opik 中看到如下追蹤資料：

![LlamaIndex 的 Opik 整合](/assets/00e16bcec85f.png)

#### 範例指南

- [LlamaIndex 與 Opik 文件](https://www.comet.com/docs/opik/tracing/integrations/llama_index?utm_source=llamaindex\&utm_medium=docs\&utm_campaign=opik)
- [LlamaIndex 整合範例手冊](https://www.comet.com/docs/opik/cookbook/llama-index?utm_source=llama-index\&utm_medium=docs\&utm_campaign=opik)

### Argilla

[Argilla](https://github.com/argilla-io/argilla) 是供 AI 工程師與領域專家協作的工具，可協助他們為專案建立高品質資料集。

若要開始使用，請先部署 Argilla 伺服器。如果尚未部署，可依照[快速入門指南](https://docs.argilla.io/latest/getting_started/quickstart/)輕鬆完成。

#### 使用方式

- 安裝 Argilla 的 LlamaIndex 整合套件：`pip install argilla-llama-index`
- 初始化 ArgillaHandler。`<api_key>` 可在 Argilla Space 的 `My Settings` 頁面取得；請確認你是以建立該 Space 的 `owner` 帳戶登入。`<api_url>` 則是瀏覽器網址列顯示的 URL。
- 將 ArgillaHandler 加入 dispatcher。

```
from llama_index.core.instrumentation import get_dispatcher
from argilla_llama_index import ArgillaHandler


argilla_handler = ArgillaHandler(
    dataset_name="query_llama_index",
    api_url="http://localhost:6900",
    api_key="argilla.apikey",
    number_of_retrievals=2,
)
root_dispatcher = get_dispatcher()
root_dispatcher.add_span_handler(argilla_handler)
root_dispatcher.add_event_handler(argilla_handler)
```

#### 範例指南

- [開始使用 Argilla 的 LlamaIndex 整合](https://github.com/argilla-io/argilla-llama-index/blob/main/docs/tutorials/getting_started.ipynb)
- [其他範例教學](https://github.com/argilla-io/argilla-llama-index/tree/main/docs/tutorials)

![LlamaIndex 的 Argilla 整合](/assets/897dccc33ed5.png)

### Agenta

[Agenta](https://agenta.ai/) 是開放原始碼的 LLMOps 平台，協助開發者與產品團隊打造穩健的 LLM AI 應用程式，並提供**可觀測性**、**提示管理與工程**及**LLM 評估**等工具。

#### 使用方式

安裝整合所需的相依套件：

終端機視窗

```
pip install agenta llama-index openinference-instrumentation-llama-index
```

設定 API 憑證並初始化 Agenta：

```
import os
import agenta as ag
from openinference.instrumentation.llama_index import LlamaIndexInstrumentor


# Set your Agenta credentials
os.environ["AGENTA_API_KEY"] = "your_agenta_api_key"
os.environ[
    "AGENTA_HOST"
] = "https://cloud.agenta.ai"  # Use your self-hosted URL if applicable


# Initialize Agenta SDK
ag.init()


# Enable LlamaIndex instrumentation
LlamaIndexInstrumentor().instrument()
```

建立已加入儀表化的應用程式：

```
@ag.instrument()
def document_search_app(user_query: str):
    """
    Document search application using LlamaIndex.
    Loads documents, builds a searchable index, and answers user queries.
    """
    # Load documents from local directory
    docs = SimpleDirectoryReader("data").load_data()


    # Build vector search index
    search_index = VectorStoreIndex.from_documents(docs)


    # Initialize query processor
    query_processor = search_index.as_query_engine()


    # Process user query
    answer = query_processor.query(user_query)


    return answer
```

完成設定後，Agenta 會自動擷取所有執行步驟。你可以在 Agenta 中查看追蹤資料以偵錯應用程式、連結特定設定與提示、評估執行成效、查詢資料，以及監控重要指標。

![LlamaIndex 的 Agenta 整合](/assets/972b606d9b71.png)

#### 範例指南

- [使用 Agenta 為 LlamaIndex 加入可觀測性（文件）](https://docs.agenta.ai/observability/integrations/llamaindex)
- [使用 Agenta 為 LlamaIndex 加入可觀測性（筆記本）](https://github.com/agenta-ai/agenta/blob/main/examples/jupyter/integrations/observability-openinference-llamaindex.ipynb)

### Confident AI

[Confident AI](https://www.confident-ai.com/) 是 LLM 可觀測性與評估平台。它的 OpenTelemetry 原生追蹤 SDK [`confident-trace`](https://github.com/confident-ai/confident-trace) 會訂閱 LlamaIndex 的儀表化 dispatcher，因此每次代理程式執行、工作流程步驟、檢索及工具呼叫，都會連同完整階層顯示在 [Observatory](https://www.confident-ai.com/docs/llm-tracing/introduction) 中。

#### 使用方式

終端機視窗

```
pip install confident-trace llama-index-core llama-index-llms-openai
```

從 [Confident AI](https://app.confident-ai.com/) 取得專案 API 金鑰，並與模型供應商的金鑰一同設定。若位於歐盟區域，請設定 `CONFIDENT_OTEL_ENDPOINT="https://eu.otel.confident-ai.com/v1/traces"`；否則追蹤資料會傳送至美國伺服器。

終端機視窗

```
export CONFIDENT_API_KEY="<your-confident-api-key>"
export OPENAI_API_KEY="<your-openai-key>"
```

請在定義或執行代理程式前，於程式啟動時呼叫一次 `init()`。維持原本的 `agent.run` 呼叫即可，不必設定任何 handler 或 dispatcher：

```
import asyncio


from confident_trace import init, shutdown
from llama_index.core.agent.workflow import FunctionAgent
from llama_index.core.tools import FunctionTool
from llama_index.llms.openai import OpenAI




def multiply(a: float, b: float) -> float:
    """Useful for multiplying two numbers."""
    return a * b




async def main():
    init()
    try:
        agent = FunctionAgent(
            name="assistant",
            llm=OpenAI(model="gpt-4o-mini"),
            tools=[FunctionTool.from_defaults(multiply)],
            system_prompt="You are a helpful assistant that can perform calculations.",
        )
        print(await agent.run("What is 3 * 12?"))
    finally:
        shutdown()




if __name__ == "__main__":
    asyncio.run(main())
```

代理程式執行、工作流程步驟、檢索、工具呼叫及模型呼叫（包含[token 使用量](https://www.confident-ai.com/docs/llm-tracing/features/token-usage-cost)）都會自動擷取。模型 spans 需要使用受支援的供應商 SDK；自訂或本機模型包裝器只會顯示代理程式結構，不會產生 LLM spans，嵌入呼叫也不會追蹤。對長時間執行的伺服器，請在啟動時呼叫 `init()`，並於正常關閉時呼叫 `shutdown()`，不要每次請求都呼叫。

你可以在 Confident AI 的[工作流程頁面](https://www.confident-ai.com/docs/llm-tracing/workflows)設定收到追蹤資料後要執行的動作：

![Confident AI 工作流程頁面](/assets/2778ce4ebe5b.png)

- **評估規則**：使用[指標集合](https://www.confident-ai.com/docs/metrics/metric-collections)評估收到的追蹤資料。
- **分類器**：依問題、情緒或你定義的維度替追蹤資料加上標籤，之後即可分組或篩選。
- **佇列匯入**：將正式環境的追蹤資料送入標註佇列，交由內部審查團隊處理。
- **資料集匯入**：將正式環境的追蹤資料收集至資料集，做為日後測試案例。

追蹤資料、span 與執行緒各自都有工作流程。若要直接從程式碼將指標集合套用到單筆追蹤資料，請將它傳入 `update_trace`。

#### 範例指南

- [LlamaIndex 整合指南](https://www.confident-ai.com/docs/integrations/third-party/llama-index)：完整設定方式、追蹤屬性，以及如何將多次執行分組到執行緒
- [Confident AI 的 LLM 追蹤](https://www.confident-ai.com/docs/llm-tracing/introduction)
- [線上評估](https://www.confident-ai.com/docs/llm-tracing/online-evals)
- **需要整合協助嗎？**[聯絡我們](https://www.confident-ai.com/book-a-demo)

### Maxim AI

[Maxim AI](https://www.getmaxim.ai/) 是代理程式模擬、評估與可觀測性平台，協助開發者打造、監控並改進 LLM 應用程式。Maxim 與 LlamaIndex 的整合可為 RAG 系統、代理程式及其他 LLM 工作流程提供完整的追蹤、監控與評估功能。

#### 使用方式

安裝必要套件：

終端機視窗

```
pip install maxim-py
```

設定環境變數：

```
import os
from dotenv import load_dotenv


# Load environment variables from .env file
load_dotenv()


# Get environment variables
MAXIM_API_KEY = os.getenv("MAXIM_API_KEY")
MAXIM_LOG_REPO_ID = os.getenv("MAXIM_LOG_REPO_ID")


# Verify required environment variables are set
if not MAXIM_API_KEY:
    raise ValueError("MAXIM_API_KEY environment variable is required")
if not MAXIM_LOG_REPO_ID:
    raise ValueError("MAXIM_LOG_REPO_ID environment variable is required")
```

初始化 Maxim 並為 LlamaIndex 加入儀表化：

```
from maxim import Config, Maxim
from maxim.logger import LoggerConfig
from maxim.logger.llamaindex import instrument_llamaindex


# Initialize Maxim logger
maxim = Maxim(Config(api_key=os.getenv("MAXIM_API_KEY")))
logger = maxim.logger(LoggerConfig(id=os.getenv("MAXIM_LOG_REPO_ID")))


# Instrument LlamaIndex with Maxim observability
# Set debug=True to see detailed logs during development
instrument_llamaindex(logger, debug=True)


print("✅ Maxim instrumentation enabled for LlamaIndex")
```

完成後，LlamaIndex 應用程式就會自動將追蹤資料傳送至 Maxim：

```
from llama_index.core.agent import FunctionAgent
from llama_index.core.tools import FunctionTool
from llama_index.llms.openai import OpenAI




# Define tools and create agent
def add_numbers(a: float, b: float) -> float:
    """Add two numbers together."""
    return a + b




add_tool = FunctionTool.from_defaults(fn=add_numbers)
llm = OpenAI(model="gpt-4o-mini", temperature=0)


agent = FunctionAgent(
    tools=[add_tool],
    llm=llm,
    verbose=True,
    system_prompt="You are a helpful calculator assistant.",
)


# This will be automatically logged by Maxim instrumentation
import asyncio


response = await agent.run("What is 15 + 25?")
print(f"Response: {response}")
```

#### 指南

- [Maxim 儀表化操作手冊](https://developers.llamaindex.ai/python/examples/observability/maxim-instrumentation/index.md)
- [Maxim AI 文件](https://www.getmaxim.ai/docs/sdk/python/integrations/llamaindex/llamaindex)

![追蹤畫面](/assets/ee1a2161a257.gif)

## 其他合作夥伴的 `One-Click` 整合（舊版模組）

這些合作夥伴整合使用舊版 `CallbackManager` 或第三方呼叫。

### Langfuse

此整合已棄用。建議改用以 instrumentation 為基礎的新 Langfuse 整合，詳情請參閱[此處](https://langfuse.com/docs/integrations/llama-index/get-started)。

#### 使用方式

```
from llama_index.core import set_global_handler


# Make sure you've installed the 'llama-index-callbacks-langfuse' integration package.


# NOTE: Set your environment variables 'LANGFUSE_SECRET_KEY', 'LANGFUSE_PUBLIC_KEY' and 'LANGFUSE_HOST'
# as shown in your langfuse.com project settings.


set_global_handler("langfuse")
```

#### 指南

- [Langfuse 回呼處理常式](https://developers.llamaindex.ai/python/examples/observability/langfusecallbackhandler/index.md)
- [使用 PostHog 追蹤 Langfuse](https://developers.llamaindex.ai/python/examples/observability/langfusemistralposthog/index.md)

![langfuse-tracing](/assets/3cbec68eae3d.gif)

### OpenInference

[OpenInference](https://github.com/Arize-ai/open-inference-spec) 是用於擷取與儲存 AI 模型推論資料的開放標準。它可搭配 [Phoenix](https://github.com/Arize-ai/phoenix) 等 LLM 可觀測性解決方案，協助進行實驗、視覺化及評估 LLM 應用程式。

#### 使用方式

```
import llama_index.core


llama_index.core.set_global_handler("openinference")


# NOTE: No need to do the following
from llama_index.callbacks.openinference import OpenInferenceCallbackHandler
from llama_index.core.callbacks import CallbackManager
from llama_index.core import Settings


# callback_handler = OpenInferenceCallbackHandler()
# Settings.callback_manager = CallbackManager([callback_handler])


# Run your LlamaIndex application here...
for query in queries:
    query_engine.query(query)


# View your LLM app data as a dataframe in OpenInference format.
from llama_index.core.callbacks.open_inference_callback import as_dataframe


query_data_buffer = llama_index.core.global_handler.flush_query_data_buffer()
query_dataframe = as_dataframe(query_data_buffer)
```

**注意：**若要使用 Phoenix 的完整功能，還需要加入其他步驟，將查詢／脈絡資料框架傳入。請見下方說明。

#### 指南

- [OpenInference 回呼處理常式](https://developers.llamaindex.ai/python/examples/observability/openinferencecallback/index.md)
- [使用 Arize Phoenix 評估搜尋與檢索](https://colab.research.google.com/github/Arize-ai/phoenix/blob/main/tutorials/llama_index_search_and_retrieval_tutorial.ipynb)

### TruEra TruLens

TruLens 可透過回饋函式與追蹤等功能，為 LlamaIndex 應用程式加入儀表化並進行評估。

#### 使用方式與指南

```
# use trulens
from trulens_eval import TruLlama


tru_query_engine = TruLlama(query_engine)


# query
tru_query_engine.query("What did the author do growing up?")
```

![](/assets/fece02349b31.png)

#### 指南

- [TruLens 指南](/python/framework/community/integrations/trulens/)
- [LlamaIndex 與 TruLens 快速入門指南](https://github.com/truera/trulens/blob/trulens-eval-0.20.3/trulens_eval/examples/quickstart/llama_index_quickstart.ipynb)
- [Google Colab](https://colab.research.google.com/github/truera/trulens/blob/trulens-eval-0.20.3/trulens_eval/examples/quickstart/llama_index_quickstart.ipynb)

### HoneyHive

HoneyHive 可追蹤任何 LLM 工作流程的執行過程。你可以偵錯與分析追蹤資料，也可以針對特定追蹤事件自訂回饋，將正式環境資料製作成評估或微調資料集。

#### 使用方式

```
from llama_index.core import set_global_handler


set_global_handler(
    "honeyhive",
    project="My HoneyHive Project",
    name="My LLM Workflow Name",
    api_key="MY HONEYHIVE API KEY",
)


# NOTE: No need to do the following
from llama_index.core.callbacks import CallbackManager


# from honeyhive.utils.llamaindex_tracer import HoneyHiveLlamaIndexTracer
from llama_index.core import Settings


# hh_tracer = HoneyHiveLlamaIndexTracer(
#     project="My HoneyHive Project",
#     name="My LLM Workflow Name",
#     api_key="MY HONEYHIVE API KEY",
# )
# Settings.callback_manager = CallbackManager([hh_tracer])
```

![](/assets/f58e2379432c.png) ![](/assets/ab5fa5b17d5f.png) *使用 Perfetto 偵錯與分析 HoneyHive 追蹤資料*

#### 指南

- [HoneyHive 回呼處理常式](https://developers.llamaindex.ai/python/examples/observability/honeyhivellamaindextracer/index.md)

### PromptLayer

PromptLayer 可追蹤 LLM 呼叫的分析資料，並為各種用途標記、分析及評估提示。你可以搭配 LlamaIndex 使用，追蹤 RAG 提示的成效等資訊。

#### 使用方式

```
import os


os.environ["PROMPTLAYER_API_KEY"] = "pl_7db888a22d8171fb58aab3738aa525a7"


from llama_index.core import set_global_handler


# pl_tags are optional, to help you organize your prompts and apps
set_global_handler("promptlayer", pl_tags=["paul graham", "essay"])
```

#### 指南

- [PromptLayer](https://developers.llamaindex.ai/python/examples/observability/promptlayerhandler/index.md)

### Langtrace

[Langtrace](https://github.com/Scale3-Labs/langtrace) 是功能完整的開放原始碼工具，支援 OpenTelemetry，能順暢追蹤、評估及管理 LLM 應用程式。Langtrace 可直接整合 LlamaIndex，提供準確度、評估結果與延遲等效能指標的即時詳細資訊。

#### 安裝

終端機視窗

```
pip install langtrace-python-sdk
```

#### 使用方式

```
from langtrace_python_sdk import (
    langtrace,
)  # Must precede any llm module imports


langtrace.init(api_key="<LANGTRACE_API_KEY>")
```

#### 指南

- [Langtrace](https://docs.langtrace.ai/supported-integrations/llm-frameworks/llamaindex)

### OpenLIT

[OpenLIT](https://github.com/openlit/openlit) 是以 OpenTelemetry 為核心的生成式 AI 與 LLM 應用程式可觀測性工具，只需一行程式碼即可將可觀測性功能整合至生成式 AI 專案。OpenLIT 為多種 LLM、向量資料庫及 LlamaIndex 等框架提供 OpenTelemetry 自動儀表化，並呈現應用程式效能、請求追蹤，以及成本和 token 使用量等整體指標。

#### 安裝

終端機視窗

```
pip install openlit
```

#### 使用方式

```
import openlit


openlit.init()
```

#### 指南

- [OpenLIT 官方文件](https://docs.openlit.io/latest/integrations/llama-index)

### AgentOps

[AgentOps](https://github.com/AgentOps-AI/agentops) 協助開發者建置、評估及監控 AI 代理程式，支援從原型一路推進到正式環境，並提供代理程式監控、LLM 成本追蹤、基準測試等功能。

#### 安裝

終端機視窗

```
pip install llama-index-instrumentation-agentops
```

#### 使用方式

```
from llama_index.core import set_global_handler


# NOTE: Feel free to set your AgentOps environment variables (e.g., 'AGENTOPS_API_KEY')
# as outlined in the AgentOps documentation, or pass the equivalent keyword arguments
# anticipated by AgentOps' AOClient as **eval_params in set_global_handler.


set_global_handler("agentops")
```

### Simple（LLM 輸入／輸出）

這項簡易的可觀測性工具會將每組 LLM 輸入／輸出印到終端機，適合快速為 LLM 應用程式啟用偵錯記錄。

#### 使用方式

```
import llama_index.core


llama_index.core.set_global_handler("simple")
```

#### 指南

- [MLflow](https://mlflow.org/docs/latest/llms/llama-index/index.html)

## 更多可觀測性

- [Callbacks 指南](/python/framework/module_guides/observability/callbacks/)
