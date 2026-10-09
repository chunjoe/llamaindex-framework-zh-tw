---
title: "Groq"
---

歡迎來到 Groq！🚀 在 Groq，我們開發了世界上第一個語言處理單元™ (Language Processing Unit™)，即 LPU。Groq LPU 採用確定性的單核心串流架構，為任何給定的工作負載提供可預測且可重複的效能，為 GenAI 推理速度樹立了標準。

除了架構之外，我們的軟體旨在為像您一樣的開發者提供所需的工具，讓您創造創新、強大的 AI 應用程式。使用 Groq 作為您的引擎，您可以：

- 為即時 AI 和 HPC 推理實現無可妥協的低延遲和效能 🔥
- 知道任何給定工作負載的確切效能和計算時間 🔮
- 利用我們尖端技術，保持領先於競爭對手 💪

想了解更多 Groq？請造訪我們的 [website](https://groq.com/) 獲取更多資源，並加入我們的 [Discord community](https://discord.gg/JvNsBDKeCG) 與我們的開發者連結！

## 設定

如果您在 Colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
% pip install llama-index-llms-groq
```

```
!pip install llama-index
```

```
from llama_index.llms.groq import Groq
```

```
None of PyTorch, TensorFlow >= 2.0, or Flax have been found. Models won't be available and only tokenizers, configuration and file/data utilities can be used.
```

在 [Groq console](https://console.groq.com/keys) 中建立一個 API key，然後將其設定為環境變數 `GROQ_API_KEY`。

終端機視窗

```
export GROQ_API_KEY=<your api key>
```

或者，您可以在初始化時將您的 API key 傳遞給 LLM：

```
llm = Groq(model="llama3-70b-8192", api_key="your_api_key")
```

可以從 [這裡](https://console.groq.com/docs/models) 找到可用的 LLM 模型列表。

```
response = llm.complete("Explain the importance of low latency LLMs")
```

```
print(response)
```

```
Low latency Large Language Models (LLMs) are important in certain applications due to their ability to process and respond to inputs quickly. Latency refers to the time delay between a user's request and the system's response. In some real-time or time-sensitive applications, low latency is critical to ensure a smooth user experience and prevent delays or lag.


For example, in conversational agents or chatbots, users expect quick and responsive interactions. If the system takes too long to process and respond to user inputs, it can negatively impact the user experience and lead to frustration. Similarly, in applications such as real-time language translation or speech recognition, low latency is essential to provide accurate and timely feedback to the user.


Furthermore, low latency LLMs can enable new use cases and applications that require real-time or near real-time processing of language inputs. For instance, in the field of autonomous vehicles, low latency LLMs can be used for real-time speech recognition and natural language understanding, enabling voice-controlled interfaces that allow drivers to keep their hands on the wheel and eyes on the road.


In summary, low latency LLMs are important for providing a smooth and responsive user experience, enabling real-time or near real-time processing of language inputs, and unlocking new use cases and applications that require real-time or near real-time processing of language inputs.
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
assistant: Arr, I be known as Captain Redbeard, the fiercest pirate on the seven seas! But ye can call me Cap'n Redbeard for short. I'm a fearsome pirate with a love for treasure and adventure, and I'm always ready for a good time! Whether I'm swabbin' the deck or swiggin' grog, I'm always up for a bit of fun. So hoist the Jolly Roger and let's set sail for adventure, me hearties!
```

### 串流

使用 `stream_complete` endpoint

```
response = llm.stream_complete("Explain the importance of low latency LLMs")
```

```
for r in response:
    print(r.delta, end="")
```

```
Low latency Large Language Models (LLMs) are important in the field of artificial intelligence and natural language processing (NLP) due to several reasons:


1. Real-time applications: Low latency LLMs are essential for real-time applications such as chatbots, voice assistants, and real-time translation services. These applications require immediate responses, and high latency can result in a poor user experience.
2. Improved user experience: Low latency LLMs can provide a more seamless and responsive user experience. Users are more likely to continue using a service that provides quick and accurate responses, leading to higher user engagement and satisfaction.
3. Better decision-making: In some applications, such as financial trading or autonomous vehicles, low latency LLMs can provide critical information in real-time, enabling better decision-making and reducing the risk of accidents.
4. Scalability: Low latency LLMs can handle a higher volume of requests, making them more scalable and suitable for large-scale applications.
5. Competitive advantage: Low latency LLMs can provide a competitive advantage in industries where real-time decision-making and responsiveness are critical. For example, in online gaming or e-commerce, low latency LLMs can provide a more immersive and engaging user experience, leading to higher customer loyalty and revenue.


In summary, low latency LLMs are essential for real-time applications, providing a better user experience, enabling better decision-making, improving scalability, and providing a competitive advantage. As LLMs continue to play an increasingly important role in various industries, low latency will become even more critical for their success.
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
Arr, I be known as Captain Candybeard! A more colorful and swashbuckling pirate, ye will never find!
```
