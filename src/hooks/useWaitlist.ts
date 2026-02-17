import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "./useCompany";

export function useWaitlist() {
  const { data: company } = useCompany();

  return useQuery({
    queryKey: ["waitlist", company?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("waitlist_entries" as any)
        .select("*, customers(full_name, email, phone, property_address, property_city)")
        .eq("company_id", company!.id)
        .order("priority", { ascending: false })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data || []) as any[];
    },
    enabled: !!company?.id,
  });
}

export function useCreateWaitlistEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (entry: {
      company_id: string;
      customer_id: string;
      preferred_service_type: string;
      preferred_date?: string;
      preferred_time_start?: string;
      preferred_time_end?: string;
      notes?: string;
      priority?: number;
    }) => {
      const { data, error } = await supabase
        .from("waitlist_entries" as any)
        .insert(entry)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["waitlist"] }),
  });
}

export function useUpdateWaitlistEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { error } = await supabase
        .from("waitlist_entries" as any)
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["waitlist"] }),
  });
}

export function useDeleteWaitlistEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("waitlist_entries" as any)
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["waitlist"] }),
  });
}
