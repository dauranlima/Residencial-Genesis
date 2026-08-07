-- ==============================================================================
-- SCHEMA SUPABASE: TABELA SYSTEM_SETTINGS (CONFIGURAÇÕES DO SISTEMA / WHATSAPP)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso permissivas para leitura e gravação de configurações
DROP POLICY IF EXISTS "Permitir leitura de system_settings" ON public.system_settings;
CREATE POLICY "Permitir leitura de system_settings" 
    ON public.system_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir leitura e escrita de system_settings" ON public.system_settings;
CREATE POLICY "Permitir leitura e escrita de system_settings" 
    ON public.system_settings FOR ALL USING (true);
