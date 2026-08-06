import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import logoChp from "@/assets/LOGOchp.png";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-primary/95 backdrop-blur-md border-b border-navy-light/30 shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/condo-market" className="flex items-center gap-2">
          <img src={logoChp} alt="viziGO Logo" className="h-48  md:h-48 mt-2 w-auto object-contain" />
        </Link>

        {/* Navegação Focada no viziGO */}
        <nav className="flex items-center gap-2">
          <Link
            to="/condo-market"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-accent text-accent-foreground shadow-md transition-all"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>viziGO</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
