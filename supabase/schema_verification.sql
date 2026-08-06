-- ==============================================================================
-- SCHEMA SUPABASE: TABELA DE TOKENS DE VERIFICAÇÃO (WHATSAPP OTP)
-- ==============================================================================

-- 1. Criar a tabela verification_tokens no schema public
CREATE TABLE IF NOT EXISTS public.verification_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    used BOOLEAN DEFAULT FALSE
);

-- 2. Criar índice para agilizar consultas por telefone e código
CREATE INDEX IF NOT EXISTS idx_verification_tokens_phone_code 
ON public.verification_tokens(phone, code);

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE public.verification_tokens ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas de acesso (RLS)
CREATE POLICY "Permitir inserção de tokens de verificação" 
ON public.verification_tokens FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir leitura de tokens de verificação" 
ON public.verification_tokens FOR SELECT 
USING (true);

CREATE POLICY "Permitir atualização de tokens de verificação" 
ON public.verification_tokens FOR UPDATE 
USING (true);

-- ==============================================================================
-- (OPCIONAL) TABELA PARA LOGS DE WEBHOOK DA EVOLUTION API
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.webhook_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT,
    instance TEXT,
    payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir inserção em webhook_logs" 
ON public.webhook_logs FOR INSERT 
WITH CHECK (true);
