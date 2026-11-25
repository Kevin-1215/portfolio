import { consultingCases } from "./consulting";
export type CaseId = "finance-operations" | "smart-operations" | "esg-platform" | "erp-validation" | "account-opening" | "purchase-workflow" | "folio" | "aura" | "objects" | "forma";
export type CaseStudyData = {
  id: CaseId; group?: "consulting"; index: string; name: string; subtitle: string; type: string; status: string;
  english: string; intro: string; tags: string[]; role: string; scope: string;
  question: string; context: string; decisions: { title: string; text: string }[];
  flow: { title: string; note: string }[]; checks: string[]; boundary: string;
  demo?: string; demoLabel?: string; external?: boolean; stack: string;
  industry?: string; kind?: "specification"; deliverables?: string[];
  results?: { value?: string; title: string; description: string }[];
  parameters?: { label: string; value: string; note: string }[];
};
export function caseTitle(project: CaseStudyData) {
  return project.group === "consulting" ? project.name : `${project.type}展示｜${project.name}`;
}
export const cases: CaseStudyData[] = [
  ...consultingCases,
  {
    id: "folio", index: "01", name: "Folio", subtitle: "線上編輯雙面名片並匯出檔案", type: "互動工具", status: "線上名片編輯與匯出工具",
    english: "Online business card editor", intro: "可編輯品牌與聯絡資料、切換橫式或直式版面、預覽名片正反面，並匯出 SVG、PNG、列印 PDF 及保存 JSON 設計檔。",
    tags: ["INTERACTIVE TOOL", "SVG / CANVAS", "FRONT-END DEVELOPMENT"], role: "介面設計 / 前端開發 / 匯出流程", scope: "雙面名片編輯、即時預覽、設計備份與檔案匯出",
    question: "名片工具包含哪些功能？", context: "Folio 是已公開上線的瀏覽器工具。使用者可輸入品牌、姓名與聯絡資訊，上傳 Logo、調整色彩和版式，立即預覽正反面，並下載圖檔或設計備份；資料保存在瀏覽器，不需建立帳號。",
    decisions: [
      { title: "即時編輯與雙面預覽", text: "資料、版式與色彩設定直接更新 SVG 卡面，同時顯示正反面預覽。" },
      { title: "空白資料與版型處理", text: "空白聯絡欄位不輸出，移除 Logo 時改用品牌文字，並支援橫式與直式版面。" },
      { title: "圖檔匯出與設計備份", text: "提供 SVG、Canvas 轉換的 PNG、瀏覽器列印 PDF，以及可下載和重新載入的 JSON 設計檔。" },
    ],
    flow: [{ title: "填入內容", note: "品牌、姓名與聯絡資料" }, { title: "即時排版", note: "同一份狀態同步正反面" }, { title: "調整細節", note: "色彩、方向與 Logo 位置" }, { title: "帶走成果", note: "SVG / PNG / PDF / JSON" }],
    checks: ["已核對公開網站的編輯、版式與匯出介面，以及對應原始碼。", "空白欄位、移除 Logo 與文字長度都有對應的版面處理。", "資料與上傳圖片保存在瀏覽器，不需要建立帳號或上傳到伺服器。"],
    boundary: "工具使用瀏覽器儲存設計，尚未提供團隊協作與雲端同步。圖像輸出使用 RGB，正式印刷的出血與色彩規格須另行確認。",
    demo: "https://kevin-1215.github.io/card-studio/", demoLabel: "開啟名片設計工具", external: true, stack: "原生 JavaScript / SVG / Canvas / localStorage / GitHub Pages",
  },
  {
    id: "aura", index: "02", name: "AURA", subtitle: "品牌介紹、作品攝影與合作入口", type: "品牌形象", status: "品牌形象網站介面設計展示",
    english: "Brand website interface", intro: "室內設計品牌的網站介面展示，包含品牌介紹、作品影像、響應式排版與合作聯絡入口。",
    tags: ["ART DIRECTION", "WEB DESIGN", "RESPONSIVE DEVELOPMENT"], role: "視覺方向 / 資訊架構 / 響應式開發", scope: "品牌敘事、攝影呈現、作品導覽與聯絡入口",
    question: "品牌網站展示哪些內容？", context: "AURA 為室內設計品牌的介面概念，示範品牌介紹、攝影呈現、作品導覽與聯絡入口的安排。桌面與手機採用不同構圖，保留清楚的閱讀與操作順序。",
    decisions: [
      { title: "品牌內容與作品影像排版", text: "整理品牌標題、介紹文字、作品照片與合作入口的位置，建立資訊主次。" },
      { title: "桌面與手機響應式版面", text: "依螢幕調整圖片比例、文字排列及段落間距，保留內容重點與閱讀順序。" },
      { title: "鍵盤操作與減少動態支援", text: "導覽與連結使用語意化結構及可見焦點，並支援減少動態偏好。" },
    ],
    flow: [{ title: "第一眼", note: "建立品牌語氣" }, { title: "看作品", note: "影像與標題形成節奏" }, { title: "理解想法", note: "閱讀設計選擇與細節" }, { title: "開始合作", note: "抵達清楚的聯絡入口" }],
    checks: ["已檢查桌面與手機構圖，圖片具有替代文字與預留尺寸。", "導覽、案例入口與跳至內容連結可使用鍵盤操作。", "支援 prefers-reduced-motion，保留內容可讀性。"],
    boundary: "目前提供品牌形象網站的介面展示，包含響應式版面、作品影像與聯絡入口；正式專案可依品牌素材與內容管理需求擴充。",
    demoLabel: "探索品牌頁面展示", demo: "#brand-preview", stack: "React / TypeScript / CSS / 語意化 HTML / GitHub Pages",
  },
  {
    id: "objects", index: "03", name: "日常之物", subtitle: "商品分類、購物袋與雲端模擬訂單", type: "電子商務", status: "商品、購物袋與模擬訂單系統",
    english: "Product catalog and demo checkout", intro: "可瀏覽商品分類、加入購物袋、調整數量、試算運費，並在登入後建立雲端模擬訂單及查看紀錄；不會扣款或出貨。",
    tags: ["E-COMMERCE", "UX / UI", "ORDER ARCHITECTURE"], role: "購買流程設計 / 前端開發 / 訂單 API 架構", scope: "商品分類、購物袋、運費試算、模擬訂單與會員紀錄",
    question: "一件喜歡的物品，\n一段清楚的購買過程。", context: "日常之物以陶器選物為概念，將商品資訊與購買操作整理成簡單的路徑。公開版本可操作商品分類與購物袋，登入後可建立雲端模擬訂單，並回到會員中心查看紀錄。",
    decisions: [
      { title: "購物袋金額與運費計算", text: "購物袋同時顯示單價、數量、商品小計、運費與合計。滿 NT$3,000 免運，其餘運費 NT$120，數量調整時立即更新。" },
      { title: "購物袋保存與鍵盤操作", text: "購物袋保存在目前瀏覽器，重新整理後仍可繼續選物。對話框支援 Escape、鍵盤焦點圈限與關閉後回到原入口，手機也能完整操作。" },
      { title: "伺服器計價與訂單重試處理", text: "Workers 從商品目錄重新計價，驗證數量與商品 ID；相同會員重試同一個訂單識別碼時，會取得原訂單。訂單儲存在 D1，已在部署環境驗證價格重算與重試去重。" },
    ],
    flow: [{ title: "探索商品", note: "依陶作、花器與日用分類" }, { title: "放入購物袋", note: "調整數量與保留選物" }, { title: "核對金額", note: "即時計算小計與運費" }, { title: "模擬訂單", note: "登入後建立 D1 示範紀錄" }],
    checks: ["購物袋已驗證數量調整、運費門檻與重新整理後保留。", "雲端 API 的 23 項整合檢查通過，涵蓋價格重算、重試去重與跨帳號隔離。", "頁面清楚標示概念商品、無實際扣款及出貨。"],
    boundary: "商品為自主概念，不販售、不扣款、不出貨。雲端模擬訂單已啟用；真實付款、庫存扣除、物流與退貨流程尚未串接。",
    demo: "/shop/", demoLabel: "體驗商品與購物袋", stack: "React / TypeScript / localStorage / Cloudflare Workers + D1",
  },
  {
    id: "forma", index: "04", name: "FORMA", subtitle: "帳號登入、資料設定、收藏與訂單紀錄", type: "會員系統", status: "會員帳號與個人資料管理功能",
    english: "Member account and personal dashboard", intro: "可建立帳號、登入登出、修改個人偏好、收藏作品與查看模擬訂單，後端會依登入身分讀寫個別會員的資料。",
    tags: ["MEMBERSHIP", "PRODUCT DESIGN", "ACCESS CONTROL"], role: "會員體驗設計 / 帳號與權限架構 / API 開發", scope: "註冊與登入、個人設定、作品收藏、模擬訂單紀錄",
    question: "熟悉的介面背後，\n是清楚的資料邊界。", context: "FORMA 以創作者會員中心為自主概念，整理回訪時常見的四個任務：看總覽、找收藏、查訂單、調整偏好。可註冊體驗帳號，將個人設定、作品收藏與模擬訂單儲存在雲端。",
    decisions: [
      { title: "會員總覽與空白狀態導引", text: "以固定的會員導覽切換四項主要任務，保留姓名與身分資訊。空白收藏與訂單狀態也提供下一步入口，避免沒有資料時出現無從操作的頁面。" },
      { title: "跨站登入與限時憑證", text: "前台託管於 GitHub Pages，後端由 Workers 提供 API。限時登入憑證透過 Authorization 標頭傳遞，讓架構不依賴第三方 Cookie。" },
      { title: "會員資料隔離與登出失效", text: "API 依有效登入狀態決定資料所屬會員，每次讀寫都核對權限。資料庫保存密碼與登入憑證的雜湊；登出使該次登入失效，其他登入可繼續使用。" },
    ],
    flow: [{ title: "建立帳號", note: "驗證輸入與密碼雜湊" }, { title: "取得登入狀態", note: "最長 12 小時的限時憑證" }, { title: "讀寫個人資料", note: "伺服器核對所屬會員" }, { title: "安全結束", note: "登出使當次登入失效" }],
    checks: ["雲端整合檢查涵蓋註冊、錯誤密碼、登入、偏好與收藏持續儲存。", "使用兩個隨機測試帳號，驗證收藏與訂單互相隔離，驗證後清除測試資料。", "已驗證公開網站的 CORS 預檢、登出失效與其他登入狀態各自獨立。"],
    boundary: "目前為作品體驗帳號。Email 驗證、密碼重設與 MFA 尚未提供，請使用專用密碼；正式營運前仍需補齊通知與資料管理流程。",
    demo: "/members/", demoLabel: "體驗會員中心", stack: "React / TypeScript / Workers / D1 / 限時 Bearer Session",
  },
];
