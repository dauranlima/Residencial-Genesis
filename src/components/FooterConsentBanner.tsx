import { useState, useEffect } from "react";
import { ShieldAlert, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FooterConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já aceitou anteriormente
    const consent = localStorage.getItem("vizigo_consent_accepted") || localStorage.getItem("condomarket_consent_accepted");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("vizigo_consent_accepted", "true");
    setIsVisible(false);
  };

  const handleReject = () => {
    window.location.href = "https://www.google.com.br";
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-card/95 backdrop-blur-md border-t border-border shadow-2xl p-4 sm:px-6 sm:py-4 transition-all duration-300 animate-in slide-in-from-bottom-full">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-card-foreground text-center sm:text-left">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 hidden sm:block">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="text-xs sm:text-sm max-w-4xl">
            <p className="font-bold text-foreground text-sm sm:text-base mb-1">
              Informações Importantes – Termos de Uso do viziGO
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>viziGO</strong> é uma ferramenta tecnológica independente, de caráter particular e sem fins lucrativos, voltada exclusivamente à economia circular entre moradores. A plataforma não possui vínculo oficial com a administração ou síndico(a) do condomínio, não gerando ônus para a gestão. Atuamos estritamente como intermediários tecnológicos de anúncios, não participando, endossando ou garantindo transações financeiras, entregas ou a qualidade dos produtos negociados entre os usuários.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-center sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReject}
            className="flex-1 sm:flex-none border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-950/50 font-medium"
          >
            <X className="h-4 w-4 mr-1.5" />
            Rejeitar
          </Button>

          <Button
            type="button"
            variant="hero"
            size="sm"
            onClick={handleAccept}
            className="flex-1 sm:flex-none font-bold shadow-md"
          >
            <Check className="h-4 w-4 mr-1.5" />
            Aceitar
          </Button>
        </div>
      </div>
    </div>
  );
}
