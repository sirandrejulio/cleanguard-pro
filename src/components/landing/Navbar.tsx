import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Menu, X, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "es", label: "Español", flag: "🇲🇽" },
];

export function Navbar() {
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b-2 border-foreground/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            CleanGuard <span className="text-primary">Pro</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollTo("modules")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t("nav.modules")}
          </button>
          <button onClick={() => scrollTo("pricing")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t("nav.pricing")}
          </button>
          <button onClick={() => scrollTo("faq")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t("nav.faq")}
          </button>
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Globe className="w-4 h-4" />
                <span className="text-xs">{currentLang.flag}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                  className={i18n.language === lang.code ? "bg-accent" : ""}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/login">
            <Button variant="ghost" size="sm">{t("nav.login")}</Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="font-semibold">{t("nav.getStarted")}</Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t-2 border-foreground/10 bg-background p-4 space-y-4">
          <button onClick={() => scrollTo("modules")} className="block w-full text-left py-2 font-medium">{t("nav.modules")}</button>
          <button onClick={() => scrollTo("pricing")} className="block w-full text-left py-2 font-medium">{t("nav.pricing")}</button>
          <button onClick={() => scrollTo("faq")} className="block w-full text-left py-2 font-medium">{t("nav.faq")}</button>
          <div className="flex gap-2 pt-2 border-t border-border">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { i18n.changeLanguage(lang.code); setMobileOpen(false); }}
                className={`px-3 py-1 text-sm border-2 ${i18n.language === lang.code ? "border-primary bg-primary/10" : "border-border"}`}
              >
                {lang.flag}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Link to="/login" className="flex-1"><Button variant="outline" className="w-full">{t("nav.login")}</Button></Link>
            <Link to="/signup" className="flex-1"><Button className="w-full">{t("nav.getStarted")}</Button></Link>
          </div>
        </div>
      )}
    </nav>
  );
}
