# Kevin Chou — AI & Digital Transformation

周靖翔 Kevin Chou 的 AI 與數位轉型顧問網站。保留暖白、灰綠與字體對比，加入深藍與銅色的流程視覺。前台部署 GitHub Pages，會員與訂單 API 使用 Cloudflare Workers + D1。

## 發布狀態

前台為 `https://kevin-1215.github.io/portfolio/`；API 為 `https://kevin-portfolio-api.kevin-design-lab.workers.dev`。Cloudflare Workers + D1 已部署，公開設定只有 API 網址與資源 ID，不含登入憑證。

會員、收藏、個人偏好、登入／登出、訂單隔離、伺服器計價與五項服務洽詢已通過雲端的 23 項整合檢查。驗證使用隨機產生的測試帳密，完成後刪除這兩個測試帳號及其關聯資料。帳號為作品體驗用途，沒有 Email 驗證、密碼重設或 MFA。

首頁依序為首頁、關於我、服務內容、參考案例及聯絡資訊。服務包含 AI 顧問服務、流程優化、網站建置、SEO 優化與其他系統建置；五項服務的交付內容與洽詢選項保持一致。

參考案例預設呈現三個過往專案匿名摘要與一份 Power Automate 架構規格示例，內容依擁有者提供的履歷與規格文件整理，不公開原始履歷、報價、私人聯絡資料或客戶畫面。「網站與系統展示」分類保留 Folio、AURA、日常之物與 FORMA。Folio 為已上線的自主工具，其餘為自主概念；商店不販售、不扣款、不出貨。互動名片保留於 Folio 案例內頁。

合作入口使用擁有者確認公開的 `kevinchou@innodanc.com`。服務入口可預選需求類型，三步引導可免登入整理、複製或下載摘要，並開啟 Email 草稿；沒有自動寄送訊息。已登入會員可另行選擇儲存至 D1 洽詢紀錄，目前尚未啟用 Email 通知。

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

`out/` 為含首頁、會員、商店、八個案例和 404 的十二個預先渲染頁面。建置後檢查站內路徑、主標題、重複 ID、區塊順序、五項服務與公開 API 設定；GitHub Actions 也執行相同檢查。`npm run preview` 可檢查與公開網站一致的功能狀態。

## GitHub Pages

使用儲存庫 `Kevin-1215/portfolio`。Settings → Pages 設定來源為 **GitHub Actions**，推送至 `main` 會執行 `.github/workflows/pages.yml`。是否發布成功以 GitHub Actions 與實際網站為準。

前台完整支援 `/portfolio/` 子路徑。更新網域或儲存庫名稱時，調整 `config/public.json` 的 `basePath` 與預先渲染的 canonical URL。

## Cloudflare

詳見 [DEPLOYMENT.md](./DEPLOYMENT.md)。Workers 與 D1 設定在 `cloudflare/`；前台只保存公開 API 網址，沒有 Cloudflare Token、D1 直接存取憑證或會員密碼。

[ARCHITECTURE.md](./ARCHITECTURE.md) 說明資料、登入與安全邊界。[QUALITY.md](./QUALITY.md) 記錄設計與 Awwwards 方向。

## 素材與編輯位置

建築攝影存於 `public/images`，來源為 Unsplash：

- https://images.unsplash.com/photo-1600210492486-724fe5c67fb0
- https://images.unsplash.com/photo-1600607687939-ce8a6c25118c

陶器與會員視覺由 SVG／CSS 繪製。首頁文字在 `components/portfolio.tsx`；導覽、作品資料與圖像在 `components/site.tsx`；商品資料在 `lib/catalog.ts`；樣式在 `app/globals.css`。
