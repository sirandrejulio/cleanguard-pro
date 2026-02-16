# 🚨 REGRA CRÍTICA: Organização Automática de Documentos

**Data de Criação:** 16/02/2026  
**Prioridade:** CRÍTICA  
**Categoria:** Organização de Arquivos  
**Status:** OBRIGATÓRIA

---

## 📋 CONTEXTO

Esta regra foi criada para garantir que TODOS os documentos criados sejam automaticamente organizados em suas pastas corretas, mantendo o projeto **Clean Guard Pro** limpo e profissional.

---

## 🎯 PRINCÍPIO FUNDAMENTAL

**NUNCA DEIXE DOCUMENTOS SOLTOS NA RAIZ DO PROJETO**

Todo documento `.md` e `.sql` criado DEVE ser imediatamente movido para sua pasta apropriada.

---

## 📁 ESTRUTURA DE PASTAS E CATEGORIAS

### Documentos Markdown (.md)

| Prefixo/Tipo | Pasta de Destino | Exemplos |
|--------------|------------------|----------|
| `ACAO_*.md` | `docs/acoes/` | ACAO_IMEDIATA.md |
| `APLICAR_*.md` | `docs/acoes/` | APLICAR_AGORA.md |
| `EXECUTAR_*.md` | `docs/acoes/` | EXECUTAR_AGORA.md |
| `FAZER_*.md` | `docs/acoes/` | FAZER_AGORA.md |
| `CRIAR_*.md` | `docs/acoes/` | CRIAR_COMPONENTE.md |
| `RESOLVER_*.md` | `docs/acoes/` | RESOLVER_BUG.md |
| `AUDITORIA_*.md` | `docs/auditorias/` | AUDITORIA_SEGURANCA.md |
| `CONCLUSAO_*.md` | `docs/conclusoes/` | CONCLUSAO_MVP.md |
| `CORRECAO_*.md` | `docs/correcoes/` | CORRECAO_LOGIN.md |
| `DIAGRAMA_*.md` | `docs/diagramas/` | DIAGRAMA_ER.md |
| `ENTREGA_*.md` | `docs/entregas/` | ENTREGA_FASE_1.md |
| `RESUMO_*.md` | `docs/executivo/` | RESUMO_STATUS.md |
| `FASE_*.md` | `docs/fases/` | FASE_1_DETALHES.md |
| `GUIA_*.md` | `docs/guias/` | GUIA_SETUP.md |
| `COMO_*.md` | `docs/guias/` | COMO_USAR_SUPABASE.md |
| `PASSOS_*.md` | `docs/guias/` | PASSOS_DEPLOY.md |
| `IMPLEMENTACAO_*.md` | `docs/implementacoes/` | IMPLEMENTACAO_AUTH.md |
| `SISTEMA_*.md` | `docs/implementacoes/` | SISTEMA_ROTAS.md |
| `INDICE_*.md` | `docs/indices/` | INDICE_GERAL.md |
| `MAPA_*.md` | `docs/indices/` | MAPA_SITE.md |
| `PLANO_*.md` | `docs/planos/` | PLANO_TESTES.md |
| `PROXIMOS_*.md` | `docs/planos/` | PROXIMOS_PASSOS.md |
| `RELATORIO_*.md` | `docs/relatorios/` | RELATORIO_PERFORMANCE.md |
| `ANALISE_*.md` | `docs/relatorios/` | ANALISE_METRICAS.md |
| `STATUS_*.md` | `docs/status/` | STATUS_SEMANAL.md |
| `TESTE_*.md` | `docs/testes/` | TESTE_CARGA.md |
| `VALIDACAO_*.md` | `docs/validacoes/` | VALIDACAO_MVP.md |
| `CHECKLIST_*.md` | `docs/validacoes/` | CHECKLIST_DEPLOY.md |
| `CONFORMIDADE_*.md` | `docs/conformidade/` | CONFORMIDADE_LGPD.md |
| `REGRA_*.md` | `docs/regras/` | REGRA_01_DESIGN.md |

### Arquivos SQL (.sql)

| Prefixo/Tipo | Pasta de Destino | Exemplos |
|--------------|------------------|----------|
| `*_migration.sql` | `supabase/migrations/` | 20260216_init.sql |
| `DIAGNOSTICO_*.sql` | `supabase/diagnosticos/` | DIAGNOSTICO_RLS.sql |
| `CORRIGIR_*.sql` | `supabase/correcoes/` | CORRIGIR_POLICY.sql |
| `DELETAR_*.sql` | `supabase/acoes/` | DELETAR_USER.sql |
| `LIMPAR_*.sql` | `supabase/acoes/` | LIMPAR_LOGS.sql |
| `EXECUTAR_*.sql` | `supabase/acoes/` | EXECUTAR_MIGRATE.sql |
| `VERIFICAR_*.sql` | `supabase/validacoes/` | VERIFICAR_TABLES.sql |
| `QUERIES_*.sql` | `supabase/queries/` | QUERIES_ANALYTICS.sql |
| `CREATE_*.sql` | `supabase/scripts/` | CREATE_VIEW.sql |
| `ATUALIZAR_*.sql` | `supabase/scripts/` | ATUALIZAR_TRIGGER.sql |
| `seed.sql` | `supabase/` | seed.sql (mantém na raiz) |

