import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  TrendingUp, DollarSign, Briefcase, Shield, Users, Clock,
  MapPin, Store, ArrowUpRight, ArrowDownRight,
} from "lucide-react";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "2px solid hsl(var(--border))",
  borderRadius: 0,
};

export default function AnalyticsPage() {
  const { t } = useTranslation();

  const { data: jobs = [] } = useQuery({
    queryKey: ["analytics-jobs"],
    queryFn: async () => {
      const { data } = await supabase.from("jobs").select("*");
      return data || [];
    },
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["analytics-customers"],
    queryFn: async () => {
      const { data } = await supabase.from("customers").select("id, is_active");
      return data || [];
    },
  });

  const { data: disputes = [] } = useQuery({
    queryKey: ["analytics-disputes"],
    queryFn: async () => {
      const { data } = await supabase.from("disputes").select("*");
      return data || [];
    },
  });

  const { data: timesheets = [] } = useQuery({
    queryKey: ["analytics-timesheets"],
    queryFn: async () => {
      const { data } = await supabase.from("timesheets").select("*");
      return data || [];
    },
  });

  const { data: teams = [] } = useQuery({
    queryKey: ["analytics-teams"],
    queryFn: async () => {
      const { data } = await supabase.from("teams").select("*");
      return data || [];
    },
  });

  const { data: evidence = [] } = useQuery({
    queryKey: ["analytics-evidence"],
    queryFn: async () => {
      const { data } = await supabase.from("evidence_uploads").select("id, job_id, created_at");
      return data || [];
    },
  });

  const { data: routes = [] } = useQuery({
    queryKey: ["analytics-routes"],
    queryFn: async () => {
      const { data } = await supabase.from("routes").select("*");
      return data || [];
    },
  });

  // === KPIs ===
  const totalRevenue = jobs.reduce((s, j) => s + (Number(j.final_price) || Number(j.quoted_price) || 0), 0);
  const totalHours = timesheets.reduce((s, t) => s + (t.total_minutes || 0), 0) / 60;
  const activeCustomers = customers.filter((c) => c.is_active).length;
  const completedJobs = jobs.filter((j) => j.status === "completed").length;
  const totalDisputes = disputes.length;
  const resolvedDisputes = disputes.filter((d) => d.status === "resolved").length;
  const winRate = totalDisputes > 0 ? Math.round((resolvedDisputes / totalDisputes) * 100) : 0;

  // Revenue trend (last vs previous month)
  const now = new Date();
  const thisMonthJobs = jobs.filter((j) => {
    const d = new Date(j.scheduled_date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const lastMonthJobs = jobs.filter((j) => {
    const d = new Date(j.scheduled_date);
    const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return d.getMonth() === last.getMonth() && d.getFullYear() === last.getFullYear();
  });
  const thisMonthRev = thisMonthJobs.reduce((s, j) => s + (Number(j.final_price) || Number(j.quoted_price) || 0), 0);
  const lastMonthRev = lastMonthJobs.reduce((s, j) => s + (Number(j.final_price) || Number(j.quoted_price) || 0), 0);
  const revTrend = lastMonthRev > 0 ? Math.round(((thisMonthRev - lastMonthRev) / lastMonthRev) * 100) : 0;

  // Jobs by status
  const statusCounts: Record<string, number> = {};
  jobs.forEach((j) => { statusCounts[j.status] = (statusCounts[j.status] || 0) + 1; });
  const jobsByStatus = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // Monthly revenue (12 months)
  const monthlyRevenue: { month: string; revenue: number; jobs: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString("default", { month: "short" });
    const monthJobs = jobs.filter((j) => {
      const jd = new Date(j.scheduled_date);
      return jd.getMonth() === d.getMonth() && jd.getFullYear() === d.getFullYear();
    });
    const rev = monthJobs.reduce((s, j) => s + (Number(j.final_price) || Number(j.quoted_price) || 0), 0);
    monthlyRevenue.push({ month: label, revenue: rev, jobs: monthJobs.length });
  }

  // Jobs per team with details
  const teamMap = new Map(teams.map((t) => [t.id, t.name]));
  const teamStats: Record<string, { jobs: number; completed: number; revenue: number }> = {};
  jobs.forEach((j) => {
    if (j.team_id) {
      const name = teamMap.get(j.team_id) || "Unknown";
      if (!teamStats[name]) teamStats[name] = { jobs: 0, completed: 0, revenue: 0 };
      teamStats[name].jobs++;
      if (j.status === "completed") teamStats[name].completed++;
      teamStats[name].revenue += Number(j.final_price) || Number(j.quoted_price) || 0;
    }
  });
  const teamData = Object.entries(teamStats).map(([name, s]) => ({
    name,
    jobs: s.jobs,
    completed: s.completed,
    rate: s.jobs > 0 ? Math.round((s.completed / s.jobs) * 100) : 0,
    revenue: s.revenue,
  }));

  // Service type breakdown
  const serviceStats: Record<string, { count: number; revenue: number }> = {};
  jobs.forEach((j) => {
    if (!serviceStats[j.service_type]) serviceStats[j.service_type] = { count: 0, revenue: 0 };
    serviceStats[j.service_type].count++;
    serviceStats[j.service_type].revenue += Number(j.final_price) || Number(j.quoted_price) || 0;
  });
  const serviceData = Object.entries(serviceStats).map(([name, s]) => ({
    name: name.replace(/_/g, " "),
    count: s.count,
    revenue: s.revenue,
  }));

  const kpis = [
    { label: t("analytics.kpis.totalRevenue"), value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-600/10", trend: revTrend },
    { label: t("analytics.kpis.totalJobs"), value: jobs.length.toString(), icon: Briefcase, color: "text-primary", bg: "bg-primary/10", sub: `${completedJobs} completed` },
    { label: t("analytics.kpis.activeCustomers"), value: activeCustomers.toString(), icon: Users, color: "text-blue-600", bg: "bg-blue-600/10" },
    { label: t("analytics.kpis.hoursWorked"), value: totalHours.toFixed(0) + "h", icon: Clock, color: "text-violet-600", bg: "bg-violet-600/10" },
    { label: t("analytics.kpis.shieldScore"), value: `${winRate}%`, icon: Shield, color: "text-amber-600", bg: "bg-amber-600/10", sub: `${evidence.length} evidence files` },
    { label: "Routes", value: routes.length.toString(), icon: MapPin, color: "text-rose-600", bg: "bg-rose-600/10", sub: `${routes.filter(r => r.is_optimized).length} optimized` },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-black">{t("analytics.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("analytics.subtitle")}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-card border-2 border-border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-tight">{kpi.label}</span>
              <div className={`w-8 h-8 ${kpi.bg} flex items-center justify-center shrink-0`}>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
            </div>
            <span className="font-display text-xl sm:text-2xl font-black block">{kpi.value}</span>
            {kpi.trend !== undefined && (
              <span className={`text-xs font-bold flex items-center gap-0.5 ${kpi.trend >= 0 ? "text-emerald-600" : "text-destructive"}`}>
                {kpi.trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(kpi.trend)}% vs last month
              </span>
            )}
            {kpi.sub && <span className="text-xs text-muted-foreground">{kpi.sub}</span>}
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend (Line) */}
        <div className="bg-card border-2 border-border">
          <div className="p-5 border-b-2 border-border">
            <h2 className="font-display font-bold">{t("analytics.charts.monthlyRevenue")}</h2>
          </div>
          <div className="p-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} name={t("analytics.charts.revenue")} />
                <Line type="monotone" dataKey="jobs" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 3 }} name="Jobs" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Jobs by Status (Pie) */}
        <div className="bg-card border-2 border-border">
          <div className="p-5 border-b-2 border-border">
            <h2 className="font-display font-bold">{t("analytics.charts.jobsByStatus")}</h2>
          </div>
          <div className="p-4 h-72">
            {jobsByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={jobsByStatus} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                    {jobsByStatus.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">{t("analytics.noData")}</div>
            )}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Service Type */}
        <div className="bg-card border-2 border-border">
          <div className="p-5 border-b-2 border-border">
            <h2 className="font-display font-bold">Revenue by Service</h2>
          </div>
          <div className="p-4 h-72">
            {serviceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serviceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue ($)" />
                  <Bar dataKey="count" fill="hsl(var(--chart-3))" name="Jobs" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">{t("analytics.noData")}</div>
            )}
          </div>
        </div>

        {/* Shield Protection Gauge */}
        <div className="bg-card border-2 border-border">
          <div className="p-5 border-b-2 border-border">
            <h2 className="font-display font-bold">{t("analytics.charts.shieldProtection")}</h2>
          </div>
          <div className="p-4 h-72 flex flex-col items-center justify-center gap-4">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--primary))" strokeWidth="8" strokeDasharray={`${winRate * 2.64} 264`} strokeLinecap="butt" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-3xl font-black">{winRate}%</span>
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold">{t("analytics.charts.disputeWinRate")}</p>
              <p className="text-xs text-muted-foreground">{resolvedDisputes} {t("analytics.charts.resolved")} / {totalDisputes} {t("analytics.charts.total")}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
              <div className="text-center">
                <p className="font-display text-lg font-black">{evidence.length}</p>
                <p className="text-xs text-muted-foreground">Evidence Files</p>
              </div>
              <div className="text-center">
                <p className="font-display text-lg font-black">{timesheets.length}</p>
                <p className="text-xs text-muted-foreground">Timesheets</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Performance Table */}
      <div className="bg-card border-2 border-border">
        <div className="p-5 border-b-2 border-border">
          <h2 className="font-display font-bold">{t("analytics.charts.jobsPerTeam")}</h2>
        </div>
        {teamData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left p-3 font-bold uppercase text-xs tracking-widest text-muted-foreground">Team</th>
                  <th className="text-right p-3 font-bold uppercase text-xs tracking-widest text-muted-foreground">Jobs</th>
                  <th className="text-right p-3 font-bold uppercase text-xs tracking-widest text-muted-foreground">Completed</th>
                  <th className="text-right p-3 font-bold uppercase text-xs tracking-widest text-muted-foreground">Rate</th>
                  <th className="text-right p-3 font-bold uppercase text-xs tracking-widest text-muted-foreground">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {teamData.map((row) => (
                  <tr key={row.name} className="hover:bg-accent transition-colors">
                    <td className="p-3 font-semibold">{row.name}</td>
                    <td className="p-3 text-right">{row.jobs}</td>
                    <td className="p-3 text-right">{row.completed}</td>
                    <td className="p-3 text-right">
                      <span className={`font-bold ${row.rate >= 80 ? "text-emerald-600" : row.rate >= 50 ? "text-amber-600" : "text-destructive"}`}>
                        {row.rate}%
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono">${row.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">{t("analytics.noData")}</div>
        )}
      </div>
    </div>
  );
}
