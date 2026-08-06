import { useState, useEffect } from "react";
import { Search, Plus, PackageX, Tag, CheckCircle2, Clock, Ban, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ClassifiedCard from "./ClassifiedCard";
import MarketPagination from "./MarketPagination";
import { ClassifiedItem, ClassifiedStatus, CurrentUser } from "./types";

interface MyClassifiedsTabProps {
  items: ClassifiedItem[];
  currentUser: CurrentUser;
  isSeniorMode: boolean;
  onOpenNewModal: () => void;
  onSelectItem?: (item: ClassifiedItem) => void;
  onUpdateStatus?: (itemId: string, newStatus: ClassifiedStatus) => void;
}

type StatusFilter = "all" | ClassifiedStatus;

const STATUS_OPTIONS: { id: StatusFilter; label: string; icon: any; color: string }[] = [
  { id: "all", label: "Todos", icon: Tag, color: "bg-slate-800 text-white" },
  { id: "available", label: "Disponíveis", icon: CheckCircle2, color: "bg-emerald-600 text-white" },
  { id: "reserved", label: "Reservados", icon: Clock, color: "bg-amber-500 text-slate-950" },
  { id: "sold", label: "Vendidos", icon: CheckCheck, color: "bg-blue-600 text-white" },
  { id: "cancelled", label: "Cancelados", icon: Ban, color: "bg-red-600 text-white" },
];

const ITEMS_PER_PAGE = 9;

export default function MyClassifiedsTab({
  items,
  currentUser,
  isSeniorMode,
  onOpenNewModal,
  onSelectItem,
  onUpdateStatus,
}: MyClassifiedsTabProps) {
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Resetar página quando os filtros de busca ou status mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, searchQuery]);

  // Filter items created by current user
  const userItems = items.filter((item) => {
    const isOwnerByPhone =
      currentUser.phone &&
      item.whatsapp &&
      currentUser.phone.replace(/\D/g, "") === item.whatsapp.replace(/\D/g, "");
    const isOwnerByUnit =
      currentUser.unit === item.sellerUnit &&
      currentUser.name.toLowerCase() === item.sellerName.toLowerCase();
    return isOwnerByPhone || isOwnerByUnit;
  });

  const filteredItems = userItems.filter((item) => {
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const safePage = Math.min(currentPage, Math.max(1, totalPages));
  const paginatedItems = filteredItems.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const getCount = (status: StatusFilter) => {
    if (status === "all") return userItems.length;
    return userItems.filter((item) => item.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Banner Informativo dos Meus Anúncios */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-luxury">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
            Painel do Morador
          </span>
          <h2 className={`font-black tracking-tight text-white ${isSeniorMode ? "text-3xl" : "text-2xl"}`}>
            Meus Anúncios ({userItems.length})
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Gerencie seus desapegos publicados, altere status para Reservado ou Vendido, ou cancele a exibição.
          </p>
        </div>

        <Button
          onClick={onOpenNewModal}
          variant="hero"
          className={`shrink-0 font-bold flex items-center gap-2 ${
            isSeniorMode ? "h-14 px-6 text-xl" : "h-11 px-5"
          }`}
        >
          <Plus className={isSeniorMode ? "h-6 w-6" : "h-5 w-5"} />
          <span>Novo Anúncio</span>
        </Button>
      </div>

      {/* Barra de Filtros de Status & Busca */}
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
            placeholder="Buscar nos meus anúncios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-10 bg-background ${
              isSeniorMode ? "h-14 text-xl placeholder:text-lg" : "h-10 text-sm"
            }`}
          />
        </div>

        {/* Chips de Filtro por Status */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {STATUS_OPTIONS.map((opt) => {
            const count = getCount(opt.id);
            const isSelected = selectedStatus === opt.id;
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedStatus(opt.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all text-xs whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? `${opt.color} shadow-md scale-105`
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                } ${isSeniorMode ? "text-base px-5 py-3" : ""}`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{opt.label}</span>
                <span className="ml-1 bg-black/20 text-current px-1.5 py-0.5 rounded-full text-[10px]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista / Grid de Meus Anúncios */}
      {filteredItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedItems.map((item) => (
              <ClassifiedCard
                key={item.id}
                item={item}
                isSeniorMode={isSeniorMode}
                onSelectItem={onSelectItem}
                currentUser={currentUser}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
          </div>

          <MarketPagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={filteredItems.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={(p) => setCurrentPage(p)}
            isSeniorMode={isSeniorMode}
            itemLabel="anúncios"
          />
        </>
      ) : (
        <div className="text-center py-16 bg-card rounded-xl border border-dashed border-border p-6">
          <PackageX className="h-16 w-16 mx-auto text-muted-foreground/50 mb-3" />
          <h3 className={`font-bold text-foreground mb-1 ${isSeniorMode ? "text-2xl" : "text-lg"}`}>
            Nenhum anúncio encontrado neste filtro
          </h3>
          <p className={`text-muted-foreground max-w-md mx-auto mb-6 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
            {userItems.length === 0
              ? "Você ainda não publicou nenhum anúncio no viziGO. Clique no botão abaixo para começar!"
              : "Não há anúncios com o status selecionado."}
          </p>
          <Button onClick={onOpenNewModal} variant="hero">
            Publicar Meu Primeiro Anúncio
          </Button>
        </div>
      )}
    </div>
  );
}
