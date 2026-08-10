import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutGrid,
  Search,
  CheckCircle2,
  Construction,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Building2,
  ShoppingBag,
  MapPin,
  Bell,
  FileText,
  FileCheck,
  Car,
  Image as ImageIcon,
  MessageSquare,
  ClipboardCheck,
  UserCheck,
  Home,
  SlidersHorizontal,
  Lock,
  Unlock,
  Database,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  PageConfig,
  getPageConfigs,
  setPageEnabled,
  toggleAllPages,
  resetPagesToDefault,
  subscribeToPageStatusChanges,
  syncPagesFromSupabase,
} from '@/lib/pageStatusService';
import { toast } from 'sonner';

// Mapeamento de ícones por ID de página
const PAGE_ICONS: Record<string, React.ElementType> = {
  'condo-market': ShoppingBag,
  localizacao: MapPin,
  admin: Building2,
  avisos: Bell,
  apartamentos: Home,
  'ficha-cadastral': FileText,
  'ficha-fiador': UserCheck,
  garagem: Car,
  galeria: ImageIcon,
  solicitacoes: MessageSquare,
  vistoria: ClipboardCheck,
  regimento: FileCheck,
  'outros-imoveis': Building2,
  login: Lock,
  'super-admin': ShieldCheck,
  'adm-login': Lock,
};

export default function SystemPagesControlCard() {
  const [pages, setPages] = useState<PageConfig[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const refreshPages = () => {
    setPages(getPageConfigs());
  };

  useEffect(() => {
    refreshPages();
    const unsubscribe = subscribeToPageStatusChanges(() => {
      refreshPages();
    });
    return () => unsubscribe();
  }, []);

  const handleToggle = (page: PageConfig, checked: boolean) => {
    if (page.isCore) {
      toast.info(`A tela ${page.name} é do núcleo administrativo e não pode ser desativada.`);
      return;
    }

    setPageEnabled(page.id, checked);
    if (checked) {
      toast.success(`Tela "${page.name}" foi LIBERADA com sucesso!`);
    } else {
      toast.warning(`Tela "${page.name}" foi definida como EM DESENVOLVIMENTO.`);
    }
  };

  const handleToggleAll = (enable: boolean) => {
    toggleAllPages(enable);
    if (enable) {
      toast.success('Todas as telas do sistema foram liberadas.');
    } else {
      toast.warning('Todas as telas configuráveis foram marcadas como Em Desenvolvimento.');
    }
  };

  const handleResetDefaults = () => {
    resetPagesToDefault();
    toast.info('Status padrão das telas foi restaurado.');
  };

  const stats = useMemo(() => {
    const total = pages.length;
    const enabledCount = pages.filter((p) => p.enabled).length;
    const disabledCount = total - enabledCount;
    return { total, enabledCount, disabledCount };
  }, [pages]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(pages.map((p) => p.category)));
    return ['Todas', ...cats];
  }, [pages]);

  const filteredPages = useMemo(() => {
    return pages.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.path.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [pages, search, selectedCategory]);

  return (
    <Card className="bg-slate-900/90 border-slate-800 shadow-xl overflow-hidden">
      <CardHeader className="border-b border-slate-800/80 pb-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 shrink-0">
              <LayoutGrid className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-lg font-bold text-slate-100">
                  Gerenciamento de Telas & Módulos do Sistema
                </CardTitle>
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px] uppercase font-bold">
                  Super Admin Control
                </Badge>
              </div>
              <CardDescription className="text-xs text-slate-400 mt-1">
                Ligue e desligue telas através de Toggle Buttons. Quando desligada, a tela exibirá a mensagem "Página em Desenvolvimento".
              </CardDescription>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="bg-slate-950 border-slate-700 text-slate-300 text-xs py-1 px-2.5">
              Total: <strong className="ml-1 text-slate-100">{stats.total}</strong>
            </Badge>
            <Badge variant="outline" className="bg-emerald-950/40 border-emerald-500/40 text-emerald-400 text-xs py-1 px-2.5">
              Liberadas: <strong className="ml-1 text-emerald-300">{stats.enabledCount}</strong>
            </Badge>
            <Badge variant="outline" className="bg-amber-950/40 border-amber-500/40 text-amber-400 text-xs py-1 px-2.5">
              Bloqueadas: <strong className="ml-1 text-amber-300">{stats.disabledCount}</strong>
            </Badge>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={async () => {
                const res = await syncPagesFromSupabase();
                setPages(res);
                toast.success('Status das telas sincronizado com o banco de dados Supabase!');
              }}
              className="bg-slate-950 border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/40 text-xs h-7 px-2.5 font-semibold flex items-center gap-1"
              title="Carregar alterações do banco de dados Supabase"
            >
              <Database className="w-3 h-3 text-emerald-400" />
              <span>Sincronizar DB</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Controls Header: Search, Category Tabs, Bulk Actions */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Buscar por nome ou rota..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-slate-950/70 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/50 text-xs h-9"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 justify-end shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleToggleAll(true)}
              className="bg-slate-950 border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-300 text-[11px] h-8 px-2.5 font-semibold"
            >
              <Unlock className="w-3 h-3 mr-1" />
              Liberar Todas
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleToggleAll(false)}
              className="bg-slate-950 border-amber-500/30 text-amber-400 hover:bg-amber-950/40 hover:text-amber-300 text-[11px] h-8 px-2.5 font-semibold"
            >
              <Lock className="w-3 h-3 mr-1" />
              Bloquear Todas
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResetDefaults}
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-[11px] h-8 px-2.5"
              title="Restaurar padrão inicial"
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* List Grid of System Pages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPages.map((page) => {
            const IconComponent = PAGE_ICONS[page.id] || Building2;

            return (
              <div
                key={page.id}
                className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between gap-3 ${
                  page.enabled
                    ? 'bg-slate-950/60 border-slate-800/90 hover:border-emerald-500/30'
                    : 'bg-slate-950/40 border-amber-500/20 opacity-85 hover:opacity-100'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${
                        page.enabled
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-slate-100 leading-tight">{page.name}</h4>
                        <Badge
                          variant="outline"
                          className="text-[9px] py-0 px-1.5 border-slate-700 text-slate-400 font-mono"
                        >
                          {page.category}
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{page.description}</p>
                      
                      <div className="flex items-center gap-2 pt-0.5">
                        <code className="text-[10px] text-slate-500 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {page.path}
                        </code>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0 pt-0.5">
                    {page.isCore ? (
                      <Badge className="bg-slate-800 text-amber-300 border-amber-500/30 text-[9px] uppercase font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Core
                      </Badge>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Switch
                          id={`switch-${page.id}`}
                          checked={page.enabled}
                          onCheckedChange={(checked) => handleToggle(page, checked)}
                          className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-slate-800"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer status bar for each item */}
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    {page.enabled ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Liberada no Sistema
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-400 font-medium">
                        <Construction className="w-3.5 h-3.5" />
                        Em Desenvolvimento
                      </span>
                    )}
                  </div>

                  <a
                    href={page.path}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-amber-300 flex items-center gap-1 text-[11px] font-medium transition-colors"
                  >
                    <span>Testar Rota</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPages.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-xs bg-slate-950/40 rounded-xl border border-slate-800/80">
            Nenhuma tela encontrada para o filtro de busca "{search}".
          </div>
        )}
      </CardContent>
    </Card>
  );
}
