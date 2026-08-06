import { useState, useEffect } from "react";
import { X, Search, Users, Smartphone, Clock, CheckCircle, ExternalLink, Loader2, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coupon, DatabaseCouponRedemption } from "./types";
import { fetchCouponRedemptionsForMerchant } from "@/lib/condoMarketService";

interface MerchantRedemptionsModalProps {
  coupon: Coupon | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MerchantRedemptionsModal({
  coupon,
  isOpen,
  onClose,
}: MerchantRedemptionsModalProps) {
  const [redemptions, setRedemptions] = useState<DatabaseCouponRedemption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen && coupon) {
      loadRedemptions();
    } else {
      setRedemptions([]);
      setSearchQuery("");
    }
  }, [isOpen, coupon]);

  const loadRedemptions = async () => {
    if (!coupon) return;
    setIsLoading(true);
    try {
      const data = await fetchCouponRedemptionsForMerchant(coupon.id);
      setRedemptions(data);
    } catch (e) {
      console.error("Erro ao carregar resgates do cupom:", e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !coupon) return null;

  const filteredRedemptions = redemptions.filter(
    (r) =>
      r.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.residentPhone.includes(searchQuery) ||
      r.residentUnit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.residentBlock && r.residentBlock.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-slate-900 via-primary to-slate-900 p-5 text-white flex items-center justify-between shrink-0 border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                  {coupon.discountValue}
                </span>
                <h3 className="font-extrabold text-base sm:text-lg text-white truncate max-w-[280px] sm:max-w-md">
                  {coupon.title}
                </h3>
              </div>
              <p className="text-slate-300 text-xs mt-0.5">
                Resgates confirmados por moradoras e moradores do condomínio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Informações da Oferta & Estatística */}
        <div className="bg-muted/40 p-4 border-b border-border flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Store className="h-4 w-4 text-amber-500" />
            <span>{coupon.merchantName} ({coupon.merchantCategory})</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full">
              {redemptions.length} morador(es) resgataram
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Restantes: {coupon.remainingQuantity} / {coupon.totalQuantity}
            </div>
          </div>
        </div>

        {/* Corpo do Modal */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0 space-y-4">
          {/* Barra de Pesquisa */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por Nome do morador, Apto ou WhatsApp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-sm bg-background"
            />
          </div>

          {/* Lista de Moradores */}
          {isLoading ? (
            <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
              <p className="text-muted-foreground text-sm font-medium">
                Buscando resgates no banco de dados do Supabase...
              </p>
            </div>
          ) : filteredRedemptions.length > 0 ? (
            <div className="space-y-3">
              {filteredRedemptions.map((item) => {
                const cleanPhone = item.residentPhone.replace(/\D/g, "");
                const formattedDate = new Date(item.redeemedAt).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={item.id}
                    className="bg-card p-4 rounded-xl border border-border hover:border-amber-400/50 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                        {item.residentName[0]?.toUpperCase() || "M"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-foreground">{item.residentName}</h4>
                          <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded border border-green-500/20">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            Válido
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">
                          Unidade: <strong>Apto {item.residentUnit}</strong>
                          {item.residentBlock ? ` - Bloco ${item.residentBlock}` : ""}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1 font-mono">
                          <Clock className="h-3 w-3 text-amber-500" />
                          <span>Resgatado em {formattedDate}</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(
                        `Olá ${item.residentName}, vi que você resgatou o cupom "${coupon.title}" no CondoMarket! Como podemos te atender?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full sm:w-auto text-xs font-bold flex items-center justify-center gap-1.5 border-emerald-500/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10"
                      >
                        <Smartphone className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Contatar morador</span>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </a>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center border border-dashed border-border rounded-xl bg-muted/20 p-6">
              <Users className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-muted-foreground text-sm font-medium">
                {searchQuery
                  ? "Nenhum morador encontrado para a busca."
                  : "Nenhum morador resgatou esta promoção ainda."}
              </p>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="p-4 bg-muted/40 border-t border-border flex justify-end shrink-0">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
