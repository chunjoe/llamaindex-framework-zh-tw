---
title: "已棄用的術語"
---

隨著 LlamaIndex 持續演進，許多 class 名稱與 API 已進行調整、優化或棄用。

以下是先前常用的棄用術語清單及其對應的替代方案連結。

## GPTSimpleVectorIndex

此名稱已更改為 `VectorStoreIndex`，並將所有向量索引統一為單一介面。您可以透過修改底層的 `vector_store` 來整合各種向量資料庫。

請參閱以下連結以了解更多使用詳情。

- [Index Usage Pattern](/python/framework/module_guides/evaluating/usage_pattern/)
- [Vector Store Guide](/python/framework/module_guides/indexing/vector_store_index/)
- [Vector Store Integrations](/python/framework/community/integrations/vector_stores/)

## GPTVectorStoreIndex

此名稱已更改為 `VectorStoreIndex`，但僅為名稱上的變更。請參閱以下連結以了解更多使用詳情。

- [Index Usage Pattern](/python/framework/module_guides/evaluating/usage_pattern/)
- [Vector Store Guide](/python/framework/module_guides/indexing/vector_store_index/)
- [Vector Store Integrations](/python/framework/community/integrations/vector_stores/)

## LLMPredictor

`LLMPredictor` 物件不再建議使用者直接使用。您可以直接設定 LLM，並將其傳遞至 `Settings` 或使用 LLM 的介面。`LLM` class 本身具有與 `LLMPredictor` 相似的屬性與方法。

- [LLMs 位於 LlamaIndex](/python/framework/module_guides/models/llms/)
- [Setting LLMs 的 Settings](/python/framework/module_guides/supporting_modules/settings/)
 中
## PromptHelper and max\_input\_size/

Prompt helper 的 `max_input_size` 參數已被 `context_window` 取代。

整體而言，`PromptHelper` 已被棄用，建議直接在 `service_context` 與 `node_parser` 中指定參數。

請參閱以下連結以了解更多詳情。

- [Configuring settings 在 the Settings](/python/framework/module_guides/supporting_modules/settings/)
- [Parsing Documents 至 Nodes](/python/framework/module_guides/loading/node_parsers/)

## ServiceContext

`ServiceContext` 物件已被棄用，請改用 `Settings` 物件。

- [Configuring settings 在 Settings](/python/framework/module_guides/supporting_modules/settings/)
 中
## llama-index-legacy

`llama-index-legacy` 套件已被棄用並從儲存庫中移除。請參閱最新的入門指南以獲取最新資訊與用法。

- [開始使用](/python/framework/getting_started/installation/)

## AgentRunner/AgentWorker （及相關類別）

`AgentRunner` 與 `AgentWorker` class 已被棄用，請改用 [AgentWorkflow](/python/framework/module_guides/deploying/agents/) 與 [Workflows](https://developers.llamaindex.ai/python/framework/module_guides/workflow/)。

這包括以下被棄用的 class：

- `AgentRunner`
- `FunctionCallingAgent`
- `FunctionCallingAgentWorker`
- `llama_index.core.agent.ReActAgent` (請使用 [llama\_index.core.agent.workflow.ReActAgent](/python/framework/module_guides/deploying/agents/))
- `ReActAgentWorker`
- `LATSAgentWorker`
- `CoAAgentWorker`
- `FnAgentWorker`
- `QueryPipelineAgentWorker`
- `MultiModalReActAgentWorker`
- `IntrospectiveAgentWorker`
- `SelfReflectiveAgentWorker`
- `ToolInteractiveReflectionAgentWorker`
- `LLMCompilerAgentWorker`
- `QueryUnderstandAgentWorker`

## QueryPipeline （及相關類別）

QueryPipeline 已被棄用，請改用 [Workflows](https://developers.llamaindex.ai/python/framework/module_guides/workflow/)。

這包括以下被棄用的 class：

- `AgentFnComponent`
- `AgentInputComponent`
- `BaseAgentComponent`
- `CustomAgentComponent`
- `ArgPackComponent`
- `FnComponent`
- `FunctionComponent`
- `InputComponent`
- `RouterComponent`
- `SelectorComponent`
- `ToolRunnerComponent`
- `StatefulFnComponent`
- `LoopComponent`
- 等等。