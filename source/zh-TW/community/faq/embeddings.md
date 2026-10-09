---
title: "嵌入 (Embeddings)"
---

##### 常見問題 (FAQ)

1. [如何使用自訂/本地 embedding model？](/python/framework/community/faq/embeddings/#1-how-to-use-a-customlocal-embedding-model)
2. [如何使用本地 hugging face embedding model？](/python/framework/community/faq/embeddings/#2-how-to-use-a-local-hugging-face-embedding-model)
3. [如何使用 embedding model 為文字生成 embeddings？](/python/framework/community/faq/embeddings/#3-how-to-use-embedding-model-to-generate-embeddings-for-text)
4. [如何使用 Huggingface Text-Embedding Inference 與 LlamaIndex？](/python/framework/community/faq/embeddings/#4-how-to-use-huggingface-text-embedding-inference-with-llamaindex)

---

##### 1. 如何使用自訂/本地 embedding model？

要建立您自訂的 embedding class，您可以參考 [自訂 Embeddings](https://developers.llamaindex.ai/python/examples/embeddings/custom_embeddings/index.md) 指南。

---

##### 2. 如何使用本地 hugging face embedding model？

若要使用本地 HuggingFace embedding model，您可以參考 [使用 HuggingFace 的本地 Embeddings](https://developers.llamaindex.ai/python/examples/embeddings/huggingface/index.md) 指南。

---

##### 3. 如何使用 embedding model 為文字生成 embeddings？

您可以使用以下程式碼為文字生成 embeddings。

```
text_embedding = embed_model.get_text_embedding("YOUR_TEXT")
```

---

##### 4. 如何使用 Huggingface Text-Embedding Inference 與 LlamaIndex？

若要使用 HuggingFace Text-Embedding Inference，您可以參考 [文字向量-Inference](https://developers.llamaindex.ai/python/examples/embeddings/text_embedding_inference/index.md) 教學。