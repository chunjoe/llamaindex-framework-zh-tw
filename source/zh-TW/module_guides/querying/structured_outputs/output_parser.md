---
title: "輸出解析模組"
---

LlamaIndex 支援與其他框架提供的輸出解析模組整合。這些輸出解析模組可用於以下方式：

- 為任何提示/查詢提供格式化指令（透過 `output_parser.format`）
- 為 LLM 的輸出提供「parsing」（透過 `output_parser.parse`）

### Guardrails

Guardrails 是一個開源的 Python 套件，用於輸出綱要（specification）、驗證（validation）和修正（correction）輸出結構（schemas）。請參閱下方的程式碼範例。

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.output_parsers.guardrails import GuardrailsOutputParser
from llama_index.llms.openai import OpenAI




# load documents, build index
documents = SimpleDirectoryReader("../paul_graham_essay/data").load_data()
index = VectorStoreIndex(documents, chunk_size=512)


# define query / output spec
rail_spec = """
<rail version="0.1">


<output>
    <list name="points" description="Bullet points regarding events in the author's life.">
        <object>
            <string name="explanation" format="one-line" on-fail-one-line="noop" />
            <string name="explanation2" format="one-line" on-fail-one-line="noop" />
            <string name="explanation3" format="one-line" on-fail-one-line="noop" />
        </object>
    </list>
</output>


<prompt>


Query string here.


@xml_prefix_prompt


{output_schema}


@json_suffix_prompt_v2_wo_none
</prompt>
</rail>
"""


# define output parser
output_parser = GuardrailsOutputParser.from_rail_string(
    rail_spec, llm=OpenAI()
)


# Attach output parser to LLM
llm = OpenAI(output_parser=output_parser)


# obtain a structured response
query_engine = index.as_query_engine(llm=llm)
response = query_engine.query(
    "What are the three items the author did growing up?",
)
print(response)
```

輸出:

```
{'points': [{'explanation': 'Writing short stories', 'explanation2': 'Programming on an IBM 1401', 'explanation3': 'Using microcomputers'}]}
```

### Langchain

Langchain 也提供輸出解析模組，您可以在 LlamaIndex 內部使用。

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core.output_parsers import LangchainOutputParser
from llama_index.llms.openai import OpenAI
from langchain.output_parsers import StructuredOutputParser, ResponseSchema




# load documents, build index
documents = SimpleDirectoryReader("../paul_graham_essay/data").load_data()
index = VectorStoreIndex.from_documents(documents)


# define output schema
response_schemas = [
    ResponseSchema(
        name="Education",
        description="Describes the author's educational experience/background.",
    ),
    ResponseSchema(
        name="Work",
        description="Describes the author's work experience/background.",
    ),
]


# define output parser
lc_output_parser = StructuredOutputParser.from_response_schemas(
    response_schemas
)
output_parser = LangchainOutputParser(lc_output_parser)


# Attach output parser to LLM
llm = OpenAI(output_parser=output_parser)


# obtain a structured response
query_engine = index.as_query_engine(llm=llm)
response = query_engine.query(
    "What are a few things the author did growing up?",
)
print(str(response))
```

輸出:

```
{'Education': 'Before college, the author wrote short stories and experimented with programming on an IBM 1401.', 'Work': 'The author worked on writing and programming outside of school.'}
```

### 指南

更多範例：

- [Guardrails](https://developers.llamaindex.ai/python/examples/output_parsing/guardrailsdemo/index.md)
- [Langchain](https://developers.llamaindex.ai/python/examples/output_parsing/langchainoutputparserdemo/index.md)
- [Guidance Pydantic Program](https://developers.llamaindex.ai/python/examples/output_parsing/guidance_pydantic_program/index.md)
- [Guidance Sub-Question](https://developers.llamaindex.ai/python/examples/output_parsing/guidance_sub_question/index.md)
- [Openai Pydantic Program](https://developers.llamaindex.ai/python/examples/output_parsing/openai_pydantic_program/index.md)