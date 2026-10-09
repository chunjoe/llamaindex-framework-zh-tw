---
title: "低階結構化資料擷取"
---

如果您的 LLM 支援 tool calling，並且需要對 LlamaIndex 如何擷取資料有更直接的控制，您可以直接在 `chat_with_tools` 上使用 LLM。如果 LLM 不支援 tool calling，您可以直接指示您的 LLM 並自行解析輸出。我們將展示如何完成這兩種情況。

## 直接呼叫 tool

```
from llama_index.core.program.function_program import get_function_tool


tool = get_function_tool(Invoice)


resp = llm.chat_with_tools(
    [tool],
    # chat_history=chat_history,  # can optionally pass in chat history instead of user_msg
    user_msg="Extract an invoice from the following text: " + text,
    tool_required=True,  # can optionally force the tool call
)


tool_calls = llm.get_tool_calls_from_response(
    resp, error_on_no_tool_calls=False
)


outputs = []
for tool_call in tool_calls:
    if tool_call.tool_name == "Invoice":
        outputs.append(Invoice(**tool_call.tool_kwargs))


# use your outputs
print(outputs[0])
```

如果 LLM 具有 tool calling API，則與 `structured_predict` 相同。然而，如果 LLM 支援，您可以選擇允許多次 tool calling。這會產生從同一個輸入中擷取多個物件的效果，如下例所示：

```
from llama_index.core.program.function_program import get_function_tool


tool = get_function_tool(LineItem)


resp = llm.chat_with_tools(
    [tool],
    user_msg="Extract line items from the following text: " + text,
    allow_parallel_tool_calls=True,
)


tool_calls = llm.get_tool_calls_from_response(
    resp, error_on_no_tool_calls=False
)


outputs = []
for tool_call in tool_calls:
    if tool_call.tool_name == "LineItem":
        outputs.append(LineItem(**tool_call.tool_kwargs))


# use your outputs
print(outputs)
```

如果您的目標是從單一 LLM 呼叫中擷取多個 Pydantic 物件，則可以這樣做。

## 直接提示 (Direct prompting)

如果因為某些原因，LlamaIndex 嘗試讓擷取更簡單的方法對您無效，您可以放棄這些方法，直接提示 LLM 並自行解析輸出，如下所示：

```
schema = Invoice.model_json_schema()
prompt = "Here is a JSON schema for an invoice: " + json.dumps(
    schema, indent=2
)
prompt += (
    """
  Extract an invoice from the following text.
  Format your output as a JSON object according to the schema above.
  Do not include any other text than the JSON object.
  Omit any markdown formatting. Do not include any preamble or explanation.
"""
    + text
)


response = llm.complete(prompt)


print(response)


invoice = Invoice.model_validate_json(response.text)


pprint(invoice)
```

恭喜！您已經學會了關於在 LlamaIndex 中進行結構化資料擷取的一切知識。

## 其他指南

如欲深入了解使用 LlamaIndex 進行結構化資料擷取，請參閱以下指南：

- [Structured Outputs](/python/framework/module_guides/querying/structured_outputs/)
- [Pydantic Programs](/python/framework/module_guides/querying/structured_outputs/pydantic_program/)
- [Output Parsing](/python/framework/module_guides/querying/structured_outputs/output_parser/)

## 額外內容 (Bonus Track)

如果您想知道如何利用結構化輸入來提升 LLM 的效能，請查看 [此指南](/python/framework/understanding/extraction/structured_input/)！