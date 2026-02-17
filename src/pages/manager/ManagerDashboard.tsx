import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Briefcase, Users, MapPin, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

export default function ManagerDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const today = format(new Date(), "yyyy-MM-dd");

  const { data: todayJobs = [] } = useQuery({
    queryKey: ["manager-today-jobs", today],
    queryFn: async () => {
      const { data } = await supabase
        .from("jobs")
        .select("*, customers(full_name, property_address)")
        .eq("scheduled_date", today)
        .order("scheduled_time_start");
      return data || [];
    },
  });

  const { data: teams = [] } = useQuery({
    queryKey: ["manager-teams"],
    queryFn: async () => {
      const { data } = await supabase.from("teams").select("*").eq("is_active", true);
      return data || [];
    },
  });

  const { data: routes = [] } = useQuery({
    queryKey: ["manager-routes", today],
    queryFn: async () => {
      const { data } = await supabase.from("routes").select("*").eq("route_date", today);
      return data || [];
    },
  });

  const completed = todayJobs.filter((j) => j.status === "completed").length;
  const inProgress = todayJobs.filter((j) => j.status === "in_progress").length;

  const stats = [
    { label: t("roleDashboards.manager.todayJobs"), value: todayJobs.length, sub: `${completed} ${t("roleDashboards.manager.completed")}`, icon: Briefcase, color: "text-primary", bg: "bg-primary/10" },
    { label: t("roleDashboards.manager.activeTeams"), value: teams.length, sub: t("roleDashboards.manager.managing"), icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: t("roleDashboards.manager.inProgress"), value: inProgress, sub: t("roleDashboards.manager.rightNow"), icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: t("roleDashboards.manager.routesToday"), value: routes.length, sub: t("roleDashboards.manager.planned"), icon: MapPin, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  const statusColors: Record<string, string> = {
    scheduled: "bg-blue-500/10 text-blue-400",
    in_progress: "bg-amber-500/10 text-amber-400",
    completed: "bg-emerald-500/10 text-emerald-400",
    cancelled: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-black">{t("roleDashboards.manager.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("roleDashboards.manager.subtitle")}</p>
      </div>

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

      {/* Serviços de hoje */}
      <div className="bg-card border-2 border-border">
        <div className="flex items-center justify-between p-5 border-b-2 border-border">
          <h2 className="font-display font-bold text-lg">{t("roleDashboards.manager.todayJobsList")}</h2>
          <Button variant="ghost" size="sm" className="text-primary font-semibold gap-1" onClick={() => navigate("/dashboard/jobs")}>
            {t("roleDashboards.manager.viewAll")} <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="divide-y divide-border">
          {todayJobs.slice(0, 8).map((job) => (
            <div key={job.id} className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{(job as any).customers?.full_name || job.job_number}</p>
                <p className="text-sm text-muted-foreground truncate">{job.scheduled_time_start || "—"} • {job.service_type.replace("_", " ")}</p>
              </div>
              <span className={`text-xs font-bold uppercase px-2 py-1 shrink-0 ${statusColors[job.status] || ""}`}>
                {job.status}
              </span>
            </div>
          ))}
          {todayJobs.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">{t("roleDashboards.manager.noJobs")}</div>
          )}
        </div>
      </div>
    </div>
  );
}
