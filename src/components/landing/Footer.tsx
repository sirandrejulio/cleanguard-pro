import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

// Footer com animação de entrada
export default function Footer() {
    const { t } = useTranslation();
    const platformLinks = t("landing.footer.platformLinks", { returnObjects: true }) as string[];
    const companyLinks = t("landing.footer.companyLinks", { returnObjects: true }) as string[];

    return (
        <footer className="relative bg-[#050505] border-t border-white/5 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
                <span className="font-display font-black text-[15vw] text-white/[0.02] tracking-tighter whitespace-nowrap">
                    CLEAN GUARD
                </span>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                className="relative z-10 max-w-6xl mx-auto px-6 py-16"
            >
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="md:col-span-1">
                        <h3 className="font-display font-bold text-lg text-white tracking-tight mb-3">
                            Clean<span className="text-brand-emerald">Guard</span> Pro
                        </h3>
                        <p className="text-xs text-zinc-600 leading-relaxed">
                            {t("landing.footer.description")}
                        </p>
                    </div>
                    <div>
                        <h4 className="font-mono text-[10px] tracking-widest text-zinc-600 uppercase mb-4">
                            {t("landing.footer.platform")}
                        </h4>
                        <ul className="space-y-2">
                            {platformLinks.map((link, i) => (
                                <li key={i}>
                                    <a href="#" className="text-xs text-zinc-500 hover:text-white transition-colors">{link}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-mono text-[10px] tracking-widest text-zinc-600 uppercase mb-4">
                            {t("landing.footer.company")}
                        </h4>
                        <ul className="space-y-2">
                            {companyLinks.map((link, i) => (
                                <li key={i}>
                                    <a href="#" className="text-xs text-zinc-500 hover:text-white transition-colors">{link}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-mono text-[10px] tracking-widest text-zinc-600 uppercase mb-4">
                            {t("landing.footer.newsletter")}
                        </h4>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder={t("landing.footer.emailPlaceholder")}
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-brand-emerald/50"
                            />
                            <button className="bg-white text-black text-xs font-bold px-4 py-2 rounded-lg hover:bg-brand-emerald transition-colors">
                                {t("landing.footer.subscribe")}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
                    <p className="font-mono text-[10px] text-zinc-700">
                        {t("landing.footer.copyright")}
                    </p>
                    <p className="font-mono text-[10px] text-zinc-700">
                        {t("landing.footer.tagline")}
                    </p>
                </div>
            </motion.div>
        </footer>
    );
}
