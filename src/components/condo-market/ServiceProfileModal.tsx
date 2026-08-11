import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, CreditCard, Award, MessageCircle, X, ChevronLeft, ChevronRight, UserCheck, PlusCircle, Maximize2 } from "lucide-react";
import { ResidentServiceProfile, ServiceReview } from "./types";
import { fetchServiceReviewsFromSupabase } from "@/lib/residentServicesService";

interface ServiceProfileModalProps {
  profile: ResidentServiceProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenReviewModal: (profile: ResidentServiceProfile) => void;
}

export default function ServiceProfileModal({
  profile,
  isOpen,
  onClose,
  onOpenReviewModal,
}: ServiceProfileModalProps) {
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [isFullScreenImage, setIsFullScreenImage] = useState(false);

  useEffect(() => {
    if (profile && isOpen) {
      setActiveImageIndex(0);
      setIsLoadingReviews(true);
      fetchServiceReviewsFromSupabase(profile.id)
        .then((res) => setReviews(res))
        .finally(() => setIsLoadingReviews(false));
    }
  }, [profile, isOpen]);

  if (!profile) return null;

  const handleOpenWhatsApp = () => {
    const rawPhone = profile.whatsapp.replace(/\D/g, "");
    const formattedPhone = rawPhone.startsWith("55") ? rawPhone : `55${rawPhone}`;
    const text = encodeURIComponent(
      `Olá ${profile.residentName}! Vi seu perfil de *${profile.profession}* na Central de Serviços do Condomínio (${profile.residentBlock ? profile.residentBlock + ' - ' : ''}${profile.residentUnit}) e gostaria de solicitar um orçamento!`
    );
    window.open(`https://wa.me/${formattedPhone}?text=${text}`, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl bg-white text-slate-900 border-0 shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 flex flex-row items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-20">
          <div>
            <DialogTitle className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <span>{profile.residentName}</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
                {profile.profession}
              </span>
            </DialogTitle>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                {profile.residentBlock ? `${profile.residentBlock} • ` : ''}{profile.residentUnit}
              </span>
            </p>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Galeria de Fotos / Portfólio */}
          {profile.images && profile.images.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                📷 Portfólio e Fotos do Trabalho
              </h4>
              <div
                onClick={() => setIsFullScreenImage(true)}
                className="relative w-full h-72 rounded-2xl overflow-hidden bg-slate-900 group cursor-zoom-in shadow-inner"
                title="Clique para ver a imagem em tela cheia"
              >
                <img
                  src={profile.images[activeImageIndex]}
                  alt={`Portfólio ${activeImageIndex + 1}`}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                />

                {/* Ícone Indicador de Tela Cheia */}
                <div className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 text-white px-2.5 py-1.5 rounded-lg opacity-90 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-xs font-semibold shadow-md pointer-events-none z-10">
                  <Maximize2 className="h-4 w-4 text-emerald-400" />
                  <span className="hidden sm:inline">Ver em tela cheia</span>
                </div>

                {profile.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex((prev) =>
                          prev === 0 ? profile.images.length - 1 : prev - 1
                        );
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-all z-10"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex((prev) =>
                          prev === profile.images.length - 1 ? 0 : prev + 1
                        );
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-all z-10"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>


              {/* Miniaturas de navegação */}
              {profile.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {profile.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx
                          ? "border-emerald-600 ring-2 ring-emerald-500/30 scale-105"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Cards de Resumo e Preço */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-emerald-50/80 border border-emerald-200/70 p-4 rounded-xl">
              <span className="text-xs text-emerald-700 font-semibold block mb-1">Preço Inicial</span>
              <span className="text-2xl font-extrabold text-emerald-800">
                A partir de R$ {profile.startingPrice.toFixed(0)}
              </span>
            </div>

            <div className="bg-amber-50/80 border border-amber-200/70 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-700 font-semibold block mb-1">Reputação do Vizinho</span>
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-500 shrink-0" />
                  <span className="text-2xl font-extrabold text-amber-900">
                    {profile.rating.toFixed(1)}
                  </span>
                </div>
              </div>
              <span className="text-xs text-amber-800 font-medium bg-amber-200/60 px-2.5 py-1 rounded-lg">
                {profile.reviewCount} avaliações
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <span className="text-xs text-slate-500 font-semibold block mb-1">Horário de Atendimento</span>
              <p className="text-sm font-medium text-slate-800 line-clamp-2">
                {profile.workHours || "A combinar com o morador"}
              </p>
            </div>
          </div>

          {/* Especialidade e Descrição */}
          <div className="space-y-3">
            {profile.specialty && (
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-sm font-bold text-slate-900">Especialidade:</span>
                <span className="text-sm text-slate-700">{profile.specialty}</span>
              </div>
            )}

            {profile.experience && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-sm font-bold text-slate-900">Experiência:</span>
                <span className="text-sm text-slate-700">{profile.experience}</span>
              </div>
            )}

            <div className="pt-2">
              <h4 className="text-sm font-bold text-slate-900 mb-1.5">Sobre o Serviço</h4>
              <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {profile.description}
              </p>
            </div>
          </div>

          {/* Formas de Pagamento */}
          {profile.paymentMethods && profile.paymentMethods.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                Formas de Pagamento Aceitas
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.paymentMethods.map((method, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200"
                  >
                    💳 {method}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Seção de Avaliações */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>Avaliações de Vizinhos</span>
                  <span className="text-sm font-normal text-slate-500">
                    ({profile.reviewCount})
                  </span>
                </h3>
                <p className="text-xs text-slate-500">Depoimentos reais de quem mora no condomínio</p>
              </div>

              <Button
                onClick={() => onOpenReviewModal(profile)}
                variant="outline"
                className="border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>Avaliar profissional</span>
              </Button>
            </div>

            {isLoadingReviews ? (
              <div className="text-center py-6 text-slate-400 text-sm">Carregando avaliações...</div>
            ) : reviews.length === 0 ? (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-500">
                <p className="text-sm">Ainda não há avaliações para este profissional.</p>
                <p className="text-xs text-slate-400 mt-1">Se você contratou este serviço, seja o primeiro a deixar sua nota!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-slate-50/80 border border-slate-200/80 p-3.5 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">
                        {rev.authorName} ({rev.authorBlock ? `${rev.authorBlock} • ` : ''}{rev.authorUnit})
                      </span>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= rev.rating
                                ? "fill-amber-400 text-amber-500"
                                : "text-slate-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">{rev.comment}</p>
                    <span className="text-[10px] text-slate-400 block pt-0.5">
                      {new Date(rev.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Button Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 sticky bottom-0 z-20 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Contato direto sem taxas</span>
            <span className="text-xs font-semibold text-emerald-700">{profile.whatsapp}</span>
          </div>

          <Button
            onClick={handleOpenWhatsApp}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all scale-100 hover:scale-[1.02]"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Solicitar orçamento via WhatsApp</span>
          </Button>
        </div>
      </DialogContent>

      {/* Modal / Overlay de Foto em Tela Cheia */}
      {isFullScreenImage && profile.images && profile.images.length > 0 && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsFullScreenImage(false)}
        >
          {/* Cabeçalho do Fullscreen */}
          <div className="flex items-center justify-between text-white z-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold truncate max-w-[80%]">
                {profile.residentName} - {profile.profession} ({activeImageIndex + 1} / {profile.images.length})
              </span>
            </div>
            <button
              onClick={() => setIsFullScreenImage(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Fechar tela cheia"
            >
              <X className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>
          </div>

          {/* Imagem Centralizada em Tela Cheia */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <img
              src={profile.images[activeImageIndex]}
              alt={`Portfólio ${activeImageIndex + 1}`}
              className="max-h-[85vh] max-w-[95vw] object-contain rounded-lg shadow-2xl select-none"
            />

            {profile.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev === 0 ? profile.images.length - 1 : prev - 1));
                  }}
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black text-white p-3 sm:p-4 rounded-full transition-all shadow-2xl border border-white/20 cursor-pointer"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev === profile.images.length - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black text-white p-3 sm:p-4 rounded-full transition-all shadow-2xl border border-white/20 cursor-pointer"
                  aria-label="Próxima foto"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}
          </div>

          {/* Rodapé / Miniaturas no Fullscreen */}
          {profile.images.length > 1 && (
            <div className="flex justify-center gap-2 overflow-x-auto py-2 z-10" onClick={(e) => e.stopPropagation()}>
              {profile.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-12 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                    activeImageIndex === idx ? "border-emerald-400 scale-110" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </Dialog>
  );
}

