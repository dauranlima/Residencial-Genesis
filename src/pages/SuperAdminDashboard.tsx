import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  MessageSquare,
  Globe,
  Key,
  Server,
  Save,
  RefreshCw,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Send,
  Building2,
  Database,
  ExternalLink,
  Info,
  Radio,
  Sliders,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import {
  getWhatsAppConfig,
  saveWhatsAppConfig,
  testWhatsAppConnection,
  getDefaultWhatsAppConfig,
  WhatsAppConfig,
} from '@/lib/whatsappConfigService';
import { toast } from 'sonner';

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<{ email: string; role: string; authenticatedAt: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // WhatsApp Form State
  const [config, setConfig] = useState<WhatsAppConfig>({
    apiUrl: '',
    instance: '',
    token: '',
    webhookUrl: '',
  });

  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });

  // Test Message State
  const [testPhone, setTestPhone] = useState('');
  const [sendingTestMsg, setSendingTestMsg] = useState(false);

  useEffect(() => {
    // 1. Verificar autenticação Super Admin
    const checkAuth = async () => {
      const localSession = localStorage.getItem('vizi_super_admin_session');
      const { data } = await supabase.auth.getSession();

      if (!localSession && !data?.session) {
        toast.error('Acesso restrito ao Super Admin.');
        navigate('/adm-login');
        return;
      }

      let adminEmail = 'dauranlima@gmail.com';
      let adminRole = 'root_admin';

      if (localSession) {
        try {
          const parsed = JSON.parse(localSession);
          adminEmail = parsed.email || adminEmail;
          adminRole = parsed.role || adminRole;
        } catch (_e) {}
      } else if (data?.session?.user?.email) {
        adminEmail = data.session.user.email;
      }

      setSession({
        email: adminEmail,
        role: adminRole,
        authenticatedAt: new Date().toLocaleTimeString(),
      });

      // 2. Carregar configurações do WhatsApp
      try {
        const loadedConfig = await getWhatsAppConfig();
        setConfig(loadedConfig);
      } catch (err) {
        console.error('Erro ao carregar configurações do WhatsApp:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    localStorage.removeItem('vizi_super_admin_session');
    await supabase.auth.signOut().catch(() => {});
    toast.success('Sessão encerrada com sucesso.');
    navigate('/adm-login');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await saveWhatsAppConfig(config);
      if (res.success) {
        toast.success(res.message);
        setConnectionStatus({ status: 'idle', message: '' });
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error('Erro ao salvar configurações: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setConnectionStatus({ status: 'idle', message: 'Testando comunicação com a Evolution API...' });
    try {
      const res = await testWhatsAppConnection(config);
      if (res.success) {
        toast.success(res.message);
        setConnectionStatus({ status: 'success', message: res.message });
      } else {
        toast.warning(res.message);
        setConnectionStatus({ status: 'error', message: res.message });
      }
    } catch (err: any) {
      toast.error('Falha ao testar conexão: ' + err.message);
      setConnectionStatus({ status: 'error', message: err.message });
    } finally {
      setTesting(false);
    }
  };

  const handleRestoreDefaults = () => {
    const defaults = getDefaultWhatsAppConfig();
    setConfig(defaults);
    toast.info('Valores padrão restaurados! Clique em Salvar para aplicar.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Carregando Painel Super Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-12">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/10 border border-amber-500/30 p-2 rounded-xl text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg text-slate-100">Super Admin Dashboard</h1>
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px] uppercase font-bold">
                  Root Mode
                </Badge>
              </div>
              <p className="text-xs text-slate-400 font-mono">Autenticado: {session?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/condo-market')}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100 text-xs hidden sm:flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Ver Sistema</span>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 text-xs flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Banner Alert */}
        <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Radio className="w-5 h-5 animate-pulse" />
              <span>Configuração Dinâmica de Infraestrutura WhatsApp</span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl">
              Altere os parâmetros da Evolution API ou Webhook do WhatsApp em tempo real sem precisar reiniciar o servidor ou alterar arquivos de código. As modificações são sincronizadas no Supabase e mantidas localmente.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10 text-xs py-1 px-3">
              Root User: dauranlima@gmail.com
            </Badge>
          </div>
        </div>

        {/* Dashboard Tabs / Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Config Card (Spans 2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/90 border-slate-800 shadow-xl">
              <CardHeader className="border-b border-slate-800/80 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-100">
                        Configurações da Evolution API / WhatsApp Webhook
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-400">
                        Gerencie a URL, nome da instância, token de segurança e rota de Webhook.
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRestoreDefaults}
                    className="text-xs text-slate-400 hover:text-amber-300 hover:bg-amber-500/10"
                    title="Restaurar valores de variáveis de ambiente .env"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" />
                    Resetar .env
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-6 space-y-5">
                <form id="whatsapp-config-form" onSubmit={handleSave} className="space-y-5">
                  {/* API Base URL */}
                  <div className="space-y-2">
                    <Label htmlFor="apiUrl" className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-amber-400" />
                        URL Base da Evolution API
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Ex: https://evogo.dldigitalsolutions.cloud</span>
                    </Label>
                    <Input
                      id="apiUrl"
                      type="url"
                      placeholder="https://evogo.dldigitalsolutions.cloud"
                      value={config.apiUrl}
                      onChange={(e) => setConfig({ ...config, apiUrl: e.target.value })}
                      className="bg-slate-950/70 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/50 font-mono text-sm h-10"
                      required
                    />
                  </div>

                  {/* Instance & Token Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Instance Name */}
                    <div className="space-y-2">
                      <Label htmlFor="instance" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5 text-amber-400" />
                        Nome da Instância
                      </Label>
                      <Input
                        id="instance"
                        type="text"
                        placeholder="moto-whats-t"
                        value={config.instance}
                        onChange={(e) => setConfig({ ...config, instance: e.target.value })}
                        className="bg-slate-950/70 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/50 font-mono text-sm h-10"
                        required
                      />
                    </div>

                    {/* API Token */}
                    <div className="space-y-2">
                      <Label htmlFor="token" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-amber-400" />
                        Token de Segurança (apikey)
                      </Label>
                      <div className="relative">
                        <Input
                          id="token"
                          type={showToken ? 'text' : 'password'}
                          placeholder="••••••••••••••••••••"
                          value={config.token}
                          onChange={(e) => setConfig({ ...config, token: e.target.value })}
                          className="bg-slate-950/70 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/50 font-mono text-sm h-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowToken(!showToken)}
                          className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                          title={showToken ? "Ocultar token" : "Exibir token"}
                        >
                          {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Webhook Endpoint URL */}
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl" className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 text-amber-400" />
                        URL do Webhook do WhatsApp (Supabase Function)
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Edge Function Endpoint</span>
                    </Label>
                    <Input
                      id="webhookUrl"
                      type="url"
                      placeholder="https://cxlwzuudhavikgynxqpm.supabase.co/functions/v1/evolution-webhook"
                      value={config.webhookUrl}
                      onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
                      className="bg-slate-950/70 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/50 font-mono text-sm h-10"
                    />
                  </div>

                  {/* Connection Status Box */}
                  {connectionStatus.message && (
                    <div
                      className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                        connectionStatus.status === 'success'
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                          : connectionStatus.status === 'error'
                          ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      {connectionStatus.status === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-0.5">
                        <p className="font-semibold">
                          {connectionStatus.status === 'success' ? 'Status: Conectado' : 'Resultado do Teste'}
                        </p>
                        <p className="opacity-90">{connectionStatus.message}</p>
                      </div>
                    </div>
                  )}

                  {/* Last Updated metadata */}
                  {config.updatedAt && (
                    <p className="text-[11px] text-slate-500">
                      Última atualização registrada: {new Date(config.updatedAt).toLocaleString('pt-BR')}
                    </p>
                  )}
                </form>
              </CardContent>

              <CardFooter className="border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="w-full sm:w-auto border-slate-700 hover:bg-slate-800 text-slate-200 text-xs h-10"
                >
                  {testing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-slate-200 border-t-transparent rounded-full animate-spin" />
                      <span>Testando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-amber-400" />
                      <span>Testar Conexão Evolution API</span>
                    </div>
                  )}
                </Button>

                <Button
                  type="submit"
                  form="whatsapp-config-form"
                  disabled={saving}
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs h-10 px-6 shadow-lg shadow-amber-500/20"
                >
                  {saving ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Salvando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Save className="w-3.5 h-3.5" />
                      <span>Salvar Configurações</span>
                    </div>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Sidebar System Cards (1 column) */}
          <div className="space-y-6">
            {/* Root Session Card */}
            <Card className="bg-slate-900/90 border-slate-800 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Sessão Root Admin
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>E-mail:</span>
                    <span className="text-slate-100 font-mono font-semibold">{session?.email}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Função:</span>
                    <span className="text-amber-400 font-semibold uppercase">{session?.role}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Sessão Ativa desde:</span>
                    <span className="text-slate-300 font-mono">{session?.authenticatedAt}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supabase Status Card */}
            <Card className="bg-slate-900/90 border-slate-800 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  Conexão Supabase
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase">Project URL</span>
                    <span className="text-emerald-400 font-mono text-[11px] truncate block">
                      {import.meta.env.VITE_SUPABASE_URL || 'https://cxlwzuudhavikgynxqpm.supabase.co'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase">Project ID</span>
                    <span className="text-slate-200 font-mono text-[11px]">cxlwzuudhavikgynxqpm</span>
                  </div>
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-slate-400">Status Auth:</span>
                    <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10 text-[10px]">
                      Conectado
                    </Badge>
                  </div>
                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <p className="font-semibold text-slate-300">Tabela de Configurações:</p>
                    <p className="text-[10px] text-slate-400">
                      O arquivo SQL <code className="text-amber-300 font-mono">supabase/schema_system_settings.sql</code> está disponível para criar a tabela no Supabase.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Navigation Card */}
            <Card className="bg-slate-900/90 border-slate-800 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-amber-400" />
                  Atalhos de Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin')}
                  className="w-full justify-start border-slate-800 hover:bg-slate-800 text-slate-200 text-xs h-9"
                >
                  <Building2 className="w-3.5 h-3.5 mr-2 text-amber-400" />
                  Painel de Gestão do Condomínio (/admin)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/condo-market')}
                  className="w-full justify-start border-slate-800 hover:bg-slate-800 text-slate-200 text-xs h-9"
                >
                  <Building2 className="w-3.5 h-3.5 mr-2 text-emerald-400" />
                  Portal CondoMarket (/condo-market)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/ficha-cadastral')}
                  className="w-full justify-start border-slate-800 hover:bg-slate-800 text-slate-200 text-xs h-9"
                >
                  <Info className="w-3.5 h-3.5 mr-2 text-blue-400" />
                  Ficha Cadastral (/ficha-cadastral)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
