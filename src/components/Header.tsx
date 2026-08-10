import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  MapPin,
  Building2,
  Bell,
  Home,
  FileText,
  UserCheck,
  Car,
  Image as ImageIcon,
  MessageSquare,
  ClipboardCheck,
  FileCheck,
  Lock,
  ChevronDown,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import logoChp from "@/assets/LOGOchp.png";
import { getEnabledPages, subscribeToPageStatusChanges, syncPagesFromSupabase, PageConfig } from "@/lib/pageStatusService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const NAV_ICONS: Record<string, React.ElementType> = {
  "condo-market": ShoppingBag,
  localizacao: MapPin,
  admin: Building2,
  avisos: Bell,
  apartamentos: Home,
  "ficha-cadastral": FileText,
  "ficha-fiador": UserCheck,
  garagem: Car,
  galeria: ImageIcon,
  solicitacoes: MessageSquare,
  vistoria: ClipboardCheck,
  regimento: FileCheck,
  "outros-imoveis": Building2,
  login: Lock,
};

export default function Header() {
  const location = useLocation();
  const [enabledPages, setEnabledPages] = useState<PageConfig[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updatePages = () => {
      // Filtra apenas páginas habilitadas e que não sejam exclusivas do Super Admin
      const active = getEnabledPages().filter((p) => !p.isCore);
      setEnabledPages(active);
    };

    updatePages();
    syncPagesFromSupabase().then(() => updatePages());

    const unsubscribe = subscribeToPageStatusChanges(updatePages);
    return () => unsubscribe();
  }, []);

  // Separa até 4 principais para desktop e o restante vai para o dropdown "Mais Módulos"
  const visibleDesktopPages = enabledPages.length > 5 ? enabledPages.slice(0, 4) : enabledPages;
  const dropdownDesktopPages = enabledPages.length > 5 ? enabledPages.slice(4) : [];

  return (
    <header className="sticky top-0 z-50 bg-primary/95 backdrop-blur-md border-b border-navy-light/30 shadow-md">
      <div className="container mx-auto flex items-center justify-between h-20 px-4">
        {/* Logo */}
        <Link to="/vizigo" className="flex items-center gap-2 shrink-0 py-1">
          <img src={logoChp} alt="viziGO Logo" className="h-32 sm:h-36 md:h-40 w-auto object-contain -my-4 drop-shadow-md transition-transform hover:scale-105" />
        </Link>

        {/* Navegação Desktop (Telas Habilitadas pelo Super Admin) */}
        <nav className="hidden md:flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          {visibleDesktopPages.map((page) => {
            const IconComp = NAV_ICONS[page.id] || Building2;
            const isActive = location.pathname === page.path;

            return (
              <Link
                key={page.id}
                to={page.path}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-sm ${
                  isActive
                    ? "bg-accent text-accent-foreground ring-2 ring-accent/30 shadow-md"
                    : "bg-navy-dark/40 text-slate-200 hover:bg-accent/20 hover:text-accent border border-navy-light/20"
                }`}
              >
                <IconComp className="h-3.5 w-3.5 shrink-0" />
                <span>{page.name}</span>
              </Link>
            );
          })}

          {/* Dropdown caso existam mais de 5 módulos ativados */}
          {dropdownDesktopPages.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-navy-dark/40 text-slate-200 hover:bg-accent/20 hover:text-accent border border-navy-light/20 shadow-sm"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>Mais Módulos ({dropdownDesktopPages.length})</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-100 p-2 min-w-[220px]">
                {dropdownDesktopPages.map((page) => {
                  const IconComp = NAV_ICONS[page.id] || Building2;
                  const isActive = location.pathname === page.path;

                  return (
                    <DropdownMenuItem key={page.id} asChild className="focus:bg-amber-500/10 cursor-pointer rounded-lg">
                      <Link
                        to={page.path}
                        className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium w-full ${
                          isActive ? "text-amber-400 font-bold" : "text-slate-200"
                        }`}
                      >
                        <IconComp className="h-4 w-4 text-amber-400 shrink-0" />
                        <span>{page.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* Botão do Menu Mobile */}
        <div className="flex md:hidden items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-100 hover:bg-navy-light/30"
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Menu Drawer Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-slate-800 p-4 space-y-2 animate-in slide-in-from-top duration-200">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
            Módulos Ativos no Sistema
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {enabledPages.map((page) => {
              const IconComp = NAV_ICONS[page.id] || Building2;
              const isActive = location.pathname === page.path;

              return (
                <Link
                  key={page.id}
                  to={page.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-accent text-accent-foreground font-bold shadow-md"
                      : "bg-slate-900 text-slate-200 hover:bg-slate-800 border border-slate-800"
                  }`}
                >
                  <IconComp className="h-4 w-4 shrink-0" />
                  <span>{page.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
