---
name: Residencial Gênesis - System & Landing Page Design System
colors:
  primary: "#1B2A4A"
  primary-dark: "#0F172A"
  primary-light: "#2C3E66"
  accent: "#E5A93C"
  accent-light: "#F5C369"
  neutral-bg: "#F8FAFC"
  card-bg: "#FFFFFF"
  card-dark-bg: "#0F172A"
  text-heading: "#0F172A"
  text-body: "#475569"
  text-muted: "#94A3B8"
  border: "#E2E8F0"
typography:
  h1:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.15
  h2:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.25
  h3:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.4
  body-md:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: 6px
  md: 12px
  lg: 20px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  2xl: 80px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: 12px 24px
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.primary-dark}"
    rounded: "{rounded.md}"
    padding: 12px 24px
  card-feature:
    backgroundColor: "{colors.card-bg}"
    rounded: "{rounded.lg}"
    padding: 24px
---

# Residencial Gênesis - Visual Design System

## Overview
Design system premium e moderno para o Sistema de Gestão Condominial **Residencial Gênesis**.
A estética combina autoridade e confiança através do **Navy Blue (#1B2A4A)** com a elegância e destaque do **Dourado Ouro (#E5A93C)**, sobre fundos limpos e de alto contraste.

## Colors
- **Primary Navy (#1B2A4A):** Cor institucional para cabeçalhos, navegação e blocos de destaque.
- **Accent Gold (#E5A93C):** Usado para chamadas de ação (CTA), destaques, badges e elementos interativos de alta prioridade.
- **Dark Navy (#0F172A):** Usado no card de destaque escuro e rodapé.
- **Neutral Light (#F8FAFC):** Fundo limpo para proporcionar fluidez e legibilidade.

## Layout & Components
- Navbar fixa com efeito glassmorphism (`backdrop-blur-md`).
- Hero section em grid 2 colunas com card mockup 3D do painel.
- Cards de módulos com ícones Lucide e suporte a abas interativas no showcase ("Veja por dentro").
- Tabela de preços responsiva com toggle Mensal/Anual e destaque visual para o Plano Profissional.
- Modal de Lead/Demonstração responsivo com validação.
