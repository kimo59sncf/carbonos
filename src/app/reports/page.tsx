'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Download,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Leaf,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { downloadReport } from '@/lib/report-generator';

export default function ReportsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, isLoading, router]);

  // Gestionnaire pour le rapport CSRD avec logs de débogage
  const handleCSRDReport = () => {
    console.log('🔍 [DEBUG] Bouton Rapport CSRD cliqué');
    console.log('🔍 [DEBUG] Génération du rapport CSRD...');

    try {
      const reportData = {
        title: 'Rapport CSRD 2024',
        type: 'CSRD',
        companyName: 'Entreprise Demo',
        period: '2024',
        generatedAt: new Date().toISOString(),
        sections: [],
        totals: {
          scope1: 150.5,
          scope2: 89.2,
          scope3: 234.8,
          total: 474.5
        }
      };

      console.log('🔍 [DEBUG] Données du rapport CSRD:', reportData);
      downloadReport(reportData, 'csrd');
      console.log('✅ [DEBUG] Rapport CSRD généré avec succès');
    } catch (error) {
      console.error('❌ [DEBUG] Erreur lors de la génération du rapport CSRD:', error);
    }
  };

  // Gestionnaire pour le bilan BEGES avec logs de débogage
  const handleBEGESReport = () => {
    console.log('🔍 [DEBUG] Bouton Bilan BEGES cliqué');
    console.log('🔍 [DEBUG] Génération du bilan BEGES...');

    try {
      const reportData = {
        title: 'Bilan BEGES 2024',
        type: 'BEGES',
        companyName: 'Entreprise Demo',
        period: '2024',
        generatedAt: new Date().toISOString(),
        sections: [],
        totals: {
          scope1: 145.3,
          scope2: 92.1,
          scope3: 267.4,
          total: 504.8
        }
      };

      console.log('🔍 [DEBUG] Données du rapport BEGES:', reportData);
      downloadReport(reportData, 'beges');
      console.log('✅ [DEBUG] Bilan BEGES généré avec succès');
    } catch (error) {
      console.error('❌ [DEBUG] Erreur lors de la génération du bilan BEGES:', error);
    }
  };

  // Gestionnaire pour le rapport interne avec logs de débogage
  const handleInternalReport = () => {
    console.log('🔍 [DEBUG] Bouton Rapport interne cliqué');
    console.log('🔍 [DEBUG] Génération du rapport interne...');

    try {
      const reportData = {
        title: 'Rapport Interne Q4 2024',
        type: 'Interne',
        companyName: 'Entreprise Demo',
        period: 'Q4 2024',
        generatedAt: new Date().toISOString(),
        sections: [],
        totals: {
          scope1: 142.7,
          scope2: 88.9,
          scope3: 298.3,
          total: 529.9
        }
      };

      console.log('🔍 [DEBUG] Données du rapport interne:', reportData);
      downloadReport(reportData, 'internal');
      console.log('✅ [DEBUG] Rapport interne généré avec succès');
    } catch (error) {
      console.error('❌ [DEBUG] Erreur lors de la génération du rapport interne:', error);
    }
  };

  // Gestionnaire pour le rapport personnalisé avec logs de débogage
  const handleCustomReport = () => {
    console.log('🔍 [DEBUG] Bouton Rapport personnalisé cliqué');
    console.log('🔍 [DEBUG] Génération du rapport personnalisé...');

    try {
      const reportData = {
        title: 'Rapport Personnalisé - Analyse Environnementale',
        type: 'Personnalisé',
        companyName: 'Entreprise Demo',
        period: '2024',
        generatedAt: new Date().toISOString(),
        sections: [
          {
            title: 'Analyse des émissions',
            description: 'Analyse détaillée des émissions de CO2 par scope',
            type: 'emissions'
          }
        ],
        totals: {
          scope1: 148.2,
          scope2: 91.5,
          scope3: 245.7,
          total: 485.4
        }
      };

      console.log('🔍 [DEBUG] Données du rapport personnalisé:', reportData);
      downloadReport(reportData, 'custom');
      console.log('✅ [DEBUG] Rapport personnalisé généré avec succès');
    } catch (error) {
      console.error('❌ [DEBUG] Erreur lors de la génération du rapport personnalisé:', error);
    }
  };

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

  const reports = [
    {
      id: 1,
      name: 'Rapport CSRD 2024',
      type: 'CSRD',
      status: 'completed',
      date: '2024-01-15',
      description: 'Rapport de durabilité conforme CSRD'
    },
    {
      id: 2,
      name: 'Bilan BEGES 2023',
      type: 'BEGES',
      status: 'completed',
      date: '2023-12-31',
      description: 'Bilan des émissions de gaz à effet de serre'
    },
    {
      id: 3,
      name: 'Rapport Trimestriel Q4',
      type: 'Interne',
      status: 'pending',
      date: '2024-01-31',
      description: 'Rapport interne du quatrième trimestre'
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
                  Rapports
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Génération et gestion des rapports de conformité
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800">
                <FileText className="h-4 w-4" />
                Nouveau rapport
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des rapports */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Rapports disponibles
                </CardTitle>
                <CardDescription>
                  Tous vos rapports de conformité et internes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        report.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                          : 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                      }`}>
                        {report.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Clock className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{report.name}</p>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{report.type}</Badge>
                          <span className="text-xs text-muted-foreground">{report.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={report.status === 'completed' ? 'default' : 'secondary'}>
                        {report.status === 'completed' ? 'Terminé' : 'En attente'}
                      </Badge>
                      {report.status === 'completed' && (
                        <Button size="sm" variant="outline" className="gap-2">
                          <Download className="h-4 w-4" />
                          Télécharger
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Actions rapides */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  Actions rapides
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleCSRDReport}
                  className="w-full justify-start gap-3 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <FileText className="h-5 w-5" />
                  <span className="font-medium">Rapport CSRD</span>
                </Button>

                <Button
                  onClick={handleBEGESReport}
                  className="w-full justify-start gap-3 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-medium">Bilan BEGES</span>
                </Button>

                <Button
                  onClick={handleInternalReport}
                  className="w-full justify-start gap-3 h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Download className="h-5 w-5" />
                  <span className="font-medium">Rapport interne</span>
                </Button>

                <Button
                  onClick={handleCustomReport}
                  className="w-full justify-start gap-3 h-12 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Calendar className="h-5 w-5" />
                  <span className="font-medium">Rapport personnalisé</span>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Échéances à venir
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                  <div>
                    <p className="font-medium text-amber-800 dark:text-amber-200">Rapport CSRD 2024</p>
                    <p className="text-sm text-amber-600 dark:text-amber-400">Échéance: 31 décembre 2024</p>
                  </div>
                  <Badge variant="outline" className="text-amber-700 border-amber-300">
                    Urgent
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-200">Bilan BEGES 2024</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Échéance: 31 décembre 2024</p>
                  </div>
                  <Badge variant="outline" className="text-blue-700 border-blue-300">
                    À planifier
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}