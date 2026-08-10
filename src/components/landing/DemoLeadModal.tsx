import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Building2, Sparkles, CheckCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { saveLandingLead } from '@/lib/landingLeadService';
import { toast } from 'sonner';

interface DemoLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: string;
}

export default function DemoLeadModal({
  isOpen,
  onClose,
  selectedPlan = 'Profissional',
}: DemoLeadModalProps) {
  const [name, setName] = useState('');
  const [condoName, setCondoName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [unitsCount, setUnitsCount] = useState('');
  const [plan, setPlan] = useState(selectedPlan);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (selectedPlan) {
      setPlan(selectedPlan);
    }
  }, [selectedPlan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !condoName || !phone) {
      toast.error('Por favor, preencha os campos obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      await saveLandingLead({
        name,
        condo_name: condoName,
        email,
        phone,
        units_count: unitsCount,
        plan_selected: plan,
      });

      setSuccess(true);
      toast.success('Solicitação enviada com sucesso!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setName('');
    setCondoName('');
    setEmail('');
    setPhone('');
    setUnitsCount('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleReset}>
      <DialogContent className="sm:max-w-[540px] bg-slate-900 text-slate-100 border-slate-800 p-0 overflow-hidden shadow-2xl">
        {/* Banner Superior Gold/Navy */}
        <div className="bg-gradient-to-r from-slate-950 via-[#1B2A4A] to-slate-950 p-6 border-b border-amber-500/20 relative">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-xs font-semibold px-2.5 py-0.5">
              <Sparkles className="w-3 h-3 mr-1 text-amber-400" />
              7 Dias de Teste Grátis
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-bold text-white tracking-tight">
            Experimente o viziGO
          </DialogTitle>
          <DialogDescription className="text-slate-300 text-sm mt-1">
            Preencha os dados abaixo para receber seu teste gratuito imediato e suporte dedicado.
          </DialogDescription>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-amber-500/20 border border-amber-500/40 text-amber-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Solicitação Recebida com Sucesso!</h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto">
              Nossa equipe de consultores entrará em contato via WhatsApp no número fornecido para liberar seu acesso ao condomínio{' '}
              <strong className="text-amber-300">{condoName}</strong>.
            </p>

            <div className="pt-4 border-t border-slate-800 flex justify-center">
              <Button
                onClick={handleReset}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8"
              >
                Concluir
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300">
                Nome do Responsável / Síndico <span className="text-amber-400">*</span>
              </Label>
              <Input
                placeholder="Ex: Ana Maria Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300">
                  Nome do Condomínio <span className="text-amber-400">*</span>
                </Label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <Input
                    placeholder="Ex: Cond. Residencial Gênesis"
                    value={condoName}
                    onChange={(e) => setCondoName(e.target.value)}
                    required
                    className="bg-slate-950/80 border-slate-800 text-slate-100 pl-9 placeholder:text-slate-500 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300">Nº de Unidades/Apartamentos</Label>
                <Input
                  placeholder="Ex: 48 unidades"
                  value={unitsCount}
                  onChange={(e) => setUnitsCount(e.target.value)}
                  className="bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300">
                  WhatsApp / Celular <span className="text-amber-400">*</span>
                </Label>
                <Input
                  placeholder="(11) 99999-8888"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300">E-mail Comercial</Label>
                <Input
                  type="email"
                  placeholder="sindico@condominio.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300">Plano de Interesse</Label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="w-full h-10 rounded-md bg-slate-950/80 border border-slate-800 text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Essencial">Plano Essencial (Até 32 unidades) - R$ 79/mês</option>
                <option value="Profissional">Plano Profissional (Até 120 unidades - Mais Popular) - R$ 129/mês</option>
                <option value="Enterprise">Plano Enterprise (Condomínios 120+ u.) - R$ 249/mês</option>
              </select>
            </div>

            <div className="pt-2 flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Seus dados estão protegidos
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-slate-800 text-slate-300 hover:bg-slate-800"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Ativar 7 Dias Grátis'
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
