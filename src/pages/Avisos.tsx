import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StickyNote, Plus, Trash2, Pin, ShieldAlert, AlertTriangle, Info, Sparkles, User, Calendar, Edit3, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: "urgente" | "manutencao" | "informativo" | "evento";
  author: string;
  date: string;
  isPinned: boolean;
  color: string; // Tailwind bg color class or color theme
  rotation: number; // Subtle tilt for sticky note effect
}

const STORAGE_KEY = "condo_avisos_importantes_v1";

const COLOR_SCHEMES = [
  { name: "Amarelo Canário", bg: "bg-amber-100 dark:bg-amber-950/40", border: "border-amber-300 dark:border-amber-800", text: "text-amber-950 dark:text-amber-100", pin: "text-amber-600" },
  { name: "Azul Bebê", bg: "bg-sky-100 dark:bg-sky-950/40", border: "border-sky-300 dark:border-sky-800", text: "text-sky-950 dark:text-sky-100", pin: "text-sky-600" },
  { name: "Verde Menta", bg: "bg-emerald-100 dark:bg-emerald-950/40", border: "border-emerald-300 dark:border-emerald-800", text: "text-emerald-950 dark:text-emerald-100", pin: "text-emerald-600" },
  { name: "Rosa Pastel", bg: "bg-rose-100 dark:bg-rose-950/40", border: "border-rose-300 dark:border-rose-800", text: "text-rose-950 dark:text-rose-100", pin: "text-rose-600" },
  { name: "Roxo Lavanda", bg: "bg-purple-100 dark:bg-purple-950/40", border: "border-purple-300 dark:border-purple-800", text: "text-purple-950 dark:text-purple-100", pin: "text-purple-600" },
];

const INITIAL_NOTICES: Notice[] = [
  {
    id: "1",
    title: "Manutenção Preventiva dos Elevadores",
    content: "No dia 15/08, das 08h às 12h, os elevadores da Torre A passarão por manutenção preventiva periódica. Por favor, utilizem as escadas ou o elevador de serviço.",
    category: "manutencao",
    author: "Administração (Síndico)",
    date: "04/08/2026",
    isPinned: true,
    color: "bg-amber-100 dark:bg-amber-950/40",
    rotation: -1.5,
  },
  {
    id: "2",
    title: "Assembleia Geral Extraordinária",
    content: "Convocamos todos os condôminos para a AGE que ocorrerá no Salão de Festas dia 20/08 às 19:30. Pauta principal: Aprovação das melhorias de segurança.",
    category: "urgente",
    author: "Conselho Consultivo",
    date: "03/08/2026",
    isPinned: true,
    color: "bg-rose-100 dark:bg-rose-950/40",
    rotation: 2,
  },
  {
    id: "3",
    title: "Limpeza de Caixas d'Água",
    content: "A limpeza semestral dos reservatórios está agendada para 25/08. Haverá interrupção temporária no fornecimento entre 13h e 17h. Programem-se!",
    category: "manutencao",
    author: "Gerência Predial",
    date: "01/08/2026",
    isPinned: false,
    color: "bg-sky-100 dark:bg-sky-950/40",
    rotation: -2,
  },
  {
    id: "4",
    title: "Novo Horário da Coleta Seletiva",
    content: "Lembramos que o lixo reciclável agora é recolhido às terças e quintas a partir das 07:00 da manhã. Deixem os materiais devidamente ensacados.",
    category: "informativo",
    author: "Zeladoria",
    date: "28/07/2026",
    isPinned: false,
    color: "bg-emerald-100 dark:bg-emerald-950/40",
    rotation: 1,
  },
];

