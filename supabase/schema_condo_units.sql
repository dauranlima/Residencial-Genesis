-- ==============================================================================
-- SCHEMA SUPABASE: TABELAS DE TORRES / BLOCOS E UNIDADES / APARTAMENTOS
-- ==============================================================================

-- 1. Tabela de Torres / Blocos
CREATE TABLE IF NOT EXISTS public.condo_towers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Unidades / Apartamentos / Casas
CREATE TABLE IF NOT EXISTS public.condo_units (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    unit_number TEXT NOT NULL UNIQUE,
    block_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.condo_towers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.condo_units ENABLE ROW LEVEL SECURITY;

-- Políticas de Permissão RLS para condo_towers
DROP POLICY IF EXISTS "Permitir leitura publica de torres" ON public.condo_towers;
CREATE POLICY "Permitir leitura publica de torres" ON public.condo_towers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir insercao de torres" ON public.condo_towers;
CREATE POLICY "Permitir insercao de torres" ON public.condo_towers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir atualizacao de torres" ON public.condo_towers;
CREATE POLICY "Permitir atualizacao de torres" ON public.condo_towers FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Permitir exclusao de torres" ON public.condo_towers;
CREATE POLICY "Permitir exclusao de torres" ON public.condo_towers FOR DELETE USING (true);

-- Políticas de Permissão RLS para condo_units
DROP POLICY IF EXISTS "Permitir leitura publica de unidades" ON public.condo_units;
CREATE POLICY "Permitir leitura publica de unidades" ON public.condo_units FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir insercao de unidades" ON public.condo_units;
CREATE POLICY "Permitir insercao de unidades" ON public.condo_units FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir atualizacao de unidades" ON public.condo_units;
CREATE POLICY "Permitir atualizacao de unidades" ON public.condo_units FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Permitir exclusao de unidades" ON public.condo_units;
CREATE POLICY "Permitir exclusao de unidades" ON public.condo_units FOR DELETE USING (true);

-- ==============================================================================
-- INSERÇÃO DOS DADOS INICIAIS (SEEDING)
-- ==============================================================================

-- Inserir Torres Padrão
INSERT INTO public.condo_towers (name) VALUES
    ('Torre A'),
    ('Torre B'),
    ('Torre C'),
    ('Torre D')
ON CONFLICT (name) DO NOTHING;

-- Inserir Apartamentos das linhas 9 e 10 de MoradorAuthModal.tsx
INSERT INTO public.condo_units (unit_number) VALUES
    ('511'), ('512'), ('513'), ('514'),
    ('521'), ('522'), ('523'), ('524'),
    ('531'), ('532'), ('533'), ('534'),
    ('541'), ('542'), ('543'), ('544'),
    ('411'), ('412'), ('413'), ('414'),
    ('421'), ('422'), ('423'), ('424'),
    ('431'), ('432'), ('433'), ('434'),
    ('441'), ('442'), ('443'), ('444')
ON CONFLICT (unit_number) DO NOTHING;
