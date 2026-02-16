import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Briefcase, Users, DollarSign, Shield, Plus, UserPlus,
  Route, AlertTriangle, ArrowRight, Calendar, MapPin, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const userName = user?.user_metadata?.full_name?.split(" ")[0] || "";
  const today = format(new Date(), "yyyy-MM-dd");
  const monthStart = format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-MM-dd");

  // Today's jobs
  const { data: todayJobs = [] } = useQuery({
    queryKey: ["dashboard-today-jobs", today],
    queryFn: async () => {
      const { data } = await supabase
        .from("jobs")
        .select("*, customers(full_name, property_address, property_city)")
        .eq("scheduled_date", today)
        .order("scheduled_time_start");
      return data || [];
    },
  });

  // Active customers count
  const { data: customers = [] } = useQuery({
    queryKey: ["dashboard-customers"],
    queryFn: async () => {
      const { data } = await supabase.from("customers").select("id, is_active");
      return data || [];
    },
  });

  // Month revenue
  const { data: monthJobs = [] } = useQuery({
    queryKey: ["dashboard-month-jobs", monthStart],
    queryFn: async () => {
      const { data } = await supabase
        .from("jobs")
        .select("final_price, quoted_price")
        .gte("scheduled_date", monthStart);
      return data || [];
    },
  });

  // Disputes for shield score
  const { data: disputes = [] } = useQuery({
    queryKey: ["dashboard-disputes"],
    queryFn: async () => {
      const { data } = await supabase.from("disputes").select("status");
      return data || [];
    },
  });

  // Upcoming jobs (next 5)
  const { data: upcomingJobs = [] } = useQuery({
    queryKey: ["dashboard-upcoming"],
    queryFn: async () => {
      const { data } = await supabase
        .from("jobs")
        .select("*, customers(full_name, property_address)")
        .gte("scheduled_date", today)
        .order("scheduled_date")
        .order("scheduled_time_start")
        .limit(5);
      return data || [];
    },
  });

  const completedToday = todayJobs.filter((j) => j.status === "completed").length;
  const activeCustomers = customers.filter((c) => c.is_active).length;
  const monthRevenue = monthJobs.reduce((s, j) => s + (Number(j.final_price) || Number(j.quoted_price) || 0), 0);
  const totalDisputes = disputes.length;
  const resolvedDisputes = disputes.filter((d) => d.status === "resolved").length;
  const shieldScore = totalDisputes > 0 ? Math.round((resolvedDisputes / totalDisputes) * 100) : 100;

  const stats = [
    {
      label: t("dashboard.stats.todayJobs"),
      value: todayJobs.length.toString(),
      sub: `${completedToday} ${t("dashboard.stats.completed")}`,
      icon: Briefcase,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: t("dashboard.stats.activeCustomers"),
      value: activeCustomers.toString(),
      sub: t("dashboard.stats.total"),
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-600/10",
    },
    {
      label: t("dashboard.stats.monthRevenue"),
      value: `$${monthRevenue.toLocaleString()}`,
      sub: t("dashboard.stats.thisMonth"),
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-600/10",
    },
    {
      label: t("dashboard.stats.protectionScore"),
      value: `${shieldScore}%`,
      sub: "Shield",
      icon: Shield,
      color: "text-amber-600",
      bg: "bg-amber-600/10",
    },
  ];

  const quickActions = [
    { label: t("dashboard.quickActions.newJob"), icon: Plus, onClick: () => navigate("/dashboard/jobs/new") },
    { label: t("dashboard.quickActions.addCustomer"), icon: UserPlus, onClick: () => navigate("/dashboard/customers/new") },
    { label: t("dashboard.quickActions.optimizeRoutes"), icon: Route, onClick: () => navigate("/dashboard/route/optimizer") },
    { label: t("dashboard.quickActions.viewDisputes"), icon: AlertTriangle, onClick: () => navigate("/dashboard/shield/disputes") },
  ];

  const statusColors: Record<string, string> = {
    scheduled: "bg-blue-600/10 text-blue-600",
    in_progress: "bg-amber-600/10 text-amber-600",
    completed: "bg-emerald-600/10 text-emerald-600",
    cancelled: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-black">
          {t("dashboard.welcome")}{userName ? `, ${userName}` : ""}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">{t("dashboard.welcomeSub")}</p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        {quickActions.map((action) => (
          <Button key={action.label} variant="outline" onClick={action.onClick} className="border-2 font-semibold gap-2 h-10">
            <action.icon className="w-4 h-4" />
            {action.label}
          </Button>
        ))}
      </div>

      {/* Stats Grid */}
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

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Jobs */}
        <div className="lg:col-span-2 bg-card border-2 border-border">
          <div className="flex items-center justify-between p-5 border-b-2 border-border">
            <h2 className="font-display font-bold text-lg">{t("dashboard.upcomingJobs.title")}</h2>
            <Button variant="ghost" size="sm" className="text-primary font-semibold gap-1" onClick={() => navigate("/dashboard/jobs")}>
              {t("dashboard.upcomingJobs.viewAll")}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          {upcomingJobs.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">{t("dashboard.upcomingJobs.noJobs")}</p>
              <Button className="mt-4 font-semibold gap-2" onClick={() => navigate("/dashboard/jobs/new")}>
                <Plus className="w-4 h-4" />
                {t("dashboard.quickActions.newJob")}
              </Button>
            </div>
          ) : (
            <div className="divide-y-2 divide-border">
              {upcomingJobs.map((job) => (
                <div key={job.id} className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{(job as any).customers?.full_name || job.job_number}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {job.scheduled_date} • {job.scheduled_time_start || "—"}
                    </p>
                  </div>
                  <span className={`text-xs font-bold uppercase px-2 py-1 shrink-0 ${statusColors[job.status] || ""}`}>
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-card border-2 border-border">
          <div className="p-5 border-b-2 border-border">
            <h2 className="font-display font-bold text-lg">{t("dashboard.recentActivity.title")}</h2>
          </div>
          {todayJobs.length === 0 ? (
            <div className="p-8 text-center">
              <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">{t("dashboard.recentActivity.noActivity")}</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {todayJobs.slice(0, 5).map((job) => (
                <div key={job.id} className="p-4 flex items-center gap-3">
                  <div className={`w-2 h-2 shrink-0 ${job.status === "completed" ? "bg-emerald-600" : job.status === "in_progress" ? "bg-amber-600" : "bg-blue-600"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{(job as any).customers?.full_name || job.job_number}</p>
                    <p className="text-xs text-muted-foreground">{job.scheduled_time_start || "—"} • {job.service_type.replace("_", " ")}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { name: t("dashboard.modules.shield"), icon: Shield, desc: "Legal Protection", color: "border-primary", href: "/dashboard/shield/evidence" },
          { name: t("dashboard.modules.route"), icon: MapPin, desc: "AI Optimization", color: "border-blue-600", href: "/dashboard/route/optimizer" },
          { name: t("dashboard.modules.fill"), icon: DollarSign, desc: "Revenue Recovery", color: "border-emerald-600", href: "/dashboard/fill/waitlist" },
        ].map((mod) => (
          <button
            key={mod.name}
            onClick={() => navigate(mod.href)}
            className={`bg-card border-2 ${mod.color} p-5 text-left hover:bg-accent transition-colors group`}
          >
            <div className="flex items-center gap-3">
              <mod.icon className="w-6 h-6" />
              <div>
                <span className="font-display font-bold text-lg">{mod.name}</span>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{mod.desc}</p>
              </div>
              <ArrowRight className="w-5 h-5 ml-auto text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
