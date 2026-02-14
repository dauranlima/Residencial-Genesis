
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Phone, 
  Car, 
  FileText, 
  Save, 
  X, 
  Upload, 
  Plus, 
  Trash2,
  Calendar as CalendarIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function FichaCadastral() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dados-pessoais");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ 
      title: "Cadastro salvo com sucesso!", 
      description: "Os dados foram atualizados no sistema." 
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy-dark">
            Ficha Cadastral do <span className="text-gold">Morador</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Preencha os dados cadastrais para novos ocupantes da unidade.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-muted-foreground/30 text-muted-foreground hover:text-navy hover:border-navy">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-gold hover:bg-gold/90 text-navy-dark font-semibold shadow-gold">
            <Save className="w-4 h-4 mr-2" />
            Salvar Cadastro
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-luxury bg-white/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <Tabs 
                defaultValue="dados-pessoais" 
                value={activeTab} 
                onValueChange={setActiveTab}
                orientation="vertical" 
                className="w-full"
              >
                <TabsList className="flex flex-col h-auto bg-transparent space-y-2 w-full">
                  <TabsTrigger 
                    value="dados-pessoais" 
                    className="w-full justify-start px-4 py-3 h-auto text-base data-[state=active]:bg-gold/10 data-[state=active]:text-navy-dark data-[state=active]:font-semibold data-[state=active]:border-l-4 data-[state=active]:border-gold rounded-none transition-all"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Dados Pessoais
                  </TabsTrigger>
                  <TabsTrigger 
                    value="contato-emergencia" 
                    className="w-full justify-start px-4 py-3 h-auto text-base data-[state=active]:bg-gold/10 data-[state=active]:text-navy-dark data-[state=active]:font-semibold data-[state=active]:border-l-4 data-[state=active]:border-gold rounded-none transition-all"
                  >
                    <Phone className="w-4 h-4 mr-3" />
                    Contato de Emergência
                  </TabsTrigger>
                  <TabsTrigger 
                    value="veiculo" 
                    className="w-full justify-start px-4 py-3 h-auto text-base data-[state=active]:bg-gold/10 data-[state=active]:text-navy-dark data-[state=active]:font-semibold data-[state=active]:border-l-4 data-[state=active]:border-gold rounded-none transition-all"
                  >
                    <Car className="w-4 h-4 mr-3" />
                    Informações do Veículo
                  </TabsTrigger>
                  <TabsTrigger 
                    value="documentos" 
                    className="w-full justify-start px-4 py-3 h-auto text-base data-[state=active]:bg-gold/10 data-[state=active]:text-navy-dark data-[state=active]:font-semibold data-[state=active]:border-l-4 data-[state=active]:border-gold rounded-none transition-all"
                  >
                    <FileText className="w-4 h-4 mr-3" />
                    Documentos e Anexos
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <h3 className="text-xs font-bold text-gold uppercase tracking-wider mb-2">Conclusão do Perfil</h3>
              <div className="w-full bg-muted/50 rounded-full h-2 mb-2">
                <div className="bg-gold h-2 rounded-full w-[45%] transition-all duration-500" />
              </div>
              <p className="text-xs text-muted-foreground text-right">45% concluído</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} className="w-full">
            
            {/* Dados Pessoais */}
            <TabsContent value="dados-pessoais" className="mt-0">
              <Card className="border border-border/50 shadow-luxury">
                <CardHeader className="pb-4 border-b border-border/50">
                  <CardTitle className="text-xl text-navy-dark uppercase tracking-wide border-l-4 border-gold pl-4">Dados Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Photo Upload Placeholder */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-32 h-32 rounded-full border-2 border-dashed border-gold/50 flex items-center justify-center bg-gold/5 group cursor-pointer hover:bg-gold/10 transition-colors">
                        <Upload className="w-8 h-8 text-gold/60 group-hover:text-gold transition-colors" />
                      </div>
                      <span className="text-[10px] text-muted-foreground uppercase text-center max-w-[120px]">
                        Tam. Máx 2MB<br/>Apenas JPG, PNG
                      </span>
                    </div>

                    {/* Form Fields */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                      <div className="md:col-span-2">
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Nome Completo</Label>
                        <Input placeholder="Digite o nome completo do morador" className="bg-muted/30 border-muted-foreground/20 h-11" />
                      </div>
                      
                      <div>
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">CPF</Label>
                        <Input placeholder="000.000.000-00" className="bg-muted/30 border-muted-foreground/20 h-11" />
                      </div>
                      
                      <div>
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Data de Nascimento</Label>
                        <div className="relative">
                          <Input type="date" className="bg-muted/30 border-muted-foreground/20 h-11" />
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">E-mail Principal</Label>
                        <Input type="email" placeholder="morador@exemplo.com.br" className="bg-muted/30 border-muted-foreground/20 h-11" />
                      </div>

                      <div>
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Telefone</Label>
                        <Input placeholder="(00) 00000-0000" className="bg-muted/30 border-muted-foreground/20 h-11" />
                      </div>

                      <div className="md:col-span-2">
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Profissão</Label>
                        <Input placeholder="Ex: Engenheiro de Software, Médico, etc." className="bg-muted/30 border-muted-foreground/20 h-11" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contato de Emergência */}
            <TabsContent value="contato-emergencia" className="mt-0">
              <Card className="border border-border/50 shadow-luxury">
                <CardHeader className="pb-4 border-b border-border/50">
                  <CardTitle className="text-xl text-navy-dark uppercase tracking-wide border-l-4 border-gold pl-4">Contato de Emergência</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gold/5 p-6 rounded-lg border border-gold/20 space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-gold uppercase tracking-wider">Contato Principal</h4>
                        <span className="text-xs bg-gold text-white px-2 py-0.5 rounded-full">*</span>
                      </div>
                      
                      <div>
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Nome Completo</Label>
                        <Input placeholder="Nome do Contato" className="bg-white border-muted-foreground/20" />
                      </div>
                      
                      <div>
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Telefone</Label>
                        <Input placeholder="(00) 00000-0000" className="bg-white border-muted-foreground/20" />
                      </div>

                      <div>
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Parentesco</Label>
                        <Input placeholder="Ex: Pai, Mãe, Cônjuge" className="bg-white border-muted-foreground/20" />
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg flex flex-col items-center justify-center p-8 text-muted-foreground hover:bg-muted/20 transition-colors cursor-pointer group min-h-[300px]">
                      <Plus className="w-10 h-10 mb-2 group-hover:text-navy transition-colors" />
                      <span className="text-sm font-medium uppercase tracking-wider group-hover:text-navy transition-colors">Adicionar Outro Contato</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Veículo */}
            <TabsContent value="veiculo" className="mt-0">
              <Card className="border border-border/50 shadow-luxury">
                <CardHeader className="pb-4 border-b border-border/50 flex flex-row items-center justify-between">
                  <CardTitle className="text-xl text-navy-dark uppercase tracking-wide border-l-4 border-gold pl-4">Informações do Veículo</CardTitle>
                  <Button variant="ghost" className="text-gold hover:text-navy hover:bg-gold/10 text-xs font-bold uppercase tracking-wider">
                    <Plus className="w-4 h-4 mr-2" /> Cadastrar Novo Veículo
                  </Button>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="rounded-lg border border-border overflow-hidden">
                    <div className="grid grid-cols-12 bg-muted/40 p-3 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border">
                      <div className="col-span-5 pl-4">Marca / Modelo</div>
                      <div className="col-span-3">Cor</div>
                      <div className="col-span-3">Placa do Carro</div>
                      <div className="col-span-1 text-center">Ações</div>
                    </div>
                    
                    <div className="grid grid-cols-12 p-4 items-center hover:bg-muted/10 transition-colors border-b border-border/50 last:border-0">
                      <div className="col-span-5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground">
                          <Car className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-navy">Mercedes-Benz C300</p>
                          <p className="text-xs text-muted-foreground">Sedan</p>
                        </div>
                      </div>
                      <div className="col-span-3 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-black border border-gray-600" />
                        <span className="text-sm text-foreground/80">Preto Obsidian</span>
                      </div>
                      <div className="col-span-3">
                        <span className="text-sm font-mono font-medium text-gold bg-gold/5 px-2 py-1 rounded">ABC-1234</span>
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 text-center p-8 bg-muted/10 rounded-lg border border-dashed border-muted-foreground/20">
                    <Car className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Apenas um veículo cadastrado. Moradores podem ter até 3 veículos.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documentos */}
            <TabsContent value="documentos" className="mt-0">
              <Card className="border border-border/50 shadow-luxury">
                <CardHeader className="pb-4 border-b border-border/50">
                  <CardTitle className="text-xl text-navy-dark uppercase tracking-wide border-l-4 border-gold pl-4">Documentos e Anexos</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border hover:border-gold/50 transition-colors bg-card p-4 rounded-lg flex items-start gap-4 shadow-sm">
                      <div className="bg-blue-50 p-2 rounded text-blue-500">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-navy">RG / CNH</h4>
                        <p className="text-xs text-muted-foreground mt-1 mb-3">Documento de identificação com foto.</p>
                        <Button variant="outline" size="sm" className="w-full text-xs h-8 border-dashed">
                          <Upload className="w-3 h-3 mr-2" /> Selecionar Arquivo
                        </Button>
                      </div>
                    </div>

                    <div className="border hover:border-gold/50 transition-colors bg-card p-4 rounded-lg flex items-start gap-4 shadow-sm">
                      <div className="bg-green-50 p-2 rounded text-green-500">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-navy">Comprovante de Renda</h4>
                        <p className="text-xs text-muted-foreground mt-1 mb-3">Holerite ou Extrato Bancário recente.</p>
                        <Button variant="outline" size="sm" className="w-full text-xs h-8 border-dashed">
                          <Upload className="w-3 h-3 mr-2" /> Selecionar Arquivo
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>

          <div className="mt-8 bg-gold/10 border border-gold/20 rounded-lg p-4 flex items-start gap-4">
            <div className="min-w-4 h-4 mt-0.5 rounded-sm border border-gold flex items-center justify-center">
              <div className="w-2 h-2 bg-gold/50" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-navy-dark uppercase tracking-wider mb-1">Privacidade de Dados e Termos de Uso</h5>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ao cadastrar este morador, confirmo que todos os dados fornecidos são precisos e cumprem o regimento interno do condomínio. 
                Os dados pessoais do morador serão tratados em conformidade com a Lei Geral de Proteção de Dados (LGPD).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
