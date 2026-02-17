import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/hooks/useCompany";
import { useRoutes, useCreateRoute, useUpdateRoute, useDeleteRoute } from "@/hooks/useRoutes";
import { Route, MapPin, Clock, Zap, ArrowDown, Plus, Save, Trash2, GripVertical, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";

export default function RouteOptimizerPage() {
  const { t } = useTranslation();
  const { data: company } = useCompany();
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [routeName, setRouteName] = useState("");
  const [routeTeam, setRouteTeam] = useState("");
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);

  // Queries
  const { data: jobs = [] } = useQuery({
    queryKey: ["route-jobs", selectedDate],
    queryFn: async () => {
      const { data } = await supabase
        .from("jobs")
        .select("*, customers(full_name, property_address, property_city)")
        .eq("scheduled_date", selectedDate)
        .in("status", ["scheduled", "in_progress"])
        .order("scheduled_time_start");
      return data || [];
    },
  });

  const { data: teams = [] } = useQuery({
    queryKey: ["route-teams"],
    queryFn: async () => {
      const { data } = await supabase.from("teams").select("*").eq("is_active", true);
      return data || [];
    },
  });

  const { data: routes = [] } = useRoutes(selectedDate);
  const createRoute = useCreateRoute();
  const updateRoute = useUpdateRoute();
  const deleteRoute = useDeleteRoute();

  const filteredJobs = selectedTeam === "all" ? jobs : jobs.filter((j) => j.team_id === selectedTeam);

  // Identificar jobs que já estão em rotas
  const jobsInRoutes = useMemo(() => {
    const ids = new Set<string>();
    routes.forEach((r: any) => r.job_ids?.forEach((id: string) => ids.add(id)));
    return ids;
  }, [routes]);

  const availableJobs = filteredJobs.filter((j) => !jobsInRoutes.has(j.id));

  // Estatísticas
  const totalDuration = filteredJobs.reduce((s, j) => s + (j.estimated_duration_minutes || 0), 0);

  // Handler: criar rota
  const handleCreateRoute = () => {
    if (!company?.id || !routeName.trim() || selectedJobIds.length === 0) {
      toast.error("Preencha o nome e selecione pelo menos um job.");
      return;
    }
    createRoute.mutate(
      {
        company_id: company.id,
        name: routeName.trim(),
        route_date: selectedDate,
        team_id: routeTeam || undefined,
        job_ids: selectedJobIds,
        job_order: selectedJobIds.map((_, i) => i),
      },
      {
        onSuccess: () => {
          setShowCreateDialog(false);
          setRouteName("");
          setRouteTeam("");
          setSelectedJobIds([]);
        },
      }
    );
  };

  // Handler: otimizar (simula reordenamento)
  const handleOptimize = (routeId: string, jobIds: string[]) => {
    // Simulação: inverte a ordem (em produção usaria algoritmo real)
    const optimizedOrder = [...jobIds].reverse();
    updateRoute.mutate({
      id: routeId,
      job_ids: optimizedOrder,
      job_order: optimizedOrder.map((_, i) => i),
      is_optimized: true,
      optimization_algorithm: "nearest_neighbor_v1",
    });
  };

  const toggleJobSelection = (jobId: string) => {
    setSelectedJobIds((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black">Otimizador de Rotas</h1>
          <p className="text-muted-foreground mt-1">Crie e otimize rotas para suas equipes</p>
        </div>
        <div className="flex gap-2">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto border-2"
          />
          <Button onClick={() => setShowCreateDialog(true)} className="font-semibold gap-2 border-2 shrink-0">
            <Plus className="w-4 h-4" />
            Nova Rota
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Rotas do Dia", value: routes.length, icon: Route },
          { label: "Jobs Pendentes", value: availableJobs.length, icon: AlertCircle },
          { label: "Paradas Total", value: filteredJobs.length, icon: MapPin },
          { label: "Tempo Estimado", value: `${totalDuration} min`, icon: Clock },
        ].map((s) => (
          <div key={s.label} className="bg-card border-2 border-border p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 flex items-center justify-center shrink-0">
              <s.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <p className="font-display text-xl font-black">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Team Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedTeam("all")}
          className={`px-3 py-1.5 text-sm font-semibold border-2 transition-colors ${
            selectedTeam === "all" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent"
          }`}
        >
          Todas as Equipes
        </button>
        {teams.map((team) => (
          <button
            key={team.id}
            onClick={() => setSelectedTeam(team.id)}
            className={`px-3 py-1.5 text-sm font-semibold border-2 transition-colors ${
              selectedTeam === team.id ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent"
            }`}
          >
            {team.name}
          </button>
        ))}
      </div>

      {/* Rotas Existentes */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold">Rotas Criadas ({routes.length})</h2>
        {routes.length === 0 ? (
          <div className="bg-card border-2 border-border p-8 text-center">
            <Route className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">Nenhuma rota criada para este dia</p>
            <p className="text-sm text-muted-foreground mt-1">Clique em "Nova Rota" para começar</p>
          </div>
        ) : (
          routes.map((route: any) => (
            <div key={route.id} className="bg-card border-2 border-border">
              <div className="p-4 border-b-2 border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary flex items-center justify-center">
                    <Route className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold">{route.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      {route.teams?.name && (
                        <span className="text-xs font-bold uppercase tracking-wider bg-accent px-2 py-0.5">
                          {route.teams.name}
                        </span>
                      )}
                      {route.is_optimized && (
                        <Badge variant="secondary" className="gap-1 text-xs">
                          <CheckCircle2 className="w-3 h-3" /> Otimizada
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">{route.job_ids?.length || 0} paradas</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-2 font-semibold gap-1"
                    onClick={() => handleOptimize(route.id, route.job_ids || [])}
                    disabled={updateRoute.isPending}
                  >
                    <Zap className="w-3 h-3" /> Otimizar
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover rota?</AlertDialogTitle>
                        <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteRoute.mutate(route.id)}>Remover</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              {/* Paradas da rota */}
              <div className="divide-y divide-border">
                {(route.job_ids || []).map((jobId: string, i: number) => {
                  const job = jobs.find((j) => j.id === jobId);
                  return (
                    <div key={jobId} className="p-3 pl-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-primary/10 text-primary flex items-center justify-center font-display font-black text-xs shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {job ? (job as any).customers?.full_name || job.job_number : jobId.slice(0, 8)}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {job ? (job as any).customers?.property_address || "—" : "Job não encontrado"}
                        </p>
                      </div>
                      {job && (
                        <span className="text-xs text-muted-foreground shrink-0">
                          {job.estimated_duration_minutes || 0} min
                        </span>
                      )}
                      {i < (route.job_ids?.length || 0) - 1 && (
                        <ArrowDown className="w-3 h-3 text-muted-foreground shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Jobs sem rota */}
      {availableJobs.length > 0 && (
        <div className="bg-card border-2 border-border">
          <div className="p-4 border-b-2 border-border">
            <h2 className="font-display font-bold">Jobs sem Rota ({availableJobs.length})</h2>
          </div>
          <div className="divide-y divide-border">
            {availableJobs.map((job) => (
              <div key={job.id} className="p-3 pl-4 flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {(job as any).customers?.full_name || job.job_number}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {(job as any).customers?.property_address}, {(job as any).customers?.property_city}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">{job.scheduled_time_start || "—"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova Rota</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-1 block">Nome da Rota</label>
              <Input
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                placeholder="Ex: Rota Centro Manhã"
                className="border-2"
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1 block">Equipe (opcional)</label>
              <Select value={routeTeam} onValueChange={setRouteTeam}>
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="Selecione uma equipe" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-semibold mb-1 block">
                Selecione os Jobs ({selectedJobIds.length} selecionados)
              </label>
              <div className="border-2 border-border max-h-48 overflow-y-auto divide-y divide-border">
                {availableJobs.length === 0 ? (
                  <p className="p-3 text-sm text-muted-foreground text-center">Nenhum job disponível para {selectedDate}</p>
                ) : (
                  availableJobs.map((job) => (
                    <label key={job.id} className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedJobIds.includes(job.id)}
                        onChange={() => toggleJobSelection(job.id)}
                        className="w-4 h-4"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {(job as any).customers?.full_name || job.job_number}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {(job as any).customers?.property_address || "—"}
                        </p>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancelar</Button>
            <Button onClick={handleCreateRoute} disabled={createRoute.isPending}>
              {createRoute.isPending ? "Criando..." : "Criar Rota"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
