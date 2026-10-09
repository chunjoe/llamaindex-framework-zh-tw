---
title: "連接到 VideoDB"
---

conn = connect() coll = conn.create\_collection( name=“VideoDB Retrievers”, description=“VideoDB Retrievers” )

# 將影片上傳到 VideoDB 的預設集合中

print(“Uploading Video”) video = coll.upload(url=“<https://www.youtube.com/watch?v=aRgP3n0XiMc>”) print(f”Video uploaded with ID: {video.id}“)

# video = coll.get\_video(“m-b6230808-307d-468a-af84-863b2c321f05”)

````
    Uploading Video
    Video uploaded with ID: m-a758f9bb-f769-484a-9d54-02417ccfe7e6




> * `coll = conn.get_collection()` : Returns default collection object.
> * `coll.get_videos()` : Returns list of all the videos in a collections.
> * `coll.get_video(video_id)`: Returns Video object from given`video_id`.


### 🗣️ Step 2: Indexing & Search from Spoken Content


Video can be viewed as data with different modalities. First, we will work with the `spoken content`.


#### 🗣️ Indexing Spoken Content




```python
print("Indexing spoken content in Video...")
video.index_spoken_words()
````

```
Indexing spoken content in Video...




100%|████████████████████████████████████████████████████████████████████████████████████████████████████| 100/100 [00:48<00:00,  2.08it/s]
```

#### 🗣️ 檢索相關的 Nodes：來自語音索引

我們將使用 `VideoDBRetriever` 從我們的索引內容中檢索相關的 nodes。需要將 video ID 作為參數傳入，並且將 `index_type` 設定為 `IndexType.spoken_word`。

在實驗後，您可以設定 `score_threshold` 和 `result_threshold`。

```
from llama_index.retrievers.videodb import VideoDBRetriever
from videodb import SearchType, IndexType


spoken_retriever = VideoDBRetriever(
    collection=coll.id,
    video=video.id,
    search_type=SearchType.semantic,
    index_type=IndexType.spoken_word,
    score_threshold=0.1,
)


spoken_query = "Nationwide exams"
nodes_spoken_index = spoken_retriever.retrieve(spoken_query)
```

#### 🗣️️️ 查看結果：💬 文字

我們將使用相關的 nodes 並使用 llamaindex 綜合回應。

```
from llama_index.core import get_response_synthesizer


response_synthesizer = get_response_synthesizer()


response = response_synthesizer.synthesize(
    spoken_query, nodes=nodes_spoken_index
)
print(response)
```

```
The results of the nationwide exams were eagerly awaited all day.
```

#### 🗣️ 查看結果：🎥 影片片段

對於每個與查詢相關的 node，元數據中的 `start` 和 `end` 欄位代表 node 所涵蓋的時間區間。

我們將使用 VideoDB 的 Programmable Stream，根據這些 nodes 的時間戳生成相關影片片段的串流。

```
from videodb import play_stream


results = [
    (node.metadata["start"], node.metadata["end"])
    for node in nodes_spoken_index
]


stream_link = video.generate_stream(results)
play_stream(stream_link)
```

```
'https://console.videodb.io/player?url=https://dseetlpshk2tb.cloudfront.net/v3/published/manifests/3c108acd-e459-494a-bc17-b4768c78e5df.m3u8'
```

### 📸️ 步驟3：從視覺內容中建立索引與搜尋

#### 📸 建立視覺內容索引

要了解更多關於 Scene Index，請探索以下指南：

- [快速入門指南](https://github.com/video-db/videodb-cookbook/blob/main/quickstart/Scene%20Index%20QuickStart.ipynb) 指南提供 Scene Index 的逐步介紹。它非常適合快速入門並了解主要功能。

- [場景擷取選項指南](https://github.com/video-db/videodb-cookbook/blob/main/guides/scene-index/playground_scene_extraction.ipynb) 深入探討 Scene Index 中可用的各種場景提取選項。它涵蓋了進階的 settings、自訂功能，以及根據不同需求和偏好優化場景提取的技巧。

```
from videodb import SceneExtractionType


print("Indexing Visual content in Video...")


# Index scene content
index_id = video.index_scenes(
    extraction_type=SceneExtractionType.shot_based,
    extraction_config={"frame_count": 3},
    prompt="Describe the scene in detail",
)
video.get_scene_index(index_id)


print(f"Scene Index successful with ID: {index_id}")
```

```
Indexing Visual content in Video...
Scene Index successful with ID: 990733050d6fd4f5
```

#### 📸️ 檢索 Scene Index 中的相關 Nodes

與我們為語音索引使用 `VideoDBRetriever` 一樣，我們也會將其用於場景索引。在這裡，我們需要將 `index_type` 設定為 `IndexType.scene` 並傳入 `scene_index_id`。

```
from llama_index.retrievers.videodb import VideoDBRetriever
from videodb import SearchType, IndexType




scene_retriever = VideoDBRetriever(
    collection=coll.id,
    video=video.id,
    search_type=SearchType.semantic,
    index_type=IndexType.scene,
    scene_index_id=index_id,
    score_threshold=0.1,
)


scene_query = "accident scenes"
nodes_scene_index = scene_retriever.retrieve(scene_query)
```

#### 📸️️️ 查看結果：💬 文字

```
from llama_index.core import get_response_synthesizer


response_synthesizer = get_response_synthesizer()


response = response_synthesizer.synthesize(
    scene_query, nodes=nodes_scene_index
)
print(response)
```

```
The scenes described do not depict accidents but rather dynamic and intense scenarios involving motion, urgency, and tension in urban settings at night.
```

#### 📸 ️ 查看結果：🎥 影片片段

```
from videodb import play_stream


results = [
    (node.metadata["start"], node.metadata["end"])
    for node in nodes_scene_index
]


stream_link = video.generate_stream(results)
play_stream(stream_link)
```

```
'https://console.videodb.io/player?url=https://dseetlpshk2tb.cloudfront.net/v3/published/manifests/ae74e9da-13bf-4056-8cfa-0267087b74d7.m3u8'
```

### 🛠️ 步驟4：簡單多模態 RAG - 結合兩種模態的結果

我們希望在影片庫的多模態查詢中實現如下功能：

> 📸🗣️ “*顯示：1. 事故現場；2. 全國考試相關討論*”

有許多方法可以建立多模態 RAG，為了簡化，我們選擇一種簡單的方法：

1. 🧩 **查詢轉換 (Query Transformation)**：將查詢劃分為兩部分，分別用於各自的場景索引和語音索引。
2. 🔎 **為每種模態尋找相關的 nodes**：使用 `VideoDBRetriever` 從語音索引和場景索引中找到相關的 nodes。
3. ✏️ **查看結果：文字 (Viewing the result : Text)**：使用相關的 Nodes 來綜合文字回應，整合來自兩個索引的結果以進行精確的影片片段識別。
4. 🎥 **查看結果：影片片段 (Viewing the result : Video Clip)**：整合來自兩個索引的結果以進行精確的影片片段識別。

> 要查看更多進階多模態技術，請查看 [advnaced multimodal guides](https://docs.videodb.io/multimodal-guide-90)

#### 🧩 查詢轉換 (Query Transformation)

```
from llama_index.llms.openai import OpenAI




def split_spoken_visual_query(query):
    transformation_prompt = """
    Divide the following query into two distinct parts: one for spoken content and one for visual content. The spoken content should refer to any narration, dialogue, or verbal explanations and The visual content should refer to any images, videos, or graphical representations. Format the response strictly as:\nSpoken: <spoken_query>\nVisual: <visual_query>\n\nQuery: {query}
    """
    prompt = transformation_prompt.format(query=query)
    response = OpenAI(model="gpt-4").complete(prompt)
    divided_query = response.text.strip().split("\n")
    spoken_query = divided_query[0].replace("Spoken:", "").strip()
    scene_query = divided_query[1].replace("Visual:", "").strip()
    return spoken_query, scene_query




query = "Show me 1.Accident Scene 2.Discussion about nationwide exams "
spoken_query, scene_query = split_spoken_visual_query(query)
print("Query for Spoken retriever : ", spoken_query)
print("Query for Scene retriever : ", scene_query)
```

```
Query for Spoken retriever :  Discussion about nationwide exams
Query for Scene retriever :  Accident Scene
```

##### 🔎 為每種模態尋找相關的 nodes

```
from videodb import SearchType, IndexType


# Retriever for Spoken Index
spoken_retriever = VideoDBRetriever(
    collection=coll.id,
    video=video.id,
    search_type=SearchType.semantic,
    index_type=IndexType.spoken_word,
    score_threshold=0.1,
)


# Retriever for Scene Index
scene_retriever = VideoDBRetriever(
    collection=coll.id,
    video=video.id,
    search_type=SearchType.semantic,
    index_type=IndexType.scene,
    scene_index_id=index_id,
    score_threshold=0.1,
)


# Fetch relevant nodes for Spoken index
nodes_spoken_index = spoken_retriever.retrieve(spoken_query)


# Fetch relevant nodes for Scene index
nodes_scene_index = scene_retriever.retrieve(scene_query)
```

#### ️💬️ 查看結果：文字 (Viewing the result : Text)

```
response_synthesizer = get_response_synthesizer()


response = response_synthesizer.synthesize(
    query, nodes=nodes_scene_index + nodes_spoken_index
)
print(response)
```

```
The first scene depicts a dynamic and intense scenario in an urban setting at night, involving a motorcycle chase with a figure possibly dodging away. The second scene portrays a dramatic escape or rescue situation with characters in motion alongside a large truck. The discussion about nationwide exams involves a conversation between a character and their mother about exam results and studying.
```

#### 🎥 查看結果：影片片段 (Viewing the result : Video Clip)

從每種模態中，我們檢索了與該特定模態（在本例中為語義和場景/視覺）相關的查詢結果。

每個 node 在元數據中都有 start 和 end 欄位，代表 node 所涵蓋的時間區間。

有許多方法可以綜合這些結果，目前我們將使用一種簡單的方法：- `Union`：此方法會取得每個 node 的所有時間戳，建立一個包含所有相關時間的綜合清單，即使某些時間戳僅出現在單一模態中。

另一個方法是 `Intersection`：

- `Intersection`：此方法僅包含出現在每個 node 中的時間戳，會產生一個較小的清單，其中包含在所有模態中都具有普遍相關性的時間。

```
from videodb import play_stream




def merge_intervals(intervals):
    if not intervals:
        return []
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for interval in intervals[1:]:
        if interval[0] <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], interval[1])
        else:
            merged.append(interval)
    return merged




