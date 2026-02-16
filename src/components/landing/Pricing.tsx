import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

// Cards de preço minimalistas com destaque emerald no plano recomendado
export default function Pricing() {
    const { t } = useTranslation();
    const plans = t("landing.pricing.plans", { returnObjects: true }) as Array<{
        name: string;
        price: string;
        period: string;
        features: string[];
        cta: string;
        highlight?: boolean;
    }>;

    return (
        <section id="section-2" className="py-24 px-6 bg-[#050505]">
            <div className="max-w-5xl mx-auto">
                {/* Cabeçalho */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-white/5 rounded-full px-4 py-1.5 mb-6">
                        <span className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
                            {t("landing.pricing.toggleMonthly")} / {t("landing.pricing.toggleAnnual")}
                        </span>
                    </div>
                    <p className="text-zinc-500 max-w-lg mx-auto">
                        {t("landing.pricing.subtitle")}
                    </p>
                </div>

                {/* Grid de planos */}
                <div className="grid md:grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={`relative p-8 ${plan.highlight
                                ? "bg-brand-emerald/5 shadow-[0_0_60px_rgba(16,185,129,0.08)]"
                                : "bg-[#0A0A0A]"
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute top-4 right-4">
                                    <span className="font-mono text-[9px] tracking-widest text-brand-emerald bg-brand-emerald/10 px-3 py-1 rounded-full">
                                        {t("landing.pricing.recommended")}
                                    </span>
                                </div>
                            )}

                            <h3 className="font-mono text-xs tracking-widest text-zinc-500 mb-4">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="font-display font-black text-4xl text-white">{plan.price}</span>
                                {plan.period && <span className="text-sm text-zinc-600">{plan.period}</span>}
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((f, j) => (
                                    <li key={j} className="flex items-start gap-2">
                                        <Check className="w-3.5 h-3.5 text-brand-emerald mt-0.5 shrink-0" />
                                        <span className="text-sm text-zinc-400">{f}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`w-full py-3 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 ${plan.highlight
                                    ? "bg-brand-emerald text-black hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                                    : "border border-white/10 text-white hover:bg-white/5"
                                    }`}
                            >
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
