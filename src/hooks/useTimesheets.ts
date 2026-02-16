import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useTimesheets() {
  return useQuery({
    queryKey: ["timesheets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("timesheets")
        .select("*, jobs(job_number, scheduled_date)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateTimesheet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ts: {
      company_id: string;
      job_id: string;
      user_id: string;
      check_in?: string;
      check_in_lat?: number;
      check_in_lng?: number;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from("timesheets")
        .insert(ts)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["timesheets"] }),
  });
}

export function useUpdateTimesheet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: {
      id: string;
      check_out?: string;
      check_out_lat?: number;
      check_out_lng?: number;
      total_minutes?: number;
      status?: string;
    }) => {
      const { data, error } = await supabase
        .from("timesheets")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["timesheets"] }),
  });
}
