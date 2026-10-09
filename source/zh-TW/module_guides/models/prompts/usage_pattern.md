---
title: "Prompt 使用模式"
---

## 使用 `RichPromptTemplate` 和 Jinja 語法

透過利用 Jinja 語法，您可以建立具有變數、邏輯、解析物件等的提示模板。

讓我們看看幾個範例：

```
from llama_index.core.prompts import RichPromptTemplate


template = RichPromptTemplate(
    """We have provided context information below.
---------------------
{{ context_str }}
---------------------
Given this information, please answer the question: {{ query_str }}
"""
)


# format as a string
prompt_str = template.format(context_str=..., query_str=...)


# format as a list of chat messages
messages = template.format_messages(context_str=..., query_str=...)
```

Jinja 提示與 f-string 的主要區別在於，變數現在使用雙括號 `{{ }}` 而非單括號 `{ }`。

讓我們看看一個更複雜的範例，它使用迴圈來產生多模態提示。

```
from llama_index.core.prompts import RichPromptTemplate


template = RichPromptTemplate(
    """
{% chat role="system" %}
Given a list if images and text from each image, please answer the question to the best of your ability.
{% endchat %}


{% chat role="user" %}
{% for image_path, text in images_and_texts %}
Here is some text: {{ text }}
And here is an image:
{{ image_path | image }}
{% endfor %}
{% endchat %}
"""
)


messages = template.format_messages(
    images_and_texts=[
        ("page_1.png", "This is the first page of the document"),
        ("page_2.png", "This is the second page of the document"),
    ]
)
```

在這個範例中，您可以看到幾個功能：

- `{% chat %}` 區塊用於將訊息格式化為聊天訊息並設定 role
- `{% for %}` 迴圈用於迭代傳入的 `images_and_texts` 列表
- `{{ image_path | image }}` 語法用於將圖片路徑格式化為圖片內容區塊。在這裡，`|` 用於對變數應用「filter」以幫助識別它為圖片。

讓我們看看另一個範例，這次是使用 nodes 從 retriever 建立模板：

```
from llama_index.core.prompts import RichPromptTemplate


template = RichPromptTemplate(
    """
{% chat role="system" %}
You are a helpful assistant that can answer questions about the context provided.
{% endchat %}


{% chat role="user" %}
{% for node in nodes %}
{{ node.text }}
{% endfor %}
{% endchat %}
"""
)


nodes = retriever.retrieve("What is the capital of the moon?")


messages = template.format_messages(nodes=nodes)
```

## 使用 `f-string` 提示模板

截至本文撰寫時，許多舊的元件和範例會使用 `f-string` 提示。

定義自訂提示就像建立一個 format string

```
from llama_index.core import PromptTemplate


template = (
    "We have provided context information below. \n"
    "---------------------\n"
    "{context_str}"
    "\n---------------------\n"
    "Given this information, please answer the question: {query_str}\n"
)
qa_template = PromptTemplate(template)


# you can create text prompt (for completion API)
prompt = qa_template.format(context_str=..., query_str=...)


# or easily convert to message prompts (for chat API)
messages = qa_template.format_messages(context_str=..., query_str=...)
```

您也可以從聊天訊息中定義模板

```
from llama_index.core import ChatPromptTemplate
from llama_index.core.llms import ChatMessage, MessageRole


message_templates = [
    ChatMessage(content="You are an expert system.", role=MessageRole.SYSTEM),
    ChatMessage(
        content="Generate a short story about {topic}",
        role=MessageRole.USER,
    ),
]
chat_template = ChatPromptTemplate(message_templates=message_templates)


# you can create message prompts (for chat API)
messages = chat_template.format_messages(topic=...)


# or easily convert to text prompt (for completion API)
prompt = chat_template.format(topic=...)
```

## 取得和設定自訂提示

由於 LlamaIndex 是一個多步驟管線，因此重要的是要識別您想要修改的操作，並在正確的位置傳入自訂提示。

例如，提示用於 response synthesizer、retrievers、index construction 等；這些模組有些是嵌套在其他模組中的（synthesizer 嵌套在 query engine 中）。

