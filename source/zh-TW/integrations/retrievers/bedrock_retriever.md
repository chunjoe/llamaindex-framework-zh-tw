---
title: "Bedrock (知識庫)"
---

[Knowledge bases for Amazon Bedrock](https://aws.amazon.com/bedrock/knowledge-bases/) 是 Amazon Web Services (AWS) 的服務，讓您使用私有資料來自訂 FM 回應，快速建置 RAG 應用程式。

實作 `RAG` 需要組織執行幾項繁瑣的步驟，將資料轉換為 embeddings (vectors)，將 embeddings 儲存到專門的 vector database 中，並在資料庫中建立自訂整合，以搜尋和檢索與使用者查詢相關的文字。這可能耗時且效率低下。

使用 `Knowledge Bases for Amazon Bedrock`，只需指向您資料在 `Amazon S3` 中的位置，`Knowledge Bases for Amazon Bedrock` 就會處理整個 ingestion workflow 到您的 vector database 的過程。如果您沒有現有的 vector database，Amazon Bedrock 會為您建立一個 Amazon OpenSearch Serverless vector store。

Knowledge base 可以透過 [AWS Console](https://aws.amazon.com/console/) 或使用 [AWS SDKs](https://aws.amazon.com/developer/tools/) 來設定。

在本筆筆記中，我們介紹了在 Llama Index 中透過 Retrieve API 來整合 AmazonKnowledgeBasesRetriever - Amazon Bedrock，以便從 knowledge bases 中檢索與使用者查詢相關的結果。

## 使用 Knowledge Base Retriever

```
%pip install --upgrade --quiet  boto3 botocore
%pip install llama-index
%pip install llama-index-retrievers-bedrock
```

有關 `retrieval_config` 的支援參數，請查閱 boto3 文件：[link](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/bedrock-agent-runtime/client/retrieve.html)

若要使用 `retrieval_config` 中的 filters，您需要為您的資料來源設定 metadata json 檔案。更多資訊請參閱：[link](https://aws.amazon.com/blogs/machine-learning/knowledge-bases-for-amazon-bedrock-now-supports-metadata-filtering-to-improve-retrieval-accuracy/)

```
from llama_index.retrievers.bedrock import AmazonKnowledgeBasesRetriever


retriever = AmazonKnowledgeBasesRetriever(
    knowledge_base_id="<knowledge-base-id>",
    retrieval_config={
        "vectorSearchConfiguration": {
            "numberOfResults": 4,
            "overrideSearchType": "HYBRID",
            "filter": {"equals": {"key": "tag", "value": "space"}},
        }
    },
)
```

```
query = "How big is Milky Way as compared to the entire universe?"
retrieved_results = retriever.retrieve(query)


# Prints the first retrieved result
print(retrieved_results[0].get_content())
```

## 使用 retriever 進行查詢，搭配 Bedrock LLMs

```
%pip install llama-index-llms-bedrock
```

```
from llama_index.core import get_response_synthesizer
from llama_index.llms.bedrock.base import Bedrock


llm = Bedrock(model="anthropic.claude-v2", temperature=0, max_tokens=3000)
response_synthesizer = get_response_synthesizer(
    response_mode="compact", llm=llm
)
response_obj = response_synthesizer.synthesize(query, retrieved_results)
print(response_obj)
```
