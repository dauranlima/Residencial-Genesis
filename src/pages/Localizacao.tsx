import { motion } from "framer-motion";
import { MapPin, Phone, Clock } from "lucide-react";

export default function Localizacao() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-gradient-gold">Localização</span>
        </h1>
        <p className="text-muted-foreground mb-8">Como chegar ao Residencial Morada do Sol 2.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map */}
        <div className="lg:col-span-2 rounded-xl overflow-hidden border border-border shadow-luxury h-[450px]">
          <iframe
            title="Localização do Condomínio"
            src="https://maps.google.com/maps?q=Jorge+Lacerda+855,+Cascavel+-+PR&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          />
        </div>
        {/* Info */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-card border border-border">
            <MapPin className="h-8 w-8 text-accent mb-3" />
            <h3 className="font-semibold text-lg mb-2">Endereço</h3>
            <p className="text-muted-foreground text-sm">
              Jorge Lacerda, 855<br />
              Cascavel, PR<br />
              CEP: 85810-220<br />
              Telefone: 45 99847-0171
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border">
            <Phone className="h-8 w-8 text-accent mb-3" />
            <h3 className="font-semibold text-lg mb-2">Contato SÍNDICO </h3>
            <p className="text-muted-foreground text-sm">
              (45) 99847-0171<br />
            </p>
            <h3 className="font-semibold text-lg mb-2">W L AVANCINI CONTABILIDADE </h3>
            <p className="text-muted-foreground text-sm">
              (45) 3038-2266<br />
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border">
            <Clock className="h-8 w-8 text-accent mb-3" />
            <h3 className="font-semibold text-lg mb-2">Horário da Portaria</h3>
            <p className="text-muted-foreground text-sm">segunda a sexta das 08:00 as 12:00</p>
            <p className="text-muted-foreground text-sm">sábado das 08:00 as 11:45</p>
          </div>
        </div>
      </div>
    </div>
  );
}
