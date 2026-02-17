import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// FAQ accordion com animações suaves
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
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="font-display font-black text-3xl md:text-4xl text-white tracking-tighter mb-12 text-center"
                >
                    {t("landing.faq.title")}
                </motion.h2>

                {/* Items */}
                <div className="divide-y divide-white/5">
                    {items.map((item, i) => {
                        const isOpen = openIndex === i;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-30px" }}
                                transition={{ duration: 0.4, delay: i * 0.05 }}
                                className="py-5"
                            >
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
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.p
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="text-sm text-zinc-500 leading-relaxed pr-10 mt-3 overflow-hidden"
                                        >
                                            {item.a}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
