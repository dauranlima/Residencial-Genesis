import { motion } from "framer-motion";
import { MapPin, Phone, Clock } from "lucide-react";

export default function Localizacao() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-gradient-gold">Localização</span>
        </h1>
        <p className="text-muted-foreground mb-8">Como chegar ao Residencial Genesis.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map */}
        <div className="lg:col-span-2 rounded-xl overflow-hidden border border-border shadow-luxury h-[450px]">
          <iframe
            title="Localização do Condomínio"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.337036727727!2d-53.44697742462615!3d-24.98869157784654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f3d5afdbb661ed%3A0x9afabf0d5fc95509!2sR.%20Sociologia%2C%201264%20-%20Universit%C3%A1rio%2C%20Cascavel%20-%20PR%2C%2085819-250!5e0!3m2!1spt-BR!2sbr!4v1715873954000!5m2!1spt-BR!2sbr"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          />
        </div>
        <div className="lg:col-span-2 rounded-xl overflow-hidden border border-border shadow-luxury h-[450px]"  >
          <div className="rounded-xl overflow-hidden border border-border shadow-luxury h-[450px]">
            <iframe
              title="Vista de Rua"
              src="https://www.google.com/maps/embed?pb=!4v1579353453285!6m8!1m7!1sFsPX20yjDAFc1t-03W5VcQ!2m2!1d-24.98838048864505!2d-53.4441732712156!3f279.93!4f0!5f0.7820865974627469"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-card border border-border">
            <MapPin className="h-8 w-8 text-accent mb-3" />
            <h3 className="font-semibold text-lg mb-2">Endereço</h3>
            <p className="text-muted-foreground text-sm">
              Rua Sociologia, 1264<br />
              Bairro Faculdade - Cascavel, PR<br />
              CEP: 85819-250<br />
              Telefone: 45 99915-8889
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border">
            <Phone className="h-8 w-8 text-accent mb-3" />
            <h3 className="font-semibold text-lg mb-2">Contato DELIBERATIVO </h3>
            <p className="text-muted-foreground text-sm">
              (45) 99915-8889<br />
              deliberativo@residencialgenesis.com
            </p>
            <h3 className="font-semibold text-lg mb-2">CONSELHO FISCAL </h3>
            <p className="text-muted-foreground text-sm">
              conselhofiscal@residencialgenesis.com
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border">
            <Clock className="h-8 w-8 text-accent mb-3" />
            <h3 className="font-semibold text-lg mb-2">Horário da Portaria</h3>
            <p className="text-muted-foreground text-sm">24 horas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
