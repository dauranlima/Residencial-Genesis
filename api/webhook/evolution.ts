import type { Request, Response } from 'express';

/**
 * Webhook para receber eventos da Evolution API / Evolution GO
 * Recebe notificações de:
 * - MESSAGES_UPSERT (mensagens recebidas/enviadas)
 * - SEND_MESSAGE (confirmação de envio)
 * - CONNECTION_UPDATE (status do QR Code / Conexão do WhatsApp)
 */
export default async function handler(req: any, res: any) {
  // Permitir somente método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = req.body;
    const eventType = body?.event || body?.type || 'UNKNOWN';
    const instance = body?.instance;

    console.log(`[Evolution Webhook] Evento recebido: ${eventType} (Instância: ${instance})`);

    // Tratar os diferentes tipos de eventos da Evolution API
    switch (eventType) {
      case 'MESSAGES_UPSERT':
      case 'messages.upsert': {
        const messageData = body?.data;
        const key = messageData?.key;
        const fromNumber = key?.remoteJid?.replace('@s.whatsapp.net', '');
        const textMessage = messageData?.message?.conversation || messageData?.message?.extendedTextMessage?.text;

        console.log(`[Evolution Webhook] Mensagem recebida de ${fromNumber}: ${textMessage}`);
        // Aqui você pode processar respostas automáticas ou comandos via WhatsApp se desejar
        break;
      }

      case 'CONNECTION_UPDATE':
      case 'connection.update': {
        const state = body?.data?.state;
        console.log(`[Evolution Webhook] Status da Conexão mudou para: ${state}`);
        break;
      }

      case 'SEND_MESSAGE':
      case 'send.message': {
        console.log(`[Evolution Webhook] Confirmação de mensagem enviada com sucesso!`);
        break;
      }

      default:
        console.log('[Evolution Webhook] Evento genérico:', JSON.stringify(body, null, 2));
    }

    // Responder 200 OK para a Evolution API
    return res.status(200).json({ status: 'SUCCESS', receivedAt: new Date().toISOString() });
  } catch (error: any) {
    console.error('[Evolution Webhook Error]:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error?.message });
  }
}
