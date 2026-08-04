import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Building2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { title: "Início", path: "/" },
  { title: "CondoMarket", path: "/condo-market" },
  { title: "Solicitações", path: "/solicitacoes" },
  { title: "Localização", path: "/localizacao" },
  { title: "Avisos Importantes", path: "/avisos" },
  { title: "Regimento", path: "/regimento" },
];

const secondaryItems = [
  { title: "Apartamentos", path: "/apartamentos" },
  { title: "Apartamentos Disponíveis", path: "/outros-imoveis" },
  { title: "Vistoria", path: "/vistoria" },
  { title: "Galeria de Fotos", path: "/galeria" },
  { title: "Ficha Locatário", path: "/ficha-cadastral" },
  { title: "Ficha Fiador", path: "/ficha-fiador" },
  { title: "Garagem", path: "/garagem" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-primary/95 backdrop-blur-md border-b border-navy-light/30">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Building2 className="h-7 w-7 text-accent" />
          <span className="text-lg font-bold text-primary-foreground tracking-tight">
            Residencial <span className="text-gradient-gold">Morada do Sol II</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? "bg-accent text-accent-foreground"
                  : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              }`}
            >
              {item.title}
            </Link>
          ))}

          {/* More dropdown */}
            <div className="relative group">
            <button className="px-3 py-2 rounded-md text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
              Serviços ▾
            </button>
            <div className="absolute top-full left-0 mt-1 w-48 bg-card rounded-lg shadow-luxury border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              {secondaryItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block px-4 py-2.5 text-sm text-card-foreground hover:bg-muted first:rounded-t-lg last:rounded-b-lg transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
          
          <Link to="/login" className="ml-2">
            <Button variant="hero" size="sm" className="shadow-none">
              Área Adm
            </Button>
          </Link>
        </nav>

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-primary-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-primary border-t border-navy-light/30 overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-1">
              {[...navItems, ...secondaryItems].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-accent text-accent-foreground"
                      : "text-primary-foreground/80 hover:bg-primary-foreground/10"
                  }`}
                >
                  {item.title}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-md text-sm font-medium transition-colors text-primary-foreground/80 hover:bg-primary-foreground/10"
              >
                Área Adm
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
