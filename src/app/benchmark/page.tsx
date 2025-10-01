'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Building,
  Users,
  Activity
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface BenchmarkData {
  indicator: string;
  yourValue: number;
  sectorAverage: number;
  bestInClass: number;
  position: 'top' | 'above' | 'average' | 'below';
  unit: string;
}

export default function BenchmarkPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [selectedSector, setSelectedSector] = useState('technology');
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    // Données de démonstration pour le benchmark
    const demoData: BenchmarkData[] = [
      {
        indicator: 'Émissions Scope 1',
        yourValue: 2450,
        sectorAverage: 3200,
        bestInClass: 1200,
        position: 'above',
        unit: 'tCO₂e'
      },
      {
        indicator: 'Émissions Scope 2',
        yourValue: 1230,
        sectorAverage: 1800,
        bestInClass: 800,
        position: 'above',
        unit: 'tCO₂e'
      },
      {
        indicator: 'Émissions Scope 3',
        yourValue: 5670,
        sectorAverage: 4500,
        bestInClass: 2100,
        position: 'below',
        unit: 'tCO₂e'
      },
      {
        indicator: 'Intensité carbone',
        yourValue: 45.2,
        sectorAverage: 52.8,
        bestInClass: 28.5,
        position: 'above',
        unit: 'tCO₂e/M€'
      },
      {
        indicator: 'Émissions par employé',
        yourValue: 12.3,
        sectorAverage: 15.7,
        bestInClass: 8.1,
        position: 'above',
        unit: 'tCO₂e/employé'
      }
    ];
    setBenchmarkData(demoData);
  }, [selectedSector]);

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

  const getPositionBadge = (position: string) => {
    switch (position) {
      case 'top':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Top 10%</Badge>;
      case 'above':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Au-dessus</Badge>;
      case 'average':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Moyen</Badge>;
      case 'below':
        return <Badge className="bg-red-100 text-red-800 border-red-200">En-dessous</Badge>;
      default:
        return <Badge variant="secondary">Non classé</Badge>;
    }
  };

  const getPositionIcon = (position: string) => {
    switch (position) {
      case 'top':
      case 'above':
        return <TrendingUp className="h-4 w-4 text-emerald-600" />;
      case 'below':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Target className="h-4 w-4 text-slate-600" />;
    }
  };

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
                  Benchmark sectoriel
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Comparez vos performances carbone avec votre secteur
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technologie</SelectItem>
                  <SelectItem value="manufacturing">Industrie</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="retail">Commerce</SelectItem>
                  <SelectItem value="energy">Énergie</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Résumé du benchmark */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/20 border-l-4 border-l-emerald-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-emerald-600" />
                Position globale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Top 25%</div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <span className="text-emerald-600 font-medium">Meilleur que 75% du secteur</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20 border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-600" />
                Secteur de référence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-slate-900 dark:text-white mb-2 capitalize">
                {selectedSector === 'technology' ? 'Technologie' :
                 selectedSector === 'manufacturing' ? 'Industrie' :
                 selectedSector === 'services' ? 'Services' :
                 selectedSector === 'retail' ? 'Commerce' : 'Énergie'}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Comparaison avec 1,247 entreprises similaires
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/20 border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Potentiel d'amélioration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">-18%</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Potentiel de réduction vs moyenne secteur
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Détail des indicateurs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Comparaison détaillée des indicateurs
            </CardTitle>
            <CardDescription>
              Analyse comparative de vos émissions avec les références sectorielles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {benchmarkData.map((item, index) => (
                <div key={index} className="border-b border-slate-200 dark:border-slate-700 last:border-0 pb-6 last:pb-0">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {item.indicator}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Comparaison avec {selectedSector}
                      </p>
                    </div>
                    {getPositionBadge(item.position)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                          {item.yourValue.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Votre performance
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                        <Target className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                          {item.sectorAverage.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Moyenne secteur
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                        <Award className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                          {item.bestInClass.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Meilleure performance
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    {getPositionIcon(item.position)}
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {item.position === 'above' && "Vous êtes au-dessus de la moyenne sectorielle"}
                      {item.position === 'below' && "Vous êtes en-dessous de la moyenne sectorielle"}
                      {item.position === 'top' && "Performance exceptionnelle dans le top 10%"}
                      {item.position === 'average' && "Performance alignée avec la moyenne sectorielle"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommandations */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Recommandations d'amélioration
            </CardTitle>
            <CardDescription>
              Actions prioritaires pour améliorer votre performance carbone
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-white">Priorité haute</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-200">Réduire les émissions Scope 3</p>
                      <p className="text-sm text-red-600 dark:text-red-400">
                        Focus sur la chaîne d'approvisionnement et les déplacements
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-orange-800 dark:text-orange-200">Optimiser la consommation énergétique</p>
                      <p className="text-sm text-orange-600 dark:text-orange-400">
                        Passage aux énergies renouvelables recommandé
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-white">Priorité moyenne</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-blue-800 dark:text-blue-200">Améliorer la gestion des déchets</p>
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        Programme de recyclage et valorisation
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-emerald-800 dark:text-emerald-200">Former les équipes</p>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400">
                        Sensibilisation aux enjeux carbone
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}