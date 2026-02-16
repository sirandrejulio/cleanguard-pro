import { Navigate } from "react-router-dom";
import { useRole } from "@/hooks/useRole";
import { Loader2 } from "lucide-react";

export function RoleRedirect() {
  const { role, isLoading } = useRole();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  switch (role) {
    case "owner":
      return <Navigate to="/dashboard/owner" replace />;
    case "admin":
      return <Navigate to="/dashboard/admin" replace />;
    case "manager":
      return <Navigate to="/dashboard/manager" replace />;
    case "team_lead":
      return <Navigate to="/dashboard/team-lead" replace />;
    case "cleaner":
      return <Navigate to="/dashboard/cleaner" replace />;
    default:
      return <Navigate to="/dashboard/admin" replace />;
  }
}
