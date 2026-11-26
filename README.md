# Kevin Chou — AI & Digital Transformation

周靖翔 Kevin Chou 的 AI Automation 與數位轉型顧問網站。保留暖白、灰綠與字體對比，搭配深藍與銅色的經歷面板。前台部署 GitHub Pages，會員與訂單 API 使用 Cloudflare Workers + D1。

標題、內文、標籤與成果數字使用不同字級及字重，以深陶土色 `#91482f` 強調主要動作、數字與選取狀態。財務、製造業 AI 與 ESG 精選案例使用原作業／改善後對比及流程圖；圖解由語意化 HTML 與 CSS 呈現，文字可讀且不依賴外部圖片。首頁的三項案例在桌面並排，手機使用按鈕切換，維持首頁長度。

## 發布狀態

前台為 `https://kevin-1215.github.io/portfolio/`；API 為 `https://kevin-portfolio-api.kevin-design-lab.workers.dev`。Cloudflare Workers + D1 已部署，公開設定只有 API 網址與資源 ID，不含登入憑證。

會員、收藏、個人偏好、登入／登出、訂單隔離、伺服器計價與五項服務洽詢已通過雲端的 23 項整合檢查。驗證使用隨機產生的測試帳密，完成後刪除這兩個測試帳號及其關聯資料。帳號為作品體驗用途，沒有 Email 驗證、密碼重設或 MFA。

主選單連到五個獨立頁面：首頁 `/`、關於我 `/about/`、服務內容 `/services/`、參考案例 `/work/`、聯絡資訊 `/contact/`。首頁只保留定位、經歷摘要與三項精選專案。服務以可切換面板呈現 AI 顧問服務、流程優化、網站建置、SEO 優化與其他系統建置，並可帶入聯絡頁的需求類型。舊版首頁區塊連結會導向對應頁面。

參考案例分為五個企業專案、四個網站與工具展示，以及一份流程規格設計。企業專案涵蓋財務對帳與應付帳款、製造業 AI、ESG 平台、ERP 報表檢核及證券開戶自動化。內容依擁有者提供的履歷整理，逐項描述工作、系統、交付與成果；不公開原始履歷、報價、私人聯絡資料或客戶畫面。Power Automate 採購流程為建置規格，未描述為已上線的客戶系統。

網站與工具包含 Folio、AURA、日常之物與 FORMA。Folio 為已上線的自主工具，其餘為自主概念；商店不販售、不扣款、不出貨。互動與介面預覽收在案例內可展開的區塊。案例標題直接說明內容，網站經歷與服務以 AI Automation、生成式 AI 及 AI OCR 為主軸；以 RPA 為主的既有財務案例保留實際技術範圍。

合作入口使用擁有者確認公開的 `kevin122815@gmail.com`。聯絡頁先顯示服務選單，下方提供選擇與填寫說明；直接進入時不預選服務，從服務頁進入則保留預選。三步為選服務、說明需求、準備寄信，可選「先聊聊需求」並保留未定的預算與時程。完成後先引導開啟 Email 草稿、確認並寄出，完整摘要的複製／下載則收在可展開區塊。已登入會員仍可另存 D1 紀錄，沒有自動寄信或 Email 通知。

## 本機開發

使用 Node.js >= 22.13。一般 Node 環境先執行 `npm ci`，接著：

```text
node scripts/dev-all.mjs --check
```

啟動 `http://127.0.0.1:5173/portfolio/` 前台與 `http://127.0.0.1:8787` Worker API，並套用本機 D1 遷移。`--check` 執行整合檢查，測試資料只寫入本機 D1，與雲端分離。開發模式連線本機 Worker；正式建置與 preview 使用 `config/public.json` 的雲端網址。

```text
npm run check
npm run build
npm run check:static
npm run preview
```

`out/` 為含五個主頁、會員、商店、十個案例和 404 的十八個預先渲染頁面。建置後檢查站內路徑、主標題、重複 ID、獨立頁面導覽、具體案例描述、五項服務與公開 API 設定；GitHub Actions 也執行相同檢查。`npm run preview` 可檢查與公開網站一致的功能狀態。

## GitHub Pages

使用儲存庫 `Kevin-1215/portfolio`。Settings → Pages 設定來源為 **GitHub Actions**，推送至 `main` 會執行 `.github/workflows/pages.yml`。是否發布成功以 GitHub Actions 與實際網站為準。

發布前會確認本次上傳的 artifact ID 已出現在 GitHub API，最多等待十二次再部署，避免檔案剛上傳時的 metadata 延遲；無法確認時會停止發布並保留既有網站。

建置與發布使用獨立工作，檔名包含 run ID 與建置的 attempt。重試發布會沿用已通過檢查的建置檔，完整重跑也會產生不同檔名，避免同名 artifact 衝突。

前台完整支援 `/portfolio/` 子路徑。更新網域或儲存庫名稱時，調整 `config/public.json` 的 `basePath` 與預先渲染的 canonical URL。

## Cloudflare

詳見 [DEPLOYMENT.md](./DEPLOYMENT.md)。Workers 與 D1 設定在 `cloudflare/`；前台只保存公開 API 網址，沒有 Cloudflare Token、D1 直接存取憑證或會員密碼。

[ARCHITECTURE.md](./ARCHITECTURE.md) 說明資料、登入與安全邊界。[QUALITY.md](./QUALITY.md) 記錄設計與 Awwwards 方向。

## 素材與編輯位置

建築攝影存於 `public/images`，來源為 Unsplash：

- https://images.unsplash.com/photo-1600210492486-724fe5c67fb0
- https://images.unsplash.com/photo-1600607687939-ce8a6c25118c

陶器與會員視覺由 SVG／CSS 繪製。首頁在 `components/portfolio.tsx`，四個主頁在 `components/marketing-pages.tsx`，企業案例在 `components/consulting-case.tsx`，系統案例在 `components/case-study.tsx`。案例資料在 `lib/consulting.ts` 與 `lib/cases.ts`，導覽與圖像在 `components/site.tsx`，商品資料在 `lib/catalog.ts`。多頁版樣式在 `app/multipage.css`，既有互動展示樣式保留在其餘 CSS。
