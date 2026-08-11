import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Registro do Service Worker da PWA (viziGO)
if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        console.log("[PWA] Service Worker registrado com sucesso no escopo:", reg.scope);
      })
      .catch((err) => {
        console.warn("[PWA] Falha ao registrar Service Worker:", err);
      });
  });
} else if ("serviceWorker" in navigator) {
  // Em desenvolvimento, registrar para permitir testes do PWA banner/events se desejado
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        console.log("[PWA Dev] Service Worker registrado:", reg.scope);
      })
      .catch(() => {});
  });
}

