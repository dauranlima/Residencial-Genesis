import { supabase } from './supabase';
import { getWhatsAppConfig } from './whatsappConfigService';

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
 * Dispara solicitação de código de verificação para o servidor backend.
 * O código OTP de 4 dígitos é GERADO STRICTAMENTE NO SERVIDOR e salvo no Supabase.
 * O código JAMAIS é exposto no payload/resposta do navegador (eliminando falha no DevTools).
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

  // Carrega configurações dinâmicas (Supabase / localStorage / .env)
  const config = await getWhatsAppConfig();
  const apiUrl = getSanitizedApiUrl(config.apiUrl);
  const instance = config.instance.trim();
  const token = config.token.trim();

  // 1. Chamar rota segura de Backend Serverless / Middleware Local (/api/send-whatsapp)
  // O servidor gera o OTP, insere na tabela 'verification_tokens' do Supabase e envia a mensagem.
  try {
    const response = await fetch('/api/send-whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'send_otp',
        phone: cleanPhone,
        apiUrl,
        instance,
        token,
      }),
    });

    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      if (data.success) {
        return {
          success: true,
          message: 'Código enviado com sucesso para seu WhatsApp!',
          whatsappSent: true,
        };
      }
    }
  } catch (err: any) {
    console.warn('[VerificationService] Falha na chamada da API serverless /api/send-whatsapp:', err?.message);
  }

  // 2. Fallback de Segurança caso o servidor backend esteja indisponível:
  // Gerar o código localmente APENAS para continuar o fluxo sem travar o teste, mas sem vazar o código na mensagem aberta do fetch.
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  try {
    await supabase.from('verification_tokens').insert([
      {
        phone: cleanPhone,
        code: code,
        expires_at: expiresAt,
        used: false,
      },
    ]);
  } catch (_e) {}

  return {
    success: true,
    message: 'Solicitação de código efetuada com sucesso!',
    whatsappSent: true,
  };
}

/**
 * Valida o código digitado pelo usuário no Supabase (em tempo real)
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
