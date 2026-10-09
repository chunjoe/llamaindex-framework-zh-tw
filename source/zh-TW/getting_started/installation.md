---
title: "安裝與設定"
---

LlamaIndex 生態系統由一系列採命名空間組織的 Python 套件構成。

對使用者來說，`pip install llama-index` 會安裝一組核心入門套件，您也能視需求另行安裝整合套件。

完整的套件與可用整合清單請見[整合套件頁面](/python/framework/community/integrations/)。

## 使用 pip 快速安裝

想快速開始，請執行以下指令：

終端機視窗

```
pip install llama-index
```

這組入門套件包含：

- `llama-index-core`
- `llama-index-llms-openai`
- `llama-index-embeddings-openai`
- `llama-index-readers-file`

**注意：** `llama-index-core` 預先附有 NLTK 和 tiktoken 檔案，可避免程式執行時下載檔案和呼叫網路。

### 重要：設定 OpenAI 環境

預設會使用 OpenAI `gpt-3.5-turbo` 產生文字，並以 `text-embedding-ada-002` 執行檢索與嵌入向量（新專案建議明確傳入 `model="text-embedding-3-small"`）。若要使用這些功能，請先將 OPENAI\_API\_KEY 設為環境變數。登入 OpenAI 帳戶後，即可[建立新的 API 金鑰](https://platform.openai.com/account/api-keys)。

提示

您也可以[使用眾多其他可用的 LLM](/python/framework/module_guides/models/llms/usage_custom/)。依照 LLM 服務提供者而定，您可能還需要設定額外的環境變數和 token。

[查看 OpenAI 入門範例](/python/framework/getting_started/starter_example/)

## 使用 pip 自訂安裝

如果您不使用 OpenAI，或希望自行挑選要安裝的套件，可以按需求逐一安裝。

例如，要使用 Ollama 和 HuggingFace 嵌入模型建立本機環境，可安裝：

終端機視窗

```
pip install llama-index-core llama-index-readers-file llama-index-llms-ollama llama-index-embeddings-huggingface
```

[查看本機模型入門範例](/python/framework/getting_started/starter_example_local/)

[查看 LLM 使用與設定完整指南](/python/framework/module_guides/models/llms/)。

[查看 嵌入模型使用與設定完整指南](/python/framework/module_guides/models/embeddings/)。

## 從原始碼安裝

先複製此儲存庫：`git clone https://github.com/run-llama/llama_index.git`，接著依序執行：

- [安裝 Poetry](https://python-poetry.org/docs/#installation) - 協助管理套件相依性

- 若要使用 Poetry 執行 shell 命令，但尚未安裝 shell 外掛程式，請執行以下指令新增：

  ```
  poetry self add poetry-plugin-shell
  ```

- `poetry shell` - 此指令會建立虛擬環境，讓安裝的套件限制在此專案中

- `pip install -e llama-index-core` - 安裝核心套件

- （可選）`poetry install --with dev,docs` - 安裝大多數本機開發工作所需的所有相依套件

接著可依需求使用 `pip` 安裝整合套件，例如：

終端機視窗

```
pip install -e llama-index-integrations/readers/llama-index-readers-file
pip install -e llama-index-integrations/llms/llama-index-llms-ollama
```
