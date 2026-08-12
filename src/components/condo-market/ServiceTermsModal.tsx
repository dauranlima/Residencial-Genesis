import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldAlert, FileText, CheckCircle2, AlertTriangle } from "lucide-react";

interface ServiceTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  isSeniorMode?: boolean;
}

export default function ServiceTermsModal({
  isOpen,
  onClose,
  onAccept,
  isSeniorMode = false,
}: ServiceTermsModalProps) {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setAccepted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (accepted) {
      onAccept();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl p-0 rounded-3xl bg-white text-slate-900 border-0 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 text-white relative">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-md shrink-0">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 uppercase tracking-wider mb-1">
                Termos de Responsabilidade
              </div>
              <DialogTitle className={`font-extrabold text-white ${isSeniorMode ? "text-2xl" : "text-xl"}`}>
                Aviso Legal & Termos de Serviços
              </DialogTitle>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs md:text-sm text-amber-900 leading-relaxed space-y-1">
              <p className="font-bold">Aviso Obrigatório ao Prestador de Serviço:</p>
              <p>
                A plataforma <strong>viziGO</strong> conecta moradores de forma independente. No momento do cadastro ou da publicação de um serviço, exigimos o seu aceite expresso quanto ao cumprimento das normas do condomínio.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3 text-xs md:text-sm text-slate-700 leading-relaxed">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Isenção de Responsabilidade Legal da Plataforma</span>
            </div>
            <p>
              O morador anunciante é o único e exclusivo responsável pela veracidade, segurança, qualidade e legalidade do serviço oferecido.
            </p>
            <p>
              A plataforma <strong>viziGO</strong> fica totalmente isenta de qualquer responsabilidade civil, trabalhista, fiscal ou administrativa decorrente de divergências, barulhos, incompatibilidades ou prestação de serviços nas dependências do condomínio.
            </p>
          </div>

          {/* Checkbox de Aceito */}
          <div className="flex items-start space-x-3 p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl transition-all">
            <Checkbox
              id="service-terms-check"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(!!checked)}
              className="mt-0.5 h-5 w-5 border-emerald-600 data-[state=checked]:bg-emerald-600 data-[state=checked]:text-white"
            />
            <label
              htmlFor="service-terms-check"
              className={`font-semibold text-slate-900 cursor-pointer select-none leading-snug ${
                isSeniorMode ? "text-base" : "text-xs md:text-sm"
              }`}
            >
              Declaro explicitamente que a atividade oferecida não fere o Regimento Interno e a Convenção do meu condomínio, isentando a plataforma de qualquer responsabilidade legal.
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl font-bold border-slate-200 text-slate-700 hover:bg-slate-100"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={!accepted}
            onClick={handleConfirm}
            className={`font-extrabold rounded-xl shadow-lg transition-all flex items-center gap-2 ${
              accepted
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                : "bg-slate-300 text-slate-500 cursor-not-allowed"
            } ${isSeniorMode ? "h-12 px-6 text-base" : "h-11 px-5 text-sm"}`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>OK / Concordar e Continuar</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
