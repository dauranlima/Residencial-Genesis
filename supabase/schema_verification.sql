-- ==============================================================================
-- SCHEMA COMPLETO SUPABASE: USUÁRIOS + TOKENS DE VERIFICAÇÃO (WHATSAPP OTP)
-- ==============================================================================

-- 1. TABELA DE USUÁRIOS / MORADORES (users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    block TEXT,
    unit TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir inserção de usuários" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir leitura de usuários" ON public.users FOR SELECT USING (true);
CREATE POLICY "Permitir atualização de usuários" ON public.users FOR UPDATE USING (true);

-- 2. TABELA DE TOKENS DE VERIFICAÇÃO (verification_tokens)
CREATE TABLE IF NOT EXISTS public.verification_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    used BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_verification_tokens_phone_code ON public.verification_tokens(phone, code);
ALTER TABLE public.verification_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir inserção de tokens" ON public.verification_tokens FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir leitura de tokens" ON public.verification_tokens FOR SELECT USING (true);
CREATE POLICY "Permitir atualização de tokens" ON public.verification_tokens FOR UPDATE USING (true);

-- 3. (OPCIONAL) TABELA PARA LOGS DE WEBHOOK
CREATE TABLE IF NOT EXISTS public.webhook_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT,
    instance TEXT,
    payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir inserção em webhook_logs" ON public.webhook_logs FOR INSERT WITH CHECK (true);
