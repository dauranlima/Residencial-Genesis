import { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  Key,
  Store,
  User,
  Phone,
  MapPin,
  Sparkles,
  Loader2,
  RefreshCw,
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Check,
  Building2,
  ArrowLeft,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Merchant } from "./types";
import {
  fetchAllMerchantsForAdmin,
  createMerchantInSupabase,
  updateMerchantInSupabase,
  deleteMerchantFromSupabase,
  regenerateMerchantAccessCode,
} from "@/lib/condoMarketService";
import { toast } from "sonner";

interface SuperAdminMerchantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMerchantToAuthenticate?: (merchant: Merchant) => void;
  onMerchantListUpdated?: () => void;
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

export default function SuperAdminMerchantsModal({
  isOpen,
  onClose,
  onSelectMerchantToAuthenticate,
  onMerchantListUpdated,
  isSeniorMode = false,
}: SuperAdminMerchantsModalProps) {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("Todas");

  // Estados de navegação (list = lista de parceiros, register = cadastrar novo, edit = editar)
  const [viewMode, setViewMode] = useState<"list" | "register" | "edit">("list");
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null);
  const [deletingMerchantId, setDeletingMerchantId] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Campos do Formulário (Registro/Edição)
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("Padaria");
  const [responsibleName, setResponsibleName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadMerchants();
      setViewMode("list");
    }
  }, [isOpen]);

  const loadMerchants = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllMerchantsForAdmin();
      setMerchants(data);
    } catch (e) {
      console.error("Erro ao carregar parceiros:", e);
      toast.error("Erro ao carregar lista de parceiros.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Gerar código aleatório de 8 dígitos
  const generateRandomCode = () => {
    const code = Math.floor(10000000 + Math.random() * 90000000).toString();
    setAccessCode(code);
    toast.info(`Novo código de 8 dígitos gerado: ${code}`);
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

  const openRegisterView = () => {
    setBusinessName("");
    setCategory("Padaria");
    setResponsibleName("");
    setPhone("");
    setAddress("");
    setAccessCode("");
    generateRandomCode();
    setViewMode("register");
  };

  const openEditView = (merchant: Merchant) => {
    setEditingMerchant(merchant);
    setBusinessName(merchant.businessName);
    setCategory(merchant.category || "Padaria");
    setResponsibleName(merchant.responsibleName || "");
    setPhone(merchant.whatsapp || "");
    setAddress(merchant.address || "");
    setAccessCode(merchant.accessCode || "");
    setViewMode("edit");
  };

  const handleCopyCode = (code: string, merchantId: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCodeId(merchantId);
    toast.success(`PIN ${code} copiado para a área de transferência!`);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleRegenerateCode = async (merchant: Merchant) => {
    try {
      setRegeneratingId(merchant.id);
      const newCode = await regenerateMerchantAccessCode(merchant.id);
      toast.success(`Novo PIN para "${merchant.businessName}": ${newCode}`);
      await loadMerchants();
      if (onMerchantListUpdated) onMerchantListUpdated();
    } catch (e) {
      toast.error("Erro ao gerar novo código PIN.");
    } finally {
      setRegeneratingId(null);
    }
  };

  const handleDeleteMerchant = async (merchant: Merchant) => {
    if (!confirm(`Tem certeza que deseja excluir o parceiro "${merchant.businessName}"?`)) {
      return;
    }

    try {
      setDeletingMerchantId(merchant.id);
      await deleteMerchantFromSupabase(merchant.id);
      toast.success(`Parceiro "${merchant.businessName}" removido com sucesso.`);
      await loadMerchants();
      if (onMerchantListUpdated) onMerchantListUpdated();
    } catch (e) {
      toast.error("Erro ao excluir parceiro.");
    } finally {
      setDeletingMerchantId(null);
    }
  };

  const handleSubmitSave = async (e: React.FormEvent) => {
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
      toast.error("Informe o Celular/WhatsApp.");
      return;
    }
    if (!address.trim()) {
      toast.error("Informe o Endereço.");
      return;
    }
    if (accessCode.length !== 8) {
      toast.error("O código de acesso deve ter exatamente 8 dígitos.");
      return;
    }
    if (accessCode === "85810220") {
      toast.error("Este código é reservado para o Super Admin. Escolha outro PIN de 8 dígitos.");
      return;
    }

    setIsSaving(true);
    try {
      if (viewMode === "register") {
        const created = await createMerchantInSupabase({
          businessName: businessName.trim(),
          category,
          responsibleName: responsibleName.trim(),
          whatsapp: phone.trim(),
          address: address.trim(),
          accessCode: accessCode.trim(),
          description: `Estabelecimento parceiro (${category})`,
        });

        toast.success(`Parceiro "${created.businessName}" cadastrado com sucesso! PIN: ${created.accessCode}`);
      } else if (viewMode === "edit" && editingMerchant) {
        await updateMerchantInSupabase(editingMerchant.id, {
          businessName: businessName.trim(),
          category,
          responsibleName: responsibleName.trim(),
          whatsapp: phone.trim(),
          address: address.trim(),
          accessCode: accessCode.trim(),
        });

        toast.success(`Dados de "${businessName.trim()}" atualizados com sucesso!`);
      }

      await loadMerchants();
      if (onMerchantListUpdated) onMerchantListUpdated();
      setViewMode("list");
    } catch (err) {
      console.error("Erro ao salvar parceiro:", err);
      toast.error("Falha ao salvar dados do parceiro.");
    } finally {
      setIsSaving(false);
    }
  };

  // Filtragem da lista
  const filteredMerchants = merchants.filter((m) => {
    const matchesSearch =
      m.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.responsibleName && m.responsibleName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.whatsapp && m.whatsapp.includes(searchTerm)) ||
      (m.accessCode && m.accessCode.includes(searchTerm));

    const matchesCategory =
      selectedCategoryFilter === "Todas" || m.category === selectedCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div
        className={`bg-card w-full max-w-3xl rounded-2xl shadow-2xl border border-amber-500/50 overflow-hidden flex flex-col max-h-[92vh] ${
          isSeniorMode ? "border-4" : ""
        }`}
      >
        {/* Header Dourado Super Admin */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 p-4 sm:p-5 text-white flex items-center justify-between shadow-lg relative">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-black/20 rounded-xl backdrop-blur-sm border border-white/20">
              <ShieldCheck className="h-6 w-6 text-amber-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-black/30 text-amber-200 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-amber-300/30 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Módulo Super Admin
                </span>
                <Badge variant="outline" className="border-white/30 text-white font-mono text-xs">
                  {merchants.length} {merchants.length === 1 ? "Parceiro" : "Parceiros"}
                </Badge>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5">
                Central de Gestão de Parceiros Comerciais
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white/90 hover:text-white transition-colors"
            title="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* VIEW 1: LISTA DE PARCEIROS (MODO PRINCIPAL) */}
        {viewMode === "list" && (
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
            {/* Toolbar Superior: Busca + Filtro + Botão Cadastrar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-muted/40 p-3 rounded-xl border border-border/60">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar por nome, responsável, fone ou PIN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-background h-10 text-sm border-border/80"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="bg-background border border-border/80 text-foreground text-sm rounded-lg px-3 h-10 focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option value="Todas">Todas Categorias</option>
                  {MERCHANT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <Button
                  onClick={openRegisterView}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold h-10 px-4 shadow-md gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Cadastrar Parceiro</span>
                  <span className="sm:hidden">Novo</span>
                </Button>
              </div>
            </div>

            {/* Estado de Carregamento */}
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                <p className="text-sm">Carregando parceiros comerciais do Supabase...</p>
              </div>
            ) : filteredMerchants.length === 0 ? (
              /* Estado Vazio */
              <div className="py-12 px-4 text-center border-2 border-dashed border-border rounded-2xl bg-muted/20 flex flex-col items-center justify-center">
                <Store className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <h3 className="font-bold text-lg text-foreground">Nenhum parceiro encontrado</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-4">
                  {searchTerm || selectedCategoryFilter !== "Todas"
                    ? "Nenhum resultado corresponde à sua pesquisa ou filtro."
                    : "Ainda não existem parceiros comerciais cadastrados no sistema."}
                </p>
                <Button
                  onClick={openRegisterView}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Cadastrar Primeiro Parceiro
                </Button>
              </div>
            ) : (
              /* Lista de Cards de Parceiros */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMerchants.map((merchant) => (
                  <div
                    key={merchant.id}
                    className="bg-card border border-border/80 hover:border-amber-500/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 relative group"
                  >
                    {/* Header do Card */}
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/20 px-2 py-0.5 rounded-md">
                            {merchant.category || "Parceiro"}
                          </span>
                          <h3 className="font-bold text-base text-foreground leading-tight mt-1">
                            {merchant.businessName}
                          </h3>
                        </div>

                        {/* Botão para Autenticar/Entrar como o parceiro */}
                        {onSelectMerchantToAuthenticate && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              onSelectMerchantToAuthenticate(merchant);
                              toast.success(`Modo parceiro ativado para "${merchant.businessName}"`);
                              onClose();
                            }}
                            title="Entrar como este parceiro no sistema"
                            className="h-8 px-2 text-xs border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 gap-1"
                          >
                            <LogIn className="h-3.5 w-3.5" />
                            <span>Acessar</span>
                          </Button>
                        )}
                      </div>

                      {/* Informações de Contato */}
                      <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                        {merchant.responsibleName && (
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                            <span className="font-medium text-foreground">{merchant.responsibleName}</span>
                          </div>
                        )}
                        {merchant.whatsapp && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            <span>{merchant.whatsapp}</span>
                          </div>
                        )}
                        {merchant.address && (
                          <div className="flex items-center gap-1.5 line-clamp-1">
                            <MapPin className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                            <span className="truncate">{merchant.address}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Caixa de Código de Acesso / PIN de 8 Dígitos */}
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <div>
                          <p className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300 tracking-wider">
                            PIN de 8 Dígitos
                          </p>
                          <p className="font-mono font-bold text-sm tracking-widest text-foreground">
                            {merchant.accessCode || "Sem PIN"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Copiar PIN */}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleCopyCode(merchant.accessCode || "", merchant.id)}
                          className="h-8 w-8 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20"
                          title="Copiar código de 8 dígitos"
                        >
                          {copiedCodeId === merchant.id ? (
                            <Check className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>

                        {/* Gerar Novo PIN */}
                        <Button
                          size="icon"
                          variant="ghost"
                          disabled={regeneratingId === merchant.id}
                          onClick={() => handleRegenerateCode(merchant)}
                          className="h-8 w-8 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20"
                          title="Gerar Novo PIN de 8 dígitos"
                        >
                          {regeneratingId === merchant.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Botões de Ação Inferiores (Editar / Excluir) */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditView(merchant)}
                        className="h-8 text-xs border-border gap-1.5"
                      >
                        <Edit2 className="h-3.5 w-3.5 text-blue-500" />
                        Editar
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        disabled={deletingMerchantId === merchant.id}
                        onClick={() => handleDeleteMerchant(merchant)}
                        className="h-8 text-xs border-red-500/30 text-red-600 hover:bg-red-500/10 gap-1.5"
                      >
                        {deletingMerchantId === merchant.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        Excluir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: FORMULÁRIO DE CADASTRO OU EDIÇÃO */}
        {(viewMode === "register" || viewMode === "edit") && (
          <form onSubmit={handleSubmitSave} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 px-2 gap-1 text-muted-foreground"
                >
                  <ArrowLeft className="h-4 w-4" /> Voltar
                </Button>
                <h3 className="font-bold text-base text-foreground">
                  {viewMode === "register" ? "Cadastrar Novo Parceiro" : `Editar "${editingMerchant?.businessName}"`}
                </h3>
              </div>

              <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                {viewMode === "register" ? "Novo Cadastro" : "Modo Edição"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nome do Estabelecimento */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Store className="h-3.5 w-3.5 text-amber-500" /> Nome do Estabelecimento *
                </label>
                <Input
                  type="text"
                  placeholder="Ex: Mercado & Confeitaria Silva"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="bg-background border-border/80 text-sm"
                  required
                />
              </div>

              {/* Categoria */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-amber-500" /> Categoria *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-background border border-border/80 text-foreground text-sm rounded-md px-3 h-10 focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  {MERCHANT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nome do Responsável */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-amber-500" /> Nome do Responsável *
                </label>
                <Input
                  type="text"
                  placeholder="Ex: Carlos Eduardo Silva"
                  value={responsibleName}
                  onChange={(e) => setResponsibleName(e.target.value)}
                  className="bg-background border-border/80 text-sm"
                  required
                />
              </div>

              {/* Celular / WhatsApp */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-amber-500" /> Número do Telefone Celular *
                </label>
                <Input
                  type="text"
                  placeholder="(45) 99999-9999"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="bg-background border-border/80 text-sm"
                  required
                />
              </div>

              {/* Endereço */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-amber-500" /> Endereço Completo *
                </label>
                <Input
                  type="text"
                  placeholder="Ex: Rua das Palmeiras, 150 - Centro, Cascavel - PR"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-background border-border/80 text-sm"
                  required
                />
              </div>

              {/* Código de Acesso de 8 Dígitos */}
              <div className="space-y-1.5 sm:col-span-2 bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 uppercase">
                    <Key className="h-4 w-4 text-amber-600" /> Código Exclusivo de 8 Dígitos (PIN) *
                  </label>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={generateRandomCode}
                    className="h-7 text-xs text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 gap-1 font-semibold"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Gerar Novo Código
                  </Button>
                </div>

                <Input
                  type="text"
                  placeholder="Ex: 85819090"
                  value={accessCode}
                  onChange={handleCodeChange}
                  maxLength={8}
                  className="bg-background font-mono text-center text-lg font-bold tracking-widest border-amber-500/40 text-foreground h-11"
                  required
                />
                <p className="text-[11px] text-muted-foreground">
                  Este código de 8 dígitos será a chave de acesso do comerciante para publicar ofertas.
                </p>
              </div>
            </div>

            {/* Footer do Formulário */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setViewMode("list")}>
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={isSaving}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 shadow-md gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    {viewMode === "register" ? "Cadastrar Estabelecimento" : "Salvar Alterações"}
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
