import React, { useState, useEffect } from 'react';
import {
  Building2,
  Home,
  Users,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle2,
  UserPlus,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getCustomTowers,
  fetchTowersFromSupabase,
  addCustomTower,
  removeCustomTower,
  getCustomApts,
  fetchUnitsFromSupabase,
  addCustomApt,
  removeCustomApt,
  getRegisteredResidents,
  addRegisteredResident,
  removeRegisteredResident,
  resetUnitsToDefault,
  CondoResident,
} from '@/lib/condoUnits';
import { toast } from 'sonner';

export default function SuperAdminCondoUnitsCard() {
  const [activeTab, setActiveTab] = useState<'towers' | 'apts' | 'residents'>('towers');

  // States
  const [towers, setTowers] = useState<string[]>([]);
  const [apts, setApts] = useState<string[]>([]);
  const [residents, setResidents] = useState<CondoResident[]>([]);

  // Inputs
  const [newTowerName, setNewTowerName] = useState('');
  const [newAptNumber, setNewAptNumber] = useState('');
  const [batchAptStart, setBatchAptStart] = useState('');
  const [batchAptEnd, setBatchAptEnd] = useState('');

  // Resident Form Input
  const [resName, setResName] = useState('');
  const [resBlock, setResBlock] = useState('');
  const [resUnit, setResUnit] = useState('');
  const [resPhone, setResPhone] = useState('');

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    // 1. Carregar local imediato
    setTowers(getCustomTowers());
    setApts(getCustomApts());
    setResidents(getRegisteredResidents());

    // 2. Sincronizar com Supabase em segundo plano
    const remoteTowers = await fetchTowersFromSupabase();
    if (remoteTowers && remoteTowers.length > 0) setTowers(remoteTowers);

    const remoteApts = await fetchUnitsFromSupabase();
    if (remoteApts && remoteApts.length > 0) setApts(remoteApts);
  };

  // Handler: Adicionar Torre
  const handleAddTower = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTowerName.trim()) {
      toast.error('Digite o nome da Torre ou Bloco.');
      return;
    }
    const updated = addCustomTower(newTowerName);
    setTowers(updated);
    setNewTowerName('');
    toast.success(`Torre "${newTowerName.trim()}" cadastrada com sucesso!`);
  };

  // Handler: Remover Torre
  const handleRemoveTower = (tower: string) => {
    const updated = removeCustomTower(tower);
    setTowers(updated);
    toast.success(`Torre "${tower}" removida.`);
  };

  // Handler: Adicionar Apartamento Individual
  const handleAddApt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAptNumber.trim()) {
      toast.error('Digite o número do apartamento ou casa.');
      return;
    }
    const updated = addCustomApt(newAptNumber);
    setApts(updated);
    setNewAptNumber('');
    toast.success(`Unidade "${newAptNumber.trim()}" cadastrada com sucesso!`);
  };

  // Handler: Adicionar Faixa de Aptos em Lote (Ex: 101 a 105)
  const handleAddBatchApts = (e: React.FormEvent) => {
    e.preventDefault();
    const start = parseInt(batchAptStart, 10);
    const end = parseInt(batchAptEnd, 10);

    if (isNaN(start) || isNaN(end) || start > end) {
      toast.error('Informe um intervalo válido (Ex: de 101 a 105).');
      return;
    }

    if (end - start > 100) {
      toast.error('Limite máximo de 100 unidades por lote.');
      return;
    }

    let count = 0;
    let currentApts = apts;
    for (let i = start; i <= end; i++) {
      currentApts = addCustomApt(i.toString());
      count++;
    }
    setApts(currentApts);
    setBatchAptStart('');
    setBatchAptEnd('');
    toast.success(`${count} apartamentos (${start} a ${end}) adicionados em lote!`);
  };

  // Handler: Remover Apartamento
  const handleRemoveApt = (apt: string) => {
    const updated = removeCustomApt(apt);
    setApts(updated);
    toast.success(`Unidade "${apt}" removida.`);
  };

  // Handler: Adicionar Morador Manualmente
  const handleAddResident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resName.trim() || !resUnit.trim()) {
      toast.error('Preencha ao menos Nome e Apartamento do morador.');
      return;
    }

    const updated = addRegisteredResident(resName, resBlock, resUnit, resPhone);
    setResidents(updated);
    setResName('');
    setResBlock('');
    setResUnit('');
    setResPhone('');
    toast.success(`Morador(a) ${resName} cadastrado(a) com sucesso!`);
  };

  // Handler: Remover Morador
  const handleRemoveResident = (id: string, name: string) => {
    const updated = removeRegisteredResident(id);
    setResidents(updated);
    toast.success(`Morador(a) "${name}" removido(a).`);
  };

  // Handler: Resetar para Padrões
  const handleResetDefaults = () => {
    if (window.confirm('Deseja restaurar as Torres e Apartamentos padrão do condomínio?')) {
      const res = resetUnitsToDefault();
      setTowers(res.towers);
      setApts(res.apts);
      toast.success('Torres e Apartamentos restaurados para o padrão.');
    }
  };

  // Filtered lists
  const filteredTowers = towers.filter((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredApts = apts.filter((a) => a.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredResidents = residents.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.includes(searchTerm)
  );

  return (
    <Card className="bg-slate-900/90 border-slate-800 shadow-xl overflow-hidden">
      <CardHeader className="border-b border-slate-800/80 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Cadastros do Condomínio
                <Badge variant="outline" className="border-amber-500/40 text-amber-400 bg-amber-500/10 text-[10px]">
                  Super-Admin
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Gerencie Torres/Blocos, Apartamentos/Casas e Moradores autorizados.
              </CardDescription>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResetDefaults}
            className="text-xs text-slate-400 hover:text-amber-300 hover:bg-amber-500/10"
            title="Resetar Torres e Apartamentos padrão"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Reset Padrão
          </Button>
        </div>

        {/* Stats Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-800/60">
          <Badge className="bg-slate-800 text-slate-200 hover:bg-slate-700 px-3 py-1 font-medium">
            <Building2 className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
            {towers.length} Torres/Blocos
          </Badge>
          <Badge className="bg-slate-800 text-slate-200 hover:bg-slate-700 px-3 py-1 font-medium">
            <Home className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            {apts.length} Apts / Casas
          </Badge>
          <Badge className="bg-slate-800 text-slate-200 hover:bg-slate-700 px-3 py-1 font-medium">
            <Users className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
            {residents.length} Moradores
          </Badge>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-4">
          <Button
            variant={activeTab === 'towers' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('towers')}
            className={`text-xs font-semibold ${
              activeTab === 'towers'
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold'
                : 'border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 mr-1.5" />
            Torres / Blocos ({towers.length})
          </Button>

          <Button
            variant={activeTab === 'apts' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('apts')}
            className={`text-xs font-semibold ${
              activeTab === 'apts'
                ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold'
                : 'border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Home className="w-3.5 h-3.5 mr-1.5" />
            Apartamentos / Casas ({apts.length})
          </Button>

          <Button
            variant={activeTab === 'residents' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('residents')}
            className={`text-xs font-semibold ${
              activeTab === 'residents'
                ? 'bg-blue-500 hover:bg-blue-600 text-slate-950 font-bold'
                : 'border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5 mr-1.5" />
            Moradores (Opcional) ({residents.length})
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <Input
            placeholder={`Buscar em ${
              activeTab === 'towers' ? 'Torres' : activeTab === 'apts' ? 'Apartamentos' : 'Moradores'
            }...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-slate-950/60 border-slate-800 text-slate-200 text-sm h-10"
          />
        </div>

        {/* TAB 1: TORRES / BLOCOS */}
        {activeTab === 'towers' && (
          <div className="space-y-6">
            {/* Form Adicionar Torre */}
            <form onSubmit={handleAddTower} className="flex gap-2">
              <Input
                placeholder="Nome da nova Torre/Bloco (Ex: Torre E, Bloco 05, Casa)..."
                value={newTowerName}
                onChange={(e) => setNewTowerName(e.target.value)}
                className="bg-slate-950 border-slate-700 text-slate-100 text-sm h-10 flex-1"
              />
              <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold h-10">
                <Plus className="w-4 h-4 mr-1" />
                Cadastrar Torre
              </Button>
            </form>

            {/* Listagem de Torres */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredTowers.map((tower) => (
                <div
                  key={tower}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-sm text-slate-100">{tower}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveTower(tower)}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                    title="Remover Torre"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {filteredTowers.length === 0 && (
                <p className="text-xs text-slate-500 col-span-full py-4 text-center">Nenhuma torre encontrada.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: APARTAMENTOS / CASAS */}
        {activeTab === 'apts' && (
          <div className="space-y-6">
            {/* Forms Adicionar Apto Individual + Lote */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
              {/* Form Individual */}
              <form onSubmit={handleAddApt} className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Nova Unidade Individual</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: 601, Casa 12..."
                    value={newAptNumber}
                    onChange={(e) => setNewAptNumber(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-slate-100 text-sm h-9 flex-1"
                  />
                  <Button type="submit" size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold h-9">
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Adicionar
                  </Button>
                </div>
              </form>

              {/* Form Lote */}
              <form onSubmit={handleAddBatchApts} className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Cadastrar Intervalo em Lote</label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="De (Ex: 101)"
                    value={batchAptStart}
                    onChange={(e) => setBatchAptStart(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-slate-100 text-sm h-9"
                  />
                  <span className="text-xs text-slate-400">até</span>
                  <Input
                    placeholder="Até (Ex: 108)"
                    value={batchAptEnd}
                    onChange={(e) => setBatchAptEnd(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-slate-100 text-sm h-9"
                  />
                  <Button type="submit" size="sm" variant="outline" className="border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 font-semibold h-9">
                    Gerar Lote
                  </Button>
                </div>
              </form>
            </div>

            {/* Listagem de Apartamentos */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-72 overflow-y-auto pr-1">
              {filteredApts.map((apt) => (
                <div
                  key={apt}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200 hover:border-emerald-500/40 group transition-colors"
                >
                  <span>{apt}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveApt(apt)}
                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity ml-1"
                    title="Remover Apto"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {filteredApts.length === 0 && (
                <p className="text-xs text-slate-500 col-span-full py-4 text-center">Nenhum apartamento encontrado.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: MORADORES (OPCIONAL) */}
        {activeTab === 'residents' && (
          <div className="space-y-6">
            {/* Form Adicionar Morador */}
            <form onSubmit={handleAddResident} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                <UserPlus className="w-4 h-4" />
                Cadastrar Novo Morador (Pré-Autorizado)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <Input
                  placeholder="Nome Completo *"
                  value={resName}
                  onChange={(e) => setResName(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-slate-100 text-sm h-9"
                />
                <Input
                  placeholder="Torre/Bloco (Ex: Torre A)"
                  value={resBlock}
                  onChange={(e) => setResBlock(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-slate-100 text-sm h-9"
                />
                <Input
                  placeholder="Apto/Casa * (Ex: 511)"
                  value={resUnit}
                  onChange={(e) => setResUnit(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-slate-100 text-sm h-9"
                />
                <Input
                  placeholder="WhatsApp (Ex: 45999999999)"
                  value={resPhone}
                  onChange={(e) => setResPhone(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-slate-100 text-sm h-9"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-9">
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Salvar Morador
                </Button>
              </div>
            </form>

            {/* Tabela de Moradores */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Nome</th>
                    <th className="p-3">Torre / Bloco</th>
                    <th className="p-3">Apto / Casa</th>
                    <th className="p-3">WhatsApp</th>
                    <th className="p-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                  {filteredResidents.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-semibold text-slate-100">{res.name}</td>
                      <td className="p-3 text-amber-300">{res.block || '-'}</td>
                      <td className="p-3 font-bold text-emerald-400">{res.unit}</td>
                      <td className="p-3 font-mono text-slate-400">{res.phone || '-'}</td>
                      <td className="p-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveResident(res.id, res.name)}
                          className="h-7 w-7 p-0 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-md"
                          title="Remover Cadastro"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredResidents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-slate-500">
                        Nenhum morador cadastrado manualmente.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
