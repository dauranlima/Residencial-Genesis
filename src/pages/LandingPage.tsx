import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Store,
  Bell,
  ClipboardList,
  Car,
  FileText,
  Search,
  MessageSquare,
  ChevronDown,
  Layers,
  Star,
  Lock,
  PhoneCall,
  Laptop,
  Smartphone,
  Calendar,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DemoLeadModal from '@/components/landing/DemoLeadModal';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Profissional');
  const [billingCycle, setBillingCycle] = useState<'mensal' | 'anual'>('mensal');
  const [activeTab, setActiveTab] = useState<'market' | 'avisos' | 'vistorias' | 'fichas' | 'vagas'>('market');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleOpenLeadModal = (plan = 'Profissional') => {
    setSelectedPlan(plan);
    setIsLeadModalOpen(true);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 overflow-x-hidden">
      {/* 1. Header / Navbar Glassmorphism */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-bold">
              <Building2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Residencial <span className="text-amber-400">Gênesis</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider block font-medium uppercase">
                Gestão Condominial
              </span>
            </div>
          </div>

          {/* Links Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <button onClick={() => scrollToSection('como-funciona')} className="hover:text-amber-400 transition-colors">
              Como Funciona
            </button>
            <button onClick={() => scrollToSection('veja-por-dentro')} className="hover:text-amber-400 transition-colors">
              Demonstração
            </button>
            <button onClick={() => scrollToSection('recursos')} className="hover:text-amber-400 transition-colors">
              Módulos
            </button>
            <button onClick={() => scrollToSection('planos')} className="hover:text-amber-400 transition-colors">
              Planos
            </button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-amber-400 transition-colors">
              Dúvidas
            </button>
          </nav>

          {/* Botões CTA / Login */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/adm-login')}
              className="text-slate-300 hover:text-white hover:bg-slate-900 text-xs sm:text-sm font-semibold"
            >
              Já sou cliente
            </Button>
            <Button
              onClick={() => handleOpenLeadModal('Profissional')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg shadow-md shadow-amber-500/20 transition-all hover:scale-105"
            >
              Conhecer Planos <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/60">
        {/* Glow de fundo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Esquerda: Conteúdo Hero */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Gestão simples para uma rotina mais leve</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                Seu condomínio em movimento. <br />
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                  Sua gestão sob controle.
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                O <strong>Residencial Gênesis</strong> coloca avisos, solicitações, moradores, vistorias e o mercado interno no mesmo fluxo — para você trabalhar com clareza e atender melhor.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Button
                  onClick={() => handleOpenLeadModal('Profissional')}
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base px-8 py-6 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all hover:-translate-y-0.5"
                >
                  Começar agora <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => scrollToSection('como-funciona')}
                  className="w-full sm:w-auto border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-base px-6 py-6 rounded-xl"
                >
                  Entender o fluxo
                </Button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-slate-400 pt-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Feito para síndicos profissionais, administradoras e moradores.</span>
              </div>
            </div>

            {/* Direita: Mockup 3D do Painel */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glow envolvente no card */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-blue-600 rounded-2xl blur-lg opacity-30 animate-pulse" />

                <div className="relative bg-slate-900 border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4">
                  {/* Topo da janela simulada */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                      <span className="text-xs font-semibold text-slate-400 ml-2">Painel Residencial Gênesis</span>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                      Operação Ativa
                    </Badge>
                  </div>

                  {/* Indicadores rápidos no Mockup */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-[11px] text-slate-400 block">Chamados Pendentes</span>
                      <span className="text-xl font-bold text-amber-400">2 abertos</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-[11px] text-slate-400 block">Moradores Ativos</span>
                      <span className="text-xl font-bold text-emerald-400">142 cadastrados</span>
                    </div>
                  </div>

                  {/* Mini Card de Anúncio / CondoMarket */}
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5" /> CondoMarket Parceiros
                      </span>
                      <span className="text-[10px] text-slate-400">Publicado hoje</span>
                    </div>
                    <p className="text-xs text-slate-200">
                      Limpeza de Ar Condicionado com 15% de desconto para moradores do Gênesis.
                    </p>
                  </div>

                  {/* Tooltip flutuante inferior */}
                  <div className="bg-gradient-to-r from-amber-500/20 to-slate-950 border border-amber-500/40 p-3 rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                      ✨
                    </div>
                    <p className="text-xs text-slate-200 font-medium">
                      Avisos, confirmações e solicitações em uma única visão centralizada.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de Benefícios Rápida (4 Colunas) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 pt-10 border-t border-slate-800/80">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <h4 className="text-sm font-bold text-white mb-1">Mais organização</h4>
              <p className="text-xs text-slate-400">menos tarefas esquecidas no condomínio</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <h4 className="text-sm font-bold text-white mb-1">Mural público</h4>
              <p className="text-xs text-slate-400">comunicados com entrega rápida</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <h4 className="text-sm font-bold text-white mb-1">Moradores por perto</h4>
              <p className="text-xs text-slate-400">histórico e fichas sempre acessíveis</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <h4 className="text-sm font-bold text-white mb-1">CondoMarket Ativo</h4>
              <p className="text-xs text-slate-400">serviços e benefícios para a comunidade</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Como o Trabalho Acontece (Fluxo de Trabalho) */}
      <section id="como-funciona" className="py-20 bg-slate-950 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              COMO O TRABALHO ACONTECE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Do agendamento à solução das ocorrências, tudo no lugar certo.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              O Residencial Gênesis acompanha o fluxo real do condomínio para você não depender de memória, planilhas velhas ou mensagens espalhadas no WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                tag: 'Configuração',
                title: 'Cadastro do Condomínio',
                desc: 'Organize blocos, apartamentos e áreas comuns em poucos minutos sem complicação.',
                icon: Building2,
              },
              {
                step: '02',
                tag: 'Comunicação',
                title: 'Avisos & Regimento',
                desc: 'Publique avisos urgentes e mantenha as regras do condomínio acessíveis a todos os moradores.',
                icon: Bell,
              },
              {
                step: '03',
                tag: 'Operação',
                title: 'Chamados & CondoMarket',
                desc: 'Moradores abrem solicitações e acessam ofertas de parceiros comerciais homologados.',
                icon: Store,
              },
              {
                step: '04',
                tag: 'Transparência',
                title: 'Relatórios & Vistorias',
                desc: 'Acompanhe registros de entrada e saída com fotos e relatórios completos em PDF.',
                icon: FileText,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                    {item.step}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">{item.tag}</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-slate-800 group-hover:bg-amber-500 text-amber-400 group-hover:text-slate-950 flex items-center justify-center transition-colors">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Showcase Interativo ("Veja por Dentro") */}
      <section id="veja-por-dentro" className="py-24 bg-slate-900/40 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              VEJA POR DENTRO
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Uma tela real para cada parte da sua operação.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Explore os recursos do Residencial Gênesis e entenda, em poucos segundos, onde cada tarefa acontece.
            </p>
          </div>

          {/* Abas de Módulos */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {[
              { id: 'market', label: '🛍️ CondoMarket', title: 'Marketplace do Condomínio' },
              { id: 'avisos', label: '📢 Mural de Avisos', title: 'Comunicação Oficial' },
              { id: 'vistorias', label: '🔍 Vistorias Digitais', title: 'Relatórios Fotográficos' },
              { id: 'fichas', label: '📋 Fichas & Fiadores', title: 'Gestão de Moradores' },
              { id: 'vagas', label: '🚗 Controle de Garagem', title: 'Vagas e Veículos' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Painel do Showcase */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Lado Esquerdo: Preview da Interface */}
              <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {activeTab === 'market' && 'CONDOMARKET PARCEIROS & MORADORES'}
                    {activeTab === 'avisos' && 'COMUNICADOS EM TEMPO REAL'}
                    {activeTab === 'vistorias' && 'RELATÓRIO DIGITAL DE VISTORIA'}
                    {activeTab === 'fichas' && 'FICHA CADASTRAL E ANEXOS'}
                    {activeTab === 'vagas' && 'GESTÃO DE VAGAS E VEÍCULOS'}
                  </span>
                  <Badge className="bg-slate-800 text-slate-300 text-[10px]">Visão do Morador & Síndico</Badge>
                </div>

                {activeTab === 'market' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-bold text-white">Lava Rápido Delivery</h4>
                        <p className="text-xs text-slate-400">Lavagem ecológica direto na sua vaga de garagem.</p>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-300">R$ 50,00</Badge>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-bold text-white">Venda de Bicicleta Aro 29</h4>
                        <p className="text-xs text-slate-400">Anúncio interno do Apto 304 - Bloco B.</p>
                      </div>
                      <Badge className="bg-amber-500/20 text-amber-300">R$ 1.200,00</Badge>
                    </div>
                  </div>
                )}

                {activeTab === 'avisos' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-950 rounded-xl border border-amber-500/30">
                      <span className="text-[10px] font-bold text-amber-400 block mb-1">IMPORTANTE - MANUTENÇÃO</span>
                      <h4 className="text-sm font-bold text-white">Limpeza da Caixa d'Água</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Aviso: O abastecimento será interrompido nesta quinta-feira das 08h às 14h.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'vistorias' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <h4 className="text-sm font-bold text-white">Vistoria de Entrada - Apto 402</h4>
                      <p className="text-xs text-slate-400">
                        Status: 12 Fotos anexadas • Pintura nova • Medidores validados.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'fichas' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <h4 className="text-sm font-bold text-white">Cadastro de Inquilino / Proprietário</h4>
                      <p className="text-xs text-slate-400">
                        Ficha com dados do fiador, cópia do contrato e autorização de portaria.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'vagas' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <h4 className="text-sm font-bold text-white">Vaga 14 (Subsolo 1)</h4>
                      <p className="text-xs text-slate-400">
                        Veículo: Honda Civic Prata • Placa: ABC-1234 • Morador: Apto 102.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Lado Direito: Benefícios do Módulo */}
              <div className="lg:col-span-5 space-y-6">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  UMA ROTINA CONECTADA
                </span>
                <h3 className="text-2xl font-bold text-white leading-tight">
                  Tudo o que seu condomínio precisa para manter o ritmo sem dor de cabeça.
                </h3>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Ficha 360° com histórico de moradores e contatos.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>CondoMarket para incentivar o comércio e serviços no local.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Confirmações e lembretes com canal rápido.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Avisos e documentos centralizados no mesmo lugar.</span>
                  </li>
                </ul>

                <Button
                  onClick={() => handleOpenLeadModal('Profissional')}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl"
                >
                  Quero conhecer os planos <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Grid de Recursos & Módulos */}
      <section id="recursos" className="py-24 bg-slate-950 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              TUDO CONECTADO
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Ferramentas que fazem sentido para o seu condomínio.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Você não precisa aprender um sistema complicado. Cada área existe para resolver uma parte do seu dia a dia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'CondoMarket & Parceiros',
                desc: 'Moradores e fornecedores divulgam produtos e serviços direto na plataforma interna.',
                icon: Store,
              },
              {
                title: 'Mural de Avisos em Tempo Real',
                desc: 'Publique informativos com confirmação de visualização e notificações rápidas.',
                icon: Bell,
              },
              {
                title: 'Ficha Cadastral & Fiadores',
                desc: 'Formulários digitais completos para controle de proprietários, moradores e inquilinos.',
                icon: ClipboardList,
              },
              {
                title: 'Vistorias Fotográficas',
                desc: 'Registre estado de conservação de áreas e apartamentos com imagens e laudo.',
                icon: FileText,
              },
              {
                title: 'Vagas & Garagens',
                desc: 'Controle rigoroso de veículos cadastrados por unidade para evitar conflitos no estacionamento.',
                icon: Car,
              },
              {
                title: 'Regimento Interno Digital',
                desc: 'Consulte regras, horários de barulho e normas da convenção em qualquer dispositivo.',
                icon: ShieldCheck,
              },
            ].map((module, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/30 rounded-2xl p-6 space-y-3 transition-all hover:-translate-y-1"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <module.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">{module.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{module.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Card de Destaque Navy Escuro (High Contrast Block) */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 via-[#1B2A4A] to-slate-950 border border-amber-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  CONTROLE ABSOLUTO
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  O que é importante não fica perdido no meio da correria.
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Do primeiro aviso ao encerramento do chamado, o Residencial Gênesis cria uma linha de tempo clara para você saber sempre o próximo passo.
                </p>
                <div className="pt-2">
                  <Button
                    onClick={() => handleOpenLeadModal('Profissional')}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-4 rounded-xl text-sm"
                  >
                    Conhecer a experiência <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-5 bg-slate-950/80 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="text-xs text-slate-300 font-medium">Avisos e regras sempre acessíveis</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs text-slate-300 font-medium">Atendimento organizado por chamado</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-400" />
                  <span className="text-xs text-slate-300 font-medium">Registro do histórico de solicitações</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-purple-400" />
                  <span className="text-xs text-slate-300 font-medium">Prestação de contas e relatórios claros</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Planos de Preços (Seletor Mensal / Anual) */}
      <section id="planos" className="py-24 bg-slate-900/30 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              PLANOS TRANSPARENTES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Escolha o plano ideal para o tamanho do seu condomínio.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Sem taxas escondidas. Teste grátis por 14 dias sem compromisso.
            </p>

            {/* Toggle Mensal / Anual */}
            <div className="pt-4 flex items-center justify-center gap-3">
              <span className={`text-xs font-semibold ${billingCycle === 'mensal' ? 'text-white' : 'text-slate-400'}`}>
                Pagamento Mensal
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'mensal' ? 'anual' : 'mensal')}
                className="w-14 h-8 bg-slate-800 border border-slate-700 rounded-full p-1 transition-colors relative"
              >
                <div
                  className={`w-6 h-6 bg-amber-500 rounded-full transition-transform ${
                    billingCycle === 'anual' ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingCycle === 'anual' ? 'text-white' : 'text-slate-400'}`}>
                Pagamento Anual
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                  20% OFF
                </Badge>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Plano Essencial */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all">
              <div className="space-y-4">
                <Badge className="bg-slate-800 text-slate-300 text-xs">Até 30 Unidades</Badge>
                <h3 className="text-xl font-bold text-white">Plano Essencial</h3>
                <p className="text-xs text-slate-400">Ideal para condomínios de pequeno porte ou blocos individuais.</p>

                <div className="pt-2">
                  <span className="text-3xl font-extrabold text-white">
                    R$ {billingCycle === 'anual' ? '119' : '149'}
                  </span>
                  <span className="text-xs text-slate-400"> / mês</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-300 pt-4 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Mural de Avisos Digital
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Regimento Interno Interativo
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Controle de Garagens & Vagas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Suporte via E-mail
                  </li>
                </ul>
              </div>

              <Button
                onClick={() => handleOpenLeadModal('Essencial')}
                variant="outline"
                className="w-full border-slate-700 text-slate-200 hover:bg-slate-800 font-bold"
              >
                Testar Essencial Grátis
              </Button>
            </div>

            {/* Plano Profissional (DESTAQUE OURO) */}
            <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500 rounded-3xl p-8 flex flex-col justify-between space-y-6 shadow-2xl shadow-amber-500/10 relative transform md:-translate-y-2">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <Badge className="bg-amber-500 text-slate-950 font-bold text-xs px-3 py-1 shadow-md">
                  ⭐ MAIS ESCOLHIDO
                </Badge>
              </div>

              <div className="space-y-4 pt-2">
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-xs">
                  Até 100 Unidades
                </Badge>
                <h3 className="text-2xl font-bold text-white">Plano Profissional</h3>
                <p className="text-xs text-slate-300">A solução completa com CondoMarket para o condomínio moderno.</p>

                <div className="pt-2">
                  <span className="text-4xl font-extrabold text-amber-400">
                    R$ {billingCycle === 'anual' ? '239' : '299'}
                  </span>
                  <span className="text-xs text-slate-400"> / mês</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-200 pt-4 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" /> <strong>Tudo do Plano Essencial</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" /> Módulo CondoMarket & Parceiros
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" /> Fichas Cadastrais & Fiadores
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" /> Relatórios de Vistoria Fotográfica
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" /> Suporte Prioritário via WhatsApp
                  </li>
                </ul>
              </div>

              <Button
                onClick={() => handleOpenLeadModal('Profissional')}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-6 shadow-lg shadow-amber-500/20"
              >
                Testar 14 Dias Grátis
              </Button>
            </div>

            {/* Plano Enterprise */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all">
              <div className="space-y-4">
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-xs">
                  Condomínios 100+ u.
                </Badge>
                <h3 className="text-xl font-bold text-white">Plano Enterprise</h3>
                <p className="text-xs text-slate-400">Para grandes condomínios e administradoras de imóveis.</p>

                <div className="pt-2">
                  <span className="text-3xl font-extrabold text-white">
                    R$ {billingCycle === 'anual' ? '399' : '499'}
                  </span>
                  <span className="text-xs text-slate-400"> / mês</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-300 pt-4 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400" /> Unidades Ilimitadas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400" /> Múltiplas Torres e Bloco Único
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400" /> Gestão Multi-Administrador
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400" /> Gerente de Conta Dedicado
                  </li>
                </ul>
              </div>

              <Button
                onClick={() => handleOpenLeadModal('Enterprise')}
                variant="outline"
                className="w-full border-slate-700 text-slate-200 hover:bg-slate-800 font-bold"
              >
                Solicitar Enterprise
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ Accordion */}
      <section id="faq" className="py-20 bg-slate-950 border-b border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              DÚVIDAS FREQUENTES
            </span>
            <h2 className="text-3xl font-extrabold text-white">Perguntas e Respostas</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Como funciona o teste grátis de 14 dias?',
                a: 'Você faz o cadastro rápido e recebe acesso imediato a todas as funcionalidades do Residencial Gênesis. Não é necessário cartão de crédito para começar.',
              },
              {
                q: 'Preciso instalar algum programa nos computadores do condomínio?',
                a: 'Não! O Residencial Gênesis é 100% online na nuvem. Você e os moradores podem acessar de qualquer computador, tablet ou celular.',
              },
              {
                q: 'Como funciona o Módulo CondoMarket?',
                a: 'O CondoMarket permite que moradores e parceiros comerciais homologados anunciem serviços (ex: lava-jato, personal trainer, alimentos) diretamente para os condôminos, gerando valor e praticidade.',
              },
              {
                q: 'É possível importar a lista de moradores existente?',
                a: 'Sim! Nossa equipe auxilia na importação em lote dos dados de apartamentos e moradores sem nenhum custo adicional.',
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-white text-sm sm:text-base hover:text-amber-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                      openFaq === i ? 'rotate-180 text-amber-400' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-slate-300 border-t border-slate-800/60 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Footer CTA Banner */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-500/20 border border-amber-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
              Mais clareza para trabalhar. <br />
              <span className="text-amber-400">Mais espaço para crescer.</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
              Junte-se aos condomínios que modernizaram a rotina de gestão com o Residencial Gênesis.
            </p>
            <div>
              <Button
                onClick={() => handleOpenLeadModal('Profissional')}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base px-8 py-6 rounded-xl shadow-lg shadow-amber-500/20"
              >
                Conhecer os planos <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Rodapé Institucional */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-white">Residencial Gênesis</span>
          </div>

          <p>© 2026 Residencial Gênesis. Gestão simples para condomínios em movimento.</p>

          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/adm-login')} className="hover:text-amber-400 transition-colors">
              Painel Admin
            </button>
            <button onClick={() => navigate('/super-admin')} className="hover:text-amber-400 transition-colors">
              Super Admin
            </button>
          </div>
        </div>
      </footer>

      {/* Modal de Lead/Demonstração */}
      <DemoLeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        selectedPlan={selectedPlan}
      />
    </div>
  );
}
