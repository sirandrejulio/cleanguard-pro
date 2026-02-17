import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Briefcase, Users, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

export default function TeamLeadDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const today = format(new Date(), "yyyy-MM-dd");

  const { data: myTeam } = useQuery({
    queryKey: ["teamlead-my-team", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("team_members")
        .select("team_id, teams(id, name, color)")
        .eq("user_id", user.id)
        .eq("is_leader", true)
        .limit(1)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  const teamId = (myTeam as any)?.teams?.id;

  const { data: teamJobs = [] } = useQuery({
    queryKey: ["teamlead-jobs", today, teamId],
    queryFn: async () => {
      if (!teamId) return [];
      const { data } = await supabase
        .from("jobs")
        .select("*, customers(full_name, property_address)")
        .eq("team_id", teamId)
        .eq("scheduled_date", today)
        .order("scheduled_time_start");
      return data || [];
    },
    enabled: !!teamId,
  });

  const { data: members = [] } = useQuery({
    queryKey: ["teamlead-members", teamId],
    queryFn: async () => {
      if (!teamId) return [];
      const { data } = await supabase
        .from("team_members")
        .select("*, profiles:user_id(full_name, email, avatar_url)")
        .eq("team_id", teamId);
      return data || [];
    },
    enabled: !!teamId,
  });

  const completed = teamJobs.filter((j) => j.status === "completed").length;
  const inProgress = teamJobs.filter((j) => j.status === "in_progress").length;
  const teamName = (myTeam as any)?.teams?.name || "My Team";

  const stats = [
    { label: t("roleDashboards.teamLead.teamJobs"), value: teamJobs.length, sub: t("roleDashboards.teamLead.today"), icon: Briefcase, color: "text-primary", bg: "bg-primary/10" },
    { label: t("roleDashboards.teamLead.members"), value: members.length, sub: teamName, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: t("roleDashboards.teamLead.inProgress"), value: inProgress, sub: t("roleDashboards.teamLead.activeNow"), icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: t("roleDashboards.teamLead.completedLabel"), value: completed, sub: t("roleDashboards.teamLead.today"), icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
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
        <h1 className="font-display text-2xl sm:text-3xl font-black">{t("roleDashboards.teamLead.title")} — {teamName}</h1>
        <p className="text-muted-foreground mt-1">{t("roleDashboards.teamLead.subtitle")}</p>
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

      {/* Jobs da equipe */}
      <div className="bg-card border-2 border-border">
        <div className="flex items-center justify-between p-5 border-b-2 border-border">
          <h2 className="font-display font-bold text-lg">{t("roleDashboards.teamLead.teamJobsList")}</h2>
          <Button variant="ghost" size="sm" className="text-primary font-semibold gap-1" onClick={() => navigate("/dashboard/jobs")}>
            {t("roleDashboards.teamLead.viewAll")} <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="divide-y divide-border">
          {teamJobs.map((job) => (
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
          {teamJobs.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">{t("roleDashboards.teamLead.noJobs")}</div>
          )}
        </div>
      </div>

      {/* Membros da equipe */}
      <div className="bg-card border-2 border-border">
        <div className="p-5 border-b-2 border-border">
          <h2 className="font-display font-bold text-lg">{t("roleDashboards.teamLead.teamMembers")}</h2>
        </div>
        <div className="divide-y divide-border">
          {members.map((m: any) => (
            <div key={m.id} className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-500/10 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{m.profiles?.full_name || "—"}</p>
                <p className="text-sm text-muted-foreground truncate">{m.profiles?.email || "—"}</p>
              </div>
              {m.is_leader && (
                <span className="text-xs font-bold uppercase px-2 py-1 bg-primary/10 text-primary">{t("roleDashboards.teamLead.leader")}</span>
              )}
            </div>
          ))}
          {members.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">{t("roleDashboards.teamLead.noMembers")}</div>
          )}
        </div>
      </div>
    </div>
  );
}
