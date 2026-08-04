import { useState } from "react";
import { Store, Zap, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import CouponCard from "./CouponCard";
import { Coupon, Merchant } from "./types";

interface MerchantsTabProps {
  coupons: Coupon[];
  merchants: Merchant[];
  isSeniorMode: boolean;
  onRedeemCoupon: (coupon: Coupon) => void;
}

export default function MerchantsTab({
  coupons,
  merchants,
  isSeniorMode,
  onRedeemCoupon,
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
        <h3 className={`font-bold text-foreground mb-4 flex items-center gap-2 ${isSeniorMode ? "text-2xl" : "text-lg"}`}>
          <Zap className="h-5 w-5 text-amber-500 fill-amber-500" /> Cupons Ativos no Momento
        </h3>
        {filteredCoupons.length > 0 ? (
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
            <p className="text-muted-foreground">Nenhuma promoção relâmpago encontrada para esta busca.</p>
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
            <div
              key={m.id}
              className="bg-card p-4 rounded-xl border border-border flex items-center gap-3 hover:border-amber-400/50 transition-colors"
            >
              <div className="h-12 w-12 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xl flex-shrink-0">
                {m.businessName[0]}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-bold text-sm text-foreground truncate">{m.businessName}</h4>
                <p className="text-xs text-muted-foreground">{m.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
