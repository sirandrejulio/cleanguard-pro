# ⚠️ PROTOCOLO OBRIGATÓRIO: CRIAÇÃO DE DOCUMENTOS

**Status**: 🔴 OBRIGATÓRIO  
**Aplicável a**: TODOS os novos documentos  
**Data de Vigência**: 16/02/2026

---

## 🎯 REGRA DE OURO

```
╔═══════════════════════════════════════════════════════════════╗
║                                                                ║
║  ⚠️  ANTES DE CRIAR QUALQUER DOCUMENTO NOVO:                  ║
║                                                                ║
║  1. IDENTIFIQUE o tipo de documento                           ║
║  2. DETERMINE a pasta correta                                 ║
║  3. SIGA o template da pasta                                  ║
║  4. ATUALIZE os índices                                       ║
║                                                                ║
║  ❌ NUNCA crie documentos soltos em docs/                     ║
║  ❌ NUNCA crie sem consultar este protocolo                   ║
║                                                                ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 📋 FLUXO OBRIGATÓRIO DE CRIAÇÃO

### PASSO 1: IDENTIFICAR O TIPO ⚠️ OBRIGATÓRIO

Antes de criar, pergunte-se:

```
┌─────────────────────────────────────────────────────────────┐
│ QUAL É A NATUREZA DO DOCUMENTO?                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ [ ] É um índice ou mapa de navegação?                       │
│     → docs/indices/                                          │
│                                                              │
│ [ ] É um guia ou tutorial?                                  │
│     → docs/guias/                                            │
│                                                              │
│ [ ] É um resumo executivo para stakeholders?                │
│     → docs/executivo/                                        │
│                                                              │
│ [ ] É uma entrega formal de fase/milestone?                 │
│     → docs/entregas/                                         │
│                                                              │
│ [ ] É uma conclusão/retrospectiva de fase?                  │
│     → docs/conclusoes/                                       │
│                                                              │
│ [ ] É uma regra técnica ou diretriz?                        │
│     → docs/regras/                                           │
│                                                              │
│ [ ] É documentação de funcionalidade específica?            │
│     → docs/modulos/                                          │
│                                                              │
│ [ ] É um relatório de implementação?                        │
│     → docs/relatorios/                                       │
│                                                              │
│ [ ] É um template ou exemplo de código?                     │
│     → docs/testes/                                           │
│                                                              │
│ [ ] É um documento de status/configuração do sistema?       │
│     → docs/ (raiz) - APENAS: ESTRUTURA_DOCUMENTACAO.md,     │
│                      STATUS_SISTEMA.md,                      │
│                      PROTOCOLO_CRIACAO_DOCUMENTOS.md,        │
│                      SYSTEM_COMPONENTS_REGISTRY.json         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### PASSO 2: VERIFICAR PASTA ⚠️ OBRIGATÓRIO

Consulte a tabela de decisão:

| Se o documento é... | Pasta correta | Exemplo |
|---------------------|---------------|---------|
| Índice/Mapa | `docs/indices/` | INDICE_VISUAL.md |
| Guia/Tutorial | `docs/guias/` | GUIA_RAPIDO.md |
| Resumo Executivo | `docs/executivo/` | RESUMO_MVP.md |
| Entrega de Fase | `docs/entregas/` | ENTREGA_FASE_1.md |
| Conclusão de Fase | `docs/conclusoes/` | RETROSPECTIVA_MVP.md |
| Regra Técnica | `docs/regras/` | REGRA_01_DESIGN.md |
| Módulo Funcional | `docs/modulos/` | auth/LOGIN_FLOW.md |
| Relatório Técnico | `docs/relatorios/` | RELATORIO_SUPABASE.md |
| Template/Exemplo | `docs/testes/` | TEMPLATE_COMPONENTE.tsx |

### PASSO 3: SEGUIR TEMPLATE ⚠️ OBRIGATÓRIO

1. Abra o `README.md` da pasta escolhida (se existir)
2. Copie o template fornecido
3. Preencha todas as seções obrigatórias
4. Siga as convenções de nomenclatura

### PASSO 4: ATUALIZAR ÍNDICES ⚠️ OBRIGATÓRIO

