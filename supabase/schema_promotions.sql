-- ==============================================================================
-- SCHEMA SUPABASE: TABELA DE PROMOÇÕES / CUPONS DOS PARCEIROS (promotions)
-- Armazena as ofertas relâmpago cadastradas pelos comerciantes parceiros
-- ==============================================================================

-- 1. Criar a tabela 'promotions' no schema public
CREATE TABLE IF NOT EXISTS public.promotions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    merchant_name VARCHAR(255) NOT NULL,
    merchant_category VARCHAR(100) NOT NULL,
    merchant_whatsapp VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    discount_value VARCHAR(100) NOT NULL,
    total_quantity INTEGER NOT NULL DEFAULT 10,
    remaining_quantity INTEGER NOT NULL DEFAULT 10,
    expires_at TIMESTAMPTZ NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar RLS (Row Level Security)
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- 3. Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Permitir leitura publica de promocoes" ON public.promotions;
DROP POLICY IF EXISTS "Permitir insercao de promocoes" ON public.promotions;
DROP POLICY IF EXISTS "Permitir atualizacao de promocoes" ON public.promotions;
DROP POLICY IF EXISTS "Permitir exclusao de promocoes" ON public.promotions;

-- 4. Criar Políticas de RLS para Leitura, Criação, Atualização (Resgate) e Exclusão
CREATE POLICY "Permitir leitura publica de promocoes" 
ON public.promotions FOR SELECT 
USING (true);

CREATE POLICY "Permitir insercao de promocoes" 
ON public.promotions FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir atualizacao de promocoes" 
ON public.promotions FOR UPDATE 
USING (true);

CREATE POLICY "Permitir exclusao de promocoes" 
ON public.promotions FOR DELETE 
USING (true);

-- 5. Criar bucket de armazenamento público para imagens das ofertas ('img_ofertas') se não existir
INSERT INTO storage.buckets (id, name, public) 
VALUES ('img_ofertas', 'img_ofertas', true) 
ON CONFLICT (id) DO NOTHING;

-- Políticas de Acesso ao Storage para 'img_ofertas'
DROP POLICY IF EXISTS "Permitir upload publico em img_ofertas" ON storage.objects;
CREATE POLICY "Permitir upload publico em img_ofertas" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'img_ofertas');

DROP POLICY IF EXISTS "Permitir leitura publica de img_ofertas" ON storage.objects;
CREATE POLICY "Permitir leitura publica de img_ofertas" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'img_ofertas');
