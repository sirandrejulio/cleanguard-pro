import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Plus, Briefcase, Calendar, DollarSign, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useJobs, useCreateJob, useDeleteJob } from "@/hooks/useJobs";
import { useCustomers } from "@/hooks/useCustomers";
import { useTeams } from "@/hooks/useTeams";
import { supabase } from "@/integrations/supabase/client";

const STATUS_COLORS: Record<string, string> = {
  scheduled: "text-blue-600 bg-blue-600/10",
  in_progress: "text-amber-600 bg-amber-600/10",
  completed: "text-emerald-600 bg-emerald-600/10",
  cancelled: "text-muted-foreground bg-muted",
};

export default function JobsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: jobs, isLoading } = useJobs(statusFilter);
  const { data: customers } = useCustomers();
  const { data: teams } = useTeams();
  const createJob = useCreateJob();
  const deleteJob = useDeleteJob();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    customer_id: "",
    team_id: "",
    scheduled_date: "",
    scheduled_time_start: "",
    scheduled_time_end: "",
    service_type: "standard_clean",
    quoted_price: "",
    priority: "2",
    notes: "",
  });

  const resetForm = () => setForm({
    customer_id: "", team_id: "", scheduled_date: "",
    scheduled_time_start: "", scheduled_time_end: "",
    service_type: "standard_clean", quoted_price: "", priority: "2", notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: profile } = await supabase.from("profiles").select("company_id").single();
      if (!profile?.company_id) {
        toast({ variant: "destructive", title: "Company not found" });
        setSaving(false);
        return;
      }

      await createJob.mutateAsync({
        company_id: profile.company_id,
        customer_id: form.customer_id,
        team_id: form.team_id || null,
        scheduled_date: form.scheduled_date,
        scheduled_time_start: form.scheduled_time_start || null,
        scheduled_time_end: form.scheduled_time_end || null,
        service_type: form.service_type,
        quoted_price: form.quoted_price ? parseFloat(form.quoted_price) : null,
        priority: parseInt(form.priority),
        notes: form.notes || null,
        job_number: "", // Será gerado pelo trigger
      });

      toast({ title: t("jobs.success.created") });
      resetForm();
      setDialogOpen(false);
    } catch {
      toast({ variant: "destructive", title: "Error creating job" });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteJob.mutateAsync(id);
      toast({ title: t("jobs.success.deleted") });
    } catch {
      toast({ variant: "destructive", title: "Error deleting job" });
    }
  };

  const filtered = jobs?.filter((j: any) =>
    j.job_number?.toLowerCase().includes(search.toLowerCase()) ||
    j.customers?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const statuses = ["all", "scheduled", "in_progress", "completed", "cancelled"];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black">{t("jobs.title")}</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">{t("jobs.subtitle")}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-semibold gap-2">
              <Plus className="w-4 h-4" />
              {t("jobs.add")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display font-bold text-xl">{t("jobs.add")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label className="font-semibold text-xs uppercase tracking-wider">{t("jobs.customer")}</Label>
                <Select value={form.customer_id} onValueChange={(v) => setForm({...form, customer_id: v})}>
                  <SelectTrigger className="border-2"><SelectValue placeholder={t("jobs.customer")} /></SelectTrigger>
                  <SelectContent>
                    {customers?.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-xs uppercase tracking-wider">{t("jobs.team")}</Label>
                <Select value={form.team_id} onValueChange={(v) => setForm({...form, team_id: v})}>
                  <SelectTrigger className="border-2"><SelectValue placeholder={t("jobs.team")} /></SelectTrigger>
                  <SelectContent>
                    {teams?.map(tm => (
                      <SelectItem key={tm.id} value={tm.id}>{tm.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label className="font-semibold text-xs uppercase tracking-wider">{t("jobs.date")}</Label>
                  <Input type="date" value={form.scheduled_date} onChange={(e) => setForm({...form, scheduled_date: e.target.value})} required className="border-2" />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-xs uppercase tracking-wider">{t("jobs.timeStart")}</Label>
                  <Input type="time" value={form.scheduled_time_start} onChange={(e) => setForm({...form, scheduled_time_start: e.target.value})} className="border-2" />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-xs uppercase tracking-wider">{t("jobs.timeEnd")}</Label>
                  <Input type="time" value={form.scheduled_time_end} onChange={(e) => setForm({...form, scheduled_time_end: e.target.value})} className="border-2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="font-semibold text-xs uppercase tracking-wider">{t("jobs.serviceType")}</Label>
                  <Select value={form.service_type} onValueChange={(v) => setForm({...form, service_type: v})}>
                    <SelectTrigger className="border-2"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["standard_clean","deep_clean","move_in_out","post_construction","office"].map(s => (
                        <SelectItem key={s} value={s}>{t(`jobs.services.${s}`)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-xs uppercase tracking-wider">{t("jobs.price")}</Label>
                  <Input type="number" step="0.01" value={form.quoted_price} onChange={(e) => setForm({...form, quoted_price: e.target.value})} className="border-2" placeholder="$0.00" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1 border-2" onClick={() => setDialogOpen(false)}>
                  {t("common.cancel")}
                </Button>
                <Button type="submit" className="flex-1 font-semibold" disabled={saving || !form.customer_id}>
                  {saving ? t("jobs.saving") : t("jobs.save")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("jobs.search")} className="pl-9 border-2" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {statuses.map(s => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              className="border-2 text-xs font-semibold uppercase tracking-wider"
              onClick={() => setStatusFilter(s)}
            >
              {s === "all" ? t("jobs.all") : t(`jobs.statuses.${s}`)}
            </Button>
          ))}
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-muted animate-pulse" />)}
        </div>
      ) : !filtered?.length ? (
        <div className="bg-card border-2 border-border p-12 text-center">
          <Briefcase className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-display font-bold text-lg">{t("jobs.empty")}</p>
          <p className="text-muted-foreground text-sm mt-1">{t("jobs.emptyDesc")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((job: any) => (
            <div key={job.id} className="bg-card border-2 border-border p-4 flex items-center gap-4 hover:bg-accent/50 transition-colors">
              <div className="w-10 h-10 bg-secondary flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold">{job.job_number}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 ${STATUS_COLORS[job.status] || ""}`}>
                    {t(`jobs.statuses.${job.status}`)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-0.5">
                  <span>{job.customers?.full_name}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{job.scheduled_date}</span>
                  {job.quoted_price && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />${job.quoted_price}</span>}
                  {job.teams?.name && <span>{job.teams.name}</span>}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="shrink-0"><MoreHorizontal className="w-4 h-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleDelete(job.id)} className="text-destructive focus:text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />{t("customers.delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