請參閱 [此指南](https://developers.llamaindex.ai/python/examples/prompts/prompt_mixin/index.md) 以獲取有關存取/自訂提示的完整詳細資訊。

### 常見使用的提示

最常用的提示將是 `text_qa_template` 和 `refine_template`。

- `text_qa_template` - 用於使用檢索到的 nodes 來獲取查詢的初始答案
- `refine_template` - 當檢索到的文字不適合單一 LLM 呼叫（使用 `response_mode="compact"` (預設值)）時，或當使用 `response_mode="refine"` 檢索多個 node 時使用。第一個查詢的答案會作為 `existing_answer` 插入，並且 LLM 必須根據新的上下文更新或重複現有的答案。

### 存取提示

您可以呼叫 `get_prompts` 在 LlamaIndex 中的許多模組上，以獲取該模組和嵌套子模組中使用的提示的扁平列表。

例如，看看以下程式碼片段。

```
query_engine = index.as_query_engine(response_mode="compact")
prompts_dict = query_engine.get_prompts()
print(list(prompts_dict.keys()))
```

您可能會得到以下鍵：

```
['response_synthesizer:text_qa_template', 'response_synthesizer:refine_template']
```

請注意，提示會以其子模組作為「namespace」進行前綴。

### 更新提示

您可以使用 `update_prompts` 函式在實作 `get_prompts` 的任何模組上自訂提示。只需傳入具有與 `get_prompts` 獲取的提示字典中的鍵相等的參數值。

例如，關於上述範例，我們可以這樣做：

```
# shakespeare!
qa_prompt_tmpl_str = (
    "Context information is below.\n"
    "---------------------\n"
    "{{ context_str }}\n"
    "---------------------\n"
    "Given the context information and not prior knowledge, "
    "answer the query in the style of a Shakespeare play.\n"
    "Query: {{ query_str }}\n"
    "Answer: "
)
qa_prompt_tmpl = RichPromptTemplate(qa_prompt_tmpl_str)


query_engine.update_prompts(
    {"response_synthesizer:text_qa_template": qa_prompt_tmpl}
)
```

### 修改 query engine 中使用的提示

對於 query engine，您也可以在查詢時直接傳入自訂提示（即，用於對索引執行查詢並合成最終回應）。

還有兩種等效的方法來覆蓋提示：

1. 透過高階的 API
```
query_engine = index.as_query_engine(
    text_qa_template=custom_qa_prompt, refine_template=custom_refine_prompt
)
```

2. 透過低階的 composition API

```
retriever = index.as_retriever()
synth = get_response_synthesizer(
    text_qa_template=custom_qa_prompt, refine_template=custom_refine_prompt
)
query_engine = RetrieverQueryEngine(retriever, response_synthesizer)
```

上述兩種方法是等效的，其中 1 本質上是 2 的語法糖，並隱藏了底層的複雜性。您可能想使用 1 來快速修改一些常見的參數，並使用 2 來獲得更細緻的控制。

有關哪些類別使用哪些提示的更多詳細資訊，請造訪 [Query class references](https://developers.llamaindex.ai/python/framework-api-reference/response_synthesizers/index.md)。

請查看 [reference documentation](https://developers.llamaindex.ai/python/framework-api-reference/prompts/index.md) 以獲取所有提示及其方法/參數的完整集合。

## \[進階] 進階提示功能

在本節中，我們在 LlamaIndex 中展示了一些進階的提示功能。

相關指南：

- [Advanced Prompts](https://developers.llamaindex.ai/python/examples/prompts/advanced_prompts/index.md)- [RichPromptTemplate Features](https://developers.llamaindex.ai/python/examples/prompts/rich_prompt_template_features/index.md)

### Function Mappings

將函式作為 template variables 傳入，而非固定值。

這相當進階且強大；讓您可以進行動態 few-shot prompting 等操作。

以下是重新格式化 `context_str` 的範例。

```
from llama_index.core.prompts import RichPromptTemplate




def format_context_fn(**kwargs):
    # format context with bullet points
    context_list = kwargs["context_str"].split("\n\n")
    fmtted_context = "\n\n".join([f"- {c}" for c in context_list])
    return fmtted_context




prompt_tmpl = RichPromptTemplate(
    "{{ context_str }}", function_mappings={"context_str": format_context_fn}
)


prompt_str = prompt_tmpl.format(context_str="context", query_str="query")
```

### Partial Formatting

部分格式化 prompt，填入部分變數，而將其他變數留待稍後填入。

```
from llama_index.core.prompts import RichPromptTemplate


template = RichPromptTemplate(
    """
{{ foo }} {{ bar }}
"""
)


partial_prompt_tmpl = template.partial_format(foo="abc")


fmt_str = partial_prompt_tmpl.format(bar="def")
```

### Template Variable Mappings

LlamaIndex prompt abstractions 通常會期望特定的 key。例如，我們的 `text_qa_prompt` 期望 `context_str` 作為 context，以及 `query_str` 作為 user query。

但如果您想調整一個字串 template 以用於 LlamaIndex，更改 template variables 可能會很麻煩。

相反地，定義 `template_var_mappings`：

```
from llama_index.core.prompts import RichPromptTemplate


template_var_mappings = {"context_str": "my_context", "query_str": "my_query"}


prompt_tmpl = RichPromptTemplate(
    "Here is some context: {{ context_str }} and here is a query: {{ query_str }}",
    template_var_mappings=template_var_mappings,
)


prompt_str = prompt_tmpl.format(my_context="context", my_query="query")
```
