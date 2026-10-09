# LlamaIndex Framework 繁體中文本地文件站

這個專案提供 LlamaIndex Framework 文件的繁體中文本機瀏覽版本，包含 integrations。網站頁面與圖片會隨建置輸出到 `dist/`，瀏覽文件不需要連線至原站。範圍外的文件與來源連結仍連到原站。

本次擷取於 2026-10-09（台灣時間）：文件樹 API 列出 430 篇，發布 sitemap 實際包含 448 個 Framework 文件路由；本地副本涵蓋全部 448 篇。

## GitHub Pages

- 線上文件：<https://chunjoe.github.io/llamaindex-framework-zh-tw/python/framework/>
- GitHub repo：<https://github.com/chunjoe/llamaindex-framework-zh-tw>
- 推送至 `main` 後，`.github/workflows/pages.yml` 會自動建置並部署；也可從 Actions 手動執行。
- 部署保留原始文件路由，並以 `SITE_BASE_PATH` 支援 repo 子目錄。未設定此變數時，本機與一般靜態匯出仍使用網站根目錄。

## 本機執行

```powershell
npm install
npm run dev
```

開啟 Vite 顯示的本機網址，通常是 `http://localhost:5173/python/framework/`。

## 重新同步或翻譯文件

文件擷取範圍依 `developers.llamaindex.ai` 發布的 `/python/framework/` sitemap 為準。翻譯與補譯透過 Ollama 執行，預設模型為本機 `gemma4:e2b`。這次也使用已設定的 `gemma4:31b-cloud` 加速公開文件的翻譯；使用雲端模型時，文件內容會送至該服務。先安裝並啟動 Ollama，再執行：

```powershell
npm run sync:docs
npm run repair:translations
npm run normalize:content
npm run validate:content
```

可用 `OLLAMA_TRANSLATION_MODEL` 指定已安裝的替代模型，或用 `OLLAMA_URL` 指定 Ollama API 位置。同步會將英文來源存入 `source/en/`、繁中 Markdown 存入 `source/zh-TW/`、本地頁面內容與搜尋索引存入 `public/content/`，並產生 `sync-report.json`。

`OLLAMA_TRANSLATION_CONCURRENCY` 控制同步與補譯的並行請求數。這次雲端翻譯使用 4 個請求；請依模型服務限制設定，避免同時執行同步與補譯。同步區塊快取與補譯快取可保留已完成工作，重新執行時會接續處理。

同步支援重用相同來源的翻譯快取；補譯程序會處理保留英文的說明段落與一般標籤。最後的正規化會比對 inline code、修正原站 Markdown 匯出的連結與錨點、下載巢狀連結中的圖片，並重建雙語搜尋索引。首次翻譯所有文件需要較長時間；已附的本地內容可直接啟動，瀏覽和建置都不需要 Ollama。

## 範圍與來源

- 原站內容與圖片依 LlamaIndex Developers 文件網站發布內容擷取；`sync-report.json` 記錄擷取日期、頁數及未取得素材。
- 介面和一般說明翻譯為台灣繁體中文。程式碼區塊與 inline code 逐字保留，常見產品/API 名稱保留原文。範圍內的文件連結改為本地路由，範圍外的連結維持指向來源網站。
- 範例的模型 ID、設定值、UUID、分數與檢索結果中的文件樣本也保留原文，便於對照執行結果。
- 文件頁面提供原始來源連結。LlamaIndex Framework 原始碼依其 MIT License 授權，詳見 [`LICENSE.LlamaIndex`](./LICENSE.LlamaIndex)。
- 來源： [Framework 文件](https://developers.llamaindex.ai/python/framework/)、[文件樹 API](https://developers.llamaindex.ai/api/list?path=%2Fpython%2Fframework%2F&depth=10)、[Markdown 存取方式](https://developers.llamaindex.ai/llms.txt)。原始文件樹與 sitemap 快照保存在 `source/snapshots/`。

## 建置

```powershell
npm run build
npm run preview
```

建置會產生每個文件路由的 `index.html`，也可用一般靜態 HTTP 伺服器提供 `dist/`，不必另外設定 SPA 路由回退。請透過 HTTP 瀏覽，避免用 `file://` 直接開啟。

## 檢查結果

本次建置與驗證已完成：

- 448 篇文件的來源、頁面、導覽與雙語搜尋索引完整對應。
- 全部程式碼區塊與 inline code 和英文來源一致；本地圖片與內部錨點檢查通過。
- 封鎖外部網路後，逐頁開啟全部 448 篇，沒有外部請求、載入失敗或瀏覽器執行錯誤。
- 桌面與手機版通過 18 項操作檢查，包括中英文搜尋、側欄、目錄、複製、前後頁與外觀切換。
- `npm run build` 成功，產生 448 個路由入口。預覽網址為 `http://localhost:4173/python/framework/`。

瀏覽器測試紀錄位於 `output/playwright/browser-report.json` 與 `output/playwright/interaction-report.json`；桌面和手機截圖位於同一資料夾。翻譯經自動檢查及主要頁面人工抽查，並非每篇皆經逐句人工校對。

`npm run validate:content` 比對全部英文來源與繁中頁面的程式碼區塊、inline code、標題結構、圖片檔案及內部錨點，結果寫入 `validation-report.json`。`link-normalization-report.json` 記錄連結修正與原站已過期的錨點；`asset-report.json` 及 `sync-report.json` 記錄未能取得的原站素材。

`asset-recovery-report.json` 記錄失效圖片的修復來源：SigNoz 與 TruLens 使用已確認的官方新位置，其他可取得的原圖保存為本地資產。UpTrain 的 `output.gif` 來源回傳 HTTP 403，未找到可確認為同一動畫的替代來源，因此保留替代文字。

原站已過期且沒有對應段落的錨點會改為連到同一文件頁首；來源中回傳錯誤的圖片保留替代說明。所有其他可取得的圖片從本機載入。搜尋同時包含繁中譯文與英文原文，但閱讀頁面只呈現繁中正文。

原站的 Query Engines FAQ 匯出只有頁面標題、沒有正文；本地保留該頁面並顯示提示，不自行補寫來源不存在的內容。
