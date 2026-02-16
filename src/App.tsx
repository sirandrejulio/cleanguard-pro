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
              {/* Placeholder routes for future pages */}
              <Route path="jobs" element={<Dashboard />} />
              <Route path="jobs/new" element={<Dashboard />} />
              <Route path="customers" element={<Dashboard />} />
              <Route path="customers/new" element={<Dashboard />} />
              <Route path="teams" element={<Dashboard />} />
              <Route path="shield/evidence" element={<Dashboard />} />
              <Route path="shield/disputes" element={<Dashboard />} />
              <Route path="shield/timesheets" element={<Dashboard />} />
              <Route path="route/optimizer" element={<Dashboard />} />
              <Route path="route/daily" element={<Dashboard />} />
              <Route path="fill/waitlist" element={<Dashboard />} />
              <Route path="fill/marketplace" element={<Dashboard />} />
              <Route path="fill/pricing" element={<Dashboard />} />
              <Route path="analytics" element={<Dashboard />} />
              <Route path="settings" element={<Dashboard />} />
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
