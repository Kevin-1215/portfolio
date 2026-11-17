import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import config from "./config/public.json";
export default defineConfig(({command})=>({
  base:config.basePath,
  plugins:[react()],
  resolve:{alias:{"@":fileURLToPath(new URL(".",import.meta.url))}},
  define:{"import.meta.env.VITE_API_URL":JSON.stringify(command === "serve" ? "" : config.apiUrl)},
  build:{outDir:"out",emptyOutDir:true},
  server:{host:"127.0.0.1",port:5173},
}));
