import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import DashboardPage from "@/pages/dashboard-page";
import AuthPage from "@/pages/auth-page";
import EmissionsPage from "@/pages/emissions-page";
import ReportsPage from "@/pages/reports-page";
import CompanyPage from "@/pages/company-page";
import RgpdPage from "@/pages/rgpd-page";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={() => <DashboardPage />} />
      <ProtectedRoute path="/emissions" component={() => <EmissionsPage />} />
      <ProtectedRoute path="/reports" component={() => <ReportsPage />} />
      <ProtectedRoute path="/company" component={() => <CompanyPage />} />
      <ProtectedRoute path="/rgpd" component={() => <RgpdPage />} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
