-- ==============================================================================
-- SCHEMA SUPABASE: TABELA SYSTEM_PAGES (CONTROLE DE STATUS DAS TELAS DO SISTEMA)
-- Executar este SQL no SQL Editor do Supabase para criar a tabela de persistência.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.system_pages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    path TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT true,
    is_core BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.system_pages ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público para leitura e alteração pelo Super Admin
DROP POLICY IF EXISTS "Permitir leitura publica de system_pages" ON public.system_pages;
CREATE POLICY "Permitir leitura publica de system_pages" 
    ON public.system_pages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir leitura e escrita de system_pages" ON public.system_pages;
CREATE POLICY "Permitir leitura e escrita de system_pages" 
    ON public.system_pages FOR ALL USING (true);

-- Inserção inicial das telas padrão do sistema
INSERT INTO public.system_pages (id, name, path, description, category, enabled, is_core) VALUES
    ('condo-market', 'viziGO (CondoMarket)', '/vizigo', 'Portal principal de compras, anúncios e mercado do condomínio.', 'Principal', true, false),
    ('localizacao', 'Localização & Mapa', '/localizacao', 'Mapa de localização e endereço do condomínio.', 'Principal', false, false),
    ('admin', 'Painel Gestão (Admin)', '/admin', 'Dashboard de gestão de moradores, recados e autorizações do síndico.', 'Gestão', false, false),
    ('avisos', 'Mural de Avisos & Comunicados', '/avisos', 'Comunicados oficiais, avisos urgentes e notícias da gestão.', 'Morador', false, false),
    ('apartamentos', 'Apartamentos & Unidades', '/apartamentos', 'Listagem e cadastro dos apartamentos e seus ocupantes.', 'Gestão', false, false),
    ('ficha-cadastral', 'Ficha Cadastral do Morador', '/ficha-cadastral', 'Formulário de recadastramento e registro de moradores.', 'Cadastros', false, false),
    ('ficha-fiador', 'Ficha do Fiador', '/ficha-fiador', 'Formulário de cadastro de garantia e informações de fiador.', 'Cadastros', false, false),
    ('garagem', 'Controle de Garagem & Vagas', '/garagem', 'Mapeamento das vagas de estacionamento e placas de veículos.', 'Gestão', false, false),
    ('galeria', 'Galeria de Fotos', '/galeria', 'Fotos das áreas comuns, eventos e benfeitorias.', 'Morador', false, false),
    ('solicitacoes', 'Solicitações & Ocorrências', '/solicitacoes', 'Abertura de chamados de manutenção e sugestões.', 'Morador', false, false),
    ('vistoria', 'Vistoria de Imóvel', '/vistoria', 'Laudo e conferência de estado do apartamento.', 'Gestão', false, false),
    ('regimento', 'Regimento Interno & Documentos', '/regimento', 'Regras de convivência, atas e convenção do condomínio.', 'Morador', false, false),
    ('outros-imoveis', 'Outros Imóveis', '/outros-imoveis', 'Listagem de unidades secundárias ou parceiras.', 'Principal', false, false),
    ('login', 'Login de Morador', '/login', 'Autenticação dos moradores no sistema.', 'Principal', true, false),
    ('super-admin', 'Super Admin Dashboard', '/super-admin', 'Painel principal Root de configurações e infraestrutura.', 'Gestão', true, true),
    ('adm-login', 'Login Super Admin', '/adm-login', 'Autenticação dos administradores de nível Root.', 'Gestão', true, true)
ON CONFLICT (id) DO NOTHING;
