import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Company {
  id: string;
  name: string;
  subscription_tier: "basic" | "pro" | "enterprise" | "trial" | null;
  subscription_status: "active" | "past_due" | "canceled" | "trialing" | null;
  shield_enabled: boolean;
  route_enabled: boolean;
  fill_enabled: boolean;
}

export function useCompany() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["company", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // 1. Get profile to find company_id
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("user_id", user.id)
        .single();

      if (profileError) throw profileError;
      if (!profile?.company_id) return null;

      // 2. Get company details
      const { data: company, error: companyError } = await supabase
        .from("companies")
        .select("*")
        .eq("id", profile.company_id)
        .single();

      if (companyError) throw companyError;
      return company as Company;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}
