import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Plus, Users, Mail, Phone, MapPin, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useCustomers, useCreateCustomer, useDeleteCustomer } from "@/hooks/useCustomers";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function CustomersPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { data: customers, isLoading } = useCustomers();
  const createCustomer = useCreateCustomer();
  const deleteCustomer = useDeleteCustomer();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    property_address: "",
    property_city: "",
    property_state: "",
    property_zip: "",
    property_sqft: "",
    property_type: "residential",
    notes: "",
  });

  const resetForm = () => setForm({
    full_name: "", email: "", phone: "", property_address: "",
    property_city: "", property_state: "", property_zip: "",
    property_sqft: "", property_type: "residential", notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Buscar company_id do perfil do usuário
      const { data: profile } = await supabase
        .from("profiles")
        .select("company_id")
        .single();

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
      resetForm();
      setDialogOpen(false);
    } catch {
      toast({ variant: "destructive", title: "Error creating customer" });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCustomer.mutateAsync(id);
      toast({ title: t("customers.success.deleted") });
    } catch {
      toast({ variant: "destructive", title: "Error deleting customer" });
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-black">{t("customers.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("customers.subtitle")}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-semibold gap-2">
              <Plus className="w-4 h-4" />
              {t("customers.add")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display font-bold text-xl">{t("customers.add")}</DialogTitle>
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
                <Button type="button" variant="outline" className="flex-1 border-2" onClick={() => setDialogOpen(false)}>
                  {t("common.cancel")}
                </Button>
                <Button type="submit" className="flex-1 font-semibold" disabled={saving}>
                  {saving ? t("customers.saving") : t("customers.save")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("customers.search")}
          className="pl-9 border-2"
        />
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
                  <DropdownMenuItem onClick={() => handleDelete(customer.id)} className="text-destructive focus:text-destructive">
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
