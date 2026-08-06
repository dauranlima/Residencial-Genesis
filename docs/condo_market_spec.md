# Sistema de Classificados e Cupons Hiperlocal para Condomínios (Vibe Coding Spec)

## Visão Geral do Produto
O **viziGO** é uma plataforma web hiperlocal desenvolvida para condomínios residenciais verticais e horizontais. Seu objetivo é resolver duas grandes dores:
1. **Desapego rápido e seguro entre vizinhos:** Classificados de itens usados (móveis, eletrônicos, etc.) sem burocracia, sem frete e com segurança de transação entre moradores do mesmo condomínio.
2. **Engajamento com o Comércio Local:** Vitrine de estabelecimentos locais (petshops, padarias, barbearias, lava-cars) com **cupons de desconto de tempo/quantidade limitados** (promoções relâmpago).

### Diferenciais Chave:
- **Acessibilidade para Público Sênior:** Autenticação sem senha (Magic Link / OTP via WhatsApp) e interface limpa com fontes e botões grandes.
- **Modelo de Negócio B2B2C:** Licenciamento vendido para a administração/síndico do condomínio, monetização secundária opcional com destaques para o comércio local.
- **Arquitetura Multi-tenant:** Isolamento completo de dados por condomínio.

---

## 1. Arquitetura Técnica e Tecnologias
- **Frontend / Backend:** React + Tailwind CSS (para uma interface responsiva, leve e mobile-first) + Supabase (Banco de dados PostgreSQL, Autenticação, Row Level Security e Edge Functions).
- **Banco de Dados Relacional (Supabase/PostgreSQL):** Isolamento por `condominium_id` em todas as tabelas transacionais.

---

## 2. Modelo de Dados (Schema SQL - Supabase / PostgreSQL)

Execute o script SQL abaixo no seu projeto Supabase para estruturar o banco de dados:

```sql
-- Habilitar extensões necessárias
create extension if not exists "uuid-ossp";

-- 1. Condomínios (Tenants)
create table condominiums (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  address text not null,
  city text not null default 'Cascavel',
  state text not null default 'PR',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Perfis de Usuários (Moradores, Comerciantes, Síndicos/Adm)
create type user_role as enum ('resident', 'merchant', 'admin', 'super_admin');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  condominium_id uuid references condominiums(id) on delete cascade not null,
  full_name text not null,
  phone text not null,
  block text, -- Bloco/Torre (opcional para condomínio de casas)
  unit text not null, -- Número do Apto ou Casa
  role user_role default 'resident'::user_role not null,
  is_approved boolean default false not null, -- Aprovação inicial pela gestão do condomínio
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Categorias de Classificados
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  icon text
);

-- 4. Classificados (Vizinho x Vizinho)
create type item_status as enum ('available', 'reserved', 'sold');

create table classifieds (
  id uuid primary key default uuid_generate_v4(),
  condominium_id uuid references condominiums(id) on delete cascade not null,
  seller_id uuid references profiles(id) on delete cascade not null,
  category_id uuid references categories(id) not null,
  title text not null,
  description text not null,
  price decimal(10,2) not null,
  images text[] default '{}',
  status item_status default 'available'::item_status not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Comércios Locais Parceiros
create table local_merchants (
  id uuid primary key default uuid_generate_v4(),
  condominium_id uuid references condominiums(id) on delete cascade not null,
  owner_id uuid references profiles(id) on delete cascade not null,
  business_name text not null,
  category text not null, -- Ex: Petshop, Padaria, Lava-car
  description text,
  logo_url text,
  whatsapp text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Cupons e Promoções Relâmpago
create table coupons (
  id uuid primary key default uuid_generate_v4(),
  merchant_id uuid references local_merchants(id) on delete cascade not null,
  title text not null, -- Ex: "20% OFF na primeira tosa"
  description text not null,
  discount_value text not null, -- Ex: "20% OFF" ou "R$ 15,00"
  total_quantity integer not null, -- Quantidade limitada de cupons
  remaining_quantity integer not null,
  expires_at timestamp with time zone not null, -- Validade da promoção relâmpago
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Resgates de Cupons pelos Moradores
create table coupon_redemptions (
  id uuid primary key default uuid_generate_v4(),
  coupon_id uuid references coupons(id) on delete cascade not null,
  resident_id uuid references profiles(id) on delete cascade not null,
  redemption_code text unique not null, -- Código alfanumérico ou hash único
  is_used boolean default false not null,
  used_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

---

## 3. Requisitos de Experiência do Usuário (UX/UI) & Acessibilidade Sênior

### 3.1. Autenticação Sem Senha (Magic Link / OTP WhatsApp)
- **Tela de Login:** O usuário digita apenas o **Número de Telefone (WhatsApp)** ou **Bloco/Apto**.
- O sistema envia um token numérico de 4 dígitos via API de WhatsApp ou um link mágico.
- Evita retenção baixa de usuários idosos que esquecem senhas com facilidade.

### 3.2. Modo Sênior (Interface Inclusiva)
- Botão visível na barra superior para alternar o **"Modo Sênior"**.
- Ao ativar:
  - O tamanho da fonte base pula de `16px` para `20px` ou `24px`.
  - Os botões de ação ("Comprar", "Pegar Cupom", "Ligar/Chamar no WhatsApp") ficam maiores com áreas de toque estendidas.
  - Layout simplificado em coluna única, eliminando poluição visual.

---

## 4. Escopo do MVP (Foco para Vibe Coding)

Para começar a codificar imediatamente na sua ferramenta de IA de preferência (Lovable, Bolt, Cursor, etc.), siga esta ordem de execução de telas:

1. **Sprint 1: Estrutura Base e Seleção de Condomínio**
   - Tela de boas-vindas com listagem de condomínios parceiros.
   - Tela de cadastro simplificada (Nome, Bloco, Apto, Telefone).
2. **Sprint 2: Módulo de Classificados (Desapego)**
   - Feed de produtos do condomínio com filtros por categoria e busca.
   - Tela de detalhe do produto com botão direto para "Conversar com o Vizinho via WhatsApp".
   - Formulário simples para cadastrar um produto usado (Título, Preço, Fotos, Categoria).
3. **Sprint 3: Módulo de Comércio Local & Cupons Relâmpago**
   - Vitrine de comércios locais parceiros.
   - Listagem de cupons ativos com contagem regressiva de validade e medidor de quantidade restante (ex: *"Apenas 3 cupons restantes!"*).
   - Botão "Resgatar Cupom" gerando um código único para apresentar no estabelecimento.

---

## 5. Próximos Passos de Implementação (Prompt Sugerido)
Use o seguinte comando inicial no seu ambiente de Vibe Coding:
> *"Crie a interface web inicial em React e Tailwind CSS para um sistema de classificados e cupons de condomínios chamado CondoMarket. Quero uma página inicial limpa, com botão para alternar 'Modo Sênior' (fontes grandes), listagem em abas dividida entre 'Desapegos de Vizinhos' e 'Promoções Relâmpago do Comércio Local', além de um modal de cadastro simplificado por Bloco e Apartamento."*
