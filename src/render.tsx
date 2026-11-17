import { renderToString } from "react-dom/server";
import App from "./app";
import { cases } from "../lib/cases";
export function render(path:string){return renderToString(<App path={path}/>);}
export const routes = [
  { path: "", title: "Kevin — Independent Design & Development", description: "Kevin，獨立設計與網站開發。探索已上線的 Folio 互動名片工具，以及品牌、電商與會員系統的設計思考與實作。" },
  { path: "members", title: "FORMA 會員體驗 · Kevin", description: "會員中心介面預覽。雲端會員與訂單服務尚未啟用。" },
  { path: "shop", title: "日常之物 · 概念商店 · Kevin", description: "陶器選物概念商店，可操作商品分類與購物袋；展示商品不扣款、不出貨。" },
  ...cases.map(project => ({ path: `work/${project.id}`, title: `${project.name} · ${project.type}案例 · Kevin`, description: project.intro })),
  { path: "404", title: "找不到頁面 · Kevin", description: "回到 Kevin 的設計與網站開發作品集。" },
];
