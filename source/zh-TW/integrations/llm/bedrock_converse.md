---
title: "Bedrock Converse"
---

## 基本用法

#### 呼叫 `complete` 並提供 prompt

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-llms-bedrock-converse
```

```
!pip install llama-index
```

```
from llama_index.llms.bedrock_converse import BedrockConverse


profile_name = "Your aws profile name"
resp = BedrockConverse(
    model="anthropic.claude-3-haiku-20240307-v1:0",
    profile_name=profile_name,
).complete("Paul Graham is ")
```

```
print(resp)
```

#### 呼叫 `chat` 並提供訊息列表

```
from llama_index.core.llms import ChatMessage
from llama_index.llms.bedrock_converse import BedrockConverse


messages = [
    ChatMessage(
        role="system", content="You are a pirate with a colorful personality"
    ),
    ChatMessage(role="user", content="Tell me a story"),
]


resp = BedrockConverse(
    model="anthropic.claude-3-haiku-20240307-v1:0",
    profile_name=profile_name,
).chat(messages)
```

```
print(resp)
```

## 串流 (Streaming)

使用 `stream_complete` endpoint

```
from llama_index.llms.bedrock_converse import BedrockConverse


llm = BedrockConverse(
    model="anthropic.claude-3-haiku-20240307-v1:0",
    profile_name=profile_name,
)
resp = llm.stream_complete("Paul Graham is ")
```

```
for r in resp:
    print(r.delta, end="")
```

使用 `stream_chat` endpoint

```
from llama_index.llms.bedrock_converse import BedrockConverse


llm = BedrockConverse(
    model="anthropic.claude-3-haiku-20240307-v1:0",
    profile_name=profile_name,
)
messages = [
    ChatMessage(
        role="system", content="You are a pirate with a colorful personality"
    ),
    ChatMessage(role="user", content="Tell me a story"),
]
resp = llm.stream_chat(messages)
```

```
for r in resp:
    print(r.delta, end="")
```

## 設定 Model

```
from llama_index.llms.bedrock_converse import BedrockConverse


llm = BedrockConverse(
    model="anthropic.claude-3-haiku-20240307-v1:0",
    profile_name=profile_name,
)
```

```
resp = llm.complete("Paul Graham is ")
```

```
print(resp)
```

## 使用 Access Keys 連接 Bedrock

```
from llama_index.llms.bedrock_converse import BedrockConverse


llm = BedrockConverse(
    model="us.amazon.nova-lite-v1:0",
    aws_access_key_id="AWS Access Key ID to use",
    aws_secret_access_key="AWS Secret Access Key to use",
    aws_session_token="AWS Session Token to use",
    region_name="AWS Region to use, eg. us-east-1",
)


resp = llm.complete("Paul Graham is ")
```

```
print(resp)
```

## Function Calling

Claude、Command 和 Mistral Large 模型透過 AWS Bedrock Converse 支援原生 function calling。透過 `predict_and_call` 函式在 `llm` 中與 LlamaIndex tools 進行無縫整合。

這讓使用者可以附加任何 tools，讓 LLM 決定呼叫哪些 tools（如果有的話）。

如果您希望將 tool calling 作為 agentic loop 的一部分來執行，請參閱我們的 [agent guides](https://docs.llamaindex.ai/en/latest/module_guides/deploying/agents/)。

**注意**：並非所有來自 AWS Bedrock 的模型都支援 function calling 和 Converse API。 [請在此處查看每個 LLM 的可用功能](https://docs.aws.amazon.com/bedrock/latest/userguide/models-features.html)。

```
from llama_index.llms.bedrock_converse import BedrockConverse
from llama_index.core.tools import FunctionTool




def multiply(a: int, b: int) -> int:
    """Multiple two integers and returns the result integer"""
    return a * b




def mystery(a: int, b: int) -> int:
    """Mystery function on two integers."""
    return a * b + a + b




mystery_tool = FunctionTool.from_defaults(fn=mystery)
multiply_tool = FunctionTool.from_defaults(fn=multiply)


llm = BedrockConverse(
    model="anthropic.claude-3-haiku-20240307-v1:0",
    profile_name=profile_name,
)
```

```
response = llm.predict_and_call(
    [mystery_tool, multiply_tool],
    user_msg="What happens if I run the mystery function on 5 and 7",
)
```

```
print(str(response))
```

```
response = llm.predict_and_call(
    [mystery_tool, multiply_tool],
    user_msg=(
        """What happens if I run the mystery function on the following pairs of numbers? Generate a separate result for each row:
- 1 and 2
- 8 and 4
- 100 and 20


NOTE: you need to run the mystery function for all of the pairs above at the same time \
"""
    ),
    allow_parallel_tool_calls=True,
)
```

```
print(str(response))
```

```
for s in response.sources:
    print(f"Name: {s.tool_name}, Input: {s.raw_input}, Output: {str(s)}")
```

## Async

```
from llama_index.llms.bedrock_converse import BedrockConverse


llm = BedrockConverse(
    model="anthropic.claude-3-haiku-20240307-v1:0",
    aws_access_key_id="AWS Access Key ID to use",
    aws_secret_access_key="AWS Secret Access Key to use",
    aws_session_token="AWS Session Token to use",
    region_name="AWS Region to use, eg. us-east-1",
)
resp = await llm.acomplete("Paul Graham is ")
```

```
print(resp)
```
