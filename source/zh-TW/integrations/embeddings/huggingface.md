---
title: "使用 HuggingFace 的本地嵌入"
---

LlamaIndex 支援 HuggingFace embedding models，包括 Sentence Transformer 模型，例如 BGE、Mixedbread、Nomic、Jina、E5 等。我們可以使用這些模型為 documents 建立 embeddings 以及為檢索建立 queries。

此外，我們提供可用於建立與使用之工具 ONNX 以及 OpenVINO 使用 the 的模型 [Optimum library](https://huggingface.co/docs/optimum) 來自 HuggingFace.

## HuggingFaceEmbedding

基礎 `HuggingFaceEmbedding` class 是針對任何的通用封裝類別 HuggingFace 用於 embeddings 的 model。 全部 [向量嵌入 models](https://huggingface.co/models?library=sentence-transformers) on Hugging Face 應該可以運作。 您可以參考該 [embeddings leaderboard](https://huggingface.co/spaces/mteb/leaderboard) 以獲取更多建議。

此類別依賴於 sentence-transformers 套件，您可以使用 `pip install sentence-transformers`.
 進行安裝。
NOTE: 如果您先前使用的是一個 `HuggingFaceEmbeddings` 來自 LangChain，這應該會產生相同的結果。

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙.

```
%pip install llama-index-embeddings-huggingface
```

```
!pip install llama-index
```

```
from llama_index.embeddings.huggingface import HuggingFaceEmbedding


# loads https://huggingface.co/BAAI/bge-small-en-v1.5
embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")
```

```
embeddings = embed_model.get_text_embedding("Hello World!")
print(len(embeddings))
print(embeddings[:5])
```

```
384
[-0.003275700844824314, -0.011690810322761536, 0.041559211909770966, -0.03814814239740372, 0.024183044210076332]
```

## Benchmarking

讓我們嘗試比較使用一個經典的大型 document — 即 IPCC 氣候報告第三章 
。
```
!curl https://www.ipcc.ch/report/ar6/wg2/downloads/report/IPCC_AR6_WGII_Chapter03.pdf --output IPCC_AR6_WGII_Chapter03.pdf
```

```
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed


  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
100 20.7M  100 20.7M    0     0  69.6M      0 --:--:-- --:--:-- --:--:-- 70.0M
```

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core import Settings


documents = SimpleDirectoryReader(
    input_files=["IPCC_AR6_WGII_Chapter03.pdf"]
).load_data()
```

### Base HuggingFace Embeddings

```
from llama_index.embeddings.huggingface import HuggingFaceEmbedding


# loads BAAI/bge-small-en-v1.5 with the default torch backend
embed_model = HuggingFaceEmbedding(
    model_name="BAAI/bge-small-en-v1.5",
    device="cpu",
    embed_batch_size=8,
)
test_embeds = embed_model.get_text_embedding("Hello World!")


Settings.embed_model = embed_model
```

```
%%timeit -r 1 -n 1
index = VectorStoreIndex.from_documents(documents, show_progress=True)
```

```
Parsing nodes: 100%|██████████| 172/172 [00:00<00:00, 428.44it/s]
Generating embeddings: 100%|██████████| 459/459 [00:19<00:00, 23.32it/s]




20.2 s ± 0 ns per loop (mean ± std. dev. of 1 run, 1 loop each)
```

### ONNX Embeddings

```
# pip install sentence-transformers[onnx]


# loads BAAI/bge-small-en-v1.5 with the onnx backend
embed_model = HuggingFaceEmbedding(
    model_name="BAAI/bge-small-en-v1.5",
    device="cpu",
    backend="onnx",
    model_kwargs={
        "provider": "CPUExecutionProvider"
    },  # For ONNX, you can specify the provider, see https://sbert.net/docs/sentence_transformer/usage/efficiency.html
)
test_embeds = embed_model.get_text_embedding("Hello World!")


Settings.embed_model = embed_model
```

```
%%timeit -r 1 -n 1
index = VectorStoreIndex.from_documents(documents, show_progress=True)
```

```
Parsing nodes: 100%|██████████| 172/172 [00:00<00:00, 421.63it/s]
Generating embeddings: 100%|██████████| 459/459 [00:31<00:00, 14.53it/s]


32.1 s ± 0 ns per loop (mean ± std. dev. of 1 run, 1 loop each)
```

### OpenVINO Embeddings

```
# pip install sentence-transformers[openvino]


# loads BAAI/bge-small-en-v1.5 with the openvino backend
embed_model = HuggingFaceEmbedding(
    model_name="BAAI/bge-small-en-v1.5",
    device="cpu",
    backend="openvino",  # OpenVINO is very strong on CPUs
    revision="refs/pr/16",  # BAAI/bge-small-en-v1.5 itself doesn't have an OpenVINO model currently, but there's a PR with it that we can load: https://huggingface.co/BAAI/bge-small-en-v1.5/discussions/16
    model_kwargs={
        "file_name": "openvino_model_qint8_quantized.xml"
    },  # If we're using an optimized/quantized model, we need to specify the file name like this
)
test_embeds = embed_model.get_text_embedding("Hello World!")


Settings.embed_model = embed_model
```

```
%%timeit -r 1 -n 1
index = VectorStoreIndex.from_documents(documents, show_progress=True)
```

```
Parsing nodes: 100%|██████████| 172/172 [00:00<00:00, 403.15it/s]
Generating embeddings: 100%|██████████| 459/459 [00:08<00:00, 53.83it/s]




9.03 s ± 0 ns per loop (mean ± std. dev. of 1 run, 1 loop each)
```

### References

- [Local Embedding Models](https://docs.llamaindex.ai/en/stable/module_guides/models/embeddings/#local-embedding-models) 詳細說明如何使用 像這樣的本地模型。
- [Sentence Transformers > Speeding 向上 Inference](https://sbert.net/docs/sentence_transformer/usage/efficiency.html) 包含關於如何有效使用後端選項的詳細文件，包括針對以下項目的最佳化與量化： ONNX 以及 OpenVINO.
