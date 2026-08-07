import { createClient } from '@supabase/supabase-js';

/**
 * Helper para formatar telefone no formato internacional
 */
function formatPhone(phone: string): string {
  const digits = (phone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (!digits.startsWith('55') && (digits.length === 10 || digits.length === 11)) {
    return `55${digits}`;
  }
  return digits;
}

/**
 * Serverless API handler seguro para geração de OTP e envio de WhatsApp (Server-to-Server)
 * Impede que o código de verificação seja exposto na aba Network/DevTools do navegador do usuário.
 */
export default async function handler(req: any, res: any) {
  // Configurar cabeçalhos CORS
  if (res.setHeader) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
  }

  if (req.method === 'OPTIONS') {
    if (res.status) return res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    if (res.status) return res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { phone, text, apiUrl, instance, token, action } = req.body || {};

    const cleanPhone = formatPhone(phone);
    if (!cleanPhone || cleanPhone.length < 10) {
      const errRes = { success: false, error: 'Número de WhatsApp inválido com DDD.' };
      if (res.status) return res.status(400).json(errRes);
      return errRes;
    }

    const targetUrl = (apiUrl || process.env.VITE_EVOLUTION_API_URL || 'http://main-evolutiongo-0cf43a-187-127-6-57.sslip.io')
      .trim()
      .replace(/\/$/, '')
      .replace(/\/manager\/.*$/i, '');
    const targetInstance = (instance || process.env.VITE_EVOLUTION_INSTANCE || 'whats-moto').trim();
    const targetToken = (token || process.env.VITE_EVOLUTION_TOKEN || 'e90eb280-4399-4ab0-95eb-a2ce53d12fbe').trim();

    let messageToSend = text;

    // SE for um pedido de envio de OTP (ou se text não for fornecido, geramos no SERVIDOR)
    if (action === 'send_otp' || !text) {
      // 1. Gerar código aleatório de 4 dígitos NO SERVIDOR
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

      // 2. Salvar no Supabase no lado do SERVIDOR
      const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://cxlwzuudhavikgynxqpm.supabase.co';
      const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4bHd6dXVkaGF2aWtneW54cXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5Njc5OTgsImV4cCI6MjEwMTU0Mzk5OH0.Nv1-NQeqlLMNADLZSmq5yJESCuOXeMP9vyqP01FLtQA';

      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const { error: dbError } = await supabase
          .from('verification_tokens')
          .insert([{ phone: cleanPhone, code: code, expires_at: expiresAt, used: false }]);

        if (dbError) {
          console.warn('[Backend Serverless] Aviso ao salvar token no Supabase:', dbError.message);
        }
      } catch (dbErr) {
        console.error('[Backend Serverless] Erro DB Supabase:', dbErr);
      }

      messageToSend = `🔐 *viziGO - Código de Verificação*\n\nSeu código de acesso é: *${code}*\n\nEste código é válido por 5 minutos.`;
    }

    // 3. Enviar mensagem para a Evolution API (Server-to-Server)
    const candidateEndpoints = [
      `${targetUrl}/message/sendText/${targetInstance}`,
      `${targetUrl}/send/text/${targetInstance}`,
      `${targetUrl}/message/sendText`,
      `${targetUrl}/send/text`,
    ];

    const payload = {
      number: cleanPhone,
      text: messageToSend,
      textMessage: { text: messageToSend },
      options: { delay: 1200, presence: 'composing' },
    };

    let lastErrorMessage = '';
    for (const endpoint of candidateEndpoints) {
      try {
        console.log(`[Backend Serverless] Enviando WhatsApp via: ${endpoint}`);
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': targetToken,
            'instance': targetInstance,
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json().catch(() => ({ status: 'SUCCESS' }));
          console.log(`[Backend Serverless] Entregue com sucesso via ${endpoint}`);
          const successRes = {
            success: true,
            message: 'Código enviado com sucesso para seu WhatsApp!',
            whatsappSent: true,
          };
          if (res.status) return res.status(200).json(successRes);
          return successRes;
        } else {
          const errBody = await response.json().catch(() => ({}));
          console.warn(`[Backend Serverless] HTTP ${response.status} em ${endpoint}:`, errBody);
          lastErrorMessage = errBody?.message || errBody?.error || `HTTP ${response.status}`;
        }
      } catch (err: any) {
        console.warn(`[Backend Serverless] Erro ao tentar ${endpoint}:`, err?.message);
        lastErrorMessage = err?.message || 'Erro de conexão HTTP';
      }
    }

    const failRes = {
      success: false,
      error: `Não foi possível entregar via Evolution GO (${lastErrorMessage})`,
    };
    if (res.status) return res.status(400).json(failRes);
    return failRes;
  } catch (error: any) {
    console.error('[Backend Serverless Handler Error]:', error);
    const errObj = { success: false, error: 'Internal Server Error', details: error?.message };
    if (res.status) return res.status(500).json(errObj);
    return errObj;
  }
}
