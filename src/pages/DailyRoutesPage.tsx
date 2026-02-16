import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, addDays, subDays } from "date-fns";

export default function DailyRoutesPage() {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const dateStr = format(selectedDate, "yyyy-MM-dd");

  const { data: jobs = [] } = useQuery({
    queryKey: ["daily-route-jobs", dateStr],
    queryFn: async () => {
      const { data } = await supabase
        .from("jobs")
        .select("*, customers(full_name, property_address, property_city), teams(name, color)")
        .eq("scheduled_date", dateStr)
        .order("scheduled_time_start");
      return data || [];
    },
  });

  const statusColors: Record<string, string> = {
    scheduled: "bg-blue-600/10 text-blue-600 border-blue-600",
    in_progress: "bg-amber-600/10 text-amber-600 border-amber-600",
    completed: "bg-emerald-600/10 text-emerald-600 border-emerald-600",
    cancelled: "bg-destructive/10 text-destructive border-destructive",
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-black">{t("routeModule.daily.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("routeModule.daily.subtitle")}</p>
      </div>

      {/* Date Nav */}
      <div className="flex items-center gap-3 bg-card border-2 border-border p-3 w-fit">
        <Button variant="ghost" size="icon" onClick={() => setSelectedDate(subDays(selectedDate, 1))}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="font-display font-bold">{format(selectedDate, "EEEE, MMM d, yyyy")}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" className="border-2 font-semibold ml-2" onClick={() => setSelectedDate(new Date())}>
          {t("routeModule.daily.today")}
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card border-2 border-border p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("routeModule.daily.totalJobs")}</p>
          <p className="font-display text-2xl font-black mt-1">{jobs.length}</p>
        </div>
        <div className="bg-card border-2 border-border p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("routeModule.daily.completed")}</p>
          <p className="font-display text-2xl font-black mt-1 text-emerald-600">{jobs.filter(j => j.status === "completed").length}</p>
        </div>
        <div className="bg-card border-2 border-border p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("routeModule.daily.inProgress")}</p>
          <p className="font-display text-2xl font-black mt-1 text-amber-600">{jobs.filter(j => j.status === "in_progress").length}</p>
        </div>
        <div className="bg-card border-2 border-border p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("routeModule.daily.totalTime")}</p>
          <p className="font-display text-2xl font-black mt-1">{jobs.reduce((s, j) => s + (j.estimated_duration_minutes || 0), 0)} min</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-card border-2 border-border">
        <div className="p-4 border-b-2 border-border">
          <h2 className="font-display font-bold">{t("routeModule.daily.timeline")}</h2>
        </div>
        {jobs.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">{t("routeModule.daily.noJobs")}</p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden sm:block" />
            <div className="divide-y-2 divide-border">
              {jobs.map((job) => (
                <div key={job.id} className="p-4 pl-4 sm:pl-16 relative">
                  {/* Dot */}
                  <div className="absolute left-6 top-6 w-4 h-4 border-2 border-primary bg-card hidden sm:block" />
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-2 shrink-0">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="font-mono text-sm font-semibold">{job.scheduled_time_start || "—"}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{(job as any).customers?.full_name || job.job_number}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        <MapPin className="w-3 h-3 inline mr-1" />
                        {(job as any).customers?.property_address || "—"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {(job as any).teams?.name && (
                        <span className="text-xs font-bold uppercase tracking-wider bg-accent px-2 py-1">
                          {(job as any).teams.name}
                        </span>
                      )}
                      <span className={`text-xs font-bold uppercase px-2 py-1 border ${statusColors[job.status] || "border-border"}`}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
