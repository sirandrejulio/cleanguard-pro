import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useWaitlist, useCreateWaitlistEntry, useUpdateWaitlistEntry, useDeleteWaitlistEntry } from "@/hooks/useWaitlist";
import { useCustomers } from "@/hooks/useCustomers";
import { useCompany } from "@/hooks/useCompany";
import { List, Plus, Phone, Mail, Clock, UserPlus, Bell, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function WaitlistPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { data: company } = useCompany();
  const { data: entries = [], isLoading } = useWaitlist();
  const { data: customers = [] } = useCustomers();
  const createEntry = useCreateWaitlistEntry();
  const updateEntry = useUpdateWaitlistEntry();
  const deleteEntry = useDeleteWaitlistEntry();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [form, setForm] = useState({
    customer_id: "",
    preferred_service_type: "standard_clean",
    preferred_date: "",
    notes: "",
    priority: 1,
  });

  const filtered = entries.filter((e: any) => {
    const name = e.customers?.full_name || "";
    const matchSearch = name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const waiting = entries.filter((e: any) => e.status === "waiting").length;
  const notified = entries.filter((e: any) => e.status === "notified").length;
  const filled = entries.filter((e: any) => e.status === "filled").length;

  const handleCreate = async () => {
    if (!form.customer_id || !company?.id) return;
    try {
      await createEntry.mutateAsync({
        company_id: company.id,
        customer_id: form.customer_id,
        preferred_service_type: form.preferred_service_type,
        preferred_date: form.preferred_date || undefined,
        notes: form.notes || undefined,
        priority: form.priority,
      });
      toast({ title: "Customer added to waitlist" });
      setOpen(false);
      setForm({ customer_id: "", preferred_service_type: "standard_clean", preferred_date: "", notes: "", priority: 1 });
    } catch {
      toast({ title: "Error adding to waitlist", variant: "destructive" });
    }
  };

  const handleNotify = async (id: string) => {
    await updateEntry.mutateAsync({ id, status: "notified", notified_at: new Date().toISOString() });
    toast({ title: "Customer notified" });
  };

  const handleFill = async (id: string) => {
    await updateEntry.mutateAsync({ id, status: "filled", filled_at: new Date().toISOString() });
    toast({ title: "Slot filled!" });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black">{t("fillModule.waitlist.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("fillModule.waitlist.subtitle")}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="font-bold border-2 gap-2"><Plus className="w-4 h-4" /> Add to Waitlist</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add to Waitlist</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Customer</Label>
                <Select value={form.customer_id} onValueChange={(v) => setForm({ ...form, customer_id: v })}>
                  <SelectTrigger className="border-2"><SelectValue placeholder="Select customer" /></SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Service Type</Label>
                <Select value={form.preferred_service_type} onValueChange={(v) => setForm({ ...form, preferred_service_type: v })}>
                  <SelectTrigger className="border-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard_clean">Standard Clean</SelectItem>
                    <SelectItem value="deep_clean">Deep Clean</SelectItem>
                    <SelectItem value="move_in_out">Move In/Out</SelectItem>
                    <SelectItem value="post_construction">Post Construction</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Preferred Date</Label>
                <Input type="date" value={form.preferred_date} onChange={(e) => setForm({ ...form, preferred_date: e.target.value })} className="border-2" />
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={String(form.priority)} onValueChange={(v) => setForm({ ...form, priority: Number(v) })}>
                  <SelectTrigger className="border-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Normal</SelectItem>
                    <SelectItem value="2">High</SelectItem>
                    <SelectItem value="3">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="border-2" />
              </div>
              <Button onClick={handleCreate} disabled={createEntry.isPending || !form.customer_id} className="w-full font-bold border-2">
                {createEntry.isPending ? "Adding..." : "Add to Waitlist"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border-2 border-border p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/10 flex items-center justify-center">
            <List className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Waiting</p>
            <p className="font-display text-xl font-black">{waiting}</p>
          </div>
        </div>
        <div className="bg-card border-2 border-border p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-600/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Notified</p>
            <p className="font-display text-xl font-black">{notified}</p>
          </div>
        </div>
        <div className="bg-card border-2 border-border p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-600/10 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Filled</p>
            <p className="font-display text-xl font-black">{filled}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("fillModule.waitlist.search")} className="max-w-md border-2" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 border-2"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="waiting">Waiting</SelectItem>
            <SelectItem value="notified">Notified</SelectItem>
            <SelectItem value="filled">Filled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      <div className="bg-card border-2 border-border">
        <div className="p-4 border-b-2 border-border">
          <h2 className="font-display font-bold">{t("fillModule.waitlist.customerList")}</h2>
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <List className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">{t("fillModule.waitlist.empty")}</p>
          </div>
        ) : (
          <div className="divide-y-2 divide-border">
            {filtered.map((entry: any) => (
              <div key={entry.id} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-display font-black text-primary text-sm">
                    {(entry.customers?.full_name || "?").charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold truncate">{entry.customers?.full_name || "—"}</p>
                    <span className={`text-xs font-bold uppercase px-2 py-0.5 ${
                      entry.status === "waiting" ? "bg-amber-100 text-amber-700" :
                      entry.status === "notified" ? "bg-blue-100 text-blue-700" :
                      "bg-emerald-100 text-emerald-700"
                    }`}>
                      {entry.status}
                    </span>
                    {entry.priority >= 2 && (
                      <span className="text-xs font-bold uppercase px-2 py-0.5 bg-destructive/10 text-destructive">
                        {entry.priority === 3 ? "URGENT" : "HIGH"}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {entry.preferred_service_type.replace(/_/g, " ")}
                    {entry.preferred_date && ` • ${entry.preferred_date}`}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                  {entry.customers?.phone && (
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {entry.customers.phone}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {entry.status === "waiting" && (
                    <Button variant="outline" size="sm" className="border-2 font-semibold gap-1" onClick={() => handleNotify(entry.id)}>
                      <Bell className="w-3 h-3" /> Notify
                    </Button>
                  )}
                  {entry.status === "notified" && (
                    <Button variant="outline" size="sm" className="border-2 font-semibold gap-1 text-emerald-600" onClick={() => handleFill(entry.id)}>
                      <CheckCircle className="w-3 h-3" /> Fill
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove from waitlist?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteEntry.mutateAsync(entry.id).then(() => toast({ title: "Removed from waitlist" }))}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
