import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Shield, MapPin, DollarSign, Check } from "lucide-react";

const moduleIcons = {
  shield: Shield,
  route: MapPin,
  fill: DollarSign,
};

const moduleColors = {
  shield: "bg-primary text-primary-foreground",
  route: "bg-info text-info-foreground",
  fill: "bg-success text-success-foreground",
};

const moduleBorders = {
  shield: "border-primary/30 hover:border-primary",
  route: "border-info/30 hover:border-info",
  fill: "border-success/30 hover:border-success",
};

export function ModuleCards() {
  const { t } = useTranslation();

  const moduleKeys = ["shield", "route", "fill"] as const;

  return (
    <section id="modules" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-black">{t("modules.sectionTitle")}</h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">{t("modules.sectionSubtitle")}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {moduleKeys.map((key, i) => {
            const Icon = moduleIcons[key];
            const features = t(`modules.${key}.features`, { returnObjects: true }) as string[];

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`border-2 ${moduleBorders[key]} p-8 transition-colors duration-300 group`}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 ${moduleColors[key]} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-display font-black text-lg">{t(`modules.${key}.name`)}</div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">{t(`modules.${key}.tagline`)}</div>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="font-display text-2xl font-bold mb-3">{t(`modules.${key}.title`)}</h3>
                <p className="text-muted-foreground mb-6">{t(`modules.${key}.description`)}</p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {features.map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Stat */}
                <div className="pt-6 border-t-2 border-border">
                  <div className="font-display text-3xl font-black text-primary">{t(`modules.${key}.stat`)}</div>
                  <div className="text-sm text-muted-foreground">{t(`modules.${key}.statLabel`)}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
