import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type AppRole = "owner" | "admin" | "manager" | "team_lead" | "cleaner";

const ROLE_HIERARCHY: Record<AppRole, number> = {
  owner: 0,
  admin: 1,
  manager: 2,
  team_lead: 3,
  cleaner: 4,
};

export function useRole() {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["user-role", user?.id],
    queryFn: async (): Promise<AppRole> => {
      if (!user?.id) return "cleaner";

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (error) throw error;
      if (!data || data.length === 0) return "cleaner";

      // Retorna a role de maior hierarquia
      const sorted = data.sort(
        (a, b) =>
          (ROLE_HIERARCHY[a.role as AppRole] ?? 99) -
          (ROLE_HIERARCHY[b.role as AppRole] ?? 99)
      );
      return sorted[0].role as AppRole;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });

  const role = query.data ?? "cleaner";

  return {
    ...query,
    role,
    isOwner: role === "owner",
    isAdmin: role === "admin",
    isManager: role === "manager",
    isTeamLead: role === "team_lead",
    isCleaner: role === "cleaner",
    hasMinRole: (minRole: AppRole) =>
      (ROLE_HIERARCHY[role] ?? 99) <= (ROLE_HIERARCHY[minRole] ?? 99),
  };
}
