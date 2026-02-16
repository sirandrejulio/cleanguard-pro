import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SubscriptionGuard } from "@/components/auth/SubscriptionGuard";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { RoleRedirect } from "@/components/auth/RoleRedirect";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import TeamLeadDashboard from "./pages/team-lead/TeamLeadDashboard";
import CleanerDashboard from "./pages/cleaner/CleanerDashboard";
import JobsPage from "./pages/JobsPage";
import CustomersPage from "./pages/CustomersPage";
import TeamsPage from "./pages/TeamsPage";
import EvidencePage from "./pages/EvidencePage";
import DisputesPage from "./pages/DisputesPage";
import TimesheetsPage from "./pages/TimesheetsPage";
import SettingsPage from "./pages/SettingsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import RouteOptimizerPage from "./pages/RouteOptimizerPage";
import DailyRoutesPage from "./pages/DailyRoutesPage";
import WaitlistPage from "./pages/WaitlistPage";
import MarketplacePage from "./pages/MarketplacePage";
import PricingEnginePage from "./pages/PricingEnginePage";
import SupabaseTest from "./pages/SupabaseTest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/supabase-test" element={<SupabaseTest />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Role-based redirect at /dashboard */}
              <Route index element={<RoleRedirect />} />

              {/* Role-specific dashboards */}
              <Route path="owner" element={
                <RoleGuard allowedRoles={["owner"]}>
                  <OwnerDashboard />
                </RoleGuard>
              } />
              <Route path="admin" element={
                <RoleGuard allowedRoles={["owner", "admin"]}>
                  <Dashboard />
                </RoleGuard>
              } />
              <Route path="manager" element={
                <RoleGuard allowedRoles={["owner", "admin", "manager"]}>
                  <ManagerDashboard />
                </RoleGuard>
              } />
              <Route path="team-lead" element={
                <RoleGuard allowedRoles={["owner", "admin", "manager", "team_lead"]}>
                  <TeamLeadDashboard />
                </RoleGuard>
              } />
              <Route path="cleaner" element={
                <RoleGuard allowedRoles={["owner", "admin", "manager", "team_lead", "cleaner"]}>
                  <CleanerDashboard />
                </RoleGuard>
              } />

              {/* CORE (Basic) — admin+ */}
              <Route path="jobs" element={
                <RoleGuard allowedRoles={["owner", "admin", "manager", "team_lead", "cleaner"]}>
                  <JobsPage />
                </RoleGuard>
              } />
              <Route path="jobs/new" element={
                <RoleGuard allowedRoles={["owner", "admin", "manager"]}>
                  <JobsPage />
                </RoleGuard>
              } />
              <Route path="customers" element={
                <RoleGuard allowedRoles={["owner", "admin", "manager"]}>
                  <CustomersPage />
                </RoleGuard>
              } />
              <Route path="customers/new" element={
                <RoleGuard allowedRoles={["owner", "admin", "manager"]}>
                  <CustomersPage />
                </RoleGuard>
              } />
              <Route path="teams" element={
                <RoleGuard allowedRoles={["owner", "admin", "manager"]}>
                  <TeamsPage />
                </RoleGuard>
              } />
              <Route path="settings" element={
                <RoleGuard allowedRoles={["owner", "admin"]}>
                  <SettingsPage />
                </RoleGuard>
              } />

              {/* SHIELD */}
              <Route path="shield/evidence" element={
                <SubscriptionGuard requiredModule="shield">
                  <EvidencePage />
                </SubscriptionGuard>
              } />
              <Route path="shield/disputes" element={
                <RoleGuard allowedRoles={["owner", "admin", "manager"]}>
                  <SubscriptionGuard requiredModule="shield">
                    <DisputesPage />
                  </SubscriptionGuard>
                </RoleGuard>
              } />
              <Route path="shield/timesheets" element={
                <SubscriptionGuard requiredModule="shield">
                  <TimesheetsPage />
                </SubscriptionGuard>
              } />

              {/* ROUTE (Pro) */}
              <Route path="route/optimizer" element={
                <RoleGuard allowedRoles={["owner", "admin", "manager"]}>
                  <SubscriptionGuard requiredTier="pro" requiredModule="route">
                    <RouteOptimizerPage />
                  </SubscriptionGuard>
                </RoleGuard>
              } />
              <Route path="route/daily" element={
                <RoleGuard allowedRoles={["owner", "admin", "manager", "team_lead"]}>
                  <SubscriptionGuard requiredTier="pro" requiredModule="route">
                    <DailyRoutesPage />
                  </SubscriptionGuard>
                </RoleGuard>
              } />

              {/* FILL (Pro) */}
              <Route path="fill/waitlist" element={
                <RoleGuard allowedRoles={["owner", "admin", "manager"]}>
                  <SubscriptionGuard requiredTier="pro" requiredModule="fill">
                    <WaitlistPage />
                  </SubscriptionGuard>
                </RoleGuard>
              } />
              <Route path="fill/marketplace" element={
                <RoleGuard allowedRoles={["owner", "admin", "manager"]}>
                  <SubscriptionGuard requiredTier="pro" requiredModule="fill">
                    <MarketplacePage />
                  </SubscriptionGuard>
                </RoleGuard>
              } />
              <Route path="fill/pricing" element={
                <RoleGuard allowedRoles={["owner", "admin"]}>
                  <SubscriptionGuard requiredTier="pro" requiredModule="fill">
                    <PricingEnginePage />
                  </SubscriptionGuard>
                </RoleGuard>
              } />

              {/* ANALYTICS (Pro) */}
              <Route path="analytics" element={
                <RoleGuard allowedRoles={["owner", "admin", "manager"]}>
                  <SubscriptionGuard requiredTier="pro">
                    <AnalyticsPage />
                  </SubscriptionGuard>
                </RoleGuard>
              } />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
