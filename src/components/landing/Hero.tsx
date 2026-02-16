import { useTranslation } from "react-i18next";

// Seção Hero da landing page com grid isométrico e textos traduzidos via i18n
export default function Hero() {
    const { t } = useTranslation();

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
            {/* Grid isométrico animado */}
            <div className="iso-container" aria-hidden="true">
                {Array.from({ length: 120 }).map((_, i) => (
                    <div
                        key={i}
                        className="iso-cell"
                        style={{ animationDelay: `${Math.random() * 5}s` }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                {/* Tag mono */}
                <p className="font-mono text-[11px] tracking-[0.2em] text-brand-emerald mb-8 uppercase">
                    {t("landing.hero.tag")}
                </p>

                {/* Título gigante */}
                <h1 className="font-display font-black text-hero leading-[0.9] tracking-tighter text-white mb-6">
                    {t("landing.hero.titleLine1")}
                    <br />
                    <span className="text-brand-emerald">{t("landing.hero.titleLine2")}</span>
                </h1>

                {/* Descrição persuasiva */}
                <p className="max-w-2xl mx-auto text-lg text-zinc-400 leading-relaxed mb-10">
                    {t("landing.hero.description")}
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                        href="#section-2"
                        className="bg-brand-emerald text-black font-bold text-sm tracking-wider uppercase px-8 py-4 rounded-full hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-300"
                    >
                        {t("landing.hero.ctaPrimary")}
                    </a>
                    <a
                        href="#section-0"
                        className="border border-white/10 text-white text-sm tracking-wider uppercase px-8 py-4 rounded-full hover:border-white/30 hover:bg-white/5 transition-all duration-300"
                    >
                        {t("landing.hero.ctaSecondary")}
                    </a>
                </div>
            </div>
        </section>
    );
}