# Extract timestamps from both relevant nodes
results = [
    [node.metadata["start"], node.metadata["end"]]
    for node in nodes_spoken_index + nodes_scene_index
]
merged_results = merge_intervals(results)


# Use Videodb to create a stream of relevant clips
stream_link = video.generate_stream(merged_results)
play_stream(stream_link)
```

```
'https://console.videodb.io/player?url=https://dseetlpshk2tb.cloudfront.net/v3/published/manifests/91b08b39-c72f-4e33-ad1c-47a2ea11ac17.m3u8'
```

## 🛠 使用 VideoDBRetriever 建構 RAG 以收集影片

---

### 新增更多影片到我們的集合

```
video_2 = coll.upload(url="https://www.youtube.com/watch?v=kMRX3EA68g4")
```

#### 🗣️ 索引語音內容

```
video_2.index_spoken_words()
```

#### 📸 索引場景

```
from videodb import SceneExtractionType


print("Indexing Visual content in Video...")


# Index scene content
index_id = video_2.index_scenes(
    extraction_type=SceneExtractionType.shot_based,
    extraction_config={"frame_count": 3},
    prompt="Describe the scene in detail",
)
video_2.get_scene_index(index_id)


print(f"Scene Index successful with ID: {index_id}")
```

```
[Video(id=m-b6230808-307d-468a-af84-863b2c321f05, collection_id=c-4882e4a8-9812-4921-80ff-b77c9c4ab4e7, stream_url=https://dseetlpshk2tb.cloudfront.net/v3/published/manifests/528623c2-3a8e-4c84-8f05-4dd74f1a9977.m3u8, player_url=https://console.dev.videodb.io/player?url=https://dseetlpshk2tb.cloudfront.net/v3/published/manifests/528623c2-3a8e-4c84-8f05-4dd74f1a9977.m3u8, name=Death note - episode 1 (english dubbed) | HD, description=None, thumbnail_url=None, length=1366.006712),
 Video(id=m-f5b86106-4c28-43f1-b753-fa9b3f839dfe, collection_id=c-4882e4a8-9812-4921-80ff-b77c9c4ab4e7, stream_url=https://dseetlpshk2tb.cloudfront.net/v3/published/manifests/4273851a-46f3-4d57-bc1b-9012ce330da8.m3u8, player_url=https://console.dev.videodb.io/player?url=https://dseetlpshk2tb.cloudfront.net/v3/published/manifests/4273851a-46f3-4d57-bc1b-9012ce330da8.m3u8, name=Death note - episode 5 (english dubbed) | HD, description=None, thumbnail_url=None, length=1366.099592)]
```

#### 🧩 查詢轉換

```
query = "Show me 1.Accident Scene 2.Kiara is speaking "
spoken_query, scene_query = split_spoken_visual_query(query)
print("Query for Spoken retriever : ", spoken_query)
print("Query for Scene retriever : ", scene_query)
```

```
Query for Spoken retriever :  Kiara is speaking
Query for Scene retriever :  Show me Accident Scene
```

#### 🔎 尋找相關的 nodes

```
from videodb import SearchType, IndexType


# Retriever for Spoken Index
spoken_retriever = VideoDBRetriever(
    collection=coll.id,
    search_type=SearchType.semantic,
    index_type=IndexType.spoken_word,
    score_threshold=0.2,
)


# Retriever for Scene Index
scene_retriever = VideoDBRetriever(
    collection=coll.id,
    search_type=SearchType.semantic,
    index_type=IndexType.scene,
    score_threshold=0.2,
)


# Fetch relevant nodes for Spoken index
nodes_spoken_index = spoken_retriever.retrieve(spoken_query)


# Fetch relevant nodes for Scene index
nodes_scene_index = scene_retriever.retrieve(scene_query)
```

#### ️💬️ 查看結果：文字

```
response_synthesizer = get_response_synthesizer()


response = response_synthesizer.synthesize(
    "What is kaira speaking. And tell me about accident scene",
    nodes=nodes_scene_index + nodes_spoken_index,
)
print(response)
```

```
Kira is speaking about his plans and intentions regarding the agent from the bus. The accident scene captures a distressing moment where an individual is urgently making a phone call near a damaged car, with a victim lying motionless on the ground. The chaotic scene includes a bus in the background, emphasizing the severity of the tragic incident.
```

#### 🎥 查看結果：影片片段

在處理涉及多個影片的編輯 workflow 時，我們需要建立一個 `Timeline` 的 `VideoAsset`，然後將它們組合起來。

![](/assets/445370b3e117.jpg)

```
from videodb import connect, play_stream
from videodb.timeline import Timeline
from videodb.asset import VideoAsset


# Create a new timeline Object
timeline = Timeline(conn)


for node_obj in nodes_scene_index + nodes_spoken_index:
    node = node_obj.node


    # Create a Video asset for each node
    node_asset = VideoAsset(
        asset_id=node.metadata["video_id"],
        start=node.metadata["start"],
        end=node.metadata["end"],
    )


    # Add the asset to timeline
    timeline.add_inline(node_asset)


# Generate stream for the compiled timeline
stream_url = timeline.generate_stream()
play_stream(stream_url)
```

```
'https://console.videodb.io/player?url=https://dseetlpshk2tb.cloudfront.net/v3/published/manifests/2810827b-4d80-44af-a26b-ded2a7a586f6.m3u8'
```

 

## 配置 `VideoDBRetriever`

---

### ⚙️ 僅針對單一影片的 Retriever

您可以將影片物件的 `id` 傳入進行單一影片的搜尋。

```
VideoDBRetriever(video="my_video.id")
```

### ⚙️ 針對影片/集合的 Retriever

您可以將 Collection 的 `id` 傳入進行單一集合的搜尋。

```
VideoDBRetriever(collection="my_coll.id")
```

### ⚙️ 針對不同類型的 Index 的 Retriever

```
from videodb import IndexType
spoken_word = VideoDBRetriever(index_type=IndexType.spoken_word)


scene_retriever = VideoDBRetriever(index_type=IndexType.scene, scene_index_id="my_index_id")
```

### ⚙️ 配置 Retriever 的搜尋類型

`search_type` 決定了在給定查詢下，用於檢索 nodes 的搜尋方法。

```
from videodb import SearchType, IndexType


keyword_spoken_search = VideoDBRetriever(
    search_type=SearchType.keyword,
    index_type=IndexType.spoken_word
)


semantic_scene_search = VideoDBRetriever(
    search_type=SearchType.semantic,
    index_type=IndexType.spoken_word
)
```

### ⚙️ 配置閾值參數

- `result_threshold`：是 retriever 返回結果的閾值；預設值是 `5`
- `score_threshold`：只有得分高於 `score_threshold` 的 nodes 才會被 retriever 返回；預設值是 `0.2`

```
custom_retriever = VideoDBRetriever(result_threshold=2, score_threshold=0.5)
```

## ✨ 配置索引和分塊 (Chunking)

---

在這個範例中，我們利用 VideoDB 的 Indexing 進行影片檢索。然而，您有彈性載入 Transcript 和 Scene Data，並使用 llamaindex 應用您自己的索引技術。

如需更詳細的指導，請參閱此 [guide](https://colab.research.google.com/github/run-llama/llama_index/blob/main/docs/examples/multi_modal/multi_modal_videorag_videodb.ipynb)。

## 🏃‍♂️ 後續步驟

---

在本指南中，我們使用 VideoDB、Llamaindex 和 OpenAI 建構了一個用於影片的簡單多模態 RAG。

您可以透過整合更進階的技術來優化此 pipeline，例如：

- 優化 Query Transformation
- 更多方法來組合來自不同模態的檢索到的 nodes
- 嘗試不同的 RAG pipeline，例如 Knowledge Graph

如需了解我們用來建立相關片段檢索的 Programable Stream 功能，請參閱 [動態影片串流指南](https://docs.videodb.io/dynamic-video-stream-guide-44)。

如需了解 Scene Index，請探索以下指南：

- [快速入門指南](https://github.com/video-db/videodb-cookbook/blob/main/quickstart/Scene%20Index%20QuickStart.ipynb)
- [場景擷取選項](https://github.com/video-db/videodb-cookbook/blob/main/guides/scene-index/playground_scene_extraction.ipynb)
- [進階視覺搜尋](https://github.com/video-db/videodb-cookbook/blob/main/guides/scene-index/advanced_visual_search.ipynb)
- [自訂標註流程](https://github.com/video-db/videodb-cookbook/blob/main/guides/scene-index/custom_annotations.ipynb)

## 👨‍👩‍👧‍👦 支援與社群

---

如果您有任何問題或意見，歡迎隨時與我們聯繫 🙌🏼

- [Discord](https://colab.research.google.com/corgiredirector?site=https%3A%2F%2Fdiscord.gg%2Fpy9P639jGz)
- [GitHub](https://github.com/video-db)
- [Email](mailto:ashu@videodb.io)