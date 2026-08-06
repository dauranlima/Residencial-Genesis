import { useState } from "react";
import { Search, Plus, PackageX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ClassifiedCard from "./ClassifiedCard";
import { ClassifiedItem } from "./types";

interface ClassifiedsTabProps {
  items: ClassifiedItem[];
  isLoading?: boolean;
  isSeniorMode: boolean;
  onOpenNewModal: () => void;
  onSelectItem?: (item: ClassifiedItem) => void;
}

const CATEGORIES = ["Todos", "Móveis", "Eletrônicos", "Eletrodomésticos", "Roupas & Acessórios", "Esportes", "Outros"];

export default function ClassifiedsTab({
  items,
  isLoading = false,
  isSeniorMode,
  onOpenNewModal,
  onSelectItem,
}: ClassifiedsTabProps) {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = items.filter((item) => {
    // Cancelled and Sold/Finalized items disappear immediately from public classifieds tab
    if (item.status === "cancelled" || item.status === "sold") return false;

    const matchesCategory = selectedCategory === "Todos" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-card p-4 rounded-xl border border-border shadow-sm">
        {/* Campo de Busca */}
        <div className="relative flex-1">
          <Search
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground ${
              isSeniorMode ? "h-6 w-6" : "h-4 w-4"
            }`}
          />
          <Input
            type="text"
            placeholder="Buscar desapego dos vizinhos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-10 bg-background ${
              isSeniorMode ? "h-14 text-xl placeholder:text-lg" : "h-10 text-sm"
            }`}
          />
        </div>

        {/* Botão Novo Anúncio */}
        <Button
          onClick={onOpenNewModal}
          variant="hero"
          className={`font-bold flex items-center gap-2 ${
            isSeniorMode ? "h-14 px-6 text-xl" : "h-10 px-4 text-sm"
          }`}
        >
          <Plus className={isSeniorMode ? "h-6 w-6" : "h-4 w-4"} />
          <span>Anunciar Desapego</span>
        </Button>
      </div>

      {/* Categorias (Chips) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground shadow-md font-bold"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            } ${isSeniorMode ? "text-lg px-6 py-3" : "text-sm"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Estado de Carregamento */}
      {isLoading ? (
        <div className="text-center py-20 bg-card rounded-xl border border-border flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-semibold">Buscando desapegos no Supabase...</p>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ClassifiedCard
              key={item.id}
              item={item}
              isSeniorMode={isSeniorMode}
              onSelectItem={onSelectItem}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-xl border border-dashed border-border">
          <PackageX className="h-16 w-16 mx-auto text-muted-foreground/50 mb-3" />
          <h3 className={`font-bold text-foreground mb-1 ${isSeniorMode ? "text-2xl" : "text-lg"}`}>
            Nenhum desapego encontrado
          </h3>
          <p className={`text-muted-foreground max-w-md mx-auto mb-6 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
            Não encontramos nenhum anúncio publicado ainda. Seja o primeiro vizinho a anunciar!
          </p>
          <Button onClick={onOpenNewModal} variant="hero">
            Publicar Meu Anúncio
          </Button>
        </div>
      )}
    </div>
  );
}
