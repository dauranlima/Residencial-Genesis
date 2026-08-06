-- ==============================================================================
-- SCHEMA SUPABASE: TABELA DE RESGATES DE CUPONS (coupon_redemptions)
-- Vincula cada cupom resgatado à moradora/morador que o resgatou
-- ==============================================================================

-- 1. Criar a tabela 'coupon_redemptions' no schema public
CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    coupon_id TEXT NOT NULL,
    resident_name TEXT NOT NULL,
    resident_phone TEXT NOT NULL,
    resident_unit TEXT NOT NULL,
    resident_block TEXT,
    redeemed_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Garantia no banco: 1 mesmo cupom só pode ser resgatado 1 vez por morador
    CONSTRAINT unique_coupon_per_resident UNIQUE (coupon_id, resident_phone)
);

-- 2. Criar índices para busca rápida por morador ou por cupom (útil para os comerciantes)
CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_phone ON public.coupon_redemptions(resident_phone);
CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_coupon_id ON public.coupon_redemptions(coupon_id);

-- 3. Habilitar RLS (Row Level Security) obrigatoriamente
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;

-- 4. Remover políticas antigas se existirem (para evitar erro ao re-executar)
DROP POLICY IF EXISTS "Permitir inserção de resgate de cupom" ON public.coupon_redemptions;
DROP POLICY IF EXISTS "Permitir leitura de cupons resgatados" ON public.coupon_redemptions;

-- 5. Criar Políticas de RLS para leitura e registro de resgates
CREATE POLICY "Permitir inserção de resgate de cupom" 
ON public.coupon_redemptions FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir leitura de cupons resgatados" 
ON public.coupon_redemptions FOR SELECT 
USING (true);
