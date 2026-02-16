import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
              <Route path="jobs" element={<JobsPage />} />
              <Route path="jobs/new" element={<JobsPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="customers/new" element={<CustomersPage />} />
              <Route path="teams" element={<TeamsPage />} />
              {/* Placeholder routes for future module pages */}
              <Route path="shield/evidence" element={<EvidencePage />} />
              <Route path="shield/disputes" element={<DisputesPage />} />
              <Route path="shield/timesheets" element={<TimesheetsPage />} />
              <Route path="route/optimizer" element={<Dashboard />} />
              <Route path="route/daily" element={<Dashboard />} />
              <Route path="fill/waitlist" element={<Dashboard />} />
              <Route path="fill/marketplace" element={<Dashboard />} />
              <Route path="fill/pricing" element={<Dashboard />} />
              <Route path="analytics" element={<Dashboard />} />
              <Route path="settings" element={<SettingsPage />} />
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
