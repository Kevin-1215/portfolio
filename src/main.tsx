import React from "react";
import { createRoot,hydrateRoot } from "react-dom/client";
import App from "./app";
import "../app/globals.css";
const root=document.getElementById("root")!;
const app=<React.StrictMode><App path={location.pathname}/></React.StrictMode>;
if(root.querySelector("main"))hydrateRoot(root,app);else createRoot(root).render(app);
