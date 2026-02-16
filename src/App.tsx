import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SubscriptionGuard } from "@/components/auth/SubscriptionGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
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
              <Route index element={<Dashboard />} />

              {/* CORE (Basic) */}
              <Route path="jobs" element={<JobsPage />} />
              <Route path="jobs/new" element={<JobsPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="customers/new" element={<CustomersPage />} />
              <Route path="teams" element={<TeamsPage />} />
              <Route path="settings" element={<SettingsPage />} />

              {/* MODULES (Protected) */}

              {/* SHIELD */}
              <Route path="shield/evidence" element={
                <SubscriptionGuard requiredModule="shield">
                  <EvidencePage />
                </SubscriptionGuard>
              } />
              <Route path="shield/disputes" element={
                <SubscriptionGuard requiredModule="shield">
                  <DisputesPage />
                </SubscriptionGuard>
              } />
              <Route path="shield/timesheets" element={
                <SubscriptionGuard requiredModule="shield">
                  <TimesheetsPage />
                </SubscriptionGuard>
              } />

              {/* ROUTE (Pro) */}
              <Route path="route/optimizer" element={
                <SubscriptionGuard requiredTier="pro" requiredModule="route">
                  <RouteOptimizerPage />
                </SubscriptionGuard>
              } />
              <Route path="route/daily" element={
                <SubscriptionGuard requiredTier="pro" requiredModule="route">
                  <DailyRoutesPage />
                </SubscriptionGuard>
              } />

              {/* FILL (Pro) */}
              <Route path="fill/waitlist" element={
                <SubscriptionGuard requiredTier="pro" requiredModule="fill">
                  <WaitlistPage />
                </SubscriptionGuard>
              } />
              <Route path="fill/marketplace" element={
                <SubscriptionGuard requiredTier="pro" requiredModule="fill">
                  <MarketplacePage />
                </SubscriptionGuard>
              } />
              <Route path="fill/pricing" element={
                <SubscriptionGuard requiredTier="pro" requiredModule="fill">
                  <PricingEnginePage />
                </SubscriptionGuard>
              } />

              {/* ANALYTICS (Pro) */}
              <Route path="analytics" element={
                <SubscriptionGuard requiredTier="pro">
                  <AnalyticsPage />
                </SubscriptionGuard>
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
