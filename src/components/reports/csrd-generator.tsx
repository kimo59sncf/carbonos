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
import {
  FileText,
  Download,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  Building,
  Target,
  Calendar,
  Calculator
} from 'lucide-react';

interface CSRDReportData {
  companyName: string;
  reportingYear: string;
  reportingPeriod: string;
  companySize: string;
  sector: string;
  includeScope1: boolean;
  includeScope2: boolean;
  includeScope3: boolean;
  includeEnergy: boolean;
  includeEmissions: boolean;
  includeTargets: boolean;
  includeGovernance: boolean;
  methodology: string;
  verification: string;
  contactPerson: string;
  contactEmail: string;
}

export function CSRDGenerator() {
  const [formData, setFormData] = useState<CSRDReportData>({
    companyName: '',
    reportingYear: new Date().getFullYear().toString(),
    reportingPeriod: '01/01/' + new Date().getFullYear() + ' - 31/12/' + new Date().getFullYear(),
    companySize: '',
    sector: '',
    includeScope1: true,
    includeScope2: true,
    includeScope3: true,
    includeEnergy: true,
    includeEmissions: true,
    includeTargets: true,
    includeGovernance: true,
    methodology: 'GHG Protocol',
    verification: 'none',
    contactPerson: '',
    contactEmail: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const handleInputChange = (field: keyof CSRDReportData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateReport = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulation de la génération du rapport
    const steps = [
      'Collecte des données d\'émissions',
      'Analyse des tendances',
      'Génération des graphiques',
      'Formatage du document',
      'Finalisation du rapport'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGenerationProgress((i + 1) * 20);
    }

    setIsGenerating(false);
    setGenerationProgress(100);

    // Ici on pourrait générer le PDF réel
    console.log('Rapport CSRD généré:', formData);
  };

  const downloadReport = () => {
    const reportData = {
      title: `Rapport CSRD ${formData.companyName} ${formData.reportingYear}`,
      type: 'CSRD',
      companyName: formData.companyName,
      period: formData.reportingPeriod,
      generatedAt: new Date().toISOString(),
      sections: [
        { title: 'Informations entreprise', type: 'info', required: true },
        { title: 'Émissions Scope 1', type: 'emissions', required: formData.includeScope1 },
        { title: 'Émissions Scope 2', type: 'emissions', required: formData.includeScope2 },
        { title: 'Émissions Scope 3', type: 'emissions', required: formData.includeScope3 },
        { title: 'Consommation énergétique', type: 'energy', required: formData.includeEnergy },
        { title: 'Analyse des émissions', type: 'analysis', required: formData.includeEmissions },
        { title: 'Objectifs de réduction', type: 'targets', required: formData.includeTargets },
        { title: 'Gouvernance climatique', type: 'governance', required: formData.includeGovernance }
      ].filter(section => section.required),
      totals: {
        scope1: 2450, // Ces valeurs devraient venir de la base de données
        scope2: 1230,
        scope3: 5670,
        total: 9350
      }
    };

    // Import dynamique pour éviter les problèmes de bundle
    import('@/lib/report-generator').then(({ downloadReport: generateReport }) => {
      generateReport(reportData, 'csrd');
    });
  };

  return (
    <div className="space-y-6">
      {/* Informations de l'entreprise */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Informations de l'entreprise
          </CardTitle>
          <CardDescription>
            Détails requis pour la génération du rapport CSRD
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Nom de l'entreprise *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="Nom de votre entreprise"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reportingYear">Année de reporting *</Label>
              <Select value={formData.reportingYear} onValueChange={(value) => handleInputChange('reportingYear', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companySize">Taille de l'entreprise</Label>
              <Select value={formData.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la taille" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pme">PME (< 250 employés)</SelectItem>
                  <SelectItem value="ete">ETE (250-500 employés)</SelectItem>
                  <SelectItem value="grande">Grande entreprise (> 500 employés)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector">Secteur d'activité</Label>
              <Select value={formData.sector} onValueChange={(value) => handleInputChange('sector', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le secteur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manufacturier">Secteur manufacturier</SelectItem>
                  <SelectItem value="services">Secteur des services</SelectItem>
                  <SelectItem value="energie">Énergie</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="agricole">Secteur agricole</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
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
            Sélectionnez les sections à inclure dans le rapport CSRD
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scope1"
                  checked={formData.includeScope1}
                  onCheckedChange={(checked) => handleInputChange('includeScope1', !!checked)}
                />
                <Label htmlFor="scope1" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-red-500" />
                  Émissions Scope 1 (Directes)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scope2"
                  checked={formData.includeScope2}
                  onCheckedChange={(checked) => handleInputChange('includeScope2', !!checked)}
                />
                <Label htmlFor="scope2" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  Émissions Scope 2 (Énergie)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scope3"
                  checked={formData.includeScope3}
                  onCheckedChange={(checked) => handleInputChange('includeScope3', !!checked)}
                />
                <Label htmlFor="scope3" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  Émissions Scope 3 (Indirectes)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="energy"
                  checked={formData.includeEnergy}
                  onCheckedChange={(checked) => handleInputChange('includeEnergy', !!checked)}
                />
                <Label htmlFor="energy" className="flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-yellow-500" />
                  Consommation énergétique
                </Label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emissions"
                  checked={formData.includeEmissions}
                  onCheckedChange={(checked) => handleInputChange('includeEmissions', !!checked)}
                />
                <Label htmlFor="emissions" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Analyse des émissions
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="targets"
                  checked={formData.includeTargets}
                  onCheckedChange={(checked) => handleInputChange('includeTargets', !!checked)}
                />
                <Label htmlFor="targets" className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-orange-500" />
                  Objectifs de réduction
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="governance"
                  checked={formData.includeGovernance}
                  onCheckedChange={(checked) => handleInputChange('includeGovernance', !!checked)}
                />
                <Label htmlFor="governance" className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-500" />
                  Gouvernance climatique
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Méthodologie et vérification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Méthodologie et vérification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="methodology">Méthodologie utilisée</Label>
              <Select value={formData.methodology} onValueChange={(value) => handleInputChange('methodology', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GHG Protocol">GHG Protocol</SelectItem>
                  <SelectItem value="ISO 14064">ISO 14064</SelectItem>
                  <SelectItem value="Bilan Carbone">Méthode Bilan Carbone®</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verification">Vérification externe</Label>
              <Select value={formData.verification} onValueChange={(value) => handleInputChange('verification', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune vérification</SelectItem>
                  <SelectItem value="limited">Vérification limitée</SelectItem>
                  <SelectItem value="reasonable">Vérification raisonnable</SelectItem>
                  <SelectItem value="planned">Prévue pour l'année prochaine</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
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
              <Label htmlFor="contactPerson">Personne de contact</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                placeholder="Nom du responsable RSE/climat"
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

      {/* Actions de génération */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20 border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Génération du rapport CSRD
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Génération en cours...</span>
                <span>{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="w-full" />
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={generateReport}
              disabled={isGenerating || !formData.companyName}
              className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
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
            <p>• Le rapport sera généré au format PDF conforme aux exigences CSRD</p>
            <p>• Temps de génération estimé : 30-60 secondes</p>
            <p>• Le rapport inclura automatiquement vos données d'émissions des 3 derniers mois</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}