import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Store, Calendar, DollarSign, MapPin, Clock } from "lucide-react";

export default function MarketplacePage() {
  const { t } = useTranslation();

  const { data: jobs = [] } = useQuery({
    queryKey: ["marketplace-jobs"],
    queryFn: async () => {
      const { data } = await supabase
        .from("jobs")
        .select("*, customers(full_name, property_address, property_city, property_type)")
        .eq("status", "scheduled")
        .order("scheduled_date")
        .limit(20);
      return data || [];
    },
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-black">{t("fillModule.marketplace.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("fillModule.marketplace.subtitle")}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border-2 border-border p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/10 flex items-center justify-center">
            <Store className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("fillModule.marketplace.openSlots")}</p>
            <p className="font-display text-xl font-black">{jobs.length}</p>
          </div>
        </div>
        <div className="bg-card border-2 border-border p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-600/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("fillModule.marketplace.potentialRevenue")}</p>
            <p className="font-display text-xl font-black">
              ${jobs.reduce((s, j) => s + (Number(j.quoted_price) || 0), 0).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-card border-2 border-border p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("fillModule.marketplace.thisWeek")}</p>
            <p className="font-display text-xl font-black">
              {jobs.filter((j) => {
                const d = new Date(j.scheduled_date);
                const now = new Date();
                const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
                return diff >= 0 && diff <= 7;
              }).length}
            </p>
          </div>
        </div>
      </div>

      {/* Job Cards Grid */}
      {jobs.length === 0 ? (
        <div className="bg-card border-2 border-border p-8 text-center">
          <Store className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">{t("fillModule.marketplace.empty")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-card border-2 border-border hover:border-primary transition-colors">
              <div className="p-4 border-b-2 border-border flex items-center justify-between">
                <span className="font-mono text-sm font-semibold">{job.job_number}</span>
                <span className="text-xs font-bold uppercase bg-primary/10 text-primary px-2 py-1">
                  {job.service_type.replace("_", " ")}
                </span>
              </div>
              <div className="p-4 space-y-3">
                <p className="font-semibold">{(job as any).customers?.full_name || "—"}</p>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" />
                    {(job as any).customers?.property_address || "—"}, {(job as any).customers?.property_city || ""}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    {job.scheduled_date} {job.scheduled_time_start && `at ${job.scheduled_time_start}`}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    {job.estimated_duration_minutes || 0} min
                  </p>
                </div>
                {job.quoted_price && (
                  <div className="pt-2 border-t border-border">
                    <span className="font-display text-lg font-black text-primary">
                      ${Number(job.quoted_price).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
