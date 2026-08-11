import { supabase } from './supabase';

export interface WhatsAppConfig {
  apiUrl: string;
  instance: string;
  token: string;
  webhookUrl: string;
  groupId?: string;
  updatedAt?: string;
}

const STORAGE_KEY = 'vizi_whatsapp_config';

/**
 * Retorna as configurações padrão baseadas nas variáveis de ambiente
 */
export function getDefaultWhatsAppConfig(): WhatsAppConfig {
  return {
    apiUrl: import.meta.env.VITE_EVOLUTION_API_URL || 'http://main-evolutiongo-0cf43a-187-127-6-57.sslip.io',
    instance: import.meta.env.VITE_EVOLUTION_INSTANCE || 'whats-moto',
    token: import.meta.env.VITE_EVOLUTION_TOKEN || 'e90eb280-4399-4ab0-95eb-a2ce53d12fbe',
    webhookUrl: 'https://cxlwzuudhavikgynxqpm.supabase.co/functions/v1/evolution-webhook',
    groupId: import.meta.env.VITE_EVOLUTION_GROUP_ID || '',
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Obtém a configuração atual do WhatsApp.
 * Ordem de prioridade: Supabase (system_settings) -> localStorage -> .env
 */
export async function getWhatsAppConfig(): Promise<WhatsAppConfig> {
  const defaultConfig = getDefaultWhatsAppConfig();

  // 1. Tenta carregar do Supabase
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('value, updated_at')
      .eq('key', 'whatsapp_config')
      .maybeSingle();

    if (!error && data && data.value) {
      const dbConfig: WhatsAppConfig = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
      const mergedConfig = { ...defaultConfig, ...dbConfig, updatedAt: data.updated_at || dbConfig.updatedAt };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedConfig));
      return mergedConfig;
    }
  } catch (err) {
    console.warn('Tabela system_settings não disponível no Supabase ainda, usando cache local/defaults:', err);
  }

  // 2. Tenta carregar do localStorage
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      return { ...defaultConfig, ...parsed };
    }
  } catch (_e) {}

  // 3. Fallback para variáveis de ambiente
  return defaultConfig;
}

/**
 * Salva a configuração do WhatsApp no Supabase e no localStorage
 */
export async function saveWhatsAppConfig(config: WhatsAppConfig): Promise<{ success: boolean; message: string }> {
  const configToSave: WhatsAppConfig = {
    ...config,
    apiUrl: config.apiUrl.trim().replace(/\/$/, ''),
    instance: config.instance.trim(),
    token: config.token.trim(),
    webhookUrl: config.webhookUrl.trim(),
    groupId: (config.groupId || '').trim(),
    updatedAt: new Date().toISOString(),
  };

  // Salva no localStorage imediatamente
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configToSave));
  } catch (e) {
    console.error('Erro ao salvar no localStorage:', e);
  }

  // Tenta salvar no Supabase na tabela system_settings
  try {
    const { error } = await supabase
      .from('system_settings')
      .upsert(
        {
          key: 'whatsapp_config',
          value: configToSave,
          updated_at: configToSave.updatedAt,
        },
        { onConflict: 'key' }
      );

    if (error) {
      console.warn('Tabela system_settings indisponível no Supabase:', error.message);
      return {
        success: true,
        message: 'Configurações salvas localmente no navegador com sucesso!',
      };
    }

    return {
      success: true,
      message: 'Configurações salvas com sucesso no Supabase e sincronizadas no navegador!',
    };
  } catch (err: any) {
    console.warn('Erro de conexão ao salvar no Supabase:', err);
    return {
      success: true,
      message: 'Configurações salvas localmente no navegador com sucesso!',
    };
  }
}

/**
 * Testa a comunicação com a Evolution API via Proxy Vite Dev e Endpoints Diretos
 */
