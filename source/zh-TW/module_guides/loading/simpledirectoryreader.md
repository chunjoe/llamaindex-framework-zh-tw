---
title: "SimpleDirectoryReader"
---

`SimpleDirectoryReader` 是將本地檔案資料載入到 LlamaIndex 的最簡單方法。對於生產環境的用例，您可能更傾向於使用 [許多讀取器整合套件](https://github.com/run-llama/llama_index/tree/main/llama-index-integrations/readers)，但 `SimpleDirectoryReader` 是開始的絕佳方式。

## 支援的檔案類型

預設情況下，`SimpleDirectoryReader` 會嘗試讀取它找到的任何檔案，將它們都視為文字。除了純文字之外，它明確支援以下檔案類型，這些類型會根據檔案副檔名自動偵測：

- .csv - 逗號分隔值
- .docx - Microsoft Word
- .epub - EPUB 電子書格式
- .hwp - Hangul Word Processor
- .ipynb - Jupyter Notebook
- .jpeg, .jpg - JPEG 圖片
- .mbox - MBOX 電子郵件封存檔
- .md - Markdown
- .mp3, .mp4 - 音訊與影片
- .pdf - 可攜式文件格式
- .png - 可攜式網路圖形格式
- .ppt, .pptm, .pptx - Microsoft PowerPoint

您可能預期在此處找到的檔案類型是 JSON；對於該類型，我們建議您使用我們的 [JSON Loader](https://github.com/run-llama/llama_index/tree/main/llama-index-integrations/readers/llama-index-readers-json)。

## 使用方法

最基本的用法是傳遞一個 `input_dir`，它將載入該目錄中所有支援的檔案：

```
from llama_index.core import SimpleDirectoryReader


reader = SimpleDirectoryReader(input_dir="path/to/directory")
documents = reader.load_data()
```

從單一目錄載入多個檔案時，Documents 也支援平行處理。請注意，`multiprocessing` 在 Windows 和 Linux/MacOS 電腦上的使用方式有所不同，詳情請參閱 `multiprocessing` 文件（例如[此處](https://docs.python.org/3/library/multiprocessing.html?highlight=process#the-spawn-and-forkserver-start-methods)）。整體而言，Windows 使用者可能看不到明顯的效能提升；Linux/MacOS 使用者載入相同檔案集合時則會看到效能提升。

```
...
documents = reader.load_data(num_workers=4)
```

### 從子目錄讀取

預設情況下，`SimpleDirectoryReader` 只會讀取目錄頂層的檔案。若要從子目錄讀取，請設定 `recursive=True`：

```
SimpleDirectoryReader(input_dir="path/to/directory", recursive=True)
```

### 迭代載入的檔案

您也可以使用 `iter_data()` 方法來迭代並處理檔案在載入時的過程：

```
reader = SimpleDirectoryReader(input_dir="path/to/directory", recursive=True)
all_docs = []
for docs in reader.iter_data():
    # <do something with the documents per file>
    all_docs.extend(docs)
```

### 限制載入的檔案

而不是所有檔案，您可以傳遞一個檔案路徑列表：

```
SimpleDirectoryReader(input_files=["path/to/file1", "path/to/file2"])
```

或者您可以使用 `exclude` 傳遞一個要**排除**的檔案路徑列表：

```
SimpleDirectoryReader(
    input_dir="path/to/directory", exclude=["path/to/file1", "path/to/file2"]
)
```

您也可以設定 `required_exts` 為檔案副檔名的列表，以僅載入具有這些副檔名的檔案：

```
SimpleDirectoryReader(
    input_dir="path/to/directory", required_exts=[".pdf", ".docx"]
)
```

並且您可以使用 `num_files_limit` 設定要載入的最大檔案數量：

```
SimpleDirectoryReader(input_dir="path/to/directory", num_files_limit=100)
```

### 指定檔案編碼

`SimpleDirectoryReader` 預期檔案是 `utf-8` 編碼的，但您可以使用 `encoding` 參數來覆蓋此設定：

```
SimpleDirectoryReader(input_dir="path/to/directory", encoding="latin-1")
```

### 提取元資料

`SimpleDirectoryReader` 會自動為每個 `Document` 物件附加一個 `metadata` 字典。預設情況下，此字典包含以下項目：

- `file_path`：包含檔案名稱（string）的完整檔案系統路徑
- `file_name`：包含副檔名的檔案名稱（string）
- `file_type`：檔案的 MIME type，由 [mimetypes.guess_type()](https://docs.python.org/3/library/mimetypes.html#mimetypes.guess_type) 猜測（string）
- `file_size`：檔案的大小，以位元組為單位（integer）
- `creation_date`, `last_modified_date`, `last_accessed_date`：檔案的建立、修改和存取日期，已標準化到 UTC 時區。請參閱下方的 [日期與時間中繼資料](/python/framework/module_guides/loading/simpledirectoryreader/#date-and-time-metadata)（string）

然而，您可以替換用於建立元資料字典的邏輯。建立一個接受檔案路徑字串並回傳字典的自訂函式，然後將此函式作為 `file_metadata` 傳遞給 `SimpleDirectoryReader` 建構函式：

```
def get_meta(file_path):
    return {"foo": "bar", "file_path": file_path}




reader = SimpleDirectoryReader(
    input_dir="path/to/directory", file_metadata=get_meta
)


docs = reader.load_data()
print(docs[0].metadata["foo"])  # prints "bar"
```

#### 日期和時間元資料

`SimpleDirectoryReader` 中的預設元資料函式會以 [格式](https://docs.python.org/3/library/datetime.html#strftime-and-strptime-format-codes) `%Y-%m-%d` 的字串輸出日期。

為確保一致性，時間戳會標準化到 UTC 時區。如果輸出日期與實際日期相差一天，這可能是由於與 UTC 午夜的時差所導致。

### 擴充其他檔案類型您可以將副檔名對應字典傳入 `BaseReader` 實例，藉此擴充 `SimpleDirectoryReader`，並將其指定為 `file_extractor` 以支援其他檔案類型。BaseReader 應讀取檔案並回傳 Documents 清單。例如，若要為 `.myfile` 檔案新增自訂支援：

```
from llama_index.core import SimpleDirectoryReader
from llama_index.core.readers.base import BaseReader
from llama_index.core import Document




class MyFileReader(BaseReader):
    def load_data(self, file, extra_info=None):
        with open(file, "r") as f:
            text = f.read()
        # load_data returns a list of Document objects
        return [Document(text=text + "Foobar", extra_info=extra_info or {})]




reader = SimpleDirectoryReader(
    input_dir="./data", file_extractor={".myfile": MyFileReader()}
)


documents = reader.load_data()
print(documents)
```

請注意，此映射會覆蓋您指定的檔案類型的預設檔案提取器，如果您想支援它們，則需要將它們重新加入。

### 支援外部檔案系統

與其他模組一樣，`SimpleDirectoryReader` 包含一個可選的 `fs` 參數，可用於遍歷遠端檔案系統。

這可以是任何由 [`fsspec`](https://filesystem-spec.readthedocs.io/en/latest/) 協定實作的 filesystem 物件。`fsspec` 協定有針對多種遠端檔案系統的開源實作，包括 [AWS S3](https://github.com/fsspec/s3fs)、[Azure Blob & DataLake](https://github.com/fsspec/adlfs)、[Google Drive](https://github.com/fsspec/gdrivefs)、[SFTP](https://github.com/fsspec/sshfs) 以及 [許多其他](https://github.com/fsspec/)。

以下是一個連接到 S3 的範例：

```
from s3fs import S3FileSystem


s3_fs = S3FileSystem(key="...", secret="...")
bucket_name = "my-document-bucket"


reader = SimpleDirectoryReader(
    input_dir=bucket_name,
    fs=s3_fs,
    recursive=True,  # recursively searches all subdirectories
)


documents = reader.load_data()
print(documents)
```

完整的範例筆記可以在 [這裡](https://github.com/run-llama/llama_index/blob/main/docs/examples/data_connectors/simple_directory_reader_remote_fs.ipynb) 找到。