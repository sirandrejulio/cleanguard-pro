import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Briefcase, Users, UserCog, Shield, Video,
  AlertTriangle, Clock, MapPin, Route, Calendar, Gift, List,
  Store, DollarSign, BarChart3, Settings, LogOut, ChevronLeft,
  ChevronDown, ChevronRight, Building2, Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useRole, AppRole } from "@/hooks/useRole";

interface NavItem {
  label: string;
  icon: React.ElementType;
  href?: string;
  minRole?: AppRole;
  children?: { label: string; icon: React.ElementType; href: string; minRole?: AppRole }[];
}

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const { signOut } = useAuth();
  const { role, hasMinRole } = useRole();
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>(["shield", "route", "fill"]);

  const toggleGroup = (group: string) => {
    setOpenGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  // Determinar a rota do dashboard baseada na role
  const dashboardHref = role === "owner" ? "/dashboard/owner"
    : role === "admin" ? "/dashboard/admin"
    : role === "manager" ? "/dashboard/manager"
    : role === "team_lead" ? "/dashboard/team-lead"
    : "/dashboard/cleaner";

  const navItems: NavItem[] = [
    { label: t("sidebar.dashboard"), icon: LayoutDashboard, href: dashboardHref },
    // Owner-only: All Companies
    ...(role === "owner" ? [{
      label: "All Companies",
      icon: Building2,
      href: "/dashboard/owner",
    }] : []),
    { label: t("sidebar.jobs"), icon: Briefcase, href: "/dashboard/jobs" },
    { label: t("sidebar.customers"), icon: Users, href: "/dashboard/customers", minRole: "manager" as AppRole },
    { label: t("sidebar.teams"), icon: UserCog, href: "/dashboard/teams", minRole: "manager" as AppRole },
    {
      label: t("sidebar.shield.title"), icon: Shield,
      children: [
        { label: t("sidebar.shield.evidence"), icon: Video, href: "/dashboard/shield/evidence" },
        { label: t("sidebar.shield.disputes"), icon: AlertTriangle, href: "/dashboard/shield/disputes", minRole: "manager" as AppRole },
        { label: t("sidebar.shield.timesheets"), icon: Clock, href: "/dashboard/shield/timesheets" },
      ],
    },
    {
      label: t("sidebar.route.title"), icon: MapPin, minRole: "team_lead" as AppRole,
      children: [
        { label: t("sidebar.route.optimizer"), icon: Route, href: "/dashboard/route/optimizer", minRole: "manager" as AppRole },
        { label: t("sidebar.route.daily"), icon: Calendar, href: "/dashboard/route/daily", minRole: "team_lead" as AppRole },
      ],
    },
    {
      label: t("sidebar.fill.title"), icon: Gift, minRole: "manager" as AppRole,
      children: [
        { label: t("sidebar.fill.waitlist"), icon: List, href: "/dashboard/fill/waitlist", minRole: "manager" as AppRole },
        { label: t("sidebar.fill.marketplace"), icon: Store, href: "/dashboard/fill/marketplace", minRole: "manager" as AppRole },
        { label: t("sidebar.fill.pricing"), icon: DollarSign, href: "/dashboard/fill/pricing", minRole: "admin" as AppRole },
      ],
    },
    { label: t("sidebar.analytics"), icon: BarChart3, href: "/dashboard/analytics", minRole: "manager" as AppRole },
    { label: t("sidebar.settings"), icon: Settings, href: "/dashboard/settings", minRole: "admin" as AppRole },
  ];

  const isActive = (href?: string) => href && location.pathname === href;
  const isGroupActive = (children?: NavItem["children"]) =>
    children?.some((c) => location.pathname.startsWith(c.href));

  const handleNav = () => onNavigate?.();

  // Filtra itens baseado na role
  const canSee = (minRole?: AppRole) => !minRole || hasMinRole(minRole);

  return (
    <aside
      className={cn(
        "h-full bg-card border-r border-border flex flex-col transition-all duration-200 shrink-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-border shrink-0">
        <Link to={dashboardHref} className="flex items-center gap-2" onClick={handleNav}>
          <div className="w-8 h-8 bg-primary flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-display font-black text-lg text-foreground">
              Clean<span className="text-primary">Guard</span> Pro
            </span>
          )}
        </Link>
      </div>

      {/* Role Badge */}
      {!collapsed && (
        <div className="px-4 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            {role === "owner" && <Crown className="w-3.5 h-3.5 text-amber-500" />}
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {role.replace("_", " ")}
            </span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.filter((item) => canSee(item.minRole)).map((item) => {
          if (item.children) {
            const visibleChildren = item.children.filter((c) => canSee(c.minRole));
            if (visibleChildren.length === 0) return null;

            const groupKey = item.label.toLowerCase();
            const isOpen = openGroups.includes(groupKey) && !collapsed;
            const groupActive = isGroupActive(visibleChildren);

            return (
              <div key={item.label}>
                <button
                  onClick={() => (collapsed ? null : toggleGroup(groupKey))}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold transition-colors",
                    groupActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left font-mono text-[11px] uppercase tracking-[0.15em]">
                        {item.label}
                      </span>
                      {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </>
                  )}
                </button>
                {isOpen && (
                  <div className="ml-4 pl-4 border-l border-border space-y-0.5">
                    {visibleChildren.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        onClick={handleNav}
                        className={cn(
                          "flex items-center gap-3 px-3 py-1.5 text-sm transition-colors",
                          isActive(child.href)
                            ? "text-primary font-bold bg-primary/5"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                      >
                        <child.icon className="w-4 h-4 shrink-0" />
                        <span>{child.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              to={item.href!}
              onClick={handleNav}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "text-primary font-bold bg-primary/5 border-l-2 border-primary -ml-[2px] pl-[14px]"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-2 space-y-1 shrink-0">
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>{t("sidebar.signOut")}</span>}
        </button>
        {!onNavigate && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft
              className={cn("w-5 h-5 shrink-0 transition-transform", collapsed && "rotate-180")}
            />
            {!collapsed && <span>{t("sidebar.collapse")}</span>}
          </button>
        )}
      </div>
    </aside>
  );
}
