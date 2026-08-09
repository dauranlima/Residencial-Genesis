import { useState } from "react";
import { X, ShieldCheck, Key, Store, User, Phone, MapPin, Sparkles, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Merchant } from "./types";
import { createMerchantInSupabase } from "@/lib/condoMarketService";
import { toast } from "sonner";

interface SuperAdminRegisterMerchantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newMerchant: Merchant) => void;
  isSeniorMode?: boolean;
}

const MERCHANT_CATEGORIES = [
  "Padaria",
  "Petshop",
  "Lava-Car",
  "Mercado",
  "Restaurante",
  "Farmácia",
  "Serviços",
  "Outros",
];

export default function SuperAdminRegisterMerchantModal({
  isOpen,
  onClose,
  onSuccess,
  isSeniorMode = false,
}: SuperAdminRegisterMerchantModalProps) {
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("Padaria");
  const [responsibleName, setResponsibleName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const generateRandomCode = () => {
    // Gerar código aleatório de 8 dígitos
    const code = Math.floor(10000000 + Math.random() * 90000000).toString();
    setAccessCode(code);
    toast.info(`Código de 8 dígitos gerado: ${code}`);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
    let formatted = digits;
    if (digits.length > 2) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length > 7) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    setPhone(formatted);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 8);
    setAccessCode(digits);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!businessName.trim()) {
      toast.error("Informe o Nome do Estabelecimento.");
      return;
    }
    if (!responsibleName.trim()) {
      toast.error("Informe o Nome do Responsável.");
      return;
    }
    if (!phone.trim()) {
      toast.error("Informe o Número do Celular/WhatsApp.");
      return;
    }
    if (!address.trim()) {
      toast.error("Informe o Endereço Completo.");
      return;
    }
    if (accessCode.length !== 8) {
      toast.error("O código de acesso deve conter exatamente 8 dígitos.");
      return;
    }
    if (accessCode === "85810220") {
      toast.error("Código Invalido! Escolha outro código de 8 dígitos.");
      return;
    }

    try {
      setIsSaving(true);

      const created = await createMerchantInSupabase({
        businessName: businessName.trim(),
        category,
        responsibleName: responsibleName.trim(),
        whatsapp: phone.trim(),
        address: address.trim(),
        accessCode: accessCode.trim(),
        description: `Estabelecimento parceiro (${category})`,
      });

      toast.success(`Parceiro "${created.businessName}" cadastrado com sucesso! Código: ${created.accessCode}`);

      // Limpar formulário
      setBusinessName("");
      setResponsibleName("");
      setPhone("");
      setAddress("");
      setAccessCode("");

      onSuccess(created);
      onClose();
    } catch (err: any) {
      console.error("Erro ao cadastrar parceiro comercial:", err);
      toast.error(err?.message || "Falha ao cadastrar o parceiro. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div
        className={`bg-card w-full max-w-xl rounded-2xl shadow-2xl border border-amber-500/40 overflow-hidden flex flex-col max-h-[92vh] ${
          isSeniorMode ? "border-4" : ""
        }`}
      >
        {/* Header Dourado de Super Admin */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 p-5 text-slate-950 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-950/15 rounded-xl text-slate-950">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 bg-slate-950/20 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md mb-0.5">
                <Sparkles className="h-3 w-3" /> Módulo Super Admin
              </div>
              <h2 className={`font-black ${isSeniorMode ? "text-2xl" : "text-xl"}`}>
                Cadastrar Novo Parceiro Comercial
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-2 rounded-full hover:bg-black/10 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
          <p className="text-xs text-muted-foreground bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
            🔑 <strong>Super Admin:</strong> Cadastre um novo estabelecimento comercial parceiro. Ao definir o código de 8 dígitos, o comerciante poderá utilizar esse PIN para autenticar instantaneamente no sistema.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1 flex items-center gap-1.5">
                <Store className="h-3.5 w-3.5 text-amber-500" /> Nome do Estabelecimento *
              </label>
              <Input
                required
                placeholder="Ex: Mercado & Confeitaria Silva"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="h-11 bg-background border-input focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Categoria *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm h-11 focus:border-amber-500 focus:outline-none"
              >
                {MERCHANT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-amber-500" /> Nome do Responsável *
              </label>
              <Input
                required
                placeholder="Ex: Carlos Eduardo Silva"
                value={responsibleName}
                onChange={(e) => setResponsibleName(e.target.value)}
                className="h-11 bg-background border-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-amber-500" /> Número do Telefone Celular *
              </label>
              <Input
                required
                placeholder="(45) 99999-9999"
                value={phone}
                onChange={handlePhoneChange}
                className="h-11 bg-background border-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-amber-500" /> Endereço Completo *
            </label>
            <Input
              required
              placeholder="Ex: Rua das Palmeiras, 150 - Centro, Cascavel - PR"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-11 bg-background border-input"
            />
          </div>

          <div className="bg-slate-950/5 dark:bg-slate-900/60 p-4 rounded-xl border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
                <Key className="h-4 w-4" /> Código Exclusivo de 8 Dígitos *
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={generateRandomCode}
                className="h-8 text-xs font-bold text-amber-600 hover:text-amber-700 hover:bg-amber-500/10 flex items-center gap-1"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Gerar Código
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Input
                required
                type="text"
                inputMode="numeric"
                maxLength={8}
                placeholder="Ex: 85819090"
                value={accessCode}
                onChange={handleCodeChange}
                className="h-12 bg-background border-2 border-amber-500/40 text-center text-lg font-mono font-black tracking-widest text-amber-600 dark:text-amber-400"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Este código de 8 dígitos será a chave de acesso do comerciante para publicar ofertas.
            </p>
          </div>

          {/* Rodapé e Ações */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold h-11 px-6 flex items-center gap-2 shadow-md"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Cadastrando...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Cadastrar Estabelecimento</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
