import { useState } from "react";
import { X, Upload, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ClassifiedItem } from "./types";

interface NewClassifiedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClassified: (newItem: ClassifiedItem) => void;
  isSeniorMode: boolean;
}

const CATEGORIES = ["Móveis", "Eletrônicos", "Eletrodomésticos", "Roupas & Acessórios", "Esportes", "Outros"];

export default function NewClassifiedModal({
  isOpen,
  onClose,
  onAddClassified,
  isSeniorMode,
}: NewClassifiedModalProps) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Móveis");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [sellerBlock, setSellerBlock] = useState("");
  const [sellerUnit, setSellerUnit] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !sellerName || !sellerUnit || !whatsapp) return;

    const newItem: ClassifiedItem = {
      id: `item-${Date.now()}`,
      title,
      price: parseFloat(price.replace(",", ".")),
      category,
      description,
      images: [
        imageUrl ||
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=60",
      ],
      status: "available",
      createdAt: new Date().toISOString(),
      sellerName,
      sellerBlock: sellerBlock || undefined,
      sellerUnit,
      whatsapp,
    };

    onAddClassified(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div
        className={`bg-card w-full max-w-xl rounded-2xl shadow-2xl border border-border overflow-hidden my-8 ${
          isSeniorMode ? "border-2 border-primary" : ""
        }`}
      >
        {/* Cabeçalho */}
        <div className="bg-primary p-6 text-primary-foreground flex items-center justify-between">
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
            className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className={`p-6 space-y-4 ${isSeniorMode ? "space-y-6" : ""}`}>
          <div>
            <label className={`block font-bold mb-1 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
              Título do Produto *
            </label>
            <Input
              required
              placeholder="Ex: Sofa 3 Lugares Reclinável"
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
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
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

          <div>
            <label className={`block font-bold mb-1 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
              URL da Foto (opcional)
            </label>
            <Input
              type="url"
              placeholder="https://exemplo.com/foto.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className={isSeniorMode ? "h-14 text-lg" : "h-10"}
            />
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="hero"
              className={`font-bold flex items-center gap-2 ${
                isSeniorMode ? "h-14 px-8 text-xl" : "h-10 px-6"
              }`}
            >
              <CheckCircle2 className="h-5 w-5" />
              <span>Publicar Anúncio</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
