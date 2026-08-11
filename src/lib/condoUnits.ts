import { supabase } from './supabase';

/**
 * Interface e tipos de Torres, Unidades e Moradores do condomínio.
 */
export interface CondoResident {
  id: string;
  name: string;
  phone: string;
  block: string;
  unit: string;
  createdAt: string;
}

// 1. Valores Padrão de Inicialização (Linhas 9 e 10 de MoradorAuthModal.tsx)
export const DEFAULT_VALID_APTS = [
  "511","512","513","514","521","522","523","524","531","532","533","534","541","542","543","544",
  "411","412","413","414","421","422","423","424","431","432","433","434","441","442","443","444"
];

export const DEFAULT_VALID_TOWERS = ["Torre A", "Torre B", "Torre C", "Torre D", "4", "5"];

export const VALID_APTS = DEFAULT_VALID_APTS;

// Cache em memória para acesso síncrono rápido
let cachedTowersMemory: string[] = [];
let cachedAptsMemory: string[] = [];

// 2. FUNÇÕES DE SUPABASE (Leitura e Persistência remota)

export async function fetchTowersFromSupabase(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('condo_towers')
      .select('name')
      .order('name', { ascending: true });

    if (error) {
      console.warn('Tabela condo_towers no Supabase não encontrada ou indisponível:', error.message);
      return getCustomTowers();
    }

    if (data && data.length > 0) {
      const towers = data.map((t: any) => t.name);
      saveCustomTowers(towers);
      cachedTowersMemory = towers;
      return towers;
    }
  } catch (err) {
    console.error('Erro ao buscar torres no Supabase:', err);
  }
  return getCustomTowers();
}

export async function fetchUnitsFromSupabase(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('condo_units')
      .select('unit_number')
      .order('unit_number', { ascending: true });

    if (error) {
      console.warn('Tabela condo_units no Supabase não encontrada ou indisponível:', error.message);
      return getCustomApts();
    }

    if (data && data.length > 0) {
      const apts = data.map((u: any) => u.unit_number);
      saveCustomApts(apts);
      cachedAptsMemory = apts;
      return apts;
    }
  } catch (err) {
    console.error('Erro ao buscar unidades no Supabase:', err);
  }
  return getCustomApts();
}

export async function saveTowerToSupabase(towerName: string): Promise<void> {
  try {
    await supabase.from('condo_towers').upsert([{ name: towerName.trim() }], { onConflict: 'name' });
  } catch (err) {
    console.warn('Não foi possível salvar a torre no Supabase (usando apenas local):', err);
  }
}

export async function deleteTowerFromSupabase(towerName: string): Promise<void> {
  try {
    await supabase.from('condo_towers').delete().eq('name', towerName.trim());
  } catch (err) {
    console.warn('Não foi possível deletar a torre do Supabase:', err);
  }
}

export async function saveUnitToSupabase(unitNumber: string): Promise<void> {
  try {
    await supabase.from('condo_units').upsert([{ unit_number: unitNumber.trim() }], { onConflict: 'unit_number' });
  } catch (err) {
    console.warn('Não foi possível salvar a unidade no Supabase (usando apenas local):', err);
  }
}

export async function deleteUnitFromSupabase(unitNumber: string): Promise<void> {
  try {
    await supabase.from('condo_units').delete().eq('unit_number', unitNumber.trim());
  } catch (err) {
    console.warn('Não foi possível deletar a unidade do Supabase:', err);
  }
}

// 3. FUNÇÕES LOCALSTORAGE / CACHE SÍNCRONO

export function getCustomTowers(): string[] {
  if (cachedTowersMemory.length > 0) return cachedTowersMemory;
  try {
    const saved = localStorage.getItem("vizi_custom_towers");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedTowersMemory = parsed;
        return parsed;
      }
    }
  } catch (e) {}
  cachedTowersMemory = [...DEFAULT_VALID_TOWERS];
  return cachedTowersMemory;
}

export function saveCustomTowers(towers: string[]): void {
  cachedTowersMemory = towers;
  localStorage.setItem("vizi_custom_towers", JSON.stringify(towers));
}

export function addCustomTower(towerName: string): string[] {
  const current = getCustomTowers();
  const trimmed = towerName.trim();
  if (!trimmed) return current;
  if (!current.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
    const updated = [...current, trimmed];
    saveCustomTowers(updated);
    saveTowerToSupabase(trimmed);
    return updated;
  }
  return current;
}

export function removeCustomTower(towerName: string): string[] {
  const current = getCustomTowers();
  const updated = current.filter((t) => t.toLowerCase() !== towerName.trim().toLowerCase());
  saveCustomTowers(updated);
  deleteTowerFromSupabase(towerName);
  return updated;
}

export function getCustomApts(): string[] {
  if (cachedAptsMemory.length > 0) return cachedAptsMemory;
  try {
    const saved = localStorage.getItem("vizi_custom_apts");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedAptsMemory = parsed;
        return parsed;
      }
    }
  } catch (e) {}
  cachedAptsMemory = [...DEFAULT_VALID_APTS];
  return cachedAptsMemory;
}

