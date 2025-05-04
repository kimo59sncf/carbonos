import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { queryClient } from "@/lib/queryClient";
import AppLayout from "@/components/layout/app-layout";
import EmissionSummary from "@/components/dashboard/emission-summary";
import EmissionsChart from "@/components/dashboard/emissions-chart";
import EmissionsBreakdown from "@/components/dashboard/emissions-breakdown";
import ActionCards from "@/components/dashboard/action-cards";
import BenchmarkTable from "@/components/dashboard/benchmark-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function EmergencyPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Fonction pour récupérer les données directement, sans passer par React Query
  async function fetchDashboardData() {
    try {
      console.log("Fetching dashboard data directly in emergency mode");
      setIsLoading(true);
      const response = await fetch('/api/dashboard-direct?username=demo');
      
      if (!response.ok) {
        throw new Error(`Erreur réseau: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Emergency mode dashboard data:", data);
      setDashboardData(data);
      
      // Stocker également dans React Query pour compatibilité avec d'autres composants
      queryClient.setQueryData(["/api/dashboard"], data);
    } catch (err: any) {
      console.error("Error in emergency mode:", err);
      setError(err.message || "Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  }

  // Charger les données au montage du composant
  useEffect(() => {
    // Établir l'utilisateur de secours dans localStorage
    localStorage.setItem('carbonos_user', 'demo');
    localStorage.setItem('carbonos_user_data', JSON.stringify({
      id: 1,
      username: 'demo',
      firstName: 'Utilisateur',
      lastName: 'Démo',
      email: 'demo@example.com',
      role: 'user',
      companyId: 1
    }));
    
    // Charger les données
    fetchDashboardData();
  }, []);

  // Préparer les données pour les graphiques
  const chartData = dashboardData?.emissionTrend?.map((item: any) => ({
    name: item.period,
    scope1: item.scope1,
    scope2: item.scope2,
    scope3: item.scope3,
    total: item.total
  })) || [];

  const benchmarkSectors = [
    "Industrie manufacturière",
    "Services",
    "Commerce",
    "Transport et logistique",
    "Construction"
  ];

  const dummyComplianceItems = [
    { title: "Consentements utilisateurs", status: true },
    { title: "Registre des traitements", status: true },
    { title: "Procédure de violation", status: true },
    { title: "Analyse d'impact (PIA)", status: false }
  ];

  const dummyDeadlines = [
    {
      name: "BEGES",
      description: "Bilan d'Émissions de Gaz à Effet de Serre",
      dueDate: "2023-12-31",
      status: "pending" as const
    },
    {
      name: "CSRD",
      description: "Corporate Sustainability Reporting Directive - Rapport 2022",
      dueDate: "2023-05-15",
      status: "completed" as const
    }
  ];

  const dummyActivities = [
    {
      title: "Mise à jour des émissions",
      description: "Utilisateur Démo a mis à jour les données d'émission du mois de mai",
      date: "Aujourd'hui"
    },
    {
      title: "Nouvelle demande",
      description: "Pierre D. a créé une demande de données auprès de 3 fournisseurs",
      date: "Hier"
    }
  ];

  const dummyRecommendations = [
    {
      title: "Réduction potentielle",
      description: "Optimisez vos émissions liées aux déplacements professionnels (12% de votre Scope 3)",
      priority: "high" as const
    },
    {
      title: "Amélioration des données",
      description: "Collectez des données plus précises sur votre chaîne d'approvisionnement",
      priority: "medium" as const
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header spécial mode d'urgence */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <svg className="w-8 h-8 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
          <div>
            <h1 className="text-xl font-bold">CarbonOS</h1>
            <p className="text-xs text-gray-500">Mode d'accès d'urgence</p>
          </div>
        </div>
        <div>
          <Button variant="secondary" size="sm" onClick={() => window.location.href = "/auth"}>
            Retour à la page de connexion
          </Button>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-grow p-4 sm:p-6">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Mode d'urgence activé</AlertTitle>
          <AlertDescription>
            Vous utilisez le mode d'accès d'urgence qui contourne le système d'authentification standard. 
            Ce mode est limité en fonctionnalités et utilise un compte de démonstration.
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="emissions">Émissions</TabsTrigger>
            <TabsTrigger value="reports">Rapports</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            {isLoading ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-[150px] rounded-lg" />
                  ))}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Skeleton className="h-[350px] rounded-lg lg:col-span-2" />
                  <Skeleton className="h-[350px] rounded-lg" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-[250px] rounded-lg" />
                  ))}
                </div>
                
                <Skeleton className="h-[350px] rounded-lg" />
              </div>
            ) : error ? (
              <Card>
                <CardHeader>
                  <CardTitle>Erreur de chargement</CardTitle>
                  <CardDescription>Impossible de récupérer les données</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{error}</p>
                  <Button onClick={fetchDashboardData} className="mt-4">Réessayer</Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {dashboardData?.summary && (
                  <EmissionSummary
                    scope1={dashboardData.summary.scope1}
                    scope2={dashboardData.summary.scope2}
                    scope3={dashboardData.summary.scope3}
                    scope1Change={-8}
                    scope2Change={12}
                    scope3Change={5}
                  />
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <EmissionsChart data={chartData} />
                  
                  {dashboardData?.summary && (
                    <EmissionsBreakdown
                      scope1={dashboardData.summary.scope1}
                      scope2={dashboardData.summary.scope2}
                      scope3={dashboardData.summary.scope3}
                    />
                  )}
                </div>
                
                <ActionCards
                  deadlines={dummyDeadlines}
                  activities={dummyActivities}
                  complianceItems={dummyComplianceItems}
                  recommendations={dummyRecommendations}
                  complianceScore={90}
                />
                
                <BenchmarkTable
                  benchmarks={dashboardData?.benchmarks || []}
                  sectors={benchmarkSectors}
                />
              </>
            )}
          </TabsContent>

          <TabsContent value="emissions">
            <Card>
              <CardHeader>
                <CardTitle>Données d'émissions</CardTitle>
                <CardDescription>
                  Cette fonctionnalité est limitée en mode d'accès d'urgence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Consultez le tableau de bord pour voir les données d'émissions disponibles.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Rapports</CardTitle>
                <CardDescription>
                  Cette fonctionnalité est limitée en mode d'accès d'urgence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Consultez le tableau de bord pour voir les données disponibles.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-4 py-3 text-center text-xs text-gray-500">
        <p>CarbonOS - Mode d'accès d'urgence</p>
        <p>Pour accéder à l'ensemble des fonctionnalités, veuillez vous connecter normalement.</p>
      </footer>
    </div>
  );
}