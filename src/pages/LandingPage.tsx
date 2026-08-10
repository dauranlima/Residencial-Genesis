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
  ShoppingBag,
  Tag,
  Wrench,
  Gift,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ShoppingBasket,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DemoLeadModal from '@/components/landing/DemoLeadModal';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Profissional');
  const [billingCycle, setBillingCycle] = useState<'mensal' | 'anual'>('mensal');
  const [activeTab, setActiveTab] = useState<'market' | 'servicos' | 'parceiros' | 'cupons'>('market');
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
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-bold">
              <Store className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center">
                vizi <span className="text-amber-400">GO</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider block font-medium uppercase">
                Condo Marketplace
              </span>
            </div>
          </div>

          {/* Links Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <button onClick={() => scrollToSection('como-funciona')} className="hover:text-amber-400 transition-colors">
              Como Funciona
            </button>
            <button onClick={() => scrollToSection('categorias')} className="hover:text-amber-400 transition-colors">
              Categorias
            </button>
            <button onClick={() => scrollToSection('veja-por-dentro')} className="hover:text-amber-400 transition-colors">
              Demonstração
            </button>
            <button onClick={() => scrollToSection('roadmap')} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <span>O Futuro</span>
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[9px] px-1.5 py-0">
                Em breve
              </Badge>
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
              onClick={() => scrollToSection('planos')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg shadow-md shadow-amber-500/20 transition-all hover:scale-105"
            >
              Conhecer Planos <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section (Focada no Marketplace) */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/60">
        {/* Glow de fundo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-amber-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Esquerda: Conteúdo Hero */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>O Marketplace Exclusivo do Seu Condomínio</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                Conecte vizinhos, serviços e <br />
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                  o comércio local do condomínio.
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                O <strong>viziGO Market</strong> transforma o seu condomínio em uma rede de comércio hiperlocal. Compre, venda, troque produtos e contrate serviços com quem mora ao seu lado — com total comodidade e segurança.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Button
                  onClick={() => handleOpenLeadModal('Profissional')}
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base px-8 py-6 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all hover:-translate-y-0.5"
                >
                  Ativar no Meu Condomínio <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => scrollToSection('como-funciona')}
                  className="w-full sm:w-auto border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-base px-6 py-6 rounded-xl"
                >
                  Como funciona
                </Button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-slate-400 pt-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% seguro para moradores, produtores locais e comércios da região.</span>
              </div>
            </div>

            {/* Direita: Mockup do Marketplace */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glow envolvente */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl blur-lg opacity-30 animate-pulse" />

                <div className="relative bg-slate-900 border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4">
                  {/* Topo da janela simulada */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                      <span className="text-xs font-semibold text-slate-400 ml-2">viziGO Market • Residencial Gênesis</span>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                      Ambiente Verificado
                    </Badge>
                  </div>

                  {/* Indicadores rápidos do Marketplace */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-[11px] text-slate-400 block">Anúncios Ativos</span>
                      <span className="text-xl font-bold text-amber-400">48 ofertas</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-[11px] text-slate-400 block">Vizinhos Conectados</span>
                      <span className="text-xl font-bold text-emerald-400">142 membros</span>
                    </div>
                  </div>

                  {/* Mini Cards de Anúncios */}
                  <div className="space-y-2.5">
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-amber-500/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                          🧹
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">Lava Rápido Ecológico</h4>
                          <p className="text-[10px] text-slate-400">Direto na sua vaga de garagem • Bloco B</p>
                        </div>
                      </div>
                      <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs">
                        R$ 50,00
                      </Badge>
                    </div>

                    <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                          🚲
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">Bicicleta Aro 29 (Seminova)</h4>
                          <p className="text-[10px] text-slate-400">Desapego do Apto 304 • Bloco A</p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
                        R$ 1.200
                      </Badge>
                    </div>
                  </div>

                  {/* Banner de Parceiro Comercial */}
                  <div className="bg-gradient-to-r from-amber-500/20 via-slate-950 to-slate-950 border border-amber-500/40 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Store className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-amber-300">Pizzaria Forno a Lenha</p>
                        <p className="text-[10px] text-slate-300">15% OFF exclusivo para moradores do condomínio</p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-amber-400 shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de Benefícios Rápida (4 Colunas) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 pt-10 border-t border-slate-800/80">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-amber-400" /> Comércio Hiperlocal
              </h4>
              <p className="text-xs text-slate-400">Valorize a produção e produtos dos seus próprios vizinhos.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-amber-400" /> Serviços Recomendados
              </h4>
              <p className="text-xs text-slate-400">Contrate profissionais avaliados por quem você já conhece.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-amber-400" /> Desapego Sem Frete
              </h4>
              <p className="text-xs text-slate-400">Venda o que não usa mais sem taxa de entrega ou complicação.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" /> 100% Seguro
              </h4>
              <p className="text-xs text-slate-400">Ambiente exclusivo e fechado para condôminos verificados.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Como Funciona o ViziGO Market */}
      <section id="como-funciona" className="py-20 bg-slate-950 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              COMO O MARKETPLACE FUNCIONA
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Do anúncio à entrega na porta, sem complicação.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Uma experiência simples e intuitiva feita sob medida para a dinâmica de condomínios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                tag: 'Anúncio Rápido',
                title: 'Publique em Minutos',
                desc: 'Moradores e comércios parceiros postam fotos, descrição e preço diretamente na vitrine do condomínio.',
                icon: Store,
              },
              {
                step: '02',
                tag: 'Navegação',
                title: 'Explore por Categoria',
                desc: 'Alimentação artesanal, prestação de serviços, desapegos ou cupons de lojas locais organizados por área.',
                icon: Search,
              },
              {
                step: '03',
                tag: 'Conexão',
                title: 'Negociação Direta',
                desc: 'Entre em contato diretamente pelo WhatsApp ou sistema de mensagens sem intermediários ou comissões.',
                icon: MessageSquare,
              },
              {
                step: '04',
                tag: 'Comunidade',
                title: 'Praticidade & Economia',
                desc: 'Receba seus produtos no próprio condomínio, ajude a economia local e economize tempo no seu dia a dia.',
                icon: Zap,
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

      {/* 4. Categorias em Destaque */}
      <section id="categorias" className="py-20 bg-slate-900/30 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              OPORTUNIDADES DENTRO DO CONDOMÍNIO
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Tudo o que seu condomínio precisa comprar, vender ou contratar.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Descubra a variedade de possibilidades que o viziGO Market oferece para condôminos e comerciantes da região.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Alimentação & Gastronomia',
                desc: 'Marmitas fitness, pães artesanais, bolos, doces e bebidas preparados por vizinhos ou parceiros locais.',
                icon: ShoppingBasket,
                tag: 'Alta procura',
              },
              {
                title: 'Serviços Profissionais',
                desc: 'Eletricistas, encanadores, personal trainers, aulas particulares, suporte de informática e manicures.',
                icon: Wrench,
                tag: 'Prestadores locais',
              },
              {
                title: 'Desapego de Moradores',
                desc: 'Móveis, brinquedos, bicicletas, eletrônicos e livros com preços excelentes e sem custo de frete.',
                icon: Tag,
                tag: 'Sem frete',
              },
              {
                title: 'Parceiros do Bairro',
                desc: 'Descontos em padarias, mercados, lavanderias e farmácias da região exclusivos para moradores.',
                icon: Store,
                tag: 'Benefícios',
              },
            ].map((cat, index) => (
              <div
                key={index}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-6 space-y-4 transition-all hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <Badge className="bg-slate-800 text-slate-300 text-[10px]">{cat.tag}</Badge>
                </div>
                <h3 className="text-lg font-bold text-white">{cat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Showcase Interativo ("Veja por Dentro") */}
      <section id="veja-por-dentro" className="py-24 bg-slate-900/50 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              VEJA O MARKET POR DENTRO
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Uma vitrine moderna e fácil de usar.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Navegue pelas diferentes opções disponíveis no viziGO Market e veja como é simples anunciar e encontrar o que precisa.
            </p>
          </div>

          {/* Abas do Showcase */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {[
              { id: 'market', label: '🛍️ Anúncios & Desapegos' },
              { id: 'servicos', label: '🛠️ Prestadores & Serviços' },
              { id: 'parceiros', label: '🏪 Comércio Local do Bairro' },
              { id: 'cupons', label: '🎁 Descontos Exclusivos' },
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
                    {activeTab === 'market' && 'VITRINE DE ANÚNCIOS DOS MORADORES'}
                    {activeTab === 'servicos' && 'SERVIÇOS E PRESTADORES AVALIADOS'}
                    {activeTab === 'parceiros' && 'LOJAS E COMÉRCIOS CREDENCIADOS'}
                    {activeTab === 'cupons' && 'CUPONS E BENEFÍCIOS PARA O CONDOMÍNIO'}
                  </span>
                  <Badge className="bg-slate-800 text-slate-300 text-[10px]">Visão do Morador</Badge>
                </div>

                {activeTab === 'market' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-bold text-white">Bicicleta Aro 29 Caloi</h4>
                        <p className="text-xs text-slate-400">Pouco uso • Anúncio do Apto 304 - Bloco A</p>
                      </div>
                      <Badge className="bg-amber-500/20 text-amber-300">R$ 1.200</Badge>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-bold text-white">Kit Pães de Queijo Artesanais</h4>
                        <p className="text-xs text-slate-400">Congelados • Entrega na porta pelo Apto 102</p>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-300">R$ 35,00</Badge>
                    </div>
                  </div>
                )}

                {activeTab === 'servicos' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-bold text-white">Higienização de Sofá & Estofados</h4>
                        <p className="text-xs text-slate-400">Atendimento no próprio apartamento • Nota 4.9 ★</p>
                      </div>
                      <Badge className="bg-amber-500/20 text-amber-300">R$ 150</Badge>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-bold text-white">Aulas Particulares de Inglês</h4>
                        <p className="text-xs text-slate-400">Professora moradora do Bloco B • Presencial ou online</p>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-300">R$ 80 / hora</Badge>
                    </div>
                  </div>
                )}

                {activeTab === 'parceiros' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-bold text-white">Padaria da Esquina</h4>
                        <p className="text-xs text-slate-400">Entrega diária de pão quentinho sem taxa na portaria.</p>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-300">Parceiro Oficial</Badge>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-bold text-white">Pet Shop Amigo Fiel</h4>
                        <p className="text-xs text-slate-400">Banho e tosa com busca e entrega gratuita no prédio.</p>
                      </div>
                      <Badge className="bg-purple-500/20 text-purple-300">Homologado</Badge>
                    </div>
                  </div>
                )}

                {activeTab === 'cupons' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-950 rounded-xl border border-amber-500/30 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-bold text-amber-400 block">CUPOM: VIZIGO15</span>
                        <h4 className="text-sm font-bold text-white">15% OFF em Pizzas de Quinta a Domingo</h4>
                      </div>
                      <Badge className="bg-amber-500 text-slate-950 font-bold">Resgatar</Badge>
                    </div>
                  </div>
                )}
              </div>

              {/* Lado Direito: Benefícios do Módulo */}
              <div className="lg:col-span-5 space-y-6">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  ECONOMIA & CONVENIÊNCIA
                </span>
                <h3 className="text-2xl font-bold text-white leading-tight">
                  Seu condomínio transformado em um centro de oportunidades.
                </h3>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Conexão segura exclusivamente entre condôminos e lojas da vizinhança.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Incentivo a microempreendedores e moradores autônomos.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Contato direto via WhatsApp ou chat interno.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Gestão simplificada para aprovação de comércios pelo síndico.</span>
                  </li>
                </ul>

                <Button
                  onClick={() => handleOpenLeadModal('Profissional')}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl"
                >
                  Quero no Meu Condomínio <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NOVO: Seção Roadmap / O Futuro do viziGO */}
      <section id="roadmap" className="py-24 bg-slate-950 border-b border-slate-800/60 relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-amber-500/5 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>O FUTURO DA GESTÃO CONDOMINIAL</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Uma plataforma completa em constante expansão.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              O <strong>viziGO Market</strong> é apenas o começo. Em breve, disponibilizaremos módulos adicionais de gestão para simplificar toda a rotina do seu condomínio em um só lugar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Mural de Avisos Digitais',
                desc: 'Comunicação oficial do síndico em tempo real, confirmação de leitura e informativos importantes.',
                icon: Bell,
                status: 'Em Breve',
              },
              {
                title: 'Vistorias Fotográficas',
                desc: 'Laudos de entrada e saída com fotos anexadas, registro de conservação e exportação de relatórios.',
                icon: FileText,
                status: 'Em Breve',
              },
              {
                title: 'Fichas Cadastrais & Fiadores',
                desc: 'Formulários digitais completos para gestão de moradores, inquilinos e proprietários.',
                icon: ClipboardList,
                status: 'Em Desenvolvimento',
              },
              {
                title: 'Gestão de Vagas & Garagens',
                desc: 'Controle de veículos cadastrados por apartamento para evitar conflitos de estacionamento.',
                icon: Car,
                status: 'Em Desenvolvimento',
              },
            ].map((module, idx) => (
              <div
                key={idx}
                className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-4 relative group hover:border-amber-500/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 group-hover:text-amber-400 flex items-center justify-center transition-colors">
                    <module.icon className="w-5 h-5" />
                  </div>
                  <Badge className="bg-amber-500/10 text-amber-300 border-amber-500/20 text-[10px]">
                    {module.status}
                  </Badge>
                </div>
                <h3 className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors">
                  {module.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{module.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-xs text-slate-400">
              💡 <em>Ao contratar o viziGO Market hoje, seu condomínio garante acesso prioritário aos novos módulos à medida que forem lançados!</em>
            </p>
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
              Ative o viziGO Market no seu condomínio.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Sem taxas escondidas. Comece com 7 dias de teste grátis.
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
                  + de 20% OFF
                </Badge>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Plano Essencial */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all">
              <div className="space-y-4">
                <Badge className="bg-slate-800 text-slate-300 text-xs">Até 32 Unidades</Badge>
                <h3 className="text-xl font-bold text-white">Plano Essencial</h3>
                <p className="text-xs text-slate-400">Ideal para condomínios pequenos ou edifícios de bloco único.</p>

                <div className="pt-2">
                  <span className="text-3xl font-extrabold text-white">
                    R$ {billingCycle === 'anual' ? '59' : '79'}
                  </span>
                  <span className="text-xs text-slate-400"> / mês</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-300 pt-4 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Vitrine de Anúncios do Condomínio
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Cadastro de Prestadores Locais
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Contato Direto via WhatsApp
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
                <p className="text-xs text-slate-300">A solução completa do viziGO Market para o seu condomínio.</p>

                <div className="pt-2">
                  <span className="text-4xl font-extrabold text-amber-400">
                    R$ {billingCycle === 'anual' ? '99' : '129'}
                  </span>
                  <span className="text-xs text-slate-400"> / mês</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-200 pt-4 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" /> <strong>Tudo do Plano Essencial</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" /> Parcerias com Comércio Local & Cupons
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" /> Aprovação e Moderação de Anúncios
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" /> Acesso Prioritário a Novos Módulos
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
                Testar 7 Dias Grátis
              </Button>
            </div>

            {/* Plano Enterprise */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all">
              <div className="space-y-4">
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-xs">
                  Condomínios 100+ u.
                </Badge>
                <h3 className="text-xl font-bold text-white">Plano Enterprise</h3>
                <p className="text-xs text-slate-400">Para grandes condomínios de várias torres e administradoras.</p>

                <div className="pt-2">
                  <span className="text-3xl font-extrabold text-white">
                    R$ {billingCycle === 'anual' ? '199' : '249'}
                  </span>
                  <span className="text-xs text-slate-400"> / mês</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-300 pt-4 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400" /> Unidades Ilimitadas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400" /> Múltiplos Blocos e Administradores
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400" /> Relatórios de Engajamento do Market
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
                q: 'Como funciona o viziGO Market no condomínio?',
                a: 'O viziGO Market é uma vitrine online exclusiva onde moradores e parceiros comerciais aprovados podem anunciar produtos, desapegos, refeições e serviços profissionais diretamente para os vizinhos.',
              },
              {
                q: 'É seguro para os moradores do prédio?',
                a: 'Sim! O acesso é restrito ao condomínio, garantindo que você esteja negociando com pessoas identificadas ou comércios locais devidamente credenciados.',
              },
              {
                q: 'O viziGO cobra comissão sobre os produtos ou serviços vendidos?',
                a: 'Não! O viziGO cobra apenas a assinatura mensal do condomínio. As negociações são 100% livres entre comprador e vendedor sem nenhuma taxa adicional.',
              },
              {
                q: 'E os outros módulos do sistema de condomínio (avisos, vistorias, vagas)?',
                a: 'Estamos focados em entregar a melhor experiência no viziGO Market agora! Os módulos adicionais de gestão estão no nosso roadmap e serão lançados em breve.',
              },
              {
                q: 'Como funciona o teste grátis de 7 dias?',
                a: 'Você faz o cadastro rápido e recebe acesso ao painel para testar o viziGO Market no seu condomínio sem necessidade de cadastrar cartão de crédito.',
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
              Valorize quem está ao seu lado. <br />
              <span className="text-amber-400">Ative o viziGO Market no seu condomínio.</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
              Transforme a rotina do seu condomínio com praticidade, economia local e segurança.
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
              <Store className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-white">viziGO Market</span>
          </div>

          <p>© 2026 viziGO. O Marketplace Exclusivo do Seu Condomínio.</p>

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
