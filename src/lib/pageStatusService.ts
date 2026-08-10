export interface PageConfig {
  id: string;
  name: string;
  path: string;
  description: string;
  category: 'Principal' | 'Gestão' | 'Morador' | 'Cadastros';
  enabled: boolean;
  isCore?: boolean;
}

const STORAGE_KEY = 'vizi_system_pages_status';
const CHANGE_EVENT = 'vizi-page-status-changed';

export const DEFAULT_PAGES: PageConfig[] = [
  {
    id: 'condo-market',
    name: 'viziGO (CondoMarket)',
    path: '/vizigo',
    description: 'Portal principal de compras, anúncios e mercado do condomínio.',
    category: 'Principal',
    enabled: true,
  },
  {
    id: 'localizacao',
    name: 'Localização & Mapa',
    path: '/localizacao',
    description: 'Mapa de localização e endereço do condomínio.',
    category: 'Principal',
    enabled: true,
  },
  {
    id: 'admin',
    name: 'Painel Gestão (Admin)',
    path: '/admin',
    description: 'Dashboard de gestão de moradores, recados e autorizações do síndico.',
    category: 'Gestão',
    enabled: true,
  },
  {
    id: 'avisos',
    name: 'Mural de Avisos & Comunicados',
    path: '/avisos',
    description: 'Comunicados oficiais, avisos urgentes e notícias da gestão.',
    category: 'Morador',
    enabled: false,
  },
  {
    id: 'apartamentos',
    name: 'Apartamentos & Unidades',
    path: '/apartamentos',
    description: 'Listagem e cadastro dos apartamentos e seus ocupantes.',
    category: 'Gestão',
    enabled: false,
  },
  {
    id: 'ficha-cadastral',
    name: 'Ficha Cadastral do Morador',
    path: '/ficha-cadastral',
    description: 'Formulário de recadastramento e registro de moradores.',
    category: 'Cadastros',
    enabled: false,
  },
  {
    id: 'ficha-fiador',
    name: 'Ficha do Fiador',
    path: '/ficha-fiador',
    description: 'Formulário de cadastro de garantia e informações de fiador.',
    category: 'Cadastros',
    enabled: false,
  },
  {
    id: 'garagem',
    name: 'Controle de Garagem & Vagas',
    path: '/garagem',
    description: 'Mapeamento das vagas de estacionamento e placas de veículos.',
    category: 'Gestão',
    enabled: false,
  },
  {
    id: 'galeria',
    name: 'Galeria de Fotos',
    path: '/galeria',
    description: 'Fotos das áreas comuns, eventos e benfeitorias.',
    category: 'Morador',
    enabled: false,
  },
  {
    id: 'solicitacoes',
    name: 'Solicitações & Ocorrências',
    path: '/solicitacoes',
    description: 'Abertura de chamados de manutenção e sugestões.',
    category: 'Morador',
    enabled: false,
  },
  {
    id: 'vistoria',
    name: 'Vistoria de Imóvel',
    path: '/vistoria',
    description: 'Laudo e conferência de estado do apartamento.',
    category: 'Gestão',
    enabled: false,
  },
  {
    id: 'regimento',
    name: 'Regimento Interno & Documentos',
    path: '/regimento',
    description: 'Regras de convivência, atas e convenção do condomínio.',
    category: 'Morador',
    enabled: false,
  },
  {
    id: 'outros-imoveis',
    name: 'Outros Imóveis',
    path: '/outros-imoveis',
    description: 'Listagem de unidades secundárias ou parceiras.',
    category: 'Principal',
    enabled: false,
  },
  {
    id: 'login',
    name: 'Login de Morador',
    path: '/login',
    description: 'Autenticação dos moradores no sistema.',
    category: 'Principal',
    enabled: true,
  },
  {
    id: 'super-admin',
    name: 'Super Admin Dashboard',
    path: '/super-admin',
    description: 'Painel principal Root de configurações e infraestrutura.',
    category: 'Gestão',
    enabled: true,
    isCore: true,
  },
  {
    id: 'adm-login',
    name: 'Login Super Admin',
    path: '/adm-login',
    description: 'Autenticação dos administradores de nível Root.',
    category: 'Gestão',
    enabled: true,
    isCore: true,
  },
];

/**
 * Carrega a lista completa de status das telas salvas no localStorage (ou padrão).
 */
export function getPageConfigs(): PageConfig[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_PAGES;
    }
    const parsed = JSON.parse(stored) as Record<string, boolean>;
    
    // Mescla o estado salvo com a lista completa padrão
    return DEFAULT_PAGES.map((page) => ({
      ...page,
      enabled: page.isCore ? true : (parsed[page.id] ?? page.enabled),
    }));
  } catch (err) {
    console.error('Erro ao ler status das telas:', err);
    return DEFAULT_PAGES;
  }
}

/**
 * Atualiza o status de habilitação (enabled) de uma tela específica.
 */
export function setPageEnabled(pageId: string, enabled: boolean): PageConfig[] {
  const configs = getPageConfigs();
  const target = configs.find((p) => p.id === pageId);
  
  if (!target || target.isCore) {
    return configs;
  }

  const updatedMap: Record<string, boolean> = {};
  configs.forEach((p) => {
    updatedMap[p.id] = p.id === pageId ? enabled : p.enabled;
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMap));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { pageId, enabled } }));
  } catch (err) {
    console.error('Erro ao salvar status das telas:', err);
  }

  return getPageConfigs();
}

/**
 * Ativa ou desativa todas as telas (exceto as telas Core).
 */
export function toggleAllPages(enable: boolean): PageConfig[] {
  const configs = getPageConfigs();
  const updatedMap: Record<string, boolean> = {};

  configs.forEach((p) => {
    updatedMap[p.id] = p.isCore ? true : enable;
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMap));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { enableAll: enable } }));
  } catch (err) {
    console.error('Erro ao alternar todas as telas:', err);
  }

  return getPageConfigs();
}

/**
 * Restaura o status padrão inicial de todas as telas.
 */
export function resetPagesToDefault(): PageConfig[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { reset: true } }));
  } catch (err) {
    console.error('Erro ao resetar telas:', err);
  }
  return DEFAULT_PAGES;
}

/**
 * Verifica se um determinado caminho/path está liberado no sistema.
 */
export function isPathEnabled(pathname: string): boolean {
  if (pathname === '/') {
    return true; // rota base redireciona para vizigo
  }

  const configs = getPageConfigs();
  // Busca exata ou por prefixo se houver sub-rotas
  const page = configs.find((p) => p.path === pathname || (p.path !== '/' && pathname.startsWith(p.path)));

  // Se a rota não estiver cadastrada explicitamente no serviço, trata como liberada
  if (!page) {
    return true;
  }

  return page.enabled;
}

/**
 * Retorna apenas as telas que estão atualmente liberadas/habilitadas.
 */
export function getEnabledPages(): PageConfig[] {
  return getPageConfigs().filter((p) => p.enabled);
}

/**
 * Inscreve um callback para ser notificado sempre que o status de qualquer tela mudar.
 */
export function subscribeToPageStatusChanges(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener(CHANGE_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}
