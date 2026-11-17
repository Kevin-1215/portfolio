# Cloudflare 部署與維護

此文件不包含憑證。正式部署前檢查 Cloudflare 帳號，勿將 API Token、會員密碼或 session 憑證加入儲存庫。

目前 Worker 為 `kevin-portfolio-api.kevin-design-lab.workers.dev`，D1 為獨立的 `kevin-portfolio`，資料表遷移已套用。R2 未啟用。

## 1. 官方登入（授權失效時）

```text
npx wrangler login --scopes account:read user:read workers_scripts:write d1:write
npx wrangler whoami
```

由擁有者在瀏覽器登入並確認官方權限。先前逾時的 OAuth URL 不能重用，請重新啟動登入流程。

## 2. 更新既有服務

```text
node scripts/deploy-cloudflare.mjs
```

此腳本核對帳號、既有 database_id 與名稱，套用尚未執行的遷移，部署 Worker，最後更新公開 API 網址。不需重新建立 D1。新增其他專案時使用獨立設定與名稱，不覆蓋現有資料。

```text
npx wrangler d1 migrations apply DB --config cloudflare/wrangler.jsonc --remote
npx wrangler deploy --config cloudflare/wrangler.jsonc
```

## 3. 連接前台

`config/public.json` 的 `apiUrl` 使用正式 HTTPS Worker 網址，保留 `basePath: "/portfolio/"`。Workers 的 ALLOWED_ORIGINS 必須包含 `https://kevin-1215.github.io`。

```text
npm run check
npm run build
npm run check:static
```

在 GitHub 推送這次設定，Actions 會重新發布前台。資料庫 ID 及公開 Worker 網址不是密鑰；登入憑證仍只在本機官方工具管理。

## 4. 正式驗證

```text
node scripts/check-hybrid-api.mjs --remote
```

僅允許已設定的作品集 API。21 項檢查會建立兩個隨機測試帳號，最後經官方 Wrangler 移除這兩個帳號及其關聯資料。不得改成刪除其他會員的廣泛條件。

- `/api/health` 回傳 Cloudflare D1，並確認 payments disabled。
- 確認 HTTPS 網站 CORS 預檢、會員註冊／登入、偏好儲存、收藏、模擬結帳及登出。
- 確認跨帳號無法讀取其他人的資料、價格由伺服器計算、重試不重複新增。
- 補上正式聯絡方式、公開服務隱私政策、資料保留／刪除流程、密碼重設及通知功能，再對外承接真實會員資料與交易。

R2 目前不需開通。未來需要上傳圖片／附件，再另外加入私有桶、檔案大小與類型限制，以及授權存取方式。
