# REGRA Nº 7: Integração e Validação de IA

**Status**: ✅ ATIVA
**Versão**: 2.0.0
**Adaptado de**: REGRA_B4

---

## 🤖 1. VALIDAÇÃO DE CONTEÚDO IA

Todo output gerado por Inteligência Artificial (Gemini, OpenAI, etc.) deve passar por uma camada de validação antes de ser apresentado ao usuário como "fato".

### Validador `validateAIContent`

#### Detecção de Danos (Vision)
- **Confiança Mínima**: 70% (0.7).
- **Tamanho Mínimo**: Bounding box deve ter dimensões relevantes (>10px).
- **Ação**: Se confiança < 0.7, marcar como "Revisão Necessária".

#### Relatórios de Defesa (Text)
- **Citações Obrigatórias**: O texto deve citar evidências (fotos/vídeos) específicas.
- **Tom Profissional**: Bloquear termos de incerteza excessiva ("talvez", "acho que").
- **Revisão Humana**: Relatórios legais gerados por IA são sempre rascunhos. O usuário deve aprovar antes de enviar.

---

## 🧠 2. MODELOS E PROMPTS

- Usar prompts estruturados em português.
- Output sempre em JSON para facilitar parsing.
- Manter histórico de qual modelo gerou qual dado (`model_version` no banco).

---

**Violando esta regra:**
- ❌ Mostrar alucinações da IA como verdade absoluta.
- ❌ Automatizar envio de disputas jurídicas sem revisão humana.
