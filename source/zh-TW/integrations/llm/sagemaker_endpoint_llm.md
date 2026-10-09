---
title: "與在 Amazon SageMaker Endpoint 中部署的 LLM 互動，使用 LlamaIndex"
---

Amazon SageMaker endpoint 是一個完全託管的資源，可啟用機器學習模型的部署，特別是 LLM (Large Language Models)，用於對新資料進行預測。

本筆 Notebook 示範如何使用 `SageMakerLLM` 呼叫 LLM endpoint，以解鎖額外的 llamaIndex 功能。因此，假設有一個 LLM 部署在 SageMaker endpoint 上。

## 設定

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-llms-sagemaker-endpoint
```

```
! pip install llama-index
```

您必須指定要互動的 endpoint 名稱。

```
ENDPOINT_NAME = "<-YOUR-ENDPOINT-NAME->"
```

需要提供憑證以連接到 endpoint。您可以選擇：

- 透過指定 `profile_name` 參數使用 AWS profile，如果未指定，則會使用預設的憑證 profile。
- 將憑證作為參數傳遞 (`aws_access_key_id`, `aws_secret_access_key`, `aws_session_token`, `region_name`)。

如需更多詳情，請參閱 [this link](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/credentials.html)。

**AWS profile name**

```
from llama_index.llms.sagemaker_endpoint import SageMakerLLM


AWS_ACCESS_KEY_ID = "<-YOUR-AWS-ACCESS-KEY-ID->"
AWS_SECRET_ACCESS_KEY = "<-YOUR-AWS-SECRET-ACCESS-KEY->"
AWS_SESSION_TOKEN = "<-YOUR-AWS-SESSION-TOKEN->"
REGION_NAME = "<-YOUR-ENDPOINT-REGION-NAME->"
```

```
llm = SageMakerLLM(
    endpoint_name=ENDPOINT_NAME,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    aws_session_token=AWS_SESSION_TOKEN,
    region_name=REGION_NAME,
)
```

**使用憑證**:

```
from llama_index.llms.sagemaker_endpoint import SageMakerLLM


ENDPOINT_NAME = "<-YOUR-ENDPOINT-NAME->"
PROFILE_NAME = "<-YOUR-PROFILE-NAME->"
llm = SageMakerLLM(
    endpoint_name=ENDPOINT_NAME, profile_name=PROFILE_NAME
)  # Omit the profile name to use the default profile
```


## 基本用法

### 使用 prompt 呼叫 `complete`

```
resp = llm.complete(
    "Paul Graham is ", formatted=True
)  # formatted=True to avoid adding system prompt
print(resp)
```

```
66 years old (birthdate: September 4, 1951). He is a British-American computer scientist, programmer, and entrepreneur who is known for his work in the fields of artificial intelligence, machine learning, and computer vision. He is a professor emeritus at Stanford University and a researcher at the Stanford Artificial Intelligence Lab (SAIL).


Graham has made significant contributions to the field of computer science, including the development of the concept of "n-grams," which are sequences of n items that occur together in a dataset. He has also worked on the development of machine learning algorithms and has written extensively on the topic of machine learning.


Graham has received numerous awards for his work, including the Association for Computing Machinery (ACM) A.M. Turing Award, the IEEE Neural Networks Pioneer Award, and the IJCAI Award
```


### 使用訊息列表呼叫 `chat`

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

```
assistant:   Arrrr, shiver me timbers! *adjusts eye patch* Me name be Cap'n Blackbeak, the most feared and infamous pirate on the seven seas! *winks*


*ahem* But enough about me, matey. What be bringin' ye to these fair waters? Are ye here to plunder some booty, or just to share a pint o' grog with a salty old sea dog like meself? *chuckles*
```


### 串流 (Streaming)

#### 使用 `stream_complete` endpoint

```
resp = llm.stream_complete("Paul Graham is ", formatted=True)
```

```
for r in resp:
    print(r.delta)
```

```
64 today. He’s a computer sci
ist, entrepreneur, and writer, best known for his work in the fields of artificial intelligence, machine learning, and computer graphics.
Graham was born in 1956 in Boston, Massachusetts. He earned his Bachelor’s degree in Computer Science from Harvard University in 1978 and his PhD in Computer Science from the University of California, Berkeley in 1982.
Graham’s early work focused on the development of the first computer graphics systems that could generate photorealistic images. In the 1980s, he became interested in the field of artificial intelligence and machine learning, and he co-founded a number of companies to explore these areas, including Viaweb, which was one of the first commercial web hosting services.
Graham is also a prolific writer and has published a number of influential essays on topics such as the nature
```


#### 使用 `stream_chat` endpoint

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

```
  ARRGH! *adjusts eye patch* Me hearty? *winks* Me name be Captain Blackbeak, the most feared and infamous pirate to ever sail the seven seas! *chuckles* Or, at least, that's what me matey mates tell me. *winks*


So, what be bringin' ye to these waters, matey? Are ye here to plunder some booty or just to hear me tales of the high seas? *grins* Either way, I be ready to share me treasure with ye! *winks* Just don't be tellin' any landlubbers about me hidden caches o' gold, or ye might be walkin' the plank, savvy? *winks*
```


## 設定模型

`SageMakerLLM` 是用來與部署在 Amazon SageMaker 中的不同語言模型 (LLM) 互動的抽象層。所有預設參數都與 Llama 2 模型相容。因此，如果您使用不同的模型，您可能需要設定以下參數：

- `messages_to_prompt`：一個接受 `ChatMessage` 物件列表以及在訊息中未指定的 system prompt 的可呼叫函數。它應回傳一個包含訊息的字串，格式與 endpoint LLM 相容。

- `completion_to_prompt`：一個接受帶有 system prompt 的 completion string 的可呼叫函數，並回傳一個與 endpoint LLM 相容的字串。

- `content_handler`：一個繼承自 `llama_index.llms.sagemaker_llm_endpoint_utils.BaseIOHandler` 並實作以下方法的類別：`serialize_input`, `deserialize_output`, `deserialize_streaming_output`, 和 `remove_prefix`。