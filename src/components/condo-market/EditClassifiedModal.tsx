import { useState, useEffect, useRef } from "react";
import { X, Upload, CheckCircle2, ImagePlus, Trash2, Loader2, AlertCircle, Pencil, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ClassifiedItem } from "./types";
import { updateClassifiedInSupabase, deleteClassifiedInSupabase } from "@/lib/condoMarketService";
import { toast } from "sonner";

import { CLASSIFIED_CATEGORIES_DATA, CATEGORIES } from "./categories";

export { CATEGORIES };

interface EditClassifiedModalProps {
  item: ClassifiedItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateClassified: (updatedItem: ClassifiedItem) => void;
  onDeleteClassified?: (itemId: string) => void;
  isSeniorMode: boolean;
}

export default function EditClassifiedModal({
  item,
  isOpen,
  onClose,
  onUpdateClassified,
  onDeleteClassified,
  isSeniorMode,
}: EditClassifiedModalProps) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Casa, Decoração e Utensílios");
  const [description, setDescription] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [sellerBlock, setSellerBlock] = useState("");
  const [sellerUnit, setSellerUnit] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Fotos existentes (URLs salvas no Supabase)
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Novas fotos selecionadas
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviewUrls, setNewPreviewUrls] = useState<string[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Modal de confirmação de exclusão
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pré-preencher campos ao abrir o modal com o item selecionado
  useEffect(() => {
    if (item && isOpen) {
      setTitle(item.title || "");
      setPrice(item.price ? String(item.price) : "");
      setCategory(item.category || "Móveis");
      setDescription(item.description || "");
      setSellerName(item.sellerName || "");
      setSellerBlock(item.sellerBlock || "");
      setSellerUnit(item.sellerUnit || "");
      setWhatsapp(item.whatsapp || "");
      setExistingImages(item.images || []);
      setNewFiles([]);
      setNewPreviewUrls([]);
      setUploadError(null);
      setShowDeleteConfirm(false);
    }
  }, [item, isOpen]);

  // Limpar ObjectURLs de previews criadas
  useEffect(() => {
    return () => {
      newPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newPreviewUrls]);

  if (!isOpen || !item) return null;

  const totalPhotosCount = existingImages.length + newFiles.length;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (totalPhotosCount + files.length > 5) {
      setUploadError("Você pode ter no máximo 5 fotos por anúncio.");
      toast.error("O limite total é de 5 fotos por anúncio.");
      return;
    }

    const updatedNewFiles = [...newFiles, ...files].slice(0, 5 - existingImages.length);
    setNewFiles(updatedNewFiles);

    // Gerar URLs para preview dos novos arquivos
    const updatedPreviews = updatedNewFiles.map((file) => URL.createObjectURL(file));
    setNewPreviewUrls(updatedPreviews);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveExistingPhoto = (index: number) => {
    if (totalPhotosCount <= 1) {
      toast.error("O anúncio precisa ter pelo menos 1 foto.");
      return;
    }
    const updated = existingImages.filter((_, i) => i !== index);
    setExistingImages(updated);
    setUploadError(null);
  };

  const handleRemoveNewPhoto = (index: number) => {
    if (totalPhotosCount <= 1) {
      toast.error("O anúncio precisa ter pelo menos 1 foto.");
      return;
    }
    const updatedFiles = newFiles.filter((_, i) => i !== index);
    setNewFiles(updatedFiles);

    URL.revokeObjectURL(newPreviewUrls[index]);
    const updatedPreviews = newPreviewUrls.filter((_, i) => i !== index);
    setNewPreviewUrls(updatedPreviews);
    setUploadError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    if (totalPhotosCount === 0) {
      setUploadError("Foto obrigatória! Mantenha ou adicione pelo menos 1 foto do produto.");
      toast.error("Por favor, adicione pelo menos 1 foto.");
      return;
    }

    if (!title || !price || !sellerName || !sellerUnit || !whatsapp) {
      toast.error("Preencha todos os campos obrigatórios (*).");
      return;
    }

    try {
      setIsSubmitting(true);

      const updatedItem = await updateClassifiedInSupabase(
        item.id,
        {
          title,
          price: parseFloat(price.replace(",", ".")),
          category,
          description,
          status: item.status,
          sellerName,
          sellerBlock: sellerBlock || undefined,
          sellerUnit,
          whatsapp,
        },
        existingImages,
        newFiles
      );

      toast.success("Anúncio atualizado com sucesso!");
      onUpdateClassified(updatedItem);
      onClose();
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "Erro ao salvar alterações no anúncio.");
      toast.error("Falha ao salvar edições do anúncio.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAd = async () => {
    try {
      setIsDeleting(true);
      const success = await deleteClassifiedInSupabase(item.id);
      if (success) {
        toast.success("Anúncio excluído com sucesso!");
        if (onDeleteClassified) onDeleteClassified(item.id);
        setShowDeleteConfirm(false);
        onClose();
      } else {
        toast.error("Falha ao excluir o anúncio.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Erro ao excluir anúncio.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div
        className={`bg-card w-full max-w-xl rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[92vh] ${
          isSeniorMode ? "border-2 border-primary" : ""
        }`}
      >
        {/* Cabeçalho */}
        <div className="bg-primary p-4 sm:p-6 text-primary-foreground flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20">
              <Pencil className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <h2 className={`font-bold ${isSeniorMode ? "text-2xl" : "text-xl"}`}>
                Editar Anúncio
              </h2>
              <p className={`text-primary-foreground/80 ${isSeniorMode ? "text-base" : "text-xs"}`}>
                Altere informações, fotos ou valores do seu desapego.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors disabled:opacity-50"
            aria-label="Fechar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className={`p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 min-h-0 ${isSeniorMode ? "space-y-6" : ""}`}>
          <div>
            <label className={`block font-bold mb-1 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
              Título do Produto *
            </label>
            <Input
              required
              placeholder="Ex: Sofá 3 Lugares Reclinável"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={isSeniorMode ? "h-14 text-lg" : "h-10"}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block font-bold mb-1 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                Preço (R$) *
              </label>
              <Input
                required
                type="number"
                step="0.01"
                placeholder="Ex: 350,00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={isSeniorMode ? "h-14 text-lg" : "h-10"}
              />
            </div>
            <div>
              <label className={`block font-bold mb-1 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                Categoria *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isSeniorMode ? "h-14 text-lg" : "h-10"
                }`}
              >
                {CLASSIFIED_CATEGORIES_DATA.map((group) => (
                  <optgroup key={group.name} label={`📁 ${group.name}`}>
                    <option value={group.name} className="font-bold">
                      {group.name} (Geral)
                    </option>
                    {group.subcategories.map((sub) => (
                      <option key={sub} value={sub}>
                        ↳ {sub}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={`block font-bold mb-1 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
              Descrição Detalhada
            </label>
            <Textarea
              rows={3}
              placeholder="Descreva o estado de conservação, tempo de uso, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={isSeniorMode ? "text-lg" : "text-sm"}
            />
          </div>

          {/* Gerenciamento de Fotos */}
          <div className="border border-border rounded-xl p-4 bg-muted/20">
            <div className="flex items-center justify-between mb-2">
              <label className={`font-bold flex items-center gap-2 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                <ImagePlus className="h-5 w-5 text-emerald-600" />
                <span>Fotos do Produto (Mín. 1, Máx. 5)</span>
              </label>

              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  totalPhotosCount === 0
                    ? "bg-amber-500/20 text-amber-600"
                    : totalPhotosCount === 5
                    ? "bg-emerald-500/20 text-emerald-600"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {totalPhotosCount} de 5 fotos
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="edit-photo-upload-input"
            />

            {/* Grid de Previews das Fotos (Existentes + Novas) */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-3">
              {/* Fotos Existentes */}
              {existingImages.map((url, idx) => (
                <div
                  key={`existing-${idx}`}
                  className="relative group aspect-square rounded-xl overflow-hidden border border-emerald-500/40 bg-black/10 shadow-sm"
                >
                  <img
                    src={url}
                    alt={`Existente ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingPhoto(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 transition-transform active:scale-95 cursor-pointer"
                    title="Remover foto"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <span className="absolute bottom-1 left-1 bg-emerald-700/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    Salva
                  </span>
                </div>
              ))}

              {/* Novas Fotos Adicionadas */}
              {newPreviewUrls.map((url, idx) => (
                <div
                  key={`new-${idx}`}
                  className="relative group aspect-square rounded-xl overflow-hidden border border-amber-500/60 bg-black/10 shadow-sm ring-2 ring-amber-500/30"
                >
                  <img
                    src={url}
                    alt={`Nova foto ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewPhoto(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 transition-transform active:scale-95 cursor-pointer"
                    title="Remover foto"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <span className="absolute bottom-1 left-1 bg-amber-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    Nova
                  </span>
                </div>
              ))}

              {/* Botão de Adicionar Mais Fotos */}
              {totalPhotosCount < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed border-primary/40 hover:border-primary bg-background/50 hover:bg-primary/5 rounded-xl aspect-square flex flex-col items-center justify-center p-2 text-center transition-all cursor-pointer ${
                    isSeniorMode ? "min-h-[100px]" : "min-h-[85px]"
                  }`}
                >
                  <Upload className="h-6 w-6 text-primary mb-1" />
                  <span className="text-xs font-bold text-primary">
                    + Adicionar Foto
                  </span>
                </button>
              )}
            </div>

            {uploadError && (
              <div className="flex items-center gap-2 mt-3 text-red-600 text-xs font-semibold bg-red-50 dark:bg-red-950/40 p-2 rounded-lg border border-red-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          {/* Dados do Anunciante */}
          <div className="border-t border-border pt-4 mt-4">
            <h4 className={`font-bold mb-3 ${isSeniorMode ? "text-xl" : "text-base"}`}>
              Dados do Anunciante
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Nome *</label>
                <Input
                  required
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className={isSeniorMode ? "h-12 text-base" : "h-9 text-xs"}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Bloco/Torre</label>
                <Input
                  value={sellerBlock}
                  onChange={(e) => setSellerBlock(e.target.value)}
                  className={isSeniorMode ? "h-12 text-base" : "h-9 text-xs"}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Apto / Casa *</label>
                <Input
                  required
                  value={sellerUnit}
                  onChange={(e) => setSellerUnit(e.target.value)}
                  className={isSeniorMode ? "h-12 text-base" : "h-9 text-xs"}
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-xs font-medium mb-1">WhatsApp para Contato *</label>
              <Input
                required
                value={whatsapp}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
                  let formatted = digits;
                  if (digits.length > 2) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
                  if (digits.length > 7) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
                  setWhatsapp(formatted);
                }}
                className={isSeniorMode ? "h-12 text-base" : "h-9 text-xs"}
              />
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 pb-2 sm:pb-4 border-t border-border shrink-0">
            <Button
              type="button"
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isSubmitting}
              className="w-full sm:w-auto font-bold flex items-center justify-center gap-2 bg-red-600/90 hover:bg-red-700 text-white cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              <span>Apagar Anúncio</span>
            </Button>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="flex-1 sm:flex-none">
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="hero"
                disabled={isSubmitting || totalPhotosCount === 0}
                className={`flex-1 sm:flex-none font-bold flex items-center justify-center gap-2 ${
                  isSeniorMode ? "h-14 px-8 text-xl" : "h-10 px-6"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Salvando alterações...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Salvar Alterações</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-red-500/40 p-6 text-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className="mx-auto w-14 h-14 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center border border-red-500/30">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>

            <h3 className="text-xl font-bold text-foreground">
              Apagar Anúncio Permanentemente?
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Você tem certeza de que deseja apagar o anúncio <strong>"{item.title}"</strong>? Esta ação é irreversível e o anúncio será excluído do sistema.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="font-bold flex-1"
              >
                Cancelar
              </Button>

              <Button
                type="button"
                onClick={handleDeleteAd}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white font-bold flex-1 shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Apagando...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    <span>Sim, Apagar</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
