---
title: "Oracle AI Vector Search：生成 Embeddings"
---

Oracle AI Vector Search 專為人工智慧 (AI) 工作負載設計，讓您能夠根據語義而非關鍵字來查詢資料。Oracle AI Vector Search 的最大優勢之一是，可以在單一系統中將非結構化資料的語義搜尋與業務資料的關聯式搜尋結合。這不僅功能強大，而且效率也顯著更高，因為您無需新增專門的 vector database，從而消除了多個系統之間資料片段化的困擾。

此外，您的 vectors 可以受益於 Oracle Database 最強大的所有功能，例如：

- [Partitioning Support](https://www.oracle.com/database/technologies/partitioning.html)
- [Real Application Clusters scalability](https://www.oracle.com/database/real-application-clusters/)
- [Exadata smart scans](https://www.oracle.com/database/technologies/exadata/software/smartscan/)
- [Shard processing across geographically distributed databases](https://www.oracle.com/database/distributed-database/)
- [Transactions](https://docs.oracle.com/en/database/oracle/oracle-database/23/cncpt/transactions.html)
- [Parallel SQL](https://docs.oracle.com/en/database/oracle/oracle-database/21/vldbg/parallel-exec-intro.html#GUID-D28717E4-0F77-44F5-BB4E-234C31D4E4BA)
- [Disaster recovery](https://www.oracle.com/database/data-guard/)
- [Security](https://www.oracle.com/security/database-security/)
- [Oracle Machine Learning](https://www.oracle.com/artificial-intelligence/database-machine-learning/)
- [Oracle Graph Database](https://www.oracle.com/database/integrated-graph-database/)
- [Oracle Spatial and Graph](https://www.oracle.com/database/spatial/)
- [Oracle Blockchain](https://docs.oracle.com/en/database/oracle/oracle-database/23/arpls/dbms_blockchain_table.html#GUID-B469E277-978E-4378-A8C1-26D3FF96C9A6)
- [JSON](https://docs.oracle.com/en/database/oracle/oracle-database/23/adjsn/json-in-oracle-database.html)

本指南將演示如何使用 Oracle AI Vector Search 中的 Embedding Capabilities，使用 OracleEmbeddings 為您的 documents 生成 embeddings。

如果您剛開始使用 Oracle Database，請考慮探索 [free Oracle 23 AI](https://www.oracle.com/database/free/#resources)，它為設定您的資料庫環境提供了很好的入門介紹。在操作資料庫時，通常建議避免預設使用系統使用者；相反地，您可以建立自己的使用者以增強安全性與客製化。有關使用者建立的詳細步驟，請參閱我們的 [端到端指南](https://github.com/run-llama/llama_index/blob/main/docs/examples/cookbooks/oracleai_demo.ipynb)，該指南也展示了如何在 Oracle 中設定使用者。此外，了解使用者權限對於有效管理資料庫安全性至關重要。您可以在官方的 [Oracle guide](https://docs.oracle.com/en/database/oracle/oracle-database/19/admqs/administering-user-accounts-and-security.html#GUID-36B21D72-1BBB-46C9-A0C9-F0D2A8591B8D) 中了解有關管理使用者帳戶和安全性的更多資訊。

### 先決條件

請確保已安裝 Oracle Python Client driver，以協助 llama\_index 與 Oracle AI Vector Search 的整合。

```
%pip install llama-index-embeddings-oracleai
```

### 連線到 Oracle Database

以下範例程式碼將展示如何連線到 Oracle Database。預設情況下，python-oracledb 以 ‘Thin’ 模式運行，直接連線到 Oracle Database。此模式不需要 Oracle Client libraries。然而，當 python-oracledb 使用它們時，會提供額外的功能。當使用 Oracle Client libraries 時，Python-oracledb 被稱為 ‘Thick’ 模式。這兩種模式都具備全面功能，支援 Python Database API v2.0 Specification。請參閱以下 [guide](https://python-oracledb.readthedocs.io/en/latest/user_guide/appendix_a.html#featuresummary)，其中說明了每種模式支援的功能。如果您無法使用 thin-mode，可能需要切換到 thick-mode。

```
import sys


import oracledb


# Update the following variables with your Oracle database credentials and connection details
username = "<username>"
password = "<password>"
dsn = "<hostname>/<service_name>"


try:
    conn = oracledb.connect(user=username, password=password, dsn=dsn)
    print("Connection successful!")
except Exception as e:
    print("Connection failed!")
    sys.exit(1)
```

對於 embedding 生成，使用者有幾種提供者選項可供選擇，包括在資料庫內進行 embedding 生成，以及 OcigenAI、Hugging Face 和 OpenAI 等第三方服務。選擇使用第三方提供者的使用者必須建立包含所需驗證資訊的憑證。或者，如果使用者選擇 ‘database’ 作為其提供者，則必須將 ONNX model 載入到 Oracle Database 中以協助 embedding。

### 載入 ONNX Model

Oracle 支援多種 embedding provider，讓使用者可以在專有的資料庫解決方案和 OCIGENAI、HuggingFace 等第三方服務之間進行選擇。此選擇決定了生成和管理 embeddings 的方法。

***重要***：如果使用者選擇資料庫選項，則必須將 ONNX model 上傳到 Oracle Database 中。相反地，如果選擇第三方提供者進行 embedding 生成，則無需將 ONNX model 上傳到 Oracle Database。直接在 Oracle 中使用 ONNX 模型的一大優勢是它能透過消除向外部方傳輸資料的需求，提供增強的安全性與效能。此外，此方法避免了通常與 network 或 REST API 呼叫相關的延遲。

以下是將 ONNX 模型上傳到 Oracle Database 的範例程式碼：

```
from llama_index.embeddings.oracleai import OracleEmbeddings


# please update with your related information
# make sure that you have onnx file in the system
onnx_dir = "DEMO_DIR"
onnx_file = "tinybert.onnx"
model_name = "demo_model"


try:
    OracleEmbeddings.load_onnx_model(conn, onnx_dir, onnx_file, model_name)
    print("ONNX model loaded.")
except Exception as e:
    print("ONNX model loading failed!")
    sys.exit(1)
```

### 建立憑證

當選擇第三方提供者來生成 embeddings 時，使用者需要建立憑證以安全地存取提供者的 endpoint。

***重要：*** 選擇使用「database」提供者來生成 embeddings 時，不需要憑證。然而，如果使用者決定使用第三方提供者，則必須為所選的提供者建立特定的憑證。

以下是一個說明範例：

```
try:
    cursor = conn.cursor()
    cursor.execute(
        """
       declare
           jo json_object_t;
       begin
           -- HuggingFace
           dbms_vector_chain.drop_credential(credential_name  => 'HF_CRED');
           jo := json_object_t();
           jo.put('access_token', '<access_token>');
           dbms_vector_chain.create_credential(
               credential_name   =>  'HF_CRED',
               params            => json(jo.to_string));


           -- OCIGENAI
           dbms_vector_chain.drop_credential(credential_name  => 'OCI_CRED');
           jo := json_object_t();
           jo.put('user_ocid','<user_ocid>');
           jo.put('tenancy_ocid','<tenancy_ocid>');
           jo.put('compartment_ocid','<compartment_ocid>');
           jo.put('private_key','<private_key>');
           jo.put('fingerprint','<fingerprint>');
           dbms_vector_chain.create_credential(
               credential_name   => 'OCI_CRED',
               params            => json(jo.to_string));
       end;
       """
    )
    cursor.close()
    print("Credentials created.")
except Exception as ex:
    cursor.close()
    raise
```

### 生成 Embeddings

Oracle AI Vector Search 提供多種方法來生成 embeddings，可利用本地託管的 ONNX 模型或第三方 API。有關配置這些替代方案的完整說明，請參閱 [Oracle AI 向量搜尋指南](https://docs.oracle.com/en/database/oracle/oracle-database/23/arpls/dbms_vector_chain1.html#GUID-C6439E94-4E86-4ECD-954E-4B73D53579DE)。

***注意：*** 使用者可能需要配置 proxy 來使用第三方 embedding 生成提供者，但「database」提供者（使用 ONNX 模型）則不需要。

```
# proxy to be used when we instantiate summary and embedder object
proxy = "<proxy>"
```

以下範例程式碼將展示如何生成 embeddings：

```
from llama_index.embeddings.oracleai import OracleEmbeddings


"""
# using ocigenai
embedder_params = {
    "provider": "ocigenai",
    "credential_name": "OCI_CRED",
    "url": "https://inference.generativeai.us-chicago-1.oci.oraclecloud.com/20231130/actions/embedText",
    "model": "cohere.embed-english-light-v3.0",
}


# using huggingface
embedder_params = {
    "provider": "huggingface",
    "credential_name": "HF_CRED",
    "url": "https://api-inference.huggingface.co/pipeline/feature-extraction/",
    "model": "sentence-transformers/all-MiniLM-L6-v2",
    "wait_for_model": "true"
}
"""


# using ONNX model loaded to Oracle Database
embedder_params = {"provider": "database", "model": "demo_model"}


# Remove proxy if not required
embedder = OracleEmbeddings(conn=conn, params=embedder_params, proxy=proxy)
embed = embedder._get_text_embedding("Hello World!")


""" verify """
print(f"Embedding generated by OracleEmbeddings: {embed}")
```

### 端到端示範

請參閱我們的完整示範指南 [Oracle AI 向量搜尋 End-至-End Demo Guide](https://github.com/run-llama/llama_index/blob/main/docs/examples/cookbooks/oracleai_demo.ipynb)，利用 Oracle AI Vector Search 建構一個端到端的 RAG pipeline。