---
title: "貢獻 `LabelledRagDataset`"
---

**注意：** LlamaDatasets 已棄用且不再維護。本頁僅供參考，不再接受新的提交。

建立一個更穩健的 RAG 系統需要多元化的評估套件。這就是我們推出 `LlamaDatasets` 的原因。在本頁中，我們將討論如何貢獻第一種可用的 `LlamaDataset`，即 `LabelledRagDataset`。

貢獻一個 `LabelledRagDataset` 涉及兩個高階步驟。一般來說，您必須建立 `LabelledRagDataset`，將其儲存為 json，並提交此 json 檔案和原始文本檔案到我們的 [llama-datasets repository](https://github.com/run-llama/llama_datasets)。此外，您還需要建立一個 pull request，將資料集的所需 metadata 上傳到我們的 [llama-hub repository](https://github.com/run-llama/llama-hub)。

為了讓提交流程更順暢，我們準備了一個範本 notebook，您可以依照此範本從零開始建立一個 `LabelledRagDataset`（或將結構相似的問答資料集轉換為此），並執行其他必要的步驟來完成您的提交。請參閱下方連結的「LlamaDataset Submission Template Notebook」。

## 貢獻其他 llama-datasets

貢獻我們其他 llama-datasets（例如 `LabelledEvaluatorDataset`）的通用流程與先前描述的 `LabelledRagDataset` 的流程相同。這些其他資料集的提交範本即將推出！

## 提交範例

閱讀完整的 [提交範例 Notebook](https://developers.llamaindex.ai/python/examples/llama_dataset/ragdataset_submission_template/index.md)。