import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building2, Camera, MapPin, ClipboardCheck, Car, Home, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-condo.jpg";
import heroImageMob from "@/assets/hero-condoMob.png";

const features = [
  { icon: Building2, title: "Apartamentos", desc: "Conheça nossos flats exclusivos", path: "/apartamentos" },
  { icon: Camera, title: "Galeria", desc: "Fotos do condomínio", path: "/galeria" },
  { icon: MapPin, title: "Localização", desc: "Como chegar", path: "/localizacao" },
  { icon: ClipboardCheck, title: "Solicitações", desc: "Biometria e controles", path: "/solicitacoes" },
  { icon: Car, title: "Garagem", desc: "Mapa de vagas", path: "/garagem" },
  { icon: Home, title: "Outros Imóveis", desc: "Imóveis disponíveis", path: "/outros-imoveis" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <picture className="absolute inset-0 w-full h-full">
          <source media="(max-width: 767px)" srcSet={heroImageMob} />
          <img src={heroImage} alt="Residencial Morada do Sol II" className="w-full h-full object-cover" />
        </picture>
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4 leading-tight"
          >
            Condomínio Residencial <span className="text-gradient-gold">Morada do Sol 2</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-primary-foreground/80 mb-8"
          >
            A experiência de viver bem em um condomínio moderno e seguro.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button variant="hero" size="lg" asChild>
              <Link to="/vizigo">Acessar viziGO</Link>
            </Button>
            <Button variant="hero-outline" size="lg" asChild>
              <Link to="/avisos">Avisos Importantes</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid - Seção desativada temporariamente */}
      {/* 
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nossos <span className="text-gradient-gold">Serviços</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Link
                  to={f.path}
                  className="group block p-6 rounded-xl bg-card border border-border hover:shadow-luxury transition-all duration-300 hover:-translate-y-1"
                >
                  <f.icon className="h-10 w-10 text-accent mb-4" />
                  <h3 className="font-semibold text-lg text-card-foreground mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{f.desc}</p>
                  <span className="inline-flex items-center text-sm text-accent font-medium group-hover:gap-2 transition-all">
                    Acessar <ArrowRight className="h-4 w-4 ml-1" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      */}
    </div>
  );
}
