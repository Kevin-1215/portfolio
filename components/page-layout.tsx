import { sitePath } from "./site";

export function PageIntro({ label, title, description }: { label: string; title: string; description: string }) {
  return <header className="page-intro"><p className="page-kicker">{label}</p><h1>{title}</h1><p>{description}</p></header>;
}

export function ContactAction({ service, title = "討論你的需求" }: { service?: string; title?: string }) {
  return <a className="button-primary" href={sitePath(service ? `/contact/?service=${encodeURIComponent(service)}` : "/contact/")}>{title}</a>;
}
