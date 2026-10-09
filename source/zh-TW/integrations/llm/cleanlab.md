---
title: "Cleanlab 可信賴語言模型"
---

Cleanlab 的 [Trustworthy Language Model](https://help.cleanlab.ai/tlm/) 會即時評估每個 LLM 回應的可靠性，使用最先進的不確定性估計方法來評估 LLMs。在應用程式中，若未經檢查的幻覺（hallucinations）和其他 LLM 錯誤會導致應用程式無法運行，因此信任評分至關重要。

本頁演示了如何使用 TLM 來取代您自己的 LLM，以生成回應並評估其可靠性。不過，使用 TLM 並非唯一的方法。若要將信任評分加入到您現有的未修改的 RAG 應用程式中，您可以參考 [此 Trustworthy RAG 教程](https://docs.llamaindex.ai/en/stable/examples/evaluation/cleanlab/)。除了 RAG 應用程式之外，您還可以透過 `TLM.get_trustworthiness_score()` 評估任何 LLM 已生成的回應的可靠性。

請在 Cleanlab [文件](https://help.cleanlab.ai/tlm/) 中了解更多資訊。

## 設定

如果您在 Colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-llms-cleanlab
```

```
%pip install llama-index
```

```
from llama_index.llms.cleanlab import CleanlabTLM
```

```
# set api key in env or in llm
# get free API key from: https://cleanlab.ai/
# import os
# os.environ["CLEANLAB_API_KEY"] = "your api key"


llm = CleanlabTLM(api_key="your_api_key")
```

```
resp = llm.complete("Who is Paul Graham?")
```

```
print(resp)
```

```
Paul Graham is an American computer scientist, entrepreneur, and venture capitalist. He is best known as the co-founder of the startup accelerator Y Combinator, which has helped launch numerous successful companies including Dropbox, Airbnb, and Reddit. Graham is also a prolific writer and essayist, known for his insightful and thought-provoking essays on topics ranging from startups and entrepreneurship to technology and society. He has been influential in the tech industry and is highly regarded for his expertise and contributions to the startup ecosystem.
```

您也會在 `additional_kwargs` 中獲得上述回應的信任分數。TLM 會自動為所有 \<prompt, response> 配對計算此分數。

```
print(resp.additional_kwargs)
```

```
{'trustworthiness_score': 0.8659043183923533}
```

高分表示 LLM 的回應可以被信任。我們再舉一個例子。

```
resp = llm.complete(
    "What was the horsepower of the first automobile engine used in a commercial truck in the United States?"
)
```

```
print(resp)
```

```
The first automobile engine used in a commercial truck in the United States was the 1899 Winton Motor Carriage Company Model 10, which had a 2-cylinder engine with 20 horsepower.
```

```
print(resp.additional_kwargs)
```

```
{'trustworthiness_score': 0.5820799504369166}
```

低分表示不應信任 LLM 的回應。

從這兩個簡單的範例中，我們可以觀察到得分最高的 LLM 的回應是直接、準確且恰當詳細的。另一方面，信任分數低的 LLM 的回應會傳達無幫助或事實不準確的答案，有時被稱為幻覺（hallucinations）。

### 串流 (Streaming)

Cleanlab 的 TLM 原生不支援同時串流回應和信任分數。然而，有另一種方法可以實現低延遲的串流回應，可用於您的應用程式。
有關此方法的詳細資訊和範例程式碼，請參閱 [這裡](https://help.cleanlab.ai/tlm/use-cases/tlm_rag/#alternate-low-latencystreaming-approach-use-tlm-to-assess-responses-from-an-existing-rag-system)。

## TLM 的進階使用

TLM 可以配置以下選項：

- **model**: 要使用的底層 LLM
- **max\_tokens**: 在回應中生成的最大 token 數
- **num\_candidate\_responses**: TLM 內部生成的替代候選回應的數量
- **num\_consistency\_samples**: 用於評估 LLM-response-consistency 的內部採樣量
- **use\_self\_reflection**: 是否要求 LLM 對其生成的回應進行自我反思並自我評估此回應
- **log**: 指定要返回的額外元數據。在此處包含 “explanation” 可以取得回應為何被評為低信任度的解釋

這些配置在初始化時作為一個 dictionary 傳遞給 `CleanlabTLM` 物件。
有關這些選項的更多詳細資訊可參閱 [Cleanlab 的 API documentation](https://help.cleanlab.ai/tlm/api/python/tlm/#class-tlmoptions)，而這些選項的幾個使用案例則在 [此 notebook](https://help.cleanlab.ai/tlm/tutorials/tlm_advanced/) 中進行探討。

讓我們考慮一個應用程式需要使用 `gpt-4` 模型並以 `128` 輸出 token 的範例。

```
options = {
    "model": "gpt-4",
    "max_tokens": 128,
}
llm = CleanlabTLM(api_key="your_api_key", options=options)
```

```
resp = llm.complete("Who is Paul Graham?")
```

```
print(resp)
```

```
Paul Graham is a British-born American computer scientist, entrepreneur, venture capitalist, author, and essayist. He is best known for co-founding Viaweb, which was sold to Yahoo in 1998 for over $49 million and became Yahoo Store. He also co-founded the influential startup accelerator and seed capital firm Y Combinator, which has launched over 2,000 companies including Dropbox, Airbnb, Stripe, and Reddit. Graham is also known for his essays on startup companies and programming languages.
```

要了解為什麼 TLM 對先前與馬力相關的問題估計了低信任度，請在初始化 TLM 時指定 `"explanation"` 標誌。

```
options = {
    "log": ["explanation"],
}
llm = CleanlabTLM(api_key="your_api_key", options=options)


resp = llm.complete(
    "What was the horsepower of the first automobile engine used in a commercial truck in the United States?"
)
```

```
print(resp)
```

```
The first automobile engine used in a commercial truck in the United States was in the 1899 "Motor Truck" built by the American company, the "GMC Truck Company." This early truck was equipped with a 2-horsepower engine. However, it's important to note that the development of commercial trucks evolved rapidly, and later models featured significantly more powerful engines.
```

```
print(resp.additional_kwargs["explanation"])
```

```
The proposed answer incorrectly attributes the first commercial truck in the United States to the GMC Truck Company and states that it was built in 1899 with a 2-horsepower engine. In reality, the first commercial truck is generally recognized as the "Motor Truck" built by the American company, the "GMC Truck Company," but it was actually produced by the "GMC" brand, which was established later. The first commercial truck is often credited to the "Benz Velo" or similar early models, which had varying horsepower ratings. The specific claim of a 2-horsepower engine is also misleading, as early trucks typically had more powerful engines. Therefore, the answer contains inaccuracies regarding both the manufacturer and the specifications of the engine.
This response is untrustworthy due to lack of consistency in possible responses from the model. Here's one inconsistent alternate response that the model considered (which may not be accurate either):
The horsepower of the first automobile engine used in a commercial truck in the United States was 6 horsepower.
```
