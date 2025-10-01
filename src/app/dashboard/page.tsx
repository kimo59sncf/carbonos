'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  LogOut,
  Settings,
  Activity,
  Target,
  Calculator,
  Download,
  Bell,
  Search,
  Plus,
  Leaf,
  Factory,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface DashboardData {
  summary?: {
    scope1: number;
    scope2: number;
    scope3: number;
    total: number;
  };
  emissionTrend?: Array<{
    year: number;
    period: string;
    scope1: number;
    scope2: number;
    scope3: number;
    total: number;
  }>;
  deadlines?: Array<{
    name: string;
    description: string;
    dueDate: string;
    status: string;
  }>;
  benchmarks?: Array<{
    indicator: string;
    value: string;
    average: string;
    position: string;
  }>;
}

export default function DashboardPage() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Essaie d'abord l'API authentifiée
      try {
        const response = await fetch('/api/dashboard', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
          return;
        }
      } catch (authError) {
        console.log('API authentifiée non disponible, tentative avec API directe');
      }

      // Fallback vers l'API directe du backend
      const directResponse = await fetch(`http://localhost:5000/api/dashboard-direct?username=${user?.email || 'demo'}`);
      if (directResponse.ok) {
        const data = await directResponse.json();
        setDashboardData(data);
      } else {
        throw new Error('Impossible de récupérer les données du dashboard');
      }
    } catch (err) {
      console.error('Erreur lors du chargement du dashboard:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Navigation avec logs pour le debug
  const handleNavigationDebug = (route: string) => {
    console.log(`✅ Navigation vers: ${route} - Route maintenant disponible`);
    router.push(route);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Chargement de CarbonOS...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Données par défaut si aucune donnée n'est disponible
  const defaultSummary = {
    scope1: 2450,
    scope2: 1230,
    scope3: 5670,
    total: 9350
  };

  const summary = dashboardData?.summary || defaultSummary;
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header moderne et élégant */}
      <header className="border-b border-slate-200/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Leaf className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    CarbonOS
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Plateforme de gestion carbone</p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-3">
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 transition-colors">
                  <CheckCircle className="w-3 h-3 mr-2" />
                  Système opérationnel
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 transition-colors">
                  <Activity className="w-3 h-3 mr-2" />
                  Données en temps réel
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Connecté en tant que {user?.firstName}
                </span>
              </div>

              <Button
                variant="outline"
                className="gap-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                onClick={() => router.push('/settings')}
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Paramètres</span>
              </Button>

              <Button
                variant="outline"
                className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content fonctionnel */}
      <main className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h2 className="text-4xl font-bold tracking-tight mb-2">
                Tableau de bord
                <span className="text-primary"> CarbonOS</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Gestion et suivi de vos émissions carbone
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Input
                  placeholder="Rechercher..."
                  className="w-64"
                />
              </div>

              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nouvelle mesure
              </Button>
            </div>
          </div>
        </div>

        {/* KPIs Cards modernes et fonctionnelles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/20 border-l-4 border-l-red-500">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500/10 to-transparent rounded-bl-full"></div>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Factory className="h-5 w-5 text-red-600" />
                Émissions Scope 1
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">{summary.scope1.toLocaleString()}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-3">tCO₂e</div>
              <div className="flex items-center gap-2 text-sm mb-3">
                <TrendingUp className="h-4 w-4 text-red-500" />
                <span className="text-red-600 font-medium">+2.5% ce mois</span>
              </div>
              <Progress value={75} className="mt-3 h-3 bg-red-100 dark:bg-red-900/30" />
              <Button
                size="sm"
                className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                onClick={() => router.push('/emissions?scope=1')}
              >
                Voir détails
              </Button>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20 border-l-4 border-l-blue-500">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full"></div>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Émissions Scope 2
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">{summary.scope2.toLocaleString()}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-3">tCO₂e</div>
              <div className="flex items-center gap-2 text-sm mb-3">
                <TrendingDown className="h-4 w-4 text-green-500" />
                <span className="text-green-600 font-medium">-5.2% ce mois</span>
              </div>
              <Progress value={45} className="mt-3 h-3 bg-blue-100 dark:bg-blue-900/30" />
              <Button
                size="sm"
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                onClick={() => router.push('/emissions?scope=2')}
              >
                Voir détails
              </Button>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/20 border-l-4 border-l-emerald-500">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full"></div>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Target className="h-5 w-5 text-emerald-600" />
                Émissions Scope 3
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">{summary.scope3.toLocaleString()}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-3">tCO₂e</div>
              <div className="flex items-center gap-2 text-sm mb-3">
                <span className="text-slate-600 dark:text-slate-400">Émissions indirectes</span>
              </div>
              <Progress value={60} className="mt-3 h-3 bg-emerald-100 dark:bg-emerald-900/30" />
              <Button
                size="sm"
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                onClick={() => router.push('/emissions?scope=3')}
              >
                Voir détails
              </Button>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/20 border-l-4 border-l-purple-500">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full"></div>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-600" />
                Total émissions
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">{summary.total.toLocaleString()}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-3">tCO₂e</div>
              <div className="flex items-center gap-2 text-sm mb-3">
                <span className="text-slate-600 dark:text-slate-400">Empreinte totale</span>
              </div>
              <Progress value={100} className="mt-3 h-3 bg-purple-100 dark:bg-purple-900/30" />
              <Button
                size="sm"
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                onClick={() => router.push('/reports')}
              >
                Générer rapport
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Section d'actions modernes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                Actions rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full justify-start gap-3 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => handleNavigationDebug('/emissions/new')}
              >
                <Calculator className="h-5 w-5" />
                <span className="font-medium">Calculer empreinte</span>
              </Button>

              <Button
                className="w-full justify-start gap-3 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => handleNavigationDebug('/reports/new')}
              >
                <Download className="h-5 w-5" />
                <span className="font-medium">Générer rapport</span>
              </Button>

              <Button
                className="w-full justify-start gap-3 h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => router.push('/alerts')}
              >
                <Bell className="h-5 w-5" />
                <span className="font-medium">Voir alertes</span>
              </Button>

              <Button
                className="w-full justify-start gap-3 h-12 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => handleNavigationDebug('/benchmark')}
              >
                <Target className="h-5 w-5" />
                <span className="font-medium">Comparer secteur</span>
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                Informations du compte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/50">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Leaf className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xl font-bold text-slate-800 dark:text-slate-200">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">{user?.email}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                      Membre depuis {new Date().getFullYear()}
                    </p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 px-3 py-1">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Actif
                  </Badge>
                </div>

                {error && (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                    <AlertTriangle className="h-6 w-6 text-amber-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-amber-800 dark:text-amber-200">Mode de secours activé</p>
                      <p className="text-sm text-amber-600 dark:text-amber-400">
                        Certaines fonctionnalités utilisent des données de démonstration
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-12 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                    onClick={() => handleNavigationDebug('/profile')}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Mon profil
                  </Button>

                  <Button
                    variant="outline"
                    className="h-12 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                    onClick={() => handleNavigationDebug('/help')}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Aide
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Échéances réglementaires */}
        {dashboardData?.deadlines && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Échéances réglementaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.deadlines.map((deadline, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">{deadline.name}</p>
                      <p className="text-sm text-muted-foreground">{deadline.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{deadline.dueDate}</p>
                      <Badge variant={deadline.status === 'completed' ? 'default' : 'secondary'}>
                        {deadline.status === 'completed' ? 'Terminé' : 'En attente'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}