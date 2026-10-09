---
title: "MyMagic AI LLM"
---

## 簡介

本筆記演示如何使用 MyMagicAI 進行儲存在雲端 Bucket 中的大量資料的批次推論。所實作的端點僅有 `complete` 和 `acomplete`，可用於包括 Completion、Summariation 和 Extraction 在內的許多用例。要使用本筆記，您需要從 MyMagicAI 取得一個 API 金鑰（Personal Access Token）以及儲存在雲端 Bucket 中的資料。點擊 [MyMagicAI 的網站](https://mymagic.ai/) 上的 Get Started 註冊，即可取得您的 API 金鑰。

## 設定

若要設定您的 Bucket 並授予 MyMagic API 對您的雲端儲存的安全存取權，請參閱 [MyMagic docs](https://docs.mymagic.ai/)。如果您在 Colab 中開啟本 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index-llms-mymagic
```

```
!pip install llama-index
```

```
from llama_index.llms.mymagic import MyMagicAI
```

```
llm = MyMagicAI(
    api_key="your-api-key",
    storage_provider="s3",  # s3, gcs
    bucket_name="your-bucket-name",
    session="your-session-name",  # files should be located in this folder on which batch inference will be run
    role_arn="your-role-arn",
    system_prompt="your-system-prompt",
    region="your-bucket-region",
    return_output=False,  # Whether you want MyMagic API to return the output json
    input_json_file=None,  # name of the input file (stored on the bucket)
    list_inputs=None,  # Option to provide inputs as a list in case of small batch
    structured_output=None,  # json schema of the output
)
```

注意：如果在上方設定了 return\_output 為 True，max\_tokens 應設定為至少 100

```
resp = llm.complete(
    question="your-question",
    model="chhoose-model",  # currently we support mistral7b, llama7b, mixtral8x7b, codellama70b, llama70b, more to come...
    max_tokens=5,  # number of tokens to generate, default is 10
)
```

```
# The response indicated that the final output is stored in your bucket or raises an exception if the job failed
print(resp)
```


## 使用 `acomplete` 端點進行非同步請求

對於非同步操作，請使用以下方法。

```
import asyncio
```

```
async def main():
    response = await llm.acomplete(
        question="your-question",
        model="choose-model",  # supported models constantly updated and are listed at docs.mymagic.ai
        max_tokens=5,  # number of tokens to generate, default is 10
    )


    print("Async completion response:", response)
```

```
await main()
```
