import { lazy, Suspense } from "react";
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
import { Loader2 } from "lucide-react";

// Lazy-loaded pages para otimização de bundle
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const OwnerDashboard = lazy(() => import("./pages/owner/OwnerDashboard"));
const ManagerDashboard = lazy(() => import("./pages/manager/ManagerDashboard"));
const TeamLeadDashboard = lazy(() => import("./pages/team-lead/TeamLeadDashboard"));
const CleanerDashboard = lazy(() => import("./pages/cleaner/CleanerDashboard"));
const JobsPage = lazy(() => import("./pages/JobsPage"));
const CustomersPage = lazy(() => import("./pages/CustomersPage"));
const TeamsPage = lazy(() => import("./pages/TeamsPage"));
const EvidencePage = lazy(() => import("./pages/EvidencePage"));
const DisputesPage = lazy(() => import("./pages/DisputesPage"));
const TimesheetsPage = lazy(() => import("./pages/TimesheetsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const RouteOptimizerPage = lazy(() => import("./pages/RouteOptimizerPage"));
const DailyRoutesPage = lazy(() => import("./pages/DailyRoutesPage"));
const WaitlistPage = lazy(() => import("./pages/WaitlistPage"));
const MarketplacePage = lazy(() => import("./pages/MarketplacePage"));
const PricingEnginePage = lazy(() => import("./pages/PricingEnginePage"));
const SupabaseTest = lazy(() => import("./pages/SupabaseTest"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Fallback de carregamento global
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
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
                <Route index element={<RoleRedirect />} />

                {/* Role-specific dashboards */}
                <Route path="owner" element={<RoleGuard allowedRoles={["owner"]}><OwnerDashboard /></RoleGuard>} />
                <Route path="admin" element={<RoleGuard allowedRoles={["owner", "admin"]}><Dashboard /></RoleGuard>} />
                <Route path="manager" element={<RoleGuard allowedRoles={["owner", "admin", "manager"]}><ManagerDashboard /></RoleGuard>} />
                <Route path="team-lead" element={<RoleGuard allowedRoles={["owner", "admin", "manager", "team_lead"]}><TeamLeadDashboard /></RoleGuard>} />
                <Route path="cleaner" element={<RoleGuard allowedRoles={["owner", "admin", "manager", "team_lead", "cleaner"]}><CleanerDashboard /></RoleGuard>} />

                {/* CORE */}
                <Route path="jobs" element={<RoleGuard allowedRoles={["owner", "admin", "manager", "team_lead", "cleaner"]}><JobsPage /></RoleGuard>} />
                <Route path="jobs/new" element={<RoleGuard allowedRoles={["owner", "admin", "manager"]}><JobsPage /></RoleGuard>} />
                <Route path="customers" element={<RoleGuard allowedRoles={["owner", "admin", "manager"]}><CustomersPage /></RoleGuard>} />
                <Route path="customers/new" element={<RoleGuard allowedRoles={["owner", "admin", "manager"]}><CustomersPage /></RoleGuard>} />
                <Route path="teams" element={<RoleGuard allowedRoles={["owner", "admin", "manager"]}><TeamsPage /></RoleGuard>} />
                <Route path="settings" element={<RoleGuard allowedRoles={["owner", "admin"]}><SettingsPage /></RoleGuard>} />

                {/* SHIELD */}
                <Route path="shield/evidence" element={<SubscriptionGuard requiredModule="shield"><EvidencePage /></SubscriptionGuard>} />
                <Route path="shield/disputes" element={<RoleGuard allowedRoles={["owner", "admin", "manager"]}><SubscriptionGuard requiredModule="shield"><DisputesPage /></SubscriptionGuard></RoleGuard>} />
                <Route path="shield/timesheets" element={<SubscriptionGuard requiredModule="shield"><TimesheetsPage /></SubscriptionGuard>} />

                {/* ROUTE */}
                <Route path="route/optimizer" element={<RoleGuard allowedRoles={["owner", "admin", "manager"]}><SubscriptionGuard requiredTier="pro" requiredModule="route"><RouteOptimizerPage /></SubscriptionGuard></RoleGuard>} />
                <Route path="route/daily" element={<RoleGuard allowedRoles={["owner", "admin", "manager", "team_lead"]}><SubscriptionGuard requiredTier="pro" requiredModule="route"><DailyRoutesPage /></SubscriptionGuard></RoleGuard>} />

                {/* FILL */}
                <Route path="fill/waitlist" element={<RoleGuard allowedRoles={["owner", "admin", "manager"]}><SubscriptionGuard requiredTier="pro" requiredModule="fill"><WaitlistPage /></SubscriptionGuard></RoleGuard>} />
                <Route path="fill/marketplace" element={<RoleGuard allowedRoles={["owner", "admin", "manager"]}><SubscriptionGuard requiredTier="pro" requiredModule="fill"><MarketplacePage /></SubscriptionGuard></RoleGuard>} />
                <Route path="fill/pricing" element={<RoleGuard allowedRoles={["owner", "admin"]}><SubscriptionGuard requiredTier="pro" requiredModule="fill"><PricingEnginePage /></SubscriptionGuard></RoleGuard>} />

                {/* ANALYTICS */}
                <Route path="analytics" element={<RoleGuard allowedRoles={["owner", "admin", "manager"]}><SubscriptionGuard requiredTier="pro"><AnalyticsPage /></SubscriptionGuard></RoleGuard>} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
