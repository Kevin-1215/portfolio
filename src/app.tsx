import { useEffect } from "react";
import Portfolio from "../components/portfolio";
import MarketingPage, { type MarketingPageId } from "../components/marketing-pages";
import ConsultingCase from "../components/consulting-case";
import Members from "../components/members";
import Shop from "../components/shop";
import CaseStudy from "../components/case-study";
import { cases } from "../lib/cases";
import { Header, Footer } from "../components/site";
import { basePath, sitePath } from "../lib/client";

export default function App({ path }: { path: string }) {
  const route = (path.startsWith(basePath) ? path.slice(basePath.length) : path).replace(/^\/+|\/+$/g, "");
  useEffect(() => {
    if (route) return;
    const destinations: Record<string, string> = { "#about": "/about/", "#services": "/services/", "#work": "/work/", "#contact": "/contact/", "#craft": "/work/folio/" };
    const oldSystems = new URLSearchParams(location.search).get("work") === "systems";
    const target = oldSystems && (!location.hash || location.hash === "#work") ? "/work/?group=systems" : destinations[location.hash];
    if (target) location.replace(sitePath(target));
  }, [route]);
  const project = cases.find(item => route === `work/${item.id}`);
  const marketing = ["about", "services", "work", "contact"].includes(route);
  const view = route === "" ? <Portfolio /> : marketing ? <MarketingPage page={route as MarketingPageId} /> : route === "members" ? <Members /> : route === "shop" ? <Shop /> : project ? project.group === "consulting" ? <ConsultingCase project={project} /> : <CaseStudy id={project.id} /> : <><Header active="none" /><main id="main" className="marketing-main"><header className="page-intro"><p className="page-kicker">404</p><h1>找不到頁面</h1><p>請從主選單選擇頁面，或回到首頁。</p><a className="button-primary" href={sitePath("/")}>回到首頁</a></header></main><Footer /></>;
  return <><a className="skip-link" href="#main">跳至主要內容</a>{view}</>;
}
