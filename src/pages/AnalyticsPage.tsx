import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  TrendingUp, DollarSign, Briefcase, Shield, Users, Clock,
} from "lucide-react";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function AnalyticsPage() {
  const { t } = useTranslation();

  // Fetch jobs
  const { data: jobs = [] } = useQuery({
    queryKey: ["analytics-jobs"],
    queryFn: async () => {
      const { data } = await supabase.from("jobs").select("*");
      return data || [];
    },
  });

  // Fetch customers
  const { data: customers = [] } = useQuery({
    queryKey: ["analytics-customers"],
    queryFn: async () => {
      const { data } = await supabase.from("customers").select("id, is_active");
      return data || [];
    },
  });

  // Fetch disputes
  const { data: disputes = [] } = useQuery({
    queryKey: ["analytics-disputes"],
    queryFn: async () => {
      const { data } = await supabase.from("disputes").select("*");
      return data || [];
    },
  });

  // Fetch timesheets
  const { data: timesheets = [] } = useQuery({
    queryKey: ["analytics-timesheets"],
    queryFn: async () => {
      const { data } = await supabase.from("timesheets").select("*");
      return data || [];
    },
  });

  // Fetch teams
  const { data: teams = [] } = useQuery({
    queryKey: ["analytics-teams"],
    queryFn: async () => {
      const { data } = await supabase.from("teams").select("*");
      return data || [];
    },
  });

  // === Computed Data ===

  // Jobs by status
  const statusCounts: Record<string, number> = {};
  jobs.forEach((j) => {
    statusCounts[j.status] = (statusCounts[j.status] || 0) + 1;
  });
  const jobsByStatus = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // Revenue by month (last 6 months)
  const now = new Date();
  const monthlyRevenue: { month: string; revenue: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString("default", { month: "short", year: "2-digit" });
    const monthJobs = jobs.filter((j) => {
      const jd = new Date(j.scheduled_date);
      return jd.getMonth() === d.getMonth() && jd.getFullYear() === d.getFullYear();
    });
    const rev = monthJobs.reduce((s, j) => s + (Number(j.final_price) || Number(j.quoted_price) || 0), 0);
    monthlyRevenue.push({ month: label, revenue: rev });
  }

  // Jobs per team
  const teamMap = new Map(teams.map((t) => [t.id, t.name]));
  const jobsPerTeam: Record<string, number> = {};
  jobs.forEach((j) => {
    if (j.team_id) {
      const name = teamMap.get(j.team_id) || "Unknown";
      jobsPerTeam[name] = (jobsPerTeam[name] || 0) + 1;
    }
  });
  const teamData = Object.entries(jobsPerTeam).map(([name, jobs]) => ({ name, jobs }));

  // Shield stats
  const totalDisputes = disputes.length;
  const resolvedDisputes = disputes.filter((d) => d.status === "resolved").length;
  const winRate = totalDisputes > 0 ? Math.round((resolvedDisputes / totalDisputes) * 100) : 0;

  // KPI cards
  const totalRevenue = jobs.reduce((s, j) => s + (Number(j.final_price) || Number(j.quoted_price) || 0), 0);
  const totalHours = timesheets.reduce((s, t) => s + (t.total_minutes || 0), 0) / 60;
  const activeCustomers = customers.filter((c) => c.is_active).length;

  const kpis = [
    {
      label: t("analytics.kpis.totalRevenue"),
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-600/10",
    },
    {
      label: t("analytics.kpis.totalJobs"),
      value: jobs.length.toString(),
      icon: Briefcase,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: t("analytics.kpis.activeCustomers"),
      value: activeCustomers.toString(),
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-600/10",
    },
    {
      label: t("analytics.kpis.hoursWorked"),
      value: totalHours.toFixed(1),
      icon: Clock,
      color: "text-violet-600",
      bg: "bg-violet-600/10",
    },
    {
      label: t("analytics.kpis.shieldScore"),
      value: `${winRate}%`,
      icon: Shield,
      color: "text-amber-600",
      bg: "bg-amber-600/10",
    },
    {
      label: t("analytics.kpis.disputes"),
      value: `${resolvedDisputes}/${totalDisputes}`,
      icon: TrendingUp,
      color: "text-rose-600",
      bg: "bg-rose-600/10",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-black">{t("analytics.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("analytics.subtitle")}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-card border-2 border-border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-tight">
                {kpi.label}
              </span>
              <div className={`w-8 h-8 ${kpi.bg} flex items-center justify-center shrink-0`}>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
            </div>
            <span className="font-display text-xl sm:text-2xl font-black">{kpi.value}</span>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue */}
        <div className="bg-card border-2 border-border">
          <div className="p-5 border-b-2 border-border">
            <h2 className="font-display font-bold">{t("analytics.charts.monthlyRevenue")}</h2>
          </div>
          <div className="p-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "2px solid hsl(var(--border))",
                    borderRadius: 0,
                  }}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" name={t("analytics.charts.revenue")} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Jobs by Status */}
        <div className="bg-card border-2 border-border">
          <div className="p-5 border-b-2 border-border">
            <h2 className="font-display font-bold">{t("analytics.charts.jobsByStatus")}</h2>
          </div>
          <div className="p-4 h-72">
            {jobsByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={jobsByStatus}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, value }) => `${name} (${value})`}
                  >
                    {jobsByStatus.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                {t("analytics.noData")}
              </div>
            )}
          </div>
        </div>

        {/* Jobs per Team */}
        <div className="bg-card border-2 border-border">
          <div className="p-5 border-b-2 border-border">
            <h2 className="font-display font-bold">{t("analytics.charts.jobsPerTeam")}</h2>
          </div>
          <div className="p-4 h-72">
            {teamData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "2px solid hsl(var(--border))",
                      borderRadius: 0,
                    }}
                  />
                  <Bar dataKey="jobs" fill="hsl(var(--chart-2))" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                {t("analytics.noData")}
              </div>
            )}
          </div>
        </div>

        {/* Shield Protection */}
        <div className="bg-card border-2 border-border">
          <div className="p-5 border-b-2 border-border">
            <h2 className="font-display font-bold">{t("analytics.charts.shieldProtection")}</h2>
          </div>
          <div className="p-4 h-72 flex flex-col items-center justify-center gap-4">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="hsl(var(--primary))" strokeWidth="8"
                  strokeDasharray={`${winRate * 2.64} 264`}
                  strokeLinecap="butt"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-3xl font-black">{winRate}%</span>
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold">{t("analytics.charts.disputeWinRate")}</p>
              <p className="text-xs text-muted-foreground">
                {resolvedDisputes} {t("analytics.charts.resolved")} / {totalDisputes} {t("analytics.charts.total")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
