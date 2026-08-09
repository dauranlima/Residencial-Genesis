-- Script SQL para criar a tabela de Parceiros Comerciais (merchants) no Supabase
CREATE TABLE IF NOT EXISTS public.merchants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    responsible_name VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    address TEXT,
    access_code VARCHAR(8) UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;

-- Política de leitura pública (qualquer morador/visitante/admin pode ver os comerciantes)
DROP POLICY IF EXISTS "Permitir leitura publica de comerciantes" ON public.merchants;
CREATE POLICY "Permitir leitura publica de comerciantes" 
ON public.merchants FOR SELECT 
USING (true);

-- Política de inserção pública
DROP POLICY IF EXISTS "Permitir insercao de comerciantes" ON public.merchants;
CREATE POLICY "Permitir insercao de comerciantes" 
ON public.merchants FOR INSERT 
WITH CHECK (true);

-- Política de atualização pública
DROP POLICY IF EXISTS "Permitir atualizacao de comerciantes" ON public.merchants;
CREATE POLICY "Permitir atualizacao de comerciantes" 
ON public.merchants FOR UPDATE 
USING (true);

-- Política de exclusão pública
DROP POLICY IF EXISTS "Permitir exclusao de comerciantes" ON public.merchants;
CREATE POLICY "Permitir exclusao de comerciantes" 
ON public.merchants FOR DELETE 
USING (true);

