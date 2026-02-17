import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Plus, Users, Mail, Phone, MapPin, MoreHorizontal, Trash2, Pencil, ToggleLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from "@/hooks/useCustomers";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Customer = Tables<"customers">;

const emptyForm = {
  full_name: "", email: "", phone: "", property_address: "",
  property_city: "", property_state: "", property_zip: "",
  property_sqft: "", property_type: "residential", notes: "",
};

export default function CustomersPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { data: customers, isLoading } = useCustomers();
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

  const [form, setForm] = useState(emptyForm);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingCustomer(null);
  };

  const openEdit = (c: Customer) => {
    setEditingCustomer(c);
    setForm({
      full_name: c.full_name,
      email: c.email || "",
      phone: c.phone || "",
      property_address: c.property_address || "",
      property_city: c.property_city || "",
      property_state: c.property_state || "",
      property_zip: c.property_zip || "",
      property_sqft: c.property_sqft?.toString() || "",
      property_type: c.property_type || "residential",
      notes: c.notes || "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingCustomer) {
        await updateCustomer.mutateAsync({
          id: editingCustomer.id,
          full_name: form.full_name,
          email: form.email || null,
          phone: form.phone || null,
          property_address: form.property_address || null,
          property_city: form.property_city || null,
          property_state: form.property_state || null,
          property_zip: form.property_zip || null,
          property_sqft: form.property_sqft ? parseInt(form.property_sqft) : null,
          property_type: form.property_type,
          notes: form.notes || null,
        });
        toast({ title: t("customers.success.updated") });
      } else {
        const { data: profile } = await supabase.from("profiles").select("company_id").single();
        if (!profile?.company_id) {
          toast({ variant: "destructive", title: "Company not found" });
          setSaving(false);
          return;
        }
        await createCustomer.mutateAsync({
          company_id: profile.company_id,
          full_name: form.full_name,
          email: form.email || null,
          phone: form.phone || null,
          property_address: form.property_address || null,
          property_city: form.property_city || null,
          property_state: form.property_state || null,
          property_zip: form.property_zip || null,
          property_sqft: form.property_sqft ? parseInt(form.property_sqft) : null,
          property_type: form.property_type,
          notes: form.notes || null,
        });
        toast({ title: t("customers.success.created") });
      }
      resetForm();
      setDialogOpen(false);
    } catch {
      toast({ variant: "destructive", title: editingCustomer ? "Error updating customer" : "Error creating customer" });
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCustomer.mutateAsync(deleteTarget.id);
      toast({ title: t("customers.success.deleted") });
    } catch {
      toast({ variant: "destructive", title: "Error deleting customer" });
    }
    setDeleteTarget(null);
  };

  const handleToggleActive = async (c: Customer) => {
    try {
      await updateCustomer.mutateAsync({ id: c.id, is_active: !c.is_active });
      toast({ title: c.is_active ? "Customer deactivated" : "Customer activated" });
    } catch {
      toast({ variant: "destructive", title: "Error updating status" });
    }
  };

  const filtered = customers?.filter((c) =>
    c.full_name.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black">{t("customers.title")}</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">{t("customers.subtitle")}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="font-semibold gap-2">
              <Plus className="w-4 h-4" />
              {t("customers.add")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display font-bold text-xl">
                {editingCustomer ? t("customers.edit") : t("customers.add")}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label className="font-semibold text-xs uppercase tracking-wider">{t("customers.name")}</Label>
                <Input value={form.full_name} onChange={(e) => setForm({...form, full_name: e.target.value})} required className="border-2" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="font-semibold text-xs uppercase tracking-wider">{t("customers.email")}</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="border-2" />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-xs uppercase tracking-wider">{t("customers.phone")}</Label>
                  <Input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="border-2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-xs uppercase tracking-wider">{t("customers.address")}</Label>
                <Input value={form.property_address} onChange={(e) => setForm({...form, property_address: e.target.value})} className="border-2" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label className="font-semibold text-xs uppercase tracking-wider">{t("customers.city")}</Label>
                  <Input value={form.property_city} onChange={(e) => setForm({...form, property_city: e.target.value})} className="border-2" />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-xs uppercase tracking-wider">{t("customers.state")}</Label>
                  <Input value={form.property_state} onChange={(e) => setForm({...form, property_state: e.target.value})} maxLength={2} className="border-2" />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-xs uppercase tracking-wider">{t("customers.zip")}</Label>
                  <Input value={form.property_zip} onChange={(e) => setForm({...form, property_zip: e.target.value})} className="border-2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="font-semibold text-xs uppercase tracking-wider">{t("customers.sqft")}</Label>
                  <Input type="number" value={form.property_sqft} onChange={(e) => setForm({...form, property_sqft: e.target.value})} className="border-2" />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-xs uppercase tracking-wider">{t("customers.propertyType")}</Label>
                  <Select value={form.property_type} onValueChange={(v) => setForm({...form, property_type: v})}>
                    <SelectTrigger className="border-2"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">{t("customers.types.residential")}</SelectItem>
                      <SelectItem value="commercial">{t("customers.types.commercial")}</SelectItem>
                      <SelectItem value="office">{t("customers.types.office")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1 border-2" onClick={() => { setDialogOpen(false); resetForm(); }}>
                  {t("common.cancel")}
                </Button>
                <Button type="submit" className="flex-1 font-semibold" disabled={saving}>
                  {saving ? t("customers.saving") : editingCustomer ? t("customers.update") : t("customers.save")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("customers.search")} className="pl-9 border-2" />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-muted animate-pulse" />)}
        </div>
      ) : !filtered?.length ? (
        <div className="bg-card border-2 border-border p-12 text-center">
          <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-display font-bold text-lg">{t("customers.empty")}</p>
          <p className="text-muted-foreground text-sm mt-1">{t("customers.emptyDesc")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((customer) => (
            <div key={customer.id} className="bg-card border-2 border-border p-4 flex items-center gap-4 hover:bg-accent/50 transition-colors">
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center shrink-0">
                <span className="font-display font-bold text-primary text-sm">
                  {customer.full_name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{customer.full_name}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-0.5">
                  {customer.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{customer.email}</span>}
                  {customer.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{customer.phone}</span>}
                  {customer.property_address && <span className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3 shrink-0" />{customer.property_address}</span>}
                </div>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 ${customer.is_active ? "text-emerald-600 bg-emerald-600/10" : "text-muted-foreground bg-muted"}`}>
                {customer.is_active ? t("customers.active") : t("customers.inactive")}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="shrink-0"><MoreHorizontal className="w-4 h-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openEdit(customer)}>
                    <Pencil className="w-4 h-4 mr-2" />{t("customers.edit")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleToggleActive(customer)}>
                    <ToggleLeft className="w-4 h-4 mr-2" />
                    {customer.is_active ? t("customers.deactivate") : t("customers.activate")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setDeleteTarget(customer)} className="text-destructive focus:text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />{t("customers.delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("customers.confirmDelete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("customers.confirmDeleteDesc", { name: deleteTarget?.full_name })}
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