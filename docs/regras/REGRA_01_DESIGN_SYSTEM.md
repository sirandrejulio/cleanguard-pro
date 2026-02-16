# REGRA Nº 1: Design System Obrigatório

**Status**: ✅ ATIVA
**Versão**: 2.0.0
**Adaptado de**: REGRA_A1, REGRA_A2, REGRA_C1, REGRA_C3, REGRA_D1, REGRA_D2, REGRA_D3

---

## 🎨 1. IDENTIDADE VISUAL E CORES

### Variáveis CSS (Tailwind)
```css
:root {
  /* Fundos */
  --bg-primary: #050505;        /* Fundo principal */
  --bg-secondary: #0A0A0A;       /* Cards/sections */
  --bg-tertiary: #111111;        /* Elementos elevados */
  
  /* Bordas */
  --border-primary: rgba(255, 255, 255, 0.05);
  --border-secondary: rgba(255, 255, 255, 0.1);
  --border-hover: rgba(255, 255, 255, 0.15);
  
  /* Cores da Marca (CLEAN GUARD PRO) */
  --brand-primary: #10B981;      /* Verde - Proteção/Confiança */
  --brand-secondary: #059669;     /* Verde escuro */
  --brand-accent: #34D399;        /* Verde claro */
  --brand-danger: #EF4444;        /* Vermelho - Disputas */
  --brand-warning: #F59E0B;       /* Laranja - Alertas */
  
  /* Tipografia */
  --text-primary: rgba(255, 255, 255, 0.95);
  --text-secondary: rgba(255, 255, 255, 0.7);
  --text-tertiary: rgba(255, 255, 255, 0.4);
  --text-disabled: rgba(255, 255, 255, 0.2);
}
```

### Tipografia Obrigatória
```css
.font-display { font-family: 'Inter Tight', sans-serif; }
.font-body { font-family: 'Inter', sans-serif; }
.font-mono { font-family: 'JetBrains Mono', monospace; }

/* Tamanhos */
.text-hero { font-size: clamp(3rem, 5vw, 5.125rem); }
.text-section { font-size: clamp(2rem, 3vw, 3rem); }
.text-card-title { font-size: 1.25rem; }
.text-card-subtitle { font-size: 0.875rem; }
```

---

## 🧱 2. COMPONENTES DE UI OBRIGATÓRIOS

### Botão Voltar (Contextual)
Sempre usar `VoltarButton.tsx` para navegação segura. Se o histórico estiver vazio, usar rota de fallback.

### Modais Grandes (Com Scroll)
Modais complexos devem usar `ModalGrande.tsx` com:
- `max-h-[90vh]` e `overflow-y-auto`
- Header e Footer fixos dentro do modal
- Backdrop com blur

### Dropdowns (Com Portals)
Menus dropdown devem usar `DropdownPortal.tsx` para evitar problemas de `z-index` e `overflow: hidden` em containers pais. O conteúdo é renderizado no `document.body` via `createPortal`.

---

## 🎭 3. ANIMAÇÕES E INTERAÇÕES

### Keyframes (Tailwind Config)
```css
@keyframes slideIn {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes pulse-green {
  0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  50% { box-shadow: 0 0 20px 10px rgba(16, 185, 129, 0.2); }
}
```

### Classes Utilitárias
- `.animate-slide-in`: Para entrada de cards e seções
- `.animate-pulse-green`: Para status de "Protegido" ou "Ativo"
- `.transition-default`: `all 0.2s ease` para hovers padrão

---

## 📐 4. LAYOUT GERAL

### Header Fixado
Header fixo no topo com `backdrop-blur-xl` e borda `border-primary`. Deve conter:
- Logo (Escudo Verde + CleanGuardPro)
- Navegação Principal (Proteção, Rotas, Fill, Analytics)
- User Menu

### Footer Estruturado
Grid de 4 colunas com links organizados por módulo:
- [Proteção]
- [Rotas]
- [Fill]
- [Empresa]

---

**Violando esta regra:**
- ❌ Usar cores hardcoded (ex: `#00ff00`)
- ❌ Criar botões sem variantes padrão
- ❌ Usar fontes do sistema (Arial, Times)