Após criar o documento, atualize:

```
✅ OBRIGATÓRIO ATUALIZAR:
├── docs/indices/INDICE_MASTER.md
│   └── Adicionar link na seção apropriada
│
├── docs/ESTRUTURA_DOCUMENTACAO.md
│   └── Confirmar se a estrutura reflete o novo doc (se for estrutural)
│
└── docs/STATUS_SISTEMA.md (se aplicável)
    └── Atualizar estatísticas de documentação
```

---

## 🚫 DOCUMENTOS PROIBIDOS EM docs/ (RAIZ)

A pasta `docs/` (raiz) deve conter **APENAS**:

### ✅ PERMITIDOS (Lista Fechada)
```
docs/
├── ESTRUTURA_DOCUMENTACAO.md          ✅ Guia de organização
├── PROTOCOLO_CRIACAO_DOCUMENTOS.md    ✅ Este arquivo
├── STATUS_SISTEMA.md                  ✅ Status do sistema
└── SYSTEM_COMPONENTS_REGISTRY.json    ✅ Registro de componentes
```

*Nota: O `BEM_VINDO.md` fica na raiz do projeto, fora de `docs/`.*

### ❌ PROIBIDOS (Vão para Pastas Específicas)
```
❌ Guias → docs/guias/
❌ Índices → docs/indices/
❌ Resumos → docs/executivo/
❌ Regras → docs/regras/
❌ Módulos → docs/modulos/
❌ Relatórios → docs/relatorios/
```

---

## 📐 CONVENÇÕES DE NOMENCLATURA

### Formato Geral
```
[TIPO]_[CONTEXTO]_[DETALHES].md
```

### Por Tipo de Documento

**Guias**:
```
GUIA_[TEMA].md ou ONBOARDING_[PERFIL].md
Exemplo: GUIA_DEPLOY.md, ONBOARDING_DEV.md
```

**Regras**:
```
REGRA_[NUMERO]_[TEMA].md
Exemplo: REGRA_04_SEGURANCA.md
```

**Módulos**:
```
[CAMEL_CASE] ou [SNAKE_CASE] descritivo dentro da pasta do módulo
Exemplo: docs/modulos/auth/login_flow.md
```

---

## ✅ CHECKLIST OBRIGATÓRIO

Antes de criar qualquer documento, verifique:

```
CHECKLIST DE CRIAÇÃO DE DOCUMENTO
═══════════════════════════════════════════════════════════

PRÉ-CRIAÇÃO:
□ Consultei este protocolo
□ Identifiquei o tipo de documento
□ Determinei a pasta correta
□ Verifiquei que NÃO vai para docs/ (raiz)

DURANTE CRIAÇÃO:
□ Usei nomenclatura correta (MAIÚSCULAS_COM_UNDERSCORES para arquivos principais)
□ Adicionei data e status
□ Incluí links de navegação

PÓS-CRIAÇÃO:
□ Atualizei docs/indices/INDICE_MASTER.md (se existir)
□ Revisei ortografia e formatação
```

---

## 🔍 ÁRVORE DE DECISÃO RÁPIDA

```
PRECISO CRIAR UM DOCUMENTO NOVO
        │
        ▼
    É uma regra
    técnica?
        │
    ┌───┴───┐
    │       │
   SIM     NÃO
    │       │
    ▼       ▼
docs/regras/  É um guia?
            │
        ┌───┴───┐
        │       │
       SIM     NÃO
        │       │
        ▼       ▼
    docs/guias/  É sobre uma
                feature específica?
                    │
                ┌───┴───┐
                │       │
               SIM     NÃO
                │       │
                ▼       ▼
        docs/modulos/  docs/executivo/,
                        docs/entregas/,
                        docs/relatorios/
```

---

## ⚠️ CONSEQUÊNCIAS DE NÃO SEGUIR

- ❌ Documentação desorganizada
- ❌ Dificuldade em encontrar informações críticas
- ❌ Onboarding lento para novos devs

---

**Mantido por**: Equipe Clean Guard Pro  
**Última Revisão**: 16/02/2026

---

**ESTE PROTOCOLO É OBRIGATÓRIO PARA GARANTIR A QUALIDADE DO PROJETO**
