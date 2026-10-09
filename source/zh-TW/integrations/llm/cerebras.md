---
title: "Cerebras"
---

在 Cerebras，我們開發了全球最大、最快的 AI 處理器 Wafer-Scale Engine-3 (WSE-3)。由 WSE-3 驅動的 Cerebras CS-3 系統，代表了一種新的 AI 超級電腦類別，在生成式 AI 的訓練和推論方面，以無與倫比的效能和可擴展性樹立了標準。

以 Cerebras 作為您的 inference provider，您可以：

- 實現 AI inference 工作負載的空前速度
- 以高吞吐量進行商業化開發
- 透過我們無縫的 clustering 技術輕鬆擴展您的 AI 工作負載

我們的 CS-3 系統可以快速輕鬆地進行 clustering，以建立全球最大的 AI 超級電腦，讓部署和運行最大的模型變得簡單。領先的企業、研究機構和政府已經在使用 Cerebras 解決方案來開發專有模型和訓練流行的 open-source 模型。

想體驗 Cerebras 的強大能力嗎？請造訪我們的 [website](https://cerebras.net/) 獲取更多資源，並探索透過 Cerebras Cloud 或 on-premise deployments 存取我們技術的選項！

如需了解更多關於 Cerebras Cloud 的資訊，請造訪 [cloud.cerebras.ai](https://cloud.cerebras.ai/)。我們的 API 參考資料可在 [inference-docs.cerebras.ai](https://inference-docs.cerebras.ai/) 找到。

## 設定

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
% pip install llama-index-llms-cerebras
```

```
!pip install llama-index
```

```
from llama_index.llms.cerebras import Cerebras
```

從 [cloud.cerebras.ai](https://cloud.cerebras.ai/) 獲取一個 API Key 並將其新增到您的 environment variables 中：

終端機視窗

```
export CEREBRAS_API_KEY=<your api key>
```

或者，您可以在初始化時將您的 API key 傳遞給 LLM：

```
import os
import getpass


os.environ["CEREBRAS_API_KEY"] = getpass.getpass(
    "Enter your Cerebras API key: "
)


llm = Cerebras(model="llama-3.3-70b", api_key=os.environ["CEREBRAS_API_KEY"])
```

```
Enter your Cerebras API key:  ········
```

可用的 LLM 模型列表可在 [inference-docs.cerebras.ai](https://inference-docs.cerebras.ai/) 找到。

```
response = llm.complete("What is Generative AI?")
```

```
print(response)
```

```
Generative AI refers to a type of artificial intelligence (AI) that is capable of generating new, original content, such as text, images, music, or videos, based on patterns and structures it has learned from a dataset or a set of examples. This type of AI is designed to create new content that is similar in style, tone, and quality to the original content it was trained on.


Generative AI models use various techniques, such as neural networks, to analyze and learn from large datasets, and then generate new content that is similar to the patterns and structures they have learned. These models can be trained on a wide range of data, including text, images, audio, and video, and can be used to generate a variety of content, such as:


1. Text: Generative AI models can generate text that is similar in style and tone to a given text, such as articles, blog posts, or social media updates.
2. Images: Generative AI models can generate images that are similar in style and content to a given image, such as photographs, illustrations, or graphics.
3. Music: Generative AI models can generate music that is similar in style and tone to a given piece of music, such as melodies, harmonies, or beats.
4. Videos: Generative AI models can generate videos that are similar in style and content to a given video, such as animations, movies, or TV shows.


Generative AI has many potential applications, including:


1. Content creation: Generative AI can be used to generate content for various industries, such as marketing, advertising, and entertainment.
2. Data augmentation: Generative AI can be used to generate new data that can be used to train and improve machine learning models.
3. Creative collaboration: Generative AI can be used to collaborate with humans in the creative process, such as generating ideas or providing inspiration.
4. Personalization: Generative AI can be used to generate personalized content for individuals, such as customized recommendations or tailored marketing messages.


Some examples of generative AI include:


1. Language models like GPT-3, which can generate human-like text based on a prompt.
2. Image generation models like Generative Adversarial Networks (GANs), which can generate realistic images of faces, objects, or scenes.
3. Music generation models like Amper Music, which can generate original music tracks based on a set of parameters.
4. Video generation models like DeepMotion, which can generate realistic videos of human movements and actions.


Overall, generative AI has the potential to revolutionize the way we create and interact with content, and has many exciting applications across various industries.
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

```
assistant: Arrrr, me hearty! Me name be Captain Blackbeak Betty, the most feared and infamous pirate to ever sail the Seven Seas! Me and me trusty parrot, Polly, have been plunderin' and pillagin' for nigh on 20 years, and me reputation be known from the Caribbean to the coast of Africa!


Now, I be a bit of a legend in me own right, with me black beard and me eye patch, and me ship, the "Maverick's Revenge", be the fastest and most feared on the high seas! So, if ye be lookin' for a swashbucklin' adventure, just give ol' Blackbeak Betty a shout, and we'll set sail fer a life o' plunder and pillage! Savvy?
```

### Streaming

使用 `stream_complete` endpoint

```
response = llm.stream_complete("What is Generative AI?")
```

```
for r in response:
    print(r.delta, end="")
```

```
Generative AI refers to a type of artificial intelligence (AI) that is capable of generating new, original content, such as text, images, music, or videos, based on patterns and structures it has learned from a dataset or a set of examples. This type of AI is designed to create new content that is similar in style, tone, and quality to the original content it was trained on.


Generative AI models use various techniques, such as neural networks, to analyze and learn from large datasets, and then generate new content that is similar to the patterns and structures they have learned. These models can be trained on a wide range of data, including text, images, audio, and video, and can be used to generate a variety of content, such as:


1. Text: Generative AI models can generate text that is similar in style and tone to a given text, such as articles, blog posts, or social media updates.
2. Images: Generative AI models can generate images that are similar in style and content to a given image, such as photographs, illustrations, or graphics.
3. Music: Generative AI models can generate music that is similar in style and tone to a given piece of music, such as melodies, harmonies, or beats.
4. Videos: Generative AI models can generate videos that are similar in style and content to a given video, such as animations, movies, or TV shows.


Generative AI has many potential applications, including:


1. Content creation: Generative AI can be used to generate content for various industries, such as marketing, advertising, and entertainment.
2. Data augmentation: Generative AI can be used to generate new data that can be used to train and improve machine learning models.
3. Creative collaboration: Generative AI can be used to collaborate with humans in the creative process, such as generating ideas or providing inspiration.
4. Personalization: Generative AI can be used to generate personalized content for individuals, such as customized recommendations or tailored marketing messages.


Some examples of generative AI include:


1. Language models like GPT-3, which can generate human-like text based on a prompt.
2. Image generation models like Generative Adversarial Networks (GANs), which can generate realistic images of faces, objects, or scenes.
3. Music generation models like Amper Music, which can generate original music tracks based on a set of parameters.
4. Video generation models like DeepMotion, which can generate realistic videos of human movements and actions.


Overall, generative AI has the potential to revolutionize the way we create and interact with content, and has many exciting applications across various industries.
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

```
Arrrr, me hearty! Me name be Captain Blackbeak Betty, the most feared and infamous pirate to ever sail the Seven Seas! Me and me trusty parrot, Polly, have been plunderin' and pillagin' for nigh on 20 years, and me reputation be known from the Caribbean to the coast of Africa!


Now, I be a bit of a legend in me own right, with me black beard and me eye patch, and me ship, the "Maverick's Revenge", be the fastest and most feared on the high seas! So, if ye be lookin' for a swashbucklin' adventure, just give ol' Blackbeak Betty a shout, and we'll set sail fer a life o' plunder and pillage! Savvy?
```
