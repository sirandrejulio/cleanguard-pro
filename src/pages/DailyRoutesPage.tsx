import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRoutes, useUpdateRoute } from "@/hooks/useRoutes";
import { Calendar, MapPin, Clock, ChevronLeft, ChevronRight, Route, CheckCircle2, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, addDays, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function DailyRoutesPage() {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dateStr = format(selectedDate, "yyyy-MM-dd");

  // Jobs do dia
  const { data: jobs = [] } = useQuery({
    queryKey: ["daily-route-jobs", dateStr],
    queryFn: async () => {
      const { data } = await supabase
        .from("jobs")
        .select("*, customers(full_name, property_address, property_city), teams(name, color)")
        .eq("scheduled_date", dateStr)
        .order("scheduled_time_start");
      return data || [];
    },
  });

  // Rotas do dia
  const { data: routes = [] } = useRoutes(dateStr);
  const updateRoute = useUpdateRoute();

  const statusColors: Record<string, string> = {
    scheduled: "bg-blue-600/10 text-blue-600 border-blue-600",
    in_progress: "bg-amber-600/10 text-amber-600 border-amber-600",
    completed: "bg-emerald-600/10 text-emerald-600 border-emerald-600",
    cancelled: "bg-destructive/10 text-destructive border-destructive",
  };

  const routeStatusColors: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    active: "bg-amber-600/10 text-amber-600",
    completed: "bg-emerald-600/10 text-emerald-600",
  };

  const handleRouteStatusChange = (routeId: string, newStatus: string) => {
    updateRoute.mutate({ id: routeId, status: newStatus });
  };

  // Estatísticas
  const completedJobs = jobs.filter((j) => j.status === "completed").length;
  const inProgressJobs = jobs.filter((j) => j.status === "in_progress").length;
  const totalMinutes = jobs.reduce((s, j) => s + (j.estimated_duration_minutes || 0), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-black">Rotas do Dia</h1>
        <p className="text-muted-foreground mt-1">Visualize e acompanhe a execução das rotas diárias</p>
      </div>

      {/* Navegação de Data */}
      <div className="flex items-center gap-3 bg-card border-2 border-border p-3 w-fit">
        <Button variant="ghost" size="icon" onClick={() => setSelectedDate(subDays(selectedDate, 1))}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="font-display font-bold">
            {format(selectedDate, "EEEE, dd 'de' MMMM yyyy", { locale: ptBR })}
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" className="border-2 font-semibold ml-2" onClick={() => setSelectedDate(new Date())}>
          Hoje
        </Button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Rotas", value: routes.length },
          { label: "Total Jobs", value: jobs.length },
          { label: "Concluídos", value: completedJobs, color: "text-emerald-600" },
          { label: "Em Andamento", value: inProgressJobs, color: "text-amber-600" },
          { label: "Tempo Total", value: `${totalMinutes} min` },
        ].map((s) => (
          <div key={s.label} className="bg-card border-2 border-border p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{s.label}</p>
            <p className={`font-display text-2xl font-black mt-1 ${(s as any).color || ""}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Rotas do dia */}
      {routes.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-lg font-bold">Rotas Planejadas ({routes.length})</h2>
          {routes.map((route: any) => (
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
                      <Badge className={`text-xs ${routeStatusColors[route.status] || ""}`}>
                        {route.status === "draft" ? "Rascunho" : route.status === "active" ? "Em Execução" : "Concluída"}
                      </Badge>
                      {route.is_optimized && (
                        <Badge variant="outline" className="gap-1 text-xs">
                          <CheckCircle2 className="w-3 h-3" /> Otimizada
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {route.status === "draft" && (
                    <Button size="sm" variant="outline" className="border-2 gap-1 font-semibold"
                      onClick={() => handleRouteStatusChange(route.id, "active")}
                      disabled={updateRoute.isPending}>
                      <Play className="w-3 h-3" /> Iniciar
                    </Button>
                  )}
                  {route.status === "active" && (
                    <Button size="sm" variant="outline" className="border-2 gap-1 font-semibold"
                      onClick={() => handleRouteStatusChange(route.id, "completed")}
                      disabled={updateRoute.isPending}>
                      <CheckCircle2 className="w-3 h-3" /> Finalizar
                    </Button>
                  )}
                </div>
              </div>
              {/* Paradas da rota na timeline */}
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden sm:block" />
                <div className="divide-y divide-border">
                  {(route.job_ids || []).map((jobId: string, i: number) => {
                    const job = jobs.find((j) => j.id === jobId);
                    return (
                      <div key={jobId} className="p-3 pl-4 sm:pl-16 relative">
                        <div className="absolute left-6 top-5 w-4 h-4 border-2 border-primary bg-card hidden sm:block" />
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-mono text-xs font-bold bg-primary/10 text-primary px-1.5 py-0.5">#{i + 1}</span>
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="font-mono text-sm font-semibold">
                              {job?.scheduled_time_start || "—"}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">
                              {job ? (job as any).customers?.full_name || job.job_number : jobId.slice(0, 8)}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              <MapPin className="w-3 h-3 inline mr-1" />
                              {job ? (job as any).customers?.property_address || "—" : "—"}
                            </p>
                          </div>
                          {job && (
                            <span className={`text-xs font-bold uppercase px-2 py-1 border ${statusColors[job.status] || "border-border"}`}>
                              {job.status === "scheduled" ? "Agendado" : job.status === "in_progress" ? "Em Andamento" : job.status === "completed" ? "Concluído" : job.status}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Jobs sem rota (timeline legado) */}
      {jobs.filter((j) => {
        const inRoute = routes.some((r: any) => r.job_ids?.includes(j.id));
        return !inRoute;
      }).length > 0 && (
        <div className="bg-card border-2 border-border">
          <div className="p-4 border-b-2 border-border">
            <h2 className="font-display font-bold">Jobs Avulsos (sem rota)</h2>
          </div>
          <div className="divide-y divide-border">
            {jobs
              .filter((j) => !routes.some((r: any) => r.job_ids?.includes(j.id)))
              .map((job) => (
                <div key={job.id} className="p-3 pl-4 flex items-center gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="font-mono text-sm font-semibold shrink-0">{job.scheduled_time_start || "—"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {(job as any).customers?.full_name || job.job_number}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {(job as any).customers?.property_address || "—"}
                    </p>
                  </div>
                  <span className={`text-xs font-bold uppercase px-2 py-1 border ${statusColors[job.status] || "border-border"}`}>
                    {job.status === "scheduled" ? "Agendado" : job.status === "in_progress" ? "Em Andamento" : job.status === "completed" ? "Concluído" : job.status}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Estado vazio */}
      {jobs.length === 0 && routes.length === 0 && (
        <div className="bg-card border-2 border-border p-12 text-center">
          <Calendar className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-muted-foreground font-medium text-lg">Nenhum job agendado para este dia</p>
          <p className="text-sm text-muted-foreground mt-1">Selecione outra data ou crie novos jobs</p>
        </div>
      )}
    </div>
  );
}
