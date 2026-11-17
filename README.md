# Kevin — Independent Design & Development

低彩度接案作品集，以品牌／生活風格客戶為方向。前台部署 GitHub Pages，會員與訂單 API 使用 Cloudflare Workers + D1。

## 發布狀態

Cloudflare 登入授權依擁有者要求延後。`config/public.json` 的 `apiUrl` 暫為空字串，公開版不會連線到 localhost，也不會收集會員帳密。會員與雲端訂單顯示準備中，形象網站、作品篩選、服務介紹、商品分類與本機購物車可操作。

會員、收藏、個人偏好、登入／登出、訂單隔離與伺服器計價的程式均已完成，通過本機 D1 的 17 項整合檢查。正式會員服務需完成 Cloudflare 授權、部署及正式環境驗證後才開放。

三個作品 AURA、日常之物、FORMA 皆為自主概念，不代表商業委託或既有業績。商店不販售、不扣款、不出貨。合作表單在雲端服務啟用前提供需求摘要下載；啟用後儲存洽詢，尚未寄 Email。

## 本機開發

使用 Node.js >= 22.13。一般 Node 環境先執行 `npm ci`，接著：

```text
node scripts/dev-all.mjs --check
```

啟動 `http://127.0.0.1:5173/portfolio/` 前台與 `http://127.0.0.1:8787` Worker API，並套用本機 D1 遷移。`--check` 執行 17 項整合檢查，測試資料只寫入本機 D1，與雲端分離。

```text
npm run check
npm run build
npm run preview
```

`out/` 為含首頁、會員、商店、品牌案例和 404 的預先渲染靜態網站。`npm run preview` 可檢查與 GitHub Pages 一致的功能準備中狀態。

## GitHub Pages

使用新儲存庫 `Kevin-1215/portfolio`，預定網站位址為 `https://kevin-1215.github.io/portfolio/`。Settings → Pages 設定來源為 **GitHub Actions**，推送至 `main` 會執行 `.github/workflows/pages.yml`。是否發布成功以 GitHub Actions 與實際網站為準。

前台完整支援 `/portfolio/` 子路徑。更新網域或儲存庫名稱時，調整 `config/public.json` 的 `basePath` 與預先渲染的 canonical URL。

## 稍後接上 Cloudflare

詳見 [DEPLOYMENT.md](./DEPLOYMENT.md)。Workers 與 D1 設定在 `cloudflare/`；前台只保存公開 API 網址，沒有 Cloudflare Token、D1 直接存取憑證或會員密碼。

[ARCHITECTURE.md](./ARCHITECTURE.md) 說明資料、登入與安全邊界。[QUALITY.md](./QUALITY.md) 記錄設計與 Awwwards 方向。

## 素材與編輯位置

建築攝影存於 `public/images`，來源為 Unsplash：

- https://images.unsplash.com/photo-1600210492486-724fe5c67fb0
- https://images.unsplash.com/photo-1600607687939-ce8a6c25118c

陶器與會員視覺由 SVG／CSS 繪製。首頁文字在 `components/portfolio.tsx`；導覽、作品資料與圖像在 `components/site.tsx`；商品資料在 `lib/catalog.ts`；樣式在 `app/globals.css`。
