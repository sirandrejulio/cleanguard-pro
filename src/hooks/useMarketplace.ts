import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "./useCompany";

export function useMarketplaceListings() {
  const { data: company } = useCompany();

  return useQuery({
    queryKey: ["marketplace", company?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketplace_listings")
        .select("*, jobs(job_number, service_type, scheduled_date, scheduled_time_start, estimated_duration_minutes, customers(full_name, property_address, property_city))")
        .eq("company_id", company!.id)
        .order("listing_date", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id,
  });
}

export function useCreateListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (listing: {
      company_id: string;
      job_id: string;
      title: string;
      description?: string;
      listing_date: string;
      base_price_cents: number;
      current_price_cents: number;
      start_time?: string;
      end_time?: string;
      expires_at?: string;
    }) => {
      const { data, error } = await supabase
        .from("marketplace_listings")
        .insert(listing)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["marketplace"] }),
  });
}

export function useUpdateListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { error } = await supabase
        .from("marketplace_listings")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["marketplace"] }),
  });
}

export function useDeleteListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("marketplace_listings")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["marketplace"] }),
  });
}
