'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function AlertsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

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

  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Risque de dépassement objectif Q4',
      description: 'Les émissions Scope 3 pourraient dépasser l\'objectif fixé pour le quatrième trimestre.',
      date: 'Il y a 2h',
      priority: 'high',
      icon: AlertTriangle,
      color: 'amber'
    },
    {
      id: 2,
      type: 'success',
      title: 'Objectif mensuel atteint',
      description: 'Félicitations ! L\'objectif de réduction des émissions Scope 2 a été atteint ce mois-ci.',
      date: 'Il y a 1j',
      priority: 'medium',
      icon: CheckCircle,
      color: 'emerald'
    },
    {
      id: 3,
      type: 'info',
      title: 'Nouvelle réglementation',
      description: 'Une nouvelle directive européenne sur le reporting carbone entrera en vigueur en janvier 2025.',
      date: 'Il y a 3j',
      priority: 'low',
      icon: Info,
      color: 'blue'
    },
    {
      id: 4,
      type: 'trend',
      title: 'Tendance positive détectée',
      description: 'Amélioration de 3.2% des émissions Scope 1 par rapport au mois précédent.',
      date: 'Il y a 5j',
      priority: 'medium',
      icon: TrendingUp,
      color: 'green'
    }
  ];

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
                  Alertes et notifications
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Surveillance intelligente de vos données carbone
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <Bell className="w-3 h-3 mr-1" />
                4 alertes actives
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Résumé des alertes */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/20 border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">1</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Urgente</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/20 border-l-4 border-l-amber-500">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-amber-600" />
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">2</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Modérée</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20 border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Info className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">1</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Information</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/20 border-l-4 border-l-emerald-500">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">1</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Positive</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Liste des alertes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Alertes récentes
              </CardTitle>
              <CardDescription>
                Notifications et alertes générées par l'IA CarbonOS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                  alert.priority === 'high'
                    ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'
                    : alert.priority === 'medium'
                    ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800'
                    : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                }`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    alert.color === 'amber' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' :
                    alert.color === 'emerald' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' :
                    alert.color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                    'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    <alert.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{alert.title}</p>
                      <Badge variant="outline" className={`text-xs ${
                        alert.priority === 'high' ? 'text-red-700 border-red-300' :
                        alert.priority === 'medium' ? 'text-blue-700 border-blue-300' :
                        'text-slate-700 border-slate-300'
                      }`}>
                        {alert.priority === 'high' ? 'Urgent' : alert.priority === 'medium' ? 'Modéré' : 'Info'}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{alert.description}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">{alert.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {alert.priority === 'high' && (
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                        Agir maintenant
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      Marquer comme lu
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Actions disponibles */}
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                Paramètres des alertes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  className="h-12 justify-start gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Bell className="h-5 w-5" />
                  <span className="font-medium">Configurer les seuils</span>
                </Button>

                <Button
                  className="h-12 justify-start gap-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Fréquence des alertes</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}