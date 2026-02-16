import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play, Shield, MapPin, DollarSign, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 49px, hsl(var(--foreground)) 49px, hsl(var(--foreground)) 50px),
                          repeating-linear-gradient(90deg, transparent, transparent 49px, hsl(var(--foreground)) 49px, hsl(var(--foreground)) 50px)`,
      }} />

      <div className="container mx-auto px-4 relative">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary/20 bg-primary/5">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{t("hero.badge")}</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9]">
            {t("hero.title")}{" "}
            <span className="text-primary">{t("hero.titleHighlight")}</span>{" "}
            {t("hero.titleEnd")}
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-8"
        >
          {t("hero.subtitle")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <Link to="/signup">
            <Button size="lg" className="text-base font-bold px-8 py-6 h-auto group">
              {t("hero.cta")}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="text-base px-8 py-6 h-auto border-2">
            <Play className="w-5 h-5 mr-2" />
            {t("hero.watchDemo")}
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-sm text-muted-foreground mt-4"
        >
          {t("hero.ctaSub")}
        </motion.p>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 border-2 border-foreground/10 divide-x-2 divide-foreground/10"
        >
          {[
            { value: t("stats.savingsValue"), label: t("stats.savings"), icon: DollarSign },
            { value: t("stats.disputesValue"), label: t("stats.disputes"), icon: Shield },
            { value: t("stats.routesValue"), label: t("stats.routes"), icon: MapPin },
            { value: t("stats.fillValue"), label: t("stats.fill"), icon: Zap },
          ].map((stat, i) => (
            <div key={i} className="p-6 text-center">
              <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="font-display text-3xl md:text-4xl font-black text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
