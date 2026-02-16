import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Building2, User, CreditCard, Shield, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user, updatePassword } = useAuth();
  const [saving, setSaving] = useState(false);

  // Company form
  const [company, setCompany] = useState({
    id: "",
    name: "",
    phone: "",
    business_address: "",
    timezone: "America/New_York",
    default_currency: "USD",
    shield_enabled: true,
    route_enabled: true,
    fill_enabled: true,
  });

  // Profile form
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  // Password form
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: prof } = await supabase.from("profiles").select("*, companies(*)").single();
    if (prof) {
      setProfile({
        full_name: prof.full_name || "",
        email: prof.email || "",
        phone: prof.phone || "",
      });
      const comp = (prof as any).companies;
      if (comp) {
        setCompany({
          id: comp.id,
          name: comp.name || "",
          phone: comp.phone || "",
          business_address: comp.business_address || "",
          timezone: comp.timezone || "America/New_York",
          default_currency: comp.default_currency || "USD",
          shield_enabled: comp.shield_enabled ?? true,
          route_enabled: comp.route_enabled ?? true,
          fill_enabled: comp.fill_enabled ?? true,
        });
      }
    }
  };

  const saveCompany = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("companies")
        .update({
          name: company.name,
          phone: company.phone,
          business_address: company.business_address,
          timezone: company.timezone,
          default_currency: company.default_currency,
          shield_enabled: company.shield_enabled,
          route_enabled: company.route_enabled,
          fill_enabled: company.fill_enabled,
        })
        .eq("id", company.id);
      if (error) throw error;
      toast({ title: t("settings.success.company") });
    } catch {
      toast({ variant: "destructive", title: t("settings.error") });
    }
    setSaving(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
        })
        .eq("user_id", user?.id);
      if (error) throw error;
      toast({ title: t("settings.success.profile") });
    } catch {
      toast({ variant: "destructive", title: t("settings.error") });
    }
    setSaving(false);
  };

  const changePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({ variant: "destructive", title: t("settings.passwordMismatch") });
      return;
    }
    if (passwords.newPassword.length < 8) {
      toast({ variant: "destructive", title: t("auth.signup.errors.weakPassword") });
      return;
    }
    setSaving(true);
    try {
      const { error } = await updatePassword(passwords.newPassword);
      if (error) throw error;
      toast({ title: t("settings.success.password") });
      setPasswords({ newPassword: "", confirmPassword: "" });
    } catch {
      toast({ variant: "destructive", title: t("settings.error") });
    }
    setSaving(false);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-black">{t("settings.title")}</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">{t("settings.subtitle")}</p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="border-2 border-border bg-transparent p-0 h-auto flex-wrap">
          <TabsTrigger value="company" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold text-xs uppercase tracking-wider px-4 py-2">
            <Building2 className="w-4 h-4" />
            {t("settings.tabs.company")}
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold text-xs uppercase tracking-wider px-4 py-2">
            <User className="w-4 h-4" />
            {t("settings.tabs.profile")}
          </TabsTrigger>
          <TabsTrigger value="subscription" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold text-xs uppercase tracking-wider px-4 py-2">
            <CreditCard className="w-4 h-4" />
            {t("settings.tabs.subscription")}
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold text-xs uppercase tracking-wider px-4 py-2">
            <Shield className="w-4 h-4" />
            {t("settings.tabs.security")}
          </TabsTrigger>
        </TabsList>

        {/* Company Tab */}
        <TabsContent value="company" className="space-y-6">
          <div className="bg-card border-2 border-border p-6 space-y-5">
            <h2 className="font-display font-bold text-lg">{t("settings.company.title")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-semibold text-xs uppercase tracking-wider">{t("settings.company.name")}</Label>
                <Input value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} className="border-2" />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-xs uppercase tracking-wider">{t("settings.company.phone")}</Label>
                <Input value={company.phone} onChange={(e) => setCompany({ ...company, phone: e.target.value })} className="border-2" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-semibold text-xs uppercase tracking-wider">{t("settings.company.address")}</Label>
              <Input value={company.business_address} onChange={(e) => setCompany({ ...company, business_address: e.target.value })} className="border-2" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-semibold text-xs uppercase tracking-wider">{t("settings.company.timezone")}</Label>
                <Select value={company.timezone} onValueChange={(v) => setCompany({ ...company, timezone: v })}>
                  <SelectTrigger className="border-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "America/Sao_Paulo", "America/Mexico_City"].map((tz) => (
                      <SelectItem key={tz} value={tz}>{tz.replace("America/", "").replace("_", " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-xs uppercase tracking-wider">{t("settings.company.currency")}</Label>
                <Select value={company.default_currency} onValueChange={(v) => setCompany({ ...company, default_currency: v })}>
                  <SelectTrigger className="border-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["USD", "BRL", "MXN", "EUR", "GBP", "CAD"].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t-2 border-border pt-5 space-y-4">
              <h3 className="font-display font-bold">{t("settings.company.modules")}</h3>
              <div className="space-y-3">
                {[
                  { key: "shield_enabled" as const, label: "Shield — Legal Protection" },
                  { key: "route_enabled" as const, label: "Route — AI Optimization" },
                  { key: "fill_enabled" as const, label: "Fill — Revenue Recovery" },
                ].map((mod) => (
                  <div key={mod.key} className="flex items-center justify-between py-2">
                    <span className="font-semibold text-sm">{mod.label}</span>
                    <Switch
                      checked={company[mod.key]}
                      onCheckedChange={(checked) => setCompany({ ...company, [mod.key]: checked })}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={saveCompany} className="font-semibold gap-2" disabled={saving}>
              <Save className="w-4 h-4" />
              {saving ? t("common.loading") : t("settings.save")}
            </Button>
          </div>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="bg-card border-2 border-border p-6 space-y-5">
            <h2 className="font-display font-bold text-lg">{t("settings.profile.title")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-semibold text-xs uppercase tracking-wider">{t("settings.profile.name")}</Label>
                <Input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} className="border-2" />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-xs uppercase tracking-wider">{t("settings.profile.phone")}</Label>
                <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="border-2" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-semibold text-xs uppercase tracking-wider">{t("settings.profile.email")}</Label>
              <Input value={profile.email} disabled className="border-2 bg-muted" />
              <p className="text-xs text-muted-foreground">{t("settings.profile.emailNote")}</p>
            </div>
            <Button onClick={saveProfile} className="font-semibold gap-2" disabled={saving}>
              <Save className="w-4 h-4" />
              {saving ? t("common.loading") : t("settings.save")}
            </Button>
          </div>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          <div className="bg-card border-2 border-border p-6 space-y-5">
            <h2 className="font-display font-bold text-lg">{t("settings.subscription.title")}</h2>
            <div className="bg-primary/5 border-2 border-primary p-5 flex items-center gap-4">
              <CreditCard className="w-8 h-8 text-primary shrink-0" />
              <div>
                <p className="font-display font-bold text-lg">{t("settings.subscription.currentPlan")}: <span className="text-primary">Trial</span></p>
                <p className="text-sm text-muted-foreground">{t("settings.subscription.trialInfo")}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: "Professional", price: "$199/mo", desc: t("settings.subscription.proDesc") },
                { name: "Enterprise", price: "$499/mo", desc: t("settings.subscription.entDesc") },
              ].map((plan) => (
                <div key={plan.name} className="border-2 border-border p-4 space-y-2">
                  <h3 className="font-display font-bold">{plan.name}</h3>
                  <p className="font-display text-2xl font-black">{plan.price}</p>
                  <p className="text-xs text-muted-foreground">{plan.desc}</p>
                  <Button variant="outline" className="w-full border-2 font-semibold mt-2">
                    {t("settings.subscription.upgrade")}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="bg-card border-2 border-border p-6 space-y-5">
            <h2 className="font-display font-bold text-lg">{t("settings.security.title")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-semibold text-xs uppercase tracking-wider">{t("settings.security.newPassword")}</Label>
                <Input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} className="border-2" />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-xs uppercase tracking-wider">{t("settings.security.confirmPassword")}</Label>
                <Input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} className="border-2" />
              </div>
            </div>
            <Button onClick={changePassword} className="font-semibold gap-2" disabled={saving || !passwords.newPassword}>
              <Shield className="w-4 h-4" />
              {saving ? t("common.loading") : t("settings.security.changePassword")}
            </Button>
          </div>

          <div className="bg-card border-2 border-border p-6 space-y-3">
            <h2 className="font-display font-bold text-lg">{t("settings.security.sessions")}</h2>
            <p className="text-sm text-muted-foreground">{t("settings.security.sessionsDesc")}</p>
            <div className="flex items-center gap-3 p-3 bg-muted/50 border border-border">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-semibold">{t("settings.security.currentSession")}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