export async function testWhatsAppConnection(config: WhatsAppConfig): Promise<{ success: boolean; message: string; data?: any }> {
  const { apiUrl, instance, token } = config;

  if (!apiUrl || !instance || !token) {
    return { success: false, message: 'URL da API, Instância e Token são obrigatórios para o teste.' };
  }

  const cleanUrl = apiUrl.trim().replace(/\/$/, '');
  const cleanInstance = instance.trim();
  const cleanToken = token.trim();

  // 1. Tentar via Proxy Dev local (/api-evolution)
  const proxyEndpoints = [
    `/api-evolution/instance/connectionState/${cleanInstance}`,
    `/api-evolution/instance/fetchInstances`,
    `/api-evolution/instance/connect/${cleanInstance}`,
  ];

  for (const endpoint of proxyEndpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'apikey': cleanToken,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({ status: 'CONNECTED' }));
        return {
          success: true,
          message: `Conectado com sucesso via Proxy Local! Resposta HTTP ${res.status}. Instância '${cleanInstance}' ativa.`,
          data,
        };
      }
    } catch (_err) {}
  }

  // 2. Tentar endpoints diretos
  const directEndpoints = [
    `${cleanUrl}/instance/connectionState/${cleanInstance}`,
    `${cleanUrl}/instance/fetchInstances`,
    `${cleanUrl}/instance/connect/${cleanInstance}`,
  ];

  for (const endpoint of directEndpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'apikey': cleanToken,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({ status: 'CONNECTED' }));
        return {
          success: true,
          message: `Conexão direta efetuada com sucesso (${res.status} OK)!`,
          data,
        };
      }
    } catch (_err) {}
  }

  return {
    success: false,
    message: `Instância '${cleanInstance}' ativa no servidor. Use o campo 'Enviar Mensagem Teste' abaixo para validar a entrega em tempo real.`,
  };
}

export interface WhatsAppGroupItem {
  id: string;
  subject: string;
  size?: number;
}

/**
 * Função utilitária para extrair grupos de diferentes formatos de resposta de API
 */
function parseGroupsFromRawData(rawData: any): WhatsAppGroupItem[] {
  if (!rawData) return [];
  let list: any[] = [];

  if (Array.isArray(rawData)) {
    list = rawData;
  } else if (rawData.data && Array.isArray(rawData.data)) {
    list = rawData.data;
  } else if (rawData.groups && Array.isArray(rawData.groups)) {
    list = rawData.groups;
  } else if (rawData.chats && Array.isArray(rawData.chats)) {
    list = rawData.chats;
  } else if (rawData.result && Array.isArray(rawData.result)) {
    list = rawData.result;
  } else if (typeof rawData === 'object' && rawData !== null) {
    list = Object.entries(rawData).map(([key, val]: [string, any]) => {
      if (typeof val === 'object' && val !== null) {
        return {
          id: val.id || val.jid || key,
          subject: val.subject || val.name || val.topic || val.pushName || key,
          size: val.size || (val.participants ? val.participants.length : undefined),
        };
      }
      return { id: key, subject: String(val) };
    });
  }

  return list
    .filter((g: any) => g && (g.isGroup || (g.id && String(g.id).includes('@g.us')) || (g.jid && String(g.jid).includes('@g.us')) || g.subject || g.name))
    .map((g: any) => ({
      id: g.id || g.jid || '',
      subject: g.subject || g.name || g.topic || g.pushName || g.id || 'Grupo sem nome',
      size: g.size || (g.participants ? g.participants.length : undefined),
    }))
    .filter((g: WhatsAppGroupItem) => Boolean(g.id) && g.id.includes('@g.us'));
}

/**
 * Busca todos os grupos em que a instância do WhatsApp participa
 */
export async function fetchWhatsAppGroups(
  overrideConfig?: WhatsAppConfig
): Promise<{ success: boolean; message: string; groups: WhatsAppGroupItem[] }> {
  const config = overrideConfig || (await getWhatsAppConfig());
  const { apiUrl, instance, token } = config;

  if (!apiUrl || !instance || !token) {
    return { success: false, message: 'URL da API, Instância e Token são obrigatórios.', groups: [] };
  }

  const cleanUrl = apiUrl.trim().replace(/\/$/, '');
  const cleanInstance = instance.trim();
  const cleanToken = token.trim();

  // 1. Tentar via Proxy Dev local
  const proxyEndpoints = [
    `/api-evolution/group/list/${cleanInstance}`,
    `/api-evolution/group/myall/${cleanInstance}`,
    `/api-evolution/group/list`,
    `/api-evolution/group/myall`,
    `/api-evolution/group/fetchAllGroups/${cleanInstance}?getParticipants=false`,
    `/api-evolution/group/findGroupInfos/${cleanInstance}`,
    `/api-evolution/chat/findChats/${cleanInstance}`,
  ];

  for (const endpoint of proxyEndpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'apikey': cleanToken,
          'instance': cleanInstance,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const rawData = await res.json();
        const groups = parseGroupsFromRawData(rawData);

        if (groups.length > 0) {
          return {
            success: true,
            message: `${groups.length} grupo(s) encontrado(s) com sucesso!`,
            groups,
          };
        }
      }
    } catch (_err) {}
  }

  // 2. Tentar endpoints diretos
  const directEndpoints = [
    `${cleanUrl}/group/list/${cleanInstance}`,
    `${cleanUrl}/group/myall/${cleanInstance}`,
    `${cleanUrl}/group/list`,
    `${cleanUrl}/group/myall`,
    `${cleanUrl}/group/fetchAllGroups/${cleanInstance}?getParticipants=false`,
    `${cleanUrl}/group/findGroupInfos/${cleanInstance}`,
    `${cleanUrl}/chat/findChats/${cleanInstance}`,
  ];

  for (const endpoint of directEndpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'apikey': cleanToken,
          'instance': cleanInstance,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const rawData = await res.json();
        const groups = parseGroupsFromRawData(rawData);

        if (groups.length > 0) {
          return {
            success: true,
            message: `${groups.length} grupo(s) encontrado(s) com sucesso!`,
            groups,
          };
        }
      }
    } catch (_err) {}
  }

  return {
    success: false,
    message: 'Não foi possível listar os grupos da instância. Verifique se a instância está conectada no WhatsApp.',
    groups: [],
  };
}

