import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Plus, AlertTriangle, CheckCircle2, Clock, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useDisputes, useCreateDispute, useUpdateDispute, useDeleteDispute } from "@/hooks/useDisputes";
import { useJobs } from "@/hooks/useJobs";
import { useCustomers } from "@/hooks/useCustomers";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const STATUS_CONFIG: Record<string, { icon: React.ElementType; className: string }> = {
  open: { icon: AlertTriangle, className: "text-amber-600 bg-amber-600/10" },
  investigating: { icon: Clock, className: "text-blue-600 bg-blue-600/10" },
  resolved: { icon: CheckCircle2, className: "text-emerald-600 bg-emerald-600/10" },
  dismissed: { icon: AlertTriangle, className: "text-muted-foreground bg-muted" },
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "text-muted-foreground",
  medium: "text-amber-600",
  high: "text-primary",
  critical: "text-destructive",
};

export default function DisputesPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: disputes, isLoading } = useDisputes(statusFilter);
  const { data: jobs } = useJobs("all");
  const { data: customers } = useCustomers();
  const createDispute = useCreateDispute();
  const updateDispute = useUpdateDispute();
  const deleteDispute = useDeleteDispute();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    job_id: "",
    customer_id: "",
    title: "",
    description: "",
    priority: "medium",
  });

  const resetForm = () => setForm({ job_id: "", customer_id: "", title: "", description: "", priority: "medium" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: profile } = await supabase.from("profiles").select("company_id").single();
      if (!profile?.company_id || !user) {
        toast({ variant: "destructive", title: "Company not found" });
        setSaving(false);
        return;
      }
      await createDispute.mutateAsync({
        company_id: profile.company_id,
        job_id: form.job_id,
        customer_id: form.customer_id,
        opened_by: user.id,
        title: form.title,
        description: form.description || undefined,
        priority: form.priority,
      });
      toast({ title: t("shield.disputes.success.created") });
      resetForm();
      setDialogOpen(false);
    } catch {
      toast({ variant: "destructive", title: t("shield.disputes.error") });
    }
    setSaving(false);
  };

  const handleResolve = async (id: string) => {
    try {
      await updateDispute.mutateAsync({
        id,
        status: "resolved",
        resolved_by: user?.id,
        resolved_at: new Date().toISOString(),
      });
      toast({ title: t("shield.disputes.success.resolved") });
    } catch {
      toast({ variant: "destructive", title: t("shield.disputes.error") });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDispute.mutateAsync(id);
      toast({ title: t("shield.disputes.success.deleted") });
    } catch {
      toast({ variant: "destructive", title: t("shield.disputes.error") });
    }
  };

  const filtered = disputes?.filter((d: any) =>
    d.title?.toLowerCase().includes(search.toLowerCase()) ||
    d.customers?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    d.jobs?.job_number?.toLowerCase().includes(search.toLowerCase())
  );

  const statuses = ["all", "open", "investigating", "resolved", "dismissed"];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black">{t("shield.disputes.title")}</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">{t("shield.disputes.subtitle")}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-semibold gap-2">
              <Plus className="w-4 h-4" />
              {t("shield.disputes.add")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display font-bold text-xl">{t("shield.disputes.add")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label className="font-semibold text-xs uppercase tracking-wider">{t("shield.disputes.disputeTitle")}</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="border-2" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="font-semibold text-xs uppercase tracking-wider">{t("jobs.customer")}</Label>
                  <Select value={form.customer_id} onValueChange={(v) => setForm({ ...form, customer_id: v })}>
                    <SelectTrigger className="border-2"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {customers?.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.full_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-xs uppercase tracking-wider">{t("shield.evidence.job")}</Label>
                  <Select value={form.job_id} onValueChange={(v) => setForm({ ...form, job_id: v })}>
                    <SelectTrigger className="border-2"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {jobs?.map((j: any) => (
                        <SelectItem key={j.id} value={j.id}>{j.job_number}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-xs uppercase tracking-wider">{t("shield.disputes.priority")}</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                  <SelectTrigger className="border-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["low", "medium", "high", "critical"].map((p) => (
                      <SelectItem key={p} value={p}>{t(`shield.disputes.priorities.${p}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-xs uppercase tracking-wider">{t("shield.disputes.description")}</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border-2" rows={3} />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1 border-2" onClick={() => setDialogOpen(false)}>
                  {t("common.cancel")}
                </Button>
                <Button type="submit" className="flex-1 font-semibold" disabled={saving || !form.job_id || !form.customer_id}>
                  {saving ? t("common.loading") : t("shield.disputes.save")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("shield.disputes.search")} className="pl-9 border-2" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {statuses.map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              className="border-2 text-xs font-semibold uppercase tracking-wider"
              onClick={() => setStatusFilter(s)}
            >
              {s === "all" ? t("jobs.all") : t(`shield.disputes.statuses.${s}`)}
            </Button>
          ))}
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-muted animate-pulse" />)}
        </div>
      ) : !filtered?.length ? (
        <div className="bg-card border-2 border-border p-12 text-center">
          <AlertTriangle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-display font-bold text-lg">{t("shield.disputes.empty")}</p>
          <p className="text-muted-foreground text-sm mt-1">{t("shield.disputes.emptyDesc")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((dispute: any) => {
            const config = STATUS_CONFIG[dispute.status] || STATUS_CONFIG.open;
            const StatusIcon = config.icon;
            return (
              <div key={dispute.id} className="bg-card border-2 border-border p-4 flex items-center gap-4 hover:bg-accent/50 transition-colors">
                <div className={`w-10 h-10 flex items-center justify-center shrink-0 ${config.className}`}>
                  <StatusIcon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold truncate">{dispute.title}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 ${config.className}`}>
                      {t(`shield.disputes.statuses.${dispute.status}`)}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${PRIORITY_COLORS[dispute.priority] || ""}`}>
                      {t(`shield.disputes.priorities.${dispute.priority}`)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-0.5">
                    <span>{dispute.customers?.full_name}</span>
                    <span>{dispute.jobs?.job_number}</span>
                    <span>{new Date(dispute.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0"><MoreHorizontal className="w-4 h-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {dispute.status === "open" && (
                      <DropdownMenuItem onClick={() => handleResolve(dispute.id)}>
                        <CheckCircle2 className="w-4 h-4 mr-2" />{t("shield.disputes.resolve")}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => handleDelete(dispute.id)} className="text-destructive focus:text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />{t("customers.delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
