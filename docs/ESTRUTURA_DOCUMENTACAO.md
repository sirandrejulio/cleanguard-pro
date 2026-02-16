# 📁 ESTRUTURA DA DOCUMENTAÇÃO - CLEAN GUARD PRO

**Última Atualização**: 16/02/2026  
**Status**: ✅ ORGANIZADA

Este documento explica a estrutura completa de pastas e onde cada tipo de documento deve ser colocado no projeto Clean Guard Pro.

---

## 🗂️ ESTRUTURA DE PASTAS

```
CLEANGUARD-PRO/
│
├── 📄 BEM_VINDO.md (Introdução e Guia Rápido - Antigo README)
│
├── 📂 docs/ (Toda a documentação)
│   │
│   ├── 📄 ESTRUTURA_DOCUMENTACAO.md (Este arquivo)
│   ├── 📄 STATUS_SISTEMA.md (Status atual do MVP e Fases)
│   ├── 📄 SYSTEM_COMPONENTS_REGISTRY.json (Registro de componentes UI/Logic)
│   │
│   ├── 📂 indices/
│   │   ├── 📄 README.md
│   │   ├── 📄 INDICE_MASTER.md (Índice completo)
│   │   ├── 📄 INDICE_VISUAL.md (Navegação visual por módulos)
│   │   └── 📄 MAPA_VISUAL_COMPLETO.md (Mapa de rotas e fluxos)
│   │
│   ├── 📂 guias/
│   │   ├── 📄 README.md
│   │   ├── 📄 ONBOARDING_DESENVOLVEDOR.md (Configuração de ambiente)
│   │   ├── 📄 GUIA_RAPIDO.md (Comandos essenciais: npm run dev, etc.)
│   │   └── 📄 COMO_USAR.md (Guia de uso do sistema)
│   │
│   ├── 📂 executivo/
│   │   ├── 📄 README.md
│   │   ├── 📄 RESUMO_EXECUTIVO_STAKEHOLDERS.md (Visão de negócio)
│   │   └── 📄 RESUMO_IMPLEMENTACAO_MVP.md (Escopo do MVP)
│   │
│   ├── 📂 entregas/
│   │   ├── 📄 README.md
│   │   ├── 📄 ENTREGA_FINAL_FASE_1.md (MVP Fundações)
│   │   └── 📄 ROADMAP_FASE_2.md (Planejamento Rotas e Financeiro)
│   │
│   ├── 📂 conclusoes/
│   │   ├── 📄 README.md
│   │   ├── 📄 RETROSPECTIVA_MVP.md (Lições aprendidas)
│   │   └── 📄 ANALISE_PERFORMANCE.md (Métricas do sistema)
│   │
│   ├── 📂 regras/ (Regras e Diretrizes do Sistema)
│   │   ├── 📄 README.md (Índice de regras)
│   │   ├── 📄 REGRA_01_DESIGN_SYSTEM.md (Shadcn/UI + Tailwind)
│   │   ├── 📄 REGRA_02_ARQUITETURA_SISTEMA.md (Frontend + Supabase)
│   │   ├── 📄 REGRA_03_GESTAO_ESTADO.md (React Query + Contexts)
│   │   ├── 📄 REGRA_04_SEGURANCA_ROW_LEVEL.md (RLS e Auth)
│   │   ├── 📄 REGRA_05_DADOS_MODELAGEM.md (Schema do Banco)
│   │   ├── 📄 REGRA_06_PERFORMANCE_EQUIPE.md (KPIs e Métricas)
│   │   ├── 📄 REGRA_07_INTEGRACAO_IA.md (Otimização de Rotas/Insights)
│   │   ├── 📄 REGRA_08_DIRETRIZES_USO.md (Boas práticas)
│   │   ├── 📄 REGRA_09_BACKUP_RECUPERACAO.md
│   │   └── 📄 REGRA_10_SUPORTE_SLA.md
│   │
│   ├── 📂 modulos/ (Documentação por Módulo Funcional)
│   │   ├── 📂 auth/ (Autenticação e Perfis)
│   │   ├── 📂 operations/ (Jobs, Teams, Customers)
│   │   ├── 📂 finance/ (Precificação, Faturas)
│   │   ├── 📂 intelligence/ (Rotas, Analytics)
│   │   └── 📂 shield/ (Evidências, Disputas)
│   │
│   ├── 📂 relatorios/ (Relatórios de implementação)
│   │   ├── RELATORIO_IMPLEMENTACAO_AUTH.md
│   │   ├── RELATORIO_CONEXAO_SUPABASE.md
│   │   ├── RELATORIO_TESTE_CARGA.md
│   │   └── RELATORIO_SEGURANCA_AUDIT.md
│   │
│   └── 📂 testes/ (Templates e testes)
│       ├── TEMPLATE_PAGINA.tsx
│       └── TEMPLATE_COMPONENTE.tsx
│
└── 📂 src/ (Código fonte)
    └── [estrutura de código React/Vite]
```

