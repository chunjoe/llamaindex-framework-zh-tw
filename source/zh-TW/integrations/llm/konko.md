---
title: "Konko"
---

如果您在 colab 上開啟此 Notebook，您可能需要安裝 LlamaIndex 🦙。

> [Konko](https://www.konko.ai/) API 是一個完全託管的 Web API，旨在幫助應用程式開發者：

Konko API 是一個完全託管的 API，旨在幫助應用程式開發者：

1. 為他們的應用程式選擇合適的 LLM
2. 使用各種 open-source 和 proprietary LLMs 進行原型設計
3. 存取 open-source LLMs 的 Fine Tuning，以以更低的成本獲得業界領先的效能
4. 無需設定基礎設施或管理，即可根據 Konko AI 的 SOC 2 合規、多雲基礎設施，設定符合安全、隱私、吞吐量、延遲 SLA 的低成本生產 API

### 存取模型的步驟

1. **探索可用模型：** 從 Konko 瀏覽 [available models](https://docs.konko.ai/docs/list-of-models)。每個模型都針對不同的使用案例和能力。

2. **識別合適的 Endpoint：** 確定哪個 [endpoint](https://docs.konko.ai/docs/list-of-models#list-of-available-models)（ChatCompletion 或 Completion）支援您所選的模型。

3. **選擇模型：** 根據其 metadata 和它與您使用案例的契合度來 [Choose a model](https://docs.konko.ai/docs/list-of-models#list-of-available-models)。

4. **提示指南：** 選擇模型後，請參考 [prompting guidelines](https://docs.konko.ai/docs/prompting) 以有效地與其溝通。

5. **使用 API：** 最後，使用適當的 Konko [API endpoint](https://docs.konko.ai/docs/quickstart-for-completion-and-chat-completion-endpoint) 來呼叫模型並接收回應。

要執行此 Notebook，您需要 Konko API key。您可以透過在 [Konko](https://www.konko.ai/) 註冊來建立一個。

此範例將介紹如何使用 LlamaIndex 與 `Konko` ChatCompletion [models](https://docs.konko.ai/docs/list-of-models#konko-hosted-models-for-chatcompletion) 和 Completion [models](https://docs.konko.ai/docs/list-of-models#konko-hosted-models-for-completion) 互動。

```
%pip install llama-index-llms-konko
```

```
!pip install llama-index
```

## 呼叫 `chat` 使用 ChatMessage List

您需要設定 env var `KONKO_API_KEY`

```
import os


os.environ["KONKO_API_KEY"] = "<your-api-key>"
```

```
from llama_index.llms.konko import Konko
from llama_index.core.llms import ChatMessage
```

```
llm = Konko(model="meta-llama/llama-2-13b-chat")
messages = ChatMessage(role="user", content="Explain Big Bang Theory briefly")


resp = llm.chat([messages])
print(resp)
```

```
assistant:   The Big Bang Theory is the leading explanation for the origin and evolution of the universe, based on a vast body of observational and experimental evidence. Here's a brief summary of the theory:


1. The universe began as a single point: According to the Big Bang Theory, the universe began as an infinitely hot and dense point called a singularity around 13.8 billion years ago.
2. Expansion and cooling: The singularity expanded rapidly, and as it did, it cooled and particles began to form. This process is known as the "cosmic microwave background radiation" (CMB).
3. Formation of subatomic particles: As the universe expanded and cooled, protons, neutrons, and electrons began to form from the CMB. These particles eventually coalesced into the first atoms, primarily hydrogen and helium.
4. Nucleosynthesis: As the universe continued to expand and cool, more complex nuclei were formed through a process called nucleosynthesis. This process created heavier elements such as deuterium, helium-3, helium-4, and lithium.
5. The first stars and galaxies: As
```

## 呼叫 `chat` 使用 OpenAI Models

您需要設定 env var `OPENAI_API_KEY`

```
import os


os.environ["OPENAI_API_KEY"] = "<your-api-key>"


llm = Konko(model="gpt-3.5-turbo")
```

```
message = ChatMessage(role="user", content="Explain Big Bang Theory briefly")
resp = llm.chat([message])
print(resp)
```

```
assistant: The Big Bang Theory is a scientific explanation for the origin and evolution of the universe. According to this theory, the universe began as a singularity, an extremely hot and dense point, approximately 13.8 billion years ago. It then rapidly expanded and continues to expand to this day. As the universe expanded, it cooled down, allowing matter and energy to form. Over time, galaxies, stars, and planets formed through gravitational attraction. The Big Bang Theory is supported by various pieces of evidence, such as the observed redshift of distant galaxies and the cosmic microwave background radiation.
```

### Streaming

```
message = ChatMessage(role="user", content="Tell me a story in 250 words")
resp = llm.stream_chat([message], max_tokens=1000)
for r in resp:
    print(r.delta, end="")
```

```
Once upon a time in a small village, there lived a young girl named Lily. She was known for her kind heart and love for animals. Every day, she would visit the nearby forest to feed the birds and rabbits.


One sunny morning, as Lily was walking through the forest, she stumbled upon a wounded bird with a broken wing. She carefully picked it up and decided to take it home. Lily named the bird Ruby and made a cozy nest for her in a small cage.


Days turned into weeks, and Ruby's wing slowly healed. Lily knew it was time to set her free. With a heavy heart, she opened the cage door, and Ruby hesitantly flew away. Lily watched as Ruby soared high into the sky, feeling a sense of joy and fulfillment.


As the years passed, Lily's love for animals grew stronger. She started rescuing and rehabilitating injured animals, creating a sanctuary in the heart of the village. People from far and wide would bring her injured creatures, knowing that Lily would care for them with love and compassion.


Word of Lily's sanctuary spread, and soon, volunteers came forward to help her. Together, they built enclosures, planted trees, and created a safe haven for all creatures big and small. Lily's sanctuary became a place of hope and healing, where animals found solace and humans learned the importance of coexistence.


Lily's dedication and selflessness inspired others to follow in her footsteps. The village transformed into a community that valued and protected its wildlife. Lily's dream of a harmonious world, where humans and animals lived in harmony, became a reality.


And so, the story of Lily and her sanctuary became a legend, passed down through generations. It taught people the power of compassion and the impact one person can have on the world. Lily's legacy lived on, reminding everyone that even the smallest act of kindness can create a ripple effect of change.
```

## 使用 Prompt 呼叫 `complete`

```
llm = Konko(model="numbersstation/nsql-llama-2-7b", max_tokens=100)
text = """CREATE TABLE stadium (
    stadium_id number,
    location text,
    name text,
    capacity number,
    highest number,
    lowest number,
    average number
)


CREATE TABLE singer (
    singer_id number,
    name text,
    country text,
    song_name text,
    song_release_year text,
    age number,
    is_male others
)


CREATE TABLE concert (
    concert_id number,
    concert_name text,
    theme text,
    stadium_id text,
    year text
)


CREATE TABLE singer_in_concert (
    concert_id number,
    singer_id text
)


-- Using valid SQLite, answer the following questions for the tables provided above.


-- What is the maximum capacity of stadiums ?


SELECT"""
response = llm.complete(text)
print(response)
```

```
 MAX(capacity) FROM stadiumm</s>
```

```
llm = Konko(model="phind/phind-codellama-34b-v2", max_tokens=100)
text = """### System Prompt
You are an intelligent programming assistant.


### User Message
Implement a linked list in C++


### Assistant
..."""


resp = llm.stream_complete(text, max_tokens=1000)
for r in resp:
    print(r.delta, end="")
```

````
```cpp
#include<iostream>
using namespace std;


// Node structure
struct Node {
    int data;
    Node* next;
};


// Class for LinkedList
class LinkedList {
    private:
        Node* head;
    public:
        LinkedList() : head(NULL) {}


        void addNode(int n) {
            Node* newNode = new Node;
            newNode->data = n;
            newNode->next = head;
            head = newNode;
        }


        void printList() {
            Node* cur = head;
            while(cur != NULL) {
                cout << cur->data << " -> ";
                cur = cur->next;
            }
            cout << "NULL" << endl;
        }
};


int main() {
    LinkedList list;
    list.addNode(1);
    list.addNode(2);
    list.addNode(3);
    list.printList();


    return 0;
}
```


This program creates a simple linked list with a `Node` structure and a `LinkedList` class. The `addNode` function is used to add nodes to the list, and the `printList` function is used to print the list. The main function creates a `LinkedList` object, adds some nodes, and then prints the list.</s>
````

## 模型配置

```
llm = Konko(model="meta-llama/llama-2-13b-chat")
```

```
resp = llm.stream_complete(
    "Show me the c++ code to send requests to HTTP Server", max_tokens=1000
)
for r in resp:
    print(r.delta, end="")
```

````
  Sure, here's an example of how you can send a request to an HTTP server using C++:


First, you'll need to include the `iostream` and `string` headers:
```
#include <iostream>
#include <string>
```
Next, you'll need to use the `std::string` class to create a string that contains the HTTP request. For example, to send a GET request to the server, you might use the following code:
```
std::string request = "GET /path/to/resource HTTP/1.1\r\n";
request += "Host: www.example.com\r\n";
request += "User-Agent: My C++ HTTP Client\r\n";
request += "Accept: */*\r\n";
request += "Connection: close\r\n\r\n";
```
This code creates a string that contains the GET request, including the request method, the URL, and the HTTP headers.


Next, you'll need to create a socket using the `socket` function:
```
int sock = socket(AF_INET, SOCK_STREAM, 0);
```
This function creates a socket that can be used to send and receive data over the network.


Once you have a socket, you can send the request to the server using the `send` function:
```
send(sock, request.c_str(), request.size(), 0);
```
This function sends the request to the server over the socket. The `c_str` method returns a pointer to the string's data, which is passed to the `send` function. The `size` method returns the length of the string, which is also passed to the `send` function.


Finally, you'll need to read the response from the server using the `recv` function:
```
char buffer[1024];
int bytes_received = recv(sock, buffer, 1024, 0);
```
This function reads data from the server and stores it in the `buffer` array. The `bytes_received` variable is set to the number of bytes that were received.


Here's the complete code:
```
#include <iostream>
#include <string>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>


int main() {
  // Create a socket
  int sock = socket(AF_INET, SOCK_STREAM, 0);


  // Create a string that contains the HTTP request
  std::string request = "GET /path/to/resource HTTP/1.1\r\n";
  request += "Host: www.example.com\r\n";
  request += "User-Agent: My C++ HTTP Client\r\n";
  request += "Accept: */*\r\n";
  request += "Connection: close\r\n\r\n";


  // Send the request to the server
  send(sock, request.c_str(), request.size(), 0);


  // Read the response from the server
  char buffer[1024];
  int bytes_received = recv(sock, buffer, 1024, 0);


  // Print the response
  std::cout << "Response: " << buffer << std::endl;


  // Close the socket
  close(sock);


  return 0;
}
```
This code sends a GET request to the server, reads the response, and prints it to the console. Note that this is just a simple example, and in a real-world application you would probably want to handle errors and manage the socket more robustly.
````
