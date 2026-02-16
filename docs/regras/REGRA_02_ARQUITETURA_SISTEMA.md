# REGRA Nº 2: Arquitetura de Sistema

**Status**: ✅ ATIVA
**Versão**: 2.0.0
**Adaptado de**: REGRA_A3, REGRA_B1, REGRA_B3, REGRA_C2

---

## 🏗️ 1. ESTRUTURA DE PASTAS OBRIGATÓRIA

```
src/
├── app/                          # Next.js App Router (ou equivalente React Router)
│   ├── (auth)/                   # Autenticação
│   ├── (dashboard)/              # Painel Principal
│   │   ├── shield/               # Módulo Proteção
│   │   ├── rota/                 # Módulo Rotas
│   │   ├── fill/                 # Módulo Monetização
│   │   └── ...
│   └── api/                      # API Routes / Edge Functions
│
├── components/                   # Componentes React
│   ├── ui/                       # Shadcn/UI (Base)
│   ├── layout/                   # Header, Footer, Sidebar
│   ├── shield/                   # Específicos do Módulo SHIELD
│   ├── route/                    # Específicos do Módulo ROUTE
│   └── shared/                   # Compartilhados
│
└── lib/                          # Utilitários
    ├── supabase/
    ├── ai/
    ├── logs/
    └── security/
```

### Regra de Ouro da Arquitetura
**NUNCA MISTURAR COMPONENTES DE DOMÍNIO.**
Componentes de "Proteção" ficam em `components/shield/`. Componentes de "Rota" ficam em `components/route/`. Não misture responsabilidades.

---

## 🔗 2. CONVENÇÃO DE URLs

### URLs Limpas e em Português
Todas as rotas devem ser amigáveis e localizadas:

✅ **CORRETO**:
- `/empresa/minha-limpeza/shield/evidencias`
- `/rota/otimizador`
- `/fill/lista-espera`
- `/agendar/cliente-x`

❌ **ERRADO**:
- `/company/my-cleaning/evidence-list`
- `/route/optimizer`
- `/dashboard/jobs?type=waiting` (Prefira urls explícitas quando possível)

### Rewrites (Middleware)
Utilizar rewrites para mascarar parâmetros técnicos:
- `/agendar/:slug` -> `/public/book?slug=:slug`
- `/aprovar/:token` -> `/public/approve?token=:token`

---

## 📝 3. SISTEMA DE LOGS

### Estrutura de Log Obrigatória
Todo log deve ser estruturado via `createLog` (lib/logs/system-logs.ts):

```typescript
export enum LogCategory {
  AUTH = 'auth',
  SHIELD = 'shield',
  ROUTE = 'route',
  SECURITY = 'security'
}

// Uso:
await createLog({
  level: 'info',
  category: LogCategory.SHIELD,
  message: 'Vídeo enviado com GPS validado',
  empresa_id: '...',
  metadata: { accuracy: 98.5 }
});
```

Logs de erro crítico devem disparar alertas imediatos.

---

**Violando esta regra:**
- ❌ Criar componentes na raiz de `src/components`
- ❌ Usar rotas em inglês (`/users`, `/settings`)
- ❌ `console.log` solto no código
