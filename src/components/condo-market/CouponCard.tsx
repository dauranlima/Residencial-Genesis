import { useState, useEffect } from "react";
import { Clock, Ticket, Flame, Store, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Coupon } from "./types";

interface CouponCardProps {
  coupon: Coupon;
  isSeniorMode: boolean;
  onRedeem: (coupon: Coupon) => void;
}

export default function CouponCard({ coupon, isSeniorMode, onRedeem }: CouponCardProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(coupon.expiresAt).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [coupon.expiresAt]);

  const percentLeft = Math.round((coupon.remainingQuantity / coupon.totalQuantity) * 100);
  const isUrgent = coupon.remainingQuantity <= 3;

  return (
    <div
      className={`bg-card rounded-2xl border border-border shadow-luxury overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:border-amber-400/50 ${
        isSeniorMode ? "p-2 border-2 border-amber-500/40" : ""
      }`}
    >
      <div>
        {/* Top Banner com Categoria & Status Relâmpago */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 text-slate-950 flex items-center justify-between font-bold">
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            <span className={isSeniorMode ? "text-xl" : "text-sm"}>{coupon.merchantName}</span>
          </div>
          <span className="bg-slate-950/20 backdrop-blur-md px-2.5 py-1 rounded-full text-xs uppercase tracking-wider">
            {coupon.merchantCategory}
          </span>
        </div>

        {/* Conteúdo Principal */}
        <div className={`p-6 ${isSeniorMode ? "p-8" : ""}`}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className={`font-extrabold text-foreground ${isSeniorMode ? "text-2xl" : "text-xl"}`}>
              {coupon.title}
            </h3>
            <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold px-3 py-1 rounded-lg text-lg border border-amber-500/20 whitespace-nowrap">
              {coupon.discountValue}
            </span>
          </div>

          <p className={`text-muted-foreground mb-6 ${isSeniorMode ? "text-lg leading-relaxed" : "text-sm"}`}>
            {coupon.description}
          </p>

          {/* Medidor de Quantidade Restante */}
          <div className="mb-5 space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className={isUrgent ? "text-red-500 flex items-center gap-1" : "text-muted-foreground"}>
                {isUrgent && <Flame className="h-4 w-4 animate-bounce text-red-500" />}
                Apenas {coupon.remainingQuantity} cupons restantes!
              </span>
              <span className="text-muted-foreground">
                {coupon.remainingQuantity} / {coupon.totalQuantity}
              </span>
            </div>
            <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isUrgent ? "bg-red-500 animate-pulse" : "bg-amber-500"
                }`}
                style={{ width: `${percentLeft}%` }}
              />
            </div>
          </div>

          {/* Temporizador Regressivo */}
          <div className="bg-muted/60 p-3 rounded-xl flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4 text-amber-500" />
              Expira em:
            </span>
            <span className={`font-mono text-amber-600 dark:text-amber-400 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
              {String(timeLeft.hours).padStart(2, "0")}h {String(timeLeft.minutes).padStart(2, "0")}m {String(timeLeft.seconds).padStart(2, "0")}s
            </span>
          </div>
        </div>
      </div>

      {/* Ação de Resgate & Como Chegar */}
      <div className={`p-6 pt-0 space-y-2 ${isSeniorMode ? "p-8 pt-0 space-y-3" : ""}`}>
        <Button
          onClick={() => onRedeem(coupon)}
          disabled={coupon.remainingQuantity === 0}
          className={`w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-md transition-all ${
            isSeniorMode ? "py-6 text-xl rounded-xl" : "py-3 text-sm"
          }`}
        >
          <Ticket className={isSeniorMode ? "h-7 w-7" : "h-4 w-4"} />
          <span>{coupon.remainingQuantity > 0 ? "Resgatar Cupom Grátis" : "Cupons Esgotados"}</span>
        </Button>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            coupon.merchantAddress || `${coupon.merchantName}, Cascavel - PR`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full block"
        >
          <Button
            variant="outline"
            className={`w-full border-slate-300 text-slate-700 dark:text-slate-200 hover:bg-muted font-bold flex items-center justify-center gap-2 ${
              isSeniorMode ? "py-5 text-lg rounded-xl" : "py-2 text-xs"
            }`}
          >
            <MapPin className="h-4 w-4 text-red-500" />
            <span>Como chegar (Google Maps)</span>
          </Button>
        </a>
      </div>
    </div>
  );
}
