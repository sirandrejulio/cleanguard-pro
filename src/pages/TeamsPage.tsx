import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Plus, UserCog, MoreHorizontal, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useTeams, useCreateTeam, useDeleteTeam } from "@/hooks/useTeams";
import { supabase } from "@/integrations/supabase/client";

export default function TeamsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { data: teams, isLoading } = useTeams();
  const createTeam = useCreateTeam();
  const deleteTeam = useDeleteTeam();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    color: "#EF4444",
    max_jobs_per_day: "8",
  });

  const resetForm = () => setForm({ name: "", color: "#EF4444", max_jobs_per_day: "8" });

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

      await createTeam.mutateAsync({
        company_id: profile.company_id,
        name: form.name,
        color: form.color,
        max_jobs_per_day: parseInt(form.max_jobs_per_day),
      });

      toast({ title: t("teams.success.created") });
      resetForm();
      setDialogOpen(false);
    } catch {
      toast({ variant: "destructive", title: "Error creating team" });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTeam.mutateAsync(id);
      toast({ title: t("teams.success.deleted") });
    } catch {
      toast({ variant: "destructive", title: "Error deleting team" });
    }
  };

  const filtered = teams?.filter((tm) =>
    tm.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-black">{t("teams.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("teams.subtitle")}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-semibold gap-2">
              <Plus className="w-4 h-4" />
              {t("teams.add")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display font-bold text-xl">{t("teams.add")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label className="font-semibold text-xs uppercase tracking-wider">{t("teams.name")}</Label>
                <Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required className="border-2" placeholder="Team Alpha" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="font-semibold text-xs uppercase tracking-wider">{t("teams.color")}</Label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.color} onChange={(e) => setForm({...form, color: e.target.value})} className="w-10 h-10 border-2 border-border cursor-pointer" />
                    <Input value={form.color} onChange={(e) => setForm({...form, color: e.target.value})} className="border-2 flex-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-xs uppercase tracking-wider">{t("teams.maxJobs")}</Label>
                  <Input type="number" value={form.max_jobs_per_day} onChange={(e) => setForm({...form, max_jobs_per_day: e.target.value})} min="1" max="20" className="border-2" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1 border-2" onClick={() => setDialogOpen(false)}>
                  {t("common.cancel")}
                </Button>
                <Button type="submit" className="flex-1 font-semibold" disabled={saving}>
                  {saving ? t("teams.saving") : t("teams.save")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("teams.search")} className="pl-9 border-2" />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-40 bg-muted animate-pulse" />)}
        </div>
      ) : !filtered?.length ? (
        <div className="bg-card border-2 border-border p-12 text-center">
          <UserCog className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-display font-bold text-lg">{t("teams.empty")}</p>
          <p className="text-muted-foreground text-sm mt-1">{t("teams.emptyDesc")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((team) => (
            <div key={team.id} className="bg-card border-2 border-border overflow-hidden">
              <div className="h-2" style={{ backgroundColor: team.color || "#EF4444" }} />
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg">{team.name}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDelete(team.id)} className="text-destructive focus:text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />{t("customers.delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {t("teams.noMembers")}
                  </span>
                  <span>
                    {t("teams.maxJobs")}: {team.max_jobs_per_day}
                  </span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 ${team.is_active ? "text-emerald-600 bg-emerald-600/10" : "text-muted-foreground bg-muted"}`}>
                  {team.is_active ? t("customers.active") : t("customers.inactive")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