export function saveCustomApts(apts: string[]): void {
  cachedAptsMemory = apts;
  localStorage.setItem("vizi_custom_apts", JSON.stringify(apts));
}

export function addCustomApt(aptNumber: string): string[] {
  const current = getCustomApts();
  const trimmed = aptNumber.trim();
  if (!trimmed) return current;
  if (!current.includes(trimmed)) {
    const updated = [...current, trimmed].sort();
    saveCustomApts(updated);
    saveUnitToSupabase(trimmed);
    return updated;
  }
  return current;
}

export function removeCustomApt(aptNumber: string): string[] {
  const current = getCustomApts();
  const updated = current.filter((a) => a !== aptNumber.trim());
  saveCustomApts(updated);
  deleteUnitFromSupabase(aptNumber);
  return updated;
}

// 4. FUNÇÕES DE MORADORES
export function getRegisteredResidents(): CondoResident[] {
  try {
    const saved = localStorage.getItem("vizi_custom_residents");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
}

export function saveRegisteredResidents(residents: CondoResident[]): void {
  localStorage.setItem("vizi_custom_residents", JSON.stringify(residents));
}

export function addRegisteredResident(name: string, block: string, unit: string, phone: string): CondoResident[] {
  const current = getRegisteredResidents();
  const newRes: CondoResident = {
    id: Date.now().toString(),
    name: name.trim(),
    block: block.trim(),
    unit: unit.trim(),
    phone: phone.trim(),
    createdAt: new Date().toISOString(),
  };
  const updated = [newRes, ...current];
  saveRegisteredResidents(updated);
  return updated;
}

export function removeRegisteredResident(id: string): CondoResident[] {
  const current = getRegisteredResidents();
  const updated = current.filter((r) => r.id !== id);
  saveRegisteredResidents(updated);
  return updated;
}

export function resetUnitsToDefault(): { towers: string[]; apts: string[] } {
  saveCustomTowers(DEFAULT_VALID_TOWERS);
  saveCustomApts(DEFAULT_VALID_APTS);
  return { towers: [...DEFAULT_VALID_TOWERS], apts: [...DEFAULT_VALID_APTS] };
}

// 5. FUNÇÕES DE CHECAGEM E VALIDAÇÃO DA UNIDADE

export function isValidApt(unit: string): boolean {
  if (!unit) return false;
  const cleanUnit = unit.replace(/\D/g, "").trim();
  const apts = getCustomApts();
  return apts.includes(cleanUnit) || apts.includes(unit.trim());
}

export function isValidTower(block: string): boolean {
  if (!block || !block.trim()) return true;
  const normalized = block.trim().toLowerCase();
  const towers = getCustomTowers();
  const validPrefixes = towers.map((t) => t.toLowerCase());
  return (
    validPrefixes.includes(normalized) ||
    validPrefixes.some((t) => t.includes(normalized) || normalized.includes(t)) ||
    ["a", "b", "c", "d", "torre a", "torre b", "bloco a", "bloco b", "1", "2", "3", "4", "5"].includes(normalized)
  );
}

/**
 * Validação Inteligente da Unidade:
 * Suporta tanto o número completo do Apto (ex: "544") quanto o Bloco separado (ex: Bloco "5" + Apto "44" = "544").
 */
export function isValidCondoUnit(block: string, unit: string): { valid: boolean; errorReason?: string } {
  const rawUnit = (unit || "").trim();
  const rawBlock = (block || "").trim();

  if (!rawUnit) {
    return {
      valid: false,
      errorReason: "Apartamento ou Torre não cadastrado no sistema.",
    };
  }

  const cleanUnitDigits = rawUnit.replace(/\D/g, "");
  const cleanBlockDigits = rawBlock.replace(/\D/g, "");

  // 1. Caso o usuário tenha digitado o Apto completo (ex: 544)
  if (isValidApt(rawUnit) || isValidApt(cleanUnitDigits)) {
    return { valid: true };
  }

  // 2. Caso o usuário tenha digitado Bloco "5" e Apto "44" -> União resulta em "544"
  if (cleanBlockDigits && cleanUnitDigits) {
    const combined = `${cleanBlockDigits}${cleanUnitDigits}`;
    if (isValidApt(combined)) {
      return { valid: true };
    }
  }

  // 3. Caso o bloco seja texto (ex: Torre A) e o apto seja 44 ou 544
  if (rawBlock && isValidTower(rawBlock)) {
    if (isValidApt(rawUnit) || isValidApt(cleanUnitDigits)) {
      return { valid: true };
    }
  }

  // Se nenhuma combinação de Bloco + Apto for válida, dispara a mensagem de bloqueio
  return {
    valid: false,
    errorReason: "Apartamento ou Torre não cadastrado no sistema.",
  };
}
