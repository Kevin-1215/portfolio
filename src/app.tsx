import Portfolio from "../components/portfolio";
import Members from "../components/members";
import Shop from "../components/shop";
import CaseStudy from "../components/case-study";
import { cases } from "../lib/cases";
import { Header,Footer } from "../components/site";
import { basePath,sitePath } from "../lib/client";
export default function App({ path }: { path:string }) {
  const route=(path.startsWith(basePath)?path.slice(basePath.length):path).replace(/^\/+|\/+$/g,"");
  const project=cases.find(project=>route===`work/${project.id}`);
  const view=route===""?<Portfolio/>:route==="members"?<Members/>:route==="shop"?<Shop/>:project?<CaseStudy id={project.id}/>:<><Header inner/><main id="main" className="inner-heading inner-main"><p className="eyebrow">404 / A LITTLE DETOUR</p><h1>這一頁，還在想像裡。</h1><a href={sitePath("/")} className="text-link">回到首頁 ↗</a></main><Footer/></>;
  return <><a className="skip-link" href="#main">跳至主要內容</a>{view}</>;
}
