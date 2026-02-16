import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Clock, MapPin, Play, Square, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useTimesheets, useCreateTimesheet, useUpdateTimesheet } from "@/hooks/useTimesheets";
import { useJobs } from "@/hooks/useJobs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function TimesheetsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: timesheets, isLoading } = useTimesheets();
  const { data: jobs } = useJobs("all");
  const createTimesheet = useCreateTimesheet();
  const updateTimesheet = useUpdateTimesheet();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ job_id: "", notes: "" });

  const activeTimesheet = timesheets?.find((ts: any) => ts.status === "active" && !ts.check_out && ts.user_id === user?.id);

  const getLocation = (): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: profile } = await supabase.from("profiles").select("company_id").single();
      if (!profile?.company_id || !user) {
        toast({ variant: "destructive", title: "Company not found" });
        setSaving(false);
        return;
      }
      const loc = await getLocation();
      await createTimesheet.mutateAsync({
        company_id: profile.company_id,
        job_id: form.job_id,
        user_id: user.id,
        check_in: new Date().toISOString(),
        check_in_lat: loc?.lat,
        check_in_lng: loc?.lng,
        notes: form.notes || undefined,
      });
      toast({ title: t("shield.timesheets.success.checkedIn") });
      setForm({ job_id: "", notes: "" });
      setDialogOpen(false);
    } catch {
      toast({ variant: "destructive", title: t("shield.timesheets.error") });
    }
    setSaving(false);
  };

  const handleCheckOut = async () => {
    if (!activeTimesheet) return;
    try {
      const loc = await getLocation();
      const checkIn = new Date(activeTimesheet.check_in!);
      const now = new Date();
      const totalMinutes = Math.round((now.getTime() - checkIn.getTime()) / 60000);

      await updateTimesheet.mutateAsync({
        id: activeTimesheet.id,
        check_out: now.toISOString(),
        check_out_lat: loc?.lat,
        check_out_lng: loc?.lng,
        total_minutes: totalMinutes,
        status: "completed",
      });
      toast({ title: t("shield.timesheets.success.checkedOut") });
    } catch {
      toast({ variant: "destructive", title: t("shield.timesheets.error") });
    }
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "—";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black">{t("shield.timesheets.title")}</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">{t("shield.timesheets.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          {activeTimesheet ? (
            <Button onClick={handleCheckOut} variant="destructive" className="font-semibold gap-2">
              <Square className="w-4 h-4" />
              {t("shield.timesheets.checkOut")}
            </Button>
          ) : (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="font-semibold gap-2">
                  <Play className="w-4 h-4" />
                  {t("shield.timesheets.checkIn")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-display font-bold text-xl">{t("shield.timesheets.checkIn")}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCheckIn} className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label className="font-semibold text-xs uppercase tracking-wider">{t("shield.evidence.job")}</Label>
                    <Select value={form.job_id} onValueChange={(v) => setForm({ ...form, job_id: v })}>
                      <SelectTrigger className="border-2"><SelectValue placeholder={t("shield.evidence.selectJob")} /></SelectTrigger>
                      <SelectContent>
                        {jobs?.filter((j: any) => j.status === "scheduled" || j.status === "in_progress").map((j: any) => (
                          <SelectItem key={j.id} value={j.id}>{j.job_number} — {j.customers?.full_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold text-xs uppercase tracking-wider">{t("shield.timesheets.notes")}</Label>
                    <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="border-2" rows={2} />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" className="flex-1 border-2" onClick={() => setDialogOpen(false)}>
                      {t("common.cancel")}
                    </Button>
                    <Button type="submit" className="flex-1 font-semibold" disabled={saving || !form.job_id}>
                      {saving ? t("common.loading") : t("shield.timesheets.startShift")}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Active Timesheet Banner */}
      {activeTimesheet && (
        <div className="bg-primary/5 border-2 border-primary p-4 flex items-center gap-4">
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
          <div className="flex-1">
            <p className="font-display font-bold">{t("shield.timesheets.activeShift")}</p>
            <p className="text-sm text-muted-foreground">
              {t("shield.timesheets.startedAt")} {new Date(activeTimesheet.check_in!).toLocaleTimeString()}
              {" • "}{activeTimesheet.jobs?.job_number}
            </p>
          </div>
          <Button onClick={handleCheckOut} variant="destructive" size="sm" className="font-semibold gap-1">
            <Square className="w-3 h-3" />
            {t("shield.timesheets.checkOut")}
          </Button>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-muted animate-pulse" />)}
        </div>
      ) : !timesheets?.length ? (
        <div className="bg-card border-2 border-border p-12 text-center">
          <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-display font-bold text-lg">{t("shield.timesheets.empty")}</p>
          <p className="text-muted-foreground text-sm mt-1">{t("shield.timesheets.emptyDesc")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {timesheets.map((ts: any) => (
            <div key={ts.id} className="bg-card border-2 border-border p-4 flex items-center gap-4 hover:bg-accent/50 transition-colors">
              <div className={`w-10 h-10 flex items-center justify-center shrink-0 ${ts.status === "active" && !ts.check_out ? "text-primary bg-primary/10" : "text-muted-foreground bg-muted"}`}>
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold">{ts.jobs?.job_number}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 ${ts.status === "active" && !ts.check_out ? "text-primary bg-primary/10" : "text-emerald-600 bg-emerald-600/10"}`}>
                    {ts.check_out ? t("shield.timesheets.completed") : t("shield.timesheets.active")}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-0.5 flex-wrap">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(ts.created_at).toLocaleDateString()}</span>
                  {ts.check_in && <span>{t("shield.timesheets.in")}: {new Date(ts.check_in).toLocaleTimeString()}</span>}
                  {ts.check_out && <span>{t("shield.timesheets.out")}: {new Date(ts.check_out).toLocaleTimeString()}</span>}
                  <span className="font-semibold">{formatDuration(ts.total_minutes)}</span>
                  {(ts.check_in_lat || ts.check_out_lat) && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />GPS ✓</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
