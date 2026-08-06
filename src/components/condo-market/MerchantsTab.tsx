import { useState, useEffect } from "react";
import { Store, Zap, Search, MapPin, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CouponCard from "./CouponCard";
import { Coupon, Merchant } from "./types";
import { fetchTotalRedemptionsCountFromSupabase } from "@/lib/condoMarketService";

interface MerchantsTabProps {
  coupons: Coupon[];
  merchants: Merchant[];
  isLoading?: boolean;
  isSeniorMode: boolean;
  redeemedCouponIds?: string[];
  currentMerchant?: Merchant | null;
  onRedeemCoupon: (coupon: Coupon) => void;
  onOpenNewPromotionModal?: () => void;
  onViewRedemptions?: (coupon: Coupon) => void;
  onDeleteCoupon?: (coupon: Coupon) => void;
  onMerchantLogout?: () => void;
  onOpenAdminAuth?: () => void;
}

export default function MerchantsTab({
  coupons,
  merchants,
  isLoading = false,
  isSeniorMode,
  redeemedCouponIds = [],
  currentMerchant,
  onRedeemCoupon,
  onOpenNewPromotionModal,
  onViewRedemptions,
  onDeleteCoupon,
  onMerchantLogout,
  onOpenAdminAuth,
}: MerchantsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"showcase" | "merchant_dashboard">("showcase");
  const [dbRedemptionsCount, setDbRedemptionsCount] = useState<number | null>(null);

  useEffect(() => {
    if (currentMerchant) {
      setViewMode("merchant_dashboard");
    }
  }, [currentMerchant]);

  useEffect(() => {
    fetchTotalRedemptionsCountFromSupabase().then((count) => {
      setDbRedemptionsCount(count);
    });
  }, [coupons]);

  const filteredCoupons = coupons.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.merchantCategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCouponsAvailable = coupons.reduce((acc, c) => acc + c.totalQuantity, 0);
  const totalCouponsRedeemed = dbRedemptionsCount !== null
    ? dbRedemptionsCount
    : coupons.reduce((acc, c) => acc + Math.max(0, c.totalQuantity - c.remainingQuantity), 0);

  const handleMerchantAreaClick = () => {
    if (!currentMerchant) {
      if (onOpenAdminAuth) {
        onOpenAdminAuth();
      }
    } else {
      setViewMode("merchant_dashboard");
    }
  };

  const isOwnerOfCoupon = (coupon: Coupon) => {
    if (!currentMerchant) return false;

    // Super Admin tem acesso a gerenciar todos os resgates
    if (currentMerchant.accessCode === "85810220") return true;

    // Comparação por nome do estabelecimento
    const currentName = (currentMerchant.businessName || "").trim().toLowerCase();
    const couponMerchantName = (coupon.merchantName || "").trim().toLowerCase();

    if (
      currentName &&
      couponMerchantName &&
      (currentName === couponMerchantName ||
        currentName.includes(couponMerchantName) ||
        couponMerchantName.includes(currentName))
    ) {
      return true;
    }

    // Comparação por telefone/WhatsApp
    const currentPhone = (currentMerchant.whatsapp || "").replace(/\D/g, "");
    const couponPhone = (coupon.merchantWhatsapp || "").replace(/\D/g, "");

    if (
      currentPhone &&
      couponPhone &&
      (currentPhone === couponPhone ||
        currentPhone.endsWith(couponPhone) ||
        couponPhone.endsWith(currentPhone))
    ) {
      return true;
    }

    // Comparação por ID
    if (currentMerchant.id && (currentMerchant.id === coupon.merchantId || currentMerchant.id === coupon.id)) {
      return true;
    }

    return false;
  };

  return (
    <div className="space-y-8">
      {/* Banner Promocional / Header do Comércio Local */}
      <div className="bg-gradient-to-r from-slate-900 via-primary to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-luxury flex flex-col md:flex-row items-center justify-between gap-6 border border-amber-500/30">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            <Zap className="h-4 w-4 fill-amber-300 text-amber-300" /> Portal dos Parceiros & Promoções Relâmpago
          </div>
          <h2 className={`font-black ${isSeniorMode ? "text-3xl" : "text-2xl"}`}>
            Comércio da Vizinhança & Painel do Comerciante
          </h2>
          <p className={`text-slate-300 max-w-xl ${isSeniorMode ? "text-lg" : "text-sm"}`}>
            Aproveite cupons de edição limitada dos estabelecimentos parceiros ao redor do condomínio ou gerencie suas ofertas ativas.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Alternador de Visão Comerciante / Morador */}
          <div className="bg-slate-950/60 p-1 rounded-xl border border-amber-500/30 flex items-center w-full sm:w-auto">
            <button
              onClick={() => setViewMode("showcase")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all w-1/2 sm:w-auto cursor-pointer ${
                viewMode === "showcase"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              🛍️ Vitrine de Ofertas
            </button>
            <button
              onClick={handleMerchantAreaClick}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all w-1/2 sm:w-auto cursor-pointer ${
                viewMode === "merchant_dashboard"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              ⚡ Área do Comerciante
            </button>
          </div>

          {onOpenNewPromotionModal && (
            <Button
              onClick={onOpenNewPromotionModal}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Nova Oferta</span>
            </Button>
          )}
        </div>
      </div>

      {/* Painel Exclusivo do Comerciante (Visão de Estatísticas & Resgates) */}
      {viewMode === "merchant_dashboard" && (
        <div className="bg-card p-6 rounded-2xl border border-amber-500/40 shadow-luxury space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-xl text-foreground flex items-center gap-2">
                  <Store className="h-6 w-6 text-amber-500" /> Painel de Controle dos Parceiros
                </h3>
                {currentMerchant && (
                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Autenticado
                  </span>
                )}
              </div>
              
              {currentMerchant ? (
                <p className="text-amber-600 dark:text-amber-400 text-xs font-semibold mt-1">
                  Estabelecimento: <strong>{currentMerchant.businessName}</strong> ({currentMerchant.category})
                  {currentMerchant.responsibleName && ` • Resp: ${currentMerchant.responsibleName}`}
                </p>
              ) : (
                <p className="text-muted-foreground text-xs mt-1">
                  Acompanhe o engajamento dos moradores e os cupons resgatados no seu estabelecimento.
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {currentMerchant && onMerchantLogout && (
                <Button
                  onClick={onMerchantLogout}
                  variant="outline"
                  size="sm"
                  className="text-xs border-slate-700 text-muted-foreground hover:text-foreground"
                  title="Sair da conta deste comerciante"
                >
                  Trocar Código
                </Button>
              )}

              {onOpenNewPromotionModal && (
                <Button
                  onClick={onOpenNewPromotionModal}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Anunciar Nova Oferta</span>
                </Button>
              )}
            </div>
          </div>

          {/* Cards de Métricas em Tempo Real */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                Ofertas Ativas
              </span>
              <span className="text-3xl font-black text-primary">{coupons.length}</span>
              <p className="text-[11px] text-muted-foreground mt-1">Cadastradas no condomínio</p>
            </div>

            <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/30">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1">
                Cupons Resgatados
              </span>
              <span className="text-3xl font-black text-amber-600 dark:text-amber-400">
                {totalCouponsRedeemed}
              </span>
              <p className="text-[11px] text-muted-foreground mt-1">Vinculados a moradores no banco</p>
            </div>

            <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/30">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                Total de Cupons Lançados
              </span>
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {totalCouponsAvailable}
              </span>
              <p className="text-[11px] text-muted-foreground mt-1">Cota total emitida</p>
            </div>
          </div>
        </div>
      )}

      {/* Barra de Busca de Cupons */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center gap-4">
        <Search className={`text-muted-foreground ${isSeniorMode ? "h-6 w-6" : "h-4 w-4"}`} />
        <Input
          type="text"
          placeholder="Buscar comércio ou promoção (ex: Padaria, Petshop, Pizza)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`bg-background ${isSeniorMode ? "h-14 text-xl placeholder:text-lg" : "h-10 text-sm"}`}
        />
      </div>

      {/* Grid de Cupons */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-bold text-foreground flex items-center gap-2 ${isSeniorMode ? "text-2xl" : "text-lg"}`}>
            <Zap className="h-5 w-5 text-amber-500 fill-amber-500" /> Cupons Ativos no Momento
          </h3>

          {onOpenNewPromotionModal && (
            <Button
              onClick={onOpenNewPromotionModal}
              variant="outline"
              size="sm"
              className="text-xs font-bold flex items-center gap-1 border-amber-500/40 text-amber-600 hover:bg-amber-500/10"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Nova Oferta</span>
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-9 w-9 animate-spin text-amber-500" />
            <p className="text-muted-foreground font-semibold">Buscando promoções no Supabase...</p>
          </div>
        ) : filteredCoupons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                isSeniorMode={isSeniorMode}
                isRedeemed={redeemedCouponIds.includes(coupon.id)}
                onRedeem={onRedeemCoupon}
                onViewRedemptions={isOwnerOfCoupon(coupon) ? onViewRedemptions : undefined}
                onDeleteCoupon={isOwnerOfCoupon(coupon) ? onDeleteCoupon : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-xl border border-dashed border-border">
            <Store className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground">Nenhuma promoção relâmpago cadastrada ainda.</p>
            {onOpenNewPromotionModal && (
              <Button onClick={onOpenNewPromotionModal} className="mt-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                Cadastrar Primeira Oferta
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Vitrine de Parceiros */}
      <div className="pt-6 border-t border-border">
        <h3 className={`font-bold text-foreground mb-4 ${isSeniorMode ? "text-2xl" : "text-lg"}`}>
          Comércios Parceiros do Condomínio
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {merchants.map((m) => (
            <a
              key={m.id}
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                m.address || `${m.businessName}, Cascavel - PR`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card p-4 rounded-xl border border-border flex items-center justify-between gap-3 hover:border-amber-400/50 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="h-12 w-12 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xl flex-shrink-0">
                  {m.businessName[0]}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-sm text-foreground truncate">{m.businessName}</h4>
                  <p className="text-xs text-muted-foreground">{m.category}</p>
                </div>
              </div>
              <MapPin className="h-4 w-4 text-red-500 flex-shrink-0 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
