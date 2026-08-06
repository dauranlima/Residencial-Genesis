import { supabase } from './supabase';

/**
 * Limpa o número de telefone e garante formato internacional (ex: 5545999999999)
 */
export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  // Se não começar com DDI 55 (Brasil) e tiver 10 ou 11 dígitos, adiciona 55
  if (!digits.startsWith('55') && (digits.length === 10 || digits.length === 11)) {
    return `55${digits}`;
  }
  return digits;
}

/**
 * Sanitiza a URL base da Evolution API removendo caminhos do painel gerenciador
 */
function getSanitizedApiUrl(rawUrl: string): string {
  let url = (rawUrl || '').trim().replace(/\/$/, '');
  url = url.replace(/\/manager\/.*$/i, '');
  url = url.replace(/\/instances\/.*$/i, '');
  url = url.replace(/\/instance\/.*$/i, '');
  return url;
}

/**
 * 1. Gera um código aleatório de 4 dígitos (ex: 1000 a 9999)
 * 2. Salva o código temporariamente no Supabase (tabela verification_tokens) com expiração de 5 minutos
 * 3. Dispara o envio via Evolution API / Evolution GO WhatsApp
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

  // Obter configurações da Evolution API
  const rawApiUrl = import.meta.env.VITE_EVOLUTION_API_URL || '';
  const apiUrl = getSanitizedApiUrl(rawApiUrl);
  const instance = (import.meta.env.VITE_EVOLUTION_INSTANCE || '').trim();
  const token = (import.meta.env.VITE_EVOLUTION_TOKEN || 'ff01fa86-4566-4ac0-9685-08cb627d25a6').trim();

  const isConfigured = apiUrl && !apiUrl.includes('sua-evolution-api.com') && instance && !instance.includes('nome-da-sua-instancia');

  // Gera código aleatório de 4 dígitos (1000 a 9999)
  const code = Math.floor(1000 + Math.random() * 9000).toString();

  // Define expiração para daqui a 5 minutos
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

  // 2. Disparar via Evolution API / Evolution GO
  let whatsappSent = false;
  let apiErrorMessage = '';

  if (isConfigured) {
    const messageText = `🔐 *CondoMarket - Código de Verificação*\n\nSeu código de acesso é: *${code}*\n\nEste código é válido por 5 minutos.`;

    // Lista de endpoints possíveis para Evolution API e Evolution GO
    const candidateEndpoints = [
      `${apiUrl}/send/text/${instance}`,
      `${apiUrl}/send/text`,
      `${apiUrl}/message/sendText/${instance}`,
      `${apiUrl}/message/sendText`,
    ];

    const standardHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'apikey': token,
      'instance': instance,
      'instanceId': instance,
    };

    const payload = {
      number: cleanPhone,
      text: messageText,
      textMessage: {
        text: messageText,
      },
      options: {
        delay: 1200,
        presence: 'composing',
      },
    };

    for (const endpoint of candidateEndpoints) {
      try {
        console.log(`[Evolution GO] Testando endpoint: ${endpoint}...`);
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: standardHeaders,
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          whatsappSent = true;
          console.log(`[Evolution GO] Mensagem enviada com sucesso via ${endpoint}!`);
          break;
        } else {
          const errBody = await response.json().catch(() => ({}));
          console.warn(`[Evolution GO] Resposta de ${endpoint}: ${response.status}`, errBody);
          apiErrorMessage = errBody?.message || errBody?.error || `HTTP ${response.status}`;
        }
      } catch (err: any) {
        console.warn(`[Evolution GO] Erro ao conectar em ${endpoint}:`, err?.message);
        apiErrorMessage = err?.message || 'Erro de rede';
      }
    }
  } else {
    console.warn('[Evolution API] Variáveis de ambiente não configuradas.');
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
    message: isConfigured
      ? `Falha no envio do WhatsApp (${apiErrorMessage}). Código de teste: ${code}`
      : `Configure VITE_EVOLUTION_API_URL no .env. Código de teste: ${code}`,
    codeForTesting: code,
    whatsappSent: false,
  };
}

/**
 * Valida o código digitado pelo usuário contra o Supabase
 */
export async function verifyWhatsAppCode(phone: string, inputCode: string): Promise<boolean> {
  const cleanPhone = formatPhoneNumber(phone);
  const now = new Date().toISOString();

  try {
    const { data, error } = await supabase
      .from('verification_tokens')
      .select('*')
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
      // Marcar token como utilizado
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
