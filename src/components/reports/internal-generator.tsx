'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  FileText,
  Download,
  CheckCircle,
  TrendingUp,
  Users,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface InternalReportData {
  title: string;
  department: string;
  reportingPeriod: string;
  audience: string;
  includeScope1: boolean;
  includeScope2: boolean;
  includeScope3: boolean;
  includeTrends: boolean;
  includeComparisons: boolean;
  includeForecasts: boolean;
  includeRecommendations: boolean;
  chartTypes: string[];
  format: string;
  frequency: string;
  description: string;
  objectives: string;
  contactPerson: string;
  contactEmail: string;
}

export function InternalGenerator() {
  const [formData, setFormData] = useState<InternalReportData>({
    title: '',
    department: '',
    reportingPeriod: '',
    audience: '',
    includeScope1: true,
    includeScope2: true,
    includeScope3: false,
    includeTrends: true,
    includeComparisons: true,
    includeForecasts: false,
    includeRecommendations: true,
    chartTypes: ['bar', 'line'],
    format: 'pdf',
    frequency: 'monthly',
    description: '',
    objectives: '',
    contactPerson: '',
    contactEmail: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const handleInputChange = (field: keyof InternalReportData, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChartTypeToggle = (chartType: string) => {
    const currentCharts = formData.chartTypes;
    const newCharts = currentCharts.includes(chartType)
      ? currentCharts.filter(c => c !== chartType)
      : [...currentCharts, chartType];

    handleInputChange('chartTypes', newCharts);
  };

  const generateReport = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulation de la génération du rapport
    const steps = [
      'Collecte des données internes',
      'Analyse des tendances',
      'Génération des graphiques',
      'Formatage du document',
      'Finalisation du rapport'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setGenerationProgress((i + 1) * 20);
    }

    setIsGenerating(false);
    setGenerationProgress(100);

    // Ici on pourrait générer le PDF réel
    console.log('Rapport interne généré:', formData);
  };

  const downloadReport = () => {
    const reportData = {
      title: formData.title,
      type: 'Internal',
      companyName: 'Entreprise', // À adapter selon le contexte
      period: formData.reportingPeriod,
      generatedAt: new Date().toISOString(),
      sections: [
        { title: 'Résumé exécutif', type: 'summary', required: true },
        { title: 'Émissions Scope 1', type: 'emissions', required: formData.includeScope1 },
        { title: 'Émissions Scope 2', type: 'emissions', required: formData.includeScope2 },
        { title: 'Émissions Scope 3', type: 'emissions', required: formData.includeScope3 },
        { title: 'Analyse des tendances', type: 'analysis', required: formData.includeTrends },
        { title: 'Comparaisons', type: 'chart', required: formData.includeComparisons },
        { title: 'Prévisions', type: 'forecasts', required: formData.includeForecasts },
        { title: 'Recommandations', type: 'recommendations', required: formData.includeRecommendations }
      ].filter(section => section.required),
      totals: {
        scope1: formData.includeScope1 ? 2450 : 0,
        scope2: formData.includeScope2 ? 1230 : 0,
        scope3: formData.includeScope3 ? 5670 : 0,
        total: 9350
      }
    };

    import('@/lib/report-generator').then(({ downloadReport: generateReport }) => {
      generateReport(reportData, 'internal');
    });
  };

  const chartTypes = [
    { id: 'bar', label: 'Graphiques en barres', icon: BarChart3 },
    { id: 'line', label: 'Graphiques linéaires', icon: TrendingUp },
    { id: 'pie', label: 'Camemberts', icon: PieChart },
    { id: 'area', label: 'Graphiques en aires', icon: Activity }
  ];

  return (
    <div className="space-y-6">
      {/* Informations générales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Informations générales du rapport
          </CardTitle>
          <CardDescription>
            Configuration de base du rapport interne
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du rapport *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Ex: Rapport mensuel des émissions - Département IT"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Département/Service</Label>
              <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le département" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="direction">Direction générale</SelectItem>
                  <SelectItem value="rh">Ressources humaines</SelectItem>
                  <SelectItem value="it">Informatique</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="tous">Tous les départements</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reportingPeriod">Période couverte</Label>
              <Select value={formData.reportingPeriod} onValueChange={(value) => handleInputChange('reportingPeriod', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jan-2024">Janvier 2024</SelectItem>
                  <SelectItem value="q1-2024">Q1 2024</SelectItem>
                  <SelectItem value="h1-2024">S1 2024</SelectItem>
                  <SelectItem value="2024">Année 2024 complète</SelectItem>
                  <SelectItem value="custom">Période personnalisée</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Public cible</Label>
              <Select value={formData.audience} onValueChange={(value) => handleInputChange('audience', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le public" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="direction">Direction</SelectItem>
                  <SelectItem value="managers">Managers</SelectItem>
                  <SelectItem value="equipes">Équipes opérationnelles</SelectItem>
                  <SelectItem value="tous">Tous les employés</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenu du rapport */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Contenu du rapport
          </CardTitle>
          <CardDescription>
            Sélectionnez les sections à inclure dans le rapport interne
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scope1"
                  checked={formData.includeScope1}
                  onCheckedChange={(checked: boolean) => handleInputChange('includeScope1', !!checked)}
                />
                <Label htmlFor="scope1" className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  Émissions Scope 1 (Directes)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scope2"
                  checked={formData.includeScope2}
                  onCheckedChange={(checked: boolean) => handleInputChange('includeScope2', !!checked)}
                />
                <Label htmlFor="scope2" className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  Émissions Scope 2 (Énergie)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scope3"
                  checked={formData.includeScope3}
                  onCheckedChange={(checked: boolean) => handleInputChange('includeScope3', !!checked)}
                />
                <Label htmlFor="scope3" className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  Émissions Scope 3 (Indirectes)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="trends"
                  checked={formData.includeTrends}
                  onCheckedChange={(checked: boolean) => handleInputChange('includeTrends', !!checked)}
                />
                <Label htmlFor="trends" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Analyse des tendances
                </Label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="comparisons"
                  checked={formData.includeComparisons}
                  onCheckedChange={(checked: boolean) => handleInputChange('includeComparisons', !!checked)}
                />
                <Label htmlFor="comparisons" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-orange-500" />
                  Comparaisons inter-départements
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="forecasts"
                  checked={formData.includeForecasts}
                  onCheckedChange={(checked: boolean) => handleInputChange('includeForecasts', !!checked)}
                />
                <Label htmlFor="forecasts" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  Prévisions et objectifs
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recommendations"
                  checked={formData.includeRecommendations}
                  onCheckedChange={(checked: boolean) => handleInputChange('includeRecommendations', !!checked)}
                />
                <Label htmlFor="recommendations" className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-500" />
                  Recommandations d'actions
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Types de graphiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Types de visualisation
          </CardTitle>
          <CardDescription>
            Choisissez les types de graphiques à inclure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {chartTypes.map((chart) => (
              <div key={chart.id} className="flex items-center space-x-2">
                <Checkbox
                  id={chart.id}
                  checked={formData.chartTypes.includes(chart.id)}
                  onCheckedChange={() => handleChartTypeToggle(chart.id)}
                />
                <Label htmlFor={chart.id} className="flex items-center gap-2 text-sm">
                  <chart.icon className="h-4 w-4" />
                  {chart.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration du rapport */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Configuration du rapport
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="format">Format de sortie</Label>
              <Select value={formData.format} onValueChange={(value) => handleInputChange('format', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="powerpoint">PowerPoint</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="word">Word</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Fréquence de publication</Label>
              <Select value={formData.frequency} onValueChange={(value) => handleInputChange('frequency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  <SelectItem value="monthly">Mensuelle</SelectItem>
                  <SelectItem value="quarterly">Trimestrielle</SelectItem>
                  <SelectItem value="annual">Annuelle</SelectItem>
                  <SelectItem value="on-demand">À la demande</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description/Objectif du rapport</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Décrivez l'objectif de ce rapport et son contexte..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objectives">Objectifs visés</Label>
            <Textarea
              id="objectives"
              value={formData.objectives}
              onChange={(e) => handleInputChange('objectives', e.target.value)}
              placeholder="Quels sont les objectifs de ce rapport ? Améliorer la sensibilisation, suivi des objectifs, etc."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Informations de contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Informations de contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Personne référente</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                placeholder="Nom du responsable du rapport"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email de contact</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                placeholder="contact@entreprise.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Génération du rapport */}
      <Card className="bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/20 border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Génération du rapport interne
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Génération du rapport interne...</span>
                <span>{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="w-full" />
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={generateReport}
              disabled={isGenerating || !formData.title}
              className="gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Génération...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Générer le rapport
                </>
              )}
            </Button>

            {generationProgress === 100 && (
              <Button variant="outline" onClick={downloadReport} className="gap-2">
                <Download className="h-4 w-4" />
                Télécharger le rapport
              </Button>
            )}
          </div>

          <div className="text-sm text-slate-600 dark:text-slate-400">
            <p>• Rapport optimisé pour un usage interne avec visuels adaptés</p>
            <p>• Temps de génération estimé : 15-30 secondes</p>
            <p>• Format personnalisable selon les besoins du département</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}