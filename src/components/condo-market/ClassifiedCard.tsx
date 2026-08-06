import { MessageCircle, Tag, MapPin, Eye, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClassifiedItem, ClassifiedStatus, CurrentUser } from "./types";

interface ClassifiedCardProps {
  item: ClassifiedItem;
  isSeniorMode: boolean;
  onSelectItem?: (item: ClassifiedItem) => void;
  currentUser?: CurrentUser | null;
  onUpdateStatus?: (itemId: string, newStatus: ClassifiedStatus) => void;
}

export default function ClassifiedCard({
  item,
  isSeniorMode,
  onSelectItem,
  currentUser,
  onUpdateStatus,
}: ClassifiedCardProps) {
  const isOwner = !!(
    currentUser &&
    (
      (currentUser.phone && item.whatsapp && currentUser.phone.replace(/\D/g, "") === item.whatsapp.replace(/\D/g, "")) ||
      (currentUser.unit === item.sellerUnit && currentUser.name.toLowerCase() === item.sellerName.toLowerCase())
    )
  );

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
  };

  const whatsappMessage = encodeURIComponent(
    `Olá ${item.sellerName}! Vi seu anúncio "${item.title}" por ${formatPrice(item.price)} no viziGO do condomínio e gostaria de saber se ainda está disponível.`
  );

  const whatsappUrl = `https://wa.me/55${item.whatsapp.replace(/\D/g, "")}?text=${whatsappMessage}`;

  return (
    <div
      className={`bg-card rounded-xl border border-border shadow-luxury overflow-hidden flex flex-col transition-all duration-200 hover:shadow-xl hover:border-accent/40 ${
        isSeniorMode ? "p-2 border-2 border-slate-300" : ""
      }`}
    >
      {/* Imagem do Produto */}
      <div 
        onClick={() => onSelectItem && onSelectItem(item)}
        className="relative aspect-video w-full overflow-hidden bg-muted cursor-pointer group"
      >
        <img
          src={item.images[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=60"}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          <span className="bg-primary/90 text-primary-foreground backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow">
            <Tag className="h-3 w-3" />
            {item.category}
          </span>
          {item.status === "reserved" && (
            <span className="bg-amber-500 text-slate-950 font-black px-3 py-1 rounded-full text-xs uppercase tracking-wide shadow-md animate-pulse">
              (RESERVADO)
            </span>
          )}
          {item.status === "sold" && (
            <span className="bg-slate-900/90 text-emerald-400 border border-emerald-500/40 font-black px-3 py-1 rounded-full text-xs uppercase tracking-wide shadow-md">
              (VENDIDO)
            </span>
          )}
          {item.status === "cancelled" && (
            <span className="bg-red-600 text-white font-black px-3 py-1 rounded-full text-xs uppercase tracking-wide shadow-md">
              (CANCELADO)
            </span>
          )}
        </div>
        {item.images && item.images.length > 1 && (
          <span className="absolute top-3 right-3 bg-black/70 text-white backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {item.images.length} fotos
          </span>
        )}
        <span className="absolute bottom-3 right-3 bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg shadow-md text-base">
          {formatPrice(item.price)}
        </span>
      </div>

      {/* Conteúdo */}
      <div className={`p-5 flex-1 flex flex-col justify-between ${isSeniorMode ? "p-6" : ""}`}>
        <div>
          <h3
            onClick={() => onSelectItem && onSelectItem(item)}
            className={`font-bold text-card-foreground line-clamp-1 mb-2 cursor-pointer hover:text-primary transition-colors ${
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
          {/* Informações do Vendedor / Vizinho & Botão Ver Mais */}
          <div className="flex items-center justify-between border-t border-border pt-3 mb-3 text-xs text-muted-foreground gap-2">
            <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300 truncate">
              <MapPin className={`text-accent shrink-0 ${isSeniorMode ? "h-5 w-5" : "h-3.5 w-3.5"}`} />
              <span className={`truncate ${isSeniorMode ? "text-base font-bold" : "text-xs"}`}>
                Vizinho: {item.sellerName} ({item.sellerBlock ? `Bloco ${item.sellerBlock} - ` : ""}Apto {item.sellerUnit})
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectItem && onSelectItem(item)}
              className={`shrink-0 font-bold border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground flex items-center gap-1 transition-all shadow-sm ${
                isSeniorMode ? "h-11 text-base px-4" : "h-8 text-xs px-3"
              }`}
            >
              <Eye className={isSeniorMode ? "h-4 w-4" : "h-3.5 w-3.5"} />
              Ver mais
            </Button>
          </div>

          {/* Se o anúncio for do morador e estiver vendido/cancelado, exibir o botão Anunciar Novamente no Card */}
          {isOwner && (item.status === "sold" || item.status === "cancelled") && onUpdateStatus ? (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onUpdateStatus(item.id, "available");
              }}
              className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer border border-emerald-400 ${
                isSeniorMode ? "py-6 text-xl rounded-xl" : "py-2.5 text-sm"
              }`}
            >
              <RotateCcw className={isSeniorMode ? "h-7 w-7" : "h-4 w-4"} />
              <span>Anunciar novamente</span>
            </Button>
          ) : (
            /* Botão WhatsApp */
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
          )}
        </div>
      </div>
    </div>
  );
}


