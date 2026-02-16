import { useTranslation } from "react-i18next";
import { Shield, MapPin, BarChart3, Bell } from "lucide-react";

const icons = [Shield, MapPin, BarChart3, Bell];

// Cards de módulos com ícones dinâmicos e metadata tags
export default function ModuleCards() {
    const { t } = useTranslation();
    const cards = t("landing.modules.cards", { returnObjects: true }) as Array<{
        title: string;
        description: string;
        meta?: string[];
    }>;

    return (
        <section id="section-1" className="py-24 px-6 bg-[#050505]">
            <div className="max-w-6xl mx-auto">
                {/* Cabeçalho */}
                <div className="mb-16">
                    <p className="font-mono text-[10px] tracking-[0.3em] text-zinc-600 mb-2">
                        {t("landing.modules.subtitle")}
                    </p>
                    <h2 className="font-display font-black text-4xl md:text-5xl text-white tracking-tighter">
                        {t("landing.modules.title")}
                    </h2>
                </div>

                {/* Grid de cards */}
                <div className="grid md:grid-cols-2 gap-px bg-white/5 rounded-2xl overflow-hidden">
                    {cards.map((card, i) => {
                        const Icon = icons[i] || Shield;
                        return (
                            <div
                                key={i}
                                className="bg-[#0A0A0A] p-8 md:p-10 group hover:bg-white/[0.02] transition-colors duration-500"
                            >
                                {/* Ícone */}
                                <div className="w-10 h-10 flex items-center justify-center bg-brand-emerald/10 rounded-lg mb-6 group-hover:bg-brand-emerald/20 transition-colors">
                                    <Icon className="w-5 h-5 text-brand-emerald" />
                                </div>

                                {/* Texto */}
                                <h3 className="font-display font-bold text-xl text-white mb-3 tracking-tight">
                                    {card.title}
                                </h3>
                                <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                                    {card.description}
                                </p>

                                {/* Meta tags */}
                                {card.meta && (
                                    <div className="flex gap-2">
                                        {card.meta.map((tag, j) => (
                                            <span
                                                key={j}
                                                className="font-mono text-[9px] tracking-widest text-brand-emerald bg-brand-emerald/10 px-3 py-1 rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
