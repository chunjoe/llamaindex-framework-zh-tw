---
title: "Databricks Embeddings"
---

如果您在 colab 中開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

```
%pip install llama-index
%pip install llama-index-embeddings-databricks
```

```
import os
from llama_index.core import Settings
from llama_index.embeddings.databricks import DatabricksEmbedding
```

```
# Set up the DatabricksEmbedding class with the required model, API key and serving endpoint
os.environ["DATABRICKS_TOKEN"] = "<MY TOKEN>"
os.environ["DATABRICKS_SERVING_ENDPOINT"] = "<MY ENDPOINT>"
embed_model = DatabricksEmbedding(model="databricks-bge-large-en")
Settings.embed_model = embed_model
```

```
# Embed some text
embeddings = embed_model.get_text_embedding(
    "The DatabricksEmbedding integration works great."
)
```
