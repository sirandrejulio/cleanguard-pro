# REGRA Nº 8: Diretrizes de Uso e Desenvolvimento

**Status**: ✅ ATIVA
**Versão**: 2.0.0
**Adaptado de**: REGRA_A5, REGRA_E1, REGRA_E2

---

## 🗣️ 1. IDIOMA OBRIGATÓRIO: PORTUGUÊS (PT-BR)

O **Clean Guard Pro** é um produto focado no mercado brasileiro (ou lusófono).
- **Interface**: "Painel", "Serviços", "Configurações".
- **Código**: Comentários e documentação em PT-BR.
- **Nomes de Arquivos (Rotas)**:
    - ✅ `src/app/(dashboard)/rota/diario/page.tsx`
    - ❌ `src/app/(dashboard)/route/daily/page.tsx`

---

## 🔄 2. CONTINUIDADE DE CONTEXTO

### Arquivo `CONTEXTO_ATUAL_SESSAO.md`
Sempre que finalizar uma sessão de trabalho, atualize este arquivo (se existir nas pastas de controle) ou o status no `task.md`.
- O que foi feito?
- O que falta fazer?
- Qual o próximo passo imediato?

Não deixe o próximo desenvolvedor (ou você no futuro) perdido.

---

## 🗺️ 3. PLANO TÉCNICO

Seguir rigorosamente o **Roadmap** definido.
- Não pule etapas da "Fase 1" para fazer algo da "Fase 3".
- Se bloquear em uma tarefa, documente o bloqueio e peça ajuda, não desvie do foco principal.

**Roadmap Atual (Resumo)**:
1. **Fase 1 (Fundação)**: Autenticação, Supabase, Layout Base.
2. **Fase 2 (Shield)**: Upload de vídeo, GPS, Blockchain simulado.
3. **Fase 3 (Route)**: Mapas, Otimização.

---

**Violando esta regra:**
- ❌ Commitar mensagens em inglês ("Fix bug").
- ❌ Deixar arquivos "soltos" sem atualizar o status.
- ❌ Ignorar a ordem de implementação das features.