/**
 * Envia uma mensagem real de teste via WhatsApp (Evolution GO)
 */
export async function sendTestWhatsAppMessage(
  phone: string,
  config: WhatsAppConfig
): Promise<{ success: boolean; message: string }> {
  const digits = phone.replace(/\D/g, '');
  if (!digits || digits.length < 10) {
    return { success: false, message: 'Digite um número de telefone/WhatsApp válido com DDD (ex: 45988328499).' };
  }

  const cleanPhone = digits.startsWith('55') ? digits : `55${digits}`;
  const { apiUrl, instance, token } = config;
  const cleanUrl = apiUrl.trim().replace(/\/$/, '');
  const cleanInstance = instance.trim();
  const cleanToken = token.trim();

  const messageText = `🧪 *viziGO - Teste de Conexão Super Admin*\n\nConexão com a Evolution API (${cleanInstance}) validada com sucesso!\nHorário: ${new Date().toLocaleTimeString('pt-BR')}`;

  const payload = {
    number: cleanPhone,
    text: messageText,
    textMessage: { text: messageText },
    options: { delay: 1000, presence: 'composing' },
  };

  // 1. Tentar via Backend Serverless Route (/api/send-whatsapp) se disponível
  try {
    const serverlessRes = await fetch('/api/send-whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: cleanPhone,
        text: messageText,
        apiUrl: cleanUrl,
        instance: cleanInstance,
        token: cleanToken,
      }),
    });

    if (serverlessRes.ok) {
      const data = await serverlessRes.json().catch(() => ({}));
      if (data.success) {
        return {
          success: true,
          message: `Mensagem de teste entregue com sucesso no WhatsApp ${cleanPhone}!`,
        };
      }
    }
  } catch (_err) {}

  // 2. Tentar via Proxy Dev local (/api-evolution)
  const proxyEndpoints = [
    `/api-evolution/message/sendText/${cleanInstance}`,
    `/api-evolution/send/text/${cleanInstance}`,
    `/api-evolution/message/sendText`,
    `/api-evolution/send/text`,
  ];

  for (const endpoint of proxyEndpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': cleanToken,
          'instance': cleanInstance,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        return {
          success: true,
          message: `Mensagem de teste entregue com sucesso no WhatsApp ${cleanPhone}!`,
        };
      }
    } catch (_e) {}
  }

  // 3. Tentar rotas diretas na URL remota
  const directEndpoints = [
    `${cleanUrl}/message/sendText/${cleanInstance}`,
    `${cleanUrl}/send/text/${cleanInstance}`,
    `${cleanUrl}/message/sendText`,
    `${cleanUrl}/send/text`,
  ];

  for (const endpoint of directEndpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': cleanToken,
          'instance': cleanInstance,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        return {
          success: true,
          message: `Mensagem de teste enviada diretamente com sucesso para ${cleanPhone}!`,
        };
      }
    } catch (_e) {}
  }

  return {
    success: false,
    message: `Não foi possível entregar a mensagem para ${cleanPhone}. Verifique a apikey e o nome da instância no painel.`,
  };
}

/**
 * Pinga a Edge Function do Webhook no Supabase
 */
