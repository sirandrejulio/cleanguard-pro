import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Search, Bell, User, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

// Idiomas — mesmo padrão compacto da landing Navbar
const LANGS = [
  { code: "en", label: "EN" },
  { code: "pt", label: "PT" },
  { code: "es", label: "ES" },
] as const;

interface TopNavProps {
  onMenuClick?: () => void;
  showMenu?: boolean;
}

// TopNav STRATA — glass bar com seletor de idiomas compacto
export function TopNav({ onMenuClick, showMenu }: TopNavProps) {
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  return (
    <header className="h-14 bg-card border-b border-border flex items-center px-4 md:px-6 gap-3 md:gap-4 shrink-0">
      {/* Mobile menu button */}
      {showMenu && (
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="shrink-0">
          <Menu className="w-5 h-5" />
        </Button>
      )}

      {/* Search */}
      <div className="flex-1 max-w-md relative hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("topnav.search")}
          className="w-full h-9 bg-white/5 border border-border text-foreground text-sm pl-9 pr-3 placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="flex items-center gap-1 md:gap-2 ml-auto">
        {/* Seletor de idioma compacto — idêntico à landing */}
        <div className="flex items-center gap-1 bg-white/5 px-1 py-1">
          {LANGS.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => i18n.changeLanguage(code)}
              className={`px-2.5 py-1 text-[10px] font-mono tracking-wider transition-all duration-200 ${
                i18n.language === code
                  ? "bg-primary text-primary-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <div className="p-4 text-center text-sm text-muted-foreground">
              {t("topnav.noNotifications")}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="border border-border">
              <User className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-3 py-2">
              <p className="text-sm font-semibold truncate">
                {user?.user_metadata?.full_name || user?.email}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
              <Settings className="w-4 h-4 mr-2" />
              {t("topnav.settings")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut()}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t("topnav.signOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
