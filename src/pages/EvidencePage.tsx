import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Upload, Video, Image, MapPin, Calendar, MoreHorizontal, Trash2, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useEvidence, useCreateEvidence, useDeleteEvidence } from "@/hooks/useEvidence";
import { useJobs } from "@/hooks/useJobs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function EvidencePage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [jobFilter, setJobFilter] = useState("all");
  const { data: evidence, isLoading } = useEvidence(jobFilter);
  const { data: jobs } = useJobs("all");
  const createEvidence = useCreateEvidence();
  const deleteEvidence = useDeleteEvidence();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<"idle" | "capturing" | "done" | "failed">("idle");

  const [form, setForm] = useState({
    job_id: "",
    file_url: "",
    file_type: "photo",
    caption: "",
  });

  const resetForm = () => {
    setForm({ job_id: "", file_url: "", file_type: "photo", caption: "" });
    setGpsCoords(null);
    setGpsStatus("idle");
  };

  const captureGPS = () => {
    if (!navigator.geolocation) {
      setGpsStatus("failed");
      return;
    }
    setGpsStatus("capturing");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsStatus("done");
      },
      () => setGpsStatus("failed"),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    // Auto-capture GPS when uploading
    if (gpsStatus === "idle") captureGPS();

    try {
      const ext = file.name.split(".").pop();
      const path = `${user?.id}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("evidence").upload(path, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("evidence").getPublicUrl(path);
      const fileType = file.type.startsWith("video") ? "video" : "photo";
      setForm((prev) => ({ ...prev, file_url: urlData.publicUrl, file_type: fileType }));
      toast({ title: t("shield.evidence.uploaded") });
    } catch {
      toast({ variant: "destructive", title: t("shield.evidence.uploadError") });
    }
    setUploading(false);
  };

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
      await createEvidence.mutateAsync({
        company_id: profile.company_id,
        job_id: form.job_id,
        uploaded_by: user.id,
        file_url: form.file_url,
        file_type: form.file_type,
        caption: form.caption || undefined,
        latitude: gpsCoords?.lat,
        longitude: gpsCoords?.lng,
      });
      toast({ title: t("shield.evidence.success.created") });
      resetForm();
      setDialogOpen(false);
    } catch {
      toast({ variant: "destructive", title: t("shield.evidence.error") });
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEvidence.mutateAsync(deleteTarget.id);
      toast({ title: t("shield.evidence.success.deleted") });
    } catch {
      toast({ variant: "destructive", title: t("shield.evidence.error") });
    }
    setDeleteTarget(null);
  };

  const filtered = evidence?.filter((ev: any) =>
    ev.caption?.toLowerCase().includes(search.toLowerCase()) ||
    ev.jobs?.job_number?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black">{t("shield.evidence.title")}</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">{t("shield.evidence.subtitle")}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="font-semibold gap-2">
              <Upload className="w-4 h-4" />
              {t("shield.evidence.upload")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display font-bold text-xl">{t("shield.evidence.upload")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label className="font-semibold text-xs uppercase tracking-wider">{t("shield.evidence.job")}</Label>
                <Select value={form.job_id} onValueChange={(v) => setForm({ ...form, job_id: v })}>
                  <SelectTrigger className="border-2"><SelectValue placeholder={t("shield.evidence.selectJob")} /></SelectTrigger>
                  <SelectContent>
                    {jobs?.map((j: any) => (
                      <SelectItem key={j.id} value={j.id}>{j.job_number} — {j.customers?.full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-xs uppercase tracking-wider">{t("shield.evidence.file")}</Label>
                <Input type="file" accept="image/*,video/*" onChange={handleFileUpload} className="border-2" disabled={uploading} />
                {uploading && <p className="text-xs text-muted-foreground">{t("shield.evidence.uploading")}</p>}
                {form.file_url && (
                  <p className="text-xs text-emerald-600 font-semibold">{t("shield.evidence.fileReady")}</p>
                )}
              </div>

              {/* GPS Status */}
              <div className="flex items-center gap-3 p-3 bg-secondary/50 border border-border">
                <Crosshair className={`w-4 h-4 shrink-0 ${gpsStatus === "done" ? "text-emerald-600" : gpsStatus === "failed" ? "text-destructive" : "text-muted-foreground"}`} />
                <div className="flex-1 text-xs">
                  {gpsStatus === "idle" && <span className="text-muted-foreground">GPS será capturado automaticamente</span>}
                  {gpsStatus === "capturing" && <span className="text-amber-600 font-semibold animate-pulse">Capturando GPS...</span>}
                  {gpsStatus === "done" && gpsCoords && (
                    <span className="text-emerald-600 font-semibold">
                      GPS: {gpsCoords.lat.toFixed(6)}, {gpsCoords.lng.toFixed(6)}
                    </span>
                  )}
                  {gpsStatus === "failed" && <span className="text-destructive">GPS indisponível</span>}
                </div>
                {gpsStatus !== "capturing" && (
                  <Button type="button" variant="ghost" size="sm" onClick={captureGPS} className="text-xs h-7">
                    {gpsStatus === "done" ? "Recapturar" : "Capturar GPS"}
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-xs uppercase tracking-wider">{t("shield.evidence.caption")}</Label>
                <Textarea value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} className="border-2" rows={2} />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1 border-2" onClick={() => { setDialogOpen(false); resetForm(); }}>
                  {t("common.cancel")}
                </Button>
                <Button type="submit" className="flex-1 font-semibold" disabled={saving || !form.job_id || !form.file_url}>
                  {saving ? t("common.loading") : t("shield.evidence.save")}
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
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("shield.evidence.search")} className="pl-9 border-2" />
        </div>
        <Select value={jobFilter} onValueChange={setJobFilter}>
          <SelectTrigger className="border-2 w-48"><SelectValue placeholder={t("shield.evidence.allJobs")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("shield.evidence.allJobs")}</SelectItem>
            {jobs?.map((j: any) => (
              <SelectItem key={j.id} value={j.id}>{j.job_number}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-48 bg-muted animate-pulse" />)}
        </div>
      ) : !filtered?.length ? (
        <div className="bg-card border-2 border-border p-12 text-center">
          <Video className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-display font-bold text-lg">{t("shield.evidence.empty")}</p>
          <p className="text-muted-foreground text-sm mt-1">{t("shield.evidence.emptyDesc")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((ev: any) => (
            <div key={ev.id} className="bg-card border-2 border-border overflow-hidden group">
              <div className="aspect-video bg-muted relative overflow-hidden">
                {ev.file_type === "video" ? (
                  <video src={ev.file_url} className="w-full h-full object-cover" />
                ) : (
                  <img src={ev.file_url} alt={ev.caption || ""} className="w-full h-full object-cover" />
                )}
                <span className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                  {ev.file_type === "video" ? <Video className="w-3 h-3 inline mr-1" /> : <Image className="w-3 h-3 inline mr-1" />}
                  {ev.file_type}
                </span>
                {ev.latitude && (
                  <span className="absolute top-2 right-2 bg-emerald-600/90 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <MapPin className="w-3 h-3" />GPS ✓
                  </span>
                )}
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">{ev.jobs?.job_number}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setDeleteTarget(ev)} className="text-destructive focus:text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />{t("customers.delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {ev.caption && <p className="text-sm truncate">{ev.caption}</p>}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(ev.created_at).toLocaleDateString()}</span>
                  {ev.latitude && (
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <MapPin className="w-3 h-3" />{ev.latitude.toFixed(4)}, {ev.longitude.toFixed(4)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete evidence?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The file will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t("customers.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}