export default function Avisos() {
  const { toast } = useToast();
  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_NOTICES;
      }
    }
    return INITIAL_NOTICES;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [filter, setFilter] = useState<string>("todos");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // PIN Authentication State
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinDigits, setPinDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [pinError, setPinError] = useState(false);
  const CORRECT_PIN = "85810220";

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notices));
  }, [notices]);

  const handleAdminToggleClick = () => {
    if (isAdmin) {
      setIsAdmin(false);
      toast({
        title: "Modo Adm Desativado",
        description: "Você voltou ao modo visualização de condômino.",
      });
    } else {
      setPinDigits(["", "", "", "", "", "", "", ""]);
      setPinError(false);
      setIsPinModalOpen(true);
    }
  };

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) {
      // If user pastes multiple digits
      const digits = value.replace(/\D/g, "").slice(0, 8).split("");
      const newPin = [...pinDigits];
      digits.forEach((d, i) => {
        if (index + i < 8) newPin[index + i] = d;
      });
      setPinDigits(newPin);
      const nextInput = document.getElementById(`pin-input-${Math.min(index + digits.length, 7)}`);
      if (nextInput) nextInput.focus();
      return;
    }

    const digit = value.replace(/\D/g, "");
    const newPin = [...pinDigits];
    newPin[index] = digit;
    setPinDigits(newPin);
    setPinError(false);

    if (digit && index < 7) {
      const nextInput = document.getElementById(`pin-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pinDigits[index] && index > 0) {
      const prevInput = document.getElementById(`pin-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyPin = () => {
    const enteredPin = pinDigits.join("");
    if (enteredPin === CORRECT_PIN) {
      setIsAdmin(true);
      setIsPinModalOpen(false);
      toast({
        title: "Acesso Concedido!",
        description: "Modo Administrador ativado com sucesso.",
      });
    } else {
      setPinError(true);
      toast({
        title: "PIN Incorreto",
        description: "O código digitado é inválido. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Notice["category"]>("informativo");
  const [author, setAuthor] = useState("Administração");
  const [selectedColor, setSelectedColor] = useState(COLOR_SCHEMES[0].bg);
  const [isPinned, setIsPinned] = useState(false);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setCategory("informativo");
    setAuthor("Administração");
    setSelectedColor(COLOR_SCHEMES[Math.floor(Math.random() * COLOR_SCHEMES.length)].bg);
    setIsPinned(false);
    setIsDialogOpen(true);
  };

  const handleOpenEditModal = (notice: Notice) => {
    setEditingId(notice.id);
    setTitle(notice.title);
    setContent(notice.content);
    setCategory(notice.category);
    setAuthor(notice.author);
    setSelectedColor(notice.color);
    setIsPinned(notice.isPinned);
    setIsDialogOpen(true);
  };

  const handleSaveNotice = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o título e o conteúdo do aviso.",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      // Edit existing
      setNotices((prev) =>
        prev.map((n) =>
          n.id === editingId
            ? {
                ...n,
                title,
                content,
                category,
                author,
                color: selectedColor,
                isPinned,
              }
            : n
        )
      );
      toast({
        title: "Aviso Atualizado",
        description: "O post-it foi modificado com sucesso.",
      });
    } else {
      // Create new
      const newNotice: Notice = {
        id: Date.now().toString(),
        title,
        content,
        category,
        author: author || "Administração",
        date: new Date().toLocaleDateString("pt-BR"),
        isPinned,
        color: selectedColor,
        rotation: (Math.random() - 0.5) * 5, // Random angle between -2.5deg and +2.5deg
      };
      setNotices((prev) => [newNotice, ...prev]);
      toast({
        title: "Aviso Criado",
        description: "Novo post-it fixado no mural com sucesso!",
      });
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
    toast({
      title: "Aviso Removido",
      description: "O aviso foi retirado do mural.",
    });
  };

  const togglePin = (id: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  const filteredNotices = notices.filter((n) => {
    if (filter === "todos") return true;
    if (filter === "fixados") return n.isPinned;
    return n.category === filter;
  });

  // Sort pinned first
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const getCategoryBadge = (cat: Notice["category"]) => {
    switch (cat) {
      case "urgente":
        return <Badge variant="destructive" className="gap-1 text-[11px]"><ShieldAlert className="w-3 h-3" /> Urgente</Badge>;
      case "manutencao":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 gap-1 text-[11px]"><AlertTriangle className="w-3 h-3" /> Manutenção</Badge>;
      case "evento":
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/30 gap-1 text-[11px]"><Sparkles className="w-3 h-3" /> Evento</Badge>;
      default:
        return <Badge variant="secondary" className="gap-1 text-[11px]"><Info className="w-3 h-3" /> Informativo</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy via-navy-light to-primary p-8 text-white shadow-xl">
          <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-semibold uppercase tracking-wider">
                <StickyNote className="w-4 h-4" /> Mural Interativo de Avisos
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Avisos <span className="text-gradient-gold">Importantes</span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Fique por dentro das últimas notícias, manutenções, comunicados e eventos do Residencial Morada do Sol II.
              </p>
            </div>

            {/* Admin Toggle & Add Action */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant={isAdmin ? "accent" : "outline"}
                size="sm"
                onClick={handleAdminToggleClick}
                className={!isAdmin ? "bg-gray-700 text-white border-white/20 hover:bg-white/10" : ""}
              >
                <User className="w-4 h-4 mr-2" />
                {isAdmin ? "Modo Adm (Ativo)" : "Alternar Modo Adm"}
              </Button>

              {isAdmin && (
                <Button
                  onClick={handleOpenCreateModal}
                  className="bg-gold hover:bg-gold-dark text-navy font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <Plus className="w-5 h-5 mr-1" /> Criar Aviso
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "todos", label: "Todos os Avisos" },
              { id: "fixados", label: "📌 Fixados" },
              { id: "urgente", label: "🚨 Urgentes" },
              { id: "manutencao", label: "🛠️ Manutenção" },
              { id: "informativo", label: "📢 Informativos" },
              { id: "evento", label: "🎉 Eventos" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  filter === f.id
                    ? "bg-primary text-primary-foreground shadow-sm scale-105"
                    : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-muted-foreground font-medium">
            Exibindo <strong>{sortedNotices.length}</strong> aviso(s)
          </span>
        </div>

        {/* Sticky Notes Grid */}
        {sortedNotices.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border border-dashed border-border p-8">
            <StickyNote className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h3 className="text-lg font-semibold text-foreground">Nenhum aviso encontrado</h3>
            <p className="text-sm text-muted-foreground mt-1">Não há notas para o filtro selecionado momento.</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4"
          >
            <AnimatePresence>
              {sortedNotices.map((notice) => {
                const colorObj = COLOR_SCHEMES.find((c) => c.bg === notice.color) || COLOR_SCHEMES[0];
                return (
                  <motion.div
                    key={notice.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0, rotate: notice.rotation }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    whileHover={{ scale: 1.03, rotate: 0, zIndex: 10 }}
                    transition={{ duration: 0.25 }}
                    className={`relative p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border ${colorObj.bg} ${colorObj.border} flex flex-col justify-between min-h-[280px] group`}
                  >
                    {/* Push Pin Visual Element */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                      <div className="relative">
                        <Pin
                          className={`w-6 h-6 drop-shadow-md transition-transform ${
                            notice.isPinned ? "text-red-500 fill-red-500 scale-110" : `${colorObj.pin} opacity-60`
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      {/* Top Bar inside Card */}
                      <div className="flex items-start justify-between gap-2 mb-3 mt-1">
                        {getCategoryBadge(notice.category)}
                        
                        {/* Admin Action Buttons */}
                        {isAdmin && (
                          <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity bg-white/70 dark:bg-black/30 backdrop-blur-xs p-1 rounded-lg border border-black/5">
                            <button
                              onClick={() => togglePin(notice.id)}
                              title={notice.isPinned ? "Desafixar aviso" : "Fixar aviso no topo"}
                              className={`p-1 rounded hover:bg-black/10 transition-colors ${
                                notice.isPinned ? "text-red-600" : "text-slate-600"
                              }`}
                            >
                              <Pin className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEditModal(notice)}
                              title="Editar aviso"
                              className="p-1 rounded text-slate-700 hover:bg-black/10 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(notice.id)}
                              title="Excluir aviso"
                              className="p-1 rounded text-red-600 hover:bg-black/10 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Card Header & Title */}
                      <h2 className={`font-bold text-lg leading-snug mb-3 ${colorObj.text}`}>
                        {notice.title}
                      </h2>

                      {/* Note Content */}
                      <p className={`text-sm leading-relaxed whitespace-pre-line opacity-90 font-sans ${colorObj.text}`}>
                        {notice.content}
                      </p>
                    </div>

                    {/* Card Footer Info */}
                    <div className="mt-6 pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] opacity-75 font-medium">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> {notice.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {notice.date}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

      </div>

      {/* Admin Notice Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <StickyNote className="w-5 h-5 text-gold" />
              {editingId ? "Editar Aviso Importante" : "Criar Novo Aviso (Sticky Note)"}
            </DialogTitle>
            <DialogDescription>
              Preencha os detalhes abaixo para publicar um novo recado aos condôminos no mural.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Título do Aviso</label>
              <Input
                placeholder="Ex: Manutenção da Piscina"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Notice["category"])}
                  className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background focus:ring-2 focus:ring-ring"
                >
                  <option value="informativo">📢 Informativo</option>
                  <option value="manutencao">🛠️ Manutenção</option>
                  <option value="urgente">🚨 Urgente</option>
                  <option value="evento">🎉 Evento</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Autor / Responsável</label>
                <Input
                  placeholder="Ex: Síndico / Portaria"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Conteúdo da Mensagem</label>
              <Textarea
                rows={4}
                placeholder="Escreva detalhadamente a mensagem para os moradores..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            {/* Color Scheme Picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cor do Post-it</label>
              <div className="flex items-center gap-3">
                {COLOR_SCHEMES.map((scheme) => (
                  <button
                    key={scheme.bg}
                    type="button"
                    onClick={() => setSelectedColor(scheme.bg)}
                    className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${scheme.bg} ${
                      selectedColor === scheme.bg ? "border-primary scale-110 shadow" : "border-transparent opacity-80 hover:opacity-100"
                    }`}
                  >
                    {selectedColor === scheme.bg && <Check className="w-4 h-4 text-slate-800" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Pin Option */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="pin-check"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="w-4 h-4 rounded text-primary border-input focus:ring-primary"
              />
              <label htmlFor="pin-check" className="text-sm font-medium cursor-pointer flex items-center gap-1.5">
                <Pin className="w-4 h-4 text-red-500" /> Fixar este aviso no topo do mural
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveNotice} className="bg-primary text-primary-foreground">
              {editingId ? "Salvar Alterações" : "Publicar Aviso"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PIN Verification Modal */}
      <Dialog open={isPinModalOpen} onOpenChange={setIsPinModalOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border/80 shadow-2xl rounded-2xl p-6">
          <DialogHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center text-gold mb-1">
              <User className="w-6 h-6" />
            </div>
            <DialogTitle className="text-xl font-bold text-foreground">
              Autenticação de Administrador
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Digite o PIN de 8 dígitos para ativar o modo de gestão de avisos.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-4">
            {/* PIN Inputs with hyphens: 858 - 102 - 20 */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2">
              {/* Group 1: 3 digits */}
              <div className="flex items-center gap-1 sm:gap-1.5">
                {[0, 1, 2].map((idx) => (
                  <input
                    key={idx}
                    id={`pin-input-${idx}`}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={pinDigits[idx]}
                    onChange={(e) => handlePinChange(idx, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(idx, e)}
                    className={`w-9 h-11 sm:w-10 sm:h-12 text-center text-lg font-bold rounded-lg border-2 bg-background focus:outline-none transition-all shadow-xs ${
                      pinError
                        ? "border-red-500 text-red-600 focus:ring-2 focus:ring-red-400"
                        : "border-input focus:border-gold focus:ring-2 focus:ring-gold/30 text-foreground"
                    }`}
                  />
                ))}
              </div>

              <span className="text-lg font-bold text-muted-foreground/60 select-none">-</span>

              {/* Group 2: 3 digits */}
              <div className="flex items-center gap-1 sm:gap-1.5">
                {[3, 4, 5].map((idx) => (
                  <input
                    key={idx}
                    id={`pin-input-${idx}`}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={pinDigits[idx]}
                    onChange={(e) => handlePinChange(idx, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(idx, e)}
                    className={`w-9 h-11 sm:w-10 sm:h-12 text-center text-lg font-bold rounded-lg border-2 bg-background focus:outline-none transition-all shadow-xs ${
                      pinError
                        ? "border-red-500 text-red-600 focus:ring-2 focus:ring-red-400"
                        : "border-input focus:border-gold focus:ring-2 focus:ring-gold/30 text-foreground"
                    }`}
                  />
                ))}
              </div>

              <span className="text-lg font-bold text-muted-foreground/60 select-none">-</span>

              {/* Group 3: 2 digits */}
              <div className="flex items-center gap-1 sm:gap-1.5">
                {[6, 7].map((idx) => (
                  <input
                    key={idx}
                    id={`pin-input-${idx}`}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={pinDigits[idx]}
                    onChange={(e) => handlePinChange(idx, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(idx, e)}
                    className={`w-9 h-11 sm:w-10 sm:h-12 text-center text-lg font-bold rounded-lg border-2 bg-background focus:outline-none transition-all shadow-xs ${
                      pinError
                        ? "border-red-500 text-red-600 focus:ring-2 focus:ring-red-400"
                        : "border-input focus:border-gold focus:ring-2 focus:ring-gold/30 text-foreground"
                    }`}
                  />
                ))}
              </div>
            </div>

            {pinError && (
              <p className="text-xs text-red-500 text-center font-medium animate-shake">
                ⚠️ Código incorreto. Verifique o PIN e tente novamente.
              </p>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsPinModalOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleVerifyPin}
              className="w-full sm:w-auto bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
            >
              Confirmar PIN
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
