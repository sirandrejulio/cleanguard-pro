import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Sparkles, Home, Building2, Bath, Wind, Truck, Star } from "lucide-react";

import img1 from "@/assets/cleaning-1.jpg";
import img2 from "@/assets/cleaning-2.jpg";
import img3 from "@/assets/cleaning-3.jpg";
import img4 from "@/assets/cleaning-4.jpg";
import img5 from "@/assets/cleaning-5.jpg";
import img6 from "@/assets/cleaning-6.jpg";

const services = [
  { image: img1, icon: Home, titleKey: "landing.gallery.kitchen", descKey: "landing.gallery.kitchenDesc" },
  { image: img2, icon: Wind, titleKey: "landing.gallery.windows", descKey: "landing.gallery.windowsDesc" },
  { image: img3, icon: Sparkles, titleKey: "landing.gallery.carpet", descKey: "landing.gallery.carpetDesc" },
  { image: img4, icon: Bath, titleKey: "landing.gallery.bathroom", descKey: "landing.gallery.bathroomDesc" },
  { image: img5, icon: Building2, titleKey: "landing.gallery.office", descKey: "landing.gallery.officeDesc" },
  { image: img6, icon: Truck, titleKey: "landing.gallery.moveout", descKey: "landing.gallery.moveoutDesc" },
];

export default function ServiceGallery() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % services.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 px-6 bg-[#050505] relative overflow-hidden">
      {/* Subtle grid bg */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16">
          <p className="font-mono text-[10px] tracking-[0.3em] text-zinc-600 mb-2 uppercase">
            {t("landing.gallery.subtitle")}
          </p>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white tracking-tighter">
            {t("landing.gallery.title")}
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
          {services.map((service, i) => {
            const Icon = service.icon;
            const isActive = i === activeIndex;

            return (
              <div
                key={i}
                className="group relative bg-[#0A0A0A] overflow-hidden cursor-pointer"
                onMouseEnter={() => setActiveIndex(i)}
                style={{ transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={service.image}
                    alt={t(service.titleKey)}
                    className="w-full h-full object-cover transition-all duration-700"
                    style={{
                      transform: isActive ? "scale(1.08)" : "scale(1)",
                      filter: isActive ? "brightness(0.7)" : "brightness(0.4) grayscale(0.5)",
                    }}
                    loading="lazy"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />

                  {/* Active indicator - green line */}
                  <div
                    className="absolute top-0 left-0 h-[2px] bg-brand-emerald transition-all duration-700"
                    style={{ width: isActive ? "100%" : "0%" }}
                  />

                  {/* Rotating glow on active */}
                  {isActive && (
                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-brand-emerald/10 blur-3xl animate-pulse" />
                  )}
                </div>

                {/* Content */}
                <div className="relative p-6 -mt-8 z-10">
                  {/* Icon */}
                  <div
                    className="w-10 h-10 flex items-center justify-center mb-4 transition-all duration-500"
                    style={{
                      background: isActive ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.05)",
                    }}
                  >
                    <Icon
                      className="w-5 h-5 transition-colors duration-500"
                      style={{ color: isActive ? "#10B981" : "rgba(255,255,255,0.3)" }}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-lg text-white mb-2 tracking-tight">
                    {t(service.titleKey)}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed transition-all duration-500"
                    style={{
                      color: isActive ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)",
                      maxHeight: isActive ? "60px" : "0px",
                      opacity: isActive ? 1 : 0,
                      overflow: "hidden",
                    }}
                  >
                    {t(service.descKey)}
                  </p>

                  {/* Rating stars - visible on active */}
                  <div
                    className="flex items-center gap-1 mt-3 transition-all duration-500"
                    style={{ opacity: isActive ? 1 : 0, transform: isActive ? "translateY(0)" : "translateY(8px)" }}
                  >
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-3 h-3 fill-brand-emerald text-brand-emerald" />
                    ))}
                    <span className="font-mono text-[10px] text-zinc-500 ml-2">5.0</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {services.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className="transition-all duration-300"
              style={{
                width: i === activeIndex ? "24px" : "6px",
                height: "6px",
                background: i === activeIndex ? "#10B981" : "rgba(255,255,255,0.15)",
              }}
              aria-label={`Service ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
