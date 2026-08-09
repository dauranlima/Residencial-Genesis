import { useState, useEffect, useRef } from "react";
import { X, Upload, CheckCircle2, ImagePlus, Trash2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ClassifiedItem } from "./types";
import { createClassifiedInSupabase } from "@/lib/condoMarketService";
import { toast } from "sonner";

import TermsOfUseModal from "./TermsOfUseModal";

import { CLASSIFIED_CATEGORIES_DATA } from "./categories";

interface NewClassifiedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClassified: (newItem: ClassifiedItem) => void;
  isSeniorMode: boolean;
  currentUser?: { name: string; block: string; unit: string } | null;
}

export default function NewClassifiedModal({
  isOpen,
  onClose,
  onAddClassified,
  isSeniorMode,
  currentUser,
}: NewClassifiedModalProps) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Casa, Decoração e Utensílios");
  const [description, setDescription] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [sellerBlock, setSellerBlock] = useState("");
  const [sellerUnit, setSellerUnit] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Fotos
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Terms of Use modal
  const [showTermsModal, setShowTermsModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      setSellerName(currentUser.name || "");
      setSellerBlock(currentUser.block || "");
      setSellerUnit(currentUser.unit || "");
      if (currentUser.phone) {
        setWhatsapp(currentUser.phone);
      }
    }
  }, [currentUser, isOpen]);

  // Clean up object URLs when unmounting or changing previewUrls
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (selectedFiles.length + files.length > 5) {
      setUploadError("Você pode selecionar no máximo 5 fotos por anúncio.");
      toast.error("O limite é de 5 fotos por anúncio.");
      return;
    }

    const newFiles = [...selectedFiles, ...files].slice(0, 5);
    setSelectedFiles(newFiles);

    // Gerar URLs para preview
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(newPreviews);

    // Reset input value so user can re-select if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);

    URL.revokeObjectURL(previewUrls[index]);
    const updatedPreviews = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(updatedPreviews);
    setUploadError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    if (selectedFiles.length === 0) {
      setUploadError("Foto obrigatória! Adicione pelo menos 1 foto do produto.");
      toast.error("Por favor, selecione pelo menos 1 foto para o anúncio.");
      return;
    }

    if (!title || !price || !sellerName || !sellerUnit || !whatsapp) {
      toast.error("Preencha todos os campos obrigatórios (*).");
      return;
    }

    // Passou das validações, abre o modal de Termos de Uso
    setShowTermsModal(true);
  };

  const handleConfirmPublish = async () => {
    try {
      setIsUploading(true);

      const createdItem = await createClassifiedInSupabase(
        {
          title,
          price: parseFloat(price.replace(",", ".")),
          category,
          description,
          status: "available",
          sellerName,
          sellerBlock: sellerBlock || undefined,
          sellerUnit,
          whatsapp,
        },
        selectedFiles
      );

      toast.success("Anúncio publicado com sucesso no condomínio!");
      onAddClassified(createdItem);

      // Limpar formulário
      setTitle("");
      setPrice("");
      setDescription("");
      setSelectedFiles([]);
      setPreviewUrls([]);
      setShowTermsModal(false);
      onClose();
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "Erro ao fazer upload das fotos e publicar anúncio.");
      toast.error("Falha ao publicar anúncio. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div
        className={`bg-card w-full max-w-xl rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[92vh] ${
          isSeniorMode ? "border-2 border-primary" : ""
        }`}
      >
        {/* Cabeçalho */}
        <div className="bg-primary p-4 sm:p-6 text-primary-foreground flex items-center justify-between shrink-0">
          <div>
            <h2 className={`font-bold ${isSeniorMode ? "text-2xl" : "text-xl"}`}>
              Anunciar Novo Desapego
            </h2>
            <p className={`text-primary-foreground/80 ${isSeniorMode ? "text-base" : "text-xs"}`}>
              Seus dados serão visíveis apenas para os moradores do mesmo condomínio.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors disabled:opacity-50"
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

          {/* Upload de Fotos - Mobile First (Máximo 5 Fotos, Mínimo 1) */}
          <div className="border border-border rounded-xl p-4 bg-muted/20">
            <div className="flex items-center justify-between mb-2">
              <label className={`font-bold flex items-center gap-2 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                <ImagePlus className="h-5 w-5 text-emerald-600" />
                <span>Fotos do Produto * (Mín. 1 foto, Máx. 5)</span>
              </label>

              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  selectedFiles.length === 0
                    ? "bg-amber-500/20 text-amber-600"
                    : selectedFiles.length === 5
                    ? "bg-emerald-500/20 text-emerald-600"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {selectedFiles.length} de 5 fotos
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="photo-upload-input"
            />

            {/* Grid de Previews de Imagens */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-3">
              {previewUrls.map((url, idx) => (
                <div
                  key={idx}
                  className="relative group aspect-square rounded-xl overflow-hidden border border-border bg-black/5 shadow-sm"
                >
                  <img
                    src={url}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 transition-transform active:scale-95"
                    title="Remover foto"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                    #{idx + 1}
                  </span>
                </div>
              ))}

              {/* Botão de Adicionar Fotos */}
              {selectedFiles.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed border-primary/40 hover:border-primary bg-background/50 hover:bg-primary/5 rounded-xl aspect-square flex flex-col items-center justify-center p-2 text-center transition-all cursor-pointer ${
                    isSeniorMode ? "min-h-[100px]" : "min-h-[85px]"
                  }`}
                >
                  <Upload className="h-6 w-6 text-primary mb-1" />
                  <span className="text-xs font-bold text-primary">
                    {selectedFiles.length === 0 ? "Tirar ou Enviar Foto" : "+ Foto"}
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

          {/* Dados do Vizinho */}
          <div className="border-t border-border pt-4 mt-4">
            <h4 className={`font-bold mb-3 ${isSeniorMode ? "text-xl" : "text-base"}`}>
              Seus Dados para Contato
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Seu Nome *</label>
                <Input
                  required
                  placeholder="Nome"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className={isSeniorMode ? "h-12 text-base" : "h-9 text-xs"}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Bloco/Torre</label>
                <Input
                  placeholder="Ex: B"
                  value={sellerBlock}
                  onChange={(e) => setSellerBlock(e.target.value)}
                  className={isSeniorMode ? "h-12 text-base" : "h-9 text-xs"}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Apto / Casa *</label>
                <Input
                  required
                  placeholder="Ex: 402"
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
                placeholder="(45) 99999-9999"
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

          {/* Botões */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} disabled={isUploading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="hero"
              disabled={isUploading || selectedFiles.length === 0}
              className={`font-bold flex items-center gap-2 ${
                isSeniorMode ? "h-14 px-8 text-xl" : "h-10 px-6"
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Enviando fotos ({selectedFiles.length})...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Publicar Anúncio</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      <TermsOfUseModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={handleConfirmPublish}
        isSeniorMode={isSeniorMode}
        isSubmitting={isUploading}
      />
    </div>
  );
}
