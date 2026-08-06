import { useState } from "react";
import { X, Smartphone, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ResidentRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (fullName: string, block: string, unit: string, phone: string) => void;
  isSeniorMode: boolean;
}

const formatPhoneMask = (val: string) => {
  const digits = val.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : "";
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

export default function ResidentRegisterModal({
  isOpen,
  onClose,
  onSuccess,
  isSeniorMode,
}: ResidentRegisterModalProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [block, setBlock] = useState("");
  const [unit, setUnit] = useState("");
  const [otp, setOtp] = useState("");

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone && unit) {
      setStep("otp");
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length >= 4) {
      onSuccess(fullName || "Morador", block, unit, phone);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden ${
          isSeniorMode ? "border-4 border-amber-500" : ""
        }`}
      >
        {/* Cabeçalho */}
        <div className="bg-primary p-6 text-primary-foreground flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-accent" />
            <div>
              <h3 className={`font-bold ${isSeniorMode ? "text-2xl" : "text-lg"}`}>Acesso Sem Senha</h3>
              <p className={`text-primary-foreground/80 ${isSeniorMode ? "text-base" : "text-xs"}`}>
                Autenticação fácil por WhatsApp
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-primary-foreground/10">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Corpo */}
        {step === "phone" ? (
          <form onSubmit={handleSendOtp} className={`p-6 space-y-4 ${isSeniorMode ? "space-y-6" : ""}`}>
            <div>
              <label className={`block font-bold mb-1 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                Nome Completo *
              </label>
              <Input
                required
                placeholder="Seu Nome"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={isSeniorMode ? "h-14 text-lg" : "h-10"}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block font-bold mb-1 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                  Bloco/Torre
                </label>
                <Input
                  placeholder="Ex: A"
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  className={isSeniorMode ? "h-14 text-lg" : "h-10"}
                />
              </div>
              <div>
                <label className={`block font-bold mb-1 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                  Apto / Casa *
                </label>
                <Input
                  required
                  placeholder="Ex: 301"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className={isSeniorMode ? "h-14 text-lg" : "h-10"}
                />
              </div>
            </div>

            <div>
              <label className={`block font-bold mb-1 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                Celular (WhatsApp) *
              </label>
              <Input
                required
                placeholder="(45) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(formatPhoneMask(e.target.value))}
                className={isSeniorMode ? "h-14 text-lg" : "h-10"}
              />
            </div>

            <Button
              type="submit"
              variant="hero"
              className={`w-full font-bold flex items-center justify-center gap-2 ${
                isSeniorMode ? "h-14 text-xl rounded-xl" : "h-11"
              }`}
            >
              <span>Receber Código de Acesso</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className={`p-6 space-y-4 text-center ${isSeniorMode ? "space-y-6" : ""}`}>
            <Smartphone className="h-12 w-12 mx-auto text-amber-500" />
            <h3 className={`font-bold ${isSeniorMode ? "text-2xl" : "text-xl"}`}>Digite o Código de 4 dígitos</h3>
            <p className={`text-muted-foreground ${isSeniorMode ? "text-lg" : "text-xs"}`}>
              Enviamos um código de acesso via WhatsApp para <strong>{phone}</strong>.
            </p>

            <Input
              required
              maxLength={4}
              placeholder="1234"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={`text-center font-mono font-bold tracking-widest ${
                isSeniorMode ? "h-16 text-3xl" : "h-12 text-2xl"
              }`}
            />

            <Button
              type="submit"
              variant="hero"
              className={`w-full font-bold ${isSeniorMode ? "h-14 text-xl rounded-xl" : "h-11"}`}
            >
              Confirmar e Entrar
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
