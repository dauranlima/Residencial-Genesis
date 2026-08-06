import { useState, useRef } from "react";
import { X, Upload, CheckCircle2, Zap, Loader2, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Coupon } from "./types";
import { createPromotionInSupabase } from "@/lib/condoMarketService";
import { toast } from "sonner";

interface NewPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPromotion: (newCoupon: Coupon) => void;
  isSeniorMode: boolean;
}

const MERCHANT_CATEGORIES = ["Padaria", "Petshop", "Lava-Car", "Mercado", "Restaurante", "Farmácia", "Serviços", "Outros"];

export default function NewPromotionModal({
  isOpen,
  onClose,
  onAddPromotion,
  isSeniorMode,
}: NewPromotionModalProps) {
  const [merchantName, setMerchantName] = useState("");
  const [merchantCategory, setMerchantCategory] = useState("Mercado");
  const [merchantWhatsapp, setMerchantWhatsapp] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [totalQuantity, setTotalQuantity] = useState("10");
  const [hoursValid, setHoursValid] = useState("24");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!merchantName || !title || !discountValue || !merchantWhatsapp) {
      toast.error("Preencha todos os campos obrigatórios (*).");
      return;
    }

    try {
      setIsUploading(true);

      const hours = parseInt(hoursValid, 10) || 24;
      const expiresAt = new Date(Date.now() + hours * 3600 * 1000).toISOString();

      const createdCoupon = await createPromotionInSupabase({
        merchantName,
        merchantCategory,
        merchantWhatsapp,
        title,
        description,
        discountValue,
        totalQuantity: parseInt(totalQuantity, 10) || 10,
        expiresAt,
        imageFile: selectedFile,
      });

      toast.success("Promoção relâmpago cadastrada com sucesso!");
      onAddPromotion(createdCoupon);

      // Limpar formulário
      setMerchantName("");
      setTitle("");
      setDescription("");
      setDiscountValue("");
      setSelectedFile(null);
      setPreviewUrl(null);
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao salvar promoção no Supabase.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div
        className={`bg-card w-full max-w-xl rounded-2xl shadow-2xl border border-border overflow-hidden my-8 ${
          isSeniorMode ? "border-2 border-amber-500" : ""
        }`}
      >
        {/* Cabeçalho */}
        <div className="bg-amber-500 p-6 text-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="h-7 w-7 fill-slate-950" />
            <div>
              <h2 className={`font-black ${isSeniorMode ? "text-2xl" : "text-xl"}`}>
                Anunciar Promoção Relâmpago
              </h2>
              <p className="text-slate-900/80 text-xs font-semibold">
                Divulgue cupons de desconto do comércio local para os moradores.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="p-2 rounded-full hover:bg-black/10 transition-colors disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className={`p-6 space-y-4 ${isSeniorMode ? "space-y-6" : ""}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block font-bold mb-1 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                Nome do Estabelecimento *
              </label>
              <Input
                required
                placeholder="Ex: Padaria Pão D'Oro"
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                className={isSeniorMode ? "h-14 text-lg" : "h-10"}
              />
            </div>

            <div>
              <label className={`block font-bold mb-1 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                Categoria do Comércio *
              </label>
              <select
                value={merchantCategory}
                onChange={(e) => setMerchantCategory(e.target.value)}
                className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isSeniorMode ? "h-14 text-lg" : "h-10"
                }`}
              >
                {MERCHANT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={`block font-bold mb-1 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
              Título da Promoção *
            </label>
            <Input
              required
              placeholder="Ex: 20% OFF em qualquer produto da loja"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={isSeniorMode ? "h-14 text-lg" : "h-10"}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block font-bold mb-1 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                Valor do Desconto *
              </label>
              <Input
                required
                placeholder="Ex: 20% OFF ou R$ 15 OFF"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className={isSeniorMode ? "h-14 text-lg" : "h-10"}
              />
            </div>
            <div>
              <label className={`block font-bold mb-1 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                Qtde de Cupons *
              </label>
              <Input
                required
                type="number"
                min="1"
                placeholder="Ex: 10"
                value={totalQuantity}
                onChange={(e) => setTotalQuantity(e.target.value)}
                className={isSeniorMode ? "h-14 text-lg" : "h-10"}
              />
            </div>
            <div>
              <label className={`block font-bold mb-1 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                Duração (Horas) *
              </label>
              <Input
                required
                type="number"
                min="1"
                placeholder="Ex: 24"
                value={hoursValid}
                onChange={(e) => setHoursValid(e.target.value)}
                className={isSeniorMode ? "h-14 text-lg" : "h-10"}
              />
            </div>
          </div>

          <div>
            <label className={`block font-bold mb-1 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
              Regras e Descrição
            </label>
            <Textarea
              rows={2}
              placeholder="Ex: Válido para compras realizadas até o final do dia."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={isSeniorMode ? "text-lg" : "text-sm"}
            />
          </div>

          {/* Banner da Oferta (Bucket: img_ofertas) */}
          <div className="border border-border rounded-xl p-4 bg-muted/20">
            <label className={`block font-bold mb-2 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
              Foto da Oferta / Logotipo (Bucket: img_ofertas)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {previewUrl ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-border bg-black/5 max-h-40">
                <img src={previewUrl} alt="Preview Oferta" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-amber-500/50 hover:border-amber-500 bg-amber-500/5 p-4 rounded-xl flex items-center justify-center gap-3 transition-colors cursor-pointer"
              >
                <Upload className="h-5 w-5 text-amber-600" />
                <span className="text-sm font-bold text-amber-700">
                  Enviar Imagem da Oferta
                </span>
              </button>
            )}
          </div>

          <div>
            <label className={`block font-bold mb-1 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
              WhatsApp do Estabelecimento *
            </label>
            <Input
              required
              placeholder="(45) 99999-9999"
              value={merchantWhatsapp}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
                let formatted = digits;
                if (digits.length > 2) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
                if (digits.length > 7) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
                setMerchantWhatsapp(formatted);
              }}
              className={isSeniorMode ? "h-14 text-lg" : "h-10"}
            />
          </div>

          {/* Botões */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} disabled={isUploading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className={`bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center gap-2 ${
                isSeniorMode ? "h-14 px-8 text-xl" : "h-10 px-6"
              }`}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Publicando...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Publicar Oferta</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
