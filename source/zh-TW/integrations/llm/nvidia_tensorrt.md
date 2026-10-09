---
title: "NVIDIA TensorRT-LLM"
---

TensorRT-LLM 提供一個易於使用的 Python API，用於定義大型語言模型 (LLMs) 並建立包含最先進優化的 TensorRT engines，以便在 NVIDIA GPU 上高效地執行推論。

欲了解更多資訊，請參閱 [TensorRT-LLM GitHub repository](https://github.com/NVIDIA/TensorRT-LLM)。

## TensorRT-LLM 環境設定

由於 TensorRT-LLM 是用於在過程中與本地模型互動的 SDK，需要遵循幾個環境步驟以確保可以使用 TensorRT-LLM。要執行 TensorRT-LLM，需要 NVIDIA CUDA 12.2 或更高版本。

在本教學中，我們將展示如何使用 connector 與 GPT2 model 進行互動。為獲得最佳體驗，我們建議遵循官方 [安裝](https://github.com/NVIDIA/TensorRT-LLM/tree/v0.8.0?tab=readme-ov-file#installation) 流程，在官方 [TensorRT-LLM Github](https://github.com/NVIDIA/TensorRT-LLM) 上進行。

以下步驟將展示如何為 x86\_64 用戶設定 TensorRT-LLM v0.8.0 模型。

1. 取得並啟動基本的 docker image environment。

```
docker run --rm --runtime=nvidia --gpus all --entrypoint /bin/bash -it nvidia/cuda:12.1.0-devel-ubuntu22.04
```

2. 安裝依賴項，TensorRT-LLM 需要 Python 3.10

```
apt-get update && apt-get -y install python3.10 python3-pip openmpi-bin libopenmpi-dev git git-lfs wget
```

3. 安裝最新的穩定版本（對應發行分支）的 TensorRT-LLM。我們使用版本 0.8.0，但如需最最新的版本，請參閱 [official release page](https://github.com/NVIDIA/TensorRT-LLM/releases)。

```
pip3 install tensorrt_llm==0.8.0 -U --extra-index-url https://pypi.nvidia.com
```

4. 檢查安裝

```
python3 -c "import tensorrt_llm"
```

上述指令不應產生任何錯誤。

5. 對於此範例，我們將使用 GPT2。GPT2 模型檔案需要透過遵循 [這裡](https://github.com/NVIDIA/TensorRT-LLM/tree/main/examples/gpt#usage) 的指示來建立。

   - 首先，在容器內，在步驟 1 中啟動，複製 TensorRT-LLM repository：

   ```
   git clone --branch v0.8.0 https://github.com/NVIDIA/TensorRT-LLM.git
   ```

   - 使用以下指令安裝 GPT2 模型所需的依賴項：

   ```
   cd TensorRT-LLM/examples/gpt/ && pip install -r requirements.txt
   ```

   - 下載 hf gpt2 model

   ```
   rm -rf gpt2 && git clone https://huggingface.co/gpt2-medium gpt2
   cd gpt2
   rm pytorch_model.bin model.safetensors
   wget -q https://huggingface.co/gpt2-medium/resolve/main/pytorch_model.bin
   cd ..
   ```

   - 將權重從 HF Transformers 轉換為 TensorRT-LLM 格式

   ```
   python3 hf_gpt_convert.py -i gpt2 -o ./c-model/gpt2 --tensor-parallelism 1 --storage-type float16
   ```

   - 建置 TensorRT engine

   ```
   python3 build.py --model_dir=./c-model/gpt2/1-gpu --use_gpt_attention_plugin --remove_input_padding
   ```

6. 安裝 `llama-index-llms-nvidia-tensorrt` package

```
pip install llama-index-llms-nvidia-tensorrt
```

## 基本用法

### 使用 prompt 呼叫 `complete`

```
from llama_index.llms.nvidia_tensorrt import LocalTensorRTLLM


llm = LocalTensorRTLLM(
    model_path="./engine_outputs",
    engine_name="gpt_float16_tp1_rank0.engine",
    tokenizer_dir="gpt2",
    max_new_tokens=40,
)


resp = llm.complete("Who is Harry Potter?")
print(str(resp))
```

預期的回應應如下所示：

```
Harry Potter is a fictional character created by J.K. Rowling in her first novel, Harry Potter and the Philosopher's Stone. The character is a wizard who lives in the fictional town#
```
