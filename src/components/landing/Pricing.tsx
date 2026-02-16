import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Pricing() {
  const { t } = useTranslation();

  const plans = [
    { key: "trial", highlight: false },
    { key: "professional", highlight: true },
    { key: "enterprise", highlight: false },
  ] as const;

  return (
    <section id="pricing" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-black">{t("pricing.title")}</h2>
          <p className="text-lg text-muted-foreground mt-4">{t("pricing.subtitle")}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map(({ key, highlight }, i) => {
            const features = t(`pricing.${key}.features`, { returnObjects: true }) as string[];
            const roi = t(`pricing.${key}.roi`, { defaultValue: "" });
            const popular = t(`pricing.${key}.popular`, { defaultValue: "" });

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative border-2 p-8 bg-card flex flex-col ${
                  highlight
                    ? "border-primary shadow-elevated scale-105 z-10"
                    : "border-border"
                }`}
              >
                {popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {popular}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-display text-xl font-bold">{t(`pricing.${key}.name`)}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{t(`pricing.${key}.description`)}</p>
                </div>

                <div className="mb-6">
                  <span className="font-display text-5xl font-black">{t(`pricing.${key}.price`)}</span>
                  <span className="text-muted-foreground ml-1">{t(`pricing.${key}.period`)}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {features.map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {roi && (
                  <div className="mb-4 p-3 bg-success/10 border border-success/20 text-sm font-medium text-center">
                    {roi}
                  </div>
                )}

                <Link to="/signup">
                  <Button
                    className="w-full font-bold"
                    variant={highlight ? "default" : "outline"}
                    size="lg"
                  >
                    {t(`pricing.${key}.cta`)}
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
