import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMarketplaceListings, useCreateListing, useUpdateListing, useDeleteListing } from "@/hooks/useMarketplace";
import { useJobs } from "@/hooks/useJobs";
import { useCompany } from "@/hooks/useCompany";
import { Store, Calendar, DollarSign, MapPin, Clock, Plus, Trash2, Eye, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function MarketplacePage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { data: company } = useCompany();
  const { data: listings = [], isLoading } = useMarketplaceListings();
  const { data: jobs = [] } = useJobs();
  const createListing = useCreateListing();
  const updateListing = useUpdateListing();
  const deleteListing = useDeleteListing();

  const [open, setOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [form, setForm] = useState({
    job_id: "",
    title: "",
    description: "",
    listing_date: new Date().toISOString().split("T")[0],
    base_price_cents: 0,
  });

  const activeListings = listings.filter((l) => l.status === "active");
  const filledListings = listings.filter((l) => l.status === "filled");
  const totalRevenue = filledListings.reduce((s, l) => s + (l.current_price_cents || 0), 0);

  const filtered = listings.filter((l) => statusFilter === "all" || l.status === statusFilter);

  // Jobs not already listed
  const availableJobs = jobs.filter((j) => j.status === "scheduled" && !listings.some((l) => l.job_id === j.id));

  const handleCreate = async () => {
    if (!form.job_id || !form.title || !company?.id) return;
    try {
      await createListing.mutateAsync({
        company_id: company.id,
        job_id: form.job_id,
        title: form.title,
        description: form.description || undefined,
        listing_date: form.listing_date,
        base_price_cents: form.base_price_cents,
        current_price_cents: form.base_price_cents,
      });
      toast({ title: "Listing created" });
      setOpen(false);
      setForm({ job_id: "", title: "", description: "", listing_date: new Date().toISOString().split("T")[0], base_price_cents: 0 });
    } catch {
      toast({ title: "Error creating listing", variant: "destructive" });
    }
  };

  const formatCents = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black">{t("fillModule.marketplace.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("fillModule.marketplace.subtitle")}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="font-bold border-2 gap-2"><Plus className="w-4 h-4" /> New Listing</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Marketplace Listing</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Job</Label>
                <Select value={form.job_id} onValueChange={(v) => setForm({ ...form, job_id: v })}>
                  <SelectTrigger className="border-2"><SelectValue placeholder="Select a job" /></SelectTrigger>
                  <SelectContent>
                    {availableJobs.map((j) => (
                      <SelectItem key={j.id} value={j.id}>{j.job_number} — {j.scheduled_date}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Standard Clean Slot Available" className="border-2" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Listing Date</Label>
                  <Input type="date" value={form.listing_date} onChange={(e) => setForm({ ...form, listing_date: e.target.value })} className="border-2" />
                </div>
                <div>
                  <Label>Price (cents)</Label>
                  <Input type="number" value={form.base_price_cents} onChange={(e) => setForm({ ...form, base_price_cents: Number(e.target.value) })} className="border-2" />
                </div>
              </div>
              <Button onClick={handleCreate} disabled={createListing.isPending || !form.job_id || !form.title} className="w-full font-bold border-2">
                {createListing.isPending ? "Creating..." : "Create Listing"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border-2 border-border p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/10 flex items-center justify-center">
            <Store className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("fillModule.marketplace.openSlots")}</p>
            <p className="font-display text-xl font-black">{activeListings.length}</p>
          </div>
        </div>
        <div className="bg-card border-2 border-border p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-600/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("fillModule.marketplace.potentialRevenue")}</p>
            <p className="font-display text-xl font-black">{formatCents(activeListings.reduce((s, l) => s + l.current_price_cents, 0))}</p>
          </div>
        </div>
        <div className="bg-card border-2 border-border p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600/10 flex items-center justify-center">
            <Tag className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Filled Revenue</p>
            <p className="font-display text-xl font-black">{formatCents(totalRevenue)}</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-40 border-2"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="filled">Filled</SelectItem>
          <SelectItem value="expired">Expired</SelectItem>
        </SelectContent>
      </Select>

      {/* Listing Cards */}
      {isLoading ? (
        <div className="bg-card border-2 border-border p-8 text-center text-muted-foreground">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border-2 border-border p-8 text-center">
          <Store className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">{t("fillModule.marketplace.empty")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((listing) => {
            const job = listing.jobs as any;
            return (
              <div key={listing.id} className="bg-card border-2 border-border hover:border-primary transition-colors">
                <div className="p-4 border-b-2 border-border flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold">{job?.job_number || "—"}</span>
                  <span className={`text-xs font-bold uppercase px-2 py-1 ${
                    listing.status === "active" ? "bg-primary/10 text-primary" :
                    listing.status === "filled" ? "bg-emerald-100 text-emerald-700" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {listing.status}
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  <p className="font-semibold">{listing.title}</p>
                  {listing.description && <p className="text-sm text-muted-foreground">{listing.description}</p>}
                  <div className="space-y-1.5 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" />
                      {job?.customers?.property_address || "—"}, {job?.customers?.property_city || ""}
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      {listing.listing_date}
                    </p>
                    <p className="flex items-center gap-2">
                      <Eye className="w-3.5 h-3.5" />
                      {listing.views_count || 0} views
                    </p>
                  </div>
                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <span className="font-display text-lg font-black text-primary">
                      {formatCents(listing.current_price_cents)}
                    </span>
                    <div className="flex gap-1">
                      {listing.status === "active" && (
                        <Button variant="outline" size="sm" className="border-2 text-xs font-bold"
                          onClick={() => updateListing.mutateAsync({ id: listing.id, status: "filled", filled_at: new Date().toISOString() }).then(() => toast({ title: "Listing filled!" }))}>
                          Mark Filled
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete listing?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteListing.mutateAsync(listing.id).then(() => toast({ title: "Listing deleted" }))}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
