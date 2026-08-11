import { useState, useEffect, useRef } from "react";
import { X, Smartphone, ShieldCheck, ArrowRight, UserPlus, LogIn, ArrowLeft, UserCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getResidentByPhone, saveResidentProfile } from "@/lib/condoMarketService";
import { sendWhatsAppVerificationCode, verifyWhatsAppCode } from "@/lib/verificationService";
import { isValidCondoUnit } from "@/lib/condoUnits";
import { toast } from "sonner";

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
  // Modos: 'selection' (tela inicial com 2 botões) | 'register' | 'login' | 'otp'
  const [mode, setMode] = useState<"selection" | "register" | "login" | "otp">("selection");
  const [isFlipped, setIsFlipped] = useState(false);

  // Ref para focar no campo Nome Completo no 1º acesso
  const fullNameInputRef = useRef<HTMLInputElement>(null);

  // Form States
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [block, setBlock] = useState("");
  const [unit, setUnit] = useState("");
  const [otp, setOtp] = useState("");
  const [foundExistingUser, setFoundExistingUser] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  // Resetar estados quando o modal for fechado/aberto
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setMode("selection");
        setIsFlipped(false);
        setFullName("");
        setPhone("");
        setBlock("");
        setUnit("");
        setOtp("");
        setFoundExistingUser(false);
        setIsSearching(false);
        setIsSendingCode(false);
        setIsVerifying(false);
        setGeneratedCode(null);
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Tratar escolha "Primeira vez aqui"
  const handleChooseRegister = () => {
    setMode("register");
    setIsFlipped(true);
    setTimeout(() => {
      fullNameInputRef.current?.focus();
    }, 200);
  };

  // Tratar escolha "Já me identifiquei antes"
  const handleChooseLogin = () => {
    setMode("login");
    setIsFlipped(true);
  };

  // Voltar para a tela de escolha inicial
  const handleBackToSelection = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setMode("selection");
      setFoundExistingUser(false);
      setIsSearching(false);
    }, 300);
  };

  // Submeter envio do código de WhatsApp
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone || phone.replace(/\D/g, "").length < 10) {
      toast.error("Por favor, digite um número de celular válido com DDD.");
      return;
    }

    if (mode === "register") {
      const validation = isValidCondoUnit(block, unit);
      if (!validation.valid) {
        toast.error(validation.errorReason || "Apartamento ou Torre não cadastrado no sistema.");
        return;
      }
    }

    if (mode === "login") {
      setIsSearching(true);
      try {
        // Buscar perfil cadastrado previamente por este WhatsApp (no localStorage ou Supabase)
        const existing = await getResidentByPhone(phone);
        if (existing) {
          setFullName(existing.name);
          setBlock(existing.block || "");
          setUnit(existing.unit);
          setFoundExistingUser(true);
          toast.success(`Perfil encontrado: ${existing.name} (${existing.unit})`);
        } else {
          toast.warning("Nenhum cadastro prévio encontrado para este WhatsApp. Por favor, preencha os dados do primeiro acesso.");
          setMode("register");
          setIsSearching(false);
          return;
        }
      } catch (err) {
        console.error("Erro ao buscar morador:", err);
      } finally {
        setIsSearching(false);
      }
    }

    // Disparar código de verificação backend / Supabase / Evolution API
    setIsSendingCode(true);
    try {
      const res = await sendWhatsAppVerificationCode(phone);
      if (res.codeForTesting) {
        setGeneratedCode(res.codeForTesting);
      }
      toast.info(res.message);
      setMode("otp");
    } catch (err: any) {
      toast.error(err.message || "Erro ao gerar código de verificação.");
    } finally {
      setIsSendingCode(false);
    }
  };

  // Confirmar OTP de 4 dígitos
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      toast.error("O código de verificação deve ter 4 dígitos.");
      return;
    }

    setIsVerifying(true);
    try {
      // 1. Validar no Supabase / Tabela verification_tokens
      const isValidDb = await verifyWhatsAppCode(phone, otp);
      
      // Fallback local de teste caso offline ou token gerado recentemente no front
      const isValidFallback = generatedCode === otp;

      if (!isValidDb && !isValidFallback) {
        toast.error("Código incorreto ou expirado (válido por 5 min). Solicite um novo código.");
        setIsVerifying(false);
        return;
      }

      toast.success("Código confirmado com sucesso!");

      const finalName = fullName || "Morador";
      const finalBlock = block || "";
      const finalUnit = unit || "Sem Apto";

      // Salvar na base de moradores vinculando ao WhatsApp
      await saveResidentProfile({
        name: finalName,
        block: finalBlock,
        unit: finalUnit,
        phone,
      });

      onSuccess(finalName, finalBlock, finalUnit, phone);
      onClose();
    } catch (err: any) {
      toast.error("Erro ao verificar código. Tente novamente.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Container 3D Perspective */}
      <div className="perspective-1000 w-full max-w-md">
        {/* Card 3D Flippable Wrapper */}
        <div
          className={`relative w-full rounded-2xl shadow-2xl transition-transform duration-700 transform-style-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* ======================================================== */}
          {/* FACE 1: SELEÇÃO INICIAL (FRENTE)                        */}
          {/* ======================================================== */}
          <div
            className={`w-full bg-card rounded-2xl border border-border overflow-hidden backface-hidden ${
              isFlipped ? "pointer-events-none" : ""
            } ${isSeniorMode ? "border-4 border-amber-500" : ""}`}
          >
            {/* Cabeçalho */}
            <div className="bg-primary p-6 text-primary-foreground flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-8 w-8 text-amber-400" />
                <div>
                  <h3 className={`font-bold ${isSeniorMode ? "text-2xl" : "text-xl"}`}>
                    Identificar Morador
                  </h3>
                  <p className={`text-primary-foreground/80 ${isSeniorMode ? "text-base" : "text-xs"}`}>
                    Selecione como deseja se identificar
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors"
                aria-label="Fechar"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Opções de Seleção */}
            <div className={`p-6 space-y-4 ${isSeniorMode ? "space-y-6" : ""}`}>
              <p className={`text-muted-foreground text-center ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                Bem-vindo ao <strong>viziGO</strong>! Escolha uma das opções abaixo para acessar:
              </p>

              {/* Botão 1: Primeira Vez */}
              <button
                type="button"
                onClick={handleChooseRegister}
                className={`w-full text-left p-4 rounded-xl border-2 border-primary/20 hover:border-amber-500 bg-accent/10 hover:bg-accent/20 transition-all duration-200 group flex items-start gap-4 shadow-sm ${
                  isSeniorMode ? "p-6" : ""
                }`}
              >
                <div className="p-3 rounded-lg bg-amber-500 text-primary-foreground group-hover:scale-105 transition-transform">
                  <UserPlus className={`h-6 w-6 ${isSeniorMode ? "h-8 w-8" : ""}`} />
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-foreground group-hover:text-amber-600 transition-colors ${
                    isSeniorMode ? "text-xl" : "text-base"
                  }`}>
                    Primeira vez aqui (Cadastrar)
                  </h4>
                  <p className={`text-muted-foreground ${isSeniorMode ? "text-base" : "text-xs"}`}>
                    Preencha Nome, Bloco/Apto e Celular para seu 1º acesso.
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-amber-500 self-center group-hover:translate-x-1 transition-all" />
              </button>

              {/* Botão 2: Já se Logou */}
              <button
                type="button"
                onClick={handleChooseLogin}
                className={`w-full text-left p-4 rounded-xl border-2 border-border hover:border-primary bg-card hover:bg-primary/5 transition-all duration-200 group flex items-start gap-4 shadow-sm ${
                  isSeniorMode ? "p-6" : ""
                }`}
              >
                <div className="p-3 rounded-lg bg-primary text-primary-foreground group-hover:scale-105 transition-transform">
                  <LogIn className={`h-6 w-6 ${isSeniorMode ? "h-8 w-8" : ""}`} />
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-foreground group-hover:text-primary transition-colors ${
                    isSeniorMode ? "text-xl" : "text-base"
                  }`}>
                    Já me identifiquei antes
                  </h4>
                  <p className={`text-muted-foreground ${isSeniorMode ? "text-base" : "text-xs"}`}>
                    Informe apenas seu WhatsApp para receber o código rápido.
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary self-center group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* FACE 2: FORMULÁRIOS / OTP (VERSO - ROTACIONADO 180 DEG)  */}
          {/* ======================================================== */}
          <div
            className={`absolute inset-0 w-full bg-card rounded-2xl border border-border overflow-hidden backface-hidden rotate-y-180 shadow-2xl flex flex-col justify-between ${
              !isFlipped ? "pointer-events-none" : ""
            } ${isSeniorMode ? "border-4 border-amber-500" : ""}`}
          >
            {/* Cabeçalho */}
            <div className="bg-primary p-5 text-primary-foreground flex justify-between items-center">
              <div className="flex items-center gap-2">
                {mode !== "otp" && (
                  <button
                    type="button"
                    onClick={handleBackToSelection}
                    className="p-1.5 rounded-full hover:bg-primary-foreground/10 transition-colors mr-1"
                    title="Voltar à seleção"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                )}
                <ShieldCheck className="h-6 w-6 text-amber-400" />
                <div>
                  <h3 className={`font-bold ${isSeniorMode ? "text-xl" : "text-base"}`}>
                    {mode === "register"
                      ? "Primeiro Acesso"
                      : mode === "login"
                      ? "Morador Já Cadastrado"
                      : "Código de Segurança"}
                  </h3>
                  <p className={`text-primary-foreground/80 ${isSeniorMode ? "text-sm" : "text-xs"}`}>
                    {mode === "otp" ? "Autenticação por WhatsApp" : "Acesso fácil e sem senha"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-primary-foreground/10 transition-colors"
                aria-label="Fechar"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Conteúdo do Verso */}
            <div className="flex-1 overflow-y-auto">
              {/* FORMULÁRIO: PRIMEIRO ACESSO */}
              {mode === "register" && (
                <form onSubmit={handleSendOtp} className={`p-6 space-y-4 ${isSeniorMode ? "space-y-5" : ""}`}>
                  <div>
                    <label className={`block font-bold mb-1 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                      Nome Completo *
                    </label>
                    <Input
                      ref={fullNameInputRef}
                      required
                      autoFocus
                      placeholder="Seu Nome Completo"
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
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Ex: 301"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value.replace(/\D/g, ""))}
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
                      type="tel"
                      inputMode="numeric"
                      placeholder="(45) 99999-9999"
                      value={phone}
                      onChange={(e) => setPhone(formatPhoneMask(e.target.value))}
                      className={isSeniorMode ? "h-14 text-lg" : "h-10"}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    disabled={isSendingCode}
                    className={`w-full font-bold flex items-center justify-center gap-2 mt-2 ${
                      isSeniorMode ? "h-14 text-xl rounded-xl" : "h-11"
                    }`}
                  >
                    {isSendingCode ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Gerando Código...</span>
                      </>
                    ) : (
                      <>
                        <span>Receber Código de Acesso</span>
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              )}

              {/* FORMULÁRIO: JÁ ME IDENTIFIQUEI ANTES */}
              {mode === "login" && (
                <form onSubmit={handleSendOtp} className={`p-6 space-y-5 ${isSeniorMode ? "space-y-6" : ""}`}>
                  <div className="text-center p-3 bg-primary/5 rounded-xl border border-primary/10">
                    <UserCheck className="h-10 w-10 mx-auto text-primary mb-2" />
                    <h4 className={`font-bold ${isSeniorMode ? "text-xl" : "text-base"}`}>
                      Login Rápido por WhatsApp
                    </h4>
                    <p className={`text-muted-foreground ${isSeniorMode ? "text-base" : "text-xs"}`}>
                      Digite o WhatsApp cadastrado anteriormente para resgatar seus dados automaticamente.
                    </p>
                  </div>

                  <div>
                    <label className={`block font-bold mb-1 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                      Celular (WhatsApp) *
                    </label>
                    <Input
                      required
                      autoFocus
                      type="tel"
                      inputMode="numeric"
                      placeholder="(45) 99999-9999"
                      value={phone}
                      onChange={(e) => setPhone(formatPhoneMask(e.target.value))}
                      className={isSeniorMode ? "h-14 text-lg" : "h-10"}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    disabled={isSearching || isSendingCode}
                    className={`w-full font-bold flex items-center justify-center gap-2 ${
                      isSeniorMode ? "h-14 text-xl rounded-xl" : "h-11"
                    }`}
                  >
                    {isSearching ? (
                      <span>Buscando cadastro...</span>
                    ) : isSendingCode ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Enviando WhatsApp...</span>
                      </>
                    ) : (
                      <>
                        <span>Enviar Código WhatsApp</span>
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              )}

              {/* FORMULÁRIO: OTP / CÓDIGO 4 DIGITOS */}
              {mode === "otp" && (
                <form onSubmit={handleVerifyOtp} className={`p-6 space-y-4 text-center ${isSeniorMode ? "space-y-6" : ""}`}>
                  <Smartphone className="h-12 w-12 mx-auto text-amber-500 animate-pulse" />
                  <div>
                    <h3 className={`font-bold ${isSeniorMode ? "text-2xl" : "text-xl"}`}>
                      Digite o Código de 4 dígitos
                    </h3>
                    <p className={`text-muted-foreground mt-1 ${isSeniorMode ? "text-lg" : "text-xs"}`}>
                      Enviamos um código via WhatsApp para <strong>{phone}</strong>.
                    </p>

                    {foundExistingUser && (
                      <div className="mt-3 p-2.5 bg-green-500/10 border border-green-500/30 rounded-lg text-green-700 dark:text-green-400 text-xs font-medium">
                        Identificado: <strong>{fullName}</strong> ({unit})
                      </div>
                    )}
                  </div>

                  <Input
                    required
                    autoFocus
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    placeholder="1234"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className={`text-center font-mono font-bold tracking-widest ${
                      isSeniorMode ? "h-16 text-3xl" : "h-12 text-2xl"
                    }`}
                  />

                  <Button
                    type="submit"
                    variant="hero"
                    disabled={isVerifying}
                    className={`w-full font-bold ${isSeniorMode ? "h-14 text-xl rounded-xl" : "h-11"}`}
                  >
                    {isVerifying ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Verificando...</span>
                      </div>
                    ) : (
                      "Confirmar e Entrar"
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
