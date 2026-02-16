import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Building2, Users, DollarSign, TrendingUp, Shield, Eye, Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function OwnerDashboard() {
  const navigate = useNavigate();

  // Todas as companies
  const { data: companies = [] } = useQuery({
    queryKey: ["owner-companies"],
    queryFn: async () => {
      const { data } = await supabase.from("companies").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  // Total de users
  const { data: profiles = [] } = useQuery({
    queryKey: ["owner-profiles"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("id, company_id, role");
      return data || [];
    },
  });

  const activeCompanies = companies.filter((c) => c.subscription_status === "active").length;

  const pricingMap: Record<string, number> = { trial: 0, basic: 0, pro: 199, professional: 199, enterprise: 499 };
  const mrr = companies.reduce((sum, c) => sum + (pricingMap[c.subscription_tier || "trial"] || 0), 0);

  const stats = [
    { label: "COMPANIES", value: companies.length, sub: `${activeCompanies} active`, icon: Building2, color: "text-primary", bg: "bg-primary/10" },
    { label: "USERS", value: profiles.length, sub: "Across all companies", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "MRR", value: `$${mrr.toLocaleString()}`, sub: "Monthly recurring", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "ARR", value: `$${(mrr * 12).toLocaleString()}`, sub: "Annual recurring", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  const tierColors: Record<string, string> = {
    enterprise: "bg-purple-500/10 text-purple-400",
    pro: "bg-blue-500/10 text-blue-400",
    professional: "bg-blue-500/10 text-blue-400",
    trial: "bg-muted text-muted-foreground",
    basic: "bg-muted text-muted-foreground",
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black">Owner Dashboard</h1>
          <p className="text-muted-foreground mt-1">God Mode — Full System Access</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20">
          <Shield className="w-4 h-4 text-primary" />
          <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider">GOD MODE</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border-2 border-border p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
              <div className={`w-9 h-9 ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div>
              <span className="font-display text-3xl font-black">{stat.value}</span>
              <span className="text-sm text-muted-foreground ml-2">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Companies Table */}
      <div className="bg-card border-2 border-border">
        <div className="flex items-center justify-between p-5 border-b-2 border-border">
          <h2 className="font-display font-bold text-lg">All Companies</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Company</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Tier</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Users</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Revenue</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Created</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {companies.map((company) => {
                const userCount = profiles.filter((p) => p.company_id === company.id).length;
                const revenue = pricingMap[company.subscription_tier || "trial"] || 0;
                return (
                  <tr key={company.id} className="hover:bg-accent/50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-semibold">{company.name}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 text-xs font-bold uppercase ${
                        company.subscription_status === "active"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-destructive/10 text-destructive"
                      }`}>
                        {company.subscription_status || "unknown"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 text-xs font-bold uppercase ${tierColors[company.subscription_tier || "trial"]}`}>
                        {company.subscription_tier || "trial"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm">{userCount}</td>
                    <td className="px-5 py-4 text-sm font-mono">${revenue}/mo</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {new Date(company.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                          <Eye className="w-3 h-3" /> View
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-destructive hover:text-destructive">
                          <Ban className="w-3 h-3" /> Suspend
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {companies.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                    No companies found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
