---
title: "Python 非同步程式設計"
---

如果你剛開始使用 Python 非同步程式設計，本頁會帶你認識相關概念。

在 LlamaIndex 中，許多操作與函式都支援非同步（async）執行。這讓你可以同時執行多項操作而不阻塞主執行緒，通常能提升整體吞吐量與效能。

以下是幾個值得了解的核心概念：

## 1. `asyncio` 基礎

- **事件迴圈（event loop）**：事件迴圈負責排程與執行非同步操作，會持續檢查並執行工作（協程，coroutines）。所有由這個迴圈執行的非同步操作都由它管理，而且每個執行緒（thread）只能有一個事件迴圈。

- **`asyncio.run()`**：這是執行非同步程式的入口點。它會建立並管理事件迴圈，並在程式結束後進行清理。請注意，這個函式設計為每個執行緒只呼叫一次。FastAPI 等框架會替你執行事件迴圈；其他框架則需要你自行啟動。

- **Python Notebook 中的非同步程式**：Python Notebook 有些不同，因為其中的事件迴圈通常已在執行。因此你不必自行呼叫 `asyncio.run()`，可直接呼叫非同步函式並使用 await。

## 2. 非同步函式與 `await`

- **定義非同步函式**：使用 `async def` 語法定義非同步函式（coroutine，協程）。呼叫非同步函式時不會立即執行，而會回傳一個 coroutine 物件，等待排程與執行。

- **使用 `await`**：在非同步函式中，使用 `await` 暫停目前函式，直到等待的工作（task）完成。寫下 `await some_fn()` 時，函式會將控制權交還給事件迴圈，讓其他工作得以排程和執行。一次只會執行一個非同步函式；它們透過 `await` 彼此協作。

## 3. 認識並行

- **協作式並行（Cooperative Concurrency）**：你可以排程多個非同步工作（task），但同一時間只會執行一個。這與多個工作同時執行的真正平行處理不同。工作遇到 `await` 時會暫停，讓其他工作有機會執行。因此，非同步程式很適合用於 I/O 密集型任務，例如呼叫 LLM API 或其他服務，因為這類操作經常需要等待。

- **並非真正的平行處理**：Asyncio 提供協作式並行，但不會讓多個工作真正同時執行。若 CPU 密集型工作需要平行處理，可以考慮使用 threading 或 multiprocessing。LlamaIndex 在大多數情況下會避免使用 multiprocessing，並由使用者自行實作，因為要安全且有效地處理這類工作並不容易。

## 4. 處理阻塞（同步）程式碼

- **`asyncio.to_thread()`**：有時你需要執行同步（阻塞）程式碼，又不想讓非同步程式停住。`asyncio.to_thread()` 會將阻塞程式碼交由另一個執行緒執行，讓事件迴圈繼續處理其他工作。使用時請留意，它會增加一些額外成本，也可能讓偵錯更困難。

- **替代方案：Executor**：你也可能會看到使用 `loop.run_in_executor()` 執行阻塞函式的寫法。

## 5. 實用範例

以下範例示範如何使用 `asyncio` 撰寫並執行非同步函式：

```
import asyncio




async def fetch_data(delay):
    print(f"Started fetching data with {delay}s delay")


    # Simulates I/O-bound work, such as network operation
    await asyncio.sleep(delay)


    print("Finished fetching data")
    return f"Data after {delay}s"




async def main():
    print("Starting main")


    # Schedule two tasks concurrently
    task1 = asyncio.create_task(fetch_data(2))
    task2 = asyncio.create_task(fetch_data(3))


    # Wait until both tasks complete
    result1, result2 = await asyncio.gather(task1, task2)


    print(result1)
    print(result2)
    print("Main complete")




if __name__ == "__main__":
    asyncio.run(main())
```
