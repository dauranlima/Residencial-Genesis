import { MessageCircle, Tag, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClassifiedItem } from "./types";

interface ClassifiedCardProps {
  item: ClassifiedItem;
  isSeniorMode: boolean;
}

export default function ClassifiedCard({ item, isSeniorMode }: ClassifiedCardProps) {
  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
  };

  const whatsappMessage = encodeURIComponent(
    `Olá ${item.sellerName}! Vi seu anúncio "${item.title}" por ${formatPrice(item.price)} no CondoMarket do condomínio e gostaria de saber se ainda está disponível.`
  );

  const whatsappUrl = `https://wa.me/55${item.whatsapp.replace(/\D/g, "")}?text=${whatsappMessage}`;

  return (
    <div
      className={`bg-card rounded-xl border border-border shadow-luxury overflow-hidden flex flex-col transition-all duration-200 hover:shadow-xl hover:border-accent/40 ${
        isSeniorMode ? "p-2 border-2 border-slate-300" : ""
      }`}
    >
      {/* Imagem do Produto */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <img
          src={item.images[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=60"}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <span className="absolute top-3 left-3 bg-primary/90 text-primary-foreground backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow">
          <Tag className="h-3 w-3" />
          {item.category}
        </span>
        <span className="absolute bottom-3 right-3 bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg shadow-md text-base">
          {formatPrice(item.price)}
        </span>
      </div>

      {/* Conteúdo */}
      <div className={`p-5 flex-1 flex flex-col justify-between ${isSeniorMode ? "p-6" : ""}`}>
        <div>
          <h3
            className={`font-bold text-card-foreground line-clamp-1 mb-2 ${
              isSeniorMode ? "text-2xl" : "text-lg"
            }`}
          >
            {item.title}
          </h3>
          <p
            className={`text-muted-foreground line-clamp-2 mb-4 ${
              isSeniorMode ? "text-lg leading-relaxed" : "text-sm"
            }`}
          >
            {item.description}
          </p>
        </div>

        <div>
          {/* Informações do Vendedor / Vizinho */}
          <div className="flex items-center justify-between border-t border-border pt-3 mb-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <MapPin className={`text-accent ${isSeniorMode ? "h-5 w-5" : "h-3.5 w-3.5"}`} />
              <span className={isSeniorMode ? "text-base font-bold" : "text-xs"}>
                Vizinho: {item.sellerName} ({item.sellerBlock ? `Bloco ${item.sellerBlock} - ` : ""}Apto {item.sellerUnit})
              </span>
            </div>
          </div>

          {/* Botão WhatsApp */}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full block">
            <Button
              className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 shadow-md transition-all ${
                isSeniorMode ? "py-6 text-xl rounded-xl" : "py-2.5 text-sm"
              }`}
            >
              <MessageCircle className={isSeniorMode ? "h-7 w-7" : "h-4 w-4"} />
              <span>Falar com Vizinho (WhatsApp)</span>
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
