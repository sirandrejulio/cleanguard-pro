import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// Componente Navbar da landing page com suporte a 3 idiomas e seletor de idioma
const LANGS = [
    { code: "en", label: "EN" },
    { code: "pt", label: "PT" },
    { code: "es", label: "ES" },
] as const;

export default function Navbar() {
    const { t, i18n } = useTranslation();
    const links = t("landing.nav.links", { returnObjects: true }) as string[];

    return (
        <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                {/* Logo */}
                <Link to="/" className="font-display font-bold text-lg tracking-tight text-white">
                    Clean<span className="text-brand-emerald">Guard</span> Pro
                </Link>

                {/* Links centrais */}
                <div className="hidden md:flex items-center gap-8">
                    {links.map((link, i) => (
                        <a
                            key={i}
                            href={`#section-${i}`}
                            className="font-mono text-xs tracking-widest uppercase text-zinc-500 hover:text-white transition-colors relative group"
                        >
                            {link}
                            <span className="absolute -bottom-1 left-0 h-px w-0 bg-brand-emerald group-hover:w-full transition-all duration-300" />
                        </a>
                    ))}
                </div>

                {/* Seletor de idioma + CTA */}
                <div className="flex items-center gap-4">
                    {/* Seletor de idioma compacto */}
                    <div className="flex items-center gap-1 bg-white/5 rounded-full px-1 py-1">
                        {LANGS.map(({ code, label }) => (
                            <button
                                key={code}
                                onClick={() => i18n.changeLanguage(code)}
                                className={`px-2.5 py-1 text-[10px] font-mono tracking-wider rounded-full transition-all duration-200 ${i18n.language === code
                                    ? "bg-brand-emerald text-black font-bold"
                                    : "text-zinc-500 hover:text-white"
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <Link
                        to="/login"
                        className="hidden sm:inline-flex bg-white text-black text-xs font-bold tracking-wider uppercase px-5 py-2.5 rounded-full hover:bg-brand-emerald hover:text-black transition-all duration-300"
                    >
                        {t("landing.nav.cta")}
                    </Link>
                </div>
            </div>
        </nav>
    );
}
