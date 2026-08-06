import { supabase } from './supabase';

// Configuração da Evolution API
const EVOLUTION_API_URL = import.meta.env.VITE_EVOLUTION_API_URL || 'https://api.evolution-api.com'; // Altere para a URL do seu servidor Evolution
const EVOLUTION_INSTANCE = import.meta.env.VITE_EVOLUTION_INSTANCE || 'sua-instancia'; // Nome da sua instância no Evolution API
const EVOLUTION_TOKEN = import.meta.env.VITE_EVOLUTION_TOKEN || 'ff01fa86-4566-4ac0-9685-08cb627d25a6';

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
 * 1. Gera um código aleatório de 4 dígitos (ex: 1234 a 9999)
 * 2. Salva o código temporariamente no Supabase (tabela verification_tokens) com expiração de 5 minutos
 * 3. Dispara o envio via Evolution API WhatsApp
 */
export async function sendWhatsAppVerificationCode(phone: string): Promise<{ success: boolean; message: string; codeForTesting?: string }> {
  const cleanPhone = formatPhoneNumber(phone);
  if (!cleanPhone || cleanPhone.length < 10) {
    throw new Error('Número de WhatsApp inválido.');
  }

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
      console.warn('Aviso ao salvar token no Supabase (verifique se criou a tabela verification_tokens):', dbError);
    }
  } catch (err) {
    console.error('Erro ao interagir com Supabase verification_tokens:', err);
  }

  // 2. Disparar via Evolution API
  let sentViaWhatsApp = false;
  try {
    const response = await fetch(`${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': EVOLUTION_TOKEN,
      },
      body: JSON.stringify({
        number: cleanPhone,
        text: `🔐 *CondoMarket - Código de Verificação*\n\nSeu código de acesso é: *${code}*\n\nEste código expira em 5 minutos. Não o compartilhe com ninguém.`,
        options: {
          delay: 1200,
          presence: 'composing',
        },
      }),
    });

    if (response.ok) {
      sentViaWhatsApp = true;
    } else {
      const errData = await response.json().catch(() => ({}));
      console.warn('Instância Evolution API offline ou não configurada:', errData);
    }
  } catch (apiError) {
    console.warn('Erro na chamada HTTP da Evolution API:', apiError);
  }

  return {
    success: true,
    message: sentViaWhatsApp
      ? `Código enviado via WhatsApp para ${phone}`
      : `Código gerado (${code}). (Evolution API offline ou em teste)`,
    codeForTesting: code,
  };
}

/**
 * Valida o código digitado pelo usuário contra o Supabase ou sessão temporária
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
