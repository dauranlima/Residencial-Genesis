import { useState } from "react";
import { createPortal } from "react-dom";
import { X, MessageCircle, MapPin, Tag, Calendar, ChevronLeft, ChevronRight, ShieldCheck, Eye, Share2, AlertTriangle, Pencil, RotateCcw, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClassifiedItem, ClassifiedStatus, CurrentUser } from "./types";


interface ClassifiedDetailModalProps {
  item: ClassifiedItem | null;
  isOpen: boolean;
  onClose: () => void;
  isSeniorMode: boolean;
  currentUser?: CurrentUser | null;
  onUpdateStatus?: (itemId: string, newStatus: ClassifiedStatus) => void;
  onFinalize?: () => void;
  onEdit?: (item: ClassifiedItem) => void;
}

export default function ClassifiedDetailModal({
  item,
  isOpen,
  onClose,
  isSeniorMode,
  currentUser,
  onUpdateStatus,
  onFinalize,
  onEdit,
}: ClassifiedDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false);
  const [isFullScreenImage, setIsFullScreenImage] = useState(false);

  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !item) return null;

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = `viziGO - ${item.title}`;
    const shareText = `Confira este anúncio no viziGO: "${item.title}" por ${formatPrice(item.price)}.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Compartilhamento cancelado", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
      } catch (err) {
        console.error("Erro ao copiar link", err);
      }
    }
  };

  const isOwner = !!(
    currentUser &&
    (
      (currentUser.phone && item.whatsapp && currentUser.phone.replace(/\D/g, "") === item.whatsapp.replace(/\D/g, "")) ||
      (currentUser.unit === item.sellerUnit && currentUser.name.toLowerCase() === item.sellerName.toLowerCase())
    )
  );

  const images = item.images && item.images.length > 0
    ? item.images
    : ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=60"];

  const formatPrice = (val: number) => {
    if (val === 0) return "🎁 Doação (Grátis)";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Recente";
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Olá ${item.sellerName}! Vi seu anúncio "${item.title}" por ${formatPrice(item.price)} no viziGO do condomínio e gostaria de ver mais detalhes ou negociar.`
  );

  const whatsappUrl = `https://wa.me/55${item.whatsapp.replace(/\D/g, "")}?text=${whatsappMessage}`;

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleConfirmFinalize = () => {
    setShowFinalizeConfirm(false);
    if (onFinalize) onFinalize();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div
        className={`bg-card w-full max-w-3xl rounded-2xl shadow-2xl border border-border overflow-hidden my-auto max-h-[92vh] flex flex-col ${
          isSeniorMode ? "border-2 border-primary" : ""
        }`}
      >
        {/* Cabeçalho */}
        <div className="bg-primary px-4 sm:px-6 py-4 text-primary-foreground flex flex-wrap items-center justify-between gap-3 sticky top-0 z-10 shadow-md shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {item.category}
            </span>
            <span className="text-xs text-primary-foreground/70 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(item.createdAt)}
            </span>
          </div>

          {/* Botões de Ação para o Proprietário + Botão Fechar */}
          <div className="flex items-center gap-2">
            {isOwner && (
              <div className="flex items-center gap-1.5 border border-amber-500/60 p-1 rounded-lg bg-slate-900/80 backdrop-blur-sm">
                {item.status === "sold" || item.status === "cancelled" ? (
                  <button
                    type="button"
                    onClick={() => onUpdateStatus && onUpdateStatus(item.id, "available")}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5 border border-emerald-400"
                    title="Reativar anúncio para exibir novamente no Desapego dos Vizinhos"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>ANUNCIAR NOVAMENTE</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => onUpdateStatus && onUpdateStatus(item.id, "cancelled")}
                      className="px-2.5 py-1 bg-red-700/90 hover:bg-red-800 text-white font-bold text-xs uppercase rounded transition-all border border-red-500/50 cursor-pointer"
                    >
                      CANCELAR
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const nextStatus = item.status === "reserved" ? "available" : "reserved";
                        if (onUpdateStatus) onUpdateStatus(item.id, nextStatus);
                      }}
                      className={`px-2.5 py-1 font-bold text-xs uppercase rounded transition-all border cursor-pointer ${
                        item.status === "reserved"
                          ? "bg-amber-500 text-slate-950 border-amber-400 font-extrabold"
                          : "bg-blue-600 hover:bg-blue-700 text-white border-blue-400"
                      }`}
                    >
                      {item.status === "reserved" ? "REMOVER RESERVA" : "RESERVAR"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowFinalizeConfirm(true)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white border border-amber-400 font-black text-xs uppercase tracking-wider rounded transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      FINALIZAR
                    </button>
                  </>
                )}
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-primary-foreground/10 transition-colors text-primary-foreground/90 hover:text-primary-foreground"
              aria-label="Fechar detalhes"
            >
              <X className={isSeniorMode ? "h-8 w-8" : "h-6 w-6"} />
            </button>
          </div>
        </div>

        {/* Conteúdo rolável */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 min-h-0">
          {/* Galeria de Fotos */}
          <div className="space-y-3">
            <div
              onClick={() => setIsFullScreenImage(true)}
              className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 shadow-inner group cursor-zoom-in"
              title="Clique para expandir a foto em tela cheia"
            >
              <img
                src={images[activeImageIndex]}
                alt={`${item.title} - Foto ${activeImageIndex + 1}`}
                className="w-full h-full object-contain bg-black/40 transition-transform duration-300 group-hover:scale-[1.02]"
              />

              {/* Ícone Indicador de Tela Cheia */}
              <div className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 text-white px-2.5 py-1.5 rounded-lg opacity-90 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-xs font-semibold shadow-md pointer-events-none">
                <Maximize2 className="h-4 w-4 text-amber-300" />
                <span className="hidden sm:inline">Ver em tela cheia</span>
              </div>

              {/* Botões de Navegação da Galeria */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors shadow-lg cursor-pointer"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors shadow-lg cursor-pointer"
                    aria-label="Próxima foto"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  <span className="absolute bottom-3 left-3 bg-black/75 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {activeImageIndex + 1} de {images.length} fotos
                  </span>
                </>
              )}

              {/* Preço em Destaque na Imagem */}
              <div className="absolute bottom-3 right-3 bg-emerald-600 text-white font-extrabold px-4 py-2 rounded-xl shadow-lg text-xl sm:text-2xl pointer-events-none">
                {formatPrice(item.price)}
              </div>
            </div>

            {/* Thumbnails (quando há mais de 1 foto) */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImageIndex === idx
                        ? "border-primary ring-2 ring-primary/40 scale-105"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Título e Informações Principais */}
          <div>
            <h2 className={`font-black text-foreground mb-2 ${isSeniorMode ? "text-3xl" : "text-2xl"}`}>
              {item.title}
            </h2>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="h-4 w-4" /> Anúncio Verificado do Condomínio
              </span>
            </div>
          </div>

          {/* Descrição Completa */}
          <div className="bg-muted/40 p-4 sm:p-5 rounded-xl border border-border/60">
            <h3 className={`font-bold text-foreground mb-2 flex items-center gap-2 ${isSeniorMode ? "text-xl" : "text-base"}`}>
              <Eye className="h-4 w-4 text-primary" /> Descrição Completa
            </h3>
            <p className={`text-muted-foreground whitespace-pre-line leading-relaxed ${isSeniorMode ? "text-xl leading-loose" : "text-sm sm:text-base"}`}>
              {item.description}
            </p>
          </div>

          {/* Card do Vendedor / Vizinho */}
          <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-primary/20">
                {item.sellerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Anunciante (Vizinho)</span>
                <h4 className={`font-bold text-foreground ${isSeniorMode ? "text-2xl" : "text-lg"}`}>
                  {item.sellerName}
                </h4>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium text-xs sm:text-sm mt-0.5">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span>{item.sellerBlock ? `Bloco ${item.sellerBlock} - ` : ""}Apartamento {item.sellerUnit}</span>
                </div>
              </div>
            </div>

            <div className="text-right w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
              <span className="text-xs text-muted-foreground block mb-1">Contato direto</span>
              <span className="text-sm font-bold text-foreground bg-muted px-3 py-1 rounded-md inline-block">
                {item.whatsapp}
              </span>
            </div>
          </div>
        </div>

        {/* Rodapé fixo com Ações */}
        <div className="p-3 sm:p-4 bg-muted/30 border-t border-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className={`flex-1 sm:flex-initial font-semibold ${isSeniorMode ? "h-14 text-lg px-6" : "h-10 sm:h-11 px-4 text-xs sm:text-sm"}`}
            >
              Voltar para lista
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={handleShare}
              className={`flex-1 sm:flex-initial font-bold flex items-center justify-center gap-2 border border-border shadow-sm cursor-pointer ${
                isSeniorMode ? "h-14 text-lg px-6" : "h-10 sm:h-11 px-4 text-xs sm:text-sm"
              }`}
            >
              <Share2 className={isSeniorMode ? "h-6 w-6" : "h-4 w-4"} />
              <span>{copiedLink ? "Link Copiado!" : "Compartilhar"}</span>
            </Button>

            {isOwner && onEdit && (
              <Button
                type="button"
                onClick={() => onEdit(item)}
                className={`flex-1 sm:flex-initial bg-amber-500 hover:bg-amber-600 text-slate-950 font-black flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer border border-amber-400 ${
                  isSeniorMode ? "h-14 text-lg px-6" : "h-10 sm:h-11 px-4 text-xs sm:text-sm"
                }`}
              >
                <Pencil className={isSeniorMode ? "h-6 w-6" : "h-4 w-4"} />
                <span>Editar Anúncio</span>
              </Button>
            )}
          </div>

          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto shrink-0">
            <Button
              className={`w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 shadow-md transition-all ${
                isSeniorMode ? "h-16 text-xl px-8 rounded-xl" : "h-11 sm:h-12 text-xs sm:text-sm px-5"
              }`}
            >
              <MessageCircle className={isSeniorMode ? "h-7 w-7" : "h-5 w-5"} />
              <span>Falar com Vizinho no WhatsApp</span>
            </Button>
          </a>
        </div>
      </div>


      {/* Modal de Confirmação para FINALIZAR */}
      {showFinalizeConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-amber-500/40 p-6 text-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className="mx-auto w-14 h-14 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center border border-amber-500/30">
              <AlertTriangle className="h-8 w-8 text-amber-400" />
            </div>

            <h3 className="text-xl font-bold text-foreground">
              Finalizar este Anúncio?
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Deseja realmente finalizar o anúncio <strong>"{item.title}"</strong>? Ele deixará de ser exibido na aba pública <strong>'Desapego dos Vizinhos'</strong> e ficará armazenado apenas na sua aba <strong>'Meus Anúncios'</strong>.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setShowFinalizeConfirm(false)}
                className="font-bold flex-1"
              >
                Não, Voltar
              </Button>

              <Button
                type="button"
                onClick={handleConfirmFinalize}
                className="bg-red-600 hover:bg-red-700 text-white font-bold flex-1 shadow-md cursor-pointer"
              >
                Sim, Finalizar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal / Overlay de Foto em Tela Cheia via Portal */}
      {isFullScreenImage && createPortal(
        <div
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsFullScreenImage(false)}
        >
          {/* Topo do Fullscreen com Título e Botão Fechar em Destaque */}
          <div className="w-full flex items-center justify-between pt-2 sm:pt-4 px-2 z-[999999] shrink-0" onClick={(e) => e.stopPropagation()}>
            <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[65%]">
              {item.title} ({activeImageIndex + 1} de {images.length})
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsFullScreenImage(false);
              }}
              className="bg-slate-900/90 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-full shadow-2xl border border-white/20 flex items-center gap-1.5 text-xs cursor-pointer transition-all active:scale-95 shrink-0"
              aria-label="Fechar tela cheia"
            >
              <X className="w-4 h-4 text-red-400" />
              <span>Fechar</span>
            </button>
          </div>

          {/* Imagem Centralizada */}
          <div className="relative flex-1 flex items-center justify-center my-2 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[activeImageIndex]}
              alt={item.title}
              className="max-h-[75vh] max-w-[95vw] object-contain rounded-xl shadow-2xl select-none"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-white p-3.5 sm:p-4 rounded-full transition-all shadow-2xl border border-white/20 cursor-pointer z-[999999] active:scale-90"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="h-7 w-7 sm:h-8 sm:w-8 pointer-events-none" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-white p-3.5 sm:p-4 rounded-full transition-all shadow-2xl border border-white/20 cursor-pointer z-[999999] active:scale-90"
                  aria-label="Próxima foto"
                >
                  <ChevronRight className="h-7 w-7 sm:h-8 sm:w-8 pointer-events-none" />
                </button>
              </>
            )}
          </div>

          {/* Rodapé / Miniaturas no Fullscreen */}
          {images.length > 1 && (
            <div className="flex justify-center gap-2 overflow-x-auto py-2 z-[999999] shrink-0" onClick={(e) => e.stopPropagation()}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveImageIndex(idx);
                  }}
                  className={`w-14 h-11 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                    activeImageIndex === idx ? "border-amber-400 scale-110 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover pointer-events-none" />
                </button>
              ))}
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}

