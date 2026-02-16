# REGRA Nº 4: Segurança e Governança

**Status**: ✅ ATIVA
**Versão**: 2.0.0
**Adaptado de**: REGRA_A4, REGRA_A6, REGRA_B2

---

## 🏢 1. ISOLAMENTO MULTI-TENANT (OBRIGATÓRIO)

### Schema de Banco de Dados
Todas, absolutamente TODAS as tabelas de negócio devem ter a coluna `empresa_id` (foreign key para `empresas.id`).

```sql
CREATE TABLE shield_evidencias (
  id UUID PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  -- outros campos
);
```

### Row Level Security (RLS)
Nenhuma query é feita sem filtro de empresa. O RLS deve garantir isso no nível do banco:

```sql
CREATE POLICY "Isolamento Total" ON shield_evidencias
USING (empresa_id IN (SELECT empresa_id FROM usuarios WHERE id = auth.uid()));
```

### Middleware de Identificação
O middleware deve identificar o `slug` da empresa na URL e injetar o `x-empresa-id` no header da requisição, validando se o usuário tem acesso àquela empresa.

---

## 🔐 2. AUTENTICAÇÃO E ONBOARDING

### Fluxo de Signup Automático
Ao criar uma conta:
1. Criar registro na tabela `empresas`.
2. Criar usuário no Supabase Auth.
3. **Logar automaticamente** o usuário (sem esperar confirmação de e-mail para o primeiro acesso), para reduzir fricção no trial.

---

## 🚦 3. RATE LIMITING (Proteção)

Limites definidos por tipo de operação para evitar abuso e custos excessivos de IA:

| Operação | Limite | Janela |
|----------|--------|--------|
| Video Upload (Shield) | 50 | 1 Hora |
| Check-in | 10 | 1 Hora |
| **Análise IA (Custoso)** | **100** | **1 Dia** |
| Relatório Defesa IA | 20 | 1 Dia |
| Agendamento Público | 5 | 1 Hora |

Implementar via `Upstash Redis` ou tabela de controle no Supabase.

---

**Violando esta regra:**
- ❌ Fazer queries sem `where empresa_id = ...` (confiar só no Frontend)
- ❌ Deixar rotas de IA públicas sem rate limit
- ❌ Permitir acesso cruzado entre empresas
