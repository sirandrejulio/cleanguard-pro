import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { List, Plus, Phone, Mail, Clock, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function WaitlistPage() {
  const { t } = useTranslation();
  const { toast } = useToast();

  // Waitlist is customer-based — show active customers as potential waitlist entries
  const { data: customers = [] } = useQuery({
    queryKey: ["waitlist-customers"],
    queryFn: async () => {
      const { data } = await supabase
        .from("customers")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const [search, setSearch] = useState("");

  const filtered = customers.filter((c) =>
    c.full_name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black">{t("fillModule.waitlist.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("fillModule.waitlist.subtitle")}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border-2 border-border p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/10 flex items-center justify-center">
            <List className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("fillModule.waitlist.totalOnList")}</p>
            <p className="font-display text-xl font-black">{customers.length}</p>
          </div>
        </div>
        <div className="bg-card border-2 border-border p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-600/10 flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("fillModule.waitlist.activeCustomers")}</p>
            <p className="font-display text-xl font-black">{customers.filter(c => c.is_active).length}</p>
          </div>
        </div>
        <div className="bg-card border-2 border-border p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-600/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("fillModule.waitlist.avgWait")}</p>
            <p className="font-display text-xl font-black">2.4h</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t("fillModule.waitlist.search")}
        className="max-w-md border-2"
      />

      {/* List */}
      <div className="bg-card border-2 border-border">
        <div className="p-4 border-b-2 border-border">
          <h2 className="font-display font-bold">{t("fillModule.waitlist.customerList")}</h2>
        </div>
        {filtered.length === 0 ? (
          <div className="p-8 text-center">
            <List className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">{t("fillModule.waitlist.empty")}</p>
          </div>
        ) : (
          <div className="divide-y-2 divide-border">
            {filtered.map((customer) => (
              <div key={customer.id} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-display font-black text-primary text-sm">
                    {customer.full_name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{customer.full_name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {customer.property_address}, {customer.property_city}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
                  {customer.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {customer.phone}
                    </span>
                  )}
                  {customer.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {customer.email}
                    </span>
                  )}
                </div>
                <Button variant="outline" size="sm" className="border-2 font-semibold shrink-0">
                  {t("fillModule.waitlist.notify")}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
