import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Briefcase, MapPin, Clock, CheckCircle, Camera, Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

export default function CleanerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const today = format(new Date(), "yyyy-MM-dd");

  // My jobs today
  const { data: myJobs = [] } = useQuery({
    queryKey: ["cleaner-my-jobs", today, user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data } = await supabase
        .from("jobs")
        .select("*, customers(full_name, property_address, property_city)")
        .eq("assigned_to", user.id)
        .eq("scheduled_date", today)
        .order("scheduled_time_start");
      return data || [];
    },
    enabled: !!user?.id,
  });

  // My timesheets today
  const { data: timesheets = [] } = useQuery({
    queryKey: ["cleaner-timesheets", today, user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data } = await supabase
        .from("timesheets")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", `${today}T00:00:00`);
      return data || [];
    },
    enabled: !!user?.id,
  });

  const completed = myJobs.filter((j) => j.status === "completed").length;
  const inProgress = myJobs.filter((j) => j.status === "in_progress").length;
  const nextJob = myJobs.find((j) => j.status === "scheduled");
  const totalMinutes = timesheets.reduce((s, t) => s + (t.total_minutes || 0), 0);

  const stats = [
    { label: "MY JOBS", value: myJobs.length, sub: "Today", icon: Briefcase, color: "text-primary", bg: "bg-primary/10" },
    { label: "COMPLETED", value: completed, sub: `of ${myJobs.length}`, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "IN PROGRESS", value: inProgress, sub: "Active", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "HOURS", value: `${(totalMinutes / 60).toFixed(1)}h`, sub: "Logged today", icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
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
        <h1 className="font-display text-2xl sm:text-3xl font-black">My Dashboard</h1>
        <p className="text-muted-foreground mt-1">Your jobs, check-ins & evidence</p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" className="border-2 font-semibold gap-2 h-10" onClick={() => navigate("/dashboard/shield/evidence")}>
          <Camera className="w-4 h-4" /> Upload Evidence
        </Button>
        <Button variant="outline" className="border-2 font-semibold gap-2 h-10" onClick={() => navigate("/dashboard/shield/timesheets")}>
          <Navigation className="w-4 h-4" /> Check-In GPS
        </Button>
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

      {/* Next Job */}
      {nextJob && (
        <div className="bg-card border-2 border-primary p-5 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">NEXT JOB</span>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-lg truncate">{(nextJob as any).customers?.full_name || nextJob.job_number}</p>
              <p className="text-sm text-muted-foreground truncate">
                {(nextJob as any).customers?.property_address || "—"} • {nextJob.scheduled_time_start || "—"}
              </p>
            </div>
            <Button className="font-semibold gap-2" onClick={() => navigate("/dashboard/shield/timesheets")}>
              <Navigation className="w-4 h-4" /> Start
            </Button>
          </div>
        </div>
      )}

      {/* My Jobs */}
      <div className="bg-card border-2 border-border">
        <div className="p-5 border-b-2 border-border">
          <h2 className="font-display font-bold text-lg">My Jobs Today</h2>
        </div>
        <div className="divide-y divide-border">
          {myJobs.map((job) => (
            <div key={job.id} className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{(job as any).customers?.full_name || job.job_number}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {(job as any).customers?.property_address || "—"} • {job.scheduled_time_start || "—"}
                </p>
              </div>
              <span className={`text-xs font-bold uppercase px-2 py-1 shrink-0 ${statusColors[job.status] || ""}`}>
                {job.status}
              </span>
            </div>
          ))}
          {myJobs.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">No jobs assigned for today</div>
          )}
        </div>
      </div>
    </div>
  );
}
