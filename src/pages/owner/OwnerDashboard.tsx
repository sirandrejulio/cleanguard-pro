import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Building2, Users, DollarSign, TrendingUp, Shield, Eye, Ban,
  Plus, CheckCircle, X, Loader2, MapPin, Gift, Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Tipo local para company do Supabase
interface CompanyRow {
  id: string;
  name: string;
  owner_id: string;
  subscription_tier: string | null;
  subscription_status: string | null;
  shield_enabled: boolean | null;
  route_enabled: boolean | null;
  fill_enabled: boolean | null;
  created_at: string;
  updated_at: string;
  phone: string | null;
  business_address: string | null;
  default_currency: string | null;
  timezone: string | null;
}

export default function OwnerDashboard() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Modais
  const [showCreate, setShowCreate] = useState(false);
  const [showDetail, setShowDetail] = useState<CompanyRow | null>(null);
  const [showCredentials, setShowCredentials] = useState<{ email: string; password: string } | null>(null);

  // Formulário criação
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminName, setNewAdminName] = useState("");
  const [newTier, setNewTier] = useState("trial");

  // Queries
  const { data: companies = [], isLoading: loadingCompanies } = useQuery({
    queryKey: ["owner-companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as CompanyRow[];
    },
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ["owner-profiles"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("id, company_id, role");
      return data || [];
    },
  });

  // Mutations
  const createCompany = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("manage-company", {
        body: {
          action: "create",
          company_name: newCompanyName,
          admin_email: newAdminEmail,
          admin_name: newAdminName,
          subscription_tier: newTier,
        },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Erro desconhecido");
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["owner-companies"] });
      queryClient.invalidateQueries({ queryKey: ["owner-profiles"] });
      setShowCreate(false);
      setNewCompanyName("");
      setNewAdminEmail("");
      setNewAdminName("");
      setNewTier("trial");
      // Mostrar credenciais temporárias
      setShowCredentials({
        email: data.admin.email,
        password: data.admin.temp_password,
      });
      toast({ title: "Empresa criada com sucesso!" });
    },
    onError: (err: Error) => {
      toast({ variant: "destructive", title: "Erro ao criar empresa", description: err.message });
    },
  });

  const suspendCompany = useMutation({
    mutationFn: async (companyId: string) => {
      const { data, error } = await supabase.functions.invoke("manage-company", {
        body: { action: "suspend", company_id: companyId },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Erro");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-companies"] });
      toast({ title: "Empresa suspensa" });
    },
    onError: (err: Error) => {
      toast({ variant: "destructive", title: "Erro", description: err.message });
    },
  });

  const reactivateCompany = useMutation({
    mutationFn: async (companyId: string) => {
      const { data, error } = await supabase.functions.invoke("manage-company", {
        body: { action: "reactivate", company_id: companyId },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Erro");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-companies"] });
      toast({ title: "Empresa reativada" });
    },
    onError: (err: Error) => {
      toast({ variant: "destructive", title: "Erro", description: err.message });
    },
  });

  const toggleModule = useMutation({
    mutationFn: async ({ companyId, field, value }: { companyId: string; field: string; value: boolean }) => {
      const { error } = await supabase
        .from("companies")
        .update({ [field]: value })
        .eq("id", companyId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-companies"] });
    },
  });

  // Dados derivados
  const activeCompanies = companies.filter((c) => c.subscription_status === "active").length;
  const pricingMap: Record<string, number> = { trial: 0, basic: 0, pro: 199, professional: 199, enterprise: 499 };
  const mrr = companies.reduce((sum, c) => sum + (pricingMap[c.subscription_tier || "trial"] || 0), 0);

  const stats = [
    { label: "COMPANIES", value: companies.length, sub: `${activeCompanies} ativas`, icon: Building2, color: "text-primary", bg: "bg-primary/10" },
    { label: "USERS", value: profiles.length, sub: "Em todas as empresas", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "MRR", value: `$${mrr.toLocaleString()}`, sub: "Receita mensal", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "ARR", value: `$${(mrr * 12).toLocaleString()}`, sub: "Receita anual", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  const tierColors: Record<string, string> = {
    enterprise: "bg-purple-500/10 text-purple-400",
    pro: "bg-blue-500/10 text-blue-400",
    professional: "bg-blue-500/10 text-blue-400",
    trial: "bg-muted text-muted-foreground",
    basic: "bg-muted text-muted-foreground",
  };

  const inputClass = "w-full h-10 bg-secondary border border-border text-foreground text-sm px-3 placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors";

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black">Owner Dashboard</h1>
          <p className="text-muted-foreground mt-1">God Mode — Acesso total ao sistema</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider">GOD MODE</span>
          </div>
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Nova Empresa
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border-2 border-border p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
              <div className={`w-9 h-9 ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div>
              <span className="font-display text-3xl font-black">{stat.value}</span>
              <span className="text-sm text-muted-foreground ml-2">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Companies Table */}
      <div className="bg-card border-2 border-border">
        <div className="flex items-center justify-between p-5 border-b-2 border-border">
          <h2 className="font-display font-bold text-lg">Todas as Empresas</h2>
          <span className="text-xs text-muted-foreground font-mono">{companies.length} total</span>
        </div>
        {loadingCompanies ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Empresa</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Plano</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Módulos</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Users</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Receita</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Criado</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {companies.map((company) => {
                  const userCount = profiles.filter((p) => p.company_id === company.id).length;
                  const revenue = pricingMap[company.subscription_tier || "trial"] || 0;
                  const isSuspended = company.subscription_status === "suspended" || company.subscription_status === "canceled";

                  return (
                    <tr key={company.id} className="hover:bg-accent/50 transition-colors">
                      <td className="px-5 py-4">
                        <span className="font-semibold">{company.name}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 text-xs font-bold uppercase ${
                          company.subscription_status === "active"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-destructive/10 text-destructive"
                        }`}>
                          {company.subscription_status || "unknown"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 text-xs font-bold uppercase ${tierColors[company.subscription_tier || "trial"]}`}>
                          {company.subscription_tier || "trial"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {company.shield_enabled && (
                            <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5" title="Shield">
                              <Shield className="w-3 h-3 inline" />
                            </span>
                          )}
                          {company.route_enabled && (
                            <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 px-1.5 py-0.5" title="Route">
                              <MapPin className="w-3 h-3 inline" />
                            </span>
                          )}
                          {company.fill_enabled && (
                            <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 px-1.5 py-0.5" title="Fill">
                              <Gift className="w-3 h-3 inline" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm">{userCount}</td>
                      <td className="px-5 py-4 text-sm font-mono">${revenue}/mo</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {new Date(company.created_at).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs gap-1"
                            onClick={() => setShowDetail(company)}
                          >
                            <Eye className="w-3 h-3" /> Ver
                          </Button>
                          {isSuspended ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs gap-1 text-emerald-500 hover:text-emerald-500"
                              onClick={() => reactivateCompany.mutate(company.id)}
                              disabled={reactivateCompany.isPending}
                            >
                              <CheckCircle className="w-3 h-3" /> Ativar
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs gap-1 text-destructive hover:text-destructive"
                              onClick={() => suspendCompany.mutate(company.id)}
                              disabled={suspendCompany.isPending}
                            >
                              <Ban className="w-3 h-3" /> Suspender
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {companies.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">
                      Nenhuma empresa encontrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Criar Empresa */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display font-bold">Nova Empresa</DialogTitle>
            <DialogDescription>Cria uma empresa e um admin automaticamente.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Nome da Empresa</label>
              <input value={newCompanyName} onChange={(e) => setNewCompanyName(e.target.value)} className={inputClass} placeholder="SparkleClean LLC" />
            </div>
            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Email do Admin</label>
              <input type="email" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} className={inputClass} placeholder="admin@empresa.com" />
            </div>
            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Nome do Admin</label>
              <input value={newAdminName} onChange={(e) => setNewAdminName(e.target.value)} className={inputClass} placeholder="João Silva" />
            </div>
            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Plano</label>
              <select value={newTier} onChange={(e) => setNewTier(e.target.value)} className={inputClass}>
                <option value="trial">Trial</option>
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancelar</Button>
            <Button
              onClick={() => createCompany.mutate()}
              disabled={createCompany.isPending || !newCompanyName || !newAdminEmail || !newAdminName}
            >
              {createCompany.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Credenciais Temporárias */}
      <Dialog open={!!showCredentials} onOpenChange={() => setShowCredentials(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-emerald-500">✅ Empresa Criada</DialogTitle>
            <DialogDescription>Copie as credenciais abaixo. A senha temporária não será exibida novamente.</DialogDescription>
          </DialogHeader>
          {showCredentials && (
            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Email</label>
                <div className="flex items-center gap-2">
                  <input readOnly value={showCredentials.email} className={`${inputClass} bg-muted`} />
                  <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(showCredentials.email); toast({ title: "Email copiado!" }); }}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Senha Temporária</label>
                <div className="flex items-center gap-2">
                  <input readOnly value={showCredentials.password} className={`${inputClass} bg-muted font-mono`} />
                  <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(showCredentials.password); toast({ title: "Senha copiada!" }); }}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-destructive font-medium">⚠️ Salve estas credenciais agora. Não será possível recuperar a senha depois.</p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowCredentials(null)}>Entendido</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Detalhes da Empresa + Toggle de Módulos */}
      <Dialog open={!!showDetail} onOpenChange={() => setShowDetail(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display font-bold">{showDetail?.name}</DialogTitle>
            <DialogDescription>Gerencie módulos e configurações desta empresa.</DialogDescription>
          </DialogHeader>
          {showDetail && (
            <div className="space-y-6 py-2">
              {/* Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs uppercase">Status</span>
                  <p className="font-semibold">{showDetail.subscription_status || "N/A"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs uppercase">Plano</span>
                  <p className="font-semibold uppercase">{showDetail.subscription_tier || "trial"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs uppercase">Usuários</span>
                  <p className="font-semibold">{profiles.filter((p) => p.company_id === showDetail.id).length}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs uppercase">Criado em</span>
                  <p className="font-semibold">{new Date(showDetail.created_at).toLocaleDateString("pt-BR")}</p>
                </div>
              </div>

              {/* Módulos Toggle */}
              <div className="space-y-3">
                <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-bold">Módulos</h3>
                {[
                  { key: "shield_enabled", label: "Shield", desc: "Evidências, disputas, timesheets", icon: Shield, color: "text-primary" },
                  { key: "route_enabled", label: "Route", desc: "Otimização de rotas, rotas diárias", icon: MapPin, color: "text-blue-500" },
                  { key: "fill_enabled", label: "Fill", desc: "Waitlist, marketplace, pricing engine", icon: Gift, color: "text-amber-500" },
                ].map((mod) => (
                  <div key={mod.key} className="flex items-center justify-between p-3 border border-border bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <mod.icon className={`w-5 h-5 ${mod.color}`} />
                      <div>
                        <p className="font-semibold text-sm">{mod.label}</p>
                        <p className="text-xs text-muted-foreground">{mod.desc}</p>
                      </div>
                    </div>
                    <Switch
                      checked={!!showDetail[mod.key as keyof CompanyRow]}
                      onCheckedChange={(checked) => {
                        toggleModule.mutate({ companyId: showDetail.id, field: mod.key, value: checked });
                        // Atualizar o estado local para feedback imediato
                        setShowDetail((prev) => prev ? { ...prev, [mod.key]: checked } : null);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetail(null)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}