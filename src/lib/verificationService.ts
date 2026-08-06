import { supabase } from './supabase';

/**
 * Limpa o número de telefone e garante formato internacional (ex: 5545999999999)
 */
export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  if (!digits.startsWith('55') && (digits.length === 10 || digits.length === 11)) {
    return `55${digits}`;
  }
  return digits;
}

/**
 * Sanitiza a URL base da Evolution API
 */
function getSanitizedApiUrl(rawUrl: string): string {
  let url = (rawUrl || '').trim().replace(/\/$/, '');
  url = url.replace(/\/manager\/.*$/i, '');
  url = url.replace(/\/instances\/.*$/i, '');
  url = url.replace(/\/instance\/.*$/i, '');
  return url;
}

/**
 * 1. Gera código numérico de 4 dígitos
 * 2. Salva no Supabase (verification_tokens) com expiração de 5 min
 * 3. Dispara mensagem via WhatsApp (com proxy/backend para eliminar CORS)
 */
export async function sendWhatsAppVerificationCode(phone: string): Promise<{
  success: boolean;
  message: string;
  codeForTesting?: string;
  whatsappSent: boolean;
}> {
  const cleanPhone = formatPhoneNumber(phone);
  if (!cleanPhone || cleanPhone.length < 10) {
    throw new Error('Número de WhatsApp inválido.');
  }

  const rawApiUrl = import.meta.env.VITE_EVOLUTION_API_URL || 'https://evogo.dldigitalsolutions.cloud';
  const apiUrl = getSanitizedApiUrl(rawApiUrl);
  const instance = (import.meta.env.VITE_EVOLUTION_INSTANCE || 'teste-meuwhats').trim();
  const token = (import.meta.env.VITE_EVOLUTION_TOKEN || 'ff01fa86-4566-4ac0-9685-08cb627d25a6').trim();

  // Gera código aleatório de 4 dígitos
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  // 1. Salvar no Supabase (Tabela verification_tokens)
  try {
    const { error: dbError } = await supabase
      .from('verification_tokens')
      .insert([
        {
          phone: cleanPhone,
          code: code,
          expires_at: expiresAt,
          used: false,
        },
      ]);

    if (dbError) {
      console.warn('Aviso ao salvar token no Supabase:', dbError);
    }
  } catch (err) {
    console.error('Erro ao interagir com Supabase verification_tokens:', err);
  }

  // 2. Disparar Envio do WhatsApp
  let whatsappSent = false;
  let apiErrorMessage = '';
  const messageText = `🔐 *CondoMarket - Código de Verificação*\n\nSeu código de acesso é: *${code}*\n\nEste código é válido por 5 minutos.`;

  // 2.1 Tentar Via Proxy do Vite Server (/api-evolution) para evitar CORS no ambiente local
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    const proxyEndpoints = [
      `/api-evolution/send/text/${instance}`,
      `/api-evolution/send/text`,
      `/api-evolution/message/sendText/${instance}`,
      `/api-evolution/message/sendText`,
    ];

    for (const endpoint of proxyEndpoints) {
      try {
        console.log(`[WhatsApp Proxy Local] Disparando para ${endpoint}...`);
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': token,
            'instance': instance,
          },
          body: JSON.stringify({
            number: cleanPhone,
            text: messageText,
            textMessage: { text: messageText },
            options: { delay: 1200, presence: 'composing' },
          }),
        });

        if (res.ok) {
          whatsappSent = true;
          console.log('[WhatsApp Proxy Local] Entregue com sucesso!');
          break;
        } else {
          const errData = await res.json().catch(() => ({}));
          console.warn(`[WhatsApp Proxy Local] Erro em ${endpoint}:`, res.status, errData);
          apiErrorMessage = errData?.message || `HTTP ${res.status}`;
        }
      } catch (err: any) {
        console.warn(`[WhatsApp Proxy Local] Falha em ${endpoint}:`, err?.message);
        apiErrorMessage = err?.message;
      }
    }
  }

  // 2.2 Tentar via Rota Serverless / Backend Proxy (/api/send-whatsapp)
  if (!whatsappSent) {
    try {
      console.log('[WhatsApp Backend API] Tentando rota backend /api/send-whatsapp...');
      const res = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          text: messageText,
          apiUrl,
          instance,
          token,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          whatsappSent = true;
          console.log('[WhatsApp Backend API] Entregue com sucesso!');
        }
      }
    } catch (_err) {}
  }

  // 2.3 Fallback Direto (caso esteja rodando fora do local dev e sem serverless)
  if (!whatsappSent) {
    const candidateEndpoints = [
      `${apiUrl}/send/text/${instance}`,
      `${apiUrl}/send/text`,
      `${apiUrl}/message/sendText/${instance}`,
      `${apiUrl}/message/sendText`,
    ];

    for (const endpoint of candidateEndpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': token,
            'instance': instance,
          },
          body: JSON.stringify({
            number: cleanPhone,
            text: messageText,
            textMessage: { text: messageText },
          }),
        });

        if (response.ok) {
          whatsappSent = true;
          break;
        }
      } catch (err: any) {
        apiErrorMessage = err?.message || 'CORS / Erro de rede';
      }
    }
  }

  if (whatsappSent) {
    return {
      success: true,
      message: `Código enviado com sucesso para seu WhatsApp!`,
      whatsappSent: true,
    };
  }

  return {
    success: true,
    message: `Falha no envio via WhatsApp (${apiErrorMessage}). Código de teste: ${code}`,
    codeForTesting: code,
    whatsappSent: false,
  };
}

/**
 * Valida o código digitado pelo usuário no Supabase
 */
export async function verifyWhatsAppCode(phone: string, inputCode: string): Promise<boolean> {
  const cleanPhone = formatPhoneNumber(phone);
  const now = new Date().toISOString();

  try {
    const { data, error } = await supabase
      .from('verification_tokens')
      .select('id, code, expires_at, used')
      .eq('phone', cleanPhone)
      .eq('code', inputCode)
      .eq('used', false)
      .gt('expires_at', now)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Erro ao consultar token no Supabase:', error);
      return false;
    }

    if (data && data.length > 0) {
      await supabase
        .from('verification_tokens')
        .update({ used: true })
        .eq('id', data[0].id);

      return true;
    }
  } catch (err) {
    console.error('Erro ao validar token:', err);
  }

  return false;
}
