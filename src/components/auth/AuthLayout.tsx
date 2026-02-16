import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

// Idiomas suportados com labels compactos (mesmo padrão da Navbar da landing)
const LANGS = [
  { code: "en", label: "EN" },
  { code: "pt", label: "PT" },
  { code: "es", label: "ES" },
] as const;

// Layout de autenticação — segue fielmente o design STRATA da landing page
export function AuthLayout({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-[#050505] text-white font-body relative overflow-hidden selection:bg-brand-emerald selection:text-black">
      {/* Noise Overlay — idêntico à landing */}
      <div className="fixed inset-0 pointer-events-none z-[999] bg-noise opacity-[0.03] mix-blend-overlay" />

      {/* Grid isométrico animado — idêntico ao Hero */}
      <div className="iso-container" aria-hidden="true">
        {Array.from({ length: 120 }).map((_, i) => (
          <div
            key={i}
            className="iso-cell"
            style={{ animationDelay: `${Math.random() * 5}s` }}
          />
        ))}
      </div>

      {/* Top bar — estilo glass da Navbar */}
      <header className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="font-display font-bold text-lg tracking-tight text-white">
            Clean<span className="text-brand-emerald">Guard</span> Pro
          </Link>

          {/* Seletor de idioma compacto — idêntico à Navbar */}
          <div className="flex items-center gap-1 bg-white/5 rounded-full px-1 py-1">
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => i18n.changeLanguage(code)}
                className={`px-2.5 py-1 text-[10px] font-mono tracking-wider rounded-full transition-all duration-200 ${
                  i18n.language === code
                    ? "bg-brand-emerald text-black font-bold"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Conteúdo centralizado */}
      <main className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-20 pb-10">
        <div className="w-full max-w-md">
          {/* Card glass com borda hairline — padrão STRATA */}
          <div className="glass hairline p-8 sm:p-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
