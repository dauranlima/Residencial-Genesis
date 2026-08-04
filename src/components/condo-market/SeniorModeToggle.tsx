import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SeniorModeToggleProps {
  isSeniorMode: boolean;
  onToggle: () => void;
}

export default function SeniorModeToggle({ isSeniorMode, onToggle }: SeniorModeToggleProps) {
  return (
    <Button
      variant={isSeniorMode ? "accent" : "outline"}
      size={isSeniorMode ? "lg" : "default"}
      onClick={onToggle}
      className={`flex items-center gap-2 font-bold shadow-sm transition-all duration-300 ${
        isSeniorMode 
          ? "bg-amber-500 hover:bg-amber-600 text-slate-950 border-2 border-amber-400 text-base px-5 py-3" 
          : "text-primary border-primary/20 hover:bg-primary/5"
      }`}
    >
      {isSeniorMode ? <Eye className="h-5 w-5 stroke-[2.5]" /> : <EyeOff className="h-4 w-4" />}
      <span>{isSeniorMode ? "Modo Sênior Ativado (Letras Grandes)" : "Modo Sênior (Visão Ampliada)"}</span>
    </Button>
  );
}
