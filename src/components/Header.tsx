import { Link } from "react-router-dom";
import { Building2, ShoppingBag } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-primary/95 backdrop-blur-md border-b border-navy-light/30 shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/condo-market" className="flex items-center gap-2">
          <Building2 className="h-7 w-7 text-accent" />
          <span className="text-lg font-bold text-primary-foreground tracking-tight">
            Residencial <span className="text-gradient-gold">Morada do Sol II</span>
          </span>
        </Link>

        {/* Navegação Focada no CondoMarket */}
        <nav className="flex items-center gap-2">
          <Link
            to="/condo-market"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-accent text-accent-foreground shadow-md transition-all"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>CondoMarket</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
