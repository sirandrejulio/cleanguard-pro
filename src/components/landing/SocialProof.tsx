import { useTranslation } from "react-i18next";

// Faixa de social proof com scroll infinito
export default function SocialProof() {
    const { t } = useTranslation();
    const entities = t("landing.socialProof.entities", { returnObjects: true }) as Array<{
        name: string;
        tag: string;
    }>;

    // Duplicar para efeito de scroll infinito
    const doubled = [...entities, ...entities];

    return (
        <section id="section-0" className="py-12 bg-[#050505] border-y border-white/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-6">
                <span className="font-mono text-[10px] tracking-[0.3em] text-zinc-600 uppercase">
                    {t("landing.socialProof.label")}
                </span>
            </div>

            {/* Marquee */}
            <div className="relative">
                <div className="flex animate-scroll whitespace-nowrap">
                    {doubled.map((entity, i) => (
                        <div
                            key={i}
                            className="inline-flex items-center gap-3 mx-6 px-5 py-3 bg-white/[0.02] border border-white/5 rounded-sm"
                        >
                            <span className="font-mono text-xs tracking-widest text-zinc-400">
                                {entity.name}
                            </span>
                            <span className="font-mono text-[9px] tracking-wider text-brand-emerald bg-brand-emerald/10 px-2 py-0.5 rounded-full">
                                {entity.tag}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
