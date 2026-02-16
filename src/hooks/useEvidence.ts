import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useEvidence(jobId?: string) {
  return useQuery({
    queryKey: ["evidence", jobId],
    queryFn: async () => {
      let query = supabase
        .from("evidence_uploads")
        .select("*, jobs(job_number, scheduled_date)")
        .order("created_at", { ascending: false });
      if (jobId && jobId !== "all") query = query.eq("job_id", jobId);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateEvidence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (evidence: {
      company_id: string;
      job_id: string;
      uploaded_by: string;
      file_url: string;
      file_type: string;
      caption?: string;
      latitude?: number;
      longitude?: number;
    }) => {
      const { data, error } = await supabase
        .from("evidence_uploads")
        .insert(evidence)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["evidence"] }),
  });
}

export function useDeleteEvidence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("evidence_uploads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["evidence"] }),
  });
}
