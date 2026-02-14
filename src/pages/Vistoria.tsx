import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ClipboardCheck } from "lucide-react";

const checklistItems = [
  "Paredes em bom estado",
  "Piso sem defeitos",
  "Instalações elétricas funcionando",
  "Encanamento sem vazamentos",
  "Janelas e portas em bom estado",
  "Chaves entregues",
  "Pintura sem manchas",
  "Ar-condicionado funcionando",
];

export default function Vistoria() {
  const { toast } = useToast();
  const [checked, setChecked] = useState<string[]>([]);

  const toggle = (item: string) =>
    setChecked((prev) => prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Vistoria enviada!", description: `${checked.length} itens verificados.` });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2"><span className="text-gradient-gold">Vistoria</span></h1>
        <p className="text-muted-foreground mb-8">Checklist de entrada/saída do apartamento.</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-5 p-6 rounded-xl bg-card border border-border">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div><Label>Apartamento</Label><Input required placeholder="Ex: 101" /></div>
          <div><Label>Tipo</Label><Input required placeholder="Entrada ou Saída" /></div>
        </div>

        <div>
          <Label className="mb-3 block">Checklist de Itens</Label>
          <div className="space-y-3">
            {checklistItems.map((item) => (
              <label key={item} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-muted transition-colors">
                <Checkbox checked={checked.includes(item)} onCheckedChange={() => toggle(item)} />
                <span className="text-sm">{item}</span>
              </label>
            ))}
          </div>
        </div>

        <div><Label>Observações</Label><Textarea placeholder="Algum problema encontrado?" /></div>

        <Button type="submit" className="w-full" variant="hero">
          <ClipboardCheck className="h-4 w-4 mr-2" /> Enviar Vistoria
        </Button>
      </form>
    </div>
  );
}