---

## 📋 ONDE COLOCAR CADA TIPO DE DOCUMENTO

### 📊 Documentos Executivos
**Pasta**: `docs/executivo/`

**Quando usar**:
- Visão de negócio e produto
- Definição de escopo do MVP
- Relatórios de progresso para stakeholders

**Exemplos**:
- `RESUMO_EXECUTIVO_STAKEHOLDERS.md`
- `RESUMO_IMPLEMENTACAO_MVP.md`

---

### 📦 Entregas e Roadmap
**Pasta**: `docs/entregas/`

**Quando usar**:
- Definição de milestones
- Checklists de entrega de versão
- Planejamento de próximas fases

**Exemplos**:
- `ENTREGA_FINAL_FASE_1.md`
- `ROADMAP_FASE_2.md`

---

### 📚 Guias e Tutoriais
**Pasta**: `docs/guias/`

**Quando usar**:
- Setup de ambiente de desenvolvimento
- Documentação de uso das APIs internas
- Guias de deploy

**Exemplos**:
- `ONBOARDING_DESENVOLVEDOR.md`
- `GUIA_RAPIDO.md`

---

### 📋 Regras e Diretrizes Técnicas
**Pasta**: `docs/regras/`

**Quando usar**:
- Padrões de código e arquitetura
- Definições de segurança (RLS)
- Modelagem de dados

**Exemplos**:
- `REGRA_01_DESIGN_SYSTEM.md`
- `REGRA_04_SEGURANCA_ROW_LEVEL.md`

---

### 📦 Documentação por Módulo
**Pasta**: `docs/modulos/`

**Quando usar**:
- Documentação específica de funcionalidades de negócio
- Fluxos de usuário por área (Ex: Como funciona o cálculo de rota)

**Estrutura**:
- `docs/modulos/auth/`
- `docs/modulos/operations/`

---

## 🆕 CRIANDO NOVOS DOCUMENTOS

### Passo 1: Identificar o Tipo
Pergunte-se:
- É estratégico/negócio? → `docs/executivo/`
- É sobre o cronograma? → `docs/entregas/`
- É um guia prático? → `docs/guias/`
- É uma regra técnica? → `docs/regras/`
- É sobre uma feature específica? → `docs/modulos/`

### Passo 2: Padronização
- Use Markdown (.md)
- Mantenha o cabeçalho padrão com Data e Status
- Atualize os índices relevantes

---

## 📐 CONVENÇÕES DE NOMENCLATURA

### Regras
```
REGRA_[NUMERO]_[TEMA].md
Exemplo: REGRA_05_DADOS_MODELAGEM.md
```

### Relatórios
```
RELATORIO_[TIPO]_[CONTEXTO].md
Exemplo: RELATORIO_CONEXAO_SUPABASE.md
```

### Guias
```
GUIA_[TEMA].md ou [NOME]_[TIPO].md
Exemplo: GUIA_DEPLOY.md
```

---

## ✅ CHECKLIST DE ORGANIZAÇÃO

Ao criar novo documento:
- [ ] Identificou o tipo correto
- [ ] Colocou na pasta apropriada
- [ ] Atualizou `docs/ESTRUTURA_DOCUMENTACAO.md` se criou nova pasta
- [ ] Manteve o padrão de links relativos

---

## 📞 DÚVIDAS

Se não souber onde colocar um documento:
1. Consulte este arquivo
2. Verifique documentos similares na pasta `docs/`
3. Em caso de dúvida, use `docs/guias/` temporariamente

---

**Mantido por**: Equipe Clean Guard Pro  
**Última Revisão**: 16/02/2026

---

**LEMBRE-SE**: Organização gera agilidade. Mantenha a documentação viva e útil!
