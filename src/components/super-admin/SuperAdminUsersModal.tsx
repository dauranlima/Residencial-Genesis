import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  ShieldAlert,
  ShieldCheck,
  Ban,
  CheckCircle2,
  Package,
  Trash2,
  X,
  Phone,
  Building,
  RefreshCw,
  ExternalLink,
  Edit2,
  Save,
  UserCheck,
  UserX,
  AlertCircle,
  Tag,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  fetchAllUsersForAdmin,
  toggleBlockUserInSupabase,
  fetchClassifiedsByUserPhone,
  deleteClassifiedInSupabase,
  updateUserProfileInSupabase,
} from '@/lib/condoMarketService';
import { AdminUser, ClassifiedItem } from '@/components/condo-market/types';
import { toast } from 'sonner';

interface SuperAdminUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuperAdminUsersModal({ isOpen, onClose }: SuperAdminUsersModalProps) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');

  // Estados para ação de Ver Anúncios
  const [selectedUserForClassifieds, setSelectedUserForClassifieds] = useState<AdminUser | null>(null);
  const [userClassifieds, setUserClassifieds] = useState<ClassifiedItem[]>([]);
  const [loadingClassifieds, setLoadingClassifieds] = useState(false);

  // Estados para ação de Editar Usuário
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editName, setEditName] = useState('');
  const [editBlock, setEditBlock] = useState('');
  const [editUnit, setEditUnit] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  // Carregar usuários
  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchAllUsersForAdmin();
      setUsers(data);
    } catch (e) {
      console.error('Erro ao carregar usuários:', e);
      toast.error('Erro ao carregar lista de moradores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  // Alternar Bloqueio/Desbloqueio
  const handleToggleBlock = async (user: AdminUser) => {
    const newStatus = !user.isBlocked;
    const actionLabel = newStatus ? 'bloquear' : 'desbloquear';

    if (!confirm(`Tem certeza que deseja ${actionLabel} o morador "${user.name}"?`)) {
      return;
    }

    try {
      await toggleBlockUserInSupabase(user.phone || user.id, newStatus);
      toast.success(
        newStatus
          ? `Morador "${user.name}" bloqueado com sucesso.`
          : `Morador "${user.name}" desbloqueado com sucesso.`
      );
      await loadUsers();
    } catch (err: any) {
      console.error('Erro ao alterar status de bloqueio:', err);
      toast.error(err?.message || 'Falha ao alterar status de bloqueio.');
    }
  };

  // Abrir anúncios do morador
  const handleViewClassifieds = async (user: AdminUser) => {
    setSelectedUserForClassifieds(user);
    setLoadingClassifieds(true);
    setUserClassifieds([]);
    try {
      const items = await fetchClassifiedsByUserPhone(user.phone);
      setUserClassifieds(items);
    } catch (e) {
      console.error('Erro ao buscar anúncios do usuário:', e);
      toast.error('Erro ao carregar anúncios deste morador.');
    } finally {
      setLoadingClassifieds(false);
    }
  };

  // Excluir um anúncio específico
  const handleDeleteClassified = async (classifiedId: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir o anúncio "${title}"?`)) return;

    try {
      await deleteClassifiedInSupabase(classifiedId);
      toast.success(`Anúncio "${title}" removido com sucesso.`);
      setUserClassifieds((prev) => prev.filter((item) => item.id !== classifiedId));
      await loadUsers();
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao excluir anúncio.');
    }
  };

  // Abrir modal de edição de morador
  const handleOpenEdit = (user: AdminUser) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditBlock(user.block || '');
    setEditUnit(user.unit);
    setEditPhone(user.phone);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    if (!editName.trim()) {
      toast.error('Informe o Nome do Morador.');
      return;
    }

    setSavingEdit(true);
    try {
      await updateUserProfileInSupabase(editingUser.id, {
        name: editName.trim(),
        block: editBlock.trim(),
        unit: editUnit.trim(),
        phone: editPhone.trim(),
      });
      toast.success(`Perfil de "${editName.trim()}" atualizado com sucesso!`);
      setEditingUser(null);
      await loadUsers();
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao salvar alterações do perfil.');
    } finally {
      setSavingEdit(false);
    }
  };

  // Filtros de busca
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm) ||
      (u.unit && u.unit.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.block && u.block.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'blocked' && u.isBlocked) ||
      (statusFilter === 'active' && !u.isBlocked);

    return matchesSearch && matchesStatus;
  });

  const totalUsersCount = users.length;
  const activeUsersCount = users.filter((u) => !u.isBlocked).length;
  const blockedUsersCount = users.filter((u) => u.isBlocked).length;
  const totalAnnouncements = users.reduce((acc, u) => acc + u.announcementsCount, 0);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl bg-slate-900 border-slate-800 text-slate-100 shadow-2xl rounded-2xl p-0 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header Dourado de Super Admin */}
        <DialogHeader className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 p-5 text-slate-950 shrink-0 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-950/20 rounded-xl text-slate-950">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1 bg-slate-950/20 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md mb-0.5">
                  <ShieldCheck className="h-3 w-3" /> Módulo Super Admin
                </div>
                <DialogTitle className="text-xl font-black text-slate-950">
                  Central de Gestão de Usuários & Moradores
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-950/80 font-medium">
                  Monitore moradores cadastrados, gerencie permissões e modere os anúncios em tempo real.
                </DialogDescription>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-950 hover:bg-slate-950/20 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Stats Strip */}
        <div className="bg-slate-950 border-b border-slate-800 p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Registrados</span>
            <span className="text-lg font-black text-slate-100">{totalUsersCount}</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] font-bold uppercase text-emerald-400 block">Moradores Ativos</span>
            <span className="text-lg font-black text-emerald-400">{activeUsersCount}</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] font-bold uppercase text-red-400 block">Moradores Bloqueados</span>
            <span className="text-lg font-black text-red-400">{blockedUsersCount}</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] font-bold uppercase text-amber-400 block">Total Anúncios Postados</span>
            <span className="text-lg font-black text-amber-400">{totalAnnouncements}</span>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Buscar por nome, fone, apto ou bloco..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-slate-950/70 border-slate-800 text-slate-100 placeholder:text-slate-500 text-xs h-9 focus:border-amber-500/50"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 text-xs rounded-md font-semibold transition-colors ${
                  statusFilter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Todos ({totalUsersCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('active')}
                className={`px-3 py-1 text-xs rounded-md font-semibold transition-colors ${
                  statusFilter === 'active' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Ativos ({activeUsersCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('blocked')}
                className={`px-3 py-1 text-xs rounded-md font-semibold transition-colors ${
                  statusFilter === 'blocked' ? 'bg-red-500 text-slate-100 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Bloqueados ({blockedUsersCount})
              </button>
            </div>

            <Button
              size="sm"
              onClick={loadUsers}
              className="bg-slate-950 border border-slate-800 text-slate-200 hover:bg-slate-800 text-xs h-9"
              title="Atualizar lista"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Users List Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Carregando moradores do banco de dados...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-12 text-center space-y-2 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
              <Users className="h-10 w-10 text-slate-600 mx-auto" />
              <h4 className="font-bold text-slate-300">Nenhum morador encontrado</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Tente ajustar seus termos de busca ou filtros de status para encontrar o registro desejado.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredUsers.map((user) => {
                const initials = user.name
                  ? user.name
                      .split(' ')
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                  : 'M';

                return (
                  <div
                    key={user.id}
                    className={`bg-slate-950/70 border rounded-2xl p-4 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      user.isBlocked
                        ? 'border-red-500/30 bg-red-950/10'
                        : 'border-slate-800 hover:border-amber-500/30'
                    }`}
                  >
                    {/* User info */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow-inner ${
                          user.isBlocked
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {initials}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-slate-100 truncate">{user.name}</h4>

                          {/* Status Badge */}
                          {user.isBlocked ? (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px] font-bold flex items-center gap-1">
                              <Ban className="w-3 h-3" /> Bloqueado
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Ativo
                            </Badge>
                          )}

                          {/* Announcements Count Badge */}
                          <Badge className="bg-amber-500/10 text-amber-300 border-amber-500/20 text-[10px] font-mono">
                            <Package className="w-3 h-3 mr-1" /> {user.announcementsCount}{' '}
                            {user.announcementsCount === 1 ? 'Anúncio' : 'Anúncios'}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                          {user.phone && (
                            <a
                              href={`https://wa.me/${user.phone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-emerald-400 hover:underline font-mono"
                              title="Abrir conversa no WhatsApp"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              {user.phone}
                              <ExternalLink className="w-3 h-3 text-slate-500" />
                            </a>
                          )}
                          <span className="flex items-center gap-1 text-slate-400">
                            <Building className="w-3.5 h-3.5 text-slate-500" />
                            Apto: <strong className="text-slate-200">{user.unit || 'S/N'}</strong>
                            {user.block && <span>(Bloco: {user.block})</span>}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-slate-800/80 pt-3 sm:pt-0 shrink-0">
                      {/* View Announcements */}
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleViewClassifieds(user)}
                        className="bg-slate-900 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 font-bold text-xs h-8 px-3 shadow-sm"
                        title="Ver todos os anúncios deste morador"
                      >
                        <Package className="w-3.5 h-3.5 mr-1 text-amber-400" />
                        <span>Anúncios ({user.announcementsCount})</span>
                      </Button>

                      {/* Edit Profile */}
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleOpenEdit(user)}
                        className="bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 text-xs h-8 px-2.5 shadow-sm"
                        title="Editar perfil do morador"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-slate-300" />
                      </Button>

                      {/* Block / Unblock Button */}
                      {user.isBlocked ? (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleToggleBlock(user)}
                          className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900 text-xs h-8 px-3 font-bold shadow-sm"
                        >
                          <UserCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                          Desbloquear
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleToggleBlock(user)}
                          className="bg-red-950/80 border border-red-500/40 text-red-300 hover:bg-red-900 text-xs h-8 px-3 font-bold shadow-sm"
                        >
                          <UserX className="w-3.5 h-3.5 mr-1 text-red-400" />
                          Bloquear
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>

      {/* MODAL SECUNDÁRIA: ANÚNCIOS DO MORADOR */}
      {selectedUserForClassifieds && (
        <Dialog open={!!selectedUserForClassifieds} onOpenChange={() => setSelectedUserForClassifieds(null)}>
          <DialogContent className="sm:max-w-2xl bg-slate-900 border-slate-800 text-slate-100 shadow-2xl rounded-2xl p-6">
            <DialogHeader className="border-b border-slate-800 pb-4">
              <DialogTitle className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-400" />
                Anúncios de "{selectedUserForClassifieds.name}"
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Apto: {selectedUserForClassifieds.unit} {selectedUserForClassifieds.block && `| Bloco: ${selectedUserForClassifieds.block}`} | WhatsApp: {selectedUserForClassifieds.phone}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 max-h-[60vh] overflow-y-auto space-y-3 custom-scrollbar">
              {loadingClassifieds ? (
                <div className="py-8 text-center">
                  <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Buscando anúncios no banco de dados...</p>
                </div>
              ) : userClassifieds.length === 0 ? (
                <div className="py-8 text-center space-y-2 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
                  <Tag className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400 font-medium">Este morador ainda não possui anúncios ativos.</p>
                </div>
              ) : (
                userClassifieds.map((item) => (
                  <div key={item.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {item.images && item.images.length > 0 ? (
                        <img src={item.images[0]} alt={item.title} className="w-12 h-12 rounded-lg object-cover border border-slate-800 shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                          <Package className="w-5 h-5 text-slate-600" />
                        </div>
                      )}
                      <div className="min-w-0 space-y-0.5">
                        <h5 className="font-bold text-sm text-slate-100 truncate">{item.title}</h5>
                        <p className="text-xs text-emerald-400 font-bold font-mono">
                          R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <span className="text-[10px] text-slate-500 block">
                          Categoria: {item.category} | Postado em: {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClassified(item.id, item.title)}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs h-8 px-3 shrink-0"
                      title="Excluir anúncio (Moderação Super Admin)"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Excluir
                    </Button>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* MODAL SECUNDÁRIA: EDITAR MORADOR */}
      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-slate-100 shadow-2xl rounded-2xl p-6">
            <DialogHeader className="border-b border-slate-800 pb-3">
              <DialogTitle className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-400" /> Editar Dados do Morador
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSaveEdit} className="space-y-4 pt-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Nome do Morador</label>
                <Input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-slate-100 text-xs h-9"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Apartamento/Unidade</label>
                  <Input
                    type="text"
                    value={editUnit}
                    onChange={(e) => setEditUnit(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-slate-100 text-xs h-9"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Bloco</label>
                  <Input
                    type="text"
                    value={editBlock}
                    onChange={(e) => setEditBlock(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-slate-100 text-xs h-9"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Celular / WhatsApp</label>
                <Input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-slate-100 text-xs h-9 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingUser(null)}
                  className="border-slate-800 text-slate-300 text-xs h-9"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={savingEdit}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs h-9 px-4"
                >
                  {savingEdit ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}
