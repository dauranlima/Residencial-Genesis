// Supabase Edge Function: evolution-webhook
// URL do Webhook no Supabase: https://<project-ref>.supabase.co/functions/v1/evolution-webhook

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const event = payload?.event || payload?.type;
    const instance = payload?.instance;

    console.log(`[Supabase Edge Webhook] Evento: ${event} | Instância: ${instance}`);

    // Inicializar cliente Supabase com chave de serviço se necessário
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Exemplo: Registrar log do webhook recebido na tabela webhook_logs (opcional)
    try {
      await supabase.from('webhook_logs').insert([
        {
          event_type: event,
          instance: instance,
          payload: payload,
          created_at: new Date().toISOString(),
        }
      ]);
    } catch (_e) {
      // Ignorar se a tabela de log não existir
    }

    return new Response(
      JSON.stringify({ status: "success", event }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