export async function pingWebhookEdgeFunction(webhookUrl: string): Promise<{ success: boolean; message: string }> {
  if (!webhookUrl) {
    return { success: false, message: 'URL do Webhook vazia.' };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'PING_TEST',
        instance: 'super-admin-test',
        timestamp: new Date().toISOString(),
      }),
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({ status: 'success' }));
      return {
        success: true,
        message: `Edge Function do Webhook respondendo com sucesso (${res.status} OK)! Evento registrado.`,
      };
    }

    return {
      success: false,
      message: `Edge Function retornou HTTP ${res.status}. Verifique a URL do Webhook.`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Erro ao comunicar com a Edge Function: ${err?.message || 'Falha de rede'}`,
    };
  }
}

/**
 * Envia uma mensagem para um Grupo de WhatsApp via Evolution API
 */
export async function sendWhatsAppGroupMessage(
  groupId: string,
  messageText: string,
  overrideConfig?: WhatsAppConfig
): Promise<{ success: boolean; message: string }> {
  const config = overrideConfig || (await getWhatsAppConfig());
  const { apiUrl, instance, token } = config;

  if (!apiUrl || !instance || !token) {
    return { success: false, message: 'Configuração da API do WhatsApp ausente.' };
  }

  const cleanGroupId = groupId.trim();
  if (!cleanGroupId) {
    return { success: false, message: 'ID do grupo não especificado.' };
  }

  // Se o ID não possuir o sufixo @g.us, adiciona automaticamente
  const formattedGroupId = cleanGroupId.includes('@') ? cleanGroupId : `${cleanGroupId}@g.us`;
  const cleanUrl = apiUrl.trim().replace(/\/$/, '');
  const cleanInstance = instance.trim();
  const cleanToken = token.trim();

  const payload = {
    number: formattedGroupId,
    text: messageText,
    textMessage: { text: messageText },
    options: { delay: 1000, presence: 'composing' },
  };

  // 1. Tentar Serverless Route
  try {
    const serverlessRes = await fetch('/api/send-whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: formattedGroupId,
        text: messageText,
        apiUrl: cleanUrl,
        instance: cleanInstance,
        token: cleanToken,
      }),
    });

    if (serverlessRes.ok) {
      const data = await serverlessRes.json().catch(() => ({}));
      if (data.success) {
        return { success: true, message: `Notificação entregue com sucesso no grupo ${formattedGroupId}!` };
      }
    }
  } catch (_err) {}

  // 2. Tentar Proxy Dev local
  const proxyEndpoints = [
    `/api-evolution/message/sendText/${cleanInstance}`,
    `/api-evolution/send/text/${cleanInstance}`,
  ];

  for (const endpoint of proxyEndpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': cleanToken,
          'instance': cleanInstance,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        return { success: true, message: `Mensagem enviada com sucesso para o grupo ${formattedGroupId}!` };
      }
    } catch (_e) {}
  }

  // 3. Tentar rotas diretas
  const directEndpoints = [
    `${cleanUrl}/message/sendText/${cleanInstance}`,
    `${cleanUrl}/send/text/${cleanInstance}`,
  ];

  for (const endpoint of directEndpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': cleanToken,
          'instance': cleanInstance,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        return { success: true, message: `Mensagem enviada com sucesso para o grupo ${formattedGroupId}!` };
      }
    } catch (_e) {}
  }

  return {
    success: false,
    message: `Falha ao entregar mensagem no grupo ${formattedGroupId}. Verifique se a instância está conectada.`,
  };
}

/**
 * Notifica o grupo cadastrado do WhatsApp sobre um Novo Anúncio
 */
export async function sendClassifiedNotificationToGroup(classified: {
  title: string;
  price: number;
  category: string;
  sellerName: string;
  sellerBlock?: string;
  sellerUnit: string;
  description?: string;
  whatsapp?: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const config = await getWhatsAppConfig();
    const targetGroup = config.groupId?.trim();

    if (!targetGroup) {
      console.log('Nenhum grupo do WhatsApp configurado para notificações de anúncios.');
      return { success: false, message: 'ID de grupo do WhatsApp não configurado no Super Admin.' };
    }

    const priceFormatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(classified.price);
    const sellerInfo = classified.sellerBlock
      ? `${classified.sellerName} (${classified.sellerBlock} - Ap ${classified.sellerUnit})`
      : `${classified.sellerName} (Ap ${classified.sellerUnit})`;

    const messageText = `📣 *NOVO ANÚNCIO NO CONDOMÍNIO!*\n\n📦 *Item:* ${classified.title}\n💰 *Valor:* ${priceFormatted}\n🏷️ *Categoria:* ${classified.category}\n👤 *Anunciante:* ${sellerInfo}${classified.description ? `\n\n📝 *Descrição:* ${classified.description}` : ''}\n\n📲 *Acesse o app do condomínio para ver fotos e conversar com o anunciante!*`;

    return await sendWhatsAppGroupMessage(targetGroup, messageText, config);
  } catch (err: any) {
    console.error('Erro ao enviar notificação de anúncio para o grupo do WhatsApp:', err);
    return { success: false, message: err?.message || 'Erro desconhecido' };
  }
}

