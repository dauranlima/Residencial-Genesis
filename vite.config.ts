import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import sendWhatsAppHandler from "./api/send-whatsapp";

// Garantir que a imagem de compartilhamento esteja sempre na pasta public para o Open Graph (WhatsApp/Social)
try {
  const srcImg = path.resolve(__dirname, "src/assets/indexshareimg.png");
  const pubImg = path.resolve(__dirname, "public/indexshareimg.png");
  const pubAssetsDir = path.resolve(__dirname, "public/assets");
  const pubAssetsImg = path.resolve(__dirname, "public/assets/indexshareimg.png");

  if (fs.existsSync(srcImg)) {
    fs.copyFileSync(srcImg, pubImg);
    if (!fs.existsSync(pubAssetsDir)) {
      fs.mkdirSync(pubAssetsDir, { recursive: true });
    }
    fs.copyFileSync(srcImg, pubAssetsImg);
    console.log("[Vite Config] indexshareimg.png copiada para public/ com sucesso.");
  }
} catch (err) {
  console.error("[Vite Config] Erro ao copiar indexshareimg.png:", err);
}

// Plugin personalizado para integrar a API serverless /api/send-whatsapp no ambiente local de desenvolvimento
const localApiMiddleware = () => ({
  name: "local-api-middleware",
  configureServer(server: any) {
    server.middlewares.use("/api/send-whatsapp", async (req: any, res: any) => {
      if (req.method === "POST") {
        let body = "";
        req.on("data", (chunk: any) => {
          body += chunk;
        });
        req.on("end", async () => {
          try {
            req.body = JSON.parse(body || "{}");
            const result = await sendWhatsAppHandler(req, res);
            if (result && !res.writableEnded) {
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(result));
            }
          } catch (err: any) {
            if (!res.writableEnded) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: err?.message || "Erro no servidor local" }));
            }
          }
        });
      } else {
        res.statusCode = 405;
        res.end(JSON.stringify({ error: "Method Not Allowed" }));
      }
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api-evolution": {
        target: process.env.VITE_EVOLUTION_API_URL || "http://main-evolutiongo-0cf43a-187-127-6-57.sslip.io",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-evolution/, ""),
      },
    },
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), localApiMiddleware(), mode === "development"].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
