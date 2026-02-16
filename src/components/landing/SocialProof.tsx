import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export function SocialProof() {
  const { t } = useTranslation();

  return (
    <section className="py-16 border-y-2 border-foreground/10 bg-secondary/50">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold">{t("social.title")}</h2>
          <p className="text-muted-foreground mt-2">{t("social.subtitle")}</p>
        </motion.div>

        {/* Placeholder company logos */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-40">
          {["SparkleClean Co.", "ProMaids USA", "Fresh & Bright", "CleanTeam Pro", "MasterClean LLC"].map((name) => (
            <div key={name} className="font-display font-bold text-lg md:text-xl tracking-tight text-foreground">
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
