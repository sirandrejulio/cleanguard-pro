import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Minus } from "lucide-react";

// FAQ accordion minimalista
export default function FAQ() {
    const { t } = useTranslation();
    const items = t("landing.faq.items", { returnObjects: true }) as Array<{
        q: string;
        a: string;
    }>;
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section id="section-3" className="py-24 px-6 bg-[#050505]">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <h2 className="font-display font-black text-3xl md:text-4xl text-white tracking-tighter mb-12 text-center">
                    {t("landing.faq.title")}
                </h2>

                {/* Items */}
                <div className="divide-y divide-white/5">
                    {items.map((item, i) => {
                        const isOpen = openIndex === i;
                        return (
                            <div key={i} className="py-5">
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : i)}
                                    className="w-full flex items-center justify-between gap-4 text-left group"
                                >
                                    <span className="font-medium text-white group-hover:text-brand-emerald transition-colors">
                                        {item.q}
                                    </span>
                                    <span className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full border border-white/10 group-hover:border-brand-emerald/50 transition-colors">
                                        {isOpen ? (
                                            <Minus className="w-3 h-3 text-brand-emerald" />
                                        ) : (
                                            <Plus className="w-3 h-3 text-zinc-500" />
                                        )}
                                    </span>
                                </button>
                                {isOpen && (
                                    <p className="mt-3 text-sm text-zinc-500 leading-relaxed pr-10 animate-accordion-down">
                                        {item.a}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
