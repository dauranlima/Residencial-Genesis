import { useState } from "react";
import { motion } from "framer-motion";
import { Save, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function FichaFiador() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ 
      title: "Ficha salva com sucesso!", 
      description: "As informações do fiador foram salvas." 
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl animate-fade-in font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy-dark">
            Ficha Cadastral para <span className="text-gold">Fiadores</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Preencha os dados do fiador para análise e aprovação.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-muted-foreground/30 text-muted-foreground hover:text-navy hover:border-navy">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-gold hover:bg-gold/90 text-navy-dark font-semibold shadow-gold">
            <Save className="w-4 h-4 mr-2" />
            Salvar Ficha
          </Button>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden text-xs sm:text-sm">
        {/* Formulário Principal */}
        <form className="divide-y divide-blue-100">
          
          {/* Section: Header Apartamento */}
          <div className="p-4 bg-blue-50/50">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8 flex flex-col gap-1">
                <Label className="text-xs font-bold text-navy-dark uppercase">ESCOLHA O APARTAMENTO QUE VOCÊ SERÁ FIADOR</Label>
                <Select>
                  <SelectTrigger className="h-8 bg-white text-muted-foreground"><SelectValue placeholder="ESCOLHA - Apto. - Aluguel Bruto - Desc. Pontualidade - Aluguel Liquido + Agua" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="101">Apto 101 - R$ 1.200</SelectItem>
                    <SelectItem value="102">Apto 102 - R$ 1.200</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-[10px] text-muted-foreground">Valores em Salário Mínimo (confirmar valor em R$).</span>
              </div>
              
              <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                <div>
                  <Label className="text-[10px] font-bold text-navy-dark uppercase">VAGA CARRO</Label>
                  <Select><SelectTrigger className="h-8 bg-white"><SelectValue placeholder="ESCOLHA" /></SelectTrigger><SelectContent><SelectItem value="p">Pequeno Porte</SelectItem><SelectItem value="g">Grande Porte</SelectItem></SelectContent></Select>
                </div>
                <div>
                  <Label className="text-[10px] font-bold text-navy-dark uppercase">VAGA MOTO</Label>
                  <Select><SelectTrigger className="h-8 bg-white"><SelectValue placeholder="ESCOLHA" /></SelectTrigger><SelectContent><SelectItem value="p">Pequena</SelectItem><SelectItem value="g">Grande</SelectItem></SelectContent></Select>
                </div>
                <div>
                  <Label className="text-[10px] font-bold text-navy-dark uppercase">VAGA BICICLETÁRIO</Label>
                  <Select><SelectTrigger className="h-8 bg-white"><SelectValue placeholder="ESCOLHA" /></SelectTrigger><SelectContent><SelectItem value="s">Sim</SelectItem><SelectItem value="n">Não</SelectItem></SelectContent></Select>
                </div>
              </div>

              <div className="md:col-span-6 mt-2">
                <Label className="text-xs font-bold text-navy-dark uppercase">SERÁ FIADOR DE QUEM</Label>
                <Input className="h-8 border-blue-200" placeholder="Nome do locatário" />
              </div>
              <div className="md:col-span-6 mt-2">
                <Label className="text-xs font-bold text-navy-dark uppercase">PARENTESCO / VÍNCULO</Label>
                <Input className="h-8 border-blue-200" placeholder="Ex: Pai, Tio, Sócio" />
              </div>
            </div>
          </div>

          {/* Section: DADOS DO FIADOR */}
          <div className="p-0">
            <div className="bg-[#b4c6e7] py-1 px-4 border-y border-blue-200 flex justify-between">
              <span className="font-bold text-navy-dark">DADOS DO FIADOR</span>
              <span className="font-bold text-navy-dark">FIADOR 1</span>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white">
              <div className="sm:col-span-6"><Label className="text-[10px]">NOME</Label><Input className="h-8" /></div>
              <div className="sm:col-span-4"><Label className="text-[10px]">Profissão</Label><Input className="h-8" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Idade</Label><Input className="h-8" /></div>
              
              <div className="sm:col-span-2"><Label className="text-[10px]">Nacionalidade</Label><Input className="h-8" placeholder="País que Nasceu" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Naturalidade</Label><Input className="h-8" placeholder="Cidade e Estado" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Situação Civil</Label>
                <Select><SelectTrigger className="h-8 text-[10px]"><SelectValue placeholder="RESPONDER" /></SelectTrigger><SelectContent><SelectItem value="s">Solteiro</SelectItem><SelectItem value="c">Casado</SelectItem><SelectItem value="d">Divorciado</SelectItem></SelectContent></Select>
              </div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Dt.Nasc.</Label><Input type="date" className="h-8 text-[10px]" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">CPF</Label><Input className="h-8" placeholder="000.000.000-00" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">RG / Estado</Label><Input className="h-8" placeholder="00.000.000-0/Estado" /></div>

              <div className="sm:col-span-5"><Label className="text-[10px]">Endereço Res.</Label><Input className="h-8" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Bairro</Label><Input className="h-8" /></div>
              <div className="sm:col-span-3"><Label className="text-[10px]">Cidade</Label><Input className="h-8" /></div>
              <div className="sm:col-span-1"><Label className="text-[10px]">UF</Label><Input className="h-8" /></div>
              <div className="sm:col-span-1"><Label className="text-[10px]">CEP</Label><Input className="h-8" placeholder="00.000-000" /></div>

              {/* Contatos */}
              <div className="sm:col-span-2"><Label className="text-[10px]">Celular</Label><Input className="h-8" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Cônjuge (Cel)</Label><Input className="h-8" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Residencial</Label><Input className="h-8" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Comercial</Label><Input className="h-8" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Email 1</Label><Input className="h-8" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Email 2</Label><Input className="h-8" /></div>

              {/* Profissional */}
              <div className="sm:col-span-4"><Label className="text-[10px]">Empresa</Label><Input className="h-8" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Admissão</Label><Input className="h-8" /></div>
              <div className="sm:col-span-4"><Label className="text-[10px]">Função</Label><Input className="h-8" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Dpto.</Label><Input className="h-8" /></div>

              <div className="sm:col-span-2"><Label className="text-[10px]">Registro em Carteira</Label>
                <Select><SelectTrigger className="h-8 text-[10px]"><SelectValue placeholder="RESPONDER" /></SelectTrigger><SelectContent><SelectItem value="s">Sim</SelectItem><SelectItem value="n">Não</SelectItem></SelectContent></Select>
              </div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Possui Empresa</Label>
                <Select><SelectTrigger className="h-8 text-[10px]"><SelectValue placeholder="RESPONDER" /></SelectTrigger><SelectContent><SelectItem value="s">Sim</SelectItem><SelectItem value="n">Não</SelectItem></SelectContent></Select>
              </div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Salário-R$</Label><Input className="h-8" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Outras Rendas-R$</Label><Input className="h-8" /></div>
              <div className="sm:col-span-4"><Label className="text-[10px]">Fonte da renda extra</Label><Input className="h-8" /></div>

              <div className="sm:col-span-5"><Label className="text-[10px]">Endereço Com.</Label><Input className="h-8" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Bairro</Label><Input className="h-8" /></div>
              <div className="sm:col-span-3"><Label className="text-[10px]">Cidade</Label><Input className="h-8" /></div>
              <div className="sm:col-span-1"><Label className="text-[10px]">UF</Label><Input className="h-8" /></div>
              <div className="sm:col-span-1"><Label className="text-[10px]">CEP</Label><Input className="h-8" placeholder="00.000-000" /></div>
            </div>
          </div>

          {/* Section: DADOS DO CÔNJUGE */}
          <div className="p-0">
            <div className="bg-[#b4c6e7] py-1 px-4 border-y border-blue-200 flex justify-between">
              <span className="font-bold text-navy-dark">DADOS DO CÔNJUGE</span>
              <span className="font-bold text-navy-dark">FIADOR 2</span>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white">
              <div className="sm:col-span-6"><Label className="text-[10px]">NOME</Label><Input className="h-8" /></div>
              <div className="sm:col-span-4"><Label className="text-[10px]">Profissão</Label><Input className="h-8" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Idade</Label><Input className="h-8" /></div>
              
              <div className="sm:col-span-2"><Label className="text-[10px]">Nacionalidade</Label><Input className="h-8" placeholder="País que Nasceu" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Naturalidade</Label><Input className="h-8" placeholder="Cidade e Estado" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Situação Civil</Label>
                <Select><SelectTrigger className="h-8 text-[10px]"><SelectValue placeholder="RESPONDER" /></SelectTrigger><SelectContent><SelectItem value="s">Solteiro</SelectItem><SelectItem value="c">Casado</SelectItem><SelectItem value="d">Divorciado</SelectItem></SelectContent></Select>
              </div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Dt.Nasc.</Label><Input type="date" className="h-8 text-[10px]" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">CPF</Label><Input className="h-8" placeholder="000.000.000-00" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">RG / Estado</Label><Input className="h-8" placeholder="00.000.000-0/Estado" /></div>

              <div className="sm:col-span-5"><Label className="text-[10px]">Endereço Res.</Label><Input className="h-8" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Bairro</Label><Input className="h-8" /></div>
              <div className="sm:col-span-3"><Label className="text-[10px]">Cidade</Label><Input className="h-8" /></div>
              <div className="sm:col-span-1"><Label className="text-[10px]">UF</Label><Input className="h-8" /></div>
              <div className="sm:col-span-1"><Label className="text-[10px]">CEP</Label><Input className="h-8" placeholder="00.000-000" /></div>

              {/* Contatos */}
              <div className="sm:col-span-2"><Label className="text-[10px]">Celular</Label><Input className="h-8" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Cônjuge (Cel)</Label><Input className="h-8" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Residencial</Label><Input className="h-8" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Comercial</Label><Input className="h-8" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Email 1</Label><Input className="h-8" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Email 2</Label><Input className="h-8" /></div>

              {/* Profissional */}
              <div className="sm:col-span-4"><Label className="text-[10px]">Empresa</Label><Input className="h-8" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Admissão</Label><Input className="h-8" /></div>
              <div className="sm:col-span-4"><Label className="text-[10px]">Função</Label><Input className="h-8" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Dpto.</Label><Input className="h-8" /></div>

              <div className="sm:col-span-2"><Label className="text-[10px]">Registro em Carteira</Label>
                <Select><SelectTrigger className="h-8 text-[10px]"><SelectValue placeholder="RESPONDER" /></SelectTrigger><SelectContent><SelectItem value="s">Sim</SelectItem><SelectItem value="n">Não</SelectItem></SelectContent></Select>
              </div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Possui Empresa</Label>
                <Select><SelectTrigger className="h-8 text-[10px]"><SelectValue placeholder="RESPONDER" /></SelectTrigger><SelectContent><SelectItem value="s">Sim</SelectItem><SelectItem value="n">Não</SelectItem></SelectContent></Select>
              </div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Salário-R$</Label><Input className="h-8" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Outras Rendas-R$</Label><Input className="h-8" /></div>
              <div className="sm:col-span-4"><Label className="text-[10px]">Fonte da renda extra</Label><Input className="h-8" /></div>

              <div className="sm:col-span-5"><Label className="text-[10px]">Endereço Com.</Label><Input className="h-8" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Bairro</Label><Input className="h-8" /></div>
              <div className="sm:col-span-3"><Label className="text-[10px]">Cidade</Label><Input className="h-8" /></div>
              <div className="sm:col-span-1"><Label className="text-[10px]">UF</Label><Input className="h-8" /></div>
              <div className="sm:col-span-1"><Label className="text-[10px]">CEP</Label><Input className="h-8" placeholder="00.000-000" /></div>

              {/* Conjuge extra fields */}
              <div className="sm:col-span-2"><Label className="text-[10px]">Data Casamento</Label><Input type="date" className="h-8 text-[10px]" /></div>
              <div className="sm:col-span-4"><Label className="text-[10px]">Regime</Label>
                <Select><SelectTrigger className="h-8 text-[10px]"><SelectValue placeholder="RESPONDER" /></SelectTrigger><SelectContent><SelectItem value="cp">Comunhão Parcial</SelectItem><SelectItem value="cu">Comunhão Universal</SelectItem><SelectItem value="sb">Separação de Bens</SelectItem></SelectContent></Select>
              </div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Filhos menor de 18</Label><Input type="number" className="h-8" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Filhos maior de 18</Label><Input type="number" className="h-8" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Quantos filhos estudam</Label><Input type="number" className="h-8" /></div>
            </div>
          </div>

          {/* Section: INFORMAÇÕES PATRIMONIAIS */}
          <div className="p-0">
            <div className="bg-[#b4c6e7] py-1 px-4 border-y border-blue-200 flex justify-between">
              <span className="font-bold text-navy-dark">INFORMAÇÕES PATRIMONIAIS</span>
              <span className="font-bold text-navy-dark">FIADORES</span>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white">
              
              <div className="sm:col-span-2"><Label className="text-[10px]">Imóvel Próprio</Label>
                <Select><SelectTrigger className="h-8 text-[10px]"><SelectValue placeholder="RESPONDER" /></SelectTrigger><SelectContent><SelectItem value="s">Sim</SelectItem><SelectItem value="n">Não</SelectItem></SelectContent></Select>
              </div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Quitado</Label>
                <Select><SelectTrigger className="h-8 text-[10px]"><SelectValue placeholder="RESPONDER" /></SelectTrigger><SelectContent><SelectItem value="s">Sim</SelectItem><SelectItem value="n">Não</SelectItem></SelectContent></Select>
              </div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Aluguel/Prestação-R$</Label><Input className="h-8" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Condomínio-R$</Label><Input className="h-8" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Despesa total Mensal-R$</Label><Input className="h-8" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Mora desde quando no imóvel</Label><Input className="h-8" /></div>

              <div className="sm:col-span-2"><Label className="text-[10px]">Divide despesa com alguem</Label>
                <Select><SelectTrigger className="h-8 text-[10px]"><SelectValue placeholder="RESPONDER" /></SelectTrigger><SelectContent><SelectItem value="s">Sim</SelectItem><SelectItem value="n">Não</SelectItem></SelectContent></Select>
              </div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Valor da sua parte-R$</Label><Input className="h-8" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Já atrasou o pagamento</Label>
                <Select><SelectTrigger className="h-8 text-[10px]"><SelectValue placeholder="RESPONDER" /></SelectTrigger><SelectContent><SelectItem value="s">Sim</SelectItem><SelectItem value="n">Não</SelectItem></SelectContent></Select>
              </div>
              <div className="sm:col-span-4"><Label className="text-[10px]">Nome Proprietário</Label><Input className="h-8" /></div>
              <div className="sm:col-span-2"><Label className="text-[10px]">Celular Proprietário</Label><Input className="h-8" /></div>

              <div className="sm:col-span-4"><Label className="text-[10px]">Qual motivo da sua saida deste local</Label><Input className="h-8" /></div>
              <div className="sm:col-span-8"><Label className="text-[10px]">Deixou pendências quando saiu do imóvel. Explique</Label><Input className="h-8" /></div>

              {/* Imoveis repetidos */}
              {[1, 2].map(i => (
                <div key={`imovel-${i}`} className="col-span-12 grid grid-cols-1 sm:grid-cols-12 gap-3 mt-1 items-end">
                  <div className="sm:col-span-2"><Label className="text-[10px]">Possui outros imóveis</Label>
                    <Select><SelectTrigger className="h-8 text-[10px]"><SelectValue placeholder="RESPONDER" /></SelectTrigger><SelectContent><SelectItem value="s">Sim</SelectItem><SelectItem value="n">Não</SelectItem></SelectContent></Select>
                  </div>
                  <div className="sm:col-span-2"><Label className="text-[10px]">Quitado</Label>
                    <Select><SelectTrigger className="h-8 text-[10px]"><SelectValue placeholder="RESPONDER" /></SelectTrigger><SelectContent><SelectItem value="s">Sim</SelectItem><SelectItem value="n">Não</SelectItem></SelectContent></Select>
                  </div>
                  <div className="sm:col-span-3"><Label className="text-[10px]">Tipo do imóvel</Label>
                    <Select><SelectTrigger className="h-8 text-[10px]"><SelectValue placeholder="RESPONDER" /></SelectTrigger><SelectContent><SelectItem value="casa">Casa</SelectItem><SelectItem value="apto">Apto</SelectItem></SelectContent></Select>
                  </div>
                  <div className="sm:col-span-3"><Label className="text-[10px]">Cidade/Estado</Label><Input className="h-8" /></div>
                  <div className="sm:col-span-2"><Label className="text-[10px]">Valor do imóvel-R$</Label><Input className="h-8" /></div>
                </div>
              ))}

              {/* Veiculos */}
              {[1, 2].map(i => (
                <div key={`carro-${i}`} className="col-span-12 grid grid-cols-1 sm:grid-cols-12 gap-3 mt-1 items-end">
                  <div className="sm:col-span-2"><Label className="text-[10px]">Possui CARRO</Label>
                    <Select><SelectTrigger className="h-8 text-[10px]"><SelectValue placeholder="RESPONDER" /></SelectTrigger><SelectContent><SelectItem value="s">Sim</SelectItem><SelectItem value="n">Não</SelectItem></SelectContent></Select>
                  </div>
                  <div className="sm:col-span-2"><Label className="text-[10px]">Marca</Label><Input className="h-8" /></div>
                  <div className="sm:col-span-2"><Label className="text-[10px]">Modelo</Label><Input className="h-8" /></div>
                  <div className="sm:col-span-1"><Label className="text-[10px]">Ano</Label><Input className="h-8" /></div>
                  <div className="sm:col-span-1"><Label className="text-[10px]">Placa</Label><Input className="h-8" /></div>
                  <div className="sm:col-span-1"><Label className="text-[10px]">Cor</Label><Input className="h-8" /></div>
                  <div className="sm:col-span-1"><Label className="text-[10px]">Quitado</Label>
                    <Select><SelectTrigger className="h-8 text-[10px]"><SelectValue placeholder="RESP" /></SelectTrigger><SelectContent><SelectItem value="s">Sim</SelectItem><SelectItem value="n">Não</SelectItem></SelectContent></Select>
                  </div>
                  <div className="sm:col-span-2"><Label className="text-[10px]">Valor da Prestação-R$</Label><Input className="h-8" /></div>
                </div>
              ))}

              {[1, 2].map(i => (
                <div key={`moto-${i}`} className="col-span-12 grid grid-cols-1 sm:grid-cols-12 gap-3 mt-1 items-end">
                  <div className="sm:col-span-2"><Label className="text-[10px]">Possui MOTO</Label>
                    <Select><SelectTrigger className="h-8 text-[10px]"><SelectValue placeholder="RESPONDER" /></SelectTrigger><SelectContent><SelectItem value="s">Sim</SelectItem><SelectItem value="n">Não</SelectItem></SelectContent></Select>
                  </div>
                  <div className="sm:col-span-2"><Label className="text-[10px]">Marca</Label><Input className="h-8" /></div>
                  <div className="sm:col-span-2"><Label className="text-[10px]">Modelo</Label><Input className="h-8" /></div>
                  <div className="sm:col-span-1"><Label className="text-[10px]">Ano</Label><Input className="h-8" /></div>
                  <div className="sm:col-span-1"><Label className="text-[10px]">Placa</Label><Input className="h-8" /></div>
                  <div className="sm:col-span-1"><Label className="text-[10px]">Cor</Label><Input className="h-8" /></div>
                  <div className="sm:col-span-1"><Label className="text-[10px]">Quitado</Label>
                    <Select><SelectTrigger className="h-8 text-[10px]"><SelectValue placeholder="RESP" /></SelectTrigger><SelectContent><SelectItem value="s">Sim</SelectItem><SelectItem value="n">Não</SelectItem></SelectContent></Select>
                  </div>
                  <div className="sm:col-span-2"><Label className="text-[10px]">Valor da Prestação-R$</Label><Input className="h-8" /></div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: REFERENCIAS */}
          <div className="p-0">
            <div className="bg-[#b4c6e7] py-1 px-4 border-y border-blue-200 flex justify-between">
              <span className="font-bold text-navy-dark">REFERÊNCIAS PESSOAIS – 3 INDICAÇÕES</span>
              <span className="font-bold text-navy-dark">FIADORES</span>
            </div>
            <div className="p-0 overflow-x-auto bg-white">
              <table className="w-full text-[10px] text-left">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-4 py-2 border-b border-r border-blue-200 font-bold">Nome</th>
                    <th className="px-4 py-2 border-b border-r border-blue-200 font-bold">Idade</th>
                    <th className="px-4 py-2 border-b border-r border-blue-200 font-bold">Profissão</th>
                    <th className="px-4 py-2 border-b border-r border-blue-200 font-bold">Grau de Parentesco</th>
                    <th className="px-4 py-2 border-b border-blue-200 font-bold">Celular</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((row) => (
                    <tr key={row}>
                      <td className="border-b border-r border-blue-200 p-0"><Input className="h-8 rounded-none border-0 focus-visible:ring-0" /></td>
                      <td className="border-b border-r border-blue-200 p-0"><Input className="h-8 rounded-none border-0 focus-visible:ring-0" /></td>
                      <td className="border-b border-r border-blue-200 p-0"><Input className="h-8 rounded-none border-0 focus-visible:ring-0" /></td>
                      <td className="border-b border-r border-blue-200 p-0"><Input className="h-8 rounded-none border-0 focus-visible:ring-0" /></td>
                      <td className="border-b border-blue-200 p-0"><Input className="h-8 rounded-none border-0 focus-visible:ring-0" placeholder="( )" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: ESCLARECIMENTOS */}
          <div className="p-0">
            <div className="bg-[#b4c6e7] py-1 px-4 border-y border-blue-200 flex justify-between">
              <span className="font-bold text-navy-dark uppercase">Utilize este espaço para esclarecimentos e informações</span>
              <span className="font-bold text-navy-dark">FIADORES</span>
            </div>
            <div className="p-4 bg-white">
              <Textarea className="w-full min-h-[80px] bg-white border-blue-200" placeholder="Escreva aqui se necessário..." />
            </div>
          </div>

          {/* Section: Termo */}
          <div className="p-6 bg-white space-y-4">
            <p className="text-[9px] text-justify leading-relaxed text-muted-foreground font-medium">
              TERMO DE AUTORIZAÇÃO EXPRESSA E ISENÇÃO DE RESPONSABILIDADE – LGPD E LEGISLAÇÃO BRASILEIRA - Pousada Residencial Morada do Sol 2  - Website: www.residencialgenesis.com. IMPORTANTE: Autoriza expressamente o tratamento de seus dados e declara ciência sobre os termos aqui descritos. 1. OBJETIVO- Autorização expressa, livre, informada e inequívoca para o tratamento de dados pessoais e sensíveis, conforme previsto na Lei nº 13.709/2018 – Lei Geral de Proteção de Dados Pessoais (LGPD), bem como isentar de forma ampla e irrestrita a Pousada Residencial Morada do Sol 2  e qualquer responsável, sócio, procurador, preposto e funcionários, de quaisquer responsabilidades legais. 2. DADOS COLETADOS- Estou ciente de que o formulário contém informações pessoais sensíveis, como: origem racial ou étnica; convicções religiosas ou filosóficas; opiniões políticas; informações sobre saúde, vida sexual ou orientação sexual; dados biométricos, genéticos ou outros classificados como sensíveis pela legislação brasileira. 3. CONSENTIMENTO - Autorizo expressamente que a Pousada Residencial Morada do Sol 2  trate meus dados pessoais e sensíveis para os fins legítimos informados, incluindo armazenamento, análise, gestão interna, e eventual compartilhamento com parceiros exclusivamente para os fins autorizados. 4. ISENÇÃO DE RESPONSABILIDADE - Declaro, de forma expressa, que: estou ciente de que o fornecimento dos dados é voluntário e de minha exclusiva responsabilidade; a veracidade, integridade e exatidão das informações fornecidas são de minha total responsabilidade; isento, de forma ampla e irrestrita, a Pousada Residencial Morada do Sol 2  e seus representantes legais de qualquer responsabilidade civil, criminal, administrativa, moral ou de qualquer outra natureza, inclusive no âmbito da LGPD e demais legislações brasileiras vigentes, relacionadas ao conteúdo das informações fornecidas; ao uso legítimo e legal dos dados conforme informado e a eventuais consequências legais oriundas do meu próprio fornecimento ou uso indevido por terceiros não autorizados. 5. SEGURANÇA E BOA-FÉ- A Pousada Residencial Morada do Sol 2  declara adotar medidas técnicas e administrativas razoáveis para proteger os dados tratados, nos termos da legislação vigente. No entanto, o participante reconhece que não haverá responsabilização em caso de incidentes decorrentes de caso fortuito, força maior ou ações de terceiros fora do controle direto da pousada. 6. DIREITOS DO TITULAR DOS DADOS- Estou ciente de que posso e faço neste momento, minha plena renúncia irrevogável ao direito de solicitar acesso aos meus dados; anonimização, bloqueio ou eliminação; revogação deste consentimento. 7. POLÍTICA DE PRIVACIDADE- A presente autorização e isenção de responsabilidade, ora firmada por minha pessoa, terá plena, inesgotável e ilimitada eficácia em qualquer meio ou tratativas que envolvam direta e/ou indiretamente as partes, em âmbito social, contratual, regimental, profissional, locatício e qualquer outro que alcance o vínculo legal das partes, liberando e autorizando a Pousada Residencial Morada do Sol 2 , a utilizar dos dados supra informados, dentro da forma necessária ao fiel cumprimento dos objetivos da Pousada. FIRMA DE CONSENTIMENTO DIGITAL
            </p>

            <div className="flex items-start gap-4">
              <div className="border border-gold bg-yellow-100 p-1">
                <Checkbox id="terms" className="border-gold text-gold" />
              </div>
              <Label htmlFor="terms" className="text-sm cursor-pointer mt-1">
                Li, compreendi e aceito integralmente os termos deste documento. Autorizo o tratamento dos meus dados e isento a Pousada Residencial Morada do Sol 2  de qualquer responsabilidade conforme descrito acima.
              </Label>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between mt-4">
              <div className="bg-yellow-200 border border-yellow-400 font-bold px-4 py-1 flex items-center gap-2">
                <span className="text-2xl text-navy leading-none">↑</span>
                <span className="uppercase text-sm">OBRIGATÓRIO</span> 
                <span className="text-xs font-normal">MARQUE, CONFIRMANDO A LEITURA</span>
              </div>
              <div className="flex items-center gap-4 mt-4 sm:mt-0 text-sm">
                <span>Cascavel/PR</span>
                <Input className="w-32 h-8 text-center" placeholder="DD/MM/AAAA" />
                <span>-</span>
                <Input className="w-24 h-8 text-center text-red-500 placeholder:text-red-300" placeholder="00:00 horas" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-around mt-12 py-8 relative">
              <div className="w-full sm:w-auto flex flex-col items-center">
                <span className="text-2xl font-bold text-gold absolute left-[15%] top-0">⇒</span>
                <div className="w-64 border-b border-black mb-2 mt-6"></div>
                <span className="font-bold">FIADOR 1</span>
                <span className="text-xs text-muted-foreground mt-1 text-center max-w-[280px]">Assinatura Eletrônica - via Plataforma GOV https://www.gov.br/pt-br/servicos/assinatura-eletronica</span>
              </div>
              <div className="w-full sm:w-auto flex flex-col items-center mt-12 sm:mt-0 relative">
                <span className="text-2xl font-bold text-gold absolute left-[20%] top-0">⇒</span>
                <div className="w-64 border-b border-black mb-2 mt-6"></div>
                <span className="font-bold">FIADOR 2</span>
              </div>
            </div>

            <div className="flex justify-center mt-4 pb-4">
               <div className="border border-black p-2 bg-white flex items-center gap-2">
                 <span className="bg-yellow-200 font-bold px-2 py-1 text-xs border border-black">Atenção</span>
                 <span className="text-xs">Após preenchimento: <span className="font-bold underline">SALVAR</span> em .PDF, <span className="font-bold underline">ASSINAR</span> na plataforma GOV e <span className="font-bold underline">ENVIAR</span> arquivo via Whatsapp (45) 99915-8889</span>
               </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
