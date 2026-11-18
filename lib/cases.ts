import { consultingCases } from "./consulting";
export type CaseId = "finance-operations" | "smart-operations" | "esg-platform" | "purchase-workflow" | "folio" | "aura" | "objects" | "forma";
export type CaseStudyData = {
  id: CaseId; group?: "consulting"; index: string; name: string; subtitle: string; type: string; status: string;
  english: string; intro: string; tags: string[]; role: string; scope: string;
  question: string; context: string; decisions: { title: string; text: string }[];
  flow: { title: string; note: string }[]; checks: string[]; boundary: string;
  demo?: string; demoLabel?: string; external?: boolean; stack: string;
};
export function caseTitle(project: CaseStudyData) {
  return project.group === "consulting" ? project.name : `${project.type}展示｜${project.name}`;
}
export const cases: CaseStudyData[] = [
  ...consultingCases,
  {
    id: "folio", index: "01", name: "Folio", subtitle: "把品牌，交到自己手上。", type: "互動工具", status: "自主開發 · 已上線",
    english: "A small card. A considered tool.", intro: "從編輯資料、調整版式，到預覽與匯出。一個將名片設計整理成清楚操作流程的瀏覽器工具。",
    tags: ["INTERACTIVE TOOL", "SVG / CANVAS", "FRONT-END DEVELOPMENT"], role: "介面設計 / 前端開發 / 匯出流程", scope: "雙面名片編輯、即時預覽、設計備份與檔案匯出",
    question: "把細節交給工具，\n把選擇留給使用者。", context: "一張名片包含品牌、個人資料、色彩與版式。Folio 的出發點，是把這些彼此影響的設定放在同一個清楚的工作空間，讓每個調整都能立即看見結果。這是已公開上線的自主開發作品。",
    decisions: [
      { title: "把編輯與預覽放在同一個對話裡。", text: "編輯區以「品牌與資料」「版式與色彩」分組，旁邊保留正反面預覽。資料變動直接反映到 SVG 卡面，不需要在設定頁與成果頁之間切換。" },
      { title: "少填一項，版面仍然成立。", text: "空白聯絡欄位不輸出；移除 Logo 後，品牌文字會補位。工具同時處理直式與橫式版面，讓使用者選擇內容時，也能維持可讀的資訊順序。" },
      { title: "讓一份設計，能被帶走與繼續。", text: "同一份 SVG 描述用於即時預覽與向量匯出；PNG 透過 Canvas 依尺寸換算至 300 dpi，PDF 使用瀏覽器列印。另提供 JSON 設計檔下載與載入，方便之後繼續編輯。" },
    ],
    flow: [{ title: "填入內容", note: "品牌、姓名與聯絡資料" }, { title: "即時排版", note: "同一份狀態同步正反面" }, { title: "調整細節", note: "色彩、方向與 Logo 位置" }, { title: "帶走成果", note: "SVG / PNG / PDF / JSON" }],
    checks: ["已核對公開網站的編輯、版式與匯出介面，以及對應原始碼。", "空白欄位、移除 Logo 與文字長度都有對應的版面處理。", "資料與上傳圖片保存在瀏覽器，不需要建立帳號或上傳到伺服器。"],
    boundary: "這是自主開發工具，尚未加入團隊協作與雲端同步。圖像輸出使用 RGB，正式印刷的出血與色彩規格仍須另行確認。沒有以未量測的使用量或轉換率作為成果。",
    demo: "https://kevin-1215.github.io/card-studio/", demoLabel: "開啟完整 Folio 工具", external: true, stack: "原生 JavaScript / SVG / Canvas / localStorage / GitHub Pages",
  },
  {
    id: "aura", index: "02", name: "AURA", subtitle: "為空間，留下感受。", type: "品牌形象", status: "自主概念",
    english: "Room to feel.", intro: "以空間的光線、材質與留白，探索一個室內設計品牌的數位表達。",
    tags: ["ART DIRECTION", "WEB DESIGN", "RESPONSIVE DEVELOPMENT"], role: "視覺方向 / 資訊架構 / 響應式開發", scope: "品牌敘事、攝影呈現、作品導覽與聯絡入口",
    question: "讓作品先說話，\n讓感受慢慢發生。", context: "對空間品牌而言，網站也是品味的第一個接觸點。AURA 從「走進一個舒服空間」的感受出發，用照片、標題與留白安排閱讀的節奏。品牌為自主概念，沒有實際委託或客戶研究成果。",
    decisions: [
      { title: "讓照片有自己的位置。", text: "以暖白底色、細線與少量文字建立層次，讓攝影承載主要視覺。標題負責傳遞品牌語氣，作品入口則提供清楚的下一步。" },
      { title: "依螢幕重新安排觀看方式。", text: "桌面以橫向構圖帶出空間；手機調整圖片比例與文字排列，維持畫面重點與閱讀順序。段落留白隨畫面寬度調整。" },
      { title: "細節回應使用者的節奏。", text: "作品卡片以克制的過渡回應滑鼠，段落隨閱讀進入畫面；減少動態偏好會停用這些效果。主要導覽與內容仍以原生連結與語意化結構呈現。" },
    ],
    flow: [{ title: "第一眼", note: "建立品牌語氣" }, { title: "看作品", note: "影像與標題形成節奏" }, { title: "理解想法", note: "閱讀設計選擇與細節" }, { title: "開始合作", note: "抵達清楚的聯絡入口" }],
    checks: ["已檢查桌面與手機構圖，圖片具有替代文字與預留尺寸。", "導覽、案例入口與跳至內容連結可使用鍵盤操作。", "支援 prefers-reduced-motion，保留內容可讀性。"],
    boundary: "目前展示的是品牌與版面概念。未虛構客戶名單、改版前後成效或商業數據；下一階段可加入實際品牌素材、完整專案攝影與實測效能紀錄。",
    demoLabel: "探索品牌頁面展示", demo: "#brand-preview", stack: "React / TypeScript / CSS / 語意化 HTML / GitHub Pages",
  },
  {
    id: "objects", index: "03", name: "日常之物", subtitle: "讓喜歡，成為日常。", type: "電子商務", status: "自主概念 · 雲端模擬訂單",
    english: "Objects, with intention.", intro: "從瀏覽商品、選擇數量到確認金額，讓器物的質感延伸到每一步操作。",
    tags: ["E-COMMERCE", "UX / UI", "ORDER ARCHITECTURE"], role: "購買流程設計 / 前端開發 / 訂單 API 架構", scope: "商品分類、購物袋、運費試算、模擬訂單與會員紀錄",
    question: "一件喜歡的物品，\n一段清楚的購買過程。", context: "日常之物以陶器選物為概念，將商品資訊與購買操作整理成簡單的路徑。公開版本可操作商品分類與購物袋，登入後可建立雲端模擬訂單，並回到會員中心查看紀錄。",
    decisions: [
      { title: "每一步，都讓金額說清楚。", text: "購物袋同時顯示單價、數量、商品小計、運費與合計。滿 NT$3,000 免運，其餘運費 NT$120，數量調整時立即更新。" },
      { title: "先讓日常操作穩定，再整理交易邊界。", text: "購物袋保存在目前瀏覽器，重新整理後仍可繼續選物。對話框支援 Escape、鍵盤焦點圈限與關閉後回到原入口，手機也能完整操作。" },
      { title: "把訂單正確性放在伺服器。", text: "Workers 從商品目錄重新計價，驗證數量與商品 ID；相同會員重試同一個訂單識別碼時，會取得原訂單。訂單儲存在 D1，已在部署環境驗證價格重算與重試去重。" },
    ],
    flow: [{ title: "探索商品", note: "依陶作、花器與日用分類" }, { title: "放入購物袋", note: "調整數量與保留選物" }, { title: "核對金額", note: "即時計算小計與運費" }, { title: "模擬訂單", note: "登入後建立 D1 示範紀錄" }],
    checks: ["購物袋已驗證數量調整、運費門檻與重新整理後保留。", "雲端 API 的 23 項整合檢查通過，涵蓋價格重算、重試去重與跨帳號隔離。", "頁面清楚標示概念商品、無實際扣款及出貨。"],
    boundary: "商品為自主概念，不販售、不扣款、不出貨。雲端模擬訂單已啟用；真實付款、庫存扣除、物流與退貨流程尚未串接。",
    demo: "/shop/", demoLabel: "體驗商品與購物袋", stack: "React / TypeScript / localStorage / Cloudflare Workers + D1",
  },
  {
    id: "forma", index: "04", name: "FORMA", subtitle: "一個屬於創作者的地方。", type: "會員系統", status: "自主概念 · 雲端會員已啟用",
    english: "A space of your own.", intro: "把登入、偏好、收藏與訂單放進一個清楚的個人空間，並從資料存取的邊界思考會員體驗。",
    tags: ["MEMBERSHIP", "PRODUCT DESIGN", "ACCESS CONTROL"], role: "會員體驗設計 / 帳號與權限架構 / API 開發", scope: "註冊與登入、個人設定、作品收藏、模擬訂單紀錄",
    question: "熟悉的介面背後，\n是清楚的資料邊界。", context: "FORMA 以創作者會員中心為自主概念，整理回訪時常見的四個任務：看總覽、找收藏、查訂單、調整偏好。可註冊體驗帳號，將個人設定、作品收藏與模擬訂單儲存在雲端。",
    decisions: [
      { title: "讓會員知道自己在哪裡。", text: "以固定的會員導覽切換四項主要任務，保留姓名與身分資訊。空白收藏與訂單狀態也提供下一步入口，避免沒有資料時出現無從操作的頁面。" },
      { title: "讓跨站架構仍可正常登入。", text: "前台託管於 GitHub Pages，後端由 Workers 提供 API。限時登入憑證透過 Authorization 標頭傳遞，讓架構不依賴第三方 Cookie。" },
      { title: "把資料所屬權留在伺服器判斷。", text: "API 依有效登入狀態決定資料所屬會員，每次讀寫都核對權限。資料庫保存密碼與登入憑證的雜湊；登出使該次登入失效，其他登入可繼續使用。" },
    ],
    flow: [{ title: "建立帳號", note: "驗證輸入與密碼雜湊" }, { title: "取得登入狀態", note: "最長 12 小時的限時憑證" }, { title: "讀寫個人資料", note: "伺服器核對所屬會員" }, { title: "安全結束", note: "登出使當次登入失效" }],
    checks: ["雲端整合檢查涵蓋註冊、錯誤密碼、登入、偏好與收藏持續儲存。", "使用兩個隨機測試帳號，驗證收藏與訂單互相隔離，驗證後清除測試資料。", "已驗證公開網站的 CORS 預檢、登出失效與其他登入狀態各自獨立。"],
    boundary: "目前為作品體驗帳號。Email 驗證、密碼重設與 MFA 尚未提供，請使用專用密碼；正式營運前仍需補齊通知與資料管理流程。",
    demo: "/members/", demoLabel: "體驗會員中心", stack: "React / TypeScript / Workers / D1 / 限時 Bearer Session",
  },
];
