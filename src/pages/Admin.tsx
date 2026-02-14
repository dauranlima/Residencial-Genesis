import { 
  Search, 
  Bell, 
  Calendar, 
  Users, 
  FileCheck, 
  ClipboardCheck, 
  LayoutDashboard, 
  Building2, 
  FileText, 
  Car, 
  Image, 
  MapPin, 
  Key, 
  Settings, 
  LogOut,
  UserPlus,
  MessageSquare,
  HelpCircle,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Admin() {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: Building2, label: "Flats" },
    { icon: ClipboardCheck, label: "Vistoria" },
    { icon: FileText, label: "Ficha Cadastral", badge: true },
    { icon: FileCheck, label: "Regimento Interno" },
    { icon: Car, label: "Garagem" },
    { icon: Image, label: "Fotos" },
    { icon: MessageSquare, label: "Solicitações" },
    { icon: MapPin, label: "Localização" },
    { icon: Building2, label: "Outros Imóveis" },
    { icon: Key, label: "Controle de Acesso" },
  ];

  const pendingApprovals = [
    { name: "Leonardo", email: "Leonardo.m@exemplo.com", unit: "105", date: "24 Out, 09:12 AM", status: "Aguardando Revisão", initials: "JM", color: "bg-yellow-100 text-yellow-700" },
    { name: "Matheus", email: "matheus12n@dominio.com", unit: "102", date: "23 Out, 04:45 PM", status: "Aguardando Revisão", initials: "SH", color: "bg-purple-100 text-purple-700" },
    { name: "Pedro", email: "pedro309@web.com", unit: "106", date: "23 Out, 11:30 AM", status: "Aguardando Revisão", initials: "RB", color: "bg-pink-100 text-pink-700" },
    { name: "Ronald", email: "ronald.s@web.com", unit: "206", date: "23 Out, 11:30 AM", status: "Aguardando Revisão", initials: "RB", color: "bg-pink-100 text-pink-700" },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gold p-2 rounded-lg">
            <Building2 className="w-6 h-6 text-navy-dark" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Gênesis Residencial</h1>
            <p className="text-[10px] text-gray-400 tracking-wider">GESTÃO ADMINISTRATIVA</p>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">Menu Principal</p>
          {sidebarItems.slice(0, 8).map((item, index) => (
            <div 
              key={index}
              className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${item.active ? 'bg-gold/10 text-gold border-r-2 border-gold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {item.badge && <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />}
            </div>
          ))}
        </div>

        <div className="space-y-1 mt-8">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">Sistemas</p>
          {sidebarItems.slice(8).map((item, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-white/10 mx-4 mb-4">
        <div className="flex items-center gap-3 bg-navy p-3 rounded-lg">
          <Avatar className="h-10 w-10 border-2 border-gold/20">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-navy text-gold">FE</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-white">Felix Esteves</p>
            <p className="text-xs text-gold truncate">GESTOR CHEFE</p>
          </div>
          <Settings className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-navy-dark text-white flex-col fixed h-full z-20 overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300">
        {/* Top Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div className="flex items-center gap-4 w-full lg:w-auto">
            {/* Mobile Sidebar Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-navy-dark">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-navy-dark text-white p-0 border-r-gray-800">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 truncate"> Gênesis Residencial | Visão Geral</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Buscar moradores, unidades ou arquivos..." 
                className="pl-10 bg-white border-gray-200 focus:border-gold/50 focus:ring-gold/20"
              />
            </div>
            

            
            <div className="flex items-center justify-between w-full sm:w-auto gap-4 border-t sm:border-t-0 sm:border-l border-gray-200 pt-4 sm:pt-0 sm:pl-6">
              <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-navy hover:bg-gray-100">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-navy hover:bg-gray-100">
                <Calendar className="w-5 h-5" />
              </Button>
              <span className="text-sm font-medium text-gray-500">14 de Fev, 2026</span>
            </div>
          </div>
        </header>

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-dark mb-1">Bem-vindo de volta, Felix</h1>
          <p className="text-gray-500">Veja o que está acontecendo no Gênesis Residencial hoje.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gold/10 rounded-lg">
                  <Users className="w-6 h-6 text-gold-dark" />
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">85%</Badge>
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">MORADORES TOTAIS</p>
              <h3 className="text-4xl font-bold text-navy-dark">12</h3>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <FingerprintIcon className="w-6 h-6 text-orange-500" />
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100">Ação Necessária</Badge>
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">SOLICITAÇÕES PENDENTES</p>
              <h3 className="text-4xl font-bold text-navy-dark">4</h3>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-red-50 rounded-lg">
                  <ClipboardCheck className="w-6 h-6 text-red-500" />
                </div>
                <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100">Urgente</Badge>
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">RECADOS HOJE</p>
              <h3 className="text-4xl font-bold text-navy-dark">08</h3>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Table Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-100 bg-white pt-6 px-6">
                <CardTitle className="text-lg font-bold text-navy-dark">Aprovações de Usuários Pendentes</CardTitle>
                <Button variant="link" className="text-gold hover:text-gold-dark font-medium text-sm">Ver Todos</Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="text-left py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nome do Residente</th>
                        <th className="text-left py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Unidade</th>
                        <th className="text-left py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Data Solicitada</th>
                        <th className="text-left py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {pendingApprovals.map((item, i) => (
                        <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${item.color}`}>
                                {item.initials}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">{item.name}</p>
                                <p className="text-xs text-gray-400">{item.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 font-medium text-gray-600">{item.unit}</td>
                          <td className="py-4 px-6 text-sm text-gray-500">{item.date}</td>
                          <td className="py-4 px-6">
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 font-normal">
                              {item.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column Widgets */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-[#2C2B29] text-white border-none shadow-md overflow-hidden">
              <CardHeader className="pb-2 pt-6 px-6">
                <CardTitle className="text-lg font-bold">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 bg-white/5 border-white/10 hover:bg-white/10 hover:border-gold/50 text-white hover:text-gold transition-all">
                    <UserPlus className="w-6 h-6 text-gold" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-center">Novo<br/>Residente</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 bg-white/5 border-white/10 hover:bg-white/10 hover:border-gold/50 text-white hover:text-gold transition-all">
                    <Car className="w-6 h-6 text-gold" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-center">Acesso<br/>Estac.</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 bg-white/5 border-white/10 hover:bg-white/10 hover:border-gold/50 text-white hover:text-gold transition-all">
                    <MegaphoneIcon className="w-6 h-6 text-gold" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-center">Comunicado</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 bg-white/5 border-white/10 hover:bg-white/10 hover:border-gold/50 text-white hover:text-gold transition-all">
                    <HelpCircle className="w-6 h-6 text-gold" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-center">Suporte</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2 pt-6 px-6">
                <CardTitle className="text-lg font-bold text-navy-dark">Status de Controle de Acesso</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm font-medium text-gray-700">Portões de Entrada</span>
                    </div>
                    <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded uppercase">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm font-medium text-gray-700">Biometria Garagem</span>
                    </div>
                    <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded uppercase">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-sm font-medium text-gray-700">Tags do portão</span>
                    </div>
                    <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded uppercase">Offline</span>
                  </div>
                </div>
                <Button className="w-full bg-gold/10 hover:bg-gold/20 text-gold-dark font-bold uppercase text-xs tracking-wider shadow-none border border-gold/20">
                  Contado de Manutenção | Urgência
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex justify-between items-center text-[10px] font-medium text-gray-400 mt-12 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="uppercase">Sistema Seguro</span>
          </div>
          <span className="uppercase">Último Backup: Há 14 minutos</span>
          <span className="text-gray-300">© 2023 Royal Residencies Property Management v4.2.0</span>
        </footer>
      </main>
    </div>
  );
}

// Icons placeholders for custom ones not in generic lucide import
const FingerprintIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 12c0-3 2.5-5.5 5.5-5.5S23 9 23 12H12z" />
    <path d="M12 12c0-3-2.5-5.5-5.5-5.5S1 9 1 12h11z" />
    <path d="M12 12c-3 0-5.5 2.5-5.5 5.5S9 23 12 23v-11z" />
    <path d="M12 12c3 0 5.5 2.5 5.5 5.5S15 23 12 23v-11z" />
  </svg> 
); // Using a placeholder shape, replaced by actual Lucide icon if available or custom SVG

const MegaphoneIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m3 11 18-5v12L3 14v-3z" />
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
  </svg>
);
