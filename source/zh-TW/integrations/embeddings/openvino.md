---
title: "使用 OpenVINO 的本地嵌入"
---

[OpenVINO™](https://github.com/openvinotoolkit/openvino) 是一個用於優化和部署 AI 推理的開源工具包。OpenVINO™ Runtime 支援多種硬體 [devices](https://github.com/openvinotoolkit/openvino?tab=readme-ov-file#supported-hardware-matrix)，包括 x86 和 ARM CPU，以及 Intel GPU。它可以幫助提升電腦視覺 (Computer Vision)、自動語音識別 (Automatic Speech Recognition)、自然語言處理 (Natural Language Processing) 和其他常用任務中的深度學習效能。

Hugging Face embedding model 可以透過 `OpenVINOEmbedding` 或 `OpenVINOGENAIEmbedding` class 透過 OpenVINO 支援，而 OpenClip model 可以透過 `OpenVINOClipEmbedding` class 透過 OpenVINO 支援。

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-embeddings-openvino
```

```
!pip install llama-index
```

## Model Exporter

可以使用 `create_and_save_openvino_model` function 將您的 model 匯出為 OpenVINO IR 格式，並從本地資料夾載入 model。

```
from llama_index.embeddings.huggingface_openvino import OpenVINOEmbedding


OpenVINOEmbedding.create_and_save_openvino_model(
    "BAAI/bge-small-en-v1.5", "./bge_ov"
)
```

```
/home2/ethan/intel/llama_index/llama_test/lib/python3.10/site-packages/openvino/runtime/__init__.py:10: DeprecationWarning: The `openvino.runtime` module is deprecated and will be removed in the 2026.0 release. Please replace `openvino.runtime` with `openvino`.
  warnings.warn(




Saved OpenVINO model to ./bge_ov. Use it with `embed_model = OpenVINOEmbedding(model_id_or_path='./bge_ov')`.
```

## 模型載入

如果您有 Intel GPU，可以指定 `device="gpu"` 在其上執行 inference。

```
ov_embed_model = OpenVINOEmbedding(model_id_or_path="./bge_ov", device="cpu")
```

```
embeddings = ov_embed_model.get_text_embedding("Hello World!")
print(len(embeddings))
print(embeddings[:5])
```

```
384
[-0.0030246784444898367, -0.012189766392111778, 0.04163273051381111, -0.037758368998765945, 0.02439723163843155]
```

## 使用 OpenVINO GenAI
載入模型
為避免 PyTorch 在 runtime 中的依賴，您可以使用 `OpenVINOGENAIEmbedding` class 載入您的本地 embedding model。

```
%pip install llama-index-embeddings-openvino-genai
```

```
from llama_index.embeddings.openvino_genai import OpenVINOGENAIEmbedding


ov_embed_model = OpenVINOGENAIEmbedding(model_path="./bge_ov", device="CPU")
```

```
/home2/ethan/intel/llama_index/llama_test/lib/python3.10/site-packages/openvino/runtime/__init__.py:10: DeprecationWarning: The `openvino.runtime` module is deprecated and will be removed in the 2026.0 release. Please replace `openvino.runtime` with `openvino`.
  warnings.warn(
```

```
embeddings = ov_embed_model.get_text_embedding("Hello World!")
print(len(embeddings))
print(embeddings[:5])
```

```
384
[-0.0030246784444898367, -0.012189766392111778, 0.04163273051381111, -0.037758368998765945, 0.02439723163843155]
```

## OpenClip Model Exporter

Class `OpenVINOClipEmbedding` 可以支援使用 OpenVINO runtime 匯出和載入 open\_clip models。

```
%pip install open_clip_torch
```

```
from llama_index.embeddings.huggingface_openvino import (
    OpenVINOClipEmbedding,
)


OpenVINOClipEmbedding.create_and_save_openvino_model(
    "laion/CLIP-ViT-B-32-laion2B-s34B-b79K",
    "ViT-B-32-ov",
)
```

## MultiModal Model Loading

如果您有 Intel GPU，可以指定 `device="GPU"` 在其上執行 inference。

```
ov_clip_model = OpenVINOClipEmbedding(
    model_id_or_path="./ViT-B-32-ov", device="CPU"
)
```

## Embed 使用 images 和 queries 進行 OpenVINO

```
from PIL import Image
import requests
from numpy import dot
from numpy.linalg import norm


image_url = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStMP8S3VbNCqOQd7QQQcbvC_FLa1HlftCiJw&s"
im = Image.open(requests.get(image_url, stream=True).raw)
print("Image:")
display(im)


im.save("logo.jpg")
image_embeddings = ov_clip_model.get_image_embedding("logo.jpg")
print("Image dim:", len(image_embeddings))
print("Image embed:", image_embeddings[:5])


text_embeddings = ov_clip_model.get_text_embedding(
    "Logo of a pink blue llama on dark background"
)
print("Text dim:", len(text_embeddings))
print("Text embed:", text_embeddings[:5])


cos_sim = dot(image_embeddings, text_embeddings) / (
    norm(image_embeddings) * norm(text_embeddings)
)
print("Cosine similarity:", cos_sim)
```

```
Image:
```

![png](/assets/32a3cd41309b.png)

```
Image dim: 512
Image embed: [-0.03019799292087555, -0.09727513045072556, -0.6659489274024963, -0.025658488273620605, 0.05379948765039444]
Text dim: 512
Text embed: [-0.15816599130630493, -0.25564345717430115, 0.22376027703285217, -0.34983670711517334, 0.31968361139297485]
Cosine similarity: 0.27307014923203976
```

如需更多資訊，請參閱：

- [OpenVINO LLM guide](https://docs.openvino.ai/2024/learn-openvino/llm_inference_guide.html)。

- [OpenVINO Documentation](https://docs.openvino.ai/2024/home.html)。

- [OpenVINO 入門指南](https://www.intel.com/content/www/us/en/content-details/819067/openvino-get-started-guide.html)。

- [RAG 範例使用 LlamaIndex](https://github.com/openvinotoolkit/openvino_notebooks/tree/latest/notebooks/llm-rag-llamaindex)。