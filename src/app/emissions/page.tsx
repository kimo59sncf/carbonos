'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
   ArrowLeft,
   Plus,
   Save,
   Calculator,
   TrendingUp,
   TrendingDown,
   AlertTriangle,
   CheckCircle,
   Leaf,
   Factory,
   Activity,
   Target,
   Zap
 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function EmissionsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour au dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Gestion des émissions
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Suivi et calcul de vos émissions carbone
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                className="gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                onClick={() => {
                  console.log('Bouton Nouvelle mesure cliqué - Route manquante: /emissions/new');
                  console.log('Tentative de navigation vers une route de création d\'émission');
                  // Pour l'instant, on reste sur la même page et on change d'onglet vers la calculatrice
                  setActiveTab('calculate');
                }}
              >
                <Plus className="h-4 w-4" />
                Nouvelle mesure
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Navigation par onglets */}
        <div className="flex gap-2 mb-8 border-b border-slate-200 dark:border-slate-700">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: Activity },
            { id: 'scope1', label: 'Scope 1', icon: Factory },
            { id: 'scope2', label: 'Scope 2', icon: Activity },
            { id: 'scope3', label: 'Scope 3', icon: Target },
            { id: 'calculate', label: 'Calculatrice', icon: Calculator },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Résumé des émissions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/20 border-l-4 border-l-red-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Factory className="h-5 w-5 text-red-600" />
                    Scope 1 - Directes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">2,450 tCO₂e</div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-red-500" />
                    <span className="text-red-600 font-medium">+2.5% ce mois</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20 border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Scope 2 - Indirectes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">1,230 tCO₂e</div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingDown className="h-4 w-4 text-green-500" />
                    <span className="text-green-600 font-medium">-5.2% ce mois</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/20 border-l-4 border-l-emerald-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-emerald-600" />
                    Scope 3 - Valeur
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">5,670 tCO₂e</div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Émissions de la chaîne de valeur</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions disponibles */}
            <Card>
              <CardHeader>
                <CardTitle>Actions disponibles</CardTitle>
                <CardDescription>Gérez vos données d'émissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    className="h-20 flex-col gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    onClick={() => setActiveTab('scope1')}
                  >
                    <Factory className="h-6 w-6" />
                    <span>Gérer Scope 1</span>
                  </Button>

                  <Button
                    className="h-20 flex-col gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                    onClick={() => setActiveTab('scope2')}
                  >
                    <Activity className="h-6 w-6" />
                    <span>Gérer Scope 2</span>
                  </Button>

                  <Button
                    className="h-20 flex-col gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                    onClick={() => setActiveTab('scope3')}
                  >
                    <Target className="h-6 w-6" />
                    <span>Gérer Scope 3</span>
                  </Button>

                  <Button
                    className="h-20 flex-col gap-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
                    onClick={() => setActiveTab('calculate')}
                  >
                    <Calculator className="h-6 w-6" />
                    <span>Calculatrice</span>
                  </Button>
                </div>

                {/* Actions rapides */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Actions rapides
                  </h3>
                  <QuickActions />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'scope1' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Factory className="h-5 w-5" />
                  Émissions Scope 1 - Directes
                </CardTitle>
                <CardDescription>
                  Émissions directes de sources fixes et mobiles (combustion, procédés industriels)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Scope1Form />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'scope2' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Émissions Scope 2 - Indirectes
              </CardTitle>
              <CardDescription>
                Émissions liées à la consommation d'électricité, chaleur, froid
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <Activity className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  Formulaire de saisie Scope 2
                </h3>
                <p className="text-slate-500 dark:text-slate-500">
                  Fonctionnalité en cours de développement
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'scope3' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Émissions Scope 3 - Chaîne de valeur
              </CardTitle>
              <CardDescription>
                Toutes les autres émissions indirectes de la chaîne de valeur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <Target className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  Formulaire de saisie Scope 3
                </h3>
                <p className="text-slate-500 dark:text-slate-500">
                  Fonctionnalité en cours de développement
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'calculate' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Calculatrice d'émissions
                </CardTitle>
                <CardDescription>
                  Calculez vos émissions à partir de données d'activité avec les facteurs d'émission officiels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmissionCalculator />
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}