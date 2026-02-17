import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function useRoutes(dateFilter?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["routes", dateFilter],
    queryFn: async () => {
      let query = supabase
        .from("routes")
        .select("*, teams(name, color)")
        .order("route_date", { ascending: false });

      if (dateFilter) {
        query = query.eq("route_date", dateFilter);
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

export function useCreateRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (route: {
      company_id: string;
      name: string;
      route_date: string;
      team_id?: string;
      job_ids: string[];
      job_order?: number[];
    }) => {
      const { data, error } = await supabase
        .from("routes")
        .insert(route)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      toast.success("Rota criada com sucesso!");
    },
    onError: (err: Error) => toast.error(`Erro ao criar rota: ${err.message}`),
  });
}

export function useUpdateRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { data, error } = await supabase
        .from("routes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      toast.success("Rota atualizada!");
    },
    onError: (err: Error) => toast.error(`Erro: ${err.message}`),
  });
}

export function useDeleteRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("routes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      toast.success("Rota removida!");
    },
    onError: (err: Error) => toast.error(`Erro: ${err.message}`),
  });
}
