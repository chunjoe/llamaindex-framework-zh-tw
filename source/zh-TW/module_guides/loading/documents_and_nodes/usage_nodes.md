---
title: "定義與自訂 Nodes"
---

Nodes 代表源 Documents 的「chunks」，無論是文字片段、影像還是其他內容。它們也包含與其他 nodes 和索引結構的元資料和關聯資訊。

Nodes 是 LlamaIndex 中的一等公民。您可以直接定義 Nodes 及其所有屬性。您也可以透過我們的 `NodeParser` 類別將源 Documents 解析成 Nodes。

例如，您可以這樣做：

```
from llama_index.core.node_parser import SentenceSplitter


parser = SentenceSplitter()


nodes = parser.get_nodes_from_documents(documents)
```

您也可以手動建構 Node 物件並跳過第一部分。例如：

```
from llama_index.core.schema import TextNode, NodeRelationship, RelatedNodeInfo


node1 = TextNode(text="<text_chunk>", id_="<node_id>")
node2 = TextNode(text="<text_chunk>", id_="<node_id>")
# set relationships
node1.relationships[NodeRelationship.NEXT] = RelatedNodeInfo(
    node_id=node2.node_id
)
node2.relationships[NodeRelationship.PREVIOUS] = RelatedNodeInfo(
    node_id=node1.node_id
)
nodes = [node1, node2]
```

`RelatedNodeInfo` 類別也可以在需要時儲存額外的 `metadata`：

```
node2.relationships[NodeRelationship.PARENT] = RelatedNodeInfo(
    node_id=node1.node_id, metadata={"key": "val"}
)
```

### 自訂 ID

每個 node 都有一個 `node_id` 屬性，如果未手動指定，則會自動生成。此 ID 可用於多種目的；這包括能夠更新儲存中的 nodes、能夠定義 nodes（透過 `IndexNode`）之間的關聯，等等。

您也可以直接取得和設定任何 `TextNode` 的 `node_id`。

```
print(node.node_id)
node.node_id = "My new node_id!"
```
