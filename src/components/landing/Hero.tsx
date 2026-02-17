import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

// Seção Hero da landing page com grid isométrico e animações de entrada
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
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="font-mono text-[11px] tracking-[0.2em] text-brand-emerald mb-8 uppercase"
                >
                    {t("landing.hero.tag")}
                </motion.p>

                {/* Título gigante */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="font-display font-black text-hero leading-[0.9] tracking-tighter text-white mb-6"
                >
                    {t("landing.hero.titleLine1")}
                    <br />
                    <span className="text-brand-emerald">{t("landing.hero.titleLine2")}</span>
                </motion.h1>

                {/* Descrição persuasiva */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="max-w-2xl mx-auto text-lg text-zinc-400 leading-relaxed mb-10"
                >
                    {t("landing.hero.description")}
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
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
                </motion.div>
            </div>
        </section>
    );
}
