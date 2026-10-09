---
title: "Oracle Cloud Infrastructure Data Science"
---

Oracle Cloud Infrastructure [(OCI) Data Science](https://www.oracle.com/artificial-intelligence/data-science) 是一個完全託管的無伺服器平台，讓資料科學團隊能在 Oracle Cloud Infrastructure 中建置、訓練和管理機器學習模型。

它提供 [AI Quick Actions](https://docs.oracle.com/en-us/iaas/data-science/using/ai-quick-actions.htm)，可用於在 OCI Data Science 中部署、評估和微調 foundation LLM 模型。AI Quick Actions 旨在為希望快速利用 AI 功能的使用者提供便利，透過提供一個簡化、無需程式碼且高效的環境來處理 foundation models，擴大 foundation models 的使用範圍。AI Quick Actions 可從 Data Science Notebook 存取。

有關如何使用 AI Quick Actions 在 OCI Data Science 中部署 LLM 模型的詳細文件可在此 [這裡](https://github.com/oracle-samples/oci-data-science-ai-samples/blob/main/ai-quick-actions/model-deployment-tips.md) 和 [這裡](https://docs.oracle.com/en-us/iaas/data-science/using/ai-quick-actions-model-deploy.htm) 查閱。

此 Notebook 解釋了如何使用 OCI 的 Data Science 模型與 LlamaIndex 互動。

## 設定

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-llms-oci-data-science
```

```
!pip install llama-index
```

您還需要安裝 [oracle-ads](https://accelerated-data-science.readthedocs.io/en/latest/index.html) SDK。

```
!pip install -U oracle-ads
```

## 驗證

支援 LlamaIndex 的驗證方法等同於其他 OCI 服務的驗證方法，遵循標準 SDK 驗證方法，特別是 API Key、session token、instance principal 和 resource principal。更多詳細資訊請參閱 [這裡](https://accelerated-data-science.readthedocs.io/en/latest/user_guide/cli/authentication.html)。請確保擁有存取 OCI Data Science Model Deployment endpoint 所需的 [policies](https://docs.oracle.com/en-us/iaas/data-science/using/model-dep-policies-auth.htm)。[oracle-ads](https://accelerated-data-science.readthedocs.io/en/latest/index.html) 有助於簡化 OCI Data Science 中的驗證。

## 基本用法

使用 OCI Data Science AI 提供的 LLMs 與 LlamaIndex，只需將 `OCIDataScience` 介面初始化為您的 Data Science Model Deployment endpoint 和 model ID。預設情況下，AI Quick Actions 中所有部署的模型都會獲得 `odsc-model` ID。然而，此 ID 可在部署期間更改。

#### 使用 prompt 呼叫 `complete`

```
import ads
from llama_index.llms.oci_data_science import OCIDataScience


ads.set_auth(auth="security_token", profile="<replace-with-your-profile>")


llm = OCIDataScience(
    model="odsc-llm",
    endpoint="https://<MD_OCID>/predict",
)
response = llm.complete("Tell me a joke")


print(response)
```

### 使用訊息列表呼叫 `chat`

```
import ads
from llama_index.llms.oci_data_science import OCIDataScience
from llama_index.core.base.llms.types import ChatMessage


ads.set_auth(auth="security_token", profile="<replace-with-your-profile>")


llm = OCIDataScience(
    model="odsc-llm",
    endpoint="https://<MD_OCID>/predict",
)
response = llm.chat(
    [
        ChatMessage(role="user", content="Tell me a joke"),
        ChatMessage(
            role="assistant", content="Why did the chicken cross the road?"
        ),
        ChatMessage(role="user", content="I don't know, why?"),
    ]
)


print(response)
```


## 串流 (Streaming)

**使用專用串流 endpoint**

```
from llama_index.llms.oci_data_science import OCIDataScience
import ads


ads.set_auth(auth="security_token", profile="OC1")


llm = OCIDataScience(
    endpoint="https://<MD_OCID>/predictWithResponseStream",
    model="odsc-llm",
)


prompt = "What is the capital of France?"
response = llm.stream_complete(prompt)
for chunk in response:
    print(chunk.delta, end="")
```

### 使用 `stream_complete` endpoint

```
import ads
from llama_index.llms.oci_data_science import OCIDataScience


ads.set_auth(auth="security_token", profile="<replace-with-your-profile>")


llm = OCIDataScience(
    model="odsc-llm",
    endpoint="https://<MD_OCID>/predict",
)


for chunk in llm.stream_complete("Tell me a joke"):
    print(chunk.delta, end="")
```

### 使用 `stream_chat` endpoint

```
import ads
from llama_index.llms.oci_data_science import OCIDataScience
from llama_index.core.base.llms.types import ChatMessage


ads.set_auth(auth="security_token", profile="<replace-with-your-profile>")


llm = OCIDataScience(
    model="odsc-llm",
    endpoint="https://<MD_OCID>/predict",
)
response = llm.stream_chat(
    [
        ChatMessage(role="user", content="Tell me a joke"),
        ChatMessage(
            role="assistant", content="Why did the chicken cross the road?"
        ),
        ChatMessage(role="user", content="I don't know, why?"),
    ]
)


for chunk in response:
    print(chunk.delta, end="")
```


## 非同步 (Async)

### 使用 prompt 呼叫 `acomplete`

```
import ads
from llama_index.llms.oci_data_science import OCIDataScience


ads.set_auth(auth="security_token", profile="<replace-with-your-profile>")


llm = OCIDataScience(
    model="odsc-llm",
    endpoint="https://<MD_OCID>/predict",
)
response = await llm.acomplete("Tell me a joke")


print(response)
```

### 使用訊息列表呼叫 `achat`

```
import ads
from llama_index.llms.oci_data_science import OCIDataScience
from llama_index.core.base.llms.types import ChatMessage


ads.set_auth(auth="security_token", profile="<replace-with-your-profile>")


llm = OCIDataScience(
    model="odsc-llm",
    endpoint="https://<MD_OCID>/predict",
)
response = await llm.achat(
    [
        ChatMessage(role="user", content="Tell me a joke"),
        ChatMessage(
            role="assistant", content="Why did the chicken cross the road?"
        ),
        ChatMessage(role="user", content="I don't know, why?"),
    ]
)


print(response)
```

### 使用 `astream_complete` endpoint

```
import ads
from llama_index.llms.oci_data_science import OCIDataScience


ads.set_auth(auth="security_token", profile="<replace-with-your-profile>")


llm = OCIDataScience(
    model="odsc-llm",
    endpoint="https://<MD_OCID>/predict",
)


async for chunk in await llm.astream_complete("Tell me a joke"):
    print(chunk.delta, end="")
```

### 使用 `astream_chat` endpoint

```
import ads
from llama_index.llms.oci_data_science import OCIDataScience
from llama_index.core.base.llms.types import ChatMessage


ads.set_auth(auth="security_token", profile="<replace-with-your-profile>")


llm = OCIDataScience(
    model="odsc-llm",
    endpoint="https://<MD_OCID>/predict",
)
response = await llm.stream_chat(
    [
        ChatMessage(role="user", content="Tell me a joke"),
        ChatMessage(
            role="assistant", content="Why did the chicken cross the road?"
        ),
        ChatMessage(role="user", content="I don't know, why?"),
    ]
)


async for chunk in response:
    print(chunk.delta, end="")
```


## 設定模型

```
import ads
from llama_index.llms.oci_data_science import OCIDataScience


ads.set_auth(auth="security_token", profile="<replace-with-your-profile>")


llm = OCIDataScience(
    model="odsc-llm",
    endpoint="https://<MD_OCID>/predict",
    temperature=0.2,
    max_tokens=500,
    timeout=120,
    context_window=2500,
    additional_kwargs={
        "top_p": 0.75,
        "logprobs": True,
        "top_logprobs": 3,
    },
)
response = llm.chat(
    [
        ChatMessage(role="user", content="Tell me a joke"),
    ]
)
print(response)
```


## 函式呼叫 (Function Calling)

[AI Quick Actions](https://docs.oracle.com/en-us/iaas/data-science/using/ai-quick-actions.htm) 提供預建的服務容器，使部署和服務大型語言模型變得非常簡單。服務容器中可以使用 vLLM（一種用於 LLMs 的高吞吐量和記憶體高效的推論和服務引擎）或 TGI（一種用於流行開源 LLMs 的高性能文字生成伺服器）來託管模型，所建立的 endpoint 支援 OpenAI API 協定。這使得模型部署可用於 OpenAI API 應用程式的即插即用替換。如果部署的模型支援函式呼叫，則透過 llm 上的 predict\_and\_call 函式與 LlamaIndex tools 整合，可以附加任何 tools 並讓 LLM 決定呼叫哪些 tools（如果有的話）。

```
import ads
from llama_index.llms.oci_data_science import OCIDataScience
from llama_index.core.tools import FunctionTool


ads.set_auth(auth="security_token", profile="<replace-with-your-profile>")


llm = OCIDataScience(
    model="odsc-llm",
    endpoint="https://<MD_OCID>/predict",
    temperature=0.2,
    max_tokens=500,
    timeout=120,
    context_window=2500,
    additional_kwargs={
        "top_p": 0.75,
        "logprobs": True,
        "top_logprobs": 3,
    },
)




def multiply(a: float, b: float) -> float:
    print(f"---> {a} * {b}")
    return a * b




def add(a: float, b: float) -> float:
    print(f"---> {a} + {b}")
    return a + b




def subtract(a: float, b: float) -> float:
    print(f"---> {a} - {b}")
    return a - b




def divide(a: float, b: float) -> float:
    print(f"---> {a} / {b}")
    return a / b




multiply_tool = FunctionTool.from_defaults(fn=multiply)
add_tool = FunctionTool.from_defaults(fn=add)
sub_tool = FunctionTool.from_defaults(fn=subtract)
divide_tool = FunctionTool.from_defaults(fn=divide)


response = llm.predict_and_call(
    [multiply_tool, add_tool, sub_tool, divide_tool],
    user_msg="Calculate the result of `8 + 2 - 6`.",
    verbose=True,
)


print(response)
```

### 使用 `FunctionAgent`

```
import ads
from llama_index.llms.oci_data_science import OCIDataScience
from llama_index.core.tools import FunctionTool
from llama_index.core.agent.workflow import FunctionAgent


ads.set_auth(auth="security_token", profile="<replace-with-your-profile>")


llm = OCIDataScience(
    model="odsc-llm",
    endpoint="https://<MD_OCID>/predict",
    temperature=0.2,
    max_tokens=500,
    timeout=120,
    context_window=2500,
    additional_kwargs={
        "top_p": 0.75,
        "logprobs": True,
        "top_logprobs": 3,
    },
)




def multiply(a: float, b: float) -> float:
    print(f"---> {a} * {b}")
    return a * b




def add(a: float, b: float) -> float:
    print(f"---> {a} + {b}")
    return a + b




def subtract(a: float, b: float) -> float:
    print(f"---> {a} - {b}")
    return a - b




def divide(a: float, b: float) -> float:
    print(f"---> {a} / {b}")
    return a / b




multiply_tool = FunctionTool.from_defaults(fn=multiply)
add_tool = FunctionTool.from_defaults(fn=add)
sub_tool = FunctionTool.from_defaults(fn=subtract)
divide_tool = FunctionTool.from_defaults(fn=divide)


agent = FunctionAgent(
    tools=[multiply_tool, add_tool, sub_tool, divide_tool],
    llm=llm,
)
response = await agent.run(
    "Calculate the result of `8 + 2 - 6`. Use tools. Return the calculated result."
)


print(response)
```
