import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Fingerprint, KeyRound, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Solicitacoes() {
  const { toast } = useToast();
  const [tipo, setTipo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Solicitação enviada!", description: "Entraremos em contato em breve." });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2"><span className="text-gradient-gold">Solicitações</span></h1>
        <p className="text-muted-foreground mb-8">Solicite controles de acesso ou agendamento de biometria.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="p-6 rounded-xl bg-card border border-border text-center">
          <Fingerprint className="h-10 w-10 text-accent mx-auto mb-3" />
          <h3 className="font-semibold">Biometria</h3>
          <p className="text-sm text-muted-foreground">Agende seu cadastro biométrico</p>
        </div>
        <div className="p-6 rounded-xl bg-card border border-border text-center">
          <KeyRound className="h-10 w-10 text-accent mx-auto mb-3" />
          <h3 className="font-semibold">Controles</h3>
          <p className="text-sm text-muted-foreground">Solicite controles extras</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 p-6 rounded-xl bg-card border border-border">
        <div>
          <Label>Nome Completo</Label>
          <Input required placeholder="Seu nome" />
        </div>
        <div>
          <Label>Apartamento</Label>
          <Input required placeholder="Ex: 101" />
        </div>
        <div>
          <Label>Tipo de Solicitação</Label>
          <Select value={tipo} onValueChange={setTipo}>
            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="biometria">Cadastro de Biometria</SelectItem>
              <SelectItem value="controle">Controle de Acesso</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Observações</Label>
          <Textarea placeholder="Detalhes adicionais..." />
        </div>
        <Button type="submit" className="w-full" variant="hero">
          <Send className="h-4 w-4 mr-2" /> Enviar Solicitação
        </Button>
      </form>
    </div>
  );
}
