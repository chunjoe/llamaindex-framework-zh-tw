---
title: "NVIDIA Triton"
---

[NVIDIA Triton Inference Server](https://github.com/triton-inference-server/server) 提供針對 CPU 和 GPU 優化的雲端及邊緣推論解決方案。此 connector 允許 LlamaIndex 遠端與部署了 Triton 的 TensorRT-LLM 模型進行互動。

## 啟動 Triton Inference Server

此 connector 需要一個正在運行的 Triton Inference Server 實例，並帶有一個 TensorRT-LLM 模型。在此範例中，我們將使用 [Triton Command Line Interface (Triton CLI)](https://github.com/triton-inference-server/triton_cli) 在 Triton 上部署一個 GPT2 模型。

當在主機上（不在 Triton container image 內）使用 Triton 及相關工具時，可能需要額外的依賴項來處理各種 workflows。大多數系統依賴問題都可以透過在最新的對應 `tritonserver` container image 內部安裝並執行 CLI 來解決，該 image 應已安裝所有必要的系統依賴項。

對於 TRT-LLM，您可以使用 `nvcr.io/nvidia/tritonserver:{YY.MM}-trtllm-python-py3` image，其中 `YY.MM` 對應於 `tritonserver` 的版本，例如在此範例中我們使用的是 24.02 版本。如需獲取可用版本的列表，請參閱 [Triton Inference Server NGC](https://catalog.ngc.nvidia.com/orgs/nvidia/containers/tritonserver)。

要啟動 container，在您的 Linux 終端機中執行：

```
docker run -ti --gpus all --network=host --shm-size=1g --ulimit memlock=-1 nvcr.io/nvidia/tritonserver:24.02-trtllm-python-py3
```

接下來，我們需要安裝以下依賴項：

```
pip install \
  "psutil" \
  "pynvml>=11.5.0" \
  "torch==2.1.2" \
  "tensorrt_llm==0.8.0" --extra-index-url https://pypi.nvidia.com/
```

最後，執行以下指令來安裝 Triton CLI。

```
pip install git+https://github.com/triton-inference-server/triton_cli.git
```

要為 GPT2 模型生成模型儲存庫並啟動 Triton Server 實例，請執行以下指令：

```
triton remove -m all
triton import -m gpt2 --backend tensorrtllm
triton start &
```

預設情況下，Triton 監聽在 `localhost:8000` (HTTP) 和 `localhost:8001` (gRPC)。此範例使用 gRPC port。

如需更多資訊，請參閱 [Triton CLI GitHub repository](https://github.com/triton-inference-server/triton_cli)。

## 安裝 tritonclient

由於我們正在與 Triton Inference Server 互動，您需要 [安裝](https://github.com/triton-inference-server/client?tab=readme-ov-file#download-using-python-package-installer-pip) `tritonclient` package。

```
pip install tritonclient[all]
```

接下來，我們將安裝 llama index connector。

```
pip install llama-index-llms-nvidia-triton
```


## 基本用法

#### 使用 prompt 呼叫 `complete`

```
from llama_index.llms.nvidia_triton import NvidiaTriton


# A Triton server instance must be running. Use the correct URL for your desired Triton server instance.
triton_url = "localhost:8001"
model_name = "gpt2"
resp = NvidiaTriton(server_url=triton_url, model_name=model_name, tokens=32).complete("The tallest mountain in North America is ")
print(resp)
```

您應該預期收到以下回應

```
the Great Pyramid of Giza, which is about 1,000 feet high. The Great Pyramid of Giza is the tallest mountain in North America.
```

#### 使用 prompt 呼叫 `stream_complete`

```
resp = NvidiaTriton(server_url=triton_url, model_name=model_name, tokens=32).stream_complete("The tallest mountain in North America is ")
for delta in resp:
    print(delta.delta, end=" ")
```

您應該預期收到以下串流回應

```
the Great Pyramid of Giza, which is about 1,000 feet high. The Great Pyramid of Giza is the tallest mountain in North America.
```


## 相關

有關 Triton Inference Server 的更多資訊，請參閱以下資源：

- [Quickstart guide](https://github.com/triton-inference-server/server/blob/main/docs/getting_started/quickstart.md#quickstart)
- [NVIDIA Developer Triton page](https://developer.nvidia.com/triton-inference-server)
- [GitHub issues](https://github.com/triton-inference-server/server/issues)