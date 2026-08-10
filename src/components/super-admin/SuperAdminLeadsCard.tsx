import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  Building2,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Search,
} from 'lucide-react';
import {
  LandingLead,
  getLandingLeads,
  updateLeadStatus,
  deleteLead,
} from '@/lib/landingLeadService';
import { toast } from 'sonner';

export default function SuperAdminLeadsCard() {
  const [leads, setLeads] = useState<LandingLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'todos' | 'novo' | 'em_contato' | 'aprovado'>('todos');
  const [search, setSearch] = useState('');

  const loadLeads = async () => {
    setLoading(true);
    try {
      const data = await getLandingLeads();
      setLeads(data);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao carregar solicitações.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleStatusChange = async (id: string, status: LandingLead['status']) => {
    try {
      await updateLeadStatus(id, status);
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
      toast.success('Status atualizado com sucesso!');
    } catch (err) {
      console.error(err);
      toast.error('Falha ao atualizar status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta solicitação?')) return;
    try {
      await deleteLead(id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
      toast.success('Solicitação excluída.');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao excluir solicitação.');
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesFilter = filter === 'todos' || lead.status === filter;
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.condo_name.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search) ||
      lead.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalLeads = leads.length;
  const newLeadsCount = leads.filter((l) => l.status === 'novo').length;
  const inContactCount = leads.filter((l) => l.status === 'em_contato').length;

  const openWhatsApp = (phone: string, condoName: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const text = encodeURIComponent(
      `Olá ${name}, referente à solicitação de demonstração do Residencial Gênesis para o condomínio ${condoName}. Podemos agendar sua apresentação?`
    );
    window.open(`https://wa.me/${formattedPhone}?text=${text}`, '_blank');
  };

  return (
    <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl overflow-hidden">
      <CardHeader className="border-b border-slate-800 bg-slate-950/50 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-xs font-semibold px-2.5 py-0.5">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                Landing Page Leads
              </Badge>
              {newLeadsCount > 0 && (
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse">
                  {newLeadsCount} Novo{newLeadsCount > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl font-bold text-white mt-1 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              Solicitações de Demonstração & Testes
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Gerencie os condomínios e síndicos cadastrados via Landing Page do Residencial Gênesis.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadLeads}
              disabled={loading}
              className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Resumo de Indicadores */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-800/80">
          <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block">Total Recebidos</span>
            <span className="text-lg font-bold text-white">{totalLeads}</span>
          </div>
          <div className="bg-amber-500/10 rounded-lg p-2.5 border border-amber-500/20 text-center">
            <span className="text-xs text-amber-300 block">Novos Pendentes</span>
            <span className="text-lg font-bold text-amber-400">{newLeadsCount}</span>
          </div>
          <div className="bg-blue-500/10 rounded-lg p-2.5 border border-blue-500/20 text-center">
            <span className="text-xs text-blue-300 block">Em Negociação</span>
            <span className="text-lg font-bold text-blue-400">{inContactCount}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Barra de Busca e Filtros */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por nome, condomínio, fone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-md text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex gap-1.5 bg-slate-950 p-1 rounded-md border border-slate-800 w-full sm:w-auto">
            {(['todos', 'novo', 'em_contato', 'aprovado'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`text-xs px-3 py-1 rounded transition-colors ${
                  filter === st
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st === 'todos'
                  ? 'Todos'
                  : st === 'novo'
                  ? 'Novos'
                  : st === 'em_contato'
                  ? 'Em Contato'
                  : 'Aprovados'}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Cadastros */}
        {filteredLeads.length === 0 ? (
          <div className="py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-lg">
            <Users className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <p className="text-sm font-medium">Nenhuma solicitação encontrada.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className="bg-slate-950/60 border border-slate-800 hover:border-slate-700 rounded-lg p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-white text-base">{lead.condo_name}</span>
                    <Badge
                      className={`text-[10px] font-semibold px-2 py-0.5 ${
                        lead.plan_selected === 'Profissional'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : lead.plan_selected === 'Enterprise'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      }`}
                    >
                      Plano {lead.plan_selected}
                    </Badge>
                    {lead.units_count && (
                      <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-300">
                        {lead.units_count} un.
                      </Badge>
                    )}
                  </div>

                  <div className="text-xs text-slate-300 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="font-semibold text-amber-200">👤 {lead.name}</span>
                    <span className="flex items-center text-slate-400">
                      <Phone className="w-3 h-3 mr-1 text-slate-500" />
                      {lead.phone}
                    </span>
                    {lead.email && (
                      <span className="flex items-center text-slate-400">
                        <Mail className="w-3 h-3 mr-1 text-slate-500" />
                        {lead.email}
                      </span>
                    )}
                    <span className="flex items-center text-slate-500 text-[11px]">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(lead.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800 justify-between md:justify-end">
                  {/* Select Status */}
                  <select
                    value={lead.status}
                    onChange={(e) =>
                      handleStatusChange(lead.id, e.target.value as LandingLead['status'])
                    }
                    className={`text-xs font-semibold px-2.5 py-1.5 rounded-md border focus:outline-none ${
                      lead.status === 'novo'
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : lead.status === 'em_contato'
                        ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                        : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    <option value="novo" className="bg-slate-900 text-amber-300">
                      Novo
                    </option>
                    <option value="em_contato" className="bg-slate-900 text-blue-300">
                      Em Contato
                    </option>
                    <option value="aprovado" className="bg-slate-900 text-emerald-300">
                      Aprovado / Cliente
                    </option>
                  </select>

                  {/* Botão WhatsApp */}
                  <Button
                    size="sm"
                    onClick={() => openWhatsApp(lead.phone, lead.condo_name, lead.name)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-8 px-3 gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    WhatsApp
                  </Button>

                  {/* Botão Deletar */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(lead.id)}
                    className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-950/40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
