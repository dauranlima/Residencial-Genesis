import { Link } from "react-router-dom";
import { Building2, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-6 w-6 text-accent" />
              <span className="text-lg font-bold">Residencial Morada do Sol II</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Seu condomínio com gestão moderna e eficiente.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-accent">Links Rápidos</h3>
            <nav className="flex flex-col gap-2">
              {[
                { title: "Apartamentos", path: "/apartamentos" },
                { title: "Galeria", path: "/galeria" },
                { title: "Regimento Interno", path: "/regimento" },
                { title: "Outros Imóveis", path: "/outros-imoveis" },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-accent">Contato</h3>
            <div className="flex flex-col gap-3 text-sm text-primary-foreground/70">
              <a href="tel:+5511999999999" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Phone className="h-4 w-4" /> (45) 9847-0171
              </a>
              <a href="mailto:contato@moradadosol2.com" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Mail className="h-4 w-4" /> contato@moradao2.com
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Rua Jorge Lacerda, 855
Bairro Centro
Cascavel - PR - 85810-220
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-8 pt-6 text-center text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} Residencial Morada do Sol II. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
