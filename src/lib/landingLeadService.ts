import { supabase } from './supabase';

export interface LandingLead {
  id: string;
  name: string;
  condo_name: string;
  email: string;
  phone: string;
  units_count?: string;
  plan_selected: string;
  status: 'novo' | 'em_contato' | 'aprovado' | 'arquivado';
  created_at: string;
}

const LOCAL_STORAGE_KEY = 'vizi_landing_leads';

export const getLandingLeads = async (): Promise<LandingLead[]> => {
  try {
    // Tenta buscar do Supabase primeiro
    const { data, error } = await supabase
      .from('landing_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data as LandingLead[];
    }
  } catch (err) {
    console.warn('Tabela landing_leads não encontrada no Supabase, usando armazenamento local fallback:', err);
  }

  // Fallback LocalStorage
  const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!localData) return getDefaultLeads();
  try {
    return JSON.parse(localData) as LandingLead[];
  } catch {
    return getDefaultLeads();
  }
};

export const saveLandingLead = async (
  leadData: Omit<LandingLead, 'id' | 'created_at' | 'status'>
): Promise<LandingLead> => {
  const newLead: LandingLead = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    ...leadData,
    status: 'novo',
    created_at: new Date().toISOString(),
  };

  try {
    // Tenta salvar no Supabase
    const { data, error } = await supabase
      .from('landing_leads')
      .insert([newLead])
      .select()
      .single();

    if (!error && data) {
      updateLocalStorageWithLead(data as LandingLead);
      return data as LandingLead;
    }
  } catch (err) {
    console.warn('Erro ao salvar no Supabase, salvando em localStorage:', err);
  }

  // Fallback LocalStorage
  updateLocalStorageWithLead(newLead);
  return newLead;
};

export const updateLeadStatus = async (
  id: string,
  newStatus: LandingLead['status']
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('landing_leads')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      updateLocalLeadStatus(id, newStatus);
      return true;
    }
  } catch (err) {
    console.warn('Erro ao atualizar status no Supabase, atualizando localmente:', err);
  }

  updateLocalLeadStatus(id, newStatus);
  return true;
};

export const deleteLead = async (id: string): Promise<boolean> => {
  try {
    await supabase.from('landing_leads').delete().eq('id', id);
  } catch {
    // Ignora erro
  }

  const existing = await getLandingLeads();
  const filtered = existing.filter((l) => l.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

// Auxiliares internos
function updateLocalStorageWithLead(lead: LandingLead) {
  const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
  const existing: LandingLead[] = localData ? JSON.parse(localData) : getDefaultLeads();
  const updated = [lead, ...existing];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
}

function updateLocalLeadStatus(id: string, status: LandingLead['status']) {
  const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!localData) return;
  try {
    const existing: LandingLead[] = JSON.parse(localData);
    const updated = existing.map((l) => (l.id === id ? { ...l, status } : l));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

function getDefaultLeads(): LandingLead[] {
  return [
    {
      id: 'demo_1',
      name: 'Carlos Eduardo Santos',
      condo_name: 'Condomínio Residencial Bella Vista',
      email: 'carlos.santos@bellavista.com.br',
      phone: '11988776655',
      units_count: '64',
      plan_selected: 'Profissional',
      status: 'novo',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: 'demo_2',
      name: 'Mariana Oliveira',
      condo_name: 'Edifício Horizon Blue',
      email: 'mariana@horizonblue.com',
      phone: '21971234567',
      units_count: '28',
      plan_selected: 'Essencial',
      status: 'em_contato',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
  ];
}
