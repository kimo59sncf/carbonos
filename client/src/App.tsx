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
import EmergencyPage from "@/pages/emergency-page";

// Pages manquantes à créer
const AnalyticsPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Analytics</h1><p>Page d'analyses en cours de développement</p></div>;
const CollaborativePage = () => <div className="p-6"><h1 className="text-2xl font-bold">Collaboration</h1><p>Page de collaboration en cours de développement</p></div>;
const MyDataPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Mes Données</h1><p>Page de gestion des données personnelles en cours de développement</p></div>;
const SettingsPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Paramètres</h1><p>Page de paramètres en cours de développement</p></div>;
const HelpPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Aide</h1><p>Page d'aide en cours de développement</p></div>;

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={() => <DashboardPage />} />
      <ProtectedRoute path="/analytics" component={() => <AnalyticsPage />} />
      <ProtectedRoute path="/collaborative" component={() => <CollaborativePage />} />
      <ProtectedRoute path="/emissions" component={() => <EmissionsPage />} />
      <ProtectedRoute path="/reports" component={() => <ReportsPage />} />
      <ProtectedRoute path="/company" component={() => <CompanyPage />} />
      <ProtectedRoute path="/my-data" component={() => <MyDataPage />} />
      <ProtectedRoute path="/settings" component={() => <SettingsPage />} />
      <ProtectedRoute path="/help" component={() => <HelpPage />} />
      <ProtectedRoute path="/rgpd" component={() => <RgpdPage />} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/direct-access" component={() => {
        // Définir l'utilisateur comme connecté dans localStorage
        localStorage.setItem('carbonos_user', 'demo');
        // Rediriger vers la page d'accueil
        window.location.href = "/";
        return <div>Redirection en cours...</div>;
      }} />
      <Route path="/emergency" component={EmergencyPage} />
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
