import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MarketPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  isSeniorMode?: boolean;
  itemLabel?: string;
}

export default function MarketPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 9,
  onPageChange,
  isSeniorMode = false,
  itemLabel = "itens",
}: MarketPaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers array with optional ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push("...");
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2 border-t border-border/60">
      {/* Contagem de Itens */}
      <p className={`text-muted-foreground font-medium ${isSeniorMode ? "text-base" : "text-xs"}`}>
        Exibindo <span className="font-bold text-foreground">{startItem}–{endItem}</span> de{" "}
        <span className="font-bold text-foreground">{totalItems}</span> {itemLabel}
      </p>

      {/* Controles de Paginação */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size={isSeniorMode ? "default" : "sm"}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 font-semibold ${
            isSeniorMode ? "h-11 px-4 text-base" : "h-9 px-3 text-xs"
          }`}
        >
          <ChevronLeft className={isSeniorMode ? "h-5 w-5" : "h-4 w-4"} />
          <span>Anterior</span>
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, idx) => {
            if (typeof page === "string") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className={`px-2 text-muted-foreground font-bold ${
                    isSeniorMode ? "text-lg" : "text-sm"
                  }`}
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;

            return (
              <Button
                key={page}
                variant={isActive ? "hero" : "ghost"}
                size="sm"
                onClick={() => onPageChange(page)}
                className={`font-bold transition-all ${
                  isSeniorMode ? "h-11 w-11 text-base" : "h-9 w-9 text-xs"
                } ${
                  isActive
                    ? "shadow-md scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {page}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size={isSeniorMode ? "default" : "sm"}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 font-semibold ${
            isSeniorMode ? "h-11 px-4 text-base" : "h-9 px-3 text-xs"
          }`}
        >
          <span>Próximo</span>
          <ChevronRight className={isSeniorMode ? "h-5 w-5" : "h-4 w-4"} />
        </Button>
      </div>
    </div>
  );
}
