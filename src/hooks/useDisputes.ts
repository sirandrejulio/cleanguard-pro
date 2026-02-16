import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useDisputes(statusFilter?: string) {
  return useQuery({
    queryKey: ["disputes", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("disputes")
        .select("*, jobs(job_number), customers(full_name)")
        .order("created_at", { ascending: false });
      if (statusFilter && statusFilter !== "all") query = query.eq("status", statusFilter);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateDispute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dispute: {
      company_id: string;
      job_id: string;
      customer_id: string;
      opened_by: string;
      title: string;
      description?: string;
      priority?: string;
    }) => {
      const { data, error } = await supabase
        .from("disputes")
        .insert(dispute)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["disputes"] }),
  });
}

export function useUpdateDispute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; status?: string; resolution?: string; resolved_by?: string; resolved_at?: string }) => {
      const { data, error } = await supabase
        .from("disputes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["disputes"] }),
  });
}

export function useDeleteDispute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("disputes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["disputes"] }),
  });
}
