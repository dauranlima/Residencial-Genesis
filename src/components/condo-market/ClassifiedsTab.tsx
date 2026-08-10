import { useState, useEffect } from "react";
import { Search, Plus, PackageX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ClassifiedCard from "./ClassifiedCard";
import MarketPagination from "./MarketPagination";
import { ClassifiedItem } from "./types";

import { FILTER_CATEGORIES, matchesCategoryFilter, CATEGORIES } from "./categories";

export { CATEGORIES };

interface ClassifiedsTabProps {
  items: ClassifiedItem[];
  isLoading?: boolean;
  isSeniorMode: boolean;
  onOpenNewModal: () => void;
  onSelectItem?: (item: ClassifiedItem) => void;
}

const ITEMS_PER_PAGE = 9;

export default function ClassifiedsTab({
  items,
  isLoading = false,
  isSeniorMode,
  onOpenNewModal,
  onSelectItem,
}: ClassifiedsTabProps) {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Resetar para a primeira página sempre que filtro ou busca mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const filteredItems = items.filter((item) => {
    // Cancelled and Sold/Finalized items disappear immediately from public classifieds tab
    if (item.status === "cancelled" || item.status === "sold") return false;

    const matchesCategory = matchesCategoryFilter(selectedCategory, item.category);
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const safePage = Math.min(currentPage, Math.max(1, totalPages));
  const paginatedItems = filteredItems.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

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
            placeholder="Buscar desapego dos vizinhos por título, descrição ou categoria..."
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
      <div id="market-categories-section" className="scroll-mt-24 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {FILTER_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground shadow-md font-bold ring-2 ring-primary/30"
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedItems.map((item) => (
              <ClassifiedCard
                key={item.id}
                item={item}
                isSeniorMode={isSeniorMode}
                onSelectItem={onSelectItem}
              />
            ))}
          </div>

          <MarketPagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={filteredItems.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
            isSeniorMode={isSeniorMode}
            itemLabel="desapegos"
          />
        </>
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
