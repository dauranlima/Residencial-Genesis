import { supabase } from './supabase';

export interface WhatsAppConfig {
  apiUrl: string;
  instance: string;
  token: string;
  webhookUrl: string;
  updatedAt?: string;
}

const STORAGE_KEY = 'vizi_whatsapp_config';

/**
 * Retorna as configurações padrão baseadas nas variáveis de ambiente
 */
export function getDefaultWhatsAppConfig(): WhatsAppConfig {
  return {
    apiUrl: import.meta.env.VITE_EVOLUTION_API_URL || 'https://evogo.dldigitalsolutions.cloud',
    instance: import.meta.env.VITE_EVOLUTION_INSTANCE || 'moto-whats-t',
    token: import.meta.env.VITE_EVOLUTION_TOKEN || '73431f0c-eb72-4ad4-9022-b6be06df6378',
    webhookUrl: 'https://cxlwzuudhavikgynxqpm.supabase.co/functions/v1/evolution-webhook',
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
      // Atualiza o cache local
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
 * Testa a conexão com a Evolution API usando as configurações passadas
 */
export async function testWhatsAppConnection(config: WhatsAppConfig): Promise<{ success: boolean; message: string; data?: any }> {
  const { apiUrl, instance, token } = config;

  if (!apiUrl || !instance || !token) {
    return { success: false, message: 'URL da API, Instância e Token são obrigatórios para o teste.' };
  }

  const cleanUrl = apiUrl.trim().replace(/\/$/, '');
  const endpointsToTry = [
    `${cleanUrl}/instance/connect/${instance}`,
    `${cleanUrl}/instance/fetchInstances`,
    `${cleanUrl}/instance/connectionState/${instance}`,
  ];

  for (const endpoint of endpointsToTry) {
    try {
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'apikey': token,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({ status: 'OK' }));
        return {
          success: true,
          message: `Conexão efetuada com sucesso! Resposta da API Evolution (${res.status} OK).`,
          data,
        };
      }
    } catch (_err) {
      // Continua para o próximo endpoint se falhar CORS ou 404
    }
  }

  // Tenta via proxy local se estiver em dev
  try {
    const proxyRes = await fetch(`/api-evolution/instance/connectionState/${instance}`, {
      headers: { 'apikey': token },
    });
    if (proxyRes.ok) {
      const data = await proxyRes.json().catch(() => ({ status: 'CONNECTED' }));
      return {
        success: true,
        message: `Conexão bem-sucedida via Proxy Local dev!`,
        data,
      };
    }
  } catch (_e) {}

  return {
    success: false,
    message: 'Não foi possível se comunicar diretamente com a Evolution API. Verifique a URL, token e se a instância está rodando.',
  };
}
