import React, { useState, useEffect } from "react";
import { Download, Share, X, Smartphone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // Check if already running as installed PWA
    const checkStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone ||
      document.referrer.includes("android-app://");

    if (checkStandalone) {
      setIsStandalone(true);
      return;
    }

    // Check if user dismissed recently (wait 7 days)
    const dismissedTime = localStorage.getItem("vizigo_pwa_dismissed");
    if (dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime, 10)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // Detect iOS
    const ua = window.navigator.userAgent;
    const iosDevice = /iphone|ipad|ipod/i.test(ua);
    setIsIos(iosDevice);

    if (iosDevice) {
      // Show banner on iOS after a brief delay
      const timer = setTimeout(() => setShowBanner(true), 3000);
      return () => clearTimeout(timer);
    }

    // Capture Android / Chrome beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    window.addEventListener("appinstalled", () => {
      setShowBanner(false);
      setInstalledSuccess(true);
      setTimeout(() => setInstalledSuccess(false), 5000);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      setShowIosInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setShowIosInstructions(false);
    localStorage.setItem("vizigo_pwa_dismissed", Date.now().toString());
  };

  if (isStandalone || (!showBanner && !showIosInstructions && !installedSuccess)) {
    return null;
  }

  return (
    <>
      {/* Installed Toast Notification */}
      {installedSuccess && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-50 max-w-sm bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-emerald-500/30 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <p className="font-semibold text-sm">viziGO Instalado!</p>
            <p className="text-xs text-slate-300">O app foi adicionado à sua tela inicial.</p>
          </div>
        </div>
      )}

      {/* Main PWA Install Floating Banner */}
      {showBanner && !showIosInstructions && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-slate-700/80 animate-in fade-in slide-in-from-bottom-6 transition-all duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg text-white font-bold text-lg shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-100 text-sm leading-snug">Instalar o app viziGO</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Acesse os classificados do condomínio direto da tela do celular!
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3.5 flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-xs text-slate-400 hover:text-white hover:bg-slate-800"
            >
              Agora não
            </Button>
            <Button
              size="sm"
              onClick={handleInstallClick}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs gap-1.5 px-4 shadow-md transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              {isIos ? "Como Instalar" : "Instalar App"}
            </Button>
          </div>
        </div>
      )}

      {/* iOS Safari Instructions Dialog */}
      {showIosInstructions && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 text-white w-full max-w-sm rounded-2xl p-5 shadow-2xl relative animate-in slide-in-from-bottom-8">
            <button
              onClick={() => setShowIosInstructions(false)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Share className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-100">Instalar no iPhone / iPad</h3>
                <p className="text-xs text-slate-400">Siga 2 passos rápidos no Safari:</p>
              </div>
            </div>

            <ol className="space-y-3 text-xs text-slate-300 mb-5">
              <li className="flex items-start gap-2.5 bg-slate-800/70 p-2.5 rounded-xl border border-slate-700/50">
                <span className="font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md">1</span>
                <span>
                  Toque no ícone de <strong className="text-white">Compartilhar</strong> (quadrado com seta para cima) na barra do Safari.
                </span>
              </li>
              <li className="flex items-start gap-2.5 bg-slate-800/70 p-2.5 rounded-xl border border-slate-700/50">
                <span className="font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md">2</span>
                <span>
                  Role a lista e selecione <strong className="text-white">'Adicionar à Tela de Início'</strong>.
                </span>
              </li>
            </ol>

            <Button
              onClick={() => setShowIosInstructions(false)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
            >
              Entendido
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
