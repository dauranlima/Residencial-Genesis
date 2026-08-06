import { useState } from "react";
import { Store, Zap, Search, MapPin, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CouponCard from "./CouponCard";
import { Coupon, Merchant } from "./types";

interface MerchantsTabProps {
  coupons: Coupon[];
  merchants: Merchant[];
  isLoading?: boolean;
  isSeniorMode: boolean;
  onRedeemCoupon: (coupon: Coupon) => void;
  onOpenNewPromotionModal?: () => void;
}

export default function MerchantsTab({
  coupons,
  merchants,
  isLoading = false,
  isSeniorMode,
  onRedeemCoupon,
  onOpenNewPromotionModal,
}: MerchantsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCoupons = coupons.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.merchantCategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Banner Promocional do Comércio Local */}
      <div className="bg-gradient-to-r from-slate-900 via-primary to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-luxury flex flex-col md:flex-row items-center justify-between gap-6 border border-amber-500/30">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            <Zap className="h-4 w-4 fill-amber-300 text-amber-300" /> Promoções Relâmpago Exclusivas
          </div>
          <h2 className={`font-black ${isSeniorMode ? "text-3xl" : "text-2xl"}`}>
            Comércio da Vizinhança com Desconto
          </h2>
          <p className={`text-slate-300 max-w-xl ${isSeniorMode ? "text-lg" : "text-sm"}`}>
            Aproveite cupons de edição limitada dos estabelecimentos parceiros ao redor do condomínio.
            Pegue o seu e apresente no estabelecimento!
          </p>
        </div>

        {onOpenNewPromotionModal && (
          <Button
            onClick={onOpenNewPromotionModal}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center gap-2 shadow-lg"
          >
            <Plus className="h-4 w-4" />
            <span>Anunciar Oferta</span>
          </Button>
        )}
      </div>

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
                onRedeem={onRedeemCoupon}
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
