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
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Garantir que a coluna 'is_blocked' exista se a tabela já tiver sido criada anteriormente
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE;

-- 2. Criar índice para busca ultra-rápida por telefone
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. Criar Políticas de RLS
DROP POLICY IF EXISTS "Permitir inserção e cadastro de usuários" ON public.users;
CREATE POLICY "Permitir inserção e cadastro de usuários" 
ON public.users FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura de usuários" ON public.users;
CREATE POLICY "Permitir leitura de usuários" 
ON public.users FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Permitir atualização de perfil de usuário" ON public.users;
CREATE POLICY "Permitir atualização de perfil de usuário" 
ON public.users FOR UPDATE 
USING (true);

DROP POLICY IF EXISTS "Permitir exclusão de usuário" ON public.users;
CREATE POLICY "Permitir exclusão de usuário" 
ON public.users FOR DELETE 
USING (true);

