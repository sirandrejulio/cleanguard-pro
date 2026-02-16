import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg">
                CleanGuard <span className="text-primary">Pro</span>
              </span>
            </div>
            <p className="text-sm opacity-60 leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-display font-bold mb-4 text-sm uppercase tracking-widest opacity-40">
              {t("footer.product")}
            </h4>
            <ul className="space-y-3">
              <li><a href="#modules" className="text-sm opacity-70 hover:opacity-100 transition-opacity">SHIELD</a></li>
              <li><a href="#modules" className="text-sm opacity-70 hover:opacity-100 transition-opacity">ROUTE</a></li>
              <li><a href="#modules" className="text-sm opacity-70 hover:opacity-100 transition-opacity">FILL</a></li>
              <li><a href="#pricing" className="text-sm opacity-70 hover:opacity-100 transition-opacity">{t("nav.pricing")}</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-bold mb-4 text-sm uppercase tracking-widest opacity-40">
              {t("footer.company")}
            </h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm opacity-70 hover:opacity-100 transition-opacity">{t("footer.about")}</a></li>
              <li><a href="#" className="text-sm opacity-70 hover:opacity-100 transition-opacity">{t("footer.careers")}</a></li>
              <li><a href="#" className="text-sm opacity-70 hover:opacity-100 transition-opacity">{t("footer.blog")}</a></li>
              <li><a href="#" className="text-sm opacity-70 hover:opacity-100 transition-opacity">{t("footer.contact")}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-bold mb-4 text-sm uppercase tracking-widest opacity-40">
              {t("footer.legal")}
            </h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm opacity-70 hover:opacity-100 transition-opacity">{t("footer.privacy")}</a></li>
              <li><a href="#" className="text-sm opacity-70 hover:opacity-100 transition-opacity">{t("footer.terms")}</a></li>
              <li><a href="#" className="text-sm opacity-70 hover:opacity-100 transition-opacity">{t("footer.security")}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-background/10 text-center text-sm opacity-40">
          {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
}