---

## 🔧 COMANDO DE ORGANIZAÇÃO AUTOMÁTICA (PowerShell)

Use este snippet para organizar rapidamente seus arquivos:

```powershell
# AÇÕES
Move-Item -Path "ACAO_*.md", "APLICAR_*.md", "EXECUTAR_*.md", "FAZER_*.md", "CRIAR_*.md", "RESOLVER_*.md" -Destination "docs/acoes/" -Force -ErrorAction SilentlyContinue

# DOCUMENTOS
Move-Item -Path "AUDITORIA_*.md" -Destination "docs/auditorias/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "CONCLUSAO_*.md" -Destination "docs/conclusoes/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "CORRECAO_*.md", "TODAS_*.md" -Destination "docs/correcoes/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "DIAGRAMA_*.md" -Destination "docs/diagramas/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "ENTREGA_*.md" -Destination "docs/entregas/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "RESUMO_*.md" -Destination "docs/executivo/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "FASE_*.md" -Destination "docs/fases/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "GUIA_*.md", "COMO_*.md", "PASSO_*.md", "PASSOS_*.md", "DEPLOY_*.md" -Destination "docs/guias/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "IMPLEMENTACAO_*.md", "SISTEMA_*.md" -Destination "docs/implementacoes/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "INDICE_*.md", "MAPA_*.md" -Destination "docs/indices/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "PLANO_*.md", "PROXIMOS_*.md" -Destination "docs/planos/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "RELATORIO_*.md", "ANALISE_*.md", "DOCUMENTACAO_*.md" -Destination "docs/relatorios/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "STATUS_*.md", "PROGRESSO_*.md" -Destination "docs/status/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "TESTE_*.md", "CLIQUE_*.md" -Destination "docs/testes/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "VALIDACAO_*.md", "VERIFICACAO_*.md", "CHECKLIST_*.md" -Destination "docs/validacoes/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "CONFORMIDADE_*.md" -Destination "docs/conformidade/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "REGRA_*.md" -Destination "docs/regras/" -Force -ErrorAction SilentlyContinue

# SQL
New-Item -ItemType Directory -Path "supabase/diagnosticos", "supabase/correcoes", "supabase/acoes", "supabase/validacoes", "supabase/queries", "supabase/scripts" -Force -ErrorAction SilentlyContinue
Move-Item -Path "DIAGNOSTICO_*.sql" -Destination "supabase/diagnosticos/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "CORRIGIR_*.sql" -Destination "supabase/correcoes/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "DELETAR_*.sql", "LIMPAR_*.sql", "EXECUTAR_*.sql", "EMERGENCIA_*.sql" -Destination "supabase/acoes/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "VERIFICAR_*.sql" -Destination "supabase/validacoes/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "QUERIES_*.sql" -Destination "supabase/queries/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "CREATE_*.sql", "ATUALIZAR_*.sql" -Destination "supabase/scripts/" -Force -ErrorAction SilentlyContinue
```

---

## 🎯 DOCUMENTOS PERMITIDOS NA RAIZ

**APENAS 2 documentos principais podem ficar na raiz do projeto:**

1. ✅ `README.md` (ou `BEM_VINDO.md`) - Índice principal
2. ✅ `.LEIA_ME_IMPORTANTE.md` - Porta de entrada e instruções críticas

*Nota: Arquivos de configuração (.env, package.json, etc.) permanecem na raiz.*

**TODOS os outros documentos DEVEM estar em pastas apropriadas dentro de `docs/`!**

---

## ✅ VALIDAÇÃO

Esta regra deve ser aplicada:
- ✓ Ao criar qualquer documento novo
- ✓ Ao finalizar cada sessão de trabalho
- ✓ Antes de cada commit

---

## 🚨 CONSEQUÊNCIAS DE NÃO SEGUIR

- ❌ Projeto desorganizado
- ❌ Difícil encontrar documentos
- ❌ Confusão na manutenção

---

**Prioridade:** CRÍTICA  
**Penalidade por não seguir:** Desorganização e perda de produtividade.

**Mantenha o Clean Guard Pro limpo!** 🧹🛡️
