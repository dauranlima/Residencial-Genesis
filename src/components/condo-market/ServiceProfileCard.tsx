import React from "react";
import { Star, MapPin, Phone, Camera, Sparkles, ChevronRight } from "lucide-react";
import { ResidentServiceProfile } from "./types";
import { Button } from "@/components/ui/button";

interface ServiceProfileCardProps {
  profile: ResidentServiceProfile;
  onSelect: (profile: ResidentServiceProfile) => void;
  isSeniorMode?: boolean;
}

export default function ServiceProfileCard({ profile, onSelect, isSeniorMode = false }: ServiceProfileCardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 hover:border-emerald-500/40 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group ${isSeniorMode ? 'p-6' : 'p-5'}`}>
      <div>
        {/* Banner do topo com fotos do portfólio ou placeholder */}
        <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4 bg-slate-100 border border-slate-100">
          {profile.images && profile.images.length > 0 ? (
            <img
              src={profile.images[0]}
              alt={profile.profession}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-800">
              <Sparkles className="w-10 h-10 mb-2 opacity-60" />
              <span className="text-sm font-medium">{profile.profession}</span>
            </div>
          )}

          {/* Badge de Categoria/Profissão */}
          <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-white/10">
            <span>{profile.profession}</span>
          </div>

          {/* Quantidade de fotos no portfólio */}
          {profile.images && profile.images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1">
              <Camera className="w-3.5 h-3.5" />
              <span>+{profile.images.length - 1}</span>
            </div>
          )}
        </div>

        {/* Nome do profissional e Moradia */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className={`font-bold text-slate-900 line-clamp-1 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
              {profile.residentName}
            </h3>
            <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                {profile.residentBlock ? `${profile.residentBlock} • ` : ''}{profile.residentUnit} (Vizinho Verificado)
              </span>
            </p>
          </div>

          {/* Avaliação Estrelas */}
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 text-amber-900 px-2.5 py-1 rounded-lg shrink-0">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500 shrink-0" />
            <span className="font-bold text-sm">{profile.rating.toFixed(1)}</span>
            <span className="text-xs text-amber-700 font-medium">({profile.reviewCount})</span>
          </div>
        </div>

        {/* Especialidade / Descrição curta */}
        {profile.specialty && (
          <p className="text-xs text-emerald-700 bg-emerald-50/80 font-medium px-2.5 py-1 rounded-md mb-2.5 line-clamp-1 inline-block">
            ✨ {profile.specialty}
          </p>
        )}

        <p className={`text-slate-600 line-clamp-2 mb-4 ${isSeniorMode ? 'text-base' : 'text-xs'}`}>
          {profile.description}
        </p>
      </div>

      {/* Footer com Preço a partir de e Ação */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] text-slate-400 font-medium block uppercase tracking-wider">A partir de</span>
          <span className={`font-extrabold text-emerald-600 ${isSeniorMode ? 'text-2xl' : 'text-xl'}`}>
            R$ {profile.startingPrice.toFixed(0)}
          </span>
        </div>

        <Button
          onClick={() => onSelect(profile)}
          className={`bg-slate-900 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-colors duration-200 flex items-center gap-1 ${
            isSeniorMode ? 'h-12 px-5 text-base' : 'h-10 px-4 text-sm'
          }`}
        >
          <span>Ver mais...</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
