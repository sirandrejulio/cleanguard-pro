# 🛡️ BEM-VINDO AO CLEAN GUARD PRO

```
   ________    _______    ________   ________      
  |\   ____\  |\  ___ \  |\   ____\ |\   ____\     
  \ \  \___|  \ \   __/| \ \  \___| \ \  \___|     
   \ \  \      \ \  \_|/__\ \  \  __ \ \  \____    
    \ \  \____  \ \  \_|\ \\ \  \|\  \\ \  ___  \  
     \ \_______\ \ \_______\\ \_______\\ \_______\ 
      \|_______|  \|_______| \|_______| \|_______| 
                                                   
              GESTÃO OPERACIONAL INTELIGENTE
                   Versão 0.1.0 (MVP)
```

---

## 🎯 O QUE É O CLEAN GUARD PRO?

Sistema SaaS integrado para gestão de serviços de limpeza e segurança, focado em eficiência operacional e transparência:
- 👥 **Gestão de Equipes**: Controle de times, membros e atribuições.
- 🗺️ **Otimização de Rotas**: Planejamento inteligente de trajetos diários.
- 🛡️ **Clean Guard Shield**: Sistema de evidências e resolução de disputas.
- 💰 **Motor de Precificação**: Orçamentos dinâmicos e precisos.
- 📊 **Analytics em Tempo Real**: Monitoramento de KPIs e performance.

---

## ✅ STATUS ATUAL

**FASE 1: FUNDAÇÕES & MVP** → 🚧 EM DESENVOLVIMENTO

- ✅ Autenticação (Login/Signup/Reset)
- ✅ Dashboard Principal
- ✅ Integração Supabase (Banco de Dados + Auth)
- ✅ Monitoramento em Tempo Real (`/supabase-test`)
- ✅ Design System (Shadcn/UI + Tailwind)
- 🚧 Módulo de Rotas
- 🚧 Módulo Financeiro

**Sistema funcional e conectado à nuvem!**

---

## 🚀 COMEÇAR AGORA

### 1. Instalar Dependências
```bash
npm install
```

### 2. Iniciar Servidor
```bash
npm run dev
```
Acesse: http://localhost:8080/

### 3. Verificar Conexão
Acesse a página de diagnóstico: http://localhost:8080/supabase-test

---

## 📚 DOCUMENTAÇÃO TÉCNICA

### 🎨 Design System
Utilizamos **Shadcn/UI** com **Tailwind CSS**.
- **Framework**: React + Vite
- **Estilização**: Tailwind (`tailwind.config.ts`)
- **Ícones**: Lucide React
- **Tema**: Dark Mode predominante com acentos Violet/Emerald.

### 🏗️ Arquitetura
- **`src/pages/`**: Rotas da aplicação (Dashboard, Jobs, Customers).
- **`src/components/`**: Componentes reutilizáveis (UI, Layouts).
- **`src/integrations/supabase/`**: Cliente e tipos gerados do banco de dados.
- **`src/hooks/`**: Contextos globais (Auth, Theme).

### 🔐 Segurança & Dados
- **Autenticação**: Supabase Auth (JWT).
- **RLS (Row Level Security)**: Políticas de segurança ativas no banco de dados.
- **Tipagem**: TypeScript estrito com tipos gerados automaticamente (`database.types.ts`).

---

## 🎯 PRÓXIMOS PASSOS

### Você é...

**👨💻 Desenvolvedor?**
→ Verifique `task.md` para tarefas pendentes.
→ Monitore `SupabaseTest.tsx` para saúde do sistema.

**👨💼 Gestor?**
→ Acompanhe o `Dashboard` para métricas.
→ Gerencie equipes em `TeamsPage`.

---

## 📊 NÚMEROS DO PROJETO

```
📋 Tabelas de Banco ............... 10+
📄 Páginas Implementadas .......... 15+
🔧 Componentes UI ................. 40+
🚀 Performance .................... Otimizada (Vite)
```

---

## ⚠️ REGRAS IMPORTANTES

### ✅ SEMPRE
- Reutilizar componentes do diretório `src/components/ui`.
- Manter a tipagem TypeScript estrita.
- Testar conexões com o banco de dados antes de deploy.

### ❌ NUNCA
- Expor chaves de API secretas (apenas Anon Key é permitida no cliente).
- Commitar diretamente na `main` sem revisão.

---

## 🎉 VAMOS COMEÇAR!

```
1. npm run dev          → Iniciar a revolução operacional
2. Check Supabase       → Garantir conectividade
3. Code & Ship          → Entregar valor
```

---

**Bem-vindo à equipe Clean Guard Pro!** 🛡️

**Status**: 🟢 ONLINE & OPERACIONAL

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  🚀 SISTEMA PRONTO PARA ESCALAR                         │
│                                                         │
│  Eficiência e Segurança em Primeiro Lugar.             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```
