-- ==============================================================================
-- SCHEMA SUPABASE: TABELA DE USUÁRIOS / MORADORES (users)
-- ==============================================================================

-- 1. Criar a tabela 'users' no schema public
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    block TEXT,
    unit TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Criar índice para busca ultra-rápida por telefone
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. Criar Políticas de RLS
CREATE POLICY "Permitir inserção e cadastro de usuários" 
ON public.users FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir leitura de usuários" 
ON public.users FOR SELECT 
USING (true);

CREATE POLICY "Permitir atualização de perfil de usuário" 
ON public.users FOR UPDATE 
USING (true);
