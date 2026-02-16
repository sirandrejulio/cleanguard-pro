import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Route, MapPin, Clock, Fuel, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RouteOptimizerPage() {
  const { t } = useTranslation();

  const { data: jobs = [] } = useQuery({
    queryKey: ["route-jobs"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("jobs")
        .select("*, customers(full_name, property_address, property_city)")
        .gte("scheduled_date", today)
        .order("scheduled_date")
        .limit(20);
      return data || [];
    },
  });

  const { data: teams = [] } = useQuery({
    queryKey: ["route-teams"],
    queryFn: async () => {
      const { data } = await supabase.from("teams").select("*").eq("is_active", true);
      return data || [];
    },
  });

  const [selectedTeam, setSelectedTeam] = useState<string>("all");

  const filteredJobs = selectedTeam === "all"
    ? jobs
    : jobs.filter((j) => j.team_id === selectedTeam);

  const stats = [
    { label: t("routeModule.optimizer.stats.totalJobs"), value: filteredJobs.length, icon: Route },
    { label: t("routeModule.optimizer.stats.estimatedTime"), value: `${filteredJobs.reduce((s, j) => s + (j.estimated_duration_minutes || 0), 0)} min`, icon: Clock },
    { label: t("routeModule.optimizer.stats.stops"), value: filteredJobs.length, icon: MapPin },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black">{t("routeModule.optimizer.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("routeModule.optimizer.subtitle")}</p>
        </div>
        <Button className="font-semibold gap-2 border-2 shrink-0">
          <Zap className="w-4 h-4" />
          {t("routeModule.optimizer.optimize")}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border-2 border-border p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 flex items-center justify-center shrink-0">
              <s.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <p className="font-display text-xl font-black">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Team Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedTeam("all")}
          className={`px-3 py-1.5 text-sm font-semibold border-2 transition-colors ${
            selectedTeam === "all" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent"
          }`}
        >
          {t("routeModule.optimizer.allTeams")}
        </button>
        {teams.map((team) => (
          <button
            key={team.id}
            onClick={() => setSelectedTeam(team.id)}
            className={`px-3 py-1.5 text-sm font-semibold border-2 transition-colors ${
              selectedTeam === team.id ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent"
            }`}
          >
            {team.name}
          </button>
        ))}
      </div>

      {/* Job List as route stops */}
      <div className="bg-card border-2 border-border">
        <div className="p-4 border-b-2 border-border">
          <h2 className="font-display font-bold">{t("routeModule.optimizer.routeStops")}</h2>
        </div>
        {filteredJobs.length === 0 ? (
          <div className="p-8 text-center">
            <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">{t("routeModule.optimizer.noStops")}</p>
          </div>
        ) : (
          <div className="divide-y-2 divide-border">
            {filteredJobs.map((job, i) => (
              <div key={job.id} className="p-4 flex items-center gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center font-display font-black text-sm shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">
                    {(job as any).customers?.full_name || job.job_number}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {(job as any).customers?.property_address}, {(job as any).customers?.property_city}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold">{job.scheduled_time_start || "—"}</p>
                  <p className="text-xs text-muted-foreground">{job.estimated_duration_minutes || 0} min</p>
                </div>
                {i < filteredJobs.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
