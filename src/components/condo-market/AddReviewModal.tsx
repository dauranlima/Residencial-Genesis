import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Loader2 } from "lucide-react";
import { ResidentServiceProfile, CurrentUser } from "./types";
import { addServiceReviewInSupabase } from "@/lib/residentServicesService";
import { toast } from "sonner";

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ResidentServiceProfile | null;
  currentUser: CurrentUser | null;
  onSuccess: (updatedProfile: ResidentServiceProfile) => void;
}

export default function AddReviewModal({
  isOpen,
  onClose,
  profile,
  currentUser,
  onSuccess,
}: AddReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [authorName, setAuthorName] = useState(currentUser?.name || "");
  const [authorBlock, setAuthorBlock] = useState(currentUser?.block || "");
  const [authorUnit, setAuthorUnit] = useState(currentUser?.unit || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!profile) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authorName.trim() || !authorUnit.trim()) {
      toast.error("Informe seu nome e apartamento.");
      return;
    }

    if (!comment.trim()) {
      toast.error("Por favor, digite um pequeno comentário sobre a sua experiência.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { newRating, newReviewCount } = await addServiceReviewInSupabase(profile.id, {
        authorName,
        authorBlock,
        authorUnit,
        rating,
        comment,
      });

      toast.success("Sua avaliação foi enviada com sucesso! Obrigado.");
      onSuccess({
        ...profile,
        rating: newRating,
        reviewCount: newReviewCount,
      });
      onClose();
      setComment("");
    } catch (err: any) {
      toast.error("Erro ao enviar avaliação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6 rounded-2xl bg-white text-slate-900 border-0 shadow-2xl">
        <DialogHeader className="pb-3 border-b border-slate-100">
          <DialogTitle className="text-xl font-extrabold text-slate-900">
            Como foi sua experiência?
          </DialogTitle>
          <p className="text-xs text-slate-500 mt-1">
            Avalie o trabalho prestado por <strong className="text-slate-800">{profile.residentName}</strong> ({profile.profession}).
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Seletor Interativo de 1 a 5 Estrelas */}
          <div className="flex flex-col items-center justify-center bg-amber-50/60 border border-amber-200/60 p-4 rounded-xl space-y-2">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Sua Nota</span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating)
                        ? "fill-amber-400 text-amber-500"
                        : "text-slate-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-semibold text-amber-800">
              {rating === 5 && "⭐⭐⭐⭐⭐ Excelente! Recomendo aos vizinhos"}
              {rating === 4 && "⭐⭐⭐⭐ Muito bom!"}
              {rating === 3 && "⭐⭐⭐ Bom"}
              {rating === 2 && "⭐⭐ Regular"}
              {rating === 1 && "⭐ Ruim"}
            </span>
          </div>

          {/* Dados do Morador Avaliador */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs font-semibold text-slate-600">Seu Nome</Label>
              <Input
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Ex: João Souza"
                className="mt-1 h-9 rounded-lg"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-600">Torre / Apt *</Label>
              <Input
                value={authorUnit}
                onChange={(e) => setAuthorUnit(e.target.value)}
                placeholder="Ex: T1 Apt 203"
                className="mt-1 h-9 rounded-lg"
              />
            </div>
          </div>

          {/* Comentário */}
          <div>
            <Label className="text-xs font-semibold text-slate-700">Seu Depoimento / Comentário *</Label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conta para os vizinhos como foi a pontualidade, qualidade do serviço e atendimento..."
              rows={3}
              className="mt-1 rounded-lg text-sm"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 rounded-xl shadow-md"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>Enviar Avaliação</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
