---
title: "提取術語與定義指南"
---

Llama Index 有許多應用場景（如 semantic search、summarization 等）都有完善的文檔。然而，這並不意味著我們不能將 Llama Index 應用於非常特定的場景！

在本教學中，我們將介紹如何使用 Llama Index 從文本中提取術語和定義，同時允許使用者稍後查詢這些術語。使用 [Streamlit](https://streamlit.io/)，我們可以提供一個簡單的方式來建構前端，用於運行和測試所有這些功能，並快速迭代我們的設計。

本教學假設您已安裝 Python3.9+ 以及以下套件：

- llama-index
- streamlit

在基礎層面上，我們的目標是從一個 document 中的文本中提取術語和定義，然後提供一種方式讓使用者可以查詢這個術語和定義的知識庫。本教學將介紹 Llama Index 和 Streamlit 的功能，希望能為常見問題提供一些有趣的解決方案。

本教學的最終版本可以在 [這裡](https://github.com/abdulasiraj/A-Guide-to-Extracting-Terms-and-Definitions) 找到，並且可以在 [Huggingface Spaces](https://huggingface.co/spaces/Nobody4591/Llama_Index_Term_Extractor) 上提供即時託管演示。

## 上傳文本

第一步是為使用者提供手動輸入文本的方式。讓我們使用 Streamlit 編寫一些程式碼來提供這個介面！使用以下程式碼並用 `streamlit run app.py` 啟動應用程式。

```
import streamlit as st


st.title("🦙 Llama Index Term Extractor 🦙")


document_text = st.text_area("Enter raw text")
if st.button("Extract Terms and Definitions") and document_text:
    with st.spinner("Extracting..."):
        extracted_terms = document_text  # this is a placeholder!
    st.write(extracted_terms)
```

超級簡單對吧！但你會注意到應用程式目前沒有做任何有用的事情。要使用 llama\_index，我們還需要設定我們的 OpenAI LLM。對於 LLM 有很多可能的 settings，所以我們可以讓使用者自行判斷哪種最適合。我們也應該讓使用者設定用於提取術語的 prompt（這也將幫助我們偵錯出什麼最有效）。

## LLM Settings

下一步將為我們的應用程式新增一些標籤，將其分成不同的面板，提供不同的功能。讓我們為 LLM settings 和上傳文本建立一個標籤：

```
import os
import streamlit as st


DEFAULT_TERM_STR = (
    "Make a list of terms and definitions that are defined in the context, "
    "with one pair on each line. "
    "If a term is missing it's definition, use your best judgment. "
    "Write each line as as follows:\nTerm: <term> Definition: <definition>"
)


st.title("🦙 Llama Index Term Extractor 🦙")


setup_tab, upload_tab = st.tabs(["Setup", "Upload/Extract Terms"])


with setup_tab:
    st.subheader("LLM Setup")
    api_key = st.text_input("Enter your OpenAI API key here", type="password")
    llm_name = st.selectbox("Which LLM?", ["gpt-3.5-turbo", "gpt-4"])
    model_temperature = st.slider(
        "LLM Temperature", min_value=0.0, max_value=1.0, step=0.1
    )
    term_extract_str = st.text_area(
        "The query to extract terms and definitions with.",
        value=DEFAULT_TERM_STR,
    )


with upload_tab:
    st.subheader("Extract and Query Definitions")
    document_text = st.text_area("Enter raw text")
    if st.button("Extract Terms and Definitions") and document_text:
        with st.spinner("Extracting..."):
            extracted_terms = document_text  # this is a placeholder!
        st.write(extracted_terms)
```

現在我們的應用程式有兩個標籤，這確實有助於組織。您也會注意到我新增了一個預設的 prompt 用於提取術語——當您嘗試提取一些術語後可以更改它，這只是我實驗後得出的 prompt。

說到提取術語，是時候新增一些功能來完成這項任務了！

## 提取和儲存術語

現在我們能夠定義 LLM settings 並輸入文本，我們可以嘗試使用 Llama Index 從文本中提取術語！

我們可以為初始化我們的 LLM 以及使用它從輸入文本中提取術語，新增以下功能。

```
from llama_index.core import Document, SummaryIndex, load_index_from_storage
from llama_index.llms.openai import OpenAI
from llama_index.core import Settings




def get_llm(llm_name, model_temperature, api_key, max_tokens=256):
    os.environ["OPENAI_API_KEY"] = api_key
    return OpenAI(
        temperature=model_temperature, model=llm_name, max_tokens=max_tokens
    )




def extract_terms(
    documents, term_extract_str, llm_name, model_temperature, api_key
):
    llm = get_llm(llm_name, model_temperature, api_key, max_tokens=1024)


    temp_index = SummaryIndex.from_documents(
        documents,
    )
    query_engine = temp_index.as_query_engine(
        response_mode="tree_summarize", llm=llm
    )
    terms_definitions = str(query_engine.query(term_extract_str))
    terms_definitions = [
        x
        for x in terms_definitions.split("\n")
        if x and "Term:" in x and "Definition:" in x
    ]
    # parse the text into a dict
    terms_to_definition = {
        x.split("Definition:")[0]
        .split("Term:")[-1]
        .strip(): x.split("Definition:")[-1]
        .strip()
        for x in terms_definitions
    }
    return terms_to_definition
```

現在，使用新的功能，我們終於可以提取我們的術語了！

```
...
with upload_tab:
    st.subheader("Extract and Query Definitions")
    document_text = st.text_area("Enter raw text")
    if st.button("Extract Terms and Definitions") and document_text:
        with st.spinner("Extracting..."):
            extracted_terms = extract_terms(
                [Document(text=document_text)],
                term_extract_str,
                llm_name,
                model_temperature,
                api_key,
            )
        st.write(extracted_terms)
```

現在有很多事情在發生，讓我們花點時間看看正在發生什麼。

`get_llm()` 根據設定標籤中的使用者配置來實例化 LLM。根據模型名稱，我們需要使用適當的類別（`OpenAI` vs. `ChatOpenAI`）。

`extract_terms()` 是所有好東西發生的地方。首先，我們使用 `get_llm()` 呼叫 `max_tokens=1024`，因為我們不想在提取我們的術語和定義時過度限制模型（如果未設定，預設值為 256）。然後，我們定義我們的 `Settings` 物件，將 `num_output` 與我們的 `max_tokens` 值對齊，同時將分塊大小設定為不超過輸出。當 documents 被 Llama Index 索引時，如果它們很大，它們會被分成分塊（也稱為 nodes），而 `chunk_size` 設定了這些分塊的大小。

接下來，我們建立一個臨時摘要索引並傳入我們的 llm。摘要索引會讀取索引中的每一段文本，這非常適合提取術語。最後，我們使用預定義的查詢文本來提取術語，使用 `response_mode="tree_summarize`。這種回應模式會從底向上生成一個摘要樹，其中每個父節都會對其子節進行摘要。最後，會返回樹的頂部，其中包含我們提取的所有術語和定義。最後，我們進行一些細微的後處理。我們假設模型遵循了指示，在每一行上都放入一個術語/定義對。如果某一行缺少 `Term:` 或 `Definition:` 標籤，我們就跳過它。然後，我們將其轉換為字典以便於儲存！

## 儲存提取的術語

既然我們能提取術語，就需要將它們儲存在某處，以便日後可以查詢。現在 `VectorStoreIndex` 是一個非常好的選擇！但此外，我們的應用程式也應該追蹤哪些術語被插入到索引中，以便我們日後可以檢查它們。使用 `st.session_state`，我們可以將當前術語列表儲存在一個專屬於每個使用者的 session dict 中！

首先，我們來新增一個功能，初始化一個全局向量索引，以及一個用於插入提取的術語的函式。

```
from llama_index.core import Settings, VectorStoreIndex


...
if "all_terms" not in st.session_state:
    st.session_state["all_terms"] = DEFAULT_TERMS
...




def insert_terms(terms_to_definition):
    for term, definition in terms_to_definition.items():
        doc = Document(text=f"Term: {term}\nDefinition: {definition}")
        st.session_state["llama_index"].insert(doc)




@st.cache_resource
def initialize_index(llm_name, model_temperature, api_key):
    """Create the VectorStoreIndex object."""
    Settings.llm = get_llm(llm_name, model_temperature, api_key)


    index = VectorStoreIndex([])


    return index, llm




...


with upload_tab:
    st.subheader("Extract and Query Definitions")
    if st.button("Initialize Index and Reset Terms"):
        st.session_state["llama_index"] = initialize_index(
            llm_name, model_temperature, api_key
        )
        st.session_state["all_terms"] = {}


    if "llama_index" in st.session_state:
        st.markdown(
            "Either upload an image/screenshot of a document, or enter the text manually."
        )
        document_text = st.text_area("Or enter raw text")
        if st.button("Extract Terms and Definitions") and (
            uploaded_file or document_text
        ):
            st.session_state["terms"] = {}
            terms_docs = {}
            with st.spinner("Extracting..."):
                terms_docs.update(
                    extract_terms(
                        [Document(text=document_text)],
                        term_extract_str,
                        llm_name,
                        model_temperature,
                        api_key,
                    )
                )
            st.session_state["terms"].update(terms_docs)


        if "terms" in st.session_state and st.session_state["terms"]:
            st.markdown("Extracted terms")
            st.json(st.session_state["terms"])


            if st.button("Insert terms?"):
                with st.spinner("Inserting terms"):
                    insert_terms(st.session_state["terms"])
                st.session_state["all_terms"].update(st.session_state["terms"])
                st.session_state["terms"] = {}
                st.experimental_rerun()
```

現在你真的開始利用 streamlit 的強大功能了！讓我們從 upload 標籤下的程式碼開始。我們新增了一個按鈕來初始化向量索引，並將其儲存在全局 streamlit state dictionary 中，同時重置當前提取的術語。然後，在從輸入文本中提取術語後，我們再次將提取的術語儲存在全局 state 中，並給用戶一個機會在插入前審閱它們。如果按下 insert 按鈕，我們就呼叫我們的 insert terms 函式，更新我們關於已插入術語的全局追蹤，並從 session state 中移除最近提取的術語。

## 查詢提取的術語/定義

隨著術語和定義被提取並儲存，我們如何才能使用它們？用戶又如何記住先前儲存了什麼呢？我們可以簡單地在應用程式中新增一些標籤來處理這些功能。

```
...
setup_tab, terms_tab, upload_tab, query_tab = st.tabs(
    ["Setup", "All Terms", "Upload/Extract Terms", "Query Terms"]
)
...
with terms_tab:
    with terms_tab:
        st.subheader("Current Extracted Terms and Definitions")
        st.json(st.session_state["all_terms"])
...
with query_tab:
    st.subheader("Query for Terms/Definitions!")
    st.markdown(
        (
            "The LLM will attempt to answer your query, and augment it's answers using the terms/definitions you've inserted. "
            "If a term is not in the index, it will answer using it's internal knowledge."
        )
    )
    if st.button("Initialize Index and Reset Terms", key="init_index_2"):
        st.session_state["llama_index"] = initialize_index(
            llm_name, model_temperature, api_key
        )
        st.session_state["all_terms"] = {}


    if "llama_index" in st.session_state:
        query_text = st.text_input("Ask about a term or definition:")
        if query_text:
            query_text = (
                query_text
                + "\nIf you can't find the answer, answer the query with the best of your knowledge."
            )
            with st.spinner("Generating answer..."):
                response = (
                    st.session_state["llama_index"]
                    .as_query_engine(
                        similarity_top_k=5,
                        response_mode="compact",
                        text_qa_template=TEXT_QA_TEMPLATE,
                        refine_template=DEFAULT_REFINE_PROMPT,
                    )
                    .query(query_text)
                )
            st.markdown(str(response))
```

雖然這大多是基礎功能，但有幾個重要事項需要注意：

- 我們的 initialize 按鈕的文字與我們的其他按鈕相同。Streamlit 會對此提出警告，所以我們提供一個唯一的 key。

- 查詢中新增了一些額外文字！這是為了嘗試補償索引沒有答案的情況。

- 在我們的索引查詢中，我們指定了兩個選項：

  - `similarity_top_k=5` 表示索引將擷取與查詢最相似的 5 個術語/定義。
  - `response_mode="compact"` 表示在每個 LLM 呼叫中，將盡可能多地使用這 5 個匹配的術語/定義中的文本。否則，索引至少會對 LLM 進行 5 次呼叫，這可能會拖慢用戶的速度。

## 試運行測試 (Dry Run Test)

好吧，實際上我希望你們在測試過程中一直都在測試。但現在，讓我們試一次完整的測試。

1. 重新整理應用程式
2. 輸入你的 LLM settings
3. 前往 query 標籤
4. 詢問以下問題：`What is a bunnyhug?`
5. 應用程式應該會給出一些無意義的回答。如果你不知道，bunnyhug 是加拿大草原地區的人使用的連帽衫的另一種說法！
6. 讓我們將這個定義新增到應用程式中。打開 upload 標籤並輸入以下文本：`A bunnyhug is a common term used to describe a hoodie. This term is used by people from the Canadian Prairies.`
7. 點擊 extract 按鈕。過幾秒鐘，應用程式應該會顯示正確提取的術語/定義。點擊 insert term 按鈕來儲存它！
8. 如果我們打開 terms 標籤，我們剛才提取的術語和定義應該會顯示出來
9. 返回 query 標籤，試著詢問 bunnyhug 是什麼。現在，答案應該是正確的！

## 改進 #1 - 建立起始索引

隨著我們的基礎應用程式運作，建立一個有用的索引可能會感覺很費力。如果我們給用戶一些起始點來展示應用程式的查詢能力會怎麼樣？我們可以做到這一點！首先，讓我們對應用程式做一個小改動，以便在每次上傳後將索引儲存到磁碟上：

```
def insert_terms(terms_to_definition):
    for term, definition in terms_to_definition.items():
        doc = Document(text=f"Term: {term}\nDefinition: {definition}")
        st.session_state["llama_index"].insert(doc)
    # TEMPORARY - save to disk
    st.session_state["llama_index"].storage_context.persist()
```

現在，我們需要一些 document 來提取！這個專案的儲存庫使用了紐約市的維基百科頁面，你可以在 [這裡](https://github.com/jerryjliu/llama_index/blob/main/examples/test_wiki/data/nyc_text.txt) 找到文本。

如果你將文本貼到 upload 標籤中並運行它（可能需要一些時間），我們可以插入提取的術語。請確保你也將提取術語的文本複製到筆記本或類似的編輯器中，再插入到索引中！我們稍後會需要它們。插入後，移除我們用來將索引儲存到磁碟的程式碼行。由於現在有起始索引已儲存，我們可以修改我們的 `initialize_index` 函式如下：

```
@st.cache_resource
def initialize_index(llm_name, model_temperature, api_key):
    """Load the Index object."""
    Settings.llm = get_llm(llm_name, model_temperature, api_key)


    index = load_index_from_storage(storage_context)


    return index
```

您記得把提取的術語的巨大列表儲存在筆記本裡嗎？現在當我們的應用程式初始化時，我們希望將索引中的預設術語傳遞給我們的 global terms state：

```
...
if "all_terms" not in st.session_state:
    st.session_state["all_terms"] = DEFAULT_TERMS
...
```

在我們先前重置 `all_terms` 值的所有地方重複上述操作。

## 改進 #2 - (精煉) 更好的提示詞

如果您現在稍微操作一下應用程式，可能會注意到它停止遵循我們的提示詞！請記住，我們向我們的 `query_str` 變數中添加了如果找不到術語/定義，則以其所知最好的知識來回答。但現在如果您嘗試詢問隨機術語（例如 bunnyhug!），它可能會遵循這些指示，也可能不會。

這是由於 Llama Index 中「精煉」答案的概念。由於我們在查詢前 5 個匹配結果，有時所有結果都不適合放入單一提示詞中！OpenAI 模型通常的最大輸入大小為 4097 tokens。因此，Llama Index 會將匹配結果分解成適合放入提示詞的區塊。在 Llama Index 從第一次 API 呼叫中獲得初步答案後，它會將下一個區塊連同先前的答案發送給 API，並要求模型精煉該答案。

所以，精煉過程似乎在干擾我們的結果！與其向 `query_str` 添加額外的指令，不如移除它，這樣 Llama Index 就會讓我們提供我們自己的自訂提示詞！讓我們現在使用 [default prompts](https://github.com/run-llama/llama_index/blob/main/llama-index-core/llama_index/core/prompts/default_prompts.py) 和 [chat specific prompts](https://github.com/run-llama/llama_index/blob/main/llama-index-core/llama_index/core/prompts/chat_prompts.py) 作為指南來建立這些。使用新的檔案 `constants.py`，讓我們建立一些新的查詢模板：

```
from llama_index.core import (
    PromptTemplate,
    SelectorPromptTemplate,
    ChatPromptTemplate,
)
from llama_index.core.prompts.utils import is_chat_model
from llama_index.core.llms import ChatMessage, MessageRole


# Text QA templates
DEFAULT_TEXT_QA_PROMPT_TMPL = (
    "Context information is below. \n"
    "---------------------\n"
    "{context_str}"
    "\n---------------------\n"
    "Given the context information answer the following question "
    "(if you don't know the answer, use the best of your knowledge): {query_str}\n"
)
TEXT_QA_TEMPLATE = PromptTemplate(DEFAULT_TEXT_QA_PROMPT_TMPL)


# Refine templates
DEFAULT_REFINE_PROMPT_TMPL = (
    "The original question is as follows: {query_str}\n"
    "We have provided an existing answer: {existing_answer}\n"
    "We have the opportunity to refine the existing answer "
    "(only if needed) with some more context below.\n"
    "------------\n"
    "{context_msg}\n"
    "------------\n"
    "Given the new context and using the best of your knowledge, improve the existing answer. "
    "If you can't improve the existing answer, just repeat it again."
)
DEFAULT_REFINE_PROMPT = PromptTemplate(DEFAULT_REFINE_PROMPT_TMPL)


CHAT_REFINE_PROMPT_TMPL_MSGS = [
    ChatMessage(content="{query_str}", role=MessageRole.USER),
    ChatMessage(content="{existing_answer}", role=MessageRole.ASSISTANT),
    ChatMessage(
        content="We have the opportunity to refine the above answer "
        "(only if needed) with some more context below.\n"
        "------------\n"
        "{context_msg}\n"
        "------------\n"
        "Given the new context and using the best of your knowledge, improve the existing answer. "
        "If you can't improve the existing answer, just repeat it again.",
        role=MessageRole.USER,
    ),
]


CHAT_REFINE_PROMPT = ChatPromptTemplate(CHAT_REFINE_PROMPT_TMPL_MSGS)


# refine prompt selector
REFINE_TEMPLATE = SelectorPromptTemplate(
    default_template=DEFAULT_REFINE_PROMPT,
    conditionals=[(is_chat_model, CHAT_REFINE_PROMPT)],
)
```

這看起來像是一堆程式碼，但並不算太糟！如果您查看預設提示詞，您可能會注意到有預設提示詞，以及針對聊天模型的提示詞。繼續這種趨勢，我們對自訂提示詞也做同樣的事情。然後，使用 prompt selector，我們可以將這兩種提示詞組合到一個物件中。如果使用的 LLM 是一個聊天模型（ChatGPT, GPT-4），則會使用聊天提示詞。否則，則使用正常的 prompt templates。

需要注意的另一點是我們只定義了一個 QA template。在聊天模型中，這將會轉換為一個單一的「human」訊息。

所以，現在我們可以將這些提示詞匯入我們的應用程式並在查詢期間使用它們。

```
from constants import REFINE_TEMPLATE, TEXT_QA_TEMPLATE


...
if "llama_index" in st.session_state:
    query_text = st.text_input("Ask about a term or definition:")
    if query_text:
        query_text = query_text  # Notice we removed the old instructions
        with st.spinner("Generating answer..."):
            response = (
                st.session_state["llama_index"]
                .as_query_engine(
                    similarity_top_k=5,
                    response_mode="compact",
                    text_qa_template=TEXT_QA_TEMPLATE,
                    refine_template=DEFAULT_REFINE_PROMPT,
                )
                .query(query_text)
            )
        st.markdown(str(response))
...
```

如果您對查詢進行更多實驗，希望您會注意到回應現在稍微更好地遵循我們的指示！

## 改進 #3 - 影像支援

Llama index 也支援影像！使用 Llama Index，我們可以上傳 documents（論文、信件等）的影像，Llama Index 會處理文字的提取。我們可以利用這一點，也允許使用者上傳他們的 documents 影像並從中提取術語和定義。

如果您收到關於 PIL 的匯入錯誤，請先使用 `pip install Pillow` 安裝它。

```
from PIL import Image
from llama_index.readers.file import ImageReader




@st.cache_resource
def get_file_extractor():
    image_parser = ImageReader(keep_image=True, parse_text=True)
    file_extractor = {
        ".jpg": image_parser,
        ".png": image_parser,
        ".jpeg": image_parser,
    }
    return file_extractor




file_extractor = get_file_extractor()
...
with upload_tab:
    st.subheader("Extract and Query Definitions")
    if st.button("Initialize Index and Reset Terms", key="init_index_1"):
        st.session_state["llama_index"] = initialize_index(
            llm_name, model_temperature, api_key
        )
        st.session_state["all_terms"] = DEFAULT_TERMS


    if "llama_index" in st.session_state:
        st.markdown(
            "Either upload an image/screenshot of a document, or enter the text manually."
        )
        uploaded_file = st.file_uploader(
            "Upload an image/screenshot of a document:",
            type=["png", "jpg", "jpeg"],
        )
        document_text = st.text_area("Or enter raw text")
        if st.button("Extract Terms and Definitions") and (
            uploaded_file or document_text
        ):
            st.session_state["terms"] = {}
            terms_docs = {}
            with st.spinner("Extracting (images may be slow)..."):
                if document_text:
                    terms_docs.update(
                        extract_terms(
                            [Document(text=document_text)],
                            term_extract_str,
                            llm_name,
                            model_temperature,
                            api_key,
                        )
                    )
                if uploaded_file:
                    Image.open(uploaded_file).convert("RGB").save("temp.png")
                    img_reader = SimpleDirectoryReader(
                        input_files=["temp.png"], file_extractor=file_extractor
                    )
                    img_docs = img_reader.load_data()
                    os.remove("temp.png")
                    terms_docs.update(
                        extract_terms(
                            img_docs,
                            term_extract_str,
                            llm_name,
                            model_temperature,
                            api_key,
                        )
                    )
            st.session_state["terms"].update(terms_docs)


        if "terms" in st.session_state and st.session_state["terms"]:
            st.markdown("Extracted terms")
            st.json(st.session_state["terms"])


            if st.button("Insert terms?"):
                with st.spinner("Inserting terms"):
                    insert_terms(st.session_state["terms"])
                st.session_state["all_terms"].update(st.session_state["terms"])
                st.session_state["terms"] = {}
                st.experimental_rerun()
```

在這裡，我們添加了使用 Streamlit 上傳檔案的選項。然後影像會被開啟並儲存到磁碟（這看起來有點不夠精緻但讓事情保持簡單）。然後我們將影像路徑傳遞給 reader，提取 documents/text，並移除我們的臨時影像檔案。

現在我們有了 documents，我們可以像以前一樣呼叫 `extract_terms()`。

## 結論/TLDR

在本教學中，我們涵蓋了大量資訊，同時解決了一些常見的問題和困難：

- 使用不同的索引處理不同的使用情境（List vs. Vector index）
- 使用 Streamlit 的 `session_state` 概念儲存 global state 值
- 使用 Llama Index 自訂內部提示詞
- 使用 Llama Index 從影像中讀取文字

本教學的最終版本可以在 [此處](https://github.com/abdulasiraj/A-Guide-to-Extracting-Terms-and-Definitions) 找到，並且可以在 [Huggingface Spaces](https://huggingface.co/spaces/Nobody4591/Llama_Index_Term_Extractor) 上提供即時託管演示。