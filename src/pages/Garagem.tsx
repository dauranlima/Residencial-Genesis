import { motion } from "framer-motion";
import { Car, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const vagas = [
  { numero: "M01", apartamento: "101", proprietario: "Morador x", tipo: "Coberta" },
  { numero: "M02", apartamento: "102", proprietario: "Morador x", tipo: "Coberta" },
  { numero: "M03", apartamento: "103", proprietario: "Morador x", tipo: "Descoberta" },
  { numero: "M04", apartamento: "104", proprietario: "Morador x", tipo: "Coberta" },
  { numero: "C01", apartamento: "105", proprietario: "Morador x", tipo: "Descoberta" },
  { numero: "C02", apartamento: "106", proprietario: "Morador x", tipo: "Coberta" },
  { numero: "C03", apartamento: "107", proprietario: "Morador x", tipo: "Coberta" },
  { numero: "C04", apartamento: "108", proprietario: "Morador x", tipo: "Descoberta" },
];

export default function Garagem() {
  const [search, setSearch] = useState("");

  const filtered = vagas.filter(
    (v) => v.numero.toLowerCase().includes(search.toLowerCase()) ||
      v.apartamento.includes(search) ||
      v.proprietario.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2"><span className="text-gradient-gold">Garagem</span></h1>
        <p className="text-muted-foreground mb-6">Mapa de vagas e consulta por proprietário.</p>
      </motion.div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por vaga, apartamento ou nome..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((vaga, i) => (
          <motion.div
            key={vaga.numero}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:shadow-luxury transition-shadow"
          >
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              {vaga.numero}
            </div>
            <div className="flex-1">
              <p className="font-medium text-card-foreground">{vaga.proprietario}</p>
              <p className="text-sm text-muted-foreground">Apt. {vaga.apartamento}</p>
            </div>
            <Badge variant={vaga.tipo === "Coberta" ? "default" : "secondary"}>
              {vaga.tipo}
            </Badge>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
