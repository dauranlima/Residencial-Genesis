import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

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

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api-evolution": {
        target: "https://evogo.dldigitalsolutions.cloud",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-evolution/, ""),
      },
    },
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development"].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
