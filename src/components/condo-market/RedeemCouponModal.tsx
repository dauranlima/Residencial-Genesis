import { useState, useMemo } from "react";
import { X, CheckCircle, Ticket, Copy, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Coupon } from "./types";

interface RedeemCouponModalProps {
  coupon: Coupon | null;
  isOpen: boolean;
  onClose: () => void;
  isSeniorMode: boolean;
}

export default function RedeemCouponModal({
  coupon,
  isOpen,
  onClose,
  isSeniorMode,
}: RedeemCouponModalProps) {
  const [copied, setCopied] = useState(false);

  // Gerar código único fixo por sessão de abertura do modal
  const code = useMemo(() => {
    if (!coupon || !isOpen) return "";
    const categoryPrefix = (coupon.merchantCategory || "MER").substring(0, 3).toUpperCase();
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `CONDO-${categoryPrefix}-${randomNumber}`;
  }, [coupon?.id, isOpen]);

  if (!isOpen || !coupon) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappMessage = encodeURIComponent(
    `Olá ${coupon.merchantName}! Resgatei o cupom "${coupon.title}" (${coupon.discountValue}) no viziGO com o código ${code}. Gostaria de agendar / utilizar o desconto!`
  );

  const whatsappUrl = `https://wa.me/55${coupon.merchantWhatsapp.replace(/\D/g, "")}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`bg-card w-full max-w-lg rounded-2xl shadow-2xl border border-border overflow-hidden text-center ${
          isSeniorMode ? "border-4 border-amber-500" : ""
        }`}
      >
        {/* Top Header */}
        <div className="bg-amber-500 p-6 text-slate-950 flex justify-between items-center">
          <div className="flex items-center gap-2 text-left">
            <Ticket className="h-7 w-7" />
            <div>
              <h3 className="font-extrabold text-lg">Cupom Resgatado com Sucesso!</h3>
              <p className="text-xs text-slate-900 font-medium">Apresente este código no estabelecimento</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className={`p-6 space-y-6 ${isSeniorMode ? "p-8 space-y-8" : ""}`}>
          <div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
              {coupon.merchantName} ({coupon.merchantCategory})
            </span>
            <h2 className={`font-black text-foreground mt-1 ${isSeniorMode ? "text-3xl" : "text-2xl"}`}>
              {coupon.title}
            </h2>
            <div className="mt-3 inline-block bg-amber-500/10 text-amber-600 dark:text-amber-400 font-black px-4 py-1.5 rounded-full text-xl border border-amber-500/20">
              {coupon.discountValue}
            </div>
          </div>

          {/* Display de Código */}
          <div className="bg-muted p-4 rounded-xl border-2 border-dashed border-amber-500/50 space-y-2">
            <span className="text-xs text-muted-foreground font-semibold">CÓDIGO EXCLUSIVO DO MORADOR</span>
            <div className={`font-mono font-black text-foreground tracking-wider ${isSeniorMode ? "text-4xl" : "text-3xl"}`}>
              {code}
            </div>
            <p className="text-xs text-muted-foreground">Mostre a tela do seu celular ou informe o código acima.</p>
          </div>

          {/* Botões de Ação */}
          <div className="space-y-3">
            <Button
              onClick={handleCopy}
              variant="outline"
              className={`w-full font-bold flex items-center justify-center gap-2 ${
                isSeniorMode ? "h-14 text-lg" : "h-10"
              }`}
            >
              {copied ? <CheckCircle className="h-5 w-5 text-emerald-600" /> : <Copy className="h-5 w-5" />}
              <span>{copied ? "Código Copiado!" : "Copiar Código"}</span>
            </Button>

            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full block">
              <Button
                className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 ${
                  isSeniorMode ? "h-16 text-xl rounded-xl" : "h-12 text-sm"
                }`}
              >
                <MessageCircle className="h-5 w-5" />
                <span>Enviar pelo WhatsApp para o Comércio</span>
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
