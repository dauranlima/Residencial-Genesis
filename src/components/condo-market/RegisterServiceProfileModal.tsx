import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SERVICE_CATEGORIES } from "./categories";
import { ResidentServiceProfile, CurrentUser } from "./types";
import { uploadServiceProfileImages, saveResidentServiceProfileInSupabase } from "@/lib/residentServicesService";
import { toast } from "sonner";
import { Upload, X, Briefcase, Camera, Loader2, ShieldAlert } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface RegisterServiceProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CurrentUser | null;
  existingProfile?: ResidentServiceProfile | null;
  onSuccess: (profile: ResidentServiceProfile) => void;
}

export default function RegisterServiceProfileModal({
  isOpen,
  onClose,
  currentUser,
  existingProfile,
  onSuccess,
}: RegisterServiceProfileModalProps) {
  const [residentName, setResidentName] = useState("");
  const [residentBlock, setResidentBlock] = useState("");
  const [residentUnit, setResidentUnit] = useState("");
  const [profession, setProfession] = useState("");
  const [category, setCategory] = useState(SERVICE_CATEGORIES[0].name);
  const [specialty, setSpecialty] = useState("");
  const [experience, setExperience] = useState("");
  const [description, setDescription] = useState("");
  const [workHours, setWorkHours] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<string[]>(["PIX"]);

  // Aceite dos Termos de Responsabilidade
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  // Upload de Fotos
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAcceptedTerms(true);
      if (existingProfile) {
        setResidentName(existingProfile.residentName);
        setResidentBlock(existingProfile.residentBlock || "");
        setResidentUnit(existingProfile.residentUnit);
        setProfession(existingProfile.profession);
        setCategory(existingProfile.category);
        setSpecialty(existingProfile.specialty || "");
        setExperience(existingProfile.experience || "");
        setDescription(existingProfile.description);
        setWorkHours(existingProfile.workHours || "");
        setStartingPrice(existingProfile.startingPrice ? String(existingProfile.startingPrice) : "");
        setWhatsapp(existingProfile.whatsapp);
        setPaymentMethods(existingProfile.paymentMethods || ["PIX"]);
        setExistingImageUrls(existingProfile.images || []);
      } else if (currentUser) {
        setResidentName(currentUser.name);
        setResidentBlock(currentUser.block || "");
        setResidentUnit(currentUser.unit);
        setWhatsapp(currentUser.phone || "");
        setExistingImageUrls([]);
      }
      setSelectedFiles([]);
      setPreviewUrls([]);
    }
  }, [isOpen, existingProfile, currentUser]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    
    if (existingImageUrls.length + selectedFiles.length + filesArray.length > 5) {
      toast.error("Máximo de 5 fotos por perfil de serviço.");
      return;
    }

    const newFiles = [...selectedFiles, ...filesArray];
    setSelectedFiles(newFiles);

    const newPreviews = filesArray.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  const handleRemoveNewImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const togglePaymentMethod = (method: string) => {
    setPaymentMethods(prev =>
      prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!residentName || !residentUnit) {
      toast.error("Preencha seu nome e apartamento.");
      return;
    }
    if (!profession.trim()) {
      toast.error("Informe sua profissão ou serviço prestado.");
      return;
    }
    if (!description.trim()) {
      toast.error("Preencha uma breve descrição dos seus serviços.");
      return;
    }
    if (!startingPrice || isNaN(Number(startingPrice)) || Number(startingPrice) <= 0) {
      toast.error("Informe um valor inicial válido (A partir de R$).");
      return;
    }
    if (!whatsapp.trim()) {
      toast.error("Informe seu número de WhatsApp para contato.");
      return;
    }
    if (!acceptedTerms) {
      toast.error("Você deve declarar que a atividade oferecida não fere o Regimento Interno do condomínio.");
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedUrls: string[] = [];
      if (selectedFiles.length > 0) {
        uploadedUrls = await uploadServiceProfileImages(selectedFiles);
      }

      const finalImages = [...existingImageUrls, ...uploadedUrls];

      const savedProfile = await saveResidentServiceProfileInSupabase({
        id: existingProfile?.id,
        residentName,
        residentBlock,
        residentUnit,
        profession,
        category,
        specialty,
        experience,
        description,
        images: finalImages,
        workHours,
        startingPrice: Number(startingPrice),
        paymentMethods,
        whatsapp,
        isActive: true,
      });

      toast.success(existingProfile ? "Perfil atualizado com sucesso!" : "Seu perfil profissional foi publicado!");
      onSuccess(savedProfile);
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro ao salvar perfil profissional.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl bg-white text-slate-900 border-0 shadow-2xl">
        <DialogHeader className="pb-4 border-b border-slate-100">
          <DialogTitle className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-emerald-600" />
            <span>💼 Quero Oferecer Meus Serviços</span>
          </DialogTitle>
          <p className="text-xs text-slate-500">
            Cadastre sua profissão para oferecer seus serviços diretamente aos vizinhos do condomínio.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Informações do Morador */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div>
              <Label className="text-xs font-semibold text-slate-600">Seu Nome</Label>
              <Input
                value={residentName}
                onChange={(e) => setResidentName(e.target.value)}
                placeholder="Ex: Maria Silva"
                className="mt-1 h-9 rounded-lg"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-600">Torre / Bloco</Label>
              <Input
                value={residentBlock}
                onChange={(e) => setResidentBlock(e.target.value)}
                placeholder="Ex: Torre 2"
                className="mt-1 h-9 rounded-lg"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-600">Apartamento *</Label>
              <Input
                value={residentUnit}
                onChange={(e) => setResidentUnit(e.target.value)}
                placeholder="Ex: Apt 401"
                className="mt-1 h-9 rounded-lg"
              />
            </div>
          </div>

          {/* Profissão & Categoria */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-slate-700">Profissão / Serviço Principal *</Label>
              <Input
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="Ex: Maquiadora, Diarista, Eletricista"
                className="mt-1 rounded-lg"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">Categoria de Enquadramento</Label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.emoji} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Especialidade & Experiência */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-slate-700">Especialidade / Foco</Label>
              <Input
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="Ex: Maquiagem social, noivas e festas"
                className="mt-1 rounded-lg"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-700">Tempo de Experiência</Label>
              <Input
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Ex: 5 anos de experiência"
                className="mt-1 rounded-lg"
              />
            </div>
          </div>

          {/* Descrição Completa */}
          <div>
            <Label className="text-xs font-semibold text-slate-700">Descrição Detalhada do Serviço *</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o que você faz, diferenciais, atendimento no condomínio, se leva material próprio..."
              rows={3}
              className="mt-1 rounded-lg text-sm"
            />
          </div>

          {/* Preço Inicial & Horários & WhatsApp */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label className="text-xs font-semibold text-slate-700">A partir de (R$) *</Label>
              <Input
                type="number"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                placeholder="Ex: 80"
                className="mt-1 rounded-lg"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-700">Horário de Atendimento</Label>
              <Input
                value={workHours}
                onChange={(e) => setWorkHours(e.target.value)}
                placeholder="Ex: Seg a Sáb, 08h às 18h"
                className="mt-1 rounded-lg"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-700">WhatsApp para Contato *</Label>
              <Input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="(45) 99999-8888"
                className="mt-1 rounded-lg"
              />
            </div>
          </div>

          {/* Formas de Pagamento */}
          <div>
            <Label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Formas de Pagamento Aceitas
            </Label>
            <div className="flex flex-wrap gap-2">
              {["PIX", "Cartão de Crédito", "Cartão de Débito", "Dinheiro"].map((method) => {
                const isSelected = paymentMethods.includes(method);
                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() => togglePaymentMethod(method)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                      isSelected
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {isSelected ? "✓ " : "+ "} {method}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload de Fotos do Portfólio */}
          <div>
            <Label className="text-xs font-semibold text-slate-700 block mb-1.5">
              📷 Fotos do Portfólio / Trabalhos (Até 5 fotos)
            </Label>

            <div className="grid grid-cols-5 gap-2 mb-2">
              {/* Fotos Existentes */}
              {existingImageUrls.map((url, idx) => (
                <div key={`exist-${idx}`} className="relative h-20 rounded-lg overflow-hidden border border-slate-200 group">
                  <img src={url} alt={`Existente ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs opacity-80 hover:opacity-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Novas Fotos selecionadas */}
              {previewUrls.map((url, idx) => (
                <div key={`new-${idx}`} className="relative h-20 rounded-lg overflow-hidden border border-emerald-300 group">
                  <img src={url} alt={`Nova ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs opacity-80 hover:opacity-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Botão Adicionar Foto */}
              {existingImageUrls.length + selectedFiles.length < 5 && (
                <label className="h-20 border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-lg flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-emerald-600 bg-slate-50 transition-colors">
                  <Camera className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-medium">+ Adicionar</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Aceite dos Termos de Responsabilidade */}
          <div className="flex items-start space-x-3 p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl">
            <Checkbox
              id="form-service-terms-check"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(!!checked)}
              className="mt-0.5 h-4 w-4 border-emerald-600 data-[state=checked]:bg-emerald-600 data-[state=checked]:text-white"
            />
            <label
              htmlFor="form-service-terms-check"
              className="text-xs font-semibold text-slate-800 cursor-pointer select-none leading-snug"
            >
              Declaro explicitamente que a atividade oferecida não fere o Regimento Interno e a Convenção do meu condomínio, isentando a plataforma de qualquer responsabilidade legal.
            </label>
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 rounded-xl shadow-lg shadow-emerald-600/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span>Publicando...</span>
                </>
              ) : (
                <span>Publicar Perfil Profissional</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
