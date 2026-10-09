---
title: "**WordLift** 向量資料庫"
---

## 簡介

本腳本演示如何爬取產品網站，擷取相關資訊，建立一個適合 SEO 的知識圖譜（Knowledge Graph，即 PDPs 和 PLPs 的結構化表示），並利用它來改善搜尋和使用者體驗。

### 主要功能與函式庫：

- 網路爬取 (Advertools)
- 建立產品詳情頁 (PDPs) 和產品列表頁 (PLPs) 的知識圖譜 - WordLift
- 產品推薦 (WordLift Neural Search)
- 建立購物助理 (WordLift + LlamaIndex 🦙)

此方法能提升電子商務網站的 SEO 表現和使用者參與度。

瞭解更多相關資訊請點擊這裡：

- <https://www.youtube.com/watch?v=CH-ir1MTAwQ>
- <https://wordlift.io/academy-entries/mastering-serp-analysis-knowledge-graphs>

|                                                                                                    |                                                                                                                                                                                                   |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![](/assets/d4ee1b746d5a.png)](https://wordlift.io) | 由 [Andrea Volpini ](https://wordlift.io/blog/en/entity/andrea-volpini) 和 [David Riccitelli](https://wordlift.io/blog/en/entity/david-riccitelli) MIT License *最後更新時間：**2024 年 7 月 31 日*** |

# 設定

```
!pip install advertools -q
!pip install -U wordlift-client # 🎉 first time on stage 🎉
!pip install rdflib -q
```

```
# Standard library imports
import json
import logging
import os
import re
import urllib.parse
import requests
from typing import List, Optional


# Third-party imports
import advertools as adv
import pandas as pd
import nest_asyncio


# RDFLib imports
from rdflib import Graph, Literal, RDF, URIRef
from rdflib.namespace import SDO, Namespace, DefinedNamespace


# WordLift client imports
import wordlift_client
from wordlift_client import Configuration, ApiClient
from wordlift_client.rest import ApiException
from wordlift_client.api.dataset_api import DatasetApi
from wordlift_client.api.entities_api import EntitiesApi
from wordlift_client.api.graph_ql_api import GraphQLApi
from wordlift_client.models.graphql_request import GraphqlRequest
from wordlift_client.models.page_vector_search_query_response_item import (
    PageVectorSearchQueryResponseItem,
)
from wordlift_client.models.vector_search_query_request import (
    VectorSearchQueryRequest,
)
from wordlift_client.api.vector_search_queries_api import (
    VectorSearchQueriesApi,
)




# Asynchronous programming
import asyncio


# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Apply nest_asyncio
nest_asyncio.apply()
```

```
WORDLIFT_KEY = os.getenv("WORDLIFT_KEY")
OPENAI_KEY = os.getenv("OPENAI_KEY")
```

# 使用 Advertools 爬取網站

```
# Step 1: Define the website structure
# -----------------------------------


# We're working with two types of pages:
# 1. Product Listing Pages (PLP): https://product-finder.wordlift.io/product-category/bags/
# 2. Product Detail Pages (PDP): https://product-finder.wordlift.io/product/1980s-marco-polo-crossbody-bag-in-black/


# The product description can be found at this XPath:
# /html/body/div[1]/div/div/div/div/div[1]/div/div[3]/div/div[2]/div[2]/div[1]/p/text()
# The price is here:
# /html/body/div[1]/div/div/div/div/div[1]/div/div[3]/div/div[2]/p/span/bdi/text()
# The category is here:
# //span[contains(@class, 'breadcrumb')]/a/text()


# Step 2: Set up the crawl
# ------------------------




def crawl_website(url, output_file, num_pages=10):
    logger.info(f"Starting crawl of {url}")
    adv.crawl(
        url,
        output_file,
        follow_links=True,
        custom_settings={
            "CLOSESPIDER_PAGECOUNT": num_pages,
            "USER_AGENT": "WordLiftBot/1.0 (Maven Project)",
            "CONCURRENT_REQUESTS_PER_DOMAIN": 2,
            "DOWNLOAD_DELAY": 1,
            "ROBOTSTXT_OBEY": False,
        },
        xpath_selectors={
            "product_description": "/html/body/div[1]/div/div/div/div/div[1]/div/div[3]/div/div[2]/div[2]/div[1]/p/text()",
            "product_price": "/html/body/div[1]/div/div/div/div/div[1]/div/div[3]/div/div[2]/p/span/bdi/text()",
            "product_category": "//span[@class='posted_in']/a/text()",
        },
    )
    logger.info(f"Crawl completed. Results saved to {output_file}")




# Step 3: Analyze URL patterns
# ----------------------------




def analyze_url_patterns(df):
    df["page_type"] = df["url"].apply(
        lambda x: "PLP"
        if "/product-category/" in x
        else ("PDP" if "/product/" in x else "Other")
    )
    logger.info(
        f"Found {(df['page_type'] == 'PLP').sum()} PLPs and {(df['page_type'] == 'PDP').sum()} PDPs"
    )
    return df




# Step 4: Extract page data
# ----------------------------




def extract_page_data(df):
    extracted_data = []
    for _, row in df.iterrows():
        page = {
            "url": row["url"],
            "title": row["title"],
            "page_type": row["page_type"],
            "meta_description": row.get("meta_description", ""),
            "og_title": row.get("og_title", ""),
            "og_description": row.get("og_description", ""),
            "h1": ", ".join(row.get("h1", []))
            if isinstance(row.get("h1"), list)
            else row.get("h1", ""),
            "h2": ", ".join(row.get("h2", []))
            if isinstance(row.get("h2"), list)
            else row.get("h2", ""),
        }


        if row["page_type"] == "PDP":
            page.update(
                {
                    "product_description": ", ".join(
                        row.get("product_description", [])
                    )
                    if isinstance(row.get("product_description"), list)
                    else row.get("product_description", ""),
                    "product_price": ", ".join(row.get("product_price", []))
                    if isinstance(row.get("product_price"), list)
                    else row.get("product_price", ""),
                    "product_category": ", ".join(
                        row.get("product_category", [])
                    )
                    if isinstance(row.get("product_category"), list)
                    else row.get("product_category", ""),
                }
            )
        elif row["page_type"] == "PLP":
            # Parse the category from the H1 content
            h1_content = (
                row.get("h1", [""])[0]
                if isinstance(row.get("h1"), list)
                else row.get("h1", "")
            )
            category = (
                h1_content.split("@@")[-1]
                if "@@" in h1_content
                else h1_content.replace("Category: ", "").strip()
            )
            page["category_name"] = category


        extracted_data.append(page)


    return pd.DataFrame(extracted_data)
```

# 使用 WordLift 建立 KG 🕸

```
# Step 5: Configure the WordLift client
# ----------------------------


# Create a configuration object for the WordLift API client using your WordLift key.
configuration = Configuration(host="https://api.wordlift.io")
configuration.api_key["ApiKey"] = WORDLIFT_KEY
configuration.api_key_prefix["ApiKey"] = "Key"


EXAMPLE_PRIVATE_NS = Namespace("https://ns.example.org/private/")


BASE_URI = "http://data.wordlift.io/[dataset_id]/"
```

```
# Step 6: Build the KG and the embeddings
# ----------------------------




async def cleanup_knowledge_graph(api_client):
    dataset_api = wordlift_client.DatasetApi(api_client)
    try:
        # Delete all
        await dataset_api.delete_all_entities()
    except Exception as e:
        print(
            "Exception when calling DatasetApi->delete_all_entities: %s\n" % e
        )




async def create_entity(entities_api, entity_data):
    g = Graph().parse(data=json.dumps(entity_data), format="json-ld")
    body = g.serialize(format="application/rdf+xml")
    await entities_api.create_or_update_entities(
        body=body, _content_type="application/rdf+xml"
    )




def replace_url(original_url: str) -> str:
    old_domain = "https://product-finder.wordlift.io/"
    new_domain = "https://data-science-with-python-for-seo.wordlift.dev/"


    if original_url.startswith(old_domain):
        return original_url.replace(old_domain, new_domain, 1)
    else:
        return original_url




def create_entity_uri(url):
    parsed_url = urllib.parse.urlparse(url)
    path = parsed_url.path.strip("/")
    path_parts = path.split("/")
    fragment = parsed_url.fragment


    if "product" in path_parts:
        # It's a product page or product offer
        product_id = path_parts[-1]  # Get the last part of the path
        if fragment == "offer":
            return f"{BASE_URI}offer_{product_id}"
        else:
            return f"{BASE_URI}product_{product_id}"
    elif "product-category" in path_parts:
        # It's a product listing page (PLP)
        category = path_parts[-1]  # Get the last part of the path
        return f"{BASE_URI}plp_{category}"
    else:
        # For any other type of page
        safe_path = "".join(c if c.isalnum() else "_" for c in path)
        if fragment == "offer":
            return f"{BASE_URI}offer_{safe_path}"
        else:
            return f"{BASE_URI}page_{safe_path}"




def clean_price(price_str):
    if not price_str or price_str == "N/A":
        return None
    if isinstance(price_str, (int, float)):
        return float(price_str)
    try:
        # Remove any non-numeric characters except for the decimal point
        cleaned_price = "".join(
            char for char in str(price_str) if char.isdigit() or char == "."
        )
        return float(cleaned_price)
    except ValueError:
        logger.warning(f"Could not convert price: {price_str}")
        return None




def create_product_entity(row, dataset_uri):
    url = replace_url(row["url"])
    product_entity_uri = create_entity_uri(url)


    entity_data = {
        "@context": "http://schema.org",
        "@type": "Product",
        "@id": product_entity_uri,
        "url": url,
        "name": row["title"]
        if not pd.isna(row["title"])
        else "Untitled Product",
        "urn:meta:requestEmbeddings": [
            "http://schema.org/name",
            "http://schema.org/description",
        ],
    }


    if not pd.isna(row.get("product_description")):
        entity_data["description"] = row["product_description"]


    if not pd.isna(row.get("product_price")):
        price = clean_price(row["product_price"])
        if price is not None:
            # Create offer ID as a sub-resource of the product ID
            offer_entity_uri = f"{product_entity_uri}/offer_1"
            entity_data["offers"] = {
                "@type": "Offer",
                "@id": offer_entity_uri,
                "price": str(price),
                "priceCurrency": "GBP",
                "availability": "http://schema.org/InStock",
                "url": url,
            }


    if not pd.isna(row.get("product_category")):
        entity_data["category"] = row["product_category"]


    custom_attributes = {
        key: row[key]
        for key in [
            "meta_description",
            "og_title",
            "og_description",
            "h1",
            "h2",
        ]
        if not pd.isna(row.get(key))
    }
    if custom_attributes:
        entity_data[str(EXAMPLE_PRIVATE_NS.attributes)] = json.dumps(
            custom_attributes
        )


    return entity_data




def create_collection_entity(row, dataset_uri):
    url = replace_url(row["url"])
    entity_uri = create_entity_uri(url)


    entity_data = {
        "@context": "http://schema.org",
        "@type": "CollectionPage",
        "@id": entity_uri,
        "url": url,
        "name": row["category_name"] or row["title"],
    }


    custom_attributes = {
        key: row[key]
        for key in [
            "meta_description",
            "og_title",
            "og_description",
            "h1",
            "h2",
        ]
        if row.get(key)
    }
    if custom_attributes:
        entity_data[str(EXAMPLE_PRIVATE_NS.attributes)] = json.dumps(
            custom_attributes
        )


    return entity_data




async def build_knowledge_graph(df, dataset_uri, api_client):
    entities_api = EntitiesApi(api_client)


    for _, row in df.iterrows():
        try:
            if row["page_type"] == "PDP":
                entity_data = create_product_entity(row, dataset_uri)
            elif row["page_type"] == "PLP":
                entity_data = create_collection_entity(row, dataset_uri)
            else:
                logger.warning(
                    f"Skipping unknown page type for URL: {row['url']}"
                )
                continue


            if entity_data is None:
                logger.warning(
                    f"Skipping page due to missing critical data: {row['url']}"
                )
                continue


            await create_entity(entities_api, entity_data)
            logger.info(
                f"Created entity for {row['page_type']}: {row['title']}"
            )
        except Exception as e:
            logger.error(
                f"Error creating entity for {row['page_type']}: {row['title']}"
            )
            logger.error(f"Error: {str(e)}")
```

# 執行展示

```
# ----------------------------
# Main Execution
# ----------------------------


# Global configuration variables
CRAWL_URL = "https://product-finder.wordlift.io/"
OUTPUT_FILE = "crawl_results.jl"




async def main():
    # Step 1: Crawl the website
    crawl_website(CRAWL_URL, OUTPUT_FILE)


    # Step 2: Load the crawled data
    df = pd.read_json(OUTPUT_FILE, lines=True)


    # Step 3: Analyze URL patterns
    df = analyze_url_patterns(df)


    # Step 4: Extract page data
    pages_df = extract_page_data(df)


    async with ApiClient(configuration) as api_client:
        # Clean up the existing knowledge graph
        try:
            await cleanup_knowledge_graph(api_client)
            logger.info(f"Knowledge Graph Cleaned Up")
        except Exception as e:
            logger.error(
                f"Failed to clean up the existing Knowledge Graph: {str(e)}"
            )
            return  # Exit if cleanup fails


        # Build the new knowledge graph
        await build_knowledge_graph(pages_df, CRAWL_URL, api_client)


    logger.info("Knowledge graph building completed.")




if __name__ == "__main__":
    asyncio.run(main())
```

## 現在使用 GraphQL 在 KG 中查詢產品

```
async def perform_graphql_query(api_client):
    graphql_api = GraphQLApi(api_client)
    query = """
    {
        products(rows: 20) {
            id: iri
            category: string(name:"schema:category")
            name: string(name:"schema:name")
            description: string(name:"schema:description")
            url: string(name:"schema:url")
        }
    }
    """
    request = GraphqlRequest(query=query)


    try:
        response = await graphql_api.graphql_using_post(body=request)
        print("GraphQL Query Results:")
        print(json.dumps(response, indent=2))
    except Exception as e:
        logger.error(f"An error occurred during GraphQL query: {e}")




async with ApiClient(configuration) as api_client:
    # Step 6: Perform GraphQL query
    await perform_graphql_query(api_client)
    logger.info("Knowledge graph building and GraphQL query completed.")
```

# 利用知識圖譜

現在我們已成功為電子商務網站建立了一個包含產品嵌入 (product embeddings) 的知識圖譜，我們可以利用它來提升使用者體驗和功能。為每個產品生成的嵌入，使我們能夠執行語義相似性搜尋並建立更智慧的系統。

## 為您的網頁新增結構化資料

在本節中，我們將對 WordLift 的資料 API 進行簡單測試。此 API 用於將來自知識圖譜 (KG) 的結構化資料標記注入到您的網頁中。結構化資料有助於搜尋引擎更好地理解您的內容，可能在搜尋結果中帶來豐富片段 (rich snippets) 和提升 SEO。

對於本筆筆記，我們正在使用一個預先配置好的 KG 在一個示範電子商務網站上。我們將參考一個虛構的 URL：`https://data-science-with-python-for-seo.wordlift.dev`。

當呼叫 WordLift 的資料 API 時，我們只需傳入一個 URL，即可收到對應的 JSON-LD (JavaScript 物件表示法 for Linked Data)。此結構化資料通常包含電子商務網站所需的產品詳情、價格和可用性等資訊。

下方的 `get_json_ld_from_url()` 函式演示了此過程。它以 URL 作為輸入，並回傳以 JSON-LD 格式的結構化資料，可供注入到您的網頁中。

```
def get_json_ld_from_url(url):
    # Construct the API URL by prefixing with 'https://api.wordlift.io/data/https/'
    api_url = "https://api.wordlift.io/data/https/" + url.replace(
        "https://", ""
    )


    # Make the GET request to the API
    response = requests.get(api_url)


    # Check if the request was successful
    if response.status_code == 200:
        # Parse the JSON-LD from the response
        json_ld = response.json()
        return json_ld
    else:
        print(f"Failed to retrieve data: {response.status_code}")
        return None




def pretty_print_json(json_obj):
    # Pretty print the JSON object
    print(json.dumps(json_obj, indent=4))
```

```
# Let's run a test
url = "https://data-science-with-python-for-seo.wordlift.dev/product/100-pure-deluxe-travel-pack-duo-2/"
json_ld = get_json_ld_from_url(url)
json_ld
```

## 使用 WordLift Neural Search 生成相似產品連結

有了產品嵌入，我們現在可以利用 WordLift 的 Neural Search 功能向使用者推薦相似產品。此功能顯著提升使用者參與度，並能透過根據語義相似性展示相關產品來潛在地提升銷售額。

與傳統的關鍵字匹配不同，語義相似性會考慮產品描述的上下文和意義。這種方法允許提供更細緻、更準確的推薦，即使產品沒有相同的精確關鍵字。

我們先前定義的 `get_top_k_similar_urls` 函式實作了此功能。它以產品 URL 作為輸入，回傳一個按相似度分數排序的語義相似產品列表。舉例來說，如果使用者正在查看一件紅色棉質 T 恤，此功能可能會推薦其他不同顏色的棉質 T 恤，或由不同材質製成的相似風格上衣。這為使用者創造了更直觀、更吸引人的購物體驗。

透過實作這個 Neural Search 功能，我們能夠創造更個人化、更高效的購物體驗，有助於提高使用者滿意度及轉換率。

```
async def get_top_k_similar_urls(configuration, query_url: str, top_k: int):
    request = VectorSearchQueryRequest(
        query_url=query_url,
        similarity_top_k=top_k,
    )


    async with wordlift_client.ApiClient(configuration) as api_client:
        api_instance = VectorSearchQueriesApi(api_client)
        try:
            page = await api_instance.create_query(
                vector_search_query_request=request
            )
            return [
                {
                    "url": item.id,
                    "name": item.text.split("\n")[0],
                    "score": item.score,
                }
                for item in page.items
                if item.id and item.text
            ]
        except Exception as e:
            logger.error(f"Error querying for entities: {e}", exc_info=True)
            return None
```

```
top_k = 10
url = "https://data-science-with-python-for-seo.wordlift.dev/product/100-mineral-sunscreen-spf-30/"
similar_urls = await get_top_k_similar_urls(
    configuration, query_url=url, top_k=top_k
)
print(json.dumps(similar_urls, indent=2))
```

## 使用 LlamaIndex 建立電子商務網站的聊天機器人 🦙

我們建立的 Knowledge Graph 為建立智慧聊天機器人提供了完美的基礎。LlamaIndex（前身為 GPT Index）是一個強大的資料框架，允許我們將私有或特定領域的資料輸入、結構化並存取在大型語言模型 (LLMs) 中。透過 LlamaIndex，我們可以建立一個具有情境感知能力的聊天機器人，它能理解我們的產品目錄並有效協助客戶。

透過結合 LlamaIndex 與我們的 Knowledge Graph，我們可以開發一個能回應直接查詢的聊天機器人。這個聊天機器人將理解產品目錄，使其能夠：

1. 回答有關產品規格、供應情況和價格的問題
2. 根據客戶偏好提供個人化的產品推薦
3. 提供相似產品的比較

這種方法能帶來更自然、更有幫助的客戶互動，提升他們的購物體驗。聊天機器人可以利用我們 Knowledge Graph 中的結構化資料，使用 LlamaIndex 來有效檢索並透過 LLM 呈現相關資訊。

在後續的章節中，我們將介紹如何使用我們的 Knowledge Graph 資料設定 LlamaIndex，並建立一個能智慧協助我們電子商務客戶的聊天機器人。

### 安裝 `LlamaIndex` 和 `WordLiftVectorStore` 💪

```
%%capture
!pip install llama-index
!pip install -U 'git+https://github.com/wordlift/llama_index.git#egg=llama-index-vector-stores-wordlift&subdirectory=llama-index-integrations/vector_stores/llama-index-vector-stores-wordlift'
!pip install llama-index-embeddings-nomic
```

```
# import the necessary modules
from llama_index.vector_stores.wordlift import WordliftVectorStore
from llama_index.core import VectorStoreIndex
```

### 設定 NomicEmbeddings 給我們的 Query Engine

Nomic 發布了 v1.5 🪆🪆🪆 的 embedding model，這為文字 embedding 能力帶來了顯著的改進。Embeddings 是捕捉文字語義的數值表示，讓我們的系統能夠理解和比較查詢的內容及 documents。

**Nomic v1.5** 的主要功能包括：

- 尺寸可變的 embeddings，維度在 64 到 768 之間
- Matryoshka learning，允許巢狀表示
- 擴展的上下文大小為 8192 tokens

我們在 WordLift 中使用 NomicEmbeddings 是因為這些進階功能，現在我們也正在設定 LlamaIndex 使用它來編碼使用者查詢。在我們的堆疊中保持 embedding model 的一致性，確保了我們的 Knowledge Graph 與查詢理解過程之間的更好對齊。

NomicEmbeddings 的更多資訊可以在 [此處](https://www.nomic.ai/blog/posts/nomic-embed-matryoshka) 找到。

前往 [獲取您的免費金鑰](https://atlas.nomic.ai/)。

```
from llama_index.embeddings.nomic import NomicEmbedding


nomic_api_key = os.getenv("NOMIC_KEY")


embed_model = NomicEmbedding(
    api_key=nomic_api_key,
    dimensionality=128,
    model_name="nomic-embed-text-v1.5",
)


embedding = embed_model.get_text_embedding("Hey Ho SEO!")
len(embedding)
```

我們將使用 OpenAI 作為生成回應的預設 LLM。當然也可以使用任何其他可用的 LLM。

```
# Set the environment variable
os.environ["OPENAI_API_KEY"] = OPENAI_KEY
```

現在讓我們使用我們 Knowledge Graph 的資料設定 WordliftVectorStore。

```
# Let's configure WordliftVectorStore using our WL Key
vector_store = WordliftVectorStore(key=API_KEY)


# Create an index from the vector store
index = VectorStoreIndex.from_vector_store(
    vector_store, embed_model=embed_model
)


# Create a query engine
query_engine = index.as_query_engine()
```

```
query1 = "Can you give me a product similar to the facial puff? Please add the URL also"
result1 = query_engine.query(query1)


print(result1)
```

```
# Function to handle queries
def query_engine(query):
    # Create an index from the vector store
    index = VectorStoreIndex.from_vector_store(
        vector_store, embed_model=embed_model
    )


    # Create a query engine
    query_engine = index.as_query_engine()
    response = query_engine.query(query)
    return response




# Interactive query loop
while True:
    user_query = input("Enter your query (or 'quit' to exit): ")
    if user_query.lower() == "quit":
        break
    result = query_engine(user_query)
    print(result)
    print("\n---\n")
```
