import React, { useState, useEffect } from "react";

export const SplashScreen: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Exibe a splash por 1.8s e depois executa fade-out suave de 400ms (total ~2.2s)
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 1800);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 2200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-[#0f172a] flex flex-col items-center justify-center text-slate-100 select-none overflow-hidden transition-opacity duration-500 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute w-36 h-36 bg-blue-500/25 rounded-full blur-xl animate-pulse" />
        <img
          src="/pwa-512x512.png"
          alt="viziGO"
          className="relative w-24 h-24 rounded-2xl shadow-2xl object-cover ring-2 ring-blue-500/30"
        />
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent mb-1">
        viziGO
      </h1>
      <p className="text-sm font-medium text-slate-400 mb-8 text-center px-4">
        Classificados do seu condomínio
      </p>

      {/* Barra de Progresso com animação preenchendo até 100% em ~1.8s */}
      <div className="w-36 h-1.5 bg-slate-800/80 rounded-full overflow-hidden relative shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-[1800ms] ease-out"
          style={{ width: fading ? "100%" : "0%" }}
          ref={(el) => {
            if (el) {
              requestAnimationFrame(() => {
                el.style.width = "100%";
              });
            }
          }}
        />
      </div>
    </div>
  );
};
