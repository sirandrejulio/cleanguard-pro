import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

// Showcase de cases reais com animações de scroll
export default function Showcase() {
    const { t } = useTranslation();
    const projects = t("landing.showcase.projects", { returnObjects: true }) as Array<{
        title: string;
        stat: string;
        tags: string[];
    }>;

    return (
        <section className="py-24 px-6 bg-[#050505]">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4"
                >
                    <div>
                        <h2 className="font-display font-black text-4xl md:text-5xl text-white tracking-tighter mb-3">
                            {t("landing.showcase.title")}
                        </h2>
                        <p className="text-zinc-500 max-w-md">
                            {t("landing.showcase.subtitle")}
                        </p>
                    </div>
                    <button className="font-mono text-xs tracking-widest text-brand-emerald hover:text-white transition-colors inline-flex items-center gap-2 group">
                        {t("landing.showcase.cta")}
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                </motion.div>

                {/* Grid de projetos */}
                <div className="grid md:grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden">
                    {projects.map((project, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="bg-[#0A0A0A] p-8 group cursor-pointer hover:bg-white/[0.02] transition-all duration-500 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-emerald/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="relative z-10">
                                <div className="mb-6">
                                    <span className="font-display font-black text-3xl text-brand-emerald">
                                        {project.stat}
                                    </span>
                                </div>
                                <h3 className="font-display font-bold text-lg text-white mb-4 tracking-tight">
                                    {project.title}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag, j) => (
                                        <span
                                            key={j}
                                            className="font-mono text-[9px] tracking-widest text-zinc-500 border border-white/10 px-3 py-1 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
