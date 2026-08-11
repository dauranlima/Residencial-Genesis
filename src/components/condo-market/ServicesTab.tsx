import React, { useState } from "react";
import { Search, Briefcase, PlusCircle, Sparkles, Filter, Award } from "lucide-react";
import { ResidentServiceProfile } from "./types";
import { SERVICE_CATEGORIES, SERVICE_FILTER_CATEGORIES } from "./categories";
import ServiceProfileCard from "./ServiceProfileCard";
import { Button } from "@/components/ui/button";

interface ServicesTabProps {
  profiles: ResidentServiceProfile[];
  isLoading: boolean;
  onSelectProfile: (profile: ResidentServiceProfile) => void;
  onOpenRegisterModal: () => void;
  isSeniorMode?: boolean;
}

export default function ServicesTab({
  profiles,
  isLoading,
  onSelectProfile,
  onOpenRegisterModal,
  isSeniorMode = false,
}: ServicesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // Mapeamento de palavras-chave para categorias antigas / profissões legadas
  const legacyKeywords: Record<string, string[]> = {
    beleza: ["maquiadora", "maquiagem", "massagista", "massagem", "cabeleireiro", "estética", "manicure", "beleza"],
    domesticos: ["diarista", "faxineira", "limpeza", "passadeira", "arrumadeira", "doméstico", "domestico"],
    manutencao: ["eletricista", "encanador", "pintor", "pedreiro", "marceneiro", "reparos", "manutenção", "manutencao"],
    tecnologia: ["técnico de informática", "informática", "ti", "computador", "celular", "suporte", "tecnologia"],
    pet: ["pet sitter", "pet", "dog walker", "adestrador", "tosador", "veterinário", "animais"],
    educacao: ["professor", "professor particular", "reforço", "aulas", "idiomas", "educação", "educacao"],
    eventos: ["fotógrafo", "fotografia", "filmagem", "buffet", "eventos", "fotos"],
    jardinagem: ["jardinagem", "jardineiro", "paisagismo", "plantas", "externa"],
    fretes: ["frete", "fretes", "mudança", "transporte", "entregas"],
  };

  // Filtro inteligente por busca e categoria
  const filteredProfiles = profiles.filter((p) => {
    // Filtro por Categoria
    if (selectedCategory !== "Todos") {
      const catObj = SERVICE_CATEGORIES.find(
        (c) => `${c.emoji} ${c.name}` === selectedCategory || c.name === selectedCategory
      );
      if (catObj) {
        const catNameNorm = catObj.name.toLowerCase();
        const pCatNorm = (p.category || "").toLowerCase();
        const pProfNorm = (p.profession || "").toLowerCase();

        const directMatch = pCatNorm === catNameNorm || pProfNorm === catNameNorm;
        const partialMatch = pCatNorm.includes(catNameNorm) || catNameNorm.includes(pCatNorm) ||
                             pProfNorm.includes(catNameNorm) || catNameNorm.includes(pProfNorm);

        const keywords = legacyKeywords[catObj.id] || [];
        const keywordMatch = keywords.some(kw => pCatNorm.includes(kw) || pProfNorm.includes(kw));

        if (!directMatch && !partialMatch && !keywordMatch) return false;
      }
    }

    // Filtro por Busca (Nome, Profissão, Especialidade ou Descrição)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.residentName.toLowerCase().includes(q);
      const matchProfession = p.profession.toLowerCase().includes(q);
      const matchCategory = (p.category || "").toLowerCase().includes(q);
      const matchSpecialty = (p.specialty || "").toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      return matchName || matchProfession || matchCategory || matchSpecialty || matchDesc;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Banner de Destaque da Plataforma de Serviços */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 md:p-8 shadow-xl border border-emerald-900/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Rede de Profissionais do Condomínio</span>
            </div>
            <h2 className={`font-extrabold tracking-tight ${isSeniorMode ? 'text-3xl' : 'text-2xl md:text-3xl'}`}>
              Serviços Prestados por Vizinhos
            </h2>
            <p className={`text-slate-300 ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
              Contrate maquiadoras, eletricistas, diaristas e especialistas que moram na sua torre ou bloco com segurança e avaliações reais.
            </p>
          </div>

          <Button
            onClick={onOpenRegisterModal}
            className={`bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-2xl shadow-lg shadow-emerald-500/25 transition-all scale-100 hover:scale-105 shrink-0 flex items-center gap-2 ${
              isSeniorMode ? 'h-14 px-6 text-lg' : 'h-12 px-5 text-sm md:text-base'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span>💼 Quero oferecer meus serviços</span>
          </Button>
        </div>

        {/* Efeito decorativo de iluminação */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Barra de Busca e Filtro de Categorias */}
      <div className="space-y-4">
        {/* Campo de Pesquisa */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar profissional por nome, profissão (ex: Maquiadora, Eletricista, TI)..."
            className={`w-full pl-12 pr-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm ${
              isSeniorMode ? 'h-14 text-lg' : 'h-12 text-sm'
            }`}
          />
        </div>

        {/* Carrossel de Pílulas de Categorias (Ícones com emojis) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {SERVICE_FILTER_CATEGORIES.map((catLabel) => {
            const isSelected = selectedCategory === catLabel;
            return (
              <button
                key={catLabel}
                onClick={() => setSelectedCategory(catLabel)}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <span>{catLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Estatística rápida / Total de profissionais */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>
          Exibindo <strong>{filteredProfiles.length}</strong> profissionais no condomínio
        </span>
        {selectedCategory !== "Todos" && (
          <button
            onClick={() => setSelectedCategory("Todos")}
            className="text-emerald-600 font-semibold hover:underline"
          >
            Limpar filtro
          </button>
        )}
      </div>

      {/* Grid de Cards de Profissionais */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
            <Briefcase className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Nenhum profissional encontrado
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              {searchQuery || selectedCategory !== "Todos"
                ? "Tente buscar por outro termo ou selecione a categoria 'Todos'."
                : "Seja o primeiro a oferecer seus serviços no condomínio!"}
            </p>
          </div>
          <Button
            onClick={onOpenRegisterModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
          >
            💼 Cadastrar Meus Serviços
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <ServiceProfileCard
              key={profile.id}
              profile={profile}
              onSelect={onSelectProfile}
              isSeniorMode={isSeniorMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
