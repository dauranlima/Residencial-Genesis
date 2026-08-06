/**
 * Serverless API handler para envio de WhatsApp via Evolution GO (Server-to-Server)
 * Elimina totalmente erros de CORS do navegador.
 */
export default async function handler(req: any, res: any) {
  // Configurar cabeçalhos CORS para permitir requisição da própria aplicação
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { phone, text, apiUrl, instance, token } = req.body;

    const targetUrl = (apiUrl || process.env.VITE_EVOLUTION_API_URL || 'https://evogo.dldigitalsolutions.cloud')
      .trim()
      .replace(/\/$/, '')
      .replace(/\/manager\/.*$/i, '');
    const targetInstance = (instance || process.env.VITE_EVOLUTION_INSTANCE || 'teste-meuwhats').trim();
    const targetToken = (token || process.env.VITE_EVOLUTION_TOKEN || 'ff01fa86-4566-4ac0-9685-08cb627d25a6').trim();

    if (!phone || !text) {
      return res.status(400).json({ error: 'Parâmetros phone e text são obrigatórios.' });
    }

    // Candidatos de rotas no Evolution GO
    const candidateEndpoints = [
      `${targetUrl}/send/text/${targetInstance}`,
      `${targetUrl}/send/text`,
      `${targetUrl}/message/sendText/${targetInstance}`,
      `${targetUrl}/message/sendText`,
    ];

    let lastErrorMessage = '';
    for (const endpoint of candidateEndpoints) {
      try {
        console.log(`[Backend Serverless] Disparando requisição para: ${endpoint}`);
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': targetToken,
            'instance': targetInstance,
          },
          body: JSON.stringify({
            number: phone,
            text: text,
            textMessage: {
              text: text,
            },
            options: {
              delay: 1200,
              presence: 'composing',
            },
          }),
        });

        if (response.ok) {
          const data = await response.json().catch(() => ({ status: 'SUCCESS' }));
          console.log(`[Backend Serverless] Mensagem entregue com sucesso via ${endpoint}!`);
          return res.status(200).json({ success: true, data, endpointUsed: endpoint });
        } else {
          const errBody = await response.json().catch(() => ({}));
          console.warn(`[Backend Serverless] Resposta de erro do endpoint ${endpoint}: ${response.status}`, errBody);
          lastErrorMessage = errBody?.message || errBody?.error || `HTTP ${response.status}`;
        }
      } catch (err: any) {
        console.warn(`[Backend Serverless] Falha ao tentar ${endpoint}:`, err?.message);
        lastErrorMessage = err?.message || 'Erro de conexão HTTP';
      }
    }

    return res.status(400).json({
      success: false,
      error: `Não foi possível entregar via Evolution GO (${lastErrorMessage})`,
    });
  } catch (error: any) {
    console.error('[Backend Serverless Handler Error]:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error?.message });
  }
}
