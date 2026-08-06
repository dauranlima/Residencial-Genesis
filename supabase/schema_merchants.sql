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

-- Política de leitura pública (qualquer morador/visitante pode ver a lista de comerciantes)
CREATE POLICY "Permitir leitura publica de comerciantes" 
ON public.merchants FOR SELECT 
USING (true);

-- Política de inserção e atualização pública (para homologação via frontend)
CREATE POLICY "Permitir insercao de comerciantes" 
ON public.merchants FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir atualizacao de comerciantes" 
ON public.merchants FOR UPDATE 
USING (true);
