---
title: "Databricks"
---

整合 Databricks LLMs APIs。

## 先決條件

- [Databricks personal access token](https://docs.databricks.com/en/dev-tools/auth/pat.html) 以查詢和存取 Databricks model serving endpoints。

- 在 [支援的區域](https://docs.databricks.com/en/machine-learning/model-serving/model-serving-limits.html#regions) 的 [Databricks workspace](https://docs.databricks.com/en/workspace/index.html) 以使用 Foundation Model APIs 的 pay-per-token。

## 設定

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
% pip install llama-index-llms-databricks
```

```
!pip install llama-index
```

```
from llama_index.llms.databricks import Databricks
```

```
None of PyTorch, TensorFlow >= 2.0, or Flax have been found. Models won't be available and only tokenizers, configuration and file/data utilities can be used.
```

終端機視窗

```
export DATABRICKS_TOKEN=<your api key>
export DATABRICKS_SERVING_ENDPOINT=<your api serving endpoint>
```

或者，您可以在初始化時將您的 API key 和 serving endpoint 傳遞給 LLM：

```
llm = Databricks(
    model="databricks-dbrx-instruct",
    api_key="your_api_key",
    api_base="https://[your-work-space].cloud.databricks.com/serving-endpoints/",
)
```

可用的 LLM 模型列表可在此處找到 [此處](https://console.groq.com/docs/models)。

```
response = llm.complete("Explain the importance of open source LLMs")
```

```
print(response)
```

#### 使用訊息列表呼叫 `chat`

```
from llama_index.core.llms import ChatMessage


messages = [
    ChatMessage(
        role="system", content="You are a pirate with a colorful personality"
    ),
    ChatMessage(role="user", content="What is your name"),
]
resp = llm.chat(messages)
```

```
print(resp)
```

### Streaming

使用 `stream_complete` endpoint

```
response = llm.stream_complete("Explain the importance of open source LLMs")
```

```
for r in response:
    print(r.delta, end="")
```

使用 `stream_chat` endpoint

```
from llama_index.core.llms import ChatMessage


messages = [
    ChatMessage(
        role="system", content="You are a pirate with a colorful personality"
    ),
    ChatMessage(role="user", content="What is your name"),
]
resp = llm.stream_chat(messages)
```

```
for r in resp:
    print(r.delta, end="")
```
